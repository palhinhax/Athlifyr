"""Tests for Stop and Go scraper parsing helpers."""

from bs4 import BeautifulSoup

from app.sources.stopandgo.scraper import (
    StopAndGoScraper,
    _parse_date,
    _parse_price,
    _parse_pt_date,
)


# ── Date / price parsing ────────────────────────────────────────


def test_parse_date_dd_mm_yyyy() -> None:
    dt = _parse_date("20/07/2025")
    assert dt is not None
    assert dt.day == 20
    assert dt.month == 7
    assert dt.year == 2025


def test_parse_date_with_time() -> None:
    dt = _parse_date("24/03/2026 23:59")
    assert dt is not None
    assert dt.day == 24
    assert dt.hour == 23
    assert dt.minute == 59


def test_parse_date_none() -> None:
    assert _parse_date(None) is None
    assert _parse_date("") is None


def test_parse_pt_date_full_month() -> None:
    dt = _parse_pt_date("22 de março 2026")
    assert dt is not None
    assert dt.day == 22
    assert dt.month == 3
    assert dt.year == 2026


def test_parse_pt_date_abbrev() -> None:
    dt = _parse_pt_date("4 abr 2026")
    assert dt is not None
    assert dt.day == 4
    assert dt.month == 4
    assert dt.year == 2026


def test_parse_pt_date_invalid() -> None:
    assert _parse_pt_date("invalid") is None


def test_parse_price_euro() -> None:
    assert _parse_price("45,00 €") == 45.0
    assert _parse_price("100,00 €") == 100.0
    assert _parse_price("5,00 €") == 5.0


def test_parse_price_dash() -> None:
    assert _parse_price("-") is None


def test_parse_price_none() -> None:
    assert _parse_price(None) is None


# ── Sport type mapping ──────────────────────────────────────────


def test_map_sport_types_trail() -> None:
    types = StopAndGoScraper._map_sport_types("Trail", "Some Trail Event")
    assert types == ["TRAIL"]


def test_map_sport_types_atletismo() -> None:
    types = StopAndGoScraper._map_sport_types("Atletismo", "Corrida X")
    assert types == ["RUNNING"]


def test_map_sport_types_btt() -> None:
    types = StopAndGoScraper._map_sport_types("BTT", "Raid BTT")
    assert types == ["BTT"]


def test_map_sport_types_obstacle() -> None:
    types = StopAndGoScraper._map_sport_types("Provas de obstáculos", "LynxRace")
    assert types == ["OCR"]


def test_map_sport_types_cycling() -> None:
    types = StopAndGoScraper._map_sport_types("Ciclismo", "Gran Fondo")
    assert types == ["CYCLING"]


def test_map_sport_types_trail_btt() -> None:
    types = StopAndGoScraper._map_sport_types("Trail/BTT", "Mixed Event")
    assert types == ["TRAIL", "BTT"]


def test_map_sport_types_fallback_title() -> None:
    types = StopAndGoScraper._map_sport_types(None, "Ultra Trail do Marão")
    assert "TRAIL" in types


def test_map_sport_types_unknown() -> None:
    types = StopAndGoScraper._map_sport_types(None, "Evento Genérico")
    assert types == ["OTHER"]


# ── Distance guessing ───────────────────────────────────────────


def test_guess_distance_km() -> None:
    assert StopAndGoScraper._guess_distance("UTME 120K") == 120.0
    assert StopAndGoScraper._guess_distance("UTM 60K") == 60.0
    assert StopAndGoScraper._guess_distance("Trail 25km") == 25.0


def test_guess_distance_none() -> None:
    assert StopAndGoScraper._guess_distance("WALK") is None


# ── Location parsing ────────────────────────────────────────────


def test_parse_location() -> None:
    city, country = StopAndGoScraper._parse_location("Amarante, Portugal")
    assert city == "Amarante"
    assert country == "Portugal"


def test_parse_location_no_country() -> None:
    city, country = StopAndGoScraper._parse_location("Portugal")
    assert city == "Portugal"
    assert country is None


def test_parse_location_none() -> None:
    city, country = StopAndGoScraper._parse_location(None)
    assert city is None
    assert country is None


# ── HTML extraction (unit) ──────────────────────────────────────

