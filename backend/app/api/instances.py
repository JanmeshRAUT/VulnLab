from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from app.models.instance import LaunchRequest, InstanceResponse, InstanceFlagSubmitRequest
from app.services.instance_service import create_instance, get_instance, heartbeat_instance, update_instance_status
from app.services.validation_service import submit_flag

router = APIRouter(prefix="/instances", tags=["instances"])

from app.core.database import get_database
from app.api.admin import normalize_lab_id, has_permission

@router.post("/launch", response_model=InstanceResponse)
async def launch(req: LaunchRequest, request: Request):
    user_id = request.session.get("user_id", "guest_user")
    if user_id == "guest_user":
        raise HTTPException(status_code=401, detail="Authentication required to launch labs")
        
    email = request.session.get("email", "").lower()
    role = request.session.get("role", "student")
    
    can_bypass = await has_permission(role, "Manage Labs")
    
    if not can_bypass:
        db = get_database()
        student_key = email if email else user_id.lower()
        normalized_lab = normalize_lab_id(req.lab_id)
        
        access_doc = await db.lab_access.find_one({
            "student_id": {"$in": [student_key, user_id.lower()]},
            "lab_id": normalized_lab
        })
        
        if not access_doc or access_doc.get("permission") != "Allowed":
            raise HTTPException(status_code=403, detail="You do not have permission to access this lab.")

    instance = await create_instance(user_id, req.lab_id, req.variant_id)
    return InstanceResponse(**instance)

@router.post("/{instance_id}/heartbeat")
async def heartbeat(instance_id: str):
    instance = await heartbeat_instance(instance_id)
    if not instance or instance.get("status") not in ["CREATED", "ACTIVE"]:
        raise HTTPException(status_code=404, detail="Instance not found, expired, or terminal")
    return {"status": "ok", "instance_status": instance.get("status")}

from pydantic import BaseModel

class EventRequest(BaseModel):
    type: str

@router.post("/{instance_id}/event")
async def handle_event(instance_id: str, req: EventRequest):
    if req.type == "abandon":
        await update_instance_status(instance_id, "ABANDONED")
    return {"status": "ok"}

class LegacyFlagSubmitRequest(BaseModel):
    flag: str
    instance_id: str

@router.post("/{instance_id}/submit-flag")
async def submit_instance_flag(instance_id: str, req: InstanceFlagSubmitRequest):
    success, message = await submit_flag(instance_id, req.objective_id, req.flag)
    if success:
        await update_instance_status(instance_id, "SOLVED")
        return {"success": True, "message": message}
    return JSONResponse(status_code=400, content={"success": False, "error": message})

@router.post("/submit_flag")
async def legacy_submit_flag(req: LegacyFlagSubmitRequest):
    instance_id = req.instance_id
    if not instance_id:
        return JSONResponse(status_code=400, content={"success": False, "error": "instance_id is required."})
    
    instance = await get_instance(instance_id)
    if not instance:
        return JSONResponse(status_code=404, content={"success": False, "error": "Instance not found."})

    records = instance.get("state", {}).get("flag_records", [])
    matching = [r for r in records if r.get("flag_value", "").strip() == req.flag.strip()]
    
    if len(matching) != 1:
        return JSONResponse(status_code=400, content={"success": False, "error": "Invalid flag."})

    success, message = await submit_flag(instance_id, matching[0].get("objective_id", ""), req.flag)
    if success:
        await update_instance_status(instance_id, "SOLVED")
        return {"success": True, "message": message}
    return JSONResponse(status_code=400, content={"success": False, "error": message})
