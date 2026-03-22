"""RunPorto scraper — extracts events from runporto.com.

RunPorto organises road races (meias-maratonas, maratonas, corridas)
primarily in the Porto / Braga / north-of-Portugal region.

Site structure
--------------
* Listing page  ``/pt/eventos/`` — one link per edition
* Detail page   ``/{event}/{edition}/`` — title, description, banner image
* Info sub-page  ``/{event}/{edition}/informacoes-gerais/`` — date, city,
  variants, pricing phases, kit pickup info
* Regulamento   ``/{event}/{edition}/regulamento/`` — inline HTML, no PDF
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
    ScrapedEventData,
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)

_BASE = "https://www.runporto.com"
_EVENTS_URL = f"{_BASE}/pt/eventos/"

# ── Portuguese months ────────────────────────────────────────────

_PT_MONTHS: dict[str, int] = {
    "janeiro": 1, "fevereiro": 2, "março": 3, "marco": 3,
    "abril": 4, "maio": 5, "junho": 6,
    "julho": 7, "agosto": 8, "setembro": 9,
    "outubro": 10, "novembro": 11, "dezembro": 12,
    "jan": 1, "fev": 2, "mar": 3, "abr": 4,
    "mai": 5, "jun": 6, "jul": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
}

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btrail\b|\btrilho", re.I), "TRAIL"),
    (re.compile(r"\bmaratona\b|\bmeia[- ]maratona\b|\bcorrida\b|\brun\b|\brace\b|\bkm\b", re.I), "RUNNING"),
    (re.compile(r"\bcaminhada\b|\bwalk\b", re.I), "WALKING"),
    (re.compile(r"\bkids\b|\bcriança", re.I), "RUNNING"),
]

# Match edition slugs that contain a year (2024-2029).
_EDITION_RE = re.compile(r"/eventos/.+/.+-20(?:2[4-9]|3\d)")


def _parse_pt_date(text: str) -> datetime | None:
    """Parse dates like ``29 de março de 2026`` or ``24 de maio de 2026``."""
    m = re.search(
        r"(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})", text, re.I,
    )
    if not m:
        return None
    day, month_str, year = int(m.group(1)), m.group(2).lower(), int(m.group(3))
    month = _PT_MONTHS.get(month_str)
    if not month:
        return None
    try:
        return datetime(year, month, day)
    except ValueError:
        return None


def _parse_time(text: str) -> str | None:
    """Extract time string like ``9h30`` or ``09h30``."""
    m = re.search(r"(\d{1,2})[hH](\d{2})?", text)
    if m:
        h = m.group(1).zfill(2)
        mi = m.group(2) or "00"
        return f"{h}:{mi}"
    return None


def _guess_sport_types(title: str) -> list[str]:
    types: list[str] = []
    for pattern, sport in _SPORT_KW:
        if pattern.search(title) and sport not in types:
            types.append(sport)
    return types or ["RUNNING"]


def _guess_distance(text: str) -> float | None:
    """Extract distance in km from strings like '21 km', '5km', '21,0975 km'."""
    m = re.search(r"(\d+(?:[.,]\d+)?)\s*km", text, re.I)
    if m:
        return float(m.group(1).replace(",", "."))
    return None


def _extract_city(text: str) -> str | None:
    """Extract city from typical RunPorto date text like '…na Cidade do Porto…'."""
    m = re.search(r"(?:cidade\s+d[eo]\s+|cidade\s+)(\w[\w\s]*?)(?:[,.]|\s+com\b)", text, re.I)
    if m:
        return m.group(1).strip()
    m = re.search(r"em\s+(\w[\w\s]*?)(?:[,.]|\s+com\b)", text, re.I)
    if m:
        return m.group(1).strip()
    return None


class RunPortoScraper(BaseScraper):
    source_name = "runporto"
    display_name = "RunPorto"
    base_url = _BASE
    description = "Road races and marathons in Porto / northern Portugal — runporto.com"

    # ── Public interface ─────────────────────────────────────────

    async def scrape(self) -> list[ScrapedEventData]:
        event_urls = await self._fetch_event_urls()
        logger.info("Found %d event URLs on RunPorto", len(event_urls))
        events: list[ScrapedEventData] = []
        for url in event_urls:
            try:
                ev = await self.scrape_event(url)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape RunPorto event: %s", url)
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Scrape a single RunPorto event given its detail-page URL."""
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        title = self._extract_title(soup)
        if not title:
            logger.warning("No title for %s — skipping", url)
            return None

        slug = self._slug_from_url(url)
        description = self._extract_description(soup)
        image_url = self._extract_image(soup)

        # Discover the informações gerais sub-page URL
        info_url = self._find_subpage_url(soup, url, "informacoes-gerais")

        # Initialise fields filled from info sub-page
        start_date: datetime | None = None
        city: str | None = None
        start_time: str | None = None
        variants: list[ScrapedVariantData] = []
        raw_pricing_text: str | None = None
        info_description: str | None = None

        if info_url:
            try:
                info_html = await self.fetch_page(info_url)
                info_soup = BeautifulSoup(info_html, "lxml")
                (
                    start_date,
                    city,
                    start_time,
                    variants,
                    raw_pricing_text,
                    info_description,
                ) = self._parse_info_page(info_soup)
            except Exception:
                logger.exception("Failed to fetch info page: %s", info_url)

        # Combine descriptions: main page + info page
        if info_description:
            if description:
                description = f"{description}\n\n{info_description}"
            else:
                description = info_description

        sport_types = _guess_sport_types(title)

        raw = {"url": url, "title": title, "info_url": info_url}

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=slug,
            description=description,
            sport_types=sport_types,
            start_date=start_date,
            city=city,
            country="Portugal",
            organizer_name="Runporto.com",
            external_url=url,
            image_url=image_url,
            variants=variants,
            raw_pricing_text=raw_pricing_text,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── Listing page ─────────────────────────────────────────────

    async def _fetch_event_urls(self) -> list[str]:
        """Return de-duplicated edition URLs from the events listing page."""
        html = await self.fetch_page(_EVENTS_URL)
        return self.parse_event_urls(html)

    @staticmethod
    def parse_event_urls(html: str) -> list[str]:
        """Parse event edition URLs from listing HTML (testable)."""
        soup = BeautifulSoup(html, "lxml")
        seen: set[str] = set()
        urls: list[str] = []
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href:
                continue
            full = href if href.startswith("http") else urljoin(_BASE, href)
            # Must be an edition URL (has at least /eventos/{series}/{edition}/)
            if not _EDITION_RE.search(full):
                continue
            normalised = full.rstrip("/")
            if normalised in seen:
                continue
            # Skip sub-pages (informacoes-gerais, regulamento, etc.)
            # Edition URLs have exactly 3 path segments after /eventos/
            # e.g. /pt/eventos/meia-maratona-de-braga/meia-maratona-de-braga-2026/
            # or   /eventos/maratona-do-porto/maratona-do-porto-2026/
            path = normalised.split("/eventos/", 1)[-1]
            segments = [s for s in path.split("/") if s]
            if len(segments) != 2:
                continue
            seen.add(normalised)
            urls.append(full)
        return urls

    # ── Detail page helpers ──────────────────────────────────────

    @staticmethod
    def _extract_title(soup: BeautifulSoup) -> str | None:
        h1 = soup.select_one("h1")
        if h1:
            return h1.get_text(strip=True)
        og = soup.select_one('meta[property="og:title"]')
        if og:
            content = og.get("content")
            return content[0] if isinstance(content, list) else content
        return None

    @staticmethod
    def _extract_description(soup: BeautifulSoup) -> str | None:
        """Get the main descriptive text from the detail page body."""
        # The content sits inside the main content area, after h1
        h1 = soup.select_one("h1")
        if not h1:
            return None
        # Collect text paragraphs after the h1 until we hit a non-content section
        parts: list[str] = []
        for sibling in h1.find_next_siblings():
            if not isinstance(sibling, Tag):
                continue
            # Stop at known non-content sections (footer, sidebar menus)
            if sibling.name in ("footer", "nav"):
                break
            cls = " ".join(sibling.get("class", []))
            if "footer" in cls or "sidebar" in cls:
                break
            text = sibling.get_text(separator=" ", strip=True)
            if not text:
                continue
            # Stop at the "PRÓXIMO EVENTO" / "ALGUMAS DAS MELHORES" sections
            if re.search(r"PR[ÓO]XIMO EVENTO|MELHORES IMAGENS|ÚLTIMAS EDIÇÕES", text):
                break
            parts.append(text)
            # Don't gather too much — first few paragraphs suffice
            if len(parts) >= 5:
                break
        return "\n".join(parts) if parts else None

    @staticmethod
    def _extract_image(soup: BeautifulSoup) -> str | None:
        """Try og:image or first large image in content."""
        og = soup.select_one('meta[property="og:image"]')
        if og:
            content = og.get("content")
            url = content[0] if isinstance(content, list) else content
            if url:
                return url if url.startswith("http") else urljoin(_BASE, url)
        return None

    @staticmethod
    def _find_subpage_url(
        soup: BeautifulSoup, base_url: str, slug: str,
    ) -> str | None:
        """Find a sub-page link by its slug in the page menu."""
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if slug in href:
                return href if href.startswith("http") else urljoin(base_url, href)
        # Fallback: construct it
        return base_url.rstrip("/") + f"/{slug}/"

    # ── Info sub-page parsing ────────────────────────────────────

    @staticmethod
    def _parse_info_page(
        soup: BeautifulSoup,
    ) -> tuple[
        datetime | None,       # start_date
        str | None,            # city
        str | None,            # start_time
        list[ScrapedVariantData],
        str | None,            # raw_pricing_text
        str | None,            # info_description (full page text)
    ]:
        """Extract structured data from the informações gerais page."""
        # Grab full page text for AI consumption as description
        body = soup.select_one("body")
        full_text = body.get_text(separator="\n", strip=True) if body else None

        # --- Date, city, time from "DATA E HORA DA REALIZAÇÃO" ---
        start_date: datetime | None = None
        city: str | None = None
        start_time: str | None = None

        date_heading = soup.find(
            string=re.compile(r"DATA E HORA", re.I),
        )
        if date_heading:
            parent = date_heading.parent
            if parent:
                # Collect text from the section
                section_text_parts: list[str] = []
                for sib in parent.find_next_siblings():
                    if not isinstance(sib, Tag):
                        continue
                    if sib.name in ("h2", "h1"):
                        break
                    section_text_parts.append(sib.get_text(separator=" ", strip=True))
                section_text = " ".join(section_text_parts)
                if not section_text and parent.parent:
                    section_text = parent.parent.get_text(separator=" ", strip=True)

                start_date = _parse_pt_date(section_text)
                city = _extract_city(section_text)
                start_time = _parse_time(section_text)

        # --- Raw pricing text from pricing section ---
        raw_pricing_text: str | None = None
        pricing_heading = soup.find(
            string=re.compile(r"PRE[ÇC]O DE INSCRI[ÇC][ÃA]O", re.I),
        )
        if pricing_heading:
            parent = pricing_heading.parent
            if parent:
                # Collect text from the pricing section until the next H2
                pricing_parts: list[str] = []
                # Include the heading itself
                pricing_parts.append(parent.get_text(separator=" ", strip=True))
                for sib in parent.find_next_siblings():
                    if not isinstance(sib, Tag):
                        continue
                    if sib.name == "h2":
                        break
                    pricing_parts.append(sib.get_text(separator=" ", strip=True))
                raw_pricing_text = "\n".join(p for p in pricing_parts if p)

        # --- Variants: try to find variant names + distances ---
        variants = RunPortoScraper._extract_variants_from_text(
            raw_pricing_text or full_text or "",
        )
        # Apply start_time to all variants
        for v in variants:
            if not v.start_time and start_time:
                v.start_time = start_time

        return start_date, city, start_time, variants, raw_pricing_text, full_text

    @staticmethod
    def _extract_variants_from_text(text: str) -> list[ScrapedVariantData]:
        """Extract variant names and distances from pricing/info text."""
        variants: list[ScrapedVariantData] = []
        seen: set[str] = set()
        # Look for patterns like "Meia Maratona | 21 km" or "Corrida 5 km"
        # or "CORRIDA | CAMINHADA | 5 KM"
        for m in re.finditer(
            r"([\w\s/|]+?)\s*[\|–-]\s*(\d+(?:[.,]\d+)?)\s*km",
            text,
            re.I,
        ):
            name = re.sub(r"\s*\|\s*", " / ", m.group(1).strip())
            name = re.sub(r"\s+", " ", name).strip(" -–|")
            dist = float(m.group(2).replace(",", "."))
            key = name.lower()
            if key not in seen and len(name) > 1:
                seen.add(key)
                variants.append(ScrapedVariantData(name=name, distance_km=dist))

        # Also pick up standalone "Caminhada 6 km" / "Mini/Caminhada … 6 km"
        for m in re.finditer(
            r"((?:Mini/?)?Caminhada|Corrida|Super|Meia Maratona|Maratona)"
            r"[^€\n]{0,30}?(\d+(?:[.,]\d+)?)\s*km",
            text,
            re.I,
        ):
            name = m.group(1).strip()
            dist = float(m.group(2).replace(",", "."))
            key = name.lower()
            if key not in seen:
                seen.add(key)
                variants.append(ScrapedVariantData(name=name, distance_km=dist))

        return variants

    # ── Utilities ────────────────────────────────────────────────

    @staticmethod
    def _slug_from_url(url: str) -> str:
        """Derive a unique slug from the edition URL."""
        parts = url.rstrip("/").split("/")
        # Use last two segments: series + edition
        if len(parts) >= 2:
            return f"{parts[-2]}--{parts[-1]}"
        return parts[-1] if parts else url
