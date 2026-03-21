"""Federação de Triatlo de Portugal scraper.

Scrapes events from the EventON calendar on federacao-triatlo.pt.
The calendar page lists all national events with schema.org metadata;
detail pages provide the regulamento PDF link.
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

_BASE = "https://www.federacao-triatlo.pt"
_CALENDAR_TEMPLATE = (
    "{base}/ftp2015/competicoes/calendario/calendario-nacional-{year}/"
)

# ── Helpers ──────────────────────────────────────────────────────

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"triatlo|triathlon", re.I), "TRIATHLON"),
    (re.compile(r"duatlo|duathlon", re.I), "DUATHLON"),
    (re.compile(r"aquatlo|aquathlon", re.I), "AQUATHLON"),
    (re.compile(r"paratriatlo|paratriathlon", re.I), "PARATRIATHLON"),
]


def _parse_schema_date(text: str | None) -> datetime | None:
    """Parse date strings like ``2026-3-15`` from EventON schema meta."""
    if not text:
        return None
    text = text.strip()
    for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S"):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    # EventON sometimes uses single-digit month/day (``2026-1-25``)
    m = re.match(r"(\d{4})-(\d{1,2})-(\d{1,2})", text)
    if m:
        try:
            return datetime(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        except ValueError:
            pass
    return None


def _guess_sport_types(title: str, subtitle: str | None = None) -> list[str]:
    combined = f"{title} {subtitle or ''}"
    types: list[str] = []
    for pat, sport in _SPORT_KW:
        if pat.search(combined) and sport not in types:
            types.append(sport)
    return types or ["TRIATHLON"]


def _event_id_from_div(div: Tag) -> str | None:
    eid = div.get("data-event_id")
    if eid:
        return str(eid)
    tag_id = div.get("id", "")
    if isinstance(tag_id, str):
        m = re.search(r"event_(\d+)", tag_id)
        if m:
            return m.group(1)
    return None


# ── Scraper class ────────────────────────────────────────────────


class TriatloScraper(BaseScraper):
    source_name = "triatlo"
    display_name = "Federação de Triatlo de Portugal"
    base_url = _BASE
    description = (
        "National triathlon federation events — federacao-triatlo.pt"
    )

    async def scrape(self) -> list[ScrapedEventData]:
        year = datetime.now().year
        calendar_url = _CALENDAR_TEMPLATE.format(base=_BASE, year=year)
        html = await self.fetch_page(calendar_url)

        entries = self._parse_calendar(html)
        logger.info("Found %d events on triatlo calendar %d", len(entries), year)

        events: list[ScrapedEventData] = []
        for entry in entries:
            try:
                ev = await self._scrape_detail(entry)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception(
                    "Failed to scrape triatlo event: %s", entry.get("url")
                )
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        entry = {"url": url}
        return await self._scrape_detail(entry)

    # ── Calendar parsing ─────────────────────────────────────────

    def _parse_calendar(self, html: str) -> list[dict]:
        """Extract event entries from the national calendar page.

        Each ``div.eventon_list_event`` has schema.org metadata with
        name, dates, image, and event URL.
        """
        soup = BeautifulSoup(html, "lxml")
        entries: list[dict] = []
        seen_urls: set[str] = set()

        for div in soup.find_all(
            "div", class_=re.compile(r"eventon_list_event")
        ):
            entry = self._parse_event_div(div)
            if not entry or not entry.get("url"):
                continue
            url = entry["url"]
            if url in seen_urls:
                continue
            seen_urls.add(url)
            entries.append(entry)

        return entries

    def _parse_event_div(self, div: Tag) -> dict | None:
        """Extract metadata from a single EventON list item."""
        schema = div.find("div", class_=re.compile(r"evo_event_schema"))
        if not schema:
            return None

        url_tag = schema.find("a", itemprop="url")
        url = url_tag["href"] if url_tag and url_tag.get("href") else None
        if not url:
            return None
        url = url.rstrip("/")

        name_tag = schema.find(True, itemprop="name")
        name = name_tag.get_text(strip=True) if name_tag else None

        image_meta = schema.find("meta", itemprop="image")
        image = (
            image_meta.get("content")
            if image_meta and image_meta.get("content")
            else None
        )

        start_meta = schema.find("meta", itemprop="startDate")
        end_meta = schema.find("meta", itemprop="endDate")
        start = (
            _parse_schema_date(start_meta.get("content"))
            if start_meta
            else None
        )
        end = (
            _parse_schema_date(end_meta.get("content"))
            if end_meta
            else None
        )

        event_id = _event_id_from_div(div)

        return {
            "url": url,
            "name": name,
            "image": image,
            "start": start,
            "end": end,
            "event_id": event_id,
        }

    # ── Detail page scraping ─────────────────────────────────────

    async def _scrape_detail(self, entry: dict) -> ScrapedEventData | None:
        url = entry.get("url", "")
        if not url.startswith("http"):
            url = f"{_BASE}{url}"

        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        # Title: prefer schema name, fallback to detail page
        title = entry.get("name") or self._extract_title(soup)
        if not title:
            logger.warning("No title for %s — skipping", url)
            return None

        subtitle = self._extract_subtitle(soup)
        sport_types = _guess_sport_types(title, subtitle)

        start_date = entry.get("start") or self._extract_date(soup, "startDate")
        end_date = entry.get("end") or self._extract_date(soup, "endDate")

        image_url = entry.get("image") or self._extract_image(soup)
        event_id = entry.get("event_id") or self._extract_event_id(soup)

        documents = self._extract_regulamento(soup)

        description = subtitle

        raw = {"url": url, "title": title, "subtitle": subtitle}

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=event_id,
            description=description,
            sport_types=sport_types,
            start_date=start_date,
            end_date=end_date,
            country="Portugal",
            image_url=image_url,
            documents=documents,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── Detail-page helpers ──────────────────────────────────────

    def _extract_title(self, soup: BeautifulSoup) -> str | None:
        tag = soup.find(True, itemprop="name")
        if tag:
            return tag.get_text(strip=True)
        h1 = soup.find("h1")
        return h1.get_text(strip=True) if h1 else None

    def _extract_subtitle(self, soup: BeautifulSoup) -> str | None:
        el = soup.find(True, class_=re.compile(r"evcal_event_subtitle"))
        return el.get_text(strip=True) if el else None

    def _extract_date(
        self, soup: BeautifulSoup, prop: str
    ) -> datetime | None:
        meta = soup.find("meta", itemprop=prop)
        if meta and meta.get("content"):
            return _parse_schema_date(meta["content"])
        return None

    def _extract_image(self, soup: BeautifulSoup) -> str | None:
        meta = soup.find("meta", itemprop="image")
        if meta and meta.get("content"):
            return meta["content"]
        return None

    def _extract_event_id(self, soup: BeautifulSoup) -> str | None:
        div = soup.find(True, attrs={"data-event_id": True})
        if div:
            return str(div["data-event_id"])
        return None

    def _extract_regulamento(self, soup: BeautifulSoup) -> list[ScrapedDocumentData]:
        """Extract only regulamento PDF links from the description."""
        docs: list[ScrapedDocumentData] = []
        desc = soup.find("div", class_=re.compile(r"eventon_desc_in"))
        if not desc:
            return docs

        for a in desc.find_all("a", href=re.compile(r"\.pdf", re.I)):
            label = a.get_text(strip=True).lower()
            if "regulamento" not in label:
                continue
            href = a.get("href", "")
            if not href:
                continue
            # file name from URL
            fname = href.rsplit("/", 1)[-1] if "/" in href else None
            docs.append(
                ScrapedDocumentData(
                    original_url=href,
                    document_type="regulation",
                    file_name=fname,
                    mime_type="application/pdf",
                )
            )
        return docs
