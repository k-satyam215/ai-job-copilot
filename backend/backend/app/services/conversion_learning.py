def conversion_signals(applications: list[dict]) -> dict:
    converted = [a for a in applications if a.get("status") in {"interview", "offer"}]
    return {"conversion_count": len(converted), "sample_size": len(applications)}
