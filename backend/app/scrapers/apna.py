"""Apna scraper disabled — JSearch API covers Apna jobs with real URLs."""


async def fetch_apna_jobs(keyword: str = "software engineer", location: str = "India", pages: int = 1) -> list[dict]:
    """Disabled: JSearch API already fetches Apna jobs with real apply URLs."""
    return []
