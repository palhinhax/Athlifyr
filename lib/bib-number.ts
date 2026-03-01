import { prisma } from "@/lib/prisma";

/**
 * Generate the next sequential bib number for an event.
 *
 * Uses MAX(CAST(bibNumber AS INTEGER)) to avoid lexicographic ordering bugs
 * ("9" > "10" as text).
 *
 * ⚠️  NOT safe for concurrent use on its own — always call this inside a
 *    Prisma interactive transaction that holds a row-level lock (see
 *    `assignBibNumbers`).
 *
 * @param eventId - The event ID to generate a bib number for.
 * @param tx      - An active Prisma transaction client.
 */
async function generateNextBibNumberInTx(
  eventId: string,
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]
): Promise<string> {
  const result = await tx.$queryRaw<[{ max_bib: number | null }]>`
    SELECT MAX(CAST("bibNumber" AS INTEGER)) AS max_bib
    FROM "Registration"
    WHERE "eventId" = ${eventId}
      AND "bibNumber" IS NOT NULL
      AND "bibNumber" ~ '^[0-9]+$'
  `;

  const maxBib = result[0]?.max_bib;
  if (maxBib === null || maxBib === undefined) return "1";
  return String(maxBib + 1);
}

/**
 * Assign bib numbers to multiple registrations in a single event.
 *
 * Runs inside a serializable transaction with an advisory lock keyed on the
 * eventId so that concurrent calls (e.g. two Stripe webhooks arriving at the
 * same time) are serialized at the DB level and never produce duplicate bibs.
 *
 * @param eventId         - The event ID.
 * @param registrationIds - Array of registration IDs to assign bib numbers to.
 */
export async function assignBibNumbers(
  eventId: string,
  registrationIds: string[]
): Promise<void> {
  if (registrationIds.length === 0) return;

  await prisma.$transaction(
    async (tx) => {
      // Advisory lock: pg_advisory_xact_lock takes a 64-bit integer.
      // We derive a stable integer from the eventId using hashtext() so that
      // concurrent transactions for the *same* event queue up, while
      // transactions for *different* events run in parallel.
      await tx.$executeRaw`
        SELECT pg_advisory_xact_lock(hashtext(${eventId}))
      `;

      for (const registrationId of registrationIds) {
        const bibNumber = await generateNextBibNumberInTx(eventId, tx);
        await tx.registration.update({
          where: { id: registrationId },
          data: { bibNumber },
        });
      }
    },
    {
      // SERIALIZABLE ensures the MAX read and the UPDATE are atomic as a unit.
      // The advisory lock above is the primary guard; SERIALIZABLE is a
      // belt-and-suspenders defence against unexpected anomalies.
      isolationLevel: "Serializable",
      timeout: 10_000,
    }
  );
}
