"""Tests for WeRun scraper."""

import textwrap
from datetime import datetime

from bs4 import BeautifulSoup

from app.sources.werun.scraper import (
    WeRunScraper,
    _guess_sport_types,
    _parse_card_date,
    _parse_date_str,
    _parse_price,
)


# ── Date parsing ─────────────────────────────────────────────────


def test_parse_card_date_simple() -> None:
    dt = _parse_card_date("22", "Mar")
    assert dt is not None
    assert dt.month == 3
    assert dt.day == 22


def test_parse_card_date_all_months() -> None:
    months = [
        ("Jan", 1), ("Fev", 2), ("Mar", 3), ("Abr", 4),
        ("Mai", 5), ("Jun", 6), ("Jul", 7), ("Ago", 8),
        ("Set", 9), ("Out", 10), ("Nov", 11), ("Dez", 12),
    ]
    for abbr, num in months:
        dt = _parse_card_date("1", abbr)
        assert dt is not None, f"Failed for {abbr}"
        assert dt.month == num


def test_parse_card_date_none_parts() -> None:
    assert _parse_card_date(None, "Mar") is None
    assert _parse_card_date("22", None) is None


def test_parse_card_date_invalid() -> None:
    assert _parse_card_date("99", "Mar") is None


def test_parse_card_date_unknown_month() -> None:
    assert _parse_card_date("1", "Xyz") is None


def test_parse_card_date_uses_current_year() -> None:
    dt = _parse_card_date("15", "Jun")
    assert dt is not None
    assert dt.year == datetime.now().year


# ── Sport type guessing ──────────────────────────────────────────


def test_guess_meia_maratona() -> None:
    types = _guess_sport_types("Meia Maratona Baía do Seixal 2026")
    assert "RUNNING" in types


def test_guess_triathlon() -> None:
    types = _guess_sport_types("Grande Prémio LXTRIATLHON")
    assert "TRIATHLON" in types


def test_guess_corre_praia() -> None:
    types = _guess_sport_types("32º Corre Praia")
    assert "RUNNING" in types


def test_guess_corrida() -> None:
    types = _guess_sport_types("47ª Corrida da Liberdade")
    assert "RUNNING" in types


def test_guess_trail() -> None:
    types = _guess_sport_types("IX Lisboa Green Trail")
    assert "TRAIL" in types


def test_guess_pedalada() -> None:
    types = _guess_sport_types("Pedalada da Liberdade 2026")
    assert "CYCLING" in types


def test_guess_unknown() -> None:
    types = _guess_sport_types("Evento Desportivo")
    assert types == ["OTHER"]


# ── Card parsing ─────────────────────────────────────────────────


def test_parse_cards() -> None:
    html = textwrap.dedent("""\
    <html><body>
    <div class="panel panel-shadow event-listing">
      <div class="panel-body">
        <a class="event-image" href="/eventos/meia-maratona-2026/">
          <img class="img-responsive" src="/site/assets/files/123/cartaz.500x320.png" alt="" />
          <div class="banner-area"><div class="banner">Evento WeTiming</div></div>
        </a>
        <a href="/eventos/meia-maratona-2026/">
          <div class="event-limit">
            <div class="event-header">
              <h3>Meia Maratona 2026</h3>
              <div class="time">09:00</div>
            </div>
          </div>
        </a>
      </div>
    </div>
    <div class="event-date">
      <div class="day">22</div>
      <div class="month">Mar</div>
    </div>
    </body></html>
    """)
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "lxml")
    panels = soup.select(".panel.event-listing")
    assert len(panels) == 1

    panel = panels[0]
    h3 = panel.select_one("h3")
    assert h3.get_text(strip=True) == "Meia Maratona 2026"

    img = panel.select_one("img.img-responsive")
    assert img is not None
    assert "cartaz" in img["src"]


