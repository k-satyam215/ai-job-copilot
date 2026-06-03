def stealth_profile() -> dict:
    return {
        "user_agent": "standard_chrome",
        "headless": False,
        "notes": "Use persistent user-approved browser contexts. Do not bypass platform security checks.",
    }
