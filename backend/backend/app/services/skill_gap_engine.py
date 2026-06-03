from collections import Counter


def skill_gaps(profile: dict, jobs: list[dict]) -> dict:
    user_skills = {str(skill).lower() for skill in profile.get("skills", [])}
    required = Counter()
    for job in jobs:
        for skill in job.get("skills", []) or []:
            required[str(skill).lower()] += 1
    missing = [(skill, count) for skill, count in required.most_common(20) if skill not in user_skills]
    return {
        "missing_skills": [{"skill": skill, "demand": count} for skill, count in missing[:10]],
        "strong_skills": sorted(user_skills & set(required.keys())),
    }
