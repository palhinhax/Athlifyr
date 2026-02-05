/**
 * Seed DEKA Sevilla 2026
 * Complete with translations in all 6 languages
 * DEKA FIT & DEKA FIT Teams
 * Location: Fibes - Centro de Conferencias y Exposiciones de Sevilla, Spain
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Seeding DEKA Sevilla 2026...");

  // Step 1: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "deka-sevilla-2026" },
    update: {
      title: "DEKA Sevilla 2026",
      description: `## 🏋️ DEKA Sevilla 2026

**A DEKA chega a Sevilha pela primeira vez!**

No dia 16 de maio de 2026, Sevilha fará história ao sediar a DEKA pela primeira vez. Prepara-te para um dia repleto de energia, desafios e espírito de comunidade fitness numa das cidades mais vibrantes e cativantes de Espanha. Combina a tua experiência DEKA com a arte, a cultura e a paixão que só Sevilha pode oferecer.

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

**Fibes - Centro de Conferencias y Exposiciones de Sevilla**
Av. Alcalde Luis Uruñuela, 1
Sevilha, Andaluzia, Espanha

O Fibes é um centro de convenções de classe mundial, perfeito para acolher este evento épico de fitness!

### 📅 Programa - Sábado, 16 Maio 2026

- **07:00 - 19:00** - Levantamento de Dorsais
- **08:30 - 14:00** - DEKA FIT Age Group
- **14:30 - 15:00** - Cerimónia de Premiação DEKA FIT
- **15:30 - 18:30** - DEKA FIT Teams
- **19:00 - 19:30** - Cerimónia de Premiação DEKA FIT Teams

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
- 📍 Coordenadas: 37.4042, -5.9319
- 🔗 [spartan.com](https://pt.spartan.com/pt/races/deka-sevilla)

**Junta-te à Revolução do Fitness em Sevilha! 💪**`,
      startDate: new Date("2026-05-16T07:00:00Z"),
      endDate: new Date("2026-05-16T20:00:00Z"),
      registrationDeadline: new Date("2026-05-15T23:59:59Z"),
      sportTypes: [SportType.OCR, SportType.RUNNING, SportType.CROSSFIT],
      city: "Sevilla",
      country: "Spain",
      latitude: 37.4042,
      longitude: -5.9319,
      googleMapsUrl: "https://maps.app.goo.gl/w1YbcrzLawyZd2RL8",
      externalUrl: "https://pt.spartan.com/pt/races/deka-sevilla",
      imageUrl: "",
      isFeatured: true,
    },
    create: {
      title: "DEKA Sevilla 2026",
      slug: "deka-sevilla-2026",
      description: `## 🏋️ DEKA Sevilla 2026

**A DEKA chega a Sevilha pela primeira vez!**

No dia 16 de maio de 2026, Sevilha fará história ao sediar a DEKA pela primeira vez. Prepara-te para um dia repleto de energia, desafios e espírito de comunidade fitness numa das cidades mais vibrantes e cativantes de Espanha. Combina a tua experiência DEKA com a arte, a cultura e a paixão que só Sevilha pode oferecer.

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

**Fibes - Centro de Conferencias y Exposiciones de Sevilla**
Av. Alcalde Luis Uruñuela, 1
Sevilha, Andaluzia, Espanha

O Fibes é um centro de convenções de classe mundial, perfeito para acolher este evento épico de fitness!

### 📅 Programa - Sábado, 16 Maio 2026

- **07:00 - 19:00** - Levantamento de Dorsais
- **08:30 - 14:00** - DEKA FIT Age Group
- **14:30 - 15:00** - Cerimónia de Premiação DEKA FIT
- **15:30 - 18:30** - DEKA FIT Teams
- **19:00 - 19:30** - Cerimónia de Premiação DEKA FIT Teams

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
- 📍 Coordenadas: 37.4042, -5.9319
- 🔗 [spartan.com](https://pt.spartan.com/pt/races/deka-sevilla)

**Junta-te à Revolução do Fitness em Sevilha! 💪**`,
      startDate: new Date("2026-05-16T07:00:00Z"),
      endDate: new Date("2026-05-16T20:00:00Z"),
      registrationDeadline: new Date("2026-05-15T23:59:59Z"),
      sportTypes: [SportType.OCR, SportType.RUNNING, SportType.CROSSFIT],
      city: "Sevilla",
      country: "Spain",
      latitude: 37.4042,
      longitude: -5.9319,
      googleMapsUrl: "https://maps.app.goo.gl/w1YbcrzLawyZd2RL8",
      externalUrl: "https://pt.spartan.com/pt/races/deka-sevilla",
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
      title: "DEKA Sevilla 2026",
      description: `## 🏋️ DEKA Sevilla 2026

**A DEKA chega a Sevilha pela primeira vez!**

No dia 16 de maio de 2026, Sevilha fará história ao sediar a DEKA pela primeira vez. Prepara-te para um dia repleto de energia, desafios e espírito de comunidade fitness numa das cidades mais vibrantes e cativantes de Espanha. Combina a tua experiência DEKA com a arte, a cultura e a paixão que só Sevilha pode oferecer.

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

**Fibes - Centro de Conferencias y Exposiciones de Sevilla**
Av. Alcalde Luis Uruñuela, 1
Sevilha, Andaluzia, Espanha

### 📅 Programa - Sábado, 16 Maio 2026

- **07:00 - 19:00** - Levantamento de Dorsais
- **08:30 - 14:00** - DEKA FIT Age Group
- **14:30 - 15:00** - Cerimónia de Premiação DEKA FIT
- **15:30 - 18:30** - DEKA FIT Teams
- **19:00 - 19:30** - Cerimónia de Premiação DEKA FIT Teams

### 🎁 O Que Está Incluído

- 🏅 Medalha Finisher DEKA
- 👕 T-Shirt oficial DEKA
- 📊 DEKA Mark oficial
- 📸 Acesso a fotos oficiais

**Junta-te à Revolução do Fitness em Sevilha! 💪**`,
      city: "Sevilha",
      metaTitle: "DEKA Sevilla 2026 | Fibes Sevilha | 16 Maio",
      metaDescription:
        "DEKA Sevilla 2026 - 16 maio no Fibes Sevilha. Primeira edição em Sevilha! DEKA FIT 5km e DEKA FIT Teams. 10 zonas de fitness funcional. Conquista o teu DEKA Mark!",
    },
    en: {
      title: "DEKA Sevilla 2026",
      description: `## 🏋️ DEKA Sevilla 2026

**DEKA arrives in Seville for the first time!**

On May 16, 2026, Seville will make history by hosting DEKA for the first time. Get ready for a day full of energy, challenges and fitness community spirit in one of Spain's most vibrant and captivating cities. Combine your DEKA experience with the art, culture and passion that only Seville can offer.

### 🔥 What is DEKA?

**DEKA** is a functional fitness competition created by Spartan that tests strength, endurance and athletic ability through **10 exercise zones** interspersed with running. It's the most complete fitness test in the world!

### 🏃 The Races

**DEKA FIT** - The Complete Challenge
- Distance: 5 km
- Zones: 10
- Average time: 50m 30s
- Tests all physical capabilities

**DEKA FIT Teams** - Teamwork
- Distance: 5 km
- Zones: 10
- Average time: 44m 10s
- 2 athletes per team
- Share the exercises and conquer together!

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

**Fibes - Seville Conference and Exhibition Centre**
Av. Alcalde Luis Uruñuela, 1
Seville, Andalusia, Spain

### 📅 Schedule - Saturday, May 16, 2026

- **07:00 - 19:00** - Bib Pickup
- **08:30 - 14:00** - DEKA FIT Age Group
- **14:30 - 15:00** - DEKA FIT Awards Ceremony
- **15:30 - 18:30** - DEKA FIT Teams
- **19:00 - 19:30** - DEKA FIT Teams Awards Ceremony

### 🎁 What's Included

- 🏅 DEKA Finisher Medal
- 👕 Official DEKA T-Shirt
- 📊 Official DEKA Mark
- 📸 Access to official photos

**Join the Fitness Revolution in Seville! 💪**`,
      city: "Seville",
      metaTitle: "DEKA Sevilla 2026 | Fibes Seville | May 16",
      metaDescription:
        "DEKA Sevilla 2026 - May 16 at Fibes Seville. First edition in Seville! DEKA FIT 5km and DEKA FIT Teams. 10 functional fitness zones. Earn your DEKA Mark!",
    },
    es: {
      title: "DEKA Sevilla 2026",
      description: `## 🏋️ DEKA Sevilla 2026

**¡DEKA llega a Sevilla por primera vez!**

El 16 de mayo de 2026, Sevilla hará historia al albergar DEKA por primera vez. Prepárate para un día repleto de energía, desafíos y espíritu de comunidad fitness en una de las ciudades más vibrantes y cautivadoras de España. Combina tu experiencia DEKA con el arte, la cultura y la pasión que solo Sevilla puede ofrecer.

### 🔥 ¿Qué es DEKA?

**DEKA** es una competición de fitness funcional creada por Spartan que pone a prueba la fuerza, resistencia y capacidad atlética a través de **10 zonas de ejercicios** intercaladas con carrera. ¡Es la prueba de fitness más completa del mundo!

### 🏃 Las Carreras

**DEKA FIT** - El Desafío Completo
- Distancia: 5 km
- Zonas: 10
- Duración media: 50m 30s
- Prueba todas las capacidades físicas

**DEKA FIT Teams** - Trabajo en Equipo
- Distancia: 5 km
- Zonas: 10
- Duración media: 44m 10s
- 2 atletas por equipo
- ¡Dividan los ejercicios y conquisten juntos!

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

**Fibes - Centro de Conferencias y Exposiciones de Sevilla**
Av. Alcalde Luis Uruñuela, 1
Sevilla, Andalucía, España

### 📅 Programa - Sábado, 16 de Mayo de 2026

- **07:00 - 19:00** - Recogida de Dorsales
- **08:30 - 14:00** - DEKA FIT Age Group
- **14:30 - 15:00** - Ceremonia de Premiación DEKA FIT
- **15:30 - 18:30** - DEKA FIT Teams
- **19:00 - 19:30** - Ceremonia de Premiación DEKA FIT Teams

### 🎁 Qué Está Incluido

- 🏅 Medalla Finisher DEKA
- 👕 Camiseta oficial DEKA
- 📊 DEKA Mark oficial
- 📸 Acceso a fotos oficiales

**¡Únete a la Revolución del Fitness en Sevilla! 💪**`,
      city: "Sevilla",
      metaTitle: "DEKA Sevilla 2026 | Fibes Sevilla | 16 de Mayo",
      metaDescription:
        "DEKA Sevilla 2026 - 16 de mayo en Fibes Sevilla. ¡Primera edición en Sevilla! DEKA FIT 5km y DEKA FIT Teams. 10 zonas de fitness funcional. ¡Consigue tu DEKA Mark!",
    },
    fr: {
      title: "DEKA Sevilla 2026",
      description: `## 🏋️ DEKA Sevilla 2026

**DEKA arrive à Séville pour la première fois !**

Le 16 mai 2026, Séville fera l'histoire en accueillant DEKA pour la première fois. Préparez-vous pour une journée pleine d'énergie, de défis et d'esprit de communauté fitness dans l'une des villes les plus vibrantes et captivantes d'Espagne. Combinez votre expérience DEKA avec l'art, la culture et la passion que seule Séville peut offrir.

### 🔥 Qu'est-ce que DEKA ?

**DEKA** est une compétition de fitness fonctionnel créée par Spartan qui teste la force, l'endurance et les capacités athlétiques à travers **10 zones d'exercices** entrecoupées de course. C'est le test de fitness le plus complet au monde !

### 🏃 Les Épreuves

**DEKA FIT** - Le Défi Complet
- Distance : 5 km
- Zones : 10
- Durée moyenne : 50m 30s
- Teste toutes les capacités physiques

**DEKA FIT Teams** - Travail d'Équipe
- Distance : 5 km
- Zones : 10
- Durée moyenne : 44m 10s
- 2 athlètes par équipe
- Partagez les exercices et conquérez ensemble !

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

**Fibes - Centre de Conférences et d'Expositions de Séville**
Av. Alcalde Luis Uruñuela, 1
Séville, Andalousie, Espagne

### 📅 Programme - Samedi 16 Mai 2026

- **07:00 - 19:00** - Retrait des Dossards
- **08:30 - 14:00** - DEKA FIT Age Group
- **14:30 - 15:00** - Cérémonie de Remise des Prix DEKA FIT
- **15:30 - 18:30** - DEKA FIT Teams
- **19:00 - 19:30** - Cérémonie de Remise des Prix DEKA FIT Teams

### 🎁 Ce Qui Est Inclus

- 🏅 Médaille Finisher DEKA
- 👕 T-Shirt officiel DEKA
- 📊 DEKA Mark officiel
- 📸 Accès aux photos officielles

**Rejoignez la Révolution du Fitness à Séville ! 💪**`,
      city: "Séville",
      metaTitle: "DEKA Sevilla 2026 | Fibes Séville | 16 Mai",
      metaDescription:
        "DEKA Sevilla 2026 - 16 mai à Fibes Séville. Première édition à Séville ! DEKA FIT 5km et DEKA FIT Teams. 10 zones de fitness fonctionnel. Obtenez votre DEKA Mark !",
    },
    de: {
      title: "DEKA Sevilla 2026",
      description: `## 🏋️ DEKA Sevilla 2026

**DEKA kommt zum ersten Mal nach Sevilla!**

Am 16. Mai 2026 wird Sevilla Geschichte schreiben, indem es DEKA zum ersten Mal ausrichtet. Macht euch bereit für einen Tag voller Energie, Herausforderungen und Fitness-Community-Geist in einer der lebendigsten und faszinierendsten Städte Spaniens. Kombiniert euer DEKA-Erlebnis mit der Kunst, Kultur und Leidenschaft, die nur Sevilla bieten kann.

### 🔥 Was ist DEKA?

**DEKA** ist ein funktioneller Fitness-Wettbewerb, der von Spartan entwickelt wurde und Kraft, Ausdauer und athletische Fähigkeiten durch **10 Übungszonen** testet, die mit Laufen kombiniert werden. Es ist der vollständigste Fitness-Test der Welt!

### 🏃 Die Rennen

**DEKA FIT** - Die Komplette Herausforderung
- Distanz: 5 km
- Zonen: 10
- Durchschnittszeit: 50m 30s
- Testet alle körperlichen Fähigkeiten

**DEKA FIT Teams** - Teamarbeit
- Distanz: 5 km
- Zonen: 10
- Durchschnittszeit: 44m 10s
- 2 Athleten pro Team
- Teilt die Übungen auf und erobert gemeinsam!

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

**Fibes - Kongress- und Ausstellungszentrum Sevilla**
Av. Alcalde Luis Uruñuela, 1
Sevilla, Andalusien, Spanien

### 📅 Programm - Samstag, 16. Mai 2026

- **07:00 - 19:00** - Startnummernabholung
- **08:30 - 14:00** - DEKA FIT Age Group
- **14:30 - 15:00** - Siegerehrung DEKA FIT
- **15:30 - 18:30** - DEKA FIT Teams
- **19:00 - 19:30** - Siegerehrung DEKA FIT Teams

### 🎁 Was enthalten ist

- 🏅 DEKA Finisher-Medaille
- 👕 Offizielles DEKA T-Shirt
- 📊 Offizieller DEKA Mark
- 📸 Zugang zu offiziellen Fotos

**Schließe dich der Fitness-Revolution in Sevilla an! 💪**`,
      city: "Sevilla",
      metaTitle: "DEKA Sevilla 2026 | Fibes Sevilla | 16. Mai",
      metaDescription:
        "DEKA Sevilla 2026 - 16. Mai im Fibes Sevilla. Erste Ausgabe in Sevilla! DEKA FIT 5km und DEKA FIT Teams. 10 funktionelle Fitness-Zonen. Verdiene deinen DEKA Mark!",
    },
    it: {
      title: "DEKA Sevilla 2026",
      description: `## 🏋️ DEKA Sevilla 2026

**DEKA arriva a Siviglia per la prima volta!**

Il 16 maggio 2026, Siviglia farà storia ospitando DEKA per la prima volta. Preparatevi per una giornata piena di energia, sfide e spirito di comunità fitness in una delle città più vibranti e affascinanti della Spagna. Combinate la vostra esperienza DEKA con l'arte, la cultura e la passione che solo Siviglia può offrire.

### 🔥 Cos'è DEKA?

**DEKA** è una competizione di fitness funzionale creata da Spartan che testa forza, resistenza e capacità atletiche attraverso **10 zone di esercizi** alternate a corsa. È il test di fitness più completo al mondo!

### 🏃 Le Gare

**DEKA FIT** - La Sfida Completa
- Distanza: 5 km
- Zone: 10
- Tempo medio: 50m 30s
- Testa tutte le capacità fisiche

**DEKA FIT Teams** - Lavoro di Squadra
- Distanza: 5 km
- Zone: 10
- Tempo medio: 44m 10s
- 2 atleti per squadra
- Dividete gli esercizi e conquistate insieme!

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

**Fibes - Centro Congressi ed Esposizioni di Siviglia**
Av. Alcalde Luis Uruñuela, 1
Siviglia, Andalusia, Spagna

### 📅 Programma - Sabato 16 Maggio 2026

- **07:00 - 19:00** - Ritiro Pettorali
- **08:30 - 14:00** - DEKA FIT Age Group
- **14:30 - 15:00** - Cerimonia di Premiazione DEKA FIT
- **15:30 - 18:30** - DEKA FIT Teams
- **19:00 - 19:30** - Cerimonia di Premiazione DEKA FIT Teams

### 🎁 Cosa È Incluso

- 🏅 Medaglia Finisher DEKA
- 👕 T-Shirt ufficiale DEKA
- 📊 DEKA Mark ufficiale
- 📸 Accesso alle foto ufficiali

**Unisciti alla Rivoluzione del Fitness a Siviglia! 💪**`,
      city: "Siviglia",
      metaTitle: "DEKA Sevilla 2026 | Fibes Siviglia | 16 Maggio",
      metaDescription:
        "DEKA Sevilla 2026 - 16 maggio al Fibes Siviglia. Prima edizione a Siviglia! DEKA FIT 5km e DEKA FIT Teams. 10 zone di fitness funzionale. Guadagna il tuo DEKA Mark!",
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
      startDate: new Date("2026-05-16T08:30:00Z"),
      maxParticipants: 300,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-03-31T23:59:59Z"),
          price: 80.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA FIT",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-04-01T00:00:00Z"),
          endDate: new Date("2026-05-01T23:59:59Z"),
          price: 95.0,
          currency: Currency.EUR,
          note: "Regular - DEKA FIT",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-05-02T00:00:00Z"),
          endDate: new Date("2026-05-15T23:59:59Z"),
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
      startDate: new Date("2026-05-16T15:30:00Z"),
      maxParticipants: 100,
      cutoffTimeHours: null,
      pricingPhases: [
        {
          name: "Preço Inicial",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-03-31T23:59:59Z"),
          price: 60.0,
          currency: Currency.EUR,
          note: "Early Bird - DEKA FIT Teams (por pessoa)",
        },
        {
          name: "Preço Regular",
          startDate: new Date("2026-04-01T00:00:00Z"),
          endDate: new Date("2026-05-01T23:59:59Z"),
          price: 75.0,
          currency: Currency.EUR,
          note: "Regular - DEKA FIT Teams (por pessoa)",
        },
        {
          name: "Preço Final",
          startDate: new Date("2026-05-02T00:00:00Z"),
          endDate: new Date("2026-05-15T23:59:59Z"),
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

  // FAQ 2: Qual é a diferença entre DEKA FIT e DEKA FIT Teams?
  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "Qual é a diferença entre DEKA FIT e DEKA FIT Teams?",
    "DEKA FIT é a prova individual de 5km com 10 zonas. DEKA FIT Teams é a mesma prova mas em equipas de 2 pessoas que dividem os exercícios. A versão em equipa é perfeita para quem quer partilhar o desafio com um parceiro!"
  );

  const faq2Translations = {
    pt: {
      question: "Qual é a diferença entre DEKA FIT e DEKA FIT Teams?",
      answer:
        "DEKA FIT é a prova individual de 5km com 10 zonas. DEKA FIT Teams é a mesma prova mas em equipas de 2 pessoas que dividem os exercícios. A versão em equipa é perfeita para quem quer partilhar o desafio com um parceiro!",
    },
    en: {
      question: "What's the difference between DEKA FIT and DEKA FIT Teams?",
      answer:
        "DEKA FIT is the individual 5km race with 10 zones. DEKA FIT Teams is the same race but in teams of 2 people who share the exercises. The team version is perfect for those who want to share the challenge with a partner!",
    },
    es: {
      question: "¿Cuál es la diferencia entre DEKA FIT y DEKA FIT Teams?",
      answer:
        "DEKA FIT es la carrera individual de 5km con 10 zonas. DEKA FIT Teams es la misma carrera pero en equipos de 2 personas que dividen los ejercicios. ¡La versión en equipo es perfecta para quienes quieren compartir el desafío con un compañero!",
    },
    fr: {
      question: "Quelle est la différence entre DEKA FIT et DEKA FIT Teams ?",
      answer:
        "DEKA FIT est la course individuelle de 5km avec 10 zones. DEKA FIT Teams est la même course mais en équipes de 2 personnes qui partagent les exercices. La version en équipe est parfaite pour ceux qui veulent partager le défi avec un partenaire !",
    },
    de: {
      question: "Was ist der Unterschied zwischen DEKA FIT und DEKA FIT Teams?",
      answer:
        "DEKA FIT ist das individuelle 5km-Rennen mit 10 Zonen. DEKA FIT Teams ist das gleiche Rennen, aber in 2er-Teams, die sich die Übungen teilen. Die Team-Version ist perfekt für alle, die die Herausforderung mit einem Partner teilen möchten!",
    },
    it: {
      question: "Qual è la differenza tra DEKA FIT e DEKA FIT Teams?",
      answer:
        "DEKA FIT è la gara individuale di 5km con 10 zone. DEKA FIT Teams è la stessa gara ma in squadre di 2 persone che dividono gli esercizi. La versione in squadra è perfetta per chi vuole condividere la sfida con un partner!",
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

  // FAQ 5: Posso participar em ambas as provas?
  const faq5 = await findOrCreateFAQ(
    event.id,
    4,
    "Posso participar em ambas as provas?",
    "Sim! Podes inscrever-te tanto no DEKA FIT como no DEKA FIT Teams no mesmo dia. O DEKA FIT é de manhã e o DEKA FIT Teams é à tarde, por isso tens tempo para recuperar entre as provas."
  );

  const faq5Translations = {
    pt: {
      question: "Posso participar em ambas as provas?",
      answer:
        "Sim! Podes inscrever-te tanto no DEKA FIT como no DEKA FIT Teams no mesmo dia. O DEKA FIT é de manhã e o DEKA FIT Teams é à tarde, por isso tens tempo para recuperar entre as provas.",
    },
    en: {
      question: "Can I participate in both races?",
      answer:
        "Yes! You can register for both DEKA FIT and DEKA FIT Teams on the same day. DEKA FIT is in the morning and DEKA FIT Teams is in the afternoon, so you have time to recover between races.",
    },
    es: {
      question: "¿Puedo participar en ambas carreras?",
      answer:
        "¡Sí! Puedes inscribirte tanto en DEKA FIT como en DEKA FIT Teams el mismo día. DEKA FIT es por la mañana y DEKA FIT Teams por la tarde, así que tienes tiempo para recuperarte entre carreras.",
    },
    fr: {
      question: "Puis-je participer aux deux courses ?",
      answer:
        "Oui ! Vous pouvez vous inscrire à DEKA FIT et DEKA FIT Teams le même jour. DEKA FIT est le matin et DEKA FIT Teams l'après-midi, vous avez donc le temps de récupérer entre les courses.",
    },
    de: {
      question: "Kann ich an beiden Rennen teilnehmen?",
      answer:
        "Ja! Du kannst dich am selben Tag für DEKA FIT und DEKA FIT Teams anmelden. DEKA FIT ist am Morgen und DEKA FIT Teams am Nachmittag, sodass du Zeit hast, dich zwischen den Rennen zu erholen.",
    },
    it: {
      question: "Posso partecipare a entrambe le gare?",
      answer:
        "Sì! Puoi iscriverti sia a DEKA FIT che a DEKA FIT Teams nello stesso giorno. DEKA FIT è la mattina e DEKA FIT Teams il pomeriggio, quindi hai tempo per recuperare tra le gare.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: lang } },
      update: faq5Translations[lang],
      create: { faqId: faq5.id, language: lang, ...faq5Translations[lang] },
    });
  }

  // FAQ 6: Onde fica o Fibes?
  const faq6 = await findOrCreateFAQ(
    event.id,
    5,
    "Onde fica o Fibes e como chegar?",
    "O Fibes - Centro de Conferencias y Exposiciones de Sevilla fica na Av. Alcalde Luis Uruñuela, 1, em Sevilha. Dispõe de amplo estacionamento e é facilmente acessível por transportes públicos, incluindo metro e autocarro."
  );

  const faq6Translations = {
    pt: {
      question: "Onde fica o Fibes e como chegar?",
      answer:
        "O Fibes - Centro de Conferencias y Exposiciones de Sevilla fica na Av. Alcalde Luis Uruñuela, 1, em Sevilha. Dispõe de amplo estacionamento e é facilmente acessível por transportes públicos, incluindo metro e autocarro.",
    },
    en: {
      question: "Where is Fibes and how to get there?",
      answer:
        "Fibes - Seville Conference and Exhibition Centre is located at Av. Alcalde Luis Uruñuela, 1, in Seville. It has ample parking and is easily accessible by public transport, including metro and bus.",
    },
    es: {
      question: "¿Dónde está Fibes y cómo llegar?",
      answer:
        "Fibes - Centro de Conferencias y Exposiciones de Sevilla está ubicado en Av. Alcalde Luis Uruñuela, 1, en Sevilla. Dispone de amplio aparcamiento y es fácilmente accesible por transporte público, incluyendo metro y autobús.",
    },
    fr: {
      question: "Où se trouve Fibes et comment y accéder ?",
      answer:
        "Fibes - Centre de Conférences et d'Expositions de Séville est situé Av. Alcalde Luis Uruñuela, 1, à Séville. Il dispose d'un grand parking et est facilement accessible par les transports en commun, y compris le métro et le bus.",
    },
    de: {
      question: "Wo ist Fibes und wie kommt man dorthin?",
      answer:
        "Fibes - Kongress- und Ausstellungszentrum Sevilla befindet sich an der Av. Alcalde Luis Uruñuela, 1, in Sevilla. Es verfügt über einen großen Parkplatz und ist mit öffentlichen Verkehrsmitteln, einschließlich U-Bahn und Bus, leicht erreichbar.",
    },
    it: {
      question: "Dove si trova Fibes e come arrivarci?",
      answer:
        "Fibes - Centro Congressi ed Esposizioni di Siviglia si trova in Av. Alcalde Luis Uruñuela, 1, a Siviglia. Dispone di ampio parcheggio ed è facilmente raggiungibile con i mezzi pubblici, inclusi metropolitana e autobus.",
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

  console.log("\n🏋️ DEKA Sevilla 2026 seed completed successfully!");
  console.log("   - Event: DEKA Sevilla 2026");
  console.log("   - Date: 16 May 2026");
  console.log("   - Location: Fibes, Sevilla, Spain");
  console.log("   - Variants: DEKA FIT, DEKA FIT Teams");
  console.log("   - Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("   - Pricing phases: 6 total");
  console.log("   - FAQs: 6 questions");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding DEKA Sevilla 2026:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
