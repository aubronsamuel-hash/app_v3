from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import models, schemas
from ..db import get_session
from ..security import require_auth
from ..rate_limit import rate_limit

router = APIRouter(prefix="/missions", tags=["missions"])

@router.get("/")
async def list_missions(
    session: AsyncSession = Depends(get_session),
    user: models.User = Depends(require_auth),
):
    result = await session.execute(select(models.Mission))
    missions = result.scalars().all()
    return [schemas.MissionOut.model_validate(m) for m in missions]

@router.post("/", dependencies=[Depends(rate_limit)])
async def create_mission(
    mission_in: schemas.MissionIn,
    session: AsyncSession = Depends(get_session),
    user: models.User = Depends(require_auth),
):
    mission = models.Mission(
        title=mission_in.title,
        start=mission_in.start,
        end=mission_in.end,
        location=mission_in.location,
        call_time=mission_in.call_time,
        positions=[p.model_dump() for p in mission_in.positions],
        documents=mission_in.documents,
        status=mission_in.status,
        created_by=user.id,
    )
    session.add(mission)
    await session.commit()
    await session.refresh(mission)
    return schemas.MissionOut.model_validate(mission)

@router.get("/{mission_id}")
async def get_mission(
    mission_id: int,
    session: AsyncSession = Depends(get_session),
    user: models.User = Depends(require_auth),
):
    mission = await session.get(models.Mission, mission_id)
    if not mission:
        raise HTTPException(status_code=404, detail="Mission not found")
    return schemas.MissionOut.model_validate(mission)
