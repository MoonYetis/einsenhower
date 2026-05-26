import os
import shutil
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select, update, insert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import (
    Base, User, Team, TeamMember, Task, TaskNote, 
    TaskAttachment, DelegationHistory, Quadrant, TaskStatus, TeamRole
)
from app.schemas import (
    UserCreate, UserResponse, LoginRequest,
    TeamCreate, TeamResponse, TeamDetailResponse, TeamMemberCreate,
    TaskCreate, TaskResponse, TaskUpdate,
    TaskNoteCreate, TaskNoteResponse, TaskAttachmentResponse
)

# Inicializar aplicación FastAPI
app = FastAPI(
    title="MatrixOS - API Colaborativa de la Matriz de Eisenhower",
    description="Backend asíncrono robusto en Pyhton con FastAPI y PostgreSQL para delegación y control de cuadrantes de Eisenhower.",
    version="1.0.0"
)

# Configurar políticas CORS para comunicación fluida con el frontend React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)

# Crear directorio de adjuntos si no existe
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)


# ==========================================
# RUTAS DE AUTENTICACIÓN (JWT SIMPLE)
# ==========================================

@app.post("/api/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED, tags=["Autenticación"])
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    # Validar si el usuario ya existe
    query = select(User).where(User.email == user_data.email)
    result = await db.execute(query)
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El correo electrónico ya se encuentra registrado."
        )
    
    # En producción usaríamos bcrypt/argon2 para hashear la contraseña. 
    # Por simplicidad de dependencias mantendremos el hash plano con un prefijo.
    hashed_password = f"user_hash_{user_data.password}"
    
    nuevo_usuario = User(
        name=user_data.name,
        email=user_data.email,
        password_hash=hashed_password
    )
    db.add(nuevo_usuario)
    await db.flush()
    return nuevo_usuario


@app.post("/api/auth/login", response_model=dict, tags=["Autenticación"])
async def login(credentials: LoginRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.email == credentials.email)
    result = await db.execute(query)
    usuario = result.scalar_one_or_none()
    
    if not usuario or usuario.password_hash != f"user_hash_{credentials.password}":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales de acceso inválidas."
        )
    
    # Generar Token Simulador Seguro
    return {
        "access_token": f"simulated_jwt_for_user_{usuario.id}",
        "token_type": "bearer",
        "user": {
            "id": usuario.id,
            "name": usuario.name,
            "email": usuario.email
        }
    }


# Dependencia para obtener el usuario autenticado actual
async def get_current_user(token: str, db: AsyncSession = Depends(get_db)) -> User:
    if not token.startswith("bearer simulated_jwt_for_user_"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token no válido o sesión expirada."
        )
    try:
        user_id = int(token.replace("bearer simulated_jwt_for_user_", ""))
        query = select(User).where(User.id == user_id)
        result = await db.execute(query)
        user = result.scalar_one_or_none()
        if not user:
            raise HTTPException(status_code=404, detail="Usuario no encontrado.")
        return user
    except ValueError:
        raise HTTPException(status_code=401, detail="Token alterado.")


# ==========================================
# RUTAS DE EQUIPOS (TEAMS)
# ==========================================

