/**
 * Seed: XI Trail Montes Saloios 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⛰️ Seeding XI Trail Montes Saloios 2026...");

  const eventSlug = "trail-montes-saloios-2026";

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
      title: "XI Trail Montes Saloios",
      description:
        "11.ª edição do Trail Montes Saloios em Covas de Ferro, Sintra. Trail Longo 31K, Trail Curto 15K, Mini Trail 10K e Caminhada 10K. Integra o Circuito de Trail da Associação de Atletismo de Lisboa.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-15T09:00:00.000Z"),
      endDate: null,
      city: "Covas de Ferro",
      country: "Portugal",
      latitude: 38.8667,
      longitude: -9.3167,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Covas+de+Ferro+Almargem+do+Bispo+Sintra",
      externalUrl: "https://fazteaostrilhos.pt/",
      imageUrl: null,
      isFeatured: true,
      registrationDeadline: new Date("2026-02-08T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "XI Trail Montes Saloios",
      description:
        "11.ª edição do Trail Montes Saloios em Covas de Ferro, Sintra. Trail Longo 31K, Trail Curto 15K, Mini Trail 10K e Caminhada 10K. Integra o Circuito de Trail da Associação de Atletismo de Lisboa.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-15T09:00:00.000Z"),
      endDate: null,
      city: "Covas de Ferro",
      country: "Portugal",
      latitude: 38.8667,
      longitude: -9.3167,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Covas+de+Ferro+Almargem+do+Bispo+Sintra",
      externalUrl: "https://fazteaostrilhos.pt/",
      imageUrl: null,
      isFeatured: true,
      registrationDeadline: new Date("2026-02-08T23:59:59.000Z"),
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
      title: "XI Trail Montes Saloios",
      city: "Covas de Ferro",
      metaTitle: "XI Trail Montes Saloios 2026 | Sintra | 15 Fevereiro",
      metaDescription:
        "11.ª edição do Trail Montes Saloios a 15 de fevereiro de 2026 em Covas de Ferro, Sintra. Trail Longo 31K, Trail Curto 15K, Mini Trail 10K, Caminhada 10K. Circuito AAL.",
      description: `# ⛰️ XI Trail Montes Saloios 2026

O **XI Trail Montes Saloios** é uma prova organizada pelo **Motoclube TT Montes Saloios** e pela **Liga dos Amigos de Covas de Ferro**, com o apoio da **Associação Faz-te aos Trilhos!**. Realiza-se no dia **15 de fevereiro de 2026** na simpática aldeia de **Covas de Ferro**, em Almargem do Bispo, Sintra.

## 📅 Data e Local

- **Data:** 15 de fevereiro de 2026 (Domingo)
- **Hora de Partida:** 09:00
- **Local:** Pavilhão Gimnodesportivo da Liga dos Amigos de Covas de Ferro
- **Localidade:** Covas de Ferro, Almargem do Bispo, Sintra
- **Distrito:** Lisboa

## 🏃‍♀️ Provas e Distâncias

| Prova | Distância | Desnível | Tempo Limite |
|-------|-----------|----------|--------------|
| **Trail Longo** | 31 km | 1300 D+ | 7h |
| **Trail Curto** | 15 km | 780 D+ | 6h30 |
| **Mini Trail** | 10 km | 500 D+ | 6h15 |
| **Caminhada** | 10 km | 500 D+ | 6h15 |

## ⏱️ Programa

### Sábado, 14 de fevereiro
- **14:00 – 20:00** | Abertura do Secretariado para entrega do kit

### Domingo, 15 de fevereiro
- **07:00 – 08:30** | Abertura do Secretariado
- **08:30 – 08:55** | Controlo zero Trail Longo 31K
- **09:00** | Partida Trail Longo 31K e Prova Amor nos Montes 31K
- **09:05 – 09:25** | Controlo zero Trail Curto 15K
- **09:30** | Partida Trail Curto 15K e Prova Amor nos Montes 15K
- **09:35 – 09:45** | Controlo zero Mini Trail 10K
- **09:45** | Partida Mini Trail 10K e Caminhada
- **12:30 – 16:00** | Convívio com petiscos
- **13:00** | Início da cerimónia de entrega de prémios
- **16:00** | Encerramento do evento

## 🏆 Circuitos

O **Trail Longo** e o **Trail Curto** integram o **Circuito de Trail da Associação de Atletismo de Lisboa**.

## 💕 Prova Especial: Amor nos Montes

Tributo a todos os casais que queiram comemorar o Dia dos Namorados! A classificação é feita pelo somatório dos tempos do casal. Prémio especial para as 3 primeiras parelhas nas distâncias de 31K e 15K.

## 🎁 A Inscrição Inclui

- ✅ T-shirt alusiva à prova (técnica ou algodão)
- ✅ Seguro de acidentes pessoais
- ✅ Abastecimentos sólidos e líquidos
- ✅ Prémio finisher
- ✅ Banhos de crioterapia
- ✅ Sopa revigorante + bifana
- ✅ Bailarico de Carnaval
- ✅ Ginjinha! 🍒
- ✅ Possibilidade de ganhar vouchers dos Hotéis Vila Galé
- ✅ Oferta de 1 leitão à equipa mais numerosa!

## 🎒 Material Obrigatório

- ✅ Dorsal visível
- ✅ Telemóvel com carga
- ✅ Copo ou recipiente para líquidos
- ✅ Apito
- ✅ Manta de sobrevivência
- ✅ Boa disposição!

**Penalização:** 15 minutos ao tempo final por cada item em falta.

**Material Recomendado:**
- 🧥 Corta-vento ou impermeável
- 💧 Mínimo 1000ml de água
- 🍫 Reserva alimentar
- 📱 GPS ou dispositivo com coordenadas

## 💧 Abastecimentos (PAC)

| Prova | PAC 1 | PAC 2 | PAC 3 |
|-------|-------|-------|-------|
| Trail Longo 31K | ✅ | ✅ | Meta |
| Trail Curto 15K | ✅ | Meta | - |
| Mini Trail / Caminhada | ✅ | Meta | - |

⚠️ **Importante:** Não serão fornecidos copos. Cada atleta deve trazer o seu próprio recipiente.

## 🏆 Categorias

**Masculino e Feminino:**
- Júnior (18-19 anos)
- Sub 23 (20-22 anos)
- Seniores (23-34 anos)
- M/F 35 (35-39 anos)
- M/F 40 (40-44 anos)
- M/F 45 (45-49 anos)
- M/F 50 (50-54 anos)
- M/F 55 (55-59 anos)
- M/F 60 (60-64 anos)
- M/F 65 (65-69 anos)
- M/F 70 (70+ anos)

## 🏅 Prémios

- 🥇 Top 3 da Geral Masculina e Feminina (Trail Longo, Curto e Mini)
- 🥇 Top 3 de cada escalão
- 💕 Top 3 parelhas "Amor nos Montes" (31K e 15K)
- 🏆 Top 3 equipas (soma dos 3 melhores atletas)
- 🐷 1 leitão para a equipa mais numerosa!
- 🎭 Prémio ao melhor mascarado em prova

## 📞 Contactos

- **Telemóveis:** 918 322 288 | 962 934 554
- **Email:** montessaloios@fazteaostrilhos.pt
- **Website:** https://fazteaostrilhos.pt/
- **Inscrições:** https://acorrer.pt/eventos/4011/info

---

**⛰️ Os Montes Saloios estão de volta, mais fortes do que nunca! Are you ready again?**`,
    },
    {
      language: "en",
      title: "XI Trail Montes Saloios",
      city: "Covas de Ferro",
      metaTitle: "XI Trail Montes Saloios 2026 | Sintra | February 15",
      metaDescription:
        "11th edition of Trail Montes Saloios on February 15, 2026 in Covas de Ferro, Sintra. Long Trail 31K, Short Trail 15K, Mini Trail 10K, Walk 10K. Lisbon Athletics Association Circuit.",
      description: `# ⛰️ XI Trail Montes Saloios 2026

The **XI Trail Montes Saloios** is a race organized by **Motoclube TT Montes Saloios** and the **Liga dos Amigos de Covas de Ferro**, with support from **Associação Faz-te aos Trilhos!**. It takes place on **February 15, 2026** in the charming village of **Covas de Ferro**, in Almargem do Bispo, Sintra.

## 📅 Date & Location

- **Date:** February 15, 2026 (Sunday)
- **Start Time:** 09:00
- **Location:** Liga dos Amigos de Covas de Ferro Sports Hall
- **Village:** Covas de Ferro, Almargem do Bispo, Sintra
- **District:** Lisbon

## 🏃‍♀️ Races & Distances

| Race | Distance | Elevation | Time Limit |
|------|----------|-----------|------------|
| **Long Trail** | 31 km | 1300 D+ | 7h |
| **Short Trail** | 15 km | 780 D+ | 6h30 |
| **Mini Trail** | 10 km | 500 D+ | 6h15 |
| **Walk** | 10 km | 500 D+ | 6h15 |

## 🏆 Circuits

The **Long Trail** and **Short Trail** are part of the **Lisbon Athletics Association Trail Circuit**.

## 💕 Special Race: Love in the Mountains

A tribute to all couples who want to celebrate Valentine's Day! Classification is based on the sum of the couple's times. Special prize for the top 3 couples in the 31K and 15K distances.

## 🎁 Registration Includes

- ✅ Event T-shirt (technical or cotton)
- ✅ Personal accident insurance
- ✅ Solid and liquid aid stations
- ✅ Finisher prize
- ✅ Cryotherapy baths
- ✅ Soup + pork sandwich
- ✅ Carnival party
- ✅ Cherry liqueur! 🍒
- ✅ Chance to win Vila Galé Hotels vouchers
- ✅ 1 roast pig for the largest team!

## 🎒 Mandatory Equipment

- ✅ Visible race bib
- ✅ Charged mobile phone
- ✅ Cup or liquid container
- ✅ Whistle
- ✅ Survival blanket
- ✅ Good mood!

**Penalty:** 15 minutes added to final time for each missing item.

## 📞 Contacts

- **Phones:** +351 918 322 288 | +351 962 934 554
- **Email:** montessaloios@fazteaostrilhos.pt
- **Website:** https://fazteaostrilhos.pt/

---

**⛰️ Montes Saloios are back, stronger than ever! Are you ready again?**`,
    },
    {
      language: "es",
      title: "XI Trail Montes Saloios",
      city: "Covas de Ferro",
      metaTitle: "XI Trail Montes Saloios 2026 | Sintra | 15 Febrero",
      metaDescription:
        "11.ª edición del Trail Montes Saloios el 15 de febrero de 2026 en Covas de Ferro, Sintra. Trail Largo 31K, Trail Corto 15K, Mini Trail 10K, Caminata 10K. Circuito AAL.",
      description: `# ⛰️ XI Trail Montes Saloios 2026

El **XI Trail Montes Saloios** es una prueba organizada por el **Motoclube TT Montes Saloios** y la **Liga dos Amigos de Covas de Ferro**, con el apoyo de la **Associação Faz-te aos Trilhos!**. Se celebra el **15 de febrero de 2026** en el encantador pueblo de **Covas de Ferro**, en Almargem do Bispo, Sintra.

## 📅 Fecha y Lugar

- **Fecha:** 15 de febrero de 2026 (Domingo)
- **Hora de Salida:** 09:00
- **Lugar:** Pabellón Deportivo de la Liga dos Amigos de Covas de Ferro
- **Localidad:** Covas de Ferro, Almargem do Bispo, Sintra
- **Distrito:** Lisboa

## 🏃‍♀️ Pruebas y Distancias

| Prueba | Distancia | Desnivel | Tiempo Límite |
|--------|-----------|----------|---------------|
| **Trail Largo** | 31 km | 1300 D+ | 7h |
| **Trail Corto** | 15 km | 780 D+ | 6h30 |
| **Mini Trail** | 10 km | 500 D+ | 6h15 |
| **Caminata** | 10 km | 500 D+ | 6h15 |

## 🏆 Circuitos

El **Trail Largo** y el **Trail Corto** forman parte del **Circuito de Trail de la Asociación de Atletismo de Lisboa**.

## 💕 Prueba Especial: Amor en los Montes

¡Un tributo a todas las parejas que quieran celebrar San Valentín! La clasificación se hace por la suma de los tiempos de la pareja. Premio especial para las 3 primeras parejas en las distancias de 31K y 15K.

## 🎁 La Inscripción Incluye

- ✅ Camiseta del evento (técnica o algodón)
- ✅ Seguro de accidentes personales
- ✅ Avituallamientos sólidos y líquidos
- ✅ Premio finisher
- ✅ Baños de crioterapia
- ✅ Sopa + bocadillo de cerdo
- ✅ Fiesta de Carnaval
- ✅ ¡Licor de cereza! 🍒
- ✅ Posibilidad de ganar vouchers de Hoteles Vila Galé
- ✅ ¡1 lechón para el equipo más numeroso!

## 🎒 Material Obligatorio

- ✅ Dorsal visible
- ✅ Teléfono móvil con carga
- ✅ Vaso o recipiente para líquidos
- ✅ Silbato
- ✅ Manta de supervivencia
- ✅ ¡Buen humor!

**Penalización:** 15 minutos al tiempo final por cada elemento que falte.

## 📞 Contactos

- **Teléfonos:** +351 918 322 288 | +351 962 934 554
- **Email:** montessaloios@fazteaostrilhos.pt
- **Web:** https://fazteaostrilhos.pt/

---

**⛰️ ¡Los Montes Saloios están de vuelta, más fuertes que nunca! Are you ready again?**`,
    },
    {
      language: "fr",
      title: "XI Trail Montes Saloios",
      city: "Covas de Ferro",
      metaTitle: "XI Trail Montes Saloios 2026 | Sintra | 15 Février",
      metaDescription:
        "11e édition du Trail Montes Saloios le 15 février 2026 à Covas de Ferro, Sintra. Trail Long 31 km, Trail Court 15 km, Mini Trail 10 km, Marche 10 km. Circuit AAL.",
      description: `# ⛰️ XI Trail Montes Saloios 2026

Le **XI Trail Montes Saloios** est une épreuve organisée par le **Motoclube TT Montes Saloios** et la **Liga dos Amigos de Covas de Ferro**, avec le soutien de l'**Associação Faz-te aos Trilhos!**. Il se déroule le **15 février 2026** dans le charmant village de **Covas de Ferro**, à Almargem do Bispo, Sintra.

## 📅 Date et Lieu

- **Date :** 15 février 2026 (Dimanche)
- **Heure de Départ :** 09h00
- **Lieu :** Pavillon Sportif de la Liga dos Amigos de Covas de Ferro
- **Village :** Covas de Ferro, Almargem do Bispo, Sintra
- **District :** Lisbonne

## 🏃‍♀️ Courses et Distances

| Course | Distance | Dénivelé | Temps Limite |
|--------|----------|----------|--------------|
| **Trail Long** | 31 km | 1300 D+ | 7h |
| **Trail Court** | 15 km | 780 D+ | 6h30 |
| **Mini Trail** | 10 km | 500 D+ | 6h15 |
| **Marche** | 10 km | 500 D+ | 6h15 |

## 🏆 Circuits

Le **Trail Long** et le **Trail Court** font partie du **Circuit de Trail de l'Association d'Athlétisme de Lisbonne**.

## 💕 Épreuve Spéciale : Amour dans les Montagnes

Un hommage à tous les couples qui veulent fêter la Saint-Valentin ! Le classement est établi par la somme des temps du couple. Prix spécial pour les 3 premiers couples sur les distances de 31 km et 15 km.

## 🎁 L'Inscription Comprend

- ✅ T-shirt de l'événement (technique ou coton)
- ✅ Assurance accidents personnels
- ✅ Ravitaillements solides et liquides
- ✅ Prix finisher
- ✅ Bains de cryothérapie
- ✅ Soupe + sandwich au porc
- ✅ Fête de Carnaval
- ✅ Liqueur de cerise ! 🍒
- ✅ Chance de gagner des vouchers Hôtels Vila Galé
- ✅ 1 cochon rôti pour l'équipe la plus nombreuse !

## 🎒 Matériel Obligatoire

- ✅ Dossard visible
- ✅ Téléphone portable chargé
- ✅ Gobelet ou récipient pour liquides
- ✅ Sifflet
- ✅ Couverture de survie
- ✅ Bonne humeur !

**Pénalité :** 15 minutes ajoutées au temps final pour chaque élément manquant.

## 📞 Contacts

- **Téléphones :** +351 918 322 288 | +351 962 934 554
- **Email :** montessaloios@fazteaostrilhos.pt
- **Site :** https://fazteaostrilhos.pt/

---

**⛰️ Les Montes Saloios sont de retour, plus forts que jamais ! Are you ready again?**`,
    },
    {
      language: "de",
      title: "XI Trail Montes Saloios",
      city: "Covas de Ferro",
      metaTitle: "XI Trail Montes Saloios 2026 | Sintra | 15. Februar",
      metaDescription:
        "11. Ausgabe des Trail Montes Saloios am 15. Februar 2026 in Covas de Ferro, Sintra. Langstrecke 31 km, Kurzstrecke 15 km, Mini Trail 10 km, Wanderung 10 km. AAL-Zirkus.",
      description: `# ⛰️ XI Trail Montes Saloios 2026

Der **XI Trail Montes Saloios** ist ein Rennen, das vom **Motoclube TT Montes Saloios** und der **Liga dos Amigos de Covas de Ferro** mit Unterstützung der **Associação Faz-te aos Trilhos!** organisiert wird. Es findet am **15. Februar 2026** im charmanten Dorf **Covas de Ferro** in Almargem do Bispo, Sintra statt.

## 📅 Datum & Ort

- **Datum:** 15. Februar 2026 (Sonntag)
- **Startzeit:** 09:00
- **Ort:** Sporthalle der Liga dos Amigos de Covas de Ferro
- **Dorf:** Covas de Ferro, Almargem do Bispo, Sintra
- **Bezirk:** Lissabon

## 🏃‍♀️ Rennen & Distanzen

| Rennen | Distanz | Höhenmeter | Zeitlimit |
|--------|---------|------------|-----------|
| **Langstrecke** | 31 km | 1300 D+ | 7h |
| **Kurzstrecke** | 15 km | 780 D+ | 6h30 |
| **Mini Trail** | 10 km | 500 D+ | 6h15 |
| **Wanderung** | 10 km | 500 D+ | 6h15 |

## 🏆 Zirkusse

Die **Langstrecke** und die **Kurzstrecke** sind Teil des **Trail-Zirkus des Lissabonner Leichtathletikverbandes**.

## 💕 Sonderrennen: Liebe in den Bergen

Eine Hommage an alle Paare, die den Valentinstag feiern möchten! Die Klassifizierung erfolgt nach der Summe der Zeiten des Paares. Sonderpreis für die 3 besten Paare auf den Distanzen 31 km und 15 km.

## 🎁 Die Anmeldung Beinhaltet

- ✅ Event-T-Shirt (technisch oder Baumwolle)
- ✅ Unfallversicherung
- ✅ Feste und flüssige Verpflegungsstationen
- ✅ Finisher-Preis
- ✅ Kryotherapie-Bäder
- ✅ Suppe + Schweinefleisch-Sandwich
- ✅ Karnevalsparty
- ✅ Kirschlikör! 🍒
- ✅ Chance auf Vila Galé Hotels Gutscheine
- ✅ 1 Spanferkel für das größte Team!

## 🎒 Pflichtausrüstung

- ✅ Sichtbare Startnummer
- ✅ Aufgeladenes Mobiltelefon
- ✅ Becher oder Behälter für Flüssigkeiten
- ✅ Pfeife
- ✅ Rettungsdecke
- ✅ Gute Laune!

**Strafe:** 15 Minuten zur Endzeit für jeden fehlenden Gegenstand.

## 📞 Kontakte

- **Telefone:** +351 918 322 288 | +351 962 934 554
- **E-Mail:** montessaloios@fazteaostrilhos.pt
- **Website:** https://fazteaostrilhos.pt/

---

**⛰️ Die Montes Saloios sind zurück, stärker als je zuvor! Are you ready again?**`,
    },
    {
      language: "it",
      title: "XI Trail Montes Saloios",
      city: "Covas de Ferro",
      metaTitle: "XI Trail Montes Saloios 2026 | Sintra | 15 Febbraio",
      metaDescription:
        "11ª edizione del Trail Montes Saloios il 15 febbraio 2026 a Covas de Ferro, Sintra. Trail Lungo 31 km, Trail Corto 15 km, Mini Trail 10 km, Camminata 10 km. Circuito AAL.",
      description: `# ⛰️ XI Trail Montes Saloios 2026

L'**XI Trail Montes Saloios** è una gara organizzata dal **Motoclube TT Montes Saloios** e dalla **Liga dos Amigos de Covas de Ferro**, con il supporto dell'**Associação Faz-te aos Trilhos!**. Si svolge il **15 febbraio 2026** nel caratteristico villaggio di **Covas de Ferro**, ad Almargem do Bispo, Sintra.

## 📅 Data e Luogo

- **Data:** 15 febbraio 2026 (Domenica)
- **Ora di Partenza:** 09:00
- **Luogo:** Palazzetto dello Sport della Liga dos Amigos de Covas de Ferro
- **Villaggio:** Covas de Ferro, Almargem do Bispo, Sintra
- **Distretto:** Lisbona

## 🏃‍♀️ Gare e Distanze

| Gara | Distanza | Dislivello | Tempo Limite |
|------|----------|------------|--------------|
| **Trail Lungo** | 31 km | 1300 D+ | 7h |
| **Trail Corto** | 15 km | 780 D+ | 6h30 |
| **Mini Trail** | 10 km | 500 D+ | 6h15 |
| **Camminata** | 10 km | 500 D+ | 6h15 |

## 🏆 Circuiti

Il **Trail Lungo** e il **Trail Corto** fanno parte del **Circuito Trail dell'Associazione di Atletica di Lisbona**.

## 💕 Gara Speciale: Amore sui Monti

Un omaggio a tutte le coppie che vogliono festeggiare San Valentino! La classifica è basata sulla somma dei tempi della coppia. Premio speciale per le prime 3 coppie sulle distanze di 31 km e 15 km.

## 🎁 L'Iscrizione Include

- ✅ T-shirt dell'evento (tecnica o cotone)
- ✅ Assicurazione infortuni
- ✅ Ristori solidi e liquidi
- ✅ Premio finisher
- ✅ Bagni di crioterapia
- ✅ Zuppa + panino con maiale
- ✅ Festa di Carnevale
- ✅ Liquore di ciliegia! 🍒
- ✅ Possibilità di vincere voucher Hotel Vila Galé
- ✅ 1 maialino arrosto per la squadra più numerosa!

## 🎒 Materiale Obbligatorio

- ✅ Pettorale visibile
- ✅ Telefono cellulare carico
- ✅ Bicchiere o contenitore per liquidi
- ✅ Fischietto
- ✅ Coperta di sopravvivenza
- ✅ Buon umore!

**Penalità:** 15 minuti aggiunti al tempo finale per ogni elemento mancante.

## 📞 Contatti

- **Telefoni:** +351 918 322 288 | +351 962 934 554
- **Email:** montessaloios@fazteaostrilhos.pt
- **Sito:** https://fazteaostrilhos.pt/

---

**⛰️ I Montes Saloios sono tornati, più forti che mai! Are you ready again?**`,
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
  console.log("🏃‍♀️ Creating event variants...");

  const variants = [
    {
      name: "Trail Longo 31km",
      distanceKm: 31,
      elevationGainM: 1300,
      startTime: "09:00",
      cutoffTimeHours: 7,
      description: "Trail Longo de 31km com 1300m de desnível positivo",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-01T00:00:00.000Z"),
          endDate: new Date("2025-09-30T23:59:59.000Z"),
          price: 22.0,
          currency: "EUR" as const,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-01T00:00:00.000Z"),
          endDate: new Date("2025-12-14T23:59:59.000Z"),
          price: 25.0,
          currency: "EUR" as const,
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-15T00:00:00.000Z"),
          endDate: new Date("2026-02-08T23:59:59.000Z"),
          price: 28.0,
          currency: "EUR" as const,
        },
      ],
      translations: {
        pt: {
          name: "Trail Longo 31km",
          description: "Trail Longo de 31km com 1300m D+",
        },
        en: {
          name: "Long Trail 31km",
          description: "31km Long Trail with 1300m D+",
        },
        es: {
          name: "Trail Largo 31km",
          description: "Trail Largo de 31km con 1300m D+",
        },
        fr: {
          name: "Trail Long 31 km",
          description: "Trail Long de 31 km avec 1300m D+",
        },
        de: {
          name: "Langstrecke 31 km",
          description: "31 km Langstrecke mit 1300m D+",
        },
        it: {
          name: "Trail Lungo 31 km",
          description: "Trail Lungo di 31 km con 1300m D+",
        },
      },
    },
    {
      name: "Trail Curto 15km",
      distanceKm: 15,
      elevationGainM: 780,
      startTime: "09:30",
      cutoffTimeHours: 6.5,
      description: "Trail Curto de 15km com 780m de desnível positivo",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-01T00:00:00.000Z"),
          endDate: new Date("2025-09-30T23:59:59.000Z"),
          price: 20.0,
          currency: "EUR" as const,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-01T00:00:00.000Z"),
          endDate: new Date("2025-12-14T23:59:59.000Z"),
          price: 23.0,
          currency: "EUR" as const,
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-15T00:00:00.000Z"),
          endDate: new Date("2026-02-08T23:59:59.000Z"),
          price: 26.0,
          currency: "EUR" as const,
        },
      ],
      translations: {
        pt: {
          name: "Trail Curto 15km",
          description: "Trail Curto de 15km com 780m D+",
        },
        en: {
          name: "Short Trail 15km",
          description: "15km Short Trail with 780m D+",
        },
        es: {
          name: "Trail Corto 15km",
          description: "Trail Corto de 15km con 780m D+",
        },
        fr: {
          name: "Trail Court 15 km",
          description: "Trail Court de 15 km avec 780m D+",
        },
        de: {
          name: "Kurzstrecke 15 km",
          description: "15 km Kurzstrecke mit 780m D+",
        },
        it: {
          name: "Trail Corto 15 km",
          description: "Trail Corto di 15 km con 780m D+",
        },
      },
    },
    {
      name: "Mini Trail 10km",
      distanceKm: 10,
      elevationGainM: 500,
      startTime: "09:45",
      cutoffTimeHours: 6.25,
      description: "Mini Trail de 10km com 500m de desnível positivo",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-01T00:00:00.000Z"),
          endDate: new Date("2025-09-30T23:59:59.000Z"),
          price: 18.0,
          currency: "EUR" as const,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-01T00:00:00.000Z"),
          endDate: new Date("2025-12-14T23:59:59.000Z"),
          price: 21.0,
          currency: "EUR" as const,
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-15T00:00:00.000Z"),
          endDate: new Date("2026-02-08T23:59:59.000Z"),
          price: 24.0,
          currency: "EUR" as const,
        },
      ],
      translations: {
        pt: {
          name: "Mini Trail 10km",
          description: "Mini Trail de 10km com 500m D+",
        },
        en: {
          name: "Mini Trail 10km",
          description: "10km Mini Trail with 500m D+",
        },
        es: {
          name: "Mini Trail 10km",
          description: "Mini Trail de 10km con 500m D+",
        },
        fr: {
          name: "Mini Trail 10 km",
          description: "Mini Trail de 10 km avec 500m D+",
        },
        de: {
          name: "Mini Trail 10 km",
          description: "10 km Mini Trail mit 500m D+",
        },
        it: {
          name: "Mini Trail 10 km",
          description: "Mini Trail di 10 km con 500m D+",
        },
      },
    },
    {
      name: "Caminhada 10km",
      distanceKm: 10,
      elevationGainM: 500,
      startTime: "09:45",
      cutoffTimeHours: 6.25,
      description: "Caminhada de 10km com 500m de desnível positivo",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-01T00:00:00.000Z"),
          endDate: new Date("2025-09-30T23:59:59.000Z"),
          price: 16.0,
          currency: "EUR" as const,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-01T00:00:00.000Z"),
          endDate: new Date("2025-12-14T23:59:59.000Z"),
          price: 19.0,
          currency: "EUR" as const,
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-15T00:00:00.000Z"),
          endDate: new Date("2026-02-08T23:59:59.000Z"),
          price: 22.0,
          currency: "EUR" as const,
        },
      ],
      translations: {
        pt: {
          name: "Caminhada 10km",
          description: "Caminhada de 10km com 500m D+",
        },
        en: { name: "Walk 10km", description: "10km Walk with 500m D+" },
        es: {
          name: "Caminata 10km",
          description: "Caminata de 10km con 500m D+",
        },
        fr: {
          name: "Marche 10 km",
          description: "Marche de 10 km avec 500m D+",
        },
        de: {
          name: "Wanderung 10 km",
          description: "10 km Wanderung mit 500m D+",
        },
        it: {
          name: "Camminata 10 km",
          description: "Camminata di 10 km con 500m D+",
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
      question: "O que é a prova 'Amor nos Montes'?",
      answer:
        "É um tributo a todos os casais que queiram comemorar o Dia dos Namorados fazendo uma prova juntos. A classificação é feita pelo somatório dos tempos do casal, e há prémios especiais para as 3 primeiras parelhas nas distâncias de 31K e 15K.",
      translations: {
        pt: {
          question: "O que é a prova 'Amor nos Montes'?",
          answer:
            "É um tributo a todos os casais que queiram comemorar o Dia dos Namorados fazendo uma prova juntos. A classificação é feita pelo somatório dos tempos do casal, e há prémios especiais para as 3 primeiras parelhas nas distâncias de 31K e 15K.",
        },
        en: {
          question: "What is the 'Love in the Mountains' race?",
          answer:
            "It's a tribute to all couples who want to celebrate Valentine's Day by racing together. Classification is based on the sum of the couple's times, with special prizes for the top 3 couples in the 31K and 15K distances.",
        },
        es: {
          question: "¿Qué es la prueba 'Amor en los Montes'?",
          answer:
            "Es un tributo a todas las parejas que quieran celebrar San Valentín corriendo juntos. La clasificación se hace por la suma de los tiempos de la pareja, con premios especiales para las 3 primeras parejas en las distancias de 31K y 15K.",
        },
        fr: {
          question: "Qu'est-ce que l'épreuve 'Amour dans les Montagnes' ?",
          answer:
            "C'est un hommage à tous les couples qui veulent fêter la Saint-Valentin en courant ensemble. Le classement est basé sur la somme des temps du couple, avec des prix spéciaux pour les 3 premiers couples sur les distances de 31 km et 15 km.",
        },
        de: {
          question: "Was ist das Rennen 'Liebe in den Bergen'?",
          answer:
            "Es ist eine Hommage an alle Paare, die den Valentinstag gemeinsam laufend feiern möchten. Die Klassifizierung basiert auf der Summe der Zeiten des Paares, mit Sonderpreisen für die Top 3 Paare auf den Distanzen 31 km und 15 km.",
        },
        it: {
          question: "Cos'è la gara 'Amore sui Monti'?",
          answer:
            "È un omaggio a tutte le coppie che vogliono festeggiare San Valentino correndo insieme. La classifica si basa sulla somma dei tempi della coppia, con premi speciali per le prime 3 coppie sulle distanze di 31 km e 15 km.",
        },
      },
    },
    {
      order: 2,
      question: "Qual o material obrigatório?",
      answer:
        "Dorsal visível, telemóvel com carga, copo ou recipiente para líquidos, apito e manta de sobrevivência. Penalização de 15 minutos ao tempo final por cada item em falta.",
      translations: {
        pt: {
          question: "Qual o material obrigatório?",
          answer:
            "Dorsal visível, telemóvel com carga, copo ou recipiente para líquidos, apito e manta de sobrevivência. Penalização de 15 minutos ao tempo final por cada item em falta.",
        },
        en: {
          question: "What is the mandatory equipment?",
          answer:
            "Visible race bib, charged mobile phone, cup or liquid container, whistle, and survival blanket. 15-minute penalty added to final time for each missing item.",
        },
        es: {
          question: "¿Cuál es el material obligatorio?",
          answer:
            "Dorsal visible, teléfono móvil con carga, vaso o recipiente para líquidos, silbato y manta de supervivencia. Penalización de 15 minutos al tiempo final por cada elemento que falte.",
        },
        fr: {
          question: "Quel est le matériel obligatoire ?",
          answer:
            "Dossard visible, téléphone portable chargé, gobelet ou récipient pour liquides, sifflet et couverture de survie. Pénalité de 15 minutes ajoutée au temps final pour chaque élément manquant.",
        },
        de: {
          question: "Welche Ausrüstung ist Pflicht?",
          answer:
            "Sichtbare Startnummer, aufgeladenes Mobiltelefon, Becher oder Behälter für Flüssigkeiten, Pfeife und Rettungsdecke. 15 Minuten Strafe zur Endzeit für jeden fehlenden Gegenstand.",
        },
        it: {
          question: "Qual è il materiale obbligatorio?",
          answer:
            "Pettorale visibile, telefono cellulare carico, bicchiere o contenitore per liquidi, fischietto e coperta di sopravvivenza. Penalità di 15 minuti aggiunta al tempo finale per ogni elemento mancante.",
        },
      },
    },
    {
      order: 3,
      question: "O que está incluído na inscrição?",
      answer:
        "T-shirt alusiva à prova, seguro de acidentes, abastecimentos, prémio finisher, banhos de crioterapia, sopa revigorante + bifana, bailarico de Carnaval e ginjinha!",
      translations: {
        pt: {
          question: "O que está incluído na inscrição?",
          answer:
            "T-shirt alusiva à prova, seguro de acidentes, abastecimentos, prémio finisher, banhos de crioterapia, sopa revigorante + bifana, bailarico de Carnaval e ginjinha!",
        },
        en: {
          question: "What is included in the registration?",
          answer:
            "Event T-shirt, accident insurance, aid stations, finisher prize, cryotherapy baths, soup + pork sandwich, Carnival party, and cherry liqueur!",
        },
        es: {
          question: "¿Qué incluye la inscripción?",
          answer:
            "Camiseta del evento, seguro de accidentes, avituallamientos, premio finisher, baños de crioterapia, sopa + bocadillo de cerdo, fiesta de Carnaval y licor de cereza!",
        },
        fr: {
          question: "Que comprend l'inscription ?",
          answer:
            "T-shirt de l'événement, assurance accidents, ravitaillements, prix finisher, bains de cryothérapie, soupe + sandwich au porc, fête de Carnaval et liqueur de cerise !",
        },
        de: {
          question: "Was ist in der Anmeldung enthalten?",
          answer:
            "Event-T-Shirt, Unfallversicherung, Verpflegungsstationen, Finisher-Preis, Kryotherapie-Bäder, Suppe + Schweinefleisch-Sandwich, Karnevalsparty und Kirschlikör!",
        },
        it: {
          question: "Cosa è incluso nell'iscrizione?",
          answer:
            "T-shirt dell'evento, assicurazione infortuni, ristori, premio finisher, bagni di crioterapia, zuppa + panino con maiale, festa di Carnevale e liquore di ciliegia!",
        },
      },
    },
    {
      order: 4,
      question: "Quais são os tempos limite das provas?",
      answer:
        "Trail Longo 31km: 7 horas (até às 16:00). Trail Curto 15km: 6h30. Mini Trail e Caminhada 10km: 6h15.",
      translations: {
        pt: {
          question: "Quais são os tempos limite das provas?",
          answer:
            "Trail Longo 31km: 7 horas (até às 16:00). Trail Curto 15km: 6h30. Mini Trail e Caminhada 10km: 6h15.",
        },
        en: {
          question: "What are the race time limits?",
          answer:
            "Long Trail 31km: 7 hours (until 16:00). Short Trail 15km: 6h30. Mini Trail and Walk 10km: 6h15.",
        },
        es: {
          question: "¿Cuáles son los tiempos límite de las pruebas?",
          answer:
            "Trail Largo 31km: 7 horas (hasta las 16:00). Trail Corto 15km: 6h30. Mini Trail y Caminata 10km: 6h15.",
        },
        fr: {
          question: "Quels sont les temps limites des courses ?",
          answer:
            "Trail Long 31 km : 7 heures (jusqu'à 16h00). Trail Court 15 km : 6h30. Mini Trail et Marche 10 km : 6h15.",
        },
        de: {
          question: "Was sind die Zeitlimits der Rennen?",
          answer:
            "Langstrecke 31 km: 7 Stunden (bis 16:00). Kurzstrecke 15 km: 6h30. Mini Trail und Wanderung 10 km: 6h15.",
        },
        it: {
          question: "Quali sono i tempi limite delle gare?",
          answer:
            "Trail Lungo 31 km: 7 ore (fino alle 16:00). Trail Corto 15 km: 6h30. Mini Trail e Camminata 10 km: 6h15.",
        },
      },
    },
    {
      order: 5,
      question: "Quando e onde posso levantar o dorsal?",
      answer:
        "Sábado 14 de fevereiro das 14:00 às 20:00, ou domingo 15 de fevereiro das 07:00 às 08:30, no Pavilhão Gimnodesportivo da Liga dos Amigos de Covas de Ferro.",
      translations: {
        pt: {
          question: "Quando e onde posso levantar o dorsal?",
          answer:
            "Sábado 14 de fevereiro das 14:00 às 20:00, ou domingo 15 de fevereiro das 07:00 às 08:30, no Pavilhão Gimnodesportivo da Liga dos Amigos de Covas de Ferro.",
        },
        en: {
          question: "When and where can I pick up my race bib?",
          answer:
            "Saturday February 14 from 14:00 to 20:00, or Sunday February 15 from 07:00 to 08:30, at the Liga dos Amigos de Covas de Ferro Sports Hall.",
        },
        es: {
          question: "¿Cuándo y dónde puedo recoger mi dorsal?",
          answer:
            "Sábado 14 de febrero de 14:00 a 20:00, o domingo 15 de febrero de 07:00 a 08:30, en el Pabellón Deportivo de la Liga dos Amigos de Covas de Ferro.",
        },
        fr: {
          question: "Quand et où puis-je retirer mon dossard ?",
          answer:
            "Samedi 14 février de 14h00 à 20h00, ou dimanche 15 février de 07h00 à 08h30, au Pavillon Sportif de la Liga dos Amigos de Covas de Ferro.",
        },
        de: {
          question: "Wann und wo kann ich meine Startnummer abholen?",
          answer:
            "Samstag, 14. Februar von 14:00 bis 20:00, oder Sonntag, 15. Februar von 07:00 bis 08:30, in der Sporthalle der Liga dos Amigos de Covas de Ferro.",
        },
        it: {
          question: "Quando e dove posso ritirare il mio pettorale?",
          answer:
            "Sabato 14 febbraio dalle 14:00 alle 20:00, o domenica 15 febbraio dalle 07:00 alle 08:30, presso il Palazzetto dello Sport della Liga dos Amigos de Covas de Ferro.",
        },
      },
    },
  ];

  for (const faqData of faqs) {
    const { translations: faqTranslations, ...faqInfo } = faqData;

    const faq = await prisma.eventFAQ.create({
      data: {
        ...faqInfo,
        eventId: event.id,
      },
    });

    // Create FAQ translations
    for (const [lang, trans] of Object.entries(faqTranslations)) {
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

  console.log("\n🎉 XI Trail Montes Saloios 2026 seeded successfully!");
  console.log(`   📍 Event: ${event.title}`);
  console.log(`   🔗 Slug: ${event.slug}`);
  console.log(`   📅 Date: ${event.startDate.toISOString().split("T")[0]}`);
  console.log(`   📍 Location: ${event.city}, ${event.country}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding XI Trail Montes Saloios 2026:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
