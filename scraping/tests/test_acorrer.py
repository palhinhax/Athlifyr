"""Tests for the ACorrer scraper."""

from __future__ import annotations

from bs4 import BeautifulSoup

from app.sources.acorrer.scraper import ACorrerScraper
from app.sources.apedalar.scraper import _guess_sport_type


# ── Subclass attributes ──────────────────────────────────────────


class TestACorrerAttributes:
    def test_source_name(self):
        s = ACorrerScraper()
        assert s.source_name == "acorrer"

    def test_display_name(self):
        s = ACorrerScraper()
        assert s.display_name == "ACorrer"

    def test_base_url(self):
        s = ACorrerScraper()
        assert s.base_url == "https://acorrer.pt"

    def test_events_url(self):
        assert ACorrerScraper._EVENTS_URL == "https://acorrer.pt/eventos"

    def test_asset_domain(self):
        assert ACorrerScraper._ASSET_DOMAIN == r"assets\.acorrer"

    def test_default_sport(self):
        assert ACorrerScraper._DEFAULT_SPORT == "RUNNING"


# ── Sport type guessing with running default ─────────────────────


class TestRunningGuessSportType:
    def test_trail(self):
        assert "TRAIL" in _guess_sport_type("VIII Queiriga Trail", default="RUNNING")

    def test_corrida(self):
        assert "RUNNING" in _guess_sport_type("3º Edição Corrida Azeite", default="RUNNING")

    def test_caminhada(self):
        assert "WALKING" in _guess_sport_type("Caminhada Solidária", default="RUNNING")

    def test_night_running(self):
        assert "RUNNING" in _guess_sport_type("7º Night Running Santiago", default="RUNNING")

    def test_cross(self):
        assert "RUNNING" in _guess_sport_type("Cross Country Municipal", default="RUNNING")

    def test_unknown_defaults_running(self):
        types = _guess_sport_type("Evento Genérico", default="RUNNING")
        assert "RUNNING" in types

    def test_unknown_defaults_cycling(self):
        types = _guess_sport_type("Evento Genérico", default="CYCLING")
        assert "CYCLING" in types


# ── Event URL extraction ─────────────────────────────────────────


class TestACorrerExtractUrls:
    def test_extract_acorrer_urls(self):
        html = """
        <div>
            <a href="https://acorrer.pt/eventos/4030/info">Event 1</a>
            <a href="https://acorrer.pt/eventos/4053/info">Event 2</a>
            <a href="https://acorrer.pt/eventos/4030/info">Dup</a>
        </div>
        """
        urls = ACorrerScraper._extract_event_urls(html)
        assert len(urls) == 2
        assert "https://acorrer.pt/eventos/4030/info" in urls


# ── Detail page parsing (acorrer image domain) ───────────────────


_SAMPLE_ACORRER_HTML = """
<!doctype html>
<html>
<body>
<h1>7º Night Running Santiago do Cacém</h1>
<div class="mb-3">
    <h2 class="font-accent text-2xl text-aprimary">QUANDO?</h2>
    <div class="font-semibold">Sábado, 28 de março de 2026 às 16:00</div>
    <div>Pagamentos até: Segunda-feira, 23 de março de 2026 às 23:59</div>
</div>
<div class="grow">
    <h2 class="font-accent text-2xl text-aprimary">ONDE?</h2>
    <div class="uppercase font-semibold">Santiago Do Cacem, Setúbal</div>
</div>
<img alt="Cartaz" src="https://assets.acorrer.pt/media/8090/68f209b-cartaz_460.jpg"/>
<a download="regulamento.pdf" href="https://assets.acorrer.pt/media/8090/68f209b44bf3b_Regulamento.pdf">REGULAMENTO</a>
<a download="termo.pdf" href="https://assets.acorrer.pt/media/8857/699d72ae2c5e7_Termo_Responsabilidade.pdf">TERMO RESPONSABILIDADE</a>
<a href="https://acorrer.pt/eventos/4030/inscrever">INSCREVER</a>
<div wire:name="frontend.provas.price-table">
    <h2 class="font-accent text-3xl text-aprimary">QUANTO?</h2>
    <div class="bg-agraylight rounded-lg p-3 grow">
        <div class="text-xs text-center">Kids 300m</div>
        <div class="text-3xl font-semibold">5.00<small>€</small></div>
    </div>
    <div class="bg-agraylight rounded-lg p-3 grow">
        <div class="text-xs text-center">Corrida 14km</div>
        <div class="text-3xl font-semibold">15.00<small>€</small></div>
    </div>
    <div class="bg-agraylight rounded-lg p-3 grow">
        <div class="text-xs text-center">Caminhada 10km</div>
        <div class="text-3xl font-semibold">10.00<small>€</small></div>
    </div>
</div>
<div class="border border-agraylight rounded-lg p-5 mt-5">
    <h2 class="font-accent text-3xl text-aprimary">CONTACTOS DA ORGANIZAÇÃO</h2>
    <div class="whitespace-pre-line mb-4">Telemóvel 917475760 | jacdesporto@sapo.pt</div>
</div>
</body>
</html>
"""


