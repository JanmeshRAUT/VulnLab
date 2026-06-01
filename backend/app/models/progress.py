from typing import Optional, List
from datetime import datetime, timezone
from pydantic import Field
from app.models.base import MongoBaseModel, PyObjectId

class SolvedObjective(MongoBaseModel):
    objective_id: str
    solved_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    points_awarded: int = 0

class ProgressBase(MongoBaseModel):
    user_id: PyObjectId
    lab_id: str
    status: str = Field(default="in_progress", description="in_progress, completed")
    score_earned: int = 0
    completion_percentage: float = 0.0
    first_blood: bool = False
    solved_objectives: List[SolvedObjective] = Field(default_factory=list)

class ProgressInDB(ProgressBase):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    started_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    completed_at: Optional[datetime] = None

class ProgressResponse(ProgressBase):
    id: PyObjectId = Field(alias="_id")
    started_at: datetime
    completed_at: Optional[datetime] = None