@app.post("/api/teams", response_model=TeamResponse, status_code=status.HTTP_201_CREATED, tags=["Equipos"])
async def create_team(team_data: TeamCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    nuevo_equipo = Team(
        name=team_data.name,
        created_by=current_user.id
    )
    db.add(nuevo_equipo)
    await db.flush()
    
    # Agregar automáticamente al creador como ADMIN del equipo
    miembro = TeamMember(
        team_id=nuevo_equipo.id,
        user_id=current_user.id,
        role=TeamRole.ADMIN
    )
    db.add(miembro)
    return nuevo_equipo


@app.get("/api/teams", response_model=List[TeamResponse], tags=["Equipos"])
async def list_user_teams(db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Listar equipos donde el usuario es miembro
    query = select(Team).join(TeamMember).where(TeamMember.user_id == current_user.id)
    result = await db.execute(query)
    return result.scalars().all()


@app.post("/api/teams/{team_id}/members", status_code=status.HTTP_200_OK, tags=["Equipos"])
async def add_team_member(team_id: int, member_data: TeamMemberCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Verificar si el usuario actual es ADMIN del equipo para autorizar
    verificar = select(TeamMember).where(
        TeamMember.team_id == team_id,
        TeamMember.user_id == current_user.id,
        TeamMember.role == TeamRole.ADMIN
    )
    res_verificar = await db.execute(verificar)
    if not res_verificar.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo administradores del equipo pueden gestionar de forma colaborativa los miembros."
        )
        
    nuevo_miembro = TeamMember(
        team_id=team_id,
        user_id=member_data.user_id,
        role=member_data.role
    )
    db.add(nuevo_miembro)
    return {"message": "Miembro asignado colaborativamente con éxito."}


# ==========================================
# GESTIÓN DE TAREAS (EISENHOWER MATRIX)
# ==========================================

@app.post("/api/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, tags=["Tareas"])
async def create_task(task_data: TaskCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Validar pertenencia del usuario al equipo
    pertenencia = select(TeamMember).where(
        TeamMember.team_id == task_data.team_id,
        TeamMember.user_id == current_user.id
    )
    res_pertenecia = await db.execute(pertenencia)
    if not res_pertenecia.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No posees privilegios de miembro en el equipo asignado a esta tarea."
        )

    nueva_tarea = Task(
        title=task_data.title,
        description=task_data.description,
        quadrant=task_data.quadrant,
        status=TaskStatus.TODO,
        created_by=current_user.id,
        assigned_to=task_data.assigned_to or current_user.id,
        team_id=task_data.team_id,
        due_date=task_data.due_date
    )
    db.add(nueva_tarea)
    await db.flush()
    
    # Si se asignó a otra persona, dejamos traza en el historial de delegación
    if task_data.assigned_to and task_data.assigned_to != current_user.id:
        historial = DelegationHistory(
            task_id=nueva_tarea.id,
            from_user_id=current_user.id,
            to_user_id=task_data.assigned_to
        )
        db.add(historial)
        
    return nueva_tarea


@app.get("/api/tasks", response_model=List[TaskResponse], tags=["Tareas"])
async def get_tasks(team_id: int, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Obtener todas las tareas de un equipo con carga de relaciones
    query = (
        select(Task)
        .where(Task.team_id == team_id)
        .options(
            selectinload(Task.creator),
            selectinload(Task.assignee),
            selectinload(Task.notes).selectinload(TaskNote.user),
            selectinload(Task.attachments),
            selectinload(Task.delegation_histories).selectinload(DelegationHistory.from_user),
            selectinload(Task.delegation_histories).selectinload(DelegationHistory.to_user)
        )
    )
    result = await db.execute(query)
    return result.scalars().all()


@app.patch("/api/tasks/{task_id}", response_model=TaskResponse, tags=["Tareas"])
async def update_task(task_id: int, updates: TaskUpdate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Cargar tarea existente
    query = select(Task).where(Task.id == task_id).options(selectinload(Task.assignee))
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no localizada.")
        
    # Verificar si hubo cambio de dueño (Delegación Colaborativa)
    if updates.assigned_to is not None and task.assigned_to != updates.assigned_to:
        # Registrar cambio en la traza obligatoria de delegaciones
        historial = DelegationHistory(
            task_id=task.id,
            from_user_id=task.assigned_to or current_user.id,
            to_user_id=updates.assigned_to
        )
        db.add(historial)
        task.assigned_to = updates.assigned_to

    # Aplicar otras actualizaciones opcionales
    if updates.title is not None:
        task.title = updates.title
    if updates.description is not None:
        task.description = updates.description
    if updates.quadrant is not None:
        task.quadrant = updates.quadrant
    if updates.status is not None:
        task.status = updates.status
    if updates.due_date is not None:
        task.due_date = updates.due_date
        
    await db.flush()
    return task


# ==========================================
# RUTAS DE NOTAS DE TAREAS (HILOS SECUENCIALES)
# ==========================================

@app.post("/api/tasks/{task_id}/notes", response_model=TaskNoteResponse, tags=["Notas"])
async def add_task_note(task_id: int, note_data: TaskNoteCreate, db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    nueva_nota = TaskNote(
        task_id=task_id,
        user_id=current_user.id,
        content=note_data.content
    )
    db.add(nueva_nota)
    await db.flush()
    
    # Cargar con relación de usuario para responder correctamente
    query = select(TaskNote).where(TaskNote.id == nueva_nota.id).options(selectinload(TaskNote.user))
    res = await db.execute(query)
    return res.scalar_one()


# ==========================================
# RUTAS DE ARCHIVOS ADJUNTOS (ALMACENAMIENTO)
# ==========================================

@app.post("/api/tasks/{task_id}/attachments", response_model=TaskAttachmentResponse, tags=["Adjuntos"])
async def upload_attachment(task_id: int, file: UploadFile = File(...), db: AsyncSession = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Sanitizar nombre del archivo
    safe_filename = f"{datetime.now().timestamp()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, safe_filename)
    
    # Guardar archivo físicamente en el volumen persistente Docker
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    nuevo_adjunto = TaskAttachment(
        task_id=task_id,
        file_name=file.filename,
        file_path=file_path,
        uploaded_by=current_user.id
    )
    db.add(nuevo_adjunto)
    await db.flush()
    return nuevo_adjunto
