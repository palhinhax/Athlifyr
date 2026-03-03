/**
 * Athli AI Assistant - System configuration and tools
 *
 * Athli is the Athlifyr AI assistant that helps users with:
 * - Event suggestions based on their preferences
 * - Venue information and recommendations
 * - Training plan creation and management
 * - General sports/fitness conversations
 */

import { prisma } from "@/lib/prisma";
import type { Language } from "@prisma/client";

// ============================================================================
// System Prompt
// ============================================================================

export interface AthliPageContext {
  type: "event" | "venue";
  slug: string;
}

export function getSystemPrompt(
  locale: string,
  userName: string | null,
  pageContext?: AthliPageContext | null
): string {
  const langMap: Record<string, string> = {
    pt: "European Portuguese (pt-PT)",
    en: "English",
    es: "Spanish",
    fr: "French",
    de: "German",
    it: "Italian",
  };

  const language = langMap[locale] || "English";

  // Current date for temporal awareness
  const now = new Date();
  const todayISO = now.toISOString().split("T")[0];
  const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][now.getDay()];

  // Calculate useful reference dates
  const daysUntilSaturday = (6 - now.getDay() + 7) % 7 || 7;
  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + daysUntilSaturday);
  const nextSunday = new Date(nextSaturday);
  nextSunday.setDate(nextSaturday.getDate() + 1);
  const nextSaturdayISO = nextSaturday.toISOString().split("T")[0];
  const nextSundayISO = nextSunday.toISOString().split("T")[0];

  return `You are Athli, the friendly AI assistant for Athlifyr - a sports events and fitness platform.
You MUST always respond in ${language}.
${
  locale === "pt"
    ? `CRITICAL: You MUST use European Portuguese (pt-PT), NEVER Brazilian Portuguese (pt-BR). Rules:
- Use "tu" instead of "você" (e.g. "podes", "queres", "precisas" — NOT "pode", "quer", "precisa")
- Use European vocabulary: "ecrã" not "tela", "telemóvel" not "celular", "autocarro" not "ônibus", "equipa" not "equipe", "contactar" not "contatar"
- Use European expressions: "estás a fazer" not "está fazendo", "vou-te ajudar" not "vou te ajudar"
- Use "Olá" / "Bom dia" not "Oi"
- Verb conjugation with "tu": "tu tens", "tu podes", "tu queres" — NEVER "você tem", "você pode", "você quer"
- ALWAYS check your response before sending: if any word or phrasing sounds Brazilian, fix it to European Portuguese.`
    : ""
}
${userName ? `The user's name is ${userName}. Use it occasionally to be friendly.` : ""}

## Current Date & Time Reference
Today is ${dayOfWeek}, ${todayISO}.
Next weekend: Saturday ${nextSaturdayISO} to Sunday ${nextSundayISO}.
IMPORTANT: When the user asks about "this weekend" or "próximo fim de semana", use fromDate="${nextSaturdayISO}" and toDate="${nextSundayISO}".
When searching for events in a date range, ALWAYS pass both fromDate and toDate in YYYY-MM-DD format.
Do NOT pass country filter unless the user explicitly mentions a specific country — events already have location data.

## Your Personality
- Friendly, energetic, and motivating 🏃‍♂️
- Knowledgeable about sports, fitness, and training
- Concise but helpful - don't write essays
- Use relevant emojis sparingly to make conversations feel alive
- Be encouraging and supportive

## Your Capabilities
You have access to tools to:
1. **Search Events** - Find sporting events on Athlifyr by sport type, location, date, etc.
2. **Get My Events** - Get the user's own events (events they are registered/signed up for, upcoming or past)
3. **Search Venues** - Find gyms, boxes, studios, massage, physio, nutrition on Athlifyr by sport, location, type, etc.
4. **Get Venue Details** - Get detailed information about a specific venue (plans, prices, services, coaches, schedule)
5. **Get Available Sessions** - Get available sessions/classes at a venue that the user can book
6. **Book Session** - Book the user into a specific session/class at a venue
7. **Get Session Details** - Get details of a specific session (coach name, assigned workout, spots available)
8. **Search Giveaways** - Find active giveaways/sorteios on Athlifyr
9. **Get My Bookings** - Get the user's booked classes/sessions at venues (today, this week, upcoming, or past)
10. **Get Event Details** - Get detailed information about a specific event (variants, pricing, registration link)
11. **List Available Exercises** - Get exercises from Athlifyr's database by category
12. **Save Training Plans** - Save a structured multi-week training plan to the user's account (only after they confirm)
13. **Save Workouts** - Save a single workout session to the user's account (only after they confirm)
14. **Get My PRs** - Get the user's personal records (PRs) for strength exercises
15. **Get My Analyses** - Get the user's saved video analyses (motion/pose and lift/bar path) with AI form assessment
16. **Submit Admin Note** - Submit a request for the Athlifyr team to review (e.g., add an event, add a venue, report issues)
17. **Get Platform Info** - Get information about Athlifyr itself (features, pricing, how it works for gyms and athletes)

## About Athlifyr — Platform Sales & Promotion (CRITICAL)
You are not just an assistant — you are also a PROMOTER of Athlifyr. When users ask about Athlifyr's services, pricing, features, how to add a gym, what the platform does, etc., you MUST:
1. ALWAYS call get_platform_info to get accurate, up-to-date information from our knowledge base
2. Be enthusiastic and highlight the value proposition — Athlifyr is FREE for venues and athletes!
3. Present features in an organized, compelling way
4. Proactively suggest relevant features the user may not know about
5. If a venue owner asks about adding their gym → call get_platform_info with category "features_venues" and "pricing"
6. If an athlete asks what they can do → call get_platform_info with category "features_athletes"
7. NEVER say "I don't know" about Athlifyr — ALWAYS use get_platform_info first
8. Be a proud ambassador — Athlifyr is an amazing platform and you should convey that!

### When to use get_platform_info
- "O que é o Athlifyr?" → category: "about"
- "Quanto custa?" / "É gratuito?" → category: "pricing"
- "Posso adicionar o meu ginásio?" / "Como funciona para boxes?" → category: "features_venues"
- "O que posso fazer como atleta?" / "Que funcionalidades têm?" → category: "features_athletes"
- "Como funcionam as marcações?" / "Booking system" → category: "features_venues", search: "marcações"
- Any question about the platform itself → use get_platform_info

## IMPORTANT DISTINCTIONS

### Get My Events vs Get My Bookings
- **Get My Events (get_my_events)**: For sporting EVENTS the user registered for (races, competitions, trail runs, etc.). These are one-off events with a specific date.
- **Get My Bookings (get_my_bookings)**: For CLASSES/SESSIONS the user booked at venues (gym classes, CrossFit sessions, appointments, etc.). These are recurring venue sessions.

When the user asks about "my events", "my races", "my competitions" → use get_my_events.
When the user asks about "my classes", "my bookings", "my sessions", "aulas marcadas", "que aulas tenho" → use get_my_bookings.

### Workout vs Training Plan
- **Workout (treino)**: A SINGLE workout session. One day of training with blocks and exercises. Use save_workout.
- **Training Plan (plano de treino)**: A MULTI-WEEK structured plan containing multiple workouts across several weeks. Use save_training_plan.

When the user asks for "um treino" / "a workout" → create a SINGLE workout (save_workout).
When the user asks for "um plano de treino" / "a training plan" / "plano semanal" / "programa de treino" → create a MULTI-WEEK plan (save_training_plan).

### Search Events — Finding Events with Specific Criteria
- Events can have multiple sportTypes, including WALKING. To find "trails with walking" (trails com caminhada), search with sportTypes: ["TRAIL", "WALKING"] or ["TRAIL"] and mention walking in the search.
- Events have an externalUrl field — this is the registration/ticket purchase link. When users ask "where to buy tickets" or "where to register", provide this URL.
- Variants have distances, prices, elevation — use these to answer specific price/distance questions.
- IMPORTANT: When the user asks for details about a SPECIFIC event (prices, registration, variants, FAQs), you MUST:
  1. First call search_events to find the event and get its ID (use the "search" parameter with the event name)
  2. Then call get_event_details with that ID to get full details including pricing phases, variants, FAQs, and registration links
  3. NEVER hallucinate event details — ALWAYS use the tools to get real data
- When the user mentions an event by name (e.g. "HYROX Lisboa", "Trail Manuelino"), ALWAYS search for it first using search_events with the search parameter, even if you think you know about it.

### Weather / Forecast for Events
- Events may include weather forecast data (temperature, condition, humidity, wind speed) when available.
- When weather data is present in the event response, ALWAYS include it when presenting the event to the user.
- Format weather info clearly: temperature in °C, wind in km/h, humidity in %.
- Translate weather conditions to the user's language (e.g. "clear" → "céu limpo", "rain" → "chuva", "clouds" → "nublado", "snow" → "neve", "drizzle" → "chuviscos", "thunderstorm" → "trovoada", "mist"/"fog" → "nevoeiro").
- If the user asks about weather for an event, use search_events or get_event_details — the weather data is included in the response.
- Be helpful: suggest appropriate clothing or preparation based on the forecast (e.g. "Vai estar frio, não te esqueças de levar roupa quente para antes e depois da prova!").

### Venue Search — Types and Services
Venue types include: CROSSFIT_BOX, CROSSTRAINING_BOX, GYM, PT_STUDIO, **MASSAGE**, **PHYSIO**, **NUTRITION**, OTHER.
When a user asks for "massagista desportivo" / "sports massage" → search venues with type MASSAGE.
When a user asks for "fisioterapeuta" / "physio" → search venues with type PHYSIO.
When a user asks for "nutricionista" / "nutrition" → search venues with type NUTRITION.

### Venue Details and Pricing
When users ask about prices, plans, or what a venue offers → use get_venue_details to get the full info including plans and prices.

### Booking Sessions
When users want to book a session/class:
1. First use get_my_bookings or get_available_sessions to show available sessions
2. Let the user choose which session they want
3. Use book_session to make the booking — ONLY after the user explicitly confirms which session
4. NEVER book without explicit user confirmation

### Session Details
When users ask about "today's workout", "who is the coach", "what's the training" for a specific session → use get_session_details.

### Giveaways
When users ask about "giveaways", "sorteios", "raffles", "promotions" → use search_giveaways.
Explain how giveaways work: users participate by getting a ticket number, winners are drawn transparently using a provably fair algorithm.

### Personal Records (PRs) & Performance History
When users ask about "my PR", "my max", "my best", "quanto levanto", "qual o meu PR de back squat" → use get_my_prs with type=STRENGTH.
When users ask about "corridas guardadas", "tempos de corrida", "running records", "meus tempos", "corridas registadas" → use get_my_prs with type=RUN.
When users ask about "trail records", "tempos de trail" → use get_my_prs with type=TRAIL.
When users ask about "HYROX times", "tempos de HYROX" → use get_my_prs with type=HYROX.
When users ask generically about "meus registos", "my records", "minha performance" → use get_my_prs WITHOUT type to get all types.
- IMPORTANT: "corridas registadas" / "corridas guardadas" means RUN performance records, NOT event registrations. Do NOT confuse with get_my_events.
- For STRENGTH: provide exerciseName for a specific exercise (e.g. "Back Squat")
- For RUN/TRAIL: show distance, time, pace, and event name
- Show the PR weight/time, reps, and date achieved
- Be encouraging — celebrate their achievements! 🏆

### Logging Performance / Recording PRs (CRITICAL)
When the user REPORTS a lift or run they just did → use **log_performance_entry**, NOT create_workout.
This is critical! Examples that should use log_performance_entry:
- "fiz deadlift 100kg 3 reps" → log_performance_entry(type=STRENGTH, exerciseName="Deadlift", weightKg=100, reps=3)
- "acabei de fazer back squat 120kg" → log_performance_entry(type=STRENGTH, exerciseName="Back Squat", weightKg=120, reps=1)
- "bench press 80kg 5 reps" → log_performance_entry(type=STRENGTH, exerciseName="Bench Press", weightKg=80, reps=5)
- "corri 10km em 45 minutos" → log_performance_entry(type=RUN, distanceKm=10, timeSeconds=2700)
- "fiz um trail de 25km com 1200m de desnível em 3h30" → log_performance_entry(type=TRAIL, distanceKm=25, timeSeconds=12600, elevationGainM=1200)
- "consegues gravar isso?" after telling you a lift → log_performance_entry
- NEVER create a workout when the user just wants to record a performance. The create_workout tool is for creating FUTURE workout plans/templates with multiple exercises and blocks.
- When you successfully log a performance, celebrate! Show the weight, reps, and whether it's a new PR 🏆

### Video Analyses (Motion & Lift)
When users ask about "my analyses", "my videos", "análise de movimento", "análise de levantamento", "como está a minha técnica", "form check", "meus vídeos de treino", "my squat form" → use get_my_analyses.
- Use type="motion" for movement/pose analysis (running form, squat form, etc.)
- Use type="lift" for barbell/lift analysis (bar path tracking)
- Omit type to get both motion and lift analyses
- Each analysis may include AI assessment: exercise identification, overall form score (0-100), rep count, strengths, areas for improvement, safety flags, and average joint angles
- Present the data clearly: highlight the overall score, celebrate strengths 💪, flag improvements constructively, and emphasize safety flags ⚠️
- If the user asks "how is my squat?" or "como está o meu agachamento?", search their analyses for squat-related exercises
- You can use this data to give personalized training recommendations based on their form analysis

### Workout History (Training Logs)
When users ask about "my workouts", "quantos treinos fiz", "how many workouts did I do", "treinos esta semana", "treinos este mês", "my training history", "workout logs", "o meu histórico de treinos", "treinos do ano", "fiz treino hoje?", "quando foi o meu último treino" → use get_my_workout_history.
- Use period "week" for "esta semana" / "this week" (current week, Monday to now)
- Use period "last_week" for "última semana" / "last week" / "semana passada" (previous Mon-Sun)
- Use period "month" for "este mês" / "this month" (current month)
- Use period "last_month" for "último mês" / "mês passado" / "last month" (previous month)
- Use period "year" for "este ano" / "this year" (current year)
- Use period "all" to get global stats (counts only, no individual logs)
- Omit period for recent history (last 20 logs)
- IMPORTANT: "última semana" / "semana passada" means LAST WEEK (previous Mon-Sun), NOT the current week. Use period="last_week".
- IMPORTANT: "quantos treinos fiz" / "how many workouts" means workout LOGS (completed trainings), NOT saved workout templates. Do NOT confuse with listing saved workouts.
- The response includes summary stats (total count, total time, average feeling, average RPE) and individual workout logs with exercise details
- Present the data clearly: show total count, highlight consistency 📊, mention feeling trends, celebrate high volumes 💪
- For large time ranges (year/all), the tool returns stats + only the most recent logs to keep data manageable

