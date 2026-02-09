/**
 * Seed: Entre Trilhos Malpiqueiros 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding Entre Trilhos Malpiqueiros 2026...");

  const eventSlug = "entre-trilhos-malpiqueiros-2026";

  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Entre Trilhos Malpiqueiros",
      description:
        "Passeio de BTT não competitivo em Malpica do Tejo. Percurso de 40km com dificuldade média por asfalto, paralelo e terra batida. Organizado pela Junta de Freguesia. Almoço incluído.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-05-10T09:00:00.000Z"),
      endDate: null,
      city: "Malpica do Tejo",
      country: "Portugal",
      latitude: 39.7,
      longitude: -8.0333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Malpica+do+Tejo+Castelo+Branco+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4191/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-08T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Entre Trilhos Malpiqueiros",
      description:
        "Passeio de BTT não competitivo em Malpica do Tejo. Percurso de 40km com dificuldade média por asfalto, paralelo e terra batida. Organizado pela Junta de Freguesia. Almoço incluído.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-05-10T09:00:00.000Z"),
      endDate: null,
      city: "Malpica do Tejo",
      country: "Portugal",
      latitude: 39.7,
      longitude: -8.0333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Malpica+do+Tejo+Castelo+Branco+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4191/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-08T23:59:59.000Z"),
    },
  });

  const translations = [
    {
      language: "pt" as const,
      title: "Entre Trilhos Malpiqueiros",
      city: "Malpica do Tejo",
      metaTitle: "Entre Trilhos Malpiqueiros 2026 | Malpica do Tejo | 10 Maio",
      metaDescription:
        "Entre Trilhos Malpiqueiros 2026 - 10 maio em Malpica do Tejo. Passeio BTT não competitivo 40km, dificuldade média. Almoço, brinde e reforço incluídos. Limite 500 participantes. Inscrição: 15€.",
      description: `# 🚴 Entre Trilhos Malpiqueiros 2026

O **Passeio BTT Entre Trilhos Malpiqueiros** é um evento **não competitivo** organizado pela **Junta de Freguesia de Malpica do Tejo**, com o objetivo de promover a prática desportiva, o convívio e a descoberta da região.

## 📅 Data e Programa

**Data:** Domingo, 10 de maio de 2026

- 08:00 - Abertura do secretariado (Largo do Cosso)
- 09:00 - Partida

## 🚴 Percurso

**Percurso:** 40 km
**Dificuldade:** Média

Percurso misto em **asfalto, paralelo e terra batida**, caracterizado pela facilidade de execução e pelo enquadramento ímpar proporcionado pela **beleza natural das paisagens** da região de Malpica do Tejo.

Adequado não só para atletas regulares, mas também para praticantes moderados e iniciantes.

## 💰 Preço

- **Inscrição:** 15€ (15 Malpiqueiros)
- **Acompanhantes:** 10€

## 🎁 Inscrição Inclui

- ✅ Participação no evento
- ✅ Seguro de Acidentes Pessoais
- ✅ Dorsal
- ✅ **Reforço alimentar** durante o percurso
- ✅ Acesso aos **balneários** para banho final
- ✅ **Almoço convívio** no final do passeio
- ✅ Lembrança ou brinde
- ✅ **Lavagem de bicicletas**

## 👥 Participação

- **Limite:** 500 atletas
- **Idade mínima:** 16 anos
- **Equipamento obrigatório:** Capacete homologado
- **Tempo limite:** 4 horas e 30 minutos

## ⚙️ Regras Importantes

- Evento **não competitivo** de carácter recreativo e desportivo
- **Sem cronometragem** de tempos
- Capacete obrigatório durante todo o percurso
- Percursos sinalizados com **fitas amarelas e pretas** e setas de direção
- Cada participante é responsável pela sua bicicleta
- Recomenda-se preparação física adequada

## 📍 Localização

**Partida/Chegada:**
Largo do Cosso
Malpica do Tejo
Castelo Branco

## 📞 Contactos

- **Rui Vicente:** 961 979 843
- **Bruno Pina:** 966 682 440

## 🏞️ Região de Malpica do Tejo

Desfrute das paisagens naturais únicas da região de Malpica do Tejo num passeio de convívio e descoberta.`,
    },
    {
      language: "en" as const,
      title: "Between Malpiqueiros Trails",
      city: "Malpica do Tejo",
      metaTitle: "Between Malpiqueiros Trails 2026 | Malpica do Tejo | May 10",
      metaDescription:
        "Between Malpiqueiros Trails 2026 - May 10 in Malpica do Tejo. Non-competitive MTB ride 40km, medium difficulty. Lunch, gift and refreshments included. Limit 500 participants. Entry: €15.",
      description: `# 🚴 Between Malpiqueiros Trails 2026

The **Between Malpiqueiros Trails MTB Ride** is a **non-competitive** event organized by **Malpica do Tejo Parish Council**, aimed at promoting sports, socializing, and discovering the region.

## 🚴 Route

**Distance:** 40 km
**Difficulty:** Medium

Mixed route on **asphalt, gravel and dirt**, characterized by ease of execution and the unique setting provided by the **natural beauty** of the Malpica do Tejo region landscapes.

Suitable not only for regular athletes, but also for moderate and beginner riders.

## 💰 Price

- **Entry:** €15
- **Companions:** €10

## 🎁 Entry Includes

- Participation in event
- Personal Accident Insurance
- Race number
- **Refreshments** during route
- Access to **showers** for final bath
- **Lunch** at the end of the ride
- Souvenir or gift
- **Bike wash**

## 👥 Participation

- **Limit:** 500 athletes
- **Minimum age:** 16 years
- **Mandatory equipment:** Approved helmet
- **Time limit:** 4 hours and 30 minutes

## 📍 Location

**Start/Finish:**
Largo do Cosso
Malpica do Tejo
Castelo Branco

## 📞 Contacts

- **Rui Vicente:** +351 961 979 843
- **Bruno Pina:** +351 966 682 440`,
    },
    {
      language: "es" as const,
      title: "Entre Senderos Malpiqueiros",
      city: "Malpica do Tejo",
      metaTitle: "Entre Senderos Malpiqueiros 2026 | Malpica do Tejo | 10 Mayo",
      metaDescription:
        "Entre Senderos Malpiqueiros 2026 - 10 mayo en Malpica do Tejo. Paseo BTT no competitivo 40km, dificultad media. Almuerzo, regalo y refrigerio incluidos. Límite 500 participantes. Inscripción: 15€.",
      description: `# 🚴 Entre Senderos Malpiqueiros 2026

## 📞 Contactos

- **Rui Vicente:** +351 961 979 843
- **Bruno Pina:** +351 966 682 440`,
    },
    {
      language: "fr" as const,
      title: "Entre Sentiers Malpiqueiros",
      city: "Malpica do Tejo",
      metaTitle: "Entre Sentiers Malpiqueiros 2026 | Malpica do Tejo | 10 Mai",
      metaDescription:
        "Entre Sentiers Malpiqueiros 2026 - 10 mai à Malpica do Tejo. Randonnée VTT non compétitive 40km, difficulté moyenne. Déjeuner, cadeau et rafraîchissements inclus. Limite 500 participants. Inscription: 15€.",
      description: `# 🚴 Entre Sentiers Malpiqueiros 2026

## 📞 Contacts

- **Rui Vicente:** +351 961 979 843
- **Bruno Pina:** +351 966 682 440`,
    },
    {
      language: "de" as const,
      title: "Zwischen Malpiqueiros-Pfaden",
      city: "Malpica do Tejo",
      metaTitle:
        "Zwischen Malpiqueiros-Pfaden 2026 | Malpica do Tejo | 10. Mai",
      metaDescription:
        "Zwischen Malpiqueiros-Pfaden 2026 - 10. Mai in Malpica do Tejo. Nicht-wettbewerbliche MTB-Fahrt 40km, mittlere Schwierigkeit. Mittagessen, Geschenk und Erfrischungen inklusive. Limit 500 Teilnehmer. Anmeldung: 15€.",
      description: `# 🚴 Zwischen Malpiqueiros-Pfaden 2026

## 📞 Kontakte

- **Rui Vicente:** +351 961 979 843
- **Bruno Pina:** +351 966 682 440`,
    },
    {
      language: "it" as const,
      title: "Tra Sentieri Malpiqueiros",
      city: "Malpica do Tejo",
      metaTitle: "Tra Sentieri Malpiqueiros 2026 | Malpica do Tejo | 10 Maggio",
      metaDescription:
        "Tra Sentieri Malpiqueiros 2026 - 10 maggio a Malpica do Tejo. Pedalata MTB non competitiva 40km, difficoltà media. Pranzo, regalo e ristori inclusi. Limite 500 partecipanti. Iscrizione: 15€.",
      description: `# 🚴 Tra Sentieri Malpiqueiros 2026

## 📞 Contatti

- **Rui Vicente:** +351 961 979 843
- **Bruno Pina:** +351 966 682 440`,
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
    name: "Passeio 40 km",
    distanceKm: 40,
    elevationGainM: 400,
    startTime: "09:00",
    maxParticipants: 500,
    price: 15.0,
    currency: Currency.EUR,
  });

  console.log("✅ Entre Trilhos Malpiqueiros 2026 seeded!");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
