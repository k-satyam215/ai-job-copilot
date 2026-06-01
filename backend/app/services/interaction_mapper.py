def map_interactions(fields: list[dict]) -> list[dict]:
    actions = []
    for field in fields:
        action = "select_option" if field.get("field_type") in {"select", "radio", "checkbox"} else "fill_field"
        actions.append({"field_id": field.get("field_id"), "action": action})
    return actions
