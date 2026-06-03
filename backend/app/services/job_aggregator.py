import asyncio
import logging

from app.scrapers.apna import fetch_apna_jobs
from app.scrapers.foundit import fetch_foundit_jobs
from app.scrapers.indeed import fetch_indeed_jobs
from app.scrapers.linkedin import fetch_linkedin_jobs
from app.scrapers.naukri import fetch_naukri_jobs
from app.scrapers.unstop import fetch_unstop_jobs
from app.scrapers.search_sources import fetch_remotive_jobs, fetch_jsearch_public

logger = logging.getLogger(__name__)


async def fetch_jobs_from_all_sources(keyword: str, pages: int = 1) -> list[dict]:
    """
    Fetch jobs from all sources concurrently.
    Priority order (most reliable free sources first):
      1. Remotive API       — free JSON API, real remote jobs
      2. Arbeitnow API      — free JSON API, global jobs
      3. Naukri RSS         — RSS feed fallback
      4. LinkedIn           — JSON-LD from search page
      5. Foundit            — JSON-LD from search page
      6. Indeed India       — JSON-LD from search page
      7. Unstop             — JSON-LD / fallback link
      8. Apna               — JSON-LD / fallback link
    """
    tasks = [
        fetch_remotive_jobs(keyword=keyword, pages=pages),
        fetch_jsearch_public("arbeitnow", keyword=keyword),
        fetch_naukri_jobs(keyword=keyword, pages=pages),
        fetch_linkedin_jobs(keyword=keyword, pages=pages),
        fetch_foundit_jobs(keyword=keyword, pages=pages),
        fetch_indeed_jobs(keyword=keyword, pages=pages),
        fetch_unstop_jobs(keyword=keyword, pages=pages),
        fetch_apna_jobs(keyword=keyword, pages=pages),
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    jobs: list[dict] = []
    for i, result in enumerate(results):
        if isinstance(result, Exception):
            logger.warning("Source %d failed: %s", i, result)
        elif isinstance(result, list):
            jobs.extend(result)

    # Deduplicate by URL
    seen_urls: set[str] = set()
    unique_jobs: list[dict] = []
    for job in jobs:
        url = job.get("url", "")
        if url and url not in seen_urls:
            seen_urls.add(url)
            unique_jobs.append(job)
        elif not url:
            unique_jobs.append(job)

    logger.info("Total unique jobs fetched: %d for keyword '%s'", len(unique_jobs), keyword)
    return unique_jobs

