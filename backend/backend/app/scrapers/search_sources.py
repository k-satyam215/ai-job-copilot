import re
from urllib.parse import quote_plus

import httpx


def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", text or "")).strip()


async def fetch_search_jobs(source: str, url_template: str, keyword: str, pages: int = 1) -> list[dict]:
    query = quote_plus(keyword)
    url = url_template.format(query=query)
    try:
        async with httpx.AsyncClient(timeout=15, follow_redirects=True) as client:
            response = await client.get(url, headers={"User-Agent": "Mozilla/5.0 AIJobCopilot/1.0"})
            response.raise_for_status()
            html = response.text
    except Exception:
        return []

    title = _clean(re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S).group(1)) if re.search(r"<title[^>]*>(.*?)</title>", html, re.I | re.S) else f"{keyword} jobs"
    return [{
        "source": source,
        "title": title[:180],
        "company": source.title(),
        "location": "India",
        "experience": "",
        "salary": "",
        "url": url,
        "description": f"Live {source} search result page for {keyword}. Open link for latest postings.",
        "skills": [keyword],
    }]
