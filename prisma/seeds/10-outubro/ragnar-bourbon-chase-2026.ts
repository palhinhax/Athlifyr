/**
 * Seed Ragnar Road Bourbon Chase 2026
 * Complete with translations in all 6 languages
 *
 * A unique 200-mile relay race through Kentucky's bourbon country
 * October 2-3, 2026 | Clermont to Lexington, KY
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Ragnar Road Bourbon Chase 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "ragnar-bourbon-chase-2026" },
    update: {
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**Uma experiência única de corrida em estafeta de 200 milhas através do belo Kentucky!**

### 🏃 A Corrida

Corrida em estafeta de aproximadamente 331 km (206 milhas) de Clermont a Lexington, ao longo de 2 dias e 1 noite. As equipas correm em sistema de estafeta, parando em destilarias de bourbon ao longo do percurso.

### 🏇 Destaques

- **🥃 Destilarias de Bourbon**: Paragens em destilarias icónicas incluindo Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail e outras
- **🏇 Horse Country**: Corrida através da famosa região de cavalos do Kentucky
- **🎉 Festas de Troca**: Grandes celebrações nos pontos de troca nas destilarias
- **🏁 Celebração Final**: Linha de chegada na Lexington Brewing & Distilling Company com provas de bourbon e música ao vivo
- **🌙 Corrida Noturna**: Experiência de corrida noturna das 20h às 6h30 com equipamento de segurança obrigatório

### 📊 Formato

- **36 percursos** divididos entre os membros da equipa
- Colinas onduladas do Kentucky bluegrass
- Vistas panorâmicas do campo
- Ganho de elevação das colinas onduladas

### ⚠️ Requisitos

- **Idade mínima**: 21+ anos (evento com degustação de bourbon)
- **Voluntariado**: 1 voluntário por equipa completa (exceto equipas sprint)
- **Equipamento de segurança**: Obrigatório para corrida noturna (20h-6h30)
- **Recolha de dorsais**: 1 de outubro na Angel's Envy Distillery em Louisville`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-10-02T09:00:00Z"), // 5:00 AM EDT = 09:00 UTC
      endDate: new Date("2026-10-03T20:00:00Z"), // Approximate finish time
      city: "Clermont",
      country: "United States",
      latitude: 37.85,
      longitude: -85.62,
      googleMapsUrl: "https://maps.app.goo.gl/clermont-to-lexington",
      externalUrl: "https://runragnar.com/pages/race-road-bourbon-chase",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-09-15T23:59:59Z"),
    },
    create: {
      title: "Ragnar Road Bourbon Chase",
      slug: "ragnar-bourbon-chase-2026",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**Uma experiência única de corrida em estafeta de 200 milhas através do belo Kentucky!**

### 🏃 A Corrida

Corrida em estafeta de aproximadamente 331 km (206 milhas) de Clermont a Lexington, ao longo de 2 dias e 1 noite. As equipas correm em sistema de estafeta, parando em destilarias de bourbon ao longo do percurso.

### 🏇 Destaques

- **🥃 Destilarias de Bourbon**: Paragens em destilarias icónicas incluindo Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail e outras
- **🏇 Horse Country**: Corrida através da famosa região de cavalos do Kentucky
- **🎉 Festas de Troca**: Grandes celebrações nos pontos de troca nas destilarias
- **🏁 Celebração Final**: Linha de chegada na Lexington Brewing & Distilling Company com provas de bourbon e música ao vivo
- **🌙 Corrida Noturna**: Experiência de corrida noturna das 20h às 6h30 com equipamento de segurança obrigatório

### 📊 Formato

- **36 percursos** divididos entre os membros da equipa
- Colinas onduladas do Kentucky bluegrass
- Vistas panorâmicas do campo
- Ganho de elevação das colinas onduladas

### ⚠️ Requisitos

- **Idade mínima**: 21+ anos (evento com degustação de bourbon)
- **Voluntariado**: 1 voluntário por equipa completa (exceto equipas sprint)
- **Equipamento de segurança**: Obrigatório para corrida noturna (20h-6h30)
- **Recolha de dorsais**: 1 de outubro na Angel's Envy Distillery em Louisville`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-10-02T09:00:00Z"),
      endDate: new Date("2026-10-03T20:00:00Z"),
      city: "Clermont",
      country: "United States",
      latitude: 37.85,
      longitude: -85.62,
      googleMapsUrl: "https://maps.app.goo.gl/clermont-to-lexington",
      externalUrl: "https://runragnar.com/pages/race-road-bourbon-chase",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-09-15T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  console.log("📝 Upserting translations for 6 languages...");

  // Portuguese (European)
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.pt,
      },
    },
    update: {
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**Uma experiência única de corrida em estafeta de 200 milhas através do belo Kentucky!**

### 🏃 A Corrida

Corrida em estafeta de aproximadamente 331 km (206 milhas) de Clermont a Lexington, ao longo de 2 dias e 1 noite. As equipas correm em sistema de estafeta, parando em destilarias de bourbon ao longo do percurso.

### 🏇 Destaques

- **🥃 Destilarias de Bourbon**: Paragens em destilarias icónicas incluindo Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail e outras
- **🏇 Horse Country**: Corrida através da famosa região de cavalos do Kentucky
- **🎉 Festas de Troca**: Grandes celebrações nos pontos de troca nas destilarias
- **🏁 Celebração Final**: Linha de chegada na Lexington Brewing & Distilling Company com provas de bourbon e música ao vivo
- **🌙 Corrida Noturna**: Experiência de corrida noturna das 20h às 6h30 com equipamento de segurança obrigatório

### 📊 Formato

- **36 percursos** divididos entre os membros da equipa
- Colinas onduladas do Kentucky bluegrass
- Vistas panorâmicas do campo
- Ganho de elevação das colinas onduladas

### ⚠️ Requisitos

- **Idade mínima**: 21+ anos (evento com degustação de bourbon)
- **Voluntariado**: 1 voluntário por equipa completa (exceto equipas sprint)
- **Equipamento de segurança**: Obrigatório para corrida noturna (20h-6h30)
- **Recolha de dorsais**: 1 de outubro na Angel's Envy Distillery em Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - Estafeta 331km Kentucky | Athlifyr",
      metaDescription:
        "Corrida em estafeta única de 331km através do Kentucky bourbon country. 2-3 outubro 2026, de Clermont a Lexington. Paragens em destilarias e celebração final.",
    },
    create: {
      eventId: event.id,
      language: Language.pt,
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**Uma experiência única de corrida em estafeta de 200 milhas através do belo Kentucky!**

### 🏃 A Corrida

Corrida em estafeta de aproximadamente 331 km (206 milhas) de Clermont a Lexington, ao longo de 2 dias e 1 noite. As equipas correm em sistema de estafeta, parando em destilarias de bourbon ao longo do percurso.

### 🏇 Destaques

- **🥃 Destilarias de Bourbon**: Paragens em destilarias icónicas incluindo Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail e outras
- **🏇 Horse Country**: Corrida através da famosa região de cavalos do Kentucky
- **🎉 Festas de Troca**: Grandes celebrações nos pontos de troca nas destilarias
- **🏁 Celebração Final**: Linha de chegada na Lexington Brewing & Distilling Company com provas de bourbon e música ao vivo
- **🌙 Corrida Noturna**: Experiência de corrida noturna das 20h às 6h30 com equipamento de segurança obrigatório

### 📊 Formato

- **36 percursos** divididos entre os membros da equipa
- Colinas onduladas do Kentucky bluegrass
- Vistas panorâmicas do campo
- Ganho de elevação das colinas onduladas

### ⚠️ Requisitos

- **Idade mínima**: 21+ anos (evento com degustação de bourbon)
- **Voluntariado**: 1 voluntário por equipa completa (exceto equipas sprint)
- **Equipamento de segurança**: Obrigatório para corrida noturna (20h-6h30)
- **Recolha de dorsais**: 1 de outubro na Angel's Envy Distillery em Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - Estafeta 331km Kentucky | Athlifyr",
      metaDescription:
        "Corrida em estafeta única de 331km através do Kentucky bourbon country. 2-3 outubro 2026, de Clermont a Lexington. Paragens em destilarias e celebração final.",
    },
  });

  // English
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.en,
      },
    },
    update: {
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**A unique 200-mile relay race experience through beautiful Kentucky!**

### 🏃 The Race

A relay race covering approximately 206 miles (331 km) from Clermont to Lexington over 2 days and 1 night. Teams run relay-style, stopping at bourbon distilleries along the way.

### 🏇 Highlights

- **🥃 Bourbon Distilleries**: Stops at iconic distilleries including Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail, and more
- **🏇 Horse Country**: Running through Kentucky's famous horse country
- **🎉 Exchange Parties**: Major celebrations at exchange points at distilleries
- **🏁 Finish Line Celebration**: Finish at Lexington Brewing & Distilling Company with bourbon tastings and live music
- **🌙 Night Running**: Night running experience from 8 PM to 6:30 AM with required safety gear

### 📊 Format

- **36 legs** divided among team members
- Rolling Kentucky bluegrass hills
- Scenic countryside views
- Elevation gain from rolling hills

### ⚠️ Requirements

- **Minimum age**: 21+ years old (bourbon tasting event)
- **Volunteer requirement**: 1 volunteer per full team (except sprint teams)
- **Safety gear**: Required for night running (8 PM-6:30 AM)
- **Packet pickup**: October 1st at Angel's Envy Distillery in Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - 206-Mile Kentucky Relay | Athlifyr",
      metaDescription:
        "Unique 206-mile relay race through Kentucky bourbon country. October 2-3, 2026, from Clermont to Lexington. Distillery stops and finish line celebration.",
    },
    create: {
      eventId: event.id,
      language: Language.en,
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**A unique 200-mile relay race experience through beautiful Kentucky!**

### 🏃 The Race

A relay race covering approximately 206 miles (331 km) from Clermont to Lexington over 2 days and 1 night. Teams run relay-style, stopping at bourbon distilleries along the way.

### 🏇 Highlights

- **🥃 Bourbon Distilleries**: Stops at iconic distilleries including Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail, and more
- **🏇 Horse Country**: Running through Kentucky's famous horse country
- **🎉 Exchange Parties**: Major celebrations at exchange points at distilleries
- **🏁 Finish Line Celebration**: Finish at Lexington Brewing & Distilling Company with bourbon tastings and live music
- **🌙 Night Running**: Night running experience from 8 PM to 6:30 AM with required safety gear

### 📊 Format

- **36 legs** divided among team members
- Rolling Kentucky bluegrass hills
- Scenic countryside views
- Elevation gain from rolling hills

### ⚠️ Requirements

- **Minimum age**: 21+ years old (bourbon tasting event)
- **Volunteer requirement**: 1 volunteer per full team (except sprint teams)
- **Safety gear**: Required for night running (8 PM-6:30 AM)
- **Packet pickup**: October 1st at Angel's Envy Distillery in Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - 206-Mile Kentucky Relay | Athlifyr",
      metaDescription:
        "Unique 206-mile relay race through Kentucky bourbon country. October 2-3, 2026, from Clermont to Lexington. Distillery stops and finish line celebration.",
    },
  });

  // Spanish
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.es,
      },
    },
    update: {
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**¡Una experiencia única de carrera de relevos de 200 millas a través del hermoso Kentucky!**

### 🏃 La Carrera

Una carrera de relevos que cubre aproximadamente 331 km (206 millas) desde Clermont hasta Lexington durante 2 días y 1 noche. Los equipos corren en estilo de relevos, parando en destilerías de bourbon en el camino.

### 🏇 Destacados

- **🥃 Destilerías de Bourbon**: Paradas en destilerías icónicas incluyendo Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail y más
- **🏇 Horse Country**: Corriendo a través de la famosa región de caballos de Kentucky
- **🎉 Fiestas de Intercambio**: Grandes celebraciones en los puntos de intercambio en las destilerías
- **🏁 Celebración de Meta**: Llegada en Lexington Brewing & Distilling Company con catas de bourbon y música en vivo
- **🌙 Carrera Nocturna**: Experiencia de carrera nocturna de 8 PM a 6:30 AM con equipo de seguridad requerido

### 📊 Formato

- **36 tramos** divididos entre los miembros del equipo
- Colinas onduladas de Kentucky bluegrass
- Vistas panorámicas del campo
- Ganancia de elevación de las colinas onduladas

### ⚠️ Requisitos

- **Edad mínima**: 21+ años (evento con degustación de bourbon)
- **Requisito de voluntario**: 1 voluntario por equipo completo (excepto equipos sprint)
- **Equipo de seguridad**: Requerido para carrera nocturna (8 PM-6:30 AM)
- **Recogida de paquetes**: 1 de octubre en Angel's Envy Distillery en Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - Relevo 331km Kentucky | Athlifyr",
      metaDescription:
        "Carrera de relevos única de 331km a través del bourbon country de Kentucky. 2-3 octubre 2026, de Clermont a Lexington. Paradas en destilerías y celebración final.",
    },
    create: {
      eventId: event.id,
      language: Language.es,
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**¡Una experiencia única de carrera de relevos de 200 millas a través del hermoso Kentucky!**

### 🏃 La Carrera

Una carrera de relevos que cubre aproximadamente 331 km (206 millas) desde Clermont hasta Lexington durante 2 días y 1 noche. Los equipos corren en estilo de relevos, parando en destilerías de bourbon en el camino.

### 🏇 Destacados

- **🥃 Destilerías de Bourbon**: Paradas en destilerías icónicas incluyendo Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail y más
- **🏇 Horse Country**: Corriendo a través de la famosa región de caballos de Kentucky
- **🎉 Fiestas de Intercambio**: Grandes celebraciones en los puntos de intercambio en las destilerías
- **🏁 Celebración de Meta**: Llegada en Lexington Brewing & Distilling Company con catas de bourbon y música en vivo
- **🌙 Carrera Nocturna**: Experiencia de carrera nocturna de 8 PM a 6:30 AM con equipo de seguridad requerido

### 📊 Formato

- **36 tramos** divididos entre los miembros del equipo
- Colinas onduladas de Kentucky bluegrass
- Vistas panorámicas del campo
- Ganancia de elevación de las colinas onduladas

### ⚠️ Requisitos

- **Edad mínima**: 21+ años (evento con degustación de bourbon)
- **Requisito de voluntario**: 1 voluntario por equipo completo (excepto equipos sprint)
- **Equipo de seguridad**: Requerido para carrera nocturna (8 PM-6:30 AM)
- **Recogida de paquetes**: 1 de octubre en Angel's Envy Distillery en Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - Relevo 331km Kentucky | Athlifyr",
      metaDescription:
        "Carrera de relevos única de 331km a través del bourbon country de Kentucky. 2-3 octubre 2026, de Clermont a Lexington. Paradas en destilerías y celebración final.",
    },
  });

  // French
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.fr,
      },
    },
    update: {
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**Une expérience unique de course à relais de 200 miles à travers le magnifique Kentucky !**

### 🏃 La Course

Une course à relais couvrant environ 331 km (206 miles) de Clermont à Lexington sur 2 jours et 1 nuit. Les équipes courent en relais, s'arrêtant dans des distilleries de bourbon en chemin.

### 🏇 Points Forts

- **🥃 Distilleries de Bourbon**: Arrêts dans des distilleries emblématiques dont Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail et plus
- **🏇 Horse Country**: Course à travers la célèbre région des chevaux du Kentucky
- **🎉 Fêtes d'Échange**: Grandes célébrations aux points d'échange dans les distilleries
- **🏁 Célébration d'Arrivée**: Arrivée à Lexington Brewing & Distilling Company avec dégustations de bourbon et musique live
- **🌙 Course Nocturne**: Expérience de course nocturne de 20h à 6h30 avec équipement de sécurité requis

### 📊 Format

- **36 relais** répartis entre les membres de l'équipe
- Collines ondulantes du Kentucky bluegrass
- Vues panoramiques sur la campagne
- Gain d'élévation dû aux collines ondulantes

### ⚠️ Exigences

- **Âge minimum**: 21+ ans (événement avec dégustation de bourbon)
- **Exigence bénévole**: 1 bénévole par équipe complète (sauf équipes sprint)
- **Équipement de sécurité**: Requis pour la course nocturne (20h-6h30)
- **Retrait des dossards**: 1er octobre à Angel's Envy Distillery à Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - Relais 331km Kentucky | Athlifyr",
      metaDescription:
        "Course à relais unique de 331km à travers le bourbon country du Kentucky. 2-3 octobre 2026, de Clermont à Lexington. Arrêts en distilleries et célébration finale.",
    },
    create: {
      eventId: event.id,
      language: Language.fr,
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**Une expérience unique de course à relais de 200 miles à travers le magnifique Kentucky !**

### 🏃 La Course

Une course à relais couvrant environ 331 km (206 miles) de Clermont à Lexington sur 2 jours et 1 nuit. Les équipes courent en relais, s'arrêtant dans des distilleries de bourbon en chemin.

### 🏇 Points Forts

- **🥃 Distilleries de Bourbon**: Arrêts dans des distilleries emblématiques dont Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail et plus
- **🏇 Horse Country**: Course à travers la célèbre région des chevaux du Kentucky
- **🎉 Fêtes d'Échange**: Grandes célébrations aux points d'échange dans les distilleries
- **🏁 Célébration d'Arrivée**: Arrivée à Lexington Brewing & Distilling Company avec dégustations de bourbon et musique live
- **🌙 Course Nocturne**: Expérience de course nocturne de 20h à 6h30 avec équipement de sécurité requis

### 📊 Format

- **36 relais** répartis entre les membres de l'équipe
- Collines ondulantes du Kentucky bluegrass
- Vues panoramiques sur la campagne
- Gain d'élévation dû aux collines ondulantes

### ⚠️ Exigences

- **Âge minimum**: 21+ ans (événement avec dégustation de bourbon)
- **Exigence bénévole**: 1 bénévole par équipe complète (sauf équipes sprint)
- **Équipement de sécurité**: Requis pour la course nocturne (20h-6h30)
- **Retrait des dossards**: 1er octobre à Angel's Envy Distillery à Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - Relais 331km Kentucky | Athlifyr",
      metaDescription:
        "Course à relais unique de 331km à travers le bourbon country du Kentucky. 2-3 octobre 2026, de Clermont à Lexington. Arrêts en distilleries et célébration finale.",
    },
  });

  // German
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.de,
      },
    },
    update: {
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**Ein einzigartiges 200-Meilen-Staffellauf-Erlebnis durch das wunderschöne Kentucky!**

### 🏃 Das Rennen

Ein Staffellauf über etwa 331 km (206 Meilen) von Clermont nach Lexington über 2 Tage und 1 Nacht. Teams laufen im Staffel-Stil und machen Halt an Bourbon-Destillerien unterwegs.

### 🏇 Höhepunkte

- **🥃 Bourbon-Destillerien**: Stopps an ikonischen Destillerien wie Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail und mehr
- **🏇 Horse Country**: Laufen durch Kentuckys berühmtes Pferdegebiet
- **🎉 Wechsel-Partys**: Große Feiern an den Wechselpunkten in den Destillerien
- **🏁 Zielfeier**: Zieleinlauf bei Lexington Brewing & Distilling Company mit Bourbon-Verkostungen und Live-Musik
- **🌙 Nachtlauf**: Nachtlauf-Erlebnis von 20 Uhr bis 6:30 Uhr mit erforderlicher Sicherheitsausrüstung

### 📊 Format

- **36 Etappen** aufgeteilt auf Teammitglieder
- Sanfte Kentucky-Bluegrass-Hügel
- Malerische Landschaftsansichten
- Höhengewinn durch sanfte Hügel

### ⚠️ Anforderungen

- **Mindestalter**: 21+ Jahre (Bourbon-Verkostungsevent)
- **Freiwilligen-Anforderung**: 1 Freiwilliger pro vollständigem Team (außer Sprint-Teams)
- **Sicherheitsausrüstung**: Erforderlich für Nachtlauf (20 Uhr-6:30 Uhr)
- **Startnummernausgabe**: 1. Oktober bei Angel's Envy Distillery in Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - 331km Kentucky Staffellauf | Athlifyr",
      metaDescription:
        "Einzigartiger 331km Staffellauf durch Kentuckys Bourbon Country. 2-3 Oktober 2026, von Clermont nach Lexington. Destillerie-Stopps und Zielfeier.",
    },
    create: {
      eventId: event.id,
      language: Language.de,
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**Ein einzigartiges 200-Meilen-Staffellauf-Erlebnis durch das wunderschöne Kentucky!**

### 🏃 Das Rennen

Ein Staffellauf über etwa 331 km (206 Meilen) von Clermont nach Lexington über 2 Tage und 1 Nacht. Teams laufen im Staffel-Stil und machen Halt an Bourbon-Destillerien unterwegs.

### 🏇 Höhepunkte

- **🥃 Bourbon-Destillerien**: Stopps an ikonischen Destillerien wie Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail und mehr
- **🏇 Horse Country**: Laufen durch Kentuckys berühmtes Pferdegebiet
- **🎉 Wechsel-Partys**: Große Feiern an den Wechselpunkten in den Destillerien
- **🏁 Zielfeier**: Zieleinlauf bei Lexington Brewing & Distilling Company mit Bourbon-Verkostungen und Live-Musik
- **🌙 Nachtlauf**: Nachtlauf-Erlebnis von 20 Uhr bis 6:30 Uhr mit erforderlicher Sicherheitsausrüstung

### 📊 Format

- **36 Etappen** aufgeteilt auf Teammitglieder
- Sanfte Kentucky-Bluegrass-Hügel
- Malerische Landschaftsansichten
- Höhengewinn durch sanfte Hügel

### ⚠️ Anforderungen

- **Mindestalter**: 21+ Jahre (Bourbon-Verkostungsevent)
- **Freiwilligen-Anforderung**: 1 Freiwilliger pro vollständigem Team (außer Sprint-Teams)
- **Sicherheitsausrüstung**: Erforderlich für Nachtlauf (20 Uhr-6:30 Uhr)
- **Startnummernausgabe**: 1. Oktober bei Angel's Envy Distillery in Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - 331km Kentucky Staffellauf | Athlifyr",
      metaDescription:
        "Einzigartiger 331km Staffellauf durch Kentuckys Bourbon Country. 2-3 Oktober 2026, von Clermont nach Lexington. Destillerie-Stopps und Zielfeier.",
    },
  });

  // Italian
  await prisma.eventTranslation.upsert({
    where: {
      eventId_language: {
        eventId: event.id,
        language: Language.it,
      },
    },
    update: {
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**Un'esperienza unica di staffetta di 200 miglia attraverso il bellissimo Kentucky!**

### 🏃 La Gara

Una gara a staffetta che copre circa 331 km (206 miglia) da Clermont a Lexington in 2 giorni e 1 notte. I team corrono in staffetta, fermandosi nelle distillerie di bourbon lungo il percorso.

### 🏇 Punti Salienti

- **🥃 Distillerie di Bourbon**: Soste in distillerie iconiche tra cui Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail e altre
- **🏇 Horse Country**: Corsa attraverso la famosa regione dei cavalli del Kentucky
- **🎉 Feste di Cambio**: Grandi celebrazioni ai punti di cambio nelle distillerie
- **🏁 Celebrazione del Traguardo**: Arrivo presso Lexington Brewing & Distilling Company con degustazioni di bourbon e musica dal vivo
- **🌙 Corsa Notturna**: Esperienza di corsa notturna dalle 20:00 alle 6:30 con attrezzatura di sicurezza richiesta

### 📊 Formato

- **36 tratte** divise tra i membri del team
- Colline ondulate del Kentucky bluegrass
- Vedute panoramiche della campagna
- Guadagno di elevazione dalle colline ondulate

### ⚠️ Requisiti

- **Età minima**: 21+ anni (evento con degustazione di bourbon)
- **Requisito volontario**: 1 volontario per team completo (eccetto team sprint)
- **Attrezzatura di sicurezza**: Richiesta per corsa notturna (20:00-6:30)
- **Ritiro pacchi**: 1 ottobre presso Angel's Envy Distillery a Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - Staffetta 331km Kentucky | Athlifyr",
      metaDescription:
        "Staffetta unica di 331km attraverso il bourbon country del Kentucky. 2-3 ottobre 2026, da Clermont a Lexington. Soste in distillerie e celebrazione finale.",
    },
    create: {
      eventId: event.id,
      language: Language.it,
      title: "Ragnar Road Bourbon Chase",
      description: `## 🥃 Ragnar Road Bourbon Chase 2026

**Un'esperienza unica di staffetta di 200 miglia attraverso il bellissimo Kentucky!**

### 🏃 La Gara

Una gara a staffetta che copre circa 331 km (206 miglia) da Clermont a Lexington in 2 giorni e 1 notte. I team corrono in staffetta, fermandosi nelle distillerie di bourbon lungo il percorso.

### 🏇 Punti Salienti

- **🥃 Distillerie di Bourbon**: Soste in distillerie iconiche tra cui Jim Beam, Maker's Mark, Heaven Hill, Wilderness Trail e altre
- **🏇 Horse Country**: Corsa attraverso la famosa regione dei cavalli del Kentucky
- **🎉 Feste di Cambio**: Grandi celebrazioni ai punti di cambio nelle distillerie
- **🏁 Celebrazione del Traguardo**: Arrivo presso Lexington Brewing & Distilling Company con degustazioni di bourbon e musica dal vivo
- **🌙 Corsa Notturna**: Esperienza di corsa notturna dalle 20:00 alle 6:30 con attrezzatura di sicurezza richiesta

### 📊 Formato

- **36 tratte** divise tra i membri del team
- Colline ondulate del Kentucky bluegrass
- Vedute panoramiche della campagna
- Guadagno di elevazione dalle colline ondulate

### ⚠️ Requisiti

- **Età minima**: 21+ anni (evento con degustazione di bourbon)
- **Requisito volontario**: 1 volontario per team completo (eccetto team sprint)
- **Attrezzatura di sicurezza**: Richiesta per corsa notturna (20:00-6:30)
- **Ritiro pacchi**: 1 ottobre presso Angel's Envy Distillery a Louisville`,
      city: "Clermont",
      metaTitle:
        "Ragnar Road Bourbon Chase 2026 - Staffetta 331km Kentucky | Athlifyr",
      metaDescription:
        "Staffetta unica di 331km attraverso il bourbon country del Kentucky. 2-3 ottobre 2026, da Clermont a Lexington. Soste in distillerie e celebrazione finale.",
    },
  });

  console.log(
    "✅ Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Upsert variants separately
  console.log("🏃 Upserting event variants...");

  // Helper function for idempotent variant creation
  const findOrCreateVariant = async (
    name: string,
    data: Record<string, unknown>
  ) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.eventVariant.update({
        where: { id: existing.id },
        data,
      });
    } else {
      // @ts-expect-error - Prisma type inference issue with spread operator
      return await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name,
          ...(data as object),
        },
      });
    }
  };

  // Variant 1: Standard Team (12 runners)
  const standardTeam = await findOrCreateVariant("Standard Team", {
    description:
      "Equipa de 12 corredores, cada corredor faz 3 percursos (média de 27.7km por corredor)",
    distanceKm: 331,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-10-02T09:00:00Z"),
    startTime: "05:00",
    maxParticipants: 12,
    cutoffTimeHours: null,
    itraPoints: null,
    atrpGrade: null,
    mountainLevel: null,
  });

  // Variant 2: Ultra Team (6 runners)
  const ultraTeam = await findOrCreateVariant("Ultra Team", {
    description:
      "Equipa de 6 corredores, cada corredor faz 6 percursos (média de 55.2km por corredor)",
    distanceKm: 331,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-10-02T09:00:00Z"),
    startTime: "05:00",
    maxParticipants: 6,
    cutoffTimeHours: null,
    itraPoints: null,
    atrpGrade: null,
    mountainLevel: null,
  });

  // Variant 3: Sprint Team (6 runners, 1 day)
  const sprintTeam = await findOrCreateVariant("Sprint Team", {
    description:
      "Equipa de 6 corredores, 1 dia, apenas percursos 25-36 (início sábado no Exchange 24)",
    distanceKm: 100,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-10-02T18:00:00Z"), // Starts later on Saturday
    startTime: "14:00",
    maxParticipants: 6,
    cutoffTimeHours: null,
    itraPoints: null,
    atrpGrade: null,
    mountainLevel: null,
  });

  console.log("✅ Variants upserted: Standard Team, Ultra Team, Sprint Team");

  // Step 4: Upsert variant translations separately (ALL 6 languages for each variant)
  console.log("📝 Upserting variant translations...");

  // Standard Team translations
  const standardTeamTranslations = [
    {
      language: Language.pt,
      name: "Standard Team",
      description:
        "Equipa de 12 corredores, cada corredor faz 3 percursos (média de 27.7km por corredor). 2 dias e 1 noite de aventura através do bourbon country do Kentucky.",
    },
    {
      language: Language.en,
      name: "Standard Team",
      description:
        "Team of 12 runners, each runner completes 3 legs (average 17.2 miles per runner). 2 days and 1 night of adventure through Kentucky bourbon country.",
    },
    {
      language: Language.es,
      name: "Equipo Estándar",
      description:
        "Equipo de 12 corredores, cada corredor completa 3 tramos (promedio de 27.7km por corredor). 2 días y 1 noche de aventura a través del bourbon country de Kentucky.",
    },
    {
      language: Language.fr,
      name: "Équipe Standard",
      description:
        "Équipe de 12 coureurs, chaque coureur complète 3 relais (moyenne de 27,7 km par coureur). 2 jours et 1 nuit d'aventure à travers le bourbon country du Kentucky.",
    },
    {
      language: Language.de,
      name: "Standard-Team",
      description:
        "Team von 12 Läufern, jeder Läufer absolviert 3 Etappen (Durchschnitt 27,7 km pro Läufer). 2 Tage und 1 Nacht Abenteuer durch Kentuckys Bourbon Country.",
    },
    {
      language: Language.it,
      name: "Team Standard",
      description:
        "Team di 12 corridori, ogni corridore completa 3 tratte (media 27,7 km per corridore). 2 giorni e 1 notte di avventura attraverso il bourbon country del Kentucky.",
    },
  ];

  for (const translation of standardTeamTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: standardTeam.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: standardTeam.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  // Ultra Team translations
  const ultraTeamTranslations = [
    {
      language: Language.pt,
      name: "Ultra Team",
      description:
        "Equipa de 6 corredores, cada corredor faz 6 percursos (média de 55.2km por corredor). Desafio extremo de resistência através do bourbon country.",
    },
    {
      language: Language.en,
      name: "Ultra Team",
      description:
        "Team of 6 runners, each runner completes 6 legs (average 34.3 miles per runner). Extreme endurance challenge through bourbon country.",
    },
    {
      language: Language.es,
      name: "Equipo Ultra",
      description:
        "Equipo de 6 corredores, cada corredor completa 6 tramos (promedio de 55.2km por corredor). Desafío extremo de resistencia a través del bourbon country.",
    },
    {
      language: Language.fr,
      name: "Équipe Ultra",
      description:
        "Équipe de 6 coureurs, chaque coureur complète 6 relais (moyenne de 55,2 km par coureur). Défi d'endurance extrême à travers le bourbon country.",
    },
    {
      language: Language.de,
      name: "Ultra-Team",
      description:
        "Team von 6 Läufern, jeder Läufer absolviert 6 Etappen (Durchschnitt 55,2 km pro Läufer). Extreme Ausdauer-Herausforderung durch das Bourbon Country.",
    },
    {
      language: Language.it,
      name: "Team Ultra",
      description:
        "Team di 6 corridori, ogni corridore completa 6 tratte (media 55,2 km per corridore). Sfida estrema di resistenza attraverso il bourbon country.",
    },
  ];

  for (const translation of ultraTeamTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: ultraTeam.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: ultraTeam.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  // Sprint Team translations
  const sprintTeamTranslations = [
    {
      language: Language.pt,
      name: "Sprint Team",
      description:
        "Equipa de 6 corredores, 1 dia, apenas percursos 25-36. Começa sábado no Exchange 24. Perfeito para quem quer experimentar um Ragnar sem o compromisso total.",
    },
    {
      language: Language.en,
      name: "Sprint Team",
      description:
        "Team of 6 runners, 1 day, legs 25-36 only. Starts Saturday at Exchange 24. Perfect for those wanting to experience a Ragnar without the full commitment.",
    },
    {
      language: Language.es,
      name: "Equipo Sprint",
      description:
        "Equipo de 6 corredores, 1 día, solo tramos 25-36. Comienza el sábado en Exchange 24. Perfecto para quienes quieren experimentar un Ragnar sin el compromiso completo.",
    },
    {
      language: Language.fr,
      name: "Équipe Sprint",
      description:
        "Équipe de 6 coureurs, 1 jour, relais 25-36 uniquement. Commence samedi à Exchange 24. Parfait pour ceux qui veulent découvrir un Ragnar sans l'engagement total.",
    },
    {
      language: Language.de,
      name: "Sprint-Team",
      description:
        "Team von 6 Läufern, 1 Tag, nur Etappen 25-36. Startet Samstag bei Exchange 24. Perfekt für diejenigen, die einen Ragnar ohne volles Engagement erleben möchten.",
    },
    {
      language: Language.it,
      name: "Team Sprint",
      description:
        "Team di 6 corridori, 1 giorno, solo tratte 25-36. Inizia sabato all'Exchange 24. Perfetto per chi vuole provare un Ragnar senza l'impegno completo.",
    },
  ];

  for (const translation of sprintTeamTranslations) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: sprintTeam.id,
          language: translation.language,
        },
      },
      update: {
        name: translation.name,
        description: translation.description,
      },
      create: {
        variantId: sprintTeam.id,
        language: translation.language,
        name: translation.name,
        description: translation.description,
      },
    });
  }

  console.log(
    "✅ Variant translations upserted for all 3 variants in 6 languages"
  );

  // Step 5: Upsert pricing phases separately (linked to eventId, NOT variantId)
  console.log("💰 Upserting pricing phases...");

  // Helper function for idempotent pricing phase creation
  const findOrCreatePricingPhase = async (
    name: string,
    data: Record<string, unknown>
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
      // @ts-expect-error - Prisma type inference issue with spread operator
      return await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          name,
          ...(data as object),
        },
      });
    }
  };

  // Standard Team pricing
  await findOrCreatePricingPhase("Standard Team - Registration", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2026-09-15T23:59:59Z"),
    price: 1995.0,
    currency: Currency.USD,
    discountPercent: null,
    note: "Team of 12 runners - $166 per runner",
  });

  // Ultra Team pricing
  await findOrCreatePricingPhase("Ultra Team - Registration", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2026-09-15T23:59:59Z"),
    price: 1150.0,
    currency: Currency.USD,
    discountPercent: null,
    note: "Team of 6 runners - $191 per runner",
  });

  // Sprint Team pricing
  await findOrCreatePricingPhase("Sprint Team - Registration", {
    startDate: new Date("2025-11-01T00:00:00Z"),
    endDate: new Date("2026-09-15T23:59:59Z"),
    price: 675.0,
    currency: Currency.USD,
    discountPercent: null,
    note: "Team of 6 runners - $112 per runner - 1 day event",
  });

  console.log("✅ Pricing phases upserted for all team types");

  console.log(
    "\n🎉 Ragnar Road Bourbon Chase 2026 seed completed successfully!"
  );
  console.log("📍 Start: Jim Beam Distillery, Clermont, KY");
  console.log(
    "🏁 Finish: Lexington Brewing & Distilling Company, Lexington, KY"
  );
  console.log("📅 Date: October 2-3, 2026");
  console.log(
    "🏃 3 Variants: Standard Team (12), Ultra Team (6), Sprint Team (6)"
  );
  console.log("💰 Pricing: $675 - $1,995 USD");
  console.log("🌍 Translations: 6 languages (pt, en, es, fr, de, it)");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding Ragnar Road Bourbon Chase:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
