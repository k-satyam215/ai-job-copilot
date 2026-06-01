from sqlalchemy.orm import Session

from app.models.job import Job


def normalize_key(value: str | None) -> str:
    return " ".join((value or "").lower().strip().split())


def find_duplicate_job(db: Session, title: str, company: str, url: str | None = None) -> Job | None:
    if url:
        existing = db.query(Job).filter(Job.url == url).first()
        if existing:
            return existing

    title_key = normalize_key(title)
    company_key = normalize_key(company)
    for job in db.query(Job).filter(Job.company.ilike(f"%{company_key[:40]}%")).limit(25):
        if normalize_key(job.title) == title_key and normalize_key(job.company) == company_key:
            return job
    return None


def upsert_job(db: Session, payload: dict) -> tuple[Job, bool]:
    title = payload.get("title") or "Unknown Role"
    company = payload.get("company") or "Unknown Company"
    url = payload.get("url") or f"extension://{normalize_key(company)}-{normalize_key(title)}"
    existing = find_duplicate_job(db, title, company, url)
    if existing:
        existing.location = payload.get("location") or existing.location
        existing.experience = payload.get("experience") or existing.experience
        existing.description = payload.get("description") or existing.description
        existing.skills_json = payload.get("skills") or existing.skills_json
        existing.raw_json = payload
        db.commit()
        db.refresh(existing)
        return existing, False

    job = Job(
        source=payload.get("source") or "extension",
        title=title,
        company=company,
        location=payload.get("location"),
        experience=payload.get("experience"),
        salary=payload.get("salary"),
        url=url,
        description=payload.get("description"),
        skills_json=payload.get("skills") or [],
        raw_json=payload,
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return job, True
