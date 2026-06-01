from typing import Optional
from app.models.user import UserInDB, UserCreate
from app.core.security import verify_password, get_password_hash

async def authenticate_user(db, email: str, password: str) -> Optional[UserInDB]:
    user_doc = await db.users.find_one({"email": email})
    if not user_doc:
        return None
    user = UserInDB(**user_doc)
    if not verify_password(password, user.hashed_password):
        return None
    return user

async def create_user(db, user_in: UserCreate) -> UserInDB:
    hashed_password = get_password_hash(user_in.password)
    user_dict = user_in.model_dump(exclude={"password"})
    user_dict["hashed_password"] = hashed_password
    
    if await db.users.find_one({"email": user_in.email}):
        raise ValueError("Email already registered")
    if await db.users.find_one({"username": user_in.username}):
        raise ValueError("Username already taken")
        
    result = await db.users.insert_one(user_dict)
    user_dict["_id"] = result.inserted_id
    return UserInDB(**user_dict)
