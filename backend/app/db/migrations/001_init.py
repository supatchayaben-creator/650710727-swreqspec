from __future__ import annotations

from sqlalchemy import inspect

from app.db.models import Base
from app.db.session import engine


def upgrade(engine_instance):
    """รองรับ CON-TECH-01, DOM-PDPA-01 และ IF-HIS-01"""
    Base.metadata.create_all(bind=engine_instance)


# Compatibility hook for migration-style usage in tests.
upgrade(engine)


def has_tables():
    inspector = inspect(engine)
    return set(inspector.get_table_names())
