"""Tests for Sportmaniacs scraper."""

from datetime import datetime

import pytest

from app.sources.sportmaniacs.scraper import (
    SportmaniacsScraper,
    _build_event_url,
    _best_image,
    _clean_html,
    _map_sport_types,
    _parse_date,
    _parse_ld_json_offers,
)


# ── Date parsing ─────────────────────────────────────────────────


def test_parse_date_standard() -> None:
    assert _parse_date("2026-04-03") == datetime(2026, 4, 3)


def test_parse_date_none() -> None:
    assert _parse_date(None) is None


def test_parse_date_empty() -> None:
    assert _parse_date("") is None


def test_parse_date_invalid() -> None:
    assert _parse_date("not-a-date") is None


# ── Sport type mapping ───────────────────────────────────────────


def test_map_sport_types_running() -> None:
    assert _map_sport_types("0", "10K Ciudad de Valencia") == ["RUNNING"]


def test_map_sport_types_trail() -> None:
    assert _map_sport_types("1", "Ultra Trail Sierra Nevada") == ["TRAIL"]


def test_map_sport_types_cycling() -> None:
    assert _map_sport_types("2", "Gran Fondo Cycling") == ["CYCLING"]


def test_map_sport_types_triathlon() -> None:
    assert _map_sport_types("3", "Triatlón de Sevilla") == ["TRIATHLON"]


def test_map_sport_types_swimming() -> None:
    assert _map_sport_types("4", "Travesía a nado") == ["SWIMMING"]


def test_map_sport_types_trail_from_title() -> None:
    types = _map_sport_types("0", "Mountain Ultra Trail Race")
    assert "TRAIL" in types


def test_map_sport_types_btt_from_title() -> None:
    types = _map_sport_types("0", "VII BTT La Pedriza")
    assert "CYCLING" in types or "BTT" in types


def test_map_sport_types_ocr() -> None:
    types = _map_sport_types("0", "Spartan Race Madrid")
    assert "OCR" in types


# ── HTML cleaning ────────────────────────────────────────────────


def test_clean_html_strips_tags() -> None:
    assert _clean_html("<p>Hello <strong>World</strong></p>") == "Hello World"


def test_clean_html_decodes_entities() -> None:
    assert _clean_html("Información &amp; regulación") == "Información & regulación"


def test_clean_html_none() -> None:
    assert _clean_html(None) is None


def test_clean_html_empty() -> None:
    assert _clean_html("") is None


# ── Image selection ──────────────────────────────────────────────


def test_best_image_picks_md() -> None:
    photos = {
        "xs": "https://example.com/xs.jpg",
        "sm": "https://example.com/sm.jpg",
        "md": "https://example.com/md.jpg",
    }
    assert _best_image(photos) == "https://example.com/md.jpg"


def test_best_image_skips_default() -> None:
    photos = {
        "md": "https://example.com/resize/960x540x0_default_dark.jpg",
        "sm": "https://example.com/resize/640x360x0_default_dark.jpg",
        "xs": "https://example.com/real_photo.jpg",
    }
    assert _best_image(photos) == "https://example.com/real_photo.jpg"


def test_best_image_none() -> None:
    assert _best_image(None) is None


def test_best_image_empty() -> None:
    assert _best_image({}) is None


# ── URL builder ──────────────────────────────────────────────────


def test_build_event_url() -> None:
    url = _build_event_url("ultra-trail-sierra-nevada")
    assert url == "https://sportmaniacs.com/es/races/ultra-trail-sierra-nevada"


# ── LD+JSON offers parsing ───────────────────────────────────────


def test_parse_ld_json_offers_basic() -> None:
    ld = json.dumps([{
        "@type": "SportsEvent",
        "offers": [
            {"name": "Trail 20K", "price": "25.00", "priceCurrency": "€"},
            {"name": "Trail 10K", "price": "15.00", "priceCurrency": "EUR"},
        ],
    }])
    offers = _parse_ld_json_offers(ld)
    assert len(offers) == 2
    assert offers[0]["name"] == "Trail 20K"
    assert offers[0]["price"] == "25.00"


def test_parse_ld_json_offers_empty() -> None:
    assert _parse_ld_json_offers("[]") == []


def test_parse_ld_json_offers_invalid() -> None:
    assert _parse_ld_json_offers("not json") == []


# ── Scraper metadata ─────────────────────────────────────────────


def test_scraper_metadata() -> None:
    scraper = SportmaniacsScraper()
    assert scraper.source_name == "sportmaniacs"
    assert scraper.display_name == "Sportmaniacs"
    assert "sportmaniacs" in scraper.base_url


import json
