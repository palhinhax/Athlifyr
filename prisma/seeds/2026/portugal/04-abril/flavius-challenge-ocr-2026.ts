/**
 * Seed Flavius Challenge OCR 2026 – Campeonato Nacional OCR
 * Corrida de obstáculos em Chaves, 18 e 19 de abril de 2026
 * Organização: Wildfun / Flavius Challenge OCR
 * Source: https://lap2go.com/pt/event/ocr-flavius-challenge-2026
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Flavius Challenge OCR 2026 – Chaves...");

  const languages: Language[] = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  // ── Description PT ──
  const descriptionPT = `# 🏃 Campeonato Nacional OCR 2026 – Flavius Challenge

O **Campeonato Nacional OCR 2026** realiza-se nos dias **18 e 19 de abril de 2026** em **Chaves**, com partida e chegada na **Alameda do Trajano, junto às Piscinas Municipais**. Evento organizado pela **Flavius Challenge OCR / Wildfun**, com o apoio da Federação Portuguesa de Corridas de Obstáculos (FPOCR), da Federação Portuguesa de Pentatlo Moderno e do Município de Chaves.

---

## 🗓️ Programa

- **18 de abril** (início: 14h30): Short Course 3KM + Kids 1KM
- **19 de abril** (início: 9h30): Standard Course 14KM + Open 10KM

---

## 🏅 Provas disponíveis

### 🔵 Short Course – 3KM (CN e Flavius Challenge – Competição)
Corrida de obstáculos urbana com ~3 km e 20 obstáculos. Mínimo 16 anos. Time cap: 15 min/km (masculinos) e 18 min/km (femininas).

### 🔴 Standard Course – 14KM (CN e Flavius Challenge – Competição)
Corrida de obstáculos urbana com ~14 km e 40 obstáculos, incluindo travessia a nado do Rio Tâmega. Mínimo 16 anos.

### 🟢 Open – 10KM
Cronometrado, mas sem classificação oficial. Sem obrigação de realizar os obstáculos. Mínimo 13 anos (menores acompanhados por adulto inscrito).

### 🟡 Kids – 1KM
Percurso especial para crianças dos 6 aos 12 anos, com ~1 km e 10 obstáculos de baixa dificuldade. Limitado a 100 vagas. T-shirt de oferta.

---

## 💰 Fases de Inscrição

| Prova | 1ª Fase (até 28/02) | 2ª Fase (até 21/03) | 3ª Fase (até 04/04) | 4ª Fase (até 09/04) |
|---|---|---|---|---|
| Open 10KM | 22€ / 20€ grupo | 25€ / 23€ grupo | 28€ / 26€ grupo | 38€ / 36€ grupo |
| CN Standard 14KM | 24€ / 21€ grupo | 26€ / 23€ grupo | 31€ / 26€ grupo | 41€ / 36€ grupo |
| CN Short 3KM | 24€ / 21€ grupo | 26€ / 23€ grupo | 31€ / 26€ grupo | 41€ / 36€ grupo |
| Pack CN 3KM+14KM | 42€ / 36€ grupo | 46€ / 40€ grupo | 56€ / 46€ grupo | 75€ / 65€ grupo |
| Flavius Standard 14KM | 24€ / 21€ grupo | 26€ / 23€ grupo | 31€ / 26€ grupo | 41€ / 36€ grupo |
| Flavius Short 3KM | 24€ / 21€ grupo | 26€ / 23€ grupo | 31€ / 26€ grupo | 41€ / 36€ grupo |
| Pack Flavius 3KM+14KM | 42€ / 36€ grupo | 46€ / 40€ grupo | 56€ / 46€ grupo | 75€ / 65€ grupo |
| Kids 1KM | 3€ (com t-shirt) | 5€ (com t-shirt) | — | — |

Inscrições de grupo requerem mínimo 4 elementos.

---

## 🎒 Kit do Atleta

O kit inclui **dorsal, t-shirt, mochila do evento e ofertas dos parceiros**. O levantamento é feito no local do evento. Kits não recolhidos ficam guardados 10 dias após o evento.

---

## 🏊 Percurso

O percurso inclui obstáculos naturais e artificiais em ambiente urbano. No Standard Course (14km e 10km) existe um obstáculo de natação no **Rio Tâmega** — quem não saiba nadar não deve tentar este obstáculo.

---

## 🔄 Transferência de Inscrição

Até **5 de abril de 2026**, podes transferir a inscrição para outra pessoa por email: **geral@wildfun.pt**

---

## 📍 Local

**Alameda do Trajano, junto às Piscinas Municipais**
Chaves, Vila Real, Portugal
Coordenadas: 41°44'11.4"N 7°28'17.2"W

---

## 📞 Contacto

- **Web:** www.wildfun.pt
- **Email:** geral@wildfun.pt
- **Cronometragem:** LAP2GO`;

  // ── Event upsert ──
  const event = await prisma.event.upsert({
    where: { slug: "flavius-challenge-ocr-2026" },
    update: {
      title: "Flavius Challenge OCR 2026",
      description: descriptionPT,
      sportTypes: [SportType.OCR],
      startDate: new Date("2026-04-18T13:30:00Z"),
      endDate: new Date("2026-04-19T18:00:00Z"),
      city: "Chaves",
      country: "Portugal",
      latitude: 41.7365,
      longitude: -7.4714,
      googleMapsUrl: "https://maps.app.goo.gl/AlamedaTrajanoChaves",
      externalUrl: "https://lap2go.com/pt/event/ocr-flavius-challenge-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-09T22:59:59Z"),
    },
    create: {
      title: "Flavius Challenge OCR 2026",
      slug: "flavius-challenge-ocr-2026",
      description: descriptionPT,
      sportTypes: [SportType.OCR],
      startDate: new Date("2026-04-18T13:30:00Z"),
      endDate: new Date("2026-04-19T18:00:00Z"),
      city: "Chaves",
      country: "Portugal",
      latitude: 41.7365,
      longitude: -7.4714,
      googleMapsUrl: "https://maps.app.goo.gl/AlamedaTrajanoChaves",
      externalUrl: "https://lap2go.com/pt/event/ocr-flavius-challenge-2026",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-09T22:59:59Z"),
    },
  });

  console.log("✅ Event upserted:", event.title);

  // ── Translations ──
  const translations: Record<
    Language,
    {
      title: string;
      description: string;
      city: string;
      metaTitle: string;
      metaDescription: string;
    }
  > = {
    [Language.pt]: {
      title: "Flavius Challenge OCR 2026",
      description: descriptionPT,
      city: "Chaves",
      metaTitle:
        "Flavius Challenge OCR 2026 – Campeonato Nacional | Chaves | 18-19 Abril",
      metaDescription:
        "Campeonato Nacional OCR 2026 em Chaves, 18 e 19 de abril. Short 3KM, Standard 14KM, Open 10KM e Kids 1KM. Inscrições a partir de 22€. Organização: Wildfun.",
    },
    [Language.en]: {
      title: "Flavius Challenge OCR 2026",
      description: `# 🏃 National OCR Championship 2026 – Flavius Challenge

The **National OCR Championship 2026** takes place on **April 18-19, 2026** in **Chaves**, starting and finishing at **Alameda do Trajano, next to the Municipal Swimming Pools**. Organized by **Flavius Challenge OCR / Wildfun**, supported by the Portuguese Obstacle Course Racing Federation (FPOCR), the Portuguese Modern Pentathlon Federation, and the Municipality of Chaves.

---

## 🗓️ Schedule

- **April 18** (start: 14:30): Short Course 3KM + Kids 1KM
- **April 19** (start: 09:30): Standard Course 14KM + Open 10KM

---

## 🏅 Available Races

### 🔵 Short Course – 3KM (CN & Flavius Challenge – Competition)
Urban obstacle course with ~3 km and 20 obstacles. Minimum age 16. Time cap: 15 min/km (men) and 18 min/km (women).

### 🔴 Standard Course – 14KM (CN & Flavius Challenge – Competition)
Urban obstacle course with ~14 km and 40 obstacles, including a swim in the Tâmega River. Minimum age 16.

### 🟢 Open – 10KM
Timed but no official ranking. No obligation to complete obstacles. Minimum age 13 (minors must be accompanied by a registered adult).

### 🟡 Kids – 1KM
Special course for children aged 6–12, ~1 km with 10 low-difficulty obstacles. Limited to 100 spots. T-shirt included.

---

## 💰 Registration Phases

| Race | Phase 1 (until 28/02) | Phase 2 (until 21/03) | Phase 3 (until 04/04) | Phase 4 (until 09/04) |
|---|---|---|---|---|
| Open 10KM | €22 / €20 group | €25 / €23 group | €28 / €26 group | €38 / €36 group |
| CN Standard 14KM | €24 / €21 group | €26 / €23 group | €31 / €26 group | €41 / €36 group |
| CN Short 3KM | €24 / €21 group | €26 / €23 group | €31 / €26 group | €41 / €36 group |
| Pack CN 3KM+14KM | €42 / €36 group | €46 / €40 group | €56 / €46 group | €75 / €65 group |
| Flavius Standard 14KM | €24 / €21 group | €26 / €23 group | €31 / €26 group | €41 / €36 group |
| Flavius Short 3KM | €24 / €21 group | €26 / €23 group | €31 / €26 group | €41 / €36 group |
| Pack Flavius 3KM+14KM | €42 / €36 group | €46 / €40 group | €56 / €46 group | €75 / €65 group |
| Kids 1KM | €3 (with t-shirt) | €5 (with t-shirt) | — | — |

Group registrations require a minimum of 4 athletes.

---

## 🎒 Athlete Kit

Kit includes **race bib, t-shirt, event backpack and partner gifts**. Collected at the event. Uncollected kits are kept for 10 days after the event.

---

## 🏊 Course

The course includes natural and artificial obstacles in an urban setting. The Standard Course (14km and 10km) includes a **swim obstacle in the Tâmega River** — athletes who cannot swim should not attempt this obstacle.

---

## 🔄 Registration Transfer

Until **April 5, 2026**, you can transfer your registration to another person by email: **geral@wildfun.pt**

---

## 📍 Location

**Alameda do Trajano, next to the Municipal Swimming Pools**
Chaves, Vila Real, Portugal

---

## 📞 Contact

- **Web:** www.wildfun.pt
- **Email:** geral@wildfun.pt
- **Timing:** LAP2GO`,
      city: "Chaves",
      metaTitle:
        "Flavius Challenge OCR 2026 – National Championship | Chaves | April 18-19",
      metaDescription:
        "National OCR Championship 2026 in Chaves, April 18-19. Short 3KM, Standard 14KM, Open 10KM and Kids 1KM. Registration from €22. Organizer: Wildfun.",
    },
    [Language.es]: {
      title: "Flavius Challenge OCR 2026",
      description: `# 🏃 Campeonato Nacional OCR 2026 – Flavius Challenge

El **Campeonato Nacional OCR 2026** se celebra los días **18 y 19 de abril de 2026** en **Chaves**, con salida y llegada en la **Alameda do Trajano, junto a las Piscinas Municipales**. Organizado por **Flavius Challenge OCR / Wildfun**, con el apoyo de la Federación Portuguesa de Carreras de Obstáculos (FPOCR), la Federación Portuguesa de Pentatlón Moderno y el Municipio de Chaves.

---

## 🗓️ Programa

- **18 de abril** (inicio: 14:30): Short Course 3KM + Kids 1KM
- **19 de abril** (inicio: 09:30): Standard Course 14KM + Open 10KM

---

## 🏅 Pruebas disponibles

### 🔵 Short Course – 3KM (CN y Flavius Challenge – Competición)
Carrera de obstáculos urbana con ~3 km y 20 obstáculos. Mínimo 16 años.

### 🔴 Standard Course – 14KM (CN y Flavius Challenge – Competición)
Carrera de obstáculos urbana con ~14 km y 40 obstáculos, incluyendo natación en el Río Tâmega. Mínimo 16 años.

### 🟢 Open – 10KM
Cronometrado, sin clasificación oficial. Sin obligación de realizar obstáculos. Mínimo 13 años.

### 🟡 Kids – 1KM
Circuito especial para niños de 6 a 12 años, ~1 km con 10 obstáculos de baja dificultad. Limitado a 100 plazas. Camiseta incluida.

---

## 💰 Fases de Inscripción

| Prueba | 1ª Fase (hasta 28/02) | 2ª Fase (hasta 21/03) | 3ª Fase (hasta 04/04) | 4ª Fase (hasta 09/04) |
|---|---|---|---|---|
| Open 10KM | 22€ / 20€ grupo | 25€ / 23€ grupo | 28€ / 26€ grupo | 38€ / 36€ grupo |
| CN Standard 14KM | 24€ / 21€ grupo | 26€ / 23€ grupo | 31€ / 26€ grupo | 41€ / 36€ grupo |
| CN Short 3KM | 24€ / 21€ grupo | 26€ / 23€ grupo | 31€ / 26€ grupo | 41€ / 36€ grupo |
| Pack CN 3KM+14KM | 42€ / 36€ grupo | 46€ / 40€ grupo | 56€ / 46€ grupo | 75€ / 65€ grupo |
| Flavius Standard 14KM | 24€ / 21€ grupo | 26€ / 23€ grupo | 31€ / 26€ grupo | 41€ / 36€ grupo |
| Flavius Short 3KM | 24€ / 21€ grupo | 26€ / 23€ grupo | 31€ / 26€ grupo | 41€ / 36€ grupo |
| Pack Flavius 3KM+14KM | 42€ / 36€ grupo | 46€ / 40€ grupo | 56€ / 46€ grupo | 75€ / 65€ grupo |
| Kids 1KM | 3€ (con camiseta) | 5€ (con camiseta) | — | — |

Las inscripciones de grupo requieren un mínimo de 4 atletas.

---

## 📍 Ubicación

**Alameda do Trajano, junto a las Piscinas Municipales**
Chaves, Vila Real, Portugal

---

## 📞 Contacto

- **Web:** www.wildfun.pt
- **Email:** geral@wildfun.pt`,
      city: "Chaves",
      metaTitle:
        "Flavius Challenge OCR 2026 – Campeonato Nacional | Chaves | 18-19 Abril",
      metaDescription:
        "Campeonato Nacional OCR 2026 en Chaves, 18 y 19 de abril. Short 3KM, Standard 14KM, Open 10KM y Kids 1KM. Inscripciones desde 22€. Organización: Wildfun.",
    },
    [Language.fr]: {
      title: "Flavius Challenge OCR 2026",
      description: `# 🏃 Championnat National OCR 2026 – Flavius Challenge

Le **Championnat National OCR 2026** se déroule les **18 et 19 avril 2026** à **Chaves**, avec départ et arrivée sur l'**Alameda do Trajano, près des Piscines Municipales**. Organisé par **Flavius Challenge OCR / Wildfun**, avec le soutien de la Fédération Portugaise de Courses d'Obstacles (FPOCR), la Fédération Portugaise de Pentathlon Moderne et la Municipalité de Chaves.

---

## 🗓️ Programme

- **18 avril** (début : 14h30) : Short Course 3KM + Kids 1KM
- **19 avril** (début : 09h30) : Standard Course 14KM + Open 10KM

---

## 🏅 Épreuves disponibles

### 🔵 Short Course – 3KM (CN & Flavius Challenge – Compétition)
Course d'obstacles urbaine d'environ 3 km et 20 obstacles. Âge minimum 16 ans.

### 🔴 Standard Course – 14KM (CN & Flavius Challenge – Compétition)
Course d'obstacles urbaine d'environ 14 km et 40 obstacles, incluant une traversée à la nage du Rio Tâmega. Âge minimum 16 ans.

### 🟢 Open – 10KM
Chronométré, sans classement officiel. Sans obligation de réaliser les obstacles. Âge minimum 13 ans.

### 🟡 Kids – 1KM
Parcours spécial pour les enfants de 6 à 12 ans, ~1 km avec 10 obstacles faciles. Limité à 100 places. T-shirt inclus.

---

## 💰 Phases d'Inscription

| Épreuve | 1re Phase (jusqu'au 28/02) | 2e Phase (jusqu'au 21/03) | 3e Phase (jusqu'au 04/04) | 4e Phase (jusqu'au 09/04) |
|---|---|---|---|---|
| Open 10KM | 22€ / 20€ groupe | 25€ / 23€ groupe | 28€ / 26€ groupe | 38€ / 36€ groupe |
| CN Standard 14KM | 24€ / 21€ groupe | 26€ / 23€ groupe | 31€ / 26€ groupe | 41€ / 36€ groupe |
| CN Short 3KM | 24€ / 21€ groupe | 26€ / 23€ groupe | 31€ / 26€ groupe | 41€ / 36€ groupe |
| Pack CN 3KM+14KM | 42€ / 36€ groupe | 46€ / 40€ groupe | 56€ / 46€ groupe | 75€ / 65€ groupe |
| Flavius Standard 14KM | 24€ / 21€ groupe | 26€ / 23€ groupe | 31€ / 26€ groupe | 41€ / 36€ groupe |
| Flavius Short 3KM | 24€ / 21€ groupe | 26€ / 23€ groupe | 31€ / 26€ groupe | 41€ / 36€ groupe |
| Pack Flavius 3KM+14KM | 42€ / 36€ groupe | 46€ / 40€ groupe | 56€ / 46€ groupe | 75€ / 65€ groupe |
| Kids 1KM | 3€ (avec t-shirt) | 5€ (avec t-shirt) | — | — |

Les inscriptions de groupe nécessitent un minimum de 4 athlètes.

---

## 📍 Lieu

**Alameda do Trajano, près des Piscines Municipales**
Chaves, Vila Real, Portugal

---

## 📞 Contact

- **Web:** www.wildfun.pt
- **Email:** geral@wildfun.pt`,
      city: "Chaves",
      metaTitle:
        "Flavius Challenge OCR 2026 – Championnat National | Chaves | 18-19 Avril",
      metaDescription:
        "Championnat National OCR 2026 à Chaves, 18 et 19 avril. Short 3KM, Standard 14KM, Open 10KM et Kids 1KM. Inscriptions à partir de 22€. Organisation : Wildfun.",
    },
    [Language.de]: {
      title: "Flavius Challenge OCR 2026",
      description: `# 🏃 Nationale OCR-Meisterschaft 2026 – Flavius Challenge

Die **Nationale OCR-Meisterschaft 2026** findet am **18. und 19. April 2026** in **Chaves** statt, mit Start und Ziel an der **Alameda do Trajano, neben den städtischen Schwimmbädern**. Veranstaltet von **Flavius Challenge OCR / Wildfun**, mit Unterstützung des Portugiesischen Hindernislauf-Verbands (FPOCR), des Portugiesischen Modernen Fünfkampf-Verbands und der Gemeinde Chaves.

---

## 🗓️ Programm

- **18. April** (Beginn: 14:30 Uhr): Short Course 3KM + Kids 1KM
- **19. April** (Beginn: 09:30 Uhr): Standard Course 14KM + Open 10KM

---

## 🏅 Verfügbare Rennen

### 🔵 Short Course – 3KM (CN & Flavius Challenge – Wettkampf)
Städtischer Hindernislauf mit ~3 km und 20 Hindernissen. Mindestalter 16 Jahre.

### 🔴 Standard Course – 14KM (CN & Flavius Challenge – Wettkampf)
Städtischer Hindernislauf mit ~14 km und 40 Hindernissen, inkl. Schwimmpassage im Fluss Tâmega. Mindestalter 16 Jahre.

### 🟢 Open – 10KM
Zeitgenommen, aber ohne offizielle Wertung. Keine Pflicht, Hindernisse zu absolvieren. Mindestalter 13 Jahre.

### 🟡 Kids – 1KM
Spezialkurs für Kinder von 6–12 Jahren, ~1 km mit 10 leichten Hindernissen. Begrenzt auf 100 Plätze. T-Shirt inklusive.

---

## 💰 Anmeldephasen

| Rennen | 1. Phase (bis 28.02) | 2. Phase (bis 21.03) | 3. Phase (bis 04.04) | 4. Phase (bis 09.04) |
|---|---|---|---|---|
| Open 10KM | 22€ / 20€ Gruppe | 25€ / 23€ Gruppe | 28€ / 26€ Gruppe | 38€ / 36€ Gruppe |
| CN Standard 14KM | 24€ / 21€ Gruppe | 26€ / 23€ Gruppe | 31€ / 26€ Gruppe | 41€ / 36€ Gruppe |
| CN Short 3KM | 24€ / 21€ Gruppe | 26€ / 23€ Gruppe | 31€ / 26€ Gruppe | 41€ / 36€ Gruppe |
| Pack CN 3KM+14KM | 42€ / 36€ Gruppe | 46€ / 40€ Gruppe | 56€ / 46€ Gruppe | 75€ / 65€ Gruppe |
| Flavius Standard 14KM | 24€ / 21€ Gruppe | 26€ / 23€ Gruppe | 31€ / 26€ Gruppe | 41€ / 36€ Gruppe |
| Flavius Short 3KM | 24€ / 21€ Gruppe | 26€ / 23€ Gruppe | 31€ / 26€ Gruppe | 41€ / 36€ Gruppe |
| Pack Flavius 3KM+14KM | 42€ / 36€ Gruppe | 46€ / 40€ Gruppe | 56€ / 46€ Gruppe | 75€ / 65€ Gruppe |
| Kids 1KM | 3€ (mit T-Shirt) | 5€ (mit T-Shirt) | — | — |

Gruppenanmeldungen erfordern mindestens 4 Athleten.

---

## 📍 Ort

**Alameda do Trajano, neben den städtischen Schwimmbädern**
Chaves, Vila Real, Portugal

---

## 📞 Kontakt

- **Web:** www.wildfun.pt
- **E-Mail:** geral@wildfun.pt`,
      city: "Chaves",
      metaTitle:
        "Flavius Challenge OCR 2026 – Nationale Meisterschaft | Chaves | 18.-19. April",
      metaDescription:
        "Nationale OCR-Meisterschaft 2026 in Chaves, 18.–19. April. Short 3KM, Standard 14KM, Open 10KM und Kids 1KM. Anmeldung ab 22€. Veranstalter: Wildfun.",
    },
    [Language.it]: {
      title: "Flavius Challenge OCR 2026",
      description: `# 🏃 Campionato Nazionale OCR 2026 – Flavius Challenge

Il **Campionato Nazionale OCR 2026** si svolge il **18 e 19 aprile 2026** a **Chaves**, con partenza e arrivo all'**Alameda do Trajano, vicino alle Piscine Municipali**. Organizzato da **Flavius Challenge OCR / Wildfun**, con il supporto della Federazione Portoghese di Corse ad Ostacoli (FPOCR), della Federazione Portoghese di Pentathlon Moderno e del Comune di Chaves.

---

## 🗓️ Programma

- **18 aprile** (inizio: 14:30): Short Course 3KM + Kids 1KM
- **19 aprile** (inizio: 09:30): Standard Course 14KM + Open 10KM

---

## 🏅 Gare disponibili

### 🔵 Short Course – 3KM (CN & Flavius Challenge – Competizione)
Corsa ad ostacoli urbana di ~3 km con 20 ostacoli. Età minima 16 anni.

### 🔴 Standard Course – 14KM (CN & Flavius Challenge – Competizione)
Corsa ad ostacoli urbana di ~14 km con 40 ostacoli, inclusa una nuotata nel Fiume Tâmega. Età minima 16 anni.

### 🟢 Open – 10KM
Cronometrato, senza classifica ufficiale. Nessun obbligo di completare gli ostacoli. Età minima 13 anni.

### 🟡 Kids – 1KM
Percorso speciale per bambini dai 6 ai 12 anni, ~1 km con 10 ostacoli facili. Limitato a 100 posti. T-shirt inclusa.

---

## 💰 Fasi di Iscrizione

| Gara | 1ª Fase (fino al 28/02) | 2ª Fase (fino al 21/03) | 3ª Fase (fino al 04/04) | 4ª Fase (fino al 09/04) |
|---|---|---|---|---|
| Open 10KM | 22€ / 20€ gruppo | 25€ / 23€ gruppo | 28€ / 26€ gruppo | 38€ / 36€ gruppo |
| CN Standard 14KM | 24€ / 21€ gruppo | 26€ / 23€ gruppo | 31€ / 26€ gruppo | 41€ / 36€ gruppo |
| CN Short 3KM | 24€ / 21€ gruppo | 26€ / 23€ gruppo | 31€ / 26€ gruppo | 41€ / 36€ gruppo |
| Pack CN 3KM+14KM | 42€ / 36€ gruppo | 46€ / 40€ gruppo | 56€ / 46€ gruppo | 75€ / 65€ gruppo |
| Flavius Standard 14KM | 24€ / 21€ gruppo | 26€ / 23€ gruppo | 31€ / 26€ gruppo | 41€ / 36€ gruppo |
| Flavius Short 3KM | 24€ / 21€ gruppo | 26€ / 23€ gruppo | 31€ / 26€ gruppo | 41€ / 36€ gruppo |
| Pack Flavius 3KM+14KM | 42€ / 36€ gruppo | 46€ / 40€ gruppo | 56€ / 46€ gruppo | 75€ / 65€ gruppo |
| Kids 1KM | 3€ (con t-shirt) | 5€ (con t-shirt) | — | — |

Le iscrizioni di gruppo richiedono un minimo di 4 atleti.

---

## 📍 Luogo

**Alameda do Trajano, vicino alle Piscine Municipali**
Chaves, Vila Real, Portogallo

---

## 📞 Contatto

- **Web:** www.wildfun.pt
- **Email:** geral@wildfun.pt`,
      city: "Chaves",
      metaTitle:
        "Flavius Challenge OCR 2026 – Campionato Nazionale | Chaves | 18-19 Aprile",
      metaDescription:
        "Campionato Nazionale OCR 2026 a Chaves, 18 e 19 aprile. Short 3KM, Standard 14KM, Open 10KM e Kids 1KM. Iscrizioni a partire da 22€. Organizzatore: Wildfun.",
    },
  };

  console.log("🌍 Creating event translations...");
  for (const lang of languages) {
    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId: event.id, language: lang } },
      update: {
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
      create: {
        eventId: event.id,
        language: lang,
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
    console.log(`   ✅ Translation upserted: ${lang}`);
  }

  // ── Pricing phases + Variants ──
  console.log("💰 Deleting existing pricing phases...");
  await prisma.pricingPhase.deleteMany({ where: { eventId: event.id } });

  // ── Variant translations helper ──
  type VariantTranslations = Record<
    Language,
    { name: string; description: string }
  >;

  const variants: Array<{
    name: string;
    distanceKm: number;
    maxParticipants: number | null;
    startTime: string;
    description: string;
    translations: VariantTranslations;
    pricingPhases: Array<{
      name: string;
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      note: string;
    }>;
  }> = [
    // ── Open 10KM ──
    {
      name: "Open 10KM",
      distanceKm: 10,
      maxParticipants: null,
      startTime: "09:30",
      description:
        "Corrida de obstáculos Open, ~10 km e 30 obstáculos. Cronometrado sem classificação oficial. Dia 19 de abril.",
      translations: {
        [Language.pt]: {
          name: "Open 10KM",
          description:
            "Corrida de obstáculos Open com ~10 km e 30 obstáculos. Cronometrado mas sem classificação oficial. Mínimo 13 anos. Dia 19 de abril.",
        },
        [Language.en]: {
          name: "Open 10KM",
          description:
            "Open obstacle course with ~10 km and 30 obstacles. Timed but no official ranking. Minimum age 13. April 19.",
        },
        [Language.es]: {
          name: "Open 10KM",
          description:
            "Carrera de obstáculos Open con ~10 km y 30 obstáculos. Cronometrada sin clasificación oficial. Mínimo 13 años. 19 de abril.",
        },
        [Language.fr]: {
          name: "Open 10KM",
          description:
            "Course d'obstacles Open d'environ 10 km et 30 obstacles. Chronométrée sans classement officiel. Âge minimum 13 ans. 19 avril.",
        },
        [Language.de]: {
          name: "Open 10KM",
          description:
            "Open-Hindernislauf, ~10 km und 30 Hindernisse. Zeitgenommen, ohne offizielle Wertung. Mindestalter 13 Jahre. 19. April.",
        },
        [Language.it]: {
          name: "Open 10KM",
          description:
            "Corsa ad ostacoli Open, ~10 km e 30 ostacoli. Cronometrata senza classifica ufficiale. Età minima 13 anni. 19 aprile.",
        },
      },
      pricingPhases: [
        {
          name: "Open 10KM - 1ª Fase Individual",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 22,
          currency: Currency.EUR,
          note: "1ª Fase – inscrição individual",
        },
        {
          name: "Open 10KM - 2ª Fase Individual",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-03-21T23:59:59Z"),
          price: 25,
          currency: Currency.EUR,
          note: "2ª Fase – inscrição individual",
        },
        {
          name: "Open 10KM - 3ª Fase Individual",
          startDate: new Date("2026-03-22T00:00:00Z"),
          endDate: new Date("2026-04-04T23:59:59Z"),
          price: 28,
          currency: Currency.EUR,
          note: "3ª Fase – inscrição individual",
        },
        {
          name: "Open 10KM - 4ª Fase Individual",
          startDate: new Date("2026-04-05T00:00:00Z"),
          endDate: new Date("2026-04-09T22:59:59Z"),
          price: 38,
          currency: Currency.EUR,
          note: "4ª Fase – inscrição individual",
        },
      ],
    },
    // ── CN Standard 14KM ──
    {
      name: "CN Standard 14KM",
      distanceKm: 14,
      maxParticipants: null,
      startTime: "09:30",
      description:
        "Campeonato Nacional OCR – Standard Course ~14 km e 40 obstáculos. Inclui natação no Rio Tâmega. Mínimo 16 anos. Dia 19 de abril.",
      translations: {
        [Language.pt]: {
          name: "CN Standard 14KM",
          description:
            "Campeonato Nacional OCR – Standard Course com ~14 km e 40 obstáculos. Inclui natação no Rio Tâmega. Mínimo 16 anos. Time cap: 15 min/km (M) / 18 min/km (F). Dia 19 de abril.",
        },
        [Language.en]: {
          name: "CN Standard 14KM",
          description:
            "National OCR Championship – Standard Course with ~14 km and 40 obstacles. Includes a swim in the Tâmega River. Minimum age 16. Time cap: 15 min/km (M) / 18 min/km (F). April 19.",
        },
        [Language.es]: {
          name: "CN Standard 14KM",
          description:
            "Campeonato Nacional OCR – Standard Course con ~14 km y 40 obstáculos. Incluye natación en el Río Tâmega. Mínimo 16 años. 19 de abril.",
        },
        [Language.fr]: {
          name: "CN Standard 14KM",
          description:
            "Championnat National OCR – Standard Course d'environ 14 km et 40 obstacles. Inclut une traversée à la nage du Rio Tâmega. Âge minimum 16 ans. 19 avril.",
        },
        [Language.de]: {
          name: "CN Standard 14KM",
          description:
            "Nationale OCR-Meisterschaft – Standard Course, ~14 km und 40 Hindernisse. Enthält Schwimmpassage im Fluss Tâmega. Mindestalter 16 Jahre. 19. April.",
        },
        [Language.it]: {
          name: "CN Standard 14KM",
          description:
            "Campionato Nazionale OCR – Standard Course, ~14 km e 40 ostacoli. Include nuotata nel Fiume Tâmega. Età minima 16 anni. 19 aprile.",
        },
      },
      pricingPhases: [
        {
          name: "CN Standard 14KM - 1ª Fase Individual",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 24,
          currency: Currency.EUR,
          note: "1ª Fase – inscrição individual",
        },
        {
          name: "CN Standard 14KM - 2ª Fase Individual",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-03-21T23:59:59Z"),
          price: 26,
          currency: Currency.EUR,
          note: "2ª Fase – inscrição individual",
        },
        {
          name: "CN Standard 14KM - 3ª Fase Individual",
          startDate: new Date("2026-03-22T00:00:00Z"),
          endDate: new Date("2026-04-04T23:59:59Z"),
          price: 31,
          currency: Currency.EUR,
          note: "3ª Fase – inscrição individual",
        },
        {
          name: "CN Standard 14KM - 4ª Fase Individual",
          startDate: new Date("2026-04-05T00:00:00Z"),
          endDate: new Date("2026-04-09T22:59:59Z"),
          price: 41,
          currency: Currency.EUR,
          note: "4ª Fase – inscrição individual",
        },
      ],
    },
    // ── CN Short 3KM ──
    {
      name: "CN Short 3KM",
      distanceKm: 3,
      maxParticipants: null,
      startTime: "14:30",
      description:
        "Campeonato Nacional OCR – Short Course ~3 km e 20 obstáculos. Mínimo 16 anos. Dia 18 de abril.",
      translations: {
        [Language.pt]: {
          name: "CN Short 3KM",
          description:
            "Campeonato Nacional OCR – Short Course com ~3 km e 20 obstáculos. Mínimo 16 anos. Time cap: 15 min/km (M) / 18 min/km (F). Dia 18 de abril.",
        },
        [Language.en]: {
          name: "CN Short 3KM",
          description:
            "National OCR Championship – Short Course with ~3 km and 20 obstacles. Minimum age 16. Time cap: 15 min/km (M) / 18 min/km (F). April 18.",
        },
        [Language.es]: {
          name: "CN Short 3KM",
          description:
            "Campeonato Nacional OCR – Short Course con ~3 km y 20 obstáculos. Mínimo 16 años. 18 de abril.",
        },
        [Language.fr]: {
          name: "CN Short 3KM",
          description:
            "Championnat National OCR – Short Course d'environ 3 km et 20 obstacles. Âge minimum 16 ans. 18 avril.",
        },
        [Language.de]: {
          name: "CN Short 3KM",
          description:
            "Nationale OCR-Meisterschaft – Short Course, ~3 km und 20 Hindernisse. Mindestalter 16 Jahre. 18. April.",
        },
        [Language.it]: {
          name: "CN Short 3KM",
          description:
            "Campionato Nazionale OCR – Short Course, ~3 km e 20 ostacoli. Età minima 16 anni. 18 aprile.",
        },
      },
      pricingPhases: [
        {
          name: "CN Short 3KM - 1ª Fase Individual",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 24,
          currency: Currency.EUR,
          note: "1ª Fase – inscrição individual",
        },
        {
          name: "CN Short 3KM - 2ª Fase Individual",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-03-21T23:59:59Z"),
          price: 26,
          currency: Currency.EUR,
          note: "2ª Fase – inscrição individual",
        },
        {
          name: "CN Short 3KM - 3ª Fase Individual",
          startDate: new Date("2026-03-22T00:00:00Z"),
          endDate: new Date("2026-04-04T23:59:59Z"),
          price: 31,
          currency: Currency.EUR,
          note: "3ª Fase – inscrição individual",
        },
        {
          name: "CN Short 3KM - 4ª Fase Individual",
          startDate: new Date("2026-04-05T00:00:00Z"),
          endDate: new Date("2026-04-09T22:59:59Z"),
          price: 41,
          currency: Currency.EUR,
          note: "4ª Fase – inscrição individual",
        },
      ],
    },
    // ── Pack CN 3KM + 14KM ──
    {
      name: "Pack CN 3KM + 14KM",
      distanceKm: 17,
      maxParticipants: null,
      startTime: "14:30",
      description:
        "Pack Campeonato Nacional – Short 3KM (dia 18) + Standard 14KM (dia 19). Inscrição combinada com desconto.",
      translations: {
        [Language.pt]: {
          name: "Pack CN 3KM + 14KM",
          description:
            "Pack Campeonato Nacional – Short Course 3KM (dia 18 de abril) + Standard Course 14KM (dia 19 de abril). Inscrição combinada.",
        },
        [Language.en]: {
          name: "Pack CN 3KM + 14KM",
          description:
            "National Championship Pack – Short Course 3KM (April 18) + Standard Course 14KM (April 19). Combined registration.",
        },
        [Language.es]: {
          name: "Pack CN 3KM + 14KM",
          description:
            "Pack Campeonato Nacional – Short Course 3KM (18 de abril) + Standard Course 14KM (19 de abril). Inscripción combinada.",
        },
        [Language.fr]: {
          name: "Pack CN 3KM + 14KM",
          description:
            "Pack Championnat National – Short Course 3KM (18 avril) + Standard Course 14KM (19 avril). Inscription combinée.",
        },
        [Language.de]: {
          name: "Pack CN 3KM + 14KM",
          description:
            "Nationales Meisterschafts-Pack – Short Course 3KM (18. April) + Standard Course 14KM (19. April). Kombinierte Anmeldung.",
        },
        [Language.it]: {
          name: "Pack CN 3KM + 14KM",
          description:
            "Pack Campionato Nazionale – Short Course 3KM (18 aprile) + Standard Course 14KM (19 aprile). Iscrizione combinata.",
        },
      },
      pricingPhases: [
        {
          name: "Pack CN 3KM+14KM - 1ª Fase Individual",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 42,
          currency: Currency.EUR,
          note: "1ª Fase – pack individual (3KM + 14KM)",
        },
        {
          name: "Pack CN 3KM+14KM - 2ª Fase Individual",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-03-21T23:59:59Z"),
          price: 46,
          currency: Currency.EUR,
          note: "2ª Fase – pack individual (3KM + 14KM)",
        },
        {
          name: "Pack CN 3KM+14KM - 3ª Fase Individual",
          startDate: new Date("2026-03-22T00:00:00Z"),
          endDate: new Date("2026-04-04T23:59:59Z"),
          price: 56,
          currency: Currency.EUR,
          note: "3ª Fase – pack individual (3KM + 14KM)",
        },
        {
          name: "Pack CN 3KM+14KM - 4ª Fase Individual",
          startDate: new Date("2026-04-05T00:00:00Z"),
          endDate: new Date("2026-04-09T22:59:59Z"),
          price: 75,
          currency: Currency.EUR,
          note: "4ª Fase – pack individual (3KM + 14KM)",
        },
      ],
    },
    // ── Flavius Competição Standard 14KM ──
    {
      name: "Flavius Competição Standard 14KM",
      distanceKm: 14,
      maxParticipants: null,
      startTime: "09:30",
      description:
        "Flavius Challenge Competição – Standard Course ~14 km e 40 obstáculos. Com classificação Flavius Challenge. Mínimo 16 anos. Dia 19 de abril.",
      translations: {
        [Language.pt]: {
          name: "Flavius Competição Standard 14KM",
          description:
            "Flavius Challenge – Competição Standard Course com ~14 km e 40 obstáculos. Classificação oficial Flavius Challenge. Mínimo 16 anos. Dia 19 de abril.",
        },
        [Language.en]: {
          name: "Flavius Competition Standard 14KM",
          description:
            "Flavius Challenge Competition – Standard Course with ~14 km and 40 obstacles. Official Flavius Challenge ranking. Minimum age 16. April 19.",
        },
        [Language.es]: {
          name: "Flavius Competición Standard 14KM",
          description:
            "Flavius Challenge Competición – Standard Course con ~14 km y 40 obstáculos. Clasificación oficial Flavius Challenge. Mínimo 16 años. 19 de abril.",
        },
        [Language.fr]: {
          name: "Flavius Compétition Standard 14KM",
          description:
            "Flavius Challenge Compétition – Standard Course d'environ 14 km et 40 obstacles. Classement officiel Flavius Challenge. Âge minimum 16 ans. 19 avril.",
        },
        [Language.de]: {
          name: "Flavius Wettkampf Standard 14KM",
          description:
            "Flavius Challenge Wettkampf – Standard Course, ~14 km und 40 Hindernisse. Offizielle Flavius Challenge Wertung. Mindestalter 16 Jahre. 19. April.",
        },
        [Language.it]: {
          name: "Flavius Competizione Standard 14KM",
          description:
            "Flavius Challenge Competizione – Standard Course, ~14 km e 40 ostacoli. Classifica ufficiale Flavius Challenge. Età minima 16 anni. 19 aprile.",
        },
      },
      pricingPhases: [
        {
          name: "Flavius Standard 14KM - 1ª Fase Individual",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 24,
          currency: Currency.EUR,
          note: "1ª Fase – inscrição individual",
        },
        {
          name: "Flavius Standard 14KM - 2ª Fase Individual",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-03-21T23:59:59Z"),
          price: 26,
          currency: Currency.EUR,
          note: "2ª Fase – inscrição individual",
        },
        {
          name: "Flavius Standard 14KM - 3ª Fase Individual",
          startDate: new Date("2026-03-22T00:00:00Z"),
          endDate: new Date("2026-04-04T23:59:59Z"),
          price: 31,
          currency: Currency.EUR,
          note: "3ª Fase – inscrição individual",
        },
        {
          name: "Flavius Standard 14KM - 4ª Fase Individual",
          startDate: new Date("2026-04-05T00:00:00Z"),
          endDate: new Date("2026-04-09T22:59:59Z"),
          price: 41,
          currency: Currency.EUR,
          note: "4ª Fase – inscrição individual",
        },
      ],
    },
    // ── Flavius Competição Short 3KM ──
    {
      name: "Flavius Competição Short 3KM",
      distanceKm: 3,
      maxParticipants: null,
      startTime: "14:30",
      description:
        "Flavius Challenge Competição – Short Course ~3 km e 20 obstáculos. Com classificação Flavius Challenge. Mínimo 16 anos. Dia 18 de abril.",
      translations: {
        [Language.pt]: {
          name: "Flavius Competição Short 3KM",
          description:
            "Flavius Challenge – Competição Short Course com ~3 km e 20 obstáculos. Classificação oficial Flavius Challenge. Mínimo 16 anos. Dia 18 de abril.",
        },
        [Language.en]: {
          name: "Flavius Competition Short 3KM",
          description:
            "Flavius Challenge Competition – Short Course with ~3 km and 20 obstacles. Official Flavius Challenge ranking. Minimum age 16. April 18.",
        },
        [Language.es]: {
          name: "Flavius Competición Short 3KM",
          description:
            "Flavius Challenge Competición – Short Course con ~3 km y 20 obstáculos. Clasificación oficial Flavius Challenge. Mínimo 16 años. 18 de abril.",
        },
        [Language.fr]: {
          name: "Flavius Compétition Short 3KM",
          description:
            "Flavius Challenge Compétition – Short Course d'environ 3 km et 20 obstacles. Classement officiel Flavius Challenge. Âge minimum 16 ans. 18 avril.",
        },
        [Language.de]: {
          name: "Flavius Wettkampf Short 3KM",
          description:
            "Flavius Challenge Wettkampf – Short Course, ~3 km und 20 Hindernisse. Offizielle Flavius Challenge Wertung. Mindestalter 16 Jahre. 18. April.",
        },
        [Language.it]: {
          name: "Flavius Competizione Short 3KM",
          description:
            "Flavius Challenge Competizione – Short Course, ~3 km e 20 ostacoli. Classifica ufficiale Flavius Challenge. Età minima 16 anni. 18 aprile.",
        },
      },
      pricingPhases: [
        {
          name: "Flavius Short 3KM - 1ª Fase Individual",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 24,
          currency: Currency.EUR,
          note: "1ª Fase – inscrição individual",
        },
        {
          name: "Flavius Short 3KM - 2ª Fase Individual",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-03-21T23:59:59Z"),
          price: 26,
          currency: Currency.EUR,
          note: "2ª Fase – inscrição individual",
        },
        {
          name: "Flavius Short 3KM - 3ª Fase Individual",
          startDate: new Date("2026-03-22T00:00:00Z"),
          endDate: new Date("2026-04-04T23:59:59Z"),
          price: 31,
          currency: Currency.EUR,
          note: "3ª Fase – inscrição individual",
        },
        {
          name: "Flavius Short 3KM - 4ª Fase Individual",
          startDate: new Date("2026-04-05T00:00:00Z"),
          endDate: new Date("2026-04-09T22:59:59Z"),
          price: 41,
          currency: Currency.EUR,
          note: "4ª Fase – inscrição individual",
        },
      ],
    },
    // ── Pack Flavius 3KM + 14KM ──
    {
      name: "Pack Flavius 3KM + 14KM",
      distanceKm: 17,
      maxParticipants: null,
      startTime: "14:30",
      description:
        "Pack Flavius Challenge – Short 3KM (dia 18) + Standard 14KM (dia 19). Inscrição combinada com desconto.",
      translations: {
        [Language.pt]: {
          name: "Pack Flavius 3KM + 14KM",
          description:
            "Pack Flavius Challenge – Short Course 3KM (dia 18 de abril) + Standard Course 14KM (dia 19 de abril). Inscrição combinada.",
        },
        [Language.en]: {
          name: "Pack Flavius 3KM + 14KM",
          description:
            "Flavius Challenge Pack – Short Course 3KM (April 18) + Standard Course 14KM (April 19). Combined registration.",
        },
        [Language.es]: {
          name: "Pack Flavius 3KM + 14KM",
          description:
            "Pack Flavius Challenge – Short Course 3KM (18 de abril) + Standard Course 14KM (19 de abril). Inscripción combinada.",
        },
        [Language.fr]: {
          name: "Pack Flavius 3KM + 14KM",
          description:
            "Pack Flavius Challenge – Short Course 3KM (18 avril) + Standard Course 14KM (19 avril). Inscription combinée.",
        },
        [Language.de]: {
          name: "Pack Flavius 3KM + 14KM",
          description:
            "Flavius Challenge Pack – Short Course 3KM (18. April) + Standard Course 14KM (19. April). Kombinierte Anmeldung.",
        },
        [Language.it]: {
          name: "Pack Flavius 3KM + 14KM",
          description:
            "Pack Flavius Challenge – Short Course 3KM (18 aprile) + Standard Course 14KM (19 aprile). Iscrizione combinata.",
        },
      },
      pricingPhases: [
        {
          name: "Pack Flavius 3KM+14KM - 1ª Fase Individual",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 42,
          currency: Currency.EUR,
          note: "1ª Fase – pack individual (3KM + 14KM)",
        },
        {
          name: "Pack Flavius 3KM+14KM - 2ª Fase Individual",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-03-21T23:59:59Z"),
          price: 46,
          currency: Currency.EUR,
          note: "2ª Fase – pack individual (3KM + 14KM)",
        },
        {
          name: "Pack Flavius 3KM+14KM - 3ª Fase Individual",
          startDate: new Date("2026-03-22T00:00:00Z"),
          endDate: new Date("2026-04-04T23:59:59Z"),
          price: 56,
          currency: Currency.EUR,
          note: "3ª Fase – pack individual (3KM + 14KM)",
        },
        {
          name: "Pack Flavius 3KM+14KM - 4ª Fase Individual",
          startDate: new Date("2026-04-05T00:00:00Z"),
          endDate: new Date("2026-04-09T22:59:59Z"),
          price: 75,
          currency: Currency.EUR,
          note: "4ª Fase – pack individual (3KM + 14KM)",
        },
      ],
    },
    // ── Kids 1KM ──
    {
      name: "Kids 1KM",
      distanceKm: 1,
      maxParticipants: 100,
      startTime: "14:30",
      description:
        "Percurso Kids Flavius Challenge – ~1 km e 10 obstáculos de baixa dificuldade. Idades: 6–12 anos. Limitado a 100 vagas. T-shirt de oferta. Dia 18 de abril.",
      translations: {
        [Language.pt]: {
          name: "Kids 1KM",
          description:
            "Percurso Kids Flavius Challenge com ~1 km e 10 obstáculos de baixa dificuldade. Para crianças dos 6 aos 12 anos. Limitado a 100 vagas. T-shirt de oferta. Dia 18 de abril.",
        },
        [Language.en]: {
          name: "Kids 1KM",
          description:
            "Kids Flavius Challenge course with ~1 km and 10 low-difficulty obstacles. For children aged 6–12. Limited to 100 spots. T-shirt included. April 18.",
        },
        [Language.es]: {
          name: "Kids 1KM",
          description:
            "Recorrido Kids Flavius Challenge con ~1 km y 10 obstáculos de baja dificultad. Para niños de 6 a 12 años. Limitado a 100 plazas. Camiseta incluida. 18 de abril.",
        },
        [Language.fr]: {
          name: "Kids 1KM",
          description:
            "Parcours Kids Flavius Challenge d'environ 1 km et 10 obstacles faciles. Pour enfants de 6 à 12 ans. Limité à 100 places. T-shirt inclus. 18 avril.",
        },
        [Language.de]: {
          name: "Kids 1KM",
          description:
            "Kids Flavius Challenge Parcours, ~1 km und 10 leichte Hindernisse. Für Kinder von 6–12 Jahren. Begrenzt auf 100 Plätze. T-Shirt inklusive. 18. April.",
        },
        [Language.it]: {
          name: "Kids 1KM",
          description:
            "Percorso Kids Flavius Challenge, ~1 km e 10 ostacoli facili. Per bambini dai 6 ai 12 anni. Limitato a 100 posti. T-shirt inclusa. 18 aprile.",
        },
      },
      pricingPhases: [
        {
          name: "Kids 1KM - 1ª Fase",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-02-28T23:59:59Z"),
          price: 3,
          currency: Currency.EUR,
          note: "1ª Fase – inclui t-shirt",
        },
        {
          name: "Kids 1KM - 2ª Fase",
          startDate: new Date("2026-03-01T00:00:00Z"),
          endDate: new Date("2026-04-09T22:59:59Z"),
          price: 5,
          currency: Currency.EUR,
          note: "2ª e últimas fases – inclui t-shirt",
        },
      ],
    },
  ];

  console.log("🏃 Creating variants and pricing phases...");
  for (const variantData of variants) {
    const {
      pricingPhases,
      translations: variantTranslations,
      ...variantInfo
    } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`   ✅ Created variant: ${variant.name}`);

    // Variant translations
    for (const lang of languages) {
      const vt = variantTranslations[lang];
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: { variantId: variant.id, language: lang },
        },
        update: { name: vt.name, description: vt.description },
        create: {
          variantId: variant.id,
          language: lang,
          name: vt.name,
          description: vt.description,
        },
      });
    }

    // Pricing phases — linked to eventId
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          name: phase.name,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
          note: phase.note,
        },
      });
    }

    console.log(
      `   - Created ${pricingPhases.length} pricing phase(s) for ${variant.name}`
    );
  }

  // ── FAQs ──
  console.log("❓ Creating FAQs...");

  const faqs: Array<{
    order: number;
    translations: Record<Language, { question: string; answer: string }>;
  }> = [
    {
      order: 1,
      translations: {
        [Language.pt]: {
          question: "O que é o Flavius Challenge OCR?",
          answer:
            "O Flavius Challenge OCR é uma corrida de obstáculos organizada pela Wildfun, que em 2026 acolhe o Campeonato Nacional OCR, em Chaves, nos dias 18 e 19 de abril, com o apoio da FPOCR, FPPM e Município de Chaves.",
        },
        [Language.en]: {
          question: "What is the Flavius Challenge OCR?",
          answer:
            "The Flavius Challenge OCR is an obstacle course race organized by Wildfun, which in 2026 hosts the National OCR Championship in Chaves on April 18-19, supported by FPOCR, FPPM, and the Municipality of Chaves.",
        },
        [Language.es]: {
          question: "¿Qué es el Flavius Challenge OCR?",
          answer:
            "El Flavius Challenge OCR es una carrera de obstáculos organizada por Wildfun, que en 2026 acoge el Campeonato Nacional OCR en Chaves, los días 18 y 19 de abril, con el apoyo de la FPOCR, FPPM y el Municipio de Chaves.",
        },
        [Language.fr]: {
          question: "Qu'est-ce que le Flavius Challenge OCR ?",
          answer:
            "Le Flavius Challenge OCR est une course d'obstacles organisée par Wildfun, qui accueille en 2026 le Championnat National OCR à Chaves, les 18 et 19 avril, avec le soutien de la FPOCR, de la FPPM et de la Municipalité de Chaves.",
        },
        [Language.de]: {
          question: "Was ist der Flavius Challenge OCR?",
          answer:
            "Der Flavius Challenge OCR ist ein Hindernislauf, der von Wildfun organisiert wird und 2026 die Nationale OCR-Meisterschaft in Chaves am 18. und 19. April ausrichtet, unterstützt von FPOCR, FPPM und der Gemeinde Chaves.",
        },
        [Language.it]: {
          question: "Cos'è il Flavius Challenge OCR?",
          answer:
            "Il Flavius Challenge OCR è una corsa ad ostacoli organizzata da Wildfun, che nel 2026 ospita il Campionato Nazionale OCR a Chaves, il 18 e 19 aprile, con il supporto di FPOCR, FPPM e Comune di Chaves.",
        },
      },
    },
    {
      order: 2,
      translations: {
        [Language.pt]: {
          question: "Quais são as provas disponíveis?",
          answer:
            "Existem 4 provas: Short Course 3KM (dia 18) e Standard Course 14KM + Open 10KM (dia 19) para adultos, e Kids 1KM (dia 18) para crianças dos 6-12 anos. As provas competitivas têm vagas CN e Flavius Challenge – Competição.",
        },
        [Language.en]: {
          question: "What races are available?",
          answer:
            "There are 4 races: Short Course 3KM (April 18) and Standard Course 14KM + Open 10KM (April 19) for adults, and Kids 1KM (April 18) for children aged 6-12. Competitive races have CN and Flavius Challenge – Competition slots.",
        },
        [Language.es]: {
          question: "¿Qué pruebas están disponibles?",
          answer:
            "Hay 4 pruebas: Short Course 3KM (18 de abril) y Standard Course 14KM + Open 10KM (19 de abril) para adultos, y Kids 1KM (18 de abril) para niños de 6-12 años. Las pruebas competitivas tienen plazas CN y Flavius Challenge – Competición.",
        },
        [Language.fr]: {
          question: "Quelles épreuves sont disponibles ?",
          answer:
            "Il y a 4 épreuves : Short Course 3KM (18 avril) et Standard Course 14KM + Open 10KM (19 avril) pour les adultes, et Kids 1KM (18 avril) pour les enfants de 6-12 ans. Les épreuves compétitives ont des places CN et Flavius Challenge – Compétition.",
        },
        [Language.de]: {
          question: "Welche Rennen sind verfügbar?",
          answer:
            "Es gibt 4 Rennen: Short Course 3KM (18. April) und Standard Course 14KM + Open 10KM (19. April) für Erwachsene, sowie Kids 1KM (18. April) für Kinder von 6-12 Jahren. Wettkampfrennen haben CN- und Flavius Challenge – Wettkampf-Startplätze.",
        },
        [Language.it]: {
          question: "Quali gare sono disponibili?",
          answer:
            "Ci sono 4 gare: Short Course 3KM (18 aprile) e Standard Course 14KM + Open 10KM (19 aprile) per adulti, e Kids 1KM (18 aprile) per bambini dai 6 ai 12 anni. Le gare competitive hanno posti CN e Flavius Challenge – Competizione.",
        },
      },
    },
    {
      order: 3,
      translations: {
        [Language.pt]: {
          question: "Onde se realiza o evento?",
          answer:
            "O evento realiza-se em Chaves, com partida e chegada na Alameda do Trajano, junto às Piscinas Municipais. Coordenadas GPS: 41°44'11.4\"N 7°28'17.2\"W.",
        },
        [Language.en]: {
          question: "Where does the event take place?",
          answer:
            "The event takes place in Chaves, with start and finish at Alameda do Trajano, next to the Municipal Swimming Pools. GPS coordinates: 41°44'11.4\"N 7°28'17.2\"W.",
        },
        [Language.es]: {
          question: "¿Dónde se celebra el evento?",
          answer:
            "El evento se celebra en Chaves, con salida y llegada en la Alameda do Trajano, junto a las Piscinas Municipales. Coordenadas GPS: 41°44'11.4\"N 7°28'17.2\"W.",
        },
        [Language.fr]: {
          question: "Où se déroule l'événement ?",
          answer:
            "L'événement se déroule à Chaves, avec départ et arrivée sur l'Alameda do Trajano, près des Piscines Municipales. Coordonnées GPS : 41°44'11.4\"N 7°28'17.2\"W.",
        },
        [Language.de]: {
          question: "Wo findet die Veranstaltung statt?",
          answer:
            "Die Veranstaltung findet in Chaves statt, mit Start und Ziel an der Alameda do Trajano, neben den städtischen Schwimmbädern. GPS-Koordinaten: 41°44'11.4\"N 7°28'17.2\"W.",
        },
        [Language.it]: {
          question: "Dove si svolge l'evento?",
          answer:
            "L'evento si svolge a Chaves, con partenza e arrivo all'Alameda do Trajano, vicino alle Piscine Municipali. Coordinate GPS: 41°44'11.4\"N 7°28'17.2\"W.",
        },
      },
    },
    {
      order: 4,
      translations: {
        [Language.pt]: {
          question: "Quais os horários de partida?",
          answer:
            "No dia 18 de abril, o início está previsto para as 14h30 (Short Course 3KM e Kids). No dia 19 de abril, o início está previsto para as 9h30 (Standard Course 14KM e Open 10KM). A organização poderá ajustar os horários.",
        },
        [Language.en]: {
          question: "What are the start times?",
          answer:
            "On April 18, the start is scheduled for 14:30 (Short Course 3KM and Kids). On April 19, the start is scheduled for 09:30 (Standard Course 14KM and Open 10KM). The organization may adjust times.",
        },
        [Language.es]: {
          question: "¿Cuáles son los horarios de salida?",
          answer:
            "El 18 de abril, el inicio está previsto a las 14:30 (Short Course 3KM y Kids). El 19 de abril, el inicio está previsto a las 9:30 (Standard Course 14KM y Open 10KM). La organización podrá ajustar los horarios.",
        },
        [Language.fr]: {
          question: "Quels sont les horaires de départ ?",
          answer:
            "Le 18 avril, le départ est prévu à 14h30 (Short Course 3KM et Kids). Le 19 avril, le départ est prévu à 9h30 (Standard Course 14KM et Open 10KM). L'organisation pourra ajuster les horaires.",
        },
        [Language.de]: {
          question: "Was sind die Startzeiten?",
          answer:
            "Am 18. April ist der Start um 14:30 Uhr geplant (Short Course 3KM und Kids). Am 19. April ist der Start um 09:30 Uhr geplant (Standard Course 14KM und Open 10KM). Die Organisation kann Zeiten anpassen.",
        },
        [Language.it]: {
          question: "Quali sono gli orari di partenza?",
          answer:
            "Il 18 aprile la partenza è prevista alle 14:30 (Short Course 3KM e Kids). Il 19 aprile la partenza è prevista alle 9:30 (Standard Course 14KM e Open 10KM). L'organizzazione potrà modificare gli orari.",
        },
      },
    },
    {
      order: 5,
      translations: {
        [Language.pt]: {
          question: "Quando encerram as inscrições?",
          answer:
            "As inscrições encerram a 9 de abril de 2026 às 23:59, ou quando esgotar o limite de vagas disponíveis. As inscrições são realizadas em lap2go.com.",
        },
        [Language.en]: {
          question: "When do registrations close?",
          answer:
            "Registrations close on April 9, 2026 at 23:59, or when the available spots are full. Registrations are made at lap2go.com.",
        },
        [Language.es]: {
          question: "¿Cuándo cierran las inscripciones?",
          answer:
            "Las inscripciones cierran el 9 de abril de 2026 a las 23:59, o cuando se agoten las plazas disponibles. Las inscripciones se realizan en lap2go.com.",
        },
        [Language.fr]: {
          question: "Quand les inscriptions ferment-elles ?",
          answer:
            "Les inscriptions ferment le 9 avril 2026 à 23h59, ou lorsque les places disponibles sont épuisées. Les inscriptions se font sur lap2go.com.",
        },
        [Language.de]: {
          question: "Wann schließen die Anmeldungen?",
          answer:
            "Anmeldungen schließen am 9. April 2026 um 23:59 Uhr oder wenn die verfügbaren Plätze belegt sind. Anmeldungen erfolgen unter lap2go.com.",
        },
        [Language.it]: {
          question: "Quando chiudono le iscrizioni?",
          answer:
            "Le iscrizioni chiudono il 9 aprile 2026 alle 23:59, o quando i posti disponibili sono esauriti. Le iscrizioni si effettuano su lap2go.com.",
        },
      },
    },
    {
      order: 6,
      translations: {
        [Language.pt]: {
          question: "Posso transferir a minha inscrição?",
          answer:
            "Sim. Até 5 de abril de 2026, podes transferir a inscrição para outro participante, entrando em contacto via email: geral@wildfun.pt. Após essa data não é possível transferir.",
        },
        [Language.en]: {
          question: "Can I transfer my registration?",
          answer:
            "Yes. Until April 5, 2026, you can transfer your registration to another participant by contacting via email: geral@wildfun.pt. After that date, transfers are not possible.",
        },
        [Language.es]: {
          question: "¿Puedo transferir mi inscripción?",
          answer:
            "Sí. Hasta el 5 de abril de 2026, puedes transferir tu inscripción a otro participante contactando por email: geral@wildfun.pt. Después de esa fecha no es posible transferir.",
        },
        [Language.fr]: {
          question: "Puis-je transférer mon inscription ?",
          answer:
            "Oui. Jusqu'au 5 avril 2026, vous pouvez transférer votre inscription à un autre participant en contactant par email : geral@wildfun.pt. Après cette date, les transferts ne sont pas possibles.",
        },
        [Language.de]: {
          question: "Kann ich meine Anmeldung übertragen?",
          answer:
            "Ja. Bis zum 5. April 2026 können Sie Ihre Anmeldung auf einen anderen Teilnehmer übertragen, indem Sie per E-Mail kontaktieren: geral@wildfun.pt. Nach diesem Datum sind keine Übertragungen möglich.",
        },
        [Language.it]: {
          question: "Posso trasferire la mia iscrizione?",
          answer:
            "Sì. Fino al 5 aprile 2026, puoi trasferire la tua iscrizione a un altro partecipante contattando via email: geral@wildfun.pt. Dopo tale data i trasferimenti non sono possibili.",
        },
      },
    },
    {
      order: 7,
      translations: {
        [Language.pt]: {
          question: "A organização reembolsa inscrições canceladas?",
          answer:
            "Não. A organização não procede ao reembolso de qualquer valor de inscrições canceladas pelos atletas. O evento pode ser cancelado em casos de força maior, sem devolução de valores.",
        },
        [Language.en]: {
          question: "Does the organization refund cancelled registrations?",
          answer:
            "No. The organization does not refund any registration fees cancelled by athletes. The event may be cancelled due to force majeure without refunds.",
        },
        [Language.es]: {
          question: "¿La organización reembolsa las inscripciones canceladas?",
          answer:
            "No. La organización no reembolsa ningún importe de inscripciones canceladas por los atletas. El evento puede cancelarse por causas de fuerza mayor sin devolución.",
        },
        [Language.fr]: {
          question:
            "L'organisation rembourse-t-elle les inscriptions annulées ?",
          answer:
            "Non. L'organisation ne rembourse aucun montant d'inscription annulée par les athlètes. L'événement peut être annulé en cas de force majeure sans remboursement.",
        },
        [Language.de]: {
          question: "Erstattet die Organisation stornierte Anmeldungen zurück?",
          answer:
            "Nein. Die Organisation erstattet keine Anmeldegebühren, die von Athleten storniert werden. Die Veranstaltung kann bei höherer Gewalt ohne Rückerstattung abgesagt werden.",
        },
        [Language.it]: {
          question: "L'organizzazione rimborsa le iscrizioni annullate?",
          answer:
            "No. L'organizzazione non rimborsa alcun importo di iscrizioni annullate dagli atleti. L'evento può essere annullato per cause di forza maggiore senza rimborso.",
        },
      },
    },
    {
      order: 8,
      translations: {
        [Language.pt]: {
          question: "O que inclui o kit do atleta?",
          answer:
            "O kit do atleta inclui dorsal, t-shirt do evento, mochila do evento e ofertas diversas dos parceiros. É entregue no local do evento. Kits não levantados ficam guardados 10 dias após o evento.",
        },
        [Language.en]: {
          question: "What does the athlete kit include?",
          answer:
            "The athlete kit includes race bib, event t-shirt, event backpack, and various partner gifts. It is collected at the event venue. Uncollected kits are kept for 10 days after the event.",
        },
        [Language.es]: {
          question: "¿Qué incluye el kit del atleta?",
          answer:
            "El kit del atleta incluye dorsal, camiseta del evento, mochila del evento y regalos de los patrocinadores. Se entrega en el lugar del evento. Los kits no recogidos se guardan 10 días después del evento.",
        },
        [Language.fr]: {
          question: "Que comprend le kit athlète ?",
          answer:
            "Le kit athlète comprend un dossard, un t-shirt de l'événement, un sac à dos de l'événement et divers cadeaux des partenaires. Il est remis sur le lieu de l'événement. Les kits non récupérés sont conservés 10 jours après l'événement.",
        },
        [Language.de]: {
          question: "Was beinhaltet das Athletenpaket?",
          answer:
            "Das Athletenpaket enthält Startnummer, Event-T-Shirt, Event-Rucksack und diverse Partnergeschenke. Es wird am Veranstaltungsort abgeholt. Nicht abgeholte Pakete werden 10 Tage nach der Veranstaltung aufbewahrt.",
        },
        [Language.it]: {
          question: "Cosa include il kit atleta?",
          answer:
            "Il kit atleta include pettorale, t-shirt dell'evento, zaino dell'evento e vari omaggi dei partner. Viene ritirato presso la sede dell'evento. I kit non ritirati vengono conservati per 10 giorni dopo l'evento.",
        },
      },
    },
    {
      order: 9,
      translations: {
        [Language.pt]: {
          question: "Existe assistência médica durante a prova?",
          answer:
            "Sim. A organização tem previsto um plano de segurança e assistência médica ao longo de todo o percurso, com meios de assistência a qualquer ponto do percurso. Todos os membros da organização têm conhecimento do plano.",
        },
        [Language.en]: {
          question: "Is there medical assistance during the race?",
          answer:
            "Yes. The organization has a safety and medical assistance plan along the entire course, with assistance available at any point. All organization members are aware of the plan.",
        },
        [Language.es]: {
          question: "¿Hay asistencia médica durante la prueba?",
          answer:
            "Sí. La organización tiene previsto un plan de seguridad y asistencia médica a lo largo de todo el recorrido, con medios de asistencia en cualquier punto. Todos los miembros de la organización conocen el plan.",
        },
        [Language.fr]: {
          question: "Y a-t-il une assistance médicale pendant la course ?",
          answer:
            "Oui. L'organisation dispose d'un plan de sécurité et d'assistance médicale tout au long du parcours, avec des moyens d'assistance disponibles en tout point. Tous les membres de l'organisation sont informés du plan.",
        },
        [Language.de]: {
          question: "Gibt es medizinische Unterstützung während des Rennens?",
          answer:
            "Ja. Die Organisation hat einen Sicherheits- und medizinischen Hilfsplan entlang der gesamten Strecke, mit Hilfsmitteln an jedem Punkt. Alle Organisationsmitglieder kennen den Plan.",
        },
        [Language.it]: {
          question: "C'è assistenza medica durante la gara?",
          answer:
            "Sì. L'organizzazione dispone di un piano di sicurezza e assistenza medica lungo tutto il percorso, con mezzi di assistenza disponibili in ogni punto. Tutti i membri dell'organizzazione conoscono il piano.",
        },
      },
    },
    {
      order: 10,
      translations: {
        [Language.pt]: {
          question: "O percurso tem obstáculos aquáticos?",
          answer:
            "Sim. No Standard Course (14km e 10km) existe um obstáculo que implica nadar no Rio Tâmega, numa zona com bastante profundidade. Existem cordas, coletes salva-vidas e boias de socorro. Quem não saiba nadar não deve tentar este obstáculo.",
        },
        [Language.en]: {
          question: "Does the course have water obstacles?",
          answer:
            "Yes. The Standard Course (14km and 10km) includes an obstacle that requires swimming in the Tâmega River, in a deep section. There are ropes, life jackets, and rescue buoys. Athletes who cannot swim should not attempt this obstacle.",
        },
        [Language.es]: {
          question: "¿El recorrido tiene obstáculos acuáticos?",
          answer:
            "Sí. El Standard Course (14km y 10km) incluye un obstáculo que implica nadar en el Río Tâmega, en una zona con bastante profundidad. Existen cuerdas, chalecos salvavidas y boyas de rescate. Quienes no sepan nadar no deben intentar este obstáculo.",
        },
        [Language.fr]: {
          question: "Le parcours a-t-il des obstacles aquatiques ?",
          answer:
            "Oui. Le Standard Course (14km et 10km) comprend un obstacle nécessitant de nager dans le Rio Tâmega, dans une zone assez profonde. Des cordes, gilets de sauvetage et bouées de secours sont disponibles. Les athlètes ne sachant pas nager ne doivent pas tenter cet obstacle.",
        },
        [Language.de]: {
          question: "Hat die Strecke Wasserhindernisse?",
          answer:
            "Ja. Der Standard Course (14km und 10km) enthält ein Hindernis, das Schwimmen im Fluss Tâmega in einer tiefen Zone erfordert. Es gibt Seile, Schwimmwesten und Rettungsbojen. Athleten, die nicht schwimmen können, sollten dieses Hindernis nicht versuchen.",
        },
        [Language.it]: {
          question: "Il percorso ha ostacoli acquatici?",
          answer:
            "Sì. Lo Standard Course (14km e 10km) include un ostacolo che richiede di nuotare nel Fiume Tâmega, in una zona abbastanza profonda. Sono presenti corde, giubbotti di salvataggio e boe di soccorso. Gli atleti che non sanno nuotare non dovrebbero tentare questo ostacolo.",
        },
      },
    },
  ];

  for (const faq of faqs) {
    const createdFaq = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        order: faq.order,
        question: faq.translations[Language.pt].question,
        answer: faq.translations[Language.pt].answer,
      },
    });

    for (const lang of languages) {
      await prisma.eventFAQTranslation.create({
        data: {
          faqId: createdFaq.id,
          language: lang,
          question: faq.translations[lang].question,
          answer: faq.translations[lang].answer,
        },
      });
    }
  }

  console.log(`   ✅ Created ${faqs.length} FAQs with 6 language translations`);

  console.log("\n✅ Seed completed successfully!");
  console.log(`
📊 Summary:
- Event: Flavius Challenge OCR 2026
- Slug: flavius-challenge-ocr-2026
- Dates: 18-19 de abril de 2026
- Location: Alameda do Trajano, Chaves
- Races: Short 3KM (dia 18), Standard 14KM (dia 19), Open 10KM (dia 19), Kids 1KM (dia 18)
- Variants: 8 (Open, CN Standard, CN Short, Pack CN, Flavius Standard, Flavius Short, Pack Flavius, Kids)
- Pricing phases: 4 per variant (except Kids: 2)
- Languages: 6 (pt, en, es, fr, de, it)
- FAQs: ${faqs.length}
- Registration deadline: 9 de abril de 2026
- Organizer: Wildfun / Flavius Challenge OCR
- Website: https://lap2go.com/pt/event/ocr-flavius-challenge-2026
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
