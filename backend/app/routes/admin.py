from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.application import Application
from app.models.job import Job
from app.models.user import User
from app.utils.security import get_current_user


router = APIRouter()


@router.get("/summary")
def summary(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    if user.plan != "enterprise":
        raise HTTPException(status_code=403, detail="Admin dashboard requires enterprise plan")
    return {
        "users": db.query(User).count(),
        "jobs": db.query(Job).count(),
        "applications": db.query(Application).count(),
        "credits_issued": sum(row.ai_credits for row in db.query(User).all()),
    }
