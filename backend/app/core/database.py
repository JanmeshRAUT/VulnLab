from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
import certifi

client = AsyncIOMotorClient(settings.MONGO_URI, tlsCAFile=certifi.where())
db = client[settings.MONGO_DB]

def get_database():
    return db
