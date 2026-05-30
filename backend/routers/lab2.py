from fastapi import APIRouter, Request, Response, HTTPException
from fastapi.responses import PlainTextResponse, JSONResponse, HTMLResponse, RedirectResponse
import os

router = APIRouter(
    prefix="/api/lab2",
    tags=["lab2"]
)

# Lab 2.1: Admin Panel Discovery
# Variants: 'a' (GadgetShop), 'b' (BookStore), 'c' (TechZone)
# The frontend Faux Browser will call these endpoints to simulate server responses.

VARIANTS_CONFIG = {
    "a": {
        "admin_path": "/tech_admin_console",
        "admin_data": {
            "title": "TechStore Admin Dashboard",
            "users": [
                {"id": 1, "username": "admin", "role": "Super Admin"},
                {"id": 2, "username": "dev_test", "role": "Developer"}
            ],
            "flag": "FLAG{SECURITY_BY_OBSCURITY_FAILS}"
        }
    },
    "b": {
        "admin_path": "/fashion_control_panel",
        "admin_data": {
            "title": "FashionHub Control Panel",
            "inventory_controls": "UNLOCKED",
            "users": [
                {"id": 101, "username": "chief_editor", "role": "Admin"},
                {"id": 102, "username": "content_creator", "role": "Editor"}
            ],
            "flag": "FLAG{ROBOTS_TXT_IS_NOT_FOR_SECRETS}"
        }
    },
    "c": {
        "admin_path": "/kitchen_admin_zone",
        "admin_data": {
            "title": "FoodMart Kitchen Admin Zone",
            "server_status": "Vulnerable",
            "users": [
                {"id": 901, "username": "sysadmin", "role": "Super Admin"},
                {"id": 902, "username": "manager", "role": "Store Admin"}
            ],
            "flag": "FLAG{ADMIN_PANEL_DISCOVERED_EASILY}"
        }
    }
}

LAB2_2_VARIANTS_CONFIG = {
    "a": {
        "admin_path": "/cms_admin_portal",
        "admin_data": {
            "title": "BlogHub CMS Admin",
            "users": [
                {"id": 1, "username": "editor_alice", "role": "Editor"},
                {"id": 2, "username": "author_bob", "role": "Author"},
            ],
            "flag": "FLAG{HTML_COMMENTS_LEAK_PATHS}"
        }
    },
    "b": {
        "admin_path": "/moderator_control_panel",
        "admin_data": {
            "title": "ForumNext Mod Panel",
            "users": [
                {"id": 1, "username": "mod_charlie", "role": "Moderator"},
                {"id": 2, "username": "admin_dave", "role": "Super Admin"},
            ],
            "flag": "FLAG{JS_BUNDLES_REVEAL_ADMIN_ROUTES}"
        }
    },
    "c": {
        "admin_path": "/docs_sysadmin",
        "admin_data": {
            "title": "DevPortal SysAdmin",
            "users": [
                {"id": 1, "username": "sys_eve", "role": "System Admin"},
                {"id": 2, "username": "dev_frank", "role": "Developer"},
            ],
            "flag": "FLAG{SOURCE_CODE_DISCLOSES_ENDPOINTS}"
        }
    }
}

LAB2_3_VARIANTS_CONFIG = {
    "a": {
        "admin_data": {
            "title": "ShopEase Admin Dashboard",
            "users": [
                {"id": 1, "username": "admin", "role": "Super Admin"},
                {"id": 2, "username": "customer_support", "role": "Staff"}
            ],
            "flag": "FLAG{COOKIE_MODIFICATION_ELEVATION}"
        }
    },
    "b": {
        "admin_data": {
            "title": "MarketPro Admin Panel",
            "users": [
                {"id": 1, "username": "sys_admin", "role": "Admin"},
                {"id": 2, "username": "content_mod", "role": "Moderator"}
            ],
            "flag": "FLAG{INSECURE_CLIENT_SIDE_AUTHORIZATION}"
        }
    },
    "c": {
        "admin_data": {
            "title": "CartBuddy Operations",
            "users": [
                {"id": 1, "username": "root", "role": "Super Admin"},
                {"id": 2, "username": "sales", "role": "Sales"}
            ],
            "flag": "FLAG{UNSIGNED_COOKIES_ARE_UNSAFE}"
        }
    }
}

@router.get("/1/{variant}/navigate")
async def lab2_1_navigate(variant: str, path: str = "/"):
    """
    Simulates navigating a web server for Lab 2.1.
    The Faux Browser sends the requested path.
    """
    if variant not in VARIANTS_CONFIG:
        raise HTTPException(status_code=404, detail="Variant not found")
        
    config = VARIANTS_CONFIG[variant]
    
    # Clean the path
    path = path.strip()
    if not path.startswith("/"):
        path = "/" + path

    if path == "/robots.txt":
        file_path = os.path.join(os.getcwd(), f"public/static/lab2/1/{variant}/robots.txt")
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return PlainTextResponse(content)
        else:
            return PlainTextResponse("User-agent: *\nDisallow: /")
        
    if path == config["admin_path"]:
        # The vulnerability: No authentication check!
        return JSONResponse({
            "status": 200,
            "type": "admin_panel",
            "data": config["admin_data"]
        })
        
    if path == "/" or path == "/index.html":
        return JSONResponse({
            "status": 200,
            "type": "storefront",
            "message": "Welcome to the public storefront."
        })
        
    # Catch-all for not found
    return JSONResponse(status_code=404, content={
        "status": 404,
        "type": "error",
        "message": f"404 Not Found: {path}"
    })

