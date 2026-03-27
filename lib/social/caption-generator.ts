import type { SocialPostType } from "@prisma/client";
import OpenAI from "openai";

interface EventForCaption {
  id?: string;
  slug?: string;
  title: string;
  city: string;
  country: string;
  startDate: string | Date;
  sportTypes: string[];
  variants: Array<{
    name: string;
    distanceKm: number | null;
    elevationGainM: number | null;
  }>;
  registrationDeadline?: string | Date | null;
}

const SPORT_EMOJIS: Record<string, string> = {
  TRAIL: "🏔️",
  RUNNING: "🏃",
  CYCLING: "🚴",
  BTT: "🚵",
  TRIATHLON: "🏊‍♂️🚴🏃",
  DUATHLON: "🚴🏃",
  OCR: "💪",
  CROSSFIT: "🏋️",
  HYROX: "🔥",
  SURF: "🏄",
  SWIMMING: "🏊",
  WALKING: "🚶",
  AQUATHLON: "🏊🏃",
};

function sportEmoji(types: string[]): string {
  return types.map((s) => SPORT_EMOJIS[s] || "🏅").join("");
}

const SPORT_LABELS: Record<string, string> = {
  TRAIL: "Trails",
  RUNNING: "Running",
  CYCLING: "Cycling",
  BTT: "BTT",
  SWIMMING: "Swimming",
  TRIATHLON: "Triathlon",
  DUATHLON: "Duathlon",
  AQUATHLON: "Aquathlon",
  HYROX: "Hyrox",
  CROSSFIT: "CrossFit",
  OCR: "OCR",
  WALKING: "Walking",
  SURF: "Surf",
};

function buildDynamicLabel(sports: Set<string>): {
  label: string;
  emoji: string;
} {
  if (sports.size === 1) {
    const sport = [...sports][0];
    return {
      label: SPORT_LABELS[sport] || "Eventos",
      emoji: SPORT_EMOJIS[sport] || "🏅",
    };
  }
  return { label: "Eventos", emoji: "🏅" };
}

function formatDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function formatShortDate(d: string | Date): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("pt-PT", {
    day: "numeric",
    month: "short",
  });
}

function buildHashtags(event: EventForCaption): string[] {
  const tags = ["athlifyr"];
  for (const s of event.sportTypes) {
    tags.push(s.toLowerCase());
  }
  tags.push("trailrunning", "corrida", "desporto", "portugal");
  return [...new Set(tags)];
}

// ─── Single Event Post ───────────────────────────────────────────────────────

export function generateEventCaption(event: EventForCaption): {
  title: string;
  caption: string;
  hashtags: string[];
} {
  const emoji = sportEmoji(event.sportTypes);
  const dateStr = formatDate(event.startDate);

  let caption = `${emoji} ${event.title}\n\n`;
  caption += `📅 ${dateStr}\n`;
  caption += `📍 ${event.city}, ${event.country}\n`;

  if (event.variants.length > 0) {
    caption += `\n🏁 Provas:\n`;
    for (const v of event.variants) {
      let line = `• ${v.name}`;
      if (v.distanceKm) line += ` — ${v.distanceKm}km`;
      if (v.elevationGainM) line += ` (D+ ${v.elevationGainM}m)`;
      caption += `${line}\n`;
    }
  }

  caption += `\n🔗 Mais info em athlifyr.com`;

  return {
    title: `${emoji} ${event.title} — ${event.city}`,
    caption,
    hashtags: buildHashtags(event),
  };
}

// ─── Weekly Roundup Post ─────────────────────────────────────────────────────

export function generateWeeklyRoundupCaption(events: EventForCaption[]): {
  title: string;
  caption: string;
  hashtags: string[];
} {
  const allSports = new Set(events.flatMap((e) => e.sportTypes));
  const { label, emoji } = buildDynamicLabel(allSports);
  const heading = `${emoji} ${label} da Semana`;

  let caption = `${heading}\n\n`;

  for (const ev of events) {
    const dateStr = formatShortDate(ev.startDate);
    const distances = ev.variants
      .filter((v) => v.distanceKm)
      .map((v) => `${v.distanceKm}km`)
      .slice(0, 3)
      .join("/");
    caption += `📅 ${dateStr} — ${ev.title} (${ev.city})`;
    if (distances) caption += ` ${distances}`;
    caption += `\n`;
  }

  caption += `\n🔗 Mais info em athlifyr.com`;

  const sportTags = [...allSports].map((s) => s.toLowerCase());

  return {
    title: `${emoji} ${label} da Semana — ${events.length} eventos`,
    caption,
    hashtags: ["athlifyr", ...sportTags, "eventos", "portugal"],
  };
}

// ─── AI-Enhanced Weekly Roundup Caption ──────────────────────────────────────

