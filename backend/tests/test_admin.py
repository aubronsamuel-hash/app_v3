import pytest
import pytest


@pytest.mark.skip("pending auth")
@pytest.mark.asyncio
async def test_create_user(async_client):
    resp = await async_client.post(
        "/auth/token",
        data={"username": "admin", "password": "admin"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    resp = await async_client.post(
        "/admin/users",
        json={"username": "bob", "password": "secret", "role": "intermittent"},
        headers=headers,
    )
    assert resp.status_code == 200
    assert resp.json()["username"] == "bob"
