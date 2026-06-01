from datetime import datetime

from sqlalchemy import JSON, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String(64), index=True, nullable=False)
    title = Column(String(255), index=True, nullable=False)
    company = Column(String(255), index=True, nullable=False)
    location = Column(String(255), nullable=True)
    experience = Column(String(128), nullable=True)
    salary = Column(String(128), nullable=True)
    url = Column(String(1024), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    skills_json = Column(JSON, nullable=True)
    raw_json = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    applications = relationship("Application", back_populates="job")
