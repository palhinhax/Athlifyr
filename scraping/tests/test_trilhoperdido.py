"""Tests for Trilho Perdido scraper."""

import textwrap
from datetime import datetime

from app.sources.trilhoperdido.scraper import (
    TrilhoPerdidoScraper,
    _map_sport_types,
    _parse_card_date,
    _slug_from_href,
)


# ── Date parsing ─────────────────────────────────────────────────


def test_parse_card_date_simple() -> None:
    dt = _parse_card_date("22", "mar", "2026")
    assert dt == datetime(2026, 3, 22)


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
    assert _parse_card_date(None, "mar", "2026") is None
    assert _parse_card_date("22", None, "2026") is None
    assert _parse_card_date("22", "mar", None) is None


def test_parse_card_date_invalid() -> None:
    assert _parse_card_date("99", "mar", "2026") is None


def test_parse_card_date_unknown_month() -> None:
    assert _parse_card_date("1", "xyz", "2026") is None


# ── Sport type mapping ───────────────────────────────────────────


def test_map_trail_running() -> None:
    assert _map_sport_types("Trail Running") == ["TRAIL"]


def test_map_btt() -> None:
    assert _map_sport_types("BTT") == ["BTT"]


def test_map_atletismo() -> None:
    assert _map_sport_types("Atletismo") == ["RUNNING"]


def test_map_caminhadas() -> None:
    assert _map_sport_types("Caminhadas") == ["WALKING"]


def test_map_ciclismo() -> None:
    assert _map_sport_types("Ciclismo de estrada") == ["CYCLING"]


def test_map_tt() -> None:
    assert _map_sport_types("TT - Todo Terreno") == ["BTT"]


def test_map_outras() -> None:
    assert _map_sport_types("Outras") == ["OTHER"]


def test_map_none() -> None:
    assert _map_sport_types(None) == ["OTHER"]


def test_map_unknown() -> None:
    assert _map_sport_types("Natação") == ["OTHER"]


# ── Slug extraction ──────────────────────────────────────────────


def test_slug_from_href() -> None:
    assert _slug_from_href("/evento/9-Alcanena-Trail") == "9-Alcanena-Trail"


def test_slug_from_href_trailing_slash() -> None:
    assert _slug_from_href("/evento/9-Alcanena-Trail/") == "9-Alcanena-Trail"


# ── Listing parsing ──────────────────────────────────────────────


def test_parse_listing_card() -> None:
    html = textwrap.dedent("""\
    <html><body>
    <a href="/evento/9-Alcanena-Trail">
      <img src="/admin/imgSiteAdmin/imagensEventos/Pop_abc.jpg" alt="9º Alcanena Trail" />
      <div class="descricao">
        <div class="data"><div>22</div><div>mar</div><div>2026</div></div>
        <div class="descricao-texto">
          <div class="titulo">9º Alcanena Trail</div>
          <div class="categoria">Trail Running<span class="localidade">Minde</span></div>
        </div>
      </div>
    </a>
    </body></html>
    """)
    scraper = TrilhoPerdidoScraper()
    cards = scraper._parse_listing(html)
    assert len(cards) == 1
    c = cards[0]
    assert c["slug"] == "9-Alcanena-Trail"
    assert c["title"] == "9º Alcanena Trail"
    assert c["city"] == "Minde"
    assert c["category"] == "Trail Running"
    assert c["day"] == "22"
    assert c["month"] == "mar"
    assert c["year"] == "2026"
    assert "Pop_abc.jpg" in c["image_url"]


def test_parse_listing_skips_inscrever_image() -> None:
    html = textwrap.dedent("""\
    <html><body>
    <a href="/evento/Test">
      <img src="/img/inscrever.jpg" alt="inscrever" />
      <div class="descricao">
        <div class="data"><div>1</div><div>jan</div><div>2026</div></div>
        <div class="descricao-texto">
          <div class="titulo">Test</div>
          <div class="categoria">BTT<span class="localidade">City</span></div>
        </div>
      </div>
    </a>
    </body></html>
    """)
    scraper = TrilhoPerdidoScraper()
    cards = scraper._parse_listing(html)
    assert len(cards) == 1
    assert cards[0]["image_url"] is None


def test_parse_listing_multiple_cards() -> None:
    html = '<html><body>'
    for i in range(3):
        html += f'''
        <a href="/evento/ev-{i}">
          <div class="descricao">
            <div class="data"><div>1</div><div>mar</div><div>2026</div></div>
            <div class="descricao-texto">
              <div class="titulo">Event {i}</div>
              <div class="categoria">Trail Running</div>
            </div>
          </div>
        </a>'''
    html += '</body></html>'
    scraper = TrilhoPerdidoScraper()
    cards = scraper._parse_listing(html)
    assert len(cards) == 3


# ── Document extraction ──────────────────────────────────────────


def test_extract_documents_pdf() -> None:
    from bs4 import BeautifulSoup
    html = textwrap.dedent("""\
    <html><body>
    <a href="/admin/upload/ficheiros/reg.pdf">AQUI</a>
    <a href="/admin/upload/ficheiros/reg.pdf">AQUI</a>
    </body></html>
    """)
    soup = BeautifulSoup(html, "lxml")
    scraper = TrilhoPerdidoScraper()
    docs = scraper._extract_documents(soup, "test")
    assert len(docs) == 1  # deduped
    assert docs[0].original_url == "https://www.trilhoperdido.com/admin/upload/ficheiros/reg.pdf"
    assert docs[0].document_type == "regulation"


def test_extract_documents_no_pdf() -> None:
    from bs4 import BeautifulSoup
    html = "<html><body><a href='/page'>Link</a></body></html>"
    soup = BeautifulSoup(html, "lxml")
    scraper = TrilhoPerdidoScraper()
    docs = scraper._extract_documents(soup, "test")
    assert docs == []


def test_extract_documents_absolute_url() -> None:
    from bs4 import BeautifulSoup
    html = '<html><body><a href="https://example.com/file.pdf">PDF</a></body></html>'
    soup = BeautifulSoup(html, "lxml")
    scraper = TrilhoPerdidoScraper()
    docs = scraper._extract_documents(soup, "test")
    assert len(docs) == 1
    assert docs[0].original_url == "https://example.com/file.pdf"


# ── Scraper metadata ─────────────────────────────────────────────


def test_scraper_metadata() -> None:
    s = TrilhoPerdidoScraper()
    assert s.source_name == "trilhoperdido"
    assert s.display_name == "Trilho Perdido"
    assert "trilhoperdido.com" in s.base_url
