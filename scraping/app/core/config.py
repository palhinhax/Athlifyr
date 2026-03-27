"""Application settings loaded from environment variables."""

import os

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── Database ──────────────────────────────────────────────────
    database_url: str = "postgresql+asyncpg://localhost:5432/athlifyr_scraping"

    # ── Storage ───────────────────────────────────────────────────
    storage_backend: str = "local"  # "local" | "s3"
    storage_local_path: str = "./data/documents"
    storage_s3_bucket: str = ""
    storage_s3_region: str = ""
    storage_s3_endpoint: str = ""
    storage_s3_access_key: str = ""
    storage_s3_secret_key: str = ""

    # ── Scraping defaults ─────────────────────────────────────────
    scraping_request_timeout: int = 30
    scraping_max_retries: int = 3
    scraping_delay_between_requests: float = 1.0
    scraping_user_agent: str = (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/131.0.0.0 Safari/537.36"
    )

    # ── Scheduler ─────────────────────────────────────────────────
    scheduler_enabled: bool = True
    scheduler_default_interval_hours: int = 24

    # ── API ───────────────────────────────────────────────────────
    api_prefix: str = "/api/v1"
    api_key: str = ""  # shared secret with Next.js
    host: str = "0.0.0.0"
    port: int = int(os.environ.get("PORT", "8000"))
    debug: bool = False
    # ── OpenAI ────────────────────────────────────────────────────
    openai_api_key: str = ""
    openai_model: str = "gpt-4.1"

    # ── Next.js import endpoint ───────────────────────────────────
    nextjs_url: str = "http://localhost:3000"
    nextjs_import_secret: str = ""  # shared secret for import endpoint
    model_config = {"env_prefix": "SCRAPING_", "env_file": ".env", "extra": "ignore"}

    @property
    def async_database_url(self) -> str:
        """Ensure the database URL uses the asyncpg driver."""
        url = self.database_url
        if url.startswith("postgresql://"):
            url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
        elif url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+asyncpg://", 1)
        return url


settings = Settings()
