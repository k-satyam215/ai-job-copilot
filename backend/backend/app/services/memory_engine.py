def update_memory(preferences: dict, signal: dict) -> dict:
    memory = dict(preferences or {})
    if signal.get("type") == "user_correction":
        memory.setdefault("corrections", []).append(signal)
    if signal.get("type") == "successful_application":
        memory.setdefault("successful_patterns", []).append(signal.get("pattern", {}))
    return memory
