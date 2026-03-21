"""Tests for Federação de Triatlo de Portugal scraper."""

import textwrap
from datetime import datetime

from bs4 import BeautifulSoup

from app.sources.triatlo.scraper import (
    TriatloScraper,
    _guess_sport_types,
    _parse_schema_date,
    _event_id_from_div,
)


# ── Date parsing ─────────────────────────────────────────────────


def test_parse_schema_date_full() -> None:
    dt = _parse_schema_date("2026-3-15")
    assert dt is not None
    assert dt == datetime(2026, 3, 15)


def test_parse_schema_date_zero_padded() -> None:
    dt = _parse_schema_date("2026-01-25")
    assert dt is not None
    assert dt == datetime(2026, 1, 25)


def test_parse_schema_date_with_time() -> None:
    dt = _parse_schema_date("2026-03-15T10:26:00")
    assert dt is not None
    assert dt == datetime(2026, 3, 15, 10, 26, 0)


def test_parse_schema_date_none() -> None:
    assert _parse_schema_date(None) is None
    assert _parse_schema_date("") is None


def test_parse_schema_date_garbage() -> None:
    assert _parse_schema_date("not-a-date") is None


# ── Sport type guessing ──────────────────────────────────────────


def test_guess_triathlon() -> None:
    assert "TRIATHLON" in _guess_sport_types("XII Triatlo de Albufeira")


def test_guess_duathlon() -> None:
    types = _guess_sport_types("XVI Duatlo Cross João Campos")
    assert "DUATHLON" in types


def test_guess_aquathlon() -> None:
    types = _guess_sport_types("I Aquatlo Jovem de Tavira")
    assert "AQUATHLON" in types


def test_guess_paratriathlon() -> None:
    types = _guess_sport_types(
        "Camp. Nac. Paratriatlo", "Lista Inscritos Camp. Nac. Paratriatlo"
    )
    assert "PARATRIATHLON" in types


def test_guess_default_triathlon() -> None:
    types = _guess_sport_types("Evento Genérico Sem Tipo Claro")
    assert types == ["TRIATHLON"]


def test_guess_from_subtitle() -> None:
    types = _guess_sport_types(
        "Evento X",
        "CAMPEONATO NACIONAL INDIVIDUAL DE TRIATLO SUPER-SPRINT",
    )
    assert "TRIATHLON" in types


# ── Event ID extraction ──────────────────────────────────────────


def test_event_id_from_data_attr() -> None:
    html = '<div data-event_id="105064" class="eventon_list_event"></div>'
    soup = BeautifulSoup(html, "html.parser")
    div = soup.find("div")
    assert _event_id_from_div(div) == "105064"


def test_event_id_from_id_attr() -> None:
    html = '<div id="event_105064" class="eventon_list_event"></div>'
    soup = BeautifulSoup(html, "html.parser")
    div = soup.find("div")
    assert _event_id_from_div(div) == "105064"


def test_event_id_missing() -> None:
    html = '<div class="eventon_list_event"></div>'
    soup = BeautifulSoup(html, "html.parser")
    div = soup.find("div")
    assert _event_id_from_div(div) is None


# ── Calendar parsing ─────────────────────────────────────────────

_CALENDAR_HTML = textwrap.dedent("""\
<html><body>
<div class="eventon_list_event evo_eventtop event"
     data-event_id="105064" data-time="1773570360-1773570360"
     id="event_105064">
  <div class="evo_event_schema" style="display:none">
    <a href="https://www.federacao-triatlo.pt/ftp2015/events/xii-triatlo-de-albufeira/"
       itemprop="url"></a>
    <span itemprop="name">XII Triatlo de Albufeira</span>
    <meta itemprop="image"
          content="https://example.com/img.png"/>
    <meta itemprop="startDate" content="2026-3-15"/>
    <meta itemprop="endDate" content="2026-3-15"/>
  </div>
</div>
<div class="eventon_list_event evo_eventtop event"
     data-event_id="105065" id="event_105065">
  <div class="evo_event_schema" style="display:none">
    <a href="https://www.federacao-triatlo.pt/ftp2015/events/xiv-duatlo-cross-de-famalicao/"
       itemprop="url"></a>
    <span itemprop="name">Duatlo Cross de Famalicão</span>
    <meta itemprop="image" content=""/>
    <meta itemprop="startDate" content="2026-3-22"/>
    <meta itemprop="endDate" content="2026-3-22"/>
  </div>
</div>
<!-- Duplicate URL — must be deduplicated -->
<div class="eventon_list_event evo_eventtop event"
     data-event_id="105064" id="event_105064_dup">
  <div class="evo_event_schema" style="display:none">
    <a href="https://www.federacao-triatlo.pt/ftp2015/events/xii-triatlo-de-albufeira/"
       itemprop="url"></a>
    <span itemprop="name">XII Triatlo de Albufeira</span>
    <meta itemprop="startDate" content="2026-3-15"/>
    <meta itemprop="endDate" content="2026-3-15"/>
  </div>
</div>
</body></html>
""")


def test_parse_calendar_extracts_events() -> None:
    scraper = TriatloScraper()
    entries = scraper._parse_calendar(_CALENDAR_HTML)
    assert len(entries) == 2


def test_parse_calendar_first_event() -> None:
    scraper = TriatloScraper()
    entries = scraper._parse_calendar(_CALENDAR_HTML)
    e = entries[0]
    assert "xii-triatlo-de-albufeira" in e["url"]
    assert e["name"] == "XII Triatlo de Albufeira"
    assert e["start"] == datetime(2026, 3, 15)
    assert e["end"] == datetime(2026, 3, 15)
    assert e["image"] == "https://example.com/img.png"
    assert e["event_id"] == "105064"


