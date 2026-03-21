"""Tests for the base scraper data classes."""

from app.sources.base.scraper import ScrapedEventData, ScrapedVariantData


def test_scraped_event_data_defaults() -> None:
    ev = ScrapedEventData(title="Test Race", source_url="https://example.com/race")
    assert ev.title == "Test Race"
    assert ev.country == "Portugal"
    assert ev.sport_types == []
    assert ev.variants == []
    assert ev.pricing_phases == []
    assert ev.documents == []


def test_scraped_variant_data() -> None:
    v = ScrapedVariantData(name="Trail 20km", distance_km=20.0, price=15.0)
    assert v.name == "Trail 20km"
    assert v.distance_km == 20.0
    assert v.currency == "EUR"