@router.delete("/1/{variant}/admin/users/{user_id}")
async def lab2_1_delete_user(variant: str, user_id: int):
    """
    Simulates a destructive action in the unauthenticated admin panel.
    Solving this action yields the flag.
    """
    if variant not in VARIANTS_CONFIG:
        raise HTTPException(status_code=404, detail="Variant not found")
        
    config = VARIANTS_CONFIG[variant]
    
    # Vulnerability: No Authentication or Authorization checks before deleting!
    
    return JSONResponse({
        "success": True,
        "message": f"User {user_id} deleted successfully.",
        "flag": config["admin_data"]["flag"]
    })

# ==========================================
# Lab 2.2: Hidden Links (Source Code / JS Comments)
# ==========================================

@router.get("/2/{variant}/{path:path}")
async def lab2_2_navigate(variant: str, path: str):
    if variant not in LAB2_2_VARIANTS_CONFIG:
        raise HTTPException(status_code=404, detail="Variant not found")

    config = LAB2_2_VARIANTS_CONFIG[variant]

    # Clean the path
    clean_path = path.strip()
    if clean_path != "" and not clean_path.startswith('/'):
        clean_path = '/' + clean_path

    # If root or navigate
    if clean_path == "/" or clean_path == "" or clean_path == "/navigate":
        file_path = os.path.join(os.getcwd(), f"public/static/lab2/2/{variant}/index.html")
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return HTMLResponse(content)
        else:
            return HTMLResponse("<html><body>Static storefront not found.</body></html>")

    # If the user discovers the hidden HTML comment and navigates to the admin path
    if clean_path == config["admin_path"]:
        # Redirect back to the React Admin Panel interface!
        return RedirectResponse(url=f"http://localhost:5173/labs/2/sub2/{variant}/admin")

    # If the React frontend asks for the admin data
    if clean_path == "/admin":
        return JSONResponse({
            "type": "admin_panel",
            "data": config["admin_data"]
        })

    # Everything else is a 404
    return JSONResponse(status_code=404, content={"type": "error", "message": "Path not found"})

@router.delete("/2/{variant}/admin/users/{user_id}")
async def lab2_2_delete_user(variant: str, user_id: int):
    if variant not in LAB2_2_VARIANTS_CONFIG:
        raise HTTPException(status_code=404, detail="Variant not found")
        
    config = LAB2_2_VARIANTS_CONFIG[variant]
    
    return JSONResponse({
        "success": True, 
        "message": f"User {user_id} deleted successfully.",
        "flag": config["admin_data"]["flag"]
    })

# ==========================================
# Lab 2.3: Privilege Escalation (Insecure Cookies)
# ==========================================

@router.get("/3/{variant}/navigate")
async def lab2_3_navigate(variant: str, request: Request, path: str = "/"):
    if variant not in LAB2_3_VARIANTS_CONFIG:
        raise HTTPException(status_code=404, detail="Variant not found")

    config = LAB2_3_VARIANTS_CONFIG[variant]

    clean_path = path.strip()
    if clean_path != "" and not clean_path.startswith('/'):
        clean_path = '/' + clean_path

    if clean_path == "/" or clean_path == "" or clean_path == "/navigate":
        return JSONResponse({
            "status": 200,
            "type": "storefront",
            "message": "Welcome to the public storefront."
        })

    if clean_path == "/admin":
        role = request.cookies.get("role")
        if role == "admin":
            return JSONResponse({
                "type": "admin_panel",
                "data": config["admin_data"]
            })
        else:
            return JSONResponse(status_code=403, content={"type": "error", "message": f"Access Denied: Insufficient Privileges. Current role: {role}"})

    return JSONResponse(status_code=404, content={"type": "error", "message": "Path not found"})

@router.delete("/3/{variant}/admin/users/{user_id}")
async def lab2_3_delete_user(variant: str, user_id: int, request: Request):
    if variant not in LAB2_3_VARIANTS_CONFIG:
        raise HTTPException(status_code=404, detail="Variant not found")
        
    role = request.cookies.get("role")
    if role != "admin":
        raise HTTPException(status_code=403, detail="Access Denied")

    config = LAB2_3_VARIANTS_CONFIG[variant]
    
    return JSONResponse({
        "success": True, 
        "message": f"User {user_id} deleted successfully.",
        "flag": config["admin_data"]["flag"]
    })
