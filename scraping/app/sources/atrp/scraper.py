"""ATRP scraper — Associação de Trail Running de Portugal.

Scrapes events from my.atrp.pt — the official Portuguese trail running
association calendar.  Events are listed across multiple circuit pages
(trail, ultra-trail, trail-sprint, ultra-endurance, ultra-endurance-xl,
circuito-jovem).  Detail pages contain JSON-LD structured data, GPX
track files per variant, regulamento PDFs, and external website links.
"""

from __future__ import annotations

import json
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

_BASE = "https://my.atrp.pt"

# Circuits to scrape — covers all ATRP categories
_CIRCUITS = [
    "trail",
    "ultra-trail",
    "trail-sprint",
    "ultra-endurance",
    "ultra-endurance-xl",
    "circuito-jovem",
]


def _parse_location(text: str) -> tuple[str | None, str | None]:
    """Parse location line like 'Beja (Zona Sul) - Serpa'.

    Returns (district, city).  The city (after the dash) is the more
    specific location we want.
    """
    if not text:
        return None, None
    # Pattern: "District (Zona Region) - City"
    m = re.match(r"(.+?)\s*\(Zona\s+.+?\)\s*-\s*(.+)", text, re.I)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    # Fallback: "District (Zona Region)" without city
    m = re.match(r"(.+?)\s*\(Zona\s+.+?\)", text, re.I)
    if m:
        return m.group(1).strip(), None
    return text.strip(), None


def _parse_atrp_date(text: str) -> datetime | None:
    """Parse date string like '23-05-2026 07:00:00'."""
    text = text.strip()
    for fmt in ("%d-%m-%Y %H:%M:%S", "%d-%m-%Y"):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


def _parse_percursos(description_html: str) -> list[dict]:
    """Parse variant info from the JSON-LD description.

    Format: 'Conta com N percursos:<br>Name1 - Points<br>Name2 - Points<br>'
    Returns list of {'name': ..., 'points': ...}.
    """
    variants: list[dict] = []
    m = re.search(r"Conta com \d+ percursos?:\s*(?:<br\s*/?>)?\s*(.+)", description_html, re.I | re.S)
    if not m:
        return variants

    raw = m.group(1)
    # Split on <br> tags
    parts = re.split(r"<br\s*/?>", raw)
    for part in parts:
        part = re.sub(r"<[^>]+>", "", part).strip()
        if not part:
            continue
        # "7CUT40 - 150" or just "Variant Name"
        if " - " in part:
            name, _, rest = part.rpartition(" - ")
            # rest is typically ATRP points, not useful as distance
            variants.append({"name": name.strip()})
        else:
            variants.append({"name": part})
    return variants


