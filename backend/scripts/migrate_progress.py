import asyncio
import os
import sys
# Add parent dir to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_database

async def migrate():
    db = get_database()
    cursor = db.progress.find({})
    count = 0
    async for doc in cursor:
        updates = {}
        if "email" in doc and "user_id" not in doc:
            # Look up user by email
            user = await db.users.find_one({"email": doc["email"]})
            if user:
                updates["user_id"] = str(user["_id"])
            else:
                updates["user_id"] = doc["email"] # fallback
        if updates:
            await db.progress.update_one({"_id": doc["_id"]}, {"$set": updates})
            count += 1
    print(f"Migrated {count} progress documents.")

if __name__ == "__main__":
    asyncio.run(migrate())
