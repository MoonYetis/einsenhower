from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field
from app.models import Quadrant, TaskStatus, TeamRole

# ==========================================
# USER SCHEMAS
# ==========================================
class UserBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, examples=["John Doe"])
    email: EmailStr = Field(..., examples=["john.doe@example.com"])

class LoginRequest(BaseModel):
    email: EmailStr = Field(..., examples=["john.doe@example.com"])
    password: str = Field(..., min_length=6, examples=["secret_pass123"])

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, examples=["secret_pass123"])

class UserUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=6)

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True


# ==========================================
# TEAM SCHEMAS
# ==========================================
class TeamBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100, examples=["Project Omega Team"])

class TeamCreate(TeamBase):
    pass

class TeamResponse(TeamBase):
    id: int
    created_by: int

    class Config:
        from_attributes = True


class TeamMemberBase(BaseModel):
    user_id: int
    role: TeamRole = TeamRole.MEMBER

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberResponse(BaseModel):
    team_id: int
    user_id: int
    role: TeamRole
    user: UserResponse

    class Config:
        from_attributes = True


# ==========================================
# TASK ATTACHMENT SCHEMAS
# ==========================================
class TaskAttachmentBase(BaseModel):
    file_name: str
    file_path: str

class TaskAttachmentResponse(TaskAttachmentBase):
    id: int
    task_id: int
    uploaded_by: int
    uploaded_at: datetime

    class Config:
        from_attributes = True


# ==========================================
# TASK NOTE SCHEMAS
# ==========================================
class TaskNoteBase(BaseModel):
    content: str = Field(..., min_length=1, examples=["Reviewing user comments for Q1 priority adjustments."])

class TaskNoteCreate(TaskNoteBase):
    pass

class TaskNoteResponse(TaskNoteBase):
    id: int
    task_id: int
    user_id: int
    created_at: datetime
    user: UserResponse

    class Config:
        from_attributes = True


# ==========================================
# DELEGATION HISTORY SCHEMAS
# ==========================================
class DelegationHistoryResponse(BaseModel):
    id: int
    task_id: int
    from_user_id: int
    to_user_id: int
    assigned_at: datetime
    from_user: UserResponse
    to_user: UserResponse

    class Config:
        from_attributes = True


# ==========================================
# TASK SCHEMAS
# ==========================================
class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, examples=["Fix Production API Crash"])
    description: Optional[str] = Field(None, examples=["Check memory leaks and container CPU spikes"])
    quadrant: Quadrant = Field(default=Quadrant.Q1, description="Matriz de Eisenhower Q1-Q4")
    status: TaskStatus = Field(default=TaskStatus.TODO)
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    team_id: int
    assigned_to: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    quadrant: Optional[Quadrant] = None
    status: Optional[TaskStatus] = None
    assigned_to: Optional[int] = None
    due_date: Optional[datetime] = None

class TaskResponse(TaskBase):
    id: int
    created_by: Optional[int]
    status: TaskStatus
    team_id: int
    created_at: datetime
    updated_at: datetime
    
    creator: Optional[UserResponse] = None
    assignee: Optional[UserResponse] = None
    notes: List[TaskNoteResponse] = []
    attachments: List[TaskAttachmentResponse] = []
    delegation_histories: List[DelegationHistoryResponse] = []

    class Config:
        from_attributes = True


# ==========================================
# COMPLEX TEAM EXPANDED SCHEMAS
# ==========================================
class TeamDetailResponse(TeamResponse):
    members: List[TeamMemberResponse] = []
    tasks_count: int = 0

    class Config:
        from_attributes = True
