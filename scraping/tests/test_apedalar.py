"""Tests for the APedalar scraper."""

from __future__ import annotations

import pytest
from bs4 import BeautifulSoup

from app.sources.apedalar.scraper import (
    APedalerScraper,
    _extract_event_id,
    _guess_sport_type,
    _parse_card_date,
    _parse_location,
    _parse_price,
    _parse_pt_date,
)


# ── Date parsing ─────────────────────────────────────────────────


class TestParsePtDate:
    def test_full_date_with_time(self):
        dt = _parse_pt_date("Domingo, 29 de março de 2026 às 09:00")
        assert dt is not None
        assert dt.year == 2026
        assert dt.month == 3
        assert dt.day == 29
        assert dt.hour == 9
        assert dt.minute == 0

    def test_full_date_without_time(self):
        dt = _parse_pt_date("29 de março de 2026")
        assert dt is not None
        assert dt.year == 2026
        assert dt.month == 3
        assert dt.day == 29
        assert dt.hour == 0

    def test_deadline_with_prefix(self):
        dt = _parse_pt_date("Pagamentos até: Terça-feira, 24 de março de 2026 às 23:59")
        assert dt is not None
        assert dt.day == 24
        assert dt.hour == 23
        assert dt.minute == 59

    def test_slash_date(self):
        dt = _parse_pt_date("11/04/2026")
        assert dt is not None
        assert dt.day == 11
        assert dt.month == 4
        assert dt.year == 2026

    def test_none(self):
        assert _parse_pt_date(None) is None
        assert _parse_pt_date("") is None

    def test_invalid_month(self):
        assert _parse_pt_date("29 de foodbar de 2026") is None


class TestParseCardDate:
    def test_short_date(self):
        dt = _parse_card_date("29 Mar", year=2026)
        assert dt is not None
        assert dt.day == 29
        assert dt.month == 3
        assert dt.year == 2026

    def test_short_date_abril(self):
        dt = _parse_card_date("11 Abr", year=2026)
        assert dt is not None
        assert dt.month == 4

    def test_none(self):
        assert _parse_card_date(None) is None
        assert _parse_card_date("") is None

    def test_invalid(self):
        assert _parse_card_date("foo bar") is None


# ── Price parsing ────────────────────────────────────────────────


class TestParsePrice:
    def test_euro_decimal(self):
        assert _parse_price("15.00€") == 15.00

    def test_euro_comma(self):
        assert _parse_price("15,00€") == 15.00

    def test_integer(self):
        assert _parse_price("10 €") == 10.0

    def test_none(self):
        assert _parse_price(None) is None
        assert _parse_price("") is None
        assert _parse_price("Gratuito") is None


# ── Event ID extraction ──────────────────────────────────────────


class TestExtractEventId:
    def test_from_info_url(self):
        assert _extract_event_id("https://apedalar.pt/eventos/4096/info") == "4096"

    def test_from_bare_url(self):
        assert _extract_event_id("/eventos/4131/info") == "4131"

    def test_no_match(self):
        assert _extract_event_id("https://apedalar.pt/") is None


# ── Location parsing ─────────────────────────────────────────────


class TestParseLocation:
    def test_city_district(self):
        city, district = _parse_location("Monte Do Trigo, Évora")
        assert city == "Monte Do Trigo"
        assert district == "Évora"

    def test_city_only(self):
        city, district = _parse_location("Tavira")
        assert city == "Tavira"
        assert district is None

    def test_none(self):
        assert _parse_location(None) == (None, None)
        assert _parse_location("") == (None, None)

    def test_complex_location(self):
        city, district = _parse_location("Póvoa de Penafirme, Lisboa")
        assert city == "Póvoa de Penafirme"
        assert district == "Lisboa"


# ── Sport type guessing ──────────────────────────────────────────


