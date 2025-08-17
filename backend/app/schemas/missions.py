from datetime import datetime
from typing import List
from pydantic import BaseModel, Field, field_validator, model_validator


class Position(BaseModel):
    label: str
    count: int = Field(..., ge=1)
    skills: dict = Field(default_factory=dict)


class MissionBase(BaseModel):
    title: str
    start: datetime
    end: datetime
    location: str
    call_time: datetime | None = None
    positions: List[Position] = Field(default_factory=list)
    documents: List[str] = Field(default_factory=list)
    status: str = "draft"

    @field_validator("end")
    @classmethod
    def validate_end(cls, v, info):
        start = info.data.get("start")
        if start and v <= start:
            raise ValueError("end must be after start")
        return v

    @model_validator(mode="after")
    def unique_positions(self):
        labels = [p.label for p in self.positions]
        if len(labels) != len(set(labels)):
            raise ValueError("position labels must be unique")
        return self


class MissionIn(MissionBase):
    pass


class MissionOut(MissionBase):
    id: int
    created_by: int

    class Config:
        from_attributes = True
