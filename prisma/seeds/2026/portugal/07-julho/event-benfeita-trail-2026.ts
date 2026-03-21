import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedBenfeitaTrail2026() {
  console.log("🏔️ Seeding Benfeita Trail 2026...");

  // Base event data
  const eventSlug = "benfeita-trail-2026";
  const eventStartDate = new Date("2026-07-19T09:00:00Z");
  const eventEndDate = new Date("2026-07-19T15:00:00Z");

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
      title: "13º Benfeita Trail 2026",
      description: `**🏔️ 13º Benfeita Trail 2026 - Trail em Estado Puro**

O **13º Benfeita Trail** realiza-se a **19 de julho de 2026** na **Aldeia de Xisto da Benfeita**, concelho de **Arganil**. Organizado pela **Equipa de Trail / Atletismo S.C. Povoense – Caracóis de Corrida**, com apoio do Município de Arganil, Junta de Freguesia da Benfeita e ADXTUR.

![Benfeita Trail - Praia Fluvial da Benfeita](https://www.aldeiasdoxisto.pt/media/filer_public_thumbnails/filer_public/d5/94/d594c02f-6c80-486f-aa1a-cf6b09efc5d8/praia-fluvial-de-benfeita.jpg__768x0_q95_subsampling-2_upscale.jpg)

---

## 🏔️ Provas Disponíveis

### **Trail Curto K21** - ≈21 km
- **Circuito Distrital de Trail Curto – ADAC**
- **Circuito Nacional de Trail Sprint – ATRP**
- **Barreira Horária:** 3h30 aos 18km
- **Idade Mínima:** 18 anos

### **Mini Trail K11** - ≈11 km
- **Circuito Nacional de Trail Jovem – ATRP**
- **Idade Mínima:** 16 anos

---

## 📍 Local e Horários

**Partida e Chegada:** Praia Fluvial da Benfeita  
**Coordenadas GPS:** 40.231797, -7.945591

**Secretariado (Quiosque da Benfeita):**
- Sábado 18/07: 17h00 - 19h00
- Domingo 19/07: 07h30 - 08h45

**Partida:** 09h00 (Trail Curto e Mini Trail)  
**Entrega de Prémios:** a partir das 12h30

---

## 🎯 Destaques

✅ T-shirt técnica incluída  
✅ Seguro de acidentes pessoais e responsabilidade civil  
✅ Abastecimentos (3+1 no Trail Curto, 1+1 no Mini Trail)  
✅ Reforço final volante  
✅ Banho na Praia Fluvial ou balneários disponíveis  
✅ Cronometragem eletrónica

---

## 💰 Preços

**1ª Fase (1 Fev - 30 Abr 2026):**
- Trail Curto K21: €14,50 (ADAC) / €16,00 (Geral)
- Mini Trail K11: €12,00

**2ª Fase (1 Mai - 12 Jul 2026):**
- Trail Curto K21: €16,50 (ADAC) / €18,00 (Geral)
- Mini Trail K11: €13,50

---

## 📋 Material Obrigatório

✅ Manta térmica de sobrevivência  
✅ Apito  
✅ Reservatório de água (mín. 0,5L)  
✅ Telemóvel

**⚠️ Penalização:** 15 minutos por falta de material

---

## 🏆 Prémios

**Trail Curto K21:** Top 3 Geral M/F + Top 3 por escalão + Top 3 Equipas  
**Mini Trail K11:** Top 3 Geral M/F + Top 3 por escalão + Top 3 Equipas

---

## 📞 Contactos

**Email:** benfeitatrail@gmail.com  
**Telefone:** 914 818 674  
**Diretor de Prova:** José Miguel Santos  
**Inscrições:** www.runmanager.net

**Data alternativa:** 13 de setembro de 2026 (em caso de alerta vermelho)

---

🏃 **Vem correr na Aldeia de Xisto da Benfeita! Trail em estado puro!** 🏔️`,
      city: "Benfeita",
      metaTitle: "13º Benfeita Trail 2026 | Aldeia de Xisto | 19 Julho",
      metaDescription:
        "13º Benfeita Trail a 19 de julho de 2026 na Aldeia de Xisto da Benfeita, Arganil. Provas: Trail Curto K21 e Mini Trail K11. Circuito ADAC e ATRP.",
    },
    en: {
      title: "13th Benfeita Trail 2026",
      description: `**🏔️ 13th Benfeita Trail 2026 - Trail Running in Pure State**

The **13th Benfeita Trail** takes place on **July 19, 2026** in the **Schist Village of Benfeita**, municipality of **Arganil**. Organized by **Trail Team / Athletics S.C. Povoense – Caracóis de Corrida**, with support from Arganil Municipality, Benfeita Parish Council and ADXTUR.

![Benfeita Trail - Benfeita River Beach](https://www.aldeiasdoxisto.pt/media/filer_public_thumbnails/filer_public/d5/94/d594c02f-6c80-486f-aa1a-cf6b09efc5d8/praia-fluvial-de-benfeita.jpg__768x0_q95_subsampling-2_upscale.jpg)

---

## 🏔️ Available Races

### **Short Trail K21** - ≈21 km
- **District Short Trail Circuit – ADAC**
- **National Sprint Trail Circuit – ATRP**
- **Time Barrier:** 3h30 at 18km
- **Minimum Age:** 18 years

### **Mini Trail K11** - ≈11 km
- **National Youth Trail Circuit – ATRP**
- **Minimum Age:** 16 years

---

## 📍 Location and Schedule

**Start and Finish:** Benfeita River Beach  
**GPS Coordinates:** 40.231797, -7.945591

**Registration (Benfeita Kiosk):**
- Saturday 18/07: 17:00 - 19:00
- Sunday 19/07: 07:30 - 08:45

**Start:** 09:00 (Short Trail and Mini Trail)  
**Award Ceremony:** from 12:30

---

## 🎯 Highlights

✅ Technical T-shirt included  
✅ Personal accident and civil liability insurance  
✅ Aid stations (3+1 on Short Trail, 1+1 on Mini Trail)  
✅ Final refreshment  
✅ Swim at River Beach or showers available  
✅ Electronic timing

---

## 💰 Prices

**Phase 1 (1 Feb - 30 Apr 2026):**
- Short Trail K21: €14.50 (ADAC) / €16.00 (General)
- Mini Trail K11: €12.00

**Phase 2 (1 May - 12 Jul 2026):**
- Short Trail K21: €16.50 (ADAC) / €18.00 (General)
- Mini Trail K11: €13.50

---

## 📋 Mandatory Equipment

✅ Survival thermal blanket  
✅ Whistle  
✅ Water reservoir (min. 0.5L)  
✅ Mobile phone

**⚠️ Penalty:** 15 minutes for missing equipment

---

## 🏆 Awards

**Short Trail K21:** Top 3 Overall M/F + Top 3 per category + Top 3 Teams  
**Mini Trail K11:** Top 3 Overall M/F + Top 3 per category + Top 3 Teams

---

## 📞 Contacts

**Email:** benfeitatrail@gmail.com  
**Phone:** 914 818 674  
**Race Director:** José Miguel Santos  
**Registration:** www.runmanager.net

**Alternative date:** September 13, 2026 (in case of red alert)

---

🏃 **Come run in the Schist Village of Benfeita! Trail running in pure state!** 🏔️`,
      city: "Benfeita",
      metaTitle: "13th Benfeita Trail 2026 | Schist Village | July 19",
      metaDescription:
        "13th Benfeita Trail on July 19, 2026 in Schist Village of Benfeita, Arganil. Races: Short Trail K21 and Mini Trail K11. ADAC and ATRP Circuit.",
    },
    es: {
      title: "13º Benfeita Trail 2026",
      description: `**🏔️ 13º Benfeita Trail 2026 - Trail en Estado Puro**

El **13º Benfeita Trail** se celebra el **19 de julio de 2026** en la **Aldea de Pizarra de Benfeita**, municipio de **Arganil**. Organizado por el **Equipo de Trail / Atletismo S.C. Povoense – Caracóis de Corrida**, con apoyo del Municipio de Arganil, Junta de Freguesia de Benfeita y ADXTUR.

![Benfeita Trail - Playa Fluvial de Benfeita](https://www.aldeiasdoxisto.pt/media/filer_public_thumbnails/filer_public/d5/94/d594c02f-6c80-486f-aa1a-cf6b09efc5d8/praia-fluvial-de-benfeita.jpg__768x0_q95_subsampling-2_upscale.jpg)

---

## 🏔️ Pruebas Disponibles

### **Trail Corto K21** - ≈21 km
- **Circuito Distrital de Trail Corto – ADAC**
- **Circuito Nacional de Trail Sprint – ATRP**
- **Barrera Horaria:** 3h30 a los 18km
- **Edad Mínima:** 18 años

### **Mini Trail K11** - ≈11 km
- **Circuito Nacional de Trail Joven – ATRP**
- **Edad Mínima:** 16 años

---

## 📍 Ubicación y Horarios

**Salida y Meta:** Playa Fluvial de Benfeita  
**Coordenadas GPS:** 40.231797, -7.945591

**Secretaría (Quiosco de Benfeita):**
- Sábado 18/07: 17:00 - 19:00
- Domingo 19/07: 07:30 - 08:45

**Salida:** 09:00 (Trail Corto y Mini Trail)  
**Entrega de Premios:** a partir de las 12:30

---

## 🎯 Aspectos Destacados

✅ Camiseta técnica incluida  
✅ Seguro de accidentes personales y responsabilidad civil  
✅ Avituallamientos (3+1 en Trail Corto, 1+1 en Mini Trail)  
✅ Refuerzo final  
✅ Baño en Playa Fluvial o vestuarios disponibles  
✅ Cronometraje electrónico

---

## 💰 Precios

**Fase 1 (1 Feb - 30 Abr 2026):**
- Trail Corto K21: €14,50 (ADAC) / €16,00 (General)
- Mini Trail K11: €12,00

**Fase 2 (1 May - 12 Jul 2026):**
- Trail Corto K21: €16,50 (ADAC) / €18,00 (General)
- Mini Trail K11: €13,50

---

## 📋 Material Obligatorio

✅ Manta térmica de supervivencia  
✅ Silbato  
✅ Depósito de agua (mín. 0,5L)  
✅ Teléfono móvil

**⚠️ Penalización:** 15 minutos por falta de material

---

## 🏆 Premios

**Trail Corto K21:** Top 3 General M/F + Top 3 por categoría + Top 3 Equipos  
**Mini Trail K11:** Top 3 General M/F + Top 3 por categoría + Top 3 Equipos

---

## 📞 Contactos

**Email:** benfeitatrail@gmail.com  
**Teléfono:** 914 818 674  
**Director de Carrera:** José Miguel Santos  
**Inscripciones:** www.runmanager.net

**Fecha alternativa:** 13 de septiembre de 2026 (en caso de alerta roja)

---

🏃 **¡Ven a correr en la Aldea de Pizarra de Benfeita! ¡Trail en estado puro!** 🏔️`,
      city: "Benfeita",
      metaTitle: "13º Benfeita Trail 2026 | Aldea de Pizarra | 19 Julio",
      metaDescription:
        "13º Benfeita Trail el 19 de julio de 2026 en Aldea de Pizarra de Benfeita, Arganil. Pruebas: Trail Corto K21 y Mini Trail K11. Circuito ADAC y ATRP.",
    },
    fr: {
      title: "13ème Benfeita Trail 2026",
      description: `**🏔️ 13ème Benfeita Trail 2026 - Trail à l'État Pur**

Le **13ème Benfeita Trail** se déroule le **19 juillet 2026** dans le **Village de Schiste de Benfeita**, municipalité d'**Arganil**. Organisé par l'**Équipe de Trail / Athlétisme S.C. Povoense – Caracóis de Corrida**, avec le soutien de la Municipalité d'Arganil, de la Paroisse de Benfeita et ADXTUR.

![Benfeita Trail - Plage Fluviale de Benfeita](https://www.aldeiasdoxisto.pt/media/filer_public_thumbnails/filer_public/d5/94/d594c02f-6c80-486f-aa1a-cf6b09efc5d8/praia-fluvial-de-benfeita.jpg__768x0_q95_subsampling-2_upscale.jpg)

---

## 🏔️ Courses Disponibles

### **Trail Court K21** - ≈21 km
- **Circuit Départemental de Trail Court – ADAC**
- **Circuit National de Trail Sprint – ATRP**
- **Barrière Horaire:** 3h30 aux 18km
- **Âge Minimum:** 18 ans

### **Mini Trail K11** - ≈11 km
- **Circuit National de Trail Jeune – ATRP**
- **Âge Minimum:** 16 ans

---

## 📍 Lieu et Horaires

**Départ et Arrivée:** Plage Fluviale de Benfeita  
**Coordonnées GPS:** 40.231797, -7.945591

**Secrétariat (Kiosque de Benfeita):**
- Samedi 18/07: 17:00 - 19:00
- Dimanche 19/07: 07:30 - 08:45

**Départ:** 09:00 (Trail Court et Mini Trail)  
**Remise des Prix:** à partir de 12:30

---

## 🎯 Points Forts

✅ T-shirt technique inclus  
✅ Assurance accidents et responsabilité civile  
✅ Ravitaillements (3+1 Trail Court, 1+1 Mini Trail)  
✅ Renfort final  
✅ Baignade à la Plage Fluviale ou douches disponibles  
✅ Chronométrage électronique

---

## 💰 Prix

**Phase 1 (1 Fév - 30 Avr 2026):**
- Trail Court K21: €14,50 (ADAC) / €16,00 (Général)
- Mini Trail K11: €12,00

**Phase 2 (1 Mai - 12 Juil 2026):**
- Trail Court K21: €16,50 (ADAC) / €18,00 (Général)
- Mini Trail K11: €13,50

---

## 📋 Matériel Obligatoire

✅ Couverture thermique de survie  
✅ Sifflet  
✅ Réservoir d'eau (min. 0,5L)  
✅ Téléphone portable

**⚠️ Pénalité:** 15 minutes pour matériel manquant

---

## 🏆 Récompenses

**Trail Court K21:** Top 3 Général H/F + Top 3 par catégorie + Top 3 Équipes  
**Mini Trail K11:** Top 3 Général H/F + Top 3 par catégorie + Top 3 Équipes

---

## 📞 Contacts

**Email:** benfeitatrail@gmail.com  
**Téléphone:** 914 818 674  
**Directeur de Course:** José Miguel Santos  
**Inscriptions:** www.runmanager.net

**Date alternative:** 13 septembre 2026 (en cas d'alerte rouge)

---

🏃 **Venez courir dans le Village de Schiste de Benfeita! Trail à l'état pur!** 🏔️`,
      city: "Benfeita",
      metaTitle: "13ème Benfeita Trail 2026 | Village de Schiste | 19 Juillet",
      metaDescription:
        "13ème Benfeita Trail le 19 juillet 2026 au Village de Schiste de Benfeita, Arganil. Courses: Trail Court K21 et Mini Trail K11. Circuit ADAC et ATRP.",
    },
    de: {
      title: "13. Benfeita Trail 2026",
      description: `**🏔️ 13. Benfeita Trail 2026 - Trail Running im Reinzustand**

Der **13. Benfeita Trail** findet am **19. Juli 2026** im **Schieferdorf Benfeita**, Gemeinde **Arganil**, statt. Organisiert vom **Trail Team / Leichtathletik S.C. Povoense – Caracóis de Corrida**, mit Unterstützung der Gemeinde Arganil, der Gemeinde Benfeita und ADXTUR.

![Benfeita Trail - Benfeita Flussstrand](https://www.aldeiasdoxisto.pt/media/filer_public_thumbnails/filer_public/d5/94/d594c02f-6c80-486f-aa1a-cf6b09efc5d8/praia-fluvial-de-benfeita.jpg__768x0_q95_subsampling-2_upscale.jpg)

---

## 🏔️ Verfügbare Rennen

### **Kurzer Trail K21** - ≈21 km
- **Bezirks-Kurztrail-Kreis – ADAC**
- **Nationaler Sprint-Trail-Kreis – ATRP**
- **Zeitbarriere:** 3h30 bei 18km
- **Mindestalter:** 18 Jahre

### **Mini Trail K11** - ≈11 km
- **Nationaler Jugend-Trail-Kreis – ATRP**
- **Mindestalter:** 16 Jahre

---

## 📍 Ort und Zeitplan

**Start und Ziel:** Benfeita Flussstrand  
**GPS-Koordinaten:** 40.231797, -7.945591

**Sekretariat (Benfeita Kiosk):**
- Samstag 18.07.: 17:00 - 19:00
- Sonntag 19.07.: 07:30 - 08:45

**Start:** 09:00 (Kurzer Trail und Mini Trail)  
**Siegerehrung:** ab 12:30

---

## 🎯 Highlights

✅ Technisches T-Shirt inklusive  
✅ Unfall- und Haftpflichtversicherung  
✅ Verpflegungsstellen (3+1 Kurzer Trail, 1+1 Mini Trail)  
✅ Abschlussverpflegung  
✅ Baden am Flussstrand oder Duschen verfügbar  
✅ Elektronische Zeitmessung

---

## 💰 Preise

**Phase 1 (1. Feb - 30. Apr 2026):**
- Kurzer Trail K21: €14,50 (ADAC) / €16,00 (Allgemein)
- Mini Trail K11: €12,00

**Phase 2 (1. Mai - 12. Jul 2026):**
- Kurzer Trail K21: €16,50 (ADAC) / €18,00 (Allgemein)
- Mini Trail K11: €13,50

---

## 📋 Pflichtausrüstung

✅ Überlebens-Thermodecke  
✅ Pfeife  
✅ Wasserbehälter (min. 0,5L)  
✅ Mobiltelefon

**⚠️ Strafe:** 15 Minuten für fehlende Ausrüstung

---

## 🏆 Auszeichnungen

**Kurzer Trail K21:** Top 3 Gesamt M/W + Top 3 pro Kategorie + Top 3 Teams  
**Mini Trail K11:** Top 3 Gesamt M/W + Top 3 pro Kategorie + Top 3 Teams

---

## 📞 Kontakte

**E-Mail:** benfeitatrail@gmail.com  
**Telefon:** 914 818 674  
**Rennleiter:** José Miguel Santos  
**Anmeldung:** www.runmanager.net

**Alternativdatum:** 13. September 2026 (bei roter Warnung)

---

🏃 **Kommen Sie und laufen Sie im Schieferdorf Benfeita! Trail Running im Reinzustand!** 🏔️`,
      city: "Benfeita",
      metaTitle: "13. Benfeita Trail 2026 | Schieferdorf | 19. Juli",
      metaDescription:
        "13. Benfeita Trail am 19. Juli 2026 im Schieferdorf Benfeita, Arganil. Rennen: Kurzer Trail K21 und Mini Trail K11. ADAC und ATRP Kreis.",
    },
    it: {
      title: "13º Benfeita Trail 2026",
      description: `**🏔️ 13º Benfeita Trail 2026 - Trail allo Stato Puro**

Il **13º Benfeita Trail** si svolge il **19 luglio 2026** nel **Villaggio di Scisto di Benfeita**, comune di **Arganil**. Organizzato dal **Team Trail / Atletica S.C. Povoense – Caracóis de Corrida**, con il supporto del Comune di Arganil, della Parrocchia di Benfeita e ADXTUR.

![Benfeita Trail - Spiaggia Fluviale di Benfeita](https://www.aldeiasdoxisto.pt/media/filer_public_thumbnails/filer_public/d5/94/d594c02f-6c80-486f-aa1a-cf6b09efc5d8/praia-fluvial-de-benfeita.jpg__768x0_q95_subsampling-2_upscale.jpg)

---

## 🏔️ Gare Disponibili

### **Trail Corto K21** - ≈21 km
- **Circuito Distrettuale Trail Corto – ADAC**
- **Circuito Nazionale Trail Sprint – ATRP**
- **Barriera Oraria:** 3h30 ai 18km
- **Età Minima:** 18 anni

### **Mini Trail K11** - ≈11 km
- **Circuito Nazionale Trail Giovani – ATRP**
- **Età Minima:** 16 anni

---

## 📍 Luogo e Orari

**Partenza e Arrivo:** Spiaggia Fluviale di Benfeita  
**Coordinate GPS:** 40.231797, -7.945591

**Segreteria (Chiosco di Benfeita):**
- Sabato 18/07: 17:00 - 19:00
- Domenica 19/07: 07:30 - 08:45

**Partenza:** 09:00 (Trail Corto e Mini Trail)  
**Premiazioni:** dalle 12:30

---

## 🎯 Punti Salienti

✅ T-shirt tecnica inclusa  
✅ Assicurazione infortuni e responsabilità civile  
✅ Punti ristoro (3+1 Trail Corto, 1+1 Mini Trail)  
✅ Rinfresco finale  
✅ Bagno alla Spiaggia Fluviale o docce disponibili  
✅ Cronometraggio elettronico

---

## 💰 Prezzi

**Fase 1 (1 Feb - 30 Apr 2026):**
- Trail Corto K21: €14,50 (ADAC) / €16,00 (Generale)
- Mini Trail K11: €12,00

**Fase 2 (1 Mag - 12 Lug 2026):**
- Trail Corto K21: €16,50 (ADAC) / €18,00 (Generale)
- Mini Trail K11: €13,50

---

## 📋 Materiale Obbligatorio

✅ Coperta termica di sopravvivenza  
✅ Fischietto  
✅ Serbatoio d'acqua (min. 0,5L)  
✅ Telefono cellulare

**⚠️ Penalità:** 15 minuti per materiale mancante

---

## 🏆 Premi

**Trail Corto K21:** Top 3 Generale M/F + Top 3 per categoria + Top 3 Squadre  
**Mini Trail K11:** Top 3 Generale M/F + Top 3 per categoria + Top 3 Squadre

---

## 📞 Contatti

**Email:** benfeitatrail@gmail.com  
**Telefono:** 914 818 674  
**Direttore di Gara:** José Miguel Santos  
**Iscrizioni:** www.runmanager.net

**Data alternativa:** 13 settembre 2026 (in caso di allerta rossa)

---

🏃 **Vieni a correre nel Villaggio di Scisto di Benfeita! Trail allo stato puro!** 🏔️`,
      city: "Benfeita",
      metaTitle: "13º Benfeita Trail 2026 | Villaggio di Scisto | 19 Luglio",
      metaDescription:
        "13º Benfeita Trail il 19 luglio 2026 nel Villaggio di Scisto di Benfeita, Arganil. Gare: Trail Corto K21 e Mini Trail K11. Circuito ADAC e ATRP.",
    },
  };

  // FAQ data for ALL 6 languages
  const faqs = {
    pt: [
      {
        question: "Onde posso fazer a inscrição?",
        answer:
          "As inscrições devem ser efetuadas através do site www.runmanager.net. O pagamento deve ser feito por referência Multibanco até às 23h59 do dia 12 de Julho de 2026.",
      },
      {
        question: "Qual o prazo limite para inscrições?",
        answer:
          "As inscrições encerram às 23h59 do dia 12 de Julho de 2026. Após esta data não serão aceites novas inscrições.",
      },
      {
        question: "Posso transferir a minha inscrição?",
        answer:
          "Após o dia 12 de Julho não há devolução do valor da inscrição. Transferências para outro atleta são possíveis apenas após análise individual por parte da Organização.",
      },
      {
        question: "Qual é o material obrigatório?",
        answer:
          "Manta térmica de sobrevivência, apito, reservatório de água com mínimo de 0,5L e telemóvel. A falta de qualquer item resulta em penalização de 15 minutos.",
      },
      {
        question: "Existem barreiras horárias?",
        answer:
          "Sim, no Trail Curto existe uma Barreira Horária aos 18km com tempo máximo de 3h30. Atletas que ultrapassem este tempo serão desclassificados.",
      },
      {
        question: "Onde e quando posso levantar o dorsal?",
        answer:
          "No Quiosque da Benfeita: Sábado 18/07 das 17h00 às 19h00 ou Domingo 19/07 das 07h30 às 08h45.",
      },
      {
        question: "O que está incluído na inscrição?",
        answer:
          "T-shirt, dorsal, seguro de acidentes pessoais, seguro de responsabilidade civil, abastecimentos, reforço final volante e lembranças de presença.",
      },
      {
        question: "Quantos abastecimentos existem?",
        answer:
          "Trail Curto: 3+1 pontos (Benfeita, Sardal, Benfeita e Meta). Mini Trail: 1+1 pontos (Benfeita e Meta).",
      },
      {
        question: "Existem balneários disponíveis?",
        answer:
          "Sim, a Junta de Freguesia disponibiliza balneários (1 Masculino e 1 Feminino) na Praia Fluvial. Mas o tradicional é 'um belo mergulho' na Praia Fluvial!",
      },
      {
        question: "O que acontece em caso de alerta vermelho?",
        answer:
          "A organização não reembolsa inscrições. A inscrição transita para a data alternativa de 13 de setembro de 2026 ou para a edição de 2027.",
      },
    ],
    en: [
      {
        question: "Where can I register?",
        answer:
          "Registrations must be made through www.runmanager.net. Payment must be made via Multibanco reference until 23:59 on July 12, 2026.",
      },
      {
        question: "What is the registration deadline?",
        answer:
          "Registrations close at 23:59 on July 12, 2026. After this date, no new registrations will be accepted.",
      },
      {
        question: "Can I transfer my registration?",
        answer:
          "After July 12, there are no refunds. Transfers to another athlete are possible only after individual analysis by the Organization.",
      },
      {
        question: "What is the mandatory equipment?",
        answer:
          "Survival thermal blanket, whistle, water reservoir with minimum 0.5L and mobile phone. Missing any item results in a 15-minute penalty.",
      },
      {
        question: "Are there time barriers?",
        answer:
          "Yes, in the Short Trail there is a Time Barrier at 18km with maximum time of 3h30. Athletes exceeding this time will be disqualified.",
      },
      {
        question: "Where and when can I collect my bib?",
        answer:
          "At Benfeita Kiosk: Saturday 18/07 from 17:00 to 19:00 or Sunday 19/07 from 07:30 to 08:45.",
      },
      {
        question: "What is included in registration?",
        answer:
          "T-shirt, bib, personal accident insurance, civil liability insurance, aid stations, final refreshment and participation souvenirs.",
      },
      {
        question: "How many aid stations are there?",
        answer:
          "Short Trail: 3+1 points (Benfeita, Sardal, Benfeita and Finish). Mini Trail: 1+1 points (Benfeita and Finish).",
      },
      {
        question: "Are changing rooms available?",
        answer:
          "Yes, the Parish provides changing rooms (1 Male and 1 Female) at the River Beach. But the tradition is 'a nice dip' in the River Beach!",
      },
      {
        question: "What happens in case of red alert?",
        answer:
          "The organization does not refund registrations. Registration transfers to alternative date of September 13, 2026 or to 2027 edition.",
      },
    ],
    es: [
      {
        question: "¿Dónde puedo inscribirme?",
        answer:
          "Las inscripciones deben realizarse a través de www.runmanager.net. El pago debe hacerse por referencia Multibanco hasta las 23:59 del 12 de julio de 2026.",
      },
      {
        question: "¿Cuál es el plazo límite para inscripciones?",
        answer:
          "Las inscripciones cierran a las 23:59 del 12 de julio de 2026. Después de esta fecha no se aceptan nuevas inscripciones.",
      },
      {
        question: "¿Puedo transferir mi inscripción?",
        answer:
          "Después del 12 de julio no hay devolución. Las transferencias a otro atleta son posibles solo tras análisis individual por la Organización.",
      },
      {
        question: "¿Cuál es el material obligatorio?",
        answer:
          "Manta térmica de supervivencia, silbato, depósito de agua con mínimo 0,5L y teléfono móvil. La falta de cualquier artículo resulta en penalización de 15 minutos.",
      },
      {
        question: "¿Hay barreras horarias?",
        answer:
          "Sí, en el Trail Corto hay una Barrera Horaria a los 18km con tiempo máximo de 3h30. Los atletas que superen este tiempo serán descalificados.",
      },
      {
        question: "¿Dónde y cuándo puedo recoger el dorsal?",
        answer:
          "En el Quiosco de Benfeita: Sábado 18/07 de 17:00 a 19:00 o Domingo 19/07 de 07:30 a 08:45.",
      },
      {
        question: "¿Qué incluye la inscripción?",
        answer:
          "Camiseta, dorsal, seguro de accidentes personales, seguro de responsabilidad civil, avituallamientos, refuerzo final y recuerdos de participación.",
      },
      {
        question: "¿Cuántos avituallamientos hay?",
        answer:
          "Trail Corto: 3+1 puntos (Benfeita, Sardal, Benfeita y Meta). Mini Trail: 1+1 puntos (Benfeita y Meta).",
      },
      {
        question: "¿Hay vestuarios disponibles?",
        answer:
          "Sí, la Junta proporciona vestuarios (1 Masculino y 1 Femenino) en la Playa Fluvial. ¡Pero la tradición es 'un buen chapuzón' en la Playa Fluvial!",
      },
      {
        question: "¿Qué pasa en caso de alerta roja?",
        answer:
          "La organización no reembolsa inscripciones. La inscripción se transfiere a la fecha alternativa del 13 de septiembre de 2026 o a la edición 2027.",
      },
    ],
    fr: [
      {
        question: "Où puis-je m'inscrire?",
        answer:
          "Les inscriptions doivent être effectuées via www.runmanager.net. Le paiement doit être fait par référence Multibanco jusqu'au 12 juillet 2026 à 23h59.",
      },
      {
        question: "Quelle est la date limite d'inscription?",
        answer:
          "Les inscriptions ferment le 12 juillet 2026 à 23h59. Après cette date, aucune nouvelle inscription ne sera acceptée.",
      },
      {
        question: "Puis-je transférer mon inscription?",
        answer:
          "Après le 12 juillet, il n'y a pas de remboursement. Les transferts à un autre athlète sont possibles uniquement après analyse individuelle par l'Organisation.",
      },
      {
        question: "Quel est le matériel obligatoire?",
        answer:
          "Couverture thermique de survie, sifflet, réservoir d'eau minimum 0,5L et téléphone portable. L'absence de tout article entraîne une pénalité de 15 minutes.",
      },
      {
        question: "Y a-t-il des barrières horaires?",
        answer:
          "Oui, dans le Trail Court il y a une Barrière Horaire aux 18km avec un temps maximum de 3h30. Les athlètes dépassant ce temps seront disqualifiés.",
      },
      {
        question: "Où et quand puis-je récupérer mon dossard?",
        answer:
          "Au Kiosque de Benfeita: Samedi 18/07 de 17:00 à 19:00 ou Dimanche 19/07 de 07:30 à 08:45.",
      },
      {
        question: "Qu'est-ce qui est inclus dans l'inscription?",
        answer:
          "T-shirt, dossard, assurance accidents personnels, assurance responsabilité civile, ravitaillements, renfort final et souvenirs de participation.",
      },
      {
        question: "Combien de ravitaillements y a-t-il?",
        answer:
          "Trail Court: 3+1 points (Benfeita, Sardal, Benfeita et Arrivée). Mini Trail: 1+1 points (Benfeita et Arrivée).",
      },
      {
        question: "Y a-t-il des vestiaires disponibles?",
        answer:
          "Oui, la Paroisse fournit des vestiaires (1 Homme et 1 Femme) à la Plage Fluviale. Mais la tradition est 'un beau plongeon' dans la Plage Fluviale!",
      },
      {
        question: "Que se passe-t-il en cas d'alerte rouge?",
        answer:
          "L'organisation ne rembourse pas les inscriptions. L'inscription est transférée à la date alternative du 13 septembre 2026 ou à l'édition 2027.",
      },
    ],
    de: [
      {
        question: "Wo kann ich mich anmelden?",
        answer:
          "Anmeldungen müssen über www.runmanager.net erfolgen. Die Zahlung muss per Multibanco-Referenz bis 23:59 Uhr am 12. Juli 2026 erfolgen.",
      },
      {
        question: "Was ist der Anmeldeschluss?",
        answer:
          "Anmeldungen schließen am 12. Juli 2026 um 23:59 Uhr. Nach diesem Datum werden keine neuen Anmeldungen akzeptiert.",
      },
      {
        question: "Kann ich meine Anmeldung übertragen?",
        answer:
          "Nach dem 12. Juli gibt es keine Rückerstattung. Übertragungen an einen anderen Athleten sind nur nach individueller Analyse durch die Organisation möglich.",
      },
      {
        question: "Was ist die Pflichtausrüstung?",
        answer:
          "Überlebens-Thermodecke, Pfeife, Wasserbehälter mit mindestens 0,5L und Mobiltelefon. Das Fehlen eines Gegenstands führt zu einer 15-Minuten-Strafe.",
      },
      {
        question: "Gibt es Zeitbarrieren?",
        answer:
          "Ja, im Kurzen Trail gibt es eine Zeitbarriere bei 18km mit maximal 3h30. Athleten, die diese Zeit überschreiten, werden disqualifiziert.",
      },
      {
        question: "Wo und wann kann ich meine Startnummer abholen?",
        answer:
          "Am Benfeita Kiosk: Samstag 18.07. von 17:00 bis 19:00 oder Sonntag 19.07. von 07:30 bis 08:45.",
      },
      {
        question: "Was ist in der Anmeldung enthalten?",
        answer:
          "T-Shirt, Startnummer, Unfallversicherung, Haftpflichtversicherung, Verpflegungsstellen, Abschlussverpflegung und Teilnahmesouvenirs.",
      },
      {
        question: "Wie viele Verpflegungsstellen gibt es?",
        answer:
          "Kurzer Trail: 3+1 Punkte (Benfeita, Sardal, Benfeita und Ziel). Mini Trail: 1+1 Punkte (Benfeita und Ziel).",
      },
      {
        question: "Sind Umkleideräume verfügbar?",
        answer:
          "Ja, die Gemeinde stellt Umkleideräume (1 Herren und 1 Damen) am Flussstrand zur Verfügung. Aber die Tradition ist 'ein schöner Sprung' in den Flussstrand!",
      },
      {
        question: "Was passiert bei roter Warnung?",
        answer:
          "Die Organisation erstattet keine Anmeldungen. Die Anmeldung wird auf das Alternativdatum 13. September 2026 oder auf die Ausgabe 2027 übertragen.",
      },
    ],
    it: [
      {
        question: "Dove posso iscrivermi?",
        answer:
          "Le iscrizioni devono essere effettuate tramite www.runmanager.net. Il pagamento deve essere fatto tramite riferimento Multibanco entro le 23:59 del 12 luglio 2026.",
      },
      {
        question: "Qual è la scadenza per le iscrizioni?",
        answer:
          "Le iscrizioni chiudono alle 23:59 del 12 luglio 2026. Dopo questa data non saranno accettate nuove iscrizioni.",
      },
      {
        question: "Posso trasferire la mia iscrizione?",
        answer:
          "Dopo il 12 luglio non ci sono rimborsi. I trasferimenti ad un altro atleta sono possibili solo dopo analisi individuale da parte dell'Organizzazione.",
      },
      {
        question: "Qual è il materiale obbligatorio?",
        answer:
          "Coperta termica di sopravvivenza, fischietto, serbatoio d'acqua minimo 0,5L e telefono cellulare. La mancanza di qualsiasi articolo comporta una penalità di 15 minuti.",
      },
      {
        question: "Ci sono barriere orarie?",
        answer:
          "Sì, nel Trail Corto c'è una Barriera Oraria ai 18km con tempo massimo di 3h30. Gli atleti che superano questo tempo saranno squalificati.",
      },
      {
        question: "Dove e quando posso ritirare il pettorale?",
        answer:
          "Al Chiosco di Benfeita: Sabato 18/07 dalle 17:00 alle 19:00 o Domenica 19/07 dalle 07:30 alle 08:45.",
      },
      {
        question: "Cosa è incluso nell'iscrizione?",
        answer:
          "T-shirt, pettorale, assicurazione infortuni personali, assicurazione responsabilità civile, punti ristoro, rinfresco finale e ricordi di partecipazione.",
      },
      {
        question: "Quanti punti ristoro ci sono?",
        answer:
          "Trail Corto: 3+1 punti (Benfeita, Sardal, Benfeita e Traguardo). Mini Trail: 1+1 punti (Benfeita e Traguardo).",
      },
      {
        question: "Ci sono spogliatoi disponibili?",
        answer:
          "Sì, la Parrocchia fornisce spogliatoi (1 Maschile e 1 Femminile) alla Spiaggia Fluviale. Ma la tradizione è 'un bel tuffo' nella Spiaggia Fluviale!",
      },
      {
        question: "Cosa succede in caso di allerta rossa?",
        answer:
          "L'organizzazione non rimborsa le iscrizioni. L'iscrizione viene trasferita alla data alternativa del 13 settembre 2026 o all'edizione 2027.",
      },
    ],
  };

  // Create event
  const event = await prisma.event.create({
    data: {
      title: "13º Benfeita Trail 2026",
      slug: eventSlug,
      description:
        "13ª Edição do Benfeita Trail - Trail em estado puro na Aldeia de Xisto da Benfeita, Arganil. Circuito ADAC e ATRP.",
      startDate: eventStartDate,
      endDate: eventEndDate,
      city: "Arganil",
      country: "Portugal",
      sportTypes: [SportType.TRAIL],
      imageUrl:
        "https://www.aldeiasdoxisto.pt/media/filer_public_thumbnails/filer_public/d5/94/d594c02f-6c80-486f-aa1a-cf6b09efc5d8/praia-fluvial-de-benfeita.jpg__768x0_q95_subsampling-2_upscale.jpg",
      externalUrl: "https://www.runmanager.net",
      registrationDeadline: new Date("2026-07-12T23:59:59Z"),
      latitude: 40.231797,
      longitude: -7.945591,
      googleMapsUrl: "https://maps.app.goo.gl/zwkfua1RiKUCwFvg6",
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
      name: "Trail Curto K21",
      distanceKm: 21.0,
      elevationGainM: null,
      elevationLossM: null,
      cutoffTimeHours: 3.5,
      mountainLevel: 2,
      maxParticipants: 300,
      pricingPhases: [
        {
          name: "1ª Fase - ADAC",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-04-30T23:59:59Z"),
          price: 14.5,
          currency: Currency.EUR,
          note: "Exclusivo atletas ADAC",
        },
        {
          name: "1ª Fase - Geral",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-04-30T23:59:59Z"),
          price: 16.0,
          currency: Currency.EUR,
          note: "Atletas em geral",
        },
        {
          name: "2ª Fase - ADAC",
          startDate: new Date("2026-05-01T00:00:00Z"),
          endDate: new Date("2026-07-12T23:59:59Z"),
          price: 16.5,
          currency: Currency.EUR,
          note: "Exclusivo atletas ADAC",
        },
        {
          name: "2ª Fase - Geral",
          startDate: new Date("2026-05-01T00:00:00Z"),
          endDate: new Date("2026-07-12T23:59:59Z"),
          price: 18.0,
          currency: Currency.EUR,
          note: "Atletas em geral",
        },
      ],
    },
    {
      name: "Mini Trail K11",
      distanceKm: 11.0,
      elevationGainM: null,
      elevationLossM: null,
      cutoffTimeHours: null,
      mountainLevel: 1,
      maxParticipants: 200,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-04-30T23:59:59Z"),
          price: 12.0,
          currency: Currency.EUR,
          note: "1 Fevereiro a 30 Abril 2026",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-05-01T00:00:00Z"),
          endDate: new Date("2026-07-12T23:59:59Z"),
          price: 13.5,
          currency: Currency.EUR,
          note: "1 Maio a 12 Julho 2026",
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

    console.log(`   - Created ${pricingPhases.length} pricing phases`);
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

  console.log("✅ Benfeita Trail 2026 seed completed successfully!");
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedBenfeitaTrail2026()
    .catch((e) => {
      console.error("❌ Error seeding Benfeita Trail 2026:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
