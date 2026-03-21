"""Source registry — central place to discover available scrapers."""

from __future__ import annotations

from app.sources.base.scraper import BaseScraper
from app.sources.correr_por_prazer.scraper import CorrerPorPrazerScraper
from app.sources.lap2go.scraper import Lap2GoScraper

# Register new scrapers here ↓
_SCRAPERS: dict[str, type[BaseScraper]] = {
    "lap2go": Lap2GoScraper,
    "correr_por_prazer": CorrerPorPrazerScraper,
}


def get_scraper(source_name: str) -> BaseScraper:
    """Instantiate a scraper by source name."""
    cls = _SCRAPERS.get(source_name)
    if cls is None:
        raise ValueError(
            f"Unknown source: {source_name!r}. "
            f"Available: {list(_SCRAPERS.keys())}"
        )
    return cls()


def list_sources() -> list[dict[str, str]]:
    """Return metadata for every registered scraper."""
    result: list[dict[str, str]] = []
    for cls in _SCRAPERS.values():
        result.append(
            {
                "name": cls.source_name,
                "display_name": cls.display_name,
                "base_url": cls.base_url,
                "description": cls.description,
            }
        )
    return result
