/**
 * Seed DEKA Torremolinos (Málaga) 2026
 * Complete with translations in all 6 languages
 * DEKA FIT, DEKA FIT Teams, DEKA MILE & DEKA MILE Teams
 * Location: Campo de Fútbol Ciudad de Torremolinos, Málaga, Spain
 * Dates: February 28 - March 1, 2026
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Seeding DEKA Torremolinos (Málaga) 2026...");

  // Step 1: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "deka-torremolinos-malaga-2026" },
    update: {
      title: "DEKA Torremolinos (Málaga) 2026",
      description: `## 🏋️ DEKA Torremolinos (Málaga) 2026

**A DEKA chega a Torremolinos!**

Nos dias 28 de fevereiro e 1 de março de 2026, Torremolinos acolhe a DEKA num fim de semana épico de fitness. Prepara-te para dois dias repletos de energia, desafios e espírito de comunidade fitness na Costa del Sol. Combina a tua experiência DEKA com o sol, a praia e a energia única da Andaluzia!

### 🔥 O Que é a DEKA?

A **DEKA** é uma competição de fitness funcional criada pela Spartan que testa a força, resistência e capacidade atlética através de **10 zonas de exercícios** intercaladas com corrida. É o teste de fitness mais completo do mundo!

### 🏃 As Provas

**DEKA FIT** - O Desafio Completo
- Distância: 5 km
- Zonas: 10
- Duração média: 50m 30s
- Testa todas as capacidades físicas

**DEKA FIT Teams** - Trabalho de Equipa
- Distância: 5 km
- Zonas: 10
- Duração média: 44m 10s
- 2 atletas por equipa
- Dividam os exercícios e conquistem juntos!

**DEKA MILE** - Velocidade e Potência
- Distância: 1 milha (1.6 km)
- Zonas: 10
- Duração média: 29m 30s
- Versão mais rápida e intensa

**DEKA MILE Teams** - Velocidade em Equipa
- Distância: 1 milha (1.6 km)
- Zonas: 10
- Duração média: 29m 30s
- 2 atletas por equipa

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

**Campo de Fútbol Ciudad de Torremolinos**
C. de los Pinares, 3
Torremolinos, Andaluzia, Espanha

### 📅 Programa

**SÁBADO, 28 FEVEREIRO 2026**
- **07:00 - 19:30** - Levantamento de Dorsais
- **08:00 - 12:30** - DEKA FIT Age Group
- **13:00 - 13:30** - DEKA FIT Elite
- **14:15 - 14:45** - Cerimónia de Premiação Age Group & Elite
- **14:45 - 18:15** - DEKA FIT Teams
- **19:00 - 19:55** - DEKA MILE

**DOMINGO, 1 MARÇO 2026**
- **07:00 - 13:00** - Levantamento de Dorsais
- **08:00 - 09:00** - DEKA MILE Teams
- **09:15 - 13:30** - DEKA FIT Teams
- **14:15 - 14:25** - Cerimónia de Premiação DEKA FIT Teams

*Horário preliminar. Podem ocorrer alterações.*

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
- 📍 Coordenadas: 36.6229, -4.5124
- 🔗 [spartan.com](https://pt.spartan.com/pt/races/deka-torremolinos)

**Junta-te à Revolução do Fitness na Costa del Sol! 💪**`,
      startDate: new Date("2026-02-28T07:00:00Z"),
      endDate: new Date("2026-03-01T15:00:00Z"),
      registrationDeadline: new Date("2026-02-27T23:59:59Z"),
      sportTypes: [SportType.OCR, SportType.RUNNING, SportType.CROSSFIT],
      city: "Torremolinos",
      country: "Spain",
      latitude: 36.6229,
      longitude: -4.5124,
      googleMapsUrl: "https://maps.app.goo.gl/XGFDEMpWcV3nYixB6",
      externalUrl: "https://pt.spartan.com/pt/races/deka-torremolinos",
      imageUrl: "",
      isFeatured: true,
    },
    create: {
      title: "DEKA Torremolinos (Málaga) 2026",
      slug: "deka-torremolinos-malaga-2026",
      description: `## 🏋️ DEKA Torremolinos (Málaga) 2026

**A DEKA chega a Torremolinos!**

Nos dias 28 de fevereiro e 1 de março de 2026, Torremolinos acolhe a DEKA num fim de semana épico de fitness. Prepara-te para dois dias repletos de energia, desafios e espírito de comunidade fitness na Costa del Sol. Combina a tua experiência DEKA com o sol, a praia e a energia única da Andaluzia!

### 🔥 O Que é a DEKA?

A **DEKA** é uma competição de fitness funcional criada pela Spartan que testa a força, resistência e capacidade atlética através de **10 zonas de exercícios** intercaladas com corrida. É o teste de fitness mais completo do mundo!

### 🏃 As Provas

**DEKA FIT** - O Desafio Completo
- Distância: 5 km
- Zonas: 10
- Duração média: 50m 30s
- Testa todas as capacidades físicas

**DEKA FIT Teams** - Trabalho de Equipa
- Distância: 5 km
- Zonas: 10
- Duração média: 44m 10s
- 2 atletas por equipa
- Dividam os exercícios e conquistem juntos!

**DEKA MILE** - Velocidade e Potência
- Distância: 1 milha (1.6 km)
- Zonas: 10
- Duração média: 29m 30s
- Versão mais rápida e intensa

**DEKA MILE Teams** - Velocidade em Equipa
- Distância: 1 milha (1.6 km)
- Zonas: 10
- Duração média: 29m 30s
- 2 atletas por equipa

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

**Campo de Fútbol Ciudad de Torremolinos**
C. de los Pinares, 3
Torremolinos, Andaluzia, Espanha

### 📅 Programa

**SÁBADO, 28 FEVEREIRO 2026**
- **07:00 - 19:30** - Levantamento de Dorsais
- **08:00 - 12:30** - DEKA FIT Age Group
- **13:00 - 13:30** - DEKA FIT Elite
- **14:15 - 14:45** - Cerimónia de Premiação Age Group & Elite
- **14:45 - 18:15** - DEKA FIT Teams
- **19:00 - 19:55** - DEKA MILE

**DOMINGO, 1 MARÇO 2026**
- **07:00 - 13:00** - Levantamento de Dorsais
- **08:00 - 09:00** - DEKA MILE Teams
- **09:15 - 13:30** - DEKA FIT Teams
- **14:15 - 14:25** - Cerimónia de Premiação DEKA FIT Teams

*Horário preliminar. Podem ocorrer alterações.*

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
- 📍 Coordenadas: 36.6229, -4.5124
- 🔗 [spartan.com](https://pt.spartan.com/pt/races/deka-torremolinos)

**Junta-te à Revolução do Fitness na Costa del Sol! 💪**`,
      startDate: new Date("2026-02-28T07:00:00Z"),
      endDate: new Date("2026-03-01T15:00:00Z"),
      registrationDeadline: new Date("2026-02-27T23:59:59Z"),
      sportTypes: [SportType.OCR, SportType.RUNNING, SportType.CROSSFIT],
      city: "Torremolinos",
      country: "Spain",
      latitude: 36.6229,
      longitude: -4.5124,
      googleMapsUrl: "https://maps.app.goo.gl/XGFDEMpWcV3nYixB6",
      externalUrl: "https://pt.spartan.com/pt/races/deka-torremolinos",
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
      title: "DEKA Torremolinos (Málaga) 2026",
      description: `## 🏋️ DEKA Torremolinos (Málaga) 2026

**A DEKA chega a Torremolinos!**

Nos dias 28 de fevereiro e 1 de março de 2026, Torremolinos acolhe a DEKA num fim de semana épico de fitness. Prepara-te para dois dias repletos de energia, desafios e espírito de comunidade fitness na Costa del Sol.

### 🔥 O Que é a DEKA?

A **DEKA** é uma competição de fitness funcional criada pela Spartan que testa a força, resistência e capacidade atlética através de **10 zonas de exercícios** intercaladas com corrida.

### 🏃 As Provas

**DEKA FIT** - 5 km | 10 zonas | Duração média: 50m 30s
**DEKA FIT Teams** - 5 km | 10 zonas | 2 atletas | Duração média: 44m 10s
**DEKA MILE** - 1 milha | 10 zonas | Duração média: 29m 30s
**DEKA MILE Teams** - 1 milha | 10 zonas | 2 atletas

### 📍 Localização

**Campo de Fútbol Ciudad de Torremolinos**
C. de los Pinares, 3, Torremolinos, Andaluzia, Espanha

### 📅 Programa

**SÁBADO, 28 FEVEREIRO 2026**
- 07:00-19:30 - Levantamento de Dorsais
- 08:00-12:30 - DEKA FIT Age Group
- 13:00-13:30 - DEKA FIT Elite
- 14:45-18:15 - DEKA FIT Teams
- 19:00-19:55 - DEKA MILE

**DOMINGO, 1 MARÇO 2026**
- 07:00-13:00 - Levantamento de Dorsais
- 08:00-09:00 - DEKA MILE Teams
- 09:15-13:30 - DEKA FIT Teams

**Junta-te à Revolução do Fitness na Costa del Sol! 💪**`,
      city: "Torremolinos",
      metaTitle: "DEKA Torremolinos (Málaga) 2026 | 28 Fev - 1 Mar",
      metaDescription:
        "DEKA Torremolinos 2026 - 28 fevereiro a 1 março em Málaga. DEKA FIT, DEKA FIT Teams, DEKA MILE e DEKA MILE Teams. 10 zonas de fitness funcional na Costa del Sol!",
    },
    en: {
      title: "DEKA Torremolinos (Málaga) 2026",
      description: `## 🏋️ DEKA Torremolinos (Málaga) 2026

**DEKA arrives in Torremolinos!**

On February 28 and March 1, 2026, Torremolinos hosts DEKA for an epic fitness weekend. Get ready for two days full of energy, challenges and fitness community spirit on the Costa del Sol.

### 🔥 What is DEKA?

**DEKA** is a functional fitness competition created by Spartan that tests strength, endurance and athletic ability through **10 exercise zones** interspersed with running.

### 🏃 The Races

**DEKA FIT** - 5 km | 10 zones | Average time: 50m 30s
**DEKA FIT Teams** - 5 km | 10 zones | 2 athletes | Average time: 44m 10s
**DEKA MILE** - 1 mile | 10 zones | Average time: 29m 30s
**DEKA MILE Teams** - 1 mile | 10 zones | 2 athletes

### 📍 Location

**Campo de Fútbol Ciudad de Torremolinos**
C. de los Pinares, 3, Torremolinos, Andalusia, Spain

### 📅 Schedule

**SATURDAY, FEBRUARY 28, 2026**
- 07:00-19:30 - Bib Pickup
- 08:00-12:30 - DEKA FIT Age Group
- 13:00-13:30 - DEKA FIT Elite
- 14:45-18:15 - DEKA FIT Teams
- 19:00-19:55 - DEKA MILE

**SUNDAY, MARCH 1, 2026**
- 07:00-13:00 - Bib Pickup
- 08:00-09:00 - DEKA MILE Teams
- 09:15-13:30 - DEKA FIT Teams

**Join the Fitness Revolution on the Costa del Sol! 💪**`,
      city: "Torremolinos",
      metaTitle: "DEKA Torremolinos (Málaga) 2026 | Feb 28 - Mar 1",
      metaDescription:
        "DEKA Torremolinos 2026 - February 28 to March 1 in Málaga. DEKA FIT, DEKA FIT Teams, DEKA MILE and DEKA MILE Teams. 10 functional fitness zones on the Costa del Sol!",
    },
    es: {
      title: "DEKA Torremolinos (Málaga) 2026",
      description: `## 🏋️ DEKA Torremolinos (Málaga) 2026

**¡DEKA llega a Torremolinos!**

Los días 28 de febrero y 1 de marzo de 2026, Torremolinos acoge DEKA en un fin de semana épico de fitness. Prepárate para dos días repletos de energía, desafíos y espíritu de comunidad fitness en la Costa del Sol.

### 🔥 ¿Qué es DEKA?

**DEKA** es una competición de fitness funcional creada por Spartan que pone a prueba la fuerza, resistencia y capacidad atlética a través de **10 zonas de ejercicios** intercaladas con carrera.

### 🏃 Las Carreras

**DEKA FIT** - 5 km | 10 zonas | Duración media: 50m 30s
**DEKA FIT Teams** - 5 km | 10 zonas | 2 atletas | Duración media: 44m 10s
**DEKA MILE** - 1 milla | 10 zonas | Duración media: 29m 30s
**DEKA MILE Teams** - 1 milla | 10 zonas | 2 atletas

### 📍 Ubicación

**Campo de Fútbol Ciudad de Torremolinos**
C. de los Pinares, 3, Torremolinos, Andalucía, España

### 📅 Programa

**SÁBADO, 28 DE FEBRERO DE 2026**
- 07:00-19:30 - Recogida de Dorsales
- 08:00-12:30 - DEKA FIT Age Group
- 13:00-13:30 - DEKA FIT Elite
- 14:45-18:15 - DEKA FIT Teams
- 19:00-19:55 - DEKA MILE

**DOMINGO, 1 DE MARZO DE 2026**
- 07:00-13:00 - Recogida de Dorsales
- 08:00-09:00 - DEKA MILE Teams
- 09:15-13:30 - DEKA FIT Teams

**¡Únete a la Revolución del Fitness en la Costa del Sol! 💪**`,
      city: "Torremolinos",
      metaTitle: "DEKA Torremolinos (Málaga) 2026 | 28 Feb - 1 Mar",
      metaDescription:
        "DEKA Torremolinos 2026 - 28 de febrero a 1 de marzo en Málaga. DEKA FIT, DEKA FIT Teams, DEKA MILE y DEKA MILE Teams. ¡10 zonas de fitness funcional en la Costa del Sol!",
    },
    fr: {
      title: "DEKA Torremolinos (Málaga) 2026",
      description: `## 🏋️ DEKA Torremolinos (Málaga) 2026

**DEKA arrive à Torremolinos !**

Les 28 février et 1er mars 2026, Torremolinos accueille DEKA pour un week-end de fitness épique. Préparez-vous pour deux jours pleins d'énergie, de défis et d'esprit de communauté fitness sur la Costa del Sol.

### 🔥 Qu'est-ce que DEKA ?

**DEKA** est une compétition de fitness fonctionnel créée par Spartan qui teste la force, l'endurance et les capacités athlétiques à travers **10 zones d'exercices** entrecoupées de course.

### 🏃 Les Épreuves

**DEKA FIT** - 5 km | 10 zones | Durée moyenne : 50m 30s
**DEKA FIT Teams** - 5 km | 10 zones | 2 athlètes | Durée moyenne : 44m 10s
**DEKA MILE** - 1 mile | 10 zones | Durée moyenne : 29m 30s
**DEKA MILE Teams** - 1 mile | 10 zones | 2 athlètes

### 📍 Lieu

**Campo de Fútbol Ciudad de Torremolinos**
C. de los Pinares, 3, Torremolinos, Andalousie, Espagne

### 📅 Programme

**SAMEDI 28 FÉVRIER 2026**
- 07:00-19:30 - Retrait des Dossards
- 08:00-12:30 - DEKA FIT Age Group
- 13:00-13:30 - DEKA FIT Elite
- 14:45-18:15 - DEKA FIT Teams
- 19:00-19:55 - DEKA MILE

**DIMANCHE 1ER MARS 2026**
- 07:00-13:00 - Retrait des Dossards
- 08:00-09:00 - DEKA MILE Teams
- 09:15-13:30 - DEKA FIT Teams

**Rejoignez la Révolution du Fitness sur la Costa del Sol ! 💪**`,
      city: "Torremolinos",
      metaTitle: "DEKA Torremolinos (Málaga) 2026 | 28 Fév - 1 Mar",
      metaDescription:
        "DEKA Torremolinos 2026 - 28 février au 1er mars à Málaga. DEKA FIT, DEKA FIT Teams, DEKA MILE et DEKA MILE Teams. 10 zones de fitness fonctionnel sur la Costa del Sol !",
    },
    de: {
      title: "DEKA Torremolinos (Málaga) 2026",
      description: `## 🏋️ DEKA Torremolinos (Málaga) 2026

**DEKA kommt nach Torremolinos!**

Am 28. Februar und 1. März 2026 veranstaltet Torremolinos ein episches DEKA Fitness-Wochenende. Mach dich bereit für zwei Tage voller Energie, Herausforderungen und Fitness-Community-Geist an der Costa del Sol.

### 🔥 Was ist DEKA?

**DEKA** ist ein funktioneller Fitness-Wettbewerb, der von Spartan entwickelt wurde und Kraft, Ausdauer und athletische Fähigkeiten durch **10 Übungszonen** testet, die mit Laufen kombiniert werden.

### 🏃 Die Rennen

**DEKA FIT** - 5 km | 10 Zonen | Durchschnittszeit: 50m 30s
**DEKA FIT Teams** - 5 km | 10 Zonen | 2 Athleten | Durchschnittszeit: 44m 10s
**DEKA MILE** - 1 Meile | 10 Zonen | Durchschnittszeit: 29m 30s
**DEKA MILE Teams** - 1 Meile | 10 Zonen | 2 Athleten

### 📍 Ort

**Campo de Fútbol Ciudad de Torremolinos**
C. de los Pinares, 3, Torremolinos, Andalusien, Spanien

### 📅 Programm

**SAMSTAG, 28. FEBRUAR 2026**
- 07:00-19:30 - Startnummernabholung
- 08:00-12:30 - DEKA FIT Age Group
- 13:00-13:30 - DEKA FIT Elite
- 14:45-18:15 - DEKA FIT Teams
- 19:00-19:55 - DEKA MILE

**SONNTAG, 1. MÄRZ 2026**
- 07:00-13:00 - Startnummernabholung
- 08:00-09:00 - DEKA MILE Teams
- 09:15-13:30 - DEKA FIT Teams

**Schließe dich der Fitness-Revolution an der Costa del Sol an! 💪**`,
      city: "Torremolinos",
      metaTitle: "DEKA Torremolinos (Málaga) 2026 | 28. Feb - 1. Mär",
      metaDescription:
        "DEKA Torremolinos 2026 - 28. Februar bis 1. März in Málaga. DEKA FIT, DEKA FIT Teams, DEKA MILE und DEKA MILE Teams. 10 funktionelle Fitness-Zonen an der Costa del Sol!",
    },
    it: {
      title: "DEKA Torremolinos (Málaga) 2026",
      description: `## 🏋️ DEKA Torremolinos (Málaga) 2026

**DEKA arriva a Torremolinos!**

Il 28 febbraio e 1 marzo 2026, Torremolinos ospita DEKA per un weekend di fitness epico. Preparatevi per due giorni pieni di energia, sfide e spirito di comunità fitness sulla Costa del Sol.

### 🔥 Cos'è DEKA?

**DEKA** è una competizione di fitness funzionale creata da Spartan che testa forza, resistenza e capacità atletiche attraverso **10 zone di esercizi** alternate a corsa.

### 🏃 Le Gare

**DEKA FIT** - 5 km | 10 zone | Tempo medio: 50m 30s
**DEKA FIT Teams** - 5 km | 10 zone | 2 atleti | Tempo medio: 44m 10s
**DEKA MILE** - 1 miglio | 10 zone | Tempo medio: 29m 30s
**DEKA MILE Teams** - 1 miglio | 10 zone | 2 atleti

### 📍 Luogo

**Campo de Fútbol Ciudad de Torremolinos**
C. de los Pinares, 3, Torremolinos, Andalusia, Spagna

### 📅 Programma

**SABATO 28 FEBBRAIO 2026**
- 07:00-19:30 - Ritiro Pettorali
- 08:00-12:30 - DEKA FIT Age Group
- 13:00-13:30 - DEKA FIT Elite
- 14:45-18:15 - DEKA FIT Teams
- 19:00-19:55 - DEKA MILE

**DOMENICA 1 MARZO 2026**
- 07:00-13:00 - Ritiro Pettorali
- 08:00-09:00 - DEKA MILE Teams
- 09:15-13:30 - DEKA FIT Teams

**Unisciti alla Rivoluzione del Fitness sulla Costa del Sol! 💪**`,
      city: "Torremolinos",
      metaTitle: "DEKA Torremolinos (Málaga) 2026 | 28 Feb - 1 Mar",
      metaDescription:
        "DEKA Torremolinos 2026 - 28 febbraio al 1 marzo a Málaga. DEKA FIT, DEKA FIT Teams, DEKA MILE e DEKA MILE Teams. 10 zone di fitness funzionale sulla Costa del Sol!",
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
      startDate: new Date("2026-02-28T08:00:00Z"),
      maxParticipants: 300,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2026-01-15T23:59:59Z"),
          price: 80.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA FIT",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-01-16T00:00:00Z"),
          endDate: new Date("2026-02-15T23:59:59Z"),
          price: 95.0,
          currency: Currency.EUR,
          note: "Regular - DEKA FIT",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-02-16T00:00:00Z"),
          endDate: new Date("2026-02-27T23:59:59Z"),
          price: 110.0,
          currency: Currency.EUR,
          note: "Late Registration - DEKA FIT",
        },
      ],
    },
    {
      name: "DEKA FIT Teams",
      distanceKm: 5,
      elevationGainM: null,
      startDate: new Date("2026-02-28T14:45:00Z"),
      maxParticipants: 100,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2026-01-15T23:59:59Z"),
          price: 60.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA FIT Teams (por pessoa)",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-01-16T00:00:00Z"),
          endDate: new Date("2026-02-15T23:59:59Z"),
          price: 75.0,
          currency: Currency.EUR,
          note: "Regular - DEKA FIT Teams (por pessoa)",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-02-16T00:00:00Z"),
          endDate: new Date("2026-02-27T23:59:59Z"),
          price: 85.0,
          currency: Currency.EUR,
          note: "Late Registration - DEKA FIT Teams (por pessoa)",
        },
      ],
    },
    {
      name: "DEKA MILE",
      distanceKm: 1.6,
      elevationGainM: null,
      startDate: new Date("2026-02-28T19:00:00Z"),
      maxParticipants: 150,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2026-01-15T23:59:59Z"),
          price: 60.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA MILE",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-01-16T00:00:00Z"),
          endDate: new Date("2026-02-15T23:59:59Z"),
          price: 70.0,
          currency: Currency.EUR,
          note: "Regular - DEKA MILE",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-02-16T00:00:00Z"),
          endDate: new Date("2026-02-27T23:59:59Z"),
          price: 80.0,
          currency: Currency.EUR,
          note: "Late Registration - DEKA MILE",
        },
      ],
    },
    {
      name: "DEKA MILE Teams",
      distanceKm: 1.6,
      elevationGainM: null,
      startDate: new Date("2026-03-01T08:00:00Z"),
      maxParticipants: 100,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2026-01-15T23:59:59Z"),
          price: 45.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA MILE Teams (por pessoa)",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-01-16T00:00:00Z"),
          endDate: new Date("2026-02-15T23:59:59Z"),
          price: 55.0,
          currency: Currency.EUR,
          note: "Regular - DEKA MILE Teams (por pessoa)",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-02-16T00:00:00Z"),
          endDate: new Date("2026-02-27T23:59:59Z"),
          price: 65.0,
          currency: Currency.EUR,
          note: "Late Registration - DEKA MILE Teams (por pessoa)",
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

  // FAQ 2: Qual é a diferença entre as provas?
  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "Qual é a diferença entre DEKA FIT, DEKA FIT Teams, DEKA MILE e DEKA MILE Teams?",
    "DEKA FIT é a prova individual de 5km com 10 zonas. DEKA FIT Teams é a mesma prova mas em equipas de 2. DEKA MILE é uma versão mais curta (1 milha) com as mesmas 10 zonas, mais rápida e intensa. DEKA MILE Teams é a versão em equipa da DEKA MILE."
  );

  const faq2Translations = {
    pt: {
      question:
        "Qual é a diferença entre DEKA FIT, DEKA FIT Teams, DEKA MILE e DEKA MILE Teams?",
      answer:
        "DEKA FIT é a prova individual de 5km com 10 zonas. DEKA FIT Teams é a mesma prova mas em equipas de 2. DEKA MILE é uma versão mais curta (1 milha) com as mesmas 10 zonas, mais rápida e intensa. DEKA MILE Teams é a versão em equipa da DEKA MILE.",
    },
    en: {
      question:
        "What's the difference between DEKA FIT, DEKA FIT Teams, DEKA MILE and DEKA MILE Teams?",
      answer:
        "DEKA FIT is the individual 5km race with 10 zones. DEKA FIT Teams is the same race but in teams of 2. DEKA MILE is a shorter version (1 mile) with the same 10 zones, faster and more intense. DEKA MILE Teams is the team version of DEKA MILE.",
    },
    es: {
      question:
        "¿Cuál es la diferencia entre DEKA FIT, DEKA FIT Teams, DEKA MILE y DEKA MILE Teams?",
      answer:
        "DEKA FIT es la carrera individual de 5km con 10 zonas. DEKA FIT Teams es la misma carrera pero en equipos de 2. DEKA MILE es una versión más corta (1 milla) con las mismas 10 zonas, más rápida e intensa. DEKA MILE Teams es la versión en equipo de DEKA MILE.",
    },
    fr: {
      question:
        "Quelle est la différence entre DEKA FIT, DEKA FIT Teams, DEKA MILE et DEKA MILE Teams ?",
      answer:
        "DEKA FIT est la course individuelle de 5km avec 10 zones. DEKA FIT Teams est la même course mais en équipes de 2. DEKA MILE est une version plus courte (1 mile) avec les mêmes 10 zones, plus rapide et plus intense. DEKA MILE Teams est la version en équipe de DEKA MILE.",
    },
    de: {
      question:
        "Was ist der Unterschied zwischen DEKA FIT, DEKA FIT Teams, DEKA MILE und DEKA MILE Teams?",
      answer:
        "DEKA FIT ist das individuelle 5km-Rennen mit 10 Zonen. DEKA FIT Teams ist das gleiche Rennen, aber in 2er-Teams. DEKA MILE ist eine kürzere Version (1 Meile) mit denselben 10 Zonen, schneller und intensiver. DEKA MILE Teams ist die Team-Version von DEKA MILE.",
    },
    it: {
      question:
        "Qual è la differenza tra DEKA FIT, DEKA FIT Teams, DEKA MILE e DEKA MILE Teams?",
      answer:
        "DEKA FIT è la gara individuale di 5km con 10 zone. DEKA FIT Teams è la stessa gara ma in squadre di 2. DEKA MILE è una versione più corta (1 miglio) con le stesse 10 zone, più veloce e intensa. DEKA MILE Teams è la versione in squadra di DEKA MILE.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: lang } },
      update: faq2Translations[lang],
      create: { faqId: faq2.id, language: lang, ...faq2Translations[lang] },
    });
  }

  // FAQ 3: O que é o DEKA Mark?
  const faq3 = await findOrCreateFAQ(
    event.id,
    2,
    "O que é o DEKA Mark?",
    "O DEKA Mark é a tua classificação oficial de fitness baseada no tempo que demoras a completar a prova. Quanto mais baixo o tempo, melhor o teu DEKA Mark. É uma forma universal de medir e comparar o teu nível de fitness."
  );

  const faq3Translations = {
    pt: {
      question: "O que é o DEKA Mark?",
      answer:
        "O DEKA Mark é a tua classificação oficial de fitness baseada no tempo que demoras a completar a prova. Quanto mais baixo o tempo, melhor o teu DEKA Mark. É uma forma universal de medir e comparar o teu nível de fitness.",
    },
    en: {
      question: "What is the DEKA Mark?",
      answer:
        "The DEKA Mark is your official fitness ranking based on the time it takes you to complete the race. The lower the time, the better your DEKA Mark. It's a universal way to measure and compare your fitness level.",
    },
    es: {
      question: "¿Qué es el DEKA Mark?",
      answer:
        "El DEKA Mark es tu clasificación oficial de fitness basada en el tiempo que tardas en completar la carrera. Cuanto menor sea el tiempo, mejor tu DEKA Mark. Es una forma universal de medir y comparar tu nivel de fitness.",
    },
    fr: {
      question: "Qu'est-ce que le DEKA Mark ?",
      answer:
        "Le DEKA Mark est votre classement officiel de fitness basé sur le temps qu'il vous faut pour terminer la course. Plus le temps est bas, meilleur est votre DEKA Mark. C'est une façon universelle de mesurer et comparer votre niveau de fitness.",
    },
    de: {
      question: "Was ist der DEKA Mark?",
      answer:
        "Der DEKA Mark ist deine offizielle Fitness-Rangliste basierend auf der Zeit, die du brauchst, um das Rennen zu absolvieren. Je niedriger die Zeit, desto besser dein DEKA Mark. Es ist eine universelle Methode, dein Fitness-Level zu messen und zu vergleichen.",
    },
    it: {
      question: "Cos'è il DEKA Mark?",
      answer:
        "Il DEKA Mark è la tua classifica ufficiale di fitness basata sul tempo che impieghi per completare la gara. Più basso è il tempo, migliore è il tuo DEKA Mark. È un modo universale per misurare e confrontare il tuo livello di fitness.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: lang } },
      update: faq3Translations[lang],
      create: { faqId: faq3.id, language: lang, ...faq3Translations[lang] },
    });
  }

  // FAQ 4: Preciso de levar equipamento?
  const faq4 = await findOrCreateFAQ(
    event.id,
    3,
    "Preciso de levar equipamento?",
    "Não. Todo o equipamento necessário para as 10 zonas é fornecido pela organização. Apenas precisas de trazer roupa e calçado desportivo adequado."
  );

  const faq4Translations = {
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
      where: { faqId_language: { faqId: faq4.id, language: lang } },
      update: faq4Translations[lang],
      create: { faqId: faq4.id, language: lang, ...faq4Translations[lang] },
    });
  }

  // FAQ 5: Posso participar em várias provas?
  const faq5 = await findOrCreateFAQ(
    event.id,
    4,
    "Posso participar em várias provas durante o fim de semana?",
    "Sim! Podes inscrever-te em várias provas ao longo dos dois dias. O evento está organizado para que possas participar em múltiplas modalidades, por exemplo DEKA FIT no sábado de manhã e DEKA MILE à noite."
  );

  const faq5Translations = {
    pt: {
      question: "Posso participar em várias provas durante o fim de semana?",
      answer:
        "Sim! Podes inscrever-te em várias provas ao longo dos dois dias. O evento está organizado para que possas participar em múltiplas modalidades, por exemplo DEKA FIT no sábado de manhã e DEKA MILE à noite.",
    },
    en: {
      question: "Can I participate in multiple races during the weekend?",
      answer:
        "Yes! You can register for multiple races over the two days. The event is organized so you can participate in multiple modalities, for example DEKA FIT on Saturday morning and DEKA MILE in the evening.",
    },
    es: {
      question:
        "¿Puedo participar en varias carreras durante el fin de semana?",
      answer:
        "¡Sí! Puedes inscribirte en varias carreras a lo largo de los dos días. El evento está organizado para que puedas participar en múltiples modalidades, por ejemplo DEKA FIT el sábado por la mañana y DEKA MILE por la noche.",
    },
    fr: {
      question: "Puis-je participer à plusieurs courses pendant le week-end ?",
      answer:
        "Oui ! Vous pouvez vous inscrire à plusieurs courses sur les deux jours. L'événement est organisé pour que vous puissiez participer à plusieurs modalités, par exemple DEKA FIT le samedi matin et DEKA MILE le soir.",
    },
    de: {
      question: "Kann ich am Wochenende an mehreren Rennen teilnehmen?",
      answer:
        "Ja! Du kannst dich für mehrere Rennen über die zwei Tage anmelden. Die Veranstaltung ist so organisiert, dass du an mehreren Modalitäten teilnehmen kannst, zum Beispiel DEKA FIT am Samstagmorgen und DEKA MILE am Abend.",
    },
    it: {
      question: "Posso partecipare a più gare durante il weekend?",
      answer:
        "Sì! Puoi iscriverti a più gare nei due giorni. L'evento è organizzato in modo che tu possa partecipare a più modalità, ad esempio DEKA FIT sabato mattina e DEKA MILE la sera.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: lang } },
      update: faq5Translations[lang],
      create: { faqId: faq5.id, language: lang, ...faq5Translations[lang] },
    });
  }

  // FAQ 6: Onde fica o local e como chegar?
  const faq6 = await findOrCreateFAQ(
    event.id,
    5,
    "Onde fica o Campo de Fútbol Ciudad de Torremolinos?",
    "O Campo de Fútbol Ciudad de Torremolinos fica na C. de los Pinares, 3, em Torremolinos, Málaga. A zona dispõe de estacionamento e é facilmente acessível desde o centro de Torremolinos e do aeroporto de Málaga (a cerca de 10 minutos)."
  );

  const faq6Translations = {
    pt: {
      question: "Onde fica o Campo de Fútbol Ciudad de Torremolinos?",
      answer:
        "O Campo de Fútbol Ciudad de Torremolinos fica na C. de los Pinares, 3, em Torremolinos, Málaga. A zona dispõe de estacionamento e é facilmente acessível desde o centro de Torremolinos e do aeroporto de Málaga (a cerca de 10 minutos).",
    },
    en: {
      question: "Where is Campo de Fútbol Ciudad de Torremolinos?",
      answer:
        "Campo de Fútbol Ciudad de Torremolinos is located at C. de los Pinares, 3, in Torremolinos, Málaga. The area has parking and is easily accessible from Torremolinos center and Málaga airport (about 10 minutes away).",
    },
    es: {
      question: "¿Dónde está el Campo de Fútbol Ciudad de Torremolinos?",
      answer:
        "El Campo de Fútbol Ciudad de Torremolinos está ubicado en C. de los Pinares, 3, en Torremolinos, Málaga. La zona dispone de aparcamiento y es fácilmente accesible desde el centro de Torremolinos y el aeropuerto de Málaga (a unos 10 minutos).",
    },
    fr: {
      question: "Où se trouve le Campo de Fútbol Ciudad de Torremolinos ?",
      answer:
        "Le Campo de Fútbol Ciudad de Torremolinos est situé C. de los Pinares, 3, à Torremolinos, Málaga. La zone dispose d'un parking et est facilement accessible depuis le centre de Torremolinos et l'aéroport de Málaga (à environ 10 minutes).",
    },
    de: {
      question: "Wo befindet sich das Campo de Fútbol Ciudad de Torremolinos?",
      answer:
        "Das Campo de Fútbol Ciudad de Torremolinos befindet sich in der C. de los Pinares, 3, in Torremolinos, Málaga. Das Gebiet verfügt über Parkplätze und ist vom Zentrum von Torremolinos und vom Flughafen Málaga (ca. 10 Minuten entfernt) leicht erreichbar.",
    },
    it: {
      question: "Dove si trova il Campo de Fútbol Ciudad de Torremolinos?",
      answer:
        "Il Campo de Fútbol Ciudad de Torremolinos si trova in C. de los Pinares, 3, a Torremolinos, Málaga. La zona dispone di parcheggio ed è facilmente raggiungibile dal centro di Torremolinos e dall'aeroporto di Málaga (a circa 10 minuti).",
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

  console.log(
    "\n🏋️ DEKA Torremolinos (Málaga) 2026 seed completed successfully!"
  );
  console.log("   - Event: DEKA Torremolinos (Málaga) 2026");
  console.log("   - Dates: 28 February - 1 March 2026");
  console.log("   - Location: Campo de Fútbol Ciudad de Torremolinos, Spain");
  console.log(
    "   - Variants: DEKA FIT, DEKA FIT Teams, DEKA MILE, DEKA MILE Teams"
  );
  console.log("   - Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("   - Pricing phases: 12 total");
  console.log("   - FAQs: 6 questions");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding DEKA Torremolinos (Málaga) 2026:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
