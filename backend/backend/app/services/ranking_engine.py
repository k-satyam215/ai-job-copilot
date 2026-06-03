def rank_jobs(jobs: list[dict]) -> list[dict]:
    return sorted(jobs, key=lambda job: job.get("match", {}).get("match_score", job.get("match_score", 0)), reverse=True)
