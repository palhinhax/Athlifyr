"""WaitAStart scraper.

Scrapes events from waitastart.com — a WordPress-based timing company
listing trail, BTT, running, triathlon, and OCR events mostly in
central/northern Portugal.

Events are listed on the homepage as ``article.service-content`` cards.
Each card's h5 contains ``"DD MMM YYYY - Title - City"``.  Detail pages
host regulamento PDF links.
"""

from __future__ import annotations

import json
import logging
import re
from datetime import datetime

from bs4 import BeautifulSoup, Tag

from app.sources.base.scraper import (
    BaseScraper,
    ScrapedDocumentData,
    ScrapedEventData,
)

logger = logging.getLogger(__name__)

_BASE = "https://waitastart.com"

# ── Helpers ──────────────────────────────────────────────────────

_PT_MONTHS: dict[str, int] = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4, "mai": 5, "maio": 5,
    "jun": 6, "junho": 6, "jul": 7, "julho": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
    "abril": 4,
}

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btrail\b|\btrilho", re.I), "TRAIL"),
    (re.compile(r"\bbtt\b|\bmountain\s*bike\b|\bpasseio\s+btt\b", re.I), "BTT"),
    (re.compile(r"\bcorrida\b|\bmaratona\b|\bmeia[- ]maratona\b|\bgp[ai]\b|\b\d+\s*km\b", re.I), "RUNNING"),
    (re.compile(r"\bcaminhada\b|\bpasseio\b(?!.*btt)", re.I), "WALKING"),
    (re.compile(r"\bocr\b|\bchallenge\b|\bwild\s*fire\b", re.I), "OCR"),
    (re.compile(r"\baquat(?:lo|hlon)\b", re.I), "AQUATHLON"),
    (re.compile(r"\bduat(?:lo|hlon)\b", re.I), "DUATHLON"),
    (re.compile(r"\btriat(?:lo|hlon)\b", re.I), "TRIATHLON"),
    (re.compile(r"\bcycling\b|\bgravel\b|\bciclismo\b", re.I), "CYCLING"),
    (re.compile(r"\baquarace\b|\bswim\b", re.I), "SWIMMING"),
]


def _parse_card_text(text: str) -> tuple[str | None, str | None, str | None, datetime | None]:
    """Parse h5 text like ``29 Mar 2026 - III MARATONA BTT - Bragança``.

    Also handles:
    - ``11 Abr - Title - City``  (no year → assume current)
    - ``6 e 7 Junho 2026 - Title``  (date range → first day)
    - ``19 Abril 2026 - Title``  (full month name)

    Returns (title, city, date_str, datetime).
    """
    if not text:
        return None, None, None, None

    text = text.strip()

    # Split on " - " to separate date from title/city
    parts = [p.strip() for p in text.split(" - ")]
    if len(parts) < 2:
        return text, None, None, None

    date_str = parts[0]
    title = parts[1] if len(parts) >= 2 else None
    city = parts[2] if len(parts) >= 3 else None

    dt = _parse_date_str(date_str)

    return title, city, date_str, dt


def _parse_date_str(text: str) -> datetime | None:
    """Parse various Portuguese date formats."""
    text = text.strip().lower()
    now_year = datetime.now().year

    # "6 e 7 Junho 2026" → take first day
    m = re.match(r"(\d{1,2})\s*e\s+\d{1,2}\s+(\w+)\s+(\d{4})", text)
    if m:
        return _build_date(m.group(1), m.group(2), m.group(3))

    # "29 Mar 2026" or "19 Abril 2026" or "30 Maio 2026"
    m = re.match(r"(\d{1,2})\s+(\w+)\s+(\d{4})", text)
    if m:
        return _build_date(m.group(1), m.group(2), m.group(3))

    # "11 Abr" (no year)
    m = re.match(r"(\d{1,2})\s+(\w+)$", text)
    if m:
        return _build_date(m.group(1), m.group(2), str(now_year))

    return None


