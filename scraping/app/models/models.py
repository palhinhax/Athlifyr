"""SQLAlchemy models for the scraping service."""

from __future__ import annotations

import enum
import uuid
from datetime import datetime

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


# ── Enums ─────────────────────────────────────────────────────────────────────


class ScrapingRunStatus(str, enum.Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class EventReviewStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    EDITED = "edited"
    HIDDEN = "hidden"


class SportType(str, enum.Enum):
    RUNNING = "RUNNING"
    TRAIL = "TRAIL"
    HYROX = "HYROX"
    CROSSFIT = "CROSSFIT"
    OCR = "OCR"
    BTT = "BTT"
    CYCLING = "CYCLING"
    SURF = "SURF"
    TRIATHLON = "TRIATHLON"
    SWIMMING = "SWIMMING"
    WALKING = "WALKING"
    OTHER = "OTHER"


# ── Source Config ─────────────────────────────────────────────────────────────


class SourceConfig(Base):
    """Per-source runtime configuration persisted in the DB."""

    __tablename__ = "source_configs"

    source_name: Mapped[str] = mapped_column(String(100), primary_key=True)
    enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    interval_hours: Mapped[int] = mapped_column(Integer, default=24)
    last_run_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_success_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_error: Mapped[str | None] = mapped_column(Text)
    events_total: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


# ── Scraping Run ──────────────────────────────────────────────────────────────


class ScrapingRun(Base):
    """Represents a single execution of a scraper against a source."""

    __tablename__ = "scraping_runs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    source_name: Mapped[str] = mapped_column(String(100), index=True)
    status: Mapped[ScrapingRunStatus] = mapped_column(
        Enum(ScrapingRunStatus), default=ScrapingRunStatus.PENDING
    )
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    events_found: Mapped[int] = mapped_column(Integer, default=0)
    events_created: Mapped[int] = mapped_column(Integer, default=0)
    events_updated: Mapped[int] = mapped_column(Integer, default=0)
    events_failed: Mapped[int] = mapped_column(Integer, default=0)
    error_message: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    events: Mapped[list[ScrapedEvent]] = relationship(back_populates="scraping_run")


# ── Scraped Event ─────────────────────────────────────────────────────────────


class ScrapedEvent(Base):
    """A race event captured from an external source."""

    __tablename__ = "scraped_events"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    scraping_run_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("scraping_runs.id", ondelete="SET NULL")
    )

    # ── Source info ──
    source_name: Mapped[str] = mapped_column(String(100), index=True)
    source_url: Mapped[str] = mapped_column(Text)
    source_event_id: Mapped[str | None] = mapped_column(
        String(255), index=True
    )

    # ── Core event data (normalised) ──
    title: Mapped[str] = mapped_column(String(500))
    slug: Mapped[str | None] = mapped_column(String(500), index=True)
    description: Mapped[str | None] = mapped_column(Text)
    sport_types: Mapped[str | None] = mapped_column(
        Text
    )  # comma-separated SportType values
    start_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    end_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    registration_deadline: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True)
    )

    # ── Location ──
    city: Mapped[str | None] = mapped_column(String(255))
    country: Mapped[str] = mapped_column(String(100), default="Portugal")
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    google_maps_url: Mapped[str | None] = mapped_column(Text)

    # ── Organizer ──
    organizer_name: Mapped[str | None] = mapped_column(String(500))
    external_url: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(Text)

    # ── Raw pricing text (sent to AI instead of structured phases) ──
    raw_pricing_text: Mapped[str | None] = mapped_column(Text)

    # ── Review workflow ──
    review_status: Mapped[EventReviewStatus] = mapped_column(
        Enum(EventReviewStatus), default=EventReviewStatus.PENDING, index=True
    )
    review_notes: Mapped[str | None] = mapped_column(Text)
    reviewed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    # ── Admin-only supplementary info (never overwritten by scrapers) ──
    admin_notes: Mapped[str | None] = mapped_column(Text)

    # ── Link to production (after approval pushed to main DB) ──
    athlifyr_event_id: Mapped[str | None] = mapped_column(String(255))

    # ── Visibility ──
    is_hidden: Mapped[bool] = mapped_column(Boolean, default=False)

    # ── AI processing queue ──
    ai_pending: Mapped[bool] = mapped_column(Boolean, default=False, index=True)

    # ── Timestamps ──
    raw_data: Mapped[str | None] = mapped_column(Text)  # JSON dump of raw scraped data
    ai_input: Mapped[str | None] = mapped_column(Text)  # JSON sent to AI for generation
    ai_output: Mapped[str | None] = mapped_column(Text)  # JSON received from AI
    last_seen_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    scraping_run: Mapped[ScrapingRun | None] = relationship(back_populates="events")
    variants: Mapped[list[ScrapedVariant]] = relationship(
        back_populates="event", cascade="all, delete-orphan"
    )
    pricing_phases: Mapped[list[ScrapedPricingPhase]] = relationship(
        back_populates="event", cascade="all, delete-orphan"
    )
    documents: Mapped[list[ScrapedDocument]] = relationship(
        back_populates="event", cascade="all, delete-orphan"
    )


