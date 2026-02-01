/**
 * Seed DEKA Braga 2026
 * Complete with translations in all 6 languages
 * DEKA FIT, DEKA FIT Teams & DEKA MILE
 * Location: Forum Braga, Braga, Portugal
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Seeding DEKA Braga 2026...");

  // Step 1: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "deka-braga-2026" },
    update: {
      title: "DEKA Braga 2026",
      description: `## 🏋️ DEKA Braga 2026

**A DEKA está de volta a Braga!**

Depois de receber a primeira edição de sempre da DEKA em Portugal, Braga está novamente pronta para acolher a melhor festa de fitness. Preparem-se, a DEKA regressa com uma energia incomparável para inspirar os atletas a alcançarem o seu **DEKA Mark** e a fortalecerem a **Revolução do Fitness em Portugal**.

### 🔥 O Que é a DEKA?

A **DEKA** é uma competição de fitness funcional criada pela Spartan que testa a força, resistência e capacidade atlética através de **10 zonas de exercícios** intercaladas com corrida. É o teste de fitness mais completo do mundo!

### 🏃 As Provas

**DEKA FIT** - O Desafio Completo
- Distância: 5 km
- Zonas: 10
- Duração média: 44m 10s
- Testa todas as capacidades físicas

**DEKA FIT Teams** - Trabalho de Equipa
- Distância: 5 km
- Zonas: 10
- 2 atletas por equipa
- Dividam os exercícios e conquistem juntos!

**DEKA MILE** - Velocidade e Potência
- Distância: 1 milha (1.6 km)
- Zonas: 10
- Duração média: 29m 30s
- Versão mais rápida e intensa

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

**Forum Braga**
Av. Dr. Francisco Pires Gonçalves
Braga, Portugal

O Forum Braga oferece instalações de classe mundial para este evento épico de fitness!

### 📅 Programa - Sábado, 12 Setembro 2026

- **07:00 - 20:00** - Levantamento de Dorsais
- **08:30 - 12:30** - DEKA FIT Age Group
- **13:00 - 13:40** - DEKA FIT Elite
- **14:30 - 15:00** - Cerimónia de Premiação Age Group & Elite
- **15:00 - 18:24** - DEKA FIT Teams
- **19:15 - 19:25** - Cerimónia de Premiação DEKA FIT Teams
- **19:30 - 20:30** - DEKA MILE

*Horário preliminar. Podem ocorrer alterações conforme o evento se aproxima.*

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
- 📍 Coordenadas: 41.5417, -8.4218
- 🔗 [spartan.com](https://pt.spartan.com/pt/races/braga)

**Junta-te à Revolução do Fitness! 💪**`,
      startDate: new Date("2026-09-12T07:00:00Z"),
      endDate: new Date("2026-09-12T21:00:00Z"),
      registrationDeadline: new Date("2026-09-11T23:59:59Z"),
      sportTypes: [SportType.OCR, SportType.RUNNING, SportType.CROSSFIT],
      city: "Braga",
      country: "Portugal",
      latitude: 41.5417,
      longitude: -8.4218,
      googleMapsUrl: "https://maps.app.goo.gl/CVVj5BbwVwsbZQZt9",
      externalUrl: "https://pt.spartan.com/pt/races/braga",
      imageUrl: "",
      isFeatured: true,
    },
    create: {
      title: "DEKA Braga 2026",
      slug: "deka-braga-2026",
      description: `## 🏋️ DEKA Braga 2026

**A DEKA está de volta a Braga!**

Depois de receber a primeira edição de sempre da DEKA em Portugal, Braga está novamente pronta para acolher a melhor festa de fitness. Preparem-se, a DEKA regressa com uma energia incomparável para inspirar os atletas a alcançarem o seu **DEKA Mark** e a fortalecerem a **Revolução do Fitness em Portugal**.

### 🔥 O Que é a DEKA?

A **DEKA** é uma competição de fitness funcional criada pela Spartan que testa a força, resistência e capacidade atlética através de **10 zonas de exercícios** intercaladas com corrida. É o teste de fitness mais completo do mundo!

### 🏃 As Provas

**DEKA FIT** - O Desafio Completo
- Distância: 5 km
- Zonas: 10
- Duração média: 44m 10s
- Testa todas as capacidades físicas

**DEKA FIT Teams** - Trabalho de Equipa
- Distância: 5 km
- Zonas: 10
- 2 atletas por equipa
- Dividam os exercícios e conquistem juntos!

**DEKA MILE** - Velocidade e Potência
- Distância: 1 milha (1.6 km)
- Zonas: 10
- Duração média: 29m 30s
- Versão mais rápida e intensa

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

**Forum Braga**
Av. Dr. Francisco Pires Gonçalves
Braga, Portugal

O Forum Braga oferece instalações de classe mundial para este evento épico de fitness!

### 📅 Programa - Sábado, 12 Setembro 2026

- **07:00 - 20:00** - Levantamento de Dorsais
- **08:30 - 12:30** - DEKA FIT Age Group
- **13:00 - 13:40** - DEKA FIT Elite
- **14:30 - 15:00** - Cerimónia de Premiação Age Group & Elite
- **15:00 - 18:24** - DEKA FIT Teams
- **19:15 - 19:25** - Cerimónia de Premiação DEKA FIT Teams
- **19:30 - 20:30** - DEKA MILE

*Horário preliminar. Podem ocorrer alterações conforme o evento se aproxima.*

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
- 📍 Coordenadas: 41.5417, -8.4218
- 🔗 [spartan.com](https://pt.spartan.com/pt/races/braga)

**Junta-te à Revolução do Fitness! 💪**`,
      startDate: new Date("2026-09-12T07:00:00Z"),
      endDate: new Date("2026-09-12T21:00:00Z"),
      registrationDeadline: new Date("2026-09-11T23:59:59Z"),
      sportTypes: [SportType.OCR, SportType.RUNNING, SportType.CROSSFIT],
      city: "Braga",
      country: "Portugal",
      latitude: 41.5417,
      longitude: -8.4218,
      googleMapsUrl: "https://maps.app.goo.gl/CVVj5BbwVwsbZQZt9",
      externalUrl: "https://pt.spartan.com/pt/races/braga",
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
      title: "DEKA Braga 2026",
      description: `## 🏋️ DEKA Braga 2026

**A DEKA está de volta a Braga!**

Depois de receber a primeira edição de sempre da DEKA em Portugal, Braga está novamente pronta para acolher a melhor festa de fitness. Preparem-se, a DEKA regressa com uma energia incomparável para inspirar os atletas a alcançarem o seu **DEKA Mark** e a fortalecerem a **Revolução do Fitness em Portugal**.

### 🔥 O Que é a DEKA?

A **DEKA** é uma competição de fitness funcional criada pela Spartan que testa a força, resistência e capacidade atlética através de **10 zonas de exercícios** intercaladas com corrida. É o teste de fitness mais completo do mundo!

### 🏃 As Provas

**DEKA FIT** - O Desafio Completo
- Distância: 5 km
- Zonas: 10
- Duração média: 44m 10s
- Testa todas as capacidades físicas

**DEKA FIT Teams** - Trabalho de Equipa
- Distância: 5 km
- Zonas: 10
- 2 atletas por equipa
- Dividam os exercícios e conquistem juntos!

**DEKA MILE** - Velocidade e Potência
- Distância: 1 milha (1.6 km)
- Zonas: 10
- Duração média: 29m 30s
- Versão mais rápida e intensa

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

**Forum Braga**
Av. Dr. Francisco Pires Gonçalves
Braga, Portugal

### 📅 Programa - Sábado, 12 Setembro 2026

- **07:00 - 20:00** - Levantamento de Dorsais
- **08:30 - 12:30** - DEKA FIT Age Group
- **13:00 - 13:40** - DEKA FIT Elite
- **14:30 - 15:00** - Cerimónia de Premiação
- **15:00 - 18:24** - DEKA FIT Teams
- **19:30 - 20:30** - DEKA MILE

### 🎁 O Que Está Incluído

- 🏅 Medalha Finisher DEKA
- 👕 T-Shirt oficial DEKA
- 📊 DEKA Mark oficial
- 📸 Acesso a fotos oficiais

**Junta-te à Revolução do Fitness! 💪**`,
      city: "Braga",
      metaTitle: "DEKA Braga 2026 | Forum Braga | 12 Setembro",
      metaDescription:
        "DEKA Braga 2026 - 12 setembro no Forum Braga. DEKA FIT 5km, DEKA FIT Teams e DEKA MILE. 10 zonas de fitness funcional. Conquista o teu DEKA Mark!",
    },
    en: {
      title: "DEKA Braga 2026",
      description: `## 🏋️ DEKA Braga 2026

**DEKA is back in Braga!**

After hosting the very first DEKA edition in Portugal, Braga is once again ready to welcome the ultimate fitness party. Get ready, DEKA returns with unmatched energy to inspire athletes to achieve their **DEKA Mark** and strengthen the **Fitness Revolution in Portugal**.

### 🔥 What is DEKA?

**DEKA** is a functional fitness competition created by Spartan that tests strength, endurance and athletic ability through **10 exercise zones** interspersed with running. It's the most complete fitness test in the world!

### 🏃 The Races

**DEKA FIT** - The Complete Challenge
- Distance: 5 km
- Zones: 10
- Average time: 44m 10s
- Tests all physical capabilities

**DEKA FIT Teams** - Teamwork
- Distance: 5 km
- Zones: 10
- 2 athletes per team
- Share the exercises and conquer together!

**DEKA MILE** - Speed and Power
- Distance: 1 mile (1.6 km)
- Zones: 10
- Average time: 29m 30s
- Faster and more intense version

### 💪 The 10 DEKA Zones

1. **Ram Burpees** - 20 reps
2. **Rows** - 500m on rower
3. **Farmers Carry** - 100m with kettlebells
4. **Box Jump Overs** - 20 reps
5. **Med Ball Sit-Up Throws** - 25 reps
6. **Ski Erg** - 500m
7. **Assault Bike** - 20 calories
8. **Dead Ball Wall-Overs** - 20 reps
9. **Tank Push/Pull** - 40m round trip
10. **Ram Burpees** - 20 reps (again!)

### 🏆 DEKA Mark

Earn your **DEKA Mark** - the official ranking that measures your fitness level. The lower the time, the better your DEKA Mark!

### 📍 Location

**Forum Braga**
Av. Dr. Francisco Pires Gonçalves
Braga, Portugal

### 📅 Schedule - Saturday, September 12, 2026

- **07:00 - 20:00** - Bib Pickup
- **08:30 - 12:30** - DEKA FIT Age Group
- **13:00 - 13:40** - DEKA FIT Elite
- **14:30 - 15:00** - Awards Ceremony
- **15:00 - 18:24** - DEKA FIT Teams
- **19:30 - 20:30** - DEKA MILE

### 🎁 What's Included

- 🏅 DEKA Finisher Medal
- 👕 Official DEKA T-Shirt
- 📊 Official DEKA Mark
- 📸 Access to official photos

**Join the Fitness Revolution! 💪**`,
      city: "Braga",
      metaTitle: "DEKA Braga 2026 | Forum Braga | September 12",
      metaDescription:
        "DEKA Braga 2026 - September 12 at Forum Braga. DEKA FIT 5km, DEKA FIT Teams and DEKA MILE. 10 functional fitness zones. Earn your DEKA Mark!",
    },
    es: {
      title: "DEKA Braga 2026",
      description: `## 🏋️ DEKA Braga 2026

**¡DEKA vuelve a Braga!**

Después de albergar la primera edición de DEKA en Portugal, Braga está nuevamente lista para acoger la mejor fiesta de fitness. Prepárense, DEKA regresa con una energía incomparable para inspirar a los atletas a alcanzar su **DEKA Mark** y fortalecer la **Revolución del Fitness en Portugal**.

### 🔥 ¿Qué es DEKA?

**DEKA** es una competición de fitness funcional creada por Spartan que pone a prueba la fuerza, resistencia y capacidad atlética a través de **10 zonas de ejercicios** intercaladas con carrera. ¡Es la prueba de fitness más completa del mundo!

### 🏃 Las Carreras

**DEKA FIT** - El Desafío Completo
- Distancia: 5 km
- Zonas: 10
- Duración media: 44m 10s
- Prueba todas las capacidades físicas

**DEKA FIT Teams** - Trabajo en Equipo
- Distancia: 5 km
- Zonas: 10
- 2 atletas por equipo
- ¡Dividan los ejercicios y conquisten juntos!

**DEKA MILE** - Velocidad y Potencia
- Distancia: 1 milla (1.6 km)
- Zonas: 10
- Duración media: 29m 30s
- Versión más rápida e intensa

### 💪 Las 10 Zonas DEKA

1. **Ram Burpees** - 20 repeticiones
2. **Rows** - 500m en remo
3. **Farmers Carry** - 100m con kettlebells
4. **Box Jump Overs** - 20 repeticiones
5. **Med Ball Sit-Up Throws** - 25 repeticiones
6. **Ski Erg** - 500m
7. **Assault Bike** - 20 calorías
8. **Dead Ball Wall-Overs** - 20 repeticiones
9. **Tank Push/Pull** - 40m ida y vuelta
10. **Ram Burpees** - 20 repeticiones (¡otra vez!)

### 🏆 DEKA Mark

Consigue tu **DEKA Mark** - la clasificación oficial que mide tu nivel de fitness. ¡Cuanto menor sea el tiempo, mejor tu DEKA Mark!

### 📍 Ubicación

**Forum Braga**
Av. Dr. Francisco Pires Gonçalves
Braga, Portugal

### 📅 Programa - Sábado, 12 de Septiembre de 2026

- **07:00 - 20:00** - Recogida de Dorsales
- **08:30 - 12:30** - DEKA FIT Age Group
- **13:00 - 13:40** - DEKA FIT Elite
- **14:30 - 15:00** - Ceremonia de Premiación
- **15:00 - 18:24** - DEKA FIT Teams
- **19:30 - 20:30** - DEKA MILE

### 🎁 Qué Está Incluido

- 🏅 Medalla Finisher DEKA
- 👕 Camiseta oficial DEKA
- 📊 DEKA Mark oficial
- 📸 Acceso a fotos oficiales

**¡Únete a la Revolución del Fitness! 💪**`,
      city: "Braga",
      metaTitle: "DEKA Braga 2026 | Forum Braga | 12 de Septiembre",
      metaDescription:
        "DEKA Braga 2026 - 12 de septiembre en Forum Braga. DEKA FIT 5km, DEKA FIT Teams y DEKA MILE. 10 zonas de fitness funcional. ¡Consigue tu DEKA Mark!",
    },
    fr: {
      title: "DEKA Braga 2026",
      description: `## 🏋️ DEKA Braga 2026

**DEKA est de retour à Braga !**

Après avoir accueilli la toute première édition de DEKA au Portugal, Braga est à nouveau prête à accueillir la meilleure fête du fitness. Préparez-vous, DEKA revient avec une énergie incomparable pour inspirer les athlètes à atteindre leur **DEKA Mark** et à renforcer la **Révolution du Fitness au Portugal**.

### 🔥 Qu'est-ce que DEKA ?

**DEKA** est une compétition de fitness fonctionnel créée par Spartan qui teste la force, l'endurance et les capacités athlétiques à travers **10 zones d'exercices** entrecoupées de course. C'est le test de fitness le plus complet au monde !

### 🏃 Les Épreuves

**DEKA FIT** - Le Défi Complet
- Distance : 5 km
- Zones : 10
- Durée moyenne : 44m 10s
- Teste toutes les capacités physiques

**DEKA FIT Teams** - Travail d'Équipe
- Distance : 5 km
- Zones : 10
- 2 athlètes par équipe
- Partagez les exercices et conquérez ensemble !

**DEKA MILE** - Vitesse et Puissance
- Distance : 1 mile (1.6 km)
- Zones : 10
- Durée moyenne : 29m 30s
- Version plus rapide et plus intense

### 💪 Les 10 Zones DEKA

1. **Ram Burpees** - 20 répétitions
2. **Rows** - 500m sur rameur
3. **Farmers Carry** - 100m avec kettlebells
4. **Box Jump Overs** - 20 répétitions
5. **Med Ball Sit-Up Throws** - 25 répétitions
6. **Ski Erg** - 500m
7. **Assault Bike** - 20 calories
8. **Dead Ball Wall-Overs** - 20 répétitions
9. **Tank Push/Pull** - 40m aller-retour
10. **Ram Burpees** - 20 répétitions (encore !)

### 🏆 DEKA Mark

Obtenez votre **DEKA Mark** - le classement officiel qui mesure votre niveau de fitness. Plus le temps est bas, meilleur est votre DEKA Mark !

### 📍 Lieu

**Forum Braga**
Av. Dr. Francisco Pires Gonçalves
Braga, Portugal

### 📅 Programme - Samedi 12 Septembre 2026

- **07:00 - 20:00** - Retrait des Dossards
- **08:30 - 12:30** - DEKA FIT Age Group
- **13:00 - 13:40** - DEKA FIT Elite
- **14:30 - 15:00** - Cérémonie de Remise des Prix
- **15:00 - 18:24** - DEKA FIT Teams
- **19:30 - 20:30** - DEKA MILE

### 🎁 Ce Qui Est Inclus

- 🏅 Médaille Finisher DEKA
- 👕 T-Shirt officiel DEKA
- 📊 DEKA Mark officiel
- 📸 Accès aux photos officielles

**Rejoignez la Révolution du Fitness ! 💪**`,
      city: "Braga",
      metaTitle: "DEKA Braga 2026 | Forum Braga | 12 Septembre",
      metaDescription:
        "DEKA Braga 2026 - 12 septembre au Forum Braga. DEKA FIT 5km, DEKA FIT Teams et DEKA MILE. 10 zones de fitness fonctionnel. Obtenez votre DEKA Mark !",
    },
    de: {
      title: "DEKA Braga 2026",
      description: `## 🏋️ DEKA Braga 2026

**DEKA ist zurück in Braga!**

Nach der Ausrichtung der allerersten DEKA-Ausgabe in Portugal ist Braga erneut bereit, die ultimative Fitness-Party zu veranstalten. Macht euch bereit, DEKA kehrt mit unvergleichlicher Energie zurück, um Athleten zu inspirieren, ihren **DEKA Mark** zu erreichen und die **Fitness-Revolution in Portugal** zu stärken.

### 🔥 Was ist DEKA?

**DEKA** ist ein funktioneller Fitness-Wettbewerb, der von Spartan entwickelt wurde und Kraft, Ausdauer und athletische Fähigkeiten durch **10 Übungszonen** testet, die mit Laufen kombiniert werden. Es ist der vollständigste Fitness-Test der Welt!

### 🏃 Die Rennen

**DEKA FIT** - Die Komplette Herausforderung
- Distanz: 5 km
- Zonen: 10
- Durchschnittszeit: 44m 10s
- Testet alle körperlichen Fähigkeiten

**DEKA FIT Teams** - Teamarbeit
- Distanz: 5 km
- Zonen: 10
- 2 Athleten pro Team
- Teilt die Übungen auf und erobert gemeinsam!

**DEKA MILE** - Geschwindigkeit und Kraft
- Distanz: 1 Meile (1.6 km)
- Zonen: 10
- Durchschnittszeit: 29m 30s
- Schnellere und intensivere Version

### 💪 Die 10 DEKA Zonen

1. **Ram Burpees** - 20 Wiederholungen
2. **Rows** - 500m auf dem Rudergerät
3. **Farmers Carry** - 100m mit Kettlebells
4. **Box Jump Overs** - 20 Wiederholungen
5. **Med Ball Sit-Up Throws** - 25 Wiederholungen
6. **Ski Erg** - 500m
7. **Assault Bike** - 20 Kalorien
8. **Dead Ball Wall-Overs** - 20 Wiederholungen
9. **Tank Push/Pull** - 40m hin und zurück
10. **Ram Burpees** - 20 Wiederholungen (nochmal!)

### 🏆 DEKA Mark

Verdiene deinen **DEKA Mark** - die offizielle Rangliste, die dein Fitness-Level misst. Je niedriger die Zeit, desto besser dein DEKA Mark!

### 📍 Ort

**Forum Braga**
Av. Dr. Francisco Pires Gonçalves
Braga, Portugal

### 📅 Programm - Samstag, 12. September 2026

- **07:00 - 20:00** - Startnummernabholung
- **08:30 - 12:30** - DEKA FIT Age Group
- **13:00 - 13:40** - DEKA FIT Elite
- **14:30 - 15:00** - Siegerehrung
- **15:00 - 18:24** - DEKA FIT Teams
- **19:30 - 20:30** - DEKA MILE

### 🎁 Was enthalten ist

- 🏅 DEKA Finisher-Medaille
- 👕 Offizielles DEKA T-Shirt
- 📊 Offizieller DEKA Mark
- 📸 Zugang zu offiziellen Fotos

**Schließe dich der Fitness-Revolution an! 💪**`,
      city: "Braga",
      metaTitle: "DEKA Braga 2026 | Forum Braga | 12. September",
      metaDescription:
        "DEKA Braga 2026 - 12. September im Forum Braga. DEKA FIT 5km, DEKA FIT Teams und DEKA MILE. 10 funktionelle Fitness-Zonen. Verdiene deinen DEKA Mark!",
    },
    it: {
      title: "DEKA Braga 2026",
      description: `## 🏋️ DEKA Braga 2026

**DEKA torna a Braga!**

Dopo aver ospitato la primissima edizione DEKA in Portogallo, Braga è nuovamente pronta ad accogliere la migliore festa del fitness. Preparatevi, DEKA torna con un'energia incomparabile per ispirare gli atleti a raggiungere il loro **DEKA Mark** e a rafforzare la **Rivoluzione del Fitness in Portogallo**.

### 🔥 Cos'è DEKA?

**DEKA** è una competizione di fitness funzionale creata da Spartan che testa forza, resistenza e capacità atletiche attraverso **10 zone di esercizi** alternate a corsa. È il test di fitness più completo al mondo!

### 🏃 Le Gare

**DEKA FIT** - La Sfida Completa
- Distanza: 5 km
- Zone: 10
- Tempo medio: 44m 10s
- Testa tutte le capacità fisiche

**DEKA FIT Teams** - Lavoro di Squadra
- Distanza: 5 km
- Zone: 10
- 2 atleti per squadra
- Dividete gli esercizi e conquistate insieme!

**DEKA MILE** - Velocità e Potenza
- Distanza: 1 miglio (1.6 km)
- Zone: 10
- Tempo medio: 29m 30s
- Versione più veloce e intensa

### 💪 Le 10 Zone DEKA

1. **Ram Burpees** - 20 ripetizioni
2. **Rows** - 500m sul vogatore
3. **Farmers Carry** - 100m con kettlebells
4. **Box Jump Overs** - 20 ripetizioni
5. **Med Ball Sit-Up Throws** - 25 ripetizioni
6. **Ski Erg** - 500m
7. **Assault Bike** - 20 calorie
8. **Dead Ball Wall-Overs** - 20 ripetizioni
9. **Tank Push/Pull** - 40m andata e ritorno
10. **Ram Burpees** - 20 ripetizioni (di nuovo!)

### 🏆 DEKA Mark

Guadagna il tuo **DEKA Mark** - la classifica ufficiale che misura il tuo livello di fitness. Più basso è il tempo, migliore è il tuo DEKA Mark!

### 📍 Luogo

**Forum Braga**
Av. Dr. Francisco Pires Gonçalves
Braga, Portogallo

### 📅 Programma - Sabato 12 Settembre 2026

- **07:00 - 20:00** - Ritiro Pettorali
- **08:30 - 12:30** - DEKA FIT Age Group
- **13:00 - 13:40** - DEKA FIT Elite
- **14:30 - 15:00** - Cerimonia di Premiazione
- **15:00 - 18:24** - DEKA FIT Teams
- **19:30 - 20:30** - DEKA MILE

### 🎁 Cosa È Incluso

- 🏅 Medaglia Finisher DEKA
- 👕 T-Shirt ufficiale DEKA
- 📊 DEKA Mark ufficiale
- 📸 Accesso alle foto ufficiali

**Unisciti alla Rivoluzione del Fitness! 💪**`,
      city: "Braga",
      metaTitle: "DEKA Braga 2026 | Forum Braga | 12 Settembre",
      metaDescription:
        "DEKA Braga 2026 - 12 settembre al Forum Braga. DEKA FIT 5km, DEKA FIT Teams e DEKA MILE. 10 zone di fitness funzionale. Guadagna il tuo DEKA Mark!",
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
      startDate: new Date("2026-09-12T08:30:00Z"),
      maxParticipants: 300,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-30T23:59:59Z"),
          price: 80.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA FIT",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-07-01T00:00:00Z"),
          endDate: new Date("2026-09-01T23:59:59Z"),
          price: 95.0,
          currency: Currency.EUR,
          note: "Regular - DEKA FIT",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-09-02T00:00:00Z"),
          endDate: new Date("2026-09-11T23:59:59Z"),
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
      startDate: new Date("2026-09-12T15:00:00Z"),
      maxParticipants: 100,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-30T23:59:59Z"),
          price: 65.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA FIT Teams (por pessoa)",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-07-01T00:00:00Z"),
          endDate: new Date("2026-09-01T23:59:59Z"),
          price: 75.0,
          currency: Currency.EUR,
          note: "Regular - DEKA FIT Teams (por pessoa)",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-09-02T00:00:00Z"),
          endDate: new Date("2026-09-11T23:59:59Z"),
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
      startDate: new Date("2026-09-12T19:30:00Z"),
      maxParticipants: 150,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-30T23:59:59Z"),
          price: 65.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA MILE",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-07-01T00:00:00Z"),
          endDate: new Date("2026-09-01T23:59:59Z"),
          price: 75.0,
          currency: Currency.EUR,
          note: "Regular - DEKA MILE",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-09-02T00:00:00Z"),
          endDate: new Date("2026-09-11T23:59:59Z"),
          price: 85.0,
          currency: Currency.EUR,
          note: "Late Registration - DEKA MILE",
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

  // FAQ 2: Qual é a diferença entre DEKA FIT, DEKA FIT Teams e DEKA MILE?
  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "Qual é a diferença entre DEKA FIT, DEKA FIT Teams e DEKA MILE?",
    "DEKA FIT é a prova individual de 5km com 10 zonas. DEKA FIT Teams é a mesma prova mas em equipas de 2 pessoas que dividem os exercícios. DEKA MILE é uma versão mais curta (1 milha) mas mantém as 10 zonas, sendo mais rápida e intensa."
  );

  const faq2Translations = {
    pt: {
      question:
        "Qual é a diferença entre DEKA FIT, DEKA FIT Teams e DEKA MILE?",
      answer:
        "DEKA FIT é a prova individual de 5km com 10 zonas. DEKA FIT Teams é a mesma prova mas em equipas de 2 pessoas que dividem os exercícios. DEKA MILE é uma versão mais curta (1 milha) mas mantém as 10 zonas, sendo mais rápida e intensa.",
    },
    en: {
      question:
        "What's the difference between DEKA FIT, DEKA FIT Teams and DEKA MILE?",
      answer:
        "DEKA FIT is the individual 5km race with 10 zones. DEKA FIT Teams is the same race but in teams of 2 people who share the exercises. DEKA MILE is a shorter version (1 mile) but keeps the 10 zones, being faster and more intense.",
    },
    es: {
      question:
        "¿Cuál es la diferencia entre DEKA FIT, DEKA FIT Teams y DEKA MILE?",
      answer:
        "DEKA FIT es la carrera individual de 5km con 10 zonas. DEKA FIT Teams es la misma carrera pero en equipos de 2 personas que dividen los ejercicios. DEKA MILE es una versión más corta (1 milla) pero mantiene las 10 zonas, siendo más rápida e intensa.",
    },
    fr: {
      question:
        "Quelle est la différence entre DEKA FIT, DEKA FIT Teams et DEKA MILE ?",
      answer:
        "DEKA FIT est la course individuelle de 5km avec 10 zones. DEKA FIT Teams est la même course mais en équipes de 2 personnes qui partagent les exercices. DEKA MILE est une version plus courte (1 mile) mais garde les 10 zones, étant plus rapide et plus intense.",
    },
    de: {
      question:
        "Was ist der Unterschied zwischen DEKA FIT, DEKA FIT Teams und DEKA MILE?",
      answer:
        "DEKA FIT ist das individuelle 5km-Rennen mit 10 Zonen. DEKA FIT Teams ist das gleiche Rennen, aber in 2er-Teams, die sich die Übungen teilen. DEKA MILE ist eine kürzere Version (1 Meile), behält aber die 10 Zonen bei und ist schneller und intensiver.",
    },
    it: {
      question:
        "Qual è la differenza tra DEKA FIT, DEKA FIT Teams e DEKA MILE?",
      answer:
        "DEKA FIT è la gara individuale di 5km con 10 zone. DEKA FIT Teams è la stessa gara ma in squadre di 2 persone che dividono gli esercizi. DEKA MILE è una versione più corta (1 miglio) ma mantiene le 10 zone, essendo più veloce e intensa.",
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

  // FAQ 5: Posso participar em mais do que uma prova?
  const faq5 = await findOrCreateFAQ(
    event.id,
    4,
    "Posso participar em mais do que uma prova?",
    "Sim! Podes inscrever-te em várias provas no mesmo dia. Muitos atletas fazem DEKA FIT de manhã e DEKA MILE à noite para maximizar a experiência."
  );

  const faq5Translations = {
    pt: {
      question: "Posso participar em mais do que uma prova?",
      answer:
        "Sim! Podes inscrever-te em várias provas no mesmo dia. Muitos atletas fazem DEKA FIT de manhã e DEKA MILE à noite para maximizar a experiência.",
    },
    en: {
      question: "Can I participate in more than one race?",
      answer:
        "Yes! You can register for multiple races on the same day. Many athletes do DEKA FIT in the morning and DEKA MILE in the evening to maximize the experience.",
    },
    es: {
      question: "¿Puedo participar en más de una carrera?",
      answer:
        "¡Sí! Puedes inscribirte en varias carreras el mismo día. Muchos atletas hacen DEKA FIT por la mañana y DEKA MILE por la noche para maximizar la experiencia.",
    },
    fr: {
      question: "Puis-je participer à plus d'une course ?",
      answer:
        "Oui ! Vous pouvez vous inscrire à plusieurs courses le même jour. Beaucoup d'athlètes font DEKA FIT le matin et DEKA MILE le soir pour maximiser l'expérience.",
    },
    de: {
      question: "Kann ich an mehr als einem Rennen teilnehmen?",
      answer:
        "Ja! Du kannst dich für mehrere Rennen am selben Tag anmelden. Viele Athleten machen DEKA FIT am Morgen und DEKA MILE am Abend, um das Erlebnis zu maximieren.",
    },
    it: {
      question: "Posso partecipare a più di una gara?",
      answer:
        "Sì! Puoi iscriverti a più gare nello stesso giorno. Molti atleti fanno DEKA FIT la mattina e DEKA MILE la sera per massimizzare l'esperienza.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: lang } },
      update: faq5Translations[lang],
      create: { faqId: faq5.id, language: lang, ...faq5Translations[lang] },
    });
  }

  // FAQ 6: Onde posso estacionar?
  const faq6 = await findOrCreateFAQ(
    event.id,
    5,
    "Onde posso estacionar?",
    "O Forum Braga dispõe de estacionamento amplo no local. Também existem transportes públicos que servem a zona."
  );

  const faq6Translations = {
    pt: {
      question: "Onde posso estacionar?",
      answer:
        "O Forum Braga dispõe de estacionamento amplo no local. Também existem transportes públicos que servem a zona.",
    },
    en: {
      question: "Where can I park?",
      answer:
        "Forum Braga has ample parking on site. Public transport also serves the area.",
    },
    es: {
      question: "¿Dónde puedo aparcar?",
      answer:
        "Forum Braga dispone de amplio aparcamiento en el lugar. También hay transporte público que sirve la zona.",
    },
    fr: {
      question: "Où puis-je me garer ?",
      answer:
        "Forum Braga dispose d'un grand parking sur place. Les transports en commun desservent également la zone.",
    },
    de: {
      question: "Wo kann ich parken?",
      answer:
        "Forum Braga verfügt über einen großen Parkplatz vor Ort. Auch öffentliche Verkehrsmittel bedienen das Gebiet.",
    },
    it: {
      question: "Dove posso parcheggiare?",
      answer:
        "Forum Braga dispone di ampio parcheggio in loco. I trasporti pubblici servono anche la zona.",
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

  console.log("\n🏋️ DEKA Braga 2026 seed completed successfully!");
  console.log("   - Event: DEKA Braga 2026");
  console.log("   - Date: 12 September 2026");
  console.log("   - Location: Forum Braga, Braga, Portugal");
  console.log("   - Variants: DEKA FIT, DEKA FIT Teams, DEKA MILE");
  console.log("   - Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("   - Pricing phases: 9 total");
  console.log("   - FAQs: 6 questions");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding DEKA Braga 2026:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
