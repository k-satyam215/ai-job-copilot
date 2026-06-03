from app.services.form_ontology import infer_field_ontology


def understand_ui(observation: dict) -> dict:
    fields = [infer_field_ontology(field) for field in observation.get("fields", [])]
    intent = "application_form" if fields else "job_page"
    return {"intent": intent, "fields": fields, "captcha_detected": observation.get("captcha_detected", False)}
