"""API routes for scraping management."""

from __future__ import annotations

import json
import logging
import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Query

logger = logging.getLogger(__name__)
from sqlalchemy import and_, delete as sa_delete, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

import httpx

from app.api.auth import require_api_key
from app.db.session import get_db
from app.models.models import (
    DedupPair,
    EventChangeLog,
    EventReviewStatus,
    ScrapedDocument,
    ScrapedEvent,
    ScrapingRun,
    SourceConfig,
)
from app.schemas.schemas import (
    DedupDetectOut,
    DedupPairOut,
    EventChangeLogOut,
    PaginatedDedupPairsOut,
    PaginatedEventsOut,
    PaginatedRunsOut,
    ScrapedEventListOut,
    ScrapedEventOut,
    ScrapedEventUpdate,
    ScrapingRunCreate,
    ScrapingRunOut,
    SourceConfigOut,
    SourceConfigUpdate,
    StatsOut,
)
from app.services.scraping_service import (
    download_event_documents,
    get_or_create_source_config,
    run_scraper,
    scrape_single_event,
    update_source_config,
)
from app.sources.registry import list_sources

router = APIRouter(dependencies=[Depends(require_api_key)])


# ── Sources ───────────────────────────────────────────────────────────────────


@router.get("/sources", response_model=list[SourceConfigOut])
async def get_sources(
    db: AsyncSession = Depends(get_db),
) -> list[SourceConfigOut]:
    """List all registered sources with their runtime config and status."""
    static = list_sources()
    out: list[SourceConfigOut] = []
    for src in static:
        cfg = await get_or_create_source_config(db, src["name"])
        out.append(
            SourceConfigOut(
                source_name=cfg.source_name,
                display_name=src["display_name"],
                base_url=src["base_url"],
                description=src["description"],
                enabled=cfg.enabled,
                interval_hours=cfg.interval_hours,
                last_run_at=cfg.last_run_at,
                last_success_at=cfg.last_success_at,
                last_error=cfg.last_error,
                events_total=cfg.events_total,
            )
        )
    await db.commit()  # commit any newly created configs
    return out


@router.patch("/sources/{source_name}", response_model=SourceConfigOut)
async def patch_source(
    source_name: str,
    body: SourceConfigUpdate,
    db: AsyncSession = Depends(get_db),
) -> SourceConfigOut:
    """Toggle enabled/disabled or change scraping interval."""
    # Validate source exists in registry
    known = {s["name"] for s in list_sources()}
    if source_name not in known:
        raise HTTPException(status_code=404, detail="Source not found")

    cfg = await update_source_config(
        db,
        source_name,
        enabled=body.enabled,
        interval_hours=body.interval_hours,
    )
    src = next(s for s in list_sources() if s["name"] == source_name)
    return SourceConfigOut(
        source_name=cfg.source_name,
        display_name=src["display_name"],
        base_url=src["base_url"],
        description=src["description"],
        enabled=cfg.enabled,
        interval_hours=cfg.interval_hours,
        last_run_at=cfg.last_run_at,
        last_success_at=cfg.last_success_at,
        last_error=cfg.last_error,
        events_total=cfg.events_total,
    )


# ── Scraping Runs ─────────────────────────────────────────────────────────────


@router.post("/runs", response_model=ScrapingRunOut)
async def create_run(
    body: ScrapingRunCreate,
    db: AsyncSession = Depends(get_db),
) -> ScrapingRun:
    """Trigger a new scraping run for a given source."""
    return await run_scraper(body.source_name, db)


@router.post("/runs/all", response_model=list[ScrapingRunOut])
async def run_all_sources(
    db: AsyncSession = Depends(get_db),
) -> list[ScrapingRun]:
    """Trigger scraping for all enabled sources."""
    runs: list[ScrapingRun] = []
    for src in list_sources():
        cfg = await get_or_create_source_config(db, src["name"])
        if not cfg.enabled:
            continue
        run = await run_scraper(src["name"], db)
        runs.append(run)
    return runs


