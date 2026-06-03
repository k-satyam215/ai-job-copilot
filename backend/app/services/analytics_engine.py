from collections import Counter

from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.job import Job


def user_analytics(db: Session, user_id: int) -> dict:
    applications = db.query(Application).filter(Application.user_id == user_id).all()
    statuses = Counter(app.status for app in applications)
    avg_match = round(sum(app.match_score for app in applications) / max(len(applications), 1))
    companies = Counter(app.company for app in applications)
    platforms = Counter(app.platform for app in applications if app.platform)
    return {
        "total_applications": len(applications),
        # Backwards-compat keys
        "status_counts": dict(statuses),
        "top_companies": companies.most_common(8),
        # Frontend-expected keys (P0 #4 fix — frontend reads these)
        "applications_by_status": dict(statuses),
        "by_platform": dict(platforms),
        # Other analytics
        "average_match_score": avg_match,
        "interview_rate": round((statuses.get("interview", 0) / max(len(applications), 1)) * 100),
        "offer_rate": round((statuses.get("offer", 0) / max(len(applications), 1)) * 100),
    }


def platform_analytics(db: Session) -> dict:
    return {
        "jobs": db.query(Job).count(),
        "applications": db.query(Application).count(),
    }
