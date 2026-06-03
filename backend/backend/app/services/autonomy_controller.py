def autonomy_policy(mode: str) -> dict:
    if mode == "autonomous":
        return {"mode": mode, "submit_allowed": False, "requires_review": True}
    if mode == "copilot":
        return {"mode": mode, "submit_allowed": False, "requires_review": True}
    return {"mode": "safe", "submit_allowed": False, "requires_review": True}
