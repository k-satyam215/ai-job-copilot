import json
import re
from pathlib import Path

import fitz
import httpx

from app.config import get_settings


settings = get_settings()


def extract_resume_text(file_path: str) -> str:
    path = Path(file_path)
    if path.suffix.lower() == ".pdf":
        with fitz.open(file_path) as doc:
            return "\n".join(page.get_text("text") for page in doc).strip()
    return path.read_text(encoding="utf-8", errors="ignore").strip()


def _json_from_text(text: str) -> dict:
    match = re.search(r"\{.*\}", text, re.DOTALL)
    if not match:
        raise ValueError("AI response did not contain JSON")
    return json.loads(match.group(0))


def _fallback_parse(text: str) -> dict:
    known_skills = [
        "python", "fastapi", "django", "flask", "javascript", "typescript", "react",
        "next.js", "node.js", "sql", "postgresql", "mongodb", "docker", "aws",
        "machine learning", "llm", "langchain", "openai", "groq", "playwright",
    ]
    lowered = text.lower()
    skills = sorted({skill for skill in known_skills if skill in lowered})
    return {
        "skills": skills,
        "frameworks": [skill for skill in skills if skill in {"fastapi", "react", "next.js", "langchain"}],
        "experience": "Not confidently detected",
        "projects": [],
        "job_roles": ["Software Engineer"] if skills else [],
        "seniority": "Entry/Junior" if "intern" in lowered or "fresher" in lowered else "Unknown",
        "education": [],
        "strengths": ["Backend/API development"] if "api" in lowered else [],
        "gaps": [],
        "summary": "Fallback profile generated locally because GROQ_API_KEY is not configured.",
    }


async def parse_resume_with_ai(text: str) -> dict:
    if not settings.groq_api_key:
        return _fallback_parse(text)

    prompt = f"""
You are an expert recruiting intelligence engine. Extract a structured job-search profile.
Return ONLY valid JSON with keys:
skills, frameworks, experience, projects, job_roles, seniority, education, strengths, gaps, summary.

Resume text:
{text[:12000]}
"""
    async with httpx.AsyncClient(timeout=45) as client:
        response = await client.post(
            "https://api.groq.com/openai/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {settings.groq_api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": settings.groq_model,
                "messages": [
                    {"role": "system", "content": "You produce strict JSON for SaaS backend APIs."},
                    {"role": "user", "content": prompt},
                ],
                "temperature": 0.1,
            },
        )
        response.raise_for_status()
    content = response.json()["choices"][0]["message"]["content"]
    return _json_from_text(content)
