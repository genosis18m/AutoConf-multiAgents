from pydantic_settings import BaseSettings
from functools import lru_cache
from dotenv import load_dotenv
from pathlib import Path

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path, override=True)
class Settings(BaseSettings):
    # LLM
    groq_api_key: str = ""
    gemini_api_key: str = ""

    # Search
    tavily_api_key: str = ""
    google_places_api_key: str = ""

    # Database
    supabase_url: str = ""
    supabase_key: str = ""

    # Optional
    redis_url: str = ""
    demo_mode: bool = False

    # App
    app_name: str = "ConferenceAI"
    debug: bool = False
    cors_origins: list[str] = ["*"]

    class Config:
        env_file = str(env_path)
        env_file_encoding = "utf-8"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
