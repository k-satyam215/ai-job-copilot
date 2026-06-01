from app.services.billing import plan_limits


def quota_status(plan: str, used_today: int) -> dict:
    limit = plan_limits(plan).get("jobs_per_day", 25)
    return {"limit": limit, "used": used_today, "remaining": max(0, limit - used_today), "allowed": used_today < limit}
