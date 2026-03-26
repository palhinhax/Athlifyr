"""Scraping orchestration service — runs scrapers, persists results, downloads docs."""

from __future__ import annotations

import asyncio
import json
import logging
import uuid
import xml.etree.ElementTree as ET
from datetime import date, datetime, timezone
from pathlib import PurePosixPath
from urllib.parse import urlparse

import httpx
from slugify import slugify
from sqlalchemy import cast, delete, func, select, Date as SADate
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
    "external_url",
    # NOTE: image_url is excluded — the DB stores the bucket URL while
    # scraped data has the source URL, so they always differ and would
    # trigger false-positive change detection + unnecessary AI reruns.
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
        skipped = 0
        today = date.today()

        for ev_data in events_data:
            # Skip past events — only future/upcoming events are relevant.
            event_date = ev_data.start_date or ev_data.end_date
            if event_date is not None and event_date.date() < today:
                logger.debug("[PAST] Skipping past event: %s (%s)", ev_data.title, event_date.date())
                skipped += 1
                continue

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
                    logger.info("[NEW] %s — queuing for AI", ev_data.title)
                    if ev_row:
                        ai_event_ids.append(ev_row[0])
                else:
                    updated += 1
                    # Also queue for AI if something changed (ai_pending=True)
                    if ev_row and ev_row[1]:
                        logger.info("[CHANGED] %s — queuing for AI re-processing", ev_data.title)
                        ai_event_ids.append(ev_row[0])
                    else:
                        logger.info("[UNCHANGED] %s — skipping AI", ev_data.title)
            except Exception:
                logger.exception("Failed to upsert event: %s", ev_data.source_url)
                failed += 1

        run.events_found = len(events_data)
        run.events_created = created
        run.events_updated = updated
        run.events_failed = failed
        run.status = ScrapingRunStatus.COMPLETED

        logger.info(
            "[%s] Run complete — found: %d | new: %d | existing: %d | failed: %d | skipped (past): %d | AI queue: %d",
            source_name, len(events_data), created, updated, failed, skipped, len(ai_event_ids),
        )

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
        await _run_ai_batch(ai_event_ids)

    return run


_AI_CONCURRENCY = 10


async def _run_ai_batch(event_ids: list[uuid.UUID]) -> None:
    """Process AI generation for a batch of events with bounded concurrency."""
    from app.db.session import async_session

    sem = asyncio.Semaphore(_AI_CONCURRENCY)

    async def _process(eid: uuid.UUID) -> None:
        async with sem:
            async with async_session() as db:
                try:
                    await generate_and_import_event(eid, db)
                    await db.commit()
                except Exception:
                    logger.exception("Auto-generate failed for event %s", eid)

    await asyncio.gather(*[_process(eid) for eid in event_ids])


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


async def _delete_bucket_object(bucket_url: str) -> None:
    """Delete an object from the storage bucket given its full URL."""
    storage = get_storage()
    try:
        from app.core.config import settings as _cfg
        if _cfg.storage_backend == "s3":
            prefix = f"{_cfg.storage_s3_endpoint}/{_cfg.storage_s3_bucket}/"
            if bucket_url.startswith(prefix):
                key = bucket_url[len(prefix):]
                await storage.delete(key)
                return
        else:
            # Local storage
            prefix = str(_cfg.storage_local_path) + "/"
            if bucket_url.startswith(prefix):
                key = bucket_url[len(prefix):]
                await storage.delete(key)
                return
        logger.warning("Could not extract key from bucket URL: %s", bucket_url[:200])
    except Exception:
        logger.exception("Failed to delete old image: %s", bucket_url[:200])


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
        ext = _extension_from_url(image_url) or ".jpg"
        key = f"images/{source_name}/{event_slug}{ext}"

        # Skip download+upload if already in the bucket
        if await storage.exists(key):
            logger.info("  ↳ Image already in bucket, skipping upload: %s", key)
            # Re-call save would overwrite; just return the expected URL.
            # For S3 the URL is endpoint/bucket/key; for local it's the path.
            # We can simply call save with existing data, but cheaper to
            # reconstruct the URL that save() would have returned.
            from app.core.config import settings as _cfg
            if _cfg.storage_backend == "s3":
                return f"{_cfg.storage_s3_endpoint}/{_cfg.storage_s3_bucket}/{key}"
            return str(_cfg.storage_local_path + "/" + key)

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


