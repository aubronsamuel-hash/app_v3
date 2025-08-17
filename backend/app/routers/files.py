import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, HTTPException

from ..security import require_auth
from ..services.storage_s3 import save_file

router = APIRouter(prefix="/files", tags=["files"])

UPLOAD_DIR = "uploaded"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
async def upload_file(file: UploadFile, user=Depends(require_auth)):
    data = await file.read()
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="file too large")
    path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}_{file.filename}")
    await save_file(path, data)
    return {"path": path}
