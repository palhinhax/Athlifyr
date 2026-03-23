"""Tests for TotalCrono scraper."""

from datetime import datetime

from app.sources.totalcrono.scraper import (
    TotalCronoScraper,
    _parse_date,
    _guess_sport_types,
)


def test_parse_date_simple() -> None:
    dt = _parse_date("29-09-2024")
    assert dt is not None
    assert dt.day == 29
    assert dt.month == 9
    assert dt.year == 2024


def test_parse_date_range() -> None:
    dt = _parse_date("08 e 09-10-2022")
    assert dt is not None
    assert dt.day == 8
    assert dt.month == 10


def test_parse_date_range_a() -> None:
    dt = _parse_date("01-05-2021 a 16-05-2021")
    assert dt is not None
    assert dt.day == 1
    assert dt.month == 5


def test_parse_date_invalid() -> None:
    assert _parse_date("invalid") is None


def test_guess_sport_trail() -> None:
    assert "TRAIL" in _guess_sport_types("Trail Agroal")


def test_guess_sport_btt() -> None:
    assert "BTT" in _guess_sport_types("Raid BTT da Raposa")


def test_guess_sport_ocr() -> None:
    assert "OCR" in _guess_sport_types("OCR Fireman Almeida")


def test_guess_sport_cycling() -> None:
    assert "CYCLING" in _guess_sport_types("Cicloturismo Alvaiázere")


def test_guess_sport_running() -> None:
    assert "RUNNING" in _guess_sport_types("São Silvestre Torres Novas")


def test_guess_sport_unknown() -> None:
    assert _guess_sport_types("Evento") == ["OTHER"]


def test_scraper_metadata() -> None:
    s = TotalCronoScraper()
    assert s.source_name == "totalcrono"
    assert s.display_name == "TotalCrono"