async def _upload_variant_gpx_files(
    event_id: uuid.UUID, db: AsyncSession,
) -> None:
    """Download and upload GPX files for variants that have a gpx_url but no gpx_file_path."""
    result = await db.execute(
        select(ScrapedVariant).where(
            ScrapedVariant.event_id == event_id,
            ScrapedVariant.gpx_url.isnot(None),
            ScrapedVariant.gpx_file_path.is_(None),
        )
    )
    variants = result.scalars().all()
    if not variants:
        return

    storage = get_storage()
    async with httpx.AsyncClient(follow_redirects=True, timeout=_DOWNLOAD_TIMEOUT) as client:
        for v in variants:
            clean_url = _clean_url(v.gpx_url)
            if not clean_url:
                continue
            try:
                resp = await client.get(clean_url)
                resp.raise_for_status()
                data = resp.content
                ext = _extension_from_url(clean_url) or ".gpx"
                key = f"gpx/{event_id}/{v.id}{ext}"
                url = await storage.save(key, data)
                v.gpx_file_path = url
                logger.info("Uploaded GPX %s → %s", v.gpx_url, url)
            except Exception:
                logger.exception("Failed to upload GPX %s", v.gpx_url)


def _extract_gpx_start_coords(gpx_content: bytes) -> tuple[float, float] | None:
    """Extract the starting point (lat, lon) from GPX file content.

    Tries track points first, then route points, then waypoints.
    """
    try:
        root = ET.fromstring(gpx_content)
        ns = "http://www.topografix.com/GPX/1/1"
        for tag in ("trkpt", "rtept", "wpt"):
            elem = root.find(f".//{{{ns}}}{tag}")
            if elem is None:
                elem = root.find(f".//{tag}")
            if elem is not None:
                lat_s = elem.get("lat")
                lon_s = elem.get("lon")
                if lat_s and lon_s:
                    return (float(lat_s), float(lon_s))
    except Exception:
        logger.warning("Failed to parse GPX for start coordinates")
    return None


async def _get_gpx_start_coords_for_event(
    variants: list[ScrapedVariant],
) -> tuple[float, float] | None:
    """Return (lat, lon) from the first variant that has a downloadable GPX file."""
    async with httpx.AsyncClient(follow_redirects=True, timeout=_DOWNLOAD_TIMEOUT) as client:
        for v in variants:
            url = v.gpx_file_path or v.gpx_url
            if not url:
                continue
            try:
                resp = await client.get(url)
                resp.raise_for_status()
                coords = _extract_gpx_start_coords(resp.content)
                if coords:
                    return coords
            except Exception:
                logger.debug("Could not fetch GPX from %s for coord extraction", url)
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
    # 1. Same-source match (exact source_url)
    result = await db.execute(
        select(ScrapedEvent).where(
            ScrapedEvent.source_name == source_name,
            ScrapedEvent.source_url == data.source_url,
        )
    )
    existing = result.scalar_one_or_none()

    # 2. Cross-source deduplication: if no same-source match, look for an
    #    event from *any* source with a matching title and same start_date.
    #    Strategy (in order):
    #      a) Exact slug match + same date
    #      b) One slug contains the other + same date (handles prefix/suffix diffs)
    if existing is None and data.title and data.start_date:
        candidate_slug = slugify(data.title)[:500]
        # Also build a slug without a trailing 4-digit year suffix to use as fallback
        import re as _re
        candidate_slug_no_year = _re.sub(r'-\d{4}$', '', candidate_slug)
        target_date = data.start_date.date() if hasattr(data.start_date, 'date') else data.start_date
        if candidate_slug:
            # a) Exact slug match + same date (date only, ignore time/tz)
            result = await db.execute(
                select(ScrapedEvent).where(
                    ScrapedEvent.slug == candidate_slug,
                    cast(ScrapedEvent.start_date, SADate) == target_date,
                    ScrapedEvent.source_name != source_name,
                )
            )
            cross_match = result.scalar_one_or_none()

            # b) Partial slug containment (one contains the other) + same date
            if cross_match is None:
                result = await db.execute(
                    select(ScrapedEvent).where(
                        cast(ScrapedEvent.start_date, SADate) == target_date,
                        ScrapedEvent.source_name != source_name,
                        ScrapedEvent.slug.isnot(None),
                    )
                )
                candidates = result.scalars().all()
                for c in candidates:
                    if not c.slug:
                        continue
                    c_slug_no_year = _re.sub(r'-\d{4}$', '', c.slug)
                    # Match if slugs overlap after stripping trailing year
                    if (
                        candidate_slug in c.slug
                        or c.slug in candidate_slug
                        or candidate_slug_no_year == c_slug_no_year
                        or candidate_slug_no_year == c.slug
                        or c_slug_no_year == candidate_slug
                    ):
                        cross_match = c
                        break

            if cross_match:
                logger.info(
                    "[CROSS-SOURCE] Merging '%s' (from %s) into existing '%s' (from %s)",
                    data.title, source_name, cross_match.title, cross_match.source_name,
                )
                existing = cross_match

    if existing:
        is_cross_source = existing.source_name != source_name

        # Record field-level diffs before updating
        has_changes = await _record_changes(db, existing, data, run_id)

        # Mark for AI re-processing if meaningful fields changed
        if has_changes and existing.review_status != EventReviewStatus.REJECTED:
            existing.ai_pending = True
            logger.info("  ↳ Fields changed → ai_pending=True (status=%s)", existing.review_status)
        elif has_changes:
            logger.info("  ↳ Fields changed but status=%s → skipping AI", existing.review_status)
        else:
            logger.debug("  ↳ No field changes detected")

        # Save current bucket URL before _apply_event_fields overwrites it
        prev_bucket_url = existing.image_url
        try:
            raw = json.loads(existing.raw_data) if existing.raw_data else {}
        except (json.JSONDecodeError, TypeError):
            raw = {}
        prev_source_image = raw.get("image_url")

        if is_cross_source:
            _enrich_event_fields(existing, data)
        else:
            _apply_event_fields(existing, data)

        # Handle image: for APPROVED events, always preserve the existing
        # bucket image (it may have been manually replaced by an operator).
        # For non-approved events, upload if the source URL changed.
        if existing.review_status == EventReviewStatus.APPROVED and prev_bucket_url:
            logger.debug("  ↳ Event is APPROVED → preserving existing image")
            existing.image_url = prev_bucket_url
        elif data.image_url and data.image_url != prev_source_image:
            logger.info("  ↳ Image source changed → uploading new image")
            bucket_url = await _upload_image(
                source_name,
                slugify(data.title)[:200] if data.title else str(uuid.uuid4()),
                data.image_url,
            )
            if bucket_url:
                # Delete old image from bucket if it differs from the new one
                if prev_bucket_url and prev_bucket_url != bucket_url:
                    await _delete_bucket_object(prev_bucket_url)
                existing.image_url = bucket_url
        elif prev_bucket_url:
            logger.debug("  ↳ Image unchanged → keeping bucket URL")
            existing.image_url = prev_bucket_url

        existing.scraping_run_id = run_id
        existing.last_seen_at = datetime.now(timezone.utc)

        # Replace variants, pricing phases, and documents
        await _replace_child_records(db, existing.id, data, merge_only=is_cross_source)

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
                gpx_url=v.gpx_url,
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

    # Upload GPX files for variants
    await _upload_variant_gpx_files(event.id, db)

    return True


