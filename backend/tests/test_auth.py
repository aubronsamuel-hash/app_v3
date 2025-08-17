import pytest


@pytest.mark.asyncio
async def test_login(async_client):
    resp = await async_client.post(
        "/auth/token",
        data={"username": "admin", "password": "admin"},
    )
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    resp2 = await async_client.get("/missions/", headers=headers)
    assert resp2.status_code == 200
