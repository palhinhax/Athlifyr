"""Scraping orchestration service — runs scrapers, persists results, downloads docs."""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timezone
from pathlib import PurePosixPath
from urllib.parse import urlparse

import httpx
from slugify import slugify
from sqlalchemy import delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.models import (
    EventChangeLog,
    EventReviewStatus,
    ScrapedDocument,
    ScrapedEvent,
    ScrapedPricingPhase,
    ScrapedVariant,
    ScrapingRun,
    ScrapingRunStatus,
    SourceConfig,
)
from app.sources.base.scraper import ScrapedEventData
from app.sources.registry import get_scraper
from app.storage.backend import get_storage

logger = logging.getLogger(__name__)

# Shared HTTP client settings for downloading files
_DOWNLOAD_TIMEOUT = 30

# Fields tracked for change-log diffing
_TRACKED_FIELDS = (
    "title", "description", "sport_types", "start_date", "end_date",
    "registration_deadline", "city", "country", "organizer_name",
    "external_url", "image_url",
)


# ── Source config helpers ─────────────────────────────────────────────────────


async def get_or_create_source_config(
    db: AsyncSession, source_name: str,
) -> SourceConfig:
    """Return the persisted config row, creating one if it doesn't exist."""
    result = await db.execute(
        select(SourceConfig).where(SourceConfig.source_name == source_name)
    )
    cfg = result.scalar_one_or_none()
    if cfg is None:
        cfg = SourceConfig(source_name=source_name)
        db.add(cfg)
        await db.flush()
    return cfg


async def update_source_config(
    db: AsyncSession,
    source_name: str,
    *,
    enabled: bool | None = None,
    interval_hours: int | None = None,
) -> SourceConfig:
    cfg = await get_or_create_source_config(db, source_name)
    if enabled is not None:
        cfg.enabled = enabled
    if interval_hours is not None:
        cfg.interval_hours = interval_hours
    await db.commit()
    await db.refresh(cfg)
    return cfg


# ── Run scraper ──────────────────────────────────────────────────────────────


async def run_scraper(source_name: str, db: AsyncSession) -> ScrapingRun:
    """Execute a full scraping run for *source_name* and persist the results."""
    scraper = get_scraper(source_name)
    cfg = await get_or_create_source_config(db, source_name)

    run = ScrapingRun(
        source_name=source_name,
        status=ScrapingRunStatus.RUNNING,
        started_at=datetime.now(timezone.utc),
    )
    db.add(run)
    await db.flush()

    ai_event_ids: list[uuid.UUID] = []

    try:
        events_data = await scraper.scrape()
        created = 0
        updated = 0
        failed = 0

        for ev_data in events_data:
            try:
                async with db.begin_nested():
                    is_new = await _upsert_scraped_event(db, run.id, source_name, ev_data)
                # Fetch the event for auto-generation check
                row = await db.execute(
                    select(ScrapedEvent.id, ScrapedEvent.ai_pending).where(
                        ScrapedEvent.source_name == source_name,
                        ScrapedEvent.source_url == ev_data.source_url,
                    )
                )
                ev_row = row.one_or_none()
                if is_new:
                    created += 1
                    if ev_row:
                        ai_event_ids.append(ev_row[0])
                else:
                    updated += 1
                    # Also queue for AI if something changed (ai_pending=True)
                    if ev_row and ev_row[1]:
                        ai_event_ids.append(ev_row[0])
            except Exception:
                logger.exception("Failed to upsert event: %s", ev_data.source_url)
                failed += 1

        run.events_found = len(events_data)
        run.events_created = created
        run.events_updated = updated
        run.events_failed = failed
        run.status = ScrapingRunStatus.COMPLETED

        # Update source config
        now = datetime.now(timezone.utc)
        cfg.last_run_at = now
        cfg.last_success_at = now
        cfg.last_error = None

        # Count total events for this source
        total = await db.scalar(
            select(func.count(ScrapedEvent.id)).where(
                ScrapedEvent.source_name == source_name
            )
        )
        cfg.events_total = total or 0

    except Exception as exc:
        logger.exception("Scraping run failed for %s", source_name)
        run.status = ScrapingRunStatus.FAILED
        run.error_message = str(exc)[:2000]
        cfg.last_run_at = datetime.now(timezone.utc)
        cfg.last_error = str(exc)[:2000]
    finally:
        run.finished_at = datetime.now(timezone.utc)
        await scraper.close()

    await db.commit()
    await db.refresh(run)

    # Auto-generate AI + import to Next.js for new / changed events
    if run.status == ScrapingRunStatus.COMPLETED and ai_event_ids:
        logger.info(
            "Auto-generating AI for %d new/changed events from %s",
            len(ai_event_ids), source_name,
        )
        for eid in ai_event_ids:
            try:
                await generate_and_import_event(eid, db)
                await db.commit()
            except Exception:
                logger.exception("Auto-generate failed for event %s", eid)

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
        await _upsert_scraped_event(db, None, source_name, ev_data)
        await db.commit()
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
    """Download any undownloaded documents for *event_id* to the storage bucket."""
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
    async with httpx.AsyncClient(follow_redirects=True, timeout=_DOWNLOAD_TIMEOUT) as client:
        for doc in docs:
            if not doc.original_url:
                continue
            clean_url = _clean_url(doc.original_url)
            if not clean_url:
                logger.warning("Skipping invalid doc URL: %r", doc.original_url)
                continue
            try:
                resp = await client.get(clean_url)
                resp.raise_for_status()
                data = resp.content

                ext = _extension_from_url(clean_url) or ".pdf"
                key = f"documents/{event_id}/{doc.id}{ext}"
                url = await storage.save(key, data)
                doc.file_path = url
                doc.file_size_bytes = len(data)
                doc.downloaded = True
                count += 1
                logger.info("Downloaded document %s → %s", doc.original_url, url)
            except Exception:
                logger.exception("Failed to download doc %s", doc.original_url)

    await db.commit()
    return count


