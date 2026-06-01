from app.scrapers.search_sources import fetch_search_jobs


async def fetch_linkedin_jobs(keyword: str, pages: int = 1) -> list[dict]:
    return await fetch_search_jobs("linkedin", "https://www.linkedin.com/jobs/search/?keywords={query}", keyword, pages)
