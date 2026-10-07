import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.core.config import settings
from app.api.catalog import router as catalog_router
from app.api.instances import router as instances_router
from app.api.auth import router as auth_router
from app.api.lab1 import router as lab1_router
from app.api.lab2 import router as lab2_router
from app.api.lab3 import router as lab3_router
from app.api.lab4 import router as lab4_router
from app.api.lab5 import router as lab5_router
from app.api.lab6 import router as lab6_router
from app.api.lab7 import router as lab7_router
from app.api.admin import router as admin_router
from app.api.chatbot import router as chatbot_router
from app.services.instance_service import cleanup_expired_instances

async def expiration_worker():
    while True:
        try:
            await cleanup_expired_instances()
        except Exception as e:
            print(f"Error in expiration worker: {e}")
        await asyncio.sleep(60)  # Run every 60 seconds

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    task = asyncio.create_task(expiration_worker())
    
    # Create indexes
    from app.core.database import get_database
    import pymongo
    db = get_database()
    try:
        await db.users.create_index("email", unique=True, sparse=True)
        await db.users.create_index("enrollment_id")
        await db.instances.create_index("instance_id", unique=True)
        await db.instances.create_index([("user_id", 1), ("status", 1)])
        await db.instances.create_index("expires_at", expireAfterSeconds=0)
        await db.progress.create_index([("user_id", 1), ("lab_id", 1), ("variant_id", 1)], unique=True)
        await db.lab_access.create_index([("student_id", 1), ("lab_id", 1)], unique=True)
        await db.audit_logs.create_index([("timestamp", -1)])
    except Exception as e:
        print(f"Error creating indexes: {e}")
        
    yield
    # Shutdown
    task.cancel()

from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from app.core.limiter import limiter
from app.core.logger import setup_logging

setup_logging()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

def _normalized_origins() -> list[str]:
    configured = [settings.FRONTEND_URL]
    if settings.FRONTEND_URLS:
        configured.extend(part.strip() for part in settings.FRONTEND_URLS.split(",") if part.strip())

    # Keep localhost origins for local development and preview testing only if not in prod.
    if settings.ENVIRONMENT != "prod":
        configured.extend([
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174",
            "http://localhost:5175",
            "http://127.0.0.1:5175",
        ])

    normalized: list[str] = []
    seen = set()
    for origin in configured:
        value = (origin or "").rstrip("/")
        if value and value not in seen:
            normalized.append(value)
            seen.add(value)
    return normalized

allowed_origins = _normalized_origins()
is_production = any(
    origin.startswith("https://") and "localhost" not in origin and "127.0.0.1" not in origin
    for origin in allowed_origins
)

# 1. Inner-most middleware (added first)
import secrets
from fastapi import Request
from fastapi.responses import JSONResponse

@app.middleware("http")
async def security_middleware(request: Request, call_next):
    if request.method in ["POST", "PUT", "DELETE", "PATCH"]:
        if request.url.path.startswith("/api/") and not request.url.path.startswith("/api/auth/callback"):
            csrf_header = request.headers.get("X-CSRF-Token")
            csrf_cookie = request.cookies.get("csrf_token")
            if not csrf_header or not csrf_cookie or csrf_header != csrf_cookie:
                return JSONResponse(status_code=403, content={"detail": "CSRF token missing or mismatch"})
            
    response = await call_next(request)
    
    if "csrf_token" not in request.cookies:
        response.set_cookie(
            "csrf_token", 
            secrets.token_urlsafe(32),
            httponly=False,
            samesite="lax",
            secure=settings.ENVIRONMENT == "prod",
            domain=settings.COOKIE_DOMAIN
        )

    # Security headers
    response.headers["Content-Security-Policy"] = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://accounts.google.com;"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    response.headers["X-Frame-Options"] = "DENY"
    
    return response

trusted_hosts = [ip.strip() for ip in settings.FORWARDED_ALLOW_IPS.split(",")] if settings.FORWARDED_ALLOW_IPS else ["127.0.0.1"]
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts=trusted_hosts)

# 2. Session middleware (added second)
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="vulnlab_session",
    max_age=8 * 60 * 60, # 8 hours
    same_site="lax",
    https_only=settings.ENVIRONMENT == "prod",
    domain=settings.COOKIE_DOMAIN
)

# 3. Outer-most middleware (added last, so it executes FIRST for CORS preflights)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-CSRF-Token", "Accept"],
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "New FastAPI Backend is running!"}

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(catalog_router, prefix=settings.API_V1_STR)
app.include_router(instances_router, prefix=settings.API_V1_STR)
app.include_router(lab1_router, prefix=settings.API_V1_STR)
app.include_router(lab2_router, prefix=settings.API_V1_STR)
app.include_router(lab3_router, prefix=settings.API_V1_STR)
app.include_router(lab4_router, prefix=settings.API_V1_STR)
app.include_router(lab5_router, prefix=settings.API_V1_STR)
app.include_router(lab6_router, prefix=settings.API_V1_STR)
app.include_router(lab7_router, prefix=settings.API_V1_STR)
app.include_router(admin_router, prefix=settings.API_V1_STR)
app.include_router(chatbot_router, prefix=settings.API_V1_STR)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