### Submitting Requests to the Team (Admin Notes)
When a user asks you to ADD a new event, ADD a new venue, or requests something you CANNOT do directly:
- You CANNOT create events or venues yourself. Only the Athlifyr team can do that.
- Use submit_admin_note to save the user's request for the team to review.
- Collect as much information as possible from the user before submitting: name, location, date (for events), sport type, external URL, etc.
- Set the correct type: EVENT for event requests, VENUE for venue requests, OTHER for anything else.
- After submitting, confirm to the user that their request has been saved and the team will review it.
- Be encouraging — let them know the team appreciates their contributions to the platform!
- If the user mentions wanting to see an event or venue that doesn't exist on Athlifyr, proactively offer to submit a request.

## Important Rules
- ONLY suggest events and venues that exist in Athlifyr's database (use the tools)
- For training plans, consider the event date, user's current fitness level, and available time
- Format responses with markdown for readability
- If you don't have information, say so honestly
- Keep responses focused and actionable
- When listing events/venues, format them nicely with key details
- Distances in km, dates in the user's locale format

## EXERCISE RULES (ABSOLUTELY CRITICAL)
- You MUST call list_available_exercises BEFORE proposing any workout or plan. Call it multiple times with different categories if needed (CROSSFIT, GYM, WEIGHTLIFTING, BODYWEIGHT, CARDIO, OTHER).
- EVERY exercise in EVERY block (including WARMUP and COOLDOWN) must be a REAL exercise from the database. No exceptions.
- NEVER describe exercises as free text like "Jogging leve 5 minutos" or "Alongamentos estáticos". Instead, use the exact exercise names from the database: "Jog" with time: 300, or "Alongamento dos Ombros", "Alongamento dos Isquiotibiais", etc.
- NEVER invent, abbreviate, or translate exercise names. Use them EXACTLY as returned by list_available_exercises.
- For warmups, use real exercises from CARDIO (e.g. Jog, Jumping Jacks, Jump Rope) and BODYWEIGHT (e.g. Arm Circles, Hip Circles, Inchworm, Leg Swings, Spiderman Lunge, World's Greatest Stretch).
- For cooldowns, use real stretching exercises from BODYWEIGHT (e.g. Alongamento dos Ombros, Alongamento dos Isquiotibiais, Child's Pose, Pigeon Stretch, Seated Forward Fold, Spinal Twist) and OTHER (e.g. Foam Rolling).
- If you cannot find a suitable exercise in the database, pick the closest alternative that EXISTS. Never use an exercise name that was not returned by list_available_exercises.

## Training Plan Flow (CRITICAL)
When a user asks you to create a training plan, you MUST follow this exact flow:
1. First, gather the necessary information: goal, fitness level, duration, frequency, sport types, etc. Ask questions if anything is missing.
2. BEFORE proposing any plan, call list_available_exercises to get the real exercises from our database. Call it with multiple categories as needed (CROSSFIT, GYM, WEIGHTLIFTING, BODYWEIGHT, CARDIO, OTHER). You MUST ONLY use exercises that exist in our database.
3. Present the complete training plan as formatted text in the conversation. Use the EXACT exercise names from the database for ALL blocks — warmup, main, AND cooldown. Include all details: weekly breakdown, day-by-day workouts with block structure, exercises with sets, reps, distances, times, etc.
4. After presenting the plan, ask the user if they want to save it to their plans. Include the marker [TRAINING_PLAN_PROPOSAL] at the very end of your message (after asking if they want to save), followed by a JSON object on the same line with the plan metadata in this exact format:
[TRAINING_PLAN_PROPOSAL]{"name":"Plan Name","description":"Brief description","duration":2,"difficulty":2,"category":"Hybrid","targetAudience":"Intermediate","goals":["Goal 1","Goal 2"]}
5. Only when the user confirms they want to save it, call the save_training_plan tool with the FULL STRUCTURED DATA. EVERY block (WARMUP, main, COOLDOWN) must have exercises array with real exercise names. Never leave a block with no exercises or with generic descriptions.
6. If the user wants changes, adjust the plan and present it again with a new proposal marker.

NEVER call save_training_plan without the user explicitly confirming they want to save the plan.
NEVER use exercise names that are not in our database. Always call list_available_exercises first.
The [TRAINING_PLAN_PROPOSAL] marker is parsed by the frontend to show a "Save to my plans" button. It will be hidden from the user.

## Single Workout Flow (CRITICAL)
When a user asks you to create a SINGLE WORKOUT (treino), you MUST follow this exact flow:
1. Gather necessary information: type of workout (strength, CrossFit, running, etc.), fitness level, duration, focus areas, etc. Ask questions if needed.
2. BEFORE proposing the workout, call list_available_exercises with the relevant categories. You MUST ONLY use exercises that exist in our database.
3. Present the complete workout as formatted text. EVERY block (warmup, main workout, cooldown) must list REAL exercises from the database with their exact names. Include sets, reps, weights, distances, times. Never describe warmup/cooldown as generic text — always list specific exercises.
4. After presenting the workout, ask the user if they want to save it. Include the marker [WORKOUT_PROPOSAL] at the very end of your message (after asking if they want to save), followed by a JSON object on the same line with the workout metadata in this exact format:
[WORKOUT_PROPOSAL]{"name":"Workout Name","description":"Brief description","estimatedTime":45,"difficulty":3,"tags":["crossfit","strength"]}
5. Only when the user confirms they want to save it, call the save_workout tool with the FULL STRUCTURED DATA. EVERY block must have an exercises array with real exercise names from the database.
6. If the user wants changes, adjust the workout and present it again with a new proposal marker.

NEVER call save_workout without the user explicitly confirming they want to save the workout.
The [WORKOUT_PROPOSAL] marker is parsed by the frontend to show a "Save to my workouts" button. It will be hidden from the user.

## Contacting the Support Team (CRITICAL)
When a user wants to talk to a real person, contact the support team, leave a message, get human help, report a problem they can't solve via chat, or asks "how can I contact you?" / "quero falar com alguém" / "preciso de ajuda humana" / "contactar suporte":
- Inform them they can reach the Athlifyr support team through the following channels:
  1. **WhatsApp**: Send a message to **+351 968 134 241** (fastest way to get help)
  2. **Phone call**: Call **+351 968 134 241**
  3. **Email**: hello@athlifyr.com
  4. **Leave a message via Athli**: They can also use the submit_admin_note tool — just describe their issue and the team will review it
- Be warm and reassuring — let them know the team is happy to help!
- If the user describes an issue, offer to submit it via submit_admin_note first, and mention they can also reach out directly via WhatsApp/phone for faster response.${
    pageContext
      ? `

## Current Page Context (IMPORTANT)
The user is currently viewing a${pageContext.type === "event" ? "n EVENT" : " VENUE"} page with slug: "${pageContext.slug}".
When the user says "this event", "this venue", "este evento", "este ginásio", "esta prova", "quanto custa?", "where is it?", "quais as distâncias?", or refers to something on the current page without specifying a name:
- For EVENT pages: Immediately call search_events with search="${pageContext.slug}" to find the event (use the slug with hyphens as-is — the search matches against the slug field). Then use get_event_details with the returned event ID for full info. Do NOT ask the user what event they mean — you already know from the page context.
- For VENUE pages: Immediately call search_venues with search="${pageContext.slug}" to find the venue (use the slug with hyphens as-is). Then use get_venue_details with the returned venue ID for full info. Do NOT ask the user what venue they mean — you already know from the page context.
- ALWAYS use the tools to get real data — never guess or hallucinate details based on the slug alone.
- If search by slug returns no results, try again with the name: search="${pageContext.slug.replace(/-/g, " ")}".`
      : ""
  }`;
}

// ============================================================================
// Platform Knowledge Base
// ============================================================================

export interface PlatformInfoParams {
  category?: string;
  search?: string;
}

export async function getPlatformInfo(
  params: PlatformInfoParams,
  locale: string
): Promise<string> {
  const lang = (locale || "pt") as Language;

  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (params.category) {
    where.category = params.category;
  }

  // Try to find content in the user's language first, fallback to Portuguese
  const articles = await prisma.platformKnowledge.findMany({
    where: {
      ...where,
      language: lang,
    },
    orderBy: [{ priority: "desc" }, { category: "asc" }],
  });

  // If no results in user's language, fall back to Portuguese
  const results =
    articles.length > 0
      ? articles
      : await prisma.platformKnowledge.findMany({
          where: {
            ...where,
            language: "pt",
          },
          orderBy: [{ priority: "desc" }, { category: "asc" }],
        });

  if (results.length === 0) {
    return "No platform information found for this query.";
  }

  // If search term provided, filter by content/title match
  let filtered = results;
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    filtered = results.filter(
      (r) =>
        r.title.toLowerCase().includes(searchLower) ||
        r.content.toLowerCase().includes(searchLower) ||
        r.category.toLowerCase().includes(searchLower)
    );
    if (filtered.length === 0) {
      // If no search match, return all results for the category
      filtered = results;
    }
  }

  return filtered
    .map((article) => `## ${article.title}\n\n${article.content}`)
    .join("\n\n---\n\n");
}

// ============================================================================
// Data Fetching Functions (used as tool implementations)
// ============================================================================

export interface EventSearchParams {
  sportTypes?: string[];
  city?: string;
  country?: string;
  fromDate?: string;
  toDate?: string;
  search?: string;
  limit?: number;
}

export async function searchEvents(
  params: EventSearchParams,
  locale: string
): Promise<string> {
  const lang = (locale || "pt") as Language;
  const where: Record<string, unknown> = {
    startDate: { gte: new Date() },
    cancelled: false,
  };

  if (params.sportTypes && params.sportTypes.length > 0) {
    where.sportTypes = { hasSome: params.sportTypes };
  }

  if (params.country) {
    where.country = { contains: params.country, mode: "insensitive" };
  }

  if (params.fromDate) {
    where.startDate = {
      ...((where.startDate as Record<string, unknown>) || {}),
      gte: new Date(params.fromDate),
    };
  }

  if (params.toDate) {
    // Include the entire end date day (set to end of day 23:59:59)
    const endDate = new Date(params.toDate);
    endDate.setUTCHours(23, 59, 59, 999);
    where.startDate = {
      ...((where.startDate as Record<string, unknown>) || {}),
      lte: endDate,
    };
  }

  // Build OR conditions — combine city and search into a single AND-compatible structure
  // to avoid one overwriting the other
  const orConditions: Record<string, unknown>[] = [];

  if (params.city) {
    orConditions.push(
      { city: { contains: params.city, mode: "insensitive" } },
      {
        translations: {
          some: {
            language: lang,
            city: { contains: params.city, mode: "insensitive" },
          },
        },
      }
    );
  }

  if (params.search) {
    orConditions.push(
      { title: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
      {
        translations: {
          some: {
            language: lang,
            title: { contains: params.search, mode: "insensitive" },
          },
        },
      }
    );
  }

  // If both city and search are provided, we need AND logic:
  // event must match city AND match search text
  if (params.city && params.search) {
    const cityConditions = [
      { city: { contains: params.city, mode: "insensitive" } },
      {
        translations: {
          some: {
            language: lang,
            city: { contains: params.city, mode: "insensitive" },
          },
        },
      },
    ];
    const searchConditions = [
      { title: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
      {
        translations: {
          some: {
            language: lang,
            title: { contains: params.search, mode: "insensitive" },
          },
        },
      },
    ];
    where.AND = [{ OR: cityConditions }, { OR: searchConditions }];
  } else if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      translations: {
        where: { language: lang },
      },
      variants: {
        select: {
          name: true,
          distanceKm: true,
          price: true,
          elevationGainM: true,
        },
      },
      weather: {
        orderBy: { date: "asc" },
        select: {
          date: true,
          temperature: true,
          condition: true,
          humidity: true,
          windSpeed: true,
        },
      },
    },
    orderBy: { startDate: "asc" },
    take: params.limit || 10,
  });

  if (events.length === 0) {
    return "No events found matching the criteria.";
  }

  return JSON.stringify(
    events.map((e) => {
      const t = e.translations[0];
      return {
        id: e.id,
        title: t?.title || e.title,
        slug: e.slug,
        date: e.startDate.toISOString().split("T")[0],
        city: t?.city || e.city,
        country: e.country,
        sportTypes: e.sportTypes,
        variants: e.variants.map((v) => ({
          name: v.name,
          distanceKm: v.distanceKm,
          price: v.price,
          elevationGainM: v.elevationGainM,
        })),
        weather:
          e.weather.length > 0
            ? e.weather.map((w) => ({
                date: w.date.toISOString().split("T")[0],
                temperature: w.temperature,
                condition: w.condition,
                humidity: w.humidity,
                windSpeed: w.windSpeed,
              }))
            : undefined,
        url: `/${locale}/events/${e.slug}`,
      };
    })
  );
}

export interface VenueSearchParams {
  sportTypes?: string[];
  city?: string;
  search?: string;
  venueType?: string;
  limit?: number;
}

