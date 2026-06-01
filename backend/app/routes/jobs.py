from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job import Job
from app.models.user import User
from app.services.deduplicator import upsert_job
from app.services.job_parser import parse_job
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
