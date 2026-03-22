"""AI-powered event generation using OpenAI.

Takes a scraped event's raw data and document contents,
sends them to GPT to produce a complete event JSON
ready for the Athlifyr import API.
"""

from __future__ import annotations

import json
import logging
from pathlib import Path

import httpx
from openai import AsyncOpenAI

from app.core.config import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """\
You are an expert sports event data processor for the Athlifyr platform.
Your task is to take raw scraped event data and produce a complete, structured JSON object
that can be imported into the Athlifyr database.

EVENT RELEVANCE CHECK (do this FIRST):
Before processing, determine if this is a SPORTS event relevant to Athlifyr.
Athlifyr covers: running, trail running, marathons, cycling, BTT/MTB, triathlons, OCR, CrossFit, Hyrox, swimming, surfing, walking/hiking races.
REJECT events that are NOT sports, such as:
- Motorcycle/motocross rides or rallies
- Car rallies or motorsport
- Music festivals, food fairs, cultural events
- Religious processions or pilgrimages (unless structured as a walking race with registration)
- Equestrian events, hunting events
- Any event where the primary activity is NOT human-powered sport
If the event contains MIXED activities (e.g. BTT + motorcycles), only accept it if it has at least one legitimate human-powered sport variant.
If the event is NOT relevant, return ONLY this JSON: {"rejected": true, "reason": "Brief explanation in English"}
If the event IS relevant, proceed with the full JSON output below.

CRITICAL RULES:
1. ALL user-facing text MUST be translated into ALL 6 languages: pt (European Portuguese), en, es, fr, de, it.
2. Portuguese MUST be European Portuguese (pt-PT): use "tu", "ecrã", "telemóvel", etc.
3. The slug must be URL-safe (lowercase, hyphens, no accents).
4. sportTypes must be from: RUNNING, TRAIL, HYROX, CROSSFIT, OCR, BTT, CYCLING, SURF, TRIATHLON, SWIMMING, WALKING, OTHER.
   sportTypes is an ARRAY — include ALL applicable types. Analyze ALL variants to determine types:
   - If any variant contains "caminhada", "walk", "marcha", "hiking" → include WALKING
   - If any variant contains "trail" → include TRAIL (do NOT also add RUNNING for trail events)
   - If any variant is a road race: "corrida", "maratona", "meia maratona", "sprint", "10km", "5km" → include RUNNING
   - IMPORTANT: "trail running" or "trail run" is TRAIL only, NOT RUNNING. RUNNING is for road/urban races only.
   - If any variant contains "btt", "mountain bike", "mtb" → include BTT
   - If any variant contains "triathlon", "triatlo" → include TRIATHLON
   - Example: "Meia Maratona" with a "Caminhada 5km" variant → ["RUNNING", "WALKING"]
   - Example: "Trail Serra da Estrela" with "Trail 30km" and "Trail 15km" → ["TRAIL"] (not RUNNING)
   - Example: "Ultra Trail" with "Ultra 80km" and "Caminhada 10km" → ["TRAIL", "WALKING"]
5. currency must be: EUR, GBP, USD, or CHF (default EUR).
6. All dates must be ISO 8601 strings (e.g. "2026-03-15T09:00:00Z").
7. Descriptions should be rich, well-formatted markdown text — NO image URLs.
   DO NOT include "imageUrl" in the output — it is injected automatically from the bucket.
   Use markdown formatting to make descriptions visually appealing but CONCISE (max 600-800 characters per language):
   - Use **bold** for event name and key highlights
   - Use ## headings to separate sections (max 2-3 sections)
   - Use bullet lists for variant details
   - Use emojis sparingly (🏃 🏔️ 🗓️ 📍 🏅)
   - Use --- to separate major sections
   - Each language description should be a proper markdown text
   - Keep it SHORT — do NOT write long paragraphs. Quality over quantity.
   Example:
   ```
   **🏃 Meia Maratona Baía do Seixal 2026**

   ---

   ## Provas

   - **Meia Maratona** — 21,097 km
   - **Prova 10 Km** — 10 km
   - **Caminhada/Corrida** — 5 km

   📍 Seixal, Portugal | 🗓️ 22 de março de 2026
   ```
8. FAQs: generate exactly 5 FAQs covering: schedule, registration, location, equipment, contact. Keep answers SHORT (1-2 sentences max).
9. metaTitle format: "Event Name - Edition | City, Region | Date" (< 60 chars).
10. metaDescription: brief summary with key details (150-160 chars).
11. Pricing phases: The input includes a "raw_pricing_text" field containing the raw text scraped from the pricing section of the event page.
    Parse this text CAREFULLY to extract ALL variant names, ALL phase names, ALL dates, and ALL prices.
    CRITICAL: You MUST create a pricingPhase for EVERY combination of variant × phase found in the data.
    Do NOT skip or merge phases. If there are 3 phases (e.g. "1ª FASE", "2ª FASE", "3ª FASE - SEM KIT"), create ALL 3 for each variant.
    Use the exact phase names from the raw text. Use the exact prices from the raw text.
    Each pricingPhase MUST have: name, startDate, endDate, price, currency.
    For dates, use the deadlines from the raw text (e.g. "04/11/2025 20:00" means endDate is "2025-11-04T20:00:00Z").
    If "raw_pricing_text" is not provided, extract pricing from the document contents.
12. If information is missing or unclear, make reasonable inferences from context.
13. Variant translations: translate the variant name and description to all 6 languages.

MANDATORY FIELDS — you MUST always generate these:
14. **variants**: ALWAYS create at least one variant. If the scraped data has variants, use them ALL.
    If no variants are provided, create one from the event title and any available distance/price info.
    Each variant MUST have: name, translations (6 langs), and pricingPhases (at least one phase if price is known).
15. **latitude / longitude**: ALWAYS provide GPS coordinates for the event location.
    Use the city name to look up approximate coordinates. For example:
    - Porto, Portugal → 41.1579, -8.6291
    - Lisboa, Portugal → 38.7223, -9.1393
    - Pardilhó, Portugal → 40.7667, -8.6333
    You MUST fill these, never return null for both.
16. **googleMapsUrl**: ALWAYS generate a Google Maps URL from the city/location.
    Format: "https://www.google.com/maps?q={latitude},{longitude}" or
    "https://www.google.com/maps/search/{city}+{country}"

OUTPUT FORMAT — return ONLY valid JSON matching this exact schema:
{
  "title": "string",
  "slug": "string",
  "description": "string (pt)",
  "sportTypes": ["TRAIL", "RUNNING"],
  "startDate": "ISO8601",
  "endDate": "ISO8601 | null",
  "registrationDeadline": "ISO8601 | null",
  "city": "string",
  "country": "Portugal",
  "latitude": number | null,
  "longitude": number | null,
  "googleMapsUrl": "string | null",
  "externalUrl": "string | null",
  "translations": {
    "pt": { "title": "", "description": "", "city": "", "metaTitle": "", "metaDescription": "" },
    "en": { ... }, "es": { ... }, "fr": { ... }, "de": { ... }, "it": { ... }
  },
  "variants": [
    {
      "name": "string",
      "distanceKm": number | null,
      "elevationGainM": number | null,
      "elevationLossM": number | null,
      "price": number | null,
      "currency": "EUR",
      "maxParticipants": number | null,
      "startDate": "ISO8601 | null",
      "startTime": "HH:MM | null",
      "description": "string | null",
      "cutoffTimeHours": number | null,
      "translations": {
        "pt": { "name": "", "description": "" },
        "en": { ... }, "es": { ... }, "fr": { ... }, "de": { ... }, "it": { ... }
      },
      "pricingPhases": [
        { "name": "", "startDate": "ISO8601", "endDate": "ISO8601", "price": number, "currency": "EUR", "note": "string | null" }
      ]
    }
  ],
  "faqs": [
    {
      "order": 0,
      "question": "string (pt)",
      "answer": "string (pt)",
      "translations": {
        "pt": { "question": "", "answer": "" },
        "en": { ... }, "es": { ... }, "fr": { ... }, "de": { ... }, "it": { ... }
      }
    }
  ]
}

Return ONLY the JSON object, no markdown fences, no comments.\
"""


