def resume_score(resume_text: str) -> dict:
    text = resume_text or ""
    score = 50
    if any(char.isdigit() for char in text):
        score += 10
    if "project" in text.lower():
        score += 10
    if len(text) > 1500:
        score += 10
    return {"resume_score": min(score, 100), "signals": {"has_metrics": any(char.isdigit() for char in text)}}