_SAMPLE_LIST_HTML = """\
<html><body>
<div class="mt-10 space-y-5">
    <a href="https://stopandgo.net/events/lynxrace-moura-2026"
       class="block group md:rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-1">
        <div class="flex place-items-center border-b bg-white">
            <div class="h-28 w-28 md:h-48 md:w-48 flex-shrink-0">
                <img src="https://stopandgo.com.pt/files/lynxrace.jpg"
                     alt="Logótipo de " loading="lazy"
                     class="h-28 w-28 rounded-xl object-cover">
            </div>
            <div class="p-4 text-dark-blue flex-grow">
                <div class="uppercase font-bold text-l font-gilroy line-clamp-2 md:text-2xl">
                    LYNXRACE MOURA 2026
                </div>
                <p class="mt-2 text-sm uppercase font-gobold text-gray-600">
                    Provas de obstáculos
                </p>
                <div class="mt-2 flex items-center text-xs text-gray-400 font-gilroy">
                    <img src="/vendor/blade-country-flags/4x3-pt.svg" class="inline-block w-5 rounded"
                         alt="Bandeira de Portugal"/>
                    <span class="mt-1 ml-1 inline-block">Moura, Portugal</span>
                </div>
                <div class="mt-1 text-sm font-bold text-gray-500 md:hidden">
                    <span class="mx-auto inline-block iconify" data-icon="feather:calendar"></span>
                    <span class="mt-5 font-gilroy">22 de março 2026</span>
                </div>
            </div>
            <div class="mr-12 ml-auto hidden font-gobold md:block text-dark-blue flex-shrink-0">
                <div class="flex flex-col text-center">
                    <div class="text-2xl font-bold">22</div>
                    <div class="mt-2 text-sm uppercase text-gray-500">mar 2026</div>
                </div>
            </div>
        </div>
    </a>
    <a href="https://stopandgo.net/events/ultra-trail-do-marao-2026"
       class="block group md:rounded-xl transition-all duration-300 ease-in-out hover:-translate-y-1">
        <div class="flex place-items-center border-b bg-white">
            <div class="h-28 w-28 md:h-48 md:w-48 flex-shrink-0">
                <img src="https://stopandgo.com.pt/files/utm.jpg"
                     alt="Ultra Trail do Marão 2026" loading="lazy"
                     class="h-28 w-28 rounded-xl object-cover">
            </div>
            <div class="p-4 text-dark-blue flex-grow">
                <div class="uppercase font-bold text-l font-gilroy line-clamp-2 md:text-2xl">
                    Ultra Trail do Marão 2026
                </div>
                <p class="mt-2 text-sm uppercase font-gobold text-gray-600">
                    Trail
                </p>
                <div class="mt-2 flex items-center text-xs text-gray-400 font-gilroy">
                    <img src="/vendor/blade-country-flags/4x3-pt.svg" class="inline-block w-5 rounded"
                         alt="Bandeira de Portugal"/>
                    <span class="mt-1 ml-1 inline-block">Amarante, Portugal</span>
                </div>
            </div>
            <div class="mr-12 ml-auto hidden font-gobold md:block text-dark-blue flex-shrink-0">
                <div class="flex flex-col text-center">
                    <div class="text-2xl font-bold">26</div>
                    <div class="mt-2 text-sm uppercase text-gray-500">mar 2026</div>
                </div>
                <div class="flex flex-col border-t-2 px-3 pt-3 text-center border-accent">
                    <div class="text-2xl font-bold">29</div>
                    <div class="mt-1 text-sm uppercase text-gray-500">mar 2026</div>
                </div>
            </div>
        </div>
    </a>
</div>
</body></html>
"""

_SAMPLE_DETAIL_HTML = """\
<html>
<head>
    <meta property="og:title" content="Ultra Trail do Marão 2026 - 26 - 29 de março 2026"/>
    <meta property="og:image" content="https://stopandgo.net/storage/images/social/ultra-trail.png"/>
</head>
<body>
<div id="jumbo" class="relative bg-cover bg-center bg-no-repeat p-8">
    <div class="absolute inset-0 bg-cover bg-center bg-no-repeat"
         style="background-image: url(https://stopandgo.com.pt/images/eventos/banner.jpg);"></div>
    <div class="absolute inset-0 bg-dark-blue/70"></div>
    <div class="relative z-10 pt-24">
        <img src="https://stopandgo.com.pt/files/utm-logo.jpg"
             alt="Ultra Trail do Marão 2026"
             class="w-32 md:w-56 rounded-lg shadow-lg">
        <div title="1719"
             class="mt-5 text-3xl font-bold uppercase leading-tight text-white drop-shadow-md font-gobold md:text-4xl xl:text-5xl">
            Ultra Trail do Marão 2026
        </div>
        <div class="mt-4 text-white font-gilroy text-l md:text-2xl drop-shadow-sm">
            Amarante, Portugal
        </div>
        <div class="mt-5 text-white font-gobold">
            <div class="flex items-center gap-4">
                <div class="flex flex-col text-center bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <div class="text-2xl font-bold">26</div>
                    <div class="mt-1 text-sm uppercase">mar 2026</div>
                </div>
                <div class="h-0.5 w-8 bg-accent"></div>
                <div class="flex flex-col text-center bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                    <div class="text-2xl font-bold">29</div>
                    <div class="mt-1 text-sm uppercase">mar 2026</div>
                </div>
            </div>
        </div>
        <div class="mt-6 text-xl uppercase font-gobold text-accent dark:text-accent-light drop-shadow-sm text-bold">
            Trail
        </div>
    </div>
</div>
<div class="container mx-auto p-5">
    <div class="md:flex">
        <div class="mt-6 md:mt-0 text-left md:w-8/12 md:px-10 xl:w-10/12">
            <div class="mt-12 bg-white rounded-lg border p-6">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="md:col-span-1">
                        <h3 class="text-gray-600 font-gilroy text-l font-semibold">Organizador</h3>
                        <p class="mt-1 font-gilroy text-dark-blue font-medium text-lg">
                            SAVAGENATUR EVENTS
                        </p>
                    </div>
                    <div class="md:col-span-1">
                        <h3 class="text-gray-600 font-gilroy text-l font-semibold">Siga-nos</h3>
                        <div class="mt-2 flex gap-2">
                            <a href="http://savagenatur.pt/" target="_blank"
                               class="inline-flex items-center rounded-full font-semibold text-white bg-accent p-2">
                                <span class="iconify" data-icon="feather:globe"></span>
                                <span class="sr-only">Website do Organizador</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
"""

