from app.services.agent.action_registry import action_allowed
from app.services.agent.workflow_memory import record_action


def prepare_execution_plan(workflow_id: str, actions: list[dict], autonomous_mode: bool = False) -> dict:
    executable = []
    blocked = []
    for action in actions:
        allowed = action_allowed(action["type"], autonomous_mode=autonomous_mode)
        item = {**action, "allowed": allowed}
        if allowed:
            executable.append(item)
        else:
            blocked.append(item)
    record_action(workflow_id, {"status": "planned", "actions": executable, "blocked": blocked})
    return {"workflow_id": workflow_id, "executable": executable, "blocked": blocked}
