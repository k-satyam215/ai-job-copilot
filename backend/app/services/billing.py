PLAN_LIMITS = {
    "free": {"ai_credits": 25, "auto_apply": False, "jobs_per_day": 25},
    "pro": {"ai_credits": 1000, "auto_apply": True, "jobs_per_day": 500},
    "enterprise": {"ai_credits": 10000, "auto_apply": True, "jobs_per_day": 5000},
}


def plan_limits(plan: str) -> dict:
    return PLAN_LIMITS.get(plan, PLAN_LIMITS["free"])


def can_use_feature(plan: str, feature: str) -> bool:
    return bool(plan_limits(plan).get(feature, False))
