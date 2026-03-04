from sqlalchemy import create_engine, text
from app.core.config import settings
from app.db import models  # ensures models are registered

engine = create_engine(settings.database_url, pool_pre_ping=True)

def test_connection() -> int:
    with engine.connect() as conn:
        return conn.execute(text("SELECT 1")).scalar()
