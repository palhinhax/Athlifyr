"""add gpx fields to scraped_variants

Revision ID: d5e6f7a8b9c0
Revises: c4d5e6f7a8b9
Create Date: 2026-03-25 22:40:00.000000
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'd5e6f7a8b9c0'
down_revision: Union[str, None] = 'c4d5e6f7a8b9'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('scraped_variants', sa.Column('gpx_url', sa.Text(), nullable=True))
    op.add_column('scraped_variants', sa.Column('gpx_file_path', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('scraped_variants', 'gpx_file_path')
    op.drop_column('scraped_variants', 'gpx_url')
