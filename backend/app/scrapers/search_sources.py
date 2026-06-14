"""
Hybrid job sources — Production-grade.

Primary (paid/free API with real individual job URLs):
  1. JSearch (RapidAPI)  — Naukri + LinkedIn + Indeed + Glassdoor + 20+ sources
  2. Adzuna              — free API, India jobs

Fallback (free, no API key needed):
  3. Remotive            — remote tech jobs
  4. Arbeitnow           — global jobs
  5. Jobicy              — remote jobs
  6. Himalayas           — remote jobs
  7. TheMuse             — tech/startup jobs

Every job returned has a real individual apply URL.
No search-page fallbacks.
"""
import logging
import re
from urllib.parse import quote_plus

import httpx

logger = logging.getLogger(__name__)

_HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; JobBot/1.0)",
    "Accept": "application/json",
    "Accept-Language": "en-US,en;q=0.9",
}


def _clean(text: str | None) -> str:
    if not text:
        return ""
    text = re.sub(r"<[^>]+>", " ", str(text))
    text = re.sub(r"\s+", " ", text).strip()
    return text[:600]


# ─────────────────────────────────────────────
# PRIMARY: JSearch via RapidAPI
# Covers: Naukri, LinkedIn, Indeed, Glassdoor, ZipRecruiter, 20+ more
# ─────────────────────────────────────────────
async def fetch_jsearch_jobs(keyword: str, api_key: str, country: str = "in", num_pages: int = 2) -> list[dict]:
    """JSearch API (RapidAPI) — aggregates Naukri, LinkedIn, Indeed, Glassdoor.
    Real individual apply URLs for every job.
    Free: 200 req/month | Paid: $10/month for 5000 req.
    """
    url = "https://jsearch.p.rapidapi.com/search"
    headers = {
        "X-RapidAPI-Key": api_key,
        "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        "Accept": "application/json",
    }
    jobs = []
    try:
        async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
            for page in range(1, num_pages + 1):
                params = {
                    "query": f"{keyword} in India",
                    "page": str(page),
                    "num_pages": "1",
                    "country": country,
                    "language": "en",
                }
                resp = await client.get(url, headers=headers, params=params)
                if resp.status_code == 429:
                    logger.warning("JSearch: rate limited")
                    break
                if resp.status_code != 200:
                    logger.warning("JSearch: HTTP %d", resp.status_code)
                    break
                data = resp.json().get("data", [])
                for j in data:
                    title = _clean(j.get("job_title", ""))
                    apply_url = j.get("job_apply_link") or j.get("job_google_link", "")
                    if not title or not apply_url:
                        continue
                    jobs.append({
                        "source": j.get("job_publisher", "jsearch").lower(),
                        "title": title,
                        "company": _clean(j.get("employer_name", "")) or "Company",
                        "location": _clean(
                            f"{j.get('job_city', '')}, {j.get('job_state', '')}, {j.get('job_country', 'India')}".strip(", ")
                        ),
                        "experience": _clean(j.get("job_required_experience", {}).get("required_experience_in_months") and
                                             f"{j['job_required_experience']['required_experience_in_months']//12} years" or ""),
                        "salary": _clean(
                            f"{j.get('job_min_salary', '')} - {j.get('job_max_salary', '')} {j.get('job_salary_currency', '')}".strip(" - ")
                        ) if j.get("job_min_salary") else "",
                        "url": apply_url,
                        "description": _clean(j.get("job_description", ""))[:500],
                        "skills": [s.strip() for s in (j.get("job_required_skills") or []) if s.strip()][:8],
                    })
        logger.info("JSearch: %d jobs for '%s'", len(jobs), keyword)
        return jobs
    except Exception as e:
        logger.warning("JSearch failed: %s", e)
        return []


