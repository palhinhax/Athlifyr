/**
 * Seed: XII Trilho dos Gatos 2026
 *
 * Event: Trail running in Gatões, Penalva do Castelo
 * Location: Polidesportivo de Gatões, Penalva do Castelo, Viseu
 * Date: April 18-19, 2026 (Trail Kids Saturday, main races Sunday)
 * Organizer: GATÕES BTT
 * Sport: Trail
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🐱 Seeding XII Trilho dos Gatos 2026...");

  // ──────────────────────────────────────────────
  // 1. Upsert Event (no nested creates)
  // ──────────────────────────────────────────────
  const event = await prisma.event.upsert({
    where: { slug: "trilho-dos-gatos-2026" },
    update: {
      title: "XII Trilho dos Gatos 2026",
      description:
        "XII Trilho dos Gatos 2026 - Trail em Gatões, Penalva do Castelo",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-04-18T14:00:00Z"),
      endDate: new Date("2026-04-19T15:00:00Z"),
      registrationDeadline: new Date("2026-04-12T23:59:59Z"),
      externalUrl: "",
      imageUrl: "",
      city: "Gatões",
      country: "Portugal",
      latitude: 40.218746,
      longitude: -8.697927,
      googleMapsUrl: "",
      isFeatured: false,
      cancelled: false,
    },
    create: {
      title: "XII Trilho dos Gatos 2026",
      slug: "trilho-dos-gatos-2026",
      description:
        "XII Trilho dos Gatos 2026 - Trail em Gatões, Penalva do Castelo",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-04-18T14:00:00Z"),
      endDate: new Date("2026-04-19T15:00:00Z"),
      registrationDeadline: new Date("2026-04-12T23:59:59Z"),
      externalUrl: "",
      imageUrl: "",
      city: "Gatões",
      country: "Portugal",
      latitude: 40.218746,
      longitude: -8.697927,
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
      title: "XII Trilho dos Gatos 2026",
      description: `# 🐱 XII Trilho dos Gatos 2026

**O XII Trilho dos Gatos regressa a Gatões, Penalva do Castelo, nos dias 18 e 19 de abril de 2026! Organizado pela GATÕES BTT, este evento combina provas de trail, mini-trail, caminhada e trail kids num cenário natural deslumbrante no distrito de Viseu.**

---

## 🏔️ Provas Disponíveis

### **Trail Curto 19 km**
- **Distância:** 19 km
- **Hora de Partida:** 09h30 (Domingo, 19 de abril)
- **Circuito Nacional de Trail Sprint da ATRP – série 100**
- Trilhos, caminhos rurais, trilhos florestais e single tracks

### **Mini-Trail 12 km**
- **Distância:** 12 km
- **Hora de Partida:** 09h45 (Domingo, 19 de abril)
- **Circuito Distrital de Mini-Trail da ADAC**
- **Circuito Jovem da ATRP – série 150**

### **Caminhada 10 km**
- **Distância:** 10 km
- **Hora de Partida:** 09h45 (Domingo, 19 de abril)
- Percurso aberto a todos

### **Trail Kids** 🧒
- **Distância:** ~2 km (prova aberta)
- **Data:** Sábado, 18 de abril
- **Hora:** 16h00 (várias categorias)
- **Inscrição gratuita!** 🎉
- Categorias: Bambis, Benjamins A, Benjamins B, Infantis, Iniciados

---

## 📅 Programa

### Sábado, 18 de abril de 2026

- **14h00** – Abertura do secretariado – Polidesportivo de Gatões
- **15h45** – Briefing Trail Kids
- **16h00** – Bambis (prova aberta)
- **16h15** – Benjamins A
- **16h30** – Benjamins B
- **16h45** – Infantis
- **17h00** – Iniciados
- **18h00** – Entrega de prémios Trail Kids
- **20h00** – Encerramento do secretariado

### Domingo, 19 de abril de 2026

- **07h30** – Abertura do secretariado
- **09h15** – Briefing Trail Curto 19 km
- **09h30** – Partida Trail Curto 19 km
- **Briefing Mini-Trail e Caminhada**
- **09h45** – Partida Mini-Trail 12 km e Caminhada 10 km
- **12h30** – Entrega de prémios

---

## 🎯 O que está incluído

**Trail Curto / Mini-Trail / Trail Kids:**
✅ Dorsal  
✅ Lembranças  
✅ Prémio Finisher  
✅ Cronometragem  
✅ Abastecimentos sólidos e líquidos (postos e meta)  
✅ Assistência médica  
✅ Prémios por escalão e geral  
✅ Seguro  
✅ Balneários  

**Caminhada:**
✅ Dorsal  
✅ Lembranças  
✅ Prémio Finisher  
✅ Abastecimentos sólidos e líquidos (postos e meta)  
✅ Assistência médica  
✅ Seguro  
✅ Balneários  

---

## 💰 Preços

- **Trail Curto 19 km:** €17,50
- **Mini-Trail 12 km:** €16,50 (€15,00 para filiados ADAC)
- **Caminhada 10 km:** €11,50
- **Trail Kids:** Gratuito 🎉

**Inscrições até 12 de abril de 2026**

---

## 👥 Desconto de Grupo

Por cada 10 inscrições da mesma equipa, a 11ª é gratuita!  
📧 Contacto: gatoesbtt24@gmail.com

---

## 📍 Local

**Polidesportivo de Gatões**  
Gatões, Penalva do Castelo  
Distrito de Viseu, Portugal

---

🐱 **Vem trilhar connosco em Gatões!** 🏔️`,
      city: "Gatões, Penalva do Castelo",
      metaTitle:
        "XII Trilho dos Gatos 2026 - 12ª Edição | Gatões, Penalva do Castelo | 18-19 Abril",
      metaDescription:
        "XII Trilho dos Gatos 2026 - 12ª edição a 18-19 de abril em Gatões, Penalva do Castelo. Provas: Trail Curto 19km, Mini-Trail 12km, Caminhada 10km e Trail Kids. Circuito ATRP e ADAC.",
    },
    en: {
      title: "XII Trilho dos Gatos 2026",
      description: `# 🐱 XII Trilho dos Gatos 2026

**The XII Trilho dos Gatos returns to Gatões, Penalva do Castelo, on April 18-19, 2026! Organized by GATÕES BTT, this event combines trail, mini-trail, walking and trail kids races in a stunning natural setting in the Viseu district.**

---

## 🏔️ Available Races

### **Short Trail 19 km**
- **Distance:** 19 km
- **Start Time:** 9:30 AM (Sunday, April 19)
- **ATRP National Sprint Trail Circuit – Series 100**
- Trails, dirt roads, forest paths and single tracks

### **Mini-Trail 12 km**
- **Distance:** 12 km
- **Start Time:** 9:45 AM (Sunday, April 19)
- **ADAC District Mini-Trail Circuit**
- **ATRP Youth Circuit – Series 150**

### **Walk 10 km**
- **Distance:** 10 km
- **Start Time:** 9:45 AM (Sunday, April 19)
- Open to all

### **Trail Kids** 🧒
- **Distance:** ~2 km (open event)
- **Date:** Saturday, April 18
- **Time:** 4:00 PM (various categories)
- **Free registration!** 🎉
- Categories: Bambis, Benjamins A, Benjamins B, Infantis, Iniciados

---

## 📅 Schedule

### Saturday, April 18, 2026

- **2:00 PM** – Registration desk opens – Polidesportivo de Gatões
- **3:45 PM** – Trail Kids briefing
- **4:00 PM** – Bambis (open race)
- **4:15 PM** – Benjamins A
- **4:30 PM** – Benjamins B
- **4:45 PM** – Infantis
- **5:00 PM** – Iniciados
- **6:00 PM** – Trail Kids award ceremony
- **8:00 PM** – Registration desk closes

### Sunday, April 19, 2026

- **7:30 AM** – Registration desk opens
- **9:15 AM** – Short Trail 19 km briefing
- **9:30 AM** – Short Trail 19 km start
- **Mini-Trail and Walk briefing**
- **9:45 AM** – Mini-Trail 12 km and Walk 10 km start
- **12:30 PM** – Award ceremony

---

## 🎯 What's Included

**Short Trail / Mini-Trail / Trail Kids:**
✅ Bib number  
✅ Souvenirs  
✅ Finisher prize  
✅ Race timing  
✅ Food and drinks at aid stations and finish  
✅ First aid  
✅ Category and overall prizes  
✅ Insurance  
✅ Showers  

**Walk:**
✅ Bib number  
✅ Souvenirs  
✅ Finisher prize  
✅ Food and drinks at aid stations and finish  
✅ First aid  
✅ Insurance  
✅ Showers  

---

## 💰 Prices

- **Short Trail 19 km:** €17.50
- **Mini-Trail 12 km:** €16.50 (€15.00 for ADAC members)
- **Walk 10 km:** €11.50
- **Trail Kids:** Free 🎉

**Registration until April 12, 2026**

---

## 👥 Group Discount

For every 10 registrations from the same team, the 11th is free!  
📧 Contact: gatoesbtt24@gmail.com

---

## 📍 Location

**Polidesportivo de Gatões**  
Gatões, Penalva do Castelo  
Viseu District, Portugal

---

🐱 **Come trail with us in Gatões!** 🏔️`,
      city: "Gatões, Penalva do Castelo",
      metaTitle:
        "XII Trilho dos Gatos 2026 - 12th Edition | Gatões, Penalva do Castelo | April 18-19",
      metaDescription:
        "XII Trilho dos Gatos 2026 - 12th edition on April 18-19 in Gatões, Penalva do Castelo. Races: Short Trail 19km, Mini-Trail 12km, Walk 10km and Trail Kids. ATRP and ADAC circuits.",
    },
    es: {
      title: "XII Trilho dos Gatos 2026",
      description: `# 🐱 XII Trilho dos Gatos 2026

**El XII Trilho dos Gatos regresa a Gatões, Penalva do Castelo, los días 18 y 19 de abril de 2026. Organizado por GATÕES BTT, este evento combina pruebas de trail, mini-trail, caminata y trail kids en un entorno natural impresionante en el distrito de Viseu.**

---

## 🏔️ Pruebas Disponibles

### **Trail Corto 19 km**
- **Distancia:** 19 km
- **Hora de Salida:** 09:30 (Domingo, 19 de abril)
- **Circuito Nacional de Trail Sprint de la ATRP – serie 100**
- Senderos, caminos rurales, pistas forestales y single tracks

### **Mini-Trail 12 km**
- **Distancia:** 12 km
- **Hora de Salida:** 09:45 (Domingo, 19 de abril)
- **Circuito Distrital de Mini-Trail de la ADAC**
- **Circuito Joven de la ATRP – serie 150**

### **Caminata 10 km**
- **Distancia:** 10 km
- **Hora de Salida:** 09:45 (Domingo, 19 de abril)
- Abierta a todos

### **Trail Kids** 🧒
- **Distancia:** ~2 km (evento abierto)
- **Fecha:** Sábado, 18 de abril
- **Hora:** 16:00 (varias categorías)
- **¡Inscripción gratuita!** 🎉
- Categorías: Bambis, Benjamins A, Benjamins B, Infantis, Iniciados

---

## 📅 Programa

### Sábado, 18 de abril de 2026

- **14:00** – Apertura de secretaría – Polidesportivo de Gatões
- **15:45** – Briefing Trail Kids
- **16:00** – Bambis (carrera abierta)
- **16:15** – Benjamins A
- **16:30** – Benjamins B
- **16:45** – Infantis
- **17:00** – Iniciados
- **18:00** – Entrega de premios Trail Kids
- **20:00** – Cierre de secretaría

### Domingo, 19 de abril de 2026

- **07:30** – Apertura de secretaría
- **09:15** – Briefing Trail Corto 19 km
- **09:30** – Salida Trail Corto 19 km
- **Briefing Mini-Trail y Caminata**
- **09:45** – Salida Mini-Trail 12 km y Caminata 10 km
- **12:30** – Entrega de premios

---

## 🎯 Qué incluye

**Trail Corto / Mini-Trail / Trail Kids:**
✅ Dorsal  
✅ Recuerdos  
✅ Premio Finisher  
✅ Cronometraje  
✅ Avituallamiento sólido y líquido (puestos y meta)  
✅ Asistencia médica  
✅ Premios por categoría y general  
✅ Seguro  
✅ Duchas  

**Caminata:**
✅ Dorsal  
✅ Recuerdos  
✅ Premio Finisher  
✅ Avituallamiento sólido y líquido (puestos y meta)  
✅ Asistencia médica  
✅ Seguro  
✅ Duchas  

---

## 💰 Precios

- **Trail Corto 19 km:** €17,50
- **Mini-Trail 12 km:** €16,50 (€15,00 para miembros ADAC)
- **Caminata 10 km:** €11,50
- **Trail Kids:** Gratis 🎉

**Inscripciones hasta el 12 de abril de 2026**

---

## 📍 Ubicación

**Polidesportivo de Gatões**  
Gatões, Penalva do Castelo  
Distrito de Viseu, Portugal

---

🐱 **¡Ven a correr con nosotros en Gatões!** 🏔️`,
      city: "Gatões, Penalva do Castelo",
      metaTitle:
        "XII Trilho dos Gatos 2026 - 12ª Edición | Gatões, Penalva do Castelo | 18-19 Abril",
      metaDescription:
        "XII Trilho dos Gatos 2026 - 12ª edición el 18-19 de abril en Gatões, Penalva do Castelo. Pruebas: Trail Corto 19km, Mini-Trail 12km, Caminata 10km y Trail Kids. Circuitos ATRP y ADAC.",
    },
    fr: {
      title: "XII Trilho dos Gatos 2026",
      description: `# 🐱 XII Trilho dos Gatos 2026

**Le XII Trilho dos Gatos revient à Gatões, Penalva do Castelo, les 18 et 19 avril 2026 ! Organisé par GATÕES BTT, cet événement combine trail, mini-trail, marche et trail kids dans un cadre naturel magnifique du district de Viseu.**

---

## 🏔️ Épreuves Disponibles

### **Trail Court 19 km**
- **Distance :** 19 km
- **Heure de Départ :** 09h30 (Dimanche, 19 avril)
- **Circuit National de Trail Sprint de l'ATRP – série 100**
- Sentiers, chemins ruraux, pistes forestières et single tracks

### **Mini-Trail 12 km**
- **Distance :** 12 km
- **Heure de Départ :** 09h45 (Dimanche, 19 avril)
- **Circuit de District Mini-Trail de l'ADAC**
- **Circuit Jeunes de l'ATRP – série 150**

### **Marche 10 km**
- **Distance :** 10 km
- **Heure de Départ :** 09h45 (Dimanche, 19 avril)
- Ouverte à tous

### **Trail Kids** 🧒
- **Distance :** ~2 km (événement ouvert)
- **Date :** Samedi, 18 avril
- **Heure :** 16h00 (plusieurs catégories)
- **Inscription gratuite !** 🎉
- Catégories : Bambis, Benjamins A, Benjamins B, Infantis, Iniciados

---

## 📅 Programme

### Samedi, 18 avril 2026

- **14h00** – Ouverture du secrétariat – Polidesportivo de Gatões
- **15h45** – Briefing Trail Kids
- **16h00** – Bambis (course ouverte)
- **16h15** – Benjamins A
- **16h30** – Benjamins B
- **16h45** – Infantis
- **17h00** – Iniciados
- **18h00** – Remise des prix Trail Kids
- **20h00** – Fermeture du secrétariat

### Dimanche, 19 avril 2026

- **07h30** – Ouverture du secrétariat
- **09h15** – Briefing Trail Court 19 km
- **09h30** – Départ Trail Court 19 km
- **Briefing Mini-Trail et Marche**
- **09h45** – Départ Mini-Trail 12 km et Marche 10 km
- **12h30** – Remise des prix

---

## 🎯 Ce qui est inclus

**Trail Court / Mini-Trail / Trail Kids :**
✅ Dossard  
✅ Souvenirs  
✅ Prix Finisher  
✅ Chronométrage  
✅ Ravitaillement solide et liquide (postes et arrivée)  
✅ Assistance médicale  
✅ Prix par catégorie et général  
✅ Assurance  
✅ Douches  

**Marche :**
✅ Dossard  
✅ Souvenirs  
✅ Prix Finisher  
✅ Ravitaillement solide et liquide (postes et arrivée)  
✅ Assistance médicale  
✅ Assurance  
✅ Douches  

---

## 💰 Tarifs

- **Trail Court 19 km :** 17,50 €
- **Mini-Trail 12 km :** 16,50 € (15,00 € pour les membres ADAC)
- **Marche 10 km :** 11,50 €
- **Trail Kids :** Gratuit 🎉

**Inscriptions jusqu'au 12 avril 2026**

---

## 📍 Lieu

**Polidesportivo de Gatões**  
Gatões, Penalva do Castelo  
District de Viseu, Portugal

---

🐱 **Venez courir avec nous à Gatões !** 🏔️`,
      city: "Gatões, Penalva do Castelo",
      metaTitle:
        "XII Trilho dos Gatos 2026 - 12e Édition | Gatões, Penalva do Castelo | 18-19 Avril",
      metaDescription:
        "XII Trilho dos Gatos 2026 - 12e édition les 18-19 avril à Gatões, Penalva do Castelo. Épreuves : Trail Court 19km, Mini-Trail 12km, Marche 10km et Trail Kids. Circuits ATRP et ADAC.",
    },
    de: {
      title: "XII Trilho dos Gatos 2026",
      description: `# 🐱 XII Trilho dos Gatos 2026

**Der XII Trilho dos Gatos kehrt am 18. und 19. April 2026 nach Gatões, Penalva do Castelo, zurück! Organisiert von GATÕES BTT, vereint dieses Event Trail, Mini-Trail, Wanderung und Trail Kids in einer atemberaubenden Naturkulisse im Bezirk Viseu.**

---

## 🏔️ Verfügbare Läufe

### **Kurz-Trail 19 km**
- **Distanz:** 19 km
- **Startzeit:** 09:30 Uhr (Sonntag, 19. April)
- **Nationaler Sprint-Trail-Circuit der ATRP – Serie 100**
- Trails, Feldwege, Waldpfade und Single Tracks

### **Mini-Trail 12 km**
- **Distanz:** 12 km
- **Startzeit:** 09:45 Uhr (Sonntag, 19. April)
- **Bezirks-Mini-Trail-Circuit der ADAC**
- **Jugend-Circuit der ATRP – Serie 150**

### **Wanderung 10 km**
- **Distanz:** 10 km
- **Startzeit:** 09:45 Uhr (Sonntag, 19. April)
- Offen für alle

### **Trail Kids** 🧒
- **Distanz:** ~2 km (offenes Event)
- **Datum:** Samstag, 18. April
- **Uhrzeit:** 16:00 Uhr (verschiedene Kategorien)
- **Kostenlose Anmeldung!** 🎉
- Kategorien: Bambis, Benjamins A, Benjamins B, Infantis, Iniciados

---

## 📅 Programm

### Samstag, 18. April 2026

- **14:00** – Öffnung des Sekretariats – Polidesportivo de Gatões
- **15:45** – Trail Kids Briefing
- **16:00** – Bambis (offenes Rennen)
- **16:15** – Benjamins A
- **16:30** – Benjamins B
- **16:45** – Infantis
- **17:00** – Iniciados
- **18:00** – Trail Kids Siegerehrung
- **20:00** – Schließung des Sekretariats

### Sonntag, 19. April 2026

- **07:30** – Öffnung des Sekretariats
- **09:15** – Briefing Kurz-Trail 19 km
- **09:30** – Start Kurz-Trail 19 km
- **Briefing Mini-Trail und Wanderung**
- **09:45** – Start Mini-Trail 12 km und Wanderung 10 km
- **12:30** – Siegerehrung

---

## 🎯 Was ist enthalten

**Kurz-Trail / Mini-Trail / Trail Kids:**
✅ Startnummer  
✅ Andenken  
✅ Finisher-Preis  
✅ Zeitmessung  
✅ Verpflegung mit Essen und Getränken (Stationen und Ziel)  
✅ Sanitätsdienst  
✅ Kategorie- und Gesamtpreise  
✅ Versicherung  
✅ Duschen  

**Wanderung:**
✅ Startnummer  
✅ Andenken  
✅ Finisher-Preis  
✅ Verpflegung mit Essen und Getränken (Stationen und Ziel)  
✅ Sanitätsdienst  
✅ Versicherung  
✅ Duschen  

---

## 💰 Preise

- **Kurz-Trail 19 km:** 17,50 €
- **Mini-Trail 12 km:** 16,50 € (15,00 € für ADAC-Mitglieder)
- **Wanderung 10 km:** 11,50 €
- **Trail Kids:** Kostenlos 🎉

**Anmeldung bis zum 12. April 2026**

---

## 📍 Veranstaltungsort

**Polidesportivo de Gatões**  
Gatões, Penalva do Castelo  
Bezirk Viseu, Portugal

---

🐱 **Komm und lauf mit uns in Gatões!** 🏔️`,
      city: "Gatões, Penalva do Castelo",
      metaTitle:
        "XII Trilho dos Gatos 2026 - 12. Ausgabe | Gatões, Penalva do Castelo | 18.-19. April",
      metaDescription:
        "XII Trilho dos Gatos 2026 - 12. Ausgabe am 18.-19. April in Gatões, Penalva do Castelo. Läufe: Kurz-Trail 19km, Mini-Trail 12km, Wanderung 10km und Trail Kids. ATRP- und ADAC-Circuits.",
    },
    it: {
      title: "XII Trilho dos Gatos 2026",
      description: `# 🐱 XII Trilho dos Gatos 2026

**Il XII Trilho dos Gatos torna a Gatões, Penalva do Castelo, il 18 e 19 aprile 2026! Organizzato da GATÕES BTT, questo evento combina trail, mini-trail, camminata e trail kids in uno scenario naturale straordinario nel distretto di Viseu.**

---

## 🏔️ Gare Disponibili

### **Trail Corto 19 km**
- **Distanza:** 19 km
- **Ora di Partenza:** 09:30 (Domenica, 19 aprile)
- **Circuito Nazionale di Trail Sprint dell'ATRP – serie 100**
- Sentieri, strade sterrate, piste forestali e single track

### **Mini-Trail 12 km**
- **Distanza:** 12 km
- **Ora di Partenza:** 09:45 (Domenica, 19 aprile)
- **Circuito Distrettuale Mini-Trail dell'ADAC**
- **Circuito Giovani dell'ATRP – serie 150**

### **Camminata 10 km**
- **Distanza:** 10 km
- **Ora di Partenza:** 09:45 (Domenica, 19 aprile)
- Aperta a tutti

### **Trail Kids** 🧒
- **Distanza:** ~2 km (evento aperto)
- **Data:** Sabato, 18 aprile
- **Ora:** 16:00 (varie categorie)
- **Iscrizione gratuita!** 🎉
- Categorie: Bambis, Benjamins A, Benjamins B, Infantis, Iniciados

---

## 📅 Programma

### Sabato, 18 aprile 2026

- **14:00** – Apertura segreteria – Polidesportivo de Gatões
- **15:45** – Briefing Trail Kids
- **16:00** – Bambis (gara aperta)
- **16:15** – Benjamins A
- **16:30** – Benjamins B
- **16:45** – Infantis
- **17:00** – Iniciados
- **18:00** – Premiazione Trail Kids
- **20:00** – Chiusura segreteria

### Domenica, 19 aprile 2026

- **07:30** – Apertura segreteria
- **09:15** – Briefing Trail Corto 19 km
- **09:30** – Partenza Trail Corto 19 km
- **Briefing Mini-Trail e Camminata**
- **09:45** – Partenza Mini-Trail 12 km e Camminata 10 km
- **12:30** – Premiazione

---

## 🎯 Cosa è incluso

**Trail Corto / Mini-Trail / Trail Kids:**
✅ Pettorale  
✅ Souvenir  
✅ Premio Finisher  
✅ Cronometraggio  
✅ Ristoro con cibo e bevande (punti di ristoro e arrivo)  
✅ Assistenza medica  
✅ Premi per categoria e classifica generale  
✅ Assicurazione  
✅ Docce  

**Camminata:**
✅ Pettorale  
✅ Souvenir  
✅ Premio Finisher  
✅ Ristoro con cibo e bevande (punti di ristoro e arrivo)  
✅ Assistenza medica  
✅ Assicurazione  
✅ Docce  

---

## 💰 Prezzi

- **Trail Corto 19 km:** €17,50
- **Mini-Trail 12 km:** €16,50 (€15,00 per i tesserati ADAC)
- **Camminata 10 km:** €11,50
- **Trail Kids:** Gratuito 🎉

**Iscrizioni fino al 12 aprile 2026**

---

## 📍 Luogo

**Polidesportivo de Gatões**  
Gatões, Penalva do Castelo  
Distretto di Viseu, Portogallo

---

🐱 **Vieni a correre con noi a Gatões!** 🏔️`,
      city: "Gatões, Penalva do Castelo",
      metaTitle:
        "XII Trilho dos Gatos 2026 - 12ª Edizione | Gatões, Penalva do Castelo | 18-19 Aprile",
      metaDescription:
        "XII Trilho dos Gatos 2026 - 12ª edizione il 18-19 aprile a Gatões, Penalva do Castelo. Gare: Trail Corto 19km, Mini-Trail 12km, Camminata 10km e Trail Kids. Circuiti ATRP e ADAC.",
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
        data,
      });
    } else {
      return await prisma.pricingPhase.create({
        data: { eventId: event.id, name, ...data },
      });
    }
  };

  // ── Variant 1: Trail Curto 19 km ──
  const trailCurto = await findOrCreateVariant({
    name: "Trail Curto 19km",
    distanceKm: 19,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-19T09:30:00Z"),
    startTime: "09:30",
    cutoffTimeHours: null,
    price: 17.5,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Trail Curto 19km · Circuito Nacional de Trail Sprint da ATRP – série 100",
  });
  console.log(`✅ Variant: ${trailCurto.name}`);

  // ── Variant 2: Mini-Trail 12 km ──
  const miniTrail = await findOrCreateVariant({
    name: "Mini-Trail 12km",
    distanceKm: 12,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-19T09:45:00Z"),
    startTime: "09:45",
    cutoffTimeHours: null,
    price: 16.5,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Mini-Trail 12km · Circuito Distrital de Mini-Trail da ADAC · Circuito Jovem da ATRP – série 150",
  });
  console.log(`✅ Variant: ${miniTrail.name}`);

  // ── Variant 3: Caminhada 10 km ──
  const caminhada = await findOrCreateVariant({
    name: "Caminhada 10km",
    distanceKm: 10,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-19T09:45:00Z"),
    startTime: "09:45",
    cutoffTimeHours: null,
    price: 11.5,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description: "Caminhada 10km · Percurso aberto a todos",
  });
  console.log(`✅ Variant: ${caminhada.name}`);

  // ── Variant 4: Trail Kids ──
  const trailKids = await findOrCreateVariant({
    name: "Trail Kids",
    distanceKm: 2,
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-18T16:00:00Z"),
    startTime: "16:00",
    cutoffTimeHours: null,
    price: 0,
    currency: Currency.EUR,
    maxParticipants: null,
    atrpGrade: null,
    itraPoints: null,
    description:
      "Trail Kids ~2km · Prova aberta · Categorias: Bambis, Benjamins A, Benjamins B, Infantis, Iniciados",
  });
  console.log(`✅ Variant: ${trailKids.name}`);

  // ──────────────────────────────────────────────
  // 4. Pricing Phases (linked to eventId)
  // ──────────────────────────────────────────────

  // Trail Curto 19km - Single phase
  await findOrCreatePricingPhase("Trail Curto 19km - Inscrição", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-04-12T23:59:59Z"),
    price: 17.5,
    currency: Currency.EUR,
    note: "Inscrições até 12 de abril de 2026",
  });
  console.log("   - 1 pricing phase for Trail Curto 19km");

  // Mini-Trail 12km - General price
  await findOrCreatePricingPhase("Mini-Trail 12km - Inscrição", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-04-12T23:59:59Z"),
    price: 16.5,
    currency: Currency.EUR,
    note: "Inscrições até 12 de abril de 2026",
  });

  // Mini-Trail 12km - ADAC member discount
  await findOrCreatePricingPhase("Mini-Trail 12km - Filiados ADAC", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-04-12T23:59:59Z"),
    price: 15.0,
    currency: Currency.EUR,
    note: "Preço para filiados ADAC (até 12 de abril de 2026)",
  });
  console.log(
    "   - 2 pricing phases for Mini-Trail 12km (geral + filiados ADAC)"
  );

  // Caminhada 10km - Single phase
  await findOrCreatePricingPhase("Caminhada 10km - Inscrição", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-04-12T23:59:59Z"),
    price: 11.5,
    currency: Currency.EUR,
    note: "Inscrições até 12 de abril de 2026",
  });
  console.log("   - 1 pricing phase for Caminhada 10km");

  // Trail Kids - Free
  await findOrCreatePricingPhase("Trail Kids - Inscrição Gratuita", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-04-12T23:59:59Z"),
    price: 0,
    currency: Currency.EUR,
    note: "Inscrição gratuita",
  });
  console.log("   - 1 pricing phase for Trail Kids (gratuito)");

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

  // FAQ 0: When and where
  const faq0 = await findOrCreateFAQ(
    event.id,
    0,
    "Quando e onde se realiza o XII Trilho dos Gatos?",
    "O evento realiza-se nos dias 18 e 19 de abril de 2026 no Polidesportivo de Gatões, Penalva do Castelo, distrito de Viseu. O Trail Kids é no sábado (18) e as provas principais no domingo (19)."
  );

  const faq0Translations = {
    pt: {
      question: "Quando e onde se realiza o XII Trilho dos Gatos?",
      answer:
        "O evento realiza-se nos dias 18 e 19 de abril de 2026 no Polidesportivo de Gatões, Penalva do Castelo, distrito de Viseu. O Trail Kids é no sábado (18) e as provas principais no domingo (19).",
    },
    en: {
      question: "When and where does the XII Trilho dos Gatos take place?",
      answer:
        "The event takes place on April 18-19, 2026 at the Polidesportivo de Gatões, Penalva do Castelo, Viseu district. Trail Kids is on Saturday (18th) and the main races on Sunday (19th).",
    },
    es: {
      question: "¿Cuándo y dónde se celebra el XII Trilho dos Gatos?",
      answer:
        "El evento se celebra los días 18 y 19 de abril de 2026 en el Polidesportivo de Gatões, Penalva do Castelo, distrito de Viseu. El Trail Kids es el sábado (18) y las pruebas principales el domingo (19).",
    },
    fr: {
      question: "Quand et où se déroule le XII Trilho dos Gatos ?",
      answer:
        "L'événement se déroule les 18 et 19 avril 2026 au Polidesportivo de Gatões, Penalva do Castelo, district de Viseu. Le Trail Kids a lieu le samedi (18) et les épreuves principales le dimanche (19).",
    },
    de: {
      question: "Wann und wo findet der XII Trilho dos Gatos statt?",
      answer:
        "Die Veranstaltung findet am 18. und 19. April 2026 im Polidesportivo de Gatões, Penalva do Castelo, Bezirk Viseu statt. Trail Kids ist am Samstag (18.) und die Hauptrennen am Sonntag (19.).",
    },
    it: {
      question: "Quando e dove si svolge il XII Trilho dos Gatos?",
      answer:
        "L'evento si svolge il 18 e 19 aprile 2026 al Polidesportivo de Gatões, Penalva do Castelo, distretto di Viseu. Il Trail Kids è il sabato (18) e le gare principali la domenica (19).",
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
  console.log("✅ FAQ 0: When and where");

  // FAQ 1: Available races
  const faq1 = await findOrCreateFAQ(
    event.id,
    1,
    "Que provas estão disponíveis?",
    "Estão disponíveis 4 provas: Trail Curto 19km (Circuito Nacional de Trail Sprint ATRP – série 100), Mini-Trail 12km (Circuito Distrital de Mini-Trail ADAC e Circuito Jovem ATRP – série 150), Caminhada 10km e Trail Kids (~2km, gratuito)."
  );

  const faq1Translations = {
    pt: {
      question: "Que provas estão disponíveis?",
      answer:
        "Estão disponíveis 4 provas: Trail Curto 19km (Circuito Nacional de Trail Sprint ATRP – série 100), Mini-Trail 12km (Circuito Distrital de Mini-Trail ADAC e Circuito Jovem ATRP – série 150), Caminhada 10km e Trail Kids (~2km, gratuito).",
    },
    en: {
      question: "What races are available?",
      answer:
        "There are 4 races available: Short Trail 19km (ATRP National Sprint Trail Circuit – Series 100), Mini-Trail 12km (ADAC District Mini-Trail Circuit and ATRP Youth Circuit – Series 150), Walk 10km and Trail Kids (~2km, free).",
    },
    es: {
      question: "¿Qué pruebas están disponibles?",
      answer:
        "Hay 4 pruebas disponibles: Trail Corto 19km (Circuito Nacional de Trail Sprint ATRP – serie 100), Mini-Trail 12km (Circuito Distrital de Mini-Trail ADAC y Circuito Joven ATRP – serie 150), Caminata 10km y Trail Kids (~2km, gratis).",
    },
    fr: {
      question: "Quelles épreuves sont disponibles ?",
      answer:
        "4 épreuves sont disponibles : Trail Court 19km (Circuit National de Trail Sprint ATRP – série 100), Mini-Trail 12km (Circuit de District Mini-Trail ADAC et Circuit Jeunes ATRP – série 150), Marche 10km et Trail Kids (~2km, gratuit).",
    },
    de: {
      question: "Welche Läufe sind verfügbar?",
      answer:
        "Es gibt 4 Läufe: Kurz-Trail 19km (Nationaler Sprint-Trail-Circuit der ATRP – Serie 100), Mini-Trail 12km (Bezirks-Mini-Trail-Circuit der ADAC und Jugend-Circuit der ATRP – Serie 150), Wanderung 10km und Trail Kids (~2km, kostenlos).",
    },
    it: {
      question: "Quali gare sono disponibili?",
      answer:
        "Sono disponibili 4 gare: Trail Corto 19km (Circuito Nazionale di Trail Sprint ATRP – serie 100), Mini-Trail 12km (Circuito Distrettuale Mini-Trail ADAC e Circuito Giovani ATRP – serie 150), Camminata 10km e Trail Kids (~2km, gratuito).",
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
  console.log("✅ FAQ 1: Available races");

  // FAQ 2: Prices
  const faq2 = await findOrCreateFAQ(
    event.id,
    2,
    "Quais são os preços de inscrição?",
    "Trail Curto 19km: €17,50 · Mini-Trail 12km: €16,50 (€15,00 para filiados ADAC) · Caminhada 10km: €11,50 · Trail Kids: Gratuito. Inscrições até 12 de abril de 2026."
  );

  const faq2Translations = {
    pt: {
      question: "Quais são os preços de inscrição?",
      answer:
        "Trail Curto 19km: €17,50 · Mini-Trail 12km: €16,50 (€15,00 para filiados ADAC) · Caminhada 10km: €11,50 · Trail Kids: Gratuito. Inscrições até 12 de abril de 2026.",
    },
    en: {
      question: "What are the registration prices?",
      answer:
        "Short Trail 19km: €17.50 · Mini-Trail 12km: €16.50 (€15.00 for ADAC members) · Walk 10km: €11.50 · Trail Kids: Free. Registration until April 12, 2026.",
    },
    es: {
      question: "¿Cuáles son los precios de inscripción?",
      answer:
        "Trail Corto 19km: €17,50 · Mini-Trail 12km: €16,50 (€15,00 para miembros ADAC) · Caminata 10km: €11,50 · Trail Kids: Gratis. Inscripciones hasta el 12 de abril de 2026.",
    },
    fr: {
      question: "Quels sont les tarifs d'inscription ?",
      answer:
        "Trail Court 19km : 17,50 € · Mini-Trail 12km : 16,50 € (15,00 € pour les membres ADAC) · Marche 10km : 11,50 € · Trail Kids : Gratuit. Inscriptions jusqu'au 12 avril 2026.",
    },
    de: {
      question: "Wie hoch sind die Anmeldegebühren?",
      answer:
        "Kurz-Trail 19km: 17,50 € · Mini-Trail 12km: 16,50 € (15,00 € für ADAC-Mitglieder) · Wanderung 10km: 11,50 € · Trail Kids: Kostenlos. Anmeldung bis zum 12. April 2026.",
    },
    it: {
      question: "Quali sono i prezzi di iscrizione?",
      answer:
        "Trail Corto 19km: €17,50 · Mini-Trail 12km: €16,50 (€15,00 per tesserati ADAC) · Camminata 10km: €11,50 · Trail Kids: Gratuito. Iscrizioni fino al 12 aprile 2026.",
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
  console.log("✅ FAQ 2: Prices");

  // FAQ 3: Group discount
  const faq3 = await findOrCreateFAQ(
    event.id,
    3,
    "Existe desconto para grupos/equipas?",
    "Sim! Por cada 10 inscrições da mesma equipa, a 11ª inscrição é gratuita. Para usufruir deste desconto, contacta a organização por email: gatoesbtt24@gmail.com."
  );

  const faq3Translations = {
    pt: {
      question: "Existe desconto para grupos/equipas?",
      answer:
        "Sim! Por cada 10 inscrições da mesma equipa, a 11ª inscrição é gratuita. Para usufruir deste desconto, contacta a organização por email: gatoesbtt24@gmail.com.",
    },
    en: {
      question: "Are there group/team discounts?",
      answer:
        "Yes! For every 10 registrations from the same team, the 11th registration is free. To take advantage of this discount, contact the organization by email: gatoesbtt24@gmail.com.",
    },
    es: {
      question: "¿Hay descuentos para grupos/equipos?",
      answer:
        "¡Sí! Por cada 10 inscripciones del mismo equipo, la 11ª es gratuita. Para aprovechar este descuento, contacta con la organización por email: gatoesbtt24@gmail.com.",
    },
    fr: {
      question: "Y a-t-il des réductions pour les groupes/équipes ?",
      answer:
        "Oui ! Pour chaque 10 inscriptions de la même équipe, la 11e est gratuite. Pour profiter de cette réduction, contactez l'organisation par email : gatoesbtt24@gmail.com.",
    },
    de: {
      question: "Gibt es Gruppen-/Teamrabatte?",
      answer:
        "Ja! Für jeweils 10 Anmeldungen desselben Teams ist die 11. Anmeldung kostenlos. Um diesen Rabatt zu nutzen, kontaktiere die Organisation per E-Mail: gatoesbtt24@gmail.com.",
    },
    it: {
      question: "Ci sono sconti per gruppi/squadre?",
      answer:
        "Sì! Per ogni 10 iscrizioni della stessa squadra, l'11ª è gratuita. Per usufruire di questo sconto, contatta l'organizzazione via email: gatoesbtt24@gmail.com.",
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
  console.log("✅ FAQ 3: Group discount");

  // FAQ 4: What's included
  const faq4 = await findOrCreateFAQ(
    event.id,
    4,
    "O que está incluído na inscrição?",
    "Trail Curto, Mini-Trail e Trail Kids: dorsal, lembranças, prémio finisher, cronometragem, abastecimentos, assistência médica, prémios por escalão/geral, seguro e balneários. Caminhada: dorsal, lembranças, prémio finisher, abastecimentos, assistência médica, seguro e balneários."
  );

  const faq4Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "Trail Curto, Mini-Trail e Trail Kids: dorsal, lembranças, prémio finisher, cronometragem, abastecimentos, assistência médica, prémios por escalão/geral, seguro e balneários. Caminhada: dorsal, lembranças, prémio finisher, abastecimentos, assistência médica, seguro e balneários.",
    },
    en: {
      question: "What's included in the registration?",
      answer:
        "Short Trail, Mini-Trail and Trail Kids: bib number, souvenirs, finisher prize, race timing, food/drinks at aid stations and finish, first aid, category/overall prizes, insurance and showers. Walk: bib number, souvenirs, finisher prize, food/drinks at aid stations and finish, first aid, insurance and showers.",
    },
    es: {
      question: "¿Qué incluye la inscripción?",
      answer:
        "Trail Corto, Mini-Trail y Trail Kids: dorsal, recuerdos, premio finisher, cronometraje, avituallamiento, asistencia médica, premios por categoría/general, seguro y duchas. Caminata: dorsal, recuerdos, premio finisher, avituallamiento, asistencia médica, seguro y duchas.",
    },
    fr: {
      question: "Qu'est-ce qui est inclus dans l'inscription ?",
      answer:
        "Trail Court, Mini-Trail et Trail Kids : dossard, souvenirs, prix finisher, chronométrage, ravitaillement, assistance médicale, prix par catégorie/général, assurance et douches. Marche : dossard, souvenirs, prix finisher, ravitaillement, assistance médicale, assurance et douches.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Kurz-Trail, Mini-Trail und Trail Kids: Startnummer, Andenken, Finisher-Preis, Zeitmessung, Verpflegung, Sanitätsdienst, Kategorie-/Gesamtpreise, Versicherung und Duschen. Wanderung: Startnummer, Andenken, Finisher-Preis, Verpflegung, Sanitätsdienst, Versicherung und Duschen.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "Trail Corto, Mini-Trail e Trail Kids: pettorale, souvenir, premio finisher, cronometraggio, ristoro, assistenza medica, premi per categoria/classifica generale, assicurazione e docce. Camminata: pettorale, souvenir, premio finisher, ristoro, assistenza medica, assicurazione e docce.",
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
  console.log("✅ FAQ 4: What's included");

  // FAQ 5: Trail Kids details
  const faq5 = await findOrCreateFAQ(
    event.id,
    5,
    "Como funciona o Trail Kids?",
    "O Trail Kids realiza-se no sábado, 18 de abril, a partir das 16h00. É gratuito e aberto a crianças de várias faixas etárias: Bambis, Benjamins A, Benjamins B, Infantis e Iniciados. Cada categoria parte em intervalos de 15 minutos."
  );

  const faq5Translations = {
    pt: {
      question: "Como funciona o Trail Kids?",
      answer:
        "O Trail Kids realiza-se no sábado, 18 de abril, a partir das 16h00. É gratuito e aberto a crianças de várias faixas etárias: Bambis, Benjamins A, Benjamins B, Infantis e Iniciados. Cada categoria parte em intervalos de 15 minutos.",
    },
    en: {
      question: "How does Trail Kids work?",
      answer:
        "Trail Kids takes place on Saturday, April 18, starting at 4:00 PM. It's free and open to children of various age groups: Bambis, Benjamins A, Benjamins B, Infantis and Iniciados. Each category starts at 15-minute intervals.",
    },
    es: {
      question: "¿Cómo funciona el Trail Kids?",
      answer:
        "El Trail Kids se celebra el sábado 18 de abril, a partir de las 16:00. Es gratuito y abierto a niños de varias categorías: Bambis, Benjamins A, Benjamins B, Infantis e Iniciados. Cada categoría sale a intervalos de 15 minutos.",
    },
    fr: {
      question: "Comment fonctionne le Trail Kids ?",
      answer:
        "Le Trail Kids se déroule le samedi 18 avril, à partir de 16h00. Il est gratuit et ouvert aux enfants de différentes catégories d'âge : Bambis, Benjamins A, Benjamins B, Infantis et Iniciados. Chaque catégorie part à 15 minutes d'intervalle.",
    },
    de: {
      question: "Wie funktioniert Trail Kids?",
      answer:
        "Trail Kids findet am Samstag, 18. April, ab 16:00 Uhr statt. Es ist kostenlos und offen für Kinder verschiedener Altersgruppen: Bambis, Benjamins A, Benjamins B, Infantis und Iniciados. Jede Kategorie startet im 15-Minuten-Takt.",
    },
    it: {
      question: "Come funziona il Trail Kids?",
      answer:
        "Il Trail Kids si svolge sabato 18 aprile, a partire dalle 16:00. È gratuito e aperto ai bambini di diverse fasce d'età: Bambis, Benjamins A, Benjamins B, Infantis e Iniciados. Ogni categoria parte a intervalli di 15 minuti.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: {
        faqId_language: { faqId: faq5.id, language: Language[lang] },
      },
      update: faq5Translations[lang],
      create: {
        faqId: faq5.id,
        language: Language[lang],
        ...faq5Translations[lang],
      },
    });
  }
  console.log("✅ FAQ 5: Trail Kids details");

  // ──────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────
  console.log(`
✅ Seed completed successfully!

📊 Summary:
- Event: XII Trilho dos Gatos 2026
- Slug: trilho-dos-gatos-2026
- Variants: 4 (Trail Curto 19km, Mini-Trail 12km, Caminhada 10km, Trail Kids)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 5 total (1 × Trail Curto + 2 × Mini-Trail + 1 × Caminhada + 1 × Trail Kids)
- FAQs: 6 (with translations in all 6 languages)
- Date: April 18-19, 2026
- Location: Gatões, Penalva do Castelo, Viseu, Portugal
- Coordinates: 40.218746, -8.697927
- Organization: GATÕES BTT
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
