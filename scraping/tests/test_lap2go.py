"""Tests for Lap2Go scraper parsing helpers."""

import pytest
from unittest.mock import AsyncMock, patch

from bs4 import BeautifulSoup

from app.sources.lap2go.scraper import Lap2GoScraper, _parse_date, _parse_price


# ── Date / price parsing ────────────────────────────────────────


def test_parse_date_dd_mm_yyyy() -> None:
    dt = _parse_date("04/04/2026")
    assert dt is not None
    assert dt.day == 4
    assert dt.month == 4
    assert dt.year == 2026


def test_parse_date_dd_mm_yyyy_dash() -> None:
    dt = _parse_date("04-01-2026")
    assert dt is not None
    assert dt.day == 4
    assert dt.month == 1
    assert dt.year == 2026


def test_parse_date_with_time() -> None:
    dt = _parse_date("24/02/2026 23:59")
    assert dt is not None
    assert dt.day == 24
    assert dt.hour == 23
    assert dt.minute == 59


def test_parse_date_none() -> None:
    assert _parse_date(None) is None
    assert _parse_date("") is None


def test_parse_price_euro() -> None:
    assert _parse_price("23.70€") == 23.70
    assert _parse_price("10,00€") == 10.0
    assert _parse_price("8€") == 8.0
    assert _parse_price("16.00€") == 16.0


def test_parse_price_none() -> None:
    assert _parse_price(None) is None
    assert _parse_price("free") is None


# ── Sport types / distance ──────────────────────────────────────


def test_guess_sport_types_trail() -> None:
    scraper = Lap2GoScraper()
    types = scraper._guess_sport_types("Trilhos Termais", "Trail running noturno")
    assert "TRAIL" in types


def test_guess_sport_types_running() -> None:
    scraper = Lap2GoScraper()
    types = scraper._guess_sport_types("Meia-Maratona de Cascais", "corrida")
    assert "RUNNING" in types


def test_guess_sport_types_ocr() -> None:
    scraper = Lap2GoScraper()
    types = scraper._guess_sport_types("Spartan Race", "OCR obstacle")
    assert "OCR" in types


def test_guess_sport_types_default() -> None:
    scraper = Lap2GoScraper()
    types = scraper._guess_sport_types("Evento Genérico", None)
    assert types == ["RUNNING"]


def test_guess_distance() -> None:
    assert Lap2GoScraper._guess_distance("Trail Longo 20km") == 20.0
    assert Lap2GoScraper._guess_distance("Caminhada 6 km") == 6.0
    assert Lap2GoScraper._guess_distance("No distance") is None


# ── HTML extraction (unit) ──────────────────────────────────────

_SAMPLE_EVENT_HTML = """\
<html>
<head>
  <meta property="og:title" content="Lap2Go - LAAC Trail | 01/03/2026"/>
  <meta property="og:description" content="Trail em Águeda"/>
  <meta property="og:image" content="https://s3.lap2go.com/events/banner.jpg"/>
</head>
<body>
<section class="evento-page-title interior-page">
  <div class="container text-center"><h1>LAAC Trail</h1></div>
</section>
<section class="evento-page-details">
  <div class="row row-evento-details">
    <div class="col-md-5 evento-single-img">
      <a class="btn-reg" href="/pt/event/laac-trail-2026/regulamento.html">Regulamento</a>
    </div>
    <div class="col-md-7 evento-single-details">
      <span class="evento-local" itemprop="location">
        <h3>Local</h3>
        <p itemprop="name">Aguada de Cima, Águeda</p>
      </span>
      <span class="evento-data">
        <h3>Data</h3>
        <p class="dpn" content="01/03/2026" itemprop="startDate"></p>
        <p class="dpn" content="02/03/2026" itemprop="endDate"></p>
        <p>01/03/2026</p>
      </span>
      <span class="evento-data">
        <h3>Inscrições terminam em</h3>
        <p>24/02/2026 23:59</p>
      </span>
      <span class="evento-detl">
        <h3>Descrição</h3>
        <p>O LAAC Trail vai decorrer em Águeda.</p>
      </span>
      <span class="evento-org">
        <h3>Organizador</h3>
        <p content="LAAC" itemprop="performer">LAAC</p>
      </span>
      <span class="evento-site">
        <h3>Site</h3>
        <p><a href="http://fb.com/laac" target="_blank">http://fb.com/laac</a></p>
      </span>
    </div>
  </div>
  <div class="col-md-12 evento-fases-preços">
    <h3 class="fp-header">Fases de Preço</h3>
    <table>
      <tr>
        <th class="th-plus-responsive"></th>
        <th class="th-fpempty"></th>
        <th class="th-fpdates">16-01-2026<br/>31-01-2026</th>
        <th class="th-fpdates">01-02-2026<br/>24-02-2026</th>
      </tr>
      <tr class="tr-stripped">
        <td class="td-plus-responsive"></td>
        <td class="td-fpprova">longo</td>
        <td class="td-fpvalor">16.00€</td>
        <td class="td-fpvalor">18.00€</td>
      </tr>
    </table>
    <table>
      <tr>
        <th class="th-plus-responsive"></th>
        <th class="th-fpempty"></th>
        <th class="th-fpdates">16-01-2026<br/>31-01-2026</th>
        <th class="th-fpdates">01-02-2026<br/>24-02-2026</th>
      </tr>
      <tr class="tr-stripped">
        <td class="td-plus-responsive"></td>
        <td class="td-fpprova">curto</td>
        <td class="td-fpvalor">14.00€</td>
        <td class="td-fpvalor">16.00€</td>
      </tr>
    </table>
  </div>
</section>
</body>
</html>
"""

