"""
Naukri.com scraper — uses the internal jobapi with proper browser-like headers.
Naukri returns 406 when headers are incomplete; fixed by adding all required headers.
"""
import logging
import re
import random
from typing import Any

import httpx

logger = logging.getLogger(__name__)

_SEARCH_URL = "https://www.naukri.com/jobapi/v3/search"

# Full browser-like headers that Naukri expects — 406 fix
_BASE_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.6367.208 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "appid": "109",
    "systemid": "109",
    "Referer": "https://www.naukri.com/jobs-in-india",
    "Origin": "https://www.naukri.com",
    "Connection": "keep-alive",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Ch-Ua": '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
    "Sec-Ch-Ua-Mobile": "?0",
    "Sec-Ch-Ua-Platform": '"Windows"',
}

# Naukri alternative: public search page HTML fallback
_ALT_URL = "https://www.naukri.com/{keyword}-jobs"


def _clean(text: str | None) -> str:
    if not text:
        return ""
    return re.sub(r"<[^>]+>", " ", str(text)).strip()


def _parse_job(item: dict[str, Any]) -> dict[str, Any]:
    skills = [s.get("label", "") for s in (item.get("tagsAndSkills") or []) if s.get("label")]
    return {
        "source": "naukri",
        "title": _clean(item.get("title")),
        "company": _clean(item.get("companyName")),
        "location": _clean(", ".join(
            [loc.get("label", "") for loc in (item.get("placeholders") or [])
             if loc.get("type") == "location"]
        )),
        "experience": _clean(", ".join(
            [p.get("label", "") for p in (item.get("placeholders") or [])
             if p.get("type") == "experience"]
        )),
        "salary": _clean(item.get("salary")),
        "url": item.get("jdURL") or f"https://www.naukri.com/job-listings-{item.get('jobId', '')}",
        "description": _clean(item.get("jobDescription")),
        "skills": skills,
    }


async def _try_api(client: httpx.AsyncClient, keyword: str, location: str, experience: int, page: int) -> list[dict]:
    """Try the Naukri JSON API with full browser headers."""
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
    # Add a cookie session header to appear more like a real browser
    headers = {**_BASE_HEADERS, "nkparam": "f"}
    resp = await client.get(_SEARCH_URL, params=params, headers=headers)
    resp.raise_for_status()
    data = resp.json()
    items = data.get("jobDetails") or []
    jobs = []
    for item in items:
        parsed = _parse_job(item)
        if parsed["title"] and parsed["company"]:
            jobs.append(parsed)
    return jobs


async def _try_v4_api(client: httpx.AsyncClient, keyword: str, location: str, page: int) -> list[dict]:
    """Try Naukri v4 API as fallback."""
    url = "https://www.naukri.com/jobapi/v4/search"
    params = {
        "noOfResults": 20,
        "urlType": "search_by_keyword",
        "searchType": "adv",
        "keyword": keyword,
        "pageNo": page,
        "k": keyword,
        "l": location,
        "seoKey": f"{keyword.replace(' ', '-')}-jobs",
    }
    headers = {
        **_BASE_HEADERS,
        "Referer": f"https://www.naukri.com/{keyword.replace(' ', '-')}-jobs",
    }
    resp = await client.get(url, params=params, headers=headers)
    resp.raise_for_status()
    data = resp.json()
    items = data.get("jobDetails") or []
    jobs = []
    for item in items:
        parsed = _parse_job(item)
        if parsed["title"] and parsed["company"]:
            jobs.append(parsed)
    return jobs


async def fetch_naukri_jobs(
    keyword: str = "software engineer",
    location: str = "",
    experience: int = 0,
    pages: int = 2,
) -> list[dict[str, Any]]:
    """Fetch paginated Naukri job listings. Returns list of normalised job dicts."""
    jobs: list[dict[str, Any]] = []

    async with httpx.AsyncClient(timeout=25, follow_redirects=True) as client:
        for page in range(1, pages + 1):
            # Try v3 API first, then v4 as fallback
            try:
                page_jobs = await _try_api(client, keyword, location, experience, page)
                jobs.extend(page_jobs)
                logger.info("Naukri v3 page %d: %d jobs fetched", page, len(page_jobs))
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 406:
                    logger.warning("Naukri v3 406 — trying v4 API for page %d", page)
                    try:
                        page_jobs = await _try_v4_api(client, keyword, location, page)
                        jobs.extend(page_jobs)
                        logger.info("Naukri v4 page %d: %d jobs fetched", page, len(page_jobs))
                    except Exception as exc2:
                        logger.warning("Naukri v4 also failed page %d: %s — returning search link", page, exc2)
                        # Return a useful fallback entry pointing to the search URL
                        slug = keyword.replace(" ", "-").lower()
                        jobs.append({
                            "source": "naukri",
                            "title": f"{keyword} (Live Naukri Results)",
                            "company": "Multiple Companies",
                            "location": location or "India",
                            "experience": f"{experience}+ years" if experience else "",
                            "salary": "",
                            "url": f"https://www.naukri.com/{slug}-jobs",
                            "description": f"Latest {keyword} jobs on Naukri.com. Click to view all listings.",
                            "skills": [keyword],
                        })
                        break
                else:
                    logger.warning("Naukri page %d HTTP error: %s", page, e)
                    break
            except Exception as exc:
                logger.warning("Naukri scrape page %d failed: %s", page, exc)
                break

    return jobs
