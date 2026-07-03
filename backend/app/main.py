import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware
from app.core.config import settings
from app.api.catalog import router as catalog_router
from app.api.instances import router as instances_router
from app.api.events import router as events_router
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
    yield
    # Shutdown
    task.cancel()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:5175", "http://127.0.0.1:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

is_production = "localhost" not in settings.FRONTEND_URL

app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="session",
    max_age=14 * 24 * 60 * 60, # 14 days
    same_site="none" if is_production else "lax",
    https_only=is_production
)

@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "New FastAPI Backend is running!"}

app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(catalog_router, prefix=settings.API_V1_STR)
app.include_router(instances_router, prefix=settings.API_V1_STR)
app.include_router(events_router, prefix=settings.API_V1_STR)
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
