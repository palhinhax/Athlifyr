"""MultiCrono scraper — extracts events from multicrono.com.

Site structure
--------------
* Listing page ``/v1/`` — "Próximos Eventos" section with cards containing
  date, title, sport type, city, and a link to the detail page.
* Detail page ``/v1/{slug}/`` — date, start time, location, description,
  organizer, registration link, regulation PDF link, Google Maps link.
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

_BASE = "https://multicrono.com"
_LISTING_URL = f"{_BASE}/v1/"

_PT_MONTHS: dict[str, int] = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4,
    "mai": 5, "jun": 6, "jul": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
}

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btrail\b|\btrilho", re.I), "TRAIL"),
    (re.compile(r"\bbtt\b|\bmtb\b|\bmountain\s*bike", re.I), "BTT"),
    (re.compile(r"\bcicl\w*\b|\bgravel\b", re.I), "CYCLING"),
    (re.compile(r"\btriathlon\b|\btriatlo\b|\bduatlo\b|\baquatlo\b", re.I), "TRIATHLON"),
    (re.compile(r"\bcorrida\b|\bmaratona\b|\bmeia[- ]maratona\b|\brun\b|\bcorta[- ]mato", re.I), "RUNNING"),
    (re.compile(r"\bcaminhada\b|\bwalk\b|\bmarcha\b", re.I), "WALKING"),
    (re.compile(r"\bnatação\b|\bswim\b|\báguas?\s*abertas?\b|\bopen\s*water", re.I), "SWIMMING"),
    (re.compile(r"\bobstáculo\b|\bocr\b", re.I), "OCR"),
]


def _parse_listing_date(text: str) -> datetime | None:
    """Parse dates like ``11 Abr 2026`` or ``23-24 Mai 2026``."""
    text = text.strip().lower()
    # Handle ranges: take the first date
    m = re.match(r"(\d{1,2})(?:\s*-\s*\d{1,2})?\s+(\w+)\s+(\d{4})", text)
    if m:
        day_s, month_s, year_s = m.groups()
        month = _PT_MONTHS.get(month_s[:3])
        if month:
            try:
                return datetime(int(year_s), month, int(day_s))
            except ValueError:
                pass
    return None


def _parse_detail_date(text: str) -> datetime | None:
    """Parse ``11/04/2026``."""
    m = re.search(r"(\d{2})/(\d{2})/(\d{4})", text)
    if m:
        try:
            return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        except ValueError:
            pass
    return None


def _parse_time(text: str) -> str | None:
    """Extract time like ``09H00`` → ``09:00``."""
    m = re.search(r"(\d{1,2})[hH](\d{2})", text)
    if m:
        return f"{m.group(1).zfill(2)}:{m.group(2)}"
    return None


def _guess_sport_types(title: str, sport_text: str | None = None) -> list[str]:
    combined = f"{title} {sport_text or ''}"
    types: list[str] = []
    for pattern, sport in _SPORT_KW:
        if pattern.search(combined) and sport not in types:
            types.append(sport)
    return types or ["OTHER"]


class MultiCronoScraper(BaseScraper):
    source_name = "multicrono"
    display_name = "MultiCrono"
    base_url = _BASE
    description = "Timing & registration platform — multicrono.com"

    async def scrape(self) -> list[ScrapedEventData]:
        html = await self.fetch_page(_LISTING_URL)
        soup = BeautifulSoup(html, "lxml")

        events: list[ScrapedEventData] = []
        seen: set[str] = set()
        now = datetime.now()

        cards = self._extract_listing_cards(soup)
        logger.info("Found %d event cards on MultiCrono", len(cards))

        for card in cards:
            # Only future events
            if card.get("date") and card["date"] < now:
                continue
            url = card.get("url")
            if not url or url in seen:
                continue
            seen.add(url)
            try:
                ev = await self.scrape_event(url, card)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape MultiCrono event: %s", url)

        logger.info("Total events scraped from MultiCrono: %d", len(events))
        return events

    async def scrape_event(
        self, url: str, card: dict | None = None,
    ) -> ScrapedEventData | None:
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        title = card.get("title") if card else None
        if not title:
            title = self._extract_title(soup)
        if not title:
            logger.warning("No title for %s — skipping", url)
            return None

        sport_text = card.get("sport_text") if card else None
        city = card.get("city") if card else None
        start_date = card.get("date") if card else None

        # Try to get richer info from detail page
        detail_date = self._extract_date(soup)
        if detail_date:
            start_date = detail_date

        start_time = self._extract_time(soup)
        detail_city = self._extract_location(soup)
        if detail_city:
            city = detail_city

        description = self._extract_description(soup)
        image_url = self._extract_image(soup)
        organizer = self._extract_organizer(soup)
        documents = self._extract_documents(soup)
        google_maps_url = self._extract_maps_url(soup)

        sport_types = _guess_sport_types(title, sport_text)
        slug = url.rstrip("/").rsplit("/", 1)[-1]

        variants: list[ScrapedVariantData] = []
        # Parse variants from description (e.g. "Trail-31km / Trail sprint-21km")
        for m in re.finditer(r"([\w\s-]+?)\s*[-–]\s*(\d+)\s*km", description or ""):
            variants.append(ScrapedVariantData(
                name=m.group(1).strip(),
                distance_km=float(m.group(2)),
                start_time=start_time,
            ))

        raw = {"url": url, "title": title, "sport_text": sport_text}

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=slug,
            description=description,
            sport_types=sport_types,
            start_date=start_date,
            city=city,
            country="Portugal",
            organizer_name=organizer,
            image_url=image_url,
            google_maps_url=google_maps_url,
            variants=variants,
            documents=documents,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── Listing helpers ──────────────────────────────────────────

    def _extract_listing_cards(self, soup: BeautifulSoup) -> list[dict]:
        """Extract event data from the 'Próximos Eventos' section."""
        cards: list[dict] = []
        # Each event card typically has an <a> with href to the detail page
        # and contains date, title, sport type, city text
        seen_urls: set[str] = set()

        # Look for links to /v1/{slug}/ pages that aren't utility pages
        skip_slugs = {
            "termos-e-condicoes", "politica-de-privacidade", "contacto",
            "servicos", "orcamento", "circuito",
        }

        for a_tag in soup.select("a[href]"):
            href = a_tag.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href or not href.startswith(("https://multicrono.com/v1/", "/v1/")):
                continue
            full_url = href if href.startswith("http") else urljoin(_BASE, href)

            # Skip non-event links
            slug = full_url.rstrip("/").rsplit("/", 1)[-1]
            if slug in skip_slugs or slug == "v1" or "-results" in slug or "-resultados" in slug or "-inscritos" in slug:
                continue

            if full_url in seen_urls:
                continue

            # Get the parent container text for context
            parent = a_tag.parent
            if not parent:
                continue

            # Try to find context in a wider container
            container = parent
            for _ in range(5):
                if container.parent and container.parent.name not in ("body", "html", "[document]"):
                    container = container.parent
                else:
                    break

            container_text = container.get_text(" ", strip=True)

            # Require some date pattern in the context
            date_match = re.search(
                r"(\d{1,2})(?:\s*[-–]\s*\d{1,2})?\s+(Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez)\s+(\d{4})",
                container_text,
                re.I,
            )
            if not date_match:
                continue

            seen_urls.add(full_url)
            date_str = date_match.group(0)
            dt = _parse_listing_date(date_str)

            # Extract title: usually the link text or nearby heading
            link_text = a_tag.get_text(strip=True)
            title = link_text if link_text and link_text.lower() not in ("informações", "resultados", "inscrições") else None
            if not title:
                # Look for headings in the container
                for h in container.find_all(["h2", "h3", "h4", "h5"]):
                    t = h.get_text(strip=True)
                    if t and t.lower() not in ("próximos eventos", "circuitos"):
                        title = t
                        break

            # Sport type and city: look for text lines in the container
            lines = [l.strip() for l in container.get_text("\n").split("\n") if l.strip()]
            sport_text = None
            city_text = None
            for line in lines:
                if line == title or line == date_str:
                    continue
                if line.lower() in ("informações", "resultados", "inscrições", "informações em breve"):
                    continue
                if not sport_text and len(line) < 50:
                    sport_text = line
                elif not city_text and len(line) < 50:
                    city_text = line

            cards.append({
                "url": full_url,
                "title": title,
                "date": dt,
                "sport_text": sport_text,
                "city": city_text,
            })

        return cards

    # ── Detail page helpers ──────────────────────────────────────

    def _extract_title(self, soup: BeautifulSoup) -> str | None:
        for tag in ("h1", "h2"):
            el = soup.find(tag)
            if el:
                text = el.get_text(strip=True)
                if text and len(text) > 3:
                    return text
        return None

    def _extract_date(self, soup: BeautifulSoup) -> datetime | None:
        text = soup.get_text(" ")
        return _parse_detail_date(text)

    def _extract_time(self, soup: BeautifulSoup) -> str | None:
        text = soup.get_text(" ")
        m = re.search(r"Início\s+da\s+Prova[:\s]*(\d{1,2})[hH](\d{2})", text)
        if m:
            return f"{m.group(1).zfill(2)}:{m.group(2)}"
        return _parse_time(text)

    def _extract_location(self, soup: BeautifulSoup) -> str | None:
        text = soup.get_text("\n")
        # Pattern: line before "(ver no mapa)"
        m = re.search(r"([^\n]+)\n\s*\(ver no mapa\)", text)
        if m:
            return m.group(1).strip()
        return None

    def _extract_description(self, soup: BeautifulSoup) -> str | None:
        # Look for main content paragraphs
        for el in soup.select("div.elementor-widget-text-editor, div.entry-content"):
            text = el.get_text(strip=True)
            if text and len(text) > 30:
                return text[:2000]
        return None

    def _extract_image(self, soup: BeautifulSoup) -> str | None:
        og = soup.find("meta", property="og:image")
        if og:
            content = og.get("content", "")
            if content:
                return content.strip()
        return None

    def _extract_organizer(self, soup: BeautifulSoup) -> str | None:
        text = soup.get_text("\n")
        m = re.search(r"Organiz(?:er|ation|ador)[:\s]*\n?\s*(.+?)(?:\n|E-mail|Telefone)", text, re.I)
        if m:
            return m.group(1).strip()
        return None

    def _extract_documents(self, soup: BeautifulSoup) -> list[ScrapedDocumentData]:
        docs: list[ScrapedDocumentData] = []
        for a in soup.select("a[href]"):
            text = a.get_text(strip=True).lower()
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if "regulamento" in text and href and href.endswith(".pdf"):
                docs.append(ScrapedDocumentData(
                    original_url=urljoin(_BASE, href),
                    document_type="regulation",
                    file_name=href.rsplit("/", 1)[-1],
                    mime_type="application/pdf",
                ))
        return docs

    def _extract_maps_url(self, soup: BeautifulSoup) -> str | None:
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if "maps.app.goo.gl" in href or "google.com/maps" in href:
                return href
        return None
