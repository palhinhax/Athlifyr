/**
 * Seed ZUT – Zebra Ultra Trail 2026
 * Complete with translations in all 6 languages
 * First edition trail running event in Cordinhã, Cantanhede, Portugal
 */

import { PrismaClient, SportType, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🦓 Seeding ZUT – Zebra Ultra Trail 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "zut-zebra-ultra-trail-2026" },
    update: {
      title: "ZUT – Zebra Ultra Trail 2026",
      description: `## 🦓 ZUT – Zebra Ultra Trail 2026

**A primeira edição de uma aventura épica nos trilhos de Cantanhede!**

Sob organização da Secção de Atletismo do C. F. "Os Marialvas", com o apoio institucional da Câmara Municipal de Cantanhede e outras instituições locais de relevo, realiza-se a 15 de fevereiro de 2026 a primeira edição do ZUT – Zebra Ultra Trail, uma prova Trail Running que percorrerá percursos e trilhos maioritariamente envolventes à localidade da Cordinhã, no município de Cantanhede.

### 🏃 As Provas

**Ultra Trail** - 45 km de pura aventura  
**Trail Longo** - 25 km de desafio  
**Mini Trail** - 15 km de emoção (válida para CDTRC)  
**Caminhada** - 10 km de descoberta  

### 📅 Programa do Evento

**Sábado, 14 de Fevereiro 2026:**
- 14:00 – Abertura do secretariado (Polidesportivo da Cordinhã)
- 21:00 – Encerramento do secretariado

**Domingo, 15 de Fevereiro 2026:**
- 07:00 – Reabertura do secretariado
- 08:00 – Briefing e partida Ultra Trail (45 km)
- 08:30 – Controlo zero Trail Longo (25 km)
- 09:00 – Partida Trail Longo
- 09:15 – Controlo zero Mini Trail (15 km)
- 09:30 – Partida Mini Trail
- 09:45 – Partida Caminhada (10 km)
- 13:00 – Entrega de prémios
- 17:00 – Encerramento do secretariado

### 🎒 Informações Importantes

- 📝 Inscrições abrem: 30 de Novembro de 2025
- ⏰ Prazo de inscrições: 12 de Fevereiro de 2026
- 🏆 Cronometragem eletrónica nas provas competitivas
- 👥 Idade mínima: 20 anos (Ultra), 18 anos (Trail Longo), 16 anos (Mini Trail)
- 🎉 Primeira edição do evento!`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-15T08:00:00Z"),
      endDate: new Date("2026-02-15T17:00:00Z"),
      city: "Cordinhã, Cantanhede",
      country: "Portugal",
      latitude: 40.32556595067263,
      longitude: -8.521936459302795,
      googleMapsUrl: "https://maps.app.goo.gl/4yuF1hFDTEHvpvhs9",
      externalUrl:
        "https://www.runmanager.net/Eventos/zut-zebra-ultra-trail/992",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-12T23:59:59Z"),
    },
    create: {
      title: "ZUT – Zebra Ultra Trail 2026",
      slug: "zut-zebra-ultra-trail-2026",
      description: `## 🦓 ZUT – Zebra Ultra Trail 2026

**A primeira edição de uma aventura épica nos trilhos de Cantanhede!**

Sob organização da Secção de Atletismo do C. F. "Os Marialvas", com o apoio institucional da Câmara Municipal de Cantanhede e outras instituições locais de relevo, realiza-se a 15 de fevereiro de 2026 a primeira edição do ZUT – Zebra Ultra Trail, uma prova Trail Running que percorrerá percursos e trilhos maioritariamente envolventes à localidade da Cordinhã, no município de Cantanhede.

### 🏃 As Provas

**Ultra Trail** - 45 km de pura aventura  
**Trail Longo** - 25 km de desafio  
**Mini Trail** - 15 km de emoção (válida para CDTRC)  
**Caminhada** - 10 km de descoberta  

### 📅 Programa do Evento

**Sábado, 14 de Fevereiro 2026:**
- 14:00 – Abertura do secretariado (Polidesportivo da Cordinhã)
- 21:00 – Encerramento do secretariado

**Domingo, 15 de Fevereiro 2026:**
- 07:00 – Reabertura do secretariado
- 08:00 – Briefing e partida Ultra Trail (45 km)
- 08:30 – Controlo zero Trail Longo (25 km)
- 09:00 – Partida Trail Longo
- 09:15 – Controlo zero Mini Trail (15 km)
- 09:30 – Partida Mini Trail
- 09:45 – Partida Caminhada (10 km)
- 13:00 – Entrega de prémios
- 17:00 – Encerramento do secretariado

### 🎒 Informações Importantes

- 📝 Inscrições abrem: 30 de Novembro de 2025
- ⏰ Prazo de inscrições: 12 de Fevereiro de 2026
- 🏆 Cronometragem eletrónica nas provas competitivas
- 👥 Idade mínima: 20 anos (Ultra), 18 anos (Trail Longo), 16 anos (Mini Trail)
- 🎉 Primeira edição do evento!`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-02-15T08:00:00Z"),
      endDate: new Date("2026-02-15T17:00:00Z"),
      city: "Cordinhã, Cantanhede",
      country: "Portugal",
      latitude: 40.32556595067263,
      longitude: -8.521936459302795,
      googleMapsUrl: "https://maps.app.goo.gl/4yuF1hFDTEHvpvhs9",
      externalUrl:
        "https://www.runmanager.net/Eventos/zut-zebra-ultra-trail/992",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-12T23:59:59Z"),
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES)
  const translations = [
    {
      language: Language.pt,
      title: "ZUT – Zebra Ultra Trail 2026",
      description: `## 🦓 ZUT – Zebra Ultra Trail 2026

**A primeira edição de uma aventura épica nos trilhos de Cantanhede!**

Sob organização da Secção de Atletismo do C. F. "Os Marialvas", com o apoio institucional da Câmara Municipal de Cantanhede e outras instituições locais de relevo, realiza-se a 15 de fevereiro de 2026 a primeira edição do ZUT – Zebra Ultra Trail, uma prova Trail Running que percorrerá percursos e trilhos maioritariamente envolventes à localidade da Cordinhã, no município de Cantanhede.

### 🏃 As Provas

**Ultra Trail** - 45 km de pura aventura  
**Trail Longo** - 25 km de desafio  
**Mini Trail** - 15 km de emoção (válida para CDTRC)  
**Caminhada** - 10 km de descoberta  

### 📅 Programa do Evento

**Sábado, 14 de Fevereiro 2026:**
- 14:00 – Abertura do secretariado (Polidesportivo da Cordinhã)
- 21:00 – Encerramento do secretariado

**Domingo, 15 de Fevereiro 2026:**
- 07:00 – Reabertura do secretariado
- 08:00 – Briefing e partida Ultra Trail (45 km)
- 08:30 – Controlo zero Trail Longo (25 km)
- 09:00 – Partida Trail Longo
- 09:15 – Controlo zero Mini Trail (15 km)
- 09:30 – Partida Mini Trail
- 09:45 – Partida Caminhada (10 km)
- 13:00 – Entrega de prémios
- 17:00 – Encerramento do secretariado

### 🎒 Informações Importantes

- 📝 Inscrições abrem: 30 de Novembro de 2025
- ⏰ Prazo de inscrições: 12 de Fevereiro de 2026
- 🏆 Cronometragem eletrónica nas provas competitivas
- 👥 Idade mínima: 20 anos (Ultra), 18 anos (Trail Longo), 16 anos (Mini Trail)
- 🎉 Primeira edição do evento!`,
      city: "Cordinhã, Cantanhede",
      metaTitle: "ZUT – Zebra Ultra Trail 2026 | Trail Running em Cantanhede",
      metaDescription:
        "Primeira edição do ZUT – Zebra Ultra Trail em Cordinhã, Cantanhede. 4 provas: Ultra Trail 45km, Trail Longo 25km, Mini Trail 15km e Caminhada 10km. 15 de Fevereiro de 2026.",
    },
    {
      language: Language.en,
      title: "ZUT – Zebra Ultra Trail 2026",
      description: `## 🦓 ZUT – Zebra Ultra Trail 2026

**The first edition of an epic adventure on Cantanhede's trails!**

Organized by the Athletics Section of C. F. "Os Marialvas", with institutional support from Cantanhede City Council and other prominent local institutions, the first edition of ZUT – Zebra Ultra Trail takes place on February 15, 2026. This Trail Running event will traverse paths and trails primarily surrounding the village of Cordinhã, in the municipality of Cantanhede.

### 🏃 The Races

**Ultra Trail** - 45 km of pure adventure  
**Trail Longo** - 25 km of challenge  
**Mini Trail** - 15 km of excitement (counts for CDTRC)  
**Caminhada** - 10 km of discovery  

### 📅 Event Schedule

**Saturday, February 14, 2026:**
- 14:00 – Secretariat opens (Polidesportivo da Cordinhã)
- 21:00 – Secretariat closes

**Sunday, February 15, 2026:**
- 07:00 – Secretariat reopens
- 08:00 – Briefing and Ultra Trail start (45 km)
- 08:30 – Trail Longo control zero (25 km)
- 09:00 – Trail Longo start
- 09:15 – Mini Trail control zero (15 km)
- 09:30 – Mini Trail start
- 09:45 – Caminhada start (10 km)
- 13:00 – Prize giving
- 17:00 – Secretariat closes

### 🎒 Important Information

- 📝 Registration opens: November 30, 2025
- ⏰ Registration deadline: February 12, 2026
- 🏆 Electronic chip timing for competitive races
- 👥 Minimum age: 20 years (Ultra), 18 years (Trail Longo), 16 years (Mini Trail)
- 🎉 First edition of the event!`,
      city: "Cordinhã, Cantanhede",
      metaTitle: "ZUT – Zebra Ultra Trail 2026 | Trail Running in Cantanhede",
      metaDescription:
        "First edition of ZUT – Zebra Ultra Trail in Cordinhã, Cantanhede. 4 races: Ultra Trail 45km, Trail Longo 25km, Mini Trail 15km and Caminhada 10km. February 15, 2026.",
    },
    {
      language: Language.es,
      title: "ZUT – Zebra Ultra Trail 2026",
      description: `## 🦓 ZUT – Zebra Ultra Trail 2026

**¡La primera edición de una aventura épica en los senderos de Cantanhede!**

Organizado por la Sección de Atletismo del C. F. "Os Marialvas", con el apoyo institucional del Ayuntamiento de Cantanhede y otras instituciones locales destacadas, se celebra el 15 de febrero de 2026 la primera edición del ZUT – Zebra Ultra Trail, una prueba de Trail Running que recorrerá caminos y senderos principalmente en los alrededores de la localidad de Cordinhã, en el municipio de Cantanhede.

### 🏃 Las Carreras

**Ultra Trail** - 45 km de pura aventura  
**Trail Longo** - 25 km de desafío  
**Mini Trail** - 15 km de emoción (válida para CDTRC)  
**Caminhada** - 10 km de descubrimiento  

### 📅 Programa del Evento

**Sábado, 14 de Febrero 2026:**
- 14:00 – Apertura de secretaría (Polidesportivo da Cordinhã)
- 21:00 – Cierre de secretaría

**Domingo, 15 de Febrero 2026:**
- 07:00 – Reapertura de secretaría
- 08:00 – Briefing y salida Ultra Trail (45 km)
- 08:30 – Control cero Trail Longo (25 km)
- 09:00 – Salida Trail Longo
- 09:15 – Control cero Mini Trail (15 km)
- 09:30 – Salida Mini Trail
- 09:45 – Salida Caminhada (10 km)
- 13:00 – Entrega de premios
- 17:00 – Cierre de secretaría

### 🎒 Información Importante

- 📝 Inscripciones abren: 30 de Noviembre de 2025
- ⏰ Plazo de inscripciones: 12 de Febrero de 2026
- 🏆 Cronometraje electrónico en las carreras competitivas
- 👥 Edad mínima: 20 años (Ultra), 18 años (Trail Longo), 16 años (Mini Trail)
- 🎉 ¡Primera edición del evento!`,
      city: "Cordinhã, Cantanhede",
      metaTitle: "ZUT – Zebra Ultra Trail 2026 | Trail Running en Cantanhede",
      metaDescription:
        "Primera edición del ZUT – Zebra Ultra Trail en Cordinhã, Cantanhede. 4 carreras: Ultra Trail 45km, Trail Longo 25km, Mini Trail 15km y Caminhada 10km. 15 de Febrero de 2026.",
    },
    {
      language: Language.fr,
      title: "ZUT – Zebra Ultra Trail 2026",
      description: `## 🦓 ZUT – Zebra Ultra Trail 2026

**La première édition d'une aventure épique sur les sentiers de Cantanhede !**

Organisé par la Section d'Athlétisme du C. F. "Os Marialvas", avec le soutien institutionnel de la Mairie de Cantanhede et d'autres institutions locales de premier plan, se déroule le 15 février 2026 la première édition du ZUT – Zebra Ultra Trail, une épreuve de Trail Running qui parcourra des chemins et sentiers principalement autour du village de Cordinhã, dans la commune de Cantanhede.

### 🏃 Les Courses

**Ultra Trail** - 45 km de pure aventure  
**Trail Longo** - 25 km de défi  
**Mini Trail** - 15 km d'émotion (valable pour CDTRC)  
**Caminhada** - 10 km de découverte  

### 📅 Programme de l'Événement

**Samedi, 14 Février 2026 :**
- 14:00 – Ouverture du secrétariat (Polidesportivo da Cordinhã)
- 21:00 – Fermeture du secrétariat

**Dimanche, 15 Février 2026 :**
- 07:00 – Réouverture du secrétariat
- 08:00 – Briefing et départ Ultra Trail (45 km)
- 08:30 – Contrôle zéro Trail Longo (25 km)
- 09:00 – Départ Trail Longo
- 09:15 – Contrôle zéro Mini Trail (15 km)
- 09:30 – Départ Mini Trail
- 09:45 – Départ Caminhada (10 km)
- 13:00 – Remise des prix
- 17:00 – Fermeture du secrétariat

### 🎒 Informations Importantes

- 📝 Ouverture des inscriptions : 30 Novembre 2025
- ⏰ Date limite d'inscription : 12 Février 2026
- 🏆 Chronométrage électronique pour les courses compétitives
- 👥 Âge minimum : 20 ans (Ultra), 18 ans (Trail Longo), 16 ans (Mini Trail)
- 🎉 Première édition de l'événement !`,
      city: "Cordinhã, Cantanhede",
      metaTitle: "ZUT – Zebra Ultra Trail 2026 | Trail Running à Cantanhede",
      metaDescription:
        "Première édition du ZUT – Zebra Ultra Trail à Cordinhã, Cantanhede. 4 courses : Ultra Trail 45km, Trail Longo 25km, Mini Trail 15km et Caminhada 10km. 15 Février 2026.",
    },
    {
      language: Language.de,
      title: "ZUT – Zebra Ultra Trail 2026",
      description: `## 🦓 ZUT – Zebra Ultra Trail 2026

**Die erste Ausgabe eines epischen Abenteuers auf den Pfaden von Cantanhede!**

Organisiert von der Leichtathletik-Sektion des C. F. "Os Marialvas", mit institutioneller Unterstützung der Stadtverwaltung Cantanhede und anderer bedeutender lokaler Institutionen, findet am 15. Februar 2026 die erste Ausgabe des ZUT – Zebra Ultra Trail statt. Dieses Trail-Running-Event wird Wege und Pfade hauptsächlich rund um das Dorf Cordinhã in der Gemeinde Cantanhede durchlaufen.

### 🏃 Die Rennen

**Ultra Trail** - 45 km pures Abenteuer  
**Trail Longo** - 25 km Herausforderung  
**Mini Trail** - 15 km Spannung (zählt für CDTRC)  
**Caminhada** - 10 km Entdeckung  

### 📅 Veranstaltungsprogramm

**Samstag, 14. Februar 2026:**
- 14:00 – Sekretariat öffnet (Polidesportivo da Cordinhã)
- 21:00 – Sekretariat schließt

**Sonntag, 15. Februar 2026:**
- 07:00 – Sekretariat öffnet wieder
- 08:00 – Briefing und Ultra Trail Start (45 km)
- 08:30 – Trail Longo Kontrolle Null (25 km)
- 09:00 – Trail Longo Start
- 09:15 – Mini Trail Kontrolle Null (15 km)
- 09:30 – Mini Trail Start
- 09:45 – Caminhada Start (10 km)
- 13:00 – Preisverleihung
- 17:00 – Sekretariat schließt

### 🎒 Wichtige Informationen

- 📝 Anmeldung öffnet: 30. November 2025
- ⏰ Anmeldeschluss: 12. Februar 2026
- 🏆 Elektronische Chip-Zeitmessung für Wettkampfrennen
- 👥 Mindestalter: 20 Jahre (Ultra), 18 Jahre (Trail Longo), 16 Jahre (Mini Trail)
- 🎉 Erste Ausgabe der Veranstaltung!`,
      city: "Cordinhã, Cantanhede",
      metaTitle: "ZUT – Zebra Ultra Trail 2026 | Trail Running in Cantanhede",
      metaDescription:
        "Erste Ausgabe des ZUT – Zebra Ultra Trail in Cordinhã, Cantanhede. 4 Rennen: Ultra Trail 45km, Trail Longo 25km, Mini Trail 15km und Caminhada 10km. 15. Februar 2026.",
    },
    {
      language: Language.it,
      title: "ZUT – Zebra Ultra Trail 2026",
      description: `## 🦓 ZUT – Zebra Ultra Trail 2026

**La prima edizione di un'avventura epica sui sentieri di Cantanhede!**

Organizzato dalla Sezione di Atletica del C. F. "Os Marialvas", con il sostegno istituzionale del Comune di Cantanhede e altre istituzioni locali di rilievo, si svolge il 15 febbraio 2026 la prima edizione dello ZUT – Zebra Ultra Trail, una gara di Trail Running che percorrerà sentieri e percorsi principalmente intorno al villaggio di Cordinhã, nel comune di Cantanhede.

### 🏃 Le Gare

**Ultra Trail** - 45 km di pura avventura  
**Trail Longo** - 25 km di sfida  
**Mini Trail** - 15 km di emozione (valida per CDTRC)  
**Caminhada** - 10 km di scoperta  

### 📅 Programma dell'Evento

**Sabato, 14 Febbraio 2026:**
- 14:00 – Apertura segreteria (Polidesportivo da Cordinhã)
- 21:00 – Chiusura segreteria

**Domenica, 15 Febbraio 2026:**
- 07:00 – Riapertura segreteria
- 08:00 – Briefing e partenza Ultra Trail (45 km)
- 08:30 – Controllo zero Trail Longo (25 km)
- 09:00 – Partenza Trail Longo
- 09:15 – Controllo zero Mini Trail (15 km)
- 09:30 – Partenza Mini Trail
- 09:45 – Partenza Caminhada (10 km)
- 13:00 – Premiazioni
- 17:00 – Chiusura segreteria

### 🎒 Informazioni Importanti

- 📝 Apertura iscrizioni: 30 Novembre 2025
- ⏰ Termine iscrizioni: 12 Febbraio 2026
- 🏆 Cronometraggio elettronico per le gare competitive
- 👥 Età minima: 20 anni (Ultra), 18 anni (Trail Longo), 16 anni (Mini Trail)
- 🎉 Prima edizione dell'evento!`,
      city: "Cordinhã, Cantanhede",
      metaTitle: "ZUT – Zebra Ultra Trail 2026 | Trail Running a Cantanhede",
      metaDescription:
        "Prima edizione dello ZUT – Zebra Ultra Trail a Cordinhã, Cantanhede. 4 gare: Ultra Trail 45km, Trail Longo 25km, Mini Trail 15km e Caminhada 10km. 15 Febbraio 2026.",
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

  // Step 3: Delete existing variants and create new ones
  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

  // Variant 1: Ultra Trail 45km
  const ultraTrail = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Ultra Trail 45km",
      description:
        "Prova competitiva de 45km com cronometragem eletrónica. Idade mínima: 20 anos. Tempo limite: 8 horas.",
      distanceKm: 45,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-02-15T08:00:00Z"),
      startTime: "08:00",
      maxParticipants: null,
      cutoffTimeHours: 8.0,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: 3,
    },
  });

  // Variant 2: Trail Longo 25km
  const trailLongo = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Trail Longo 25km",
      description:
        "Prova competitiva de 25km com cronometragem eletrónica. Idade mínima: 18 anos. Tempo limite: 6 horas.",
      distanceKm: 25,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-02-15T09:00:00Z"),
      startTime: "09:00",
      maxParticipants: null,
      cutoffTimeHours: 6.0,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: 2,
    },
  });

  // Variant 3: Mini Trail 15km
  const miniTrail = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Mini Trail 15km",
      description:
        "Prova competitiva de 15km com cronometragem eletrónica. Válida para Circuito Distrital Trail Running Coimbra (CDTRC). Idade mínima: 16 anos. Tempo limite: 3 horas.",
      distanceKm: 15,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-02-15T09:30:00Z"),
      startTime: "09:30",
      maxParticipants: null,
      cutoffTimeHours: 3.0,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: 1,
    },
  });

  // Variant 4: Caminhada 10km
  const caminhada = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Caminhada 10km",
      description:
        "Caminhada lúdica não competitiva de 10km. Todas as idades bem-vindas (menores de 16 anos devem ser acompanhados por adulto). Tempo limite: 4 horas.",
      distanceKm: 10,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-02-15T09:45:00Z"),
      startTime: "09:45",
      maxParticipants: null,
      cutoffTimeHours: 4.0,
      itraPoints: null,
      atrpGrade: null,
      mountainLevel: 1,
    },
  });

  console.log("🏃 Variants created (4 variants)");

  // Step 4: Upsert variant translations separately (ALL 6 languages for each variant)
  const variantTranslations = [
    // Ultra Trail 45km translations
    {
      variantId: ultraTrail.id,
      translations: [
        {
          language: Language.pt,
          name: "Ultra Trail 45km",
          description:
            "Prova competitiva de 45km com cronometragem eletrónica. Idade mínima: 20 anos. Tempo limite: 8 horas.",
        },
        {
          language: Language.en,
          name: "Ultra Trail 45km",
          description:
            "Competitive 45km race with electronic chip timing. Minimum age: 20 years. Time limit: 8 hours.",
        },
        {
          language: Language.es,
          name: "Ultra Trail 45km",
          description:
            "Carrera competitiva de 45km con cronometraje electrónico. Edad mínima: 20 años. Tiempo límite: 8 horas.",
        },
        {
          language: Language.fr,
          name: "Ultra Trail 45km",
          description:
            "Course compétitive de 45km avec chronométrage électronique. Âge minimum : 20 ans. Temps limite : 8 heures.",
        },
        {
          language: Language.de,
          name: "Ultra Trail 45km",
          description:
            "Wettkampfrennen über 45km mit elektronischer Chip-Zeitmessung. Mindestalter: 20 Jahre. Zeitlimit: 8 Stunden.",
        },
        {
          language: Language.it,
          name: "Ultra Trail 45km",
          description:
            "Gara competitiva di 45km con cronometraggio elettronico. Età minima: 20 anni. Tempo limite: 8 ore.",
        },
      ],
    },
    // Trail Longo 25km translations
    {
      variantId: trailLongo.id,
      translations: [
        {
          language: Language.pt,
          name: "Trail Longo 25km",
          description:
            "Prova competitiva de 25km com cronometragem eletrónica. Idade mínima: 18 anos. Tempo limite: 6 horas.",
        },
        {
          language: Language.en,
          name: "Trail Longo 25km",
          description:
            "Competitive 25km race with electronic chip timing. Minimum age: 18 years. Time limit: 6 hours.",
        },
        {
          language: Language.es,
          name: "Trail Longo 25km",
          description:
            "Carrera competitiva de 25km con cronometraje electrónico. Edad mínima: 18 años. Tiempo límite: 6 horas.",
        },
        {
          language: Language.fr,
          name: "Trail Longo 25km",
          description:
            "Course compétitive de 25km avec chronométrage électronique. Âge minimum : 18 ans. Temps limite : 6 heures.",
        },
        {
          language: Language.de,
          name: "Trail Longo 25km",
          description:
            "Wettkampfrennen über 25km mit elektronischer Chip-Zeitmessung. Mindestalter: 18 Jahre. Zeitlimit: 6 Stunden.",
        },
        {
          language: Language.it,
          name: "Trail Longo 25km",
          description:
            "Gara competitiva di 25km con cronometraggio elettronico. Età minima: 18 anni. Tempo limite: 6 ore.",
        },
      ],
    },
    // Mini Trail 15km translations
    {
      variantId: miniTrail.id,
      translations: [
        {
          language: Language.pt,
          name: "Mini Trail 15km",
          description:
            "Prova competitiva de 15km com cronometragem eletrónica. Válida para Circuito Distrital Trail Running Coimbra (CDTRC). Idade mínima: 16 anos. Tempo limite: 3 horas.",
        },
        {
          language: Language.en,
          name: "Mini Trail 15km",
          description:
            "Competitive 15km race with electronic chip timing. Counts for Circuito Distrital Trail Running Coimbra (CDTRC). Minimum age: 16 years. Time limit: 3 hours.",
        },
        {
          language: Language.es,
          name: "Mini Trail 15km",
          description:
            "Carrera competitiva de 15km con cronometraje electrónico. Válida para Circuito Distrital Trail Running Coimbra (CDTRC). Edad mínima: 16 años. Tiempo límite: 3 horas.",
        },
        {
          language: Language.fr,
          name: "Mini Trail 15km",
          description:
            "Course compétitive de 15km avec chronométrage électronique. Valable pour Circuito Distrital Trail Running Coimbra (CDTRC). Âge minimum : 16 ans. Temps limite : 3 heures.",
        },
        {
          language: Language.de,
          name: "Mini Trail 15km",
          description:
            "Wettkampfrennen über 15km mit elektronischer Chip-Zeitmessung. Zählt für Circuito Distrital Trail Running Coimbra (CDTRC). Mindestalter: 16 Jahre. Zeitlimit: 3 Stunden.",
        },
        {
          language: Language.it,
          name: "Mini Trail 15km",
          description:
            "Gara competitiva di 15km con cronometraggio elettronico. Valida per Circuito Distrital Trail Running Coimbra (CDTRC). Età minima: 16 anni. Tempo limite: 3 ore.",
        },
      ],
    },
    // Caminhada 10km translations
    {
      variantId: caminhada.id,
      translations: [
        {
          language: Language.pt,
          name: "Caminhada 10km",
          description:
            "Caminhada lúdica não competitiva de 10km. Todas as idades bem-vindas (menores de 16 anos devem ser acompanhados por adulto). Tempo limite: 4 horas.",
        },
        {
          language: Language.en,
          name: "Caminhada 10km",
          description:
            "Non-competitive recreational walk of 10km. All ages welcome (under 16 must be accompanied by an adult). Time limit: 4 hours.",
        },
        {
          language: Language.es,
          name: "Caminhada 10km",
          description:
            "Caminata recreativa no competitiva de 10km. Todas las edades bienvenidas (menores de 16 años deben ir acompañados por un adulto). Tiempo límite: 4 horas.",
        },
        {
          language: Language.fr,
          name: "Caminhada 10km",
          description:
            "Marche récréative non compétitive de 10km. Tous les âges bienvenus (moins de 16 ans doivent être accompagnés d'un adulte). Temps limite : 4 heures.",
        },
        {
          language: Language.de,
          name: "Caminhada 10km",
          description:
            "Nicht-Wettkampf-Freizeitwanderung über 10km. Alle Altersgruppen willkommen (unter 16 Jahren muss von einem Erwachsenen begleitet werden). Zeitlimit: 4 Stunden.",
        },
        {
          language: Language.it,
          name: "Caminhada 10km",
          description:
            "Camminata ricreativa non competitiva di 10km. Tutte le età benvenute (sotto i 16 anni deve essere accompagnato da un adulto). Tempo limite: 4 ore.",
        },
      ],
    },
  ];

  for (const variant of variantTranslations) {
    for (const translation of variant.translations) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.variantId,
            language: translation.language,
          },
        },
        update: {
          name: translation.name,
          description: translation.description,
        },
        create: {
          variantId: variant.variantId,
          language: translation.language,
          name: translation.name,
          description: translation.description,
        },
      });
    }
  }

  console.log("📝 Variant translations upserted for all 4 variants");

  // Step 5: Delete existing pricing phases and create new ones
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  // Pricing phases by variant
  const pricingPhases = [
    // Ultra Trail 45km - Phase 1
    {
      variantId: ultraTrail.id,
      name: "Early Bird",
      startDate: new Date("2025-11-30T00:00:00Z"),
      endDate: new Date("2025-12-31T23:59:59Z"),
      price: 25.0,
      note: "Inscrição antecipada",
    },
    // Ultra Trail 45km - Phase 2
    {
      variantId: ultraTrail.id,
      name: "Standard",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-02-12T23:59:59Z"),
      price: 28.0,
      note: "Inscrição normal",
    },
    // Trail Longo 25km - Phase 1
    {
      variantId: trailLongo.id,
      name: "Early Bird",
      startDate: new Date("2025-11-30T00:00:00Z"),
      endDate: new Date("2025-12-31T23:59:59Z"),
      price: 16.5,
      note: "Inscrição antecipada",
    },
    // Trail Longo 25km - Phase 2
    {
      variantId: trailLongo.id,
      name: "Standard",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-02-12T23:59:59Z"),
      price: 18.5,
      note: "Inscrição normal",
    },
    // Mini Trail 15km - Phase 1
    {
      variantId: miniTrail.id,
      name: "Early Bird",
      startDate: new Date("2025-11-30T00:00:00Z"),
      endDate: new Date("2025-12-31T23:59:59Z"),
      price: 15.0,
      note: "Inscrição antecipada (Desconto de €1.50 para sócios ADAC)",
    },
    // Mini Trail 15km - Phase 2
    {
      variantId: miniTrail.id,
      name: "Standard",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-02-12T23:59:59Z"),
      price: 17.0,
      note: "Inscrição normal (Desconto de €1.50 para sócios ADAC)",
    },
    // Caminhada 10km - Phase 1
    {
      variantId: caminhada.id,
      name: "Early Bird",
      startDate: new Date("2025-11-30T00:00:00Z"),
      endDate: new Date("2025-12-31T23:59:59Z"),
      price: 10.0,
      note: "Inscrição antecipada",
    },
    // Caminhada 10km - Phase 2
    {
      variantId: caminhada.id,
      name: "Standard",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-02-12T23:59:59Z"),
      price: 12.0,
      note: "Inscrição normal",
    },
  ];

  for (const phase of pricingPhases) {
    await prisma.pricingPhase.create({
      data: {
        variantId: phase.variantId,
        name: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        price: phase.price,
        note: phase.note,
      },
    });
  }

  console.log("💰 Pricing phases created (8 phases for 4 variants)");
  console.log("\n🎉 ZUT – Zebra Ultra Trail 2026 seed completed successfully!");
  console.log("📍 Location: Cordinhã, Cantanhede, Portugal");
  console.log("📅 Date: February 15, 2026");
  console.log(
    "🏃 4 variants: Ultra Trail 45km, Trail Longo 25km, Mini Trail 15km, Caminhada 10km"
  );
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
