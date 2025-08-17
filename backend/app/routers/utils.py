from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from ..db import get_session
from ..security import get_redis
from ..config import settings

router = APIRouter(tags=["utils"])


@router.get("/healthz")
async def healthz(
    session: AsyncSession = Depends(get_session),
    redis=Depends(get_redis),
):
    db_ok = True
    try:
        await session.execute(text("SELECT 1"))
    except Exception:
        db_ok = False
    redis_ok = True
    try:
        await redis.ping()
    except Exception:
        redis_ok = False
    return {
        "ok": True,
        "db": db_ok,
        "redis": redis_ok,
        "version": settings.version,
    }