def test_parse_calendar_empty_image() -> None:
    scraper = TriatloScraper()
    entries = scraper._parse_calendar(_CALENDAR_HTML)
    # Second event has empty image content
    e = entries[1]
    assert e["image"] is None


def test_parse_calendar_deduplicates() -> None:
    scraper = TriatloScraper()
    entries = scraper._parse_calendar(_CALENDAR_HTML)
    urls = [e["url"] for e in entries]
    assert len(urls) == len(set(urls))


# ── Regulamento extraction ───────────────────────────────────────

_DETAIL_HTML = textwrap.dedent("""\
<html><body>
<div class="eventon_desc_in" itemprop="description">
  <p><a href="https://example.com/regulamento-triatlo.pdf"
        target="_blank">Regulamento XII Triatlo de Albufeira</a></p>
  <p><a href="https://example.com/percursos-triatlo.pdf"
        target="_blank">Percursos XII Triatlo de Albufeira</a></p>
  <p><a href="https://example.com/lista-inscritos-cadetes.pdf"
        target="_blank">Lista Inscritos Camp. Nac. Cadetes</a></p>
  <p><a href="https://example.com/lista-inscritos-elites.pdf"
        target="_blank">Lista Inscritos Camp. Nac. Individual – Elites</a></p>
</div>
<span itemprop="name">XII Triatlo de Albufeira</span>
<span class="evcal_event_subtitle">CAMPEONATO NACIONAL INDIVIDUAL</span>
<meta itemprop="image" content="https://example.com/poster.png"/>
<meta itemprop="startDate" content="2026-3-15"/>
<meta itemprop="endDate" content="2026-3-15"/>
<div data-event_id="105064"></div>
</body></html>
""")


def test_extract_regulamento_only() -> None:
    scraper = TriatloScraper()
    soup = BeautifulSoup(_DETAIL_HTML, "lxml")
    docs = scraper._extract_regulamento(soup)
    assert len(docs) == 1
    assert docs[0].document_type == "regulation"
    assert "regulamento" in docs[0].original_url
    assert docs[0].mime_type == "application/pdf"


def test_extract_regulamento_file_name() -> None:
    scraper = TriatloScraper()
    soup = BeautifulSoup(_DETAIL_HTML, "lxml")
    docs = scraper._extract_regulamento(soup)
    assert docs[0].file_name == "regulamento-triatlo.pdf"


def test_extract_regulamento_ignores_other_pdfs() -> None:
    scraper = TriatloScraper()
    soup = BeautifulSoup(_DETAIL_HTML, "lxml")
    docs = scraper._extract_regulamento(soup)
    urls = [d.original_url for d in docs]
    assert all("regulamento" in u for u in urls)
    assert not any("percursos" in u for u in urls)
    assert not any("lista" in u for u in urls)


def test_extract_regulamento_empty() -> None:
    html = '<html><body><div class="eventon_desc_in"></div></body></html>'
    scraper = TriatloScraper()
    soup = BeautifulSoup(html, "lxml")
    docs = scraper._extract_regulamento(soup)
    assert docs == []


def test_extract_regulamento_no_desc_div() -> None:
    html = "<html><body></body></html>"
    scraper = TriatloScraper()
    soup = BeautifulSoup(html, "lxml")
    docs = scraper._extract_regulamento(soup)
    assert docs == []


# ── Detail-page helpers ──────────────────────────────────────────


def test_extract_title() -> None:
    scraper = TriatloScraper()
    soup = BeautifulSoup(_DETAIL_HTML, "lxml")
    assert scraper._extract_title(soup) == "XII Triatlo de Albufeira"


def test_extract_subtitle() -> None:
    scraper = TriatloScraper()
    soup = BeautifulSoup(_DETAIL_HTML, "lxml")
    assert scraper._extract_subtitle(soup) == "CAMPEONATO NACIONAL INDIVIDUAL"


def test_extract_image() -> None:
    scraper = TriatloScraper()
    soup = BeautifulSoup(_DETAIL_HTML, "lxml")
    assert scraper._extract_image(soup) == "https://example.com/poster.png"


def test_extract_date() -> None:
    scraper = TriatloScraper()
    soup = BeautifulSoup(_DETAIL_HTML, "lxml")
    dt = scraper._extract_date(soup, "startDate")
    assert dt == datetime(2026, 3, 15)


def test_extract_event_id() -> None:
    scraper = TriatloScraper()
    soup = BeautifulSoup(_DETAIL_HTML, "lxml")
    assert scraper._extract_event_id(soup) == "105064"


def test_extract_image_missing() -> None:
    html = "<html><body></body></html>"
    scraper = TriatloScraper()
    soup = BeautifulSoup(html, "lxml")
    assert scraper._extract_image(soup) is None


# ── Multiple regulamento links ───────────────────────────────────


def test_multiple_regulamentos() -> None:
    html = textwrap.dedent("""\
    <html><body>
    <div class="eventon_desc_in">
      <p><a href="https://a.com/regulamento-geral.pdf">Regulamento Geral</a></p>
      <p><a href="https://a.com/regulamento-tecnico.pdf">Regulamento Técnico</a></p>
      <p><a href="https://a.com/percursos.pdf">Percursos</a></p>
    </div>
    </body></html>
    """)
    scraper = TriatloScraper()
    soup = BeautifulSoup(html, "lxml")
    docs = scraper._extract_regulamento(soup)
    assert len(docs) == 2
    assert all("regulamento" in d.original_url for d in docs)
