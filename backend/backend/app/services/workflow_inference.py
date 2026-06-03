def infer_workflow(observation: dict) -> dict:
    if observation.get("has_submit_button") and observation.get("has_next_button"):
        return {"workflow_type": "wizard_with_submit", "requires_review": True}
    if observation.get("fields"):
        return {"workflow_type": "form_fill", "requires_review": True}
    return {"workflow_type": "job_analysis", "requires_review": False}
