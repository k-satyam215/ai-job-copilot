def recovery_plan(error: str, observation: dict) -> dict:
    if observation.get("captcha_detected"):
        return {"strategy": "human_intervention", "message": "CAPTCHA detected. User must continue manually."}
    if "timeout" in (error or "").lower():
        return {"strategy": "retry_with_backoff", "max_retries": 2}
    return {"strategy": "pause_and_review", "message": error or "Unknown automation failure"}