async def _upload_image(
    source_name: str, event_slug: str, image_url: str,
) -> str | None:
    """Download an image from *image_url* and upload it to the storage bucket.

    Returns the bucket URL, or None on failure.
    """
    if not image_url:
        return None
    # Skip URLs without a valid protocol (relative paths, data URIs, etc.)
    if not image_url.startswith(("http://", "https://")):
        logger.warning("Skipping image with invalid URL: %s", image_url[:200])
        return None
    storage = get_storage()
    try:
        async with httpx.AsyncClient(follow_redirects=True, timeout=_DOWNLOAD_TIMEOUT) as client:
            resp = await client.get(image_url)
            resp.raise_for_status()
            data = resp.content

        ext = _extension_from_url(image_url) or ".jpg"
        key = f"images/{source_name}/{event_slug}{ext}"
        url = await storage.save(key, data)
        logger.info("Uploaded image %s → %s (%d bytes)", image_url, url, len(data))
        return url
    except Exception:
        logger.exception("Failed to upload image %s", image_url)
        return None


async def _upload_event_documents_inline(
    event_id: uuid.UUID, db: AsyncSession,
) -> None:
    """Download and upload all undownloaded documents for an event (called right after upsert)."""
    result = await db.execute(
        select(ScrapedDocument).where(
            ScrapedDocument.event_id == event_id,
            ScrapedDocument.downloaded == False,  # noqa: E712
        )
    )
    docs = result.scalars().all()
    if not docs:
        return

    storage = get_storage()
    async with httpx.AsyncClient(follow_redirects=True, timeout=_DOWNLOAD_TIMEOUT) as client:
        for doc in docs:
            if not doc.original_url:
                continue
            clean_url = _clean_url(doc.original_url)
            if not clean_url:
                logger.warning("Skipping invalid doc URL: %r", doc.original_url)
                continue
            try:
                resp = await client.get(clean_url)
                resp.raise_for_status()
                data = resp.content

                ext = _extension_from_url(clean_url) or ".pdf"
                key = f"documents/{event_id}/{doc.id}{ext}"
                url = await storage.save(key, data)
                doc.file_path = url
                doc.file_size_bytes = len(data)
                doc.downloaded = True
                logger.info("Uploaded doc %s → %s", doc.original_url, url)
            except Exception:
                logger.exception("Failed to upload doc %s", doc.original_url)


