def company_snapshot(company: str) -> dict:
    return {
        "company": company,
        "data_source": "local_placeholder",
        "notes": "Connect Clearbit/LinkedIn/Crunchbase-style providers for live enrichment.",
        "stability": "unknown",
    }