export async function searchVenues(
  params: VenueSearchParams,
  locale: string
): Promise<string> {
  const lang = (locale || "pt") as Language;
  const where: Record<string, unknown> = {
    isActive: true,
  };

  if (params.sportTypes && params.sportTypes.length > 0) {
    where.sportTypes = { hasSome: params.sportTypes };
  }

  if (params.city) {
    where.city = { contains: params.city, mode: "insensitive" };
  }

  if (params.search) {
    where.OR = [
      { name: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.venueType) {
    where.type = params.venueType;
  }

  const venues = await prisma.venue.findMany({
    where,
    include: {
      translations: {
        where: { language: lang },
      },
      _count: {
        select: { reviews: true },
      },
    },
    take: params.limit || 10,
  });

  if (venues.length === 0) {
    return "No venues found matching the criteria.";
  }

  return JSON.stringify(
    venues.map((v) => {
      const t = v.translations[0];

      return {
        id: v.id,
        name: v.name,
        slug: v.slug,
        type: v.type,
        sportTypes: v.sportTypes,
        city: v.city,
        country: v.country,
        description:
          t?.description?.substring(0, 200) || v.description?.substring(0, 200),
        reviewCount: v._count.reviews,
        url: `/${locale}/v/${v.slug}`,
      };
    })
  );
}

export async function getEventDetails(
  eventId: string,
  locale: string
): Promise<string> {
  const lang = (locale || "pt") as Language;

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      translations: {
        where: { language: lang },
      },
      variants: {
        include: {
          translations: {
            where: { language: lang },
          },
        },
      },
      pricingPhases: true,
      weather: {
        orderBy: { date: "asc" },
      },
      faqs: {
        include: {
          translations: {
            where: { language: lang },
          },
        },
      },
    },
  });

  if (!event) {
    return "Event not found.";
  }

  const t = event.translations[0];

  return JSON.stringify({
    id: event.id,
    title: t?.title || event.title,
    slug: event.slug,
    description: (t?.description || event.description).substring(0, 500),
    date: event.startDate.toISOString().split("T")[0],
    endDate: event.endDate?.toISOString().split("T")[0],
    city: t?.city || event.city,
    country: event.country,
    sportTypes: event.sportTypes,
    registrationDeadline: event.registrationDeadline
      ?.toISOString()
      .split("T")[0],
    externalUrl: event.externalUrl,
    variants: event.variants.map((v) => {
      const vt = v.translations[0];
      return {
        name: vt?.name || v.name,
        distanceKm: v.distanceKm,
        price: v.price,
        elevationGainM: v.elevationGainM,
        elevationLossM: v.elevationLossM,
        itraPoints: v.itraPoints,
        atrpGrade: v.atrpGrade,
        cutoffTimeHours: v.cutoffTimeHours,
      };
    }),
    pricingPhases: event.pricingPhases.map((p) => ({
      name: p.name,
      price: p.price,
      startDate: p.startDate.toISOString().split("T")[0],
      endDate: p.endDate.toISOString().split("T")[0],
    })),
    weather:
      event.weather.length > 0
        ? event.weather.map((w) => ({
            date: w.date.toISOString().split("T")[0],
            temperature: w.temperature,
            condition: w.condition,
            humidity: w.humidity,
            windSpeed: w.windSpeed,
          }))
        : undefined,
    url: `/${locale}/events/${event.slug}`,
  });
}

// ============================================================================
// User Analyses (Motion & Lift)
// ============================================================================

interface MotionAnalysisJsonSummary {
  sampleFps?: number;
  metrics?: { kneeFlexionDeg?: number; torsoRangeDeg?: number };
  pose?: {
    framesProcessed: number;
    framesWithPose: number;
    detectionRate: number;
    durationSec: number;
    averageAngles: Record<string, number | null> | null;
  };
  aiAnalysis?: {
    exercise: string | null;
    exerciseEn: string | null;
    confidence: number | null;
    totalReps: number | null;
    durationSec: number | null;
    tempoAvgSec: number | null;
    overallScore: number | null;
    overallNotes: string | null;
    strengths: string[];
    improvements: string[];
    safetyFlags: string[];
  } | null;
}

interface LiftAnalysisJsonSummary {
  durationMs?: number;
  metrics?: {
    maxHorizontalDrift?: number;
    totalVerticalTravel?: number;
    averageSpeed?: number;
  };
  pose?: {
    framesProcessed: number;
    framesWithPose: number;
    detectionRate: number;
    durationSec: number;
    averageAngles: Record<string, number | null> | null;
  };
  aiAnalysis?: {
    exercise: string | null;
    exerciseEn: string | null;
    confidence: number | null;
    totalReps: number | null;
    durationSec: number | null;
    tempoAvgSec: number | null;
    overallScore: number | null;
    overallNotes: string | null;
    strengths: string[];
    improvements: string[];
    safetyFlags: string[];
  } | null;
}

export interface UserAnalysesParams {
  type?: "motion" | "lift";
  limit?: number;
}

export async function getUserAnalyses(
  userId: string,
  params: UserAnalysesParams
): Promise<string> {
  const limit = params.limit || 10;
  const type = params.type;

  const results: {
    type: string;
    id: string;
    label: string | null;
    date: string;
    exercise: string | null;
    overallScore: number | null;
    totalReps: number | null;
    durationSec: number | null;
    strengths: string[];
    improvements: string[];
    safetyFlags: string[];
    overallNotes: string | null;
    averageAngles: Record<string, number | null> | null;
    liftMetrics?: {
      maxHorizontalDrift: number | null;
      totalVerticalTravel: number | null;
      averageSpeed: number | null;
    };
  }[] = [];

  // Fetch motion analyses
  if (!type || type === "motion") {
    const motionRecords = await prisma.motionAnalysisRecord.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        label: true,
        createdAt: true,
        analysisJson: true,
      },
    });

    for (const record of motionRecords) {
      const json = record.analysisJson as unknown as MotionAnalysisJsonSummary;
      const ai = json.aiAnalysis;
      results.push({
        type: "motion",
        id: record.id,
        label: record.label,
        date: record.createdAt.toISOString().split("T")[0],
        exercise: ai?.exercise || ai?.exerciseEn || null,
        overallScore: ai?.overallScore ?? null,
        totalReps: ai?.totalReps ?? null,
        durationSec: ai?.durationSec ?? json.pose?.durationSec ?? null,
        strengths: ai?.strengths ?? [],
        improvements: ai?.improvements ?? [],
        safetyFlags: ai?.safetyFlags ?? [],
        overallNotes: ai?.overallNotes ?? null,
        averageAngles:
          (json.pose?.averageAngles ?? json.metrics)
            ? {
                kneeFlexion: json.metrics?.kneeFlexionDeg ?? null,
                torsoRange: json.metrics?.torsoRangeDeg ?? null,
              }
            : null,
      });
    }
  }

  // Fetch lift analyses
  if (!type || type === "lift") {
    const liftRecords = await prisma.liftAnalysisRecord.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      select: {
        id: true,
        label: true,
        createdAt: true,
        analysisJson: true,
      },
    });

    for (const record of liftRecords) {
      const json = record.analysisJson as unknown as LiftAnalysisJsonSummary;
      const ai = json.aiAnalysis;
      results.push({
        type: "lift",
        id: record.id,
        label: record.label,
        date: record.createdAt.toISOString().split("T")[0],
        exercise: ai?.exercise || ai?.exerciseEn || null,
        overallScore: ai?.overallScore ?? null,
        totalReps: ai?.totalReps ?? null,
        durationSec:
          ai?.durationSec ?? (json.durationMs ? json.durationMs / 1000 : null),
        strengths: ai?.strengths ?? [],
        improvements: ai?.improvements ?? [],
        safetyFlags: ai?.safetyFlags ?? [],
        overallNotes: ai?.overallNotes ?? null,
        averageAngles: json.pose?.averageAngles ?? null,
        liftMetrics: json.metrics
          ? {
              maxHorizontalDrift: json.metrics.maxHorizontalDrift ?? null,
              totalVerticalTravel: json.metrics.totalVerticalTravel ?? null,
              averageSpeed: json.metrics.averageSpeed ?? null,
            }
          : undefined,
      });
    }
  }

  // Sort all results by date descending
  results.sort((a, b) => b.date.localeCompare(a.date));

  if (results.length === 0) {
    return "No analyses found. The user hasn't saved any video analyses yet.";
  }

  return JSON.stringify({
    total: results.length,
    analyses: results.slice(0, limit),
  });
}

// ============================================================================
// Workout History (Training Logs)
// ============================================================================

export interface WorkoutHistoryParams {
  period?: "week" | "last_week" | "month" | "last_month" | "year" | "all";
  limit?: number;
}

const FEELING_LABELS: Record<number, string> = {
  1: "😫 Terrible",
  2: "😕 Bad",
  3: "😐 OK",
  4: "😊 Good",
  5: "🤩 Excellent",
};

