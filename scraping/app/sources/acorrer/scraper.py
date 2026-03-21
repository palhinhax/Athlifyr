"""ACorrer scraper — extracts running / trail events from acorrer.pt.

Reuses the APedalar scraper since both sites run on the same platform.
"""

from __future__ import annotations

from app.sources.apedalar.scraper import APedalerScraper


class ACorrerScraper(APedalerScraper):
    source_name = "acorrer"
    display_name = "ACorrer"
    base_url = "https://acorrer.pt"
    description = "Running & trail event calendar — acorrer.pt"

    _EVENTS_URL = "https://acorrer.pt/eventos"
    _ASSET_DOMAIN = r"assets\.acorrer"
    _DEFAULT_SPORT = "RUNNING"
