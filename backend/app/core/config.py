from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Modern E-commerce Lab Backend"
    API_V1_STR: str = "/api"
    MONGO_URI: str = "mongodb://localhost:27017/"
    MONGO_DB: str = "vuln_ecommerce_new"
    SECRET_KEY: str = "supersecretkey"
    FRONTEND_URL: str = "http://localhost:5173"
    FRONTEND_URLS: str = ""
    
    GOOGLE_CLIENT_ID: str = "placeholder_id"
    GOOGLE_CLIENT_SECRET: str = "placeholder_secret"

    class Config:
        env_file = ".env"

settings = Settings()
