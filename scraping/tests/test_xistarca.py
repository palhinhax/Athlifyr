"""Tests for Xistarca scraper."""

from datetime import datetime

import pytest

from app.sources.xistarca.scraper import (
    XistarcaScraper,
    _extract_maps_url,
    _guess_sport_types,
    _parse_detail_date,
    _parse_listing_date,
    _parse_variant_line,
)


# ── Listing date parsing ────────────────────────────────────────


def test_parse_listing_date_standard() -> None:
    day, month, time = _parse_listing_date("11 de Abril -  / 09:30")
    assert day == 11
    assert month == 4
    assert time == "09:30"


def test_parse_listing_date_may() -> None:
    day, month, time = _parse_listing_date("1 de Maio -  / 10:00")
    assert day == 1
    assert month == 5
    assert time == "10:00"


def test_parse_listing_date_no_time() -> None:
    day, month, time = _parse_listing_date("25 de Abril")
    assert day == 25
    assert month == 4
    assert time is None


def test_parse_listing_date_invalid() -> None:
    day, month, time = _parse_listing_date("invalid")
    assert day is None
    assert month is None


def test_parse_listing_date_december() -> None:
    day, month, time = _parse_listing_date("25 de Dezembro -  / 08:00")
    assert day == 25
    assert month == 12
    assert time == "08:00"


# ── Detail date parsing ──────────────────────────────────────────


def test_parse_detail_date_standard() -> None:
    dt = _parse_detail_date("11 ABRIL 2026")
    assert dt == datetime(2026, 4, 11)


def test_parse_detail_date_lowercase() -> None:
    dt = _parse_detail_date("3 maio 2026")
    assert dt == datetime(2026, 5, 3)


def test_parse_detail_date_march() -> None:
    dt = _parse_detail_date("15 Março 2026")
    assert dt == datetime(2026, 3, 15)


def test_parse_detail_date_invalid() -> None:
    assert _parse_detail_date("no date") is None


def test_parse_detail_date_empty() -> None:
    assert _parse_detail_date("") is None


# ── Variant line parsing ─────────────────────────────────────────


def test_parse_variant_corrida_10km() -> None:
    result = _parse_variant_line("» Corrida 10km | 10h00")
    assert result is not None
    name, dist, time = result
    assert name == "Corrida 10km"
    assert dist == 10.0
    assert time == "10:00"


def test_parse_variant_caminhada_5km() -> None:
    result = _parse_variant_line("» Caminhada 5km | 10h05")
    assert result is not None
    name, dist, time = result
    assert name == "Caminhada 5km"
    assert dist == 5.0
    assert time == "10:05"


def test_parse_variant_kids_500m() -> None:
    result = _parse_variant_line("» Kids Race 500m | 09h30")
    assert result is not None
    name, dist, time = result
    assert name == "Kids Race 500m"
    assert dist == pytest.approx(0.5)
    assert time == "09:30"


def test_parse_variant_trail_longo() -> None:
    result = _parse_variant_line("» Trail Longo 17km | 18h45")
    assert result is not None
    name, dist, time = result
    assert name == "Trail Longo 17km"
    assert dist == 17.0
    assert time == "18:45"


def test_parse_variant_trail_sprint() -> None:
    result = _parse_variant_line("» Trail Sprint 12km | 18h20")
    assert result is not None
    _, dist, _ = result
    assert dist == 12.0


def test_parse_variant_caminhada_8km() -> None:
    result = _parse_variant_line("» Caminhada 8km | 18h30")
    assert result is not None
    _, dist, time = result
    assert dist == 8.0
    assert time == "18:30"


def test_parse_variant_trail_kids_1km() -> None:
    result = _parse_variant_line("» Trail Kids 1km | 17h30")
    assert result is not None
    _, dist, time = result
    assert dist == 1.0
    assert time == "17:30"


def test_parse_variant_no_bullet() -> None:
    result = _parse_variant_line("Corrida 10km | 10h00")
    assert result is None


def test_parse_variant_no_distance() -> None:
    result = _parse_variant_line("» Cerimónia de entrega de prémios | 20h30")
    assert result is not None
    name, dist, time = result
    assert dist is None
    assert time == "20:30"


