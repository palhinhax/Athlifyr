/**
 * Athli AI — Giveaway search
 */

import { prisma } from "@/lib/prisma";
import type { Language } from "@prisma/client";

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
