def job_quality(job: dict) -> dict:
    text = " ".join(str(value) for value in job.values()).lower()
    score = 70
    positives = []
    risks = []
    if "remote" in text:
        score += 5
        positives.append("remote_friendly")
    if "unpaid" in text or "training fee" in text:
        score -= 35
        risks.append("possible_low_quality_or_fee")
    if "urgent" in text and "walk-in" in text:
        score -= 10
        risks.append("high_pressure_hiring")
    return {"quality_score": max(0, min(100, score)), "positives": positives, "risks": risks}
