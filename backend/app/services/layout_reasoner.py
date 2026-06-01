def infer_layout(observation: dict) -> dict:
    field_count = len(observation.get("fields", []))
    return {"layout": "multi_step_form" if observation.get("has_next_button") else "single_page_form", "field_count": field_count}
