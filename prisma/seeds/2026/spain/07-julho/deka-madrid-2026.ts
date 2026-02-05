/**
 * Seed DEKA Madrid 2026
 * Complete with translations in all 6 languages
 * DEKA FIT, DEKA MILE, DEKA STRONG, DEKA FIT Teams & DEKA MILE Teams
 * Location: Madrid Arena, Madrid, Spain
 * Dates: July 18-19, 2026
 * Includes DEKA CUP
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Seeding DEKA Madrid 2026...");

  // Step 1: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "deka-madrid-2026" },
    update: {
      title: "DEKA Madrid 2026",
      description: `## 🏋️ DEKA Madrid 2026

**A DEKA regressa ao Madrid Arena!**

Prepara-te, Madrid! A DEKA regressa ao Madrid Arena nos dias 18 e 19 de julho para um fim de semana repleto de energia, competição e conquistas.

### 🏆 DEKA CUP

Este evento acolhe a **DEKA CUP**, onde os melhores atletas se enfrentam para conquistar a glória! Uma competição de elite dentro do universo DEKA.

### 🔥 O Que é a DEKA?

A **DEKA** é uma competição de fitness funcional criada pela Spartan que testa a força, resistência e capacidade atlética através de **10 zonas de exercícios** intercaladas com corrida. É o teste de fitness mais completo do mundo!

### 🏃 As Provas

**DEKA FIT** - O Desafio Completo
- Distância: 5 km
- Zonas: 10
- Testa todas as capacidades físicas

**DEKA MILE** - Velocidade e Potência
- Distância: 1 milha (1.6 km)
- Zonas: 10
- Versão mais rápida e intensa

**DEKA STRONG** - Força Pura
- Corrida: 0 km
- Zonas: 10
- Foco total nos exercícios de força!

**DEKA FIT Teams** - Trabalho de Equipa
- Distância: 5 km
- Zonas: 10
- 2 atletas por equipa

**DEKA MILE Teams** - Velocidade em Equipa
- Distância: 1 milha (1.6 km)
- Zonas: 10
- 2 atletas por equipa

### 🎯 DEKA Trifecta

Completa DEKA FIT, DEKA MILE e DEKA STRONG no mesmo evento e conquista a **DEKA Trifecta**! Mostra do que és capaz!

### 💪 As 10 Zonas DEKA

1. **Ram Burpees** - 20 repetições
2. **Rows** - 500m no remo
3. **Farmers Carry** - 100m com kettlebells
4. **Box Jump Overs** - 20 repetições
5. **Med Ball Sit-Up Throws** - 25 repetições
6. **Ski Erg** - 500m
7. **Assault Bike** - 20 calorias
8. **Dead Ball Wall-Overs** - 20 repetições
9. **Tank Push/Pull** - 40m ida e volta
10. **Ram Burpees** - 20 repetições (novamente!)

### 🏆 DEKA Mark

Conquista o teu **DEKA Mark** - a classificação oficial que mede o teu nível de fitness. Quanto mais baixo o tempo, melhor o teu DEKA Mark!

### 📍 Localização

**Madrid Arena**
Av. de Portugal, s/n
Moncloa - Aravaca, 28011
Madrid, Espanha

O Madrid Arena é um dos principais pavilhões multiusos de Espanha, perfeito para acolher este evento épico de fitness!

### 📅 Programa

**SÁBADO, 18 JULHO 2026**
- DEKA FIT Age Group & Elite
- DEKA MILE
- DEKA STRONG
- DEKA CUP

**DOMINGO, 19 JULHO 2026**
- DEKA MILE Teams
- DEKA FIT Teams
- Cerimónias de Premiação

*Horário detalhado a anunciar.*

### 🎁 O Que Está Incluído

- 🏅 Medalha Finisher DEKA
- 👕 T-Shirt oficial DEKA
- 📊 DEKA Mark oficial
- 📸 Acesso a fotos oficiais
- 🏥 Seguro de acidentes
- 💧 Abastecimentos durante a prova

### ⚠️ Regras Importantes

- Todas as zonas devem ser completadas
- Equipamento fornecido pela organização
- Seguir as instruções dos juízes
- Respeitar os tempos de aquecimento

### ℹ️ Informações Importantes

- 🌐 Evento internacional DEKA
- 🏋️ Parte do circuito DEKA Global
- 🏆 Sede da DEKA CUP
- 🔗 [spartan.com](https://pt.spartan.com/pt/races/deka-madrid)

**Um fim de semana para desfrutar com a chegada do verão! 💪**`,
      startDate: new Date("2026-07-18T07:00:00Z"),
      endDate: new Date("2026-07-19T20:00:00Z"),
      registrationDeadline: new Date("2026-07-17T23:59:59Z"),
      sportTypes: [SportType.OCR, SportType.RUNNING, SportType.CROSSFIT],
      city: "Madrid",
      country: "Spain",
      latitude: 40.4053,
      longitude: -3.7187,
      googleMapsUrl: "https://maps.app.goo.gl/2L7bQXqQKJc9dkXY8",
      externalUrl: "https://pt.spartan.com/pt/races/deka-madrid",
      imageUrl: "",
      isFeatured: true,
    },
    create: {
      title: "DEKA Madrid 2026",
      slug: "deka-madrid-2026",
      description: `## 🏋️ DEKA Madrid 2026

**A DEKA regressa ao Madrid Arena!**

Prepara-te, Madrid! A DEKA regressa ao Madrid Arena nos dias 18 e 19 de julho para um fim de semana repleto de energia, competição e conquistas.

### 🏆 DEKA CUP

Este evento acolhe a **DEKA CUP**, onde os melhores atletas se enfrentam para conquistar a glória! Uma competição de elite dentro do universo DEKA.

### 🔥 O Que é a DEKA?

A **DEKA** é uma competição de fitness funcional criada pela Spartan que testa a força, resistência e capacidade atlética através de **10 zonas de exercícios** intercaladas com corrida. É o teste de fitness mais completo do mundo!

### 🏃 As Provas

**DEKA FIT** - O Desafio Completo
- Distância: 5 km
- Zonas: 10
- Testa todas as capacidades físicas

**DEKA MILE** - Velocidade e Potência
- Distância: 1 milha (1.6 km)
- Zonas: 10
- Versão mais rápida e intensa

**DEKA STRONG** - Força Pura
- Corrida: 0 km
- Zonas: 10
- Foco total nos exercícios de força!

**DEKA FIT Teams** - Trabalho de Equipa
- Distância: 5 km
- Zonas: 10
- 2 atletas por equipa

**DEKA MILE Teams** - Velocidade em Equipa
- Distância: 1 milha (1.6 km)
- Zonas: 10
- 2 atletas por equipa

### 🎯 DEKA Trifecta

Completa DEKA FIT, DEKA MILE e DEKA STRONG no mesmo evento e conquista a **DEKA Trifecta**! Mostra do que és capaz!

### 💪 As 10 Zonas DEKA

1. **Ram Burpees** - 20 repetições
2. **Rows** - 500m no remo
3. **Farmers Carry** - 100m com kettlebells
4. **Box Jump Overs** - 20 repetições
5. **Med Ball Sit-Up Throws** - 25 repetições
6. **Ski Erg** - 500m
7. **Assault Bike** - 20 calorias
8. **Dead Ball Wall-Overs** - 20 repetições
9. **Tank Push/Pull** - 40m ida e volta
10. **Ram Burpees** - 20 repetições (novamente!)

### 🏆 DEKA Mark

Conquista o teu **DEKA Mark** - a classificação oficial que mede o teu nível de fitness. Quanto mais baixo o tempo, melhor o teu DEKA Mark!

### 📍 Localização

**Madrid Arena**
Av. de Portugal, s/n
Moncloa - Aravaca, 28011
Madrid, Espanha

O Madrid Arena é um dos principais pavilhões multiusos de Espanha, perfeito para acolher este evento épico de fitness!

### 📅 Programa

**SÁBADO, 18 JULHO 2026**
- DEKA FIT Age Group & Elite
- DEKA MILE
- DEKA STRONG
- DEKA CUP

**DOMINGO, 19 JULHO 2026**
- DEKA MILE Teams
- DEKA FIT Teams
- Cerimónias de Premiação

*Horário detalhado a anunciar.*

### 🎁 O Que Está Incluído

- 🏅 Medalha Finisher DEKA
- 👕 T-Shirt oficial DEKA
- 📊 DEKA Mark oficial
- 📸 Acesso a fotos oficiais
- 🏥 Seguro de acidentes
- 💧 Abastecimentos durante a prova

### ⚠️ Regras Importantes

- Todas as zonas devem ser completadas
- Equipamento fornecido pela organização
- Seguir as instruções dos juízes
- Respeitar os tempos de aquecimento

### ℹ️ Informações Importantes

- 🌐 Evento internacional DEKA
- 🏋️ Parte do circuito DEKA Global
- 🏆 Sede da DEKA CUP
- 🔗 [spartan.com](https://pt.spartan.com/pt/races/deka-madrid)

**Um fim de semana para desfrutar com a chegada do verão! 💪**`,
      startDate: new Date("2026-07-18T07:00:00Z"),
      endDate: new Date("2026-07-19T20:00:00Z"),
      registrationDeadline: new Date("2026-07-17T23:59:59Z"),
      sportTypes: [SportType.OCR, SportType.RUNNING, SportType.CROSSFIT],
      city: "Madrid",
      country: "Spain",
      latitude: 40.4053,
      longitude: -3.7187,
      googleMapsUrl: "https://maps.app.goo.gl/2L7bQXqQKJc9dkXY8",
      externalUrl: "https://pt.spartan.com/pt/races/deka-madrid",
      imageUrl: "",
      isFeatured: true,
    },
  });

  console.log(`✅ Event upserted with ID: ${event.id}`);

  // Step 2: Upsert translations for all 6 languages
  const languages = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  const translations = {
    pt: {
      title: "DEKA Madrid 2026",
      description: `## 🏋️ DEKA Madrid 2026

**A DEKA regressa ao Madrid Arena!**

Prepara-te, Madrid! A DEKA regressa ao Madrid Arena nos dias 18 e 19 de julho para um fim de semana repleto de energia, competição e conquistas. Este evento acolhe a **DEKA CUP**, onde os melhores atletas se enfrentam!

### 🏃 As Provas

**DEKA FIT** - 5 km | 10 zonas | O desafio completo
**DEKA MILE** - 1 milha | 10 zonas | Velocidade e potência
**DEKA STRONG** - 0 km | 10 zonas | Força pura!
**DEKA FIT Teams** - 5 km | 10 zonas | 2 atletas
**DEKA MILE Teams** - 1 milha | 10 zonas | 2 atletas

### 🎯 DEKA Trifecta

Completa DEKA FIT, DEKA MILE e DEKA STRONG e conquista a **DEKA Trifecta**!

### 📍 Localização

**Madrid Arena**
Av. de Portugal, s/n, Moncloa - Aravaca, 28011, Madrid

### 📅 Programa

**SÁBADO, 18 JULHO** - DEKA FIT, DEKA MILE, DEKA STRONG, DEKA CUP
**DOMINGO, 19 JULHO** - DEKA MILE Teams, DEKA FIT Teams

**Um fim de semana para desfrutar com a chegada do verão! 💪**`,
      city: "Madrid",
      metaTitle: "DEKA Madrid 2026 | Madrid Arena | 18-19 Julho",
      metaDescription:
        "DEKA Madrid 2026 - 18 e 19 julho no Madrid Arena. DEKA FIT, DEKA MILE, DEKA STRONG e Teams. Sede da DEKA CUP! Conquista a DEKA Trifecta!",
    },
    en: {
      title: "DEKA Madrid 2026",
      description: `## 🏋️ DEKA Madrid 2026

**DEKA returns to Madrid Arena!**

Get ready, Madrid! DEKA returns to the Madrid Arena on July 18 and 19 for a weekend packed with energy, competition, and achievement. This event hosts the **DEKA CUP**, where the best athletes face off for glory!

### 🏃 The Races

**DEKA FIT** - 5 km | 10 zones | The complete challenge
**DEKA MILE** - 1 mile | 10 zones | Speed and power
**DEKA STRONG** - 0 km | 10 zones | Pure strength!
**DEKA FIT Teams** - 5 km | 10 zones | 2 athletes
**DEKA MILE Teams** - 1 mile | 10 zones | 2 athletes

### 🎯 DEKA Trifecta

Complete DEKA FIT, DEKA MILE and DEKA STRONG to earn the **DEKA Trifecta**!

### 📍 Location

**Madrid Arena**
Av. de Portugal, s/n, Moncloa - Aravaca, 28011, Madrid

### 📅 Schedule

**SATURDAY, JULY 18** - DEKA FIT, DEKA MILE, DEKA STRONG, DEKA CUP
**SUNDAY, JULY 19** - DEKA MILE Teams, DEKA FIT Teams

**A weekend to enjoy as summer approaches! 💪**`,
      city: "Madrid",
      metaTitle: "DEKA Madrid 2026 | Madrid Arena | July 18-19",
      metaDescription:
        "DEKA Madrid 2026 - July 18-19 at Madrid Arena. DEKA FIT, DEKA MILE, DEKA STRONG and Teams. Home of the DEKA CUP! Earn the DEKA Trifecta!",
    },
    es: {
      title: "DEKA Madrid 2026",
      description: `## 🏋️ DEKA Madrid 2026

**¡DEKA vuelve al Madrid Arena!**

¡Prepárate, Madrid! DEKA regresa al Madrid Arena los días 18 y 19 de julio para un fin de semana repleto de energía, competición y logros. Este evento acoge la **DEKA CUP**, ¡donde los mejores atletas se enfrentan por la gloria!

### 🏃 Las Carreras

**DEKA FIT** - 5 km | 10 zonas | El desafío completo
**DEKA MILE** - 1 milla | 10 zonas | Velocidad y potencia
**DEKA STRONG** - 0 km | 10 zonas | ¡Fuerza pura!
**DEKA FIT Teams** - 5 km | 10 zonas | 2 atletas
**DEKA MILE Teams** - 1 milla | 10 zonas | 2 atletas

### 🎯 DEKA Trifecta

¡Completa DEKA FIT, DEKA MILE y DEKA STRONG y consigue la **DEKA Trifecta**!

### 📍 Ubicación

**Madrid Arena**
Av. de Portugal, s/n, Moncloa - Aravaca, 28011, Madrid

### 📅 Programa

**SÁBADO, 18 DE JULIO** - DEKA FIT, DEKA MILE, DEKA STRONG, DEKA CUP
**DOMINGO, 19 DE JULIO** - DEKA MILE Teams, DEKA FIT Teams

**¡Un fin de semana para disfrutar con la llegada del verano! 💪**`,
      city: "Madrid",
      metaTitle: "DEKA Madrid 2026 | Madrid Arena | 18-19 de Julio",
      metaDescription:
        "DEKA Madrid 2026 - 18 y 19 de julio en el Madrid Arena. DEKA FIT, DEKA MILE, DEKA STRONG y Teams. ¡Sede de la DEKA CUP! ¡Consigue la DEKA Trifecta!",
    },
    fr: {
      title: "DEKA Madrid 2026",
      description: `## 🏋️ DEKA Madrid 2026

**DEKA revient au Madrid Arena !**

Préparez-vous, Madrid ! DEKA revient au Madrid Arena les 18 et 19 juillet pour un week-end rempli d'énergie, de compétition et de réalisations. Cet événement accueille la **DEKA CUP**, où les meilleurs athlètes s'affrontent pour la gloire !

### 🏃 Les Épreuves

**DEKA FIT** - 5 km | 10 zones | Le défi complet
**DEKA MILE** - 1 mile | 10 zones | Vitesse et puissance
**DEKA STRONG** - 0 km | 10 zones | Force pure !
**DEKA FIT Teams** - 5 km | 10 zones | 2 athlètes
**DEKA MILE Teams** - 1 mile | 10 zones | 2 athlètes

### 🎯 DEKA Trifecta

Complétez DEKA FIT, DEKA MILE et DEKA STRONG et obtenez la **DEKA Trifecta** !

### 📍 Lieu

**Madrid Arena**
Av. de Portugal, s/n, Moncloa - Aravaca, 28011, Madrid

### 📅 Programme

**SAMEDI 18 JUILLET** - DEKA FIT, DEKA MILE, DEKA STRONG, DEKA CUP
**DIMANCHE 19 JUILLET** - DEKA MILE Teams, DEKA FIT Teams

**Un week-end à savourer à l'approche de l'été ! 💪**`,
      city: "Madrid",
      metaTitle: "DEKA Madrid 2026 | Madrid Arena | 18-19 Juillet",
      metaDescription:
        "DEKA Madrid 2026 - 18 et 19 juillet au Madrid Arena. DEKA FIT, DEKA MILE, DEKA STRONG et Teams. Siège de la DEKA CUP ! Obtenez la DEKA Trifecta !",
    },
    de: {
      title: "DEKA Madrid 2026",
      description: `## 🏋️ DEKA Madrid 2026

**DEKA kehrt in die Madrid Arena zurück!**

Mach dich bereit, Madrid! DEKA kehrt am 18. und 19. Juli in die Madrid Arena zurück für ein Wochenende voller Energie, Wettkampf und Erfolge. Diese Veranstaltung beherbergt den **DEKA CUP**, wo die besten Athleten um den Ruhm kämpfen!

### 🏃 Die Rennen

**DEKA FIT** - 5 km | 10 Zonen | Die komplette Herausforderung
**DEKA MILE** - 1 Meile | 10 Zonen | Geschwindigkeit und Kraft
**DEKA STRONG** - 0 km | 10 Zonen | Reine Stärke!
**DEKA FIT Teams** - 5 km | 10 Zonen | 2 Athleten
**DEKA MILE Teams** - 1 Meile | 10 Zonen | 2 Athleten

### 🎯 DEKA Trifecta

Absolviere DEKA FIT, DEKA MILE und DEKA STRONG und verdiene die **DEKA Trifecta**!

### 📍 Ort

**Madrid Arena**
Av. de Portugal, s/n, Moncloa - Aravaca, 28011, Madrid

### 📅 Programm

**SAMSTAG, 18. JULI** - DEKA FIT, DEKA MILE, DEKA STRONG, DEKA CUP
**SONNTAG, 19. JULI** - DEKA MILE Teams, DEKA FIT Teams

**Ein Wochenende zum Genießen, wenn der Sommer naht! 💪**`,
      city: "Madrid",
      metaTitle: "DEKA Madrid 2026 | Madrid Arena | 18.-19. Juli",
      metaDescription:
        "DEKA Madrid 2026 - 18. und 19. Juli in der Madrid Arena. DEKA FIT, DEKA MILE, DEKA STRONG und Teams. Austragungsort des DEKA CUP! Verdiene die DEKA Trifecta!",
    },
    it: {
      title: "DEKA Madrid 2026",
      description: `## 🏋️ DEKA Madrid 2026

**DEKA torna al Madrid Arena!**

Preparati, Madrid! DEKA torna al Madrid Arena il 18 e 19 luglio per un weekend ricco di energia, competizione e successi. Questo evento ospita la **DEKA CUP**, dove i migliori atleti si sfidano per la gloria!

### 🏃 Le Gare

**DEKA FIT** - 5 km | 10 zone | La sfida completa
**DEKA MILE** - 1 miglio | 10 zone | Velocità e potenza
**DEKA STRONG** - 0 km | 10 zone | Forza pura!
**DEKA FIT Teams** - 5 km | 10 zone | 2 atleti
**DEKA MILE Teams** - 1 miglio | 10 zone | 2 atleti

### 🎯 DEKA Trifecta

Completa DEKA FIT, DEKA MILE e DEKA STRONG e guadagna la **DEKA Trifecta**!

### 📍 Luogo

**Madrid Arena**
Av. de Portugal, s/n, Moncloa - Aravaca, 28011, Madrid

### 📅 Programma

**SABATO 18 LUGLIO** - DEKA FIT, DEKA MILE, DEKA STRONG, DEKA CUP
**DOMENICA 19 LUGLIO** - DEKA MILE Teams, DEKA FIT Teams

**Un weekend da godersi con l'arrivo dell'estate! 💪**`,
      city: "Madrid",
      metaTitle: "DEKA Madrid 2026 | Madrid Arena | 18-19 Luglio",
      metaDescription:
        "DEKA Madrid 2026 - 18 e 19 luglio al Madrid Arena. DEKA FIT, DEKA MILE, DEKA STRONG e Teams. Sede della DEKA CUP! Guadagna la DEKA Trifecta!",
    },
  };

  console.log("🌍 Upserting translations for all 6 languages...");

  for (const lang of languages) {
    const translation = translations[lang as keyof typeof translations];

    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId: event.id, language: lang } },
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

    console.log(`   ✅ ${lang.toUpperCase()} translation upserted`);
  }

  // Step 3: Delete existing variants and pricing phases to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

  console.log("🗑️ Cleared existing variants and pricing phases");

  // Step 4: Create variants with pricing phases
  const variants = [
    {
      name: "DEKA FIT",
      distanceKm: 5,
      elevationGainM: null,
      startDate: new Date("2026-07-18T08:00:00Z"),
      maxParticipants: 400,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-04-30T23:59:59Z"),
          price: 80.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA FIT",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-05-01T00:00:00Z"),
          endDate: new Date("2026-06-30T23:59:59Z"),
          price: 95.0,
          currency: Currency.EUR,
          note: "Regular - DEKA FIT",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-07-01T00:00:00Z"),
          endDate: new Date("2026-07-17T23:59:59Z"),
          price: 110.0,
          currency: Currency.EUR,
          note: "Late Registration - DEKA FIT",
        },
      ],
    },
    {
      name: "DEKA MILE",
      distanceKm: 1.6,
      elevationGainM: null,
      startDate: new Date("2026-07-18T14:00:00Z"),
      maxParticipants: 200,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-04-30T23:59:59Z"),
          price: 60.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA MILE",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-05-01T00:00:00Z"),
          endDate: new Date("2026-06-30T23:59:59Z"),
          price: 70.0,
          currency: Currency.EUR,
          note: "Regular - DEKA MILE",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-07-01T00:00:00Z"),
          endDate: new Date("2026-07-17T23:59:59Z"),
          price: 80.0,
          currency: Currency.EUR,
          note: "Late Registration - DEKA MILE",
        },
      ],
    },
    {
      name: "DEKA STRONG",
      distanceKm: 0,
      elevationGainM: null,
      startDate: new Date("2026-07-18T16:00:00Z"),
      maxParticipants: 150,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-04-30T23:59:59Z"),
          price: 40.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA STRONG",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-05-01T00:00:00Z"),
          endDate: new Date("2026-06-30T23:59:59Z"),
          price: 50.0,
          currency: Currency.EUR,
          note: "Regular - DEKA STRONG",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-07-01T00:00:00Z"),
          endDate: new Date("2026-07-17T23:59:59Z"),
          price: 60.0,
          currency: Currency.EUR,
          note: "Late Registration - DEKA STRONG",
        },
      ],
    },
    {
      name: "DEKA MILE Teams",
      distanceKm: 1.6,
      elevationGainM: null,
      startDate: new Date("2026-07-19T08:00:00Z"),
      maxParticipants: 100,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-04-30T23:59:59Z"),
          price: 45.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA MILE Teams (por pessoa)",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-05-01T00:00:00Z"),
          endDate: new Date("2026-06-30T23:59:59Z"),
          price: 55.0,
          currency: Currency.EUR,
          note: "Regular - DEKA MILE Teams (por pessoa)",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-07-01T00:00:00Z"),
          endDate: new Date("2026-07-17T23:59:59Z"),
          price: 65.0,
          currency: Currency.EUR,
          note: "Late Registration - DEKA MILE Teams (por pessoa)",
        },
      ],
    },
    {
      name: "DEKA FIT Teams",
      distanceKm: 5,
      elevationGainM: null,
      startDate: new Date("2026-07-19T10:00:00Z"),
      maxParticipants: 100,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-04-30T23:59:59Z"),
          price: 60.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA FIT Teams (por pessoa)",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-05-01T00:00:00Z"),
          endDate: new Date("2026-06-30T23:59:59Z"),
          price: 75.0,
          currency: Currency.EUR,
          note: "Regular - DEKA FIT Teams (por pessoa)",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-07-01T00:00:00Z"),
          endDate: new Date("2026-07-17T23:59:59Z"),
          price: 85.0,
          currency: Currency.EUR,
          note: "Late Registration - DEKA FIT Teams (por pessoa)",
        },
      ],
    },
  ];

  console.log("💰 Creating variants and pricing phases...");

  for (const variantData of variants) {
    const { pricingPhases, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`✅ Created variant: ${variant.name}`);

    // Create pricing phases for this variant (linked to eventId)
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
          note: phase.note,
        },
      });
    }

    console.log(`   - Created ${pricingPhases.length} pricing phases`);
  }

  // Step 5: Create FAQs with translations
  const findOrCreateFAQ = async (
    eventId: string,
    order: number,
    question: string,
    answer: string
  ) => {
    const existing = await prisma.eventFAQ.findFirst({
      where: { eventId, order },
    });
    if (existing) {
      return await prisma.eventFAQ.update({
        where: { id: existing.id },
        data: { question, answer },
      });
    }
    return await prisma.eventFAQ.create({
      data: { eventId, order, question, answer },
    });
  };

  console.log("❓ Creating FAQs...");

  // FAQ 1: O que é a DEKA?
  const faq1 = await findOrCreateFAQ(
    event.id,
    0,
    "O que é a DEKA?",
    "A DEKA é uma competição de fitness funcional criada pela Spartan que testa força, resistência e capacidade atlética através de 10 zonas de exercícios intercaladas com corrida. É considerado o teste de fitness mais completo do mundo."
  );

  const faq1Translations = {
    pt: {
      question: "O que é a DEKA?",
      answer:
        "A DEKA é uma competição de fitness funcional criada pela Spartan que testa força, resistência e capacidade atlética através de 10 zonas de exercícios intercaladas com corrida. É considerado o teste de fitness mais completo do mundo.",
    },
    en: {
      question: "What is DEKA?",
      answer:
        "DEKA is a functional fitness competition created by Spartan that tests strength, endurance and athletic ability through 10 exercise zones interspersed with running. It's considered the most complete fitness test in the world.",
    },
    es: {
      question: "¿Qué es DEKA?",
      answer:
        "DEKA es una competición de fitness funcional creada por Spartan que pone a prueba la fuerza, resistencia y capacidad atlética a través de 10 zonas de ejercicios intercaladas con carrera. Es considerada la prueba de fitness más completa del mundo.",
    },
    fr: {
      question: "Qu'est-ce que DEKA ?",
      answer:
        "DEKA est une compétition de fitness fonctionnel créée par Spartan qui teste la force, l'endurance et les capacités athlétiques à travers 10 zones d'exercices entrecoupées de course. C'est considéré comme le test de fitness le plus complet au monde.",
    },
    de: {
      question: "Was ist DEKA?",
      answer:
        "DEKA ist ein funktioneller Fitness-Wettbewerb, der von Spartan entwickelt wurde und Kraft, Ausdauer und athletische Fähigkeiten durch 10 Übungszonen testet, die mit Laufen kombiniert werden. Er gilt als der vollständigste Fitness-Test der Welt.",
    },
    it: {
      question: "Cos'è DEKA?",
      answer:
        "DEKA è una competizione di fitness funzionale creata da Spartan che testa forza, resistenza e capacità atletiche attraverso 10 zone di esercizi alternate a corsa. È considerato il test di fitness più completo al mondo.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq1.id, language: lang } },
      update: faq1Translations[lang],
      create: { faqId: faq1.id, language: lang, ...faq1Translations[lang] },
    });
  }

  // FAQ 2: O que é a DEKA STRONG?
  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "O que é a DEKA STRONG e em que difere das outras provas?",
    "A DEKA STRONG é uma prova focada exclusivamente na força - completas as 10 zonas de exercícios mas sem corrida entre elas (0 km). É perfeita para quem quer focar-se nos exercícios de força. DEKA FIT tem 5km de corrida e DEKA MILE tem 1 milha."
  );

  const faq2Translations = {
    pt: {
      question: "O que é a DEKA STRONG e em que difere das outras provas?",
      answer:
        "A DEKA STRONG é uma prova focada exclusivamente na força - completas as 10 zonas de exercícios mas sem corrida entre elas (0 km). É perfeita para quem quer focar-se nos exercícios de força. DEKA FIT tem 5km de corrida e DEKA MILE tem 1 milha.",
    },
    en: {
      question: "What is DEKA STRONG and how does it differ from other races?",
      answer:
        "DEKA STRONG is a race focused exclusively on strength - you complete the 10 exercise zones but without running between them (0 km). It's perfect for those who want to focus on strength exercises. DEKA FIT has 5km of running and DEKA MILE has 1 mile.",
    },
    es: {
      question:
        "¿Qué es DEKA STRONG y en qué se diferencia de las otras carreras?",
      answer:
        "DEKA STRONG es una carrera enfocada exclusivamente en la fuerza - completas las 10 zonas de ejercicios pero sin carrera entre ellas (0 km). Es perfecta para quienes quieren enfocarse en los ejercicios de fuerza. DEKA FIT tiene 5km de carrera y DEKA MILE tiene 1 milla.",
    },
    fr: {
      question:
        "Qu'est-ce que DEKA STRONG et en quoi diffère-t-elle des autres courses ?",
      answer:
        "DEKA STRONG est une course axée exclusivement sur la force - vous complétez les 10 zones d'exercices mais sans courir entre elles (0 km). C'est parfait pour ceux qui veulent se concentrer sur les exercices de force. DEKA FIT a 5km de course et DEKA MILE a 1 mile.",
    },
    de: {
      question:
        "Was ist DEKA STRONG und wie unterscheidet es sich von anderen Rennen?",
      answer:
        "DEKA STRONG ist ein Rennen, das sich ausschließlich auf Kraft konzentriert - du absolvierst die 10 Übungszonen, aber ohne dazwischen zu laufen (0 km). Es ist perfekt für alle, die sich auf Kraftübungen konzentrieren möchten. DEKA FIT hat 5km Laufen und DEKA MILE hat 1 Meile.",
    },
    it: {
      question: "Cos'è DEKA STRONG e come si differenzia dalle altre gare?",
      answer:
        "DEKA STRONG è una gara focalizzata esclusivamente sulla forza - completi le 10 zone di esercizi ma senza correre tra di esse (0 km). È perfetta per chi vuole concentrarsi sugli esercizi di forza. DEKA FIT ha 5km di corsa e DEKA MILE ha 1 miglio.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: lang } },
      update: faq2Translations[lang],
      create: { faqId: faq2.id, language: lang, ...faq2Translations[lang] },
    });
  }

  // FAQ 3: O que é a DEKA Trifecta?
  const faq3 = await findOrCreateFAQ(
    event.id,
    2,
    "O que é a DEKA Trifecta?",
    "A DEKA Trifecta é uma conquista especial que obténs ao completar DEKA FIT, DEKA MILE e DEKA STRONG no mesmo evento. É o teste máximo de fitness completo - resistência, velocidade e força pura!"
  );

  const faq3Translations = {
    pt: {
      question: "O que é a DEKA Trifecta?",
      answer:
        "A DEKA Trifecta é uma conquista especial que obténs ao completar DEKA FIT, DEKA MILE e DEKA STRONG no mesmo evento. É o teste máximo de fitness completo - resistência, velocidade e força pura!",
    },
    en: {
      question: "What is the DEKA Trifecta?",
      answer:
        "The DEKA Trifecta is a special achievement you earn by completing DEKA FIT, DEKA MILE and DEKA STRONG at the same event. It's the ultimate complete fitness test - endurance, speed and pure strength!",
    },
    es: {
      question: "¿Qué es la DEKA Trifecta?",
      answer:
        "La DEKA Trifecta es un logro especial que obtienes al completar DEKA FIT, DEKA MILE y DEKA STRONG en el mismo evento. ¡Es la prueba máxima de fitness completo - resistencia, velocidad y fuerza pura!",
    },
    fr: {
      question: "Qu'est-ce que le DEKA Trifecta ?",
      answer:
        "Le DEKA Trifecta est une réalisation spéciale que vous obtenez en complétant DEKA FIT, DEKA MILE et DEKA STRONG lors du même événement. C'est le test de fitness complet ultime - endurance, vitesse et force pure !",
    },
    de: {
      question: "Was ist die DEKA Trifecta?",
      answer:
        "Die DEKA Trifecta ist eine besondere Auszeichnung, die du erhältst, wenn du DEKA FIT, DEKA MILE und DEKA STRONG bei derselben Veranstaltung absolvierst. Es ist der ultimative komplette Fitness-Test - Ausdauer, Geschwindigkeit und reine Stärke!",
    },
    it: {
      question: "Cos'è la DEKA Trifecta?",
      answer:
        "La DEKA Trifecta è un traguardo speciale che ottieni completando DEKA FIT, DEKA MILE e DEKA STRONG nello stesso evento. È il test di fitness completo definitivo - resistenza, velocità e forza pura!",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: lang } },
      update: faq3Translations[lang],
      create: { faqId: faq3.id, language: lang, ...faq3Translations[lang] },
    });
  }

  // FAQ 4: O que é a DEKA CUP?
  const faq4 = await findOrCreateFAQ(
    event.id,
    3,
    "O que é a DEKA CUP?",
    "A DEKA CUP é uma competição de elite dentro do circuito DEKA onde os melhores atletas se enfrentam para conquistar a glória. Madrid 2026 é uma das sedes oficiais da DEKA CUP, atraindo competidores de todo o mundo."
  );

  const faq4Translations = {
    pt: {
      question: "O que é a DEKA CUP?",
      answer:
        "A DEKA CUP é uma competição de elite dentro do circuito DEKA onde os melhores atletas se enfrentam para conquistar a glória. Madrid 2026 é uma das sedes oficiais da DEKA CUP, atraindo competidores de todo o mundo.",
    },
    en: {
      question: "What is the DEKA CUP?",
      answer:
        "The DEKA CUP is an elite competition within the DEKA circuit where the best athletes face off for glory. Madrid 2026 is one of the official DEKA CUP venues, attracting competitors from around the world.",
    },
    es: {
      question: "¿Qué es la DEKA CUP?",
      answer:
        "La DEKA CUP es una competición de élite dentro del circuito DEKA donde los mejores atletas se enfrentan por la gloria. Madrid 2026 es una de las sedes oficiales de la DEKA CUP, atrayendo competidores de todo el mundo.",
    },
    fr: {
      question: "Qu'est-ce que la DEKA CUP ?",
      answer:
        "La DEKA CUP est une compétition d'élite au sein du circuit DEKA où les meilleurs athlètes s'affrontent pour la gloire. Madrid 2026 est l'un des sites officiels de la DEKA CUP, attirant des compétiteurs du monde entier.",
    },
    de: {
      question: "Was ist der DEKA CUP?",
      answer:
        "Der DEKA CUP ist ein Elite-Wettbewerb innerhalb des DEKA-Circuits, bei dem die besten Athleten um den Ruhm kämpfen. Madrid 2026 ist einer der offiziellen Austragungsorte des DEKA CUP und zieht Teilnehmer aus der ganzen Welt an.",
    },
    it: {
      question: "Cos'è la DEKA CUP?",
      answer:
        "La DEKA CUP è una competizione d'élite all'interno del circuito DEKA dove i migliori atleti si sfidano per la gloria. Madrid 2026 è una delle sedi ufficiali della DEKA CUP, attirando competitori da tutto il mondo.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq4.id, language: lang } },
      update: faq4Translations[lang],
      create: { faqId: faq4.id, language: lang, ...faq4Translations[lang] },
    });
  }

  // FAQ 5: Preciso de levar equipamento?
  const faq5 = await findOrCreateFAQ(
    event.id,
    4,
    "Preciso de levar equipamento?",
    "Não. Todo o equipamento necessário para as 10 zonas é fornecido pela organização. Apenas precisas de trazer roupa e calçado desportivo adequado."
  );

  const faq5Translations = {
    pt: {
      question: "Preciso de levar equipamento?",
      answer:
        "Não. Todo o equipamento necessário para as 10 zonas é fornecido pela organização. Apenas precisas de trazer roupa e calçado desportivo adequado.",
    },
    en: {
      question: "Do I need to bring equipment?",
      answer:
        "No. All equipment needed for the 10 zones is provided by the organization. You only need to bring appropriate sportswear and footwear.",
    },
    es: {
      question: "¿Necesito llevar equipamiento?",
      answer:
        "No. Todo el equipamiento necesario para las 10 zonas es proporcionado por la organización. Solo necesitas traer ropa y calzado deportivo adecuado.",
    },
    fr: {
      question: "Dois-je apporter de l'équipement ?",
      answer:
        "Non. Tout l'équipement nécessaire pour les 10 zones est fourni par l'organisation. Vous avez seulement besoin d'apporter des vêtements et des chaussures de sport appropriés.",
    },
    de: {
      question: "Muss ich Ausrüstung mitbringen?",
      answer:
        "Nein. Die gesamte Ausrüstung für die 10 Zonen wird von der Organisation gestellt. Du musst nur passende Sportkleidung und Schuhe mitbringen.",
    },
    it: {
      question: "Devo portare attrezzatura?",
      answer:
        "No. Tutta l'attrezzatura necessaria per le 10 zone è fornita dall'organizzazione. Devi solo portare abbigliamento e calzature sportive adeguate.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: lang } },
      update: faq5Translations[lang],
      create: { faqId: faq5.id, language: lang, ...faq5Translations[lang] },
    });
  }

  // FAQ 6: Como chegar ao Madrid Arena?
  const faq6 = await findOrCreateFAQ(
    event.id,
    5,
    "Como chegar ao Madrid Arena?",
    "O Madrid Arena fica na Av. de Portugal, s/n, em Moncloa-Aravaca, Madrid. É facilmente acessível por metro (Linhas 5 e 10, estação Lago ou Casa de Campo), autocarro, e tem estacionamento disponível no local. O recinto fica dentro do parque Casa de Campo."
  );

  const faq6Translations = {
    pt: {
      question: "Como chegar ao Madrid Arena?",
      answer:
        "O Madrid Arena fica na Av. de Portugal, s/n, em Moncloa-Aravaca, Madrid. É facilmente acessível por metro (Linhas 5 e 10, estação Lago ou Casa de Campo), autocarro, e tem estacionamento disponível no local. O recinto fica dentro do parque Casa de Campo.",
    },
    en: {
      question: "How to get to Madrid Arena?",
      answer:
        "Madrid Arena is located at Av. de Portugal, s/n, in Moncloa-Aravaca, Madrid. It's easily accessible by metro (Lines 5 and 10, Lago or Casa de Campo station), bus, and has parking available on site. The venue is located within Casa de Campo park.",
    },
    es: {
      question: "¿Cómo llegar al Madrid Arena?",
      answer:
        "El Madrid Arena está ubicado en Av. de Portugal, s/n, en Moncloa-Aravaca, Madrid. Es fácilmente accesible por metro (Líneas 5 y 10, estación Lago o Casa de Campo), autobús, y tiene aparcamiento disponible en el lugar. El recinto está dentro del parque Casa de Campo.",
    },
    fr: {
      question: "Comment se rendre au Madrid Arena ?",
      answer:
        "Le Madrid Arena est situé Av. de Portugal, s/n, à Moncloa-Aravaca, Madrid. Il est facilement accessible par métro (Lignes 5 et 10, station Lago ou Casa de Campo), bus, et dispose d'un parking sur place. Le lieu est situé dans le parc Casa de Campo.",
    },
    de: {
      question: "Wie kommt man zur Madrid Arena?",
      answer:
        "Die Madrid Arena befindet sich in der Av. de Portugal, s/n, in Moncloa-Aravaca, Madrid. Sie ist leicht mit der U-Bahn (Linien 5 und 10, Station Lago oder Casa de Campo), Bus erreichbar und verfügt über Parkplätze vor Ort. Die Halle befindet sich im Park Casa de Campo.",
    },
    it: {
      question: "Come arrivare al Madrid Arena?",
      answer:
        "Il Madrid Arena si trova in Av. de Portugal, s/n, a Moncloa-Aravaca, Madrid. È facilmente raggiungibile con la metropolitana (Linee 5 e 10, stazione Lago o Casa de Campo), autobus, e dispone di parcheggio in loco. La struttura si trova all'interno del parco Casa de Campo.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq6.id, language: lang } },
      update: faq6Translations[lang],
      create: { faqId: faq6.id, language: lang, ...faq6Translations[lang] },
    });
  }

  console.log("❓ FAQs created (6 FAQs with translations in all 6 languages)");

  console.log("\n🏋️ DEKA Madrid 2026 seed completed successfully!");
  console.log("   - Event: DEKA Madrid 2026");
  console.log("   - Dates: 18-19 July 2026");
  console.log("   - Location: Madrid Arena, Madrid, Spain");
  console.log(
    "   - Variants: DEKA FIT, DEKA MILE, DEKA STRONG, DEKA MILE Teams, DEKA FIT Teams"
  );
  console.log("   - Special: DEKA CUP & DEKA Trifecta opportunity");
  console.log("   - Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("   - Pricing phases: 15 total");
  console.log("   - FAQs: 6 questions");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding DEKA Madrid 2026:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
