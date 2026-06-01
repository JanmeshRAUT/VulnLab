from fastapi import APIRouter
from app.api.v1.endpoints import auth, labs, instances

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(labs.router, prefix="/labs", tags=["labs"])
api_router.include_router(instances.router, prefix="/instances", tags=["instances"])
