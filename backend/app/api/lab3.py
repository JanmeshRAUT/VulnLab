from fastapi import APIRouter, HTTPException, Depends, Request
import random
from fastapi.responses import JSONResponse, HTMLResponse
from pydantic import BaseModel
from typing import Optional
from app.services.instance_service import get_instance
from app.services.validation_service import issue_flag_for_instance

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
        
    try:
        variant_suffix = variant.upper()
        record = await issue_flag_for_instance(instance['instance_id'], f'lab3:variation_{variant_suffix}')
        flag_value = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return JSONResponse({
        "username": id,
        "email": f"{id}@university.edu",
        "department": "Computer Science",
        "role": "student",
        "flag": flag_value
    })

class Lab32LoginRequest(BaseModel):
    username: str
    password: str

class Lab32VerifyRequest(BaseModel):
    mfa_code: str

lab3_2_otps = {}

@router.post("/2/{variant}/login")
async def lab3_2_login(variant: str, req: Lab32LoginRequest, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "3" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    if req.username == "wiener" and req.password == "peter":
        lab3_2_otps[instance['instance_id']] = str(random.randint(1000, 9999))
        return JSONResponse({
            "session_token": f"partial_session_wiener_{instance['instance_id']}",
            "requires_mfa": True
        })
    elif req.username == "carlos" and req.password == "montoya":
        lab3_2_otps[instance['instance_id']] = str(random.randint(1000, 9999))
        return JSONResponse({
            "session_token": f"partial_session_carlos_{instance['instance_id']}",
            "requires_mfa": True
        })
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")

@router.get("/2/{variant}/email")
async def lab3_2_email(variant: str, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "3" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
    
    # Wiener's email inbox
    otp = lab3_2_otps.get(instance['instance_id'], "1337")
    return JSONResponse({
        "emails": [
            {
                "from": f"security@{variant}.local",
                "to": "wiener@exploit-server.local",
                "subject": "Your 2FA Verification Code",
                "body": f"Your verification code is: {otp}. Do not share this with anyone."
            }
        ]
    })

@router.post("/2/{variant}/verify-mfa")
async def lab3_2_verify(variant: str, req: Lab32VerifyRequest, request: Request, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "3" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")
        
    token = auth_header.split(" ")[1]
    
    expected_otp = lab3_2_otps.get(instance['instance_id'], "1337")
    if "partial_session_wiener" in token and req.mfa_code == expected_otp:
        return JSONResponse({
            "success": True,
            "session_token": f"full_session_wiener_{instance['instance_id']}"
        })
    
    raise HTTPException(status_code=400, detail="Invalid verification code")

@router.get("/2/{variant}/my-account")
async def lab3_2_account(variant: str, request: Request, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "3" or instance.get("variant_id") != f"2{variant}":
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthenticated")
        
    token = auth_header.split(" ")[1]
    
    # Vulnerability: We do not check if the token is partial or full.
    username = ""
    if "wiener" in token:
        username = "wiener"
    elif "carlos" in token:
        username = "carlos"
    else:
        raise HTTPException(status_code=401, detail="Invalid token")
        
    flag_value = None
    if username == "carlos":
        try:
            variant_suffix = variant.upper()
            record = await issue_flag_for_instance(instance['instance_id'], f'lab3:variation_{variant_suffix}')
            flag_value = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
            
    return JSONResponse({
        "username": username,
        "email": f"{username}@example.com",
        "flag": flag_value
    })
