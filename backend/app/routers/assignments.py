from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..deps import get_current_user, get_db

router = APIRouter(prefix="/assignments", tags=["assignments"])


@router.get("/")
async def list_assignments(db: AsyncSession = Depends(get_db), current_user=Depends(get_current_user)):
    return []
