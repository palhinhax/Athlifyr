"""Tests for Cyclones Sports scraper."""

import textwrap
from datetime import datetime

from bs4 import BeautifulSoup

from app.sources.cyclones.scraper import (
    CyclonesScraper,
    _guess_sport_types,
    _parse_pt_date,
    _parse_pt_date_end,
    _slug_from_url,
)


# ── Date parsing ─────────────────────────────────────────────────


def test_parse_pt_date_simple() -> None:
    dt = _parse_pt_date("22 de março de 2026")
    assert dt == datetime(2026, 3, 22)


def test_parse_pt_date_range_start() -> None:
    dt = _parse_pt_date("18 e 19 de abril de 2026")
    assert dt == datetime(2026, 4, 18)


def test_parse_pt_date_end_range() -> None:
    dt = _parse_pt_date_end("18 e 19 de abril de 2026")
    assert dt == datetime(2026, 4, 19)


def test_parse_pt_date_end_no_range() -> None:
    assert _parse_pt_date_end("22 de março de 2026") is None


def test_parse_pt_date_none() -> None:
    assert _parse_pt_date(None) is None
    assert _parse_pt_date("") is None


def test_parse_pt_date_all_months() -> None:
    months = [
        ("janeiro", 1), ("fevereiro", 2), ("março", 3), ("abril", 4),
        ("maio", 5), ("junho", 6), ("julho", 7), ("agosto", 8),
        ("setembro", 9), ("outubro", 10), ("novembro", 11), ("dezembro", 12),
    ]
    for name, num in months:
        dt = _parse_pt_date(f"1 de {name} de 2026")
        assert dt is not None, f"Failed for {name}"
        assert dt.month == num


def test_parse_pt_date_garbage() -> None:
    assert _parse_pt_date("not a date") is None


# ── Sport type guessing ──────────────────────────────────────────


def test_guess_trail() -> None:
    types = _guess_sport_types("IX Trail do Pote Gondar e Orbacem")
    assert "TRAIL" in types


def test_guess_btt() -> None:
    types = _guess_sport_types("BTT AFIFE 2026")
    assert "BTT" in types


def test_guess_adventure() -> None:
    types = _guess_sport_types("FRANQUEIRA ADVENTURE 2026")
    assert "TRAIL" in types


def test_guess_from_activities() -> None:
    types = _guess_sport_types("Evento X", ["Caminhada", "Trail Curto"])
    assert "WALKING" in types
    assert "TRAIL" in types


def test_guess_trilhos() -> None:
    types = _guess_sport_types("VII Trilhos de Viana")
    assert "TRAIL" in types


def test_guess_default_trail() -> None:
    types = _guess_sport_types("Evento Genérico Sem Tipo")
    assert types == ["TRAIL"]


def test_guess_maratona() -> None:
    types = _guess_sport_types("Meia Maratona Manuela Machado")
    assert "RUNNING" in types


# ── Slug extraction ──────────────────────────────────────────────


def test_slug_from_url() -> None:
    url = "https://cyclonessports.com/index.php/351-ix-trail-do-pote-gondar-e-orbacem"
    assert _slug_from_url(url) == "351-ix-trail-do-pote-gondar-e-orbacem"


def test_slug_from_url_with_trailing_slash() -> None:
    url = "https://cyclonessports.com/index.php/351-ix-trail-do-pote/"
    assert _slug_from_url(url) == "351-ix-trail-do-pote"


def test_slug_from_url_none() -> None:
    assert _slug_from_url("https://cyclonessports.com/") is None


# ── Homepage parsing ─────────────────────────────────────────────

