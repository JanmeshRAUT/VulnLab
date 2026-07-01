from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class LabVariant(BaseModel):
    variant_id: str
    title: str
    description: str
    submodule: Optional[str] = None

class Lab(BaseModel):
    lab_id: str
    title: str
    description: str
    variants: List[LabVariant]
