def plan_campaign(target_role: str, days: int = 14) -> dict:
    return {
        "target_role": target_role,
        "days": days,
        "milestones": [
            "parse_resume_and_memory",
            "collect_jobs_daily",
            "rank_and_shortlist",
            "tailor_resume_for_top_matches",
            "apply_with_copilot",
            "track_outcomes_and_learn",
        ],
    }
