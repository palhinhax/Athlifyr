/**
 * Seed: EDP Meia Maratona de Lisboa 2026
 *
 * Event: 21,097m road race — World Athletics Elite Label
 *        Part of the World Athletics calendar.
 * Location: Lisboa, Portugal
 * Date: 8 de Março de 2026 (Sunday)
 * Elite Start: Cruz Quebrada, 9:30
 * General Start: Deck of Ponte 25 de Abril (south-north), Gate No. 1
 * Finish: Praça do Império, Centro Cultural de Belém
 * Organizer: Maratona Clube de Portugal
 * Website: https://www.meiamaratonadelisboa.com
 */

import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding EDP Meia Maratona de Lisboa 2026...");

  // Delete existing event if it exists (idempotency)
  await prisma.event.deleteMany({
    where: {
      slug: "edp-meia-maratona-lisboa-2026",
    },
  });

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "EDP Meia Maratona de Lisboa 2026",
      slug: "edp-meia-maratona-lisboa-2026",
      description:
        "EDP Meia Maratona de Lisboa 2026 – World Athletics Elite Label. 21 km com partida na Ponte 25 de Abril e meta na Praça do Império, Belém.",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-03-08T09:30:00Z"),
      endDate: new Date("2026-03-08T13:05:00Z"),
      registrationDeadline: new Date("2026-03-01T23:59:59Z"),
      externalUrl: "https://www.meiamaratonadelisboa.com",
      imageUrl: "",
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.6972,
      longitude: -9.2064,
      googleMapsUrl: "https://maps.app.goo.gl/PracaImperioLisboa",
      isFeatured: true,
      cancelled: false,
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // ============================================================
  // TRANSLATIONS — ALL 6 LANGUAGES
  // ============================================================

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
    pt: {
      title: "EDP Meia Maratona de Lisboa 2026",
      description: `# 🏃 EDP Meia Maratona de Lisboa 2026

**World Athletics Elite Label | Transmissão em direto na RTP 1 | Uma das provas de atletismo de estrada mais emblemáticas do mundo.**

---

## 📅 Data e Horário

- **Data**: 8 de Março de 2026 (Domingo)
- **Hora de Partida (Elite)**: 9h30 — Cruz Quebrada
- **Hora de Partida (Geral)**: 9h30 — Deck da Ponte 25 de Abril, junto ao Portão Nº 1
- **Meta**: Praça do Império, frente ao Centro Cultural de Belém
- **Tempo Limite**: 3h00m (até às 13h05)

## 📏 Percurso

A EDP Meia Maratona de Lisboa percorre **21,097 metros** medidos pela World Athletics.

- Os atletas **Elite** partem de Cruz Quebrada (exclusivo para atletas de alto rendimento com tempo inferior a 1h05m nos últimos 3 anos; feminino: inferior a 1h20m).
- Os atletas **Gerais** partem do deck da Ponte 25 de Abril, sentido sul-norte, junto ao Portão Nº 1.
- Os atletas Elite juntam-se aos restantes na Ponte 25 de Abril a partir do km 7.
- **Meta comum** para todos: Praça do Império.

O percurso é certificado pela World Athletics e cronometrado com o sistema **MyLaps Pro-Ship** para os atletas Elite.

## 🎽 Levantamento do Kit de Participação

O levantamento dos dorsais e kit de participação realiza-se na **Sport Expo**, no **Centro de Congressos de Lisboa**:

| Dia | Horário |
|---|---|
| Quinta, 5 de Março | 10h00 – 20h00 |
| Sexta, 6 de Março | 10h00 – 20h00 |
| Sábado, 7 de Março | 10h00 – 20h00 |

⚠️ **Não haverá entrega de kits no dia da prova.**

O atleta deve apresentar o comprovativo de inscrição ou o documento impresso da inscrição online, bem como o documento de identificação.

### O Kit de Participação inclui:
- ✅ 1 T-shirt técnica oficial (5 tamanhos, sujeito a disponibilidade)
- ✅ 1 Dorsal com chip eletrónico
- ✅ 1 Saco de equipamento individual
- ✅ Ofertas e informações dos patrocinadores

## 🚂 Como Chegar à Partida

A partida encontra-se na **Ponte 25 de Abril**. O único meio de acesso é de **comboio Fertagus**, saindo na estação do **Pragal**.

- Os comboios Fertagus são **gratuitos** para os participantes mediante apresentação do dorsal.
- O transporte público (metro, autocarros e comboios) também é gratuito para quem se dirija às estações Fertagus.
- A caminhada da estação até à zona de partida demora entre **10 a 15 minutos**.

⚠️ **Apenas atletas com dorsal têm acesso à zona de partida. Espectadores não são permitidos na ponte.**

## 🏆 Categorias e Prémios

### Escalões de idade:

| Masculino | Feminino | Idades |
|---|---|---|
| M | W | 18–34 anos |
| M35 | W35 | 35–39 anos |
| M40 | W40 | 40–44 anos |
| M45 | W45 | 45–49 anos |
| M50 | W50 | 50–54 anos |
| M55 | W55 | 55–59 anos |
| M60 | W60 | +60 anos |
| M65 | W65 | +65 anos |
| M70 | W70 | +70 anos |

*A idade considerada é a do dia da prova.*

### Prémios Monetários (Elite):

| Lugar | Elite M/W |
|---|---|
| 1º | 1.000 € |
| 2º | 750 € |
| 3º | 500 € |
| 4º | 300 € |
| 5º | 200 € |

*Os prémios são pagos na totalidade para tempos inferiores a 1h03m30s (M) e 1h11m30s (W); caso contrário, 50%.*

### Prémios Gerais (por género, até 3º lugar):

| Lugar | Prémio |
|---|---|
| 1º | 300 € |
| 2º | 200 € |
| 3º | 100 € |

### Prémios Veteranos (por escalão, tier único):

| Lugar | Prémio |
|---|---|
| 1º | 200 € |
| 2º | 100 € |
| 3º | 50 € |

*Veteranos recebem o valor integral independentemente do tempo.*

## 📋 Informações Gerais

- **Limite de participantes**: 19.000 atletas
- **Idade mínima**: 18 anos
- **Cronometragem**: Sistema MyLaps (chip no dorsal) / Pro-Ship para Elite
- **Transmissão**: RTP 1 (em direto)
- **Seguro desportivo**: incluído para todos os participantes
- **Não há recolha de equipamentos** para os participantes da EDP Meia Maratona
- **Resultados definitivos**: 15 dias após a prova
- **Pacers**: <4:00 min/km, <4:30 min/km, <5:00 min/km, <5:30 min/km

## 🚫 Objetos Proibidos

Não é permitida a participação com bicicletas, animais, carrinhos de bebé, skates, patins, trotinetes ou qualquer outro dispositivo motorizado, nem objetos que possam gerar violência (ex.: garrafas de vidro).

## 🏥 Assistência Médica

A organização disponibiliza assistência médica ao longo de todo o percurso e na zona da meta, onde é instalada uma tenda hospitalar.

Em caso de acidente, contactar a MCP via email: geral@maratonaportugal.com

## 📍 Organização

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com
geral@maratonaportugal.com`,
      city: "Lisboa",
      metaTitle:
        "EDP Meia Maratona de Lisboa 2026 | World Athletics Elite Label | 8 Março",
      metaDescription:
        "EDP Meia Maratona de Lisboa 2026 – 8 de Março. 21 km, World Athletics Elite Label, transmissão RTP 1. Partida Ponte 25 de Abril, meta Praça do Império. 19.000 atletas. Inscrições em meiamaratonadelisboa.com.",
    },
    en: {
      title: "EDP Lisbon Half Marathon 2026",
      description: `# 🏃 EDP Lisbon Half Marathon 2026

**World Athletics Elite Label | Live broadcast on RTP 1 | One of the most iconic road running races in the world.**

---

## 📅 Date & Time

- **Date**: Sunday, 8 March 2026
- **Start Time (Elite)**: 9:30 AM — Cruz Quebrada
- **Start Time (General)**: 9:30 AM — Deck of 25 de Abril Bridge, Gate No. 1
- **Finish**: Praça do Império, in front of Centro Cultural de Belém
- **Time Limit**: 3h00m (until 1:05 PM)

## 📏 Course

The EDP Lisbon Half Marathon covers **21,097 metres** measured to World Athletics standards.

- **Elite** athletes start at Cruz Quebrada (exclusive to high-performance athletes with a sub-1h05m time in the last 3 years; women: sub-1h20m).
- **General** athletes start on the deck of the 25 de Abril Bridge, south-to-north direction, next to Gate No. 1.
- Elite athletes join the general field on the 25 de Abril Bridge from km 7.
- **Common finish** for all: Praça do Império.

The course is certified by World Athletics and timed using the **MyLaps Pro-Ship** system for Elite athletes.

## 🎽 Participation Kit Collection

Kit collection takes place at **Sport Expo**, **Centro de Congressos de Lisboa**:

| Day | Hours |
|---|---|
| Thursday, 5 March | 10:00 AM – 8:00 PM |
| Friday, 6 March | 10:00 AM – 8:00 PM |
| Saturday, 7 March | 10:00 AM – 8:00 PM |

⚠️ **No kits will be distributed on race day.**

Athletes must present their registration confirmation or printed online registration document, along with a valid ID.

### The Participation Kit includes:
- ✅ 1 Official technical t-shirt (5 sizes, subject to availability)
- ✅ 1 Bib with electronic chip
- ✅ 1 Individual equipment bag
- ✅ Sponsor gifts and information

## 🚂 Getting to the Start

The start is on the **25 de Abril Bridge**. The only way to access the start area is by **Fertagus train**, exiting at **Pragal station**.

- Fertagus trains are **free** for participants upon showing their bib.
- Public transport (metro, buses, trains) is also free for those travelling to Fertagus stations.
- The walk from the station to the start area takes **10–15 minutes**.

⚠️ **Only athletes with a bib will be allowed access to the start area. Spectators are not permitted on the bridge.**

## 🏆 Categories & Prizes

### Age Groups:

| Men | Women | Ages |
|---|---|---|
| M | W | 18–34 |
| M35 | W35 | 35–39 |
| M40 | W40 | 40–44 |
| M45 | W45 | 45–49 |
| M50 | W50 | 50–54 |
| M55 | W55 | 55–59 |
| M60 | W60 | +60 |
| M65 | W65 | +65 |
| M70 | W70 | +70 |

*Age is calculated on race day.*

### Elite Prize Money:

| Place | Elite M/W |
|---|---|
| 1st | €1,000 |
| 2nd | €750 |
| 3rd | €500 |
| 4th | €300 |
| 5th | €200 |

*Full prize paid for sub-1h03m30s (M) / sub-1h11m30s (W); otherwise 50%.*

### General Prizes (by gender, top 3):

| Place | Prize |
|---|---|
| 1st | €300 |
| 2nd | €200 |
| 3rd | €100 |

### Veterans Prizes (per age group, single tier):

| Place | Prize |
|---|---|
| 1st | €200 |
| 2nd | €100 |
| 3rd | €50 |

*Veterans receive the full amount regardless of time.*

## 📋 General Info

- **Participant limit**: 19,000 athletes
- **Minimum age**: 18 years
- **Timing**: MyLaps system (chip on bib) / Pro-Ship for Elite
- **Broadcast**: RTP 1 (live)
- **Sports insurance**: included for all participants
- **No bag drop** for EDP Half Marathon participants
- **Official results**: 15 days after the race
- **Pacers**: <4:00 min/km, <4:30 min/km, <5:00 min/km, <5:30 min/km

## 🚫 Prohibited Items

No bicycles, animals, prams, skateboards, rollerblades, scooters or motorised devices. No glass bottles or objects that could generate violence.

## 🏥 Medical Assistance

Medical assistance is provided throughout the course and at the finish area, where a medical tent will be set up.

In case of accident, contact MCP at: geral@maratonaportugal.com

## 📍 Organiser

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lisbon",
      metaTitle:
        "EDP Lisbon Half Marathon 2026 | World Athletics Elite Label | 8 March",
      metaDescription:
        "EDP Lisbon Half Marathon 2026 – 8 March. 21km, World Athletics Elite Label, live on RTP 1. Start: 25 de Abril Bridge, Finish: Praça do Império. 19,000 athletes. Register at meiamaratonadelisboa.com.",
    },
    es: {
      title: "EDP Medio Maratón de Lisboa 2026",
      description: `# 🏃 EDP Medio Maratón de Lisboa 2026

**World Athletics Elite Label | Transmisión en directo en RTP 1 | Una de las carreras de atletismo en carretera más icónicas del mundo.**

---

## 📅 Fecha y Horario

- **Fecha**: Domingo, 8 de marzo de 2026
- **Hora de Salida (Elite)**: 9:30 — Cruz Quebrada
- **Hora de Salida (General)**: 9:30 — Deck del Puente 25 de Abril, junto al Portón Nº 1
- **Meta**: Praça do Império, frente al Centro Cultural de Belém
- **Tiempo Límite**: 3h00m (hasta las 13:05)

## 📏 Recorrido

El EDP Medio Maratón de Lisboa recorre **21.097 metros** medidos según los estándares de World Athletics.

- Los atletas **Elite** salen de Cruz Quebrada (exclusivo para atletas de alto rendimiento con tiempo inferior a 1h05m en los últimos 3 años; mujeres: inferior a 1h20m).
- Los atletas **Generales** salen desde el deck del Puente 25 de Abril, dirección sur-norte, junto al Portón Nº 1.
- Los atletas Elite se unen al resto en el Puente 25 de Abril desde el km 7.
- **Meta común** para todos: Praça do Império.

## 🎽 Recogida del Kit de Participación

La recogida tiene lugar en la **Sport Expo**, **Centro de Congressos de Lisboa**:

| Día | Horario |
|---|---|
| Jueves, 5 de marzo | 10:00 – 20:00 |
| Viernes, 6 de marzo | 10:00 – 20:00 |
| Sábado, 7 de marzo | 10:00 – 20:00 |

⚠️ **No se distribuirán kits el día de la carrera.**

### El Kit de Participación incluye:
- ✅ 1 Camiseta técnica oficial
- ✅ 1 Dorsal con chip electrónico
- ✅ 1 Bolsa de equipamiento
- ✅ Regalos de patrocinadores

## 🏆 Categorías y Premios

### Grupos de edad:

| Masculino | Femenino | Edades |
|---|---|---|
| M | W | 18–34 |
| M35 | W35 | 35–39 |
| M40 | W40 | 40–44 |
| M45 | W45 | 45–49 |
| M50 | W50 | 50–54 |
| M55 | W55 | 55–59 |
| M60 | W60 | +60 |
| M65 | W65 | +65 |
| M70 | W70 | +70 |

### Premios en Metálico Elite:

| Posición | Elite M/F |
|---|---|
| 1º | 1.000 € |
| 2º | 750 € |
| 3º | 500 € |
| 4º | 300 € |
| 5º | 200 € |

### Premios Generales (por género, top 3):

| Posición | Premio |
|---|---|
| 1º | 300 € |
| 2º | 200 € |
| 3º | 100 € |

## 📋 Información General

- **Límite de participantes**: 19.000 atletas
- **Edad mínima**: 18 años
- **Cronometraje**: Sistema MyLaps / Pro-Ship para Elite
- **Transmisión**: RTP 1 (en directo)
- **Seguro deportivo**: incluido
- **Sin guardarropa**
- **Pacers**: <4:00 min/km, <4:30 min/km, <5:00 min/km, <5:30 min/km

## 📍 Organizador

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lisboa",
      metaTitle:
        "EDP Medio Maratón Lisboa 2026 | World Athletics Elite Label | 8 Marzo",
      metaDescription:
        "EDP Medio Maratón de Lisboa 2026 – 8 de marzo. 21 km, World Athletics Elite Label, directo en RTP 1. Salida Puente 25 de Abril, meta Praça do Império. 19.000 atletas.",
    },
    fr: {
      title: "EDP Semi-Marathon de Lisbonne 2026",
      description: `# 🏃 EDP Semi-Marathon de Lisbonne 2026

**World Athletics Elite Label | Diffusion en direct sur RTP 1 | L'une des courses sur route les plus iconiques au monde.**

---

## 📅 Date et Horaire

- **Date** : Dimanche 8 mars 2026
- **Heure de Départ (Élite)** : 9h30 — Cruz Quebrada
- **Heure de Départ (Général)** : 9h30 — Pont 25 de Abril, Portail Nº 1
- **Arrivée** : Praça do Império, devant le Centro Cultural de Belém
- **Limite de Temps** : 3h00 (jusqu'à 13h05)

## 📏 Parcours

Le EDP Semi-Marathon de Lisbonne couvre **21 097 mètres** mesurés selon les normes de World Athletics.

- Les athlètes **Élite** partent de Cruz Quebrada (exclusif aux athlètes de haut niveau avec un temps inférieur à 1h05 dans les 3 dernières années ; femmes : inférieur à 1h20).
- Les athlètes **Généraux** partent du pont 25 de Abril, direction sud-nord, portail Nº 1.
- Les athlètes Élite rejoignent le reste du peloton sur le pont 25 de Abril à partir du km 7.
- **Arrivée commune** : Praça do Império.

## 🎽 Retrait du Kit de Participation

Le retrait a lieu à la **Sport Expo**, **Centro de Congressos de Lisboa** :

| Jour | Horaires |
|---|---|
| Jeudi 5 mars | 10h00 – 20h00 |
| Vendredi 6 mars | 10h00 – 20h00 |
| Samedi 7 mars | 10h00 – 20h00 |

⚠️ **Aucun kit ne sera distribué le jour de la course.**

### Le Kit de Participation comprend :
- ✅ 1 T-shirt technique officiel
- ✅ 1 Dossard avec puce électronique
- ✅ 1 Sac d'équipement
- ✅ Cadeaux des sponsors

## 🏆 Catégories et Prix

### Groupes d'âge :

| Hommes | Femmes | Âges |
|---|---|---|
| M | W | 18–34 |
| M35 | W35 | 35–39 |
| M40 | W40 | 40–44 |
| M45 | W45 | 45–49 |
| M50 | W50 | 50–54 |
| M55 | W55 | 55–59 |
| M60 | W60 | +60 |
| M65 | W65 | +65 |
| M70 | W70 | +70 |

### Prix Élite :

| Place | Élite H/F |
|---|---|
| 1er | 1 000 € |
| 2e | 750 € |
| 3e | 500 € |
| 4e | 300 € |
| 5e | 200 € |

### Prix Généraux (par genre, top 3) :

| Place | Prix |
|---|---|
| 1er | 300 € |
| 2e | 200 € |
| 3e | 100 € |

## 📋 Informations Générales

- **Limite de participants** : 19 000 athlètes
- **Âge minimum** : 18 ans
- **Chronométrage** : Système MyLaps / Pro-Ship pour l'Élite
- **Diffusion** : RTP 1 (en direct)
- **Assurance sportive** : incluse
- **Pas de vestiaire**
- **Pacers** : <4:00 min/km, <4:30 min/km, <5:00 min/km, <5:30 min/km

## 📍 Organisateur

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lisbonne",
      metaTitle:
        "EDP Semi-Marathon Lisbonne 2026 | World Athletics Elite Label | 8 Mars",
      metaDescription:
        "EDP Semi-Marathon de Lisbonne 2026 – 8 mars. 21 km, World Athletics Elite Label, direct RTP 1. Départ Pont 25 de Abril, arrivée Praça do Império. 19 000 athlètes.",
    },
    de: {
      title: "EDP Lissabon Halbmarathon 2026",
      description: `# 🏃 EDP Lissabon Halbmarathon 2026

**World Athletics Elite Label | Live-Übertragung auf RTP 1 | Einer der ikonischsten Straßenläufe der Welt.**

---

## 📅 Datum und Uhrzeit

- **Datum**: Sonntag, 8. März 2026
- **Startzeit (Elite)**: 9:30 Uhr — Cruz Quebrada
- **Startzeit (Allgemein)**: 9:30 Uhr — Deck der Brücke 25 de Abril, Tor Nr. 1
- **Ziel**: Praça do Império, vor dem Centro Cultural de Belém
- **Zeitlimit**: 3h00 (bis 13:05 Uhr)

## 📏 Strecke

Der EDP Lissabon Halbmarathon umfasst **21.097 Meter**, gemessen nach World Athletics-Standards.

- **Elite**-Athleten starten in Cruz Quebrada (nur für Hochleistungssportler mit einer Zeit unter 1h05min in den letzten 3 Jahren; Frauen: unter 1h20min).
- **Allgemeine** Athleten starten auf dem Deck der Brücke 25 de Abril, Richtung Süd-Nord, Tor Nr. 1.
- Elite-Athleten schließen sich dem Hauptfeld auf der Brücke 25 de Abril ab km 7 an.
- **Gemeinsames Ziel** für alle: Praça do Império.

## 🎽 Abholung des Teilnahme-Kits

Die Abholung findet bei der **Sport Expo**, **Centro de Congressos de Lisboa** statt:

| Tag | Uhrzeiten |
|---|---|
| Donnerstag, 5. März | 10:00 – 20:00 Uhr |
| Freitag, 6. März | 10:00 – 20:00 Uhr |
| Samstag, 7. März | 10:00 – 20:00 Uhr |

⚠️ **Am Renntag werden keine Kits ausgegeben.**

### Das Teilnahme-Kit enthält:
- ✅ 1 Offizielles technisches T-Shirt
- ✅ 1 Startnummer mit elektronischem Chip
- ✅ 1 Ausrüstungstasche
- ✅ Sponsor-Geschenke

## 🏆 Kategorien und Preise

### Altersgruppen:

| Männer | Frauen | Alter |
|---|---|---|
| M | W | 18–34 |
| M35 | W35 | 35–39 |
| M40 | W40 | 40–44 |
| M45 | W45 | 45–49 |
| M50 | W50 | 50–54 |
| M55 | W55 | 55–59 |
| M60 | W60 | +60 |
| M65 | W65 | +65 |
| M70 | W70 | +70 |

### Elite-Preisgelder:

| Platz | Elite M/F |
|---|---|
| 1. | 1.000 € |
| 2. | 750 € |
| 3. | 500 € |
| 4. | 300 € |
| 5. | 200 € |

### Allgemeine Preise (nach Geschlecht, Top 3):

| Platz | Preis |
|---|---|
| 1. | 300 € |
| 2. | 200 € |
| 3. | 100 € |

## 📋 Allgemeine Informationen

- **Teilnehmerlimit**: 19.000 Athleten
- **Mindestalter**: 18 Jahre
- **Zeitmessung**: MyLaps-System / Pro-Ship für Elite
- **Übertragung**: RTP 1 (live)
- **Sportversicherung**: inklusive
- **Keine Gepäckaufbewahrung**
- **Tempomacher**: <4:00 min/km, <4:30 min/km, <5:00 min/km, <5:30 min/km

## 📍 Veranstalter

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lissabon",
      metaTitle:
        "EDP Lissabon Halbmarathon 2026 | World Athletics Elite Label | 8. März",
      metaDescription:
        "EDP Lissabon Halbmarathon 2026 – 8. März. 21 km, World Athletics Elite Label, live auf RTP 1. Start: Brücke 25 de Abril, Ziel: Praça do Império. 19.000 Athleten.",
    },
    it: {
      title: "EDP Mezza Maratona di Lisbona 2026",
      description: `# 🏃 EDP Mezza Maratona di Lisbona 2026

**World Athletics Elite Label | Diretta su RTP 1 | Una delle gare su strada più iconiche al mondo.**

---

## 📅 Data e Orario

- **Data**: Domenica 8 marzo 2026
- **Ora di Partenza (Elite)**: 9:30 — Cruz Quebrada
- **Ora di Partenza (Generale)**: 9:30 — Deck del Ponte 25 de Abril, Cancello N. 1
- **Arrivo**: Praça do Império, davanti al Centro Cultural de Belém
- **Tempo Limite**: 3h00 (fino alle 13:05)

## 📏 Percorso

La EDP Mezza Maratona di Lisbona copre **21.097 metri** misurati secondo gli standard World Athletics.

- Gli atleti **Elite** partono da Cruz Quebrada (esclusivo per atleti d'alto livello con tempo inferiore a 1h05 negli ultimi 3 anni; donne: inferiore a 1h20).
- Gli atleti **Generali** partono dal deck del Ponte 25 de Abril, direzione sud-nord, Cancello N. 1.
- Gli atleti Elite si uniscono al gruppo sul Ponte 25 de Abril dal km 7.
- **Arrivo comune** per tutti: Praça do Império.

## 🎽 Ritiro del Kit di Partecipazione

Il ritiro avviene alla **Sport Expo**, **Centro de Congressos de Lisboa**:

| Giorno | Orario |
|---|---|
| Giovedì 5 marzo | 10:00 – 20:00 |
| Venerdì 6 marzo | 10:00 – 20:00 |
| Sabato 7 marzo | 10:00 – 20:00 |

⚠️ **Nessun kit sarà distribuito il giorno della gara.**

### Il Kit di Partecipazione include:
- ✅ 1 T-shirt tecnica ufficiale
- ✅ 1 Pettorale con chip elettronico
- ✅ 1 Sacca per l'attrezzatura
- ✅ Omaggi degli sponsor

## 🏆 Categorie e Premi

### Gruppi d'età:

| Uomini | Donne | Età |
|---|---|---|
| M | W | 18–34 |
| M35 | W35 | 35–39 |
| M40 | W40 | 40–44 |
| M45 | W45 | 45–49 |
| M50 | W50 | 50–54 |
| M55 | W55 | 55–59 |
| M60 | W60 | +60 |
| M65 | W65 | +65 |
| M70 | W70 | +70 |

### Premi Elite:

| Posizione | Elite M/F |
|---|---|
| 1º | 1.000 € |
| 2º | 750 € |
| 3º | 500 € |
| 4º | 300 € |
| 5º | 200 € |

### Premi Generali (per genere, top 3):

| Posizione | Premio |
|---|---|
| 1º | 300 € |
| 2º | 200 € |
| 3º | 100 € |

## 📋 Informazioni Generali

- **Limite partecipanti**: 19.000 atleti
- **Età minima**: 18 anni
- **Cronometraggio**: Sistema MyLaps / Pro-Ship per Elite
- **Trasmissione**: RTP 1 (in diretta)
- **Assicurazione sportiva**: inclusa
- **Nessun deposito bagagli**
- **Pacer**: <4:00 min/km, <4:30 min/km, <5:00 min/km, <5:30 min/km

## 📍 Organizzatore

**Maratona Clube de Portugal (MCP)**
Av. João de Freitas Branco, 10 Laveiras
2760-073 Oeiras, Portugal
info@maratonaportugal.com`,
      city: "Lisbona",
      metaTitle:
        "EDP Mezza Maratona Lisbona 2026 | World Athletics Elite Label | 8 Marzo",
      metaDescription:
        "EDP Mezza Maratona di Lisbona 2026 – 8 marzo. 21 km, World Athletics Elite Label, diretta RTP 1. Partenza Ponte 25 de Abril, arrivo Praça do Império. 19.000 atleti.",
    },
  };

  for (const lang of Object.keys(translations) as Language[]) {
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
  }

  console.log("✅ Translations upserted for all 6 languages");

  // ============================================================
  // VARIANTS + PRICING PHASES
  // ============================================================

  const variants = [
    {
      name: "EDP Meia Maratona 21K",
      distanceKm: 21.097,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-03-08T09:30:00Z"),
      startTime: "09:30",
      cutoffTimeHours: 3.0,
      price: 30,
      currency: Currency.EUR,
      maxParticipants: 19000,
      atrpGrade: null,
      itraPoints: null,
      description:
        "21.097m road race — World Athletics Elite Label. Elite start: Cruz Quebrada. General start: 25 de Abril Bridge, Gate No. 1. Finish: Praça do Império, Belém. Time limit: 3h00.",
      pricingPhases: [
        {
          name: "Inscrição Antecipada",
          startDate: new Date("2025-09-01T00:00:00Z"),
          endDate: new Date("2025-11-30T23:59:59Z"),
          price: 22,
          currency: Currency.EUR,
          note: "1ª Fase – Inscrição antecipada",
        },
        {
          name: "Inscrição Normal",
          startDate: new Date("2025-12-01T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 27,
          currency: Currency.EUR,
          note: "2ª Fase – Inscrição normal",
        },
        {
          name: "Inscrição Tardia",
          startDate: new Date("2026-02-09T00:00:00Z"),
          endDate: new Date("2026-03-01T23:59:59Z"),
          price: 30,
          currency: Currency.EUR,
          note: "3ª Fase – Inscrição tardia",
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

    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          variantId: variant.id,
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

  console.log("\n✅ Seed completed successfully!");
  console.log("\n📊 Summary:");
  console.log("- Event: EDP Meia Maratona de Lisboa 2026");
  console.log("- Slug: edp-meia-maratona-lisboa-2026");
  console.log("- Variant: EDP Meia Maratona 21K (21.097 km)");
  console.log("- Participant limit: 19.000");
  console.log("- Languages: 6 (pt, en, es, fr, de, it)");
  console.log("- Pricing Phases: 3 (Antecipada / Normal / Tardia)");
  console.log(
    "- Date: 8 March 2026 — Elite Start 9:30 (Cruz Quebrada), General Start 9:30 (Ponte 25 de Abril)"
  );
  console.log("- Finish: Praça do Império, Centro Cultural de Belém");
  console.log("- Organiser: Maratona Clube de Portugal");
  console.log("- Label: World Athletics Elite Label");
  console.log("- Broadcast: RTP 1 (live)");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