async def _replace_child_records(
    db: AsyncSession,
    event_id: uuid.UUID,
    data: ScrapedEventData,
    *,
    merge_only: bool = False,
) -> None:
    """Update child records (variants, pricing phases, documents).

    When *merge_only* is True (cross-source merge), only **add** new data
    without deleting existing records — this preserves GPX, documents, etc.
    already attached from a richer source.

    When *merge_only* is False (same-source update), replaces child records
    as before.  Only touches each child table when the scraper actually
    provides new data for that category.
    """
    if data.variants:
        existing_variants_result = await db.execute(
            select(ScrapedVariant).where(ScrapedVariant.event_id == event_id)
        )
        existing_variants = existing_variants_result.scalars().all()

        if merge_only:
            # Cross-source: only add new info, never delete existing variants.
            # Enrich existing variants with GPX if they don't have one yet.
            existing_by_name = {v.name: v for v in existing_variants}
            for v in data.variants:
                ev = existing_by_name.get(v.name)
                if ev:
                    # Fill in blanks on the existing variant
                    if v.gpx_url and not ev.gpx_url:
                        ev.gpx_url = v.gpx_url
                    if v.distance_km and not ev.distance_km:
                        ev.distance_km = v.distance_km
                    if v.elevation_gain_m and not ev.elevation_gain_m:
                        ev.elevation_gain_m = v.elevation_gain_m
                    if v.elevation_loss_m and not ev.elevation_loss_m:
                        ev.elevation_loss_m = v.elevation_loss_m
                    if v.price is not None and ev.price is None:
                        ev.price = v.price
                    if v.start_time and not ev.start_time:
                        ev.start_time = v.start_time
                else:
                    # New variant not in existing set → add it
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
                            gpx_url=v.gpx_url,
                        )
                    )
            await db.flush()
            await _upload_variant_gpx_files(event_id, db)
        else:
            # Same-source: replace all, preserving GPX bucket paths
            gpx_by_url: dict[str, str] = {
                v.gpx_url: v.gpx_file_path
                for v in existing_variants
                if v.gpx_url and v.gpx_file_path
            }

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
                        gpx_url=v.gpx_url,
                        gpx_file_path=gpx_by_url.get(v.gpx_url) if v.gpx_url else None,
                    )
                )
            await db.flush()
            await _upload_variant_gpx_files(event_id, db)

    if data.pricing_phases and not merge_only:
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
        # Build a map of existing docs keyed by original_url so we can
        # preserve already-downloaded files instead of re-downloading.
        existing_docs_result = await db.execute(
            select(ScrapedDocument).where(ScrapedDocument.event_id == event_id)
        )
        existing_by_url: dict[str, ScrapedDocument] = {
            doc.original_url: doc
            for doc in existing_docs_result.scalars().all()
            if doc.original_url
        }

        incoming_urls = {d.original_url for d in data.documents if d.original_url}

        # In same-source mode, delete docs whose URL is no longer scraped.
        # In merge mode, never delete — only add.
        if not merge_only:
            for url, doc in existing_by_url.items():
                if url not in incoming_urls:
                    if doc.file_path:
                        await _delete_bucket_object(doc.file_path)
                    await db.delete(doc)

        # Add or keep each incoming document
        for d in data.documents:
            existing_doc = existing_by_url.get(d.original_url)
            if existing_doc is not None:
                # Update metadata but preserve download state
                existing_doc.document_type = d.document_type
                existing_doc.file_name = d.file_name
                existing_doc.mime_type = d.mime_type
            else:
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
        # Upload only documents that haven't been downloaded yet
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
    }

    changed = False
    changed_fields: list[str] = []
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
            changed_fields.append(field)
            db.add(
                EventChangeLog(
                    event_id=existing.id,
                    scraping_run_id=run_id,
                    field_name=field,
                    old_value=old_val,
                    new_value=new_val,
                )
            )
    if changed_fields:
        logger.info("  ↳ Changed fields: %s", ", ".join(changed_fields))
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