def test_parse_variant_time_colon() -> None:
    result = _parse_variant_line("» Corrida 10km | 10:00")
    assert result is not None
    _, _, time = result
    assert time == "10:00"


# ── Sport type guessing ──────────────────────────────────────────


def test_guess_sport_types_corrida() -> None:
    assert _guess_sport_types("Corrida Solidária 2026") == ["RUNNING"]


def test_guess_sport_types_trail() -> None:
    result = _guess_sport_types("Barreiro Machada Trail Noturno")
    assert "TRAIL" in result


def test_guess_sport_types_caminhada() -> None:
    result = _guess_sport_types("Caminhada da Liberdade")
    assert "WALKING" in result


def test_guess_sport_types_kids() -> None:
    result = _guess_sport_types("Kids Race")
    assert "RUNNING" in result


def test_guess_sport_types_unknown() -> None:
    result = _guess_sport_types("Evento Especial")
    assert result == ["RUNNING"]


def test_guess_sport_types_trail_and_running() -> None:
    result = _guess_sport_types("Trail Run Corrida")
    assert "TRAIL" in result
    assert "RUNNING" in result


# ── Maps URL extraction ──────────────────────────────────────────


def test_extract_maps_url() -> None:
    from bs4 import BeautifulSoup
    html = '<html><body><a href="https://maps.app.goo.gl/abc123">Map</a></body></html>'
    soup = BeautifulSoup(html, "lxml")
    assert _extract_maps_url(soup) == "https://maps.app.goo.gl/abc123"


def test_extract_maps_url_none() -> None:
    from bs4 import BeautifulSoup
    html = '<html><body><a href="https://example.com">Link</a></body></html>'
    soup = BeautifulSoup(html, "lxml")
    assert _extract_maps_url(soup) is None


# ── Listing page parsing ────────────────────────────────────────


_LISTING_HTML = """
<html><body>
<div class="event-list">
<ul class="clearfix row">
<li class="col-md-4 col-sm-6 event-feature" onclick="window.location='https://xistarca.pt/eventos/corrida-teste-2026';">
  <div class="event-base">
    <div class="event-date">11 de Abril -  / 09:30</div>
    <div class="event-title"><h2>Corrida Teste 2026</h2></div>
    <div class="event-location">Lisboa</div>
    <div class="event-button">Inscreva-se Já</div>
  </div>
</li>
<li class="col-md-4 col-sm-6 event-feature" onclick="window.location='https://xistarca.pt/eventos/trail-noturno';">
  <div class="event-base">
    <div class="event-date">25 de Abril -  / 18:00</div>
    <div class="event-title"><h2>Trail Noturno</h2></div>
    <div class="event-location">Barreiro</div>
    <div class="event-button">Inscreva-se Já</div>
  </div>
</li>
</ul>
</div>
</body></html>
"""


def test_parse_listing_count() -> None:
    scraper = XistarcaScraper()
    events = scraper._parse_listing(_LISTING_HTML)
    assert len(events) == 2


def test_parse_listing_first_event() -> None:
    scraper = XistarcaScraper()
    events = scraper._parse_listing(_LISTING_HTML)
    ev = events[0]
    assert ev["url"] == "https://xistarca.pt/eventos/corrida-teste-2026"
    assert ev["title"] == "Corrida Teste 2026"
    assert ev["location"] == "Lisboa"


def test_parse_listing_second_event() -> None:
    scraper = XistarcaScraper()
    events = scraper._parse_listing(_LISTING_HTML)
    ev = events[1]
    assert ev["url"] == "https://xistarca.pt/eventos/trail-noturno"
    assert ev["title"] == "Trail Noturno"
    assert ev["location"] == "Barreiro"


def test_parse_listing_empty() -> None:
    scraper = XistarcaScraper()
    events = scraper._parse_listing("<html><body></body></html>")
    assert events == []


# ── Detail page parsing ─────────────────────────────────────────


