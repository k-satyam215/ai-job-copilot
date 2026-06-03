from app.scrapers.search_sources import fetch_search_jobs


async def fetch_indeed_jobs(keyword: str, pages: int = 1) -> list[dict]:
    return await fetch_search_jobs("indeed", "https://in.indeed.com/jobs?q={query}", keyword, pages)
