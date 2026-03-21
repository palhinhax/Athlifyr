# Athlifyr Scraping Service

Python-based service for scraping, normalizing and managing race event data from external websites.

## Architecture

```
/scraping
  /app
    /api            → FastAPI routes (REST management API)
    /core           → Config, logging
    /db             → SQLAlchemy engine, session, base
    /models         → DB models (ScrapedEvent, ScrapingRun, etc.)
    /schemas        → Pydantic schemas (request/response)
    /services       → Business logic (orchestrate scraping + persistence)
    /sources
      /base         → Abstract BaseScraper
      /lap2go       → Lap2Go scraper implementation
      /correr_por_prazer → Correr Por Prazer scraper
    /storage        → Document storage abstraction (local, future S3)
    /jobs           → APScheduler periodic jobs
    main.py         → FastAPI app entry point
  /alembic          → DB migrations
  /tests            → Unit tests
  requirements.txt
```

## Quick Start

### 1. Create and activate a Python virtual environment

```bash
cd scraping
python -m venv .venv

# Windows
.venv\Scripts\Activate.ps1

# macOS/Linux
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your PostgreSQL connection string
```

Key environment variables (all prefixed with `SCRAPING_`):

| Variable                                    | Default                                                 | Description              |
| ------------------------------------------- | ------------------------------------------------------- | ------------------------ |
| `SCRAPING_DATABASE_URL`                     | `postgresql+asyncpg://localhost:5432/athlifyr_scraping` | Async DB connection      |
| `SCRAPING_STORAGE_BACKEND`                  | `local`                                                 | `local` or `s3`          |
| `SCRAPING_STORAGE_LOCAL_PATH`               | `./data/documents`                                      | Where PDFs are saved     |
| `SCRAPING_SCHEDULER_ENABLED`                | `true`                                                  | Enable periodic scraping |
| `SCRAPING_SCHEDULER_DEFAULT_INTERVAL_HOURS` | `24`                                                    | Hours between runs       |
| `SCRAPING_DEBUG`                            | `false`                                                 | Verbose logging          |

### 4. Create the database

```bash
createdb athlifyr_scraping
# Or use your existing PostgreSQL setup
```

### 5. Run migrations

```bash
# Generate initial migration
alembic revision --autogenerate -m "initial"

# Apply
alembic upgrade head
```

> **Note**: On first startup the app also auto-creates tables via `Base.metadata.create_all` for dev convenience.

### 6. Start the server

```bash
uvicorn app.main:app --reload --port 8001
```

The API is available at `http://localhost:8001`.

- Swagger docs: `http://localhost:8001/docs`
- Health check: `http://localhost:8001/health`

## API Endpoints

All routes are under `/api/v1`.

### Sources

| Method | Path       | Description              |
| ------ | ---------- | ------------------------ |
| GET    | `/sources` | List registered scrapers |

### Scraping Runs

| Method | Path         | Description                 |
| ------ | ------------ | --------------------------- |
| POST   | `/runs`      | Trigger a full scraping run |
| GET    | `/runs`      | List recent runs            |
| GET    | `/runs/{id}` | Get run details             |

### Scraped Events

| Method | Path           | Description                                     |
| ------ | -------------- | ----------------------------------------------- |
| GET    | `/events`      | List scraped events (filter by source, status)  |
| GET    | `/events/{id}` | Full event details with variants, pricing, docs |
| PATCH  | `/events/{id}` | Edit/review a scraped event                     |

### Single URL Scraping

| Method | Path                                     | Description               |
| ------ | ---------------------------------------- | ------------------------- |
| POST   | `/scrape-url?source_name=lap2go&url=...` | Scrape a single event URL |

### Documents

| Method | Path                         | Description           |
| ------ | ---------------------------- | --------------------- |
| POST   | `/events/{id}/download-docs` | Download pending PDFs |

### Stats

| Method | Path     | Description                     |
| ------ | -------- | ------------------------------- |
| GET    | `/stats` | Total, pending, approved counts |

## Run Tests

```bash
pip install pytest
pytest tests/ -v
```

## Adding a New Scraper

1. Create a new folder under `/app/sources/<source_name>/`
2. Implement a class extending `BaseScraper` from `app.sources.base.scraper`
3. Implement `scrape()` and `scrape_event(url)` methods
4. Register it in `/app/sources/registry.py`

That's it — the API, scheduler and persistence layer work automatically.

## Supported Sources

| Source            | Key                 | URL                         |
| ----------------- | ------------------- | --------------------------- |
| Lap2Go            | `lap2go`            | https://lap2go.com          |
| Correr Por Prazer | `correr_por_prazer` | https://correrporprazer.com |
