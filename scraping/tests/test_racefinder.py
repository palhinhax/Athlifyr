"""Tests for RaceFinder scraper."""

from datetime import datetime

import pytest

from app.sources.racefinder.scraper import (
    RaceFinderScraper,
    _extract_coords_from_maps_url,
    _map_sport_types,
    _parse_end_date,
    _parse_hero_date,
    _parse_listing_date,
    _parse_price,
    _parse_time,
    _parse_variant_date,
    _parse_variant_title,
)


# ── Listing date parsing ────────────────────────────────────────


def test_parse_listing_date_standard() -> None:
    assert _parse_listing_date("19", "Apr") == (19, 4)


def test_parse_listing_date_jan() -> None:
    assert _parse_listing_date("1", "Jan") == (1, 1)


def test_parse_listing_date_dec() -> None:
    assert _parse_listing_date("25", "Dec") == (25, 12)


def test_parse_listing_date_case_insensitive() -> None:
    assert _parse_listing_date("15", "MAR") == (15, 3)


def test_parse_listing_date_invalid_month() -> None:
    assert _parse_listing_date("1", "Xyz") is None


def test_parse_listing_date_invalid_day() -> None:
    assert _parse_listing_date("abc", "Apr") is None


# ── Hero date parsing ────────────────────────────────────────────


def test_parse_hero_date_full() -> None:
    dt = _parse_hero_date("Sun, April 19, 2026")
    assert dt == datetime(2026, 4, 19)


def test_parse_hero_date_without_day_name() -> None:
    dt = _parse_hero_date("March 28, 2026")
    assert dt is not None
    assert dt.month == 3
    assert dt.day == 28


def test_parse_hero_date_empty() -> None:
    assert _parse_hero_date("") is None


def test_parse_hero_date_invalid() -> None:
    assert _parse_hero_date("no date here") is None


def test_parse_hero_date_range() -> None:
    dt = _parse_hero_date("March 26 — March 29, 2026")
    assert dt is not None
    assert dt.month == 3
    assert dt.day == 26


# ── End date parsing ─────────────────────────────────────────────


def test_parse_end_date_range() -> None:
    dt = _parse_end_date("March 26 — March 29, 2026")
    assert dt == datetime(2026, 3, 29)


def test_parse_end_date_single_day() -> None:
    assert _parse_end_date("Sun, April 19, 2026") is None


def test_parse_end_date_empty() -> None:
    assert _parse_end_date("") is None


# ── Variant date parsing ─────────────────────────────────────────


def test_parse_variant_date_standard() -> None:
    dt = _parse_variant_date("19 Apr, 2026")
    assert dt == datetime(2026, 4, 19)


def test_parse_variant_date_no_comma() -> None:
    dt = _parse_variant_date("19 Apr 2026")
    assert dt == datetime(2026, 4, 19)


def test_parse_variant_date_invalid() -> None:
    assert _parse_variant_date("invalid") is None


def test_parse_variant_date_empty() -> None:
    assert _parse_variant_date("") is None


# ── Variant title parsing ────────────────────────────────────────


def test_parse_variant_title_trail_run() -> None:
    name, dist = _parse_variant_title("Trail Run 25 km")
    assert name == "Trail Run 25 km"
    assert dist == 25.0


def test_parse_variant_title_walking() -> None:
    name, dist = _parse_variant_title("Walking 8 km")
    assert name == "Walking 8 km"
    assert dist == 8.0


def test_parse_variant_title_road_running() -> None:
    name, dist = _parse_variant_title("Road Running 14 km")
    assert dist == 14.0


def test_parse_variant_title_half_marathon() -> None:
    name, dist = _parse_variant_title("Road Running 21,1 KM")
    assert dist == pytest.approx(21.1)


def test_parse_variant_title_metres() -> None:
    name, dist = _parse_variant_title("Open Water 3000 M")
    assert dist == pytest.approx(3.0)


def test_parse_variant_title_no_distance() -> None:
    name, dist = _parse_variant_title("Hybrid Race")
    assert name == "Hybrid Race"
    assert dist is None


def test_parse_variant_title_btt_time() -> None:
    name, dist = _parse_variant_title("BTT 3H")
    assert name == "BTT 3H"
    assert dist is None


