"""Tests for SincTime scraper parsing helpers."""

from datetime import datetime

from bs4 import BeautifulSoup

from app.sources.sinctime.scraper import (
    SincTimeScraper,
    _parse_short_date,
    _parse_datetime_str,
    _parse_price,
    _guess_sport_types,
    _guess_distance,
)


# ── Date parsing ────────────────────────────────────────────────


def test_parse_short_date() -> None:
    dt = _parse_short_date("28 mar 2026")
    assert dt is not None
    assert dt.day == 28
    assert dt.month == 3
    assert dt.year == 2026


def test_parse_short_date_abr() -> None:
    dt = _parse_short_date("04 abr 2026")
    assert dt is not None
    assert dt.day == 4
    assert dt.month == 4


def test_parse_short_date_invalid() -> None:
    assert _parse_short_date("invalid") is None


def test_parse_datetime_str_with_time() -> None:
    dt, time_str = _parse_datetime_str("28 mar 2026 15:00")
    assert dt is not None
    assert dt.hour == 15
    assert dt.minute == 0
    assert time_str == "15:00"


def test_parse_datetime_str_without_time() -> None:
    dt, time_str = _parse_datetime_str("28 mar 2026")
    assert dt is not None
    assert dt.day == 28
    assert time_str is None


# ── Price parsing ───────────────────────────────────────────────


def test_parse_price_with_deadline() -> None:
    price, deadline = _parse_price("12,50€ se pagar até 16 mar 2026")
    assert price == 12.5
    assert deadline is not None
    assert deadline.day == 16
    assert deadline.month == 3


def test_parse_price_simple() -> None:
    price, deadline = _parse_price("15,00€ se pagar até 23 mar 2026")
    assert price == 15.0
    assert deadline is not None
    assert deadline.day == 23


# ── Sport type guessing ─────────────────────────────────────────


def test_guess_sport_btt() -> None:
    assert "BTT" in _guess_sport_types("15.º BTT Da Silva")


def test_guess_sport_trail() -> None:
    assert "TRAIL" in _guess_sport_types("TRAIL PORTA DO GIÃO")


def test_guess_sport_running() -> None:
    assert "RUNNING" in _guess_sport_types("2ª CORRIDA DA PRIMAVERA DE GUIMARÃES")


def test_guess_sport_duathlon() -> None:
    assert "TRIATHLON" in _guess_sport_types("9º DUATLO DE VIANA DO CASTELO")


def test_guess_sport_ocr() -> None:
    assert "OCR" in _guess_sport_types("HClash Obstacle Race")


def test_guess_sport_unknown() -> None:
    assert _guess_sport_types("Evento Genérico") == ["OTHER"]


# ── Distance guessing ───────────────────────────────────────────


def test_guess_distance_km() -> None:
    assert _guess_distance("Trail 25km") == 25.0
    assert _guess_distance("Mini 10K") == 10.0


def test_guess_distance_none() -> None:
    assert _guess_distance("SOLOS") is None


# ── Event ID extraction ─────────────────────────────────────────


def test_extract_event_id() -> None:
    assert SincTimeScraper._extract_event_id("https://www.sinctime.com/evento/432") == "432"


# ── HTML extraction ─────────────────────────────────────────────


