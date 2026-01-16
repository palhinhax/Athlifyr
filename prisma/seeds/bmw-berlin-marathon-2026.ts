/**
 * Seed BMW BERLIN-MARATHON 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding BMW BERLIN-MARATHON 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "bmw-berlin-marathon-2026" },
    update: {
      title: "BMW BERLIN-MARATHON",
      description: `# 🏃 BMW BERLIN-MARATHON 2026

A **BMW BERLIN-MARATHON** é uma das maratonas mais prestigiadas do mundo, parte das **Abbott World Marathon Majors Series (AbbottWMM)** e detentora do recorde mundial do percurso.

## 🏆 Destaques do Evento

✅ **Parte da Abbott World Marathon Majors Series**
✅ **Percurso de Recorde Mundial** - o mais rápido do mundo
✅ **Sistema de Lotaria** para inscrições
✅ **Bilhete de 4 dias de transporte público** na zona ABC (24-27 setembro 2026)
✅ **Cronometragem pessoal** com chip
✅ **Pacemakers** em cada onda de partida
✅ **Abastecimentos extensivos** ao longo do percurso
✅ **Medalha de Finisher** e certificado personalizado
✅ **Poncho de alta qualidade** na linha de chegada
✅ **Serviço de massagem** disponível
✅ **Cuidados médicos** e instalações de duche
✅ **MARATHON EXPO** com área de merchandising

## 📍 Local de Partida e Chegada

**Berlim, Alemanha**

O percurso passa pelos pontos mais emblemáticos de Berlim, incluindo o Portão de Brandemburgo.

## 🏃 A Prova

### Maratona - 42.195 km

- **Distância:** 42.195 km
- **Data:** 27 de setembro de 2026
- **Hora de Partida:** A confirmar
- **Idade Mínima:** 18 anos (nascidos em 2008 ou antes)
- **Tempo Limite:** 6 horas e 15 minutos
- **Taxa de Participação:** 205€

O percurso da BMW BERLIN-MARATHON é conhecido por ser o mais rápido do mundo, ideal para recordes pessoais e tempos de qualificação.

## 📋 O Que Está Incluído

### Inscrição Inclui:

- 🎫 **Bilhete de 4 dias** para transportes públicos em Berlim (zona ABC, válido 24-27 set 2026)
- 🏃 **Entrada pessoal na corrida** com cronometragem por chip
- ⏱️ **Pacemakers** em cada onda de partida para ajudar a alcançar os teus objetivos
- 💧 **Abastecimentos extensivos** ao longo do percurso (sólidos e líquidos)
- 🏅 **Medalha de Finisher** exclusiva
- 📜 **Certificado personalizado** de conclusão
- 🧥 **Poncho de alta qualidade** na linha de chegada
- 💆 **Serviço de massagem** após a corrida
- 🏥 **Cuidados médicos** e assistência no percurso
- 🚿 **Instalações de duche** disponíveis
- 🛍️ **Acesso ao MARATHON EXPO** com área de merchandising oficial
- 🛡️ **Seguro** incluído (acidentes pessoais e responsabilidade civil)

## 📅 Inscrições - Sistema de Lotaria

**Período de Inscrição:** 25 de setembro - 6 de novembro de 2025

A BMW BERLIN-MARATHON utiliza um **sistema de lotaria** para inscrições:

- As inscrições são aceites durante o período de lotaria
- Após o encerramento, é realizado um sorteio
- Os participantes selecionados são notificados por email
- Taxa de inscrição: **205€** (apenas para selecionados)

### 💰 Preços

- **Lotaria:** 205€ (25 set - 6 nov 2025)

## 🌟 Sobre a BMW BERLIN-MARATHON

A BMW BERLIN-MARATHON é uma das seis maratonas que compõem a prestigiada **Abbott World Marathon Majors Series**, juntamente com Boston, Londres, Chicago, Nova Iorque e Tóquio.

O percurso de Berlim é famoso por ser o **mais rápido do mundo**, tendo sido palco de inúmeros recordes mundiais. A corrida atrai atletas de elite e corredores amadores de todo o mundo que procuram alcançar os seus melhores tempos pessoais.

### Por Que Correr em Berlim?

- 🏆 Parte das World Marathon Majors
- ⚡ Percurso recorde mundial - o mais rápido do planeta
- 🎯 Ideal para tempos de qualificação e recordes pessoais
- 🌍 Atmosfera internacional única
- 🏛️ Percurso através dos marcos históricos de Berlim
- 👥 Apoio massivo do público ao longo de todo o percurso
- 🎉 Experiência completa com EXPO e eventos paralelos

## 📞 Informações

**Website Oficial:** [https://www.bmw-berlin-marathon.com/en/](https://www.bmw-berlin-marathon.com/en/)

---

**Boa sorte na lotaria e na tua corrida! 🍀🏃‍♂️**`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-09-27T07:00:00.000Z"),
      endDate: new Date("2026-09-27T14:00:00.000Z"),
      registrationDeadline: new Date("2025-11-06T23:59:59.000Z"),
      city: "Berlim",
      country: "Alemanha",
      latitude: 52.52,
      longitude: 13.405,
      googleMapsUrl: "https://maps.app.goo.gl/8KqWnXqXqGxYqUQJ6",
      externalUrl: "https://www.bmw-berlin-marathon.com/en/",
      imageUrl: "",
      isFeatured: true,
    },
    create: {
      title: "BMW BERLIN-MARATHON",
      slug: "bmw-berlin-marathon-2026",
      description: `# 🏃 BMW BERLIN-MARATHON 2026

A **BMW BERLIN-MARATHON** é uma das maratonas mais prestigiadas do mundo, parte das **Abbott World Marathon Majors Series (AbbottWMM)** e detentora do recorde mundial do percurso.

## 🏆 Destaques do Evento

✅ **Parte da Abbott World Marathon Majors Series**
✅ **Percurso de Recorde Mundial** - o mais rápido do mundo
✅ **Sistema de Lotaria** para inscrições
✅ **Bilhete de 4 dias de transporte público** na zona ABC (24-27 setembro 2026)
✅ **Cronometragem pessoal** com chip
✅ **Pacemakers** em cada onda de partida
✅ **Abastecimentos extensivos** ao longo do percurso
✅ **Medalha de Finisher** e certificado personalizado
✅ **Poncho de alta qualidade** na linha de chegada
✅ **Serviço de massagem** disponível
✅ **Cuidados médicos** e instalações de duche
✅ **MARATHON EXPO** com área de merchandising

## 📍 Local de Partida e Chegada

**Berlim, Alemanha**

O percurso passa pelos pontos mais emblemáticos de Berlim, incluindo o Portão de Brandemburgo.

## 🏃 A Prova

### Maratona - 42.195 km

- **Distância:** 42.195 km
- **Data:** 27 de setembro de 2026
- **Hora de Partida:** A confirmar
- **Idade Mínima:** 18 anos (nascidos em 2008 ou antes)
- **Tempo Limite:** 6 horas e 15 minutos
- **Taxa de Participação:** 205€

O percurso da BMW BERLIN-MARATHON é conhecido por ser o mais rápido do mundo, ideal para recordes pessoais e tempos de qualificação.

## 📋 O Que Está Incluído

### Inscrição Inclui:

- 🎫 **Bilhete de 4 dias** para transportes públicos em Berlim (zona ABC, válido 24-27 set 2026)
- 🏃 **Entrada pessoal na corrida** com cronometragem por chip
- ⏱️ **Pacemakers** em cada onda de partida para ajudar a alcançar os teus objetivos
- 💧 **Abastecimentos extensivos** ao longo do percurso (sólidos e líquidos)
- 🏅 **Medalha de Finisher** exclusiva
- 📜 **Certificado personalizado** de conclusão
- 🧥 **Poncho de alta qualidade** na linha de chegada
- 💆 **Serviço de massagem** após a corrida
- 🏥 **Cuidados médicos** e assistência no percurso
- 🚿 **Instalações de duche** disponíveis
- 🛍️ **Acesso ao MARATHON EXPO** com área de merchandising oficial
- 🛡️ **Seguro** incluído (acidentes pessoais e responsabilidade civil)

## 📅 Inscrições - Sistema de Lotaria

**Período de Inscrição:** 25 de setembro - 6 de novembro de 2025

A BMW BERLIN-MARATHON utiliza um **sistema de lotaria** para inscrições:

- As inscrições são aceites durante o período de lotaria
- Após o encerramento, é realizado um sorteio
- Os participantes selecionados são notificados por email
- Taxa de inscrição: **205€** (apenas para selecionados)

### 💰 Preços

- **Lotaria:** 205€ (25 set - 6 nov 2025)

## 🌟 Sobre a BMW BERLIN-MARATHON

A BMW BERLIN-MARATHON é uma das seis maratonas que compõem a prestigiada **Abbott World Marathon Majors Series**, juntamente com Boston, Londres, Chicago, Nova Iorque e Tóquio.

O percurso de Berlim é famoso por ser o **mais rápido do mundo**, tendo sido palco de inúmeros recordes mundiais. A corrida atrai atletas de elite e corredores amadores de todo o mundo que procuram alcançar os seus melhores tempos pessoais.

### Por Que Correr em Berlim?

- 🏆 Parte das World Marathon Majors
- ⚡ Percurso recorde mundial - o mais rápido do planeta
- 🎯 Ideal para tempos de qualificação e recordes pessoais
- 🌍 Atmosfera internacional única
- 🏛️ Percurso através dos marcos históricos de Berlim
- 👥 Apoio massivo do público ao longo de todo o percurso
- 🎉 Experiência completa com EXPO e eventos paralelos

## 📞 Informações

**Website Oficial:** [https://www.bmw-berlin-marathon.com/en/](https://www.bmw-berlin-marathon.com/en/)

---

**Boa sorte na lotaria e na tua corrida! 🍀🏃‍♂️**`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-09-27T07:00:00.000Z"),
      endDate: new Date("2026-09-27T14:00:00.000Z"),
      registrationDeadline: new Date("2025-11-06T23:59:59.000Z"),
      city: "Berlim",
      country: "Alemanha",
      latitude: 52.52,
      longitude: 13.405,
      googleMapsUrl: "https://maps.app.goo.gl/8KqWnXqXqGxYqUQJ6",
      externalUrl: "https://www.bmw-berlin-marathon.com/en/",
      imageUrl: "",
      isFeatured: true,
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  console.log("📝 Upserting translations for 6 languages...");

  const translations = {
    pt: {
      title: "BMW BERLIN-MARATHON",
      description: `A BMW BERLIN-MARATHON é uma das maratonas mais prestigiadas do mundo, parte da Abbott World Marathon Majors Series. O percurso de recorde mundial oferece inscrição por lotaria, bilhete de transportes públicos de 4 dias, cronometragem por chip, pacemakers, abastecimentos extensivos, medalha de finisher, certificado personalizado, poncho de qualidade, massagem, cuidados médicos e acesso ao MARATHON EXPO.`,
      city: "Berlim",
      metaTitle: "BMW BERLIN-MARATHON 2026 - World Marathon Majors em Berlim",
      metaDescription:
        "Maratona de 42.195km em Berlim, 27 set 2026. Parte da Abbott World Marathon Majors Series. Percurso recorde mundial. Inscrição por lotaria 205€. Tempo limite: 6h15.",
    },
    en: {
      title: "BMW BERLIN-MARATHON",
      description: `The BMW BERLIN-MARATHON is one of the world's most prestigious marathons, part of the Abbott World Marathon Majors Series. The world record course offers lottery registration, 4-day public transport ticket, chip timing, pacemakers, extensive refreshments, finisher medal, personalized certificate, quality poncho, massage service, medical care, and MARATHON EXPO access.`,
      city: "Berlin",
      metaTitle: "BMW BERLIN-MARATHON 2026 - World Marathon Majors in Berlin",
      metaDescription:
        "42.195km marathon in Berlin, Sept 27, 2026. Part of Abbott World Marathon Majors Series. World record course. Lottery registration €205. Time limit: 6h15.",
    },
    es: {
      title: "BMW BERLIN-MARATHON",
      description: `El BMW BERLIN-MARATHON es uno de los maratones más prestigiosos del mundo, parte de la Abbott World Marathon Majors Series. El recorrido récord mundial ofrece inscripción por sorteo, billete de transporte público de 4 días, cronometraje con chip, pacemakers, avituallamientos extensos, medalla de finisher, certificado personalizado, poncho de calidad, servicio de masaje, atención médica y acceso al MARATHON EXPO.`,
      city: "Berlín",
      metaTitle: "BMW BERLIN-MARATHON 2026 - World Marathon Majors en Berlín",
      metaDescription:
        "Maratón de 42.195km en Berlín, 27 sept 2026. Parte de Abbott World Marathon Majors Series. Recorrido récord mundial. Inscripción por sorteo 205€. Límite: 6h15.",
    },
    fr: {
      title: "BMW BERLIN-MARATHON",
      description: `Le BMW BERLIN-MARATHON est l'un des marathons les plus prestigieux au monde, faisant partie de l'Abbott World Marathon Majors Series. Le parcours record mondial propose une inscription par loterie, un billet de transport public de 4 jours, un chronométrage par puce, des pacemakers, des ravitaillements étendus, une médaille de finisher, un certificat personnalisé, un poncho de qualité, un service de massage, des soins médicaux et un accès au MARATHON EXPO.`,
      city: "Berlin",
      metaTitle: "BMW BERLIN-MARATHON 2026 - World Marathon Majors à Berlin",
      metaDescription:
        "Marathon de 42.195km à Berlin, 27 sept 2026. Partie de l'Abbott World Marathon Majors Series. Parcours record mondial. Inscription par loterie 205€. Limite: 6h15.",
    },
    de: {
      title: "BMW BERLIN-MARATHON",
      description: `Der BMW BERLIN-MARATHON ist einer der prestigeträchtigsten Marathons der Welt und Teil der Abbott World Marathon Majors Series. Die Weltrekordstrecke bietet Lotterie-Anmeldung, 4-Tages-Ticket für öffentliche Verkehrsmittel, Chip-Zeitnahme, Pacemaker, umfangreiche Verpflegung, Finisher-Medaille, personalisierte Urkunde, hochwertigen Poncho, Massage-Service, medizinische Versorgung und Zugang zur MARATHON EXPO.`,
      city: "Berlin",
      metaTitle: "BMW BERLIN-MARATHON 2026 - World Marathon Majors in Berlin",
      metaDescription:
        "42.195km Marathon in Berlin, 27. Sept 2026. Teil der Abbott World Marathon Majors Series. Weltrekordstrecke. Lotterie-Anmeldung 205€. Zeitlimit: 6h15.",
    },
    it: {
      title: "BMW BERLIN-MARATHON",
      description: `La BMW BERLIN-MARATHON è una delle maratone più prestigiose al mondo, parte dell'Abbott World Marathon Majors Series. Il percorso da record mondiale offre iscrizione tramite lotteria, biglietto di trasporto pubblico di 4 giorni, cronometraggio con chip, pacemaker, ristori estesi, medaglia di finisher, certificato personalizzato, poncho di qualità, servizio massaggi, assistenza medica e accesso alla MARATHON EXPO.`,
      city: "Berlino",
      metaTitle: "BMW BERLIN-MARATHON 2026 - World Marathon Majors a Berlino",
      metaDescription:
        "Maratona di 42.195km a Berlino, 27 sett 2026. Parte dell'Abbott World Marathon Majors Series. Percorso record mondiale. Iscrizione lotteria 205€. Limite: 6h15.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as Language[]) {
    const trans = translations[lang as keyof typeof translations];
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
      },
      update: {
        title: trans.title,
        description: trans.description,
        city: trans.city,
        metaTitle: trans.metaTitle,
        metaDescription: trans.metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang,
        title: trans.title,
        description: trans.description,
        city: trans.city,
        metaTitle: trans.metaTitle,
        metaDescription: trans.metaDescription,
      },
    });
    console.log(`   ✅ ${lang.toUpperCase()}`);
  }

  // Step 3: Upsert variant (Marathon - 42km)
  console.log("🏃 Upserting event variant...");

  const findOrCreateVariant = async (
    name: string,
    data: {
      description: string;
      distanceKm: number | null;
      elevationGainM: number | null;
      startDate: Date;
      startTime: string | null;
      cutoffTimeHours: number | null;
    }
  ) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.eventVariant.update({
        where: { id: existing.id },
        data,
      });
    } else {
      return await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name,
          ...data,
        },
      });
    }
  };

  const marathonVariant = await findOrCreateVariant("Maratona", {
    description:
      "Maratona completa de 42.195km pelo percurso recorde mundial de Berlim. Idade mínima: 18 anos (nascidos em 2008 ou antes). Tempo limite: 6h15.",
    distanceKm: 42,
    elevationGainM: null,
    startDate: new Date("2026-09-27T07:00:00.000Z"),
    startTime: null,
    cutoffTimeHours: 6.25,
  });
  console.log("   ✅ Maratona (42km)");

  // Step 4: Upsert variant translations separately (ALL 6 languages)
  console.log("🌍 Upserting variant translations...");

  const variantTranslations = {
    pt: {
      name: "Maratona",
      description:
        "Maratona completa de 42.195km pelo percurso recorde mundial de Berlim. Idade mínima: 18 anos (nascidos em 2008 ou antes). Tempo limite: 6h15.",
    },
    en: {
      name: "Marathon",
      description:
        "Full 42.195km marathon on Berlin's world record course. Minimum age: 18 years (born in 2008 or earlier). Time limit: 6h15.",
    },
    es: {
      name: "Maratón",
      description:
        "Maratón completo de 42.195km por el recorrido récord mundial de Berlín. Edad mínima: 18 años (nacidos en 2008 o antes). Límite de tiempo: 6h15.",
    },
    fr: {
      name: "Marathon",
      description:
        "Marathon complet de 42.195km sur le parcours record du monde de Berlin. Âge minimum: 18 ans (nés en 2008 ou avant). Limite de temps: 6h15.",
    },
    de: {
      name: "Marathon",
      description:
        "Kompletter Marathon von 42.195km auf der Weltrekordstrecke von Berlin. Mindestalter: 18 Jahre (geboren 2008 oder früher). Zeitlimit: 6h15.",
    },
    it: {
      name: "Maratona",
      description:
        "Maratona completa di 42.195km sul percorso record mondiale di Berlino. Età minima: 18 anni (nati nel 2008 o prima). Limite di tempo: 6h15.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as Language[]) {
    const trans = variantTranslations[lang as keyof typeof variantTranslations];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: marathonVariant.id,
          language: lang,
        },
      },
      update: {
        name: trans.name,
        description: trans.description,
      },
      create: {
        variantId: marathonVariant.id,
        language: lang,
        name: trans.name,
        description: trans.description,
      },
    });
  }
  console.log("   ✅ Maratona (6 languages)");

  // Step 5: Upsert pricing phase
  console.log("💰 Upserting pricing phase...");

  const findOrCreatePricingPhase = async (
    name: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      discountPercent: number | null;
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
        data: {
          eventId: event.id,
          name,
          ...data,
        },
      });
    }
  };

  await findOrCreatePricingPhase("Lotaria", {
    startDate: new Date("2025-09-25T00:00:00.000Z"),
    endDate: new Date("2025-11-06T23:59:59.000Z"),
    price: 205.0,
    discountPercent: null,
    note: "Sistema de lotaria - apenas participantes selecionados pagam",
  });
  console.log("   ✅ Lotaria (25 set - 6 nov 2025, 205€)");

  console.log("");
  console.log("✅ BMW BERLIN-MARATHON 2026 seeded successfully!");
  console.log("📝 Event slug: bmw-berlin-marathon-2026");
  console.log("🌍 Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("🏃 Variants: 1 (Maratona - 42km)");
  console.log("💰 Pricing phases: 1 (Lotaria)");
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