class TestGuessSportType:
    def test_btt(self):
        assert "BTT" in _guess_sport_type("24ª Maratona BTTTrigo")

    def test_gravel(self):
        assert "CYCLING" in _guess_sport_type("II Gravel Race Geração Radical")

    def test_cicloturismo(self):
        assert "CYCLING" in _guess_sport_type("I Passeio de Cicloturismo")

    def test_resistencia(self):
        assert "BTT" in _guess_sport_type("5ª Resistência Penafirme")

    def test_trail(self):
        types = _guess_sport_type("Trail Run")
        assert "TRAIL" in types

    def test_passeio(self):
        assert "BTT" in _guess_sport_type("15º Passeio por Trilhos Saloios")

    def test_default(self):
        types = _guess_sport_type("Evento Genérico")
        assert "CYCLING" in types

    def test_granfondo(self):
        assert "CYCLING" in _guess_sport_type("Granfondo 5 Quinas")

    def test_raid(self):
        assert "BTT" in _guess_sport_type("12º Raid BTTApogma")

    def test_rota(self):
        assert "BTT" in _guess_sport_type("15º Rota do Cozido")

    def test_ultra(self):
        assert "TRAIL" in _guess_sport_type("Ultramarathon Torres Vedras")


# ── Event URL extraction from list HTML ──────────────────────────


class TestExtractEventUrls:
    def test_extract_cards(self):
        html = """
        <div>
            <a href="https://apedalar.pt/eventos/4096/info">Event 1</a>
            <a href="https://apedalar.pt/eventos/4131/info">Event 2</a>
            <a href="https://apedalar.pt/eventos/4096/info">Event 1 dup</a>
            <a href="https://apedalar.pt/resultados">Not an event</a>
        </div>
        """
        urls = APedalerScraper._extract_event_urls(html)
        assert len(urls) == 2
        assert "https://apedalar.pt/eventos/4096/info" in urls
        assert "https://apedalar.pt/eventos/4131/info" in urls

    def test_empty_html(self):
        assert APedalerScraper._extract_event_urls("<div></div>") == []


# ── Event detail parsing ─────────────────────────────────────────


_SAMPLE_EVENT_HTML = """
<!doctype html>
<html>
<body>
<h1>24ª Maratona BTTTrigo</h1>
<div class="mb-3">
    <h2 class="font-accent text-2xl text-aprimary">QUANDO?</h2>
    <div class="font-semibold">Domingo, 29 de março de 2026 às 09:00</div>
    <div>Pagamentos até: Terça-feira, 24 de março de 2026 às 23:59</div>
</div>
<div class="grow">
    <h2 class="font-accent text-2xl text-aprimary">ONDE?</h2>
    <div class="uppercase font-semibold">Monte Do Trigo , Évora</div>
</div>
<img alt="Cartaz" src="https://assets.apedalar.pt/media/8741/conversions/6981d96f5071a_4096_Cartaz-cartaz_460.jpg"/>
<div class="flex flex-row flex-wrap text-white text-sm gap-3">
    <a download="regulamento_4096.pdf" href="https://assets.apedalar.pt/media/8946/69a844205b038_Regulamento.pdf" target="_BLANK">
        REGULAMENTO
    </a>
</div>
<a href="https://apedalar.pt/eventos/4096/inscrever">INSCREVER</a>
<div wire:name="frontend.provas.price-table">
    <h2 class="font-accent text-3xl text-aprimary">QUANTO?</h2>
    <div class="bg-agraylight rounded-lg p-3 grow">
        <div class="text-xs text-center">Inscrição</div>
        <div class="text-3xl font-semibold">15.00<small>€</small></div>
    </div>
    <div class="bg-agraylight rounded-lg p-3 grow">
        <div class="text-xs text-center">Almoço</div>
        <div class="text-3xl font-semibold">10.00<small>€</small></div>
    </div>
    <div class="bg-agraylight rounded-lg p-3 grow">
        <div class="text-xs text-center">Acompanhantes</div>
        <div class="text-3xl font-semibold">10.00<small>€</small></div>
    </div>
</div>
<div class="border border-agraylight rounded-lg p-5 mt-5 md:mt-14">
    <h2 class="font-accent text-3xl text-aprimary">CONTACTOS DA ORGANIZAÇÃO</h2>
    <div class="whitespace-pre-line mb-4">Telemóvel: 968 194 909</div>
</div>
</body>
</html>
"""


