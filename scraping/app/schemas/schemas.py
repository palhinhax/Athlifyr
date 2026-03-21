"""Pydantic schemas for API request/response serialization."""

from __future__ import annotations

import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


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
    error_message: str | None = None
    created_at: datetime


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
    athlifyr_event_id: str | None = None
    created_at: datetime
    updated_at: datetime

    variants: list[ScrapedVariantOut] = []
    pricing_phases: list[ScrapedPricingPhaseOut] = []
    documents: list[ScrapedDocumentOut] = []


class ScrapedEventListOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    source_name: str
    title: str
    city: str | None = None
    start_date: datetime | None = None
    review_status: str
    created_at: datetime


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
    organizer_name: str | None = None
    external_url: str | None = None
    review_status: str | None = None
    review_notes: str | None = None


# ── Source Info ────────────────────────────────────────────────────────────────


class SourceInfo(BaseModel):
    name: str
    display_name: str
    base_url: str
    description: str