export async function generateWeeklyRoundupCaptionAI(
  events: EventForCaption[]
): Promise<{
  title: string;
  caption: string;
  hashtags: string[];
}> {
  // Fallback to static caption if OpenAI key is not configured
  if (!process.env.OPENAI_API_KEY) {
    console.warn(
      "[caption-generator] OPENAI_API_KEY not set, using static caption"
    );
    return generateWeeklyRoundupCaption(events);
  }

  const allSports = new Set(events.flatMap((e) => e.sportTypes));
  const { label, emoji } = buildDynamicLabel(allSports);
  const sportTags = [...allSports].map((s) => s.toLowerCase());

  // Build event data for the prompt
  const eventList = events
    .map((ev) => {
      const dateStr = formatShortDate(ev.startDate);
      const distances = ev.variants
        .filter((v) => v.distanceKm)
        .map((v) => `${v.distanceKm}km`)
        .slice(0, 3)
        .join("/");
      const sportNames = ev.sportTypes
        .map((s) => SPORT_LABELS[s] || s)
        .join(", ");
      return `- ${ev.title} | ${dateStr} | ${ev.city} | ${sportNames}${distances ? ` | ${distances}` : ""}`;
    })
    .join("\n");

  const prompt = `Escreve uma legenda de Instagram em Português Europeu (pt-PT) para a publicação semanal de eventos desportivos da plataforma Athlifyr.

DADOS DOS EVENTOS:
${eventList}

REGRAS OBRIGATÓRIAS:
1. Escreve em Português Europeu (usar "tu", "ecrã", nunca "você" ou termos do Brasil)
2. Tom: energético, motivador, alegre, com emojis variados (não exagerar)
3. Começa com uma frase de abertura criativa e motivadora sobre os eventos.
4. Lista todos os ${events.length} eventos, cada um numa linha com: emoji de desporto, nome, data abreviada, cidade, e distâncias se existirem
5. Termina com convite a participar
6. Última linha DEVE ser exatamente: "🔗 Mais info em athlifyr.com"
7. NÃO incluas hashtags (são adicionadas automaticamente)
8. Máximo 2200 caracteres (limite do Instagram)
9. NÃO inventes eventos — usa APENAS os dados fornecidos
10. NÃO uses a palavra "inscrições" ou "inscreve-te" — usa "participa", "junta-te"

FORMATO ESPERADO:
[Frase de abertura criativa com emoji]

[Lista de eventos, um por linha]

[Frase motivadora final]

🔗 Mais info em athlifyr.com`;

  try {
    const openai = new OpenAI();
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "És o social media manager da Athlifyr, uma plataforma de eventos desportivos em Portugal. Crias legendas de Instagram em Português Europeu que são energéticas, motivadoras e que destacam a variedade de eventos desportivos da semana.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    });

    const aiCaption = response.choices[0]?.message?.content?.trim();

    if (!aiCaption) {
      console.warn(
        "[caption-generator] Empty AI response, using static caption"
      );
      return generateWeeklyRoundupCaption(events);
    }

    return {
      title: `${emoji} ${label} da Semana — ${events.length} eventos`,
      caption: aiCaption,
      hashtags: ["athlifyr", ...sportTags, "eventos", "portugal"],
    };
  } catch (error) {
    console.error(
      "[caption-generator] OpenAI error, falling back to static:",
      error
    );
    return generateWeeklyRoundupCaption(events);
  }
}

// ─── Last Call Post ──────────────────────────────────────────────────────────

export function generateLastCallCaption(event: EventForCaption): {
  title: string;
  caption: string;
  hashtags: string[];
} {
  const emoji = sportEmoji(event.sportTypes);
  const dateStr = formatDate(event.startDate);

  let deadline = "";
  if (event.registrationDeadline) {
    const d =
      typeof event.registrationDeadline === "string"
        ? new Date(event.registrationDeadline)
        : event.registrationDeadline;
    deadline = d.toLocaleDateString("pt-PT", {
      day: "numeric",
      month: "long",
    });
  }

  let caption = `⏰ ÚLTIMAS VAGAS!\n\n`;
  caption += `${emoji} ${event.title}\n`;
  caption += `📅 ${dateStr}\n`;
  caption += `📍 ${event.city}, ${event.country}\n`;
  if (deadline) {
    caption += `\n⚠️ Últimos dias para participar — ${deadline}!\n`;
  }
  caption += `\n🔗 Mais info em athlifyr.com`;

  return {
    title: `⏰ Last Call — ${event.title}`,
    caption,
    hashtags: [...buildHashtags(event), "ultimasvagas", "inscricoes"],
  };
}

// ─── Results Post ────────────────────────────────────────────────────────────

export function generateResultsCaption(event: EventForCaption): {
  title: string;
  caption: string;
  hashtags: string[];
} {
  const emoji = sportEmoji(event.sportTypes);

  let caption = `🏆 Resultados disponíveis!\n\n`;
  caption += `${emoji} ${event.title}\n`;
  caption += `📍 ${event.city}, ${event.country}\n`;
  caption += `\n📊 Consulta os teus resultados em athlifyr.com`;

  return {
    title: `🏆 Resultados — ${event.title}`,
    caption,
    hashtags: [...buildHashtags(event), "resultados", "classificacao"],
  };
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

export function generateCaption(
  type: SocialPostType,
  events: EventForCaption[]
): { title: string; caption: string; hashtags: string[] } {
  switch (type) {
    case "EVENT":
      return generateEventCaption(events[0]);
    case "WEEKLY_ROUNDUP":
      return generateWeeklyRoundupCaption(events);
    case "LAST_CALL":
      return generateLastCallCaption(events[0]);
    case "RESULTS":
      return generateResultsCaption(events[0]);
    case "CUSTOM":
      return { title: "", caption: "", hashtags: ["athlifyr"] };
  }
}