export async function getUserWorkoutHistory(
  userId: string,
  params: WorkoutHistoryParams
): Promise<string> {
  const period = params.period;
  const limit = params.limit || 20;

  // Calculate date range based on period
  const now = new Date();
  let fromDate: Date | undefined;
  let toDate: Date | undefined;

  switch (period) {
    case "week": {
      // Start of current week (Monday)
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      fromDate = new Date(now);
      fromDate.setDate(now.getDate() - diffToMonday);
      fromDate.setHours(0, 0, 0, 0);
      break;
    }
    case "last_week": {
      // Previous week: Monday to Sunday
      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      // This Monday
      const thisMonday = new Date(now);
      thisMonday.setDate(now.getDate() - diffToMonday);
      thisMonday.setHours(0, 0, 0, 0);
      // Last Monday
      fromDate = new Date(thisMonday);
      fromDate.setDate(thisMonday.getDate() - 7);
      // End of last week (this Monday 00:00 exclusive)
      toDate = thisMonday;
      break;
    }
    case "month": {
      fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "last_month": {
      fromDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      toDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    }
    case "year": {
      fromDate = new Date(now.getFullYear(), 0, 1);
      break;
    }
    case "all": {
      // No date filter — return stats only
      fromDate = undefined;
      break;
    }
    default: {
      // No period specified — return recent logs
      fromDate = undefined;
      break;
    }
  }

  const dateFilter: Record<string, unknown> = {};
  if (fromDate || toDate) {
    const performedAt: Record<string, Date> = {};
    if (fromDate) performedAt.gte = fromDate;
    if (toDate) performedAt.lt = toDate;
    dateFilter.performedAt = performedAt;
  }

  // Get total count for the period (always)
  const totalCount = await prisma.workoutLog.count({
    where: {
      userId,
      ...dateFilter,
    },
  });

  // For "all" or "year", we only want stats + a few recent logs (not all data)
  const effectiveLimit =
    period === "all" || period === "year" ? Math.min(limit, 10) : limit;

  // Fetch workout logs with details
  const logs = await prisma.workoutLog.findMany({
    where: {
      userId,
      ...dateFilter,
    },
    orderBy: { performedAt: "desc" },
    take: effectiveLimit,
    include: {
      workout: {
        select: {
          id: true,
          name: true,
          estimatedTime: true,
          difficulty: true,
          tags: true,
        },
      },
      session: {
        select: {
          id: true,
          title: true,
        },
      },
      blockResults: {
        include: {
          block: {
            select: {
              id: true,
              type: true,
              name: true,
            },
          },
          exerciseResults: {
            select: {
              exercise: {
                select: {
                  name: true,
                  category: true,
                },
              },
              actualReps: true,
              actualWeight: true,
              actualWeightUnit: true,
              actualDistance: true,
              actualDistanceUnit: true,
              actualTime: true,
              actualCalories: true,
              isPR: true,
              sets: {
                select: {
                  reps: true,
                  weight: true,
                  weightUnit: true,
                  isPR: true,
                },
                orderBy: { setNumber: "asc" as const },
              },
            },
          },
        },
      },
    },
  });

  if (totalCount === 0) {
    const periodLabel =
      period === "week"
        ? "this week"
        : period === "last_week"
          ? "last week"
          : period === "month"
            ? "this month"
            : period === "last_month"
              ? "last month"
              : period === "year"
                ? "this year"
                : "";
    return `No workout logs found${periodLabel ? ` for ${periodLabel}` : ""}. The user hasn't logged any workouts${periodLabel ? ` ${periodLabel}` : " yet"}.`;
  }

  // Calculate stats
  const feelings = logs
    .filter((l) => l.feeling !== null)
    .map((l) => l.feeling as number);
  const efforts = logs
    .filter((l) => l.perceivedEffort !== null)
    .map((l) => l.perceivedEffort as number);
  const avgFeeling =
    feelings.length > 0
      ? Math.round(
          (feelings.reduce((a, b) => a + b, 0) / feelings.length) * 10
        ) / 10
      : null;
  const avgEffort =
    efforts.length > 0
      ? Math.round((efforts.reduce((a, b) => a + b, 0) / efforts.length) * 10) /
        10
      : null;

  // Count PRs in this period
  let prCount = 0;
  for (const log of logs) {
    for (const br of log.blockResults) {
      for (const er of br.exerciseResults) {
        if (er.isPR) prCount++;
        for (const s of er.sets) {
          if (s.isPR) prCount++;
        }
      }
    }
  }

  // Collect unique exercises done
  const exerciseSet = new Set<string>();
  for (const log of logs) {
    for (const br of log.blockResults) {
      for (const er of br.exerciseResults) {
        exerciseSet.add(er.exercise.name);
      }
    }
  }

  // Build log summaries (compact for AI)
  const logSummaries = logs.map((log) => {
    const exercisesList: string[] = [];
    for (const br of log.blockResults) {
      for (const er of br.exerciseResults) {
        let detail = er.exercise.name;
        const parts: string[] = [];
        if (er.sets.length > 0) {
          const setsSummary = er.sets
            .map((s) => `${s.reps}×${s.weight}${s.weightUnit || "KG"}`)
            .join(", ");
          parts.push(setsSummary);
        } else {
          if (er.actualReps) parts.push(`${er.actualReps} reps`);
          if (er.actualWeight)
            parts.push(`${er.actualWeight}${er.actualWeightUnit || "KG"}`);
          if (er.actualDistance)
            parts.push(`${er.actualDistance}${er.actualDistanceUnit || "KM"}`);
          if (er.actualTime) {
            const mins = Math.floor(er.actualTime / 60);
            const secs = er.actualTime % 60;
            parts.push(
              mins > 0 ? `${mins}m${secs > 0 ? `${secs}s` : ""}` : `${secs}s`
            );
          }
          if (er.actualCalories) parts.push(`${er.actualCalories} cal`);
        }
        if (er.isPR) parts.push("🏆 PR!");
        if (parts.length > 0) detail += ` (${parts.join(", ")})`;
        exercisesList.push(detail);
      }
    }

    return {
      date: log.performedAt.toISOString().split("T")[0],
      workoutName: log.workout.name,
      session: log.session?.title || null,
      feeling: log.feeling
        ? FEELING_LABELS[log.feeling] || `${log.feeling}/5`
        : null,
      perceivedEffort: log.perceivedEffort
        ? `RPE ${log.perceivedEffort}/10`
        : null,
      notes: log.notes || null,
      exercises: exercisesList,
    };
  });

  const periodLabel =
    period === "week"
      ? "this week"
      : period === "last_week"
        ? "last week"
        : period === "month"
          ? "this month"
          : period === "last_month"
            ? "last month"
            : period === "year"
              ? "this year"
              : period === "all"
                ? "all time"
                : "recent";

  return JSON.stringify({
    period: periodLabel,
    stats: {
      totalWorkouts: totalCount,
      logsShown: logSummaries.length,
      avgFeeling,
      avgEffort,
      prsAchieved: prCount,
      uniqueExercises: exerciseSet.size,
    },
    logs: logSummaries,
  });
}

// ============================================================================
// Training Plan - Structured Save
// ============================================================================

interface PlanExerciseInput {
  name: string;
  reps?: number;
  weight?: number;
  weightUnit?: string;
  distance?: number;
  distanceUnit?: string;
  time?: number; // seconds
  calories?: number;
  sets?: number;
  notes?: string;
}

interface PlanBlockInput {
  type: string; // WARMUP, STRENGTH, AMRAP, EMOM, FOR_TIME, TABATA, CHIPPER, COOLDOWN, SKILL, REST
  name?: string;
  rounds?: number;
  timeCap?: number; // seconds
  workTime?: number; // seconds (for EMOM)
  notes?: string;
  exercises: PlanExerciseInput[];
}

interface PlanWorkoutInput {
  name: string;
  description?: string;
  dayOfWeek: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  estimatedTime?: number; // minutes
  blocks: PlanBlockInput[];
}

interface PlanWeekInput {
  weekNumber: number;
  name?: string;
  description?: string;
  workouts: PlanWorkoutInput[];
}

export interface SaveTrainingPlanParams {
  name: string;
  description: string;
  duration: number;
  difficulty: number;
  category: string;
  targetAudience: string;
  goals: string[];
  weeks: PlanWeekInput[];
}

/**
 * List available exercises from the database, optionally filtered by category.
 */
export async function listAvailableExercises(
  category?: string
): Promise<string> {
  const where: Record<string, unknown> = {};
  if (category) {
    where.category = category.toUpperCase();
  }

  const exercises = await prisma.exercise.findMany({
    where,
    select: {
      id: true,
      name: true,
      category: true,
    },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return JSON.stringify({
    total: exercises.length,
    exercises: exercises.map((e) => ({
      id: e.id,
      name: e.name,
      category: e.category,
    })),
  });
}

/**
 * Get the user's events (events they are participating in).
 * Can filter by upcoming only or include past events.
 */
export async function getUserEvents(
  userId: string,
  locale: string,
  upcoming?: boolean
): Promise<string> {
  const lang = (locale || "pt") as Language;

  const where: Record<string, unknown> = {
    userId,
  };

  const participations = await prisma.participation.findMany({
    where,
    include: {
      event: {
        include: {
          translations: {
            where: { language: lang },
          },
          variants: {
            select: {
              id: true,
              name: true,
              distanceKm: true,
              elevationGainM: true,
            },
          },
        },
      },
      variant: {
        select: {
          id: true,
          name: true,
          distanceKm: true,
          elevationGainM: true,
        },
      },
    },
    orderBy: {
      event: { startDate: "asc" },
    },
  });

  // Filter by upcoming/past after fetching (to include event data)
  const now = new Date();
  const filtered =
    upcoming !== undefined
      ? participations.filter((p) =>
          upcoming ? p.event.startDate >= now : p.event.startDate < now
        )
      : participations;

  if (filtered.length === 0) {
    return upcoming ? "You have no upcoming events." : "No events found.";
  }

  return JSON.stringify(
    filtered.map((p) => {
      const e = p.event;
      const t = e.translations[0];
      return {
        participationId: p.id,
        status: p.status,
        eventId: e.id,
        title: t?.title || e.title,
        slug: e.slug,
        date: e.startDate.toISOString().split("T")[0],
        city: t?.city || e.city,
        country: e.country,
        sportTypes: e.sportTypes,
        cancelled: e.cancelled,
        registeredVariant: p.variant
          ? {
              name: p.variant.name,
              distanceKm: p.variant.distanceKm,
              elevationGainM: p.variant.elevationGainM,
            }
          : null,
        allVariants: e.variants.map((v) => ({
          name: v.name,
          distanceKm: v.distanceKm,
          elevationGainM: v.elevationGainM,
        })),
        completionTime: p.completionTime,
        url: `/${locale}/events/${e.slug}`,
      };
    })
  );
}

// ============================================================================
// User Bookings (Venue Sessions/Classes)
// ============================================================================

export interface UserBookingsParams {
  period?: "today" | "week" | "upcoming" | "past";
}

/**
 * Get the user's booked venue sessions/classes.
 * Can filter by period: today, this week, upcoming, or past.
 */
export async function getUserBookings(
  userId: string,
  locale: string,
  period?: "today" | "week" | "upcoming" | "past"
): Promise<string> {
  const now = new Date();

  // Build date filters based on period
  const sessionWhere: Record<string, unknown> = {};

  if (period === "today") {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);
    sessionWhere.startsAt = { gte: startOfDay, lte: endOfDay };
  } else if (period === "week") {
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(now);
    endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()));
    endOfWeek.setHours(23, 59, 59, 999);
    sessionWhere.startsAt = { gte: startOfDay, lte: endOfWeek };
  } else if (period === "past") {
    sessionWhere.startsAt = { lt: now };
  } else {
    // "upcoming" or default: from now onwards
    sessionWhere.startsAt = { gte: now };
  }

  const bookings = await prisma.venueBooking.findMany({
    where: {
      userId,
      status: { in: ["BOOKED", "ATTENDED"] },
      session: sessionWhere,
    },
    include: {
      session: {
        select: {
          id: true,
          title: true,
          type: true,
          description: true,
          startsAt: true,
          endsAt: true,
          capacity: true,
          tags: true,
        },
      },
      venue: {
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          sportTypes: true,
        },
      },
    },
    orderBy: {
      session: { startsAt: period === "past" ? "desc" : "asc" },
    },
    take: 20,
  });

  if (bookings.length === 0) {
    const periodMessages: Record<string, string> = {
      today: "You have no classes booked for today.",
      week: "You have no classes booked for this week.",
      past: "No past bookings found.",
      upcoming: "You have no upcoming classes booked.",
    };
    return periodMessages[period || "upcoming"] || "No bookings found.";
  }

  return JSON.stringify(
    bookings.map((b) => ({
      bookingId: b.id,
      status: b.status,
      bookingType: b.bookingType,
      session: {
        id: b.session.id,
        title: b.session.title,
        type: b.session.type,
        description: b.session.description?.substring(0, 150),
        startsAt: b.session.startsAt.toISOString(),
        endsAt: b.session.endsAt.toISOString(),
        date: b.session.startsAt.toISOString().split("T")[0],
        startTime: b.session.startsAt
          .toISOString()
          .split("T")[1]
          .substring(0, 5),
        endTime: b.session.endsAt.toISOString().split("T")[1].substring(0, 5),
        tags: b.session.tags,
      },
      venue: {
        id: b.venue.id,
        name: b.venue.name,
        slug: b.venue.slug,
        city: b.venue.city,
        sportTypes: b.venue.sportTypes,
        url: `/${locale}/v/${b.venue.slug}`,
      },
    }))
  );
}

// ============================================================================
// User Performance / Personal Records (PRs)
// ============================================================================

export interface UserPRsParams {
  exerciseName?: string;
  category?: string;
  type?: string; // RUN, TRAIL, STRENGTH, HYROX — defaults to all types
}

/**
 * Get the user's personal records and performance entries.
 * Supports STRENGTH (PRs by exercise), RUN/TRAIL (race times/distances), and HYROX.
 * Can filter by specific exercise name, type, or get all records.
 */
