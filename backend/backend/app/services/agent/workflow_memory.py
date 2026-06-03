from dataclasses import dataclass, field
from datetime import datetime


@dataclass
class WorkflowState:
    workflow_id: str
    source: str
    job_url: str
    status: str = "observing"
    current_step: int = 0
    actions: list[dict] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
    created_at: datetime = field(default_factory=datetime.utcnow)


_WORKFLOWS: dict[str, WorkflowState] = {}


def get_workflow(workflow_id: str, source: str = "extension", job_url: str = "") -> WorkflowState:
    if workflow_id not in _WORKFLOWS:
        _WORKFLOWS[workflow_id] = WorkflowState(workflow_id=workflow_id, source=source, job_url=job_url)
    return _WORKFLOWS[workflow_id]


def record_action(workflow_id: str, action: dict) -> WorkflowState:
    state = get_workflow(workflow_id)
    state.actions.append(action)
    state.current_step += 1
    state.status = action.get("status", state.status)
    if action.get("error"):
        state.errors.append(action["error"])
    return state
