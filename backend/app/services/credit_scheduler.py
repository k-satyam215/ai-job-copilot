"""Monthly credit reset scheduler.

Resets AI credits for all paid users on the 1st of each month.
Can be triggered via the /ops/reset-credits admin endpoint
or scheduled externally (cron, Celery beat, Render cron job).
"""
from __future__ import annotations

import logging
from datetime import datetime

from sqlalchemy.orm import Session

from app.models.user import User
from app.services.billing import PLAN_LIMITS

logger = logging.getLogger(__name__)


def refill_credits(plan: str) -> int:
    """Return the monthly credit allocation for a plan."""
    return int(PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])["ai_credits"])


def reset_all_user_credits(db: Session) -> dict:
    """Reset credits for ALL users based on their current plan.

    Idempotent — safe to run multiple times; only resets to plan maximum.
    Returns a summary dict for logging/monitoring.
    """
    users = db.query(User).all()
    reset_count = 0
    skipped_count = 0

    for user in users:
        max_credits = refill_credits(user.plan)
        if user.ai_credits < max_credits:
            user.ai_credits = max_credits
            reset_count += 1
        else:
            skipped_count += 1

    db.commit()
    logger.info(
        "Monthly credit reset: reset=%d skipped=%d total=%d at %s",
        reset_count, skipped_count, len(users), datetime.utcnow().isoformat(),
    )
    return {
        "reset_count": reset_count,
        "skipped_count": skipped_count,
        "total_users": len(users),
        "run_at": datetime.utcnow().isoformat(),
    }


def reset_single_user_credits(db: Session, user_id: int) -> dict:
    """Reset credits for a single user (e.g. on plan renewal)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return {"success": False, "error": "User not found"}
    user.ai_credits = refill_credits(user.plan)
    db.commit()
    return {"success": True, "user_id": user_id, "credits": user.ai_credits, "plan": user.plan}
