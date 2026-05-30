import os
from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth

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
    request.session['email'] = email
    request.session['role'] = 'admin' if 'admin' in email.lower() else 'user'
    
    # Redirect to frontend
    frontend_url = os.environ.get("FRONTEND_URL", "http://localhost:5173")
    next_url = request.session.pop('oauth_next', '')
    
    # Typically we redirect back to the React app which will then call /api/auth/status
    target = f"{frontend_url}{next_url}" if next_url.startswith("/") else frontend_url
    return RedirectResponse(url=target)

@router.get("/status")
async def auth_status(request: Request):
    """Check if the current session is authenticated."""
    user_id = request.session.get('user_id')
    if not user_id:
        return {"is_authenticated": False}
        
    return {
        "is_authenticated": True,
        "email": request.session.get('email'),
        "role": request.session.get('role', 'user')
    }

@router.post("/logout")
async def logout(request: Request):
    """Clear session data."""
    request.session.clear()
    return {"success": True, "message": "Logged out successfully"}
