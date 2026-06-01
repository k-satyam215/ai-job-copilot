from app.services.embedding_service import cosine_similarity, embed_text
from app.services.matcher import match_job


def hybrid_match(job: dict, profile: dict) -> dict:
    base = match_job(job, profile)
    profile_text = " ".join(str(value) for value in [
        profile.get("summary", ""),
        profile.get("skills", []),
        profile.get("projects", []),
        profile.get("job_roles", []),
    ])
    job_text = " ".join(str(value) for value in [job.get("title", ""), job.get("description", ""), job.get("skills", [])])
    vector_score = round(cosine_similarity(embed_text(profile_text), embed_text(job_text)) * 100)
    base["vector_score"] = vector_score
    base["match_score"] = round(base["match_score"] * 0.7 + vector_score * 0.3)
    base["recommendation"] = "apply" if base["match_score"] >= 70 else "review" if base["match_score"] >= 50 else "skip"
    return base
