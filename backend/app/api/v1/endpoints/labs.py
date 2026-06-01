from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.models.lab import LabResponse
from app.db.mongodb import get_db

router = APIRouter()

@router.get("/", response_model=List[LabResponse])
async def list_labs(db = Depends(get_db)):
    labs_cursor = db.labs.find({"is_active": True})
    labs = await labs_cursor.to_list(length=100)
    return labs

@router.get("/{lab_slug}", response_model=LabResponse)
async def get_lab(lab_slug: str, db = Depends(get_db)):
    lab = await db.labs.find_one({"lab_slug": lab_slug, "is_active": True})
    if not lab:
        raise HTTPException(status_code=404, detail="Lab not found")
    return lab
