"""Seed the database with demo data.

This script creates an admin user along with a configurable amount of
additional users, missions and assignments.  It is designed to run inside the
API container and uses the same asynchronous SQLAlchemy session as the
application itself.

Options
-------
--reset    Drop all existing tables before seeding.
--users N  Number of additional users to create.
--missions N  Number of missions to create per day.
--days D   Number of consecutive days for which missions are generated.
--all      Convenience flag equivalent to ``--reset`` with default counts.

The script prints statistics about the inserted rows and displays the admin
credentials at the end so that the caller can immediately authenticate against
the API.
"""

from __future__ import annotations

import argparse
import asyncio
import random
from datetime import datetime, timedelta

from app.db import Base, SessionLocal, engine
from app.models.users import User, UserRole
from app.models.missions import Mission, MissionStatus
from app.models.assignments import Assignment, AssignmentStatus
from app.security import hash_password


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Seed database with demo data")
    parser.add_argument("--reset", action="store_true", help="Reset database before seeding")
    parser.add_argument("--users", type=int, default=5, help="Number of regular users to create")
    parser.add_argument(
        "--missions", type=int, default=3, help="Number of missions per day"
    )
    parser.add_argument("--days", type=int, default=3, help="Number of days to generate missions for")
    parser.add_argument(
        "--all",
        action="store_true",
        help="Reset database and load a full demo dataset",
    )
    args = parser.parse_args()
    if args.all:
        args.reset = True
    return args


async def _reset_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)


async def _create_admin(session) -> User:
    admin = User(
        username="admin",
        email="admin@example.com",
        hashed_password=hash_password("admin"),
        role=UserRole.admin,
        prefs={},
    )
    session.add(admin)
    await session.flush()  # populate admin.id
    return admin


async def _create_users(session, count: int) -> list[User]:
    skills = ["camera", "sound", "light", "grip"]
    users: list[User] = []
    for i in range(1, count + 1):
        skill = random.choice(skills)
        user = User(
            username=f"user{i}",
            email=f"user{i}@example.com",
            hashed_password=hash_password("password"),
            role=UserRole.intermittent,
            prefs={"skills": {skill: 1}},
        )
        session.add(user)
        users.append(user)
    await session.flush()
    return users


async def _create_missions(
    session, *, creator: User, users: list[User], missions_per_day: int, days: int
) -> tuple[list[Mission], list[Assignment]]:
    missions: list[Mission] = []
    assignments: list[Assignment] = []
    now = datetime.utcnow()
    for day in range(days):
        day_start = now + timedelta(days=day)
        for m in range(missions_per_day):
            start = day_start + timedelta(hours=m * 3)
            end = start + timedelta(hours=2)
            mission = Mission(
                title=f"Mission {day * missions_per_day + m + 1}",
                start=start,
                end=end,
                location="Studio",
                call_time=start - timedelta(minutes=30),
                positions=[
                    {"label": "Tech", "count": 1},
                    {"label": "Grip", "count": 1},
                ],
                status=MissionStatus.published,
                created_by=creator.id,
            )
            session.add(mission)
            missions.append(mission)
    await session.flush()  # ensure mission IDs are available

    for mission in missions:
        for pos in mission.positions:
            for _ in range(pos.get("count", 1)):
                if not users:
                    break
                user = random.choice(users)
                assignment = Assignment(
                    mission_id=mission.id,
                    user_id=user.id,
                    role_label=pos["label"],
                    status=AssignmentStatus.confirmed,
                )
                session.add(assignment)
                assignments.append(assignment)

    await session.flush()
    return missions, assignments


async def main() -> None:
    args = _parse_args()

    if args.reset:
        await _reset_db()
    else:
        # Ensure tables exist if not resetting
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)

    async with SessionLocal() as session:
        admin = await _create_admin(session)
        users = await _create_users(session, args.users)
        missions, assignments = await _create_missions(
            session,
            creator=admin,
            users=users,
            missions_per_day=args.missions,
            days=args.days,
        )
        await session.commit()

    print("Seeding completed:")
    print(f"  users: {len(users) + 1}")
    print(f"  missions: {len(missions)}")
    print(f"  assignments: {len(assignments)}")
    print()
    print("Admin credentials -> username: admin  password: admin")


if __name__ == "__main__":
    asyncio.run(main())

