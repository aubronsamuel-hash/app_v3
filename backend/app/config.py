from pydantic import Field
from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    database_url: str = Field(default="sqlite+aiosqlite:///./app.db", env="DATABASE_URL")
    redis_url: str = Field(default="redis://localhost/0", env="REDIS_URL")
    token_ttl_min: int = Field(default=60, env="TOKEN_TTL_MIN")
    cors_origins: List[str] = Field(default_factory=lambda: ["*"], env="CORS_ORIGINS")
    trusted_hosts: List[str] = Field(default_factory=lambda: ["*"], env="TRUSTED_HOSTS")
    rate_limit_per_min: int = Field(default=60, env="RATE_LIMIT_PER_MIN")
    version: str = Field(default="0.1.0", env="APP_VERSION")

    class Config:
        env_file = ".env"

settings = Settings()
