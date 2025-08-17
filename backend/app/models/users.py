from datetime import datetime
from sqlalchemy import DateTime, Integer, String, JSON, Enum, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..db import Base
import enum

class UserRole(str, enum.Enum):
    admin = "admin"
    intermittent = "intermittent"

class User(Base):
    __tablename__ = "users"
    __table_args__ = (Index("ix_users_email", "email", unique=True),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(255))
    hashed_password: Mapped[str] = mapped_column(String(128))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.intermittent)
    prefs: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    assignments: Mapped[list["Assignment"]] = relationship(back_populates="user")
    missions: Mapped[list["Mission"]] = relationship(back_populates="creator")
