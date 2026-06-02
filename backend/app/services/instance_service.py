import time
import secrets
from app.core.database import get_database

INSTANCE_ACTIVE_TTL_SECONDS = 300
INSTANCE_TERMINAL_TTL_SECONDS = 300

def _new_instance_id() -> str:
    return secrets.token_urlsafe(24)

def _compute_expiry(now_ts: float, ttl_seconds: int) -> float:
    return now_ts + float(ttl_seconds)

def _new_flag_value() -> str:
    return f"FLAG{{{secrets.token_hex(6).upper()}}}"

async def create_instance(user_id: str, lab_id: str, variant_id: str):
    db = get_database()
    now = time.time()
    instance_id = _new_instance_id()
    
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
        'state': {},
    }
    await db.instances.insert_one(doc)
    return doc

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
