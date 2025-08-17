from fastapi import APIRouter
from fastapi.responses import Response
from prometheus_client import Counter, CONTENT_TYPE_LATEST, generate_latest

REQUEST_COUNT = Counter("app_requests_total", "Total HTTP requests", ["method", "endpoint"])

router = APIRouter()

@router.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)
