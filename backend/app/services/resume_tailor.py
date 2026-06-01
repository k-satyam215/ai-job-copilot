from app.services.ats_optimizer import ats_score


def tailor_resume(resume_text: str, job: dict, profile: dict | None = None) -> dict:
    profile = profile or {}
    ats = ats_score(resume_text, job)
    missing = ats["missing_keywords"][:8]
    suggested_bullets = []
    skills = ", ".join((profile.get("skills") or [])[:6])
    if skills:
        suggested_bullets.append(f"Built and improved software systems using {skills}, with focus on reliability and maintainability.")
    for skill in missing:
        suggested_bullets.append(f"Add a truthful project or achievement showing hands-on {skill} experience if applicable.")
    return {
        **ats,
        "tailored_summary": (
            f"Candidate fit for {job.get('title', 'this role')} with strengths in "
            f"{skills or 'software engineering'}."
        ),
        "suggested_bullets": suggested_bullets[:6],
        "truthfulness_policy": "Only add suggested keywords when the experience is real.",
    }
