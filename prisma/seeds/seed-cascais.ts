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
            description: `Partida às 9h00 no Passeio Dom Luís I, com chegada no mesmo local.

**Percurso:** Av. Dom Carlos I → Av. da República → Av. 25 de Abril → Av. Infante Dom Henrique → Estrada do Guincho (retorno em frente do Hotel Fortaleza do Guincho) → Rotunda da Guia → Av. Rei Humberto II de Itália → Meta no Passeio Dom Luís I.

**Blocos de Partida:**
- Elite: ≤ 1h14 (comprovativo obrigatório)
- Sub 1h25: ≤ 1h25 (comprovativo obrigatório)
- Sub 1h40: ≤ 1h40 (comprovativo obrigatório)
- Sub 1h50: ≤ 1h50 (comprovativo obrigatório)
- +1h50: Sem comprovativo necessário

**Abastecimentos:** Líquidos aos 5, 7.5, 10, 13, 15.5, 18 km e meta | Sólidos aos 13 km e meta

**Prémios Top 3 M/F:**
- Troféu + voucher 100€ Montepio + cabaz LIDL + kit Marina de Cascais
- 1º: Estadia fim de semana Onyria Marinha Cascais
- 2º: Jantar para 2 (100€)
- 3º: Massagem de Relaxamento Natur Spa

**Prémio Meta-Volante 10 km:** 1º M/F recebem prémio LIDL

**Kit:** Long-sleeve oficial + chip + dorsal + medalha finisher
**Kit 2:** Long-sleeve + corta-vento + meias oficiais + chip + dorsal + medalha

**Idade mínima:** 20 anos (nascidos em 2006 ou antes)`,
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
            description: `Partida às 8h30 no Passeio Dom Luís I, Baía de Cascais, com chegada na Marina de Cascais.

**Percurso:** Av. Dom Carlos I → Av. da República → Av. Nossa Senhora do Cabo (retorno junto ao Forte de São Jorge de Oitavos) → Rotunda da Guia → Av. Rei Humberto II de Itália → Marina de Cascais (circuito interno) → Meta.

**Blocos de Partida:**
- Elite: ≤ 37:30 (comprovativo obrigatório)
- Sub 45: ≤ 45 min (comprovativo obrigatório)
- Sub 50: ≤ 50 min (comprovativo obrigatório)
- Sub 60: ≤ 60 min (comprovativo obrigatório)
- +60: Sem comprovativo necessário

**Abastecimentos:** Líquidos aos 5.2, 7.3 km e meta

**Prémios Top 3 M/F:**
- Troféu + voucher 100€ Montepio + cabaz LIDL + kit Marina de Cascais
- 1º: Estadia fim de semana Onyria Marinha Cascais
- 2º: Jantar para 2 (100€)
- 3º: Massagem de Relaxamento Natur Spa

**Kit:** Long-sleeve oficial + chip + dorsal + medalha finisher
**Kit 2:** Long-sleeve + corta-vento + meias oficiais + chip + dorsal + medalha

**Idade mínima:** 18 anos (nascidos em 2008 ou antes)`,
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
            description: `Partida às 9h20 no Passeio Dom Luís I, com chegada na Marina de Cascais.

**Percurso:** Av. Dom Carlos I → Av. da República → Av. 25 de Abril → Av. Infante Dom Henrique (retorno na rotunda Álvaro Raul Canas da Mota) → Rua Vigia do Facho → Av. Rei Humberto II de Itália → Marina de Cascais (circuito interno) → Meta.

**Abastecimentos:** Líquido no km 3.5 e meta

**Prova ideal para a família!** Participação aberta a todas as idades.

**Kit:** Long-sleeve oficial + dorsal + medalha finisher
**Kit 2:** Long-sleeve + corta-vento + meias oficiais + dorsal + medalha

**Sem cronometragem eletrónica** (diploma de participação disponível online)`,
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
            description: `Corrida para os mais novos na Baía de Cascais, no dia 31 de janeiro às 16h00.

**Escalões (por ano civil de nascimento):**
- **Bambis** (2020-2021): ≈ 300 metros (podem ser acompanhados por adulto)
- **Benjamins A** (2017-2019): ≈ 500 metros
- **Benjamins B** (2015-2016): ≈ 700 metros
- **Infantis** (2013-2014): ≈ 1000 metros

**Partida e Chegada:** Passeio Dom Luís I, Baía de Cascais

**Abastecimento:** Na meta

**Kit:** T-shirt técnica unissexo + 2 dorsais (atleta + encarregado de educação) + brinde do evento

**Valor de inscrição reverte na totalidade para:**
Associação Casa Nova – Casa de Acolhimento Residencial de Crianças do Estoril

Um desafio divertido e solidário para as crianças!`,
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
