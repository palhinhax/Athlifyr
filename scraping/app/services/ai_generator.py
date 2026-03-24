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
Athlifyr covers: running, trail running, marathons, cycling, BTT/MTB, triathlons, duathlons, aquathlons, OCR, CrossFit, Hyrox, swimming, surfing, walking/hiking races.
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
4. sportTypes must be from: RUNNING, TRAIL, HYROX, CROSSFIT, OCR, BTT, CYCLING, SURF, TRIATHLON, DUATHLON, AQUATHLON, SWIMMING, WALKING, OTHER.
   sportTypes is an ARRAY — include ALL applicable types. Analyze ALL variants to determine types:
   - If any variant contains "caminhada", "walk", "marcha", "hiking" → include WALKING
   - If any variant contains "trail" → include TRAIL (do NOT also add RUNNING for trail events)
   - If any variant is a road race: "corrida", "maratona", "meia maratona", "sprint", "10km", "5km" → include RUNNING
   - IMPORTANT: "trail running" or "trail run" is TRAIL only, NOT RUNNING. RUNNING is for road/urban races only.
   - If any variant contains "btt", "mountain bike", "mtb" → include BTT
   - If any variant contains "triathlon", "triatlo" → include TRIATHLON
   - If any variant contains "duathlon", "duatlo" → include DUATHLON (run-bike-run multisport)
   - If any variant contains "aquathlon", "aquatlo" → include AQUATHLON (swim-run multisport)
   - IMPORTANT: Duathlon and Aquathlon are SEPARATE sport types from Triathlon. Do NOT reject them.
   - Example: "Meia Maratona" with a "Caminhada 5km" variant → ["RUNNING", "WALKING"]
   - Example: "Trail Serra da Estrela" with "Trail 30km" and "Trail 15km" → ["TRAIL"] (not RUNNING)
   - Example: "Ultra Trail" with "Ultra 80km" and "Caminhada 10km" → ["TRAIL", "WALKING"]
