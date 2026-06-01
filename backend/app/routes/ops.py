from fastapi import APIRouter, Depends

from app.models.user import User
from app.services.metrics_dashboard import system_metrics
from app.services.trace_engine import recent_traces
from app.services.workflow_replay import replay_workflow
from app.services.env_validator import validate_environment
from app.utils.security import get_current_user


router = APIRouter()


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
