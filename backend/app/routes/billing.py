from fastapi import APIRouter, Depends

from app.models.user import User
from app.services.billing import plan_limits
from app.services.stripe_webhooks import process_stripe_event
from app.utils.security import get_current_user


router = APIRouter()


@router.get("/plans")
def plans():
    return {
        "free": {"price": 0, "features": ["resume parsing", "limited matches", "manual copilot"]},
        "pro": {"price": 19, "features": ["unlimited matching", "AI answers", "auto-apply copilot", "analytics"]},
        "enterprise": {"price": "custom", "features": ["team admin", "priority workers", "custom integrations"]},
    }


@router.get("/me")
def my_plan(user: User = Depends(get_current_user)):
    return {"plan": user.plan, "ai_credits": user.ai_credits, "limits": plan_limits(user.plan)}


@router.post("/stripe/webhook")
def stripe_webhook(event: dict):
    return process_stripe_event(event)
