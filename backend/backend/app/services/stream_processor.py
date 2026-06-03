from app.services.event_bus import publish


def process_stream_event(event: dict) -> dict:
    normalized = {"type": event.get("type", "unknown"), "payload": event.get("payload", {})}
    publish(normalized)
    return normalized
