from app.models.user import User


def onboarding_status(user: User) -> dict:
    preferences = user.preferences_json or {}
    checks = {
        "resume_uploaded": bool(user.resume_text and user.profile_json),
        "copilot_memory_saved": bool(preferences.get("notice_period") or preferences.get("expected_ctc")),
        "telegram_ready": bool(preferences.get("telegram_chat_id")),
        "whatsapp_ready": bool(preferences.get("whatsapp_phone")),
        "profile_skills_detected": bool((user.profile_json or {}).get("skills")),
    }
    completed = sum(1 for value in checks.values() if value)
    return {
        "checks": checks,
        "completed": completed,
        "total": len(checks),
        "score": round((completed / max(len(checks), 1)) * 100),
        "next_action": next((key for key, value in checks.items() if not value), "ready_to_discover_jobs"),
    }
