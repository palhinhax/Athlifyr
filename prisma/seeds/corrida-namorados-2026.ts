/**
 * Seed: 11ª Corrida dos Namorados 2026
 * Complete with translations in all 6 languages
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("💕 Seeding 11ª Corrida dos Namorados 2026...");

  const eventSlug = "corrida-namorados-2026";

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "11ª Corrida dos Namorados",
      description: `11ª edição da Corrida dos Namorados no Instituto Superior de Agronomia, Lisboa. Corrida de 10km para casais (obrigatório cruzar a meta juntos) e solteiros, além de caminhada de 5km. Partidas escalonadas: solteiros e 1º elemento às 10h00, 2º elemento do casal e caminhada às 10h05. Evento inserido no Junior 7s International Youth Rugby.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-02-15T10:00:00.000Z"),
      endDate: null,
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7071,
      longitude: -9.1833,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Instituto+Superior+Agronomia+Lisboa",
      externalUrl: "https://xistarca.pt/corrida-namorados-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-15T09:30:00.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "11ª Corrida dos Namorados",
      description: `11ª edição da Corrida dos Namorados no Instituto Superior de Agronomia, Lisboa. Corrida de 10km para casais (obrigatório cruzar a meta juntos) e solteiros, além de caminhada de 5km. Partidas escalonadas: solteiros e 1º elemento às 10h00, 2º elemento do casal e caminhada às 10h05. Evento inserido no Junior 7s International Youth Rugby.`,
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-02-15T10:00:00.000Z"),
      endDate: null,
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7071,
      longitude: -9.1833,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Instituto+Superior+Agronomia+Lisboa",
      externalUrl: "https://xistarca.pt/corrida-namorados-2026",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-02-15T09:30:00.000Z"),
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
      title: "11ª Corrida dos Namorados",
      description: `# 💕 11ª Corrida dos Namorados 2026

Bem-vindos à **11ª edição da Corrida dos Namorados**! Um percurso de 10km no Instituto Superior de Agronomia, **unidos num só objetivo... passar a meta em conjunto!**

Não importa o ritmo, o importante é compartilhar o prazer da atividade física, num ambiente de natureza e envolvidos por uma atmosfera de romantismo e cumplicidade.

## 📅 Data e Local

**Data:** 15 de Fevereiro de 2026 (Domingo)  
**Local:** Instituto Superior de Agronomia (ISA), Lisboa  
**Ambiente:** Percurso em plena natureza, atmosfera romântica

## 🏃‍♀️🏃‍♂️ Provas Disponíveis

### Corrida 10km - Casais
- **Horário Partida:**
  - **10h00:** Solteiros + 1º elemento do casal
  - **10h05:** 2º elemento do casal
- **Idade:** +18 anos
- **REGRA ESPECIAL:** Obrigatório cruzar a meta **juntos**!
- **Classificação:** Por ordem de chegada do casal (ambos juntos)

### Corrida 10km - Solteiros
- **Horário:** 10h00
- **Idade:** +18 anos
- **Classificação:** Geral masculina e feminina

### Caminhada 5km
- **Horário:** 10h05
- **Idade:** Todas as idades
- **Percurso:** Ambiente natural do ISA

## 💑 Corrida de Casais - Como Funciona

A Corrida dos Namorados tem uma vertente única: **a corrida de casais!**

### Regras para Casais:
1. **Partidas Escalonadas:**
   - 1º elemento do casal parte às **10h00**
   - 2º elemento do casal parte às **10h05** (5 minutos depois)
2. **Meta Conjunta:** É **OBRIGATÓRIO** cruzarem a meta **juntos**
3. **Classificação:** Por ordem de chegada do casal (não individual)
4. **Espírito:** Romantismo, cumplicidade e partilha do esforço

Não importa o ritmo, o importante é chegar juntos! 💕

## 📝 Inscrições

**Prazo:** Até 15 de Fevereiro às 09:30  

**Extras Disponíveis:**
- 👕 T-shirt técnica Ultradry: 5,00€
- 📋 Entrega de dorsal no dia do evento: 3,00€ (se comprado online) / 3,50€ (no local)

Inscreve-te em: [xistarca.pt](https://xistarca.pt/corrida-namorados-2026)

## 🎁 Kit de Participação

Todos os participantes recebem:
- 🎽 **Dorsal** (com chip para Corrida 10km)
- 🎁 **Ofertas de Patrocinadores**

**IMPORTANTE:** O chip NO dorsal NÃO pode ser dobrado!

## 📦 Levantamento do Kit

### Instalações Xistarca:
- **12 Fevereiro (quinta-feira):** 10h00 - 18h30
- **13 Fevereiro (sexta-feira):** 10h00 - 20h00

### No dia do evento:
- **15 Fevereiro (domingo):** 08h30 - 09h30, no local da partida
- **Custo:** 3,00€ (se comprado online) / 3,50€ (sem compra prévia)

**Documentos necessários:**
- Cartão de Cidadão, Passaporte, Carta de Condução ou outro com foto
- Número de dorsal (recebido por email)

💚 **Traz um saco reutilizável** para levares o teu kit. Preserva o meio-ambiente!

## 🏆 Prémios

### Corrida 10km - Casais:
- 🥇 **Troféus** para os 3 primeiros classificados de cada escalão
- **Classificação:** Por ordem de chegada do casal (obrigatório chegarem juntos)

### Corrida 10km - Solteiros:
- 🥇 **Troféus** para os 3 primeiros classificados da geral masculina e feminina

**Prazo de levantamento:** Até 30 dias após o evento nas instalações da Xistarca

## 👥 Escalões para Corrida de Casais

A classificação é feita pela **soma das idades dos dois elementos**:

- **Escalão 1:** Até 75 anos (total)
- **Escalão 2:** Entre 76 e 99 anos (total)
- **Escalão 3:** Mais de 100 anos (total)

**Exemplo:** Se tens 30 anos e o/a teu/tua parceiro/a tem 28, estão no Escalão 1 (30+28=58 anos).

## 💧 Abastecimentos

- **10km:** Água Vimeiro aos 5km e no final
- **5km:** Água Vimeiro no final

## 🎒 Bengaleiro

Disponível na zona de partida. **Só serão aceites sacos fechados.** Vestuário individual sem saco será rejeitado.

## 🛡️ Seguro

Todos os participantes inscritos estão cobertos por **seguro de acidentes pessoais** (Decreto Lei nº 10/2009).

**Em caso de acidente:** Comunicar em 3 dias para geral@xistarca.pt

## 🗺️ Percursos

- **Corrida 10km:** Brevemente disponível
- **Caminhada 5km:** Brevemente disponível

Os percursos decorrem no **Instituto Superior de Agronomia**, num ambiente natural e romântico, perfeito para celebrar o amor e a atividade física!

## 🏉 Evento Integrado

Esta corrida está **inserida no Junior 7s International Youth Rugby**, um torneio internacional de rugby jovem que decorre em simultâneo no ISA.

## 📋 Regulamento Importante

### Serão desclassificados concorrentes que:
- ❌ Não efetuem controlo de partida
- ❌ Não cumpram o percurso na totalidade
- ❌ Não levem o dorsal ao peito, bem visível
- ❌ Corram com dorsal/chip de outro concorrente
- ❌ Não respeitem instruções da organização
- ❌ **CASAIS:** Não cruzem a meta juntos

### Outras Informações:
- **Alterações:** Não aceites no dia do evento
- **Cancelamento:** Sem devolução do valor da inscrição
- **Classificações:** Disponíveis após a prova

## 💝 Espírito da Corrida

A Corrida dos Namorados celebra:
- 💕 **Amor e Cumplicidade**
- 🏃 **Atividade Física Partilhada**
- 🌳 **Contacto com a Natureza**
- 🤝 **União e Trabalho de Equipa**

Não importa o ritmo, o importante é compartilhar o prazer da corrida, envolvidos por uma atmosfera de romantismo e cumplicidade!

## 👥 Organização

**Organizador:** Xistarca

**Patrocinadores:** Água Vimeiro

**Local:** Instituto Superior de Agronomia (ISA), Lisboa

---

**Aceitação:** Ao inscreveres-te, aceitas automaticamente este regulamento e assumes a responsabilidade de participação, estando ciente do teu estado de saúde e sentindo-te fisicamente apto.

**Vem celebrar o amor através do desporto!** 💕🏃‍♀️🏃‍♂️`,
      city: "Lisboa",
      metaTitle: "11ª Corrida dos Namorados 2026 | ISA Lisboa",
      metaDescription:
        "11ª Corrida dos Namorados no ISA Lisboa. Corrida 10km para casais (obrigatório cruzar meta juntos) e solteiros, caminhada 5km. Ambiente romântico em plena natureza. 15 Fevereiro 2026.",
    },
    {
      language: "en",
      title: "11th Valentine's Race",
      description: `# 💕 11th Valentine's Race 2026

Welcome to the **11th edition of the Valentine's Race**! A 10km course at Instituto Superior de Agronomia, **united in one goal... crossing the finish line together!**

The pace doesn't matter, what matters is sharing the pleasure of physical activity in a natural environment, wrapped in an atmosphere of romance and complicity.

## 📅 Date and Location

**Date:** February 15, 2026 (Sunday)  
**Location:** Instituto Superior de Agronomia (ISA), Lisbon  
**Environment:** Course in full nature, romantic atmosphere

## 🏃‍♀️🏃‍♂️ Available Races

### 10km Race - Couples
- **Start Time:**
  - **10:00:** Singles + 1st couple member
  - **10:05:** 2nd couple member
- **Age:** 18+ years
- **SPECIAL RULE:** Must cross the finish line **together**!
- **Classification:** By couple's arrival order (both together)

### 10km Race - Singles
- **Time:** 10:00
- **Age:** 18+ years
- **Classification:** Overall male and female

### 5km Walk
- **Time:** 10:05
- **Age:** All ages
- **Course:** ISA natural environment

## 💑 Couples Race - How It Works

The Valentine's Race has a unique aspect: **the couples race!**

### Rules for Couples:
1. **Staggered Starts:**
   - 1st couple member starts at **10:00**
   - 2nd couple member starts at **10:05** (5 minutes later)
2. **Joint Finish:** It is **MANDATORY** to cross the finish line **together**
3. **Classification:** By couple's arrival order (not individual)
4. **Spirit:** Romance, complicity and shared effort

The pace doesn't matter, what matters is arriving together! 💕

## 📝 Registration

**Deadline:** Until February 15 at 09:30  

**Available Extras:**
- 👕 Ultradry technical shirt: €5.00
- 📋 Race day bib pickup: €3.00 (if bought online) / €3.50 (on-site)

Register at: [xistarca.pt](https://xistarca.pt/corrida-namorados-2026)

## 🎁 Participation Kit

All participants receive:
- 🎽 **Race Bib** (with chip for 10km Race)
- 🎁 **Sponsor Gifts**

**IMPORTANT:** The chip on the bib CANNOT be folded!

## 📦 Kit Pickup

### Xistarca Facilities:
- **February 12 (Thursday):** 10:00 - 18:30
- **February 13 (Friday):** 10:00 - 20:00

### On race day:
- **February 15 (Sunday):** 08:30 - 09:30, at start location
- **Cost:** €3.00 (if bought online) / €3.50 (without prior purchase)

**Required documents:**
- ID Card, Passport, Driver's License or other with photo
- Bib number (received by email)

💚 **Bring a reusable bag** for your kit. Protect the environment!

## 🏆 Prizes

### 10km Race - Couples:
- 🥇 **Trophies** for top 3 in each age category
- **Classification:** By couple's arrival order (must arrive together)

### 10km Race - Singles:
- 🥇 **Trophies** for top 3 overall male and female

**Pickup deadline:** Up to 30 days after event at Xistarca facilities

## 👥 Categories for Couples Race

Classification is based on **sum of both members' ages**:

- **Category 1:** Up to 75 years (total)
- **Category 2:** Between 76 and 99 years (total)
- **Category 3:** Over 100 years (total)

**Example:** If you're 30 and your partner is 28, you're in Category 1 (30+28=58 years).

## 💧 Aid Stations

- **10km:** Vimeiro Water at 5km and finish
- **5km:** Vimeiro Water at finish

## 🎒 Bag Drop

Available at start area. **Only closed bags accepted.** Individual clothing without bag will be rejected.

## 🛡️ Insurance

All registered participants are covered by **personal accident insurance** (Decree Law nº 10/2009).

**In case of accident:** Report within 3 days to geral@xistarca.pt

## 🗺️ Courses

- **10km Race:** Available soon
- **5km Walk:** Available soon

The courses take place at **Instituto Superior de Agronomia**, in a natural and romantic environment, perfect for celebrating love and physical activity!

## 🏉 Integrated Event

This race is **part of the Junior 7s International Youth Rugby**, an international youth rugby tournament taking place simultaneously at ISA.

## 📋 Important Rules

### Participants will be disqualified if they:
- ❌ Don't complete start control
- ❌ Don't complete the entire course
- ❌ Don't wear bib on chest, clearly visible
- ❌ Run with another runner's bib/chip
- ❌ Don't respect organization instructions
- ❌ **COUPLES:** Don't cross finish line together

### Other Information:
- **Changes:** Not accepted on race day
- **Cancellation:** No refund of registration fee
- **Results:** Available after race

## 💝 Race Spirit

The Valentine's Race celebrates:
- 💕 **Love and Complicity**
- 🏃 **Shared Physical Activity**
- 🌳 **Contact with Nature**
- 🤝 **Unity and Teamwork**

The pace doesn't matter, what matters is sharing the pleasure of running, wrapped in an atmosphere of romance and complicity!

## 👥 Organization

**Organizer:** Xistarca

**Sponsors:** Água Vimeiro

**Location:** Instituto Superior de Agronomia (ISA), Lisbon

---

**Acceptance:** By registering, you automatically accept these rules and assume participation responsibility, being aware of your health status and feeling physically fit.

**Come celebrate love through sport!** 💕🏃‍♀️🏃‍♂️`,
      city: "Lisbon",
      metaTitle: "11th Valentine's Race 2026 | ISA Lisbon",
      metaDescription:
        "11th Valentine's Race at ISA Lisbon. 10km race for couples (must cross finish together) and singles, 5km walk. Romantic atmosphere in nature. February 15, 2026.",
    },
    {
      language: "es",
      title: "11ª Carrera de San Valentín",
      description: `# 💕 11ª Carrera de San Valentín 2026

¡Bienvenidos a la **11ª edición de la Carrera de San Valentín**! Un recorrido de 10km en el Instituto Superior de Agronomia, **unidos en un solo objetivo... cruzar la meta juntos!**

No importa el ritmo, lo importante es compartir el placer de la actividad física, en un ambiente natural y envueltos por una atmósfera de romanticismo y complicidad.

## 📅 Fecha y Ubicación

**Fecha:** 15 de febrero de 2026 (domingo)  
**Ubicación:** Instituto Superior de Agronomia (ISA), Lisboa  
**Ambiente:** Recorrido en plena naturaleza, atmósfera romántica

## 🏃‍♀️🏃‍♂️ Carreras Disponibles

### Carrera 10km - Parejas
- **Horario Salida:**
  - **10:00:** Solteros + 1er elemento de la pareja
  - **10:05:** 2º elemento de la pareja
- **Edad:** +18 años
- **REGLA ESPECIAL:** ¡Obligatorio cruzar la meta **juntos**!

### Carrera 10km - Solteros
- **Horario:** 10:00
- **Edad:** +18 años

### Caminata 5km
- **Horario:** 10:05
- **Edad:** Todas las edades

## 💑 Carrera de Parejas - Cómo Funciona

Reglas para Parejas:
1. Salidas escalonadas (5 minutos de diferencia)
2. **OBLIGATORIO** cruzar la meta **juntos**
3. Clasificación por orden de llegada de la pareja

¡El ritmo no importa, lo importante es llegar juntos! 💕

## 📝 Inscripciones

**Plazo:** Hasta el 15 de febrero a las 09:30  

Inscríbete en: [xistarca.pt](https://xistarca.pt/corrida-namorados-2026)

## 🏆 Premios

### Carrera 10km - Parejas:
- 🥇 **Trofeos** para los 3 primeros de cada categoría

### Carrera 10km - Solteros:
- 🥇 **Trofeos** para los 3 primeros masculinos y femeninos

## 👥 Categorías para Parejas

Clasificación por **suma de edades de ambos**:
- **Categoría 1:** Hasta 75 años (total)
- **Categoría 2:** Entre 76 y 99 años (total)
- **Categoría 3:** Más de 100 años (total)

## 👥 Organización

**Organizador:** Xistarca

¡Ven a celebrar el amor a través del deporte! 💕🏃‍♀️🏃‍♂️`,
      city: "Lisboa",
      metaTitle: "11ª Carrera de San Valentín 2026 | ISA Lisboa",
      metaDescription:
        "11ª Carrera de San Valentín en ISA Lisboa. Carrera 10km para parejas (obligatorio cruzar meta juntos) y solteros, caminata 5km. Ambiente romántico. 15 febrero 2026.",
    },
    {
      language: "fr",
      title: "11ème Course des Amoureux",
      description: `# 💕 11ème Course des Amoureux 2026

Bienvenue à la **11ème édition de la Course des Amoureux** ! Un parcours de 10km à l'Instituto Superior de Agronomia, **unis dans un seul objectif... franchir la ligne d'arrivée ensemble !**

Le rythme n'a pas d'importance, l'important est de partager le plaisir de l'activité physique, dans un environnement naturel et enveloppé par une atmosphère de romantisme et de complicité.

## 📅 Date et Lieu

**Date :** 15 février 2026 (dimanche)  
**Lieu :** Instituto Superior de Agronomia (ISA), Lisbonne  
**Environnement :** Parcours en pleine nature, atmosphère romantique

## 🏃‍♀️🏃‍♂️ Courses Disponibles

### Course 10km - Couples
- **Horaire Départ :**
  - **10h00 :** Célibataires + 1er membre du couple
  - **10h05 :** 2ème membre du couple
- **Âge :** +18 ans
- **RÈGLE SPÉCIALE :** Obligatoire de franchir la ligne d'arrivée **ensemble** !

### Course 10km - Célibataires
- **Horaire :** 10h00
- **Âge :** +18 ans

### Marche 5km
- **Horaire :** 10h05
- **Âge :** Tous les âges

## 💑 Course en Couple - Comment ça Marche

Règles pour les Couples :
1. Départs échelonnés (5 minutes d'écart)
2. **OBLIGATOIRE** de franchir la ligne d'arrivée **ensemble**
3. Classement par ordre d'arrivée du couple

Le rythme n'a pas d'importance, l'important est d'arriver ensemble ! 💕

## 📝 Inscriptions

**Date limite :** Jusqu'au 15 février à 09h30  

Inscrivez-vous sur : [xistarca.pt](https://xistarca.pt/corrida-namorados-2026)

## 🏆 Prix

### Course 10km - Couples :
- 🥇 **Trophées** pour les 3 premiers de chaque catégorie

### Course 10km - Célibataires :
- 🥇 **Trophées** pour les 3 premiers masculins et féminins

## 👥 Catégories pour Couples

Classement par **somme des âges des deux** :
- **Catégorie 1 :** Jusqu'à 75 ans (total)
- **Catégorie 2 :** Entre 76 et 99 ans (total)
- **Catégorie 3 :** Plus de 100 ans (total)

## 👥 Organisation

**Organisateur :** Xistarca

Venez célébrer l'amour à travers le sport ! 💕🏃‍♀️🏃‍♂️`,
      city: "Lisbonne",
      metaTitle: "11ème Course des Amoureux 2026 | ISA Lisbonne",
      metaDescription:
        "11ème Course des Amoureux à ISA Lisbonne. Course 10km pour couples (obligatoire franchir ligne ensemble) et célibataires, marche 5km. Atmosphère romantique. 15 février 2026.",
    },
    {
      language: "de",
      title: "11. Valentinslauf",
      description: `# 💕 11. Valentinslauf 2026

Willkommen zur **11. Ausgabe des Valentinslaufs**! Eine 10km-Strecke am Instituto Superior de Agronomia, **vereint in einem Ziel... gemeinsam die Ziellinie überqueren!**

Das Tempo spielt keine Rolle, wichtig ist es, die Freude an der körperlichen Aktivität zu teilen, in einer natürlichen Umgebung und umgeben von einer Atmosphäre der Romantik und Verbundenheit.

## 📅 Datum und Ort

**Datum:** 15. Februar 2026 (Sonntag)  
**Ort:** Instituto Superior de Agronomia (ISA), Lissabon  
**Umgebung:** Strecke in voller Natur, romantische Atmosphäre

## 🏃‍♀️🏃‍♂️ Verfügbare Rennen

### 10km Lauf - Paare
- **Startzeit:**
  - **10:00:** Singles + 1. Paar-Mitglied
  - **10:05:** 2. Paar-Mitglied
- **Alter:** 18+ Jahre
- **SPEZIELLE REGEL:** Pflicht, die Ziellinie **zusammen** zu überqueren!

### 10km Lauf - Singles
- **Zeit:** 10:00
- **Alter:** 18+ Jahre

### 5km Wanderung
- **Zeit:** 10:05
- **Alter:** Alle Altersgruppen

## 💑 Paarlauf - Wie es Funktioniert

Regeln für Paare:
1. Gestaffelte Starts (5 Minuten Unterschied)
2. **PFLICHT**, die Ziellinie **zusammen** zu überqueren
3. Wertung nach Ankunftsreihenfolge des Paares

Das Tempo spielt keine Rolle, wichtig ist gemeinsam anzukommen! 💕

## 📝 Anmeldung

**Frist:** Bis 15. Februar um 09:30  

Anmeldung unter: [xistarca.pt](https://xistarca.pt/corrida-namorados-2026)

## 🏆 Preise

### 10km Lauf - Paare:
- 🥇 **Trophäen** für die Top 3 jeder Kategorie

### 10km Lauf - Singles:
- 🥇 **Trophäen** für die Top 3 männlich und weiblich

## 👥 Kategorien für Paare

Wertung nach **Summe der Alter beider**:
- **Kategorie 1:** Bis 75 Jahre (gesamt)
- **Kategorie 2:** Zwischen 76 und 99 Jahre (gesamt)
- **Kategorie 3:** Über 100 Jahre (gesamt)

## 👥 Organisation

**Veranstalter:** Xistarca

Komm und feiere die Liebe durch Sport! 💕🏃‍♀️🏃‍♂️`,
      city: "Lissabon",
      metaTitle: "11. Valentinslauf 2026 | ISA Lissabon",
      metaDescription:
        "11. Valentinslauf am ISA Lissabon. 10km Lauf für Paare (Pflicht zusammen Ziel überqueren) und Singles, 5km Wanderung. Romantische Atmosphäre. 15. Februar 2026.",
    },
    {
      language: "it",
      title: "11ª Corsa degli Innamorati",
      description: `# 💕 11ª Corsa degli Innamorati 2026

Benvenuti alla **11ª edizione della Corsa degli Innamorati**! Un percorso di 10km all'Instituto Superior de Agronomia, **uniti in un solo obiettivo... tagliare il traguardo insieme!**

Il ritmo non importa, l'importante è condividere il piacere dell'attività fisica, in un ambiente naturale e avvolti da un'atmosfera di romanticismo e complicità.

## 📅 Data e Luogo

**Data:** 15 febbraio 2026 (domenica)  
**Luogo:** Instituto Superior de Agronomia (ISA), Lisbona  
**Ambiente:** Percorso in piena natura, atmosfera romantica

## 🏃‍♀️🏃‍♂️ Gare Disponibili

### Corsa 10km - Coppie
- **Orario Partenza:**
  - **10:00:** Single + 1° membro della coppia
  - **10:05:** 2° membro della coppia
- **Età:** +18 anni
- **REGOLA SPECIALE:** Obbligatorio tagliare il traguardo **insieme**!

### Corsa 10km - Single
- **Orario:** 10:00
- **Età:** +18 anni

### Camminata 5km
- **Orario:** 10:05
- **Età:** Tutte le età

## 💑 Corsa in Coppia - Come Funziona

Regole per le Coppie:
1. Partenze scaglionate (5 minuti di differenza)
2. **OBBLIGATORIO** tagliare il traguardo **insieme**
3. Classifica per ordine di arrivo della coppia

Il ritmo non importa, l'importante è arrivare insieme! 💕

## 📝 Iscrizioni

**Scadenza:** Fino al 15 febbraio alle 09:30  

Iscriviti su: [xistarca.pt](https://xistarca.pt/corrida-namorados-2026)

## 🏆 Premi

### Corsa 10km - Coppie:
- 🥇 **Trofei** per i primi 3 di ogni categoria

### Corsa 10km - Single:
- 🥇 **Trofei** per i primi 3 maschili e femminili

## 👥 Categorie per Coppie

Classifica per **somma delle età di entrambi**:
- **Categoria 1:** Fino a 75 anni (totale)
- **Categoria 2:** Tra 76 e 99 anni (totale)
- **Categoria 3:** Oltre 100 anni (totale)

## 👥 Organizzazione

**Organizzatore:** Xistarca

Vieni a celebrare l'amore attraverso lo sport! 💕🏃‍♀️🏃‍♂️`,
      city: "Lisbona",
      metaTitle: "11ª Corsa degli Innamorati 2026 | ISA Lisbona",
      metaDescription:
        "11ª Corsa degli Innamorati all'ISA Lisbona. Corsa 10km per coppie (obbligatorio tagliare traguardo insieme) e single, camminata 5km. Atmosfera romantica. 15 febbraio 2026.",
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

  // Step 3: Find or create variants
  const variants = [
    {
      name: "Corrida 10km - Solteiros",
      distanceKm: 10,
      price: 0.0,
      startTime: "10:00",
    },
    {
      name: "Corrida 10km - Casais (1º elemento)",
      distanceKm: 10,
      price: 0.0,
      startTime: "10:00",
    },
    {
      name: "Corrida 10km - Casais (2º elemento)",
      distanceKm: 10,
      price: 0.0,
      startTime: "10:05",
    },
    {
      name: "Caminhada 5km",
      distanceKm: 5,
      price: 0.0,
      startTime: "10:05",
    },
  ];

  for (const variantData of variants) {
    const existing = await prisma.eventVariant.findFirst({
      where: {
        eventId: event.id,
        name: variantData.name,
      },
    });

    let variant;
    if (existing) {
      variant = await prisma.eventVariant.update({
        where: { id: existing.id },
        data: {
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    } else {
      variant = await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name: variantData.name,
          distanceKm: variantData.distanceKm,
          price: variantData.price,
          startTime: variantData.startTime,
        },
      });
    }

    console.log(
      `✅ Variant ${existing ? "updated" : "created"}: ${variant.name}`
    );
  }

  console.log("");
  console.log("🎉 11ª Corrida dos Namorados 2026 seeded successfully!");
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
