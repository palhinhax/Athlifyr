/**
 * Seed: 13ª Trilhos do Paleozóico 2026
 * Complete with translations in all 6 languages
 * Location: Valongo, Portugal
 * Date: March 8, 2026
 */

import { PrismaClient, SportType, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🦴 Seeding 13ª Trilhos do Paleozóico 2026...");

  const eventSlug = "trilhos-paleozoico-2026";

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
      title: "13ª Trilhos do Paleozóico",
      description:
        "13.ª edição dos Trilhos do Paleozóico em Valongo. Trail Ultra 48km, Trail 38km, Trail Sprint 23km, Mini Trail 12km e Caminhada 12km no Parque Paleozóico de Valongo.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-08T08:00:00.000Z"),
      endDate: new Date("2026-03-08T18:00:00.000Z"),
      city: "Valongo",
      country: "Portugal",
      latitude: 41.1903,
      longitude: -8.4985,
      googleMapsUrl: "https://maps.app.goo.gl/L1jxkwjfWCBKftFj7",
      externalUrl: "https://stopandgo.net/events/trilhos-do-paleozoico-2026/",
      imageUrl: null,
      isFeatured: false,
      registrationDeadline: new Date("2026-02-22T23:59:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "13ª Trilhos do Paleozóico",
      description:
        "13.ª edição dos Trilhos do Paleozóico em Valongo. Trail Ultra 48km, Trail 38km, Trail Sprint 23km, Mini Trail 12km e Caminhada 12km no Parque Paleozóico de Valongo.",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-08T08:00:00.000Z"),
      endDate: new Date("2026-03-08T18:00:00.000Z"),
      city: "Valongo",
      country: "Portugal",
      latitude: 41.1903,
      longitude: -8.4985,
      googleMapsUrl: "https://maps.app.goo.gl/L1jxkwjfWCBKftFj7",
      externalUrl: "https://stopandgo.net/events/trilhos-do-paleozoico-2026/",
      imageUrl: null,
      isFeatured: false,
      registrationDeadline: new Date("2026-02-22T23:59:00.000Z"),
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
      title: "13ª Trilhos do Paleozóico",
      city: "Valongo",
      metaTitle: "13ª Trilhos do Paleozóico 2026 | Valongo, Porto | 8 Março",
      metaDescription:
        "13ª Trilhos do Paleozóico - 8 de março de 2026 em Valongo. Trail Ultra 48km, Trail 38km, Trail Sprint 23km, Mini Trail 12km e Caminhada 12km. Circuito Trilhos de Valongo.",
      description: `# 🦴 13ª Trilhos do Paleozóico 2026

A **13ª edição dos Trilhos do Paleozóico** realiza-se no dia **8 de março de 2026**, em Valongo, dentro do **Parque Paleozóico de Valongo** e do **Centro de Trail de Valongo**.

## 📅 Data e Local

- **Data:** 8 de março de 2026 (Domingo)
- **Local:** Largo do Centenário (centro de Valongo)
- **Concelho:** Valongo
- **Distrito:** Porto

## 🏃 Provas e Distâncias

| Prova | Distância | Desnível+ | Hora Partida | Tempo Limite |
|-------|-----------|-----------|--------------|--------------|
| **Ultra Trilhos Paleozóico (UTP)** | 48 km | ±2600m | 08:00 | 10h |
| **Trilhos Paleozóico (TP)** | 38 km | ±2000m | 08:00 | 10h |
| **Trail Sprint (MTP)** | 23 km | ±1150m | 09:00 | 10h |
| **Mini Trail** | 12 km | ±300m | 09:30 | 5h |
| **Caminhada** | 12 km | ±300m | 09:35 | 5h |

As provas de **12km e 23km** estão integradas no **Circuito Trilhos de Valongo**.

## 🏔️ Classificação ATRP/ITRA

- **Trail Ultra 48km:** TU – M / Grau 3
- **Trail Sprint 23km:** TL / Grau 2
- **Mini Trail 12km:** TC / Grau 2

## 🚩 Barreiras Horárias

- **Trail Ultra 48km e Trail 38km:** Abastecimento de Pias (±25km) - limite 5h
- **Trail Ultra 48km:** Ponte S. Simão (±39km) - limite 8h

## 🎒 Material Obrigatório

- ✅ Telemóvel totalmente operacional
- ✅ Apito
- ✅ Manta térmica
- ✅ Depósito de água (não são fornecidos copos)

**Recomendado:** bastões, camelbak, corta-vento, chapéu ou gorro.

## 🍽️ Locais de Abastecimento

### Trail Ultra 48km
- Aldeia de Couce 1 - sólido/líquido
- Pias - sólido/líquido
- Bustelo - sólido/líquido
- Aldeia de Couce 2 - sólido/líquido

### Trail 38km
- Aldeia de Couce 1 - sólido/líquido
- Pias - sólido/líquido
- Aldeia de Couce 2 - sólido/líquido

### Trail Sprint 23km
- Aldeia de Couce 1 - sólido/líquido
- Aldeia de Couce 2 - sólido/líquido

### Mini Trail e Caminhada 12km
- Aldeia de Couce - líquido/sólido

## 🎁 A Inscrição Inclui

- ✅ Dorsal personalizado (inscrições até 22/02)
- ✅ Seguro de acidentes pessoais
- ✅ Abastecimentos durante a prova
- ✅ T-shirt técnica de alta qualidade
- ✅ Prémio Finisher (medalha)
- ✅ Banhos nas Piscinas de Valongo (11h30-18h)

*As primeiras 900 inscrições pagas recebem uma forma para bolos (oferta A Metalúrgica Bakeware).*

## 📍 Secretariado

**Local:** Junta de Freguesia de Valongo
**Coordenadas GPS:** 41.190187, -8.499112

**Horários:**
- **7 de março (Sábado):** 10h-13h / 14h30-18h
- **8 de março (Domingo):** 06h30-09h

## 🏨 Onde Ficar

**Park Hotel de Valongo** - Mencionar a inscrição nos Trilhos do Paleozóico para desconto especial.
Website: www.parkhotel.pt

## 📞 Contactos

- **Email:** paleozoico@retorta.com
- **Facebook:** facebook.com/trilhopaleozoico

## 🏢 Organização

- **Organização:** Grupo Dramático e Recreativo da Retorta
- **Co-organização:** Câmara Municipal de Valongo
- **Diretor Técnico:** Luís Pereira

---

**🦴 Trilhos do Paleozóico - Valongo 2026!**`,
    },
    {
      language: "en",
      title: "13th Trilhos do Paleozóico",
      city: "Valongo",
      metaTitle: "13th Trilhos do Paleozóico 2026 | Valongo, Porto | March 8",
      metaDescription:
        "13th Trilhos do Paleozóico - March 8, 2026 in Valongo. Trail Ultra 48km, Trail 38km, Trail Sprint 23km, Mini Trail 12km and Walk 12km. Valongo Trail Circuit.",
      description: `# 🦴 13th Trilhos do Paleozóico 2026

The **13th edition of Trilhos do Paleozóico** takes place on **March 8, 2026**, in Valongo, within the **Paleozoic Park of Valongo** and the **Valongo Trail Center**.

## 📅 Date and Location

- **Date:** March 8, 2026 (Sunday)
- **Location:** Largo do Centenário (Valongo center)
- **Municipality:** Valongo
- **District:** Porto

## 🏃 Races and Distances

| Race | Distance | Elevation+ | Start Time | Time Limit |
|------|----------|------------|------------|------------|
| **Ultra Trilhos Paleozóico (UTP)** | 48 km | ±2600m | 08:00 | 10h |
| **Trilhos Paleozóico (TP)** | 38 km | ±2000m | 08:00 | 10h |
| **Trail Sprint (MTP)** | 23 km | ±1150m | 09:00 | 10h |
| **Mini Trail** | 12 km | ±300m | 09:30 | 5h |
| **Walk** | 12 km | ±300m | 09:35 | 5h |

The **12km and 23km races** are part of the **Valongo Trail Circuit**.

## 🏔️ ATRP/ITRA Classification

- **Trail Ultra 48km:** TU – M / Grade 3
- **Trail Sprint 23km:** TL / Grade 2
- **Mini Trail 12km:** TC / Grade 2

## 🚩 Time Barriers

- **Trail Ultra 48km and Trail 38km:** Pias aid station (±25km) - limit 5h
- **Trail Ultra 48km:** Ponte S. Simão (±39km) - limit 8h

## 🎒 Mandatory Equipment

- ✅ Fully operational mobile phone
- ✅ Whistle
- ✅ Thermal blanket
- ✅ Water container (cups not provided)

**Recommended:** poles, hydration pack, windbreaker, hat or cap.

## 🍽️ Aid Station Locations

### Trail Ultra 48km
- Aldeia de Couce 1 - solid/liquid
- Pias - solid/liquid
- Bustelo - solid/liquid
- Aldeia de Couce 2 - solid/liquid

### Trail 38km
- Aldeia de Couce 1 - solid/liquid
- Pias - solid/liquid
- Aldeia de Couce 2 - solid/liquid

### Trail Sprint 23km
- Aldeia de Couce 1 - solid/liquid
- Aldeia de Couce 2 - solid/liquid

### Mini Trail and Walk 12km
- Aldeia de Couce - liquid/solid

## 🎁 Registration Includes

- ✅ Personalized bib (registrations until Feb 22)
- ✅ Personal accident insurance
- ✅ Aid stations during the race
- ✅ High-quality technical T-shirt
- ✅ Finisher prize (medal)
- ✅ Showers at Valongo Swimming Pools (11:30 AM - 6 PM)

*First 900 paid registrations receive a baking mold (gift from A Metalúrgica Bakeware).*

## 📍 Secretariat

**Location:** Junta de Freguesia de Valongo
**GPS Coordinates:** 41.190187, -8.499112

**Hours:**
- **March 7 (Saturday):** 10 AM - 1 PM / 2:30 PM - 6 PM
- **March 8 (Sunday):** 6:30 AM - 9 AM

## 🏨 Where to Stay

**Park Hotel de Valongo** - Mention your Trilhos do Paleozóico registration for a special discount.
Website: www.parkhotel.pt

## 📞 Contacts

- **Email:** paleozoico@retorta.com
- **Facebook:** facebook.com/trilhopaleozoico

## 🏢 Organization

- **Organization:** Grupo Dramático e Recreativo da Retorta
- **Co-organization:** Valongo City Council
- **Technical Director:** Luís Pereira

---

**🦴 Trilhos do Paleozóico - Valongo 2026!**`,
    },
    {
      language: "es",
      title: "13ª Trilhos do Paleozóico",
      city: "Valongo",
      metaTitle: "13ª Trilhos do Paleozóico 2026 | Valongo, Oporto | 8 Marzo",
      metaDescription:
        "13ª Trilhos do Paleozóico - 8 de marzo de 2026 en Valongo. Trail Ultra 48km, Trail 38km, Trail Sprint 23km, Mini Trail 12km y Caminata 12km. Circuito Trilhos de Valongo.",
      description: `# 🦴 13ª Trilhos do Paleozóico 2026

La **13ª edición de Trilhos do Paleozóico** se celebra el **8 de marzo de 2026**, en Valongo, dentro del **Parque Paleozóico de Valongo** y el **Centro de Trail de Valongo**.

## 📅 Fecha y Lugar

- **Fecha:** 8 de marzo de 2026 (Domingo)
- **Lugar:** Largo do Centenário (centro de Valongo)
- **Municipio:** Valongo
- **Distrito:** Oporto

## 🏃 Pruebas y Distancias

| Prueba | Distancia | Desnivel+ | Hora Salida | Tiempo Límite |
|--------|-----------|-----------|-------------|---------------|
| **Ultra Trilhos Paleozóico (UTP)** | 48 km | ±2600m | 08:00 | 10h |
| **Trilhos Paleozóico (TP)** | 38 km | ±2000m | 08:00 | 10h |
| **Trail Sprint (MTP)** | 23 km | ±1150m | 09:00 | 10h |
| **Mini Trail** | 12 km | ±300m | 09:30 | 5h |
| **Caminata** | 12 km | ±300m | 09:35 | 5h |

Las pruebas de **12km y 23km** están integradas en el **Circuito Trilhos de Valongo**.

## 🏔️ Clasificación ATRP/ITRA

- **Trail Ultra 48km:** TU – M / Grado 3
- **Trail Sprint 23km:** TL / Grado 2
- **Mini Trail 12km:** TC / Grado 2

## 🚩 Barreras Horarias

- **Trail Ultra 48km y Trail 38km:** Avituallamiento de Pias (±25km) - límite 5h
- **Trail Ultra 48km:** Ponte S. Simão (±39km) - límite 8h

## 🎒 Material Obligatorio

- ✅ Teléfono móvil totalmente operativo
- ✅ Silbato
- ✅ Manta térmica
- ✅ Depósito de agua (no se proporcionan vasos)

**Recomendado:** bastones, mochila de hidratación, cortavientos, gorro.

## 🍽️ Puntos de Avituallamiento

### Trail Ultra 48km
- Aldeia de Couce 1 - sólido/líquido
- Pias - sólido/líquido
- Bustelo - sólido/líquido
- Aldeia de Couce 2 - sólido/líquido

### Trail 38km
- Aldeia de Couce 1 - sólido/líquido
- Pias - sólido/líquido
- Aldeia de Couce 2 - sólido/líquido

### Trail Sprint 23km
- Aldeia de Couce 1 - sólido/líquido
- Aldeia de Couce 2 - sólido/líquido

### Mini Trail y Caminata 12km
- Aldeia de Couce - líquido/sólido

## 🎁 La Inscripción Incluye

- ✅ Dorsal personalizado (inscripciones hasta 22/02)
- ✅ Seguro de accidentes personales
- ✅ Avituallamientos durante la prueba
- ✅ Camiseta técnica de alta calidad
- ✅ Premio Finisher (medalla)
- ✅ Duchas en las Piscinas de Valongo (11:30-18h)

*Las primeras 900 inscripciones pagadas reciben un molde para pasteles (regalo de A Metalúrgica Bakeware).*

## 📍 Secretariado

**Lugar:** Junta de Freguesia de Valongo
**Coordenadas GPS:** 41.190187, -8.499112

**Horarios:**
- **7 de marzo (Sábado):** 10h-13h / 14h30-18h
- **8 de marzo (Domingo):** 06h30-09h

## 🏨 Dónde Alojarse

**Park Hotel de Valongo** - Mencionar la inscripción en Trilhos do Paleozóico para descuento especial.
Website: www.parkhotel.pt

## 📞 Contactos

- **Email:** paleozoico@retorta.com
- **Facebook:** facebook.com/trilhopaleozoico

## 🏢 Organización

- **Organización:** Grupo Dramático e Recreativo da Retorta
- **Co-organización:** Ayuntamiento de Valongo
- **Director Técnico:** Luís Pereira

---

**🦴 Trilhos do Paleozóico - Valongo 2026!**`,
    },
    {
      language: "fr",
      title: "13ème Trilhos do Paleozóico",
      city: "Valongo",
      metaTitle: "13ème Trilhos do Paleozóico 2026 | Valongo, Porto | 8 Mars",
      metaDescription:
        "13ème Trilhos do Paleozóico - 8 mars 2026 à Valongo. Trail Ultra 48km, Trail 38km, Trail Sprint 23km, Mini Trail 12km et Marche 12km. Circuit Trilhos de Valongo.",
      description: `# 🦴 13ème Trilhos do Paleozóico 2026

La **13ème édition de Trilhos do Paleozóico** se déroule le **8 mars 2026**, à Valongo, dans le **Parc Paléozoïque de Valongo** et le **Centre de Trail de Valongo**.

## 📅 Date et Lieu

- **Date:** 8 mars 2026 (Dimanche)
- **Lieu:** Largo do Centenário (centre de Valongo)
- **Municipalité:** Valongo
- **District:** Porto

## 🏃 Épreuves et Distances

| Épreuve | Distance | Dénivelé+ | Heure Départ | Temps Limite |
|---------|----------|-----------|--------------|--------------|
| **Ultra Trilhos Paleozóico (UTP)** | 48 km | ±2600m | 08:00 | 10h |
| **Trilhos Paleozóico (TP)** | 38 km | ±2000m | 08:00 | 10h |
| **Trail Sprint (MTP)** | 23 km | ±1150m | 09:00 | 10h |
| **Mini Trail** | 12 km | ±300m | 09:30 | 5h |
| **Marche** | 12 km | ±300m | 09:35 | 5h |

Les épreuves de **12km et 23km** font partie du **Circuit Trilhos de Valongo**.

## 🏔️ Classification ATRP/ITRA

- **Trail Ultra 48km:** TU – M / Grade 3
- **Trail Sprint 23km:** TL / Grade 2
- **Mini Trail 12km:** TC / Grade 2

## 🚩 Barrières Horaires

- **Trail Ultra 48km et Trail 38km:** Ravitaillement de Pias (±25km) - limite 5h
- **Trail Ultra 48km:** Ponte S. Simão (±39km) - limite 8h

## 🎒 Matériel Obligatoire

- ✅ Téléphone portable entièrement opérationnel
- ✅ Sifflet
- ✅ Couverture de survie
- ✅ Réservoir d'eau (gobelets non fournis)

**Recommandé:** bâtons, sac d'hydratation, coupe-vent, chapeau ou casquette.

## 🍽️ Points de Ravitaillement

### Trail Ultra 48km
- Aldeia de Couce 1 - solide/liquide
- Pias - solide/liquide
- Bustelo - solide/liquide
- Aldeia de Couce 2 - solide/liquide

### Trail 38km
- Aldeia de Couce 1 - solide/liquide
- Pias - solide/liquide
- Aldeia de Couce 2 - solide/liquide

### Trail Sprint 23km
- Aldeia de Couce 1 - solide/liquide
- Aldeia de Couce 2 - solide/liquide

### Mini Trail et Marche 12km
- Aldeia de Couce - liquide/solide

## 🎁 L'Inscription Comprend

- ✅ Dossard personnalisé (inscriptions jusqu'au 22/02)
- ✅ Assurance accidents personnels
- ✅ Ravitaillements pendant la course
- ✅ T-shirt technique haute qualité
- ✅ Prix Finisher (médaille)
- ✅ Douches aux Piscines de Valongo (11h30-18h)

*Les 900 premières inscriptions payées reçoivent un moule à gâteau (cadeau de A Metalúrgica Bakeware).*

## 📍 Secrétariat

**Lieu:** Junta de Freguesia de Valongo
**Coordonnées GPS:** 41.190187, -8.499112

**Horaires:**
- **7 mars (Samedi):** 10h-13h / 14h30-18h
- **8 mars (Dimanche):** 06h30-09h

## 🏨 Où Loger

**Park Hotel de Valongo** - Mentionnez votre inscription aux Trilhos do Paleozóico pour une réduction spéciale.
Website: www.parkhotel.pt

## 📞 Contacts

- **Email:** paleozoico@retorta.com
- **Facebook:** facebook.com/trilhopaleozoico

## 🏢 Organisation

- **Organisation:** Grupo Dramático e Recreativo da Retorta
- **Co-organisation:** Mairie de Valongo
- **Directeur Technique:** Luís Pereira

---

**🦴 Trilhos do Paleozóico - Valongo 2026!**`,
    },
    {
      language: "de",
      title: "13. Trilhos do Paleozóico",
      city: "Valongo",
      metaTitle: "13. Trilhos do Paleozóico 2026 | Valongo, Porto | 8. März",
      metaDescription:
        "13. Trilhos do Paleozóico - 8. März 2026 in Valongo. Trail Ultra 48km, Trail 38km, Trail Sprint 23km, Mini Trail 12km und Wanderung 12km. Valongo Trail Circuit.",
      description: `# 🦴 13. Trilhos do Paleozóico 2026

Die **13. Ausgabe von Trilhos do Paleozóico** findet am **8. März 2026** in Valongo statt, im **Paläozoischen Park von Valongo** und dem **Valongo Trail Center**.

## 📅 Datum und Ort

- **Datum:** 8. März 2026 (Sonntag)
- **Ort:** Largo do Centenário (Zentrum von Valongo)
- **Gemeinde:** Valongo
- **Bezirk:** Porto

## 🏃 Rennen und Distanzen

| Rennen | Distanz | Höhenmeter+ | Startzeit | Zeitlimit |
|--------|---------|-------------|-----------|-----------|
| **Ultra Trilhos Paleozóico (UTP)** | 48 km | ±2600m | 08:00 | 10h |
| **Trilhos Paleozóico (TP)** | 38 km | ±2000m | 08:00 | 10h |
| **Trail Sprint (MTP)** | 23 km | ±1150m | 09:00 | 10h |
| **Mini Trail** | 12 km | ±300m | 09:30 | 5h |
| **Wanderung** | 12 km | ±300m | 09:35 | 5h |

Die **12km und 23km Rennen** sind Teil des **Valongo Trail Circuit**.

## 🏔️ ATRP/ITRA Klassifizierung

- **Trail Ultra 48km:** TU – M / Grad 3
- **Trail Sprint 23km:** TL / Grad 2
- **Mini Trail 12km:** TC / Grad 2

## 🚩 Zeitbarrieren

- **Trail Ultra 48km und Trail 38km:** Verpflegung Pias (±25km) - Limit 5h
- **Trail Ultra 48km:** Ponte S. Simão (±39km) - Limit 8h

## 🎒 Pflichtausrüstung

- ✅ Voll funktionsfähiges Mobiltelefon
- ✅ Pfeife
- ✅ Rettungsdecke
- ✅ Wasserbehälter (keine Becher bereitgestellt)

**Empfohlen:** Stöcke, Trinkrucksack, Windjacke, Hut oder Mütze.

## 🍽️ Verpflegungspunkte

### Trail Ultra 48km
- Aldeia de Couce 1 - fest/flüssig
- Pias - fest/flüssig
- Bustelo - fest/flüssig
- Aldeia de Couce 2 - fest/flüssig

### Trail 38km
- Aldeia de Couce 1 - fest/flüssig
- Pias - fest/flüssig
- Aldeia de Couce 2 - fest/flüssig

### Trail Sprint 23km
- Aldeia de Couce 1 - fest/flüssig
- Aldeia de Couce 2 - fest/flüssig

### Mini Trail und Wanderung 12km
- Aldeia de Couce - flüssig/fest

## 🎁 Die Anmeldung Beinhaltet

- ✅ Personalisierte Startnummer (Anmeldungen bis 22.02.)
- ✅ Persönliche Unfallversicherung
- ✅ Verpflegungsstationen während des Rennens
- ✅ Hochwertiges technisches T-Shirt
- ✅ Finisher-Preis (Medaille)
- ✅ Duschen im Valongo Schwimmbad (11:30-18 Uhr)

*Die ersten 900 bezahlten Anmeldungen erhalten eine Backform (Geschenk von A Metalúrgica Bakeware).*

## 📍 Sekretariat

**Ort:** Junta de Freguesia de Valongo
**GPS-Koordinaten:** 41.190187, -8.499112

**Öffnungszeiten:**
- **7. März (Samstag):** 10-13 Uhr / 14:30-18 Uhr
- **8. März (Sonntag):** 06:30-09 Uhr

## 🏨 Unterkunft

**Park Hotel de Valongo** - Erwähnen Sie Ihre Anmeldung bei Trilhos do Paleozóico für einen Sonderrabatt.
Website: www.parkhotel.pt

## 📞 Kontakte

- **E-Mail:** paleozoico@retorta.com
- **Facebook:** facebook.com/trilhopaleozoico

## 🏢 Organisation

- **Organisation:** Grupo Dramático e Recreativo da Retorta
- **Mitorganisation:** Stadtverwaltung Valongo
- **Technischer Direktor:** Luís Pereira

---

**🦴 Trilhos do Paleozóico - Valongo 2026!**`,
    },
    {
      language: "it",
      title: "13° Trilhos do Paleozóico",
      city: "Valongo",
      metaTitle: "13° Trilhos do Paleozóico 2026 | Valongo, Porto | 8 Marzo",
      metaDescription:
        "13° Trilhos do Paleozóico - 8 marzo 2026 a Valongo. Trail Ultra 48km, Trail 38km, Trail Sprint 23km, Mini Trail 12km e Camminata 12km. Circuito Trilhos de Valongo.",
      description: `# 🦴 13° Trilhos do Paleozóico 2026

La **13ª edizione di Trilhos do Paleozóico** si svolge l'**8 marzo 2026**, a Valongo, all'interno del **Parco Paleozoico di Valongo** e del **Centro Trail di Valongo**.

## 📅 Data e Luogo

- **Data:** 8 marzo 2026 (Domenica)
- **Luogo:** Largo do Centenário (centro di Valongo)
- **Comune:** Valongo
- **Distretto:** Porto

## 🏃 Gare e Distanze

| Gara | Distanza | Dislivello+ | Ora Partenza | Tempo Limite |
|------|----------|-------------|--------------|--------------|
| **Ultra Trilhos Paleozóico (UTP)** | 48 km | ±2600m | 08:00 | 10h |
| **Trilhos Paleozóico (TP)** | 38 km | ±2000m | 08:00 | 10h |
| **Trail Sprint (MTP)** | 23 km | ±1150m | 09:00 | 10h |
| **Mini Trail** | 12 km | ±300m | 09:30 | 5h |
| **Camminata** | 12 km | ±300m | 09:35 | 5h |

Le gare di **12km e 23km** fanno parte del **Circuito Trilhos de Valongo**.

## 🏔️ Classificazione ATRP/ITRA

- **Trail Ultra 48km:** TU – M / Grado 3
- **Trail Sprint 23km:** TL / Grado 2
- **Mini Trail 12km:** TC / Grado 2

## 🚩 Barriere Orarie

- **Trail Ultra 48km e Trail 38km:** Ristoro Pias (±25km) - limite 5h
- **Trail Ultra 48km:** Ponte S. Simão (±39km) - limite 8h

## 🎒 Materiale Obbligatorio

- ✅ Telefono cellulare completamente operativo
- ✅ Fischietto
- ✅ Coperta termica
- ✅ Contenitore d'acqua (bicchieri non forniti)

**Consigliato:** bastoncini, zaino di idratazione, giacca a vento, cappello.

## 🍽️ Punti di Ristoro

### Trail Ultra 48km
- Aldeia de Couce 1 - solido/liquido
- Pias - solido/liquido
- Bustelo - solido/liquido
- Aldeia de Couce 2 - solido/liquido

### Trail 38km
- Aldeia de Couce 1 - solido/liquido
- Pias - solido/liquido
- Aldeia de Couce 2 - solido/liquido

### Trail Sprint 23km
- Aldeia de Couce 1 - solido/liquido
- Aldeia de Couce 2 - solido/liquido

### Mini Trail e Camminata 12km
- Aldeia de Couce - liquido/solido

## 🎁 L'Iscrizione Include

- ✅ Pettorale personalizzato (iscrizioni fino al 22/02)
- ✅ Assicurazione infortuni personali
- ✅ Punti di ristoro durante la gara
- ✅ T-shirt tecnica di alta qualità
- ✅ Premio Finisher (medaglia)
- ✅ Docce alle Piscine di Valongo (11:30-18)

*Le prime 900 iscrizioni pagate ricevono uno stampo per dolci (regalo di A Metalúrgica Bakeware).*

## 📍 Segreteria

**Luogo:** Junta de Freguesia de Valongo
**Coordinate GPS:** 41.190187, -8.499112

**Orari:**
- **7 marzo (Sabato):** 10-13 / 14:30-18
- **8 marzo (Domenica):** 06:30-09

## 🏨 Dove Alloggiare

**Park Hotel de Valongo** - Menziona la tua iscrizione a Trilhos do Paleozóico per uno sconto speciale.
Website: www.parkhotel.pt

## 📞 Contatti

- **Email:** paleozoico@retorta.com
- **Facebook:** facebook.com/trilhopaleozoico

## 🏢 Organizzazione

- **Organizzazione:** Grupo Dramático e Recreativo da Retorta
- **Co-organizzazione:** Comune di Valongo
- **Direttore Tecnico:** Luís Pereira

---

**🦴 Trilhos do Paleozóico - Valongo 2026!**`,
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
  console.log("🏃 Creating event variants...");

  const variants = [
    {
      name: "Ultra Trilhos Paleozóico (UTP)",
      distanceKm: 48,
      elevationGainM: 2600,
      elevationLossM: 2600,
      startTime: "08:00",
      cutoffTimeHours: 10,
      itraPoints: null,
      atrpGrade: 3,
      mountainLevel: 2,
      description:
        "Trail Ultra de 48km com ±2600m de desnível positivo - TU-M / Grau 3",
      pricingPhases: [
        {
          name: "Fase Promocional",
          startDate: new Date("2025-09-26T00:00:00.000Z"),
          endDate: new Date("2025-10-04T23:59:59.000Z"),
          price: 38.0,
          currency: Currency.EUR,
        },
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-05T00:00:00.000Z"),
          endDate: new Date("2026-01-15T23:59:59.000Z"),
          price: 40.0,
          currency: Currency.EUR,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-16T00:00:00.000Z"),
          endDate: new Date("2026-02-22T23:59:59.000Z"),
          price: 43.0,
          currency: Currency.EUR,
        },
      ],
      translations: {
        pt: {
          name: "Ultra Trilhos Paleozóico (UTP)",
          description:
            "Trail Ultra de 48km com ±2600m de desnível positivo. Classificação ATRP: TU-M / Grau 3. Tempo limite: 10 horas. Barreiras horárias: Pias (25km) 5h, Ponte S. Simão (39km) 8h.",
        },
        en: {
          name: "Ultra Trilhos Paleozóico (UTP)",
          description:
            "48km Ultra Trail with ±2600m elevation gain. ATRP Classification: TU-M / Grade 3. Time limit: 10 hours. Time barriers: Pias (25km) 5h, Ponte S. Simão (39km) 8h.",
        },
        es: {
          name: "Ultra Trilhos Paleozóico (UTP)",
          description:
            "Trail Ultra de 48km con ±2600m de desnivel positivo. Clasificación ATRP: TU-M / Grado 3. Tiempo límite: 10 horas. Barreras horarias: Pias (25km) 5h, Ponte S. Simão (39km) 8h.",
        },
        fr: {
          name: "Ultra Trilhos Paleozóico (UTP)",
          description:
            "Trail Ultra de 48km avec ±2600m de dénivelé positif. Classification ATRP: TU-M / Grade 3. Temps limite: 10 heures. Barrières horaires: Pias (25km) 5h, Ponte S. Simão (39km) 8h.",
        },
        de: {
          name: "Ultra Trilhos Paleozóico (UTP)",
          description:
            "48km Ultra Trail mit ±2600m Höhengewinn. ATRP-Klassifizierung: TU-M / Grad 3. Zeitlimit: 10 Stunden. Zeitbarrieren: Pias (25km) 5h, Ponte S. Simão (39km) 8h.",
        },
        it: {
          name: "Ultra Trilhos Paleozóico (UTP)",
          description:
            "Trail Ultra di 48km con ±2600m di dislivello positivo. Classificazione ATRP: TU-M / Grado 3. Tempo limite: 10 ore. Barriere orarie: Pias (25km) 5h, Ponte S. Simão (39km) 8h.",
        },
      },
    },
    {
      name: "Trilhos Paleozóico (TP)",
      distanceKm: 38,
      elevationGainM: 2000,
      elevationLossM: 2000,
      startTime: "08:00",
      cutoffTimeHours: 10,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: 2,
      description: "Trail de 38km com ±2000m de desnível positivo",
      pricingPhases: [
        {
          name: "Fase Promocional",
          startDate: new Date("2025-09-26T00:00:00.000Z"),
          endDate: new Date("2025-10-04T23:59:59.000Z"),
          price: 33.0,
          currency: Currency.EUR,
        },
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-05T00:00:00.000Z"),
          endDate: new Date("2026-01-15T23:59:59.000Z"),
          price: 35.0,
          currency: Currency.EUR,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-16T00:00:00.000Z"),
          endDate: new Date("2026-02-22T23:59:59.000Z"),
          price: 38.0,
          currency: Currency.EUR,
        },
      ],
      translations: {
        pt: {
          name: "Trilhos Paleozóico (TP)",
          description:
            "Trail de 38km com ±2000m de desnível positivo. Tempo limite: 10 horas. Barreira horária: Pias (25km) 5h.",
        },
        en: {
          name: "Trilhos Paleozóico (TP)",
          description:
            "38km Trail with ±2000m elevation gain. Time limit: 10 hours. Time barrier: Pias (25km) 5h.",
        },
        es: {
          name: "Trilhos Paleozóico (TP)",
          description:
            "Trail de 38km con ±2000m de desnivel positivo. Tiempo límite: 10 horas. Barrera horaria: Pias (25km) 5h.",
        },
        fr: {
          name: "Trilhos Paleozóico (TP)",
          description:
            "Trail de 38km avec ±2000m de dénivelé positif. Temps limite: 10 heures. Barrière horaire: Pias (25km) 5h.",
        },
        de: {
          name: "Trilhos Paleozóico (TP)",
          description:
            "38km Trail mit ±2000m Höhengewinn. Zeitlimit: 10 Stunden. Zeitbarriere: Pias (25km) 5h.",
        },
        it: {
          name: "Trilhos Paleozóico (TP)",
          description:
            "Trail di 38km con ±2000m di dislivello positivo. Tempo limite: 10 ore. Barriera oraria: Pias (25km) 5h.",
        },
      },
    },
    {
      name: "Trail Sprint (MTP)",
      distanceKm: 23,
      elevationGainM: 1150,
      elevationLossM: 1150,
      startTime: "09:00",
      cutoffTimeHours: 10,
      itraPoints: null,
      atrpGrade: 2,
      mountainLevel: 1,
      description:
        "Trail Sprint de 23km com ±1150m de desnível - TL / Grau 2 - Circuito Trilhos de Valongo",
      pricingPhases: [
        {
          name: "Fase Promocional",
          startDate: new Date("2025-09-26T00:00:00.000Z"),
          endDate: new Date("2025-10-04T23:59:59.000Z"),
          price: 19.0,
          currency: Currency.EUR,
        },
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-05T00:00:00.000Z"),
          endDate: new Date("2026-01-15T23:59:59.000Z"),
          price: 20.0,
          currency: Currency.EUR,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-16T00:00:00.000Z"),
          endDate: new Date("2026-02-22T23:59:59.000Z"),
          price: 23.0,
          currency: Currency.EUR,
        },
      ],
      translations: {
        pt: {
          name: "Trail Sprint (MTP)",
          description:
            "Trail Sprint de 23km com ±1150m de desnível positivo. Classificação ATRP: TL / Grau 2. Integrado no Circuito Trilhos de Valongo.",
        },
        en: {
          name: "Trail Sprint (MTP)",
          description:
            "23km Trail Sprint with ±1150m elevation gain. ATRP Classification: TL / Grade 2. Part of the Valongo Trail Circuit.",
        },
        es: {
          name: "Trail Sprint (MTP)",
          description:
            "Trail Sprint de 23km con ±1150m de desnivel positivo. Clasificación ATRP: TL / Grado 2. Integrado en el Circuito Trilhos de Valongo.",
        },
        fr: {
          name: "Trail Sprint (MTP)",
          description:
            "Trail Sprint de 23km avec ±1150m de dénivelé positif. Classification ATRP: TL / Grade 2. Intégré au Circuit Trilhos de Valongo.",
        },
        de: {
          name: "Trail Sprint (MTP)",
          description:
            "23km Trail Sprint mit ±1150m Höhengewinn. ATRP-Klassifizierung: TL / Grad 2. Teil des Valongo Trail Circuit.",
        },
        it: {
          name: "Trail Sprint (MTP)",
          description:
            "Trail Sprint di 23km con ±1150m di dislivello positivo. Classificazione ATRP: TL / Grado 2. Parte del Circuito Trilhos de Valongo.",
        },
      },
    },
    {
      name: "Mini Trail",
      distanceKm: 12,
      elevationGainM: 300,
      elevationLossM: 300,
      startTime: "09:30",
      cutoffTimeHours: 5,
      itraPoints: null,
      atrpGrade: 2,
      mountainLevel: 1,
      description:
        "Mini Trail de 12km com ±300m de desnível - TC / Grau 2 - Circuito Trilhos de Valongo",
      pricingPhases: [
        {
          name: "Fase Promocional",
          startDate: new Date("2025-09-26T00:00:00.000Z"),
          endDate: new Date("2025-10-04T23:59:59.000Z"),
          price: 12.0,
          currency: Currency.EUR,
        },
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-05T00:00:00.000Z"),
          endDate: new Date("2026-01-15T23:59:59.000Z"),
          price: 13.0,
          currency: Currency.EUR,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-16T00:00:00.000Z"),
          endDate: new Date("2026-02-22T23:59:59.000Z"),
          price: 15.0,
          currency: Currency.EUR,
        },
      ],
      translations: {
        pt: {
          name: "Mini Trail",
          description:
            "Mini Trail de 12km com ±300m de desnível positivo. Classificação ATRP: TC / Grau 2. Aberto a maiores de 15 anos. Integrado no Circuito Trilhos de Valongo.",
        },
        en: {
          name: "Mini Trail",
          description:
            "12km Mini Trail with ±300m elevation gain. ATRP Classification: TC / Grade 2. Open to participants over 15 years old. Part of the Valongo Trail Circuit.",
        },
        es: {
          name: "Mini Trail",
          description:
            "Mini Trail de 12km con ±300m de desnivel positivo. Clasificación ATRP: TC / Grado 2. Abierto a mayores de 15 años. Integrado en el Circuito Trilhos de Valongo.",
        },
        fr: {
          name: "Mini Trail",
          description:
            "Mini Trail de 12km avec ±300m de dénivelé positif. Classification ATRP: TC / Grade 2. Ouvert aux plus de 15 ans. Intégré au Circuit Trilhos de Valongo.",
        },
        de: {
          name: "Mini Trail",
          description:
            "12km Mini Trail mit ±300m Höhengewinn. ATRP-Klassifizierung: TC / Grad 2. Offen für Teilnehmer über 15 Jahre. Teil des Valongo Trail Circuit.",
        },
        it: {
          name: "Mini Trail",
          description:
            "Mini Trail di 12km con ±300m di dislivello positivo. Classificazione ATRP: TC / Grado 2. Aperto ai maggiori di 15 anni. Parte del Circuito Trilhos de Valongo.",
        },
      },
    },
    {
      name: "Caminhada do Paleozóico",
      distanceKm: 12,
      elevationGainM: 300,
      elevationLossM: 300,
      startTime: "09:35",
      cutoffTimeHours: 5,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: 1,
      description:
        "Caminhada não competitiva de 12km - Aberta a todas as idades",
      pricingPhases: [
        {
          name: "Fase Promocional",
          startDate: new Date("2025-09-26T00:00:00.000Z"),
          endDate: new Date("2025-10-04T23:59:59.000Z"),
          price: 9.5,
          currency: Currency.EUR,
        },
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-05T00:00:00.000Z"),
          endDate: new Date("2026-01-15T23:59:59.000Z"),
          price: 10.0,
          currency: Currency.EUR,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-16T00:00:00.000Z"),
          endDate: new Date("2026-02-22T23:59:59.000Z"),
          price: 11.0,
          currency: Currency.EUR,
        },
      ],
      translations: {
        pt: {
          name: "Caminhada do Paleozóico",
          description:
            "Caminhada não competitiva de 12km com ±300m de desnível. Tempo limite: 5 horas. Aberta a menores acompanhados por um adulto.",
        },
        en: {
          name: "Paleozoic Walk",
          description:
            "Non-competitive 12km walk with ±300m elevation. Time limit: 5 hours. Open to minors accompanied by an adult.",
        },
        es: {
          name: "Caminata del Paleozóico",
          description:
            "Caminata no competitiva de 12km con ±300m de desnivel. Tiempo límite: 5 horas. Abierta a menores acompañados por un adulto.",
        },
        fr: {
          name: "Marche du Paléozoïque",
          description:
            "Marche non compétitive de 12km avec ±300m de dénivelé. Temps limite: 5 heures. Ouverte aux mineurs accompagnés d'un adulte.",
        },
        de: {
          name: "Paläozoikum Wanderung",
          description:
            "Nicht-kompetitive 12km Wanderung mit ±300m Höhenunterschied. Zeitlimit: 5 Stunden. Offen für Minderjährige in Begleitung eines Erwachsenen.",
        },
        it: {
          name: "Camminata del Paleozoico",
          description:
            "Camminata non competitiva di 12km con ±300m di dislivello. Tempo limite: 5 ore. Aperta ai minori accompagnati da un adulto.",
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
      question: "Qual é a idade mínima para participar?",
      answer:
        "Trail Ultra 48km, Trail 38km e Trail Sprint 23km: maiores de 18 anos. Mini Trail 12km: maiores de 15 anos. Caminhada: aberta a menores desde que acompanhados por um adulto.",
      translations: {
        pt: {
          question: "Qual é a idade mínima para participar?",
          answer:
            "Trail Ultra 48km, Trail 38km e Trail Sprint 23km: maiores de 18 anos. Mini Trail 12km: maiores de 15 anos. Caminhada: aberta a menores desde que acompanhados por um adulto.",
        },
        en: {
          question: "What is the minimum age to participate?",
          answer:
            "Trail Ultra 48km, Trail 38km and Trail Sprint 23km: over 18 years old. Mini Trail 12km: over 15 years old. Walk: open to minors accompanied by an adult.",
        },
        es: {
          question: "¿Cuál es la edad mínima para participar?",
          answer:
            "Trail Ultra 48km, Trail 38km y Trail Sprint 23km: mayores de 18 años. Mini Trail 12km: mayores de 15 años. Caminata: abierta a menores acompañados por un adulto.",
        },
        fr: {
          question: "Quel est l'âge minimum pour participer?",
          answer:
            "Trail Ultra 48km, Trail 38km et Trail Sprint 23km: plus de 18 ans. Mini Trail 12km: plus de 15 ans. Marche: ouverte aux mineurs accompagnés d'un adulte.",
        },
        de: {
          question: "Was ist das Mindestalter für die Teilnahme?",
          answer:
            "Trail Ultra 48km, Trail 38km und Trail Sprint 23km: über 18 Jahre. Mini Trail 12km: über 15 Jahre. Wanderung: offen für Minderjährige in Begleitung eines Erwachsenen.",
        },
        it: {
          question: "Qual è l'età minima per partecipare?",
          answer:
            "Trail Ultra 48km, Trail 38km e Trail Sprint 23km: maggiori di 18 anni. Mini Trail 12km: maggiori di 15 anni. Camminata: aperta ai minori accompagnati da un adulto.",
        },
      },
    },
    {
      order: 2,
      question: "Qual é o material obrigatório?",
      answer:
        "Para todas as provas: telemóvel totalmente operacional, apito, manta térmica e depósito de água (a organização não fornece copos). Recomendado: bastões, camelbak, corta-vento, chapéu ou gorro.",
      translations: {
        pt: {
          question: "Qual é o material obrigatório?",
          answer:
            "Para todas as provas: telemóvel totalmente operacional, apito, manta térmica e depósito de água (a organização não fornece copos). Recomendado: bastões, camelbak, corta-vento, chapéu ou gorro.",
        },
        en: {
          question: "What is the mandatory equipment?",
          answer:
            "For all races: fully operational mobile phone, whistle, thermal blanket and water container (cups not provided). Recommended: poles, hydration pack, windbreaker, hat or cap.",
        },
        es: {
          question: "¿Cuál es el material obligatorio?",
          answer:
            "Para todas las pruebas: teléfono móvil totalmente operativo, silbato, manta térmica y depósito de agua (la organización no proporciona vasos). Recomendado: bastones, mochila de hidratación, cortavientos, gorro.",
        },
        fr: {
          question: "Quel est le matériel obligatoire?",
          answer:
            "Pour toutes les courses: téléphone portable entièrement opérationnel, sifflet, couverture de survie et réservoir d'eau (gobelets non fournis). Recommandé: bâtons, sac d'hydratation, coupe-vent, chapeau ou casquette.",
        },
        de: {
          question: "Was ist die Pflichtausrüstung?",
          answer:
            "Für alle Rennen: voll funktionsfähiges Mobiltelefon, Pfeife, Rettungsdecke und Wasserbehälter (keine Becher bereitgestellt). Empfohlen: Stöcke, Trinkrucksack, Windjacke, Hut oder Mütze.",
        },
        it: {
          question: "Qual è il materiale obbligatorio?",
          answer:
            "Per tutte le gare: telefono cellulare completamente operativo, fischietto, coperta termica e contenitore d'acqua (bicchieri non forniti). Consigliato: bastoncini, zaino di idratazione, giacca a vento, cappello.",
        },
      },
    },
    {
      order: 3,
      question: "Onde e quando posso levantar o dorsal?",
      answer:
        "O secretariado funciona na Junta de Freguesia de Valongo (GPS: 41.190187, -8.499112). Horários: 7 de março (sábado) das 10h-13h e 14h30-18h; 8 de março (domingo) das 06h30-09h. É necessário apresentar documento de identificação.",
      translations: {
        pt: {
          question: "Onde e quando posso levantar o dorsal?",
          answer:
            "O secretariado funciona na Junta de Freguesia de Valongo (GPS: 41.190187, -8.499112). Horários: 7 de março (sábado) das 10h-13h e 14h30-18h; 8 de março (domingo) das 06h30-09h. É necessário apresentar documento de identificação.",
        },
        en: {
          question: "Where and when can I pick up my bib?",
          answer:
            "The secretariat is at Junta de Freguesia de Valongo (GPS: 41.190187, -8.499112). Hours: March 7 (Saturday) 10 AM-1 PM and 2:30 PM-6 PM; March 8 (Sunday) 6:30 AM-9 AM. ID required.",
        },
        es: {
          question: "¿Dónde y cuándo puedo recoger el dorsal?",
          answer:
            "El secretariado está en la Junta de Freguesia de Valongo (GPS: 41.190187, -8.499112). Horarios: 7 de marzo (sábado) 10h-13h y 14h30-18h; 8 de marzo (domingo) 06h30-09h. Se requiere documento de identidad.",
        },
        fr: {
          question: "Où et quand puis-je récupérer mon dossard?",
          answer:
            "Le secrétariat est à la Junta de Freguesia de Valongo (GPS: 41.190187, -8.499112). Horaires: 7 mars (samedi) 10h-13h et 14h30-18h; 8 mars (dimanche) 06h30-09h. Pièce d'identité requise.",
        },
        de: {
          question: "Wo und wann kann ich meine Startnummer abholen?",
          answer:
            "Das Sekretariat befindet sich bei der Junta de Freguesia de Valongo (GPS: 41.190187, -8.499112). Öffnungszeiten: 7. März (Samstag) 10-13 Uhr und 14:30-18 Uhr; 8. März (Sonntag) 06:30-09 Uhr. Ausweis erforderlich.",
        },
        it: {
          question: "Dove e quando posso ritirare il pettorale?",
          answer:
            "La segreteria è presso la Junta de Freguesia de Valongo (GPS: 41.190187, -8.499112). Orari: 7 marzo (sabato) 10-13 e 14:30-18; 8 marzo (domenica) 06:30-09. Documento d'identità richiesto.",
        },
      },
    },
    {
      order: 4,
      question: "O que está incluído na inscrição?",
      answer:
        "A inscrição inclui: dorsal personalizado (inscrições até 22/02), seguro de acidentes pessoais, abastecimentos, t-shirt técnica de alta qualidade, medalha finisher e acesso aos banhos nas Piscinas de Valongo (11h30-18h). As primeiras 900 inscrições pagas recebem ainda uma forma para bolos.",
      translations: {
        pt: {
          question: "O que está incluído na inscrição?",
          answer:
            "A inscrição inclui: dorsal personalizado (inscrições até 22/02), seguro de acidentes pessoais, abastecimentos, t-shirt técnica de alta qualidade, medalha finisher e acesso aos banhos nas Piscinas de Valongo (11h30-18h). As primeiras 900 inscrições pagas recebem ainda uma forma para bolos.",
        },
        en: {
          question: "What is included in the registration?",
          answer:
            "Registration includes: personalized bib (registrations until Feb 22), personal accident insurance, aid stations, high-quality technical T-shirt, finisher medal and access to showers at Valongo Swimming Pools (11:30 AM-6 PM). First 900 paid registrations also receive a baking mold.",
        },
        es: {
          question: "¿Qué está incluido en la inscripción?",
          answer:
            "La inscripción incluye: dorsal personalizado (inscripciones hasta 22/02), seguro de accidentes personales, avituallamientos, camiseta técnica de alta calidad, medalla finisher y acceso a las duchas en las Piscinas de Valongo (11:30-18h). Las primeras 900 inscripciones pagadas reciben también un molde para pasteles.",
        },
        fr: {
          question: "Qu'est-ce qui est inclus dans l'inscription?",
          answer:
            "L'inscription comprend: dossard personnalisé (inscriptions jusqu'au 22/02), assurance accidents personnels, ravitaillements, T-shirt technique de haute qualité, médaille finisher et accès aux douches aux Piscines de Valongo (11h30-18h). Les 900 premières inscriptions payées reçoivent également un moule à gâteau.",
        },
        de: {
          question: "Was ist in der Anmeldung enthalten?",
          answer:
            "Die Anmeldung beinhaltet: personalisierte Startnummer (Anmeldungen bis 22.02.), persönliche Unfallversicherung, Verpflegungsstationen, hochwertiges technisches T-Shirt, Finisher-Medaille und Zugang zu Duschen im Valongo Schwimmbad (11:30-18 Uhr). Die ersten 900 bezahlten Anmeldungen erhalten auch eine Backform.",
        },
        it: {
          question: "Cosa è incluso nell'iscrizione?",
          answer:
            "L'iscrizione include: pettorale personalizzato (iscrizioni fino al 22/02), assicurazione infortuni personali, punti di ristoro, T-shirt tecnica di alta qualità, medaglia finisher e accesso alle docce alle Piscine di Valongo (11:30-18). Le prime 900 iscrizioni pagate ricevono anche uno stampo per dolci.",
        },
      },
    },
    {
      order: 5,
      question: "Posso receber ajuda externa durante a prova?",
      answer:
        "Não. Os atletas não podem receber ajuda externa fora dos locais dos abastecimentos, sob pena de desclassificação. A prova é feita em semi-autossuficiência.",
      translations: {
        pt: {
          question: "Posso receber ajuda externa durante a prova?",
          answer:
            "Não. Os atletas não podem receber ajuda externa fora dos locais dos abastecimentos, sob pena de desclassificação. A prova é feita em semi-autossuficiência.",
        },
        en: {
          question: "Can I receive external help during the race?",
          answer:
            "No. Athletes cannot receive external help outside the aid stations, under penalty of disqualification. The race is done in semi-self-sufficiency.",
        },
        es: {
          question: "¿Puedo recibir ayuda externa durante la prueba?",
          answer:
            "No. Los atletas no pueden recibir ayuda externa fuera de los puntos de avituallamiento, bajo pena de descalificación. La prueba se realiza en semi-autosuficiencia.",
        },
        fr: {
          question: "Puis-je recevoir de l'aide externe pendant la course?",
          answer:
            "Non. Les athlètes ne peuvent pas recevoir d'aide externe en dehors des ravitaillements, sous peine de disqualification. La course se fait en semi-autonomie.",
        },
        de: {
          question: "Kann ich während des Rennens externe Hilfe erhalten?",
          answer:
            "Nein. Athleten dürfen außerhalb der Verpflegungsstationen keine externe Hilfe erhalten, andernfalls droht Disqualifikation. Das Rennen wird in Semi-Selbstversorgung durchgeführt.",
        },
        it: {
          question: "Posso ricevere aiuto esterno durante la gara?",
          answer:
            "No. Gli atleti non possono ricevere aiuto esterno al di fuori dei punti di ristoro, pena la squalifica. La gara si svolge in semi-autosufficienza.",
        },
      },
    },
    {
      order: 6,
      question: "Qual é a política de reembolso?",
      answer:
        "Em caso de desistência com atestado médico: 75% até 10/02/2026, 50% até 22/02/2026. Após esta data não há reembolso. Não há transferência de inscrições para 2027.",
      translations: {
        pt: {
          question: "Qual é a política de reembolso?",
          answer:
            "Em caso de desistência com atestado médico: 75% até 10/02/2026, 50% até 22/02/2026. Após esta data não há reembolso. Não há transferência de inscrições para 2027.",
        },
        en: {
          question: "What is the refund policy?",
          answer:
            "In case of withdrawal with medical certificate: 75% until Feb 10, 2026, 50% until Feb 22, 2026. After this date, no refund. No transfer of registrations to 2027.",
        },
        es: {
          question: "¿Cuál es la política de reembolso?",
          answer:
            "En caso de renuncia con certificado médico: 75% hasta 10/02/2026, 50% hasta 22/02/2026. Después de esta fecha no hay reembolso. No hay transferencia de inscripciones para 2027.",
        },
        fr: {
          question: "Quelle est la politique de remboursement?",
          answer:
            "En cas de désistement avec certificat médical: 75% jusqu'au 10/02/2026, 50% jusqu'au 22/02/2026. Après cette date, pas de remboursement. Pas de transfert d'inscriptions vers 2027.",
        },
        de: {
          question: "Was ist die Erstattungsrichtlinie?",
          answer:
            "Bei Rücktritt mit ärztlichem Attest: 75% bis 10.02.2026, 50% bis 22.02.2026. Nach diesem Datum keine Erstattung. Keine Übertragung von Anmeldungen auf 2027.",
        },
        it: {
          question: "Qual è la politica di rimborso?",
          answer:
            "In caso di ritiro con certificato medico: 75% fino al 10/02/2026, 50% fino al 22/02/2026. Dopo questa data nessun rimborso. Nessun trasferimento di iscrizioni al 2027.",
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
  console.log("\n🎉 13ª Trilhos do Paleozóico 2026 seeded successfully!");
  console.log(`   📍 Event: 13ª Trilhos do Paleozóico`);
  console.log(`   🔗 Slug: ${event.slug}`);
  console.log(`   📅 Date: 2026-03-08`);
  console.log(`   📍 Location: Valongo, Porto, Portugal`);
  console.log(
    `   🏃 Variants: 5 (Ultra 48km, Trail 38km, Sprint 23km, Mini 12km, Caminhada 12km)`
  );
  console.log(`   🌍 Languages: PT, EN, ES, FR, DE, IT`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding event:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
