from app.services.apply_state_machine import can_transition


def transition(current: str, target: str) -> dict:
    return {"from": current, "to": target, "allowed": can_transition(current, target)}