def _extension_from_url(url: str) -> str | None:
    """Extract file extension from a URL path."""
    path = PurePosixPath(urlparse(url).path)
    ext = path.suffix.lower()
    if ext and len(ext) <= 6:  # e.g. .pdf, .jpg, .png
        return ext
    return None


def _clean_url(url: str) -> str | None:
    """Strip whitespace/control characters and validate a URL."""
    cleaned = url.strip().replace("\t", "").replace("\n", "").replace("\r", "")
    if cleaned and cleaned.startswith(("http://", "https://")):
        return cleaned
    return None


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
        # Record field-level diffs before updating
        has_changes = await _record_changes(db, existing, data, run_id)

        # Mark for AI re-processing if meaningful fields changed
        if has_changes and existing.review_status != EventReviewStatus.REJECTED:
            existing.ai_pending = True

        # Save current bucket URL before _apply_event_fields overwrites it
        prev_bucket_url = existing.image_url
        try:
            raw = json.loads(existing.raw_data) if existing.raw_data else {}
        except (json.JSONDecodeError, TypeError):
            raw = {}
        prev_source_image = raw.get("image_url")

        _apply_event_fields(existing, data)

        # Handle image: upload if source changed, else restore bucket URL
        if data.image_url and data.image_url != prev_source_image:
            bucket_url = await _upload_image(
                source_name,
                slugify(data.title)[:200] if data.title else str(uuid.uuid4()),
                data.image_url,
            )
            if bucket_url:
                existing.image_url = bucket_url
        elif prev_bucket_url:
            existing.image_url = prev_bucket_url

        existing.scraping_run_id = run_id
        existing.last_seen_at = datetime.now(timezone.utc)

        # Replace variants, pricing phases, and documents
        await _replace_child_records(db, existing.id, data)

        await db.flush()
        return False

    # Upload image to bucket before persisting
    bucket_image_url = await _upload_image(
        source_name,
        slugify(data.title)[:200] if data.title else str(uuid.uuid4()),
        data.image_url,
    )

    event = ScrapedEvent(
        scraping_run_id=run_id,
        source_name=source_name,
        source_url=data.source_url,
        source_event_id=data.source_event_id,
        slug=slugify(data.title)[:500] if data.title else None,
        review_status=EventReviewStatus.PENDING,
        ai_pending=True,
        raw_data=data.raw_data,
        last_seen_at=datetime.now(timezone.utc),
    )
    _apply_event_fields(event, data)
    # Override image_url with the bucket URL if upload succeeded
    if bucket_image_url:
        event.image_url = bucket_image_url
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

    # Upload documents to bucket
    await _upload_event_documents_inline(event.id, db)

    return True


async def _replace_child_records(
    db: AsyncSession,
    event_id: uuid.UUID,
    data: ScrapedEventData,
) -> None:
    """Delete and re-create variants, pricing phases, and documents.

    Only touches each child table when the scraper actually provides new
    data for that category, so a scraper that never returns variants
    won't accidentally wipe previously stored ones.
    """
    if data.variants:
        await db.execute(
            delete(ScrapedVariant).where(ScrapedVariant.event_id == event_id)
        )
        for v in data.variants:
            db.add(
                ScrapedVariant(
                    event_id=event_id,
                    name=v.name,
                    distance_km=v.distance_km,
                    elevation_gain_m=v.elevation_gain_m,
                    elevation_loss_m=v.elevation_loss_m,
                    start_time=v.start_time,
                    price=v.price,
                    currency=v.currency,
                )
            )

    if data.pricing_phases:
        await db.execute(
            delete(ScrapedPricingPhase).where(
                ScrapedPricingPhase.event_id == event_id
            )
        )
        for p in data.pricing_phases:
            db.add(
                ScrapedPricingPhase(
                    event_id=event_id,
                    variant_name=p.variant_name,
                    phase_name=p.phase_name,
                    start_date=p.start_date,
                    end_date=p.end_date,
                    price=p.price,
                    currency=p.currency,
                    note=p.note,
                )
            )

    if data.documents:
        await db.execute(
            delete(ScrapedDocument).where(ScrapedDocument.event_id == event_id)
        )
        for d in data.documents:
            db.add(
                ScrapedDocument(
                    event_id=event_id,
                    document_type=d.document_type,
                    original_url=d.original_url,
                    file_name=d.file_name,
                    mime_type=d.mime_type,
                )
            )
        await db.flush()
        # Upload new documents to bucket
        await _upload_event_documents_inline(event_id, db)


