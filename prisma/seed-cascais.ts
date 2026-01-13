import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Montepio Meia Maratona de Cascais 2026...");

  // Check if event already exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "montepio-meia-maratona-cascais-2026" },
  });

  if (existingEvent) {
    console.log("⚠️ Event already exists, updating...");
    // Delete existing variants
    await prisma.eventVariant.deleteMany({
      where: { eventId: existingEvent.id },
    });
    // Delete the event
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  // Also check for the old slug
  const oldEvent = await prisma.event.findUnique({
    where: { slug: "meia-maratona-cascais-2026" },
  });

  if (oldEvent) {
    console.log("⚠️ Old event found, removing...");
    await prisma.eventVariant.deleteMany({
      where: { eventId: oldEvent.id },
    });
    await prisma.event.delete({
      where: { id: oldEvent.id },
    });
  }

  // Create the event
  const event = await prisma.event.create({
    data: {
      title: "Montepio Meia Maratona de Cascais",
      slug: "montepio-meia-maratona-cascais-2026",
      description: `A Montepio Meia Maratona de Cascais, powered by Montepio Associação Mutualista, organizada pela HMS Sports, em parceria com a Câmara Municipal de Cascais e o CCD Cascais, regressa à Baía de Cascais na sua 10ª edição.

Correr na companhia do Atlântico! Desfrute de um percurso desafiante e com uma vista privilegiada para o Atlântico.

O evento inclui a Meia Maratona (21 km), os 10 km, os 5 km e a Corrida das Crianças.

📅 31 Janeiro: Corrida das Crianças (16h00)
📅 1 Fevereiro: 21 km (9h00), 10 km (8h30), 5 km (9h20)

A Baía de Cascais é o palco central da iniciativa, com partida e chegada na Marina de Cascais.`,
      sportType: SportType.RUNNING,
      startDate: new Date("2026-01-31T16:00:00"),
      endDate: new Date("2026-02-01T12:00:00"),
      city: "Cascais",
      country: "Portugal",
      externalUrl: "https://meiamaratonadecascais.pt/",
      isFeatured: true,
      variants: {
        create: [
          {
            name: "Meia Maratona",
            distanceKm: 21,
            description:
              "Desfrute de um percurso desafiante e com uma vista privilegiada para o Atlântico. Partida às 9h00.",
          },
          {
            name: "10 Km de Cascais",
            distanceKm: 10,
            description:
              "Um desafio que começa na Baía de Cascais e termina na Marina de Cascais. Partida às 8h30.",
          },
          {
            name: "5 Km de Cascais",
            distanceKm: 5,
            description:
              "Prova ideal para a família que este ano termina na Marina de Cascais. Partida às 9h20.",
          },
          {
            name: "Corrida das Crianças",
            distanceKm: 1,
            description:
              "Um desafio para os mais novos na Baía de Cascais. 31 Janeiro às 16h00.",
          },
        ],
      },
    },
    include: {
      variants: true,
    },
  });

  console.log(`✅ Created event: ${event.title}`);
  console.log(`   📍 ${event.city}, ${event.country}`);
  console.log(
    `   📅 ${event.startDate.toLocaleDateString("pt-PT")} - ${event.endDate?.toLocaleDateString("pt-PT")}`
  );
  console.log(`   🏃 Variants:`);
  for (const variant of event.variants) {
    console.log(`      - ${variant.name}: ${variant.distanceKm} km`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
