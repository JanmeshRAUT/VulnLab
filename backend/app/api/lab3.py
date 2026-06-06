from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
from app.services.instance_service import get_instance

router = APIRouter(prefix="/lab3", tags=["lab3"])

async def get_valid_instance(request: Request):
    instance_id = request.headers.get("X-Variant-Session-ID")
    if not instance_id:
        raise HTTPException(status_code=401, detail="Missing instance ID")
    instance = await get_instance(instance_id)
    if not instance or instance.get("status") not in ["CREATED", "ACTIVE"]:
        raise HTTPException(status_code=404, detail="Instance not found or expired")
    return instance

class Lab31LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/1/{variant}/login")
async def lab3_1_login(variant: str, req: Lab31LoginRequest, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "3" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    state = instance.get("state", {})
    target_username = state.get("target_username", "admin")
    target_password = state.get("target_password", "password123")
    
    if req.username == target_username:
        if req.password == target_password:
            return JSONResponse({
                "access_token": f"student_token_{req.username}",
                "role": "student",
                "username": req.username
            })
        else:
            raise HTTPException(status_code=401, detail="Invalid password")
    else:
        raise HTTPException(status_code=401, detail="Invalid Username and Password")

@router.get("/1/{variant}/profile")
async def lab3_1_profile(variant: str, id: str, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "3" or instance.get("variant_id") != f"1{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    state = instance.get("state", {})
    target_username = state.get("target_username", "admin")
    
    if id != target_username:
        raise HTTPException(status_code=403, detail="Not authorized to view this profile")
        
    flag = state.get("lab_flag", "FLAG{TEST}")
    
    return JSONResponse({
        "username": id,
        "email": f"{id}@university.edu",
        "department": "Computer Science",
        "role": "student",
        "flag": flag
    })
