def explain_recommendation(match: dict, job: dict) -> dict:
    return {
        "summary": f"Recommended because match score is {match.get('match_score', 0)}%.",
        "matched_skills": match.get("matched_skills", []),
        "missing_skills": match.get("missing_skills", []),
        "role_score": match.get("role_score", 0),
    }
