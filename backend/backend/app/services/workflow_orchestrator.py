from app.services.playwright_orchestrator import orchestrate_apply_workflow


def orchestrate(workflow_id: str, observation: dict) -> dict:
    return orchestrate_apply_workflow(workflow_id, observation, autonomous_mode=False)
