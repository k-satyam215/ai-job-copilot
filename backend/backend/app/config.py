

"""Production-grade configuration for AI Job Copilot.

Uses pydantic-settings to load, validate, and type-check every
environment variable. Provides a cached `get_settings()` accessor so
the rest of the codebase can pull strongly-typed settings from one place.

Refusal to start on invalid configuration is intentional: in
production we want a loud failure at boot, not a silent fallback.
"""
from __future__ import annotations

import logging
import secrets
from functools import lru_cache
from pathlib import Path
from typing import Literal

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict




logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Strongly typed application configuration."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
        # Allow parsing of comma-separated lists where appropriate
    )

    # ---------- App ----------
    app_name: str = "AI Job Copilot"
    app_env: Literal["development", "staging", "production"] = "development"
    app_version: str = "0.2.0"
    app_debug: bool = False
    app_port: int = 8000
    app_host: str = "0.0.0.0"
    app_log_level: str = "INFO"
    app_timezone: str = "Asia/Kolkata"

    # ---------- Database ----------
    database_url: str = "sqlite:///./ai_job_copilot.db"

    database_pool_size: int = 10
    database_max_overflow: int = 20
    database_pool_timeout: int = 30
    database_echo: bool = False

    # ---------- Security ----------
    jwt_secret: str = Field(default="dev-only-insecure-secret-change-me")
    jwt_algorithm: str = "HS256"

    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days

    # ---------- AI / LLM (Groq) ----------
    groq_api_key: str | None = None
    groq_model: str = "llama-3.3-70b-versatile"
    groq_timeout_seconds: int = 45
    groq_temperature: float = 0.2
    ai_fallback_enabled: bool = True

    # ---------- Embeddings ----------
    embedding_backend: Literal["hash", "sentence-transformer", "openai"] = "hash"
    embedding_model: str = "sentence-transformers/all-MiniLM-L6-v2"
    embedding_dim: int = 384
    embedding_cache_dir: str = ".cache/embeddings"

    # ---------- Vector Store ----------
    vector_backend: Literal["memory", "pgvector", "qdrant", "pinecone"] = "memory"
    vector_top_k: int = 20

    # ---------- Frontend / CORS ----------
    frontend_origin: str = "http://localhost:3000"
    cors_allow_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    # ---------- Resume Uploads ----------
    resume_upload_dir: str = "uploads"
    resume_max_bytes: int = 5 * 1024 * 1024  # 5 MB
    resume_allowed_ext: str = ".pdf,.txt"

    # ---------- Matching ----------
    high_match_threshold: int = 75
    review_match_threshold: int = 50

    # ---------- Rate Limiting ----------
    rate_limit_per_minute: int = 60
    rate_limit_burst: int = 100

    # ---------- Razorpay (Billing) ----------
    razorpay_enabled: bool = False
    razorpay_key_id: str | None = None
    razorpay_key_secret: str | None = None
    razorpay_webhook_secret: str | None = None
    razorpay_currency: str = "INR"
    razorpay_plan_pro_id: str | None = None
    razorpay_plan_elite_id: str | None = None

    # ---------- Stripe (Optional) ----------
    stripe_enabled: bool = False
    stripe_secret_key: str | None = None
    stripe_webhook_secret: str | None = None
    stripe_price_pro: str | None = None
    stripe_price_elite: str | None = None

    # ---------- Email / SMTP ----------
    smtp_host: str | None = None
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_pass: str | None = None
    smtp_from: str = "AI Job Copilot <no-reply@aijobcopilot.com>"
    smtp_tls: bool = True

    # ---------- Telegram ----------
    telegram_bot_token: str | None = None
    telegram_default_chat_id: str | None = None

    # ---------- WhatsApp ----------
    whatsapp_access_token: str | None = None
    whatsapp_phone_number_id: str | None = None
    whatsapp_verify_token: str | None = None

    # ---------- Job Sources ----------
    job_scraper_timeout: int = 20
    job_scraper_concurrency: int = 6
    job_fetch_default_pages: int = 2
    job_quality_min_score: int = 40

    # ---------- Observability ----------
    sentry_dsn: str | None = None
    log_json: bool = False
    log_file: str = "logs/app.log"

    # ---------- Feature Flags ----------
    feature_autonomous_apply: bool = False
    feature_telegram_notify: bool = True
    feature_whatsapp_notify: bool = False
    feature_vector_search: bool = True
    feature_agent_v2: bool = False

    # ---------- Worker / Queue ----------
    redis_url: str = "redis://localhost:6379/0"
    celery_broker_url: str = "redis://localhost:6379/1"
    celery_result_backend: str = "redis://localhost:6379/2"

    # ---------- Validators ----------
    @field_validator("jwt_secret")
    @classmethod
    def _validate_jwt_secret(cls, value: str, info) -> str:
        env = info.data.get("app_env", "development")
        if env in {"staging", "production"}:
            insecure = {
                "",
                "change-me-in-production",
                "dev-only-insecure-secret-change-me",
                "replace-with-long-random-secret",
                "replace-with-long-random-secret-at-least-32-chars",
            }
            if value in insecure or len(value) < 32:
                raise ValueError(
                    "JWT_SECRET must be a strong, unique value (>=32 chars) "
                    f"in {env}. Generate with: python -c 'import secrets; print(secrets.token_urlsafe(64))'"
                )
        return value

    @field_validator("high_match_threshold", "review_match_threshold")
    @classmethod
    def _validate_thresholds(cls, value: int) -> int:
        if not 0 <= value <= 100:
            raise ValueError("Thresholds must be between 0 and 100")
        return value

    @field_validator("resume_max_bytes")
    @classmethod
    def _validate_resume_size(cls, value: int) -> int:
        if value <= 0 or value > 50 * 1024 * 1024:
            raise ValueError("resume_max_bytes must be between 1 byte and 50 MB")
        return value

    # ---------- Derived properties ----------
    @property
    def is_production(self) -> bool:
        return self.app_env == "production"

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_allow_origins.split(",") if origin.strip()]

    @property
    def resume_allowed_ext_list(self) -> list[str]:
        return [ext.strip().lower() for ext in self.resume_allowed_ext.split(",") if ext.strip()]

    @property
    def ai_enabled(self) -> bool:
        return bool(self.groq_api_key)


@lru_cache
def get_settings() -> Settings:
    """Return cached settings instance.

    The cache means environment variables are read once per process.
    Call `get_settings.cache_clear()` in tests if you need to reload.
    """
    settings = Settings()
    if settings.app_debug:
        logger.warning("Running with APP_DEBUG=true — never enable in production")
    if not settings.ai_enabled and settings.ai_fallback_enabled:
        logger.info("GROQ_API_KEY not set — AI features will use local fallback rules")
    return settings


def generate_jwt_secret() -> str:
    """Helper to print a secure JWT secret to stdout."""
    print(secrets.token_urlsafe(64))


# Ensure upload directory exists on import (idempotent)
try:
    Path(get_settings().resume_upload_dir).mkdir(parents=True, exist_ok=True)
except Exception:  # noqa: BLE001
    pass
