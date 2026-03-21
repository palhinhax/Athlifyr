"""Abstract base scraper — every source scraper must extend this."""

from __future__ import annotations

import abc
import logging
from dataclasses import dataclass, field
from datetime import datetime

import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)


@dataclass
class ScrapedEventData:
    """Normalised event data returned by every scraper."""

    title: str
    source_url: str
    source_event_id: str | None = None

    description: str | None = None
    sport_types: list[str] = field(default_factory=list)
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

    variants: list[ScrapedVariantData] = field(default_factory=list)
    pricing_phases: list[ScrapedPricingData] = field(default_factory=list)
    documents: list[ScrapedDocumentData] = field(default_factory=list)

    raw_data: str | None = None  # JSON string of raw scraped payload


@dataclass
class ScrapedVariantData:
    name: str
    distance_km: float | None = None
    elevation_gain_m: int | None = None
    elevation_loss_m: int | None = None
    start_time: str | None = None
    price: float | None = None
    currency: str = "EUR"


@dataclass
class ScrapedPricingData:
    variant_name: str | None = None
    phase_name: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None
    price: float | None = None
    currency: str = "EUR"
    note: str | None = None


@dataclass
class ScrapedDocumentData:
    original_url: str
    document_type: str = "regulation"
    file_name: str | None = None
    mime_type: str | None = None


class BaseScraper(abc.ABC):
    """
    Abstract base for all source scrapers.

    Subclasses must implement:
    - ``source_name``     – unique identifier for this source
    - ``display_name``    – human-readable name
    - ``base_url``        – root URL of the source website
    - ``description``     – short description
    - ``scrape()``        – main entry point that returns normalised events
    """

    source_name: str
    display_name: str
    base_url: str
    description: str

    def __init__(self) -> None:
        self._client: httpx.AsyncClient | None = None

    async def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            self._client = httpx.AsyncClient(
                timeout=settings.scraping_request_timeout,
                headers={"User-Agent": settings.scraping_user_agent},
                follow_redirects=True,
            )
        return self._client

    async def close(self) -> None:
        if self._client and not self._client.is_closed:
            await self._client.aclose()

    async def fetch_page(self, url: str) -> str:
        """Fetch a URL and return its HTML body."""
        client = await self._get_client()
        logger.info("Fetching %s", url)
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.text

    async def fetch_bytes(self, url: str) -> bytes:
        """Fetch a URL and return raw bytes (for PDFs, images, etc.)."""
        client = await self._get_client()
        logger.info("Downloading %s", url)
        resp = await client.get(url)
        resp.raise_for_status()
        return resp.content

    # ── Abstract interface ────────────────────────────────────────

    @abc.abstractmethod
    async def scrape(self) -> list[ScrapedEventData]:
        """Run the scraper and return normalised event data."""
        ...

    @abc.abstractmethod
    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Scrape a single event page by URL."""
        ...
