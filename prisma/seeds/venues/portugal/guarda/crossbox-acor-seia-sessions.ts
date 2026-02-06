/**
 * Seed: CrossBox Açor Seia - Weekly Sessions
 * Adds recurring weekly sessions/classes schedule
 */

import { PrismaClient, SessionType } from "@prisma/client";

const prisma = new PrismaClient();

// Session schedule data for Seia
const weeklySchedule: Record<
  number,
  Array<{ startTime: string; endTime: string; title: string }>
> = {
  // Monday - 2ª Feira
  1: [
    { startTime: "07:00", endTime: "08:00", title: "WOD" },
    { startTime: "09:00", endTime: "10:00", title: "WOD" },
    { startTime: "10:00", endTime: "11:00", title: "Open Box" },
    { startTime: "16:00", endTime: "17:30", title: "Open Box" },
    { startTime: "17:30", endTime: "18:30", title: "WOD" },
    { startTime: "17:30", endTime: "18:30", title: "Gainz" },
    { startTime: "18:30", endTime: "19:30", title: "WOD" },
    { startTime: "19:30", endTime: "20:30", title: "WOD" },
    { startTime: "20:30", endTime: "21:30", title: "WOD" },
  ],
  // Tuesday - 3ª Feira
  2: [
    { startTime: "07:00", endTime: "08:00", title: "WOD" },
    { startTime: "09:00", endTime: "10:00", title: "HYROX" },
    { startTime: "10:00", endTime: "12:00", title: "Open Box" },
    { startTime: "12:30", endTime: "13:30", title: "WOD" },
    { startTime: "16:00", endTime: "17:30", title: "Open Box" },
    { startTime: "17:30", endTime: "18:30", title: "WOD" },
    { startTime: "18:30", endTime: "19:30", title: "WOD" },
    { startTime: "18:30", endTime: "19:30", title: "Step" },
    { startTime: "19:30", endTime: "20:30", title: "WOD" },
    { startTime: "20:30", endTime: "21:30", title: "WOD" },
  ],
  // Wednesday - 4ª Feira
  3: [
    { startTime: "07:00", endTime: "08:00", title: "WOD" },
    { startTime: "09:00", endTime: "10:00", title: "WOD" },
    { startTime: "10:00", endTime: "12:00", title: "Open Box" },
    { startTime: "16:00", endTime: "17:00", title: "CrossTeens" },
    { startTime: "16:00", endTime: "17:30", title: "Open Box" },
    { startTime: "17:30", endTime: "18:30", title: "Gainz" },
    { startTime: "17:30", endTime: "18:30", title: "WOD" },
    { startTime: "18:30", endTime: "19:30", title: "WOD" },
    { startTime: "19:30", endTime: "20:30", title: "WOD" },
    { startTime: "20:30", endTime: "21:30", title: "WOD" },
  ],
  // Thursday - 5ª Feira
  4: [
    { startTime: "07:00", endTime: "08:00", title: "WOD" },
    { startTime: "09:00", endTime: "10:00", title: "HYROX" },
    { startTime: "10:00", endTime: "12:00", title: "Open Box" },
    { startTime: "12:30", endTime: "13:30", title: "WOD" },
    { startTime: "16:00", endTime: "17:30", title: "Open Box" },
    { startTime: "17:30", endTime: "18:30", title: "HYROX" },
    { startTime: "17:30", endTime: "18:30", title: "WOD" },
    { startTime: "18:30", endTime: "19:30", title: "HYROX" },
    { startTime: "18:30", endTime: "19:30", title: "WOD" },
    { startTime: "19:30", endTime: "20:30", title: "WOD" },
  ],
  // Friday - 6ª Feira
  5: [
    { startTime: "07:00", endTime: "08:00", title: "WOD" },
    { startTime: "09:00", endTime: "10:00", title: "WOD" },
    { startTime: "10:00", endTime: "12:00", title: "Open Box" },
    { startTime: "16:00", endTime: "17:30", title: "Open Box" },
    { startTime: "17:30", endTime: "18:30", title: "Gainz" },
    { startTime: "17:30", endTime: "18:30", title: "WOD" },
    { startTime: "18:30", endTime: "19:30", title: "WOD" },
    { startTime: "19:30", endTime: "20:30", title: "WOD" },
    { startTime: "20:30", endTime: "21:30", title: "WOD" },
  ],
  // Saturday - Sábado
  6: [{ startTime: "09:30", endTime: "10:30", title: "WOD" }],
};

