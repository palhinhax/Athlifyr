"""Tests for ITRA scraper."""

from datetime import datetime

from app.sources.itra.scraper import (
    ITRAScraper,
    _clean_html_text,
    _extract_field,
    _parse_calendar_date,
    _parse_distance,
    _parse_elevation,
    _parse_race_date,
)


# ── Date parsing ─────────────────────────────────────────────────


def test_parse_calendar_date_standard() -> None:
    dt = _parse_calendar_date("16", "July", "2026")
    assert dt == datetime(2026, 7, 16)


def test_parse_calendar_date_january() -> None:
    dt = _parse_calendar_date("1", "January", "2027")
    assert dt == datetime(2027, 1, 1)


def test_parse_calendar_date_case_insensitive() -> None:
    dt = _parse_calendar_date("25", "APRIL", "2026")
    assert dt == datetime(2026, 4, 25)


def test_parse_calendar_date_invalid_month() -> None:
    assert _parse_calendar_date("1", "Foobar", "2026") is None


def test_parse_calendar_date_invalid_day() -> None:
    assert _parse_calendar_date("abc", "March", "2026") is None


def test_parse_race_date_slash() -> None:
    dt = _parse_race_date("2026/07/16")
    assert dt == datetime(2026, 7, 16)


def test_parse_race_date_dash() -> None:
    dt = _parse_race_date("2026-07-16")
    assert dt == datetime(2026, 7, 16)


def test_parse_race_date_invalid() -> None:
    assert _parse_race_date("invalid") is None


def test_parse_race_date_empty() -> None:
    assert _parse_race_date("") is None


# ── Distance parsing ─────────────────────────────────────────────


def test_parse_distance_decimal() -> None:
    assert _parse_distance("281.80") == 281.80


def test_parse_distance_with_k() -> None:
    assert _parse_distance("42 k") == 42.0


def test_parse_distance_with_km() -> None:
    assert _parse_distance("10.5km") == 10.5


def test_parse_distance_integer() -> None:
    assert _parse_distance("57") == 57.0


def test_parse_distance_empty() -> None:
    assert _parse_distance("") is None


def test_parse_distance_comma_decimal() -> None:
    assert _parse_distance("10,5") == 10.5


# ── Elevation parsing ────────────────────────────────────────────


def test_parse_elevation_positive() -> None:
    assert _parse_elevation("+9800") == 9800


def test_parse_elevation_negative() -> None:
    assert _parse_elevation("-9840") == 9840


def test_parse_elevation_with_m() -> None:
    assert _parse_elevation("+3000 m") == 3000


def test_parse_elevation_plain() -> None:
    assert _parse_elevation("1500") == 1500


def test_parse_elevation_empty() -> None:
    assert _parse_elevation("") is None


# ── Text helpers ─────────────────────────────────────────────────


def test_clean_html_text_entities() -> None:
    assert _clean_html_text("Proen&#xE7;a.a.Nova") == "Proença.a.Nova"


def test_clean_html_text_whitespace() -> None:
    assert _clean_html_text("  hello   world  ") == "hello world"


def test_clean_html_text_nbsp() -> None:
    # &nbsp; is decoded to \xa0 which \s+ normalises away at start of string
    assert _clean_html_text("&nbsp;Funchal") == "Funchal"


def test_extract_field_standard() -> None:
    html = (
        '<i class="fas fa-route"></i>&nbsp;Distance: '
        '<span style="font-weight:bold">281.80</span>'
    )
    assert _extract_field(html, "Distance") == "281.80"


def test_extract_field_elevation() -> None:
    html = (
        '<i class="fas fa-mountain"></i>&nbsp;Elevation Gain: '
        '<span style="font-weight:bold">+9800</span>'
    )
    assert _extract_field(html, "Elevation Gain") == "+9800"


def test_extract_field_start_time() -> None:
    html = (
        '<i class="fas fa-clock"></i>&nbsp;Start Time: '
        '<span style="font-weight:bold">18:00:00</span>'
    )
    assert _extract_field(html, "Start Time") == "18:00:00"


def test_extract_field_missing() -> None:
    assert _extract_field("<div>no data here</div>", "Distance") is None


def test_extract_field_empty_value() -> None:
    html = '&nbsp;Distance: <span style="font-weight:bold">&nbsp;</span>'
    assert _extract_field(html, "Distance") is None


