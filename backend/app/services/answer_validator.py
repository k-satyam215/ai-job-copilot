import re


SENSITIVE_PATTERNS = [
    r"\b\d{10,16}\b",
    r"\b[A-Z]{5}\d{4}[A-Z]\b",
    r"password",
    r"otp",
]


def clean_answer(answer: str, max_length: int = 900) -> str:
    value = re.sub(r"\s+", " ", answer or "").strip()
    for pattern in SENSITIVE_PATTERNS:
        value = re.sub(pattern, "[redacted]", value, flags=re.IGNORECASE)
    return value[:max_length]


def validate_answer(answer: str, question_type: str, options: list[str] | None = None) -> dict:
    cleaned = clean_answer(answer)
    options = options or []
    warnings: list[str] = []
    if question_type in {"current_ctc", "expected_ctc"} and any(ch.isdigit() for ch in cleaned):
        warnings.append("salary_number_present")
    if question_type in {"relocation", "authorization"} and cleaned.lower() not in {"yes", "no"}:
        cleaned = "Yes" if "yes" in cleaned.lower() else "No" if "no" in cleaned.lower() else cleaned
    if options and cleaned not in options:
        match = next((option for option in options if option.lower() in cleaned.lower()), None)
        if match:
            cleaned = match
    return {"answer": cleaned, "warnings": warnings, "valid": bool(cleaned)}
