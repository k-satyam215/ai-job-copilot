def retrieve_relevant_memory(memory: dict, query: str) -> dict:
    return {key: value for key, value in memory.items() if query.lower() in str(value).lower()} or memory
