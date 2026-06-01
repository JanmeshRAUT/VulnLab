from typing import Optional
from datetime import datetime, timezone
from pydantic import Field
from app.models.base import MongoBaseModel, PyObjectId

class RefreshTokenBase(MongoBaseModel):
    user_id: PyObjectId
    token_hash: str
    device_id: Optional[str] = None
    device_info: Optional[str] = None
    ip_address: Optional[str] = None
    is_revoked: bool = False

class RefreshTokenInDB(RefreshTokenBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    issued_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    expires_at: datetime

class RefreshTokenResponse(RefreshTokenBase):
    id: PyObjectId = Field(alias="_id")
    issued_at: datetime
    expires_at: datetime
