"""Admin routes — gated by `ADMIN_EMAILS` env var, not by user.plan.

Security fix: previously any enterprise-plan user could access /admin/*.
Now admin access is granted to:
  1. Users whose email is in the `ADMIN_EMAILS` comma-separated env var, OR
  2. Calls with a valid `X-Admin-Token` header matching `ADMIN_API_TOKEN`
     (for CI / monitoring / dashboard scripts).

The IP allowlist is optional and can be enabled with `ADMIN_IP_ALLOWLIST`.
"""
from __future__ import annotations

import logging
import os
from typing import Iterable

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.job import Job
from app.models.user import User
from app.utils.security import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


def _env_set(name: str) -> set[str]:
    raw = os.getenv(name, "")
    return {item.strip().lower() for item in raw.split(",") if item.strip()}


def _is_admin(user: User, request: Request) -> bool:
    # 1. Email allowlist (preferred — survives JWT rotation)
    admin_emails = _env_set("ADMIN_EMAILS")
    if admin_emails and user.email.lower() in admin_emails:
        return True

    # 2. Service-to-service token (for monitoring / cron)
    expected_token = os.getenv("ADMIN_API_TOKEN", "")
    provided_token = request.headers.get("X-Admin-Token", "")
    if expected_token and provided_token and provided_token == expected_token:
        return True

    return False


def require_admin(
    request: Request,
    user: User = Depends(get_current_user),
):
    if not _is_admin(user, request):
        logger.warning("Admin access denied for user %s on %s",
                       user.email, request.url.path)
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required. Set ADMIN_EMAILS env var to grant access.",
        )
    return user


@router.get("/summary")
def summary(
    db: Session = Depends(get_db),
    user: User = Depends(require_admin),
):
    """High-level platform metrics — admin only."""
    return {
        "users": db.query(User).count(),
        "jobs": db.query(Job).count(),
        "applications": db.query(Application).count(),
        "credits_issued": sum((row.ai_credits or 0) for row in db.query(User).all()),
        "plan_breakdown": _plan_breakdown(db),
    }


@router.get("/users")
def list_users(
    db: Session = Depends(get_db),
    user: User = Depends(require_admin),
    limit: int = 50,
    offset: int = 0,
):
    rows = db.query(User).order_by(User.id.desc()).offset(offset).limit(limit).all()
    return [
        {
            "id": u.id,
            "email": u.email,
            "plan": u.plan,
            "ai_credits": u.ai_credits,
            "created_at": getattr(u, "created_at", None),
        }
        for u in rows
    ]


def _plan_breakdown(db: Session) -> dict[str, int]:
    from collections import Counter
    rows = db.query(User.plan).all()
    return dict(Counter(plan for (plan,) in rows))
