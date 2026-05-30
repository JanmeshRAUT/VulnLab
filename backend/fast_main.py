import os
import asyncio
import mongodb_client
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

# Create the FastAPI app
app = FastAPI(title="VulnLab API", version="1.0.0")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup Session Middleware (to replace Flask session)
secret_key = os.environ.get('SECRET_KEY', 'default_vulnerable_key_replace_in_prod')
app.add_middleware(
    SessionMiddleware, 
    secret_key=secret_key,
    session_cookie="session",
    max_age=14 * 24 * 60 * 60, # 14 days
    same_site="lax"
)

# Core E-Commerce API Endpoints

@app.get("/api/health")
async def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "message": "FastAPI is running!"}

@app.get("/api/config")
async def get_config(request: Request):
    """Return some basic config info."""
    user_id = request.session.get("user_id")
    return {
        "is_logged_in": bool(user_id),
        "role": request.session.get("role", "guest")
    }

# ==============================================================
# Routers
from routers.auth import router as auth_router
from routers.lab1 import router as lab1_router
from routers.lab2 import router as lab2_router
from routers.lab6 import router as lab6_router
from routers.lab7 import router as lab7_router
from routers.lab8 import router as lab8_router
from routers.instances import router as instances_router
from routers.admin import router as admin_router

app.include_router(auth_router)
app.include_router(lab1_router)
app.include_router(lab2_router)
app.include_router(lab6_router)
app.include_router(lab7_router)
app.include_router(lab8_router)
app.include_router(instances_router)
app.include_router(admin_router)

@app.on_event("startup")
async def startup_event():
    # Background task to clean up expired instances
    async def cleanup_loop():
        while True:
            try:
                mongodb_client.mark_expired_instances(timeout_seconds=900) # 15 minutes
            except Exception as e:
                print(f"Error in cleanup loop: {e}")
            await asyncio.sleep(60) # Run every minute
            
    asyncio.create_task(cleanup_loop())

# In future phases, we will import routers for labs and admin
# e.g.:
# from routers.labs import router as labs_router
# app.include_router(labs_router, prefix="/api/labs")
# ==============================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("fast_main:app", host="127.0.0.1", port=5000, reload=True)
