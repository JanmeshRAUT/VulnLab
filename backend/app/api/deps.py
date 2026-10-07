from fastapi import Header, HTTPException, Query, Request, Depends
from app.services.instance_service import get_instance
from app.api.auth import get_current_user
from app.api.admin import has_permission

async def get_valid_instance(
    request: Request,
    x_instance_id: str = Header(None, alias="X-Variant-Session-ID"),
    instance_id: str = Query(None, description="Optional query parameter for direct links"),
    user: dict = Depends(get_current_user)
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
        
    # Check ownership
    user_id = str(user["_id"])
    if instance.get("user_id") != user_id:
        # Admin bypass check
        role = user.get("role", "student")
        can_bypass = await has_permission(role, "Manage Sessions")
        if not can_bypass:
            raise HTTPException(status_code=403, detail="You do not own this instance.")

    return instance
