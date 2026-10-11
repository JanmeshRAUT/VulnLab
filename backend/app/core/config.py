import os
import json
import logging
from typing import List, Optional, Any
from pydantic import ConfigDict, field_validator, model_validator
from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)

class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Modern E-commerce Lab Backend"
    API_V1_STR: str = "/api"
    
    ENVIRONMENT: str = "prod"
    MONGO_URI: str = ""
    MONGO_DB: str = "vuln_ecommerce_new"
    
    SECRET_KEY: str = ""
    
    FRONTEND_URL: str = "http://localhost:5173"
    FRONTEND_URLS: str = ""
    
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    
    ALLOWED_EMAIL_DOMAINS: Any = []
    SUPER_ADMIN_EMAILS: Any = []
    ALLOW_NO_SUPERADMIN: bool = False
    COOKIE_DOMAIN: Optional[str] = None
    
    FORWARDED_ALLOW_IPS: str = "127.0.0.1"

    @field_validator('ALLOWED_EMAIL_DOMAINS', 'SUPER_ADMIN_EMAILS', mode='before')
    @classmethod
    def parse_string_list(cls, v: Any) -> List[str]:
        if not v:
            return []
        if isinstance(v, list):
            return [str(item).strip().lower() for item in v if str(item).strip()]
        if isinstance(v, str):
            v = v.strip()
            if v.startswith('[') and v.endswith(']'):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [str(item).strip().lower() for item in parsed if str(item).strip()]
                except json.JSONDecodeError:
                    pass
            return [item.strip().lower() for item in v.split(',') if item.strip()]
        return []

    @field_validator('SECRET_KEY')
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        if not v or len(v) < 32:
            raise ValueError('SECRET_KEY must be at least 32 characters long')
        if v in ("supersecretkey", "placeholder_secret_key_needs_to_be_32_chars"):
            raise ValueError('SECRET_KEY must not be a known weak value')
        return v

    @model_validator(mode='after')
    def validate_production_constraints(self) -> 'Settings':
        if self.ENVIRONMENT == 'prod':
            if not self.MONGO_URI:
                raise ValueError('MONGO_URI is required in production')
            if not self.SUPER_ADMIN_EMAILS and not self.ALLOW_NO_SUPERADMIN and os.environ.get("ALLOW_NO_SUPERADMIN") != "1":
                raise ValueError('SUPER_ADMIN_EMAILS must be configured in production unless ALLOW_NO_SUPERADMIN=1')
            if not self.ALLOWED_EMAIL_DOMAINS:
                logger.warning('WARNING: ALLOWED_EMAIL_DOMAINS is empty in production. All Google login domains may be accepted if not constrained.')
        else:
            if not self.MONGO_URI:
                self.MONGO_URI = "mongodb://localhost:27017/"
        return self

settings = Settings()

