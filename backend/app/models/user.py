from typing import Optional
from datetime import datetime, timezone
from pydantic import EmailStr, Field
from app.models.base import MongoBaseModel, PyObjectId

class UserBase(MongoBaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    role: str = Field(default="user", description="user or admin")
    is_active: bool = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserInDB(UserBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserResponse(UserBase):
    id: PyObjectId = Field(alias="_id")
    created_at: datetime
