import asyncio
import logging
import os
import sys

# Add parent dir to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import get_database

logger = logging.getLogger("migrate_progress")


async def migrate(db=None):
    if db is None:
        db = get_database()

    # 1. Backfill user_id from email where user_id is missing or null
    cursor = db.progress.find({"$or": [{"user_id": None}, {"user_id": {"$exists": False}}, {"user_id": ""}]})
    migrated_count = 0
    async for doc in cursor:
        email = doc.get("email")
        user_id = None
        if email:
            user = await db.users.find_one({"email": email})
            if user:
                user_id = str(user["_id"])
            else:
                user_id = email
        else:
            user_id = f"legacy_{doc['_id']}"

        await db.progress.update_one({"_id": doc["_id"]}, {"$set": {"user_id": user_id}})
        migrated_count += 1

    if migrated_count:
        logger.info(f"Backfilled user_id for {migrated_count} legacy progress records.")

    # 2. Deduplicate progress documents by (user_id, lab_id, variant_id)
    pipeline = [
        {
            "$group": {
                "_id": {"user_id": "$user_id", "lab_id": "$lab_id", "variant_id": "$variant_id"},
                "docs": {
                    "$push": {
                        "_id": "$_id",
                        "is_solved": "$is_solved",
                        "updated_at": "$updated_at",
                    }
                },
                "count": {"$sum": 1},
            }
        },
        {"$match": {"count": {"$gt": 1}}},
    ]
    dedupe_cursor = db.progress.aggregate(pipeline)
    total_deduped = 0
    async for group in dedupe_cursor:
        docs = group.get("docs", [])
        # Sort so that solved docs come first, then most recently updated
        sorted_docs = sorted(
            docs,
            key=lambda d: (1 if d.get("is_solved") else 0, float(d.get("updated_at") or 0)),
            reverse=True,
        )
        # Keep the best record, remove the duplicates
        to_remove = [d["_id"] for d in sorted_docs[1:]]
        if to_remove:
            res = await db.progress.delete_many({"_id": {"$in": to_remove}})
            total_deduped += res.deleted_count

    if total_deduped:
        logger.info(f"Deduplicated {total_deduped} duplicate progress documents.")

    return {"migrated": migrated_count, "deduped": total_deduped}


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(migrate())