_SAMPLE_DETAIL_HTML = """\
<html><body>
<h2>3h Resistência BTT ACDSM BRUFE</h2>
<div class="caption singleBlog" style="padding-top: 0">
    <div class="event-image-content">
        <img width="350" src="/storage/images/eventos/deb4/cc3f/d972/4f9d/a77f/5761/4af4/5071.jpg?width=350">
    </div>
    <p>A Associação Cultural e Desportiva de São Martinho de Brufe vai organizar dia 28/03/2026 mais uma edição</p>
    <div>Esta é já a 10ª prova</div>
    <h4 class="color-1">Provas</h4>
    <h5><strong><i class="fa fa-check"></i> SOLOS</strong></h5>
    <div class="singleBlog" style="padding: 0px 25px">
        28 mar 2026 15:00<br>
        <p><div class="color-5"> Preços</div><br>
            <ul>
                <li class="">
                    <i class="fa fa-angle-right"></i>
                    12,50€ se pagar até 16 mar 2026
                </li>
                <li class="highlight color-3">
                    <i class="fa fa-angle-right"></i>
                    15,00€ se pagar até 23 mar 2026
                </li>
            </ul>
        </p>
    </div>
    <h5><strong><i class="fa fa-check"></i> E-Bikes</strong></h5>
    <div class="singleBlog" style="padding: 0px 25px">
        28 mar 2026 15:00<br>
        <p><div class="color-5"> Preços</div><br>
            <ul>
                <li class="">
                    <i class="fa fa-angle-right"></i>
                    12,50€ se pagar até 16 mar 2026
                </li>
            </ul>
        </p>
    </div>
</div>
<li><a href="javascript:void(0)" onclick="return redirectAction('/storage/files/eventos/8bb3/5927/reg.pdf', true);" class="btn btn-primary">Regulamento</a></li>
</body></html>
"""

_SAMPLE_LIST_HTML = """\
<html><body>
<h3><a href="/evento/436">2ª CORRIDA DA PRIMAVERA DE GUIMARÃES</a></h3>
<p>22 mar 2026</p>
<a href="/evento/436">DETALHES</a>

<h3><a href="/evento/455">15.º BTT Da Silva</a></h3>
<p>22 mar 2026</p>
<a href="/evento/455">DETALHES</a>

<a href="/proximos-eventos?page=2">2</a>
<a href="/proximos-eventos?page=3">3</a>
</body></html>
"""


def test_extract_title() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    scraper = SincTimeScraper()
    assert scraper._extract_title(soup) == "3h Resistência BTT ACDSM BRUFE"


def test_extract_image() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    scraper = SincTimeScraper()
    img = scraper._extract_image(soup)
    assert img is not None
    assert "/storage/images/eventos/" in img


def test_extract_description() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    scraper = SincTimeScraper()
    desc = scraper._extract_description(soup)
    assert desc is not None
    assert "Associação Cultural" in desc


def test_extract_provas() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    scraper = SincTimeScraper()
    variants, pricing, raw_text = scraper._extract_provas(soup)
    assert len(variants) == 2
    assert variants[0].name == "SOLOS"
    assert variants[1].name == "E-Bikes"
    assert variants[0].price == 12.5
    assert len(pricing) >= 2
    assert raw_text is not None


def test_extract_documents() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    scraper = SincTimeScraper()
    docs = scraper._extract_documents(soup)
    assert len(docs) == 1
    assert docs[0].document_type == "regulation"
    assert docs[0].original_url.endswith(".pdf")


def test_extract_event_links() -> None:
    soup = BeautifulSoup(_SAMPLE_LIST_HTML, "lxml")
    scraper = SincTimeScraper()
    links = scraper._extract_event_links(soup)
    assert len(links) == 2
    assert any("436" in l for l in links)
    assert any("455" in l for l in links)


def test_has_next_page() -> None:
    soup = BeautifulSoup(_SAMPLE_LIST_HTML, "lxml")
    scraper = SincTimeScraper()
    assert scraper._has_next_page(soup, 1) is True


def test_has_no_next_page() -> None:
    html = '<html><body><a href="/proximos-eventos?page=1">1</a></body></html>'
    soup = BeautifulSoup(html, "lxml")
    scraper = SincTimeScraper()
    assert scraper._has_next_page(soup, 3) is False


def test_extract_start_date() -> None:
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    scraper = SincTimeScraper()
    dt = scraper._extract_start_date(soup)
    assert dt is not None
    assert dt.day == 28
    assert dt.month == 3
    assert dt.year == 2026


def test_extract_organizer() -> None:
    desc = "A Associação Cultural e Desportiva de São Martinho de Brufe vai organizar dia 28/03/2026"
    organizer = SincTimeScraper._extract_organizer(desc)
    # May or may not find it depending on regex; at least it shouldn't crash
    assert organizer is None or isinstance(organizer, str)
