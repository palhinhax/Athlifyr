import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedTrailBombeiros2026() {
  console.log(
    "🚒 Seeding IV Trail dos Bombeiros - Comandante 'Zé António' 2026..."
  );

  // Base event data
  const eventSlug = "trail-bombeiros-fornos-algodres-2026";
  const eventStartDate = new Date("2026-02-15T09:00:00Z");
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
      title: 'IV Trail dos Bombeiros - Comandante "Zé António"',
      description: `**🚒 IV Trail dos Bombeiros - Comandante "Zé António" 2026**

O **IV Trail dos Bombeiros - Comandante "Zé António"** realiza-se a **15 de fevereiro de 2026** em **Fornos de Algodres**, distrito da **Guarda**. Organizado pelos **Bombeiros Voluntários de Fornos de Algodres**, com apoio técnico da **AVCAT - Associação Vila Chã Aldeia Trail de Portugal**.

Este trail faz parte do **Circuito de Trail da Beira Alta 2026 - VI(r)VER BEIRA ALTA** e será a **1ª etapa** do circuito.

---

## 🏔️ Provas Disponíveis

### **Trail Longo** - ≈25 km
- **Desnível Positivo:** ≈1000D+
- **Tempo Limite:** 04h30
- **Idade Mínima:** 18 anos (ou nascidos até 31/12/2011 com autorização parental)

### **Trail Curto** - ≈15 km
- **Desnível Positivo:** ≈700D+
- **Tempo Limite:** 03h00
- **Idade Mínima:** 18 anos (ou nascidos até 31/12/2011 com autorização parental)

### **Mini Trail** - ≈9 km
- **Desnível Positivo:** ≈400D+
- **Idade:** 11 a 14 anos (com autorização parental)
- **Circuito de Trail Jovem**

### **Caminhada** - ≈9 km
- **Desnível Positivo:** ≈400D+
- **Participação lúdica**
- **Aberta a todos**

---

## 📍 Local e Horários

**Partida e Chegada:** Quartel dos Bombeiros Voluntários de Fornos de Algodres

**Secretariado:**
- Sábado 14/02: 15h00 - 18h00
- Domingo 15/02: 07h30 - 08h50

**Briefing:** 08h50  
**Partida:**
- 09h00 - Trail Longo
- 09h15 - Trail Curto
- 09h20 - Mini Trail e Caminhada

**Almoço:** 12h00  
**Entrega de Prémios:** 13h30

---

## 🎯 Destaques

✅ Seguro de acidentes pessoais e responsabilidade civil  
✅ Dorsal eletrónico com números de emergência  
✅ Abastecimentos sólidos e líquidos  
✅ Brinde finisher para todos os participantes  
✅ Brinde alusivo ao evento  
✅ Almoço opcional (adicional)  
✅ Cronometragem eletrónica  
✅ Troféus e medalhas aos classificados

---

## 💰 Preços

- **Trail Longo (25km):** €16,00
- **Trail Curto (15km):** €14,00
- **Mini Trail (9km):** €12,00
- **Caminhada (9km):** €11,00
- **Almoço (adicional para participantes):** €8,00
- **Almoço Acompanhantes:** €12,00

**Data limite de inscrição:** 10 de fevereiro de 2026 às 23h59

---

## 📋 Material Sugerido/Obrigatório

✅ Telemóvel (obrigatório)  
✅ Recipiente para água (obrigatório)  
✅ Manta térmica  
✅ Apito  
✅ Corta vento  
✅ Mochila  
✅ Boné  
✅ Calçado e vestuário adequados

---

## 🏆 Prémios

**Trail Longo e Trail Curto:**
- Troféu aos 3 primeiros classificados da geral M/F
- Diploma aos 4º e 5º classificados da geral M/F
- Medalha aos 3 primeiros classificados de cada escalão M/F

**Mini Trail:**
- Troféu aos 3 primeiros classificados da geral M/F
- Medalha aos 3 primeiros classificados de cada escalão M/F (Circuito Jovem)

---

## 📋 Postos de Controlo e Abastecimento

**Trail Longo:** 2 postos de controlo e abastecimento + meta  
**Trail Curto:** 1 posto de controlo e abastecimento + meta  
**Mini Trail e Caminhada:** 1 posto de controlo e abastecimento + meta

⚠️ **Nota:** Água e líquidos destinam-se a encher depósitos próprios. Não existem copos nos postos de abastecimento.

---

## 📞 Contactos

**Organização:** Bombeiros Voluntários de Fornos de Algodres  
**Apoio Técnico:** AVCAT - Associação Vila Chã Aldeia Trail de Portugal  
**Telemóvel:** 962 818 607  
**Email:** vilachaaldeiatrailpt@gmail.com  
**Inscrições:** www.acorrer.pt

---

🚒 **Vem apoiar os Bombeiros de Fornos de Algodres e honrar a memória do Comandante "Zé António"!** 🏃`,
      city: "Fornos de Algodres",
      metaTitle:
        'IV Trail dos Bombeiros - Comandante "Zé António" 2026 | Fornos de Algodres | 15 Fevereiro',
      metaDescription:
        "IV Trail dos Bombeiros a 15 de fevereiro de 2026 em Fornos de Algodres, Guarda. Provas: Trail Longo 25km, Trail Curto 15km, Mini Trail 9km e Caminhada. Circuito Beira Alta - 1ª Etapa.",
    },
    en: {
      title: 'IV Firefighters Trail - Commander "Zé António"',
      description: `**🚒 IV Firefighters Trail - Commander "Zé António" 2026**

The **IV Firefighters Trail - Commander "Zé António"** takes place on **February 15, 2026** in **Fornos de Algodres**, district of **Guarda**. Organized by **Fornos de Algodres Volunteer Firefighters**, with technical support from **AVCAT - Vila Chã Aldeia Trail Association of Portugal**.

This trail is part of the **Beira Alta Trail Circuit 2026 - VI(r)VER BEIRA ALTA** and will be the **1st stage** of the circuit.

---

## 🏔️ Available Races

### **Long Trail** - ≈25 km
- **Elevation Gain:** ≈1000D+
- **Time Limit:** 04h30
- **Minimum Age:** 18 years (or born until 31/12/2011 with parental authorization)

### **Short Trail** - ≈15 km
- **Elevation Gain:** ≈700D+
- **Time Limit:** 03h00
- **Minimum Age:** 18 years (or born until 31/12/2011 with parental authorization)

### **Mini Trail** - ≈9 km
- **Elevation Gain:** ≈400D+
- **Age:** 11 to 14 years (with parental authorization)
- **Youth Trail Circuit**

### **Walk** - ≈9 km
- **Elevation Gain:** ≈400D+
- **Recreational participation**
- **Open to all**

---

## 📍 Location and Schedule

**Start and Finish:** Fornos de Algodres Volunteer Firefighters Station

**Registration:**
- Saturday 14/02: 15:00 - 18:00
- Sunday 15/02: 07:30 - 08:50

**Briefing:** 08:50  
**Start:**
- 09:00 - Long Trail
- 09:15 - Short Trail
- 09:20 - Mini Trail and Walk

**Lunch:** 12:00  
**Award Ceremony:** 13:30

---

## 🎯 Highlights

✅ Personal accident and civil liability insurance  
✅ Electronic bib with emergency numbers  
✅ Solid and liquid refreshments  
✅ Finisher gift for all participants  
✅ Event souvenir for all participants  
✅ Optional lunch (additional)  
✅ Electronic timing  
✅ Trophies and medals for classified athletes

---

## 💰 Prices

- **Long Trail (25km):** €16.00
- **Short Trail (15km):** €14.00
- **Mini Trail (9km):** €12.00
- **Walk (9km):** €11.00
- **Lunch (additional for participants):** €8.00
- **Companions Lunch:** €12.00

**Registration deadline:** February 10, 2026 at 23:59

---

## 📋 Suggested/Mandatory Equipment

✅ Mobile phone (mandatory)  
✅ Water container (mandatory)  
✅ Thermal blanket  
✅ Whistle  
✅ Windbreaker  
✅ Backpack  
✅ Cap  
✅ Appropriate footwear and clothing

---

## 🏆 Awards

**Long Trail and Short Trail:**
- Trophy to top 3 overall M/F
- Diploma to 4th and 5th overall M/F
- Medal to top 3 in each category M/F

**Mini Trail:**
- Trophy to top 3 overall M/F
- Medal to top 3 in each category M/F (Youth Circuit)

---

## 📋 Control and Aid Stations

**Long Trail:** 2 control and aid stations + finish  
**Short Trail:** 1 control and aid station + finish  
**Mini Trail and Walk:** 1 control and aid station + finish

⚠️ **Note:** Water and liquids are for filling personal containers. No cups at aid stations.

---

## 📞 Contacts

**Organization:** Fornos de Algodres Volunteer Firefighters  
**Technical Support:** AVCAT - Vila Chã Aldeia Trail Association of Portugal  
**Mobile:** 962 818 607  
**Email:** vilachaaldeiatrailpt@gmail.com  
**Registration:** www.acorrer.pt

---

🚒 **Come support the Fornos de Algodres Firefighters and honor the memory of Commander "Zé António"!** 🏃`,
      city: "Fornos de Algodres",
      metaTitle:
        'IV Firefighters Trail - Commander "Zé António" 2026 | Fornos de Algodres | 15 February',
      metaDescription:
        "IV Firefighters Trail on February 15, 2026 in Fornos de Algodres, Guarda. Races: Long Trail 25km, Short Trail 15km, Mini Trail 9km and Walk. Beira Alta Circuit - 1st Stage.",
    },
    es: {
      title: 'IV Trail de los Bomberos - Comandante "Zé António"',
      description: `**🚒 IV Trail de los Bomberos - Comandante "Zé António" 2026**

El **IV Trail de los Bomberos - Comandante "Zé António"** se celebra el **15 de febrero de 2026** en **Fornos de Algodres**, distrito de **Guarda**. Organizado por los **Bomberos Voluntarios de Fornos de Algodres**, con apoyo técnico de **AVCAT - Asociación Vila Chã Aldeia Trail de Portugal**.

Este trail forma parte del **Circuito de Trail de Beira Alta 2026 - VI(r)VER BEIRA ALTA** y será la **1ª etapa** del circuito.

---

## 🏔️ Carreras Disponibles

### **Trail Largo** - ≈25 km
- **Desnivel Positivo:** ≈1000D+
- **Tiempo Límite:** 04h30
- **Edad Mínima:** 18 años (o nacidos hasta 31/12/2011 con autorización parental)

### **Trail Corto** - ≈15 km
- **Desnivel Positivo:** ≈700D+
- **Tiempo Límite:** 03h00
- **Edad Mínima:** 18 años (o nacidos hasta 31/12/2011 con autorización parental)

### **Mini Trail** - ≈9 km
- **Desnivel Positivo:** ≈400D+
- **Edad:** 11 a 14 años (con autorización parental)
- **Circuito de Trail Juvenil**

### **Caminata** - ≈9 km
- **Desnivel Positivo:** ≈400D+
- **Participación lúdica**
- **Abierta a todos**

---

## 📍 Ubicación y Horario

**Salida y Meta:** Cuartel de Bomberos Voluntarios de Fornos de Algodres

**Secretaría:**
- Sábado 14/02: 15:00 - 18:00
- Domingo 15/02: 07:30 - 08:50

**Briefing:** 08:50  
**Salida:**
- 09:00 - Trail Largo
- 09:15 - Trail Corto
- 09:20 - Mini Trail y Caminata

**Almuerzo:** 12:00  
**Entrega de Premios:** 13:30

---

## 🎯 Destacados

✅ Seguro de accidentes personales y responsabilidad civil  
✅ Dorsal electrónico con números de emergencia  
✅ Avituallamientos sólidos y líquidos  
✅ Regalo finisher para todos los participantes  
✅ Recuerdo alusivo al evento  
✅ Almuerzo opcional (adicional)  
✅ Cronometraje electrónico  
✅ Trofeos y medallas a los clasificados

---

## 💰 Precios

- **Trail Largo (25km):** €16,00
- **Trail Corto (15km):** €14,00
- **Mini Trail (9km):** €12,00
- **Caminata (9km):** €11,00
- **Almuerzo (adicional para participantes):** €8,00
- **Almuerzo Acompañantes:** €12,00

**Fecha límite de inscripción:** 10 de febrero de 2026 a las 23:59

---

## 📋 Material Sugerido/Obligatorio

✅ Teléfono móvil (obligatorio)  
✅ Recipiente para agua (obligatorio)  
✅ Manta térmica  
✅ Silbato  
✅ Cortavientos  
✅ Mochila  
✅ Gorra  
✅ Calzado y ropa adecuados

---

## 🏆 Premios

**Trail Largo y Trail Corto:**
- Trofeo a los 3 primeros clasificados generales M/F
- Diploma a los 4º y 5º clasificados generales M/F
- Medalla a los 3 primeros clasificados de cada categoría M/F

**Mini Trail:**
- Trofeo a los 3 primeros clasificados generales M/F
- Medalla a los 3 primeros clasificados de cada categoría M/F (Circuito Juvenil)

---

## 📋 Puestos de Control y Avituallamiento

**Trail Largo:** 2 puestos de control y avituallamiento + meta  
**Trail Corto:** 1 puesto de control y avituallamiento + meta  
**Mini Trail y Caminata:** 1 puesto de control y avituallamiento + meta

⚠️ **Nota:** Agua y líquidos son para rellenar depósitos propios. No hay vasos en los puestos de avituallamiento.

---

## 📞 Contactos

**Organización:** Bomberos Voluntarios de Fornos de Algodres  
**Apoyo Técnico:** AVCAT - Asociación Vila Chã Aldeia Trail de Portugal  
**Móvil:** 962 818 607  
**Email:** vilachaaldeiatrailpt@gmail.com  
**Inscripciones:** www.acorrer.pt

---

🚒 **¡Ven a apoyar a los Bomberos de Fornos de Algodres y honrar la memoria del Comandante "Zé António"!** 🏃`,
      city: "Fornos de Algodres",
      metaTitle:
        'IV Trail de los Bomberos - Comandante "Zé António" 2026 | Fornos de Algodres | 15 Febrero',
      metaDescription:
        "IV Trail de los Bomberos el 15 de febrero de 2026 en Fornos de Algodres, Guarda. Carreras: Trail Largo 25km, Trail Corto 15km, Mini Trail 9km y Caminata. Circuito Beira Alta - 1ª Etapa.",
    },
    fr: {
      title: 'IV Trail des Pompiers - Commandant "Zé António"',
      description: `**🚒 IV Trail des Pompiers - Commandant "Zé António" 2026**

Le **IV Trail des Pompiers - Commandant "Zé António"** se déroule le **15 février 2026** à **Fornos de Algodres**, district de **Guarda**. Organisé par les **Pompiers Volontaires de Fornos de Algodres**, avec le soutien technique de **AVCAT - Association Vila Chã Aldeia Trail du Portugal**.

Ce trail fait partie du **Circuit de Trail de Beira Alta 2026 - VI(r)VER BEIRA ALTA** et sera la **1ère étape** du circuit.

---

## 🏔️ Courses Disponibles

### **Trail Long** - ≈25 km
- **Dénivelé Positif:** ≈1000D+
- **Temps Limite:** 04h30
- **Âge Minimum:** 18 ans (ou nés jusqu'au 31/12/2011 avec autorisation parentale)

### **Trail Court** - ≈15 km
- **Dénivelé Positif:** ≈700D+
- **Temps Limite:** 03h00
- **Âge Minimum:** 18 ans (ou nés jusqu'au 31/12/2011 avec autorisation parentale)

### **Mini Trail** - ≈9 km
- **Dénivelé Positif:** ≈400D+
- **Âge:** 11 à 14 ans (avec autorisation parentale)
- **Circuit de Trail Junior**

### **Randonnée** - ≈9 km
- **Dénivelé Positif:** ≈400D+
- **Participation ludique**
- **Ouvert à tous**

---

## 📍 Lieu et Horaires

**Départ et Arrivée:** Caserne des Pompiers Volontaires de Fornos de Algodres

**Secrétariat:**
- Samedi 14/02: 15h00 - 18h00
- Dimanche 15/02: 07h30 - 08h50

**Briefing:** 08h50  
**Départ:**
- 09h00 - Trail Long
- 09h15 - Trail Court
- 09h20 - Mini Trail et Randonnée

**Déjeuner:** 12h00  
**Remise des Prix:** 13h30

---

## 🎯 Points Forts

✅ Assurance accidents personnels et responsabilité civile  
✅ Dossard électronique avec numéros d'urgence  
✅ Ravitaillements solides et liquides  
✅ Cadeau finisher pour tous les participants  
✅ Souvenir de l'événement  
✅ Déjeuner optionnel (supplément)  
✅ Chronométrage électronique  
✅ Trophées et médailles aux classés

---

## 💰 Prix

- **Trail Long (25km):** €16,00
- **Trail Court (15km):** €14,00
- **Mini Trail (9km):** €12,00
- **Randonnée (9km):** €11,00
- **Déjeuner (supplément pour participants):** €8,00
- **Déjeuner Accompagnants:** €12,00

**Date limite d'inscription:** 10 février 2026 à 23h59

---

## 📋 Équipement Suggéré/Obligatoire

✅ Téléphone portable (obligatoire)  
✅ Récipient pour eau (obligatoire)  
✅ Couverture thermique  
✅ Sifflet  
✅ Coupe-vent  
✅ Sac à dos  
✅ Casquette  
✅ Chaussures et vêtements appropriés

---

## 🏆 Récompenses

**Trail Long et Trail Court:**
- Trophée aux 3 premiers classés général H/F
- Diplôme aux 4ème et 5ème classés général H/F
- Médaille aux 3 premiers classés de chaque catégorie H/F

**Mini Trail:**
- Trophée aux 3 premiers classés général H/F
- Médaille aux 3 premiers classés de chaque catégorie H/F (Circuit Junior)

---

## 📋 Postes de Contrôle et Ravitaillement

**Trail Long:** 2 postes de contrôle et ravitaillement + arrivée  
**Trail Court:** 1 poste de contrôle et ravitaillement + arrivée  
**Mini Trail et Randonnée:** 1 poste de contrôle et ravitaillement + arrivée

⚠️ **Note:** L'eau et les liquides sont pour remplir vos contenants personnels. Pas de gobelets aux postes de ravitaillement.

---

## 📞 Contacts

**Organisation:** Pompiers Volontaires de Fornos de Algodres  
**Soutien Technique:** AVCAT - Association Vila Chã Aldeia Trail du Portugal  
**Portable:** 962 818 607  
**Email:** vilachaaldeiatrailpt@gmail.com  
**Inscriptions:** www.acorrer.pt

---

🚒 **Venez soutenir les Pompiers de Fornos de Algodres et honorer la mémoire du Commandant "Zé António"!** 🏃`,
      city: "Fornos de Algodres",
      metaTitle:
        'IV Trail des Pompiers - Commandant "Zé António" 2026 | Fornos de Algodres | 15 Février',
      metaDescription:
        "IV Trail des Pompiers le 15 février 2026 à Fornos de Algodres, Guarda. Courses: Trail Long 25km, Trail Court 15km, Mini Trail 9km et Randonnée. Circuit Beira Alta - 1ère Étape.",
    },
    de: {
      title: 'IV Feuerwehr Trail - Kommandant "Zé António"',
      description: `**🚒 IV Feuerwehr Trail - Kommandant "Zé António" 2026**

Der **IV Feuerwehr Trail - Kommandant "Zé António"** findet am **15. Februar 2026** in **Fornos de Algodres**, Bezirk **Guarda**, statt. Organisiert von der **Freiwilligen Feuerwehr Fornos de Algodres**, mit technischer Unterstützung von **AVCAT - Vila Chã Aldeia Trail Verband Portugal**.

Dieser Trail ist Teil des **Beira Alta Trail Circuit 2026 - VI(r)VER BEIRA ALTA** und ist die **1. Etappe** des Circuits.

---

## 🏔️ Verfügbare Läufe

### **Langer Trail** - ≈25 km
- **Höhenunterschied:** ≈1000D+
- **Zeitlimit:** 04h30
- **Mindestalter:** 18 Jahre (oder geboren bis 31.12.2011 mit elterlicher Genehmigung)

### **Kurzer Trail** - ≈15 km
- **Höhenunterschied:** ≈700D+
- **Zeitlimit:** 03h00
- **Mindestalter:** 18 Jahre (oder geboren bis 31.12.2011 mit elterlicher Genehmigung)

### **Mini Trail** - ≈9 km
- **Höhenunterschied:** ≈400D+
- **Alter:** 11 bis 14 Jahre (mit elterlicher Genehmigung)
- **Jugend Trail Circuit**

### **Wanderung** - ≈9 km
- **Höhenunterschied:** ≈400D+
- **Freizeitteilnahme**
- **Offen für alle**

---

## 📍 Ort und Zeitplan

**Start und Ziel:** Feuerwehrhaus Fornos de Algodres

**Sekretariat:**
- Samstag 14.02: 15:00 - 18:00
- Sonntag 15.02: 07:30 - 08:50

**Briefing:** 08:50  
**Start:**
- 09:00 - Langer Trail
- 09:15 - Kurzer Trail
- 09:20 - Mini Trail und Wanderung

**Mittagessen:** 12:00  
**Preisverleihung:** 13:30

---

## 🎯 Highlights

✅ Personen- und Haftpflichtversicherung  
✅ Elektronische Startnummer mit Notfallnummern  
✅ Feste und flüssige Verpflegung  
✅ Finisher-Geschenk für alle Teilnehmer  
✅ Event-Souvenir  
✅ Optionales Mittagessen (zusätzlich)  
✅ Elektronische Zeitmessung  
✅ Trophäen und Medaillen für Platzierte

---

## 💰 Preise

- **Langer Trail (25km):** €16,00
- **Kurzer Trail (15km):** €14,00
- **Mini Trail (9km):** €12,00
- **Wanderung (9km):** €11,00
- **Mittagessen (zusätzlich für Teilnehmer):** €8,00
- **Mittagessen Begleiter:** €12,00

**Anmeldeschluss:** 10. Februar 2026 um 23:59

---

## 📋 Vorgeschlagene/Obligatorische Ausrüstung

✅ Mobiltelefon (obligatorisch)  
✅ Wasserbehälter (obligatorisch)  
✅ Thermodecke  
✅ Pfeife  
✅ Windjacke  
✅ Rucksack  
✅ Kappe  
✅ Geeignetes Schuhwerk und Kleidung

---

## 🏆 Preise

**Langer Trail und Kurzer Trail:**
- Trophäe für die Top 3 Gesamt M/F
- Diplom für 4. und 5. Platz Gesamt M/F
- Medaille für Top 3 jeder Kategorie M/F

**Mini Trail:**
- Trophäe für die Top 3 Gesamt M/F
- Medaille für Top 3 jeder Kategorie M/F (Jugend Circuit)

---

## 📋 Kontroll- und Verpflegungsstationen

**Langer Trail:** 2 Kontroll- und Verpflegungsstationen + Ziel  
**Kurzer Trail:** 1 Kontroll- und Verpflegungsstation + Ziel  
**Mini Trail und Wanderung:** 1 Kontroll- und Verpflegungsstation + Ziel

⚠️ **Hinweis:** Wasser und Flüssigkeiten sind zum Befüllen eigener Behälter. Keine Becher an Verpflegungsstationen.

---

## 📞 Kontakte

**Organisation:** Freiwillige Feuerwehr Fornos de Algodres  
**Technische Unterstützung:** AVCAT - Vila Chã Aldeia Trail Verband Portugal  
**Mobil:** 962 818 607  
**E-Mail:** vilachaaldeiatrailpt@gmail.com  
**Anmeldung:** www.acorrer.pt

---

🚒 **Komm und unterstütze die Feuerwehr Fornos de Algodres und ehre das Andenken an Kommandant "Zé António"!** 🏃`,
      city: "Fornos de Algodres",
      metaTitle:
        'IV Feuerwehr Trail - Kommandant "Zé António" 2026 | Fornos de Algodres | 15. Februar',
      metaDescription:
        "IV Feuerwehr Trail am 15. Februar 2026 in Fornos de Algodres, Guarda. Läufe: Langer Trail 25km, Kurzer Trail 15km, Mini Trail 9km und Wanderung. Beira Alta Circuit - 1. Etappe.",
    },
    it: {
      title: 'IV Trail dei Vigili del Fuoco - Comandante "Zé António"',
      description: `**🚒 IV Trail dei Vigili del Fuoco - Comandante "Zé António" 2026**

Il **IV Trail dei Vigili del Fuoco - Comandante "Zé António"** si svolge il **15 febbraio 2026** a **Fornos de Algodres**, distretto di **Guarda**. Organizzato dai **Vigili del Fuoco Volontari di Fornos de Algodres**, con supporto tecnico di **AVCAT - Associazione Vila Chã Aldeia Trail del Portogallo**.

Questo trail fa parte del **Circuito Trail di Beira Alta 2026 - VI(r)VER BEIRA ALTA** e sarà la **1ª tappa** del circuito.

---

## 🏔️ Gare Disponibili

### **Trail Lungo** - ≈25 km
- **Dislivello Positivo:** ≈1000D+
- **Tempo Limite:** 04h30
- **Età Minima:** 18 anni (o nati fino al 31/12/2011 con autorizzazione parentale)

### **Trail Corto** - ≈15 km
- **Dislivello Positivo:** ≈700D+
- **Tempo Limite:** 03h00
- **Età Minima:** 18 anni (o nati fino al 31/12/2011 con autorizzazione parentale)

### **Mini Trail** - ≈9 km
- **Dislivello Positivo:** ≈400D+
- **Età:** 11 a 14 anni (con autorizzazione parentale)
- **Circuito Trail Giovanile**

### **Camminata** - ≈9 km
- **Dislivello Positivo:** ≈400D+
- **Partecipazione ludica**
- **Aperta a tutti**

---

## 📍 Luogo e Orari

**Partenza e Arrivo:** Caserma dei Vigili del Fuoco Volontari di Fornos de Algodres

**Segreteria:**
- Sabato 14/02: 15:00 - 18:00
- Domenica 15/02: 07:30 - 08:50

**Briefing:** 08:50  
**Partenza:**
- 09:00 - Trail Lungo
- 09:15 - Trail Corto
- 09:20 - Mini Trail e Camminata

**Pranzo:** 12:00  
**Premiazione:** 13:30

---

## 🎯 Punti Salienti

✅ Assicurazione infortuni e responsabilità civile  
✅ Pettorale elettronico con numeri di emergenza  
✅ Ristori solidi e liquidi  
✅ Regalo finisher per tutti i partecipanti  
✅ Ricordo dell'evento  
✅ Pranzo opzionale (aggiuntivo)  
✅ Cronometraggio elettronico  
✅ Trofei e medaglie ai classificati

---

## 💰 Prezzi

- **Trail Lungo (25km):** €16,00
- **Trail Corto (15km):** €14,00
- **Mini Trail (9km):** €12,00
- **Camminata (9km):** €11,00
- **Pranzo (aggiuntivo per partecipanti):** €8,00
- **Pranzo Accompagnatori:** €12,00

**Scadenza iscrizioni:** 10 febbraio 2026 alle 23:59

---

## 📋 Attrezzatura Suggerita/Obbligatoria

✅ Telefono cellulare (obbligatorio)  
✅ Contenitore per acqua (obbligatorio)  
✅ Coperta termica  
✅ Fischietto  
✅ Antivento  
✅ Zaino  
✅ Berretto  
✅ Calzature e abbigliamento appropriati

---

## 🏆 Premi

**Trail Lungo e Trail Corto:**
- Trofeo ai primi 3 classificati generali M/F
- Diploma ai 4º e 5º classificati generali M/F
- Medaglia ai primi 3 classificati di ogni categoria M/F

**Mini Trail:**
- Trofeo ai primi 3 classificati generali M/F
- Medaglia ai primi 3 classificati di ogni categoria M/F (Circuito Giovanile)

---

## 📋 Posti di Controllo e Ristoro

**Trail Lungo:** 2 posti di controllo e ristoro + traguardo  
**Trail Corto:** 1 posto di controllo e ristoro + traguardo  
**Mini Trail e Camminata:** 1 posto di controllo e ristoro + traguardo

⚠️ **Nota:** Acqua e liquidi sono per riempire contenitori personali. Nessun bicchiere ai posti di ristoro.

---

## 📞 Contatti

**Organizzazione:** Vigili del Fuoco Volontari di Fornos de Algodres  
**Supporto Tecnico:** AVCAT - Associazione Vila Chã Aldeia Trail del Portogallo  
**Cellulare:** 962 818 607  
**Email:** vilachaaldeiatrailpt@gmail.com  
**Iscrizioni:** www.acorrer.pt

---

🚒 **Vieni a sostenere i Vigili del Fuoco di Fornos de Algodres e onorare la memoria del Comandante "Zé António"!** 🏃`,
      city: "Fornos de Algodres",
      metaTitle:
        'IV Trail dei Vigili del Fuoco - Comandante "Zé António" 2026 | Fornos de Algodres | 15 Febbraio',
      metaDescription:
        "IV Trail dei Vigili del Fuoco il 15 febbraio 2026 a Fornos de Algodres, Guarda. Gare: Trail Lungo 25km, Trail Corto 15km, Mini Trail 9km e Camminata. Circuito Beira Alta - 1ª Tappa.",
    },
  };

  // FAQ data for ALL 6 languages
  const faqs = {
    pt: [
      {
        question: "Onde posso fazer a inscrição?",
        answer:
          "As inscrições devem ser efetuadas através do site www.acorrer.pt. O prazo limite é 10 de fevereiro de 2026 às 23h59.",
      },
      {
        question: "Qual o prazo limite para inscrições?",
        answer:
          "As inscrições encerram às 23h59 do dia 10 de fevereiro de 2026. Após esta data não serão aceites novas inscrições.",
      },
      {
        question: "Posso alterar os dados da minha inscrição?",
        answer:
          "Sim, alterações de dados devem ser comunicadas à organização até uma hora antes do início das atividades.",
      },
      {
        question: "Qual é o material obrigatório?",
        answer:
          "Telemóvel e recipiente para água são obrigatórios. É também sugerido manta térmica, apito, corta vento, mochila, boné e vestuário adequado.",
      },
      {
        question: "Existem barreiras horárias?",
        answer:
          "Sim. Trail Longo: 04h30. Trail Curto: 03h00. Serão definidos locais de 'cut off' comunicados no briefing do evento.",
      },
      {
        question: "Onde e quando posso levantar o dorsal?",
        answer:
          "No Quartel dos Bombeiros: Sábado 14/02 das 15h00 às 18h00 ou Domingo 15/02 das 07h30 às 08h50. Pode também ser levantado até 30 minutos antes da prova.",
      },
      {
        question: "O que está incluído na inscrição?",
        answer:
          "Seguro, dorsal, abastecimentos, troféus e medalhas aos classificados, brinde finisher e brinde alusivo ao evento. O almoço é opcional com custo adicional.",
      },
      {
        question: "Quantos abastecimentos existem?",
        answer:
          "Trail Longo: 2 postos. Trail Curto: 1 posto. Mini Trail e Caminhada: 1 posto. Mais controlo final (meta) para todas as provas.",
      },
      {
        question: "A inscrição é reembolsável?",
        answer:
          "Não haverá direito a devoluções do valor do pagamento da inscrição, exceto se a prova for anulada previamente por motivos imputáveis à organização.",
      },
      {
        question: "Que prémios são atribuídos?",
        answer:
          "Trail Longo e Curto: Troféu aos 3 primeiros M/F geral, diploma aos 4º e 5º, medalha aos 3 primeiros de cada escalão. Mini Trail: Troféu aos 3 primeiros M/F geral, medalha aos 3 primeiros de cada escalão.",
      },
    ],
    en: [
      {
        question: "Where can I register?",
        answer:
          "Registrations must be made through www.acorrer.pt. The deadline is February 10, 2026 at 23:59.",
      },
      {
        question: "What is the registration deadline?",
        answer:
          "Registrations close at 23:59 on February 10, 2026. After this date, no new registrations will be accepted.",
      },
      {
        question: "Can I change my registration data?",
        answer:
          "Yes, data changes must be communicated to the organization up to one hour before the start of activities.",
      },
      {
        question: "What is the mandatory equipment?",
        answer:
          "Mobile phone and water container are mandatory. Thermal blanket, whistle, windbreaker, backpack, cap and appropriate clothing are also suggested.",
      },
      {
        question: "Are there time barriers?",
        answer:
          "Yes. Long Trail: 04h30. Short Trail: 03h00. Cut-off locations will be defined and communicated at the event briefing.",
      },
      {
        question: "Where and when can I collect my bib?",
        answer:
          "At the Fire Station: Saturday 14/02 from 15:00 to 18:00 or Sunday 15/02 from 07:30 to 08:50. Can also be collected up to 30 minutes before the race.",
      },
      {
        question: "What is included in registration?",
        answer:
          "Insurance, bib, aid stations, trophies and medals for classified athletes, finisher gift and event souvenir. Lunch is optional with additional cost.",
      },
      {
        question: "How many aid stations are there?",
        answer:
          "Long Trail: 2 stations. Short Trail: 1 station. Mini Trail and Walk: 1 station. Plus final control (finish) for all races.",
      },
      {
        question: "Is registration refundable?",
        answer:
          "There will be no refunds for registration fees, except if the race is canceled in advance for reasons attributable to the organization.",
      },
      {
        question: "What awards are given?",
        answer:
          "Long and Short Trail: Trophy to top 3 M/F overall, diploma to 4th and 5th, medal to top 3 in each category. Mini Trail: Trophy to top 3 M/F overall, medal to top 3 in each category.",
      },
    ],
    es: [
      {
        question: "¿Dónde puedo inscribirme?",
        answer:
          "Las inscripciones deben realizarse a través de www.acorrer.pt. El plazo límite es el 10 de febrero de 2026 a las 23:59.",
      },
      {
        question: "¿Cuál es el plazo límite para inscripciones?",
        answer:
          "Las inscripciones cierran a las 23:59 del 10 de febrero de 2026. Después de esta fecha no se aceptarán nuevas inscripciones.",
      },
      {
        question: "¿Puedo cambiar los datos de mi inscripción?",
        answer:
          "Sí, los cambios de datos deben comunicarse a la organización hasta una hora antes del inicio de las actividades.",
      },
      {
        question: "¿Cuál es el material obligatorio?",
        answer:
          "Teléfono móvil y recipiente para agua son obligatorios. También se sugiere manta térmica, silbato, cortavientos, mochila, gorra y ropa adecuada.",
      },
      {
        question: "¿Hay barreras horarias?",
        answer:
          "Sí. Trail Largo: 04h30. Trail Corto: 03h00. Se definirán ubicaciones de 'cut off' comunicadas en el briefing del evento.",
      },
      {
        question: "¿Dónde y cuándo puedo recoger el dorsal?",
        answer:
          "En el Cuartel de Bomberos: Sábado 14/02 de 15:00 a 18:00 o Domingo 15/02 de 07:30 a 08:50. También puede recogerse hasta 30 minutos antes de la carrera.",
      },
      {
        question: "¿Qué incluye la inscripción?",
        answer:
          "Seguro, dorsal, avituallamientos, trofeos y medallas a los clasificados, regalo finisher y recuerdo del evento. El almuerzo es opcional con coste adicional.",
      },
      {
        question: "¿Cuántos avituallamientos hay?",
        answer:
          "Trail Largo: 2 puestos. Trail Corto: 1 puesto. Mini Trail y Caminata: 1 puesto. Más control final (meta) para todas las carreras.",
      },
      {
        question: "¿Es reembolsable la inscripción?",
        answer:
          "No habrá devoluciones de la cuota de inscripción, excepto si la carrera es cancelada con anticipación por razones atribuibles a la organización.",
      },
      {
        question: "¿Qué premios se otorgan?",
        answer:
          "Trail Largo y Corto: Trofeo a los 3 primeros M/F general, diploma al 4º y 5º, medalla a los 3 primeros de cada categoría. Mini Trail: Trofeo a los 3 primeros M/F general, medalla a los 3 primeros de cada categoría.",
      },
    ],
    fr: [
      {
        question: "Où puis-je m'inscrire?",
        answer:
          "Les inscriptions doivent être effectuées via www.acorrer.pt. La date limite est le 10 février 2026 à 23h59.",
      },
      {
        question: "Quelle est la date limite d'inscription?",
        answer:
          "Les inscriptions ferment le 10 février 2026 à 23h59. Après cette date, aucune nouvelle inscription ne sera acceptée.",
      },
      {
        question: "Puis-je modifier les données de mon inscription?",
        answer:
          "Oui, les modifications de données doivent être communiquées à l'organisation jusqu'à une heure avant le début des activités.",
      },
      {
        question: "Quel est l'équipement obligatoire?",
        answer:
          "Téléphone portable et récipient pour eau sont obligatoires. Couverture thermique, sifflet, coupe-vent, sac à dos, casquette et vêtements appropriés sont également suggérés.",
      },
      {
        question: "Y a-t-il des barrières horaires?",
        answer:
          "Oui. Trail Long: 04h30. Trail Court: 03h00. Les emplacements de 'cut off' seront définis et communiqués lors du briefing de l'événement.",
      },
      {
        question: "Où et quand puis-je récupérer mon dossard?",
        answer:
          "À la Caserne de Pompiers: Samedi 14/02 de 15h00 à 18h00 ou Dimanche 15/02 de 07h30 à 08h50. Peut également être récupéré jusqu'à 30 minutes avant la course.",
      },
      {
        question: "Qu'est-ce qui est inclus dans l'inscription?",
        answer:
          "Assurance, dossard, postes de ravitaillement, trophées et médailles pour les classés, cadeau finisher et souvenir de l'événement. Le déjeuner est optionnel avec coût supplémentaire.",
      },
      {
        question: "Combien de postes de ravitaillement y a-t-il?",
        answer:
          "Trail Long: 2 postes. Trail Court: 1 poste. Mini Trail et Randonnée: 1 poste. Plus contrôle final (arrivée) pour toutes les courses.",
      },
      {
        question: "L'inscription est-elle remboursable?",
        answer:
          "Il n'y aura pas de remboursement des frais d'inscription, sauf si la course est annulée à l'avance pour des raisons imputables à l'organisation.",
      },
      {
        question: "Quelles récompenses sont attribuées?",
        answer:
          "Trail Long et Court: Trophée aux 3 premiers H/F général, diplôme aux 4ème et 5ème, médaille aux 3 premiers de chaque catégorie. Mini Trail: Trophée aux 3 premiers H/F général, médaille aux 3 premiers de chaque catégorie.",
      },
    ],
    de: [
      {
        question: "Wo kann ich mich anmelden?",
        answer:
          "Anmeldungen müssen über www.acorrer.pt erfolgen. Die Frist endet am 10. Februar 2026 um 23:59.",
      },
      {
        question: "Was ist die Anmeldefrist?",
        answer:
          "Anmeldungen schließen am 10. Februar 2026 um 23:59. Nach diesem Datum werden keine neuen Anmeldungen akzeptiert.",
      },
      {
        question: "Kann ich meine Anmeldedaten ändern?",
        answer:
          "Ja, Datenänderungen müssen der Organisation bis eine Stunde vor Beginn der Aktivitäten mitgeteilt werden.",
      },
      {
        question: "Was ist die obligatorische Ausrüstung?",
        answer:
          "Mobiltelefon und Wasserbehälter sind obligatorisch. Thermodecke, Pfeife, Windjacke, Rucksack, Kappe und geeignete Kleidung werden ebenfalls empfohlen.",
      },
      {
        question: "Gibt es Zeitbarrieren?",
        answer:
          "Ja. Langer Trail: 04h30. Kurzer Trail: 03h00. Cut-off-Standorte werden beim Event-Briefing definiert und kommuniziert.",
      },
      {
        question: "Wo und wann kann ich meine Startnummer abholen?",
        answer:
          "Im Feuerwehrhaus: Samstag 14.02 von 15:00 bis 18:00 oder Sonntag 15.02 von 07:30 bis 08:50. Kann auch bis 30 Minuten vor dem Rennen abgeholt werden.",
      },
      {
        question: "Was ist in der Anmeldung enthalten?",
        answer:
          "Versicherung, Startnummer, Verpflegungsstationen, Trophäen und Medaillen für Platzierte, Finisher-Geschenk und Event-Souvenir. Mittagessen ist optional mit zusätzlichen Kosten.",
      },
      {
        question: "Wie viele Verpflegungsstationen gibt es?",
        answer:
          "Langer Trail: 2 Stationen. Kurzer Trail: 1 Station. Mini Trail und Wanderung: 1 Station. Plus Endkontrolle (Ziel) für alle Läufe.",
      },
      {
        question: "Ist die Anmeldung erstattungsfähig?",
        answer:
          "Es gibt keine Rückerstattung der Anmeldegebühren, außer wenn das Rennen im Voraus aus Gründen abgesagt wird, die der Organisation zuzuschreiben sind.",
      },
      {
        question: "Welche Preise werden vergeben?",
        answer:
          "Langer und Kurzer Trail: Trophäe für Top 3 M/F gesamt, Diplom für 4. und 5., Medaille für Top 3 jeder Kategorie. Mini Trail: Trophäe für Top 3 M/F gesamt, Medaille für Top 3 jeder Kategorie.",
      },
    ],
    it: [
      {
        question: "Dove posso iscrivermi?",
        answer:
          "Le iscrizioni devono essere effettuate tramite www.acorrer.pt. Il termine è il 10 febbraio 2026 alle 23:59.",
      },
      {
        question: "Qual è il termine di iscrizione?",
        answer:
          "Le iscrizioni chiudono il 10 febbraio 2026 alle 23:59. Dopo questa data non saranno accettate nuove iscrizioni.",
      },
      {
        question: "Posso modificare i dati della mia iscrizione?",
        answer:
          "Sì, le modifiche dei dati devono essere comunicate all'organizzazione fino a un'ora prima dell'inizio delle attività.",
      },
      {
        question: "Qual è l'attrezzatura obbligatoria?",
        answer:
          "Telefono cellulare e contenitore per acqua sono obbligatori. Sono anche suggeriti coperta termica, fischietto, antivento, zaino, berretto e abbigliamento appropriato.",
      },
      {
        question: "Ci sono barriere orarie?",
        answer:
          "Sì. Trail Lungo: 04h30. Trail Corto: 03h00. Le posizioni di 'cut off' saranno definite e comunicate durante il briefing dell'evento.",
      },
      {
        question: "Dove e quando posso ritirare il pettorale?",
        answer:
          "Alla Caserma dei Pompieri: Sabato 14/02 dalle 15:00 alle 18:00 o Domenica 15/02 dalle 07:30 alle 08:50. Può anche essere ritirato fino a 30 minuti prima della gara.",
      },
      {
        question: "Cosa è incluso nell'iscrizione?",
        answer:
          "Assicurazione, pettorale, posti di ristoro, trofei e medaglie per i classificati, regalo finisher e ricordo dell'evento. Il pranzo è opzionale con costo aggiuntivo.",
      },
      {
        question: "Quanti posti di ristoro ci sono?",
        answer:
          "Trail Lungo: 2 posti. Trail Corto: 1 posto. Mini Trail e Camminata: 1 posto. Più controllo finale (traguardo) per tutte le gare.",
      },
      {
        question: "L'iscrizione è rimborsabile?",
        answer:
          "Non ci saranno rimborsi delle quote di iscrizione, tranne se la gara viene annullata in anticipo per motivi imputabili all'organizzazione.",
      },
      {
        question: "Quali premi vengono assegnati?",
        answer:
          "Trail Lungo e Corto: Trofeo ai primi 3 M/F generali, diploma al 4º e 5º, medaglia ai primi 3 di ogni categoria. Mini Trail: Trofeo ai primi 3 M/F generali, medaglia ai primi 3 di ogni categoria.",
      },
    ],
  };

  // Create event
  const event = await prisma.event.create({
    data: {
      title: 'IV Trail dos Bombeiros - Comandante "Zé António"',
      slug: eventSlug,
      description:
        "IV Trail dos Bombeiros - Comandante 'Zé António' em Fornos de Algodres. Homenagem ao Comandante Zé António. Circuito de Trail da Beira Alta 2026 - 1ª Etapa.",
      startDate: eventStartDate,
      endDate: eventEndDate,
      city: "Fornos de Algodres",
      country: "Portugal",
      sportTypes: [SportType.TRAIL],
      imageUrl: "",
      externalUrl: "https://www.acorrer.pt",
      registrationDeadline: new Date("2026-02-10T23:59:59Z"),
      latitude: 40.6197,
      longitude: -7.5405,
      googleMapsUrl: "https://maps.app.goo.gl/FNsQ2zA6Y9UxQXzW9",
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
      name: "Trail Longo",
      distanceKm: 25.0,
      elevationGainM: 1000,
      elevationLossM: null,
      cutoffTimeHours: 4.5,
      mountainLevel: 3,
      maxParticipants: 300,
      pricingPhases: [
        {
          name: "Inscrição",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-10T23:59:59Z"),
          price: 16.0,
          currency: Currency.EUR,
          note: "Prazo até 10 de Fevereiro 2026",
        },
      ],
    },
    {
      name: "Trail Curto",
      distanceKm: 15.0,
      elevationGainM: 700,
      elevationLossM: null,
      cutoffTimeHours: 3.0,
      mountainLevel: 2,
      maxParticipants: 400,
      pricingPhases: [
        {
          name: "Inscrição",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-10T23:59:59Z"),
          price: 14.0,
          currency: Currency.EUR,
          note: "Prazo até 10 de Fevereiro 2026",
        },
      ],
    },
    {
      name: "Mini Trail",
      distanceKm: 9.0,
      elevationGainM: 400,
      elevationLossM: null,
      cutoffTimeHours: null,
      mountainLevel: 1,
      maxParticipants: 200,
      pricingPhases: [
        {
          name: "Inscrição",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-10T23:59:59Z"),
          price: 12.0,
          currency: Currency.EUR,
          note: "Idade: 11 a 14 anos com autorização parental",
        },
      ],
    },
    {
      name: "Caminhada",
      distanceKm: 9.0,
      elevationGainM: 400,
      elevationLossM: null,
      cutoffTimeHours: null,
      mountainLevel: 1,
      maxParticipants: 200,
      pricingPhases: [
        {
          name: "Inscrição",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-10T23:59:59Z"),
          price: 11.0,
          currency: Currency.EUR,
          note: "Participação lúdica - Aberta a todos",
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

  console.log("✅ IV Trail dos Bombeiros 2026 seed completed successfully!");
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedTrailBombeiros2026()
    .catch((e) => {
      console.error("❌ Error seeding Trail Bombeiros 2026:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
