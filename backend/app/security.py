import secrets
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from passlib.context import CryptContext
from redis import asyncio as aioredis
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .config import settings
from .db import get_session
from . import models

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
http_bearer = HTTPBearer(auto_error=False)
redis = aioredis.from_url(settings.redis_url, decode_responses=True)


async def get_redis() -> aioredis.Redis:
    yield redis


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


async def create_access_token(user_id: int, redis: aioredis.Redis) -> str:
    token = secrets.token_hex(16)
    ttl = settings.token_ttl_min * 60
    await redis.set(f"token:{token}", str(user_id), ex=ttl)
    return token


async def require_auth(
    credentials: HTTPAuthorizationCredentials | None = Depends(http_bearer),
    session: AsyncSession = Depends(get_session),
    redis: aioredis.Redis = Depends(get_redis),
) -> models.User:
    if credentials is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )
    token = credentials.credentials
    user_id = await redis.get(f"token:{token}")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    stmt = select(models.User).where(models.User.id == int(user_id))
    result = await session.execute(stmt)
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )
    return user


async def require_admin(
    user: models.User = Depends(require_auth),
) -> models.User:
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough privileges")
    return user
