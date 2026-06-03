"""
Naukri.com scraper using the public Jobs-API (no Playwright needed for listing).
Falls back gracefully when the network is unavailable.

Naukri exposes an internal JSON API that their own website calls.
We replicate those headers to fetch job listings without browser automation.
"""
import logging
import re
from typing import Any

import httpx

logger = logging.getLogger(__name__)

_SEARCH_URL = "https://www.naukri.com/jobapi/v3/search"

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "appid": "109",
    "systemid": "109",
    "accept": "application/json",
    "referer": "https://www.naukri.com/",
}


def _clean(text: str | None) -> str:
    if not text:
        return ""
    return re.sub(r"<[^>]+>", " ", str(text)).strip()


def _parse_job(item: dict[str, Any]) -> dict[str, Any]:
    skills = [s.get("label", "") for s in (item.get("tagsAndSkills") or []) if s.get("label")]
    return {
        "source": "naukri",
        "title":       _clean(item.get("title")),
        "company":     _clean(item.get("companyName")),
        "location":    _clean(", ".join(
            [loc.get("label", "") for loc in (item.get("placeholders") or [])
             if loc.get("type") == "location"]
        )),
        "experience":  _clean(", ".join(
            [p.get("label", "") for p in (item.get("placeholders") or [])
             if p.get("type") == "experience"]
        )),
        "salary":      _clean(item.get("salary")),
        "url":         item.get("jdURL") or f"https://www.naukri.com/job-listings-{item.get('jobId', '')}",
        "description": _clean(item.get("jobDescription")),
        "skills":      skills,
    }


async def fetch_naukri_jobs(
    keyword: str = "software engineer",
    location: str = "",
    experience: int = 0,
    pages: int = 2,
) -> list[dict[str, Any]]:
    """Fetch paginated Naukri job listings. Returns list of normalised job dicts."""
    jobs: list[dict[str, Any]] = []
    async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
        for page in range(1, pages + 1):
            params: dict[str, Any] = {
                "noOfResults": 20,
                "urlType": "search_by_keyword",
                "searchType": "adv",
                "keyword": keyword,
                "pageNo": page,
                "experience": experience,
                "k": keyword,
                "l": location,
            }
            try:
                resp = await client.get(_SEARCH_URL, params=params, headers=_HEADERS)
                resp.raise_for_status()
                data = resp.json()
                items = data.get("jobDetails") or []
                for item in items:
                    parsed = _parse_job(item)
                    if parsed["title"] and parsed["company"]:
                        jobs.append(parsed)
                logger.info("Naukri page %d: %d jobs fetched", page, len(items))
            except Exception as exc:
                logger.warning("Naukri scrape page %d failed: %s", page, exc)
                break
    return jobs
