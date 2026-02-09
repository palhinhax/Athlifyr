/**
 * Seed: 17.º Saloios BTT 2026
 *
 * Evento de BTT não competitivo (com classificação lúdica na Maratona)
 * em Arneiros, Ventosa, Torres Vedras.
 * Maratona 65km e Meia-Maratona 35km por trilhos e caminhos rurais
 * dos concelhos de Torres Vedras e Mafra.
 *
 * Organização: A.C.D.R. Arneiros - Saloios BTT
 * Apoio: Câmara Municipal de Torres Vedras
 *
 * Execução:
 *   pnpm tsx prisma/seeds/2026/portugal/05-maio/saloios-btt-2026.ts
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 17.º Saloios BTT 2026...");

  const eventSlug = "saloios-btt-2026";

  // ============================================================================
  // 1. UPSERT EVENT
  // ============================================================================
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "17.º Saloios BTT 2026",
      description:
        "Evento de BTT com Maratona 65km e Meia-Maratona 35km por trilhos e caminhos rurais de Torres Vedras e Mafra. Partida na Adega Cooperativa da Ventosa, Arneiros.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-05-24T08:00:00.000Z"),
      endDate: new Date("2026-05-24T18:00:00.000Z"),
      city: "Torres Vedras",
      country: "Portugal",
      latitude: 39.0667,
      longitude: -9.2667,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Adega+Cooperativa+Ventosa+Arneiros+Torres+Vedras",
      externalUrl: "https://apedalar.pt/eventos/4072/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-17T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "17.º Saloios BTT 2026",
      description:
        "Evento de BTT com Maratona 65km e Meia-Maratona 35km por trilhos e caminhos rurais de Torres Vedras e Mafra. Partida na Adega Cooperativa da Ventosa, Arneiros.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-05-24T08:00:00.000Z"),
      endDate: new Date("2026-05-24T18:00:00.000Z"),
      city: "Torres Vedras",
      country: "Portugal",
      latitude: 39.0667,
      longitude: -9.2667,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Adega+Cooperativa+Ventosa+Arneiros+Torres+Vedras",
      externalUrl: "https://apedalar.pt/eventos/4072/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-05-17T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // ============================================================================
  // 2. UPSERT TRANSLATIONS (ALL 6 LANGUAGES)
  // ============================================================================
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
      title: "17.º Saloios BTT 2026",
      city: "Torres Vedras",
      metaTitle: "17.º Saloios BTT 2026 | Arneiros, Torres Vedras | 24 Maio",
      metaDescription:
        "17.º Saloios BTT 2026 - 24 de maio em Arneiros, Ventosa, Torres Vedras. Maratona 65km e Meia-Maratona 35km por trilhos dos concelhos de Torres Vedras e Mafra. Programa Torres Vedras a Pedalar.",
      description: `# 🚴 17.º Saloios BTT 2026

O **17.º Saloios BTT** regressa no dia **24 de maio de 2026** para mais uma edição imperdível! Um evento de BTT destinado a todas as pessoas, integrado no programa **Torres Vedras a Pedalar**.

## 📅 Data e Local

- **Data:** Domingo, 24 de maio de 2026
- **Hora de Partida:** 09:00
- **Local de Partida/Chegada:** Adega Cooperativa de São Mamede da Ventosa, Arneiros
- **Concelho:** Torres Vedras
- **Distrito:** Lisboa

## 🚴 Percursos Disponíveis

O percurso decorre por **trilhos, caminhos rurais, públicos e estradas municipais** dos concelhos de Torres Vedras e Mafra.

| Percurso | Distância | Escalões |
|----------|-----------|----------|
| **Maratona** | ~65 km | Sub23 M, Elites M, Masters 30/40/50/60 M, Elites F, Masters F |
| **Meia-Maratona** | ~35 km | Sub23 M, Elites M, Masters 30/40/50/60 M, Elites F, Masters F |
| **eBikes - Maratona** | ~65 km | eBikes |
| **eBikes - Meia-Maratona** | ~35 km | eBikes |

### 🏆 Competição

- A vertente **Maratona** tem **competição com pódio** (3 primeiros masculinos e femininos)
- Controlo de tempos com fim lúdico em todos os percursos
- Classificações por escalões disponíveis para todos

### ⚡ eBikes

Bicicletas elétricas são permitidas com escalão próprio, não contando para as classificações gerais.

## 💶 Inscrições e Preços

As inscrições são feitas online em [apedalar.pt](https://apedalar.pt/eventos/4072/info), limitadas a **1000 inscritos**.

| Fase | Período | Inscrição | Almoço | Acompanhantes |
|------|---------|-----------|--------|---------------|
| **Fase 1** | Até 31 dezembro 2025 | 11,00€ | +5,00€ | +5,00€ |
| **Fase 2** | 1 fevereiro - 16 abril 2026 | 13,00€ | +5,00€ | +5,00€ |
| **Fase 3** | 17 abril - 17 maio 2026 | 15,00€ | +6,00€ | +6,00€ |

### 🍖 Almoço - Bucha Saloia

O almoço é constituído por **1 bifana + 1 bebida** (sumo ou cerveja).

## 🎁 A Inscrição Inclui

- ✅ Frontal/Identificador
- ✅ Brindes dos parceiros
- ✅ Seguro de Acidentes Pessoais
- ✅ Abastecimentos (sólidos e líquidos)
- ✅ Banhos quentes
- ✅ Local para lavagem de bicicletas
- ✅ Sorteio de artigos de BTT
- ✅ Cronometragem

### Abastecimentos:
- **Maratona:** 2 zonas de abastecimento
- **Meia-Maratona:** 1 zona de abastecimento

## 🏁 Partida

A partida é às **09:00 em ponto** para todos, com 2 boxes delimitadas:
- **Box 1:** Inscritos na Maratona
- **Box 2:** Inscritos na Meia-Maratona

## ⚠️ Regras Importantes

- 🪖 **Uso de capacete obrigatório** durante todo o percurso
- 🚮 Proibido deixar lixo no percurso (sujeito a multa)
- Respeitar as regras de circulação de trânsito
- Participação a partir dos **16 anos** (menores necessitam de autorização)
- Percursos não guiados — atenção à sinalização

## 📧 Contactos

- **Email:** saloiosbtt.oficial@gmail.com
- **Website:** [saloiosbtt.pt](http://www.saloiosbtt.pt)
- **Facebook:** [Saloios BTT](https://www.facebook.com/saloios.btt)

## 🏆 Organização

- **Organização:** A.C.D.R. Arneiros - Saloios BTT
- **Apoio:** Câmara Municipal de Torres Vedras
- **Programa:** Torres Vedras a Pedalar

Junta-te a nós para mais uma grande aventura pelos trilhos saloios! 🚵‍♂️🌳`,
    },
    {
      language: "en",
      title: "17th Saloios BTT 2026",
      city: "Torres Vedras",
      metaTitle: "17th Saloios BTT 2026 | Arneiros, Torres Vedras | May 24",
      metaDescription:
        "17th Saloios BTT 2026 - May 24 in Arneiros, Ventosa, Torres Vedras. Marathon 65km and Half-Marathon 35km through trails in Torres Vedras and Mafra municipalities.",
      description: `# 🚴 17th Saloios BTT 2026

The **17th Saloios BTT** returns on **May 24, 2026** for another unmissable edition! A mountain biking event open to everyone, part of the **Torres Vedras a Pedalar** program.

## 📅 Date and Location

- **Date:** Sunday, May 24, 2026
- **Start Time:** 09:00
- **Start/Finish:** Adega Cooperativa de São Mamede da Ventosa, Arneiros
- **Municipality:** Torres Vedras
- **District:** Lisbon

## 🚴 Available Routes

The course follows **trails, rural paths, public roads and municipal roads** through Torres Vedras and Mafra municipalities.

| Route | Distance | Categories |
|-------|----------|------------|
| **Marathon** | ~65 km | U23 M, Elite M, Masters 30/40/50/60 M, Elite F, Masters F |
| **Half-Marathon** | ~35 km | U23 M, Elite M, Masters 30/40/50/60 M, Elite F, Masters F |
| **eBikes - Marathon** | ~65 km | eBikes |
| **eBikes - Half-Marathon** | ~35 km | eBikes |

### 🏆 Competition

- The **Marathon** route features a **podium competition** (top 3 male and female)
- Recreational timing for all routes
- Age group rankings available for everyone

### ⚡ eBikes

Electric bikes are welcome with a dedicated category, not counting toward general rankings.

## 💶 Registration and Prices

Register online at [apedalar.pt](https://apedalar.pt/eventos/4072/info), limited to **1,000 participants**.

| Phase | Period | Registration | Lunch | Companions |
|-------|--------|-------------|-------|------------|
| **Phase 1** | Until December 31, 2025 | €11.00 | +€5.00 | +€5.00 |
| **Phase 2** | February 1 - April 16, 2026 | €13.00 | +€5.00 | +€5.00 |
| **Phase 3** | April 17 - May 17, 2026 | €15.00 | +€6.00 | +€6.00 |

### 🍖 Lunch - Bucha Saloia

The traditional lunch includes **1 pork sandwich + 1 drink** (juice or beer).

## 🎁 Registration Includes

- ✅ Race bib/identifier
- ✅ Partner gifts
- ✅ Personal accident insurance
- ✅ Aid stations (food and drinks)
- ✅ Hot showers
- ✅ Bike wash area
- ✅ BTT gear raffle
- ✅ Timing

### Aid Stations:
- **Marathon:** 2 aid stations
- **Half-Marathon:** 1 aid station

## 📧 Contact

- **Email:** saloiosbtt.oficial@gmail.com
- **Website:** [saloiosbtt.pt](http://www.saloiosbtt.pt)
- **Facebook:** [Saloios BTT](https://www.facebook.com/saloios.btt)

## 🏆 Organization

- **Organized by:** A.C.D.R. Arneiros - Saloios BTT
- **Support:** Torres Vedras Municipality
- **Program:** Torres Vedras a Pedalar

Join us for another great adventure through the Saloio trails! 🚵‍♂️🌳`,
    },
    {
      language: "es",
      title: "17.º Saloios BTT 2026",
      city: "Torres Vedras",
      metaTitle: "17.º Saloios BTT 2026 | Arneiros, Torres Vedras | 24 Mayo",
      metaDescription:
        "17.º Saloios BTT 2026 - 24 de mayo en Arneiros, Ventosa, Torres Vedras. Maratón 65km y Media Maratón 35km por senderos de Torres Vedras y Mafra.",
      description: `# 🚴 17.º Saloios BTT 2026

El **17.º Saloios BTT** regresa el **24 de mayo de 2026** para otra edición imperdible. Un evento de BTT destinado a todas las personas, integrado en el programa **Torres Vedras a Pedalar**.

## 📅 Fecha y Ubicación

- **Fecha:** Domingo, 24 de mayo de 2026
- **Hora de Salida:** 09:00
- **Lugar de Salida/Llegada:** Adega Cooperativa de São Mamede da Ventosa, Arneiros
- **Municipio:** Torres Vedras
- **Distrito:** Lisboa

## 🚴 Recorridos Disponibles

El recorrido discurre por **senderos, caminos rurales, públicos y carreteras municipales** de los municipios de Torres Vedras y Mafra.

| Recorrido | Distancia | Categorías |
|-----------|-----------|------------|
| **Maratón** | ~65 km | Sub23 M, Élites M, Masters 30/40/50/60 M, Élites F, Masters F |
| **Media Maratón** | ~35 km | Sub23 M, Élites M, Masters 30/40/50/60 M, Élites F, Masters F |
| **eBikes - Maratón** | ~65 km | eBikes |
| **eBikes - Media Maratón** | ~35 km | eBikes |

### 🏆 Competición

- La modalidad **Maratón** tiene **competición con podio** (3 primeros masculinos y femeninos)
- Cronometraje lúdico en todos los recorridos
- Clasificaciones por categorías de edad disponibles

### ⚡ eBikes

Las bicicletas eléctricas son bienvenidas con una categoría propia, sin contar para las clasificaciones generales.

## 💶 Inscripciones y Precios

Inscripciones online en [apedalar.pt](https://apedalar.pt/eventos/4072/info), limitadas a **1.000 inscritos**.

| Fase | Período | Inscripción | Almuerzo | Acompañantes |
|------|---------|-------------|----------|--------------|
| **Fase 1** | Hasta 31 diciembre 2025 | 11,00€ | +5,00€ | +5,00€ |
| **Fase 2** | 1 febrero - 16 abril 2026 | 13,00€ | +5,00€ | +5,00€ |
| **Fase 3** | 17 abril - 17 mayo 2026 | 15,00€ | +6,00€ | +6,00€ |

### 🍖 Almuerzo - Bucha Saloia

El almuerzo incluye **1 bocadillo de cerdo + 1 bebida** (zumo o cerveza).

## 🎁 La Inscripción Incluye

- ✅ Dorsal/Identificador
- ✅ Regalos de los patrocinadores
- ✅ Seguro de accidentes personales
- ✅ Avituallamiento (sólidos y líquidos)
- ✅ Duchas calientes
- ✅ Zona de lavado de bicicletas
- ✅ Sorteo de artículos de BTT
- ✅ Cronometraje

## 📧 Contacto

- **Email:** saloiosbtt.oficial@gmail.com
- **Website:** [saloiosbtt.pt](http://www.saloiosbtt.pt)
- **Facebook:** [Saloios BTT](https://www.facebook.com/saloios.btt)

## 🏆 Organización

- **Organización:** A.C.D.R. Arneiros - Saloios BTT
- **Apoyo:** Ayuntamiento de Torres Vedras

¡Únete a nosotros para otra gran aventura por los senderos saloios! 🚵‍♂️🌳`,
    },
    {
      language: "fr",
      title: "17e Saloios BTT 2026",
      city: "Torres Vedras",
      metaTitle: "17e Saloios BTT 2026 | Arneiros, Torres Vedras | 24 Mai",
      metaDescription:
        "17e Saloios BTT 2026 - 24 mai à Arneiros, Ventosa, Torres Vedras. Marathon 65km et Semi-Marathon 35km sur les sentiers de Torres Vedras et Mafra.",
      description: `# 🚴 17e Saloios BTT 2026

Le **17e Saloios BTT** revient le **24 mai 2026** pour une nouvelle édition incontournable ! Un événement VTT ouvert à tous, intégré au programme **Torres Vedras a Pedalar**.

## 📅 Date et Lieu

- **Date :** Dimanche 24 mai 2026
- **Heure de Départ :** 09h00
- **Lieu de Départ/Arrivée :** Adega Cooperativa de São Mamede da Ventosa, Arneiros
- **Commune :** Torres Vedras
- **District :** Lisbonne

## 🚴 Parcours Disponibles

Le parcours emprunte des **sentiers, chemins ruraux, voies publiques et routes municipales** des communes de Torres Vedras et Mafra.

| Parcours | Distance | Catégories |
|----------|----------|------------|
| **Marathon** | ~65 km | U23 H, Élites H, Masters 30/40/50/60 H, Élites F, Masters F |
| **Semi-Marathon** | ~35 km | U23 H, Élites H, Masters 30/40/50/60 H, Élites F, Masters F |
| **eBikes - Marathon** | ~65 km | eBikes |
| **eBikes - Semi-Marathon** | ~35 km | eBikes |

### 🏆 Compétition

- La modalité **Marathon** comporte une **compétition avec podium** (3 premiers masculins et féminins)
- Chronométrage ludique pour tous les parcours
- Classements par catégories d'âge disponibles

### ⚡ eBikes

Les vélos électriques sont les bienvenus avec une catégorie dédiée, ne comptant pas pour les classements généraux.

## 💶 Inscriptions et Tarifs

Inscriptions en ligne sur [apedalar.pt](https://apedalar.pt/eventos/4072/info), limitées à **1 000 participants**.

| Phase | Période | Inscription | Déjeuner | Accompagnants |
|-------|---------|-------------|----------|---------------|
| **Phase 1** | Jusqu'au 31 décembre 2025 | 11,00€ | +5,00€ | +5,00€ |
| **Phase 2** | 1er février - 16 avril 2026 | 13,00€ | +5,00€ | +5,00€ |
| **Phase 3** | 17 avril - 17 mai 2026 | 15,00€ | +6,00€ | +6,00€ |

### 🍖 Déjeuner - Bucha Saloia

Le déjeuner comprend **1 sandwich au porc + 1 boisson** (jus ou bière).

## 🎁 L'Inscription Comprend

- ✅ Dossard/Identifiant
- ✅ Cadeaux des partenaires
- ✅ Assurance accidents personnels
- ✅ Ravitaillement (solide et liquide)
- ✅ Douches chaudes
- ✅ Zone de lavage des vélos
- ✅ Tirage au sort d'articles VTT
- ✅ Chronométrage

## 📧 Contact

- **Email :** saloiosbtt.oficial@gmail.com
- **Site web :** [saloiosbtt.pt](http://www.saloiosbtt.pt)
- **Facebook :** [Saloios BTT](https://www.facebook.com/saloios.btt)

## 🏆 Organisation

- **Organisé par :** A.C.D.R. Arneiros - Saloios BTT
- **Soutien :** Municipalité de Torres Vedras

Rejoignez-nous pour une nouvelle grande aventure sur les sentiers saloios ! 🚵‍♂️🌳`,
    },
    {
      language: "de",
      title: "17. Saloios BTT 2026",
      city: "Torres Vedras",
      metaTitle: "17. Saloios BTT 2026 | Arneiros, Torres Vedras | 24. Mai",
      metaDescription:
        "17. Saloios BTT 2026 - 24. Mai in Arneiros, Ventosa, Torres Vedras. Marathon 65km und Halbmarathon 35km auf Trails in Torres Vedras und Mafra.",
      description: `# 🚴 17. Saloios BTT 2026

Das **17. Saloios BTT** kehrt am **24. Mai 2026** für eine weitere unvergessliche Ausgabe zurück! Ein Mountainbike-Event für alle, Teil des Programms **Torres Vedras a Pedalar**.

## 📅 Datum und Ort

- **Datum:** Sonntag, 24. Mai 2026
- **Startzeit:** 09:00 Uhr
- **Start/Ziel:** Adega Cooperativa de São Mamede da Ventosa, Arneiros
- **Gemeinde:** Torres Vedras
- **Bezirk:** Lissabon

## 🚴 Verfügbare Strecken

Die Strecke führt über **Trails, ländliche Wege, öffentliche Straßen und Gemeindestraßen** der Gemeinden Torres Vedras und Mafra.

| Strecke | Distanz | Kategorien |
|---------|---------|------------|
| **Marathon** | ~65 km | U23 M, Elite M, Masters 30/40/50/60 M, Elite F, Masters F |
| **Halbmarathon** | ~35 km | U23 M, Elite M, Masters 30/40/50/60 M, Elite F, Masters F |
| **eBikes - Marathon** | ~65 km | eBikes |
| **eBikes - Halbmarathon** | ~35 km | eBikes |

### 🏆 Wettbewerb

- Die Strecke **Marathon** hat einen **Podiumswettbewerb** (Top 3 Männer und Frauen)
- Freizeitmessung für alle Strecken
- Altersklassenwertungen verfügbar

### ⚡ eBikes

Elektrofahrräder sind mit einer eigenen Kategorie willkommen und zählen nicht für die Gesamtwertung.

## 💶 Anmeldung und Preise

Anmeldung online auf [apedalar.pt](https://apedalar.pt/eventos/4072/info), begrenzt auf **1.000 Teilnehmer**.

| Phase | Zeitraum | Anmeldung | Mittagessen | Begleiter |
|-------|----------|-----------|-------------|-----------|
| **Phase 1** | Bis 31. Dezember 2025 | 11,00€ | +5,00€ | +5,00€ |
| **Phase 2** | 1. Februar - 16. April 2026 | 13,00€ | +5,00€ | +5,00€ |
| **Phase 3** | 17. April - 17. Mai 2026 | 15,00€ | +6,00€ | +6,00€ |

### 🍖 Mittagessen - Bucha Saloia

Das traditionelle Mittagessen umfasst **1 Schweinefleisch-Sandwich + 1 Getränk** (Saft oder Bier).

## 🎁 Die Anmeldung Beinhaltet

- ✅ Startnummer/Identifikation
- ✅ Partnergeschenke
- ✅ Unfallversicherung
- ✅ Verpflegungsstationen (Essen und Getränke)
- ✅ Warme Duschen
- ✅ Fahrradwaschbereich
- ✅ Verlosung von MTB-Ausrüstung
- ✅ Zeitmessung

## 📧 Kontakt

- **E-Mail:** saloiosbtt.oficial@gmail.com
- **Website:** [saloiosbtt.pt](http://www.saloiosbtt.pt)
- **Facebook:** [Saloios BTT](https://www.facebook.com/saloios.btt)

## 🏆 Organisation

- **Veranstalter:** A.C.D.R. Arneiros - Saloios BTT
- **Unterstützung:** Gemeinde Torres Vedras

Begleite uns zu einem weiteren großen Abenteuer auf den Saloio-Trails! 🚵‍♂️🌳`,
    },
    {
      language: "it",
      title: "17° Saloios BTT 2026",
      city: "Torres Vedras",
      metaTitle: "17° Saloios BTT 2026 | Arneiros, Torres Vedras | 24 Maggio",
      metaDescription:
        "17° Saloios BTT 2026 - 24 maggio ad Arneiros, Ventosa, Torres Vedras. Maratona 65km e Mezza Maratona 35km sui sentieri di Torres Vedras e Mafra.",
      description: `# 🚴 17° Saloios BTT 2026

Il **17° Saloios BTT** torna il **24 maggio 2026** per un'altra edizione imperdibile! Un evento di mountain bike aperto a tutti, integrato nel programma **Torres Vedras a Pedalar**.

## 📅 Data e Luogo

- **Data:** Domenica, 24 maggio 2026
- **Orario di Partenza:** 09:00
- **Luogo di Partenza/Arrivo:** Adega Cooperativa de São Mamede da Ventosa, Arneiros
- **Comune:** Torres Vedras
- **Distretto:** Lisbona

## 🚴 Percorsi Disponibili

Il percorso si snoda su **sentieri, strade rurali, vie pubbliche e strade comunali** dei comuni di Torres Vedras e Mafra.

| Percorso | Distanza | Categorie |
|----------|----------|-----------|
| **Maratona** | ~65 km | U23 M, Élite M, Masters 30/40/50/60 M, Élite F, Masters F |
| **Mezza Maratona** | ~35 km | U23 M, Élite M, Masters 30/40/50/60 M, Élite F, Masters F |
| **eBikes - Maratona** | ~65 km | eBikes |
| **eBikes - Mezza Maratona** | ~35 km | eBikes |

### 🏆 Competizione

- La modalità **Maratona** prevede una **competizione con podio** (primi 3 maschili e femminili)
- Cronometraggio ludico per tutti i percorsi
- Classifiche per fasce d'età disponibili

### ⚡ eBikes

Le biciclette elettriche sono benvenute con una categoria dedicata, senza contare per le classifiche generali.

## 💶 Iscrizioni e Prezzi

Iscrizioni online su [apedalar.pt](https://apedalar.pt/eventos/4072/info), limitate a **1.000 partecipanti**.

| Fase | Periodo | Iscrizione | Pranzo | Accompagnatori |
|------|---------|------------|--------|----------------|
| **Fase 1** | Fino al 31 dicembre 2025 | 11,00€ | +5,00€ | +5,00€ |
| **Fase 2** | 1 febbraio - 16 aprile 2026 | 13,00€ | +5,00€ | +5,00€ |
| **Fase 3** | 17 aprile - 17 maggio 2026 | 15,00€ | +6,00€ | +6,00€ |

### 🍖 Pranzo - Bucha Saloia

Il pranzo tradizionale include **1 panino di maiale + 1 bevanda** (succo o birra).

## 🎁 L'Iscrizione Include

- ✅ Pettorale/Identificativo
- ✅ Regali dei partner
- ✅ Assicurazione infortuni personali
- ✅ Ristori (cibo e bevande)
- ✅ Docce calde
- ✅ Area lavaggio biciclette
- ✅ Estrazione di attrezzatura MTB
- ✅ Cronometraggio

## 📧 Contatti

- **Email:** saloiosbtt.oficial@gmail.com
- **Sito web:** [saloiosbtt.pt](http://www.saloiosbtt.pt)
- **Facebook:** [Saloios BTT](https://www.facebook.com/saloios.btt)

## 🏆 Organizzazione

- **Organizzato da:** A.C.D.R. Arneiros - Saloios BTT
- **Supporto:** Comune di Torres Vedras

Unisciti a noi per un'altra grande avventura sui sentieri saloios! 🚵‍♂️🌳`,
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

  // ============================================================================
  // 3. UPSERT VARIANTS
  // ============================================================================
  console.log("\n🚴 Creating variants...");

  const variantsData = [
    {
      name: "Maratona Saloios BTT - 65km",
      distanceKm: 65,
      startTime: "09:00",
      maxParticipants: 1000,
    },
    {
      name: "Meia-Maratona Saloios BTT - 36km",
      distanceKm: 36,
      startTime: "09:00",
      maxParticipants: 1000,
    },
    {
      name: "eBikes - Maratona Saloios BTT - 65km",
      distanceKm: 65,
      startTime: "09:00",
      maxParticipants: null,
    },
    {
      name: "eBikes - Meia-Maratona Saloios BTT - 35km",
      distanceKm: 35,
      startTime: "09:00",
      maxParticipants: null,
    },
  ];

  for (const variantData of variantsData) {
    const existing = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: variantData.name,
      },
    });

    if (existing) {
      await prisma.eventVariant.update({
        where: { id: existing.id },
        data: {
          distanceKm: variantData.distanceKm,
          startTime: variantData.startTime,
          maxParticipants: variantData.maxParticipants,
        },
      });
      console.log(`   ✅ Variant updated: ${variantData.name}`);
    } else {
      await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name: variantData.name,
          distanceKm: variantData.distanceKm,
          startTime: variantData.startTime,
          maxParticipants: variantData.maxParticipants,
        },
      });
      console.log(`   ✅ Variant created: ${variantData.name}`);
    }
  }

  // ============================================================================
  // 4. PRICING PHASES (linked to eventId)
  // ============================================================================
  console.log("\n💰 Creating pricing phases...");

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

  await findOrCreatePricingPhase("Fase 1 - Inscrição", {
    startDate: new Date("2025-11-17T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    price: 11.0,
    currency: Currency.EUR,
    note: "Inscrição antecipada",
  });
  console.log("   ✅ Fase 1 - Inscrição (11,00€)");

  await findOrCreatePricingPhase("Fase 1 - Almoço", {
    startDate: new Date("2025-11-17T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    price: 5.0,
    currency: Currency.EUR,
    note: "Bucha Saloia (bifana + bebida)",
  });
  console.log("   ✅ Fase 1 - Almoço (5,00€)");

  await findOrCreatePricingPhase("Fase 1 - Acompanhantes", {
    startDate: new Date("2025-11-17T00:00:00.000Z"),
    endDate: new Date("2025-12-31T23:59:59.000Z"),
    price: 5.0,
    currency: Currency.EUR,
    note: "Almoço acompanhantes",
  });
  console.log("   ✅ Fase 1 - Acompanhantes (5,00€)");

  await findOrCreatePricingPhase("Fase 2 - Inscrição", {
    startDate: new Date("2026-02-01T00:01:00.000Z"),
    endDate: new Date("2026-04-16T23:59:59.000Z"),
    price: 13.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("   ✅ Fase 2 - Inscrição (13,00€)");

  await findOrCreatePricingPhase("Fase 2 - Almoço", {
    startDate: new Date("2026-02-01T00:01:00.000Z"),
    endDate: new Date("2026-04-16T23:59:59.000Z"),
    price: 5.0,
    currency: Currency.EUR,
    note: "Bucha Saloia (bifana + bebida)",
  });
  console.log("   ✅ Fase 2 - Almoço (5,00€)");

  await findOrCreatePricingPhase("Fase 2 - Acompanhantes", {
    startDate: new Date("2026-02-01T00:01:00.000Z"),
    endDate: new Date("2026-04-16T23:59:59.000Z"),
    price: 5.0,
    currency: Currency.EUR,
    note: "Almoço acompanhantes",
  });
  console.log("   ✅ Fase 2 - Acompanhantes (5,00€)");

  await findOrCreatePricingPhase("Fase 3 - Inscrição", {
    startDate: new Date("2026-04-17T00:01:00.000Z"),
    endDate: new Date("2026-05-17T23:59:59.000Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: null,
  });
  console.log("   ✅ Fase 3 - Inscrição (15,00€)");

  await findOrCreatePricingPhase("Fase 3 - Almoço", {
    startDate: new Date("2026-04-17T00:01:00.000Z"),
    endDate: new Date("2026-05-17T23:59:59.000Z"),
    price: 6.0,
    currency: Currency.EUR,
    note: "Bucha Saloia (bifana + bebida)",
  });
  console.log("   ✅ Fase 3 - Almoço (6,00€)");

  await findOrCreatePricingPhase("Fase 3 - Acompanhantes", {
    startDate: new Date("2026-04-17T00:01:00.000Z"),
    endDate: new Date("2026-05-17T23:59:59.000Z"),
    price: 6.0,
    currency: Currency.EUR,
    note: "Almoço acompanhantes",
  });
  console.log("   ✅ Fase 3 - Acompanhantes (6,00€)");

  // ============================================================================
  // 5. FAQs (SEO)
  // ============================================================================
  console.log("\n❓ Creating FAQs...");

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

  // FAQ 1: Quando e onde é o evento?
  const faq1 = await findOrCreateFAQ(
    event.id,
    0,
    "Quando e onde é o 17.º Saloios BTT?",
    "O evento realiza-se no dia 24 de maio de 2026 (domingo), com partida às 09:00 na Adega Cooperativa de São Mamede da Ventosa, Arneiros, Torres Vedras."
  );

  const faq1Translations = {
    pt: {
      question: "Quando e onde é o 17.º Saloios BTT?",
      answer:
        "O evento realiza-se no dia 24 de maio de 2026 (domingo), com partida às 09:00 na Adega Cooperativa de São Mamede da Ventosa, Arneiros, Torres Vedras.",
    },
    en: {
      question: "When and where is the 17th Saloios BTT?",
      answer:
        "The event takes place on May 24, 2026 (Sunday), starting at 09:00 at Adega Cooperativa de São Mamede da Ventosa, Arneiros, Torres Vedras.",
    },
    es: {
      question: "¿Cuándo y dónde es el 17.º Saloios BTT?",
      answer:
        "El evento se realiza el 24 de mayo de 2026 (domingo), con salida a las 09:00 en la Adega Cooperativa de São Mamede da Ventosa, Arneiros, Torres Vedras.",
    },
    fr: {
      question: "Quand et où se déroule le 17e Saloios BTT ?",
      answer:
        "L'événement a lieu le 24 mai 2026 (dimanche), départ à 09h00 à l'Adega Cooperativa de São Mamede da Ventosa, Arneiros, Torres Vedras.",
    },
    de: {
      question: "Wann und wo findet das 17. Saloios BTT statt?",
      answer:
        "Die Veranstaltung findet am 24. Mai 2026 (Sonntag) statt, Start um 09:00 Uhr an der Adega Cooperativa de São Mamede da Ventosa, Arneiros, Torres Vedras.",
    },
    it: {
      question: "Quando e dove si svolge il 17° Saloios BTT?",
      answer:
        "L'evento si svolge il 24 maggio 2026 (domenica), partenza alle 09:00 presso l'Adega Cooperativa de São Mamede da Ventosa, Arneiros, Torres Vedras.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq1.id, language: lang } },
      update: faq1Translations[lang],
      create: { faqId: faq1.id, language: lang, ...faq1Translations[lang] },
    });
  }
  console.log("   ✅ FAQ 1: Quando e onde");

  // FAQ 2: Quais são os percursos disponíveis?
  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "Quais são os percursos disponíveis?",
    "Existem dois percursos: Maratona (~65 km) e Meia-Maratona (~35 km). Ambos decorrem por trilhos e caminhos rurais dos concelhos de Torres Vedras e Mafra. Há também escalão para eBikes em ambos os percursos."
  );

  const faq2Translations = {
    pt: {
      question: "Quais são os percursos disponíveis?",
      answer:
        "Existem dois percursos: Maratona (~65 km) e Meia-Maratona (~35 km). Ambos decorrem por trilhos e caminhos rurais dos concelhos de Torres Vedras e Mafra. Há também escalão para eBikes em ambos os percursos.",
    },
    en: {
      question: "What routes are available?",
      answer:
        "There are two routes: Marathon (~65 km) and Half-Marathon (~35 km). Both follow trails and rural paths through Torres Vedras and Mafra municipalities. There is also an eBikes category for both routes.",
    },
    es: {
      question: "¿Qué recorridos están disponibles?",
      answer:
        "Hay dos recorridos: Maratón (~65 km) y Media Maratón (~35 km). Ambos discurren por senderos y caminos rurales de los municipios de Torres Vedras y Mafra. También hay categoría de eBikes en ambos recorridos.",
    },
    fr: {
      question: "Quels sont les parcours disponibles ?",
      answer:
        "Il y a deux parcours : Marathon (~65 km) et Semi-Marathon (~35 km). Les deux empruntent des sentiers et des chemins ruraux des communes de Torres Vedras et Mafra. Il y a aussi une catégorie eBikes pour les deux parcours.",
    },
    de: {
      question: "Welche Strecken sind verfügbar?",
      answer:
        "Es gibt zwei Strecken: Marathon (~65 km) und Halbmarathon (~35 km). Beide führen über Trails und ländliche Wege der Gemeinden Torres Vedras und Mafra. Es gibt auch eine eBike-Kategorie für beide Strecken.",
    },
    it: {
      question: "Quali percorsi sono disponibili?",
      answer:
        "Ci sono due percorsi: Maratona (~65 km) e Mezza Maratona (~35 km). Entrambi si snodano su sentieri e strade rurali dei comuni di Torres Vedras e Mafra. C'è anche una categoria eBikes per entrambi i percorsi.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: lang } },
      update: faq2Translations[lang],
      create: { faqId: faq2.id, language: lang, ...faq2Translations[lang] },
    });
  }
  console.log("   ✅ FAQ 2: Percursos disponíveis");

  // FAQ 3: É obrigatório usar capacete?
  const faq3 = await findOrCreateFAQ(
    event.id,
    2,
    "É obrigatório usar capacete?",
    "Sim, o uso de capacete é obrigatório durante todo o percurso, devidamente colocado. Participantes sem capacete não podem participar."
  );

  const faq3Translations = {
    pt: {
      question: "É obrigatório usar capacete?",
      answer:
        "Sim, o uso de capacete é obrigatório durante todo o percurso, devidamente colocado. Participantes sem capacete não podem participar.",
    },
    en: {
      question: "Is a helmet mandatory?",
      answer:
        "Yes, wearing a properly fitted helmet is mandatory throughout the entire course. Participants without a helmet cannot take part.",
    },
    es: {
      question: "¿Es obligatorio usar casco?",
      answer:
        "Sí, el uso del casco es obligatorio durante todo el recorrido, debidamente colocado. Los participantes sin casco no podrán participar.",
    },
    fr: {
      question: "Le port du casque est-il obligatoire ?",
      answer:
        "Oui, le port du casque correctement ajusté est obligatoire tout au long du parcours. Les participants sans casque ne peuvent pas participer.",
    },
    de: {
      question: "Ist ein Helm Pflicht?",
      answer:
        "Ja, das Tragen eines ordnungsgemäß sitzenden Helms ist während der gesamten Strecke Pflicht. Teilnehmer ohne Helm dürfen nicht teilnehmen.",
    },
    it: {
      question: "È obbligatorio il casco?",
      answer:
        "Sì, l'uso del casco correttamente indossato è obbligatorio durante tutto il percorso. I partecipanti senza casco non possono partecipare.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: lang } },
      update: faq3Translations[lang],
      create: { faqId: faq3.id, language: lang, ...faq3Translations[lang] },
    });
  }
  console.log("   ✅ FAQ 3: Capacete obrigatório");

  // FAQ 4: O que inclui o almoço?
  const faq4 = await findOrCreateFAQ(
    event.id,
    3,
    "O que inclui o almoço (Bucha Saloia)?",
    "O almoço - Bucha Saloia - é constituído por 1 bifana e 1 bebida (sumo ou cerveja). O preço do almoço é adicional à inscrição."
  );

  const faq4Translations = {
    pt: {
      question: "O que inclui o almoço (Bucha Saloia)?",
      answer:
        "O almoço - Bucha Saloia - é constituído por 1 bifana e 1 bebida (sumo ou cerveja). O preço do almoço é adicional à inscrição.",
    },
    en: {
      question: "What does the lunch (Bucha Saloia) include?",
      answer:
        "The lunch - Bucha Saloia - consists of 1 pork sandwich (bifana) and 1 drink (juice or beer). The lunch price is additional to the registration fee.",
    },
    es: {
      question: "¿Qué incluye el almuerzo (Bucha Saloia)?",
      answer:
        "El almuerzo - Bucha Saloia - consiste en 1 bocadillo de cerdo (bifana) y 1 bebida (zumo o cerveza). El precio del almuerzo es adicional a la inscripción.",
    },
    fr: {
      question: "Que comprend le déjeuner (Bucha Saloia) ?",
      answer:
        "Le déjeuner - Bucha Saloia - comprend 1 sandwich au porc (bifana) et 1 boisson (jus ou bière). Le prix du déjeuner est en supplément de l'inscription.",
    },
    de: {
      question: "Was beinhaltet das Mittagessen (Bucha Saloia)?",
      answer:
        "Das Mittagessen - Bucha Saloia - besteht aus 1 Schweinefleisch-Sandwich (Bifana) und 1 Getränk (Saft oder Bier). Der Preis für das Mittagessen kommt zur Anmeldegebühr hinzu.",
    },
    it: {
      question: "Cosa include il pranzo (Bucha Saloia)?",
      answer:
        "Il pranzo - Bucha Saloia - comprende 1 panino di maiale (bifana) e 1 bevanda (succo o birra). Il prezzo del pranzo è aggiuntivo rispetto all'iscrizione.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq4.id, language: lang } },
      update: faq4Translations[lang],
      create: { faqId: faq4.id, language: lang, ...faq4Translations[lang] },
    });
  }
  console.log("   ✅ FAQ 4: Almoço");

  // ============================================================================
  // RESUMO FINAL
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("🎉 17.º Saloios BTT 2026 seeded successfully!");
  console.log("=".repeat(60));
  console.log(`\n📋 Event: ${event.title}`);
  console.log(`   Slug: ${event.slug}`);
  console.log(`   ID: ${event.id}`);
  console.log(`   Date: 24 maio 2026`);
  console.log(`   Location: Arneiros, Ventosa, Torres Vedras`);
  console.log(`   Sport: BTT`);
  console.log("\n📦 Variants: 4");
  console.log("   - Maratona Saloios BTT - 65km");
  console.log("   - Meia-Maratona Saloios BTT - 36km");
  console.log("   - eBikes - Maratona Saloios BTT - 65km");
  console.log("   - eBikes - Meia-Maratona Saloios BTT - 35km");
  console.log("\n💰 Pricing Phases: 9 (3 fases × 3 tipos)");
  console.log("\n❓ FAQs: 4");
  console.log("\n🌍 Translations: 6 (pt, en, es, fr, de, it)");
  console.log("=".repeat(60) + "\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
