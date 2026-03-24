"""TimerSpeed scraper — extracts events from timerspeed.com.

Uses WordPress "The Events Calendar" plugin (tribe_events).

Site structure
--------------
* Listing page ``/?post_type=tribe_events`` — events grouped by month,
  with title, date, location, banner image, link to detail page.
* Detail page ``/?tribe_events={slug}`` — full description, date, location,
  sport category, organizer, registration & regulation links.
"""

from __future__ import annotations

import json
import logging
import re
from datetime import datetime
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.sources.base.scraper import (
    BaseScraper,
    ScrapedDocumentData,
    ScrapedEventData,
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)

_BASE = "https://timerspeed.com"
_LISTING_URL = f"{_BASE}/?post_type=tribe_events"

_EN_MONTHS: dict[str, int] = {
    "janeiro": 1, "fevereiro": 2, "março": 3, "marco": 3,
    "abril": 4, "maio": 5, "junho": 6,
    "julho": 7, "agosto": 8, "setembro": 9,
    "outubro": 10, "novembro": 11, "dezembro": 12,
}

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btrail\b|\btrilho", re.I), "TRAIL"),
    (re.compile(r"\bbtt\b|\bmtb\b|\bmountain\s*bike", re.I), "BTT"),
    (re.compile(r"\bcicl\w*\b|\bgravel\b", re.I), "CYCLING"),
    (re.compile(r"\btriathlon\b|\btriatlo\b|\bduatlo\b", re.I), "TRIATHLON"),
    (re.compile(r"\bcorrida\b|\bmaratona\b|\bmeia[- ]maratona\b|\brun\b|\batletismo", re.I), "RUNNING"),
    (re.compile(r"\bcaminhada\b|\bwalk\b|\bmarcha\b", re.I), "WALKING"),
    (re.compile(r"\bnatação\b|\bswim\b", re.I), "SWIMMING"),
    (re.compile(r"\bobstáculo\b|\bocr\b", re.I), "OCR"),
]

# WordPress tribe_events month names (Portuguese)
_TRIBE_MONTHS: dict[str, int] = {
    "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4,
    "maio": 5, "junho": 6, "julho": 7, "agosto": 8,
    "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12,
}


def _parse_tribe_date(date_text: str, month_heading: str | None) -> datetime | None:
    """Parse tribe_events date like ``Abril 4`` with year from month heading."""
    date_text = date_text.strip()

    # "Abril 4" or "Maio 22 - Maio 24"
    m = re.match(r"(\w+)\s+(\d{1,2})", date_text)
    if not m:
        return None
    month_name = m.group(1).lower()
    day = int(m.group(2))

    month = _TRIBE_MONTHS.get(month_name)
    if not month:
        return None

    # Extract year from month heading like "Abril 2026" or "Maio 2026"
    year = datetime.now().year
    if month_heading:
        ym = re.search(r"(\d{4})", month_heading)
        if ym:
            year = int(ym.group(1))

    try:
        return datetime(year, month, day)
    except ValueError:
        return None


def _guess_sport_types(title: str, category: str | None = None) -> list[str]:
    combined = f"{title} {category or ''}"
    types: list[str] = []
    for pattern, sport in _SPORT_KW:
        if pattern.search(combined) and sport not in types:
            types.append(sport)
    return types or ["OTHER"]


