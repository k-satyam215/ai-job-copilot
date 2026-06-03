from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.models.user import User
from app.services.billing import RequireCredits
from app.services.profile_memory import build_profile_memory
from app.services.question_reasoner import reason_answers
from app.utils.security import get_current_user


router = APIRouter()


class FieldPayload(BaseModel):
    field_id: str
    field_type: str | None = None
    label: str | None = None
    name: str | None = None
    placeholder: str | None = None
    question: str | None = None
    options: list[str] = []


class CopilotAnswersRequest(BaseModel):
    source: str | None = "extension"
    job: dict
    fields: list[FieldPayload]


@router.post("/answers")
async def answers(
    payload: CopilotAnswersRequest,
    user: User = Depends(RequireCredits("copilot_fill")),
):
    memory = build_profile_memory(user)
    results = await reason_answers(
        [field.model_dump() for field in payload.fields],
        memory,
        payload.job,
    )
    return {
        "answers": results,
        "profile_ready": bool(user.profile_json),
        "source": payload.source,
        "ai_credits_remaining": user.ai_credits,
    }
