from app.services.agent.workflow_memory import _WORKFLOWS


def replay_workflow(workflow_id: str) -> dict:
    state = _WORKFLOWS.get(workflow_id)
    if not state:
        return {"workflow_id": workflow_id, "found": False, "actions": []}
    return {"workflow_id": workflow_id, "found": True, "status": state.status, "actions": state.actions, "errors": state.errors}
