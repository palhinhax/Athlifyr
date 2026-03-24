"""Tests for TimerSpeed scraper."""

from datetime import datetime

from app.sources.timerspeed.scraper import (
    TimerSpeedScraper,
    _parse_tribe_date,
    _guess_sport_types,
)


def test_parse_tribe_date() -> None:
    dt = _parse_tribe_date("Abril 4", "Abril 2026")
    assert dt is not None
    assert dt.day == 4
    assert dt.month == 4
    assert dt.year == 2026


def test_parse_tribe_date_maio() -> None:
    dt = _parse_tribe_date("Maio 22 - Maio 24", "Maio 2026")
    assert dt is not None
    assert dt.day == 22
    assert dt.month == 5


def test_parse_tribe_date_invalid() -> None:
    assert _parse_tribe_date("InvalidDate", "2026") is None


def test_guess_sport_trail() -> None:
    types = _guess_sport_types("CORONADO TRAIL 2026", "Atletismo")
    assert "TRAIL" in types


def test_guess_sport_running() -> None:
    types = _guess_sport_types("5ª Meia Maratona das Cantarinhas")
    assert "RUNNING" in types


def test_guess_sport_btt() -> None:
    types = _guess_sport_types("SABOR & DOURO MTB EXPERIENCE 2026")
    assert "BTT" in types


def test_scraper_metadata() -> None:
    s = TimerSpeedScraper()
    assert s.source_name == "timerspeed"
    assert s.display_name == "TimerSpeed"