def test_build_event() -> None:
    scraper = WeRunScraper()
    card = {
        "slug": "meia-maratona-2026",
        "url": "https://werun.pt/eventos/meia-maratona-2026/",
        "title": "Meia Maratona 2026",
        "day": "22",
        "month": "Mar",
        "time": "09:00",
        "image_url": "https://werun.pt/site/assets/files/123/cartaz.png",
    }
    ev = scraper._build_event_from_card(card)
    assert ev is not None
    assert ev.title == "Meia Maratona 2026"
    assert ev.start_date is not None
    assert ev.start_date.month == 3
    assert ev.start_date.day == 22
    assert "RUNNING" in ev.sport_types
    assert ev.source_url == "https://werun.pt/eventos/meia-maratona-2026/"


def test_build_event_no_title() -> None:
    scraper = WeRunScraper()
    card = {"slug": "test", "url": "https://werun.pt/eventos/test/", "title": None}
    assert scraper._build_event_from_card(card) is None


def test_build_event_triathlon() -> None:
    scraper = WeRunScraper()
    card = {
        "slug": "triatlhon-2026",
        "url": "https://werun.pt/eventos/triatlhon-2026/",
        "title": "Grande Prémio LXTRIATLHON",
        "day": "19",
        "month": "Abr",
        "time": "09:00",
        "image_url": None,
    }
    ev = scraper._build_event_from_card(card)
    assert ev is not None
    assert "TRIATHLON" in ev.sport_types


# ── Scraper metadata ─────────────────────────────────────────────


def test_scraper_metadata() -> None:
    s = WeRunScraper()
    assert s.source_name == "werun"
    assert s.display_name == "We Run"
    assert "werun.pt" in s.base_url


# ── Price parsing ────────────────────────────────────────────────


def test_parse_price_euro() -> None:
    assert _parse_price("15€") == 15.0
    assert _parse_price("10,50€") == 10.5
    assert _parse_price("25€ *") == 25.0


def test_parse_price_none() -> None:
    assert _parse_price(None) is None
    assert _parse_price("free") is None


# ── Date string parsing ─────────────────────────────────────────


def test_parse_date_str_slash() -> None:
    dt = _parse_date_str("31/01")
    assert dt is not None
    assert dt.month == 1
    assert dt.day == 31


def test_parse_date_str_month_name() -> None:
    dt = _parse_date_str("12/jan")
    assert dt is not None
    assert dt.month == 1
    assert dt.day == 12


def test_parse_date_str_ate_prefix() -> None:
    dt = _parse_date_str("até 11/jan")
    assert dt is not None
    assert dt.month == 1
    assert dt.day == 11


def test_parse_date_str_none() -> None:
    assert _parse_date_str("") is None
    assert _parse_date_str("no date") is None


# ── Detail-page extraction ───────────────────────────────────────

_SAMPLE_DETAIL_HTML = """\
<html>
<head>
  <meta property="og:image" content="https://werun.pt/site/assets/files/123/cartaz.png"/>
</head>
<body>
<h1>Meia Maratona Baía do Seixal 2026</h1>
<div class="row">
  <div class="col-md-4 poster">
    <img src="https://werun.pt/site/assets/files/123/cartaz.600x850.png"/>
  </div>
  <div class="col-md-5">
    <div class="container event-content main-content">
      <div class="row">
        <p>.</p>
        <p>No dia 22 de março, o evento desportivo vai ter lugar.</p>
        <p>Meia Maratona 21,097 Km</p>
        <p>Prova 10 Km</p>
        <p>Caminhada 5 km</p>
        <h3><a href="/site/assets/files/123/guia_do_atleta.pdf">GUIA DO ATLETA</a></h3>
        <h3><a href="https://werun.pt/site/assets/files/123/listagem.pdf">LISTAGEM DE INSCRITOS</a></h3>
        <p>Este evento é organizado por Clube Desportivo e Recreativo Águias Unidas.</p>
        <table>
          <tr><td></td><td>1.ª fase</td><td>2.ª fase</td><td>3.ª fase</td></tr>
          <tr><td></td><td>até 11/jan</td><td>12/jan a 01/mar</td><td>02/mar a 16/mar</td></tr>
          <tr><td>Meia Maratona</td><td>15€</td><td>18€</td><td>20€</td></tr>
          <tr><td>Prova 10 Km</td><td>10€</td><td>12€</td><td>14€</td></tr>
          <tr><td>Caminhada/corrida 5 Km</td><td>8€</td><td>8€</td><td>8€</td></tr>
          <tr><td>5€ *</td><td>5€</td><td>5€</td><td>5€</td></tr>
        </table>
      </div>
    </div>
  </div>
  <div class="col-md-3 event-menu">
    <div class="event-date">
      <div class="day">22</div>
      <div class="month">Mar</div>
    </div>
    <div class="local">Seixal</div>
    <div class="button"><a href="https://evento.admeus.org/">Inscreva-se já!</a></div>
  </div>
</div>
</body>
</html>
"""