export async function getUserPRs(
  userId: string,
  params: UserPRsParams
): Promise<string> {
  const requestedType = params.type?.toUpperCase() as
    | "RUN"
    | "TRAIL"
    | "STRENGTH"
    | "HYROX"
    | undefined;

  // ── RUN / TRAIL entries ──────────────────────────────────────────────
  if (requestedType === "RUN" || requestedType === "TRAIL") {
    const runEntries = await prisma.userPerformanceEntry.findMany({
      where: {
        userId,
        type: requestedType,
      },
      orderBy: { performedAt: "desc" },
      take: 20,
    });

    if (runEntries.length === 0) {
      return JSON.stringify({
        type: requestedType,
        message:
          requestedType === "RUN"
            ? "No running records found. Log your runs to start tracking!"
            : "No trail records found. Log your trail runs to start tracking!",
        entries: [],
      });
    }

    const formatted = runEntries.map((e) => {
      const hours = e.timeSeconds ? Math.floor(e.timeSeconds / 3600) : null;
      const minutes = e.timeSeconds
        ? Math.floor((e.timeSeconds % 3600) / 60)
        : null;
      const seconds = e.timeSeconds ? e.timeSeconds % 60 : null;
      const timeFormatted =
        hours != null && minutes != null && seconds != null
          ? hours > 0
            ? `${hours}h${String(minutes).padStart(2, "0")}m${String(seconds).padStart(2, "0")}s`
            : `${minutes}m${String(seconds).padStart(2, "0")}s`
          : null;

      const pacePerKm =
        e.distanceKm && e.timeSeconds
          ? Math.round(e.timeSeconds / e.distanceKm)
          : null;
      const paceFormatted = pacePerKm
        ? `${Math.floor(pacePerKm / 60)}:${String(pacePerKm % 60).padStart(2, "0")}/km`
        : null;

      return {
        date: e.performedAt.toISOString().split("T")[0],
        distanceKm: e.distanceKm,
        time: timeFormatted,
        timeSeconds: e.timeSeconds,
        pace: paceFormatted,
        elevationGainM: e.elevationGainM,
        eventName: e.eventName,
        location: e.location,
      };
    });

    // Find best times per distance
    const byDistance = new Map<number, (typeof formatted)[0]>();
    for (const entry of formatted) {
      if (!entry.distanceKm || !entry.timeSeconds) continue;
      const dist = entry.distanceKm;
      const existing = byDistance.get(dist);
      if (
        !existing ||
        (existing.timeSeconds &&
          entry.timeSeconds &&
          entry.timeSeconds < existing.timeSeconds)
      ) {
        byDistance.set(dist, entry);
      }
    }

    return JSON.stringify({
      type: requestedType,
      totalEntries: runEntries.length,
      entries: formatted,
      bestTimes: Array.from(byDistance.entries()).map(([dist, entry]) => ({
        distanceKm: dist,
        bestTime: entry.time,
        pace: entry.pace,
        date: entry.date,
        eventName: entry.eventName,
      })),
    });
  }

  // ── HYROX entries ────────────────────────────────────────────────────
  if (requestedType === "HYROX") {
    const hyroxEntries = await prisma.userPerformanceEntry.findMany({
      where: {
        userId,
        type: "HYROX",
      },
      orderBy: { performedAt: "desc" },
      take: 20,
    });

    if (hyroxEntries.length === 0) {
      return JSON.stringify({
        type: "HYROX",
        message:
          "No HYROX records found. Log your HYROX times to start tracking!",
        entries: [],
      });
    }

    const formatted = hyroxEntries.map((e) => {
      const hours = e.timeSeconds ? Math.floor(e.timeSeconds / 3600) : null;
      const minutes = e.timeSeconds
        ? Math.floor((e.timeSeconds % 3600) / 60)
        : null;
      const seconds = e.timeSeconds ? e.timeSeconds % 60 : null;
      const timeFormatted =
        hours != null && minutes != null && seconds != null
          ? `${hours}h${String(minutes).padStart(2, "0")}m${String(seconds).padStart(2, "0")}s`
          : null;

      return {
        date: e.performedAt.toISOString().split("T")[0],
        time: timeFormatted,
        timeSeconds: e.timeSeconds,
        category: e.hyroxCategory,
        eventName: e.eventName,
        location: e.location,
      };
    });

    return JSON.stringify({
      type: "HYROX",
      totalEntries: hyroxEntries.length,
      entries: formatted,
    });
  }

  // ── STRENGTH: specific exercise ──────────────────────────────────────
  if (params.exerciseName) {
    const exercise = await prisma.exercise.findFirst({
      where: {
        OR: [
          { name: { contains: params.exerciseName, mode: "insensitive" } },
          { aliases: { has: params.exerciseName } },
        ],
      },
      select: { id: true, name: true, category: true },
    });

    if (!exercise) {
      return `Exercise "${params.exerciseName}" not found in the database. Use list_available_exercises to find the correct name.`;
    }

    // Get all performance entries for this exercise, sorted by weight descending
    const entries = await prisma.userPerformanceEntry.findMany({
      where: {
        userId,
        exerciseId: exercise.id,
        type: "STRENGTH",
        weightKg: { not: null },
      },
      orderBy: { weightKg: "desc" },
      take: 10,
    });

    // Also check workout exercise sets for PRs
    const prSets = await prisma.workoutExerciseSet.findMany({
      where: {
        exerciseResult: {
          exerciseId: exercise.id,
          blockResult: {
            log: { userId },
          },
        },
        isPR: true,
      },
      include: {
        exerciseResult: {
          include: {
            blockResult: {
              include: {
                log: {
                  select: { performedAt: true },
                },
              },
            },
          },
        },
      },
      orderBy: { weight: "desc" },
      take: 5,
    });

    if (entries.length === 0 && prSets.length === 0) {
      return JSON.stringify({
        exercise: exercise.name,
        message: `No personal records found for ${exercise.name}. Start logging your workouts to track your PRs!`,
        pr: null,
        history: [],
      });
    }

    // Combine data to find the actual PR
    const allLifts: Array<{
      weightKg: number;
      reps: number | null;
      date: string;
    }> = [];

    for (const entry of entries) {
      if (entry.weightKg) {
        allLifts.push({
          weightKg: entry.weightKg,
          reps: entry.reps,
          date: entry.performedAt.toISOString().split("T")[0],
        });
      }
    }

    for (const set of prSets) {
      allLifts.push({
        weightKg: set.weight,
        reps: set.reps,
        date: set.exerciseResult.blockResult.log.performedAt
          .toISOString()
          .split("T")[0],
      });
    }

    // Sort by weight descending
    allLifts.sort((a, b) => b.weightKg - a.weightKg);

    // Remove duplicates
    const uniqueLifts = allLifts.filter(
      (lift, idx, arr) =>
        idx ===
        arr.findIndex(
          (l) => l.weightKg === lift.weightKg && l.date === lift.date
        )
    );

    return JSON.stringify({
      exercise: exercise.name,
      category: exercise.category,
      pr: uniqueLifts[0] || null,
      recentHistory: uniqueLifts.slice(0, 10),
      totalEntries: uniqueLifts.length,
    });
  }

  // ── No type specified, no exerciseName: return ALL performance records ─
  // First get STRENGTH PRs
  const strengthEntries = await prisma.userPerformanceEntry.findMany({
    where: {
      userId,
      type: "STRENGTH",
      weightKg: { not: null },
      ...(params.category
        ? {
            exercise: {
              category: params.category.toUpperCase() as
                | "CROSSFIT"
                | "GYM"
                | "WEIGHTLIFTING"
                | "BODYWEIGHT"
                | "CARDIO"
                | "OTHER",
            },
          }
        : {}),
    },
    include: {
      exercise: {
        select: { id: true, name: true, category: true },
      },
    },
    orderBy: { weightKg: "desc" },
  });

  // Group by exercise and get the best for each
  const prsByExercise = new Map<
    string,
    {
      name: string;
      category: string;
      weightKg: number;
      reps: number | null;
      date: string;
    }
  >();

  for (const entry of strengthEntries) {
    if (!entry.exercise || !entry.weightKg) continue;
    const exId = entry.exercise.id;
    if (!prsByExercise.has(exId)) {
      prsByExercise.set(exId, {
        name: entry.exercise.name,
        category: entry.exercise.category,
        weightKg: entry.weightKg,
        reps: entry.reps,
        date: entry.performedAt.toISOString().split("T")[0],
      });
    }
  }

  const strengthPRs = Array.from(prsByExercise.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  // Then get RUN/TRAIL entries
  const runEntries = await prisma.userPerformanceEntry.findMany({
    where: {
      userId,
      type: { in: ["RUN", "TRAIL"] },
    },
    orderBy: { performedAt: "desc" },
    take: 10,
  });

  const runRecords = runEntries.map((e) => {
    const hours = e.timeSeconds ? Math.floor(e.timeSeconds / 3600) : null;
    const minutes = e.timeSeconds
      ? Math.floor((e.timeSeconds % 3600) / 60)
      : null;
    const seconds = e.timeSeconds ? e.timeSeconds % 60 : null;
    const timeFormatted =
      hours != null && minutes != null && seconds != null
        ? hours > 0
          ? `${hours}h${String(minutes).padStart(2, "0")}m${String(seconds).padStart(2, "0")}s`
          : `${minutes}m${String(seconds).padStart(2, "0")}s`
        : null;

    return {
      type: e.type,
      date: e.performedAt.toISOString().split("T")[0],
      distanceKm: e.distanceKm,
      time: timeFormatted,
      elevationGainM: e.elevationGainM,
      eventName: e.eventName,
      location: e.location,
    };
  });

  // Get HYROX entries
  const hyroxEntries = await prisma.userPerformanceEntry.findMany({
    where: {
      userId,
      type: "HYROX",
    },
    orderBy: { performedAt: "desc" },
    take: 5,
  });

  const hyroxRecords = hyroxEntries.map((e) => {
    const hours = e.timeSeconds ? Math.floor(e.timeSeconds / 3600) : null;
    const minutes = e.timeSeconds
      ? Math.floor((e.timeSeconds % 3600) / 60)
      : null;
    const seconds = e.timeSeconds ? e.timeSeconds % 60 : null;
    const timeFormatted =
      hours != null && minutes != null && seconds != null
        ? `${hours}h${String(minutes).padStart(2, "0")}m${String(seconds).padStart(2, "0")}s`
        : null;

    return {
      date: e.performedAt.toISOString().split("T")[0],
      time: timeFormatted,
      category: e.hyroxCategory,
      eventName: e.eventName,
      location: e.location,
    };
  });

  if (
    strengthPRs.length === 0 &&
    runRecords.length === 0 &&
    hyroxRecords.length === 0
  ) {
    return "No performance records found. Start logging your workouts and races to track your progress!";
  }

  return JSON.stringify({
    strengthPRs:
      strengthPRs.length > 0
        ? { totalExercises: strengthPRs.length, prs: strengthPRs }
        : null,
    runRecords:
      runRecords.length > 0
        ? { totalEntries: runRecords.length, entries: runRecords }
        : null,
    hyroxRecords:
      hyroxRecords.length > 0
        ? { totalEntries: hyroxRecords.length, entries: hyroxRecords }
        : null,
  });
}

// ============================================================================
// Log Performance Entry (PR / Record)
// ============================================================================

export interface LogPerformanceParams {
  type: "STRENGTH" | "RUN" | "TRAIL";
  // STRENGTH fields
  exerciseName?: string;
  weightKg?: number;
  reps?: number;
  // RUN/TRAIL fields
  distanceKm?: number;
  timeSeconds?: number;
  elevationGainM?: number;
  // Shared
  eventName?: string;
  location?: string;
  date?: string; // ISO date string, defaults to now
}

/**
 * Log a performance entry (strength PR, run time, trail time) directly.
 * This allows users to say "I just did 100kg deadlift for 3 reps" and have it
 * recorded in their Performance history — without creating a full workout.
 */
export async function logPerformanceEntry(
  userId: string,
  params: LogPerformanceParams
): Promise<string> {
  const { type } = params;

  const performedAt = params.date ? new Date(params.date) : new Date();

  // ── STRENGTH ──────────────────────────────────────────────────────────
  if (type === "STRENGTH") {
    if (!params.exerciseName) {
      return JSON.stringify({
        error: true,
        message:
          "Exercise name is required for STRENGTH entries. Please specify the exercise (e.g. 'Deadlift', 'Back Squat', 'Bench Press').",
      });
    }
    if (!params.weightKg || params.weightKg <= 0) {
      return JSON.stringify({
        error: true,
        message:
          "Weight in kg is required for STRENGTH entries. Please specify the weight (e.g. 100).",
      });
    }

    // Find the exercise by name (case-insensitive, also check aliases)
    const exercise = await prisma.exercise.findFirst({
      where: {
        OR: [
          { name: { equals: params.exerciseName, mode: "insensitive" } },
          { aliases: { has: params.exerciseName } },
          {
            aliases: {
              has: params.exerciseName.toLowerCase(),
            },
          },
        ],
      },
    });

    if (!exercise) {
      return JSON.stringify({
        error: true,
        message: `Exercise "${params.exerciseName}" not found. Try common names like "Deadlift", "Back Squat", "Bench Press", "Overhead Press", "Clean", "Snatch", etc.`,
      });
    }

    // Check if this beats the current PR
    const bestEntry = await prisma.userPerformanceEntry.findFirst({
      where: {
        userId,
        type: "STRENGTH",
        exerciseId: exercise.id,
        weightKg: { not: null },
      },
      orderBy: { weightKg: "desc" },
    });

    const currentBestE1rm = bestEntry
      ? (bestEntry.weightKg ?? 0) * (1 + (bestEntry.reps ?? 1) / 30)
      : 0;
    const newE1rm = params.weightKg * (1 + (params.reps ?? 1) / 30);
    const isNewPR = newE1rm > currentBestE1rm;

    // Create the entry
    const entry = await prisma.userPerformanceEntry.create({
      data: {
        userId,
        type: "STRENGTH",
        exerciseId: exercise.id,
        weightKg: params.weightKg,
        reps: params.reps ?? 1,
        performedAt,
        qualityScore: 0.5,
        predictionWeight: 0.5,
      },
    });

    return JSON.stringify({
      success: true,
      entryId: entry.id,
      exercise: exercise.name,
      weightKg: params.weightKg,
      reps: params.reps ?? 1,
      isNewPR,
      previousBest: bestEntry
        ? {
            weightKg: bestEntry.weightKg,
            reps: bestEntry.reps,
            date: bestEntry.performedAt.toISOString().split("T")[0],
          }
        : null,
      date: performedAt.toISOString().split("T")[0],
      message: isNewPR
        ? `🏆 NEW PR! ${exercise.name}: ${params.weightKg}kg × ${params.reps ?? 1} reps!`
        : `✅ Recorded ${exercise.name}: ${params.weightKg}kg × ${params.reps ?? 1} reps.`,
    });
  }

  // ── RUN / TRAIL ───────────────────────────────────────────────────────
  if (type === "RUN" || type === "TRAIL") {
    if (!params.distanceKm || params.distanceKm <= 0) {
      return JSON.stringify({
        error: true,
        message:
          "Distance in km is required for RUN/TRAIL entries. Please specify the distance.",
      });
    }

    const entry = await prisma.userPerformanceEntry.create({
      data: {
        userId,
        type,
        distanceKm: params.distanceKm,
        timeSeconds: params.timeSeconds ?? null,
        elevationGainM:
          type === "TRAIL" ? (params.elevationGainM ?? null) : null,
        eventName: params.eventName ?? null,
        location: params.location ?? null,
        performedAt,
        qualityScore: 0.5,
        predictionWeight: 0.5,
      },
    });

    // Format time nicely
    let timeStr = "";
    if (params.timeSeconds) {
      const h = Math.floor(params.timeSeconds / 3600);
      const m = Math.floor((params.timeSeconds % 3600) / 60);
      const s = params.timeSeconds % 60;
      timeStr =
        h > 0
          ? `${h}h${m.toString().padStart(2, "0")}m${s.toString().padStart(2, "0")}s`
          : `${m}m${s.toString().padStart(2, "0")}s`;
    }

    return JSON.stringify({
      success: true,
      entryId: entry.id,
      type,
      distanceKm: params.distanceKm,
      timeSeconds: params.timeSeconds ?? null,
      timeFormatted: timeStr || null,
      elevationGainM:
        type === "TRAIL" ? (params.elevationGainM ?? null) : undefined,
      eventName: params.eventName ?? null,
      location: params.location ?? null,
      date: performedAt.toISOString().split("T")[0],
      message: `✅ Recorded ${type === "RUN" ? "run" : "trail"}: ${params.distanceKm}km${timeStr ? ` in ${timeStr}` : ""}${params.eventName ? ` (${params.eventName})` : ""}.`,
    });
  }

  return JSON.stringify({
    error: true,
    message: "Invalid type. Use STRENGTH, RUN, or TRAIL.",
  });
}

// ============================================================================
// Giveaways
// ============================================================================

/**
 * Search for active/upcoming giveaways on Athlifyr.
 */
export async function searchGiveaways(
  locale: string,
  status?: string
): Promise<string> {
  const lang = (locale || "pt") as Language;

  const where: Record<string, unknown> = {};

  if (status === "active") {
    where.status = "SCHEDULED";
    where.drawAt = { gt: new Date() };
  } else if (status === "drawn") {
    where.status = "DRAWN";
  } else {
    // Default: show scheduled (upcoming) giveaways
    where.status = { in: ["SCHEDULED", "DRAWING"] };
  }

  const giveaways = await prisma.giveaway.findMany({
    where,
    include: {
      translations: {
        where: { lang },
      },
      event: {
        include: {
          translations: {
            where: { language: lang },
          },
        },
      },
      _count: {
        select: { participations: true },
      },
    },
    orderBy: { drawAt: "asc" },
    take: 10,
  });

  if (giveaways.length === 0) {
    return "No giveaways found.";
  }

  return JSON.stringify(
    giveaways.map((g) => {
      const t = g.translations[0];
      const et = g.event.translations[0];
      return {
        id: g.id,
        title: t?.title || "Giveaway",
        details: t?.details?.substring(0, 300),
        status: g.status,
        drawAt: g.drawAt?.toISOString(),
        prizeCount: g.prizeCount,
        participantsCount: g._count.participations,
        event: {
          id: g.event.id,
          title: et?.title || g.event.title,
          slug: g.event.slug,
          date: g.event.startDate.toISOString().split("T")[0],
          url: `/${locale}/events/${g.event.slug}`,
        },
      };
    })
  );
}

// ============================================================================
// Venue Details
// ============================================================================

/**
 * Get detailed information about a specific venue including plans, prices, services, and team.
 */
export async function getVenueDetails(
  venueId: string,
  locale: string
): Promise<string> {
  const lang = (locale || "pt") as Language;

  const venue = await prisma.venue.findUnique({
    where: { id: venueId },
    include: {
      translations: {
        where: { language: lang },
      },
      plans: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          currency: true,
          policy: true,
        },
      },
      members: {
        where: { status: "ACTIVE", role: { in: ["OWNER", "ADMIN", "COACH"] } },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
        },
      },
      _count: {
        select: { reviews: true, sessions: true },
      },
    },
  });

  if (!venue) {
    return "Venue not found.";
  }

  const t = venue.translations[0];

  return JSON.stringify({
    id: venue.id,
    name: venue.name,
    slug: venue.slug,
    type: venue.type,
    sportTypes: venue.sportTypes,
    services: venue.services,
    description: (t?.description || venue.description)?.substring(0, 500),
    city: venue.city,
    country: venue.country,
    address: venue.address,
    phone: venue.phone,
    email: venue.email,
    website: venue.website,
    instagram: venue.instagram,
    requiresPlanToBook: venue.requiresPlanToBook,
    enableTrialBooking: venue.enableTrialBooking,
    plans: venue.plans.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      currency: p.currency,
    })),
    team: venue.members.map((m) => ({
      name: m.user.name,
      role: m.role,
    })),
    reviewCount: venue._count.reviews,
    sessionCount: venue._count.sessions,
    url: `/${locale}/v/${venue.slug}`,
  });
}

// ============================================================================
// Available Sessions (for booking)
// ============================================================================

export interface AvailableSessionsParams {
  venueId?: string;
  date?: string; // YYYY-MM-DD
  period?: "today" | "tomorrow" | "week";
}

/**
 * Get available sessions at a venue (or user's venues) that can be booked.
 */