_SAMPLE_LIST_HTML = """\
<html><body>
<div class="calendario-events-month" id="01">
  <h2>Janeiro</h2>
  <div class="row">
    <a class="event-item" href="/pt/event/trail-reis-2026"
       data-name="Trail dos Reis" data-city="Baltar, Paredes" data-day="04-01-2026">
      <div class="col-md-4 eventItem fade-in">
        <div class="calendario-event-square">
          <p class="calendario-day">04</p>
          <h3 class="calendario-prova">Trail dos Reis</h3>
          <p class="calendario-city">Baltar, Paredes</p>
        </div>
        <div class="cal-event-types">
          <div class="col-md-6 type-icon-div type-walk"><span class="type-icon"></span></div>
          <div class="col-md-6 type-icon-div type-run"><span class="type-icon"></span></div>
        </div>
      </div>
    </a>
    <a class="event-item" href="/pt/event/raid-btt-2026"
       data-name="Raid BTT" data-city="Mira" data-day="10-01-2026">
      <div class="col-md-4 eventItem fade-in">
        <div class="calendario-event-square">
          <p class="calendario-day">10</p>
          <h3 class="calendario-prova">Raid BTT</h3>
          <p class="calendario-city">Mira</p>
        </div>
        <div class="cal-event-types">
          <div class="col-md-12 type-icon-div type-btt"><span class="type-icon"></span></div>
        </div>
      </div>
    </a>
  </div>
</div>
</body></html>
"""


def test_extract_event_cards() -> None:
    scraper = Lap2GoScraper()
    soup = BeautifulSoup(_SAMPLE_LIST_HTML, "lxml")
    cards = scraper._extract_event_cards(soup)
    assert len(cards) == 2
    assert cards[0].name == "Trail dos Reis"
    assert cards[0].city == "Baltar, Paredes"
    assert cards[0].day == "04-01-2026"
    assert "WALKING" in cards[0].sport_types
    assert "RUNNING" in cards[0].sport_types
    assert cards[1].name == "Raid BTT"
    assert "BTT" in cards[1].sport_types


def test_extract_title() -> None:
    scraper = Lap2GoScraper()
    soup = BeautifulSoup(_SAMPLE_EVENT_HTML, "lxml")
    assert scraper._extract_title(soup) == "LAAC Trail"


def test_extract_location() -> None:
    scraper = Lap2GoScraper()
    soup = BeautifulSoup(_SAMPLE_EVENT_HTML, "lxml")
    city, full = scraper._extract_location(soup)
    assert city == "Águeda"
    assert full == "Aguada de Cima, Águeda"