def test_parse_variant_title_decimal_comma() -> None:
    name, dist = _parse_variant_title("Trail Run 37,9 km")
    assert dist == pytest.approx(37.9)


def test_parse_variant_title_with_k() -> None:
    name, dist = _parse_variant_title("Trail Run 25 k")
    assert dist == 25.0


# ── Price parsing ─────────────────────────────────────────────────


def test_parse_price_euro() -> None:
    assert _parse_price("21€") == 21.0


def test_parse_price_euro_space() -> None:
    assert _parse_price("21 €") == 21.0


def test_parse_price_decimal() -> None:
    assert _parse_price("12,50€") == 12.5


def test_parse_price_free() -> None:
    assert _parse_price("FREE") == 0.0


def test_parse_price_free_lower() -> None:
    assert _parse_price("free") == 0.0


def test_parse_price_empty() -> None:
    assert _parse_price("") is None


def test_parse_price_no_digits() -> None:
    assert _parse_price("abc") is None


# ── Time parsing ──────────────────────────────────────────────────


def test_parse_time_standard() -> None:
    assert _parse_time("9:00") == "9:00"


def test_parse_time_padded() -> None:
    assert _parse_time("09:30") == "09:30"


def test_parse_time_no_match() -> None:
    assert _parse_time("no time") is None


def test_parse_time_empty() -> None:
    assert _parse_time("") is None


# ── Coordinates from Maps URL ────────────────────────────────────


def test_extract_coords_standard() -> None:
    url = "https://www.google.com/maps/dir/?api=1&destination=41.4314,-8.4468"
    result = _extract_coords_from_maps_url(url)
    assert result == pytest.approx((41.4314, -8.4468))


def test_extract_coords_no_match() -> None:
    assert _extract_coords_from_maps_url("https://example.com") is None


def test_extract_coords_negative() -> None:
    url = "https://www.google.com/maps/dir/?api=1&destination=38.7223,-9.1393"
    result = _extract_coords_from_maps_url(url)
    assert result is not None
    assert result[0] == pytest.approx(38.7223)
    assert result[1] == pytest.approx(-9.1393)


# ── Sport type mapping ───────────────────────────────────────────


def test_map_sport_types_running() -> None:
    assert _map_sport_types(["running"]) == ["RUNNING"]


def test_map_sport_types_trail_run() -> None:
    assert _map_sport_types(["trail run"]) == ["TRAIL"]


def test_map_sport_types_cycling() -> None:
    assert _map_sport_types(["cycling"]) == ["CYCLING"]


def test_map_sport_types_mtb() -> None:
    assert _map_sport_types(["mtb"]) == ["BTT"]


def test_map_sport_types_btt() -> None:
    assert _map_sport_types(["btt"]) == ["BTT"]


def test_map_sport_types_swimming() -> None:
    assert _map_sport_types(["swimming"]) == ["SWIMMING"]


def test_map_sport_types_open_water() -> None:
    assert _map_sport_types(["open water"]) == ["SWIMMING"]


def test_map_sport_types_triathlon() -> None:
    assert _map_sport_types(["triathlon"]) == ["TRIATHLON"]


def test_map_sport_types_walking() -> None:
    assert _map_sport_types(["walking"]) == ["WALKING"]


def test_map_sport_types_hybrid() -> None:
    assert _map_sport_types(["hybrid race"]) == ["OCR"]


def test_map_sport_types_multiple() -> None:
    result = _map_sport_types(["trail run", "walking"])
    assert "TRAIL" in result
    assert "WALKING" in result


def test_map_sport_types_dedup() -> None:
    result = _map_sport_types(["running", "road running"])
    assert result == ["RUNNING"]


def test_map_sport_types_unknown() -> None:
    assert _map_sport_types(["completely_unknown"]) == ["OTHER"]


def test_map_sport_types_empty() -> None:
    assert _map_sport_types([]) == ["OTHER"]


# ── Listing page parsing ────────────────────────────────────────


