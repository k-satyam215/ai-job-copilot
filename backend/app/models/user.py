from datetime import datetime

from sqlalchemy import JSON, Boolean, Column, DateTime, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(64), nullable=True)
    hashed_password = Column(String(255), nullable=False)
    plan = Column(String(32), default="free", nullable=False)
    ai_credits = Column(Integer, default=25, nullable=False)
    resume_path = Column(String(512), nullable=True)
    resume_text = Column(Text, nullable=True)
    profile_json = Column(JSON, nullable=True)
    preferences_json = Column(JSON, nullable=True)

    is_verified = Column(Boolean, default=False, nullable=False)
    verification_token = Column(String(128), nullable=True, index=True)
    verified_at = Column(DateTime, nullable=True)

    reset_token = Column(String(128), nullable=True, index=True)
    reset_token_expires_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    credits_reset_at = Column(DateTime, nullable=True)

    applications = relationship("Application", back_populates="user", lazy="dynamic")
