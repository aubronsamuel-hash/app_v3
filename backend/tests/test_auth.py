import pytest


@pytest.mark.asyncio
async def test_login(async_client):
    resp = await async_client.post("/auth/token", data={"username": "admin", "password": "admin"})
    assert resp.status_code == 200
    assert "access_token" in resp.json()