def _get_openai_client() -> AsyncOpenAI:
    """Create an OpenAI async client from settings."""
    api_key = settings.openai_api_key
    if not api_key:
        raise ValueError("SCRAPING_OPENAI_API_KEY is not set")
    return AsyncOpenAI(api_key=api_key)


async def _read_document_text(url: str) -> str:
    """Download a document (PDF or HTML) and extract its text content."""
    try:
        async with httpx.AsyncClient(
            follow_redirects=True, timeout=30
        ) as client:
            resp = await client.get(url)
            resp.raise_for_status()

        content_type = resp.headers.get("content-type", "")

        # HTML content — extract text with BeautifulSoup
        if "html" in content_type or url.lower().endswith((".html", ".htm")):
            from bs4 import BeautifulSoup

            soup = BeautifulSoup(resp.text, "html.parser")
            # Remove script/style tags
            for tag in soup(["script", "style", "nav", "footer", "header"]):
                tag.decompose()
            text = soup.get_text(separator="\n", strip=True)
        else:
            # Assume PDF
            import tempfile
            from PyPDF2 import PdfReader

            with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
                tmp.write(resp.content)
                tmp_path = tmp.name

            reader = PdfReader(tmp_path)
            text_parts = []
            for page in reader.pages:
                page_text = page.extract_text()
                if page_text:
                    text_parts.append(page_text)

            Path(tmp_path).unlink(missing_ok=True)
            text = "\n".join(text_parts)

        # Limit to ~50000 chars to avoid token overflow
        if len(text) > 50000:
            text = text[:50000] + "\n... [truncated]"
        return text
    except Exception as e:
        logger.warning("Failed to read document from %s: %s", url, e)
        return ""


