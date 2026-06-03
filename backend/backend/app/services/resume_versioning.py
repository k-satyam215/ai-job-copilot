from datetime import datetime


_VERSIONS: dict[int, list[dict]] = {}


def save_resume_variant(user_id: int, variant: dict) -> dict:
    item = {"version": len(_VERSIONS.get(user_id, [])) + 1, "created_at": datetime.utcnow().isoformat(), **variant}
    _VERSIONS.setdefault(user_id, []).append(item)
    return item
