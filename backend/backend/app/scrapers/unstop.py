from app.scrapers.search_sources import fetch_search_jobs


async def fetch_unstop_jobs(keyword: str, pages: int = 1) -> list[dict]:
    return await fetch_search_jobs("unstop", "https://unstop.com/jobs?searchTerm={query}", keyword, pages)
