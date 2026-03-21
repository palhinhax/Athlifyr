"""add ai_input and ai_output fields to scraped_events

Revision ID: a1b2c3d4e5f6
Revises: 67256fcf0b19
Create Date: 2026-03-21 22:00:00.000000
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, None] = '67256fcf0b19'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('scraped_events', sa.Column('ai_input', sa.Text(), nullable=True))
    op.add_column('scraped_events', sa.Column('ai_output', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('scraped_events', 'ai_output')
    op.drop_column('scraped_events', 'ai_input')
