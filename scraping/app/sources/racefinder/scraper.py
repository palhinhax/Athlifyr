"""RaceFinder scraper — Portuguese sport-event aggregator.

Scrapes running, cycling, swimming, triathlon and duathlon events
in Portugal from racefinder.pt.  Since RaceFinder is an aggregator,
most events already exist from primary-source scrapers.  This scraper
runs **last** in the registry so cross-source dedup merges data
into existing records (``merge_only=True``).

IMPORTANT: ``image_url`` is **always** ``None`` — we never store
images from RaceFinder.

Data extracted per event:
  • Title, description, sport types
  • Start / end date, city, GPS coordinates
  • Race variants with name, distance, start time, price
  • Regulation documents (links from Information section)
"""

from __future__ import annotations

import json
import logging
import re
from datetime import datetime
from urllib.parse import urljoin

from bs4 import BeautifulSoup, Tag

from app.sources.base.scraper import (
    BaseScraper,
    ScrapedDocumentData,
    ScrapedEventData,
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)

_BASE = "https://racefinder.pt"
_ALL_RACES = f"{_BASE}/all-races/"

# Month abbreviations used on the site (English)
_MONTHS: dict[str, int] = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4,
    "may": 5, "jun": 6, "jul": 7, "aug": 8,
    "sep": 9, "oct": 10, "nov": 11, "dec": 12,
}

