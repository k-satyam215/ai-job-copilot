"""
Run this script ONCE to create the Razorpay reviewer test account in your database.

Usage (from backend/ directory):
    python ../scripts/create_test_user.py

Or from repo root:
    python scripts/create_test_user.py
"""
import sys
import os

# Make sure we can import app modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from dotenv import load_dotenv
load_dotenv(os.path.join(os.path.dirname(__file__), "..", "backend", ".env"))

from app.database import SessionLocal, Base, engine
from app.models import application, job, user  # noqa — registers all models
from app.models.user import User
from app.utils.security import hash_password

# Run missing column migrations first
from sqlalchemy import text
with engine.connect() as conn:
    migrations = [
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS is_verified BOOLEAN NOT NULL DEFAULT FALSE",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_token VARCHAR(128)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS verified_at TIMESTAMP",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token VARCHAR(128)",
        "ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_token_expires_at TIMESTAMP",
    ]
    for sql in migrations:
        try:
            conn.execute(text(sql))
        except Exception as e:
            print(f"  (skipped: {e}")
    conn.commit()
    print("✓ Database columns verified")

Base.metadata.create_all(bind=engine)

TEST_EMAIL    = "test_reviewer@aijobcopilot.com"
TEST_PASSWORD = "TestPassword123!"
TEST_NAME     = "Razorpay Reviewer"

db = SessionLocal()
try:
    existing = db.query(User).filter(User.email == TEST_EMAIL).first()
    if existing:
        # Reset password just in case
        existing.hashed_password = hash_password(TEST_PASSWORD)
        existing.is_verified = True
        existing.plan = "free"
        existing.ai_credits = 25
        db.commit()
        print(f"✓ Test user already exists — password reset to: {TEST_PASSWORD}")
    else:
        user = User(
            email=TEST_EMAIL,
            full_name=TEST_NAME,
            hashed_password=hash_password(TEST_PASSWORD),
            is_verified=True,   # pre-verified so reviewer doesn't need email
            plan="free",
            ai_credits=25,
        )
        db.add(user)
        db.commit()
        print(f"✓ Test user created successfully!")

    print()
    print("=" * 50)
    print("  RAZORPAY REVIEWER CREDENTIALS")
    print("=" * 50)
    print(f"  Email   : {TEST_EMAIL}")
    print(f"  Password: {TEST_PASSWORD}")
    print(f"  Login   : https://ai-job-copilot-psi.vercel.app/login")
    print(f"  Pricing : https://ai-job-copilot-psi.vercel.app/pricing")
    print("=" * 50)
    print()
finally:
    db.close()
