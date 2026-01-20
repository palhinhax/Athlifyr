/**
 * Seed Lisbon Eco Marathon 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Lisbon Eco Marathon 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "lisbon-eco-marathon-2026" },
    update: {
      title: "Lisbon Eco Marathon 2026",
      description: `# 🏃 Lisbon Eco Marathon 2026

**12 de Abril de 2026** - Uma maratona eco-responsável no coração de Lisboa!

A **Lisbon Eco Marathon** é um evento desportivo que promove a sustentabilidade e o respeito pelo meio ambiente. Com partida e chegada na **Alameda Cardeal Cerejeira, Parque Eduardo VII**, os percursos desenvolvem-se pelo parque florestal de Monsanto.

## 🌳 Ecoresponsabilidade

Este evento destaca-se pelo seu compromisso ambiental:

- ♻️ **Proibido arremessar resíduos** para o chão (implica desclassificação imediata)
- 🥤 **Não são fornecidos copos** nos abastecimentos - trazer recipiente reutilizável
- 🌍 **Preservação do ambiente** é obrigatória em todas as zonas da prova

## 🏃 Distâncias Disponíveis

### 🏅 Maratona 42km
- **Partida:** 08:30
- **Tempo de corte:** 6 horas (meta às 14:30)
- **Idade mínima:** 18 anos
- **Abastecimentos:** Km 4, 10, 16, 22, 28, 36 e Meta
- **Material recomendado:** Manta térmica, copo reutilizável, reserva de água, apito

### 🏃 Meia Maratona 21km
- **Partida:** 09:30
- **Tempo de corte:** 6 horas (meta às 14:30)
- **Idade mínima:** 18 anos
- **Abastecimentos:** Km 4, 10, 15 e Meta
- **Material recomendado:** Manta térmica, copo reutilizável, reserva de água

### 🏃 Mini Maratona 13km
- **Partida:** 10:00
- **Tempo de corte:** 6 horas (meta às 14:30)
- **Idade mínima:** 14 anos
- **Abastecimentos:** Km 7 e Meta
- **Material recomendado:** Reserva de água

### 🚶 Caminhada 8km (aprox)
- **Partida:** 10:15
- **Tempo de corte:** 6 horas (meta às 14:30)
- **Sem idade mínima** (crianças acompanhadas por adulto)
- **Abastecimentos:** Km 3,5 e Meta
- **Material recomendado:** Recipiente com água

## 📅 Programa

**Sábado, 11 de Abril de 2026:**
- 10:00 - 19:00: Abertura do Secretariado (Alameda Cardeal Cerejeira)

**Domingo, 12 de Abril de 2026:**
- 07:00: Abertura do Secretariado
- 07:45: Abertura de box Maratona 42km
- 08:30: **Partida Maratona 42km**
- 08:45: Abertura de box Meia Maratona 21km
- 09:30: **Partida Meia Maratona 21km**
- 09:45: Abertura de box Mini Maratona 13km
- 10:00: **Partida Mini Maratona 13km**
- 10:05: Abertura de box Caminhada 8km
- 10:15: **Partida Caminhada 8km**
- 12:30: Cerimónia de Pódio (estimado)
- 14:30: Encerramento de Meta
- 14:35: Encerramento de Evento

## 🎽 Kit de Participação

O kit inclui:
- ✅ T-shirt alusiva à prova (tamanhos S, M, L, XL, XXL)
- ✅ Dorsal em papel com chip não destacável
- ✅ Pulseira para bengaleiro
- ✅ Medalha de finisher (para quem completar a prova)
- ✅ Seguro de acidentes pessoais

## 💰 Inscrição Premium

Por apenas **+25,00€** (até 15 de Março de 2026), inclui:
- 🍽️ Almoço
- 💆 Massagem Desportiva

## 📍 Local

**Partida e Chegada:** Alameda Cardeal Cerejeira, Parque Eduardo VII, Lisboa
**Percurso:** Parque Florestal de Monsanto

## 🏆 Classificações

Prémios para os 3 primeiros classificados (masculino e feminino) de cada prova:
- Troféus entregues na cerimónia de pódio
- Diplomas digitais por escalão
- Prémio para a maior equipa (Clubes e Empresas)

## ⚠️ Limites de Tempo

- **Tempo máximo:** 6 horas desde a partida da Maratona 42km (08:30)
- **Meta encerra:** 14:30
- **Último abastecimento** (5km antes da meta): encerra às 13:30

Após estas horas, todos os participantes serão considerados desclassificados.

## 👥 Participantes

Limitado a **3.000 lugares** no total das quatro distâncias.

## 🌐 Organização

**Clube Desportivo e Recreativo Chronos**
Em colaboração com Stream Plan, LDA.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-12T08:30:00Z"),
      endDate: new Date("2026-04-12T14:35:00Z"),
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7259,
      longitude: -9.1498,
      googleMapsUrl:
        "https://www.google.com/maps?q=Alameda+Cardeal+Cerejeira,+Parque+Eduardo+VII,+Lisboa",
      externalUrl: "https://www.lisbonecomarathon.com",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-05T20:00:00Z"),
    },
    create: {
      title: "Lisbon Eco Marathon 2026",
      slug: "lisbon-eco-marathon-2026",
      description: `# 🏃 Lisbon Eco Marathon 2026

**12 de Abril de 2026** - Uma maratona eco-responsável no coração de Lisboa!

A **Lisbon Eco Marathon** é um evento desportivo que promove a sustentabilidade e o respeito pelo meio ambiente. Com partida e chegada na **Alameda Cardeal Cerejeira, Parque Eduardo VII**, os percursos desenvolvem-se pelo parque florestal de Monsanto.

## 🌳 Ecoresponsabilidade

Este evento destaca-se pelo seu compromisso ambiental:

- ♻️ **Proibido arremessar resíduos** para o chão (implica desclassificação imediata)
- 🥤 **Não são fornecidos copos** nos abastecimentos - trazer recipiente reutilizável
- 🌍 **Preservação do ambiente** é obrigatória em todas as zonas da prova

## 🏃 Distâncias Disponíveis

### 🏅 Maratona 42km
- **Partida:** 08:30
- **Tempo de corte:** 6 horas (meta às 14:30)
- **Idade mínima:** 18 anos
- **Abastecimentos:** Km 4, 10, 16, 22, 28, 36 e Meta
- **Material recomendado:** Manta térmica, copo reutilizável, reserva de água, apito

### 🏃 Meia Maratona 21km
- **Partida:** 09:30
- **Tempo de corte:** 6 horas (meta às 14:30)
- **Idade mínima:** 18 anos
- **Abastecimentos:** Km 4, 10, 15 e Meta
- **Material recomendado:** Manta térmica, copo reutilizável, reserva de água

### 🏃 Mini Maratona 13km
- **Partida:** 10:00
- **Tempo de corte:** 6 horas (meta às 14:30)
- **Idade mínima:** 14 anos
- **Abastecimentos:** Km 7 e Meta
- **Material recomendado:** Reserva de água

### 🚶 Caminhada 8km (aprox)
- **Partida:** 10:15
- **Tempo de corte:** 6 horas (meta às 14:30)
- **Sem idade mínima** (crianças acompanhadas por adulto)
- **Abastecimentos:** Km 3,5 e Meta
- **Material recomendado:** Recipiente com água

## 📅 Programa

**Sábado, 11 de Abril de 2026:**
- 10:00 - 19:00: Abertura do Secretariado (Alameda Cardeal Cerejeira)

**Domingo, 12 de Abril de 2026:**
- 07:00: Abertura do Secretariado
- 07:45: Abertura de box Maratona 42km
- 08:30: **Partida Maratona 42km**
- 08:45: Abertura de box Meia Maratona 21km
- 09:30: **Partida Meia Maratona 21km**
- 09:45: Abertura de box Mini Maratona 13km
- 10:00: **Partida Mini Maratona 13km**
- 10:05: Abertura de box Caminhada 8km
- 10:15: **Partida Caminhada 8km**
- 12:30: Cerimónia de Pódio (estimado)
- 14:30: Encerramento de Meta
- 14:35: Encerramento de Evento

## 🎽 Kit de Participação

O kit inclui:
- ✅ T-shirt alusiva à prova (tamanhos S, M, L, XL, XXL)
- ✅ Dorsal em papel com chip não destacável
- ✅ Pulseira para bengaleiro
- ✅ Medalha de finisher (para quem completar a prova)
- ✅ Seguro de acidentes pessoais

## 💰 Inscrição Premium

Por apenas **+25,00€** (até 15 de Março de 2026), inclui:
- 🍽️ Almoço
- 💆 Massagem Desportiva

## 📍 Local

**Partida e Chegada:** Alameda Cardeal Cerejeira, Parque Eduardo VII, Lisboa
**Percurso:** Parque Florestal de Monsanto

## 🏆 Classificações

Prémios para os 3 primeiros classificados (masculino e feminino) de cada prova:
- Troféus entregues na cerimónia de pódio
- Diplomas digitais por escalão
- Prémio para a maior equipa (Clubes e Empresas)

## ⚠️ Limites de Tempo

- **Tempo máximo:** 6 horas desde a partida da Maratona 42km (08:30)
- **Meta encerra:** 14:30
- **Último abastecimento** (5km antes da meta): encerra às 13:30

Após estas horas, todos os participantes serão considerados desclassificados.

## 👥 Participantes

Limitado a **3.000 lugares** no total das quatro distâncias.

## 🌐 Organização

**Clube Desportivo e Recreativo Chronos**
Em colaboração com Stream Plan, LDA.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-12T08:30:00Z"),
      endDate: new Date("2026-04-12T14:35:00Z"),
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7259,
      longitude: -9.1498,
      googleMapsUrl:
        "https://www.google.com/maps?q=Alameda+Cardeal+Cerejeira,+Parque+Eduardo+VII,+Lisboa",
      externalUrl: "https://www.lisbonecomarathon.com",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-05T20:00:00Z"),
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
      title: "Lisbon Eco Marathon 2026",
      description: `# 🏃 Lisbon Eco Marathon 2026

Uma maratona eco-responsável no coração de Lisboa! Quatro distâncias (42km, 21km, 13km, 8km) pelo Parque Florestal de Monsanto, com partida e chegada no Parque Eduardo VII.

🌳 **Compromisso ambiental:** Proibido uso de plásticos descartáveis. Traz o teu recipiente reutilizável!

📅 **Data:** 12 de Abril de 2026
📍 **Local:** Alameda Cardeal Cerejeira, Parque Eduardo VII, Lisboa
👥 **Limitado a 3.000 participantes**`,
      city: "Lisboa",
      metaTitle: "Lisbon Eco Marathon 2026 - Inscrições | Athlifyr",
      metaDescription:
        "Participa na Lisbon Eco Marathon 2026, a maratona eco-responsável de Lisboa. 4 distâncias no Parque Florestal de Monsanto. Inscrições abertas!",
    },
    en: {
      title: "Lisbon Eco Marathon 2026",
      description: `# 🏃 Lisbon Eco Marathon 2026

An eco-responsible marathon in the heart of Lisbon! Four distances (42km, 21km, 13km, 8km) through Monsanto Forest Park, starting and finishing at Eduardo VII Park.

🌳 **Environmental commitment:** No disposable plastics allowed. Bring your own reusable container!

📅 **Date:** April 12, 2026
📍 **Location:** Alameda Cardeal Cerejeira, Eduardo VII Park, Lisbon
👥 **Limited to 3,000 participants**`,
      city: "Lisbon",
      metaTitle: "Lisbon Eco Marathon 2026 - Registration | Athlifyr",
      metaDescription:
        "Join the Lisbon Eco Marathon 2026, Lisbon's eco-responsible marathon. 4 distances in Monsanto Forest Park. Register now!",
    },
    es: {
      title: "Lisbon Eco Marathon 2026",
      description: `# 🏃 Lisbon Eco Marathon 2026

¡Un maratón eco-responsable en el corazón de Lisboa! Cuatro distancias (42km, 21km, 13km, 8km) por el Parque Forestal de Monsanto, con salida y llegada en el Parque Eduardo VII.

🌳 **Compromiso ambiental:** No se permiten plásticos desechables. ¡Trae tu propio recipiente reutilizable!

📅 **Fecha:** 12 de abril de 2026
📍 **Lugar:** Alameda Cardeal Cerejeira, Parque Eduardo VII, Lisboa
👥 **Limitado a 3.000 participantes**`,
      city: "Lisboa",
      metaTitle: "Lisbon Eco Marathon 2026 - Inscripción | Athlifyr",
      metaDescription:
        "Participa en el Lisbon Eco Marathon 2026, el maratón eco-responsable de Lisboa. 4 distancias en el Parque Forestal de Monsanto. ¡Inscríbete!",
    },
    fr: {
      title: "Lisbon Eco Marathon 2026",
      description: `# 🏃 Lisbon Eco Marathon 2026

Un marathon éco-responsable au cœur de Lisbonne ! Quatre distances (42km, 21km, 13km, 8km) à travers le Parc Forestier de Monsanto, avec départ et arrivée au Parc Eduardo VII.

🌳 **Engagement environnemental :** Plastiques jetables interdits. Apportez votre propre récipient réutilisable !

📅 **Date :** 12 avril 2026
📍 **Lieu :** Alameda Cardeal Cerejeira, Parc Eduardo VII, Lisbonne
👥 **Limité à 3 000 participants**`,
      city: "Lisbonne",
      metaTitle: "Lisbon Eco Marathon 2026 - Inscription | Athlifyr",
      metaDescription:
        "Participez au Lisbon Eco Marathon 2026, le marathon éco-responsable de Lisbonne. 4 distances dans le Parc Forestier de Monsanto. Inscrivez-vous !",
    },
    de: {
      title: "Lisbon Eco Marathon 2026",
      description: `# 🏃 Lisbon Eco Marathon 2026

Ein umweltfreundlicher Marathon im Herzen von Lissabon! Vier Distanzen (42km, 21km, 13km, 8km) durch den Monsanto-Waldpark, Start und Ziel im Eduardo VII Park.

🌳 **Umwelt-Engagement:** Keine Einwegplastik erlaubt. Bringen Sie Ihren eigenen wiederverwendbaren Behälter mit!

📅 **Datum:** 12. April 2026
📍 **Ort:** Alameda Cardeal Cerejeira, Eduardo VII Park, Lissabon
👥 **Begrenzt auf 3.000 Teilnehmer**`,
      city: "Lissabon",
      metaTitle: "Lisbon Eco Marathon 2026 - Anmeldung | Athlifyr",
      metaDescription:
        "Nehmen Sie am Lisbon Eco Marathon 2026 teil, dem umweltfreundlichen Marathon von Lissabon. 4 Distanzen im Monsanto-Waldpark. Jetzt anmelden!",
    },
    it: {
      title: "Lisbon Eco Marathon 2026",
      description: `# 🏃 Lisbon Eco Marathon 2026

Una maratona eco-responsabile nel cuore di Lisbona! Quattro distanze (42km, 21km, 13km, 8km) attraverso il Parco Forestale di Monsanto, con partenza e arrivo al Parco Eduardo VII.

🌳 **Impegno ambientale:** Plastica monouso vietata. Porta il tuo contenitore riutilizzabile!

📅 **Data:** 12 aprile 2026
📍 **Luogo:** Alameda Cardeal Cerejeira, Parco Eduardo VII, Lisbona
👥 **Limitato a 3.000 partecipanti**`,
      city: "Lisbona",
      metaTitle: "Lisbon Eco Marathon 2026 - Iscrizione | Athlifyr",
      metaDescription:
        "Partecipa alla Lisbon Eco Marathon 2026, la maratona eco-responsabile di Lisbona. 4 distanze nel Parco Forestale di Monsanto. Iscriviti ora!",
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
  // Variant 1: Marathon 42km
  let variant42km = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Maratona 42km",
    },
  });

  if (variant42km) {
    variant42km = await prisma.eventVariant.update({
      where: { id: variant42km.id },
      data: {
        name: "Maratona 42km",
        description:
          "Maratona completa de 42km pelo Parque Florestal de Monsanto. Idade mínima: 18 anos. Partida às 08:30. Material obrigatório: manta térmica, copo reutilizável, reserva de água, apito.",
        distanceKm: 42,
        price: 50.0,
        currency: Currency.EUR,
        maxParticipants: null,
        startDate: new Date("2026-04-12T08:30:00Z"),
        startTime: "08:30",
        elevationGainM: null,
        elevationLossM: null,
        cutoffTimeHours: 6.0,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
    });
  } else {
    variant42km = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Maratona 42km",
        description:
          "Maratona completa de 42km pelo Parque Florestal de Monsanto. Idade mínima: 18 anos. Partida às 08:30. Material obrigatório: manta térmica, copo reutilizável, reserva de água, apito.",
        distanceKm: 42,
        price: 50.0,
        currency: Currency.EUR,
        maxParticipants: null,
        startDate: new Date("2026-04-12T08:30:00Z"),
        startTime: "08:30",
        elevationGainM: null,
        elevationLossM: null,
        cutoffTimeHours: 6.0,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
    });
  }

  // Variant 1 translations
  const variant42kmTranslations = {
    pt: {
      name: "Maratona 42km",
      description:
        "Maratona completa de 42km pelo Parque Florestal de Monsanto. Idade mínima: 18 anos.",
    },
    en: {
      name: "Marathon 42km",
      description:
        "Full 42km marathon through Monsanto Forest Park. Minimum age: 18 years.",
    },
    es: {
      name: "Maratón 42km",
      description:
        "Maratón completo de 42km por el Parque Forestal de Monsanto. Edad mínima: 18 años.",
    },
    fr: {
      name: "Marathon 42km",
      description:
        "Marathon complet de 42km à travers le Parc Forestier de Monsanto. Âge minimum : 18 ans.",
    },
    de: {
      name: "Marathon 42km",
      description:
        "Vollständiger 42km Marathon durch den Monsanto-Waldpark. Mindestalter: 18 Jahre.",
    },
    it: {
      name: "Maratona 42km",
      description:
        "Maratona completa di 42km attraverso il Parco Forestale di Monsanto. Età minima: 18 anni.",
    },
  };

  for (const lang of languages) {
    const translation = variant42kmTranslations[lang];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant42km.id,
          language: lang,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: variant42km.id,
        language: lang,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  // Variant 2: Half Marathon 21km
  let variant21km = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Meia Maratona 21km",
    },
  });

  if (variant21km) {
    variant21km = await prisma.eventVariant.update({
      where: { id: variant21km.id },
      data: {
        name: "Meia Maratona 21km",
        description:
          "Meia maratona de 21km pelo Parque Florestal de Monsanto. Idade mínima: 18 anos. Partida às 09:30. Material recomendado: manta térmica, copo reutilizável, reserva de água.",
        distanceKm: 21,
        price: 30.0,
        currency: Currency.EUR,
        maxParticipants: null,
        startDate: new Date("2026-04-12T09:30:00Z"),
        startTime: "09:30",
        elevationGainM: null,
        elevationLossM: null,
        cutoffTimeHours: 6.0,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
    });
  } else {
    variant21km = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Meia Maratona 21km",
        description:
          "Meia maratona de 21km pelo Parque Florestal de Monsanto. Idade mínima: 18 anos. Partida às 09:30. Material recomendado: manta térmica, copo reutilizável, reserva de água.",
        distanceKm: 21,
        price: 30.0,
        currency: Currency.EUR,
        maxParticipants: null,
        startDate: new Date("2026-04-12T09:30:00Z"),
        startTime: "09:30",
        elevationGainM: null,
        elevationLossM: null,
        cutoffTimeHours: 6.0,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
    });
  }

  // Variant 2 translations
  const variant21kmTranslations = {
    pt: {
      name: "Meia Maratona 21km",
      description:
        "Meia maratona de 21km pelo Parque Florestal de Monsanto. Idade mínima: 18 anos.",
    },
    en: {
      name: "Half Marathon 21km",
      description:
        "21km half marathon through Monsanto Forest Park. Minimum age: 18 years.",
    },
    es: {
      name: "Media Maratón 21km",
      description:
        "Media maratón de 21km por el Parque Forestal de Monsanto. Edad mínima: 18 años.",
    },
    fr: {
      name: "Semi-Marathon 21km",
      description:
        "Semi-marathon de 21km à travers le Parc Forestier de Monsanto. Âge minimum : 18 ans.",
    },
    de: {
      name: "Halbmarathon 21km",
      description:
        "21km Halbmarathon durch den Monsanto-Waldpark. Mindestalter: 18 Jahre.",
    },
    it: {
      name: "Mezza Maratona 21km",
      description:
        "Mezza maratona di 21km attraverso il Parco Forestale di Monsanto. Età minima: 18 anni.",
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

  // Variant 3: Mini Marathon 13km
  let variant13km = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Mini Maratona 13km",
    },
  });

  if (variant13km) {
    variant13km = await prisma.eventVariant.update({
      where: { id: variant13km.id },
      data: {
        name: "Mini Maratona 13km",
        description:
          "Mini maratona de 13km pelo Parque Florestal de Monsanto. Idade mínima: 14 anos. Partida às 10:00. Material recomendado: reserva de água.",
        distanceKm: 13,
        price: 20.0,
        currency: Currency.EUR,
        maxParticipants: null,
        startDate: new Date("2026-04-12T10:00:00Z"),
        startTime: "10:00",
        elevationGainM: null,
        elevationLossM: null,
        cutoffTimeHours: 6.0,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
    });
  } else {
    variant13km = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Mini Maratona 13km",
        description:
          "Mini maratona de 13km pelo Parque Florestal de Monsanto. Idade mínima: 14 anos. Partida às 10:00. Material recomendado: reserva de água.",
        distanceKm: 13,
        price: 20.0,
        currency: Currency.EUR,
        maxParticipants: null,
        startDate: new Date("2026-04-12T10:00:00Z"),
        startTime: "10:00",
        elevationGainM: null,
        elevationLossM: null,
        cutoffTimeHours: 6.0,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
    });
  }

  // Variant 3 translations
  const variant13kmTranslations = {
    pt: {
      name: "Mini Maratona 13km",
      description:
        "Mini maratona de 13km pelo Parque Florestal de Monsanto. Idade mínima: 14 anos.",
    },
    en: {
      name: "Mini Marathon 13km",
      description:
        "13km mini marathon through Monsanto Forest Park. Minimum age: 14 years.",
    },
    es: {
      name: "Mini Maratón 13km",
      description:
        "Mini maratón de 13km por el Parque Forestal de Monsanto. Edad mínima: 14 años.",
    },
    fr: {
      name: "Mini Marathon 13km",
      description:
        "Mini marathon de 13km à travers le Parc Forestier de Monsanto. Âge minimum : 14 ans.",
    },
    de: {
      name: "Mini Marathon 13km",
      description:
        "13km Mini-Marathon durch den Monsanto-Waldpark. Mindestalter: 14 Jahre.",
    },
    it: {
      name: "Mini Maratona 13km",
      description:
        "Mini maratona di 13km attraverso il Parco Forestale di Monsanto. Età minima: 14 anni.",
    },
  };

  for (const lang of languages) {
    const translation = variant13kmTranslations[lang];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant13km.id,
          language: lang,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: variant13km.id,
        language: lang,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  // Variant 4: Walk 8km
  let variant8km = await prisma.eventVariant.findFirst({
    where: {
      eventId: event.id,
      name: "Caminhada 8km",
    },
  });

  if (variant8km) {
    variant8km = await prisma.eventVariant.update({
      where: { id: variant8km.id },
      data: {
        name: "Caminhada 8km",
        description:
          "Caminhada de aproximadamente 8km pelo Parque Florestal de Monsanto. Sem idade mínima (crianças acompanhadas por adulto). Partida às 10:15. Material recomendado: recipiente com água.",
        distanceKm: 8,
        price: 12.0,
        currency: Currency.EUR,
        maxParticipants: null,
        startDate: new Date("2026-04-12T10:15:00Z"),
        startTime: "10:15",
        elevationGainM: null,
        elevationLossM: null,
        cutoffTimeHours: 6.0,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
    });
  } else {
    variant8km = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: "Caminhada 8km",
        description:
          "Caminhada de aproximadamente 8km pelo Parque Florestal de Monsanto. Sem idade mínima (crianças acompanhadas por adulto). Partida às 10:15. Material recomendado: recipiente com água.",
        distanceKm: 8,
        price: 12.0,
        currency: Currency.EUR,
        maxParticipants: null,
        startDate: new Date("2026-04-12T10:15:00Z"),
        startTime: "10:15",
        elevationGainM: null,
        elevationLossM: null,
        cutoffTimeHours: 6.0,
        itraPoints: null,
        atrpGrade: null,
        mountainLevel: null,
      },
    });
  }

  // Variant 4 translations
  const variant8kmTranslations = {
    pt: {
      name: "Caminhada 8km",
      description:
        "Caminhada de aproximadamente 8km pelo Parque Florestal de Monsanto. Sem idade mínima.",
    },
    en: {
      name: "Walk 8km",
      description:
        "Approximately 8km walk through Monsanto Forest Park. No minimum age.",
    },
    es: {
      name: "Caminata 8km",
      description:
        "Caminata de aproximadamente 8km por el Parque Forestal de Monsanto. Sin edad mínima.",
    },
    fr: {
      name: "Marche 8km",
      description:
        "Marche d'environ 8km à travers le Parc Forestier de Monsanto. Pas d'âge minimum.",
    },
    de: {
      name: "Wanderung 8km",
      description:
        "Circa 8km Wanderung durch den Monsanto-Waldpark. Kein Mindestalter.",
    },
    it: {
      name: "Camminata 8km",
      description:
        "Camminata di circa 8km attraverso il Parco Forestale di Monsanto. Nessuna età minima.",
    },
  };

  for (const lang of languages) {
    const translation = variant8kmTranslations[lang];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant8km.id,
          language: lang,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: variant8km.id,
        language: lang,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("🏃 Variants upserted: 42km, 21km, 13km, 8km");

  // Step 4: Upsert pricing phases for each variant
  // Helper function to upsert pricing phase
  const upsertPricingPhase = async (
    eventId: string,
    variantId: string,
    name: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      discountPercent: number | null;
      note: string | null;
    }
  ) => {
    const existing = await prisma.pricingPhase.findFirst({
      where: { eventId, name },
    });

    if (existing) {
      return await prisma.pricingPhase.update({
        where: { id: existing.id },
        data: {
          variantId,
          ...data,
        },
      });
    } else {
      return await prisma.pricingPhase.create({
        data: {
          eventId,
          variantId,
          name,
          ...data,
        },
      });
    }
  };

  // Phase 1 (Oct 1-31, 2025) for 42km
  await upsertPricingPhase(event.id, variant42km.id, "42km - Fase 1", {
    startDate: new Date("2025-10-01T00:00:00Z"),
    endDate: new Date("2025-10-31T23:59:59Z"),
    price: 40.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "1ª Fase de inscrições para Maratona 42km",
  });

  // Phase 2 (Nov 1 - Dec 31, 2025) for 42km
  await upsertPricingPhase(event.id, variant42km.id, "42km - Fase 2", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 45.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "2ª Fase de inscrições para Maratona 42km",
  });

  // Phase 3 (Jan 1 - Mar 22, 2026) for 42km
  await upsertPricingPhase(event.id, variant42km.id, "42km - Fase 3", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-03-22T23:59:59Z"),
    price: 48.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "3ª Fase de inscrições para Maratona 42km",
  });

  // Phase 4 (Mar 23 - Apr 5, 2026) for 42km
  await upsertPricingPhase(event.id, variant42km.id, "42km - Fase 4", {
    startDate: new Date("2026-03-23T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 50.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "4ª Fase de inscrições para Maratona 42km",
  });

  // Pricing phases for 21km
  await upsertPricingPhase(event.id, variant21km.id, "21km - Fase 1", {
    startDate: new Date("2025-10-01T00:00:00Z"),
    endDate: new Date("2025-10-31T23:59:59Z"),
    price: 18.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "1ª Fase de inscrições para Meia Maratona 21km",
  });

  await upsertPricingPhase(event.id, variant21km.id, "21km - Fase 2", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 22.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "2ª Fase de inscrições para Meia Maratona 21km",
  });

  await upsertPricingPhase(event.id, variant21km.id, "21km - Fase 3", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-03-22T23:59:59Z"),
    price: 25.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "3ª Fase de inscrições para Meia Maratona 21km",
  });

  await upsertPricingPhase(event.id, variant21km.id, "21km - Fase 4", {
    startDate: new Date("2026-03-23T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 30.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "4ª Fase de inscrições para Meia Maratona 21km",
  });

  // Pricing phases for 13km
  await upsertPricingPhase(event.id, variant13km.id, "13km - Fase 1", {
    startDate: new Date("2025-10-01T00:00:00Z"),
    endDate: new Date("2025-10-31T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "1ª Fase de inscrições para Mini Maratona 13km",
  });

  await upsertPricingPhase(event.id, variant13km.id, "13km - Fase 2", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "2ª Fase de inscrições para Mini Maratona 13km",
  });

  await upsertPricingPhase(event.id, variant13km.id, "13km - Fase 3", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-03-22T23:59:59Z"),
    price: 17.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "3ª Fase de inscrições para Mini Maratona 13km",
  });

  await upsertPricingPhase(event.id, variant13km.id, "13km - Fase 4", {
    startDate: new Date("2026-03-23T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 20.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "4ª Fase de inscrições para Mini Maratona 13km",
  });

  // Pricing phases for 8km
  await upsertPricingPhase(event.id, variant8km.id, "8km - Fase 1", {
    startDate: new Date("2025-10-01T00:00:00Z"),
    endDate: new Date("2025-10-31T23:59:59Z"),
    price: 6.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "1ª Fase de inscrições para Caminhada 8km",
  });

  await upsertPricingPhase(event.id, variant8km.id, "8km - Fase 2", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2025-12-31T23:59:59Z"),
    price: 7.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "2ª Fase de inscrições para Caminhada 8km",
  });

  await upsertPricingPhase(event.id, variant8km.id, "8km - Fase 3", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-03-22T23:59:59Z"),
    price: 8.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "3ª Fase de inscrições para Caminhada 8km",
  });

  await upsertPricingPhase(event.id, variant8km.id, "8km - Fase 4", {
    startDate: new Date("2026-03-23T00:00:00Z"),
    endDate: new Date("2026-04-05T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "4ª Fase de inscrições para Caminhada 8km",
  });

  console.log("💰 Pricing phases upserted: 4 phases for each of 4 variants");

  console.log("\n✅ Lisbon Eco Marathon 2026 seed completed successfully!");
  console.log("📊 Summary:");
  console.log("   - 1 event created/updated");
  console.log("   - 6 language translations (pt, en, es, fr, de, it)");
  console.log("   - 4 variants (42km, 21km, 13km, 8km)");
  console.log("   - 24 variant translations (4 variants × 6 languages)");
  console.log("   - 16 pricing phases (4 phases × 4 variants)");
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
