import json
from fastapi import APIRouter, Depends

from ..security import require_auth, get_redis

router = APIRouter(prefix="/planning", tags=["planning"])


@router.get("/week/{week}")
async def planning_week(
    week: int,
    redis=Depends(get_redis),
    user=Depends(require_auth),
):
    key = f"planning:{week}"
    cached = await redis.get(key)
    if cached:
        return json.loads(cached)
    data = {"week": week, "missions": []}
    await redis.set(key, json.dumps(data), ex=300)
    return data
