import time
import hmac
from app.core.database import get_database

async def submit_flag(instance_id: str, objective_id: str, submitted_flag: str):
    db = get_database()
    instance = await db.instances.find_one({'instance_id': instance_id})
    if not instance:
        return False, "Instance not found.", False
    
    if instance.get("status") not in ["ACTIVE", "CREATED"]:
        return False, f"Instance is {instance.get('status')} and does not accept submissions.", False

    records = instance.get("state", {}).get("flag_records", [])
    record = next((item for item in records if item.get("objective_id") == objective_id), None)
    
    if not record:
        return False, "Objective not found for this instance.", False
    
    if record.get("solved_status"):
        return False, "Already solved.", False

    stored_flag = record.get("flag_value", "")
    
    # Use hmac.compare_digest for constant-time comparison
    if not hmac.compare_digest(submitted_flag.encode("utf-8"), stored_flag.encode("utf-8")):
        # Log attempt (atomic push to state.attempts)
        await db.instances.update_one(
            {'instance_id': instance_id},
            {
                '$inc': {'state.failed_attempts': 1},
                '$push': {
                    'state.attempt_logs': {
                        'objective_id': objective_id,
                        'timestamp': time.time(),
                        'success': False
                    }
                }
            }
        )
        return False, "Invalid flag.", False

    now = time.time()
    
    # Atomic update to mark solved, preventing race conditions
    update_result = await db.instances.update_one(
        {
            'instance_id': instance_id,
            'state.flag_records': {
                '$elemMatch': {
                    'objective_id': objective_id,
                    'solved_status': False
                }
            }
        },
        {
            '$set': {
                'state.flag_records.$.solved_status': True,
                'state.flag_records.$.solved_at': now,
            },
            '$push': {
                'state.attempt_logs': {
                    'objective_id': objective_id,
                    'timestamp': now,
                    'success': True
                }
            }
        }
    )
    
    if update_result.modified_count == 0:
        return False, "Already solved or failed to update.", False
        
    # Re-fetch instance to check overall completion
    instance = await db.instances.find_one({'instance_id': instance_id})
    updated_records = instance.get("state", {}).get("flag_records", [])
    
    total_objectives = len(updated_records)
    solved_objectives = sum(1 for r in updated_records if r.get("solved_status"))
    
    all_solved = (total_objectives > 0 and solved_objectives == total_objectives)
    
    user_id = instance.get('user_id')
    user = await db.users.find_one({"_id": user_id}) if user_id else None
    email = user.get('email') if user else user_id
    
    lab_id = instance.get('lab_id')
    variant_id = instance.get('variant_id', 'default')
    
    if user_id:
        completion_percentage = (solved_objectives / total_objectives * 100) if total_objectives > 0 else 100.0
        
        await db.progress.update_one(
            {
                'user_id': user_id,
                'lab_id': lab_id,
                'variant_id': variant_id
            },
            {
                '$set': {
                    'is_solved': all_solved,
                    'updated_at': now,
                    'completion_percentage': completion_percentage,
                    'email': email,
                    'schema_version': 2
                },
                '$inc': {
                    'attempts': 1
                },
                '$setOnInsert': {
                    'user_id': user_id,
                    'lab_id': lab_id,
                    'variant_id': variant_id
                }
            },
            upsert=True
        )

    return True, "Correct!", all_solved

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
