"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-06-01
"""
from alembic import op


revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # The app currently creates tables from SQLAlchemy metadata for local MVP.
    # Use `alembic revision --autogenerate` after switching production DATABASE_URL.
    pass


def downgrade():
    pass
