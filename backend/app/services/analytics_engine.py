from collections import Counter

from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.job import Job


def user_analytics(db: Session, user_id: int) -> dict:
    applications = db.query(Application).filter(Application.user_id == user_id).all()
    statuses = Counter(app.status for app in applications)
    avg_match = round(sum(app.match_score for app in applications) / max(len(applications), 1))
    companies = Counter(app.company for app in applications)
    return {
        "total_applications": len(applications),
        "status_counts": dict(statuses),
        "average_match_score": avg_match,
        "top_companies": companies.most_common(8),
        "interview_rate": round((statuses.get("interview", 0) / max(len(applications), 1)) * 100),
        "offer_rate": round((statuses.get("offer", 0) / max(len(applications), 1)) * 100),
    }


def platform_analytics(db: Session) -> dict:
    return {
        "jobs": db.query(Job).count(),
        "applications": db.query(Application).count(),
    }
