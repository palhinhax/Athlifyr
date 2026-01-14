import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Starting Corrida Fim da Europa seed...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "corrida-fim-da-europa-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing Corrida Fim da Europa event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "35ª Corrida Fim da Europa",
      slug: "corrida-fim-da-europa-2026",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-01-25T10:00:00.000Z"),
      registrationDeadline: new Date("2026-01-19T20:00:00.000Z"),
      city: "Sintra",
      country: "Portugal",
      latitude: 38.7831,
      longitude: -9.3819,
      googleMapsUrl: "https://maps.google.com/?q=38.7831,-9.3819",
      externalUrl: "https://www.fimdaeuropa.com",
      isFeatured: true,
      description: `# 35ª Corrida Fim da Europa

Desde 1987, há 39 anos, a **Corrida Fim da Europa** desafia atletas de todo o país — e cada vez mais do mundo — a superarem-se num dos percursos mais marcantes do panorama desportivo nacional.

## 🌊 Um Percurso Único

Ao longo de **17 km únicos**, a prova liga a histórica Vila de Sintra ao ponto mais ocidental do continente europeu, o emblemático **Cabo da Roca**, num cenário onde a serra se encontra com o mar e cada quilómetro é um teste à resistência, à determinação e ao espírito de aventura.

> "Dificilmente haverá prova mais bonita."

## ⚠️ Características do Percurso

A 35ª Corrida Fim da Europa é um evento de atletismo de estrada com **carácter competitivo**. O percurso, que liga a Vila de Sintra ao Cabo da Roca, atravessa a **Serra de Sintra** em toda a sua extensão, pelo que se adverte para o facto de se tratar de um percurso **sinuoso, desgastante e tecnicamente difícil**.

### Tempo Limite
- **2h30** para terminar a distância da prova
- Menos de **55 minutos** para os primeiros 5 km
- Menos de **1h50** para os primeiros 10 km
- Todos os atletas que excederem estes tempos serão considerados fora de prova

## 🏃 Duas Partidas

Para que os atletas possam correr confortavelmente nos primeiros quilómetros, são feitas **duas partidas**: **10h00** e **10h15**. Os atletas de ambas as partidas serão agrupados na mesma classificação, considerando o tempo individual da sua prova (chip time).

## 📍 Percurso Detalhado

**Partida:** Sintra – Volta do Duche junto à Fonte Mourisca

O percurso segue pela:
- Rua Visconde de Monserrate
- Praça da República
- Rua Gil Vicente
- Rua Maria Eugénia Reis Ferreira Navarro
- Estrada da Pena
- Estrada dos Capuchos (até ao cruzamento do convento)
- Malveira
- Peninha
- EN 247
- Estrada do Cabo da Roca
- Azóia

**Chegada:** Cabo da Roca (junto ao Farol)

**Distância homologada:** 16.945m aferidos pela CNEC/FPA

## 🎽 Kit de Participação

✅ Camisola técnica alusiva à prova
✅ Dorsal em papel "tyvek" com chip não destacável
✅ Pulseira para bengaleiro
✅ Medalha finisher
✅ Seguro de acidentes pessoais
✅ Abastecimentos durante e no final da prova
✅ Diploma digital de participação
✅ Cronometragem com chip
✅ Bengaleiro (transporte de bagagem)

## 💧 Abastecimentos

- **Km 4:** Água
- **Km 9.6:** Água
- **Meta:** Chá quente e alimentos sólidos

## 🏆 Prémios

- **Medalha finisher** para todos os participantes que completarem a prova
- Prémios aos **3 primeiros atletas** da classificação geral, em cada género
- Classificação absoluta pela ordem de chegada (independentemente do horário de partida)

## 📋 Levantamento de Dorsais

**Centro Comercial Alegro Sintra**
- Sexta-feira, 23 de janeiro: 10h00 - 19h00
- Sábado, 24 de janeiro: 10h00 - 18h00

## 🚌 Transporte Disponível

**BUS 1 (Antes da Prova):** Azóia → Sintra (7h00 - 8h00) - €2,00
**BUS 2 (Depois da Prova):** Cabo da Roca → Sintra - €4,00
**BUS 3 (Lisboa):** Marquês de Pombal ⇄ Sintra - €10,00

## 📞 Contactos

**Organização:** Câmara Municipal de Sintra
**Email Inscrições:** inscricoes@fimdaeuropa.com
**Email Geral:** desp.actividades@cm-sintra.pt
**Website:** www.fimdaeuropa.com

## 🌟 História

Reconhecida pela sua beleza, exigência e identidade própria, a **Fim da Europa** tornou-se muito mais do que uma corrida: é uma **experiência ímpar** e um dos **grandes símbolos do desporto português**.`,
      variants: {
        create: [
          {
            name: "1ª Partida - 10h00",
            distanceKm: 17,
            elevationGainM: 450,
            cutoffTimeHours: 2.5,
            maxParticipants: 1000,
            startDate: new Date("2026-01-25T10:00:00.000Z"),
            startTime: "10:00",
            description:
              "Primeira partida às 10h00. Vagas limitadas. Os atletas são obrigados a partir no horário atribuído no momento da inscrição. O percurso parte da Volta do Duche junto à Fonte Mourisca em Sintra, atravessa a Serra de Sintra e termina junto ao Farol do Cabo da Roca. Percurso sinuoso, desgastante e tecnicamente difícil. Abastecimentos de água aos 4 km e aos 9,6 km. Controlo de passagem ao km 10.",
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase (Esgotada)",
                  price: 19.0,
                  startDate: new Date("2025-10-01T00:00:00.000Z"),
                  endDate: new Date("2025-11-30T23:59:59.000Z"),
                  note: "Primeiras 1000 inscrições - ESGOTADA",
                },
                {
                  name: "2ª Fase (Esgotada)",
                  price: 23.0,
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:59.000Z"),
                  note: "Da 1001 à 2000 inscrições - ESGOTADA",
                },
                {
                  name: "3ª Fase",
                  price: 27.0,
                  startDate: new Date("2026-01-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-19T20:00:00.000Z"),
                  note: "Últimas 1000 inscrições. Encerra dia 19/01 às 20h00",
                },
              ],
            },
          },
          {
            name: "2ª Partida - 10h15",
            distanceKm: 17,
            elevationGainM: 450,
            cutoffTimeHours: 2.5,
            maxParticipants: 2000,
            startDate: new Date("2026-01-25T10:15:00.000Z"),
            startTime: "10:15",
            description:
              "Segunda partida às 10h15. Os atletas são obrigados a partir no horário atribuído no momento da inscrição. A realização de duas partidas prende-se com o facto de os primeiros 4 quilómetros do percurso serem em ascensão. Todos os atletas serão agrupados na mesma classificação, considerando o tempo individual (chip time). Percurso sinuoso, desgastante e tecnicamente difícil. Abastecimentos de água aos 4 km e aos 9,6 km. Controlo de passagem ao km 10.",
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase (Esgotada)",
                  price: 19.0,
                  startDate: new Date("2025-10-01T00:00:00.000Z"),
                  endDate: new Date("2025-11-30T23:59:59.000Z"),
                  note: "Primeiras 1000 inscrições - ESGOTADA",
                },
                {
                  name: "2ª Fase (Esgotada)",
                  price: 23.0,
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:59.000Z"),
                  note: "Da 1001 à 2000 inscrições - ESGOTADA",
                },
                {
                  name: "3ª Fase",
                  price: 27.0,
                  startDate: new Date("2026-01-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-19T20:00:00.000Z"),
                  note: "Últimas 1000 inscrições. Encerra dia 19/01 às 20h00",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Event created successfully!");
  console.log(`   Event ID: ${event.id}`);
  console.log(`   Event slug: ${event.slug}`);
  console.log(
    `   Location: ${event.city} at ${event.latitude}, ${event.longitude}`
  );
  console.log(`   Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   External URL: ${event.externalUrl}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
