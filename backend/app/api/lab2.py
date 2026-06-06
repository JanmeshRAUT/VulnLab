from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import PlainTextResponse, JSONResponse, HTMLResponse
from pydantic import BaseModel
from app.api.deps import get_valid_instance
from app.services.validation_service import issue_flag_for_instance

router = APIRouter(prefix="/lab2", tags=["Lab 2"])

@router.get("/1/{variant}/navigate")
async def lab2_1_navigate(variant: str, path: str = "/", instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "2" or instance.get("variant_id") != variant:
        raise HTTPException(status_code=403, detail="Instance mismatch")
    
    path = path.strip("/")
    if "?" in path:
        path = path.split("?")[0]
        
    # Storefront logic
    if path == "" or path == "index.html":
        return JSONResponse({"type": "storefront", "data": {}})
    
    # robots.txt logic
    if path == "robots.txt":
        import os
        clean_variant = variant.replace('1', '')
        file_path = os.path.join(os.getcwd(), f"public/static/lab2/1/{clean_variant}/robots.txt")
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return PlainTextResponse(content)
        else:
            return PlainTextResponse("User-agent: *\nDisallow: /\n")
        
    # Admin panel logic
    admin_paths = {
        "1a": "tech_admin_console",
        "1b": "fashion_control_panel",
        "1c": "kitchen_admin_zone"
    }
    
    if path == admin_paths.get(variant):
        title = "Admin Panel"
        users = []
        if variant == "1a":
            title = "TechStore Admin Dashboard"
            users = [
                {"id": 1, "username": "admin", "role": "Super Admin"},
                {"id": 2, "username": "dev_test", "role": "Developer"}
            ]
        elif variant == "1b":
            title = "FashionHub Control Panel"
            users = [
                {"id": 101, "username": "chief_editor", "role": "Admin"},
                {"id": 102, "username": "content_creator", "role": "Editor"}
            ]
        elif variant == "1c":
            title = "FoodMart Kitchen Admin Zone"
            users = [
                {"id": 1001, "username": "kitchen_manager", "role": "Admin"},
                {"id": 1002, "username": "prep_cook", "role": "User"}
            ]
        return JSONResponse({
            "type": "admin_panel",
            "data": {
                "title": title,
                "users": users
            }
        })

    raise HTTPException(status_code=404, detail="Not Found")

@router.delete("/1/{variant}/admin/users/{user_id}")
async def lab2_1_delete_user(variant: str, user_id: int, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "2" or instance.get("variant_id") != variant:
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    try:
        variation_suffix = variant.replace('1', '').upper()
        record = await issue_flag_for_instance(instance['instance_id'], f'lab2:variation_{variation_suffix}')
        flag_value = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
        
        return JSONResponse({"success": True, "flag": flag_value})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/2/{variant}/navigate")
async def lab2_2_navigate(variant: str, path: str = "/", instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "2" or instance.get("variant_id") != variant:
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    path = path.strip("/")
    if "?" in path:
        path = path.split("?")[0]
    
    if path == "" or path == "index.html":
        import os
        clean_variant = variant.replace('2', '')
        file_path = os.path.join(os.getcwd(), f"public/static/lab2/2/{clean_variant}/index.html")
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            return HTMLResponse(content)
        else:
            return HTMLResponse(f"<html><body>Static storefront not found at {file_path}</body></html>")
            
    if path in ["admin-w98t57", "cms_admin_portal", "moderator_control_panel", "docs_sysadmin"]:
        from fastapi.responses import RedirectResponse
        slug = ""
        if variant == "2a":
            slug = "BlogHub"
        elif variant == "2b":
            slug = "ForumNext"
        elif variant == "2c":
            slug = "DevPortal"
        return RedirectResponse(url=f"/labs/broken-auth-hidden/{slug}/admin")
        
    if path == "admin":
        title = "Admin Panel"
        if variant == "2a":
            title = "BlogHub CMS Admin"
        elif variant == "2b":
            title = "ForumNext Mod Panel"
        elif variant == "2c":
            title = "DevPortal SysAdmin"
            
        users = [
            {"id": 1, "username": "admin", "role": "SuperAdmin"},
            {"id": 2, "username": "author", "role": "User"},
            {"id": 3, "username": "editor", "role": "Moderator"},
            {"id": 4, "username": "testuser", "role": "User"},
        ]
        return JSONResponse({
            "type": "admin_panel",
            "data": {
                "title": title,
                "users": users
            }
        })
        
    raise HTTPException(status_code=404, detail="Not Found")

@router.delete("/2/{variant}/admin/users/{user_id}")
async def lab2_2_delete_user(variant: str, user_id: int, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "2" or instance.get("variant_id") != variant:
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    try:
        variation_suffix = variant.replace('2', '').upper()
        record = await issue_flag_for_instance(instance['instance_id'], f'lab2:variation_{variation_suffix}')
        flag_value = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
        
        return JSONResponse({"success": True, "flag": flag_value})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/3/{variant}/navigate")
async def lab2_3_navigate(variant: str, request: Request, path: str = "/", instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "2" or instance.get("variant_id") != variant:
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    path = path.strip("/")
    if "?" in path:
        path = path.split("?")[0]
    
    if path == "" or path == "index.html":
        return JSONResponse({"type": "storefront", "data": {}})
        
    if path == "admin":
        role_cookie = request.cookies.get("role", "")
        if role_cookie.lower() == "admin":
            title = "Admin Panel"
            users = []
            if variant == "3a":
                title = "ShopEase Admin Dashboard"
                users = [
                    {"id": 1, "username": "admin", "role": "Super Admin"},
                    {"id": 2, "username": "testuser", "role": "User"}
                ]
            elif variant == "3b":
                title = "MarketPro Admin Console"
                users = [
                    {"id": 101, "username": "sysadmin", "role": "Administrator"},
                    {"id": 102, "username": "vendor_test", "role": "Vendor"}
                ]
            elif variant == "3c":
                title = "CartBuddy Settings"
                users = [
                    {"id": 1001, "username": "root", "role": "Admin"},
                    {"id": 1002, "username": "shopper12", "role": "Customer"}
                ]
            return JSONResponse({
                "type": "admin_panel",
                "data": {
                    "title": title,
                    "users": users
                }
            })
        else:
            raise HTTPException(status_code=403, detail=f"Admin privileges required. Current role: '{role_cookie}'")
            
    raise HTTPException(status_code=404, detail="Not Found")

@router.delete("/3/{variant}/admin/users/{user_id}")
async def lab2_3_delete_user(variant: str, user_id: int, request: Request, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "2" or instance.get("variant_id") != variant:
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    role_cookie = request.cookies.get("role", "")
    if role_cookie.lower() != "admin":
        raise HTTPException(status_code=403, detail="Admin privileges required.")
        
    try:
        variation_suffix = variant.replace('3', '').upper()
        record = await issue_flag_for_instance(instance['instance_id'], f'lab2:variation_{variation_suffix}')
        flag_value = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
        
        return JSONResponse({"success": True, "flag": flag_value})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/4/{variant}/login")
async def lab2_4_login(variant: str, req: LoginRequest, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "2" or instance.get("variant_id") != variant:
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    if req.username == "user" and req.password == "password123":
        return JSONResponse({"success": True, "session_token": "user_mock_token_881"})
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/4/{variant}/account")
async def lab2_4_account(variant: str, id: str, request: Request, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "2" or instance.get("variant_id") != variant:
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    session_cookie = request.cookies.get("session", "")
    if not session_cookie:
        raise HTTPException(status_code=401, detail="Unauthenticated")

    instance_id_short = instance['instance_id'][:8]
    targets = {
        "4a": f"admin_{instance_id_short}",
        "4b": f"admin_{instance_id_short}",
        "4c": f"admin_sys_{instance_id_short}"
    }
    
    target_id = targets.get(variant)
    
    if id == target_id:
        try:
            variation_suffix = variant.replace('4', '').upper()
            record = await issue_flag_for_instance(instance['instance_id'], f'lab2:variation_{variation_suffix}')
            flag_value = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
            
            return JSONResponse({
                "name": "System Administrator" if variant != "4a" else "Administrator",
                "email": f"admin@{variant}.local",
                "role": "admin",
                "api_key": flag_value
            })
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        return JSONResponse({
            "name": "Standard User",
            "email": "user@example.com",
            "role": "user",
            "api_key": None
        })

class Lab25LoginRequest(BaseModel):
    username: str
    password: str

@router.post("/5/{variant}/login")
async def lab2_5_login(variant: str, req: Lab25LoginRequest, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "2" or instance.get("variant_id") != variant:
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    if req.username in ["wiener", "peter"] and req.password == "peter":
        return JSONResponse({
            "access_token": f"student_token_{req.username}",
            "role": "student",
            "username": req.username
        })
        
    passwords = {
        "5a": "EduP0rtal88",
        "5b": "Ac4demyL1nk",
        "5c": "C4mpusS3cr3t"
    }
    admin_password = passwords.get(variant, "Admin7X9Q2")
    if req.username == "administrator" and req.password == admin_password:
        return JSONResponse({
            "access_token": "admin_token_secure",
            "role": "administrator",
            "username": "administrator"
        })
        
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/5/{variant}/profile")
async def lab2_5_profile(variant: str, id: str, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "2" or instance.get("variant_id") != variant:
        raise HTTPException(status_code=403, detail="Instance mismatch")

    passwords = {
        "5a": "EduP0rtal88",
        "5b": "Ac4demyL1nk",
        "5c": "C4mpusS3cr3t"
    }
    admin_password = passwords.get(variant, "Admin7X9Q2")
    is_admin = (id == "administrator")
    password_val = admin_password if is_admin else "peter"
    role_str = "administrator" if is_admin else "student"
    email = "admin@university.edu" if is_admin else f"{id}@university.edu"
    dept = "Administration / IT" if is_admin else "Computer Engineering"
    title_str = "Administrator" if is_admin else "Student"
    badge_str = "Super Admin" if is_admin else "Enrolled Student"
    char_str = "A" if is_admin else id[:1].upper()

    if variant == "5b": # AcademyLink (Light/Blue, Navbar)
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title_str} Profile | AcademyLink</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body {{ font-family: sans-serif; }}</style>
</head>
<body class="bg-[#F4F7FB] min-h-screen">
    <nav class="bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 lg:px-12 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <div class="flex items-center gap-8">
            <div class="font-extrabold text-blue-600 text-2xl tracking-tight">AcademyLink</div>
        </div>
        <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold">{char_str}</div>
            <div>
                <div class="text-sm font-bold capitalize">{id}</div>
                <div class="text-xs text-slate-500 capitalize">{role_str}</div>
            </div>
        </div>
    </nav>
    <div class="max-w-7xl mx-auto p-6 lg:p-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside class="md:col-span-1 space-y-2">
            <button onclick="history.back()" class="w-full text-left px-5 py-4 rounded-2xl font-bold transition-all bg-white hover:bg-slate-100 text-slate-600">Overview / Back</button>
            <div class="w-full px-5 py-4 rounded-2xl font-bold bg-blue-600 text-white shadow-lg shadow-blue-200">Profile Settings</div>
        </aside>
        <main class="md:col-span-3">
            <div class="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100">
                <h2 class="text-3xl font-black mb-6">{title_str} Profile Data</h2>
                </div><div class="grid grid-cols-2 gap-6">
                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</div>
                        <div class="text-lg font-bold text-slate-800">{email}</div>
                    </div>
                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Department</div>
                        <div class="text-lg font-bold text-slate-800">{dept}</div>
                    </div>
                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Role</div>
                        <div class="text-lg font-bold text-slate-800 capitalize">{role_str}</div>
                    </div>
                    <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Security Token</div>
                        <div class="text-lg font-bold text-slate-800">••••••••••</div>
                        <div class="hidden-password" style="display:none;">{password_val}</div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</body>
</html>"""
    elif variant == "5c": # CampusConnect (Dark Brutalist, Emerald)
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title_str} Data | CampusConnect</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>body {{ font-family: monospace; }}</style>
</head>
<body class="bg-zinc-950 text-zinc-300 min-h-screen flex selection:bg-emerald-500 selection:text-black">
    <aside class="w-72 border-r border-zinc-800 bg-zinc-900/30 flex flex-col shrink-0">
        <div class="p-6 border-b border-zinc-800">
            <div class="text-xl font-black text-emerald-400 tracking-tighter">CC_Enterprise</div>
            <div class="text-xs text-zinc-600 mt-1 uppercase">v2.0.4 // {role_str}</div>
        </div>
        <div class="p-4 flex-1 space-y-2">
            <button onclick="history.back()" class="w-full text-left px-4 py-3 text-sm uppercase tracking-widest hover:bg-zinc-900">Overview / Back</button>
            <div class="w-full px-4 py-3 text-sm uppercase tracking-widest bg-emerald-500 text-black font-black">My Profile</div>
        </div>
    </aside>
    <main class="flex-1 p-8 md:p-12 overflow-y-auto relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950">
        <h2 class="text-4xl font-black text-white uppercase tracking-tighter mb-10">Student Profile: {id}</h2>
        <div class="border border-zinc-800 bg-zinc-900/50 p-1"><div class="border border-zinc-800 bg-zinc-950 p-8 space-y-6">
            <div class="flex items-center gap-6 pb-6 border-b border-zinc-800">
                <div class="w-16 h-16 bg-emerald-500 text-black flex items-center justify-center font-black text-3xl uppercase">{char_str}</div>
                <div>
                    <div class="text-2xl font-bold text-emerald-400 uppercase">{id}</div>
                    <div class="text-xs text-zinc-500 tracking-widest uppercase">{badge_str}</div>
                </div>
            </div>
            </div><div class="grid grid-cols-2 gap-6">
                <div class="border border-zinc-800 p-4 bg-zinc-900/50">
                    <div class="text-zinc-500 text-xs uppercase mb-1">Email</div>
                    <div class="text-lg text-emerald-100">{email}</div>
                </div>
                <div class="border border-zinc-800 p-4 bg-zinc-900/50">
                    <div class="text-zinc-500 text-xs uppercase mb-1">Department</div>
                    <div class="text-lg text-emerald-100">{dept}</div>
                </div>
                <div class="border border-zinc-800 p-4 bg-zinc-900/50">
                    <div class="text-zinc-500 text-xs uppercase mb-1">Access Level</div>
                    <div class="text-lg text-emerald-100 capitalize">{role_str}</div>
                </div>
                <div class="border border-zinc-800 p-4 bg-zinc-900/50">
                    <div class="text-zinc-500 text-xs uppercase mb-1">Password</div>
                    <div class="text-lg text-emerald-100">********</div>
                    <div class="hidden-password" style="display:none;">{password_val}</div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>"""
    else: # 5a EduPortal
        html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title_str} Profile | EduPortal</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-[#F8FAFC] min-h-screen flex flex-col md:flex-row text-slate-800">
    <aside class="w-full md:w-72 bg-slate-900 text-slate-300 flex flex-col shadow-2xl z-20 shrink-0 min-h-screen relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none"></div>
        <div class="p-6 flex items-center gap-4 border-b border-slate-800">
            <div class="p-2.5 bg-indigo-500 rounded-xl text-white flex items-center justify-center w-11 h-11">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <div>
                <h1 class="font-extrabold text-white text-xl">EduPortal</h1>
                <span class="text-[10px] uppercase text-slate-400 font-black">{title_str} Portal</span>
            </div>
        </div>
        <div class="p-4 flex-1">
            <nav class="space-y-1.5">
                <button onclick="history.back()" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 text-slate-400 text-left">Overview / Back</button>
                <div class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white shadow-md">View My Profile</div>
            </nav>
        </div>
    </aside>
    <main class="flex-1 p-8 md:p-12 max-w-6xl mx-auto w-full">
        <header class="mb-10">
            <button onclick="history.back()" class="text-slate-500 font-bold text-sm mb-4">&lt; Back</button>
            <h2 class="text-3xl font-black text-slate-900 mb-2">User Profile</h2>
        </header>
        <div class="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8 md:p-12 w-full relative overflow-hidden">
            <div class="flex items-center gap-6 mb-10 pb-8 border-b border-slate-200">
                <div class="w-24 h-24 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-4xl font-bold uppercase">{char_str}</div>
                <div>
                    <h1 class="text-3xl font-extrabold text-slate-900 capitalize">{id}</h1>
                    <span class="inline-block mt-2 px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase rounded-full">{badge_str}</span>
                </div>
            </div>
            </div><div class="grid grid-cols-2 gap-6">
                <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Email</label>
                    <div class="text-slate-800 font-semibold text-lg">{email}</div>
                </div>
                <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Department</label>
                    <div class="text-slate-800 font-semibold text-lg">{dept}</div>
                </div>
                <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Role</label>
                    <div class="text-slate-800 font-semibold text-lg capitalize">{role_str}</div>
                </div>
                <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <label class="block text-xs font-bold uppercase text-slate-400 mb-1">Password</label>
                    <div class="text-slate-800 font-mono font-bold text-lg">••••••••</div>
                    <div class="hidden-password" style="display:none;">{password_val}</div>
                </div>
            </div>
        </div>
    </main>
</body>
</html>"""
    return HTMLResponse(content=html_content)

@router.get("/5/{variant}/admin/students")
async def lab2_5_get_students(variant: str, request: Request, instance: dict = Depends(get_valid_instance)):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer admin_token_secure"):
        raise HTTPException(status_code=403, detail="Unauthorized: Admin access required")
        
    students = [
        {"id": "1001", "name": "Carlos", "department": "Computer Science"},
        {"id": "1002", "name": "Wiener", "department": "Information Technology"},
        {"id": "1003", "name": "Peter", "department": "Electronics"},
        {"id": "1004", "name": "John", "department": "Mechanical Engineering"}
    ]
    return JSONResponse(students)

@router.delete("/5/{variant}/admin/students/{user_name}")
async def lab2_5_delete_student(variant: str, user_name: str, request: Request, instance: dict = Depends(get_valid_instance)):
    if instance.get("lab_id") != "2" or instance.get("variant_id") != variant:
        raise HTTPException(status_code=403, detail="Instance mismatch")
        
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer admin_token_secure"):
        raise HTTPException(status_code=403, detail="Unauthorized: Admin access required")
        
    if user_name.lower() == "carlos":
        try:
            record = await issue_flag_for_instance(instance['instance_id'], f'lab2:variation_{variant.upper()}')
            flag_value = record['flag_value'] if record else "FLAG{ERROR_GENERATING_FLAG}"
            return JSONResponse({"success": True, "message": "Student deleted successfully", "flag": flag_value})
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
            
    return JSONResponse({"success": True, "message": "Student deleted successfully"})