async def _record_changes(
    db: AsyncSession,
    existing: ScrapedEvent,
    data: ScrapedEventData,
    run_id: uuid.UUID | None,
) -> bool:
    """Compare tracked fields and insert change-log rows for any diffs.

    Returns True if at least one tracked field changed.
    """
    sport_types_str = ",".join(data.sport_types) if data.sport_types else None

    new_values = {
        "title": data.title,
        "description": data.description,
        "sport_types": sport_types_str,
        "start_date": data.start_date.isoformat() if data.start_date else None,
        "end_date": data.end_date.isoformat() if data.end_date else None,
        "registration_deadline": data.registration_deadline.isoformat() if data.registration_deadline else None,
        "city": data.city,
        "country": data.country,
        "organizer_name": data.organizer_name,
        "external_url": data.external_url,
        "image_url": data.image_url,
    }

    changed = False
    for field in _TRACKED_FIELDS:
        old_raw = getattr(existing, field, None)
        # Normalize datetime comparison: strip tzinfo for consistent format
        if hasattr(old_raw, "isoformat"):
            old_val = old_raw.replace(tzinfo=None).isoformat() if old_raw else None
        else:
            old_val = str(old_raw) if old_raw is not None else None
        new_val = new_values.get(field)
        if old_val != new_val:
            changed = True
            db.add(
                EventChangeLog(
                    event_id=existing.id,
                    scraping_run_id=run_id,
                    field_name=field,
                    old_value=old_val,
                    new_value=new_val,
                )
            )
    return changed


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
    event.raw_pricing_text = data.raw_pricing_text
    event.raw_data = data.raw_data


# ── Auto AI generate + Next.js import ────────────────────────────────────────


