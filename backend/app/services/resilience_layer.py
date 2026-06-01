def fallback_value(primary, fallback):
    return primary if primary not in (None, "", [], {}) else fallback


def safe_mode_response(reason: str, action: str = "pause_for_user") -> dict:
    return {"status": "safe_mode", "action": action, "reason": reason, "requires_user": True}
