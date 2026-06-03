TRANSITIONS = {
    "observing": {"planned", "failed"},
    "planned": {"filling", "waiting_for_user", "failed"},
    "filling": {"verifying", "waiting_for_user", "failed"},
    "verifying": {"review", "filling", "failed"},
    "review": {"submitted", "waiting_for_user"},
    "waiting_for_user": {"filling", "submitted", "failed"},
    "submitted": set(),
    "failed": {"observing"},
}


def can_transition(current: str, target: str) -> bool:
    return target in TRANSITIONS.get(current, set())
