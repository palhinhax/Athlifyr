import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const userId = "cmke0q7wf0000vj83c47dcafu";

  // This week (Monday to now)
  const now = new Date();
  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const thisMonday = new Date(now);
  thisMonday.setDate(now.getDate() - diffToMonday);
  thisMonday.setHours(0, 0, 0, 0);

  const lastMonday = new Date(thisMonday);
  lastMonday.setDate(thisMonday.getDate() - 7);

  console.log("Today:", now.toISOString());
  console.log("This Monday:", thisMonday.toISOString());
  console.log("Last Monday:", lastMonday.toISOString());

  // This week count
  const thisWeek = await prisma.workoutLog.count({
    where: { userId, performedAt: { gte: thisMonday } },
  });
  console.log("\nThis week:", thisWeek);

  // Last week count (lastMonday <= x < thisMonday)
  const lastWeek = await prisma.workoutLog.count({
    where: { userId, performedAt: { gte: lastMonday, lt: thisMonday } },
  });
  console.log("Last week:", lastWeek);

  // Last week logs
  const lastWeekLogs = await prisma.workoutLog.findMany({
    where: { userId, performedAt: { gte: lastMonday, lt: thisMonday } },
    select: { performedAt: true, workout: { select: { name: true } } },
  });
  for (const l of lastWeekLogs) {
    console.log(` - ${l.performedAt.toISOString()} | ${l.workout.name}`);
  }

  // All time
  const total = await prisma.workoutLog.count({ where: { userId } });
  console.log("\nAll time:", total);

  await prisma.$disconnect();
}

main().catch(console.error);
