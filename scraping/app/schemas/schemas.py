"""Pydantic schemas for API request/response serialization."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


# ── Source Config ─────────────────────────────────────────────────────────────


class SourceInfo(BaseModel):
    """Static metadata about a registered scraper."""
    name: str
    display_name: str
    base_url: str
    description: str


class SourceConfigOut(BaseModel):
    """Full source status shown in the dashboard."""
    model_config = ConfigDict(from_attributes=True)

    source_name: str
    display_name: str
    base_url: str
    description: str
    enabled: bool
    interval_hours: int
    last_run_at: datetime | None = None
    last_success_at: datetime | None = None
    last_error: str | None = None
    events_total: int = 0


class SourceConfigUpdate(BaseModel):
    """Fields that can be toggled from the front-end."""
    enabled: bool | None = None
    interval_hours: int | None = None


# ── Scraping Run ──────────────────────────────────────────────────────────────


class ScrapingRunCreate(BaseModel):
    source_name: str


class ScrapingRunOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    source_name: str
    status: str
    started_at: datetime | None = None
    finished_at: datetime | None = None
    events_found: int
    events_created: int
    events_updated: int
    events_failed: int = 0
    error_message: str | None = None
    created_at: datetime


class PaginatedRunsOut(BaseModel):
    items: list[ScrapingRunOut]
    total: int
    page: int
    page_size: int


# ── Scraped Variant ───────────────────────────────────────────────────────────


class ScrapedVariantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    distance_km: float | None = None
    elevation_gain_m: int | None = None
    elevation_loss_m: int | None = None
    start_time: str | None = None
    price: float | None = None
    currency: str = "EUR"


# ── Scraped Pricing Phase ────────────────────────────────────────────────────


class ScrapedPricingPhaseOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    variant_name: str | None = None
    phase_name: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    price: float | None = None
    currency: str = "EUR"
    note: str | None = None


# ── Scraped Document ─────────────────────────────────────────────────────────


class ScrapedDocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    document_type: str
    original_url: str | None = None
    file_path: str | None = None
    file_name: str | None = None
    file_size_bytes: int | None = None
    mime_type: str | None = None
    downloaded: bool
    created_at: datetime


# ── Event Change Log ─────────────────────────────────────────────────────────


class EventChangeLogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    event_id: uuid.UUID
    scraping_run_id: uuid.UUID | None = None
    field_name: str
    old_value: str | None = None
    new_value: str | None = None
    changed_at: datetime


# ── Scraped Event ─────────────────────────────────────────────────────────────


class ScrapedEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    source_name: str
    source_url: str
    source_event_id: str | None = None
    title: str
    slug: str | None = None
    description: str | None = None
    sport_types: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    registration_deadline: datetime | None = None
    city: str | None = None
    country: str = "Portugal"
    latitude: float | None = None
    longitude: float | None = None
    google_maps_url: str | None = None
    organizer_name: str | None = None
    external_url: str | None = None
    image_url: str | None = None
    review_status: str
    review_notes: str | None = None
    reviewed_at: datetime | None = None
    admin_notes: str | None = None
    is_hidden: bool = False
    athlifyr_event_id: str | None = None
    raw_data: str | None = None
    ai_input: str | None = None
    ai_output: str | None = None
    last_seen_at: datetime | None = None
    created_at: datetime
    updated_at: datetime

    variants: list[ScrapedVariantOut] = []
    pricing_phases: list[ScrapedPricingPhaseOut] = []
    documents: list[ScrapedDocumentOut] = []


class ScrapedEventListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    source_name: str
    source_url: str
    title: str
    city: str | None = None
    country: str = "Portugal"
    sport_types: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    organizer_name: str | None = None
    image_url: str | None = None
    has_image: bool = False
    documents_count: int = 0
    review_status: str
    is_hidden: bool = False
    last_seen_at: datetime | None = None
    created_at: datetime
    updated_at: datetime


class PaginatedEventsOut(BaseModel):
    items: list[ScrapedEventListOut]
    total: int
    page: int
    page_size: int
    pending_with_image_total: int = 0


class ScrapedEventUpdate(BaseModel):
    """Fields the reviewer can edit."""

    title: str | None = None
    description: str | None = None
    sport_types: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    registration_deadline: datetime | None = None
    city: str | None = None
    country: str | None = None
    latitude: float | None = None
    longitude: float | None = None
    google_maps_url: str | None = None
    organizer_name: str | None = None
    external_url: str | None = None
    image_url: str | None = None
    review_status: str | None = None
    review_notes: str | None = None
    admin_notes: str | None = None
    is_hidden: bool | None = None


# ── Stats ─────────────────────────────────────────────────────────────────────


class StatsOut(BaseModel):
    total_events: int = 0
    pending_review: int = 0
    approved: int = 0
    rejected: int = 0
    hidden: int = 0
    with_documents: int = 0
    sources_active: int = 0
    sources_total: int = 0
