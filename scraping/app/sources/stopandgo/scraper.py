"""Stop and Go scraper — extracts events from stopandgo.net."""

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

# ── Sport-type mapping (Portuguese → enum) ───────────────────────

_SPORT_TYPE_MAP: dict[str, list[str]] = {
    "trail": ["TRAIL"],
    "atletismo": ["RUNNING"],
    "athleticism": ["RUNNING"],
    "btt": ["BTT"],
    "mtb": ["BTT"],
    "downhill mtb": ["BTT"],
    "ciclismo": ["CYCLING"],
    "cycling": ["CYCLING"],
    "gravel": ["CYCLING"],
    "provas de obstáculos": ["OCR"],
    "obstacle race": ["OCR"],
    "triathlon": ["TRIATHLON"],
    "trichallenge": ["TRIATHLON"],
    "natação": ["SWIMMING"],
    "caminhada": ["WALKING"],
    "skyrunning": ["TRAIL"],
    "urban trail": ["TRAIL"],
    "trail/btt": ["TRAIL", "BTT"],
    "tt": ["BTT"],
    "multisport": ["OTHER"],
    "canoagem": ["OTHER"],
}

# Portuguese month names for date parsing
_PT_MONTHS: dict[str, int] = {
    "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4,
    "maio": 5, "junho": 6, "julho": 7, "agosto": 8,
    "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12,
    "jan": 1, "fev": 2, "mar": 3, "abr": 4,
    "mai": 5, "jun": 6, "jul": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
    # English fallbacks
    "january": 1, "february": 2, "march": 3, "april": 4,
    "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}


def _parse_date(text: str | None) -> datetime | None:
    """Parse date strings in common formats (DD/MM/YYYY, DD/MM/YYYY HH:MM)."""
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


def _parse_pt_date(text: str) -> datetime | None:
    """Parse a Portuguese date like '22 de março 2026' or '22 mar 2026'."""
    text = text.strip().lower()
    text = text.replace(" de ", " ")
    # Match "DD month YYYY"
    m = re.match(r"(\d{1,2})\s+(\w+)\s+(\d{4})", text)
    if m:
        day_str, month_str, year_str = m.groups()
        month = _PT_MONTHS.get(month_str)
        if month:
            try:
                return datetime(int(year_str), month, int(day_str))
            except ValueError:
                pass
    return None


def _parse_price(text: str | None) -> float | None:
    """Extract numeric price from strings like '45,00 €'."""
    if not text:
        return None
    text = text.replace("\xa0", "").strip()
    if text == "-":
        return None
    match = re.search(r"(\d+[.,]\d+|\d+)", text)
    if match:
        return float(match.group(1).replace(",", "."))
    return None


@dataclass
class _ListCardInfo:
    """Pre-parsed data from a list-page event card."""

    url: str
    title: str | None = None
    sport_type_text: str | None = None
    city: str | None = None
    country: str | None = None
    image_url: str | None = None
    start_date: datetime | None = None
    end_date: datetime | None = None


class StopAndGoScraper(BaseScraper):
    source_name = "stopandgo"
    display_name = "Stop and Go"
    base_url = "https://stopandgo.net"
    description = "Timing, registrations & results platform — stopandgo.net"

    EVENTS_PER_PAGE = 15

    # ── List events ──────────────────────────────────────────────

    async def scrape(self) -> list[ScrapedEventData]:
        """Scrape all upcoming events from Stop and Go."""
        events: list[ScrapedEventData] = []
        seen_urls: set[str] = set()

        page = 1
        while True:
            url = f"{self.base_url}/events?status=S&page={page}"
            html = await self.fetch_page(url)
            soup = BeautifulSoup(html, "lxml")

            cards = self._extract_event_cards(soup)
            if not cards:
                break

            logger.info("Page %d: found %d event cards", page, len(cards))
            for card in cards:
                if card.url in seen_urls:
                    continue
                seen_urls.add(card.url)
                try:
                    ev = await self.scrape_event(card.url, card)
                    if ev:
                        events.append(ev)
                except Exception:
                    logger.exception("Failed to scrape event: %s", card.url)

            # Stop if fewer items than a full page
            if len(cards) < self.EVENTS_PER_PAGE:
                break
            page += 1

        logger.info("Total events scraped from Stop and Go: %d", len(events))
        return events

    # ── Single event ─────────────────────────────────────────────

    async def scrape_event(
        self,
        url: str,
        card: _ListCardInfo | None = None,
    ) -> ScrapedEventData | None:
        """Scrape a single Stop and Go event page."""
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        title = self._extract_title(soup)
        if not title:
            logger.warning("No title found for %s — skipping", url)
            return None

        event_id = self._extract_event_id(soup)
        location = self._extract_location(soup)
        start_date, end_date = self._extract_dates(soup)
        sport_type_text = self._extract_sport_type_text(soup)
        organizer = self._extract_organizer(soup)
        image_url = self._extract_image(soup)
        organizer_url = self._extract_organizer_url(soup)

        # Fetch sub-pages for pricing and documents
        base_event_url = url.rstrip("/")
        variants, pricing, raw_pricing_text = await self._fetch_prices(base_event_url)
        documents = await self._fetch_rules(base_event_url)

        # Enrich with list-card data
        if card:
            if not location and card.city:
                location = card.city
                if card.country:
                    location = f"{card.city}, {card.country}"
            if not start_date and card.start_date:
                start_date = card.start_date
            if not end_date and card.end_date:
                end_date = card.end_date
            if not sport_type_text and card.sport_type_text:
                sport_type_text = card.sport_type_text
            if not image_url and card.image_url:
                image_url = card.image_url

        # Parse location into city/country
        city, country = self._parse_location(location)
        sport_types = self._map_sport_types(sport_type_text, title)

        raw = {
            "url": url,
            "title": title,
            "event_id": event_id,
            "location": location,
            "sport_type_text": sport_type_text,
        }

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=event_id or self._slug_from_url(url),
            description=None,  # StopAndGo home page has no description text
            sport_types=sport_types,
            start_date=start_date,
            end_date=end_date,
            city=city,
            country=country or "Portugal",
            organizer_name=organizer,
            external_url=organizer_url,
            image_url=image_url,
            variants=variants,
            pricing_phases=pricing,
            documents=documents,
            raw_pricing_text=raw_pricing_text,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── List-page extraction ─────────────────────────────────────

    def _extract_event_cards(self, soup: BeautifulSoup) -> list[_ListCardInfo]:
        """Extract event cards from the paginated grid.

        Cards are ``<a>`` tags inside ``div.mt-10.space-y-5`` with structure:
        - Image in nested ``<img>``
        - Title in a ``div`` with ``uppercase font-bold ... font-gilroy``
        - Sport type in ``<p>`` with ``font-gobold``
        - Location ``<span>`` with ``mt-1 ml-1 inline-block``
        - Date box on the right side
        """
        cards: list[_ListCardInfo] = []

        container = soup.select_one("div.mt-10.space-y-5")
        if not container:
            return cards

        for a_tag in container.select("a[href]"):
            href = a_tag.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href or "/events/" not in href:
                continue

            full_url = href if href.startswith("http") else f"{self.base_url}{href}"

            # Title
            title_div = a_tag.select_one("div.font-gilroy.font-bold.uppercase")
            title = title_div.get_text(strip=True) if title_div else None

            # Sport type
            sport_p = a_tag.select_one("p.font-gobold")
            sport_text = sport_p.get_text(strip=True) if sport_p else None

            # Location
            loc_span = a_tag.select_one("span.ml-1.inline-block")
            loc_text = loc_span.get_text(strip=True) if loc_span else None

            # Image
            img = a_tag.select_one("img[src]")
            img_url = None
            if img:
                src = img.get("src", "")
                if isinstance(src, list):
                    src = src[0]
                if src:
                    img_url = src

            # Date boxes
            start_date, end_date = self._extract_card_dates(a_tag)

            city = None
            country = None
            if loc_text:
                city, country = self._parse_location(loc_text)

            cards.append(
                _ListCardInfo(
                    url=full_url,
                    title=title,
                    sport_type_text=sport_text,
                    city=city,
                    country=country,
                    image_url=img_url,
                    start_date=start_date,
                    end_date=end_date,
                )
            )

        return cards

    def _extract_card_dates(
        self, a_tag: Tag
    ) -> tuple[datetime | None, datetime | None]:
        """Extract start/end dates from the card's date boxes.

        Desktop view has ``div.font-gobold`` containing one or two
        date blocks with day number and month/year text.
        """
        start_date: datetime | None = None
        end_date: datetime | None = None

        date_container = a_tag.select_one("div.font-gobold.md\\:block")
        if not date_container:
            # Fallback: try mobile date text
            mobile_span = a_tag.select_one("span.font-gilroy")
            if mobile_span:
                return self._parse_date_range_text(mobile_span.get_text(strip=True))
            return None, None

        date_blocks = date_container.select("div.flex.flex-col.text-center")
        if not date_blocks:
            return None, None

        for i, block in enumerate(date_blocks[:2]):
            day_div = block.select_one("div.text-2xl.font-bold")
            month_div = block.select_one("div.text-sm.uppercase")
            if day_div and month_div:
                day_text = day_div.get_text(strip=True)
                month_text = month_div.get_text(strip=True)
                dt = _parse_pt_date(f"{day_text} {month_text}")
                if i == 0:
                    start_date = dt
                else:
                    end_date = dt

        return start_date, end_date

    def _parse_date_range_text(
        self, text: str
    ) -> tuple[datetime | None, datetime | None]:
        """Parse date range from mobile text like '26 - 29 de março 2026'
        or '22/03/2026 - 05/07/2026'.
        """
        if not text:
            return None, None

        # Try DD/MM/YYYY - DD/MM/YYYY format
        m = re.match(
            r"(\d{1,2}/\d{1,2}/\d{4})\s*-\s*(\d{1,2}/\d{1,2}/\d{4})", text
        )
        if m:
            return _parse_date(m.group(1)), _parse_date(m.group(2))

        # Try "DD - DD de month YYYY" format
        m = re.match(
            r"(\d{1,2})\s*-\s*(\d{1,2})\s+de\s+(\w+)\s+(\d{4})", text
        )
        if m:
            d1, d2, month_str, year_str = m.groups()
            month = _PT_MONTHS.get(month_str.lower())
            if month:
                try:
                    start = datetime(int(year_str), month, int(d1))
                    end = datetime(int(year_str), month, int(d2))
                    return start, end
                except ValueError:
                    pass

        # Single date: "DD de month YYYY"
        dt = _parse_pt_date(text)
        if dt:
            return dt, None

        return None, None

    # ── Detail-page extraction ───────────────────────────────────

    def _extract_title(self, soup: BeautifulSoup) -> str | None:
        """Extract event title from the detail page hero section.

        The title sits in ``<div class="... text-3xl font-bold uppercase ...
        font-gobold md:text-4xl ...">``.
        """
        div = soup.select_one(
            "div.font-gobold.font-bold.uppercase.text-white"
        )
        if div:
            return div.get_text(strip=True)
        og = soup.select_one('meta[property="og:title"]')
        if og:
            content = og.get("content")
            if isinstance(content, list):
                content = content[0]
            return content
        return None

    def _extract_event_id(self, soup: BeautifulSoup) -> str | None:
        """The event's numeric ID is in the ``title`` attr of the title div."""
        div = soup.select_one(
            "div.font-gobold.font-bold.uppercase.text-white[title]"
        )
        if div:
            tid = div.get("title")
            if isinstance(tid, list):
                tid = tid[0]
            return tid
        return None

    def _extract_location(self, soup: BeautifulSoup) -> str | None:
        """Location text below the title: ``div.font-gilroy.text-white``."""
        # The hero section has title then location
        hero = soup.select_one("div.relative.z-10")
        if hero:
            loc_div = hero.select_one(
                "div.font-gilroy.text-white"
            )
            if loc_div:
                text = loc_div.get_text(strip=True)
                if text:
                    return text
        return None

    def _extract_dates(
        self, soup: BeautifulSoup
    ) -> tuple[datetime | None, datetime | None]:
        """Extract dates from the hero section date boxes."""
        start_date: datetime | None = None
        end_date: datetime | None = None

        hero = soup.select_one("div.relative.z-10")
        if not hero:
            return None, None

        date_blocks = hero.select("div.flex.flex-col.text-center")
        for i, block in enumerate(date_blocks[:2]):
            day_div = block.select_one("div.text-2xl.font-bold")
            month_div = block.select_one("div.text-sm.uppercase")
            if day_div and month_div:
                day_text = day_div.get_text(strip=True)
                month_text = month_div.get_text(strip=True)
                dt = _parse_pt_date(f"{day_text} {month_text}")
                if i == 0:
                    start_date = dt
                else:
                    end_date = dt

        return start_date, end_date

    def _extract_sport_type_text(self, soup: BeautifulSoup) -> str | None:
        """Sport type label in the hero section (e.g. 'Trail')."""
        div = soup.select_one("div.font-gobold.text-accent, div.font-gobold.text-accent-light")
        if not div:
            # Broader search in hero
            hero = soup.select_one("div.relative.z-10")
            if hero:
                div = hero.select_one("div.font-gobold.uppercase.text-accent")
        if div:
            return div.get_text(strip=True)
        return None

    def _extract_organizer(self, soup: BeautifulSoup) -> str | None:
        """Organizer name from the info grid.

        Structure: ``<h3>Organizador</h3>`` followed by a ``<p>`` with name.
        """
        for h3 in soup.select("h3"):
            if "organizador" in h3.get_text(strip=True).lower():
                p = h3.find_next("p")
                if p:
                    return p.get_text(strip=True)
        return None

    def _extract_image(self, soup: BeautifulSoup) -> str | None:
        """Extract the event logo/poster image URL."""
        # Try the hero logo image first
        hero = soup.select_one("div.relative.z-10")
        if hero:
            img = hero.select_one("img.rounded-lg.shadow-lg[src]")
            if img:
                src = img.get("src", "")
                if isinstance(src, list):
                    src = src[0]
                if src:
                    return src
        # Fallback to OG image
        og = soup.select_one('meta[property="og:image"]')
        if og:
            content = og.get("content")
            if isinstance(content, list):
                content = content[0]
            return content
        return None

    def _extract_organizer_url(self, soup: BeautifulSoup) -> str | None:
        """Find the organizer's website link."""
        for a in soup.select("a[target='_blank'][href]"):
            sr_span = a.select_one("span.sr-only")
            if sr_span and "website" in sr_span.get_text(strip=True).lower():
                href = a.get("href", "")
                if isinstance(href, list):
                    href = href[0]
                return href
        return None

    # ── Prices sub-page ──────────────────────────────────────────

    async def _fetch_prices(
        self, base_event_url: str
    ) -> tuple[list[ScrapedVariantData], list[ScrapedPricingData], str | None]:
        """Fetch the /prices sub-page and extract variants, pricing, and raw text."""
        variants: list[ScrapedVariantData] = []
        pricing: list[ScrapedPricingData] = []

        try:
            html = await self.fetch_page(f"{base_event_url}/prices")
        except Exception:
            logger.debug("No prices page for %s", base_event_url)
            return variants, pricing, None

        soup = BeautifulSoup(html, "lxml")
        variants, pricing = self._extract_pricing_tables(soup)

        # Capture raw pricing text from ALL pricing containers
        parts: list[str] = []
        for div in soup.select("div.overflow-x-auto"):
            if div.select("table") or div.select("span.rounded-xl.border-2.uppercase"):
                text = div.get_text(separator="\n", strip=True)
                if text:
                    parts.append(text)
        if not parts:
            # Fallback: main content area
            main = soup.select_one("main") or soup.select_one(".container")
            if main:
                text = main.get_text(separator="\n", strip=True)
                if text:
                    parts.append(text)
        raw_pricing_text = "\n\n".join(parts) if parts else None

        if raw_pricing_text and len(raw_pricing_text) > 50000:
            raw_pricing_text = raw_pricing_text[:50000]

        return variants, pricing, raw_pricing_text

    def _extract_pricing_tables(
        self, soup: BeautifulSoup
    ) -> tuple[list[ScrapedVariantData], list[ScrapedPricingData]]:
        """Parse the pricing tables on the prices sub-page.

        Structure:
        - ``<span class="rounded-xl border-2 ... text-accent">Group Name</span>``
        - Followed by ``<table>`` with:
          - Header row: ``td.text-accent`` cells = phase names
          - Data rows: first ``td`` = variant name, then price ``td`` cells
        """
        variants: list[ScrapedVariantData] = []
        pricing: list[ScrapedPricingData] = []
        seen_variants: set[str] = set()

        # Find the pricing container — the one with group label spans
        content = None
        for div in soup.select("div.overflow-x-auto"):
            if div.select("span.rounded-xl.border-2.uppercase"):
                content = div
                break
        if not content:
            # Still extract registration tiers even without pricing tables
            self._extract_registration_tiers(soup, pricing)
            return variants, pricing

        tables = content.select("table")
        group_labels = content.select(
            "span.rounded-xl.border-2.uppercase"
        )

        # Pair each label with the next table
        for idx, table in enumerate(tables):
            # Try to find the group name
            group_name = None
            if idx < len(group_labels):
                group_name = group_labels[idx].get_text(strip=True)

            # Extract phase names from header
            header_row = table.select_one("tr")
            if not header_row:
                continue
            phase_names: list[str] = []
            for td in header_row.select("td.text-accent, td.text-accent-light"):
                phase_names.append(td.get_text(strip=True))

            # Extract data rows (skip header)
            data_rows = table.select("tr.border-b-2")
            for row in data_rows:
                tds = row.select("td")
                if not tds:
                    continue

                # First td = variant name
                variant_name = tds[0].get_text(strip=True)
                if not variant_name:
                    continue

                # Register variant
                name_key = variant_name.lower()
                if name_key not in seen_variants:
                    seen_variants.add(name_key)
                    variants.append(
                        ScrapedVariantData(
                            name=variant_name,
                            distance_km=self._guess_distance(variant_name),
                        )
                    )

                # Extract prices from remaining cells
                price_cells = [
                    td for td in tds[1:]
                    if "whitespace-nowrap" in " ".join(td.get("class", []))
                ]
                for i, cell in enumerate(price_cells):
                    price = _parse_price(cell.get_text(strip=True))
                    if price is not None:
                        phase_name = phase_names[i] if i < len(phase_names) else f"Fase {i + 1}"
                        note = group_name
                        pricing.append(
                            ScrapedPricingData(
                                variant_name=variant_name,
                                phase_name=phase_name,
                                price=price,
                                currency="EUR",
                                note=note,
                            )
                        )

        # Also extract registration deadline phases
        self._extract_registration_tiers(soup, pricing)

        return variants, pricing

    def _extract_registration_tiers(
        self, soup: BeautifulSoup, pricing: list[ScrapedPricingData]
    ) -> None:
        """Extract registration tier deadlines from the first table
        under 'Fases de Inscrição'.
        """
        for h1 in soup.select("h1"):
            text = h1.get_text(strip=True).lower()
            if "fases" in text and "inscri" in text:
                # The table immediately after this heading
                parent = h1.parent
                if parent:
                    table = parent.select_one("table")
                    if table:
                        for tr in table.select("tr"):
                            tds = tr.select("td")
                            if len(tds) >= 3:
                                phase = tds[0].get_text(strip=True)
                                deadline_text = tds[2].get_text(strip=True)
                                deadline = _parse_date(deadline_text)
                                if phase and deadline:
                                    # Update matching pricing phases
                                    for p in pricing:
                                        if p.phase_name and p.phase_name.lower() == phase.lower():
                                            p.end_date = deadline
                break

    # ── Rules sub-page ───────────────────────────────────────────

    async def _fetch_rules(
        self, base_event_url: str
    ) -> list[ScrapedDocumentData]:
        """Fetch the /rules sub-page and extract document download links."""
        docs: list[ScrapedDocumentData] = []
        try:
            html = await self.fetch_page(f"{base_event_url}/rules")
        except Exception:
            logger.debug("No rules page for %s", base_event_url)
            return docs

        soup = BeautifulSoup(html, "lxml")
        return self._extract_documents(soup)

    def _extract_documents(self, soup: BeautifulSoup) -> list[ScrapedDocumentData]:
        """Extract PDF download links from the rules page.

        Links are ``<a href="...pdf" download>`` elements.
        """
        docs: list[ScrapedDocumentData] = []
        seen_urls: set[str] = set()

        for a in soup.select('a[href][download]'):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if not href:
                continue

            if href not in seen_urls:
                seen_urls.add(href)
                file_name = href.split("/")[-1] if "/" in href else href
                mime_type = "application/pdf" if href.lower().endswith(".pdf") else None
                docs.append(
                    ScrapedDocumentData(
                        original_url=href,
                        document_type="regulation",
                        file_name=file_name,
                        mime_type=mime_type,
                    )
                )

        return docs

    # ── Utility ──────────────────────────────────────────────────

    @staticmethod
    def _slug_from_url(url: str) -> str | None:
        """Extract event slug from URL like /events/ultra-trail-do-marao-2026."""
        parts = url.rstrip("/").split("/")
        return parts[-1] if parts else None

    @staticmethod
    def _parse_location(text: str | None) -> tuple[str | None, str | None]:
        """Split 'City, Country' into (city, country)."""
        if not text:
            return None, None
        parts = [p.strip() for p in text.split(",")]
        if len(parts) >= 2:
            return parts[0], parts[-1]
        return parts[0], None

    @staticmethod
    def _map_sport_types(sport_text: str | None, title: str | None) -> list[str]:
        """Map Portuguese sport-type text to our enum values."""
        types: list[str] = []

        if sport_text:
            key = sport_text.strip().lower()
            if key in _SPORT_TYPE_MAP:
                types.extend(_SPORT_TYPE_MAP[key])

        # Fallback: guess from title
        if not types and title:
            text = title.lower()
            if "trail" in text or "trilho" in text:
                types.append("TRAIL")
            elif any(k in text for k in ["corrida", "maratona", "run"]):
                types.append("RUNNING")
            elif any(k in text for k in ["btt", "bike", "mtb"]):
                types.append("BTT")
            elif any(k in text for k in ["ciclismo", "cycl"]):
                types.append("CYCLING")

        if not types:
            types.append("OTHER")

        return types

    @staticmethod
    def _guess_distance(name: str) -> float | None:
        """Try to extract distance in km from variant name like 'UTME 120K'."""
        match = re.search(r"(\d+(?:[.,]\d+)?)\s*k(?:m)?\b", name, re.I)
        if match:
            return float(match.group(1).replace(",", "."))
        return None
