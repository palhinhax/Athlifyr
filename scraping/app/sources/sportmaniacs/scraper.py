"""Sportmaniacs scraper — large Spanish sport-event platform.

Scrapes events from sportmaniacs.com via their public JSON API,
enriched with schema.org LD+JSON from HTML detail pages for
race variants (offers) and pricing.

Data extracted per event:
  - Title, description, sport type (via idRaceType)
  - Start / end date, city, province, country, GPS coordinates
  - Race variants with name, price, currency (from LD+JSON offers)
  - Regulation text, documents (PDF files)
  - Organizer contact info
  - Event image
"""

from __future__ import annotations

import html
import json
import logging
import re
from datetime import datetime

from bs4 import BeautifulSoup

from app.sources.base.scraper import (
    BaseScraper,
    ScrapedDocumentData,
    ScrapedEventData,
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)

_API_BASE = "https://api-aws.sportmaniacs.com"
_WEB_BASE = "https://sportmaniacs.com"
_LIST_API = f"{_WEB_BASE}/api/races"

# 25 items per page (API fixed)
_PAGE_SIZE = 25

# Race type IDs from the API mapped to our sport types.
# 0 = running/popular, 1 = trail/mountain, 2 = cycling, 3 = triathlon/duathlon,
# 4 = swimming, 5 = other, 7 = other
_RACE_TYPE_MAP: dict[str, list[str]] = {
    "0": ["RUNNING"],
    "1": ["TRAIL"],
    "2": ["CYCLING"],
    "3": ["TRIATHLON"],
    "4": ["SWIMMING"],
    "5": ["OTHER"],
    "7": ["OTHER"],
}

# We only scrape Spain
_COUNTRY_ESP = "ESP"


# ── Helpers ──────────────────────────────────────────────────────


def _parse_date(text: str | None) -> datetime | None:
    """Parse ``YYYY-MM-DD`` date strings from the API."""
    if not text:
        return None
    try:
        return datetime.strptime(text.strip(), "%Y-%m-%d")
    except ValueError:
        return None


def _map_sport_types(race_type_id: str, title: str) -> list[str]:
    """Map idRaceType + title keywords to internal sport types."""
    types = list(_RACE_TYPE_MAP.get(race_type_id, ["OTHER"]))

    title_lower = title.lower()
    # Refine based on title keywords
    kw_map = [
        (r"trail|mendi|mountain|ultra|cross\s", "TRAIL"),
        (r"btt|mtb|ciclismo|bike|cycling|gravel", "CYCLING"),
        (r"btb|bici", "BTT"),
        (r"triatl|duatl|aquatl", "TRIATHLON"),
        (r"swimrun|swimming|swim|nataç", "SWIMMING"),
        (r"walk|marcha|senderis|hiking|caminata", "WALKING"),
        (r"ocr|obstacle|spartan|hyrox", "OCR"),
    ]
    for pattern, sport in kw_map:
        if re.search(pattern, title_lower) and sport not in types:
            types.append(sport)

    return types


def _clean_html(text: str | None) -> str | None:
    """Strip HTML tags and decode entities."""
    if not text:
        return None
    clean = re.sub(r"<[^>]+>", " ", text)
    clean = html.unescape(clean)
    clean = re.sub(r"\s+", " ", clean).strip()
    return clean or None


def _best_image(photos: dict | None) -> str | None:
    """Pick the highest resolution image from a photos dict."""
    if not photos:
        return None
    for key in ("md", "sm", "xs"):
        url = photos.get(key)
        if url and "default_dark" not in url:
            return url
    return None


def _build_event_url(slug: str) -> str:
    return f"{_WEB_BASE}/es/races/{slug}"


def _parse_ld_json_offers(ld_text: str) -> list[dict]:
    """Parse schema.org LD+JSON and extract offers."""
    try:
        data = json.loads(ld_text)
        if isinstance(data, list):
            data = data[0] if data else {}
        return data.get("offers", [])
    except (json.JSONDecodeError, IndexError):
        return []


# ── Scraper class ────────────────────────────────────────────────


