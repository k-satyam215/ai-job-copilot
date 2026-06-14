"""LinkedIn scraper disabled — JSearch API covers LinkedIn jobs with real URLs."""

async def fetch_linkedin_jobs(keyword: str = "software engineer", location: str = "India", pages: int = 1) -> list[dict]:
    """Disabled: JSearch API already fetches LinkedIn jobs with real apply URLs."""
    return []
