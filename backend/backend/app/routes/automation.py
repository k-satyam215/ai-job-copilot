from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.models.user import User
from app.services.playwright_orchestrator import orchestrate_apply_workflow
from app.utils.security import get_current_user


router = APIRouter()


class WorkflowRequest(BaseModel):
    workflow_id: str
    source: str = "extension"
    job_url: str = ""
    autonomous_mode: bool = False
    observation: dict


@router.post("/workflow/plan")
def workflow_plan(payload: WorkflowRequest, user: User = Depends(get_current_user)):
    observation = {**payload.observation, "source": payload.source, "job_url": payload.job_url, "user_id": user.id}
    return orchestrate_apply_workflow(payload.workflow_id, observation, payload.autonomous_mode)
