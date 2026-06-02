from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class LaunchRequest(BaseModel):
    lab_id: str
    variant_id: str

class InstanceFlagSubmitRequest(BaseModel):
    objective_id: str = Field(..., alias="objectiveId")
    flag: str
    
    class Config:
        populate_by_name = True

class InstanceResponse(BaseModel):
    instance_id: str
    status: str
    created_at: float
    started_at: Optional[float] = None
    solved_at: Optional[float] = None
    last_seen: float
    expires_at: float
