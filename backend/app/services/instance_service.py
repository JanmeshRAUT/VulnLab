import time
import secrets
import os
import shutil
from fastapi import HTTPException
from app.core.database import get_database

INSTANCE_ACTIVE_TTL_SECONDS = 300
INSTANCE_TERMINAL_TTL_SECONDS = 300
MAX_ACTIVE_INSTANCES_PER_USER = 3

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORDLISTS_DIR = os.path.join(BASE_DIR, "data", "wordlists")
UPLOADS_DIR = os.path.join(BASE_DIR, "data", "uploads")

try:
    with open(os.path.join(WORDLISTS_DIR, "usernames.txt"), "r") as f:
        USERNAMES = [line.strip() for line in f if line.strip()]
    with open(os.path.join(WORDLISTS_DIR, "passwords.txt"), "r") as f:
        PASSWORDS = [line.strip() for line in f if line.strip()]
except Exception:
    USERNAMES = ["admin"]
    PASSWORDS = ["password123"]

def _new_instance_id() -> str:
    return secrets.token_urlsafe(24)

def _compute_expiry(now_ts: float, ttl_seconds: int) -> float:
    return now_ts + float(ttl_seconds)

def _new_flag_value() -> str:
    return f"FLAG{{{secrets.token_hex(6).upper()}}}"

async def create_instance(user_id: str, lab_id: str, variant_id: str):
    db = get_database()
    now = time.time()
    
    # 1. Validate against catalog
    from app.services.catalog_service import get_all_labs
    labs = get_all_labs()
    lab_obj = next((l for l in labs if l.lab_id == lab_id), None)
    if not lab_obj:
        raise HTTPException(status_code=404, detail="Lab not found")
        
    variant_obj = next((v for v in lab_obj.variants if v.variant_id == variant_id), None)
    if not variant_obj:
        raise HTTPException(status_code=422, detail="Variant not found")

    # 2. Check for existing active instance for the same lab/variant
    existing_instance = await db.instances.find_one({
        'user_id': user_id,
        'lab_id': lab_id,
        'variant_id': variant_id,
        'status': {'$in': ['CREATED', 'ACTIVE']}
    })
    
    if existing_instance:
        # Extend expiry and return it
        await db.instances.update_one(
            {'_id': existing_instance['_id']},
            {'$set': {'expires_at': _compute_expiry(now, INSTANCE_ACTIVE_TTL_SECONDS), 'last_seen': now}}
        )
        existing_instance['expires_at'] = _compute_expiry(now, INSTANCE_ACTIVE_TTL_SECONDS)
        return existing_instance

    # 3. Enforce max instances
    active_count = await db.instances.count_documents({
        'user_id': user_id,
        'status': {'$in': ['CREATED', 'ACTIVE']}
    })
    
    if active_count >= MAX_ACTIVE_INSTANCES_PER_USER:
        raise HTTPException(status_code=429, detail=f"Maximum active instances ({MAX_ACTIVE_INSTANCES_PER_USER}) reached. Please abandon or solve an existing instance.")

    instance_id = _new_instance_id()
    
    state_data = {}
    if lab_id == "2" and variant_id.startswith("5"):
        import string
        chars = "".join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(5))
        state_data["admin_password"] = f"{chars}-Admin"
    elif lab_id == "3" and variant_id.startswith("1"):
        state_data["target_username"] = secrets.choice(USERNAMES)
        state_data["target_password"] = secrets.choice(PASSWORDS)

    doc = {
        'instance_id': instance_id,
        'user_id': user_id,
        'lab_id': lab_id,
        'variant_id': variant_id,
        'status': 'CREATED',
        'created_at': now,
        'started_at': None,
        'solved_at': None,
        'last_seen': now,
        'expires_at': _compute_expiry(now, INSTANCE_ACTIVE_TTL_SECONDS),
        'state': state_data,
    }
    await db.instances.insert_one(doc)
    return doc

async def update_instance_state(instance_id: str, new_state: dict):
    db = get_database()
    await db.instances.update_one(
        {'instance_id': instance_id},
        {'$set': {'state': new_state}}
    )
    return True