_SAMPLE_PRICES_HTML = """\
<html><body>
<div class="mt-6 md:mt-0 text-left md:w-8/12 md:px-10 xl:w-10/12">
    <div class="text-3xl uppercase font-gobold text-dark-blue text-center">Preços</div>
    <div class="mt-4 rounded-xl border p-4 xl:p-8 bg-white">
        <h1 class="text-left text-2xl uppercase text-gray-500 font-gobold">Fases de Inscrição</h1>
        <div class="mt-8 overflow-x-auto pl-1 font-gobold text-dark-blue text-l md:pl-10">
            <table class="pl-1 md:w-2/5 md:pl-10">
                <tr class="border-b-2"><td class="p-1">PROMO</td><td class="p-1"><div class="h-0 w-8 border border-accent"></div></td><td class="p-1">20/07/2025 21:00</td></tr>
                <tr class="border-b-2"><td class="p-1">1º Period</td><td class="p-1"><div class="h-0 w-8 border border-accent"></div></td><td class="p-1">23/07/2025 00:00</td></tr>
                <tr class="border-b-2"><td class="p-4">Fim das Inscrições</td><td class="p-4"><div class="h-0 w-8 border border-accent"></div></td><td class="p-4">24/03/2026 23:59</td></tr>
            </table>
        </div>
    </div>
    <div class="mt-4 rounded-xl border p-4 xl:p-8 bg-white">
        <h1 class="text-left text-2xl uppercase text-gray-500 font-gobold">Preços</h1>
        <div class="mt-8 overflow-x-auto p-2 pl-1 text-left font-gobold text-dark-blue text-l md:pl-10">
            <div class="mt-8">
                <span class="rounded-xl border-2 px-5 py-2 uppercase text-accent text-l border-accent">
                    Registration
                </span>
            </div>
            <table class="w-4/5 pl-1 md:pl-10 mt-4">
                <tbody>
                <tr>
                    <td class="p-4"></td>
                    <td class="p-4"></td>
                    <td class="border-b-2 p-4 text-right text-accent">PROMO</td>
                    <td class="border-b-2 p-4"></td>
                    <td class="border-b-2 p-4 text-right text-accent">1º Period</td>
                </tr>
                <tr class="border-b-2">
                    <td class="p-4">UTME 120K</td>
                    <td class="p-4"><div class="h-0 w-8 border border-accent"></div></td>
                    <td class="whitespace-nowrap p-4 text-right">90,00 €</td>
                    <td class="p-4"><div class="h-0 w-8 border border-accent"></div></td>
                    <td class="whitespace-nowrap p-4 text-right">100,00 €</td>
                </tr>
                <tr class="border-b-2">
                    <td class="p-4">UTM 60K</td>
                    <td class="p-4"><div class="h-0 w-8 border border-accent"></div></td>
                    <td class="whitespace-nowrap p-4 text-right">55,00 €</td>
                    <td class="p-4"><div class="h-0 w-8 border border-accent"></div></td>
                    <td class="whitespace-nowrap p-4 text-right">65,00 €</td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>
</body></html>
"""

_SAMPLE_RULES_HTML = """\
<html><body>
<div class="mt-6 md:mt-0 text-left md:w-8/12 md:px-10 xl:w-10/12">
    <div class="mb-4 text-3xl uppercase font-gobold text-dark-blue text-center">Regulamento</div>
    <div classs="mt-4 text-left">
        <a href="https://stopandgo.com.pt/files/ultra-trail-do-marao-2026/Regulamento_UTM_2026.pdf" download
           class="inline-flex items-center rounded-lg bg-accent px-6 py-3 text-white font-gobold uppercase text-sm">
            <span class="mr-1 inline-block iconify" data-icon="feather:download"></span> Download
        </a>
    </div>
</div>
</body></html>
"""


