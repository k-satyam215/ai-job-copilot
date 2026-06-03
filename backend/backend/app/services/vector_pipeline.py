from app.services.embedding_service import embed_text


def vectorize_record(record: dict, fields: list[str]) -> dict:
    text = " ".join(str(record.get(field, "")) for field in fields)
    return {"id": record.get("id"), "embedding": embed_text(text)}
