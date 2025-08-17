import pytest
from datetime import datetime, timedelta


@pytest.mark.asyncio
async def test_mission_crud(async_client):
    resp = await async_client.post(
        "/auth/token",
        data={"username": "admin", "password": "admin"},
    )
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    now = datetime.utcnow()
    mission_in = {
        "title": "Test Mission",
        "start": now.isoformat(),
        "end": (now + timedelta(hours=1)).isoformat(),
        "location": "Paris",
        "positions": [{"label": "Tech", "count": 1}],
    }
    resp = await async_client.post(
        "/missions/",
        json=mission_in,
        headers=headers,
    )
    assert resp.status_code == 200
    mission_id = resp.json()["id"]
    resp = await async_client.get("/missions/", headers=headers)
    assert any(m["id"] == mission_id for m in resp.json())