def test_extract_event_cards() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_LIST_HTML, "lxml")
    cards = scraper._extract_event_cards(soup)
    assert len(cards) == 2

    assert cards[0].title == "LYNXRACE MOURA 2026"
    assert cards[0].sport_type_text == "Provas de obstáculos"
    assert cards[0].city == "Moura"
    assert cards[0].country == "Portugal"
    assert cards[0].image_url == "https://stopandgo.com.pt/files/lynxrace.jpg"
    assert cards[0].start_date is not None
    assert cards[0].start_date.day == 22
    assert cards[0].start_date.month == 3

    assert cards[1].title == "Ultra Trail do Marão 2026"
    assert cards[1].sport_type_text == "Trail"
    assert cards[1].city == "Amarante"
    assert cards[1].start_date is not None
    assert cards[1].start_date.day == 26
    assert cards[1].end_date is not None
    assert cards[1].end_date.day == 29


def test_extract_title() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    assert scraper._extract_title(soup) == "Ultra Trail do Marão 2026"


def test_extract_event_id() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    assert scraper._extract_event_id(soup) == "1719"


def test_extract_location() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    assert scraper._extract_location(soup) == "Amarante, Portugal"


def test_extract_dates() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    start, end = scraper._extract_dates(soup)
    assert start is not None
    assert start.day == 26
    assert start.month == 3
    assert start.year == 2026
    assert end is not None
    assert end.day == 29


def test_extract_sport_type_text() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    assert scraper._extract_sport_type_text(soup) == "Trail"


def test_extract_organizer() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    assert scraper._extract_organizer(soup) == "SAVAGENATUR EVENTS"


def test_extract_image() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    assert scraper._extract_image(soup) == "https://stopandgo.com.pt/files/utm-logo.jpg"


def test_extract_organizer_url() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_DETAIL_HTML, "lxml")
    assert scraper._extract_organizer_url(soup) == "http://savagenatur.pt/"


def test_extract_pricing_tables() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_PRICES_HTML, "lxml")
    variants, pricing = scraper._extract_pricing_tables(soup)

    assert len(variants) == 2
    assert variants[0].name == "UTME 120K"
    assert variants[0].distance_km == 120.0
    assert variants[1].name == "UTM 60K"
    assert variants[1].distance_km == 60.0

    assert len(pricing) == 4  # 2 variants × 2 phases
    assert pricing[0].variant_name == "UTME 120K"
    assert pricing[0].phase_name == "PROMO"
    assert pricing[0].price == 90.0
    assert pricing[0].note == "Registration"
    assert pricing[1].variant_name == "UTME 120K"
    assert pricing[1].phase_name == "1º Period"
    assert pricing[1].price == 100.0


def test_extract_registration_tiers() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_PRICES_HTML, "lxml")
    _, pricing = scraper._extract_pricing_tables(soup)

    # PROMO phase should have end_date set from registration tiers
    promo_phases = [p for p in pricing if p.phase_name == "PROMO"]
    assert len(promo_phases) == 2
    assert promo_phases[0].end_date is not None
    assert promo_phases[0].end_date.day == 20
    assert promo_phases[0].end_date.month == 7
    assert promo_phases[0].end_date.year == 2025


def test_extract_documents() -> None:
    scraper = StopAndGoScraper()
    soup = BeautifulSoup(_SAMPLE_RULES_HTML, "lxml")
    docs = scraper._extract_documents(soup)

    assert len(docs) == 1
    assert docs[0].document_type == "regulation"
    assert docs[0].original_url.endswith(".pdf")
    assert docs[0].mime_type == "application/pdf"


def test_slug_from_url() -> None:
    assert StopAndGoScraper._slug_from_url(
        "https://stopandgo.net/events/ultra-trail-do-marao-2026"
    ) == "ultra-trail-do-marao-2026"


def test_parse_date_range_text_range() -> None:
    scraper = StopAndGoScraper()
    start, end = scraper._parse_date_range_text("26 - 29 de março 2026")
    assert start is not None
    assert start.day == 26
    assert start.month == 3
    assert end is not None
    assert end.day == 29


def test_parse_date_range_text_single() -> None:
    scraper = StopAndGoScraper()
    start, end = scraper._parse_date_range_text("22 de março 2026")
    assert start is not None
    assert start.day == 22
    assert end is None


def test_parse_date_range_text_slash_format() -> None:
    scraper = StopAndGoScraper()
    start, end = scraper._parse_date_range_text("22/03/2026 - 05/07/2026")
    assert start is not None
    assert start.day == 22
    assert start.month == 3
    assert end is not None
    assert end.day == 5
    assert end.month == 7
