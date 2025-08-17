from datetime import datetime
from pydantic import BaseModel


class AssignmentBase(BaseModel):
    mission_id: int
    user_id: int | None = None
    role_label: str
    status: str = "invited"
    channel: str | None = None
    responded_at: datetime | None = None


class AssignmentIn(AssignmentBase):
    pass


class AssignmentOut(AssignmentBase):
    id: int

    class Config:
        from_attributes = True
