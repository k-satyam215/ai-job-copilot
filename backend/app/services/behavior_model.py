def behavior_features(events: list[dict]) -> dict:
    return {
        "clicks": sum(1 for event in events if event.get("type") == "click"),
        "dismissals": sum(1 for event in events if event.get("type") == "dismiss"),
        "applications": sum(1 for event in events if event.get("type") == "apply"),
    }
