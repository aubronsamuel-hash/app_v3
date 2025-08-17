from fastapi import FastAPI

from .db import engine
from .routers.auth import router as auth_router

app = FastAPI()


@app.on_event("startup")
def startup() -> None:
    with engine.begin() as conn:
        conn.exec_driver_sql(
            """
            CREATE TABLE IF NOT EXISTS auth_tokens (
              token TEXT PRIMARY KEY,
              user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
              expires_at TIMESTAMPTZ NOT NULL,
              created_at TIMESTAMPTZ DEFAULT now()
            );
            """
        )
        conn.exec_driver_sql(
            """
            CREATE INDEX IF NOT EXISTS idx_auth_tokens_user_expires ON auth_tokens(user_id, expires_at);
            """
        )

@app.get("/healthz")
def healthz():
    return {"ok": True}


app.include_router(auth_router, prefix="/auth", tags=["auth"])
