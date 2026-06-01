from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import Base, engine
from app.monitoring import RequestTimingMiddleware
from app.models import application, job, user
from app.routes import admin, analytics, apply, auth, automation, billing, copilot, jobs, ops, resume


settings = get_settings()
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.app_name, version="0.2.0")
app.add_middleware(RequestTimingMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI Job Copilot Backend Running", "version": "0.2.0"}


@app.get("/health")
def health():
    return {"status": "ok", "ai_enabled": bool(settings.groq_api_key)}


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