_LISTING_HTML = """
<html><body>
<article class="event">
  <a class="event__overlayLink" href="https://racefinder.pt/event/test-trail/"></a>
  <div class="event__body">
    <div class="event__innerBody">
      <h3 class="event__title">Test Trail</h3>
      <div class="event__description">A trail running event.</div>
      <ul class="event__tags">
        <li class="event__tags__item">Trail Run 25 km</li>
        <li class="event__tags__item">Walking 10 km</li>
      </ul>
    </div>
    <div class="event__footer">
      <div class="event__dates">
        <div class="event__dates__day">19</div>
        <div class="event__dates__month">Apr</div>
      </div>
      <div class="event__features">
        <div class="event__feature">Guarda</div>
        <div class="event__feature">10 € – 25 €</div>
      </div>
      <a class="event__link" href="https://racefinder.pt/event/test-trail/">View event</a>
    </div>
  </div>
</article>
<article class="event">
  <a class="event__overlayLink" href="https://racefinder.pt/event/ocean-swim/"></a>
  <div class="event__body">
    <div class="event__innerBody">
      <h3 class="event__title">Ocean Swim</h3>
    </div>
    <div class="event__footer">
      <a class="event__link" href="https://racefinder.pt/event/ocean-swim/">View event</a>
    </div>
  </div>
</article>
<a href="/all-races/page/2/">2</a>
<a href="/all-races/page/3/">3</a>
<a href="/all-races/page/10/">10</a>
</body></html>
"""


def test_extract_event_links() -> None:
    scraper = RaceFinderScraper()
    links = scraper._extract_event_links(_LISTING_HTML)
    assert "https://racefinder.pt/event/test-trail/" in links
    assert "https://racefinder.pt/event/ocean-swim/" in links
    assert len(links) == 2


def test_detect_total_pages() -> None:
    scraper = RaceFinderScraper()
    pages = scraper._detect_total_pages(_LISTING_HTML)
    assert pages == 10


def test_detect_total_pages_single() -> None:
    scraper = RaceFinderScraper()
    pages = scraper._detect_total_pages("<html><body></body></html>")
    assert pages == 1


# ── Detail page parsing ─────────────────────────────────────────


_DETAIL_HTML = """
<html><head>
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
    {"@type":"BreadcrumbList","itemListElement":[
        {"@type":"ListItem","position":"1","item":{"@id":"https://racefinder.pt","name":"Home"}},
        {"@type":"ListItem","position":"2","item":{"@id":"https://racefinder.pt/events/running/","name":"Running"}},
        {"@type":"ListItem","position":"3","item":{"@id":"https://racefinder.pt/events/running/trail-run/","name":"Trail Run"}}
    ]},
    {"@type":"Product","name":"Test Trail - RaceFinder",
     "description":"A beautiful trail running event in Guarda featuring 25 km and 10 km distances.",
     "category":"Running",
     "offers":{"@type":"AggregateOffer","lowPrice":"10.00","highPrice":"25.00","priceCurrency":"EUR"}}
]}
</script>
</head><body>
<section class="eventHero">
  <div class="eventHero__inner">
    <a href="https://racefinder.pt/events/running/">Running</a>
    <a href="https://racefinder.pt/events/running/trail-run/">Trail Run</a>
    <h1 class="eventHero__title">Test Trail 2026</h1>
    <ul class="eventHero__features">
      <li class="eventHero__featuresItem">Sun, April 19, 2026</li>
      <li class="eventHero__featuresItem">10 € — 25 €</li>
      <li class="eventHero__featuresItem">2 races</li>
    </ul>
    <div class="eventHero__summaryDescription">
      <p>A beautiful trail running event in Guarda.</p>
    </div>
  </div>
</section>
<div class="eventInfo">
  <div class="eventInfo__container">
    <section class="eventInfo__block">
      <div class="eventInfo__blockHeader">Information</div>
      <div class="eventInfo__blockReadmore">
        <div class="eventInfo__blockReadmore__content">
          <a href="https://example.com/regulation.pdf">Regulation link ↗</a>
          <p>Age categories: MJun, MSen, M40</p>
          <p>Start times: Trail 25 km: 09:00, Trail 10 km: 09:30</p>
        </div>
      </div>
    </section>
    <section class="eventInfo__block">
      <div class="eventInfo__blockHeader">Location</div>
      <div class="eventInfo__block_location">
        <div class="eventInfo__block_locationHeader">Guarda</div>
      </div>
      <a href="https://www.google.com/maps/dir/?api=1&destination=40.5373,-7.2680">Get directions</a>
    </section>
    <section class="eventInfo__block accordion is-active">
      <div class="eventInfo__blockHeader accordion__header">Races</div>
      <div class="raceDayGrid">
        <article class="raceDay">
          <div class="raceDay__header">
            <h3 class="raceDay__title">Trail Run 25 km</h3>
            <div class="raceDay__details">
              <div class="raceDay__feature">19 Apr, 2026</div>
              <div class="raceDay__feature">9:00</div>
            </div>
          </div>
          <div class="raceDay__price">25€</div>
        </article>
        <article class="raceDay">
          <div class="raceDay__header">
            <h3 class="raceDay__title">Walking 10 km</h3>
            <div class="raceDay__details">
              <div class="raceDay__feature">19 Apr, 2026</div>
              <div class="raceDay__feature">9:30</div>
            </div>
          </div>
          <div class="raceDay__price">10€</div>
        </article>
      </div>
    </section>
    <section class="eventInfo__block">
      <div class="eventInfo__blockHeader">Benefits</div>
      <div class="eventInfo__raceBenefits">Kit and finisher medal.</div>
    </section>
  </div>
</div>
</body></html>
"""


