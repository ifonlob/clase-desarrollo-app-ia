from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="../.env", extra="ignore")

    APP_NAME: str = "TDAI"
    DEBUG: bool = False
    USE_MOCKS: bool = True
    DATABASE_URL: str = "postgresql+asyncpg://tdai:tdai_pass@localhost:5432/tdai_db"
    REDIS_URL: str = "redis://localhost:6379/0"
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    AUTHENTIK_URL: str = ""
    AUTHENTIK_CLIENT_ID: str = ""
    AUTHENTIK_CLIENT_SECRET: str = ""
    LLM_BASE_URL:str = "http://localhost:11434/v1"
    LLM_MODEL_NAME:str = "gemma4:31b-cloud"
    LLM_API_KEY : str = ""


settings = Settings()
