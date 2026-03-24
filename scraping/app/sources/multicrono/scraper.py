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
from slugify import slugify

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
    """Parse the most relevant ``DD/MM/YYYY`` date from *text*.

    Detail pages may contain dates from previous editions.  When multiple
    dates are found, prefer the earliest future date; otherwise fall back
    to the latest date overall.
    """
    now = datetime.now()
    candidates: list[datetime] = []
    for m in re.finditer(r"(\d{2})/(\d{2})/(\d{4})", text):
        try:
            candidates.append(
                datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
            )
        except ValueError:
            pass
    if not candidates:
        return None
    future = [d for d in candidates if d >= now]
    if future:
        return min(future)  # earliest upcoming date
    return max(candidates)


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
            # Deduplicate by URL or title
            dedup_key = url or card.get("title", "")
            if not dedup_key or dedup_key in seen:
                continue
            seen.add(dedup_key)
            try:
                if url:
                    ev = await self.scrape_event(url, card)
                else:
                    # No detail page — build event from listing card data only
                    ev = self._event_from_card(card)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape MultiCrono event: %s", url or card.get("title"))

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

        # Only use detail-page date as fallback (detail pages may contain
        # dates from previous editions that would overwrite the card date).
        if not start_date:
            start_date = self._extract_date(soup)

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

    def _event_from_card(self, card: dict) -> ScrapedEventData | None:
        """Build a minimal event from listing card data (no detail page)."""
        title = card.get("title")
        if not title:
            return None
        sport_types = _guess_sport_types(title, card.get("sport_text"))
        slug = slugify(title)[:200] if title else ""
        raw = {"title": title, "sport_text": card.get("sport_text"), "city": card.get("city")}
        return ScrapedEventData(
            title=title,
            source_url=f"{_LISTING_URL}#{slug}",
            source_event_id=slug,
            sport_types=sport_types,
            start_date=card.get("date"),
            city=card.get("city"),
            country="Portugal",
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── Listing helpers ──────────────────────────────────────────

    def _extract_listing_cards(self, soup: BeautifulSoup) -> list[dict]:
        """Extract event data from the Elementor-based listing.

        Each event card is a ``div.elementor-widget-wrap.elementor-element-populated``
        containing date spans (matching ``DD Mon YYYY``), title, sport type, city,
        and optionally a link to the detail page (Informações/Resultados).
        Cards marked "Informações em breve" have no detail page and are skipped.
        """
        cards: list[dict] = []
        seen_titles: set[str] = set()
        _date_re = re.compile(
            r"(\d{1,2})(?:\s*[-–]\s*\d{1,2})?\s+(Jan|Fev|Mar|Abr|Mai|Jun|Jul|Ago|Set|Out|Nov|Dez)\s+(\d{4})",
            re.I,
        )

        for wrapper in soup.select("div.elementor-widget-wrap.elementor-element-populated"):
            text_lines = [
                l.strip()
                for l in wrapper.get_text("\n").split("\n")
                if l.strip()
            ]
            if len(text_lines) < 4:
                continue

            # First line must be a date
            date_match = _date_re.match(text_lines[0])
            if not date_match:
                continue

            dt = _parse_listing_date(text_lines[0])

            # Skip "Informações em breve" — no detail page available yet
            if any(l.lower() == "informações em breve" for l in text_lines):
                logger.debug("Skipping '%s' — informações em breve", text_lines[1] if len(text_lines) > 1 else "?")
                continue

            # Lines order: date, title, sport_type, city, status_link
            title = text_lines[1] if len(text_lines) > 1 else None
            sport_text = text_lines[2] if len(text_lines) > 2 else None
            city = text_lines[3] if len(text_lines) > 3 else None

            if not title or title.lower() in ("próximos", "eventos", "circuitos", "data reservada"):
                continue

            # Deduplicate
            if title in seen_titles:
                continue
            seen_titles.add(title)

            # Extract detail URL from any link in the card
            detail_url: str | None = None
            for a_tag in wrapper.select("a[href]"):
                href = a_tag.get("href", "")
                if isinstance(href, list):
                    href = href[0]
                if href and href != "#" and "/v1/" in href:
                    detail_url = href if href.startswith("http") else urljoin(_BASE, href)
                    break

            # Skip results-only pages (past events)
            if detail_url and ("-resultados" in detail_url or "-results" in detail_url):
                continue

            cards.append({
                "url": detail_url,
                "title": title,
                "date": dt,
                "sport_text": sport_text,
                "city": city,
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
        # Try og:image first
        og = soup.find("meta", property="og:image")
        if og:
            content = og.get("content", "")
            if content:
                return content.strip()
        # Fallback: pick the first large event-specific image from wp-content/uploads
        # Skip logos, flags, thumbs, and footer images
        _skip = re.compile(r"logo|flag|bot_|thumbs/|reclamacoes", re.I)
        for img in soup.select("div.elementor-widget-image img[src]"):
            src = img.get("src", "")
            if isinstance(src, list):
                src = src[0]
            if "wp-content/uploads" not in src or _skip.search(src):
                continue
            # Accept banner or cartaz images, or any image ≥ 700px wide
            w = img.get("width", "")
            try:
                if int(w) >= 700:
                    return src
            except (ValueError, TypeError):
                pass
            if re.search(r"banner|cartaz", src, re.I):
                return src
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
