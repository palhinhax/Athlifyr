"""APScheduler jobs for periodic scraping."""

from __future__ import annotations

import logging

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from sqlalchemy import select

from app.core.config import settings
from app.db.session import async_session
from app.models.models import SourceConfig
from app.services.scraping_service import get_or_create_source_config, run_scraper
from app.sources.registry import list_sources

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def _scheduled_scrape(source_name: str) -> None:
    """Run a scrape only if the source is enabled in the DB."""
    async with async_session() as db:
        cfg = await get_or_create_source_config(db, source_name)
        await db.commit()
        if not cfg.enabled:
            logger.info("⏰ Skipping disabled source: %s", source_name)
            return

    logger.info("⏰ Scheduled scrape starting: %s", source_name)
    async with async_session() as db:
        run = await run_scraper(source_name, db)
        logger.info(
            "⏰ Scheduled scrape finished: %s — found=%d created=%d updated=%d failed=%d status=%s",
            source_name,
            run.events_found,
            run.events_created,
            run.events_updated,
            run.events_failed,
            run.status.value,
        )


def start_scheduler() -> None:
    if not settings.scheduler_enabled:
        logger.info("Scheduler disabled via config")
        return

    sources = list_sources()
    for src in sources:
        name = src["name"]
        scheduler.add_job(
            _scheduled_scrape,
            "interval",
            hours=settings.scheduler_default_interval_hours,
            args=[name],
            id=f"scrape_{name}",
            replace_existing=True,
        )
        logger.info(
            "Registered scheduled job: scrape_%s (every %dh)",
            name,
            settings.scheduler_default_interval_hours,
        )

    scheduler.start()
    logger.info("Scheduler started")


def stop_scheduler() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("Scheduler stopped")
