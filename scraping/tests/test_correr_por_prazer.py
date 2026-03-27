"""Tests for Correr Por Prazer scraper helpers."""

from app.sources.correr_por_prazer.scraper import (
    CorrerPorPrazerScraper,
    _parse_date,
    _parse_price,
)


def test_parse_date() -> None:
    dt = _parse_date("15/06/2026")
    assert dt is not None
    assert dt.day == 15
    assert dt.month == 6


def test_parse_price() -> None:
    assert _parse_price("25,00€") == 25.0
    assert _parse_price(None) is None


def test_guess_sport_types() -> None:
    types = CorrerPorPrazerScraper._guess_sport_types("Ultra Trail", None)
    assert "TRAIL" in types


def test_guess_distance() -> None:
    assert CorrerPorPrazerScraper._guess_distance("50km Ultra") == 50.0
    assert CorrerPorPrazerScraper._guess_distance("nope") is None