# ── Scraped Variant ───────────────────────────────────────────────────────────


class ScrapedVariant(Base):
    """A race variant/distance within a scraped event."""

    __tablename__ = "scraped_variants"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("scraped_events.id", ondelete="CASCADE")
    )
    name: Mapped[str] = mapped_column(String(255))
    distance_km: Mapped[float | None] = mapped_column(Float)
    elevation_gain_m: Mapped[int | None] = mapped_column(Integer)
    elevation_loss_m: Mapped[int | None] = mapped_column(Integer)
    start_time: Mapped[str | None] = mapped_column(String(10))
    price: Mapped[float | None] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(3), default="EUR")

    event: Mapped[ScrapedEvent] = relationship(back_populates="variants")


# ── Scraped Pricing Phase ────────────────────────────────────────────────────


class ScrapedPricingPhase(Base):
    """A pricing tier/phase for a scraped event."""

    __tablename__ = "scraped_pricing_phases"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("scraped_events.id", ondelete="CASCADE")
    )
    variant_name: Mapped[str | None] = mapped_column(String(255))
    phase_name: Mapped[str | None] = mapped_column(String(255))
    start_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    end_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    price: Mapped[float | None] = mapped_column(Float)
    currency: Mapped[str] = mapped_column(String(3), default="EUR")
    note: Mapped[str | None] = mapped_column(Text)

    event: Mapped[ScrapedEvent] = relationship(back_populates="pricing_phases")


# ── Scraped Document ─────────────────────────────────────────────────────────


class ScrapedDocument(Base):
    """A document (PDF, regulation, etc.) linked to a scraped event."""

    __tablename__ = "scraped_documents"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("scraped_events.id", ondelete="CASCADE")
    )
    document_type: Mapped[str] = mapped_column(
        String(50), default="regulation"
    )  # regulation, map, results, etc.
    original_url: Mapped[str | None] = mapped_column(Text)
    file_path: Mapped[str | None] = mapped_column(Text)  # local or cloud path
    file_name: Mapped[str | None] = mapped_column(String(500))
    file_size_bytes: Mapped[int | None] = mapped_column(Integer)
    mime_type: Mapped[str | None] = mapped_column(String(100))
    downloaded: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    event: Mapped[ScrapedEvent] = relationship(back_populates="documents")


# ── Event Change Log ─────────────────────────────────────────────────────────


class EventChangeLog(Base):
    """Tracks field-level changes to a scraped event across runs."""

    __tablename__ = "event_change_logs"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    event_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("scraped_events.id", ondelete="CASCADE"),
        index=True,
    )
    scraping_run_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("scraping_runs.id", ondelete="SET NULL")
    )
    field_name: Mapped[str] = mapped_column(String(100))
    old_value: Mapped[str | None] = mapped_column(Text)
    new_value: Mapped[str | None] = mapped_column(Text)
    changed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    event: Mapped[ScrapedEvent] = relationship()
    scraping_run: Mapped[ScrapingRun | None] = relationship()