async def generate_and_import_event(
    event_id: uuid.UUID, db: AsyncSession,
) -> dict | None:
    """Run AI generation and forward the result to the Next.js import endpoint.

    Returns the Next.js response JSON on success, or None on failure.
    This is designed to be called automatically for new events, so it
    never raises — all errors are logged and swallowed.
    """
    from app.services.ai_generator import generate_event_json, _read_document_text
    from app.core.config import settings as cfg

    # Need both OpenAI key and Next.js URL configured
    if not cfg.openai_api_key or not cfg.nextjs_url:
        logger.debug("AI auto-generate skipped: missing openai_api_key or nextjs_url")
        return None

    try:
        # Load full event with relations
        result = await db.execute(
            select(ScrapedEvent)
            .options(
                selectinload(ScrapedEvent.variants),
                selectinload(ScrapedEvent.pricing_phases),
                selectinload(ScrapedEvent.documents),
            )
            .where(ScrapedEvent.id == event_id)
        )
        event = result.scalar_one_or_none()
        if not event:
            logger.warning("Auto-generate: event %s not found", event_id)
            return None

        # Skip if already approved and not pending re-processing
        if event.review_status == EventReviewStatus.APPROVED and not event.ai_pending:
            logger.debug("Auto-generate skipped for %s — already approved", event.title)
            return None

        # Skip if rejected
        if event.review_status == EventReviewStatus.REJECTED:
            logger.debug("Auto-generate skipped for %s — rejected", event.title)
            return None

        # Skip if no image (AI generation requires it)
        if not event.image_url:
            logger.info("Auto-generate skipped for %s — no image", event.title)
            return None

        # Collect PDF documents
        docs = [
            d for d in event.documents
            if d.original_url and (
                (d.mime_type and "pdf" in d.mime_type)
                or (d.file_name and d.file_name.lower().endswith(".pdf"))
                or (d.original_url and d.original_url.lower().endswith(".pdf"))
                or d.document_type == "regulation"
            )
        ]

        # Build event data dict
        event_data = {
            "title": event.title,
            "source_url": event.source_url,
            "description": event.description,
            "sport_types": event.sport_types,
            "start_date": str(event.start_date) if event.start_date else None,
            "end_date": str(event.end_date) if event.end_date else None,
            "registration_deadline": str(event.registration_deadline) if event.registration_deadline else None,
            "city": event.city,
            "country": event.country,
            "latitude": event.latitude,
            "longitude": event.longitude,
            "organizer_name": event.organizer_name,
            "external_url": event.external_url,
            "image_url": event.image_url,
            "variants": [
                {
                    "name": v.name,
                    "distance_km": v.distance_km,
                    "elevation_gain_m": v.elevation_gain_m,
                    "elevation_loss_m": v.elevation_loss_m,
                    "price": v.price,
                    "currency": v.currency,
                    "start_time": v.start_time,
                }
                for v in event.variants
            ],
            "raw_pricing_text": event.raw_pricing_text,
        }

        logger.info(
            "Auto-generate AI for new event: %s (id=%s)", event.title, event_id,
        )

        # Extract text from documents
        doc_texts: list[dict[str, str]] = []
        for doc in docs:
            text = await _read_document_text(doc.original_url)
            if text:
                doc_texts.append({"name": doc.file_name or doc.document_type, "content": text})

        if not doc_texts and event.external_url:
            page_text = await _read_document_text(event.external_url)
            if page_text:
                doc_texts.append({"name": "event_page", "content": page_text})

        # Call OpenAI
        generated = await generate_event_json(event_data, doc_texts)

        # Handle rejection
        if generated.get("rejected"):
            reason = generated.get("reason", "Not a sports event")
            event.review_status = EventReviewStatus.REJECTED
            event.review_notes = f"AI auto-rejected: {reason}"
            event.is_hidden = True
            event.ai_pending = False
            event.ai_output = json.dumps(generated, ensure_ascii=False, default=str)
            await db.flush()
            logger.info("Auto-generate: AI rejected %s — %s", event.title, reason)
            return None

        # Save AI debug data
        ai_input_data = {
            "event_data": event_data,
            "documents": [{"name": d["name"], "content_length": len(d["content"])} for d in doc_texts],
        }
        event.ai_input = json.dumps(ai_input_data, ensure_ascii=False, default=str)
        event.ai_output = json.dumps(generated, ensure_ascii=False, default=str)

        # Inject image + external URL
        generated["imageUrl"] = event.image_url
        if not generated.get("externalUrl"):
            generated["externalUrl"] = event.external_url or event.source_url
        generated["scrapedEventId"] = str(event_id)

        # Forward to Next.js
        nextjs_url = f"{cfg.nextjs_url}/api/admin/events/import"
        headers: dict[str, str] = {"Content-Type": "application/json"}
        if cfg.nextjs_import_secret:
            headers["X-Import-Secret"] = cfg.nextjs_import_secret

        async with httpx.AsyncClient(timeout=180) as client:
            resp = await client.post(nextjs_url, json=generated, headers=headers)

        if resp.status_code not in (200, 201):
            logger.error(
                "Auto-generate: Next.js import failed for %s (%d): %s",
                event.title, resp.status_code, resp.text[:500],
            )
            return None

        # Mark as approved
        event.review_status = EventReviewStatus.APPROVED
        event.athlifyr_event_id = resp.json().get("id")
        event.reviewed_at = datetime.now(timezone.utc)
        event.ai_pending = False
        await db.flush()

        logger.info(
            "Auto-generate: successfully imported %s → athlifyr_id=%s",
            event.title, event.athlifyr_event_id,
        )
        return resp.json()

    except Exception:
        logger.exception("Auto-generate failed for event %s", event_id)
        return None
