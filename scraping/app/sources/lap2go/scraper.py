"""Lap2Go scraper — extracts events from lap2go.com."""

from __future__ import annotations

import json
import logging
import re
from dataclasses import dataclass
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

# ── Helpers ──────────────────────────────────────────────────────

# Mapping from CSS class on list-page cards to our sport-type enum
_TYPE_CLASS_MAP: dict[str, str] = {
    "type-run": "RUNNING",
    "type-walk": "WALKING",
    "type-trail": "TRAIL",
    "type-btt": "BTT",
    "type-swim": "SWIMMING",
    "type-ticket": "OTHER",
}


def _parse_date(text: str | None) -> datetime | None:
    """Try to parse date strings in typical Lap2Go formats."""
    if not text:
        return None
    text = text.strip()
    for fmt in ("%d/%m/%Y", "%d-%m-%Y", "%Y-%m-%d"):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
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


@dataclass
class _ListCardInfo:
    """Pre-parsed data from a list-page event card."""

    url: str
    name: str | None = None
    city: str | None = None
    day: str | None = None  # DD-MM-YYYY
    sport_types: list[str] | None = None


class Lap2GoScraper(BaseScraper):
    source_name = "lap2go"
    display_name = "Lap2Go"
    base_url = "https://lap2go.com"
    description = "Timing and event management platform — lap2go.com"

    # ── List events ──────────────────────────────────────────────

    async def scrape(self) -> list[ScrapedEventData]:
        """Scrape the Lap2Go event listing page for upcoming events."""
        events: list[ScrapedEventData] = []
        html = await self.fetch_page(f"{self.base_url}/pt/event/list")
        soup = BeautifulSoup(html, "lxml")

        cards = self._extract_event_cards(soup)
        logger.info("Found %d event cards on Lap2Go", len(cards))

        for card in cards:
            try:
                ev = await self.scrape_event(card.url, card)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape event: %s", card.url)
        return events

    # ── Single event ─────────────────────────────────────────────

    async def scrape_event(
        self,
        url: str,
        card: _ListCardInfo | None = None,
    ) -> ScrapedEventData | None:
        """Scrape a single Lap2Go event page."""
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        title = self._extract_title(soup)
        if not title:
            logger.warning("No title found for %s — skipping", url)
            return None

        description = self._extract_description(soup)
        city, location_text = self._extract_location(soup)
        start_date, end_date = self._extract_dates(soup)
        deadline = self._extract_deadline(soup)
        organizer = self._extract_organizer(soup)
        site_url = self._extract_site(soup)
        image_url = self._extract_image(soup)
        variants, pricing, raw_pricing_text = self._extract_variants_and_pricing(soup)
        documents = await self._extract_documents(soup, url)

        # Enrich with list-card data when available
        if card:
            if not city and card.city:
                city = card.city
            if not start_date and card.day:
                start_date = _parse_date(card.day)

        sport_types = self._guess_sport_types(title, description)
        # Merge sport types detected from list page card icons
        if card and card.sport_types:
            for st in card.sport_types:
                if st not in sport_types:
                    sport_types.append(st)

        raw = {
            "url": url,
            "title": title,
            "description": description,
            "location": location_text,
        }

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=self._event_id_from_url(url),
            description=description,
            sport_types=sport_types,
            start_date=start_date,
            end_date=end_date,
            registration_deadline=_parse_date(deadline),
            city=city,
            country="Portugal",
            organizer_name=organizer,
            external_url=site_url,
            image_url=image_url,
            variants=variants,
            pricing_phases=pricing,
            documents=documents,
            raw_pricing_text=raw_pricing_text,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── List-page extraction ─────────────────────────────────────

    def _extract_event_cards(self, soup: BeautifulSoup) -> list[_ListCardInfo]:
        """Extract event cards from the list page.

        Each card is an ``<a class="event-item">`` with data attributes:
        ``data-name``, ``data-city``, ``data-day`` (DD-MM-YYYY).
        Child divs with ``type-*`` classes indicate the sport type.
        """
        cards: list[_ListCardInfo] = []
        seen_urls: set[str] = set()

        for a in soup.select("a.event-item[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href or "/pt/event/" not in href:
                continue
            full_url = href if href.startswith("http") else f"{self.base_url}{href}"
            if full_url in seen_urls:
                continue
            seen_urls.add(full_url)

            # Extract sport types from card icon classes
            sport_types: list[str] = []
            for div in a.select("[class*='type-']"):
                for cls in div.get("class", []):
                    mapped = _TYPE_CLASS_MAP.get(cls)
                    if mapped and mapped not in sport_types:
                        sport_types.append(mapped)

            cards.append(
                _ListCardInfo(
                    url=full_url,
                    name=a.get("data-name"),
                    city=a.get("data-city"),
                    day=a.get("data-day"),
                    sport_types=sport_types or None,
                )
            )

        return cards

    # ── Detail-page extraction ───────────────────────────────────

    def _extract_title(self, soup: BeautifulSoup) -> str | None:
        # Lap2Go puts the event title in an <h1> inside section.evento-page-title
        section = soup.select_one("section.evento-page-title h1")
        if section:
            return section.get_text(strip=True)
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
        # span.evento-detl contains h3 "Descrição" + <p> with text
        detl = soup.select_one("span.evento-detl")
        if detl:
            paragraphs = detl.select("p")
            if paragraphs:
                return "\n".join(p.get_text(strip=True) for p in paragraphs)
            # Fallback: get all text excluding the h3 label
            text = detl.get_text(separator="\n", strip=True)
            # Remove the "Descrição" label if present
            text = re.sub(r"^Descrição\s*", "", text, flags=re.I)
            return text or None
        meta = soup.select_one('meta[property="og:description"]')
        if meta:
            content = meta.get("content")
            if isinstance(content, list):
                content = content[0]
            return content
        return None

    def _extract_location(self, soup: BeautifulSoup) -> tuple[str | None, str | None]:
        # span.evento-local > p[itemprop="name"]
        span = soup.select_one("span.evento-local")
        if span:
            p = span.select_one('p[itemprop="name"]')
            if not p:
                p = span.select_one("p")
            if p:
                text = p.get_text(strip=True)
                parts = [part.strip() for part in text.split(",")]
                city = parts[-1] if len(parts) > 1 else parts[0]
                return city, text
        return None, None

    def _extract_dates(
        self, soup: BeautifulSoup
    ) -> tuple[datetime | None, datetime | None]:
        """Extract start and end dates from the event detail page.

        The dates live in ``span.evento-data`` elements containing
        ``<p itemprop="startDate" content="DD/MM/YYYY">``
        and ``<p itemprop="endDate" content="DD/MM/YYYY">``.
        The visible text in the following ``<p>`` also has the date.
        """
        start_date: datetime | None = None
        end_date: datetime | None = None

        spans = soup.select("span.evento-data")
        for span in spans:
            h3 = span.select_one("h3")
            if not h3:
                continue
            label = h3.get_text(strip=True).lower()
            if label != "data":
                continue

            # Try itemprop first (structured data)
            start_p = span.select_one('p[itemprop="startDate"]')
            if start_p:
                start_date = _parse_date(start_p.get("content"))
            end_p = span.select_one('p[itemprop="endDate"]')
            if end_p:
                end_date = _parse_date(end_p.get("content"))

            # Fallback: parse visible text from the last <p>
            if not start_date:
                paragraphs = span.select("p")
                for p in paragraphs:
                    if p.get("itemprop"):
                        continue
                    text = p.get_text(strip=True)
                    if text:
                        start_date = _parse_date(text)
                        break
            break

        return start_date, end_date

    def _extract_deadline(self, soup: BeautifulSoup) -> str | None:
        # Second span.evento-data with h3 "Inscrições terminam em"
        for span in soup.select("span.evento-data"):
            h3 = span.select_one("h3")
            if h3 and "inscri" in h3.get_text(strip=True).lower():
                p = span.select_one("p")
                if p:
                    return p.get_text(strip=True)
        return None

    def _extract_organizer(self, soup: BeautifulSoup) -> str | None:
        # span.evento-org > p[itemprop="performer"]
        span = soup.select_one("span.evento-org")
        if span:
            p = span.select_one('p[itemprop="performer"]')
            if not p:
                p = span.select_one("p")
            if p:
                return p.get_text(strip=True)
        return None

    def _extract_site(self, soup: BeautifulSoup) -> str | None:
        # span.evento-site > a[href]
        span = soup.select_one("span.evento-site")
        if span:
            link = span.select_one("a[href]")
            if link:
                href = link.get("href", "")
                if isinstance(href, list):
                    href = href[0]
                return href
        return None

    def _extract_image(self, soup: BeautifulSoup) -> str | None:
        """Extract the event banner/poster image URL."""
        og = soup.select_one('meta[property="og:image"]')
        if og:
            content = og.get("content")
            if isinstance(content, list):
                content = content[0]
            if content:
                return content
        img = soup.select_one("img.full-width[src]")
        if img:
            return img.get("src")
        return None

    def _extract_variants_and_pricing(
        self, soup: BeautifulSoup
    ) -> tuple[list[ScrapedVariantData], list[ScrapedPricingData], str | None]:
        """Extract variants and pricing from the pricing section.

        In Lap2Go each variant has its own ``<table>`` inside
        ``div.evento-fases-preços``.  Structure per table:

        * Row 0 (header): ``th.th-fpdates`` — date ranges per phase.
        * Row 1 (data):   ``td.td-fpprova`` — variant name,
                           ``td.td-fpvalor`` — price per phase.
        * Row 2 (info):   ``td.td-fpescalao`` — age categories.
        """
        variants: list[ScrapedVariantData] = []
        pricing: list[ScrapedPricingData] = []
        seen_names: set[str] = set()

        container = soup.select_one(
            ".evento-fases-preços, [class*='evento-fases']"
        )
        if not container:
            return variants, pricing, None

        # Capture raw pricing text for AI
        raw_pricing_text = container.get_text(separator="\n", strip=True)
        if raw_pricing_text and len(raw_pricing_text) > 50000:
            raw_pricing_text = raw_pricing_text[:50000]

        for table in container.select("table"):
            # Extract phase date ranges from header
            phase_dates: list[str] = []
            for th in table.select("th.th-fpdates"):
                phase_dates.append(th.get_text(separator=" - ", strip=True))

            # Extract variant name and prices from data row
            variant_td = table.select_one("td.td-fpprova")
            if not variant_td:
                continue
            variant_name = variant_td.get_text(strip=True)
            if not variant_name:
                continue

            # Build variant
            name_key = variant_name.lower()
            if name_key not in seen_names:
                seen_names.add(name_key)
                variants.append(
                    ScrapedVariantData(
                        name=variant_name,
                        distance_km=self._guess_distance(variant_name),
                    )
                )

            # Extract prices from td.td-fpvalor cells
            price_cells = table.select("td.td-fpvalor")
            for i, cell in enumerate(price_cells):
                price = _parse_price(cell.get_text(strip=True))
                if price is not None:
                    phase_name = phase_dates[i] if i < len(phase_dates) else f"Fase {i + 1}"
                    # Try to parse phase start/end dates
                    phase_start = None
                    phase_end = None
                    if i < len(phase_dates):
                        date_parts = re.split(r"\s*-\s*", phase_dates[i])
                        if len(date_parts) >= 2:
                            phase_start = _parse_date(date_parts[0].strip())
                            phase_end = _parse_date(date_parts[1].strip())

                    pricing.append(
                        ScrapedPricingData(
                            variant_name=variant_name,
                            phase_name=phase_name,
                            start_date=phase_start,
                            end_date=phase_end,
                            price=price,
                            currency="EUR",
                        )
                    )

        return variants, pricing, raw_pricing_text

    async def _extract_documents(
        self, soup: BeautifulSoup, page_url: str
    ) -> list[ScrapedDocumentData]:
        """Extract document links (regulamento, cartaz, etc.).

        Lap2Go event pages link to HTML sub-pages (e.g. regulamento.html,
        cartaz.html).  Those sub-pages contain the real file URL hosted
        on ``s3.lap2go.com``.  We follow each sub-page and resolve the
        actual PDF / image URL.
        """
        docs: list[ScrapedDocumentData] = []
        seen_urls: set[str] = set()

        doc_patterns = {
            "regulamento": "regulation",
            "cartaz": "poster",
            "termo": "terms",
        }

        # Collect candidate document page links from the event detail page
        candidates: list[tuple[str, str, str]] = []  # (full_url, doc_type, label)

        for a in soup.select(".evento-single-img a[href], .row-evento-details a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            text = a.get_text(strip=True).lower()
            for pattern, doc_type in doc_patterns.items():
                if pattern in href.lower() or pattern in text:
                    full_url = href if href.startswith("http") else f"{self.base_url}{href}"
                    if full_url not in seen_urls:
                        seen_urls.add(full_url)
                        label = a.get_text(strip=True) or href.split("/")[-1]
                        candidates.append((full_url, doc_type, label))
                    break

        # Also catch direct PDF links already on the event page
        for a in soup.select('a[href$=".pdf"]'):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href:
                continue
            full_url = href if href.startswith("http") else f"{self.base_url}{href}"
            if full_url not in seen_urls:
                seen_urls.add(full_url)
                docs.append(
                    ScrapedDocumentData(
                        original_url=full_url,
                        document_type="regulation",
                        file_name=a.get_text(strip=True) or href.split("/")[-1],
                        mime_type="application/pdf",
                    )
                )

        # For each candidate HTML sub-page, fetch it and resolve the real file URL
        for candidate_url, doc_type, label in candidates:
            resolved = await self._resolve_document_url(candidate_url)
            if resolved:
                file_url, mime = resolved
                # Avoid duplicates if the resolved URL was already captured
                if file_url not in seen_urls:
                    seen_urls.add(file_url)
                    docs.append(
                        ScrapedDocumentData(
                            original_url=file_url,
                            document_type=doc_type,
                            file_name=file_url.split("/")[-1].split("?")[0],
                            mime_type=mime,
                        )
                    )
            else:
                # Fallback: keep the HTML page URL if we can't resolve
                docs.append(
                    ScrapedDocumentData(
                        original_url=candidate_url,
                        document_type=doc_type,
                        file_name=label,
                    )
                )

        return docs

    async def _resolve_document_url(
        self, page_url: str
    ) -> tuple[str, str | None] | None:
        """Fetch a Lap2Go document sub-page and find the real file URL.

        Returns ``(file_url, mime_type)`` or ``None`` if not found.
        """
        try:
            html = await self.fetch_page(page_url)
        except Exception:
            logger.warning("Failed to fetch document page: %s", page_url)
            return None

        sub = BeautifulSoup(html, "lxml")

        # Look for links to s3.lap2go.com (PDFs or images)
        for a in sub.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if "s3.lap2go.com" in href:
                mime = self._guess_mime(href)
                return href, mime

        # Look for any direct .pdf link
        for a in sub.select('a[href$=".pdf"]'):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if href:
                full = href if href.startswith("http") else f"{self.base_url}{href}"
                return full, "application/pdf"

        # Look for iframe src (some documents are embedded in iframes)
        for iframe in sub.select("iframe[src]"):
            src = iframe.get("src", "")
            if isinstance(src, list):
                src = src[0]
            if src and (".pdf" in src or "s3.lap2go.com" in src):
                full = src if src.startswith("http") else f"{self.base_url}{src}"
                return full, self._guess_mime(src)

        return None

    @staticmethod
    def _guess_mime(url: str) -> str | None:
        """Guess MIME type from file extension in URL."""
        lower = url.lower().split("?")[0]
        if lower.endswith(".pdf"):
            return "application/pdf"
        if lower.endswith((".jpg", ".jpeg")):
            return "image/jpeg"
        if lower.endswith(".png"):
            return "image/png"
        if lower.endswith(".webp"):
            return "image/webp"
        return None

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
        if any(k in text for k in ["corrida", "run", "maratona", "meia-maratona", "atletismo", "cross"]):
            types.append("RUNNING")
        if any(k in text for k in ["caminhada", "walk", "marcha"]):
            types.append("WALKING")
        if any(k in text for k in ["btt", "bike", "ciclismo", "btт"]):
            types.append("BTT")
        if any(k in text for k in ["triatlo", "triathlon"]):
            types.append("TRIATHLON")
        if any(k in text for k in ["swim", "natação", "travessia"]):
            types.append("SWIMMING")
        if any(k in text for k in ["ocr", "obstacle", "spartan"]):
            types.append("OCR")
        if any(k in text for k in ["hyrox", "hybrid"]):
            types.append("HYROX")
        if not types:
            types.append("RUNNING")
        return types

    @staticmethod
    def _guess_distance(name: str) -> float | None:
        match = re.search(r"(\d+(?:[.,]\d+)?)\s*km", name, re.I)
        if match:
            return float(match.group(1).replace(",", "."))
        return None