# ── Calendar listing parsing ─────────────────────────────────────


_CALENDAR_JS_BLOB = (
    "<div class='center-block1'><div class='mb-0'>"
    "<div class='row row-result mb-0 pb-0' style='cursor:pointer;'>"
    "<div class='race_events_list'>"
    "<div class='main_heading'><h2>July&nbsp;2027</div>"
    "<div class='event_heading'></div>"
    "<div class='events-list'>"
    "<div class='row'>"
    "<div class='col-9 col-lg-7 col-sm-8'>"
    "<div class='left_section'>"
    "<div class='event_name'>"
    "<a href='/Races/RaceDetails/Test.Trail.Ultra/2027/99999' target='_blank'>"
    "<h4>Test Trail Ultra</h4></a></div>"
    "<div class='row'>"
    "<div class='col-md-3 border-end w-auto'>"
    "<div class='date'><span>16</span> July<d></d> 2027</div>"
    "<div class='location'>Funchal, PRT"
    "<img src='/images/CountryFlags/pt.svg'></div></div>"
    "</div>"
    "<div class='races'><h5>Races</h5>"
    "<div class='races-boxes'>"
    "<div class='boxes'>"
    "<a href='/Races/RaceDetails/Test.Trail.Ultra.100K/2027/99998' target='_blank'>"
    "<div class='count'>100 k</div>"
    "<div class='d-flex justify-content-between'>"
    "<div class='distance'>+5000 m</div>"
    "</div></a></div>"
    "<div class='boxes'>"
    "<a href='/Races/RaceDetails/Test.Trail.Ultra.50K/2027/99997' target='_blank'>"
    "<div class='count'>50 k</div>"
    "<div class='d-flex justify-content-between'>"
    "<div class='distance'>+2500 m</div>"
    "</div></a></div>"
    "</div></div>"
    "</div></div>"
    "<div class='col-3 col-lg-5 col-sm-4'>"
    "<div class='right_section'>"
    "<a href='https://testtrail.pt' target='_blank'>"
    "<div class='status'>Registration Open</div>"
    "</a></div></div>"
    "</div></div></div></div></div></div>"
)

_CALENDAR_HTML_TEMPLATE = (
    "<html><script>var raceSearchJsonSidePopupNew = [[\""
    + _CALENDAR_JS_BLOB.replace('"', '\\"')
    + "\"]];</script></html>"
)


def test_parse_calendar_listing_event_count() -> None:
    scraper = ITRAScraper()
    events = scraper._parse_calendar_listing(_CALENDAR_HTML_TEMPLATE)
    assert len(events) == 1


def test_parse_calendar_listing_event_name() -> None:
    scraper = ITRAScraper()
    events = scraper._parse_calendar_listing(_CALENDAR_HTML_TEMPLATE)
    assert events[0]["name"] == "Test Trail Ultra"


def test_parse_calendar_listing_date() -> None:
    scraper = ITRAScraper()
    events = scraper._parse_calendar_listing(_CALENDAR_HTML_TEMPLATE)
    assert events[0]["date"] == datetime(2027, 7, 16)


def test_parse_calendar_listing_location() -> None:
    scraper = ITRAScraper()
    events = scraper._parse_calendar_listing(_CALENDAR_HTML_TEMPLATE)
    assert events[0]["location"] == "Funchal"


def test_parse_calendar_listing_variants() -> None:
    scraper = ITRAScraper()
    events = scraper._parse_calendar_listing(_CALENDAR_HTML_TEMPLATE)
    variants = events[0]["variants"]
    assert len(variants) == 2
    assert variants[0]["distance"] == "100 k"
    assert variants[0]["elevation"] == "+5000 m"
    assert variants[1]["distance"] == "50 k"
    assert variants[1]["elevation"] == "+2500 m"


def test_parse_calendar_listing_links() -> None:
    scraper = ITRAScraper()
    events = scraper._parse_calendar_listing(_CALENDAR_HTML_TEMPLATE)
    variants = events[0]["variants"]
    assert "/99998" in variants[0]["link"]
    assert "/99997" in variants[1]["link"]


def test_parse_calendar_listing_registration() -> None:
    scraper = ITRAScraper()
    events = scraper._parse_calendar_listing(_CALENDAR_HTML_TEMPLATE)
    assert events[0]["registration"] == "Open"


