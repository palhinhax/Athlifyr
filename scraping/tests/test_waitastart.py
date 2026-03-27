"""Tests for WaitAStart scraper."""

import textwrap
from datetime import datetime

from bs4 import BeautifulSoup

from app.sources.waitastart.scraper import (
    WaitAStartScraper,
    _build_date,
    _guess_sport_types,
    _parse_card_text,
    _parse_date_str,
)


# ── Date parsing ─────────────────────────────────────────────────


def test_parse_date_full() -> None:
    dt = _parse_date_str("29 Mar 2026")
    assert dt == datetime(2026, 3, 29)


def test_parse_date_full_month() -> None:
    dt = _parse_date_str("19 Abril 2026")
    assert dt == datetime(2026, 4, 19)


def test_parse_date_range() -> None:
    dt = _parse_date_str("6 e 7 Junho 2026")
    assert dt == datetime(2026, 6, 6)


def test_parse_date_no_year() -> None:
    dt = _parse_date_str("11 Abr")
    assert dt is not None
    assert dt.month == 4
    assert dt.day == 11


def test_parse_date_maio() -> None:
    dt = _parse_date_str("30 Maio 2026")
    assert dt == datetime(2026, 5, 30)


def test_parse_date_invalid() -> None:
    assert _parse_date_str("invalid") is None


def test_parse_date_empty() -> None:
    assert _parse_date_str("") is None


def test_build_date_simple() -> None:
    dt = _build_date("15", "Mar", "2026")
    assert dt == datetime(2026, 3, 15)


def test_build_date_full_month_name() -> None:
    dt = _build_date("1", "junho", "2026")
    assert dt == datetime(2026, 6, 1)


def test_build_date_invalid_month() -> None:
    assert _build_date("1", "xyz", "2026") is None


def test_build_date_invalid_day() -> None:
    assert _build_date("99", "mar", "2026") is None


# ── Card text parsing ────────────────────────────────────────────


def test_parse_card_text_full() -> None:
    title, city, date_str, dt = _parse_card_text("29 Mar 2026 - III MARATONA BTT - Bragança")
    assert title == "III MARATONA BTT"
    assert city == "Bragança"
    assert dt == datetime(2026, 3, 29)


def test_parse_card_text_no_city() -> None:
    title, city, date_str, dt = _parse_card_text("19 Abril 2026 - Lardosa em Movimento")
    assert title == "Lardosa em Movimento"
    assert city is None
    assert dt == datetime(2026, 4, 19)


def test_parse_card_text_no_year() -> None:
    title, city, date_str, dt = _parse_card_text("11 Abr - XI Trilho dos Carreteiros - Roriz")
    assert title == "XI Trilho dos Carreteiros"
    assert city == "Roriz"
    assert dt is not None
    assert dt.month == 4
    assert dt.day == 11


def test_parse_card_text_range() -> None:
    title, city, date_str, dt = _parse_card_text("6 e 7 Junho 2026 - Cycling Trip - Ourém - Cáceres")
    assert title == "Cycling Trip"
    assert dt == datetime(2026, 6, 6)


def test_parse_card_text_empty() -> None:
    title, city, date_str, dt = _parse_card_text("")
    assert title is None
    assert dt is None


def test_parse_card_text_no_separator() -> None:
    title, city, date_str, dt = _parse_card_text("Something without dashes")
    assert title == "Something without dashes"
    assert dt is None


# ── Sport type guessing ──────────────────────────────────────────


def test_guess_trail() -> None:
    types = _guess_sport_types("XI Trilho dos Carreteiros")
    assert "TRAIL" in types


def test_guess_btt() -> None:
    types = _guess_sport_types("III MARATONA BTT BUTELO")
    assert "BTT" in types


def test_guess_corrida() -> None:
    types = _guess_sport_types("Corrida dos Viriatos")
    assert "RUNNING" in types


def test_guess_ocr() -> None:
    types = _guess_sport_types("OCR Police Leiria")
    assert "OCR" in types


def test_guess_aquathlon() -> None:
    types = _guess_sport_types("Aquatlo Jovem")
    assert "AQUATHLON" in types


def test_guess_duathlon() -> None:
    types = _guess_sport_types("Duatlo Cross")
    assert "DUATHLON" in types


def test_guess_cycling() -> None:
    types = _guess_sport_types("Cycling Trip")
    assert "CYCLING" in types


def test_guess_swimming() -> None:
    types = _guess_sport_types("AQUARACE Sesimbra")
    assert "SWIMMING" in types


def test_guess_unknown() -> None:
    types = _guess_sport_types("Something else")
    assert types == ["OTHER"]


# ── Card fetching ────────────────────────────────────────────────


def test_fetch_cards_parsing() -> None:
    html = textwrap.dedent("""\
    <html><body>
    <article class="service-content text-center">
      <figure class="service-content-thumbnail">
        <a href="https://waitastart.com/event-2026/">
          <img class="img-fluid" src="https://waitastart.com/wp-content/uploads/cover.jpg" alt="29 Mar 2026 - Event - Porto" />
        </a>
      </figure>
      <h5 class="service-title">
        <a href="https://waitastart.com/event-2026/">29 Mar 2026 - Event - Porto</a>
      </h5>
      <p>Inscrições abertas</p>
    </article>
    </body></html>
    """)
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(html, "lxml")
    scraper = WaitAStartScraper()
    # Simulate what _fetch_cards does with parsed HTML
    cards = []
    for article in soup.select("article.service-content"):
        h5 = article.select_one("h5.service-title")
        if not h5:
            continue
        link = h5.select_one("a[href]")
        text = link.get_text(strip=True)
        title, city, date_str, dt = _parse_card_text(text)
        cards.append({"title": title, "city": city, "start_date": dt})

    assert len(cards) == 1
    assert cards[0]["title"] == "Event"
    assert cards[0]["city"] == "Porto"
    assert cards[0]["start_date"] == datetime(2026, 3, 29)


# ── Document extraction ──────────────────────────────────────────


def test_extract_documents_regulamento() -> None:
    html = textwrap.dedent("""\
    <html><body>
    <a href="https://waitastart.com/regulamentos/reg.pdf">REGULAMENTO</a>
    <a href="https://waitastart.com/outro/file.pdf">OUTRO PDF</a>
    </body></html>
    """)
    soup = BeautifulSoup(html, "lxml")
    scraper = WaitAStartScraper()
    docs = scraper._extract_documents(soup)
    assert len(docs) == 1  # Only regulamento
    assert docs[0].original_url == "https://waitastart.com/regulamentos/reg.pdf"


def test_extract_documents_none() -> None:
    html = "<html><body><p>No PDFs</p></body></html>"
    soup = BeautifulSoup(html, "lxml")
    scraper = WaitAStartScraper()
    docs = scraper._extract_documents(soup)
    assert docs == []


def test_extract_documents_dedup() -> None:
    html = textwrap.dedent("""\
    <html><body>
    <a href="https://waitastart.com/regulamentos/reg.pdf">REGULAMENTO</a>
    <a href="https://waitastart.com/regulamentos/reg.pdf">REGULAMENTO</a>
    </body></html>
    """)
    soup = BeautifulSoup(html, "lxml")
    scraper = WaitAStartScraper()
    docs = scraper._extract_documents(soup)
    assert len(docs) == 1


# ── Scraper metadata ─────────────────────────────────────────────


def test_scraper_metadata() -> None:
    s = WaitAStartScraper()
    assert s.source_name == "waitastart"
    assert s.display_name == "WaitAStart"
    assert "waitastart.com" in s.base_url
