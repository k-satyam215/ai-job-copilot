def generate_cover_letter(job: dict, profile: dict, tone: str = "concise") -> dict:
    skills = ", ".join((profile.get("skills") or [])[:5])
    body = (
        f"I am excited to apply for {job.get('title', 'this role')} at {job.get('company', 'your company')}. "
        f"My experience with {skills or 'software engineering'} aligns with the role, and I can contribute with ownership and speed."
    )
    return {"tone": tone, "cover_letter": body}
