"""Xistarca scraper — Portuguese running-event organiser.

Xistarca is one of the largest running-event organisers in Portugal,
based in Lisbon.  They organise road running races, trail events,
kids races and walks across the Lisbon metropolitan area.

Data extracted per event:
  • Title, description, date, location (city)
  • Hero image, Google Maps link
  • Race variants with name, distance, start time
  • Regulation documents (PDF links)
"""

from __future__ import annotations

import logging
import re
from datetime import datetime
from urllib.parse import urljoin

from bs4 import BeautifulSoup, Tag

from app.sources.base.scraper import (
    BaseScraper,
    ScrapedDocumentData,
    ScrapedEventData,
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)

_BASE = "https://xistarca.pt"
_EVENTS_URL = f"{_BASE}/eventos"

# Portuguese month names → numbers
_PT_MONTHS: dict[str, int] = {
    "janeiro": 1, "fevereiro": 2, "março": 3, "marco": 3,
    "abril": 4, "maio": 5, "junho": 6,
    "julho": 7, "agosto": 8, "setembro": 9,
    "outubro": 10, "novembro": 11, "dezembro": 12,
}


# ── Helpers ───────────────────────────────────────────────────────


def _parse_listing_date(text: str) -> tuple[int | None, int | None, str | None]:
    """Parse listing date like '11 de Abril -  / 09:30'.

    Returns (day, month, time_str_or_None).
    """
    text = text.strip()

    # Time at end: "/ HH:MM"
    time_str: str | None = None
    tm = re.search(r"/\s*(\d{1,2}:\d{2})\s*$", text)
    if tm:
        time_str = tm.group(1)

    # Day and month: "11 de Abril"
    dm = re.search(r"(\d{1,2})\s+de\s+(\w+)", text, re.IGNORECASE)
    if dm:
        day = int(dm.group(1))
        month = _PT_MONTHS.get(dm.group(2).strip().lower())
        return day, month, time_str

    return None, None, time_str


def _parse_detail_date(text: str) -> datetime | None:
    """Parse a date like '11 ABRIL 2026' from the detail page."""
    text = text.strip()
    m = re.search(r"(\d{1,2})\s+(\w+)\s+(\d{4})", text, re.IGNORECASE)
    if m:
        day = int(m.group(1))
        month = _PT_MONTHS.get(m.group(2).strip().lower())
        year = int(m.group(3))
        if month:
            try:
                return datetime(year, month, day)
            except ValueError:
                pass
    return None


def _parse_variant_line(text: str) -> tuple[str, float | None, str | None] | None:
    """Parse a variant line like '» Corrida 10km | 10h00'.

    Returns (name, distance_km, start_time) or None.
    """
    text = text.strip()
    if not text.startswith("»"):
        return None

    text = text.lstrip("»").strip()

    # Split on | to get name/distance part and time part
    parts = text.split("|")
    name_part = parts[0].strip()
    time_part = parts[1].strip() if len(parts) > 1 else ""

    # Extract start time: "10h00" or "10:00" or "09h30"
    start_time: str | None = None
    tm = re.search(r"(\d{1,2})[hH:](\d{2})", time_part)
    if tm:
        start_time = f"{tm.group(1)}:{tm.group(2)}"

    # Extract distance from name: "Corrida 10km" or "Trail Longo 17km"
    distance_km: float | None = None
    dm = re.search(r"([\d.,]+)\s*(?:km|k)\b", name_part, re.IGNORECASE)
    if dm:
        raw = dm.group(1).replace(",", ".")
        try:
            distance_km = float(raw)
        except ValueError:
            pass

    # Metres: "500m"
    if distance_km is None:
        mm = re.search(r"([\d.,]+)\s*m\b", name_part, re.IGNORECASE)
        if mm:
            raw = mm.group(1).replace(",", ".")
            try:
                distance_km = float(raw) / 1000
            except ValueError:
                pass

    return name_part, distance_km, start_time


