import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding Terra de Gigantes 2026...");

  // Check if event already exists
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "terra-de-gigantes-2026" },
  });

  if (existingEvent) {
    console.log("⚠️  Event already exists. Deleting to recreate...");
    await prisma.event.delete({
      where: { slug: "terra-de-gigantes-2026" },
    });
  }

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "Terra de Gigantes 2026",
      slug: "terra-de-gigantes-2026",
      description: `## O Desafio de Gigantes

O desafio de atravessar Portugal de este a oeste, do ponto mais alto à praia das maiores ondas do mundo. Da Serra da Estrela às isoladas e bonitas Aldeias do Xisto na Lousã, pelos caminhos de fé de Fátima até às magnificas e gigantescas ondas da Nazaré.

**303,8 km | 11.222m D+ | 12.105m D- | 74h limite**

## Sobre o Evento

Terra de Gigantes é mais do que uma corrida. É um desafio épico que atravessa Portugal de leste a oeste, começando no ponto mais alto de Portugal - a Torre da Serra da Estrela - e terminando na praia das maiores ondas do mundo - Nazaré.

### O Percurso

303,8 km de pura aventura através de:
- **Serra da Estrela** - Início no ponto mais alto de Portugal
- **Aldeias do Xisto** - Percursos isolados e bonitos na Lousã
- **Aldeias Históricas** - Património português
- **Serra do Açor** - Paisagens naturais deslumbrantes
- **Caminhos de Fé** - Passagem pelo Santuário de Fátima
- **Nazaré** - Meta nas ondas gigantes

### Condições

Estamos no primeiro mês de inverno, época de temperaturas muito baixas e chuva. Iniciar no ponto mais alto de Portugal significa poder começar o desafio com temperaturas negativas e, possivelmente, neve.

### TOR Experience

Os primeiros 10 participantes da classificação geral receberão entradas diretas para participação no Tor des Géants.

### Dados Técnicos
- **Distância**: 303,8 km
- **Desnível Positivo**: 11.222m
- **Desnível Negativo**: 12.105m
- **Tempo Máximo**: 74 horas
- **ITRA Points**: 6
- **Mountain Level**: 3
- **ATRP Grau**: 5

### Material Obrigatório
- GPS e formas de alimentação do equipamento
- Documento de identificação
- Saco cama de emergência
- Manta térmica
- Apito
- Luzes frontal e traseira
- Telemóvel com números de emergência

### Material Altamente Recomendado
- Casaco e calças impermeáveis de qualidade superior
- Roupa térmica (Polartec)
- Mochila impermeável
- Bolsa impermeável para equipamentos eletrónicos
- Muda de roupa
- Protetor solar

### Inscrição Inclui
- Brinde oficial do evento
- Dorsal e chip de cronometragem
- Drop bags para todas as bases
- Assistência e suprimentos em todas as bases de apoio
- Serviço médico ao longo da prova
- Transfer de Seia à Torre (partida)
- Prémio de finisher
- Festa de consagração
- Seguro de acidentes pessoal e RC
- Duches e massagens na meta
- Solo duro em pavilhão

### Organização
Co-organização Horizontes Turismo Desportivo e Viagens e Associação Interior Convida.

**Contacto**: info@horizontes.pt | +351 274 673 139

### Condições de Cancelamento
- Até 30 de junho/2025: 60% de reembolso
- Até 30 de novembro/2025: 30% de reembolso
- A partir de 1 de dezembro: Sem reembolso`,
      startDate: new Date("2026-01-15T11:00:00Z"),
      endDate: new Date("2026-01-18T13:00:00Z"),
      registrationDeadline: new Date("2025-12-31T23:59:59Z"),
      sportTypes: [SportType.TRAIL],
      city: "Seia",
      country: "Portugal",
      imageUrl: "/events/terra-de-gigantes-2026.jpg",
      externalUrl: "https://stopandgo.net/events/terra-de-gigantes-2026",
      isFeatured: true,
      pricingPhases: {
        create: [
          {
            name: "1ª FASE",
            startDate: new Date("2025-03-24T00:00:00Z"),
            endDate: new Date("2025-04-27T23:59:59Z"),
            price: 540,
            discountPercent: 10,
            note: "Desconto de 10% sobre o valor de 600€",
          },
          {
            name: "2ª FASE",
            startDate: new Date("2025-04-28T00:00:00Z"),
            endDate: new Date("2025-07-27T23:59:59Z"),
            price: 600,
          },
          {
            name: "3ª FASE",
            startDate: new Date("2025-07-28T00:00:00Z"),
            endDate: new Date("2025-11-30T23:59:59Z"),
            price: 690,
          },
          {
            name: "4ª FASE",
            startDate: new Date("2025-12-01T00:00:00Z"),
            endDate: new Date("2025-12-31T23:59:59Z"),
            price: 750,
          },
        ],
      },
      variants: {
        create: [
          {
            name: "Terra de Gigantes - Solo",
            description:
              "Percurso completo de 303,8 km em modo solo. Para gigantes que enfrentam o desafio sozinhos. Os primeiros 10 classificados recebem entrada direta para o Tor des Géants.",
            startDate: new Date("2026-01-15T11:00:00Z"),
            startTime: "11:00",
            distanceKm: 304,
            price: 600.0,
            maxParticipants: 150,
            elevationGainM: 11222,
            elevationLossM: 12105,
            cutoffTimeHours: 74,
            itraPoints: 6,
            atrpGrade: 5,
            mountainLevel: 3,
          },
          {
            name: "Terra de Gigantes - Duplas",
            description:
              "Percurso completo de 303,8 km em dupla. Enfrentem juntos o desafio de atravessar Portugal de leste a oeste.",
            startDate: new Date("2026-01-15T11:00:00Z"),
            startTime: "11:00",
            distanceKm: 304,
            price: 600.0,
            maxParticipants: 30,
            elevationGainM: 11222,
            elevationLossM: 12105,
            cutoffTimeHours: 74,
            itraPoints: 6,
            atrpGrade: 5,
            mountainLevel: 3,
          },
          {
            name: "Terra de Gigantes - Quadras",
            description:
              "Percurso completo de 303,8 km em equipa de quatro. A força do grupo no maior desafio de ultra-trail em Portugal.",
            startDate: new Date("2026-01-15T11:00:00Z"),
            startTime: "11:00",
            distanceKm: 304,
            price: 600.0,
            maxParticipants: 20,
            elevationGainM: 11222,
            elevationLossM: 12105,
            cutoffTimeHours: 74,
            itraPoints: 6,
            atrpGrade: 5,
            mountainLevel: 3,
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
  console.log(`   - Variants: 3 (Solo, Duplas, Quadras)`);
  console.log("\n🏔️ Terra de Gigantes 2026 seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Terra de Gigantes:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
