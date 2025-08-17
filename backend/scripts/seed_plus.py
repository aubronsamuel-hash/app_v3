import asyncio

from app import models, security, storage


async def main() -> None:
    async with storage.get_session() as session:
        admin = models.User(
            username="admin",
            password_hash=security.get_password_hash("admin"),
            role="admin",
        )
        session.add(admin)
        await session.commit()

        mission = models.Mission(title="Demo Mission", description="First mission", owner_id=admin.id, published=True)
        session.add(mission)
        await session.commit()


if __name__ == "__main__":
    asyncio.run(main())
