def summarize_behavior(events: list[dict]) -> dict:
    return {"events": len(events), "last_intent": events[-1].get("type") if events else "none"}
