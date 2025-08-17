import pytest

@pytest.mark.asyncio
async def test_create_user(async_client):
    resp = await async_client.post("/auth/token", data={"username": "admin", "password": "admin"})
    token = resp.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "username": "bob",
        "email": "bob@example.com",
        "password": "secret",
        "role": "intermittent",
    }
    resp = await async_client.post("/admin/users", json=payload, headers=headers)
    assert resp.status_code == 200
    assert resp.json()["username"] == "bob"
