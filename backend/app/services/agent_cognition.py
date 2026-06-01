from app.services.context_manager import build_context
from app.services.reasoning_engine import reason_about_page


def cognitive_step(memory: dict, job: dict, observation: dict) -> dict:
    context = build_context(memory, job, observation)
    reasoning = reason_about_page(observation, autonomous_mode=False)
    return {"context": context, "reasoning": reasoning, "next_intent": reasoning["decision"]["decision"]}
