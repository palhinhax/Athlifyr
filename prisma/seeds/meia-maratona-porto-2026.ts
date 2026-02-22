/**
 * Seed: Hyundai Meia Maratona do Porto 2026
 *
 * Event: Half marathon in the iconic city of Porto
 * Location: Porto, Porto
 * Date: September 13, 2026
 * Start: Av. de Dom Carlos I
 * Organizer: RunPorto
 * Website: https://www.meiamaratonadoporto.com
 */

import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Hyundai Meia Maratona do Porto 2026...");

  // Delete existing event if it exists (idempotency)
  await prisma.event.deleteMany({
    where: {
      slug: "meia-maratona-porto-2026",
    },
  });

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "Hyundai Meia Maratona do Porto 2026",
      slug: "meia-maratona-porto-2026",
      description:
        "Hyundai Meia Maratona do Porto 2026 - A corrida icónica pela Invicta",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-09-13T09:00:00Z"),
      endDate: new Date("2026-09-13T12:00:00Z"),
      registrationDeadline: new Date("2026-09-08T23:59:59Z"),
      externalUrl: "https://www.meiamaratonadoporto.com",
      imageUrl: "", // To be uploaded via admin
      city: "Porto",
      country: "Portugal",
      latitude: 41.1496,
      longitude: -8.6109,
      googleMapsUrl: "https://maps.app.goo.gl/Porto",
      isFeatured: true,
      cancelled: false,
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // Translations for all 6 languages
  const translations = {
    pt: {
      title: "Hyundai Meia Maratona do Porto 2026",
      description: `# 🏃 Hyundai Meia Maratona do Porto 2026

**A corrida icónica pela cidade Invicta! Percorre as ruas históricas do Porto numa das meias maratonas mais emblemáticas de Portugal.**

---

## 📅 Data e Horário

- **Data**: 13 de Setembro de 2026 (Domingo)
- **Hora de Partida**: 09h00
- **Local de Partida**: Av. de Dom Carlos I, Porto
- **Tempo Limite**: 3 horas (12h00)

## 🏃 Provas Disponíveis

### Meia Maratona - 21 km
- **Distância**: 21 km
- **Hora de Partida**: 09h00
- **Tempo Limite**: 3 horas
- **Inscrições Limitadas**

### VIP Marathon - 21 km
- **Distância**: 21 km
- **Vagas**: Limitado a 50 participantes
- **Vantagens VIP**: Dorsal Sub-Elite, Partida na linha da frente, Acesso à Zona VIP, Bengaleiro VIP, Catering VIP, SMS de resultados

## 🎯 Destaques

✅ **Percurso icónico** pela cidade do Porto  
✅ **Medalha finisher** com gravação opcional do nome e tempo  
✅ **Kit de participante** com dorsal e chip de cronometragem  
✅ **5 postos de abastecimento** ao longo do percurso  
✅ **Balneários** disponíveis no Clube Fluvial Portuense (10h15-12h30)  
✅ **Cerveja Super Bock** na meta para todos os finishers 🍺  

## 📋 Levantamento do Kit

**Local**: Alameda Shop & Spot (Centro Comercial)

**Horários**:
- **Sexta, 11 de Setembro**: 10h00 às 23h00
- **Sábado, 12 de Setembro**: 10h00 às 23h00

⚠️ **Não haverá entrega de kits fora destes horários.**

## 🏁 Grupos de Partida

**Sub-elite**: Comprovativo de tempo deve ser enviado para geral@runporto.com até 30 de Agosto de 2026.

## 💧 Postos de Abastecimento

| Km | Abastecimento |
|---|---|
| 5 km | Água Vitalis |
| 10 km | Água Vitalis, Powerade |
| 15 km | Água Vitalis, Powerade |
| 20 km | Água Vitalis |
| Meta | Água Vitalis, Cerveja Super Bock 🍺 |

## ⏱️ Horários dos Postos de Controlo

| Posto | 1º Atleta | Último Atleta |
|---|---|---|
| Km 5 | 09h14 | 09h37 |
| Km 10 | 09h28 | 10h25 |
| Km 15 | 09h42 | 11h09 |
| Km 20 | 09h56 | 11h51 |
| Meta | 09h59 | 12h00 |

## 🏅 Gravação de Medalhas

- **No site ou na Expo**: 7,50€ (preço especial)
- **No dia da prova**: 10€ (no stand de gravação na meta)
- O nome e tempo de prova são gravados na medalha

## 🚿 Balneários

Balneários disponibilizados pelo **Clube Fluvial Portuense**.
- Basta apresentar o dorsal
- Disponíveis entre as 10h15 e 12h30

## 🧥 Bengaleiro

Disponível na zona de partida/meta. Os sacos devem ser identificados com o número do dorsal. A organização não guarda objetos soltos.`,
      city: "Porto",
      metaTitle: "Hyundai Meia Maratona do Porto 2026 | Porto | 13 Setembro",
      metaDescription:
        "Hyundai Meia Maratona do Porto 2026 - 13 de setembro no Porto. Meia Maratona 21km com percurso icónico pela Invicta. Inscrições a partir de 22,50€. Medalha finisher com gravação.",
    },
    en: {
      title: "Hyundai Porto Half Marathon 2026",
      description: `# 🏃 Hyundai Porto Half Marathon 2026

**The iconic race through the Invicta city! Run through Porto's historic streets in one of Portugal's most emblematic half marathons.**

---

## 📅 Date and Schedule

- **Date**: September 13, 2026 (Sunday)
- **Start Time**: 9:00 AM
- **Start Location**: Av. de Dom Carlos I, Porto
- **Time Limit**: 3 hours (12:00 PM)

## 🏃 Available Races

### Half Marathon - 21 km
- **Distance**: 21 km
- **Start Time**: 9:00 AM
- **Time Limit**: 3 hours
- **Limited Registrations**

### VIP Marathon - 21 km
- **Distance**: 21 km
- **Spots**: Limited to 50 participants
- **VIP Benefits**: Sub-Elite bib, Front line start, VIP Zone access, VIP Wardrobe, VIP Catering, Results SMS

## 🎯 Highlights

✅ **Iconic course** through the city of Porto  
✅ **Finisher medal** with optional name and time engraving  
✅ **Participant kit** with bib and timing chip  
✅ **5 refreshment stations** along the course  
✅ **Showers** available at Clube Fluvial Portuense (10:15 AM - 12:30 PM)  
✅ **Super Bock beer** at the finish line for all finishers 🍺  

## 📋 Kit Collection

**Location**: Alameda Shop & Spot (Shopping Center)

**Schedule**:
- **Friday, September 11**: 10:00 AM to 11:00 PM
- **Saturday, September 12**: 10:00 AM to 11:00 PM

⚠️ **No kits will be delivered outside these times.**

## 🏁 Start Groups

**Sub-elite**: Proof of time must be sent to geral@runporto.com by August 30, 2026.

## 💧 Refreshment Stations

| Km | Refreshment |
|---|---|
| 5 km | Vitalis Water |
| 10 km | Vitalis Water, Powerade |
| 15 km | Vitalis Water, Powerade |
| 20 km | Vitalis Water |
| Finish | Vitalis Water, Super Bock Beer 🍺 |

## ⏱️ Check Point Schedule

| Check Point | First Runner | Last Runner |
|---|---|---|
| Km 5 | 9:14 AM | 9:37 AM |
| Km 10 | 9:28 AM | 10:25 AM |
| Km 15 | 9:42 AM | 11:09 AM |
| Km 20 | 9:56 AM | 11:51 AM |
| Finish | 9:59 AM | 12:00 PM |

## 🏅 Medal Engraving

- **Online or at the Expo**: €7.50 (special price)
- **On race day**: €10 (at the engraving stand at the finish)
- Your name and race time are engraved on the medal

## 🚿 Showers

Showers provided by **Clube Fluvial Portuense**.
- Just show your race bib
- Available between 10:15 AM and 12:30 PM

## 🧥 Wardrobe

Available at the start/finish area. Bags must be identified with the bib number. The organization does not store loose objects.`,
      city: "Porto",
      metaTitle: "Hyundai Porto Half Marathon 2026 | Porto | September 13",
      metaDescription:
        "Hyundai Porto Half Marathon 2026 - September 13 in Porto. Half Marathon 21km through Porto's iconic streets. Registration from €22.50. Finisher medal with engraving.",
    },
    es: {
      title: "Hyundai Media Maratón de Oporto 2026",
      description: `# 🏃 Hyundai Media Maratón de Oporto 2026

**¡La carrera icónica por la ciudad Invicta! Recorre las calles históricas de Oporto en una de las medias maratones más emblemáticas de Portugal.**

---

## 📅 Fecha y Horario

- **Fecha**: 13 de septiembre de 2026 (Domingo)
- **Hora de Salida**: 09:00
- **Lugar de Salida**: Av. de Dom Carlos I, Oporto
- **Tiempo Límite**: 3 horas (12:00)

## 🏃 Pruebas Disponibles

### Media Maratón - 21 km
- **Distancia**: 21 km
- **Hora de Salida**: 09:00
- **Tiempo Límite**: 3 horas
- **Inscripciones Limitadas**

### VIP Marathon - 21 km
- **Distancia**: 21 km
- **Plazas**: Limitado a 50 participantes
- **Ventajas VIP**: Dorsal Sub-Elite, Salida en primera línea, Acceso a Zona VIP, Guardarropa VIP, Catering VIP, SMS de resultados

## 🎯 Destacados

✅ **Recorrido icónico** por la ciudad de Oporto  
✅ **Medalla finisher** con grabado opcional de nombre y tiempo  
✅ **Kit de participante** con dorsal y chip de cronometraje  
✅ **5 puestos de avituallamiento** a lo largo del recorrido  
✅ **Duchas** disponibles en el Clube Fluvial Portuense (10:15-12:30)  
✅ **Cerveza Super Bock** en la meta para todos los finishers 🍺  

## 📋 Recogida del Kit

**Lugar**: Alameda Shop & Spot (Centro Comercial)

**Horarios**:
- **Viernes, 11 de septiembre**: 10:00 a 23:00
- **Sábado, 12 de septiembre**: 10:00 a 23:00

⚠️ **No se entregarán kits fuera de estos horarios.**

## 💧 Puestos de Avituallamiento

| Km | Avituallamiento |
|---|---|
| 5 km | Agua Vitalis |
| 10 km | Agua Vitalis, Powerade |
| 15 km | Agua Vitalis, Powerade |
| 20 km | Agua Vitalis |
| Meta | Agua Vitalis, Cerveza Super Bock 🍺 |

## 🏅 Grabado de Medallas

- **En el sitio web o en la Expo**: 7,50€ (precio especial)
- **El día de la prueba**: 10€ (en el stand de grabado en la meta)`,
      city: "Oporto",
      metaTitle:
        "Hyundai Media Maratón de Oporto 2026 | Oporto | 13 Septiembre",
      metaDescription:
        "Hyundai Media Maratón de Oporto 2026 - 13 de septiembre en Oporto. Media Maratón 21km por las calles icónicas de la Invicta. Inscripciones desde 22,50€. Medalla finisher con grabado.",
    },
    fr: {
      title: "Hyundai Semi-Marathon de Porto 2026",
      description: `# 🏃 Hyundai Semi-Marathon de Porto 2026

**La course iconique à travers la ville Invicta ! Parcourez les rues historiques de Porto lors de l'un des semi-marathons les plus emblématiques du Portugal.**

---

## 📅 Date et Horaire

- **Date** : 13 septembre 2026 (Dimanche)
- **Heure de Départ** : 09h00
- **Lieu de Départ** : Av. de Dom Carlos I, Porto
- **Temps Limite** : 3 heures (12h00)

## 🏃 Épreuves Disponibles

### Semi-Marathon - 21 km
- **Distance** : 21 km
- **Heure de Départ** : 09h00
- **Temps Limite** : 3 heures
- **Inscriptions Limitées**

### VIP Marathon - 21 km
- **Distance** : 21 km
- **Places** : Limité à 50 participants
- **Avantages VIP** : Dossard Sub-Elite, Départ en première ligne, Accès Zone VIP, Vestiaire VIP, Catering VIP, SMS de résultats

## 🎯 Points Forts

✅ **Parcours iconique** à travers la ville de Porto  
✅ **Médaille finisher** avec gravure optionnelle du nom et du temps  
✅ **Kit participant** avec dossard et puce de chronométrage  
✅ **5 postes de ravitaillement** le long du parcours  
✅ **Douches** disponibles au Clube Fluvial Portuense (10h15-12h30)  
✅ **Bière Super Bock** à l'arrivée pour tous les finishers 🍺  

## 📋 Retrait du Kit

**Lieu** : Alameda Shop & Spot (Centre Commercial)

**Horaires** :
- **Vendredi 11 septembre** : 10h00 à 23h00
- **Samedi 12 septembre** : 10h00 à 23h00

⚠️ **Aucun kit ne sera distribué en dehors de ces horaires.**

## 💧 Postes de Ravitaillement

| Km | Ravitaillement |
|---|---|
| 5 km | Eau Vitalis |
| 10 km | Eau Vitalis, Powerade |
| 15 km | Eau Vitalis, Powerade |
| 20 km | Eau Vitalis |
| Arrivée | Eau Vitalis, Bière Super Bock 🍺 |

## 🏅 Gravure de Médailles

- **Sur le site ou à l'Expo** : 7,50€ (prix spécial)
- **Le jour de la course** : 10€ (au stand de gravure à l'arrivée)`,
      city: "Porto",
      metaTitle: "Hyundai Semi-Marathon de Porto 2026 | Porto | 13 Septembre",
      metaDescription:
        "Hyundai Semi-Marathon de Porto 2026 - 13 septembre à Porto. Semi-Marathon 21km à travers les rues iconiques de l'Invicta. Inscriptions à partir de 22,50€. Médaille finisher avec gravure.",
    },
    de: {
      title: "Hyundai Halbmarathon Porto 2026",
      description: `# 🏃 Hyundai Halbmarathon Porto 2026

**Das ikonische Rennen durch die Invicta-Stadt! Laufe durch die historischen Straßen von Porto bei einem der emblematischsten Halbmarathons Portugals.**

---

## 📅 Datum und Zeitplan

- **Datum**: 13. September 2026 (Sonntag)
- **Startzeit**: 09:00 Uhr
- **Startort**: Av. de Dom Carlos I, Porto
- **Zeitlimit**: 3 Stunden (12:00 Uhr)

## 🏃 Verfügbare Läufe

### Halbmarathon - 21 km
- **Distanz**: 21 km
- **Startzeit**: 09:00 Uhr
- **Zeitlimit**: 3 Stunden
- **Begrenzte Anmeldungen**

### VIP Marathon - 21 km
- **Distanz**: 21 km
- **Plätze**: Begrenzt auf 50 Teilnehmer
- **VIP-Vorteile**: Sub-Elite-Startnummer, Start in der ersten Reihe, VIP-Zone-Zugang, VIP-Garderobe, VIP-Catering, Ergebnis-SMS

## 🎯 Highlights

✅ **Ikonische Strecke** durch die Stadt Porto  
✅ **Finisher-Medaille** mit optionaler Gravur von Name und Zeit  
✅ **Teilnehmerkit** mit Startnummer und Zeitmesschip  
✅ **5 Verpflegungsstationen** entlang der Strecke  
✅ **Duschen** verfügbar im Clube Fluvial Portuense (10:15-12:30)  
✅ **Super Bock Bier** im Ziel für alle Finisher 🍺  

## 📋 Kit-Abholung

**Ort**: Alameda Shop & Spot (Einkaufszentrum)

**Zeiten**:
- **Freitag, 11. September**: 10:00 bis 23:00 Uhr
- **Samstag, 12. September**: 10:00 bis 23:00 Uhr

⚠️ **Außerhalb dieser Zeiten werden keine Kits ausgegeben.**

## 💧 Verpflegungsstationen

| Km | Verpflegung |
|---|---|
| 5 km | Vitalis Wasser |
| 10 km | Vitalis Wasser, Powerade |
| 15 km | Vitalis Wasser, Powerade |
| 20 km | Vitalis Wasser |
| Ziel | Vitalis Wasser, Super Bock Bier 🍺 |

## 🏅 Medaillen-Gravur

- **Online oder auf der Expo**: 7,50€ (Sonderpreis)
- **Am Renntag**: 10€ (am Gravurstand im Ziel)`,
      city: "Porto",
      metaTitle: "Hyundai Halbmarathon Porto 2026 | Porto | 13. September",
      metaDescription:
        "Hyundai Halbmarathon Porto 2026 - 13. September in Porto. Halbmarathon 21km durch die ikonischen Straßen der Invicta. Anmeldung ab 22,50€. Finisher-Medaille mit Gravur.",
    },
    it: {
      title: "Hyundai Mezza Maratona di Porto 2026",
      description: `# 🏃 Hyundai Mezza Maratona di Porto 2026

**La corsa iconica attraverso la città Invicta! Percorri le strade storiche di Porto in una delle mezze maratone più emblematiche del Portogallo.**

---

## 📅 Data e Orario

- **Data**: 13 settembre 2026 (Domenica)
- **Ora di Partenza**: 09:00
- **Luogo di Partenza**: Av. de Dom Carlos I, Porto
- **Tempo Limite**: 3 ore (12:00)

## 🏃 Gare Disponibili

### Mezza Maratona - 21 km
- **Distanza**: 21 km
- **Ora di Partenza**: 09:00
- **Tempo Limite**: 3 ore
- **Iscrizioni Limitate**

### VIP Marathon - 21 km
- **Distanza**: 21 km
- **Posti**: Limitato a 50 partecipanti
- **Vantaggi VIP**: Pettorale Sub-Elite, Partenza in prima fila, Accesso Zona VIP, Guardaroba VIP, Catering VIP, SMS risultati

## 🎯 Punti di Forza

✅ **Percorso iconico** attraverso la città di Porto  
✅ **Medaglia finisher** con incisione opzionale di nome e tempo  
✅ **Kit partecipante** con pettorale e chip di cronometraggio  
✅ **5 punti di ristoro** lungo il percorso  
✅ **Docce** disponibili al Clube Fluvial Portuense (10:15-12:30)  
✅ **Birra Super Bock** al traguardo per tutti i finisher 🍺  

## 📋 Ritiro del Kit

**Luogo**: Alameda Shop & Spot (Centro Commerciale)

**Orari**:
- **Venerdì 11 settembre**: 10:00 - 23:00
- **Sabato 12 settembre**: 10:00 - 23:00

⚠️ **Non saranno distribuiti kit al di fuori di questi orari.**

## 💧 Punti di Ristoro

| Km | Ristoro |
|---|---|
| 5 km | Acqua Vitalis |
| 10 km | Acqua Vitalis, Powerade |
| 15 km | Acqua Vitalis, Powerade |
| 20 km | Acqua Vitalis |
| Traguardo | Acqua Vitalis, Birra Super Bock 🍺 |

## 🏅 Incisione Medaglie

- **Online o all'Expo**: 7,50€ (prezzo speciale)
- **Il giorno della gara**: 10€ (allo stand di incisione al traguardo)`,
      city: "Porto",
      metaTitle: "Hyundai Mezza Maratona di Porto 2026 | Porto | 13 Settembre",
      metaDescription:
        "Hyundai Mezza Maratona di Porto 2026 - 13 settembre a Porto. Mezza Maratona 21km attraverso le strade iconiche dell'Invicta. Iscrizioni da 22,50€. Medaglia finisher con incisione.",
    },
  };

  // Create translations for all languages
  const languages: Language[] = ["pt", "en", "es", "fr", "de", "it"];

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

  console.log("✅ Created translations for all languages");

  // Define race variants with pricing phases
  const variants = [
    {
      name: "Meia Maratona 21K",
      distanceKm: 21,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-09-13T09:00:00Z"),
      startTime: "09:00",
      cutoffTimeHours: 3,
      price: 60,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Meia Maratona oficial · Percurso urbano e paisagístico pela cidade do Porto · Inscrições limitadas · Inclui: Dorsal, Chip de cronometragem, Seguro desportivo",
      pricingPhases: [
        {
          name: "Promoção de Natal",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 22.5,
          currency: Currency.EUR,
          note: "Promoção de Natal (até 31 de Dezembro)",
        },
        {
          name: "1ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-03-31T23:59:59Z"),
          price: 30,
          currency: Currency.EUR,
          note: "1ª Fase (até 31 de Março)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-04-01T00:00:00Z"),
          endDate: new Date("2026-08-31T23:59:59Z"),
          price: 35,
          currency: Currency.EUR,
          note: "2ª Fase (até 31 de Agosto)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-09-01T00:00:00Z"),
          endDate: new Date("2026-09-08T23:59:59Z"),
          price: 55,
          currency: Currency.EUR,
          note: "3ª Fase (até 8 de Setembro)",
        },
        {
          name: "Last Minute (EXPO)",
          startDate: new Date("2026-09-09T00:00:00Z"),
          endDate: new Date("2026-09-12T23:59:59Z"),
          price: 60,
          currency: Currency.EUR,
          note: "Last Minute na EXPO (11-12 Setembro)",
        },
      ],
    },
    {
      name: "VIP Marathon 21K",
      distanceKm: 21,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-09-13T09:00:00Z"),
      startTime: "09:00",
      cutoffTimeHours: 3,
      price: 250,
      currency: Currency.EUR,
      maxParticipants: 50,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Experiência VIP · Dorsal Sub-Elite · Partida na linha da frente · Zona VIP exclusiva · Bengaleiro VIP · Catering VIP · SMS de resultados · Limitado a 50 participantes",
      pricingPhases: [
        {
          name: "Preço Único",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-09-08T23:59:59Z"),
          price: 250,
          currency: Currency.EUR,
          note: "Preço único VIP (até 8 de Setembro)",
        },
      ],
    },
  ];

  // Delete existing pricing phases for this event to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

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

    // Create pricing phases for this variant
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id, // ✅ CORRECT: linked to eventId
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

  console.log("✅ Seed completed successfully!");
  console.log(`
📊 Summary:
- Event: Hyundai Meia Maratona do Porto 2026
- Variants: 2 (Meia Maratona 21K + VIP 21K)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 6 total (5 Meia Maratona + 1 VIP)
- Date: September 13, 2026
- Location: Porto, Portugal
- Start: Av. de Dom Carlos I
- Website: https://www.meiamaratonadoporto.com
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