_DETAIL_HTML = """
<html><body>
<article class="event type-event status-publish has-post-thumbnail">
  <div class="main-event-image">
    <img class="wp-post-image" src="https://xistarca.pt/wp-content/uploads/event-750x380.jpg" />
  </div>
  <div class="col-lg-12">
    <h1><span style="color: #d40202;">Bem-vindo à 2ª Corrida Teste!</span></h1>
    <p>A Corrida Teste é um evento solidário em Lisboa para apoiar a comunidade local.</p>
    <p>Junte-se a nós!</p>
    <hr/>
    <h3><span style="color: #d40202;">DISTÂNCIA / HORA / LOCAL</span></h3>
    <p><strong>11 ABRIL 2026</strong>
    <a href="https://maps.app.goo.gl/abc123">Local de Partida</a> | Castanheira do Ribatejo</p>
    <p>» Corrida 10km | 10h00
    » Caminhada 5km | 10h05
    » Kids Race 500m | 09h30</p>
    <hr/>
    <h3><span style="color: #d40202;">INSCRIÇÕES</span></h3>
    <p>Inscrições abertas</p>
    <hr/>
    <h3><span style="color: #d40202;">MAPA/PERCURSOS</span></h3>
    <p>Percurso da corrida.</p>
    <a href="https://xistarca.pt/wp-content/uploads/regulamento.pdf">Regulamento</a>
    <hr/>
    <h3><span style="color: #d40202;">OUTRAS INFORMAÇÕES</span></h3>
    <p>Informação adicional.</p>
    <a href="https://xistarca.pt/wp-content/uploads/info.pdf">Info</a>
  </div>
</article>
</body></html>
"""


def test_parse_detail_title() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert event.title == "2ª Corrida Teste"


def test_parse_detail_description() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert "evento solidário" in event.description


def test_parse_detail_date() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert event.start_date == datetime(2026, 4, 11)


def test_parse_detail_city() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert event.city == "Castanheira do Ribatejo"


def test_parse_detail_image() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert "event-750x380.jpg" in event.image_url


def test_parse_detail_maps_url() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert event.google_maps_url == "https://maps.app.goo.gl/abc123"


def test_parse_detail_source_url() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert event.source_url == "https://xistarca.pt/eventos/corrida-teste-2026"


def test_parse_detail_organizer() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert event.organizer_name == "Xistarca"


def test_parse_detail_sport_types() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert "RUNNING" in event.sport_types


def test_parse_detail_variants_count() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert len(event.variants) == 3


def test_parse_detail_variant_corrida() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    v = event.variants[0]
    assert v.name == "Corrida 10km"
    assert v.distance_km == 10.0
    assert v.start_time == "10:00"


def test_parse_detail_variant_caminhada() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    v = event.variants[1]
    assert v.name == "Caminhada 5km"
    assert v.distance_km == 5.0
    assert v.start_time == "10:05"


def test_parse_detail_variant_kids() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    v = event.variants[2]
    assert v.name == "Kids Race 500m"
    assert v.distance_km == pytest.approx(0.5)
    assert v.start_time == "09:30"


def test_parse_detail_documents() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert len(event.documents) == 2
    urls = {d.original_url for d in event.documents}
    assert "https://xistarca.pt/wp-content/uploads/regulamento.pdf" in urls
    assert "https://xistarca.pt/wp-content/uploads/info.pdf" in urls


def test_parse_detail_country() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://xistarca.pt/eventos/corrida-teste-2026")
    assert event is not None
    assert event.country == "Portugal"


# ── Title cleaning ────────────────────────────────────────────────


def test_title_removes_bemvindo_ao() -> None:
    scraper = XistarcaScraper()
    html = '<html><body><h1>Bem-vindo ao Trail Noturno!</h1></body></html>'
    event = scraper._parse_event_detail(html, "https://xistarca.pt/eventos/x")
    assert event is not None
    assert event.title == "Trail Noturno"


def test_title_removes_bemvindo_a() -> None:
    scraper = XistarcaScraper()
    html = '<html><body><h1>Bem-vindo à 2ª Corrida!</h1></body></html>'
    event = scraper._parse_event_detail(html, "https://xistarca.pt/eventos/x")
    assert event is not None
    assert event.title == "2ª Corrida"


# ── No title returns None ────────────────────────────────────────


