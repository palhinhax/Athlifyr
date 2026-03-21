"""API routes for scraping management."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.db.session import get_db
from app.models.models import (
    EventReviewStatus,
    ScrapedEvent,
    ScrapingRun,
)
from app.schemas.schemas import (
    ScrapedEventListOut,
    ScrapedEventOut,
    ScrapedEventUpdate,
    ScrapingRunCreate,
    ScrapingRunOut,
    SourceInfo,
)
from app.services.scraping_service import (
    download_event_documents,
    run_scraper,
    scrape_single_event,
)
from app.sources.registry import list_sources

router = APIRouter()

# ── Sources ───────────────────────────────────────────────────────────────────


@router.get("/sources", response_model=list[SourceInfo])
async def get_sources() -> list[dict[str, str]]:
    """List all registered scraping sources."""
    return list_sources()


# ── Scraping Runs ─────────────────────────────────────────────────────────────


@router.post("/runs", response_model=ScrapingRunOut)
async def create_run(
    body: ScrapingRunCreate,
    db: AsyncSession = Depends(get_db),
) -> ScrapingRun:
    """Trigger a new scraping run for a given source."""
    return await run_scraper(body.source_name, db)


@router.get("/runs", response_model=list[ScrapingRunOut])
async def list_runs(
    source_name: str | None = None,
    limit: int = Query(default=20, le=100),
    db: AsyncSession = Depends(get_db),
) -> list[ScrapingRun]:
    stmt = select(ScrapingRun).order_by(ScrapingRun.created_at.desc()).limit(limit)
    if source_name:
        stmt = stmt.where(ScrapingRun.source_name == source_name)
    result = await db.execute(stmt)
    return list(result.scalars().all())


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


# ── Scraped Events ────────────────────────────────────────────────────────────


@router.get("/events", response_model=list[ScrapedEventListOut])
async def list_events(
    source_name: str | None = None,
    review_status: str | None = None,
    limit: int = Query(default=50, le=200),
    offset: int = 0,
    db: AsyncSession = Depends(get_db),
) -> list[ScrapedEvent]:
    stmt = (
        select(ScrapedEvent)
        .order_by(ScrapedEvent.created_at.desc())
        .limit(limit)
        .offset(offset)
    )
    if source_name:
        stmt = stmt.where(ScrapedEvent.source_name == source_name)
    if review_status:
        stmt = stmt.where(ScrapedEvent.review_status == review_status)
    result = await db.execute(stmt)
    return list(result.scalars().all())


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


# ── Document download ─────────────────────────────────────────────────────────


@router.post("/events/{event_id}/download-docs")
async def trigger_doc_download(
    event_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> dict[str, int]:
    """Download pending documents (PDFs, etc.) for a scraped event."""
    count = await download_event_documents(event_id, db)
    return {"downloaded": count}


# ── Stats ─────────────────────────────────────────────────────────────────────


@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db)) -> dict:
    total = await db.scalar(select(func.count(ScrapedEvent.id)))
    pending = await db.scalar(
        select(func.count(ScrapedEvent.id)).where(
            ScrapedEvent.review_status == EventReviewStatus.PENDING
        )
    )
    approved = await db.scalar(
        select(func.count(ScrapedEvent.id)).where(
            ScrapedEvent.review_status == EventReviewStatus.APPROVED
        )
    )
    return {
        "total_events": total or 0,
        "pending_review": pending or 0,
        "approved": approved or 0,
    }
