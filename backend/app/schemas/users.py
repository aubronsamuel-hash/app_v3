from datetime import datetime
from pydantic import BaseModel, Field

class UserBase(BaseModel):
    username: str
    email: str
    role: str = "intermittent"
    prefs: dict = Field(default_factory=dict)

class UserIn(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
