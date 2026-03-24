import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * Normalise a string for comparison: lowercase, remove accents/diacritics,
 * strip common suffixes like year, edition numbers, and extra whitespace.
 */
function normalise(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .replace(/\d{4}/g, "") // strip years (e.g. 2025, 2026)
    .replace(/\b\d+[ªºa-z]*\s*(ed(i[çc][ãa]o)?|edition)\b/gi, "") // strip edition markers
    .replace(/[^a-z0-9\s]/g, "") // keep only alphanumeric + spaces
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Compute normalised Levenshtein similarity between two strings (0–1).
 */
function similarity(a: string, b: string): number {
  if (a === b) return 1;
  const lenA = a.length;
  const lenB = b.length;
  if (lenA === 0 || lenB === 0) return 0;

  // Use two-row optimisation for memory efficiency
  let prev = Array.from({ length: lenB + 1 }, (_, i) => i);
  let curr = new Array<number>(lenB + 1);

  for (let i = 1; i <= lenA; i++) {
    curr[0] = i;
    for (let j = 1; j <= lenB; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }

  const distance = prev[lenB];
  return 1 - distance / Math.max(lenA, lenB);
}

interface DuplicateGroup {
  events: {
    id: string;
    title: string;
    slug: string;
    startDate: string;
    city: string;
    country: string;
    imageUrl: string | null;
    origin: string | null;
  }[];
  reason: string;
  score: number;
}

// GET — Find possible duplicate events
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await prisma.event.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        startDate: true,
        city: true,
        country: true,
        imageUrl: true,
        scrapingSource: true,
      },
      orderBy: { startDate: "desc" },
    });

    const NAME_THRESHOLD = 0.75;
    const DATE_RANGE_DAYS = 14;
    const duplicateMap = new Map<string, DuplicateGroup>();

    for (let i = 0; i < events.length; i++) {
      for (let j = i + 1; j < events.length; j++) {
        const a = events[i];
        const b = events[j];

        const normA = normalise(a.title);
        const normB = normalise(b.title);
        const nameSim = similarity(normA, normB);

        if (nameSim < NAME_THRESHOLD) continue;

        // Check date proximity
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        const daysDiff = Math.abs(
          (dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Build reason
        const reasons: string[] = [];
        let score = nameSim;

        if (nameSim >= 0.9) {
          reasons.push("near-identical-name");
          score += 0.2;
        } else {
          reasons.push("similar-name");
        }

        if (daysDiff <= DATE_RANGE_DAYS) {
          reasons.push("close-dates");
          score += 0.3;
        }

        if (
          a.city.toLowerCase() === b.city.toLowerCase() &&
          a.country.toLowerCase() === b.country.toLowerCase()
        ) {
          reasons.push("same-location");
          score += 0.2;
        }

        // Only flag if name similarity AND at least one other signal
        if (
          nameSim >= 0.9 ||
          (nameSim >= NAME_THRESHOLD && reasons.length >= 2)
        ) {
          const key = [a.id, b.id].sort().join("-");

          if (!duplicateMap.has(key)) {
            duplicateMap.set(key, {
              events: [
                {
                  id: a.id,
                  title: a.title,
                  slug: a.slug,
                  startDate: a.startDate.toISOString(),
                  city: a.city,
                  country: a.country,
                  imageUrl: a.imageUrl,
                  origin: a.scrapingSource,
                },
                {
                  id: b.id,
                  title: b.title,
                  slug: b.slug,
                  startDate: b.startDate.toISOString(),
                  city: b.city,
                  country: b.country,
                  imageUrl: b.imageUrl,
                  origin: b.scrapingSource,
                },
              ],
              reason: reasons.join(", "),
              score: Math.min(score, 1.5),
            });
          }
        }
      }
    }

    const groups = Array.from(duplicateMap.values()).sort(
      (a, b) => b.score - a.score
    );

    return NextResponse.json({
      groups,
      total: groups.length,
      eventsAnalysed: events.length,
    });
  } catch (error) {
    console.error("Error finding duplicate events:", error);
    return NextResponse.json(
      { error: "Failed to find duplicates" },
      { status: 500 }
    );
  }
}
