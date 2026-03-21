"""Tests for Lap2Go scraper parsing helpers."""

from app.sources.lap2go.scraper import Lap2GoScraper, _parse_date, _parse_price


def test_parse_date_dd_mm_yyyy() -> None:
    dt = _parse_date("04/04/2026")
    assert dt is not None
    assert dt.day == 4
    assert dt.month == 4
    assert dt.year == 2026


def test_parse_date_none() -> None:
    assert _parse_date(None) is None
    assert _parse_date("") is None


def test_parse_price_euro() -> None:
    assert _parse_price("23.70€") == 23.70
    assert _parse_price("10,00€") == 10.0
    assert _parse_price("8€") == 8.0


def test_parse_price_none() -> None:
    assert _parse_price(None) is None
    assert _parse_price("free") is None


def test_guess_sport_types_trail() -> None:
    scraper = Lap2GoScraper()
    types = scraper._guess_sport_types("Trilhos Termais", "Trail running noturno")
    assert "TRAIL" in types


def test_guess_distance() -> None:
    assert Lap2GoScraper._guess_distance("Trail Longo 20km") == 20.0
    assert Lap2GoScraper._guess_distance("Caminhada 6 km") == 6.0
    assert Lap2GoScraper._guess_distance("No distance") is None
