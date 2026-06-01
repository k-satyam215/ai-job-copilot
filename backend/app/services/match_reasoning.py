def match_reasons(match: dict) -> list[str]:
    reasons = []
    if match.get("matched_skills"):
        reasons.append("Relevant skills overlap with the role.")
    if match.get("semantic_score", 0) >= 50:
        reasons.append("Resume context is semantically close to the job description.")
    if match.get("missing_skills"):
        reasons.append("Some skill gaps remain; review before applying.")
    return reasons or ["Not enough signal yet."]
