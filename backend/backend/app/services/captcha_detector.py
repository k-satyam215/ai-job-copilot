def detect_captcha(page_text: str) -> dict:
    text = (page_text or "").lower()
    found = any(phrase in text for phrase in ["captcha", "verify you are human", "unusual activity", "security check"])
    return {"captcha_detected": found, "action": "pause_for_user" if found else "continue"}
