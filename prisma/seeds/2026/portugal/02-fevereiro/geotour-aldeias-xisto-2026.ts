/**
 * Seed: Geotour Aldeias do Xisto 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 * Multi-day BTT event with prologue and 2 stages
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding Geotour Aldeias do Xisto 2026...");

  const eventSlug = "geotour-aldeias-xisto-2026";

  // Step 1: Upsert the event (NO delete operations)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Geotour Aldeias do Xisto",
      description:
        "Prova de resistência em autonomia e orientada por GPS pelas Aldeias do Xisto. 3 dias épicos no Fundão com prólogo opcional e 2 etapas desafiantes.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-02-20T14:00:00.000Z"),
      endDate: new Date("2026-02-22T18:00:00.000Z"),
      city: "Fundão",
      country: "Portugal",
      latitude: 40.1411,
      longitude: -7.5014,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Fund%C3%A3o+Castelo+Branco+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4043/info",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-15T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Geotour Aldeias do Xisto",
      description:
        "Prova de resistência em autonomia e orientada por GPS pelas Aldeias do Xisto. 3 dias épicos no Fundão com prólogo opcional e 2 etapas desafiantes.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-02-20T14:00:00.000Z"),
      endDate: new Date("2026-02-22T18:00:00.000Z"),
      city: "Fundão",
      country: "Portugal",
      latitude: 40.1411,
      longitude: -7.5014,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Fund%C3%A3o+Castelo+Branco+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4043/info",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-15T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 2: Create translations for ALL 6 LANGUAGES
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
      title: "Geotour Aldeias do Xisto",
      city: "Fundão",
      metaTitle:
        "Geotour Aldeias do Xisto 2026 | Fundão, Castelo Branco | 20-22 Fevereiro",
      metaDescription:
        "Geotour Aldeias do Xisto 2026 - 20 a 22 de fevereiro no Fundão. Prova de resistência BTT orientada por GPS com prólogo (5-6km) + Etapa 1 (75km, 2150D+) + Etapa 2 (67km, 1950D+). Inscrições até 15 fevereiro.",
      description: `# 🚴 Geotour Aldeias do Xisto 2026

O **Geotour Aldeias do Xisto** é uma prova de resistência em **BTT** com orientação por GPS pelas magníficas **Aldeias do Xisto**. Organizado pela **ACF – Btt Gardunha** e promovido pela **Câmara Municipal do Fundão**.

## 📅 Datas e Formato

- **20 de Fevereiro (Sexta):** Prólogo opcional (~5-6 km) à tarde
- **21 de Fevereiro (Sábado):** Etapa 1 (70-80 km, 2000-2300m D+)
- **22 de Fevereiro (Domingo):** Etapa 2 (60-75 km, 1800-2100m D+)

## 🚴 Modalidades

### Solo
Participação individual em todas as etapas. Prova exigente que requer boa preparação física e domínio técnico.

### Solo eBikes
Participação individual com bicicleta elétrica. **Sem classificação oficial**, mas com toda a experiência do evento.

### Duplas
Participação em dupla com **classificação pela soma dos tempos do segundo atleta** de cada etapa. As duplas devem circular juntas durante toda a prova (intervalo máximo de 1 minuto nos controlos de passagem).

## 🏔️ Percursos

| Etapa | Distância | Desnível Positivo |
|-------|-----------|-------------------|
| **Prólogo** (opcional) | 5-6 km | 150-200m D+ |
| **Etapa 1** | 70-80 km | 2000-2300m D+ |
| **Etapa 2** | 60-75 km | 1800-2100m D+ |

**Nota:** O prólogo é opcional. Quem não participar sai na Etapa 1 com 4 minutos de atraso, quem participar sai com até 2 minutos de atraso.

## 🎁 A Inscrição Inclui

- ✅ Seguro de acidentes pessoais (34.080€ morte/invalidez)
- ✅ Frontal com número de participante
- ✅ Chip de cronometragem eletrónico
- ✅ Brinde do evento e medalha de Finisher
- ✅ Abastecimentos líquidos e sólidos durante as etapas
- ✅ Jantar volante (Sábado 21, final Etapa 1)
- ✅ Almoço volante (Domingo 22, final Etapa 2)
- ✅ Banhos no final das etapas
- ✅ Local para lavagem de bicicletas
- ✅ Massagens no final da Etapa 1
- ✅ Assistência médica e primeiros socorros

## ⚙️ Equipamento Obrigatório

- 🪖 Capacete homologado (obrigatório durante toda a prova)
- 📱 Telemóvel com bateria carregada
- 📍 GPS com tracks fornecidos pela organização + pilhas/bateria suplentes
- 🆔 Documento de identificação

## 🏁 Controlos de Passagem

A prova tem **controlos de passagem secretos** com limites de tempo. Quem ultrapassar o limite será transportado pela "vassoura" ou receberá indicações para chegar de forma segura.

## 🍽️ Refeições Incluídas

- **Sábado (final Etapa 1):** Jantar volante
- **Domingo (final Etapa 2):** Almoço volante

## 🏆 Categorias

### Solos
- Elite Masculino (até 34 anos)
- Masters Masculinos (35-49 anos)
- Veteranos Masculinos (50+ anos)
- Elite Feminino (até 34 anos)
- Master Feminino (35-49 anos)

### Duplas
- Escalão único (independente da idade)

**Nota:** Categorias com menos de 5 atletas transitam para o escalão inferior.

## 📞 Contactos

- **Telemóvel:** 966 510 444
- **Website:** [www.geotour.pt](http://www.geotour.pt)

## ⚠️ Regulamento

- Prova em **estradas abertas ao trânsito** - respeita o Código da Estrada
- Participação por **conta e risco** do atleta
- É **obrigatório** comunicar desistências à organização
- Proibido uso de auscultadores durante a prova
- Permitida assistência médica da organização ao longo do percurso`,
    },
    {
      language: "en",
      title: "Geotour Schist Villages",
      city: "Fundão",
      metaTitle:
        "Geotour Schist Villages 2026 | Fundão, Castelo Branco | Feb 20-22",
      metaDescription:
        "Geotour Schist Villages 2026 - February 20-22 in Fundão. GPS-guided MTB endurance race with prologue (5-6km) + Stage 1 (75km, 2150D+) + Stage 2 (67km, 1950D+). Registration until Feb 15.",
      description: `# 🚴 Geotour Schist Villages 2026

**Geotour Schist Villages** is a GPS-guided **MTB** endurance race through the magnificent **Schist Villages**. Organized by **ACF – Btt Gardunha** and promoted by **Fundão City Council**.

## 📅 Dates and Format

- **February 20 (Friday):** Optional prologue (~5-6 km) in the afternoon
- **February 21 (Saturday):** Stage 1 (70-80 km, 2000-2300m D+)
- **February 22 (Sunday):** Stage 2 (60-75 km, 1800-2100m D+)

## 🚴 Categories

### Solo
Individual participation in all stages. Demanding race requiring good physical preparation and technical skills.

### Solo eBikes
Individual participation with electric bike. **No official ranking**, but full event experience included.

### Pairs
Participation in pairs with **ranking based on the sum of the second rider's times** in each stage. Pairs must ride together throughout the race (maximum 1-minute interval at checkpoints).

## 🏔️ Routes

| Stage | Distance | Elevation Gain |
|-------|----------|----------------|
| **Prologue** (optional) | 5-6 km | 150-200m D+ |
| **Stage 1** | 70-80 km | 2000-2300m D+ |
| **Stage 2** | 60-75 km | 1800-2100m D+ |

**Note:** Prologue is optional. Non-participants start Stage 1 with 4 minutes delay, participants start with up to 2 minutes delay.

## 🎁 Registration Includes

- ✅ Personal accident insurance (€34,080 death/disability)
- ✅ Number plate
- ✅ Electronic timing chip
- ✅ Event gift and Finisher medal
- ✅ Liquid and solid refreshments during stages
- ✅ Dinner (Saturday 21, end of Stage 1)
- ✅ Lunch (Sunday 22, end of Stage 2)
- ✅ Showers at the end of stages
- ✅ Bike washing area
- ✅ Massages at the end of Stage 1
- ✅ Medical assistance and first aid

## ⚙️ Mandatory Equipment

- 🪖 Approved helmet (mandatory throughout the race)
- 📱 Mobile phone with charged battery
- 📍 GPS with organization's tracks + spare batteries
- 🆔 ID document

## 🏁 Checkpoints

The race has **secret checkpoints** with time limits. Those exceeding limits will be transported by the "broom wagon" or receive safe arrival instructions.

## 🍽️ Meals Included

- **Saturday (end of Stage 1):** Dinner
- **Sunday (end of Stage 2):** Lunch

## 🏆 Categories

### Solo
- Elite Men (up to 34 years)
- Masters Men (35-49 years)
- Veterans Men (50+ years)
- Elite Women (up to 34 years)
- Master Women (35-49 years)

### Pairs
- Single category (age independent)

**Note:** Categories with less than 5 athletes move to lower category.

## 📞 Contacts

- **Phone:** +351 966 510 444
- **Website:** [www.geotour.pt](http://www.geotour.pt)

## ⚠️ Regulations

- Race on **open roads** - respect traffic rules
- Participation at **participant's own risk**
- **Mandatory** to communicate withdrawals to organization
- Headphones prohibited during race
- Medical assistance available along the route`,
    },
    {
      language: "es",
      title: "Geotour Aldeas del Xisto",
      city: "Fundão",
      metaTitle:
        "Geotour Aldeas del Xisto 2026 | Fundão, Castelo Branco | 20-22 Feb",
      metaDescription:
        "Geotour Aldeas del Xisto 2026 - 20 a 22 de febrero en Fundão. Prueba de resistencia BTT guiada por GPS con prólogo (5-6km) + Etapa 1 (75km, 2150D+) + Etapa 2 (67km, 1950D+). Inscripciones hasta el 15 de febrero.",
      description: `# 🚴 Geotour Aldeas del Xisto 2026

El **Geotour Aldeas del Xisto** es una prueba de resistencia en **BTT** guiada por GPS a través de las magníficas **Aldeas del Xisto**. Organizado por **ACF – Btt Gardunha** y promovido por el **Ayuntamiento de Fundão**.

## 📅 Fechas y Formato

- **20 de Febrero (Viernes):** Prólogo opcional (~5-6 km) por la tarde
- **21 de Febrero (Sábado):** Etapa 1 (70-80 km, 2000-2300m D+)
- **22 de Febrero (Domingo):** Etapa 2 (60-75 km, 1800-2100m D+)

## 🚴 Modalidades

### Solo
Participación individual en todas las etapas. Prueba exigente que requiere buena preparación física y dominio técnico.

### Solo eBikes
Participación individual con bicicleta eléctrica. **Sin clasificación oficial**, pero con toda la experiencia del evento.

### Parejas
Participación en pareja con **clasificación por la suma de los tiempos del segundo ciclista** de cada etapa. Las parejas deben circular juntas durante toda la prueba (intervalo máximo de 1 minuto en los controles de paso).

## 🏔️ Recorridos

| Etapa | Distancia | Desnivel Positivo |
|-------|-----------|-------------------|
| **Prólogo** (opcional) | 5-6 km | 150-200m D+ |
| **Etapa 1** | 70-80 km | 2000-2300m D+ |
| **Etapa 2** | 60-75 km | 1800-2100m D+ |

**Nota:** El prólogo es opcional. Quienes no participen salen en la Etapa 1 con 4 minutos de retraso, quienes participen salen con hasta 2 minutos de retraso.

## 🎁 La Inscripción Incluye

- ✅ Seguro de accidentes personales (34.080€ muerte/invalidez)
- ✅ Dorsal con número de participante
- ✅ Chip de cronometraje electrónico
- ✅ Regalo del evento y medalla de Finisher
- ✅ Avituallamientos líquidos y sólidos durante las etapas
- ✅ Cena (Sábado 21, final Etapa 1)
- ✅ Almuerzo (Domingo 22, final Etapa 2)
- ✅ Duchas al final de las etapas
- ✅ Zona de lavado de bicicletas
- ✅ Masajes al final de la Etapa 1
- ✅ Asistencia médica y primeros auxilios

## ⚙️ Equipamiento Obligatorio

- 🪖 Casco homologado (obligatorio durante toda la prueba)
- 📱 Teléfono móvil con batería cargada
- 📍 GPS con tracks proporcionados por la organización + pilas/batería de repuesto
- 🆔 Documento de identificación

## 🏁 Controles de Paso

La prueba tiene **controles de paso secretos** con límites de tiempo. Quienes superen el límite serán transportados por la "escoba" o recibirán indicaciones para llegar de forma segura.

## 🍽️ Comidas Incluidas

- **Sábado (final Etapa 1):** Cena
- **Domingo (final Etapa 2):** Almuerzo

## 🏆 Categorías

### Solos
- Elite Masculino (hasta 34 años)
- Masters Masculinos (35-49 años)
- Veteranos Masculinos (50+ años)
- Elite Femenino (hasta 34 años)
- Master Femenino (35-49 años)

### Parejas
- Categoría única (independiente de la edad)

**Nota:** Categorías con menos de 5 atletas transitan a la categoría inferior.

## 📞 Contactos

- **Teléfono:** +351 966 510 444
- **Website:** [www.geotour.pt](http://www.geotour.pt)

## ⚠️ Reglamento

- Prueba en **carreteras abiertas al tráfico** - respeta el Código de Circulación
- Participación por **cuenta y riesgo** del atleta
- Es **obligatorio** comunicar abandonos a la organización
- Prohibido uso de auriculares durante la prueba
- Asistencia médica disponible a lo largo del recorrido`,
    },
    {
      language: "fr",
      title: "Geotour Villages de Schiste",
      city: "Fundão",
      metaTitle:
        "Geotour Villages de Schiste 2026 | Fundão, Castelo Branco | 20-22 Fév",
      metaDescription:
        "Geotour Villages de Schiste 2026 - 20 au 22 février à Fundão. Course d'endurance VTT guidée par GPS avec prologue (5-6km) + Étape 1 (75km, 2150D+) + Étape 2 (67km, 1950D+). Inscriptions jusqu'au 15 février.",
      description: `# 🚴 Geotour Villages de Schiste 2026

Le **Geotour Villages de Schiste** est une course d'endurance en **VTT** guidée par GPS à travers les magnifiques **Villages de Schiste**. Organisé par **ACF – Btt Gardunha** et promu par la **Mairie de Fundão**.

## 📅 Dates et Format

- **20 Février (Vendredi):** Prologue optionnel (~5-6 km) l'après-midi
- **21 Février (Samedi):** Étape 1 (70-80 km, 2000-2300m D+)
- **22 Février (Dimanche):** Étape 2 (60-75 km, 1800-2100m D+)

## 🚴 Modalités

### Solo
Participation individuelle à toutes les étapes. Course exigeante nécessitant une bonne préparation physique et des compétences techniques.

### Solo eBikes
Participation individuelle avec vélo électrique. **Pas de classement officiel**, mais expérience complète de l'événement.

### Binômes
Participation en binôme avec **classement basé sur la somme des temps du deuxième cycliste** de chaque étape. Les binômes doivent rouler ensemble pendant toute la course (intervalle maximum de 1 minute aux points de contrôle).

## 🏔️ Parcours

| Étape | Distance | Dénivelé Positif |
|-------|----------|------------------|
| **Prologue** (optionnel) | 5-6 km | 150-200m D+ |
| **Étape 1** | 70-80 km | 2000-2300m D+ |
| **Étape 2** | 60-75 km | 1800-2100m D+ |

**Note:** Le prologue est optionnel. Les non-participants démarrent l'Étape 1 avec 4 minutes de retard, les participants avec jusqu'à 2 minutes de retard.

## 🎁 L'Inscription Comprend

- ✅ Assurance accidents personnels (34.080€ décès/invalidité)
- ✅ Dossard avec numéro de participant
- ✅ Puce de chronométrage électronique
- ✅ Cadeau de l'événement et médaille de Finisher
- ✅ Ravitaillements liquides et solides pendant les étapes
- ✅ Dîner (Samedi 21, fin de l'Étape 1)
- ✅ Déjeuner (Dimanche 22, fin de l'Étape 2)
- ✅ Douches à la fin des étapes
- ✅ Zone de lavage de vélos
- ✅ Massages à la fin de l'Étape 1
- ✅ Assistance médicale et premiers secours

## ⚙️ Équipement Obligatoire

- 🪖 Casque homologué (obligatoire pendant toute la course)
- 📱 Téléphone portable avec batterie chargée
- 📍 GPS avec traces fournies par l'organisation + piles/batterie de rechange
- 🆔 Pièce d'identité

## 🏁 Points de Contrôle

La course a des **points de contrôle secrets** avec limites de temps. Ceux qui dépassent les limites seront transportés par le "balai" ou recevront des instructions d'arrivée sécurisée.

## 🍽️ Repas Inclus

- **Samedi (fin de l'Étape 1):** Dîner
- **Dimanche (fin de l'Étape 2):** Déjeuner

## 🏆 Catégories

### Solo
- Elite Hommes (jusqu'à 34 ans)
- Masters Hommes (35-49 ans)
- Vétérans Hommes (50+ ans)
- Elite Femmes (jusqu'à 34 ans)
- Master Femmes (35-49 ans)

### Binômes
- Catégorie unique (âge indépendant)

**Note:** Catégories avec moins de 5 athlètes passent à la catégorie inférieure.

## 📞 Contacts

- **Téléphone:** +351 966 510 444
- **Site web:** [www.geotour.pt](http://www.geotour.pt)

## ⚠️ Règlement

- Course sur **routes ouvertes** - respectez le code de la route
- Participation aux **risques du participant**
- **Obligatoire** de communiquer les abandons à l'organisation
- Écouteurs interdits pendant la course
- Assistance médicale disponible le long du parcours`,
    },
    {
      language: "de",
      title: "Geotour Schieferdörfer",
      city: "Fundão",
      metaTitle:
        "Geotour Schieferdörfer 2026 | Fundão, Castelo Branco | 20-22 Feb",
      metaDescription:
        "Geotour Schieferdörfer 2026 - 20. bis 22. Februar in Fundão. GPS-geführtes MTB-Langstreckenrennen mit Prolog (5-6km) + Etappe 1 (75km, 2150Hm) + Etappe 2 (67km, 1950Hm). Anmeldung bis 15. Februar.",
      description: `# 🚴 Geotour Schieferdörfer 2026

Die **Geotour Schieferdörfer** ist ein GPS-geführtes **MTB**-Langstreckenrennen durch die herrlichen **Schieferdörfer**. Organisiert von **ACF – Btt Gardunha** und gefördert vom **Stadtrat Fundão**.

## 📅 Termine und Format

- **20. Februar (Freitag):** Optionaler Prolog (~5-6 km) am Nachmittag
- **21. Februar (Samstag):** Etappe 1 (70-80 km, 2000-2300m Hm)
- **22. Februar (Sonntag):** Etappe 2 (60-75 km, 1800-2100m Hm)

## 🚴 Kategorien

### Solo
Einzelteilnahme an allen Etappen. Anspruchsvolles Rennen, das gute körperliche Vorbereitung und technische Fähigkeiten erfordert.

### Solo eBikes
Einzelteilnahme mit Elektrofahrrad. **Keine offizielle Wertung**, aber volles Event-Erlebnis inklusive.

### Paare
Teilnahme zu zweit mit **Wertung basierend auf der Summe der Zeiten des zweiten Fahrers** jeder Etappe. Paare müssen während des gesamten Rennens zusammen fahren (maximales Intervall von 1 Minute an Kontrollpunkten).

## 🏔️ Strecken

| Etappe | Distanz | Höhenunterschied |
|--------|---------|------------------|
| **Prolog** (optional) | 5-6 km | 150-200m Hm |
| **Etappe 1** | 70-80 km | 2000-2300m Hm |
| **Etappe 2** | 60-75 km | 1800-2100m Hm |

**Hinweis:** Prolog ist optional. Nicht-Teilnehmer starten Etappe 1 mit 4 Minuten Verzögerung, Teilnehmer mit bis zu 2 Minuten Verzögerung.

## 🎁 Die Anmeldung Beinhaltet

- ✅ Persönliche Unfallversicherung (34.080€ Tod/Invalidität)
- ✅ Startnummer
- ✅ Elektronischer Zeitmess-Chip
- ✅ Event-Geschenk und Finisher-Medaille
- ✅ Flüssige und feste Verpflegung während der Etappen
- ✅ Abendessen (Samstag 21, Ende Etappe 1)
- ✅ Mittagessen (Sonntag 22, Ende Etappe 2)
- ✅ Duschen am Ende der Etappen
- ✅ Fahrradwaschbereich
- ✅ Massagen am Ende der Etappe 1
- ✅ Medizinische Hilfe und Erste Hilfe

## ⚙️ Obligatorische Ausrüstung

- 🪖 Zugelassener Helm (Pflicht während des gesamten Rennens)
- 📱 Mobiltelefon mit aufgeladener Batterie
- 📍 GPS mit von der Organisation bereitgestellten Tracks + Ersatzbatterien
- 🆔 Ausweisdokument

## 🏁 Kontrollpunkte

Das Rennen hat **geheime Kontrollpunkte** mit Zeitlimits. Wer die Limits überschreitet, wird vom "Besenwagen" transportiert oder erhält sichere Ankunftsanweisungen.

## 🍽️ Enthaltene Mahlzeiten

- **Samstag (Ende Etappe 1):** Abendessen
- **Sonntag (Ende Etappe 2):** Mittagessen

## 🏆 Kategorien

### Solo
- Elite Männer (bis 34 Jahre)
- Masters Männer (35-49 Jahre)
- Veteranen Männer (50+ Jahre)
- Elite Frauen (bis 34 Jahre)
- Master Frauen (35-49 Jahre)

### Paare
- Einheitliche Kategorie (altersunabhängig)

**Hinweis:** Kategorien mit weniger als 5 Athleten wechseln zur niedrigeren Kategorie.

## 📞 Kontakte

- **Telefon:** +351 966 510 444
- **Website:** [www.geotour.pt](http://www.geotour.pt)

## ⚠️ Regeln

- Rennen auf **offenen Straßen** - Verkehrsregeln beachten
- Teilnahme auf **eigenes Risiko**
- **Pflicht** Rücktritte der Organisation mitzuteilen
- Kopfhörer während des Rennens verboten
- Medizinische Hilfe entlang der Strecke verfügbar`,
    },
    {
      language: "it",
      title: "Geotour Villaggi di Scisto",
      city: "Fundão",
      metaTitle:
        "Geotour Villaggi di Scisto 2026 | Fundão, Castelo Branco | 20-22 Feb",
      metaDescription:
        "Geotour Villaggi di Scisto 2026 - 20-22 febbraio a Fundão. Gara di resistenza MTB guidata da GPS con prologo (5-6km) + Tappa 1 (75km, 2150D+) + Tappa 2 (67km, 1950D+). Iscrizioni fino al 15 febbraio.",
      description: `# 🚴 Geotour Villaggi di Scisto 2026

Il **Geotour Villaggi di Scisto** è una gara di resistenza in **MTB** guidata da GPS attraverso i magnifici **Villaggi di Scisto**. Organizzato da **ACF – Btt Gardunha** e promosso dal **Comune di Fundão**.

## 📅 Date e Formato

- **20 Febbraio (Venerdì):** Prologo opzionale (~5-6 km) nel pomeriggio
- **21 Febbraio (Sabato):** Tappa 1 (70-80 km, 2000-2300m D+)
- **22 Febbraio (Domenica):** Tappa 2 (60-75 km, 1800-2100m D+)

## 🚴 Modalità

### Solo
Partecipazione individuale in tutte le tappe. Gara impegnativa che richiede buona preparazione fisica e competenze tecniche.

### Solo eBikes
Partecipazione individuale con bici elettrica. **Nessuna classifica ufficiale**, ma esperienza completa dell'evento.

### Coppie
Partecipazione in coppia con **classifica basata sulla somma dei tempi del secondo ciclista** di ogni tappa. Le coppie devono pedalare insieme durante tutta la gara (intervallo massimo di 1 minuto ai punti di controllo).

## 🏔️ Percorsi

| Tappa | Distanza | Dislivello Positivo |
|-------|----------|---------------------|
| **Prologo** (opzionale) | 5-6 km | 150-200m D+ |
| **Tappa 1** | 70-80 km | 2000-2300m D+ |
| **Tappa 2** | 60-75 km | 1800-2100m D+ |

**Nota:** Il prologo è opzionale. I non partecipanti partono alla Tappa 1 con 4 minuti di ritardo, i partecipanti con fino a 2 minuti di ritardo.

## 🎁 L'Iscrizione Include

- ✅ Assicurazione infortuni personali (34.080€ morte/invalidità)
- ✅ Pettorale con numero partecipante
- ✅ Chip di cronometraggio elettronico
- ✅ Regalo dell'evento e medaglia Finisher
- ✅ Ristori liquidi e solidi durante le tappe
- ✅ Cena (Sabato 21, fine Tappa 1)
- ✅ Pranzo (Domenica 22, fine Tappa 2)
- ✅ Docce alla fine delle tappe
- ✅ Area lavaggio biciclette
- ✅ Massaggi alla fine della Tappa 1
- ✅ Assistenza medica e pronto soccorso

## ⚙️ Equipaggiamento Obbligatorio

- 🪖 Casco omologato (obbligatorio durante tutta la gara)
- 📱 Telefono cellulare con batteria carica
- 📍 GPS con tracce fornite dall'organizzazione + batterie di riserva
- 🆔 Documento d'identità

## 🏁 Punti di Controllo

La gara ha **punti di controllo segreti** con limiti di tempo. Chi supera i limiti sarà trasportato dal "carro scopa" o riceverà istruzioni per arrivare in sicurezza.

## 🍽️ Pasti Inclusi

- **Sabato (fine Tappa 1):** Cena
- **Domenica (fine Tappa 2):** Pranzo

## 🏆 Categorie

### Solo
- Elite Uomini (fino a 34 anni)
- Masters Uomini (35-49 anni)
- Veterani Uomini (50+ anni)
- Elite Donne (fino a 34 anni)
- Master Donne (35-49 anni)

### Coppie
- Categoria unica (età indipendente)

**Nota:** Categorie con meno di 5 atleti passano alla categoria inferiore.

## 📞 Contatti

- **Telefono:** +351 966 510 444
- **Sito web:** [www.geotour.pt](http://www.geotour.pt)

## ⚠️ Regolamento

- Gara su **strade aperte al traffico** - rispettare il codice della strada
- Partecipazione a **proprio rischio**
- **Obbligatorio** comunicare ritiri all'organizzazione
- Cuffie vietate durante la gara
- Assistenza medica disponibile lungo il percorso`,
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

  // Step 3: Helper function to find or create variant
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM?: number;
    elevationLossM?: number;
    startTime: string;
    maxParticipants?: number;
    price?: number;
    currency?: Currency;
  }) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name: variantData.name },
    });

    if (existing) {
      return await prisma.eventVariant.update({
        where: { id: existing.id },
        data: variantData,
      });
    } else {
      return await prisma.eventVariant.create({
        data: { eventId: event.id, ...variantData },
      });
    }
  };

  // Step 4: Create event variants
  console.log("🚴 Creating variants...");

  // Variant 1: Solo
  const solo = await findOrCreateVariant({
    name: "Solo",
    distanceKm: 143, // Total: ~6km prologue + 75km + 67km
    elevationGainM: 4300, // Total: ~200 + 2150 + 1950
    elevationLossM: 4300,
    startTime: "14:00",
    maxParticipants: 350,
    price: 85.0,
    currency: Currency.EUR,
  });

  const soloTranslations = [
    {
      language: Language.pt,
      name: "Solo",
      description:
        "Participação individual completa nas 3 etapas: Prólogo opcional (5-6km), Etapa 1 (70-80km, 2000-2300m D+) e Etapa 2 (60-75km, 1800-2100m D+). Desafio completo pelas Aldeias do Xisto com classificação em todas as categorias.",
    },
    {
      language: Language.en,
      name: "Solo",
      description:
        "Complete individual participation in all 3 stages: Optional Prologue (5-6km), Stage 1 (70-80km, 2000-2300m D+) and Stage 2 (60-75km, 1800-2100m D+). Full challenge through the Schist Villages with ranking in all categories.",
    },
    {
      language: Language.es,
      name: "Solo",
      description:
        "Participación individual completa en las 3 etapas: Prólogo opcional (5-6km), Etapa 1 (70-80km, 2000-2300m D+) y Etapa 2 (60-75km, 1800-2100m D+). Desafío completo por las Aldeas del Xisto con clasificación en todas las categorías.",
    },
    {
      language: Language.fr,
      name: "Solo",
      description:
        "Participation individuelle complète aux 3 étapes: Prologue optionnel (5-6km), Étape 1 (70-80km, 2000-2300m D+) et Étape 2 (60-75km, 1800-2100m D+). Défi complet à travers les Villages de Schiste avec classement dans toutes les catégories.",
    },
    {
      language: Language.de,
      name: "Solo",
      description:
        "Vollständige Einzelteilnahme an allen 3 Etappen: Optionaler Prolog (5-6km), Etappe 1 (70-80km, 2000-2300m Hm) und Etappe 2 (60-75km, 1800-2100m Hm). Komplette Herausforderung durch die Schieferdörfer mit Wertung in allen Kategorien.",
    },
    {
      language: Language.it,
      name: "Solo",
      description:
        "Partecipazione individuale completa in tutte le 3 tappe: Prologo opzionale (5-6km), Tappa 1 (70-80km, 2000-2300m D+) e Tappa 2 (60-75km, 1800-2100m D+). Sfida completa attraverso i Villaggi di Scisto con classifica in tutte le categorie.",
    },
  ];

  for (const translation of soloTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: solo.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: solo.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Solo variant created");

  // Variant 2: Solo eBike
  const soloEbike = await findOrCreateVariant({
    name: "Solo eBike",
    distanceKm: 143,
    elevationGainM: 4300,
    elevationLossM: 4300,
    startTime: "14:00",
    maxParticipants: 50,
    price: 85.0,
    currency: Currency.EUR,
  });

  const soloEbikeTranslations = [
    {
      language: Language.pt,
      name: "Solo eBike",
      description:
        "Participação individual completa com bicicleta elétrica. Inclui todas as 3 etapas mas SEM classificação oficial. Experiência completa do evento com assistência motorizada. É obrigatório usar GPS durante toda a prova.",
    },
    {
      language: Language.en,
      name: "Solo eBike",
      description:
        "Complete individual participation with electric bike. Includes all 3 stages but WITHOUT official ranking. Full event experience with motor assistance. GPS usage is mandatory throughout the race.",
    },
    {
      language: Language.es,
      name: "Solo eBike",
      description:
        "Participación individual completa con bicicleta eléctrica. Incluye las 3 etapas pero SIN clasificación oficial. Experiencia completa del evento con asistencia motorizada. Es obligatorio usar GPS durante toda la prueba.",
    },
    {
      language: Language.fr,
      name: "Solo eBike",
      description:
        "Participation individuelle complète avec vélo électrique. Inclut toutes les 3 étapes mais SANS classement officiel. Expérience complète de l'événement avec assistance moteur. L'utilisation du GPS est obligatoire pendant toute la course.",
    },
    {
      language: Language.de,
      name: "Solo eBike",
      description:
        "Vollständige Einzelteilnahme mit Elektrofahrrad. Umfasst alle 3 Etappen, aber OHNE offizielle Wertung. Volles Event-Erlebnis mit Motorunterstützung. GPS-Nutzung ist während des gesamten Rennens Pflicht.",
    },
    {
      language: Language.it,
      name: "Solo eBike",
      description:
        "Partecipazione individuale completa con bici elettrica. Include tutte le 3 tappe ma SENZA classifica ufficiale. Esperienza completa dell'evento con assistenza motore. L'uso del GPS è obbligatorio durante tutta la gara.",
    },
  ];

  for (const translation of soloEbikeTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: soloEbike.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: soloEbike.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Solo eBike variant created");

  // Variant 3: Duplas
  const duplas = await findOrCreateVariant({
    name: "Duplas",
    distanceKm: 143,
    elevationGainM: 4300,
    elevationLossM: 4300,
    startTime: "14:00",
    maxParticipants: 100,
    price: 170.0,
    currency: Currency.EUR,
  });

  const duplasTranslations = [
    {
      language: Language.pt,
      name: "Duplas",
      description:
        "Participação em dupla nas 3 etapas. Classificação pela soma dos tempos do segundo atleta a chegar em cada etapa. As duplas DEVEM circular juntas (intervalo máximo de 1 minuto nos controlos). Penalização mínima de 5 minutos por separação não justificada.",
    },
    {
      language: Language.en,
      name: "Pairs",
      description:
        "Participation in pairs for all 3 stages. Ranking based on the sum of the second rider's times in each stage. Pairs MUST ride together (maximum 1-minute interval at checkpoints). Minimum 5-minute penalty for unjustified separation.",
    },
    {
      language: Language.es,
      name: "Parejas",
      description:
        "Participación en pareja en las 3 etapas. Clasificación por la suma de los tiempos del segundo atleta en llegar en cada etapa. Las parejas DEBEN circular juntas (intervalo máximo de 1 minuto en los controles). Penalización mínima de 5 minutos por separación no justificada.",
    },
    {
      language: Language.fr,
      name: "Binômes",
      description:
        "Participation en binôme pour les 3 étapes. Classement basé sur la somme des temps du deuxième coureur dans chaque étape. Les binômes DOIVENT rouler ensemble (intervalle maximum de 1 minute aux points de contrôle). Pénalité minimale de 5 minutes pour séparation injustifiée.",
    },
    {
      language: Language.de,
      name: "Paare",
      description:
        "Teilnahme zu zweit für alle 3 Etappen. Wertung basierend auf der Summe der Zeiten des zweiten Fahrers in jeder Etappe. Paare MÜSSEN zusammen fahren (maximales Intervall von 1 Minute an Kontrollpunkten). Mindeststrafe von 5 Minuten für ungerechtfertigte Trennung.",
    },
    {
      language: Language.it,
      name: "Coppie",
      description:
        "Partecipazione in coppia per tutte le 3 tappe. Classifica basata sulla somma dei tempi del secondo corridore in ogni tappa. Le coppie DEVONO pedalare insieme (intervallo massimo di 1 minuto ai punti di controllo). Penalità minima di 5 minuti per separazione non giustificata.",
    },
  ];

  for (const translation of duplasTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: duplas.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: duplas.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ Duplas variant created");

  // Step 5: Helper function for pricing phases
  const findOrCreatePricingPhase = async (
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
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.pricingPhase.update({
        where: { id: existing.id },
        data,
      });
    } else {
      return await prisma.pricingPhase.create({
        data: { eventId: event.id, name, ...data },
      });
    }
  };

  // Step 6: Create pricing phases (linked to eventId, NOT variantId)
  console.log("💰 Creating pricing phases...");

  await findOrCreatePricingPhase("Solo - 1ª Fase", {
    startDate: new Date("2025-10-19T20:00:00.000Z"),
    endDate: new Date("2025-10-20T20:00:00.000Z"),
    price: 60.0,
    currency: Currency.EUR,
    note: "Fase promocional de 24h - Pagamento obrigatório em 24h",
  });

  await findOrCreatePricingPhase("Solo - 2ª Fase", {
    startDate: new Date("2025-10-21T20:00:00.000Z"),
    endDate: new Date("2025-11-16T23:59:59.000Z"),
    price: 70.0,
    currency: Currency.EUR,
    note: "Preço intermédio",
  });

  await findOrCreatePricingPhase("Solo - 3ª Fase", {
    startDate: new Date("2025-11-17T00:00:00.000Z"),
    endDate: new Date("2026-02-15T23:59:59.000Z"),
    price: 85.0,
    currency: Currency.EUR,
    note: "Preço final - Limite de 350 inscrições pagas",
  });

  await findOrCreatePricingPhase("Solo eBike - 1ª Fase", {
    startDate: new Date("2025-10-19T20:00:00.000Z"),
    endDate: new Date("2025-10-20T20:00:00.000Z"),
    price: 60.0,
    currency: Currency.EUR,
    note: "Fase promocional de 24h - Sem classificação oficial",
  });

  await findOrCreatePricingPhase("Solo eBike - 2ª Fase", {
    startDate: new Date("2025-10-21T20:00:00.000Z"),
    endDate: new Date("2025-11-16T23:59:59.000Z"),
    price: 70.0,
    currency: Currency.EUR,
    note: "Preço intermédio - Sem classificação oficial",
  });

  await findOrCreatePricingPhase("Solo eBike - 3ª Fase", {
    startDate: new Date("2025-11-17T00:00:00.000Z"),
    endDate: new Date("2026-02-15T23:59:59.000Z"),
    price: 85.0,
    currency: Currency.EUR,
    note: "Preço final - Sem classificação oficial",
  });

  await findOrCreatePricingPhase("Duplas - 1ª Fase", {
    startDate: new Date("2025-10-19T20:00:00.000Z"),
    endDate: new Date("2025-10-20T20:00:00.000Z"),
    price: 120.0,
    currency: Currency.EUR,
    note: "Fase promocional de 24h - Dupla completa",
  });

  await findOrCreatePricingPhase("Duplas - 2ª Fase", {
    startDate: new Date("2025-10-21T20:00:00.000Z"),
    endDate: new Date("2025-11-16T23:59:59.000Z"),
    price: 140.0,
    currency: Currency.EUR,
    note: "Preço intermédio - Dupla completa",
  });

  await findOrCreatePricingPhase("Duplas - 3ª Fase", {
    startDate: new Date("2025-11-17T00:00:00.000Z"),
    endDate: new Date("2026-02-15T23:59:59.000Z"),
    price: 170.0,
    currency: Currency.EUR,
    note: "Preço final - Dupla completa",
  });

  console.log("   ✅ Pricing phases created (9 phases total)");

  // Step 7: Helper function for FAQs
  const findOrCreateFAQ = async (
    eventId: string,
    order: number,
    question: string,
    answer: string
  ) => {
    const existing = await prisma.eventFAQ.findFirst({
      where: { eventId, order },
    });
    if (existing)
      return await prisma.eventFAQ.update({
        where: { id: existing.id },
        data: { question, answer },
      });
    return await prisma.eventFAQ.create({
      data: { eventId, order, question, answer },
    });
  };

  // Step 8: Create FAQs with translations
  console.log("❓ Creating FAQs...");

  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "É obrigatório participar no prólogo?",
    "Não, o prólogo é opcional. No entanto, se não participares, sairás na Etapa 1 com 4 minutos de atraso. Se participares no prólogo, sairás com o tempo obtido (até máximo de 2 minutos de atraso)."
  );

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq1.id, language: Language.pt },
    },
    update: {
      question: "É obrigatório participar no prólogo?",
      answer:
        "Não, o prólogo é opcional. No entanto, se não participares, sairás na Etapa 1 com 4 minutos de atraso. Se participares no prólogo, sairás com o tempo obtido (até máximo de 2 minutos de atraso).",
    },
    create: {
      faqId: faq1.id,
      language: Language.pt,
      question: "É obrigatório participar no prólogo?",
      answer:
        "Não, o prólogo é opcional. No entanto, se não participares, sairás na Etapa 1 com 4 minutos de atraso. Se participares no prólogo, sairás com o tempo obtido (até máximo de 2 minutos de atraso).",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq1.id, language: Language.en },
    },
    update: {
      question: "Is the prologue mandatory?",
      answer:
        "No, the prologue is optional. However, if you don't participate, you'll start Stage 1 with a 4-minute delay. If you participate in the prologue, you'll start with your obtained time (up to a maximum of 2 minutes delay).",
    },
    create: {
      faqId: faq1.id,
      language: Language.en,
      question: "Is the prologue mandatory?",
      answer:
        "No, the prologue is optional. However, if you don't participate, you'll start Stage 1 with a 4-minute delay. If you participate in the prologue, you'll start with your obtained time (up to a maximum of 2 minutes delay).",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq1.id, language: Language.es },
    },
    update: {
      question: "¿Es obligatorio participar en el prólogo?",
      answer:
        "No, el prólogo es opcional. Sin embargo, si no participas, saldrás en la Etapa 1 con 4 minutos de retraso. Si participas en el prólogo, saldrás con el tiempo obtenido (hasta un máximo de 2 minutos de retraso).",
    },
    create: {
      faqId: faq1.id,
      language: Language.es,
      question: "¿Es obligatorio participar en el prólogo?",
      answer:
        "No, el prólogo es opcional. Sin embargo, si no participas, saldrás en la Etapa 1 con 4 minutos de retraso. Si participas en el prólogo, saldrás con el tiempo obtenido (hasta un máximo de 2 minutos de retraso).",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq1.id, language: Language.fr },
    },
    update: {
      question: "Le prologue est-il obligatoire?",
      answer:
        "Non, le prologue est optionnel. Cependant, si vous ne participez pas, vous démarrerez l'Étape 1 avec 4 minutes de retard. Si vous participez au prologue, vous démarrerez avec votre temps obtenu (jusqu'à un maximum de 2 minutes de retard).",
    },
    create: {
      faqId: faq1.id,
      language: Language.fr,
      question: "Le prologue est-il obligatoire?",
      answer:
        "Non, le prologue est optionnel. Cependant, si vous ne participez pas, vous démarrerez l'Étape 1 avec 4 minutes de retard. Si vous participez au prologue, vous démarrerez avec votre temps obtenu (jusqu'à un maximum de 2 minutes de retard).",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq1.id, language: Language.de },
    },
    update: {
      question: "Ist der Prolog obligatorisch?",
      answer:
        "Nein, der Prolog ist optional. Wenn Sie jedoch nicht teilnehmen, starten Sie Etappe 1 mit 4 Minuten Verzögerung. Wenn Sie am Prolog teilnehmen, starten Sie mit Ihrer erzielten Zeit (bis maximal 2 Minuten Verzögerung).",
    },
    create: {
      faqId: faq1.id,
      language: Language.de,
      question: "Ist der Prolog obligatorisch?",
      answer:
        "Nein, der Prolog ist optional. Wenn Sie jedoch nicht teilnehmen, starten Sie Etappe 1 mit 4 Minuten Verzögerung. Wenn Sie am Prolog teilnehmen, starten Sie mit Ihrer erzielten Zeit (bis maximal 2 Minuten Verzögerung).",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq1.id, language: Language.it },
    },
    update: {
      question: "Il prologo è obbligatorio?",
      answer:
        "No, il prologo è opzionale. Tuttavia, se non partecipi, partirai alla Tappa 1 con 4 minuti di ritardo. Se partecipi al prologo, partirai con il tempo ottenuto (fino a un massimo di 2 minuti di ritardo).",
    },
    create: {
      faqId: faq1.id,
      language: Language.it,
      question: "Il prologo è obbligatorio?",
      answer:
        "No, il prologo è opzionale. Tuttavia, se non partecipi, partirai alla Tappa 1 con 4 minuti di ritardo. Se partecipi al prologo, partirai con il tempo ottenuto (fino a un massimo di 2 minuti di ritardo).",
    },
  });

  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "As eBikes têm classificação?",
    "Não. As eBikes são permitidas mas não terão qualquer tipo de classificação oficial. Poderás participar e desfrutar do evento, mas não entrarás nas classificações finais."
  );

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq2.id, language: Language.pt },
    },
    update: {
      question: "As eBikes têm classificação?",
      answer:
        "Não. As eBikes são permitidas mas não terão qualquer tipo de classificação oficial. Poderás participar e desfrutar do evento, mas não entrarás nas classificações finais.",
    },
    create: {
      faqId: faq2.id,
      language: Language.pt,
      question: "As eBikes têm classificação?",
      answer:
        "Não. As eBikes são permitidas mas não terão qualquer tipo de classificação oficial. Poderás participar e desfrutar do evento, mas não entrarás nas classificações finais.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq2.id, language: Language.en },
    },
    update: {
      question: "Do eBikes have a ranking?",
      answer:
        "No. eBikes are allowed but will not have any official ranking. You can participate and enjoy the event, but you won't be included in the final rankings.",
    },
    create: {
      faqId: faq2.id,
      language: Language.en,
      question: "Do eBikes have a ranking?",
      answer:
        "No. eBikes are allowed but will not have any official ranking. You can participate and enjoy the event, but you won't be included in the final rankings.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq2.id, language: Language.es },
    },
    update: {
      question: "¿Las eBikes tienen clasificación?",
      answer:
        "No. Las eBikes están permitidas pero no tendrán ningún tipo de clasificación oficial. Podrás participar y disfrutar del evento, pero no entrarás en las clasificaciones finales.",
    },
    create: {
      faqId: faq2.id,
      language: Language.es,
      question: "¿Las eBikes tienen clasificación?",
      answer:
        "No. Las eBikes están permitidas pero no tendrán ningún tipo de clasificación oficial. Podrás participar y disfrutar del evento, pero no entrarás en las clasificaciones finales.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq2.id, language: Language.fr },
    },
    update: {
      question: "Les eBikes ont-ils un classement?",
      answer:
        "Non. Les eBikes sont autorisés mais n'auront aucun classement officiel. Vous pouvez participer et profiter de l'événement, mais vous ne serez pas inclus dans les classements finaux.",
    },
    create: {
      faqId: faq2.id,
      language: Language.fr,
      question: "Les eBikes ont-ils un classement?",
      answer:
        "Non. Les eBikes sont autorisés mais n'auront aucun classement officiel. Vous pouvez participer et profiter de l'événement, mais vous ne serez pas inclus dans les classements finaux.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq2.id, language: Language.de },
    },
    update: {
      question: "Haben eBikes eine Wertung?",
      answer:
        "Nein. eBikes sind erlaubt, haben aber keine offizielle Wertung. Sie können teilnehmen und die Veranstaltung genießen, werden aber nicht in die Endwertungen aufgenommen.",
    },
    create: {
      faqId: faq2.id,
      language: Language.de,
      question: "Haben eBikes eine Wertung?",
      answer:
        "Nein. eBikes sind erlaubt, haben aber keine offizielle Wertung. Sie können teilnehmen und die Veranstaltung genießen, werden aber nicht in die Endwertungen aufgenommen.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq2.id, language: Language.it },
    },
    update: {
      question: "Le eBike hanno una classifica?",
      answer:
        "No. Le eBike sono consentite ma non avranno alcuna classifica ufficiale. Puoi partecipare e goderti l'evento, ma non sarai incluso nelle classifiche finali.",
    },
    create: {
      faqId: faq2.id,
      language: Language.it,
      question: "Le eBike hanno una classifica?",
      answer:
        "No. Le eBike sono consentite ma non avranno alcuna classifica ufficiale. Puoi partecipare e goderti l'evento, ma non sarai incluso nelle classifiche finali.",
    },
  });

  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "A organização fornece alojamento?",
    "Não. A organização não disponibiliza inscrições com dormida. É da responsabilidade dos participantes a sua estadia na cidade do Fundão ou arredores."
  );

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq3.id, language: Language.pt },
    },
    update: {
      question: "A organização fornece alojamento?",
      answer:
        "Não. A organização não disponibiliza inscrições com dormida. É da responsabilidade dos participantes a sua estadia na cidade do Fundão ou arredores.",
    },
    create: {
      faqId: faq3.id,
      language: Language.pt,
      question: "A organização fornece alojamento?",
      answer:
        "Não. A organização não disponibiliza inscrições com dormida. É da responsabilidade dos participantes a sua estadia na cidade do Fundão ou arredores.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq3.id, language: Language.en },
    },
    update: {
      question: "Does the organization provide accommodation?",
      answer:
        "No. The organization does not provide accommodation with registration. Participants are responsible for their own accommodation in Fundão city or nearby areas.",
    },
    create: {
      faqId: faq3.id,
      language: Language.en,
      question: "Does the organization provide accommodation?",
      answer:
        "No. The organization does not provide accommodation with registration. Participants are responsible for their own accommodation in Fundão city or nearby areas.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq3.id, language: Language.es },
    },
    update: {
      question: "¿La organización proporciona alojamiento?",
      answer:
        "No. La organización no proporciona alojamiento con la inscripción. Los participantes son responsables de su propia estancia en la ciudad de Fundão o áreas cercanas.",
    },
    create: {
      faqId: faq3.id,
      language: Language.es,
      question: "¿La organización proporciona alojamiento?",
      answer:
        "No. La organización no proporciona alojamiento con la inscripción. Los participantes son responsables de su propia estancia en la ciudad de Fundão o áreas cercanas.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq3.id, language: Language.fr },
    },
    update: {
      question: "L'organisation fournit-elle un hébergement?",
      answer:
        "Non. L'organisation ne fournit pas d'hébergement avec l'inscription. Les participants sont responsables de leur propre hébergement dans la ville de Fundão ou les environs.",
    },
    create: {
      faqId: faq3.id,
      language: Language.fr,
      question: "L'organisation fournit-elle un hébergement?",
      answer:
        "Non. L'organisation ne fournit pas d'hébergement avec l'inscription. Les participants sont responsables de leur propre hébergement dans la ville de Fundão ou les environs.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq3.id, language: Language.de },
    },
    update: {
      question: "Bietet die Organisation eine Unterkunft?",
      answer:
        "Nein. Die Organisation bietet keine Unterkunft mit der Anmeldung. Die Teilnehmer sind für ihre eigene Unterkunft in der Stadt Fundão oder in der Nähe verantwortlich.",
    },
    create: {
      faqId: faq3.id,
      language: Language.de,
      question: "Bietet die Organisation eine Unterkunft?",
      answer:
        "Nein. Die Organisation bietet keine Unterkunft mit der Anmeldung. Die Teilnehmer sind für ihre eigene Unterkunft in der Stadt Fundão oder in der Nähe verantwortlich.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq3.id, language: Language.it },
    },
    update: {
      question: "L'organizzazione fornisce l'alloggio?",
      answer:
        "No. L'organizzazione non fornisce alloggio con l'iscrizione. I partecipanti sono responsabili del proprio alloggio nella città di Fundão o nelle vicinanze.",
    },
    create: {
      faqId: faq3.id,
      language: Language.it,
      question: "L'organizzazione fornisce l'alloggio?",
      answer:
        "No. L'organizzazione non fornisce alloggio con l'iscrizione. I partecipanti sono responsabili del proprio alloggio nella città di Fundão o nelle vicinanze.",
    },
  });

  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Como funciona a classificação das duplas?",
    "A classificação das duplas é feita pela soma dos tempos do segundo atleta a chegar em cada etapa. As duplas devem circular juntas durante toda a prova, com intervalo máximo de 1 minuto nos controlos de passagem. Separações não justificadas têm penalização mínima de 5 minutos."
  );

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq4.id, language: Language.pt },
    },
    update: {
      question: "Como funciona a classificação das duplas?",
      answer:
        "A classificação das duplas é feita pela soma dos tempos do segundo atleta a chegar em cada etapa. As duplas devem circular juntas durante toda a prova, com intervalo máximo de 1 minuto nos controlos de passagem. Separações não justificadas têm penalização mínima de 5 minutos.",
    },
    create: {
      faqId: faq4.id,
      language: Language.pt,
      question: "Como funciona a classificação das duplas?",
      answer:
        "A classificação das duplas é feita pela soma dos tempos do segundo atleta a chegar em cada etapa. As duplas devem circular juntas durante toda a prova, com intervalo máximo de 1 minuto nos controlos de passagem. Separações não justificadas têm penalização mínima de 5 minutos.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq4.id, language: Language.en },
    },
    update: {
      question: "How does the pairs ranking work?",
      answer:
        "Pairs ranking is based on the sum of the second rider's times in each stage. Pairs must ride together throughout the race, with a maximum 1-minute interval at checkpoints. Unjustified separations have a minimum 5-minute penalty.",
    },
    create: {
      faqId: faq4.id,
      language: Language.en,
      question: "How does the pairs ranking work?",
      answer:
        "Pairs ranking is based on the sum of the second rider's times in each stage. Pairs must ride together throughout the race, with a maximum 1-minute interval at checkpoints. Unjustified separations have a minimum 5-minute penalty.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq4.id, language: Language.es },
    },
    update: {
      question: "¿Cómo funciona la clasificación de parejas?",
      answer:
        "La clasificación de parejas se basa en la suma de los tiempos del segundo ciclista en llegar en cada etapa. Las parejas deben circular juntas durante toda la prueba, con un intervalo máximo de 1 minuto en los controles de paso. Las separaciones no justificadas tienen una penalización mínima de 5 minutos.",
    },
    create: {
      faqId: faq4.id,
      language: Language.es,
      question: "¿Cómo funciona la clasificación de parejas?",
      answer:
        "La clasificación de parejas se basa en la suma de los tiempos del segundo ciclista en llegar en cada etapa. Las parejas deben circular juntas durante toda la prueba, con un intervalo máximo de 1 minuto en los controles de paso. Las separaciones no justificadas tienen una penalización mínima de 5 minutos.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq4.id, language: Language.fr },
    },
    update: {
      question: "Comment fonctionne le classement des binômes?",
      answer:
        "Le classement des binômes est basé sur la somme des temps du deuxième coureur dans chaque étape. Les binômes doivent rouler ensemble pendant toute la course, avec un intervalle maximum de 1 minute aux points de contrôle. Les séparations injustifiées ont une pénalité minimale de 5 minutes.",
    },
    create: {
      faqId: faq4.id,
      language: Language.fr,
      question: "Comment fonctionne le classement des binômes?",
      answer:
        "Le classement des binômes est basé sur la somme des temps du deuxième coureur dans chaque étape. Les binômes doivent rouler ensemble pendant toute la course, avec un intervalle maximum de 1 minute aux points de contrôle. Les séparations injustifiées ont une pénalité minimale de 5 minutes.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq4.id, language: Language.de },
    },
    update: {
      question: "Wie funktioniert die Paare-Wertung?",
      answer:
        "Die Paare-Wertung basiert auf der Summe der Zeiten des zweiten Fahrers in jeder Etappe. Paare müssen während des gesamten Rennens zusammen fahren, mit einem maximalen Intervall von 1 Minute an Kontrollpunkten. Ungerechtfertigte Trennungen haben eine Mindeststrafe von 5 Minuten.",
    },
    create: {
      faqId: faq4.id,
      language: Language.de,
      question: "Wie funktioniert die Paare-Wertung?",
      answer:
        "Die Paare-Wertung basiert auf der Summe der Zeiten des zweiten Fahrers in jeder Etappe. Paare müssen während des gesamten Rennens zusammen fahren, mit einem maximalen Intervall von 1 Minute an Kontrollpunkten. Ungerechtfertigte Trennungen haben eine Mindeststrafe von 5 Minuten.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq4.id, language: Language.it },
    },
    update: {
      question: "Come funziona la classifica delle coppie?",
      answer:
        "La classifica delle coppie è basata sulla somma dei tempi del secondo corridore in ogni tappa. Le coppie devono pedalare insieme durante tutta la gara, con un intervallo massimo di 1 minuto ai punti di controllo. Le separazioni non giustificate hanno una penalità minima di 5 minuti.",
    },
    create: {
      faqId: faq4.id,
      language: Language.it,
      question: "Come funziona la classifica delle coppie?",
      answer:
        "La classifica delle coppie è basata sulla somma dei tempi del secondo corridore in ogni tappa. Le coppie devono pedalare insieme durante tutta la gara, con un intervallo massimo di 1 minuto ai punti di controllo. Le separazioni non giustificate hanno una penalità minima di 5 minuti.",
    },
  });

  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Qual é a idade mínima para participar?",
    "A prova está aberta a atletas maiores de 18 anos à data do evento. É necessário estar fisicamente apto e ter domínio técnico suficiente para enfrentar a prova."
  );

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq5.id, language: Language.pt },
    },
    update: {
      question: "Qual é a idade mínima para participar?",
      answer:
        "A prova está aberta a atletas maiores de 18 anos à data do evento. É necessário estar fisicamente apto e ter domínio técnico suficiente para enfrentar a prova.",
    },
    create: {
      faqId: faq5.id,
      language: Language.pt,
      question: "Qual é a idade mínima para participar?",
      answer:
        "A prova está aberta a atletas maiores de 18 anos à data do evento. É necessário estar fisicamente apto e ter domínio técnico suficiente para enfrentar a prova.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq5.id, language: Language.en },
    },
    update: {
      question: "What is the minimum age to participate?",
      answer:
        "The race is open to athletes over 18 years old on the event date. You must be physically fit and have sufficient technical skills to face the race.",
    },
    create: {
      faqId: faq5.id,
      language: Language.en,
      question: "What is the minimum age to participate?",
      answer:
        "The race is open to athletes over 18 years old on the event date. You must be physically fit and have sufficient technical skills to face the race.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq5.id, language: Language.es },
    },
    update: {
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "La prueba está abierta a atletas mayores de 18 años en la fecha del evento. Debes estar físicamente apto y tener habilidades técnicas suficientes para enfrentar la prueba.",
    },
    create: {
      faqId: faq5.id,
      language: Language.es,
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "La prueba está abierta a atletas mayores de 18 años en la fecha del evento. Debes estar físicamente apto y tener habilidades técnicas suficientes para enfrentar la prueba.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq5.id, language: Language.fr },
    },
    update: {
      question: "Quel est l'âge minimum pour participer?",
      answer:
        "La course est ouverte aux athlètes de plus de 18 ans à la date de l'événement. Vous devez être en forme physiquement et avoir des compétences techniques suffisantes pour affronter la course.",
    },
    create: {
      faqId: faq5.id,
      language: Language.fr,
      question: "Quel est l'âge minimum pour participer?",
      answer:
        "La course est ouverte aux athlètes de plus de 18 ans à la date de l'événement. Vous devez être en forme physiquement et avoir des compétences techniques suffisantes pour affronter la course.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq5.id, language: Language.de },
    },
    update: {
      question: "Was ist das Mindestalter für die Teilnahme?",
      answer:
        "Das Rennen ist für Athleten über 18 Jahre am Veranstaltungstag geöffnet. Sie müssen körperlich fit sein und über ausreichende technische Fähigkeiten verfügen, um das Rennen zu bewältigen.",
    },
    create: {
      faqId: faq5.id,
      language: Language.de,
      question: "Was ist das Mindestalter für die Teilnahme?",
      answer:
        "Das Rennen ist für Athleten über 18 Jahre am Veranstaltungstag geöffnet. Sie müssen körperlich fit sein und über ausreichende technische Fähigkeiten verfügen, um das Rennen zu bewältigen.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: {
      faqId_language: { faqId: faq5.id, language: Language.it },
    },
    update: {
      question: "Qual è l'età minima per partecipare?",
      answer:
        "La gara è aperta ad atleti maggiori di 18 anni alla data dell'evento. Devi essere fisicamente in forma e avere competenze tecniche sufficienti per affrontare la gara.",
    },
    create: {
      faqId: faq5.id,
      language: Language.it,
      question: "Qual è l'età minima per partecipare?",
      answer:
        "La gara è aperta ad atleti maggiori di 18 anni alla data dell'evento. Devi essere fisicamente in forma e avere competenze tecniche sufficienti per affrontare la gara.",
    },
  });

  console.log("   ✅ Created 5 FAQs with 6 language translations each");

  console.log(`
🎉 Geotour Aldeias do Xisto 2026 seeded successfully!
   📍 Event: Geotour Aldeias do Xisto
   🔗 Slug: ${event.slug}
   📅 Dates: 2026-02-20 to 2026-02-22 (3 days)
   📍 Location: Fundão, Castelo Branco, Portugal
   🚴 Variants: Solo, Solo eBike, Duplas
   💰 Pricing Phases: 9 phases (3 phases × 3 variants)
   ❓ FAQs: 5 questions with 6 language translations
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding event:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
