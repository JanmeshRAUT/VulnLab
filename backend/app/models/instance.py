from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Dict, Any

class LaunchRequest(BaseModel):
    lab_id: str
    variant_id: str

class InstanceFlagSubmitRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    objective_id: Optional[str] = Field(None, alias="objectiveId")
    flag: str


class InstanceResponse(BaseModel):
    instance_id: str
    status: str
    created_at: float
    started_at: Optional[float] = None
    solved_at: Optional[float] = None
    last_seen: float
    expires_at: float
