import os
import hashlib
from fastapi import APIRouter, Request, HTTPException, Form, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel

router = APIRouter(prefix="/api/lab8", tags=["Lab 8"])

def get_or_generate_flag(identity_key: str, lab_id: str, variation: str = 'default'):
    secret_key = os.environ.get('SECRET_KEY', 'default_vulnerable_key_replace_in_prod')
    seed_string = f"{identity_key}-{lab_id}-{variation}-{secret_key}"
    short_hash = hashlib.sha256(seed_string.encode()).hexdigest()[:12]
    prefix = lab_id.split('_')[0]
    return f"FLAG{{{prefix}_{variation}_{short_hash}}}"

def get_random_flag(request: Request, lab_id: str, variation: str = 'default'):
    identity_key = request.session.get('user_id')
    if not identity_key:
        identity_key = request.headers.get('X-SSRF-Researcher-GUID')
        
    if not identity_key:
        if variation == 'variation_A': return "FLAG{xss_reflected_alpha}"
        if variation == 'variation_B': return "FLAG{xss_reflected_beta}"
        if variation == 'variation_C': return "FLAG{xss_reflected_gamma}"
        if variation == 'variation_D': return "FLAG{xss_reflected_delta}"
        if variation == 'variation_E': return "FLAG{xss_reflected_epsilon}"
        if variation == 'lab8_2': return "FLAG{xss_stored_profile}"
        return "FLAG{unauthenticated_research_lock}"
        
    issued_flag = get_or_generate_flag(identity_key, lab_id, variation)
    
    lab_flags = request.session.get('lab_flags', {})
    lab_issued = list(lab_flags.get(lab_id, []))
    if issued_flag not in lab_issued:
        lab_issued.append(issued_flag)
    if len(lab_issued) > 25:
        lab_issued = lab_issued[-25:]
    lab_flags[lab_id] = lab_issued
    request.session['lab_flags'] = lab_flags
    
    return issued_flag

def check_xss_payload(user_input: str, variant: str) -> bool:
    if not user_input:
        return False
    normalized_input = user_input.lower()
    variant_normalized = (variant or '').strip().upper()

    xss_patterns = [
        '<script', 'onerror=', 'onload=', 'onclick=', 'javascript:', '"; fetch', "'; fetch"
    ]

    if variant_normalized == 'C':
        xss_patterns.extend([
            '"; alert', "'; alert", '";prompt', "';prompt", '";confirm', "';confirm",
        ])

    return any(pattern in normalized_input for pattern in xss_patterns)


@router.get("/xss-success")
async def xss_success(request: Request, variant: str = ""):
    variant_normalized = variant.strip().upper()
    variant_map = {
        'A': 'variation_A', 'B': 'variation_B', 'C': 'variation_C',
        'D': 'variation_D', 'E': 'variation_E',
    }
    mapped_variation = variant_map.get(variant_normalized)
    if not mapped_variation:
        raise HTTPException(status_code=400, detail="Invalid variant")
        
    flag = get_random_flag(request, 'lab8', mapped_variation)
    return JSONResponse({'success': True, 'flag': flag})


# -------------------------
# LAB 8.1: Reflected XSS
# -------------------------
# In a true frontend/backend separation, the frontend reflects the XSS.
# But for payload detection via the backend API:

class PayloadRequest(BaseModel):
    payload: str
    variant: str

@router.post("/1/detect")
async def lab8_1_detect(request: Request, body: PayloadRequest):
    payload = body.payload.strip()
    variant = body.variant.strip().upper()
    
    if payload and check_xss_payload(payload, variant):
        variant_map = {'A': 'variation_A', 'B': 'variation_B', 'C': 'variation_C', 'D': 'variation_D', 'E': 'variation_E'}
        mapped_variation = variant_map.get(variant, 'variation_A')
        return JSONResponse({'payload_detected': True, 'flag': get_random_flag(request, 'lab8', variation=mapped_variation), 'reflected': payload})
    return JSONResponse({'payload_detected': False, 'flag': None, 'reflected': payload})


# -------------------------
# LAB 8.2: Stored XSS (Profile)
# -------------------------
class ProfileUpdate(BaseModel):
    full_name: str
    email: str
    address: str
    bio: str

@router.get("/2/profile")
async def lab8_2_get_profile(request: Request):
    if 'lab8_2_profile' not in request.session:
        request.session['lab8_2_profile'] = {
            'full_name': 'Joan Smith',
            'email': 'joan.smith@techfusion.corp',
            'address': '123 Cyber Lane, Tech City',
            'bio': 'Senior Analyst at TechFusion Dynamics. Love hiking and coding.'
        }
    
    user_data = request.session['lab8_2_profile']
    
    # Check for Stored XSS Flag condition on read
    flag = None
    for key in ['full_name', 'address', 'email', 'bio']:
        val = user_data.get(key, '')
        if val and ('<script>' in val.lower() or '%3cscript%3e' in val.lower()):
            flag = get_random_flag(request, 'lab8_2', 'lab8_2')
            break
            
    return JSONResponse({'profile': user_data, 'flag': flag})

@router.post("/2/profile")
async def lab8_2_update_profile(request: Request, body: ProfileUpdate):
    profile = request.session.get('lab8_2_profile', {}).copy()
    
    # VULNERABILITY: Storing input without sanitization
    profile['full_name'] = body.full_name
    profile['email'] = body.email
    profile['address'] = body.address
    profile['bio'] = body.bio
    
    request.session['lab8_2_profile'] = profile
    return JSONResponse({'success': True})
