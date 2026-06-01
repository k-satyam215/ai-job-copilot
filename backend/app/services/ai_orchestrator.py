from app.config import get_settings
from app.services.fallback_router import choose_ai_provider
from app.services.model_router import model_for_task


def ai_route(task: str) -> dict:
    settings = get_settings()
    provider = choose_ai_provider(task, {"groq_api_key": settings.groq_api_key})
    return {"task": task, "provider": provider, "model": model_for_task(task)}
