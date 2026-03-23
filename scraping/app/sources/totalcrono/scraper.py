"""TotalCrono scraper — extracts events from totalcrono.pt.

Google Sites-based page. All events are listed on a single page
``/eventos`` with date (DD-MM-YYYY), city, and link to detail page.
Many are past events — we filter to keep only future ones.

Detail pages are simple Google Sites pages with minimal structure.
"""

from __future__ import annotations

import json
import logging
import re
from datetime import datetime
from urllib.parse import parse_qs, urljoin, urlparse

from bs4 import BeautifulSoup

from app.sources.base.scraper import (
    BaseScraper,
    ScrapedDocumentData,
    ScrapedEventData,
)

logger = logging.getLogger(__name__)

_BASE = "https://www.totalcrono.pt"
_LISTING_URL = f"{_BASE}/eventos"

_SPORT_KW: list[tuple[re.Pattern[str], str]] = [
    (re.compile(r"\btrail\b|\btrilho", re.I), "TRAIL"),
    (re.compile(r"\bbtt\b|\bmtb\b|\braid\s*btt", re.I), "BTT"),
    (re.compile(r"\bcicl\w*\b|\bgravel\b", re.I), "CYCLING"),
    (re.compile(r"\btriathlon\b|\btriatlo\b|\bduatlo\b|\bxterra\b", re.I), "TRIATHLON"),
    (re.compile(r"\bcorrida\b|\bmaratona\b|\bmeia[- ]maratona\b|\brun\b|\bsão\s*silvestre", re.I), "RUNNING"),
    (re.compile(r"\bcaminhada\b|\bwalk\b|\bmarcha\b|\bneon\s*run", re.I), "WALKING"),
    (re.compile(r"\bnatação\b|\bswim\b", re.I), "SWIMMING"),
    (re.compile(r"\bobstáculo\b|\bocr\b|\bfireman", re.I), "OCR"),
]


def _parse_date(text: str) -> datetime | None:
    """Parse ``29-09-2024`` or ``01 e 02-07-2023`` (takes first date)."""
    text = text.strip()
    # Simple DD-MM-YYYY
    m = re.match(r"(\d{1,2})-(\d{2})-(\d{4})", text)
    if m:
        try:
            return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        except ValueError:
            pass
    # Range: "08 e 09-10-2022" or "01 e 02-07-2023"
    m = re.match(r"(\d{1,2})\s+e\s+\d{1,2}-(\d{2})-(\d{4})", text)
    if m:
        try:
            return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        except ValueError:
            pass
    # Range with "a": "01-05-2021 a 16-05-2021"
    m = re.match(r"(\d{1,2})-(\d{2})-(\d{4})\s+a\s+", text)
    if m:
        try:
            return datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)))
        except ValueError:
            pass
    return None


def _guess_sport_types(title: str) -> list[str]:
    types: list[str] = []
    for pattern, sport in _SPORT_KW:
        if pattern.search(title) and sport not in types:
            types.append(sport)
    return types or ["OTHER"]