class TimerSpeedScraper(BaseScraper):
    source_name = "timerspeed"
    display_name = "TimerSpeed"
    base_url = _BASE
    description = "Timing & events platform — timerspeed.com"

    async def scrape(self) -> list[ScrapedEventData]:
        events: list[ScrapedEventData] = []
        seen: set[str] = set()
        now = datetime.now()

        # Fetch listing page (may need multiple pages)
        url = _LISTING_URL
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        cards = self._extract_listing_cards(soup)
        logger.info("Found %d event cards on TimerSpeed", len(cards))

        for card in cards:
            if card.get("date") and card["date"] < now:
                continue
            event_url = card.get("url")
            if not event_url or event_url in seen:
                continue
            seen.add(event_url)
            try:
                ev = await self.scrape_event(event_url, card)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape TimerSpeed event: %s", event_url)

        logger.info("Total events scraped from TimerSpeed: %d", len(events))
        return events

    async def scrape_event(
        self, url: str, card: dict | None = None,
    ) -> ScrapedEventData | None:
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        title = self._extract_title(soup)
        if not title:
            title = card.get("title") if card else None
        if not title:
            logger.warning("No title for %s — skipping", url)
            return None

        description = self._extract_description(soup)
        city = self._extract_location(soup) or (card.get("city") if card else None)
        start_date = card.get("date") if card else None
        category = self._extract_category(soup)
        organizer = self._extract_organizer(soup)
        image_url = self._extract_image(soup) or (card.get("image_url") if card else None)
        documents = self._extract_documents(soup)

        sport_types = _guess_sport_types(title, category)
        slug = url.rstrip("/").rsplit("=", 1)[-1] if "tribe_events=" in url else url.rstrip("/").rsplit("/", 1)[-1]

        # Parse variants from description
        variants: list[ScrapedVariantData] = []
        if description:
            for m in re.finditer(r"([\w\s]+?)\s*[-–]\s*(\d+)\s*km", description):
                variants.append(ScrapedVariantData(
                    name=m.group(1).strip(),
                    distance_km=float(m.group(2)),
                ))

        raw = {"url": url, "title": title, "category": category}

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=slug,
            description=description,
            sport_types=sport_types,
            start_date=start_date,
            city=city,
            country="Portugal",
            organizer_name=organizer,
            image_url=image_url,
            variants=variants,
            documents=documents,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── Listing helpers ──────────────────────────────────────────

    def _extract_listing_cards(self, soup: BeautifulSoup) -> list[dict]:
        """Extract event cards from The Events Calendar list view."""
        cards: list[dict] = []
        seen: set[str] = set()

        current_month: str | None = None

        # The events are in a list, typically under tribe-events-list
        # Each month has a heading, events follow
        for el in soup.select("h2.tribe-events-list-separator-month, article.tribe-events-calendar-list__event, div.tribe-events-calendar-list__event-row"):
            if el.name == "h2":
                current_month = el.get_text(strip=True)
                continue

            # Also look for month headers in span tags
            month_span = el.find_previous("span", class_="tribe-events-calendar-month__header-column-title")
            if month_span:
                current_month = month_span.get_text(strip=True)

        # Fallback: parse all links to tribe_events slugs
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href:
                continue

            # Match tribe_events URLs
            if "tribe_events=" not in href and "/events/" not in href:
                continue
            if href in seen or "post_type=" in href or "paged=" in href:
                continue

            title = a.get_text(strip=True)
            if not title or len(title) < 3 or title.lower() in (
                "eventos", "home", "contactos", "eventos anteriores",
            ):
                continue

            full_url = href if href.startswith("http") else urljoin(_BASE, href)
            seen.add(full_url)

            # Find date and location context from nearby elements
            parent = a.parent
            container = parent
            for _ in range(5):
                if container and container.parent and container.parent.name not in ("body", "html"):
                    container = container.parent
                else:
                    break

            date_dt: datetime | None = None
            city: str | None = None
            image_url: str | None = None

            if container:
                container_text = container.get_text(" ", strip=True)
                # Find month heading (e.g. "Abril 2026")
                month_heading = None
                prev = container.find_previous(["h2", "h3"])
                if prev:
                    month_heading = prev.get_text(strip=True)

                # Find date text like "Abril 4" or "Maio 22 - Maio 24"
                dm = re.search(
                    r"(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|Setembro|Outubro|Novembro|Dezembro)\s+\d{1,2}",
                    container_text,
                    re.I,
                )
                if dm:
                    date_dt = _parse_tribe_date(dm.group(0), month_heading or container_text)

                # Location: "City , Portugal"
                lm = re.search(r"([\w\s]+?)\s*,\s*Portugal", container_text)
                if lm:
                    city = lm.group(1).strip()

                # Image
                img = container.select_one("img[src]")
                if img:
                    src = img.get("src", "")
                    if src and "logo" not in src.lower():
                        image_url = urljoin(_BASE, src)

            cards.append({
                "url": full_url,
                "title": title,
                "date": date_dt,
                "city": city,
                "image_url": image_url,
            })

        return cards

    # ── Detail page helpers ──────────────────────────────────────

    def _extract_title(self, soup: BeautifulSoup) -> str | None:
        h1 = soup.select_one("h1.tribe-events-single-event-title, h1")
        if h1:
            return h1.get_text(strip=True) or None
        return None

    def _extract_description(self, soup: BeautifulSoup) -> str | None:
        desc = soup.select_one("div.tribe-events-single-event-description, div.tribe-events-content")
        if desc:
            text = desc.get_text(strip=True)
            if text:
                return text[:2000]
        return None

    def _extract_location(self, soup: BeautifulSoup) -> str | None:
        venue = soup.select_one("dd.tribe-venue, span.tribe-venue")
        if venue:
            return venue.get_text(strip=True)
        # Fallback: look for text near "LOCAL"
        text = soup.get_text("\n")
        m = re.search(r"LOCAL\s*\n+\s*(.+?)(?:\n|Portugal)", text)
        if m:
            return m.group(1).strip()
        return None

    def _extract_category(self, soup: BeautifulSoup) -> str | None:
        cat = soup.select_one("dd.tribe-events-event-categories a, a.tribe-events-calendar-list__event-row--category")
        if cat:
            return cat.get_text(strip=True)
        # Fallback
        text = soup.get_text(" ")
        m = re.search(r"Categoria de Evento[:\s]+(\w[\w\s]*?)(?:\s{2}|\n)", text)
        if m:
            return m.group(1).strip()
        return None

    def _extract_organizer(self, soup: BeautifulSoup) -> str | None:
        org = soup.select_one("dd.tribe-organizer, span.tribe-organizer")
        if org:
            return org.get_text(strip=True)
        text = soup.get_text("\n")
        m = re.search(r"ORGANIZADOR\s*\n+\s*(.+?)(?:\n)", text)
        if m:
            return m.group(1).strip()
        return None

    def _extract_image(self, soup: BeautifulSoup) -> str | None:
        og = soup.find("meta", property="og:image")
        if og:
            content = og.get("content", "")
            if content:
                return content.strip()
        img = soup.select_one("div.tribe-events-event-image img")
        if img:
            src = img.get("src", "")
            if src:
                return urljoin(_BASE, src)
        return None

    def _extract_documents(self, soup: BeautifulSoup) -> list[ScrapedDocumentData]:
        docs: list[ScrapedDocumentData] = []
        for a in soup.select("a[href]"):
            text = a.get_text(strip=True).lower()
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if "regulamento" in text and href and href.endswith(".pdf"):
                docs.append(ScrapedDocumentData(
                    original_url=urljoin(_BASE, href),
                    document_type="regulation",
                    file_name=href.rsplit("/", 1)[-1],
                    mime_type="application/pdf",
                ))
        return docs
