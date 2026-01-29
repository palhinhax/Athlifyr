/**
 * Seed: Trilho do Entrudono 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎭 Seeding Trilho do Entrudono 2026...");

  const eventSlug = "trilho-do-entrudono-2026";

  // Step 1: Delete existing data to ensure clean state
  const existingEvent = await prisma.event.findUnique({
    where: { slug: eventSlug },
  });

  if (existingEvent) {
    console.log("   Cleaning existing event data...");
    await prisma.pricingPhase.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventFAQ.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventVariant.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventTranslation.deleteMany({
      where: { eventId: existingEvent.id },
    });
  }

  // Step 2: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Trilho do Entrudono",
      description:
        "Caminhada temática de Carnaval integrada no evento Entrudono – Entrudo de Penedono. Percurso de 12km por trilhos e caminhos rurais com animação carnavalesca.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-14T09:30:00.000Z"),
      endDate: null,
      city: "Penedono",
      country: "Portugal",
      latitude: 40.9897,
      longitude: -7.3944,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Castelo+de+Penedono+Pra%C3%A7a+25+de+Abril",
      externalUrl: "https://acorrer.pt/eventos/4154/info",
      imageUrl: null,
      isFeatured: false,
      registrationDeadline: new Date("2026-02-10T12:00:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Trilho do Entrudono",
      description:
        "Caminhada temática de Carnaval integrada no evento Entrudono – Entrudo de Penedono. Percurso de 12km por trilhos e caminhos rurais com animação carnavalesca.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-14T09:30:00.000Z"),
      endDate: null,
      city: "Penedono",
      country: "Portugal",
      latitude: 40.9897,
      longitude: -7.3944,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Castelo+de+Penedono+Pra%C3%A7a+25+de+Abril",
      externalUrl: "https://acorrer.pt/eventos/4154/info",
      imageUrl: null,
      isFeatured: false,
      registrationDeadline: new Date("2026-02-10T12:00:00.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 3: Create translations for ALL 6 LANGUAGES
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
      title: "Trilho do Entrudono",
      city: "Penedono",
      metaTitle: "Trilho do Entrudono 2026 | Penedono, Viseu | 14 Fevereiro",
      metaDescription:
        "Trilho do Entrudono - Caminhada temática de Carnaval a 14 de fevereiro de 2026 em Penedono. Percurso de 12km com animação carnavalesca. Inscrição 7€, almoço opcional 10€.",
      description: `# 🎭 Trilho do Entrudono 2026

O **Trilho do Entrudono** é uma caminhada temática integrada no evento **Entrudono – Entrudo de Penedono**, de índole carnavalesca e cultural, realizado no concelho de Penedono, na Beira Alta.

## 📅 Data e Local

- **Data:** 14 de fevereiro de 2026 (Sábado)
- **Hora de Partida:** 09:30
- **Ponto de Encontro:** 09:10 junto ao Posto de Turismo
- **Local:** Castelo de Penedono, Praça 25 de Abril
- **Distrito:** Viseu

## 🚶 Sobre a Caminhada

Trata-se de uma atividade de caráter **lúdico-cultural, não competitiva**, que privilegia o convívio e a vivência cultural tirando proveito do património natural e imaterial da região.

O percurso desenvolve-se maioritariamente por **caminhos rurais e trilhos de serra**, incluindo pontualmente troços em alcatrão, com aproximadamente **12km**.

## 🎪 Animação Temática

O Trilho do Entrudono assume uma forte componente temática e performativa, estando intimamente ligado ao imaginário tradicional carnavalesco. Ao longo do percurso, os participantes são surpreendidos por diversos **personagens associados à simbologia do Entrudo**, promovendo momentos de interação, animação e envolvimento direto com a narrativa do evento.

## 🎁 A Inscrição Inclui

- ✅ Participação na caminhada
- ✅ Seguro desportivo
- ✅ Reforço a meio do percurso (comida, snacks e bebidas)
- ✅ Pulseira identificativa
- ✅ Camisola alusiva ao evento

## 🍽️ Extras Opcionais

- **Almoço:** +10€
- **Acompanhantes (almoço):** 10€

## 👕 Equipamento Obrigatório

- Calçado adequado a trilhos (botas ou sapatilhas de caminhada)
- Vestuário confortável e apropriado às condições meteorológicas

## 👕 Equipamento Recomendado

- Água em quantidade suficiente
- Chapéu ou boné
- Protetor solar
- Casaco impermeável
- Telemóvel
- Apito

## 🎭 Fantasias

**Fantasias temáticas são permitidas**, desde que não comprometam a segurança do participante!

## 📍 Secretariado

**Local:** Posto de Turismo, Praça 25 de Abril (Largo do Castelo)
**Horário:** Até 1h30 antes do início da caminhada

## 📞 Contactos

- **Telemóvel:** 934 771 112 | 938 480 098
- **Email:** hostedomagrico9@gmail.com
- **Facebook:** Hoste do Magriço
- **Instagram:** @hostedomagrico

---

**🎭 Trilho do Entrudono - Onde a tradição encontra a aventura!**`,
    },
    {
      language: "en",
      title: "Trilho do Entrudono",
      city: "Penedono",
      metaTitle: "Trilho do Entrudono 2026 | Penedono, Viseu | February 14",
      metaDescription:
        "Trilho do Entrudono - Carnival themed walk on February 14, 2026 in Penedono. 12km route with carnival entertainment. Registration €7, optional lunch €10.",
      description: `# 🎭 Trilho do Entrudono 2026

The **Trilho do Entrudono** is a themed walk integrated into the **Entrudono – Entrudo de Penedono** event, a carnival and cultural celebration held in the municipality of Penedono, in Beira Alta region.

## 📅 Date and Location

- **Date:** February 14, 2026 (Saturday)
- **Start Time:** 9:30 AM
- **Meeting Point:** 9:10 AM at the Tourism Office
- **Location:** Penedono Castle, Praça 25 de Abril
- **District:** Viseu

## 🚶 About the Walk

This is a **recreational-cultural, non-competitive activity** that emphasizes socializing and cultural experience while enjoying the region's natural and intangible heritage.

The route develops mainly through **rural paths and mountain trails**, occasionally including asphalt sections, with approximately **12km**.

## 🎪 Themed Entertainment

The Trilho do Entrudono features a strong thematic and performative component, closely linked to traditional carnival imagery. Along the route, participants are surprised by various **characters associated with Carnival symbolism**, promoting moments of interaction, entertainment and direct involvement with the event's narrative.

## 🎁 Registration Includes

- ✅ Participation in the walk
- ✅ Sports insurance
- ✅ Mid-route refreshments (food, snacks and drinks)
- ✅ Identification wristband
- ✅ Event t-shirt

## 🍽️ Optional Extras

- **Lunch:** +€10
- **Companions (lunch):** €10

## 👕 Mandatory Equipment

- Suitable footwear for trails (hiking boots or shoes)
- Comfortable clothing appropriate for weather conditions

## 👕 Recommended Equipment

- Sufficient water
- Hat or cap
- Sunscreen
- Waterproof jacket
- Mobile phone
- Whistle

## 🎭 Costumes

**Themed costumes are allowed**, as long as they don't compromise the participant's safety!

## 📍 Secretariat

**Location:** Tourism Office, Praça 25 de Abril (Castle Square)
**Hours:** Until 1h30 before the walk starts

## 📞 Contacts

- **Phone:** 934 771 112 | 938 480 098
- **Email:** hostedomagrico9@gmail.com
- **Facebook:** Hoste do Magriço
- **Instagram:** @hostedomagrico

---

**🎭 Trilho do Entrudono - Where tradition meets adventure!**`,
    },
    {
      language: "es",
      title: "Trilho do Entrudono",
      city: "Penedono",
      metaTitle: "Trilho do Entrudono 2026 | Penedono, Viseu | 14 Febrero",
      metaDescription:
        "Trilho do Entrudono - Caminata temática de Carnaval el 14 de febrero de 2026 en Penedono. Recorrido de 12km con animación carnavalesca. Inscripción 7€, almuerzo opcional 10€.",
      description: `# 🎭 Trilho do Entrudono 2026

El **Trilho do Entrudono** es una caminata temática integrada en el evento **Entrudono – Entrudo de Penedono**, de índole carnavalesca y cultural, realizado en el municipio de Penedono, en la región de Beira Alta.

## 📅 Fecha y Lugar

- **Fecha:** 14 de febrero de 2026 (Sábado)
- **Hora de Salida:** 09:30
- **Punto de Encuentro:** 09:10 junto a la Oficina de Turismo
- **Lugar:** Castillo de Penedono, Praça 25 de Abril
- **Distrito:** Viseu

## 🚶 Sobre la Caminata

Se trata de una actividad de carácter **lúdico-cultural, no competitiva**, que privilegia la convivencia y la vivencia cultural aprovechando el patrimonio natural e inmaterial de la región.

El recorrido se desarrolla principalmente por **caminos rurales y senderos de sierra**, incluyendo puntualmente tramos de asfalto, con aproximadamente **12km**.

## 🎪 Animación Temática

El Trilho do Entrudono asume una fuerte componente temática y performativa, estando íntimamente ligado al imaginario tradicional carnavalesco. A lo largo del recorrido, los participantes son sorprendidos por diversos **personajes asociados a la simbología del Carnaval**, promoviendo momentos de interacción, animación e involucramiento directo con la narrativa del evento.

## 🎁 La Inscripción Incluye

- ✅ Participación en la caminata
- ✅ Seguro deportivo
- ✅ Refrigerio a mitad del recorrido (comida, snacks y bebidas)
- ✅ Pulsera identificativa
- ✅ Camiseta alusiva al evento

## 🍽️ Extras Opcionales

- **Almuerzo:** +10€
- **Acompañantes (almuerzo):** 10€

## 👕 Equipamiento Obligatorio

- Calzado adecuado para senderos (botas o zapatillas de senderismo)
- Ropa cómoda y apropiada para las condiciones meteorológicas

## 👕 Equipamiento Recomendado

- Agua en cantidad suficiente
- Sombrero o gorra
- Protector solar
- Chaqueta impermeable
- Teléfono móvil
- Silbato

## 🎭 Disfraces

**¡Los disfraces temáticos están permitidos**, siempre que no comprometan la seguridad del participante!

## 📍 Secretariado

**Lugar:** Oficina de Turismo, Praça 25 de Abril (Plaza del Castillo)
**Horario:** Hasta 1h30 antes del inicio de la caminata

## 📞 Contactos

- **Teléfono:** 934 771 112 | 938 480 098
- **Email:** hostedomagrico9@gmail.com
- **Facebook:** Hoste do Magriço
- **Instagram:** @hostedomagrico

---

**🎭 Trilho do Entrudono - ¡Donde la tradición encuentra la aventura!**`,
    },
    {
      language: "fr",
      title: "Trilho do Entrudono",
      city: "Penedono",
      metaTitle: "Trilho do Entrudono 2026 | Penedono, Viseu | 14 Février",
      metaDescription:
        "Trilho do Entrudono - Marche thématique de Carnaval le 14 février 2026 à Penedono. Parcours de 12km avec animation carnavalesque. Inscription 7€, déjeuner optionnel 10€.",
      description: `# 🎭 Trilho do Entrudono 2026

Le **Trilho do Entrudono** est une marche thématique intégrée à l'événement **Entrudono – Entrudo de Penedono**, de nature carnavalesque et culturelle, organisé dans la municipalité de Penedono, dans la région de Beira Alta.

## 📅 Date et Lieu

- **Date:** 14 février 2026 (Samedi)
- **Heure de Départ:** 09h30
- **Point de Rencontre:** 09h10 près de l'Office de Tourisme
- **Lieu:** Château de Penedono, Praça 25 de Abril
- **District:** Viseu

## 🚶 À Propos de la Marche

Il s'agit d'une activité à caractère **ludico-culturel, non compétitive**, qui privilégie la convivialité et l'expérience culturelle en profitant du patrimoine naturel et immatériel de la région.

Le parcours se développe principalement par **chemins ruraux et sentiers de montagne**, incluant ponctuellement des tronçons asphaltés, sur environ **12km**.

## 🎪 Animation Thématique

Le Trilho do Entrudono assume une forte composante thématique et performative, étant intimement lié à l'imaginaire carnavalesque traditionnel. Tout au long du parcours, les participants sont surpris par divers **personnages associés à la symbolique du Carnaval**, favorisant des moments d'interaction, d'animation et d'implication directe avec le récit de l'événement.

## 🎁 L'Inscription Comprend

- ✅ Participation à la marche
- ✅ Assurance sportive
- ✅ Ravitaillement à mi-parcours (nourriture, snacks et boissons)
- ✅ Bracelet d'identification
- ✅ T-shirt de l'événement

## 🍽️ Extras Optionnels

- **Déjeuner:** +10€
- **Accompagnants (déjeuner):** 10€

## 👕 Équipement Obligatoire

- Chaussures adaptées aux sentiers (chaussures de randonnée)
- Vêtements confortables et appropriés aux conditions météorologiques

## 👕 Équipement Recommandé

- Eau en quantité suffisante
- Chapeau ou casquette
- Crème solaire
- Veste imperméable
- Téléphone portable
- Sifflet

## 🎭 Déguisements

**Les déguisements thématiques sont autorisés**, à condition qu'ils ne compromettent pas la sécurité du participant!

## 📍 Secrétariat

**Lieu:** Office de Tourisme, Praça 25 de Abril (Place du Château)
**Horaires:** Jusqu'à 1h30 avant le début de la marche

## 📞 Contacts

- **Téléphone:** 934 771 112 | 938 480 098
- **Email:** hostedomagrico9@gmail.com
- **Facebook:** Hoste do Magriço
- **Instagram:** @hostedomagrico

---

**🎭 Trilho do Entrudono - Où la tradition rencontre l'aventure!**`,
    },
    {
      language: "de",
      title: "Trilho do Entrudono",
      city: "Penedono",
      metaTitle: "Trilho do Entrudono 2026 | Penedono, Viseu | 14. Februar",
      metaDescription:
        "Trilho do Entrudono - Karnevals-Themenwanderung am 14. Februar 2026 in Penedono. 12km Strecke mit Karnevalsunterhaltung. Anmeldung 7€, optionales Mittagessen 10€.",
      description: `# 🎭 Trilho do Entrudono 2026

Der **Trilho do Entrudono** ist eine Themenwanderung, die in das **Entrudono – Entrudo de Penedono** Event integriert ist, eine Karnevals- und Kulturveranstaltung in der Gemeinde Penedono in der Region Beira Alta.

## 📅 Datum und Ort

- **Datum:** 14. Februar 2026 (Samstag)
- **Startzeit:** 09:30 Uhr
- **Treffpunkt:** 09:10 Uhr beim Tourismusbüro
- **Ort:** Burg Penedono, Praça 25 de Abril
- **Bezirk:** Viseu

## 🚶 Über die Wanderung

Es handelt sich um eine **freizeitkulturelle, nicht-kompetitive Aktivität**, die Geselligkeit und kulturelles Erleben unter Nutzung des natürlichen und immateriellen Erbes der Region fördert.

Die Route verläuft hauptsächlich über **ländliche Wege und Bergpfade**, stellenweise auch über asphaltierte Abschnitte, mit etwa **12km**.

## 🎪 Themenunterhaltung

Der Trilho do Entrudono hat eine starke thematische und performative Komponente, die eng mit der traditionellen Karnevalsimagination verbunden ist. Entlang der Strecke werden die Teilnehmer von verschiedenen **Figuren überrascht, die mit der Karnevalssymbolik verbunden sind**, was Momente der Interaktion, Unterhaltung und direkten Einbindung in die Erzählung des Events fördert.

## 🎁 Die Anmeldung Beinhaltet

- ✅ Teilnahme an der Wanderung
- ✅ Sportversicherung
- ✅ Verpflegung auf halber Strecke (Essen, Snacks und Getränke)
- ✅ Identifikationsarmband
- ✅ Event-T-Shirt

## 🍽️ Optionale Extras

- **Mittagessen:** +10€
- **Begleitpersonen (Mittagessen):** 10€

## 👕 Pflichtausrüstung

- Geeignetes Schuhwerk für Wanderwege (Wanderschuhe)
- Bequeme, den Wetterbedingungen angemessene Kleidung

## 👕 Empfohlene Ausrüstung

- Ausreichend Wasser
- Hut oder Mütze
- Sonnenschutz
- Wasserdichte Jacke
- Mobiltelefon
- Pfeife

## 🎭 Kostüme

**Themenkostüme sind erlaubt**, solange sie die Sicherheit des Teilnehmers nicht gefährden!

## 📍 Sekretariat

**Ort:** Tourismusbüro, Praça 25 de Abril (Burgplatz)
**Öffnungszeiten:** Bis 1h30 vor Beginn der Wanderung

## 📞 Kontakte

- **Telefon:** 934 771 112 | 938 480 098
- **E-Mail:** hostedomagrico9@gmail.com
- **Facebook:** Hoste do Magriço
- **Instagram:** @hostedomagrico

---

**🎭 Trilho do Entrudono - Wo Tradition auf Abenteuer trifft!**`,
    },
    {
      language: "it",
      title: "Trilho do Entrudono",
      city: "Penedono",
      metaTitle: "Trilho do Entrudono 2026 | Penedono, Viseu | 14 Febbraio",
      metaDescription:
        "Trilho do Entrudono - Camminata tematica di Carnevale il 14 febbraio 2026 a Penedono. Percorso di 12km con animazione carnevalesca. Iscrizione 7€, pranzo opzionale 10€.",
      description: `# 🎭 Trilho do Entrudono 2026

Il **Trilho do Entrudono** è una camminata tematica integrata nell'evento **Entrudono – Entrudo de Penedono**, di natura carnevalesca e culturale, realizzato nel comune di Penedono, nella regione di Beira Alta.

## 📅 Data e Luogo

- **Data:** 14 febbraio 2026 (Sabato)
- **Ora di Partenza:** 09:30
- **Punto di Incontro:** 09:10 presso l'Ufficio del Turismo
- **Luogo:** Castello di Penedono, Praça 25 de Abril
- **Distretto:** Viseu

## 🚶 Informazioni sulla Camminata

Si tratta di un'attività a carattere **ludico-culturale, non competitiva**, che privilegia la convivialità e l'esperienza culturale sfruttando il patrimonio naturale e immateriale della regione.

Il percorso si sviluppa principalmente attraverso **sentieri rurali e di montagna**, includendo occasionalmente tratti asfaltati, per circa **12km**.

## 🎪 Animazione Tematica

Il Trilho do Entrudono assume una forte componente tematica e performativa, essendo intimamente legato all'immaginario carnevalesco tradizionale. Lungo il percorso, i partecipanti sono sorpresi da vari **personaggi associati alla simbologia del Carnevale**, promuovendo momenti di interazione, animazione e coinvolgimento diretto con la narrativa dell'evento.

## 🎁 L'Iscrizione Include

- ✅ Partecipazione alla camminata
- ✅ Assicurazione sportiva
- ✅ Ristoro a metà percorso (cibo, snack e bevande)
- ✅ Braccialetto identificativo
- ✅ T-shirt dell'evento

## 🍽️ Extra Opzionali

- **Pranzo:** +10€
- **Accompagnatori (pranzo):** 10€

## 👕 Equipaggiamento Obbligatorio

- Calzature adatte ai sentieri (scarponi o scarpe da trekking)
- Abbigliamento comodo e appropriato alle condizioni meteorologiche

## 👕 Equipaggiamento Consigliato

- Acqua in quantità sufficiente
- Cappello o berretto
- Protezione solare
- Giacca impermeabile
- Telefono cellulare
- Fischietto

## 🎭 Costumi

**I costumi tematici sono permessi**, purché non compromettano la sicurezza del partecipante!

## 📍 Segreteria

**Luogo:** Ufficio del Turismo, Praça 25 de Abril (Piazza del Castello)
**Orario:** Fino a 1h30 prima dell'inizio della camminata

## 📞 Contatti

- **Telefono:** 934 771 112 | 938 480 098
- **Email:** hostedomagrico9@gmail.com
- **Facebook:** Hoste do Magriço
- **Instagram:** @hostedomagrico

---

**🎭 Trilho do Entrudono - Dove la tradizione incontra l'avventura!**`,
    },
  ];

  console.log("📝 Creating translations for all 6 languages...");

  for (const t of translations) {
    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId: event.id, language: t.language } },
      update: {
        title: t.title,
        description: t.description,
        city: t.city,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      },
      create: {
        eventId: event.id,
        language: t.language,
        title: t.title,
        description: t.description,
        city: t.city,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      },
    });
    console.log(`   ✅ Translation ${t.language.toUpperCase()} created`);
  }

  // Step 4: Create event variants
  console.log("🚶 Creating event variants...");

  const variants = [
    {
      name: "Caminhada 12km",
      distanceKm: 12,
      elevationGainM: null,
      startTime: "09:30",
      cutoffTimeHours: null,
      description:
        "Caminhada temática de Carnaval de 12km por trilhos e caminhos rurais",
      pricingPhases: [
        {
          name: "Inscrição",
          startDate: new Date("2025-12-01T00:00:00.000Z"),
          endDate: new Date("2026-02-10T12:00:00.000Z"),
          price: 7.0,
          currency: "EUR" as const,
        },
      ],
      translations: {
        pt: {
          name: "Caminhada 12km",
          description:
            "Caminhada temática de Carnaval de 12km por trilhos e caminhos rurais. Atividade não competitiva.",
        },
        en: {
          name: "Walk 12km",
          description:
            "12km Carnival themed walk through trails and rural paths. Non-competitive activity.",
        },
        es: {
          name: "Caminata 12km",
          description:
            "Caminata temática de Carnaval de 12km por senderos y caminos rurales. Actividad no competitiva.",
        },
        fr: {
          name: "Marche 12km",
          description:
            "Marche thématique de Carnaval de 12km par sentiers et chemins ruraux. Activité non compétitive.",
        },
        de: {
          name: "Wanderung 12km",
          description:
            "12km Karnevals-Themenwanderung über Wanderwege und ländliche Pfade. Nicht-kompetitive Aktivität.",
        },
        it: {
          name: "Camminata 12km",
          description:
            "Camminata tematica di Carnevale di 12km per sentieri e strade rurali. Attività non competitiva.",
        },
      },
    },
  ];

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

    // Create variant translations
    for (const [lang, trans] of Object.entries(variantTranslations)) {
      await prisma.eventVariantTranslation.create({
        data: {
          variantId: variant.id,
          language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
          name: trans.name,
          description: trans.description,
        },
      });
    }

    // Create pricing phases linked to eventId (NOT variantId)
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
        },
      });
    }
    console.log(`   - Created ${pricingPhases.length} pricing phases`);
  }

  // Step 5: Create FAQs
  console.log("❓ Creating FAQs...");

  const faqs = [
    {
      order: 1,
      question: "O que está incluído na inscrição?",
      answer:
        "A inscrição de 7€ inclui: participação na caminhada, seguro desportivo, reforço a meio do percurso (comida, snacks e bebidas), pulseira identificativa e camisola alusiva ao evento.",
      translations: {
        pt: {
          question: "O que está incluído na inscrição?",
          answer:
            "A inscrição de 7€ inclui: participação na caminhada, seguro desportivo, reforço a meio do percurso (comida, snacks e bebidas), pulseira identificativa e camisola alusiva ao evento.",
        },
        en: {
          question: "What is included in the registration?",
          answer:
            "The €7 registration includes: participation in the walk, sports insurance, mid-route refreshments (food, snacks and drinks), identification wristband and event t-shirt.",
        },
        es: {
          question: "¿Qué está incluido en la inscripción?",
          answer:
            "La inscripción de 7€ incluye: participación en la caminata, seguro deportivo, refrigerio a mitad del recorrido (comida, snacks y bebidas), pulsera identificativa y camiseta del evento.",
        },
        fr: {
          question: "Qu'est-ce qui est inclus dans l'inscription?",
          answer:
            "L'inscription de 7€ comprend: participation à la marche, assurance sportive, ravitaillement à mi-parcours (nourriture, snacks et boissons), bracelet d'identification et t-shirt de l'événement.",
        },
        de: {
          question: "Was ist in der Anmeldung enthalten?",
          answer:
            "Die Anmeldung von 7€ beinhaltet: Teilnahme an der Wanderung, Sportversicherung, Verpflegung auf halber Strecke (Essen, Snacks und Getränke), Identifikationsarmband und Event-T-Shirt.",
        },
        it: {
          question: "Cosa è incluso nell'iscrizione?",
          answer:
            "L'iscrizione di 7€ include: partecipazione alla camminata, assicurazione sportiva, ristoro a metà percorso (cibo, snack e bevande), braccialetto identificativo e t-shirt dell'evento.",
        },
      },
    },
    {
      order: 2,
      question: "Posso usar fantasia de Carnaval?",
      answer:
        "Sim! Fantasias temáticas são permitidas e até encorajadas, desde que não comprometam a segurança do participante durante a caminhada pelos trilhos.",
      translations: {
        pt: {
          question: "Posso usar fantasia de Carnaval?",
          answer:
            "Sim! Fantasias temáticas são permitidas e até encorajadas, desde que não comprometam a segurança do participante durante a caminhada pelos trilhos.",
        },
        en: {
          question: "Can I wear a Carnival costume?",
          answer:
            "Yes! Themed costumes are allowed and even encouraged, as long as they don't compromise the participant's safety during the trail walk.",
        },
        es: {
          question: "¿Puedo usar disfraz de Carnaval?",
          answer:
            "¡Sí! Los disfraces temáticos están permitidos e incluso se animan, siempre que no comprometan la seguridad del participante durante la caminata por los senderos.",
        },
        fr: {
          question: "Puis-je porter un costume de Carnaval?",
          answer:
            "Oui! Les déguisements thématiques sont autorisés et même encouragés, à condition qu'ils ne compromettent pas la sécurité du participant pendant la marche sur les sentiers.",
        },
        de: {
          question: "Kann ich ein Karnevalskostüm tragen?",
          answer:
            "Ja! Themenkostüme sind erlaubt und sogar erwünscht, solange sie die Sicherheit des Teilnehmers während der Wanderung auf den Pfaden nicht gefährden.",
        },
        it: {
          question: "Posso indossare un costume di Carnevale?",
          answer:
            "Sì! I costumi tematici sono permessi e anche incoraggiati, purché non compromettano la sicurezza del partecipante durante la camminata sui sentieri.",
        },
      },
    },
    {
      order: 3,
      question: "Esta caminhada é competitiva?",
      answer:
        "Não. O Trilho do Entrudono é uma atividade de caráter lúdico-cultural, não competitiva, que privilegia o convívio e a vivência cultural. Não há tempos, classificações ou qualquer tipo de ordenação dos participantes.",
      translations: {
        pt: {
          question: "Esta caminhada é competitiva?",
          answer:
            "Não. O Trilho do Entrudono é uma atividade de caráter lúdico-cultural, não competitiva, que privilegia o convívio e a vivência cultural. Não há tempos, classificações ou qualquer tipo de ordenação dos participantes.",
        },
        en: {
          question: "Is this walk competitive?",
          answer:
            "No. The Trilho do Entrudono is a recreational-cultural, non-competitive activity that emphasizes socializing and cultural experience. There are no times, rankings or any type of participant ordering.",
        },
        es: {
          question: "¿Esta caminata es competitiva?",
          answer:
            "No. El Trilho do Entrudono es una actividad de carácter lúdico-cultural, no competitiva, que privilegia la convivencia y la vivencia cultural. No hay tiempos, clasificaciones ni ningún tipo de ordenación de los participantes.",
        },
        fr: {
          question: "Cette marche est-elle compétitive?",
          answer:
            "Non. Le Trilho do Entrudono est une activité à caractère ludico-culturel, non compétitive, qui privilégie la convivialité et l'expérience culturelle. Il n'y a pas de temps, de classements ou tout type d'ordonnancement des participants.",
        },
        de: {
          question: "Ist diese Wanderung ein Wettbewerb?",
          answer:
            "Nein. Der Trilho do Entrudono ist eine freizeitkulturelle, nicht-kompetitive Aktivität, die Geselligkeit und kulturelles Erleben fördert. Es gibt keine Zeiten, Ranglisten oder jegliche Art von Teilnehmerordnung.",
        },
        it: {
          question: "Questa camminata è competitiva?",
          answer:
            "No. Il Trilho do Entrudono è un'attività a carattere ludico-culturale, non competitiva, che privilegia la convivialità e l'esperienza culturale. Non ci sono tempi, classifiche o qualsiasi tipo di ordinamento dei partecipanti.",
        },
      },
    },
    {
      order: 4,
      question: "Qual é o equipamento necessário?",
      answer:
        "Obrigatório: calçado adequado a trilhos (botas ou sapatilhas de caminhada) e vestuário confortável. Recomendado: água suficiente, chapéu/boné, protetor solar, casaco impermeável, telemóvel e apito.",
      translations: {
        pt: {
          question: "Qual é o equipamento necessário?",
          answer:
            "Obrigatório: calçado adequado a trilhos (botas ou sapatilhas de caminhada) e vestuário confortável. Recomendado: água suficiente, chapéu/boné, protetor solar, casaco impermeável, telemóvel e apito.",
        },
        en: {
          question: "What equipment is needed?",
          answer:
            "Mandatory: suitable footwear for trails (hiking boots or shoes) and comfortable clothing. Recommended: sufficient water, hat/cap, sunscreen, waterproof jacket, mobile phone and whistle.",
        },
        es: {
          question: "¿Qué equipamiento es necesario?",
          answer:
            "Obligatorio: calzado adecuado para senderos (botas o zapatillas de senderismo) y ropa cómoda. Recomendado: agua suficiente, sombrero/gorra, protector solar, chaqueta impermeable, teléfono móvil y silbato.",
        },
        fr: {
          question: "Quel équipement est nécessaire?",
          answer:
            "Obligatoire: chaussures adaptées aux sentiers (chaussures de randonnée) et vêtements confortables. Recommandé: eau suffisante, chapeau/casquette, crème solaire, veste imperméable, téléphone portable et sifflet.",
        },
        de: {
          question: "Welche Ausrüstung wird benötigt?",
          answer:
            "Pflicht: geeignetes Schuhwerk für Wanderwege (Wanderschuhe) und bequeme Kleidung. Empfohlen: ausreichend Wasser, Hut/Mütze, Sonnenschutz, wasserdichte Jacke, Mobiltelefon und Pfeife.",
        },
        it: {
          question: "Quale equipaggiamento è necessario?",
          answer:
            "Obbligatorio: calzature adatte ai sentieri (scarponi o scarpe da trekking) e abbigliamento comodo. Consigliato: acqua sufficiente, cappello/berretto, protezione solare, giacca impermeabile, telefono cellulare e fischietto.",
        },
      },
    },
    {
      order: 5,
      question: "Menores de idade podem participar?",
      answer:
        "Sim, mas menores de 18 anos só poderão participar acompanhados por um adulto responsável.",
      translations: {
        pt: {
          question: "Menores de idade podem participar?",
          answer:
            "Sim, mas menores de 18 anos só poderão participar acompanhados por um adulto responsável.",
        },
        en: {
          question: "Can minors participate?",
          answer:
            "Yes, but participants under 18 years old can only participate accompanied by a responsible adult.",
        },
        es: {
          question: "¿Pueden participar los menores de edad?",
          answer:
            "Sí, pero los menores de 18 años solo podrán participar acompañados por un adulto responsable.",
        },
        fr: {
          question: "Les mineurs peuvent-ils participer?",
          answer:
            "Oui, mais les participants de moins de 18 ans ne peuvent participer qu'accompagnés d'un adulte responsable.",
        },
        de: {
          question: "Können Minderjährige teilnehmen?",
          answer:
            "Ja, aber Teilnehmer unter 18 Jahren können nur in Begleitung eines verantwortlichen Erwachsenen teilnehmen.",
        },
        it: {
          question: "I minori possono partecipare?",
          answer:
            "Sì, ma i partecipanti di età inferiore ai 18 anni possono partecipare solo accompagnati da un adulto responsabile.",
        },
      },
    },
  ];

  for (const faqData of faqs) {
    const faq = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        question: faqData.question,
        answer: faqData.answer,
      },
    });

    // Create FAQ translations
    for (const [lang, trans] of Object.entries(faqData.translations)) {
      await prisma.eventFAQTranslation.create({
        data: {
          faqId: faq.id,
          language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
          question: trans.question,
          answer: trans.answer,
        },
      });
    }
  }

  console.log(`   ✅ Created ${faqs.length} FAQs with translations`);

  // Summary
  console.log("\n🎉 Trilho do Entrudono 2026 seeded successfully!");
  console.log(`   📍 Event: Trilho do Entrudono`);
  console.log(`   🔗 Slug: ${event.slug}`);
  console.log(`   📅 Date: 2026-02-14`);
  console.log(`   📍 Location: Penedono, Viseu, Portugal`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding event:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
