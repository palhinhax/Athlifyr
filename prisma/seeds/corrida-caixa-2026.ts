/**
 * Seed: Corrida Caixa 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Corrida Caixa 2026...");

  const eventSlug = "corrida-caixa-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Corrida Caixa 2026",
      description: `Marca já na tua agenda, no dia 19 de abril de 2026 contamos com a tua presença e da tua família para mais uma edição da Corrida Caixa!`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-19T09:00:00.000Z"),
      endDate: null,
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7223,
      longitude: -9.1393,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Lisboa+Portugal",
      externalUrl: "https://xistarca.pt/corrida-caixa-2026",
      imageUrl:
        "https://xistarca.pt/wp-content/uploads/2025/corrida-caixa-2026.jpg",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-18T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Corrida Caixa 2026",
      description: `Marca já na tua agenda, no dia 19 de abril de 2026 contamos com a tua presença e da tua família para mais uma edição da Corrida Caixa!`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-19T09:00:00.000Z"),
      endDate: null,
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7223,
      longitude: -9.1393,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Lisboa+Portugal",
      externalUrl: "https://xistarca.pt/corrida-caixa-2026",
      imageUrl:
        "https://xistarca.pt/wp-content/uploads/2025/corrida-caixa-2026.jpg",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-18T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  const translations: Array<{
    language: "pt" | "en" | "es" | "fr" | "de" | "it";
    title: string;
    description: string;
    city: string;
    metaTitle: string;
    metaDescription: string;
  }> = [
    {
      language: "pt",
      title: "Corrida Caixa 2026",
      description: `# 🏃‍♂️ BEM-VINDOS À CORRIDA CAIXA 2026

Marca já na tua agenda, no dia **19 de abril de 2026** contamos com a tua presença e da tua família para mais uma edição da **Corrida Caixa**!

## 📅 Data e Local

**Data:** 19 de Abril de 2026 (Sábado)  
**Local:** A anunciar  
**Cidade:** Lisboa, Portugal

## 📝 Inscrições

**FAZ JÁ A TUA INSCRIÇÃO!**

As inscrições estão abertas. Mais informações em breve.

Inscreve-te em: [xistarca.pt](https://xistarca.pt/corrida-caixa-2026)

## 🎯 Evento para Toda a Família

A Corrida Caixa é um evento pensado para toda a família, promovendo a prática de atividade física e o espírito de comunidade.

Quer sejas corredor experiente ou iniciante, esta é a tua oportunidade de participar num evento único em Lisboa!

## 📋 Informações Adicionais

Mais detalhes sobre percursos, horários, kit de participante e prémios serão divulgados em breve.

Mantém-te atento às redes sociais e ao site oficial para todas as novidades!

## 👥 Organização

**Organizador:** Xistarca / Caixa Geral de Depósitos

---

**Marca na agenda: 19 de Abril de 2026!**

Vem celebrar o desporto e a família na Corrida Caixa! 🏃‍♂️👨‍👩‍👧‍👦`,
      city: "Lisboa",
      metaTitle: "Corrida Caixa 2026 | Lisboa",
      metaDescription:
        "Corrida Caixa 2026 em Lisboa. Evento para toda a família. 19 de Abril de 2026. Inscreve-te já!",
    },
    {
      language: "en",
      title: "Caixa Race 2026",
      description: `# 🏃‍♂️ WELCOME TO CAIXA RACE 2026

Mark your calendar for **April 19, 2026** - we're counting on you and your family for another edition of the **Caixa Race**!

## 📅 Date and Location

**Date:** April 19, 2026 (Saturday)  
**Location:** To be announced  
**City:** Lisbon, Portugal

## 📝 Registration

**REGISTER NOW!**

Registration is open. More information coming soon.

Register at: [xistarca.pt](https://xistarca.pt/corrida-caixa-2026)

## 🎯 Event for the Whole Family

The Caixa Race is an event designed for the whole family, promoting physical activity and community spirit.

Whether you're an experienced runner or a beginner, this is your chance to participate in a unique event in Lisbon!

## 📋 Additional Information

More details about routes, schedules, participant kit and prizes will be announced soon.

Stay tuned to social media and the official website for all updates!

## 👥 Organization

**Organizer:** Xistarca / Caixa Geral de Depósitos

---

**Save the date: April 19, 2026!**

Come celebrate sports and family at the Caixa Race! 🏃‍♂️👨‍👩‍👧‍👦`,
      city: "Lisbon",
      metaTitle: "Caixa Race 2026 | Lisbon",
      metaDescription:
        "Caixa Race 2026 in Lisbon. Family-friendly event. April 19, 2026. Register now!",
    },
    {
      language: "es",
      title: "Carrera Caixa 2026",
      description: `# 🏃‍♂️ BIENVENIDOS A LA CARRERA CAIXA 2026

Marca en tu agenda el **19 de abril de 2026** - ¡contamos contigo y tu familia para otra edición de la **Carrera Caixa**!

## 📅 Fecha y Ubicación

**Fecha:** 19 de abril de 2026 (sábado)  
**Ubicación:** Por anunciar  
**Ciudad:** Lisboa, Portugal

¡Ven a celebrar el deporte y la familia en la Carrera Caixa! 🏃‍♂️👨‍👩‍👧‍👦`,
      city: "Lisboa",
      metaTitle: "Carrera Caixa 2026 | Lisboa",
      metaDescription:
        "Carrera Caixa 2026 en Lisboa. Evento familiar. 19 de abril de 2026. ¡Inscríbete ya!",
    },
    {
      language: "fr",
      title: "Course Caixa 2026",
      description: `# 🏃‍♂️ BIENVENUE À LA COURSE CAIXA 2026

Notez dans votre agenda le **19 avril 2026** - nous comptons sur vous et votre famille pour une nouvelle édition de la **Course Caixa**!

## 📅 Date et Lieu

**Date :** 19 avril 2026 (samedi)  
**Lieu :** À annoncer  
**Ville :** Lisbonne, Portugal

Venez célébrer le sport et la famille à la Course Caixa! 🏃‍♂️👨‍👩‍👧‍👦`,
      city: "Lisbonne",
      metaTitle: "Course Caixa 2026 | Lisbonne",
      metaDescription:
        "Course Caixa 2026 à Lisbonne. Événement familial. 19 avril 2026. Inscrivez-vous maintenant!",
    },
    {
      language: "de",
      title: "Caixa-Lauf 2026",
      description: `# 🏃‍♂️ WILLKOMMEN ZUM CAIXA-LAUF 2026

Markiere in deinem Kalender den **19. April 2026** - wir zählen auf dich und deine Familie für eine weitere Ausgabe des **Caixa-Laufs**!

## 📅 Datum und Ort

**Datum:** 19. April 2026 (Samstag)  
**Ort:** Noch bekanntzugeben  
**Stadt:** Lissabon, Portugal

Komm und feiere Sport und Familie beim Caixa-Lauf! 🏃‍♂️👨‍👩‍👧‍👦`,
      city: "Lissabon",
      metaTitle: "Caixa-Lauf 2026 | Lissabon",
      metaDescription:
        "Caixa-Lauf 2026 in Lissabon. Familienfreundliche Veranstaltung. 19. April 2026. Jetzt anmelden!",
    },
    {
      language: "it",
      title: "Corsa Caixa 2026",
      description: `# 🏃‍♂️ BENVENUTI ALLA CORSA CAIXA 2026

Segna sul tuo calendario il **19 aprile 2026** - contiamo su di te e la tua famiglia per un'altra edizione della **Corsa Caixa**!

## 📅 Data e Luogo

**Data:** 19 aprile 2026 (sabato)  
**Luogo:** Da annunciare  
**Città:** Lisbona, Portogallo

Vieni a celebrare lo sport e la famiglia alla Corsa Caixa! 🏃‍♂️👨‍👩‍👧‍👦`,
      city: "Lisbona",
      metaTitle: "Corsa Caixa 2026 | Lisbona",
      metaDescription:
        "Corsa Caixa 2026 a Lisbona. Evento per tutta la famiglia. 19 aprile 2026. Iscriviti ora!",
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

  console.log(
    "✅ Event translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Variants (to be added when more details are available)
  console.log("ℹ️  Variants will be added when event details are announced");

  console.log("");
  console.log("🎉 Corrida Caixa 2026 seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
