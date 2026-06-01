from typing import Optional, Dict, Any
from datetime import datetime, timezone
from pydantic import Field
from app.models.base import MongoBaseModel, PyObjectId

class EventBase(MongoBaseModel):
    event_type: str = Field(..., description="e.g., 'instance_started', 'flag_submitted', 'user_login'")
    user_id: Optional[PyObjectId] = None
    instance_id: Optional[PyObjectId] = None
    lab_id: Optional[str] = None
    details: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary metadata for the event")

class EventInDB(EventBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EventResponse(EventBase):
    id: PyObjectId = Field(alias="_id")
    timestamp: datetime
