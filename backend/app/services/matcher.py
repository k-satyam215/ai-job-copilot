import re
from difflib import SequenceMatcher


def _tokens(value: str) -> set[str]:
    return {token for token in re.findall(r"[a-zA-Z0-9.+#-]+", value.lower()) if len(token) > 1}


def _normalize_list(values: list | None) -> list[str]:
    return sorted({" ".join(str(value).lower().strip().split()) for value in values or [] if value})


def _similarity(left: str, right: str) -> float:
    return SequenceMatcher(None, left.lower(), right.lower()).ratio()


def match_job(job: dict, profile: dict | None = None) -> dict:
    profile = profile or {}
    user_skills = _normalize_list(profile.get("skills", []))
    user_roles = _normalize_list(profile.get("job_roles", []))
    job_skills = _normalize_list(job.get("skills", []))
    job_text = " ".join(
        str(job.get(key, "")) for key in ["title", "company", "description", "experience", "location"]
    ).lower()

    inferred_job_skills = sorted({skill for skill in user_skills if skill and skill in job_text})
    all_job_skills = sorted(set(job_skills + inferred_job_skills))
    matched_skills = sorted({skill for skill in user_skills if skill in all_job_skills or skill in job_text})

    skill_score = int((len(matched_skills) / max(len(all_job_skills), 1)) * 100) if all_job_skills else 45
    role_score = max([int(_similarity(role, job.get("title", "")) * 100) for role in user_roles] or [45])

    user_bag = _tokens(" ".join(user_skills + user_roles + [profile.get("summary", "") or ""]))
    job_bag = _tokens(job_text + " " + " ".join(all_job_skills))
    semantic_score = int((len(user_bag & job_bag) / max(len(job_bag), 1)) * 100) if job_bag else 40

    score = round((skill_score * 0.45) + (semantic_score * 0.30) + (role_score * 0.25))
    score = max(0, min(100, score))

    return {
        "match_score": score,
        "matched_skills": matched_skills,
        "missing_skills": sorted(set(all_job_skills) - set(matched_skills)),
        "role_score": role_score,
        "semantic_score": semantic_score,
        "skill_score": skill_score,
        "recommendation": "apply" if score >= 70 else "review" if score >= 50 else "skip",
        "message": "AI match calculated",
    }
