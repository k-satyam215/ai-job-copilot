def reflect_on_outcome(outcome: dict) -> dict:
    success = outcome.get("status") in {"filled", "tracked", "review_ready", "submitted"}
    return {"success": success, "lesson": "reuse_answers" if success else "increase_user_review"}
