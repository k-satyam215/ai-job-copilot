import re


KNOWN_SKILLS = [
    "python", "fastapi", "django", "flask", "javascript", "typescript", "react", "next.js",
    "node.js", "sql", "postgresql", "mongodb", "redis", "docker", "kubernetes", "aws",
    "azure", "gcp", "llm", "rag", "langchain", "machine learning", "playwright",
]


def parse_job(job: dict) -> dict:
    text = " ".join(str(job.get(key, "")) for key in ["title", "description", "skills", "experience"]).lower()
    skills = sorted({skill for skill in KNOWN_SKILLS if skill in text})
    seniority = "senior" if "senior" in text or "lead" in text else "junior" if "junior" in text or "fresher" in text else "mid"
    location_mode = "remote" if "remote" in text else "hybrid" if "hybrid" in text else "onsite"
    salary = re.findall(r"(?:₹|rs\.?|inr|\$)?\s?\d+(?:\.\d+)?\s?(?:lpa|lakhs?|k|usd)?", text)
    return {
        "role": job.get("title") or "Unknown role",
        "seniority": seniority,
        "required_skills": skills[:8],
        "optional_skills": [],
        "salary": salary[:3],
        "experience": job.get("experience") or "",
        "location_mode": location_mode,
        "tech_stack": skills,
        "risks": ["external_apply"] if "external" in text else [],
    }
