/**
 * Seed: Passeio BTT - Associação "Os Teimosos de Barbeita" 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚵 Seeding Passeio BTT - Os Teimosos de Barbeita 2026...");

  const eventSlug = "passeio-btt-os-teimosos-barbeita-2026";

  // ============================================================================
  // 1. UPSERT EVENT (idempotent - no deletes)
  // ============================================================================
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: 'Passeio BTT - Associação "Os Teimosos de Barbeita"',
      description:
        "Junta-te a nós para uma manhã de BTT em ambiente de convívio, natureza e boa disposição em Barbeita, Viseu.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: null,
      city: "Barbeita",
      country: "Portugal",
      latitude: 40.7225,
      longitude: -8.0144,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Barbeita+Viseu+Portugal",
      externalUrl: null,
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-02-24T23:59:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: 'Passeio BTT - Associação "Os Teimosos de Barbeita"',
      description:
        "Junta-te a nós para uma manhã de BTT em ambiente de convívio, natureza e boa disposição em Barbeita, Viseu.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-03-01T09:00:00.000Z"),
      endDate: null,
      city: "Barbeita",
      country: "Portugal",
      latitude: 40.7225,
      longitude: -8.0144,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Barbeita+Viseu+Portugal",
      externalUrl: null,
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-02-24T23:59:00.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // ============================================================================
  // 2. UPSERT TRANSLATIONS (ALL 6 LANGUAGES)
  // ============================================================================
  const translations: Array<{
    language: Language;
    title: string;
    description: string;
    city: string;
    metaTitle: string;
    metaDescription: string;
  }> = [
    {
      language: Language.pt,
      title: 'Passeio BTT - Associação "Os Teimosos de Barbeita"',
      city: "Barbeita",
      metaTitle:
        "Passeio BTT Os Teimosos de Barbeita 2026 | Barbeita, Viseu | 1 Março",
      metaDescription:
        "Passeio BTT em Barbeita, Viseu, a 1 de março de 2026. Inscrição 10€, almoço 6€ e acompanhantes 8€. Organização: Associação Os Teimosos de Barbeita.",
      description: `# 🚵 Passeio BTT - Associação "Os Teimosos de Barbeita"

Vem pedalar connosco em Barbeita, Viseu, num passeio de **BTT** pensado para quem gosta de desporto, natureza e convívio.

## 📅 Quando e Onde

- **Data:** Domingo, 1 de março de 2026
- **Hora de partida:** 09:00
- **Concentração:** Recinto das Festas de Barbeita
- **Cidade:** Barbeita, Viseu
- **Limite de inscrição:** 24 de fevereiro de 2026 às 23:59

## 💶 Valores

| Tipo | Preço |
|------|-------|
| **Inscrição (sem almoço)** | 10,00€ |
| **Almoço (suplemento)** | 6,00€ |
| **Acompanhantes** | 8,00€ |

> 💡 **Pacote completo:** 16€ com almoço incluído

## ✅ O que está incluído

- ✅ Seguro desportivo
- ✅ Reforço alimentar durante o percurso
- ✅ Acesso a banhos
- ✅ Percurso em ambiente de convívio e natureza

## 🧾 Regulamento (resumo)

1. **Capacete obrigatório** durante todo o percurso
2. Cumprimento do **Código da Estrada** e das indicações da organização
3. **Proibido abandonar lixo** no percurso; respeita o ambiente e propriedades privadas
4. Cada participante é responsável pela sua condição física e equipamento
5. A organização reserva o direito de alterar o percurso por motivos de segurança

## 📞 Contactos da Organização

- **Organização:** Associação Os Teimosos de Barbeita
- **Telemóvel:** 926 711 314

Boa pedalada! 🏔️🚴`,
    },
    {
      language: Language.en,
      title: 'MTB Ride - Association "Os Teimosos de Barbeita"',
      city: "Barbeita",
      metaTitle:
        "MTB Ride Os Teimosos de Barbeita 2026 | Barbeita, Viseu | March 1",
      metaDescription:
        "MTB ride in Barbeita, Viseu, on March 1, 2026. Registration €10, lunch €6, companions €8. Organized by Associação Os Teimosos de Barbeita.",
      description: `# 🚵 MTB Ride - Association "Os Teimosos de Barbeita"

Join us in Barbeita, Viseu for a friendly **MTB** ride with sport, nature, and community spirit.

## 📅 Date and Location

- **Date:** Sunday, March 1, 2026
- **Start time:** 09:00
- **Meeting point:** Recinto das Festas de Barbeita
- **City:** Barbeita, Viseu
- **Registration deadline:** February 24, 2026 at 23:59

## 💶 Prices

| Type | Price |
|------|-------|
| **Registration (without lunch)** | €10.00 |
| **Lunch (supplement)** | €6.00 |
| **Companions** | €8.00 |

> 💡 **Full package:** €16 with lunch included

## ✅ Included

- ✅ Sports insurance
- ✅ Food station during the route
- ✅ Shower access
- ✅ Route in a friendly and natural environment

## 🧾 Rules Summary

1. **Helmet mandatory** throughout the entire route
2. Compliance with **Traffic Code** and organization instructions
3. **No littering** on the route; respect the environment and private properties
4. Each participant is responsible for their physical condition and equipment
5. The organization reserves the right to alter the route for safety reasons

## 📞 Organization Contact

- **Organizer:** Associação Os Teimosos de Barbeita
- **Mobile:** +351 926 711 314

See you on the trails! 🏔️🚴`,
    },
    {
      language: Language.es,
      title: 'Paseo BTT - Asociación "Os Teimosos de Barbeita"',
      city: "Barbeita",
      metaTitle:
        "Paseo BTT Os Teimosos de Barbeita 2026 | Barbeita, Viseu | 1 Marzo",
      metaDescription:
        "Paseo BTT en Barbeita, Viseu, el 1 de marzo de 2026. Inscripción 10€, almuerzo 6€ y acompañantes 8€. Organización: Associação Os Teimosos de Barbeita.",
      description: `# 🚵 Paseo BTT - Asociación "Os Teimosos de Barbeita"

Pedalea con nosotros en Barbeita, Viseu, en un paseo de **BTT** con deporte, naturaleza y convivencia.

## 📅 Fecha y Lugar

- **Fecha:** Domingo, 1 de marzo de 2026
- **Hora de salida:** 09:00
- **Punto de encuentro:** Recinto das Festas de Barbeita
- **Ciudad:** Barbeita, Viseu
- **Límite de inscripción:** 24 de febrero de 2026 a las 23:59

## 💶 Precios

| Tipo | Precio |
|------|--------|
| **Inscripción (sin almuerzo)** | 10,00€ |
| **Almuerzo (suplemento)** | 6,00€ |
| **Acompañantes** | 8,00€ |

> 💡 **Paquete completo:** 16€ con almuerzo incluido

## ✅ Incluye

- ✅ Seguro deportivo
- ✅ Refuerzo alimentario durante el recorrido
- ✅ Acceso a duchas
- ✅ Recorrido en ambiente de convivencia y naturaleza

## 📞 Contacto de la Organización

- **Organización:** Associação Os Teimosos de Barbeita
- **Móvil:** +351 926 711 314

¡Nos vemos en los senderos! 🏔️🚴`,
    },
    {
      language: Language.fr,
      title: 'Randonnée VTT - Association "Os Teimosos de Barbeita"',
      city: "Barbeita",
      metaTitle:
        "Randonnée VTT Os Teimosos de Barbeita 2026 | Barbeita, Viseu | 1 Mars",
      metaDescription:
        "Randonnée VTT à Barbeita, Viseu, le 1er mars 2026. Inscription 10€, déjeuner 6€, accompagnants 8€. Organisation: Associação Os Teimosos de Barbeita.",
      description: `# 🚵 Randonnée VTT - Association "Os Teimosos de Barbeita"

Rejoignez-nous à Barbeita, Viseu, pour une randonnée **VTT** conviviale entre sport et nature.

## 📅 Date et Lieu

- **Date :** Dimanche 1er mars 2026
- **Heure de départ :** 09h00
- **Point de rendez-vous :** Recinto das Festas de Barbeita
- **Ville :** Barbeita, Viseu
- **Date limite d'inscription :** 24 février 2026 à 23h59

## 💶 Tarifs

| Type | Prix |
|------|------|
| **Inscription (sans déjeuner)** | 10,00€ |
| **Déjeuner (supplément)** | 6,00€ |
| **Accompagnants** | 8,00€ |

> 💡 **Forfait complet :** 16€ avec déjeuner inclus

## ✅ Compris

- ✅ Assurance sportive
- ✅ Ravitaillement pendant le parcours
- ✅ Accès aux douches
- ✅ Parcours dans un environnement convivial et naturel

## 📞 Contact Organisation

- **Organisation :** Associação Os Teimosos de Barbeita
- **Mobile :** +351 926 711 314

À très vite sur les sentiers ! 🏔️🚴`,
    },
    {
      language: Language.de,
      title: 'BTT-Tour - Verein "Os Teimosos de Barbeita"',
      city: "Barbeita",
      metaTitle:
        "BTT-Tour Os Teimosos de Barbeita 2026 | Barbeita, Viseu | 1. März",
      metaDescription:
        "BTT-Tour in Barbeita, Viseu, am 1. März 2026. Anmeldung 10€, Mittagessen 6€, Begleitpersonen 8€. Veranstalter: Associação Os Teimosos de Barbeita.",
      description: `# 🚵 BTT-Tour - Verein "Os Teimosos de Barbeita"

Komm nach Barbeita, Viseu, und fahre mit uns eine gesellige **BTT**-Tour durch Natur und schöne Wege.

## 📅 Datum und Ort

- **Datum:** Sonntag, 1. März 2026
- **Startzeit:** 09:00
- **Treffpunkt:** Recinto das Festas de Barbeita
- **Stadt:** Barbeita, Viseu
- **Anmeldeschluss:** 24. Februar 2026 um 23:59 Uhr

## 💶 Preise

| Art | Preis |
|-----|-------|
| **Anmeldung (ohne Mittagessen)** | 10,00€ |
| **Mittagessen (Zuschlag)** | 6,00€ |
| **Begleitpersonen** | 8,00€ |

> 💡 **Komplettpaket:** 16€ mit Mittagessen

## ✅ Enthalten

- ✅ Sportversicherung
- ✅ Verpflegung während der Strecke
- ✅ Zugang zu Duschen
- ✅ Strecke in geselliger und natürlicher Umgebung

## 📞 Kontakt Organisation

- **Organisation:** Associação Os Teimosos de Barbeita
- **Mobil:** +351 926 711 314

Bis bald auf den Trails! 🏔️🚴`,
    },
    {
      language: Language.it,
      title: 'Passeggiata BTT - Associazione "Os Teimosos de Barbeita"',
      city: "Barbeita",
      metaTitle:
        "Passeggiata BTT Os Teimosos de Barbeita 2026 | Barbeita, Viseu | 1 Marzo",
      metaDescription:
        "Passeggiata BTT a Barbeita, Viseu, il 1° marzo 2026. Iscrizione 10€, pranzo 6€, accompagnatori 8€. Organizzazione: Associação Os Teimosos de Barbeita.",
      description: `# 🚵 Passeggiata BTT - Associazione "Os Teimosos de Barbeita"

Pedala con noi a Barbeita, Viseu, in una passeggiata **BTT** all'insegna di sport, natura e convivialità.

## 📅 Data e Luogo

- **Data:** Domenica 1 marzo 2026
- **Ora di partenza:** 09:00
- **Ritrovo:** Recinto das Festas de Barbeita
- **Città:** Barbeita, Viseu
- **Scadenza iscrizione:** 24 febbraio 2026 alle 23:59

## 💶 Prezzi

| Tipo | Prezzo |
|------|--------|
| **Iscrizione (senza pranzo)** | 10,00€ |
| **Pranzo (supplemento)** | 6,00€ |
| **Accompagnatori** | 8,00€ |

> 💡 **Pacchetto completo:** 16€ con pranzo incluso

## ✅ Include

- ✅ Assicurazione sportiva
- ✅ Ristoro durante il percorso
- ✅ Accesso alle docce
- ✅ Percorso in ambiente conviviale e naturale

## 📞 Contatto Organizzazione

- **Organizzazione:** Associação Os Teimosos de Barbeita
- **Cellulare:** +351 926 711 314

Ci vediamo sui sentieri! 🏔️🚴`,
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

  // ============================================================================
  // 3. UPSERT VARIANTS (idempotent with findFirst)
  // ============================================================================
  console.log("\n🚵 Creating variant...");

  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number | null;
    elevationGainM: number | null;
    startTime: string | null;
    maxParticipants: number | null;
    price: number;
    currency: Currency;
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

  const passeioVariant = await findOrCreateVariant({
    name: "Passeio BTT",
    distanceKm: 30,
    elevationGainM: null,
    startTime: "09:00",
    maxParticipants: null,
    price: 10.0,
    currency: Currency.EUR,
  });

  const variantTranslations = [
    {
      language: Language.pt,
      name: "Passeio BTT",
      description:
        "Participação no passeio de BTT. Inclui seguro desportivo, reforço alimentar e acesso a banhos. Almoço e acompanhantes têm custo adicional.",
    },
    {
      language: Language.en,
      name: "MTB Ride",
      description:
        "Participation in the MTB ride. Includes sports insurance, food station and shower access. Lunch and companions have additional cost.",
    },
    {
      language: Language.es,
      name: "Paseo BTT",
      description:
        "Participación en el paseo BTT. Incluye seguro deportivo, refuerzo alimentario y acceso a duchas. Almuerzo y acompañantes tienen coste adicional.",
    },
    {
      language: Language.fr,
      name: "Randonnée VTT",
      description:
        "Participation à la randonnée VTT. Comprend assurance sportive, ravitaillement et accès aux douches. Déjeuner et accompagnants ont un coût supplémentaire.",
    },
    {
      language: Language.de,
      name: "BTT-Tour",
      description:
        "Teilnahme an der BTT-Tour. Enthält Sportversicherung, Verpflegung und Zugang zu Duschen. Mittagessen und Begleitpersonen haben zusätzliche Kosten.",
    },
    {
      language: Language.it,
      name: "Passeggiata BTT",
      description:
        "Partecipazione alla passeggiata BTT. Include assicurazione sportiva, ristoro e accesso alle docce. Pranzo e accompagnatori hanno costo aggiuntivo.",
    },
  ];

  for (const translation of variantTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: passeioVariant.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: passeioVariant.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Passeio BTT created/updated");

  // ============================================================================
  // 4. UPSERT PRICING PHASES (linked to eventId - CRITICAL!)
  // ============================================================================
  console.log("\n💰 Creating pricing phases...");

  const findOrCreatePricingPhase = async (
    name: string,
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
        data,
      });
    } else {
      return await prisma.pricingPhase.create({
        data: { eventId: event.id, name, ...data },
      });
    }
  };

  await findOrCreatePricingPhase("Passeio BTT - Inscrição", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-24T23:59:00.000Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: "Participação sem almoço. Inclui seguro, reforço alimentar e banhos.",
  });

  await findOrCreatePricingPhase("Passeio BTT - Almoço (suplemento)", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-24T23:59:00.000Z"),
    price: 6.0,
    currency: Currency.EUR,
    note: "Suplemento de almoço por participante.",
  });

  await findOrCreatePricingPhase("Passeio BTT - Acompanhantes", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-02-24T23:59:00.000Z"),
    price: 8.0,
    currency: Currency.EUR,
    note: "Inscrição de acompanhante (não participante).",
  });

  console.log(`   ✅ Pricing phases created/updated (3 phases)`);

  // ============================================================================
  // 5. UPSERT FAQs WITH TRANSLATIONS
  // ============================================================================
  console.log("\n❓ Creating FAQs...");

  const faqs = [
    {
      order: 1,
      question: "É obrigatório usar capacete durante o passeio?",
      answer:
        "Sim. O uso de capacete é obrigatório durante todo o percurso, conforme regulamento da organização e legislação em vigor.",
      translations: {
        pt: {
          question: "É obrigatório usar capacete durante o passeio?",
          answer:
            "Sim. O uso de capacete é obrigatório durante todo o percurso, conforme regulamento da organização e legislação em vigor.",
        },
        en: {
          question: "Is helmet use mandatory during the ride?",
          answer:
            "Yes. Helmet use is mandatory throughout the entire route, according to organization rules and current legislation.",
        },
        es: {
          question: "¿Es obligatorio usar casco durante el paseo?",
          answer:
            "Sí. El uso de casco es obligatorio durante todo el recorrido, según el reglamento de la organización y la legislación vigente.",
        },
        fr: {
          question:
            "Le port du casque est-il obligatoire pendant la randonnée ?",
          answer:
            "Oui. Le port du casque est obligatoire pendant tout le parcours, selon le règlement de l'organisation et la législation en vigueur.",
        },
        de: {
          question: "Ist das Tragen eines Helms während der Tour Pflicht?",
          answer:
            "Ja. Das Tragen eines Helms ist auf der gesamten Strecke Pflicht, gemäß den Regeln der Organisation und der geltenden Gesetzgebung.",
        },
        it: {
          question: "È obbligatorio indossare il casco durante la pedalata?",
          answer:
            "Sì. L'uso del casco è obbligatorio per l'intero percorso, secondo il regolamento dell'organizzazione e la legislazione vigente.",
        },
      },
    },
    {
      order: 2,
      question: "Até quando posso pagar a inscrição?",
      answer:
        "Os pagamentos devem ser realizados até terça-feira, 24 de fevereiro de 2026, às 23:59. Após esta data, as inscrições serão encerradas.",
      translations: {
        pt: {
          question: "Até quando posso pagar a inscrição?",
          answer:
            "Os pagamentos devem ser realizados até terça-feira, 24 de fevereiro de 2026, às 23:59. Após esta data, as inscrições serão encerradas.",
        },
        en: {
          question: "Until when can I pay the registration?",
          answer:
            "Payments must be made by Tuesday, February 24, 2026, at 23:59. After this date, registrations will be closed.",
        },
        es: {
          question: "¿Hasta cuándo puedo pagar la inscripción?",
          answer:
            "Los pagos deben realizarse hasta el martes 24 de febrero de 2026 a las 23:59. Después de esta fecha, las inscripciones se cerrarán.",
        },
        fr: {
          question: "Jusqu'à quand puis-je payer l'inscription ?",
          answer:
            "Les paiements doivent être effectués jusqu'au mardi 24 février 2026 à 23h59. Après cette date, les inscriptions seront closes.",
        },
        de: {
          question: "Bis wann kann ich die Anmeldung bezahlen?",
          answer:
            "Zahlungen müssen bis Dienstag, den 24. Februar 2026, um 23:59 Uhr erfolgen. Nach diesem Datum werden die Anmeldungen geschlossen.",
        },
        it: {
          question: "Fino a quando posso pagare l'iscrizione?",
          answer:
            "I pagamenti devono essere effettuati entro martedì 24 febbraio 2026 alle 23:59. Dopo questa data, le iscrizioni saranno chiuse.",
        },
      },
    },
    {
      order: 3,
      question: "O almoço está incluído na inscrição de 10€?",
      answer:
        "Não. A inscrição de 10€ não inclui almoço. O almoço é um suplemento opcional de 6€ por pessoa. O pacote completo (inscrição + almoço) fica em 16€.",
      translations: {
        pt: {
          question: "O almoço está incluído na inscrição de 10€?",
          answer:
            "Não. A inscrição de 10€ não inclui almoço. O almoço é um suplemento opcional de 6€ por pessoa. O pacote completo (inscrição + almoço) fica em 16€.",
        },
        en: {
          question: "Is lunch included in the €10 registration?",
          answer:
            "No. The €10 registration does not include lunch. Lunch is an optional supplement of €6 per person. The full package (registration + lunch) costs €16.",
        },
        es: {
          question: "¿El almuerzo está incluido en la inscripción de 10€?",
          answer:
            "No. La inscripción de 10€ no incluye almuerzo. El almuerzo es un suplemento opcional de 6€ por persona. El paquete completo (inscripción + almuerzo) cuesta 16€.",
        },
        fr: {
          question: "Le déjeuner est-il inclus dans l'inscription à 10€ ?",
          answer:
            "Non. L'inscription à 10€ n'inclut pas le déjeuner. Le déjeuner est un supplément optionnel de 6€ par personne. Le forfait complet (inscription + déjeuner) coûte 16€.",
        },
        de: {
          question: "Ist das Mittagessen in der 10€ Anmeldung enthalten?",
          answer:
            "Nein. Die 10€ Anmeldung beinhaltet kein Mittagessen. Das Mittagessen ist ein optionaler Zuschlag von 6€ pro Person. Das Komplettpaket (Anmeldung + Mittagessen) kostet 16€.",
        },
        it: {
          question: "Il pranzo è incluso nell'iscrizione di 10€?",
          answer:
            "No. L'iscrizione di 10€ non include il pranzo. Il pranzo è un supplemento opzionale di 6€ a persona. Il pacchetto completo (iscrizione + pranzo) costa 16€.",
        },
      },
    },
  ];

  for (const faq of faqs) {
    const existingFAQ = await prisma.eventFAQ.findFirst({
      where: { eventId: event.id, order: faq.order },
    });

    let createdFAQ;
    if (existingFAQ) {
      createdFAQ = await prisma.eventFAQ.update({
        where: { id: existingFAQ.id },
        data: {
          question: faq.question,
          answer: faq.answer,
        },
      });
    } else {
      createdFAQ = await prisma.eventFAQ.create({
        data: {
          eventId: event.id,
          order: faq.order,
          question: faq.question,
          answer: faq.answer,
        },
      });
    }

    for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
      const translation = faq.translations[lang];
      await prisma.eventFAQTranslation.upsert({
        where: { faqId_language: { faqId: createdFAQ.id, language: lang } },
        update: {
          question: translation.question,
          answer: translation.answer,
        },
        create: {
          faqId: createdFAQ.id,
          language: lang,
          question: translation.question,
          answer: translation.answer,
        },
      });
    }
  }

  console.log(`   ✅ Created/updated ${faqs.length} FAQs with translations`);

  console.log(`
🚵 Passeio BTT - Os Teimosos de Barbeita 2026 seeded successfully!
   📍 Event: Passeio BTT - Associação "Os Teimosos de Barbeita"
   🔗 Slug: ${event.slug}
   📅 Date: 2026-03-01
   📍 Location: Recinto das Festas de Barbeita, Viseu
   🚵 Variant: Passeio BTT
   💰 Pricing: 3 phases (Inscrição 10€, Almoço 6€, Acompanhantes 8€)
   ❓ FAQs: ${faqs.length} questions with 6 language translations
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding event:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
