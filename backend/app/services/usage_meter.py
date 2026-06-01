from app.models.user import User


def consume_ai_credit(user: User, amount: int = 1) -> bool:
    if user.plan in {"pro", "enterprise"}:
        return True
    if user.ai_credits < amount:
        return False
    user.ai_credits -= amount
    return True
