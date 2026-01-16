import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const event = await prisma.event.findFirst({
    where: {
      slug: {
        contains: "sevilha",
      },
    },
    select: {
      slug: true,
      title: true,
      stravaRouteEmbed: true,
    },
  });

  console.log("Maratona de Sevilha:");
  console.log(JSON.stringify(event, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