def test_parse_detail_title() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert event.title == "Test Trail 2026"


def test_parse_detail_description() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert "beautiful trail running event" in event.description


def test_parse_detail_date() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert event.start_date == datetime(2026, 4, 19)


def test_parse_detail_city() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert event.city == "Guarda"


def test_parse_detail_coordinates() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert event.latitude == pytest.approx(40.5373)
    assert event.longitude == pytest.approx(-7.2680)


def test_parse_detail_maps_url() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert "destination=40.5373,-7.2680" in event.google_maps_url


def test_parse_detail_image_always_none() -> None:
    """image_url must ALWAYS be None for RaceFinder."""
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert event.image_url is None


def test_parse_detail_source_url() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert event.source_url == "https://racefinder.pt/event/test-trail/"


def test_parse_detail_sport_types() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert "TRAIL" in event.sport_types


def test_parse_detail_variants_count() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert len(event.variants) == 2


def test_parse_detail_variant_trail() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    v = event.variants[0]
    assert v.name == "Trail Run 25 km"
    assert v.distance_km == 25.0
    assert v.start_time == "9:00"
    assert v.price == 25.0


def test_parse_detail_variant_walking() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    v = event.variants[1]
    assert v.name == "Walking 10 km"
    assert v.distance_km == 10.0
    assert v.start_time == "9:30"
    assert v.price == 10.0


def test_parse_detail_documents() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert len(event.documents) == 1
    doc = event.documents[0]
    assert doc.original_url == "https://example.com/regulation.pdf"
    assert doc.document_type == "regulation"


def test_parse_detail_country_portugal() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert event.country == "Portugal"


# ── Multi-day event ──────────────────────────────────────────────


_MULTIDAY_HTML = """
<html><head></head><body>
<section class="eventHero">
  <h1 class="eventHero__title">Ultra Marathon Weekend</h1>
  <ul class="eventHero__features">
    <li class="eventHero__featuresItem">Fri, March 26 — March 29, 2026</li>
    <li class="eventHero__featuresItem">25 € — 130 €</li>
  </ul>
  <div class="eventHero__summaryDescription">
    <p>A multi-day ultra event in the mountains.</p>
  </div>
</section>
<div class="eventInfo"><div class="eventInfo__container">
</div></div>
</body></html>
"""


def test_parse_multiday_start_date() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_MULTIDAY_HTML, "https://racefinder.pt/event/ultra/")
    assert event is not None
    assert event.start_date == datetime(2026, 3, 26)


def test_parse_multiday_end_date() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_MULTIDAY_HTML, "https://racefinder.pt/event/ultra/")
    assert event is not None
    assert event.end_date == datetime(2026, 3, 29)


# ── Free event ────────────────────────────────────────────────────


_FREE_HTML = """
<html><head></head><body>
<section class="eventHero">
  <h1 class="eventHero__title">Free Run</h1>
  <ul class="eventHero__features">
    <li class="eventHero__featuresItem">Sat, March 28, 2026</li>
    <li class="eventHero__featuresItem">FREE</li>
  </ul>
</section>
<div class="eventInfo"><div class="eventInfo__container">
  <section class="eventInfo__block accordion is-active">
    <div class="eventInfo__blockHeader accordion__header">Races</div>
    <div class="raceDayGrid">
      <article class="raceDay">
        <h3 class="raceDay__title">Road Running 10 km</h3>
        <div class="raceDay__details">
          <div class="raceDay__feature">28 Mar, 2026</div>
          <div class="raceDay__feature">10:00</div>
        </div>
        <div class="raceDay__price">FREE</div>
      </article>
    </div>
  </section>
</div></div>
</body></html>
"""


