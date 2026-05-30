from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import mongodb_client

router = APIRouter(
    prefix="/api/instances",
    tags=["instances"]
)

class LaunchRequest(BaseModel):
    lab_id: str
    variant_id: str

class EventRequest(BaseModel):
    type: str  # 'abandon', 'solve', etc.


class InstanceFlagSubmitRequest(BaseModel):
    objective_id: str = Field(..., alias="objectiveId")
    flag: str

    class Config:
        populate_by_name = True


def current_user_identity(request: Request) -> str:
    return request.session.get("user_id") or request.session.get("email") or "guest"

@router.post("/launch")
async def launch_instance(req: LaunchRequest, request: Request):
    """Generate a new unique instance ID and mark it CREATED."""
    user_id = current_user_identity(request)
    
    instance = mongodb_client.create_instance(
        user_id=user_id,
        lab_id=req.lab_id,
        variant_id=req.variant_id
    )
    
    response = JSONResponse(content={
        "instance_id": instance["instance_id"],
        "status": instance["status"],
        "created_at": instance.get("created_at"),
        "started_at": instance.get("started_at"),
        "solved_at": instance.get("solved_at"),
        "last_seen": instance.get("last_seen"),
        "expires_at": instance.get("expires_at"),
    })
    response.set_cookie(key="instance_id", value=instance["instance_id"], httponly=True, samesite="lax")
    return response

@router.post("/{instance_id}/heartbeat")
async def heartbeat_instance(instance_id: str, request: Request):
    """Update last_seen for the instance. Transitions CREATED -> ACTIVE."""
    # Ensure it belongs to current user
    user_id = current_user_identity(request)
    instance = mongodb_client.get_instance(instance_id)
    
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found")
        
    if instance["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Instance does not belong to you")
        
    if instance["status"] in ["EXPIRED", "ABANDONED", "SOLVED"]:
        raise HTTPException(status_code=400, detail=f"Instance is already {instance['status']}")

    updated = mongodb_client.heartbeat_instance(instance_id)
    if not updated:
        raise HTTPException(status_code=400, detail="Instance is not heartbeat-eligible")
    return {
        "status": "ok",
        "instance_status": updated.get("status"),
        "last_seen": updated.get("last_seen"),
        "expires_at": updated.get("expires_at"),
    }

@router.post("/{instance_id}/event")
async def handle_instance_event(instance_id: str, req: EventRequest, request: Request):
    """Handle explicit events like tab close (abandon) or solve."""
    user_id = current_user_identity(request)
    instance = mongodb_client.get_instance(instance_id)
    
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found")
        
    if instance["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Instance does not belong to you")
        
    event_type = (req.type or "").strip().lower()

    if event_type == "abandon":
        if instance["status"] in ["EXPIRED", "SOLVED", "ABANDONED"]:
            return {"status": "ignored", "instance_status": instance["status"]}
        mongodb_client.update_instance_status(instance_id, "ABANDONED")
        return {"status": "ok", "instance_status": "ABANDONED"}

    if event_type == "solve":
        if instance["status"] in ["EXPIRED", "ABANDONED", "SOLVED"]:
            raise HTTPException(status_code=400, detail=f"Instance is already {instance['status']}")
        mongodb_client.update_instance_status(instance_id, "SOLVED")
        return {"status": "ok", "instance_status": "SOLVED"}

    if event_type == "expire":
        mongodb_client.update_instance_status(instance_id, "EXPIRED")
        return {"status": "ok", "instance_status": "EXPIRED"}
    
    return {"status": "ignored"}

class FlagSubmitRequest(BaseModel):
    flag: str
    instance_id: str


@router.post("/{instance_id}/submit-flag")
async def submit_flag_for_instance(instance_id: str, req: InstanceFlagSubmitRequest, request: Request):
    """Validate and submit a flag strictly within a requested ACTIVE instance."""
    user_id = current_user_identity(request)
    email = request.session.get("email") or request.session.get("user_id") or "guest@vulnlab.local"

    objective_id = (req.objective_id or "").strip()
    flag = (req.flag or "").strip()
    if not objective_id:
        return JSONResponse(status_code=400, content={"success": False, "error": "No objectiveId provided."})
    if not flag:
        return JSONResponse(status_code=400, content={"success": False, "error": "No flag provided."})

    mongodb_client.mark_expired_instances()

    instance = mongodb_client.get_instance(instance_id)
    if not instance:
        return JSONResponse(status_code=404, content={"success": False, "error": "Instance not found."})

    if instance.get("user_id") != user_id:
        return JSONResponse(status_code=403, content={"success": False, "error": "Instance does not belong to you."})

    if instance.get("status") != "ACTIVE":
        status = instance.get("status", "UNKNOWN")
        return JSONResponse(status_code=400, content={"success": False, "error": f"Instance is {status} and does not accept submissions."})

    record = next(
        (item for item in instance.get("state", {}).get("flag_records", []) if item.get("objective_id") == objective_id),
        None,
    )
    if not record:
        return JSONResponse(status_code=400, content={"success": False, "error": "Objective does not belong to this instance."})

    if record.get("solved_status"):
        return JSONResponse(status_code=409, content={"success": False, "error": "This objective is already solved for this instance."})

    stored_flag = (record.get("flag_value") or "").strip()
    if flag != stored_flag:
        return JSONResponse(status_code=400, content={"success": False, "error": "Invalid flag for this objective."})

    mongodb_client.submit_lab_progress(
        email,
        instance["lab_id"],
        objective_id,
        flag,
        True,
        instance_id=instance_id,
    )
    mongodb_client.mark_instance_flag_solved(instance_id, flag)
    mongodb_client.update_instance_status(instance_id, "SOLVED")
    return {"success": True, "message": f"Correct! Flag for Lab {instance['lab_id']} accepted."}

@router.post("/submit_flag")
async def submit_flag(req: FlagSubmitRequest, request: Request):
    """Legacy compatibility route: delegates to strict instance-bound endpoint semantics."""
    target_instance_id = (req.instance_id or "").strip()
    if not target_instance_id:
        return JSONResponse(status_code=400, content={"success": False, "error": "instance_id is required. Use /api/instances/{instance_id}/submit-flag."})

    # Intentionally do not perform global lookup: objective_id is inferred only within requested instance.
    instance = mongodb_client.get_instance(target_instance_id)
    if not instance:
        return JSONResponse(status_code=404, content={"success": False, "error": "Instance not found."})

    matching = [
        item for item in instance.get("state", {}).get("flag_records", [])
        if (item.get("flag_value") or "").strip() == (req.flag or "").strip()
    ]
    if len(matching) != 1:
        return JSONResponse(status_code=400, content={"success": False, "error": "Provide objectiveId and use /api/instances/{instance_id}/submit-flag."})

    strict_req = InstanceFlagSubmitRequest(objective_id=matching[0].get("objective_id", ""), flag=req.flag)
    return await submit_flag_for_instance(target_instance_id, strict_req, request)
