"""ITRA scraper — International Trail Running Association.

Scrapes trail-running events in Portugal from itra.run, the global
reference for trail running.  The calendar is a server-rendered page
that returns events/races as HTML inside a JS array.  Each event may
contain multiple race variants (distances) with per-variant detail
pages providing distance, elevation, start time, ITRA points, and
organiser links.

Data extracted:
  • Event name, date, location (city / country)
  • Race variants with distance (km), elevation gain/loss (m)
  • Start time, time limit, number of aid stations
  • ITRA Points, Mountain Level, Finisher Level
  • Event image, organiser website, registration link
  • Course description text
"""

from __future__ import annotations

import html as html_mod
import json
import logging
import re
from datetime import datetime
from urllib.parse import urljoin

from bs4 import BeautifulSoup

from app.sources.base.scraper import (
    BaseScraper,
    ScrapedEventData,
    ScrapedVariantData,
)

logger = logging.getLogger(__name__)

_BASE = "https://itra.run"
_CALENDAR_URL = f"{_BASE}/Races/RaceCalendar"

# Month name → number (ITRA uses English month names)
_MONTHS: dict[str, int] = {
    "january": 1, "february": 2, "march": 3, "april": 4,
    "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}


# ── Helpers ───────────────────────────────────────────────────────


def _parse_calendar_date(day: str, month: str, year: str) -> datetime | None:
    """Parse a date from calendar listing like ('16', 'July', '2026')."""
    m = _MONTHS.get(month.strip().lower())
    if not m:
        return None
    try:
        return datetime(int(year), m, int(day))
    except (ValueError, TypeError):
        return None


def _parse_race_date(text: str) -> datetime | None:
    """Parse a race date like '2026/07/16'."""
    text = text.strip()
    for fmt in ("%Y/%m/%d", "%Y-%m-%d", "%d/%m/%Y"):
        try:
            return datetime.strptime(text, fmt)
        except ValueError:
            continue
    return None


def _parse_distance(text: str) -> float | None:
    """Parse distance from text like '281.80' or '42 k' or '10.5k'."""
    text = text.strip().lower().replace(",", ".")
    m = re.search(r"([\d.]+)\s*k?m?", text)
    if m:
        try:
            return float(m.group(1))
        except ValueError:
            pass
    return None


def _parse_elevation(text: str) -> int | None:
    """Parse elevation from text like '+9800' or '-9840' or '+3000 m'."""
    m = re.search(r"[+\-]?\s*(\d+)", text.strip())
    if m:
        try:
            return int(m.group(1))
        except ValueError:
            pass
    return None


def _clean_html_text(text: str) -> str:
    """Unescape HTML entities and normalise whitespace."""
    text = html_mod.unescape(text)
    return re.sub(r"\s+", " ", text).strip()


def _extract_field(html_text: str, label: str) -> str | None:
    """Extract a bold field value after an &nbsp; label on a detail page.

    Pattern: ``&nbsp;{label}: <span style="font-weight:bold">{value}</span>``
    """
    pattern = re.escape(label) + r":\s*<span[^>]*>\s*([^<]+)"
    m = re.search(pattern, html_text, re.IGNORECASE)
    if m:
        val = m.group(1).strip()
        if val and val != "&nbsp;":
            return val
    return None


# ── Scraper ───────────────────────────────────────────────────────


class ITRAScraper(BaseScraper):
    source_name = "itra"
    display_name = "ITRA"
    base_url = _BASE
    description = (
        "International Trail Running Association — global trail-running "
        "calendar with ITRA Points & race scores — itra.run"
    )

    # ── Main scrape ──────────────────────────────────────────────

    async def scrape(self) -> list[ScrapedEventData]:
        """Scrape all Portuguese trail-running events from ITRA."""

        # Step 1: fetch the calendar page to get CSRF token + cookies
        calendar_html = await self.fetch_page(_CALENDAR_URL)
        token = self._extract_csrf_token(calendar_html)

        # Step 2: POST search for Portugal events
        listing_html = await self._post_search(token)
        if not listing_html:
            logger.warning("ITRA calendar search returned no HTML")
            return []

        # Step 3: parse events from the JSON blob
        raw_events = self._parse_calendar_listing(listing_html)
        logger.info("ITRA calendar returned %d events", len(raw_events))

        # Step 4: for each event, visit detail page and extract full data
        results: list[ScrapedEventData] = []
        for ev_info in raw_events:
            try:
                event = await self._scrape_event_detail(ev_info)
                if event:
                    results.append(event)
            except Exception:
                logger.exception(
                    "Failed to scrape ITRA event: %s", ev_info.get("name")
                )

        return results

    async def scrape_event(self, url: str) -> ScrapedEventData | None:
        """Scrape a single ITRA race detail page."""
        if not url.startswith("http"):
            url = urljoin(_BASE, url)

        html = await self.fetch_page(url)

        # Extract event name + variant tabs from the page
        ev_info = self._parse_detail_page_to_event_info(html, url)
        if not ev_info:
            return None

        return await self._scrape_event_detail(ev_info, prefetched_html=html)

    # ── Calendar search ──────────────────────────────────────────

    def _extract_csrf_token(self, html: str) -> str:
        """Extract ASP.NET __RequestVerificationToken."""
        m = re.search(
            r'__RequestVerificationToken[^>]*value="([^"]*)"', html
        )
        return m.group(1) if m else ""

    async def _post_search(self, token: str) -> str | None:
        """POST search form for Portugal events and return the HTML."""
        client = await self._get_client()
        data = {
            "__RequestVerificationToken": token,
            "Input.Country": "PT",
            "Input.resultcount": "500",
        }
        resp = await client.post(_CALENDAR_URL, data=data)
        resp.raise_for_status()
        return resp.text

    def _parse_calendar_listing(self, html: str) -> list[dict]:
        """Parse events from the raceSearchJsonSidePopupNew JS variable.

        Returns a list of dicts, one per unique event (grouped by name+date):
        {
            "name": str,
            "date": datetime | None,
            "location": str,
            "event_link": str,        # first variant detail link
            "variants": [{             # per-race summary
                "link": str,
                "distance": str,
                "elevation": str,
            }],
            "website": str | None,
            "registration": str,       # "Open" / "Closed" / ""
        }
        """
        # Extract the JS array
        m = re.search(
            r"var raceSearchJsonSidePopupNew\s*=\s*(\[.*?\]);",
            html,
            re.DOTALL,
        )
        if not m:
            return []

        raw_js = m.group(1)

        # Split by event heading to isolate each event card
        blocks = re.split(r"class='event_heading'", raw_js)

        events: list[dict] = []
        seen: set[str] = set()

        for block in blocks[1:]:  # skip content before first event
            # Event name
            name_m = re.search(r"<h4>(.*?)</h4", block)
            name = _clean_html_text(name_m.group(1)) if name_m else ""
            if not name:
                continue

            # First (event-level) link
            link_m = re.search(
                r"href='(/Races/RaceDetails/[^']*)'", block
            )
            event_link = link_m.group(1) if link_m else ""

            # Date
            date_m = re.search(
                r"class='date'><span>(\d+)</span>\s*(\w+).*?(\d{4})",
                block,
            )
            dt: datetime | None = None
            if date_m:
                dt = _parse_calendar_date(
                    date_m.group(1), date_m.group(2), date_m.group(3)
                )

            # Only future events
            if dt and dt < datetime.now():
                continue

            # Location
            loc_m = re.search(r"class='location'>(.*?)<img", block)
            location = ""
            if loc_m:
                location = _clean_html_text(
                    re.sub(r"<[^>]+>", "", loc_m.group(1))
                ).rstrip(", PRT").rstrip(", ")

            # Race boxes (variants) — each has link, distance, elevation
            variants = []
            boxes = re.findall(
                r"class='boxes'><a href='(/Races/RaceDetails/[^']*)'[^>]*>"
                r"<div class='count'>(.*?)</div>.*?"
                r"class='distance'>(.*?)</div>",
                block,
            )
            for v_link, dist, elev in boxes:
                variants.append({
                    "link": v_link,
                    "distance": _clean_html_text(dist),
                    "elevation": _clean_html_text(elev),
                })

            # Registration status
            reg_m = re.search(
                r"Registration\s+(Open|Closed)", block, re.IGNORECASE
            )
            registration = reg_m.group(1) if reg_m else ""

            # Organiser website
            web_m = re.search(
                r"href='(https?://(?!itra\.run)[^']*)'", block
            )
            website = web_m.group(1) if web_m else None

            # Dedup by name + date
            key = f"{name}|{dt}"
            if key in seen:
                continue
            seen.add(key)

            events.append({
                "name": name,
                "date": dt,
                "location": location,
                "event_link": event_link,
                "variants": variants,
                "website": website,
                "registration": registration,
            })

        return events

    # ── Detail page parsing ──────────────────────────────────────

    def _parse_detail_page_to_event_info(
        self, html: str, url: str
    ) -> dict | None:
        """Build a minimal event_info dict from a detail page (for scrape_event)."""
        soup = BeautifulSoup(html, "lxml")
        h1 = soup.select_one("h1.itra-green")
        if not h1:
            return None

        title_raw = h1.get_text(strip=True)
        # Remove trailing year from title (e.g. "Madeira Island Ultra Trail 2025")
        title = re.sub(r"\s+\d{4}$", "", title_raw).strip()

        # Location
        loc_block = soup.find(string=re.compile(r"Event Information"))
        location = ""
        if loc_block:
            parent = loc_block.find_parent("div", class_="row")
            if parent:
                loc_text = parent.get_text(" ", strip=True)
                m = re.search(r"&nbsp;(.+?),\s*Portugal", loc_text)
                if not m:
                    m = re.search(r"\xa0(.+?),\s*Portugal", loc_text)
                if m:
                    location = _clean_html_text(m.group(1))

        # Date from event info
        date_div = soup.select_one("i.fa-calendar.itra-green")
        dt = None
        if date_div:
            date_text = date_div.find_parent("div")
            if date_text:
                raw = date_text.get_text(strip=True)
                # Format: "16 July 2026"
                dm = re.search(r"(\d{1,2})\s+(\w+)\s+(\d{4})", raw)
                if dm:
                    dt = _parse_calendar_date(
                        dm.group(1), dm.group(2), dm.group(3)
                    )

        # Variant links from the button group
        variants = []
        btn_group = soup.select_one(".btn-group")
        if btn_group:
            for a in btn_group.select("a[href*='RaceDetails']"):
                href = a.get("href", "")
                v_name = a.get_text(strip=True)
                variants.append({
                    "link": href,
                    "distance": "",
                    "elevation": "",
                    "name": v_name,
                })

        return {
            "name": title,
            "date": dt,
            "location": location,
            "event_link": url.replace(_BASE, ""),
            "variants": variants,
            "website": None,
            "registration": "",
        }

    async def _scrape_event_detail(
        self,
        ev_info: dict,
        *,
        prefetched_html: str | None = None,
    ) -> ScrapedEventData | None:
        """Visit an event detail page and extract full data.

        If the event has multiple variants, each variant page is fetched
        to gather per-race distance / elevation / start-time data.
        """
        name: str = ev_info["name"]
        dt: datetime | None = ev_info.get("date")
        location: str = ev_info.get("location", "")
        cal_variants: list[dict] = ev_info.get("variants", [])
        event_link: str = ev_info.get("event_link", "")
        website: str | None = ev_info.get("website")

        # Fetch first variant page for event-level info
        first_link = event_link
        if cal_variants:
            first_link = cal_variants[0].get("link") or event_link

        first_url = urljoin(_BASE, first_link)

        if prefetched_html and first_url.endswith(
            event_link.split("/")[-1]
        ):
            detail_html = prefetched_html
        else:
            try:
                detail_html = await self.fetch_page(first_url)
            except Exception:
                logger.warning("Could not fetch ITRA detail: %s", first_url)
                detail_html = ""

        # ── Event-level fields from the detail page ──
        image_url: str | None = None
        external_url: str | None = website
        description: str | None = None
        city: str | None = location or None

        if detail_html:
            # Image
            img_m = re.search(
                r'src="(/Files/Events/[^"]*)"', detail_html
            )
            if img_m:
                image_url = urljoin(_BASE, img_m.group(1))

            # Location from detail (more accurate)
            loc_m = re.search(
                r"&nbsp;([^,<]+),\s*Portugal", detail_html
            )
            if loc_m:
                city = _clean_html_text(loc_m.group(1))

            # Registration / external URL
            reg_m = re.search(
                r'Register to this race</a>',
                detail_html,
            )
            if reg_m:
                href_m = re.search(
                    r'href="(https?://[^"]*)"[^>]*>\s*Register to this race',
                    detail_html,
                )
                if href_m:
                    external_url = href_m.group(1)

            # Course description
            course_m = re.search(
                r"Course details(.*?)(?:RACE RESULTS|<footer)",
                detail_html,
                re.DOTALL,
            )
            if course_m:
                desc_text = re.sub(r"<[^>]+>", " ", course_m.group(1))
                desc_text = _clean_html_text(desc_text)
                # Only keep if there's meaningful content
                if len(desc_text) > 30:
                    description = desc_text[:2000]

            # Variant tabs (if calendar didn't list them)
            if not cal_variants:
                btn_group_m = re.findall(
                    r'<a[^>]*href="(/Races/RaceDetails/[^"]*)"[^>]*'
                    r'class="btn btn-outline-dark[^"]*"[^>]*>([^<]+)</a>',
                    detail_html,
                )
                for v_link, v_name in btn_group_m:
                    cal_variants.append({
                        "link": v_link,
                        "distance": "",
                        "elevation": "",
                        "name": _clean_html_text(v_name),
                    })

        # ── Build variants from detail pages ──
        variants: list[ScrapedVariantData] = []
        raw_data_items: list[dict] = []

        pages_to_fetch = cal_variants if cal_variants else [{"link": first_link}]

        for i, v_info in enumerate(pages_to_fetch):
            v_link = v_info.get("link", "")
            v_url = urljoin(_BASE, v_link) if v_link else first_url

            # Reuse prefetched HTML for the first variant
            if i == 0 and detail_html:
                v_html = detail_html
            else:
                try:
                    v_html = await self.fetch_page(v_url)
                except Exception:
                    logger.warning(
                        "Could not fetch ITRA variant: %s", v_url
                    )
                    # Fall back to calendar data
                    v = self._variant_from_calendar(v_info)
                    if v:
                        variants.append(v)
                    continue

            v_data = self._parse_variant_detail(v_html, v_info)
            if v_data:
                variants.append(v_data["variant"])
                raw_data_items.append(v_data["raw"])

                # Update event date from first variant if missing
                if not dt and v_data["raw"].get("race_date"):
                    dt = _parse_race_date(v_data["raw"]["race_date"])

        # Compute source_event_id from the URL slug
        source_id_m = re.search(
            r"/RaceDetails/([^/]+)/(\d{4})", first_link
        )
        source_event_id = (
            f"{source_id_m.group(1)}/{source_id_m.group(2)}"
            if source_id_m
            else first_link
        )

        if not name:
            return None

        return ScrapedEventData(
            title=name,
            source_url=urljoin(_BASE, first_link),
            source_event_id=source_event_id,
            sport_types=["TRAIL"],
            start_date=dt,
            city=city,
            country="Portugal",
            external_url=external_url,
            image_url=image_url,
            description=description,
            variants=variants,
            raw_data=json.dumps(
                {
                    "itra_variants": raw_data_items,
                    "calendar_location": location,
                    "registration": ev_info.get("registration", ""),
                },
                ensure_ascii=False,
                default=str,
            ),
        )

    def _parse_variant_detail(
        self, html: str, cal_info: dict
    ) -> dict | None:
        """Parse a single variant/race detail page.

        Returns ``{"variant": ScrapedVariantData, "raw": dict}``
        or *None* if parsing fails.
        """
        # Variant name from button group (active tab) or calendar
        name = cal_info.get("name", "")
        if not name:
            name_m = re.search(
                r'<h3>\s*([^<]+)\s*</h3>', html
            )
            if name_m:
                name = _clean_html_text(name_m.group(1))

        # Fallback: derive from calendar distance
        if not name:
            dist_text = cal_info.get("distance", "")
            if dist_text:
                name = dist_text

        # Extract labeled fields
        race_date = _extract_field(html, "Race Date")
        start_time = _extract_field(html, "Start Time")
        distance_str = _extract_field(html, "Distance")
        elev_gain_str = _extract_field(html, "Elevation Gain")
        elev_loss_str = _extract_field(html, "Elevation Loss")
        time_limit = _extract_field(html, "Time Limit")
        participation = _extract_field(html, "Participation")
        aid_stations = _extract_field(html, "Number of Aid Stations")
        participants = _extract_field(html, "Number of Participants")

        # Parse numeric values
        distance_km = _parse_distance(distance_str) if distance_str else None
        elev_gain = _parse_elevation(elev_gain_str) if elev_gain_str else None
        elev_loss = _parse_elevation(elev_loss_str) if elev_loss_str else None

        # Fall back to calendar-listed data
        if distance_km is None:
            distance_km = _parse_distance(cal_info.get("distance", ""))
        if elev_gain is None:
            elev_gain = _parse_elevation(cal_info.get("elevation", ""))

        # Start time formatting
        formatted_start: str | None = None
        if start_time and start_time != "00:00:00":
            formatted_start = start_time

        raw = {
            "race_date": race_date,
            "start_time": start_time,
            "distance": distance_str,
            "elevation_gain": elev_gain_str,
            "elevation_loss": elev_loss_str,
            "time_limit": time_limit,
            "participation": participation,
            "aid_stations": aid_stations,
            "participants": participants,
        }

        variant = ScrapedVariantData(
            name=name or "Main Race",
            distance_km=distance_km,
            elevation_gain_m=elev_gain,
            elevation_loss_m=elev_loss,
            start_time=formatted_start,
        )

        return {"variant": variant, "raw": raw}

    @staticmethod
    def _variant_from_calendar(v_info: dict) -> ScrapedVariantData | None:
        """Build a minimal variant from calendar listing data."""
        dist = _parse_distance(v_info.get("distance", ""))
        elev = _parse_elevation(v_info.get("elevation", ""))
        name = v_info.get("name") or v_info.get("distance") or "Race"
        return ScrapedVariantData(
            name=_clean_html_text(name),
            distance_km=dist,
            elevation_gain_m=elev,
        )
