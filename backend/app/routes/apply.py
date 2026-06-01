from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.user import User
from app.services.deduplicator import upsert_job
from app.services.matcher import match_job
from app.utils.security import get_current_user


router = APIRouter()


class ApplyPayload(BaseModel):
    title: str
    company: str
    url: str | None = None
    source: str | None = "extension"
    location: str | None = None
    experience: str | None = None
    description: str | None = None
    skills: list[str] = []
    status: str | None = "copilot_filled"
    answers: dict | None = None


@router.post("/")
def apply(payload: ApplyPayload, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    data = payload.model_dump()
    job, _ = upsert_job(db, data)
    match = match_job(data, user.profile_json or {})

    existing = (
        db.query(Application)
        .filter(Application.user_id == user.id, Application.job_url == job.url)
        .first()
    )
    if existing:
        existing.status = payload.status or existing.status
        existing.match_score = match["match_score"]
        existing.answers_json = payload.answers or existing.answers_json
        db.commit()
        db.refresh(existing)
        application = existing
    else:
        application = Application(
            user_id=user.id,
            job_id=job.id,
            job_url=job.url,
            company=job.company,
            title=job.title,
            status=payload.status or "copilot_filled",
            match_score=match["match_score"],
            answers_json=payload.answers,
        )
        db.add(application)
        db.commit()
        db.refresh(application)

    return {
        "status": application.status,
        "application_id": application.id,
        "company": application.company,
        "role": application.title,
        "match_score": application.match_score,
        "message": "Application tracked",
    }


@router.get("/")
def applications(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    rows = db.query(Application).filter(Application.user_id == user.id).order_by(Application.created_at.desc()).all()
    return [
        {
            "id": row.id,
            "title": row.title,
            "company": row.company,
            "job_url": row.job_url,
            "status": row.status,
            "match_score": row.match_score,
            "created_at": row.created_at.isoformat(),
        }
        for row in rows
    ]
