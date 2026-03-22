"""TotalCrono scraper — extracts events from totalcrono.pt.

Google Sites-based page. All events are listed on a single page
``/eventos`` with date (DD-MM-YYYY), city, and link to detail page.
Many are past events — we filter to keep only future ones.

Detail pages are simple Google Sites pages with minimal structure.
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
    ScrapedEventData,
)

logger = logging.getLogger(__name__)

_BASE = "https://www.totalcrono.pt"
_LISTING_URL = f"{_BASE}/eventos"

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btrail\b|\btrilho", re.I), "TRAIL"),
    (re.compile(r"\bbtt\b|\bmtb\b|\braid\s*btt", re.I), "BTT"),
    (re.compile(r"\bcicl\w*\b|\bgravel\b", re.I), "CYCLING"),
    (re.compile(r"\btriathlon\b|\btriatlo\b|\bduatlo\b|\bxterra\b", re.I), "TRIATHLON"),
    (re.compile(r"\bcorrida\b|\bmaratona\b|\bmeia[- ]maratona\b|\brun\b|\bsão\s*silvestre", re.I), "RUNNING"),
    (re.compile(r"\bcaminhada\b|\bwalk\b|\bmarcha\b|\bneon\s*run", re.I), "WALKING"),
    (re.compile(r"\bnatação\b|\bswim\b", re.I), "SWIMMING"),
    (re.compile(r"\bobstáculo\b|\bocr\b|\bfireman", re.I), "OCR"),
]


def _parse_date(text: str) -> datetime | None:
    """Parse ``29-09-2024`` or ``01 e 02-07-2023`` (takes first date)."""
    text = text.strip()
    # Simple DD-MM-YYYY
    m = re.match(r"(\d{1,2})-(\d{2})-(\d{4})", text)
    if m:
        try:
            return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        except ValueError:
            pass
    # Range: "08 e 09-10-2022" or "01 e 02-07-2023"
    m = re.match(r"(\d{1,2})\s+e\s+\d{1,2}-(\d{2})-(\d{4})", text)
    if m:
        try:
            return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        except ValueError:
            pass
    # Range with "a": "01-05-2021 a 16-05-2021"
    m = re.match(r"(\d{1,2})-(\d{2})-(\d{4})\s+a\s+", text)
    if m:
        try:
            return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        except ValueError:
            pass
    return None


def _guess_sport_types(title: str) -> list[str]:
    types: list[str] = []
    for pattern, sport in _SPORT_KW:
        if pattern.search(title) and sport not in types:
            types.append(sport)
    return types or ["OTHER"]


class TotalCronoScraper(BaseScraper):
    source_name = "totalcrono"
    display_name = "TotalCrono"
    base_url = _BASE
    description = "Timing platform — totalcrono.pt"

    async def scrape(self) -> list[ScrapedEventData]:
        html = await self.fetch_page(_LISTING_URL)
        soup = BeautifulSoup(html, "lxml")

        events: list[ScrapedEventData] = []
        now = datetime.now()

        cards = self._extract_listing_cards(soup)
        logger.info("Found %d event entries on TotalCrono", len(cards))

        for card in cards:
            dt = card.get("date")
            if not dt or dt < now:
                continue

            title = card.get("title")
            if not title:
                continue

            url = card.get("url", "")
            city = card.get("city")
            sport_types = _guess_sport_types(title)
            slug = url.rstrip("/").rsplit("/", 1)[-1] if url else title.lower().replace(" ", "-")

            raw = {"url": url, "title": title, "city": city}

            events.append(ScrapedEventData(
                title=title,
                source_url=url or _LISTING_URL,
                source_event_id=slug,
                sport_types=sport_types,
                start_date=dt,
                city=city,
                country="Portugal",
                raw_data=json.dumps(raw, ensure_ascii=False, default=str),
            ))

        logger.info("Total future events from TotalCrono: %d", len(events))
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """TotalCrono detail pages are minimal Google Sites pages.
        We extract what we can but most data comes from the listing."""
        # For this source, we primarily scrape from the listing page.
        # If called directly, try to get basic info.
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        title = None
        for tag in ("h1", "h2"):
            el = soup.find(tag)
            if el:
                text = el.get_text(strip=True)
                if text and text.upper() != "EVENTOS":
                    title = text
                    break
        if not title:
            return None

        sport_types = _guess_sport_types(title)
        slug = url.rstrip("/").rsplit("/", 1)[-1]

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=slug,
            sport_types=sport_types,
            country="Portugal",
            raw_data=json.dumps({"url": url}, ensure_ascii=False),
        )

    # ── Helpers ──────────────────────────────────────────────────

    def _extract_listing_cards(self, soup: BeautifulSoup) -> list[dict]:
        """Extract events from the flat listing.

        The page has a repeating pattern:
          Title text
          DD-MM-YYYY
          City
          [Evento](link)
        """
        cards: list[dict] = []

        # Get all links to event detail pages
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            text = a.get_text(strip=True)
            if text != "Evento":
                continue

            full_url = href if href.startswith("http") else urljoin(_BASE, href)
            # Skip external links (some point to google.com, cm-torresnovas etc.)
            if "totalcrono.pt" not in full_url:
                continue

            # Walk back through previous siblings to find title, date, city
            container = a.parent
            if not container:
                continue

            # Get text content before this link
            prev_texts: list[str] = []
            for sibling in container.previous_siblings:
                if hasattr(sibling, "get_text"):
                    t = sibling.get_text(strip=True)
                else:
                    t = str(sibling).strip()
                if t:
                    prev_texts.insert(0, t)
                if len(prev_texts) >= 4:
                    break

            # Also check parent's previous siblings
            if len(prev_texts) < 2 and container.parent:
                for sibling in container.parent.previous_siblings:
                    if hasattr(sibling, "get_text"):
                        t = sibling.get_text(strip=True)
                    else:
                        t = str(sibling).strip()
                    if t:
                        prev_texts.insert(0, t)
                    if len(prev_texts) >= 4:
                        break

            # Parse: we expect title, date, city in reverse order before the link
            title: str | None = None
            date_dt: datetime | None = None
            city: str | None = None

            for t in prev_texts:
                if not t:
                    continue
                dt = _parse_date(t)
                if dt:
                    date_dt = dt
                elif date_dt is None and not re.match(r"^\d", t):
                    # Before date → title candidate
                    title = t
                elif date_dt is not None and city is None:
                    # After date → city
                    city = t

            if not title:
                # Try the text that's a sibling of the link itself
                for t in reversed(prev_texts):
                    if t and not _parse_date(t) and len(t) > 3:
                        title = t
                        break

            cards.append({
                "url": full_url,
                "title": title,
                "date": date_dt,
                "city": city,
            })

        return cards