class TotalCronoScraper(BaseScraper):
    source_name = "totalcrono"
    display_name = "TotalCrono"
    base_url = _BASE
    description = "Timing platform — totalcrono.pt"

    async def scrape(self) -> list[ScrapedEventData]:
        html = await self.fetch_page(_LISTING_URL)
        soup = BeautifulSoup(html, "lxml")

        events: list[ScrapedEventData] = []
        now = datetime.now()

        cards = self._extract_listing_cards(soup)
        logger.info("Found %d event entries on TotalCrono", len(cards))

        for card in cards:
            dt = card.get("date")
            if not dt or dt < now:
                continue

            title = card.get("title")
            if not title:
                continue

            url = card.get("url", "")
            city = card.get("city")
            sport_types = _guess_sport_types(title)
            slug = url.rstrip("/").rsplit("/", 1)[-1] if url else title.lower().replace(" ", "-")

            # Enrich from detail page
            description = None
            image_url = None
            documents: list[ScrapedDocumentData] = []
            if url:
                try:
                    detail_html = await self.fetch_page(url)
                    detail_soup = BeautifulSoup(detail_html, "lxml")
                    description = self._extract_description(detail_soup)
                    image_url = self._extract_image(detail_soup)
                    documents = self._extract_documents(detail_soup)
                except Exception:
                    logger.exception("TotalCrono: failed to fetch detail page %s", url)

            raw = {"url": url, "title": title, "city": city}

            events.append(ScrapedEventData(
                title=title,
                source_url=url or _LISTING_URL,
                source_event_id=slug,
                sport_types=sport_types,
                start_date=dt,
                city=city,
                country="Portugal",
                description=description,
                image_url=image_url,
                documents=documents,
                raw_data=json.dumps(raw, ensure_ascii=False, default=str),
            ))

        logger.info("Total future events from TotalCrono: %d", len(events))
        return events

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Not used — enrichment happens inline in scrape()."""
        return None

    # ── Detail page helpers ──────────────────────────────────────

    def _extract_description(self, soup: BeautifulSoup) -> str | None:
        """Extract event description from the main content area.

        Google Sites stores page content in ``div.tyJCtd`` containers.
        We pick the longest one that looks like real content.
        """
        best = ""
        for el in soup.select("div.tyJCtd"):
            text = el.get_text("\n", strip=True)
            if len(text) > len(best):
                best = text
        return best[:3000] if best else None

    def _extract_image(self, soup: BeautifulSoup) -> str | None:
        """Extract the event-specific image from the detail page.

        Google Sites pages have:
        - og:image — site-wide default (same for every page)
        - Body images — [0]/[1] are og:image duplicates, last is
          a shared footer, and in between is the event-specific image.

        Strategy: collect unique googleusercontent image URLs, skip the
        og:image URL and any duplicates, return the first remaining one.
        """
        og = soup.find("meta", property="og:image")
        og_src = (og.get("content", "") or "").strip() if og else ""

        seen: set[str] = set()
        for img in soup.select("img[src*=googleusercontent]"):
            src = (img.get("src", "") or "").strip()
            if not src or src in seen or src == og_src:
                continue
            seen.add(src)
            return src
        # Fallback: use og:image if nothing else found
        return og_src or None

    def _extract_documents(self, soup: BeautifulSoup) -> list[ScrapedDocumentData]:
        """Extract PDF / regulation documents from the detail page.

        Links on Google Sites are typically wrapped in a redirect:
        ``https://www.google.com/url?q=<real_url>&sa=D&...``
        We unwrap those to get the real PDF URL.
        """
        docs: list[ScrapedDocumentData] = []
        seen: set[str] = set()
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            text = a.get_text(strip=True).lower()

            # Only interested in PDF links or links labelled "regulamento"
            if ".pdf" not in href.lower() and "regulamento" not in text:
                continue

            # Unwrap Google redirect
            real_url = href
            if "google.com/url" in href:
                parsed = parse_qs(urlparse(href).query)
                candidates = parsed.get("q", [])
                if candidates:
                    real_url = candidates[0]

            if real_url in seen:
                continue
            seen.add(real_url)

            file_name = real_url.rsplit("/", 1)[-1] if "/" in real_url else None
            docs.append(ScrapedDocumentData(
                original_url=real_url,
                document_type="regulation",
                file_name=file_name,
            ))
        return docs

    # ── Listing helpers ──────────────────────────────────────────

    def _extract_listing_cards(self, soup: BeautifulSoup) -> list[dict]:
        """Extract events from the Google Sites listing.

        Each event is a card wrapper (``div.LS81yb``) whose direct children
        contain, in order: title, date (DD-MM-YYYY), city, and an "Evento"
        button that links to the detail page.

        We find each "Evento" link, walk up to the card wrapper, and pull
        the text blocks from its children.
        """
        cards: list[dict] = []

        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if a.get_text(strip=True) != "Evento":
                continue

            full_url = href if href.startswith("http") else urljoin(_BASE, href)
            if "totalcrono.pt" not in full_url and not href.startswith("/eventos/"):
                continue
            if href.startswith("/eventos/"):
                full_url = urljoin(_BASE, href)
            # Skip past-events section
            if "/decorridos" in full_url:
                continue

            # Walk up to the card wrapper (div.LS81yb or equivalent with ≥3
            # direct children that carry title / date / city / button).
            card = a
            for _ in range(15):
                card = card.parent
                if card is None or card.name in ("body", "html", "[document]"):
                    card = None
                    break
                children_texts = []
                for child in card.children:
                    if hasattr(child, "get_text"):
                        t = child.get_text(strip=True)
                        if t:
                            children_texts.append(t)
                if len(children_texts) >= 3 and any(
                    _parse_date(t) for t in children_texts
                ):
                    break
            else:
                card = None

            title: str | None = None
            date_dt: datetime | None = None
            city: str | None = None

            if card is not None:
                # Collect non-empty text from direct children (order: title, date, city, "Evento")
                parts: list[str] = []
                for child in card.children:
                    if hasattr(child, "get_text"):
                        t = child.get_text(strip=True)
                        if t:
                            parts.append(t)

                for t in parts:
                    if t == "Evento":
                        continue
                    dt = _parse_date(t)
                    if dt:
                        date_dt = dt
                    elif date_dt is None and title is None:
                        title = t
                    elif date_dt is not None and city is None:
                        city = t

            # Fallback title from URL slug
            if not title:
                slug = href.rstrip("/").rsplit("/", 1)[-1]
                title = slug.replace("-", " ").replace("_", " ").title() if slug else None

            cards.append({
                "url": full_url,
                "title": title,
                "date": date_dt,
                "city": city,
            })

        return cards
