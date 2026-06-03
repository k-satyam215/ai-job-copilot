from app.services.form_ontology import infer_field_ontology


def plan_next_actions(observation: dict, autonomous_mode: bool = False) -> dict:
    fields = [infer_field_ontology(field) for field in observation.get("fields", [])]
    actions = []
    for field in fields:
        if field["field_type"] == "file":
            actions.append({"type": "upload_resume", "field_id": field["field_id"], "requires_confirmation": True})
        elif field["field_type"] in {"radio", "checkbox", "select"}:
            actions.append({"type": "select_option", "field_id": field["field_id"], "requires_confirmation": field["requires_user_review"]})
        else:
            actions.append({"type": "fill_field", "field_id": field["field_id"], "requires_confirmation": field["requires_user_review"]})

    if observation.get("has_next_button"):
        actions.append({"type": "click_next", "requires_confirmation": False})
    if observation.get("has_submit_button"):
        actions.append({"type": "review", "requires_confirmation": False})
        actions.append({"type": "submit", "requires_confirmation": not autonomous_mode})
    return {"fields": fields, "actions": actions, "mode": "autonomous" if autonomous_mode else "copilot"}
