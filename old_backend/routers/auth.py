import os
from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from .session_utils import get_base_identity

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

oauth = OAuth()
oauth.register(
    name='google',
    client_id=os.environ.get('GOOGLE_CLIENT_ID', 'placeholder-id'),
    client_secret=os.environ.get('GOOGLE_CLIENT_SECRET', 'placeholder-secret'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile'
    }
)


def resolve_session_role(email: str) -> str:
    local_part = (email or '').split('@')[0].lower()
    if 'super' in local_part or 'root' in local_part:
        return 'super_admin'
    if 'admin' in local_part:
        return 'admin'
    if 'instructor' in local_part or 'teacher' in local_part:
        return 'instructor'
    if 'reviewer' in local_part or 'auditor' in local_part:
        return 'reviewer'
    return 'student'

@router.get("/login")
async def login(request: Request, source: str = 'login', next_url: str = ''):
    """Initiate Google OAuth flow."""
    request.session['oauth_source'] = source
    if next_url:
        request.session['oauth_next'] = next_url
    
    redirect_uri = request.url_for('auth_callback')
    # If using reverse proxy / production, force https
    if os.environ.get('VERCEL') or os.environ.get('FORCE_HTTPS'):
        redirect_uri = str(redirect_uri).replace('http://', 'https://', 1)
        
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
        
    # In a full migration, you would call the MongoDB logic from mongodb_client here.
    # For now, we stub it to allow basic sign in via session.
    request.session['user_id'] = f"mock_user_id_{email}"
    request.session['base_identity'] = request.session['user_id']
    request.session['email'] = email
    request.session['role'] = resolve_session_role(email)
    
    # Redirect to frontend
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    next_url = request.session.pop('oauth_next', '')
    
    # Typically we redirect back to the React app which will then call /api/auth/status
    target = f"{frontend_url}{next_url}" if next_url.startswith("/") else frontend_url
    return RedirectResponse(url=target)

from pydantic import BaseModel

class MockLoginData(BaseModel):
    email: str
    password: str

@router.post("/mock-login")
async def mock_login(request: Request, data: MockLoginData):
    """Mock login endpoint for testing without OAuth."""
    # Ignore password, just mock using email
    email = data.email.strip()
    request.session['user_id'] = f"mock_user_id_{email}"
    request.session['base_identity'] = request.session['user_id']
    request.session['email'] = email
    if email.lower() in {'admin', 'admin@vulnlab.local'} and data.password == 'admin123':
        request.session['role'] = 'admin'
    else:
        request.session['role'] = resolve_session_role(email)
    
    return {"success": True, "message": "Mock login successful"}

@router.get("/status")
async def auth_status(request: Request):
    """Check if the current session is authenticated."""
    user_id = request.session.get('user_id')
    if not user_id:
        return {"is_authenticated": False}
        
    return {
        "is_authenticated": True,
        "email": request.session.get('email'),
        "role": request.session.get('role', 'user'),
        "session_identity": get_base_identity(request)
    }

@router.post("/logout")
async def logout(request: Request):
    """Clear session data."""
    request.session.clear()
    return {"success": True, "message": "Logged out successfully"}
