"""Correr Por Prazer scraper — extracts events from correrporprazer.com."""

from __future__ import annotations

import json
import logging
import re
from datetime import datetime

from bs4 import BeautifulSoup

from app.sources.base.scraper import (
    BaseScraper,
    ScrapedDocumentData,
    ScrapedEventData,
    ScrapedPricingData,
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)


def _parse_date(text: str | None) -> datetime | None:
    """Parse common date formats from Correr Por Prazer."""
    if not text:
        return None
    text = text.strip()
    for fmt in (
        "%d/%m/%Y",
        "%d-%m-%Y",
        "%Y-%m-%d",
        "%d de %B de %Y",
        "%d %B %Y",
    ):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


def _parse_price(text: str | None) -> float | None:
    if not text:
        return None
    match = re.search(r"(\d+[.,]\d+|\d+)", text.replace("\xa0", ""))
    if match:
        return float(match.group(1).replace(",", "."))
    return None


class CorrerPorPrazerScraper(BaseScraper):
    source_name = "correr_por_prazer"
    display_name = "Correr Por Prazer"
    base_url = "https://correrporprazer.com"
    description = "Trail & running event calendar — correrporprazer.com"

    # ── List events ──────────────────────────────────────────────

    async def scrape(self) -> list[ScrapedEventData]:
        """Scrape the events listing from correrporprazer.com."""
        events: list[ScrapedEventData] = []
        html = await self.fetch_page(f"{self.base_url}/events/")
        soup = BeautifulSoup(html, "lxml")

        event_links = self._extract_event_links(soup)
        logger.info(
            "Found %d event links on Correr Por Prazer", len(event_links)
        )

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
        html = await self.fetch_page(url)
        soup = BeautifulSoup(html, "lxml")

        title = self._extract_title(soup)
        if not title:
            logger.warning("No title for %s — skipping", url)
            return None

        description = self._extract_description(soup)
        city = self._extract_city(soup)
        date_text = self._extract_date(soup)
        organizer = self._extract_organizer(soup)
        site = self._extract_site(soup)
        variants = self._extract_variants(soup)
        documents = self._extract_documents(soup, url)

        raw = {"url": url, "title": title, "date_text": date_text}

        return ScrapedEventData(
            title=title,
            source_url=url,
            source_event_id=self._slug_from_url(url),
            description=description,
            sport_types=self._guess_sport_types(title, description),
            start_date=_parse_date(date_text),
            city=city,
            country="Portugal",
            organizer_name=organizer,
            external_url=site or url,
            variants=variants,
            documents=documents,
            raw_data=json.dumps(raw, ensure_ascii=False, default=str),
        )

    # ── Private helpers ──────────────────────────────────────────

    def _extract_event_links(self, soup: BeautifulSoup) -> list[str]:
        links: list[str] = []
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if isinstance(href, list):
                href = href[0]
            if "/events/" in href and href.count("/") > 3:
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
            return content[0] if isinstance(content, list) else content
        return None

    def _extract_description(self, soup: BeautifulSoup) -> str | None:
        for sel in (
            ".event-description",
            ".entry-content",
            "article .content",
            ".description",
        ):
            el = soup.select_one(sel)
            if el:
                return el.get_text(separator="\n", strip=True)
        return None

    def _extract_city(self, soup: BeautifulSoup) -> str | None:
        for label in soup.find_all(
            string=re.compile(r"Local|Cidade|City|Location", re.I)
        ):
            parent = label.parent
            if parent:
                sibling = parent.find_next_sibling()
                if sibling:
                    return sibling.get_text(strip=True).split(",")[0].strip()
        return None

    def _extract_date(self, soup: BeautifulSoup) -> str | None:
        for label in soup.find_all(string=re.compile(r"Data|Date", re.I)):
            parent = label.parent
            if parent:
                sibling = parent.find_next_sibling()
                if sibling:
                    return sibling.get_text(strip=True)
        return None

    def _extract_organizer(self, soup: BeautifulSoup) -> str | None:
        for label in soup.find_all(
            string=re.compile(r"Organiza[çc]|Organizer", re.I)
        ):
            parent = label.parent
            if parent:
                sibling = parent.find_next_sibling()
                if sibling:
                    return sibling.get_text(strip=True)
        return None

    def _extract_site(self, soup: BeautifulSoup) -> str | None:
        for label in soup.find_all(string=re.compile(r"^Site$|Website", re.I)):
            parent = label.parent
            if parent:
                link = parent.find_next("a", href=True)
                if link:
                    href = link.get("href", "")
                    return href[0] if isinstance(href, list) else href
        return None

    def _extract_variants(self, soup: BeautifulSoup) -> list[ScrapedVariantData]:
        variants: list[ScrapedVariantData] = []
        seen: set[str] = set()

        # Look for distance mentions in headings/tables
        for el in soup.select("h2, h3, h4, th, .race-title, .distance"):
            text = el.get_text(strip=True)
            if text and len(text) > 2 and text.lower() not in seen:
                dist = self._guess_distance(text)
                if dist is not None:
                    seen.add(text.lower())
                    variants.append(ScrapedVariantData(name=text, distance_km=dist))

        return variants

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
            full = href if href.startswith("http") else f"{self.base_url}{href}"
            name = a.get_text(strip=True) or href.split("/")[-1]
            docs.append(
                ScrapedDocumentData(
                    original_url=full,
                    document_type="regulation",
                    file_name=name,
                    mime_type="application/pdf",
                )
            )
        return docs

    @staticmethod
    def _slug_from_url(url: str) -> str | None:
        parts = url.rstrip("/").split("/")
        return parts[-1] if parts else None

    @staticmethod
    def _guess_sport_types(title: str | None, desc: str | None) -> list[str]:
        text = f"{title or ''} {desc or ''}".lower()
        types: list[str] = []
        if any(k in text for k in ["trail", "trilho", "ultra"]):
            types.append("TRAIL")
        if any(k in text for k in ["corrida", "run", "km", "atletismo"]):
            types.append("RUNNING")
        if any(k in text for k in ["caminhada", "walk", "marcha"]):
            types.append("WALKING")
        if not types:
            types.append("RUNNING")
        return types

    @staticmethod
    def _guess_distance(text: str) -> float | None:
        m = re.search(r"(\d+(?:[.,]\d+)?)\s*km", text, re.I)
        if m:
            return float(m.group(1).replace(",", "."))
        return None
