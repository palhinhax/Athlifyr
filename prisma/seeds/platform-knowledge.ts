/**
 * Seed Platform Knowledge Base
 * Information about Athlifyr for the AI assistant to use when answering
 * questions about the platform, pricing, features, etc.
 *
 * This seed is IDEMPOTENT — safe to run multiple times.
 */

import { PrismaClient, Language } from "@prisma/client";

const prisma = new PrismaClient();

interface KnowledgeArticle {
  slug: string;
  category: string;
  priority: number;
  translations: Record<
    Language,
    {
      title: string;
      content: string;
    }
  >;
}

const articles: KnowledgeArticle[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ABOUT — What is Athlifyr
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: "about-athlifyr",
    category: "about",
    priority: 100,
    translations: {
      [Language.pt]: {
        title: "O que é o Athlifyr?",
        content: `O **Athlifyr** é uma plataforma desportiva completa que liga atletas, ginásios, boxes de CrossFit, estúdios de treino pessoal, e organizadores de eventos desportivos — tudo num só lugar.

**Missão**: Tornar o desporto mais acessível, organizado e conectado para toda a comunidade fitness em Portugal e no mundo.

**Para quem é o Athlifyr?**
- 🏋️ **Donos de ginásios, boxes e estúdios** — gestão de membros, aulas, horários, coaches e presença online
- 🏃 **Atletas e praticantes** — descobrir eventos, treinar com IA, acompanhar progresso, marcar aulas
- 🎪 **Organizadores de eventos** — promover corridas, trails, provas OCR, HYROX e muito mais
- 💆 **Profissionais de saúde** — massagistas, fisioterapeutas e nutricionistas com presença na plataforma

**O que nos diferencia?**
- ✅ **100% gratuito** para ginásios e atletas — sem taxas escondidas
- ✅ Assistente de IA integrado (Athli) para treinos personalizados
- ✅ Sistema de marcação de aulas e sessões com Easy Link partilhável
- ✅ Análise de vídeo de exercícios com IA (forma e bar path)
- ✅ Calendário de eventos desportivos em Portugal
- ✅ Sorteios transparentes com algoritmo verificável
- ✅ Planos de treino e workouts personalizados
- ✅ Registo de PRs (records pessoais) por modalidade`,
      },
      [Language.en]: {
        title: "What is Athlifyr?",
        content: `**Athlifyr** is a complete sports platform that connects athletes, gyms, CrossFit boxes, personal training studios, and sports event organizers — all in one place.

**Mission**: Make sports more accessible, organized, and connected for the entire fitness community in Portugal and worldwide.

**Who is Athlifyr for?**
- 🏋️ **Gym, box, and studio owners** — member management, classes, schedules, coaches, and online presence
- 🏃 **Athletes and practitioners** — discover events, train with AI, track progress, book classes
- 🎪 **Event organizers** — promote races, trails, OCR events, HYROX, and more
- 💆 **Health professionals** — massage therapists, physiotherapists, and nutritionists with platform presence

**What makes us different?**
- ✅ **100% free** for gyms and athletes — no hidden fees
- ✅ Integrated AI assistant (Athli) for personalized workouts
- ✅ Class booking system with shareable Easy Link
- ✅ AI-powered video analysis (exercise form and bar path)
- ✅ Sports event calendar in Portugal
- ✅ Transparent giveaways with verifiable algorithm
- ✅ Personalized training plans and workouts
- ✅ PR (personal records) tracking by sport`,
      },
      [Language.es]: {
        title: "¿Qué es Athlifyr?",
        content: `**Athlifyr** es una plataforma deportiva completa que conecta atletas, gimnasios, boxes de CrossFit, estudios de entrenamiento personal y organizadores de eventos deportivos — todo en un solo lugar.

**Misión**: Hacer el deporte más accesible, organizado y conectado para toda la comunidad fitness en Portugal y en el mundo.

**¿Para quién es Athlifyr?**
- 🏋️ **Dueños de gimnasios, boxes y estudios** — gestión de miembros, clases, horarios, coaches y presencia online
- 🏃 **Atletas y practicantes** — descubrir eventos, entrenar con IA, seguir progreso, reservar clases
- 🎪 **Organizadores de eventos** — promover carreras, trails, OCR, HYROX y más
- 💆 **Profesionales de salud** — masajistas, fisioterapeutas y nutricionistas con presencia en la plataforma

**¿Qué nos diferencia?**
- ✅ **100% gratuito** para gimnasios y atletas — sin tarifas ocultas
- ✅ Asistente de IA integrado (Athli) para entrenamientos personalizados
- ✅ Sistema de reserva de clases con Easy Link compartible
- ✅ Análisis de vídeo con IA (forma de ejercicio y bar path)
- ✅ Calendario de eventos deportivos en Portugal
- ✅ Sorteos transparentes con algoritmo verificable
- ✅ Planes de entrenamiento y workouts personalizados
- ✅ Registro de PRs (records personales) por modalidad`,
      },
      [Language.fr]: {
        title: "Qu'est-ce qu'Athlifyr ?",
        content: `**Athlifyr** est une plateforme sportive complète qui connecte athlètes, salles de sport, boxes de CrossFit, studios d'entraînement personnel et organisateurs d'événements sportifs — tout en un seul endroit.

**Mission** : Rendre le sport plus accessible, organisé et connecté pour toute la communauté fitness au Portugal et dans le monde.

**Pour qui est Athlifyr ?**
- 🏋️ **Propriétaires de salles, boxes et studios** — gestion des membres, cours, horaires, coachs et présence en ligne
- 🏃 **Athlètes et pratiquants** — découvrir des événements, s'entraîner avec l'IA, suivre sa progression, réserver des cours
- 🎪 **Organisateurs d'événements** — promouvoir courses, trails, OCR, HYROX et plus
- 💆 **Professionnels de santé** — masseurs, kinésithérapeutes et nutritionnistes avec présence sur la plateforme

**Ce qui nous différencie :**
- ✅ **100% gratuit** pour les salles et les athlètes — sans frais cachés
- ✅ Assistant IA intégré (Athli) pour des entraînements personnalisés
- ✅ Système de réservation de cours avec Easy Link partageable
- ✅ Analyse vidéo par IA (forme d'exercice et bar path)
- ✅ Calendrier d'événements sportifs au Portugal
- ✅ Tirages au sort transparents avec algorithme vérifiable
- ✅ Plans d'entraînement et workouts personnalisés
- ✅ Suivi des PRs (records personnels) par sport`,
      },
      [Language.de]: {
        title: "Was ist Athlifyr?",
        content: `**Athlifyr** ist eine komplette Sportplattform, die Athleten, Fitnessstudios, CrossFit-Boxes, Personal-Training-Studios und Sportveranstalter verbindet — alles an einem Ort.

**Mission**: Sport zugänglicher, organisierter und vernetzter für die gesamte Fitness-Community in Portugal und weltweit machen.

**Für wen ist Athlifyr?**
- 🏋️ **Studio-, Box- und Studiobesitzer** — Mitgliederverwaltung, Kurse, Zeitpläne, Coaches und Online-Präsenz
- 🏃 **Athleten und Sportler** — Events entdecken, mit KI trainieren, Fortschritt verfolgen, Kurse buchen
- 🎪 **Veranstalter** — Rennen, Trails, OCR, HYROX und mehr bewerben
- 💆 **Gesundheitsfachkräfte** — Masseure, Physiotherapeuten und Ernährungsberater mit Plattformpräsenz

**Was uns unterscheidet:**
- ✅ **100% kostenlos** für Studios und Athleten — keine versteckten Gebühren
- ✅ Integrierter KI-Assistent (Athli) für personalisierte Workouts
- ✅ Kursbuchungssystem mit teilbarem Easy Link
- ✅ KI-gestützte Videoanalyse (Übungsform und Bar Path)
- ✅ Sportevent-Kalender in Portugal
- ✅ Transparente Verlosungen mit überprüfbarem Algorithmus
- ✅ Personalisierte Trainingspläne und Workouts
- ✅ PR-Tracking (persönliche Rekorde) nach Sportart`,
      },
      [Language.it]: {
        title: "Cos'è Athlifyr?",
        content: `**Athlifyr** è una piattaforma sportiva completa che connette atleti, palestre, box di CrossFit, studi di allenamento personale e organizzatori di eventi sportivi — tutto in un unico posto.

**Missione**: Rendere lo sport più accessibile, organizzato e connesso per l'intera comunità fitness in Portogallo e nel mondo.

**Per chi è Athlifyr?**
- 🏋️ **Proprietari di palestre, box e studi** — gestione dei membri, lezioni, orari, coach e presenza online
- 🏃 **Atleti e praticanti** — scoprire eventi, allenarsi con l'IA, monitorare i progressi, prenotare lezioni
- 🎪 **Organizzatori di eventi** — promuovere gare, trail, OCR, HYROX e altro
- 💆 **Professionisti della salute** — massaggiatori, fisioterapisti e nutrizionisti con presenza sulla piattaforma

**Cosa ci distingue:**
- ✅ **100% gratuito** per palestre e atleti — nessuna commissione nascosta
- ✅ Assistente IA integrato (Athli) per allenamenti personalizzati
- ✅ Sistema di prenotazione lezioni con Easy Link condivisibile
- ✅ Analisi video con IA (forma dell'esercizio e bar path)
- ✅ Calendario eventi sportivi in Portogallo
- ✅ Estrazioni trasparenti con algoritmo verificabile
- ✅ Piani di allenamento e workout personalizzati
- ✅ Tracciamento PR (record personali) per sport`,
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // PRICING — Plans and costs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: "pricing-overview",
    category: "pricing",
    priority: 100,
    translations: {
      [Language.pt]: {
        title: "Preços e planos do Athlifyr",
        content: `## 💰 Preços — O Athlifyr é GRATUITO!

**O Athlifyr é 100% gratuito** para todos — ginásios, boxes, estúdios, atletas e organizadores de eventos.

### Para ginásios, boxes e estúdios
- ✅ **0€/mês** — Sem mensalidades, sem comissões, sem taxas escondidas
- ✅ Página do espaço na plataforma — a tua montra online gratuita
- ✅ Sistema de marcação de aulas ilimitado
- ✅ Easy Link — link partilhável para marcações rápidas (ideal para massagistas, PTs, etc.)
- ✅ Gestão de coaches e horários
- ✅ Gestão de planos e preços na página do espaço
- ✅ Sem limite de membros ou aulas
- ✅ Sem contrato — entra e sai quando quiseres

### Para atletas e praticantes
- ✅ **0€** — Conta gratuita para sempre
- ✅ Descobrir e inscrever-se em eventos desportivos
- ✅ Marcar aulas em ginásios e boxes parceiros
- ✅ Assistente de IA (Athli) para treinos personalizados
- ✅ Análise de vídeo de exercícios com IA
- ✅ Registo de PRs e histórico de treinos
- ✅ Participar em sorteios de prémios

### Porque é gratuito?
O Athlifyr acredita que o acesso a ferramentas desportivas de qualidade deve ser universal. A nossa missão é construir a maior comunidade fitness de Portugal, e cobramos 0€ para garantir que toda a gente pode participar.

**Sem truques, sem período de teste, sem funcionalidades premium escondidas. É gratuito. Ponto.**`,
      },
      [Language.en]: {
        title: "Athlifyr pricing and plans",
        content: `## 💰 Pricing — Athlifyr is FREE!

**Athlifyr is 100% free** for everyone — gyms, boxes, studios, athletes, and event organizers.

### For gyms, boxes, and studios
- ✅ **€0/month** — No subscriptions, no commissions, no hidden fees
- ✅ Venue page on the platform — your free online showcase
- ✅ Unlimited class booking system
- ✅ Easy Link — shareable booking link for quick appointments (ideal for massage therapists, PTs, etc.)
- ✅ Coach and schedule management
- ✅ Plans and pricing management on your venue page
- ✅ No member or class limits
- ✅ No contract — join and leave anytime

### For athletes and practitioners
- ✅ **€0** — Free account forever
- ✅ Discover and register for sports events
- ✅ Book classes at partner gyms and boxes
- ✅ AI assistant (Athli) for personalized workouts
- ✅ AI-powered exercise video analysis
- ✅ PR tracking and workout history
- ✅ Participate in prize giveaways

### Why is it free?
Athlifyr believes that access to quality sports tools should be universal. Our mission is to build the largest fitness community in Portugal, and we charge €0 to ensure everyone can participate.

**No tricks, no trial period, no hidden premium features. It's free. Period.**`,
      },
      [Language.es]: {
        title: "Precios y planes de Athlifyr",
        content: `## 💰 Precios — ¡Athlifyr es GRATIS!

**Athlifyr es 100% gratuito** para todos — gimnasios, boxes, estudios, atletas y organizadores de eventos.

### Para gimnasios, boxes y estudios
- ✅ **0€/mes** — Sin suscripciones, sin comisiones, sin tarifas ocultas
- ✅ Página del centro en la plataforma — tu escaparate online gratuito
- ✅ Sistema de reserva de clases ilimitado
- ✅ Easy Link — enlace compartible para reservas rápidas (ideal para masajistas, PTs, etc.)
- ✅ Gestión de coaches y horarios
- ✅ Gestión de planes y precios
- ✅ Sin límite de miembros o clases
- ✅ Sin contrato — entra y sal cuando quieras

### Para atletas y practicantes
- ✅ **0€** — Cuenta gratuita para siempre
- ✅ Descubrir e inscribirse en eventos deportivos
- ✅ Reservar clases en gimnasios y boxes asociados
- ✅ Asistente de IA (Athli) para entrenamientos personalizados
- ✅ Análisis de vídeo con IA
- ✅ Registro de PRs e historial de entrenamientos
- ✅ Participar en sorteos de premios

**Sin trucos, sin período de prueba, sin funcionalidades premium ocultas. Es gratuito. Punto.**`,
      },
      [Language.fr]: {
        title: "Tarifs et plans Athlifyr",
        content: `## 💰 Tarifs — Athlifyr est GRATUIT !

**Athlifyr est 100% gratuit** pour tous — salles de sport, boxes, studios, athlètes et organisateurs d'événements.

### Pour les salles, boxes et studios
- ✅ **0€/mois** — Sans abonnement, sans commission, sans frais cachés
- ✅ Page de votre salle sur la plateforme — votre vitrine en ligne gratuite
- ✅ Système de réservation de cours illimité
- ✅ Easy Link — lien partageable pour des réservations rapides (idéal pour masseurs, PTs, etc.)
- ✅ Gestion des coachs et des horaires
- ✅ Gestion des plans et tarifs
- ✅ Sans limite de membres ou de cours
- ✅ Sans contrat — rejoignez et partez quand vous voulez

### Pour les athlètes et pratiquants
- ✅ **0€** — Compte gratuit pour toujours
- ✅ Découvrir et s'inscrire à des événements sportifs
- ✅ Réserver des cours dans les salles partenaires
- ✅ Assistant IA (Athli) pour des entraînements personnalisés
- ✅ Analyse vidéo par IA
- ✅ Suivi des PRs et historique d'entraînement
- ✅ Participer à des tirages au sort

**Sans piège, sans période d'essai, sans fonctionnalités premium cachées. C'est gratuit. Point.**`,
      },
      [Language.de]: {
        title: "Athlifyr Preise und Pläne",
        content: `## 💰 Preise — Athlifyr ist KOSTENLOS!

**Athlifyr ist 100% kostenlos** für alle — Fitnessstudios, Boxes, Studios, Athleten und Veranstalter.

### Für Studios, Boxes und Studios
- ✅ **0€/Monat** — Keine Abonnements, keine Provisionen, keine versteckten Gebühren
- ✅ Studioseite auf der Plattform — Ihr kostenloses Online-Schaufenster
- ✅ Unbegrenztes Kursbuchungssystem
- ✅ Easy Link — teilbarer Link für schnelle Buchungen (ideal für Masseure, PTs, etc.)
- ✅ Coach- und Zeitplanverwaltung
- ✅ Plan- und Preisverwaltung
- ✅ Keine Mitglieder- oder Kurslimits
- ✅ Kein Vertrag — jederzeit beitreten und verlassen

### Für Athleten und Sportler
- ✅ **0€** — Kostenloses Konto für immer
- ✅ Sportevents entdecken und anmelden
- ✅ Kurse in Partnerstudios buchen
- ✅ KI-Assistent (Athli) für personalisierte Workouts
- ✅ KI-gestützte Videoanalyse
- ✅ PR-Tracking und Trainingshistorie
- ✅ An Verlosungen teilnehmen

**Keine Tricks, keine Testphase, keine versteckten Premium-Features. Es ist kostenlos. Punkt.**`,
      },
      [Language.it]: {
        title: "Prezzi e piani Athlifyr",
        content: `## 💰 Prezzi — Athlifyr è GRATUITO!

**Athlifyr è 100% gratuito** per tutti — palestre, box, studi, atleti e organizzatori di eventi.

### Per palestre, box e studi
- ✅ **0€/mese** — Nessun abbonamento, nessuna commissione, nessuna tariffa nascosta
- ✅ Pagina del centro sulla piattaforma — la tua vetrina online gratuita
- ✅ Sistema di prenotazione lezioni illimitato
- ✅ Easy Link — link condivisibile per prenotazioni rapide (ideale per massaggiatori, PT, etc.)
- ✅ Gestione coach e orari
- ✅ Gestione piani e prezzi
- ✅ Nessun limite di membri o lezioni
- ✅ Nessun contratto — entra ed esci quando vuoi

### Per atleti e praticanti
- ✅ **0€** — Account gratuito per sempre
- ✅ Scoprire e iscriversi a eventi sportivi
- ✅ Prenotare lezioni in palestre e box partner
- ✅ Assistente IA (Athli) per allenamenti personalizzati
- ✅ Analisi video con IA
- ✅ Tracciamento PR e storico allenamenti
- ✅ Partecipare a estrazioni di premi

**Nessun trucco, nessun periodo di prova, nessuna funzionalità premium nascosta. È gratuito. Punto.**`,
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FEATURES — For venues (gyms, boxes, studios)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: "features-venues",
    category: "features_venues",
    priority: 100,
    translations: {
      [Language.pt]: {
        title: "Funcionalidades para ginásios, boxes e estúdios",
        content: `## 🏋️ Funcionalidades para o teu espaço no Athlifyr

### 📋 Página do teu espaço
- Página dedicada com nome, descrição, fotos, localização e contactos
- Aparece nas buscas de atletas que procuram ginásios/boxes/estúdios na zona
- Informação sobre modalidades disponíveis (CrossFit, Musculação, PT, etc.)
- Link direto para o teu website e redes sociais

### 📅 Sistema de marcação de aulas
- Cria aulas com horário, duração, coach responsável e limite de vagas
- Os teus membros marcam aula diretamente pelo Athlifyr
- Controlo de presenças em tempo real
- Cancela ou reagenda aulas facilmente
- Aulas recorrentes (semanais) ou pontuais

### 🔗 Easy Link — Marcação rápida por link partilhável
- Cada espaço tem um **link único de marcação** (ex: athlifyr.com/v/teu-espaco/book)
- Partilha na bio do Instagram, WhatsApp, Facebook ou onde quiseres
- Os clientes acedem ao link, vêem o calendário e marcam em 30 segundos
- **Modo aberto**: qualquer pessoa pode marcar sem login — pede apenas nome, email e telefone
- **Modo com plano**: apenas membros com subscrição ativa podem marcar
- Perfeito para **massagistas, fisioterapeutas, nutricionistas e PTs** que precisam de marcações fáceis sem fricção

### 👥 Gestão de membros
- Vê quem está inscrito no teu espaço
- Controla quem pode marcar aulas
- Associa membros a planos específicos

### 🏃 Gestão de coaches
- Adiciona coaches ao teu espaço
- Associa coaches a aulas específicas
- Perfil de cada coach visível para os membros

### 💰 Planos e preços
- Cria e gere planos de subscrição (mensal, trimestral, etc.)
- Os planos aparecem na página do teu espaço
- Os atletas podem ver os preços antes de se inscreverem

### 🏋️ Workouts e programação
- Cria workouts e associa-os a sessões/aulas
- Os membros vêem o treino do dia na app antes de irem à aula
- Biblioteca de exercícios da Athlifyr com demonstrações

### 📊 Visibilidade e marketing
- O teu espaço aparece nos resultados de busca do Athlifyr
- Atletas podem descobrir o teu espaço ao pesquisar por modalidade e localização
- O assistente de IA (Athli) pode recomendar o teu espaço diretamente a atletas que procuram ginásios

### 🚀 Como adicionar o teu espaço
1. Cria uma conta gratuita no Athlifyr
2. Pede à equipa Athlifyr para criar a página do teu espaço (podes pedir aqui no chat!)
3. Configura horários, aulas e coaches
4. Começa a receber marcações dos teus membros

**Tudo isto é GRATUITO — sem taxas, sem comissões, sem contratos.**`,
      },
      [Language.en]: {
        title: "Features for gyms, boxes, and studios",
        content: `## 🏋️ Features for your venue on Athlifyr

### 📋 Your venue page
- Dedicated page with name, description, photos, location, and contacts
- Appears in athlete searches looking for gyms/boxes/studios in the area
- Information about available sports (CrossFit, Strength, PT, etc.)
- Direct link to your website and social media

### 📅 Class booking system
- Create classes with schedule, duration, assigned coach, and spot limits
- Your members book classes directly through Athlifyr
- Real-time attendance tracking
- Easily cancel or reschedule classes
- Recurring (weekly) or one-time classes

### 🔗 Easy Link — Quick booking via shareable link
- Each venue gets a **unique booking link** (e.g., athlifyr.com/v/your-venue/book)
- Share on Instagram bio, WhatsApp, Facebook, or anywhere you want
- Clients access the link, see the calendar, and book in 30 seconds
- **Open mode**: anyone can book without login — only asks for name, email, and phone
- **Plan mode**: only members with active subscription can book
- Perfect for **massage therapists, physiotherapists, nutritionists, and PTs** who need frictionless easy bookings

### 👥 Member management
- View who is enrolled at your venue
- Control who can book classes
- Associate members with specific plans

### 🏃 Coach management
- Add coaches to your venue
- Assign coaches to specific classes
- Each coach's profile visible to members

### 💰 Plans and pricing
- Create and manage subscription plans (monthly, quarterly, etc.)
- Plans appear on your venue page
- Athletes can view prices before enrolling

### 🏋️ Workouts and programming
- Create workouts and assign them to sessions/classes
- Members see the day's workout in the app before attending class
- Athlifyr exercise library with demonstrations

### 📊 Visibility and marketing
- Your venue appears in Athlifyr search results
- Athletes can discover your venue by searching by sport and location
- The AI assistant (Athli) can recommend your venue directly to athletes looking for gyms

### 🚀 How to add your venue
1. Create a free Athlifyr account
2. Ask the Athlifyr team to create your venue page (you can ask here in the chat!)
3. Set up schedules, classes, and coaches
4. Start receiving bookings from your members

**All of this is FREE — no fees, no commissions, no contracts.**`,
      },
      [Language.es]: {
        title: "Funcionalidades para gimnasios, boxes y estudios",
        content: `## 🏋️ Funcionalidades para tu centro en Athlifyr

### 📋 Página de tu centro
- Página dedicada con nombre, descripción, fotos, ubicación y contactos
- Aparece en las búsquedas de atletas que buscan gimnasios/boxes/estudios en la zona

### 📅 Sistema de reserva de clases
- Crea clases con horario, duración, coach y límite de plazas
- Tus miembros reservan directamente por Athlifyr
- Control de asistencia en tiempo real

### 🔗 Easy Link — Reserva rápida por enlace compartible
- Cada centro tiene un enlace único de reserva que puedes compartir en Instagram, WhatsApp o redes sociales
- Los clientes acceden, ven el calendario y reservan en 30 segundos sin registro
- Perfecto para masajistas, fisioterapeutas, nutricionistas y PTs

### 👥 Gestión de miembros y coaches
- Gestiona inscripciones y asocia miembros a planes
- Añade coaches y asígnalos a clases

### 💰 Planes y precios
- Crea planes de suscripción visibles en tu página

### 🏋️ Workouts
- Crea workouts y asócialos a sesiones — los miembros ven el entrenamiento del día

### 🚀 Cómo añadir tu centro
1. Crea una cuenta gratuita
2. Pide al equipo Athlifyr crear tu página (puedes pedirlo aquí en el chat)
3. Configura horarios, clases y coaches
4. Empieza a recibir reservas

**Todo GRATIS — sin tarifas, sin comisiones, sin contratos.**`,
      },
      [Language.fr]: {
        title: "Fonctionnalités pour salles, boxes et studios",
        content: `## 🏋️ Fonctionnalités pour votre salle sur Athlifyr

### 📋 Page de votre salle
- Page dédiée avec nom, description, photos, localisation et contacts
- Visible dans les recherches des athlètes

### 📅 Système de réservation de cours
- Créez des cours avec horaire, durée, coach et limite de places
- Vos membres réservent directement via Athlifyr
- Suivi de présence en temps réel

### 🔗 Easy Link — Réservation rapide via lien partageable
- Chaque salle a un lien unique de réservation à partager sur Instagram, WhatsApp ou réseaux sociaux
- Les clients accèdent, voient le calendrier et réservent en 30 secondes sans inscription
- Parfait pour masseurs, kinés, nutritionnistes et coachs personnels

### 👥 Gestion des membres et coachs
- Gérez les inscriptions et associez les membres à des plans
- Ajoutez des coachs et attribuez-les à des cours

### 💰 Plans et tarifs
- Créez des plans d'abonnement visibles sur votre page

### 🏋️ Workouts
- Créez des workouts et associez-les à des séances

### 🚀 Comment ajouter votre salle
1. Créez un compte gratuit
2. Demandez à l'équipe Athlifyr de créer votre page (vous pouvez demander ici dans le chat !)
3. Configurez horaires, cours et coachs
4. Commencez à recevoir des réservations

**Tout est GRATUIT — sans frais, sans commission, sans contrat.**`,
      },
      [Language.de]: {
        title: "Funktionen für Studios, Boxes und Studios",
        content: `## 🏋️ Funktionen für Ihr Studio auf Athlifyr

### 📋 Ihre Studioseite
- Eigene Seite mit Name, Beschreibung, Fotos, Standort und Kontakten
- Erscheint in Athleten-Suchen

### 📅 Kursbuchungssystem
- Kurse mit Zeitplan, Dauer, Coach und Platzbegrenzung erstellen
- Mitglieder buchen direkt über Athlifyr
- Echtzeit-Anwesenheitsverfolgung

### 🔗 Easy Link — Schnelle Buchung per teilbarem Link
- Jedes Studio hat einen einzigartigen Buchungslink für Instagram, WhatsApp oder soziale Medien
- Kunden greifen zu, sehen den Kalender und buchen in 30 Sekunden ohne Registrierung
- Perfekt für Masseure, Physiotherapeuten, Ernährungsberater und Personal Trainer

### 👥 Mitglieder- und Coach-Verwaltung
- Einschreibungen verwalten, Mitglieder Plänen zuweisen
- Coaches hinzufügen und Kursen zuweisen

### 💰 Pläne und Preise
- Abo-Pläne erstellen, sichtbar auf Ihrer Seite

### 🚀 So fügen Sie Ihr Studio hinzu
1. Erstellen Sie ein kostenloses Konto
2. Bitten Sie das Athlifyr-Team, Ihre Seite zu erstellen (fragen Sie hier im Chat!)
3. Richten Sie Zeitpläne, Kurse und Coaches ein
4. Beginnen Sie, Buchungen zu erhalten

**Alles KOSTENLOS — keine Gebühren, keine Provisionen, kein Vertrag.**`,
      },
      [Language.it]: {
        title: "Funzionalità per palestre, box e studi",
        content: `## 🏋️ Funzionalità per il tuo centro su Athlifyr

### 📋 Pagina del tuo centro
- Pagina dedicata con nome, descrizione, foto, posizione e contatti
- Visibile nelle ricerche degli atleti

### 📅 Sistema di prenotazione lezioni
- Crea lezioni con orario, durata, coach e limite posti
- I tuoi membri prenotano direttamente tramite Athlifyr
- Monitoraggio presenze in tempo reale

### 🔗 Easy Link — Prenotazione rapida tramite link condivisibile
- Ogni centro ha un link unico di prenotazione da condividere su Instagram, WhatsApp o social
- I clienti accedono, vedono il calendario e prenotano in 30 secondi senza registrazione
- Perfetto per massaggiatori, fisioterapisti, nutrizionisti e personal trainer

### 👥 Gestione membri e coach
- Gestisci iscrizioni e associa membri a piani
- Aggiungi coach e assegnali a lezioni

### 💰 Piani e prezzi
- Crea piani di abbonamento visibili sulla tua pagina

### 🚀 Come aggiungere il tuo centro
1. Crea un account gratuito
2. Chiedi al team Athlifyr di creare la tua pagina (puoi chiederlo qui in chat!)
3. Configura orari, lezioni e coach
4. Inizia a ricevere prenotazioni

**Tutto GRATUITO — nessuna commissione, nessun contratto.**`,
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FEATURES — For athletes
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: "features-athletes",
    category: "features_athletes",
    priority: 100,
    translations: {
      [Language.pt]: {
        title: "Funcionalidades para atletas",
        content: `## 🏃 Funcionalidades para atletas no Athlifyr

### 🗓️ Eventos desportivos
- Descobre corridas, trails, provas OCR, HYROX, BTT, triatlos, natação e muito mais
- Filtra por modalidade, localização e data
- Vê preços, distâncias, desníveis e detalhes de cada prova
- Inscreve-te diretamente através dos links de inscrição
- Acompanha a previsão meteorológica para os teus eventos

### 📅 Marcação de aulas
- Marca aulas nos ginásios e boxes parceiros
- Vê o treino do dia antes de ires à aula
- Marcação rápida via Easy Link partilhado pelo espaço
- Gere as tuas reservas (marcar, cancelar, ver histórico)

### 🤖 Assistente de IA (Athli)
- Fala com o Athli para receber ajuda personalizada
- Cria treinos personalizados (força, CrossFit, cardio, etc.)
- Gera planos de treino multi-semana adaptados aos teus objetivos
- Recebe sugestões de eventos baseadas nos teus interesses
- Pergunta sobre os teus PRs, treinos e análises

### 📹 Análise de vídeo com IA
- Grava um exercício e submete o vídeo para análise
- **Análise de movimento (Motion)** — avaliação de postura e forma do exercício (agachamento, corrida, etc.)
- **Análise de levantamento (Lift)** — tracking do bar path em exercícios com barra
- Recebe pontuação de forma (0-100), pontos fortes, áreas de melhoria e alertas de segurança
- Ideal para melhorar a técnica mesmo sem coach presencial

### 🏆 Records pessoais (PRs)
- Regista os teus PRs de força (Back Squat, Deadlift, Bench Press, etc.)
- Regista tempos de corrida (5K, 10K, meia-maratona, maratona)
- Regista tempos de trail (com desnível e distância)
- Regista tempos de HYROX
- Acompanha a evolução ao longo do tempo

### 📊 Histórico de treinos
- Regista os treinos que fazes (workouts completos com exercícios, séries, reps)
- Consulta quantos treinos fizeste esta semana, mês ou ano
- Acompanha tendências de feeling e RPE (esforço percebido)
- Vê estatísticas acumuladas

### 🎁 Sorteios
- Participa em sorteios de prémios na plataforma
- Algoritmo de sorteio transparente e verificável
- Vê o número do teu bilhete e os resultados

### 💡 Tudo gratuito
Todas estas funcionalidades são **100% gratuitas** — não pagas nada para usar o Athlifyr.`,
      },
      [Language.en]: {
        title: "Features for athletes",
        content: `## 🏃 Features for athletes on Athlifyr

### 🗓️ Sports events
- Discover races, trails, OCR, HYROX, MTB, triathlons, swimming, and more
- Filter by sport, location, and date
- View prices, distances, elevation, and race details
- Register directly through registration links
- Track weather forecasts for your events

### 📅 Class booking
- Book classes at partner gyms and boxes
- See the day's workout before attending
- Quick booking via Easy Link shared by the venue
- Manage your reservations (book, cancel, view history)

### 🤖 AI Assistant (Athli)
- Chat with Athli for personalized help
- Create custom workouts (strength, CrossFit, cardio, etc.)
- Generate multi-week training plans tailored to your goals
- Get event suggestions based on your interests
- Ask about your PRs, workouts, and analyses

### 📹 AI video analysis
- Record an exercise and submit the video for analysis
- **Motion analysis** — posture and exercise form assessment
- **Lift analysis** — bar path tracking for barbell exercises
- Get form score (0-100), strengths, improvement areas, and safety alerts
- Perfect for improving technique even without an in-person coach

### 🏆 Personal records (PRs)
- Log strength PRs (Back Squat, Deadlift, Bench Press, etc.)
- Log running times (5K, 10K, half-marathon, marathon)
- Log trail times (with elevation and distance)
- Log HYROX times
- Track progress over time

### 📊 Workout history
- Log completed workouts with exercises, sets, reps
- View weekly, monthly, yearly training stats
- Track feeling and RPE trends

### 🎁 Giveaways
- Participate in prize giveaways on the platform
- Transparent and verifiable draw algorithm

### 💡 All free
All these features are **100% free** — you pay nothing to use Athlifyr.`,
      },
      [Language.es]: {
        title: "Funcionalidades para atletas",
        content: `## 🏃 Funcionalidades para atletas en Athlifyr

- 🗓️ Descubre eventos deportivos (carreras, trails, OCR, HYROX, BTT, triatlones)
- 📅 Reserva clases en gimnasios y boxes asociados con Easy Link
- 🤖 Asistente de IA (Athli) para entrenamientos y planes personalizados
- 📹 Análisis de vídeo con IA (forma de ejercicio y bar path)
- 🏆 Registro de PRs (fuerza, carrera, trail, HYROX)
- 📊 Historial de entrenamientos con estadísticas
- 🎁 Sorteos de premios transparentes

**Todo 100% GRATIS.**`,
      },
      [Language.fr]: {
        title: "Fonctionnalités pour les athlètes",
        content: `## 🏃 Fonctionnalités pour les athlètes sur Athlifyr

- 🗓️ Découvrir des événements sportifs (courses, trails, OCR, HYROX, VTT, triathlons)
- 📅 Réserver des cours dans les salles partenaires avec Easy Link
- 🤖 Assistant IA (Athli) pour des entraînements et plans personnalisés
- 📹 Analyse vidéo par IA (forme d'exercice et bar path)
- 🏆 Suivi des PRs (force, course, trail, HYROX)
- 📊 Historique d'entraînement avec statistiques
- 🎁 Tirages au sort transparents

**Tout est 100% GRATUIT.**`,
      },
      [Language.de]: {
        title: "Funktionen für Athleten",
        content: `## 🏃 Funktionen für Athleten auf Athlifyr

- 🗓️ Sportevents entdecken (Rennen, Trails, OCR, HYROX, MTB, Triathlons)
- 📅 Kurse in Partnerstudios buchen mit Easy Link
- 🤖 KI-Assistent (Athli) für personalisierte Workouts und Pläne
- 📹 KI-Videoanalyse (Übungsform und Bar Path)
- 🏆 PR-Tracking (Kraft, Laufen, Trail, HYROX)
- 📊 Trainingshistorie mit Statistiken
- 🎁 Transparente Verlosungen

**Alles 100% KOSTENLOS.**`,
      },
      [Language.it]: {
        title: "Funzionalità per gli atleti",
        content: `## 🏃 Funzionalità per atleti su Athlifyr

- 🗓️ Scopri eventi sportivi (gare, trail, OCR, HYROX, MTB, triathlon)
- 📅 Prenota lezioni in palestre partner con Easy Link
- 🤖 Assistente IA (Athli) per allenamenti e piani personalizzati
- 📹 Analisi video con IA (forma esercizio e bar path)
- 🏆 Tracciamento PR (forza, corsa, trail, HYROX)
- 📊 Storico allenamenti con statistiche
- 🎁 Estrazioni trasparenti

**Tutto 100% GRATUITO.**`,
      },
    },
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FAQ — Common questions
  // ═══════════════════════════════════════════════════════════════════════════
  {
    slug: "faq-how-to-add-venue",
    category: "faq",
    priority: 90,
    translations: {
      [Language.pt]: {
        title: "Como adicionar o meu ginásio/box ao Athlifyr?",
        content: `**Como adicionar o teu ginásio, box ou estúdio ao Athlifyr:**

1. **Cria uma conta gratuita** no Athlifyr (se ainda não tiveres)
2. **Pede à equipa** para configurar a página do teu espaço — podes fazer isso aqui mesmo no chat com o Athli! Basta dizer "quero adicionar o meu ginásio" e nós tratamos de tudo.
3. **Envia-nos as informações**: nome do espaço, morada, modalidades, contactos, fotos e horários
4. **A equipa configura tudo** — criamos a página, adicionamos os teus coaches e horários
5. **Começa a usar** — os teus membros já podem marcar aulas pelo Athlifyr!

⏱️ O processo é rápido e normalmente fica pronto em 24-48 horas.

💰 **É 100% gratuito** — sem custos de setup, sem mensalidades, sem comissões.

Tens dúvidas? Fala connosco aqui no chat ou envia email para a equipa Athlifyr!`,
      },
      [Language.en]: {
        title: "How to add my gym/box to Athlifyr?",
        content: `**How to add your gym, box, or studio to Athlifyr:**

1. **Create a free account** on Athlifyr (if you don't have one yet)
2. **Ask the team** to set up your venue page — you can do it right here in the chat with Athli! Just say "I want to add my gym" and we'll take care of everything.
3. **Send us the information**: venue name, address, sports, contacts, photos, and schedules
4. **The team sets everything up** — we create the page, add your coaches and schedules
5. **Start using it** — your members can now book classes through Athlifyr!

⏱️ The process is fast and usually ready in 24-48 hours.

💰 **It's 100% free** — no setup costs, no monthly fees, no commissions.`,
      },
      [Language.es]: {
        title: "¿Cómo añadir mi gimnasio/box a Athlifyr?",
        content: `**Cómo añadir tu gimnasio, box o estudio a Athlifyr:**

1. Crea una cuenta gratuita en Athlifyr
2. Pide al equipo que configure tu página — ¡puedes hacerlo aquí en el chat!
3. Envía nombre, dirección, deportes, contactos, fotos y horarios
4. El equipo lo configura todo en 24-48 horas
5. Tus miembros ya pueden reservar clases

💰 **100% gratuito** — sin costes, sin comisiones.`,
      },
      [Language.fr]: {
        title: "Comment ajouter ma salle/box à Athlifyr ?",
        content: `**Comment ajouter votre salle, box ou studio à Athlifyr :**

1. Créez un compte gratuit sur Athlifyr
2. Demandez à l'équipe de configurer votre page — vous pouvez le faire ici dans le chat !
3. Envoyez nom, adresse, sports, contacts, photos et horaires
4. L'équipe configure tout en 24-48 heures
5. Vos membres peuvent réserver des cours

💰 **100% gratuit** — sans frais, sans commission.`,
      },
      [Language.de]: {
        title: "Wie füge ich mein Studio/Box zu Athlifyr hinzu?",
        content: `**So fügen Sie Ihr Studio, Box oder Studio zu Athlifyr hinzu:**

1. Erstellen Sie ein kostenloses Konto auf Athlifyr
2. Bitten Sie das Team, Ihre Seite einzurichten — direkt hier im Chat!
3. Senden Sie Name, Adresse, Sportarten, Kontakte, Fotos und Zeitpläne
4. Das Team richtet alles in 24-48 Stunden ein
5. Ihre Mitglieder können Kurse buchen

💰 **100% kostenlos** — keine Gebühren, keine Provisionen.`,
      },
      [Language.it]: {
        title: "Come aggiungere la mia palestra/box ad Athlifyr?",
        content: `**Come aggiungere la tua palestra, box o studio ad Athlifyr:**

1. Crea un account gratuito su Athlifyr
2. Chiedi al team di configurare la tua pagina — puoi farlo qui in chat!
3. Invia nome, indirizzo, sport, contatti, foto e orari
4. Il team configura tutto in 24-48 ore
5. I tuoi membri possono prenotare lezioni

💰 **100% gratuito** — nessun costo, nessuna commissione.`,
      },
    },
  },
  {
    slug: "faq-supported-venue-types",
    category: "faq",
    priority: 80,
    translations: {
      [Language.pt]: {
        title: "Que tipos de espaços são suportados?",
        content: `O Athlifyr suporta vários tipos de espaços:

- 🏋️ **Ginásios (GYM)** — Ginásios tradicionais de musculação e fitness
- 💪 **Boxes de CrossFit (CROSSFIT_BOX)** — Boxes afiliadas e independentes de CrossFit
- 🏃 **Boxes de Cross Training (CROSSTRAINING_BOX)** — Espaços de treino funcional
- 🎯 **Estúdios de PT (PT_STUDIO)** — Estúdios de treino personalizado
- 💆 **Massagistas (MASSAGE)** — Massagem desportiva e terapêutica
- 🩺 **Fisioterapeutas (PHYSIO)** — Clínicas e consultórios de fisioterapia
- 🥗 **Nutricionistas (NUTRITION)** — Consultórios de nutrição desportiva
- 🏟️ **Outros (OTHER)** — Piscinas, campos de padel, estúdios de yoga, etc.

Todos podem ter página no Athlifyr, sistema de marcações e visibilidade gratuita!`,
      },
      [Language.en]: {
        title: "What types of venues are supported?",
        content: `Athlifyr supports various venue types:

- 🏋️ **Gyms (GYM)** — Traditional fitness and bodybuilding gyms
- 💪 **CrossFit Boxes (CROSSFIT_BOX)** — Affiliated and independent CrossFit boxes
- 🏃 **Cross Training Boxes (CROSSTRAINING_BOX)** — Functional training spaces
- 🎯 **PT Studios (PT_STUDIO)** — Personal training studios
- 💆 **Massage (MASSAGE)** — Sports and therapeutic massage
- 🩺 **Physiotherapy (PHYSIO)** — Physiotherapy clinics
- 🥗 **Nutrition (NUTRITION)** — Sports nutrition consultancies
- 🏟️ **Other (OTHER)** — Pools, padel courts, yoga studios, etc.

All can have a page on Athlifyr, booking system, and free visibility!`,
      },
      [Language.es]: {
        title: "¿Qué tipos de centros son compatibles?",
        content: `Athlifyr soporta: Gimnasios, Boxes de CrossFit, Boxes de Cross Training, Estudios de PT, Masajistas, Fisioterapeutas, Nutricionistas y otros. ¡Todos con página, reservas y visibilidad gratuita!`,
      },
      [Language.fr]: {
        title: "Quels types de salles sont pris en charge ?",
        content: `Athlifyr prend en charge : Salles de sport, Boxes de CrossFit, Boxes de Cross Training, Studios de PT, Masseurs, Kinés, Nutritionnistes et autres. Tous avec page, réservations et visibilité gratuite !`,
      },
      [Language.de]: {
        title: "Welche Arten von Studios werden unterstützt?",
        content: `Athlifyr unterstützt: Fitnessstudios, CrossFit-Boxes, Cross-Training-Boxes, PT-Studios, Masseure, Physiotherapeuten, Ernährungsberater und andere. Alle mit Seite, Buchungen und kostenloser Sichtbarkeit!`,
      },
      [Language.it]: {
        title: "Quali tipi di centri sono supportati?",
        content: `Athlifyr supporta: Palestre, Box di CrossFit, Box di Cross Training, Studi di PT, Massaggiatori, Fisioterapisti, Nutrizionisti e altri. Tutti con pagina, prenotazioni e visibilità gratuita!`,
      },
    },
  },
  {
    slug: "faq-supported-sports-events",
    category: "faq",
    priority: 70,
    translations: {
      [Language.pt]: {
        title: "Que modalidades e eventos são suportados?",
        content: `O Athlifyr suporta uma ampla gama de eventos desportivos:

- 🏃 **Running** — Corridas de estrada (5K, 10K, meia-maratona, maratona)
- 🏔️ **Trail** — Trail running (ultra trails, montanha, skyrunning)
- 🏋️ **HYROX** — Eventos HYROX oficiais e fitness racing
- 💪 **CrossFit** — Competições e throwdowns de CrossFit
- 🏗️ **OCR** — Corridas de obstáculos (Spartan Race, Tough Mudder, etc.)
- 🚴 **BTT/Cycling** — BTT, estrada e gravel
- 🏊 **Swimming** — Travessias, natação em águas abertas
- 🏅 **Triathlon** — Sprint, olímpico, 70.3, Ironman
- 🏄 **Surf** — Competições de surf
- 🚶 **Walking** — Caminhadas organizadas
- 🎯 **Other** — Outros eventos desportivos

Cada evento tem informação detalhada: provas/variantes, preços por fase, regulamento, FAQs, mapa do percurso e links de inscrição.`,
      },
      [Language.en]: {
        title: "What sports and events are supported?",
        content: `Athlifyr supports a wide range of sports events:

- 🏃 Running — Road races (5K, 10K, half-marathon, marathon)
- 🏔️ Trail — Trail running (ultras, mountain, skyrunning)
- 🏋️ HYROX — Official HYROX and fitness racing events
- 💪 CrossFit — Competitions and throwdowns
- 🏗️ OCR — Obstacle course racing
- 🚴 BTT/Cycling — MTB, road, and gravel
- 🏊 Swimming — Open water swimming
- 🏅 Triathlon — Sprint, Olympic, 70.3, Ironman
- 🏄 Surf — Competitions
- 🚶 Walking — Organized walks
- 🎯 Other — Other sports events

Each event has detailed info: race variants, phased pricing, rules, FAQs, route maps, and registration links.`,
      },
      [Language.es]: {
        title: "¿Qué deportes y eventos son compatibles?",
        content: `Running, Trail, HYROX, CrossFit, OCR, BTT/Ciclismo, Natación, Triatlón, Surf, Senderismo y otros. Cada evento con variantes, precios, reglamento, FAQs y links de inscripción.`,
      },
      [Language.fr]: {
        title: "Quels sports et événements sont pris en charge ?",
        content: `Course, Trail, HYROX, CrossFit, OCR, VTT/Cyclisme, Natation, Triathlon, Surf, Marche et autres. Chaque événement avec variantes, tarifs, règlement, FAQ et liens d'inscription.`,
      },
      [Language.de]: {
        title: "Welche Sportarten und Events werden unterstützt?",
        content: `Running, Trail, HYROX, CrossFit, OCR, MTB/Radsport, Schwimmen, Triathlon, Surfen, Wandern und andere. Jedes Event mit Varianten, Preisen, Regeln, FAQs und Anmeldelinks.`,
      },
      [Language.it]: {
        title: "Quali sport ed eventi sono supportati?",
        content: `Running, Trail, HYROX, CrossFit, OCR, MTB/Ciclismo, Nuoto, Triathlon, Surf, Camminata e altri. Ogni evento con varianti, prezzi, regolamento, FAQ e link di iscrizione.`,
      },
    },
  },
];

async function main() {
  console.log("📚 Seeding Platform Knowledge Base...");

  for (const article of articles) {
    const languages = Object.keys(article.translations) as Language[];

    for (const lang of languages) {
      const trans = article.translations[lang];
      const slug = `${article.slug}-${lang}`;

      await prisma.platformKnowledge.upsert({
        where: { slug },
        update: {
          category: article.category,
          title: trans.title,
          content: trans.content,
          language: lang,
          priority: article.priority,
          isActive: true,
        },
        create: {
          slug,
          category: article.category,
          title: trans.title,
          content: trans.content,
          language: lang,
          priority: article.priority,
          isActive: true,
        },
      });
    }

    console.log(`   ✅ ${article.slug} — ${languages.length} languages`);
  }

  console.log(
    `\n✅ Platform Knowledge seeded: ${articles.length} articles × 6 languages = ${articles.length * 6} records`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
