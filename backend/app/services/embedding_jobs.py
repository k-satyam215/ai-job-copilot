from app.services.vector_pipeline import vectorize_record


def build_embedding_jobs(records: list[dict]) -> list[dict]:
    return [vectorize_record(record, ["title", "description", "skills"]) for record in records]
