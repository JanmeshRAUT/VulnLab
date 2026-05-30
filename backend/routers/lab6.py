import os
import hashlib
import subprocess
from fastapi import APIRouter, Request, HTTPException, Form
from fastapi.responses import PlainTextResponse

router = APIRouter(prefix="/api/lab6", tags=["Lab 6"])

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
        if variation == 'variation_A': return "FLAG{cmd_injection_alpha}"
        if variation == 'variation_B': return "FLAG{cmd_injection_beta}"
        if variation == 'variation_C': return "FLAG{cmd_injection_gamma}"
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

# -------------------------
# LAB 6.1: OS Command Injection via Stock Check
# -------------------------

# Variation A: MegaMart
@router.post("/1/check-stock")
async def lab6_1_check_stock(request: Request, productId: str = Form(""), storeId: str = Form("")):
    try:
        command = f"echo Stock check for product {productId} at store {storeId} && echo Units available: 42"
        result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True, timeout=5)
        output = result.strip()
        if 'whoami' in storeId.lower() or 'id' in storeId.lower():
            output = f"{output}\n{get_random_flag(request, 'lab6', variation='variation_A')}"
        return PlainTextResponse(output)
    except subprocess.TimeoutExpired:
        return PlainTextResponse("Error: Command timed out")
    except Exception as e:
        return PlainTextResponse(f"Error executing stock check: {str(e)}")

# Variation B: AutoParts Pro
@router.post("/1/b/check-stock")
async def lab6_1_b_check_stock(request: Request, productId: str = Form(""), locationId: str = Form("")):
    try:
        command = f"echo Warehouse query: SKU {productId} at location {locationId} && echo Inventory count: 156"
        result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True, timeout=5)
        output = result.strip()
        if 'whoami' in locationId.lower() or 'id' in locationId.lower():
            output = f"{output}\n{get_random_flag(request, 'lab6', variation='variation_B')}"
        return PlainTextResponse(output)
    except subprocess.TimeoutExpired:
        return PlainTextResponse("Error: Query timed out")
    except Exception as e:
        return PlainTextResponse(f"System error: {str(e)}")

# Variation C: PharmaCare
@router.post("/1/c/check-stock")
async def lab6_1_c_check_stock(request: Request, productId: str = Form(""), branchId: str = Form("")):
    try:
        command = f"echo Prescription verification: NDC {productId} at branch {branchId} && echo Stock level: 89 units"
        result = subprocess.check_output(command, shell=True, stderr=subprocess.STDOUT, text=True, timeout=5)
        output = result.strip()
        if 'whoami' in branchId.lower() or 'id' in branchId.lower():
            output = f"{output}\n{get_random_flag(request, 'lab6', variation='variation_C')}"
        return PlainTextResponse(output)
    except subprocess.TimeoutExpired:
        return PlainTextResponse("Error: Verification timeout")
    except Exception as e:
        return PlainTextResponse(f"Database error: {str(e)}")
