import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from fakeredis import aioredis

from app.main import app
from app import models
from app.db import Base, get_session
from app.security import get_redis, hash_password

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture
async def async_client() -> AsyncClient:
    engine = create_async_engine(TEST_DB_URL)
    TestSession = async_sessionmaker(engine, expire_on_commit=False)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async def override_get_session():
        async with TestSession() as session:
            yield session

    fake_redis = aioredis.FakeRedis()

    async def override_get_redis():
        yield fake_redis

    app.dependency_overrides[get_session] = override_get_session
    app.dependency_overrides[get_redis] = override_get_redis

    async with TestSession() as session:
        admin = models.User(
            username="admin",
            email="admin@example.com",
            hashed_password=hash_password("admin"),
            role=models.UserRole.admin,
            prefs={},
        )
        session.add(admin)
        await session.commit()

    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
    ) as client:
        yield client

    app.dependency_overrides.clear()
