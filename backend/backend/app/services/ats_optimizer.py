def ats_score(resume_text: str, job: dict) -> dict:
    text = (resume_text or "").lower()
    job_skills = [str(skill).lower() for skill in job.get("skills", [])]
    covered = sorted({skill for skill in job_skills if skill in text})
    missing = sorted(set(job_skills) - set(covered))
    score = round((len(covered) / max(len(job_skills), 1)) * 100) if job_skills else 55
    return {"ats_score": score, "covered_keywords": covered, "missing_keywords": missing}
