"""
Apna.co scraper — India's top blue/grey collar job platform.
Uses public search page JSON-LD and API.
"""
import logging
import re
from urllib.parse import quote_plus

import httpx

logger = logging.getLogger(__name__)

_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.9",
    "Accept-Language": "en-IN,en;q=0.9",
}


def _clean(text: str | None) -> str:
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", str(text))
    text = re.sub(r"\s+", " ", text).strip()
    return text[:500]


async def fetch_apna_jobs(keyword: str = "software engineer", location: str = "India", pages: int = 1) -> list[dict]:
    """Fetch jobs from Apna.co via public search page."""
    query = quote_plus(keyword)
    search_url = f"https://apna.co/jobs?q={query}"
    
    try:
        async with httpx.AsyncClient(timeout=18, follow_redirects=True) as client:
            resp = await client.get(search_url, headers=_HEADERS)
            if resp.status_code not in {200, 206}:
                return _fallback(keyword, query)
            
            html = resp.text
            
            import json
            # Try JSON-LD
            blocks = re.findall(
                r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
                html, re.S | re.I
            )
            jobs = []
            for block in blocks:
                try:
                    data = json.loads(block.strip())
                    items = data if isinstance(data, list) else [data]
                    for item in items:
                        if item.get("@type") in ("JobPosting", "jobPosting"):
                            title = _clean(item.get("title", ""))
                            if not title:
                                continue
                            org = item.get("hiringOrganization", {})
                            company = _clean(org.get("name", "") if isinstance(org, dict) else str(org))
                            jobs.append({
                                "source": "apna",
                                "title": title,
                                "company": company or "Company on Apna",
                                "location": _clean(str(item.get("jobLocation", {}).get("address", {}).get("addressLocality", "India"))) if isinstance(item.get("jobLocation"), dict) else "India",
                                "experience": "",
                                "salary": "",
                                "url": item.get("url") or search_url,
                                "description": _clean(item.get("description", ""))[:400],
                                "skills": [],
                            })
                except Exception:
                    continue
            
            if jobs:
                logger.info("Apna JSON-LD: %d jobs for '%s'", len(jobs), keyword)
                return jobs

    except Exception as e:
        logger.warning("Apna scraper failed: %s", e)
    
    return _fallback(keyword, query)


def _fallback(keyword: str, query: str) -> list[dict]:
    return [{
        "source": "apna",
        "title": f"{keyword.title()} — Search on Apna",
        "company": "Multiple Companies",
        "location": "India",
        "experience": "",
        "salary": "",
        "url": f"https://apna.co/jobs?q={query}",
        "description": f"Browse {keyword} jobs on Apna.co",
        "skills": [],
    }]
