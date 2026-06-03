def adapt_strategy(failures: list[str]) -> dict:
    if len(failures) >= 2:
        return {"strategy": "slow_down_and_request_user_review", "confidence": 0.9}
    return {"strategy": "retry_with_more_context", "confidence": 0.7}
