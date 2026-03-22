"""Tests for RunPorto scraper helpers and parsing logic."""

from app.sources.runporto.scraper import (
    RunPortoScraper,
    _parse_pt_date,
    _parse_time,
    _guess_distance,
    _guess_sport_types,
    _extract_city,
)


# ── Date parsing ─────────────────────────────────────────────────


def test_parse_pt_date_basic() -> None:
    dt = _parse_pt_date("29 de março de 2026")
    assert dt is not None
    assert dt.day == 29
    assert dt.month == 3
    assert dt.year == 2026


def test_parse_pt_date_maio() -> None:
    dt = _parse_pt_date("24 de maio de 2026")
    assert dt is not None
    assert dt.month == 5


def test_parse_pt_date_embedded() -> None:
    dt = _parse_pt_date(
        "Realiza-se no dia 29 de março de 2026 pelas 9h30"
    )
    assert dt is not None
    assert dt.day == 29


def test_parse_pt_date_invalid() -> None:
    assert _parse_pt_date("") is None
    assert _parse_pt_date("no date here") is None


# ── Time parsing ─────────────────────────────────────────────────


def test_parse_time_full() -> None:
    assert _parse_time("pelas 9h30") == "09:30"


def test_parse_time_zero_padded() -> None:
    assert _parse_time("às 09h00") == "09:00"


def test_parse_time_no_minutes() -> None:
    assert _parse_time("10h") == "10:00"


def test_parse_time_none() -> None:
    assert _parse_time("no time") is None


# ── City extraction ──────────────────────────────────────────────


def test_extract_city_cidade_do() -> None:
    text = "na Cidade do Porto, com partida"
    assert _extract_city(text) == "Porto"


def test_extract_city_cidade_de() -> None:
    text = "na Cidade de Braga, com partida"
    assert _extract_city(text) == "Braga"


def test_extract_city_none() -> None:
    assert _extract_city("nada") is None


# ── Distance guessing ────────────────────────────────────────────


def test_guess_distance_int() -> None:
    assert _guess_distance("5 km") == 5.0


def test_guess_distance_decimal() -> None:
    assert _guess_distance("21,0975 km") == 21.0975


def test_guess_distance_none() -> None:
    assert _guess_distance("nope") is None


# ── Sport types ──────────────────────────────────────────────────


def test_sport_types_maratona() -> None:
    types = _guess_sport_types("Meia Maratona de Braga 2026")
    assert "RUNNING" in types


def test_sport_types_corrida() -> None:
    types = _guess_sport_types("Corrida da Mulher 2026")
    assert "RUNNING" in types


def test_sport_types_default() -> None:
    types = _guess_sport_types("Evento Desconhecido")
    assert "RUNNING" in types


# ── URL parsing on listing page ──────────────────────────────────


_LISTING_HTML = """
<html><body>
<a href="https://www.runporto.com/pt/eventos/meia-maratona-de-braga/meia-maratona-de-braga-2026/">Meia Maratona</a>
<a href="https://www.runporto.com/pt/eventos/super-5-km/super-5-km-braga-2026/">Super 5 km</a>
<a href="/pt/eventos/corrida-da-mulher/corrida-da-mulher-2026/">Corrida da Mulher</a>
<a href="/eventos/maratona-do-porto/maratona-do-porto-2026/">Maratona do Porto</a>
<a href="https://www.runporto.com/pt/eventos/corrida-do-halloween/corrida-do-halloween-2019/">Halloween</a>
<a href="https://www.runporto.com/pt/eventos/meia-maratona-de-braga/">Series link</a>
<a href="https://www.runporto.com/pt/eventos/">Events root</a>
<a href="https://www.runporto.com/pt/eventos/corrida-da-mulher/corrida-da-mulher-2026/informacoes-gerais/">Sub-page</a>
<a href="https://www.runporto.com/pt/novidades/app-runporto/">Not event</a>
</body></html>
"""


def test_parse_event_urls() -> None:
    urls = RunPortoScraper.parse_event_urls(_LISTING_HTML)
    # Should get 4 event edition URLs (2019 is out of range)
    assert len(urls) == 4
    assert any("meia-maratona-de-braga-2026" in u for u in urls)
    assert any("super-5-km-braga-2026" in u for u in urls)
    assert any("corrida-da-mulher-2026" in u for u in urls)
    assert any("maratona-do-porto-2026" in u for u in urls)
    # Sub-pages should be excluded
    assert not any("informacoes-gerais" in u for u in urls)
    # Series-level link should be excluded
    assert not any(u.rstrip("/").endswith("meia-maratona-de-braga") for u in urls)


def test_parse_event_urls_dedup() -> None:
    html = """
    <a href="/pt/eventos/meia-maratona-de-braga/meia-maratona-de-braga-2026/">A</a>
    <a href="https://www.runporto.com/pt/eventos/meia-maratona-de-braga/meia-maratona-de-braga-2026/">B</a>
    """
    urls = RunPortoScraper.parse_event_urls(html)
    assert len(urls) == 1


# ── Variant extraction ───────────────────────────────────────────


def test_extract_variants_pipe_format() -> None:
    text = """
    Meia Maratona | 21 km
    Corrida | 5 km
    Caminhada | 6 km
    """
    variants = RunPortoScraper._extract_variants_from_text(text)
    assert len(variants) >= 3
    names = {v.name for v in variants}
    distances = {v.distance_km for v in variants}
    assert 21.0 in distances
    assert 5.0 in distances
    assert 6.0 in distances


def test_extract_variants_combined() -> None:
    text = "CORRIDA | CAMINHADA | 5 KM"
    variants = RunPortoScraper._extract_variants_from_text(text)
    assert len(variants) >= 1
    assert variants[0].distance_km == 5.0


def test_extract_variants_mini_caminhada() -> None:
    text = "uma Mini/Caminhada com a distância de 6 km"
    variants = RunPortoScraper._extract_variants_from_text(text)
    assert any(v.distance_km == 6.0 for v in variants)


# ── Slug from URL ────────────────────────────────────────────────


def test_slug_from_url() -> None:
    url = "https://www.runporto.com/pt/eventos/meia-maratona-de-braga/meia-maratona-de-braga-2026/"
    slug = RunPortoScraper._slug_from_url(url)
    assert slug == "meia-maratona-de-braga--meia-maratona-de-braga-2026"


# ── Title extraction ─────────────────────────────────────────────


def test_extract_title_h1() -> None:
    from bs4 import BeautifulSoup

    html = "<html><body><h1>CORRIDA DA MULHER 2026</h1></body></html>"
    soup = BeautifulSoup(html, "lxml")
    assert RunPortoScraper._extract_title(soup) == "CORRIDA DA MULHER 2026"


def test_extract_title_og() -> None:
    from bs4 import BeautifulSoup

    html = '<html><head><meta property="og:title" content="Meia Maratona"/></head><body></body></html>'
    soup = BeautifulSoup(html, "lxml")
    assert RunPortoScraper._extract_title(soup) == "Meia Maratona"
