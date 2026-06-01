from typing import List, Optional
from pydantic import Field
from app.models.base import MongoBaseModel, PyObjectId

class Objective(MongoBaseModel):
    objective_id: str = Field(..., description="Unique ID for this objective within the lab")
    title: str
    description: str

class LabBase(MongoBaseModel):
    lab_id: str = Field(..., description="Unique string ID for the lab (e.g., 'lab_01_sqli')")
    title: str
    description: str
    difficulty: str = Field(..., description="easy, medium, hard")
    category: str = Field(..., description="web, crypto, pwn, etc.")
    is_active: bool = True
    objectives: List[Objective] = []

class LabInDB(LabBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)

class LabResponse(LabBase):
    id: PyObjectId = Field(alias="_id")
