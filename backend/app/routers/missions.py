from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from .. import models, schemas
from ..deps import get_current_user, get_db

router = APIRouter(prefix="/missions", tags=["missions"])


@router.get("/", response_model=List[schemas.MissionRead])
async def list_missions(db: AsyncSession = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    stmt = select(models.Mission)
    result = await db.execute(stmt)
    return result.scalars().all()


@router.post("/", response_model=schemas.MissionRead)
async def create_mission(
    mission: schemas.MissionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    obj = models.Mission(**mission.dict(), owner_id=current_user.id)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj


@router.put("/{mission_id}", response_model=schemas.MissionRead)
async def update_mission(
    mission_id: int,
    mission: schemas.MissionCreate,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    stmt = select(models.Mission).where(models.Mission.id == mission_id)
    result = await db.execute(stmt)
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail="Mission not found")
    for k, v in mission.dict().items():
        setattr(obj, k, v)
    await db.commit()
    await db.refresh(obj)
    return obj


@router.delete("/{mission_id}")
async def delete_mission(
    mission_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    stmt = select(models.Mission).where(models.Mission.id == mission_id)
    result = await db.execute(stmt)
    obj = result.scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail="Mission not found")
    await db.delete(obj)
    await db.commit()
    return {"ok": True}
