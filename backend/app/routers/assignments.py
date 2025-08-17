from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import models, schemas
from ..db import get_session
from ..security import require_auth
from ..rate_limit import rate_limit

router = APIRouter(prefix="/assignments", tags=["assignments"])

@router.post("/", dependencies=[Depends(rate_limit)])
async def create_assignment(
    assignment_in: schemas.AssignmentIn,
    session: AsyncSession = Depends(get_session),
    user: models.User = Depends(require_auth),
):
    mission = await session.get(models.Mission, assignment_in.mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    assignment = models.Assignment(
        mission_id=assignment_in.mission_id,
        user_id=assignment_in.user_id,
        role_label=assignment_in.role_label,
        status=assignment_in.status,
        channel=assignment_in.channel,
        responded_at=assignment_in.responded_at,
    )
    session.add(assignment)
    await session.commit()
    await session.refresh(assignment)
    return schemas.AssignmentOut.model_validate(assignment)

@router.get("/mission/{mission_id}")
async def list_assignments(
    mission_id: int,
    session: AsyncSession = Depends(get_session),
    user: models.User = Depends(require_auth),
):
    result = await session.execute(select(models.Assignment).where(models.Assignment.mission_id == mission_id))
    assignments = result.scalars().all()
    return [schemas.AssignmentOut.model_validate(a) for a in assignments]
