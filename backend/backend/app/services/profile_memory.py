from app.models.user import User


def build_profile_memory(user: User) -> dict:
    profile = user.profile_json or {}
    preferences = user.preferences_json or {}
    return {
        "full_name": user.full_name,
        "email": user.email,
        "phone": user.phone,
        "current_ctc": preferences.get("current_ctc", ""),
        "expected_ctc": preferences.get("expected_ctc", "Negotiable"),
        "notice_period": preferences.get("notice_period", "Immediate"),
        "location": preferences.get("location", "India"),
        "relocation": preferences.get("relocation", "Yes, open to relocate for the right opportunity"),
        "linkedin": preferences.get("linkedin", ""),
        "portfolio": preferences.get("portfolio", ""),
        "work_authorization": preferences.get("work_authorization", "Yes"),
        "skills": profile.get("skills", []),
        "frameworks": profile.get("frameworks", []),
        "experience": profile.get("experience", ""),
        "job_roles": profile.get("job_roles", []),
        "seniority": profile.get("seniority", ""),
        "projects": profile.get("projects", []),
        "strengths": profile.get("strengths", []),
        "summary": profile.get("summary", ""),
    }
