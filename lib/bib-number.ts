import { prisma } from "@/lib/prisma";

/**
 * Generate the next sequential bib number for an event.
 *
 * Bib numbers are unique per event (across all variants) and are assigned
 * as simple sequential integers starting at 1.
 *
 * @param eventId - The event ID to generate a bib number for.
 * @returns The next bib number as a string (e.g. "1", "2", "3").
 */
export async function generateNextBibNumber(eventId: string): Promise<string> {
  // Use a raw SQL MAX(CAST(...AS INTEGER)) to avoid lexicographic ordering bugs
  // ("9" > "10" as text). This is a single O(log n) query with the DB index.
  const result = await prisma.$queryRaw<[{ max_bib: number | null }]>`
    SELECT MAX(CAST("bibNumber" AS INTEGER)) AS max_bib
    FROM "Registration"
    WHERE "eventId" = ${eventId}
      AND "bibNumber" IS NOT NULL
      AND "bibNumber" ~ '^[0-9]+$'
  `;

  const maxBib = result[0]?.max_bib;

  if (maxBib === null || maxBib === undefined) {
    return "1";
  }

  return String(maxBib + 1);
}

/**
 * Assign bib numbers to multiple registrations in a single event.
 *
 * This is used when a team registration is confirmed — the leader and all
 * members each get their own sequential bib number.
 *
 * @param eventId - The event ID.
 * @param registrationIds - Array of registration IDs to assign bib numbers to.
 */
export async function assignBibNumbers(
  eventId: string,
  registrationIds: string[]
): Promise<void> {
  for (const registrationId of registrationIds) {
    const bibNumber = await generateNextBibNumber(eventId);
    await prisma.registration.update({
      where: { id: registrationId },
      data: { bibNumber },
    });
  }
}
