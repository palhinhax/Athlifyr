"""RockTheSport scraper — Spanish sport-event platform.

Scrapes events from rockthesport.com via their public JSON API.
Covers running, trail, cycling, triathlon and other sports in Spain.

Data extracted per event (from API):
  - Title, description, sport types, subsports
  - Start date, registration deadline
  - City, province, country, GPS coordinates
  - Race variants (fees) with name and price
  - Document links (regulations, track files)
  - Organizer name, external URL
  - Event image
"""

from __future__ import annotations

import json
import logging
import re
from datetime import datetime

from app.sources.base.scraper import (
    BaseScraper,
    ScrapedDocumentData,
    ScrapedEventData,
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)

_API_BASE = "https://publicservice.rockthesport.com"
_WEB_BASE = "https://web.rockthesport.com"
_API_KEY = "rts_public_web_2024_a8f3d9e1c4b7"

# Country IDs used by the API
_COUNTRY_SPAIN = 65

# Page size for list pagination (max supported)
_PAGE_SIZE = 100

# Sports we care about — mapped to our internal sport types
_SPORT_MAP: dict[str, str] = {
    "trail": "TRAIL",
    "running": "RUNNING",
    "cycling": "CYCLING",
    "triathlon": "TRIATHLON",
    "duathlon": "TRIATHLON",
    "aquathlon": "TRIATHLON",
    "swimming": "SWIMMING",
    "mountaineering": "TRAIL",
    "march": "WALKING",
}

# Subsports that refine the sport type
_SUBSPORT_MAP: dict[str, str] = {
    "mtb": "BTT",
    "road": "CYCLING",
    "gravel": "CYCLING",
    "half marathon": "RUNNING",
    "marathon": "RUNNING",
    "10km": "RUNNING",
    "5km": "RUNNING",
    "15km": "RUNNING",
    "20km": "RUNNING",
    "sprint distance": "TRIATHLON",
    "olympic distance": "TRIATHLON",
    "super sprint": "TRIATHLON",
    "hiking": "WALKING",
}

# Sports we want to scrape (filter applied on listing)
_TARGET_SPORTS = frozenset(_SPORT_MAP.keys())


# ── Helpers ──────────────────────────────────────────────────────


def _parse_iso_date(text: str | None) -> datetime | None:
    """Parse ISO date strings from the API (e.g. ``2026-10-03T09:30:00``)."""
    if not text:
        return None
    # Strip fractional seconds (e.g. ".0000000")
    text = re.sub(r"\.\d+$", "", text.strip())
    for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y-%m-%dT%H:%M", "%Y-%m-%d"):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


def _map_sport_types(sport: str, subsports: list[str]) -> list[str]:
    """Map RockTheSport sport/subsport names to our internal enum values."""
    types: list[str] = []
    main = _SPORT_MAP.get(sport.lower(), "")
    if main:
        types.append(main)
    for sub in subsports:
        mapped = _SUBSPORT_MAP.get(sub.lower(), "")
        if mapped and mapped not in types:
            types.append(mapped)
    return types or ["OTHER"]


def _build_event_url(slug: str) -> str:
    """Build the public web URL for an event."""
    return f"{_WEB_BASE}/en/event/{slug}"


def _extract_price(fee: dict) -> float | None:
    """Extract the current price from a fee object."""
    price = fee.get("price")
    if isinstance(price, (int, float)) and price > 0:
        return float(price)
    # Try prices list (time-phased pricing)
    prices = fee.get("prices", [])
    if prices and isinstance(prices[0], dict):
        amount = prices[0].get("amount")
        if isinstance(amount, (int, float)) and amount > 0:
            return float(amount)
    return None


# ── Scraper class ────────────────────────────────────────────────


