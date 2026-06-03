"""Invoice generation engine.

Builds a structured JSON invoice for a given user + month. Real PDF
rendering is out of scope for the SaaS MVP — the frontend can render this
JSON to PDF client-side, or wire a service like InvoiceBerry later.
"""
from __future__ import annotations

import datetime as _dt
import logging
import uuid

from sqlalchemy.orm import Session

from app.models.user import User
from app.services.billing import PLAN_LIMITS

logger = logging.getLogger(__name__)


def _plan_price_inr(plan: str) -> int:
    """Plan price in paise (Razorpay convention) — mirrors routes/billing.py plans."""
    return {
        "free": 0,
        "pro": 1900,         # ₹19 / month intro; ₹499/yr in production
        "elite": 4900,       # ₹49 / month intro; ₹1499/yr in production
        "enterprise": 0,     # custom contract
    }.get(plan, 0)


def build_invoice(db: Session, user: User, month: str) -> dict:
    """Generate a JSON invoice for a user covering the given month (YYYY-MM).

    If the user is on a paid plan, this is a tax-style line-item invoice.
    Free users get a ₹0 statement (useful for accounting trail).
    """
    year, mon = (int(x) for x in month.split("-"))
    period_start = _dt.date(year, mon, 1)
    # last day of month: first day of next month minus one day
    if mon == 12:
        period_end = _dt.date(year + 1, 1, 1) - _dt.timedelta(days=1)
    else:
        period_end = _dt.date(year, mon + 1, 1) - _dt.timedelta(days=1)

    amount_paise = _plan_price_inr(user.plan)
    gst_paise = int(amount_paise * 0.18)  # 18% IGST (India)
    total_paise = amount_paise + gst_paise

    invoice_id = f"INV-{user.id:06d}-{month.replace('-', '')}-{uuid.uuid4().hex[:6].upper()}"

    return {
        "invoice_id": invoice_id,
        "issued_at": _dt.datetime.utcnow().isoformat() + "Z",
        "period_start": period_start.isoformat(),
        "period_end": period_end.isoformat(),
        "customer": {
            "id": user.id,
            "name": (user.profile_json or {}).get("name") or user.email.split("@")[0],
            "email": user.email,
        },
        "line_items": [
            {
                "description": f"AI Job Copilot — {user.plan.title()} plan (monthly)",
                "quantity": 1,
                "unit_price_paise": amount_paise,
                "amount_paise": amount_paise,
            }
        ] if user.plan != "free" else [],
        "subtotal_paise": amount_paise,
        "tax_paise": gst_paise,
        "total_paise": total_paise,
        "currency": "INR",
        "status": "paid" if user.plan != "free" else "n/a",
        "notes": (
            "GST 18% included as per Indian regulations. "
            "This is a system-generated invoice."
        ),
    }


# Backwards-compatible thin wrapper
def invoice_summary(customer_id: str, plan: str, amount: int) -> dict:
    return {
        "customer_id": customer_id,
        "plan": plan,
        "amount_cents": amount,
        "currency": "inr",
    }
