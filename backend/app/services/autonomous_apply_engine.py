from app.services.agent_cognition import cognitive_step
from app.services.safety_guardrails import guard_action


def run_apply_cycle(memory: dict, job: dict, observation: dict) -> dict:
    cognition = cognitive_step(memory, job, observation)
    guard = guard_action("submit" if observation.get("has_submit_button") else "fill", observation)
    return {"cognition": cognition, "guard": guard, "mode": "copilot_review"}
