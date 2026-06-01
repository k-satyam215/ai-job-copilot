import os
from dataclasses import dataclass
from functools import lru_cache


@dataclass(frozen=True)
class Settings:
    app_name: str = "AI Job Copilot"
    database_url: str = "sqlite:///./ai_job_copilot.db"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7
    groq_api_key: str | None = None
    groq_model: str = "llama-3.3-70b-versatile"
    frontend_origin: str = "http://localhost:3000"
    resume_upload_dir: str = "uploads"
    high_match_threshold: int = 75


@lru_cache
def get_settings() -> Settings:
    return Settings(
        app_name=os.getenv("APP_NAME", "AI Job Copilot"),
        database_url=os.getenv("DATABASE_URL", "sqlite:///./ai_job_copilot.db"),
        jwt_secret=os.getenv("JWT_SECRET", "change-me-in-production"),
        jwt_algorithm=os.getenv("JWT_ALGORITHM", "HS256"),
        access_token_expire_minutes=int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", str(60 * 24 * 7))),
        groq_api_key=os.getenv("GROQ_API_KEY"),
        groq_model=os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile"),
        frontend_origin=os.getenv("FRONTEND_ORIGIN", "http://localhost:3000"),
        resume_upload_dir=os.getenv("RESUME_UPLOAD_DIR", "uploads"),
        high_match_threshold=int(os.getenv("HIGH_MATCH_THRESHOLD", "75")),
    )
