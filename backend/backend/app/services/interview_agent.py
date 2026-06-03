"""AI-powered interview prep pack generator.

Uses Groq LLM (when available) to produce role-specific technical and
behavioral questions plus a personalised prep plan. Falls back to a
deterministic template when no API key is set.
"""
from __future__ import annotations

import json
import logging
import os
import re

logger = logging.getLogger(__name__)


def _fallback_pack(job: dict, profile: dict) -> dict:
    role = job.get("title") or "the role"
    skills = (job.get("skills") or profile.get("skills") or [])[:6]
    technical = [f"How have you used {skill} in a real production project?" for skill in skills]
    if not technical:
        technical = ["Walk me through a recent technical project in depth."]
    behavioral = [
        "Tell me about a time you solved an ambiguous problem.",
        "Describe a project where you took ownership end to end.",
        "How do you handle feedback and iteration?",
    ]
    return {
        "role": role,
        "technical_questions": technical,
        "behavioral_questions": behavioral,
        "prep_plan": [
            "Prepare a 60-second introduction mapping your background to the role.",
            "Review the job description and align your projects to each requirement.",
            "Practice concise STAR-format answers (Situation, Task, Action, Result).",
        ],
        "source": "fallback",
    }


def _parse_json_safely(raw: str) -> dict | None:
    """Best-effort JSON extractor for LLM output that may include prose around JSON."""
    if not raw:
        return None
    try:
        return json.loads(raw)
    except Exception:  # noqa: BLE001
        pass
    match = re.search(r"\{[\s\S]*\}", raw)
    if match:
        try:
            return json.loads(match.group(0))
        except Exception:  # noqa: BLE001
            return None
    return None


def generate_interview_pack(job: dict, profile: dict) -> dict:
    """Generate a role-specific interview prep pack.

    Returns a dict with keys: role, technical_questions, behavioral_questions,
    prep_plan, and source ('ai' | 'fallback').
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return _fallback_pack(job, profile)

    try:
        from app.services.ai_orchestrator import call_llm  # type: ignore

        prompt = (
            "You are an interview coach. Generate a JSON interview prep pack.\n\n"
            f"JOB:\nTitle: {job.get('title','')}\nCompany: {job.get('company','')}\n"
            f"Description: {(job.get('description') or '')[:1200]}\n\n"
            f"CANDIDATE:\nSkills: {', '.join(profile.get('skills') or [])}\n"
            f"Experience: {profile.get('years_experience','')} years\n\n"
            "Return STRICT JSON with these exact keys:\n"
            "{\n"
            '  "technical_questions": ["...", "...", "..."],\n'
            '  "behavioral_questions": ["...", "...", "..."],\n'
            '  "prep_plan": ["...", "...", "..."]\n'
            "}\n"
            "No prose, no markdown, just the JSON object."
        )
        raw = call_llm(prompt, max_tokens=700, temperature=0.5)
        parsed = _parse_json_safely(raw or "")
        if not parsed:
            raise ValueError("LLM returned invalid JSON for interview pack")

        technical = parsed.get("technical_questions") or []
        behavioral = parsed.get("behavioral_questions") or []
        plan = parsed.get("prep_plan") or []
        if not (technical and behavioral and plan):
            raise ValueError("LLM JSON missing required keys")

        return {
            "role": job.get("title") or "the role",
            "technical_questions": technical[:10],
            "behavioral_questions": behavioral[:8],
            "prep_plan": plan[:8],
            "source": "ai",
        }
    except Exception as exc:  # noqa: BLE001
        logger.warning("AI interview pack failed, using fallback: %s", exc)
        return _fallback_pack(job, profile)
