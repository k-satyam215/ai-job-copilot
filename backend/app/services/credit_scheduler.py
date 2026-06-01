from app.services.billing import plan_limits


def refill_credits(plan: str) -> int:
    return int(plan_limits(plan).get("ai_credits", 25))
