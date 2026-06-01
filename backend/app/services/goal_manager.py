def application_goal(job: dict) -> dict:
    return {
        "goal": "complete_application_review_ready",
        "job_url": job.get("url"),
        "success_state": "all_required_fields_filled_user_review_pending",
        "constraints": ["no_final_submit_without_user_approval", "pause_on_captcha"],
    }
