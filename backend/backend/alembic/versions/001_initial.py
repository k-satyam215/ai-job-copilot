"""Initial schema — users, jobs, applications

Revision ID: 001_initial
Revises:
Create Date: 2025-01-01 00:00:00.000000
"""
from __future__ import annotations

from datetime import datetime

import sqlalchemy as sa
from alembic import op

revision = "001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── users ──────────────────────────────────────────────────────────────
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("email", sa.String(255), unique=True, nullable=False, index=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(64), nullable=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("plan", sa.String(32), nullable=False, server_default="free"),
        sa.Column("ai_credits", sa.Integer, nullable=False, server_default="25"),
        sa.Column("resume_path", sa.String(512), nullable=True),
        sa.Column("resume_text", sa.Text, nullable=True),
        sa.Column("profile_json", sa.JSON, nullable=True),
        sa.Column("preferences_json", sa.JSON, nullable=True),
        sa.Column("is_verified", sa.Boolean, nullable=False, server_default="false"),
        sa.Column("verification_token", sa.String(128), nullable=True, index=True),
        sa.Column("verified_at", sa.DateTime, nullable=True),
        sa.Column("reset_token", sa.String(128), nullable=True, index=True),
        sa.Column("reset_token_expires_at", sa.DateTime, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
    )

    # ── jobs ───────────────────────────────────────────────────────────────
    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("source", sa.String(64), nullable=True),
        sa.Column("title", sa.String(255), nullable=True),
        sa.Column("company", sa.String(255), nullable=True),
        sa.Column("location", sa.String(255), nullable=True),
        sa.Column("experience", sa.String(128), nullable=True),
        sa.Column("salary", sa.String(128), nullable=True),
        sa.Column("url", sa.String(1024), nullable=True, unique=True, index=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("skills_json", sa.JSON, nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
    )

    # ── applications ───────────────────────────────────────────────────────
    op.create_table(
        "applications",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("job_id", sa.Integer, sa.ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True),
        sa.Column("title", sa.String(255), nullable=True),
        sa.Column("company", sa.String(255), nullable=True),
        sa.Column("job_url", sa.String(1024), nullable=True),
        sa.Column("source", sa.String(64), nullable=True),
        sa.Column("status", sa.String(64), nullable=False, server_default="applied"),
        sa.Column("match_score", sa.Integer, nullable=True),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("applied_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
        sa.Column("created_at", sa.DateTime, nullable=False, server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table("applications")
    op.drop_table("jobs")
    op.drop_table("users")
