"""Cyclones Sports scraper.

Scrapes events from cyclonessports.com — a Joomla site listing trail,
BTT, and running events in northern Portugal.  The homepage lists
upcoming events as ``<article>`` blocks with ``div.cyc-event``.
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

_BASE = "https://cyclonessports.com"

# ── Helpers ──────────────────────────────────────────────────────

_PT_MONTHS: dict[str, int] = {
    "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4,
    "maio": 5, "junho": 6, "julho": 7, "agosto": 8,
    "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12,
}

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btrail\b", re.I), "TRAIL"),
    (re.compile(r"\bbtt\b", re.I), "BTT"),
    (re.compile(r"\bmaratona\b|\bmeia[- ]maratona\b|\bcorrida\b", re.I), "RUNNING"),
    (re.compile(r"\bcaminhada\b|\bwalk\b", re.I), "WALKING"),
    (re.compile(r"\badventure\b|\baventura\b", re.I), "TRAIL"),
    (re.compile(r"\btrilhos?\b", re.I), "TRAIL"),
    (re.compile(r"\bduatlo\b", re.I), "DUATHLON"),
    (re.compile(r"\btriatlo\b", re.I), "TRIATHLON"),
]


def _parse_pt_date(text: str | None) -> datetime | None:
    """Parse Portuguese date text like ``22 de março de 2026``.

    Also handles ranges like ``18 e 19 de abril de 2026`` — returns
    the **first** date.
    """
    if not text:
        return None
    text = text.strip().lower()

    # "18 e 19 de abril de 2026" → take first day
    m = re.match(
        r"(\d{1,2})\s*(?:e\s+\d{1,2}\s+)?de\s+(\w+)\s+de\s+(\d{4})", text
    )
    if m:
        day, month_name, year = int(m.group(1)), m.group(2), int(m.group(3))
        month = _PT_MONTHS.get(month_name)
        if month:
            try:
                return datetime(year, month, day)
            except ValueError:
                pass

    # Fallback: single date "22 de março de 2026"
    m2 = re.match(r"(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})", text)
    if m2:
        day, month_name, year = int(m2.group(1)), m2.group(2), int(m2.group(3))
        month = _PT_MONTHS.get(month_name)
        if month:
            try:
                return datetime(year, month, day)
            except ValueError:
                pass
    return None


def _parse_pt_date_end(text: str | None) -> datetime | None:
    """For date ranges like ``18 e 19 de abril de 2026``, return the **last** date."""
    if not text:
        return None
    text = text.strip().lower()
    m = re.match(
        r"\d{1,2}\s+e\s+(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})", text
    )
    if m:
        day, month_name, year = int(m.group(1)), m.group(2), int(m.group(3))
        month = _PT_MONTHS.get(month_name)
        if month:
            try:
                return datetime(year, month, day)
            except ValueError:
                pass
    return None


def _guess_sport_types(title: str, activities: list[str] | None = None) -> list[str]:
    combined = f"{title} {' '.join(activities or [])}"
    types: list[str] = []
    for pat, sport in _SPORT_KW:
        if pat.search(combined) and sport not in types:
            types.append(sport)
    return types or ["TRAIL"]


def _slug_from_url(url: str) -> str | None:
    """Extract a stable slug from the event URL for use as source_event_id."""
    m = re.search(r"/(\d+-[^/?#]+)/?$", url)
    return m.group(1) if m else None


# ── Scraper class ────────────────────────────────────────────────


class CyclonesScraper(BaseScraper):
    source_name = "cyclones"
    display_name = "Cyclones Sports"
    base_url = _BASE
    description = "Trail, BTT & running events in northern Portugal — cyclonessports.com"

    async def scrape(self) -> list[ScrapedEventData]:
        html = await self.fetch_page(f"{_BASE}/")
        entries = self._parse_homepage(html)
        logger.info("Found %d upcoming events on Cyclones Sports", len(entries))

        events: list[ScrapedEventData] = []
        for entry in entries:
            try:
                detail_url = entry.get("detail_url")
                if detail_url:
                    ev = await self._scrape_detail(detail_url, entry)
                else:
                    ev = self._build_event_from_card(entry)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape cyclones event: %s", entry.get("detail_url"))
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        return await self._scrape_detail(url, {})

    # ── Homepage parsing ─────────────────────────────────────────

    def _parse_homepage(self, html: str) -> list[dict]:
        soup = BeautifulSoup(html, "lxml")
        entries: list[dict] = []
        for art in soup.find_all("article"):
            entry = self._parse_article(art)
            if entry:
                entries.append(entry)
        return entries

    def _parse_article(self, art: Tag) -> dict | None:
        """Parse an ``<article>`` block from the homepage."""
        title_tag = art.find(re.compile(r"h[1-6]"))
        title = title_tag.get_text(strip=True) if title_tag else None
        if not title:
            return None

        ev_div = art.find("div", class_="cyc-event")
        date_text = None
        location = None
        image_url = None
        regulamento_url = None

        if ev_div:
            date_el = ev_div.find("span", class_="cyc-data")
            date_text = date_el.get_text(strip=True) if date_el else None

            loc_el = ev_div.find("span", class_="cyc-local")
            location = loc_el.get_text(strip=True) if loc_el else None

            img = ev_div.find("img")
            if img and img.get("src"):
                src = img["src"]
                image_url = src if src.startswith("http") else f"{_BASE}{src}"

            # Find regulamento link
            for a in ev_div.find_all("a", class_="btn"):
                txt = a.get_text(strip=True).lower()
                if "regulamento" in txt:
                    href = a.get("href", "")
                    if href:
                        regulamento_url = href
                    break

        # "Ler mais" detail link
        readmore = art.find("section", class_="readmore")
        detail_url = None
        if readmore:
            a = readmore.find("a")
            if a and a.get("href"):
                href = a["href"]
                detail_url = href if href.startswith("http") else f"{_BASE}{href}"

        return {
            "title": title,
            "date_text": date_text,
            "location": location,
            "image_url": image_url,
            "regulamento_url": regulamento_url,
            "detail_url": detail_url,
        }

    # ── Detail page ──────────────────────────────────────────────

    async def _scrape_detail(self, url: str, entry: dict) -> ScrapedEventData | None:
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")
        art = soup.find("article")
        if not art:
            return self._build_event_from_card(entry, url)

        detail = self._parse_article(art)
        if not detail:
            return self._build_event_from_card(entry, url)

        # Merge: detail page data takes precedence, card data fills gaps
        title = detail.get("title") or entry.get("title")
        if not title:
            return None

        date_text = detail.get("date_text") or entry.get("date_text")
        location = detail.get("location") or entry.get("location")
        image_url = detail.get("image_url") or entry.get("image_url")
        regulamento_url = detail.get("regulamento_url") or entry.get("regulamento_url")

        # Activities (variants) from detail page
        activities = self._extract_activities(art)
        organizer = self._extract_organizer(art)
        sport_types = _guess_sport_types(title, activities)

        start_date = _parse_pt_date(date_text)
        end_date = _parse_pt_date_end(date_text)

        documents: list[ScrapedDocumentData] = []
        if regulamento_url:
            fname = regulamento_url.rsplit("/", 1)[-1] if "/" in regulamento_url else None
            documents.append(
                ScrapedDocumentData(
                    original_url=regulamento_url,
                    document_type="regulation",
                    file_name=fname,
                    mime_type="application/pdf",
                )
            )

        city = self._parse_city(location)

        raw = {
            "url": url,
            "title": title,
            "date_text": date_text,
            "location": location,
            "activities": activities,
            "organizer": organizer,
        }

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=_slug_from_url(url),
            sport_types=sport_types,
            start_date=start_date,
            end_date=end_date,
            city=city,
            country="Portugal",
            organizer_name=organizer,
            image_url=image_url,
            documents=documents,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    def _build_event_from_card(self, entry: dict, url: str | None = None) -> ScrapedEventData | None:
        """Build event from homepage card data when no detail page exists."""
        title = entry.get("title")
        if not title:
            return None

        date_text = entry.get("date_text")
        location = entry.get("location")
        source_url = url or entry.get("detail_url") or _BASE

        documents: list[ScrapedDocumentData] = []
        reg_url = entry.get("regulamento_url")
        if reg_url:
            fname = reg_url.rsplit("/", 1)[-1] if "/" in reg_url else None
            documents.append(
                ScrapedDocumentData(
                    original_url=reg_url,
                    document_type="regulation",
                    file_name=fname,
                    mime_type="application/pdf",
                )
            )

        raw = {"url": source_url, "title": title, "date_text": date_text, "location": location}

        return ScrapedEventData(
            title=title,
            source_url=source_url,
            source_event_id=_slug_from_url(source_url),
            sport_types=_guess_sport_types(title),
            start_date=_parse_pt_date(date_text),
            end_date=_parse_pt_date_end(date_text),
            city=self._parse_city(location),
            country="Portugal",
            image_url=entry.get("image_url"),
            documents=documents,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── Detail-page helpers ──────────────────────────────────────

    @staticmethod
    def _extract_activities(art: Tag) -> list[str]:
        ul = art.find("ul", class_="cyc-ativ")
        if not ul:
            return []
        return [li.get_text(strip=True) for li in ul.find_all("li") if li.get_text(strip=True)]

    @staticmethod
    def _extract_organizer(art: Tag) -> str | None:
        ul = art.find("ul", class_="cyc-organ")
        if not ul:
            return None
        orgs = [li.get_text(strip=True) for li in ul.find_all("li") if li.get_text(strip=True)]
        return ", ".join(orgs) if orgs else None

    @staticmethod
    def _parse_city(location: str | None) -> str | None:
        """Extract city from location text like ``Gondar - Caminha``."""
        if not location:
            return None
        # Take the last part after " - " which is typically the municipality
        parts = [p.strip() for p in location.split("-")]
        return parts[-1] if parts else location
