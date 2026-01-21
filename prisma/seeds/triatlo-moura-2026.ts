/**
 * Seed Triatlo de Média Distância de Moura 2026
 * Complete with translations in all 6 languages (pt, en, es, fr, de, it)
 * Organizer: Federação de Triatlo de Portugal
 * Partner: Município de Moura
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏊 Seeding Triatlo de Média Distância de Moura 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "triatlo-moura-2026" },
    update: {
      title: "Triatlo de Média Distância de Moura 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Triatlo de Média Distância de Moura 2026

**Média distância de Moura com preço especial em janeiro**

Já estão abertas, e com desconto, as inscrições para o Triatlo de Média Distância de Moura que se realiza no dia **26 de abril de 2026**. Quem se inscrever durante o mês de janeiro beneficia de um valor reduzido de **80 euros**, antes do preço regular de 120 euros que vigorará em abril.

### 🌄 O Evento

A competição regressa ao **Alentejo** para desafiar atletas num percurso que combina exigência, beleza natural e o ambiente característico da região. Organizado pela **Federação de Triatlo de Portugal**, em parceria com o **Município de Moura**, o evento promete mais uma edição de grande qualidade.

### 🏊 O Percurso

- **Natação:** 1,9 km
- **Ciclismo:** 90 km
- **Corrida:** 21 km

### 💰 Inscrições

As vagas são **limitadas**. Garante já o teu lugar e aproveita o desconto de início de ano!

**Preços por fase:**
- 💵 **Janeiro:** 80€
- 💶 **Fevereiro:** 90€
- 💷 **Março:** 100€
- 💸 **Abril:** 120€`,
      sportTypes: ["TRIATHLON"],
      startDate: new Date("2026-04-26T08:00:00Z"),
      endDate: new Date("2026-04-26T16:00:00Z"),
      city: "Moura",
      country: "Portugal",
      latitude: 38.1400,
      longitude: -7.4500,
      googleMapsUrl: "https://maps.app.goo.gl/YQxV8zKJMqXyZ7jR9",
      externalUrl: "https://www.federacao-triatlo.pt/media-distancia-moura-2026/",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-25T23:59:59Z"),
    },
    create: {
      title: "Triatlo de Média Distância de Moura 2026",
      slug: "triatlo-moura-2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Triatlo de Média Distância de Moura 2026

**Média distância de Moura com preço especial em janeiro**

Já estão abertas, e com desconto, as inscrições para o Triatlo de Média Distância de Moura que se realiza no dia **26 de abril de 2026**. Quem se inscrever durante o mês de janeiro beneficia de um valor reduzido de **80 euros**, antes do preço regular de 120 euros que vigorará em abril.

### 🌄 O Evento

A competição regressa ao **Alentejo** para desafiar atletas num percurso que combina exigência, beleza natural e o ambiente característico da região. Organizado pela **Federação de Triatlo de Portugal**, em parceria com o **Município de Moura**, o evento promete mais uma edição de grande qualidade.

### 🏊 O Percurso

- **Natação:** 1,9 km
- **Ciclismo:** 90 km
- **Corrida:** 21 km

### 💰 Inscrições

As vagas são **limitadas**. Garante já o teu lugar e aproveita o desconto de início de ano!

**Preços por fase:**
- 💵 **Janeiro:** 80€
- 💶 **Fevereiro:** 90€
- 💷 **Março:** 100€
- 💸 **Abril:** 120€`,
      sportTypes: ["TRIATHLON"],
      startDate: new Date("2026-04-26T08:00:00Z"),
      endDate: new Date("2026-04-26T16:00:00Z"),
      city: "Moura",
      country: "Portugal",
      latitude: 38.1400,
      longitude: -7.4500,
      googleMapsUrl: "https://maps.app.goo.gl/YQxV8zKJMqXyZ7jR9",
      externalUrl: "https://www.federacao-triatlo.pt/media-distancia-moura-2026/",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-25T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  const translations = [
    {
      language: "pt",
      title: "Triatlo de Média Distância de Moura 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Triatlo de Média Distância de Moura 2026

**Média distância de Moura com preço especial em janeiro**

Já estão abertas, e com desconto, as inscrições para o Triatlo de Média Distância de Moura que se realiza no dia **26 de abril de 2026**. Quem se inscrever durante o mês de janeiro beneficia de um valor reduzido de **80 euros**, antes do preço regular de 120 euros que vigorará em abril.

### 🌄 O Evento

A competição regressa ao **Alentejo** para desafiar atletas num percurso que combina exigência, beleza natural e o ambiente característico da região. Organizado pela **Federação de Triatlo de Portugal**, em parceria com o **Município de Moura**, o evento promete mais uma edição de grande qualidade.

### 🏊 O Percurso

- **Natação:** 1,9 km
- **Ciclismo:** 90 km
- **Corrida:** 21 km

### 💰 Inscrições

As vagas são **limitadas**. Garante já o teu lugar e aproveita o desconto de início de ano!

**Preços por fase:**
- 💵 **Janeiro:** 80€
- 💶 **Fevereiro:** 90€
- 💷 **Março:** 100€
- 💸 **Abril:** 120€`,
      city: "Moura",
      metaTitle: "Triatlo de Média Distância de Moura 2026 | Alentejo, Portugal",
      metaDescription: "Inscreve-te no Triatlo de Média Distância de Moura 2026 (26 de abril). Desconto especial em janeiro - 80€! Organizado pela Federação de Triatlo de Portugal no coração do Alentejo.",
    },
    {
      language: "en",
      title: "Moura Middle Distance Triathlon 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Moura Middle Distance Triathlon 2026

**Moura middle distance with special January price**

Registration is now open with a discount for the Moura Middle Distance Triathlon taking place on **April 26, 2026**. Those who register during January benefit from a reduced rate of **80 euros**, before the regular price of 120 euros that will apply in April.

### 🌄 The Event

The competition returns to **Alentejo** to challenge athletes on a course that combines demanding terrain, natural beauty, and the region's characteristic atmosphere. Organized by the **Portuguese Triathlon Federation** in partnership with the **Municipality of Moura**, the event promises another high-quality edition.

### 🏊 The Course

- **Swim:** 1.9 km
- **Bike:** 90 km
- **Run:** 21 km

### 💰 Registration

Spots are **limited**. Secure your place now and take advantage of the early year discount!

**Pricing by phase:**
- 💵 **January:** €80
- 💶 **February:** €90
- 💷 **March:** €100
- 💸 **April:** €120`,
      city: "Moura",
      metaTitle: "Moura Middle Distance Triathlon 2026 | Alentejo, Portugal",
      metaDescription: "Register for the Moura Middle Distance Triathlon 2026 (April 26). Special January discount - €80! Organized by the Portuguese Triathlon Federation in the heart of Alentejo.",
    },
    {
      language: "es",
      title: "Triatlón de Media Distancia de Moura 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Triatlón de Media Distancia de Moura 2026

**Media distancia de Moura con precio especial en enero**

Ya están abiertas, y con descuento, las inscripciones para el Triatlón de Media Distancia de Moura que se celebra el **26 de abril de 2026**. Quienes se inscriban durante el mes de enero se benefician de un precio reducido de **80 euros**, antes del precio regular de 120 euros que regirá en abril.

### 🌄 El Evento

La competición regresa al **Alentejo** para desafiar a los atletas en un recorrido que combina exigencia, belleza natural y el ambiente característico de la región. Organizado por la **Federación Portuguesa de Triatlón** en colaboración con el **Municipio de Moura**, el evento promete otra edición de gran calidad.

### 🏊 El Recorrido

- **Natación:** 1,9 km
- **Ciclismo:** 90 km
- **Carrera:** 21 km

### 💰 Inscripciones

Las plazas son **limitadas**. ¡Asegura tu plaza ya y aprovecha el descuento de principio de año!

**Precios por fase:**
- 💵 **Enero:** 80€
- 💶 **Febrero:** 90€
- 💷 **Marzo:** 100€
- 💸 **Abril:** 120€`,
      city: "Moura",
      metaTitle: "Triatlón de Media Distancia de Moura 2026 | Alentejo, Portugal",
      metaDescription: "Inscríbete en el Triatlón de Media Distancia de Moura 2026 (26 de abril). ¡Descuento especial en enero - 80€! Organizado por la Federación Portuguesa de Triatlón en el corazón del Alentejo.",
    },
    {
      language: "fr",
      title: "Triathlon Moyenne Distance de Moura 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Moyenne Distance de Moura 2026

**Moyenne distance de Moura avec prix spécial en janvier**

Les inscriptions sont maintenant ouvertes avec réduction pour le Triathlon Moyenne Distance de Moura qui se déroulera le **26 avril 2026**. Ceux qui s'inscrivent pendant le mois de janvier bénéficient d'un tarif réduit de **80 euros**, avant le prix régulier de 120 euros qui s'appliquera en avril.

### 🌄 L'Événement

La compétition revient dans l'**Alentejo** pour défier les athlètes sur un parcours qui combine exigence, beauté naturelle et l'atmosphère caractéristique de la région. Organisé par la **Fédération Portugaise de Triathlon** en partenariat avec la **Municipalité de Moura**, l'événement promet une nouvelle édition de grande qualité.

### 🏊 Le Parcours

- **Natation :** 1,9 km
- **Vélo :** 90 km
- **Course :** 21 km

### 💰 Inscriptions

Les places sont **limitées**. Réservez votre place dès maintenant et profitez de la réduction de début d'année !

**Tarifs par phase :**
- 💵 **Janvier :** 80€
- 💶 **Février :** 90€
- 💷 **Mars :** 100€
- 💸 **Avril :** 120€`,
      city: "Moura",
      metaTitle: "Triathlon Moyenne Distance de Moura 2026 | Alentejo, Portugal",
      metaDescription: "Inscrivez-vous au Triathlon Moyenne Distance de Moura 2026 (26 avril). Réduction spéciale en janvier - 80€ ! Organisé par la Fédération Portugaise de Triathlon au cœur de l'Alentejo.",
    },
    {
      language: "de",
      title: "Moura Mitteldistanz-Triathlon 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Moura Mitteldistanz-Triathlon 2026

**Mitteldistanz von Moura mit Sonderpreis im Januar**

Die Anmeldung ist jetzt mit Rabatt für den Moura Mitteldistanz-Triathlon geöffnet, der am **26. April 2026** stattfindet. Wer sich im Januar anmeldet, profitiert von einem reduzierten Preis von **80 Euro**, bevor der reguläre Preis von 120 Euro im April gilt.

### 🌄 Die Veranstaltung

Der Wettbewerb kehrt ins **Alentejo** zurück, um Athleten auf einer Strecke herauszufordern, die anspruchsvolles Gelände, natürliche Schönheit und die charakteristische Atmosphäre der Region kombiniert. Organisiert vom **Portugiesischen Triathlon-Verband** in Partnerschaft mit der **Gemeinde Moura**, verspricht die Veranstaltung eine weitere hochwertige Ausgabe.

### 🏊 Die Strecke

- **Schwimmen:** 1,9 km
- **Radfahren:** 90 km
- **Laufen:** 21 km

### 💰 Anmeldung

Die Plätze sind **begrenzt**. Sichern Sie sich jetzt Ihren Platz und nutzen Sie den Jahresanfangsrabatt!

**Preise nach Phase:**
- 💵 **Januar:** 80€
- 💶 **Februar:** 90€
- 💷 **März:** 100€
- 💸 **April:** 120€`,
      city: "Moura",
      metaTitle: "Moura Mitteldistanz-Triathlon 2026 | Alentejo, Portugal",
      metaDescription: "Melden Sie sich für den Moura Mitteldistanz-Triathlon 2026 (26. April) an. Sonderrabatt im Januar - 80€! Organisiert vom Portugiesischen Triathlon-Verband im Herzen des Alentejo.",
    },
    {
      language: "it",
      title: "Triathlon Media Distanza di Moura 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Media Distanza di Moura 2026

**Media distanza di Moura con prezzo speciale a gennaio**

Le iscrizioni sono ora aperte con sconto per il Triathlon Media Distanza di Moura che si svolgerà il **26 aprile 2026**. Chi si iscrive durante il mese di gennaio beneficia di una tariffa ridotta di **80 euro**, prima del prezzo regolare di 120 euro che si applicherà ad aprile.

### 🌄 L'Evento

La competizione torna nell'**Alentejo** per sfidare gli atleti su un percorso che combina esigenza, bellezza naturale e l'atmosfera caratteristica della regione. Organizzato dalla **Federazione Portoghese di Triathlon** in collaborazione con il **Comune di Moura**, l'evento promette un'altra edizione di alta qualità.

### 🏊 Il Percorso

- **Nuoto:** 1,9 km
- **Ciclismo:** 90 km
- **Corsa:** 21 km

### 💰 Iscrizioni

I posti sono **limitati**. Assicurati il tuo posto ora e approfitta dello sconto di inizio anno!

**Prezzi per fase:**
- 💵 **Gennaio:** 80€
- 💶 **Febbraio:** 90€
- 💷 **Marzo:** 100€
- 💸 **Aprile:** 120€`,
      city: "Moura",
      metaTitle: "Triathlon Media Distanza di Moura 2026 | Alentejo, Portogallo",
      metaDescription: "Iscriviti al Triathlon Media Distanza di Moura 2026 (26 aprile). Sconto speciale a gennaio - 80€! Organizzato dalla Federazione Portoghese di Triathlon nel cuore dell'Alentejo.",
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

  console.log("📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)");

  // Step 3: Find or create variant (no unique constraint on EventVariant)
  let variant = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Média Distância",
    },
  });

  if (variant) {
    // Update existing variant
    variant = await prisma.eventVariant.update({
      where: { id: variant.id },
      data: {
        description: "Triatlo de média distância: 1,9 km natação + 90 km ciclismo + 21 km corrida",
        distanceKm: 113, // Total distance: 1.9 + 90 + 21 = 112.9km
        elevationGainM: null,
        elevationLossM: null,
        startDate: new Date("2026-04-26T08:00:00Z"),
        startTime: "08:00",
        maxParticipants: null,
        cutoffTimeHours: 8.0,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
    });
  } else {
    // Create new variant
    variant = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Média Distância",
        description: "Triatlo de média distância: 1,9 km natação + 90 km ciclismo + 21 km corrida",
        distanceKm: 113,
        elevationGainM: null,
        elevationLossM: null,
        startDate: new Date("2026-04-26T08:00:00Z"),
        startTime: "08:00",
        maxParticipants: null,
        cutoffTimeHours: 8.0,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
    });
  }

  console.log("🏃 Variant created/updated with ID:", variant.id);

  // Step 4: Upsert variant translations separately (ALL 6 languages)
  const variantTranslations = [
    {
      language: "pt",
      name: "Média Distância",
      description: "Triatlo de média distância: 1,9 km natação + 90 km ciclismo + 21 km corrida",
    },
    {
      language: "en",
      name: "Middle Distance",
      description: "Middle distance triathlon: 1.9 km swim + 90 km bike + 21 km run",
    },
    {
      language: "es",
      name: "Media Distancia",
      description: "Triatlón de media distancia: 1,9 km natación + 90 km ciclismo + 21 km carrera",
    },
    {
      language: "fr",
      name: "Moyenne Distance",
      description: "Triathlon moyenne distance : 1,9 km natation + 90 km vélo + 21 km course",
    },
    {
      language: "de",
      name: "Mitteldistanz",
      description: "Mitteldistanz-Triathlon: 1,9 km Schwimmen + 90 km Radfahren + 21 km Laufen",
    },
    {
      language: "it",
      name: "Media Distanza",
      description: "Triathlon media distanza: 1,9 km nuoto + 90 km ciclismo + 21 km corsa",
    },
  ];

  for (const variantTranslation of variantTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant.id,
          language: variantTranslation.language,
        },
      },
      update: {
        name: variantTranslation.name,
        description: variantTranslation.description,
      },
      create: {
        variantId: variant.id,
        language: variantTranslation.language,
        name: variantTranslation.name,
        description: variantTranslation.description,
      },
    });
  }

  console.log("📝 Variant translations upserted for 6 languages");

  // Step 5: Upsert pricing phases separately
  const pricingPhases = [
    {
      name: "Janeiro",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-01-31T23:59:59Z"),
      price: 80.0,
      discountPercent: null,
      note: "Desconto especial de início de ano",
    },
    {
      name: "Fevereiro",
      startDate: new Date("2026-02-01T00:00:00Z"),
      endDate: new Date("2026-02-28T23:59:59Z"),
      price: 90.0,
      discountPercent: null,
      note: null,
    },
    {
      name: "Março",
      startDate: new Date("2026-03-01T00:00:00Z"),
      endDate: new Date("2026-03-31T23:59:59Z"),
      price: 100.0,
      discountPercent: null,
      note: null,
    },
    {
      name: "Abril",
      startDate: new Date("2026-04-01T00:00:00Z"),
      endDate: new Date("2026-04-25T23:59:59Z"),
      price: 120.0,
      discountPercent: null,
      note: "Preço regular",
    },
  ];

  for (const phase of pricingPhases) {
    await prisma.pricingPhase.upsert({
      where: {
        eventId_name: {
          eventId: event.id,
          name: phase.name,
        },
      },
      update: {
        startDate: phase.startDate,
        endDate: phase.endDate,
        price: phase.price,
        discountPercent: phase.discountPercent,
        note: phase.note,
      },
      create: {
        eventId: event.id,
        name: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        price: phase.price,
        discountPercent: phase.discountPercent,
        note: phase.note,
      },
    });
  }

  console.log("💰 Pricing phases upserted (4 phases)");

  console.log("\n✅ Seed completed successfully!");
  console.log("📊 Summary:");
  console.log("   - Event: Triatlo de Média Distância de Moura 2026");
  console.log("   - Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("   - Variants: 1 (Média Distância)");
  console.log("   - Variant translations: 6 languages");
  console.log("   - Pricing phases: 4 (Janeiro, Fevereiro, Março, Abril)");
  console.log("\n🚀 The seed is idempotent and safe to run multiple times!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding data:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
