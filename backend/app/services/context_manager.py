def build_context(user_memory: dict, job: dict, page: dict | None = None) -> dict:
    return {
        "user": user_memory,
        "job": job,
        "page": page or {},
        "safety": {"submit_requires_confirmation": True, "captcha_requires_pause": True},
    }
