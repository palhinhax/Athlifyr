import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Montepio Meia Maratona de Cascais 2026...");

  // Check if event already exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "montepio-meia-maratona-cascais-2026" },
  });

  if (existingEvent) {
    console.log("⚠️ Event already exists, deleting...");
    await prisma.pricingPhase.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventVariant.deleteMany({
      where: { eventId: existingEvent.id },
    });
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
    await prisma.pricingPhase.deleteMany({
      where: { eventId: oldEvent.id },
    });
    await prisma.eventVariant.deleteMany({
      where: { eventId: oldEvent.id },
    });
    await prisma.event.delete({
      where: { id: oldEvent.id },
    });
  }

  // Create the event with all variants and pricing phases
  const event = await prisma.event.create({
    data: {
      title: "Montepio Meia Maratona de Cascais",
      slug: "montepio-meia-maratona-cascais-2026",
      description: `**10ª Edição - 31 Janeiro e 1 Fevereiro 2026**

A Montepio Meia Maratona de Cascais, powered by Montepio Associação Mutualista, organizada pela HMS Sports, em parceria com a Câmara Municipal de Cascais e o CCD Cascais, regressa à Baía de Cascais.

🌊 **Correr na companhia do Atlântico**

Desfrute de percursos desafiantes com uma vista privilegiada para o Atlântico. A Baía de Cascais é o palco central da iniciativa.

📅 **Programa:**
- **31 Janeiro, 16h00:** Corrida das Crianças (escalões Bambis, Benjamins A/B e Infantis)
- **1 Fevereiro, 8h30:** 10 Km de Cascais (Elite, Sub 45, Sub 50, Sub 60, +60)
- **1 Fevereiro, 9h00:** Meia Maratona 21,1 km (Elite, Sub 1h25, Sub 1h40, Sub 1h50, +1h50)
- **1 Fevereiro, 9h20:** 5 Km de Cascais

🏅 **Destaque:**
- Percursos certificados e cronometrados (21,1 km e 10 km)
- Abastecimentos líquidos e sólidos ao longo dos percursos
- Kit do atleta inclui long-sleeve oficial
- Kit 2 disponível: long-sleeve + corta-vento + meias oficiais
- Medalhas para todos os finishers (21,1 km, 10 km e 5 km)
- Prémios para os 3 primeiros classificados M/F (21,1 km e 10 km)
- Apoio médico durante todo o percurso
- Bengaleiro e Bike Park disponíveis

📍 **Partidas e Chegadas:**
- 21,1 km: Partida e chegada no Passeio Dom Luís I, Baía de Cascais
- 10 km: Partida na Baía de Cascais, chegada na Marina de Cascais
- 5 km: Partida na Baía de Cascais, chegada na Marina de Cascais
- Corrida das Crianças: Partida e chegada no Passeio Dom Luís I

⏱️ **Limites de tempo:**
- 21,1 km: 3 horas | Km 10 deve ser atingido até às 10h45
- 10 km: 2 horas
- 5 km: 1 hora e 30 minutos

🎁 **Entrega de Kits:**
Nova School of Business and Economics – Carcavelos (Atrium Hovione)
- 29 Janeiro: 10h00 - 18h00
- 30 Janeiro: 10h00 - 18h00  
- 31 Janeiro: 10h00 - 18h00

⚠️ **Nota:** A data inicial (7 e 8 de fevereiro) foi antecipada devido a uma possível segunda volta das Eleições Presidenciais.

🏨 **Hotel Oficial:** Onyria Marinha Cascais, Vignette Collection by IHG
📞 **Apoio:** +351 214 574 405 | +351 926 695 128 | suporte@hmssports.pt`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-01-31T16:00:00Z"),
      endDate: new Date("2026-02-01T12:00:00Z"),
      registrationDeadline: new Date("2026-01-31T23:59:59Z"),
      city: "Cascais",
      country: "Portugal",
      externalUrl: "https://meiamaratonadecascais.pt/",
      isFeatured: true,
      variants: {
        create: [
          // MEIA MARATONA 21,1 KM
          {
            name: "Meia Maratona 21,1 km",
            distanceKm: 21.1,
            startDate: new Date("2026-02-01T09:00:00Z"),
            startTime: "09:00",
            elevationGainM: null,
            maxParticipants: 5000,
            cutoffTimeHours: 3.0,
            description: `Meia maratona certificada de 21,1 km pela Baía de Cascais e Estrada do Guincho.

**Partida:** 9h00 - Passeio Dom Luís I
**Tempo limite:** 3 horas
**Idade mínima:** 20 anos

Percurso cronometrado com abastecimentos líquidos e sólidos. Prémios para top 3 M/F. Inclui medalha de finisher.`,
            pricingPhases: {
              create: [
                {
                  name: "Early Bird Kit 1",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2025-12-01T23:59:59Z"),
                  price: 18.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Fase 2 Kit 1",
                  startDate: new Date("2025-12-02T00:00:00Z"),
                  endDate: new Date("2025-12-29T23:59:59Z"),
                  price: 20.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Fase 3 Kit 1",
                  startDate: new Date("2025-12-30T00:00:00Z"),
                  endDate: new Date("2026-01-22T23:59:59Z"),
                  price: 22.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Última Fase Kit 1",
                  startDate: new Date("2026-01-23T00:00:00Z"),
                  endDate: new Date("2026-01-31T23:59:59Z"),
                  price: 24.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Early Bird Kit 2",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2025-12-01T23:59:59Z"),
                  price: 40.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
                {
                  name: "Fase 2 Kit 2",
                  startDate: new Date("2025-12-02T00:00:00Z"),
                  endDate: new Date("2025-12-29T23:59:59Z"),
                  price: 42.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
                {
                  name: "Fase 3 Kit 2",
                  startDate: new Date("2025-12-30T00:00:00Z"),
                  endDate: new Date("2026-01-22T23:59:59Z"),
                  price: 44.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
                {
                  name: "Última Fase Kit 2",
                  startDate: new Date("2026-01-23T00:00:00Z"),
                  endDate: new Date("2026-01-31T23:59:59Z"),
                  price: 46.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
              ],
            },
          },
          // 10 KM DE CASCAIS
          {
            name: "10 Km de Cascais",
            distanceKm: 10,
            startDate: new Date("2026-02-01T08:30:00Z"),
            startTime: "08:30",
            elevationGainM: null,
            maxParticipants: 5000,
            cutoffTimeHours: 2.0,
            description: `Corrida certificada de 10 km pela costa de Cascais.

**Partida:** 8h30 - Baía de Cascais
**Chegada:** Marina de Cascais
**Tempo limite:** 2 horas
**Idade mínima:** 18 anos

Percurso cronometrado com abastecimentos líquidos. Prémios para top 3 M/F. Inclui medalha de finisher.`,
            pricingPhases: {
              create: [
                {
                  name: "Early Bird Kit 1",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2025-12-01T23:59:59Z"),
                  price: 15.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Fase 2 Kit 1",
                  startDate: new Date("2025-12-02T00:00:00Z"),
                  endDate: new Date("2025-12-29T23:59:59Z"),
                  price: 17.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Fase 3 Kit 1",
                  startDate: new Date("2025-12-30T00:00:00Z"),
                  endDate: new Date("2026-01-22T23:59:59Z"),
                  price: 19.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Última Fase Kit 1",
                  startDate: new Date("2026-01-23T00:00:00Z"),
                  endDate: new Date("2026-01-31T23:59:59Z"),
                  price: 21.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Early Bird Kit 2",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2025-12-01T23:59:59Z"),
                  price: 37.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
                {
                  name: "Fase 2 Kit 2",
                  startDate: new Date("2025-12-02T00:00:00Z"),
                  endDate: new Date("2025-12-29T23:59:59Z"),
                  price: 39.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
                {
                  name: "Fase 3 Kit 2",
                  startDate: new Date("2025-12-30T00:00:00Z"),
                  endDate: new Date("2026-01-22T23:59:59Z"),
                  price: 41.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
                {
                  name: "Última Fase Kit 2",
                  startDate: new Date("2026-01-23T00:00:00Z"),
                  endDate: new Date("2026-01-31T23:59:59Z"),
                  price: 43.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
              ],
            },
          },
          // 5 KM DE CASCAIS
          {
            name: "5 Km de Cascais",
            distanceKm: 5,
            startDate: new Date("2026-02-01T09:20:00Z"),
            startTime: "09:20",
            elevationGainM: null,
            maxParticipants: 2000,
            cutoffTimeHours: 1.5,
            description: `Corrida de 5 km pela Baía de Cascais, ideal para toda a família.

**Partida:** 9h20 - Baía de Cascais
**Chegada:** Marina de Cascais
**Tempo limite:** 1h30
**Participação aberta a todas as idades**

Inclui medalha de finisher. Sem cronometragem eletrónica.`,
            pricingPhases: {
              create: [
                {
                  name: "Early Bird Kit 1",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2025-12-01T23:59:59Z"),
                  price: 12.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Fase 2 Kit 1",
                  startDate: new Date("2025-12-02T00:00:00Z"),
                  endDate: new Date("2025-12-29T23:59:59Z"),
                  price: 14.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Fase 3 Kit 1",
                  startDate: new Date("2025-12-30T00:00:00Z"),
                  endDate: new Date("2026-01-22T23:59:59Z"),
                  price: 16.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Última Fase Kit 1",
                  startDate: new Date("2026-01-23T00:00:00Z"),
                  endDate: new Date("2026-01-31T23:59:59Z"),
                  price: 18.0,
                  note: "Kit 1: Long-sleeve oficial da prova",
                },
                {
                  name: "Early Bird Kit 2",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2025-12-01T23:59:59Z"),
                  price: 34.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
                {
                  name: "Fase 2 Kit 2",
                  startDate: new Date("2025-12-02T00:00:00Z"),
                  endDate: new Date("2025-12-29T23:59:59Z"),
                  price: 36.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
                {
                  name: "Fase 3 Kit 2",
                  startDate: new Date("2025-12-30T00:00:00Z"),
                  endDate: new Date("2026-01-22T23:59:59Z"),
                  price: 38.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
                {
                  name: "Última Fase Kit 2",
                  startDate: new Date("2026-01-23T00:00:00Z"),
                  endDate: new Date("2026-01-31T23:59:59Z"),
                  price: 40.0,
                  note: "Kit 2: Long-sleeve + corta-vento + meias oficiais",
                },
              ],
            },
          },
          // CORRIDA DAS CRIANÇAS
          {
            name: "Corrida das Crianças",
            distanceKm: 1,
            startDate: new Date("2026-01-31T16:00:00Z"),
            startTime: "16:00",
            elevationGainM: null,
            maxParticipants: 500,
            cutoffTimeHours: null,
            description: `Corrida solidária para crianças na Baía de Cascais (31 de janeiro às 16h).

**Escalões:** Bambis (2020-2021), Benjamins A (2017-2019), Benjamins B (2015-2016), Infantis (2013-2014)
**Distâncias:** Entre 300m e 1000m conforme escalão

**Inscrição solidária:** Valor reverte 100% para a Associação Casa Nova - Estoril

Inclui t-shirt técnica e brinde. Um evento divertido e solidário!`,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Solidária",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2026-01-31T23:59:59Z"),
                  price: 4.0,
                  note: "Valor reverte 100% para a Associação Casa Nova - Estoril",
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      variants: {
        include: {
          pricingPhases: true,
        },
      },
    },
  });

  console.log(`✅ Created event: ${event.title}`);
  console.log(`   ID: ${event.id}`);
  console.log(`   Slug: ${event.slug}`);
  console.log(`   📍 ${event.city}, ${event.country}`);
  console.log(
    `   📅 ${event.startDate.toLocaleDateString("pt-PT")} - ${event.endDate?.toLocaleDateString("pt-PT")}`
  );
  console.log(`   🏃 Variants: ${event.variants.length}`);

  for (const variant of event.variants) {
    console.log(
      `      - ${variant.name}: ${variant.distanceKm} km (${variant.pricingPhases.length} pricing phases)`
    );
  }

  console.log(
    "\n🎉 Montepio Meia Maratona de Cascais 2026 seeded successfully!"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
