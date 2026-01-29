/**
 * Seed: 31ª Corrida da Árvore Arkopharma 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌳 Seeding 31ª Corrida da Árvore Arkopharma 2026...");

  const eventSlug = "corrida-arvore-arkopharma-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "31ª Corrida da Árvore Arkopharma",
      description: `31ª edição da histórica Corrida da Árvore Arkopharma em Monsanto, Lisboa. Prova lançada em 1993, no coração verde de Lisboa, amiga do ambiente. Marco histórico com 31 anos de história. Corrida 10km, Caminhada 5km e Kids Race (200m, 400m, 800m). Todos os finishers recebem uma árvore para plantar (limite 1000 unidades).`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-02-28T10:00:00.000Z"),
      endDate: null,
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7297,
      longitude: -9.1978,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Monsanto+Lisboa",
      externalUrl: "https://xistarca.pt/corrida-arvore-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-28T09:30:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "31ª Corrida da Árvore Arkopharma",
      description: `31ª edição da histórica Corrida da Árvore Arkopharma em Monsanto, Lisboa. Prova lançada em 1993, no coração verde de Lisboa, amiga do ambiente. Marco histórico com 31 anos de história. Corrida 10km, Caminhada 5km e Kids Race (200m, 400m, 800m). Todos os finishers recebem uma árvore para plantar (limite 1000 unidades).`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-02-28T10:00:00.000Z"),
      endDate: null,
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7297,
      longitude: -9.1978,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Monsanto+Lisboa",
      externalUrl: "https://xistarca.pt/corrida-arvore-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-28T09:30:00.000Z"),
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
      title: "31ª Corrida da Árvore Arkopharma",
      description: `# 🌳 31ª Corrida da Árvore Arkopharma

Bem-vindo à **31ª edição da histórica Corrida da Árvore**! Lançada em 1993, é uma prova com **31 anos de história**, no **coração verde de Lisboa**, amiga do ambiente.

**Este ano alcançamos um marco histórico!** Vem celebrar connosco a 31ª edição em **Monsanto**, o pulmão de Lisboa.

## 📅 Data e Local

**Data:** 28 de Fevereiro de 2026 (Sexta-feira)  
**Local:** Keil do Amaral, Monsanto - Lisboa  
**Percurso:** Floresta de Monsanto

## 🏃 Provas Disponíveis

### Kids Race
- **200m** (até 7 anos) - 09:30
- **400m** (8 e 9 anos) - 09:35
- **800m** (10 aos 12 anos) - 09:40

### Corrida 10km
- **Horário:** 10:00
- **Idade:** +18 anos
- **Percurso:** Monsanto (Keil do Amaral)

### Caminhada 5km
- **Horário:** 10:05
- **Idade:** Todas as idades
- **Percurso:** Monsanto (Keil do Amaral)

## 🗺️ Percurso Detalhado

### Corrida 10km:
Partida na Keil do Amaral → Direita para Estrada do Penedo → Direita para Estrada do Alvito (caminho paralelo) → Direita para Keil do Amaral → Esquerda para caminho interno na zona de merendas → Caminho interno em estradão → Direita para Av. Univ. Técnica → Direita para Estrada dos Marcos e Estrada do Penedo → Esquerda para Montes Claros → Frente para Estrada do Outeiro → Esquerda para caminho interno dos Montes Claros → Esquerda para Estrada do Outeiro → Retorno na Estrada das Oliveiras de Baixo → Frente pela Estrada do Outeiro → **Meta na Keil do Amaral**

### Caminhada 5km:
Partida na Keil do Amaral → Direita para Estrada do Penedo → Direita para Estrada do Alvito (caminho paralelo) → Direita para Keil do Amaral → Esquerda para caminho interno na zona de merendas → Caminho interno em estradão → Direita para Av. Univ. Técnica → Direita para Estrada dos Marcos e Estrada do Penedo → Direita para **Meta na Keil do Amaral**

### Kids Race:
Percurso de ida e volta na Alameda Keil do Amaral

## 🌳 Uma Árvore para Cada Finisher!

**PRÉMIO ÚNICO:** Todos os finishers recebem **uma árvore para plantar**!

🌱 **Limite:** 1000 árvores (de acordo com disponibilidade do viveiro)  
💚 **Opcional:** Se não tiveres interesse em plantar, podes rejeitar a entrega no final da prova

**Juntos fazemos Monsanto e Lisboa mais verdes!**

## 📝 Inscrições

**Prazo:** Até 28 de Fevereiro às 09:30  

**Extras Disponíveis:**
- 👕 T-shirt em Algodão Orgânico: 5,00€
- 📋 Entrega de dorsal no dia do evento: 3,00€ (se comprado online) / 3,50€ (no local)

Inscreve-te em: [xistarca.pt](https://xistarca.pt/corrida-arvore-2026)

## 🎁 Kit de Participação

Todos os participantes recebem:
- 🎽 **Dorsal** (com chip para Corrida 10km)
- 🌳 **Árvore Finisher** (limite 1000 unidades)
- 🎁 **Ofertas de Patrocinadores**

**IMPORTANTE:** O chip NO dorsal NÃO pode ser dobrado!

## 📦 Levantamento do Kit

### Xistarca (Lisboa):
- **25 Fevereiro (5ª feira):** 10h00 - 18h30
- **26 Fevereiro (6ª feira):** 10h00 - 20h00

### No dia do evento:
- **28 Fevereiro (sexta-feira):** 08h30 - 09h30, no local da partida (Keil do Amaral)
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

### Participantes:
- **Corrida 10km:** Idade superior a 18 anos
- **Caminhada 5km:** Todas as idades
- **Kids Race:** Crianças até aos 12 anos (inclusive)

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

## 🌳 História da Corrida da Árvore

Lançada em **1993**, a **Corrida da Árvore** é uma prova **histórica e amiga do ambiente**, realizada há **31 anos** no **coração verde de Lisboa** - a Floresta de Monsanto.

É uma das corridas mais emblemáticas da capital, conhecida pela sua componente ecológica e pelo percurso único na maior área verde urbana de Lisboa.

**Este ano celebramos 31 anos de história!** 🎉

## 🌍 Compromisso Ambiental

Esta prova destaca-se pelo seu **compromisso com o ambiente**:

- 🌳 **1000 árvores** distribuídas aos finishers
- 👕 **T-shirts em algodão orgânico** (opcional)
- ♻️ **Sacos reutilizáveis** encorajados para transporte do kit
- 🌲 **Percurso em Monsanto** - o pulmão verde de Lisboa

**Juntos fazemos Lisboa mais verde!**

## 👥 Organização

**Organizador:** Xistarca  
**Patrocinador Principal:** Arkopharma  
**Apoio:** Água Vimeiro

---

**Aceitação:** Ao inscreveres-te, aceitas automaticamente este regulamento e assumes a responsabilidade de participação.

**Contamos contigo para celebrar 31 anos de história! 🌳🏃**`,
      city: "Lisboa",
      metaTitle: "31ª Corrida da Árvore Arkopharma 2026 | Monsanto, Lisboa",
      metaDescription:
        "31ª edição da histórica Corrida da Árvore em Monsanto. Prova amiga do ambiente desde 1993. Corrida 10km, Caminhada 5km e Kids Race. Todos os finishers recebem uma árvore! 28 Fevereiro 2026.",
    },
    {
      language: "en",
      title: "31st Tree Race Arkopharma",
      description: `# 🌳 31st Tree Race Arkopharma

Welcome to the **31st edition of the historic Tree Race**! Launched in 1993, this is a race with **31 years of history** in **Lisbon's green heart**, environmentally friendly.

**This year we reach a historic milestone!** Come celebrate with us the 31st edition in **Monsanto**, Lisbon's lung.

## 📅 Date and Location

**Date:** February 28, 2026 (Friday)  
**Location:** Keil do Amaral, Monsanto - Lisbon  
**Course:** Monsanto Forest

## 🏃 Available Races

### Kids Race
- **200m** (up to 7 years) - 09:30
- **400m** (8 and 9 years) - 09:35
- **800m** (10 to 12 years) - 09:40

### 10km Race
- **Time:** 10:00
- **Age:** 18+ years

### 5km Walk
- **Time:** 10:05
- **Age:** All ages

## 🌳 One Tree for Every Finisher!

**UNIQUE PRIZE:** All finishers receive **a tree to plant**!

🌱 **Limit:** 1000 trees (according to nursery availability)  
💚 **Optional:** If you don't want to plant, you can decline at the finish line

**Together we make Monsanto and Lisbon greener!**

## 📝 Registration

**Deadline:** Until February 28 at 09:30  

**Available Extras:**
- 👕 Organic Cotton T-shirt: €5.00
- 📋 Race day bib pickup: €3.00

Register at: [xistarca.pt](https://xistarca.pt/corrida-arvore-2026)

## 🎁 Participation Kit

All participants receive:
- 🎽 **Race Bib** (with chip for 10km)
- 🌳 **Finisher Tree** (limit 1000 units)
- 🎁 **Sponsor Gifts**

## 🏆 Prizes

### 10km Race - Overall:
- 🥇 **Trophies** for top 3 male and female

### 10km Race - Age Categories:
- 🥇 **Trophies** for top 3 in each category (M/F)

## 🌳 History of the Tree Race

Launched in **1993**, the **Tree Race** is a **historic and environmentally friendly** race, held for **31 years** in **Lisbon's green heart** - the Monsanto Forest.

**This year we celebrate 31 years of history!** 🎉

## 🌍 Environmental Commitment

This race stands out for its **environmental commitment**:

- 🌳 **1000 trees** distributed to finishers
- 👕 **Organic cotton t-shirts** (optional)
- ♻️ **Reusable bags** encouraged for kit transport
- 🌲 **Monsanto route** - Lisbon's green lung

**Together we make Lisbon greener!**

## 👥 Organization

**Organizer:** Xistarca  
**Main Sponsor:** Arkopharma

**Join us to celebrate 31 years of history! 🌳🏃**`,
      city: "Lisbon",
      metaTitle: "31st Tree Race Arkopharma 2026 | Monsanto, Lisbon",
      metaDescription:
        "31st edition of the historic Tree Race in Monsanto. Eco-friendly race since 1993. 10km race, 5km walk and Kids Race. All finishers receive a tree! February 28, 2026.",
    },
    {
      language: "es",
      title: "31ª Carrera del Árbol Arkopharma",
      description: `# 🌳 31ª Carrera del Árbol Arkopharma

¡Bienvenido a la **31ª edición de la histórica Carrera del Árbol**! Lanzada en 1993, es una carrera con **31 años de historia** en el **corazón verde de Lisboa**, amiga del medio ambiente.

## 📅 Fecha y Ubicación

**Fecha:** 28 de febrero de 2026 (viernes)  
**Ubicación:** Keil do Amaral, Monsanto - Lisboa

## 🏃 Carreras Disponibles

### Kids Race
- **200m** (hasta 7 años) - 09:30
- **400m** (8 y 9 años) - 09:35
- **800m** (10 a 12 años) - 09:40

### Carrera 10km
- **Horario:** 10:00
- **Edad:** +18 años

### Caminata 5km
- **Horario:** 10:05
- **Edad:** Todas las edades

## 🌳 ¡Un Árbol para Cada Finisher!

**PREMIO ÚNICO:** ¡Todos los finishers reciben **un árbol para plantar**!

🌱 **Límite:** 1000 árboles

## 🏆 Premios

- 🥇 Trofeos para los 3 primeros de cada categoría

## 🌍 Compromiso Ambiental

- 🌳 **1000 árboles** distribuidos a los finishers
- 👕 **Camisetas de algodón orgánico** (opcional)
- 🌲 **Ruta en Monsanto** - el pulmón verde de Lisboa

## 👥 Organización

**Organizador:** Xistarca  
**Patrocinador Principal:** Arkopharma

¡Únete para celebrar 31 años de historia! 🌳🏃`,
      city: "Lisboa",
      metaTitle: "31ª Carrera del Árbol Arkopharma 2026 | Monsanto, Lisboa",
      metaDescription:
        "31ª edición de la histórica Carrera del Árbol en Monsanto. Carrera ecológica desde 1993. ¡Todos los finishers reciben un árbol! 28 febrero 2026.",
    },
    {
      language: "fr",
      title: "31ème Course de l'Arbre Arkopharma",
      description: `# 🌳 31ème Course de l'Arbre Arkopharma

Bienvenue à la **31ème édition de la Course de l'Arbre historique** ! Lancée en 1993, c'est une course avec **31 ans d'histoire** dans le **cœur vert de Lisbonne**, respectueuse de l'environnement.

## 📅 Date et Lieu

**Date :** 28 février 2026 (vendredi)  
**Lieu :** Keil do Amaral, Monsanto - Lisbonne

## 🏃 Courses Disponibles

### Kids Race
- **200m** (jusqu'à 7 ans) - 09h30
- **400m** (8 et 9 ans) - 09h35
- **800m** (10 à 12 ans) - 09h40

### Course 10km
- **Horaire :** 10h00
- **Âge :** +18 ans

### Marche 5km
- **Horaire :** 10h05
- **Âge :** Tous les âges

## 🌳 Un Arbre pour Chaque Finisher !

**PRIX UNIQUE :** Tous les finishers reçoivent **un arbre à planter** !

🌱 **Limite :** 1000 arbres

## 🏆 Prix

- 🥇 Trophées pour les 3 premiers de chaque catégorie

## 🌍 Engagement Environnemental

- 🌳 **1000 arbres** distribués aux finishers
- 👕 **T-shirts en coton biologique** (optionnel)
- 🌲 **Parcours à Monsanto** - le poumon vert de Lisbonne

## 👥 Organisation

**Organisateur :** Xistarca  
**Sponsor Principal :** Arkopharma

Rejoignez-nous pour célébrer 31 ans d'histoire ! 🌳🏃`,
      city: "Lisbonne",
      metaTitle: "31ème Course de l'Arbre Arkopharma 2026 | Monsanto, Lisbonne",
      metaDescription:
        "31ème édition de la Course de l'Arbre historique à Monsanto. Course écologique depuis 1993. Tous les finishers reçoivent un arbre ! 28 février 2026.",
    },
    {
      language: "de",
      title: "31. Baumlauf Arkopharma",
      description: `# 🌳 31. Baumlauf Arkopharma

Willkommen zur **31. Ausgabe des historischen Baumlaufs**! 1993 ins Leben gerufen, ist dies ein Rennen mit **31 Jahren Geschichte** im **grünen Herzen Lissabons**, umweltfreundlich.

## 📅 Datum und Ort

**Datum:** 28. Februar 2026 (Freitag)  
**Ort:** Keil do Amaral, Monsanto - Lissabon

## 🏃 Verfügbare Rennen

### Kids Race
- **200m** (bis 7 Jahre) - 09:30
- **400m** (8 und 9 Jahre) - 09:35
- **800m** (10 bis 12 Jahre) - 09:40

### 10km Lauf
- **Zeit:** 10:00
- **Alter:** +18 Jahre

### 5km Wanderung
- **Zeit:** 10:05
- **Alter:** Alle Altersgruppen

## 🌳 Ein Baum für Jeden Finisher!

**EINZIGARTIGER PREIS:** Alle Finisher erhalten **einen Baum zum Pflanzen**!

🌱 **Limit:** 1000 Bäume

## 🏆 Preise

- 🥇 Trophäen für die Top 3 jeder Kategorie

## 🌍 Umweltverpflichtung

- 🌳 **1000 Bäume** an Finisher verteilt
- 👕 **Bio-Baumwoll-T-Shirts** (optional)
- 🌲 **Monsanto-Route** - Lissabons grüne Lunge

## 👥 Organisation

**Veranstalter:** Xistarca  
**Hauptsponsor:** Arkopharma

Feiern Sie mit uns 31 Jahre Geschichte! 🌳🏃`,
      city: "Lissabon",
      metaTitle: "31. Baumlauf Arkopharma 2026 | Monsanto, Lissabon",
      metaDescription:
        "31. Ausgabe des historischen Baumlaufs in Monsanto. Umweltfreundliches Rennen seit 1993. Alle Finisher erhalten einen Baum! 28. Februar 2026.",
    },
    {
      language: "it",
      title: "31ª Corsa dell'Albero Arkopharma",
      description: `# 🌳 31ª Corsa dell'Albero Arkopharma

Benvenuto alla **31ª edizione della storica Corsa dell'Albero**! Lanciata nel 1993, è una gara con **31 anni di storia** nel **cuore verde di Lisbona**, amica dell'ambiente.

## 📅 Data e Luogo

**Data:** 28 febbraio 2026 (venerdì)  
**Luogo:** Keil do Amaral, Monsanto - Lisbona

## 🏃 Gare Disponibili

### Kids Race
- **200m** (fino a 7 anni) - 09:30
- **400m** (8 e 9 anni) - 09:35
- **800m** (10 a 12 anni) - 09:40

### Corsa 10km
- **Orario:** 10:00
- **Età:** +18 anni

### Camminata 5km
- **Orario:** 10:05
- **Età:** Tutte le età

## 🌳 Un Albero per Ogni Finisher!

**PREMIO UNICO:** Tutti i finisher ricevono **un albero da piantare**!

🌱 **Limite:** 1000 alberi

## 🏆 Premi

- 🥇 Trofei per i primi 3 di ogni categoria

## 🌍 Impegno Ambientale

- 🌳 **1000 alberi** distribuiti ai finisher
- 👕 **T-shirt in cotone biologico** (opzionale)
- 🌲 **Percorso a Monsanto** - il polmone verde di Lisbona

## 👥 Organizzazione

**Organizzatore:** Xistarca  
**Sponsor Principale:** Arkopharma

Unisciti per celebrare 31 anni di storia! 🌳🏃`,
      city: "Lisbona",
      metaTitle: "31ª Corsa dell'Albero Arkopharma 2026 | Monsanto, Lisbona",
      metaDescription:
        "31ª edizione della storica Corsa dell'Albero a Monsanto. Gara ecologica dal 1993. Tutti i finisher ricevono un albero! 28 febbraio 2026.",
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
      name: "Kids Race 200m",
      distanceKm: 0.2,
      price: 0.0,
      startTime: "09:30",
    },
    {
      name: "Kids Race 400m",
      distanceKm: 0.4,
      price: 0.0,
      startTime: "09:35",
    },
    {
      name: "Kids Race 800m",
      distanceKm: 0.8,
      price: 0.0,
      startTime: "09:40",
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
  console.log("🎉 31ª Corrida da Árvore Arkopharma 2026 seeded successfully!");
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
