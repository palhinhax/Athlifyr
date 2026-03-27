"""Tests for ATRP scraper."""

import json
from datetime import datetime

from app.sources.atrp.scraper import (
    ATRPScraper,
    _parse_atrp_date,
    _parse_location,
    _parse_percursos,
)


# ── Date parsing ─────────────────────────────────────────────────


def test_parse_date_full() -> None:
    dt = _parse_atrp_date("23-05-2026 07:00:00")
    assert dt == datetime(2026, 5, 23, 7, 0, 0)


def test_parse_date_midnight() -> None:
    dt = _parse_atrp_date("07-06-2026 00:00:00")
    assert dt == datetime(2026, 6, 7, 0, 0, 0)


def test_parse_date_no_time() -> None:
    dt = _parse_atrp_date("15-03-2026")
    assert dt == datetime(2026, 3, 15)


def test_parse_date_invalid() -> None:
    assert _parse_atrp_date("invalid") is None


def test_parse_date_empty() -> None:
    assert _parse_atrp_date("") is None


# ── Location parsing ─────────────────────────────────────────────


def test_parse_location_full() -> None:
    district, city = _parse_location("Beja (Zona Sul) - Serpa")
    assert district == "Beja"
    assert city == "Serpa"


def test_parse_location_island() -> None:
    district, city = _parse_location("Ilha de São Miguel (Zona Açores) - Ponta Delgada")
    assert district == "Ilha de São Miguel"
    assert city == "Ponta Delgada"


def test_parse_location_no_city() -> None:
    district, city = _parse_location("Portalegre (Zona Sul)")
    assert district == "Portalegre"
    assert city is None


def test_parse_location_empty() -> None:
    district, city = _parse_location("")
    assert district is None
    assert city is None


def test_parse_location_plain() -> None:
    district, city = _parse_location("Lisboa")
    assert district == "Lisboa"
    assert city is None


# ── Percursos parsing ────────────────────────────────────────────


def test_parse_percursos_standard() -> None:
    html = (
        "<p>Conta com 3 percursos:<br>7CUT40 - 150<br>"
        "7CUT20 - 150<br>7CUT10 - 150<br></p>"
    )
    result = _parse_percursos(html)
    assert len(result) == 3
    assert result[0]["name"] == "7CUT40"
    assert result[1]["name"] == "7CUT20"
    assert result[2]["name"] == "7CUT10"


def test_parse_percursos_with_long_names() -> None:
    html = (
        "<p>Conta com 3 percursos:<br>"
        "Ultra Trilhos dos Reis - K47 - 100<br>"
        "Trilhos dos Reis - 100<br>"
        "Mini Trilhos dos Reis - K18 - 100<br></p>"
    )
    result = _parse_percursos(html)
    assert len(result) == 3
    assert result[0]["name"] == "Ultra Trilhos dos Reis - K47"
    assert result[1]["name"] == "Trilhos dos Reis"
    assert result[2]["name"] == "Mini Trilhos dos Reis - K18"


def test_parse_percursos_empty() -> None:
    assert _parse_percursos("") == []


def test_parse_percursos_no_match() -> None:
    assert _parse_percursos("<p>Some other text</p>") == []


def test_parse_percursos_single() -> None:
    html = "<p>Conta com 1 percurso:<br>Trail 25K - 100<br></p>"
    result = _parse_percursos(html)
    assert len(result) == 1
    assert result[0]["name"] == "Trail 25K"


# ── Scraper metadata ─────────────────────────────────────────────


def test_scraper_attributes() -> None:
    scraper = ATRPScraper()
    assert scraper.source_name == "atrp"
    assert scraper.display_name == "ATRP"
    assert scraper.base_url == "https://my.atrp.pt"


# ── JSON-LD extraction ───────────────────────────────────────────


def test_extract_json_ld() -> None:
    from bs4 import BeautifulSoup

    html = """<html><head>
    <script type="application/ld+json">
    {
        "@context": "http://schema.org/",
        "@type": "Event",
        "name": "Test Trail 2026",
        "startDate": "2026-05-23 07:00:00",
        "endDate": "",
        "location": {
            "@type": "Place",
            "name": "",
            "address": {
                "streetAddress": "Lisboa",
                "addressLocality": "",
                "addressRegion": "Portugal"
            }
        }
    }
    </script>
    </head><body></body></html>"""

    soup = BeautifulSoup(html, "lxml")
    data = ATRPScraper._extract_json_ld(soup)
    assert data is not None
    assert data["name"] == "Test Trail 2026"
    assert data["startDate"] == "2026-05-23 07:00:00"


def test_extract_json_ld_with_control_chars() -> None:
    from bs4 import BeautifulSoup

    html = """<html><head>
    <script type="application/ld+json">
    {
        "@context": "http://schema.org/",
        "@type": "Event",
        "name": "Trail\t\nTest",
        "startDate": "2026-01-01 08:00:00"
    }
    </script>
    </head><body></body></html>"""

    soup = BeautifulSoup(html, "lxml")
    data = ATRPScraper._extract_json_ld(soup)
    assert data is not None
    assert "Trail" in data["name"]


def test_extract_json_ld_missing() -> None:
    from bs4 import BeautifulSoup

    html = "<html><head></head><body></body></html>"
    soup = BeautifulSoup(html, "lxml")
    data = ATRPScraper._extract_json_ld(soup)
    assert data is None
