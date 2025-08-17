from fastapi import APIRouter, BackgroundTasks, Depends
from redis import asyncio as aioredis

from .security import get_redis
from .services.notifications import enqueue_invite, enqueue_publish

router = APIRouter(prefix="/background", tags=["background"])


@router.post("/invite")
async def invite_job(
    payload: dict,
    tasks: BackgroundTasks,
    redis: aioredis.Redis = Depends(get_redis),
):
    """Queue an invite notification job."""

    tasks.add_task(enqueue_invite, redis, payload)
    return {"queued": True}


@router.post("/publish")
async def publish_job(
    payload: dict,
    tasks: BackgroundTasks,
    redis: aioredis.Redis = Depends(get_redis),
):
    """Queue a publish notification job."""

    tasks.add_task(enqueue_publish, redis, payload)
    return {"queued": True}


__all__ = ["router"]

