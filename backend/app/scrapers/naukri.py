"""
Naukri.com scraper — Multi-strategy approach:

Strategy 1: Naukri RSS feed (truly public, no auth needed)
Strategy 2: Naukri HTML page scraping with BeautifulSoup-style regex
Strategy 3: Graceful fallback with direct search URL

Naukri's internal jobapi/v3 and v4 are now fully blocked with bot detection.
RSS is the most reliable free approach.
"""
import logging
import re
import xml.etree.ElementTree as ET
from typing import Any
from urllib.parse import quote_plus

import httpx

logger = logging.getLogger(__name__)

# Naukri RSS feed — publicly accessible, no auth, no bot detection
_RSS_URL = "https://www.naukri.com/rss/jobsearch/it-jobs-{keyword}-jobs-in-india.xml"
_RSS_URL_LOC = "https://www.naukri.com/rss/jobsearch/it-jobs-{keyword}-jobs-in-{location}.xml"

# Naukri public search page (HTML fallback)
_SEARCH_PAGE = "https://www.naukri.com/{keyword}-jobs"

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.6367.208 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
}

_RSS_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; RSS reader)",
    "Accept": "application/rss+xml, application/xml, text/xml",
}


def _clean(text: str | None) -> str:
    if not text:
        return ""
    # Strip HTML tags
    text = re.sub(r"<[^>]+>", " ", str(text))
    # Normalize whitespace
    text = re.sub(r"\s+", " ", text).strip()
    # Remove HTML entities
    text = text.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"').replace("&#39;", "'")
    return text


def _slug(keyword: str) -> str:
    """Convert keyword to Naukri URL slug: 'software engineer' -> 'software-engineer'"""
    return re.sub(r"[^a-z0-9]+", "-", keyword.lower().strip()).strip("-")


def _parse_rss_item(item: ET.Element) -> dict[str, Any] | None:
    """Parse a single RSS <item> into a job dict."""
    ns = {"": ""}

    def text(tag: str) -> str:
        el = item.find(tag)
        return _clean(el.text) if el is not None else ""

    title = text("title")
    link = text("link")
    description = text("description")
    company = ""
    location = ""
    experience = ""
    salary = ""
    skills: list[str] = []

    # Naukri RSS description contains HTML with job details
    # Extract company from description
    co_match = re.search(r"Company[:\s]+([^\|<\n]+)", description, re.I)
    if co_match:
        company = co_match.group(1).strip()

    loc_match = re.search(r"Location[:\s]+([^\|<\n]+)", description, re.I)
    if loc_match:
        location = loc_match.group(1).strip()

    exp_match = re.search(r"Experience[:\s]+([^\|<\n]+)", description, re.I)
    if exp_match:
        experience = exp_match.group(1).strip()

    sal_match = re.search(r"(?:Salary|CTC)[:\s]+([^\|<\n]+)", description, re.I)
    if sal_match:
        salary = sal_match.group(1).strip()

    # Extract skills from keywords/description
    skills_match = re.findall(r"(?:Skills?|Keywords?)[:\s]+([^\n<|]+)", description, re.I)
    if skills_match:
        for s in skills_match:
            skills.extend([sk.strip() for sk in re.split(r"[,;]", s) if sk.strip()])

    if not title:
        return None

    return {
        "source": "naukri",
        "title": title,
        "company": company or "Company on Naukri",
        "location": location or "India",
        "experience": experience,
        "salary": salary,
        "url": link or "https://www.naukri.com",
        "description": description[:500] if description else "",
        "skills": skills[:10],
    }


async def _fetch_rss(client: httpx.AsyncClient, keyword: str, location: str = "") -> list[dict]:
    """Fetch jobs from Naukri RSS feed."""
    slug = _slug(keyword)
    loc_slug = _slug(location) if location else ""

    # Try location-specific RSS first, then general
    urls = []
    if loc_slug:
        urls.append(_RSS_URL_LOC.format(keyword=slug, location=loc_slug))
    urls.append(_RSS_URL.format(keyword=slug))
    # Also try alternate RSS patterns
    urls.append(f"https://www.naukri.com/rss/jobsearch/{slug}-jobs.xml")
    urls.append(f"https://www.naukri.com/rss/jobsearch/{slug}-jobs-in-india.xml")

    for url in urls:
        try:
            resp = await client.get(url, headers=_RSS_HEADERS, timeout=15)
            if resp.status_code != 200:
                continue
            content_type = resp.headers.get("content-type", "")
            if "xml" not in content_type and "rss" not in content_type and len(resp.content) < 200:
                continue

            root = ET.fromstring(resp.content)
            channel = root.find("channel")
            if channel is None:
                channel = root

            items = channel.findall("item")
            if not items:
                continue

            jobs = []
            for item in items:
                parsed = _parse_rss_item(item)
                if parsed:
                    jobs.append(parsed)

            if jobs:
                logger.info("Naukri RSS: %d jobs from %s", len(jobs), url)
                return jobs

        except ET.ParseError as e:
            logger.debug("Naukri RSS XML parse error for %s: %s", url, e)
        except Exception as e:
            logger.debug("Naukri RSS fetch failed for %s: %s", url, e)

    return []


