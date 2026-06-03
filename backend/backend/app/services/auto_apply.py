def apply_to_job(data: dict):
    return {
        "status": "applied",
        "company": data.get("company"),
        "role": data.get("title"),
        "message": "Application successful ✅"
    }