"""Trilho Perdido scraper.

Scrapes events from trilhoperdido.com — a timing/event-management
platform focused on trail running, BTT, athletics, and hiking events
in central Portugal.

The events listing is at /eventos with GET pagination (?pag=N, 16 per
page).  Detail pages contain regulamento PDF links.
"""

from __future__ import annotations

import json
import logging
import re
from asyncio import sleep
from datetime import datetime

from bs4 import BeautifulSoup, Tag

from app.sources.base.scraper import (
    BaseScraper,
    ScrapedDocumentData,
    ScrapedEventData,
)

logger = logging.getLogger(__name__)

_BASE = "https://www.trilhoperdido.com"
_EVENTS_URL = f"{_BASE}/eventos"
_PER_PAGE = 16
_MAX_PAGES = 10

# ── Helpers ──────────────────────────────────────────────────────

_PT_MONTHS: dict[str, int] = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4,
    "mai": 5, "jun": 6, "jul": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
}

_SPORT_MAP: dict[str, list[str]] = {
    "trail running": ["TRAIL"],
    "btt": ["BTT"],
    "atletismo": ["RUNNING"],
    "ciclismo de estrada": ["CYCLING"],
    "tt - todo terreno": ["BTT"],
    "caminhadas": ["WALKING"],
    "outras": ["OTHER"],
}


def _parse_card_date(day: str | None, month: str | None, year: str | None) -> datetime | None:
    """Parse date from the 3-div date block (day, 3-letter month, year)."""
    if not day or not month or not year:
        return None
    try:
        m = _PT_MONTHS.get(month.lower().strip())
        if not m:
            return None
        return datetime(int(year.strip()), m, int(day.strip()))
    except (ValueError, TypeError):
        return None


def _map_sport_types(category: str | None) -> list[str]:
    """Map category text to normalised sport types."""
    if not category:
        return ["OTHER"]
    key = category.strip().lower()
    return _SPORT_MAP.get(key, ["OTHER"])


def _slug_from_href(href: str) -> str:
    """Extract slug from /evento/{slug}."""
    return href.rstrip("/").rsplit("/", 1)[-1]


# ── Scraper class ────────────────────────────────────────────────


class TrilhoPerdidoScraper(BaseScraper):
    source_name = "trilhoperdido"
    display_name = "Trilho Perdido"
    base_url = _BASE
    description = "Timing & event platform — trail, BTT, athletics in central Portugal"

    _MAX_RETRIES = 3
    _RETRY_DELAY = 5  # seconds

    async def _fetch_with_retry(self, url: str) -> str:
        """Fetch a URL with retry on transient failures."""
        last_exc: Exception | None = None
        for attempt in range(1, self._MAX_RETRIES + 1):
            try:
                return await self.fetch_page(url)
            except Exception as exc:
                last_exc = exc
                logger.warning(
                    "Attempt %d/%d failed for %s: %s",
                    attempt, self._MAX_RETRIES, url, repr(exc),
                )
                if attempt < self._MAX_RETRIES:
                    await sleep(self._RETRY_DELAY * attempt)
        raise last_exc  # type: ignore[misc]

    async def scrape(self) -> list[ScrapedEventData]:
        cards = await self._fetch_all_cards()
        logger.info("Found %d upcoming events on Trilho Perdido", len(cards))

        events: list[ScrapedEventData] = []
        for card in cards:
            try:
                ev = await self._build_event(card)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape event: %s", card.get("slug"))
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        slug = _slug_from_href(url)
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")
        # Get PDF links from detail
        docs = self._extract_documents(soup, slug)
        # Try to find card-like data (not available on detail page alone)
        return ScrapedEventData(
            title=slug.replace("-", " ").title(),
            source_url=url,
            source_event_id=slug,
            documents=docs,
        )

    # ── Fetch all pages ──────────────────────────────────────────

    async def _fetch_all_cards(self) -> list[dict]:
        """Fetch all event cards across paginated pages."""
        all_cards: list[dict] = []
        for page in range(1, _MAX_PAGES + 1):
            url = f"{_EVENTS_URL}?pag={page}"
            html = await self._fetch_with_retry(url)
            cards = self._parse_listing(html)
            if not cards:
                break
            all_cards.extend(cards)
            if len(cards) < _PER_PAGE:
                break
        return all_cards

    def _parse_listing(self, html: str) -> list[dict]:
        """Parse event cards from a listing page."""
        soup = BeautifulSoup(html, "lxml")
        cards: list[dict] = []

        for a in soup.select("a[href*='/evento/']"):
            href = a.get("href", "")
            slug = _slug_from_href(href)
            if not slug:
                continue

            title_el = a.select_one(".titulo")
            title = title_el.get_text(strip=True) if title_el else None

            cat_el = a.select_one(".categoria")
            loc_el = a.select_one(".localidade")
            category = None
            city = None
            if cat_el:
                # Category text is before the <span class="localidade">
                if loc_el:
                    city = loc_el.get_text(strip=True).title()
                    loc_el.extract()
                category = cat_el.get_text(strip=True)

            # Date: 3 div children of .data
            data_el = a.select_one(".data")
            day = month = year = None
            if data_el:
                divs = data_el.find_all("div")
                if len(divs) >= 3:
                    day = divs[0].get_text(strip=True)
                    month = divs[1].get_text(strip=True)
                    year = divs[2].get_text(strip=True)

            img = a.find("img")
            image_url = None
            if img and img.get("src"):
                src = img["src"]
                if not src.startswith("http"):
                    src = f"{_BASE}{src}"
                # Skip non-event images
                if "inscrever" not in src:
                    image_url = src

            cards.append({
                "slug": slug,
                "href": href,
                "title": title,
                "category": category,
                "city": city,
                "day": day,
                "month": month,
                "year": year,
                "image_url": image_url,
            })

        return cards

    async def _build_event(self, card: dict) -> ScrapedEventData | None:
        """Build ScrapedEventData from a card dict, fetching detail for regulamento."""
        title = card.get("title")
        slug = card.get("slug", "")
        if not title:
            return None

        href = card.get("href", f"/evento/{slug}")
        source_url = f"{_BASE}{href}" if not href.startswith("http") else href

        start_date = _parse_card_date(card.get("day"), card.get("month"), card.get("year"))
        sport_types = _map_sport_types(card.get("category"))
        image_url = card.get("image_url")

        # Fetch detail page for regulamento PDF
        docs: list[ScrapedDocumentData] = []
        try:
            detail_html = await self._fetch_with_retry(source_url)
            detail_soup = BeautifulSoup(detail_html, "lxml")
            docs = self._extract_documents(detail_soup, slug)
        except Exception:
            logger.warning("Could not fetch detail for %s", slug)

        return ScrapedEventData(
            title=title,
            source_url=source_url,
            source_event_id=slug,
            sport_types=sport_types,
            start_date=start_date,
            city=card.get("city"),
            image_url=image_url,
            documents=docs,
            raw_data=json.dumps(card, ensure_ascii=False, default=str),
        )

    def _extract_documents(self, soup: BeautifulSoup, slug: str) -> list[ScrapedDocumentData]:
        """Extract regulamento PDF links from a detail page."""
        docs: list[ScrapedDocumentData] = []
        seen: set[str] = set()

        for a in soup.select('a[href$=".pdf"]'):
            href = a.get("href", "")
            if not href:
                continue
            if not href.startswith("http"):
                href = f"{_BASE}{href}"
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
