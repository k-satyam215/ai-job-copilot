import os


REQUIRED_FOR_PRODUCTION = ["JWT_SECRET", "DATABASE_URL", "GROQ_API_KEY", "FRONTEND_ORIGIN"]


def validate_environment(production: bool = False) -> dict:
    missing = [key for key in REQUIRED_FOR_PRODUCTION if production and not os.getenv(key)]
    warnings = []
    if os.getenv("JWT_SECRET", "change-me-in-production") == "change-me-in-production":
        warnings.append("JWT_SECRET is using development default")
    database_url = os.getenv("DATABASE_URL", "")
    if "psycopg2" in database_url:
        warnings.append("DATABASE_URL uses psycopg2; backend will normalize it to psycopg v3")
    return {"production": production, "missing": missing, "warnings": warnings, "ready": not missing}
