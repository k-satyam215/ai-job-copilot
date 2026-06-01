def memory_graph(profile: dict, applications: list[dict]) -> dict:
    return {"nodes": [{"type": "skill", "value": s} for s in profile.get("skills", [])], "application_count": len(applications)}
