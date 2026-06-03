from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job import Job
from app.models.user import User
from app.services.deduplicator import upsert_job
from app.services.cover_letter_optimizer import generate_cover_letter
from app.services.job_aggregator import fetch_jobs_from_all_sources
from app.services.job_parser import parse_job
from app.services.explanation_engine import explain_recommendation
from app.services.match_reasoning import match_reasons
from app.services.resume_tailor import tailor_resume
from app.services.vector_matcher import hybrid_match
from app.utils.security import get_current_user


router = APIRouter()


class JobPayload(BaseModel):
    source: str | None = "extension"
    title: str
    company: str
    location: str | None = None
    experience: str | None = None
    salary: str | None = None
    url: str | None = None
    description: str | None = None
    skills: list[str] = []


class DiscoverPayload(BaseModel):
    keyword: str | None = None
    pages: int = 1


@router.post("/match")
def match(payload: JobPayload, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if not user.profile_json:
        raise HTTPException(status_code=400, detail="Upload and parse resume before matching jobs")
    job, created = upsert_job(db, payload.model_dump())
    enriched = {**payload.model_dump(), "job_intelligence": parse_job(payload.model_dump())}
    result = hybrid_match(enriched, user.profile_json)
    return {"job_id": job.id, "created": created, **result}


@router.get("/")
def list_jobs(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).limit(100).all()
    return [
        {
            "id": job.id,
            "source": job.source,
            "title": job.title,
            "company": job.company,
            "location": job.location,
            "experience": job.experience,
            "url": job.url,
            "skills": job.skills_json or [],
            "match": hybrid_match(
                {
                    "title": job.title,
                    "company": job.company,
                    "description": job.description,
                    "skills": job.skills_json or [],
                    "experience": job.experience,
                    "location": job.location,
                },
                user.profile_json or {},
            ),
        }
        for job in jobs
    ]


@router.post("/discover")
async def discover(payload: DiscoverPayload, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    profile = user.profile_json or {}
    keyword = payload.keyword or next(iter(profile.get("job_roles", []) or profile.get("skills", []) or ["software engineer"]))
    fetched = await fetch_jobs_from_all_sources(str(keyword), pages=max(1, min(payload.pages, 2)))
    saved = []
    for item in fetched:
        job, created = upsert_job(db, item)
        match = hybrid_match(item, profile)
        explanation = explain_recommendation(match, item)
        saved.append({
            "id": job.id,
            "created": created,
            "title": job.title,
            "company": job.company,
            "source": job.source,
            "url": job.url,
            "match": match,
            "explanation": explanation,
            "reasons": match_reasons(match),
        })
    return {"keyword": keyword, "count": len(saved), "jobs": sorted(saved, key=lambda row: row["match"]["match_score"], reverse=True)}


@router.post("/apply-kit")
def apply_kit(payload: JobPayload, user: User = Depends(get_current_user)):
    job = payload.model_dump()
    profile = user.profile_json or {}
    tailoring = tailor_resume(user.resume_text or "", job, profile)
    cover_letter = generate_cover_letter(job, profile)
    match = hybrid_match(job, profile)
    explanation = explain_recommendation(match, job)
    return {
        "job": job,
        "match": match,
        "explanation": explanation,
        "reasons": match_reasons(match),
        "tailored_resume": tailoring,
        "cover_letter": cover_letter,
        "apply_mode": "AI fills and prepares; user reviews and clicks final Apply",
    }


@router.get("/source-health")
def source_health():
    return {
        "sources": [
            {"name": "naukri", "mode": "api", "status": "enabled"},
            {"name": "linkedin", "mode": "search_url", "status": "enabled"},
            {"name": "foundit", "mode": "search_url", "status": "enabled"},
            {"name": "indeed", "mode": "search_url", "status": "enabled"},
            {"name": "unstop", "mode": "search_url", "status": "enabled"},
            {"name": "apna", "mode": "search_url", "status": "enabled"},
        ],
        "note": "Search URL sources provide fresh result entry points; dedicated APIs can be upgraded per provider.",
    }
