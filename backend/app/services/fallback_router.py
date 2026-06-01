def choose_ai_provider(task: str, configured: dict) -> str:
    if configured.get("groq_api_key"):
        return "groq"
    if task in {"embedding", "matching"}:
        return "local"
    return "local_fallback"
