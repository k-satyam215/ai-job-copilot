"""
Notification engine — in-app SSE (real-time), Email (SMTP), Telegram.
SSE broker runs in-process; no Redis needed for single-worker dev.
"""
import asyncio
import json
import logging
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import AsyncGenerator

import httpx

logger = logging.getLogger(__name__)

# ── In-process SSE broker ──────────────────────────────────────────────────────
# user_id → list[asyncio.Queue]  (one Queue per open browser tab / SSE connection)
_SSE_QUEUES: dict[int, list[asyncio.Queue]] = {}


def subscribe(user_id: int) -> asyncio.Queue:
    q: asyncio.Queue = asyncio.Queue(maxsize=50)
    _SSE_QUEUES.setdefault(user_id, []).append(q)
    return q


def unsubscribe(user_id: int, q: asyncio.Queue) -> None:
    queues = _SSE_QUEUES.get(user_id, [])
    if q in queues:
        queues.remove(q)


async def push(user_id: int, event_type: str, data: dict) -> None:
    """Push to ALL open SSE connections for this user."""
    queues = list(_SSE_QUEUES.get(user_id, []))
    payload = json.dumps({"type": event_type, **data})
    dead: list[asyncio.Queue] = []
    for q in queues:
        try:
            q.put_nowait(payload)
        except asyncio.QueueFull:
            dead.append(q)
    for q in dead:
        unsubscribe(user_id, q)


async def sse_stream(user_id: int, q: asyncio.Queue) -> AsyncGenerator[str, None]:
    """Yield SSE-formatted chunks for FastAPI StreamingResponse."""
    try:
        yield 'data: {"type":"connected"}\n\n'
        while True:
            try:
                payload = await asyncio.wait_for(q.get(), timeout=25.0)
                yield f"data: {payload}\n\n"
            except asyncio.TimeoutError:
                yield ": heartbeat\n\n"   # keep connection alive
    finally:
        unsubscribe(user_id, q)


# ── Email ──────────────────────────────────────────────────────────────────────
def send_email(to_email: str, subject: str, html_body: str) -> bool:
    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")
    if not all([smtp_host, smtp_user, smtp_pass]):
        logger.info("SMTP not configured — skipping email to %s", to_email)
        return False
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = smtp_user
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html"))
        with smtplib.SMTP(smtp_host, smtp_port) as srv:
            srv.starttls()
            srv.login(smtp_user, smtp_pass)
            srv.sendmail(smtp_user, to_email, msg.as_string())
        return True
    except Exception as exc:
        logger.exception("Email send failed: %s", exc)
        return False


# ── Telegram ──────────────────────────────────────────────────────────────────
async def send_telegram(chat_id: str, text: str) -> bool:
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not token or not chat_id:
        return False
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.post(url, json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"})
            return res.status_code == 200
    except Exception as exc:
        logger.exception("Telegram send failed: %s", exc)
        return False


# ── High-level helper used by the job poller ──────────────────────────────────
async def notify_new_job(
    user_id: int,
    user_email: str,
    telegram_id: str | None,
    job: dict,
    score: int,
) -> None:
    title   = job.get("title", "New Job")
    company = job.get("company", "")
    url     = job.get("url", "#")

    # 1. Real-time SSE push
    await push(user_id, "new_job", {
        "title": title, "company": company,
        "score": score, "url": url,
        "location": job.get("location", ""),
    })

    # 2. Email
    html = (
        f"<h2 style='color:#38bdf8'>New {score}% match job!</h2>"
        f"<p><b>{title}</b> at <b>{company}</b></p>"
        f"<p><a href='{url}'>View &amp; Apply →</a></p>"
    )
    send_email(user_email, f"[AI Job Copilot] {score}% match: {title} at {company}", html)

    # 3. Telegram
    if telegram_id:
        msg = f"🎯 <b>{score}% Match!</b>\n<b>{title}</b> at {company}\n<a href='{url}'>Apply →</a>"
        await send_telegram(telegram_id, msg)
