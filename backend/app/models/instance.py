from typing import Optional, Dict, Any, List
from datetime import datetime, timezone
from pydantic import Field
from app.models.base import MongoBaseModel, PyObjectId

class InstanceBase(MongoBaseModel):
    instance_id: str = Field(..., description="Public-facing unique ID for the instance")
    user_id: PyObjectId
    lab_id: str
    variant: Optional[str] = None
    status: str = Field(default="provisioning", description="provisioning, running, stopped, failed, completed")
    connection_info: Optional[Dict[str, Any]] = None
    container_id: Optional[str] = None

class InstanceInDB(InstanceBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: Optional[datetime] = None

class InstanceResponse(InstanceBase):
    id: PyObjectId = Field(alias="_id")
    created_at: datetime
    expires_at: Optional[datetime] = None

class LabState(MongoBaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    instance_id: str = Field(..., description="Reference to instances.instance_id")
    user_id: PyObjectId
    lab_id: str
    completed_objectives: List[str] = Field(default_factory=list)
    unlocked_hints: List[str] = Field(default_factory=list)
    attempts: Dict[str, int] = Field(default_factory=dict, description="Objective attempts mapping")
    dynamic_state: Dict[str, Any] = Field(default_factory=dict)
    last_activity: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
