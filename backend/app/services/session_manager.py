from dataclasses import dataclass
from datetime import datetime


@dataclass
class BrowserSession:
    user_id: int
    provider: str
    status: str
    created_at: datetime


_SESSIONS: dict[str, BrowserSession] = {}


def session_key(user_id: int, provider: str) -> str:
    return f"{user_id}:{provider}"


def get_or_create_session(user_id: int, provider: str) -> BrowserSession:
    key = session_key(user_id, provider)
    if key not in _SESSIONS:
        _SESSIONS[key] = BrowserSession(user_id=user_id, provider=provider, status="ready", created_at=datetime.utcnow())
    return _SESSIONS[key]
