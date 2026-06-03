_FEEDBACK: list[dict] = []


def record_feedback(user_id: int, feedback: dict) -> dict:
    item = {"user_id": user_id, **feedback}
    _FEEDBACK.append(item)
    return item


def user_feedback(user_id: int) -> list[dict]:
    return [item for item in _FEEDBACK if item["user_id"] == user_id]
