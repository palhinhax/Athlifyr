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
  // Find the highest numeric bib number currently assigned in this event.
  const maxBib = await prisma.registration.findFirst({
    where: {
      eventId,
      bibNumber: { not: null },
    },
    orderBy: { bibNumber: "desc" },
    select: { bibNumber: true },
  });

  if (!maxBib?.bibNumber) {
    return "1";
  }

  const parsed = parseInt(maxBib.bibNumber, 10);
  if (isNaN(parsed)) {
    // If existing bib numbers are non-numeric, fall back to counting
    const count = await prisma.registration.count({
      where: {
        eventId,
        bibNumber: { not: null },
      },
    });
    return String(count + 1);
  }

  return String(parsed + 1);
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
