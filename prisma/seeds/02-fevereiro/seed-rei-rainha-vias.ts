import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("👑 Seeding Rei & Rainha das Vias...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "rei-rainha-das-vias-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "Rei & Rainha das Vias",
      slug: "rei-rainha-das-vias-2026",
      sportTypes: [SportType.OCR],
      startDate: new Date("2026-02-07T10:00:00.000Z"),
      endDate: new Date("2026-02-07T14:00:00.000Z"),
      registrationDeadline: new Date("2026-02-03T23:59:59.000Z"),
      city: "Corroios",
      country: "Portugal",
      latitude: 38.644751,
      longitude: -9.158946,
      googleMapsUrl: "https://maps.app.goo.gl/FkfPm5PfXJRsnTK96",
      externalUrl:
        "https://docs.google.com/forms/d/e/1FAIpQLSe_form_url/viewform",
      isFeatured: false,
      description: `# 👑 Rei & Rainha das Vias 👑
💪 Desafio de Suspensão OCR

🔥 Prova **100% focada em vias de suspensão**, onde força, resistência e técnica vão ser levadas ao limite.

**📅 Data:** 7 de fevereiro de 2026
**🕗 Hora:** 10:00
**📍 Local:** DO Fitness Studio, Corroios

## 🏃‍♂️ Quem Pode Participar?

✔️ Atletas masculinos e femininos
✔️ Idade mínima: **15 anos**
✔️ Categorias: **Masculina** e **Feminina**

## ⚔️ Formato da Competição

▪️ **Prova individual**
▪️ Vias com **dificuldade progressiva**
▪️ **2 tentativas por via**
▪️ Ganha quem for **mais longe** e ficar **por último em prova**

👑 **Será coroado 1 Rei e 1 Rainha das Vias**

## 📝 Inscrições

**📆 Período:** 13 de janeiro a 3 de fevereiro
**👥 Participantes:** Mínimo 20 atletas | Máximo 50 atletas
**💳 Pagamento:** MB Way para 919 717 100

⚠️ **Importante:** Caso não se inscrevam o mínimo de 20 atletas, será ressarcido o valor da inscrição aos atletas inscritos.

## 💰 Valores por Fases

### Sócios DO Fitness Studio
**GRATUITO** 🎉

### 1.ª Fase – até 18 de janeiro
▪️ **12,50 €** – Atletas federados FPOCR
▪️ **15,00 €** – Atletas não federados

### 2.ª Fase – de 19 a 27 de janeiro
▪️ **15,00 €** – Atletas federados FPOCR
▪️ **20,00 €** – Atletas não federados

### 3.ª Fase – de 28 de janeiro a 3 de fevereiro
▪️ **17,50 €** – Atletas federados FPOCR
▪️ **25,00 €** – Atletas não federados

## 🏆 Prémios

Será atribuído um prémio ao vencedor de cada categoria:
- **Categoria Masculina** 👑
- **Categoria Feminina** 👑

## 📋 Termo de Responsabilidade

A participação na competição só será permitida aos atletas que **assinarem o termo de responsabilidade**, declarando-se aptos física e mentalmente para a prática da atividade.

## ⚖️ Regras Gerais

✅ Todos os atletas devem respeitar as normas de segurança e as instruções da organização e dos juízes
✅ As decisões da organização e da arbitragem são **finais e incontestáveis**
✅ Qualquer situação omissa neste regulamento será resolvida pela organização

---

**Organização:** DO Fitness Studio
**Parceiro:** @fpocr_portugal`,
      variants: {
        create: [
          {
            name: "Categoria Masculina",
            description: "Competição individual masculina de suspensão OCR",
            maxParticipants: 25,
            pricingPhases: {
              create: [
                {
                  name: "Sócios DO Fitness Studio",
                  price: 0,

                  startDate: new Date("2026-01-13T00:00:00.000Z"),
                  endDate: new Date("2026-02-03T23:59:59.000Z"),
                },
                {
                  name: "1.ª Fase - Federados FPOCR",
                  price: 12.5,

                  startDate: new Date("2026-01-13T00:00:00.000Z"),
                  endDate: new Date("2026-01-18T23:59:59.000Z"),
                },
                {
                  name: "1.ª Fase - Não Federados",
                  price: 15,

                  startDate: new Date("2026-01-13T00:00:00.000Z"),
                  endDate: new Date("2026-01-18T23:59:59.000Z"),
                },
                {
                  name: "2.ª Fase - Federados FPOCR",
                  price: 15,

                  startDate: new Date("2026-01-19T00:00:00.000Z"),
                  endDate: new Date("2026-01-27T23:59:59.000Z"),
                },
                {
                  name: "2.ª Fase - Não Federados",
                  price: 20,
                  startDate: new Date("2026-01-19T00:00:00.000Z"),
                  endDate: new Date("2026-01-27T23:59:59.000Z"),
                },
                {
                  name: "3.ª Fase - Federados FPOCR",
                  price: 17.5,
                  startDate: new Date("2026-01-28T00:00:00.000Z"),
                  endDate: new Date("2026-02-03T23:59:59.000Z"),
                },
                {
                  name: "3.ª Fase - Não Federados",
                  price: 25,
                  startDate: new Date("2026-01-28T00:00:00.000Z"),
                  endDate: new Date("2026-02-03T23:59:59.000Z"),
                },
              ],
            },
          },
          {
            name: "Categoria Feminina",
            description: "Competição individual feminina de suspensão OCR",
            maxParticipants: 25,
            pricingPhases: {
              create: [
                {
                  name: "Sócios DO Fitness Studio",
                  price: 0,
                  startDate: new Date("2026-01-13T00:00:00.000Z"),
                  endDate: new Date("2026-02-03T23:59:59.000Z"),
                },
                {
                  name: "1.ª Fase - Federados FPOCR",
                  price: 12.5,
                  startDate: new Date("2026-01-13T00:00:00.000Z"),
                  endDate: new Date("2026-01-18T23:59:59.000Z"),
                },
                {
                  name: "1.ª Fase - Não Federados",
                  price: 15,
                  startDate: new Date("2026-01-13T00:00:00.000Z"),
                  endDate: new Date("2026-01-18T23:59:59.000Z"),
                },
                {
                  name: "2.ª Fase - Federados FPOCR",
                  price: 15,
                  startDate: new Date("2026-01-19T00:00:00.000Z"),
                  endDate: new Date("2026-01-27T23:59:59.000Z"),
                },
                {
                  name: "2.ª Fase - Não Federados",
                  price: 20,
                  startDate: new Date("2026-01-19T00:00:00.000Z"),
                  endDate: new Date("2026-01-27T23:59:59.000Z"),
                },
                {
                  name: "3.ª Fase - Federados FPOCR",
                  price: 17.5,
                  startDate: new Date("2026-01-28T00:00:00.000Z"),
                  endDate: new Date("2026-02-03T23:59:59.000Z"),
                },
                {
                  name: "3.ª Fase - Não Federados",
                  price: 25,
                  startDate: new Date("2026-01-28T00:00:00.000Z"),
                  endDate: new Date("2026-02-03T23:59:59.000Z"),
                },
              ],
            },
          },
        ],
      },
      translations: {
        create: [
          {
            language: "pt",
            title: "Rei & Rainha das Vias",
            description: `# 👑 Rei & Rainha das Vias 👑
💪 Desafio de Suspensão OCR

🔥 Prova **100% focada em vias de suspensão**, onde força, resistência e técnica vão ser levadas ao limite.

**📅 Data:** 7 de fevereiro de 2026
**🕗 Hora:** 10:00
**📍 Local:** DO Fitness Studio, Corroios

## 🏃‍♂️ Quem Pode Participar?

✔️ Atletas masculinos e femininos
✔️ Idade mínima: **15 anos**
✔️ Categorias: **Masculina** e **Feminina**

## ⚔️ Formato da Competição

▪️ **Prova individual**
▪️ Vias com **dificuldade progressiva**
▪️ **2 tentativas por via**
▪️ Ganha quem for **mais longe** e ficar **por último em prova**

👑 **Será coroado 1 Rei e 1 Rainha das Vias**

## 📝 Inscrições

**📆 Período:** 13 de janeiro a 3 de fevereiro
**👥 Participantes:** Mínimo 20 atletas | Máximo 50 atletas
**💳 Pagamento:** MB Way para 919 717 100

⚠️ **Importante:** Caso não se inscrevam o mínimo de 20 atletas, será ressarcido o valor da inscrição aos atletas inscritos.

## 💰 Valores por Fases

### Sócios DO Fitness Studio
**GRATUITO** 🎉

### 1.ª Fase – até 18 de janeiro
▪️ **12,50 €** – Atletas federados FPOCR
▪️ **15,00 €** – Atletas não federados

### 2.ª Fase – de 19 a 27 de janeiro
▪️ **15,00 €** – Atletas federados FPOCR
▪️ **20,00 €** – Atletas não federados

### 3.ª Fase – de 28 de janeiro a 3 de fevereiro
▪️ **17,50 €** – Atletas federados FPOCR
▪️ **25,00 €** – Atletas não federados

## 🏆 Prémios

Será atribuído um prémio ao vencedor de cada categoria:
- **Categoria Masculina** 👑
- **Categoria Feminina** 👑

## 📋 Termo de Responsabilidade

A participação na competição só será permitida aos atletas que **assinarem o termo de responsabilidade**, declarando-se aptos física e mentalmente para a prática da atividade.

## ⚖️ Regras Gerais

✅ Todos os atletas devem respeitar as normas de segurança e as instruções da organização e dos juízes
✅ As decisões da organização e da arbitragem são **finais e incontestáveis**
✅ Qualquer situação omissa neste regulamento será resolvida pela organização

---

**Organização:** DO Fitness Studio
**Parceiro:** @fpocr_portugal`,
          },
          {
            language: "en",
            title: "King & Queen of the Tracks",
            description: `# 👑 King & Queen of the Tracks 👑
💪 OCR Suspension Challenge

🔥 A race **100% focused on suspension obstacles**, where strength, endurance, and technique will be pushed to the limit.

**📅 Date:** February 7, 2026
**🕗 Time:** 10:00 AM
**📍 Location:** DO Fitness Studio, Corroios

## 🏃‍♂️ Who Can Participate?

✔️ Male and female athletes
✔️ Minimum age: **15 years**
✔️ Categories: **Male** and **Female**

## ⚔️ Competition Format

▪️ **Individual race**
▪️ Tracks with **progressive difficulty**
▪️ **2 attempts per track**
▪️ Winner goes the **furthest** and is the **last one standing**

👑 **1 King and 1 Queen will be crowned**

## 📝 Registration

**📆 Period:** January 13 to February 3
**👥 Participants:** Minimum 20 athletes | Maximum 50 athletes
**💳 Payment:** MB Way to 919 717 100

⚠️ **Important:** If the minimum of 20 athletes is not reached, registration fees will be refunded.

## 💰 Pricing Phases

### DO Fitness Studio Members
**FREE** 🎉

### 1st Phase – until January 18
▪️ **€12.50** – FPOCR federated athletes
▪️ **€15.00** – Non-federated athletes

### 2nd Phase – January 19 to 27
▪️ **€15.00** – FPOCR federated athletes
▪️ **€20.00** – Non-federated athletes

### 3rd Phase – January 28 to February 3
▪️ **€17.50** – FPOCR federated athletes
▪️ **€25.00** – Non-federated athletes

## 🏆 Prizes

A prize will be awarded to the winner of each category:
- **Male Category** 👑
- **Female Category** 👑

## 📋 Liability Waiver

Participation in the competition is only allowed for athletes who **sign the liability waiver**, declaring themselves physically and mentally fit for the activity.

## ⚖️ General Rules

✅ All athletes must respect safety standards and follow instructions from organizers and judges
✅ Decisions by organizers and judges are **final and indisputable**
✅ Any situation not covered in these rules will be resolved by the organization

---

**Organized by:** DO Fitness Studio
**Partner:** @fpocr_portugal`,
          },
          {
            language: "es",
            title: "Rey y Reina de las Vías",
            description: `# 👑 Rey y Reina de las Vías 👑
💪 Desafío de Suspensión OCR

🔥 Prueba **100% enfocada en vías de suspensión**, donde la fuerza, resistencia y técnica serán llevadas al límite.

**📅 Fecha:** 7 de febrero de 2026
**🕗 Hora:** 10:00
**📍 Lugar:** DO Fitness Studio, Corroios

## 🏃‍♂️ ¿Quién Puede Participar?

✔️ Atletas masculinos y femeninos
✔️ Edad mínima: **15 años**
✔️ Categorías: **Masculina** y **Femenina**

## ⚔️ Formato de la Competición

▪️ **Prueba individual**
▪️ Vías con **dificultad progresiva**
▪️ **2 intentos por vía**
▪️ Gana quien llegue **más lejos** y quede **último en competición**

👑 **Se coronará 1 Rey y 1 Reina de las Vías**

## 📝 Inscripciones

**📆 Período:** 13 de enero al 3 de febrero
**👥 Participantes:** Mínimo 20 atletas | Máximo 50 atletas
**💳 Pago:** MB Way al 919 717 100

⚠️ **Importante:** Si no se inscriben el mínimo de 20 atletas, se reembolsará el valor de la inscripción.

## 💰 Valores por Fases

### Socios DO Fitness Studio
**GRATUITO** 🎉

### 1.ª Fase – hasta el 18 de enero
▪️ **12,50 €** – Atletas federados FPOCR
▪️ **15,00 €** – Atletas no federados

### 2.ª Fase – del 19 al 27 de enero
▪️ **15,00 €** – Atletas federados FPOCR
▪️ **20,00 €** – Atletas no federados

### 3.ª Fase – del 28 de enero al 3 de febrero
▪️ **17,50 €** – Atletas federados FPOCR
▪️ **25,00 €** – Atletas no federados

## 🏆 Premios

Se otorgará un premio al ganador de cada categoría:
- **Categoría Masculina** 👑
- **Categoría Femenina** 👑

## 📋 Término de Responsabilidad

La participación solo se permitirá a atletas que **firmen el término de responsabilidad**, declarándose aptos física y mentalmente para la práctica de la actividad.

## ⚖️ Reglas Generales

✅ Todos los atletas deben respetar las normas de seguridad y las instrucciones de la organización y jueces
✅ Las decisiones de la organización y arbitraje son **finales e indiscutibles**
✅ Cualquier situación omitida en este reglamento será resuelta por la organización

---

**Organización:** DO Fitness Studio
**Socio:** @fpocr_portugal`,
          },
          {
            language: "fr",
            title: "Roi et Reine des Voies",
            description: `# 👑 Roi et Reine des Voies 👑
💪 Défi de Suspension OCR

🔥 Épreuve **100% axée sur les voies de suspension**, où la force, l'endurance et la technique seront poussées à la limite.

**📅 Date:** 7 février 2026
**🕗 Heure:** 10h00
**📍 Lieu:** DO Fitness Studio, Corroios

## 🏃‍♂️ Qui Peut Participer?

✔️ Athlètes masculins et féminins
✔️ Âge minimum: **15 ans**
✔️ Catégories: **Masculine** et **Féminine**

## ⚔️ Format de la Compétition

▪️ **Épreuve individuelle**
▪️ Voies avec **difficulté progressive**
▪️ **2 tentatives par voie**
▪️ Gagne celui qui va **le plus loin** et reste **dernier en épreuve**

👑 **1 Roi et 1 Reine seront couronnés**

## 📝 Inscriptions

**📆 Période:** 13 janvier au 3 février
**👥 Participants:** Minimum 20 athlètes | Maximum 50 athlètes
**💳 Paiement:** MB Way au 919 717 100

⚠️ **Important:** Si le minimum de 20 athlètes n'est pas atteint, les frais d'inscription seront remboursés.

## 💰 Tarifs par Phases

### Membres DO Fitness Studio
**GRATUIT** 🎉

### 1ère Phase – jusqu'au 18 janvier
▪️ **12,50 €** – Athlètes fédérés FPOCR
▪️ **15,00 €** – Athlètes non fédérés

### 2ème Phase – du 19 au 27 janvier
▪️ **15,00 €** – Athlètes fédérés FPOCR
▪️ **20,00 €** – Athlètes non fédérés

### 3ème Phase – du 28 janvier au 3 février
▪️ **17,50 €** – Athlètes fédérés FPOCR
▪️ **25,00 €** – Athlètes non fédérés

## 🏆 Prix

Un prix sera attribué au vainqueur de chaque catégorie:
- **Catégorie Masculine** 👑
- **Catégorie Féminine** 👑

## 📋 Décharge de Responsabilité

La participation n'est autorisée qu'aux athlètes qui **signent la décharge de responsabilité**, se déclarant aptes physiquement et mentalement pour l'activité.

## ⚖️ Règles Générales

✅ Tous les athlètes doivent respecter les normes de sécurité et les instructions de l'organisation et des juges
✅ Les décisions de l'organisation et de l'arbitrage sont **finales et indiscutables**
✅ Toute situation non couverte par ce règlement sera résolue par l'organisation

---

**Organisation:** DO Fitness Studio
**Partenaire:** @fpocr_portugal`,
          },
          {
            language: "de",
            title: "König und Königin der Bahnen",
            description: `# 👑 König und Königin der Bahnen 👑
💪 OCR-Suspensionsherausforderung

🔥 Wettkampf **100% fokussiert auf Suspensionsbahnen**, bei dem Kraft, Ausdauer und Technik an die Grenze gebracht werden.

**📅 Datum:** 7. Februar 2026
**🕗 Uhrzeit:** 10:00 Uhr
**📍 Ort:** DO Fitness Studio, Corroios

## 🏃‍♂️ Wer Kann Teilnehmen?

✔️ Männliche und weibliche Athleten
✔️ Mindestalter: **15 Jahre**
✔️ Kategorien: **Männlich** und **Weiblich**

## ⚔️ Wettbewerbsformat

▪️ **Einzelwettkampf**
▪️ Bahnen mit **progressiver Schwierigkeit**
▪️ **2 Versuche pro Bahn**
▪️ Gewinner ist, wer **am weitesten** kommt und **als Letzter im Wettkampf** bleibt

👑 **1 König und 1 Königin werden gekrönt**

## 📝 Anmeldung

**📆 Zeitraum:** 13. Januar bis 3. Februar
**👥 Teilnehmer:** Mindestens 20 Athleten | Maximal 50 Athleten
**💳 Zahlung:** MB Way an 919 717 100

⚠️ **Wichtig:** Falls sich nicht mindestens 20 Athleten anmelden, wird die Anmeldegebühr erstattet.

## 💰 Preise nach Phasen

### DO Fitness Studio Mitglieder
**KOSTENLOS** 🎉

### 1. Phase – bis 18. Januar
▪️ **12,50 €** – FPOCR-Verbandsmitglieder
▪️ **15,00 €** – Nicht-Verbandsmitglieder

### 2. Phase – 19. bis 27. Januar
▪️ **15,00 €** – FPOCR-Verbandsmitglieder
▪️ **20,00 €** – Nicht-Verbandsmitglieder

### 3. Phase – 28. Januar bis 3. Februar
▪️ **17,50 €** – FPOCR-Verbandsmitglieder
▪️ **25,00 €** – Nicht-Verbandsmitglieder

## 🏆 Preise

Ein Preis wird dem Gewinner jeder Kategorie verliehen:
- **Männliche Kategorie** 👑
- **Weibliche Kategorie** 👑

## 📋 Haftungsausschluss

Die Teilnahme ist nur für Athleten erlaubt, die den **Haftungsausschluss unterzeichnen** und erklären, körperlich und geistig für die Aktivität geeignet zu sein.

## ⚖️ Allgemeine Regeln

✅ Alle Athleten müssen Sicherheitsnormen respektieren und Anweisungen von Organisatoren und Schiedsrichtern befolgen
✅ Entscheidungen von Organisatoren und Schiedsrichtern sind **endgültig und unanfechtbar**
✅ Jede in diesem Reglement nicht abgedeckte Situation wird von der Organisation gelöst

---

**Organisation:** DO Fitness Studio
**Partner:** @fpocr_portugal`,
          },
          {
            language: "it",
            title: "Re e Regina delle Vie",
            description: `# 👑 Re e Regina delle Vie 👑
💪 Sfida di Sospensione OCR

🔥 Prova **100% focalizzata su vie di sospensione**, dove forza, resistenza e tecnica saranno spinte al limite.

**📅 Data:** 7 febbraio 2026
**🕗 Ora:** 10:00
**📍 Luogo:** DO Fitness Studio, Corroios

## 🏃‍♂️ Chi Può Partecipare?

✔️ Atleti maschili e femminili
✔️ Età minima: **15 anni**
✔️ Categorie: **Maschile** e **Femminile**

## ⚔️ Formato della Competizione

▪️ **Prova individuale**
▪️ Vie con **difficoltà progressiva**
▪️ **2 tentativi per via**
▪️ Vince chi va **più lontano** e rimane **ultimo in gara**

👑 **Saranno incoronati 1 Re e 1 Regina delle Vie**

## 📝 Iscrizioni

**📆 Periodo:** 13 gennaio al 3 febbraio
**👥 Partecipanti:** Minimo 20 atleti | Massimo 50 atleti
**💳 Pagamento:** MB Way al 919 717 100

⚠️ **Importante:** Se non si iscrivono almeno 20 atleti, sarà rimborsato il valore dell'iscrizione.

## 💰 Prezzi per Fasi

### Soci DO Fitness Studio
**GRATUITO** 🎉

### 1ª Fase – fino al 18 gennaio
▪️ **12,50 €** – Atleti tesserati FPOCR
▪️ **15,00 €** – Atleti non tesserati

### 2ª Fase – dal 19 al 27 gennaio
▪️ **15,00 €** – Atleti tesserati FPOCR
▪️ **20,00 €** – Atleti non tesserati

### 3ª Fase – dal 28 gennaio al 3 febbraio
▪️ **17,50 €** – Atleti tesserati FPOCR
▪️ **25,00 €** – Atleti non tesserati

## 🏆 Premi

Sarà assegnato un premio al vincitore di ogni categoria:
- **Categoria Maschile** 👑
- **Categoria Femminile** 👑

## 📋 Liberatoria

La partecipazione è consentita solo agli atleti che **firmano la liberatoria**, dichiarandosi idonei fisicamente e mentalmente per l'attività.

## ⚖️ Regole Generali

✅ Tutti gli atleti devono rispettare le norme di sicurezza e le istruzioni dell'organizzazione e dei giudici
✅ Le decisioni dell'organizzazione e dell'arbitraggio sono **definitive e incontestabili**
✅ Qualsiasi situazione non prevista in questo regolamento sarà risolta dall'organizzazione

---

**Organizzazione:** DO Fitness Studio
**Partner:** @fpocr_portugal`,
          },
        ],
      },
    },
  });

  console.log(`   ✅ Created: ${event.title}`);
  console.log(`   📍 Location: ${event.city}, ${event.country}`);
  console.log(`   📅 Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
