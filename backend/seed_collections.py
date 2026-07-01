import asyncio
import time
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

from app.core.config import settings

async def seed():
    client = AsyncIOMotorClient(settings.MONGO_URI, tlsCAFile=certifi.where())
    db = client[settings.MONGO_DB]
    
    timestamp = time.time()
    
    # Seed roles
    roles_data = [
        {
            "name": "superadmin",
            "description": "Super Administrator with all permissions",
            "permissions": [
                "Manage Users", "Manage Labs", "Manage Variants", "Manage Sessions",
                "View Reports", "Manage Students", "Create Labs", "Edit Labs",
                "Delete Labs", "Manage Roles", "Manage Access Control", "View Sessions",
                "Export Reports", "Platform Settings"
            ],
            "is_default": False,
            "updated_at": timestamp,
        },
        {
            "name": "admin",
            "description": "Administrator",
            "permissions": [
                "Manage Users", "Manage Students", "Manage Labs", "Manage Variants",
                "Manage Sessions", "Create Labs", "Edit Labs", "View Reports",
                "Manage Access Control", "View Sessions", "Export Reports"
            ],
            "is_default": False,
            "updated_at": timestamp,
        },
        {
            "name": "instructor",
            "description": "Instructor",
            "permissions": [
                "Manage Users", "Manage Students", "Manage Labs", "Manage Variants",
                "Manage Sessions", "Create Labs", "Edit Labs", "View Reports",
                "Manage Access Control", "View Sessions", "Export Reports"
            ],
            "is_default": False,
            "updated_at": timestamp,
        },
        {
            "name": "student",
            "description": "Student",
            "permissions": [],
            "is_default": True,
            "updated_at": timestamp,
        }
    ]
    
    print("Seeding roles...")
    for role in roles_data:
        await db.roles.update_one({"name": role["name"]}, {"$set": role}, upsert=True)
    
    # Seed lab_access dummy data to initialize the collection structure
    lab_access_data = {
        "student_id": "seed_user@example.com",
        "lab_id": "lab-dummy-01",
        "category": "General",
        "permission": "Allowed",
        "updated_at": timestamp,
    }
    
    print("Seeding lab_access collection...")
    await db.lab_access.update_one(
        {"student_id": lab_access_data["student_id"], "lab_id": lab_access_data["lab_id"]},
        {"$set": lab_access_data},
        upsert=True
    )
    
    print("Database seeding completed.")

if __name__ == "__main__":
    asyncio.run(seed())