_HOMEPAGE_HTML = textwrap.dedent("""\
<html><body>
<article>
  <header class="article-header clearfix">
    <h2 class="article-title">IX Trail do Pote Gondar e Orbacem</h2>
  </header>
  <section class="article-intro clearfix">
    <div class="cyc-event row-fluid">
      <div class="span5">
        <p class="cyc-imagem">
          <a href="/images/Eventos/Cartazes/20260322_cartaz.jpg">
            <img alt="cartaz" src="/images/Eventos/Cartazes/20260322_cartaz.jpg"/>
          </a>
        </p>
      </div>
      <div class="span7">
        <p><span class="cyc-data">22 de março de 2026</span></p>
        <p><span class="cyc-local">Gondar - Caminha</span></p>
        <p><a class="btn" href="https://example.com/regulamento.pdf">
           <span class="fa fa-file-text-o"></span>Regulamento</a></p>
      </div>
    </div>
  </section>
  <section class="readmore">
    <a class="btn" href="/index.php/351-ix-trail-do-pote"><span>Ler mais...</span></a>
  </section>
</article>
<article>
  <header class="article-header clearfix">
    <h2 class="article-title">BTT AFIFE 2026</h2>
  </header>
  <section class="article-intro clearfix">
    <div class="cyc-event row-fluid">
      <div class="span7">
        <p><span class="cyc-data">19 de abril de 2026</span></p>
        <p><span class="cyc-local">Afife - Viana do Castelo</span></p>
        <p><a class="btn" href="https://example.com/btt_regulamento.pdf">
           Regulamento</a></p>
      </div>
    </div>
  </section>
  <section class="readmore">
    <a class="btn" href="/index.php/352-btt-afife-2026"><span>Ler mais...</span></a>
  </section>
</article>
</body></html>
""")


def test_parse_homepage_count() -> None:
    scraper = CyclonesScraper()
    entries = scraper._parse_homepage(_HOMEPAGE_HTML)
    assert len(entries) == 2


def test_parse_homepage_first_entry() -> None:
    scraper = CyclonesScraper()
    entries = scraper._parse_homepage(_HOMEPAGE_HTML)
    e = entries[0]
    assert e["title"] == "IX Trail do Pote Gondar e Orbacem"
    assert e["date_text"] == "22 de março de 2026"
    assert e["location"] == "Gondar - Caminha"
    assert "20260322_cartaz.jpg" in e["image_url"]
    assert e["regulamento_url"] == "https://example.com/regulamento.pdf"
    assert "351-ix-trail-do-pote" in e["detail_url"]


def test_parse_homepage_second_entry() -> None:
    scraper = CyclonesScraper()
    entries = scraper._parse_homepage(_HOMEPAGE_HTML)
    e = entries[1]
    assert e["title"] == "BTT AFIFE 2026"
    assert e["date_text"] == "19 de abril de 2026"
    assert e["image_url"] is None  # no img in this article


def test_parse_homepage_no_articles() -> None:
    html = "<html><body><p>Nothing here</p></body></html>"
    scraper = CyclonesScraper()
    entries = scraper._parse_homepage(html)
    assert entries == []


def test_parse_homepage_article_no_title() -> None:
    html = "<html><body><article><p>No H2</p></article></body></html>"
    scraper = CyclonesScraper()
    entries = scraper._parse_homepage(html)
    assert entries == []


# ── Detail page helpers ──────────────────────────────────────────

_DETAIL_HTML = textwrap.dedent("""\
<html><body>
<article>
  <h2>IX Trail do Pote Gondar e Orbacem</h2>
  <section class="article-content clearfix">
    <div class="cyc-event row-fluid">
      <div class="span5">
        <p class="cyc-imagem">
          <img alt="cartaz" src="/images/Eventos/Cartazes/20260322_cartaz.jpg"/>
        </p>
      </div>
      <div class="span7">
        <p><span class="cyc-data">22 de março de 2026</span></p>
        <p><span class="cyc-local">Gondar - Caminha</span></p>
        <p><a class="btn" href="https://example.com/regulamento.pdf">Regulamento</a></p>
      </div>
    </div>
    <div class="div-event row-fluid">
      <div class="span12 cyc-event invert">
        <p class="cyc-desc">Atividades/Provas:</p>
        <ul class="cyc-ativ">
          <li>Caminhada</li>
          <li>Trail Curto</li>
          <li>Trail Longo</li>
        </ul>
        <p class="cyc-desc">ORGANIZAÇÃO:</p>
        <ul class="cyc-organ">
          <li>ATP – ASSOCIAÇÃO TRAIL DO POTE</li>
        </ul>
      </div>
    </div>
  </section>
</article>
</body></html>
""")