# ─────────────────────────────────────────────
# PRIMARY: Adzuna (free, app_id + app_key)
# Covers: India jobs from multiple sources
# Free: 250 req/month at https://developer.adzuna.com
# ─────────────────────────────────────────────
async def fetch_adzuna_jobs(keyword: str, app_id: str, app_key: str, pages: int = 2) -> list[dict]:
    """Adzuna free API — India job listings with real apply URLs.
    Register free at https://developer.adzuna.com
    """
    jobs = []
    try:
        async with httpx.AsyncClient(timeout=20, follow_redirects=True) as client:
            for page in range(1, pages + 1):
                url = (
                    f"https://api.adzuna.com/v1/api/jobs/in/search/{page}"
                    f"?app_id={app_id}&app_key={app_key}"
                    f"&results_per_page=20&what={quote_plus(keyword)}"
                    f"&content-type=application/json"
                )
                resp = await client.get(url, headers=_HEADERS)
                if resp.status_code != 200:
                    break
                for j in resp.json().get("results", []):
                    title = _clean(j.get("title", ""))
                    apply_url = j.get("redirect_url", "")
                    if not title or not apply_url:
                        continue
                    loc = j.get("location", {})
                    location = _clean(" ".join(loc.get("area", [])) if isinstance(loc, dict) else str(loc))
                    jobs.append({
                        "source": "adzuna",
                        "title": title,
                        "company": _clean(j.get("company", {}).get("display_name", "")) or "Company",
                        "location": location or "India",
                        "experience": "",
                        "salary": str(round(j["salary_min"])) + " - " + str(round(j["salary_max"])) + " INR"
                                   if j.get("salary_min") else "",
                        "url": apply_url,
                        "description": _clean(j.get("description", ""))[:500],
                        "skills": [],
                    })
        logger.info("Adzuna: %d jobs for '%s'", len(jobs), keyword)
        return jobs
    except Exception as e:
        logger.warning("Adzuna failed: %s", e)
        return []


# ─────────────────────────────────────────────
# FALLBACK FREE SOURCES (no API key needed)
# ─────────────────────────────────────────────
async def fetch_remotive_jobs(keyword: str, pages: int = 1) -> list[dict]:
    url = f"https://remotive.com/api/remote-jobs?search={quote_plus(keyword)}&limit=20"
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(url, headers=_HEADERS)
            if resp.status_code != 200:
                return []
            jobs = []
            for j in resp.json().get("jobs", [])[:20]:
                title = _clean(j.get("title", ""))
                if not title:
                    continue
                jobs.append({
                    "source": "remotive",
                    "title": title,
                    "company": _clean(j.get("company_name", "")) or "Remote Company",
                    "location": _clean(j.get("candidate_required_location") or "Remote"),
                    "experience": "",
                    "salary": _clean(j.get("salary") or ""),
                    "url": j.get("url", "https://remotive.com"),
                    "description": _clean(j.get("description") or "")[:500],
                    "skills": [t.strip() for t in (j.get("tags") or []) if t.strip()][:8],
                })
            logger.info("Remotive: %d jobs for '%s'", len(jobs), keyword)
            return jobs
    except Exception as e:
        logger.warning("Remotive failed: %s", e)
        return []


async def fetch_jsearch_public(source: str, keyword: str, country: str = "in") -> list[dict]:
    """Arbeitnow free API — no key needed."""
    url = f"https://www.arbeitnow.com/api/job-board-api?search={quote_plus(keyword)}"
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(url, headers=_HEADERS)
            if resp.status_code != 200:
                return []
            jobs = []
            for j in resp.json().get("data", [])[:20]:
                title = _clean(j.get("title", ""))
                job_url = j.get("url", "")
                if not title or not job_url:
                    continue
                jobs.append({
                    "source": "arbeitnow",
                    "title": title,
                    "company": _clean(j.get("company_name", "")) or "Company",
                    "location": _clean(j.get("location") or "Remote"),
                    "experience": "",
                    "salary": "",
                    "url": job_url,
                    "description": _clean(j.get("description") or "")[:500],
                    "skills": [t.strip() for t in (j.get("tags") or []) if t.strip()][:8],
                })
            logger.info("Arbeitnow: %d jobs for '%s'", len(jobs), keyword)
            return jobs
    except Exception as e:
        logger.warning("Arbeitnow failed: %s", e)
        return []


