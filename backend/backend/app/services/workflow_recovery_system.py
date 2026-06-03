from app.services.resilience_orchestrator import resilience_plan


def recover_workflow(state: dict) -> dict:
    return {"workflow_id": state.get("workflow_id"), "recovery": resilience_plan(state.get("errors", []))}
