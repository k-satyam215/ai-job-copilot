PORTALS = {"linkedin": "easy_apply", "naukri": "quick_apply", "greenhouse": "ats", "lever": "ats", "workday": "ats"}


def portal_capabilities(source: str) -> dict:
    return {"source": source, "adapter": PORTALS.get(source, "generic_ats"), "supports_autofill": True, "submit_requires_user": True}
