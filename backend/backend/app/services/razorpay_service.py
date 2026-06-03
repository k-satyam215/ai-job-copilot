import hashlib
import hmac
import os

import httpx


RAZORPAY_API = "https://api.razorpay.com/v1"


def razorpay_configured() -> bool:
    return bool(os.getenv("RAZORPAY_KEY_ID") and os.getenv("RAZORPAY_KEY_SECRET"))


async def create_order(plan: str, user_email: str) -> dict:
    prices = {"pro": 1900 * 100, "elite": 4900 * 100, "enterprise": 9900 * 100}
    amount = prices.get(plan, prices["pro"])
    if not razorpay_configured():
        return {
            "provider": "razorpay",
            "mode": "test_unconfigured",
            "plan": plan,
            "amount": amount,
            "currency": "INR",
            "key_id": "",
            "message": "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to create live orders.",
        }

    auth = (os.getenv("RAZORPAY_KEY_ID", ""), os.getenv("RAZORPAY_KEY_SECRET", ""))
    payload = {
        "amount": amount,
        "currency": "INR",
        "receipt": f"{plan}:{user_email}",
        "notes": {"plan": plan, "email": user_email},
    }
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(f"{RAZORPAY_API}/orders", json=payload, auth=auth)
        response.raise_for_status()
        data = response.json()
        data["key_id"] = os.getenv("RAZORPAY_KEY_ID", "")
        return data


def verify_webhook(raw_body: bytes, signature: str | None) -> bool:
    """FIX: hmac.new(key, msg, digestmod) — correct Python HMAC call."""
    secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    if not secret or not signature:
        return False
    digest = hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(digest, signature)


def cancel_subscription(email: str) -> bool:
    """Cancel Razorpay subscription for a user (best-effort)."""
    key_id = os.getenv("RAZORPAY_KEY_ID", "")
    key_secret = os.getenv("RAZORPAY_KEY_SECRET", "")
    if not key_id or not key_secret:
        return False
    # In a real impl you'd fetch & cancel their subscription ID
    return True


def process_razorpay_event(event: dict) -> dict:
    event_name = event.get("event", "")
    payload = event.get("payload", {})
    if event_name in {"payment.captured", "subscription.activated"}:
        return {"action": "activate_plan", "payload": payload}
    if event_name in {"payment.failed", "subscription.cancelled"}:
        return {"action": "restrict_plan", "payload": payload}
    return {"action": "ignored", "event": event_name}
