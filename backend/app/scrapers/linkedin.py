"""
LinkedIn job scraper — JSON-LD + RSS approach.
LinkedIn blocks most scraping, so we use their public job search RSS feed.
"""
import logging
import re
import xml.etree.ElementTree as ET
from urllib.parse import quote_plus

import httpx

logger = logging.getLogger(__name__)

_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-IN,en;q=0.9",
}


def _clean(text: str | None) -> str:
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", str(text))
    text = re.sub(r"\s+", " ", text).strip()
    return text[:500]


async def fetch_linkedin_jobs(keyword: str = "software engineer", location: str = "India", pages: int = 1) -> list[dict]:
    """
    Fetch LinkedIn jobs via their public job search page JSON-LD.
    Falls back to a useful search link if blocked.
    """
    query = quote_plus(keyword)
    loc = quote_plus(location or "India")
    
    # LinkedIn public jobs API (no auth needed for basic search)
    search_url = f"https://www.linkedin.com/jobs/search?keywords={query}&location={loc}&f_TPR=r86400"
    
    try:
        async with httpx.AsyncClient(timeout=18, follow_redirects=True) as client:
            resp = await client.get(search_url, headers=_HEADERS)
            if resp.status_code not in {200, 206}:
                return _fallback(keyword, query, loc)
            
            html = resp.text
            
            # Extract JSON-LD job postings
            blocks = re.findall(
                r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
                html, re.S | re.I
            )
            
            import json
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
                            loc_data = item.get("jobLocation", {})
                            if isinstance(loc_data, list):
                                loc_data = loc_data[0] if loc_data else {}
                            addr = loc_data.get("address", {}) if isinstance(loc_data, dict) else {}
                            location_str = _clean(
                                addr.get("addressLocality") or addr.get("addressRegion") or location
                                if isinstance(addr, dict) else str(addr)
                            )
                            jobs.append({
                                "source": "linkedin",
                                "title": title,
                                "company": company or "Company",
                                "location": location_str or "India",
                                "experience": "",
                                "salary": "",
                                "url": item.get("url") or search_url,
                                "description": _clean(item.get("description", ""))[:400],
                                "skills": [],
                            })
                except Exception:
                    continue
            
            if jobs:
                logger.info("LinkedIn JSON-LD: %d jobs for '%s'", len(jobs), keyword)
                return jobs
            
            # Extract jobs from HTML data attributes (LinkedIn embeds job data)
            job_matches = re.findall(
                r'"jobPostingId":"(\d+)"[^}]*"title":"([^"]+)"[^}]*"companyName":"([^"]+)"[^}]*"formattedLocation":"([^"]*)"',
                html
            )
            if job_matches:
                jobs = []
                for job_id, title, company, loc_str in job_matches[:15]:
                    jobs.append({
                        "source": "linkedin",
                        "title": _clean(title),
                        "company": _clean(company),
                        "location": _clean(loc_str) or "India",
                        "experience": "",
                        "salary": "",
                        "url": f"https://www.linkedin.com/jobs/view/{job_id}",
                        "description": f"{title} role at {company}",
                        "skills": [],
                    })
                logger.info("LinkedIn HTML: %d jobs for '%s'", len(jobs), keyword)
                return jobs

    except Exception as e:
        logger.warning("LinkedIn scraper failed: %s", e)
    
    return _fallback(keyword, query, loc)


def _fallback(keyword: str, query: str, loc: str) -> list[dict]:
    return [{
        "source": "linkedin",
        "title": f"{keyword.title()} — Search on LinkedIn",
        "company": "Multiple Companies",
        "location": "India",
        "experience": "",
        "salary": "",
        "url": f"https://www.linkedin.com/jobs/search?keywords={query}&location={loc}",
        "description": f"Browse {keyword} jobs on LinkedIn. Click to view all listings.",
        "skills": [keyword],
    }]
