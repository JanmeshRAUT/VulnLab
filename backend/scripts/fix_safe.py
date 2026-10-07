import re
with open('backend/app/api/admin.py', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(
    r'async def safe_find.*?except Exception:\n\s+return \[\]',
    '''import logging\nlogger = logging.getLogger(__name__)\n\nasync def safe_find(collection_name: str, query: dict | None = None, sort: list | None = None) -> list[dict]:\n    db = get_database()\n    try:\n        cursor = db[collection_name].find(query or {})\n        if sort:\n            cursor = cursor.sort(sort)\n        docs = await cursor.to_list(length=None)\n        for doc in docs:\n            if "_id" in doc:\n                doc["_id"] = str(doc["_id"])\n        return docs\n    except Exception as e:\n        logger.error(f"Error in safe_find for {collection_name}: {e}")\n        raise''',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'async def safe_upsert.*?except Exception:\n\s+return',
    '''async def safe_upsert(collection_name: str, filter_query: dict, update_fields: dict) -> None:\n    db = get_database()\n    try:\n        await db[collection_name].update_one(filter_query, {"$set": update_fields}, upsert=True)\n    except Exception as e:\n        logger.error(f"Error in safe_upsert for {collection_name}: {e}")\n        raise''',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'async def safe_insert.*?except Exception:\n\s+return',
    '''async def safe_insert(collection_name: str, document: dict) -> None:\n    db = get_database()\n    try:\n        await db[collection_name].insert_one(document)\n    except Exception as e:\n        logger.error(f"Error in safe_insert for {collection_name}: {e}")\n        if collection_name == "audit_logs":\n            from fastapi import HTTPException\n            raise HTTPException(status_code=500, detail="Failed to write audit log")\n        raise''',
    content,
    flags=re.DOTALL
)

with open('backend/app/api/admin.py', 'w', encoding='utf-8') as f:
    f.write(content)
