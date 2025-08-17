from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .. import models, schemas
from ..db import get_session
from ..security import verify_password, hash_password, create_access_token, get_redis

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/token")
async def login(
    form: OAuth2PasswordRequestForm = Depends(),
    session: AsyncSession = Depends(get_session),
    redis = Depends(get_redis),
):
    stmt = select(models.User).where(models.User.username == form.username)
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()
    if not user or not verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    token = await create_access_token(user.id, redis)
    return {"access_token": token, "token_type": "bearer"}

@router.post("/register")
async def register(user_in: schemas.UserIn, session: AsyncSession = Depends(get_session)):
    stmt = select(models.User).where(models.User.username == user_in.username)
    if (await session.execute(stmt)).scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Username already taken")
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
