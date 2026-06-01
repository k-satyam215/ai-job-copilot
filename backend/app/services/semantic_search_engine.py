from app.services.embedding_service import cosine_similarity, embed_text


def semantic_search(query: str, records: list[dict]) -> list[dict]:
    query_vec = embed_text(query)
    ranked = [{**r, "similarity": cosine_similarity(query_vec, r.get("embedding", []))} for r in records]
    return sorted(ranked, key=lambda item: item["similarity"], reverse=True)
