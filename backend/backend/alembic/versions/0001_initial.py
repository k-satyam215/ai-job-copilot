"""initial schema — creates all production tables

Revision ID: 0001_initial
Revises:
Create Date: 2026-06-01
"""
from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("email", sa.String(255), unique=True, index=True, nullable=False),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("phone", sa.String(64), nullable=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("plan", sa.String(32), server_default="free", nullable=False),
        sa.Column("ai_credits", sa.Integer, server_default="25", nullable=False),
        sa.Column("resume_path", sa.String(512), nullable=True),
        sa.Column("resume_text", sa.Text, nullable=True),
        sa.Column("profile_json", sa.JSON, nullable=True),
        sa.Column("preferences_json", sa.JSON, nullable=True),
        sa.Column("is_verified", sa.Boolean, server_default="false", nullable=False),
        sa.Column("verification_token", sa.String(128), nullable=True, index=True),
        sa.Column("verified_at", sa.DateTime, nullable=True),
        sa.Column("reset_token", sa.String(128), nullable=True, index=True),
        sa.Column("reset_token_expires_at", sa.DateTime, nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "jobs",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("source", sa.String(64), index=True, nullable=False),
        sa.Column("title", sa.String(255), index=True, nullable=False),
        sa.Column("company", sa.String(255), index=True, nullable=False),
        sa.Column("location", sa.String(255), nullable=True),
        sa.Column("experience", sa.String(128), nullable=True),
        sa.Column("salary", sa.String(128), nullable=True),
        sa.Column("url", sa.String(1024), nullable=False, unique=True, index=True),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("skills_json", sa.JSON, nullable=True),
        sa.Column("raw_json", sa.JSON, nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime, server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "applications",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("job_id", sa.Integer, sa.ForeignKey("jobs.id", ondelete="SET NULL"), nullable=True),
        sa.Column("job_url", sa.String(1024), nullable=False, index=True),
        sa.Column("company", sa.String(255), nullable=False),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("status", sa.String(64), server_default="tracked", nullable=False, index=True),
        sa.Column("match_score", sa.Integer, server_default="0", nullable=False),
        sa.Column("platform", sa.String(64), nullable=True, index=True),
        sa.Column("notes", sa.String(1024), nullable=True),
        sa.Column("answers_json", sa.JSON, nullable=True),
        sa.Column("created_at", sa.DateTime, server_default=sa.func.now(), nullable=False),
    )


def downgrade():
    op.drop_table("applications")
    op.drop_table("jobs")
    op.drop_table("users")