@router.get("/runs", response_model=PaginatedRunsOut)
async def list_runs(
    source_name: str | None = None,
    status: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> dict:
    conditions = []
    if source_name:
        conditions.append(ScrapingRun.source_name == source_name)
    if status:
        conditions.append(ScrapingRun.status == status)

    where_clause = and_(*conditions) if conditions else True

    total = await db.scalar(
        select(func.count(ScrapingRun.id)).where(where_clause)
    ) or 0

    offset = (page - 1) * page_size
    stmt = (
        select(ScrapingRun)
        .where(where_clause)
        .order_by(ScrapingRun.created_at.desc())
        .limit(page_size)
        .offset(offset)
    )
    result = await db.execute(stmt)
    items = list(result.scalars().all())

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get("/runs/{run_id}", response_model=ScrapingRunOut)
async def get_run(
    run_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> ScrapingRun:
    result = await db.execute(select(ScrapingRun).where(ScrapingRun.id == run_id))
    run = result.scalar_one_or_none()
    if not run:
        raise HTTPException(status_code=404, detail="Run not found")
    return run


@router.delete("/runs")
async def clear_runs(
    older_than_days: int = Query(default=7, ge=1, le=365),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Delete completed/failed runs older than N days.

    Running runs are never deleted. The scraped_events.scraping_run_id
    FK uses ON DELETE SET NULL, so events are preserved.
    """
    cutoff = datetime.now(timezone.utc) - timedelta(days=older_than_days)

    stmt = (
        select(func.count(ScrapingRun.id))
        .where(
            ScrapingRun.status.in_(["completed", "failed"]),
            ScrapingRun.created_at < cutoff,
        )
    )
    count = await db.scalar(stmt) or 0

    if count > 0:
        delete_stmt = sa_delete(ScrapingRun).where(
            ScrapingRun.status.in_(["completed", "failed"]),
            ScrapingRun.created_at < cutoff,
        )
        await db.execute(delete_stmt)
        await db.commit()

    logger.info("Cleared %d runs older than %d days", count, older_than_days)
    return {"deleted": count, "older_than_days": older_than_days}


# ── Scraped Events ────────────────────────────────────────────────────────────


@router.get("/events", response_model=PaginatedEventsOut)
async def list_events(
    source_name: str | None = None,
    review_status: str | None = None,
    sport_type: str | None = None,
    city: str | None = None,
    country: str | None = None,
    date_from: datetime | None = None,
    date_to: datetime | None = None,
    is_hidden: bool | None = None,
    has_image: bool | None = None,
    has_documents: bool | None = None,
    future_only: bool = True,
    search: str | None = None,
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort_by: str = Query(default="start_date"),
    sort_dir: str = Query(default="asc"),
    db: AsyncSession = Depends(get_db),
) -> dict:
    # ── Build base WHERE conditions ──
    conditions = []
    if future_only:
        now = datetime.now(timezone.utc)
        conditions.append(
            (ScrapedEvent.start_date.is_(None)) | (ScrapedEvent.start_date >= now)
        )
    if source_name:
        conditions.append(ScrapedEvent.source_name == source_name)
    if review_status:
        conditions.append(ScrapedEvent.review_status == review_status)
    if sport_type:
        conditions.append(ScrapedEvent.sport_types.icontains(sport_type))
    if city:
        conditions.append(ScrapedEvent.city.ilike(f"%{city}%"))
    if country:
        conditions.append(ScrapedEvent.country.ilike(f"%{country}%"))
    if date_from:
        conditions.append(ScrapedEvent.start_date >= date_from)
    if date_to:
        conditions.append(ScrapedEvent.start_date <= date_to)
    if is_hidden is not None:
        conditions.append(ScrapedEvent.is_hidden == is_hidden)
    if has_image is True:
        conditions.append(
            ScrapedEvent.image_url.isnot(None),
        )
        conditions.append(ScrapedEvent.image_url != "")
    elif has_image is False:
        conditions.append(
            (ScrapedEvent.image_url.is_(None)) | (ScrapedEvent.image_url == "")
        )
    if has_documents is True:
        conditions.append(
            ScrapedEvent.id.in_(select(ScrapedDocument.event_id).distinct())
        )
    elif has_documents is False:
        conditions.append(
            ~ScrapedEvent.id.in_(select(ScrapedDocument.event_id).distinct())
        )
    if search:
        conditions.append(
            ScrapedEvent.title.ilike(f"%{search}%")
            | ScrapedEvent.city.ilike(f"%{search}%")
        )

    where_clause = and_(*conditions) if conditions else True

    # ── Total count ──
    total = await db.scalar(
        select(func.count(ScrapedEvent.id)).where(where_clause)
    ) or 0

    # ── Sorting ──
    sort_columns = {
        "start_date": ScrapedEvent.start_date,
        "title": ScrapedEvent.title,
        "source_name": ScrapedEvent.source_name,
        "created_at": ScrapedEvent.created_at,
        "review_status": ScrapedEvent.review_status,
    }
    sort_col = sort_columns.get(sort_by, ScrapedEvent.start_date)
    order = sort_col.desc().nullslast() if sort_dir == "desc" else sort_col.asc().nullslast()

    # ── Paginated query ──
    offset = (page - 1) * page_size
    stmt = (
        select(ScrapedEvent)
        .options(selectinload(ScrapedEvent.documents))
        .where(where_clause)
        .order_by(order)
        .limit(page_size)
        .offset(offset)
    )
    result = await db.execute(stmt)
    events = list(result.scalars().all())

    # ── Pending with image count (for Generate All button) ──
    pending_img_conditions = [
        ScrapedEvent.review_status == "pending",
        ScrapedEvent.image_url.isnot(None),
        ScrapedEvent.image_url != "",
    ]
    if future_only:
        now = datetime.now(timezone.utc)
        pending_img_conditions.append(
            (ScrapedEvent.start_date.is_(None)) | (ScrapedEvent.start_date >= now)
        )
    pending_with_image_total = await db.scalar(
        select(func.count(ScrapedEvent.id)).where(and_(*pending_img_conditions))
    ) or 0

    items = [
        {
            **{c.key: getattr(ev, c.key) for c in ev.__table__.columns},
            "has_image": bool(ev.image_url),
            "has_ai_output": bool(ev.ai_output),
            "documents_count": len(ev.documents),
        }
        for ev in events
    ]

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "pending_with_image_total": pending_with_image_total,
    }


@router.get("/events/{event_id}", response_model=ScrapedEventOut)
async def get_event(
    event_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> ScrapedEvent:
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
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.patch("/events/{event_id}", response_model=ScrapedEventOut)
async def update_event(
    event_id: uuid.UUID,
    body: ScrapedEventUpdate,
    db: AsyncSession = Depends(get_db),
) -> ScrapedEvent:
    """Edit a scraped event (review / correct data)."""
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
        raise HTTPException(status_code=404, detail="Event not found")

    update_data = body.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "review_status" and value:
            setattr(event, field, EventReviewStatus(value))
            event.reviewed_at = datetime.now(timezone.utc)
        else:
            setattr(event, field, value)

    await db.commit()
    await db.refresh(event)
    return event


# ── Event change history ─────────────────────────────────────────────────────


@router.delete("/events/{event_id}")
async def delete_event(
    event_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    """Delete a single scraped event and all its related data."""
    result = await db.execute(
        select(ScrapedEvent).where(ScrapedEvent.id == event_id)
    )
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    await db.delete(event)
    await db.commit()
    return {"status": "deleted"}


@router.post("/events/{event_id}/rescrape", response_model=ScrapedEventOut)
async def rescrape_event(
    event_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> ScrapedEvent:
    """Re-scrape an event from its source URL to refresh data."""
    result = await db.execute(
        select(ScrapedEvent).where(ScrapedEvent.id == event_id)
    )
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    updated = await scrape_single_event(event.source_name, event.source_url, db)
    if not updated:
        raise HTTPException(status_code=422, detail="Could not re-scrape event from source")
    return updated


# ── AI event generation ──────────────────────────────────────────────────────


@router.post("/events/{event_id}/generate")
async def generate_event(
    event_id: uuid.UUID,
    submit: bool = Query(default=True, description="Whether to forward the generated JSON to Next.js after generation"),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Use AI to generate a complete event JSON from scraped data and send it to Next.js.

    Flow:
    1. Load scraped event with all relations
    2. Download & extract text from PDF documents
    3. Send everything to OpenAI → get structured event JSON
    4. Forward JSON to Next.js POST /api/admin/events/import
    5. Return the created event
    """
    from app.services.ai_generator import generate_event_json, _read_document_text
    from app.core.config import settings as cfg

    # Load full event
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
        raise HTTPException(status_code=404, detail="Event not found")

    # Validate: must have image
    if not event.image_url:
        raise HTTPException(
            status_code=422,
            detail="Event must have an image before generating. Re-scrape or add an image first.",
        )

    # Collect usable documents
    docs = [
        d for d in event.documents
        if d.original_url and (
            (d.mime_type and "pdf" in d.mime_type)
            or (d.file_name and d.file_name.lower().endswith(".pdf"))
            or (d.original_url and d.original_url.lower().endswith(".pdf"))
            or d.document_type == "regulation"
        )
    ]

    # Build event data dict for AI
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
                "gpx_url": v.gpx_file_path or v.gpx_url,
            }
            for v in event.variants
        ],
        "raw_pricing_text": event.raw_pricing_text,
    }

    # Build lookup: variant name (lowercase) → bucket GPX URL for post-AI injection
    gpx_url_by_name: dict[str, str] = {
        v.name.lower(): (v.gpx_file_path or v.gpx_url)
        for v in event.variants
        if (v.gpx_file_path or v.gpx_url)
    }

    # Include admin notes as extra context for AI (if provided)
    if event.admin_notes:
        event_data["admin_notes"] = event.admin_notes

    # ── Merge data from confirmed duplicate pairs ──────────────────────────────
    # If this event is the primary in any confirmed dedup pairs, include the
    # secondary event's data so AI can produce a richer, merged result.
    merged_pairs_result = await db.execute(
        select(DedupPair)
        .options(
            selectinload(DedupPair.event_a).selectinload(ScrapedEvent.variants),
            selectinload(DedupPair.event_a).selectinload(ScrapedEvent.pricing_phases),
            selectinload(DedupPair.event_b).selectinload(ScrapedEvent.variants),
            selectinload(DedupPair.event_b).selectinload(ScrapedEvent.pricing_phases),
        )
        .where(DedupPair.primary_event_id == event.id, DedupPair.status == "confirmed")
    )
    merged_pairs = list(merged_pairs_result.scalars().all())
    if merged_pairs:
        merged_sources = []
        for mp in merged_pairs:
            # Secondary is whichever event is NOT the primary
            secondary = mp.event_b if mp.event_a_id == event.id else mp.event_a
            if not secondary:
                continue
            merged_sources.append({
                "source_name": secondary.source_name,
                "source_url": secondary.source_url,
                "title": secondary.title,
                "description": secondary.description,
                "raw_pricing_text": secondary.raw_pricing_text,
                "organizer_name": secondary.organizer_name,
                "external_url": secondary.external_url,
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
                    for v in secondary.variants
                ],
                "pricing_phases": [
                    {
                        "variant_name": pp.variant_name,
                        "phase_name": pp.phase_name,
                        "start_date": str(pp.start_date) if pp.start_date else None,
                        "end_date": str(pp.end_date) if pp.end_date else None,
                        "price": pp.price,
                        "currency": pp.currency,
                        "note": pp.note,
                    }
                    for pp in secondary.pricing_phases
                ],
            })
            # Also collect GPX urls from secondary for injection
            for v in secondary.variants:
                gpx = v.gpx_file_path or v.gpx_url
                if gpx:
                    gpx_url_by_name.setdefault(v.name.lower(), gpx)

        if merged_sources:
            event_data["merged_sources"] = merged_sources
            logger.info(
                "  Merged data from %d secondary event(s): %s",
                len(merged_sources),
                [s["source_name"] for s in merged_sources],
            )

    # Log what we're sending to AI
    logger.info(
        "Sending to AI: title=%s, variants=%d, city=%s, description_len=%d, raw_pricing=%s",
        event_data["title"],
        len(event_data["variants"]),
        event_data["city"],
        len(event_data.get("description") or ""),
        "yes" if event_data.get("raw_pricing_text") else "no",
    )
    for v in event_data["variants"]:
        logger.info("  Scraped variant: name=%s, distance=%s, price=%s", v["name"], v["distance_km"], v["price"])

    # Extract text from documents
    doc_texts: list[dict[str, str]] = []
    for doc in docs:
        text = await _read_document_text(doc.original_url)
        if text:
            doc_texts.append({
                "name": doc.file_name or doc.document_type,
                "content": text,
            })

    # If no doc texts extracted, try scraping the external URL for content
    if not doc_texts and event.external_url:
        page_text = await _read_document_text(event.external_url)
        if page_text:
            doc_texts.append({
                "name": "event_page",
                "content": page_text,
            })

    # Generate event JSON via OpenAI
    generated = await generate_event_json(event_data, doc_texts)

    # If AI rejected the event as not sports-relevant, mark it as hidden and return
    if generated.get("rejected"):
        reason = generated.get("reason", "Not a sports event")
        event.review_status = EventReviewStatus.REJECTED
        event.review_notes = f"AI auto-rejected: {reason}"
        event.is_hidden = True
        event.ai_pending = False
        event.ai_output = json.dumps(generated, ensure_ascii=False, default=str)
        await db.commit()
        raise HTTPException(
            status_code=422,
            detail=f"Event rejected by AI — not sports-relevant: {reason}",
        )

    # Save AI debug data to the event for inspection
    ai_input_data = {"event_data": event_data, "documents": [{"name": d["name"], "content_length": len(d["content"])} for d in doc_texts]}
    event.ai_input = json.dumps(ai_input_data, ensure_ascii=False, default=str)
    event.ai_output = json.dumps(generated, ensure_ascii=False, default=str)

    # If submit=False, stop here — just save the AI output for review
    if not submit:
        event.ai_pending = False
        await db.commit()
        return {"status": "analyzed", "ai_output": generated}

    # ── Run dedup detection against all other events ──────────────────────────
    # Use AI-returned coordinates (more accurate than scraped) if available
    ai_lat = generated.get("latitude")
    ai_lng = generated.get("longitude")
    if ai_lat and ai_lng:
        event.latitude = ai_lat
        event.longitude = ai_lng

    new_pairs = await _run_dedup_for_event(event, db)
    await db.flush()  # persist pairs before checking

    if new_pairs > 0:
        # Suspected duplicates found — save AI output but block submission
        event.ai_pending = False
        await db.commit()
        logger.warning(
            "Dedup: %d pending pair(s) found for '%s' — submission blocked pending admin review",
            new_pairs, event.title,
        )
        return {
            "status": "dedup_pending",
            "message": f"{new_pairs} possible duplicate(s) detected. Review in the Deduplication tab before submitting.",
            "dedup_pairs": new_pairs,
        }

    # No dedup conflicts — proceed to submit
    logger.info(
        "AI generated event: title=%s, variants=%d, faqs=%d, lat=%s, lng=%s, googleMapsUrl=%s",
        generated.get("title"),
        len(generated.get("variants", [])),
        len(generated.get("faqs", [])),
        generated.get("latitude"),
        generated.get("longitude"),
        generated.get("googleMapsUrl"),
    )
    for i, v in enumerate(generated.get("variants", [])):
        logger.info(
            "  Variant %d: name=%s, distanceKm=%s, price=%s, pricingPhases=%d",
            i, v.get("name"), v.get("distanceKm"), v.get("price"),
            len(v.get("pricingPhases", [])),
        )

    # Always inject image_url from the scraped event (bucket URL)
    # The AI does NOT control this field — we set it from our stored data
    generated["imageUrl"] = event.image_url

    # Inject gpxUrl per variant by matching AI-generated variant names to scraped variants
    for v in generated.get("variants", []):
        name_key = (v.get("name") or "").lower()
        gpx_url = gpx_url_by_name.get(name_key)
        if not gpx_url:
            # Fuzzy fallback: find the first scraped variant whose name contains
            # the AI-generated name or vice versa
            for scraped_name, url in gpx_url_by_name.items():
                if scraped_name in name_key or name_key in scraped_name:
                    gpx_url = url
                    break
        if gpx_url:
            v["gpxUrl"] = gpx_url

    # Ensure externalUrl is set (fallback to source_url)
    if not generated.get("externalUrl"):
        generated["externalUrl"] = event.external_url or event.source_url

    # Add reference to scraped event
    generated["scrapedEventId"] = str(event_id)
    generated["sourceName"] = event.source_name

    # Forward to Next.js import endpoint
    nextjs_url = f"{cfg.nextjs_url}/api/admin/events/import"
    headers: dict[str, str] = {"Content-Type": "application/json"}
    if cfg.nextjs_import_secret:
        headers["X-Import-Secret"] = cfg.nextjs_import_secret

    async with httpx.AsyncClient(timeout=180) as client:
        resp = await client.post(
            nextjs_url,
            json=generated,
            headers=headers,
        )

    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=502,
            detail=f"Next.js import failed ({resp.status_code}): {resp.text[:500]}",
        )

    # Mark scraped event as approved
    event.review_status = EventReviewStatus.APPROVED
    event.athlifyr_event_id = resp.json().get("id")
    event.reviewed_at = datetime.now(timezone.utc)
    event.ai_pending = False
    await db.commit()

    return resp.json()


