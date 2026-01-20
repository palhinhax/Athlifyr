import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Foz Côa Douro Trail Adventure 2026...");

  // Check if event already exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "foz-coa-douro-trail-adventure-2026" },
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

  // Create the multi-day trail event
  const event = await prisma.event.create({
    data: {
      title: "Foz Côa Douro Trail Adventure 2026",
      slug: "foz-coa-douro-trail-adventure-2026",
      description: `**Evento Multi-Etapas no Alto Douro - 21 e 22 de Fevereiro 2026**

O Foz Côa Douro Trail Adventure® (FCDTA) regressa ao Alto Douro com duas modalidades: o **Pack 3 Etapas** (20-22 Fevereiro) e as **Provas Individuais** (22 Fevereiro), incluindo Trail Ultra 46km, Trail Longo 31km, Trail Sprint 17km e Caminhada 6km.

🏔️ **Trail no Coração do Alto Douro Vinhateiro**

Corra por paisagens deslumbrantes de montanhas e vales em socalcos, rasgados pelos rios Douro e Côa, entre vinhas (dos melhores vinhos do Mundo), amendoeiras em flor e oliveiras centenárias.

📅 **Programa Completo:**

**Pack 3 Etapas (20-22 Fevereiro):**
- **Dia 20 (Sexta):** 1ª Etapa - 16km (partida 17h00 no Museu do Côa)
- **Dia 21 (Sábado):** 2ª Etapa - 30km (partida 09h30 no Castelo de Numão)
- **Dia 22 (Domingo):** 3ª Etapa - 17km (partida 10h00 na Quinta Vale Meão)

**Provas Individuais (22 Fevereiro - Domingo):**
- **09h00:** Trail Ultra 46km (partida em Numão)
- **09h00:** Trail Longo 31km (partida em Numão)
- **10h00:** Trail Sprint 17km (partida na Quinta Vale Meão)
- **10h30:** Caminhada 6km (partida em Santo Amaro)
- **14h30:** Trail Kids (escalões dos 6 aos 16 anos)

🏅 **Destaques:**
- Percursos certificados pelo circuito Best Trail Series e ATRP
- Paisagens únicas do Alto Douro Vinhateiro (Património Mundial UNESCO)
- Semi-autonomia com abastecimentos a cada ~10km
- Prémios para classificação geral e escalões (Jun, Sub-23, Séniores, M/F40, M/F50, M/F60)
- Seguro desportivo incluído
- Apoio médico durante todo o percurso
- Kit do atleta com dorsal, chip e oferta
- Transferes para partidas incluídos
- Pack 3 Etapas inclui alojamento no Centro de Alto Rendimento do Pocinho (CAR)

📍 **Localizações:**
- **Meta:** Vila Nova de Foz Côa - Praça do Município
- **Partidas:** Museu do Côa, Castelo de Numão, Quinta Vale Meão, Santo Amaro
- **Secretariado:** CAR Pocinho (sábado 17h-20h) e Junta Freguesia Foz Côa (domingo 07h)

⏱️ **Limites de Tempo:**
- Trail Ultra 46km: 10 horas
- Trail Longo 31km: sem limite
- Trail Sprint 17km: sem limite
- Caminhada 6km: sem limite

🎒 **Material Obrigatório:**
- Manta de sobrevivência ⚠️
- Apito ⚠️
- Telemóvel operacional ⚠️

**Penalização:** 15 minutos por item em falta

📦 **Material Recomendado:**
- Frontal com bateria carregada
- Reserva alimentar pessoal
- Reservatório mínimo 0,5L
- Impermeável
- GPS ou dispositivo com coordenadas

🎁 **Entrega de Dorsais:**
- **Sábado, 21 Fevereiro:** 17h00-20h00 no Centro Alto Rendimento Pocinho
- **Domingo, 22 Fevereiro:** 07h00 na Junta de Freguesia de Vila Nova de Foz Côa

🏆 **Cerimónia de Prémios:**
- **22 Fevereiro às 15h00** na Praça do Município

⚠️ **Notas Importantes:**
- Idade mínima: 18 anos (prova destinada apenas a maiores de idade)
- Prova em semi-autonomia - é fundamental autogestão do esforço
- Terreno montanhoso com características de alta montanha
- Possibilidade de condições climatéricas extremas (calor, frio, vento, nevoeiro, chuva)
- Apoio externo permitido apenas nos postos de abastecimento
- Dorsal pessoal e intransmissível
- Em caso de desistência, entregar dorsal no secretariado

🌱 **Compensação Carbónica (Opcional):**
Contribua com 5€ para plantação de árvores autóctones e reflorestação de zonas ardidas na região.

🏨 **Alojamento Pack 3 Etapas:**
Centro de Alto Rendimento do Pocinho com pequeno-almoço incluído (quartos single ou duplo - 8 duplos disponíveis).

📞 **Contactos:**
- Website: https://carlossanatureevents.com/pt/fcdta2020
- Organização: Carlos Sá Nature Events®
- Apoio: Município de Vila Nova de Foz Côa

🌐 **Pontos de Interesse:**
Museu do Côa, Castelo de Numão, linha férrea desativada Pocinho-Barca D'Alva, aldeias históricas, vinhas centenárias, paisagens do Alto Douro Vinhateiro.`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-20T17:00:00Z"),
      endDate: new Date("2026-02-22T16:00:00Z"),
      registrationDeadline: new Date("2026-02-14T23:59:59Z"),
      city: "Vila Nova de Foz Côa",
      country: "Portugal",
      externalUrl: "https://carlossanatureevents.com/pt/fcdta2020",
      imageUrl: "/events/fcdta-2026.jpg",
      isFeatured: true,
      latitude: 41.0783,
      longitude: -7.1407,
      googleMapsUrl: "https://goo.gl/maps/hX6cY3gHbcdNceci9",

      // Variants for all race distances
      variants: {
        create: [
          // =================================
          // PACK 3 ETAPAS (20-22 FEV)
          // =================================
          {
            name: "Pack 3 Etapas - Sem Alojamento",
            description:
              "Experiência completa de 3 dias com etapas de 16km, 30km e 17km. Inclui transferes, refeições, acampamento no CAR Pocinho e todos os serviços. Total: 63km distribuídos por 3 dias.",
            distanceKm: 63,
            startDate: new Date("2026-02-20T17:00:00Z"),
            startTime: "17:00",
            elevationGainM: 2100,
            elevationLossM: 2100,
            maxParticipants: 100,
            pricingPhases: {
              create: [
                {
                  name: "Preço Único - Pack 3 Etapas",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2026-02-14T23:59:59Z"),
                  price: 120.0,
                  currency: Currency.EUR,
                  note: "Inclui transferes, 2 jantares, acampamento CAR, abastecimentos e seguro. Transfer Porto-Foz Côa-Porto: +30€",
                },
              ],
            },
          },
          {
            name: "Pack 3 Etapas - Com Alojamento CAR",
            description:
              "Experiência premium de 3 dias com alojamento no Centro de Alto Rendimento do Pocinho. Inclui 2 noites (quarto single/duplo), pequenos-almoços, jantares, transferes e todos os serviços. Total: 63km.",
            distanceKm: 63,
            startDate: new Date("2026-02-20T17:00:00Z"),
            startTime: "17:00",
            elevationGainM: 2100,
            elevationLossM: 2100,
            maxParticipants: 100,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase - Alojamento",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2026-01-10T23:59:59Z"),
                  price: 250.0,
                  currency: Currency.EUR,
                  note: "Inclui alojamento CAR, refeições, transferes e todos os serviços. Possibilidade pagamento 2x",
                },
                {
                  name: "2ª Fase - Alojamento",
                  startDate: new Date("2026-01-11T00:00:00Z"),
                  endDate: new Date("2026-02-14T23:59:59Z"),
                  price: 300.0,
                  currency: Currency.EUR,
                  note: "Última fase. Acompanhante: 120€ (sujeito a vagas quarto duplo)",
                },
              ],
            },
          },

          // =================================
          // PROVAS INDIVIDUAIS (22 FEV)
          // =================================
          {
            name: "Trail Ultra 46km",
            description:
              "Prova ultra de trail com 46km e desnível positivo significativo. Percurso técnico e exigente pelo Alto Douro. Tempo limite: 10 horas. Integra circuitos Best Trail Series e ATRP.",
            distanceKm: 46,
            startDate: new Date("2026-02-22T09:00:00Z"),
            startTime: "09:00",
            elevationGainM: 1800,
            elevationLossM: 1800,
            cutoffTimeHours: 10.0,
            maxParticipants: 200,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase - Ultra 46km",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2026-01-10T23:59:59Z"),
                  price: 40.0,
                  currency: Currency.EUR,
                  note: "Inclui transporte partida, seguro, abastecimentos ~10km, prémio finalista",
                },
                {
                  name: "2ª Fase - Ultra 46km",
                  startDate: new Date("2026-01-11T00:00:00Z"),
                  endDate: new Date("2026-02-14T23:59:59Z"),
                  price: 45.0,
                  currency: Currency.EUR,
                },
              ],
            },
          },
          {
            name: "Trail Longo 31km",
            description:
              "Trail de distância média com 31km. Percurso desafiante pelas vinhas e montanhas do Douro. Sem tempo limite. Integra circuitos Best Trail Series e ATRP.",
            distanceKm: 31,
            startDate: new Date("2026-02-22T09:00:00Z"),
            startTime: "09:00",
            elevationGainM: 1200,
            elevationLossM: 1200,
            maxParticipants: 200,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase - Longo 31km",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2026-01-10T23:59:59Z"),
                  price: 30.0,
                  currency: Currency.EUR,
                  note: "Inclui transporte partida, seguro, abastecimentos ~10km, prémio finalista",
                },
                {
                  name: "2ª Fase - Longo 31km",
                  startDate: new Date("2026-01-11T00:00:00Z"),
                  endDate: new Date("2026-02-14T23:59:59Z"),
                  price: 35.0,
                  currency: Currency.EUR,
                },
              ],
            },
          },
          {
            name: "Trail Sprint 17km",
            description:
              "Trail curto e rápido de 17km. Ideal para iniciação ao trail ou atletas que procuram ritmo intenso. Sem tempo limite. Percurso pela Quinta Vale Meão.",
            distanceKm: 17,
            startDate: new Date("2026-02-22T10:00:00Z"),
            startTime: "10:00",
            elevationGainM: 600,
            elevationLossM: 600,
            maxParticipants: 300,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase - Sprint 17km",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2026-01-10T23:59:59Z"),
                  price: 20.0,
                  currency: Currency.EUR,
                  note: "Inclui transporte partida, seguro, abastecimentos ~10km, prémio finalista",
                },
                {
                  name: "2ª Fase - Sprint 17km",
                  startDate: new Date("2026-01-11T00:00:00Z"),
                  endDate: new Date("2026-02-14T23:59:59Z"),
                  price: 25.0,
                  currency: Currency.EUR,
                },
              ],
            },
          },
          {
            name: "Caminhada 6km",
            description:
              "Caminhada tranquila de 6km pelas paisagens do Alto Douro. Sem tempo limite. Ideal para famílias e quem quer desfrutar da paisagem sem competição. Partida em Santo Amaro.",
            distanceKm: 6,
            startDate: new Date("2026-02-22T10:30:00Z"),
            startTime: "10:30",
            elevationGainM: 150,
            elevationLossM: 150,
            maxParticipants: 100,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase - Caminhada 6km",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2026-01-10T23:59:59Z"),
                  price: 10.0,
                  currency: Currency.EUR,
                  note: "Inclui transporte partida, seguro, abastecimento na meta, prémio finalista",
                },
                {
                  name: "2ª Fase - Caminhada 6km",
                  startDate: new Date("2026-01-11T00:00:00Z"),
                  endDate: new Date("2026-02-14T23:59:59Z"),
                  price: 15.0,
                  currency: Currency.EUR,
                },
              ],
            },
          },
          {
            name: "Trail Kids - 6 anos",
            description:
              "Trail para crianças até 6 anos inclusive. Distância: 250m. Partida às 14h30 junto à linha de meta em Vila Nova de Foz Côa.",
            distanceKm: 0.25,
            startDate: new Date("2026-02-22T14:30:00Z"),
            startTime: "14:30",
            maxParticipants: 50,
            pricingPhases: {
              create: [
                {
                  name: "Preço Único - Kids",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2026-02-14T23:59:59Z"),
                  price: 5.0,
                  currency: Currency.EUR,
                  note: "Escalão até 6 anos - 250m",
                },
              ],
            },
          },
          {
            name: "Trail Kids - 7-10 anos",
            description:
              "Trail para crianças dos 7 aos 10 anos. Distância: 750m. Partida às 14h30 junto à linha de meta em Vila Nova de Foz Côa.",
            distanceKm: 0.75,
            startDate: new Date("2026-02-22T14:30:00Z"),
            startTime: "14:30",
            maxParticipants: 50,
            pricingPhases: {
              create: [
                {
                  name: "Preço Único - Kids",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2026-02-14T23:59:59Z"),
                  price: 5.0,
                  currency: Currency.EUR,
                  note: "Escalão 7-10 anos - 750m",
                },
              ],
            },
          },
          {
            name: "Trail Kids - 11-13 anos",
            description:
              "Trail para crianças dos 11 aos 13 anos. Distância: 1500m. Partida às 14h30 junto à linha de meta em Vila Nova de Foz Côa.",
            distanceKm: 1.5,
            startDate: new Date("2026-02-22T14:30:00Z"),
            startTime: "14:30",
            maxParticipants: 50,
            pricingPhases: {
              create: [
                {
                  name: "Preço Único - Kids",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2026-02-14T23:59:59Z"),
                  price: 5.0,
                  currency: Currency.EUR,
                  note: "Escalão 11-13 anos - 1500m",
                },
              ],
            },
          },
          {
            name: "Trail Kids - 14-16 anos",
            description:
              "Trail para jovens dos 14 aos 16 anos. Distância: 2100m. Partida às 14h30 junto à linha de meta em Vila Nova de Foz Côa.",
            distanceKm: 2.1,
            startDate: new Date("2026-02-22T14:30:00Z"),
            startTime: "14:30",
            maxParticipants: 50,
            pricingPhases: {
              create: [
                {
                  name: "Preço Único - Kids",
                  startDate: new Date("2025-11-01T00:00:00Z"),
                  endDate: new Date("2026-02-14T23:59:59Z"),
                  price: 5.0,
                  currency: Currency.EUR,
                  note: "Escalão 14-16 anos - 2100m",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Created event: ${event.title}`);
  console.log(
    `📅 Dates: ${event.startDate.toLocaleDateString()} - ${event.endDate?.toLocaleDateString()}`
  );
  console.log(`🏃 Sport type: ${event.sportTypes.join(", ")}`);

  // Count variants
  const variantsCount = await prisma.eventVariant.count({
    where: { eventId: event.id },
  });
  console.log(`📊 Created ${variantsCount} variants`);

  // Count pricing phases
  const pricingCount = await prisma.pricingPhase.count({
    where: {
      OR: [{ eventId: event.id }, { variant: { eventId: event.id } }],
    },
  });
  console.log(`💰 Created ${pricingCount} pricing phases`);

  console.log("\n🎉 Foz Côa Douro Trail Adventure 2026 seeded successfully!");
  console.log("\n📋 Event Structure:");
  console.log("   Pack 3 Etapas: 16km + 30km + 17km (com/sem alojamento)");
  console.log("   Provas Individuais: 46km, 31km, 17km, Caminhada 6km");
  console.log("   Trail Kids: 4 escalões (250m a 2100m)");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
