import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding Janeiro 2026 Trail Events...\n");

  // 1. Trail Serra D'Aire - 17 Jan 2026
  const trailSerraDAire = await prisma.event.upsert({
    where: { slug: "trail-serra-daire-2026" },
    update: {},
    create: {
      title: "Trail Serra D'Aire",
      slug: "trail-serra-daire-2026",
      description: `Trail Serra D'Aire - 17 de janeiro de 2026

Prova de trail running na Serra de Aire, em Ourém.

🏃 DISTÂNCIAS DISPONÍVEIS:
• Trail Longo - 38 km
• Trail Médio - 18 km
• Trail Curto - 12 km
• Caminhada - 12 km

📍 LOCAL: Ourém

Para mais informações e inscrições, consulte o site oficial do evento.`,
      startDate: new Date("2026-01-17"),
      city: "Ourém",
      country: "Portugal",
      sportTypes: ["TRAIL"],
      externalUrl: "https://stopandgo.net/events/trail-serra-daire-2026",
      imageUrl: null,
      variants: {
        create: [
          {
            name: "Trail Longo",
            distanceKm: 38,
            startDate: new Date("2026-01-17"),
            description: "Trail Longo - 38 km pela Serra de Aire",
          },
          {
            name: "Trail Médio",
            distanceKm: 18,
            startDate: new Date("2026-01-17"),
            description: "Trail Médio - 18 km pela Serra de Aire",
          },
          {
            name: "Trail Curto",
            distanceKm: 12,
            startDate: new Date("2026-01-17"),
            description: "Trail Curto - 12 km pela Serra de Aire",
          },
          {
            name: "Caminhada",
            distanceKm: 12,
            startDate: new Date("2026-01-17"),
            description: "Caminhada - 12 km (não competitiva)",
          },
        ],
      },
    },
  });

  console.log(`✅ Created: ${trailSerraDAire.title}`);
  console.log(
    `   📍 ${trailSerraDAire.city} - ${trailSerraDAire.startDate.toLocaleDateString("pt-PT")}`
  );

  // 2. Trail da Filigrana - 17 Jan 2026
  const trailFiligrana = await prisma.event.upsert({
    where: { slug: "trail-da-filigrana-2026" },
    update: {},
    create: {
      title: "Trail da Filigrana",
      slug: "trail-da-filigrana-2026",
      description: `Trail da Filigrana - 17 de janeiro de 2026

Prova de trail running em Gondomar.

🏃 DISTÂNCIAS DISPONÍVEIS:
• Trail Longo - 22 km
• Trail Curto - 12 km
• Caminhada

📍 LOCAL: Gondomar

Para mais informações e inscrições, consulte o site oficial do evento.`,
      startDate: new Date("2026-01-17"),
      city: "Gondomar",
      country: "Portugal",
      sportTypes: ["TRAIL"],
      externalUrl: "https://lap2go.com/pt/event/trail-da-filigrana-2026",
      imageUrl: null,
      variants: {
        create: [
          {
            name: "Trail Longo",
            distanceKm: 22,
            startDate: new Date("2026-01-17"),
            description: "Trail Longo - 22 km",
          },
          {
            name: "Trail Curto",
            distanceKm: 12,
            startDate: new Date("2026-01-17"),
            description: "Trail Curto - 12 km",
          },
          {
            name: "Caminhada",
            distanceKm: null,
            startDate: new Date("2026-01-17"),
            description: "Caminhada (não competitiva)",
          },
        ],
      },
    },
  });

  console.log(`✅ Created: ${trailFiligrana.title}`);
  console.log(
    `   📍 ${trailFiligrana.city} - ${trailFiligrana.startDate.toLocaleDateString("pt-PT")}`
  );

  // 3. Lousa Mountain Trail - 18 Jan 2026
  const lousaMountainTrail = await prisma.event.upsert({
    where: { slug: "lousa-mountain-trail-2026" },
    update: {},
    create: {
      title: "Lousa Mountain Trail",
      slug: "lousa-mountain-trail-2026",
      description: `Lousa Mountain Trail - 18 de janeiro de 2026

Prova de trail running em Lousa, Loures.

🏃 DISTÂNCIAS DISPONÍVEIS:
• Trail Longo - 23 km
• Trail Curto - 12 km
• Caminhada - 8 km

📍 LOCAL: Lousa, Loures

Para mais informações e inscrições, consulte o site oficial do evento.`,
      startDate: new Date("2026-01-18"),
      city: "Lousa, Loures",
      country: "Portugal",
      sportTypes: ["TRAIL"],
      externalUrl:
        "https://www.trilhoperdido.com/evento/lousa-mountain-trail-2026",
      imageUrl: null,
      variants: {
        create: [
          {
            name: "Trail Longo",
            distanceKm: 23,
            startDate: new Date("2026-01-18"),
            description: "Trail Longo - 23 km",
          },
          {
            name: "Trail Curto",
            distanceKm: 12,
            startDate: new Date("2026-01-18"),
            description: "Trail Curto - 12 km",
          },
          {
            name: "Caminhada",
            distanceKm: 8,
            startDate: new Date("2026-01-18"),
            description: "Caminhada - 8 km (não competitiva)",
          },
        ],
      },
    },
  });

  console.log(`✅ Created: ${lousaMountainTrail.title}`);
  console.log(
    `   📍 ${lousaMountainTrail.city} - ${lousaMountainTrail.startDate.toLocaleDateString("pt-PT")}`
  );

  console.log("\n🏔️ Janeiro 2026 Trail Events seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
