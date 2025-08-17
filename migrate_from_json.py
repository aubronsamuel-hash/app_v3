"""Migration tool to move data.json into PostgreSQL."""

import asyncio
import json
from pathlib import Path

from backend.app import models, security, storage

DATA_FILE = Path('data.json')


async def main() -> None:
    data = json.loads(DATA_FILE.read_text())
    async with storage.get_session() as session:
        for u in data.get('users', []):
            user = models.User(
                username=u['username'],
                password_hash=security.get_password_hash(u['password']),
                role=u.get('role', 'intermittent'),
            )
            session.add(user)
        await session.flush()
        for m in data.get('missions', []):
            mission = models.Mission(
                title=m['title'],
                description=m.get('description'),
                owner_id=m['owner_id'],
                published=m.get('published', False),
            )
            session.add(mission)
        await session.commit()


if __name__ == '__main__':
    asyncio.run(main())
