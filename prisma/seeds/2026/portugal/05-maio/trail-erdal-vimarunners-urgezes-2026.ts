/**
 * Seed: XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026
 *
 * Event: Trail running event in Guimarães
 * Location: Parque Desportivo dos Amigos de Urgeses, Guimarães
 * Date: May 10, 2026
 * Organizer: ERDAL / Vimarunners / GDR Os Amigos de Urgeses
 * Sport: Trail Running
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🏔️ Seeding XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026..."
  );

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "trail-erdal-vimarunners-urgezes-2026" },
    update: {
      title: "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026",
      description:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 - Trail em Guimarães",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-05-10T08:30:00Z"),
      endDate: new Date("2026-05-10T13:30:00Z"),
      registrationDeadline: new Date("2026-05-03T23:59:59Z"),
      externalUrl: "https://www.portimer.pt",
      imageUrl: "",
      city: "Guimarães",
      country: "Portugal",
      latitude: 41.4256,
      longitude: -8.2914,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026",
      slug: "trail-erdal-vimarunners-urgezes-2026",
      description:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 - Trail em Guimarães",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-05-10T08:30:00Z"),
      endDate: new Date("2026-05-10T13:30:00Z"),
      registrationDeadline: new Date("2026-05-03T23:59:59Z"),
      externalUrl: "https://www.portimer.pt",
      imageUrl: "",
      city: "Guimarães",
      country: "Portugal",
      latitude: 41.4256,
      longitude: -8.2914,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
  });

  console.log(`✅ Created/updated event: ${event.slug}`);

  // ──────────────────────────────────────────────
  // 2. Translations (ALL 6 languages)
  // ──────────────────────────────────────────────
  const translations: Record<
    string,
    {
      title: string;
      description: string;
      city: string;
      metaTitle: string;
      metaDescription: string;
    }
  > = {
    pt: {
      title: "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026",
      description: `# 🏔️ XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026

**A 11ª edição do Trail ERDAL/Vimarunners - Urgezes Solidário realiza-se a 10 de maio de 2026 em Guimarães.** Organizado pela ERDAL, Vimarunners e GDR Os Amigos de Urgeses, com partida e chegada no Parque Desportivo dos Amigos de Urgeses. Parte das receitas revertem a favor dos Bombeiros Voluntários de Guimarães e Amigos Urgeses IPSS.

---

## 🏔️ Provas Disponíveis

### **Trail Longo** – ≈26 km
- **Desnível Positivo:** ≈1300 m D+
- **Dificuldade ATRP:** 4,6 pontos – Grau 2
- **Idade Mínima:** 18 anos
- **Partida:** 08h30

### **Trail Sprint** – ≈18 km
- **Desnível Positivo:** ≈850 m D+
- **Dificuldade ATRP:** 4,4 pontos – Grau 2
- **Idade Mínima:** 18 anos
- **Partida:** 09h15

### **Minitrail** – ≈12 km
- **Desnível Positivo:** ≈500 m D+
- **Dificuldade ATRP:** 4,1 pontos – Grau 2
- **Idade Mínima:** 16 anos (com autorização e acompanhamento adulto)
- **Partida:** 09h45

### **Caminhada** – ≈8 km
- **Participação lúdica**
- **Sem limitação de idade** (menores acompanhados por adulto)
- **Partida:** 09h50

---

## 📍 Local e Horários

**Partida e Chegada:** Parque Desportivo dos Amigos de Urgeses, Rua dos Amigos de Urgeses, Guimarães
**GPS:** 41°25'33.50'' N 8°17'29.05'' O

**Secretariado:**
- Sábado 09/05: 10h00 – 18h00
- Domingo 10/05: 07h30 – 09h00

---

## 🎒 Material Obrigatório

- Telemóvel com bateria suficiente
- Manta térmica
- Apito

---

## 🎯 Destaques

✅ Seguro de acidentes pessoais e responsabilidade civil
✅ Dorsal personalizado com chip e cronometragem eletrónica (Portimer)
✅ Abastecimentos sólidos e líquidos
✅ T-shirt técnica da prova
✅ Oferta finisher
✅ Bifana e bebida no final
✅ Banho
✅ Registo fotográfico
✅ Troféus e prémios por classificação geral, escalões e coletiva
✅ Receitas revertem para BVG e Amigos Urgeses IPSS`,
      city: "Guimarães",
      metaTitle:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 | Guimarães | 10 Maio",
      metaDescription:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 a 10 de maio em Guimarães. Trail Longo 26km, Trail Sprint 18km, Minitrail 12km e Caminhada 8km. Campeonato Regional de Trail da AAB.",
    },
    en: {
      title: "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026",
      description: `# 🏔️ XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026

**The 11th edition of Trail ERDAL/Vimarunners - Urgezes Solidário takes place on May 10, 2026 in Guimarães.** Organized by ERDAL, Vimarunners and GDR Os Amigos de Urgeses, starting and finishing at Parque Desportivo dos Amigos de Urgeses. Part of the proceeds go to Guimarães Volunteer Firefighters and Amigos Urgeses IPSS.

---

## 🏔️ Available Races

### **Trail Long** – ≈26 km
- **Elevation Gain:** ≈1,300 m D+
- **ATRP Difficulty:** 4.6 points – Grade 2
- **Minimum Age:** 18 years
- **Start:** 8:30 AM

### **Trail Sprint** – ≈18 km
- **Elevation Gain:** ≈850 m D+
- **ATRP Difficulty:** 4.4 points – Grade 2
- **Minimum Age:** 18 years
- **Start:** 9:15 AM

### **Mini Trail** – ≈12 km
- **Elevation Gain:** ≈500 m D+
- **ATRP Difficulty:** 4.1 points – Grade 2
- **Minimum Age:** 16 years (with authorization and adult supervision)
- **Start:** 9:45 AM

### **Walk** – ≈8 km
- **Recreational participation**
- **No age limit** (minors accompanied by an adult)
- **Start:** 9:50 AM

---

## 📍 Location and Schedule

**Start and Finish:** Parque Desportivo dos Amigos de Urgeses, Rua dos Amigos de Urgeses, Guimarães
**GPS:** 41°25'33.50'' N 8°17'29.05'' W

**Registration Desk:**
- Saturday 09/05: 10:00 AM – 6:00 PM
- Sunday 10/05: 7:30 AM – 9:00 AM

---

## 🎒 Mandatory Equipment

- Mobile phone with sufficient battery
- Thermal blanket
- Whistle

---

## 🎯 Highlights

✅ Personal accident and liability insurance
✅ Personalized bib with chip and electronic timing (Portimer)
✅ Solid and liquid refreshment stations
✅ Technical race t-shirt
✅ Finisher gift
✅ Pork sandwich and drink at the finish
✅ Showers
✅ Photo coverage
✅ Trophies and prizes for general, age group and team classifications
✅ Proceeds go to Guimarães Volunteer Firefighters and Amigos Urgeses IPSS`,
      city: "Guimarães",
      metaTitle:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 | Guimarães | May 10",
      metaDescription:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 on May 10 in Guimarães. Trail Long 26km, Trail Sprint 18km, Mini Trail 12km and Walk 8km. AAB Regional Trail Championship.",
    },
    es: {
      title: "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026",
      description: `# 🏔️ XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026

**La 11ª edición del Trail ERDAL/Vimarunners - Urgezes Solidário se celebra el 10 de mayo de 2026 en Guimarães.** Organizado por ERDAL, Vimarunners y GDR Os Amigos de Urgeses, con salida y meta en el Parque Desportivo dos Amigos de Urgeses. Parte de los ingresos se destinan a los Bomberos Voluntarios de Guimarães y Amigos Urgeses IPSS.

---

## 🏔️ Pruebas Disponibles

### **Trail Largo** – ≈26 km
- **Desnivel Positivo:** ≈1.300 m D+
- **Dificultad ATRP:** 4,6 puntos – Grado 2
- **Edad Mínima:** 18 años
- **Salida:** 08:30

### **Trail Sprint** – ≈18 km
- **Desnivel Positivo:** ≈850 m D+
- **Dificultad ATRP:** 4,4 puntos – Grado 2
- **Edad Mínima:** 18 años
- **Salida:** 09:15

### **Minitrail** – ≈12 km
- **Desnivel Positivo:** ≈500 m D+
- **Dificultad ATRP:** 4,1 puntos – Grado 2
- **Edad Mínima:** 16 años (con autorización y acompañamiento adulto)
- **Salida:** 09:45

### **Caminata** – ≈8 km
- **Participación lúdica**
- **Sin limitación de edad** (menores acompañados por un adulto)
- **Salida:** 09:50

---

## 📍 Ubicación y Horarios

**Salida y Meta:** Parque Desportivo dos Amigos de Urgeses, Rua dos Amigos de Urgeses, Guimarães
**GPS:** 41°25'33.50'' N 8°17'29.05'' O

**Secretariado:**
- Sábado 09/05: 10:00 – 18:00
- Domingo 10/05: 07:30 – 09:00

---

## 🎒 Material Obligatorio

- Teléfono móvil con batería suficiente
- Manta térmica
- Silbato

---

## 🎯 Destacados

✅ Seguro de accidentes personales y responsabilidad civil
✅ Dorsal personalizado con chip y cronometraje electrónico (Portimer)
✅ Avituallamientos sólidos y líquidos
✅ Camiseta técnica de la prueba
✅ Regalo finisher
✅ Bocadillo y bebida al final
✅ Duchas
✅ Cobertura fotográfica
✅ Trofeos y premios por clasificación general, categorías y colectiva
✅ Parte de los ingresos para BVG y Amigos Urgeses IPSS`,
      city: "Guimarães",
      metaTitle:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 | Guimarães | 10 Mayo",
      metaDescription:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 el 10 de mayo en Guimarães. Trail Largo 26km, Trail Sprint 18km, Minitrail 12km y Caminata 8km. Campeonato Regional de Trail AAB.",
    },
    fr: {
      title: "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026",
      description: `# 🏔️ XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026

**La 11e édition du Trail ERDAL/Vimarunners - Urgezes Solidário a lieu le 10 mai 2026 à Guimarães.** Organisé par ERDAL, Vimarunners et GDR Os Amigos de Urgeses, départ et arrivée au Parque Desportivo dos Amigos de Urgeses. Une partie des recettes est reversée aux Pompiers Volontaires de Guimarães et Amigos Urgeses IPSS.

---

## 🏔️ Épreuves Disponibles

### **Trail Long** – ≈26 km
- **Dénivelé Positif :** ≈1 300 m D+
- **Difficulté ATRP :** 4,6 points – Grade 2
- **Âge Minimum :** 18 ans
- **Départ :** 08h30

### **Trail Sprint** – ≈18 km
- **Dénivelé Positif :** ≈850 m D+
- **Difficulté ATRP :** 4,4 points – Grade 2
- **Âge Minimum :** 18 ans
- **Départ :** 09h15

### **Mini Trail** – ≈12 km
- **Dénivelé Positif :** ≈500 m D+
- **Difficulté ATRP :** 4,1 points – Grade 2
- **Âge Minimum :** 16 ans (avec autorisation et accompagnement adulte)
- **Départ :** 09h45

### **Marche** – ≈8 km
- **Participation récréative**
- **Sans limite d'âge** (mineurs accompagnés d'un adulte)
- **Départ :** 09h50

---

## 📍 Lieu et Horaires

**Départ et Arrivée :** Parque Desportivo dos Amigos de Urgeses, Rua dos Amigos de Urgeses, Guimarães
**GPS :** 41°25'33.50'' N 8°17'29.05'' O

**Secrétariat :**
- Samedi 09/05 : 10h00 – 18h00
- Dimanche 10/05 : 07h30 – 09h00

---

## 🎒 Matériel Obligatoire

- Téléphone portable avec batterie suffisante
- Couverture de survie
- Sifflet

---

## 🎯 Points Forts

✅ Assurance accidents personnels et responsabilité civile
✅ Dossard personnalisé avec puce et chronométrage électronique (Portimer)
✅ Ravitaillements solides et liquides
✅ T-shirt technique de la course
✅ Cadeau finisher
✅ Sandwich et boisson à l'arrivée
✅ Douches
✅ Couverture photo
✅ Trophées et prix par classement général, catégories d'âge et collectif
✅ Recettes reversées aux Pompiers de Guimarães et Amigos Urgeses IPSS`,
      city: "Guimarães",
      metaTitle:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 | Guimarães | 10 Mai",
      metaDescription:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 le 10 mai à Guimarães. Trail Long 26km, Trail Sprint 18km, Mini Trail 12km et Marche 8km. Championnat Régional de Trail AAB.",
    },
    de: {
      title: "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026",
      description: `# 🏔️ XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026

**Die 11. Ausgabe des Trail ERDAL/Vimarunners - Urgezes Solidário findet am 10. Mai 2026 in Guimarães statt.** Organisiert von ERDAL, Vimarunners und GDR Os Amigos de Urgeses, mit Start und Ziel im Parque Desportivo dos Amigos de Urgeses. Ein Teil der Einnahmen geht an die Freiwillige Feuerwehr Guimarães und Amigos Urgeses IPSS.

---

## 🏔️ Verfügbare Rennen

### **Trail Lang** – ≈26 km
- **Höhenmeter:** ≈1.300 m D+
- **ATRP-Schwierigkeit:** 4,6 Punkte – Grad 2
- **Mindestalter:** 18 Jahre
- **Start:** 08:30

### **Trail Sprint** – ≈18 km
- **Höhenmeter:** ≈850 m D+
- **ATRP-Schwierigkeit:** 4,4 Punkte – Grad 2
- **Mindestalter:** 18 Jahre
- **Start:** 09:15

### **Mini Trail** – ≈12 km
- **Höhenmeter:** ≈500 m D+
- **ATRP-Schwierigkeit:** 4,1 Punkte – Grad 2
- **Mindestalter:** 16 Jahre (mit Genehmigung und Erwachsenenbegleitung)
- **Start:** 09:45

### **Wanderung** – ≈8 km
- **Freizeitteilnahme**
- **Keine Altersbeschränkung** (Minderjährige in Begleitung eines Erwachsenen)
- **Start:** 09:50

---

## 📍 Ort und Zeitplan

**Start und Ziel:** Parque Desportivo dos Amigos de Urgeses, Rua dos Amigos de Urgeses, Guimarães
**GPS:** 41°25'33.50'' N 8°17'29.05'' W

**Sekretariat:**
- Samstag 09.05.: 10:00 – 18:00
- Sonntag 10.05.: 07:30 – 09:00

---

## 🎒 Pflichtausrüstung

- Mobiltelefon mit ausreichend Akku
- Rettungsdecke
- Pfeife

---

## 🎯 Höhepunkte

✅ Unfall- und Haftpflichtversicherung
✅ Personalisierte Startnummer mit Chip und elektronischer Zeitmessung (Portimer)
✅ Feste und flüssige Verpflegungsstationen
✅ Technisches Lauf-T-Shirt
✅ Finisher-Geschenk
✅ Brötchen und Getränk im Ziel
✅ Duschen
✅ Fotoberichterstattung
✅ Pokale und Preise nach Gesamtwertung, Altersklassen und Mannschaftswertung
✅ Einnahmen gehen an die Feuerwehr Guimarães und Amigos Urgeses IPSS`,
      city: "Guimarães",
      metaTitle:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 | Guimarães | 10. Mai",
      metaDescription:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 am 10. Mai in Guimarães. Trail Lang 26km, Trail Sprint 18km, Mini Trail 12km und Wanderung 8km. AAB Regionaler Trail-Meisterschaft.",
    },
    it: {
      title: "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026",
      description: `# 🏔️ XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026

**L'11ª edizione del Trail ERDAL/Vimarunners - Urgezes Solidário si svolge il 10 maggio 2026 a Guimarães.** Organizzato da ERDAL, Vimarunners e GDR Os Amigos de Urgeses, con partenza e arrivo al Parque Desportivo dos Amigos de Urgeses. Parte dei ricavi è destinata ai Vigili del Fuoco Volontari di Guimarães e Amigos Urgeses IPSS.

---

## 🏔️ Gare Disponibili

### **Trail Lungo** – ≈26 km
- **Dislivello Positivo:** ≈1.300 m D+
- **Difficoltà ATRP:** 4,6 punti – Grado 2
- **Età Minima:** 18 anni
- **Partenza:** 08:30

### **Trail Sprint** – ≈18 km
- **Dislivello Positivo:** ≈850 m D+
- **Difficoltà ATRP:** 4,4 punti – Grado 2
- **Età Minima:** 18 anni
- **Partenza:** 09:15

### **Mini Trail** – ≈12 km
- **Dislivello Positivo:** ≈500 m D+
- **Difficoltà ATRP:** 4,1 punti – Grado 2
- **Età Minima:** 16 anni (con autorizzazione e accompagnamento adulto)
- **Partenza:** 09:45

### **Camminata** – ≈8 km
- **Partecipazione ricreativa**
- **Senza limiti di età** (minori accompagnati da un adulto)
- **Partenza:** 09:50

---

## 📍 Luogo e Orari

**Partenza e Arrivo:** Parque Desportivo dos Amigos de Urgeses, Rua dos Amigos de Urgeses, Guimarães
**GPS:** 41°25'33.50'' N 8°17'29.05'' O

**Segreteria:**
- Sabato 09/05: 10:00 – 18:00
- Domenica 10/05: 07:30 – 09:00

---

## 🎒 Materiale Obbligatorio

- Telefono cellulare con batteria sufficiente
- Coperta termica
- Fischietto

---

## 🎯 Punti di Forza

✅ Assicurazione infortuni personali e responsabilità civile
✅ Pettorale personalizzato con chip e cronometraggio elettronico (Portimer)
✅ Ristori solidi e liquidi
✅ T-shirt tecnica della gara
✅ Regalo finisher
✅ Panino e bevanda al traguardo
✅ Docce
✅ Copertura fotografica
✅ Trofei e premi per classifica generale, categorie d'età e squadre
✅ Ricavi destinati ai Vigili del Fuoco di Guimarães e Amigos Urgeses IPSS`,
      city: "Guimarães",
      metaTitle:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 | Guimarães | 10 Maggio",
      metaDescription:
        "XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026 il 10 maggio a Guimarães. Trail Lungo 26km, Trail Sprint 18km, Mini Trail 12km e Camminata 8km. Campionato Regionale di Trail AAB.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: { eventId: event.id, language: Language[lang] },
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
        language: Language[lang],
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
    console.log(`✅ Translation [${lang}] upserted`);
  }

  // ──────────────────────────────────────────────
  // 3. Variants (findOrCreate helper)
  // ──────────────────────────────────────────────
  const findOrCreateVariant = async (variantData: {
    name: string;
    distanceKm: number;
    elevationGainM: number | null;
    elevationLossM: number | null;
    startDate: Date;
    startTime: string;
    cutoffTimeHours: number | null;
    price: number;
    currency: Currency;
    maxParticipants: number | null;
    atrpGrade: number | null;
    itraPoints: number | null;
    description: string;
  }) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name: variantData.name },
    });

    if (existing) {
      return await prisma.eventVariant.update({
        where: { id: existing.id },
        data: variantData,
      });
    } else {
      return await prisma.eventVariant.create({
        data: { eventId: event.id, ...variantData },
      });
    }
  };

  const findOrCreatePricingPhase = async (
    name: string,
    variantId: string,
    data: {
      startDate: Date;
      endDate: Date;
      price: number;
      currency: Currency;
      note: string | null;
    }
  ) => {
    const existing = await prisma.pricingPhase.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.pricingPhase.update({
        where: { id: existing.id },
        data: { ...data, variantId },
      });
    } else {
      return await prisma.pricingPhase.create({
        data: { eventId: event.id, variantId, name, ...data },
      });
    }
  };

  // ── Variant 1: Trail Longo 26km ──
  const trailLongo = await findOrCreateVariant({
    name: "Trail Longo 26km",
    distanceKm: 26,
    elevationGainM: 1300,
    elevationLossM: 1300,
    startDate: new Date("2026-05-10T08:30:00Z"),
    startTime: "08:30",
    cutoffTimeHours: 5,
    price: 15.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: 2,
    itraPoints: null,
    description:
      "Trail Longo ≈26km · ±1300m D+ · Dificuldade ATRP 4,6 · Grau 2 · 18+ anos",
  });
  console.log(`✅ Variant: ${trailLongo.name}`);

  // ── Variant 2: Trail Sprint 18km ──
  const trailSprint = await findOrCreateVariant({
    name: "Trail Sprint 18km",
    distanceKm: 18,
    elevationGainM: 850,
    elevationLossM: 850,
    startDate: new Date("2026-05-10T09:15:00Z"),
    startTime: "09:15",
    cutoffTimeHours: 3.75,
    price: 14.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: 2,
    itraPoints: null,
    description:
      "Trail Sprint ≈18km · ±850m D+ · Dificuldade ATRP 4,4 · Grau 2 · 18+ anos",
  });
  console.log(`✅ Variant: ${trailSprint.name}`);

  // ── Variant 3: Minitrail 12km ──
  const minitrail = await findOrCreateVariant({
    name: "Minitrail 12km",
    distanceKm: 12,
    elevationGainM: 500,
    elevationLossM: 500,
    startDate: new Date("2026-05-10T09:45:00Z"),
    startTime: "09:45",
    cutoffTimeHours: null,
    price: 12.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: 2,
    itraPoints: null,
    description:
      "Minitrail ≈12km · ±500m D+ · Dificuldade ATRP 4,1 · Grau 2 · 16+ anos (com autorização)",
  });
  console.log(`✅ Variant: ${minitrail.name}`);

  // ── Variant 4: Caminhada 8km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 8km",
    distanceKm: 8,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-05-10T09:50:00Z"),
    startTime: "09:50",
    cutoffTimeHours: null,
    price: 8.0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Caminhada ≈8km · Participação lúdica · Sem limitação de idade",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (linked to eventId AND variantId)
  // ──────────────────────────────────────────────

  // Trail Longo 26km — 3 phases
  await findOrCreatePricingPhase(
    `${trailLongo.name} - 1ª Fase`,
    trailLongo.id,
    {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-03-29T23:59:59Z"),
      price: 15.0,
      currency: Currency.EUR,
      note: "Inclui dorsal com chip, t-shirt técnica, seguro e oferta finisher",
    }
  );
  await findOrCreatePricingPhase(
    `${trailLongo.name} - 2ª Fase`,
    trailLongo.id,
    {
      startDate: new Date("2026-03-30T00:00:00Z"),
      endDate: new Date("2026-04-26T23:59:59Z"),
      price: 17.0,
      currency: Currency.EUR,
      note: "Inclui dorsal com chip, t-shirt técnica, seguro e oferta finisher",
    }
  );
  await findOrCreatePricingPhase(
    `${trailLongo.name} - 3ª Fase`,
    trailLongo.id,
    {
      startDate: new Date("2026-04-27T00:00:00Z"),
      endDate: new Date("2026-05-03T23:59:59Z"),
      price: 20.0,
      currency: Currency.EUR,
      note: "Inclui dorsal com chip, t-shirt técnica, seguro e oferta finisher",
    }
  );
  console.log(`   - 3 pricing phases for ${trailLongo.name}`);

  // Trail Sprint 18km — 3 phases
  await findOrCreatePricingPhase(
    `${trailSprint.name} - 1ª Fase`,
    trailSprint.id,
    {
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-03-29T23:59:59Z"),
      price: 14.0,
      currency: Currency.EUR,
      note: "Inclui dorsal com chip, t-shirt técnica, seguro e oferta finisher",
    }
  );
  await findOrCreatePricingPhase(
    `${trailSprint.name} - 2ª Fase`,
    trailSprint.id,
    {
      startDate: new Date("2026-03-30T00:00:00Z"),
      endDate: new Date("2026-04-26T23:59:59Z"),
      price: 16.0,
      currency: Currency.EUR,
      note: "Inclui dorsal com chip, t-shirt técnica, seguro e oferta finisher",
    }
  );
  await findOrCreatePricingPhase(
    `${trailSprint.name} - 3ª Fase`,
    trailSprint.id,
    {
      startDate: new Date("2026-04-27T00:00:00Z"),
      endDate: new Date("2026-05-03T23:59:59Z"),
      price: 19.0,
      currency: Currency.EUR,
      note: "Inclui dorsal com chip, t-shirt técnica, seguro e oferta finisher",
    }
  );
  console.log(`   - 3 pricing phases for ${trailSprint.name}`);

  // Minitrail 12km — 3 phases
  await findOrCreatePricingPhase(`${minitrail.name} - 1ª Fase`, minitrail.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-03-29T23:59:59Z"),
    price: 12.0,
    currency: Currency.EUR,
    note: "Inclui dorsal com chip, t-shirt técnica, seguro e oferta finisher",
  });
  await findOrCreatePricingPhase(`${minitrail.name} - 2ª Fase`, minitrail.id, {
    startDate: new Date("2026-03-30T00:00:00Z"),
    endDate: new Date("2026-04-26T23:59:59Z"),
    price: 14.0,
    currency: Currency.EUR,
    note: "Inclui dorsal com chip, t-shirt técnica, seguro e oferta finisher",
  });
  await findOrCreatePricingPhase(`${minitrail.name} - 3ª Fase`, minitrail.id, {
    startDate: new Date("2026-04-27T00:00:00Z"),
    endDate: new Date("2026-05-03T23:59:59Z"),
    price: 16.0,
    currency: Currency.EUR,
    note: "Inclui dorsal com chip, t-shirt técnica, seguro e oferta finisher",
  });
  console.log(`   - 3 pricing phases for ${minitrail.name}`);

  // Caminhada 8km — 2 phases (€8 first two, €10 last)
  await findOrCreatePricingPhase(`${caminhada.name} - 1ª Fase`, caminhada.id, {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-04-26T23:59:59Z"),
    price: 8.0,
    currency: Currency.EUR,
    note: "Inclui t-shirt técnica, seguro e lanche final",
  });
  await findOrCreatePricingPhase(`${caminhada.name} - 2ª Fase`, caminhada.id, {
    startDate: new Date("2026-04-27T00:00:00Z"),
    endDate: new Date("2026-05-03T23:59:59Z"),
    price: 10.0,
    currency: Currency.EUR,
    note: "Inclui t-shirt técnica, seguro e lanche final",
  });
  console.log(`   - 2 pricing phases for ${caminhada.name}`);

  // ──────────────────────────────────────────────
  // 5. FAQs with translations (ALL 6 languages)
  // ──────────────────────────────────────────────
  const findOrCreateFAQ = async (
    eventId: string,
    order: number,
    question: string,
    answer: string
  ) => {
    const existing = await prisma.eventFAQ.findFirst({
      where: { eventId, order },
    });
    if (existing)
      return await prisma.eventFAQ.update({
        where: { id: existing.id },
        data: { question, answer },
      });
    return await prisma.eventFAQ.create({
      data: { eventId, order, question, answer },
    });
  };

  // FAQ 0: Schedule
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "Qual é o horário das provas?",
    "Secretariado sábado 09/05: 10h00–18h00 e domingo 10/05: 07h30–09h00. Partida Trail Longo 26km: 08h30, Trail Sprint 18km: 09h15, Minitrail 12km: 09h45, Caminhada 8km: 09h50. Entrega de prémios: ≈12h30. Encerramento: 13h30."
  );

  const faq0Translations = {
    pt: {
      question: "Qual é o horário das provas?",
      answer:
        "Secretariado sábado 09/05: 10h00–18h00 e domingo 10/05: 07h30–09h00. Partida Trail Longo 26km: 08h30, Trail Sprint 18km: 09h15, Minitrail 12km: 09h45, Caminhada 8km: 09h50. Entrega de prémios: ≈12h30. Encerramento: 13h30.",
    },
    en: {
      question: "What is the race schedule?",
      answer:
        "Registration desk Saturday 09/05: 10:00 AM–6:00 PM and Sunday 10/05: 7:30 AM–9:00 AM. Start Trail Long 26km: 8:30 AM, Trail Sprint 18km: 9:15 AM, Mini Trail 12km: 9:45 AM, Walk 8km: 9:50 AM. Prize ceremony: ≈12:30 PM. Closing: 1:30 PM.",
    },
    es: {
      question: "¿Cuál es el horario de las pruebas?",
      answer:
        "Secretariado sábado 09/05: 10:00–18:00 y domingo 10/05: 07:30–09:00. Salida Trail Largo 26km: 08:30, Trail Sprint 18km: 09:15, Minitrail 12km: 09:45, Caminata 8km: 09:50. Entrega de premios: ≈12:30. Cierre: 13:30.",
    },
    fr: {
      question: "Quel est l'horaire des épreuves ?",
      answer:
        "Secrétariat samedi 09/05 : 10h00–18h00 et dimanche 10/05 : 07h30–09h00. Départ Trail Long 26km : 08h30, Trail Sprint 18km : 09h15, Mini Trail 12km : 09h45, Marche 8km : 09h50. Remise des prix : ≈12h30. Clôture : 13h30.",
    },
    de: {
      question: "Wie ist der Zeitplan der Rennen?",
      answer:
        "Sekretariat Samstag 09.05.: 10:00–18:00 und Sonntag 10.05.: 07:30–09:00. Start Trail Lang 26km: 08:30, Trail Sprint 18km: 09:15, Mini Trail 12km: 09:45, Wanderung 8km: 09:50. Siegerehrung: ≈12:30. Veranstaltungsende: 13:30.",
    },
    it: {
      question: "Qual è l'orario delle gare?",
      answer:
        "Segreteria sabato 09/05: 10:00–18:00 e domenica 10/05: 07:30–09:00. Partenza Trail Lungo 26km: 08:30, Trail Sprint 18km: 09:15, Mini Trail 12km: 09:45, Camminata 8km: 09:50. Premiazione: ≈12:30. Chiusura: 13:30.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq0.id, language: Language[lang] },
      },
      update: faq0Translations[lang],
      create: {
        faqId: faq0.id,
        language: Language[lang],
        ...faq0Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 0: Schedule");

  // FAQ 1: Registration and pricing
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "Como funcionam as inscrições e quais os preços?",
    "Inscrições em www.portimer.pt (atletas federados via fpacompeticoes.pt). 3 fases de inscrição: até 29/03, 30/03–26/04 e 27/04–03/05. Trail Longo: 15€/17€/20€, Trail Sprint: 14€/16€/19€, Minitrail: 12€/14€/16€, Caminhada: 8€/8€/10€. Federados têm desconto de 1€. Pagamento por referência multibanco (48h para pagar)."
  );

  const faq1Translations = {
    pt: {
      question: "Como funcionam as inscrições e quais os preços?",
      answer:
        "Inscrições em www.portimer.pt (atletas federados via fpacompeticoes.pt). 3 fases de inscrição: até 29/03, 30/03–26/04 e 27/04–03/05. Trail Longo: 15€/17€/20€, Trail Sprint: 14€/16€/19€, Minitrail: 12€/14€/16€, Caminhada: 8€/8€/10€. Federados têm desconto de 1€. Pagamento por referência multibanco (48h para pagar).",
    },
    en: {
      question: "How does registration work and what are the prices?",
      answer:
        "Registration at www.portimer.pt (federated athletes via fpacompeticoes.pt). 3 registration phases: until March 29, March 30–April 26, and April 27–May 3. Trail Long: €15/€17/€20, Trail Sprint: €14/€16/€19, Mini Trail: €12/€14/€16, Walk: €8/€8/€10. Federated athletes get €1 discount. Payment by Multibanco reference (48h to pay).",
    },
    es: {
      question: "¿Cómo funcionan las inscripciones y cuáles son los precios?",
      answer:
        "Inscripciones en www.portimer.pt (atletas federados vía fpacompeticoes.pt). 3 fases de inscripción: hasta el 29/03, 30/03–26/04 y 27/04–03/05. Trail Largo: 15€/17€/20€, Trail Sprint: 14€/16€/19€, Minitrail: 12€/14€/16€, Caminata: 8€/8€/10€. Federados tienen descuento de 1€. Pago por referencia Multibanco (48h para pagar).",
    },
    fr: {
      question:
        "Comment fonctionnent les inscriptions et quels sont les prix ?",
      answer:
        "Inscriptions sur www.portimer.pt (athlètes fédérés via fpacompeticoes.pt). 3 phases d'inscription : jusqu'au 29/03, 30/03–26/04 et 27/04–03/05. Trail Long : 15€/17€/20€, Trail Sprint : 14€/16€/19€, Mini Trail : 12€/14€/16€, Marche : 8€/8€/10€. Athlètes fédérés bénéficient d'une remise de 1€. Paiement par référence Multibanco (48h pour payer).",
    },
    de: {
      question: "Wie funktioniert die Anmeldung und was sind die Preise?",
      answer:
        "Anmeldung unter www.portimer.pt (Vereinsathleten über fpacompeticoes.pt). 3 Anmeldephasen: bis 29.03., 30.03.–26.04. und 27.04.–03.05. Trail Lang: 15€/17€/20€, Trail Sprint: 14€/16€/19€, Mini Trail: 12€/14€/16€, Wanderung: 8€/8€/10€. Vereinsathleten erhalten 1€ Rabatt. Zahlung per Multibanco-Referenz (48h zur Zahlung).",
    },
    it: {
      question: "Come funzionano le iscrizioni e quali sono i prezzi?",
      answer:
        "Iscrizioni su www.portimer.pt (atleti tesserati tramite fpacompeticoes.pt). 3 fasi di iscrizione: fino al 29/03, 30/03–26/04 e 27/04–03/05. Trail Lungo: 15€/17€/20€, Trail Sprint: 14€/16€/19€, Mini Trail: 12€/14€/16€, Camminata: 8€/8€/10€. Tesserati hanno sconto di 1€. Pagamento con riferimento Multibanco (48h per pagare).",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq1.id, language: Language[lang] },
      },
      update: faq1Translations[lang],
      create: {
        faqId: faq1.id,
        language: Language[lang],
        ...faq1Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 1: Registration and pricing");

  // FAQ 2: Mandatory equipment
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Qual é o material obrigatório?",
    "Material obrigatório: telemóvel com bateria suficiente, manta térmica e apito. Material recomendado: corta-vento, copo de silicone ou outro recipiente, reservatório de líquidos e reforço energético. Não haverá copos nos postos de abastecimento."
  );

  const faq2Translations = {
    pt: {
      question: "Qual é o material obrigatório?",
      answer:
        "Material obrigatório: telemóvel com bateria suficiente, manta térmica e apito. Material recomendado: corta-vento, copo de silicone ou outro recipiente, reservatório de líquidos e reforço energético. Não haverá copos nos postos de abastecimento.",
    },
    en: {
      question: "What is the mandatory equipment?",
      answer:
        "Mandatory equipment: mobile phone with sufficient battery, thermal blanket and whistle. Recommended equipment: windbreaker, silicone cup or other container, liquid reservoir and energy supplements. There will be no cups at aid stations.",
    },
    es: {
      question: "¿Cuál es el material obligatorio?",
      answer:
        "Material obligatorio: teléfono móvil con batería suficiente, manta térmica y silbato. Material recomendado: cortavientos, vaso de silicona u otro recipiente, depósito de líquidos y refuerzo energético. No habrá vasos en los avituallamientos.",
    },
    fr: {
      question: "Quel est le matériel obligatoire ?",
      answer:
        "Matériel obligatoire : téléphone portable avec batterie suffisante, couverture de survie et sifflet. Matériel recommandé : coupe-vent, gobelet en silicone ou autre récipient, réservoir de liquides et compléments énergétiques. Il n'y aura pas de gobelets aux ravitaillements.",
    },
    de: {
      question: "Welche Pflichtausrüstung wird benötigt?",
      answer:
        "Pflichtausrüstung: Mobiltelefon mit ausreichend Akku, Rettungsdecke und Pfeife. Empfohlene Ausrüstung: Windjacke, Silikonbecher oder anderer Behälter, Flüssigkeitsbehälter und Energieriegel. An den Verpflegungsstationen gibt es keine Becher.",
    },
    it: {
      question: "Qual è il materiale obbligatorio?",
      answer:
        "Materiale obbligatorio: telefono cellulare con batteria sufficiente, coperta termica e fischietto. Materiale consigliato: giacca a vento, bicchiere in silicone o altro contenitore, riserva di liquidi e integratori energetici. Non ci saranno bicchieri ai ristori.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq2.id, language: Language[lang] },
      },
      update: faq2Translations[lang],
      create: {
        faqId: faq2.id,
        language: Language[lang],
        ...faq2Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 2: Mandatory equipment");

  // FAQ 3: Aid stations and time limits
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Onde estão os postos de abastecimento e tempos limite?",
    "Trail Longo 26km: km7, km14, km20 e meta (sólido e líquido). Tempos limite: km6 – 1h, km13 – 2h15, km20 – 3h30. Trail Sprint 18km: km7, km13 e meta. Tempos limite: km6 – 1h, km13 – 2h15. Minitrail 12km: km6 e meta. Tempo limite: km6 – 1h."
  );

  const faq3Translations = {
    pt: {
      question: "Onde estão os postos de abastecimento e tempos limite?",
      answer:
        "Trail Longo 26km: km7, km14, km20 e meta (sólido e líquido). Tempos limite: km6 – 1h, km13 – 2h15, km20 – 3h30. Trail Sprint 18km: km7, km13 e meta. Tempos limite: km6 – 1h, km13 – 2h15. Minitrail 12km: km6 e meta. Tempo limite: km6 – 1h.",
    },
    en: {
      question: "Where are the aid stations and what are the time limits?",
      answer:
        "Trail Long 26km: km7, km14, km20 and finish (solid and liquid). Cut-off times: km6 – 1h, km13 – 2h15, km20 – 3h30. Trail Sprint 18km: km7, km13 and finish. Cut-off times: km6 – 1h, km13 – 2h15. Mini Trail 12km: km6 and finish. Cut-off time: km6 – 1h.",
    },
    es: {
      question: "¿Dónde están los avituallamientos y los tiempos límite?",
      answer:
        "Trail Largo 26km: km7, km14, km20 y meta (sólido y líquido). Tiempos límite: km6 – 1h, km13 – 2h15, km20 – 3h30. Trail Sprint 18km: km7, km13 y meta. Tiempos límite: km6 – 1h, km13 – 2h15. Minitrail 12km: km6 y meta. Tiempo límite: km6 – 1h.",
    },
    fr: {
      question: "Où sont les ravitaillements et quels sont les temps limites ?",
      answer:
        "Trail Long 26km : km7, km14, km20 et arrivée (solide et liquide). Temps limites : km6 – 1h, km13 – 2h15, km20 – 3h30. Trail Sprint 18km : km7, km13 et arrivée. Temps limites : km6 – 1h, km13 – 2h15. Mini Trail 12km : km6 et arrivée. Temps limite : km6 – 1h.",
    },
    de: {
      question: "Wo sind die Verpflegungsstationen und Zeitlimits?",
      answer:
        "Trail Lang 26km: km7, km14, km20 und Ziel (fest und flüssig). Zeitlimits: km6 – 1h, km13 – 2h15, km20 – 3h30. Trail Sprint 18km: km7, km13 und Ziel. Zeitlimits: km6 – 1h, km13 – 2h15. Mini Trail 12km: km6 und Ziel. Zeitlimit: km6 – 1h.",
    },
    it: {
      question: "Dove sono i ristori e quali sono i tempi limite?",
      answer:
        "Trail Lungo 26km: km7, km14, km20 e traguardo (solido e liquido). Tempi limite: km6 – 1h, km13 – 2h15, km20 – 3h30. Trail Sprint 18km: km7, km13 e traguardo. Tempi limite: km6 – 1h, km13 – 2h15. Mini Trail 12km: km6 e traguardo. Tempo limite: km6 – 1h.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq3.id, language: Language[lang] },
      },
      update: faq3Translations[lang],
      create: {
        faqId: faq3.id,
        language: Language[lang],
        ...faq3Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 3: Aid stations and time limits");

  // FAQ 4: Prizes and classifications
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "Quais são os prémios e classificações?",
    "Troféus para os 3 primeiros classificados (M/F) em cada distância de trail. Lembranças para os 3 primeiros por escalão (Juvenil, Júnior, Sub23, Seniores, M35–M70, F35–F70). Classificação coletiva (soma dos 3 melhores de cada equipa) com troféus para trail longo, sprint e minitrail. Escalões definidos pela idade a 30/09/2026 (regulamento AAB)."
  );

  const faq4Translations = {
    pt: {
      question: "Quais são os prémios e classificações?",
      answer:
        "Troféus para os 3 primeiros classificados (M/F) em cada distância de trail. Lembranças para os 3 primeiros por escalão (Juvenil, Júnior, Sub23, Seniores, M35–M70, F35–F70). Classificação coletiva (soma dos 3 melhores de cada equipa) com troféus para trail longo, sprint e minitrail. Escalões definidos pela idade a 30/09/2026 (regulamento AAB).",
    },
    en: {
      question: "What are the prizes and classifications?",
      answer:
        "Trophies for the top 3 finishers (M/F) in each trail distance. Mementos for the top 3 per age group (Youth, Junior, U23, Senior, M35–M70, F35–F70). Team classification (sum of top 3 per team) with trophies for long trail, sprint and mini trail. Age groups determined by age on 30/09/2026 (AAB rules).",
    },
    es: {
      question: "¿Cuáles son los premios y clasificaciones?",
      answer:
        "Trofeos para los 3 primeros clasificados (M/F) en cada distancia de trail. Recuerdos para los 3 primeros por categoría (Juvenil, Júnior, Sub23, Seniores, M35–M70, F35–F70). Clasificación colectiva (suma de los 3 mejores de cada equipo) con trofeos para trail largo, sprint y minitrail. Categorías definidas por la edad a 30/09/2026 (reglamento AAB).",
    },
    fr: {
      question: "Quels sont les prix et classements ?",
      answer:
        "Trophées pour les 3 premiers classés (M/F) dans chaque distance de trail. Souvenirs pour les 3 premiers par catégorie d'âge (Jeune, Junior, U23, Senior, M35–M70, F35–F70). Classement collectif (somme des 3 meilleurs de chaque équipe) avec trophées pour trail long, sprint et mini trail. Catégories d'âge déterminées par l'âge au 30/09/2026 (règlement AAB).",
    },
    de: {
      question: "Welche Preise und Wertungen gibt es?",
      answer:
        "Pokale für die Top 3 (M/W) in jeder Trail-Distanz. Andenken für die Top 3 pro Altersklasse (Jugend, Junior, U23, Senioren, M35–M70, F35–F70). Mannschaftswertung (Summe der besten 3 pro Team) mit Pokalen für Trail Lang, Sprint und Mini Trail. Altersklassen nach Alter am 30.09.2026 (AAB-Reglement).",
    },
    it: {
      question: "Quali sono i premi e le classifiche?",
      answer:
        "Trofei per i primi 3 classificati (M/F) in ogni distanza di trail. Ricordi per i primi 3 per fascia d'età (Giovanile, Junior, U23, Senior, M35–M70, F35–F70). Classifica a squadre (somma dei 3 migliori per squadra) con trofei per trail lungo, sprint e mini trail. Fasce d'età determinate dall'età al 30/09/2026 (regolamento AAB).",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq4.id, language: Language[lang] },
      },
      update: faq4Translations[lang],
      create: {
        faqId: faq4.id,
        language: Language[lang],
        ...faq4Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 4: Prizes and classifications");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: XI Trail ERDAL/Vimarunners - Urgezes Solidário 2026
- Slug: trail-erdal-vimarunners-urgezes-2026
- Variants: 4 (Trail Longo 26km, Trail Sprint 18km, Minitrail 12km, Caminhada 8km)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 11 (3×Trail Longo + 3×Trail Sprint + 3×Minitrail + 2×Caminhada)
- FAQs: 5 (with translations in all 6 languages)
- Date: May 10, 2026
- Location: Parque Desportivo dos Amigos de Urgeses, Guimarães
- Coordinates: 41.4256, -8.2914
- Organization: ERDAL / Vimarunners / GDR Os Amigos de Urgeses
- Solidarity: BVG + Amigos Urgeses IPSS
  `);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