def _guess_sport_types(title: str) -> list[str]:
    """Guess sport types from event title."""
    lower = title.lower()
    types: list[str] = []

    if "trail" in lower or "trilho" in lower:
        types.append("TRAIL")
    if any(k in lower for k in ["corrida", "run", "maratona", "meia-maratona",
                                  "milha", "mile"]):
        types.append("RUNNING")
    if "caminhada" in lower or "walk" in lower:
        types.append("WALKING")
    if "kids" in lower or "criança" in lower or "infantil" in lower:
        if "RUNNING" not in types:
            types.append("RUNNING")

    return types or ["RUNNING"]


def _extract_maps_url(soup: BeautifulSoup) -> str | None:
    """Extract first Google Maps-like URL from the page."""
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if "maps.app.goo.gl" in href or "google.com/maps" in href or "goo.gl/maps" in href:
            return href
    return None


# ── Scraper ───────────────────────────────────────────────────────


class XistarcaScraper(BaseScraper):
    source_name = "xistarca"
    display_name = "Xistarca"
    base_url = _BASE
    description = (
        "Xistarca — major Portuguese running-event organiser "
        "based in Lisbon — xistarca.pt"
    )

    # ── Main scrape ──────────────────────────────────────────────

    async def scrape(self) -> list[ScrapedEventData]:
        """Scrape all upcoming events from Xistarca."""

        listing_html = await self.fetch_page(_EVENTS_URL)
        event_infos = self._parse_listing(listing_html)
        logger.info("Xistarca listing found %d events", len(event_infos))

        results: list[ScrapedEventData] = []
        for info in event_infos:
            try:
                event = await self.scrape_event(info["url"])
                if event:
                    results.append(event)
            except Exception:
                logger.exception(
                    "Failed to scrape Xistarca event: %s", info.get("title")
                )

        return results

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Scrape a single Xistarca event detail page."""
        if not url.startswith("http"):
            url = urljoin(_BASE, url)

        html = await self.fetch_page(url)
        return self._parse_event_detail(html, url)

    # ── Listing parsing ──────────────────────────────────────────

    def _parse_listing(self, html: str) -> list[dict]:
        """Parse the events listing page.

        Each event card is an ``<li class="event-feature">`` with an
        ``onclick`` attribute containing the URL.

        Returns list of dicts: {url, title, location, date_text}.
        """
        soup = BeautifulSoup(html, "lxml")
        events: list[dict] = []

        for li in soup.select("li.event-feature"):
            # URL from onclick attribute
            onclick = li.get("onclick", "")
            url_m = re.search(r"window\.location='([^']+)'", onclick)
            if not url_m:
                continue
            url = url_m.group(1)

            # Title
            title_el = li.select_one(".event-title h2")
            title = title_el.get_text(strip=True) if title_el else ""

            # Location
            loc_el = li.select_one(".event-location")
            location = loc_el.get_text(strip=True) if loc_el else ""

            # Date text
            date_el = li.select_one(".event-date")
            date_text = date_el.get_text(strip=True) if date_el else ""

            if url and title:
                events.append({
                    "url": url,
                    "title": title,
                    "location": location,
                    "date_text": date_text,
                })

        return events

    # ── Detail page parsing ──────────────────────────────────────

    def _parse_event_detail(
        self, html: str, url: str
    ) -> ScrapedEventData | None:
        """Parse an event detail page into ScrapedEventData."""
        soup = BeautifulSoup(html, "lxml")

        # Title
        title = self._extract_title(soup)
        if not title:
            return None

        # Description
        description = self._extract_description(soup)

        # Hero image
        image_url = self._extract_image(soup)

        # Date and variants from DISTÂNCIA / HORA / LOCAL section
        start_date, city, variants = self._extract_distance_section(soup)

        # Google Maps link
        maps_url = _extract_maps_url(soup)

        # Sport types from title + variant names
        all_names = [title] + [v.name for v in variants]
        sport_labels: list[str] = []
        for name in all_names:
            for st in _guess_sport_types(name):
                if st not in sport_labels:
                    sport_labels.append(st)

        # Regulation documents
        documents = self._extract_documents(soup)

        return ScrapedEventData(
            title=title,
            source_url=url,
            description=description,
            sport_types=sport_labels,
            start_date=start_date,
            city=city,
            google_maps_url=maps_url,
            image_url=image_url,
            organizer_name="Xistarca",
            variants=variants,
            documents=documents,
        )

    # ── Element extractors ───────────────────────────────────────

    def _extract_title(self, soup: BeautifulSoup) -> str:
        """Extract event title from h1."""
        h1 = soup.select_one("h1")
        if h1:
            text = h1.get_text(strip=True)
            # Clean "Bem-vindo ao/à ..." prefix
            text = re.sub(
                r"^Bem[- ]?vindo\s+(?:ao?|à)\s+",
                "",
                text,
                flags=re.IGNORECASE,
            )
            # Remove trailing "!" 
            text = text.rstrip("!")
            return text.strip()
        return ""

    def _extract_description(self, soup: BeautifulSoup) -> str | None:
        """Extract event description from intro paragraphs before first h3."""
        h1 = soup.select_one("h1")
        first_h3 = soup.select_one("h3")
        if not h1:
            return None

        paragraphs: list[str] = []
        current = h1.find_next()
        while current and current != first_h3:
            if current.name == "p":
                text = current.get_text(strip=True)
                # Skip short/boilerplate lines
                if text and len(text) > 20 and "INSCRIÇÃO" not in text.upper():
                    paragraphs.append(text)
            current = current.find_next()

        return "\n".join(paragraphs) if paragraphs else None

    def _extract_image(self, soup: BeautifulSoup) -> str | None:
        """Extract hero image URL."""
        img = soup.select_one(".wp-post-image")
        if img:
            src = img.get("src", "")
            if src:
                return urljoin(_BASE, src)

        img = soup.select_one(".attachment-event-thumb")
        if img:
            src = img.get("src", "")
            if src:
                return urljoin(_BASE, src)

        return None

    def _extract_distance_section(
        self, soup: BeautifulSoup
    ) -> tuple[datetime | None, str | None, list[ScrapedVariantData]]:
        """Extract date, city and variants from DISTÂNCIA / HORA / LOCAL section.

        Returns (start_date, city, variants).
        """
        dist_h3 = soup.find("h3", string=re.compile(r"DIST[AÂ]NCIA", re.I))
        if not dist_h3:
            return None, None, []

        # Collect all text content after the h3 until next h3
        lines: list[str] = []
        sib = dist_h3.find_next_sibling()
        while sib and sib.name != "h3":
            text = sib.get_text("\n", strip=True)
            if text:
                lines.extend(text.split("\n"))
            sib = sib.find_next_sibling()

        # Also check for Google Maps link in this area
        city: str | None = None
        start_date: datetime | None = None
        variants: list[ScrapedVariantData] = []

        for line in lines:
            line = line.strip()
            if not line:
                continue

            # Try to parse date: "11 ABRIL 2026"
            if not start_date:
                dt = _parse_detail_date(line)
                if dt:
                    start_date = dt

            # Try to extract city after "|": "Fábrica Hit Kagome | Castanheira do Ribatejo"
            if "|" in line and not city:
                parts = line.split("|")
                if len(parts) >= 2:
                    candidate = parts[-1].strip()
                    if candidate and len(candidate) > 2:
                        city = candidate

            # Parse variant lines: "» Corrida 10km | 10h00"
            parsed = _parse_variant_line(line)
            if parsed:
                name, dist, time = parsed
                variants.append(
                    ScrapedVariantData(
                        name=name,
                        distance_km=dist,
                        start_time=time,
                    )
                )

        return start_date, city, variants

    def _extract_documents(
        self, soup: BeautifulSoup
    ) -> list[ScrapedDocumentData]:
        """Extract regulation PDF links."""
        docs: list[ScrapedDocumentData] = []
        seen: set[str] = set()

        for a in soup.find_all("a", href=True):
            href = a["href"].strip()
            if href in seen:
                continue

            # PDF links
            if href.lower().endswith(".pdf"):
                seen.add(href)
                file_name = href.rsplit("/", 1)[-1]
                docs.append(
                    ScrapedDocumentData(
                        original_url=href,
                        document_type="regulation",
                        file_name=file_name,
                    )
                )

        return docs