def test_parse_free_event_price() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_FREE_HTML, "https://racefinder.pt/event/free-run/")
    assert event is not None
    assert event.variants[0].price == 0.0


# ── No title → returns None ──────────────────────────────────────


def test_parse_detail_no_title_returns_none() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail("<html><body></body></html>", "https://racefinder.pt/event/x/")
    assert event is None


# ── Swimming event ────────────────────────────────────────────────


_SWIM_HTML = """
<html><head>
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
    {"@type":"Product","name":"Setúbal Open Water Race - RaceFinder",
     "description":"An open water swimming event.",
     "category":"Swimming"}
]}
</script>
</head><body>
<section class="eventHero">
  <a href="https://racefinder.pt/events/swimming/">Swimming</a>
  <a href="https://racefinder.pt/events/swimming/open-water/">Open Water</a>
  <h1 class="eventHero__title">Setúbal Open Water Race</h1>
  <ul class="eventHero__features">
    <li class="eventHero__featuresItem">Sat, March 28, 2026</li>
  </ul>
</section>
<div class="eventInfo"><div class="eventInfo__container">
  <section class="eventInfo__block accordion is-active">
    <div class="eventInfo__blockHeader">Races</div>
    <div class="raceDayGrid">
      <article class="raceDay">
        <h3 class="raceDay__title">Open Water 3000 M</h3>
        <div class="raceDay__details">
          <div class="raceDay__feature">28 Mar, 2026</div>
          <div class="raceDay__feature">10:00</div>
        </div>
        <div class="raceDay__price">54€</div>
      </article>
      <article class="raceDay">
        <h3 class="raceDay__title">Open Water 750 M</h3>
        <div class="raceDay__details">
          <div class="raceDay__feature">28 Mar, 2026</div>
          <div class="raceDay__feature">11:00</div>
        </div>
        <div class="raceDay__price">16€</div>
      </article>
    </div>
  </section>
</div></div>
</body></html>
"""


def test_parse_swim_sport_types() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_SWIM_HTML, "https://racefinder.pt/event/swim/")
    assert event is not None
    assert "SWIMMING" in event.sport_types


def test_parse_swim_variant_distance_metres() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_SWIM_HTML, "https://racefinder.pt/event/swim/")
    assert event is not None
    assert event.variants[0].distance_km == pytest.approx(3.0)
    assert event.variants[1].distance_km == pytest.approx(0.75)


# ── Cycling event ─────────────────────────────────────────────────


_CYCLING_HTML = """
<html><head>
<script type="application/ld+json">
{"@context":"https://schema.org","@graph":[
    {"@type":"Product","name":"BTT Raid - RaceFinder",
     "description":"Mountain bike endurance event.",
     "category":"Cycling"}
]}
</script>
</head><body>
<section class="eventHero">
  <a href="https://racefinder.pt/events/cycling/">Cycling</a>
  <h1 class="eventHero__title">BTT Raid</h1>
  <ul class="eventHero__features">
    <li class="eventHero__featuresItem">Sun, March 29, 2026</li>
  </ul>
</section>
<div class="eventInfo"><div class="eventInfo__container">
  <section class="eventInfo__block">
    <div class="eventInfo__blockHeader">Location</div>
    <div class="eventInfo__block_location">
      <div class="eventInfo__block_locationHeader">Alvaiázere</div>
    </div>
  </section>
  <section class="eventInfo__block accordion is-active">
    <div class="eventInfo__blockHeader">Races</div>
    <div class="raceDayGrid">
      <article class="raceDay">
        <h3 class="raceDay__title">MTB 20 km</h3>
        <div class="raceDay__details">
          <div class="raceDay__feature">29 Mar, 2026</div>
          <div class="raceDay__feature">8:30</div>
        </div>
        <div class="raceDay__price">13€</div>
      </article>
      <article class="raceDay">
        <h3 class="raceDay__title">Raid 40 km</h3>
        <div class="raceDay__details">
          <div class="raceDay__feature">29 Mar, 2026</div>
          <div class="raceDay__feature">8:00</div>
        </div>
        <div class="raceDay__price">13€</div>
      </article>
    </div>
  </section>
</div></div>
</body></html>
"""


