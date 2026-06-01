def optimize_bullet(bullet: str, keywords: list[str]) -> str:
    keyword_hint = ", ".join(keywords[:3])
    if keyword_hint and keyword_hint.lower() not in bullet.lower():
        return f"{bullet.rstrip('.')} using {keyword_hint}."
    return bullet