def _build_date(day_s: str, month_s: str, year_s: str) -> datetime | None:
    """Build datetime from day, month name/abbreviation, year strings."""
    month_key = month_s.strip().lower().rstrip(".")
    # Try 3-letter abbreviation first, then full name
    m = _PT_MONTHS.get(month_key[:3])
    if m is None:
        m = _PT_MONTHS.get(month_key)
    if m is None:
        return None
    try:
        return datetime(int(year_s), m, int(day_s))
    except (ValueError, TypeError):
        return None


def _guess_sport_types(text: str) -> list[str]:
    """Derive sport types from event title."""
    types: list[str] = []
    for pattern, sport in _SPORT_KW:
        if pattern.search(text) and sport not in types:
            types.append(sport)
    return types or ["OTHER"]


# ── Scraper class ────────────────────────────────────────────────


class WaitAStartScraper(BaseScraper):
    source_name = "waitastart"
    display_name = "WaitAStart"
    base_url = _BASE
    description = "Timing company — trail, BTT, running & OCR events — waitastart.com"

    async def scrape(self) -> list[ScrapedEventData]:
        cards = await self._fetch_cards()
        logger.info("Found %d events on WaitAStart", len(cards))

        events: list[ScrapedEventData] = []
        for card in cards:
            try:
                ev = await self._build_event(card)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape event: %s", card.get("url"))
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")
        title_el = soup.select_one("h1, h2, .entry-title")
        title = title_el.get_text(strip=True) if title_el else url.rsplit("/", 2)[-2]
        docs = self._extract_documents(soup)
        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=url.rstrip("/").rsplit("/", 1)[-1],
            documents=docs,
        )

    # ── Card fetching ────────────────────────────────────────────

    async def _fetch_cards(self) -> list[dict]:
        """Parse event cards from the homepage."""
        html = await self.fetch_page(_BASE)
        soup = BeautifulSoup(html, "lxml")
        cards: list[dict] = []

        for article in soup.select("article.service-content"):
            h5 = article.select_one("h5.service-title")
            if not h5:
                continue
            link = h5.select_one("a[href]")
            if not link:
                continue

            url = link.get("href", "")
            text = link.get_text(strip=True)
            if not url or not text:
                continue

            # Image
            img = article.select_one("figure img")
            image_url = img.get("src") if img else None

            # Status text
            status_el = article.select_one("p")
            status = status_el.get_text(strip=True) if status_el else None

            title, city, date_str, dt = _parse_card_text(text)

            cards.append({
                "url": url,
                "raw_text": text,
                "title": title,
                "city": city,
                "date_str": date_str,
                "start_date": dt,
                "image_url": image_url,
                "status": status,
            })

        return cards

    async def _build_event(self, card: dict) -> ScrapedEventData | None:
        """Build event from card, fetching detail page for regulamento."""
        title = card.get("title")
        url = card.get("url", "")
        if not title or not url:
            return None

        slug = url.rstrip("/").rsplit("/", 1)[-1]
        sport_types = _guess_sport_types(title)

        # Fetch detail page for regulamento PDF
        docs: list[ScrapedDocumentData] = []
        try:
            detail_html = await self.fetch_page(url)
            detail_soup = BeautifulSoup(detail_html, "lxml")
            docs = self._extract_documents(detail_soup)
        except Exception:
            logger.warning("Could not fetch detail for %s", slug)

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=slug,
            sport_types=sport_types,
            start_date=card.get("start_date"),
            city=card.get("city"),
            image_url=card.get("image_url"),
            documents=docs,
            raw_data=json.dumps(card, ensure_ascii=False, default=str),
        )

    def _extract_documents(self, soup: BeautifulSoup) -> list[ScrapedDocumentData]:
        """Extract regulamento PDF links from a detail page."""
        docs: list[ScrapedDocumentData] = []
        seen: set[str] = set()

        for a in soup.select('a[href$=".pdf"]'):
            href = a.get("href", "")
            text = a.get_text(strip=True).lower()
            if not href:
                continue
            # Only keep regulamento PDFs
            if "regulamento" not in text and "regulamento" not in href.lower():
                continue
            if href in seen:
                continue
            seen.add(href)
            docs.append(
                ScrapedDocumentData(
                    original_url=href,
                    document_type="regulation",
                    file_name=href.rsplit("/", 1)[-1],
                    mime_type="application/pdf",
                )
            )
        return docs
