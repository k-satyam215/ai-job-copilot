"""Production-grade FastAPI entry point for AI Job Copilot SaaS.

Adds the following SaaS hardening on top of the MVP:
- Structured SaaS landing info at GET / (for uptime-checkers and marketing scrapers)
- Health + readiness endpoints
- Optional Sentry observability
- Optional slowapi rate limiting (in-memory, per-process)
- Standard security headers
- CORS tightened to configured origins (no longer wildcard)
"""
from __future__ import annotations

import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse, Response
from starlette.middleware.base import BaseHTTPMiddleware

from app.config import get_settings
from app.database import Base, engine
from app.monitoring import RequestTimingMiddleware
from app.models import application, job, user  # noqa: F401  (register tables)
from app.routes import (
    admin,
    analytics,
    apply,
    auth,
    automation,
    billing,
    copilot,
    jobs,
    ops,
    resume,
)


settings = get_settings()
logger = logging.getLogger(__name__)

# ---------- Create tables (Alembic should replace this in prod) ----------
Base.metadata.create_all(bind=engine)

# ---------- Optional Sentry ----------
if settings.sentry_dsn:
    try:
        import sentry_sdk
        from sentry_sdk.integrations.fastapi import FastApiIntegration
        from sentry_sdk.integrations.starlette import StarletteIntegration

        sentry_sdk.init(
            dsn=settings.sentry_dsn,
            environment=settings.app_env,
            release=f"{settings.app_name}@{settings.app_version}",
            traces_sample_rate=0.1 if settings.is_production else 1.0,
            integrations=[FastApiIntegration(), StarletteIntegration()],
        )
        logger.info("Sentry initialised (env=%s)", settings.app_env)
    except Exception as exc:  # noqa: BLE001
        logger.warning("Sentry init failed: %s", exc)


# ---------- App factory ----------
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "Autonomous AI career agent: resume parsing, multi-portal job discovery, "
        "hybrid matching, Chrome-extension form auto-fill, and apply automation."
    ),
    docs_url="/docs" if not settings.is_production else None,
    redoc_url="/redoc" if not settings.is_production else None,
    openapi_url="/openapi.json" if not settings.is_production else None,
)


# ---------- Security headers middleware ----------
class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        response.headers.setdefault("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
        if settings.is_production:
            response.headers.setdefault(
                "Strict-Transport-Security",
                "max-age=31536000; includeSubDomains; preload",
            )
        return response


# ---------- Trusted hosts (protect against host header injection) ----------
if settings.is_production:
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=["*"],  # tighten once you have a domain
    )

# ---------- CORS (tightened) ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list or [settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
    max_age=600,
)

# ---------- Security + timing ----------
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestTimingMiddleware)


# ---------- Optional rate limit ----------
if settings.rate_limit_per_minute > 0:
    try:
        from slowapi import Limiter, _rate_limit_exceeded_handler
        from slowapi.errors import RateLimitExceeded
        from slowapi.util import get_remote_address

        limiter = Limiter(
            key_func=get_remote_address,
            default_limits=[
                f"{settings.rate_limit_per_minute}/minute",
                f"{settings.rate_limit_burst}/minute",
            ],
        )
        app.state.limiter = limiter
        app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
        logger.info("Rate limit enabled: %d/min", settings.rate_limit_per_minute)
    except Exception as exc:  # noqa: BLE001
        logger.warning("slowapi not installed, rate limit disabled: %s", exc)


# ---------- Public routes ----------
@app.api_route("/", methods=["GET", "HEAD"], tags=["meta"], include_in_schema=False)
def home():
    """Root endpoint — supports HEAD for Render health checks and uptime monitors."""
    return {
        "name": settings.app_name,
        "tagline": "Your autonomous AI career agent",
        "version": settings.app_version,
        "status": "operational",
        "ai_enabled": settings.ai_enabled,
        "docs": "/docs" if not settings.is_production else None,
        "health": "/health",
        "ready": "/ready",
    }


@app.api_route("/health", methods=["GET", "HEAD"], tags=["meta"])
def health():
    """Liveness probe — supports HEAD for Render health checks."""
    return {
        "status": "ok",
        "service": settings.app_name,
        "version": settings.app_version,
        "ai_enabled": settings.ai_enabled,
        "env": settings.app_env,
    }


@app.get("/ready", tags=["meta"])
def ready():
    """Readiness probe — verifies DB connectivity."""
    from sqlalchemy import text
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return {"status": "ready", "database": "ok"}
    except Exception as exc:  # noqa: BLE001
        return JSONResponse(
            status_code=503,
            content={"status": "not_ready", "database": "down", "error": str(exc)},
        )


# ---------- Routers ----------
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(apply.router, prefix="/apply", tags=["apply"])
app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(copilot.router, prefix="/copilot", tags=["copilot"])
app.include_router(automation.router, prefix="/automation", tags=["automation"])
app.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
app.include_router(billing.router, prefix="/billing", tags=["billing"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(ops.router, prefix="/ops", tags=["ops"])


# ---------- Global error handler ----------
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception on %s %s", request.method, request.url.path)
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "path": str(request.url.path),
        },
    )


# ---------- Startup banner ----------
@app.on_event("startup")
async def _startup_banner():
    logger.info("=" * 60)
    logger.info(" %s v%s — env=%s", settings.app_name, settings.app_version, settings.app_env)
    logger.info(" AI: %s | CORS: %s", "on" if settings.ai_enabled else "off", settings.cors_origins_list)
    logger.info(" Billing: razorpay=%s stripe=%s", settings.razorpay_enabled, settings.stripe_enabled)
    logger.info("=" * 60)

    # ---------- Background job poller ----------
    if settings.app_env != "development" or not settings.is_sqlite:
        try:
            import asyncio as _asyncio
            from app.services.job_poller import start_job_poller
            _asyncio.create_task(start_job_poller())
            logger.info("Background job poller scheduled")
        except Exception as exc:
            logger.warning("Job poller failed to start: %s", exc)
    else:
        logger.info("Job poller skipped (local SQLite dev mode)")


# ---------- Shutdown ----------
@app.on_event("shutdown")
async def _shutdown():
    logger.info("Shutting down %s ...", settings.app_name)
