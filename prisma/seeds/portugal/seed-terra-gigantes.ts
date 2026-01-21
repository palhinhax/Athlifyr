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
      description: `# Terra de Gigantes 2026 - Ultra Trail 304km

**Da Torre à Nazaré - Um desafio para Gigantes**

## 🎯 O Desafio

O desafio de atravessar Portugal de este a oeste, do ponto mais alto à praia das maiores ondas do mundo é, necessariamente, para gigantes. Mas é mais. Um pouco mais que esforço e glória. É coragem, gestão e muita evasão ao longo dos caminhos que os levam desde a Serra da Estrela às isoladas e bonitas Aldeias do Xisto na Lousã. São caminhos de fé, lá pelos lados do Santuário de Fátima que vos levarão até às magnificas e gigantescas ondas da Nazaré.

📅 **15 a 18 de janeiro de 2026**  
⏰ **Partida:** 11h00 da Torre da Serra da Estrela

## 📊 Dados Técnicos

- **Distância:** 303,8 km
- **Desnível Positivo (D+):** 11.222 m
- **Desnível Negativo (D-):** 12.105 m
- **Tempo Máximo:** 74 horas
- **Mountain Level:** 3
- **Pontos ITRA:** 6
- **Grau ATRP:** 5

## 🏔️ O Percurso

Atravessa paisagens naturais extraordinárias:

- 🏔️ **Serra da Estrela** - Início no ponto mais alto de Portugal
- 🏘️ **Aldeias do Xisto** - Isoladas e bonitas na Lousã
- 🏛️ **Aldeias Históricas** - Património e cultura
- ⛰️ **Serra do Açor** - Natureza selvagem
- ⛪ **Caminhos de Fé** - Rumo ao Santuário de Fátima
- 🌊 **Nazaré** - Magnificas e gigantescas ondas

## ❄️ Condições Climatéricas

**Inverno rigoroso no primeiro mês do ano:**

- Temperaturas muito baixas (possível **início com temperaturas negativas**)
- **Possibilidade de neve** na Torre (1.993m altitude)
- Chuva prevista
- Condições extremas que exigem preparação máxima

⚠️ **Respeitar a "Mãe Natureza"** - ela será inclemente com todos aqueles que duvidarem do seu poder.

## 🎁 TOR Experience

**Aos primeiros 10 participantes da classificação geral** serão atribuídas **entradas diretas para participação no Tor des Géants**.

## 📋 Material Obrigatório

✅ **Verificação obrigatória** (pode ocorrer a qualquer momento)

- GPS com autonomia e capacidade de gravar mínimo 10.000 pontos
- Formas de alimentação do GPS (baterias extras)
- Documento de identificação (cópia aceite)
- Saco cama de emergência
- 1 manta térmica
- Apito
- Luzes frontal e traseira
- Telemóvel operacional (adicionar números de segurança da Organização)

**Penalização:** 4 horas de penalidade por ausência de material obrigatório  
**Recusa de verificação:** Desclassificação imediata

## 🎒 Material Altamente Recomendado

- Casaco e calças **impermeáveis** e **corta-vento** de qualidade superior
- Roupa térmica (materiais como Polartec)
- Mochila impermeável
- Bolsa impermeável para equipamentos eletrónicos
- Muda de roupa
- Protetor solar

⚠️ **A primeira e grande proteção são os isolamentos térmicos.**

## 🏕️ Bases de Apoio e Descanso

**Passagem obrigatória** em todas as bases de apoio

**Serviços:**
- Abastecimentos de líquidos e sólidos
- Descanso prolongado
- Balneários com água quente/fria (em algumas bases)
- Acesso aos drop bags
- Controlo eletrónico de passagem
- Massagens (na meta)

**Assistência:** Máximo 2 assistentes por atleta

## ⏱️ Tempo Limite

- **Tempo máximo:** 74 horas
- **Barreiras horárias** em cada base (detalhes no Guia do Participante)
- **Ultrapassar barreira = Desclassificação**

## 🏆 Classificações e Prémios

**Não há prémios em dinheiro**

✅ Prémio de "finisher" para todos  
✅ Troféus para os **3 primeiros** (M/F)  
✅ Rankings: Geral, Duplas, Quadras

**Vencedores solo = Vencedores absolutos da Terra de Gigantes**

## 🎒 Inscrição Inclui

✅ Brinde oficial do evento  
✅ Dorsal com chip  
✅ Drop bags para todas as bases  
✅ Abastecimentos líquidos e sólidos  
✅ Assistência médica e socorro  
✅ Transfer Seia → Torre  
✅ Prémio de finisher  
✅ Festa de consagração  
✅ Seguro de acidentes e RC  
✅ Massagens, duches e solo duro

## 📞 Contactos

**Organização:**  
Horizontes Turismo Desportivo e Viagens  
Associação Interior Convida

📧 info@horizontes.pt  
📞 +351 274 673 139

**Inscrições:**  
https://stopandgo.net/events/terra-de-gigantes-2026

## 💰 Condições de Cancelamento

- Até 30/06/2025: **60% reembolso**
- Até 30/11/2025: **30% reembolso**
- A partir 01/12/2025: **Sem reembolso**

⚠️ **Não há transferência para edição seguinte**`,
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
