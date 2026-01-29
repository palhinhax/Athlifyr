/**
 * Seed: 26ª GP do Atlântico 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌊 Seeding 26ª GP do Atlântico 2026...");

  const eventSlug = "gp-atlantico-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "26ª GP do Atlântico",
      description: `26ª edição do mítico Grande Prémio do Atlântico na Costa de Caparica. Percorre as principais ruas e o fantástico paredão junto às praias. Sente a brisa do mar e o apoio dos que correm contigo. Prova única com história inigualável. Corrida 10km, Caminhada 5km e Kids Race 500m.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-02-22T10:00:00.000Z"),
      endDate: null,
      city: "Costa de Caparica",
      country: "Portugal",
      latitude: 38.6333,
      longitude: -9.2333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Costa+de+Caparica",
      externalUrl: "https://xistarca.pt/gp-atlantico-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-22T09:30:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "26ª GP do Atlântico",
      description: `26ª edição do mítico Grande Prémio do Atlântico na Costa de Caparica. Percorre as principais ruas e o fantástico paredão junto às praias. Sente a brisa do mar e o apoio dos que correm contigo. Prova única com história inigualável. Corrida 10km, Caminhada 5km e Kids Race 500m.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-02-22T10:00:00.000Z"),
      endDate: null,
      city: "Costa de Caparica",
      country: "Portugal",
      latitude: 38.6333,
      longitude: -9.2333,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Costa+de+Caparica",
      externalUrl: "https://xistarca.pt/gp-atlantico-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-22T09:30:00.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
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
      title: "26ª GP do Atlântico",
      description: `# 🌊 26ª Grande Prémio do Atlântico

Bem-vindo à **26ª edição do mítico Grande Prémio do Atlântico**! Uma prova única, com uma história inigualável e da qual tu podes fazer parte.

**Percorre as principais ruas da Costa de Caparica e o fantástico paredão, junto às praias.** Sente a brisa do mar e o apoio daqueles que correm contigo lado a lado.

## 📅 Data e Local

**Data:** 22 de Fevereiro de 2026 (Domingo)  
**Local:** Costa de Caparica (partida e chegada)  
**Percurso:** Principais ruas + Paredão junto às praias

## 🏃 Provas Disponíveis

### Kids Race 500m
- **Horário:** 09:15
- **Idade:** Até 12 anos (inclusive)
- **Percurso:** Ida e volta na Av. Gen. Humberto Delgado (Norte/Sul)

### Corrida 10km
- **Horário:** 10:00
- **Idade:** +18 anos
- **Percurso:** Ruas principais + Paredão completo (Norte ↔ Sul)

### Caminhada 5km
- **Horário:** 10:05
- **Idade:** Todas as idades
- **Percurso:** Ruas principais + Paredão parcial

## 🗺️ Percurso Detalhado

### Corrida 10km:
Av. Gen. Humberto Delgado (Norte/Sul) → Rua Eng. Henrique Mendia → Rua Dr. Alberto Araújo → Rua Manuel Vicente → Av. MFA → Av. República → Av. 1.º Maio → Rua Norberto de Araújo → Rua Manuel Agro Ferreira → Av. Afonso Albuquerque (Sul/Norte) → Rotunda Campo Pepita (retorno) → Av. Afonso Albuquerque (Norte/Sul) → Estrada de Serviço do Parque Urbano → **Paredão (extremo Norte)** → **Paredão (extremo Sul junto Chapéu de Palha)** → Av. Gen. Humberto Delgado (Sul/Norte) → **Meta**

### Caminhada 5km:
Av. Gen. Humberto Delgado (Norte/Sul) → Rua Eng. Henrique Mendia → Rua Dr. Alberto Araujo → Rua Manuel Vicente → Av. MFA → Av. República → Av. 1.º Maio → Rua Norberto de Araújo → Estrada de Serviço do Parque Urbano → Paredão (extremo Norte) → Paredão (Saída junto ao Paraiso) → Av. Gen. Humberto Delgado (Sul/Norte) → **Meta**

## 🌊 O Mítico Paredão

O **paredão da Costa de Caparica** é o cartão de visita desta prova! Corre junto ao mar, sente a brisa do oceano Atlântico e desfruta das vistas panorâmicas sobre as praias.

## 📝 Inscrições

**Prazo:** Até 22 de Fevereiro às 09:30  

**Extras Disponíveis:**
- 👕 T-shirt técnica Ultradry: 5,00€
- 🧥 Sweat técnica: 12,00€
- 📋 Entrega de dorsal no dia do evento: 3,00€ (se comprado online) / 3,50€ (no local)

Inscreve-te em: [xistarca.pt](https://xistarca.pt/gp-atlantico-2026)

## 🎁 Kit de Participação

Todos os participantes recebem:
- 🎽 **Dorsal** (com chip para Corrida 10km)
- 🏅 **Medalha de Finisher**
- 🎁 **Ofertas de Patrocinadores**

**IMPORTANTE:** O chip NO dorsal NÃO pode ser dobrado!

## 📦 Levantamento do Kit

### Xistarca (Lisboa):
- **20 Fevereiro (6ª feira):** 10h00 - 20h00

### CMIA - Costa de Caparica:
- **21 Fevereiro (sábado):** 10h00 - 13h00
- **Local:** Centro Municipal de Interpretação Ambiental, Alameda Cidade da Costa de Caparica

### No dia do evento:
- **22 Fevereiro (domingo):** 08h30 - 09h30, no local da partida
- **Custo:** 3,00€ (se comprado online) / 3,50€ (sem compra prévia)

**Documentos necessários:**
- Cartão de Cidadão, Passaporte, Carta de Condução ou outro com foto
- Número de dorsal (recebido por email)

💚 **Traz um saco reutilizável** para levares o teu kit!

## 🏆 Prémios

### Corrida 10km - Geral:
- 🥇 **Troféus** para os 3 primeiros classificados masculinos e femininos

### Corrida 10km - Escalões:
- 🥇 **Troféus** para os 3 primeiros de cada escalão (M/F)

### Equipas:
- 🥇 **Troféus** para as 3 primeiras equipas masculinas (3 atletas)
- 🥇 **Troféus** para as 3 primeiras equipas femininas (3 atletas)

**Prazo de levantamento:** Até 30 dias após o evento nas instalações da Xistarca

## 👥 Escalões para 10km

- **Juniores/Seniores:** 18-34 anos
- **Veteranos I:** 35-39 anos
- **Veteranos II:** 40-44 anos
- **Veteranos III:** 45-49 anos
- **Veteranos IV:** 50-54 anos
- **Veteranos V:** 55-59 anos
- **Veteranos VI:** 60-64 anos
- **Veteranos VII:** 65-69 anos
- **Veteranos VIII:** +70 anos

## 💧 Abastecimentos

- **10km:** Água Vimeiro aos 5km e no final
- **5km:** Água Vimeiro no final
- **Kids Race:** Água Vimeiro no final

## 🎒 Bengaleiro

Disponível na zona de partida. **Só serão aceites sacos fechados.**

## 🛡️ Seguro

Todos os participantes inscritos estão cobertos por **seguro de acidentes pessoais** (Decreto Lei nº 10/2009).

**Em caso de acidente:** Comunicar em 3 dias para geral@xistarca.pt

## 📋 Regulamento Importante

### Serão desclassificados concorrentes que:
- ❌ Não efetuem controlo de partida
- ❌ Não cumpram o percurso na totalidade
- ❌ Não levem o dorsal ao peito, bem visível
- ❌ Corram com dorsal/chip de outro concorrente
- ❌ Não respeitem instruções da organização

### Outras Informações:
- **Alterações:** Não aceites no dia do evento
- **Cancelamento:** Sem devolução do valor da inscrição
- **Classificações:** Disponíveis após a prova (geral, masculina, feminina, por escalão)

## 🏛️ História do GP do Atlântico

O **Grande Prémio do Atlântico** é uma prova **mítica e histórica**, realizada há **26 anos** na Costa de Caparica. É uma das corridas mais emblemáticas da zona sul de Lisboa, conhecida pelo seu percurso único junto ao mar.

## 👥 Organização

**Organizador:** Xistarca

**Patrocinadores:** Água Vimeiro

---

**Aceitação:** Ao inscreveres-te, aceitas automaticamente este regulamento e assumes a responsabilidade de participação.

**Contamos contigo para fazer parte desta história! 🌊🏃**`,
      city: "Costa de Caparica",
      metaTitle: "26ª GP do Atlântico 2026 | Costa de Caparica",
      metaDescription:
        "26ª edição do mítico Grande Prémio do Atlântico. Corrida 10km pelo paredão da Costa de Caparica, Caminhada 5km e Kids Race 500m. Brisa do mar e história inigualável. 22 Fevereiro 2026.",
    },
    {
      language: "en",
      title: "26th Atlantic Grand Prix",
      description: `# 🌊 26th Atlantic Grand Prix

Welcome to the **26th edition of the legendary Atlantic Grand Prix**! A unique race with an unmatched history that you can be part of.

**Run through the main streets of Costa de Caparica and the fantastic seafront promenade.** Feel the sea breeze and the support of those running alongside you.

## 📅 Date and Location

**Date:** February 22, 2026 (Sunday)  
**Location:** Costa de Caparica (start and finish)  
**Course:** Main streets + Seafront promenade

## 🏃 Available Races

### Kids Race 500m
- **Time:** 09:15
- **Age:** Up to 12 years

### 10km Race
- **Time:** 10:00
- **Age:** 18+ years
- **Course:** Main streets + Full promenade (North ↔ South)

### 5km Walk
- **Time:** 10:05
- **Age:** All ages
- **Course:** Main streets + Partial promenade

## 🌊 The Legendary Promenade

The **Costa de Caparica promenade** is the highlight of this race! Run by the sea, feel the Atlantic Ocean breeze and enjoy panoramic views over the beaches.

## 📝 Registration

**Deadline:** Until February 22 at 09:30  

**Available Extras:**
- 👕 Ultradry technical shirt: €5.00
- 🧥 Technical sweatshirt: €12.00
- 📋 Race day bib pickup: €3.00

Register at: [xistarca.pt](https://xistarca.pt/gp-atlantico-2026)

## 🎁 Participation Kit

All participants receive:
- 🎽 **Race Bib** (with chip for 10km)
- 🏅 **Finisher Medal**
- 🎁 **Sponsor Gifts**

## 🏆 Prizes

### 10km Race - Overall:
- 🥇 **Trophies** for top 3 male and female

### 10km Race - Age Categories:
- 🥇 **Trophies** for top 3 in each category (M/F)

### Teams:
- 🥇 **Trophies** for top 3 male teams (3 athletes)
- 🥇 **Trophies** for top 3 female teams (3 athletes)

## 👥 Organization

**Organizer:** Xistarca

**Join us in this historic race! 🌊🏃**`,
      city: "Costa de Caparica",
      metaTitle: "26th Atlantic Grand Prix 2026 | Costa de Caparica",
      metaDescription:
        "26th edition of the legendary Atlantic Grand Prix. 10km race along Costa de Caparica promenade, 5km walk and Kids Race 500m. Sea breeze and unmatched history. February 22, 2026.",
    },
    {
      language: "es",
      title: "26º GP del Atlántico",
      description: `# 🌊 26º Gran Premio del Atlántico

¡Bienvenido a la **26ª edición del mítico Gran Premio del Atlántico**! Una carrera única con una historia inigualable.

**Recorre las principales calles de Costa de Caparica y el fantástico paseo marítimo.** Siente la brisa del mar y el apoyo de quienes corren a tu lado.

## 📅 Fecha y Ubicación

**Fecha:** 22 de febrero de 2026 (domingo)  
**Ubicación:** Costa de Caparica (salida y llegada)

## 🏃 Carreras Disponibles

### Kids Race 500m
- **Horario:** 09:15
- **Edad:** Hasta 12 años

### Carrera 10km
- **Horario:** 10:00
- **Edad:** +18 años

### Caminata 5km
- **Horario:** 10:05
- **Edad:** Todas las edades

## 🏆 Premios

- 🥇 Trofeos para los 3 primeros de cada categoría
- 🥇 Trofeos para los 3 mejores equipos

## 👥 Organización

**Organizador:** Xistarca

¡Únete a esta carrera histórica! 🌊🏃`,
      city: "Costa de Caparica",
      metaTitle: "26º GP del Atlántico 2026 | Costa de Caparica",
      metaDescription:
        "26ª edición del mítico Gran Premio del Atlántico. Carrera 10km por el paseo marítimo de Costa de Caparica. 22 febrero 2026.",
    },
    {
      language: "fr",
      title: "26ème GP de l'Atlantique",
      description: `# 🌊 26ème Grand Prix de l'Atlantique

Bienvenue à la **26ème édition du mythique Grand Prix de l'Atlantique** ! Une course unique avec une histoire inégalée.

**Parcourez les rues principales de Costa de Caparica et la fantastique promenade en bord de mer.** Ressentez la brise marine et le soutien de ceux qui courent à vos côtés.

## 📅 Date et Lieu

**Date :** 22 février 2026 (dimanche)  
**Lieu :** Costa de Caparica (départ et arrivée)

## 🏃 Courses Disponibles

### Kids Race 500m
- **Horaire :** 09h15
- **Âge :** Jusqu'à 12 ans

### Course 10km
- **Horaire :** 10h00
- **Âge :** +18 ans

### Marche 5km
- **Horaire :** 10h05
- **Âge :** Tous les âges

## 🏆 Prix

- 🥇 Trophées pour les 3 premiers de chaque catégorie
- 🥇 Trophées pour les 3 meilleures équipes

## 👥 Organisation

**Organisateur :** Xistarca

Rejoignez cette course historique ! 🌊🏃`,
      city: "Costa de Caparica",
      metaTitle: "26ème GP de l'Atlantique 2026 | Costa de Caparica",
      metaDescription:
        "26ème édition du mythique Grand Prix de l'Atlantique. Course 10km sur la promenade de Costa de Caparica. 22 février 2026.",
    },
    {
      language: "de",
      title: "26. GP des Atlantiks",
      description: `# 🌊 26. Grand Prix des Atlantiks

Willkommen zur **26. Ausgabe des legendären Grand Prix des Atlantiks**! Ein einzigartiges Rennen mit einer unvergleichlichen Geschichte.

**Laufen Sie durch die Hauptstraßen von Costa de Caparica und die fantastische Strandpromenade.** Spüren Sie die Meeresbrise und die Unterstützung derer, die neben Ihnen laufen.

## 📅 Datum und Ort

**Datum:** 22. Februar 2026 (Sonntag)  
**Ort:** Costa de Caparica (Start und Ziel)

## 🏃 Verfügbare Rennen

### Kids Race 500m
- **Zeit:** 09:15
- **Alter:** Bis 12 Jahre

### 10km Lauf
- **Zeit:** 10:00
- **Alter:** +18 Jahre

### 5km Wanderung
- **Zeit:** 10:05
- **Alter:** Alle Altersgruppen

## 🏆 Preise

- 🥇 Trophäen für die Top 3 jeder Kategorie
- 🥇 Trophäen für die 3 besten Teams

## 👥 Organisation

**Veranstalter:** Xistarca

Nehmen Sie an diesem historischen Rennen teil! 🌊🏃`,
      city: "Costa de Caparica",
      metaTitle: "26. GP des Atlantiks 2026 | Costa de Caparica",
      metaDescription:
        "26. Ausgabe des legendären Grand Prix des Atlantiks. 10km Lauf entlang der Promenade von Costa de Caparica. 22. Februar 2026.",
    },
    {
      language: "it",
      title: "26º GP dell'Atlantico",
      description: `# 🌊 26º Gran Premio dell'Atlantico

Benvenuto alla **26ª edizione del mitico Gran Premio dell'Atlantico**! Una gara unica con una storia ineguagliabile.

**Percorri le strade principali di Costa de Caparica e la fantastica passeggiata sul mare.** Senti la brezza del mare e il supporto di chi corre al tuo fianco.

## 📅 Data e Luogo

**Data:** 22 febbraio 2026 (domenica)  
**Luogo:** Costa de Caparica (partenza e arrivo)

## 🏃 Gare Disponibili

### Kids Race 500m
- **Orario:** 09:15
- **Età:** Fino a 12 anni

### Corsa 10km
- **Orario:** 10:00
- **Età:** +18 anni

### Camminata 5km
- **Orario:** 10:05
- **Età:** Tutte le età

## 🏆 Premi

- 🥇 Trofei per i primi 3 di ogni categoria
- 🥇 Trofei per i 3 migliori team

## 👥 Organizzazione

**Organizzatore:** Xistarca

Unisciti a questa gara storica! 🌊🏃`,
      city: "Costa de Caparica",
      metaTitle: "26º GP dell'Atlantico 2026 | Costa de Caparica",
      metaDescription:
        "26ª edizione del mitico Gran Premio dell'Atlantico. Corsa 10km lungo la passeggiata di Costa de Caparica. 22 febbraio 2026.",
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

  // Step 3: Find or create variants
  const variants = [
    {
      name: "Kids Race 500m",
      distanceKm: 0.5,
      price: 0.0,
      startTime: "09:15",
    },
    {
      name: "Corrida 10km",
      distanceKm: 10,
      price: 0.0,
      startTime: "10:00",
    },
    {
      name: "Caminhada 5km",
      distanceKm: 5,
      price: 0.0,
      startTime: "10:05",
    },
  ];

  for (const variantData of variants) {
    const existing = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: variantData.name,
      },
    });

    let variant;
    if (existing) {
      variant = await prisma.eventVariant.update({
        where: { id: existing.id },
        data: {
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    } else {
      variant = await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name: variantData.name,
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    }

    console.log(
      `✅ Variant ${existing ? "updated" : "created"}: ${variant.name}`
    );
  }

  console.log("");
  console.log("🎉 26ª GP do Atlântico 2026 seeded successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
