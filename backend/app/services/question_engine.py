import json
import re

import httpx

from app.config import get_settings
from app.services.form_classifier import classify_question


settings = get_settings()


def _short(value: str | None, limit: int = 280) -> str:
    return re.sub(r"\s+", " ", value or "").strip()[:limit]


def deterministic_answer(question_type: str, question: str, memory: dict, job: dict, options: list[str] | None = None) -> str:
    options = options or []
    if question_type == "name":
        return memory.get("full_name") or ""
    if question_type == "email":
        return memory.get("email") or ""
    if question_type == "phone":
        return memory.get("phone") or ""
    if question_type == "current_ctc":
        return memory.get("current_ctc") or "Prefer to discuss during the interview process"
    if question_type == "expected_ctc":
        return memory.get("expected_ctc") or "Negotiable"
    if question_type == "notice_period":
        return memory.get("notice_period") or "Immediate"
    if question_type == "location":
        return memory.get("location") or "India"
    if question_type == "relocation":
        return "Yes"
    if question_type == "authorization":
        return "Yes"
    if question_type == "linkedin":
        return memory.get("linkedin") or ""
    if question_type == "portfolio":
        return memory.get("portfolio") or ""
    if question_type == "experience":
        return _short(memory.get("experience") or "0-1 years", 80)
    if options:
        lowered = " ".join(options).lower()
        if "yes" in lowered:
            return next((option for option in options if option.lower().strip() == "yes"), options[0])
        return options[0]

    skills = ", ".join((memory.get("skills") or [])[:6])
    title = job.get("title") or "this role"
    company = job.get("company") or "your company"
    if question_type == "cover_letter":
        return _short(
            f"I am interested in {title} at {company} because my background in {skills or 'software engineering'} "
            f"matches the role. I have built practical projects and can contribute quickly with a strong learning mindset.",
            480,
        )
    return _short(
        f"My profile is a good fit for {title}. Key strengths include {skills or 'problem solving, engineering fundamentals, and ownership'}.",
        300,
    )


def _extract_json(text: str) -> dict:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("AI answer response did not include JSON")
    return json.loads(match.group(0))


async def answer_questions(fields: list[dict], memory: dict, job: dict) -> list[dict]:
    classified = [
        {
            **field,
            "question": _short(field.get("question") or field.get("label") or field.get("name") or field.get("placeholder")),
            "question_type": classify_question(
                field.get("question") or field.get("label") or field.get("name") or field.get("placeholder"),
                field.get("field_type"),
            ),
        }
        for field in fields
    ]

    if not settings.groq_api_key:
        return [
            {
                "field_id": field.get("field_id"),
                "question": field["question"],
                "question_type": field["question_type"],
                "answer": deterministic_answer(field["question_type"], field["question"], memory, job, field.get("options") or []),
                "confidence": 0.72,
                "source": "local_rules",
            }
            for field in classified
        ]

    prompt = {
        "task": "Generate concise job application form answers.",
        "rules": [
            "Return only valid JSON.",
            "Do not invent salary numbers if not present. Use Negotiable or Prefer to discuss.",
            "Keep answers short for input fields and professional for textareas.",
            "For yes/no fields, answer Yes or No only.",
        ],
        "profile_memory": memory,
        "job": job,
        "fields": classified,
        "output_schema": {
            "answers": [
                {"field_id": "string", "answer": "string", "confidence": 0.0, "reason": "short string"}
            ]
        },
    }

    async with httpx.AsyncClient(timeout=40) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={"Authorization": f"Bearer {settings.groq_api_key}", "Content-Type": "application/json"},
            json={
                "model": settings.groq_model,
                "messages": [
                    {"role": "system", "content": "You are a careful AI job application copilot. Produce strict JSON."},
                    {"role": "user", "content": json.dumps(prompt)},
                ],
                "temperature": 0.2,
            },
        )
        response.raise_for_status()

    data = _extract_json(response.json()["choices"][0]["message"]["content"])
    answer_map = {item.get("field_id"): item for item in data.get("answers", [])}
    results = []
    for field in classified:
        ai_answer = answer_map.get(field.get("field_id"), {})
        answer = ai_answer.get("answer") or deterministic_answer(
            field["question_type"], field["question"], memory, job, field.get("options") or []
        )
        results.append({
            "field_id": field.get("field_id"),
            "question": field["question"],
            "question_type": field["question_type"],
            "answer": answer,
            "confidence": ai_answer.get("confidence", 0.86),
            "source": "groq",
        })
    return results
