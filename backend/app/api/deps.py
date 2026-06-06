from fastapi import Header, HTTPException, Query, Request
from app.services.instance_service import get_instance

async def get_valid_instance(
    x_instance_id: str = Header(None, alias="X-Variant-Session-ID"),
    instance_id: str = Query(None, description="Optional query parameter for direct links"),
    request: Request = None
):
    final_id = x_instance_id or instance_id
    if not final_id and request:
        final_id = request.cookies.get("instance_id")
        
    if not final_id:
        raise HTTPException(status_code=400, detail="Missing Instance ID (Header, Query, or Cookie)")
        
    instance = await get_instance(final_id)
    if not instance:
        raise HTTPException(status_code=404, detail="Instance not found")
        
    if instance.get("status") not in ["ACTIVE", "CREATED"]:
        raise HTTPException(status_code=403, detail=f"Instance is {instance.get('status')} and cannot be used.")
        
    return instance