async def _fetch_html_fallback(client: httpx.AsyncClient, keyword: str) -> list[dict]:
    """Scrape Naukri search results page HTML as last resort."""
    slug = _slug(keyword)
    url = f"https://www.naukri.com/{slug}-jobs"

    try:
        resp = await client.get(url, headers=_HEADERS, timeout=20, follow_redirects=True)
        if resp.status_code not in {200, 206}:
            return []

        html = resp.text

        # Naukri embeds JSON-LD structured data on job listing pages
        json_ld_matches = re.findall(
            r'<script[^>]*type=["\']application/ld\+json["\'][^>]*>(.*?)</script>',
            html, re.S | re.I
        )

        jobs = []
        import json
        for block in json_ld_matches:
            try:
                data = json.loads(block.strip())
                # Handle both single job and list
                items = data if isinstance(data, list) else [data]
                for item in items:
                    if item.get("@type") in ("JobPosting", "jobPosting"):
                        title = _clean(item.get("title", ""))
                        company = _clean(
                            item.get("hiringOrganization", {}).get("name", "") if isinstance(item.get("hiringOrganization"), dict)
                            else str(item.get("hiringOrganization", ""))
                        )
                        location_data = item.get("jobLocation", {})
                        if isinstance(location_data, list):
                            location_data = location_data[0] if location_data else {}
                        location = _clean(
                            location_data.get("address", {}).get("addressLocality", "") if isinstance(location_data.get("address"), dict)
                            else str(location_data.get("address", ""))
                        ) or "India"

                        job_url = item.get("url") or item.get("jobLocation", {}).get("url") or url
                        description = _clean(item.get("description", ""))[:400]
                        salary_range = item.get("baseSalary", {})
                        salary = ""
                        if isinstance(salary_range, dict):
                            val = salary_range.get("value", {})
                            if isinstance(val, dict):
                                salary = f"₹{val.get('minValue','')}-{val.get('maxValue','')} {val.get('unitText','')}"

                        if title:
                            jobs.append({
                                "source": "naukri",
                                "title": title,
                                "company": company or "Company on Naukri",
                                "location": location,
                                "experience": _clean(item.get("experienceRequirements", "")),
                                "salary": salary,
                                "url": str(job_url),
                                "description": description,
                                "skills": [],
                            })
            except (json.JSONDecodeError, AttributeError):
                continue

        if jobs:
            logger.info("Naukri HTML JSON-LD: %d jobs found", len(jobs))
            return jobs

        # If no JSON-LD, return a useful search-link entry
        return [{
            "source": "naukri",
            "title": f"{keyword.title()} — Live Naukri Results",
            "company": "Multiple Companies",
            "location": "India",
            "experience": "",
            "salary": "",
            "url": url,
            "description": f"Latest {keyword} openings on Naukri. Click to browse all listings.",
            "skills": [keyword],
        }]

    except Exception as e:
        logger.warning("Naukri HTML fallback failed: %s", e)
        return []


async def fetch_naukri_jobs(
    keyword: str = "software engineer",
    location: str = "",
    experience: int = 0,
    pages: int = 2,
) -> list[dict[str, Any]]:
    """
    Fetch Naukri job listings using RSS (primary) → HTML JSON-LD (fallback).
    Naukri's internal jobapi/v3+v4 are blocked; RSS is the reliable free path.
    """
    async with httpx.AsyncClient(timeout=25, follow_redirects=True) as client:
        # Strategy 1: RSS feed
        jobs = await _fetch_rss(client, keyword, location)
        if jobs:
            return jobs

        # Strategy 2: HTML page with JSON-LD structured data
        logger.info("Naukri RSS failed — trying HTML JSON-LD for '%s'", keyword)
        jobs = await _fetch_html_fallback(client, keyword)
        return jobs
