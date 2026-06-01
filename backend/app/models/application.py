from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=True)
    job_url = Column(String(1024), index=True, nullable=False)
    company = Column(String(255), nullable=False)
    title = Column(String(255), nullable=False)
    status = Column(String(64), default="tracked", nullable=False)
    match_score = Column(Integer, default=0, nullable=False)
    notes = Column(String(1024), nullable=True)
    answers_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="applications")
    job = relationship("Job", back_populates="applications")
