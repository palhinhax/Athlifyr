"""Tests for source registry."""

from app.sources.registry import get_scraper, list_sources


def test_list_sources_returns_all() -> None:
    sources = list_sources()
    names = [s["name"] for s in sources]
    assert "lap2go" in names
    assert "correr_por_prazer" in names


def test_get_scraper_known() -> None:
    scraper = get_scraper("lap2go")
    assert scraper.source_name == "lap2go"


def test_get_scraper_unknown() -> None:
    try:
        get_scraper("nonexistent")
        assert False, "Should have raised ValueError"
    except ValueError:
        pass