class RockTheSportScraper(BaseScraper):
    source_name = "rockthesport"
    display_name = "RockTheSport"
    base_url = _WEB_BASE
    description = "Spanish sport-event platform — rockthesport.com"

    async def _api_get(self, path: str, params: dict | None = None) -> dict:
        """Make an authenticated GET request to the RockTheSport API."""
        client = await self._get_client()
        url = f"{_API_BASE}{path}"
        resp = await client.get(
            url,
            params=params or {},
            headers={"x-api-key": _API_KEY},
        )
        resp.raise_for_status()
        return resp.json()

    async def scrape(self) -> list[ScrapedEventData]:
        """Scrape all relevant Spain events from the RockTheSport API."""
        # 1. Paginate through the event list
        all_items: list[dict] = []
        page = 1
        while True:
            data = await self._api_get(
                "/api/Event/list",
                params={
                    "pageNumber": page,
                    "pageSize": _PAGE_SIZE,
                    "countryId": _COUNTRY_SPAIN,
                },
            )
            page_data = data.get("data", {})
            items = page_data.get("items", [])
            all_items.extend(items)

            pagination = page_data.get("pagination", {})
            if not pagination.get("hasNextPage", False):
                break
            page += 1

        logger.info("Fetched %d events from RockTheSport list", len(all_items))

        # 2. Filter for target sports
        filtered = [
            item for item in all_items
            if item.get("sport", "").lower() in _TARGET_SPORTS
        ]
        logger.info("Filtered to %d events matching target sports", len(filtered))

        # 3. Fetch detail for each event and build ScrapedEventData
        events: list[ScrapedEventData] = []
        for item in filtered:
            slug = item.get("slug")
            if not slug:
                continue
            try:
                ev = await self._scrape_event_detail(slug, item)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception(
                    "Failed to scrape RockTheSport event: %s", slug
                )
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Scrape a single event by its web URL."""
        # Extract slug from URL: .../event/{slug}
        slug = url.rstrip("/").rsplit("/", 1)[-1]
        return await self._scrape_event_detail(slug)

    async def _scrape_event_detail(
        self, slug: str, listing_item: dict | None = None,
    ) -> ScrapedEventData | None:
        """Fetch event detail from API and build ScrapedEventData."""
        data = await self._api_get(
            f"/api/Event/alias/{slug}",
            params={"countryId": _COUNTRY_SPAIN},
        )
        detail = data.get("data", {})
        if not detail:
            logger.warning("Empty detail for slug %s", slug)
            return None

        title = detail.get("title")
        if not title:
            return None

        event_id = str(detail.get("eventId", ""))
        source_url = _build_event_url(slug)

        # Dates
        dates = detail.get("dates", {})
        start_date = _parse_iso_date(dates.get("startedDateIso"))
        reg_deadline = _parse_iso_date(dates.get("endRegistrationIso"))

        # Location
        location = detail.get("location", {})
        city = location.get("city", "")
        if city:
            city = city.title()
        province = location.get("province", "")
        if province:
            province = province.title()
        # Combine city with province for richer location info
        city_display = f"{city}, {province}" if city and province else city or province
        country = (location.get("country") or "Spain").title()
        latitude = location.get("latitude")
        longitude = location.get("longitude")

        # Sports
        sport = detail.get("sport", listing_item.get("sport", "") if listing_item else "")
        subsports = detail.get("subsports", listing_item.get("subsports", []) if listing_item else [])
        sport_types = _map_sport_types(sport, subsports)

        # Organizer
        contact = detail.get("contactInfo", {})
        organizer_name = contact.get("organizationName") or contact.get("nameOrganization")
        external_url = contact.get("webPage") or None

        # Image
        image_url = detail.get("urlImage") or None
        poster = detail.get("poster", {})
        if not image_url and poster:
            image_url = poster.get("urlImage")

        # Description
        description = detail.get("furtherInformation") or None
        if description:
            # Clean HTML tags if present
            description = re.sub(r"<[^>]+>", " ", description).strip()
            description = re.sub(r"\s+", " ", description)
            if not description:
                description = None

        # Fees → variants
        variants: list[ScrapedVariantData] = []
        for fee in detail.get("fees", []):
            if not fee.get("visible", True) or not fee.get("active", True):
                continue
            name = fee.get("publicName") or fee.get("label") or fee.get("internalName", "")
            if not name:
                continue
            price = _extract_price(fee)
            variants.append(
                ScrapedVariantData(
                    name=name,
                    price=price,
                    currency=detail.get("currencyName", "EUR"),
                )
            )

        # Documents
        documents: list[ScrapedDocumentData] = []
        for media in detail.get("media", []):
            url_doc = media.get("url", "")
            if not url_doc:
                continue
            doc_name = media.get("name", "")
            doc_type = "regulation" if "reglamento" in doc_name.lower() else "other"
            mime = "application/pdf" if url_doc.lower().endswith(".pdf") else None
            documents.append(
                ScrapedDocumentData(
                    original_url=url_doc,
                    document_type=doc_type,
                    file_name=doc_name or None,
                    mime_type=mime,
                )
            )

        raw = {
            "slug": slug,
            "eventId": event_id,
            "sport": sport,
            "subsports": subsports,
            "image_url": image_url,
        }

        return ScrapedEventData(
            title=title,
            source_url=source_url,
            source_event_id=event_id,
            description=description,
            sport_types=sport_types,
            start_date=start_date,
            registration_deadline=reg_deadline,
            city=city_display or None,
            country=country,
            latitude=latitude,
            longitude=longitude,
            organizer_name=organizer_name,
            external_url=external_url,
            image_url=image_url,
            variants=variants,
            documents=documents,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )
