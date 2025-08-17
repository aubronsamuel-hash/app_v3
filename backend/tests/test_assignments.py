import pytest
from datetime import datetime, timedelta


@pytest.mark.asyncio
async def test_assignment_crud(async_client):
    resp = await async_client.post(
        "/auth/token",
        data={"username": "admin", "password": "admin"},
    )
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    now = datetime.utcnow()
    mission_in = {
        "title": "Mission",
        "start": now.isoformat(),
        "end": (now + timedelta(hours=1)).isoformat(),
        "location": "Paris",
    }
    resp = await async_client.post(
        "/missions/",
        json=mission_in,
        headers=headers,
    )
    mission_id = resp.json()["id"]
    assignment_in = {
        "mission_id": mission_id,
        "user_id": 1,
        "role_label": "Tech",
    }
    resp = await async_client.post(
        "/assignments/",
        json=assignment_in,
        headers=headers,
    )
    assert resp.status_code == 200
    assignment_id = resp.json()["id"]
    resp = await async_client.get(
        f"/assignments/mission/{mission_id}",
        headers=headers,
    )
    assert any(a["id"] == assignment_id for a in resp.json())
