import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding 41.º Grande Prémio Atletismo ACD Os Ílhavos...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "gp-atletismo-os-ilhavos-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing GP Atletismo Os Ílhavos event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  // Create the event
  const event = await prisma.event.create({
    data: {
      title: "41.º Grande Prémio Atletismo ACD Os Ílhavos",
      slug: "gp-atletismo-os-ilhavos-2026",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-01-25T09:30:00.000Z"),
      registrationDeadline: new Date("2026-01-21T23:59:00.000Z"),
      city: "Ílhavo",
      country: "Portugal",
      latitude: 40.5977,
      longitude: -8.6709,
      description: `# 41.º Grande Prémio Atletismo ACD "Os Ílhavos"

O **Grande Prémio de Atletismo ACD "Os Ílhavos"** é uma prova com **medição oficial da distância**, certificada pela **Federação Portuguesa de Atletismo**.

## 🏃 Provas Disponíveis

O evento inclui provas para todos os escalões etários:

### Escalões Jovens
- **09h30 - Juvenis M/F** (2009-2010): 3.400m
- **10h00 - Iniciados M/F** (2011-2012): 2.200m
- **10h15 - Infantis M/F** (2013-2014): 1.600m
- **10h25 - Benjamins B M/F** (2015-2016): 400m
- **10h30 - Benjamins A M/F** (2017-2018): 400m
- **10h35 - Escolinhas 3.º/4.º ano M/F**: 800m
- **10h45 - Escolinhas 1.º/2.º ano M/F**: 800m

### Prova Principal
- **11h15 - Juniores/Seniores/Veteranos M/F**: 5.500m
  - Juniores: 2007-2008
  - Seniores: ≥2006
  - Veteranos 1: 40-49 anos
  - Veteranos 2: ≥50 anos

## 📋 Classificações

### Individual
- Juniores/Seniores Feminino
- Juniores/Seniores Masculino (classificação única)
- Veteranas (classificação única)
- Veteranos 1
- Veteranos 2

### Coletiva
- Juniores/Seniores Feminino
- Juniores/Seniores Masculino
- Veteranas

**Nota:** Vence a equipa com menos pontos (somatório dos 3 primeiros atletas).

## 🎯 Inscrição

**Gratuita para:**
- Benjamins
- Infantis
- Iniciados
- Juvenis

**Juniores, Seniores e Veteranos:**

| Período | Federados | Não Federados |
|---------|-----------|---------------|
| Até 17/01/2026 | 8€ | 10€ |
| 18/01 a 21/01/2026 | 10€ | 10€ |

**Inclui:**
- Dorsal com chip
- T-shirt técnica
- Seguro (para não federados)

## 🏆 Prémios Monetários

### Juniores/Seniores (Masculino e Feminino)
- **1.º lugar:** 150€
- **2.º lugar:** 100€
- **3.º lugar:** 75€
- **4.º lugar:** 40€
- **5.º lugar:** 30€
- **6.º-8.º lugar:** 25€/20€/20€
- **9.º-10.º lugar:** 10€

### Veteranos (Vet 1 M, Vet 2 M e Veteranas)
- **1.º lugar:** 50€
- **2.º lugar:** 30€
- **3.º lugar:** 20€

### Troféus
- 1.º ao 3.º lugar individual (todos os escalões)
- 1.º ao 3.º lugar coletivo

## ⏱️ Cronometragem

Cronometragem **eletrónica** para todas as provas (exceto escolinhas).

## 🎖️ Certificação

Prova com **medição oficial** certificada pela **Federação Portuguesa de Atletismo**.

## 🏛️ Júri

Designado pelo Conselho Regional de Arbitragem da Associação de Atletismo de Aveiro.

## 📅 Programa

**25 de Janeiro de 2026**
- 09h30 - Partida Juvenis
- 10h00 - Partida Iniciados
- 10h15 - Partida Infantis
- 10h25 - Partida Benjamins B
- 10h30 - Partida Benjamins A
- 10h35 - Partida Escolinhas 3.º/4.º ano
- 10h45 - Partida Escolinhas 1.º/2.º ano
- 11h15 - Partida Juniores/Seniores/Veteranos
- 12h00 - Entrega de prémios Juniores/Seniores/Veteranos

*Nota: Prémios dos escalões jovens são entregues durante as provas*

## 🏢 Instalações

- Banhos disponíveis no clube
- Serviço de bar

## 📞 Participação

Podem participar:
- Atletas federados
- Atletas populares
- Agrupamentos escolares

## 👥 Organização

**Associação Cultural e Desportiva "Os Ílhavos"**

**Cronometragem:**
- LAP2GO

---

⚠️ **A inscrição implica total aceitação do regulamento da prova.**`,
      externalUrl: "https://lap2go.com/pt/event/gp-atletismo-os-ilhavos-2026",
      variants: {
        create: [
          // Juniores/Seniores/Veteranos 5500m
          {
            name: "Juniores/Seniores/Veteranos 5.500m",
            distanceKm: 5.5,
            elevationGainM: null,
            cutoffTimeHours: null,
            atrpGrade: null,
            startTime: "11:15",
            startDate: new Date("2026-01-25T11:15:00.000Z"),
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase - Federados",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-17T23:59:59.000Z"),
                  price: 8.0,
                  discountPercent: null,
                  note: "Até 17/01/2026 - Federados",
                },
                {
                  name: "1ª Fase - Não Federados",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-17T23:59:59.000Z"),
                  price: 10.0,
                  discountPercent: null,
                  note: "Até 17/01/2026 - Não Federados",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2026-01-18T00:00:00.000Z"),
                  endDate: new Date("2026-01-21T23:59:59.000Z"),
                  price: 10.0,
                  discountPercent: null,
                  note: "18/01 a 21/01/2026 - Todos",
                },
              ],
            },
          },
          // Juvenis 3400m
          {
            name: "Juvenis 3.400m",
            distanceKm: 3.4,
            elevationGainM: null,
            cutoffTimeHours: null,
            atrpGrade: null,
            startTime: "09:30",
            startDate: new Date("2026-01-25T09:30:00.000Z"),
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Gratuita",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-21T23:59:59.000Z"),
                  price: 0.0,
                  discountPercent: null,
                  note: "Gratuita - Nascidos 2009-2010",
                },
              ],
            },
          },
          // Iniciados 2200m
          {
            name: "Iniciados 2.200m",
            distanceKm: 2.2,
            elevationGainM: null,
            cutoffTimeHours: null,
            atrpGrade: null,
            startTime: "10:00",
            startDate: new Date("2026-01-25T10:00:00.000Z"),
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Gratuita",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-21T23:59:59.000Z"),
                  price: 0.0,
                  discountPercent: null,
                  note: "Gratuita - Nascidos 2011-2012",
                },
              ],
            },
          },
          // Infantis 1600m
          {
            name: "Infantis 1.600m",
            distanceKm: 1.6,
            elevationGainM: null,
            cutoffTimeHours: null,
            atrpGrade: null,
            startTime: "10:15",
            startDate: new Date("2026-01-25T10:15:00.000Z"),
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Gratuita",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-21T23:59:59.000Z"),
                  price: 0.0,
                  discountPercent: null,
                  note: "Gratuita - Nascidos 2013-2014",
                },
              ],
            },
          },
          // Benjamins 400m
          {
            name: "Benjamins 400m",
            distanceKm: 0.4,
            elevationGainM: null,
            cutoffTimeHours: null,
            atrpGrade: null,
            startTime: "10:25",
            startDate: new Date("2026-01-25T10:25:00.000Z"),
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Gratuita",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-21T23:59:59.000Z"),
                  price: 0.0,
                  discountPercent: null,
                  note: "Gratuita - Nascidos 2015-2018",
                },
              ],
            },
          },
          // Escolinhas 800m
          {
            name: "Escolinhas 800m",
            distanceKm: 0.8,
            elevationGainM: null,
            cutoffTimeHours: null,
            atrpGrade: null,
            startTime: "10:35",
            startDate: new Date("2026-01-25T10:35:00.000Z"),
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Gratuita",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-21T23:59:59.000Z"),
                  price: 0.0,
                  discountPercent: null,
                  note: "Gratuita - 1.º ao 4.º ano",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Created event: 41.º GP Atletismo ACD Os Ílhavos");
  console.log(`   - ID: ${event.id}`);
  console.log(`   - Slug: ${event.slug}`);
  console.log(`   - Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   - City: ${event.city}`);
  console.log(`   - Location: ${event.latitude}, ${event.longitude}`);
  console.log(
    `   - Variants: 6 (5500m, 3400m, 2200m, 1600m, 400m, 800m escolinhas)`
  );
  console.log("");
  console.log("🏃 GP Atletismo Os Ílhavos seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
