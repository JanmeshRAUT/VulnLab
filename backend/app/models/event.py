from pydantic import BaseModel

class EventRequest(BaseModel):
    type: str  # 'abandon', 'solve', 'expire'