def test_extract_activities() -> None:
    soup = BeautifulSoup(_DETAIL_HTML, "lxml")
    art = soup.find("article")
    activities = CyclonesScraper._extract_activities(art)
    assert activities == ["Caminhada", "Trail Curto", "Trail Longo"]


def test_extract_organizer() -> None:
    soup = BeautifulSoup(_DETAIL_HTML, "lxml")
    art = soup.find("article")
    org = CyclonesScraper._extract_organizer(art)
    assert org == "ATP – ASSOCIAÇÃO TRAIL DO POTE"


def test_extract_activities_empty() -> None:
    html = "<article><p>No activities</p></article>"
    soup = BeautifulSoup(html, "lxml")
    art = soup.find("article")
    assert CyclonesScraper._extract_activities(art) == []


def test_extract_organizer_none() -> None:
    html = "<article><p>No org</p></article>"
    soup = BeautifulSoup(html, "lxml")
    art = soup.find("article")
    assert CyclonesScraper._extract_organizer(art) is None


# ── City parsing ─────────────────────────────────────────────────


def test_parse_city_from_hyphen() -> None:
    assert CyclonesScraper._parse_city("Gondar - Caminha") == "Caminha"


def test_parse_city_single() -> None:
    assert CyclonesScraper._parse_city("Mondim de Basto") == "Mondim de Basto"


def test_parse_city_multiple_hyphens() -> None:
    assert CyclonesScraper._parse_city("Afife - Viana do Castelo") == "Viana do Castelo"


def test_parse_city_none() -> None:
    assert CyclonesScraper._parse_city(None) is None


# ── Build event from card ────────────────────────────────────────


def test_build_event_from_card() -> None:
    scraper = CyclonesScraper()
    entry = {
        "title": "BTT AFIFE 2026",
        "date_text": "19 de abril de 2026",
        "location": "Afife - Viana do Castelo",
        "image_url": "https://example.com/img.jpg",
        "regulamento_url": "https://example.com/reg.pdf",
        "detail_url": "https://cyclonessports.com/index.php/352-btt-afife-2026",
    }
    ev = scraper._build_event_from_card(entry)
    assert ev is not None
    assert ev.title == "BTT AFIFE 2026"
    assert ev.start_date == datetime(2026, 4, 19)
    assert ev.city == "Viana do Castelo"
    assert "BTT" in ev.sport_types
    assert len(ev.documents) == 1
    assert ev.documents[0].document_type == "regulation"


def test_build_event_from_card_no_title() -> None:
    scraper = CyclonesScraper()
    ev = scraper._build_event_from_card({"title": None})
    assert ev is None


def test_build_event_from_card_no_regulamento() -> None:
    scraper = CyclonesScraper()
    entry = {
        "title": "Some Event",
        "date_text": "1 de maio de 2026",
        "location": None,
        "image_url": None,
        "regulamento_url": None,
        "detail_url": None,
    }
    ev = scraper._build_event_from_card(entry)
    assert ev is not None
    assert ev.documents == []


# ── Date range event ─────────────────────────────────────────────


def test_date_range_event() -> None:
    scraper = CyclonesScraper()
    entry = {
        "title": "GRANDE TRAIL FISGAS DE ERMELO",
        "date_text": "18 e 19 de abril de 2026",
        "location": "Mondim de Basto",
        "image_url": None,
        "regulamento_url": None,
        "detail_url": None,
    }
    ev = scraper._build_event_from_card(entry)
    assert ev is not None
    assert ev.start_date == datetime(2026, 4, 18)
    assert ev.end_date == datetime(2026, 4, 19)
