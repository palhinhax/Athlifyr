"""Tests for MultiCrono scraper."""

from datetime import datetime

from app.sources.multicrono.scraper import (
    MultiCronoScraper,
    _parse_listing_date,
    _parse_detail_date,
    _parse_time,
    _guess_sport_types,
)


def test_parse_listing_date() -> None:
    dt = _parse_listing_date("11 Abr 2026")
    assert dt is not None
    assert dt.day == 11
    assert dt.month == 4
    assert dt.year == 2026


def test_parse_listing_date_range() -> None:
    dt = _parse_listing_date("23-24 Mai 2026")
    assert dt is not None
    assert dt.day == 23
    assert dt.month == 5


def test_parse_detail_date() -> None:
    dt = _parse_detail_date("11/04/2026")
    assert dt is not None
    assert dt.day == 11
    assert dt.month == 4


def test_parse_time() -> None:
    assert _parse_time("09H00") == "09:00"
    assert _parse_time("15H30") == "15:30"


def test_guess_sport_triathlon() -> None:
    types = _guess_sport_types("Duatlo Sprint", "Duatlo")
    assert "TRIATHLON" in types


def test_guess_sport_swimming() -> None:
    types = _guess_sport_types("Zeus Grand Prix", "Águas Abertas")
    assert "SWIMMING" in types


def test_guess_sport_running() -> None:
    types = _guess_sport_types("Castelo Em Chamas", "Corrida-Desafio")
    assert "RUNNING" in types


def test_guess_sport_unknown() -> None:
    types = _guess_sport_types("Evento")
    assert types == ["OTHER"]


def test_scraper_metadata() -> None:
    s = MultiCronoScraper()
    assert s.source_name == "multicrono"
    assert s.display_name == "MultiCrono"
