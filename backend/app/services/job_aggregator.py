import asyncio

from app.scrapers.apna import fetch_apna_jobs
from app.scrapers.foundit import fetch_foundit_jobs
from app.scrapers.indeed import fetch_indeed_jobs
from app.scrapers.linkedin import fetch_linkedin_jobs
from app.scrapers.naukri import fetch_naukri_jobs
from app.scrapers.unstop import fetch_unstop_jobs


async def fetch_jobs_from_all_sources(keyword: str, pages: int = 1) -> list[dict]:
    tasks = [
        fetch_naukri_jobs(keyword=keyword, pages=pages),
        fetch_linkedin_jobs(keyword=keyword, pages=pages),
        fetch_foundit_jobs(keyword=keyword, pages=pages),
        fetch_indeed_jobs(keyword=keyword, pages=pages),
        fetch_unstop_jobs(keyword=keyword, pages=pages),
        fetch_apna_jobs(keyword=keyword, pages=pages),
    ]
    results = await asyncio.gather(*tasks, return_exceptions=True)
    jobs: list[dict] = []
    for result in results:
        if isinstance(result, list):
            jobs.extend(result)
    return jobs