def test_extract_dates() -> None:
    scraper = Lap2GoScraper()
    soup = BeautifulSoup(_SAMPLE_EVENT_HTML, "lxml")
    start, end = scraper._extract_dates(soup)
    assert start is not None
    assert start.day == 1
    assert start.month == 3
    assert start.year == 2026
    assert end is not None
    assert end.day == 2


def test_extract_deadline() -> None:
    scraper = Lap2GoScraper()
    soup = BeautifulSoup(_SAMPLE_EVENT_HTML, "lxml")
    assert scraper._extract_deadline(soup) == "24/02/2026 23:59"


def test_extract_organizer() -> None:
    scraper = Lap2GoScraper()
    soup = BeautifulSoup(_SAMPLE_EVENT_HTML, "lxml")
    assert scraper._extract_organizer(soup) == "LAAC"


def test_extract_site() -> None:
    scraper = Lap2GoScraper()
    soup = BeautifulSoup(_SAMPLE_EVENT_HTML, "lxml")
    assert scraper._extract_site(soup) == "http://fb.com/laac"


def test_extract_image() -> None:
    scraper = Lap2GoScraper()
    soup = BeautifulSoup(_SAMPLE_EVENT_HTML, "lxml")
    assert scraper._extract_image(soup) == "https://s3.lap2go.com/events/banner.jpg"


def test_extract_variants_and_pricing() -> None:
    scraper = Lap2GoScraper()
    soup = BeautifulSoup(_SAMPLE_EVENT_HTML, "lxml")
    variants, pricing, raw_text = scraper._extract_variants_and_pricing(soup)
    assert len(variants) == 2
    assert variants[0].name == "longo"
    assert variants[1].name == "curto"
    assert len(pricing) == 4  # 2 variants × 2 phases
    assert pricing[0].variant_name == "longo"
    assert pricing[0].price == 16.0
    assert pricing[1].price == 18.0
    assert pricing[2].variant_name == "curto"
    assert pricing[2].price == 14.0


def test_extract_documents() -> None:
    """Test _extract_documents follows sub-pages and resolves real file URLs."""
    scraper = Lap2GoScraper()
    soup = BeautifulSoup(_SAMPLE_EVENT_HTML, "lxml")

    # Simulate the regulamento sub-page returning an S3 PDF link
    sub_page_html = """<html><body>
    <a href="https://s3.lap2go.com/events/2026/trail/Regulamento-min.pdf">Abrir Regulamento</a>
    </body></html>"""

    import asyncio

    async def _run():
        with patch.object(scraper, "fetch_page", new_callable=AsyncMock, return_value=sub_page_html):
            return await scraper._extract_documents(soup, "https://lap2go.com/pt/event/laac-trail-2026")

    docs = asyncio.get_event_loop().run_until_complete(_run())
    assert len(docs) >= 1
    reg = [d for d in docs if d.document_type == "regulation"]
    assert len(reg) == 1
    assert reg[0].original_url == "https://s3.lap2go.com/events/2026/trail/Regulamento-min.pdf"
    assert reg[0].mime_type == "application/pdf"


def test_extract_documents_fallback() -> None:
    """When resolution fails, fallback to the HTML page URL."""
    scraper = Lap2GoScraper()
    soup = BeautifulSoup(_SAMPLE_EVENT_HTML, "lxml")

    import asyncio

    async def _run():
        with patch.object(scraper, "fetch_page", new_callable=AsyncMock, side_effect=Exception("network")):
            return await scraper._extract_documents(soup, "https://lap2go.com/pt/event/laac-trail-2026")

    docs = asyncio.get_event_loop().run_until_complete(_run())
    assert len(docs) >= 1
    reg = [d for d in docs if d.document_type == "regulation"]
    assert len(reg) == 1
    assert "regulamento" in reg[0].original_url


def test_guess_mime() -> None:
    assert Lap2GoScraper._guess_mime("https://s3.lap2go.com/file.pdf") == "application/pdf"
    assert Lap2GoScraper._guess_mime("https://s3.lap2go.com/img.jpg") == "image/jpeg"
    assert Lap2GoScraper._guess_mime("https://s3.lap2go.com/img.png") == "image/png"
    assert Lap2GoScraper._guess_mime("https://s3.lap2go.com/file.doc") is None
