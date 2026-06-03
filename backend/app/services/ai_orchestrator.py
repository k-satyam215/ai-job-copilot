"""AI Orchestrator — unified call_llm() function for all services.

cover_letter_optimizer, interview_agent, and any other service
calls call_llm() directly. This module provides that function backed
by Groq and a deterministic local fallback.
"""
from __future__ import annotations

import json
import logging
import re

import httpx

from app.config import get_settings
from app.services.fallback_router import choose_ai_provider
from app.services.model_router import model_for_task

logger = logging.getLogger(__name__)
settings = get_settings()


def ai_route(task: str) -> dict:
    provider = choose_ai_provider(task, {"groq_api_key": settings.groq_api_key})
    return {"task": task, "provider": provider, "model": model_for_task(task)}


def call_llm(
    prompt: str,
    *,
    max_tokens: int = 1000,
    temperature: float = 0.3,
    system: str = "You are a helpful AI assistant. Produce clean, accurate output.",
    task: str = "general",
) -> str | None:
    """Synchronous Groq LLM call. Returns the response text or None on failure.

    Uses httpx in sync mode so it can be called from both sync and async
    contexts without an extra asyncio.run() wrapper.
    """
    api_key = settings.groq_api_key
    if not api_key:
        logger.debug("call_llm: no GROQ_API_KEY, returning None")
        return None

    model = model_for_task(task) if task != "general" else settings.groq_model

    try:
        with httpx.Client(timeout=settings.groq_timeout_seconds) as client:
            resp = client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": model,
                    "messages": [
                        {"role": "system", "content": system},
                        {"role": "user", "content": prompt},
                    ],
                    "max_tokens": max_tokens,
                    "temperature": temperature,
                },
            )
            resp.raise_for_status()
            return resp.json()["choices"][0]["message"]["content"]
    except Exception as exc:
        logger.error("call_llm error (task=%s): %s", task, exc)
        return None
