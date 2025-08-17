import time
from fastapi import Depends, HTTPException, Request, status
from redis import asyncio as aioredis

from .config import settings
from .security import get_redis, require_auth
from . import models

async def rate_limit(
    request: Request,
    redis: aioredis.Redis = Depends(get_redis),
    user: models.User | None = Depends(require_auth),
    limit: int = settings.rate_limit_per_min,
) -> None:
    identifier = user.id if user else request.client.host
    now = int(time.time())
    window = now // 60
    key = f"rl:{identifier}:{window}"
    count = await redis.incr(key)
    if count == 1:
        await redis.expire(key, 60)
    if count > limit:
        raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Rate limit exceeded")
