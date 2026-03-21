"""Application settings loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # ── Database ──────────────────────────────────────────────────
    database_url: str = "postgresql+asyncpg://localhost:5432/athlifyr_scraping"

    # ── Storage ───────────────────────────────────────────────────
    storage_backend: str = "local"  # "local" | "s3"
    storage_local_path: str = "./data/documents"
    # Future S3/R2 settings (unused until storage_backend="s3")
    storage_s3_bucket: str = ""
    storage_s3_region: str = ""
    storage_s3_endpoint: str = ""

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
    debug: bool = False

    model_config = {"env_prefix": "SCRAPING_", "env_file": ".env", "extra": "ignore"}


settings = Settings()