const dayNames: Record<number, string> = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
};

async function main() {
  console.log("📅 Adding recurring sessions to CrossBox Açor - Seia...\n");

  // Find the venue
  const venue = await prisma.venue.findUnique({
    where: { slug: "crossbox-acor-seia" },
  });

  if (!venue) {
    console.error("❌ Venue 'crossbox-acor-seia' not found.");
    console.error("   Please run the venue seed first:");
    console.error(
      "   npx ts-node prisma/seeds/venues/portugal/guarda/crossbox-acor-seia.ts"
    );
    return;
  }

  console.log(`✅ Found venue: ${venue.name} (${venue.id})\n`);

  // Delete existing recurring sessions for this venue (to avoid duplicates)
  const deleted = await prisma.venueRecurringSession.deleteMany({
    where: { venueId: venue.id },
  });

  if (deleted.count > 0) {
    console.log(`🗑️  Deleted ${deleted.count} existing recurring sessions\n`);
  }

  // Create recurring sessions for each day
  let totalCreated = 0;

  for (const [dayOfWeek, sessions] of Object.entries(weeklySchedule)) {
    const day = parseInt(dayOfWeek);
    console.log(`📆 Creating sessions for ${dayNames[day]}...`);

    for (const session of sessions) {
      await prisma.venueRecurringSession.create({
        data: {
          venueId: venue.id,
          type: SessionType.CLASS,
          title: session.title,
          dayOfWeek: day,
          startTime: session.startTime,
          endTime: session.endTime,
          isActive: true,
          bookingAdvanceDays: 7,
          cancellationDeadlineMinutes: 60,
        },
      });
      totalCreated++;
    }

    console.log(
      `   ✅ Created ${sessions.length} sessions for ${dayNames[day]}`
    );
  }

  console.log(`\n🎉 Successfully created ${totalCreated} recurring sessions!`);

  // Now generate actual VenueSessions for the next 12 weeks
  console.log("\n📅 Generating actual sessions for the next 12 weeks...");

  // First, delete existing generated sessions for this venue
  const deletedSessions = await prisma.venueSession.deleteMany({
    where: { venueId: venue.id },
  });

  if (deletedSessions.count > 0) {
    console.log(`   🗑️  Deleted ${deletedSessions.count} existing sessions`);
  }

  // Get all recurring sessions
  const recurringSessions = await prisma.venueRecurringSession.findMany({
    where: { venueId: venue.id, isActive: true },
  });

  // Generate sessions for the next 12 weeks
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const sessionsToCreate: Array<{
    venueId: string;
    recurringSessionId: string;
    type: SessionType;
    title: string;
    startsAt: Date;
    endsAt: Date;
  }> = [];

  for (let week = 0; week < 12; week++) {
    for (const recurring of recurringSessions) {
      // Calculate the date for this session
      const sessionDate = new Date(today);
      sessionDate.setDate(
        today.getDate() +
          week * 7 +
          ((recurring.dayOfWeek - today.getDay() + 7) % 7)
      );

      // Skip if the date is in the past
      if (sessionDate < today) {
        sessionDate.setDate(sessionDate.getDate() + 7);
      }

      // Parse start and end times
      const [startHour, startMin] = recurring.startTime.split(":").map(Number);
      const [endHour, endMin] = recurring.endTime.split(":").map(Number);

      const startsAt = new Date(sessionDate);
      startsAt.setHours(startHour, startMin, 0, 0);

      const endsAt = new Date(sessionDate);
      endsAt.setHours(endHour, endMin, 0, 0);

      sessionsToCreate.push({
        venueId: venue.id,
        recurringSessionId: recurring.id,
        type: recurring.type,
        title: recurring.title,
        startsAt,
        endsAt,
      });
    }
  }

  // Bulk create all sessions
  await prisma.venueSession.createMany({
    data: sessionsToCreate,
  });

  console.log(`   ✅ Generated ${sessionsToCreate.length} actual sessions`);
  console.log("\n🎉 Sessions are now visible in the venue's calendar!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
