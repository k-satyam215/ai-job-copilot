from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse

from app.models.user import User
from app.services.metrics_dashboard import system_metrics
from app.services.trace_engine import recent_traces
from app.services.workflow_replay import replay_workflow
from app.services.env_validator import validate_environment
from app.services.notifier import subscribe, sse_stream
from app.services.credit_scheduler import reset_all_user_credits
from app.utils.security import get_current_user
from app.database import get_db
from jose import JWTError, jwt
from app.config import get_settings
from sqlalchemy.orm import Session
import os


router = APIRouter()
settings = get_settings()


def _is_ops_admin(user: User) -> bool:
    admin_emails = {e.strip().lower() for e in os.getenv("ADMIN_EMAILS", "").split(",") if e.strip()}
    return user.email.lower() in admin_emails if admin_emails else False


@router.get("/metrics")
def metrics(user: User = Depends(get_current_user)):
    return system_metrics()


@router.get("/traces")
def traces(user: User = Depends(get_current_user)):
    return {"traces": recent_traces()}


@router.get("/workflow/{workflow_id}")
def workflow(workflow_id: str, user: User = Depends(get_current_user)):
    return replay_workflow(workflow_id)


@router.get("/launch-readiness")
def launch_readiness(user: User = Depends(get_current_user)):
    return validate_environment(production=True)


@router.post("/reset-credits")
def reset_credits(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    """Admin-only: reset all user credits to their plan maximum (monthly cycle)."""
    if not _is_ops_admin(user):
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Admin access required. Set ADMIN_EMAILS env var.")
    return reset_all_user_credits(db)


@router.get("/stream")
async def sse_endpoint(token: str = Query(...), db: Session = Depends(get_db)):
    """Server-Sent Events stream for real-time job notifications.
    Token is passed as query param since EventSource doesn't support headers.
    """
    user_id: int | None = None
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        uid = payload.get("sub")
        if uid:
            user = db.query(User).filter(User.id == int(uid)).first()
            if user:
                user_id = user.id
    except (JWTError, Exception):
        pass

    if not user_id:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Invalid token for SSE stream")

    queue = subscribe(user_id)

    return StreamingResponse(
        sse_stream(user_id, queue),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
