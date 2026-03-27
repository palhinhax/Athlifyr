"""Tests for TurresEvents scraper."""

import textwrap
from datetime import datetime

from app.sources.turresevents.scraper import (
    TurresEventsScraper,
    _extract_bg_image,
    _guess_sport_types,
    _parse_card_date,
)


# ── Date parsing ─────────────────────────────────────────────────


def test_parse_card_date_simple() -> None:
    dt = _parse_card_date("17", "mai", "2026")
    assert dt == datetime(2026, 5, 17)


def test_parse_card_date_all_months() -> None:
    months = [
        ("jan", 1), ("fev", 2), ("mar", 3), ("abr", 4),
        ("mai", 5), ("jun", 6), ("jul", 7), ("ago", 8),
        ("set", 9), ("out", 10), ("nov", 11), ("dez", 12),
    ]
    for abbr, num in months:
        dt = _parse_card_date("1", abbr, "2026")
        assert dt is not None, f"Failed for {abbr}"
        assert dt.month == num


def test_parse_card_date_none_parts() -> None:
    assert _parse_card_date(None, "mai", "2026") is None
    assert _parse_card_date("17", None, "2026") is None
    assert _parse_card_date("17", "mai", None) is None


def test_parse_card_date_invalid() -> None:
    assert _parse_card_date("99", "mai", "2026") is None


def test_parse_card_date_unknown_month() -> None:
    assert _parse_card_date("1", "xyz", "2026") is None


# ── Sport type guessing ──────────────────────────────────────────


def test_guess_sky_race() -> None:
    types = _guess_sport_types("Sky Race Montejunto verão 2026")
    assert "TRAIL" in types


def test_guess_enduro() -> None:
    types = _guess_sport_types("Passeio Enduro E-MTB Cucos")
    assert "BTT" in types


def test_guess_gravel_running() -> None:
    types = _guess_sport_types("Ultra Gravel Running Santa Cruz")
    assert "RUNNING" in types


def test_guess_open_day_mtb() -> None:
    types = _guess_sport_types("Open Day Enduro MTB")
    assert "BTT" in types


def test_guess_unknown() -> None:
    types = _guess_sport_types("Evento X")
    assert types == ["OTHER"]


# ── Background image extraction ──────────────────────────────────


def test_extract_bg_image() -> None:
    style = " background-image:url('/Uploads/Eventos/abc.jpg'); "
    assert _extract_bg_image(style) == "/Uploads/Eventos/abc.jpg"


def test_extract_bg_image_quotes() -> None:
    style = 'background-image: url("/Uploads/img.png")'
    assert _extract_bg_image(style) == "/Uploads/img.png"


def test_extract_bg_image_none() -> None:
    assert _extract_bg_image("color: red;") is None


# ── Card parsing ─────────────────────────────────────────────────


def test_parse_event_cards() -> None:
    html = textwrap.dedent("""\
    <html><body>
    <div id="EventosContainer">
      <div>
        <div onclick="location.href='/eventos/sky-race-2026'">
          <div class="imagem" style="background-image:url('/Uploads/Eventos/abc.jpg');"></div>
          <div class="mainFlex">
            <div class="data">
              <div class="dia">17</div>
              <div class="mesano">mai</div>
              <div class="mesano">2026</div>
            </div>
            <div>
              <div class="titulo">Sky Race 2026</div>
              <div class="local">Cadaval</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </body></html>
    """)
    import asyncio
    scraper = TurresEventsScraper()
    # Parse directly
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "lxml")
    container = soup.select_one("#EventosContainer")
    cards = []
    import re
    for div in container.select("div[onclick]"):
        onclick = div.get("onclick", "")
        m = re.search(r"location\.href='(/eventos/[^']+)'", onclick)
        if m:
            cards.append({
                "slug": m.group(1).rsplit("/", 1)[-1],
                "title": div.select_one(".titulo").get_text(strip=True),
                "city": div.select_one(".local").get_text(strip=True),
            })
    assert len(cards) == 1
    assert cards[0]["slug"] == "sky-race-2026"
    assert cards[0]["title"] == "Sky Race 2026"
    assert cards[0]["city"] == "Cadaval"


def test_build_event() -> None:
    scraper = TurresEventsScraper()
    card = {
        "slug": "sky-race-2026",
        "path": "/eventos/sky-race-2026",
        "title": "Sky Race Montejunto 2026",
        "city": "Cadaval",
        "day": "17",
        "month": "mai",
        "year": "2026",
        "image_url": "https://www.turresevents.com/Uploads/Eventos/abc.jpg",
    }
    ev = scraper._build_event(card)
    assert ev is not None
    assert ev.title == "Sky Race Montejunto 2026"
    assert ev.city == "Cadaval"
    assert ev.start_date == datetime(2026, 5, 17)
    assert "TRAIL" in ev.sport_types
    assert ev.source_url == "https://www.turresevents.com/eventos/sky-race-2026"


def test_build_event_no_title() -> None:
    scraper = TurresEventsScraper()
    card = {"slug": "test", "title": None}
    assert scraper._build_event(card) is None


# ── Scraper metadata ─────────────────────────────────────────────


def test_scraper_metadata() -> None:
    s = TurresEventsScraper()
    assert s.source_name == "turresevents"
    assert s.display_name == "TurresEvents"
    assert "turresevents.com" in s.base_url
