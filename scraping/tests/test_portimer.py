"""Tests for Portimer scraper."""

import textwrap
from datetime import datetime

from bs4 import BeautifulSoup

from app.sources.portimer.scraper import (
    PortimerScraper,
    _extract_gdrive_url,
    _map_sport_types,
    _parse_card_date,
    _slug_from_href,
)


# ── Date parsing ─────────────────────────────────────────────────


def test_parse_card_date_simple() -> None:
    dt = _parse_card_date("22", "Mar", "2026")
    assert dt == datetime(2026, 3, 22)


def test_parse_card_date_all_months() -> None:
    months = [
        ("Jan", 1), ("Fev", 2), ("Mar", 3), ("Abr", 4),
        ("Mai", 5), ("Jun", 6), ("Jul", 7), ("Ago", 8),
        ("Set", 9), ("Out", 10), ("Nov", 11), ("Dez", 12),
    ]
    for abbr, num in months:
        dt = _parse_card_date("1", abbr, "2026")
        assert dt is not None, f"Failed for {abbr}"
        assert dt.month == num


def test_parse_card_date_none_parts() -> None:
    assert _parse_card_date(None, "Mar", "2026") is None
    assert _parse_card_date("22", None, "2026") is None
    assert _parse_card_date("22", "Mar", None) is None


def test_parse_card_date_invalid() -> None:
    assert _parse_card_date("99", "Mar", "2026") is None


def test_parse_card_date_unknown_month() -> None:
    assert _parse_card_date("1", "Xyz", "2026") is None


# ── Sport type mapping ───────────────────────────────────────────


def test_map_atletismo_trail() -> None:
    types = _map_sport_types("Atletismo / Trail")
    assert "RUNNING" in types
    assert "TRAIL" in types


def test_map_atletismo() -> None:
    assert _map_sport_types("Atletismo") == ["RUNNING"]


def test_map_btt() -> None:
    assert _map_sport_types("Passeio BTT") == ["BTT"]


def test_map_hyrox() -> None:
    assert _map_sport_types("Simulação Hyrox") == ["OCR"]


def test_map_obstaculo() -> None:
    assert _map_sport_types("Prova de obstáculos") == ["OCR"]


def test_map_none() -> None:
    assert _map_sport_types(None) == ["OTHER"]


def test_map_unknown() -> None:
    assert _map_sport_types("Canoagem") == ["OTHER"]


# ── Google Drive URL extraction ──────────────────────────────────


def test_extract_gdrive_url() -> None:
    html = (
        '<iframe src="https://drive.google.com/file/d/'
        '1nKsWcD9joUJH4DpHoJsxzUSAVcCB9jzR/preview"></iframe>'
    )
    url = _extract_gdrive_url(html)
    assert url == "https://drive.google.com/uc?export=download&id=1nKsWcD9joUJH4DpHoJsxzUSAVcCB9jzR"


def test_extract_gdrive_url_no_match() -> None:
    assert _extract_gdrive_url("<div>No iframe</div>") is None


def test_extract_gdrive_url_empty() -> None:
    assert _extract_gdrive_url("") is None


# ── Slug extraction ──────────────────────────────────────────────


def test_slug_from_href() -> None:
    assert _slug_from_href("/eventos/trail_trilhos_viso_2025") == "trail_trilhos_viso_2025"


def test_slug_from_href_full_url() -> None:
    assert _slug_from_href("https://www.portimer.pt/eventos/maratonavr-2026") == "maratonavr-2026"


def test_slug_from_href_trailing_slash() -> None:
    assert _slug_from_href("/eventos/trail_test/") == "trail_test"


# ── Card HTML parsing ────────────────────────────────────────────

