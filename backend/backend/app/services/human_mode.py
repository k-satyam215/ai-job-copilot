def human_intervention(reason: str) -> dict:
    return {"mode": "human_intervention", "reason": reason, "resume_after_user_action": True}