class SportmaniacsScraper(BaseScraper):
    source_name = "sportmaniacs"
    display_name = "Sportmaniacs"
    base_url = _WEB_BASE
    description = "Large Spanish sport-event platform — sportmaniacs.com"

    async def _api_list_page(self, page: int) -> dict:
        """Fetch one page of the race listing API."""
        client = await self._get_client()
        resp = await client.get(
            _LIST_API,
            params={"page": page, "lang": "es"},
        )
        resp.raise_for_status()
        return resp.json()

    async def _api_detail(self, slug: str) -> dict:
        """Fetch full race detail from the AWS API."""
        client = await self._get_client()
        resp = await client.get(
            f"{_API_BASE}/api/races/{slug}",
            params={"lang": "es"},
        )
        resp.raise_for_status()
        return resp.json().get("data", {})

    async def _fetch_ld_json_offers(self, slug: str) -> list[ScrapedVariantData]:
        """Fetch the HTML detail page and extract offers from LD+JSON."""
        client = await self._get_client()
        url = _build_event_url(slug)
        resp = await client.get(url)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "lxml")

        variants: list[ScrapedVariantData] = []
        for script in soup.find_all("script", type="application/ld+json"):
            offers = _parse_ld_json_offers(script.string or "")
            for offer in offers:
                name = html.unescape(offer.get("name", "")).strip()
                if not name:
                    continue
                price_str = offer.get("price", "")
                try:
                    price = float(price_str) if price_str else None
                except (ValueError, TypeError):
                    price = None
                # Currency comes as symbol or code
                currency_raw = offer.get("priceCurrency", "EUR")
                currency = "EUR" if currency_raw in ("€", "EUR", "") else currency_raw
                variants.append(
                    ScrapedVariantData(
                        name=name,
                        price=price if price and price > 0 else None,
                        currency=currency,
                    )
                )
        return variants

    async def scrape(self) -> list[ScrapedEventData]:
        """Scrape all future Spain events from Sportmaniacs."""
        from datetime import date as _date

        today = _date.today()

        # 1. Paginate listing to collect future Spain events.
        #    The API returns events sorted by date descending, so once
        #    we hit a page where all events are in the past we can stop.
        first_page = await self._api_list_page(1)
        total_pages = first_page.get("futurePages", first_page.get("totalPages", 1))
        all_items: list[dict] = []

        def _collect(items: list[dict]) -> bool:
            """Add future ESP items. Returns False if all items are past."""
            any_future = False
            for item in items:
                if item.get("country_id") != _COUNTRY_ESP:
                    continue
                event_date = _parse_date(item.get("date"))
                if event_date and event_date.date() < today:
                    continue
                any_future = True
                all_items.append(item)
            return any_future

        _collect(first_page.get("data", []))

        # Paginate remaining pages
        pages_scanned = 1
        for page in range(2, total_pages + 1):
            try:
                page_data = await self._api_list_page(page)
                pages_scanned = page
                items = page_data.get("data", [])
                if not items:
                    break
                has_future = _collect(items)
                # API returns newest first — once a full page is past, stop
                if not has_future:
                    logger.info("Page %d has no future events, stopping pagination", page)
                    break
            except Exception:
                logger.exception("Failed to fetch page %d", page)
                break

        logger.info(
            "Fetched %d future Spain events from Sportmaniacs (%d pages scanned)",
            len(all_items), pages_scanned,
        )

        # 2. Fetch detail + offers for each event
        events: list[ScrapedEventData] = []
        for item in all_items:
            slug = item.get("slug")
            if not slug:
                continue
            try:
                ev = await self._scrape_event_detail(slug, item)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape event: %s", slug)

        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Scrape a single event by URL."""
        slug = url.rstrip("/").rsplit("/", 1)[-1]
        return await self._scrape_event_detail(slug)

    async def _scrape_event_detail(
        self, slug: str, listing_item: dict | None = None,
    ) -> ScrapedEventData | None:
        """Fetch event detail and build ScrapedEventData."""
        detail = await self._api_detail(slug)
        if not detail:
            return None

        title = detail.get("name") or (listing_item or {}).get("name")
        if not title:
            return None

        event_id = detail.get("id") or detail.get("idRace")
        source_url = _build_event_url(slug)

        # Dates
        start_date = _parse_date(detail.get("date"))
        end_date = _parse_date(detail.get("end_date"))

        # Location
        city = detail.get("city", "")
        province = detail.get("province", "")
        city_display = f"{city}, {province}" if city and province else city or province
        country = detail.get("country", "España")

        lat_str = detail.get("latitude", "")
        lon_str = detail.get("longitude", "")
        latitude = float(lat_str) if lat_str else None
        longitude = float(lon_str) if lon_str else None

        # Sport types
        race_type = detail.get("idRaceType", (listing_item or {}).get("idRaceType", "0"))
        sport_types = _map_sport_types(str(race_type), title)

        # Description — combine rules + hour_info
        description = _clean_html(detail.get("rules")) or _clean_html(detail.get("description"))

        # Image
        image_url = _best_image(detail.get("photos"))

        # Organizer
        contact = detail.get("contact_info", {})
        organizer_name = None
        external_url = detail.get("externalInscriptions") or None

        # Documents (files from API)
        documents: list[ScrapedDocumentData] = []
        for f in detail.get("files", []):
            url_doc = f.get("url")
            if not url_doc:
                continue
            documents.append(
                ScrapedDocumentData(
                    original_url=url_doc,
                    document_type="regulation" if "reglamento" in (f.get("title", "")).lower() else "other",
                    file_name=f.get("title"),
                    mime_type="application/pdf" if url_doc.lower().endswith(".pdf") else None,
                )
            )

        # Regulation as text (rules_link or rules_file)
        rules_link = detail.get("rules_link")
        rules_file = detail.get("rules_file")
        if rules_link and rules_link.strip():
            documents.append(
                ScrapedDocumentData(
                    original_url=rules_link.strip(),
                    document_type="regulation",
                    file_name="Reglamento",
                    mime_type="application/pdf" if rules_link.lower().endswith(".pdf") else None,
                )
            )
        if rules_file and rules_file.strip() and rules_file != rules_link:
            documents.append(
                ScrapedDocumentData(
                    original_url=rules_file.strip(),
                    document_type="regulation",
                    file_name="Reglamento",
                    mime_type="application/pdf" if rules_file.lower().endswith(".pdf") else None,
                )
            )

        # Offers/variants from LD+JSON (HTML scraping)
        try:
            variants = await self._fetch_ld_json_offers(slug)
        except Exception:
            logger.debug("Could not fetch LD+JSON offers for %s", slug)
            variants = []

        raw = {
            "slug": slug,
            "eventId": event_id,
            "idRaceType": race_type,
            "image_url": image_url,
        }

        return ScrapedEventData(
            title=title,
            source_url=source_url,
            source_event_id=str(event_id) if event_id else None,
            description=description,
            sport_types=sport_types,
            start_date=start_date,
            end_date=end_date,
            city=city_display or None,
            country=country or "España",
            latitude=latitude,
            longitude=longitude,
            organizer_name=organizer_name,
            external_url=external_url,
            image_url=image_url,
            variants=variants,
            documents=documents,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )
