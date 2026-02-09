/**
 * Seed: Ameal Trail 2026
 *
 * Event: Ameal Trail 2026
 * Date: Saturday 11 April (Kids) + Sunday 12 April 2026 (Main races)
 * Location: Campo de Futebol do Ameal, Coimbra, Portugal
 * Variants: Trail 17km, Mini Trail 12km, Caminhada 10km, Trail Kids
 * Organizer: ARDA - Associação Recreativa e Desportiva do Ameal
 * Circuit: Circuito Distrital de Trail Running de Coimbra (ADAC) - 17km only
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

interface TranslationData {
  title: string;
  description: string;
  city: string;
  metaTitle: string;
  metaDescription: string;
}

interface FAQData {
  question: string;
  answer: string;
}

interface PricingPhaseData {
  name: string;
  startDate: Date;
  endDate: Date;
  price: number;
  currency: Currency;
  note: string | null;
}

interface VariantData {
  name: string;
  distanceKm: number;
  elevationGainM?: number;
  elevationLossM?: number;
  startTime: string;
  startDate?: Date;
  maxParticipants?: number;
  cutoffTimeHours?: number;
  mountainLevel?: number;
  currency: Currency;
  pricingPhases: PricingPhaseData[];
}

export async function seedAmealTrail2026() {
  console.log("🏃 Seeding Ameal Trail 2026...");

  const eventSlug = "ameal-trail-2026";
  const eventStartDate = new Date("2026-04-11T15:00:00.000Z"); // Saturday Kids
  const eventEndDate = new Date("2026-04-12T20:00:00.000Z"); // Sunday end

  // Check if event already exists (idempotency)
  const existingEvent = await prisma.event.findUnique({
    where: { slug: eventSlug },
  });

  if (existingEvent) {
    console.log(
      `⚠️  Event "${eventSlug}" already exists. Deleting to recreate...`
    );
    await prisma.event.delete({
      where: { slug: eventSlug },
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // TRANSLATIONS (ALL 6 LANGUAGES)
  // ──────────────────────────────────────────────────────────────────────────

  const translations: Record<string, TranslationData> = {
    pt: {
      title: "Ameal Trail 2026",
      description: `**🏃 Ameal Trail 2026 - Trail Running no Coração de Coimbra**

O **Ameal Trail 2026** regressa a **11 e 12 de abril** ao **Ameal, Coimbra**, com quatro provas de trail running e caminhada organizadas pela **ARDA - Associação Recreativa e Desportiva do Ameal**, em colaboração com a **Junta de Freguesia União de Freguesias Ameal, Arzila e Taveiro** e a **Câmara Municipal de Coimbra**.

A prova de **17 km** integra o **Circuito Distrital de Trail Running de Coimbra (ADAC)**.

---

## 🏔️ Provas Disponíveis

### **Trail 17 km** – Circuito ADAC
- **Distância:** 17 km
- **Desnível Positivo:** 763 m
- **Terreno:** Trilhos técnicos e estradões
- **Dificuldade:** Alta
- Integrada no **Circuito Distrital de Trail Running de Coimbra**
- Desconto de **1,50€** para atletas filiados ADAC

### **Mini Trail 12 km**
- **Distância:** 12 km
- **Desnível Positivo:** 567 m
- **Terreno:** Trilhos e estradões
- **Dificuldade:** Média
- Indicada para quem se inicia no trail ou pretende uma prova mais curta

### **Caminhada 10 km**
- **Distância:** 10 km
- **Terreno:** Trilhos e estradões
- **Dificuldade:** Baixa
- Aberta a todos, sem distinção de sexo ou idade

### **Trail Kids**
- **Idades:** 3 aos 16 anos
- **Distâncias:** 400m a 2400m (por escalão)
- Bambis (3-6 anos): 400m
- Benjamins A (7-9 anos): 600m
- Benjamins B (10-11 anos): 600m
- Infantis (12-13 anos): 1600m
- Iniciados (14-15 anos): 2400m

---

## 📅 Programa

### **Sábado, 11 de Abril 2026** — Trail Kids
- **15:00** – Abertura do secretariado
- **16:20** – Briefing técnico
- **16:30** – Partida Bambis (400m)
- **16:40** – Partida Benjamins A (600m)
- **16:50** – Partida Benjamins B (600m)
- **17:00** – Partida Infantis (1600m)
- **17:20** – Partida Iniciados (2400m)
- **17:40** – Entrega de prémios
- **19:00** – Encerramento do secretariado

### **Domingo, 12 de Abril 2026** — Provas principais
**Trail 17 km:**
- **07:30** – Abertura do secretariado
- **08:50** – Briefing técnico
- **09:00** – **PARTIDA**
- **12:30** – Entrega de prémios

**Mini Trail 12 km:**
- **09:20** – Briefing técnico
- **09:30** – **PARTIDA**
- **12:30** – Entrega de prémios

**Caminhada 10 km:**
- **09:35** – Briefing técnico
- **09:40** – **PARTIDA**

---

## 🎯 Destaques do Evento

✅ **Circuito ADAC** — Prova de 17km integrada no Circuito Distrital
✅ **T-shirt técnica** incluída na inscrição
✅ **Almoço** incluído (caldo verde, bifana, fino/água/sumo)
✅ **Abastecimentos** com sólidos e líquidos
✅ **Cronometragem eletrónica** por chip no dorsal
✅ **Seguro de acidentes pessoais** incluído
✅ **Banhos/Duches** disponíveis
✅ **Transporte** para a meta em caso de desistência

---

## 💰 Preços e Fases de Inscrição

### Trail 17 km
- **1ª Fase** (até 01/12/2025): **18€** (ADAC: 16,50€)
- **2ª Fase** (até 29/02/2026): **19€** (ADAC: 17,50€)
- **3ª Fase** (até 26/03/2026): **21€** (ADAC: 19,50€)

### Mini Trail 12 km
- **1ª Fase** (até 01/12/2025): **14€**
- **2ª Fase** (até 29/02/2026): **15€**
- **3ª Fase** (até 26/03/2026): **17€**

### Caminhada 10 km
- **1ª Fase** (até 01/12/2025): **13€**
- **2ª Fase** (até 29/02/2026): **14€**
- **3ª Fase** (até 26/03/2026): **15€**

### Trail Kids
- **1ª e 2ª Fases**: **5€**
- **3ª Fase** (até 26/03/2026): **7€**

---

## 🎒 Material Obrigatório

✅ **Dorsal** (visível à frente)
✅ **Apito**
✅ **Manta térmica**
✅ **Recipiente** com capacidade mínima 250ml
✅ **Telemóvel** operacional e com carga

**⚠️ ATENÇÃO:** Por questões ambientais, a organização **não fornece** recipientes descartáveis nos abastecimentos.

### Material Recomendado
- Reserva alimentar
- Porta dorsal
- Luvas
- Corta-vento ou impermeável
- Chapéu
- Protetor solar

---

## 🥤 Abastecimentos

- **Trail 17 km:** 2 postos + 1 na meta (sólidos e líquidos)
- **Mini Trail 12 km:** 1 posto + 1 na meta (sólidos e líquidos)
- **Caminhada 10 km:** 1 posto + 1 na meta (sólidos e líquidos)

---

## 🏆 Prémios

- **3 primeiros** de cada escalão etário (M/F) — Trail e Mini Trail
- **3 primeiros** da geral masculina e feminina
- **3 melhores equipas** masculinas e femininas
- **Equipa mais numerosa**

### Escalões Etários (Trail/Mini Trail)
SUB18 (16-17, apenas Mini Trail), SUB20, SUB23, Seniores (23-34), M/F 35, 40, 45, 50, 55, 60, 65, 70+

### Escalões Trail Kids
Bambis (3-6), Benjamim A (7-9), Benjamim B (10-11), Infantil (12-13), Iniciado (14-15)

*Idade contabilizada a 30 de setembro de 2026.*

---

## ⚠️ Penalizações e Desqualificações

**Penalização de 30 minutos:**
- Falta de 1 item do material obrigatório
- Receber ajuda externa

**Desqualificação:**
- Falhar passagem num PAC
- Mais de 1 item obrigatório em falta
- Sair do percurso marcado / usar atalhos
- Deixar lixo no percurso
- Não prestar auxílio a atleta em perigo
- Retirar ou alterar sinalética

---

## 🌿 Responsabilidade Ambiental

O evento rege-se pelo **Código de Conduta e Boas Práticas dos Visitantes em Áreas Protegidas**:
- 🚫 Não sair do percurso marcado
- 🌱 Não colher plantas e flores
- 🦊 Não perturbar a fauna
- 🗑️ Transportar todas as embalagens vazias até à meta

---

## 📍 Localização

**Campo de Futebol do Ameal**
Ameal, Coimbra, Portugal
**Coordenadas GPS:** 40.1870444, -8.5516997

---

## 📞 Contactos

**Email:** traildoameal@gmail.com
**Facebook:** [Ameal Trail](https://www.facebook.com/AmealTrail)
**Inscrições:** [Stop and Go](https://stopandgo.com.pt/)

**Organização:** ARDA — Associação Recreativa e Desportiva do Ameal
Co-organização com a Junta de Freguesia e Câmara Municipal de Coimbra

---

🏃 **Vem correr pelos trilhos da aldeia do Ameal! Um trail desenhado de atleta para atletas, no coração de Coimbra!** 🌲`,
      city: "Ameal, Coimbra",
      metaTitle: "Ameal Trail 2026 | Ameal, Coimbra | 11-12 Abril",
      metaDescription:
        "Ameal Trail 2026 a 11-12 de abril em Coimbra. Trail 17km (763m D+), Mini Trail 12km (567m D+), Caminhada 10km e Trail Kids. Circuito ADAC. Inscrições: 5€-21€.",
    },
    en: {
      title: "Ameal Trail 2026",
      description: `**🏃 Ameal Trail 2026 - Trail Running in the Heart of Coimbra**

The **Ameal Trail 2026** returns on **April 11-12** to **Ameal, Coimbra**, with four trail running and walking races organized by **ARDA - Associação Recreativa e Desportiva do Ameal**, in collaboration with the local parish council and the **Coimbra City Council**.

The **17 km** race is part of the **Coimbra District Trail Running Circuit (ADAC)**.

---

## 🏔️ Available Races

### **Trail 17 km** – ADAC Circuit
- **Distance:** 17 km
- **Elevation Gain:** 763 m
- **Terrain:** Technical trails and dirt roads
- **Difficulty:** Hard
- Part of the **Coimbra District Trail Running Circuit**
- **€1.50 discount** for ADAC affiliated athletes

### **Mini Trail 12 km**
- **Distance:** 12 km
- **Elevation Gain:** 567 m
- **Terrain:** Trails and dirt roads
- **Difficulty:** Medium
- Suitable for beginners or those looking for a shorter race

### **Walk 10 km**
- **Distance:** 10 km
- **Terrain:** Trails and dirt roads
- **Difficulty:** Low
- Open to all, regardless of gender or age

### **Trail Kids**
- **Ages:** 3 to 16 years old
- **Distances:** 400m to 2400m (by age group)
- Bambis (3-6 years): 400m
- Benjamins A (7-9 years): 600m
- Benjamins B (10-11 years): 600m
- Infantis (12-13 years): 1600m
- Iniciados (14-15 years): 2400m

---

## 📅 Schedule

### **Saturday, April 11, 2026** — Trail Kids
- **15:00** – Registration opens
- **16:20** – Technical briefing
- **16:30** – Start Bambis (400m)
- **16:40** – Start Benjamins A (600m)
- **16:50** – Start Benjamins B (600m)
- **17:00** – Start Infantis (1600m)
- **17:20** – Start Iniciados (2400m)
- **17:40** – Award ceremony
- **19:00** – Registration closes

### **Sunday, April 12, 2026** — Main Races
**Trail 17 km:**
- **07:30** – Registration opens
- **08:50** – Technical briefing
- **09:00** – **START**
- **12:30** – Award ceremony

**Mini Trail 12 km:**
- **09:20** – Technical briefing
- **09:30** – **START**
- **12:30** – Award ceremony

**Walk 10 km:**
- **09:35** – Technical briefing
- **09:40** – **START**

---

## 🎯 Event Highlights

✅ **ADAC Circuit** — 17km race part of the District Circuit
✅ **Technical t-shirt** included in registration
✅ **Lunch** included (kale soup, pork sandwich, drink)
✅ **Aid stations** with solids and liquids
✅ **Electronic timing** by chip on bib
✅ **Personal accident insurance** included
✅ **Showers** available
✅ **Transport** to finish in case of withdrawal

---

## 💰 Prices and Registration Phases

### Trail 17 km
- **Phase 1** (until 01/12/2025): **€18** (ADAC: €16.50)
- **Phase 2** (until 29/02/2026): **€19** (ADAC: €17.50)
- **Phase 3** (until 26/03/2026): **€21** (ADAC: €19.50)

### Mini Trail 12 km
- **Phase 1** (until 01/12/2025): **€14**
- **Phase 2** (until 29/02/2026): **€15**
- **Phase 3** (until 26/03/2026): **€17**

### Walk 10 km
- **Phase 1** (until 01/12/2025): **€13**
- **Phase 2** (until 29/02/2026): **€14**
- **Phase 3** (until 26/03/2026): **€15**

### Trail Kids
- **Phases 1 & 2**: **€5**
- **Phase 3** (until 26/03/2026): **€7**

---

## 🎒 Mandatory Equipment

✅ **Race bib** (visible at front)
✅ **Whistle**
✅ **Emergency blanket**
✅ **Water container** minimum 250ml capacity
✅ **Mobile phone** operational and charged

**⚠️ NOTE:** For environmental reasons, the organization does **not provide** disposable containers at aid stations.

### Recommended Equipment
- Reserve food
- Bib holder
- Gloves
- Windbreaker or waterproof jacket
- Hat
- Sunscreen

---

## 🥤 Aid Stations

- **Trail 17 km:** 2 stations + 1 at finish (solids and liquids)
- **Mini Trail 12 km:** 1 station + 1 at finish (solids and liquids)
- **Walk 10 km:** 1 station + 1 at finish (solids and liquids)

---

## 🏆 Prizes

- **Top 3** in each age category (M/F) — Trail and Mini Trail
- **Top 3** overall male and female
- **Top 3 teams** male and female
- **Largest team**

---

## ⚠️ Penalties and Disqualifications

**30-minute penalty:**
- Missing 1 mandatory equipment item
- Receiving external help

**Disqualification:**
- Missing a checkpoint
- More than 1 mandatory item missing
- Leaving marked route / using shortcuts
- Littering on the trail
- Failing to assist an athlete in danger
- Removing or altering signage

---

## 📍 Location

**Ameal Football Field**
Ameal, Coimbra, Portugal
**GPS Coordinates:** 40.1870444, -8.5516997

---

## 📞 Contacts

**Email:** traildoameal@gmail.com
**Facebook:** [Ameal Trail](https://www.facebook.com/AmealTrail)
**Registration:** [Stop and Go](https://stopandgo.com.pt/)

---

🏃 **Come run through the trails of Ameal village! A trail designed by athletes for athletes, in the heart of Coimbra!** 🌲`,
      city: "Ameal, Coimbra",
      metaTitle: "Ameal Trail 2026 | Ameal, Coimbra | April 11-12",
      metaDescription:
        "Ameal Trail 2026 on April 11-12 in Coimbra. Trail 17km (763m D+), Mini Trail 12km (567m D+), Walk 10km and Trail Kids. ADAC Circuit. Entry: €5-21.",
    },
    es: {
      title: "Ameal Trail 2026",
      description: `**🏃 Ameal Trail 2026 - Trail Running en el Corazón de Coimbra**

El **Ameal Trail 2026** regresa el **11 y 12 de abril** a **Ameal, Coimbra**, con cuatro pruebas de trail running y caminata organizadas por la **ARDA - Associação Recreativa e Desportiva do Ameal**, en colaboración con la junta de la parroquia local y el **Ayuntamiento de Coimbra**.

La prueba de **17 km** forma parte del **Circuito Distrital de Trail Running de Coimbra (ADAC)**.

---

## 🏔️ Pruebas Disponibles

### **Trail 17 km** – Circuito ADAC
- **Distancia:** 17 km
- **Desnivel Positivo:** 763 m
- **Terreno:** Senderos técnicos y caminos
- **Dificultad:** Alta
- Integrada en el **Circuito Distrital de Trail Running de Coimbra**
- Descuento de **1,50€** para atletas afiliados ADAC

### **Mini Trail 12 km**
- **Distancia:** 12 km
- **Desnivel Positivo:** 567 m
- **Terreno:** Senderos y caminos
- **Dificultad:** Media
- Indicada para principiantes o quienes buscan una prueba más corta

### **Caminata 10 km**
- **Distancia:** 10 km
- **Terreno:** Senderos y caminos
- **Dificultad:** Baja
- Abierta a todos, sin distinción de sexo o edad

### **Trail Kids**
- **Edades:** 3 a 16 años
- **Distancias:** 400m a 2400m (por categoría)
- Bambis (3-6 años): 400m
- Benjamins A (7-9 años): 600m
- Benjamins B (10-11 años): 600m
- Infantiles (12-13 años): 1600m
- Iniciados (14-15 años): 2400m

---

## 📅 Programa

### **Sábado, 11 de Abril 2026** — Trail Kids
- **15:00** – Apertura de secretaría
- **16:20** – Briefing técnico
- **16:30** – Salida Bambis (400m)
- **16:40** – Salida Benjamins A (600m)
- **16:50** – Salida Benjamins B (600m)
- **17:00** – Salida Infantiles (1600m)
- **17:20** – Salida Iniciados (2400m)
- **17:40** – Entrega de premios
- **19:00** – Cierre de secretaría

### **Domingo, 12 de Abril 2026** — Pruebas principales
**Trail 17 km:**
- **07:30** – Apertura de secretaría
- **08:50** – Briefing técnico
- **09:00** – **SALIDA**
- **12:30** – Entrega de premios

**Mini Trail 12 km:**
- **09:20** – Briefing técnico
- **09:30** – **SALIDA**
- **12:30** – Entrega de premios

**Caminata 10 km:**
- **09:35** – Briefing técnico
- **09:40** – **SALIDA**

---

## 🎯 Aspectos Destacados

✅ **Circuito ADAC** — Prueba de 17km integrada en el Circuito Distrital
✅ **Camiseta técnica** incluida en la inscripción
✅ **Almuerzo** incluido (sopa, bocadillo de cerdo, bebida)
✅ **Avituallamientos** con sólidos y líquidos
✅ **Cronometraje electrónico** por chip
✅ **Seguro de accidentes personales** incluido
✅ **Duchas** disponibles
✅ **Transporte** a la meta en caso de abandono

---

## 💰 Precios y Fases de Inscripción

### Trail 17 km
- **Fase 1** (hasta 01/12/2025): **18€** (ADAC: 16,50€)
- **Fase 2** (hasta 29/02/2026): **19€** (ADAC: 17,50€)
- **Fase 3** (hasta 26/03/2026): **21€** (ADAC: 19,50€)

### Mini Trail 12 km
- **Fase 1** (hasta 01/12/2025): **14€**
- **Fase 2** (hasta 29/02/2026): **15€**
- **Fase 3** (hasta 26/03/2026): **17€**

### Caminata 10 km
- **Fase 1** (hasta 01/12/2025): **13€**
- **Fase 2** (hasta 29/02/2026): **14€**
- **Fase 3** (hasta 26/03/2026): **15€**

### Trail Kids
- **Fases 1 y 2**: **5€**
- **Fase 3** (hasta 26/03/2026): **7€**

---

## 🎒 Material Obligatorio

✅ **Dorsal** (visible en el pecho)
✅ **Silbato**
✅ **Manta térmica**
✅ **Recipiente** con capacidad mínima de 250ml
✅ **Teléfono móvil** operativo y con carga

### Material Recomendado
- Reserva alimentaria
- Porta dorsal
- Guantes
- Cortavientos o impermeable
- Gorra
- Protector solar

---

## 🥤 Avituallamientos

- **Trail 17 km:** 2 puestos + 1 en meta (sólidos y líquidos)
- **Mini Trail 12 km:** 1 puesto + 1 en meta (sólidos y líquidos)
- **Caminata 10 km:** 1 puesto + 1 en meta (sólidos y líquidos)

---

## 🏆 Premios

- **3 primeros** de cada categoría de edad (M/F) — Trail y Mini Trail
- **3 primeros** de la general masculina y femenina
- **3 mejores equipos** masculinos y femeninos
- **Equipo más numeroso**

---

## ⚠️ Penalizaciones y Descalificaciones

**Penalización de 30 minutos:**
- Falta de 1 material obligatorio
- Recibir ayuda externa

**Descalificación:**
- Faltar a un puesto de control
- Más de 1 material obligatorio en falta
- Salir del recorrido / usar atajos
- Dejar basura en el recorrido
- No asistir a un atleta en peligro
- Retirar o alterar la señalización

---

## 📍 Ubicación

**Campo de Fútbol de Ameal**
Ameal, Coimbra, Portugal
**Coordenadas GPS:** 40.1870444, -8.5516997

---

## 📞 Contactos

**Email:** traildoameal@gmail.com
**Facebook:** [Ameal Trail](https://www.facebook.com/AmealTrail)
**Inscripciones:** [Stop and Go](https://stopandgo.com.pt/)

---

🏃 **¡Ven a correr por los senderos de la aldea de Ameal! ¡Un trail diseñado de atletas para atletas, en el corazón de Coimbra!** 🌲`,
      city: "Ameal, Coimbra",
      metaTitle: "Ameal Trail 2026 | Ameal, Coimbra | 11-12 Abril",
      metaDescription:
        "Ameal Trail 2026 el 11-12 de abril en Coimbra. Trail 17km (763m D+), Mini Trail 12km (567m D+), Caminata 10km y Trail Kids. Circuito ADAC. Inscripción: 5€-21€.",
    },
    fr: {
      title: "Ameal Trail 2026",
      description: `**🏃 Ameal Trail 2026 - Trail Running au Cœur de Coimbra**

L'**Ameal Trail 2026** revient les **11 et 12 avril** à **Ameal, Coimbra**, avec quatre courses de trail running et marche organisées par l'**ARDA - Associação Recreativa e Desportiva do Ameal**, en collaboration avec la paroisse locale et la **Mairie de Coimbra**.

La course de **17 km** fait partie du **Circuit de District de Trail Running de Coimbra (ADAC)**.

---

## 🏔️ Courses Disponibles

### **Trail 17 km** – Circuit ADAC
- **Distance:** 17 km
- **Dénivelé Positif:** 763 m
- **Terrain:** Sentiers techniques et chemins
- **Difficulté:** Élevée
- Intégrée au **Circuit de District de Trail Running de Coimbra**
- Réduction de **1,50€** pour les athlètes affiliés ADAC

### **Mini Trail 12 km**
- **Distance:** 12 km
- **Dénivelé Positif:** 567 m
- **Terrain:** Sentiers et chemins
- **Difficulté:** Moyenne
- Adaptée aux débutants ou à ceux qui souhaitent une course plus courte

### **Marche 10 km**
- **Distance:** 10 km
- **Terrain:** Sentiers et chemins
- **Difficulté:** Faible
- Ouverte à tous, sans distinction de sexe ou d'âge

### **Trail Kids**
- **Âges:** 3 à 16 ans
- **Distances:** 400m à 2400m (par catégorie d'âge)
- Bambis (3-6 ans): 400m
- Benjamins A (7-9 ans): 600m
- Benjamins B (10-11 ans): 600m
- Infantils (12-13 ans): 1600m
- Initiés (14-15 ans): 2400m

---

## 📅 Programme

### **Samedi 11 Avril 2026** — Trail Kids
- **15:00** – Ouverture du secrétariat
- **16:20** – Briefing technique
- **16:30** – Départ Bambis (400m)
- **16:40** – Départ Benjamins A (600m)
- **16:50** – Départ Benjamins B (600m)
- **17:00** – Départ Infantils (1600m)
- **17:20** – Départ Initiés (2400m)
- **17:40** – Remise des prix
- **19:00** – Fermeture du secrétariat

### **Dimanche 12 Avril 2026** — Courses principales
**Trail 17 km :**
- **07:30** – Ouverture du secrétariat
- **08:50** – Briefing technique
- **09:00** – **DÉPART**
- **12:30** – Remise des prix

**Mini Trail 12 km :**
- **09:20** – Briefing technique
- **09:30** – **DÉPART**
- **12:30** – Remise des prix

**Marche 10 km :**
- **09:35** – Briefing technique
- **09:40** – **DÉPART**

---

## 🎯 Points Forts

✅ **Circuit ADAC** — Course de 17km intégrée au Circuit de District
✅ **T-shirt technique** inclus dans l'inscription
✅ **Déjeuner** inclus (soupe au chou, sandwich au porc, boisson)
✅ **Ravitaillements** avec solides et liquides
✅ **Chronométrage électronique** par puce
✅ **Assurance accidents corporels** incluse
✅ **Douches** disponibles
✅ **Transport** vers l'arrivée en cas d'abandon

---

## 💰 Prix et Phases d'Inscription

### Trail 17 km
- **Phase 1** (jusqu'au 01/12/2025): **18€** (ADAC: 16,50€)
- **Phase 2** (jusqu'au 29/02/2026): **19€** (ADAC: 17,50€)
- **Phase 3** (jusqu'au 26/03/2026): **21€** (ADAC: 19,50€)

### Mini Trail 12 km
- **Phase 1** (jusqu'au 01/12/2025): **14€**
- **Phase 2** (jusqu'au 29/02/2026): **15€**
- **Phase 3** (jusqu'au 26/03/2026): **17€**

### Marche 10 km
- **Phase 1** (jusqu'au 01/12/2025): **13€**
- **Phase 2** (jusqu'au 29/02/2026): **14€**
- **Phase 3** (jusqu'au 26/03/2026): **15€**

### Trail Kids
- **Phases 1 et 2**: **5€**
- **Phase 3** (jusqu'au 26/03/2026): **7€**

---

## 🎒 Matériel Obligatoire

✅ **Dossard** (visible à l'avant)
✅ **Sifflet**
✅ **Couverture thermique**
✅ **Récipient** d'une capacité minimale de 250ml
✅ **Téléphone portable** opérationnel et chargé

### Matériel Recommandé
- Réserve alimentaire
- Porte-dossard
- Gants
- Coupe-vent ou imperméable
- Chapeau
- Crème solaire

---

## 🥤 Ravitaillements

- **Trail 17 km:** 2 postes + 1 à l'arrivée (solides et liquides)
- **Mini Trail 12 km:** 1 poste + 1 à l'arrivée (solides et liquides)
- **Marche 10 km:** 1 poste + 1 à l'arrivée (solides et liquides)

---

## 🏆 Récompenses

- **3 premiers** de chaque catégorie d'âge (H/F) — Trail et Mini Trail
- **3 premiers** du classement général masculin et féminin
- **3 meilleures équipes** masculines et féminines
- **Équipe la plus nombreuse**

---

## ⚠️ Pénalités et Disqualifications

**Pénalité de 30 minutes :**
- Absence d'un élément de matériel obligatoire
- Aide extérieure reçue

**Disqualification :**
- Manquer un poste de contrôle
- Plus d'un élément obligatoire manquant
- Quitter le parcours / prendre des raccourcis
- Laisser des déchets sur le parcours
- Ne pas assister un athlète en danger
- Retirer ou modifier la signalisation

---

## 📍 Localisation

**Terrain de Football d'Ameal**
Ameal, Coimbra, Portugal
**Coordonnées GPS:** 40.1870444, -8.5516997

---

## 📞 Contacts

**Email:** traildoameal@gmail.com
**Facebook:** [Ameal Trail](https://www.facebook.com/AmealTrail)
**Inscriptions:** [Stop and Go](https://stopandgo.com.pt/)

---

🏃 **Venez courir sur les sentiers du village d'Ameal ! Un trail conçu d'athlètes pour athlètes, au cœur de Coimbra !** 🌲`,
      city: "Ameal, Coimbra",
      metaTitle: "Ameal Trail 2026 | Ameal, Coimbra | 11-12 Avril",
      metaDescription:
        "Ameal Trail 2026 les 11-12 avril à Coimbra. Trail 17km (763m D+), Mini Trail 12km (567m D+), Marche 10km et Trail Kids. Circuit ADAC. Inscription: 5€-21€.",
    },
    de: {
      title: "Ameal Trail 2026",
      description: `**🏃 Ameal Trail 2026 - Trail Running im Herzen von Coimbra**

Der **Ameal Trail 2026** kehrt am **11. und 12. April** nach **Ameal, Coimbra** zurück, mit vier Trail-Running- und Wanderrennen, organisiert von der **ARDA - Associação Recreativa e Desportiva do Ameal**, in Zusammenarbeit mit dem örtlichen Gemeinderat und der **Stadtverwaltung Coimbra**.

Das **17-km-Rennen** ist Teil des **Bezirks-Trail-Running-Circuits von Coimbra (ADAC)**.

---

## 🏔️ Verfügbare Rennen

### **Trail 17 km** – ADAC-Circuit
- **Distanz:** 17 km
- **Höhengewinn:** 763 m
- **Gelände:** Technische Trails und Schotterwege
- **Schwierigkeit:** Hoch
- Teil des **Bezirks-Trail-Running-Circuits von Coimbra**
- **1,50€ Rabatt** für ADAC-Mitglieder

### **Mini Trail 12 km**
- **Distanz:** 12 km
- **Höhengewinn:** 567 m
- **Gelände:** Trails und Schotterwege
- **Schwierigkeit:** Mittel
- Geeignet für Anfänger oder kürzere Distanz

### **Wanderung 10 km**
- **Distanz:** 10 km
- **Gelände:** Trails und Schotterwege
- **Schwierigkeit:** Niedrig
- Offen für alle, unabhängig von Geschlecht oder Alter

### **Trail Kids**
- **Alter:** 3 bis 16 Jahre
- **Distanzen:** 400m bis 2400m (nach Altersgruppe)
- Bambis (3-6 Jahre): 400m
- Benjamins A (7-9 Jahre): 600m
- Benjamins B (10-11 Jahre): 600m
- Infantis (12-13 Jahre): 1600m
- Iniciados (14-15 Jahre): 2400m

---

## 📅 Programm

### **Samstag, 11. April 2026** — Trail Kids
- **15:00** – Eröffnung des Sekretariats
- **16:20** – Technisches Briefing
- **16:30** – Start Bambis (400m)
- **16:40** – Start Benjamins A (600m)
- **16:50** – Start Benjamins B (600m)
- **17:00** – Start Infantis (1600m)
- **17:20** – Start Iniciados (2400m)
- **17:40** – Siegerehrung
- **19:00** – Schließung des Sekretariats

### **Sonntag, 12. April 2026** — Hauptrennen
**Trail 17 km:**
- **07:30** – Eröffnung des Sekretariats
- **08:50** – Technisches Briefing
- **09:00** – **START**
- **12:30** – Siegerehrung

**Mini Trail 12 km:**
- **09:20** – Technisches Briefing
- **09:30** – **START**
- **12:30** – Siegerehrung

**Wanderung 10 km:**
- **09:35** – Technisches Briefing
- **09:40** – **START**

---

## 🎯 Veranstaltungs-Highlights

✅ **ADAC-Circuit** — 17km-Rennen im Bezirks-Circuit
✅ **Technisches T-Shirt** in der Anmeldung enthalten
✅ **Mittagessen** enthalten (Grünkohlsuppe, Schweinefleisch-Sandwich, Getränk)
✅ **Verpflegungsstellen** mit fester und flüssiger Nahrung
✅ **Elektronische Zeitmessung** per Chip
✅ **Unfallversicherung** enthalten
✅ **Duschen** verfügbar
✅ **Transport** zum Ziel bei Aufgabe

---

## 💰 Preise und Anmeldephasen

### Trail 17 km
- **Phase 1** (bis 01.12.2025): **18€** (ADAC: 16,50€)
- **Phase 2** (bis 29.02.2026): **19€** (ADAC: 17,50€)
- **Phase 3** (bis 26.03.2026): **21€** (ADAC: 19,50€)

### Mini Trail 12 km
- **Phase 1** (bis 01.12.2025): **14€**
- **Phase 2** (bis 29.02.2026): **15€**
- **Phase 3** (bis 26.03.2026): **17€**

### Wanderung 10 km
- **Phase 1** (bis 01.12.2025): **13€**
- **Phase 2** (bis 29.02.2026): **14€**
- **Phase 3** (bis 26.03.2026): **15€**

### Trail Kids
- **Phasen 1 und 2**: **5€**
- **Phase 3** (bis 26.03.2026): **7€**

---

## 🎒 Pflichtausrüstung

✅ **Startnummer** (sichtbar vorne)
✅ **Pfeife**
✅ **Thermodecke**
✅ **Behälter** mit mindestens 250ml Fassungsvermögen
✅ **Mobiltelefon** betriebsbereit und geladen

### Empfohlene Ausrüstung
- Reserveverpflegung
- Startnummernhalter
- Handschuhe
- Windjacke oder Regenjacke
- Mütze
- Sonnenschutz

---

## 🥤 Verpflegungsstellen

- **Trail 17 km:** 2 Stellen + 1 im Ziel (fest und flüssig)
- **Mini Trail 12 km:** 1 Stelle + 1 im Ziel (fest und flüssig)
- **Wanderung 10 km:** 1 Stelle + 1 im Ziel (fest und flüssig)

---

## 🏆 Preise

- **Top 3** jeder Altersklasse (M/W) — Trail und Mini Trail
- **Top 3** Gesamtwertung Männer und Frauen
- **Top 3 Teams** Männer und Frauen
- **Größtes Team**

---

## ⚠️ Strafen und Disqualifikationen

**30-Minuten-Strafe:**
- Fehlendes Pflichtausrüstungsteil
- Externe Hilfe erhalten

**Disqualifikation:**
- Kontrollposten verpasst
- Mehr als 1 Pflichtteil fehlend
- Strecke verlassen / Abkürzungen nutzen
- Müll auf der Strecke hinterlassen
- Einem Athleten in Not nicht helfen
- Beschilderung entfernen oder ändern

---

## 📍 Standort

**Fußballplatz Ameal**
Ameal, Coimbra, Portugal
**GPS-Koordinaten:** 40.1870444, -8.5516997

---

## 📞 Kontakte

**E-Mail:** traildoameal@gmail.com
**Facebook:** [Ameal Trail](https://www.facebook.com/AmealTrail)
**Anmeldung:** [Stop and Go](https://stopandgo.com.pt/)

---

🏃 **Komm und lauf durch die Wege des Dorfes Ameal! Ein Trail von Athleten für Athleten, im Herzen von Coimbra!** 🌲`,
      city: "Ameal, Coimbra",
      metaTitle: "Ameal Trail 2026 | Ameal, Coimbra | 11.-12. April",
      metaDescription:
        "Ameal Trail 2026 am 11.-12. April in Coimbra. Trail 17km (763m D+), Mini Trail 12km (567m D+), Wanderung 10km und Trail Kids. ADAC-Circuit. Anmeldung: 5€-21€.",
    },
    it: {
      title: "Ameal Trail 2026",
      description: `**🏃 Ameal Trail 2026 - Trail Running nel Cuore di Coimbra**

L'**Ameal Trail 2026** torna l'**11 e 12 aprile** ad **Ameal, Coimbra**, con quattro gare di trail running e camminata organizzate dall'**ARDA - Associação Recreativa e Desportiva do Ameal**, in collaborazione con la parrocchia locale e il **Comune di Coimbra**.

La gara di **17 km** fa parte del **Circuito Distrettuale di Trail Running di Coimbra (ADAC)**.

---

## 🏔️ Gare Disponibili

### **Trail 17 km** – Circuito ADAC
- **Distanza:** 17 km
- **Dislivello Positivo:** 763 m
- **Terreno:** Sentieri tecnici e strade sterrate
- **Difficoltà:** Alta
- Integrata nel **Circuito Distrettuale di Trail Running di Coimbra**
- Sconto di **1,50€** per atleti affiliati ADAC

### **Mini Trail 12 km**
- **Distanza:** 12 km
- **Dislivello Positivo:** 567 m
- **Terreno:** Sentieri e strade sterrate
- **Difficoltà:** Media
- Adatta ai principianti o a chi cerca una gara più breve

### **Camminata 10 km**
- **Distanza:** 10 km
- **Terreno:** Sentieri e strade sterrate
- **Difficoltà:** Bassa
- Aperta a tutti, senza distinzione di sesso o età

### **Trail Kids**
- **Età:** 3 a 16 anni
- **Distanze:** 400m a 2400m (per categoria di età)
- Bambis (3-6 anni): 400m
- Benjamins A (7-9 anni): 600m
- Benjamins B (10-11 anni): 600m
- Infantili (12-13 anni): 1600m
- Iniziati (14-15 anni): 2400m

---

## 📅 Programma

### **Sabato 11 Aprile 2026** — Trail Kids
- **15:00** – Apertura segreteria
- **16:20** – Briefing tecnico
- **16:30** – Partenza Bambis (400m)
- **16:40** – Partenza Benjamins A (600m)
- **16:50** – Partenza Benjamins B (600m)
- **17:00** – Partenza Infantili (1600m)
- **17:20** – Partenza Iniziati (2400m)
- **17:40** – Premiazione
- **19:00** – Chiusura segreteria

### **Domenica 12 Aprile 2026** — Gare principali
**Trail 17 km:**
- **07:30** – Apertura segreteria
- **08:50** – Briefing tecnico
- **09:00** – **PARTENZA**
- **12:30** – Premiazione

**Mini Trail 12 km:**
- **09:20** – Briefing tecnico
- **09:30** – **PARTENZA**
- **12:30** – Premiazione

**Camminata 10 km:**
- **09:35** – Briefing tecnico
- **09:40** – **PARTENZA**

---

## 🎯 Punti Salienti

✅ **Circuito ADAC** — Gara di 17km nel Circuito Distrettuale
✅ **T-shirt tecnica** inclusa nell'iscrizione
✅ **Pranzo** incluso (zuppa di cavolo, panino di maiale, bevanda)
✅ **Ristori** con solidi e liquidi
✅ **Cronometraggio elettronico** tramite chip
✅ **Assicurazione infortuni personali** inclusa
✅ **Docce** disponibili
✅ **Trasporto** all'arrivo in caso di ritiro

---

## 💰 Prezzi e Fasi di Iscrizione

### Trail 17 km
- **Fase 1** (fino al 01/12/2025): **18€** (ADAC: 16,50€)
- **Fase 2** (fino al 29/02/2026): **19€** (ADAC: 17,50€)
- **Fase 3** (fino al 26/03/2026): **21€** (ADAC: 19,50€)

### Mini Trail 12 km
- **Fase 1** (fino al 01/12/2025): **14€**
- **Fase 2** (fino al 29/02/2026): **15€**
- **Fase 3** (fino al 26/03/2026): **17€**

### Camminata 10 km
- **Fase 1** (fino al 01/12/2025): **13€**
- **Fase 2** (fino al 29/02/2026): **14€**
- **Fase 3** (fino al 26/03/2026): **15€**

### Trail Kids
- **Fasi 1 e 2**: **5€**
- **Fase 3** (fino al 26/03/2026): **7€**

---

## 🎒 Materiale Obbligatorio

✅ **Pettorale** (visibile davanti)
✅ **Fischietto**
✅ **Coperta termica**
✅ **Recipiente** con capacità minima 250ml
✅ **Telefono cellulare** operativo e carico

### Materiale Raccomandato
- Riserva alimentare
- Portapettorale
- Guanti
- Giacca antivento o impermeabile
- Cappello
- Protezione solare

---

## 🥤 Ristori

- **Trail 17 km:** 2 punti + 1 all'arrivo (solidi e liquidi)
- **Mini Trail 12 km:** 1 punto + 1 all'arrivo (solidi e liquidi)
- **Camminata 10 km:** 1 punto + 1 all'arrivo (solidi e liquidi)

---

## 🏆 Premi

- **Primi 3** di ogni categoria di età (M/F) — Trail e Mini Trail
- **Primi 3** della classifica generale maschile e femminile
- **Prime 3 squadre** maschili e femminili
- **Squadra più numerosa**

---

## ⚠️ Penalità e Squalifiche

**Penalità di 30 minuti:**
- Mancanza di 1 elemento obbligatorio
- Aiuto esterno ricevuto

**Squalifica:**
- Mancato passaggio a un posto di controllo
- Più di 1 elemento obbligatorio mancante
- Uscire dal percorso / usare scorciatoie
- Lasciare rifiuti sul percorso
- Non soccorrere un atleta in pericolo
- Rimuovere o alterare la segnaletica

---

## 📍 Posizione

**Campo di Calcio di Ameal**
Ameal, Coimbra, Portogallo
**Coordinate GPS:** 40.1870444, -8.5516997

---

## 📞 Contatti

**Email:** traildoameal@gmail.com
**Facebook:** [Ameal Trail](https://www.facebook.com/AmealTrail)
**Iscrizioni:** [Stop and Go](https://stopandgo.com.pt/)

---

🏃 **Vieni a correre sui sentieri del villaggio di Ameal! Un trail progettato da atleti per atleti, nel cuore di Coimbra!** 🌲`,
      city: "Ameal, Coimbra",
      metaTitle: "Ameal Trail 2026 | Ameal, Coimbra | 11-12 Aprile",
      metaDescription:
        "Ameal Trail 2026 l'11-12 aprile a Coimbra. Trail 17km (763m D+), Mini Trail 12km (567m D+), Camminata 10km e Trail Kids. Circuito ADAC. Iscrizione: 5€-21€.",
    },
  };

  // ──────────────────────────────────────────────────────────────────────────
  // FAQs (ALL 6 LANGUAGES)
  // ──────────────────────────────────────────────────────────────────────────

  const faqs: Record<string, FAQData[]> = {
    pt: [
      {
        question: "Quando e onde se realiza o Ameal Trail 2026?",
        answer:
          "O Ameal Trail 2026 realiza-se a 11 (Trail Kids) e 12 de abril de 2026 (provas principais), no Campo de Futebol do Ameal, Coimbra. Coordenadas GPS: 40.1870444, -8.5516997.",
      },
      {
        question: "Quais são as provas disponíveis?",
        answer:
          "Existem 4 provas: Trail 17km (763m D+, integrada no Circuito ADAC), Mini Trail 12km (567m D+), Caminhada 10km e Trail Kids (idades 3-16 anos, com distâncias de 400m a 2400m).",
      },
      {
        question: "Qual é o material obrigatório?",
        answer:
          "Dorsal visível à frente, apito, manta térmica, recipiente com capacidade mínima de 250ml (cantil, bidon, softflask ou garrafa) e telemóvel operacional e com carga. Por questões ambientais, a organização não fornece recipientes descartáveis.",
      },
      {
        question: "Quanto custa a inscrição?",
        answer:
          "Trail 17km: 18€-21€ (ADAC: desconto de 1,50€). Mini Trail 12km: 14€-17€. Caminhada 10km: 13€-15€. Trail Kids: 5€-7€. Preços variam consoante a fase de inscrição, sendo a última até 26/03/2026.",
      },
      {
        question: "O que está incluído na inscrição?",
        answer:
          "Dorsal com chip de cronometragem, t-shirt técnica, abastecimentos (sólidos e líquidos), almoço (caldo verde, bifana, fino/água/sumo), banhos/duches, seguro de acidentes pessoais, transporte para a meta em caso de desistência e assistência médica.",
      },
      {
        question: "A prova de 17km integra algum circuito?",
        answer:
          "Sim, a prova de Trail 17km integra o Circuito Distrital de Trail Running de Coimbra (ADAC). Os atletas filiados ADAC beneficiam de um desconto de 1,50€ em todas as fases de inscrição.",
      },
      {
        question: "Qual é a idade mínima para participar?",
        answer:
          "Trail 17km: a partir dos 18 anos. Mini Trail 12km: a partir dos 16 anos (SUB18 apenas nesta prova). Caminhada 10km: aberta a todos. Trail Kids: dos 3 aos 16 anos.",
      },
      {
        question: "Existem penalizações?",
        answer:
          "Penalização de 30 minutos: falta de 1 item do material obrigatório ou receber ajuda externa. Desqualificação: falhar passagem num PAC, mais de 1 item obrigatório em falta, sair do percurso, deixar lixo no trilho, não prestar auxílio, ou alterar sinalética.",
      },
      {
        question: "Como funciona o Trail Kids?",
        answer:
          "O Trail Kids realiza-se no sábado, 11 de abril. As provas são divididas por escalões: Bambis (3-6 anos, 400m), Benjamins A (7-9 anos, 600m), Benjamins B (10-11 anos, 600m), Infantis (12-13 anos, 1600m) e Iniciados (14-15 anos, 2400m). Inclui dorsal, t-shirt técnica, seguro e abastecimento final.",
      },
      {
        question: "Posso cancelar a minha inscrição?",
        answer:
          "Em caso de lesão comprovada com relatório médico (enviar para traildoameal@gmail.com): reembolso de 50% até 10/03/2026, 0% após essa data. Em caso de cancelamento do evento: 50% até 02/02/2026, 25% até 16/02/2026, 0% após 17/02/2026.",
      },
    ],
    en: [
      {
        question: "When and where does Ameal Trail 2026 take place?",
        answer:
          "Ameal Trail 2026 takes place on April 11 (Trail Kids) and April 12, 2026 (main races), at Ameal Football Field, Coimbra. GPS Coordinates: 40.1870444, -8.5516997.",
      },
      {
        question: "What races are available?",
        answer:
          "There are 4 races: Trail 17km (763m D+, part of ADAC Circuit), Mini Trail 12km (567m D+), Walk 10km, and Trail Kids (ages 3-16, distances from 400m to 2400m).",
      },
      {
        question: "What is the mandatory equipment?",
        answer:
          "Visible race bib at front, whistle, emergency blanket, water container with minimum 250ml capacity (flask, bidon, softflask or bottle), and operational charged mobile phone. For environmental reasons, the organization does not provide disposable containers.",
      },
      {
        question: "How much does registration cost?",
        answer:
          "Trail 17km: €18-21 (ADAC: €1.50 discount). Mini Trail 12km: €14-17. Walk 10km: €13-15. Trail Kids: €5-7. Prices vary by registration phase, with the last phase until 26/03/2026.",
      },
      {
        question: "What is included in registration?",
        answer:
          "Race bib with timing chip, technical t-shirt, aid stations (solids and liquids), lunch (kale soup, pork sandwich, drink), showers, personal accident insurance, transport to finish in case of withdrawal, and medical assistance.",
      },
      {
        question: "Is the 17km race part of a circuit?",
        answer:
          "Yes, the Trail 17km race is part of the Coimbra District Trail Running Circuit (ADAC). ADAC affiliated athletes benefit from a €1.50 discount in all registration phases.",
      },
      {
        question: "What is the minimum age to participate?",
        answer:
          "Trail 17km: 18 years old. Mini Trail 12km: 16 years old (U18 only in this race). Walk 10km: open to all. Trail Kids: 3 to 16 years old.",
      },
      {
        question: "Are there penalties?",
        answer:
          "30-minute penalty: missing 1 mandatory equipment item or receiving external help. Disqualification: missing a checkpoint, more than 1 mandatory item missing, leaving marked route, littering, failing to assist an athlete in danger, or altering signage.",
      },
      {
        question: "How does Trail Kids work?",
        answer:
          "Trail Kids takes place on Saturday, April 11. Races are divided by age group: Bambis (3-6 years, 400m), Benjamins A (7-9 years, 600m), Benjamins B (10-11 years, 600m), Infantis (12-13 years, 1600m) and Iniciados (14-15 years, 2400m). Includes bib, technical t-shirt, insurance and final refreshment.",
      },
      {
        question: "Can I cancel my registration?",
        answer:
          "For proven injury with medical report (send to traildoameal@gmail.com): 50% refund until 10/03/2026, 0% after that date. In case of event cancellation: 50% until 02/02/2026, 25% until 16/02/2026, 0% after 17/02/2026.",
      },
    ],
    es: [
      {
        question: "¿Cuándo y dónde se realiza el Ameal Trail 2026?",
        answer:
          "El Ameal Trail 2026 se realiza el 11 (Trail Kids) y 12 de abril de 2026 (pruebas principales), en el Campo de Fútbol de Ameal, Coimbra. Coordenadas GPS: 40.1870444, -8.5516997.",
      },
      {
        question: "¿Cuáles son las pruebas disponibles?",
        answer:
          "Hay 4 pruebas: Trail 17km (763m D+, Circuito ADAC), Mini Trail 12km (567m D+), Caminata 10km y Trail Kids (3-16 años, distancias de 400m a 2400m).",
      },
      {
        question: "¿Cuál es el material obligatorio?",
        answer:
          "Dorsal visible en el pecho, silbato, manta térmica, recipiente con capacidad mínima de 250ml y teléfono móvil operativo y cargado. La organización no proporciona recipientes desechables.",
      },
      {
        question: "¿Cuánto cuesta la inscripción?",
        answer:
          "Trail 17km: 18€-21€ (ADAC: descuento de 1,50€). Mini Trail 12km: 14€-17€. Caminata 10km: 13€-15€. Trail Kids: 5€-7€. Última fase hasta el 26/03/2026.",
      },
      {
        question: "¿Qué está incluido en la inscripción?",
        answer:
          "Dorsal con chip de cronometraje, camiseta técnica, avituallamientos, almuerzo (sopa, bocadillo de cerdo, bebida), duchas, seguro de accidentes personales, transporte a meta y asistencia médica.",
      },
      {
        question: "¿La prueba de 17km forma parte de algún circuito?",
        answer:
          "Sí, la prueba de Trail 17km integra el Circuito Distrital de Trail Running de Coimbra (ADAC). Los atletas afiliados ADAC obtienen un descuento de 1,50€ en todas las fases.",
      },
      {
        question: "¿Cuál es la edad mínima para participar?",
        answer:
          "Trail 17km: desde 18 años. Mini Trail 12km: desde 16 años. Caminata 10km: abierta a todos. Trail Kids: de 3 a 16 años.",
      },
      {
        question: "¿Existen penalizaciones?",
        answer:
          "Penalización de 30 minutos: falta de 1 material obligatorio o recibir ayuda externa. Descalificación: faltar a un puesto de control, más de 1 material en falta, salir del recorrido, dejar basura o no asistir a un atleta en peligro.",
      },
      {
        question: "¿Cómo funciona el Trail Kids?",
        answer:
          "El Trail Kids se celebra el sábado 11 de abril. Las pruebas se dividen por edades: Bambis (3-6 años, 400m), Benjamins A (7-9 años, 600m), Benjamins B (10-11 años, 600m), Infantiles (12-13 años, 1600m) e Iniciados (14-15 años, 2400m).",
      },
      {
        question: "¿Puedo cancelar mi inscripción?",
        answer:
          "Por lesión comprobada con informe médico (enviar a traildoameal@gmail.com): reembolso del 50% hasta el 10/03/2026, 0% después. Cancelación del evento: 50% hasta 02/02/2026, 25% hasta 16/02/2026, 0% después del 17/02/2026.",
      },
    ],
    fr: [
      {
        question: "Quand et où a lieu l'Ameal Trail 2026 ?",
        answer:
          "L'Ameal Trail 2026 a lieu le 11 (Trail Kids) et 12 avril 2026 (courses principales), au Terrain de Football d'Ameal, Coimbra. Coordonnées GPS : 40.1870444, -8.5516997.",
      },
      {
        question: "Quelles sont les courses disponibles ?",
        answer:
          "Il y a 4 courses : Trail 17km (763m D+, Circuit ADAC), Mini Trail 12km (567m D+), Marche 10km et Trail Kids (3-16 ans, distances de 400m à 2400m).",
      },
      {
        question: "Quel est le matériel obligatoire ?",
        answer:
          "Dossard visible à l'avant, sifflet, couverture thermique, récipient d'une capacité minimale de 250ml et téléphone portable opérationnel et chargé. L'organisation ne fournit pas de récipients jetables.",
      },
      {
        question: "Combien coûte l'inscription ?",
        answer:
          "Trail 17km : 18€-21€ (ADAC : réduction de 1,50€). Mini Trail 12km : 14€-17€. Marche 10km : 13€-15€. Trail Kids : 5€-7€. Dernière phase jusqu'au 26/03/2026.",
      },
      {
        question: "Qu'est-ce qui est inclus dans l'inscription ?",
        answer:
          "Dossard avec puce de chronométrage, t-shirt technique, ravitaillements, déjeuner (soupe, sandwich au porc, boisson), douches, assurance accidents corporels, transport à l'arrivée et assistance médicale.",
      },
      {
        question: "La course de 17km fait-elle partie d'un circuit ?",
        answer:
          "Oui, la course Trail 17km fait partie du Circuit de District de Trail Running de Coimbra (ADAC). Les athlètes affiliés ADAC bénéficient d'une réduction de 1,50€ à toutes les phases.",
      },
      {
        question: "Quel est l'âge minimum pour participer ?",
        answer:
          "Trail 17km : dès 18 ans. Mini Trail 12km : dès 16 ans. Marche 10km : ouvert à tous. Trail Kids : de 3 à 16 ans.",
      },
      {
        question: "Y a-t-il des pénalités ?",
        answer:
          "Pénalité de 30 minutes : absence d'un élément de matériel obligatoire ou aide extérieure. Disqualification : manquer un poste de contrôle, plus d'un élément obligatoire manquant, quitter le parcours, laisser des déchets ou ne pas assister un athlète en danger.",
      },
      {
        question: "Comment fonctionne le Trail Kids ?",
        answer:
          "Le Trail Kids a lieu le samedi 11 avril. Les courses sont divisées par catégorie d'âge : Bambis (3-6 ans, 400m), Benjamins A (7-9 ans, 600m), Benjamins B (10-11 ans, 600m), Infantils (12-13 ans, 1600m) et Initiés (14-15 ans, 2400m).",
      },
      {
        question: "Puis-je annuler mon inscription ?",
        answer:
          "Pour blessure prouvée avec rapport médical (envoyer à traildoameal@gmail.com) : remboursement de 50% jusqu'au 10/03/2026, 0% après. Annulation de l'événement : 50% jusqu'au 02/02/2026, 25% jusqu'au 16/02/2026, 0% après le 17/02/2026.",
      },
    ],
    de: [
      {
        question: "Wann und wo findet der Ameal Trail 2026 statt?",
        answer:
          "Der Ameal Trail 2026 findet am 11. (Trail Kids) und 12. April 2026 (Hauptrennen) auf dem Fußballplatz Ameal, Coimbra statt. GPS-Koordinaten: 40.1870444, -8.5516997.",
      },
      {
        question: "Welche Rennen gibt es?",
        answer:
          "Es gibt 4 Rennen: Trail 17km (763m D+, ADAC-Circuit), Mini Trail 12km (567m D+), Wanderung 10km und Trail Kids (3-16 Jahre, Distanzen von 400m bis 2400m).",
      },
      {
        question: "Was ist die Pflichtausrüstung?",
        answer:
          "Sichtbare Startnummer vorne, Pfeife, Thermodecke, Behälter mit mindestens 250ml Fassungsvermögen und betriebsbereites geladenes Mobiltelefon. Die Organisation stellt keine Einwegbehälter bereit.",
      },
      {
        question: "Was kostet die Anmeldung?",
        answer:
          "Trail 17km: 18€-21€ (ADAC: 1,50€ Rabatt). Mini Trail 12km: 14€-17€. Wanderung 10km: 13€-15€. Trail Kids: 5€-7€. Letzte Phase bis 26.03.2026.",
      },
      {
        question: "Was ist in der Anmeldung enthalten?",
        answer:
          "Startnummer mit Zeitmess-Chip, technisches T-Shirt, Verpflegungsstellen, Mittagessen (Grünkohlsuppe, Schweinefleisch-Sandwich, Getränk), Duschen, Unfallversicherung, Transport zum Ziel und medizinische Hilfe.",
      },
      {
        question: "Ist das 17km-Rennen Teil eines Circuits?",
        answer:
          "Ja, das Trail 17km-Rennen ist Teil des Bezirks-Trail-Running-Circuits von Coimbra (ADAC). ADAC-Mitglieder erhalten 1,50€ Rabatt in allen Phasen.",
      },
      {
        question: "Was ist das Mindestalter für die Teilnahme?",
        answer:
          "Trail 17km: ab 18 Jahren. Mini Trail 12km: ab 16 Jahren. Wanderung 10km: offen für alle. Trail Kids: 3 bis 16 Jahre.",
      },
      {
        question: "Gibt es Strafen?",
        answer:
          "30-Minuten-Strafe: fehlendes Pflichtausrüstungsteil oder externe Hilfe. Disqualifikation: Kontrollposten verpasst, mehr als 1 Pflichtteil fehlend, Strecke verlassen, Müll hinterlassen oder einem Athleten in Not nicht helfen.",
      },
      {
        question: "Wie funktioniert der Trail Kids?",
        answer:
          "Trail Kids findet am Samstag, 11. April statt. Rennen nach Altersgruppen: Bambis (3-6 Jahre, 400m), Benjamins A (7-9 Jahre, 600m), Benjamins B (10-11 Jahre, 600m), Infantis (12-13 Jahre, 1600m) und Iniciados (14-15 Jahre, 2400m).",
      },
      {
        question: "Kann ich meine Anmeldung stornieren?",
        answer:
          "Bei nachgewiesener Verletzung mit ärztlichem Bericht (senden an traildoameal@gmail.com): 50% Rückerstattung bis 10.03.2026, 0% danach. Bei Absage der Veranstaltung: 50% bis 02.02.2026, 25% bis 16.02.2026, 0% nach 17.02.2026.",
      },
    ],
    it: [
      {
        question: "Quando e dove si svolge l'Ameal Trail 2026?",
        answer:
          "L'Ameal Trail 2026 si svolge l'11 (Trail Kids) e 12 aprile 2026 (gare principali), al Campo di Calcio di Ameal, Coimbra. Coordinate GPS: 40.1870444, -8.5516997.",
      },
      {
        question: "Quali sono le gare disponibili?",
        answer:
          "Ci sono 4 gare: Trail 17km (763m D+, Circuito ADAC), Mini Trail 12km (567m D+), Camminata 10km e Trail Kids (3-16 anni, distanze da 400m a 2400m).",
      },
      {
        question: "Qual è il materiale obbligatorio?",
        answer:
          "Pettorale visibile davanti, fischietto, coperta termica, recipiente con capacità minima di 250ml e telefono cellulare operativo e carico. L'organizzazione non fornisce recipienti usa e getta.",
      },
      {
        question: "Quanto costa l'iscrizione?",
        answer:
          "Trail 17km: 18€-21€ (ADAC: sconto di 1,50€). Mini Trail 12km: 14€-17€. Camminata 10km: 13€-15€. Trail Kids: 5€-7€. Ultima fase fino al 26/03/2026.",
      },
      {
        question: "Cosa è incluso nell'iscrizione?",
        answer:
          "Pettorale con chip di cronometraggio, t-shirt tecnica, ristori, pranzo (zuppa di cavolo, panino di maiale, bevanda), docce, assicurazione infortuni personali, trasporto all'arrivo e assistenza medica.",
      },
      {
        question: "La gara di 17km fa parte di un circuito?",
        answer:
          "Sì, la gara Trail 17km fa parte del Circuito Distrettuale di Trail Running di Coimbra (ADAC). Gli atleti affiliati ADAC beneficiano di uno sconto di 1,50€ in tutte le fasi.",
      },
      {
        question: "Qual è l'età minima per partecipare?",
        answer:
          "Trail 17km: dai 18 anni. Mini Trail 12km: dai 16 anni. Camminata 10km: aperta a tutti. Trail Kids: dai 3 ai 16 anni.",
      },
      {
        question: "Ci sono penalità?",
        answer:
          "Penalità di 30 minuti: mancanza di 1 elemento obbligatorio o aiuto esterno. Squalifica: mancato passaggio a un posto di controllo, più di 1 elemento obbligatorio mancante, uscire dal percorso, lasciare rifiuti o non soccorrere un atleta in pericolo.",
      },
      {
        question: "Come funziona il Trail Kids?",
        answer:
          "Il Trail Kids si svolge sabato 11 aprile. Le gare sono divise per età: Bambis (3-6 anni, 400m), Benjamins A (7-9 anni, 600m), Benjamins B (10-11 anni, 600m), Infantili (12-13 anni, 1600m) e Iniziati (14-15 anni, 2400m).",
      },
      {
        question: "Posso cancellare la mia iscrizione?",
        answer:
          "Per infortunio comprovato con referto medico (inviare a traildoameal@gmail.com): rimborso del 50% fino al 10/03/2026, 0% dopo. Cancellazione dell'evento: 50% fino al 02/02/2026, 25% fino al 16/02/2026, 0% dopo il 17/02/2026.",
      },
    ],
  };

  // ──────────────────────────────────────────────────────────────────────────
  // CREATE EVENT
  // ──────────────────────────────────────────────────────────────────────────

  const event = await prisma.event.create({
    data: {
      slug: eventSlug,
      title: "Ameal Trail 2026",
      description:
        "Ameal Trail 2026 - Trail Running no Ameal, Coimbra. Evento integrado no Circuito Distrital de Trail Running de Coimbra (ADAC). Trail 17km, Mini Trail 12km, Caminhada 10km e Trail Kids. Organizado pela ARDA.",
      startDate: eventStartDate,
      endDate: eventEndDate,
      city: "Ameal, Coimbra",
      country: "Portugal",
      sportTypes: [SportType.TRAIL],
      isFeatured: false,
      registrationDeadline: new Date("2026-03-26T23:59:59.000Z"),
      latitude: 40.1870444,
      longitude: -8.5516997,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=40.1870444,-8.5516997",
      imageUrl: "",
      externalUrl: "https://stopandgo.com.pt/",
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // ──────────────────────────────────────────────────────────────────────────
  // CREATE TRANSLATIONS (ALL 6 LANGUAGES)
  // ──────────────────────────────────────────────────────────────────────────

  console.log("🌍 Creating translations for all 6 languages...");
  const languages: Language[] = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  for (const lang of languages) {
    const langKey = lang as string;
    const t = translations[langKey];
    await prisma.eventTranslation.create({
      data: {
        eventId: event.id,
        language: lang,
        title: t.title,
        description: t.description,
        city: t.city,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      },
    });
    console.log(`   ✅ Created ${lang.toUpperCase()} translation`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // DELETE EXISTING PRICING PHASES (idempotency)
  // ──────────────────────────────────────────────────────────────────────────

  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  // ──────────────────────────────────────────────────────────────────────────
  // CREATE VARIANTS AND PRICING PHASES
  // ──────────────────────────────────────────────────────────────────────────

  const variants: VariantData[] = [
    {
      name: "Trail 17 km",
      distanceKm: 17,
      elevationGainM: 763,
      elevationLossM: 763,
      startTime: "09:00",
      startDate: new Date("2026-04-12T09:00:00.000Z"),
      mountainLevel: 2,
      currency: Currency.EUR,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-01T00:00:00.000Z"),
          endDate: new Date("2025-12-01T23:59:59.000Z"),
          price: 18.0,
          currency: Currency.EUR,
          note: "ADAC: 16,50€",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-12-02T00:00:00.000Z"),
          endDate: new Date("2026-02-28T23:59:59.000Z"),
          price: 19.0,
          currency: Currency.EUR,
          note: "ADAC: 17,50€",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-03-01T00:00:00.000Z"),
          endDate: new Date("2026-03-26T23:59:59.000Z"),
          price: 21.0,
          currency: Currency.EUR,
          note: "ADAC: 19,50€",
        },
      ],
    },
    {
      name: "Mini Trail 12 km",
      distanceKm: 12,
      elevationGainM: 567,
      elevationLossM: 567,
      startTime: "09:30",
      startDate: new Date("2026-04-12T09:30:00.000Z"),
      mountainLevel: 1,
      currency: Currency.EUR,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-01T00:00:00.000Z"),
          endDate: new Date("2025-12-01T23:59:59.000Z"),
          price: 14.0,
          currency: Currency.EUR,
          note: null,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-12-02T00:00:00.000Z"),
          endDate: new Date("2026-02-28T23:59:59.000Z"),
          price: 15.0,
          currency: Currency.EUR,
          note: null,
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-03-01T00:00:00.000Z"),
          endDate: new Date("2026-03-26T23:59:59.000Z"),
          price: 17.0,
          currency: Currency.EUR,
          note: null,
        },
      ],
    },
    {
      name: "Caminhada 10 km",
      distanceKm: 10,
      startTime: "09:40",
      startDate: new Date("2026-04-12T09:40:00.000Z"),
      currency: Currency.EUR,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-01T00:00:00.000Z"),
          endDate: new Date("2025-12-01T23:59:59.000Z"),
          price: 13.0,
          currency: Currency.EUR,
          note: null,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-12-02T00:00:00.000Z"),
          endDate: new Date("2026-02-28T23:59:59.000Z"),
          price: 14.0,
          currency: Currency.EUR,
          note: null,
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-03-01T00:00:00.000Z"),
          endDate: new Date("2026-03-26T23:59:59.000Z"),
          price: 15.0,
          currency: Currency.EUR,
          note: null,
        },
      ],
    },
    {
      name: "Trail Kids",
      distanceKm: 2.4,
      startTime: "16:30",
      startDate: new Date("2026-04-11T16:30:00.000Z"),
      currency: Currency.EUR,
      pricingPhases: [
        {
          name: "1ª e 2ª Fases",
          startDate: new Date("2025-10-01T00:00:00.000Z"),
          endDate: new Date("2026-02-28T23:59:59.000Z"),
          price: 5.0,
          currency: Currency.EUR,
          note: "Idades: 3-16 anos",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-03-01T00:00:00.000Z"),
          endDate: new Date("2026-03-26T23:59:59.000Z"),
          price: 7.0,
          currency: Currency.EUR,
          note: "Idades: 3-16 anos",
        },
      ],
    },
  ];

  console.log("💰 Creating variants and pricing phases...");

  for (const variantData of variants) {
    const { pricingPhases, ...variantInfo } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`✅ Created variant: ${variant.name}`);

    // Create pricing phases linked to eventId (NOT variantId)
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id, // ✅ CORRECT: linked to eventId
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
          note: phase.note,
        },
      });
    }

    console.log(`   - Created ${pricingPhases.length} pricing phases`);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // CREATE FAQs (ALL 6 LANGUAGES)
  // ──────────────────────────────────────────────────────────────────────────

  console.log("❓ Creating FAQs with translations for all 6 languages...");

  const ptFaqs = faqs["pt"];
  for (let i = 0; i < ptFaqs.length; i++) {
    const faq = await prisma.eventFAQ.create({
      data: {
        eventId: event.id,
        question: ptFaqs[i].question,
        answer: ptFaqs[i].answer,
        order: i + 1,
      },
    });

    // Create translations for all 6 languages
    for (const lang of languages) {
      const langKey = lang as string;
      const langFaq = faqs[langKey][i];

      await prisma.eventFAQTranslation.create({
        data: {
          faqId: faq.id,
          language: lang,
          question: langFaq.question,
          answer: langFaq.answer,
        },
      });
    }

    console.log(`   ✅ Created FAQ ${i + 1} with all 6 language translations`);
  }

  console.log("✅ Ameal Trail 2026 seed completed successfully!");
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedAmealTrail2026()
    .catch((e) => {
      console.error("❌ Error seeding Ameal Trail 2026:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
