SAFE_ACTIONS = {
    "observe": {"requires_confirmation": False},
    "fill_field": {"requires_confirmation": False},
    "select_option": {"requires_confirmation": False},
    "upload_resume": {"requires_confirmation": True},
    "click_next": {"requires_confirmation": False},
    "review": {"requires_confirmation": False},
    "submit": {"requires_confirmation": True},
}


def action_allowed(action: str, autonomous_mode: bool = False) -> bool:
    spec = SAFE_ACTIONS.get(action)
    if not spec:
        return False
    if spec["requires_confirmation"] and not autonomous_mode:
        return False
    return True
