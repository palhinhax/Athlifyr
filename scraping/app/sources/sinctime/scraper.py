"""SincTime scraper — extracts events from sinctime.com.

Site structure
--------------
* Listing page ``/proximos-eventos`` — paginated cards (page query param)
  Each card: title (h3 > a), date text, short description, detail link
* Detail page  ``/evento/{id}`` — full description, image, variants (Provas),
  pricing phases, and regulation PDF link.
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
    ScrapedPricingData,
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)

_BASE = "https://www.sinctime.com"
_EVENTS_URL = f"{_BASE}/proximos-eventos"

# ── Portuguese months ────────────────────────────────────────────

_PT_MONTHS: dict[str, int] = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4,
    "mai": 5, "jun": 6, "jul": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
    "janeiro": 1, "fevereiro": 2, "março": 3, "marco": 3,
    "abril": 4, "maio": 5, "junho": 6,
    "julho": 7, "agosto": 8, "setembro": 9,
    "outubro": 10, "novembro": 11, "dezembro": 12,
}

# ── Sport keyword detection ──────────────────────────────────────

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btrail\b|\btrilho", re.I), "TRAIL"),
    (re.compile(r"\bbtt\b|\bmtb\b|\bresistência\s*btt\b", re.I), "BTT"),
    (re.compile(r"\bcicl\w*\b|\bgravel\b|\be-bike", re.I), "CYCLING"),
    (re.compile(r"\bduathlon\b|\bduatlo\b", re.I), "DUATHLON"),
    (re.compile(r"\baquathlon\b|\baquatlo\b", re.I), "AQUATHLON"),
    (re.compile(r"\btriathlon\b|\btriatlo\b", re.I), "TRIATHLON"),
    (re.compile(r"\bcorrida\b|\bmaratona\b|\bmeia[- ]maratona\b|\brun\b|\bkm\b|\bcross\b", re.I), "RUNNING"),
    (re.compile(r"\bcaminhada\b|\bwalk\b|\bmarcha\b", re.I), "WALKING"),
    (re.compile(r"\bnatação\b|\bswim\b", re.I), "SWIMMING"),
    (re.compile(r"\bobstáculo\b|\bocr\b|clash", re.I), "OCR"),
    (re.compile(r"\bskyrunning\b|\bsky\s*race\b", re.I), "TRAIL"),
]


def _parse_short_date(text: str) -> datetime | None:
    """Parse dates like ``28 mar 2026`` or ``04 abr 2026``."""
    text = text.strip().lower()
    m = re.match(r"(\d{1,2})\s+(\w+)\s+(\d{4})", text)
    if m:
        day_s, month_s, year_s = m.groups()
        month = _PT_MONTHS.get(month_s)
        if month:
            try:
                return datetime(int(year_s), month, int(day_s))
            except ValueError:
                pass
    return None


def _parse_datetime_str(text: str) -> tuple[datetime | None, str | None]:
    """Parse ``28 mar 2026 15:00`` → (datetime, '15:00')."""
    text = text.strip().lower()
    m = re.match(r"(\d{1,2})\s+(\w+)\s+(\d{4})\s+(\d{1,2}:\d{2})", text)
    if m:
        day_s, month_s, year_s, time_s = m.groups()
        month = _PT_MONTHS.get(month_s)
        if month:
            h, mi = time_s.split(":")
            try:
                return datetime(int(year_s), month, int(day_s), int(h), int(mi)), time_s
            except ValueError:
                pass
    # Fallback: date without time
    dt = _parse_short_date(text)
    return dt, None


def _parse_price(text: str) -> tuple[float | None, datetime | None]:
    """Parse ``12,50€ se pagar até 16 mar 2026`` → (12.5, datetime)."""
    price: float | None = None
    deadline: datetime | None = None
    # Price
    pm = re.search(r"(\d+[.,]\d+)\s*€", text)
    if pm:
        price = float(pm.group(1).replace(",", "."))
    # Deadline date
    dm = re.search(r"até\s+(\d{1,2}\s+\w+\s+\d{4})", text)
    if dm:
        deadline = _parse_short_date(dm.group(1))
    return price, deadline


def _guess_sport_types(title: str) -> list[str]:
    types: list[str] = []
    for pattern, sport in _SPORT_KW:
        if pattern.search(title) and sport not in types:
            types.append(sport)
    return types or ["OTHER"]


def _guess_distance(text: str) -> float | None:
    m = re.search(r"(\d+(?:[.,]\d+)?)\s*(?:km|k)\b", text, re.I)
    if m:
        return float(m.group(1).replace(",", "."))
    return None


class SincTimeScraper(BaseScraper):
    source_name = "sinctime"
    display_name = "SincTime"
    base_url = _BASE
    description = "Timing & registration platform — sinctime.com"

    EVENTS_PER_PAGE = 8  # approximate items per page

    # ── Public interface ─────────────────────────────────────────

    async def scrape(self) -> list[ScrapedEventData]:
        events: list[ScrapedEventData] = []
        seen_urls: set[str] = set()
        page = 1

        while True:
            url = f"{_EVENTS_URL}?pagina={page}"
            html = await self.fetch_page(url)
            soup = BeautifulSoup(html, "lxml")

            links = self._extract_event_links(soup)
            if not links:
                break

            logger.info("Page %d: found %d event links", page, len(links))
            for event_url in links:
                if event_url in seen_urls:
                    continue
                seen_urls.add(event_url)
                try:
                    ev = await self.scrape_event(event_url)
                    if ev:
                        events.append(ev)
                except Exception:
                    logger.exception("Failed to scrape SincTime event: %s", event_url)

            # Check for next page
            if not self._has_next_page(soup, page):
                break
            page += 1

        logger.info("Total events scraped from SincTime: %d", len(events))
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Scrape a single SincTime event detail page."""
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        title = self._extract_title(soup)
        if not title:
            logger.warning("No title for %s — skipping", url)
            return None

        event_id = self._extract_event_id(url)
        description = self._extract_description(soup)
        image_url = self._extract_image(soup)

        # Variants / pricing from "Provas" section
        variants, pricing_phases, raw_pricing_text = self._extract_provas(soup)

        # Start date from the first variant or from description
        start_date: datetime | None = None
        if variants and pricing_phases:
            # Get earliest date from pricing phases
            dates = [p.start_date for p in pricing_phases if p.start_date]
            if not dates:
                dates_end = [p.end_date for p in pricing_phases if p.end_date]
        if variants:
            for v in variants:
                if v.start_time:
                    dt = _parse_short_date(v.start_time) if len(v.start_time) > 5 else None
                    if not dt:
                        # Try parsing from the raw text stored temporarily
                        pass

        # Try extracting date from the page text
        start_date = self._extract_start_date(soup)

        # Documents (regulation PDF)
        documents = self._extract_documents(soup)

        # Organizer
        organizer = self._extract_organizer(description)

        sport_types = _guess_sport_types(title)

        raw = {"url": url, "title": title, "event_id": event_id}

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=event_id,
            description=description,
            sport_types=sport_types,
            start_date=start_date,
            city=None,
            country="Portugal",
            organizer_name=organizer,
            image_url=image_url,
            variants=variants,
            pricing_phases=pricing_phases,
            documents=documents,
            raw_pricing_text=raw_pricing_text,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── Listing page helpers ─────────────────────────────────────

    def _extract_event_links(self, soup: BeautifulSoup) -> list[str]:
        """Extract event detail URLs from the listing page."""
        links: list[str] = []
        seen: set[str] = set()
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href:
                continue
            # Match /evento/{id} links
            if re.search(r"/evento/\d+", href):
                full = href if href.startswith("http") else urljoin(_BASE, href)
                if full not in seen:
                    seen.add(full)
                    links.append(full)
        return links

    def _has_next_page(self, soup: BeautifulSoup, current_page: int) -> bool:
        """Check if there is a next page in the pagination."""
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            m = re.search(r"[?&]pagina=(\d+)", href)
            if m and int(m.group(1)) > current_page:
                return True
        return False

    # ── Detail page helpers ──────────────────────────────────────

    def _extract_title(self, soup: BeautifulSoup) -> str | None:
        """Extract event title from <h2> or <h1>."""
        for tag in ("h2", "h1"):
            el = soup.find(tag)
            if el:
                text = el.get_text(strip=True)
                if text:
                    return text
        # Fallback: og:title
        og = soup.find("meta", property="og:title")
        if og:
            content = og.get("content", "")
            if content:
                return content.strip()
        return None

    @staticmethod
    def _extract_event_id(url: str) -> str:
        """Extract numeric event ID from URL like /evento/432."""
        m = re.search(r"/evento/(\d+)", url)
        return m.group(1) if m else url.rstrip("/").rsplit("/", 1)[-1]

    def _extract_description(self, soup: BeautifulSoup) -> str | None:
        """Extract event description from .caption.singleBlog."""
        container = soup.select_one("div.caption.singleBlog")
        if not container:
            return None
        # Get text from direct <p> and <div> children (before "Provas" section)
        parts: list[str] = []
        h4 = container.find("h4")
        for child in container.children:
            if child == h4:
                break
            if isinstance(child, Tag) and child.name in ("p", "div"):
                # Skip the image container
                if "event-image-content" in (child.get("class") or []):
                    continue
                text = child.get_text(strip=True)
                if text and text != "\xa0":
                    parts.append(text)
        return "\n".join(parts) if parts else None

    def _extract_image(self, soup: BeautifulSoup) -> str | None:
        """Extract event image URL."""
        img_container = soup.select_one("div.event-image-content img")
        if img_container:
            src = img_container.get("src", "")
            if isinstance(src, list):
                src = src[0]
            if src:
                return urljoin(_BASE, src)
        # Fallback: og:image
        og = soup.find("meta", property="og:image")
        if og:
            content = og.get("content", "")
            if content:
                return content.strip()
        return None

    def _extract_start_date(self, soup: BeautifulSoup) -> datetime | None:
        """Try to find the earliest variant date from the Provas section."""
        dates: list[datetime] = []
        for h5 in soup.select("h5"):
            sibling = h5.find_next_sibling("div", class_="singleBlog")
            if sibling:
                text = sibling.get_text(" ", strip=True)
                dt, _ = _parse_datetime_str(text[:30])
                if dt:
                    dates.append(dt)
        if dates:
            return min(dates)
        # Fallback: look for date pattern in the page text
        text = soup.get_text(" ")
        m = re.search(r"(\d{1,2})\s+(?:de\s+)?(\w+)\s+(?:de\s+)?(\d{4})", text)
        if m:
            day_s, month_s, year_s = m.groups()
            month = _PT_MONTHS.get(month_s.lower())
            if month:
                try:
                    return datetime(int(year_s), month, int(day_s))
                except ValueError:
                    pass
        return None

    def _extract_provas(
        self, soup: BeautifulSoup
    ) -> tuple[list[ScrapedVariantData], list[ScrapedPricingData], str | None]:
        """Parse the 'Provas' section with variants and pricing phases."""
        variants: list[ScrapedVariantData] = []
        pricing: list[ScrapedPricingData] = []
        raw_parts: list[str] = []

        for h5 in soup.select("h5"):
            # Variant name is inside h5 > strong
            strong = h5.find("strong")
            if not strong:
                continue
            variant_name = strong.get_text(strip=True)
            # Remove leading icon text if any
            variant_name = re.sub(r"^\s*", "", variant_name).strip()

            # Get the sibling div.singleBlog with details
            detail_div = h5.find_next_sibling("div", class_="singleBlog")
            if not detail_div:
                continue

            detail_text = detail_div.get_text(" ", strip=True)
            raw_parts.append(f"{variant_name}: {detail_text}")

            # Parse date/time from the start of the div text
            dt, start_time = _parse_datetime_str(detail_text[:30])

            # Distance from variant name
            distance = _guess_distance(variant_name)

            # Price from the first pricing item (current/lowest)
            price: float | None = None
            price_items = detail_div.select("ul li")
            for li in price_items:
                li_text = li.get_text(strip=True)
                if "€" in li_text:
                    p, deadline = _parse_price(li_text)

                    # Determine phase name
                    phase_name = None
                    if "highlight" in (li.get("class") or []):
                        phase_name = "Fase atual"
                    else:
                        phase_name = "Fase normal"

                    if price is None and p is not None:
                        price = p

                    pricing.append(ScrapedPricingData(
                        variant_name=variant_name,
                        phase_name=phase_name,
                        end_date=deadline,
                        price=p,
                        currency="EUR",
                    ))

            variants.append(ScrapedVariantData(
                name=variant_name,
                distance_km=distance,
                start_time=start_time,
                price=price,
                currency="EUR",
            ))

        raw_pricing_text = "\n".join(raw_parts) if raw_parts else None
        return variants, pricing, raw_pricing_text

    def _extract_documents(self, soup: BeautifulSoup) -> list[ScrapedDocumentData]:
        """Extract regulation PDF links."""
        docs: list[ScrapedDocumentData] = []
        # Pattern: <a onclick="return redirectAction('/storage/files/...pdf', true);">Regulamento</a>
        for a in soup.select("a"):
            text = a.get_text(strip=True).lower()
            if "regulamento" not in text:
                continue
            # Try onclick attribute for the real PDF URL
            onclick = a.get("onclick", "")
            if isinstance(onclick, list):
                onclick = onclick[0]
            m = re.search(r"redirectAction\('([^']+\.pdf)'", onclick)
            if m:
                pdf_path = m.group(1)
                pdf_url = urljoin(_BASE, pdf_path)
                docs.append(ScrapedDocumentData(
                    original_url=pdf_url,
                    document_type="regulation",
                    file_name=pdf_path.rsplit("/", 1)[-1],
                    mime_type="application/pdf",
                ))
            else:
                # Fallback: direct href
                href = a.get("href", "")
                if isinstance(href, list):
                    href = href[0]
                if href and href != "#" and "javascript" not in href:
                    docs.append(ScrapedDocumentData(
                        original_url=urljoin(_BASE, href),
                        document_type="regulation",
                    ))
        return docs

    @staticmethod
    def _extract_organizer(description: str | None) -> str | None:
        """Try to extract organizer name from description text."""
        if not description:
            return None
        # Common patterns: "organiza", "organização de/da/do"
        m = re.search(
            r"(?:organiza(?:ção|do|da)?\s+(?:d[aoe]\s+)?)([\w\s]+?)(?:\s+vai|\s+em|\s*[,.])",
            description,
            re.I,
        )
        if m:
            return m.group(1).strip()
        return None
