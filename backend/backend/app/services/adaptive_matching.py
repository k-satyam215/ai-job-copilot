def adapt_match_score(score: int, behavior: dict) -> int:
    return max(0, min(100, score + (5 if behavior.get("clicked") else 0) - (5 if behavior.get("dismissed") else 0)))
