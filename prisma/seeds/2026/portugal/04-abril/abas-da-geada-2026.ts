/**
 * Seed: 20ª Edição Pelas Abas da Geada 2026
 * Complete with translations in all 6 languages, FAQs and SEO
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚴 Seeding 20ª Edição Pelas Abas da Geada 2026...");

  const eventSlug = "abas-da-geada-2026";

  // Step 1: Upsert the event (NO delete operations)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "20ª Edição Pelas Abas da Geada",
      description:
        "Passeio BTT tradicional com 20 edições em Santa Catarina da Fonte do Bispo, Tavira. Percursos de 35km e 60km pelos trilhos algarvios. Organizado pelo Clube BTT Abas da Geada Santa Catarina.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-12T09:00:00.000Z"),
      endDate: null,
      city: "Santa Catarina da Fonte do Bispo, Tavira",
      country: "Portugal",
      latitude: 37.1833,
      longitude: -7.7833,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Santa+Catarina+da+Fonte+do+Bispo+Tavira+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4142/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-07T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "20ª Edição Pelas Abas da Geada",
      description:
        "Passeio BTT tradicional com 20 edições em Santa Catarina da Fonte do Bispo, Tavira. Percursos de 35km e 60km pelos trilhos algarvios. Organizado pelo Clube BTT Abas da Geada Santa Catarina.",
      sportTypes: [SportType.BTT],
      startDate: new Date("2026-04-12T09:00:00.000Z"),
      endDate: null,
      city: "Santa Catarina da Fonte do Bispo, Tavira",
      country: "Portugal",
      latitude: 37.1833,
      longitude: -7.7833,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Santa+Catarina+da+Fonte+do+Bispo+Tavira+Portugal",
      externalUrl: "https://apedalar.pt/eventos/4142/info",
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-04-07T23:59:59.000Z"),
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
      title: "20ª Edição Pelas Abas da Geada",
      city: "Santa Catarina da Fonte do Bispo",
      metaTitle:
        "20ª Edição Pelas Abas da Geada 2026 | Tavira, Faro | 12 Abril",
      metaDescription:
        "20ª Edição Pelas Abas da Geada 2026 - 12 de abril em Santa Catarina da Fonte do Bispo, Tavira. Percursos de 35km (dificuldade média) e 60km (média/alta) pelos trilhos do Algarve. Inscrições: 15€ (com almoço 30€).",
      description: `# 🚴 20ª Edição Pelas Abas da Geada 2026

A **20ª Edição Pelas Abas da Geada** é um passeio tradicional de BTT organizado pelo **Clube BTT Abas da Geada Santa Catarina** em **Santa Catarina da Fonte do Bispo, Tavira**, com **20 anos de tradição** no ciclismo algarvio.

## 📅 Data e Horários

- **Data:** Domingo, 12 de abril de 2026
- **Partida:** 09:00 (sistema de BOX)
- **Hora limite de prova:** 14:00

### Secretariado e Levantamento de Dorsais

**Sábado (11 de Abril):**
- 17:00 às 22:00 - Sede do Clube BTT (Edifício Casa do Povo)

**Domingo (12 de Abril):**
- 07:00 - Concentração e pequeno-almoço (Edifício Casa do Povo)
- 09:00 - Início do passeio

## 🚴 Percursos Disponíveis

### BTT 35 km - Dificuldade Média
Percurso marcado com placas e fitas sinalizadoras com:
- 1 zona de abastecimentos (ZA1)
- 2 pontos de controlo (CP0 e CP1)
- **Chegada prevista primeiro atleta:** 10:30

### BTT 60 km - Dificuldade Média/Alta
Percurso marcado com placas e fitas sinalizadoras com:
- 2 zonas de abastecimentos (ZA1 e ZA2)
- 4 pontos de controlo (CP0, CP1, CP2 e CP3)
- **Chegada prevista primeiro atleta:** 12:00

**Nota:** Os tracks dos percursos serão fornecidos no **Sábado (11-04-2026)** no Facebook do Clube.

## 🏆 Categorias e Lembranças

Lembranças para os **3 primeiros classificados** de cada categoria:

### Masculinos
- **Elites** (<29 anos)
- **Masters 30** (30-39 anos)
- **Masters 40** (40-49 anos)
- **Masters 50** (50-59 anos)
- **Masters 60** (≥60 anos)

### Femininos
- **Elites** (<29 anos)
- **Masters 30** (30-39 anos)
- **Masters 40** (40-49 anos)
- **Masters 50** (50-59 anos)

### E-Bikes
- **Sem escalão** - 3 primeiros classificados de 35km e 60km

**Importante:** Registo de tempos apenas para BTT convencionais. E-Bikes permitidas mas tempos não contam para classificação oficial.

## 🎁 A Inscrição Inclui

- ✅ Passeio com registo de ordem de chegada
- ✅ Dorsal de identificação
- ✅ Seguro de acidentes pessoais
- ✅ Abastecimentos sólidos e líquidos
- ✅ Banho quente no Polidesportivo
- ✅ Local para lavagem de bicicletas
- ✅ Lembranças do evento
- ✅ Fotos no Facebook oficial

## 🍽️ Almoço e Acompanhantes

- **Almoço (opcional):** 15€ adicional
- **Inscrição com almoço:** 30€ (15€ inscrição + 15€ almoço)
- **Acompanhantes:** 20€ (apenas almoço)

**Almoço:** Início às 13:00 com festa alusiva à 20ª Edição, entrega de lembranças e sorteios de brindes.

## ⚙️ Equipamento Obrigatório

- 🪖 Capacete homologado (obrigatório durante todo o passeio)
- 📱 Telemóvel ativo com bateria carregada
- 🆔 Documento de identificação
- 🧤 Luvas compatíveis com ciclismo

**Recomendado:**
- Vestuário apropriado para as condições meteorológicas
- Reservatório com água
- Conta-quilómetros ou GPS

## 🏁 Controlos de Passagem

- Existem **pontos de controlo obrigatórios** ao longo dos percursos
- A falta de um ou mais PC no dorsal implica **não registo de tempo**
- Possibilidade de mudar de percurso informando a organização até **08 de Abril 2026**

## 🚑 Segurança e Seguro

**Período de seguro:**
- Início: 09:00 de 12/04/2026
- Fim: 18:00 de 12/04/2026

**Cobertura:**
- Prática desportiva amadora e não federada de ciclo turismo
- Inclui participação em prova

**Importante:**
- Responsabilidade do sinistrado pelo pagamento das taxas de tratamento
- Apresentação posterior das despesas à Companhia Seguradora para ressarcimento
- Ambulância e GNR presentes durante o evento

## ⚠️ Regras e Segurança

- Percursos em trilhos, caminhos rurais e estradas municipais **abertas ao trânsito**
- **Respeita o Código da Estrada**
- Capacete obrigatório e bem colocado
- Em caso de desistência, **contacta imediatamente a organização**
- Números de S.O.S. disponíveis no dorsal
- **Proibido uso de auscultadores** durante o passeio

## 📞 Contactos

- **Email:** clubebttsantacatarina@gmail.com
- **Telemóveis:** 964 248 847 | 969 901 652
- **Facebook:** [Abas da Geada](https://www.facebook.com/abasda.geada)

## 🏠 Locais

- **Partida/Chegada:** Edifício Casa do Povo, Santa Catarina da Fonte do Bispo
- **Banhos:** Polidesportivo de Santa Catarina da Fonte do Bispo
- **Estacionamento:** Parque de Mercado Municipal

## 👶 Menores de Idade

Participantes entre **15-18 anos** devem:
- Entregar termo de responsabilidade assinado pelos pais/encarregados de educação
- Disponível no Facebook do Clube ou em www.apedalar.com
- Enviar para clubebttsantacatarina@gmail.com ou entregar no dia da prova`,
    },
    {
      language: "en",
      title: "20th Edition Through the Frost",
      city: "Santa Catarina da Fonte do Bispo",
      metaTitle:
        "20th Edition Through the Frost 2026 | Tavira, Faro | April 12",
      metaDescription:
        "20th Edition Through the Frost 2026 - April 12 in Santa Catarina da Fonte do Bispo, Tavira. 35km (medium difficulty) and 60km (medium/high) routes through Algarve trails. Registration: €15 (with lunch €30).",
      description: `# 🚴 20th Edition Through the Frost 2026

The **20th Edition Through the Frost** is a traditional MTB ride organized by **Clube BTT Abas da Geada Santa Catarina** in **Santa Catarina da Fonte do Bispo, Tavira**, with **20 years of tradition** in Algarve cycling.

## 📅 Date and Schedule

- **Date:** Sunday, April 12, 2026
- **Start:** 09:00 (BOX system)
- **Cut-off time:** 14:00

### Registration Desk and Number Collection

**Saturday (April 11):**
- 17:00 to 22:00 - Club Headquarters (Casa do Povo Building)

**Sunday (April 12):**
- 07:00 - Meeting and breakfast (Casa do Povo Building)
- 09:00 - Start of ride

## 🚴 Available Routes

### MTB 35 km - Medium Difficulty
Route marked with signs and marking tape with:
- 1 refreshment zone (ZA1)
- 2 checkpoints (CP0 and CP1)
- **First rider expected arrival:** 10:30

### MTB 60 km - Medium/High Difficulty
Route marked with signs and marking tape with:
- 2 refreshment zones (ZA1 and ZA2)
- 4 checkpoints (CP0, CP1, CP2 and CP3)
- **First rider expected arrival:** 12:00

**Note:** Route tracks will be provided on **Saturday (11-04-2026)** on the Club's Facebook.

## 🏆 Categories and Prizes

Prizes for **top 3 finishers** in each category:

### Men's
- **Elite** (<29 years)
- **Masters 30** (30-39 years)
- **Masters 40** (40-49 years)
- **Masters 50** (50-59 years)
- **Masters 60** (≥60 years)

### Women's
- **Elite** (<29 years)
- **Masters 30** (30-39 years)
- **Masters 40** (40-49 years)
- **Masters 50** (50-59 years)

### E-Bikes
- **No category** - Top 3 finishers in 35km and 60km

**Important:** Time recording only for conventional MTB. E-Bikes allowed but times don't count for official ranking.

## 🎁 Registration Includes

- ✅ Ride with arrival time recording
- ✅ Identification number plate
- ✅ Personal accident insurance
- ✅ Solid and liquid refreshments
- ✅ Hot shower at Sports Center
- ✅ Bike washing area
- ✅ Event souvenirs
- ✅ Photos on official Facebook

## 🍽️ Lunch and Companions

- **Lunch (optional):** €15 additional
- **Registration with lunch:** €30 (€15 registration + €15 lunch)
- **Companions:** €20 (lunch only)

**Lunch:** Starting at 13:00 with 20th Edition celebration, prize distribution and raffles.

## ⚙️ Mandatory Equipment

- 🪖 Approved helmet (mandatory during entire ride)
- 📱 Active mobile phone with charged battery
- 🆔 ID document
- 🧤 Cycling gloves

**Recommended:**
- Appropriate clothing for weather conditions
- Water reservoir
- Cyclometer or GPS

## 🏁 Checkpoints

- **Mandatory checkpoints** along the routes
- Missing one or more PC stamps means **no time recording**
- Possibility to change route by informing organization until **April 8, 2026**

## 🚑 Safety and Insurance

**Insurance period:**
- Start: 09:00 on 12/04/2026
- End: 18:00 on 12/04/2026

**Coverage:**
- Amateur and non-federated cycle tourism practice
- Includes race participation

**Important:**
- Injured party responsible for treatment fee payment
- Subsequent expense submission to Insurance Company for reimbursement
- Ambulance and GNR present during event

## ⚠️ Rules and Safety

- Routes on trails, rural paths and municipal roads **open to traffic**
- **Respect traffic rules**
- Helmet mandatory and properly fitted
- In case of withdrawal, **immediately contact organization**
- S.O.S. numbers available on number plate
- **Headphones prohibited** during ride

## 📞 Contacts

- **Email:** clubebttsantacatarina@gmail.com
- **Phones:** +351 964 248 847 | +351 969 901 652
- **Facebook:** [Abas da Geada](https://www.facebook.com/abasda.geada)

## 🏠 Locations

- **Start/Finish:** Casa do Povo Building, Santa Catarina da Fonte do Bispo
- **Showers:** Santa Catarina da Fonte do Bispo Sports Center
- **Parking:** Municipal Market Park

## 👶 Minors

Participants aged **15-18** must:
- Submit liability form signed by parents/guardians
- Available on Club's Facebook or www.apedalar.com
- Send to clubebttsantacatarina@gmail.com or deliver on race day`,
    },
    {
      language: "es",
      title: "20ª Edición Por las Heladas",
      city: "Santa Catarina da Fonte do Bispo",
      metaTitle: "20ª Edición Por las Heladas 2026 | Tavira, Faro | 12 Abril",
      metaDescription:
        "20ª Edición Por las Heladas 2026 - 12 de abril en Santa Catarina da Fonte do Bispo, Tavira. Recorridos de 35km (dificultad media) y 60km (media/alta) por senderos del Algarve. Inscripciones: 15€ (con almuerzo 30€).",
      description: `# 🚴 20ª Edición Por las Heladas 2026

La **20ª Edición Por las Heladas** es un paseo tradicional de BTT organizado por **Clube BTT Abas da Geada Santa Catarina** en **Santa Catarina da Fonte do Bispo, Tavira**, con **20 años de tradición** en el ciclismo del Algarve.

## 📅 Fecha y Horarios

- **Fecha:** Domingo, 12 de abril de 2026
- **Salida:** 09:00 (sistema BOX)
- **Hora límite de prueba:** 14:00

### Secretaría y Recogida de Dorsales

**Sábado (11 de Abril):**
- 17:00 a 22:00 - Sede del Club (Edificio Casa do Povo)

**Domingo (12 de Abril):**
- 07:00 - Concentración y desayuno (Edificio Casa do Povo)
- 09:00 - Inicio del paseo

## 🚴 Recorridos Disponibles

### BTT 35 km - Dificultad Media
Recorrido marcado con placas y cintas señalizadoras con:
- 1 zona de avituallamientos (ZA1)
- 2 puntos de control (CP0 y CP1)
- **Llegada prevista primer atleta:** 10:30

### BTT 60 km - Dificultad Media/Alta
Recorrido marcado con placas y cintas señalizadoras con:
- 2 zonas de avituallamientos (ZA1 y ZA2)
- 4 puntos de control (CP0, CP1, CP2 y CP3)
- **Llegada prevista primer atleta:** 12:00

**Nota:** Los tracks de los recorridos se proporcionarán el **Sábado (11-04-2026)** en el Facebook del Club.

## 🏆 Categorías y Premios

Premios para los **3 primeros clasificados** de cada categoría:

### Masculinos
- **Elites** (<29 años)
- **Masters 30** (30-39 años)
- **Masters 40** (40-49 años)
- **Masters 50** (50-59 años)
- **Masters 60** (≥60 años)

### Femeninos
- **Elites** (<29 años)
- **Masters 30** (30-39 años)
- **Masters 40** (40-49 años)
- **Masters 50** (50-59 años)

### E-Bikes
- **Sin categoría** - 3 primeros clasificados de 35km y 60km

**Importante:** Registro de tiempos solo para BTT convencionales. E-Bikes permitidas pero los tiempos no cuentan para clasificación oficial.

## 🎁 La Inscripción Incluye

- ✅ Paseo con registro de orden de llegada
- ✅ Dorsal de identificación
- ✅ Seguro de accidentes personales
- ✅ Avituallamientos sólidos y líquidos
- ✅ Ducha caliente en Polideportivo
- ✅ Zona de lavado de bicicletas
- ✅ Recuerdos del evento
- ✅ Fotos en Facebook oficial

## 🍽️ Almuerzo y Acompañantes

- **Almuerzo (opcional):** 15€ adicional
- **Inscripción con almuerzo:** 30€ (15€ inscripción + 15€ almuerzo)
- **Acompañantes:** 20€ (solo almuerzo)

**Almuerzo:** Inicio a las 13:00 con fiesta alusiva a la 20ª Edición, entrega de recuerdos y sorteos.

## 📞 Contactos

- **Email:** clubebttsantacatarina@gmail.com
- **Teléfonos:** +351 964 248 847 | +351 969 901 652
- **Facebook:** [Abas da Geada](https://www.facebook.com/abasda.geada)`,
    },
    {
      language: "fr",
      title: "20ème Édition À Travers le Gel",
      city: "Santa Catarina da Fonte do Bispo",
      metaTitle:
        "20ème Édition À Travers le Gel 2026 | Tavira, Faro | 12 Avril",
      metaDescription:
        "20ème Édition À Travers le Gel 2026 - 12 avril à Santa Catarina da Fonte do Bispo, Tavira. Parcours de 35km (difficulté moyenne) et 60km (moyenne/élevée) à travers les sentiers de l'Algarve. Inscription: 15€ (avec déjeuner 30€).",
      description: `# 🚴 20ème Édition À Travers le Gel 2026

La **20ème Édition À Travers le Gel** est une randonnée VTT traditionnelle organisée par **Clube BTT Abas da Geada Santa Catarina** à **Santa Catarina da Fonte do Bispo, Tavira**, avec **20 ans de tradition** dans le cyclisme de l'Algarve.

## 📅 Date et Horaires

- **Date:** Dimanche, 12 avril 2026
- **Départ:** 09:00 (système BOX)
- **Heure limite de l'épreuve:** 14:00

### Secrétariat et Retrait des Dossards

**Samedi (11 Avril):**
- 17:00 à 22:00 - Siège du Club (Bâtiment Casa do Povo)

**Dimanche (12 Avril):**
- 07:00 - Rassemblement et petit-déjeuner (Bâtiment Casa do Povo)
- 09:00 - Début de la randonnée

## 🚴 Parcours Disponibles

### VTT 35 km - Difficulté Moyenne
Parcours balisé avec panneaux et rubans de signalisation avec:
- 1 zone de ravitaillement (ZA1)
- 2 points de contrôle (CP0 et CP1)
- **Arrivée prévue premier coureur:** 10:30

### VTT 60 km - Difficulté Moyenne/Élevée
Parcours balisé avec panneaux et rubans de signalisation avec:
- 2 zones de ravitaillement (ZA1 et ZA2)
- 4 points de contrôle (CP0, CP1, CP2 et CP3)
- **Arrivée prévue premier coureur:** 12:00

**Note:** Les traces des parcours seront fournies le **Samedi (11-04-2026)** sur le Facebook du Club.

## 📞 Contacts

- **Email:** clubebttsantacatarina@gmail.com
- **Téléphones:** +351 964 248 847 | +351 969 901 652
- **Facebook:** [Abas da Geada](https://www.facebook.com/abasda.geada)`,
    },
    {
      language: "de",
      title: "20. Ausgabe Durch den Frost",
      city: "Santa Catarina da Fonte do Bispo",
      metaTitle: "20. Ausgabe Durch den Frost 2026 | Tavira, Faro | 12. April",
      metaDescription:
        "20. Ausgabe Durch den Frost 2026 - 12. April in Santa Catarina da Fonte do Bispo, Tavira. 35km (mittlerer Schwierigkeitsgrad) und 60km (mittel/hoch) Strecken durch Algarve Trails. Anmeldung: 15€ (mit Mittagessen 30€).",
      description: `# 🚴 20. Ausgabe Durch den Frost 2026

Die **20. Ausgabe Durch den Frost** ist eine traditionelle MTB-Fahrt organisiert von **Clube BTT Abas da Geada Santa Catarina** in **Santa Catarina da Fonte do Bispo, Tavira**, mit **20 Jahren Tradition** im Algarve-Radsport.

## 📅 Datum und Zeitplan

- **Datum:** Sonntag, 12. April 2026
- **Start:** 09:00 Uhr (BOX-System)
- **Zeitlimit:** 14:00 Uhr

## 📞 Kontakte

- **Email:** clubebttsantacatarina@gmail.com
- **Telefone:** +351 964 248 847 | +351 969 901 652
- **Facebook:** [Abas da Geada](https://www.facebook.com/abasda.geada)`,
    },
    {
      language: "it",
      title: "20ª Edizione Attraverso il Gelo",
      city: "Santa Catarina da Fonte do Bispo",
      metaTitle:
        "20ª Edizione Attraverso il Gelo 2026 | Tavira, Faro | 12 Aprile",
      metaDescription:
        "20ª Edizione Attraverso il Gelo 2026 - 12 aprile a Santa Catarina da Fonte do Bispo, Tavira. Percorsi di 35km (difficoltà media) e 60km (media/alta) attraverso i sentieri dell'Algarve. Iscrizioni: 15€ (con pranzo 30€).",
      description: `# 🚴 20ª Edizione Attraverso il Gelo 2026

La **20ª Edizione Attraverso il Gelo** è una pedalata MTB tradizionale organizzata dal **Clube BTT Abas da Geada Santa Catarina** a **Santa Catarina da Fonte do Bispo, Tavira**, con **20 anni di tradizione** nel ciclismo dell'Algarve.

## 📅 Data e Orari

- **Data:** Domenica, 12 aprile 2026
- **Partenza:** 09:00 (sistema BOX)
- **Tempo limite gara:** 14:00

## 📞 Contatti

- **Email:** clubebttsantacatarina@gmail.com
- **Telefoni:** +351 964 248 847 | +351 969 901 652
- **Facebook:** [Abas da Geada](https://www.facebook.com/abasda.geada)`,
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

  // Variant 1: BTT 35km
  const btt35 = await findOrCreateVariant({
    name: "BTT 35 km",
    distanceKm: 35,
    elevationGainM: 450,
    elevationLossM: 450,
    startTime: "09:00",
    price: 15.0,
    currency: Currency.EUR,
  });

  const btt35Translations = [
    {
      language: Language.pt,
      name: "BTT 35 km",
      description:
        "Percurso de 35km com dificuldade média. Marcado com placas e fitas sinalizadoras. Inclui 1 zona de abastecimentos (ZA1) e 2 pontos de controlo (CP0 e CP1). Chegada prevista do primeiro atleta: 10:30. Ideal para todos os níveis.",
    },
    {
      language: Language.en,
      name: "MTB 35 km",
      description:
        "35km route with medium difficulty. Marked with signs and marking tape. Includes 1 refreshment zone (ZA1) and 2 checkpoints (CP0 and CP1). First rider expected arrival: 10:30. Ideal for all levels.",
    },
    {
      language: Language.es,
      name: "BTT 35 km",
      description:
        "Recorrido de 35km con dificultad media. Marcado con placas y cintas señalizadoras. Incluye 1 zona de avituallamientos (ZA1) y 2 puntos de control (CP0 y CP1). Llegada prevista primer atleta: 10:30. Ideal para todos los niveles.",
    },
    {
      language: Language.fr,
      name: "VTT 35 km",
      description:
        "Parcours de 35km avec difficulté moyenne. Balisé avec panneaux et rubans. Comprend 1 zone de ravitaillement (ZA1) et 2 points de contrôle (CP0 et CP1). Arrivée prévue premier coureur: 10:30. Idéal pour tous les niveaux.",
    },
    {
      language: Language.de,
      name: "MTB 35 km",
      description:
        "35km Strecke mit mittlerem Schwierigkeitsgrad. Mit Schildern und Markierungsbändern gekennzeichnet. Umfasst 1 Verpflegungszone (ZA1) und 2 Kontrollpunkte (CP0 und CP1). Erwartete Ankunft erster Fahrer: 10:30 Uhr. Ideal für alle Levels.",
    },
    {
      language: Language.it,
      name: "MTB 35 km",
      description:
        "Percorso di 35km con difficoltà media. Segnalato con cartelli e nastri. Include 1 zona di ristoro (ZA1) e 2 punti di controllo (CP0 e CP1). Arrivo previsto primo corridore: 10:30. Ideale per tutti i livelli.",
    },
  ];

  for (const translation of btt35Translations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: btt35.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: btt35.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ BTT 35km variant created");

  // Variant 2: BTT 60km
  const btt60 = await findOrCreateVariant({
    name: "BTT 60 km",
    distanceKm: 60,
    elevationGainM: 900,
    elevationLossM: 900,
    startTime: "09:00",
    price: 15.0,
    currency: Currency.EUR,
  });

  const btt60Translations = [
    {
      language: Language.pt,
      name: "BTT 60 km",
      description:
        "Percurso de 60km com dificuldade média/alta. Marcado com placas e fitas sinalizadoras. Inclui 2 zonas de abastecimentos (ZA1 e ZA2) e 4 pontos de controlo (CP0, CP1, CP2 e CP3). Chegada prevista do primeiro atleta: 12:00. Para ciclistas experientes.",
    },
    {
      language: Language.en,
      name: "MTB 60 km",
      description:
        "60km route with medium/high difficulty. Marked with signs and marking tape. Includes 2 refreshment zones (ZA1 and ZA2) and 4 checkpoints (CP0, CP1, CP2 and CP3). First rider expected arrival: 12:00. For experienced cyclists.",
    },
    {
      language: Language.es,
      name: "BTT 60 km",
      description:
        "Recorrido de 60km con dificultad media/alta. Marcado con placas y cintas señalizadoras. Incluye 2 zonas de avituallamientos (ZA1 y ZA2) y 4 puntos de control (CP0, CP1, CP2 y CP3). Llegada prevista primer atleta: 12:00. Para ciclistas experimentados.",
    },
    {
      language: Language.fr,
      name: "VTT 60 km",
      description:
        "Parcours de 60km avec difficulté moyenne/élevée. Balisé avec panneaux et rubans. Comprend 2 zones de ravitaillement (ZA1 et ZA2) et 4 points de contrôle (CP0, CP1, CP2 et CP3). Arrivée prévue premier coureur: 12:00. Pour cyclistes expérimentés.",
    },
    {
      language: Language.de,
      name: "MTB 60 km",
      description:
        "60km Strecke mit mittlerem/hohem Schwierigkeitsgrad. Mit Schildern und Markierungsbändern gekennzeichnet. Umfasst 2 Verpflegungszonen (ZA1 und ZA2) und 4 Kontrollpunkte (CP0, CP1, CP2 und CP3). Erwartete Ankunft erster Fahrer: 12:00 Uhr. Für erfahrene Radfahrer.",
    },
    {
      language: Language.it,
      name: "MTB 60 km",
      description:
        "Percorso di 60km con difficoltà media/alta. Segnalato con cartelli e nastri. Include 2 zone di ristoro (ZA1 e ZA2) e 4 punti di controllo (CP0, CP1, CP2 e CP3). Arrivo previsto primo corridore: 12:00. Per ciclisti esperti.",
    },
  ];

  for (const translation of btt60Translations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: btt60.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: btt60.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log("   ✅ BTT 60km variant created");

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

  // Step 6: Create pricing phases
  console.log("💰 Creating pricing phases...");

  await findOrCreatePricingPhase("Inscrição (sem almoço)", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-04-07T23:59:59.000Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: "Inscrição sem almoço - Todos os percursos",
  });

  await findOrCreatePricingPhase("Inscrição com Almoço", {
    startDate: new Date("2025-12-01T00:00:00.000Z"),
    endDate: new Date("2026-04-07T23:59:59.000Z"),
    price: 30.0,
    currency: Currency.EUR,
    note: "Inscrição com almoço incluído (15€ + 15€)",
  });

  console.log("   ✅ Pricing phases created");

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
    "Qual é a idade mínima para participar?",
    "A idade mínima é 15 anos. Participantes entre 15-18 anos devem entregar termo de responsabilidade assinado pelos pais ou encarregados de educação (disponível no Facebook do Clube ou em www.apedalar.com)."
  );

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.pt } },
    update: {
      question: "Qual é a idade mínima para participar?",
      answer:
        "A idade mínima é 15 anos. Participantes entre 15-18 anos devem entregar termo de responsabilidade assinado pelos pais ou encarregados de educação (disponível no Facebook do Clube ou em www.apedalar.com).",
    },
    create: {
      faqId: faq1.id,
      language: Language.pt,
      question: "Qual é a idade mínima para participar?",
      answer:
        "A idade mínima é 15 anos. Participantes entre 15-18 anos devem entregar termo de responsabilidade assinado pelos pais ou encarregados de educação (disponível no Facebook do Clube ou em www.apedalar.com).",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.en } },
    update: {
      question: "What is the minimum age to participate?",
      answer:
        "The minimum age is 15 years. Participants aged 15-18 must submit a liability form signed by parents/guardians (available on Club's Facebook or www.apedalar.com).",
    },
    create: {
      faqId: faq1.id,
      language: Language.en,
      question: "What is the minimum age to participate?",
      answer:
        "The minimum age is 15 years. Participants aged 15-18 must submit a liability form signed by parents/guardians (available on Club's Facebook or www.apedalar.com).",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.es } },
    update: {
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "La edad mínima es 15 años. Los participantes de 15-18 años deben entregar un formulario de responsabilidad firmado por padres/tutores (disponible en el Facebook del Club o en www.apedalar.com).",
    },
    create: {
      faqId: faq1.id,
      language: Language.es,
      question: "¿Cuál es la edad mínima para participar?",
      answer:
        "La edad mínima es 15 años. Los participantes de 15-18 años deben entregar un formulario de responsabilidad firmado por padres/tutores (disponible en el Facebook del Club o en www.apedalar.com).",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.fr } },
    update: {
      question: "Quel est l'âge minimum pour participer?",
      answer:
        "L'âge minimum est de 15 ans. Les participants âgés de 15-18 ans doivent soumettre un formulaire de responsabilité signé par les parents/tuteurs (disponible sur le Facebook du Club ou www.apedalar.com).",
    },
    create: {
      faqId: faq1.id,
      language: Language.fr,
      question: "Quel est l'âge minimum pour participer?",
      answer:
        "L'âge minimum est de 15 ans. Les participants âgés de 15-18 ans doivent soumettre un formulaire de responsabilité signé par les parents/tuteurs (disponible sur le Facebook du Club ou www.apedalar.com).",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.de } },
    update: {
      question: "Was ist das Mindestalter für die Teilnahme?",
      answer:
        "Das Mindestalter beträgt 15 Jahre. Teilnehmer im Alter von 15-18 Jahren müssen ein von den Eltern/Erziehungsberechtigten unterzeichnetes Haftungsformular einreichen (verfügbar auf dem Facebook des Clubs oder www.apedalar.com).",
    },
    create: {
      faqId: faq1.id,
      language: Language.de,
      question: "Was ist das Mindestalter für die Teilnahme?",
      answer:
        "Das Mindestalter beträgt 15 Jahre. Teilnehmer im Alter von 15-18 Jahren müssen ein von den Eltern/Erziehungsberechtigten unterzeichnetes Haftungsformular einreichen (verfügbar auf dem Facebook des Clubs oder www.apedalar.com).",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq1.id, language: Language.it } },
    update: {
      question: "Qual è l'età minima per partecipare?",
      answer:
        "L'età minima è 15 anni. I partecipanti di età 15-18 devono presentare un modulo di responsabilità firmato dai genitori/tutori (disponibile sul Facebook del Club o www.apedalar.com).",
    },
    create: {
      faqId: faq1.id,
      language: Language.it,
      question: "Qual è l'età minima per partecipare?",
      answer:
        "L'età minima è 15 anni. I partecipanti di età 15-18 devono presentare un modulo di responsabilità firmato dai genitori/tutori (disponibile sul Facebook del Club o www.apedalar.com).",
    },
  });

  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Posso mudar de percurso no dia da prova?",
    "Sim, podes mudar de percurso, mas deves informar a organização no controlo km zero (entrada da box) ou através de email até ao dia 08 de Abril 2026. Caso contrário, o teu tempo de chegada não será registado."
  );

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.pt } },
    update: {
      question: "Posso mudar de percurso no dia da prova?",
      answer:
        "Sim, podes mudar de percurso, mas deves informar a organização no controlo km zero (entrada da box) ou através de email até ao dia 08 de Abril 2026. Caso contrário, o teu tempo de chegada não será registado.",
    },
    create: {
      faqId: faq2.id,
      language: Language.pt,
      question: "Posso mudar de percurso no dia da prova?",
      answer:
        "Sim, podes mudar de percurso, mas deves informar a organização no controlo km zero (entrada da box) ou através de email até ao dia 08 de Abril 2026. Caso contrário, o teu tempo de chegada não será registado.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.en } },
    update: {
      question: "Can I change routes on race day?",
      answer:
        "Yes, you can change routes, but you must inform the organization at km zero checkpoint (box entrance) or by email until April 8, 2026. Otherwise, your arrival time will not be recorded.",
    },
    create: {
      faqId: faq2.id,
      language: Language.en,
      question: "Can I change routes on race day?",
      answer:
        "Yes, you can change routes, but you must inform the organization at km zero checkpoint (box entrance) or by email until April 8, 2026. Otherwise, your arrival time will not be recorded.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.es } },
    update: {
      question: "¿Puedo cambiar de recorrido el día de la carrera?",
      answer:
        "Sí, puedes cambiar de recorrido, pero debes informar a la organización en el control km cero (entrada del box) o por email hasta el 8 de abril de 2026. De lo contrario, tu tiempo de llegada no será registrado.",
    },
    create: {
      faqId: faq2.id,
      language: Language.es,
      question: "¿Puedo cambiar de recorrido el día de la carrera?",
      answer:
        "Sí, puedes cambiar de recorrido, pero debes informar a la organización en el control km cero (entrada del box) o por email hasta el 8 de abril de 2026. De lo contrario, tu tiempo de llegada no será registrado.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.fr } },
    update: {
      question: "Puis-je changer de parcours le jour de la course?",
      answer:
        "Oui, vous pouvez changer de parcours, mais vous devez informer l'organisation au contrôle km zéro (entrée du box) ou par email jusqu'au 8 avril 2026. Sinon, votre temps d'arrivée ne sera pas enregistré.",
    },
    create: {
      faqId: faq2.id,
      language: Language.fr,
      question: "Puis-je changer de parcours le jour de la course?",
      answer:
        "Oui, vous pouvez changer de parcours, mais vous devez informer l'organisation au contrôle km zéro (entrée du box) ou par email jusqu'au 8 avril 2026. Sinon, votre temps d'arrivée ne sera pas enregistré.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.de } },
    update: {
      question: "Kann ich am Renntag die Strecke wechseln?",
      answer:
        "Ja, Sie können die Strecke wechseln, müssen aber die Organisation am Kontrollpunkt km null (Box-Eingang) oder per E-Mail bis zum 8. April 2026 informieren. Andernfalls wird Ihre Ankunftszeit nicht erfasst.",
    },
    create: {
      faqId: faq2.id,
      language: Language.de,
      question: "Kann ich am Renntag die Strecke wechseln?",
      answer:
        "Ja, Sie können die Strecke wechseln, müssen aber die Organisation am Kontrollpunkt km null (Box-Eingang) oder per E-Mail bis zum 8. April 2026 informieren. Andernfalls wird Ihre Ankunftszeit nicht erfasst.",
    },
  });

  await prisma.eventFAQTranslation.upsert({
    where: { faqId_language: { faqId: faq2.id, language: Language.it } },
    update: {
      question: "Posso cambiare percorso il giorno della gara?",
      answer:
        "Sì, puoi cambiare percorso, ma devi informare l'organizzazione al controllo km zero (ingresso box) o via email entro l'8 aprile 2026. Altrimenti, il tuo tempo di arrivo non sarà registrato.",
    },
    create: {
      faqId: faq2.id,
      language: Language.it,
      question: "Posso cambiare percorso il giorno della gara?",
      answer:
        "Sì, puoi cambiare percorso, ma devi informare l'organizzazione al controllo km zero (ingresso box) o via email entro l'8 aprile 2026. Altrimenti, il tuo tempo di arrivo non sarà registrato.",
    },
  });

  console.log("   ✅ Created 2 FAQs with 6 language translations each");

  console.log(`
🎉 20ª Edição Pelas Abas da Geada 2026 seeded successfully!
   📍 Event: 20ª Edição Pelas Abas da Geada
   🔗 Slug: ${event.slug}
   📅 Date: 2026-04-12
   📍 Location: Santa Catarina da Fonte do Bispo, Tavira, Portugal
   🚴 Variants: BTT 35km, BTT 60km
   💰 Pricing: €15 (sem almoço), €30 (com almoço)
   ❓ FAQs: 2 questions with 6 language translations
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
