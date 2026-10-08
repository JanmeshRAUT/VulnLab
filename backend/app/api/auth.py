import os
import re
from fastapi import APIRouter, Request, HTTPException, status, Depends
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from passlib.context import CryptContext
from datetime import datetime
from app.core.config import settings
from app.core.database import get_database
from app.models.user import UserCreate, UserLogin
from app.api.admin import role_permissions
from bson import ObjectId
import logging
from app.core.limiter import limiter

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
dummy_hash = pwd_context.hash("dummy_password_for_constant_time")

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

def is_valid_domain(email: str, hd: str = None) -> bool:
    if not settings.ALLOWED_EMAIL_DOMAINS:
        return True
    
    domain = email.split('@')[1] if '@' in email else ''
    allowed = [d.strip().lower() for d in settings.ALLOWED_EMAIL_DOMAINS if d.strip()]
    if not allowed:
        return True
        
    if domain.lower() not in allowed:
        return False
    if hd and hd.lower() not in allowed:
        return False
    return True

@router.get("/login")
async def login(request: Request, source: str = 'login', next_url: str = ''):
    """Initiate Google OAuth flow."""
    request.session['oauth_source'] = source
    if next_url:
        request.session['oauth_next'] = next_url
    
    frontend_url = settings.FRONTEND_URL.rstrip('/')
    redirect_uri = f"{frontend_url}/api/auth/callback"
        
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/callback", name="auth_callback")
async def auth_callback(request: Request):
    """Handle OAuth callback from Google."""
    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as e:
        logger.error(f"OAuth token exchange failed: {e}")
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_failed")
        
    userinfo = token.get('userinfo')
    if not userinfo:
        logger.error("No userinfo returned")
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=oauth_failed")
        
    email = userinfo.get('email')
    email_verified = userinfo.get('email_verified', False)
    hd = userinfo.get('hd')
    
    if not email or not email_verified:
        logger.error("Email not available or not verified in token")
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=unverified_email")
        
    if not is_valid_domain(email, hd):
        logger.error(f"Email domain not allowed: {email}")
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=invalid_domain")
        
    db = get_database()
    user = await db.users.find_one({"email": email})
    
    user_role = 'student'
    if email.lower() in [e.strip().lower() for e in settings.SUPER_ADMIN_EMAILS if e.strip()]:
        user_role = 'super_admin'
    
    if user:
        if not user.get('email_verified', False) and user.get('auth_provider') == 'local':
            logger.error("Attempted to auto-link to an unverified local account")
            return RedirectResponse(url=f"{settings.FRONTEND_URL}/login?error=account_exists_unverified")
            
        user_id = str(user['_id'])
        # If user is in SUPER_ADMIN_EMAILS but had a lower role, upgrade them, otherwise keep existing role
        if user_role == 'super_admin' and user.get('role') != 'super_admin':
            await db.users.update_one({"_id": user['_id']}, {"$set": {"role": "super_admin"}})
    else:
        new_user = {
            "email": email,
            "full_name": userinfo.get('name', ''),
            "enrollment_id": "PENDING_GOOGLE_OAUTH",
            "role": user_role,
            "auth_provider": "google",
            "email_verified": True,
            "created_at": datetime.utcnow()
        }
        result = await db.users.insert_one(new_user)
        user_id = str(result.inserted_id)
        
    # Rotate session
    request.session.clear()
    request.session['user_id'] = user_id
    
    next_url = request.session.pop('oauth_next', '')
    target = f"{settings.FRONTEND_URL}{next_url}" if next_url.startswith("/") else f"{settings.FRONTEND_URL}/labs"
    return RedirectResponse(url=target)

from pydantic import BaseModel, Field, EmailStr

class ProfileUpdate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100)
    enrollment_id: str = Field(..., min_length=2, max_length=50)

class SafeUserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=12, max_length=128)
    full_name: str = Field(..., min_length=2, max_length=100)
    enrollment_id: str = Field(..., min_length=2, max_length=50)

# Dependency to get current user from Mongo
async def get_current_user(request: Request):
    user_id = request.session.get('user_id')
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    db = get_database()
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid session")
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    if user.get("suspended", False):
        raise HTTPException(status_code=403, detail="Account suspended")
    return user

