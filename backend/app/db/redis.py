import redis.asyncio as redis
from app.core.config import settings

class RedisClient:
    client: redis.Redis = None

redis_manager = RedisClient()

async def connect_to_redis():
    redis_manager.client = redis.from_url(settings.REDIS_URL, decode_responses=True)
    print("Connected to Redis")

async def close_redis_connection():
    if redis_manager.client is not None:
        await redis_manager.client.aclose()
        print("Closed Redis connection")

def get_redis():
    """Dependency to get the redis instance"""
    return redis_manager.client
