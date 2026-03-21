"""APedalar scraper — extracts cycling events from apedalar.pt.

Both apedalar.pt and acorrer.pt run on the same platform (Livewire SPA).
The shared parsing logic lives here; acorrer reuses it via subclass.
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
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)

# ── Portuguese month names for date parsing ───────────────────────

_PT_MONTHS: dict[str, int] = {
    "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4,
    "maio": 5, "junho": 6, "julho": 7, "agosto": 8,
    "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12,
    "jan": 1, "fev": 2, "mar": 3, "abr": 4,
    "mai": 5, "jun": 6, "jul": 7, "ago": 8,
    "set": 9, "out": 10, "nov": 11, "dez": 12,
}

# ── District → Country mapping (all Portugal) ────────────────────

_PT_DISTRICTS = {
    "aveiro", "beja", "braga", "bragança", "castelo branco", "coimbra",
    "évora", "faro", "guarda", "leiria", "lisboa", "portalegre",
    "porto", "santarém", "setúbal", "viana do castelo", "vila real",
    "viseu",
}


# ── Helper functions ──────────────────────────────────────────────


def _parse_pt_date(text: str | None) -> datetime | None:
    """Parse Portuguese date strings like 'Domingo, 29 de março de 2026 às 09:00'."""
    if not text:
        return None
    text = text.strip().lower()

    # Pattern: "dia, DD de mmmm de YYYY às HH:MM"
    m = re.search(
        r"(\d{1,2})\s+de\s+(\w+)\s+de\s+(\d{4})(?:\s+[àa]s?\s+(\d{1,2}):(\d{2}))?",
        text,
    )
    if m:
        day = int(m.group(1))
        month_str = m.group(2)
        year = int(m.group(3))
        month = _PT_MONTHS.get(month_str)
        if not month:
            return None
        hour = int(m.group(4)) if m.group(4) else 0
        minute = int(m.group(5)) if m.group(5) else 0
        try:
            return datetime(year, month, day, hour, minute)
        except ValueError:
            return None

    # Pattern: "DD/MM/YYYY"
    m = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})", text)
    if m:
        try:
            return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        except ValueError:
            return None

    return None


def _parse_card_date(text: str | None, year: int | None = None) -> datetime | None:
    """Parse short card dates like '29 Mar' into a datetime with guessed year."""
    if not text:
        return None
    text = text.strip().lower()
    m = re.match(r"(\d{1,2})\s+(\w+)", text)
    if not m:
        return None
    day = int(m.group(1))
    month = _PT_MONTHS.get(m.group(2))
    if not month:
        return None
    if year is None:
        year = datetime.now().year
    try:
        return datetime(year, month, day)
    except ValueError:
        return None


def _parse_price(text: str | None) -> float | None:
    """Extract price from text like '15.00€' or '15,00€'."""
    if not text:
        return None
    m = re.search(r"(\d+)[.,](\d{2})", text)
    if m:
        return float(f"{m.group(1)}.{m.group(2)}")
    m = re.search(r"(\d+)\s*€", text)
    if m:
        return float(m.group(1))
    return None


def _extract_event_id(url: str) -> str | None:
    """Extract numeric event ID from URL like '/eventos/4096/info'."""
    m = re.search(r"/eventos/(\d+)", url)
    return m.group(1) if m else None


def _parse_location(text: str | None) -> tuple[str | None, str | None]:
    """Parse location like 'Monte Do Trigo, Évora' into (city, district).
    
    Returns (city, country) — country is always 'Portugal'.
    """
    if not text:
        return None, None
    text = text.strip()
    if "," in text:
        parts = [p.strip() for p in text.rsplit(",", 1)]
        return parts[0], parts[1] if len(parts) > 1 else None
    return text, None


def _guess_sport_type(title: str, default: str = "CYCLING") -> list[str]:
    """Guess sport type from event title."""
    title_lower = title.lower() if title else ""
    types: list[str] = []
    if "btt" in title_lower or "mtb" in title_lower:
        types.append("BTT")
    if "gravel" in title_lower:
        types.append("CYCLING")
    if "cicloturismo" in title_lower:
        types.append("CYCLING")
    if "trail" in title_lower and "btt" not in title_lower:
        types.append("TRAIL")
    if "corrida" in title_lower or "running" in title_lower:
        if "RUNNING" not in types:
            types.append("RUNNING")
    if "caminhada" in title_lower:
        if "WALKING" not in types:
            types.append("WALKING")
    if "resistência" in title_lower or "resistencia" in title_lower:
        if "BTT" not in types:
            types.append("BTT")
    if "maratona" in title_lower and not types:
        types.append("BTT")
    if "raid" in title_lower and not types:
        types.append("BTT")
    if "rota" in title_lower and not types:
        types.append("BTT")
    if "passeio" in title_lower and not types:
        types.append("BTT")
    if "granfondo" in title_lower or "gran fondo" in title_lower:
        types.append("CYCLING")
    if "ultra" in title_lower and not types:
        types.append("TRAIL")
    if "cross" in title_lower and not types:
        types.append("RUNNING")
    if "night" in title_lower and not types:
        types.append("RUNNING")
    if not types:
        types.append(default)
    return types


# ── Livewire helpers ──────────────────────────────────────────────


def _extract_livewire_config(html: str) -> tuple[str | None, str | None]:
    """Extract Livewire URI and CSRF from the page."""
    m = re.search(r'livewireScriptConfig\s*=\s*({[^}]+})', html)
    if not m:
        return None, None
    try:
        config = json.loads(m.group(1).replace("\\/", "/"))
        return config.get("uri"), config.get("csrf")
    except (json.JSONDecodeError, KeyError):
        return None, None


def _extract_snapshot(html: str, component_name: str) -> str | None:
    """Extract a Livewire snapshot for a specific component from the HTML."""
    import html as html_mod
    snapshots = re.findall(r'wire:snapshot="([^"]*)"', html)
    for raw in snapshots:
        decoded = html_mod.unescape(raw)
        try:
            snap = json.loads(decoded)
            if snap.get("memo", {}).get("name") == component_name:
                return decoded
        except json.JSONDecodeError:
            continue
    return None


# ── Scraper class ─────────────────────────────────────────────────


class APedalerScraper(BaseScraper):
    source_name = "apedalar"
    display_name = "APedalar"
    base_url = "https://apedalar.pt"
    description = "Cycling / BTT event calendar — apedalar.pt"

    _EVENTS_URL = "https://apedalar.pt/eventos"
    _LIVEWIRE_COMPONENT = "frontend.provas.provas-grid"
    _ASSET_DOMAIN = r"assets\.apedalar"
    _DEFAULT_SPORT = "CYCLING"

    # ── Main scrape flow ──────────────────────────────────────

    async def scrape(self) -> list[ScrapedEventData]:
        """Scrape all upcoming events."""
        logger.info("Starting %s scrape", self.source_name)

        # Step 1: Fetch list page to get Livewire session
        client = await self._get_client()
        resp = await client.get(self._EVENTS_URL)
        resp.raise_for_status()
        page_html = resp.text
        cookies = dict(resp.cookies)

        # Step 2: Extract Livewire config and snapshot
        lw_uri, lw_csrf = _extract_livewire_config(page_html)
        snapshot = _extract_snapshot(page_html, self._LIVEWIRE_COMPONENT)

        if not lw_uri or not lw_csrf or not snapshot:
            logger.error("Failed to extract Livewire session data")
            return []

        # Step 3: Call Livewire "load" method to get event HTML
        payload = {
            "_token": lw_csrf,
            "components": [
                {
                    "snapshot": snapshot,
                    "updates": {},
                    "calls": [{"path": "", "method": "load", "params": []}],
                }
            ],
        }
        headers = {
            "Content-Type": "application/json",
            "X-Livewire": "",
            "X-CSRF-TOKEN": lw_csrf,
            "Accept": "text/html, application/xhtml+xml",
            "Referer": self._EVENTS_URL,
        }
        resp2 = await client.post(
            lw_uri, json=payload, headers=headers, cookies=cookies,
        )
        resp2.raise_for_status()
        data = resp2.json()

        # Step 4: Parse event cards from Livewire HTML
        effects_html = (
            data.get("components", [{}])[0].get("effects", {}).get("html", "")
        )
        if not effects_html:
            logger.error("No HTML in Livewire response")
            return []

        event_urls = self._extract_event_urls(effects_html)
        logger.info("Found %d event URLs on list page", len(event_urls))

        # Step 5: Scrape each event detail page
        events: list[ScrapedEventData] = []
        for url in event_urls:
            try:
                ev = await self.scrape_event(url)
                if ev:
                    events.append(ev)
            except Exception:
                logger.exception("Failed to scrape event %s", url)
        logger.info("Scraped %d events total from %s", len(events), self.source_name)
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Scrape a single event detail page."""
        html = await self.fetch_page(url)
        return self._parse_event_page(url, html)

    # ── List page parsing ─────────────────────────────────────

    @staticmethod
    def _extract_event_urls(html: str) -> list[str]:
        """Extract unique event detail URLs from the Livewire list HTML."""
        soup = BeautifulSoup(html, "lxml")
        links = soup.find_all("a", href=re.compile(r"/eventos/\d+/info"))
        seen: set[str] = set()
        urls: list[str] = []
        for link in links:
            href = link["href"]
            if href not in seen:
                seen.add(href)
                urls.append(href)
        return urls

    # ── Detail page parsing ───────────────────────────────────

    @classmethod
    def _parse_event_page(cls, url: str, html: str) -> ScrapedEventData | None:
        """Parse a complete event detail page into ScrapedEventData."""
        soup = BeautifulSoup(html, "lxml")

        # Title
        h1 = soup.find("h1")
        title = h1.get_text(strip=True) if h1 else None
        if not title:
            logger.warning("No title found for %s", url)
            return None

        event_id = _extract_event_id(url)

        # QUANDO section
        start_date = None
        registration_deadline = None
        h2_quando = soup.find("h2", string=re.compile(r"QUANDO", re.I))
        if h2_quando:
            section = h2_quando.parent
            if section:
                divs = section.find_all("div", recursive=False)
                for div in divs:
                    text = div.get_text(strip=True)
                    if "pagamento" in text.lower() or "até" in text.lower():
                        registration_deadline = _parse_pt_date(text)
                    elif not start_date:
                        start_date = _parse_pt_date(text)

        # ONDE section
        city = None
        district = None
        h2_onde = soup.find("h2", string=re.compile(r"ONDE", re.I))
        if h2_onde:
            section = h2_onde.parent
            if section:
                loc_div = section.find("div", class_=re.compile("uppercase"))
                if loc_div:
                    city, district = _parse_location(loc_div.get_text(strip=True))

        # Image
        image_url = None
        img = soup.find("img", src=re.compile(rf"{cls._ASSET_DOMAIN}.*cartaz"))
        if img:
            image_url = img.get("src")

        # Documents (REGULAMENTO, etc.)
        documents: list[ScrapedDocumentData] = []
        pdf_links = soup.find_all("a", href=re.compile(r"\.pdf", re.I))
        seen_pdfs: set[str] = set()
        for a in pdf_links:
            href = a.get("href", "")
            if href in seen_pdfs:
                continue
            seen_pdfs.add(href)
            label = a.get_text(strip=True).lower()
            doc_type = "regulation"
            if "percurso" in label or "mapa" in label:
                doc_type = "map"
            documents.append(
                ScrapedDocumentData(
                    original_url=href,
                    document_type=doc_type,
                    file_name=a.get("download") or href.rsplit("/", 1)[-1],
                    mime_type="application/pdf",
                )
            )

        # Pricing — from the Livewire price-table component rendered in HTML
        variants = cls._extract_pricing(soup, title)

        # External URL (INSCREVER link)
        external_url = None
        inscrever = soup.find("a", href=re.compile(r"/inscrever"))
        if inscrever:
            external_url = inscrever.get("href")

        # Organizer contacts
        organizer_name = None
        h2_contact = soup.find("h2", string=re.compile(r"CONTACTOS", re.I))
        if h2_contact and h2_contact.parent:
            contact_text = h2_contact.parent.get_text(strip=True)
            # Remove the heading itself
            contact_text = contact_text.replace(h2_contact.get_text(strip=True), "").strip()
            if contact_text:
                organizer_name = contact_text[:200]

        sport_types = _guess_sport_type(title, cls._DEFAULT_SPORT)

        raw_data = json.dumps({
            "title": title,
            "url": url,
            "event_id": event_id,
            "image_url": image_url,
            "city": city,
            "district": district,
        }, ensure_ascii=False)

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=event_id,
            description=None,
            sport_types=sport_types,
            start_date=start_date,
            registration_deadline=registration_deadline,
            city=city,
            country="Portugal",
            organizer_name=organizer_name,
            external_url=external_url,
            image_url=image_url,
            variants=variants,
            documents=documents,
            raw_data=raw_data,
        )

    @staticmethod
    def _extract_pricing(soup: BeautifulSoup, title: str) -> list[ScrapedVariantData]:
        """Extract pricing info from the price-table Livewire component."""
        variants: list[ScrapedVariantData] = []

        price_div = soup.find(attrs={"wire:name": "frontend.provas.price-table"})
        if not price_div:
            return variants

        # Price boxes: each is a div with class bg-agraylight containing label + price
        price_boxes = price_div.find_all(
            "div", class_=re.compile(r"bg-agraylight.*rounded")
        )
        for box in price_boxes:
            label_div = box.find("div", class_=re.compile("text-xs"))
            price_div_inner = box.find("div", class_=re.compile("text-3xl"))
            if label_div and price_div_inner:
                label = label_div.get_text(strip=True)
                price = _parse_price(price_div_inner.get_text(strip=True))
                # Only include actual race variants (skip "Almoço", "Acompanhantes")
                skip_labels = {"almoço", "acompanhantes", "almoçar", "refeição", "seguro"}
                if label.lower() not in skip_labels:
                    variants.append(
                        ScrapedVariantData(
                            name=label,
                            price=price,
                            currency="EUR",
                        )
                    )

        return variants
