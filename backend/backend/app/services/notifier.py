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
_SSE_QUEUES: dict[int, list[asyncio.Queue]] = {}


def subscribe(user_id: int) -> asyncio.Queue:
    queue: asyncio.Queue = asyncio.Queue(maxsize=50)
    _SSE_QUEUES.setdefault(user_id, []).append(queue)
    return queue


def unsubscribe(user_id: int, queue: asyncio.Queue) -> None:
    queues = _SSE_QUEUES.get(user_id, [])
    if queue in queues:
        queues.remove(queue)


async def push(user_id: int, event_type: str, data: dict) -> None:
    payload = json.dumps({"type": event_type, **data})
    for queue in list(_SSE_QUEUES.get(user_id, [])):
        try:
            queue.put_nowait(payload)
        except asyncio.QueueFull:
            unsubscribe(user_id, queue)


async def sse_stream(user_id: int, queue: asyncio.Queue) -> AsyncGenerator[str, None]:
    try:
        yield 'data: {"type":"connected"}\n\n'
        while True:
            try:
                payload = await asyncio.wait_for(queue.get(), timeout=25.0)
                yield f"data: {payload}\n\n"
            except asyncio.TimeoutError:
                yield ": heartbeat\n\n"
    finally:
        unsubscribe(user_id, queue)


def send_email(to_email: str, subject: str, html_body: str) -> bool:
    smtp_host = os.getenv("SMTP_HOST", "")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER", "")
    smtp_pass = os.getenv("SMTP_PASS", "")
    if not all([smtp_host, smtp_user, smtp_pass]):
        logger.info("SMTP not configured; skipping email to %s", to_email)
        return False
    try:
        message = MIMEMultipart("alternative")
        message["Subject"] = subject
        message["From"] = smtp_user
        message["To"] = to_email
        message.attach(MIMEText(html_body, "html"))
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.sendmail(smtp_user, to_email, message.as_string())
        return True
    except Exception as exc:
        logger.exception("Email send failed: %s", exc)
        return False


async def send_telegram(chat_id: str, text: str) -> bool:
    token = os.getenv("TELEGRAM_BOT_TOKEN", "")
    if not token or not chat_id:
        return False
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                f"https://api.telegram.org/bot{token}/sendMessage",
                json={"chat_id": chat_id, "text": text, "parse_mode": "HTML"},
            )
            return response.status_code == 200
    except Exception as exc:
        logger.exception("Telegram send failed: %s", exc)
        return False


async def send_whatsapp(phone: str, text: str) -> bool:
    token = os.getenv("WHATSAPP_ACCESS_TOKEN", "")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
    if not token or not phone_number_id or not phone:
        return False
    payload = {
        "messaging_product": "whatsapp",
        "to": phone,
        "type": "text",
        "text": {"preview_url": True, "body": text[:4000]},
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.post(
                f"https://graph.facebook.com/v20.0/{phone_number_id}/messages",
                headers={"Authorization": f"Bearer {token}"},
                json=payload,
            )
            return response.status_code in {200, 201}
    except Exception as exc:
        logger.exception("WhatsApp send failed: %s", exc)
        return False


async def notify_new_job(
    user_id: int,
    user_email: str,
    telegram_id: str | None,
    job: dict,
    score: int,
    whatsapp_phone: str | None = None,
) -> None:
    title = job.get("title", "New Job")
    company = job.get("company", "")
    url = job.get("url", "#")

    await push(user_id, "new_job", {
        "title": title,
        "company": company,
        "score": score,
        "url": url,
        "location": job.get("location", ""),
    })

    html = (
        f"<h2>New {score}% match job</h2>"
        f"<p><b>{title}</b> at <b>{company}</b></p>"
        f"<p><a href='{url}'>View and apply</a></p>"
    )
    send_email(user_email, f"[AI Job Copilot] {score}% match: {title} at {company}", html)

    if telegram_id:
        await send_telegram(telegram_id, f"{score}% Match: {title} at {company}\n{url}")
    if whatsapp_phone:
        await send_whatsapp(whatsapp_phone, f"AI Job Copilot: {score}% match - {title} at {company}\n{url}")