def test_parse_calendar_listing_website() -> None:
    scraper = ITRAScraper()
    events = scraper._parse_calendar_listing(_CALENDAR_HTML_TEMPLATE)
    assert events[0]["website"] == "https://testtrail.pt"


def test_parse_calendar_listing_past_events_filtered() -> None:
    """Events with dates in the past should be excluded."""
    past_html = _CALENDAR_HTML_TEMPLATE.replace("2027", "2020")
    scraper = ITRAScraper()
    events = scraper._parse_calendar_listing(past_html)
    assert len(events) == 0


def test_parse_calendar_listing_empty() -> None:
    scraper = ITRAScraper()
    events = scraper._parse_calendar_listing("<html>no data</html>")
    assert events == []


# ── Variant detail parsing ───────────────────────────────────────


_DETAIL_HTML = """
<html>
<body>
<nav></nav>
<h1 class="itra-green display-6 pb-2">Test Trail Ultra 2027</h1>
<img style="width:20px;" src="/images/CountryFlags/pt.svg" />&nbsp;Funchal, Portugal
<div style="font-size:15px">
    <i class="fas fa-calendar itra-green"></i>
    16 July 2027
</div>
<img src="/Files/Events/abc123.png" />
<div class="btn-group" role="group">
    <a class="btn btn-outline-dark itra-green" href="/Races/RaceDetails/Test.Trail.Ultra.100K/2027/99998">Ultra 100K</a>
    <a class="btn btn-outline-dark" href="/Races/RaceDetails/Test.Trail.Ultra.50K/2027/99997">Trail 50K</a>
</div>
<h3>Ultra 100K</h3>
<div id="rdetails">
    <div class="col-6 col-sm-3 p-2">
        <i class="fas fa-calendar"></i>&nbsp;Race Date: <span style="font-weight:bold">2027/07/16</span>
    </div>
    <div class="col-6 col-sm-3 p-2">
        <i class="fas fa-clock"></i>&nbsp;Start Time: <span style="font-weight:bold">06:00:00</span>
    </div>
    <div class="col-6 col-sm-3 p-2">
        <i class="fas fa-running"></i>&nbsp;Participation: <span style="font-weight:bold">solo</span>
    </div>
    <div class="col-6 col-sm-3 p-2">
        <a class="btn" href="https://testtrail.pt/register" target="_blank">Register to this race</a>
    </div>
    <div class="col-6 col-sm-3 p-2">
        <i class="fas fa-route"></i>&nbsp;Distance: <span style="font-weight:bold">100.00</span>
    </div>
    <div class="col-6 col-sm-3 p-2">
        <i class="fas fa-mountain"></i>&nbsp;Elevation Gain: <span style="font-weight:bold">+5000</span>
    </div>
    <div class="col-6 col-sm-3 p-2">
        <i class="fas fa-mountain"></i>&nbsp;Elevation Loss: <span style="font-weight:bold">-5200</span>
    </div>
    <div class="col-6 col-sm-3 p-2">
        <i class="fas fa-alarm-clock"></i>&nbsp;Time Limit: <span style="font-weight:bold">30:0:0</span>
    </div>
    <div class="col-6 col-sm-3 p-2">
        <i class="fas fa-star-of-life"></i>&nbsp;Number of Aid Stations: <span style="font-weight:bold">8</span>
    </div>
    <div class="col-6 col-sm-3 p-2">
        <i class="fas fa-users"></i>&nbsp;Number of Participants: <span style="font-weight:bold">200</span>
    </div>
</div>
<div>Course details</div>
<p>This is a beautiful trail race through the mountains of Madeira island,
featuring stunning views and challenging terrain over 100 kilometers.</p>
<div>RACE RESULTS</div>
<footer></footer>
</body>
</html>
"""


def test_parse_variant_detail_distance() -> None:
    scraper = ITRAScraper()
    result = scraper._parse_variant_detail(_DETAIL_HTML, {"name": "Ultra 100K"})
    assert result is not None
    assert result["variant"].distance_km == 100.0


def test_parse_variant_detail_elevation_gain() -> None:
    scraper = ITRAScraper()
    result = scraper._parse_variant_detail(_DETAIL_HTML, {"name": "Ultra 100K"})
    assert result["variant"].elevation_gain_m == 5000