async def generate_event_json(
    event_data: dict,
    document_texts: list[dict[str, str]],
) -> dict:
    """Send event data + document contents to OpenAI and get back structured JSON.

    Args:
        event_data: Dictionary with scraped event fields.
        document_texts: List of {"name": "...", "content": "..."} dicts.

    Returns:
        Parsed JSON dict matching the import schema.
    """
    client = _get_openai_client()

    # Build the user prompt
    parts = ["Here is the scraped event data:\n"]
    parts.append(json.dumps(event_data, ensure_ascii=False, indent=2, default=str))

    if document_texts:
        parts.append("\n\nHere are the event document contents:\n")
        for doc in document_texts:
            parts.append(f"\n--- Document: {doc['name']} ---\n{doc['content']}")

    user_content = "\n".join(parts)

    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        temperature=0.3,
        max_tokens=12000,
        response_format={"type": "json_object"},
    )

    content = response.choices[0].message.content
    if not content:
        raise ValueError("OpenAI returned empty response")

    finish_reason = response.choices[0].finish_reason
    if finish_reason == "length":
        logger.error("OpenAI response truncated (hit max_tokens). Response length: %d chars", len(content))
        raise ValueError("AI response was truncated — event too complex. Try with less data.")

    try:
        result = json.loads(content)
    except json.JSONDecodeError as e:
        logger.error("Failed to parse AI response as JSON: %s. First 500 chars: %s", e, content[:500])
        raise ValueError(f"AI returned invalid JSON: {e}") from e

    if result.get("rejected"):
        logger.info("AI rejected event as not sports-relevant: %s", result.get("reason"))

    return result
