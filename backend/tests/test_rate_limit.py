import pytest
from datetime import datetime, timedelta
from fastapi import Depends, Request
from redis import asyncio as aioredis

from app.rate_limit import rate_limit as real_rate_limit
from app.security import get_redis, require_auth
from app import models
from app.main import app


@pytest.mark.asyncio
async def test_rate_limit(async_client):
    async def limited_rate_limit(
        request: Request,
        redis: aioredis.Redis = Depends(get_redis),
        user: models.User | None = Depends(require_auth),
    ) -> None:
        await real_rate_limit(request, redis, user, limit=2)
    app.dependency_overrides[real_rate_limit] = limited_rate_limit
    try:
        resp = await async_client.post(
            "/auth/token",
            data={"username": "admin", "password": "admin"},
        )
        token = resp.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        now = datetime.utcnow()
        mission = {
            "title": "RL Mission",
            "start": now.isoformat(),
            "end": (now + timedelta(hours=1)).isoformat(),
            "location": "Paris",
            "positions": [{"label": "Tech", "count": 1}],
        }
        for i in range(2):
            mission["title"] = f"RL Mission {i}"
            res = await async_client.post(
                "/missions/",
                json=mission,
                headers=headers,
            )
            assert res.status_code == 200
        mission["title"] = "RL Mission last"
        res = await async_client.post(
            "/missions/",
            json=mission,
            headers=headers,
        )
        assert res.status_code == 429
    finally:
        app.dependency_overrides.pop(real_rate_limit, None)
