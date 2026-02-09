/**
 * Seed: 1ª Caminhada do Dia da Mulher 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding 1ª Caminhada do Dia da Mulher 2026...");

  const eventSlug = "caminhada-dia-mulher-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "1ª Caminhada do Dia da Mulher",
      description:
        "1ª Caminhada do Dia da Mulher em Penafirme da Mata, Alenquer. Organizada pelo Centro Cultural e Desportivo de Penafirme da Mata. Caminhada de 10km para celebrar o Dia Internacional da Mulher. Aberta a todos os sexos e idades.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-08T09:30:00.000Z"),
      endDate: null,
      city: "Penafirme da Mata, Alenquer",
      country: "Portugal",
      latitude: 39.0904,
      longitude: -9.0602,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=39.0904,-9.0602",
      externalUrl: "https://acorrer.pt/eventos/4189/info",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-03-03T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "1ª Caminhada do Dia da Mulher",
      description:
        "1ª Caminhada do Dia da Mulher em Penafirme da Mata, Alenquer. Organizada pelo Centro Cultural e Desportivo de Penafirme da Mata. Caminhada de 10km para celebrar o Dia Internacional da Mulher. Aberta a todos os sexos e idades.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-08T09:30:00.000Z"),
      endDate: null,
      city: "Penafirme da Mata, Alenquer",
      country: "Portugal",
      latitude: 39.0904,
      longitude: -9.0602,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=39.0904,-9.0602",
      externalUrl: "https://acorrer.pt/eventos/4189/info",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-03-03T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: "1ª Caminhada do Dia da Mulher",
      city: "Penafirme da Mata",
      metaTitle: "1ª Caminhada do Dia da Mulher 2026 | Alenquer | 8 Março",
      metaDescription:
        "1ª Caminhada do Dia da Mulher 2026 - 8 março em Penafirme da Mata, Alenquer. 1ª Edição celebrando o Dia Internacional da Mulher. 10km aberta a todos. T-shirt incluída. Limite 200 participantes. Inscrição: 6€.",
      description: `# 🏃 1ª Caminhada do Dia da Mulher 2026
## Celebrando o Dia Internacional da Mulher

A **1ª Caminhada do Dia da Mulher** é organizada pelo **Centro Cultural e Desportivo de Penafirme da Mata** para celebrar o **Dia Internacional da Mulher** (8 de março).

## 💜 Evento Especial

Uma caminhada inclusiva e solidária para **celebrar todas as mulheres**, aberta a participantes de **todos os sexos e idades**, promovendo a igualdade, o desporto e a convivência.

## 📅 Data e Programa

**Data:** Domingo, 8 de março de 2026

- **09:30** - Partida da Caminhada

## 🏃 Percurso

**Caminhada:** 10 km
**Dificuldade:** Média
**Terreno:** Estradas e caminhos da freguesia de Olhalvo

**Partida/Chegada:**
Em frente à sede do **Centro Cultural e Desportivo de Penafirme da Mata**

**Coordenadas:** 39º05'25.55" N / 9º03'36.72" W

## 💰 Preços

- **Caminhada:** 6€
- **Caminhada com almoço:** 12.50€
- **Almoço para acompanhantes:** 10€

## 🎁 Inscrição Inclui

- ✅ Participação no evento
- ✅ **T-shirt oficial do evento**
- ✅ **Abastecimento a meio do percurso**
- ✅ **Abastecimento na zona de chegada**
- ✅ Oferta especial
- ✅ Almoço (se selecionado)

## 👥 Participação

- **Limite:** 200 participantes
- **Aberta a:** Todos os sexos e classes etárias
- **Menores de idade:** Devem estar acompanhados por um adulto responsável

## ⚙️ Recomendações

- **Vestuário e calçado adequados** à prática da caminhada
- Cada participante é **responsável pela sua condição física**
- Estar consciente das distâncias e dificuldades específicas

## 📍 Localização

**Penafirme da Mata**
Freguesia de Olhalvo
Alenquer
Lisboa

**Coordenadas GPS:** 39.0904, -9.0602

## 📞 Contactos

- **Email:** ccdpenafirmedamata2@gmail.com

## 💜 Dia Internacional da Mulher

O **8 de março** é o Dia Internacional da Mulher, uma data para celebrar as conquistas sociais, económicas, culturais e políticas das mulheres, e para promover a igualdade de género.

Esta caminhada é uma forma de **celebrar todas as mulheres** através do desporto, da natureza e da convivência, reunindo a comunidade num evento inclusivo e solidário.

## 🌿 Responsabilidade Ambiental

Todos os participantes devem cumprir as **regras gerais de segurança** e respeitar todas as indicações da Organização e dos elementos de apoio.

A organização reserva-se o direito de **alterar o percurso** por razões de segurança ou força maior.`,
    },
    {
      language: "en" as const,
      title: "1st Women's Day Walk",
      city: "Penafirme da Mata",
      metaTitle: "1st Women's Day Walk 2026 | Alenquer | March 8",
      metaDescription:
        "1st Women's Day Walk 2026 - March 8 in Penafirme da Mata, Alenquer. 1st Edition celebrating International Women's Day. 10km open to all. T-shirt included. Limit 200 participants. Entry: €6.",
      description: `# 🏃 1st Women's Day Walk 2026
## Celebrating International Women's Day

The **1st Women's Day Walk** is organized by **Centro Cultural e Desportivo de Penafirme da Mata** to celebrate **International Women's Day** (March 8).

## 💜 Special Event

An inclusive and solidarity walk to **celebrate all women**, open to participants of **all genders and ages**, promoting equality, sport and community.

## 🏃 Route

**Walk:** 10 km
**Difficulty:** Medium
**Terrain:** Roads and paths of Olhalvo parish

**Start/Finish:**
In front of **Centro Cultural e Desportivo de Penafirme da Mata** headquarters

**Coordinates:** 39º05'25.55" N / 9º03'36.72" W

## 💰 Prices

- **Walk:** €6
- **Walk with lunch:** €12.50
- **Lunch for companions:** €10

## 🎁 Entry Includes

- ✅ Participation in event
- ✅ **Official event t-shirt**
- ✅ **Refreshment at mid-route**
- ✅ **Refreshment at finish area**
- ✅ Special gift
- ✅ Lunch (if selected)

## 👥 Participation

- **Limit:** 200 participants
- **Open to:** All genders and age groups
- **Minors:** Must be accompanied by a responsible adult

## 📍 Location

**Penafirme da Mata**
Olhalvo Parish
Alenquer
Lisbon, Portugal

**GPS Coordinates:** 39.0904, -9.0602

## 📞 Contacts

- **Email:** ccdpenafirmedamata2@gmail.com

## 💜 International Women's Day

**March 8** is International Women's Day, a date to celebrate women's social, economic, cultural and political achievements, and to promote gender equality.

This walk is a way to **celebrate all women** through sport, nature and community, bringing people together in an inclusive and solidarity event.`,
    },
    {
      language: "es" as const,
      title: "1ª Caminata del Día de la Mujer",
      city: "Penafirme da Mata",
      metaTitle: "1ª Caminata del Día de la Mujer 2026 | Alenquer | 8 Marzo",
      metaDescription:
        "1ª Caminata del Día de la Mujer 2026 - 8 marzo en Penafirme da Mata, Alenquer. 1ª Edición celebrando el Día Internacional de la Mujer. 10km abierta a todos. Camiseta incluida. Límite 200 participantes. Inscripción: 6€.",
      description: `# 🏃 1ª Caminata del Día de la Mujer 2026

## 📞 Contactos

- **Email:** ccdpenafirmedamata2@gmail.com`,
    },
    {
      language: "fr" as const,
      title: "1ère Marche de la Journée de la Femme",
      city: "Penafirme da Mata",
      metaTitle:
        "1ère Marche de la Journée de la Femme 2026 | Alenquer | 8 Mars",
      metaDescription:
        "1ère Marche de la Journée de la Femme 2026 - 8 mars à Penafirme da Mata, Alenquer. 1ère Édition célébrant la Journée Internationale de la Femme. 10km ouverte à tous. T-shirt inclus. Limite 200 participants. Inscription: 6€.",
      description: `# 🏃 1ère Marche de la Journée de la Femme 2026

## 📞 Contacts

- **Email:** ccdpenafirmedamata2@gmail.com`,
    },
    {
      language: "de" as const,
      title: "1. Frauentag-Wanderung",
      city: "Penafirme da Mata",
      metaTitle: "1. Frauentag-Wanderung 2026 | Alenquer | 8. März",
      metaDescription:
        "1. Frauentag-Wanderung 2026 - 8. März in Penafirme da Mata, Alenquer. 1. Ausgabe zum Internationalen Frauentag. 10km offen für alle. T-Shirt inklusive. Limit 200 Teilnehmer. Anmeldung: 6€.",
      description: `# 🏃 1. Frauentag-Wanderung 2026

## 📞 Kontakte

- **Email:** ccdpenafirmedamata2@gmail.com`,
    },
    {
      language: "it" as const,
      title: "1ª Camminata della Giornata della Donna",
      city: "Penafirme da Mata",
      metaTitle:
        "1ª Camminata della Giornata della Donna 2026 | Alenquer | 8 Marzo",
      metaDescription:
        "1ª Camminata della Giornata della Donna 2026 - 8 marzo a Penafirme da Mata, Alenquer. 1ª Edizione celebrando la Giornata Internazionale della Donna. 10km aperta a tutti. Maglietta inclusa. Limite 200 partecipanti. Iscrizione: 6€.",
      description: `# 🏃 1ª Camminata della Giornata della Donna 2026

## 📞 Contatti

- **Email:** ccdpenafirmedamata2@gmail.com`,
    },
  ];

  for (const translation of translations) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: translation.language,
        },
      },
      update: {
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
      create: {
        eventId: event.id,
        language: translation.language,
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
    });
  }

  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm?: number;
    elevationGainM?: number;
    startTime?: string;
    maxParticipants?: number;
    price?: number;
    currency?: Currency;
  }) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name: variantData.name },
    });
    if (existing) {
      return await prisma.eventVariant.update({
        where: { id: existing.id },
        data: variantData,
      });
    }
    return await prisma.eventVariant.create({
      data: { eventId: event.id, ...variantData },
    });
  };

  await findOrCreateVariant({
    name: "Caminhada 10 km",
    distanceKm: 10,
    elevationGainM: 200,
    startTime: "09:30",
    maxParticipants: 200,
    price: 6.0,
    currency: Currency.EUR,
  });

  console.log("✅ 1ª Caminhada do Dia da Mulher 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
