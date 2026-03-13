import redis as redis_lib
from app.core.config import settings

redis_client = redis_lib.from_url(settings.redis_url, decode_responses=True)
