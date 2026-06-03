from app.scrapers.search_sources import fetch_search_jobs


async def fetch_apna_jobs(keyword: str, pages: int = 1) -> list[dict]:
    return await fetch_search_jobs("apna", "https://apna.co/jobs?search=true&text={query}", keyword, pages)