class ATRPScraper(BaseScraper):
    source_name = "atrp"
    display_name = "ATRP"
    base_url = _BASE
    description = "Associação de Trail Running de Portugal — official trail calendar — my.atrp.pt"

    async def scrape(self) -> list[ScrapedEventData]:
        seen_ids: set[str] = set()
        events: list[ScrapedEventData] = []

        for circuit in _CIRCUITS:
            url = f"{_BASE}/campeonato/{circuit}"
            try:
                html = await self.fetch_page(url)
            except Exception:
                logger.warning("Could not fetch ATRP circuit page: %s", circuit)
                continue

            soup = BeautifulSoup(html, "lxml")
            for a in soup.select("a[href^='/evento/']"):
                href = a.get("href", "")
                # Extract numeric event ID
                m = re.match(r"/evento/(\d+)", href)
                if not m:
                    continue
                event_id = m.group(1)
                if event_id in seen_ids:
                    continue
                seen_ids.add(event_id)

        logger.info("Found %d unique events across ATRP circuits", len(seen_ids))

        for event_id in sorted(seen_ids, key=int):
            try:
                ev = await self._scrape_event_by_id(event_id)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape ATRP event %s", event_id)

        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Scrape a single event by full URL or by /evento/ID path."""
        # Extract ID from URL
        m = re.search(r"/evento/(\d+)", url)
        if not m:
            logger.warning("Cannot extract ATRP event ID from URL: %s", url)
            return None
        return await self._scrape_event_by_id(m.group(1))

    async def _scrape_event_by_id(self, event_id: str) -> ScrapedEventData | None:
        """Scrape a single event detail page."""
        url = f"{_BASE}/evento/{event_id}"
        html = await self.fetch_page(url)

        if "não está ativo" in html:
            logger.debug("ATRP event %s not active, skipping", event_id)
            return None

        soup = BeautifulSoup(html, "lxml")

        # ── JSON-LD structured data ──
        ld_data = self._extract_json_ld(soup)
        title = ld_data.get("name", "").strip() if ld_data else None
        if not title:
            h2 = soup.select_one(".product-detail h2")
            title = h2.get_text(strip=True) if h2 else None
        if not title:
            logger.warning("No title found for ATRP event %s", event_id)
            return None

        # ── Date ──
        start_date: datetime | None = None
        if ld_data and ld_data.get("startDate"):
            start_date = _parse_atrp_date(ld_data["startDate"])
        if not start_date:
            cal = soup.select_one("i.fa-calendar")
            if cal:
                parent = cal.find_parent("div")
                if parent:
                    date_text = parent.get_text(strip=True).lstrip("| ")
                    start_date = _parse_atrp_date(date_text)

        # ── Location ──
        city: str | None = None
        district: str | None = None
        if ld_data:
            loc = ld_data.get("location", {})
            addr = loc.get("address", {}) if isinstance(loc, dict) else {}
            district = addr.get("streetAddress", "").strip() or None
        marker = soup.select_one("i.fa-map-marker")
        if marker:
            parent = marker.find_parent("div")
            if parent:
                loc_text = parent.get_text(strip=True).lstrip("| ")
                parsed_district, parsed_city = _parse_location(loc_text)
                city = parsed_city or parsed_district
                if not district:
                    district = parsed_district

        # ── Image ──
        img = soup.select_one(".product-detail img[src*=ficheiros]")
        image_url: str | None = None
        if img:
            src = img.get("src", "")
            if src:
                # Use full-size image instead of thumb
                image_url = urljoin(_BASE, src.replace("/thumbs/", "/"))

        # ── External URL ──
        external_url: str | None = None
        globe = soup.select_one("i.fa-globe")
        if globe:
            parent = globe.find_parent("div")
            if parent:
                ext_link = parent.select_one("a[href]")
                if ext_link:
                    href = ext_link.get("href", "")
                    if href.startswith("http") and "atrp.pt" not in href:
                        external_url = href

        # ── Regulamento PDF ──
        documents: list[ScrapedDocumentData] = []
        for a in soup.select("a[href$='.pdf'][download]"):
            text = a.get_text(strip=True).lower()
            href = a.get("href", "")
            if "regulamento" in text and href:
                full_url = urljoin(_BASE, href)
                documents.append(
                    ScrapedDocumentData(
                        original_url=full_url,
                        document_type="regulation",
                        file_name=href.rsplit("/", 1)[-1],
                        mime_type="application/pdf",
                    )
                )

        # ── GPX files & Variants ──
        gpx_variants: dict[str, str] = {}  # variant_name → gpx_url
        for a in soup.select("a[href$='.gpx'][download]"):
            href = a.get("href", "")
            text = a.get_text(strip=True)
            if not href:
                continue
            full_gpx_url = urljoin(_BASE, href)
            # "Transferir GPX de VariantName"
            m = re.match(r"Transferir GPX de (.+)", text, re.I)
            variant_name = m.group(1).strip() if m else text
            gpx_variants[variant_name] = full_gpx_url

        # Build variants from percursos description + GPX
        variants: list[ScrapedVariantData] = []
        description_html = ld_data.get("description", "") if ld_data else ""
        percursos = _parse_percursos(description_html)

        if percursos:
            for p in percursos:
                name = p["name"]
                gpx_url = gpx_variants.pop(name, None)
                variants.append(
                    ScrapedVariantData(name=name, gpx_url=gpx_url)
                )
        # Add any GPX variants not matched to a percurso
        for name, gpx_url in gpx_variants.items():
            variants.append(
                ScrapedVariantData(name=name, gpx_url=gpx_url)
            )

        # Sport types — ATRP is exclusively trail running
        sport_types = ["TRAIL"]

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=event_id,
            sport_types=sport_types,
            start_date=start_date,
            city=city,
            external_url=external_url,
            image_url=image_url,
            variants=variants,
            documents=documents,
            raw_data=json.dumps(
                {"ld": ld_data, "district": district, "city": city},
                ensure_ascii=False,
                default=str,
            ),
        )

    @staticmethod
    def _extract_json_ld(soup: BeautifulSoup) -> dict | None:
        """Extract and parse the schema.org JSON-LD block."""
        for script in soup.select("script"):
            if script.get("type") != "application/ld+json":
                continue
            raw = script.string
            if not raw:
                continue
            # Remove control characters that break JSON parsing
            clean = re.sub(r"[\x00-\x1f\x7f]", " ", raw)
            # Fix invalid JS escapes like \' that ATRP sometimes produces
            clean = clean.replace("\\'", "'")
            try:
                data = json.loads(clean)
                if isinstance(data, dict) and data.get("@type") == "Event":
                    return data
            except json.JSONDecodeError:
                logger.warning("Failed to parse ATRP JSON-LD")
        return None
