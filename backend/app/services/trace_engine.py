from datetime import datetime
from uuid import uuid4


_TRACES: list[dict] = []


def trace(event: str, payload: dict | None = None) -> dict:
    item = {"id": str(uuid4()), "event": event, "payload": payload or {}, "created_at": datetime.utcnow().isoformat()}
    _TRACES.append(item)
    return item


def recent_traces(limit: int = 100) -> list[dict]:
    return _TRACES[-limit:]
