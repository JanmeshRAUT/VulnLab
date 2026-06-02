from fastapi import APIRouter, HTTPException
from typing import List
from app.models.catalog import Lab
from app.services.catalog_service import get_all_labs, get_lab_by_id

router = APIRouter(prefix="/catalog", tags=["catalog"])

@router.get("/labs", response_model=List[Lab])
async def list_labs():
    return get_all_labs()

@router.get("/labs/{lab_id}", response_model=Lab)
async def get_lab(lab_id: str):
    lab = get_lab_by_id(lab_id)
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")
    return lab
