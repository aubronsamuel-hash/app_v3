import pytest_asyncio
import asyncio
from httpx import ASGITransport
import pytest
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.main import app
from app import deps, models, security

TEST_DB_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture
async def async_client() -> AsyncClient:
    engine = create_async_engine(TEST_DB_URL)
    TestSession = async_sessionmaker(engine, expire_on_commit=False)
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)
    async def override_get_db() -> AsyncSession:
        async with TestSession() as session:
            yield session
    app.dependency_overrides[deps.get_db] = override_get_db
    # seed admin user
    async with TestSession() as session:
        admin = models.User(
            username="admin", password_hash=security.get_password_hash("admin"), role="admin"
        )
        session.add(admin)
        await session.commit()
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as client:
        yield client
    app.dependency_overrides.clear()
