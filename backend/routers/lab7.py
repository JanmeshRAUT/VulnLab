import os
from fastapi import APIRouter, Request, HTTPException, Form
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from .session_utils import get_or_generate_flag, get_variant_session_id, store_variant_flag

router = APIRouter(prefix="/api/lab7", tags=["Lab 7"])

def get_random_flag(request: Request, lab_id: str, variation: str = 'default'):
    identity_key = request.session.get('user_id') or request.headers.get('X-SSRF-Researcher-GUID')

    if not identity_key:
        if variation == 'variation_A': return "FLAG{sqli_auth_bypass_alpha}"
        if variation == 'variation_B': return "FLAG{sqli_auth_bypass_beta}"
        if variation == 'variation_C': return "FLAG{sqli_auth_bypass_gamma}"
        return "FLAG{unauthenticated_research_lock}"

    issued_flag = get_or_generate_flag(get_variant_session_id(request, lab_id, variation), lab_id, variation)
    store_variant_flag(request, lab_id, variation, issued_flag)

    return issued_flag

# -------------------------
# LAB 7.1: Virtual SQL Injection Protocol (Category Filter)
# -------------------------

@router.get("/1")
async def lab7_1(request: Request, category: str = ""):
    category = category.strip()
    all_products = [
        {'id': 1, 'name': 'Luxury Gift Box', 'category': 'Gifts', 'released': 1},
        {'id': 2, 'name': 'Personalized Mug', 'category': 'Gifts', 'released': 1},
        {'id': 3, 'name': 'Scented Candle Set', 'category': 'Lifestyle', 'released': 1},
        {'id': 4, 'name': 'Leather Wallet', 'category': 'Accessories', 'released': 1},
        {'id': 7, 'name': 'SECRET: Diamond Necklace', 'category': 'Gifts', 'released': 0},
        {'id': 8, 'name': 'SECRET: Gold Cufflinks', 'category': 'Accessories', 'released': 0}
    ]
    
    flag = None
    products = []
    normalized_category = category.upper().replace("+", " ")
    is_bypass = ("' OR" in normalized_category or "'OR" in normalized_category or "1=1" in normalized_category)
    
    if not category:
        products = [p for p in all_products if p['released'] == 1]
    elif is_bypass:
        products = all_products
        flag = get_random_flag(request, 'lab7', variation='variation_A')
    else:
        products = [p for p in all_products if p['category'].lower() == category.lower() and p['released'] == 1]
        
    return JSONResponse({'products': products, 'flag': flag, 'category': category})

@router.get("/1/b")
async def lab7_1_b(request: Request, category: str = ""):
    category = category.strip()
    all_products = [
        {'id': 11, 'name': 'Executive Briefcase', 'category': 'Work', 'released': 1},
        {'id': 12, 'name': 'Blue-Light Desk Lamp', 'category': 'Office', 'released': 1},
        {'id': 13, 'name': 'Remote Team Notebook', 'category': 'Stationery', 'released': 1},
        {'id': 14, 'name': 'Noise Shield Headset', 'category': 'Tech', 'released': 1},
        {'id': 17, 'name': 'SECRET: Boardroom Access Kit', 'category': 'Work', 'released': 0},
        {'id': 18, 'name': 'SECRET: Prototype AI Recorder', 'category': 'Tech', 'released': 0}
    ]
    
    flag = None
    products = []
    normalized_category = category.upper().replace("+", " ")
    is_bypass = ("' OR" in normalized_category or "'OR" in normalized_category or "1=1" in normalized_category)
    
    if not category:
        products = [p for p in all_products if p['released'] == 1]
    elif is_bypass:
        products = all_products
        flag = get_random_flag(request, 'lab7', variation='variation_B')
    else:
        products = [p for p in all_products if p['category'].lower() == category.lower() and p['released'] == 1]
        
    return JSONResponse({'products': products, 'flag': flag, 'category': category})

@router.get("/1/c")
async def lab7_1_c(request: Request, category: str = ""):
    category = category.strip()
    all_products = [
        {'id': 21, 'name': 'Thermal Trail Bottle', 'category': 'Adventure', 'released': 1},
        {'id': 22, 'name': 'Summit Camp Light', 'category': 'Camping', 'released': 1},
        {'id': 23, 'name': 'All-Terrain Daypack', 'category': 'Bags', 'released': 1},
        {'id': 24, 'name': 'Stormproof Shell Gloves', 'category': 'Apparel', 'released': 1},
        {'id': 27, 'name': 'SECRET: Glacier Beacon Mk II', 'category': 'Adventure', 'released': 0},
        {'id': 28, 'name': 'SECRET: Alpine Rescue Drone', 'category': 'Camping', 'released': 0}
    ]
    
    flag = None
    products = []
    normalized_category = category.upper().replace("+", " ")
    is_bypass = ("' OR" in normalized_category or "'OR" in normalized_category or "1=1" in normalized_category)
    
    if not category:
        products = [p for p in all_products if p['released'] == 1]
    elif is_bypass:
        products = all_products
        flag = get_random_flag(request, 'lab7', variation='variation_C')
    else:
        products = [p for p in all_products if p['category'].lower() == category.lower() and p['released'] == 1]
        
    return JSONResponse({'products': products, 'flag': flag, 'category': category})

# -------------------------
# LAB 7.2: Office Login System (SQLi Bypass)
# -------------------------
class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/2/login")
async def lab7_2_login(request: Request, body: LoginRequest):
    return process_lab7_2_login(request, body.username, body.password, 'variation_A', 'portal_users')

@router.post("/2/b/login")
async def lab7_2_b_login(request: Request, body: LoginRequest):
    return process_lab7_2_login(request, body.username, body.password, 'variation_B', 'staff_accounts')

@router.post("/2/c/login")
async def lab7_2_c_login(request: Request, body: LoginRequest):
    return process_lab7_2_login(request, body.username, body.password, 'variation_C', 'admin_registry')

def process_lab7_2_login(request: Request, username: str, password: str, variation: str, query_label: str):
    username = username.strip()
    normalized_username = username.upper().replace("+", " ")
    is_bypass = ("ADMINISTRATOR'--" in normalized_username or "ADMINISTRATOR' --" in normalized_username)
    
    query = f"SELECT id, username, role FROM {query_label} WHERE username = '{username}' AND password = '{password}'"
    
    if is_bypass:
        flag = get_random_flag(request, 'lab7', variation=variation)
        query = f"SELECT id, username, role FROM {query_label} WHERE username = 'administrator'--"
        return JSONResponse({
            'success': True,
            'user_info': {
                'employee_id': 'ADM-001',
                'username': 'administrator',
                'department': 'Executive Operations',
                'role': 'System Administrator',
                'email': 'administrator@internal.local'
            },
            'flag': flag,
            'query': query
        })
    else:
        return JSONResponse({
            'success': False,
            'error': 'Invalid credentials.',
            'query': query
        }, status_code=401)
