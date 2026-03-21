import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedTrailRibeiraLimas2026() {
  console.log("🏃 Seeding X Trail Ribeira de Limas 2026...");

  // Base event data
  const eventSlug = "trail-ribeira-limas-2026";
  const eventStartDate = new Date("2026-02-15T08:00:00Z");
  const eventEndDate = new Date("2026-02-15T14:00:00Z");

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
      title: "X Trail Ribeira de Limas 2026",
      description: `**🏃 X Trail Ribeira de Limas 2026 - 10ª Edição**

O **X Trail Ribeira de Limas** realiza-se a **15 de fevereiro de 2026** em **Santa Iria**, concelho de **Serpa**. Organizado pela **A.C.R.S.I. - Santa Iria Bike Team** (Associação Cultural e Recreativa de Santa Iria), com apoio da Câmara Municipal de Serpa e União de Juntas de Freguesia de Santa Maria e Salvador.

Este trail faz parte de múltiplos circuitos: **Campeonato Regional de Trail**, **Circuito Regional de Sprint**, **Circuito Nacional de Trail (ATRP)**, **Circuito Nacional de Sprint (ATRP)** e **Circuito Nacional Jovem (ATRP)**.

---

## 🏔️ Provas Disponíveis

### **Trail** - ≈32 km
- **Tempo Limite:** 6h30
- **Idade Mínima:** 20 anos
- **Barreiras Horárias:** 2º Abastecimento (2h30), 4º Abastecimento (4h15)
- **Vagas:** 150

### **Sprint** - ≈17 km
- **Tempo Limite:** 3h30
- **Idade Mínima:** 18 anos
- **Vagas:** 300

### **Mini Trail** - ≈10 km
- **Idade Mínima:** 14 anos
- **Vagas:** 150

### **Caminhada** - ≈8 km
- **Idade Mínima:** 12 anos
- **Participação lúdica - Sem classificações**
- **Vagas:** 100

---

## 📍 Local e Horários

**Partida e Chegada:** Centro Cultural de Santa Iria, Serpa

**Secretariado:** Domingo 15/02 - 08h00

**Briefing:** 08h50  
**Partida:**
- 09h00 - Trail (32km)
- 09h20 - Sprint (17km)
- 09h30 - Mini Trail (10km)
- 09h35 - Caminhada (8km)

**Entrega de Prémios:** 13h00 (sujeito a alteração)

---

## 🎯 Destaques

✅ Seguro de acidentes pessoais  
✅ Pequeno-almoço incluído  
✅ Abastecimentos sólidos e líquidos  
✅ Reforço à chegada  
✅ T-shirt técnica 42K (inscrições até 24 janeiro)  
✅ Brinde finisher  
✅ Cronometragem eletrónica

---

## 💰 Preços

**1ª Fase (até 25 Janeiro 2026):**
- Trail (32km): €22,00
- Sprint (17km): €19,00
- Mini Trail (10km): €15,00
- Caminhada (8km): €15,00

**2ª Fase (até 8 Fevereiro 2026):**
- Trail (32km): €24,00
- Sprint (17km): €21,00
- Mini Trail (10km): €17,00
- Caminhada (8km): €17,00

**Data limite de inscrição:** 8 de fevereiro de 2026

---

## 📋 Material Obrigatório

**Trail, Sprint e Mini Trail:**

✅ Manta térmica  
✅ Apito  
✅ Telemóvel operacional  
✅ Dorsal (visível)

**Material Aconselhável:** Boné, mochila, alimentos energéticos

---

## 🏆 Prémios

**Trail e Sprint:**
- Top 3 geral M/F
- Top 3 por escalão M/F

**Mini Trail:**
- Top 3 geral M/F

**Equipas:**
- Top 3 equipas no Trail e Sprint

---

## 📋 Postos de Controlo e Abastecimento

**Trail (32km):**
- 2 postos de controlo
- 3 abastecimentos: ~7km, ~14km, ~23km

**Sprint (17km):**
- 1 posto de controlo
- 2 abastecimentos: ~7km, ~14km

**Mini Trail (10km):**
- 1 abastecimento: ~7km

**Caminhada (8km):**
- 1 abastecimento: ~5,5km

⚠️ **Nota:** Não haverá copos nos abastecimentos. Cada participante deve trazer recipiente próprio para líquidos.

---

## 📞 Contactos

**Organização:** A.C.R.S.I. - Santa Iria Bike Team  
**Inscrições:** https://registerandgo.net

---

🏃 **Vem correr na 10ª edição do Trail Ribeira de Limas!** 🌄`,
      city: "Santa Iria",
      metaTitle:
        "X Trail Ribeira de Limas 2026 - 10ª Edição | Santa Iria, Serpa | 15 Fevereiro",
      metaDescription:
        "X Trail Ribeira de Limas a 15 de fevereiro de 2026 em Santa Iria, Serpa. Provas: Trail 32km, Sprint 17km, Mini Trail 10km e Caminhada 8km. Circuito Nacional ATRP.",
    },
    en: {
      title: "X Trail Ribeira de Limas 2026",
      description: `**🏃 X Trail Ribeira de Limas 2026 - 10th Edition**

The **X Trail Ribeira de Limas** takes place on **February 15, 2026** in **Santa Iria**, municipality of **Serpa**. Organized by **A.C.R.S.I. - Santa Iria Bike Team** (Cultural and Recreational Association of Santa Iria), with support from Serpa City Council and União de Juntas de Freguesia de Santa Maria e Salvador.

This trail is part of multiple circuits: **Regional Trail Championship**, **Regional Sprint Circuit**, **National Trail Circuit (ATRP)**, **National Sprint Circuit (ATRP)** and **National Youth Circuit (ATRP)**.

---

## 🏔️ Available Races

### **Trail** - ≈32 km
- **Time Limit:** 6h30
- **Minimum Age:** 20 years
- **Time Barriers:** 2nd Aid Station (2h30), 4th Aid Station (4h15)
- **Spots:** 150

### **Sprint** - ≈17 km
- **Time Limit:** 3h30
- **Minimum Age:** 18 years
- **Spots:** 300

### **Mini Trail** - ≈10 km
- **Minimum Age:** 14 years
- **Spots:** 150

### **Walk** - ≈8 km
- **Minimum Age:** 12 years
- **Recreational participation - No classifications**
- **Spots:** 100

---

## 📍 Location and Schedule

**Start and Finish:** Santa Iria Cultural Center, Serpa

**Registration:** Sunday 15/02 - 08:00

**Briefing:** 08:50  
**Start:**
- 09:00 - Trail (32km)
- 09:20 - Sprint (17km)
- 09:30 - Mini Trail (10km)
- 09:35 - Walk (8km)

**Award Ceremony:** 13:00 (subject to change)

---

## 🎯 Highlights

✅ Personal accident insurance  
✅ Breakfast included  
✅ Solid and liquid refreshments  
✅ Refreshment at finish  
✅ 42K technical T-shirt (registrations until Jan 24)  
✅ Finisher gift  
✅ Electronic timing

---

## 💰 Prices

**Phase 1 (until January 25, 2026):**
- Trail (32km): €22.00
- Sprint (17km): €19.00
- Mini Trail (10km): €15.00
- Walk (8km): €15.00

**Phase 2 (until February 8, 2026):**
- Trail (32km): €24.00
- Sprint (17km): €21.00
- Mini Trail (10km): €17.00
- Walk (8km): €17.00

**Registration deadline:** February 8, 2026

---

## 📋 Mandatory Equipment

**Trail, Sprint and Mini Trail:**

✅ Thermal blanket  
✅ Whistle  
✅ Operational mobile phone  
✅ Bib (visible)

**Recommended Equipment:** Cap, backpack, energy food

---

## 🏆 Awards

**Trail and Sprint:**
- Top 3 overall M/F
- Top 3 per category M/F

**Mini Trail:**
- Top 3 overall M/F

**Teams:**
- Top 3 teams in Trail and Sprint

---

## 📋 Control and Aid Stations

**Trail (32km):**
- 2 control posts
- 3 aid stations: ~7km, ~14km, ~23km

**Sprint (17km):**
- 1 control post
- 2 aid stations: ~7km, ~14km

**Mini Trail (10km):**
- 1 aid station: ~7km

**Walk (8km):**
- 1 aid station: ~5.5km

⚠️ **Note:** No cups at aid stations. Each participant must bring their own liquid container.

---

## 📞 Contacts

**Organization:** A.C.R.S.I. - Santa Iria Bike Team  
**Registration:** https://registerandgo.net

---

🏃 **Come run the 10th edition of Trail Ribeira de Limas!** 🌄`,
      city: "Santa Iria",
      metaTitle:
        "X Trail Ribeira de Limas 2026 - 10th Edition | Santa Iria, Serpa | 15 February",
      metaDescription:
        "X Trail Ribeira de Limas on February 15, 2026 in Santa Iria, Serpa. Races: Trail 32km, Sprint 17km, Mini Trail 10km and Walk 8km. ATRP National Circuit.",
    },
    es: {
      title: "X Trail Ribeira de Limas 2026",
      description: `**🏃 X Trail Ribeira de Limas 2026 - 10ª Edición**

El **X Trail Ribeira de Limas** se celebra el **15 de febrero de 2026** en **Santa Iria**, municipio de **Serpa**. Organizado por **A.C.R.S.I. - Santa Iria Bike Team** (Asociación Cultural y Recreativa de Santa Iria), con apoyo del Ayuntamiento de Serpa y União de Juntas de Freguesia de Santa Maria e Salvador.

Este trail forma parte de múltiples circuitos: **Campeonato Regional de Trail**, **Circuito Regional de Sprint**, **Circuito Nacional de Trail (ATRP)**, **Circuito Nacional de Sprint (ATRP)** y **Circuito Nacional Juvenil (ATRP)**.

---

## 🏔️ Carreras Disponibles

### **Trail** - ≈32 km
- **Tiempo Límite:** 6h30
- **Edad Mínima:** 20 años
- **Barreras Horarias:** 2º Avituallamiento (2h30), 4º Avituallamiento (4h15)
- **Plazas:** 150

### **Sprint** - ≈17 km
- **Tiempo Límite:** 3h30
- **Edad Mínima:** 18 años
- **Plazas:** 300

### **Mini Trail** - ≈10 km
- **Edad Mínima:** 14 años
- **Plazas:** 150

### **Caminata** - ≈8 km
- **Edad Mínima:** 12 años
- **Participación lúdica - Sin clasificaciones**
- **Plazas:** 100

---

## 📍 Ubicación y Horario

**Salida y Meta:** Centro Cultural de Santa Iria, Serpa

**Secretaría:** Domingo 15/02 - 08:00

**Briefing:** 08:50  
**Salida:**
- 09:00 - Trail (32km)
- 09:20 - Sprint (17km)
- 09:30 - Mini Trail (10km)
- 09:35 - Caminata (8km)

**Entrega de Premios:** 13:00 (sujeto a cambios)

---

## 🎯 Destacados

✅ Seguro de accidentes personales  
✅ Desayuno incluido  
✅ Avituallamientos sólidos y líquidos  
✅ Refresco en la llegada  
✅ Camiseta técnica 42K (inscripciones hasta 24 enero)  
✅ Regalo finisher  
✅ Cronometraje electrónico

---

## 💰 Precios

**Fase 1 (hasta 25 Enero 2026):**
- Trail (32km): €22,00
- Sprint (17km): €19,00
- Mini Trail (10km): €15,00
- Caminata (8km): €15,00

**Fase 2 (hasta 8 Febrero 2026):**
- Trail (32km): €24,00
- Sprint (17km): €21,00
- Mini Trail (10km): €17,00
- Caminata (8km): €17,00

**Fecha límite de inscripción:** 8 de febrero de 2026

---

## 📋 Material Obligatorio

**Trail, Sprint y Mini Trail:**

✅ Manta térmica  
✅ Silbato  
✅ Teléfono móvil operativo  
✅ Dorsal (visible)

**Material Aconsejable:** Gorra, mochila, alimentos energéticos

---

## 🏆 Premios

**Trail y Sprint:**
- Top 3 general M/F
- Top 3 por categoría M/F

**Mini Trail:**
- Top 3 general M/F

**Equipos:**
- Top 3 equipos en Trail y Sprint

---

## 📋 Puestos de Control y Avituallamiento

**Trail (32km):**
- 2 puestos de control
- 3 avituallamientos: ~7km, ~14km, ~23km

**Sprint (17km):**
- 1 puesto de control
- 2 avituallamientos: ~7km, ~14km

**Mini Trail (10km):**
- 1 avituallamiento: ~7km

**Caminata (8km):**
- 1 avituallamiento: ~5,5km

⚠️ **Nota:** No habrá vasos en los avituallamientos. Cada participante debe traer su propio recipiente para líquidos.

---

## 📞 Contactos

**Organización:** A.C.R.S.I. - Santa Iria Bike Team  
**Inscripciones:** https://registerandgo.net

---

🏃 **¡Ven a correr la 10ª edición del Trail Ribeira de Limas!** 🌄`,
      city: "Santa Iria",
      metaTitle:
        "X Trail Ribeira de Limas 2026 - 10ª Edición | Santa Iria, Serpa | 15 Febrero",
      metaDescription:
        "X Trail Ribeira de Limas el 15 de febrero de 2026 en Santa Iria, Serpa. Carreras: Trail 32km, Sprint 17km, Mini Trail 10km y Caminata 8km. Circuito Nacional ATRP.",
    },
    fr: {
      title: "X Trail Ribeira de Limas 2026",
      description: `**🏃 X Trail Ribeira de Limas 2026 - 10ème Édition**

Le **X Trail Ribeira de Limas** se déroule le **15 février 2026** à **Santa Iria**, commune de **Serpa**. Organisé par **A.C.R.S.I. - Santa Iria Bike Team** (Association Culturelle et Récréative de Santa Iria), avec le soutien de la Mairie de Serpa et União de Juntas de Freguesia de Santa Maria e Salvador.

Ce trail fait partie de plusieurs circuits : **Championnat Régional de Trail**, **Circuit Régional de Sprint**, **Circuit National de Trail (ATRP)**, **Circuit National de Sprint (ATRP)** et **Circuit National Jeunes (ATRP)**.

---

## 🏔️ Courses Disponibles

### **Trail** - ≈32 km
- **Temps Limite:** 6h30
- **Âge Minimum:** 20 ans
- **Barrières Horaires:** 2ème Ravitaillement (2h30), 4ème Ravitaillement (4h15)
- **Places:** 150

### **Sprint** - ≈17 km
- **Temps Limite:** 3h30
- **Âge Minimum:** 18 ans
- **Places:** 300

### **Mini Trail** - ≈10 km
- **Âge Minimum:** 14 ans
- **Places:** 150

### **Randonnée** - ≈8 km
- **Âge Minimum:** 12 ans
- **Participation ludique - Sans classements**
- **Places:** 100

---

## 📍 Lieu et Horaires

**Départ et Arrivée:** Centre Culturel de Santa Iria, Serpa

**Secrétariat:** Dimanche 15/02 - 08h00

**Briefing:** 08h50  
**Départ:**
- 09h00 - Trail (32km)
- 09h20 - Sprint (17km)
- 09h30 - Mini Trail (10km)
- 09h35 - Randonnée (8km)

**Remise des Prix:** 13h00 (sujet à modification)

---

## 🎯 Points Forts

✅ Assurance accidents personnels  
✅ Petit-déjeuner inclus  
✅ Ravitaillements solides et liquides  
✅ Rafraîchissement à l'arrivée  
✅ T-shirt technique 42K (inscriptions jusqu'au 24 janvier)  
✅ Cadeau finisher  
✅ Chronométrage électronique

---

## 💰 Prix

**Phase 1 (jusqu'au 25 Janvier 2026):**
- Trail (32km): €22,00
- Sprint (17km): €19,00
- Mini Trail (10km): €15,00
- Randonnée (8km): €15,00

**Phase 2 (jusqu'au 8 Février 2026):**
- Trail (32km): €24,00
- Sprint (17km): €21,00
- Mini Trail (10km): €17,00
- Randonnée (8km): €17,00

**Date limite d'inscription:** 8 février 2026

---

## 📋 Équipement Obligatoire

**Trail, Sprint et Mini Trail:**

✅ Couverture thermique  
✅ Sifflet  
✅ Téléphone portable opérationnel  
✅ Dossard (visible)

**Équipement Conseillé:** Casquette, sac à dos, aliments énergétiques

---

## 🏆 Récompenses

**Trail et Sprint:**
- Top 3 général H/F
- Top 3 par catégorie H/F

**Mini Trail:**
- Top 3 général H/F

**Équipes:**
- Top 3 équipes en Trail et Sprint

---

## 📋 Postes de Contrôle et Ravitaillement

**Trail (32km):**
- 2 postes de contrôle
- 3 ravitaillements: ~7km, ~14km, ~23km

**Sprint (17km):**
- 1 poste de contrôle
- 2 ravitaillements: ~7km, ~14km

**Mini Trail (10km):**
- 1 ravitaillement: ~7km

**Randonnée (8km):**
- 1 ravitaillement: ~5,5km

⚠️ **Note:** Pas de gobelets aux ravitaillements. Chaque participant doit apporter son propre récipient pour liquides.

---

## 📞 Contacts

**Organisation:** A.C.R.S.I. - Santa Iria Bike Team  
**Inscriptions:** https://registerandgo.net

---

🏃 **Venez courir la 10ème édition du Trail Ribeira de Limas!** 🌄`,
      city: "Santa Iria",
      metaTitle:
        "X Trail Ribeira de Limas 2026 - 10ème Édition | Santa Iria, Serpa | 15 Février",
      metaDescription:
        "X Trail Ribeira de Limas le 15 février 2026 à Santa Iria, Serpa. Courses: Trail 32km, Sprint 17km, Mini Trail 10km et Randonnée 8km. Circuit National ATRP.",
    },
    de: {
      title: "X Trail Ribeira de Limas 2026",
      description: `**🏃 X Trail Ribeira de Limas 2026 - 10. Ausgabe**

Der **X Trail Ribeira de Limas** findet am **15. Februar 2026** in **Santa Iria**, Gemeinde **Serpa**, statt. Organisiert von **A.C.R.S.I. - Santa Iria Bike Team** (Kultur- und Freizeitverein Santa Iria), mit Unterstützung der Stadtverwaltung Serpa und União de Juntas de Freguesia de Santa Maria e Salvador.

Dieser Trail ist Teil mehrerer Circuits: **Regionale Trail-Meisterschaft**, **Regionaler Sprint-Circuit**, **Nationaler Trail-Circuit (ATRP)**, **Nationaler Sprint-Circuit (ATRP)** und **Nationaler Jugend-Circuit (ATRP)**.

---

## 🏔️ Verfügbare Läufe

### **Trail** - ≈32 km
- **Zeitlimit:** 6h30
- **Mindestalter:** 20 Jahre
- **Zeitbarrieren:** 2. Verpflegungsstation (2h30), 4. Verpflegungsstation (4h15)
- **Plätze:** 150

### **Sprint** - ≈17 km
- **Zeitlimit:** 3h30
- **Mindestalter:** 18 Jahre
- **Plätze:** 300

### **Mini Trail** - ≈10 km
- **Mindestalter:** 14 Jahre
- **Plätze:** 150

### **Wanderung** - ≈8 km
- **Mindestalter:** 12 Jahre
- **Freizeitteilnahme - Keine Wertung**
- **Plätze:** 100

---

## 📍 Ort und Zeitplan

**Start und Ziel:** Kulturzentrum Santa Iria, Serpa

**Sekretariat:** Sonntag 15.02 - 08:00

**Briefing:** 08:50  
**Start:**
- 09:00 - Trail (32km)
- 09:20 - Sprint (17km)
- 09:30 - Mini Trail (10km)
- 09:35 - Wanderung (8km)

**Preisverleihung:** 13:00 (Änderungen vorbehalten)

---

## 🎯 Highlights

✅ Personen-Unfallversicherung  
✅ Frühstück inklusive  
✅ Feste und flüssige Verpflegung  
✅ Erfrischung im Ziel  
✅ 42K Technik-T-Shirt (Anmeldungen bis 24. Januar)  
✅ Finisher-Geschenk  
✅ Elektronische Zeitmessung

---

## 💰 Preise

**Phase 1 (bis 25. Januar 2026):**
- Trail (32km): €22,00
- Sprint (17km): €19,00
- Mini Trail (10km): €15,00
- Wanderung (8km): €15,00

**Phase 2 (bis 8. Februar 2026):**
- Trail (32km): €24,00
- Sprint (17km): €21,00
- Mini Trail (10km): €17,00
- Wanderung (8km): €17,00

**Anmeldeschluss:** 8. Februar 2026

---

## 📋 Obligatorische Ausrüstung

**Trail, Sprint und Mini Trail:**

✅ Thermodecke  
✅ Pfeife  
✅ Funktionierendes Mobiltelefon  
✅ Startnummer (sichtbar)

**Empfohlene Ausrüstung:** Kappe, Rucksack, Energienahrung

---

## 🏆 Preise

**Trail und Sprint:**
- Top 3 Gesamt M/F
- Top 3 pro Kategorie M/F

**Mini Trail:**
- Top 3 Gesamt M/F

**Teams:**
- Top 3 Teams in Trail und Sprint

---

## 📋 Kontroll- und Verpflegungsstationen

**Trail (32km):**
- 2 Kontrollposten
- 3 Verpflegungsstationen: ~7km, ~14km, ~23km

**Sprint (17km):**
- 1 Kontrollposten
- 2 Verpflegungsstationen: ~7km, ~14km

**Mini Trail (10km):**
- 1 Verpflegungsstation: ~7km

**Wanderung (8km):**
- 1 Verpflegungsstation: ~5,5km

⚠️ **Hinweis:** Keine Becher an Verpflegungsstationen. Jeder Teilnehmer muss einen eigenen Flüssigkeitsbehälter mitbringen.

---

## 📞 Kontakte

**Organisation:** A.C.R.S.I. - Santa Iria Bike Team  
**Anmeldung:** https://registerandgo.net

---

🏃 **Komm zur 10. Ausgabe des Trail Ribeira de Limas!** 🌄`,
      city: "Santa Iria",
      metaTitle:
        "X Trail Ribeira de Limas 2026 - 10. Ausgabe | Santa Iria, Serpa | 15. Februar",
      metaDescription:
        "X Trail Ribeira de Limas am 15. Februar 2026 in Santa Iria, Serpa. Läufe: Trail 32km, Sprint 17km, Mini Trail 10km und Wanderung 8km. ATRP Nationaler Circuit.",
    },
    it: {
      title: "X Trail Ribeira de Limas 2026",
      description: `**🏃 X Trail Ribeira de Limas 2026 - 10ª Edizione**

Il **X Trail Ribeira de Limas** si svolge il **15 febbraio 2026** a **Santa Iria**, comune di **Serpa**. Organizzato da **A.C.R.S.I. - Santa Iria Bike Team** (Associazione Culturale e Ricreativa di Santa Iria), con supporto del Comune di Serpa e União de Juntas de Freguesia de Santa Maria e Salvador.

Questo trail fa parte di più circuiti: **Campionato Regionale di Trail**, **Circuito Regionale di Sprint**, **Circuito Nazionale di Trail (ATRP)**, **Circuito Nazionale di Sprint (ATRP)** e **Circuito Nazionale Giovanile (ATRP)**.

---

## 🏔️ Gare Disponibili

### **Trail** - ≈32 km
- **Tempo Limite:** 6h30
- **Età Minima:** 20 anni
- **Barriere Orarie:** 2º Ristoro (2h30), 4º Ristoro (4h15)
- **Posti:** 150

### **Sprint** - ≈17 km
- **Tempo Limite:** 3h30
- **Età Minima:** 18 anni
- **Posti:** 300

### **Mini Trail** - ≈10 km
- **Età Minima:** 14 anni
- **Posti:** 150

### **Camminata** - ≈8 km
- **Età Minima:** 12 anni
- **Partecipazione ludica - Senza classifiche**
- **Posti:** 100

---

## 📍 Luogo e Orari

**Partenza e Arrivo:** Centro Culturale di Santa Iria, Serpa

**Segreteria:** Domenica 15/02 - 08:00

**Briefing:** 08:50  
**Partenza:**
- 09:00 - Trail (32km)
- 09:20 - Sprint (17km)
- 09:30 - Mini Trail (10km)
- 09:35 - Camminata (8km)

**Premiazione:** 13:00 (soggetto a modifiche)

---

## 🎯 Punti Salienti

✅ Assicurazione infortuni personali  
✅ Colazione inclusa  
✅ Ristori solidi e liquidi  
✅ Rinfresco all'arrivo  
✅ T-shirt tecnica 42K (iscrizioni fino al 24 gennaio)  
✅ Regalo finisher  
✅ Cronometraggio elettronico

---

## 💰 Prezzi

**Fase 1 (fino al 25 Gennaio 2026):**
- Trail (32km): €22,00
- Sprint (17km): €19,00
- Mini Trail (10km): €15,00
- Camminata (8km): €15,00

**Fase 2 (fino all'8 Febbraio 2026):**
- Trail (32km): €24,00
- Sprint (17km): €21,00
- Mini Trail (10km): €17,00
- Camminata (8km): €17,00

**Scadenza iscrizioni:** 8 febbraio 2026

---

## 📋 Attrezzatura Obbligatoria

**Trail, Sprint e Mini Trail:**

✅ Coperta termica  
✅ Fischietto  
✅ Telefono cellulare operativo  
✅ Pettorale (visibile)

**Attrezzatura Consigliata:** Berretto, zaino, alimenti energetici

---

## 🏆 Premi

**Trail e Sprint:**
- Top 3 generale M/F
- Top 3 per categoria M/F

**Mini Trail:**
- Top 3 generale M/F

**Squadre:**
- Top 3 squadre in Trail e Sprint

---

## 📋 Posti di Controllo e Ristoro

**Trail (32km):**
- 2 posti di controllo
- 3 ristori: ~7km, ~14km, ~23km

**Sprint (17km):**
- 1 posto di controllo
- 2 ristori: ~7km, ~14km

**Mini Trail (10km):**
- 1 ristoro: ~7km

**Camminata (8km):**
- 1 ristoro: ~5,5km

⚠️ **Nota:** Nessun bicchiere ai ristori. Ogni partecipante deve portare il proprio contenitore per liquidi.

---

## 📞 Contatti

**Organizzazione:** A.C.R.S.I. - Santa Iria Bike Team  
**Iscrizioni:** https://registerandgo.net

---

🏃 **Vieni a correre la 10ª edizione del Trail Ribeira de Limas!** 🌄`,
      city: "Santa Iria",
      metaTitle:
        "X Trail Ribeira de Limas 2026 - 10ª Edizione | Santa Iria, Serpa | 15 Febbraio",
      metaDescription:
        "X Trail Ribeira de Limas il 15 febbraio 2026 a Santa Iria, Serpa. Gare: Trail 32km, Sprint 17km, Mini Trail 10km e Camminata 8km. Circuito Nazionale ATRP.",
    },
  };

  // FAQ data for ALL 6 languages
  const faqs = {
    pt: [
      {
        question: "Onde posso fazer a inscrição?",
        answer:
          "As inscrições devem ser efetuadas online através do site https://registerandgo.net até dia 8 de fevereiro de 2026.",
      },
      {
        question: "Qual o prazo limite para inscrições?",
        answer:
          "As inscrições encerram no dia 8 de fevereiro de 2026. Após esta data poderão ser aceites inscrições caso não estejam esgotadas, mas não é garantido o kit completo individual.",
      },
      {
        question: "Qual é o material obrigatório?",
        answer:
          "Para Trail, Sprint e Mini Trail: manta térmica, apito, telemóvel operacional e dorsal visível. A falta de material obrigatório resulta em desclassificação.",
      },
      {
        question: "Existem barreiras horárias?",
        answer:
          "Sim. Trail: 6h30 de tempo limite com barreiras no 2º abastecimento (2h30) e 4º abastecimento (4h15). Sprint: 3h30 de tempo limite.",
      },
      {
        question: "Onde e quando posso levantar o dorsal?",
        answer:
          "No Centro Cultural de Santa Iria no dia 15 de fevereiro de 2026 a partir das 08h00.",
      },
      {
        question: "O que está incluído na inscrição?",
        answer:
          "Dorsal, seguro de acidentes pessoais, pequeno-almoço, abastecimentos líquidos e sólidos, reforço à chegada, T-shirt técnica 42K (inscrições até 24 janeiro) e brinde finisher.",
      },
      {
        question: "Quantos abastecimentos existem?",
        answer:
          "Trail: 3 abastecimentos (~7km, ~14km, ~23km). Sprint: 2 abastecimentos (~7km, ~14km). Mini Trail: 1 abastecimento (~7km). Caminhada: 1 abastecimento (~5,5km).",
      },
      {
        question: "A inscrição é reembolsável?",
        answer:
          "Não haverá devolução do valor de inscrição exceto se a prova for anulada por motivos imputáveis à organização.",
      },
      {
        question: "Há copos nos abastecimentos?",
        answer:
          "Não. Cada participante deve trazer o seu próprio recipiente para líquidos.",
      },
      {
        question: "Que prémios são atribuídos?",
        answer:
          "Trail e Sprint: Top 3 geral M/F e top 3 por escalão M/F. Mini Trail: Top 3 geral M/F. Também há prémios para as 3 primeiras equipas no Trail e Sprint.",
      },
    ],
    en: [
      {
        question: "Where can I register?",
        answer:
          "Registrations must be made online through https://registerandgo.net until February 8, 2026.",
      },
      {
        question: "What is the registration deadline?",
        answer:
          "Registrations close on February 8, 2026. After this date registrations may be accepted if not sold out, but the complete individual kit is not guaranteed.",
      },
      {
        question: "What is the mandatory equipment?",
        answer:
          "For Trail, Sprint and Mini Trail: thermal blanket, whistle, operational mobile phone and visible bib. Missing mandatory equipment results in disqualification.",
      },
      {
        question: "Are there time barriers?",
        answer:
          "Yes. Trail: 6h30 time limit with barriers at 2nd aid station (2h30) and 4th aid station (4h15). Sprint: 3h30 time limit.",
      },
      {
        question: "Where and when can I collect my bib?",
        answer:
          "At Santa Iria Cultural Center on February 15, 2026 from 08:00.",
      },
      {
        question: "What is included in registration?",
        answer:
          "Bib, personal accident insurance, breakfast, liquid and solid refreshments, refreshment at finish, 42K technical T-shirt (registrations until Jan 24) and finisher gift.",
      },
      {
        question: "How many aid stations are there?",
        answer:
          "Trail: 3 aid stations (~7km, ~14km, ~23km). Sprint: 2 aid stations (~7km, ~14km). Mini Trail: 1 aid station (~7km). Walk: 1 aid station (~5.5km).",
      },
      {
        question: "Is registration refundable?",
        answer:
          "There will be no refund of registration fees except if the race is canceled for reasons attributable to the organization.",
      },
      {
        question: "Are there cups at aid stations?",
        answer: "No. Each participant must bring their own liquid container.",
      },
      {
        question: "What awards are given?",
        answer:
          "Trail and Sprint: Top 3 overall M/F and top 3 per category M/F. Mini Trail: Top 3 overall M/F. There are also awards for the top 3 teams in Trail and Sprint.",
      },
    ],
    es: [
      {
        question: "¿Dónde puedo inscribirme?",
        answer:
          "Las inscripciones deben realizarse online a través de https://registerandgo.net hasta el 8 de febrero de 2026.",
      },
      {
        question: "¿Cuál es el plazo límite para inscripciones?",
        answer:
          "Las inscripciones cierran el 8 de febrero de 2026. Después de esta fecha pueden aceptarse inscripciones si no están agotadas, pero no se garantiza el kit completo individual.",
      },
      {
        question: "¿Cuál es el material obligatorio?",
        answer:
          "Para Trail, Sprint y Mini Trail: manta térmica, silbato, teléfono móvil operativo y dorsal visible. La falta de material obligatorio resulta en descalificación.",
      },
      {
        question: "¿Hay barreras horarias?",
        answer:
          "Sí. Trail: tiempo límite de 6h30 con barreras en el 2º avituallamiento (2h30) y 4º avituallamiento (4h15). Sprint: tiempo límite de 3h30.",
      },
      {
        question: "¿Dónde y cuándo puedo recoger el dorsal?",
        answer:
          "En el Centro Cultural de Santa Iria el 15 de febrero de 2026 a partir de las 08:00.",
      },
      {
        question: "¿Qué incluye la inscripción?",
        answer:
          "Dorsal, seguro de accidentes personales, desayuno, avituallamientos líquidos y sólidos, refresco en la llegada, camiseta técnica 42K (inscripciones hasta 24 enero) y regalo finisher.",
      },
      {
        question: "¿Cuántos avituallamientos hay?",
        answer:
          "Trail: 3 avituallamientos (~7km, ~14km, ~23km). Sprint: 2 avituallamientos (~7km, ~14km). Mini Trail: 1 avituallamiento (~7km). Caminata: 1 avituallamiento (~5,5km).",
      },
      {
        question: "¿Es reembolsable la inscripción?",
        answer:
          "No habrá devolución de la cuota de inscripción excepto si la carrera es cancelada por razones atribuibles a la organización.",
      },
      {
        question: "¿Hay vasos en los avituallamientos?",
        answer:
          "No. Cada participante debe traer su propio recipiente para líquidos.",
      },
      {
        question: "¿Qué premios se otorgan?",
        answer:
          "Trail y Sprint: Top 3 general M/F y top 3 por categoría M/F. Mini Trail: Top 3 general M/F. También hay premios para los 3 primeros equipos en Trail y Sprint.",
      },
    ],
    fr: [
      {
        question: "Où puis-je m'inscrire?",
        answer:
          "Les inscriptions doivent être effectuées en ligne via https://registerandgo.net jusqu'au 8 février 2026.",
      },
      {
        question: "Quelle est la date limite d'inscription?",
        answer:
          "Les inscriptions ferment le 8 février 2026. Après cette date, des inscriptions peuvent être acceptées si non complètes, mais le kit individuel complet n'est pas garanti.",
      },
      {
        question: "Quel est l'équipement obligatoire?",
        answer:
          "Pour Trail, Sprint et Mini Trail: couverture thermique, sifflet, téléphone portable opérationnel et dossard visible. L'absence d'équipement obligatoire entraîne la disqualification.",
      },
      {
        question: "Y a-t-il des barrières horaires?",
        answer:
          "Oui. Trail: temps limite de 6h30 avec barrières au 2ème ravitaillement (2h30) et 4ème ravitaillement (4h15). Sprint: temps limite de 3h30.",
      },
      {
        question: "Où et quand puis-je récupérer mon dossard?",
        answer:
          "Au Centre Culturel de Santa Iria le 15 février 2026 à partir de 08h00.",
      },
      {
        question: "Qu'est-ce qui est inclus dans l'inscription?",
        answer:
          "Dossard, assurance accidents personnels, petit-déjeuner, ravitaillements liquides et solides, rafraîchissement à l'arrivée, T-shirt technique 42K (inscriptions jusqu'au 24 janvier) et cadeau finisher.",
      },
      {
        question: "Combien de postes de ravitaillement y a-t-il?",
        answer:
          "Trail: 3 ravitaillements (~7km, ~14km, ~23km). Sprint: 2 ravitaillements (~7km, ~14km). Mini Trail: 1 ravitaillement (~7km). Randonnée: 1 ravitaillement (~5,5km).",
      },
      {
        question: "L'inscription est-elle remboursable?",
        answer:
          "Il n'y aura pas de remboursement des frais d'inscription sauf si la course est annulée pour des raisons imputables à l'organisation.",
      },
      {
        question: "Y a-t-il des gobelets aux ravitaillements?",
        answer:
          "Non. Chaque participant doit apporter son propre récipient pour liquides.",
      },
      {
        question: "Quelles récompenses sont attribuées?",
        answer:
          "Trail et Sprint: Top 3 général H/F et top 3 par catégorie H/F. Mini Trail: Top 3 général H/F. Il y a aussi des récompenses pour les 3 premières équipes en Trail et Sprint.",
      },
    ],
    de: [
      {
        question: "Wo kann ich mich anmelden?",
        answer:
          "Anmeldungen müssen online über https://registerandgo.net bis zum 8. Februar 2026 erfolgen.",
      },
      {
        question: "Was ist die Anmeldefrist?",
        answer:
          "Anmeldungen schließen am 8. Februar 2026. Nach diesem Datum können Anmeldungen akzeptiert werden, wenn nicht ausverkauft, aber das vollständige individuelle Kit ist nicht garantiert.",
      },
      {
        question: "Was ist die obligatorische Ausrüstung?",
        answer:
          "Für Trail, Sprint und Mini Trail: Thermodecke, Pfeife, funktionierendes Mobiltelefon und sichtbare Startnummer. Fehlende obligatorische Ausrüstung führt zur Disqualifikation.",
      },
      {
        question: "Gibt es Zeitbarrieren?",
        answer:
          "Ja. Trail: Zeitlimit von 6h30 mit Barrieren an der 2. Verpflegungsstation (2h30) und 4. Verpflegungsstation (4h15). Sprint: Zeitlimit von 3h30.",
      },
      {
        question: "Wo und wann kann ich meine Startnummer abholen?",
        answer: "Im Kulturzentrum Santa Iria am 15. Februar 2026 ab 08:00 Uhr.",
      },
      {
        question: "Was ist in der Anmeldung enthalten?",
        answer:
          "Startnummer, Personen-Unfallversicherung, Frühstück, flüssige und feste Verpflegung, Erfrischung im Ziel, 42K Technik-T-Shirt (Anmeldungen bis 24. Januar) und Finisher-Geschenk.",
      },
      {
        question: "Wie viele Verpflegungsstationen gibt es?",
        answer:
          "Trail: 3 Verpflegungsstationen (~7km, ~14km, ~23km). Sprint: 2 Verpflegungsstationen (~7km, ~14km). Mini Trail: 1 Verpflegungsstation (~7km). Wanderung: 1 Verpflegungsstation (~5,5km).",
      },
      {
        question: "Ist die Anmeldung erstattungsfähig?",
        answer:
          "Es gibt keine Rückerstattung der Anmeldegebühren, außer wenn das Rennen aus Gründen abgesagt wird, die der Organisation zuzuschreiben sind.",
      },
      {
        question: "Gibt es Becher an Verpflegungsstationen?",
        answer:
          "Nein. Jeder Teilnehmer muss seinen eigenen Flüssigkeitsbehälter mitbringen.",
      },
      {
        question: "Welche Preise werden vergeben?",
        answer:
          "Trail und Sprint: Top 3 Gesamt M/F und Top 3 pro Kategorie M/F. Mini Trail: Top 3 Gesamt M/F. Es gibt auch Preise für die Top 3 Teams in Trail und Sprint.",
      },
    ],
    it: [
      {
        question: "Dove posso iscrivermi?",
        answer:
          "Le iscrizioni devono essere effettuate online tramite https://registerandgo.net fino all'8 febbraio 2026.",
      },
      {
        question: "Qual è il termine di iscrizione?",
        answer:
          "Le iscrizioni chiudono l'8 febbraio 2026. Dopo questa data possono essere accettate iscrizioni se non esaurite, ma il kit individuale completo non è garantito.",
      },
      {
        question: "Qual è l'attrezzatura obbligatoria?",
        answer:
          "Per Trail, Sprint e Mini Trail: coperta termica, fischietto, telefono cellulare operativo e pettorale visibile. La mancanza di attrezzatura obbligatoria comporta la squalifica.",
      },
      {
        question: "Ci sono barriere orarie?",
        answer:
          "Sì. Trail: tempo limite di 6h30 con barriere al 2º ristoro (2h30) e 4º ristoro (4h15). Sprint: tempo limite di 3h30.",
      },
      {
        question: "Dove e quando posso ritirare il pettorale?",
        answer:
          "Al Centro Culturale di Santa Iria il 15 febbraio 2026 dalle 08:00.",
      },
      {
        question: "Cosa è incluso nell'iscrizione?",
        answer:
          "Pettorale, assicurazione infortuni personali, colazione, ristori liquidi e solidi, rinfresco all'arrivo, T-shirt tecnica 42K (iscrizioni fino al 24 gennaio) e regalo finisher.",
      },
      {
        question: "Quanti posti di ristoro ci sono?",
        answer:
          "Trail: 3 ristori (~7km, ~14km, ~23km). Sprint: 2 ristori (~7km, ~14km). Mini Trail: 1 ristoro (~7km). Camminata: 1 ristoro (~5,5km).",
      },
      {
        question: "L'iscrizione è rimborsabile?",
        answer:
          "Non ci sarà rimborso delle quote di iscrizione tranne se la gara viene annullata per motivi imputabili all'organizzazione.",
      },
      {
        question: "Ci sono bicchieri ai ristori?",
        answer:
          "No. Ogni partecipante deve portare il proprio contenitore per liquidi.",
      },
      {
        question: "Quali premi vengono assegnati?",
        answer:
          "Trail e Sprint: Top 3 generale M/F e top 3 per categoria M/F. Mini Trail: Top 3 generale M/F. Ci sono anche premi per le prime 3 squadre in Trail e Sprint.",
      },
    ],
  };

  // Create event
  const event = await prisma.event.create({
    data: {
      title: "X Trail Ribeira de Limas 2026",
      slug: eventSlug,
      description:
        "X Trail Ribeira de Limas 2026 - 10ª Edição em Santa Iria, Serpa. Organizado pela Santa Iria Bike Team. Circuito Nacional ATRP.",
      startDate: eventStartDate,
      endDate: eventEndDate,
      city: "Santa Iria",
      country: "Portugal",
      sportTypes: [SportType.TRAIL],
      imageUrl: "",
      externalUrl: "https://registerandgo.net",
      registrationDeadline: new Date("2026-02-08T23:59:59Z"),
      latitude: 37.9456,
      longitude: -7.5984,
      googleMapsUrl: "https://maps.app.goo.gl/7XvYZ3cQ8nRkW9qE8",
      isFeatured: false,
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
      name: "Trail",
      distanceKm: 32.0,
      elevationGainM: null,
      elevationLossM: null,
      cutoffTimeHours: 6.5,
      mountainLevel: 3,
      maxParticipants: 150,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-26T00:00:00Z"),
          endDate: new Date("2026-01-25T23:59:59Z"),
          price: 22.0,
          currency: Currency.EUR,
          note: "26 Setembro 2025 a 25 Janeiro 2026",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-26T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 24.0,
          currency: Currency.EUR,
          note: "26 Janeiro a 8 Fevereiro 2026",
        },
      ],
    },
    {
      name: "Sprint",
      distanceKm: 17.0,
      elevationGainM: null,
      elevationLossM: null,
      cutoffTimeHours: 3.5,
      mountainLevel: 2,
      maxParticipants: 300,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-26T00:00:00Z"),
          endDate: new Date("2026-01-25T23:59:59Z"),
          price: 19.0,
          currency: Currency.EUR,
          note: "26 Setembro 2025 a 25 Janeiro 2026",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-26T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 21.0,
          currency: Currency.EUR,
          note: "26 Janeiro a 8 Fevereiro 2026",
        },
      ],
    },
    {
      name: "Mini Trail",
      distanceKm: 10.0,
      elevationGainM: null,
      elevationLossM: null,
      cutoffTimeHours: null,
      mountainLevel: 1,
      maxParticipants: 150,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-26T00:00:00Z"),
          endDate: new Date("2026-01-25T23:59:59Z"),
          price: 15.0,
          currency: Currency.EUR,
          note: "Idade mínima: 14 anos",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-26T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 17.0,
          currency: Currency.EUR,
          note: "Idade mínima: 14 anos",
        },
      ],
    },
    {
      name: "Caminhada",
      distanceKm: 8.0,
      elevationGainM: null,
      elevationLossM: null,
      cutoffTimeHours: null,
      mountainLevel: 1,
      maxParticipants: 100,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-09-26T00:00:00Z"),
          endDate: new Date("2026-01-25T23:59:59Z"),
          price: 15.0,
          currency: Currency.EUR,
          note: "Sem classificações - Participação lúdica",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-26T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 17.0,
          currency: Currency.EUR,
          note: "Sem classificações - Participação lúdica",
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

  console.log("✅ X Trail Ribeira de Limas 2026 seed completed successfully!");
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedTrailRibeiraLimas2026()
    .catch((e) => {
      console.error("❌ Error seeding Trail Ribeira de Limas 2026:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
