def build_dom_graph(fields: list[dict], buttons: list[str] | None = None) -> dict:
    return {"nodes": fields, "edges": [{"from": field.get("field_id"), "to": "next"} for field in fields], "buttons": buttons or []}
