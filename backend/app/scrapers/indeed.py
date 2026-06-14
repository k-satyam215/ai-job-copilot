"""Indeed scraper disabled — JSearch API covers Indeed jobs with real URLs."""


async def fetch_indeed_jobs(keyword: str = "software engineer", pages: int = 1) -> list[dict]:
    """Disabled: JSearch API already fetches Indeed jobs with real apply URLs."""
    return []
