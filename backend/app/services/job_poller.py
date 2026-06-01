"""
Background job poller — runs inside the FastAPI process using asyncio.
Polls Naukri every N minutes, deduplicates, matches against all users,
and fires real-time SSE + email/Telegram notifications for high-match jobs.

No Celery / Redis required for single-server MVP.
Replace with Celery beat for multi-worker production.
"""
import asyncio
import logging

from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.job import Job
from app.models.user import User
from app.services.deduplicator import upsert_job
from app.services.job_aggregator import fetch_jobs_from_all_sources
from app.services.vector_matcher import hybrid_match
from app.services.notifier import notify_new_job

logger = logging.getLogger(__name__)

POLL_INTERVAL_SECONDS = int(60 * 5)  # every 5 minutes
HIGH_MATCH_THRESHOLD  = 70


async def _process_jobs_for_users(db: Session, new_jobs: list[dict]) -> None:
    users: list[User] = db.query(User).filter(User.profile_json.isnot(None)).all()
    for user in users:
        preferences = user.preferences_json or {}
        telegram_id: str | None = preferences.get("telegram_chat_id")
        whatsapp_phone: str | None = preferences.get("whatsapp_phone")
        for job_data in new_jobs:
            result = hybrid_match(job_data, user.profile_json or {})
            score  = result["match_score"]
            if score >= HIGH_MATCH_THRESHOLD:
                await notify_new_job(
                    user_id     = user.id,
                    user_email  = user.email,
                    telegram_id = telegram_id,
                    job         = job_data,
                    score       = score,
                    whatsapp_phone = whatsapp_phone,
                )


async def _poll_once() -> None:
    logger.info("Job poller: starting fetch …")
    db: Session = SessionLocal()
    try:
        # Collect keywords from all active user profiles
        users: list[User] = db.query(User).filter(User.profile_json.isnot(None)).all()
        keywords: set[str] = set()
        for u in users:
            for role in (u.profile_json or {}).get("job_roles", []):
                keywords.add(str(role).lower().strip())
        if not keywords:
            keywords = {"software engineer"}

        new_jobs: list[dict] = []
        for kw in list(keywords)[:5]:   # cap at 5 keywords per cycle
            fetched = await fetch_jobs_from_all_sources(keyword=kw, pages=1)
            for job_data in fetched:
                _, created = upsert_job(db, job_data)
                if created:
                    new_jobs.append(job_data)

        logger.info("Job poller: %d new unique jobs inserted", len(new_jobs))

        if new_jobs:
            await _process_jobs_for_users(db, new_jobs)
    except Exception as exc:
        logger.exception("Job poller error: %s", exc)
    finally:
        db.close()


async def start_job_poller() -> None:
    """Infinite async loop — start this as an asyncio background task."""
    logger.info("Job poller started (interval=%ds)", POLL_INTERVAL_SECONDS)
    while True:
        await _poll_once()
        await asyncio.sleep(POLL_INTERVAL_SECONDS)
