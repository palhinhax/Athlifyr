"""TurresEvents scraper.

Scrapes events from turresevents.com — Turres Trail Clube, organising
sky-race, trail, enduro MTB and gravel running events around the Torres
Vedras / Cadaval region.

The events page lists cards inside ``#EventosContainer`` with date, title
and location.  Detail pages expose info, percurso and regulamento tabs
(regulamento is inline text, no PDF download).
"""

from __future__ import annotations

import json
import logging
import re
from datetime import datetime

from bs4 import BeautifulSoup, Tag

from app.sources.base.scraper import (
    BaseScraper,
    ScrapedEventData,
)

logger = logging.getLogger(__name__)

_BASE = "https://www.turresevents.com"
_EVENTS_URL = f"{_BASE}/eventos"

# ── Helpers ──────────────────────────────────────────────────────

_PT_MONTHS: dict[str, int] = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4,
    "mai": 5, "jun": 6, "jul": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
}

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\bsky\s*race\b|\btrail\b", re.I), "TRAIL"),
    (re.compile(r"\benduro\b|\bmtb\b|\bbtt\b|\bbike\b", re.I), "BTT"),
    (re.compile(r"\bgravel\b|\brunning\b|\bcorrida\b", re.I), "RUNNING"),
    (re.compile(r"\bcaminhada\b", re.I), "WALKING"),
]


def _parse_card_date(day: str | None, month: str | None, year: str | None) -> datetime | None:
    """Parse date from .dia / .mesano elements."""
    if not day or not month or not year:
        return None
    try:
        m = _PT_MONTHS.get(month.lower().strip()[:3])
        if not m:
            return None
        return datetime(int(year.strip()), m, int(day.strip()))
    except (ValueError, TypeError):
        return None


def _guess_sport_types(title: str) -> list[str]:
    """Derive sport types from event title."""
    types: list[str] = []
    for pattern, sport in _SPORT_KW:
        if pattern.search(title) and sport not in types:
            types.append(sport)
    return types or ["OTHER"]


def _extract_bg_image(style: str) -> str | None:
    """Extract URL from CSS background-image style."""
    m = re.search(r"url\(['\"]?([^)]+?)['\"]?\)", style)
    return m.group(1) if m else None


# ── Scraper class ────────────────────────────────────────────────


class TurresEventsScraper(BaseScraper):
    source_name = "turresevents"
    display_name = "TurresEvents"
    base_url = _BASE
    description = "Turres Trail Clube — sky-race, trail & enduro events — turresevents.com"

    async def scrape(self) -> list[ScrapedEventData]:
        cards = await self._fetch_cards()
        logger.info("Found %d upcoming events on TurresEvents", len(cards))

        events: list[ScrapedEventData] = []
        for card in cards:
            try:
                ev = self._build_event(card)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to build event: %s", card.get("slug"))
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        slug = url.rstrip("/").rsplit("/", 1)[-1]
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")
        title_el = soup.select_one("h1, .titulo")
        return ScrapedEventData(
            title=title_el.get_text(strip=True) if title_el else slug.replace("-", " ").title(),
            source_url=url,
            source_event_id=slug,
        )

    # ── Card fetching ────────────────────────────────────────────

    async def _fetch_cards(self) -> list[dict]:
        """Parse event cards from the events listing page."""
        html = await self.fetch_page(_EVENTS_URL)
        soup = BeautifulSoup(html, "lxml")
        cards: list[dict] = []

        container = soup.select_one("#EventosContainer")
        if not container:
            return cards

        for div in container.select("div[onclick]"):
            onclick = div.get("onclick", "")
            m = re.search(r"location\.href='(/eventos/[^']+)'", onclick)
            if not m:
                continue
            path = m.group(1)
            slug = path.rstrip("/").rsplit("/", 1)[-1]

            title_el = div.select_one(".titulo")
            title = title_el.get_text(strip=True) if title_el else None

            local_el = div.select_one(".local")
            city = local_el.get_text(strip=True) if local_el else None

            data_el = div.select_one(".data")
            day = month = year = None
            if data_el:
                dia = data_el.select_one(".dia")
                mesanos = data_el.select(".mesano")
                day = dia.get_text(strip=True) if dia else None
                month = mesanos[0].get_text(strip=True) if len(mesanos) > 0 else None
                year = mesanos[1].get_text(strip=True) if len(mesanos) > 1 else None

            # Background image
            img_div = div.select_one(".imagem")
            image_url = None
            if img_div:
                style = img_div.get("style", "")
                bg = _extract_bg_image(style)
                if bg:
                    image_url = f"{_BASE}{bg}" if not bg.startswith("http") else bg

            cards.append({
                "slug": slug,
                "path": path,
                "title": title,
                "city": city,
                "day": day,
                "month": month,
                "year": year,
                "image_url": image_url,
            })

        return cards

    def _build_event(self, card: dict) -> ScrapedEventData | None:
        """Build ScrapedEventData from a card dict."""
        title = card.get("title")
        slug = card.get("slug", "")
        if not title:
            return None

        path = card.get("path", f"/eventos/{slug}")
        source_url = f"{_BASE}{path}"
        start_date = _parse_card_date(card.get("day"), card.get("month"), card.get("year"))
        sport_types = _guess_sport_types(title)

        return ScrapedEventData(
            title=title,
            source_url=source_url,
            source_event_id=slug,
            sport_types=sport_types,
            start_date=start_date,
            city=card.get("city"),
            image_url=card.get("image_url"),
            raw_data=json.dumps(card, ensure_ascii=False, default=str),
        )
