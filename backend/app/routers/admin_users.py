from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import models, schemas
from ..db import get_session
from ..security import require_admin, hash_password

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/users", response_model=List[schemas.UserOut])
async def list_users(
    session: AsyncSession = Depends(get_session),
    admin: models.User = Depends(require_admin),
):
    result = await session.execute(select(models.User))
    users = result.scalars().all()
    return [schemas.UserOut.model_validate(u) for u in users]

@router.post("/users", response_model=schemas.UserOut)
async def create_user(
    user_in: schemas.UserIn,
    session: AsyncSession = Depends(get_session),
    admin: models.User = Depends(require_admin),
):
    stmt = select(models.User).where(models.User.username == user_in.username)
    if (await session.execute(stmt)).scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already exists")
    user = models.User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hash_password(user_in.password),
        role=user_in.role,
        prefs=user_in.prefs,
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return schemas.UserOut.model_validate(user)
