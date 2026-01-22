/**
 * Seed Triatlo de Média Distância de Moura 2026
 * Complete with translations in all 6 languages (pt, en, es, fr, de, it)
 * Organizer: Câmara Municipal de Moura
 * Technical Support: Federação de Triatlo de Portugal
 */

import { PrismaClient, Language } from "@prisma/client";

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

A competição regressa ao **Alentejo** para desafiar atletas num percurso que combina exigência, beleza natural e o ambiente característico da região. Organizado pela **Câmara Municipal de Moura**, com apoio técnico da **Federação de Triatlo de Portugal**, o evento inclui o **Campeonato Nacional Individual de Triatlo de Média Distância** e uma **Prova Aberta** (distância Standard).

### 🏊 O Percurso

- **Natação:** 1,9 km
- **Ciclismo:** 90 km
- **Corrida:** 19,4 km

### 💰 Inscrições

**Data limite:** 13 de abril de 2026

As vagas são **limitadas**. Garante já o teu lugar e aproveita o desconto de início de ano!

**Preços por fase (atletas licenciados):**
- 💵 **Até 31 Janeiro:** 80€
- 💶 **Até 28 Fevereiro:** 90€
- 💷 **Até 31 Março:** 100€
- 💸 **Até 13 Abril:** 120€

*Atletas não licenciados: acresce 30€ em cada fase.*

