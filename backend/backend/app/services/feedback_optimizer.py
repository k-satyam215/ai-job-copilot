def optimize_from_feedback(feedback: list[dict]) -> dict:
    return {"answer_style": "concise" if any(f.get("type") == "too_long" for f in feedback) else "balanced"}
