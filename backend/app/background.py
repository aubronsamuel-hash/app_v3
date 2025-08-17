from redis import asyncio as aioredis
from .security import get_redis

QUEUE_KEY = "notifications"

async def enqueue_notification(message: str, redis: aioredis.Redis):
    await redis.lpush(QUEUE_KEY, message)

async def dequeue_notification(redis: aioredis.Redis):
    return await redis.rpop(QUEUE_KEY)