5. currency must be: EUR, GBP, USD, or CHF (default EUR).
6. All dates must be ISO 8601 strings (e.g. "2026-03-15T09:00:00Z").
7. Descriptions should be RICH, DETAILED and well-formatted markdown — NO image URLs.
   DO NOT include "imageUrl" in the output — it is injected automatically from the bucket.
   You are writing for a sports event platform that PROMOTES events to athletes. The tone must be:
   - ENERGETIC and INVITING — make people want to sign up! This is marketing, not a Wikipedia article.
   - Highlight what makes the event special: the location, the experience, the challenge, the scenery, the atmosphere.
   - Include a short hook/intro sentence that sells the event (1-2 lines).
   - But stay genuine — no over-the-top hype or fake excitement. Confident and warm, like a friend recommending a great race.

   STRUCTURE — the description MUST have ALL of these sections (when info is available):
   a) **Opening hook** — 1-2 lines selling the event with emoji in the heading (e.g. 🚒 VII Trail Bombeiros de Mêda 2026)
   b) **Overview paragraph** — what the event is, who organizes it, what makes it special (edition number, solidarity, circuit integration, etc.)
   c) **Course/terrain paragraph** — where the race goes, terrain type (trails, roads, mountains, beach), start/finish location, self-sufficiency rules if any
   d) **🏔️ Provas (Variants)** section — list ALL variants with distance, start time, cutoff, age restrictions. Format: "Trail Longo – ±24 km · Partida 09:00 · Cutoff 4h"
   e) **⏰ Horário (Schedule)** section — if schedule info is available, include day-by-day timeline (secretariado, briefing, partida, almoço, prémios)
   f) **🎽 A inscrição inclui** section — what's included: dorsal, seguro, abastecimentos, troféus, medalhas, brinde, etc.
   g) **🏆 Prémios** section — prizes for top finishers, escalões, etc.
   h) **🏅 Circuito** — if the event is part of a circuit/series, mention it
   i) **Closing line** — short motivational call-to-action with emojis

   FORMATTING RULES:
   - Use markdown: **bold**, ## headings, bullet lists, emojis (🏃 🔥 🏔️ 🗓️ 📍 🏅 💪 🚴 🌊 🎯 🚒 ⏰ 🎽 🏆)
   - DO NOT limit the length — include ALL relevant details from the scraped data and documents.
   - Target 1000-3000 characters per language depending on available info.
   - If the regulation PDF provides schedule times, cutoffs, prizes, kit contents — USE ALL OF IT.
   - Extract and include: start times per variant, cutoff times, schedule (secretariado, briefing, partida), prize details, what the registration includes, self-sufficiency rules.
   - Each language description should be a proper markdown text
   - Every sentence should add value — no filler, no generic statements.

   Example (Portuguese):
   ```
   🚒 VII Trail Bombeiros de Mêda 2026
   A 7ª edição do Trail Bombeiros de Mêda realiza-se a 12 de abril de 2026 em Mêda, distrito da Guarda! Organizado pela Associação Humanitária dos Bombeiros Voluntários de Mêda, este é um evento 100% solidário que integra o Circuito de Trail da Beira Alta 2026 como 3ª etapa.

   Partida e chegada no Quartel dos Bombeiros Voluntários de Mêda. Percursos por trilhos, caminhos rurais, vias de terra batida e ribeiras circundantes às aldeias adjacentes do concelho de Mêda.

   Prova em regime de semi-autossuficiência — não existem copos nos postos de abastecimento. Cada atleta deve trazer o seu recipiente para água.

   🏔️ Provas
   Trail Longo – ±24 km · Partida 09:00 · Cutoff 4h
   Trail Curto – ±17 km · Partida 09:15 · Cutoff 4h
   Mini Trail – ±12 km · Partida 09:20 · A partir dos 11 anos (Circuito Jovem)
   Caminhada – ±12 km · Partida 09:20 · Participação lúdica

   ⏰ Horário
   Sábado, 11 de Abril:
   19:30 – 21:00 — Funcionamento do secretariado (Quartel dos Bombeiros)
   Domingo, 12 de Abril:
   07:30 — Abertura do secretariado
   08:50 — Encerramento do secretariado / Briefing
   09:00 — Partida Trail Longo
   09:15 — Partida Trail Curto
   09:20 — Partida Mini Trail e Caminhada
   12:30 — Início do almoço
   13:00 — Encerramento dos percursos
   13:30 — Entrega de prémios

   🎽 A inscrição inclui
   Seguro desportivo, dorsal, abastecimentos sólidos e líquidos, troféus e medalhas aos classificados, brinde finisher, brinde alusivo ao evento.

   🏆 Prémios
   Troféu aos 3 primeiros classificados geral M/F (Trail Longo, Curto e Mini Trail)
   Diploma aos 4ºs e 5ºs classificados geral M/F
   Medalha aos 3 primeiros por escalão M/F (Mini Trail — Circuito Jovem)

   🏅 Circuito de Trail da Beira Alta 2026 — 3ª Etapa

   🚒 Os Bombeiros de Mêda esperam por ti! 🏔️
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
14. If an "admin_notes" field is present in the input, it contains manually added context from the
    platform admin (e.g. extra event details, corrections, instructions). Treat it as high-priority
    supplementary information — use it to fill gaps, override ambiguous data, and enrich the output.

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
    """Download a document (PDF or HTML) and extract its text content.

    For PDFs, first tries direct text extraction (PyPDF2).  If the PDF is
    image-based (scanned) and yields little text, falls back to OCR via
    Tesseract (pdf2image → pytesseract).
    """
    try:
        async with httpx.AsyncClient(
            follow_redirects=True, timeout=60
        ) as client:
            resp = await client.get(url)
            resp.raise_for_status()

        content_type = resp.headers.get("content-type", "")

        # HTML content — extract text with BeautifulSoup
        if "html" in content_type or url.lower().endswith((".html", ".htm")):
            from bs4 import BeautifulSoup

            soup = BeautifulSoup(resp.text, "html.parser")
            for tag in soup(["script", "style", "nav", "footer", "header"]):
                tag.decompose()
            text = soup.get_text(separator="\n", strip=True)
        else:
            # Assume PDF
            text = _extract_pdf_text(resp.content)

        # Limit to ~50000 chars to avoid token overflow
        if len(text) > 50000:
            text = text[:50000] + "\n... [truncated]"
        return text
    except Exception as e:
        logger.warning("Failed to read document from %s: %s", url, e)
        return ""


# ── PDF text extraction helpers ──────────────────────────────────────────────

# Minimum chars from PyPDF2 to consider extraction successful.
# Below this threshold we assume the PDF is image-based and try OCR.
_MIN_TEXT_CHARS = 50


def _extract_pdf_text(content: bytes) -> str:
    """Extract text from PDF bytes, falling back to OCR for image-based PDFs."""
    import tempfile

    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(content)
        tmp_path = tmp.name

    try:
        # 1) Fast path: direct text extraction with PyPDF2
        text = _extract_pdf_text_pypdf2(tmp_path)
        if len(text.strip()) >= _MIN_TEXT_CHARS:
            return text

        # 2) Slow path: OCR via Tesseract
        logger.info("PDF has little extractable text (%d chars) — trying OCR", len(text.strip()))
        ocr_text = _extract_pdf_text_ocr(tmp_path)
        return ocr_text if ocr_text.strip() else text
    finally:
        Path(tmp_path).unlink(missing_ok=True)


def _extract_pdf_text_pypdf2(pdf_path: str) -> str:
    """Extract text from a PDF using PyPDF2 (works for text-based PDFs)."""
    from PyPDF2 import PdfReader

    reader = PdfReader(pdf_path)
    parts: list[str] = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            parts.append(page_text)
    return "\n".join(parts)


def _extract_pdf_text_ocr(pdf_path: str, max_pages: int = 15) -> str:
    """Extract text from an image-based PDF using Tesseract OCR.

    Converts each page to an image and runs OCR. Limited to *max_pages*
    to keep processing time and memory reasonable.
    """
    try:
        from pdf2image import convert_from_path
        import pytesseract
    except ImportError:
        logger.warning("OCR dependencies (pdf2image / pytesseract) not installed — skipping OCR")
        return ""

    try:
        images = convert_from_path(
            pdf_path,
            dpi=200,
            first_page=1,
            last_page=max_pages,
        )
    except Exception as e:
        logger.warning("pdf2image failed to convert PDF: %s", e)
        return ""

    parts: list[str] = []
    for i, img in enumerate(images):
        try:
            page_text = pytesseract.image_to_string(img, lang="por+eng")
            if page_text and page_text.strip():
                parts.append(page_text.strip())
        except Exception as e:
            logger.warning("Tesseract OCR failed on page %d: %s", i + 1, e)
    return "\n\n".join(parts)


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
        max_tokens=16384,
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