def test_parse_variant_detail_elevation_loss() -> None:
    scraper = ITRAScraper()
    result = scraper._parse_variant_detail(_DETAIL_HTML, {"name": "Ultra 100K"})
    assert result["variant"].elevation_loss_m == 5200


def test_parse_variant_detail_start_time() -> None:
    scraper = ITRAScraper()
    result = scraper._parse_variant_detail(_DETAIL_HTML, {"name": "Ultra 100K"})
    assert result["variant"].start_time == "06:00:00"


def test_parse_variant_detail_name() -> None:
    scraper = ITRAScraper()
    result = scraper._parse_variant_detail(_DETAIL_HTML, {"name": "Ultra 100K"})
    assert result["variant"].name == "Ultra 100K"


def test_parse_variant_detail_raw_data() -> None:
    scraper = ITRAScraper()
    result = scraper._parse_variant_detail(_DETAIL_HTML, {"name": "Ultra 100K"})
    raw = result["raw"]
    assert raw["race_date"] == "2027/07/16"
    assert raw["time_limit"] == "30:0:0"
    assert raw["aid_stations"] == "8"
    assert raw["participants"] == "200"
    assert raw["participation"] == "solo"


def test_parse_variant_detail_fallback_to_calendar() -> None:
    """When detail page lacks data, fall back to calendar-provided info."""
    scraper = ITRAScraper()
    empty_html = "<html><body><h3>Race X</h3></body></html>"
    result = scraper._parse_variant_detail(
        empty_html, {"name": "50K Race", "distance": "50 k", "elevation": "+2500 m"}
    )
    assert result is not None
    assert result["variant"].distance_km == 50.0
    assert result["variant"].elevation_gain_m == 2500


def test_parse_variant_detail_midnight_start_time() -> None:
    """Start time 00:00:00 should be treated as not set."""
    html = (
        '&nbsp;Start Time: <span style="font-weight:bold">00:00:00</span>'
        '&nbsp;Distance: <span style="font-weight:bold">42.00</span>'
    )
    scraper = ITRAScraper()
    result = scraper._parse_variant_detail(html, {"name": "Trail 42K"})
    assert result["variant"].start_time is None


# ── Detail page → event_info parsing ─────────────────────────────


def test_parse_detail_page_to_event_info() -> None:
    scraper = ITRAScraper()
    info = scraper._parse_detail_page_to_event_info(
        _DETAIL_HTML, "https://itra.run/Races/RaceDetails/Test/2027/99998"
    )
    assert info is not None
    assert info["name"] == "Test Trail Ultra"
    assert info["date"] == datetime(2027, 7, 16)


def test_parse_detail_page_variant_tabs() -> None:
    scraper = ITRAScraper()
    info = scraper._parse_detail_page_to_event_info(
        _DETAIL_HTML, "https://itra.run/Races/RaceDetails/Test/2027/99998"
    )
    assert len(info["variants"]) == 2
    assert info["variants"][0]["name"] == "Ultra 100K"
    assert info["variants"][1]["name"] == "Trail 50K"


def test_parse_detail_page_no_h1() -> None:
    scraper = ITRAScraper()
    info = scraper._parse_detail_page_to_event_info(
        "<html><body>no title</body></html>",
        "https://itra.run/Races/RaceDetails/Test/2027/99998",
    )
    assert info is None


# ── Variant from calendar fallback ───────────────────────────────


def test_variant_from_calendar() -> None:
    v = ITRAScraper._variant_from_calendar(
        {"distance": "42 k", "elevation": "+2300 m", "name": "Trail 42K"}
    )
    assert v is not None
    assert v.name == "Trail 42K"
    assert v.distance_km == 42.0
    assert v.elevation_gain_m == 2300


def test_variant_from_calendar_no_name() -> None:
    v = ITRAScraper._variant_from_calendar(
        {"distance": "100 k", "elevation": "+5000 m"}
    )
    assert v is not None
    assert v.name == "100 k"


# ── Scraper metadata ─────────────────────────────────────────────


def test_scraper_attributes() -> None:
    scraper = ITRAScraper()
    assert scraper.source_name == "itra"
    assert scraper.display_name == "ITRA"
    assert scraper.base_url == "https://itra.run"
    assert "trail" in scraper.description.lower()
