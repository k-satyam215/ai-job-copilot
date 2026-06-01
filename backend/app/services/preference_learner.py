def learn_preferences(applications: list[dict]) -> dict:
    applied_titles = [app.get("title", "") for app in applications]
    remote_interest = any("remote" in str(app).lower() for app in applications)
    return {"preferred_titles": applied_titles[-10:], "remote_preference": "remote" if remote_interest else "unknown"}