def test_extract_city() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    assert WeRunScraper._extract_city(soup) == "Seixal"


def test_extract_description() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    desc = WeRunScraper._extract_description(soup)
    assert desc is not None
    assert "22 de março" in desc
    # Full text captured — including table content and all paragraphs
    assert "Meia Maratona 21,097 Km" in desc
    assert "organizado por" in desc
    # Junk filtered out
    assert "." != desc.split("\n")[0]  # leading "." line removed


def test_extract_organizer() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    org = WeRunScraper._extract_organizer(soup, None)
    assert org is not None
    assert "Águias Unidas" in org


def test_extract_image() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    img = WeRunScraper._extract_image(soup)
    assert img is not None
    assert "cartaz" in img


def test_extract_registration_url() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    url = WeRunScraper._extract_registration_url(soup)
    assert url is not None
    assert "admeus.org" in url


def test_extract_variants_and_pricing() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    variants, pricing, raw_text = WeRunScraper._extract_variants_and_pricing(soup)
    assert len(variants) == 3
    names = [v.name for v in variants]
    assert "Meia Maratona" in names
    assert "Prova 10 Km" in names
    assert "Caminhada/corrida 5 Km" in names

    # Meia Maratona should have distance 21.097
    mm = next(v for v in variants if "Meia" in v.name)
    assert mm.distance_km == 21.097

    # 3 variants × 3 phases = 9 pricing entries
    assert len(pricing) == 9
    mm_prices = [p for p in pricing if "Meia" in (p.variant_name or "")]
    assert mm_prices[0].price == 15.0
    assert mm_prices[1].price == 18.0
    assert mm_prices[2].price == 20.0


def test_extract_documents() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    docs = WeRunScraper._extract_documents(soup)
    assert len(docs) == 2
    guide = [d for d in docs if d.document_type == "guide"]
    assert len(guide) == 1
    assert guide[0].mime_type == "application/pdf"
    reg_list = [d for d in docs if d.document_type == "registration_list"]
    assert len(reg_list) == 1


def test_extract_documents_empty() -> None:
    soup = BeautifulSoup("<html><body><p>No docs</p></body></html>", "lxml")
    docs = WeRunScraper._extract_documents(soup)
    assert docs == []


def test_extract_variants_prize_table_skipped() -> None:
    """Prize-money tables (with 1.º, 2.º) should be skipped."""
    html = """\
    <html><body>
    <table>
      <tr><td></td><td>Geral Masculino</td></tr>
      <tr><td>1.º</td><td>450€</td></tr>
      <tr><td>2.º</td><td>350€</td></tr>
    </table>
    </body></html>
    """
    soup = BeautifulSoup(html, "lxml")
    variants, pricing, raw_text = WeRunScraper._extract_variants_and_pricing(soup)
    assert len(variants) == 0
    assert len(pricing) == 0
