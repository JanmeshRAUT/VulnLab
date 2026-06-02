from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from app.models.instance import LaunchRequest, InstanceResponse, InstanceFlagSubmitRequest
from app.services.instance_service import create_instance, get_instance, heartbeat_instance, update_instance_status
from app.services.validation_service import submit_flag

router = APIRouter(prefix="/instances", tags=["instances"])

@router.post("/launch", response_model=InstanceResponse)
async def launch(req: LaunchRequest):
    user_id = "guest_user" # No auth for now
    instance = await create_instance(user_id, req.lab_id, req.variant_id)
    return InstanceResponse(**instance)

@router.post("/{instance_id}/heartbeat")
async def heartbeat(instance_id: str):
    instance = await heartbeat_instance(instance_id)
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found or terminal")
    return {"status": "ok", "instance_status": instance.get("status")}

from pydantic import BaseModel

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
