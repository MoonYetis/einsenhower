/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { 
  Database, 
  Layers, 
  FileText, 
  Users, 
  CheckCircle, 
  ChevronRight,
  ChevronLeft, 
  Copy, 
  Check, 
  GitBranch, 
  Server, 
  FileCode, 
  Share2, 
  Calendar,
  Sparkles,
  Info,
  Clock,
  Plus,
  Paperclip,
  Activity,
  Send,
  Trash2,
  Lock
} from "lucide-react";

interface UserResponseSim {
  id: number;
  name: string;
  email: string;
}

interface TaskNoteSim {
  id: number;
  user: string;
  userEmail: string;
  content: string;
  created_at: string;
}

interface TaskAttachmentSim {
  id: number;
  file_name: string;
  file_path: string;
  uploaded_at: string;
}

interface DelegationHistorySim {
  id: number;
  from_user: string;
  to_user: string;
  assigned_at: string;
}

interface TaskSim {
  id: string;
  title: string;
  description: string;
  quadrant: "Q1" | "Q2" | "Q3" | "Q4";
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assigned_to: string;
  created_by: string;
  created_at: string;
  due_date?: string;
  notes: TaskNoteSim[];
  attachments: TaskAttachmentSim[];
  delegation_histories: DelegationHistorySim[];
}

