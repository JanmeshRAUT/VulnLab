from typing import Annotated, Any
from pydantic import BeforeValidator, BaseModel, ConfigDict
from bson import ObjectId

def check_object_id(v: Any) -> str:
    if isinstance(v, ObjectId):
        return str(v)
    if isinstance(v, str) and ObjectId.is_valid(v):
        return v
    raise ValueError("Invalid ObjectId")

# Custom type for handling MongoDB ObjectIds in Pydantic v2
PyObjectId = Annotated[str, BeforeValidator(check_object_id)]

class MongoBaseModel(BaseModel):
    # Configure Pydantic to map MongoDB '_id' to 'id' if needed, 
    # but often it's easier to just keep it as id in schemas and map it manually
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
    )
