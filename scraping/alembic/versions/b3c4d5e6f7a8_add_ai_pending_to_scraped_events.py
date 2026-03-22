"""add ai_pending flag to scraped_events

Revision ID: b3c4d5e6f7a8
Revises: 9e1fc8d7fde2
Create Date: 2026-03-22 12:00:00.000000
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'b3c4d5e6f7a8'
down_revision: Union[str, None] = '9e1fc8d7fde2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('scraped_events', sa.Column('ai_pending', sa.Boolean(), nullable=False, server_default=sa.text('false')))
    op.create_index('ix_scraped_events_ai_pending', 'scraped_events', ['ai_pending'])


def downgrade() -> None:
    op.drop_index('ix_scraped_events_ai_pending', table_name='scraped_events')
    op.drop_column('scraped_events', 'ai_pending')
