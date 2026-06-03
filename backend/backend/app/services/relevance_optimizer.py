def optimize_relevance(score: int, engagement: dict | None = None) -> int:
    engagement = engagement or {}
    boost = 5 if engagement.get("clicked") else 0
    penalty = 5 if engagement.get("dismissed") else 0
    return max(0, min(100, score + boost - penalty))
