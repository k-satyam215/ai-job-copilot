from app.scrapers.search_sources import fetch_search_jobs


async def fetch_foundit_jobs(keyword: str, pages: int = 1) -> list[dict]:
    return await fetch_search_jobs("foundit", "https://www.foundit.in/srp/results?query={query}", keyword, pages)
