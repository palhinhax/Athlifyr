"""TicTacTiming scraper — extracts events from tictactiming.pt.

Joomla-based site. Events page is a calendar view at
``/eventos1/eventos``. Events are linked from calendar cells.

Detail pages have event info at ``/eventos1/eventos/{id}-{slug}``.

Specialises in orientation events but also has BTT and other sports.
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

_BASE = "https://tictactiming.pt"
_EVENTS_URL = f"{_BASE}/eventos1/eventos"

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btrail\b|\btrilho", re.I), "TRAIL"),
    (re.compile(r"\bbtt\b|\bmtb\b|\bmountain\s*bike", re.I), "BTT"),
    (re.compile(r"\borientação\b|\borientação\b|\borientation\b", re.I), "ORIENTEERING"),
    (re.compile(r"\bcicl\w*\b|\bgravel\b", re.I), "CYCLING"),
    (re.compile(r"\btriathlon\b|\btriatlo\b|\bduatlo\b", re.I), "TRIATHLON"),
    (re.compile(r"\bcorrida\b|\bmaratona\b|\brun\b|\bcorta[- ]mato\b", re.I), "RUNNING"),
    (re.compile(r"\bcaminhada\b|\bwalk\b", re.I), "WALKING"),
    (re.compile(r"\bmilitar\b", re.I), "ORIENTEERING"),
]


def _guess_sport_types(title: str) -> list[str]:
    types: list[str] = []
    for pattern, sport in _SPORT_KW:
        if pattern.search(title) and sport not in types:
            types.append(sport)
    return types or ["OTHER"]


class TicTacTimingScraper(BaseScraper):
    source_name = "tictactiming"
    display_name = "TicTacTiming"
    base_url = _BASE
    description = "Timing for orientation & sport events — tictactiming.pt"

    async def scrape(self) -> list[ScrapedEventData]:
        events: list[ScrapedEventData] = []
        seen: set[str] = set()
        now = datetime.now()

        # May need to check multiple months
        # Start with current month, then next months
        # Joomla calendar uses ?month=N&year=YYYY (not ?month=YYYY-MM)
        for month_offset in range(6):
            year = now.year + (now.month + month_offset - 1) // 12
            month = (now.month + month_offset - 1) % 12 + 1
            url = f"{_EVENTS_URL}?month={month}&year={year}"
            try:
                html = await self.fetch_page(url)
            except Exception:
                logger.warning("Failed to fetch TicTacTiming month %d/%d", month, year)
                continue

            soup = BeautifulSoup(html, "lxml")
            links = self._extract_event_links(soup)

            for event_url in links:
                if event_url in seen:
                    continue
                seen.add(event_url)
                try:
                    ev = await self.scrape_event(event_url)
                    if ev:
                        if ev.start_date and ev.start_date < now:
                            continue
                        events.append(ev)
                except Exception:
                    logger.exception("Failed to scrape TicTacTiming event: %s", event_url)

        logger.info("Total events scraped from TicTacTiming: %d", len(events))
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        title = self._extract_title(soup)
        if not title:
            logger.warning("No title for %s — skipping", url)
            return None

        description = self._extract_description(soup)
        start_date = self._extract_date(soup)
        city = self._extract_location(soup)
        image_url = self._extract_image(soup)

        sport_types = _guess_sport_types(title)
        event_id = re.search(r"/(\d+)-", url)
        eid = event_id.group(1) if event_id else url.rstrip("/").rsplit("/", 1)[-1]

        raw = {"url": url, "title": title}

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
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── Helpers ──────────────────────────────────────────────────

    def _extract_event_links(self, soup: BeautifulSoup) -> list[str]:
        links: list[str] = []
        seen: set[str] = set()
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href:
                continue
            # Match event detail URLs like /eventos1/eventos/125-campeonato-militar
            if re.search(r"/eventos1/eventos/\d+-", href):
                full = href if href.startswith("http") else urljoin(_BASE, href)
                if full not in seen:
                    seen.add(full)
                    links.append(full)
        return links

    def _extract_title(self, soup: BeautifulSoup) -> str | None:
        h1 = soup.find("h1")
        if h1:
            text = h1.get_text(strip=True)
            if text:
                return text
        h2 = soup.find("h2")
        if h2:
            text = h2.get_text(strip=True)
            if text and text.lower() != "próximos":
                return text
        return None

    def _extract_description(self, soup: BeautifulSoup) -> str | None:
        article = soup.select_one("article, div.item-page, div.com-content-article")
        if article:
            text = article.get_text(strip=True)
            if text and len(text) > 20:
                return text[:2000]
        return None

    def _extract_date(self, soup: BeautifulSoup) -> datetime | None:
        # Look for date patterns in the page
        text = soup.get_text(" ")
        # DD/MM/YYYY or DD-MM-YYYY
        m = re.search(r"(\d{1,2})[/-](\d{1,2})[/-](\d{4})", text)
        if m:
            try:
                return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
            except ValueError:
                pass
        # "DD de Month de YYYY"
        m = re.search(r"(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})", text, re.I)
        if m:
            from app.sources.sinctime.scraper import _PT_MONTHS
            day, month_s, year = int(m.group(1)), m.group(2).lower(), int(m.group(3))
            month = _PT_MONTHS.get(month_s)
            if month:
                try:
                    return datetime(year, month, day)
                except ValueError:
                    pass
        return None

    def _extract_location(self, soup: BeautifulSoup) -> str | None:
        # Look for location info in metadata or content
        for dt in soup.select("dt"):
            if "local" in dt.get_text(strip=True).lower():
                dd = dt.find_next("dd")
                if dd:
                    return dd.get_text(strip=True)
        return None

    def _extract_image(self, soup: BeautifulSoup) -> str | None:
        og = soup.find("meta", property="og:image")
        if og:
            content = og.get("content", "")
            if content:
                return content.strip()
        return None
