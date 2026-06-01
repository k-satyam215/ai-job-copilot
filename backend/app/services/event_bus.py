import asyncio


_EVENTS: list[dict] = []
_SUBSCRIBERS: list[asyncio.Queue] = []


def publish(event: dict) -> None:
    _EVENTS.append(event)
    for queue in list(_SUBSCRIBERS):
        try:
            queue.put_nowait(event)
        except asyncio.QueueFull:
            _SUBSCRIBERS.remove(queue)


def recent_events(limit: int = 100) -> list[dict]:
    return _EVENTS[-limit:]
