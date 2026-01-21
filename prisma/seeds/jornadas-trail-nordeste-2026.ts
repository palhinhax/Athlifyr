/**
 * Seed: II Jornadas de Trail Running - Nordeste 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding II Jornadas de Trail Running - Nordeste 2026...");

  const eventSlug = "jornadas-trail-nordeste-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "II Jornadas de Trail Running - Nordeste",
      description: `Jornadas de formação e workshops sobre Trail Running com palestras teóricas, sessões práticas e partilha de conhecimento. Três dias dedicados ao Trail Running no Nordeste, Açores.`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-01-23T08:45:00.000Z"),
      endDate: new Date("2026-01-25T15:00:00.000Z"),
      city: "Nordeste",
      country: "Portugal",
      latitude: 37.8206,
      longitude: -25.1586,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Nordeste+Açores",
      externalUrl: null,
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-01-20T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "II Jornadas de Trail Running - Nordeste",
      description: `Jornadas de formação e workshops sobre Trail Running com palestras teóricas, sessões práticas e partilha de conhecimento. Três dias dedicados ao Trail Running no Nordeste, Açores.`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-01-23T08:45:00.000Z"),
      endDate: new Date("2026-01-25T15:00:00.000Z"),
      city: "Nordeste",
      country: "Portugal",
      latitude: 37.8206,
      longitude: -25.1586,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Nordeste+Açores",
      externalUrl: null,
      imageUrl: "",
      isFeatured: false,
      registrationDeadline: new Date("2026-01-20T23:59:59.000Z"),
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
      title: "II Jornadas de Trail Running - Nordeste",
      description: `# 🏔️ II Jornadas de Trail Running

## 📅 Evento de Formação e Workshops | 23-25 Janeiro 2026

As **II Jornadas de Trail Running** no Nordeste, Açores, são um evento de formação completo dedicado ao Trail Running. Durante **três dias intensivos**, participantes terão acesso a palestras teóricas de especialistas, sessões práticas no terreno e momentos de partilha de experiências.

---

## 📋 Programa Completo

### 🗓️ Sexta-feira – 23 de Janeiro 2026

**📍 Local:** Complexo Desportivo das Laranjeiras / Centro Municipal de Atividades Culturais

- **08h45** | 📢 Apresentação das Jornadas  
  *Local: Complexo Desportivo das Laranjeiras*

- **09h00** | 🏃‍♂️ O Treino Desportivo para Jovens  
  **Tema:** "Corrida segura, eficiente e económica"  
  **Formador:** Hélio Fumo  
  *Local: Complexo Desportivo das Laranjeiras*

- **10h30** | 👨‍🏫 Corrida para Jovens: Visão Pedagógica  
  **Tema:** "Uma visão pedagógica, inclusiva e multifacetada - Exercícios e progressões"  
  **Formador:** Hélio Fumo  
  *Local: Complexo Desportivo das Laranjeiras*

- **14h00** | 👨‍🏫 Corrida para Jovens: Sessão Prática  
  **Tema:** "Exercícios e progressões aplicadas"  
  **Formador:** Hélio Fumo  
  *Local: Campo Municipal do Nordeste*

---

### 🗓️ Sábado – 24 de Janeiro 2026

**📍 Local:** Centro Municipal de Atividades Culturais do Nordeste

- **08h00** | 🎯 Acolhimento aos Participantes

- **08h30** | 🎤 Sessão de Abertura

- **08h45** | 📚 Sessão Teórica: Atletismo e Trail... uma só modalidade?  
  **Formador:** Hélio Fumo

- **09h45** | 🥗 Sessão Teórica: A Nutrição e o Desempenho Desportivo  
  **Formadoras:** Beatriz Vale e Solange Moniz

- **10h45** | ☕ Coffee Break

- **11h00** | 🏃 Sessão Prática: "O Trail Sprint"  
  *Outdoor ou Pavilhão da EBS do Nordeste*

- **13h30** | 🍽️ Almoço

- **14h30** | 🔬 Sessão Teórica: O Trail e o Corpo Humano  
  **Tema:** "O que diz a ciência sobre a corrida fora da estrada"  
  **Formador:** João Macedo

- **15h30** | 🧠 Sessão Teórica: Gestão Física ou Emocional?  
  **Formadora:** Maria João Silva

- **16h30** | ☕ Coffee Break

- **17h00** | 💪 Sessão Teórica/Prática: O Treino Funcional e a Corrida  
  **Tema:** "Como combinar os dois!"  
  **Formador:** Mário Botelho

- **18h30** | 🧘 Sessão Teórica/Prática: Pilates  
  **Tema:** "Uma abordagem integral para o Bem-Estar"  
  **Formadora:** Sara Lima

- **20h00** | 🍽️ Jantar

---

### 🗓️ Domingo – 25 de Janeiro 2026

**📍 Local:** Centro Municipal de Atividades Culturais / Outdoor

- **08h00** | 🥐 Pequeno-almoço

- **08h30** | 🏃 Sessão Prática: Melhorar a Técnica de Corrida  
  **Tema:** "Aprender a correr melhor"  
  **Formador:** Hélio Fumo

- **10h00** | ☕ Coffee Break

- **10h15** | 🏔️ Sessão Prática: "O Trail Longo"  
  **Tema:** "Dicas sobre equipamento, acessórios e percurso"  
  *Outdoor*

- **13h00** | 🍽️ Almoço

- **14h00** | 📊 Sessão Teórica: Trail Running, Dicas e Planeamento  
  **Formador:** Hélio Fumo

- **15h00** | 🎓 Encerramento das Jornadas: Chá de Honra

---

## 🎯 Destinatários

### Sessões para Jovens (Sexta-feira):
- **Manhã (09h00-10h30):** Alunos do Curso de Desporto da EBS das Laranjeiras
- **Tarde (14h00):** Alunos da EBS do Nordeste e EP do Nordeste

### Jornadas Principais (Sábado e Domingo):
Abertas a todos os interessados em Trail Running:
- 🏃 Atletas de Trail Running
- 🏋️ Treinadores e preparadores físicos
- 👨‍🏫 Professores de Educação Física
- 💚 Entusiastas do Trail Running
- 🏃‍♀️ Iniciantes que querem aprender

---

## 📍 Locais das Sessões

### 🏟️ Complexo Desportivo das Laranjeiras
Sessões de sexta-feira de manhã (09h00-10h30)

### ⚽ Campo Municipal do Nordeste
Sessão prática de sexta-feira à tarde (14h00)

### 🏛️ Centro Municipal de Atividades Culturais do Nordeste
Workshops teóricos de sábado e domingo

### 🌲 Outdoor / Pavilhão da EBS do Nordeste
Sessões práticas de Trail Sprint e Trail Longo

---

## 🎁 O que está incluído

- 📚 Acesso a todas as sessões teóricas
- 🏃 Participação nas sessões práticas
- 📖 Materiais formativos
- 🍽️ Refeições (almoço de sábado, jantar de sábado, pequeno-almoço de domingo, almoço de domingo)
- ☕ Coffee breaks
- 🎓 Certificado de participação
- 📸 Networking com profissionais da área

---

## 🧑‍🏫 Formadores

### Hélio Fumo
Especialista em treino desportivo e técnica de corrida

### Beatriz Vale e Solange Moniz
Especialistas em nutrição desportiva

### João Macedo
Investigador em ciências do desporto

### Maria João Silva
Psicóloga desportiva

### Mário Botelho
Especialista em treino funcional

### Sara Lima
Instrutora de Pilates

---

## ℹ️ Informações Importantes

⚠️ **Nota:** O programa está sujeito a alterações

📧 **Contactos:**  
Para mais informações, contactar a organização

📍 **Como Chegar:**  
Nordeste está localizado na ponta nordeste da ilha de São Miguel, Açores

---

## 🌟 Porquê Participar?

✅ **Aprender** com especialistas reconhecidos  
✅ **Praticar** técnicas e exercícios no terreno  
✅ **Conhecer** outros entusiastas e profissionais  
✅ **Aprofundar** conhecimentos sobre Trail Running  
✅ **Melhorar** a tua técnica e planeamento  
✅ **Descobrir** o belo Nordeste, Açores

---

**Inscreve-te já e vem aprender, praticar e partilhar a tua paixão pelo Trail Running! 🏔️🏃‍♂️**`,
      city: "Nordeste",
      metaTitle:
        "II Jornadas de Trail Running - Nordeste 2026 | Formação e Workshops",
      metaDescription:
        "Jornadas de formação sobre Trail Running no Nordeste, Açores. 3 dias de palestras teóricas, sessões práticas e workshops com especialistas. 23-25 Janeiro 2026.",
    },
    {
      language: "en",
      title: "II Trail Running Conference - Nordeste",
      description: `# 🏔️ II Trail Running Conference

## 📅 Training Event & Workshops | January 23-25, 2026

The **II Trail Running Conference** in Nordeste, Azores, is a comprehensive training event dedicated to Trail Running. During **three intensive days**, participants will have access to theoretical lectures by experts, practical field sessions, and experience-sharing moments.

---

## 📋 Complete Program

### 🗓️ Friday – January 23, 2026

**📍 Location:** Laranjeiras Sports Complex / Municipal Cultural Activities Center

- **08:45** | 📢 Conference Presentation  
  *Location: Laranjeiras Sports Complex*

- **09:00** | 🏃‍♂️ Sports Training for Youth  
  **Topic:** "Safe, efficient and economical running"  
  **Trainer:** Hélio Fumo  
  *Location: Laranjeiras Sports Complex*

- **10:30** | 👨‍🏫 Running for Youth: Pedagogical Vision  
  **Topic:** "A pedagogical, inclusive and multifaceted vision - Exercises and progressions"  
  **Trainer:** Hélio Fumo  
  *Location: Laranjeiras Sports Complex*

- **14:00** | 👨‍🏫 Running for Youth: Practical Session  
  **Topic:** "Applied exercises and progressions"  
  **Trainer:** Hélio Fumo  
  *Location: Nordeste Municipal Field*

---

### 🗓️ Saturday – January 24, 2026

**📍 Location:** Nordeste Municipal Cultural Activities Center

- **08:00** | 🎯 Participants Welcome

- **08:30** | 🎤 Opening Session

- **08:45** | 📚 Theoretical Session: Athletics and Trail... one single sport?  
  **Trainer:** Hélio Fumo

- **09:45** | 🥗 Theoretical Session: Nutrition and Sports Performance  
  **Trainers:** Beatriz Vale and Solange Moniz

- **10:45** | ☕ Coffee Break

- **11:00** | 🏃 Practical Session: "The Trail Sprint"  
  *Outdoor or Nordeste EBS Pavilion*

- **13:30** | 🍽️ Lunch

- **14:30** | 🔬 Theoretical Session: Trail and the Human Body  
  **Topic:** "What science says about off-road running"  
  **Trainer:** João Macedo

- **15:30** | 🧠 Theoretical Session: Physical or Emotional Management?  
  **Trainer:** Maria João Silva

- **16:30** | ☕ Coffee Break

- **17:00** | 💪 Theoretical/Practical Session: Functional Training and Running  
  **Topic:** "How to combine both!"  
  **Trainer:** Mário Botelho

- **18:30** | 🧘 Theoretical/Practical Session: Pilates  
  **Topic:** "An integral approach to Well-Being"  
  **Trainer:** Sara Lima

- **20:00** | 🍽️ Dinner

---

### 🗓️ Sunday – January 25, 2026

**📍 Location:** Municipal Cultural Activities Center / Outdoor

- **08:00** | 🥐 Breakfast

- **08:30** | 🏃 Practical Session: Improving Running Technique  
  **Topic:** "Learning to run better"  
  **Trainer:** Hélio Fumo

- **10:00** | ☕ Coffee Break

- **10:15** | 🏔️ Practical Session: "The Long Trail"  
  **Topic:** "Tips on equipment, accessories and route"  
  *Outdoor*

- **13:00** | 🍽️ Lunch

- **14:00** | 📊 Theoretical Session: Trail Running, Tips and Planning  
  **Trainer:** Hélio Fumo

- **15:00** | 🎓 Conference Closing: Tea of Honor

---

## 🎯 Target Audience

### Youth Sessions (Friday):
- **Morning (09:00-10:30):** Students from Laranjeiras EBS Sports Course
- **Afternoon (14:00):** Students from Nordeste EBS and EP

### Main Conference (Saturday and Sunday):
Open to all interested in Trail Running:
- 🏃 Trail Running athletes
- 🏋️ Coaches and trainers
- 👨‍🏫 Physical Education teachers
- 💚 Trail Running enthusiasts
- 🏃‍♀️ Beginners who want to learn

---

## 🎁 What's Included

- 📚 Access to all theoretical sessions
- 🏃 Participation in practical sessions
- 📖 Training materials
- 🍽️ Meals (Saturday lunch, Saturday dinner, Sunday breakfast, Sunday lunch)
- ☕ Coffee breaks
- 🎓 Participation certificate
- 📸 Networking with professionals

---

## 🌟 Why Participate?

✅ **Learn** from recognized experts  
✅ **Practice** techniques and exercises in the field  
✅ **Meet** other enthusiasts and professionals  
✅ **Deepen** your knowledge about Trail Running  
✅ **Improve** your technique and planning  
✅ **Discover** the beautiful Nordeste, Azores

---

**Register now and come learn, practice and share your passion for Trail Running! 🏔️🏃‍♂️**`,
      city: "Nordeste",
      metaTitle:
        "II Trail Running Conference - Nordeste 2026 | Training & Workshops",
      metaDescription:
        "Trail Running training conference in Nordeste, Azores. 3 days of theoretical lectures, practical sessions and workshops with experts. January 23-25, 2026.",
    },
    {
      language: "es",
      title: "II Jornadas de Trail Running - Nordeste",
      description: `# 🏔️ II Jornadas de Trail Running

## 📅 Evento de Formación y Talleres | 23-25 Enero 2026

Las **II Jornadas de Trail Running** en Nordeste, Azores, son un evento de formación completo dedicado al Trail Running. Durante **tres días intensivos**, los participantes tendrán acceso a conferencias teóricas de expertos, sesiones prácticas en el terreno y momentos de intercambio de experiencias.

---

## 🎯 Destinatarios

Abierto a todos los interesados en Trail Running:
- 🏃 Atletas de Trail Running
- 🏋️ Entrenadores y preparadores físicos
- 👨‍🏫 Profesores de Educación Física
- 💚 Entusiastas del Trail Running
- 🏃‍♀️ Principiantes que quieren aprender

---

## 🎁 Qué está incluido

- 📚 Acceso a todas las sesiones teóricas
- 🏃 Participación en sesiones prácticas
- 📖 Materiales formativos
- 🍽️ Comidas (almuerzo de sábado, cena de sábado, desayuno de domingo, almuerzo de domingo)
- ☕ Coffee breaks
- 🎓 Certificado de participación

---

## 🌟 ¿Por qué participar?

✅ **Aprender** con expertos reconocidos  
✅ **Practicar** técnicas y ejercicios en el terreno  
✅ **Conocer** otros entusiastas y profesionales  
✅ **Profundizar** conocimientos sobre Trail Running  
✅ **Mejorar** tu técnica y planificación  
✅ **Descubrir** el hermoso Nordeste, Azores

---

**¡Inscríbete ya y ven a aprender, practicar y compartir tu pasión por el Trail Running! 🏔️🏃‍♂️**`,
      city: "Nordeste",
      metaTitle:
        "II Jornadas de Trail Running - Nordeste 2026 | Formación y Talleres",
      metaDescription:
        "Jornadas de formación sobre Trail Running en Nordeste, Azores. 3 días de conferencias teóricas, sesiones prácticas y talleres con expertos. 23-25 Enero 2026.",
    },
    {
      language: "fr",
      title: "II Journées de Trail Running - Nordeste",
      description: `# 🏔️ II Journées de Trail Running

## 📅 Événement de Formation et Ateliers | 23-25 Janvier 2026

Les **II Journées de Trail Running** à Nordeste, Açores, sont un événement de formation complet dédié au Trail Running. Pendant **trois jours intensifs**, les participants auront accès à des conférences théoriques d'experts, des sessions pratiques sur le terrain et des moments de partage d'expériences.

---

## 🎯 Public Cible

Ouvert à tous les intéressés par le Trail Running:
- 🏃 Athlètes de Trail Running
- 🏋️ Entraîneurs et préparateurs physiques
- 👨‍🏫 Professeurs d'Éducation Physique
- 💚 Passionnés de Trail Running
- 🏃‍♀️ Débutants qui veulent apprendre

---

## 🎁 Ce qui est inclus

- 📚 Accès à toutes les sessions théoriques
- 🏃 Participation aux sessions pratiques
- 📖 Matériels de formation
- 🍽️ Repas (déjeuner samedi, dîner samedi, petit-déjeuner dimanche, déjeuner dimanche)
- ☕ Pauses-café
- 🎓 Certificat de participation

---

## 🌟 Pourquoi participer?

✅ **Apprendre** avec des experts reconnus  
✅ **Pratiquer** des techniques et exercices sur le terrain  
✅ **Rencontrer** d'autres passionnés et professionnels  
✅ **Approfondir** vos connaissances sur le Trail Running  
✅ **Améliorer** votre technique et planification  
✅ **Découvrir** le magnifique Nordeste, Açores

---

**Inscrivez-vous maintenant et venez apprendre, pratiquer et partager votre passion pour le Trail Running! 🏔️🏃‍♂️**`,
      city: "Nordeste",
      metaTitle:
        "II Journées de Trail Running - Nordeste 2026 | Formation et Ateliers",
      metaDescription:
        "Journées de formation sur le Trail Running à Nordeste, Açores. 3 jours de conférences théoriques, sessions pratiques et ateliers avec des experts. 23-25 Janvier 2026.",
    },
    {
      language: "de",
      title: "II Trail Running Konferenz - Nordeste",
      description: `# 🏔️ II Trail Running Konferenz

## 📅 Schulungsveranstaltung & Workshops | 23.-25. Januar 2026

Die **II Trail Running Konferenz** in Nordeste, Azoren, ist eine umfassende Schulungsveranstaltung zum Thema Trail Running. Während **drei intensiven Tagen** haben die Teilnehmer Zugang zu theoretischen Vorträgen von Experten, praktischen Feldsitzungen und Momenten des Erfahrungsaustauschs.

---

## 🎯 Zielgruppe

Offen für alle, die sich für Trail Running interessieren:
- 🏃 Trail Running Athleten
- 🏋️ Trainer und Konditionstrainer
- 👨‍🏫 Sportlehrer
- 💚 Trail Running Enthusiasten
- 🏃‍♀️ Anfänger, die lernen möchten

---

## 🎁 Was ist enthalten

- 📚 Zugang zu allen theoretischen Sitzungen
- 🏃 Teilnahme an praktischen Sitzungen
- 📖 Schulungsmaterialien
- 🍽️ Mahlzeiten (Samstag Mittagessen, Samstag Abendessen, Sonntag Frühstück, Sonntag Mittagessen)
- ☕ Kaffeepausen
- 🎓 Teilnahmebescheinigung

---

## 🌟 Warum teilnehmen?

✅ **Lernen** Sie von anerkannten Experten  
✅ **Üben** Sie Techniken und Übungen im Gelände  
✅ **Treffen** Sie andere Enthusiasten und Profis  
✅ **Vertiefen** Sie Ihr Wissen über Trail Running  
✅ **Verbessern** Sie Ihre Technik und Planung  
✅ **Entdecken** Sie das schöne Nordeste, Azoren

---

**Melden Sie sich jetzt an und kommen Sie, um Ihre Leidenschaft für Trail Running zu lernen, zu üben und zu teilen! 🏔️🏃‍♂️**`,
      city: "Nordeste",
      metaTitle:
        "II Trail Running Konferenz - Nordeste 2026 | Schulung & Workshops",
      metaDescription:
        "Trail Running Schulungskonferenz in Nordeste, Azoren. 3 Tage theoretische Vorträge, praktische Sitzungen und Workshops mit Experten. 23.-25. Januar 2026.",
    },
    {
      language: "it",
      title: "II Giornate di Trail Running - Nordeste",
      description: `# 🏔️ II Giornate di Trail Running

## 📅 Evento di Formazione e Workshop | 23-25 Gennaio 2026

Le **II Giornate di Trail Running** a Nordeste, Azzorre, sono un evento di formazione completo dedicato al Trail Running. Durante **tre giorni intensivi**, i partecipanti avranno accesso a conferenze teoriche di esperti, sessioni pratiche sul campo e momenti di condivisione di esperienze.

---

## 🎯 Destinatari

Aperto a tutti gli interessati al Trail Running:
- 🏃 Atleti di Trail Running
- 🏋️ Allenatori e preparatori fisici
- 👨‍🏫 Insegnanti di Educazione Fisica
- 💚 Appassionati di Trail Running
- 🏃‍♀️ Principianti che vogliono imparare

---

## 🎁 Cosa è incluso

- 📚 Accesso a tutte le sessioni teoriche
- 🏃 Partecipazione alle sessioni pratiche
- 📖 Materiali formativi
- 🍽️ Pasti (pranzo sabato, cena sabato, colazione domenica, pranzo domenica)
- ☕ Pause caffè
- 🎓 Certificato di partecipazione

---

## 🌟 Perché partecipare?

✅ **Imparare** da esperti riconosciuti  
✅ **Praticare** tecniche ed esercizi sul campo  
✅ **Incontrare** altri appassionati e professionisti  
✅ **Approfondire** le tue conoscenze sul Trail Running  
✅ **Migliorare** la tua tecnica e pianificazione  
✅ **Scoprire** il bellissimo Nordeste, Azzorre

---

**Iscriviti ora e vieni a imparare, praticare e condividere la tua passione per il Trail Running! 🏔️🏃‍♂️**`,
      city: "Nordeste",
      metaTitle:
        "II Giornate di Trail Running - Nordeste 2026 | Formazione e Workshop",
      metaDescription:
        "Giornate di formazione sul Trail Running a Nordeste, Azzorre. 3 giorni di conferenze teoriche, sessioni pratiche e workshop con esperti. 23-25 Gennaio 2026.",
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

  console.log("");
  console.log(
    "🎉 II Jornadas de Trail Running - Nordeste 2026 seeded successfully!"
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