def test_parse_cycling_sport_types() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_CYCLING_HTML, "https://racefinder.pt/event/btt/")
    assert event is not None
    # Should have BTT from variant titles and/or CYCLING from category
    sport_types = event.sport_types
    assert "BTT" in sport_types or "CYCLING" in sport_types


def test_parse_cycling_city() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_CYCLING_HTML, "https://racefinder.pt/event/btt/")
    assert event is not None
    assert event.city == "Alvaiázere"


def test_parse_cycling_variants() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_CYCLING_HTML, "https://racefinder.pt/event/btt/")
    assert event is not None
    assert len(event.variants) == 2
    assert event.variants[0].name == "MTB 20 km"
    assert event.variants[0].distance_km == 20.0
    assert event.variants[1].name == "Raid 40 km"
    assert event.variants[1].distance_km == 40.0


# ── No regulation links ──────────────────────────────────────────


def test_parse_detail_no_documents() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_FREE_HTML, "https://racefinder.pt/event/free/")
    assert event is not None
    assert event.documents == []


# ── Regulation with Regulation in text ────────────────────────────


_REG_HTML = """
<html><head></head><body>
<section class="eventHero">
  <h1 class="eventHero__title">Test Event</h1>
  <ul class="eventHero__features">
    <li class="eventHero__featuresItem">Mon, March 28, 2026</li>
  </ul>
</section>
<div class="eventInfo"><div class="eventInfo__container">
  <section class="eventInfo__block">
    <div class="eventInfo__blockHeader">Information</div>
    <div class="eventInfo__blockReadmore">
      <div class="eventInfo__blockReadmore__content">
        <a href="https://example.com/storage/files/reg.pdf">Regulation link ↗</a>
        <a href="https://example.com/other">Other link</a>
        <a href="https://example.com/regulamento-v2.pdf">Regulamento v2</a>
      </div>
    </div>
  </section>
</div></div>
</body></html>
"""


def test_parse_regulation_links() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_REG_HTML, "https://racefinder.pt/event/test/")
    assert event is not None
    # Should find 2 regulation links (the "regulation" text one and the regulamento PDF one)
    assert len(event.documents) == 2
    urls = {d.original_url for d in event.documents}
    assert "https://example.com/storage/files/reg.pdf" in urls
    assert "https://example.com/regulamento-v2.pdf" in urls


# ── Registry placement ───────────────────────────────────────────


def test_racefinder_is_last_in_registry() -> None:
    """RaceFinder must be the LAST scraper in the registry."""
    from app.sources.registry import _SCRAPERS
    keys = list(_SCRAPERS.keys())
    assert keys[-1] == "racefinder"


def test_racefinder_is_after_itra() -> None:
    """RaceFinder must come after ITRA (which is second-to-last)."""
    from app.sources.registry import _SCRAPERS
    keys = list(_SCRAPERS.keys())
    itra_idx = keys.index("itra")
    rf_idx = keys.index("racefinder")
    assert rf_idx > itra_idx


# ── Scraper metadata ─────────────────────────────────────────────


def test_scraper_source_name() -> None:
    scraper = RaceFinderScraper()
    assert scraper.source_name == "racefinder"


def test_scraper_display_name() -> None:
    scraper = RaceFinderScraper()
    assert scraper.display_name == "RaceFinder"


def test_scraper_base_url() -> None:
    scraper = RaceFinderScraper()
    assert scraper.base_url == "https://racefinder.pt"


# ── Description from summary when no JSON-LD ─────────────────────


def test_parse_detail_fallback_summary_description() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_MULTIDAY_HTML, "https://racefinder.pt/event/ultra/")
    assert event is not None
    assert "multi-day ultra event" in event.description


# ── End date None for single-day events ───────────────────────────


def test_parse_single_day_end_date_is_none() -> None:
    scraper = RaceFinderScraper()
    event = scraper._parse_event_detail(_DETAIL_HTML, "https://racefinder.pt/event/test-trail/")
    assert event is not None
    assert event.end_date is None
