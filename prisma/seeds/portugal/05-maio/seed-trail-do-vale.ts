import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding Trail do Vale 2026...");

  // Step 1: Delete existing event if it exists (for idempotency)
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "trail-do-vale-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing event and all related data...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  // Step 2: Create the event
  const event = await prisma.event.create({
    data: {
      title: "Trail do Vale",
      slug: "trail-do-vale-2026",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-05-17T08:30:00.000Z"),
      registrationDeadline: new Date("2026-05-03T23:59:59.000Z"),
      city: "Tomar",
      country: "Portugal",
      latitude: 39.6149,
      longitude: -8.4096,
      googleMapsUrl: "https://www.google.com/maps?q=39.6149,-8.4096",
      externalUrl: "https://lap2go.com/pt/event/trail-do-vale-2026",
      isFeatured: false,
      description: "Base description - will be overridden by translations",
    },
  });

  console.log("✅ Event created successfully!");
  console.log(`   Event ID: ${event.id}`);
  console.log(`   Event slug: ${event.slug}`);

  // Step 3: Create translations for all 6 languages
  const languages = ["pt", "en", "es", "fr", "de", "it"] as const;

  const translations = {
    pt: {
      title: "Trail do Vale 2026",
      description: `# Trail do Vale 2026

**8ª Edição - Trail em Tomar**

O **Trail do Vale** regressa em 2026 para mais uma edição nos trilhos de Vale Venteiro, Tomar! Um evento de trail running que oferece 4 percursos diferentes, desde a exigente prova de 34km até à caminhada familiar de 10km.

**Data:** 17 de maio de 2026 (domingo)  
**Local:** Vale Venteiro, Além da Ribeira/Pedreira, Tomar  
**Organização:** ARCAR - Associação Recreativa e Cultural de Além da Ribeira  
**Partida/Meta:** Sede da ARCAR, Vale Venteiro

![Trail do Vale](https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80)

## 🏃 As Provas

### ⛰️ Trail Longo - 34 km

**Distância:** 34 km  
**Desnível Positivo:** D+1100m  
**Tempo Limite:** 7 horas  
**Partida:** 08:30  
**Idade Mínima:** 20 anos  
**Limite:** 150 participantes

Prova trail de grande distância nos trilhos de Tomar. Percurso técnico e exigente com 1100m de desnível positivo. Competitiva com classificação geral, por escalão e por equipas. Material obrigatório necessário.

### 🏔️ Trail Curto - 20 km

**Distância:** 20 km  
**Desnível Positivo:** D+600m  
**Tempo Limite:** 5 horas  
**Partida:** 09:00  
**Idade Mínima:** 18 anos  
**Limite:** 250 participantes

Trail de distância média com 600m de desnível. Percurso técnico mas acessível a atletas com experiência moderada. Prova competitiva com classificações. Material obrigatório necessário.

### 🏃‍♂️ Mini Trail - 14 km

**Distância:** 14 km  
**Desnível Positivo:** D+450m  
**Tempo Limite:** 3 horas  
**Partida:** 09:30  
**Idade Mínima:** 16 anos (com autorização)  
**Limite:** 250 participantes

Trail curto ideal para iniciantes ou atletas menos experientes. 450m de desnível positivo. Prova competitiva com classificações. Material obrigatório necessário.

### 🚶 Caminhada - 10 km

**Distância:** ~10 km  
**Desnível Positivo:** D+250m  
**Partida:** 09:45  
**Idade Mínima:** 12 anos (com autorização)  
**Limite:** 300 participantes

Caminhada orientada não competitiva. Ideal para famílias e iniciantes. Percurso acessível pelos trilhos do Vale Venteiro. Sem classificação.

## 🎒 Material Obrigatório

**Para todas as provas competitivas (14K, 20K, 34K):**

✅ Telemóvel com bateria e saldo  
✅ Apito  
✅ Manta térmica  
✅ Dorsal visível  
✅ Recipiente para líquidos (capacidade adequada)

**⚠️ Penalização/Desclassificação** por falta de material obrigatório!

## 📋 Condições de Participação

**Idade Mínima:**
- Trail Longo 34K: 20 anos
- Trail Curto 20K: 18 anos
- Mini Trail 14K: 16 anos (com autorização dos pais/encarregados)
- Caminhada 10K: 12 anos (com acompanhamento de adulto)

**Limites de Participantes:**
- Trail Longo: 150
- Trail Curto: 250
- Mini Trail: 250
- Caminhada: 300

## 🏆 Prémios e Classificações

**Classificações (provas competitivas):**
- Classificação geral individual (M/F)
- Classificação por escalão etário
- Classificação por equipas (soma dos 3 primeiros)

**Prémios:**
- Troféus para Top 3 geral (M/F)
- Troféus para Top 3 por escalão
- Troféus para Top 3 equipas

**❌ Sem prémios monetários**

## 🎁 O Que Está Incluído

✅ Dorsal oficial  
✅ Seguro de acidentes pessoais  
✅ Postos de abastecimento no percurso  
✅ Medalha finisher  
✅ T-shirt técnica do evento  
✅ Brindes  
✅ Transporte para a meta em caso de desistência  
✅ **Almoço opcional**: +6€ (opção vegan disponível)

## 📍 Localização

**Vale Venteiro, Tomar**

Partida e chegada na sede da **ARCAR** (Associação Recreativa e Cultural de Além da Ribeira), localizada em Vale Venteiro, freguesia de Além da Ribeira/Pedreira, Tomar.

**Coordenadas GPS:** 39.6149, -8.4096

Uma zona rural de grande beleza natural, com trilhos técnicos e paisagens deslumbrantes da região de Tomar.

## 🔄 Política de Transferências e Reembolsos

**Transferência de inscrição:**
✅ Permitida até datas específicas
✅ Mediante taxa conforme regulamento

**Reembolso:**
✅ Apenas por motivos médicos comprovados
✅ Até datas determinadas no regulamento
❌ Sem reembolso em outras circunstâncias

## ⚠️ Regras Importantes

- Evento realiza-se **com mau tempo**, salvo risco para participantes
- Material obrigatório verificado - penalização por falta
- Atletas devem conhecer e respeitar o regulamento
- Abandono deve ser comunicado à organização
- Respeito pelos trilhos e natureza é obrigatório

## 📱 Contactos

**Organização:** ARCAR - Associação Recreativa e Cultural de Além da Ribeira  
**Website:** https://lap2go.com/pt/event/trail-do-vale-2026  
**Facebook:** https://www.facebook.com/traildovale  
**Plataforma:** Lap2Go

**Inscrições encerram:** 03/05/2026 às 23:59

---

💪 Trail nos arredores de Tomar | 🏔️ 4 percursos para todos os níveis | 🏅 8ª Edição`,
      city: "Tomar",
      metaTitle: "Trail do Vale 2026 - Tomar | 17 Maio | 34K, 20K, 14K, 10K",
      metaDescription:
        "Trail do Vale 2026 em Tomar. 4 percursos: Trail Longo 34K (+1100m), Trail Curto 20K (+600m), Mini Trail 14K (+450m), Caminhada 10K. Inscrições até 03/05.",
    },
    en: {
      title: "Trail do Vale 2026",
      description: `# Trail do Vale 2026

**8th Edition - Trail Running in Tomar**

**Trail do Vale** returns in 2026 for another edition on the trails of Vale Venteiro, Tomar! A trail running event offering 4 different routes, from the demanding 34km race to the family-friendly 10km walk.

**Date:** 17 May 2026 (Sunday)  
**Location:** Vale Venteiro, Além da Ribeira/Pedreira, Tomar  
**Organization:** ARCAR - Cultural and Recreational Association of Além da Ribeira  
**Start/Finish:** ARCAR Headquarters, Vale Venteiro

![Trail do Vale](https://images.unsplash.com/photo-1551632811-561732d1e306?w=1200&q=80)

## 🏃 The Races

### ⛰️ Long Trail - 34 km

**Distance:** 34 km  
**Elevation Gain:** D+1100m  
**Time Limit:** 7 hours  
**Start:** 08:30  
**Minimum Age:** 20 years  
**Limit:** 150 participants

Long-distance trail race on Tomar trails. Technical and demanding course with 1100m elevation gain. Competitive with overall, age group, and team classifications. Mandatory equipment required.

### 🏔️ Short Trail - 20 km

**Distance:** 20 km  
**Elevation Gain:** D+600m  
**Time Limit:** 5 hours  
**Start:** 09:00  
**Minimum Age:** 18 years  
**Limit:** 250 participants

Medium-distance trail with 600m elevation. Technical but accessible to athletes with moderate experience. Competitive race with classifications. Mandatory equipment required.

### 🏃‍♂️ Mini Trail - 14 km

**Distance:** 14 km  
**Elevation Gain:** D+450m  
**Time Limit:** 3 hours  
**Start:** 09:30  
**Minimum Age:** 16 years (with authorization)  
**Limit:** 250 participants

Short trail ideal for beginners or less experienced athletes. 450m elevation gain. Competitive race with classifications. Mandatory equipment required.

### 🚶 Walk - 10 km

**Distance:** ~10 km  
**Elevation Gain:** D+250m  
**Start:** 09:45  
**Minimum Age:** 12 years (with authorization)  
**Limit:** 300 participants

Non-competitive guided walk. Ideal for families and beginners. Accessible route through Vale Venteiro trails. No classification.

## 🎒 Mandatory Equipment

**For all competitive races (14K, 20K, 34K):**

✅ Mobile phone with battery and credit  
✅ Whistle  
✅ Thermal blanket  
✅ Visible race bib  
✅ Liquid container (adequate capacity)

**⚠️ Penalty/Disqualification** for missing mandatory equipment!

## 🏆 Prizes and Classifications

**Classifications (competitive races):**
- Overall individual (M/F)
- Age group classification
- Team classification (sum of first 3)

**Prizes:**
- Trophies for Top 3 overall (M/F)
- Trophies for Top 3 per age group
- Trophies for Top 3 teams

**❌ No cash prizes**

## 🎁 Included in Registration

✅ Official race bib  
✅ Personal accident insurance  
✅ Aid stations on course  
✅ Finisher medal  
✅ Technical event T-shirt  
✅ Gifts  
✅ Transport to finish in case of withdrawal  
✅ **Optional lunch**: +€6 (vegan option available)

---

💪 Trail around Tomar | 🏔️ 4 routes for all levels | 🏅 8th Edition`,
      city: "Tomar",
      metaTitle: "Trail do Vale 2026 - Tomar | 17 May | 34K, 20K, 14K, 10K",
      metaDescription:
        "Trail do Vale 2026 in Tomar. 4 routes: Long Trail 34K (+1100m), Short Trail 20K (+600m), Mini Trail 14K (+450m), Walk 10K. Registration until 03/05.",
    },
    es: {
      title: "Trail do Vale 2026",
      description: `# Trail do Vale 2026

**8ª Edición - Trail Running en Tomar**

¡El **Trail do Vale** regresa en 2026 para otra edición en los senderos de Vale Venteiro, Tomar! Un evento de trail running que ofrece 4 recorridos diferentes, desde la exigente prueba de 34km hasta la caminata familiar de 10km.

**Fecha:** 17 de mayo de 2026 (domingo)  
**Lugar:** Vale Venteiro, Além da Ribeira/Pedreira, Tomar  
**Organización:** ARCAR - Asociación Recreativa y Cultural de Além da Ribeira  
**Salida/Meta:** Sede de ARCAR, Vale Venteiro

## 🏃 Las Pruebas

### ⛰️ Trail Largo - 34 km

**Distancia:** 34 km  
**Desnivel Positivo:** D+1100m  
**Tiempo Límite:** 7 horas  
**Salida:** 08:30  
**Edad Mínima:** 20 años  
**Límite:** 150 participantes

### 🏔️ Trail Corto - 20 km

**Distancia:** 20 km  
**Desnivel Positivo:** D+600m  
**Tiempo Límite:** 5 horas  
**Salida:** 09:00  
**Edad Mínima:** 18 años  
**Límite:** 250 participantes

### 🏃‍♂️ Mini Trail - 14 km

**Distancia:** 14 km  
**Desnivel Positivo:** D+450m  
**Tiempo Límite:** 3 horas  
**Salida:** 09:30  
**Edad Mínima:** 16 años  
**Límite:** 250 participantes

### 🚶 Caminata - 10 km

**Distancia:** ~10 km  
**Desnivel Positivo:** D+250m  
**Salida:** 09:45  
**Edad Mínima:** 12 años  
**Límite:** 300 participantes

---

💪 Trail en Tomar | 🏔️ 4 recorridos para todos los niveles | 🏅 8ª Edición`,
      city: "Tomar",
      metaTitle: "Trail do Vale 2026 - Tomar | 17 Mayo | 34K, 20K, 14K, 10K",
      metaDescription:
        "Trail do Vale 2026 en Tomar. 4 recorridos: Trail Largo 34K (+1100m), Trail Corto 20K (+600m), Mini Trail 14K (+450m), Caminata 10K. Inscripción hasta 03/05.",
    },
    fr: {
      title: "Trail do Vale 2026",
      description: `# Trail do Vale 2026

**8ème Édition - Trail Running à Tomar**

Le **Trail do Vale** revient en 2026 pour une nouvelle édition sur les sentiers de Vale Venteiro, Tomar ! Un événement de trail running proposant 4 parcours différents, de l'exigeante épreuve de 34km à la randonnée familiale de 10km.

**Date:** 17 mai 2026 (dimanche)  
**Lieu:** Vale Venteiro, Além da Ribeira/Pedreira, Tomar  
**Organisation:** ARCAR - Association Récréative et Culturelle d'Além da Ribeira  
**Départ/Arrivée:** Siège d'ARCAR, Vale Venteiro

## 🏃 Les Épreuves

### ⛰️ Trail Long - 34 km

**Distance:** 34 km  
**Dénivelé Positif:** D+1100m  
**Limite de Temps:** 7 heures  
**Départ:** 08:30  
**Âge Minimum:** 20 ans  
**Limite:** 150 participants

### 🏔️ Trail Court - 20 km

**Distance:** 20 km  
**Dénivelé Positif:** D+600m  
**Limite de Temps:** 5 heures  
**Départ:** 09:00  
**Âge Minimum:** 18 ans  
**Limite:** 250 participants

### 🏃‍♂️ Mini Trail - 14 km

**Distance:** 14 km  
**Dénivelé Positif:** D+450m  
**Limite de Temps:** 3 heures  
**Départ:** 09:30  
**Âge Minimum:** 16 ans  
**Limite:** 250 participants

### 🚶 Randonnée - 10 km

**Distance:** ~10 km  
**Dénivelé Positif:** D+250m  
**Départ:** 09:45  
**Âge Minimum:** 12 ans  
**Limite:** 300 participants

---

💪 Trail à Tomar | 🏔️ 4 parcours pour tous les niveaux | 🏅 8ème Édition`,
      city: "Tomar",
      metaTitle: "Trail do Vale 2026 - Tomar | 17 Mai | 34K, 20K, 14K, 10K",
      metaDescription:
        "Trail do Vale 2026 à Tomar. 4 parcours: Trail Long 34K (+1100m), Trail Court 20K (+600m), Mini Trail 14K (+450m), Randonnée 10K. Inscription jusqu'au 03/05.",
    },
    de: {
      title: "Trail do Vale 2026",
      description: `# Trail do Vale 2026

**8. Ausgabe - Trail Running in Tomar**

Der **Trail do Vale** kehrt 2026 für eine weitere Ausgabe auf den Pfaden von Vale Venteiro, Tomar zurück! Ein Trail-Running-Event mit 4 verschiedenen Strecken, vom anspruchsvollen 34km-Rennen bis zur familienfreundlichen 10km-Wanderung.

**Datum:** 17. Mai 2026 (Sonntag)  
**Ort:** Vale Venteiro, Além da Ribeira/Pedreira, Tomar  
**Organisation:** ARCAR - Kultur- und Freizeitverein Além da Ribeira  
**Start/Ziel:** ARCAR-Hauptsitz, Vale Venteiro

## 🏃 Die Rennen

### ⛰️ Langer Trail - 34 km

**Distanz:** 34 km  
**Höhengewinn:** D+1100m  
**Zeitlimit:** 7 Stunden  
**Start:** 08:30  
**Mindestalter:** 20 Jahre  
**Limit:** 150 Teilnehmer

### 🏔️ Kurzer Trail - 20 km

**Distanz:** 20 km  
**Höhengewinn:** D+600m  
**Zeitlimit:** 5 Stunden  
**Start:** 09:00  
**Mindestalter:** 18 Jahre  
**Limit:** 250 Teilnehmer

### 🏃‍♂️ Mini Trail - 14 km

**Distanz:** 14 km  
**Höhengewinn:** D+450m  
**Zeitlimit:** 3 Stunden  
**Start:** 09:30  
**Mindestalter:** 16 Jahre  
**Limit:** 250 Teilnehmer

### 🚶 Wanderung - 10 km

**Distanz:** ~10 km  
**Höhengewinn:** D+250m  
**Start:** 09:45  
**Mindestalter:** 12 Jahre  
**Limit:** 300 Teilnehmer

---

💪 Trail in Tomar | 🏔️ 4 Strecken für alle Levels | 🏅 8. Ausgabe`,
      city: "Tomar",
      metaTitle: "Trail do Vale 2026 - Tomar | 17 Mai | 34K, 20K, 14K, 10K",
      metaDescription:
        "Trail do Vale 2026 in Tomar. 4 Strecken: Langer Trail 34K (+1100m), Kurzer Trail 20K (+600m), Mini Trail 14K (+450m), Wanderung 10K. Anmeldung bis 03/05.",
    },
    it: {
      title: "Trail do Vale 2026",
      description: `# Trail do Vale 2026

**8ª Edizione - Trail Running a Tomar**

Il **Trail do Vale** torna nel 2026 per un'altra edizione sui sentieri di Vale Venteiro, Tomar! Un evento di trail running che offre 4 percorsi diversi, dalla impegnativa gara di 34km alla camminata familiare di 10km.

**Data:** 17 maggio 2026 (domenica)  
**Luogo:** Vale Venteiro, Além da Ribeira/Pedreira, Tomar  
**Organizzazione:** ARCAR - Associazione Ricreativa e Culturale di Além da Ribeira  
**Partenza/Arrivo:** Sede ARCAR, Vale Venteiro

## 🏃 Le Gare

### ⛰️ Trail Lungo - 34 km

**Distanza:** 34 km  
**Dislivello Positivo:** D+1100m  
**Limite di Tempo:** 7 ore  
**Partenza:** 08:30  
**Età Minima:** 20 anni  
**Limite:** 150 partecipanti

### 🏔️ Trail Corto - 20 km

**Distanza:** 20 km  
**Dislivello Positivo:** D+600m  
**Limite di Tempo:** 5 ore  
**Partenza:** 09:00  
**Età Minima:** 18 anni  
**Limite:** 250 partecipanti

### 🏃‍♂️ Mini Trail - 14 km

**Distanza:** 14 km  
**Dislivello Positivo:** D+450m  
**Limite di Tempo:** 3 ore  
**Partenza:** 09:30  
**Età Minima:** 16 anni  
**Limite:** 250 partecipanti

### 🚶 Camminata - 10 km

**Distanza:** ~10 km  
**Dislivello Positivo:** D+250m  
**Partenza:** 09:45  
**Età Minima:** 12 anni  
**Limite:** 300 partecipanti

---

💪 Trail a Tomar | 🏔️ 4 percorsi per tutti i livelli | 🏅 8ª Edizione`,
      city: "Tomar",
      metaTitle: "Trail do Vale 2026 - Tomar | 17 Maggio | 34K, 20K, 14K, 10K",
      metaDescription:
        "Trail do Vale 2026 a Tomar. 4 percorsi: Trail Lungo 34K (+1100m), Trail Corto 20K (+600m), Mini Trail 14K (+450m), Camminata 10K. Iscrizioni fino al 03/05.",
    },
  };

  for (const lang of languages) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
      },
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

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 4: Delete existing pricing phases
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating variants and pricing phases...");

  // Step 5: Create variants with pricing phases
  const variants = [
    {
      name: "Trail Longo - 34 km",
      distanceKm: 34,
      elevationGainM: 1100,
      cutoffTimeHours: 7,
      startDate: new Date("2026-05-17T08:30:00.000Z"),
      startTime: "08:30",
      description:
        "Long-distance trail race of 34km with D+1100m. Technical and demanding course on Tomar trails. Competitive with overall, age group, and team classifications. Mandatory equipment: mobile phone, whistle, thermal blanket, visible bib, liquid container. Time limit: 7 hours. Minimum age: 20 years. Limit: 150 participants. Trophies for top 3 overall M/F, age groups, and teams. No cash prizes.",
      pricingPhases: [
        {
          name: "Fase 1",
          price: 20.0,
          startDate: new Date("2026-01-17T00:00:00.000Z"),
          endDate: new Date("2026-02-17T23:59:59.000Z"),
          note: "Early bird - melhor preço!",
        },
        {
          name: "Fase 2",
          price: 22.0,
          startDate: new Date("2026-02-18T00:00:00.000Z"),
          endDate: new Date("2026-04-17T23:59:59.000Z"),
          note: "Preço intermédio",
        },
        {
          name: "Fase 3",
          price: 24.0,
          startDate: new Date("2026-04-18T00:00:00.000Z"),
          endDate: new Date("2026-05-03T23:59:59.000Z"),
          note: "Fase final - últimas vagas",
        },
      ],
    },
    {
      name: "Trail Curto - 20 km",
      distanceKm: 20,
      elevationGainM: 600,
      cutoffTimeHours: 5,
      startDate: new Date("2026-05-17T09:00:00.000Z"),
      startTime: "09:00",
      description:
        "Medium-distance trail of 20km with D+600m. Technical but accessible to athletes with moderate experience. Competitive with classifications. Mandatory equipment: mobile phone, whistle, thermal blanket, visible bib, liquid container. Time limit: 5 hours. Minimum age: 18 years. Limit: 250 participants. Trophies for top 3 overall M/F, age groups, and teams.",
      pricingPhases: [
        {
          name: "Fase 1",
          price: 14.0,
          startDate: new Date("2026-01-17T00:00:00.000Z"),
          endDate: new Date("2026-02-17T23:59:59.000Z"),
          note: "Early bird - melhor preço!",
        },
        {
          name: "Fase 2",
          price: 16.0,
          startDate: new Date("2026-02-18T00:00:00.000Z"),
          endDate: new Date("2026-04-17T23:59:59.000Z"),
          note: "Preço intermédio",
        },
        {
          name: "Fase 3",
          price: 18.0,
          startDate: new Date("2026-04-18T00:00:00.000Z"),
          endDate: new Date("2026-05-03T23:59:59.000Z"),
          note: "Fase final - últimas vagas",
        },
      ],
    },
    {
      name: "Mini Trail - 14 km",
      distanceKm: 14,
      elevationGainM: 450,
      cutoffTimeHours: 3,
      startDate: new Date("2026-05-17T09:30:00.000Z"),
      startTime: "09:30",
      description:
        "Short trail of 14km with D+450m. Ideal for beginners or less experienced athletes. Competitive race with classifications. Mandatory equipment: mobile phone, whistle, thermal blanket, visible bib, liquid container. Time limit: 3 hours. Minimum age: 16 years (with authorization). Limit: 250 participants. Trophies for top 3 overall M/F, age groups, and teams.",
      pricingPhases: [
        {
          name: "Fase 1",
          price: 12.0,
          startDate: new Date("2026-01-17T00:00:00.000Z"),
          endDate: new Date("2026-02-17T23:59:59.000Z"),
          note: "Early bird - melhor preço!",
        },
        {
          name: "Fase 2",
          price: 14.0,
          startDate: new Date("2026-02-18T00:00:00.000Z"),
          endDate: new Date("2026-04-17T23:59:59.000Z"),
          note: "Preço intermédio",
        },
        {
          name: "Fase 3",
          price: 18.0,
          startDate: new Date("2026-04-18T00:00:00.000Z"),
          endDate: new Date("2026-05-03T23:59:59.000Z"),
          note: "Fase final - últimas vagas",
        },
      ],
    },
    {
      name: "Caminhada - 10 km",
      distanceKm: 10,
      elevationGainM: 250,
      cutoffTimeHours: null,
      startDate: new Date("2026-05-17T09:45:00.000Z"),
      startTime: "09:45",
      description:
        "Non-competitive guided walk of approximately 10km with D+250m. Ideal for families and beginners. Accessible route through Vale Venteiro trails. No classification. Minimum age: 12 years (with adult supervision). Limit: 300 participants. Includes finisher medal, T-shirt, gifts, and optional lunch (+€6, vegan option available).",
      pricingPhases: [
        {
          name: "Fase 1",
          price: 10.0,
          startDate: new Date("2026-01-17T00:00:00.000Z"),
          endDate: new Date("2026-02-17T23:59:59.000Z"),
          note: "Early bird - melhor preço!",
        },
        {
          name: "Fase 2",
          price: 12.0,
          startDate: new Date("2026-02-18T00:00:00.000Z"),
          endDate: new Date("2026-04-17T23:59:59.000Z"),
          note: "Preço intermédio",
        },
        {
          name: "Fase 3",
          price: 14.0,
          startDate: new Date("2026-04-18T00:00:00.000Z"),
          endDate: new Date("2026-05-03T23:59:59.000Z"),
          note: "Fase final - últimas vagas",
        },
      ],
    },
  ];

  for (const variantData of variants) {
    const { pricingPhases, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`✅ Created variant: ${variant.name}`);

    // Create pricing phases linked to eventId
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: "EUR",
          note: phase.note,
        },
      });
    }

    console.log(`   - Created ${pricingPhases.length} pricing phases`);
  }

  // Step 6: Create FAQs
  console.log("❓ Creating FAQs...");

  const faqsData = [
    {
      questionPt: "O Trail do Vale é competitivo?",
      answerPt:
        "Sim! As provas de 14K (Mini Trail), 20K (Trail Curto) e 34K (Trail Longo) são competitivas, com classificação geral individual (M/F), classificação por escalão etário e classificação por equipas. Apenas a Caminhada de 10K é não competitiva.",
      questionEn: "Is Trail do Vale competitive?",
      answerEn:
        "Yes! The 14K (Mini Trail), 20K (Short Trail), and 34K (Long Trail) races are competitive, with overall individual classification (M/F), age group classification, and team classification. Only the 10K Walk is non-competitive.",
      questionEs: "¿El Trail do Vale es competitivo?",
      answerEs:
        "¡Sí! Las pruebas de 14K (Mini Trail), 20K (Trail Corto) y 34K (Trail Largo) son competitivas, con clasificación general individual (M/F), clasificación por grupo de edad y clasificación por equipos. Solo la Caminata de 10K es no competitiva.",
      questionFr: "Le Trail do Vale est-il compétitif ?",
      answerFr:
        "Oui ! Les épreuves de 14K (Mini Trail), 20K (Trail Court) et 34K (Trail Long) sont compétitives, avec classement général individuel (M/F), classement par catégorie d'âge et classement par équipes. Seule la Randonnée de 10K est non compétitive.",
      questionDe: "Ist der Trail do Vale wettbewerbsorientiert?",
      answerDe:
        "Ja! Die 14K (Mini Trail), 20K (Kurzer Trail) und 34K (Langer Trail) Rennen sind wettbewerbsorientiert, mit Gesamteinzelklassifizierung (M/F), Altersklassifizierung und Teamklassifizierung. Nur die 10K Wanderung ist nicht wettbewerbsorientiert.",
      questionIt: "Il Trail do Vale è competitivo?",
      answerIt:
        "Sì! Le gare di 14K (Mini Trail), 20K (Trail Corto) e 34K (Trail Lungo) sono competitive, con classificazione generale individuale (M/F), classificazione per fascia d'età e classificazione a squadre. Solo la Camminata di 10K è non competitiva.",
    },
    {
      questionPt: "Onde é a partida e a meta?",
      answerPt:
        "A partida e chegada são na sede da ARCAR (Associação Recreativa e Cultural de Além da Ribeira), localizada em Vale Venteiro, freguesia de Além da Ribeira/Pedreira, Tomar. Coordenadas GPS: 39.6149, -8.4096.",
      questionEn: "Where is the start and finish?",
      answerEn:
        "The start and finish are at the ARCAR headquarters (Cultural and Recreational Association of Além da Ribeira), located in Vale Venteiro, Além da Ribeira/Pedreira parish, Tomar. GPS coordinates: 39.6149, -8.4096.",
      questionEs: "¿Dónde está la salida y la meta?",
      answerEs:
        "La salida y llegada están en la sede de ARCAR (Asociación Recreativa y Cultural de Além da Ribeira), ubicada en Vale Venteiro, parroquia de Além da Ribeira/Pedreira, Tomar. Coordenadas GPS: 39.6149, -8.4096.",
      questionFr: "Où sont le départ et l'arrivée ?",
      answerFr:
        "Le départ et l'arrivée sont au siège d'ARCAR (Association Récréative et Culturelle d'Além da Ribeira), situé à Vale Venteiro, paroisse d'Além da Ribeira/Pedreira, Tomar. Coordonnées GPS : 39.6149, -8.4096.",
      questionDe: "Wo sind Start und Ziel?",
      answerDe:
        "Start und Ziel befinden sich am ARCAR-Hauptsitz (Kultur- und Freizeitverein Além da Ribeira) in Vale Venteiro, Gemeinde Além da Ribeira/Pedreira, Tomar. GPS-Koordinaten: 39.6149, -8.4096.",
      questionIt: "Dove sono la partenza e l'arrivo?",
      answerIt:
        "La partenza e l'arrivo sono presso la sede ARCAR (Associazione Ricreativa e Culturale di Além da Ribeira), situata a Vale Venteiro, parrocchia di Além da Ribeira/Pedreira, Tomar. Coordinate GPS: 39.6149, -8.4096.",
    },
    {
      questionPt: "É preciso material obrigatório?",
      answerPt:
        "Sim! Para todas as provas competitivas (14K, 20K, 34K), é obrigatório ter: telemóvel com bateria e saldo, apito, manta térmica, dorsal visível e recipiente para líquidos. A falta de qualquer item resulta em penalização ou desclassificação. A Caminhada de 10K não tem material obrigatório.",
      questionEn: "Is mandatory equipment required?",
      answerEn:
        "Yes! For all competitive races (14K, 20K, 34K), the following is mandatory: mobile phone with battery and credit, whistle, thermal blanket, visible race bib, and liquid container. Missing any item results in penalty or disqualification. The 10K Walk has no mandatory equipment.",
      questionEs: "¿Se requiere material obligatorio?",
      answerEs:
        "¡Sí! Para todas las pruebas competitivas (14K, 20K, 34K), es obligatorio tener: teléfono móvil con batería y saldo, silbato, manta térmica, dorsal visible y recipiente para líquidos. La falta de cualquier elemento resulta en penalización o descalificación. La Caminata de 10K no tiene material obligatorio.",
      questionFr: "Un équipement obligatoire est-il requis ?",
      answerFr:
        "Oui ! Pour toutes les épreuves compétitives (14K, 20K, 34K), il est obligatoire d'avoir : téléphone portable avec batterie et crédit, sifflet, couverture thermique, dossard visible et récipient pour liquides. L'absence de tout élément entraîne une pénalité ou une disqualification. La Randonnée de 10K n'a pas d'équipement obligatoire.",
      questionDe: "Ist obligatorische Ausrüstung erforderlich?",
      answerDe:
        "Ja! Für alle Wettbewerbsrennen (14K, 20K, 34K) ist Folgendes obligatorisch: Mobiltelefon mit Batterie und Guthaben, Pfeife, Thermodecke, sichtbare Startnummer und Flüssigkeitsbehälter. Das Fehlen eines Gegenstands führt zu einer Strafe oder Disqualifikation. Die 10K Wanderung hat keine obligatorische Ausrüstung.",
      questionIt: "È richiesta attrezzatura obbligatoria?",
      answerIt:
        "Sì! Per tutte le gare competitive (14K, 20K, 34K), è obbligatorio avere: telefono cellulare con batteria e credito, fischietto, coperta termica, pettorale visibile e contenitore per liquidi. La mancanza di qualsiasi elemento comporta penalità o squalifica. La Camminata di 10K non ha attrezzatura obbligatoria.",
    },
    {
      questionPt: "Existe limite de participantes?",
      answerPt:
        "Sim! Os limites são: Trail Longo 34K - 150 participantes, Trail Curto 20K - 250 participantes, Mini Trail 14K - 250 participantes, Caminhada 10K - 300 participantes. As inscrições encerram quando atingido o limite ou em 03/05/2026 às 23:59, consoante o que acontecer primeiro.",
      questionEn: "Is there a participant limit?",
      answerEn:
        "Yes! The limits are: Long Trail 34K - 150 participants, Short Trail 20K - 250 participants, Mini Trail 14K - 250 participants, Walk 10K - 300 participants. Registration closes when the limit is reached or on 03/05/2026 at 23:59, whichever comes first.",
      questionEs: "¿Hay límite de participantes?",
      answerEs:
        "¡Sí! Los límites son: Trail Largo 34K - 150 participantes, Trail Corto 20K - 250 participantes, Mini Trail 14K - 250 participantes, Caminata 10K - 300 participantes. La inscripción cierra cuando se alcanza el límite o el 03/05/2026 a las 23:59, lo que ocurra primero.",
      questionFr: "Y a-t-il une limite de participants ?",
      answerFr:
        "Oui ! Les limites sont : Trail Long 34K - 150 participants, Trail Court 20K - 250 participants, Mini Trail 14K - 250 participants, Randonnée 10K - 300 participants. L'inscription ferme lorsque la limite est atteinte ou le 03/05/2026 à 23:59, selon la première éventualité.",
      questionDe: "Gibt es eine Teilnehmerbegrenzung?",
      answerDe:
        "Ja! Die Grenzen sind: Langer Trail 34K - 150 Teilnehmer, Kurzer Trail 20K - 250 Teilnehmer, Mini Trail 14K - 250 Teilnehmer, Wanderung 10K - 300 Teilnehmer. Die Anmeldung schließt, wenn die Grenze erreicht ist oder am 03.05.2026 um 23:59 Uhr, je nachdem, was zuerst eintritt.",
      questionIt: "C'è un limite di partecipanti?",
      answerIt:
        "Sì! I limiti sono: Trail Lungo 34K - 150 partecipanti, Trail Corto 20K - 250 partecipanti, Mini Trail 14K - 250 partecipanti, Camminata 10K - 300 partecipanti. Le iscrizioni chiudono quando si raggiunge il limite o il 03/05/2026 alle 23:59, a seconda di quale evento si verifica per primo.",
    },
    {
      questionPt: "O evento realiza-se com mau tempo?",
      answerPt:
        "Sim, o evento realiza-se com mau tempo, salvo se a organização considerar que existem condições de risco para os participantes. Em caso de cancelamento por condições meteorológicas extremas, a organização comunicará através dos canais oficiais (Facebook e Lap2Go).",
      questionEn: "Does the event take place in bad weather?",
      answerEn:
        "Yes, the event takes place in bad weather, unless the organization considers there are risk conditions for participants. In case of cancellation due to extreme weather conditions, the organization will communicate through official channels (Facebook and Lap2Go).",
      questionEs: "¿El evento se realiza con mal tiempo?",
      answerEs:
        "Sí, el evento se realiza con mal tiempo, a menos que la organización considere que existen condiciones de riesgo para los participantes. En caso de cancelación por condiciones meteorológicas extremas, la organización comunicará a través de los canales oficiales (Facebook y Lap2Go).",
      questionFr: "L'événement a-t-il lieu par mauvais temps ?",
      answerFr:
        "Oui, l'événement a lieu par mauvais temps, sauf si l'organisation considère qu'il existe des conditions à risque pour les participants. En cas d'annulation en raison de conditions météorologiques extrêmes, l'organisation communiquera via les canaux officiels (Facebook et Lap2Go).",
      questionDe: "Findet die Veranstaltung bei schlechtem Wetter statt?",
      answerDe:
        "Ja, die Veranstaltung findet bei schlechtem Wetter statt, es sei denn, die Organisation ist der Ansicht, dass Risikobedingungen für die Teilnehmer bestehen. Im Falle einer Absage aufgrund extremer Wetterbedingungen wird die Organisation über offizielle Kanäle (Facebook und Lap2Go) kommunizieren.",
      questionIt: "L'evento si svolge con il maltempo?",
      answerIt:
        "Sì, l'evento si svolge con il maltempo, a meno che l'organizzazione non consideri che esistano condizioni di rischio per i partecipanti. In caso di cancellazione a causa di condizioni meteorologiche estreme, l'organizzazione comunicherà attraverso i canali ufficiali (Facebook e Lap2Go).",
    },
    {
      questionPt: "Posso transferir a inscrição?",
      answerPt:
        "Sim, é possível transferir a inscrição para outro atleta até datas específicas definidas no regulamento, mediante o pagamento de uma taxa. A transferência deve ser solicitada através da plataforma Lap2Go. Consulte o regulamento oficial para datas limite e valores das taxas.",
      questionEn: "Can I transfer my registration?",
      answerEn:
        "Yes, it is possible to transfer registration to another athlete until specific dates defined in the regulations, upon payment of a fee. The transfer must be requested through the Lap2Go platform. Consult the official regulations for deadlines and fee amounts.",
      questionEs: "¿Puedo transferir la inscripción?",
      answerEs:
        "Sí, es posible transferir la inscripción a otro atleta hasta fechas específicas definidas en el reglamento, mediante el pago de una tasa. La transferencia debe solicitarse a través de la plataforma Lap2Go. Consulte el reglamento oficial para las fechas límite y los montos de las tasas.",
      questionFr: "Puis-je transférer mon inscription ?",
      answerFr:
        "Oui, il est possible de transférer l'inscription à un autre athlète jusqu'à des dates spécifiques définies dans le règlement, moyennant le paiement d'un frais. Le transfert doit être demandé via la plateforme Lap2Go. Consultez le règlement officiel pour les dates limites et les montants des frais.",
      questionDe: "Kann ich meine Anmeldung übertragen?",
      answerDe:
        "Ja, es ist möglich, die Anmeldung auf einen anderen Athleten zu übertragen, bis zu bestimmten, in den Vorschriften festgelegten Daten, gegen Zahlung einer Gebühr. Die Übertragung muss über die Lap2Go-Plattform beantragt werden. Konsultieren Sie die offiziellen Vorschriften für Fristen und Gebührenbeträge.",
      questionIt: "Posso trasferire l'iscrizione?",
      answerIt:
        "Sì, è possibile trasferire l'iscrizione a un altro atleta fino a date specifiche definite nel regolamento, dietro pagamento di una tassa. Il trasferimento deve essere richiesto tramite la piattaforma Lap2Go. Consultare il regolamento ufficiale per le scadenze e gli importi delle tasse.",
    },
    {
      questionPt: "Há reembolso em caso de desistência?",
      answerPt:
        "Os reembolsos são limitados e apenas concedidos em casos específicos: motivos médicos comprovados (atestado médico) até datas determinadas no regulamento. Não há reembolso por desistência voluntária. Em caso de doença/lesão, deve apresentar atestado médico e solicitar reembolso dentro dos prazos estabelecidos. Consulte o regulamento para detalhes completos.",
      questionEn: "Is there a refund in case of withdrawal?",
      answerEn:
        "Refunds are limited and only granted in specific cases: proven medical reasons (medical certificate) until dates determined in the regulations. There is no refund for voluntary withdrawal. In case of illness/injury, you must present a medical certificate and request a refund within the established deadlines. Consult the regulations for full details.",
      questionEs: "¿Hay reembolso en caso de desistimiento?",
      answerEs:
        "Los reembolsos son limitados y solo se otorgan en casos específicos: razones médicas comprobadas (certificado médico) hasta las fechas determinadas en el reglamento. No hay reembolso por desistimiento voluntario. En caso de enfermedad/lesión, debe presentar un certificado médico y solicitar un reembolso dentro de los plazos establecidos. Consulte el reglamento para más detalles.",
      questionFr: "Y a-t-il un remboursement en cas de retrait ?",
      answerFr:
        "Les remboursements sont limités et accordés uniquement dans des cas spécifiques : raisons médicales prouvées (certificat médical) jusqu'à des dates déterminées dans le règlement. Il n'y a pas de remboursement pour un retrait volontaire. En cas de maladie/blessure, vous devez présenter un certificat médical et demander un remboursement dans les délais établis. Consultez le règlement pour tous les détails.",
      questionDe: "Gibt es eine Rückerstattung bei Rücktritt?",
      answerDe:
        "Rückerstattungen sind begrenzt und werden nur in bestimmten Fällen gewährt: nachgewiesene medizinische Gründe (ärztliches Attest) bis zu in den Vorschriften festgelegten Daten. Es gibt keine Rückerstattung für freiwilligen Rücktritt. Im Falle von Krankheit/Verletzung müssen Sie ein ärztliches Attest vorlegen und innerhalb der festgelegten Fristen eine Rückerstattung beantragen. Konsultieren Sie die Vorschriften für vollständige Details.",
      questionIt: "C'è un rimborso in caso di ritiro?",
      answerIt:
        "I rimborsi sono limitati e concessi solo in casi specifici: motivi medici comprovati (certificato medico) fino alle date determinate nel regolamento. Non c'è rimborso per ritiro volontario. In caso di malattia/infortunio, è necessario presentare un certificato medico e richiedere un rimborso entro le scadenze stabilite. Consultare il regolamento per i dettagli completi.",
    },
  ];

  for (const faqData of faqsData) {
    const faq = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        question: faqData.questionPt,
        answer: faqData.answerPt,
      },
    });

    const faqTranslations = [
      {
        lang: "pt" as const,
        question: faqData.questionPt,
        answer: faqData.answerPt,
      },
      {
        lang: "en" as const,
        question: faqData.questionEn,
        answer: faqData.answerEn,
      },
      {
        lang: "es" as const,
        question: faqData.questionEs,
        answer: faqData.answerEs,
      },
      {
        lang: "fr" as const,
        question: faqData.questionFr,
        answer: faqData.answerFr,
      },
      {
        lang: "de" as const,
        question: faqData.questionDe,
        answer: faqData.answerDe,
      },
      {
        lang: "it" as const,
        question: faqData.questionIt,
        answer: faqData.answerIt,
      },
    ];

    for (const trans of faqTranslations) {
      await prisma.eventFAQTranslation.upsert({
        where: {
          faqId_language: {
            faqId: faq.id,
            language: trans.lang,
          },
        },
        update: {
          question: trans.question,
          answer: trans.answer,
        },
        create: {
          faqId: faq.id,
          language: trans.lang,
          question: trans.question,
          answer: trans.answer,
        },
      });
    }
  }

  console.log(`✅ Created ${faqsData.length} FAQs with translations`);

  console.log("\n🎉 Seeding completed successfully!");
  console.log(
    `   Location: ${event.city} at ${event.latitude}, ${event.longitude}`
  );
  console.log(`   Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   Sport: TRAIL`);
  console.log(
    `   Variants: 4 (Trail Longo 34K, Trail Curto 20K, Mini Trail 14K, Caminhada 10K)`
  );
  console.log(`   Website: ${event.externalUrl}`);
  console.log(`   ✅ SEO metadata for all 6 languages`);
  console.log(`   ✅ ${faqsData.length} FAQs in all 6 languages`);
  console.log(`   ✅ GPS coordinates: ${event.latitude}, ${event.longitude}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
