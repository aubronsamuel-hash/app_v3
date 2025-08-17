import os

from fastapi import FastAPI
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from starlette.responses import JSONResponse

from .routers import admin, assignments, auth, missions, utils
from .models import Base
from .storage import engine

limiter = Limiter(key_func=lambda request: request.client.host)

app = FastAPI(title="Coulisses Crew Ultra API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, lambda request, exc: JSONResponse(status_code=429, content={"detail": "Too Many Requests"}))
app.add_middleware(SlowAPIMiddleware)

origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

trusted_hosts = os.getenv("TRUSTED_HOSTS", "*").split(",")
app.add_middleware(TrustedHostMiddleware, allowed_hosts=trusted_hosts)

app.include_router(auth.router)
app.include_router(missions.router)
app.include_router(assignments.router)
app.include_router(admin.router)
app.include_router(utils.router)


@app.on_event("startup")
async def on_startup() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
