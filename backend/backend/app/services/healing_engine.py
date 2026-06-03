def heal_workflow(error: str) -> dict:
    return {"healed": False, "next_step": "retry" if "timeout" in error.lower() else "user_review"}
