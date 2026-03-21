/**
 * Seed: Saúde em Movimento 2026
 *
 * Event: Group walk focused on wellness and nature trails
 * Location: Vila Franca do Rosário, Mafra, Portugal
 * Date: March 28, 2026
 * Organizer: Estúdio 21 by Ana Esteves
 * Sport: WALKING, TRAIL
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚶 Seeding Saúde em Movimento 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "saude-em-movimento-2026" },
    update: {
      title: "Saúde em Movimento 2026",
      description:
        "Saúde em Movimento 2026 - Caminhada solidária em Vila Franca do Rosário, Mafra",
      sportTypes: [SportType.WALKING, SportType.TRAIL],
      startDate: new Date("2026-03-28T09:30:00Z"),
      endDate: new Date("2026-03-28T12:00:00Z"),
      registrationDeadline: null,
      externalUrl: "",
      imageUrl: "",
      city: "Vila Franca do Rosário",
      country: "Portugal",
      latitude: 38.9376,
      longitude: -9.271,
      googleMapsUrl: "https://www.google.com/maps?q=38.9376,-9.2710",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "Saúde em Movimento 2026",
      slug: "saude-em-movimento-2026",
      description:
        "Saúde em Movimento 2026 - Caminhada solidária em Vila Franca do Rosário, Mafra",
      sportTypes: [SportType.WALKING, SportType.TRAIL],
      startDate: new Date("2026-03-28T09:30:00Z"),
      endDate: new Date("2026-03-28T12:00:00Z"),
      registrationDeadline: null,
      externalUrl: "",
      imageUrl: "",
      city: "Vila Franca do Rosário",
      country: "Portugal",
      latitude: 38.9376,
      longitude: -9.271,
      googleMapsUrl: "https://www.google.com/maps?q=38.9376,-9.2710",
      isFeatured: false,
      cancelled: false,
    },
  });

  console.log(`✅ Created/updated event: ${event.slug}`);

  // ──────────────────────────────────────────────
  // 2. Translations (ALL 6 languages)
  // ──────────────────────────────────────────────
  const translations: Record<
    string,
    {
      title: string;
      description: string;
      city: string;
      metaTitle: string;
      metaDescription: string;
    }
  > = {
    pt: {
      title: "Saúde em Movimento 2026",
      description: `# 🚶 Saúde em Movimento 2026

**Caminhada solidária organizada pelo Estúdio 21 by Ana Esteves, a 28 de março de 2026 em Vila Franca do Rosário, Mafra.** Evento gratuito focado no bem-estar, saúde e convívio, com o objetivo de ajudar uma associação de apoio animal.

---

## 🏔️ Percurso

- **Caminhada 6/8 km** – Percurso circular · Dificuldade média · Acessível à maioria das pessoas

---

## ℹ️ Informações

- 📍 **Local:** Vila Franca do Rosário, Mafra
- 🗓 **Data:** 28 de março de 2026 (sábado)
- ⏰ **Partida:** 9h30
- ⏱ **Duração estimada:** 2 horas
- 🌳 **Tipo de percurso:** Circular, em ambiente florestal
- 💰 **Preço:** Gratuito (inscrição obrigatória)

---

## 📋 Recomendações

- Trazer roupa confortável
- Trazer garrafa de água

---

## 📞 Inscrições

O evento é gratuito mas carece de inscrição prévia:

- 📱 **Telefone:** 917 433 379
- 📧 **Email:** estudio21byanaesteves@gmail.com
- 📷 **Instagram:** @estudio21byanaesteves

---

🚶 **Vem caminhar por uma boa causa!** 🌿`,
      city: "Vila Franca do Rosário, Mafra",
      metaTitle:
        "Saúde em Movimento 2026 | Vila Franca do Rosário, Mafra | 28 Março",
      metaDescription:
        "Saúde em Movimento 2026 - Caminhada solidária gratuita a 28 de março em Vila Franca do Rosário, Mafra. Percurso circular de 6/8 km em trilhos naturais. Organização: Estúdio 21 by Ana Esteves.",
    },
    en: {
      title: "Health in Motion 2026",
      description: `# 🚶 Health in Motion 2026

**Solidarity walk organized by Estúdio 21 by Ana Esteves, on March 28, 2026 in Vila Franca do Rosário, Mafra.** A free event focused on wellness, health and socializing, aiming to support an animal welfare association.

---

## 🏔️ Route

- **6/8 km Walk** – Circular route · Medium difficulty · Accessible to most people

---

## ℹ️ Information

- 📍 **Location:** Vila Franca do Rosário, Mafra
- 🗓 **Date:** March 28, 2026 (Saturday)
- ⏰ **Start:** 9:30 AM
- ⏱ **Estimated duration:** 2 hours
- 🌳 **Route type:** Circular, forest trails
- 💰 **Price:** Free (registration required)

---

## 📋 Recommendations

- Wear comfortable clothing
- Bring a water bottle

---

## 📞 Registration

The event is free but requires prior registration:

- 📱 **Phone:** 917 433 379
- 📧 **Email:** estudio21byanaesteves@gmail.com
- 📷 **Instagram:** @estudio21byanaesteves

---

🚶 **Come walk for a good cause!** 🌿`,
      city: "Vila Franca do Rosário, Mafra",
      metaTitle:
        "Health in Motion 2026 | Vila Franca do Rosário, Mafra | March 28",
      metaDescription:
        "Health in Motion 2026 - Free solidarity walk on March 28 in Vila Franca do Rosário, Mafra. Circular 6/8 km route on nature trails. Organized by Estúdio 21 by Ana Esteves.",
    },
    es: {
      title: "Salud en Movimiento 2026",
      description: `# 🚶 Salud en Movimiento 2026

**Caminata solidaria organizada por Estúdio 21 by Ana Esteves, el 28 de marzo de 2026 en Vila Franca do Rosário, Mafra.** Evento gratuito centrado en el bienestar, la salud y la convivencia, con el objetivo de ayudar a una asociación de protección animal.

---

## 🏔️ Recorrido

- **Caminata 6/8 km** – Recorrido circular · Dificultad media · Accesible para la mayoría

---

## ℹ️ Información

- 📍 **Ubicación:** Vila Franca do Rosário, Mafra
- 🗓 **Fecha:** 28 de marzo de 2026 (sábado)
- ⏰ **Salida:** 9:30
- ⏱ **Duración estimada:** 2 horas
- 🌳 **Tipo de recorrido:** Circular, senderos forestales
- 💰 **Precio:** Gratuito (inscripción obligatoria)

---

## 📋 Recomendaciones

- Llevar ropa cómoda
- Llevar botella de agua

---

## 📞 Inscripciones

El evento es gratuito pero requiere inscripción previa:

- 📱 **Teléfono:** 917 433 379
- 📧 **Email:** estudio21byanaesteves@gmail.com
- 📷 **Instagram:** @estudio21byanaesteves

---

🚶 **¡Ven a caminar por una buena causa!** 🌿`,
      city: "Vila Franca do Rosário, Mafra",
      metaTitle:
        "Salud en Movimiento 2026 | Vila Franca do Rosário, Mafra | 28 Marzo",
      metaDescription:
        "Salud en Movimiento 2026 - Caminata solidaria gratuita el 28 de marzo en Vila Franca do Rosário, Mafra. Recorrido circular de 6/8 km por senderos naturales. Organización: Estúdio 21 by Ana Esteves.",
    },
    fr: {
      title: "Santé en Mouvement 2026",
      description: `# 🚶 Santé en Mouvement 2026

**Marche solidaire organisée par Estúdio 21 by Ana Esteves, le 28 mars 2026 à Vila Franca do Rosário, Mafra.** Événement gratuit axé sur le bien-être, la santé et la convivialité, ayant pour but de soutenir une association de protection animale.

---

## 🏔️ Parcours

- **Marche 6/8 km** – Parcours circulaire · Difficulté moyenne · Accessible à la plupart des personnes

---

## ℹ️ Informations

- 📍 **Lieu :** Vila Franca do Rosário, Mafra
- 🗓 **Date :** 28 mars 2026 (samedi)
- ⏰ **Départ :** 9h30
- ⏱ **Durée estimée :** 2 heures
- 🌳 **Type de parcours :** Circulaire, sentiers forestiers
- 💰 **Prix :** Gratuit (inscription obligatoire)

---

## 📋 Recommandations

- Porter des vêtements confortables
- Apporter une bouteille d'eau

---

## 📞 Inscriptions

L'événement est gratuit mais nécessite une inscription préalable :

- 📱 **Téléphone :** 917 433 379
- 📧 **Email :** estudio21byanaesteves@gmail.com
- 📷 **Instagram :** @estudio21byanaesteves

---

🚶 **Venez marcher pour une bonne cause !** 🌿`,
      city: "Vila Franca do Rosário, Mafra",
      metaTitle:
        "Santé en Mouvement 2026 | Vila Franca do Rosário, Mafra | 28 Mars",
      metaDescription:
        "Santé en Mouvement 2026 - Marche solidaire gratuite le 28 mars à Vila Franca do Rosário, Mafra. Parcours circulaire de 6/8 km sur sentiers naturels. Organisation : Estúdio 21 by Ana Esteves.",
    },
    de: {
      title: "Gesundheit in Bewegung 2026",
      description: `# 🚶 Gesundheit in Bewegung 2026

**Solidaritätswanderung organisiert von Estúdio 21 by Ana Esteves, am 28. März 2026 in Vila Franca do Rosário, Mafra.** Kostenlose Veranstaltung mit Fokus auf Wohlbefinden, Gesundheit und Gemeinschaft, zur Unterstützung eines Tierschutzvereins.

---

## 🏔️ Strecke

- **Wanderung 6/8 km** – Rundstrecke · Mittlere Schwierigkeit · Für die meisten Teilnehmer geeignet

---

## ℹ️ Informationen

- 📍 **Ort:** Vila Franca do Rosário, Mafra
- 🗓 **Datum:** 28. März 2026 (Samstag)
- ⏰ **Start:** 9:30 Uhr
- ⏱ **Geschätzte Dauer:** 2 Stunden
- 🌳 **Streckentyp:** Rundkurs, Waldwege
- 💰 **Preis:** Kostenlos (Anmeldung erforderlich)

---

## 📋 Empfehlungen

- Bequeme Kleidung tragen
- Wasserflasche mitbringen

---

## 📞 Anmeldung

Die Veranstaltung ist kostenlos, erfordert aber eine vorherige Anmeldung:

- 📱 **Telefon:** 917 433 379
- 📧 **E-Mail:** estudio21byanaesteves@gmail.com
- 📷 **Instagram:** @estudio21byanaesteves

---

🚶 **Komm und wandere für einen guten Zweck!** 🌿`,
      city: "Vila Franca do Rosário, Mafra",
      metaTitle:
        "Gesundheit in Bewegung 2026 | Vila Franca do Rosário, Mafra | 28. März",
      metaDescription:
        "Gesundheit in Bewegung 2026 - Kostenlose Solidaritätswanderung am 28. März in Vila Franca do Rosário, Mafra. Rundstrecke 6/8 km auf Naturwegen. Organisation: Estúdio 21 by Ana Esteves.",
    },
    it: {
      title: "Salute in Movimento 2026",
      description: `# 🚶 Salute in Movimento 2026

**Camminata solidale organizzata da Estúdio 21 by Ana Esteves, il 28 marzo 2026 a Vila Franca do Rosário, Mafra.** Evento gratuito incentrato sul benessere, la salute e la socializzazione, a sostegno di un'associazione per la protezione degli animali.

---

## 🏔️ Percorso

- **Camminata 6/8 km** – Percorso circolare · Difficoltà media · Accessibile alla maggior parte delle persone

---

## ℹ️ Informazioni

- 📍 **Luogo:** Vila Franca do Rosário, Mafra
- 🗓 **Data:** 28 marzo 2026 (sabato)
- ⏰ **Partenza:** 9:30
- ⏱ **Durata stimata:** 2 ore
- 🌳 **Tipo di percorso:** Circolare, sentieri nel bosco
- 💰 **Prezzo:** Gratuito (iscrizione obbligatoria)

---

## 📋 Raccomandazioni

- Indossare abbigliamento comodo
- Portare una bottiglia d'acqua

---

## 📞 Iscrizioni

L'evento è gratuito ma richiede iscrizione preventiva:

- 📱 **Telefono:** 917 433 379
- 📧 **Email:** estudio21byanaesteves@gmail.com
- 📷 **Instagram:** @estudio21byanaesteves

---

🚶 **Vieni a camminare per una buona causa!** 🌿`,
      city: "Vila Franca do Rosário, Mafra",
      metaTitle:
        "Salute in Movimento 2026 | Vila Franca do Rosário, Mafra | 28 Marzo",
      metaDescription:
        "Salute in Movimento 2026 - Camminata solidale gratuita il 28 marzo a Vila Franca do Rosário, Mafra. Percorso circolare di 6/8 km su sentieri naturali. Organizzazione: Estúdio 21 by Ana Esteves.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: { eventId: event.id, language: Language[lang] },
      },
      update: {
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
      create: {
        eventId: event.id,
        language: Language[lang],
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
    console.log(`✅ Translation [${lang}] upserted`);
  }

  // ──────────────────────────────────────────────
  // 3. Variants (findOrCreate helper)
  // ──────────────────────────────────────────────
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM: number | null;
    elevationLossM: number | null;
    startDate: Date;
    startTime: string;
    cutoffTimeHours: number | null;
    price: number;
    currency: Currency;
    maxParticipants: number | null;
    atrpGrade: number | null;
    itraPoints: number | null;
    description: string;
  }) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name: variantData.name },
    });

    if (existing) {
      return await prisma.eventVariant.update({
        where: { id: existing.id },
        data: variantData,
      });
    } else {
      return await prisma.eventVariant.create({
        data: { eventId: event.id, ...variantData },
      });
    }
  };

  const findOrCreatePricingPhase = async (
    name: string,
    variantId: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      note: string | null;
    }
  ) => {
    const existing = await prisma.pricingPhase.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.pricingPhase.update({
        where: { id: existing.id },
        data: { ...data, variantId },
      });
    } else {
      return await prisma.pricingPhase.create({
        data: { eventId: event.id, variantId, name, ...data },
      });
    }
  };

  // ── Variant: Caminhada 6/8 km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 6/8km",
    distanceKm: 7,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-03-28T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: 2,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Caminhada 6/8km · Percurso circular · Dificuldade média · Duração estimada 2h",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (linked to eventId AND variantId)
  // ──────────────────────────────────────────────
  await findOrCreatePricingPhase(
    `${caminhada.name} - Inscrição Gratuita`,
    caminhada.id,
    {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-03-28T09:30:00Z"),
      price: 0,
      currency: Currency.EUR,
      note: "Evento gratuito · Inscrição obrigatória via contacto direto",
    }
  );
  console.log(`   - 1 pricing phase for ${caminhada.name}`);

  // ──────────────────────────────────────────────
  // 5. FAQs with translations (ALL 6 languages)
  // ──────────────────────────────────────────────
  const findOrCreateFAQ = async (
    eventId: string,
    order: number,
    question: string,
    answer: string
  ) => {
    const existing = await prisma.eventFAQ.findFirst({
      where: { eventId, order },
    });
    if (existing)
      return await prisma.eventFAQ.update({
        where: { id: existing.id },
        data: { question, answer },
      });
    return await prisma.eventFAQ.create({
      data: { eventId, order, question, answer },
    });
  };

  // FAQ 0: What is this event?
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "O que é o Saúde em Movimento?",
    "O Saúde em Movimento é um evento de caminhada em grupo organizado pelo Estúdio 21 by Ana Esteves, focado no bem-estar, saúde e convívio. Os percursos são circulares em trilhos naturais na zona de Vila Franca do Rosário."
  );

  const faq0Translations = {
    pt: {
      question: "O que é o Saúde em Movimento?",
      answer:
        "O Saúde em Movimento é um evento de caminhada em grupo organizado pelo Estúdio 21 by Ana Esteves, focado no bem-estar, saúde e convívio. Os percursos são circulares em trilhos naturais na zona de Vila Franca do Rosário.",
    },
    en: {
      question: "What is Health in Motion?",
      answer:
        "Health in Motion is a group walking event organized by Estúdio 21 by Ana Esteves, focused on wellness, health and socializing. The routes are circular on nature trails in the Vila Franca do Rosário area.",
    },
    es: {
      question: "¿Qué es Salud en Movimiento?",
      answer:
        "Salud en Movimiento es un evento de caminata en grupo organizado por Estúdio 21 by Ana Esteves, centrado en el bienestar, la salud y la convivencia. Los recorridos son circulares por senderos naturales en la zona de Vila Franca do Rosário.",
    },
    fr: {
      question: "Qu'est-ce que Santé en Mouvement ?",
      answer:
        "Santé en Mouvement est un événement de marche en groupe organisé par Estúdio 21 by Ana Esteves, axé sur le bien-être, la santé et la convivialité. Les parcours sont circulaires sur des sentiers naturels dans la zone de Vila Franca do Rosário.",
    },
    de: {
      question: "Was ist Gesundheit in Bewegung?",
      answer:
        "Gesundheit in Bewegung ist eine Gruppenwanderung, organisiert von Estúdio 21 by Ana Esteves, mit Fokus auf Wohlbefinden, Gesundheit und Gemeinschaft. Die Strecken sind Rundkurse auf Naturwegen im Gebiet von Vila Franca do Rosário.",
    },
    it: {
      question: "Cos'è Salute in Movimento?",
      answer:
        "Salute in Movimento è un evento di camminata di gruppo organizzato da Estúdio 21 by Ana Esteves, incentrato sul benessere, la salute e la socializzazione. I percorsi sono circolari su sentieri naturali nella zona di Vila Franca do Rosário.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq0.id, language: Language[lang] } },
      update: faq0Translations[lang],
      create: {
        faqId: faq0.id,
        language: Language[lang],
        ...faq0Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 0 + translations upserted");

  // FAQ 1: How to register?
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "Como me inscrevo?",
    "O evento é gratuito mas carece de inscrição. Envia mensagem para o número 917 433 379, email estudio21byanaesteves@gmail.com ou contacta através do Instagram @estudio21byanaesteves."
  );

  const faq1Translations = {
    pt: {
      question: "Como me inscrevo?",
      answer:
        "O evento é gratuito mas carece de inscrição. Envia mensagem para o número 917 433 379, email estudio21byanaesteves@gmail.com ou contacta através do Instagram @estudio21byanaesteves.",
    },
    en: {
      question: "How do I register?",
      answer:
        "The event is free but requires registration. Send a message to 917 433 379, email estudio21byanaesteves@gmail.com or contact via Instagram @estudio21byanaesteves.",
    },
    es: {
      question: "¿Cómo me inscribo?",
      answer:
        "El evento es gratuito pero requiere inscripción. Envía un mensaje al 917 433 379, email estudio21byanaesteves@gmail.com o contacta a través de Instagram @estudio21byanaesteves.",
    },
    fr: {
      question: "Comment s'inscrire ?",
      answer:
        "L'événement est gratuit mais nécessite une inscription. Envoyez un message au 917 433 379, email estudio21byanaesteves@gmail.com ou contactez via Instagram @estudio21byanaesteves.",
    },
    de: {
      question: "Wie melde ich mich an?",
      answer:
        "Die Veranstaltung ist kostenlos, erfordert aber eine Anmeldung. Sende eine Nachricht an 917 433 379, E-Mail estudio21byanaesteves@gmail.com oder kontaktiere über Instagram @estudio21byanaesteves.",
    },
    it: {
      question: "Come mi iscrivo?",
      answer:
        "L'evento è gratuito ma richiede iscrizione. Invia un messaggio al 917 433 379, email estudio21byanaesteves@gmail.com o contatta tramite Instagram @estudio21byanaesteves.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq1.id, language: Language[lang] } },
      update: faq1Translations[lang],
      create: {
        faqId: faq1.id,
        language: Language[lang],
        ...faq1Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 1 + translations upserted");

  // FAQ 2: What should I bring?
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "O que devo levar?",
    "Recomenda-se levar roupa confortável e uma garrafa de água. O percurso é em ambiente florestal, pelo que calçado adequado para trilhos é aconselhável."
  );

  const faq2Translations = {
    pt: {
      question: "O que devo levar?",
      answer:
        "Recomenda-se levar roupa confortável e uma garrafa de água. O percurso é em ambiente florestal, pelo que calçado adequado para trilhos é aconselhável.",
    },
    en: {
      question: "What should I bring?",
      answer:
        "It is recommended to bring comfortable clothing and a water bottle. The route is in a forest environment, so suitable trail footwear is advisable.",
    },
    es: {
      question: "¿Qué debo llevar?",
      answer:
        "Se recomienda llevar ropa cómoda y una botella de agua. El recorrido es en entorno forestal, por lo que calzado adecuado para senderos es aconsejable.",
    },
    fr: {
      question: "Que dois-je apporter ?",
      answer:
        "Il est recommandé d'apporter des vêtements confortables et une bouteille d'eau. Le parcours est en milieu forestier, des chaussures adaptées aux sentiers sont donc conseillées.",
    },
    de: {
      question: "Was soll ich mitbringen?",
      answer:
        "Es wird empfohlen, bequeme Kleidung und eine Wasserflasche mitzubringen. Die Strecke führt durch Waldgebiet, daher ist geeignetes Schuhwerk für Wanderwege ratsam.",
    },
    it: {
      question: "Cosa devo portare?",
      answer:
        "Si consiglia di portare abbigliamento comodo e una bottiglia d'acqua. Il percorso è in ambiente boschivo, quindi calzature adatte ai sentieri sono consigliabili.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: Language[lang] } },
      update: faq2Translations[lang],
      create: {
        faqId: faq2.id,
        language: Language[lang],
        ...faq2Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 2 + translations upserted");

  // FAQ 3: Is there a competitive component?
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Há componente competitiva?",
    "Não. O Saúde em Movimento é um evento não competitivo, focado no bem-estar, atividade física ao ar livre e convívio. Não há cronometragem nem classificações."
  );

  const faq3Translations = {
    pt: {
      question: "Há componente competitiva?",
      answer:
        "Não. O Saúde em Movimento é um evento não competitivo, focado no bem-estar, atividade física ao ar livre e convívio. Não há cronometragem nem classificações.",
    },
    en: {
      question: "Is there a competitive component?",
      answer:
        "No. Health in Motion is a non-competitive event focused on wellness, outdoor physical activity and socializing. There is no timing or rankings.",
    },
    es: {
      question: "¿Hay componente competitivo?",
      answer:
        "No. Salud en Movimiento es un evento no competitivo, centrado en el bienestar, la actividad física al aire libre y la convivencia. No hay cronometraje ni clasificaciones.",
    },
    fr: {
      question: "Y a-t-il un composant compétitif ?",
      answer:
        "Non. Santé en Mouvement est un événement non compétitif, axé sur le bien-être, l'activité physique en plein air et la convivialité. Il n'y a ni chronométrage ni classements.",
    },
    de: {
      question: "Gibt es einen Wettbewerbsaspekt?",
      answer:
        "Nein. Gesundheit in Bewegung ist eine nicht-wettbewerbliche Veranstaltung mit Fokus auf Wohlbefinden, körperliche Aktivität im Freien und Gemeinschaft. Es gibt keine Zeitmessung oder Ranglisten.",
    },
    it: {
      question: "C'è una componente competitiva?",
      answer:
        "No. Salute in Movimento è un evento non competitivo, incentrato sul benessere, l'attività fisica all'aperto e la socializzazione. Non ci sono cronometraggi né classifiche.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: Language[lang] } },
      update: faq3Translations[lang],
      create: {
        faqId: faq3.id,
        language: Language[lang],
        ...faq3Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 3 + translations upserted");

  console.log(`
✅ Seed complete: Saúde em Movimento 2026
- Slug: saude-em-movimento-2026
- Event: ${event.id}
- Translations: 6 languages (pt, en, es, fr, de, it)
- Variants: 1 (Caminhada 6/8km)
- Pricing Phases: 1 (free registration)
- FAQs: 4 with translations in 6 languages
- Location: Vila Franca do Rosário, Mafra
- Coordinates: 38.9376, -9.2710
- Organization: Estúdio 21 by Ana Esteves
- Sport: WALKING, TRAIL
- Date: March 28, 2026
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
