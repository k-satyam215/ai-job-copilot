def analyze_risk(job: dict) -> dict:
    text = " ".join(str(value) for value in job.values()).lower()
    flags = []
    for phrase in ["pay to apply", "registration fee", "security deposit", "no salary"]:
        if phrase in text:
            flags.append(phrase)
    return {"risk_level": "high" if flags else "normal", "flags": flags}
