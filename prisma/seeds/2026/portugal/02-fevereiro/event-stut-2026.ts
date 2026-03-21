import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedStut2026() {
  console.log("🏔️ Seeding 11ª STUT - Santo Thyrso Ultra Trilhos 2026...");

  // Base event data
  const eventSlug = "stut-santo-tirso-2026";
  const eventStartDate = new Date("2026-02-15T08:30:00Z");
  const eventEndDate = new Date("2026-02-15T17:30:00Z");

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

  // Translations for ALL 6 languages
  const translations = {
    pt: {
      title: "11ª STUT - Santo Thyrso Ultra Trilhos 2026",
      description: `**🏔️ 11ª Edição STUT - Santo Thyrso Ultra Trilhos 2026**

A **11ª Edição do STUT - Santo Thyrso Ultra Trilhos** realiza-se nos dias **14 e 15 de fevereiro de 2026** em **Santo Tirso**, distrito do **Porto**. Organizado pelo **NAST - Núcleo Associativo de Santo Tirso** e **Câmara Municipal de Santo Tirso**.

Este trail desenvolve-se pelos montes circundantes dos concelhos de **Santo Tirso** e **Paços de Ferreira**, oferecendo provas para todos os níveis, incluindo trail kids para as crianças.

---

## 🏔️ Provas Disponíveis

### **STUT Ultra** - 44 km
- **Desnível Positivo:** 2300m D+
- **Tempo Limite:** 09h00
- **Idade Mínima:** 20 anos
- **Partida:** 08h30
- **Vagas:** 300 participantes

### **STTL - Trail Longo** - 32 km
- **Desnível Positivo:** 1600m D+
- **Tempo Limite:** 08h30
- **Idade Mínima:** 20 anos
- **Partida:** 09h00
- **Vagas:** 500 participantes

### **STTC - Trail Curto** - 17 km
- **Desnível Positivo:** 800m D+
- **Tempo Limite:** 07h00
- **Idade Mínima:** 18 anos
- **Partida:** 09h30
- **Vagas:** 700 participantes

### **Caminhada** - 10 km
- **Tempo Limite:** 06h50
- **Sem idade mínima** (crianças < 14 anos acompanhadas)
- **Partida:** 09h40
- **Vagas:** 400 participantes
- **Carácter não competitivo**

### **STUT Kids** - Sábado 14 Fevereiro
- **Local:** Parque Urbano de Geão
- **Horário:** 15h00
- **Idade:** 5 aos 17 anos
- **Inscrição:** Gratuita mas obrigatória
- **Vagas:** 100 participantes

**Distâncias STUT Kids:**
- 5-7 anos: 500m
- 8-10 anos: 1000m
- 11-13 anos: 1500m
- 14-17 anos: 2000m

---

## 📍 Local e Horários

**Partida e Chegada:** Piscina/Pavilhão Municipal de Santo Tirso

**Secretariado (Sala de Imprensa do Pavilhão Desportivo):**

**Sábado 14/02:**
- 10h00 - 12h30 e 14h00 - 20h00 (STUT, STTL, STTC, Caminhada)
- 14h00 - Abertura secretariado STUT Kids (Parque Urbano de Geão)

**Domingo 15/02:**
- 07h00 - 09h00 (STUT, STTL, STTC)
- 07h00 - 09h20 (Caminhada)

**Partidas Domingo 15/02:**
- 08h30 - STUT Ultra 44km
- 09h00 - STTL Trail Longo 32km
- 09h30 - STTC Trail Curto 17km
- 09h40 - Caminhada

**Entrega de Prémios:**
- 14h30 - STTC
- 15h00 - STTL
- 15h30 - STUT
- 17h30 - Encerramento da Meta

---

## 🎯 Destaques

✅ T-shirt oficial do evento  
✅ Medalha de finisher (STUT, STTL, STTC, STUT Kids)  
✅ Seguro de acidentes pessoais e responsabilidade civil  
✅ Abastecimentos sólidos e líquidos  
✅ Reforço alimentar no final  
✅ Cronometragem eletrónica com chip  
✅ Duche nos balneários do Pavilhão Municipal  
✅ Transporte de recolha em caso de desistência  
✅ Troféus aos 3 primeiros por escalão M/F  
✅ Troféus às 3 melhores equipas

---

## 💰 Preços

**1ª Fase (até 18 Janeiro 2026):**
- STUT Ultra 44km: €35,00
- STTL Trail Longo 32km: €27,00
- STTC Trail Curto 17km: €17,00
- Caminhada 10km: €10,00
- STUT Kids: Grátis

**2ª Fase (até 8 Fevereiro 2026):**
- STUT Ultra 44km: €40,00
- STTL Trail Longo 32km: €32,00
- STTC Trail Curto 17km: €20,00
- Caminhada 10km: €12,00
- STUT Kids: Grátis

**Data limite de inscrição:** 8 de fevereiro de 2026

---

## 📋 Material Obrigatório

**STUT, STTL e STTC:**
✅ Manta térmica (obrigatório)  
✅ Telemóvel operacional (obrigatório)  
✅ Apito (obrigatório)

**Material Recomendado:**
- Corta vento / Impermeável
- Depósito de água
- Luvas e gorro / boné
- Frontal
- Copo dobrável (não há copos nos abastecimentos)

**⚠️ Penalização por falta de material obrigatório:** 1 hora

---

## 🏆 Prémios

**STUT Ultra, STTL e STTC:**
- Troféu aos 3 primeiros classificados da geral M/F
- Troféu aos 3 primeiros classificados por escalão M/F
- Troféu às 3 melhores equipas (3 elementos)

**STUT Kids:**
- Medalha de finisher para todos os participantes

**Categorias Etárias:**
- Sub Júnior M/F (18-19 anos)
- Sub23 M/F (20-22 anos)
- Sénior M/F (23-34 anos)
- Vet. M35/F35 (35-39 anos)
- Vet. M40/F40 (40-44 anos)
- Vet. M45/F45 (45-49 anos)
- Vet. M50/F50 (50-54 anos)
- Vet. M55/F55 (55-59 anos)
- Vet. M60/F60 (60+ anos)

---

## 📋 Postos de Abastecimento

**STUT Ultra:** 5 postos de abastecimento  
**STTL Trail Longo:** 4 postos de abastecimento  
**STTC Trail Curto:** 2 postos de abastecimento

⚠️ **Nota:** Água destina-se a encher depósitos próprios. Não há copos nos abastecimentos.

---

## 📞 Contactos

**Organização:** NAST - Núcleo Associativo de Santo Tirso  
**Co-Organização:** Câmara Municipal de Santo Tirso  
**Email:** stut.nast@gmail.com  
**Website:** www.nast.pt | www.myatrp.pt  
**Inscrições:** Stop and Go

---

🏔️ **Vem correr pelos montes de Santo Tirso na 11ª edição do STUT!** 🏃`,
      city: "Santo Tirso",
      metaTitle:
        "11ª STUT - Santo Thyrso Ultra Trilhos 2026 | Santo Tirso | 14-15 Fevereiro",
      metaDescription:
        "11ª STUT - Santo Thyrso Ultra Trilhos a 14-15 de fevereiro de 2026 em Santo Tirso. Provas: Ultra 44km, Trail Longo 32km, Trail Curto 17km, Caminhada 10km e STUT Kids.",
    },
    en: {
      title: "11th STUT - Santo Thyrso Ultra Trails 2026",
      description: `**🏔️ 11th Edition STUT - Santo Thyrso Ultra Trails 2026**

The **11th Edition of STUT - Santo Thyrso Ultra Trails** takes place on **February 14-15, 2026** in **Santo Tirso**, district of **Porto**. Organized by **NAST - Santo Tirso Association Center** and **Santo Tirso Municipality**.

This trail runs through the surrounding mountains of **Santo Tirso** and **Paços de Ferreira** municipalities, offering races for all levels, including trail kids for children.

---

## 🏔️ Available Races

### **STUT Ultra** - 44 km
- **Elevation Gain:** 2300m D+
- **Time Limit:** 09h00
- **Minimum Age:** 20 years
- **Start:** 08:30
- **Capacity:** 300 participants

### **STTL - Long Trail** - 32 km
- **Elevation Gain:** 1600m D+
- **Time Limit:** 08h30
- **Minimum Age:** 20 years
- **Start:** 09:00
- **Capacity:** 500 participants

### **STTC - Short Trail** - 17 km
- **Elevation Gain:** 800m D+
- **Time Limit:** 07h00
- **Minimum Age:** 18 years
- **Start:** 09:30
- **Capacity:** 700 participants

### **Walking Route** - 10 km
- **Time Limit:** 06h50
- **No minimum age** (children < 14 years accompanied)
- **Start:** 09:40
- **Capacity:** 400 participants
- **Non-competitive**

### **STUT Kids** - Saturday February 14
- **Location:** Geão Urban Park
- **Time:** 15:00
- **Age:** 5 to 17 years
- **Registration:** Free but mandatory
- **Capacity:** 100 participants

**STUT Kids Distances:**
- 5-7 years: 500m
- 8-10 years: 1000m
- 11-13 years: 1500m
- 14-17 years: 2000m

---

## 📍 Location and Schedule

**Start and Finish:** Santo Tirso Municipal Pool/Sports Pavilion

**Registration (Sports Pavilion Press Room):**

**Saturday 14/02:**
- 10:00 - 12:30 and 14:00 - 20:00 (STUT, STTL, STTC, Walk)
- 14:00 - STUT Kids registration opens (Geão Urban Park)

**Sunday 15/02:**
- 07:00 - 09:00 (STUT, STTL, STTC)
- 07:00 - 09:20 (Walk)

**Sunday 15/02 Starts:**
- 08:30 - STUT Ultra 44km
- 09:00 - STTL Long Trail 32km
- 09:30 - STTC Short Trail 17km
- 09:40 - Walking Route

**Award Ceremonies:**
- 14:30 - STTC
- 15:00 - STTL
- 15:30 - STUT
- 17:30 - Finish Line Closure

---

## 🎯 Highlights

✅ Official event t-shirt  
✅ Finisher medal (STUT, STTL, STTC, STUT Kids)  
✅ Personal accident and civil liability insurance  
✅ Solid and liquid refreshments  
✅ Final refreshment  
✅ Electronic chip timing  
✅ Showers at Municipal Pavilion changing rooms  
✅ Pickup transport in case of withdrawal  
✅ Trophies to top 3 per category M/F  
✅ Trophies to top 3 teams

---

## 💰 Prices

**Phase 1 (until January 18, 2026):**
- STUT Ultra 44km: €35.00
- STTL Long Trail 32km: €27.00
- STTC Short Trail 17km: €17.00
- Walking Route 10km: €10.00
- STUT Kids: Free

**Phase 2 (until February 8, 2026):**
- STUT Ultra 44km: €40.00
- STTL Long Trail 32km: €32.00
- STTC Short Trail 17km: €20.00
- Walking Route 10km: €12.00
- STUT Kids: Free

**Registration deadline:** February 8, 2026

---

## 📋 Mandatory Equipment

**STUT, STTL and STTC:**
✅ Thermal blanket (mandatory)  
✅ Working mobile phone (mandatory)  
✅ Whistle (mandatory)

**Recommended Equipment:**
- Windbreaker / waterproof jacket
- Water reservoir
- Gloves and cap
- Headlamp
- Foldable cup (no cups at aid stations)

**⚠️ Penalty for missing mandatory equipment:** 1 hour

---

## 🏆 Awards

**STUT Ultra, STTL and STTC:**
- Trophy to top 3 overall M/F
- Trophy to top 3 in each category M/F
- Trophy to top 3 teams (3 members)

**STUT Kids:**
- Finisher medal for all participants

**Age Categories:**
- Sub Junior M/F (18-19 years)
- Sub23 M/F (20-22 years)
- Senior M/F (23-34 years)
- Vet. M35/F35 (35-39 years)
- Vet. M40/F40 (40-44 years)
- Vet. M45/F45 (45-49 years)
- Vet. M50/F50 (50-54 years)
- Vet. M55/F55 (55-59 years)
- Vet. M60/F60 (60+ years)

---

## 📋 Aid Stations

**STUT Ultra:** 5 aid stations  
**STTL Long Trail:** 4 aid stations  
**STTC Short Trail:** 2 aid stations

⚠️ **Note:** Water is for filling personal containers. No cups at aid stations.

---

## 📞 Contacts

**Organization:** NAST - Santo Tirso Association Center  
**Co-Organization:** Santo Tirso Municipality  
**Email:** stut.nast@gmail.com  
**Website:** www.nast.pt | www.myatrp.pt  
**Registration:** Stop and Go

---

🏔️ **Come run through the mountains of Santo Tirso at the 11th edition of STUT!** 🏃`,
      city: "Santo Tirso",
      metaTitle:
        "11th STUT - Santo Thyrso Ultra Trails 2026 | Santo Tirso | 14-15 February",
      metaDescription:
        "11th STUT - Santo Thyrso Ultra Trails on February 14-15, 2026 in Santo Tirso. Races: Ultra 44km, Long Trail 32km, Short Trail 17km, Walk 10km and STUT Kids.",
    },
    es: {
      title: "11ª STUT - Santo Thyrso Ultra Trails 2026",
      description: `**🏔️ 11ª Edición STUT - Santo Thyrso Ultra Trails 2026**

La **11ª Edición del STUT - Santo Thyrso Ultra Trails** se celebra los días **14 y 15 de febrero de 2026** en **Santo Tirso**, distrito de **Oporto**. Organizado por **NAST - Núcleo Asociativo de Santo Tirso** y el **Ayuntamiento de Santo Tirso**.

Este trail se desarrolla por las montañas circundantes de los municipios de **Santo Tirso** y **Paços de Ferreira**, ofreciendo carreras para todos los niveles, incluido trail kids para niños.

---

## 🏔️ Carreras Disponibles

### **STUT Ultra** - 44 km
- **Desnivel Positivo:** 2300m D+
- **Tiempo Límite:** 09h00
- **Edad Mínima:** 20 años
- **Salida:** 08h30
- **Cupo:** 300 participantes

### **STTL - Trail Largo** - 32 km
- **Desnivel Positivo:** 1600m D+
- **Tiempo Límite:** 08h30
- **Edad Mínima:** 20 años
- **Salida:** 09h00
- **Cupo:** 500 participantes

### **STTC - Trail Corto** - 17 km
- **Desnivel Positivo:** 800m D+
- **Tiempo Límite:** 07h00
- **Edad Mínima:** 18 años
- **Salida:** 09h30
- **Cupo:** 700 participantes

### **Caminata** - 10 km
- **Tiempo Límite:** 06h50
- **Sin edad mínima** (niños < 14 años acompañados)
- **Salida:** 09h40
- **Cupo:** 400 participantes
- **No competitiva**

### **STUT Kids** - Sábado 14 Febrero
- **Lugar:** Parque Urbano de Geão
- **Horario:** 15h00
- **Edad:** 5 a 17 años
- **Inscripción:** Gratuita pero obligatoria
- **Cupo:** 100 participantes

**Distancias STUT Kids:**
- 5-7 años: 500m
- 8-10 años: 1000m
- 11-13 años: 1500m
- 14-17 años: 2000m

---

## 📍 Ubicación y Horario

**Salida y Meta:** Piscina/Pabellón Municipal de Santo Tirso

**Secretaría (Sala de Prensa del Pabellón Deportivo):**

**Sábado 14/02:**
- 10h00 - 12h30 y 14h00 - 20h00 (STUT, STTL, STTC, Caminata)
- 14h00 - Apertura secretaría STUT Kids (Parque Urbano de Geão)

**Domingo 15/02:**
- 07h00 - 09h00 (STUT, STTL, STTC)
- 07h00 - 09h20 (Caminata)

**Salidas Domingo 15/02:**
- 08h30 - STUT Ultra 44km
- 09h00 - STTL Trail Largo 32km
- 09h30 - STTC Trail Corto 17km
- 09h40 - Caminata

**Entrega de Premios:**
- 14h30 - STTC
- 15h00 - STTL
- 15h30 - STUT
- 17h30 - Cierre de Meta

---

## 🎯 Destacados

✅ Camiseta oficial del evento  
✅ Medalla finisher (STUT, STTL, STTC, STUT Kids)  
✅ Seguro de accidentes personales y responsabilidad civil  
✅ Avituallamientos sólidos y líquidos  
✅ Refuerzo alimentario final  
✅ Cronometraje electrónico con chip  
✅ Duchas en vestuarios del Pabellón Municipal  
✅ Transporte de recogida en caso de abandono  
✅ Trofeos a los 3 primeros por categoría M/F  
✅ Trofeos a los 3 mejores equipos

---

## 💰 Precios

**Fase 1 (hasta 18 Enero 2026):**
- STUT Ultra 44km: €35,00
- STTL Trail Largo 32km: €27,00
- STTC Trail Corto 17km: €17,00
- Caminata 10km: €10,00
- STUT Kids: Gratis

**Fase 2 (hasta 8 Febrero 2026):**
- STUT Ultra 44km: €40,00
- STTL Trail Largo 32km: €32,00
- STTC Trail Corto 17km: €20,00
- Caminata 10km: €12,00
- STUT Kids: Gratis

**Fecha límite de inscripción:** 8 de febrero de 2026

---

## 📋 Material Obligatorio

**STUT, STTL y STTC:**
✅ Manta térmica (obligatorio)  
✅ Teléfono móvil operativo (obligatorio)  
✅ Silbato (obligatorio)

**Material Recomendado:**
- Cortavientos / Impermeable
- Depósito de agua
- Guantes y gorra
- Frontal
- Vaso plegable (no hay vasos en avituallamientos)

**⚠️ Penalización por falta de material obligatorio:** 1 hora

---

## 🏆 Premios

**STUT Ultra, STTL y STTC:**
- Trofeo a los 3 primeros clasificados generales M/F
- Trofeo a los 3 primeros clasificados por categoría M/F
- Trofeo a los 3 mejores equipos (3 miembros)

**STUT Kids:**
- Medalla finisher para todos los participantes

**Categorías por Edad:**
- Sub Júnior M/F (18-19 años)
- Sub23 M/F (20-22 años)
- Sénior M/F (23-34 años)
- Vet. M35/F35 (35-39 años)
- Vet. M40/F40 (40-44 años)
- Vet. M45/F45 (45-49 años)
- Vet. M50/F50 (50-54 años)
- Vet. M55/F55 (55-59 años)
- Vet. M60/F60 (60+ años)

---

## 📋 Puestos de Avituallamiento

**STUT Ultra:** 5 puestos de avituallamiento  
**STTL Trail Largo:** 4 puestos de avituallamiento  
**STTC Trail Corto:** 2 puestos de avituallamiento

⚠️ **Nota:** Agua para rellenar depósitos propios. No hay vasos en avituallamientos.

---

## 📞 Contactos

**Organización:** NAST - Núcleo Asociativo de Santo Tirso  
**Co-Organización:** Ayuntamiento de Santo Tirso  
**Email:** stut.nast@gmail.com  
**Website:** www.nast.pt | www.myatrp.pt  
**Inscripciones:** Stop and Go

---

🏔️ **¡Ven a correr por las montañas de Santo Tirso en la 11ª edición del STUT!** 🏃`,
      city: "Santo Tirso",
      metaTitle:
        "11ª STUT - Santo Thyrso Ultra Trails 2026 | Santo Tirso | 14-15 Febrero",
      metaDescription:
        "11ª STUT - Santo Thyrso Ultra Trails el 14-15 de febrero de 2026 en Santo Tirso. Carreras: Ultra 44km, Trail Largo 32km, Trail Corto 17km, Caminata 10km y STUT Kids.",
    },
    fr: {
      title: "11ème STUT - Santo Thyrso Ultra Trails 2026",
      description: `**🏔️ 11ème Édition STUT - Santo Thyrso Ultra Trails 2026**

La **11ème Édition du STUT - Santo Thyrso Ultra Trails** se déroule les **14 et 15 février 2026** à **Santo Tirso**, district de **Porto**. Organisée par **NAST - Centre Associatif de Santo Tirso** et la **Municipalité de Santo Tirso**.

Ce trail parcourt les montagnes environnantes des municipalités de **Santo Tirso** et **Paços de Ferreira**, offrant des courses pour tous les niveaux, y compris trail kids pour les enfants.

---

## 🏔️ Courses Disponibles

### **STUT Ultra** - 44 km
- **Dénivelé Positif:** 2300m D+
- **Temps Limite:** 09h00
- **Âge Minimum:** 20 ans
- **Départ:** 08h30
- **Capacité:** 300 participants

### **STTL - Trail Long** - 32 km
- **Dénivelé Positif:** 1600m D+
- **Temps Limite:** 08h30
- **Âge Minimum:** 20 ans
- **Départ:** 09h00
- **Capacité:** 500 participants

### **STTC - Trail Court** - 17 km
- **Dénivelé Positif:** 800m D+
- **Temps Limite:** 07h00
- **Âge Minimum:** 18 ans
- **Départ:** 09h30
- **Capacité:** 700 participants

### **Randonnée** - 10 km
- **Temps Limite:** 06h50
- **Sans âge minimum** (enfants < 14 ans accompagnés)
- **Départ:** 09h40
- **Capacité:** 400 participants
- **Non compétitif**

### **STUT Kids** - Samedi 14 Février
- **Lieu:** Parc Urbain de Geão
- **Horaire:** 15h00
- **Âge:** 5 à 17 ans
- **Inscription:** Gratuite mais obligatoire
- **Capacité:** 100 participants

**Distances STUT Kids:**
- 5-7 ans: 500m
- 8-10 ans: 1000m
- 11-13 ans: 1500m
- 14-17 ans: 2000m

---

## 📍 Lieu et Horaires

**Départ et Arrivée:** Piscine/Pavillon Municipal de Santo Tirso

**Secrétariat (Salle de Presse du Pavillon Sportif):**

**Samedi 14/02:**
- 10h00 - 12h30 et 14h00 - 20h00 (STUT, STTL, STTC, Randonnée)
- 14h00 - Ouverture secrétariat STUT Kids (Parc Urbain de Geão)

**Dimanche 15/02:**
- 07h00 - 09h00 (STUT, STTL, STTC)
- 07h00 - 09h20 (Randonnée)

**Départs Dimanche 15/02:**
- 08h30 - STUT Ultra 44km
- 09h00 - STTL Trail Long 32km
- 09h30 - STTC Trail Court 17km
- 09h40 - Randonnée

**Cérémonies de Remise des Prix:**
- 14h30 - STTC
- 15h00 - STTL
- 15h30 - STUT
- 17h30 - Fermeture de la Ligne d'Arrivée

---

## 🎯 Points Forts

✅ T-shirt officiel de l'événement  
✅ Médaille finisher (STUT, STTL, STTC, STUT Kids)  
✅ Assurance accidents personnels et responsabilité civile  
✅ Ravitaillements solides et liquides  
✅ Rafraîchissement final  
✅ Chronométrage électronique par puce  
✅ Douches aux vestiaires du Pavillon Municipal  
✅ Transport de retour en cas d'abandon  
✅ Trophées aux 3 premiers par catégorie H/F  
✅ Trophées aux 3 meilleures équipes

---

## 💰 Prix

**Phase 1 (jusqu'au 18 Janvier 2026):**
- STUT Ultra 44km: €35,00
- STTL Trail Long 32km: €27,00
- STTC Trail Court 17km: €17,00
- Randonnée 10km: €10,00
- STUT Kids: Gratuit

**Phase 2 (jusqu'au 8 Février 2026):**
- STUT Ultra 44km: €40,00
- STTL Trail Long 32km: €32,00
- STTC Trail Court 17km: €20,00
- Randonnée 10km: €12,00
- STUT Kids: Gratuit

**Date limite d'inscription:** 8 février 2026

---

## 📋 Équipement Obligatoire

**STUT, STTL et STTC:**
✅ Couverture thermique (obligatoire)  
✅ Téléphone portable opérationnel (obligatoire)  
✅ Sifflet (obligatoire)

**Équipement Recommandé:**
- Coupe-vent / Imperméable
- Réservoir d'eau
- Gants et bonnet / casquette
- Lampe frontale
- Gobelet pliable (pas de gobelets aux ravitaillements)

**⚠️ Pénalité pour équipement obligatoire manquant:** 1 heure

---

## 🏆 Récompenses

**STUT Ultra, STTL et STTC:**
- Trophée aux 3 premiers classés général H/F
- Trophée aux 3 premiers classés par catégorie H/F
- Trophée aux 3 meilleures équipes (3 membres)

**STUT Kids:**
- Médaille finisher pour tous les participants

**Catégories d'Âge:**
- Sub Junior H/F (18-19 ans)
- Sub23 H/F (20-22 ans)
- Senior H/F (23-34 ans)
- Vét. M35/F35 (35-39 ans)
- Vét. M40/F40 (40-44 ans)
- Vét. M45/F45 (45-49 ans)
- Vét. M50/F50 (50-54 ans)
- Vét. M55/F55 (55-59 ans)
- Vét. M60/F60 (60+ ans)

---

## 📋 Postes de Ravitaillement

**STUT Ultra:** 5 postes de ravitaillement  
**STTL Trail Long:** 4 postes de ravitaillement  
**STTC Trail Court:** 2 postes de ravitaillement

⚠️ **Note:** L'eau est pour remplir les contenants personnels. Pas de gobelets aux ravitaillements.

---

## 📞 Contacts

**Organisation:** NAST - Centre Associatif de Santo Tirso  
**Co-Organisation:** Municipalité de Santo Tirso  
**Email:** stut.nast@gmail.com  
**Site Web:** www.nast.pt | www.myatrp.pt  
**Inscriptions:** Stop and Go

---

🏔️ **Venez courir dans les montagnes de Santo Tirso à la 11ème édition du STUT!** 🏃`,
      city: "Santo Tirso",
      metaTitle:
        "11ème STUT - Santo Thyrso Ultra Trails 2026 | Santo Tirso | 14-15 Février",
      metaDescription:
        "11ème STUT - Santo Thyrso Ultra Trails les 14-15 février 2026 à Santo Tirso. Courses: Ultra 44km, Trail Long 32km, Trail Court 17km, Randonnée 10km et STUT Kids.",
    },
    de: {
      title: "11. STUT - Santo Thyrso Ultra Trails 2026",
      description: `**🏔️ 11. Ausgabe STUT - Santo Thyrso Ultra Trails 2026**

Die **11. Ausgabe des STUT - Santo Thyrso Ultra Trails** findet am **14. und 15. Februar 2026** in **Santo Tirso**, Bezirk **Porto**, statt. Organisiert von **NAST - Santo Tirso Vereinszentrum** und der **Gemeinde Santo Tirso**.

Dieser Trail führt durch die umliegenden Berge der Gemeinden **Santo Tirso** und **Paços de Ferreira** und bietet Läufe für alle Niveaus, einschließlich Trail Kids für Kinder.

---

## 🏔️ Verfügbare Läufe

### **STUT Ultra** - 44 km
- **Höhenunterschied:** 2300m D+
- **Zeitlimit:** 09h00
- **Mindestalter:** 20 Jahre
- **Start:** 08h30
- **Kapazität:** 300 Teilnehmer

### **STTL - Langer Trail** - 32 km
- **Höhenunterschied:** 1600m D+
- **Zeitlimit:** 08h30
- **Mindestalter:** 20 Jahre
- **Start:** 09h00
- **Kapazität:** 500 Teilnehmer

### **STTC - Kurzer Trail** - 17 km
- **Höhenunterschied:** 800m D+
- **Zeitlimit:** 07h00
- **Mindestalter:** 18 Jahre
- **Start:** 09h30
- **Kapazität:** 700 Teilnehmer

### **Wanderung** - 10 km
- **Zeitlimit:** 06h50
- **Kein Mindestalter** (Kinder < 14 Jahre begleitet)
- **Start:** 09h40
- **Kapazität:** 400 Teilnehmer
- **Nicht kompetitiv**

### **STUT Kids** - Samstag 14. Februar
- **Ort:** Geão Stadtpark
- **Uhrzeit:** 15h00
- **Alter:** 5 bis 17 Jahre
- **Anmeldung:** Kostenlos aber obligatorisch
- **Kapazität:** 100 Teilnehmer

**STUT Kids Distanzen:**
- 5-7 Jahre: 500m
- 8-10 Jahre: 1000m
- 11-13 Jahre: 1500m
- 14-17 Jahre: 2000m

---

## 📍 Ort und Zeitplan

**Start und Ziel:** Santo Tirso Schwimmbad/Gemeindehalle

**Sekretariat (Presseraum der Sporthalle):**

**Samstag 14.02:**
- 10:00 - 12:30 und 14:00 - 20:00 (STUT, STTL, STTC, Wanderung)
- 14:00 - STUT Kids Sekretariat öffnet (Geão Stadtpark)

**Sonntag 15.02:**
- 07:00 - 09:00 (STUT, STTL, STTC)
- 07:00 - 09:20 (Wanderung)

**Sonntag 15.02 Starts:**
- 08:30 - STUT Ultra 44km
- 09:00 - STTL Langer Trail 32km
- 09:30 - STTC Kurzer Trail 17km
- 09:40 - Wanderung

**Preisverleihungen:**
- 14:30 - STTC
- 15:00 - STTL
- 15:30 - STUT
- 17:30 - Zielschluss

---

## 🎯 Highlights

✅ Offizielles Event-T-Shirt  
✅ Finisher-Medaille (STUT, STTL, STTC, STUT Kids)  
✅ Personen- und Haftpflichtversicherung  
✅ Feste und flüssige Verpflegung  
✅ Abschlussverpflegung  
✅ Elektronische Chip-Zeitmessung  
✅ Duschen in den Umkleideräumen der Gemeindehalle  
✅ Abholtransport bei Aufgabe  
✅ Trophäen für Top 3 pro Kategorie M/F  
✅ Trophäen für Top 3 Teams

---

## 💰 Preise

**Phase 1 (bis 18. Januar 2026):**
- STUT Ultra 44km: €35,00
- STTL Langer Trail 32km: €27,00
- STTC Kurzer Trail 17km: €17,00
- Wanderung 10km: €10,00
- STUT Kids: Gratis

**Phase 2 (bis 8. Februar 2026):**
- STUT Ultra 44km: €40,00
- STTL Langer Trail 32km: €32,00
- STTC Kurzer Trail 17km: €20,00
- Wanderung 10km: €12,00
- STUT Kids: Gratis

**Anmeldeschluss:** 8. Februar 2026

---

## 📋 Obligatorische Ausrüstung

**STUT, STTL und STTC:**
✅ Thermodecke (obligatorisch)  
✅ Funktionierendes Mobiltelefon (obligatorisch)  
✅ Pfeife (obligatorisch)

**Empfohlene Ausrüstung:**
- Windjacke / Regenjacke
- Wasserbehälter
- Handschuhe und Mütze / Kappe
- Stirnlampe
- Faltbecher (keine Becher an Verpflegungsstationen)

**⚠️ Strafe für fehlende obligatorische Ausrüstung:** 1 Stunde

---

## 🏆 Preise

**STUT Ultra, STTL und STTC:**
- Trophäe für Top 3 Gesamt M/F
- Trophäe für Top 3 pro Kategorie M/F
- Trophäe für Top 3 Teams (3 Mitglieder)

**STUT Kids:**
- Finisher-Medaille für alle Teilnehmer

**Alterskategorien:**
- Sub Junior M/F (18-19 Jahre)
- Sub23 M/F (20-22 Jahre)
- Senior M/F (23-34 Jahre)
- Vet. M35/F35 (35-39 Jahre)
- Vet. M40/F40 (40-44 Jahre)
- Vet. M45/F45 (45-49 Jahre)
- Vet. M50/F50 (50-54 Jahre)
- Vet. M55/F55 (55-59 Jahre)
- Vet. M60/F60 (60+ Jahre)

---

## 📋 Verpflegungsstationen

**STUT Ultra:** 5 Verpflegungsstationen  
**STTL Langer Trail:** 4 Verpflegungsstationen  
**STTC Kurzer Trail:** 2 Verpflegungsstationen

⚠️ **Hinweis:** Wasser zum Befüllen persönlicher Behälter. Keine Becher an Verpflegungsstationen.

---

## 📞 Kontakte

**Organisation:** NAST - Santo Tirso Vereinszentrum  
**Ko-Organisation:** Gemeinde Santo Tirso  
**E-Mail:** stut.nast@gmail.com  
**Website:** www.nast.pt | www.myatrp.pt  
**Anmeldung:** Stop and Go

---

🏔️ **Komm und laufe durch die Berge von Santo Tirso bei der 11. Ausgabe des STUT!** 🏃`,
      city: "Santo Tirso",
      metaTitle:
        "11. STUT - Santo Thyrso Ultra Trails 2026 | Santo Tirso | 14.-15. Februar",
      metaDescription:
        "11. STUT - Santo Thyrso Ultra Trails am 14.-15. Februar 2026 in Santo Tirso. Läufe: Ultra 44km, Langer Trail 32km, Kurzer Trail 17km, Wanderung 10km und STUT Kids.",
    },
    it: {
      title: "11° STUT - Santo Thyrso Ultra Trails 2026",
      description: `**🏔️ 11° Edizione STUT - Santo Thyrso Ultra Trails 2026**

L'**11° Edizione dello STUT - Santo Thyrso Ultra Trails** si svolge il **14-15 febbraio 2026** a **Santo Tirso**, distretto di **Porto**. Organizzato da **NAST - Centro Associativo di Santo Tirso** e dal **Comune di Santo Tirso**.

Questo trail si sviluppa attraverso le montagne circostanti dei comuni di **Santo Tirso** e **Paços de Ferreira**, offrendo gare per tutti i livelli, incluso trail kids per bambini.

---

## 🏔️ Gare Disponibili

### **STUT Ultra** - 44 km
- **Dislivello Positivo:** 2300m D+
- **Tempo Limite:** 09h00
- **Età Minima:** 20 anni
- **Partenza:** 08h30
- **Capacità:** 300 partecipanti

### **STTL - Trail Lungo** - 32 km
- **Dislivello Positivo:** 1600m D+
- **Tempo Limite:** 08h30
- **Età Minima:** 20 anni
- **Partenza:** 09h00
- **Capacità:** 500 partecipanti

### **STTC - Trail Corto** - 17 km
- **Dislivello Positivo:** 800m D+
- **Tempo Limite:** 07h00
- **Età Minima:** 18 anni
- **Partenza:** 09h30
- **Capacità:** 700 partecipanti

### **Camminata** - 10 km
- **Tempo Limite:** 06h50
- **Nessuna età minima** (bambini < 14 anni accompagnati)
- **Partenza:** 09h40
- **Capacità:** 400 partecipanti
- **Non competitiva**

### **STUT Kids** - Sabato 14 Febbraio
- **Luogo:** Parco Urbano di Geão
- **Orario:** 15h00
- **Età:** 5-17 anni
- **Iscrizione:** Gratuita ma obbligatoria
- **Capacità:** 100 partecipanti

**Distanze STUT Kids:**
- 5-7 anni: 500m
- 8-10 anni: 1000m
- 11-13 anni: 1500m
- 14-17 anni: 2000m

---

## 📍 Luogo e Orari

**Partenza e Arrivo:** Piscina/Padiglione Comunale di Santo Tirso

**Segreteria (Sala Stampa del Padiglione Sportivo):**

**Sabato 14/02:**
- 10h00 - 12h30 e 14h00 - 20h00 (STUT, STTL, STTC, Camminata)
- 14h00 - Apertura segreteria STUT Kids (Parco Urbano di Geão)

**Domenica 15/02:**
- 07h00 - 09h00 (STUT, STTL, STTC)
- 07h00 - 09h20 (Camminata)

**Partenze Domenica 15/02:**
- 08h30 - STUT Ultra 44km
- 09h00 - STTL Trail Lungo 32km
- 09h30 - STTC Trail Corto 17km
- 09h40 - Camminata

**Premiazioni:**
- 14h30 - STTC
- 15h00 - STTL
- 15h30 - STUT
- 17h30 - Chiusura Traguardo

---

## 🎯 Punti Salienti

✅ T-shirt ufficiale dell'evento  
✅ Medaglia finisher (STUT, STTL, STTC, STUT Kids)  
✅ Assicurazione infortuni e responsabilità civile  
✅ Ristori solidi e liquidi  
✅ Ristoro finale  
✅ Cronometraggio elettronico con chip  
✅ Docce negli spogliatoi del Padiglione Comunale  
✅ Trasporto di ritiro in caso di ritiro  
✅ Trofei ai primi 3 per categoria M/F  
✅ Trofei alle 3 migliori squadre

---

## 💰 Prezzi

**Fase 1 (fino al 18 Gennaio 2026):**
- STUT Ultra 44km: €35,00
- STTL Trail Lungo 32km: €27,00
- STTC Trail Corto 17km: €17,00
- Camminata 10km: €10,00
- STUT Kids: Gratis

**Fase 2 (fino all'8 Febbraio 2026):**
- STUT Ultra 44km: €40,00
- STTL Trail Lungo 32km: €32,00
- STTC Trail Corto 17km: €20,00
- Camminata 10km: €12,00
- STUT Kids: Gratis

**Scadenza iscrizioni:** 8 febbraio 2026

---

## 📋 Attrezzatura Obbligatoria

**STUT, STTL e STTC:**
✅ Coperta termica (obbligatorio)  
✅ Telefono cellulare funzionante (obbligatorio)  
✅ Fischietto (obbligatorio)

**Attrezzatura Consigliata:**
- Giacca antivento / Impermeabile
- Serbatoio d'acqua
- Guanti e berretto / cappello
- Lampada frontale
- Bicchiere pieghevole (nessun bicchiere ai ristori)

**⚠️ Penalità per attrezzatura obbligatoria mancante:** 1 ora

---

## 🏆 Premi

**STUT Ultra, STTL e STTC:**
- Trofeo ai primi 3 classificati generali M/F
- Trofeo ai primi 3 classificati per categoria M/F
- Trofeo alle 3 migliori squadre (3 membri)

**STUT Kids:**
- Medaglia finisher per tutti i partecipanti

**Categorie per Età:**
- Sub Junior M/F (18-19 anni)
- Sub23 M/F (20-22 anni)
- Senior M/F (23-34 anni)
- Vet. M35/F35 (35-39 anni)
- Vet. M40/F40 (40-44 anni)
- Vet. M45/F45 (45-49 anni)
- Vet. M50/F50 (50-54 anni)
- Vet. M55/F55 (55-59 anni)
- Vet. M60/F60 (60+ anni)

---

## 📋 Posti di Ristoro

**STUT Ultra:** 5 posti di ristoro  
**STTL Trail Lungo:** 4 posti di ristoro  
**STTC Trail Corto:** 2 posti di ristoro

⚠️ **Nota:** Acqua per riempire contenitori personali. Nessun bicchiere ai ristori.

---

## 📞 Contatti

**Organizzazione:** NAST - Centro Associativo di Santo Tirso  
**Co-Organizzazione:** Comune di Santo Tirso  
**Email:** stut.nast@gmail.com  
**Sito Web:** www.nast.pt | www.myatrp.pt  
**Iscrizioni:** Stop and Go

---

🏔️ **Vieni a correre tra le montagne di Santo Tirso all'11° edizione dello STUT!** 🏃`,
      city: "Santo Tirso",
      metaTitle:
        "11° STUT - Santo Thyrso Ultra Trails 2026 | Santo Tirso | 14-15 Febbraio",
      metaDescription:
        "11° STUT - Santo Thyrso Ultra Trails il 14-15 febbraio 2026 a Santo Tirso. Gare: Ultra 44km, Trail Lungo 32km, Trail Corto 17km, Camminata 10km e STUT Kids.",
    },
  };

  // FAQ data for ALL 6 languages
  const faqs = {
    pt: [
      {
        question: "Onde posso fazer a inscrição?",
        answer:
          "As inscrições devem ser efetuadas através da plataforma Stop and Go. O prazo limite é 8 de fevereiro de 2026.",
      },
      {
        question: "Qual o prazo limite para inscrições?",
        answer:
          "As inscrições encerram no dia 8 de fevereiro de 2026. Após esta data poderão ser aceites inscrições caso não estejam esgotadas, mas não garantimos o kit completo individual.",
      },
      {
        question: "Posso transferir ou alterar a minha inscrição?",
        answer:
          "Sim, até 8 de fevereiro de 2026. Se for para prova de valor superior, paga-se o diferencial. Se for para valor inferior, não há devolução. Alterações devem ser comunicadas por email para stut.nast@gmail.com.",
      },
      {
        question: "Qual é o material obrigatório?",
        answer:
          "Para STUT, STTL e STTC: Manta térmica, telemóvel operacional e apito são obrigatórios. A falta de qualquer item resulta em penalização de 1 hora.",
      },
      {
        question: "Existem barreiras horárias?",
        answer:
          "Sim. STUT: 9h00. STTL: 8h30. STTC: 7h00. Caminhada: 6h50. Será publicada uma tabela com as barreiras horárias nos vários pontos de passagem.",
      },
      {
        question: "Onde e quando posso levantar o dorsal?",
        answer:
          "Sábado 14/02 das 10h00-12h30 e 14h00-20h00, ou Domingo 15/02 das 07h00-09h00 (até 09h20 para caminhada), na Sala de Imprensa do Pavilhão Desportivo Municipal. STUT Kids: Sábado 14/02 às 14h00 no Parque Urbano de Geão.",
      },
      {
        question: "O que está incluído na inscrição?",
        answer:
          "T-shirt oficial, dorsal, medalha de finisher (exceto caminhada), seguro de acidentes e responsabilidade civil, abastecimentos, reforço final e outras lembranças.",
      },
      {
        question: "Quantos abastecimentos existem?",
        answer:
          "STUT Ultra: 5 postos. STTL: 4 postos. STTC: 2 postos. Atenção: não há copos nos abastecimentos, recomenda-se copo dobrável.",
      },
      {
        question: "A inscrição é reembolsável?",
        answer:
          "Desistências até 8 de fevereiro: devolução de 50% do valor. Após esta data não haverá direito a qualquer reembolso. Desistências devem ser comunicadas por email.",
      },
      {
        question: "Que prémios são atribuídos?",
        answer:
          "Troféus aos 3 primeiros classificados da geral M/F e aos 3 primeiros de cada escalão. Troféus às 3 melhores equipas. Medalha de finisher para todos que concluam a prova. É obrigatória a presença na cerimónia de entrega de prémios.",
      },
    ],
    en: [
      {
        question: "Where can I register?",
        answer:
          "Registrations must be made through the Stop and Go platform. The deadline is February 8, 2026.",
      },
      {
        question: "What is the registration deadline?",
        answer:
          "Registrations close on February 8, 2026. After this date, registrations may be accepted if not sold out, but we do not guarantee a complete individual kit.",
      },
      {
        question: "Can I transfer or change my registration?",
        answer:
          "Yes, until February 8, 2026. If upgrading to a higher-priced race, pay the difference. If downgrading, no refund. Changes must be communicated by email to stut.nast@gmail.com.",
      },
      {
        question: "What is the mandatory equipment?",
        answer:
          "For STUT, STTL and STTC: Thermal blanket, working mobile phone and whistle are mandatory. Missing any item results in a 1-hour penalty.",
      },
      {
        question: "Are there time barriers?",
        answer:
          "Yes. STUT: 9h00. STTL: 8h30. STTC: 7h00. Walk: 6h50. A table with time barriers at various checkpoints will be published.",
      },
      {
        question: "Where and when can I collect my bib?",
        answer:
          "Saturday 14/02 from 10:00-12:30 and 14:00-20:00, or Sunday 15/02 from 07:00-09:00 (until 09:20 for walk), at the Sports Pavilion Press Room. STUT Kids: Saturday 14/02 at 14:00 at Geão Urban Park.",
      },
      {
        question: "What is included in registration?",
        answer:
          "Official t-shirt, bib, finisher medal (except walk), personal accident and civil liability insurance, aid stations, final refreshment and other souvenirs.",
      },
      {
        question: "How many aid stations are there?",
        answer:
          "STUT Ultra: 5 stations. STTL: 4 stations. STTC: 2 stations. Note: no cups at aid stations, foldable cup recommended.",
      },
      {
        question: "Is registration refundable?",
        answer:
          "Withdrawals until February 8: 50% refund. After this date, no refunds. Withdrawals must be communicated by email.",
      },
      {
        question: "What awards are given?",
        answer:
          "Trophies to top 3 overall M/F and top 3 in each category. Trophies to top 3 teams. Finisher medal for all who complete the race. Attendance at award ceremony is mandatory.",
      },
    ],
    es: [
      {
        question: "¿Dónde puedo inscribirme?",
        answer:
          "Las inscripciones deben realizarse a través de la plataforma Stop and Go. El plazo límite es el 8 de febrero de 2026.",
      },
      {
        question: "¿Cuál es el plazo límite para inscripciones?",
        answer:
          "Las inscripciones cierran el 8 de febrero de 2026. Después de esta fecha podrán aceptarse inscripciones si no están agotadas, pero no garantizamos el kit completo individual.",
      },
      {
        question: "¿Puedo transferir o cambiar mi inscripción?",
        answer:
          "Sí, hasta el 8 de febrero de 2026. Si es para una carrera de valor superior, se paga la diferencia. Si es de valor inferior, no hay devolución. Los cambios deben comunicarse por email a stut.nast@gmail.com.",
      },
      {
        question: "¿Cuál es el material obligatorio?",
        answer:
          "Para STUT, STTL y STTC: Manta térmica, teléfono móvil operativo y silbato son obligatorios. La falta de cualquier artículo resulta en penalización de 1 hora.",
      },
      {
        question: "¿Hay barreras horarias?",
        answer:
          "Sí. STUT: 9h00. STTL: 8h30. STTC: 7h00. Caminata: 6h50. Se publicará una tabla con las barreras horarias en varios puntos de paso.",
      },
      {
        question: "¿Dónde y cuándo puedo recoger el dorsal?",
        answer:
          "Sábado 14/02 de 10:00-12:30 y 14:00-20:00, o Domingo 15/02 de 07:00-09:00 (hasta 09:20 para caminata), en la Sala de Prensa del Pabellón Deportivo. STUT Kids: Sábado 14/02 a las 14:00 en el Parque Urbano de Geão.",
      },
      {
        question: "¿Qué incluye la inscripción?",
        answer:
          "Camiseta oficial, dorsal, medalla finisher (excepto caminata), seguro de accidentes y responsabilidad civil, avituallamientos, refuerzo final y otros recuerdos.",
      },
      {
        question: "¿Cuántos avituallamientos hay?",
        answer:
          "STUT Ultra: 5 puestos. STTL: 4 puestos. STTC: 2 puestos. Atención: no hay vasos en avituallamientos, se recomienda vaso plegable.",
      },
      {
        question: "¿Es reembolsable la inscripción?",
        answer:
          "Bajas hasta el 8 de febrero: devolución del 50%. Después de esta fecha no habrá reembolso. Las bajas deben comunicarse por email.",
      },
      {
        question: "¿Qué premios se otorgan?",
        answer:
          "Trofeos a los 3 primeros clasificados generales M/F y a los 3 primeros de cada categoría. Trofeos a los 3 mejores equipos. Medalla finisher para todos los que completen la carrera. Es obligatoria la presencia en la ceremonia de entrega de premios.",
      },
    ],
    fr: [
      {
        question: "Où puis-je m'inscrire?",
        answer:
          "Les inscriptions doivent être effectuées via la plateforme Stop and Go. La date limite est le 8 février 2026.",
      },
      {
        question: "Quelle est la date limite d'inscription?",
        answer:
          "Les inscriptions ferment le 8 février 2026. Après cette date, des inscriptions pourront être acceptées si non complètes, mais nous ne garantissons pas le kit complet individuel.",
      },
      {
        question: "Puis-je transférer ou modifier mon inscription?",
        answer:
          "Oui, jusqu'au 8 février 2026. Si c'est pour une course de valeur supérieure, payez la différence. Si inférieure, pas de remboursement. Les modifications doivent être communiquées par email à stut.nast@gmail.com.",
      },
      {
        question: "Quel est l'équipement obligatoire?",
        answer:
          "Pour STUT, STTL et STTC: Couverture thermique, téléphone portable opérationnel et sifflet sont obligatoires. Le manque de tout article entraîne une pénalité d'1 heure.",
      },
      {
        question: "Y a-t-il des barrières horaires?",
        answer:
          "Oui. STUT: 9h00. STTL: 8h30. STTC: 7h00. Randonnée: 6h50. Un tableau avec les barrières horaires aux différents points de passage sera publié.",
      },
      {
        question: "Où et quand puis-je récupérer mon dossard?",
        answer:
          "Samedi 14/02 de 10h00-12h30 et 14h00-20h00, ou Dimanche 15/02 de 07h00-09h00 (jusqu'à 09h20 pour randonnée), à la Salle de Presse du Pavillon Sportif. STUT Kids: Samedi 14/02 à 14h00 au Parc Urbain de Geão.",
      },
      {
        question: "Qu'est-ce qui est inclus dans l'inscription?",
        answer:
          "T-shirt officiel, dossard, médaille finisher (sauf randonnée), assurance accidents et responsabilité civile, ravitaillements, rafraîchissement final et autres souvenirs.",
      },
      {
        question: "Combien de postes de ravitaillement y a-t-il?",
        answer:
          "STUT Ultra: 5 postes. STTL: 4 postes. STTC: 2 postes. Attention: pas de gobelets aux ravitaillements, gobelet pliable recommandé.",
      },
      {
        question: "L'inscription est-elle remboursable?",
        answer:
          "Désistements jusqu'au 8 février: remboursement de 50%. Après cette date, aucun remboursement. Les désistements doivent être communiqués par email.",
      },
      {
        question: "Quelles récompenses sont attribuées?",
        answer:
          "Trophées aux 3 premiers classés généraux H/F et aux 3 premiers de chaque catégorie. Trophées aux 3 meilleures équipes. Médaille finisher pour tous ceux qui terminent la course. La présence à la cérémonie de remise des prix est obligatoire.",
      },
    ],
    de: [
      {
        question: "Wo kann ich mich anmelden?",
        answer:
          "Anmeldungen müssen über die Stop and Go Plattform erfolgen. Die Frist endet am 8. Februar 2026.",
      },
      {
        question: "Was ist die Anmeldefrist?",
        answer:
          "Anmeldungen schließen am 8. Februar 2026. Nach diesem Datum können Anmeldungen akzeptiert werden, falls nicht ausgebucht, aber wir garantieren kein vollständiges individuelles Kit.",
      },
      {
        question: "Kann ich meine Anmeldung übertragen oder ändern?",
        answer:
          "Ja, bis 8. Februar 2026. Bei Upgrade zu höherpreisigem Lauf zahlen Sie die Differenz. Bei Downgrade keine Rückerstattung. Änderungen per Email an stut.nast@gmail.com mitteilen.",
      },
      {
        question: "Was ist die obligatorische Ausrüstung?",
        answer:
          "Für STUT, STTL und STTC: Thermodecke, funktionierendes Mobiltelefon und Pfeife sind obligatorisch. Fehlendes Material führt zu 1 Stunde Strafe.",
      },
      {
        question: "Gibt es Zeitbarrieren?",
        answer:
          "Ja. STUT: 9h00. STTL: 8h30. STTC: 7h00. Wanderung: 6h50. Eine Tabelle mit Zeitbarrieren an verschiedenen Kontrollpunkten wird veröffentlicht.",
      },
      {
        question: "Wo und wann kann ich meine Startnummer abholen?",
        answer:
          "Samstag 14.02 von 10:00-12:30 und 14:00-20:00, oder Sonntag 15.02 von 07:00-09:00 (bis 09:20 für Wanderung), im Presseraum der Sporthalle. STUT Kids: Samstag 14.02 um 14:00 im Geão Stadtpark.",
      },
      {
        question: "Was ist in der Anmeldung enthalten?",
        answer:
          "Offizielles T-Shirt, Startnummer, Finisher-Medaille (außer Wanderung), Unfall- und Haftpflichtversicherung, Verpflegungsstationen, Abschlussverpflegung und andere Souvenirs.",
      },
      {
        question: "Wie viele Verpflegungsstationen gibt es?",
        answer:
          "STUT Ultra: 5 Stationen. STTL: 4 Stationen. STTC: 2 Stationen. Achtung: keine Becher an Verpflegungsstationen, Faltbecher empfohlen.",
      },
      {
        question: "Ist die Anmeldung erstattungsfähig?",
        answer:
          "Rückzug bis 8. Februar: 50% Rückerstattung. Nach diesem Datum keine Rückerstattung. Rückzüge per Email mitteilen.",
      },
      {
        question: "Welche Preise werden vergeben?",
        answer:
          "Trophäen für Top 3 Gesamt M/F und Top 3 jeder Kategorie. Trophäen für Top 3 Teams. Finisher-Medaille für alle, die das Rennen beenden. Anwesenheit bei Preisverleihung obligatorisch.",
      },
    ],
    it: [
      {
        question: "Dove posso iscrivermi?",
        answer:
          "Le iscrizioni devono essere effettuate tramite la piattaforma Stop and Go. Il termine è l'8 febbraio 2026.",
      },
      {
        question: "Qual è il termine di iscrizione?",
        answer:
          "Le iscrizioni chiudono l'8 febbraio 2026. Dopo questa data possono essere accettate iscrizioni se non esaurite, ma non garantiamo il kit completo individuale.",
      },
      {
        question: "Posso trasferire o modificare la mia iscrizione?",
        answer:
          "Sì, fino all'8 febbraio 2026. Se è per una gara di valore superiore, si paga la differenza. Se inferiore, nessun rimborso. Le modifiche devono essere comunicate via email a stut.nast@gmail.com.",
      },
      {
        question: "Qual è l'attrezzatura obbligatoria?",
        answer:
          "Per STUT, STTL e STTC: Coperta termica, telefono cellulare funzionante e fischietto sono obbligatori. La mancanza di qualsiasi articolo comporta una penalità di 1 ora.",
      },
      {
        question: "Ci sono barriere orarie?",
        answer:
          "Sì. STUT: 9h00. STTL: 8h30. STTC: 7h00. Camminata: 6h50. Sarà pubblicata una tabella con le barriere orarie nei vari punti di passaggio.",
      },
      {
        question: "Dove e quando posso ritirare il pettorale?",
        answer:
          "Sabato 14/02 dalle 10:00-12:30 e 14:00-20:00, o Domenica 15/02 dalle 07:00-09:00 (fino alle 09:20 per camminata), nella Sala Stampa del Padiglione Sportivo. STUT Kids: Sabato 14/02 alle 14:00 al Parco Urbano di Geão.",
      },
      {
        question: "Cosa è incluso nell'iscrizione?",
        answer:
          "T-shirt ufficiale, pettorale, medaglia finisher (tranne camminata), assicurazione infortuni e responsabilità civile, ristori, rinfresco finale e altri ricordi.",
      },
      {
        question: "Quanti posti di ristoro ci sono?",
        answer:
          "STUT Ultra: 5 posti. STTL: 4 posti. STTC: 2 posti. Attenzione: nessun bicchiere ai ristori, bicchiere pieghevole consigliato.",
      },
      {
        question: "L'iscrizione è rimborsabile?",
        answer:
          "Ritiri fino all'8 febbraio: rimborso del 50%. Dopo questa data nessun rimborso. I ritiri devono essere comunicati via email.",
      },
      {
        question: "Quali premi vengono assegnati?",
        answer:
          "Trofei ai primi 3 classificati generali M/F e ai primi 3 di ogni categoria. Trofei alle 3 migliori squadre. Medaglia finisher per tutti coloro che completano la gara. È obbligatoria la presenza alla cerimonia di premiazione.",
      },
    ],
  };

  // Create event
  const event = await prisma.event.create({
    data: {
      title: "11ª STUT - Santo Thyrso Ultra Trilhos 2026",
      slug: eventSlug,
      description:
        "11ª Edição do STUT - Santo Thyrso Ultra Trilhos. Trail pelos montes de Santo Tirso e Paços de Ferreira. Provas: Ultra 44km, Trail Longo 32km, Trail Curto 17km, Caminhada 10km e STUT Kids.",
      startDate: eventStartDate,
      endDate: eventEndDate,
      city: "Santo Tirso",
      country: "Portugal",
      sportTypes: [SportType.TRAIL],
      imageUrl: "",
      externalUrl: "https://www.nast.pt",
      registrationDeadline: new Date("2026-02-08T23:59:59Z"),
      latitude: 41.3429,
      longitude: -8.4748,
      googleMapsUrl: "https://maps.app.goo.gl/XYZ123",
      isFeatured: true,
    },
  });

  console.log(`✅ Created event: ${eventSlug}`);

  // Create translations for ALL 6 languages
  console.log("🌍 Creating translations for all 6 languages...");
  const languages = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  for (const lang of languages) {
    const langKey = lang.toLowerCase() as
      | "pt"
      | "en"
      | "es"
      | "fr"
      | "de"
      | "it";
    const translation = translations[langKey];

    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
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
        language: lang,
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
    });

    console.log(`   ✅ Created ${lang.toUpperCase()} translation`);
  }

  // Event variants with pricing phases
  const variants = [
    {
      name: "STUT Ultra",
      distanceKm: 44.0,
      elevationGainM: 2300,
      elevationLossM: null,
      cutoffTimeHours: 9.0,
      mountainLevel: 4,
      maxParticipants: 300,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-26T00:00:00Z"),
          endDate: new Date("2026-01-18T23:59:59Z"),
          price: 35.0,
          currency: Currency.EUR,
          note: "Até 18 de Janeiro 2026",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-19T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 40.0,
          currency: Currency.EUR,
          note: "Até 8 de Fevereiro 2026",
        },
      ],
    },
    {
      name: "STTL - Trail Longo",
      distanceKm: 32.0,
      elevationGainM: 1600,
      elevationLossM: null,
      cutoffTimeHours: 8.5,
      mountainLevel: 3,
      maxParticipants: 500,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-26T00:00:00Z"),
          endDate: new Date("2026-01-18T23:59:59Z"),
          price: 27.0,
          currency: Currency.EUR,
          note: "Até 18 de Janeiro 2026",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-19T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 32.0,
          currency: Currency.EUR,
          note: "Até 8 de Fevereiro 2026",
        },
      ],
    },
    {
      name: "STTC - Trail Curto",
      distanceKm: 17.0,
      elevationGainM: 800,
      elevationLossM: null,
      cutoffTimeHours: 7.0,
      mountainLevel: 2,
      maxParticipants: 700,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-26T00:00:00Z"),
          endDate: new Date("2026-01-18T23:59:59Z"),
          price: 17.0,
          currency: Currency.EUR,
          note: "Até 18 de Janeiro 2026",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-19T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 20.0,
          currency: Currency.EUR,
          note: "Até 8 de Fevereiro 2026",
        },
      ],
    },
    {
      name: "Caminhada",
      distanceKm: 10.0,
      elevationGainM: null,
      elevationLossM: null,
      cutoffTimeHours: 6.83,
      mountainLevel: 1,
      maxParticipants: 400,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-26T00:00:00Z"),
          endDate: new Date("2026-01-18T23:59:59Z"),
          price: 10.0,
          currency: Currency.EUR,
          note: "Até 18 de Janeiro 2026",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-19T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 12.0,
          currency: Currency.EUR,
          note: "Até 8 de Fevereiro 2026",
        },
      ],
    },
    {
      name: "STUT Kids",
      distanceKm: 2.0,
      elevationGainM: null,
      elevationLossM: null,
      cutoffTimeHours: null,
      mountainLevel: 1,
      maxParticipants: 100,
      pricingPhases: [
        {
          name: "Inscrição Gratuita",
          startDate: new Date("2025-09-26T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 0.0,
          currency: Currency.EUR,
          note: "Gratuita mas obrigatória - Idades 5 aos 17 anos",
        },
      ],
    },
  ];

  // Delete existing pricing phases for this event to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

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

    // Create pricing phases for this variant
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id, // ✅ linked to eventId (event-level display)
          variantId: variant.id, // ✅ linked to variantId (variant-level pricing)
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
          note: phase.note,
        },
      });
    }

    console.log(`   - Created ${pricingPhases.length} pricing phase(s)`);
  }

  // Create FAQs with translations for ALL 6 languages
  console.log("❓ Creating FAQs with translations for all 6 languages...");

  const ptFaqs = faqs.pt;
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
      const langKey = lang.toLowerCase() as
        | "pt"
        | "en"
        | "es"
        | "fr"
        | "de"
        | "it";
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

  console.log(
    "✅ 11ª STUT - Santo Thyrso Ultra Trilhos 2026 seed completed successfully!"
  );
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedStut2026()
    .catch((e) => {
      console.error("❌ Error seeding STUT 2026:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