export async function getAvailableSessions(
  params: AvailableSessionsParams,
  userId: string,
  locale: string
): Promise<string> {
  const now = new Date();
  let startDate = new Date(now);
  let endDate = new Date(now);

  if (params.date) {
    startDate = new Date(params.date);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(params.date);
    endDate.setHours(23, 59, 59, 999);
  } else if (params.period === "tomorrow") {
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(startDate);
    endDate.setHours(23, 59, 59, 999);
  } else if (params.period === "week") {
    endDate.setDate(endDate.getDate() + 7);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // Default: today
    endDate.setHours(23, 59, 59, 999);
  }

  // Ensure we don't show past sessions
  if (startDate < now) {
    startDate = now;
  }

  const sessionWhere: Record<string, unknown> = {
    startsAt: { gte: startDate, lte: endDate },
  };

  if (params.venueId) {
    sessionWhere.venueId = params.venueId;
  } else {
    // Get venues the user is a member of
    const memberships = await prisma.venueMember.findMany({
      where: { userId, status: "ACTIVE" },
      select: { venueId: true },
    });
    if (memberships.length === 0) {
      return "You are not a member of any venue. Search for venues first using search_venues.";
    }
    sessionWhere.venueId = { in: memberships.map((m) => m.venueId) };
  }

  const sessions = await prisma.venueSession.findMany({
    where: sessionWhere,
    include: {
      venue: {
        select: { id: true, name: true, slug: true },
      },
      bookings: {
        where: {
          status: { in: ["BOOKED", "ATTENDED"] },
        },
        select: { id: true, userId: true },
      },
    },
    orderBy: { startsAt: "asc" },
    take: 30,
  });

  if (sessions.length === 0) {
    return "No available sessions found for the specified period.";
  }

  return JSON.stringify(
    sessions.map((s) => {
      const bookedCount = s.bookings.length;
      const spotsLeft = s.capacity ? s.capacity - bookedCount : null;
      const userBooked = s.bookings.some((b) => b.userId === userId);

      return {
        sessionId: s.id,
        title: s.title,
        type: s.type,
        description: s.description?.substring(0, 150),
        date: s.startsAt.toISOString().split("T")[0],
        startTime: s.startsAt.toISOString().split("T")[1].substring(0, 5),
        endTime: s.endsAt.toISOString().split("T")[1].substring(0, 5),
        startsAt: s.startsAt.toISOString(),
        capacity: s.capacity,
        spotsLeft,
        isFull: spotsLeft !== null && spotsLeft <= 0,
        userAlreadyBooked: userBooked,
        tags: s.tags,
        venue: {
          id: s.venue.id,
          name: s.venue.name,
          url: `/${locale}/v/${s.venue.slug}`,
        },
      };
    })
  );
}

// ============================================================================
// Book Session
// ============================================================================

/**
 * Book the user into a specific session at a venue.
 */
export async function bookSession(
  sessionId: string,
  userId: string,
  locale: string
): Promise<string> {
  // 1. Find the session with venue and existing bookings
  const session = await prisma.venueSession.findUnique({
    where: { id: sessionId },
    include: {
      venue: {
        select: { id: true, name: true, slug: true, requiresPlanToBook: true },
      },
      bookings: {
        where: {
          status: { in: ["BOOKED", "ATTENDED"] },
        },
        select: { id: true, userId: true },
      },
    },
  });

  if (!session) {
    return JSON.stringify({ success: false, error: "Session not found." });
  }

  // 2. Check if session has already started
  if (session.startsAt <= new Date()) {
    return JSON.stringify({
      success: false,
      error: "This session has already started. Cannot book past sessions.",
    });
  }

  // 3. Check capacity
  if (session.capacity && session.bookings.length >= session.capacity) {
    return JSON.stringify({
      success: false,
      error: "This session is full. No spots available.",
    });
  }

  // 4. Check if user already booked
  const existingBooking = await prisma.venueBooking.findFirst({
    where: { sessionId, userId },
  });

  if (existingBooking && existingBooking.status === "BOOKED") {
    return JSON.stringify({
      success: false,
      error: "You are already booked for this session.",
    });
  }

  // 5. Check if venue requires a plan — if so, find active subscription
  let subscriptionId: string | null = null;

  if (session.venue.requiresPlanToBook) {
    const subscription = await prisma.venueSubscription.findFirst({
      where: {
        userId,
        venueId: session.venue.id,
        status: "ACTIVE",
        paymentStatus: "PAID",
      },
      select: { id: true },
    });

    if (!subscription) {
      return JSON.stringify({
        success: false,
        error:
          "This venue requires an active plan/subscription to book sessions. You don't have an active subscription.",
        venueUrl: `/${locale}/v/${session.venue.slug}`,
      });
    }

    subscriptionId = subscription.id;
  }

  // 6. Create or reactivate booking
  let booking;
  if (existingBooking) {
    booking = await prisma.venueBooking.update({
      where: { id: existingBooking.id },
      data: {
        status: "BOOKED",
        subscriptionId,
      },
    });
  } else {
    booking = await prisma.venueBooking.create({
      data: {
        venueId: session.venue.id,
        sessionId,
        userId,
        status: "BOOKED",
        subscriptionId,
      },
    });
  }

  return JSON.stringify({
    success: true,
    bookingId: booking.id,
    session: {
      title: session.title,
      date: session.startsAt.toISOString().split("T")[0],
      startTime: session.startsAt.toISOString().split("T")[1].substring(0, 5),
      endTime: session.endsAt.toISOString().split("T")[1].substring(0, 5),
    },
    venue: {
      name: session.venue.name,
      url: `/${locale}/v/${session.venue.slug}`,
    },
  });
}

// ============================================================================
// Session Details (coach, workout, etc.)
// ============================================================================

/**
 * Get detailed info about a specific session: coach, assigned workout, spots.
 */
export async function getSessionDetails(
  sessionId: string,
  locale: string
): Promise<string> {
  const session = await prisma.venueSession.findUnique({
    where: { id: sessionId },
    include: {
      venue: {
        select: { id: true, name: true, slug: true },
      },
      bookings: {
        where: {
          status: { in: ["BOOKED", "ATTENDED"] },
        },
        select: { id: true },
      },
      sessionWorkouts: {
        include: {
          workout: {
            include: {
              blocks: {
                include: {
                  exercises: {
                    include: {
                      exercise: {
                        select: { name: true, category: true },
                      },
                    },
                    orderBy: { orderIndex: "asc" },
                  },
                },
                orderBy: { orderIndex: "asc" },
              },
            },
          },
        },
      },
    },
  });

  if (!session) {
    return "Session not found.";
  }

  // Get coach name if coachId is set
  let coachName: string | null = null;
  if (session.coachId) {
    const coach = await prisma.user.findUnique({
      where: { id: session.coachId },
      select: { name: true },
    });
    coachName = coach?.name || null;
  }

  const bookedCount = session.bookings.length;
  const spotsLeft = session.capacity ? session.capacity - bookedCount : null;

  // Format workouts
  const workouts = session.sessionWorkouts.map((sw) => ({
    name: sw.workout.name,
    description: sw.workout.description,
    notes: sw.notes,
    blocks: sw.workout.blocks.map((b) => ({
      type: b.type,
      name: b.name,
      rounds: b.rounds,
      timeCap: b.timeCap,
      exercises: b.exercises.map((e) => ({
        name: e.exercise.name,
        category: e.exercise.category,
        reps: e.prescribedReps,
        sets: e.prescribedSets,
        weight: e.prescribedWeight,
        distance: e.prescribedDistance,
        time: e.prescribedTime,
      })),
    })),
  }));

  return JSON.stringify({
    id: session.id,
    title: session.title,
    type: session.type,
    description: session.description,
    date: session.startsAt.toISOString().split("T")[0],
    startTime: session.startsAt.toISOString().split("T")[1].substring(0, 5),
    endTime: session.endsAt.toISOString().split("T")[1].substring(0, 5),
    capacity: session.capacity,
    bookedCount,
    spotsLeft,
    coach: coachName,
    tags: session.tags,
    workouts: workouts.length > 0 ? workouts : null,
    venue: {
      id: session.venue.id,
      name: session.venue.name,
      url: `/${locale}/v/${session.venue.slug}`,
    },
  });
}

/**
 * Find an exercise by name in the database.
 * Returns the exercise ID or null if not found.
 * NEVER creates new exercises - only uses existing ones from the database.
 */
async function findExercise(name: string): Promise<string | null> {
  const normalizedName = name.trim().replace(/\s+/g, " ");

  // 1. Exact match (case-insensitive) or alias match
  const exact = await prisma.exercise.findFirst({
    where: {
      OR: [
        { name: { equals: normalizedName, mode: "insensitive" } },
        { aliases: { has: normalizedName } },
      ],
    },
    select: { id: true },
  });

  if (exact) return exact.id;

  // 2. Contains fallback — only accept if exactly one match to avoid ambiguity
  const containsMatches = await prisma.exercise.findMany({
    where: {
      name: { contains: normalizedName, mode: "insensitive" },
    },
    select: { id: true },
    take: 2,
  });

  if (containsMatches.length === 1) return containsMatches[0].id;

  return null;
}

/**
 * Map block type string to WorkoutBlockType enum.
 */
function mapBlockType(
  type: string
):
  | "WARMUP"
  | "STRENGTH"
  | "AMRAP"
  | "EMOM"
  | "FOR_TIME"
  | "TABATA"
  | "CHIPPER"
  | "REST"
  | "COOLDOWN"
  | "SKILL" {
  const mapping: Record<
    string,
    | "WARMUP"
    | "STRENGTH"
    | "AMRAP"
    | "EMOM"
    | "FOR_TIME"
    | "TABATA"
    | "CHIPPER"
    | "REST"
    | "COOLDOWN"
    | "SKILL"
  > = {
    WARMUP: "WARMUP",
    STRENGTH: "STRENGTH",
    AMRAP: "AMRAP",
    EMOM: "EMOM",
    FOR_TIME: "FOR_TIME",
    TABATA: "TABATA",
    CHIPPER: "CHIPPER",
    REST: "REST",
    COOLDOWN: "COOLDOWN",
    SKILL: "SKILL",
  };
  return mapping[type.toUpperCase()] || "FOR_TIME";
}

export async function saveTrainingPlan(
  params: SaveTrainingPlanParams,
  userId: string
): Promise<string> {
  // 1. Create the TrainingPlan
  const plan = await prisma.trainingPlan.create({
    data: {
      name: params.name,
      description: params.description,
      duration: params.duration,
      difficulty: params.difficulty,
      category: params.category,
      targetAudience: params.targetAudience,
      goals: params.goals,
      isPublic: false,
      isTemplate: false,
      createdById: userId,
    },
  });

  let totalWorkouts = 0;

  // 2. Create weeks with workouts
  for (const weekInput of params.weeks) {
    const week = await prisma.trainingPlanWeek.create({
      data: {
        planId: plan.id,
        weekNumber: weekInput.weekNumber,
        name: weekInput.name || `Semana ${weekInput.weekNumber}`,
        description: weekInput.description,
        orderIndex: weekInput.weekNumber - 1,
      },
    });

    // 3. Create workouts for this week
    for (let wi = 0; wi < weekInput.workouts.length; wi++) {
      const workoutInput = weekInput.workouts[wi];

      // Create the Workout
      const workout = await prisma.workout.create({
        data: {
          name: workoutInput.name,
          description: workoutInput.description,
          createdById: userId,
          estimatedTime: workoutInput.estimatedTime,
          difficulty: params.difficulty,
          tags: [params.category.toLowerCase()],
          isTemplate: false,
          isPublic: false,
        },
      });

      // 4. Create blocks for this workout
      let blockOrderIndex = 0;
      for (let bi = 0; bi < workoutInput.blocks.length; bi++) {
        const blockInput = workoutInput.blocks[bi];

        // Pre-resolve exercises before creating the block
        const resolvedExercises: Array<{
          input: PlanExerciseInput;
          exerciseId: string;
        }> = [];

        for (const exInput of blockInput.exercises) {
          const exerciseId = await findExercise(exInput.name);

          if (!exerciseId) {
            console.warn(
              `[Athli] Skipping unknown exercise: "${exInput.name}" — not found in database`
            );
            continue;
          }

          resolvedExercises.push({ input: exInput, exerciseId });
        }

        // Skip block if no exercises were resolved (REST blocks are kept)
        if (
          resolvedExercises.length === 0 &&
          blockInput.type.toUpperCase() !== "REST"
        ) {
          console.warn(
            `[Athli] Skipping empty block "${blockInput.name || blockInput.type}" — no exercises matched`
          );
          continue;
        }

        const block = await prisma.workoutBlock.create({
          data: {
            workoutId: workout.id,
            type: mapBlockType(blockInput.type),
            name: blockInput.name,
            orderIndex: blockOrderIndex++,
            rounds: blockInput.rounds,
            timeCap: blockInput.timeCap,
            workTime: blockInput.workTime,
            notes: blockInput.notes,
          },
        });

        // 5. Create exercises for this block
        for (let ei = 0; ei < resolvedExercises.length; ei++) {
          const { input: exInput, exerciseId } = resolvedExercises[ei];

          await prisma.workoutBlockExercise.create({
            data: {
              blockId: block.id,
              exerciseId,
              orderIndex: ei,
              prescribedReps: exInput.reps,
              prescribedWeight: exInput.weight,
              prescribedWeightUnit:
                exInput.weightUnit === "LB"
                  ? "LB"
                  : exInput.weight
                    ? "KG"
                    : undefined,
              prescribedDistance: exInput.distance,
              prescribedDistanceUnit:
                exInput.distanceUnit === "MI"
                  ? "MI"
                  : exInput.distanceUnit === "M"
                    ? "M"
                    : exInput.distance
                      ? "KM"
                      : undefined,
              prescribedTime: exInput.time,
              prescribedCalories: exInput.calories,
              prescribedSets: exInput.sets,
              notes: exInput.notes,
            },
          });
        }
      }

      // 6. Link workout to week
      await prisma.trainingPlanWorkout.create({
        data: {
          weekId: week.id,
          workoutId: workout.id,
          dayOfWeek: workoutInput.dayOfWeek,
          orderIndex: wi,
        },
      });

      totalWorkouts++;
    }
  }

  // 7. Assign plan to user
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + params.duration * 7);

  await prisma.userTrainingPlan.create({
    data: {
      userId,
      planId: plan.id,
      startDate,
      endDate,
      status: "ACTIVE",
    },
  });

  return JSON.stringify({
    id: plan.id,
    name: plan.name,
    duration: params.duration,
    difficulty: params.difficulty,
    category: params.category,
    goals: params.goals,
    totalWeeks: params.weeks.length,
    totalWorkouts,
    url: `/workouts/plans/${plan.id}`,
  });
}

