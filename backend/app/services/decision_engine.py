def decide_next_step(verification: dict, plan: dict) -> dict:
    if verification.get("captcha_detected"):
        return {"decision": "pause", "reason": "captcha_detected"}
    if verification.get("validation_errors"):
        return {"decision": "recover", "reason": "validation_errors"}
    if plan.get("actions"):
        return {"decision": "execute", "action_count": len(plan["actions"])}
    return {"decision": "observe", "reason": "no_actions"}
