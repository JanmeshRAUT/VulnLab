from fastapi import APIRouter, HTTPException
from app.models.event import EventRequest
from app.services.instance_service import get_instance, update_instance_status

router = APIRouter(prefix="/events", tags=["events"])

@router.post("/{instance_id}")
async def handle_event(instance_id: str, req: EventRequest):
    instance = await get_instance(instance_id)
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found")
        
    event_type = req.type.strip().lower()
    
    if event_type == "abandon":
        await update_instance_status(instance_id, "ABANDONED")
        return {"status": "ok"}
    elif event_type == "solve":
        await update_instance_status(instance_id, "SOLVED")
        return {"status": "ok"}
    elif event_type == "expire":
        await update_instance_status(instance_id, "EXPIRED")
        return {"status": "ok"}
        
    return {"status": "ignored"}
