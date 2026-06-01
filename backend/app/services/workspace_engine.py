def workspace_summary(org: dict) -> dict:
    return {"organization": org.get("name"), "member_count": len(org.get("members", [])), "plan": org.get("plan", "free")}
