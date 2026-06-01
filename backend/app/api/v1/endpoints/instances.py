import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.models.instance import InstanceBase, InstanceResponse, LabState
from app.models.user import UserInDB
from app.core.dependencies import get_current_user
from app.db.mongodb import get_db
from app.labs.registry import registry
from app.services.flag_engine import verify_flag

router = APIRouter()

@router.post("/", status_code=202)
async def start_instance(
    lab_id: str, 
    current_user: UserInDB = Depends(get_current_user), 
    db = Depends(get_db)
):
    # Check if user already has an active instance
    existing = await db.instances.find_one({
        "user_id": current_user.id, 
        "status": {"$in": ["provisioning", "running"]}
    })
    if existing:
        raise HTTPException(status_code=400, detail="User already has an active instance")
        
    try:
        lab_module = registry.get_lab(lab_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Lab module not found")

    instance_id_str = f"inst_{uuid.uuid4().hex[:8]}"
    
    new_instance = {
        "instance_id": instance_id_str,
        "user_id": current_user.id,
        "lab_id": lab_id,
        "status": "provisioning"
    }
    
    res = await db.instances.insert_one(new_instance)
    
    # In a real app, we'd trigger a background task (e.g. Celery) here.
    # For now, we simulate sync provisioning
    conn_info = await lab_module.setup_instance(instance_id_str, str(current_user.id))
    
    await db.instances.update_one(
        {"_id": res.inserted_id},
        {"$set": {"status": "running", "connection_info": conn_info}}
    )
    
    # Initialize lab state
    await db.lab_states.insert_one({
        "instance_id": instance_id_str,
        "user_id": current_user.id,
        "lab_id": lab_id,
        "completed_objectives": [],
        "unlocked_hints": [],
        "attempts": {}
    })
    
    return {"message": "Instance started", "instance_id": instance_id_str, "connection_info": conn_info}

@router.post("/{instance_id}/flag")
async def submit_flag(
    instance_id: str,
    objective_id: str,
    flag: str,
    current_user: UserInDB = Depends(get_current_user),
    db = Depends(get_db)
):
    instance = await db.instances.find_one({"instance_id": instance_id, "user_id": current_user.id})
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found or not owned by user")
        
    if instance["status"] != "running":
        raise HTTPException(status_code=400, detail="Instance is not running")

    is_correct = verify_flag(instance_id, objective_id, flag)
    
    # Update attempts
    await db.lab_states.update_one(
        {"instance_id": instance_id},
        {"$inc": {f"attempts.{objective_id}": 1}}
    )
    
    if is_correct:
        await db.lab_states.update_one(
            {"instance_id": instance_id},
            {"$addToSet": {"completed_objectives": objective_id}}
        )
        return {"correct": True, "message": "Flag accepted!"}
    
    return {"correct": False, "message": "Incorrect flag"}
