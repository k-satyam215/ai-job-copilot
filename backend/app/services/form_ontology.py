from app.services.form_classifier import classify_question, normalize_question


def infer_field_ontology(field: dict) -> dict:
    text = normalize_question(
        field.get("question") or field.get("label") or field.get("placeholder") or field.get("name")
    )
    field_type = field.get("field_type") or "text"
    question_type = classify_question(text, field_type)
    risk = "high" if question_type in {"current_ctc", "authorization"} else "normal"
    return {
        "field_id": field.get("field_id"),
        "question": text,
        "field_type": field_type,
        "question_type": question_type,
        "requires_user_review": risk == "high" or field_type == "file",
        "risk": risk,
        "options": field.get("options") or [],
    }
