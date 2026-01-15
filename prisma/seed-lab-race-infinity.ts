import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃‍♂️ Seeding THE LAB RACE Infinity...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "lab-race-infinity-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "THE LAB RACE Infinity",
      slug: "lab-race-infinity-2026",
      sportTypes: [SportType.OCR, SportType.TRAIL],
      startDate: new Date("2026-10-11T09:00:00.000Z"),
      registrationDeadline: new Date("2026-10-09T23:59:59.000Z"),
      city: "Cascais",
      country: "Portugal",
      latitude: 38.713324,
      longitude: -9.323967,
      googleMapsUrl: "https://maps.app.goo.gl/NgJvQdjp1AePUQ5a7",
      externalUrl: "https://www.instagram.com/ocrportugallab1/",
      isFeatured: true,
      description: `# THE LAB RACE Infinity

**A Prova de Obstáculos para Toda a Família**

**Data:** 11 de outubro de 2026
**Local:** Parque Urbano Outeiro Polima, Cascais

O **THE LAB RACE Infinity** by **OCR Portugal LAB Club** é um evento único que combina o melhor do mundo dos obstáculos com provas acessíveis a toda a família. Com um formato inovador de voltas cronometradas e múltiplas opções de distância, há uma prova perfeita para cada atleta!

## 🏃 Conceito do Percurso

**Circuito:** 5 km com **20 obstáculos técnicos**

⏱️ **Todas as saídas são cronometradas** - cada volta, cada esforço e cada desafio contam!

O percurso está desenhado para testar força, resistência, técnica e determinação através de obstáculos variados que desafiam corpo e mente.

## 🏁 PROVAS COM OBSTÁCULOS (OCR)

### 🟡 INFINITY (Formato Especial)
**Duração:** 4 horas de prova contínua
**Objetivo:** Completar o máximo número de voltas possível
**Distância:** Ilimitada (múltiplas voltas de 5km)
**Prémios:** Classificação geral Masculino e Feminino

O formato **Infinity** é a prova rainha do evento - 4 horas para testares os teus limites! Quantas voltas consegues completar? Cada volta conta 5km + 20 obstáculos. Uma verdadeira prova de resistência física e mental!

### 🔴 TOUGH - 20K
**Distância:** 20 km (4 voltas)
**Obstáculos:** 80 obstáculos no total (20 por volta)
**Prémios:** Classificação geral Masculino e Feminino

Para atletas experientes que procuram um desafio completo. 4 voltas intensas com cronometragem individual de cada segmento.

### 🟠 STANDARD - 10K
**Distância:** 10 km (2 voltas)
**Obstáculos:** 40 obstáculos no total (20 por volta)

O equilíbrio perfeito entre desafio e diversão. Ideal para quem tem experiência em OCR mas quer uma distância mais acessível.

### 🟢 SHORT - 5K
**Distância:** 5 km (1 volta)
**Obstáculos:** 20 obstáculos

Perfeito para iniciantes ou quem quer experimentar OCR pela primeira vez. Uma volta completa para conheceres todos os obstáculos do percurso.

### 👧🧒 KIDS - 5K
**Distância:** 5 km (1 volta)
**Obstáculos:** 20 obstáculos adaptados

Prova especial para os mais novos! Obstáculos adaptados à idade, com toda a segurança e diversão. Uma experiência inesquecível para crianças e jovens atletas.

## 🌿 PROVAS SEM OBSTÁCULOS (TRAIL & CAMINHADA)

Para quem prefere correr sem obstáculos ou simplesmente caminhar, há também opções no mesmo percurso!

### 🔵 TRAIL TOUGH - 20K
**Distância:** 20 km (4 voltas)
**Prémios:** Classificação geral Masculino e Feminino

Trail running puro no mesmo circuito, sem obstáculos. Para corredores que querem distância e velocidade.

### 🟣 TRAIL STANDARD - 10K
**Distância:** 10 km (2 voltas)

Distância intermédia para trail runners que procuram um desafio equilibrado.

### 🟢 TRAIL SHORT - 5K
**Distância:** 5 km (1 volta)

Uma volta rápida de trail running no belo Parque Urbano Outeiro Polima.

### 🚶 CAMINHADA - 5K
**Distância:** 5 km (1 volta)

Para toda a família! Caminhada descontraída pelo parque, sem pressão de tempo. Perfeita para iniciantes, famílias ou quem quer simplesmente desfrutar do ambiente.

## 🎯 Para Quem É Este Evento?

✅ **Atletas competitivos** - Infinity e Tough oferecem prémios e desafios extremos
✅ **Iniciantes em OCR** - Short e Standard são perfeitos para começar
✅ **Famílias** - Kids e Caminhada para todos participarem
✅ **Trail Runners** - Opções sem obstáculos para corredores puros
✅ **Grupos de amigos** - Cada um escolhe a sua prova!

## 💪 Obstáculos Técnicos

O percurso inclui **20 obstáculos variados**, testando:
- 🧗 Força de braços e pegada
- 🏋️ Força de pernas e core
- 🤸 Equilíbrio e agilidade
- 🧠 Resolução de problemas
- 💪 Resistência muscular
- 🎯 Coordenação motora

**Nota:** Os obstáculos são adaptados para a prova KIDS para garantir segurança total.

## 🏆 Prémios

Classificação geral Masculino e Feminino nas seguintes provas:
- 🟡 **INFINITY** (quem completar mais voltas em 4h)
- 🔴 **TOUGH OCR** (20K com obstáculos)
- 🔵 **TRAIL TOUGH** (20K sem obstáculos)

## 📍 Local - Parque Urbano Outeiro Polima

**Cascais, Portugal**

Um dos espaços verdes mais bonitos de Cascais, o Parque Urbano Outeiro Polima oferece:
- Percursos variados e desafiantes
- Natureza preservada
- Instalações modernas
- Fácil acesso e estacionamento
- Ambiente familiar e seguro

## 📝 Inscrições

**Estado:** Brevemente disponíveis

Acompanha o Instagram **@ocrportugallab1** para:
- Anúncio de abertura de inscrições
- Preços e fases de inscrição
- Detalhes dos obstáculos
- Regulamento completo
- Updates do evento

## 🎉 Experiência THE LAB RACE

👉 **Sozinho, com amigos ou em família** - há uma prova à tua medida!

✅ Cronometragem profissional em todas as provas
✅ Obstáculos técnicos e seguros
✅ Ambiente familiar e competitivo
✅ Prémios para os melhores
✅ Medalhas para todos os finishers
✅ Evento para todas as idades e níveis

## 🔥 Estás Pronto Para o Desafio?

Seja para competir, superar-te ou simplesmente viver a experiência, **THE LAB RACE Infinity** é o evento OCR que não podes perder em 2026!

## 📱 Segue-nos

**Instagram:** @ocrportugallab1
**Organização:** OCR Portugal LAB Club

---

💥 Cada volta conta. Cada obstáculo é um desafio. Cada finisher é um vencedor! 🔥`,
      variants: {
        create: [
          {
            name: "🟡 INFINITY",
            distanceKm: 0, // Distância ilimitada (4 horas)
            cutoffTimeHours: 4,
            startDate: new Date("2026-10-11T09:00:00.000Z"),
            startTime: "09:00",
            description:
              "Formato especial de 4 horas contínuas! O objetivo é completar o máximo número de voltas possível. Cada volta = 5km + 20 obstáculos. Prémios para quem completar mais voltas (geral M/F). Uma verdadeira prova de resistência física e mental que testa os teus limites absolutos!",
            pricingPhases: {
              create: [
                {
                  name: "Inscrições em breve",
                  price: 0,
                  startDate: new Date("2026-06-01T00:00:00.000Z"),
                  endDate: new Date("2026-10-09T23:59:59.000Z"),
                  note: "Preços a anunciar. Acompanha @ocrportugallab1 para updates.",
                },
              ],
            },
          },
          {
            name: "🔴 TOUGH OCR - 20K",
            distanceKm: 20,
            cutoffTimeHours: 4,
            startDate: new Date("2026-10-11T09:30:00.000Z"),
            startTime: "09:30",
            description:
              "Prova OCR completa de 20km com 4 voltas (80 obstáculos no total). Para atletas experientes que procuram um desafio intenso. Cronometragem individual de cada volta. Prémios para classificação geral Masculino e Feminino. Testa resistência, força e técnica nos obstáculos.",
            pricingPhases: {
              create: [
                {
                  name: "Inscrições em breve",
                  price: 0,
                  startDate: new Date("2026-06-01T00:00:00.000Z"),
                  endDate: new Date("2026-10-09T23:59:59.000Z"),
                  note: "Preços a anunciar. Acompanha @ocrportugallab1 para updates.",
                },
              ],
            },
          },
          {
            name: "🟠 STANDARD OCR - 10K",
            distanceKm: 10,
            cutoffTimeHours: 3,
            startDate: new Date("2026-10-11T10:00:00.000Z"),
            startTime: "10:00",
            description:
              "Equilíbrio perfeito entre desafio e diversão! 10km com 2 voltas (40 obstáculos). Ideal para atletas com experiência em OCR que querem uma distância mais acessível mas ainda desafiante. Cronometragem completa e ambiente competitivo.",
            pricingPhases: {
              create: [
                {
                  name: "Inscrições em breve",
                  price: 0,
                  startDate: new Date("2026-06-01T00:00:00.000Z"),
                  endDate: new Date("2026-10-09T23:59:59.000Z"),
                  note: "Preços a anunciar. Acompanha @ocrportugallab1 para updates.",
                },
              ],
            },
          },
          {
            name: "🟢 SHORT OCR - 5K",
            distanceKm: 5,
            cutoffTimeHours: 2,
            startDate: new Date("2026-10-11T10:30:00.000Z"),
            startTime: "10:30",
            description:
              "Perfeito para iniciantes em OCR! 1 volta completa de 5km com os 20 obstáculos do percurso. Experimenta todos os desafios sem a pressão de múltiplas voltas. Ideal para primeiro contacto com obstacle racing ou para quem quer diversão garantida.",
            pricingPhases: {
              create: [
                {
                  name: "Inscrições em breve",
                  price: 0,
                  startDate: new Date("2026-06-01T00:00:00.000Z"),
                  endDate: new Date("2026-10-09T23:59:59.000Z"),
                  note: "Preços a anunciar. Acompanha @ocrportugallab1 para updates.",
                },
              ],
            },
          },
          {
            name: "👧🧒 KIDS - 5K",
            distanceKm: 5,
            cutoffTimeHours: 3,
            startDate: new Date("2026-10-11T11:00:00.000Z"),
            startTime: "11:00",
            description:
              "Prova especial para crianças e jovens atletas! 5km com 20 obstáculos adaptados à idade. Totalmente seguro e supervisionado. Uma experiência inesquecível que desenvolve confiança, coordenação e espírito de equipa nos mais novos. Medalha de finisher garantida!",
            pricingPhases: {
              create: [
                {
                  name: "Inscrições em breve",
                  price: 0,
                  startDate: new Date("2026-06-01T00:00:00.000Z"),
                  endDate: new Date("2026-10-09T23:59:59.000Z"),
                  note: "Preços a anunciar. Acompanha @ocrportugallab1 para updates.",
                },
              ],
            },
          },
          {
            name: "🔵 TRAIL TOUGH - 20K",
            distanceKm: 20,
            cutoffTimeHours: 3,
            startDate: new Date("2026-10-11T09:30:00.000Z"),
            startTime: "09:30",
            description:
              "Trail running puro no mesmo circuito, SEM obstáculos. 20km com 4 voltas para corredores que querem distância e velocidade. Prémios para classificação geral Masculino e Feminino. Cronometragem profissional de cada volta. Terreno variado e desafiante.",
            pricingPhases: {
              create: [
                {
                  name: "Inscrições em breve",
                  price: 0,
                  startDate: new Date("2026-06-01T00:00:00.000Z"),
                  endDate: new Date("2026-10-09T23:59:59.000Z"),
                  note: "Preços a anunciar. Acompanha @ocrportugallab1 para updates.",
                },
              ],
            },
          },
          {
            name: "🟣 TRAIL STANDARD - 10K",
            distanceKm: 10,
            cutoffTimeHours: 2,
            startDate: new Date("2026-10-11T10:00:00.000Z"),
            startTime: "10:00",
            description:
              "Trail de distância intermédia sem obstáculos. 10km com 2 voltas no Parque Urbano Outeiro Polima. Ideal para trail runners que procuram um desafio equilibrado ou querem melhorar o tempo numa distância conhecida. Cronometragem completa.",
            pricingPhases: {
              create: [
                {
                  name: "Inscrições em breve",
                  price: 0,
                  startDate: new Date("2026-06-01T00:00:00.000Z"),
                  endDate: new Date("2026-10-09T23:59:59.000Z"),
                  note: "Preços a anunciar. Acompanha @ocrportugallab1 para updates.",
                },
              ],
            },
          },
          {
            name: "🟢 TRAIL SHORT - 5K",
            distanceKm: 5,
            cutoffTimeHours: 1.5,
            startDate: new Date("2026-10-11T10:30:00.000Z"),
            startTime: "10:30",
            description:
              "Trail curto de 5km (1 volta) perfeito para iniciantes em trail running. Sem obstáculos, foca-se apenas na corrida. Descobre o belo percurso do Parque Urbano Outeiro Polima num formato acessível e cronometrado.",
            pricingPhases: {
              create: [
                {
                  name: "Inscrições em breve",
                  price: 0,
                  startDate: new Date("2026-06-01T00:00:00.000Z"),
                  endDate: new Date("2026-10-09T23:59:59.000Z"),
                  note: "Preços a anunciar. Acompanha @ocrportugallab1 para updates.",
                },
              ],
            },
          },
          {
            name: "🚶 CAMINHADA - 5K",
            distanceKm: 5,
            cutoffTimeHours: 2,
            startDate: new Date("2026-10-11T11:00:00.000Z"),
            startTime: "11:00",
            description:
              "Caminhada descontraída de 5km pelo Parque Urbano Outeiro Polima. Sem pressão de tempo, sem obstáculos. Perfeita para famílias, iniciantes ou quem quer simplesmente desfrutar do ambiente e da natureza. Todos são bem-vindos!",
            pricingPhases: {
              create: [
                {
                  name: "Inscrições em breve",
                  price: 0,
                  startDate: new Date("2026-06-01T00:00:00.000Z"),
                  endDate: new Date("2026-10-09T23:59:59.000Z"),
                  note: "Preços a anunciar. Acompanha @ocrportugallab1 para updates.",
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
  console.log(`   Sport Types: OCR + TRAIL`);
  console.log(
    `   Variants: 9 (INFINITY, TOUGH, STANDARD, SHORT, KIDS, TRAIL variants, CAMINHADA)`
  );
  console.log(`   Instagram: ${event.externalUrl}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
