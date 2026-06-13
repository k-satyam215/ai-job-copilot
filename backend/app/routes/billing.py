from __future__ import annotations

import hashlib
import hmac
import logging
import os

from fastapi import APIRouter, Depends, Header, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.services.billing import activate_user_plan, plan_limits, restrict_user_plan
from app.services.razorpay_service import create_order, process_razorpay_event, verify_webhook
from app.services.stripe_webhooks import process_stripe_event
from app.utils.security import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()


class VerifyPayload(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str


class CancelPayload(BaseModel):
    reason: str | None = None


@router.post("/cancel")
def cancel_subscription(
    payload: CancelPayload | None = None,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    previous_plan = user.plan
    if previous_plan == "free":
        return {"success": True, "plan": "free", "message": "Already on free plan"}

    try:
        if os.getenv("RAZORPAY_ENABLED", "false").lower() == "true" and previous_plan != "enterprise":
            from app.services.razorpay_service import cancel_subscription as rz_cancel
            rz_cancel(user.email)
    except Exception as exc:
        logger.warning("Razorpay cancel API call failed (non-fatal): %s", exc)

    restrict_user_plan(db, user.email)
    db.refresh(user)
    logger.info("User %s cancelled subscription (was %s)", user.email, previous_plan)
    return {
        "success": True,
        "plan": user.plan,
        "ai_credits": user.ai_credits,
        "previous_plan": previous_plan,
        "message": "Subscription cancelled. Downgraded to free plan.",
    }


@router.get("/invoice/{month}")
def get_invoice(month: str, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    import datetime as _dt
    from app.services.invoice_engine import build_invoice
    try:
        _dt.datetime.strptime(month, "%Y-%m")
    except ValueError:
        raise HTTPException(status_code=400, detail="month must be YYYY-MM")
    return build_invoice(db, user, month)


@router.get("/plans")
def plans():
    return {
        "free":  {"price": 0,        "features": ["25 AI credits/month", "Resume parsing", "25 job matches/day", "Manual copilot"]},
        "pro":   {"price": 1900,     "features": ["1000 AI credits/month", "Unlimited matching", "AI auto-fill", "Analytics & roadmap", "500 jobs/day"]},
        "elite": {"price": 4900,     "features": ["5000 AI credits/month", "Everything in Pro", "Priority support", "2000 jobs/day"]},
        "enterprise": {"price": "custom", "features": ["10000 AI credits/month", "Team admin", "Custom integrations", "Dedicated support"]},
    }


@router.get("/me")
def my_plan(user: User = Depends(get_current_user)):
    limits = plan_limits(user.plan)
    return {
        "plan": user.plan,
        "ai_credits": user.ai_credits,
        "max_credits": limits["ai_credits"],
        "limits": limits,
        "email": user.email,
        "full_name": user.full_name,
        "credits_reset_at": user.credits_reset_at.isoformat() if user.credits_reset_at else None,
    }


@router.post("/razorpay/order")
async def razorpay_order(payload: dict, user: User = Depends(get_current_user)):
    plan = payload.get("plan", "pro")
    return await create_order(plan, user.email)


@router.post("/razorpay/verify")
def razorpay_verify(
    payload: VerifyPayload,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    """Verify Razorpay payment signature and upgrade the user plan.
    FIX: Use hmac.new(key, msg, digestmod) correctly — Python HMAC API.
    """
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")

    if key_secret:
        mac = hmac.new(
            key_secret.encode("utf-8"),
            f"{payload.razorpay_order_id}|{payload.razorpay_payment_id}".encode("utf-8"),
            hashlib.sha256,
        )
        expected_signature = mac.hexdigest()
        if not hmac.compare_digest(expected_signature, payload.razorpay_signature):
            raise HTTPException(status_code=400, detail="Payment signature verification failed")

    # Detect plan from order receipt
    plan = "pro"
    try:
        order_id = payload.razorpay_order_id
        if order_id:
            import httpx
            key_id = os.getenv("RAZORPAY_KEY_ID", "")
            if key_id and key_secret:
                with httpx.Client(timeout=10) as client:
                    resp = client.get(
                        f"https://api.razorpay.com/v1/orders/{order_id}",
                        auth=(key_id, key_secret),
                    )
                    if resp.status_code == 200:
                        order_data = resp.json()
                        receipt = order_data.get("receipt", "pro:")
                        detected_plan = receipt.split(":")[0] if ":" in receipt else "pro"
                        if detected_plan in {"pro", "elite", "enterprise"}:
                            plan = detected_plan
    except Exception as exc:
        logger.warning("Could not fetch order plan from Razorpay, defaulting to pro: %s", exc)

    upgraded = activate_user_plan(db, user.email, plan)
    if not upgraded:
        raise HTTPException(status_code=500, detail="Could not activate plan in database")

    db.refresh(user)
    return {
        "success": True,
        "plan": user.plan,
        "ai_credits": user.ai_credits,
        "message": f"Successfully upgraded to {user.plan} plan!",
    }


@router.post("/razorpay/webhook")
async def razorpay_webhook(
    request: Request,
    db: Session = Depends(get_db),
    x_razorpay_signature: str | None = Header(default=None),
):
    raw = await request.body()
    event = await request.json()
    verified = verify_webhook(raw, x_razorpay_signature)
    result = process_razorpay_event(event)

    action = result.get("action", "")
    payload_data = result.get("payload", {})
    email = (
        payload_data.get("payment", {}).get("entity", {}).get("email")
        or payload_data.get("subscription", {}).get("entity", {}).get("notes", {}).get("email")
        or ""
    )
    plan = payload_data.get("subscription", {}).get("entity", {}).get("notes", {}).get("plan", "pro")

    if action == "activate_plan" and email:
        activate_user_plan(db, email, plan)
    elif action == "restrict_plan" and email:
        restrict_user_plan(db, email)

    return {"verified": verified, **result}


@router.post("/stripe/webhook")
def stripe_webhook(event: dict, db: Session = Depends(get_db)):
    result = process_stripe_event(event)
    action = result.get("action", "")
    customer_email = result.get("customer_email", "") or result.get("customer", "")
    plan = result.get("plan", "pro")
    if action == "activate_subscription" and customer_email:
        activate_user_plan(db, customer_email, plan)
    elif action == "mark_payment_failed" and customer_email:
        restrict_user_plan(db, customer_email)
    return result
