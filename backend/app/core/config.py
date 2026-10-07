from pydantic_settings import BaseSettings
from pydantic import validator
from typing import List, Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "Modern E-commerce Lab Backend"
    API_V1_STR: str = "/api"
    
    ENVIRONMENT: str = "dev"
    MONGO_URI: str = ""
    MONGO_DB: str = "vuln_ecommerce_new"
    
    SECRET_KEY: str
    
    FRONTEND_URL: str = "http://localhost:5173"
    FRONTEND_URLS: str = ""
    
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    
    ALLOWED_EMAIL_DOMAINS: List[str] = []
    SUPER_ADMIN_EMAILS: List[str] = []
    COOKIE_DOMAIN: Optional[str] = None
    
    FORWARDED_ALLOW_IPS: str = "127.0.0.1"

    @validator('SECRET_KEY')
    def validate_secret_key(cls, v):
        if not v or len(v) < 32:
            raise ValueError('SECRET_KEY must be at least 32 characters long')
        if v == "supersecretkey" or v == "placeholder_secret_key_needs_to_be_32_chars":
            raise ValueError('SECRET_KEY must not be a known weak value')
        return v
        
    @validator('MONGO_URI')
    def validate_mongo_uri(cls, v, values):
        if values.get('ENVIRONMENT') == 'prod' and not v:
            raise ValueError('MONGO_URI is required in production')
        return v or "mongodb://localhost:27017/"

    class Config:
        env_file = ".env"

settings = Settings()
