TASK_MODEL_MAP = {
    "resume_parsing": "llama-3.3-70b-versatile",
    "question_answering": "llama-3.3-70b-versatile",
    "resume_tailoring": "llama-3.3-70b-versatile",
    "job_parsing": "llama-3.3-70b-versatile",
    "embedding": "local-hash-embedding",
}


def model_for_task(task: str) -> str:
    return TASK_MODEL_MAP.get(task, "llama-3.3-70b-versatile")
