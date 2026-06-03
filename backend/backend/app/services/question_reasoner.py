from app.services.answer_validator import validate_answer
from app.services.question_engine import answer_questions


_CACHE: dict[str, list[dict]] = {}


def _cache_key(fields: list[dict], memory: dict, job: dict) -> str:
    field_sig = "|".join((field.get("question") or field.get("label") or "")[:80] for field in fields)
    return f"{memory.get('email')}::{job.get('url') or job.get('title')}::{field_sig}"


async def reason_answers(fields: list[dict], memory: dict, job: dict) -> list[dict]:
    key = _cache_key(fields, memory, job)
    if key in _CACHE:
        return _CACHE[key]
    answers = await answer_questions(fields, memory, job)
    validated = []
    for item, field in zip(answers, fields):
        checked = validate_answer(item.get("answer", ""), item.get("question_type", "general"), field.get("options") or [])
        validated.append({**item, **checked})
    _CACHE[key] = validated
    return validated
