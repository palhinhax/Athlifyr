"""WeRun scraper.

Scrapes events from werun.pt — a running-events company organising
road races, trail runs, triathlon and cycling events around Lisbon
and the Seixal / Almada area.

The events listing uses ``.panel.event-listing`` cards.  Each card links
to a detail page which contains full description, location, variants
with distances, pricing phases, PDF documents, registration URL, and
organizer info inside a ``.container.event-content.main-content`` section.
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
    ScrapedPricingData,
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)

_BASE = "https://werun.pt"
_EVENTS_URL = f"{_BASE}/eventos/"

# ── Helpers ──────────────────────────────────────────────────────

_PT_MONTHS: dict[str, int] = {
    "jan": 1, "fev": 2, "mar": 3, "abr": 4,
    "mai": 5, "jun": 6, "jul": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
}

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btrail\b|\btrilho", re.I), "TRAIL"),
    (re.compile(r"triat(?:lo|hlon|lhon)\b", re.I), "TRIATHLON"),
    (re.compile(r"\bcorrida\b|\bmaratona\b|\bmeia[- ]maratona\b|\bcorre\s+praia\b|\bgp\b|\bgpa\b", re.I), "RUNNING"),
    (re.compile(r"\bpedalada\b|\bciclismo\b|\bbtt\b|\bbike\b", re.I), "CYCLING"),
    (re.compile(r"\bcaminhada\b|\bwalk\b", re.I), "WALKING"),
]


def _parse_card_date(day: str | None, month: str | None) -> datetime | None:
    """Parse date from .day / .month divs (no year — assume current)."""
    if not day or not month:
        return None
    try:
        m = _PT_MONTHS.get(month.lower().strip()[:3])
        if not m:
            return None
        year = datetime.now().year
        return datetime(year, m, int(day.strip()))
    except (ValueError, TypeError):
        return None


def _guess_sport_types(title: str) -> list[str]:
    """Derive sport types from title text."""
    types: list[str] = []
    for pattern, sport in _SPORT_KW:
        if pattern.search(title) and sport not in types:
            types.append(sport)
    return types or ["OTHER"]


def _parse_price(text: str | None) -> float | None:
    """Extract numeric price from strings like '15€' or '10,50€'."""
    if not text:
        return None
    text = text.replace("\xa0", "").strip()
    m = re.search(r"(\d+(?:[.,]\d+)?)", text)
    if m:
        return float(m.group(1).replace(",", "."))
    return None


def _parse_date_str(text: str) -> datetime | None:
    """Parse date from strings like 'até 31/01', '12/jan', '02/mar'."""
    if not text:
        return None
    # Try DD/MM/YYYY
    for fmt in ("%d/%m/%Y", "%d-%m-%Y"):
        try:
            return datetime.strptime(text.strip(), fmt)
        except ValueError:
            pass
    # Try "31/01" or "12/jan" (no year)
    m = re.search(r"(\d{1,2})[/\-](\d{1,2}|\w{3})", text)
    if m:
        day_s, month_s = m.group(1), m.group(2)
        try:
            if month_s.isdigit():
                return datetime(datetime.now().year, int(month_s), int(day_s))
            else:
                mo = _PT_MONTHS.get(month_s.lower()[:3])
                if mo:
                    return datetime(datetime.now().year, mo, int(day_s))
        except ValueError:
            pass
    return None


# ── Scraper class ────────────────────────────────────────────────


class WeRunScraper(BaseScraper):
    source_name = "werun"
    display_name = "We Run"
    base_url = _BASE
    description = "Running events company — road races, trail & triathlon — werun.pt"

    async def scrape(self) -> list[ScrapedEventData]:
        cards = await self._fetch_cards()
        logger.info("Found %d upcoming events on WeRun", len(cards))
        events: list[ScrapedEventData] = []
        for card in cards:
            try:
                ev = await self._scrape_detail(card)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape event: %s", card.get("url"))
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        card = {"url": url, "slug": url.rstrip("/").rsplit("/", 1)[-1]}
        return await self._scrape_detail(card)

    # ── Card fetching ────────────────────────────────────────────

    async def _fetch_cards(self) -> list[dict]:
        """Parse event cards from the events page."""
        html = await self.fetch_page(_EVENTS_URL)
        soup = BeautifulSoup(html, "lxml")
        cards: list[dict] = []
        seen_slugs: set[str] = set()

        for panel in soup.select(".panel.event-listing"):
            link = panel.select_one("a[href*='/eventos/']")
            if not link:
                continue
            href = link.get("href", "")
            if href in ("/eventos/", f"{_BASE}/eventos/"):
                continue
            slug = href.rstrip("/").rsplit("/", 1)[-1]
            if slug in seen_slugs:
                continue
            seen_slugs.add(slug)

            # Title
            h3 = panel.select_one("h3")
            title = h3.get_text(strip=True) if h3 else None

            # Time
            time_el = panel.select_one(".time")
            time_str = time_el.get_text(strip=True) if time_el else None

            # Date
            date_el = panel.select_one(".event-date")
            day_el = date_el.select_one(".day") if date_el else None
            month_el = date_el.select_one(".month") if date_el else None
            day = day_el.get_text(strip=True) if day_el else None
            month = month_el.get_text(strip=True) if month_el else None

            # Image
            img = panel.select_one("img.img-responsive")
            image_url = None
            if img and img.get("src"):
                src = img["src"]
                if not src.startswith("http"):
                    src = f"{_BASE}{src}"
                image_url = src

            full_url = href if href.startswith("http") else f"{_BASE}{href}"

            cards.append({
                "slug": slug,
                "url": full_url,
                "title": title,
                "day": day,
                "month": month,
                "time": time_str,
                "image_url": image_url,
            })

        return cards

    # ── Detail page scraping ─────────────────────────────────────

    async def _scrape_detail(self, card: dict) -> ScrapedEventData | None:
        """Fetch the detail page and extract all available data."""
        url = card["url"]
        try:
            html = await self.fetch_page(url)
        except Exception:
            logger.warning("Failed to fetch detail page: %s — using card data", url)
            return self._build_event_from_card(card)

        soup = BeautifulSoup(html, "lxml")

        # Title
        h1 = soup.select_one("h1")
        title = h1.get_text(strip=True) if h1 else card.get("title")
        if not title:
            return None

        slug = card.get("slug") or url.rstrip("/").rsplit("/", 1)[-1]

        # City from sidebar .local div
        city = self._extract_city(soup)

        # Date from card (detail page sidebar only has day/month)
        start_date = _parse_card_date(card.get("day"), card.get("month"))
        if not start_date:
            # Try from sidebar
            sidebar_date = soup.select_one(".event-date")
            if sidebar_date:
                day_el = sidebar_date.select_one(".day")
                month_el = sidebar_date.select_one(".month")
                if day_el and month_el:
                    start_date = _parse_card_date(
                        day_el.get_text(strip=True),
                        month_el.get_text(strip=True),
                    )

        # Description
        description = self._extract_description(soup)

        # Organizer
        organizer = self._extract_organizer(soup, description)

        # Image — poster or card image
        image_url = self._extract_image(soup) or card.get("image_url")

        # Registration URL
        registration_url = self._extract_registration_url(soup)

        # Variants + Pricing
        variants, pricing, raw_pricing_text = self._extract_variants_and_pricing(soup)

        # Documents (PDFs)
        documents = self._extract_documents(soup)

        sport_types = _guess_sport_types(title)

        raw = {
            "url": url,
            "title": title,
            "city": city,
            "time": card.get("time"),
        }

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
            external_url=registration_url,
            image_url=image_url,
            variants=variants,
            pricing_phases=pricing,
            documents=documents,
            raw_pricing_text=raw_pricing_text,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    def _build_event_from_card(self, card: dict) -> ScrapedEventData | None:
        """Fallback: build event from listing card only."""
        title = card.get("title")
        if not title:
            return None
        return ScrapedEventData(
            title=title,
            source_url=card["url"],
            source_event_id=card.get("slug"),
            sport_types=_guess_sport_types(title),
            start_date=_parse_card_date(card.get("day"), card.get("month")),
            image_url=card.get("image_url"),
            raw_data=json.dumps(card, ensure_ascii=False, default=str),
        )

    # ── Detail extraction helpers ────────────────────────────────

    @staticmethod
    def _extract_city(soup: BeautifulSoup) -> str | None:
        """City from the sidebar ``.local`` div."""
        local = soup.select_one(".local")
        if local:
            text = local.get_text(strip=True)
            if text:
                return text
        return None

    @staticmethod
    def _extract_description(soup: BeautifulSoup) -> str | None:
        """Extract all meaningful text from .event-content (including accordion panels)."""
        mc = soup.select_one(".container.event-content.main-content")
        if not mc:
            return None
        # Remove scripts/styles
        for tag in mc.select("script, style"):
            tag.decompose()

        full_text = mc.get_text(separator="\n", strip=True)
        # Filter out junk lines
        skip = {".", "inscreva-se já!", "inscreva-se já", "enable javascript to view protected content."}
        lines: list[str] = []
        for line in full_text.split("\n"):
            line = line.strip()
            if not line or len(line) < 3 or line.lower() in skip:
                continue
            lines.append(line)
        return "\n".join(lines) if lines else None

    @staticmethod
    def _extract_organizer(soup: BeautifulSoup, description: str | None) -> str | None:
        """Try to find the organizer from description or page text."""
        text = description or ""
        if not text:
            mc = soup.select_one(".container.event-content.main-content")
            if mc:
                text = mc.get_text()
        m = re.search(
            r"(?:organiz(?:ad[oa]|ação)|promovid[oa]).*?(?:por|pelo|pela)\s*(.{10,120}?)(?:[,.]|\s+com\s)",
            text, re.I | re.DOTALL,
        )
        if m:
            return m.group(1).strip()
        return None

    @staticmethod
    def _extract_image(soup: BeautifulSoup) -> str | None:
        """Extract poster image from the detail page."""
        poster = soup.select_one(".poster img[src]")
        if poster:
            src = poster.get("src", "")
            if src:
                return src if src.startswith("http") else f"{_BASE}{src}"
        og = soup.select_one('meta[property="og:image"]')
        if og:
            content = og.get("content")
            if isinstance(content, list):
                content = content[0]
            return content
        return None

    @staticmethod
    def _extract_registration_url(soup: BeautifulSoup) -> str | None:
        """Find the external registration link (admeus.org etc.)."""
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            text = a.get_text(strip=True).lower()
            if ("inscr" in text or "regist" in text) and href.startswith("http") and "werun.pt" not in href:
                return href
        return None

    @staticmethod
    def _extract_variants_and_pricing(
        soup: BeautifulSoup,
    ) -> tuple[list[ScrapedVariantData], list[ScrapedPricingData], str | None]:
        """Extract variants and pricing from the pricing table.

        The pricing table has phase names in row 0 (td), phase date
        ranges in row 1, and variant name + prices in subsequent rows.
        """
        variants: list[ScrapedVariantData] = []
        pricing: list[ScrapedPricingData] = []
        seen_names: set[str] = set()

        # Find the pricing table — first table with € signs
        pricing_table: Tag | None = None
        for table in soup.select("table"):
            text = table.get_text()
            if "€" in text:
                # Skip prize-money tables (they have "1.º", "2.º" etc.)
                first_col_texts = [
                    td.get_text(strip=True)
                    for td in table.select("tr td:first-child")
                ]
                if any(re.match(r"^\d+\.\s*º", t) for t in first_col_texts):
                    continue
                pricing_table = table
                break

        if not pricing_table:
            return variants, pricing, None

        # Capture raw pricing text for AI
        raw_pricing_text = pricing_table.get_text(separator="\n", strip=True)
        if raw_pricing_text and len(raw_pricing_text) > 50000:
            raw_pricing_text = raw_pricing_text[:50000]

        rows = pricing_table.select("tr")
        if len(rows) < 3:
            return variants, pricing, raw_pricing_text

        # Row 0: phase names (e.g. "1.ª fase", "2.ª fase", ...)
        phase_names: list[str] = []
        for cell in rows[0].select("td, th"):
            text = cell.get_text(strip=True)
            if text:
                phase_names.append(text)
        # Remove first empty column header if present
        if phase_names and not phase_names[0]:
            phase_names.pop(0)

        # Row 1: phase date ranges (e.g. "até 11/jan", "12/jan a 01/mar")
        phase_dates: list[str] = []
        for cell in rows[1].select("td, th"):
            text = cell.get_text(strip=True)
            if text:
                phase_dates.append(text)
        if phase_dates and not phase_dates[0]:
            phase_dates.pop(0)

        # Remaining rows: variant name + prices
        for row in rows[2:]:
            cells = row.select("td, th")
            if not cells:
                continue
            variant_name = cells[0].get_text(strip=True)
            if not variant_name or variant_name.startswith("*"):
                continue
            # Skip rows where the "name" is actually a price (e.g. "5€ *")
            if "€" in variant_name:
                continue

            # Extract distance from variant name
            distance = None
            dist_match = re.search(r"(\d+(?:[.,]\d+)?)\s*[Kk]m", variant_name)
            if dist_match:
                distance = float(dist_match.group(1).replace(",", "."))
            elif "meia" in variant_name.lower() and "maratona" in variant_name.lower():
                distance = 21.097

            name_key = variant_name.lower()
            if name_key not in seen_names:
                seen_names.add(name_key)
                variants.append(
                    ScrapedVariantData(name=variant_name, distance_km=distance)
                )

            # Prices per phase
            for i, cell in enumerate(cells[1:]):
                price = _parse_price(cell.get_text(strip=True))
                if price is not None:
                    phase_name = phase_names[i] if i < len(phase_names) else f"Fase {i + 1}"
                    phase_end = None
                    if i < len(phase_dates):
                        phase_end = _parse_date_str(phase_dates[i])

                    pricing.append(
                        ScrapedPricingData(
                            variant_name=variant_name,
                            phase_name=phase_name,
                            end_date=phase_end,
                            price=price,
                            currency="EUR",
                        )
                    )

        return variants, pricing, raw_pricing_text

    @staticmethod
    def _extract_documents(soup: BeautifulSoup) -> list[ScrapedDocumentData]:
        """Extract PDF document links from the detail page."""
        docs: list[ScrapedDocumentData] = []
        seen: set[str] = set()

        for a in soup.select('a[href$=".pdf"]'):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href:
                continue
            full_url = href if href.startswith("http") else f"{_BASE}{href}"
            if full_url in seen:
                continue
            seen.add(full_url)

            text = a.get_text(strip=True).lower()
            # Determine document type from link text
            if "regulamento" in text:
                doc_type = "regulation"
            elif "guia" in text:
                doc_type = "guide"
            elif "inscri" in text or "listagem" in text:
                doc_type = "registration_list"
            elif "cartaz" in text or "poster" in text:
                doc_type = "poster"
            else:
                doc_type = "other"

            docs.append(
                ScrapedDocumentData(
                    original_url=full_url,
                    document_type=doc_type,
                    file_name=a.get_text(strip=True) or href.split("/")[-1],
                    mime_type="application/pdf",
                )
            )

        return docs
