def bot_risk_score(signals: dict) -> dict:
    score = 0
    if signals.get("captcha_detected"):
        score += 80
    if signals.get("too_many_attempts"):
        score += 20
    return {"risk_score": min(score, 100), "pause_required": score >= 80}
