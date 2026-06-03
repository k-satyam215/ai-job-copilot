"""Root entry point for AI Job Copilot.

Run from project root:
    python main.py

Or directly with uvicorn (recommended):
    uvicorn backend.app.main:app --reload --port 8000
"""
import os
import sys

if __name__ == "__main__":
    # Add backend to path so imports work
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), "backend"))

    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("APP_PORT", "8000")),
        reload=True,
        reload_dirs=["backend/app"],
    )
