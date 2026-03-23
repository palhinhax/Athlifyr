"""SportChip scraper — extracts events from sportchip.net.

Site structure
--------------
* Listing page ``/eventos`` — event cards with date, title, time, location
  and link to detail page ``/evento/{id}-{slug}``.
* Detail page ``/evento/{id}-{slug}`` — date, time, location (organizer venue),
  image, registration link, regulation section, map coordinates.
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
)

logger = logging.getLogger(__name__)

_BASE = "https://sportchip.net"
_LISTING_URL = f"{_BASE}/eventos"

_PT_MONTHS: dict[str, int] = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4,
    "mai": 5, "jun": 6, "jul": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
    "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4,
    "maio": 5, "junho": 6, "julho": 7, "agosto": 8,
    "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12,
}

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btrail\b|\btrilho", re.I), "TRAIL"),
    (re.compile(r"\bbtt\b|\bmtb\b", re.I), "BTT"),
    (re.compile(r"\bcicl\w*\b|\bgravel\b", re.I), "CYCLING"),
    (re.compile(r"\btriathlon\b|\btriatlo\b|\bduatlo\b|\baquatlo\b", re.I), "TRIATHLON"),
    (re.compile(r"\bcorrida\b|\bmaratona\b|\bmeia[- ]maratona\b|\brun\b", re.I), "RUNNING"),
    (re.compile(r"\bcaminhada\b|\bwalk\b|\bmarcha\b", re.I), "WALKING"),
    (re.compile(r"\bnatação\b|\bswim\b", re.I), "SWIMMING"),
    (re.compile(r"\bobstáculo\b|\bocr\b", re.I), "OCR"),
]


def _parse_date(text: str) -> datetime | None:
    """Parse ``12 Abril 2026`` or ``12 ABR 2026``."""
    text = text.strip().lower()
    m = re.match(r"(\d{1,2})\s+(\w+)\s*,?\s*(\d{4})", text)
    if m:
        day_s, month_s, year_s = m.groups()
        month = _PT_MONTHS.get(month_s[:3])
        if month:
            try:
                return datetime(int(year_s), month, int(day_s))
            except ValueError:
                pass
    return None


def _guess_sport_types(title: str) -> list[str]:
    types: list[str] = []
    for pattern, sport in _SPORT_KW:
        if pattern.search(title) and sport not in types:
            types.append(sport)
    return types or ["OTHER"]


class SportChipScraper(BaseScraper):
    source_name = "sportchip"
    display_name = "SportChip"
    base_url = _BASE
    description = "Timing & registration platform — sportchip.net"

    async def scrape(self) -> list[ScrapedEventData]:
        html = await self.fetch_page(_LISTING_URL)
        soup = BeautifulSoup(html, "lxml")

        events: list[ScrapedEventData] = []
        seen: set[str] = set()
        now = datetime.now()

        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href or not re.search(r"evento/\d+", href):
                continue
            full_url = href if href.startswith("http") else urljoin(_BASE, href)
            if full_url in seen:
                continue
            seen.add(full_url)

            try:
                ev = await self.scrape_event(full_url)
                if ev:
                    # Only future events
                    if ev.start_date and ev.start_date < now:
                        continue
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape SportChip event: %s", full_url)

        logger.info("Total events scraped from SportChip: %d", len(events))
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        title = self._extract_title(soup)
        if not title:
            logger.warning("No title for %s — skipping", url)
            return None

        start_date = self._extract_date(soup)
        start_time = self._extract_time(soup)
        city = self._extract_location(soup)
        image_url = self._extract_image(soup)
        documents = self._extract_documents(soup)
        google_maps_url = self._extract_maps_url(soup)
        registration_url = self._extract_registration_url(soup)

        sport_types = _guess_sport_types(title)
        event_id = re.search(r"/evento/(\d+)", url)
        eid = event_id.group(1) if event_id else url.rstrip("/").rsplit("/", 1)[-1]

        description = None
        if registration_url:
            description = f"Inscrições: {registration_url}"

        raw = {"url": url, "title": title, "registration_url": registration_url}

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=eid,
            description=description,
            sport_types=sport_types,
            start_date=start_date,
            city=city,
            country="Portugal",
            image_url=image_url,
            google_maps_url=google_maps_url,
            external_url=registration_url,
            documents=documents,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── Helpers ──────────────────────────────────────────────────

    def _extract_title(self, soup: BeautifulSoup) -> str | None:
        h1 = soup.find("h1")
        if h1:
            text = h1.get_text(strip=True)
            if text:
                return text
        og = soup.find("meta", property="og:title")
        if og:
            return og.get("content", "").strip() or None
        return None

    def _extract_date(self, soup: BeautifulSoup) -> datetime | None:
        # Icon-based: <p><i class="fa fa-calendar">...</i> 12&nbsp;abril&nbsp;2026</p>
        text = self._icon_text(soup, "fa-calendar")
        if text:
            dt = _parse_date(text)
            if dt:
                return dt
        # Fallback: search full page text
        full = self._normalised_text(soup)
        m = re.search(
            r"(\d{1,2})\s+(Janeiro|Fevereiro|Março|Abril|Maio|Junho|Julho|Agosto|"
            r"Setembro|Outubro|Novembro|Dezembro)\s+(\d{4})", full, re.I,
        )
        if m:
            return _parse_date(m.group(0))
        m = re.search(
            r"(\d{1,2})\s+(Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez)"
            r"\s*,?\s*(\d{4})", full, re.I,
        )
        if m:
            return _parse_date(m.group(0))
        return None

    def _extract_time(self, soup: BeautifulSoup) -> str | None:
        text = self._icon_text(soup, "fa-hourglass")
        if text:
            m = re.search(r"(\d{1,2}:\d{2})", text)
            if m:
                return m.group(1)
        full = self._normalised_text(soup)
        m = re.search(r"(\d{1,2}:\d{2})\s*H", full)
        if m:
            return m.group(1)
        return None

    def _extract_location(self, soup: BeautifulSoup) -> str | None:
        text = self._icon_text(soup, "fa-user")
        if text:
            return text
        # Fallback: look near map icon image
        for img in soup.select("img[src*='map']"):
            parent = img.parent
            if parent:
                sibling = parent.find_next_sibling() or parent.find_next()
                if sibling:
                    t = sibling.get_text(strip=True)
                    if t and len(t) < 100:
                        return t
        return None

    # ── Utility ──────────────────────────────────────────────────

    @staticmethod
    def _icon_text(soup: BeautifulSoup, icon_class: str) -> str | None:
        """Return cleaned text from the first ``<p>`` containing an
        ``<i class="... {icon_class} ...">`` icon.
        """
        icon = soup.find("i", class_=re.compile(re.escape(icon_class)))
        if not icon:
            return None
        p = icon.find_parent("p")
        if not p:
            return None
        text = p.get_text(strip=True)
        # Normalise non-breaking spaces and collapse whitespace
        text = text.replace("\xa0", " ").replace("&nbsp", " ")
        text = re.sub(r"\s+", " ", text).strip()
        return text or None

    @staticmethod
    def _normalised_text(soup: BeautifulSoup) -> str:
        """Full page text with normalised whitespace."""
        text = soup.get_text(" ")
        text = text.replace("\xa0", " ").replace("&nbsp", " ")
        return re.sub(r"\s+", " ", text)

    def _extract_image(self, soup: BeautifulSoup) -> str | None:
        img = soup.select_one("img.event-single, img[src*='eventos']")
        if img:
            src = img.get("src", "")
            if src:
                return urljoin(_BASE, src)
        og = soup.find("meta", property="og:image")
        if og:
            return og.get("content", "").strip() or None
        return None

    def _extract_documents(self, soup: BeautifulSoup) -> list[ScrapedDocumentData]:
        docs: list[ScrapedDocumentData] = []
        seen: set[str] = set()
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if href and href.endswith(".pdf"):
                full_url = urljoin(_BASE, href)
                if full_url in seen:
                    continue
                seen.add(full_url)
                text = a.get_text(strip=True).lower()
                docs.append(ScrapedDocumentData(
                    original_url=full_url,
                    document_type="regulation" if "regulamento" in text else "other",
                    file_name=href.rsplit("/", 1)[-1],
                    mime_type="application/pdf",
                ))
        return docs

    def _extract_maps_url(self, soup: BeautifulSoup) -> str | None:
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if "google.com/maps" in href or "maps.app.goo.gl" in href:
                return href
        # Check for coordinate-based link
        for a in soup.select("a[href*='maps/place']"):
            return a.get("href", "")
        return None

    def _extract_registration_url(self, soup: BeautifulSoup) -> str | None:
        for a in soup.select("a[href]"):
            text = a.get_text(strip=True).lower()
            if "inscrever" in text or "inscrição" in text:
                href = a.get("href", "")
                if href and href != "#":
                    return href
        return None
