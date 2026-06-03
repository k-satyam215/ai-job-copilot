"""AI-powered career roadmap generator.

Falls back to a deterministic week-by-week plan when GROQ is unavailable.
"""
from __future__ import annotations

import json
import logging
import re

logger = logging.getLogger(__name__)


def _fallback_roadmap(target_role: str, profile: dict, gaps: list[dict], duration_weeks: int = 8) -> dict:
    skill_list = [g["skill"] for g in gaps[:8]] if gaps else profile.get("skills", [])[:5]
    items = []
    for week in range(1, duration_weeks + 1):
        if week == 1:
            focus = f"Understand {target_role} landscape & review job descriptions"
            outputs = ["List of 20 target companies", "Gap analysis notes"]
        elif week <= 3 and skill_list:
            skill = skill_list[(week - 2) % len(skill_list)]
            focus = f"Deep dive: {skill}"
            outputs = [f"{skill} mini-project", "Resume bullet updated"]
        elif week <= 5:
            idx = (week - 4) % max(len(skill_list), 1)
            skill = skill_list[idx] if skill_list else "system design"
            focus = f"Build project with {skill}"
            outputs = ["GitHub repo", "README + demo"]
        elif week <= 7:
            focus = "Interview prep & mock interviews"
            outputs = ["10 technical questions practised", "STAR stories documented"]
        else:
            focus = "Apply & follow up"
            outputs = ["50 targeted applications", "Network outreach to 10 people"]
        items.append({
            "week": week,
            "focus": focus,
            "outputs": outputs,
            "hours": 10,
            "resources": [],
        })

    return {
        "title": f"{target_role} — {duration_weeks}-Week Roadmap",
        "target_role": target_role,
        "duration_weeks": duration_weeks,
        "summary": f"A structured {duration_weeks}-week plan to become job-ready for {target_role}.",
        "skills_covered": skill_list[:10],
        "roadmap": items,
    }


def _parse_duration_weeks(duration: str) -> int:
    """Parse duration strings like '8 weeks', '6 months' into weeks."""
    if not duration:
        return 8
    lower = duration.lower()
    match = re.search(r"(\d+)\s*month", lower)
    if match:
        return int(match.group(1)) * 4
    match = re.search(r"(\d+)\s*week", lower)
    if match:
        return int(match.group(1))
    return 8


def build_roadmap(target_role: str, profile: dict, gaps: list[dict], duration: str = "8 weeks") -> dict:
    """Build a career roadmap. Uses Groq LLM when available, fallback otherwise."""
    import os
    duration_weeks = _parse_duration_weeks(duration)

    groq_key = os.getenv("GROQ_API_KEY")
    if not groq_key:
        return _fallback_roadmap(target_role, profile, gaps, duration_weeks)

    try:
        from app.services.ai_orchestrator import call_llm

        skill_gaps = [g["skill"] for g in gaps[:8]] if gaps else []
        candidate_skills = profile.get("skills", [])[:10]

        prompt = (
            f"Create a {duration_weeks}-week career roadmap for a candidate targeting: {target_role}\n\n"
            f"Candidate skills: {', '.join(candidate_skills)}\n"
            f"Skill gaps: {', '.join(skill_gaps)}\n\n"
            "Return ONLY valid JSON with this structure:\n"
            '{"title": "...", "summary": "...", "difficulty": "Intermediate", "skills_covered": ["..."], '
            '"roadmap": [{"week": 1, "focus": "...", "description": "...", "outputs": ["..."], '
            '"resources": ["..."], "hours": 10}, ...]}\n'
            f"Generate exactly {duration_weeks} week items. No prose, no markdown."
        )
        raw = call_llm(prompt, max_tokens=2000, temperature=0.4, task="roadmap")
        if not raw:
            raise ValueError("Empty LLM response")

        # Extract JSON
        clean = raw.strip()
        match = re.search(r"\{[\s\S]*\}", clean)
        if match:
            data = json.loads(match.group(0))
            if "roadmap" in data and len(data["roadmap"]) > 0:
                data["target_role"] = target_role
                data["duration_weeks"] = duration_weeks
                return data
        raise ValueError("LLM JSON missing roadmap key")

    except Exception as exc:
        logger.warning("AI roadmap failed (%s), using fallback", exc)
        return _fallback_roadmap(target_role, profile, gaps, duration_weeks)