export default function App() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<"database" | "main" | "models" | "schemas" | "docker">("main");
  // Estado para contraer o expandir la sección de Código Fuente de Fase 2
  const [isCodeSectionExpanded, setIsCodeSectionExpanded] = useState(false);
  
  // Lista de usuarios legítimos del equipo asignada a la matriz de Eisenhower
  const mockTeamUsers = [
    { id: 1, name: "Osman Marin", email: "osman.marin@matrixos.io", avatar: "OM", password: "osman" },
    { id: 2, name: "Marie Puscan", email: "marie.puscan@matrixos.io", avatar: "MP", password: "marie" }
  ];

  // Estado del usuario activo autenticado (Persistido de manera local en el navegador)
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string; email: string; avatar: string } | null>(() => {
    const stored = localStorage.getItem("matrix_user");
    return stored ? JSON.parse(stored) : null;
  });

  // Estado para el control del login interactivo
  const [loginSelectedUser, setLoginSelectedUser] = useState<number | null>(null);
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Estado de tareas simulación interactiva con hilos secuenciales reales en React
  const [tasks, setTasks] = useState<TaskSim[]>([
    {
      id: "#492",
      title: "Fallo Crítico: Mitigar Fuga en Middleware de Autenticación FastAPI",
      description: "La migración hacia Pydantic v2 provocó una omisión involuntaria de validación en el gestor de sesiones de FastAPI. Requiere atención urgente.",
      quadrant: "Q1",
      status: "IN_PROGRESS",
      created_by: "Osman Marin",
      assigned_to: "Marie Puscan",
      created_at: "Hoy, 08:30 AM",
      due_date: "Inmediata",
      notes: [
        { id: 1, user: "Marie Puscan", userEmail: "marie.puscan@matrixos.io", content: "Analizando los alias de Pydantic v2. Parece que los campos del payload JWT ignoraban la comprobación de expiración.", created_at: "Hoy, 09:12 AM" },
        { id: 2, user: "Osman Marin", userEmail: "osman.marin@matrixos.io", content: "Estado actualizado a urgente. Esto podría exponer endpoints del equipo sin el Bearer token correcto.", created_at: "Hoy, 10:42 AM" }
      ],
      attachments: [
        { id: 1, file_name: "log_vulnerabilidad_auth.txt", file_path: "/uploads/log_vulnerabilidad_auth.txt", uploaded_at: "Hoy, 09:15 AM" }
      ],
      delegation_histories: [
        { id: 1, from_user: "Osman Marin", to_user: "Marie Puscan", assigned_at: "Hoy, 08:30 AM" }
      ]
    },
    {
      id: "#381",
      title: "Optimización de Índices en Base de Datos PostgreSQL 16",
      description: "Analizar las consultas lentas sobre los filtros cruzados de tareas y equipos. Agregar índices compuestos sobre (team_id, quadrant, status) para acelerar consultas.",
      quadrant: "Q2",
      status: "TODO",
      created_by: "Marie Puscan",
      assigned_to: "Marie Puscan",
      created_at: "Ayer, 14:20 PM",
      due_date: "Viernes, 29 de Mayo",
      notes: [
        { id: 1, user: "Marie Puscan", userEmail: "marie.puscan@matrixos.io", content: "Hemos detectado picos de latencia de hasta 250ms al cargar el cuadrante consolidado. Con el índice bajará a 12ms.", created_at: "Ayer, 15:00 PM" }
      ],
      attachments: [],
      delegation_histories: []
    },
    {
      id: "#310",
      title: "Orquestación de Pipelines CI/CD con Docker Compose",
      description: "Configurar los healthchecks automáticos de pg_isready dentro del Docker Compose y optimizar Dockerfile para compilación asincrónica en Cloud Run.",
      quadrant: "Q2",
      status: "TODO",
      created_by: "Osman Marin",
      assigned_to: "Osman Marin",
      created_at: "Hace 2 días",
      due_date: "Lunes, 1 de Junio",
      notes: [],
      attachments: [
        { id: 2, file_name: "prod_docker_architecture.pdf", file_path: "/uploads/prod_docker_architecture.pdf", uploaded_at: "Ayer, 10:00 AM" }
      ],
      delegation_histories: []
    },
    {
      id: "#223",
      title: "Actualizar Documentación Corporativa: Migraciones Alembic",
      description: "Escribir las guías sobre cómo generar scripts de migración asincrónicos compatibles con asyncpg y SQLAlchemy 2.0.",
      quadrant: "Q3",
      status: "TODO",
      created_by: "Osman Marin",
      assigned_to: "Marie Puscan",
      created_at: "Hace 3 días",
      due_date: "Fin de mes",
      notes: [
        { id: 1, user: "Marie Puscan", userEmail: "marie.puscan@matrixos.io", content: "Ya comencé a redactar el archivo wiki/Alembic-Async.md. Necesito confirmación del esquema de modelos de Fase 1 para publicarlo.", created_at: "Hace 1 día" }
      ],
      attachments: [],
      delegation_histories: [
        { id: 1, from_user: "Osman Marin", to_user: "Marie Puscan", assigned_at: "Hace 3 días" }
      ]
    },
    {
      id: "#104",
      title: "Auditoría de Tecnologías Obsoletas: Base de Datos PHP Heredada",
      description: "Q4: Baja prioridad. Depurar registros remotos redundantes, congelar contenedores legados y migrar esquemas de prueba remanentes.",
      quadrant: "Q4",
      status: "DONE",
      created_by: "Osman Marin",
      assigned_to: "Marie Puscan",
      created_at: "Hace 1 semana",
      notes: [],
      attachments: [],
      delegation_histories: [
        { id: 1, from_user: "Osman Marin", to_user: "Marie Puscan", assigned_at: "Hace 1 semana" }
      ]
    }
  ]);

  // Tarea seleccionada activa
  const [selectedTaskId, setSelectedTaskId] = useState<string>("#492");
  const [deleteConfirmTaskId, setDeleteConfirmTaskId] = useState<string | null>(null);
  
  React.useEffect(() => {
    setDeleteConfirmTaskId(null);
  }, [selectedTaskId]);

  const currentTask = tasks.find(t => t.id === selectedTaskId) || tasks[0] || {
    id: "#492",
    title: "Cargando tarea...",
    description: "",
    quadrant: "Q1",
    status: "TODO",
    notes: [],
    attachments: [],
    delegation_histories: [],
    assigned_to: "Osman Marin",
    created_by: "Osman Marin"
  };

  // Carga inicial y obtención en tiempo real de la API
  React.useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
          if (data.length > 0) {
            setSelectedTaskId(data[0].id);
          }
        }
      } catch (err) {
        console.warn("Fallo de API, usando fallback en memoria local de React:", err);
      }
    };
    fetchTasks();
  }, []);

  // Estado para crear nuevas tareas interactivas directamente en el tablero
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newQuadrant, setNewQuadrant] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q1");
  const [newAssignee, setNewAssignee] = useState("Marie Puscan");
  const [newDueDate, setNewDueDate] = useState("");

  // Estado para redactar notas interactivas secuenciales
  const [newNoteContent, setNewNoteContent] = useState("");

  // Estados del calendario interactivo
  const [calendarYear, setCalendarYear] = useState<number>(2026);
  const [calendarMonth, setCalendarMonth] = useState<number>(4); // Mayo por defecto
  const [selectedCalendarDay, setSelectedCalendarDay] = useState<number | null>(null);

  // Comprobar si una tarea coincide con un día específico del calendario
  const matchTaskWithDate = (taskDate: string | undefined, year: number, month: number, day: number): boolean => {
    if (!taskDate) return false;
    
    const normalized = taskDate.toLowerCase().trim();
    
    // 1. Coincidencia con fechas ISO YYYY-MM-DD
    const isoMatch = normalized.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const tYear = parseInt(isoMatch[1], 10);
      const tMonth = parseInt(isoMatch[2], 10) - 1; // Mes en JS es base 0
      const tDay = parseInt(isoMatch[3], 10);
      return tYear === year && tMonth === month && tDay === day;
    }
    
    // 2. Mapear meses en español
    const spanishMonths = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const currentMonthName = spanishMonths[month];
    
    // 3. Comprobar si el texto contiene el mes y el día específico
    if (normalized.includes(currentMonthName)) {
      const numberMatches = normalized.match(/\d+/);
      if (numberMatches) {
        const parsedDay = parseInt(numberMatches[0], 10);
        return parsedDay === day;
      }
    }

    // "fin de mes" en Mayo de 2026 -> 31 de Mayo
    if (normalized.includes("fin de mes") && month === 4 && day === 31) {
      return true;
    }
    
    // "inmediata" en Mayo de 2026 -> 26 de Mayo (día de hoy según hora del sistema)
    if (normalized.includes("inmediata") && year === 2026 && month === 4 && day === 26) {
      return true;
    }
    
    return false;
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // Enviar credenciales de inicio de sesión real/simulado
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginSelectedUser) {
      setLoginError("Por favor, selecciona un miembro del equipo.");
      return;
    }
    const userObj = mockTeamUsers.find(u => u.id === loginSelectedUser);
    if (!userObj) return;

    if (loginPassword.trim().toLowerCase() === userObj.password) {
      const sessionUser = {
        id: userObj.id,
        name: userObj.name,
        email: userObj.email,
        avatar: userObj.avatar
      };
      localStorage.setItem("matrix_user", JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
      setLoginError("");
      setLoginPassword("");
    } else {
      setLoginError(`Contraseña incorrecta. (Prueba con "${userObj.password}")`);
    }
  };

  // Cerrar sesión activa del equipo
  const handleLogout = () => {
    localStorage.removeItem("matrix_user");
    setCurrentUser(null);
    setLoginSelectedUser(null);
    setLoginPassword("");
    setLoginError("");
  };

  // Iniciar el arrastre de una tarea de la matriz
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
  };

  // Permitir la zona de soltar de la matriz de Eisenhower
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Soltar tarea en nueva sección de cuadrante
  const handleDrop = async (e: React.DragEvent, targetQuadrant: "Q1" | "Q2" | "Q3" | "Q4") => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/plain");
    if (!taskId) return;

    // Actualización optimista del cuadrante en el estado react
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, quadrant: targetQuadrant } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quadrant: targetQuadrant })
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      }
    } catch (err) {
      console.warn("Fallo de API al actualizar cuadrante con drag and drop:", err);
    }
  };

  // Modificar la fecha límite / plazo de la tarea
  const handleUpdateDueDate = async (taskId: string, newDate: string) => {
    // Actualización local
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, due_date: newDate } : t))
    );

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ due_date: newDate })
      });
      if (res.ok) {
        const updated = await res.json();
        setTasks(prev => prev.map(t => (t.id === taskId ? updated : t)));
      }
    } catch (err) {
      console.warn("Fallo de API al actualizar fecha de plazo:", err);
    }
  };

  // Agregar una tarea interactiva real en el Servidor
  const handleCreateTaskSim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const currentUserName = currentUser?.name || "Osman Marin";

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          quadrant: newQuadrant,
          assigned_to: newAssignee,
          created_by: currentUserName,
          due_date: newDueDate || "Sin plazo"
        })
      });

      if (res.ok) {
        const createdTaskObj = await res.json();
        setTasks(prev => [createdTaskObj, ...prev]);
        setSelectedTaskId(createdTaskObj.id);
      } else {
        throw new Error("Respuesta inválida");
      }
    } catch (err) {
      console.warn("Fallo de API, usando inserción offline:", err);
      const randomizedId = `#${Math.floor(100 + Math.random() * 900)}`;
      const newTask: TaskSim = {
        id: randomizedId,
        title: newTitle,
        description: newDescription || "Sin descripción adicional.",
        quadrant: newQuadrant,
        status: "TODO",
        created_by: currentUserName,
        assigned_to: newAssignee,
        created_at: "Ahora mismo",
        due_date: newDueDate || "Sin plazo",
        notes: [],
        attachments: [],
        delegation_histories: [
          {
            id: Date.now(),
            from_user: currentUserName,
            to_user: newAssignee,
            assigned_at: "Ahora mismo"
          }
        ]
      };
      setTasks(prev => [newTask, ...prev]);
      setSelectedTaskId(newTask.id);
    }

    setShowAddTaskModal(false);
    setNewTitle("");
    setNewDescription("");
    setNewDueDate("");
  };

  // Agregar una nota real en la DB
  const handleAddNoteSim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || !currentTask) return;

    const currentUserName = currentUser?.name || "Osman Marin";
    const currentUserEmail = currentUser?.email || "osman.marin@matrixos.io";

    try {
      const res = await fetch(`/api/tasks/${currentTask.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newNoteContent,
          user: currentUserName
        })
      });

      if (res.ok) {
        const createdNoteObj = await res.json();
        setTasks(prev => prev.map(task => {
          if (task.id === currentTask.id) {
            return {
              ...task,
              notes: [...task.notes, createdNoteObj]
            };
          }
          return task;
        }));
      } else {
        throw new Error("Respuesta inválida de API");
      }
    } catch (err) {
      console.warn("Fallo de API, usando inserción local de comentario:", err);
      const newNoteObj: TaskNoteSim = {
        id: Date.now(),
        user: currentUserName,
        userEmail: currentUserEmail,
        content: newNoteContent,
        created_at: "Hace unos segundos"
      };

      setTasks(prev => prev.map(task => {
        if (task.id === currentTask.id) {
          return {
            ...task,
            notes: [...task.notes, newNoteObj]
          };
        }
        return task;
      }));
    }

    setNewNoteContent("");
  };

  // Eliminar una tarea real en la base de datos
  const handleDeleteTaskSim = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const remaining = tasks.filter(t => t.id !== id);
        setTasks(remaining);
        if (remaining.length > 0) {
          setSelectedTaskId(remaining[0].id);
        } else {
          setSelectedTaskId("");
        }
      }
    } catch (err) {
      console.warn("Fallo de API al eliminar, haciendo borrado en memoria:", err);
      const remaining = tasks.filter(t => t.id !== id);
      setTasks(remaining);
      if (remaining.length > 0) {
        setSelectedTaskId(remaining[0].id);
      } else {
        setSelectedTaskId("");
      }
    }
  };

  // Cambiar el estado o cuadrante de la tarea dinámicamente con la API Express
  const handleStatusChangeSim = async (id: string, newStatus: "TODO" | "IN_PROGRESS" | "DONE") => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      } else {
        throw new Error("Fallo API status change");
      }
    } catch (err) {
      console.warn("Fallo de API, usando mutación local:", err);
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          return { ...task, status: newStatus };
        }
        return task;
      }));
    }
  };

  // Controlar la reasignación de colaboradores en tiempo real con la API Express
  const handleReassignSim = async (id: string, newAssignee: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigned_to: newAssignee }),
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      } else {
        throw new Error("Fallo API reassign");
      }
    } catch (err) {
      console.warn("Fallo de API, usando reasignación local:", err);
      setTasks(prev => prev.map(task => {
        if (task.id === id) {
          const histories = [...task.delegation_histories];
          if (task.assigned_to !== newAssignee) {
            histories.push({
              id: Date.now(),
              from_user: task.assigned_to,
              to_user: newAssignee,
              assigned_at: "Hace unos segundos"
            });
          }
          return {
            ...task,
            assigned_to: newAssignee,
            delegation_histories: histories
          };
        }
        return task;
      }));
    }
  };

  // Manejar la subida de un archivo real del sistema
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentTask) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`/api/tasks/${currentTask.id}/attachments`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const attachment = await res.json();
        setTasks(prev => prev.map(task => {
          if (task.id === currentTask.id) {
            return {
              ...task,
              attachments: [...task.attachments, attachment]
            };
          }
          return task;
        }));
      } else {
        alert("Fallo al subir el archivo al volumen integrado.");
      }
    } catch (err) {
      console.error("Error al subir archivo adjunto de forma integrada:", err);
    }
  };

  // Stringified base de datos y endpoints de la Fase 2 para visualización directa
  const databasePyContent = `import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

DATABASE_URL = os.getenv(
    "DATABASE_URL", 
    "postgresql+asyncpg://eisenhower:eisenhower_pass@db:5432/eisenhower_db"
)

# Inicializar motor asíncrono para PostgreSQL 16
engine = create_async_engine(DATABASE_URL, echo=True, future=True)

# Generador de sesiones asíncronas para control simultáneo
async_session = async_sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

# Dependencia moderna get_db para inyección de dependencias en FastAPI
async def get_db():
    async with async_session() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()`;

  const mainPyContent = `import os
import shutil
from datetime import datetime
from typing import List
from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import Task, TaskNote, TaskAttachment, DelegationHistory, TeamMember
from app.schemas import TaskCreate, TaskResponse, TaskUpdate, TaskNoteCreate, TaskNoteResponse

app = FastAPI(title="MatrixOS - API Colaborativa Eisenhower")

# Configurar CORS para comunicación directa con el cliente React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Endpoint: Crear Tarea Colaborativa (Fase 2)
@app.post("/api/tasks", response_model=TaskResponse, status_code=201)
async def create_task(task_data: TaskCreate, db: AsyncSession = Depends(get_db)):
    nueva_tarea = Task(
        title=task_data.title,
        description=task_data.description,
        quadrant=task_data.quadrant,
        team_id=task_data.team_id,
        assigned_to=task_data.assigned_to
    )
    db.add(nueva_tarea)
    await db.flush()
    return nueva_tarea

# Endpoint: Historial y Trazabilidad de Delegaciones Integradas
@app.patch("/api/tasks/{task_id}", response_model=TaskResponse)
async def update_task(task_id: int, updates: TaskUpdate, db: AsyncSession = Depends(get_db)):
    query = select(Task).where(Task.id == task_id)
    result = await db.execute(query)
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="Tarea no localizada")
        
    # Registrar traza si se reasigna la tarea
    if updates.assigned_to is not None and task.assigned_to != updates.assigned_to:
        historial = DelegationHistory(
            task_id=task.id,
            from_user_id=task.assigned_to,
            to_user_id=updates.assigned_to
        )
        db.add(historial)
        task.assigned_to = updates.assigned_to
        
    if updates.quadrant is not None:
        task.quadrant = updates.quadrant
    if updates.status is not None:
        task.status = updates.status
        
    await db.flush()
    return task

# Endpoint: Hilos de Comentarios Secuenciales (Fase 2)
@app.post("/api/tasks/{task_id}/notes", response_model=TaskNoteResponse)
async def add_note(task_id: int, data: TaskNoteCreate, db: AsyncSession = Depends(get_db)):
    nueva_nota = TaskNote(task_id=task_id, content=data.content, user_id=1)
    db.add(nueva_nota)
    await db.flush()
    return nueva_nota`;

  const modelsPyContent = `from enum import Enum as PyEnum
from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime, Enum, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Quadrant(str, PyEnum):
    Q1 = "Q1"  # Urgente / Importante (Hacer Primero)
    Q2 = "Q2"  # No Urgente / Importante (Planificar)
    Q3 = "Q3"  # Urgente / No Importante (Delegar)
    Q4 = "Q4"  # No Urgente / No Importante (Eliminar)

class Task(Base):
    __tablename__ = "tasks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    quadrant: Mapped[Quadrant] = mapped_column(Enum(Quadrant), nullable=False)
    status: Mapped[str] = mapped_column(String(50), default="TODO")
    assigned_to: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    
    # Hilos secuenciales de Comentarios
    notes = relationship("TaskNote", back_populates="task", cascade="all, delete-orphan")
    attachments = relationship("TaskAttachment", back_populates="task")`;

  const schemasPyContent = `from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field
from app.models import Quadrant

class TaskNoteCreate(BaseModel):
    content: str = Field(..., min_length=1)

class TaskCreate(BaseModel):
    title: str = Field(..., max_length=200)
    description: Optional[str] = None
    quadrant: Quadrant
    team_id: int
    assigned_to: Optional[int] = None`;

  const dockerComposeContent = `version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: eisenhower_db
    restart: always
    environment:
      POSTGRES_USER: eisenhower
      POSTGRES_PASSWORD: eisenhower_pass
      POSTGRES_DB: eisenhower_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    container_name: eisenhower_backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://eisenhower:eisenhower_pass@db:5432/eisenhower_db
    depends_on:
      - db`;

  if (!currentUser) {
    return (
      <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
        {/* Diseños de fondo modernos al estilo Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.08),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.05),transparent_40%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        <div className="w-full max-w-sm bg-slate-900 border border-slate-800/80 rounded-2xl p-6 md:p-8 shadow-2xl relative z-10 backdrop-blur-md">
          <div className="text-center mb-6">
            <div className="inline-flex w-12 h-12 bg-indigo-600 rounded-xl items-center justify-center text-white font-mono text-2xl font-black tracking-tighter mb-4 shadow-lg shadow-indigo-600/25">
              M
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
              Matrix<span className="text-indigo-500">OS</span>
            </h1>
            <p className="text-xs text-slate-400 font-mono mt-1 uppercase tracking-wider">
              Matriz de Eisenhower Colaborativa
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div>
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-2 font-mono">
                Selecciona tu Cuenta:
              </label>
              <div className="grid grid-cols-2 gap-3 pb-1">
                {mockTeamUsers.map(user => {
                  const isSelected = loginSelectedUser === user.id;
                  return (
                    <div
                      key={user.id}
                      onClick={() => {
                        setLoginSelectedUser(user.id);
                        setLoginError("");
                      }}
                      className={`p-4 border rounded-xl text-center cursor-pointer transition-all ${
                        isSelected
                          ? "bg-slate-800/80 border-indigo-500 shadow-md shadow-indigo-500/10"
                          : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-2 text-white font-bold text-xs select-none">
                        {user.avatar}
                      </div>
                      <div className="text-xs font-bold text-white tracking-tight leading-tight">
                        {user.name}
                      </div>
                      <div className="text-[9px] text-slate-500 font-mono mt-1 block select-none">
                        {user.avatar === "OM" ? "Director Plan" : "Líder de Dev"}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {loginSelectedUser && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <label className="font-black uppercase tracking-wider text-slate-400">
                    Contraseña del Equipo:
                  </label>
                  <span className="text-slate-500">
                    Sugerida: <span className="text-indigo-450 underline font-bold">{mockTeamUsers.find(u => u.id === loginSelectedUser)?.password}</span>
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type="password"
                    placeholder="Contraseña integrada"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all font-mono"
                    required
                  />
                </div>
              </div>
            )}

            {loginError && (
              <div className="p-3 bg-red-950/50 border border-red-900/80 text-rose-300 text-xs rounded-lg text-center font-mono leading-relaxed">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={!loginSelectedUser}
              className={`w-full py-3 rounded-lg text-xs font-bold uppercase tracking-widest text-white transition-all select-none cursor-pointer flex items-center justify-center gap-1.5 ${
                loginSelectedUser
                  ? "bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 active:scale-95"
                  : "bg-slate-800 text-slate-500 cursor-not-allowed"
              }`}
            >
              <span>Acceder a la Matriz</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="text-center mt-6 text-[9px] text-slate-500 font-mono uppercase tracking-wider select-none">
            Consola de Seguridad Integrada • v1.1.2
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden selection:bg-slate-900 selection:text-white">
      
      {/* Header de Navegación Estilo Geometric Balance */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 flex-shrink-0 shadow-sm z-20">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded flex items-center justify-center text-white font-mono text-lg font-black tracking-tighter">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-[10px] font-black text-slate-400 tracking-widest -mb-0.5 uppercase">Fase 2 / Backend Activo</span>
              <h1 className="font-black text-base tracking-tight uppercase text-slate-900 flex items-center gap-1.5">
                MatrixOS <span className="text-slate-400 font-medium">/ Arquitectura</span>
              </h1>
            </div>
          </div>
          <nav className="hidden md:flex gap-6 text-xs font-bold uppercase tracking-wider text-slate-500">
            <span className="text-slate-900 border-b-2 border-slate-900 pb-5 pt-5 cursor-default">Fase 2: Conexiones & Endpoints</span>
            <span className="hover:text-slate-900 transition-colors cursor-pointer py-5" onClick={() => setShowAddTaskModal(true)}>
              + Programar Tarea
            </span>
          </nav>
        </div>

        <div className="flex items-center gap-4 md:gap-5">
          {/* Avatar e Información de Sesión Activa */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 py-1 px-3 rounded-full text-xs text-slate-700 select-none">
              <span className="w-5 h-5 bg-slate-900 rounded-full flex items-center justify-center text-[9px] font-mono text-white font-bold shrink-0">
                {currentUser.avatar}
              </span>
              <span className="font-bold truncate hidden sm:inline max-w-[120px]">{currentUser.name}</span>
              <button 
                onClick={handleLogout}
                className="text-[9px] uppercase font-bold text-slate-400 hover:text-rose-600 border-l border-slate-300 pl-2 ml-1 cursor-pointer transition-colors"
                title="Cerrar sesión activa del equipo"
              >
                Salir
              </button>
            </div>
          )}

          {/* Listado de Miembros del Equipo de Arquitectura */}
          <div className="hidden sm:flex -space-x-2 items-center">
            {mockTeamUsers.map(user => (
              <div 
                key={user.id} 
                className="w-8 h-8 rounded-full border-2 border-white bg-slate-800 text-white flex items-center justify-center text-[10px] font-black cursor-help hover:scale-105 transition-transform" 
                title={`${user.name} (${user.email})`}
              >
                {user.avatar}
              </div>
            ))}
          </div>

          <button 
            onClick={() => setShowAddTaskModal(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold rounded uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Nueva Tarea
          </button>
        </div>
      </header>

      {/* Grid Principal - Estructura Clave de Geometric Balance */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Lado Izquierdo: Tablero de Tenedores de la Matriz de Eisenhower en Español */}
        <section className="flex-1 overflow-y-auto border-r border-slate-200 bg-slate-50 p-6 space-y-6">
          
          {/* Banner de Estado e Introducción de Fase 2 */}
          <div className="bg-white border border-slate-200 p-6 rounded-lg shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Layers className="w-36 h-36 text-slate-900" />
            </div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-mono font-black uppercase rounded mb-2">
                  <Sparkles className="w-3.5 h-3.5" /> Conexión PostgreSQL en Tiempo Real
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Matriz de Eisenhower Interactiva
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Visualiza el flujo de datos transaccionales. Haz clic en cualquier tarea para editar su estado, consultar adjuntos, auditar hilos secuenciales de comentarios y rastrear su historial de delegación colaboradores.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 py-1.5 px-3 rounded flex items-center gap-1.5 shadow-2xs">
                  <Database className="w-3.5 h-3.5 text-slate-400" /> PostgreSQL 16
                </span>
                <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200 py-1.5 px-3 rounded flex items-center gap-1.5 shadow-2xs">
                  <Server className="w-3.5 h-3.5 text-slate-400" /> FastAPI Async
                </span>
              </div>
            </div>
          </div>

          {/* Ejes y Cuadrícula de la Matriz */}
          <div className="border border-slate-200 rounded bg-white overflow-hidden shadow-sm">
            
            {/* Cabecera del eje horizontal */}
            <div className="h-12 flex border-b border-slate-200 bg-slate-100/60 font-mono">
              <div className="w-12 border-r border-slate-200 flex items-center justify-center bg-slate-100">
                <Clock className="w-4 h-4 text-slate-500" />
              </div>
              <div className="flex-1 flex text-center">
                <div className="w-1/2 flex items-center justify-center border-r border-slate-200 bg-white">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-red-600">
                    🔴 Urgente
                  </span>
                </div>
                <div className="w-1/2 flex items-center justify-center bg-white">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                    ⚪ No Urgente
                  </span>
                </div>
              </div>
            </div>

            <div className="flex">
              
              {/* Columna de etiquetas de eje vertical */}
              <div className="w-12 flex flex-col border-r border-slate-200 bg-slate-100/60 font-mono">
                <div className="h-56 flex items-center justify-center border-b border-slate-200 bg-white">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-700 rotate-[-90deg] whitespace-nowrap">
                    ⭐ Importante
                  </span>
                </div>
                <div className="h-56 flex items-center justify-center bg-white">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 rotate-[-90deg] whitespace-nowrap">
                    💤 No Importante
                  </span>
                </div>
              </div>

              {/* El Grid de 4 cuadrantes balanceados */}
              <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-px bg-slate-200">
                
                {/* Q1: HACER PRIMERO */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "Q1")}
                  className="bg-white p-5 min-h-[14rem] max-h-[14rem] overflow-y-auto flex flex-col justify-start border border-dashed border-transparent hover:border-red-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1.5">
                      Q1: Acción Inmediata
                    </span>
                    <span className="bg-red-50 text-red-600 text-[9px] px-2 py-0.5 rounded font-black font-mono">
                      {tasks.filter(t => t.quadrant === "Q1").length} Activas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {tasks.filter(t => t.quadrant === "Q1").map(task => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`p-3 rounded border transition-all cursor-grab active:cursor-grabbing text-left relative group select-none hover:shadow-md ${
                          selectedTaskId === task.id
                            ? "border-red-500 bg-red-50/20 shadow-xs"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                            {task.title}
                          </h4>
                          <span className="text-[9px] font-mono text-red-600 bg-red-100/50 px-1.5 py-0.2 rounded shrink-0">
                            {task.id}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-[10px] font-mono pt-1.5 border-t border-slate-100">
                          <span className="text-slate-600 font-bold">{task.assigned_to}</span>
                          {task.due_date && (
                            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[8px] font-sans font-black flex items-center gap-1 shrink-0 uppercase tracking-wider">
                              ⏱️ {task.due_date}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q2: PLANIFICAR */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "Q2")}
                  className="bg-white p-5 min-h-[14rem] max-h-[14rem] overflow-y-auto flex flex-col justify-start border border-dashed border-transparent hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-indigo-700 uppercase tracking-widest flex items-center gap-1.5">
                      Q2: Enfoque Estratégico
                    </span>
                    <span className="bg-indigo-50 text-indigo-700 text-[9px] px-2 py-0.5 rounded font-black font-mono">
                      {tasks.filter(t => t.quadrant === "Q2").length} Activas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {tasks.filter(t => t.quadrant === "Q2").map(task => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`p-3 rounded border transition-all cursor-grab active:cursor-grabbing text-left relative group select-none hover:shadow-md ${
                          selectedTaskId === task.id
                            ? "border-indigo-500 bg-indigo-50/20 shadow-xs"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                            {task.title}
                          </h4>
                          <span className="text-[9px] font-mono text-slate-450 shrink-0">
                            {task.id}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-[10px] font-mono pt-1.5 border-t border-slate-100">
                          <span className="text-slate-600 font-bold">{task.assigned_to}</span>
                          {task.due_date && (
                            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[8px] font-sans font-black flex items-center gap-1 shrink-0 uppercase tracking-wider">
                              ⏱️ {task.due_date}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q3: DELEGAR */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "Q3")}
                  className="bg-white p-5 min-h-[14rem] max-h-[14rem] overflow-y-auto flex flex-col justify-start border border-dashed border-transparent hover:border-amber-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest flex items-center gap-1.5">
                      Q3: Cola de Delegación
                    </span>
                    <span className="bg-amber-50 text-amber-700 text-[9px] px-2 py-0.5 rounded font-black font-mono">
                      {tasks.filter(t => t.quadrant === "Q3").length} Activas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {tasks.filter(t => t.quadrant === "Q3").map(task => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`p-3 rounded border transition-all cursor-grab active:cursor-grabbing text-left relative group select-none hover:shadow-md ${
                          selectedTaskId === task.id
                            ? "border-amber-400 bg-amber-50/20 shadow-xs"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                            {task.title}
                          </h4>
                          <span className="text-[9px] font-mono text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded shrink-0">
                            {task.id}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-[10px] font-mono pt-1.5 border-t border-slate-100">
                          <span className="text-amber-800 font-bold">{task.assigned_to}</span>
                          {task.due_date && (
                            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[8px] font-sans font-black flex items-center gap-1 shrink-0 uppercase tracking-wider">
                              ⏱️ {task.due_date}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Q4: ELIMINAR */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, "Q4")}
                  className="bg-white p-5 min-h-[14rem] max-h-[14rem] overflow-y-auto flex flex-col justify-start border border-dashed border-transparent hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      Q4: Baja Prioridad
                    </span>
                    <span className="bg-slate-55 text-slate-600 text-[9px] px-2 py-0.5 rounded font-black font-mono">
                      {tasks.filter(t => t.quadrant === "Q4").length} Activas
                    </span>
                  </div>

                  <div className="space-y-2">
                    {tasks.filter(t => t.quadrant === "Q4").map(task => (
                      <div
                        key={task.id}
                        onClick={() => setSelectedTaskId(task.id)}
                        draggable="true"
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        className={`p-3 rounded border transition-all cursor-grab active:cursor-grabbing text-left relative group select-none hover:shadow-md ${
                          selectedTaskId === task.id
                            ? "border-slate-500 bg-slate-100 shadow-xs"
                            : "border-slate-100 bg-slate-50/50 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-slate-900 line-through line-clamp-2 leading-tight text-slate-400">
                            {task.title}
                          </h4>
                          <span className="text-[9px] font-mono text-slate-400 shrink-0">
                            {task.id}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3 text-[10px] font-mono pt-1.5 border-t border-slate-100">
                          <span className="text-slate-400 font-bold">{task.assigned_to}</span>
                          {task.due_date && (
                            <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[8px] font-sans font-black flex items-center gap-1 shrink-0 uppercase tracking-wider">
                              ⏱️ {task.due_date}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* PLANIFICADOR COMPLETO & CALENDARIO INTERACTIVO (Fase 2+) */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" /> CALENDARIO Y PLANIFICADOR DE PLAZOS
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualiza plazos, detecta cuellos de botella y haz clic en un día para reprogramar o crear tareas.
                </p>
              </div>

              {/* Controles de Navegación de Mes */}
              <div className="flex items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    if (calendarMonth === 0) {
                      setCalendarMonth(11);
                      setCalendarYear(y => y - 1);
                    } else {
                      setCalendarMonth(m => m - 1);
                    }
                    setSelectedCalendarDay(null);
                  }}
                  className="p-1 px-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 text-xs transition-colors flex items-center justify-center cursor-pointer select-none"
                  title="Mes Anterior"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <span className="text-xs font-black font-mono text-slate-900 px-3 min-w-[120px] text-center bg-slate-50 py-1.5 rounded-md border border-slate-100 uppercase tracking-widest">
                  {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][calendarMonth]} {calendarYear}
                </span>

                <button
                  type="button"
                  onClick={() => {
                    if (calendarMonth === 11) {
                      setCalendarMonth(0);
                      setCalendarYear(y => y + 1);
                    } else {
                      setCalendarMonth(m => m + 1);
                    }
                    setSelectedCalendarDay(null);
                  }}
                  className="p-1 px-2 border border-slate-200 rounded bg-white hover:bg-slate-50 text-slate-600 text-xs transition-colors flex items-center justify-center cursor-pointer select-none"
                  title="Siguiente Mes"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Leyenda de Prioridad de Cuadrantes */}
            <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono font-bold text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <span className="text-slate-400 uppercase tracking-wider">Prioridades:</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span> Q1 (Urgente)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span> Q2 (Estratégico)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Q3 (Delegado)</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span> Q4 (Baja Prioridad)</span>
            </div>

            {/* Matriz Calendario (Grid) */}
            <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
              {/* Días de la semana */}
              <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-[10px] font-mono font-bold text-slate-400 text-center uppercase tracking-widest py-2">
                {["L", "M", "X", "J", "V", "S", "D"].map(d => (
                  <div key={d}>{d}</div>
                ))}
              </div>

              {/* Cuadrículas de los Días */}
              <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-50 text-slate-800">
                {/* Celdas vacías iniciales para empotrar inicio del mes */}
                {Array.from({ length: (new Date(calendarYear, calendarMonth, 1).getDay() + 6) % 7 }).map((_, index) => (
                  <div key={`empty-${index}`} className="min-h-[4.5rem] bg-slate-50/50"></div>
                ))}

                {/* Celdas numéricas del mes */}
                {Array.from({ length: new Date(calendarYear, calendarMonth + 1, 0).getDate() }).map((_, idx) => {
                  const day = idx + 1;
                  const isSelected = selectedCalendarDay === day;
                  const isCurrentNow = new Date().getDate() === day && new Date().getMonth() === calendarMonth && new Date().getFullYear() === calendarYear;
                  const matchingTasks = tasks.filter(t => matchTaskWithDate(t.due_date, calendarYear, calendarMonth, day));

                  return (
                    <div
                      key={`day-${day}`}
                      onClick={() => setSelectedCalendarDay(day)}
                      className={`min-h-[4.5rem] bg-white p-2 transition-all cursor-pointer flex flex-col justify-between selection:bg-transparent relative hover:bg-indigo-50/10 ${
                        isSelected 
                          ? "ring-2 ring-indigo-500 ring-inset bg-indigo-50/20" 
                          : isCurrentNow 
                            ? "bg-slate-900/5 font-black" 
                            : ""
                      }`}
                    >
                      {/* Cabecera de celda: Número del día */}
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-mono leading-none ${
                          isCurrentNow 
                            ? "bg-slate-900 text-white font-black px-1.5 py-0.5 rounded-full text-[9px]" 
                            : isSelected 
                              ? "text-indigo-700 font-extrabold" 
                              : "text-slate-400 font-medium"
                        }`}>
                          {day}
                        </span>
                        {matchingTasks.length > 0 && (
                          <span className="text-[8px] font-mono bg-indigo-100 text-indigo-700 leading-none px-1 rounded-full font-black">
                            {matchingTasks.length}
                          </span>
                        )}
                      </div>

                      {/* Lista de Micro Tareas con Código de Color */}
                      <div className="space-y-1 mt-1 flex-1 overflow-y-auto max-h-[3.2rem] scrollbar-none">
                        {matchingTasks.map(task => {
                          const isTaskActive = selectedTaskId === task.id;
                          const bgClass = 
                            task.quadrant === "Q1" ? "bg-red-50 text-red-700 border-red-200" :
                            task.quadrant === "Q2" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                            task.quadrant === "Q3" ? "bg-amber-50 text-amber-700 border-amber-200" :
                            "bg-slate-150 text-slate-700 border-slate-250";

                          const dotClass = 
                            task.quadrant === "Q1" ? "bg-red-500" :
                            task.quadrant === "Q2" ? "bg-indigo-600" :
                            task.quadrant === "Q3" ? "bg-amber-500" :
                            "bg-slate-400";

                          return (
                            <button
                              key={task.id}
                              onClick={(e) => {
                                e.stopPropagation(); // Evitar seleccionar celda del día
                                setSelectedTaskId(task.id);
                              }}
                              title={`[${task.quadrant}] ${task.title}`}
                              className={`w-full text-left text-[8px] font-semibold p-1 py-0.5 rounded border leading-tight truncate flex items-center gap-1 select-none cursor-pointer hover:shadow-xs translate-y-0 active:translate-y-px transition-all ${bgClass} ${
                                isTaskActive ? "ring-1 ring-slate-900 font-bold" : ""
                              }`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClass}`} />
                              <span className="truncate">{task.id}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Panel de Acciones Rápidas del Día Seleccionado */}
            {selectedCalendarDay !== null ? (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans shadow-xxs">
                <div className="flex items-center gap-2">
                  <div className="p-1 px-2.5 bg-slate-900 text-white font-mono text-xs font-bold rounded">
                    {selectedCalendarDay}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-black tracking-widest block uppercase font-mono">Día Seleccionado:</span>
                    <span className="text-xs font-bold text-slate-900">
                      {selectedCalendarDay} de {["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"][calendarMonth]} de {calendarYear}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Boton para programar tarea actualmente cargada en el panel de detalle */}
                  {currentTask && currentTask.id && currentTask.title && !currentTask.title.startsWith("Cargando") ? (
                    <button
                      type="button"
                      onClick={() => {
                        const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(selectedCalendarDay).padStart(2, "0")}`;
                        handleUpdateDueDate(currentTask.id, dateString);
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[10px] font-sans font-black uppercase tracking-wider transition-all cursor-pointer select-none"
                    >
                      📅 Asignar a {currentTask.id}
                    </button>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => {
                      const dateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(selectedCalendarDay).padStart(2, "0")}`;
                      setNewDueDate(dateString);
                      setShowAddTaskModal(true);
                    }}
                    className="px-3 py-1.5 bg-slate-900 border border-slate-950 text-white hover:bg-slate-800 rounded-md text-[10px] font-sans font-black uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap"
                  >
                    ➕ Crear Tarea Aquí
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center p-3.5 border border-dashed border-slate-200 text-slate-400 text-xs rounded-lg font-sans">
                💡 Haz clic en cualquier celda para desbloquear el planificador interactivo rápido sobre ese día.
              </div>
            )}
          </div>

          {/* Explorador de Código en Tiempo Real de Fase 2 (En Español) */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
            <div 
              onClick={() => setIsCodeSectionExpanded(!isCodeSectionExpanded)}
              className="p-5 bg-slate-50 flex items-center justify-between gap-4 cursor-pointer select-none hover:bg-slate-100/70 transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-mono text-sm font-black text-slate-900 flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-indigo-600" /> CÓDIGO FUENTE DE FASE 2 (INTEGRACIÓN)
                  <span className={`text-[9px] font-sans font-black px-2 py-0.5 rounded uppercase tracking-wider transition-all duration-200 ${
                    isCodeSectionExpanded ? "bg-slate-200 text-slate-700" : "bg-indigo-50 text-indigo-700"
                  }`}>
                    {isCodeSectionExpanded ? "Contraer" : "Hacer click para expandir"}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Explora la lógica de la base de datos PostgreSQL, la API asíncrona FastAPI y los modelos SQLAlchemy.
                </p>
              </div>
              <div className="shrink-0 text-slate-400">
                <ChevronRight className={`w-5 h-5 transform transition-transform duration-200 ${isCodeSectionExpanded ? "rotate-90 text-slate-800" : "rotate-0"}`} />
              </div>
            </div>

            {isCodeSectionExpanded && (
              <div className="border-t border-slate-200">
                {/* Botonera de pestañas de código */}
                <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase font-bold">Ficheros de Arquitectura Backend:</span>
                  <div className="flex border border-slate-200 rounded overflow-hidden text-[11px] font-mono bg-white shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCodeTab("database");
                      }}
                      className={`px-3 py-2 transition-colors cursor-pointer ${
                        activeCodeTab === "database" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      database.py
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCodeTab("main");
                      }}
                      className={`px-3 py-2 border-l border-slate-200 transition-colors cursor-pointer ${
                        activeCodeTab === "main" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      main.py
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCodeTab("models");
                      }}
                      className={`px-3 py-2 border-l border-slate-200 transition-colors cursor-pointer ${
                        activeCodeTab === "models" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      models.py
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCodeTab("schemas");
                      }}
                      className={`px-3 py-2 border-l border-slate-200 transition-colors cursor-pointer ${
                        activeCodeTab === "schemas" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      schemas.py
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCodeTab("docker");
                      }}
                      className={`px-3 py-2 border-l border-slate-200 transition-colors cursor-pointer ${
                        activeCodeTab === "docker" ? "bg-slate-900 text-white font-bold" : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      compose.yml
                    </button>
                  </div>
                </div>

                <div className="p-5 font-mono text-[11px] leading-relaxed bg-slate-950 text-slate-350 relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const contentMap = {
                        database: databasePyContent,
                        main: mainPyContent,
                        models: modelsPyContent,
                        schemas: schemasPyContent,
                        docker: dockerComposeContent
                      };
                      handleCopy(contentMap[activeCodeTab], activeCodeTab);
                    }}
                    className="absolute top-4 right-4 p-1 px-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer z-10"
                  >
                    {copied === activeCodeTab ? <Check className="w-3.5 h-3.5 text-teal-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === activeCodeTab ? "¡Copiado!" : "Copiar Código"}
                  </button>

                  <pre className="overflow-x-auto select-all max-h-80 pr-2">
                    {activeCodeTab === "database" && databasePyContent}
                    {activeCodeTab === "main" && mainPyContent}
                    {activeCodeTab === "models" && modelsPyContent}
                    {activeCodeTab === "schemas" && schemasPyContent}
                    {activeCodeTab === "docker" && dockerComposeContent}
                  </pre>
                </div>
              </div>
            )}
          </div>

        </section>

        {/* Lado Derecho: Panel de Detalles de la Tarea / Hilos de Notas / Trazabilidad en Español */}
        <aside className="w-96 border-l border-slate-200 bg-white flex flex-col justify-between flex-shrink-0 z-10 shadow-sm">
          
          <div className="h-14 border-b border-slate-200 bg-slate-50 px-5 flex items-center justify-between flex-none select-none">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-555 flex items-center gap-1.5 font-sans">
              <Info className="w-3.5 h-3.5 text-indigo-600" /> Detalle de Tarea Seleccionada
            </span>
            {deleteConfirmTaskId === currentTask.id ? (
              <div className="flex items-center gap-1">
                <span className="text-[9px] text-red-600 font-bold uppercase mr-1">¿Eliminar?</span>
                <button
                  onClick={() => handleDeleteTaskSim(currentTask.id)}
                  className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white rounded text-[9px] font-sans font-black uppercase transition-all shadow-xs cursor-pointer"
                >
                  Sí
                </button>
                <button
                  onClick={() => setDeleteConfirmTaskId(null)}
                  className="px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[9px] font-sans font-black uppercase transition-all cursor-pointer"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setDeleteConfirmTaskId(currentTask.id)}
                className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-all cursor-pointer"
                title="Eliminar Tarea"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Único Contenedor Central con Scrollbar Natural y Fluido para Todo el Detalle */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-white scrollbar-thin">
            {/* Cabecera Principal de Datos de Tarea Activa */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                  {currentTask.id}
                </span>
                <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded border ${
                  currentTask.quadrant === "Q1" ? "bg-red-50 text-red-700 border-red-200" :
                  currentTask.quadrant === "Q2" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                  currentTask.quadrant === "Q3" ? "bg-amber-50 text-amber-700 border-amber-200" :
                  "bg-slate-150 text-slate-700 border-slate-250"
                }`}>
                  Cuadrante {currentTask.quadrant}
                </span>
              </div>
              
              <h3 className="text-sm font-black text-slate-900 leading-snug">
                {currentTask.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 border border-slate-100 p-3 rounded-lg font-sans">
                {currentTask.description}
              </p>
            </div>

            {/* Ajuste de Estado Interactivo */}
            <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-3 shadow-xs">
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1 font-mono">
                  Cambiar Estado Transaccional (Postgres):
                </label>
                <div className="flex rounded-lg overflow-hidden border border-slate-200 text-[10px] font-mono bg-slate-50 shadow-inner">
                  {(["TODO", "IN_PROGRESS", "DONE"] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChangeSim(currentTask.id, st)}
                      className={`flex-1 py-1.5 border-r border-slate-200 last:border-0 transition-all cursor-pointer text-center font-bold font-sans ${
                        currentTask.status === st 
                          ? "bg-slate-900 text-white shadow" 
                          : "text-slate-600 bg-white hover:bg-slate-100"
                      }`}
                    >
                      {st === "TODO" ? "POR HACER" : st === "IN_PROGRESS" ? "PROCESANDO" : "COMPLETADO"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1 font-mono">
                  Reasignar Responsable (Delegar):
                </label>
                <select
                  value={currentTask.assigned_to}
                  onChange={(e) => handleReassignSim(currentTask.id, e.target.value)}
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 focus:outline-none bg-white font-mono cursor-pointer"
                >
                  {mockTeamUsers.map(user => (
                    <option key={user.id} value={user.name}>
                      {user.name} ({user.avatar})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1 font-mono">
                  Modificar Plazo / Fecha Límite:
                </label>
                <input
                  type="text"
                  value={currentTask.due_date || ""}
                  onChange={(e) => handleUpdateDueDate(currentTask.id, e.target.value)}
                  placeholder="Ej: Inmediata, Hoy, 29 de Mayo"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:border-slate-900 focus:outline-none bg-white font-sans cursor-text"
                />
              </div>
            </div>

            {/* Tabla Simple de Metadatos */}
            <div className="grid grid-cols-2 gap-3 text-xs border-y border-slate-100 py-3 font-mono">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-widest mb-0.5">Responsable:</span>
                <span className="font-bold text-slate-900">{currentTask.assigned_to}</span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-widest mb-0.5">Creado Por:</span>
                <span className="text-slate-600">{currentTask.created_by}</span>
              </div>
            </div>

            {/* Listado Secuencial de Notas (Hilos de Comentarios) */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 border-b border-slate-100 pb-1.5 font-mono">
                <Activity className="w-3.5 h-3.5 text-indigo-500" /> Hilo Secuencial de Comentarios
              </h4>

              {currentTask.notes.length === 0 ? (
                <div className="p-4 border border-dashed border-slate-200 text-center rounded-lg text-slate-400 text-xs font-sans">
                  No hay comentarios todavía en este hilo transaccional. Añade uno abajo.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {currentTask.notes.map(note => (
                    <div key={note.id} className="p-3 border border-slate-150 bg-slate-50/70 rounded-lg flex flex-col gap-1 relative shadow-xxs">
                      <div className="flex justify-between items-center text-[9px] font-mono">
                        <span className="font-extrabold text-slate-800">{note.user}</span>
                        <span className="text-slate-400">{note.created_at}</span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed font-sans">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Trazamiento de Historias de Delegación */}
            {currentTask.delegation_histories.length > 0 && (
              <div className="space-y-3 pt-1">
                <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
                  <Share2 className="w-3 h-3 text-slate-400" /> Historial de Delegación
                </h5>
                <div className="space-y-2 text-[10px] font-mono text-slate-500 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                  {currentTask.delegation_histories.map(h => (
                    <div key={h.id} className="flex items-center gap-1.5 border-l-2 border-indigo-200 pl-2">
                      <span className="text-slate-600 font-bold">{h.from_user}</span>
                      <span>➜</span>
                      <span className="text-indigo-700 font-bold">{h.to_user}</span>
                      <span className="text-[9px] text-slate-400 font-light ml-auto">({h.assigned_at})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Archivos Adjuntos Asociados con uploader asíncrono real */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <h5 className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5 font-mono">
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" /> Adjuntos Asociados (Volumen Local)
                </h5>
                <label className="text-[10px] font-mono font-bold text-indigo-650 hover:text-indigo-800 hover:underline cursor-pointer flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 transition-all select-none">
                  <span>+ Subir</span>
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {currentTask.attachments.length === 0 ? (
                <div className="p-4 border border-dashed border-slate-200 text-center rounded-lg text-slate-400 text-xs font-sans">
                  Sin adjuntos de arquitectura. ¡Haz clic en "+ Subir" para adjuntar un documento real!
                </div>
              ) : (
                <div className="space-y-1.5 text-[10px] font-mono text-indigo-700">
                  {currentTask.attachments.map(att => (
                    <div key={att.id} className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg border border-slate-200 shadow-xxs">
                      <FileText className="w-3.5 h-3.5 text-slate-500 hover:rotate-6 transition-transform transition-colors" />
                      <div className="flex-1 overflow-hidden">
                        <span className="font-bold text-slate-800 line-clamp-1">{att.file_name}</span>
                        <span className="text-slate-400 text-[8px] block">{att.file_path}</span>
                      </div>
                      <a
                        href={att.file_path}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[8px] bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 py-0.5 px-2 rounded-md uppercase font-bold tracking-wider shrink-0 transition-all cursor-pointer"
                      >
                        Abrir
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Formulario Secuencial Fijo abajo para añadir Notas */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex-none shadow-xs">
            <form onSubmit={handleAddNoteSim} className="relative flex items-center">
              <input
                type="text"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder="Escribe un comentario en esta tarea..."
                className="w-full text-xs p-3.5 pr-11 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 transition-all font-sans"
              />
              <button
                type="submit"
                className="absolute right-2 p-1.5 text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                title="Añadir nota"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </aside>
      </main>

      {/* MODAL / FORMULARIO INTERACTIVO PARA AGREGAR NUEVAS TAREAS */}
      {showAddTaskModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white border border-slate-200 w-full max-w-md rounded-lg shadow-xl overflow-hidden font-sans">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
              <h3 className="font-black text-sm tracking-tight uppercase text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" /> Programar Tarea Colaborativa
              </h3>
              <button 
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-slate-900 font-bold font-mono text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleCreateTaskSim} className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  Título de la Tarea:
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Por ejemplo: Optimizar caché de FastAPI..."
                  className="w-full text-xs p-3 border border-slate-200 rounded focus:border-slate-900 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  Descripción (Opcional):
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Explica detalladamente la solución técnica o dependencias..."
                  rows={3}
                  className="w-full text-xs p-3 border border-slate-200 rounded focus:border-slate-900 focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                    Cuadrante Eisenhower:
                  </label>
                  <select
                    value={newQuadrant}
                    onChange={(e) => setNewQuadrant(e.target.value as any)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded focus:border-slate-900 focus:outline-none font-mono bg-white"
                  >
                    <option value="Q1">Q1: Urgente & Importante</option>
                    <option value="Q2">Q2: No Urgente & Importante</option>
                    <option value="Q3">Q3: Urgente & No Importante</option>
                    <option value="Q4">Q4: No Urgente & No Importante</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                    Asignar Colaborador:
                  </label>
                  <select
                    value={newAssignee}
                    onChange={(e) => setNewAssignee(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-200 rounded focus:border-slate-900 focus:outline-none font-mono bg-white"
                  >
                    {mockTeamUsers.map(user => (
                      <option key={user.id} value={user.name}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">
                  Plazo / Fecha Límite:
                </label>
                <input
                  type="text"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  placeholder="Por ejemplo: Mañana, Lunes 1 de Junio, Inmediata"
                  className="w-full text-xs p-3 border border-slate-200 rounded focus:border-slate-900 focus:outline-none font-sans"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 border border-slate-250 text-slate-600 rounded text-xs font-mono font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-mono font-bold uppercase transition-all shadow-sm cursor-pointer"
                >
                  Crear en DB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer Estilo Barra de Herramientas de Consola de Base de Datos */}
      <footer className="h-8 bg-slate-900 text-[10px] text-slate-400 px-6 flex items-center justify-between font-mono flex-shrink-0 z-20">
        <div className="flex gap-4">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            FASTAPI: ACTIVO
          </span>
          <span className="hidden sm:inline">DB: CONECTADA (12ms)</span>
          <span className="hidden md:inline">VOLUMEN INTEGRADO: /app/uploads (98% libre)</span>
        </div>
        <div>MatrixOS Core v1.1.2-Integrado</div>
      </footer>
    </div>
  );
}
