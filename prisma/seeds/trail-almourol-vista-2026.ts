/**
 * Seed: 9º Trail Running Almourol À Vista 2026
 *
 * Event: Trail running event with 4 race variants
 * Location: Vila Nova da Barquinha, Santarém, Portugal
 * Date: March 1, 2026
 * Organizer: GC Barquinhense
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding 9º Trail Running Almourol À Vista 2026...");

  // Delete existing event if it exists (idempotency)
  await prisma.event.deleteMany({
    where: {
      OR: [
        { slug: "trail-almourol-vista-2026" },
        { slug: "trail-running-almourol-a-vista-2026" },
      ],
    },
  });

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "9º Trail Running Almourol À Vista 2026",
      slug: "trail-almourol-vista-2026",
      description:
        "9ª Edição do Trail Running Almourol À Vista em Vila Nova da Barquinha",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-01T09:00:00Z"),
      endDate: new Date("2026-03-01T18:00:00Z"),
      registrationDeadline: new Date("2026-02-22T23:59:59Z"),
      imageUrl: "", // To be uploaded via admin
      city: "Vila Nova da Barquinha",
      country: "Portugal",
      latitude: 39.4553,
      longitude: -8.4347,
      externalUrl:
        "https://www.trilhoperdido.com/evento/trail-running-almourol-a-vista-2026",
      isFeatured: false,
      cancelled: false,
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // Translations for all 6 languages
  const translations = {
    pt: {
      title: "9º Trail Running Almourol À Vista 2026",
      description: `# 🏰 9º Trail Running Almourol À Vista 2026

**9ª Edição — 1 de Março de 2026 — Vila Nova da Barquinha**

---

## 📅 Data e Local

- **Data**: 1 de Março de 2026 (Domingo)
- **Local**: Avenida dos Plátanos (Parque Ribeirinho), Vila Nova da Barquinha
- **Limite de inscrições**: 1400 participantes
- **Data limite de inscrição**: 22 de Fevereiro de 2026

## 🏃 Provas Disponíveis

### Trail Longo — 30 km
- **Distância**: 30 km
- **Partida**: 09:00
- **Dorsais com chip**

### Trail Curto — 20 km
- **Distância**: 20 km
- **Partida**: 09:15
- **Dorsais com chip**

### Mini Trail — 13 km
- **Distância**: 13 km
- **Partida**: 09:25
- **Dorsais com chip**

### Caminhada — 13 km
- **Distância**: 13 km
- **Partida**: 09:30
- **Dorsais sem chip (não competitivo)**

## ⏰ Horários

**Sábado, 28 de Fevereiro:**
- 17:00 – Abertura do secretariado
- 20:00 – Fecho do secretariado

**Domingo, 1 de Março:**
- 07:00 – Abertura do secretariado
- 08:30 – Fecho do secretariado
- 09:00 – Partida do Trail Longo
- 09:15 – Partida do Trail Curto
- 09:25 – Partida do Mini Trail
- 09:30 – Partida da Caminhada

## 🎫 Inscrições e Preços

### 1ª Fase (1 Dezembro 2025 – 18 Janeiro 2026)
| Prova | Preço |
|-------|-------|
| Trail Longo 30 km | 17€ |
| Trail Curto 20 km | 15€ |
| Mini Trail 13 km | 11€ |
| Caminhada 13 km | 11€ |

### 2ª Fase (19 Janeiro – 22 Fevereiro 2026)
| Prova | Preço |
|-------|-------|
| Trail Longo 30 km | 19€ |
| Trail Curto 20 km | 17€ |
| Mini Trail 13 km | 12€ |
| Caminhada 13 km | 12€ |

**Opcionais:**
- T-Shirt: 9€
- Refeição (sopa + bifana + bebida): 7,50€

## ✅ Inclui na Inscrição

- Participação numa das provas
- Dorsal com chip (TL, TC e MT)
- Seguro de Acidentes Pessoais
- Seguro de Responsabilidade Civil
- Apoio logístico e técnico
- Primeiros socorros
- Abastecimentos sólidos e líquidos

## 🏆 Prémios

- Prémios para os 3 primeiros classificados da geral masculina e feminina
- Prémios para os 3 primeiros classificados de cada escalão
- Troféu à equipa com mais elementos inscritos

## 📋 Escalões

Juvenil M/F (16-17 anos, até 15km) | Juniores M/F (18-19 anos, até 25km) | Sub 23 M/F (20-22 anos) | Seniores M/F (23-34 anos) | M35-M70 / F35-F70 (escalões de 5 em 5 anos)

## 📞 Contactos

- **Email**: trailrunningalmourolavista@gcbarquinhense.pt
- **Inscrições**: infotrilhoperdido@gmail.com
- **Telefone**: 919 998 490 (Hugo Mendes)

---

*Organizado pelo GC Barquinhense com cronometragem Trilho Perdido*`,
      city: "Vila Nova da Barquinha",
      region: "Santarém",
      country: "Portugal",
      metaTitle:
        "9º Trail Running Almourol À Vista 2026 | Vila Nova da Barquinha | 1 Março",
      metaDescription:
        "9º Trail Running Almourol À Vista 2026 - 1 de março em Vila Nova da Barquinha. Provas: Trail Longo 30km, Trail Curto 20km, Mini Trail 13km e Caminhada 13km. Limite de 1400 inscrições.",
    },
    en: {
      title: "9th Trail Running Almourol À Vista 2026",
      description: `# 🏰 9th Trail Running Almourol À Vista 2026

**9th Edition — March 1, 2026 — Vila Nova da Barquinha**

---

## 📅 Date and Location

- **Date**: March 1, 2026 (Sunday)
- **Location**: Avenida dos Plátanos (Riverside Park), Vila Nova da Barquinha
- **Registration limit**: 1,400 participants
- **Registration deadline**: February 22, 2026

## 🏃 Available Races

### Long Trail — 30 km
- **Distance**: 30 km
- **Start**: 09:00
- **Bibs with chip**

### Short Trail — 20 km
- **Distance**: 20 km
- **Start**: 09:15
- **Bibs with chip**

### Mini Trail — 13 km
- **Distance**: 13 km
- **Start**: 09:25
- **Bibs with chip**

### Walk — 13 km
- **Distance**: 13 km
- **Start**: 09:30
- **Bibs without chip (non-competitive)**

## ⏰ Schedule

**Saturday, February 28:**
- 17:00 – Registration desk opens
- 20:00 – Registration desk closes

**Sunday, March 1:**
- 07:00 – Registration desk opens
- 08:30 – Registration desk closes
- 09:00 – Long Trail start
- 09:15 – Short Trail start
- 09:25 – Mini Trail start
- 09:30 – Walk start

## 🎫 Registration and Prices

### Phase 1 (December 1, 2025 – January 18, 2026)
| Race | Price |
|------|-------|
| Long Trail 30 km | €17 |
| Short Trail 20 km | €15 |
| Mini Trail 13 km | €11 |
| Walk 13 km | €11 |

### Phase 2 (January 19 – February 22, 2026)
| Race | Price |
|------|-------|
| Long Trail 30 km | €19 |
| Short Trail 20 km | €17 |
| Mini Trail 13 km | €12 |
| Walk 13 km | €12 |

**Optional extras:**
- T-Shirt: €9
- Meal (soup + steak sandwich + drink): €7.50

## ✅ Included in Registration

- Participation in one of the races
- Bib with chip (Long, Short and Mini Trail)
- Personal accident insurance
- Civil liability insurance
- Logistical and technical support
- First aid
- Solid and liquid refreshments

## 🏆 Awards

- Awards for the top 3 finishers in the overall male and female categories
- Awards for the top 3 in each age group
- Trophy for the team with the most registered members

## 📋 Age Categories

Youth M/F (16-17 years, up to 15km) | Juniors M/F (18-19 years, up to 25km) | Sub 23 M/F (20-22 years) | Seniors M/F (23-34 years) | M35-M70 / F35-F70 (5-year intervals)

## 📞 Contact

- **Email**: trailrunningalmourolavista@gcbarquinhense.pt
- **Registration**: infotrilhoperdido@gmail.com
- **Phone**: 919 998 490 (Hugo Mendes)

---

*Organized by GC Barquinhense with timing by Trilho Perdido*`,
      city: "Vila Nova da Barquinha",
      region: "Santarém",
      country: "Portugal",
      metaTitle:
        "9th Trail Running Almourol À Vista 2026 | Vila Nova da Barquinha | March 1",
      metaDescription:
        "9th Trail Running Almourol À Vista 2026 - March 1 in Vila Nova da Barquinha. Races: Long Trail 30km, Short Trail 20km, Mini Trail 13km and Walk 13km. Limited to 1,400 entries.",
    },
    es: {
      title: "9º Trail Running Almourol À Vista 2026",
      description: `# 🏰 9º Trail Running Almourol À Vista 2026

**9ª Edición — 1 de Marzo de 2026 — Vila Nova da Barquinha**

---

## 📅 Fecha y Lugar

- **Fecha**: 1 de Marzo de 2026 (Domingo)
- **Lugar**: Avenida dos Plátanos (Parque Ribereño), Vila Nova da Barquinha
- **Límite de inscripciones**: 1.400 participantes
- **Fecha límite de inscripción**: 22 de Febrero de 2026

## 🏃 Carreras Disponibles

### Trail Largo — 30 km
- **Distancia**: 30 km
- **Salida**: 09:00
- **Dorsales con chip**

### Trail Corto — 20 km
- **Distancia**: 20 km
- **Salida**: 09:15
- **Dorsales con chip**

### Mini Trail — 13 km
- **Distancia**: 13 km
- **Salida**: 09:25
- **Dorsales con chip**

### Caminata — 13 km
- **Distancia**: 13 km
- **Salida**: 09:30
- **Dorsales sin chip (no competitivo)**

## ⏰ Horarios

**Sábado, 28 de Febrero:**
- 17:00 – Apertura del secretariado
- 20:00 – Cierre del secretariado

**Domingo, 1 de Marzo:**
- 07:00 – Apertura del secretariado
- 08:30 – Cierre del secretariado
- 09:00 – Salida del Trail Largo
- 09:15 – Salida del Trail Corto
- 09:25 – Salida del Mini Trail
- 09:30 – Salida de la Caminata

## 🎫 Inscripciones y Precios

### Fase 1 (1 Diciembre 2025 – 18 Enero 2026)
| Carrera | Precio |
|---------|--------|
| Trail Largo 30 km | 17€ |
| Trail Corto 20 km | 15€ |
| Mini Trail 13 km | 11€ |
| Caminata 13 km | 11€ |

### Fase 2 (19 Enero – 22 Febrero 2026)
| Carrera | Precio |
|---------|--------|
| Trail Largo 30 km | 19€ |
| Trail Corto 20 km | 17€ |
| Mini Trail 13 km | 12€ |
| Caminata 13 km | 12€ |

**Opcionales:**
- Camiseta: 9€
- Comida (sopa + bocadillo de ternera + bebida): 7,50€

## ✅ Incluido en la Inscripción

- Participación en una de las carreras
- Dorsal con chip (TL, TC y MT)
- Seguro de accidentes personales
- Seguro de responsabilidad civil
- Apoyo logístico y técnico
- Primeros auxilios
- Avituallamientos sólidos y líquidos

## 🏆 Premios

- Premios para los 3 primeros clasificados de la general masculina y femenina
- Premios para los 3 primeros clasificados de cada categoría
- Trofeo al equipo con más miembros inscritos

## 📋 Categorías

Juvenil M/F (16-17 años, hasta 15km) | Júnior M/F (18-19 años, hasta 25km) | Sub 23 M/F (20-22 años) | Sénior M/F (23-34 años) | M35-M70 / F35-F70 (intervalos de 5 años)

## 📞 Contacto

- **Email**: trailrunningalmourolavista@gcbarquinhense.pt
- **Inscripciones**: infotrilhoperdido@gmail.com
- **Teléfono**: 919 998 490 (Hugo Mendes)

---

*Organizado por GC Barquinhense con cronometraje de Trilho Perdido*`,
      city: "Vila Nova da Barquinha",
      region: "Santarém",
      country: "Portugal",
      metaTitle:
        "9º Trail Running Almourol À Vista 2026 | Vila Nova da Barquinha | 1 Marzo",
      metaDescription:
        "9º Trail Running Almourol À Vista 2026 - 1 de marzo en Vila Nova da Barquinha. Carreras: Trail Largo 30km, Trail Corto 20km, Mini Trail 13km y Caminata 13km. Límite de 1.400 inscripciones.",
    },
    fr: {
      title: "9e Trail Running Almourol À Vista 2026",
      description: `# 🏰 9e Trail Running Almourol À Vista 2026

**9e Édition — 1er Mars 2026 — Vila Nova da Barquinha**

---

## 📅 Date et Lieu

- **Date** : 1er Mars 2026 (Dimanche)
- **Lieu** : Avenida dos Plátanos (Parc Riverain), Vila Nova da Barquinha
- **Limite d'inscriptions** : 1 400 participants
- **Date limite d'inscription** : 22 Février 2026

## 🏃 Courses Disponibles

### Trail Long — 30 km
- **Distance** : 30 km
- **Départ** : 09h00
- **Dossards avec puce**

### Trail Court — 20 km
- **Distance** : 20 km
- **Départ** : 09h15
- **Dossards avec puce**

### Mini Trail — 13 km
- **Distance** : 13 km
- **Départ** : 09h25
- **Dossards avec puce**

### Marche — 13 km
- **Distance** : 13 km
- **Départ** : 09h30
- **Dossards sans puce (non compétitif)**

## ⏰ Horaires

**Samedi 28 Février :**
- 17h00 – Ouverture du secrétariat
- 20h00 – Fermeture du secrétariat

**Dimanche 1er Mars :**
- 07h00 – Ouverture du secrétariat
- 08h30 – Fermeture du secrétariat
- 09h00 – Départ du Trail Long
- 09h15 – Départ du Trail Court
- 09h25 – Départ du Mini Trail
- 09h30 – Départ de la Marche

## 🎫 Inscriptions et Tarifs

### Phase 1 (1er Décembre 2025 – 18 Janvier 2026)
| Course | Prix |
|--------|------|
| Trail Long 30 km | 17€ |
| Trail Court 20 km | 15€ |
| Mini Trail 13 km | 11€ |
| Marche 13 km | 11€ |

### Phase 2 (19 Janvier – 22 Février 2026)
| Course | Prix |
|--------|------|
| Trail Long 30 km | 19€ |
| Trail Court 20 km | 17€ |
| Mini Trail 13 km | 12€ |
| Marche 13 km | 12€ |

**En option :**
- T-Shirt : 9€
- Repas (soupe + steak sandwich + boisson) : 7,50€

## ✅ Inclus dans l'Inscription

- Participation à une des courses
- Dossard avec puce (TL, TC et MT)
- Assurance accidents personnels
- Assurance responsabilité civile
- Support logistique et technique
- Premiers secours
- Ravitaillements solides et liquides

## 🏆 Prix

- Prix pour les 3 premiers classés du général masculin et féminin
- Prix pour les 3 premiers de chaque catégorie d'âge
- Trophée à l'équipe avec le plus de membres inscrits

## 📋 Catégories d'Âge

Cadets M/F (16-17 ans, jusqu'à 15km) | Juniors M/F (18-19 ans, jusqu'à 25km) | Sub 23 M/F (20-22 ans) | Seniors M/F (23-34 ans) | M35-M70 / F35-F70 (intervalles de 5 ans)

## 📞 Contact

- **Email** : trailrunningalmourolavista@gcbarquinhense.pt
- **Inscriptions** : infotrilhoperdido@gmail.com
- **Téléphone** : 919 998 490 (Hugo Mendes)

---

*Organisé par GC Barquinhense avec chronométrage par Trilho Perdido*`,
      city: "Vila Nova da Barquinha",
      region: "Santarém",
      country: "Portugal",
      metaTitle:
        "9e Trail Running Almourol À Vista 2026 | Vila Nova da Barquinha | 1er Mars",
      metaDescription:
        "9e Trail Running Almourol À Vista 2026 - 1er mars à Vila Nova da Barquinha. Courses : Trail Long 30km, Trail Court 20km, Mini Trail 13km et Marche 13km. Limité à 1 400 inscriptions.",
    },
    de: {
      title: "9. Trail Running Almourol À Vista 2026",
      description: `# 🏰 9. Trail Running Almourol À Vista 2026

**9. Ausgabe — 1. März 2026 — Vila Nova da Barquinha**

---

## 📅 Datum und Ort

- **Datum**: 1. März 2026 (Sonntag)
- **Ort**: Avenida dos Plátanos (Uferpark), Vila Nova da Barquinha
- **Anmeldelimit**: 1.400 Teilnehmer
- **Anmeldeschluss**: 22. Februar 2026

## 🏃 Verfügbare Rennen

### Trail Lang — 30 km
- **Distanz**: 30 km
- **Start**: 09:00
- **Startnummern mit Chip**

### Trail Kurz — 20 km
- **Distanz**: 20 km
- **Start**: 09:15
- **Startnummern mit Chip**

### Mini Trail — 13 km
- **Distanz**: 13 km
- **Start**: 09:25
- **Startnummern mit Chip**

### Wanderung — 13 km
- **Distanz**: 13 km
- **Start**: 09:30
- **Startnummern ohne Chip (nicht kompetitiv)**

## ⏰ Zeitplan

**Samstag, 28. Februar:**
- 17:00 – Eröffnung des Sekretariats
- 20:00 – Schließung des Sekretariats

**Sonntag, 1. März:**
- 07:00 – Eröffnung des Sekretariats
- 08:30 – Schließung des Sekretariats
- 09:00 – Start Trail Lang
- 09:15 – Start Trail Kurz
- 09:25 – Start Mini Trail
- 09:30 – Start Wanderung

## 🎫 Anmeldung und Preise

### Phase 1 (1. Dezember 2025 – 18. Januar 2026)
| Rennen | Preis |
|--------|-------|
| Trail Lang 30 km | 17€ |
| Trail Kurz 20 km | 15€ |
| Mini Trail 13 km | 11€ |
| Wanderung 13 km | 11€ |

### Phase 2 (19. Januar – 22. Februar 2026)
| Rennen | Preis |
|--------|-------|
| Trail Lang 30 km | 19€ |
| Trail Kurz 20 km | 17€ |
| Mini Trail 13 km | 12€ |
| Wanderung 13 km | 12€ |

**Optionale Extras:**
- T-Shirt: 9€
- Mahlzeit (Suppe + Steak-Sandwich + Getränk): 7,50€

## ✅ In der Anmeldung enthalten

- Teilnahme an einem der Rennen
- Startnummer mit Chip (TL, TK und MT)
- Unfallversicherung
- Haftpflichtversicherung
- Logistische und technische Unterstützung
- Erste Hilfe
- Feste und flüssige Verpflegung

## 🏆 Preise

- Preise für die 3 Erstplatzierten der Gesamtwertung (männlich und weiblich)
- Preise für die 3 Erstplatzierten jeder Altersklasse
- Trophäe für das Team mit den meisten angemeldeten Mitgliedern

## 📋 Altersklassen

Jugend M/W (16-17 Jahre, bis 15km) | Junioren M/W (18-19 Jahre, bis 25km) | Sub 23 M/W (20-22 Jahre) | Senioren M/W (23-34 Jahre) | M35-M70 / F35-F70 (5-Jahres-Intervalle)

## 📞 Kontakt

- **E-Mail**: trailrunningalmourolavista@gcbarquinhense.pt
- **Anmeldung**: infotrilhoperdido@gmail.com
- **Telefon**: 919 998 490 (Hugo Mendes)

---

*Organisiert vom GC Barquinhense mit Zeitmessung durch Trilho Perdido*`,
      city: "Vila Nova da Barquinha",
      region: "Santarém",
      country: "Portugal",
      metaTitle:
        "9. Trail Running Almourol À Vista 2026 | Vila Nova da Barquinha | 1. März",
      metaDescription:
        "9. Trail Running Almourol À Vista 2026 - 1. März in Vila Nova da Barquinha. Rennen: Trail Lang 30km, Trail Kurz 20km, Mini Trail 13km und Wanderung 13km. Begrenzt auf 1.400 Anmeldungen.",
    },
    it: {
      title: "9° Trail Running Almourol À Vista 2026",
      description: `# 🏰 9° Trail Running Almourol À Vista 2026

**9ª Edizione — 1 Marzo 2026 — Vila Nova da Barquinha**

---

## 📅 Data e Luogo

- **Data**: 1 Marzo 2026 (Domenica)
- **Luogo**: Avenida dos Plátanos (Parco Fluviale), Vila Nova da Barquinha
- **Limite iscrizioni**: 1.400 partecipanti
- **Scadenza iscrizioni**: 22 Febbraio 2026

## 🏃 Gare Disponibili

### Trail Lungo — 30 km
- **Distanza**: 30 km
- **Partenza**: 09:00
- **Pettorali con chip**

### Trail Corto — 20 km
- **Distanza**: 20 km
- **Partenza**: 09:15
- **Pettorali con chip**

### Mini Trail — 13 km
- **Distanza**: 13 km
- **Partenza**: 09:25
- **Pettorali con chip**

### Camminata — 13 km
- **Distanza**: 13 km
- **Partenza**: 09:30
- **Pettorali senza chip (non competitivo)**

## ⏰ Orari

**Sabato 28 Febbraio:**
- 17:00 – Apertura segreteria
- 20:00 – Chiusura segreteria

**Domenica 1 Marzo:**
- 07:00 – Apertura segreteria
- 08:30 – Chiusura segreteria
- 09:00 – Partenza Trail Lungo
- 09:15 – Partenza Trail Corto
- 09:25 – Partenza Mini Trail
- 09:30 – Partenza Camminata

## 🎫 Iscrizioni e Prezzi

### Fase 1 (1 Dicembre 2025 – 18 Gennaio 2026)
| Gara | Prezzo |
|------|--------|
| Trail Lungo 30 km | 17€ |
| Trail Corto 20 km | 15€ |
| Mini Trail 13 km | 11€ |
| Camminata 13 km | 11€ |

### Fase 2 (19 Gennaio – 22 Febbraio 2026)
| Gara | Prezzo |
|------|--------|
| Trail Lungo 30 km | 19€ |
| Trail Corto 20 km | 17€ |
| Mini Trail 13 km | 12€ |
| Camminata 13 km | 12€ |

**Extra opzionali:**
- T-Shirt: 9€
- Pasto (zuppa + panino con bistecca + bevanda): 7,50€

## ✅ Incluso nell'Iscrizione

- Partecipazione a una delle gare
- Pettorale con chip (TL, TC e MT)
- Assicurazione infortuni personali
- Assicurazione responsabilità civile
- Supporto logistico e tecnico
- Primo soccorso
- Rifornimenti solidi e liquidi

## 🏆 Premi

- Premi per i primi 3 classificati della classifica generale maschile e femminile
- Premi per i primi 3 di ogni categoria d'età
- Trofeo alla squadra con più iscritti

## 📋 Categorie d'Età

Giovani M/F (16-17 anni, fino a 15km) | Juniores M/F (18-19 anni, fino a 25km) | Sub 23 M/F (20-22 anni) | Seniores M/F (23-34 anni) | M35-M70 / F35-F70 (intervalli di 5 anni)

## 📞 Contatti

- **Email**: trailrunningalmourolavista@gcbarquinhense.pt
- **Iscrizioni**: infotrilhoperdido@gmail.com
- **Telefono**: 919 998 490 (Hugo Mendes)

---

*Organizzato dal GC Barquinhense con cronometraggio di Trilho Perdido*`,
      city: "Vila Nova da Barquinha",
      region: "Santarém",
      country: "Portugal",
      metaTitle:
        "9° Trail Running Almourol À Vista 2026 | Vila Nova da Barquinha | 1 Marzo",
      metaDescription:
        "9° Trail Running Almourol À Vista 2026 - 1 marzo a Vila Nova da Barquinha. Gare: Trail Lungo 30km, Trail Corto 20km, Mini Trail 13km e Camminata 13km. Limitato a 1.400 iscrizioni.",
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
      name: "Trail Longo",
      distanceKm: 30,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-03-01T09:00:00Z"),
      startTime: "09:00",
      cutoffTimeHours: null,
      price: 19,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Trail · Cronometragem por chip · Restrição de idade: Juniores (18-19 anos) até 25km",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-01-18T23:59:59Z"),
          price: 17,
          currency: Currency.EUR,
          note: "1ª Fase (1 Dezembro – 18 Janeiro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-19T00:00:00Z"),
          endDate: new Date("2026-02-22T23:59:59Z"),
          price: 19,
          currency: Currency.EUR,
          note: "2ª Fase (19 Janeiro – 22 Fevereiro)",
        },
      ],
    },
    {
      name: "Trail Curto",
      distanceKm: 20,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-03-01T09:15:00Z"),
      startTime: "09:15",
      cutoffTimeHours: null,
      price: 17,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Trail · Cronometragem por chip · Restrição de idade: Juniores (18-19 anos) até 25km",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-01-18T23:59:59Z"),
          price: 15,
          currency: Currency.EUR,
          note: "1ª Fase (1 Dezembro – 18 Janeiro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-19T00:00:00Z"),
          endDate: new Date("2026-02-22T23:59:59Z"),
          price: 17,
          currency: Currency.EUR,
          note: "2ª Fase (19 Janeiro – 22 Fevereiro)",
        },
      ],
    },
    {
      name: "Mini Trail",
      distanceKm: 13,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-03-01T09:25:00Z"),
      startTime: "09:25",
      cutoffTimeHours: null,
      price: 12,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Trail · Cronometragem por chip · Restrição de idade: Juvenil (16-17 anos) até 15km",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-01-18T23:59:59Z"),
          price: 11,
          currency: Currency.EUR,
          note: "1ª Fase (1 Dezembro – 18 Janeiro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-19T00:00:00Z"),
          endDate: new Date("2026-02-22T23:59:59Z"),
          price: 12,
          currency: Currency.EUR,
          note: "2ª Fase (19 Janeiro – 22 Fevereiro)",
        },
      ],
    },
    {
      name: "Caminhada",
      distanceKm: 13,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-03-01T09:30:00Z"),
      startTime: "09:30",
      cutoffTimeHours: null,
      price: 12,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Trail · Não competitivo · Sem cronometragem por chip",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-01-18T23:59:59Z"),
          price: 11,
          currency: Currency.EUR,
          note: "1ª Fase (1 Dezembro – 18 Janeiro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-19T00:00:00Z"),
          endDate: new Date("2026-02-22T23:59:59Z"),
          price: 12,
          currency: Currency.EUR,
          note: "2ª Fase (19 Janeiro – 22 Fevereiro)",
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
- Event: 9º Trail Running Almourol À Vista 2026
- Variants: 4 (Trail Longo 30km, Trail Curto 20km, Mini Trail 13km, Caminhada 13km)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 8 total (2 per variant)
- Date: March 1, 2026
- Location: Vila Nova da Barquinha, Santarém
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
