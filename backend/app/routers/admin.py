from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import models, schemas, security
from ..deps import get_admin_user, get_db

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/users", response_model=List[schemas.UserRead])
async def list_users(db: AsyncSession = Depends(get_db), admin: models.User = Depends(get_admin_user)):
    result = await db.execute(select(models.User))
    return result.scalars().all()


@router.post("/users", response_model=schemas.UserRead)
async def create_user(
    user: schemas.UserCreate,
    db: AsyncSession = Depends(get_db),
    admin: models.User = Depends(get_admin_user),
):
    hashed = security.get_password_hash(user.password)
    obj = models.User(username=user.username, password_hash=hashed, role=user.role)
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj
