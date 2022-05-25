import logging
from functools import lru_cache

from pydantic import AnyUrl, BaseSettings

log = logging.getLogger("uvicorn")


class Settings(BaseSettings):
    environment: str
    testing: bool
    database_url: AnyUrl
    # secret_key: str
    # algorithm: str
    # access_token_expire_seconds: int
    # refresh_token_expire_seconds: int
    # confirmation_token_expire_seconds: int
    # default_role: str
    # MAIL_FROM: str
    # API_URL: str
    # CLIENT_URL: str
    # SYSTEM_PASSWORD: str
    # SYSTEM_USER: str


@lru_cache()
def get_settings() -> Settings:
    log.info("Loading config settings from the environment...")
    return Settings()
