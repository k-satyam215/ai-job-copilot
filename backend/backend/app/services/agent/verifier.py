def verify_observation(observation: dict) -> dict:
    errors = observation.get("validation_errors") or []
    empty_required = [
        field.get("field_id")
        for field in observation.get("fields", [])
        if field.get("required") and not field.get("value")
    ]
    return {
        "ok": not errors,
        "validation_errors": errors,
        "empty_required_fields": empty_required,
        "captcha_detected": bool(observation.get("captcha_detected")),
        "ready_for_review": not errors and not empty_required,
    }
