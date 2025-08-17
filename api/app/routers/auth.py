from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import text
from sqlalchemy.orm import Session

from ..db import get_db
from ..security import (
    TOKEN_TTL_MINUTES,
    bearer_scheme,
    create_token,
    get_current_user,
    verify_password,
)

router = APIRouter()


class TokenRequest(BaseModel):
    username: str
    password: str


@router.post("/token-json")
def token_json(payload: TokenRequest, db: Session = Depends(get_db)):
    user_query = text(
        "SELECT id, username, password_hash, role FROM users WHERE username = :u"
    )
    user = db.execute(user_query, {"u": payload.username}).mappings().first()
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")

    token = create_token()
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=TOKEN_TTL_MINUTES)
    insert_query = text(
        """
        INSERT INTO auth_tokens(token, user_id, expires_at)
        VALUES (:t, :uid, :exp)
        """
    )
    db.execute(insert_query, {"t": token, "uid": user["id"], "exp": expires_at})
    db.commit()
    return {
        "access_token": token,
        "token_type": "bearer",
        "expires_in": TOKEN_TTL_MINUTES * 60,
    }


@router.get("/me")
def read_me(current_user=Depends(get_current_user)):
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "role": current_user["role"],
    }


@router.post("/logout")
def logout(
    credentials=Depends(bearer_scheme),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    db.execute(text("DELETE FROM auth_tokens WHERE token = :t"), {"t": credentials.credentials})
    db.commit()
    return {"ok": True}
