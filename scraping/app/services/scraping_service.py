"""Scraping orchestration service — runs scrapers, persists results, downloads docs."""

from __future__ import annotations

import logging
import uuid
from datetime import datetime, timezone

from slugify import slugify
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.models import (
    EventReviewStatus,
    ScrapedDocument,
    ScrapedEvent,
    ScrapedPricingPhase,
    ScrapedVariant,
    ScrapingRun,
    ScrapingRunStatus,
)
from app.sources.base.scraper import BaseScraper, ScrapedEventData
from app.sources.registry import get_scraper
from app.storage.backend import get_storage

logger = logging.getLogger(__name__)


async def run_scraper(source_name: str, db: AsyncSession) -> ScrapingRun:
    """Execute a full scraping run for *source_name* and persist the results."""
    scraper = get_scraper(source_name)

    run = ScrapingRun(
        source_name=source_name,
        status=ScrapingRunStatus.RUNNING,
        started_at=datetime.now(timezone.utc),
    )
    db.add(run)
    await db.flush()

    try:
        events_data = await scraper.scrape()
        created = 0
        updated = 0

        for ev_data in events_data:
            is_new = await _upsert_scraped_event(db, run.id, source_name, ev_data)
            if is_new:
                created += 1
            else:
                updated += 1

        run.events_found = len(events_data)
        run.events_created = created
        run.events_updated = updated
        run.status = ScrapingRunStatus.COMPLETED
    except Exception as exc:
        logger.exception("Scraping run failed for %s", source_name)
        run.status = ScrapingRunStatus.FAILED
        run.error_message = str(exc)[:2000]
    finally:
        run.finished_at = datetime.now(timezone.utc)
        await scraper.close()

    await db.commit()
    await db.refresh(run)
    return run


async def scrape_single_event(
    source_name: str, url: str, db: AsyncSession
) -> ScrapedEvent | None:
    """Scrape one event URL and persist it."""
    scraper = get_scraper(source_name)
    try:
        ev_data = await scraper.scrape_event(url)
        if ev_data is None:
            return None
        is_new = await _upsert_scraped_event(db, None, source_name, ev_data)
        await db.commit()
        # Retrieve with relations loaded
        result = await db.execute(
            select(ScrapedEvent)
            .options(
                selectinload(ScrapedEvent.variants),
                selectinload(ScrapedEvent.pricing_phases),
                selectinload(ScrapedEvent.documents),
            )
            .where(
                ScrapedEvent.source_name == source_name,
                ScrapedEvent.source_url == url,
            )
        )
        return result.scalar_one_or_none()
    finally:
        await scraper.close()


async def download_event_documents(event_id: uuid.UUID, db: AsyncSession) -> int:
    """Download any undownloaded documents for *event_id*."""
    result = await db.execute(
        select(ScrapedDocument).where(
            ScrapedDocument.event_id == event_id,
            ScrapedDocument.downloaded == False,  # noqa: E712
        )
    )
    docs = result.scalars().all()
    if not docs:
        return 0

    storage = get_storage()
    count = 0
    for doc in docs:
        if not doc.original_url:
            continue
        try:
            import httpx

            async with httpx.AsyncClient(follow_redirects=True) as client:
                resp = await client.get(doc.original_url)
                resp.raise_for_status()
                data = resp.content

            key = f"{event_id}/{doc.file_name or doc.id}"
            path = await storage.save(key, data)
            doc.file_path = path
            doc.file_size_bytes = len(data)
            doc.downloaded = True
            count += 1
        except Exception:
            logger.exception("Failed to download %s", doc.original_url)

    await db.commit()
    return count


# ── Internal helpers ──────────────────────────────────────────────────────────


async def _upsert_scraped_event(
    db: AsyncSession,
    run_id: uuid.UUID | None,
    source_name: str,
    data: ScrapedEventData,
) -> bool:
    """Insert or update a ScrapedEvent. Returns True if newly created."""
    result = await db.execute(
        select(ScrapedEvent).where(
            ScrapedEvent.source_name == source_name,
            ScrapedEvent.source_url == data.source_url,
        )
    )
    existing = result.scalar_one_or_none()

    if existing:
        _apply_event_fields(existing, data)
        existing.scraping_run_id = run_id
        await db.flush()
        return False

    event = ScrapedEvent(
        scraping_run_id=run_id,
        source_name=source_name,
        source_url=data.source_url,
        source_event_id=data.source_event_id,
        slug=slugify(data.title)[:500] if data.title else None,
        review_status=EventReviewStatus.PENDING,
        raw_data=data.raw_data,
    )
    _apply_event_fields(event, data)
    db.add(event)
    await db.flush()

    # Variants
    for v in data.variants:
        db.add(
            ScrapedVariant(
                event_id=event.id,
                name=v.name,
                distance_km=v.distance_km,
                elevation_gain_m=v.elevation_gain_m,
                elevation_loss_m=v.elevation_loss_m,
                start_time=v.start_time,
                price=v.price,
                currency=v.currency,
            )
        )

    # Pricing phases
    for p in data.pricing_phases:
        db.add(
            ScrapedPricingPhase(
                event_id=event.id,
                variant_name=p.variant_name,
                phase_name=p.phase_name,
                start_date=p.start_date,
                end_date=p.end_date,
                price=p.price,
                currency=p.currency,
                note=p.note,
            )
        )

    # Documents
    for d in data.documents:
        db.add(
            ScrapedDocument(
                event_id=event.id,
                document_type=d.document_type,
                original_url=d.original_url,
                file_name=d.file_name,
                mime_type=d.mime_type,
            )
        )

    await db.flush()
    return True


def _apply_event_fields(event: ScrapedEvent, data: ScrapedEventData) -> None:
    event.title = data.title
    event.description = data.description
    event.sport_types = ",".join(data.sport_types) if data.sport_types else None
    event.start_date = data.start_date
    event.end_date = data.end_date
    event.registration_deadline = data.registration_deadline
    event.city = data.city
    event.country = data.country
    event.latitude = data.latitude
    event.longitude = data.longitude
    event.google_maps_url = data.google_maps_url
    event.organizer_name = data.organizer_name
    event.external_url = data.external_url
    event.image_url = data.image_url
    event.raw_data = data.raw_data
