import re


QUESTION_TYPES = {
    "current_ctc": ["current ctc", "current salary", "current compensation", "present ctc"],
    "expected_ctc": ["expected ctc", "expected salary", "salary expectation", "expected compensation"],
    "notice_period": ["notice period", "joining", "available to join", "when can you join"],
    "relocation": ["relocate", "relocation", "work location", "willing to move"],
    "experience": ["experience", "years", "relevant exp", "total exp"],
    "cover_letter": ["cover letter", "why should we hire", "why are you interested", "message to recruiter"],
    "name": ["full name", "name"],
    "email": ["email", "e-mail"],
    "phone": ["phone", "mobile", "contact"],
    "location": ["current location", "city", "location"],
    "linkedin": ["linkedin"],
    "portfolio": ["portfolio", "github", "website"],
    "authorization": ["authorized", "work authorization", "eligible to work"],
}


def normalize_question(text: str | None) -> str:
    value = re.sub(r"\s+", " ", text or "").strip()
    return value[:500]


def classify_question(text: str | None, field_type: str | None = None) -> str:
    question = normalize_question(text).lower()
    for question_type, phrases in QUESTION_TYPES.items():
        if any(phrase in question for phrase in phrases):
            return question_type
    if field_type in {"radio", "checkbox", "select"}:
        return "choice"
    return "general"
