"""Portimer scraper.

Scrapes events from portimer.pt — a timing platform for trail, running,
BTT and obstacle-course events in Portugal.

The site uses a JSON AJAX endpoint to list upcoming events, and a second
endpoint per event to retrieve the regulamento (embedded as a Google
Drive iframe preview).
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

_BASE = "https://www.portimer.pt"
_AJAX_URL = f"{_BASE}/eventos/getNextEventsAjax"

# ── Helpers ──────────────────────────────────────────────────────

_PT_MONTHS: dict[str, int] = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4,
    "mai": 5, "jun": 6, "jul": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
}

_SPORT_MAP: dict[str, list[str]] = {
    "atletismo / trail": ["RUNNING", "TRAIL"],
    "atletismo": ["RUNNING"],
    "trail": ["TRAIL"],
    "passeio btt": ["BTT"],
    "btt": ["BTT"],
    "simulação hyrox": ["OCR"],
    "prova de obstáculos": ["OCR"],
    "passeio motorizada": ["OTHER"],
    "caminhada": ["WALKING"],
}


def _parse_card_date(day: str | None, month: str | None, year: str | None) -> datetime | None:
    """Parse date from calendar card elements (day, 3-letter month, year)."""
    if not day or not month or not year:
        return None
    try:
        m = _PT_MONTHS.get(month.lower().strip())
        if not m:
            return None
        return datetime(int(year.strip()), m, int(day.strip()))
    except (ValueError, TypeError):
        return None


def _map_sport_types(sport_text: str | None) -> list[str]:
    if not sport_text:
        return ["OTHER"]
    key = sport_text.strip().lower()
    return _SPORT_MAP.get(key, ["OTHER"])


def _extract_gdrive_url(html: str) -> str | None:
    """Extract Google Drive download URL from regulamento iframe HTML.

    The response contains an iframe with ``src`` like:
    ``https://drive.google.com/file/d/{FILE_ID}/preview``

    We convert it to a direct export link.
    """
    m = re.search(r'drive\.google\.com/file/d/([a-zA-Z0-9_-]+)', html)
    if m:
        file_id = m.group(1)
        return f"https://drive.google.com/uc?export=download&id={file_id}"
    return None


def _slug_from_href(href: str) -> str:
    """Extract event slug from href like ``/eventos/trail_trilhos_viso_2025``."""
    return href.rstrip("/").rsplit("/", 1)[-1]


# ── Scraper class ────────────────────────────────────────────────


class PortimerScraper(BaseScraper):
    source_name = "portimer"
    display_name = "Portimer"
    base_url = _BASE
    description = "Timing platform for trail, running & OCR events — portimer.pt"

    async def scrape(self) -> list[ScrapedEventData]:
        cards = await self._fetch_event_cards()
        logger.info("Found %d upcoming events on Portimer", len(cards))

        events: list[ScrapedEventData] = []
        for card in cards:
            try:
                ev = await self._build_event(card)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape portimer event: %s", card.get("slug"))
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        slug = _slug_from_href(url)
        # Fetch detail page for basic metadata
        html = await self.fetch_page(url)
        card = self._parse_detail_page(html, slug)
        if not card:
            return None
        return await self._build_event(card)

    # ── Fetch event cards via AJAX ────────────────────────────────

    async def _fetch_event_cards(self) -> list[dict]:
        """Fetch all upcoming events via the AJAX endpoint."""
        client = await self._get_client()
        today = datetime.now()
        all_cards: list[dict] = []
        page = 0
        rows = 50

        while True:
            data = {
                "startDate": f"{today.year}-{today.month}-{today.day}",
                "rows": str(rows),
                "active": "1",
                "page": str(page * rows),
                "order": "asc",
            }
            resp = await client.post(_AJAX_URL, data=data)
            resp.raise_for_status()
            body = resp.json()
            html = body.get("data", "")
            has_more = body.get("hasMore", False)

            if not html or not html.strip():
                break

            cards = self._parse_card_html(html)
            all_cards.extend(cards)

            if not has_more:
                break
            page += 1
            if page > 10:  # safety limit
                break

        return all_cards

    def _parse_card_html(self, html: str) -> list[dict]:
        """Parse event cards from AJAX HTML response."""
        soup = BeautifulSoup(html, "lxml")
        cards: list[dict] = []

        for a in soup.find_all("a", href=True):
            href = a.get("href", "")
            if "/eventos/" not in href:
                continue
            if "/proximos" in href or "/anteriores" in href:
                continue

            slug = _slug_from_href(href)
            if not slug:
                continue

            title_el = a.find(class_="events-next-grid-event-meta-name")
            title = title_el.get_text(strip=True) if title_el else None

            metas = a.find_all(class_="events-next-grid-event-meta-date")
            sport_text = metas[0].get_text(strip=True) if len(metas) > 0 else None
            location = metas[1].get_text(strip=True) if len(metas) > 1 else None

            day_el = a.find(class_="calendar-day")
            month_el = a.find(class_="calendar-month")
            year_el = a.find(class_="calendar-year")

            img = a.find("img")
            image_url = img.get("src") if img else None

            cards.append({
                "slug": slug,
                "title": title,
                "sport_text": sport_text,
                "location": location,
                "day": day_el.get_text(strip=True) if day_el else None,
                "month": month_el.get_text(strip=True) if month_el else None,
                "year": year_el.get_text(strip=True) if year_el else None,
                "image_url": image_url,
            })

        return cards

    def _parse_detail_page(self, html: str, slug: str) -> dict | None:
        """Parse basic metadata from a detail page."""
        soup = BeautifulSoup(html, "lxml")
        h2 = soup.find("h2")
        title = h2.get_text(strip=True) if h2 else None
        if not title:
            return None

        metas = soup.find_all(class_="events-next-grid-event-meta-date")
        sport_text = metas[0].get_text(strip=True) if len(metas) > 0 else None
        location = metas[1].get_text(strip=True) if len(metas) > 1 else None

        day_el = soup.find(class_="calendar-day")
        month_el = soup.find(class_="calendar-month")
        year_el = soup.find(class_="calendar-year")

        img = soup.find("img", class_="events-next-grid-event-img")
        image_url = img.get("src") if img else None

        return {
            "slug": slug,
            "title": title,
            "sport_text": sport_text,
            "location": location,
            "day": day_el.get_text(strip=True) if day_el else None,
            "month": month_el.get_text(strip=True) if month_el else None,
            "year": year_el.get_text(strip=True) if year_el else None,
            "image_url": image_url,
        }

    # ── Build event from card data ────────────────────────────────

    async def _build_event(self, card: dict) -> ScrapedEventData | None:
        title = card.get("title")
        slug = card.get("slug")
        if not title or not slug:
            return None

        source_url = f"{_BASE}/eventos/{slug}"
        start_date = _parse_card_date(card.get("day"), card.get("month"), card.get("year"))
        sport_types = _map_sport_types(card.get("sport_text"))

        documents = await self._fetch_regulamento(slug)

        raw = {
            "slug": slug,
            "title": title,
            "sport_text": card.get("sport_text"),
            "location": card.get("location"),
            "date": f"{card.get('day')} {card.get('month')} {card.get('year')}",
        }

        return ScrapedEventData(
            title=title,
            source_url=source_url,
            source_event_id=slug,
            sport_types=sport_types,
            start_date=start_date,
            city=card.get("location"),
            country="Portugal",
            image_url=card.get("image_url"),
            documents=documents,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    async def _fetch_regulamento(self, slug: str) -> list[ScrapedDocumentData]:
        """Fetch regulamento via the AJAX endpoint and extract Google Drive link."""
        try:
            client = await self._get_client()
            url = f"{_BASE}/eventos/{slug}/getEventRegulation/"
            resp = await client.post(url)
            if resp.status_code != 200:
                return []
            body = resp.json()
            html = body.get("data", "")
            gdrive_url = _extract_gdrive_url(html)
            if gdrive_url:
                return [
                    ScrapedDocumentData(
                        original_url=gdrive_url,
                        document_type="regulation",
                        file_name=f"{slug}_regulamento.pdf",
                        mime_type="application/pdf",
                    )
                ]
        except Exception:
            logger.debug("No regulamento for %s", slug)
        return []
