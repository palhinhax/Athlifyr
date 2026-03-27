"""add dedup_pairs table

Revision ID: e6f7a8b9c0d1
Revises: d5e6f7a8b9c0
Create Date: 2026-03-26 10:00:00.000000
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'e6f7a8b9c0d1'
down_revision: Union[str, None] = 'd5e6f7a8b9c0'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'dedup_pairs',
        sa.Column('id', sa.dialects.postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('event_a_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('scraped_events.id', ondelete='CASCADE'), nullable=False),
        sa.Column('event_b_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('scraped_events.id', ondelete='CASCADE'), nullable=False),
        sa.Column('primary_event_id', sa.dialects.postgresql.UUID(as_uuid=True), sa.ForeignKey('scraped_events.id', ondelete='SET NULL'), nullable=True),
        sa.Column('status', sa.String(20), nullable=False, server_default='pending'),
        sa.Column('similarity_score', sa.Float(), nullable=False, server_default='0'),
        sa.Column('reasons', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.UniqueConstraint('event_a_id', 'event_b_id', name='uq_dedup_pair'),
    )
    op.create_index('ix_dedup_pairs_status', 'dedup_pairs', ['status'])
    op.create_index('ix_dedup_pairs_event_a_id', 'dedup_pairs', ['event_a_id'])
    op.create_index('ix_dedup_pairs_event_b_id', 'dedup_pairs', ['event_b_id'])


def downgrade() -> None:
    op.drop_index('ix_dedup_pairs_event_b_id', 'dedup_pairs')
    op.drop_index('ix_dedup_pairs_event_a_id', 'dedup_pairs')
    op.drop_index('ix_dedup_pairs_status', 'dedup_pairs')
    op.drop_table('dedup_pairs')
