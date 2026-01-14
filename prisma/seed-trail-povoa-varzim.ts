import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding IX Trail da Póvoa de Varzim...");

  // Check if event already exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "ix-trail-da-povoa-de-varzim-2026" },
  });

  if (existingEvent) {
    console.log("⚠️  Event already exists. Deleting to recreate...");
    await prisma.event.delete({
      where: { slug: "ix-trail-da-povoa-de-varzim-2026" },
    });
  }

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "IX Trail da Póvoa de Varzim",
      slug: "ix-trail-da-povoa-de-varzim-2026",
      description: `## Sobre o Evento

O **IX Trail da Póvoa de Varzim** é um evento organizado pelo Centro Desportivo e Cultural de Navais, em parceria com a empresa Municipal Varzim Lazer e conta com o apoio da Junta da União das Freguesias de Aguçadoura e Navais e da Câmara Municipal da Póvoa de Varzim.

### Percurso

O evento percorrerá ambiente natural, rural e urbano do norte do concelho da Póvoa de Varzim, com início no **Parque Desportivo Alberto Silva, em Navais**.

As provas desenrolam-se maioritariamente por **trilhos, caminhos, ribeiras, estradas florestais e estradas rodoviárias**, percorrendo as freguesias de:
- Navais
- Estela
- Laúndos
- Terroso
- Rates
- Rio Mau

### Material Obrigatório

**Trail Curto e Caminhada:**
- Dorsal (alfinetes são da responsabilidade do atleta)
- Recipiente para beber nos abastecimentos (copo, cantil, etc.)
- Telemóvel

**Trail Longo (adicional):**
- Manta térmica

### Material Recomendado

- Mochila tipo "Camelback" / Bidão com 0,5l a 1l de água
- Barras / géis
- Apito
- Corta vento, gorro, luvas

### Abastecimentos

**Trail Curto:** 1 posto aos 9,3 km
**Trail Longo:** 2 postos aos 10,6 km e 17,7 km

⚠️ **ATENÇÃO:** Cada atleta terá de ter um recipiente (copo, cantil, bidão, etc.) para se abastecer de líquidos nos abastecimentos. Por questões ambientais, a organização não irá facultar qualquer tipo de recipiente.

### Inscrição Inclui

- Dorsal com chip descartável
- Abastecimentos sólidos e líquidos
- Almoço
- T-shirt técnica
- Prémio Finisher (produto regional)
- Medalha Finisher
- Seguro de responsabilidade civil
- Seguro de acidentes pessoais
- Banhos
- Transporte para a meta (em caso de desistência)
- Assistência médica e socorro

### Prémios

**Individual:**
- Troféus aos 3 primeiros lugares da geral (masculino e feminino) de cada prova
- Troféus aos 3 primeiros de cada escalão (masculino e feminino)

**Coletivo:**
- Troféu ao 1º lugar de cada prova (somatório dos 3 primeiros atletas do clube)
- Prémio especial para a equipa mais numerosa

### Horário do Evento

**Sábado, 17 de janeiro:**
- 14h30 - 19h00: Secretariado

**Domingo, 18 de janeiro:**
- 07h30: Abertura do secretariado
- 09h15: Abertura do controlo zero (Trail Longo)
- 09h30: Partida do Trail Longo
- 09h30: Abertura do controlo zero (Trail Curto)
- 09h45: Partida do Trail Curto
- 10h00: Partida da Caminhada
- 13h00: Cerimónia Protocolar Trail Curto
- 13h30: Cerimónia Protocolar Trail Longo

### Escalões

- Sub 23 (18-22 anos)
- Elites (23-39 anos)
- Veteranos 40 (40-44 anos)
- Veteranos 45 (45-49 anos)
- Veteranos 50 (50-54 anos)
- Veteranos 55 (55-59 anos)
- Veteranos 60 (+60 anos)

### Organização

**Centro Desportivo e Cultural de Navais**

📧 ultratrailpv@gmail.com
📞 +351 936 162 607

🌐 https://ultratrailpv.wixsite.com/trailpovoa
📘 https://www.facebook.com/utp.ultratrailpovoa

### Localização

**Parque Desportivo Alberto Silva**
Navais, Póvoa de Varzim
📍 41°25'52"N 8°44'56"W

### Como Chegar

**Vindo da A28:**
- Saída Póvoa de Varzim: seguir direção Viana do Castelo, em Navais virar nos semáforos seguindo placa "Parque Desportivo"
- Saída Estela: seguir Campo de Golf até N13, direção Póvoa de Varzim até Navais, virar nos semáforos

### Locais a Visitar

- Cidade da Póvoa de Varzim
- Campos de Masseira - Aguçadoura
- Monte de São Félix - Laúndos
- Igreja Românica de São Pedro de Rates
- Citânia da Cividade de Terroso`,
      startDate: new Date("2026-01-18T09:30:00Z"),
      endDate: new Date("2026-01-18T15:00:00Z"),
      registrationDeadline: new Date("2026-01-11T23:59:59Z"),
      sportTypes: [SportType.TRAIL],
      city: "Póvoa de Varzim",
      country: "Portugal",
      imageUrl: "/events/ix-trail-da-povoa-de-varzim.jpg",
      externalUrl: "https://ultratrailpv.wixsite.com/trailpovoa",
      isFeatured: true,
      variants: {
        create: [
          {
            name: "Trail Longo",
            description:
              "Percurso de 25km com 1000m D+ por trilhos, caminhos, ribeiras e estradas florestais pelas freguesias de Navais, Estela, Laúndos, Rates, Rio Mau e Terroso.",
            startDate: new Date("2026-01-18T09:30:00Z"),
            startTime: "09:30",
            distanceKm: 25,
            maxParticipants: 300,
            elevationGainM: 1000,
            cutoffTimeHours: 5.5,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-09-01T00:00:00Z"),
                  endDate: new Date("2025-12-31T23:59:59Z"),
                  price: 17,
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2026-01-01T00:00:00Z"),
                  endDate: new Date("2026-01-11T23:59:59Z"),
                  price: 19,
                },
              ],
            },
          },
          {
            name: "Trail Curto",
            description:
              "Percurso de 16km com 500m D+ por trilhos, caminhos, ribeiras e estradas florestais pelas freguesias de Navais, Estela, Laúndos, Terroso e Rates.",
            startDate: new Date("2026-01-18T09:45:00Z"),
            startTime: "09:45",
            distanceKm: 16,
            maxParticipants: 400,
            elevationGainM: 500,
            cutoffTimeHours: 3.5,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-09-01T00:00:00Z"),
                  endDate: new Date("2025-12-31T23:59:59Z"),
                  price: 12,
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2026-01-01T00:00:00Z"),
                  endDate: new Date("2026-01-11T23:59:59Z"),
                  price: 14,
                },
              ],
            },
          },
          {
            name: "Caminhada",
            description:
              "Percurso de 6km pelas freguesias de Navais, Estela e Laúndos. Podem participar menores desde que acompanhados por familiares.",
            startDate: new Date("2026-01-18T10:00:00Z"),
            startTime: "10:00",
            distanceKm: 6,
            maxParticipants: 200,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-09-01T00:00:00Z"),
                  endDate: new Date("2025-12-31T23:59:59Z"),
                  price: 12,
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2026-01-01T00:00:00Z"),
                  endDate: new Date("2026-01-11T23:59:59Z"),
                  price: 14,
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Created event: ${event.title}`);
  console.log(`   - ID: ${event.id}`);
  console.log(`   - Slug: ${event.slug}`);
  console.log(`   - Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   - City: ${event.city}`);
  console.log(
    `   - Variants: 3 (Trail Longo 25km, Trail Curto 16km, Caminhada 6km)`
  );
  console.log("\n🏃 IX Trail da Póvoa de Varzim seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Trail Póvoa de Varzim:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
