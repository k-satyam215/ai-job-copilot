from app.services.agent.planner import plan_next_actions
from app.services.agent.verifier import verify_observation
from app.services.decision_engine import decide_next_step


def reason_about_page(observation: dict, autonomous_mode: bool = False) -> dict:
    verification = verify_observation(observation)
    plan = plan_next_actions(observation, autonomous_mode=autonomous_mode)
    decision = decide_next_step(verification, plan)
    return {"verification": verification, "plan": plan, "decision": decision}
