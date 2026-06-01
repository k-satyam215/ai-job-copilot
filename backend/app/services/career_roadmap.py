def build_roadmap(target_role: str, profile: dict, gaps: list[dict]) -> dict:
    skills = [gap["skill"] for gap in gaps[:6]]
    return {
        "target_role": target_role,
        "next_skills": skills,
        "roadmap": [
            {"week": 1, "focus": "Strengthen core role fundamentals", "outputs": ["1 portfolio-ready mini project"]},
            {"week": 2, "focus": ", ".join(skills[:2]) or "job-specific tooling", "outputs": ["Resume bullet updates"]},
            {"week": 3, "focus": ", ".join(skills[2:4]) or "system design", "outputs": ["Interview notes"]},
            {"week": 4, "focus": "Apply and iterate", "outputs": ["20 targeted applications", "mock interview"]},
        ],
    }
