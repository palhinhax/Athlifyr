"""Tests for RockTheSport scraper."""

from datetime import datetime

import pytest

from app.sources.rockthesport.scraper import (
    RockTheSportScraper,
    _build_event_url,
    _extract_price,
    _map_sport_types,
    _parse_iso_date,
)


# ── ISO date parsing ─────────────────────────────────────────────


def test_parse_iso_date_with_time() -> None:
    dt = _parse_iso_date("2026-10-03T09:30:00")
    assert dt == datetime(2026, 10, 3, 9, 30)


def test_parse_iso_date_no_seconds() -> None:
    dt = _parse_iso_date("2026-04-19T09:30")
    assert dt == datetime(2026, 4, 19, 9, 30)


def test_parse_iso_date_date_only() -> None:
    dt = _parse_iso_date("2026-10-03")
    assert dt == datetime(2026, 10, 3)


def test_parse_iso_date_with_fractional() -> None:
    dt = _parse_iso_date("2026-10-03T09:30:00.0000000")
    assert dt is not None
    assert dt.year == 2026
    assert dt.month == 10
    assert dt.day == 3


def test_parse_iso_date_none() -> None:
    assert _parse_iso_date(None) is None


def test_parse_iso_date_empty() -> None:
    assert _parse_iso_date("") is None


# ── Sport type mapping ───────────────────────────────────────────


def test_map_sport_types_trail() -> None:
    assert _map_sport_types("trail", []) == ["TRAIL"]


def test_map_sport_types_running_with_subsports() -> None:
    types = _map_sport_types("running", ["half marathon", "10km"])
    assert "RUNNING" in types


def test_map_sport_types_cycling_mtb() -> None:
    types = _map_sport_types("cycling", ["mtb"])
    assert "CYCLING" in types
    assert "BTT" in types


def test_map_sport_types_triathlon() -> None:
    assert _map_sport_types("triathlon", ["sprint distance"]) == ["TRIATHLON"]


def test_map_sport_types_duathlon_maps_to_triathlon() -> None:
    assert "TRIATHLON" in _map_sport_types("duathlon", [])


def test_map_sport_types_unknown() -> None:
    assert _map_sport_types("chess", []) == ["OTHER"]


def test_map_sport_types_swimming() -> None:
    assert _map_sport_types("swimming", []) == ["SWIMMING"]


def test_map_sport_types_march() -> None:
    assert _map_sport_types("march", []) == ["WALKING"]


# ── Event URL builder ────────────────────────────────────────────


def test_build_event_url() -> None:
    url = _build_event_url("flysch-trail-zumaia-2026")
    assert url == "https://web.rockthesport.com/en/event/flysch-trail-zumaia-2026"


# ── Price extraction ─────────────────────────────────────────────


def test_extract_price_direct() -> None:
    assert _extract_price({"price": 20.0}) == 20.0


def test_extract_price_from_prices_list() -> None:
    fee = {"price": 0, "prices": [{"amount": 25.0, "endDate": "2026-09-18"}]}
    assert _extract_price(fee) == 25.0


def test_extract_price_zero() -> None:
    assert _extract_price({"price": 0}) is None


def test_extract_price_empty() -> None:
    assert _extract_price({}) is None


# ── Scraper metadata ─────────────────────────────────────────────


def test_scraper_metadata() -> None:
    scraper = RockTheSportScraper()
    assert scraper.source_name == "rockthesport"
    assert scraper.display_name == "RockTheSport"
    assert "rockthesport" in scraper.base_url
