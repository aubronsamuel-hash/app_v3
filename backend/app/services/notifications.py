import asyncio
import json
import logging
import os
import secrets
import time
from email.message import EmailMessage
from typing import Any, Dict

import httpx
from pywebpush import webpush
from redis import asyncio as aioredis

from ..config import settings

logger = logging.getLogger(__name__)

QUEUE_KEY = "jobs"
EMAIL_LIMIT_PER_MIN = int(os.getenv("EMAIL_RATE_PER_MIN", "60"))


async def enqueue_invite(
    redis: aioredis.Redis, payload: Dict[str, Any]
) -> None:
    """Push an invite job onto the queue."""

    await redis.lpush(
        QUEUE_KEY,
        json.dumps({"type": "invite", "data": payload}),
    )


async def enqueue_publish(
    redis: aioredis.Redis, payload: Dict[str, Any]
) -> None:
    """Push a publish job onto the queue."""

    await redis.lpush(
        QUEUE_KEY,
        json.dumps({"type": "publish", "data": payload}),
    )


async def _rate_limit_email(redis: aioredis.Redis, recipient: str) -> bool:
    now = int(time.time())
    window = now // 60
    key = f"email:{recipient}:{window}"
    count = await redis.incr(key)
    if count == 1:
        await redis.expire(key, 60)
    return count <= EMAIL_LIMIT_PER_MIN


async def _send_email(
    redis: aioredis.Redis,
    to: str,
    subject: str,
    body: str,
    dry_run: bool,
) -> None:
    if not await _rate_limit_email(redis, to):
        logger.warning("Email rate limit exceeded for %s", to)
        return
    if dry_run:
        logger.info("[dry-run] email to %s: %s", to, subject)
        return
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = os.getenv("SMTP_FROM", "noreply@example.com")
    msg["To"] = to
    msg.set_content(body)
    host = os.getenv("SMTP_HOST", "localhost")
    port = int(os.getenv("SMTP_PORT", "25"))
    await asyncio.to_thread(_smtp_send, host, port, msg)


def _smtp_send(host: str, port: int, msg: EmailMessage) -> None:
    import smtplib

    with smtplib.SMTP(host, port) as smtp:
        smtp.send_message(msg)


async def _send_telegram(chat_id: str, text: str, dry_run: bool) -> None:
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if dry_run or not token:
        logger.info("[dry-run] telegram to %s: %s", chat_id, text)
        return
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    async with httpx.AsyncClient() as client:
        await client.post(url, json={"chat_id": chat_id, "text": text})


async def _send_webpush(
    subscription: Dict[str, Any],
    data: str,
    dry_run: bool,
) -> None:
    if dry_run:
        logger.info("[dry-run] webpush: %s", data)
        return
    vapid_private_key = os.getenv("VAPID_PRIVATE_KEY")
    vapid_claims = {
        "sub": os.getenv("VAPID_SUBJECT", "mailto:admin@example.com")
    }
    await asyncio.to_thread(
        webpush,
        subscription_info=subscription,
        data=data,
        vapid_private_key=vapid_private_key,
        vapid_claims=vapid_claims,
    )


async def _signed_link(
    redis: aioredis.Redis, action: str, payload: Dict[str, Any]
) -> str:
    token = secrets.token_urlsafe(16)
    await redis.set(
        f"link:{token}",
        json.dumps({"action": action, "data": payload}),
        ex=86400,
    )
    base = os.getenv("APP_BASE_URL", "https://example.com")
    return f"{base}/{action}?token={token}"


async def handle_invite(
    redis: aioredis.Redis, data: Dict[str, Any], dry_run: bool
) -> None:
    email = data.get("email")
    chat_id = data.get("telegram")
    subscription = data.get("push")
    accept = await _signed_link(redis, "accept", data)
    decline = await _signed_link(redis, "decline", data)
    body = f"You are invited. Accept: {accept}\nDecline: {decline}"
    if email:
        await _send_email(redis, email, "Invitation", body, dry_run)
    if chat_id:
        await _send_telegram(chat_id, body, dry_run)
    if subscription:
        await _send_webpush(subscription, body, dry_run)


async def handle_publish(
    redis: aioredis.Redis, data: Dict[str, Any], dry_run: bool
) -> None:
    email = data.get("email")
    chat_id = data.get("telegram")
    subscription = data.get("push")
    body = data.get("message", "")
    if email:
        await _send_email(redis, email, "Publication", body, dry_run)
    if chat_id:
        await _send_telegram(chat_id, body, dry_run)
    if subscription:
        await _send_webpush(subscription, body, dry_run)


async def worker_loop() -> None:
    redis = aioredis.from_url(settings.redis_url, decode_responses=True)
    dry_run = os.getenv("NOTIFY_DRY_RUN") == "1"
    while True:
        _, raw = await redis.brpop(QUEUE_KEY)
        job = json.loads(raw)
        typ = job.get("type")
        data = job.get("data", {})
        if typ == "invite":
            await handle_invite(redis, data, dry_run)
        elif typ == "publish":
            await handle_publish(redis, data, dry_run)
        else:
            logger.warning("Unknown job type: %s", typ)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--worker", action="store_true")
    args = parser.parse_args()
    if args.worker:
        asyncio.run(worker_loop())
