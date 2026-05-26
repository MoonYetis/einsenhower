from enum import Enum as PyEnum
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Integer, ForeignKey, DateTime, Enum, Text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Quadrant(str, PyEnum):
    Q1 = "Q1"  # Urgente / Importante
    Q2 = "Q2"  # No Urgente / Importante
    Q3 = "Q3"  # Urgente / No Importante
    Q4 = "Q4"  # No Urgente / No Importante

class TaskStatus(str, PyEnum):
    TODO = "TODO"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"

class TeamRole(str, PyEnum):
    ADMIN = "ADMIN"
    MEMBER = "MEMBER"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)

    # Relationships
    created_teams: Mapped[List["Team"]] = relationship("Team", back_populates="creator", foreign_keys="Team.created_by")
    team_memberships: Mapped[List["TeamMember"]] = relationship("TeamMember", back_populates="user", cascade="all, delete-orphan")
    created_tasks: Mapped[List["Task"]] = relationship("Task", back_populates="creator", foreign_keys="Task.created_by")
    assigned_tasks: Mapped[List["Task"]] = relationship("Task", back_populates="assignee", foreign_keys="Task.assigned_to")
    notes: Mapped[List["TaskNote"]] = relationship("TaskNote", back_populates="user")
    attachments: Mapped[List["TaskAttachment"]] = relationship("TaskAttachment", back_populates="user")
    
    delegations_sent: Mapped[List["DelegationHistory"]] = relationship("DelegationHistory", back_populates="from_user", foreign_keys="DelegationHistory.from_user_id")
    delegations_received: Mapped[List["DelegationHistory"]] = relationship("DelegationHistory", back_populates="to_user", foreign_keys="DelegationHistory.to_user_id")


class Team(Base):
    __tablename__ = "teams"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Relationships
    creator: Mapped["User"] = relationship("User", back_populates="created_teams", foreign_keys=[created_by])
    members: Mapped[List["TeamMember"]] = relationship("TeamMember", back_populates="team", cascade="all, delete-orphan")
    tasks: Mapped[List["Task"]] = relationship("Task", back_populates="team", cascade="all, delete-orphan")


class TeamMember(Base):
    __tablename__ = "team_members"

    team_id: Mapped[int] = mapped_column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    role: Mapped[TeamRole] = mapped_column(Enum(TeamRole), default=TeamRole.MEMBER, nullable=False)

    # Relationships
    team: Mapped["Team"] = relationship("Team", back_populates="members")
    user: Mapped["User"] = relationship("User", back_populates="team_memberships")


class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    quadrant: Mapped[Quadrant] = mapped_column(Enum(Quadrant), nullable=False)
    status: Mapped[TaskStatus] = mapped_column(Enum(TaskStatus), default=TaskStatus.TODO, nullable=False)
    
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    assigned_to: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    team_id: Mapped[int] = mapped_column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)
    due_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    creator: Mapped[Optional["User"]] = relationship("User", back_populates="created_tasks", foreign_keys=[created_by])
    assignee: Mapped[Optional["User"]] = relationship("User", back_populates="assigned_tasks", foreign_keys=[assigned_to])
    team: Mapped["Team"] = relationship("Team", back_populates="tasks")
    
    notes: Mapped[List["TaskNote"]] = relationship("TaskNote", back_populates="task", cascade="all, delete-orphan", order_by="TaskNote.created_at.asc()")
    attachments: Mapped[List["TaskAttachment"]] = relationship("TaskAttachment", back_populates="task", cascade="all, delete-orphan")
    delegation_histories: Mapped[List["DelegationHistory"]] = relationship("DelegationHistory", back_populates="task", cascade="all, delete-orphan")


class TaskNote(Base):
    __tablename__ = "task_notes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    task_id: Mapped[int] = mapped_column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    content: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)

    # Relationships
    task: Mapped["Task"] = relationship("Task", back_populates="notes")
    user: Mapped["User"] = relationship("User", back_populates="notes")


class TaskAttachment(Base):
    __tablename__ = "task_attachments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    task_id: Mapped[int] = mapped_column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(512), nullable=False)
    uploaded_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)

    # Relationships
    task: Mapped["Task"] = relationship("Task", back_populates="attachments")
    user: Mapped["User"] = relationship("User", back_populates="attachments")


class DelegationHistory(Base):
    __tablename__ = "delegation_histories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    task_id: Mapped[int] = mapped_column(Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False)
    from_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    to_user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    assigned_at: Mapped[datetime] = mapped_column(DateTime, default=func.now(), nullable=False)

    # Relationships
    task: Mapped["Task"] = relationship("Task", back_populates="delegation_histories")
    from_user: Mapped["User"] = relationship("User", back_populates="delegations_sent", foreign_keys=[from_user_id])
    to_user: Mapped["User"] = relationship("User", back_populates="delegations_received", foreign_keys=[to_user_id])
