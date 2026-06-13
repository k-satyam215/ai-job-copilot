"""Add credits_reset_at and platform column (safe)

Revision ID: 002_add_credits_reset_platform
Revises: 001_initial
Create Date: 2025-01-02 00:00:00.000000
"""
from __future__ import annotations

import sqlalchemy as sa
from alembic import op
from sqlalchemy import inspect, text

revision = "002_add_credits_reset_platform"
down_revision = "001_initial"
branch_labels = None
depends_on = None


def _column_exists(table: str, column: str) -> bool:
    conn = op.get_bind()
    insp = inspect(conn)
    cols = [c["name"] for c in insp.get_columns(table)]
    return column in cols


def upgrade() -> None:
    if not _column_exists("users", "credits_reset_at"):
        with op.batch_alter_table("users") as batch_op:
            batch_op.add_column(sa.Column("credits_reset_at", sa.DateTime, nullable=True))

    if not _column_exists("applications", "platform"):
        with op.batch_alter_table("applications") as batch_op:
            batch_op.add_column(sa.Column("platform", sa.String(64), nullable=True))


def downgrade() -> None:
    if _column_exists("users", "credits_reset_at"):
        with op.batch_alter_table("users") as batch_op:
            batch_op.drop_column("credits_reset_at")
