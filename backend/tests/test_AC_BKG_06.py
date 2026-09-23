from sqlalchemy import inspect

from app.db.models import Base
from app.db.session import engine


def test_AC_BKG_06_booking_schema_and_audit_requirements():
    Base.metadata.create_all(bind=engine)

    inspector = inspect(engine)

    assert "slots" in inspector.get_table_names()
    assert "bookings" in inspector.get_table_names()
    assert "audit_logs" in inspector.get_table_names()

    booking_columns = {col["name"] for col in inspector.get_columns("bookings")}
    audit_columns = {col["name"] for col in inspector.get_columns("audit_logs")}

    assert "hn" in booking_columns
    assert "national_id" not in booking_columns
    assert {"actor_id", "action", "hn", "accessed_at"}.issubset(audit_columns)

    assert "slots" in Base.metadata.tables
    assert "audit_logs" in Base.metadata.tables
