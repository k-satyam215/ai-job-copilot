import hmac
import os
from hashlib import sha256

import httpx


RAZORPAY_API = "https://api.razorpay.com/v1"


def razorpay_configured() -> bool:
    return bool(os.getenv("RAZORPAY_KEY_ID") and os.getenv("RAZORPAY_KEY_SECRET"))


async def create_order(plan: str, user_email: str) -> dict:
    prices = {"pro": 1900 * 100, "enterprise": 9900 * 100}
    amount = prices.get(plan, prices["pro"])
    if not razorpay_configured():
        return {
            "provider": "razorpay",
            "mode": "test_unconfigured",
            "plan": plan,
            "amount": amount,
            "currency": "INR",
            "message": "Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to create live orders.",
        }

    auth = (os.getenv("RAZORPAY_KEY_ID", ""), os.getenv("RAZORPAY_KEY_SECRET", ""))
    payload = {"amount": amount, "currency": "INR", "receipt": f"{plan}:{user_email}", "notes": {"plan": plan, "email": user_email}}
    async with httpx.AsyncClient(timeout=20) as client:
        response = await client.post(f"{RAZORPAY_API}/orders", json=payload, auth=auth)
        response.raise_for_status()
        return response.json()


def verify_webhook(raw_body: bytes, signature: str | None) -> bool:
    secret = os.getenv("RAZORPAY_WEBHOOK_SECRET", "")
    if not secret:
        return False
    digest = hmac.new(secret.encode(), raw_body, sha256).hexdigest()
    return hmac.compare_digest(digest, signature or "")


def process_razorpay_event(event: dict) -> dict:
    event_name = event.get("event", "")
    payload = event.get("payload", {})
    if event_name in {"payment.captured", "subscription.activated"}:
        return {"action": "activate_plan", "payload": payload}
    if event_name in {"payment.failed", "subscription.cancelled"}:
        return {"action": "restrict_plan", "payload": payload}
    return {"action": "ignored", "event": event_name}
