"""Tests for SportChip scraper."""

from datetime import datetime

from app.sources.sportchip.scraper import (
    SportChipScraper,
    _parse_date,
    _guess_sport_types,
)


def test_parse_date_full_month() -> None:
    dt = _parse_date("12 Abril 2026")
    assert dt is not None
    assert dt.day == 12
    assert dt.month == 4
    assert dt.year == 2026


def test_parse_date_abbrev() -> None:
    dt = _parse_date("10 Mai 2026")
    assert dt is not None
    assert dt.month == 5


def test_parse_date_invalid() -> None:
    assert _parse_date("invalid") is None


def test_guess_sport_trail() -> None:
    assert "TRAIL" in _guess_sport_types("IV Trail de Mato de Miranda")


def test_guess_sport_btt() -> None:
    assert "BTT" in _guess_sport_types("4º BTT CarvaCity")


def test_guess_sport_unknown() -> None:
    assert _guess_sport_types("Evento Qualquer") == ["OTHER"]


def test_scraper_metadata() -> None:
    s = SportChipScraper()
    assert s.source_name == "sportchip"
    assert s.display_name == "SportChip"