_CARD_HTML = textwrap.dedent("""\
<a href="/eventos/trail_trilhos_viso_2025" class="">
  <div class="events-next-grid-event">
    <img class="events-next-grid-event-img"
         src="https://www.portimer.pt/assets/images/events/101/abc.jpg"
         alt="Evento">
    <div class="events-next-grid-event-meta">
      <h2 class="events-next-grid-event-meta-name">Trail Trilhos do Viso 2026</h2>
      <div class="events-next-grid-event-meta-date">Atletismo / Trail</div>
      <div class="events-next-grid-event-meta-date">Celorico de Basto</div>
    </div>
    <div class="calendar-card">
      <div class="calendar-day">22</div>
      <div class="calendar-month">Mar</div>
      <div class="calendar-year">2026</div>
    </div>
  </div>
</a>
<a href="/eventos/maratonavr-2026" class="">
  <div class="events-next-grid-event">
    <img class="events-next-grid-event-img"
         src="https://www.portimer.pt/assets/images/events/130/def.png"
         alt="Evento">
    <div class="events-next-grid-event-meta">
      <h2 class="events-next-grid-event-meta-name">IX Meia Maratona de Vila Real</h2>
      <div class="events-next-grid-event-meta-date">Atletismo / Trail</div>
      <div class="events-next-grid-event-meta-date">Vila Real</div>
    </div>
    <div class="calendar-card">
      <div class="calendar-day">12</div>
      <div class="calendar-month">Abr</div>
      <div class="calendar-year">2026</div>
    </div>
  </div>
</a>
""")


def test_parse_card_html_count() -> None:
    scraper = PortimerScraper()
    cards = scraper._parse_card_html(_CARD_HTML)
    assert len(cards) == 2


def test_parse_card_html_first() -> None:
    scraper = PortimerScraper()
    cards = scraper._parse_card_html(_CARD_HTML)
    c = cards[0]
    assert c["slug"] == "trail_trilhos_viso_2025"
    assert c["title"] == "Trail Trilhos do Viso 2026"
    assert c["sport_text"] == "Atletismo / Trail"
    assert c["location"] == "Celorico de Basto"
    assert c["day"] == "22"
    assert c["month"] == "Mar"
    assert c["year"] == "2026"
    assert "abc.jpg" in c["image_url"]


def test_parse_card_html_second() -> None:
    scraper = PortimerScraper()
    cards = scraper._parse_card_html(_CARD_HTML)
    c = cards[1]
    assert c["slug"] == "maratonavr-2026"
    assert c["title"] == "IX Meia Maratona de Vila Real"
    assert c["day"] == "12"
    assert c["month"] == "Abr"


def test_parse_card_html_empty() -> None:
    scraper = PortimerScraper()
    cards = scraper._parse_card_html("")
    assert cards == []


def test_parse_card_html_skips_nav_links() -> None:
    html = '<a href="/eventos/proximos">Proximos</a><a href="/eventos/anteriores">Ant</a>'
    scraper = PortimerScraper()
    cards = scraper._parse_card_html(html)
    assert cards == []


# ── Detail page parsing ──────────────────────────────────────────

_DETAIL_HTML = textwrap.dedent("""\
<html><body>
<h2>Trail Trilhos do Viso 2026</h2>
<div class="events-next-grid-event-meta">
  <div class="events-next-grid-event-meta-date">Atletismo / Trail</div>
  <div class="events-next-grid-event-meta-date">Celorico de Basto</div>
</div>
<div class="calendar-card">
  <div class="calendar-day">22</div>
  <div class="calendar-month">Mar</div>
  <div class="calendar-year">2026</div>
</div>
<img class="events-next-grid-event-img"
     src="https://www.portimer.pt/assets/images/events/101/abc.jpg"/>
</body></html>
""")


def test_parse_detail_page() -> None:
    scraper = PortimerScraper()
    card = scraper._parse_detail_page(_DETAIL_HTML, "trail_trilhos_viso_2025")
    assert card is not None
    assert card["title"] == "Trail Trilhos do Viso 2026"
    assert card["sport_text"] == "Atletismo / Trail"
    assert card["location"] == "Celorico de Basto"
    assert card["day"] == "22"
    assert card["month"] == "Mar"
    assert card["year"] == "2026"
    assert card["slug"] == "trail_trilhos_viso_2025"


def test_parse_detail_page_no_title() -> None:
    html = "<html><body><p>empty</p></body></html>"
    scraper = PortimerScraper()
    assert scraper._parse_detail_page(html, "test") is None
