def guard_action(action: str, context: dict) -> dict:
    if action == "submit":
        return {"allowed": False, "reason": "Final submit requires explicit user confirmation."}
    if context.get("captcha_detected"):
        return {"allowed": False, "reason": "CAPTCHA detected."}
    return {"allowed": True, "reason": "safe"}
