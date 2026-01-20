/**
 * Seed Montepio Meia Maratona de Cascais 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Montepio Meia Maratona de Cascais 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "montepio-meia-maratona-cascais-2026" },
    update: {
      title: "Montepio Meia Maratona de Cascais",
      description: `**10ª Edição - 31 Janeiro e 1 Fevereiro 2026**

A Montepio Meia Maratona de Cascais regressa à Baía de Cascais com percursos desafiantes e vista privilegiada para o Atlântico.

🏃 **4 Distâncias:**
- Meia Maratona 21,1 km
- 10 Km de Cascais
- 5 Km de Cascais
- Corrida das Crianças (escalões Bambis, Benjamins e Infantis)

🏅 **Destaques:**
- Percursos certificados e cronometrados
- Kit inclui long-sleeve oficial
- Medalhas para todos os finishers
- Prémios para top 3 M/F
- Apoio médico e bengaleiro`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-01-31T16:00:00Z"),
      endDate: new Date("2026-02-01T12:00:00Z"),
      registrationDeadline: new Date("2026-01-31T23:59:59Z"),
      city: "Cascais",
      country: "Portugal",
      latitude: 38.6979,
      longitude: -9.4214,
      googleMapsUrl: "https://maps.app.goo.gl/cascais",
      externalUrl: "https://meiamaratonadecascais.pt/",
      imageUrl: "",
      isFeatured: true,
    },
    create: {
      title: "Montepio Meia Maratona de Cascais",
      slug: "montepio-meia-maratona-cascais-2026",
      description: `**10ª Edição - 31 Janeiro e 1 Fevereiro 2026**

A Montepio Meia Maratona de Cascais regressa à Baía de Cascais com percursos desafiantes e vista privilegiada para o Atlântico.

🏃 **4 Distâncias:**
- Meia Maratona 21,1 km
- 10 Km de Cascais
- 5 Km de Cascais
- Corrida das Crianças (escalões Bambis, Benjamins e Infantis)

🏅 **Destaques:**
- Percursos certificados e cronometrados
- Kit inclui long-sleeve oficial
- Medalhas para todos os finishers
- Prémios para top 3 M/F
- Apoio médico e bengaleiro`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-01-31T16:00:00Z"),
      endDate: new Date("2026-02-01T12:00:00Z"),
      registrationDeadline: new Date("2026-01-31T23:59:59Z"),
      city: "Cascais",
      country: "Portugal",
      latitude: 38.6979,
      longitude: -9.4214,
      googleMapsUrl: "https://maps.app.goo.gl/cascais",
      externalUrl: "https://meiamaratonadecascais.pt/",
      imageUrl: "",
      isFeatured: true,
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  const languages: Language[] = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  const translations = {
    pt: {
      title: "Montepio Meia Maratona de Cascais",
      description: `🏃‍♂️ Corre à beira-mar na Baía de Cascais com 4 distâncias disponíveis!

**📅 31 Janeiro e 1 Fevereiro 2026**

🌊 Percursos certificados com vista privilegiada para o Atlântico. A 10ª edição da Montepio Meia Maratona de Cascais é organizada pela HMS Sports, com apoio da Câmara Municipal de Cascais.

**🏃 Distâncias:**
- **Meia Maratona 21,1 km** - Domingo 9h00 (partida e chegada Passeio Dom Luís I)
- **10 Km** - Domingo 8h30 (partida Baía, chegada Marina)
- **5 Km** - Domingo 9h20 (partida Baía, chegada Marina)
- **Corrida das Crianças** - Sábado 16h00 (Bambis, Benjamins, Infantis)

**🏅 Destaques:**
- Percursos certificados e cronometrados (21,1km e 10km)
- Long-sleeve oficial + medalha finisher
- Prémios top 3 M/F (troféu + voucher 100€ Montepio)
- Apoio médico completo
- Bengaleiro e Bike Park`,
      city: "Cascais",
      metaTitle:
        "Montepio Meia Maratona de Cascais 2026 - Inscrições | Athlifyr",
      metaDescription:
        "10ª edição da Montepio Meia Maratona de Cascais. 4 distâncias pela Baía de Cascais: 21,1km, 10km, 5km e Corrida das Crianças. Inscreve-te já!",
    },
    en: {
      title: "Montepio Cascais Half Marathon",
      description: `🏃‍♂️ Run by the sea in Cascais Bay with 4 distances available!

**📅 January 31st & February 1st, 2026**

🌊 Certified courses with stunning Atlantic Ocean views. The 10th edition of the Montepio Cascais Half Marathon is organized by HMS Sports, supported by Cascais City Council.

**🏃 Distances:**
- **Half Marathon 21.1 km** - Sunday 9:00 AM (start/finish Passeio Dom Luís I)
- **10 Km** - Sunday 8:30 AM (start Bay, finish Marina)
- **5 Km** - Sunday 9:20 AM (start Bay, finish Marina)
- **Kids Race** - Saturday 4:00 PM (age categories 3-13 years)

**🏅 Highlights:**
- Certified and timed courses (21.1km & 10km)
- Official long-sleeve + finisher medal
- Top 3 prizes M/F (trophy + €100 Montepio voucher)
- Full medical support
- Bag check & Bike Park`,
      city: "Cascais",
      metaTitle:
        "Montepio Cascais Half Marathon 2026 - Registration | Athlifyr",
      metaDescription:
        "10th edition of Montepio Cascais Half Marathon. 4 distances along Cascais Bay: 21.1km, 10km, 5km and Kids Race. Register now!",
    },
    es: {
      title: "Montepio Media Maratón de Cascais",
      description: `🏃‍♂️ ¡Corre junto al mar en la Bahía de Cascais con 4 distancias disponibles!

**📅 31 Enero y 1 Febrero 2026**

🌊 Recorridos certificados con vistas privilegiadas al Atlántico. La 10ª edición de la Montepio Media Maratón de Cascais está organizada por HMS Sports, con apoyo del Ayuntamiento de Cascais.

**🏃 Distancias:**
- **Media Maratón 21,1 km** - Domingo 9:00h (salida/llegada Paseo Dom Luís I)
- **10 Km** - Domingo 8:30h (salida Bahía, llegada Marina)
- **5 Km** - Domingo 9:20h (salida Bahía, llegada Marina)
- **Carrera Infantil** - Sábado 16:00h (categorías 3-13 años)

**🏅 Destacados:**
- Recorridos certificados y cronometrados (21,1km y 10km)
- Camiseta manga larga oficial + medalla finisher
- Premios top 3 M/F (trofeo + vale 100€ Montepio)
- Apoyo médico completo
- Consigna y aparcamiento bicicletas`,
      city: "Cascais",
      metaTitle:
        "Montepio Media Maratón de Cascais 2026 - Inscripción | Athlifyr",
      metaDescription:
        "10ª edición de la Montepio Media Maratón de Cascais. 4 distancias por la Bahía de Cascais: 21,1km, 10km, 5km y Carrera Infantil. ¡Inscríbete!",
    },
    fr: {
      title: "Montepio Semi-Marathon de Cascais",
      description: `🏃‍♂️ Courez en bord de mer dans la Baie de Cascais avec 4 distances disponibles !

**📅 31 Janvier et 1er Février 2026**

🌊 Parcours certifiés avec vue imprenable sur l'Atlantique. La 10ème édition du Montepio Semi-Marathon de Cascais est organisée par HMS Sports, avec le soutien de la Mairie de Cascais.

**🏃 Distances :**
- **Semi-Marathon 21,1 km** - Dimanche 9h00 (départ/arrivée Passeio Dom Luís I)
- **10 Km** - Dimanche 8h30 (départ Baie, arrivée Marina)
- **5 Km** - Dimanche 9h20 (départ Baie, arrivée Marina)
- **Course Enfants** - Samedi 16h00 (catégories 3-13 ans)

**🏅 Points Forts :**
- Parcours certifiés et chronométrés (21,1km et 10km)
- T-shirt manches longues officiel + médaille finisher
- Prix top 3 H/F (trophée + bon 100€ Montepio)
- Support médical complet
- Vestiaire et parking vélos`,
      city: "Cascais",
      metaTitle:
        "Montepio Semi-Marathon de Cascais 2026 - Inscription | Athlifyr",
      metaDescription:
        "10ème édition du Montepio Semi-Marathon de Cascais. 4 distances le long de la Baie de Cascais : 21,1km, 10km, 5km et Course Enfants. Inscrivez-vous !",
    },
    de: {
      title: "Montepio Halbmarathon Cascais",
      description: `🏃‍♂️ Laufen Sie am Meer in der Bucht von Cascais mit 4 verfügbaren Distanzen!

**📅 31. Januar und 1. Februar 2026**

🌊 Zertifizierte Strecken mit herrlichem Blick auf den Atlantik. Die 10. Ausgabe des Montepio Halbmarathon Cascais wird von HMS Sports organisiert, unterstützt von der Stadtverwaltung Cascais.

**🏃 Distanzen:**
- **Halbmarathon 21,1 km** - Sonntag 9:00 Uhr (Start/Ziel Passeio Dom Luís I)
- **10 Km** - Sonntag 8:30 Uhr (Start Bucht, Ziel Marina)
- **5 Km** - Sonntag 9:20 Uhr (Start Bucht, Ziel Marina)
- **Kinderlauf** - Samstag 16:00 Uhr (Alterskategorien 3-13 Jahre)

**🏅 Highlights:**
- Zertifizierte und zeitgemessene Strecken (21,1km & 10km)
- Offizielles Langarmshirt + Finisher-Medaille
- Top-3-Preise M/F (Trophäe + 100€ Montepio-Gutschein)
- Vollständige medizinische Betreuung
- Garderobe und Fahrradparkplatz`,
      city: "Cascais",
      metaTitle: "Montepio Halbmarathon Cascais 2026 - Anmeldung | Athlifyr",
      metaDescription:
        "10. Ausgabe des Montepio Halbmarathon Cascais. 4 Distanzen entlang der Bucht von Cascais: 21,1km, 10km, 5km und Kinderlauf. Jetzt anmelden!",
    },
    it: {
      title: "Montepio Mezza Maratona di Cascais",
      description: `🏃‍♂️ Corri in riva al mare nella Baia di Cascais con 4 distanze disponibili!

**📅 31 Gennaio e 1 Febbraio 2026**

🌊 Percorsi certificati con vista privilegiata sull'Atlantico. La 10ª edizione della Montepio Mezza Maratona di Cascais è organizzata da HMS Sports, con il supporto del Comune di Cascais.

**🏃 Distanze:**
- **Mezza Maratona 21,1 km** - Domenica ore 9:00 (partenza/arrivo Passeio Dom Luís I)
- **10 Km** - Domenica ore 8:30 (partenza Baia, arrivo Marina)
- **5 Km** - Domenica ore 9:20 (partenza Baia, arrivo Marina)
- **Corsa Bambini** - Sabato ore 16:00 (categorie 3-13 anni)

**🏅 In Evidenza:**
- Percorsi certificati e cronometrati (21,1km e 10km)
- Maglia maniche lunghe ufficiale + medaglia finisher
- Premi top 3 M/F (trofeo + voucher 100€ Montepio)
- Supporto medico completo
- Deposito bagagli e parcheggio bici`,
      city: "Cascais",
      metaTitle:
        "Montepio Mezza Maratona di Cascais 2026 - Iscrizione | Athlifyr",
      metaDescription:
        "10ª edizione della Montepio Mezza Maratona di Cascais. 4 distanze lungo la Baia di Cascais: 21,1km, 10km, 5km e Corsa Bambini. Iscriviti ora!",
    },
  };

  for (const lang of languages) {
    const translation = translations[lang];
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
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
        language: lang,
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

  // Step 3: Upsert variants separately
  // Variant 1: Half Marathon 21.1km
  let variant21km = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Meia Maratona 21,1 km",
    },
  });

  if (variant21km) {
    variant21km = await prisma.eventVariant.update({
      where: { id: variant21km.id },
      data: {
        name: "Meia Maratona 21,1 km",
        description: `Meia maratona certificada de 21,1 km pela Baía de Cascais e Estrada do Guincho.

**Partida:** 9h00 - Passeio Dom Luís I
**Tempo limite:** 3 horas
**Idade mínima:** 20 anos

Percurso cronometrado com abastecimentos líquidos e sólidos. Prémios para top 3 M/F. Inclui medalha de finisher.`,
        distanceKm: 21,
        price: 24.0,
        currency: Currency.EUR,
        maxParticipants: 5000,
        startDate: new Date("2026-02-01T09:00:00Z"),
        startTime: "09:00",
        cutoffTimeHours: 3.0,
      },
    });
  } else {
    variant21km = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Meia Maratona 21,1 km",
        description: `Meia maratona certificada de 21,1 km pela Baía de Cascais e Estrada do Guincho.

**Partida:** 9h00 - Passeio Dom Luís I
**Tempo limite:** 3 horas
**Idade mínima:** 20 anos

Percurso cronometrado com abastecimentos líquidos e sólidos. Prémios para top 3 M/F. Inclui medalha de finisher.`,
        distanceKm: 21,
        price: 24.0,
        currency: Currency.EUR,
        maxParticipants: 5000,
        startDate: new Date("2026-02-01T09:00:00Z"),
        startTime: "09:00",
        cutoffTimeHours: 3.0,
      },
    });
  }

  // Variant 1 translations
  const variant21kmTranslations = {
    pt: {
      name: "Meia Maratona 21,1 km",
      description:
        "Meia maratona certificada pela Baía de Cascais e Estrada do Guincho. Tempo limite: 3 horas.",
    },
    en: {
      name: "Half Marathon 21.1 km",
      description:
        "Certified half marathon along Cascais Bay and Guincho Road. Time limit: 3 hours.",
    },
    es: {
      name: "Media Maratón 21,1 km",
      description:
        "Media maratón certificada por la Bahía de Cascais y Carretera del Guincho. Límite: 3 horas.",
    },
    fr: {
      name: "Semi-Marathon 21,1 km",
      description:
        "Semi-marathon certifié le long de la Baie de Cascais et Route de Guincho. Limite: 3 heures.",
    },
    de: {
      name: "Halbmarathon 21,1 km",
      description:
        "Zertifizierter Halbmarathon entlang der Bucht von Cascais und Guincho-Straße. Zeitlimit: 3 Stunden.",
    },
    it: {
      name: "Mezza Maratona 21,1 km",
      description:
        "Mezza maratona certificata lungo la Baia di Cascais e Strada di Guincho. Limite: 3 ore.",
    },
  };

  for (const lang of languages) {
    const translation = variant21kmTranslations[lang];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant21km.id,
          language: lang,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: variant21km.id,
        language: lang,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  // Variant 2: 10km
  let variant10km = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "10 Km de Cascais",
    },
  });

  if (variant10km) {
    variant10km = await prisma.eventVariant.update({
      where: { id: variant10km.id },
      data: {
        name: "10 Km de Cascais",
        description: `Corrida certificada de 10 km pela costa de Cascais.

**Partida:** 8h30 - Baía de Cascais
**Chegada:** Marina de Cascais
**Tempo limite:** 2 horas
**Idade mínima:** 18 anos

Percurso cronometrado com abastecimentos líquidos. Prémios para top 3 M/F. Inclui medalha de finisher.`,
        distanceKm: 10,
        price: 21.0,
        currency: Currency.EUR,
        maxParticipants: 5000,
        startDate: new Date("2026-02-01T08:30:00Z"),
        startTime: "08:30",
        cutoffTimeHours: 2.0,
      },
    });
  } else {
    variant10km = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "10 Km de Cascais",
        description: `Corrida certificada de 10 km pela costa de Cascais.

**Partida:** 8h30 - Baía de Cascais
**Chegada:** Marina de Cascais
**Tempo limite:** 2 horas
**Idade mínima:** 18 anos

Percurso cronometrado com abastecimentos líquidos. Prémios para top 3 M/F. Inclui medalha de finisher.`,
        distanceKm: 10,
        price: 21.0,
        currency: Currency.EUR,
        maxParticipants: 5000,
        startDate: new Date("2026-02-01T08:30:00Z"),
        startTime: "08:30",
        cutoffTimeHours: 2.0,
      },
    });
  }

  // Variant 2 translations
  const variant10kmTranslations = {
    pt: {
      name: "10 Km de Cascais",
      description:
        "Corrida certificada de 10 km pela costa de Cascais. Tempo limite: 2 horas.",
    },
    en: {
      name: "10 Km Cascais",
      description:
        "Certified 10km race along Cascais coast. Time limit: 2 hours.",
    },
    es: {
      name: "10 Km de Cascais",
      description:
        "Carrera certificada de 10 km por la costa de Cascais. Límite: 2 horas.",
    },
    fr: {
      name: "10 Km de Cascais",
      description:
        "Course certifiée de 10 km le long de la côte de Cascais. Limite: 2 heures.",
    },
    de: {
      name: "10 Km Cascais",
      description:
        "Zertifizierter 10km-Lauf entlang der Küste von Cascais. Zeitlimit: 2 Stunden.",
    },
    it: {
      name: "10 Km di Cascais",
      description:
        "Corsa certificata di 10 km lungo la costa di Cascais. Limite: 2 ore.",
    },
  };

  for (const lang of languages) {
    const translation = variant10kmTranslations[lang];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant10km.id,
          language: lang,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: variant10km.id,
        language: lang,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  // Variant 3: 5km
  let variant5km = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "5 Km de Cascais",
    },
  });

  if (variant5km) {
    variant5km = await prisma.eventVariant.update({
      where: { id: variant5km.id },
      data: {
        name: "5 Km de Cascais",
        description: `Corrida de 5 km pela Baía de Cascais, ideal para toda a família.

**Partida:** 9h20 - Baía de Cascais
**Chegada:** Marina de Cascais
**Tempo limite:** 1h30
**Participação aberta a todas as idades**

Inclui medalha de finisher. Sem cronometragem eletrónica.`,
        distanceKm: 5,
        price: 18.0,
        currency: Currency.EUR,
        maxParticipants: 2000,
        startDate: new Date("2026-02-01T09:20:00Z"),
        startTime: "09:20",
        cutoffTimeHours: 1.5,
      },
    });
  } else {
    variant5km = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "5 Km de Cascais",
        description: `Corrida de 5 km pela Baía de Cascais, ideal para toda a família.

**Partida:** 9h20 - Baía de Cascais
**Chegada:** Marina de Cascais
**Tempo limite:** 1h30
**Participação aberta a todas as idades**

Inclui medalha de finisher. Sem cronometragem eletrónica.`,
        distanceKm: 5,
        price: 18.0,
        currency: Currency.EUR,
        maxParticipants: 2000,
        startDate: new Date("2026-02-01T09:20:00Z"),
        startTime: "09:20",
        cutoffTimeHours: 1.5,
      },
    });
  }

  // Variant 3 translations
  const variant5kmTranslations = {
    pt: {
      name: "5 Km de Cascais",
      description:
        "Corrida de 5 km ideal para famílias. Todas as idades bem-vindas.",
    },
    en: {
      name: "5 Km Cascais",
      description: "5km race ideal for families. All ages welcome.",
    },
    es: {
      name: "5 Km de Cascais",
      description:
        "Carrera de 5 km ideal para familias. Todas las edades bienvenidas.",
    },
    fr: {
      name: "5 Km de Cascais",
      description:
        "Course de 5 km idéale pour les familles. Tous les âges bienvenus.",
    },
    de: {
      name: "5 Km Cascais",
      description:
        "5km-Lauf ideal für Familien. Alle Altersgruppen willkommen.",
    },
    it: {
      name: "5 Km di Cascais",
      description: "Corsa di 5 km ideale per famiglie. Tutte le età benvenute.",
    },
  };

  for (const lang of languages) {
    const translation = variant5kmTranslations[lang];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant5km.id,
          language: lang,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: variant5km.id,
        language: lang,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  // Variant 4: Kids Race
  let variantKids = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Corrida das Crianças",
    },
  });

  if (variantKids) {
    variantKids = await prisma.eventVariant.update({
      where: { id: variantKids.id },
      data: {
        name: "Corrida das Crianças",
        description: `Corrida solidária para crianças na Baía de Cascais (31 de janeiro às 16h).

**Escalões:** Bambis (2020-2021), Benjamins A (2017-2019), Benjamins B (2015-2016), Infantis (2013-2014)
**Distâncias:** Entre 300m e 1000m conforme escalão

**Inscrição solidária:** Valor reverte 100% para a Associação Casa Nova - Estoril

Inclui t-shirt técnica e brinde. Um evento divertido e solidário!`,
        distanceKm: 1,
        price: 4.0,
        currency: Currency.EUR,
        maxParticipants: 500,
        startDate: new Date("2026-01-31T16:00:00Z"),
        startTime: "16:00",
        cutoffTimeHours: null,
      },
    });
  } else {
    variantKids = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Corrida das Crianças",
        description: `Corrida solidária para crianças na Baía de Cascais (31 de janeiro às 16h).

**Escalões:** Bambis (2020-2021), Benjamins A (2017-2019), Benjamins B (2015-2016), Infantis (2013-2014)
**Distâncias:** Entre 300m e 1000m conforme escalão

**Inscrição solidária:** Valor reverte 100% para a Associação Casa Nova - Estoril

Inclui t-shirt técnica e brinde. Um evento divertido e solidário!`,
        distanceKm: 1,
        price: 4.0,
        currency: Currency.EUR,
        maxParticipants: 500,
        startDate: new Date("2026-01-31T16:00:00Z"),
        startTime: "16:00",
        cutoffTimeHours: null,
      },
    });
  }

  // Variant 4 translations
  const variantKidsTranslations = {
    pt: {
      name: "Corrida das Crianças",
      description:
        "Corrida solidária para crianças (300m a 1000m). Valor reverte para a Associação Casa Nova.",
    },
    en: {
      name: "Kids Race",
      description:
        "Charity race for children (300m to 1000m). Proceeds go to Casa Nova Association.",
    },
    es: {
      name: "Carrera Infantil",
      description:
        "Carrera solidaria para niños (300m a 1000m). Los ingresos van a la Asociación Casa Nova.",
    },
    fr: {
      name: "Course Enfants",
      description:
        "Course caritative pour enfants (300m à 1000m). Les recettes vont à l'Association Casa Nova.",
    },
    de: {
      name: "Kinderlauf",
      description:
        "Wohltätigkeitslauf für Kinder (300m bis 1000m). Erlös geht an die Casa Nova Vereinigung.",
    },
    it: {
      name: "Corsa Bambini",
      description:
        "Corsa solidale per bambini (300m a 1000m). I proventi vanno all'Associazione Casa Nova.",
    },
  };

  for (const lang of languages) {
    const translation = variantKidsTranslations[lang];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variantKids.id,
          language: lang,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: variantKids.id,
        language: lang,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("🏃 Variants upserted: 21.1km, 10km, 5km, Kids");

  // Step 4: Upsert pricing phases
  // Note: Using findFirst + update/create pattern since there's no unique constraint
  const upsertPricingPhase = async (
    eventId: string,
    variantId: string,
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
      where: { eventId, name },
    });

    if (existing) {
      return await prisma.pricingPhase.update({
        where: { id: existing.id },
        data: { variantId, ...data },
      });
    } else {
      return await prisma.pricingPhase.create({
        data: { eventId, variantId, name, ...data },
      });
    }
  };

  // Pricing for 21.1km
  await upsertPricingPhase(event.id, variant21km.id, "21km - Early Bird", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2025-12-01T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    note: "Early Bird",
  });

  await upsertPricingPhase(event.id, variant21km.id, "21km - Fase 2", {
    startDate: new Date("2025-12-02T00:00:00Z"),
    endDate: new Date("2025-12-29T23:59:59Z"),
    price: 20.0,
    currency: Currency.EUR,
    note: "2ª Fase",
  });

  await upsertPricingPhase(event.id, variant21km.id, "21km - Fase 3", {
    startDate: new Date("2025-12-30T00:00:00Z"),
    endDate: new Date("2026-01-22T23:59:59Z"),
    price: 22.0,
    currency: Currency.EUR,
    note: "3ª Fase",
  });

  await upsertPricingPhase(event.id, variant21km.id, "21km - Última Fase", {
    startDate: new Date("2026-01-23T00:00:00Z"),
    endDate: new Date("2026-01-31T23:59:59Z"),
    price: 24.0,
    currency: Currency.EUR,
    note: "Última Fase",
  });

  // Pricing for 10km
  await upsertPricingPhase(event.id, variant10km.id, "10km - Early Bird", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2025-12-01T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: "Early Bird",
  });

  await upsertPricingPhase(event.id, variant10km.id, "10km - Fase 2", {
    startDate: new Date("2025-12-02T00:00:00Z"),
    endDate: new Date("2025-12-29T23:59:59Z"),
    price: 17.0,
    currency: Currency.EUR,
    note: "2ª Fase",
  });

  await upsertPricingPhase(event.id, variant10km.id, "10km - Fase 3", {
    startDate: new Date("2025-12-30T00:00:00Z"),
    endDate: new Date("2026-01-22T23:59:59Z"),
    price: 19.0,
    currency: Currency.EUR,
    note: "3ª Fase",
  });

  await upsertPricingPhase(event.id, variant10km.id, "10km - Última Fase", {
    startDate: new Date("2026-01-23T00:00:00Z"),
    endDate: new Date("2026-01-31T23:59:59Z"),
    price: 21.0,
    currency: Currency.EUR,
    note: "Última Fase",
  });

  // Pricing for 5km
  await upsertPricingPhase(event.id, variant5km.id, "5km - Early Bird", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2025-12-01T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: "Early Bird",
  });

  await upsertPricingPhase(event.id, variant5km.id, "5km - Fase 2", {
    startDate: new Date("2025-12-02T00:00:00Z"),
    endDate: new Date("2025-12-29T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: "2ª Fase",
  });

  await upsertPricingPhase(event.id, variant5km.id, "5km - Fase 3", {
    startDate: new Date("2025-12-30T00:00:00Z"),
    endDate: new Date("2026-01-22T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    note: "3ª Fase",
  });

  await upsertPricingPhase(event.id, variant5km.id, "5km - Última Fase", {
    startDate: new Date("2026-01-23T00:00:00Z"),
    endDate: new Date("2026-01-31T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    note: "Última Fase",
  });

  // Pricing for Kids Race
  await upsertPricingPhase(event.id, variantKids.id, "Kids - Solidária", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2026-01-31T23:59:59Z"),
    price: 4.0,
    currency: Currency.EUR,
    note: "Valor reverte 100% para a Associação Casa Nova",
  });

  console.log("💰 Pricing phases upserted: 13 phases total");

  console.log("\n✅ Montepio Meia Maratona de Cascais 2026 completed!");
  console.log("📊 Summary:");
  console.log("   - 1 event created/updated");
  console.log("   - 6 language translations (pt, en, es, fr, de, it)");
  console.log("   - 4 variants (21.1km, 10km, 5km, Kids)");
  console.log("   - 24 variant translations (4 variants × 6 languages)");
  console.log("   - 13 pricing phases");
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