**Inscrições:** [Plataforma FTP](http://www.federacao-triatlo.pt/ftp2015/aplicacao-de-gestao-ftp/)`,
      sportTypes: ["TRIATHLON"],
      startDate: new Date("2026-04-26T08:00:00Z"),
      endDate: new Date("2026-04-26T16:00:00Z"),
      city: "Moura",
      country: "Portugal",
      latitude: 38.14,
      longitude: -7.45,
      googleMapsUrl: "https://maps.app.goo.gl/YQxV8zKJMqXyZ7jR9",
      externalUrl:
        "https://www.federacao-triatlo.pt/media-distancia-moura-2026/",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-13T23:59:59Z"),
    },
    create: {
      title: "Triatlo de Média Distância de Moura 2026",
      slug: "triatlo-moura-2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Triatlo de Média Distância de Moura 2026

**Média distância de Moura com preço especial em janeiro**Câmara Municipal de Moura**, com apoio técnico da **Federação de Triatlo de Portugal**, o evento inclui o **Campeonato Nacional Individual de Triatlo de Média Distância** e uma **Prova Aberta** (distância Standard).

### 🏊 O Percurso

- **Natação:** 1,9 km
- **Ciclismo:** 90 km
- **Corrida:** 19,4 km

### 💰 Inscrições

**Data limite:** 13 de abril de 2026

As vagas são **limitadas**. Garante já o teu lugar e aproveita o desconto de início de ano!

**Preços por fase (atletas licenciados):**
- 💵 **Até 31 Janeiro:** 80€
- 💶 **Até 28 Fevereiro:** 90€
- 💷 **Até 31 Março:** 100€
- 💸 **Até 13 Abril:** 120€

*Atletas não licenciados: acresce 30€ em cada fase.*

**Inscrições:** [Plataforma FTP](http://www.federacao-triatlo.pt/ftp2015/aplicacao-de-gestao-ftp/)adas**. Garante já o teu lugar e aproveita o desconto de início de ano!

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
      latitude: 38.14,
      longitude: -7.45,
      googleMapsUrl: "https://maps.app.goo.gl/YQxV8zKJMqXyZ7jR9",
      externalUrl:
        "https://www.federacao-triatlo.pt/media-distancia-moura-2026/",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-25T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
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
      title: "Triatlo de Média Distância de Moura 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Triatlo de Média Distância de Moura 2026

**Média distância de Moura com preço especial em janeiro**

Já estão abertas, e com desconto, as inscrições para o Triatlo de Média Distância de Moura que se realiza no dia **26 de abril de 2026**. Quem se inscrever durante o mês de janeiro beneficia de um valor reduzido de **80 euros**, antes do preço regular de 120 euros que vigorará em abril.

### 🌄 O Evento

A competição regressa ao **Alentejo** para desafiar atletas num percurso que combina exigência, beleza natural e o ambiente característico da região. Organizado pela **Câmara Municipal de Moura**, com apoio técnico da **Federação de Triatlo de Portugal**, o evento inclui o **Campeonato Nacional Individual de Triatlo de Média Distância** e uma **Prova Aberta** (distância Standard).

### 🏊 O Percurso

- **Natação:** 1,9 km
- **Ciclismo:** 90 km
- **Corrida:** 19,4 km

### 💰 Inscrições

**Data limite:** 13 de abril de 2026

As vagas são **limitadas**. Garante já o teu lugar e aproveita o desconto de início de ano!

**Preços por fase (atletas licenciados):**
- 💵 **Até 31 Janeiro:** 80€
- 💶 **Até 28 Fevereiro:** 90€
- 💷 **Até 31 Março:** 100€
- 💸 **Até 13 Abril:** 120€

*Atletas não licenciados: acresce 30€ em cada fase.*

**Inscrições:** [Plataforma FTP](http://www.federacao-triatlo.pt/ftp2015/aplicacao-de-gestao-ftp/)`,
      city: "Moura",
      metaTitle:
        "Triatlo de Média Distância de Moura 2026 | Alentejo, Portugal",
      metaDescription:
        "Inscreve-te no Triatlo de Média Distância de Moura 2026 (26 de abril). Desconto especial em janeiro - 80€! Organizado pela Câmara Municipal de Moura com apoio técnico da FTP.",
    },
    {
      language: Language.en,
      title: "Moura Middle Distance Triathlon 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Moura Middle Distance Triathlon 2026

**Moura middle distance with special January price**

Registration is now open with a discount for the Moura Middle Distance Triathlon taking place on **April 26, 2026**. Those who register during January benefit from a reduced rate of **80 euros**, before the regular price of 120 euros that will apply in April.

### 🌄 The Event

The competition returns to **Alentejo** to challenge athletes on a course that combines demanding terrain, natural beauty, and the region's characteristic atmosphere. Organized by the **Moura Town Council** with technical support from the **Portuguese Triathlon Federation**, the event includes the **National Individual Middle Distance Triathlon Championship** and an **Open Race** (Standard distance).

### 🏊 The Course

- **Swim:** 1.9 km
- **Bike:** 90 km
- **Run:** 19.4 km

### 💰 Registration

**Deadline:** April 13, 2026

Spots are **limited**. Secure your place now and take advantage of the early year discount!

**Pricing by phase (licensed athletes):**
- 💵 **Until January 31:** €80
- 💶 **Until February 28:** €90
- 💷 **Until March 31:** €100
- 💸 **Until April 13:** €120

*Non-licensed athletes: add €30 per phase.*

**Registration:** [FTP Platform](http://www.federacao-triatlo.pt/ftp2015/aplicacao-de-gestao-ftp/)`,
      city: "Moura",
      metaTitle: "Moura Middle Distance Triathlon 2026 | Alentejo, Portugal",
      metaDescription:
        "Register for the Moura Middle Distance Triathlon 2026 (April 26). Special January discount - €80! Organized by Moura Town Council with technical support from the Portuguese Triathlon Federation.",
    },
    {
      language: Language.es,
      title: "Triatlón de Media Distancia de Moura 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Triatlón de Media Distancia de Moura 2026

**Media distancia de Moura con precio especial en enero**

Ya están abiertas, y con descuento, las inscripciones para el Triatlón de Media Distancia de Moura que se celebra el **26 de abril de 2026**. Quienes se inscriban durante el mes de enero se benefician de un precio reducido de **80 euros**, antes del precio regular de 120 euros que regirá en abril.

### 🌄 El Evento

La competición regresa al **Alentejo** para desafiar a los atletas en un recorrido que combina exigencia, belleza natural y el ambiente característico de la región. Organizado por el **Ayuntamiento de Moura** con apoyo técnico de la **Federación Portuguesa de Triatlón**, el evento incluye el **Campeonato Nacional Individual de Triatlón de Media Distancia** y una **Prueba Abierta** (distancia Standard).

### 🏊 El Recorrido

- **Natación:** 1,9 km
- **Ciclismo:** 90 km
- **Carrera:** 19,4 km

### 💰 Inscripciones

**Fecha límite:** 13 de abril de 2026

Las plazas son **limitadas**. ¡Asegura tu plaza ya y aprovecha el descuento de principio de año!

**Precios por fase (atletas federados):**
- 💵 **Hasta 31 Enero:** 80€
- 💶 **Hasta 28 Febrero:** 90€
- 💷 **Hasta 31 Marzo:** 100€
- 💸 **Hasta 13 Abril:** 120€

*Atletas no federados: añadir 30€ por fase.*

**Inscripciones:** [Plataforma FTP](http://www.federacao-triatlo.pt/ftp2015/aplicacao-de-gestao-ftp/)`,
      city: "Moura",
      metaTitle:
        "Triatlón de Media Distancia de Moura 2026 | Alentejo, Portugal",
      metaDescription:
        "Inscríbete en el Triatlón de Media Distancia de Moura 2026 (26 de abril). ¡Descuento especial en enero - 80€! Organizado por el Ayuntamiento de Moura con apoyo técnico de la Federación Portuguesa de Triatlón.",
    },
    {
      language: Language.fr,
      title: "Triathlon Moyenne Distance de Moura 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Moyenne Distance de Moura 2026

**Moyenne distance de Moura avec prix spécial en janvier**

Les inscriptions sont maintenant ouvertes avec réduction pour le Triathlon Moyenne Distance de Moura qui se déroulera le **26 avril 2026**. Ceux qui s'inscrivent pendant le mois de janvier bénéficient d'un tarif réduit de **80 euros**, avant le prix régulier de 120 euros qui s'appliquera en avril.

### 🌄 L'Événement

La compétition revient dans l'**Alentejo** pour défier les athlètes sur un parcours qui combine exigence, beauté naturelle et l'atmosphère caractéristique de la région. Organisé par la **Mairie de Moura** avec le soutien technique de la **Fédération Portugaise de Triathlon**, l'événement comprend le **Championnat National Individuel de Triathlon Moyenne Distance** et une **Épreuve Ouverte** (distance Standard).

### 🏊 Le Parcours

- **Natation :** 1,9 km
- **Vélo :** 90 km
- **Course :** 19,4 km

### 💰 Inscriptions

**Date limite :** 13 avril 2026

Les places sont **limitées**. Réservez votre place dès maintenant et profitez de la réduction de début d'année !

**Tarifs par phase (athlètes licenciés) :**
- 💵 **Jusqu'au 31 Janvier :** 80€
- 💶 **Jusqu'au 28 Février :** 90€
- 💷 **Jusqu'au 31 Mars :** 100€
- 💸 **Jusqu'au 13 Avril :** 120€

*Athlètes non licenciés : ajouter 30€ par phase.*

**Inscriptions :** [Plateforme FTP](http://www.federacao-triatlo.pt/ftp2015/aplicacao-de-gestao-ftp/)`,
      city: "Moura",
      metaTitle:
        "Triathlon Moyenne Distance de Moura 2026 | Alentejo, Portugal",
      metaDescription:
        "Inscrivez-vous au Triathlon Moyenne Distance de Moura 2026 (26 avril). Réduction spéciale en janvier - 80€ ! Organisé par la Mairie de Moura avec soutien technique de la Fédération Portugaise de Triathlon.",
    },
    {
      language: Language.de,
      title: "Moura Mitteldistanz-Triathlon 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Moura Mitteldistanz-Triathlon 2026

**Mitteldistanz von Moura mit Sonderpreis im Januar**

Die Anmeldung ist jetzt mit Rabatt für den Moura Mitteldistanz-Triathlon geöffnet, der am **26. April 2026** stattfindet. Wer sich im Januar anmeldet, profitiert von einem reduzierten Preis von **80 Euro**, bevor der reguläre Preis von 120 Euro im April gilt.

### 🌄 Die Veranstaltung

Der Wettbewerb kehrt ins **Alentejo** zurück, um Athleten auf einer Strecke herauszufordern, die anspruchsvolles Gelände, natürliche Schönheit und die charakteristische Atmosphäre der Region kombiniert. Organisiert von der **Stadtverwaltung Moura** mit technischer Unterstützung des **Portugiesischen Triathlon-Verbandes**, umfasst die Veranstaltung die **Nationale Einzelmeisterschaft im Mitteldistanz-Triathlon** und ein **Offenes Rennen** (Standard-Distanz).

### 🏊 Die Strecke

- **Schwimmen:** 1,9 km
- **Radfahren:** 90 km
- **Laufen:** 19,4 km

### 💰 Anmeldung

**Anmeldeschluss:** 13. April 2026

Die Plätze sind **begrenzt**. Sichern Sie sich jetzt Ihren Platz und nutzen Sie den Jahresanfangsrabatt!

**Preise nach Phase (lizenzierte Athleten):**
- 💵 **Bis 31. Januar:** 80€
- 💶 **Bis 28. Februar:** 90€
- 💷 **Bis 31. März:** 100€
- 💸 **Bis 13. April:** 120€

*Nicht lizenzierte Athleten: 30€ Aufschlag pro Phase.*

**Anmeldung:** [FTP-Plattform](http://www.federacao-triatlo.pt/ftp2015/aplicacao-de-gestao-ftp/)`,
      city: "Moura",
      metaTitle: "Moura Mitteldistanz-Triathlon 2026 | Alentejo, Portugal",
      metaDescription:
        "Melden Sie sich für den Moura Mitteldistanz-Triathlon 2026 (26. April) an. Sonderrabatt im Januar - 80€! Organisiert von der Stadtverwaltung Moura mit technischer Unterstützung des Portugiesischen Triathlon-Verbandes.",
    },
    {
      language: Language.it,
      title: "Triathlon Media Distanza di Moura 2026",
      description: `## 🏊‍♂️🚴‍♂️🏃‍♂️ Triathlon Media Distanza di Moura 2026

**Media distanza di Moura con prezzo speciale a gennaio**

Le iscrizioni sono ora aperte con sconto per il Triathlon Media Distanza di Moura che si svolgerà il **26 aprile 2026**. Chi si iscrive durante il mese di gennaio beneficia di una tariffa ridotta di **80 euro**, prima del prezzo regolare di 120 euro che si applicherà ad aprile.

### 🌄 L'Evento

La competizione torna nell'**Alentejo** per sfidare gli atleti su un percorso che combina esigenza, bellezza naturale e l'atmosfera caratteristica della regione. Organizzato dal **Comune di Moura** con supporto tecnico della **Federazione Portoghese di Triathlon**, l'evento include il **Campionato Nazionale Individuale di Triathlon Media Distanza** e una **Gara Aperta** (distanza Standard).

### 🏊 Il Percorso

- **Nuoto:** 1,9 km
- **Ciclismo:** 90 km
- **Corsa:** 19,4 km

### 💰 Iscrizioni

**Scadenza:** 13 aprile 2026

I posti sono **limitati**. Assicurati il tuo posto ora e approfitta dello sconto di inizio anno!

**Prezzi per fase (atleti tesserati):**
- 💵 **Fino al 31 Gennaio:** 80€
- 💶 **Fino al 28 Febbraio:** 90€
- 💷 **Fino al 31 Marzo:** 100€
- 💸 **Fino al 13 Aprile:** 120€

*Atleti non tesserati: aggiungere 30€ per fase.*

**Iscrizioni:** [Piattaforma FTP](http://www.federacao-triatlo.pt/ftp2015/aplicacao-de-gestao-ftp/)`,
      city: "Moura",
      metaTitle:
        "Triathlon Media Distanza di Moura 2026 | Alentejo, Portogallo",
      metaDescription:
        "Iscriviti al Triathlon Media Distanza di Moura 2026 (26 aprile). Sconto speciale a gennaio - 80€! Organizzato dal Comune di Moura con supporto tecnico della Federazione Portoghese di Triathlon.",
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
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

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
        description:
          "Triatlo de média distância: 1,9 km natação + 90 km ciclismo + 19,4 km corrida",
        distanceKm: 111.3, // Total distance: 1.9 + 90 + 19.4 = 111.3km
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
        description:
          "Triatlo de média distância: 1,9 km natação + 90 km ciclismo + 19,4 km corrida",
        distanceKm: 111.3,
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
  const variantTranslations: Array<{
    language: Language;
    name: string;
    description: string;
  }> = [
    {
      language: Language.pt,
      name: "Média Distância",
      description:
        "Triatlo de média distância: 1,9 km natação + 90 km ciclismo + 19,4 km corrida",
    },
    {
      language: Language.en,
      name: "Middle Distance",
      description:
        "Middle distance triathlon: 1.9 km swim + 90 km bike + 19.4 km run",
    },
    {
      language: Language.es,
      name: "Media Distancia",
      description:
        "Triatlón de media distancia: 1,9 km natación + 90 km ciclismo + 19,4 km carrera",
    },
    {
      language: Language.fr,
      name: "Moyenne Distance",
      description:
        "Triathlon moyenne distance : 1,9 km natation + 90 km vélo + 19,4 km course",
    },
    {
      language: Language.de,
      name: "Mitteldistanz",
      description:
        "Mitteldistanz-Triathlon: 1,9 km Schwimmen + 90 km Radfahren + 19,4 km Laufen",
    },
    {
      language: Language.it,
      name: "Media Distanza",
      description:
        "Triathlon media distanza: 1,9 km nuoto + 90 km ciclismo + 19,4 km corsa",
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
      endDate: new Date("2026-04-13T23:59:59Z"),
      price: 120.0,
      discountPercent: null,
      note: "Preço regular - Data limite: 13 de abril",
    },
  ];

  for (const phase of pricingPhases) {
    const existingPhase = await prisma.pricingPhase.findFirst({
      where: {
        eventId: event.id,
        name: phase.name,
      },
    });

    if (existingPhase) {
      await prisma.pricingPhase.update({
        where: { id: existingPhase.id },
        data: {
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          discountPercent: phase.discountPercent,
          note: phase.note,
        },
      });
    } else {
      await prisma.pricingPhase.create({
        data: {
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
