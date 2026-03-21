"""Lap2Go scraper — extracts events from lap2go.com."""

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
    ScrapedPricingData,
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)

_MONTH_MAP_PT: dict[str, int] = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4, "mai": 5, "jun": 6,
    "jul": 7, "ago": 8, "set": 9, "out": 10, "nov": 11, "dez": 12,
}


def _parse_date(text: str | None) -> datetime | None:
    """Try to parse date strings in typical Lap2Go formats."""
    if not text:
        return None
    text = text.strip()
    # Try ISO-like: dd/mm/yyyy or dd-mm-yyyy
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    # Try with time: dd/mm/yyyy HH:MM
    for fmt in ("%d/%m/%Y %H:%M", "%d-%m-%Y %H:%M"):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


def _parse_price(text: str | None) -> float | None:
    """Extract numeric price from strings like '23.70€' or '10,00€'."""
    if not text:
        return None
    text = text.replace("\xa0", "").strip()
    match = re.search(r"(\d+[.,]\d+|\d+)", text)
    if match:
        return float(match.group(1).replace(",", "."))
    return None


class Lap2GoScraper(BaseScraper):
    source_name = "lap2go"
    display_name = "Lap2Go"
    base_url = "https://lap2go.com"
    description = "Timing and event management platform — lap2go.com"

    # ── List events ──────────────────────────────────────────────

    async def scrape(self) -> list[ScrapedEventData]:
        """Scrape the Lap2Go event listing pages for upcoming events."""
        events: list[ScrapedEventData] = []
        html = await self.fetch_page(f"{self.base_url}/pt/events")
        soup = BeautifulSoup(html, "lxml")

        event_links = self._extract_event_links(soup)
        logger.info("Found %d event links on Lap2Go", len(event_links))

        for url in event_links:
            try:
                ev = await self.scrape_event(url)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape event: %s", url)
        return events

    # ── Single event ─────────────────────────────────────────────

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Scrape a single Lap2Go event page."""
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        title = self._extract_title(soup)
        if not title:
            logger.warning("No title found for %s — skipping", url)
            return None

        description = self._extract_description(soup)
        city, location_text = self._extract_location(soup)
        date = self._extract_date(soup)
        deadline = self._extract_deadline(soup)
        organizer = self._extract_organizer(soup)
        site_url = self._extract_site(soup)
        variants = self._extract_variants(soup)
        pricing = self._extract_pricing(soup)
        documents = self._extract_documents(soup, url)

        raw = {
            "url": url,
            "title": title,
            "description": description,
            "location": location_text,
            "date_text": date,
        }

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=self._event_id_from_url(url),
            description=description,
            sport_types=self._guess_sport_types(title, description),
            start_date=_parse_date(date),
            registration_deadline=_parse_date(deadline),
            city=city,
            country="Portugal",
            organizer_name=organizer,
            external_url=site_url,
            variants=variants,
            pricing_phases=pricing,
            documents=documents,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── Private extraction helpers ───────────────────────────────

    def _extract_event_links(self, soup: BeautifulSoup) -> list[str]:
        links: list[str] = []
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if "/pt/event/" in href or "/en/event/" in href:
                full = href if href.startswith("http") else f"{self.base_url}{href}"
                if full not in links:
                    links.append(full)
        return links

    def _extract_title(self, soup: BeautifulSoup) -> str | None:
        h1 = soup.select_one("h1")
        if h1:
            return h1.get_text(strip=True)
        og = soup.select_one('meta[property="og:title"]')
        if og:
            content = og.get("content")
            if isinstance(content, list):
                content = content[0]
            return content
        return None

    def _extract_description(self, soup: BeautifulSoup) -> str | None:
        desc_div = soup.select_one(".event-description, .description, #description")
        if desc_div:
            return desc_div.get_text(separator="\n", strip=True)
        meta = soup.select_one('meta[property="og:description"]')
        if meta:
            content = meta.get("content")
            if isinstance(content, list):
                content = content[0]
            return content
        return None

    def _extract_location(self, soup: BeautifulSoup) -> tuple[str | None, str | None]:
        for label in soup.find_all(string=re.compile(r"Local|Location", re.I)):
            parent = label.parent
            if parent:
                sibling = parent.find_next_sibling()
                if sibling:
                    text = sibling.get_text(strip=True)
                    parts = [p.strip() for p in text.split(",")]
                    return parts[0] if parts else None, text
        return None, None

    def _extract_date(self, soup: BeautifulSoup) -> str | None:
        for label in soup.find_all(string=re.compile(r"Data|Date", re.I)):
            parent = label.parent
            if parent:
                sibling = parent.find_next_sibling()
                if sibling:
                    return sibling.get_text(strip=True)
        return None

    def _extract_deadline(self, soup: BeautifulSoup) -> str | None:
        for label in soup.find_all(
            string=re.compile(r"Inscrições terminam|Registration", re.I)
        ):
            parent = label.parent
            if parent:
                sibling = parent.find_next_sibling()
                if sibling:
                    return sibling.get_text(strip=True)
        return None

    def _extract_organizer(self, soup: BeautifulSoup) -> str | None:
        for label in soup.find_all(
            string=re.compile(r"Organizador|Organizer", re.I)
        ):
            parent = label.parent
            if parent:
                sibling = parent.find_next_sibling()
                if sibling:
                    return sibling.get_text(strip=True)
        return None

    def _extract_site(self, soup: BeautifulSoup) -> str | None:
        for label in soup.find_all(string=re.compile(r"^Site$", re.I)):
            parent = label.parent
            if parent:
                link = parent.find_next("a", href=True)
                if link:
                    href = link.get("href", "")
                    if isinstance(href, list):
                        href = href[0]
                    return href
        return None

    def _extract_variants(self, soup: BeautifulSoup) -> list[ScrapedVariantData]:
        """Try to extract race variants from pricing tables or headings."""
        variants: list[ScrapedVariantData] = []
        seen_names: set[str] = set()

        # Look for pricing table rows that have variant names
        for row_header in soup.select("th, .variant-name, .race-name"):
            name = row_header.get_text(strip=True)
            if name and len(name) > 2 and name.lower() not in seen_names:
                seen_names.add(name.lower())
                distance = self._guess_distance(name)
                variants.append(
                    ScrapedVariantData(name=name, distance_km=distance)
                )

        return variants

    def _extract_pricing(self, soup: BeautifulSoup) -> list[ScrapedPricingData]:
        """Extract pricing phases from Lap2Go pricing tables."""
        phases: list[ScrapedPricingData] = []

        tables = soup.select("table")
        for table in tables:
            rows = table.select("tr")
            if len(rows) < 2:
                continue

            # Check if this looks like a pricing table
            header_text = rows[0].get_text(strip=True).lower()
            if not any(
                kw in header_text
                for kw in ["preço", "price", "fase", "phase", "€"]
            ):
                continue

            # Try to extract header dates as phase boundaries
            headers = [th.get_text(strip=True) for th in rows[0].select("th, td")]

            for row in rows[1:]:
                cells = row.select("td, th")
                if len(cells) < 2:
                    continue
                variant_name = cells[0].get_text(strip=True)
                for i, cell in enumerate(cells[1:], 1):
                    price = _parse_price(cell.get_text(strip=True))
                    if price is not None:
                        phase_name = headers[i] if i < len(headers) else f"Fase {i}"
                        phases.append(
                            ScrapedPricingData(
                                variant_name=variant_name,
                                phase_name=phase_name,
                                price=price,
                                currency="EUR",
                            )
                        )

        return phases

    def _extract_documents(
        self, soup: BeautifulSoup, page_url: str
    ) -> list[ScrapedDocumentData]:
        docs: list[ScrapedDocumentData] = []
        for a in soup.select('a[href$=".pdf"]'):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href:
                continue
            full_url = href if href.startswith("http") else f"{self.base_url}{href}"
            name = a.get_text(strip=True) or href.split("/")[-1]
            docs.append(
                ScrapedDocumentData(
                    original_url=full_url,
                    document_type="regulation",
                    file_name=name,
                    mime_type="application/pdf",
                )
            )
        return docs

    # ── Utility ──────────────────────────────────────────────────

    @staticmethod
    def _event_id_from_url(url: str) -> str | None:
        """Extract event slug/id from Lap2Go URL."""
        parts = url.rstrip("/").split("/")
        return parts[-1] if parts else None

    @staticmethod
    def _guess_sport_types(
        title: str | None, description: str | None
    ) -> list[str]:
        text = f"{title or ''} {description or ''}".lower()
        types: list[str] = []
        if any(k in text for k in ["trail", "trilho", "ultra"]):
            types.append("TRAIL")
        if any(k in text for k in ["corrida", "run", "km", "atletismo"]):
            types.append("RUNNING")
        if any(k in text for k in ["caminhada", "walk", "marcha"]):
            types.append("WALKING")
        if any(k in text for k in ["btt", "bike", "ciclismo"]):
            types.append("BTT")
        if any(k in text for k in ["triatlo", "triathlon"]):
            types.append("TRIATHLON")
        if not types:
            types.append("RUNNING")
        return types

    @staticmethod
    def _guess_distance(name: str) -> float | None:
        match = re.search(r"(\d+(?:[.,]\d+)?)\s*km", name, re.I)
        if match:
            return float(match.group(1).replace(",", "."))
        return None
