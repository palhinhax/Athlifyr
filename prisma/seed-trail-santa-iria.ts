import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Trail Santa Iria 2026...");

  // Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "trail-santa-iria-2026" },
    update: {},
    create: {
      title: "Trail Santa Iria 2026",
      slug: "trail-santa-iria-2026",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-01T09:00:00.000Z"),
      registrationDeadline: new Date("2026-01-26T23:59:00.000Z"),
      city: "Gondomar",
      country: "Portugal",
      description: `# Trail Santa Iria 2026

**Trail Running Event in Gondomar, Portugal**

## 🏃 Sobre o Evento

O **Trail Santa Iria 2026** é uma prova de trail running organizada pela **StopAndGo** que terá lugar em Gondomar, Portugal, no dia 1 de fevereiro de 2026.

O evento oferece três distâncias diferentes para corredores de todos os níveis, desde atletas experientes até caminhantes que procuram desfrutar das paisagens naturais da região.

## 🏃 Provas Disponíveis

### 23KM Trail
- **Distância:** 23 km
- **Perfil:** Trail de média/longa distância
- **Nível:** Intermédio a avançado

### 13KM Trail
- **Distância:** 13 km
- **Perfil:** Trail de curta/média distância
- **Nível:** Iniciado a intermédio

### Caminhada 10KM
- **Distância:** 10 km
- **Perfil:** Caminhada não competitiva
- **Nível:** Todos os níveis

## 📍 Local

**Gondomar, Portugal**

A região de Gondomar oferece trilhos e caminhos ideais para a prática de trail running, com paisagens naturais e percursos variados.

## 📅 Quando

**Data:** 1 de fevereiro de 2026

## 📝 Inscrições

As inscrições decorrem em 3 fases com diferentes preços:

### 1ª Fase (19 Nov 2025 - 31 Dez 2025)
- 23KM: €19.00
- 13KM: €14.00
- Caminhada 10KM: €10.00

### 2ª Fase (1 Jan 2026 - 18 Jan 2026)
- 23KM: €21.00
- 13KM: €16.00
- Caminhada 10KM: €10.00

### 3ª Fase (19 Jan 2026 - 26 Jan 2026)
- 23KM: €25.00
- 13KM: €21.00
- Caminhada 10KM: €10.00

**Fim das Inscrições:** 26 de janeiro de 2026 às 23:59

## 🎽 Extras

- **T-Shirt** do evento (opcional)

## 👥 Organização

**Organizador Principal:**
- **StopAndGo** - Gestão de eventos desportivos

## 📞 Contactos

**Website e Inscrições:**
- [stopandgo.net](https://stopandgo.net/events/trail-santa-iria-2026/registrations/create)

## 📋 Informações Importantes

⚠️ **A inscrição implica total aceitação do regulamento da prova.**

Para mais informações, consulte o site oficial do evento ou contacte a organização.

---

**© 2026 StopAndGo. Todos os direitos reservados.**`,
      externalUrl:
        "https://stopandgo.net/events/trail-santa-iria-2026/registrations/create",
      latitude: 41.1435,
      longitude: -8.5378,
      googleMapsUrl: "https://maps.app.goo.gl/QSxvZYCVxHqJmhYX7",
      variants: {
        create: [
          // 23KM Trail
          {
            name: "23KM Trail",
            distanceKm: 23,
            description: "Trail de média/longa distância - 23 km",
            startDate: new Date("2026-02-01T09:00:00.000Z"),
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-11-19T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:59.999Z"),
                  price: 19.0,
                  note: "Preço promocional - 1ª Fase",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2026-01-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-18T23:59:59.999Z"),
                  price: 21.0,
                  note: "Preço normal - 2ª Fase",
                },
                {
                  name: "3ª Fase",
                  startDate: new Date("2026-01-19T00:00:00.000Z"),
                  endDate: new Date("2026-01-26T23:59:00.000Z"),
                  price: 25.0,
                  note: "Preço final - 3ª Fase",
                },
              ],
            },
          },
          // 13KM Trail
          {
            name: "13KM Trail",
            distanceKm: 13,
            description: "Trail de curta/média distância - 13 km",
            startDate: new Date("2026-02-01T09:30:00.000Z"),
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-11-19T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:59.999Z"),
                  price: 14.0,
                  note: "Preço promocional - 1ª Fase",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2026-01-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-18T23:59:59.999Z"),
                  price: 16.0,
                  note: "Preço normal - 2ª Fase",
                },
                {
                  name: "3ª Fase",
                  startDate: new Date("2026-01-19T00:00:00.000Z"),
                  endDate: new Date("2026-01-26T23:59:00.000Z"),
                  price: 21.0,
                  note: "Preço final - 3ª Fase",
                },
              ],
            },
          },
          // Caminhada 10KM
          {
            name: "Caminhada 10KM",
            distanceKm: 10,
            description: "Caminhada não competitiva - 10 km",
            startDate: new Date("2026-02-01T10:00:00.000Z"),
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-11-19T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:59.999Z"),
                  price: 10.0,
                  note: "Preço fixo - 1ª Fase",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2026-01-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-18T23:59:59.999Z"),
                  price: 10.0,
                  note: "Preço fixo - 2ª Fase",
                },
                {
                  name: "3ª Fase",
                  startDate: new Date("2026-01-19T00:00:00.000Z"),
                  endDate: new Date("2026-01-26T23:59:00.000Z"),
                  price: 10.0,
                  note: "Preço fixo - 3ª Fase",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Created event: Trail Santa Iria 2026");
  console.log(`   - ID: ${event.id}`);
  console.log(`   - Slug: ${event.slug}`);
  console.log(`   - Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   - City: ${event.city}`);
  console.log(`   - Variants: 3 (23KM Trail, 13KM Trail, Caminhada 10KM)`);
  console.log("");
  console.log("🏃 Trail Santa Iria 2026 seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
