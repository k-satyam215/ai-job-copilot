from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.job import Job
from app.models.user import User
from app.services.analytics_engine import user_analytics
from app.services.career_roadmap import build_roadmap
from app.services.interview_agent import generate_interview_pack
from app.services.resume_tailor import tailor_resume
from app.services.skill_gap_engine import skill_gaps
from app.utils.security import get_current_user


router = APIRouter()


@router.get("/overview")
def overview(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return user_analytics(db, user.id)


@router.get("/skill-gaps")
def gaps(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).limit(100).all()
    payload = [{"skills": job.skills_json or []} for job in jobs]
    return skill_gaps(user.profile_json or {}, payload)


@router.post("/interview")
def interview(job: dict, user: User = Depends(get_current_user)):
    return generate_interview_pack(job, user.profile_json or {})


@router.post("/roadmap")
def roadmap(payload: dict, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).limit(100).all()
    gaps_payload = skill_gaps(user.profile_json or {}, [{"skills": job.skills_json or []} for job in jobs])
    return build_roadmap(payload.get("target_role") or "AI Engineer", user.profile_json or {}, gaps_payload["missing_skills"])


@router.post("/tailor-resume")
def tailor(payload: dict, user: User = Depends(get_current_user)):
    return tailor_resume(user.resume_text or "", payload.get("job") or {}, user.profile_json or {})
