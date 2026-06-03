"""AI-powered cover letter generator.

Uses Groq LLM (when available) to generate a tailored, role-specific cover
letter. Falls back to a deterministic template when no API key is set so
the SaaS continues to ship a usable artifact for every user.
"""
from __future__ import annotations

import logging
import os
from typing import Any

logger = logging.getLogger(__name__)


def _fallback_cover_letter(job: dict, profile: dict, tone: str) -> str:
    """Deterministic template — used when AI is disabled or fails."""
    name = profile.get("name") or "the candidate"
    title = job.get("title") or "this role"
    company = job.get("company") or "your company"
    skills = ", ".join((profile.get("skills") or [])[:5]) or "software engineering"
    years = profile.get("years_experience") or "several"
    return (
        f"Hi {company} hiring team,\n\n"
        f"I am applying for the {title} role. With {years} years of hands-on experience in {skills}, "
        f"I can contribute from day one with a bias for ownership, clean code, and measurable impact.\n\n"
        f"My background aligns well with what you are building, and I would love to bring that energy to {company}.\n\n"
        f"— {name}"
    )


def generate_cover_letter(job: dict, profile: dict, tone: str = "concise") -> dict:
    """Generate a tailored cover letter.

    Returns: {"tone": str, "cover_letter": str, "source": "ai"|"fallback"}
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {
            "tone": tone,
            "cover_letter": _fallback_cover_letter(job, profile, tone),
            "source": "fallback",
        }

    try:
        # Lazy import so the SaaS still starts when Groq is not configured.
        from app.services.ai_orchestrator import call_llm  # type: ignore

        prompt = (
            f"Write a {tone}, 3-paragraph cover letter for this job and candidate.\n\n"
            f"JOB:\nTitle: {job.get('title','')}\nCompany: {job.get('company','')}\n"
            f"Description: {(job.get('description') or '')[:1500]}\n\n"
            f"CANDIDATE:\nName: {profile.get('name','')}\n"
            f"Skills: {', '.join(profile.get('skills') or [])}\n"
            f"Experience: {profile.get('years_experience','')} years\n"
            f"Highlights: {profile.get('summary','')}\n\n"
            f"Return ONLY the cover letter body — no headings, no labels."
        )
        body = call_llm(prompt, max_tokens=500, temperature=0.6)
        if not body or len(body.strip()) < 40:
            raise ValueError("LLM returned empty cover letter")
        return {"tone": tone, "cover_letter": body.strip(), "source": "ai"}
    except Exception as exc:  # noqa: BLE001
        logger.warning("AI cover letter failed, using fallback: %s", exc)
        return {
            "tone": tone,
            "cover_letter": _fallback_cover_letter(job, profile, tone),
            "source": "fallback",
        }