def _enrich_event_fields(event: ScrapedEvent, data: ScrapedEventData) -> None:
    """Fill in blank fields on *event* from *data* without overwriting existing values.

    Used for cross-source merges so the richer source's data is preserved.
    """
    if data.description and not event.description:
        event.description = data.description
    if data.sport_types and not event.sport_types:
        event.sport_types = ",".join(data.sport_types)
    if data.start_date and not event.start_date:
        event.start_date = data.start_date
    if data.end_date and not event.end_date:
        event.end_date = data.end_date
    if data.registration_deadline and not event.registration_deadline:
        event.registration_deadline = data.registration_deadline
    if data.city and not event.city:
        event.city = data.city
    if data.latitude and not event.latitude:
        event.latitude = data.latitude
    if data.longitude and not event.longitude:
        event.longitude = data.longitude
    if data.google_maps_url and not event.google_maps_url:
        event.google_maps_url = data.google_maps_url
    if data.organizer_name and not event.organizer_name:
        event.organizer_name = data.organizer_name
    if data.external_url and not event.external_url:
        event.external_url = data.external_url
    if data.raw_pricing_text and not event.raw_pricing_text:
        event.raw_pricing_text = data.raw_pricing_text


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

        # Extract start coordinates from GPX files (helps AI with precise positioning)
        gpx_coords = await _get_gpx_start_coords_for_event(event.variants)

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
            "latitude": event.latitude or (gpx_coords[0] if gpx_coords else None),
            "longitude": event.longitude or (gpx_coords[1] if gpx_coords else None),
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
                    "gpx_url": v.gpx_file_path or v.gpx_url,
                }
                for v in event.variants
            ],
            "raw_pricing_text": event.raw_pricing_text,
        }

        # Include admin notes as extra context for AI (if provided)
        if event.admin_notes:
            event_data["admin_notes"] = event.admin_notes

        logger.info(
            "Auto-generate AI for new event: %s (id=%s)", event.title, event_id,
        )

        # Extract text from documents
        doc_texts: list[dict[str, str]] = []
        for doc in docs:
            text = await _read_document_text(doc.original_url)
            if text:
                doc_texts.append({"name": doc.file_name or doc.document_type, "content": text})
            else:
                logger.warning(
                    "Could not extract text from document %s (image-based PDF?)",
                    doc.file_name or doc.original_url,
                )

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
        generated["sourceName"] = event.source_name

        # Inject gpxUrl per variant by matching AI-generated variant names to scraped variants
        gpx_url_by_name: dict[str, str] = {
            v.name.lower(): (v.gpx_file_path or v.gpx_url)
            for v in event.variants
            if (v.gpx_file_path or v.gpx_url)
        }
        for v in generated.get("variants", []):
            name_key = (v.get("name") or "").lower()
            gpx_url = gpx_url_by_name.get(name_key)
            if not gpx_url:
                for scraped_name, url in gpx_url_by_name.items():
                    if scraped_name in name_key or name_key in scraped_name:
                        gpx_url = url
                        break
            if gpx_url:
                v["gpxUrl"] = gpx_url

        # Inject document bucket URLs so the frontend can link to them
        if docs:
            generated["documents"] = [
                {
                    "type": d.document_type or "regulation",
                    "name": d.file_name or d.document_type or "document",
                    "url": d.file_path or d.original_url,
                }
                for d in docs
                if d.file_path or d.original_url
            ]

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
