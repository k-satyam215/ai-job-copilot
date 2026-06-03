from __future__ import annotations

import hashlib
import hmac
import logging

from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.utils.security import get_current_user

logger = logging.getLogger(__name__)

PLAN_LIMITS = {
    "free":       {"ai_credits": 25,    "auto_apply": False, "jobs_per_day": 25},
    "pro":        {"ai_credits": 1000,  "auto_apply": True,  "jobs_per_day": 500},
    "elite":      {"ai_credits": 5000,  "auto_apply": True,  "jobs_per_day": 2000},
    "enterprise": {"ai_credits": 10000, "auto_apply": True,  "jobs_per_day": 5000},
}

CREDIT_COSTS = {
    "resume_parse":    5,
    "job_match":       1,
    "interview_prep":  3,
    "roadmap":         3,
    "tailor_resume":   2,
    "cover_letter":    2,
    "copilot_fill":    1,
}


def plan_limits(plan: str) -> dict:
    return PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])


def can_use_feature(plan: str, feature: str) -> bool:
    return bool(plan_limits(plan).get(feature, False))


def deduct_credits(db: Session, user: User, operation: str) -> bool:
    """Deduct AI credits for an operation. Returns False if insufficient credits."""
    cost = CREDIT_COSTS.get(operation, 1)
    if user.ai_credits < cost:
        return False
    user.ai_credits = max(0, user.ai_credits - cost)
    db.commit()
    logger.info("User %s: deducted %d credits for '%s', remaining: %d",
                user.id, cost, operation, user.ai_credits)
    return True


class RequireCredits:
    """FastAPI dependency wrapper that deducts credits for an operation."""
    def __init__(self, operation: str):
        self.operation = operation

    def __call__(self, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
        if not deduct_credits(db, user, self.operation):
            raise HTTPException(
                status_code=402,
                detail={
                    "error": "insufficient_credits",
                    "message": f"Not enough AI credits for '{self.operation}'. Upgrade your plan.",
                    "remaining": user.ai_credits,
                    "required": CREDIT_COSTS.get(self.operation, 1),
                    "plan": user.plan,
                },
            )
        return user


def require_credits(operation: str):
    """FastAPI dependency factory — backward-compatible alias."""
    return RequireCredits(operation)


def activate_user_plan(db: Session, email: str, plan: str) -> bool:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        logger.warning("activate_user_plan: no user found for email=%s", email)
        return False
    new_credits = PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])["ai_credits"]
    user.plan = plan
    user.ai_credits = new_credits
    db.commit()
    logger.info("User %s upgraded to plan=%s, credits=%d", email, plan, new_credits)
    return True


def restrict_user_plan(db: Session, email: str) -> bool:
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return False
    user.plan = "free"
    user.ai_credits = PLAN_LIMITS["free"]["ai_credits"]
    db.commit()
    logger.info("User %s restricted to free plan", email)
    return True


def verify_webhook_signature(payload: bytes, signature: str, secret: str) -> bool:
    """Verify Razorpay/Stripe webhook HMAC-SHA256 signature.
    FIX: Python uses hmac.new(key, msg, digestmod) — NOT hmac.new() directly.
    """
    if not signature or not secret:
        return False
    try:
        digest = hmac.new(
            secret.encode("utf-8"),
            payload,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(digest, signature)
    except Exception as exc:
        logger.error("HMAC verification failed: %s", exc)
        return False
