import pytest

@pytest.mark.asyncio
async def test_health(async_client):
    resp = await async_client.get("/healthz")
    assert resp.status_code == 200
    data = resp.json()
    assert data["ok"] is True
    assert "version" in data