@router.post("/events/{event_id}/submit")
async def submit_event(
    event_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Forward the previously AI-generated output (ai_output) to Next.js without re-running the AI.

    Requires that the event already has ai_output saved (i.e. /generate?submit=false was called first).
    """
    from app.core.config import settings as cfg

    result = await db.execute(
        select(ScrapedEvent).where(ScrapedEvent.id == event_id)
    )
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")

    if not event.ai_output:
        raise HTTPException(
            status_code=422,
            detail="No AI output found for this event. Run 'Analisar' first to generate the AI output.",
        )

    # Block submission if pending dedup pairs still exist
    if await _has_pending_dedup(event_id, db):
        raise HTTPException(
            status_code=409,
            detail="This event has pending duplicate(s) awaiting review. Confirm or reject them in the Deduplication tab before submitting.",
        )

    try:
        generated = json.loads(event.ai_output)
    except (json.JSONDecodeError, TypeError) as exc:
        raise HTTPException(status_code=422, detail="Stored AI output is not valid JSON") from exc

    nextjs_url = f"{cfg.nextjs_url}/api/admin/events/import"
    headers: dict[str, str] = {"Content-Type": "application/json"}
    if cfg.nextjs_import_secret:
        headers["X-Import-Secret"] = cfg.nextjs_import_secret

    async with httpx.AsyncClient(timeout=180) as client:
        resp = await client.post(nextjs_url, json=generated, headers=headers)

    if resp.status_code not in (200, 201):
        raise HTTPException(
            status_code=502,
            detail=f"Next.js import failed ({resp.status_code}): {resp.text[:500]}",
        )

    event.review_status = EventReviewStatus.APPROVED
    event.athlifyr_event_id = resp.json().get("id")
    event.reviewed_at = datetime.now(timezone.utc)
    event.ai_pending = False
    await db.commit()

    return resp.json()


@router.get(
    "/events/{event_id}/changes",
    response_model=list[EventChangeLogOut],
)
async def get_event_changes(
    event_id: uuid.UUID,
    limit: int = Query(default=50, le=200),
    db: AsyncSession = Depends(get_db),
) -> list[EventChangeLog]:
    """Return field-level change history for an event."""
    result = await db.execute(
        select(EventChangeLog)
        .where(EventChangeLog.event_id == event_id)
        .order_by(EventChangeLog.changed_at.desc())
        .limit(limit)
    )
    return list(result.scalars().all())


# ── Single-event scraping ────────────────────────────────────────────────────


@router.post("/scrape-url", response_model=ScrapedEventOut | None)
async def scrape_url(
    source_name: str = Query(...),
    url: str = Query(...),
    db: AsyncSession = Depends(get_db),
) -> ScrapedEvent | None:
    """Scrape a single event URL and store the result."""
    event = await scrape_single_event(source_name, url, db)
    if not event:
        raise HTTPException(status_code=404, detail="Could not extract event from URL")
    return event


# ── Document management ───────────────────────────────────────────────────────


@router.post("/events/{event_id}/download-docs")
async def trigger_doc_download(
    event_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> dict[str, int]:
    """Download pending documents (PDFs, etc.) for a scraped event."""
    count = await download_event_documents(event_id, db)
    return {"downloaded": count}


@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> dict[str, str]:
    """Remove a document record."""
    result = await db.execute(
        select(ScrapedDocument).where(ScrapedDocument.id == document_id)
    )
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    await db.delete(doc)
    await db.commit()
    return {"status": "deleted"}


# ── Stats ─────────────────────────────────────────────────────────────────────


@router.delete("/events/past")
async def delete_past_events(
    db: AsyncSession = Depends(get_db),
) -> dict[str, int]:
    """Delete all scraped events whose start_date is in the past."""
    now = datetime.now(timezone.utc)
    result = await db.execute(
        select(ScrapedEvent).where(
            and_(
                ScrapedEvent.start_date.isnot(None),
                ScrapedEvent.start_date < now,
            )
        )
    )
    events = list(result.scalars().all())
    count = len(events)
    for event in events:
        await db.delete(event)
    await db.commit()
    return {"deleted": count}


@router.get("/stats", response_model=StatsOut)
async def get_stats(db: AsyncSession = Depends(get_db)) -> StatsOut:
    total = await db.scalar(select(func.count(ScrapedEvent.id))) or 0
    pending = await db.scalar(
        select(func.count(ScrapedEvent.id)).where(
            ScrapedEvent.review_status == EventReviewStatus.PENDING
        )
    ) or 0
    approved = await db.scalar(
        select(func.count(ScrapedEvent.id)).where(
            ScrapedEvent.review_status == EventReviewStatus.APPROVED
        )
    ) or 0
    rejected = await db.scalar(
        select(func.count(ScrapedEvent.id)).where(
            ScrapedEvent.review_status == EventReviewStatus.REJECTED
        )
    ) or 0
    hidden = await db.scalar(
        select(func.count(ScrapedEvent.id)).where(
            ScrapedEvent.is_hidden == True  # noqa: E712
        )
    ) or 0
    with_docs = await db.scalar(
        select(func.count(func.distinct(ScrapedDocument.event_id)))
    ) or 0

    # Source counts
    sources = list_sources()
    active_count = await db.scalar(
        select(func.count(SourceConfig.source_name)).where(
            SourceConfig.enabled == True  # noqa: E712
        )
    ) or 0

    return StatsOut(
        total_events=total,
        pending_review=pending,
        approved=approved,
        rejected=rejected,
        hidden=hidden,
        with_documents=with_docs,
        sources_active=active_count,
        sources_total=len(sources),
    )


# ── AI Queue Processing ──────────────────────────────────────────────────────


@router.post("/ai/process-queue")
async def process_ai_queue(
    limit: int = Query(default=10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Process pending AI queue: generate event JSON for events marked ai_pending.

    Processes events one by one to avoid overloading the AI.
    Skips events without images (required for generation).
    Events previously rejected by AI are skipped.
    """
    from app.services.ai_generator import generate_event_json, _read_document_text
    from app.core.config import settings as cfg

    result = await db.execute(
        select(ScrapedEvent)
        .options(
            selectinload(ScrapedEvent.variants),
            selectinload(ScrapedEvent.pricing_phases),
            selectinload(ScrapedEvent.documents),
        )
        .where(
            ScrapedEvent.ai_pending == True,  # noqa: E712
            ScrapedEvent.is_hidden == False,  # noqa: E712
            ScrapedEvent.review_status != EventReviewStatus.REJECTED,
        )
        .order_by(ScrapedEvent.created_at.asc())
        .limit(limit)
    )
    events = list(result.scalars().all())

    if not events:
        return {"processed": 0, "results": [], "message": "No events in AI queue"}

    results: list[dict] = []

    for event in events:
        event_result: dict = {"id": str(event.id), "title": event.title}

        # Skip events without images
        if not event.image_url:
            event.ai_pending = False
            event_result["status"] = "skipped"
            event_result["reason"] = "No image"
            results.append(event_result)
            continue

        try:
            # Build event data dict for AI
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

            # Extract text from documents
            docs = [
                d for d in event.documents
                if d.original_url and (
                    (d.mime_type and "pdf" in d.mime_type)
                    or (d.file_name and d.file_name.lower().endswith(".pdf"))
                    or (d.original_url and d.original_url.lower().endswith(".pdf"))
                    or d.document_type == "regulation"
                )
            ]

            doc_texts: list[dict[str, str]] = []
            for doc in docs:
                text = await _read_document_text(doc.original_url)
                if text:
                    doc_texts.append({"name": doc.file_name or doc.document_type, "content": text})

            if not doc_texts and event.external_url:
                page_text = await _read_document_text(event.external_url)
                if page_text:
                    doc_texts.append({"name": "event_page", "content": page_text})

            # Generate via AI
            generated = await generate_event_json(event_data, doc_texts)

            # Save AI debug data
            event.ai_output = json.dumps(generated, ensure_ascii=False, default=str)
            event.ai_pending = False

            # If AI rejected the event
            if generated.get("rejected"):
                reason = generated.get("reason", "Not a sports event")
                event.review_status = EventReviewStatus.REJECTED
                event.review_notes = f"AI auto-rejected: {reason}"
                event.is_hidden = True
                event_result["status"] = "rejected"
                event_result["reason"] = reason
                logger.info("AI queue: rejected %s — %s", event.title, reason)
            else:
                # Inject image and external URL
                generated["imageUrl"] = event.image_url
                if not generated.get("externalUrl"):
                    generated["externalUrl"] = event.external_url or event.source_url
                generated["scrapedEventId"] = str(event.id)
                generated["sourceName"] = event.source_name

                # Check for pending dedup pairs — block submission if found
                # Use AI-returned coordinates to improve future dedup accuracy
                ai_lat = generated.get("latitude")
                ai_lng = generated.get("longitude")
                if ai_lat and ai_lng:
                    event.latitude = ai_lat
                    event.longitude = ai_lng

                new_pairs = await _run_dedup_for_event(event, db)
                await db.flush()

                if new_pairs > 0:
                    event.ai_pending = False
                    event_result["status"] = "dedup_pending"
                    event_result["reason"] = f"{new_pairs} possible duplicate(s) — review in Deduplication tab"
                    logger.warning(
                        "AI queue: dedup pending for '%s' (%d pair(s)) — submission blocked",
                        event.title, new_pairs,
                    )
                    results.append(event_result)
                    continue

                # Forward to Next.js
                nextjs_url = f"{cfg.nextjs_url}/api/admin/events/import"
                headers: dict[str, str] = {"Content-Type": "application/json"}
                if cfg.nextjs_import_secret:
                    headers["X-Import-Secret"] = cfg.nextjs_import_secret

                async with httpx.AsyncClient(timeout=180) as client:
                    resp = await client.post(nextjs_url, json=generated, headers=headers)

                if resp.status_code in (200, 201):
                    event.review_status = EventReviewStatus.APPROVED
                    event.athlifyr_event_id = resp.json().get("id")
                    event.reviewed_at = datetime.now(timezone.utc)
                    event_result["status"] = "imported"
                    event_result["athlifyr_id"] = event.athlifyr_event_id
                    logger.info("AI queue: imported %s → %s", event.title, event.athlifyr_event_id)
                else:
                    event_result["status"] = "import_failed"
                    event_result["reason"] = f"Next.js {resp.status_code}: {resp.text[:200]}"
                    logger.error("AI queue: import failed for %s — %s", event.title, resp.text[:200])

        except Exception as exc:
            event.ai_pending = False
            event_result["status"] = "error"
            event_result["reason"] = str(exc)[:200]
            logger.exception("AI queue: error processing %s", event.title)

        results.append(event_result)

    await db.commit()

    summary = {
        "processed": len(results),
        "imported": sum(1 for r in results if r.get("status") == "imported"),
        "rejected": sum(1 for r in results if r.get("status") == "rejected"),
        "skipped": sum(1 for r in results if r.get("status") == "skipped"),
        "errors": sum(1 for r in results if r.get("status") in ("error", "import_failed")),
        "results": results,
    }
    return summary


# ── Dedup helpers ─────────────────────────────────────────────────────────────


async def _has_pending_dedup(event_id: uuid.UUID, db: AsyncSession) -> bool:
    """Return True if this event is part of any pending dedup pair."""
    result = await db.execute(
        select(DedupPair.id).where(
            DedupPair.status == "pending",
            (DedupPair.event_a_id == event_id) | (DedupPair.event_b_id == event_id),
        ).limit(1)
    )
    return result.scalar_one_or_none() is not None


async def _run_dedup_for_event(event: ScrapedEvent, db: AsyncSession) -> int:
    """Run dedup detection for a single newly-processed event against all existing events.

    Returns the number of new pending pairs created.
    """
    import difflib
    import math
    import re as _re

    def _norm(title: str) -> str:
        t = title.lower()
        t = _re.sub(r"\b20\d{2}\b", "", t)
        t = _re.sub(r"[^a-z0-9\s]", " ", t)
        return _re.sub(r"\s+", " ", t).strip()

    def _similarity(a: str, b: str) -> float:
        return difflib.SequenceMatcher(None, _norm(a), _norm(b)).ratio()

    def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        r = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        return r * 2 * math.asin(math.sqrt(a))

    LOCATION_RADIUS_KM = 30.0

    # Load all other non-hidden events from different sources
    result = await db.execute(
        select(ScrapedEvent)
        .where(
            ScrapedEvent.is_hidden == False,  # noqa: E712
            ScrapedEvent.id != event.id,
            ScrapedEvent.source_name != event.source_name,
        )
    )
    others = list(result.scalars().all())

    # Load existing pairs for this event to avoid duplicates
    existing_result = await db.execute(
        select(DedupPair).where(
            (DedupPair.event_a_id == event.id) | (DedupPair.event_b_id == event.id)
        )
    )
    existing_set: set[tuple[str, str]] = set()
    for p in existing_result.scalars().all():
        a, b = str(p.event_a_id), str(p.event_b_id)
        existing_set.add((min(a, b), max(a, b)))

    created = 0
    for other in others:
        # Location proximity (required)
        both_have_coords = (
            event.latitude is not None
            and event.longitude is not None
            and other.latitude is not None
            and other.longitude is not None
        )
        if both_have_coords:
            dist_km = _haversine_km(
                event.latitude, event.longitude, other.latitude, other.longitude  # type: ignore[arg-type]
            )
            location_close = dist_km <= LOCATION_RADIUS_KM
        else:
            location_close = bool(
                event.city and other.city and event.city.lower() == other.city.lower()
            )

        if not location_close:
            continue

        name_sim = _similarity(event.title, other.title)
        reasons: list[str] = []
        score = 0.0

        reasons.append("same_location")
        score += 0.2

        if name_sim >= 0.85:
            reasons.append("near_identical_name")
            score += 0.5
        elif name_sim >= 0.6:
            reasons.append("similar_name")
            score += 0.3

        if event.start_date and other.start_date:
            delta = abs((event.start_date.date() - other.start_date.date()).days)
            if delta <= 3:
                reasons.append("close_dates")
                score += 0.3

        if score < 0.5 or len(reasons) < 2:
            continue

        id_a = min(str(event.id), str(other.id))
        id_b = max(str(event.id), str(other.id))
        if (id_a, id_b) in existing_set:
            continue

        pair = DedupPair(
            event_a_id=uuid.UUID(id_a),
            event_b_id=uuid.UUID(id_b),
            status="pending",
            similarity_score=min(score, 1.0),
            reasons=json.dumps(reasons),
        )
        db.add(pair)
        existing_set.add((id_a, id_b))
        created += 1

    return created


# ── Dedup ─────────────────────────────────────────────────────────────────────


@router.post("/dedup/detect", response_model=DedupDetectOut)
async def detect_duplicates(
    db: AsyncSession = Depends(get_db),
) -> DedupDetectOut:
    """Scan all scraped events and create pending dedup pairs for suspected duplicates."""
    import difflib
    import math
    import re as _re

    def _norm(title: str) -> str:
        t = title.lower()
        t = _re.sub(r"\b20\d{2}\b", "", t)
        t = _re.sub(r"[^a-z0-9\s]", " ", t)
        return _re.sub(r"\s+", " ", t).strip()

    def _similarity(a: str, b: str) -> float:
        return difflib.SequenceMatcher(None, _norm(a), _norm(b)).ratio()

    def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Great-circle distance in kilometres between two GPS points."""
        r = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        return r * 2 * math.asin(math.sqrt(a))

    # Within this radius events are considered "same location"
    LOCATION_RADIUS_KM = 30.0

    # Load all non-hidden events (includes pending, approved, rejected)
    result = await db.execute(
        select(ScrapedEvent)
        .where(ScrapedEvent.is_hidden == False)  # noqa: E712
        .order_by(ScrapedEvent.created_at)
    )
    events = list(result.scalars().all())

    # Load existing pairs to skip already-detected combinations
    existing_result = await db.execute(select(DedupPair))
    existing_set: set[tuple[str, str]] = {
        (str(p.event_a_id), str(p.event_b_id))
        for p in existing_result.scalars().all()
    }

    created = 0
    already_existed = 0

    for i, ea in enumerate(events):
        for eb in events[i + 1 :]:
            # Only cross-source comparisons — same-source updates are handled by upsert
            if ea.source_name == eb.source_name:
                continue

            # Canonical ordering so (a_id, b_id) is always consistent
            id_a, id_b = str(ea.id), str(eb.id)
            ev_a, ev_b = ea, eb
            if id_a > id_b:
                id_a, id_b = id_b, id_a
                ev_a, ev_b = eb, ea

            if (id_a, id_b) in existing_set:
                already_existed += 1
                continue

            # ── Location proximity check (REQUIRED) ───────────────────────
            # Use GPS coordinates when both events have them (most accurate).
            # Fall back to city name match when coordinates are missing —
            # coordinates are sometimes only available after AI generation.
            both_have_coords = (
                ea.latitude is not None
                and ea.longitude is not None
                and eb.latitude is not None
                and eb.longitude is not None
            )
            if both_have_coords:
                dist_km = _haversine_km(
                    ea.latitude, ea.longitude, eb.latitude, eb.longitude  # type: ignore[arg-type]
                )
                location_close = dist_km <= LOCATION_RADIUS_KM
            else:
                # Fallback: city name equality
                location_close = bool(
                    ea.city and eb.city and ea.city.lower() == eb.city.lower()
                )

            if not location_close:
                continue

            # ── Name + date similarity ─────────────────────────────────────
            name_sim = _similarity(ea.title, eb.title)
            reasons: list[str] = []
            score = 0.0

            # Location always counts since it's now mandatory
            reasons.append("same_location")
            score += 0.2

            if name_sim >= 0.85:
                reasons.append("near_identical_name")
                score += 0.5
            elif name_sim >= 0.6:
                reasons.append("similar_name")
                score += 0.3

            if ea.start_date and eb.start_date:
                delta = abs((ea.start_date.date() - eb.start_date.date()).days)
                if delta <= 3:
                    reasons.append("close_dates")
                    score += 0.3

            if score < 0.5 or len(reasons) < 2:
                continue

            pair = DedupPair(
                event_a_id=uuid.UUID(id_a),
                event_b_id=uuid.UUID(id_b),
                status="pending",
                similarity_score=min(score, 1.0),
                reasons=json.dumps(reasons),
            )
            db.add(pair)
            existing_set.add((id_a, id_b))
            created += 1

    await db.commit()
    return DedupDetectOut(
        created=created,
        already_existed=already_existed,
        total_events_scanned=len(events),
    )


@router.post("/dedup/cleanup")
async def cleanup_false_positives(
    db: AsyncSession = Depends(get_db),
) -> dict:
    """Re-validate all pending dedup pairs using the current Haversine algorithm.

    Any pending pair whose events are farther than LOCATION_RADIUS_KM apart
    (or in different cities when coordinates are missing) is auto-rejected.
    Returns the number of pairs rejected.
    """
    import math

    LOCATION_RADIUS_KM = 30.0

    def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        r = 6371.0
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        return r * 2 * math.asin(math.sqrt(a))

    result = await db.execute(
        select(DedupPair)
        .options(selectinload(DedupPair.event_a), selectinload(DedupPair.event_b))
        .where(DedupPair.status == "pending")
    )
    pending_pairs = list(result.scalars().all())

    rejected = 0
    for pair in pending_pairs:
        ea, eb = pair.event_a, pair.event_b

        both_have_coords = (
            ea.latitude is not None
            and ea.longitude is not None
            and eb.latitude is not None
            and eb.longitude is not None
        )
        if both_have_coords:
            dist_km = _haversine_km(
                ea.latitude, ea.longitude, eb.latitude, eb.longitude  # type: ignore[arg-type]
            )
            location_close = dist_km <= LOCATION_RADIUS_KM
        else:
            location_close = bool(
                ea.city and eb.city and ea.city.lower() == eb.city.lower()
            )

        if not location_close:
            pair.status = "rejected"
            rejected += 1

    await db.commit()
    return {"rejected": rejected, "checked": len(pending_pairs)}


@router.get("/dedup/pairs", response_model=PaginatedDedupPairsOut)
async def list_dedup_pairs(
    status: str | None = Query(None, description="pending | confirmed | rejected"),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
) -> PaginatedDedupPairsOut:
    """List dedup pairs with optional status filter."""
    base = select(DedupPair).options(
        selectinload(DedupPair.event_a),
        selectinload(DedupPair.event_b),
    )
    if status:
        base = base.where(DedupPair.status == status)

    # Count
    count_q = select(func.count()).select_from(base.subquery())
    total = (await db.execute(count_q)).scalar_one()

    # Pending count for badge
    pending_count_q = select(func.count()).where(DedupPair.status == "pending")
    pending_count = (await db.execute(pending_count_q)).scalar_one()

    # Paginate, newest first
    pairs_result = await db.execute(
        base.order_by(DedupPair.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    pairs = list(pairs_result.scalars().all())

    items: list[DedupPairOut] = []
    for p in pairs:
        reasons_list: list[str] = []
        if p.reasons:
            try:
                reasons_list = json.loads(p.reasons)
            except (json.JSONDecodeError, ValueError):
                reasons_list = [r.strip() for r in p.reasons.split(",") if r.strip()]

        items.append(
            DedupPairOut(
                id=p.id,
                event_a=p.event_a,
                event_b=p.event_b,
                primary_event_id=p.primary_event_id,
                status=p.status,
                similarity_score=p.similarity_score,
                reasons=reasons_list,
                created_at=p.created_at,
                updated_at=p.updated_at,
            )
        )

    return PaginatedDedupPairsOut(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        pending_count=pending_count,
    )


@router.post("/dedup/pairs/{pair_id}/confirm", response_model=DedupPairOut)
async def confirm_dedup_pair(
    pair_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> DedupPairOut:
    """Confirm two events are duplicates. Older event becomes the primary; secondary hidden."""
    result = await db.execute(
        select(DedupPair)
        .options(selectinload(DedupPair.event_a), selectinload(DedupPair.event_b))
        .where(DedupPair.id == pair_id)
    )
    pair = result.scalar_one_or_none()
    if not pair:
        raise HTTPException(status_code=404, detail="Dedup pair not found")
    if pair.status != "pending":
        raise HTTPException(status_code=409, detail=f"Pair is already '{pair.status}'")

    ev_a, ev_b = pair.event_a, pair.event_b

    # Primary = the older event (earliest created_at)
    if ev_a.created_at <= ev_b.created_at:
        primary, secondary = ev_a, ev_b
    else:
        primary, secondary = ev_b, ev_a

    pair.status = "confirmed"
    pair.primary_event_id = primary.id

    # Hide secondary — it will not be independently submitted to Next.js
    secondary.is_hidden = True
    secondary.review_notes = (
        (secondary.review_notes or "")
        + f"\n[dedup] Merged into primary event {primary.id} ({primary.source_name}: {primary.title})"
    ).strip()

    await db.commit()
    await db.refresh(pair)

    reasons_list: list[str] = []
    if pair.reasons:
        try:
            reasons_list = json.loads(pair.reasons)
        except (json.JSONDecodeError, ValueError):
            reasons_list = [r.strip() for r in pair.reasons.split(",") if r.strip()]

    return DedupPairOut(
        id=pair.id,
        event_a=pair.event_a,
        event_b=pair.event_b,
        primary_event_id=pair.primary_event_id,
        status=pair.status,
        similarity_score=pair.similarity_score,
        reasons=reasons_list,
        created_at=pair.created_at,
        updated_at=pair.updated_at,
    )


@router.post("/dedup/pairs/{pair_id}/reject", response_model=DedupPairOut)
async def reject_dedup_pair(
    pair_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> DedupPairOut:
    """Reject a suspected duplicate pair — mark as not duplicates."""
    result = await db.execute(
        select(DedupPair)
        .options(selectinload(DedupPair.event_a), selectinload(DedupPair.event_b))
        .where(DedupPair.id == pair_id)
    )
    pair = result.scalar_one_or_none()
    if not pair:
        raise HTTPException(status_code=404, detail="Dedup pair not found")
    if pair.status != "pending":
        raise HTTPException(status_code=409, detail=f"Pair is already '{pair.status}'")

    pair.status = "rejected"
    await db.commit()
    await db.refresh(pair)

    reasons_list: list[str] = []
    if pair.reasons:
        try:
            reasons_list = json.loads(pair.reasons)
        except (json.JSONDecodeError, ValueError):
            reasons_list = [r.strip() for r in pair.reasons.split(",") if r.strip()]

    return DedupPairOut(
        id=pair.id,
        event_a=pair.event_a,
        event_b=pair.event_b,
        primary_event_id=pair.primary_event_id,
        status=pair.status,
        similarity_score=pair.similarity_score,
        reasons=reasons_list,
        created_at=pair.created_at,
        updated_at=pair.updated_at,
    )