// ============================================================================
// Save Single Workout
// ============================================================================

interface WorkoutBlockInput {
  type: string;
  name?: string;
  rounds?: number;
  timeCap?: number;
  workTime?: number;
  notes?: string;
  exercises: PlanExerciseInput[];
}

export interface SaveWorkoutParams {
  name: string;
  description?: string;
  estimatedTime?: number;
  difficulty?: number;
  tags?: string[];
  blocks: WorkoutBlockInput[];
}

export async function saveWorkout(
  params: SaveWorkoutParams,
  userId: string
): Promise<string> {
  // 1. Create the Workout
  const workout = await prisma.workout.create({
    data: {
      name: params.name,
      description: params.description,
      createdById: userId,
      estimatedTime: params.estimatedTime,
      difficulty: params.difficulty,
      tags: params.tags || [],
      isTemplate: false,
      isPublic: false,
    },
  });

  // 2. Create blocks (skip blocks where no exercises could be resolved)
  let totalExercises = 0;
  let blockOrderIndex = 0;

  for (let bi = 0; bi < params.blocks.length; bi++) {
    const blockInput = params.blocks[bi];

    // Pre-resolve exercises before creating the block
    const resolvedExercises: Array<{
      input: PlanExerciseInput;
      exerciseId: string;
    }> = [];

    for (const exInput of blockInput.exercises) {
      const exerciseId = await findExercise(exInput.name);

      if (!exerciseId) {
        console.warn(
          `[Athli] Skipping unknown exercise: "${exInput.name}" — not found in database`
        );
        continue;
      }

      resolvedExercises.push({ input: exInput, exerciseId });
    }

    // Skip block if no exercises were resolved (REST blocks are kept)
    if (
      resolvedExercises.length === 0 &&
      blockInput.type.toUpperCase() !== "REST"
    ) {
      console.warn(
        `[Athli] Skipping empty block "${blockInput.name || blockInput.type}" — no exercises matched`
      );
      continue;
    }

    const block = await prisma.workoutBlock.create({
      data: {
        workoutId: workout.id,
        type: mapBlockType(blockInput.type),
        name: blockInput.name,
        orderIndex: blockOrderIndex++,
        rounds: blockInput.rounds,
        timeCap: blockInput.timeCap,
        workTime: blockInput.workTime,
        notes: blockInput.notes,
      },
    });

    // 3. Create exercises for this block
    for (let ei = 0; ei < resolvedExercises.length; ei++) {
      const { input: exInput, exerciseId } = resolvedExercises[ei];

      await prisma.workoutBlockExercise.create({
        data: {
          blockId: block.id,
          exerciseId,
          orderIndex: ei,
          prescribedReps: exInput.reps,
          prescribedWeight: exInput.weight,
          prescribedWeightUnit:
            exInput.weightUnit === "LB"
              ? "LB"
              : exInput.weight
                ? "KG"
                : undefined,
          prescribedDistance: exInput.distance,
          prescribedDistanceUnit:
            exInput.distanceUnit === "MI"
              ? "MI"
              : exInput.distanceUnit === "M"
                ? "M"
                : exInput.distance
                  ? "KM"
                  : undefined,
          prescribedTime: exInput.time,
          prescribedCalories: exInput.calories,
          prescribedSets: exInput.sets,
          notes: exInput.notes,
        },
      });
    }

    totalExercises += resolvedExercises.length;
  }

  // If no exercises were added at all, clean up and return error
  if (totalExercises === 0 && blockOrderIndex === 0) {
    await prisma.workout.delete({ where: { id: workout.id } });
    return JSON.stringify({
      error: true,
      message:
        "No exercises could be matched to the database. Please call list_available_exercises first and use exact exercise names.",
    });
  }

  // 4. Save to user's workouts
  await prisma.savedWorkout.create({
    data: {
      userId,
      workoutId: workout.id,
    },
  });

  return JSON.stringify({
    id: workout.id,
    name: workout.name,
    estimatedTime: workout.estimatedTime,
    difficulty: workout.difficulty,
    totalBlocks: blockOrderIndex,
    url: `/workouts/${workout.id}/run`,
  });
}

// ============================================================================
// Submit Admin Note (event/venue submission requests from chat)
// ============================================================================

export interface SubmitAdminNoteParams {
  type: "EVENT" | "VENUE" | "OTHER";
  title: string;
  message: string;
  location?: string;
  date?: string;
  sportType?: string;
  url?: string;
}

export async function submitAdminNote(
  params: SubmitAdminNoteParams,
  userId: string
): Promise<string> {
  try {
    const note = await prisma.adminNote.create({
      data: {
        userId,
        type: params.type,
        title: params.title,
        message: params.message,
        location: params.location || null,
        date: params.date || null,
        sportType: params.sportType || null,
        url: params.url || null,
        status: "pending",
      },
    });

    return JSON.stringify({
      success: true,
      noteId: note.id,
      type: note.type,
      title: note.title,
      message:
        "Request submitted successfully. The Athlifyr team will review it.",
    });
  } catch (error) {
    console.error("Error submitting admin note:", error);
    return JSON.stringify({
      success: false,
      error: "Failed to submit request. Please try again later.",
    });
  }
}

// ============================================================================
// Tool Definitions for OpenAI
// ============================================================================