async def cleanup_expired_instances():
    db = get_database()
    now = time.time()
    
    import pymongo.errors
    try:
        lock_status = await db.locks.update_one(
            {
                "_id": "cleanup_worker",
                "$or": [
                    {"locked_until": {"$exists": False}},
                    {"locked_until": {"$lt": now}}
                ]
            },
            {"$set": {"locked_until": now + 50}},
            upsert=True
        )
        if lock_status.modified_count == 0 and lock_status.upserted_id is None:
            return False
    except pymongo.errors.DuplicateKeyError:
        return False

    # Mark active/created instances as expired if past TTL
    await db.instances.update_many(
        {
            'status': {'$in': ['CREATED', 'ACTIVE']},
            'expires_at': {'$lt': now}
        },
        {
            '$set': {
                'status': 'EXPIRED',
                'expires_at': now
            }
        }
    )
    
    # Find all EXPIRED, SOLVED, or ABANDONED instances that are past their TTL
    cursor = db.instances.find({
        'status': {'$in': ['EXPIRED', 'SOLVED', 'ABANDONED']},
        'expires_at': {'$lt': now}
    })
    
    to_delete_ids = []
    history_docs = []
    
    async for instance in cursor:
        to_delete_ids.append(instance["_id"])
        
        # 1. Save to session_history
        history_docs.append({
            "instance_id": instance["instance_id"],
            "user_id": instance.get("user_id"),
            "lab_id": instance.get("lab_id"),
            "variant_id": instance.get("variant_id"),
            "status": instance.get("status"),
            "created_at": instance.get("created_at"),
            "started_at": instance.get("started_at"),
            "solved_at": instance.get("solved_at"),
            "ended_at": now
        })
        
        # 2. Cleanup artifacts
        inst_upload_dir = os.path.join(UPLOADS_DIR, instance["instance_id"])
        if os.path.exists(inst_upload_dir):
            try:
                shutil.rmtree(inst_upload_dir)
            except Exception as e:
                print(f"Failed to remove artifacts for {instance['instance_id']}: {e}")
                
    if history_docs:
        await db.session_history.insert_many(history_docs)
        
    if to_delete_ids:
        await db.instances.delete_many({"_id": {"$in": to_delete_ids}})
    
    return True

async def get_instance(instance_id: str):
    db = get_database()
    return await db.instances.find_one({'instance_id': instance_id})

async def update_instance_status(instance_id: str, status: str):
    db = get_database()
    now = time.time()
    status = status.upper()

    update_fields = {
        'status': status,
        'last_seen': now,
    }

    if status == 'ACTIVE':
        update_fields['expires_at'] = _compute_expiry(now, INSTANCE_ACTIVE_TTL_SECONDS)
    elif status == 'SOLVED' or status == 'ABANDONED':
        update_fields['expires_at'] = _compute_expiry(now, INSTANCE_TERMINAL_TTL_SECONDS)
    elif status == 'EXPIRED':
        update_fields['expires_at'] = now

    await db.instances.update_one(
        {'instance_id': instance_id},
        {'$set': update_fields, '$setOnInsert': {'created_at': now}},
        upsert=False,
    )
    
    if status in {'ACTIVE', 'SOLVED', 'ABANDONED'}:
        await db.instances.update_one(
            {'instance_id': instance_id, 'started_at': None},
            {'$set': {'started_at': now}},
        )

    if status == 'SOLVED':
        await db.instances.update_one(
            {'instance_id': instance_id, 'solved_at': {'$exists': False}},
            {'$set': {'solved_at': now}},
        )

    return True

async def heartbeat_instance(instance_id: str):
    db = get_database()
    now = time.time()
    
    await db.instances.update_one(
        {
            'instance_id': instance_id,
            'status': {'$in': ['CREATED', 'ACTIVE']},
        },
        {
            '$set': {
                'last_seen': now,
                'expires_at': _compute_expiry(now, INSTANCE_ACTIVE_TTL_SECONDS),
            }
        },
    )

    await db.instances.update_one(
        {'instance_id': instance_id, 'status': 'CREATED'},
        {
            '$set': {
                'status': 'ACTIVE',
                'started_at': now,
                'last_seen': now,
                'expires_at': _compute_expiry(now, INSTANCE_ACTIVE_TTL_SECONDS),
            }
        },
    )

    return await db.instances.find_one({'instance_id': instance_id})
