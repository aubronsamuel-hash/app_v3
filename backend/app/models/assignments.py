from __future__ import annotations

from datetime import datetime
import enum
from typing import Optional
from sqlalchemy import DateTime, Integer, String, ForeignKey, Index, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..db import Base

class AssignmentStatus(str, enum.Enum):
    invited = "invited"
    confirmed = "confirmed"
    declined = "declined"
    removed = "removed"

class Assignment(Base):
    __tablename__ = "assignments"
    __table_args__ = (Index("ix_assignments_user", "user_id"),)

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    mission_id: Mapped[int] = mapped_column(ForeignKey("missions.id"))
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    role_label: Mapped[str] = mapped_column(String(50))
    status: Mapped[AssignmentStatus] = mapped_column(Enum(AssignmentStatus), default=AssignmentStatus.invited)
    channel: Mapped[str | None] = mapped_column(String(50), nullable=True)
    responded_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    mission: Mapped["Mission"] = relationship(back_populates="assignments")
    user: Mapped[Optional["User"]] = relationship(back_populates="assignments")
