/**
 * Seed: CrossBox Açor - Arganil - Weekly Sessions
 * Adds recurring weekly sessions/classes schedule
 */

import { PrismaClient, SessionType } from "@prisma/client";

const prisma = new PrismaClient();

// Session schedule data for Arganil
const weeklySchedule = {
  // Monday - 2ª Feira
  1: [
    { startTime: "07:00", endTime: "08:00", title: "WOD" },
    { startTime: "07:00", endTime: "08:00", title: "Open Gym" },
    { startTime: "08:00", endTime: "09:00", title: "Open Gym" },
    { startTime: "09:00", endTime: "10:00", title: "WOD" },
    { startTime: "09:00", endTime: "10:00", title: "Open Gym" },
    { startTime: "10:00", endTime: "11:00", title: "Open Gym" },
    { startTime: "10:30", endTime: "12:30", title: "Open Box" },
    { startTime: "11:00", endTime: "12:00", title: "Open Gym" },
    { startTime: "12:00", endTime: "13:00", title: "Open Gym" },
    { startTime: "12:30", endTime: "13:30", title: "WOD" },
    { startTime: "16:00", endTime: "17:30", title: "Open Box" },
    { startTime: "16:00", endTime: "17:00", title: "Open Gym" },
    { startTime: "17:30", endTime: "18:30", title: "WOD" },
    { startTime: "17:30", endTime: "18:30", title: "Gainz" },
    { startTime: "18:30", endTime: "19:30", title: "WOD" },
    { startTime: "18:30", endTime: "19:30", title: "Step" },
    { startTime: "19:30", endTime: "20:30", title: "WOD" },
    { startTime: "19:30", endTime: "20:30", title: "Step" },
    { startTime: "19:30", endTime: "20:30", title: "Open Gym" },
    { startTime: "20:30", endTime: "21:30", title: "WOD" },
    { startTime: "20:30", endTime: "21:30", title: "Open Gym" },
  ],
  // Tuesday - 3ª Feira
  2: [
    { startTime: "07:00", endTime: "08:00", title: "WOD" },
    { startTime: "07:00", endTime: "08:00", title: "Open Gym" },
    { startTime: "08:00", endTime: "09:00", title: "Open Gym" },
    { startTime: "09:00", endTime: "10:00", title: "HYROX" },
    { startTime: "09:00", endTime: "10:00", title: "Open Gym" },
    { startTime: "10:00", endTime: "11:00", title: "Open Gym" },
    { startTime: "10:30", endTime: "12:30", title: "Open Box" },
    { startTime: "11:00", endTime: "12:00", title: "Open Gym" },
    { startTime: "16:00", endTime: "17:30", title: "Open Box" },
    { startTime: "16:00", endTime: "17:00", title: "Open Gym" },
    { startTime: "17:00", endTime: "18:00", title: "WOD" },
    { startTime: "17:50", endTime: "18:35", title: "HYROX" },
    { startTime: "18:00", endTime: "19:00", title: "WOD" },
    { startTime: "18:35", endTime: "19:15", title: "HYROX" },
    { startTime: "19:00", endTime: "20:00", title: "WOD" },
    { startTime: "19:00", endTime: "20:00", title: "Raízes" },
    { startTime: "19:30", endTime: "20:30", title: "Step" },
    { startTime: "19:30", endTime: "20:30", title: "Open Gym" },
    { startTime: "20:15", endTime: "21:00", title: "HYROX" },
    { startTime: "20:30", endTime: "21:30", title: "Open Gym" },
  ],
  // Wednesday - 4ª Feira
  3: [
    { startTime: "07:00", endTime: "08:00", title: "WOD" },
    { startTime: "07:00", endTime: "08:00", title: "Open Gym" },
    { startTime: "08:00", endTime: "09:00", title: "Open Gym" },
    { startTime: "09:00", endTime: "10:00", title: "WOD" },
    { startTime: "10:30", endTime: "12:30", title: "Open Box" },
    { startTime: "10:30", endTime: "11:30", title: "Open Gym" },
    { startTime: "11:30", endTime: "12:30", title: "Open Gym" },
    { startTime: "12:30", endTime: "13:30", title: "WOD" },
    { startTime: "12:30", endTime: "13:30", title: "Open Gym" },
    { startTime: "16:00", endTime: "17:30", title: "Open Box" },
    { startTime: "16:00", endTime: "17:00", title: "CrossTeens" },
    { startTime: "16:00", endTime: "17:00", title: "Open Gym" },
    { startTime: "17:30", endTime: "18:30", title: "WOD" },
    { startTime: "17:30", endTime: "18:30", title: "Gainz" },
    { startTime: "18:30", endTime: "19:30", title: "WOD" },
    { startTime: "18:30", endTime: "19:30", title: "Step" },
    { startTime: "18:30", endTime: "19:30", title: "Open Gym" },
    { startTime: "19:30", endTime: "20:30", title: "WOD" },
    { startTime: "19:30", endTime: "20:30", title: "Open Gym" },
    { startTime: "20:30", endTime: "21:30", title: "WOD" },
    { startTime: "20:30", endTime: "21:30", title: "Open Gym" },
  ],
  // Thursday - 5ª Feira
  4: [
    { startTime: "07:00", endTime: "08:00", title: "WOD" },
    { startTime: "07:00", endTime: "08:00", title: "Open Gym" },
    { startTime: "08:00", endTime: "09:00", title: "Open Gym" },
    { startTime: "09:00", endTime: "10:00", title: "HYROX" },
    { startTime: "09:00", endTime: "10:00", title: "Open Gym" },
    { startTime: "10:00", endTime: "11:00", title: "Open Gym" },
    { startTime: "10:30", endTime: "12:30", title: "Open Box" },
    { startTime: "11:00", endTime: "12:00", title: "Open Gym" },
    { startTime: "16:00", endTime: "17:30", title: "Open Box" },
    { startTime: "16:00", endTime: "17:00", title: "Open Gym" },
    { startTime: "17:00", endTime: "18:00", title: "WOD" },
    { startTime: "17:50", endTime: "18:35", title: "HYROX" },
    { startTime: "18:00", endTime: "19:00", title: "WOD" },
    { startTime: "18:35", endTime: "19:15", title: "HYROX" },
    { startTime: "19:00", endTime: "20:00", title: "WOD" },
    { startTime: "19:00", endTime: "20:00", title: "Raízes" },
    { startTime: "19:30", endTime: "20:30", title: "Open Gym" },
    { startTime: "20:15", endTime: "21:00", title: "HYROX" },
    { startTime: "20:30", endTime: "21:30", title: "Open Gym" },
  ],
  // Friday - 6ª Feira
  5: [
    { startTime: "07:00", endTime: "08:00", title: "WOD" },
    { startTime: "07:00", endTime: "08:00", title: "Open Gym" },
    { startTime: "08:00", endTime: "09:00", title: "Open Gym" },
    { startTime: "09:00", endTime: "10:00", title: "WOD" },
    { startTime: "09:00", endTime: "10:00", title: "Open Gym" },
    { startTime: "10:30", endTime: "12:30", title: "Open Box" },
    { startTime: "10:30", endTime: "11:30", title: "Open Gym" },
    { startTime: "11:30", endTime: "12:30", title: "Open Gym" },
    { startTime: "12:30", endTime: "13:30", title: "WOD" },
    { startTime: "12:30", endTime: "13:30", title: "Open Gym" },
    { startTime: "16:00", endTime: "17:30", title: "Open Box" },
    { startTime: "16:00", endTime: "17:00", title: "Open Gym" },
    { startTime: "17:30", endTime: "18:30", title: "WOD" },
    { startTime: "17:30", endTime: "18:30", title: "CrossLeg" },
    { startTime: "18:00", endTime: "19:00", title: "Open Gym" },
    { startTime: "18:30", endTime: "19:30", title: "WOD" },
    { startTime: "19:30", endTime: "20:30", title: "WOD" },
    { startTime: "20:00", endTime: "21:00", title: "Open Gym" },
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
  console.log("📅 Adding recurring sessions to CrossBox Açor - Arganil...\n");

  // Find the venue
  const venue = await prisma.venue.findUnique({
    where: { slug: "crossbox-acor-arganil" },
  });

  if (!venue) {
    console.error("❌ Venue 'crossbox-acor-arganil' not found.");
    console.error("   Please run the venue seed first:");
    console.error(
      "   npx tsx prisma/seeds/venues/portugal/coimbra/crossbox-acor-arganil.ts"
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

  const now = new Date();
  const GENERATION_WEEKS = 12;

  // Get all recurring sessions we just created
  const recurringSessions = await prisma.venueRecurringSession.findMany({
    where: { venueId: venue.id, isActive: true },
  });

  // Prepare all sessions in memory first
  const sessionsToCreate: {
    venueId: string;
    type: SessionType;
    title: string;
    description: string | null;
    startsAt: Date;
    endsAt: Date;
    capacity: number | null;
    coachId: string | null;
    serviceId: string | null;
    tags: string[];
    recurringSessionId: string;
    bookingAdvanceDays: number;
    cancellationDeadlineMinutes: number;
  }[] = [];

  const generationLimit = new Date(now);
  generationLimit.setDate(generationLimit.getDate() + GENERATION_WEEKS * 7);

  for (const recurring of recurringSessions) {
    // Find the first occurrence of the day of week from now
    const currentDate = new Date(now);
    while (currentDate.getDay() !== recurring.dayOfWeek) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Generate sessions for GENERATION_WEEKS weeks
    while (currentDate < generationLimit) {
      // Parse start and end times
      const [startHour, startMin] = recurring.startTime.split(":").map(Number);
      const [endHour, endMin] = recurring.endTime.split(":").map(Number);

      const startsAt = new Date(currentDate);
      startsAt.setHours(startHour, startMin, 0, 0);

      const endsAt = new Date(currentDate);
      endsAt.setHours(endHour, endMin, 0, 0);

      sessionsToCreate.push({
        venueId: venue.id,
        type: recurring.type,
        title: recurring.title,
        description: recurring.description,
        startsAt: startsAt,
        endsAt: endsAt,
        capacity: recurring.capacity,
        coachId: recurring.coachId,
        serviceId: recurring.serviceId,
        tags: recurring.tags,
        recurringSessionId: recurring.id,
        bookingAdvanceDays: recurring.bookingAdvanceDays,
        cancellationDeadlineMinutes: recurring.cancellationDeadlineMinutes,
      });

      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }

    // Update generatedUntil
    await prisma.venueRecurringSession.update({
      where: { id: recurring.id },
      data: { generatedUntil: generationLimit },
    });
  }

  // Bulk create all sessions at once
  const created = await prisma.venueSession.createMany({
    data: sessionsToCreate,
  });

  console.log(`   ✅ Generated ${created.count} actual sessions`);
  console.log("\n🎉 Sessions are now visible in the venue's calendar!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding sessions:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