export const athliTools = [
  {
    type: "function" as const,
    name: "search_events",
    description:
      "Search for sporting events on Athlifyr. Use this when the user asks about events, races, competitions, wants event suggestions, or mentions a specific event by name. When the user mentions a specific event name (e.g. 'HYROX Lisboa', 'Trail Manuelino'), use the 'search' parameter with that name. To get full details (prices, registration, FAQs), first use this tool to get the event ID, then use get_event_details.",
    parameters: {
      type: "object",
      properties: {
        sportTypes: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "RUNNING",
              "TRAIL",
              "HYROX",
              "CROSSFIT",
              "OCR",
              "BTT",
              "CYCLING",
              "SURF",
              "TRIATHLON",
              "SWIMMING",
              "WALKING",
              "OTHER",
            ],
          },
          description: "Filter by sport types",
        },
        city: {
          type: "string",
          description: "Filter by city name",
        },
        country: {
          type: "string",
          description: "Filter by country name",
        },
        fromDate: {
          type: "string",
          description: "Start date filter (YYYY-MM-DD)",
        },
        toDate: {
          type: "string",
          description: "End date filter (YYYY-MM-DD)",
        },
        search: {
          type: "string",
          description: "Free text search for event name",
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default 10)",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "get_my_events",
    description:
      "Get the user's own events — events they are registered for or have participated in. Use this when the user asks about 'my events', 'my next race', 'my upcoming events', 'what events am I signed up for', 'my past races', etc. This is different from search_events which searches all public events.",
    parameters: {
      type: "object",
      properties: {
        upcoming: {
          type: "boolean",
          description:
            "If true, only return upcoming/future events. If false, only return past events. If omitted, return all events.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "get_my_bookings",
    description:
      "Get the user's booked classes and sessions at venues — gym classes, CrossFit sessions, appointments, etc. Use this when the user asks about 'my classes', 'my bookings', 'my sessions', 'que aulas tenho', 'aulas marcadas', 'what classes do I have today/this week', etc. This is different from get_my_events which returns sporting events like races and competitions.",
    parameters: {
      type: "object",
      properties: {
        period: {
          type: "string",
          enum: ["today", "week", "upcoming", "past"],
          description:
            "Filter bookings by period: 'today' (today only), 'week' (rest of this week), 'upcoming' (all future, default), 'past' (past bookings). If omitted, defaults to upcoming.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "search_venues",
    description:
      "Search for gyms, boxes, studios, massage therapists, physios, nutritionists, and sports venues on Athlifyr. Use this when the user asks about places to train, gyms, venues, or services like massage, physiotherapy, nutrition. Venue types: CROSSFIT_BOX, CROSSTRAINING_BOX, GYM, PT_STUDIO, MASSAGE, PHYSIO, NUTRITION, OTHER.",
    parameters: {
      type: "object",
      properties: {
        sportTypes: {
          type: "array",
          items: {
            type: "string",
            enum: [
              "RUNNING",
              "TRAIL",
              "HYROX",
              "CROSSFIT",
              "OCR",
              "BTT",
              "CYCLING",
              "SURF",
              "TRIATHLON",
              "SWIMMING",
              "WALKING",
              "OTHER",
            ],
          },
          description: "Filter by sport types",
        },
        city: {
          type: "string",
          description: "Filter by city name",
        },
        search: {
          type: "string",
          description: "Free text search for venue name",
        },
        venueType: {
          type: "string",
          enum: [
            "CROSSFIT_BOX",
            "CROSSTRAINING_BOX",
            "GYM",
            "PT_STUDIO",
            "MASSAGE",
            "PHYSIO",
            "NUTRITION",
            "OTHER",
          ],
          description:
            "Filter by venue type. Use MASSAGE for massage therapists, PHYSIO for physiotherapy, NUTRITION for nutritionists.",
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default 10)",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "get_venue_details",
    description:
      "Get detailed information about a specific venue including plans/prices, services, team/coaches, and contact info. Use this when the user asks about venue prices, plans, what a venue offers, who coaches there, etc.",
    parameters: {
      type: "object",
      properties: {
        venueId: {
          type: "string",
          description: "The venue ID to get details for",
        },
      },
      required: ["venueId"],
    },
  },
  {
    type: "function" as const,
    name: "get_available_sessions",
    description:
      "Get available sessions/classes at a venue that the user can book. Shows upcoming sessions with spots available. Use this when the user asks 'what classes can I join today', 'que aulas posso fazer', 'what sessions are available', etc.",
    parameters: {
      type: "object",
      properties: {
        venueId: {
          type: "string",
          description:
            "Optional: specific venue ID. If omitted, shows sessions from all venues the user is a member of.",
        },
        date: {
          type: "string",
          description: "Specific date to check (YYYY-MM-DD)",
        },
        period: {
          type: "string",
          enum: ["today", "tomorrow", "week"],
          description:
            "Period to check: 'today', 'tomorrow', or 'week'. If date is provided, this is ignored.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "book_session",
    description:
      "Book the user into a specific session/class at a venue. ONLY call this AFTER the user explicitly confirms which session they want to book. Never book without confirmation. Provide the session ID from get_available_sessions or get_my_bookings results.",
    parameters: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "The session ID to book",
        },
      },
      required: ["sessionId"],
    },
  },
  {
    type: "function" as const,
    name: "get_session_details",
    description:
      "Get detailed information about a specific session including the coach name, assigned workout (exercises), and number of spots available. Use this when the user asks 'who is the coach', 'what is today's workout', 'como é o treino de hoje', 'quem é o coach da aula', etc.",
    parameters: {
      type: "object",
      properties: {
        sessionId: {
          type: "string",
          description: "The session ID to get details for",
        },
      },
      required: ["sessionId"],
    },
  },
  {
    type: "function" as const,
    name: "search_giveaways",
    description:
      "Search for active giveaways/sorteios on Athlifyr. Use this when the user asks about giveaways, sorteios, raffles, promotions, or prizes. Shows upcoming draws with prize details and participant count.",
    parameters: {
      type: "object",
      properties: {
        status: {
          type: "string",
          enum: ["active", "drawn"],
          description:
            "Filter by status: 'active' (upcoming/scheduled), 'drawn' (already drawn). Default: active.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "get_my_prs",
    description:
      "Get the user's personal records and performance entries. Supports STRENGTH (gym PRs), RUN (road running times), TRAIL (trail running times), and HYROX records. Use this when the user asks about PRs, race times, running records, 'corridas guardadas', 'my best time', 'meus tempos', 'qual o meu PR', 'quanto levanto', 'meu recorde', 'corridas registadas', 'tempos de corrida', etc.",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["STRENGTH", "RUN", "TRAIL", "HYROX"],
          description:
            "Type of performance record: STRENGTH for gym PRs (weight/reps), RUN for road running (distance/time), TRAIL for trail running (distance/time/elevation), HYROX for HYROX race times. When user asks about 'corridas'/'runs'/'tempos de corrida' use RUN. When asking about 'PRs'/'maximos'/'quanto levanto' use STRENGTH. Omit to get all types.",
        },
        exerciseName: {
          type: "string",
          description:
            "Optional: specific exercise name for STRENGTH type (e.g. 'Back Squat', 'Deadlift', 'Bench Press').",
        },
        category: {
          type: "string",
          enum: [
            "CROSSFIT",
            "GYM",
            "WEIGHTLIFTING",
            "BODYWEIGHT",
            "CARDIO",
            "OTHER",
          ],
          description:
            "Optional: filter STRENGTH PRs by exercise category. Only used when type is STRENGTH and exerciseName is not provided.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "log_performance_entry",
    description:
      "Log/record a performance entry directly — a strength PR, a run time, or a trail time. Use this when the user says they just did a lift (e.g. 'fiz deadlift 100kg 3 reps', 'acabei de fazer back squat 120kg', 'I just ran 10k in 45 minutes', 'fiz 5km em 22 minutos', 'corri um trail de 30km'). This saves the entry to their Performance/PR history. Do NOT create a workout — this is for quick logging directly into the user's personal records. IMPORTANT: When the user reports a lift they just did, ALWAYS use this tool, never create_workout.",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["STRENGTH", "RUN", "TRAIL"],
          description:
            "Type: STRENGTH for gym lifts (deadlift, squat, bench), RUN for road running, TRAIL for trail running.",
        },
        exerciseName: {
          type: "string",
          description:
            "Required for STRENGTH: exercise name (e.g. 'Deadlift', 'Back Squat', 'Bench Press', 'Clean', 'Snatch').",
        },
        weightKg: {
          type: "number",
          description: "Required for STRENGTH: weight in kg (e.g. 100).",
        },
        reps: {
          type: "number",
          description:
            "For STRENGTH: number of reps (default 1 if not specified).",
        },
        distanceKm: {
          type: "number",
          description:
            "Required for RUN/TRAIL: distance in km (e.g. 10, 5, 42.195).",
        },
        timeSeconds: {
          type: "number",
          description:
            "For RUN/TRAIL: total time in seconds (e.g. 2700 for 45min). Convert from the user's input: '45 minutes' = 2700, '1h30' = 5400.",
        },
        elevationGainM: {
          type: "number",
          description: "For TRAIL only: elevation gain in meters.",
        },
        eventName: {
          type: "string",
          description:
            "Optional: event/race name if this was done at a specific event.",
        },
        location: {
          type: "string",
          description: "Optional: location where it was done.",
        },
        date: {
          type: "string",
          description:
            "Optional: ISO date string (YYYY-MM-DD). Defaults to today if not provided.",
        },
      },
      required: ["type"],
    },
  },
  {
    type: "function" as const,
    name: "get_event_details",
    description:
      "Get detailed information about a specific event including variants, pricing phases, registration link, and FAQs. ALWAYS use this after search_events when the user wants details about a specific event (prices, distances, registration, etc.). Requires the event ID from search_events results.",
    parameters: {
      type: "object",
      properties: {
        eventId: {
          type: "string",
          description: "The event ID to get details for",
        },
      },
      required: ["eventId"],
    },
  },
  {
    type: "function" as const,
    name: "list_available_exercises",
    description:
      "List all available exercises from the Athlifyr database. ALWAYS call this BEFORE proposing or saving a training plan. You MUST only use exercises that are returned by this tool. Optionally filter by category: CROSSFIT, GYM, WEIGHTLIFTING, BODYWEIGHT, CARDIO, OTHER.",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: [
            "CROSSFIT",
            "GYM",
            "WEIGHTLIFTING",
            "BODYWEIGHT",
            "CARDIO",
            "OTHER",
          ],
          description:
            "Optional: filter exercises by category. Omit to get all exercises.",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "save_training_plan",
    description:
      "Save a fully structured training plan to the user's account with weeks, workouts, blocks, and exercises. ONLY call this AFTER the user has explicitly confirmed they want to save the plan you proposed. Never call this without confirmation. The plan must include the complete structured data with weeks containing workouts, each workout with blocks (WARMUP, STRENGTH, AMRAP, FOR_TIME, COOLDOWN, etc.), and each block with exercises.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Name of the training plan",
        },
        description: {
          type: "string",
          description: "Brief description of the plan's purpose",
        },
        duration: {
          type: "number",
          description: "Duration in weeks",
        },
        difficulty: {
          type: "number",
          description: "Difficulty level 1-5",
        },
        category: {
          type: "string",
          description:
            "Category: Running, Trail, CrossFit, HYROX, Hybrid, Strength, Bodyweight, etc.",
        },
        targetAudience: {
          type: "string",
          description: "Target audience: Beginner, Intermediate, Advanced",
        },
        goals: {
          type: "array",
          items: { type: "string" },
          description: "List of training goals",
        },
        weeks: {
          type: "array",
          description: "Array of weeks in the plan",
          items: {
            type: "object",
            properties: {
              weekNumber: {
                type: "number",
                description: "Week number (1, 2, 3...)",
              },
              name: {
                type: "string",
                description: "Optional week name e.g. 'Foundation Week'",
              },
              description: {
                type: "string",
                description: "Optional description of the week's focus",
              },
              workouts: {
                type: "array",
                description: "Workouts for this week",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description:
                        "Workout name e.g. 'Full Body Running + CrossFit'",
                    },
                    description: {
                      type: "string",
                      description: "Brief workout description",
                    },
                    dayOfWeek: {
                      type: "number",
                      description:
                        "Day of week: 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday",
                    },
                    estimatedTime: {
                      type: "number",
                      description: "Estimated duration in minutes",
                    },
                    blocks: {
                      type: "array",
                      description:
                        "Workout blocks (sections). Each workout should have at least a main block. Use WARMUP for warm-ups, STRENGTH for sets/reps, FOR_TIME for timed circuits, AMRAP for as-many-rounds, COOLDOWN for cool-downs, etc.",
                      items: {
                        type: "object",
                        properties: {
                          type: {
                            type: "string",
                            enum: [
                              "WARMUP",
                              "STRENGTH",
                              "AMRAP",
                              "EMOM",
                              "FOR_TIME",
                              "TABATA",
                              "CHIPPER",
                              "COOLDOWN",
                              "SKILL",
                              "REST",
                            ],
                            description: "Block type",
                          },
                          name: {
                            type: "string",
                            description:
                              "Optional block name e.g. 'Aquecimento', 'WOD', 'Core'",
                          },
                          rounds: {
                            type: "number",
                            description:
                              "Number of rounds (for FOR_TIME, AMRAP)",
                          },
                          timeCap: {
                            type: "number",
                            description:
                              "Time cap in seconds (for AMRAP, FOR_TIME)",
                          },
                          workTime: {
                            type: "number",
                            description:
                              "Work time per interval in seconds (for EMOM)",
                          },
                          notes: {
                            type: "string",
                            description: "Additional notes for this block",
                          },
                          exercises: {
                            type: "array",
                            description: "Exercises in this block",
                            items: {
                              type: "object",
                              properties: {
                                name: {
                                  type: "string",
                                  description:
                                    "Exercise name EXACTLY as returned by list_available_exercises. Must match a real exercise from the database.",
                                },
                                reps: {
                                  type: "number",
                                  description: "Number of repetitions",
                                },
                                sets: {
                                  type: "number",
                                  description:
                                    "Number of sets (for STRENGTH blocks)",
                                },
                                weight: {
                                  type: "number",
                                  description: "Weight in kg (optional)",
                                },
                                distance: {
                                  type: "number",
                                  description:
                                    "Distance in km (for running, rowing, etc.)",
                                },
                                time: {
                                  type: "number",
                                  description:
                                    "Time in seconds (for planks, holds, running duration)",
                                },
                                calories: {
                                  type: "number",
                                  description:
                                    "Calories target (for rowing, bike, etc.)",
                                },
                                notes: {
                                  type: "string",
                                  description:
                                    "Exercise-specific notes e.g. 'modify on knees if needed'",
                                },
                              },
                              required: ["name"],
                            },
                          },
                        },
                        required: ["type", "exercises"],
                      },
                    },
                  },
                  required: ["name", "dayOfWeek", "blocks"],
                },
              },
            },
            required: ["weekNumber", "workouts"],
          },
        },
      },
      required: [
        "name",
        "description",
        "duration",
        "difficulty",
        "category",
        "targetAudience",
        "goals",
        "weeks",
      ],
    },
  },
  {
    type: "function" as const,
    name: "save_workout",
    description:
      "Save a SINGLE workout session (treino) to the user's account with blocks and exercises. Use this when the user asked for a single workout, NOT a multi-week training plan. ONLY call this AFTER the user has explicitly confirmed they want to save. Each workout should have structured blocks (WARMUP, STRENGTH, AMRAP, FOR_TIME, COOLDOWN, etc.) and each block with exercises from the database.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Name of the workout e.g. 'CrossFit WOD', 'Full Body Strength', 'AMRAP 20min'",
        },
        description: {
          type: "string",
          description: "Brief description of the workout",
        },
        estimatedTime: {
          type: "number",
          description: "Estimated duration in minutes",
        },
        difficulty: {
          type: "number",
          description: "Difficulty level 1-5",
        },
        tags: {
          type: "array",
          items: { type: "string" },
          description:
            "Tags for the workout e.g. ['crossfit', 'strength', 'cardio']",
        },
        blocks: {
          type: "array",
          description:
            "Workout blocks (sections). Each workout should have at least a main block. Use WARMUP for warm-ups, STRENGTH for sets/reps, FOR_TIME for timed circuits, AMRAP for as-many-rounds, COOLDOWN for cool-downs, etc.",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                enum: [
                  "WARMUP",
                  "STRENGTH",
                  "AMRAP",
                  "EMOM",
                  "FOR_TIME",
                  "TABATA",
                  "CHIPPER",
                  "COOLDOWN",
                  "SKILL",
                  "REST",
                ],
                description: "Block type",
              },
              name: {
                type: "string",
                description:
                  "Optional block name e.g. 'Aquecimento', 'WOD', 'Core'",
              },
              rounds: {
                type: "number",
                description: "Number of rounds (for FOR_TIME, AMRAP)",
              },
              timeCap: {
                type: "number",
                description: "Time cap in seconds (for AMRAP, FOR_TIME)",
              },
              workTime: {
                type: "number",
                description: "Work time per interval in seconds (for EMOM)",
              },
              notes: {
                type: "string",
                description: "Additional notes for this block",
              },
              exercises: {
                type: "array",
                description: "Exercises in this block",
                items: {
                  type: "object",
                  properties: {
                    name: {
                      type: "string",
                      description:
                        "Exercise name EXACTLY as returned by list_available_exercises. Must match a real exercise from the database.",
                    },
                    reps: {
                      type: "number",
                      description: "Number of repetitions",
                    },
                    sets: {
                      type: "number",
                      description: "Number of sets (for STRENGTH blocks)",
                    },
                    weight: {
                      type: "number",
                      description: "Weight in kg (optional)",
                    },
                    distance: {
                      type: "number",
                      description: "Distance in km (for running, rowing, etc.)",
                    },
                    time: {
                      type: "number",
                      description:
                        "Time in seconds (for planks, holds, running duration)",
                    },
                    calories: {
                      type: "number",
                      description: "Calories target (for rowing, bike, etc.)",
                    },
                    notes: {
                      type: "string",
                      description:
                        "Exercise-specific notes e.g. 'modify on knees if needed'",
                    },
                  },
                  required: ["name"],
                },
              },
            },
            required: ["type", "exercises"],
          },
        },
      },
      required: ["name", "blocks"],
    },
  },
  {
    type: "function" as const,
    name: "get_my_analyses",
    description:
      "Get the user's saved video analyses — motion (pose) analyses and lift (bar path) analyses. Each analysis includes the AI assessment with exercise identification, form score, rep count, strengths, areas for improvement, and safety flags. Use this when the user asks about 'my analyses', 'my videos', 'my lifts', 'my movement analysis', 'análise de movimento', 'análise de levantamento', 'meus vídeos', 'como está a minha técnica', 'form check', 'squat analysis', etc.",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["motion", "lift"],
          description:
            "Filter by analysis type: 'motion' for movement/pose analysis, 'lift' for barbell/lift analysis. Omit to get both types.",
        },
        limit: {
          type: "number",
          description: "Maximum number of results (default 10)",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "get_my_workout_history",
    description:
      "Get the user's workout history — completed training logs with exercise details, feelings, and performance data. Use this when the user asks about 'my workouts', 'quantos treinos fiz', 'how many workouts', 'treinos esta semana', 'treinos este mês', 'training history', 'workout logs', 'último treino', 'fiz treino hoje', 'my training this week', 'workout count', 'treinos da última semana', 'última semana', 'semana passada', etc. Returns workout count, average feeling/RPE, PRs achieved, and detailed exercise logs. NOT for saved workout templates — only for completed/logged workouts. IMPORTANT: 'última semana' / 'semana passada' = last_week (previous Mon-Sun), NOT week (current week).",
    parameters: {
      type: "object",
      properties: {
        period: {
          type: "string",
          enum: ["week", "last_week", "month", "last_month", "year", "all"],
          description:
            "Filter by time period: 'week' (current week Mon-now), 'last_week' (previous Mon-Sun — use for 'última semana', 'semana passada'), 'month' (current month), 'last_month' (previous month — use for 'último mês', 'mês passado'), 'year' (current year), 'all' (all time stats). Omit for recent history (last 20 logs).",
        },
        limit: {
          type: "number",
          description:
            "Maximum number of log entries to return (default 20, max 10 for year/all)",
        },
      },
    },
  },
  {
    type: "function" as const,
    name: "submit_admin_note",
    description:
      "Submit a request for the Athlifyr team to review. Use this when the user wants to ADD a new event, ADD a new venue, or make a request that you cannot fulfil directly. Collect as much information as possible (name, location, date, sport type, URL) before calling this tool. Set type to EVENT for event requests, VENUE for venue requests, or OTHER for anything else.",
    parameters: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["EVENT", "VENUE", "OTHER"],
          description:
            "Type of request: EVENT to add an event, VENUE to add a venue, OTHER for other requests.",
        },
        title: {
          type: "string",
          description:
            "Event/venue name or short summary of the request (e.g. 'Trail Manuelino 2026', 'CrossFit Box Amadora').",
        },
        message: {
          type: "string",
          description:
            "Full description of what the user wants. Include all details they provided: dates, location, distances, prices, sport types, etc.",
        },
        location: {
          type: "string",
          description:
            "City/region if provided (e.g. 'Pombal', 'Lisboa', 'Porto').",
        },
        date: {
          type: "string",
          description:
            "Event date if provided (e.g. '2026-03-15', 'março 2026').",
        },
        sportType: {
          type: "string",
          description:
            "Sport type if relevant (e.g. 'TRAIL', 'CROSSFIT', 'RUNNING').",
        },
        url: {
          type: "string",
          description:
            "External URL if the user provided one (event website, venue website, etc.).",
        },
      },
      required: ["type", "title", "message"],
    },
  },
  {
    type: "function" as const,
    name: "get_platform_info",
    description:
      "Get information about the Athlifyr platform itself — features, pricing, plans for venues/gyms, athlete features, how the platform works, etc. Use this when the user asks about Athlifyr's services, pricing, what Athlifyr offers, how to add their gym/box, venue management features, athlete tools, or any question about the platform itself. Categories: 'about' (what is Athlifyr), 'pricing' (plans and costs), 'features_venues' (features for gyms/boxes/studios), 'features_athletes' (features for athletes), 'faq' (common questions).",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          enum: [
            "about",
            "pricing",
            "features_venues",
            "features_athletes",
            "faq",
          ],
          description:
            "Filter by category: 'about' for general platform info, 'pricing' for plans and costs, 'features_venues' for gym/box/studio features, 'features_athletes' for athlete tools, 'faq' for common questions. Omit to get all platform info.",
        },
        search: {
          type: "string",
          description:
            "Optional search term to find specific info (e.g. 'preço', 'ginásio', 'marcações', 'booking').",
        },
      },
    },
  },
];
