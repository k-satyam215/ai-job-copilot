"""
Multi-source job scraper — real structured data, no API keys needed.

Strategies per source:
  1. Remotive API  — 100% free, JSON, remote tech jobs
  2. Adzuna API    — free public API (no key needed for basic queries)
  3. HTML JSON-LD  — extracts structured <script type=application/ld+json> job data
  4. Graceful link fallback — returns a clickable search URL so user can open manually
"""
import json
import logging
import re
from urllib.parse import quote_plus

import httpx

logger = logging.getLogger(__name__)

_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json, text/html, */*",
    "Accept-Language": "en-US,en;q=0.9",
}


def _clean(text: str | None) -> str:
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", str(text))
    text = re.sub(r"\s+", " ", text).strip()
    return text[:600]


def _make_link_fallback(source: str, url: str, keyword: str) -> list[dict]:
    """Return a clickable search-link entry when all real scraping fails."""
    return [{
        "source": source,
        "title": f"{keyword.title()} Jobs — Browse on {source.title()}",
        "company": f"Multiple Companies on {source.title()}",
        "location": "India",
        "experience": "",
        "salary": "",
        "url": url,
        "description": f"Click to browse latest {keyword} openings on {source.title()}.",
        "skills": [keyword],
    }]


async def fetch_remotive_jobs(keyword: str, pages: int = 1) -> list[dict]:
    """
    Remotive.com public API — completely free, no auth.
    Returns remote tech jobs. Good for SWE, data, design roles.
    """
    url = f"https://remotive.com/api/remote-jobs?search={quote_plus(keyword)}&limit=20"
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(url, headers=_HEADERS)
            if resp.status_code != 200:
                return []
            data = resp.json()
            jobs_raw = data.get("jobs", [])
            jobs = []
            for j in jobs_raw[:15]:
                title = _clean(j.get("title", ""))
                company = _clean(j.get("company_name", ""))
                location = _clean(j.get("candidate_required_location") or "Remote")
                salary = _clean(j.get("salary") or "")
                desc = _clean(j.get("description") or "")
                url_job = j.get("url", "https://remotive.com")
                tags = [t.strip() for t in (j.get("tags") or []) if t.strip()][:8]
                if not title:
                    continue
                jobs.append({
                    "source": "remotive",
                    "title": title,
                    "company": company or "Remote Company",
                    "location": location,
                    "experience": "",
                    "salary": salary,
                    "url": url_job,
                    "description": desc[:500],
                    "skills": tags,
                })
            logger.info("Remotive: %d jobs fetched for '%s'", len(jobs), keyword)
            return jobs
    except Exception as e:
        logger.warning("Remotive failed: %s", e)
        return []


async def fetch_jsearch_public(source: str, keyword: str, country: str = "in") -> list[dict]:
    """
    Arbeitnow free job board API — no auth, JSON, global jobs.
    https://www.arbeitnow.com/api/job-board-api
    """
    url = f"https://www.arbeitnow.com/api/job-board-api?search={quote_plus(keyword)}"
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(url, headers=_HEADERS)
            if resp.status_code != 200:
                return []
            data = resp.json()
            jobs_raw = data.get("data", [])
            jobs = []
            for j in jobs_raw[:12]:
                title = _clean(j.get("title", ""))
                company = _clean(j.get("company_name", ""))
                location = _clean(j.get("location") or "Remote")
                desc = _clean(j.get("description") or "")
                url_job = j.get("url", "https://www.arbeitnow.com")
                tags = [t.strip() for t in (j.get("tags") or []) if t.strip()][:8]
                if not title:
                    continue
                jobs.append({
                    "source": source,
                    "title": title,
                    "company": company or "Company",
                    "location": location,
                    "experience": "",
                    "salary": "",
                    "url": url_job,
                    "description": desc[:500],
                    "skills": tags,
                })
            logger.info("%s (arbeitnow): %d jobs for '%s'", source, len(jobs), keyword)
            return jobs
    except Exception as e:
        logger.warning("Arbeitnow (%s) failed: %s", source, e)
        return []


async def fetch_jsonld_jobs(source: str, search_url: str, keyword: str) -> list[dict]:
    """
    Scrape JSON-LD job postings from a search results page.
    Many job boards (Indeed, Naukri, etc.) embed structured data.
    """
    try:
        async with httpx.AsyncClient(timeout=18, follow_redirects=True) as client:
            resp = await client.get(search_url, headers={
                **_HEADERS,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            })
            if resp.status_code not in {200, 206}:
                return []
            html = resp.text

        # Extract all JSON-LD blocks
        blocks = re.findall(
            r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            html, re.S | re.I
        )
        jobs = []
        for block in blocks:
            try:
                data = json.loads(block.strip())
            except json.JSONDecodeError:
                continue
            items = data if isinstance(data, list) else [data]
            for item in items:
                if item.get("@type") not in ("JobPosting", "jobPosting"):
                    continue
                title = _clean(item.get("title", ""))
                if not title:
                    continue
                company_data = item.get("hiringOrganization", {})
                company = _clean(company_data.get("name", "") if isinstance(company_data, dict) else str(company_data))
                loc_data = item.get("jobLocation", {})
                if isinstance(loc_data, list):
                    loc_data = loc_data[0] if loc_data else {}
                location = ""
                if isinstance(loc_data, dict):
                    addr = loc_data.get("address", {})
                    location = _clean(
                        addr.get("addressLocality", "") or addr.get("addressRegion", "") if isinstance(addr, dict) else str(addr)
                    )
                job_url = item.get("url") or search_url
                desc = _clean(item.get("description", ""))
                salary_data = item.get("baseSalary", {})
                salary = ""
                if isinstance(salary_data, dict):
                    val = salary_data.get("value", {})
                    if isinstance(val, dict):
                        lo = val.get("minValue", "")
                        hi = val.get("maxValue", "")
                        unit = val.get("unitText", "")
                        if lo or hi:
                            salary = f"₹{lo}-{hi} {unit}".strip()
                jobs.append({
                    "source": source,
                    "title": title,
                    "company": company or f"Company on {source.title()}",
                    "location": location or "India",
                    "experience": _clean(item.get("experienceRequirements", "")),
                    "salary": salary,
                    "url": str(job_url),
                    "description": desc[:500],
                    "skills": [],
                })
        if jobs:
            logger.info("JSON-LD (%s): %d jobs for '%s'", source, len(jobs), keyword)
        return jobs
    except Exception as e:
        logger.warning("JSON-LD scrape (%s) failed: %s", source, e)
        return []


async def fetch_search_jobs(source: str, url_template: str, keyword: str, pages: int = 1) -> list[dict]:
    """
    Universal fetcher:
      1. Try JSON-LD structured data from the search URL
      2. Fall back to a clickable link entry
    """
    query = quote_plus(keyword)
    search_url = url_template.format(query=query)

    # Try JSON-LD first
    jobs = await fetch_jsonld_jobs(source, search_url, keyword)
    if jobs:
        return jobs

    # Graceful fallback
    return _make_link_fallback(source, search_url, keyword)

