import pytest
import pytest


@pytest.mark.skip("pending auth")
@pytest.mark.asyncio
async def test_mission_crud(async_client):
    resp = await async_client.post(
        "/auth/token",
        data={"username": "admin", "password": "admin"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    resp = await async_client.post(
        "/missions/",
        json={"title": "Test", "description": "desc"},
        headers=headers,
    )
    assert resp.status_code == 200
    mission_id = resp.json()["id"]
    resp = await async_client.get("/missions/", headers=headers)
    assert any(m["id"] == mission_id for m in resp.json())