class TestParseEventPage:
    def test_title(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/4096/info", _SAMPLE_EVENT_HTML
        )
        assert ev is not None
        assert ev.title == "24ª Maratona BTTTrigo"

    def test_source_event_id(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/4096/info", _SAMPLE_EVENT_HTML
        )
        assert ev.source_event_id == "4096"

    def test_start_date(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/4096/info", _SAMPLE_EVENT_HTML
        )
        assert ev.start_date is not None
        assert ev.start_date.day == 29
        assert ev.start_date.month == 3
        assert ev.start_date.year == 2026
        assert ev.start_date.hour == 9

    def test_registration_deadline(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/4096/info", _SAMPLE_EVENT_HTML
        )
        assert ev.registration_deadline is not None
        assert ev.registration_deadline.day == 24

    def test_location(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/4096/info", _SAMPLE_EVENT_HTML
        )
        assert ev.city == "Monte Do Trigo"
        assert ev.country == "Portugal"

    def test_image(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/4096/info", _SAMPLE_EVENT_HTML
        )
        assert ev.image_url is not None
        assert "cartaz" in ev.image_url

    def test_documents(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/4096/info", _SAMPLE_EVENT_HTML
        )
        assert len(ev.documents) == 1
        assert ev.documents[0].document_type == "regulation"
        assert ev.documents[0].original_url.endswith(".pdf")
        assert ev.documents[0].file_name == "regulamento_4096.pdf"

    def test_external_url(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/4096/info", _SAMPLE_EVENT_HTML
        )
        assert ev.external_url == "https://apedalar.pt/eventos/4096/inscrever"

    def test_pricing_skips_meals(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/4096/info", _SAMPLE_EVENT_HTML
        )
        # "Inscrição" is kept, "Almoço" and "Acompanhantes" are skipped
        assert len(ev.variants) == 1
        assert ev.variants[0].name == "Inscrição"
        assert ev.variants[0].price == 15.00

    def test_sport_types(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/4096/info", _SAMPLE_EVENT_HTML
        )
        assert "BTT" in ev.sport_types

    def test_organizer(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/4096/info", _SAMPLE_EVENT_HTML
        )
        assert ev.organizer_name is not None
        assert "968 194 909" in ev.organizer_name

    def test_no_title_returns_none(self):
        ev = APedalerScraper._parse_event_page(
            "https://apedalar.pt/eventos/0/info", "<html><body></body></html>"
        )
        assert ev is None


# ── Pricing extraction ───────────────────────────────────────────


class TestExtractPricing:
    def test_multiple_price_boxes(self):
        html = """
        <div wire:name="frontend.provas.price-table">
            <div class="bg-agraylight rounded-lg p-3">
                <div class="text-xs text-center">Meia Maratona</div>
                <div class="text-3xl font-semibold">15.00<small>€</small></div>
            </div>
            <div class="bg-agraylight rounded-lg p-3">
                <div class="text-xs text-center">Maratona</div>
                <div class="text-3xl font-semibold">20.00<small>€</small></div>
            </div>
            <div class="bg-agraylight rounded-lg p-3">
                <div class="text-xs text-center">Almoço</div>
                <div class="text-3xl font-semibold">10.00<small>€</small></div>
            </div>
        </div>
        """
        soup = BeautifulSoup(html, "lxml")
        variants = APedalerScraper._extract_pricing(soup, "Test Event")
        assert len(variants) == 2
        assert variants[0].name == "Meia Maratona"
        assert variants[0].price == 15.00
        assert variants[1].name == "Maratona"
        assert variants[1].price == 20.00

    def test_no_price_table(self):
        html = "<div>No pricing here</div>"
        soup = BeautifulSoup(html, "lxml")
        variants = APedalerScraper._extract_pricing(soup, "Test")
        assert variants == []
