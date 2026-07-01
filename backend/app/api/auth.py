import os
from fastapi import APIRouter, Request, HTTPException, status
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from passlib.context import CryptContext
from datetime import datetime
from app.core.config import settings
from app.core.database import get_database
from app.models.user import UserCreate, UserLogin
from app.api.admin import role_permissions

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth = OAuth()
oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)

def resolve_session_role(email: str) -> str:
    email = (email or '').lower()
    
    # Secure role assignment: Only explicitly granted emails get admin access
    if email == 'janmeshraut11@gmail.com':
        return 'super_admin'
        
    return 'student'

@router.get("/login")
async def login(request: Request, source: str = 'login', next_url: str = ''):
    """Initiate Google OAuth flow."""
    request.session['oauth_source'] = source
    if next_url:
        request.session['oauth_next'] = next_url
    
    redirect_uri = request.url_for('auth_callback')
    return await oauth.google.authorize_redirect(request, str(redirect_uri))

@router.get("/callback", name="auth_callback")
async def auth_callback(request: Request):
    """Handle OAuth callback from Google."""
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as e:
        return {"success": False, "error": f"OAuth token exchange failed: {str(e)}"}
        
    userinfo = token.get('userinfo')
    if not userinfo:
        return {"success": False, "error": "No userinfo returned"}
        
    email = userinfo.get('email')
    if not email:
        return {"success": False, "error": "Email not available in token"}
        
    db = get_database()
    user = await db.users.find_one({"email": email})
    
    if user:
        # 1. Link to existing account
        user_id = str(user['_id'])
        user_role = user.get('role', 'student')
    else:
        # 2. Insert new Google user into Database
        user_role = resolve_session_role(email)
        new_user = {
            "email": email,
            "full_name": userinfo.get('name', ''),
            "enrollment_id": "PENDING_GOOGLE_OAUTH", # Placeholder until profile is completed
            "role": user_role,
            "auth_provider": "google",
            "created_at": datetime.utcnow()
        }
        result = await db.users.insert_one(new_user)
        user_id = str(result.inserted_id)
        
    # 3. Store proper MongoDB ObjectId as session user_id
    request.session['user_id'] = user_id
    request.session['email'] = email
    request.session['role'] = user_role
    
    next_url = request.session.pop('oauth_next', '')
    target = f"{settings.FRONTEND_URL}{next_url}" if next_url.startswith("/") else f"{settings.FRONTEND_URL}/labs"
    return RedirectResponse(url=target)

from pydantic import BaseModel
from bson import ObjectId

class ProfileUpdate(BaseModel):
    full_name: str
    enrollment_id: str

@router.get("/status")
async def auth_status(request: Request):
    """Check if the current session is authenticated."""
    user_id = request.session.get('user_id')
    if not user_id:
        return {"is_authenticated": False}
        
    db = get_database()
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        full_name = user.get("full_name", "") if user else ""
    except Exception:
        full_name = ""
        
    role = request.session.get('role', 'user')
    permissions = await role_permissions(role)
    
    return {
        "is_authenticated": True,
        "email": request.session.get('email'),
        "role": role,
        "permissions": permissions,
        "full_name": full_name
    }

@router.get("/me")
async def get_profile(request: Request):
    user_id = request.session.get('user_id')
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    db = get_database()
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        role = user.get("role", "student")
        permissions = await role_permissions(role)
        
        return {
            "email": user.get("email"),
            "full_name": user.get("full_name", ""),
            "enrollment_id": user.get("enrollment_id", ""),
            "role": role,
            "permissions": permissions
        }
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

@router.put("/me")
async def update_profile(request: Request, data: ProfileUpdate):
    user_id = request.session.get('user_id')
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    db = get_database()
    try:
        await db.users.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"full_name": data.full_name, "enrollment_id": data.enrollment_id}}
        )
        return {"success": True, "message": "Profile updated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/register")
async def register(request: Request, user: UserCreate):
    """Register a new user with local credentials."""
    db = get_database()
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        
    hashed_password = pwd_context.hash(user.password)
    user_role = resolve_session_role(user.email)
    
    new_user = {
        "email": user.email,
        "hashed_password": hashed_password,
        "full_name": user.full_name,
        "enrollment_id": user.enrollment_id,
        "role": user_role,
        "created_at": datetime.utcnow()
    }
    
    result = await db.users.insert_one(new_user)
    
    request.session['user_id'] = str(result.inserted_id)
    request.session['email'] = user.email
    request.session['role'] = user_role
    return {"success": True, "message": "User registered successfully"}

@router.post("/login/local")
async def login_local(request: Request, data: UserLogin):
    """Login endpoint for local credentials."""
    db = get_database()
    user = await db.users.find_one({"email": data.email})
    
    if not user or not pwd_context.verify(data.password, user['hashed_password']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
    request.session['user_id'] = str(user['_id'])
    request.session['email'] = user['email']
    request.session['role'] = user.get('role', 'student')
    
    return {"success": True, "message": "Login successful"}

@router.post("/logout")
async def logout(request: Request):
    """Clear session data."""
    request.session.clear()
    return {"success": True, "message": "Logged out successfully"}
