from app.services.healing_engine import heal_workflow


def resilience_plan(errors: list[str]) -> dict:
    return {"plans": [heal_workflow(error) for error in errors], "max_retries": 2}
