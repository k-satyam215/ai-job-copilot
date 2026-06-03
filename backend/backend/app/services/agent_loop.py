from app.services.failure_recovery import recovery_plan
from app.services.reasoning_engine import reason_about_page
from app.services.trace_engine import trace


def run_agent_loop_step(workflow_id: str, observation: dict, autonomous_mode: bool = False) -> dict:
    trace("agent_loop_observe", {"workflow_id": workflow_id, "url": observation.get("url")})
    try:
        reasoning = reason_about_page(observation, autonomous_mode=autonomous_mode)
        trace("agent_loop_reason", {"workflow_id": workflow_id, "decision": reasoning["decision"]})
        return {"workflow_id": workflow_id, "status": "ok", **reasoning}
    except Exception as exc:
        trace("agent_loop_error", {"workflow_id": workflow_id, "error": str(exc)})
        return {"workflow_id": workflow_id, "status": "recovery", "recovery": recovery_plan(str(exc), observation)}
