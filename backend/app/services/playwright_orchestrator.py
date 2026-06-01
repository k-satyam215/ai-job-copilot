from app.services.agent.executor import prepare_execution_plan
from app.services.agent.planner import plan_next_actions
from app.services.agent.verifier import verify_observation


def orchestrate_apply_workflow(workflow_id: str, observation: dict, autonomous_mode: bool = False) -> dict:
    verification = verify_observation(observation)
    plan = plan_next_actions(observation, autonomous_mode=autonomous_mode)
    execution = prepare_execution_plan(workflow_id, plan["actions"], autonomous_mode=autonomous_mode)
    return {
        "workflow_id": workflow_id,
        "verification": verification,
        "plan": plan,
        "execution": execution,
        "requires_user_confirmation": bool(execution["blocked"]),
    }
