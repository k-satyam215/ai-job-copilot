import asyncio
import logging

from app.scrapers.search_sources import (
    fetch_jsearch_jobs,
    fetch_adzuna_jobs,
    fetch_remotive_jobs,
    fetch_jsearch_public,
    fetch_jobicy_jobs,
    fetch_himalayas_jobs,
    fetch_themuse_jobs,
)
from app.scrapers.naukri import fetch_naukri_jobs
from app.config import get_settings

logger = logging.getLogger(__name__)

# Search-page URL patterns to reject
_BAD_URL_PATTERNS = [
    "linkedin.com/jobs/search",
    "indeed.com/jobs?",
    "foundit.in/srp",
    "apna.co/jobs?",
    "unstop.com/",
    "arbeitnow.com/jobs",
]


def _is_real_job_url(url: str) -> bool:
    if not url:
        return False
    if "naukri.com/job-listings" in url or "naukri.com/jobs/" in url:
        return True
    if "naukri.com/" in url and "-jobs" in url and "?" not in url:
        return False
    return not any(bad in url for bad in _BAD_URL_PATTERNS)


def _dedup(jobs: list[dict]) -> list[dict]:
    seen: set[str] = set()
    out: list[dict] = []
    for job in jobs:
        url = job.get("url", "")
        if url and url not in seen:
            seen.add(url)
            out.append(job)
        elif not url:
            out.append(job)
    return out


async def fetch_jobs_from_all_sources(keyword: str, pages: int = 1) -> list[dict]:
    """
    Hybrid job fetcher — Production-grade.

    Phase 1 (Primary APIs — real individual job URLs):
      • JSearch (RapidAPI) — aggregates Naukri, LinkedIn, Indeed, Glassdoor
      • Adzuna              — India jobs free API

    Phase 2 (Fallback — only if Phase 1 returns < 10 jobs):
      • Remotive, Arbeitnow, Jobicy, Himalayas, TheMuse, Naukri RSS
    """
    settings = get_settings()

    # ─── Phase 1: Primary APIs ───
    primary_tasks = []
    task_names = []

    if settings.jsearch_api_key:
        primary_tasks.append(fetch_jsearch_jobs(keyword, settings.jsearch_api_key, num_pages=pages))
        task_names.append("jsearch")
    else:
        logger.info("JSearch API key not set — skipping (set JSEARCH_API_KEY in .env)")

    if settings.adzuna_app_id and settings.adzuna_app_key:
        primary_tasks.append(fetch_adzuna_jobs(keyword, settings.adzuna_app_id, settings.adzuna_app_key, pages=pages))
        task_names.append("adzuna")
    else:
        logger.info("Adzuna keys not set — skipping (set ADZUNA_APP_ID and ADZUNA_APP_KEY in .env)")

    primary_jobs: list[dict] = []
    if primary_tasks:
        results = await asyncio.gather(*primary_tasks, return_exceptions=True)
        for name, result in zip(task_names, results):
            if isinstance(result, Exception):
                logger.warning("%s failed: %s", name, result)
            elif isinstance(result, list):
                for job in result:
                    if _is_real_job_url(job.get("url", "")):
                        primary_jobs.append(job)

    logger.info("Phase 1 (primary APIs): %d real-URL jobs", len(primary_jobs))

    # ─── Phase 2: Fallback free sources (always run alongside primary) ───
    fallback_tasks = [
        fetch_remotive_jobs(keyword=keyword),
        fetch_jsearch_public("arbeitnow", keyword=keyword),
        fetch_jobicy_jobs(keyword=keyword),
        fetch_himalayas_jobs(keyword=keyword),
        fetch_themuse_jobs(keyword=keyword),
        fetch_naukri_jobs(keyword=keyword, pages=pages),
    ]
    fallback_results = await asyncio.gather(*fallback_tasks, return_exceptions=True)
    fallback_jobs: list[dict] = []
    for i, result in enumerate(fallback_results):
        if isinstance(result, Exception):
            logger.warning("Fallback source %d failed: %s", i, result)
        elif isinstance(result, list):
            for job in result:
                if _is_real_job_url(job.get("url", "")):
                    fallback_jobs.append(job)

    logger.info("Phase 2 (fallback): %d real-URL jobs", len(fallback_jobs))

    # Merge: primary first (higher quality), then fallback
    all_jobs = _dedup(primary_jobs + fallback_jobs)
    logger.info("Total unique jobs: %d for keyword '%s'", len(all_jobs), keyword)
    return all_jobs

