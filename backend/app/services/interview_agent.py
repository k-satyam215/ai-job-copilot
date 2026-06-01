def generate_interview_pack(job: dict, profile: dict) -> dict:
    role = job.get("title") or "the role"
    skills = (job.get("skills") or profile.get("skills") or [])[:6]
    technical = [f"How have you used {skill} in a real project?" for skill in skills]
    behavioral = [
        "Tell me about a time you solved an ambiguous problem.",
        "Describe a project where you took ownership end to end.",
        "How do you handle feedback and iteration?",
    ]
    return {
        "role": role,
        "technical_questions": technical or ["Explain a recent technical project in depth."],
        "behavioral_questions": behavioral,
        "prep_plan": [
            "Prepare a 60-second introduction.",
            "Review the job description and map your projects to each requirement.",
            "Practice concise STAR-format answers.",
        ],
    }