class TestACorrerParseEventPage:
    def test_title(self):
        ev = ACorrerScraper._parse_event_page(
            "https://acorrer.pt/eventos/4030/info", _SAMPLE_ACORRER_HTML
        )
        assert ev is not None
        assert ev.title == "7º Night Running Santiago do Cacém"

    def test_source_event_id(self):
        ev = ACorrerScraper._parse_event_page(
            "https://acorrer.pt/eventos/4030/info", _SAMPLE_ACORRER_HTML
        )
        assert ev.source_event_id == "4030"

    def test_start_date(self):
        ev = ACorrerScraper._parse_event_page(
            "https://acorrer.pt/eventos/4030/info", _SAMPLE_ACORRER_HTML
        )
        assert ev.start_date is not None
        assert ev.start_date.day == 28
        assert ev.start_date.month == 3
        assert ev.start_date.hour == 16

    def test_registration_deadline(self):
        ev = ACorrerScraper._parse_event_page(
            "https://acorrer.pt/eventos/4030/info", _SAMPLE_ACORRER_HTML
        )
        assert ev.registration_deadline is not None
        assert ev.registration_deadline.day == 23

    def test_location(self):
        ev = ACorrerScraper._parse_event_page(
            "https://acorrer.pt/eventos/4030/info", _SAMPLE_ACORRER_HTML
        )
        assert ev.city == "Santiago Do Cacem"

    def test_image_acorrer_domain(self):
        ev = ACorrerScraper._parse_event_page(
            "https://acorrer.pt/eventos/4030/info", _SAMPLE_ACORRER_HTML
        )
        assert ev.image_url is not None
        assert "assets.acorrer.pt" in ev.image_url

    def test_documents(self):
        ev = ACorrerScraper._parse_event_page(
            "https://acorrer.pt/eventos/4030/info", _SAMPLE_ACORRER_HTML
        )
        assert len(ev.documents) == 2
        urls = [d.original_url for d in ev.documents]
        assert any("Regulamento" in u for u in urls)
        assert any("Termo" in u for u in urls)

    def test_variants(self):
        ev = ACorrerScraper._parse_event_page(
            "https://acorrer.pt/eventos/4030/info", _SAMPLE_ACORRER_HTML
        )
        assert len(ev.variants) == 3
        names = [v.name for v in ev.variants]
        assert "Kids 300m" in names
        assert "Corrida 14km" in names
        assert "Caminhada 10km" in names

    def test_sport_types_running_default(self):
        ev = ACorrerScraper._parse_event_page(
            "https://acorrer.pt/eventos/4030/info", _SAMPLE_ACORRER_HTML
        )
        assert "RUNNING" in ev.sport_types

    def test_organizer(self):
        ev = ACorrerScraper._parse_event_page(
            "https://acorrer.pt/eventos/4030/info", _SAMPLE_ACORRER_HTML
        )
        assert "917475760" in ev.organizer_name

    def test_external_url(self):
        ev = ACorrerScraper._parse_event_page(
            "https://acorrer.pt/eventos/4030/info", _SAMPLE_ACORRER_HTML
        )
        assert ev.external_url == "https://acorrer.pt/eventos/4030/inscrever"