_FULL_MONTHS: dict[str, int] = {
    "january": 1, "february": 2, "march": 3, "april": 4,
    "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}

# RaceFinder breadcrumb/tag → SportType mapping
_SPORT_MAP: dict[str, str] = {
    "running": "RUNNING",
    "trail run": "TRAIL",
    "trail-run": "TRAIL",
    "trail running": "TRAIL",
    "road running": "RUNNING",
    "road-running": "RUNNING",
    "walking": "WALKING",
    "walk": "WALKING",
    "cycling": "CYCLING",
    "road cycling": "CYCLING",
    "road-cycling": "CYCLING",
    "mtb": "BTT",
    "btt": "BTT",
    "gravel": "CYCLING",
    "e-bike": "CYCLING",
    "swimming": "SWIMMING",
    "open water": "SWIMMING",
    "open-water": "SWIMMING",
    "triathlon": "TRIATHLON",
    "duathlon": "TRIATHLON",
    "hybrid race": "OCR",
    "obstacle race": "OCR",
    "ocr": "OCR",
    "kids race": "RUNNING",
    "kids": "RUNNING",
    "youth": "RUNNING",
    "raid": "BTT",
    "time trial": "CYCLING",
    "time-trial": "CYCLING",
    "surf": "SURF",
}


# ── Helpers ───────────────────────────────────────────────────────


def _parse_listing_date(day_text: str, month_text: str) -> tuple[int, int] | None:
    """Parse day and month from listing card (e.g. '19', 'Apr')."""
    m = _MONTHS.get(month_text.strip().lower()[:3])
    if not m:
        return None
    try:
        return (int(day_text.strip()), m)
    except (ValueError, TypeError):
        return None


def _parse_hero_date(text: str) -> datetime | None:
    """Parse a hero feature date like 'Sun, April 19, 2026'.

    Also handles range strings — returns the start date:
    'March 26 — March 29, 2026' or 'March 28-29, 2026'.
    """
    text = text.strip()

    # Full format: "Sun, April 19, 2026"
    m = re.search(
        r"(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s*"
        r"(\w+)\s+(\d{1,2}),?\s*(\d{4})",
        text,
        re.IGNORECASE,
    )
    if m:
        month = _FULL_MONTHS.get(m.group(1).strip().lower())
        if month:
            try:
                return datetime(int(m.group(3)), month, int(m.group(2)))
            except ValueError:
                pass

    # Range: "March 26 — March 29, 2026" or "26 MAR — 29 MAR"
    m = re.search(r"(\w+)\s+(\d{1,2})\b.*?(\d{4})", text, re.IGNORECASE)
    if m:
        month = _FULL_MONTHS.get(m.group(1).strip().lower())
        if month:
            try:
                return datetime(int(m.group(3)), month, int(m.group(2)))
            except ValueError:
                pass

    return None


def _parse_end_date(text: str) -> datetime | None:
    """Parse end date from a hero feature date range.

    E.g. 'March 26 — March 29, 2026' → March 29 2026.
    """
    text = text.strip()
    # Split on dash/em-dash
    parts = re.split(r"\s*[—–\-]\s*", text)
    if len(parts) < 2:
        return None

    # Year is usually at the end
    year_m = re.search(r"(\d{4})", text)
    if not year_m:
        return None
    year = int(year_m.group(1))

    last = parts[-1]
    m = re.search(r"(\w+)\s+(\d{1,2})", last)
    if m:
        month = _FULL_MONTHS.get(m.group(1).strip().lower())
        if month:
            try:
                return datetime(year, month, int(m.group(2)))
            except ValueError:
                pass

    # Same month range: "28 — 29 MAR" or "March 28-29, 2026"
    m = re.search(r"(\d{1,2})\s*$", last.strip().rstrip(","))
    if m:
        # Get month from first part
        start_m = re.search(r"(\w+)\s+\d", parts[0])
        if start_m:
            month = _FULL_MONTHS.get(start_m.group(1).strip().lower())
            if month:
                try:
                    return datetime(year, month, int(m.group(1)))
                except ValueError:
                    pass

    return None


def _parse_variant_date(text: str) -> datetime | None:
    """Parse variant date like '19 Apr, 2026'."""
    text = text.strip().rstrip(",")
    m = re.search(r"(\d{1,2})\s+(\w{3,}),?\s*(\d{4})", text)
    if m:
        month = _MONTHS.get(m.group(2).strip().lower()[:3])
        if month:
            try:
                return datetime(int(m.group(3)), month, int(m.group(1)))
            except ValueError:
                pass
    return None


def _parse_variant_title(title: str) -> tuple[str, float | None]:
    """Parse a variant title like 'Trail Run 25 km' → (name, distance_km).

    Returns (full_title, distance_float_or_None).
    """
    title = title.strip()

    # Try to extract distance at end: "Trail Run 25 km"
    m = re.search(r"([\d.,]+)\s*(?:km|k)\b", title, re.IGNORECASE)
    if m:
        raw = m.group(1).replace(",", ".")
        try:
            return title, float(raw)
        except ValueError:
            pass

    # Metres: "Open Water 3000 M"
    m = re.search(r"([\d.,]+)\s*m\b", title, re.IGNORECASE)
    if m:
        raw = m.group(1).replace(",", ".")
        try:
            return title, float(raw) / 1000
        except ValueError:
            pass

    return title, None


def _parse_price(text: str) -> float | None:
    """Parse price from text like '21€' or '21 €' or 'FREE'."""
    text = text.strip().upper()
    if "FREE" in text:
        return 0.0
    m = re.search(r"([\d.,]+)\s*€?", text)
    if m:
        raw = m.group(1).replace(",", ".")
        try:
            return float(raw)
        except ValueError:
            pass
    return None


def _parse_time(text: str) -> str | None:
    """Parse start time from text like '9:00' or '09:30'."""
    m = re.search(r"(\d{1,2}:\d{2})", text.strip())
    return m.group(1) if m else None


def _extract_coords_from_maps_url(url: str) -> tuple[float, float] | None:
    """Extract lat/lng from Google Maps URL with destination= param."""
    m = re.search(r"destination=([-\d.]+),([-\d.]+)", url)
    if m:
        try:
            return float(m.group(1)), float(m.group(2))
        except ValueError:
            pass
    return None


def _map_sport_types(labels: list[str]) -> list[str]:
    """Map RaceFinder labels to SportType enum values."""
    types: list[str] = []
    for label in labels:
        key = label.strip().lower()
        # Try exact match first
        sport = _SPORT_MAP.get(key)
        if sport and sport not in types:
            types.append(sport)
            continue
        # Try partial matching
        for map_key, map_val in _SPORT_MAP.items():
            if map_key in key or key in map_key:
                if map_val not in types:
                    types.append(map_val)
                break
    return types or ["OTHER"]


# ── Scraper ───────────────────────────────────────────────────────


class RaceFinderScraper(BaseScraper):
    source_name = "racefinder"
    display_name = "RaceFinder"
    base_url = _BASE
    description = (
        "Portuguese sport-event aggregator — running, cycling, swimming, "
        "triathlon & duathlon — racefinder.pt"
    )

    # ── Main scrape ──────────────────────────────────────────────

    async def scrape(self) -> list[ScrapedEventData]:
        """Scrape all events from RaceFinder."""

        # Phase 1: collect all event URLs from listing pages
        event_urls = await self._collect_event_urls()
        logger.info("RaceFinder listing found %d event URLs", len(event_urls))

        # Phase 2: visit each detail page
        results: list[ScrapedEventData] = []
        for url in event_urls:
            try:
                event = await self.scrape_event(url)
                if event:
                    results.append(event)
            except Exception:
                logger.exception("Failed to scrape RaceFinder event: %s", url)

        return results

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Scrape a single event detail page."""
        if not url.startswith("http"):
            url = urljoin(_BASE, url)

        html = await self.fetch_page(url)
        return self._parse_event_detail(html, url)

    # ── Listing crawl ────────────────────────────────────────────

    async def _collect_event_urls(self) -> list[str]:
        """Crawl /all-races/ pages and return unique event detail URLs."""
        first_html = await self.fetch_page(_ALL_RACES)
        urls = self._extract_event_links(first_html)
        total_pages = self._detect_total_pages(first_html)

        logger.info("RaceFinder: %d pages detected", total_pages)

        for page in range(2, total_pages + 1):
            page_url = f"{_ALL_RACES}page/{page}/"
            try:
                page_html = await self.fetch_page(page_url)
                urls.update(self._extract_event_links(page_html))
            except Exception:
                logger.exception("Failed to fetch listing page %d", page)

        return sorted(urls)

    def _extract_event_links(self, html: str) -> set[str]:
        """Extract unique /event/ links from a listing page."""
        soup = BeautifulSoup(html, "lxml")
        links: set[str] = set()
        for a in soup.select("a[href*='/event/']"):
            href = a.get("href", "")
            if "/event/" in href and href != f"{_BASE}/event/":
                # Normalise to absolute URL
                full = urljoin(_BASE, href)
                # Exclude non-event pages
                if re.match(r"https://racefinder\.pt/event/[^/]+/?$", full):
                    links.add(full.rstrip("/") + "/")
        return links

    def _detect_total_pages(self, html: str) -> int:
        """Detect total pagination pages from listing page."""
        soup = BeautifulSoup(html, "lxml")
        max_page = 1
        for a in soup.select("a[href*='/all-races/']"):
            href = a.get("href", "")
            m = re.search(r"/page/(\d+)/?", href)
            if m:
                p = int(m.group(1))
                if p > max_page:
                    max_page = p
        return max_page

    # ── Detail page parsing ──────────────────────────────────────

    def _parse_event_detail(
        self, html: str, url: str
    ) -> ScrapedEventData | None:
        """Parse a full event detail page into ScrapedEventData."""
        soup = BeautifulSoup(html, "lxml")

        title = self._extract_title(soup)
        if not title:
            return None

        # JSON-LD data (Product schema)
        jld = self._extract_jsonld_product(soup)
        description = jld.get("description") if jld else None
        category = jld.get("category", "") if jld else ""

        # Fallback description from summary
        if not description:
            description = self._extract_summary(soup)

        # Hero date
        date_text = self._extract_hero_feature_text(soup, 0)
        start_date = _parse_hero_date(date_text) if date_text else None
        end_date = _parse_end_date(date_text) if date_text else None
        # If no range, end_date is None (single-day event)
        if end_date and start_date and end_date <= start_date:
            end_date = None

        # Location + coordinates
        city = self._extract_city(soup)
        lat, lng = self._extract_coords(soup)
        maps_url = self._extract_maps_url(soup)

        # Sport types from breadcrumbs + variant tags
        sport_labels = self._extract_sport_labels(soup, category)
        sport_types = _map_sport_types(sport_labels)

        # Race variants
        variants = self._extract_variants(soup)

        # Regulation documents
        documents = self._extract_documents(soup)

        return ScrapedEventData(
            title=title,
            source_url=url,
            description=description,
            sport_types=sport_types,
            start_date=start_date,
            end_date=end_date,
            city=city,
            latitude=lat,
            longitude=lng,
            google_maps_url=maps_url,
            image_url=None,  # NEVER store images from RaceFinder
            variants=variants,
            documents=documents,
        )

    # ── Element extractors ───────────────────────────────────────

    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract event title from h1."""
        h1 = soup.select_one("h1.eventHero__title")
        if h1:
            return h1.get_text(strip=True)
        h1 = soup.select_one("h1")
        return h1.get_text(strip=True) if h1 else ""

    def _extract_summary(self, soup: BeautifulSoup) -> str | None:
        """Extract description from EVENT SUMMARY section."""
        div = soup.select_one(".eventHero__summaryDescription")
        if div:
            text = div.get_text("\n", strip=True)
            return text if text else None
        return None

    def _extract_hero_feature_text(
        self, soup: BeautifulSoup, index: int
    ) -> str | None:
        """Extract text from the N-th hero feature item (0=date, 1=price, ...)."""
        items = soup.select("li.eventHero__featuresItem")
        if index < len(items):
            return items[index].get_text(strip=True)
        return None

    def _extract_city(self, soup: BeautifulSoup) -> str | None:
        """Extract city from Location block."""
        header = soup.select_one(".eventInfo__block_locationHeader")
        if header:
            text = header.get_text(strip=True)
            return text if text else None
        return None

    def _extract_coords(
        self, soup: BeautifulSoup
    ) -> tuple[float | None, float | None]:
        """Extract lat/lng from Google Maps link."""
        url = self._extract_maps_url(soup)
        if url:
            coords = _extract_coords_from_maps_url(url)
            if coords:
                return coords
        return None, None

    def _extract_maps_url(self, soup: BeautifulSoup) -> str | None:
        """Extract Google Maps directions URL."""
        a = soup.find("a", href=lambda h: h and "google.com/maps" in str(h))
        return a["href"] if a else None

    def _extract_jsonld_product(
        self, soup: BeautifulSoup
    ) -> dict | None:
        """Extract Product data from JSON-LD @graph."""
        for script in soup.select("script[type='application/ld+json']"):
            try:
                data = json.loads(script.string or "")
            except (json.JSONDecodeError, TypeError):
                continue
            if isinstance(data, dict) and "@graph" in data:
                for item in data["@graph"]:
                    if item.get("@type") == "Product":
                        # Clean description: remove " - RaceFinder" suffix
                        desc = item.get("description", "")
                        name = item.get("name", "")
                        name = re.sub(r"\s*-\s*RaceFinder$", "", name)
                        return {
                            "name": name,
                            "description": desc,
                            "category": item.get("category", ""),
                        }
        return None

    def _extract_sport_labels(
        self, soup: BeautifulSoup, category: str
    ) -> list[str]:
        """Collect sport type labels from breadcrumbs and variant titles."""
        labels: list[str] = []

        # From breadcrumbs
        for a in soup.select("a[href*='/events/']"):
            href = a.get("href", "")
            # Extract path segments like /events/running/trail-run/
            m = re.search(r"/events/([^/]+)/?(?:([^/]+)/?)?", href)
            if m:
                if m.group(2):
                    labels.append(m.group(2))
                labels.append(m.group(1))

        # From JSON-LD category
        if category:
            labels.append(category.lower())

        # From variant titles (raceDay__title)
        for h3 in soup.select("h3.raceDay__title"):
            title = h3.get_text(strip=True)
            # Extract the type part before the distance
            type_m = re.match(r"(.+?)\s+[\d.,]+\s*(?:km|k|m)\b", title, re.I)
            if type_m:
                labels.append(type_m.group(1).strip())
            else:
                # No distance — use full title as type
                labels.append(title)

        return labels

    def _extract_variants(self, soup: BeautifulSoup) -> list[ScrapedVariantData]:
        """Extract race variants from the Races section."""
        variants: list[ScrapedVariantData] = []

        for article in soup.select("article.raceDay"):
            title_el = article.select_one("h3.raceDay__title")
            if not title_el:
                continue

            raw_title = title_el.get_text(strip=True)
            name, distance_km = _parse_variant_title(raw_title)

            # Date and time from raceDay__feature divs
            features = article.select("div.raceDay__feature")
            start_time: str | None = None
            if len(features) >= 2:
                time_text = features[1].get_text(strip=True)
                start_time = _parse_time(time_text)

            # Price from raceDay__price
            price_el = article.select_one("div.raceDay__price")
            price: float | None = None
            if price_el:
                price = _parse_price(price_el.get_text(strip=True))

            variants.append(
                ScrapedVariantData(
                    name=name,
                    distance_km=distance_km,
                    start_time=start_time,
                    price=price,
                )
            )

        return variants

    def _extract_documents(
        self, soup: BeautifulSoup
    ) -> list[ScrapedDocumentData]:
        """Extract regulation/document links from Information section."""
        docs: list[ScrapedDocumentData] = []
        seen: set[str] = set()

        # Find the Information section
        for section in soup.select("section.eventInfo__block"):
            header = section.select_one(".eventInfo__blockHeader")
            if not header:
                continue
            if "Information" not in header.get_text(strip=True):
                continue

            # Find all links within the section
            for a in section.select("a[href]"):
                href = a.get("href", "").strip()
                text = a.get_text(strip=True).lower()

                if not href or href in seen:
                    continue

                # Regulation-like links (PDFs, external regulation pages)
                is_reg = (
                    "regulat" in text
                    or "regulamen" in text
                    or href.endswith(".pdf")
                )
                if is_reg:
                    seen.add(href)
                    file_name = href.rsplit("/", 1)[-1] if "/" in href else None
                    docs.append(
                        ScrapedDocumentData(
                            original_url=href,
                            document_type="regulation",
                            file_name=file_name,
                        )
                    )

        return docs
