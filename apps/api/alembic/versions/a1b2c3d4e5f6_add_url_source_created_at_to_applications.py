"""add url, source, created_at to applications

Revision ID: a1b2c3d4e5f6
Revises: 660386808bc3
Create Date: 2026-03-12 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '1812e22c308b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('applications', sa.Column('url', sa.String(length=2048), nullable=True))
    op.add_column('applications', sa.Column('source', sa.String(length=100), nullable=True))
    op.add_column(
        'applications',
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_column('applications', 'created_at')
    op.drop_column('applications', 'source')
    op.drop_column('applications', 'url')
