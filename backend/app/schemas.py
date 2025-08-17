from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class UserBase(BaseModel):
    username: str
    role: str = "intermittent"


class UserCreate(UserBase):
    password: str = Field(min_length=4)


class UserRead(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class MissionBase(BaseModel):
    title: str
    description: Optional[str] = None


class MissionCreate(MissionBase):
    pass


class MissionRead(MissionBase):
    id: int
    published: bool
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True
