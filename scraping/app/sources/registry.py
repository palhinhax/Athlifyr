"""Source registry — central place to discover available scrapers."""

from __future__ import annotations

from app.sources.base.scraper import BaseScraper
from app.sources.acorrer.scraper import ACorrerScraper
from app.sources.apedalar.scraper import APedalerScraper
from app.sources.correr_por_prazer.scraper import CorrerPorPrazerScraper
from app.sources.lap2go.scraper import Lap2GoScraper
from app.sources.stopandgo.scraper import StopAndGoScraper
from app.sources.triatlo.scraper import TriatloScraper
from app.sources.cyclones.scraper import CyclonesScraper
from app.sources.portimer.scraper import PortimerScraper
from app.sources.trilhoperdido.scraper import TrilhoPerdidoScraper
from app.sources.waitastart.scraper import WaitAStartScraper
from app.sources.turresevents.scraper import TurresEventsScraper
from app.sources.werun.scraper import WeRunScraper
from app.sources.runporto.scraper import RunPortoScraper
from app.sources.sinctime.scraper import SincTimeScraper
from app.sources.multicrono.scraper import MultiCronoScraper
from app.sources.sportchip.scraper import SportChipScraper
from app.sources.timerspeed.scraper import TimerSpeedScraper
from app.sources.totalcrono.scraper import TotalCronoScraper
from app.sources.tictactiming.scraper import TicTacTimingScraper

# Register new scrapers here ↓
_SCRAPERS: dict[str, type[BaseScraper]] = {
    "lap2go": Lap2GoScraper,
    "correr_por_prazer": CorrerPorPrazerScraper,
    "stopandgo": StopAndGoScraper,
    "apedalar": APedalerScraper,
    "acorrer": ACorrerScraper,
    "triatlo": TriatloScraper,
    "cyclones": CyclonesScraper,
    "portimer": PortimerScraper,
    "trilhoperdido": TrilhoPerdidoScraper,
    "waitastart": WaitAStartScraper,
    "turresevents": TurresEventsScraper,
    "werun": WeRunScraper,
    "runporto": RunPortoScraper,
    "sinctime": SincTimeScraper,
    "multicrono": MultiCronoScraper,
    "sportchip": SportChipScraper,
    "timerspeed": TimerSpeedScraper,
    "totalcrono": TotalCronoScraper,
    "tictactiming": TicTacTimingScraper,
}


def get_scraper(source_name: str) -> BaseScraper:
    """Instantiate a scraper by source name."""
    cls = _SCRAPERS.get(source_name)
    if cls is None:
        raise ValueError(
            f"Unknown source: {source_name!r}. "
            f"Available: {list(_SCRAPERS.keys())}"
        )
    return cls()


def list_sources() -> list[dict[str, str]]:
    """Return metadata for every registered scraper."""
    result: list[dict[str, str]] = []
    for cls in _SCRAPERS.values():
        result.append(
            {
                "name": cls.source_name,
                "display_name": cls.display_name,
                "base_url": cls.base_url,
                "description": cls.description,
            }
        )
    return result
