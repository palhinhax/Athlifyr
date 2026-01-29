/**
 * Seed: 3º Canicross Espaço Animal 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🐕 Seeding 3º Canicross Espaço Animal 2026...");

  const eventSlug = "canicross-espaco-animal-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "3º Canicross Espaço Animal",
      description: `3ª edição do Canicross Espaço Animal em Torres Vedras. Evento de desportos de mushing com provas competitivas de Canicross, Bikejoring, Scooterjoring e Triciclo DR4, além de caminhadas solidárias. Percurso de aproximadamente 4,5 km em trilhos naturais. Parte da Taça de Portugal de Mushing 2025/2026.`,
      sportTypes: [SportType.TRAIL, SportType.CYCLING],
      startDate: new Date("2026-01-17T15:30:00.000Z"),
      endDate: null,
      city: "Torres Vedras",
      country: "Portugal",
      latitude: 39.0908,
      longitude: -9.2584,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=39.0908,-9.2584",
      externalUrl: "https://meutempo.pt/prova/canicross-espaco-animal-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-01-13T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "3º Canicross Espaço Animal",
      description: `3ª edição do Canicross Espaço Animal em Torres Vedras. Evento de desportos de mushing com provas competitivas de Canicross, Bikejoring, Scooterjoring e Triciclo DR4, além de caminhadas solidárias. Percurso de aproximadamente 4,5 km em trilhos naturais. Parte da Taça de Portugal de Mushing 2025/2026.`,
      sportTypes: [SportType.TRAIL, SportType.CYCLING],
      startDate: new Date("2026-01-17T15:30:00.000Z"),
      endDate: null,
      city: "Torres Vedras",
      country: "Portugal",
      latitude: 39.0908,
      longitude: -9.2584,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=39.0908,-9.2584",
      externalUrl: "https://meutempo.pt/prova/canicross-espaco-animal-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-01-13T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  const translations: Array<{
    language: "pt" | "en" | "es" | "fr" | "de" | "it";
    title: string;
    description: string;
    city: string;
    metaTitle: string;
    metaDescription: string;
  }> = [
    {
      language: "pt",
      title: "3º Canicross Espaço Animal",
      description: `# 🐕 3º Canicross Espaço Animal 2026

Bem-vindos à **3ª edição do Canicross Espaço Animal**! Um evento dedicado aos desportos de mushing em Torres Vedras, integrando a **Taça de Portugal de Mushing 2025/2026**.

## 📅 Data e Local

**Data:** 17 de Janeiro de 2026  
**Hora de Início:** 15:30 (provas competitivas) | 17:00 (caminhada solidária)  
**Local:** Restaurante O Camelo e Terrenos Adjacentes, Estrada Nacional 8-2, Vale da Borra, Torres Vedras  
**Cidade:** Torres Vedras, Portugal

## 🏃‍♂️🐕 Provas Disponíveis

O evento oferece 6 modalidades para todos os níveis:

### Provas Competitivas (4,5 km)
- **Canicross** - Corrida com cão (15:30) - 13,50€
- **Bikejoring** - Bicicleta puxada por cão (15:30) - 13,50€
- **Scooterjoring** - Trotinete puxada por cão (15:30) - 13,50€
- **Triciclo DR4** - Triciclo adaptado puxado por cão (15:30) - 13,50€

### Provas Não Competitivas (< 5 km)
- **Cãominhada** - Caminhada solidária com cão (17:00) - 5,00€ + Donativo em Género
- **Caminhada (sem cão)** - Caminhada solidária (17:00) - 5,00€ + Donativo em Género

## 🎯 Sobre o Evento

O 3º Canicross Espaço Animal é um evento de desportos de mushing (desportos puxados por cães) que decorre em trilhos naturais com mato e caminhos de terra secundários.

### Características:
- **Percurso:** Circuito único de aproximadamente 4,5 km
- **Terreno:** Trilhos em mato e caminhos de terra secundários
- **Partida:** Individual com cronometragem eletrónica
- **Ambiente:** Desportivo, familiar e comunitário

## 👥 Categorias e Idades

### Provas Competitivas:
- **Masculino e Feminino:** A partir dos 16 anos

### Caminhadas (Não Competitivas):
- **Todas as idades:** A partir dos 6 anos (acompanhados por adulto)

## 📝 Inscrições

**Prazo de Inscrição:** Até 13 de Janeiro de 2026 às 23:59  
**Preços:**
- Provas Competitivas: 13,50€
- Caminhadas: 5,00€ + Donativo em Género (ração, mantas, produtos)

**O donativo em género** reverte a favor de uma **Associação de Proteção Animal** local.

Inscreve-te em: [meutempo.pt](https://meutempo.pt/prova/canicross-espaco-animal-2026)

## 🎁 Kit de Participação

Todos os participantes recebem:
- 🎽 **Dorsal**
- 🎁 **Brinde da Prova**
- 🏅 **Prémio de Participação**
- ⏱️ **Cronometragem Eletrónica** (provas competitivas)
- 🛡️ **Seguro de Acidentes Pessoais**
- 🥤 **Abastecimentos** com sólidos e líquidos na chegada

## 🏆 Prémios

### Provas Competitivas:
- 🥇 **Top 3 Masculinos** - Troféus e prémios
- 🥇 **Top 3 Femininos** - Troféus e prémios
- 📊 **Classificação Geral** nas outras modalidades (se número insuficiente de atletas)

## 🐕 Controlo Veterinário

**Obrigatório para todas as modalidades competitivas:**
- Controlo veterinário antes da prova
- Local: No recinto, a partir das 14:00
- Documentação necessária: Boletim sanitário do cão atualizado

## 🚑 Apoio Médico e Veterinário

- 🏥 **Apoio Médico:** Presente no local durante todo o evento
- 🐕‍⚕️ **Apoio Veterinário:** Disponível para controlo e emergências

## 🏁 Horário do Evento

- **14:00** - Abertura do secretariado e controlo veterinário
- **15:30** - Início das provas competitivas (partidas individuais)
- **17:00** - Início da Caminhada Solidária
- **18:00** - Entrega de prémios (aproximadamente)

## 🎥 Fotografia e Vídeo

📸 Cobertura fotográfica e vídeo autorizada pela organização.

## 🌍 Taça de Portugal de Mushing

Este evento faz parte da **Taça de Portugal de Mushing 2025/2026**, uma competição nacional que reúne os melhores atletas de desportos puxados por cães.

## 📞 Contactos da Organização

**Telemóvel:** 918 860 289

## 👥 Organização

**Organizador:** Espaço Animal

**Apoios:** Câmara Municipal de Torres Vedras, Associações de Proteção Animal locais

---

**Nota Importante:** As caminhadas solidárias (Cãominhada e Caminhada sem cão) incluem um **donativo em género** (ração, mantas, produtos de higiene para animais) que será entregue a uma Associação de Proteção Animal local.

Vem desafiar-te com o teu melhor amigo de quatro patas! 🐕🏃‍♂️`,
      city: "Torres Vedras",
      metaTitle: "3º Canicross Espaço Animal 2026 | Mushing em Torres Vedras",
      metaDescription:
        "3ª edição do Canicross Espaço Animal. Evento de mushing com Canicross, Bikejoring, Scooterjoring, Triciclo DR4 e caminhadas solidárias. Percurso 4,5 km em trilhos naturais. 17 Janeiro 2026 em Torres Vedras.",
    },
    {
      language: "en",
      title: "3rd Canicross Animal Space",
      description: `# 🐕 3rd Canicross Animal Space 2026

Welcome to the **3rd edition of Canicross Animal Space**! An event dedicated to mushing sports in Torres Vedras, part of the **Portugal Mushing Cup 2025/2026**.

## 📅 Date and Location

**Date:** January 17, 2026  
**Start Time:** 15:30 (competitive races) | 17:00 (solidarity walk)  
**Location:** Restaurant O Camelo and Adjacent Lands, National Road 8-2, Vale da Borra, Torres Vedras  
**City:** Torres Vedras, Portugal

## 🏃‍♂️🐕 Available Races

The event offers 6 modalities for all levels:

### Competitive Races (4.5 km)
- **Canicross** - Running with dog (15:30) - €13.50
- **Bikejoring** - Bike pulled by dog (15:30) - €13.50
- **Scooterjoring** - Scooter pulled by dog (15:30) - €13.50
- **Triciclo DR4** - Adapted tricycle pulled by dog (15:30) - €13.50

### Non-Competitive Races (< 5 km)
- **Dog Walk** - Solidarity walk with dog (17:00) - €5.00 + In-Kind Donation
- **Walk (without dog)** - Solidarity walk (17:00) - €5.00 + In-Kind Donation

## 🎯 About the Event

The 3rd Canicross Animal Space is a mushing sports event (dog-powered sports) taking place on natural trails with brush and secondary dirt roads.

### Features:
- **Course:** Single loop of approximately 4.5 km
- **Terrain:** Trails through brush and secondary dirt roads
- **Start:** Individual with electronic timing
- **Atmosphere:** Sporty, family-friendly and community-oriented

## 👥 Categories and Ages

### Competitive Races:
- **Male and Female:** 16 years and older

### Walks (Non-Competitive):
- **All ages:** From 6 years old (accompanied by adult)

## 📝 Registration

**Registration Deadline:** Until January 13, 2026 at 23:59  
**Prices:**
- Competitive Races: €13.50
- Walks: €5.00 + In-Kind Donation (food, blankets, products)

**The in-kind donation** benefits a local **Animal Protection Association**.

Register at: [meutempo.pt](https://meutempo.pt/prova/canicross-espaco-animal-2026)

## 🎁 Participation Kit

All participants receive:
- 🎽 **Race Bib**
- 🎁 **Race Gift**
- 🏅 **Participation Prize**
- ⏱️ **Electronic Timing** (competitive races)
- 🛡️ **Personal Accident Insurance**
- 🥤 **Aid Stations** with solid and liquid refreshments at finish

## 🏆 Prizes

### Competitive Races:
- 🥇 **Top 3 Male** - Trophies and prizes
- 🥇 **Top 3 Female** - Trophies and prizes
- 📊 **General Classification** in other modalities (if insufficient number of athletes)

## 🐕 Veterinary Control

**Mandatory for all competitive modalities:**
- Veterinary control before race
- Location: At venue, from 14:00
- Required documentation: Updated dog health certificate

## 🚑 Medical and Veterinary Support

- 🏥 **Medical Support:** Present at venue throughout event
- 🐕‍⚕️ **Veterinary Support:** Available for control and emergencies

## 🏁 Event Schedule

- **14:00** - Opening of registration and veterinary control
- **15:30** - Start of competitive races (individual starts)
- **17:00** - Start of Solidarity Walk
- **18:00** - Prize ceremony (approximately)

## 🎥 Photography and Video

📸 Photography and video coverage authorized by organization.

## 🌍 Portugal Mushing Cup

This event is part of the **Portugal Mushing Cup 2025/2026**, a national competition gathering the best dog-powered sports athletes.

## 📞 Organization Contacts

**Mobile:** 918 860 289

## 👥 Organization

**Organizer:** Animal Space

**Support:** Torres Vedras Municipality, Local Animal Protection Associations

---

**Important Note:** The solidarity walks (Dog Walk and Walk without dog) include an **in-kind donation** (food, blankets, pet hygiene products) that will be delivered to a local Animal Protection Association.

Come challenge yourself with your four-legged best friend! 🐕🏃‍♂️`,
      city: "Torres Vedras",
      metaTitle: "3rd Canicross Animal Space 2026 | Mushing in Torres Vedras",
      metaDescription:
        "3rd edition of Canicross Animal Space. Mushing event with Canicross, Bikejoring, Scooterjoring, Triciclo DR4 and solidarity walks. 4.5 km course on natural trails. January 17, 2026 in Torres Vedras.",
    },
    {
      language: "es",
      title: "3º Canicross Espacio Animal",
      description: `# 🐕 3º Canicross Espacio Animal 2026

¡Bienvenidos a la **3ª edición del Canicross Espacio Animal**! Un evento dedicado a los deportes de mushing en Torres Vedras, parte de la **Copa de Portugal de Mushing 2025/2026**.

## 📅 Fecha y Ubicación

**Fecha:** 17 de enero de 2026  
**Hora de Inicio:** 15:30 (carreras competitivas) | 17:00 (caminata solidaria)  
**Ubicación:** Restaurante O Camelo y Terrenos Adyacentes, Carretera Nacional 8-2, Vale da Borra, Torres Vedras  
**Ciudad:** Torres Vedras, Portugal

## 🏃‍♂️🐕 Carreras Disponibles

El evento ofrece 6 modalidades para todos los niveles:

### Carreras Competitivas (4,5 km)
- **Canicross** - Carrera con perro (15:30) - 13,50€
- **Bikejoring** - Bicicleta tirada por perro (15:30) - 13,50€
- **Scooterjoring** - Patinete tirado por perro (15:30) - 13,50€
- **Triciclo DR4** - Triciclo adaptado tirado por perro (15:30) - 13,50€

### Carreras No Competitivas (< 5 km)
- **Caminata con Perro** - Caminata solidaria con perro (17:00) - 5,00€ + Donativo en Especie
- **Caminata (sin perro)** - Caminata solidaria (17:00) - 5,00€ + Donativo en Especie

## 🎯 Sobre el Evento

El 3º Canicross Espacio Animal es un evento de deportes de mushing (deportes tirados por perros) que se desarrolla en senderos naturales con matorral y caminos de tierra secundarios.

### Características:
- **Recorrido:** Circuito único de aproximadamente 4,5 km
- **Terreno:** Senderos en matorral y caminos de tierra secundarios
- **Salida:** Individual con cronometraje electrónico
- **Ambiente:** Deportivo, familiar y comunitario

## 👥 Categorías y Edades

### Carreras Competitivas:
- **Masculino y Femenino:** A partir de 16 años

### Caminatas (No Competitivas):
- **Todas las edades:** A partir de 6 años (acompañados por adulto)

## 📝 Inscripciones

**Plazo de Inscripción:** Hasta el 13 de enero de 2026 a las 23:59  
**Precios:**
- Carreras Competitivas: 13,50€
- Caminatas: 5,00€ + Donativo en Especie (pienso, mantas, productos)

**El donativo en especie** beneficia a una **Asociación de Protección Animal** local.

Inscríbete en: [meutempo.pt](https://meutempo.pt/prova/canicross-espaco-animal-2026)

## 🎁 Kit de Participación

Todos los participantes reciben:
- 🎽 **Dorsal**
- 🎁 **Regalo de la Carrera**
- 🏅 **Premio de Participación**
- ⏱️ **Cronometraje Electrónico** (carreras competitivas)
- 🛡️ **Seguro de Accidentes Personales**
- 🥤 **Avituallamientos** con sólidos y líquidos en la meta

## 🏆 Premios

### Carreras Competitivas:
- 🥇 **Top 3 Masculino** - Trofeos y premios
- 🥇 **Top 3 Femenino** - Trofeos y premios
- 📊 **Clasificación General** en otras modalidades (si número insuficiente de atletas)

## 🐕 Control Veterinario

**Obligatorio para todas las modalidades competitivas:**
- Control veterinario antes de la carrera
- Ubicación: En el recinto, desde las 14:00
- Documentación necesaria: Certificado sanitario del perro actualizado

## 🚑 Apoyo Médico y Veterinario

- 🏥 **Apoyo Médico:** Presente en el lugar durante todo el evento
- 🐕‍⚕️ **Apoyo Veterinario:** Disponible para control y emergencias

## 🏁 Horario del Evento

- **14:00** - Apertura de secretaría y control veterinario
- **15:30** - Inicio de las carreras competitivas (salidas individuales)
- **17:00** - Inicio de la Caminata Solidaria
- **18:00** - Entrega de premios (aproximadamente)

## 🎥 Fotografía y Vídeo

📸 Cobertura fotográfica y vídeo autorizada por la organización.

## 🌍 Copa de Portugal de Mushing

Este evento forma parte de la **Copa de Portugal de Mushing 2025/2026**, una competición nacional que reúne a los mejores atletas de deportes tirados por perros.

## 📞 Contactos de la Organización

**Teléfono:** 918 860 289

## 👥 Organización

**Organizador:** Espacio Animal

**Apoyo:** Ayuntamiento de Torres Vedras, Asociaciones de Protección Animal locales

---

**Nota Importante:** Las caminatas solidarias (Caminata con Perro y Caminata sin perro) incluyen un **donativo en especie** (pienso, mantas, productos de higiene para animales) que se entregará a una Asociación de Protección Animal local.

¡Ven a desafiarte con tu mejor amigo de cuatro patas! 🐕🏃‍♂️`,
      city: "Torres Vedras",
      metaTitle: "3º Canicross Espacio Animal 2026 | Mushing en Torres Vedras",
      metaDescription:
        "3ª edición del Canicross Espacio Animal. Evento de mushing con Canicross, Bikejoring, Scooterjoring, Triciclo DR4 y caminatas solidarias. Recorrido 4,5 km en senderos naturales. 17 enero 2026 en Torres Vedras.",
    },
    {
      language: "fr",
      title: "3ème Canicross Espace Animal",
      description: `# 🐕 3ème Canicross Espace Animal 2026

Bienvenue à la **3ème édition du Canicross Espace Animal** ! Un événement dédié aux sports de mushing à Torres Vedras, faisant partie de la **Coupe du Portugal de Mushing 2025/2026**.

## 📅 Date et Lieu

**Date :** 17 janvier 2026  
**Heure de Départ :** 15h30 (courses compétitives) | 17h00 (marche solidaire)  
**Lieu :** Restaurant O Camelo et Terrains Adjacents, Route Nationale 8-2, Vale da Borra, Torres Vedras  
**Ville :** Torres Vedras, Portugal

## 🏃‍♂️🐕 Courses Disponibles

L'événement propose 6 modalités pour tous les niveaux :

### Courses Compétitives (4,5 km)
- **Canicross** - Course avec chien (15h30) - 13,50€
- **Bikejoring** - Vélo tiré par chien (15h30) - 13,50€
- **Scooterjoring** - Trottinette tirée par chien (15h30) - 13,50€
- **Triciclo DR4** - Tricycle adapté tiré par chien (15h30) - 13,50€

### Courses Non Compétitives (< 5 km)
- **Marche avec Chien** - Marche solidaire avec chien (17h00) - 5,00€ + Don en Nature
- **Marche (sans chien)** - Marche solidaire (17h00) - 5,00€ + Don en Nature

## 🎯 À Propos de l'Événement

Le 3ème Canicross Espace Animal est un événement de sports de mushing (sports tractés par des chiens) se déroulant sur des sentiers naturels avec broussailles et chemins de terre secondaires.

### Caractéristiques :
- **Parcours :** Circuit unique d'environ 4,5 km
- **Terrain :** Sentiers dans les broussailles et chemins de terre secondaires
- **Départ :** Individuel avec chronométrage électronique
- **Ambiance :** Sportive, familiale et communautaire

## 👥 Catégories et Âges

### Courses Compétitives :
- **Masculin et Féminin :** À partir de 16 ans

### Marches (Non Compétitives) :
- **Tous les âges :** À partir de 6 ans (accompagnés par un adulte)

## 📝 Inscriptions

**Date Limite d'Inscription :** Jusqu'au 13 janvier 2026 à 23h59  
**Prix :**
- Courses Compétitives : 13,50€
- Marches : 5,00€ + Don en Nature (nourriture, couvertures, produits)

**Le don en nature** bénéficie à une **Association de Protection Animale** locale.

Inscrivez-vous sur : [meutempo.pt](https://meutempo.pt/prova/canicross-espaco-animal-2026)

## 🎁 Kit de Participation

Tous les participants reçoivent :
- 🎽 **Dossard**
- 🎁 **Cadeau de Course**
- 🏅 **Prix de Participation**
- ⏱️ **Chronométrage Électronique** (courses compétitives)
- 🛡️ **Assurance Accidents Personnels**
- 🥤 **Ravitaillements** avec solides et liquides à l'arrivée

## 🏆 Prix

### Courses Compétitives :
- 🥇 **Top 3 Masculin** - Trophées et prix
- 🥇 **Top 3 Féminin** - Trophées et prix
- 📊 **Classement Général** dans les autres modalités (si nombre insuffisant d'athlètes)

## 🐕 Contrôle Vétérinaire

**Obligatoire pour toutes les modalités compétitives :**
- Contrôle vétérinaire avant la course
- Lieu : Sur le site, à partir de 14h00
- Documentation nécessaire : Certificat sanitaire du chien à jour

## 🚑 Soutien Médical et Vétérinaire

- 🏥 **Soutien Médical :** Présent sur place tout au long de l'événement
- 🐕‍⚕️ **Soutien Vétérinaire :** Disponible pour contrôle et urgences

## 🏁 Horaire de l'Événement

- **14h00** - Ouverture du secrétariat et contrôle vétérinaire
- **15h30** - Début des courses compétitives (départs individuels)
- **17h00** - Début de la Marche Solidaire
- **18h00** - Remise des prix (approximativement)

## 🎥 Photographie et Vidéo

📸 Couverture photographique et vidéo autorisée par l'organisation.

## 🌍 Coupe du Portugal de Mushing

Cet événement fait partie de la **Coupe du Portugal de Mushing 2025/2026**, une compétition nationale rassemblant les meilleurs athlètes de sports tractés par des chiens.

## 📞 Contacts de l'Organisation

**Téléphone :** 918 860 289

## 👥 Organisation

**Organisateur :** Espace Animal

**Soutien :** Municipalité de Torres Vedras, Associations de Protection Animale locales

---

**Note Importante :** Les marches solidaires (Marche avec Chien et Marche sans chien) incluent un **don en nature** (nourriture, couvertures, produits d'hygiène pour animaux) qui sera remis à une Association de Protection Animale locale.

Venez vous défier avec votre meilleur ami à quatre pattes ! 🐕🏃‍♂️`,
      city: "Torres Vedras",
      metaTitle: "3ème Canicross Espace Animal 2026 | Mushing à Torres Vedras",
      metaDescription:
        "3ème édition du Canicross Espace Animal. Événement de mushing avec Canicross, Bikejoring, Scooterjoring, Triciclo DR4 et marches solidaires. Parcours 4,5 km sur sentiers naturels. 17 janvier 2026 à Torres Vedras.",
    },
    {
      language: "de",
      title: "3. Canicross Tierraum",
      description: `# 🐕 3. Canicross Tierraum 2026

Willkommen zur **3. Ausgabe des Canicross Tierraum**! Eine Veranstaltung für Mushing-Sportarten in Torres Vedras, Teil des **Portugal Mushing Cup 2025/2026**.

## 📅 Datum und Ort

**Datum:** 17. Januar 2026  
**Startzeit:** 15:30 (Wettbewerbsrennen) | 17:00 (Solidaritätswanderung)  
**Ort:** Restaurant O Camelo und Angrenzende Grundstücke, Nationalstraße 8-2, Vale da Borra, Torres Vedras  
**Stadt:** Torres Vedras, Portugal

## 🏃‍♂️🐕 Verfügbare Rennen

Die Veranstaltung bietet 6 Modalitäten für alle Niveaus:

### Wettbewerbsrennen (4,5 km)
- **Canicross** - Laufen mit Hund (15:30) - 13,50€
- **Bikejoring** - Fahrrad gezogen von Hund (15:30) - 13,50€
- **Scooterjoring** - Roller gezogen von Hund (15:30) - 13,50€
- **Triciclo DR4** - Angepasstes Dreirad gezogen von Hund (15:30) - 13,50€

### Nicht-Wettbewerbsrennen (< 5 km)
- **Hundewanderung** - Solidaritätswanderung mit Hund (17:00) - 5,00€ + Sachspende
- **Wanderung (ohne Hund)** - Solidaritätswanderung (17:00) - 5,00€ + Sachspende

## 🎯 Über die Veranstaltung

Der 3. Canicross Tierraum ist eine Mushing-Sportveranstaltung (von Hunden gezogene Sportarten), die auf natürlichen Pfaden mit Gestrüpp und sekundären Feldwegen stattfindet.

### Merkmale:
- **Strecke:** Einzelschleife von ca. 4,5 km
- **Gelände:** Pfade durch Gestrüpp und sekundäre Feldwege
- **Start:** Einzeln mit elektronischer Zeitmessung
- **Atmosphäre:** Sportlich, familienfreundlich und gemeinschaftsorientiert

## 👥 Kategorien und Alter

### Wettbewerbsrennen:
- **Männlich und Weiblich:** Ab 16 Jahren

### Wanderungen (Nicht-Wettbewerb):
- **Alle Altersgruppen:** Ab 6 Jahren (begleitet von Erwachsenen)

## 📝 Anmeldung

**Anmeldeschluss:** Bis 13. Januar 2026 um 23:59  
**Preise:**
- Wettbewerbsrennen: 13,50€
- Wanderungen: 5,00€ + Sachspende (Futter, Decken, Produkte)

**Die Sachspende** kommt einem lokalen **Tierschutzverein** zugute.

Anmeldung unter: [meutempo.pt](https://meutempo.pt/prova/canicross-espaco-animal-2026)

## 🎁 Teilnahme-Kit

Alle Teilnehmer erhalten:
- 🎽 **Startnummer**
- 🎁 **Renngeschenk**
- 🏅 **Teilnahmepreis**
- ⏱️ **Elektronische Zeitmessung** (Wettbewerbsrennen)
- 🛡️ **Unfallversicherung**
- 🥤 **Verpflegungsstationen** mit festen und flüssigen Erfrischungen im Ziel

## 🏆 Preise

### Wettbewerbsrennen:
- 🥇 **Top 3 Männlich** - Trophäen und Preise
- 🥇 **Top 3 Weiblich** - Trophäen und Preise
- 📊 **Gesamtwertung** in anderen Modalitäten (bei unzureichender Athletenzahl)

## 🐕 Tierärztliche Kontrolle

**Obligatorisch für alle Wettbewerbsmodalitäten:**
- Tierärztliche Kontrolle vor dem Rennen
- Ort: Am Veranstaltungsort, ab 14:00
- Erforderliche Dokumentation: Aktualisiertes Gesundheitszertifikat des Hundes

## 🚑 Medizinische und Tierärztliche Unterstützung

- 🏥 **Medizinische Unterstützung:** Während der gesamten Veranstaltung vor Ort
- 🐕‍⚕️ **Tierärztliche Unterstützung:** Für Kontrolle und Notfälle verfügbar

## 🏁 Veranstaltungsplan

- **14:00** - Eröffnung der Anmeldung und tierärztliche Kontrolle
- **15:30** - Start der Wettbewerbsrennen (Einzelstarts)
- **17:00** - Start der Solidaritätswanderung
- **18:00** - Preisverleihung (ungefähr)

## 🎥 Fotografie und Video

📸 Foto- und Videoberichterstattung von der Organisation autorisiert.

## 🌍 Portugal Mushing Cup

Diese Veranstaltung ist Teil des **Portugal Mushing Cup 2025/2026**, einer nationalen Wettbewerbsreihe mit den besten Athleten der von Hunden gezogenen Sportarten.

## 📞 Kontakte der Organisation

**Telefon:** 918 860 289

## 👥 Organisation

**Veranstalter:** Tierraum

**Unterstützung:** Gemeinde Torres Vedras, lokale Tierschutzvereine

---

**Wichtiger Hinweis:** Die Solidaritätswanderungen (Hundewanderung und Wanderung ohne Hund) beinhalten eine **Sachspende** (Futter, Decken, Tierhygiene-Produkte), die einem lokalen Tierschutzverein übergeben wird.

Fordere dich mit deinem vierbeinigen besten Freund heraus! 🐕🏃‍♂️`,
      city: "Torres Vedras",
      metaTitle: "3. Canicross Tierraum 2026 | Mushing in Torres Vedras",
      metaDescription:
        "3. Ausgabe des Canicross Tierraum. Mushing-Veranstaltung mit Canicross, Bikejoring, Scooterjoring, Triciclo DR4 und Solidaritätswanderungen. 4,5 km Strecke auf natürlichen Pfaden. 17. Januar 2026 in Torres Vedras.",
    },
    {
      language: "it",
      title: "3º Canicross Spazio Animale",
      description: `# 🐕 3º Canicross Spazio Animale 2026

Benvenuti alla **3ª edizione del Canicross Spazio Animale**! Un evento dedicato agli sport di mushing a Torres Vedras, parte della **Coppa del Portogallo di Mushing 2025/2026**.

## 📅 Data e Luogo

**Data:** 17 gennaio 2026  
**Orario di Partenza:** 15:30 (gare competitive) | 17:00 (camminata solidale)  
**Luogo:** Ristorante O Camelo e Terreni Adiacenti, Strada Nazionale 8-2, Vale da Borra, Torres Vedras  
**Città:** Torres Vedras, Portogallo

## 🏃‍♂️🐕 Gare Disponibili

L'evento offre 6 modalità per tutti i livelli:

### Gare Competitive (4,5 km)
- **Canicross** - Corsa con cane (15:30) - 13,50€
- **Bikejoring** - Bici trainata da cane (15:30) - 13,50€
- **Scooterjoring** - Monopattino trainato da cane (15:30) - 13,50€
- **Triciclo DR4** - Triciclo adattato trainato da cane (15:30) - 13,50€

### Gare Non Competitive (< 5 km)
- **Camminata con Cane** - Camminata solidale con cane (17:00) - 5,00€ + Donazione in Natura
- **Camminata (senza cane)** - Camminata solidale (17:00) - 5,00€ + Donazione in Natura

## 🎯 Informazioni sull'Evento

Il 3º Canicross Spazio Animale è un evento di sport di mushing (sport trainati da cani) che si svolge su sentieri naturali con macchia e strade sterrate secondarie.

### Caratteristiche:
- **Percorso:** Circuito unico di circa 4,5 km
- **Terreno:** Sentieri nella macchia e strade sterrate secondarie
- **Partenza:** Individuale con cronometraggio elettronico
- **Atmosfera:** Sportiva, familiare e comunitaria

## 👥 Categorie ed Età

### Gare Competitive:
- **Maschile e Femminile:** Dai 16 anni in su

### Camminate (Non Competitive):
- **Tutte le età:** Dai 6 anni in su (accompagnati da adulto)

## 📝 Iscrizioni

**Scadenza Iscrizioni:** Fino al 13 gennaio 2026 alle 23:59  
**Prezzi:**
- Gare Competitive: 13,50€
- Camminate: 5,00€ + Donazione in Natura (cibo, coperte, prodotti)

**La donazione in natura** va a beneficio di un'**Associazione di Protezione Animale** locale.

Iscriviti su: [meutempo.pt](https://meutempo.pt/prova/canicross-espaco-animal-2026)

## 🎁 Kit di Partecipazione

Tutti i partecipanti ricevono:
- 🎽 **Pettorale**
- 🎁 **Regalo della Gara**
- 🏅 **Premio di Partecipazione**
- ⏱️ **Cronometraggio Elettronico** (gare competitive)
- 🛡️ **Assicurazione Infortuni Personali**
- 🥤 **Ristori** con solidi e liquidi all'arrivo

## 🏆 Premi

### Gare Competitive:
- 🥇 **Top 3 Maschile** - Trofei e premi
- 🥇 **Top 3 Femminile** - Trofei e premi
- 📊 **Classifica Generale** nelle altre modalità (se numero insufficiente di atleti)

## 🐕 Controllo Veterinario

**Obbligatorio per tutte le modalità competitive:**
- Controllo veterinario prima della gara
- Luogo: Al sito, dalle 14:00
- Documentazione necessaria: Certificato sanitario del cane aggiornato

## 🚑 Supporto Medico e Veterinario

- 🏥 **Supporto Medico:** Presente sul posto durante tutto l'evento
- 🐕‍⚕️ **Supporto Veterinario:** Disponibile per controllo ed emergenze

## 🏁 Programma dell'Evento

- **14:00** - Apertura segreteria e controllo veterinario
- **15:30** - Inizio gare competitive (partenze individuali)
- **17:00** - Inizio Camminata Solidale
- **18:00** - Premiazione (circa)

## 🎥 Fotografia e Video

📸 Copertura fotografica e video autorizzata dall'organizzazione.

## 🌍 Coppa del Portogallo di Mushing

Questo evento fa parte della **Coppa del Portogallo di Mushing 2025/2026**, una competizione nazionale che riunisce i migliori atleti degli sport trainati da cani.

## 📞 Contatti dell'Organizzazione

**Telefono:** 918 860 289

## 👥 Organizzazione

**Organizzatore:** Spazio Animale

**Supporto:** Comune di Torres Vedras, Associazioni di Protezione Animale locali

---

**Nota Importante:** Le camminate solidali (Camminata con Cane e Camminata senza cane) includono una **donazione in natura** (cibo, coperte, prodotti di igiene per animali) che sarà consegnata a un'Associazione di Protezione Animale locale.

Vieni a metterti alla prova con il tuo migliore amico a quattro zampe! 🐕🏃‍♂️`,
      city: "Torres Vedras",
      metaTitle: "3º Canicross Spazio Animale 2026 | Mushing a Torres Vedras",
      metaDescription:
        "3ª edizione del Canicross Spazio Animale. Evento di mushing con Canicross, Bikejoring, Scooterjoring, Triciclo DR4 e camminate solidali. Percorso 4,5 km su sentieri naturali. 17 gennaio 2026 a Torres Vedras.",
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

  // Step 3: Find or create variants
  const variants = [
    {
      name: "Canicross",
      distanceKm: 4.5,
      price: 13.5,
      startTime: "15:30",
    },
    {
      name: "Bikejoring",
      distanceKm: 4.5,
      price: 13.5,
      startTime: "15:30",
    },
    {
      name: "Scooterjoring",
      distanceKm: 4.5,
      price: 13.5,
      startTime: "15:30",
    },
    {
      name: "Triciclo DR4",
      distanceKm: 4.5,
      price: 13.5,
      startTime: "15:30",
    },
    {
      name: "Cãominhada",
      distanceKm: 5,
      price: 5.0,
      startTime: "17:00",
    },
    {
      name: "Caminhada (sem cão)",
      distanceKm: 5,
      price: 5.0,
      startTime: "17:00",
    },
  ];

  for (const variantData of variants) {
    const existing = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: variantData.name,
      },
    });

    let variant;
    if (existing) {
      variant = await prisma.eventVariant.update({
        where: { id: existing.id },
        data: {
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    } else {
      variant = await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name: variantData.name,
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    }

    console.log(
      `✅ Variant ${existing ? "updated" : "created"}: ${variant.name}`
    );
  }

  console.log("");
  console.log("🎉 3º Canicross Espaço Animal 2026 seeded successfully!");
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
