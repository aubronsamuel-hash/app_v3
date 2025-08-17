import asyncio
import argparse
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Any

from sqlalchemy import select

from app.db import Base, SessionLocal, engine
from app.models.users import User, UserRole
from app.models.missions import Mission, MissionStatus
from app.models.assignments import Assignment, AssignmentStatus
from app.security import hash_password


def _dt(value: str | None) -> datetime | None:
    return datetime.fromisoformat(value) if value else None


def _get_path() -> Path:
    parser = argparse.ArgumentParser(description="Migrate JSON data into database")
    parser.add_argument("--file", help="Path to data.json")
    args = parser.parse_args()
    path = args.file or os.getenv("DATA_JSON") or "data.json"
    return Path(path)


def _load_json(path: Path) -> dict[str, Any]:
    with path.open() as f:
        return json.load(f)


async def _upsert_users(session, items) -> int:
    inserted = 0
    for u in items:
        stmt = select(User).where(User.username == u["username"])
        result = await session.execute(stmt)
        existing = result.scalar_one_or_none()
        if existing:
            existing.email = u.get("email", existing.email)
            if "password" in u:
                existing.hashed_password = hash_password(u["password"])
            existing.role = UserRole(u.get("role", existing.role))
            existing.prefs = u.get("prefs", existing.prefs)
        else:
            user = User(
                username=u["username"],
                email=u.get("email", ""),
                hashed_password=hash_password(u["password"]),
                role=UserRole(u.get("role", UserRole.intermittent)),
                prefs=u.get("prefs", {}),
            )
            session.add(user)
            inserted += 1
    return inserted


async def _upsert_missions(session, items) -> int:
    inserted = 0
    for m in items:
        mission_id = m.get("id")
        existing = None
        if mission_id is not None:
            stmt = select(Mission).where(Mission.id == mission_id)
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
        values = {
            "title": m["title"],
            "start": _dt(m["start"]),
            "end": _dt(m["end"]),
            "location": m["location"],
            "call_time": _dt(m.get("call_time")),
            "positions": m.get("positions", []),
            "documents": m.get("documents", []),
            "status": MissionStatus(m.get("status", MissionStatus.draft)),
            "created_by": m["created_by"],
        }
        if existing:
            for k, v in values.items():
                setattr(existing, k, v)
        else:
            mission = Mission(id=mission_id, **values) if mission_id is not None else Mission(**values)
            session.add(mission)
            inserted += 1
    return inserted


async def _upsert_assignments(session, items) -> int:
    inserted = 0
    for a in items:
        assignment_id = a.get("id")
        existing = None
        if assignment_id is not None:
            stmt = select(Assignment).where(Assignment.id == assignment_id)
            result = await session.execute(stmt)
            existing = result.scalar_one_or_none()
        values = {
            "mission_id": a["mission_id"],
            "user_id": a.get("user_id"),
            "role_label": a["role_label"],
            "status": AssignmentStatus(a.get("status", AssignmentStatus.invited)),
            "channel": a.get("channel"),
            "responded_at": _dt(a.get("responded_at")),
        }
        if existing:
            for k, v in values.items():
                setattr(existing, k, v)
        else:
            assignment = (
                Assignment(id=assignment_id, **values)
                if assignment_id is not None
                else Assignment(**values)
            )
            session.add(assignment)
            inserted += 1
    return inserted


async def main() -> None:
    path = _get_path()
    data = _load_json(path)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with SessionLocal() as session:
        counts = {}
        counts["users"] = await _upsert_users(session, data.get("users", []))
        counts["missions"] = await _upsert_missions(session, data.get("missions", []))
        counts["assignments"] = await _upsert_assignments(session, data.get("assignments", []))
        await session.commit()
    for table, count in counts.items():
        print(f"{table}: inserted {count}")


if __name__ == "__main__":
    asyncio.run(main())