@router.get("/status")
async def auth_status(request: Request):
    user_id = request.session.get('user_id')
    if not user_id:
        return {"is_authenticated": False}
        
    db = get_database()
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return {"is_authenticated": False}
        
    if not user or user.get("suspended", False):
        return {"is_authenticated": False}
        
    role = user.get('role', 'student')
    permissions = await role_permissions(role)
    
    return {
        "is_authenticated": True,
        "email": user.get('email'),
        "role": role,
        "permissions": permissions,
        "full_name": user.get('full_name', '')
    }

@router.get("/me")
async def get_profile(request: Request, user: dict = Depends(get_current_user)):
    from app.services.catalog_service import get_all_labs
    db = get_database()
    
    role = user.get("role", "student")
    permissions = await role_permissions(role)
    email = user.get("email")
    user_id = user["_id"]
    
    labs = get_all_labs()
    progress_docs = await db.progress.find({
        "$or": [
            {"email": email},
            {"email": str(user_id)},
            {"user_id": str(user_id)}
        ]
    }).to_list(None)
    
    labs_progress = []
    for lab in labs:
        lab_id = lab.lab_id
        variants_count = len(lab.variants)
        if variants_count == 0:
            variants_count = 1
        solved_count = len([p for p in progress_docs if p.get("lab_id") == lab_id and p.get("is_solved")])
        
        progress_percentage = int((solved_count / variants_count) * 100)
        progress_percentage = min(progress_percentage, 100)
        
        if progress_percentage >= 100:
            status = "completed"
        elif progress_percentage > 0:
            status = "in_progress"
        else:
            status = "not_started"
            
        labs_progress.append({
            "id": lab_id,
            "title": f"Lab {lab_id}: {lab.title}",
            "progress": progress_percentage,
            "status": status
        })
    
    return {
        "email": email,
        "full_name": user.get("full_name", ""),
        "enrollment_id": user.get("enrollment_id", ""),
        "role": role,
        "permissions": permissions,
        "labs_progress": labs_progress
    }

@router.put("/me")
async def update_profile(data: ProfileUpdate, user: dict = Depends(get_current_user)):
    db = get_database()
    try:
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {"full_name": data.full_name, "enrollment_id": data.enrollment_id}}
        )
        return {"success": True, "message": "Profile updated"}
    except Exception as e:
        logger.error(f"Error updating profile: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while updating the profile")

@router.post("/register")
@limiter.limit("5/minute")
async def register(request: Request, user_data: SafeUserCreate):
    if settings.ENVIRONMENT == "prod":
        raise HTTPException(status_code=403, detail="Local registration is disabled in production")
        
    db = get_database()
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
        
    hashed_password = pwd_context.hash(user_data.password)
    user_role = "student"
    
    new_user = {
        "email": user_data.email,
        "hashed_password": hashed_password,
        "full_name": user_data.full_name,
        "enrollment_id": user_data.enrollment_id,
        "role": user_role,
        "auth_provider": "local",
        "email_verified": False,
        "created_at": datetime.utcnow()
    }
    
    import pymongo.errors
    try:
        result = await db.users.insert_one(new_user)
    except pymongo.errors.DuplicateKeyError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    request.session.clear()
    request.session['user_id'] = str(result.inserted_id)
    return {"success": True, "message": "User registered successfully"}

@router.post("/login/local")
@limiter.limit("10/minute")
async def login_local(request: Request, data: UserLogin):
    db = get_database()
    user = await db.users.find_one({"email": data.email})
    
    if not user:
        pwd_context.verify(data.password, dummy_hash)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
    hashed_pw = user.get('hashed_password')
    if not hashed_pw:
        pwd_context.verify(data.password, dummy_hash)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
    if not pwd_context.verify(data.password, hashed_pw):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        
    request.session.clear()
    request.session['user_id'] = str(user['_id'])
    return {"success": True, "message": "Login successful"}

@router.post("/logout")
async def logout(request: Request):
    request.session.clear()
    return {"success": True, "message": "Logged out successfully"}