def test_parse_detail_no_title() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail("<html><body></body></html>", "https://xistarca.pt/eventos/x")
    assert event is None


# ── Trail event ───────────────────────────────────────────────────


_TRAIL_HTML = """
<html><body>
<article>
  <img class="wp-post-image" src="https://xistarca.pt/wp-content/uploads/trail.jpg" />
  <div class="col-lg-12">
    <h1>Bem-vindo ao Barreiro Machada Trail Noturno!</h1>
    <p>O Barreiro Machada Trail Noturno é um evento de trail running em ambiente noturno na Mata da Machada.</p>
    <hr/>
    <h3>DISTÂNCIA / HORA / LOCAL</h3>
    <p>Partida e chegada | Mata Nacional da Machada</p>
    <p>» Trail Kids 1km | 17h30
    » Trail Sprint 12km | 18h20
    » Caminhada 8km | 18h30
    » Trail Longo 17km | 18h45</p>
    <hr/>
    <h3>INSCRIÇÕES</h3>
    <p>Inscrições esgotadas</p>
    <hr/>
    <h3>PERCURSOS</h3>
    <p>Trail Longo 17km com 350m de desnível.</p>
    <a href="https://xistarca.pt/wp-content/uploads/REF-MACHADA.pdf">Regulamento</a>
  </div>
</article>
</body></html>
"""


def test_parse_trail_sport_types() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_TRAIL_HTML, "https://xistarca.pt/eventos/trail")
    assert event is not None
    assert "TRAIL" in event.sport_types


def test_parse_trail_variants_count() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_TRAIL_HTML, "https://xistarca.pt/eventos/trail")
    assert event is not None
    assert len(event.variants) == 4


def test_parse_trail_variant_longo() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_TRAIL_HTML, "https://xistarca.pt/eventos/trail")
    assert event is not None
    v = event.variants[3]
    assert v.name == "Trail Longo 17km"
    assert v.distance_km == 17.0
    assert v.start_time == "18:45"


def test_parse_trail_walking_variant() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_TRAIL_HTML, "https://xistarca.pt/eventos/trail")
    assert event is not None
    # Walking variant should add WALKING to sport types
    assert "WALKING" in event.sport_types


def test_parse_trail_document() -> None:
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(_TRAIL_HTML, "https://xistarca.pt/eventos/trail")
    assert event is not None
    assert len(event.documents) == 1
    assert event.documents[0].file_name == "REF-MACHADA.pdf"


# ── Registry placement ───────────────────────────────────────────


def test_xistarca_in_registry() -> None:
    from app.sources.registry import _SCRAPERS
    assert "xistarca" in _SCRAPERS


def test_xistarca_before_racefinder() -> None:
    from app.sources.registry import _SCRAPERS
    keys = list(_SCRAPERS.keys())
    xi_idx = keys.index("xistarca")
    rf_idx = keys.index("racefinder")
    assert xi_idx < rf_idx


def test_racefinder_still_last() -> None:
    from app.sources.registry import _SCRAPERS
    keys = list(_SCRAPERS.keys())
    assert keys[-1] == "racefinder"


# ── Scraper metadata ─────────────────────────────────────────────


def test_scraper_source_name() -> None:
    scraper = XistarcaScraper()
    assert scraper.source_name == "xistarca"


def test_scraper_display_name() -> None:
    scraper = XistarcaScraper()
    assert scraper.display_name == "Xistarca"


def test_scraper_base_url() -> None:
    scraper = XistarcaScraper()
    assert scraper.base_url == "https://xistarca.pt"


# ── No documents when none ────────────────────────────────────────


def test_parse_detail_no_documents() -> None:
    html = """
    <html><body>
      <h1>Corrida Simples</h1>
      <p>Uma corrida simples sem regulamento.</p>
      <h3>DISTÂNCIA / HORA / LOCAL</h3>
      <p>15 MAIO 2026 | Lisboa</p>
      <p>» Corrida 10km | 09h00</p>
      <h3>INSCRIÇÕES</h3>
    </body></html>
    """
    scraper = XistarcaScraper()
    event = scraper._parse_event_detail(html, "https://xistarca.pt/eventos/simples")
    assert event is not None
    assert event.documents == []
