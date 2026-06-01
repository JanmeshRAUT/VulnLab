from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

class MongoDB:
    client: AsyncIOMotorClient = None
    db = None

db_manager = MongoDB()

async def connect_to_mongo():
    db_manager.client = AsyncIOMotorClient(settings.MONGODB_URL)
    db_manager.db = db_manager.client.vulnlab # Use vulnlab database
    print("Connected to MongoDB")

async def close_mongo_connection():
    if db_manager.client is not None:
        db_manager.client.close()
        print("Closed MongoDB connection")

def get_db():
    """Dependency to get the database instance"""
    return db_manager.db
