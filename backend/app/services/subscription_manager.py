def subscription_state(plan: str, payment_status: str = "active") -> dict:
    return {"plan": plan, "payment_status": payment_status, "active": payment_status == "active"}
