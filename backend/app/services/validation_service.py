import time
from app.core.database import get_database

async def submit_flag(instance_id: str, objective_id: str, submitted_flag: str):
    db = get_database()
    instance = await db.instances.find_one({'instance_id': instance_id})
    if not instance:
        return False, "Instance not found."
    
    if instance.get("status") not in ["ACTIVE", "CREATED"]:
        return False, f"Instance is {instance.get('status')} and does not accept submissions."

    records = instance.get("state", {}).get("flag_records", [])
    record = next((item for item in records if item.get("objective_id") == objective_id), None)
    
    if not record:
        return False, "Objective not found for this instance."
    
    if record.get("solved_status"):
        return False, "Already solved."

    stored_flag = record.get("flag_value", "")
    if submitted_flag != stored_flag:
        return False, "Invalid flag."

    # Mark as solved
    now = time.time()
    await db.instances.update_one(
        {
            'instance_id': instance_id,
            'state.flag_records.flag_value': stored_flag
        },
        {
            '$set': {
                'state.flag_records.$.solved_status': True,
                'state.flag_records.$.solved_at': now,
            }
        }
    )
    
    # Track Progress
    user_id = instance.get('user_id')
    lab_id = instance.get('lab_id')
    variant_id = instance.get('variant_id', 'default')
    
    if user_id:
        await db.progress.update_one(
            {
                'email': user_id,
                'lab_id': lab_id,
                'variant_id': variant_id
            },
            {
                '$set': {
                    'is_solved': True,
                    'updated_at': now,
                    'completion_percentage': 100.0,
                    'schema_version': 1
                },
                '$inc': {
                    'attempts': 1
                },
                '$setOnInsert': {
                    'email': user_id,
                }
            },
            upsert=True
        )

    return True, "Correct!"

async def issue_flag_for_instance(instance_id: str, objective_id: str):
    db = get_database()
    from app.services.instance_service import _new_flag_value
    
    instance = await db.instances.find_one({'instance_id': instance_id})
    if not instance:
        return None

    existing_records = instance.get('state', {}).get('flag_records', [])
    for record in existing_records:
        if record.get('objective_id') == objective_id:
            return record

    flag_value = _new_flag_value()
    now = time.time()
    record = {
        'objective_id': objective_id,
        'flag_value': flag_value,
        'issued_at': now,
        'solved_status': False,
        'solved_at': None,
    }

    await db.instances.update_one(
        {
            'instance_id': instance_id,
        },
        {
            '$push': {'state.flag_records': record},
            '$addToSet': {'state.flags': flag_value},
        },
    )

    return record