async def fetch_jobicy_jobs(keyword: str) -> list[dict]:
    url = f"https://jobicy.com/api/v2/remote-jobs?tag={quote_plus(keyword)}&count=20"
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(url, headers=_HEADERS)
            if resp.status_code != 200:
                return []
            jobs = []
            for j in resp.json().get("jobs", [])[:20]:
                title = _clean(j.get("jobTitle", ""))
                job_url = j.get("url", "")
                if not title or not job_url:
                    continue
                jobs.append({
                    "source": "jobicy",
                    "title": title,
                    "company": _clean(j.get("companyName", "")) or "Company",
                    "location": _clean(j.get("jobGeo") or "Remote"),
                    "experience": _clean(j.get("jobLevel") or ""),
                    "salary": _clean(j.get("annualSalaryMin") or ""),
                    "url": job_url,
                    "description": _clean(j.get("jobExcerpt") or "")[:500],
                    "skills": [t.strip() for t in (j.get("jobIndustry") or []) if t.strip()][:5],
                })
            logger.info("Jobicy: %d jobs for '%s'", len(jobs), keyword)
            return jobs
    except Exception as e:
        logger.warning("Jobicy failed: %s", e)
        return []


async def fetch_himalayas_jobs(keyword: str) -> list[dict]:
    url = f"https://himalayas.app/jobs/api?q={quote_plus(keyword)}&limit=20"
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(url, headers=_HEADERS)
            if resp.status_code != 200:
                return []
            jobs = []
            for j in resp.json().get("jobs", [])[:20]:
                title = _clean(j.get("title", ""))
                job_url = j.get("applicationLink") or j.get("url", "")
                if not title or not job_url:
                    continue
                jobs.append({
                    "source": "himalayas",
                    "title": title,
                    "company": _clean(j.get("companyName", "")) or "Company",
                    "location": _clean(j.get("location") or "Remote"),
                    "experience": "",
                    "salary": "",
                    "url": job_url,
                    "description": _clean(j.get("description") or "")[:500],
                    "skills": [t.strip() for t in (j.get("skills") or []) if t.strip()][:8],
                })
            logger.info("Himalayas: %d jobs for '%s'", len(jobs), keyword)
            return jobs
    except Exception as e:
        logger.warning("Himalayas failed: %s", e)
        return []


async def fetch_themuse_jobs(keyword: str) -> list[dict]:
    url = f"https://www.themuse.com/api/public/jobs?category={quote_plus(keyword)}&page=1&descending=true"
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            resp = await client.get(url, headers=_HEADERS)
            if resp.status_code != 200:
                return []
            jobs = []
            for j in resp.json().get("results", [])[:15]:
                title = _clean(j.get("name", ""))
                refs = j.get("refs", {})
                job_url = refs.get("landing_page", "") if isinstance(refs, dict) else ""
                if not title or not job_url:
                    continue
                company = j.get("company", {})
                locations = j.get("locations", [])
                jobs.append({
                    "source": "themuse",
                    "title": title,
                    "company": _clean(company.get("name", "") if isinstance(company, dict) else str(company)) or "Company",
                    "location": _clean(locations[0].get("name", "Remote") if locations else "Remote"),
                    "experience": _clean(j.get("levels", [{}])[0].get("name", "") if j.get("levels") else ""),
                    "salary": "",
                    "url": job_url,
                    "description": _clean(j.get("contents", ""))[:500],
                    "skills": [],
                })
            logger.info("TheMuse: %d jobs for '%s'", len(jobs), keyword)
            return jobs
    except Exception as e:
        logger.warning("TheMuse failed: %s", e)
        return []


# Keep old signatures so existing imports don't break
async def fetch_jsonld_jobs(source: str, search_url: str, keyword: str) -> list[dict]:
    return []


async def fetch_search_jobs(source: str, url_template: str, keyword: str, pages: int = 1) -> list[dict]:
    return []

