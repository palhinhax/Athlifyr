"""Tests for TicTacTiming scraper."""

from app.sources.tictactiming.scraper import (
    TicTacTimingScraper,
    _guess_sport_types,
)

from bs4 import BeautifulSoup


def test_guess_sport_orienteering() -> None:
    assert "ORIENTEERING" in _guess_sport_types("Campeonato Militar de Orientação 2026")


def test_guess_sport_btt() -> None:
    assert "BTT" in _guess_sport_types("1º BTT Rota dos Trilhos Perdidos")


def test_guess_sport_unknown() -> None:
    assert _guess_sport_types("Evento") == ["OTHER"]


def test_extract_event_links() -> None:
    html = """<html><body>
    <a href="/eventos1/eventos/125-campeonato-militar">Campeonato</a>
    <a href="/eventos1/eventos/111-btt-rota-dos-trilhos-perdidos">BTT</a>
    <a href="/contact">Contact</a>
    </body></html>"""
    soup = BeautifulSoup(html, "lxml")
    scraper = TicTacTimingScraper()
    links = scraper._extract_event_links(soup)
    assert len(links) == 2
    assert any("125" in l for l in links)
    assert any("111" in l for l in links)


def test_scraper_metadata() -> None:
    s = TicTacTimingScraper()
    assert s.source_name == "tictactiming"
    assert s.display_name == "TicTacTiming"
