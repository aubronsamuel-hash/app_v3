from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
from prometheus_client import CONTENT_TYPE_LATEST, Counter, generate_latest

router = APIRouter(tags=["utils"])

REQUEST_COUNT = Counter("app_requests_total", "Total HTTP requests")


@router.get("/healthz", response_class=PlainTextResponse)
async def healthz():
    REQUEST_COUNT.inc()
    return "ok"


@router.get("/metrics")
async def metrics():
    return PlainTextResponse(generate_latest(), media_type=CONTENT_TYPE_LATEST)
