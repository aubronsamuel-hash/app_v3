from datetime import datetime
from sqlalchemy import DateTime, Integer, String, JSON, ForeignKey, Enum, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from ..db import Base
import enum

class MissionStatus(str, enum.Enum):
    draft = "draft"
    published = "published"

class Mission(Base):
    __tablename__ = "missions"
    __table_args__ = (
        Index("ix_missions_start", "start"),
        Index("ix_missions_end", "end"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    start: Mapped[datetime] = mapped_column(DateTime)
    end: Mapped[datetime] = mapped_column(DateTime)
    location: Mapped[str] = mapped_column(String(200))
    call_time: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    positions: Mapped[list] = mapped_column(JSON, default=list)
    documents: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[MissionStatus] = mapped_column(Enum(MissionStatus), default=MissionStatus.draft)
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id"))

    creator: Mapped["User"] = relationship(back_populates="missions")
    assignments: Mapped[list["Assignment"]] = relationship(back_populates="mission", cascade="all, delete-orphan")
