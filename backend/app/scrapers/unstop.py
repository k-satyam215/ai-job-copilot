"""Unstop scraper disabled — JSearch API covers Unstop jobs with real URLs."""


async def fetch_unstop_jobs(keyword: str = "software engineer", pages: int = 1) -> list[dict]:
    """Disabled: JSearch API already fetches Unstop jobs with real apply URLs."""
    return []
