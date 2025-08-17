import json
import pytest
from fakeredis import aioredis as fakeredis

from app.services.notifications import (
    QUEUE_KEY,
    enqueue_invite,
    enqueue_publish,
)


@pytest.mark.asyncio
async def test_enqueue_invite():
    redis = fakeredis.FakeRedis()
    payload = {"email": "a@example.com"}
    await enqueue_invite(redis, payload)
    raw = await redis.rpop(QUEUE_KEY)
    job = json.loads(raw)
    assert job["type"] == "invite"
    assert job["data"] == payload


@pytest.mark.asyncio
async def test_enqueue_publish():
    redis = fakeredis.FakeRedis()
    payload = {"message": "hello"}
    await enqueue_publish(redis, payload)
    raw = await redis.rpop(QUEUE_KEY)
    job = json.loads(raw)
    assert job["type"] == "publish"
    assert job["data"] == payload
