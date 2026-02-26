import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedHyrunArganil2026() {
  console.log("🏋️ Seeding HYRUN II Edição - Arganil 2026...");

  // Base event data
  const eventSlug = "hyrun-arganil-2026";
  const eventStartDate = new Date("2026-03-14T09:00:00Z");
  const eventEndDate = new Date("2026-03-15T18:00:00Z");

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
      title: "HYRUN - II Edição | Arganil 2026",
      description: `**🏋️ HYRUN - II Edição | Arganil 2026**

Depois do sucesso da 1ª edição em 2025, o **HYRUN** regressa a **Arganil** nos dias **14 e 15 de março de 2026** com mais força! 🔥

O HYRUN é um **evento de resistência funcional** onde a corrida é intercalada com **estações funcionais**. O objetivo é promover um percurso contínuo, realizado contra o tempo, que desafie e desenvolva a resistência, a força, a capacidade de gestão de esforço e o trabalho em equipa.

---

## 🏃 Versões da Prova

### **HYRUN FULL**
O formato completo, com distâncias e cargas integrais.

### **HYRUN HALF**
O mesmo conceito e estrutura, mas com percursos de corrida de 400 metros entre estações e redução das cargas nos SLEDs.

---

## 📋 Categorias

Ambas as versões podem ser realizadas nos seguintes formatos de participação:

- **Individual Masculino**
- **Individual Feminino**
- **Duplas Masculinas**
- **Duplas Femininas**
- **Duplas Mistas**
- **Teams** (equipas de 4 atletas)

---

## 🔧 Estrutura da Prova

A prova é composta por **blocos de corrida** intercalados com **estações funcionais**, realizadas numa ordem fixa. **O relógio nunca para** e os atletas só podem avançar quando cada estação estiver totalmente concluída.

No **HYRUN HALF** a estrutura mantém-se, sendo apenas ajustadas as distâncias de corrida e a carga dos SLEDs.

---

## 👥 Formato Teams

Equipas de **4 atletas**, com obrigatoriedade de pelo menos **um elemento feminino**.
Competem sempre **2 atletas** de cada vez em formato de estafeta.

**Funcionamento:**
- Entram dois atletas
- Correm juntos
- Executam a estação funcional em conjunto
- Só podem trocar quando a estação estiver 100% concluída
- Saem os dois e entram os outros dois

---

## ⏱️ Horário & Heats

O evento decorre das **09h00 às 18h00**.
Cada heat terá entre **6 a 8 atletas/duplas**. As saídas são feitas de **15 em 15 minutos**.

Os atletas não precisam de estar no recinto às 09h00; devem apresentar-se **90 minutos** antes do seu heat para **check-in**, **30 minutos** antes para acesso à **Warm Up Zone** e **15 minutos** antes à **Call Room** (levantamento de chips).

---

## 🏅 Sequência Oficial

**8 km de corrida** intercalados com **8 estações**, pela ordem:

1. SkiErg
2. Sled Push
3. Sled Pull
4. Burpee Broad Jumps
5. Rowing
6. Farmers Carry
7. Sandbag Walking Lunges
8. Wall Balls
→ Meta

---

## ⏱️ Cronometragem Oficial

O HYRUN utiliza sistema de **cronometragem eletrónica por chip**.

Cada atleta terá:
- Tempo total oficial de prova
- Tempos parciais por estação
- Tempos oficiais de corrida

**Este sistema é a única cronometragem válida do evento.** Não serão aceites tempos manuais, relógios pessoais ou outros sistemas externos.

---

## 💪 Equipamento e Cargas Oficiais

### **FULL – Individuais e Duplas:**

| Exercício | Masculino | Feminino | Mistas |
|---|---|---|---|
| **Sled Push** | 152 kg | 102 kg | 152 kg |
| **Sled Pull** | 103 kg | 78 kg | 103 kg |
| **Farmer's Carry** | 2×24 kg | 2×16 kg | 2×24 kg |
| **Sandbag Lunges** | 20 kg | 10 kg | 20 kg |
| **Wall Balls** | 6 kg (3.0 m) | 4 kg (2.75 m) | 6 kg (3.0 m masc.) / (2.75 m fem.) |

### **HALF:**
- **Sled Push** e **Sled Pull** com metade da carga
- Todas as restantes estações mantêm os mesmos valores

### **TEAMS:**
- Utilizam as cargas do HALF

---

## 📏 Regras Principais

- Cumprir percurso, ordem das estações e standards dos movimentos
- Seguir sempre as indicações dos juízes e staff (incumprimento pode levar à desclassificação)
- **Duplas:** trabalho livre nas estações; com 1 chip, entrar juntos, manter até 2 m na corrida e cruzar a meta em simultâneo
- Estar na zona de prova 15 min antes do heat e usar apenas zonas marcadas
- Balneários disponíveis

---

## ⚠️ Penalizações

Podem ser aplicadas penalizações em caso de:
- Não cumprimento correto dos movimentos
- Saída fora do percurso
- Não respeito pelas zonas de transição
- Não cumprimento das distâncias de corrida
- Trocas ilegais no formato Teams

---

## 💰 Inscrições, Valores e Benefícios

### **HYRUN FULL:**
- Individual: **50€**
- Duplas: **45€** por atleta (90€ no total)
- Teams: **40€** por atleta (160€ no total)

### **HYRUN HALF:**
- Individual: **30€**
- Duplas: **30€** por atleta (60€ no total)
- Teams: **30€** por atleta (120€ no total)

💡 Os Atletas **CrossBoxAçor** recebem um desconto de **10€** no valor individual do atleta, em qualquer categoria.

### **Inclui:**
✅ Participação na prova
✅ Acesso a fotos e vídeos oficiais
✅ Lembrança de participação
✅ Acesso a todas as zonas: prova, warm up, merchandising, recuperação, zona kids e balneários

**Inscrição confirmada após pagamento. Vagas limitadas.**

---

## 📸 Direitos de Imagem

Ao inscrever-se, o atleta autoriza o uso da sua imagem em fotos e vídeos oficiais do evento.

---

## 📌 Casos Omissos

Situações não previstas serão decididas pela organização HYRUN.

---

## 🛡️ Segurança e Responsabilidade

Cada atleta participa sob sua própria responsabilidade. A organização não se responsabiliza por objetos perdidos, lesões por imprudência ou condições meteorológicas adversas.

---

## ✅ Aceitação do Regulamento

Ao efetuar a inscrição, todos os atletas declaram que conhecem e aceitam este regulamento, assumindo total responsabilidade pela sua participação.

---

🔥 **HYRUN - Resistência Funcional no seu melhor!** 🏋️`,
      city: "Arganil",
      metaTitle:
        "HYRUN II Edição 2026 | Arganil | 14-15 Março | Resistência Funcional",
      metaDescription:
        "HYRUN II Edição a 14-15 de março de 2026 em Arganil. Evento de resistência funcional com corrida e 8 estações. Versões Full e Half. Individual, Duplas e Teams.",
    },
    en: {
      title: "HYRUN - 2nd Edition | Arganil 2026",
      description: `**🏋️ HYRUN - 2nd Edition | Arganil 2026**

After the success of the 1st edition in 2025, **HYRUN** returns to **Arganil** on **March 14-15, 2026** with even more fire! 🔥

HYRUN is a **functional endurance event** where running is combined with **functional stations**. The goal is to deliver a continuous course, raced against the clock, that challenges and develops endurance, strength, effort management, and teamwork.

---

## 🏃 Race Versions

### **HYRUN FULL**
The complete format, with full distances and loads.

### **HYRUN HALF**
Same concept and structure, but with 400-meter running segments between stations and reduced sled loads.

---

## 📋 Categories

Both versions can be entered in the following participation formats:

- **Individual Male**
- **Individual Female**
- **Male Pairs**
- **Female Pairs**
- **Mixed Pairs**
- **Teams** (4-person teams)

---

## 🔧 Race Structure

The race consists of **running blocks** alternating with **functional stations**, performed in a fixed order. **The clock never stops** and athletes can only advance once each station is fully completed.

In **HYRUN HALF** the structure remains the same, with only running distances and sled loads adjusted.

---

## 👥 Teams Format

Teams of **4 athletes**, with at least **one female member** required.
Always **2 athletes** competing at a time in a relay format.

**How it works:**
- Two athletes enter
- They run together
- They perform the functional station together
- They can only swap when the station is 100% completed
- Both exit and the other two enter

---

## ⏱️ Schedule & Heats

The event runs from **09:00 to 18:00**.
Each heat has **6 to 8 athletes/pairs**. Starts are every **15 minutes**.

Athletes don't need to be at the venue at 09:00; they should arrive **90 minutes** before their heat for **check-in**, **30 minutes** before for the **Warm Up Zone**, and **15 minutes** before for the **Call Room** (chip collection).

---

## 🏅 Official Sequence

**8 km of running** alternating with **8 stations**, in order:

1. SkiErg
2. Sled Push
3. Sled Pull
4. Burpee Broad Jumps
5. Rowing
6. Farmers Carry
7. Sandbag Walking Lunges
8. Wall Balls
→ Finish

---

## ⏱️ Official Timing

HYRUN uses an **electronic chip timing system**.

Each athlete will have:
- Official total race time
- Split times per station
- Official running times

**This system is the only valid timing for the event.** Manual times, personal watches, or other external systems will not be accepted.

---

## 💪 Official Equipment and Loads

### **FULL – Individuals and Pairs:**

| Exercise | Male | Female | Mixed |
|---|---|---|---|
| **Sled Push** | 152 kg | 102 kg | 152 kg |
| **Sled Pull** | 103 kg | 78 kg | 103 kg |
| **Farmer's Carry** | 2×24 kg | 2×16 kg | 2×24 kg |
| **Sandbag Lunges** | 20 kg | 10 kg | 20 kg |
| **Wall Balls** | 6 kg (3.0 m) | 4 kg (2.75 m) | 6 kg (3.0 m male) / (2.75 m female) |

### **HALF:**
- **Sled Push** and **Sled Pull** with half the load
- All other stations maintain the same values

### **TEAMS:**
- Use HALF loads

---

## 📏 Main Rules

- Follow the course, station order, and movement standards
- Always follow judge and staff instructions (non-compliance may lead to disqualification)
- **Pairs:** free work at stations; 1 chip, enter together, stay within 2 m during running, cross the finish line simultaneously
- Be in the race zone 15 min before your heat and use designated areas only
- Changing rooms available

---

## ⚠️ Penalties

Penalties may be applied for:
- Incorrect movement execution
- Going off course
- Not respecting transition zones
- Not completing running distances
- Illegal swaps in Teams format

---

## 💰 Registration, Prices and Benefits

### **HYRUN FULL:**
- Individual: **€50**
- Pairs: **€45** per athlete (€90 total)
- Teams: **€40** per athlete (€160 total)

### **HYRUN HALF:**
- Individual: **€30**
- Pairs: **€30** per athlete (€60 total)
- Teams: **€30** per athlete (€120 total)

💡 **CrossBoxAçor** athletes receive a **€10 discount** on the individual price, in any category.

### **Includes:**
✅ Event participation
✅ Access to official photos and videos
✅ Participation keepsake
✅ Access to all zones: race, warm up, merchandising, recovery, kids zone, and changing rooms

**Registration confirmed upon payment. Limited spots.**

---

🔥 **HYRUN - Functional Endurance at its best!** 🏋️`,
      city: "Arganil",
      metaTitle:
        "HYRUN 2nd Edition 2026 | Arganil | March 14-15 | Functional Endurance",
      metaDescription:
        "HYRUN 2nd Edition on March 14-15, 2026 in Arganil. Functional endurance event with running and 8 stations. Full and Half versions. Individual, Pairs and Teams.",
    },
    es: {
      title: "HYRUN - II Edición | Arganil 2026",
      description: `**🏋️ HYRUN - II Edición | Arganil 2026**

Tras el éxito de la 1ª edición en 2025, **HYRUN** regresa a **Arganil** los días **14 y 15 de marzo de 2026** con más fuerza! 🔥

HYRUN es un **evento de resistencia funcional** donde la carrera se combina con **estaciones funcionales**. El objetivo es ofrecer un recorrido continuo, realizado contra el reloj, que desafíe y desarrolle la resistencia, la fuerza, la gestión del esfuerzo y el trabajo en equipo.

---

## 🏃 Versiones de la Prueba

### **HYRUN FULL**
El formato completo, con distancias y cargas integrales.

### **HYRUN HALF**
El mismo concepto y estructura, pero con tramos de carrera de 400 metros entre estaciones y reducción de cargas en los SLEDs.

---

## 📋 Categorías

Ambas versiones se pueden realizar en los siguientes formatos de participación:

- **Individual Masculino**
- **Individual Femenino**
- **Duplas Masculinas**
- **Duplas Femeninas**
- **Duplas Mixtas**
- **Teams** (equipos de 4 atletas)

---

## 🔧 Estructura de la Prueba

La prueba está compuesta por **bloques de carrera** intercalados con **estaciones funcionales**, realizadas en un orden fijo. **El cronómetro nunca se detiene** y los atletas solo pueden avanzar cuando cada estación esté completamente terminada.

En el **HYRUN HALF** la estructura se mantiene, ajustándose solo las distancias de carrera y la carga de los SLEDs.

---

## 👥 Formato Teams

Equipos de **4 atletas**, con obligatoriedad de al menos **un elemento femenino**.
Compiten siempre **2 atletas** a la vez en formato de relevo.

**Funcionamiento:**
- Entran dos atletas
- Corren juntos
- Ejecutan la estación funcional en conjunto
- Solo pueden cambiar cuando la estación esté 100% completada
- Salen los dos y entran los otros dos

---

## ⏱️ Horario & Heats

El evento transcurre de **09:00 a 18:00**.
Cada heat tendrá entre **6 a 8 atletas/duplas**. Las salidas se realizan cada **15 minutos**.

Los atletas no necesitan estar en el recinto a las 09:00; deben presentarse **90 minutos** antes de su heat para **check-in**, **30 minutos** antes para acceso a la **Warm Up Zone** y **15 minutos** antes a la **Call Room** (recogida de chips).

---

## 🏅 Secuencia Oficial

**8 km de carrera** intercalados con **8 estaciones**, en el orden:

1. SkiErg
2. Sled Push
3. Sled Pull
4. Burpee Broad Jumps
5. Rowing
6. Farmers Carry
7. Sandbag Walking Lunges
8. Wall Balls
→ Meta

---

## 💪 Equipamiento y Cargas Oficiales

### **FULL – Individuales y Duplas:**

| Ejercicio | Masculino | Femenino | Mixtas |
|---|---|---|---|
| **Sled Push** | 152 kg | 102 kg | 152 kg |
| **Sled Pull** | 103 kg | 78 kg | 103 kg |
| **Farmer's Carry** | 2×24 kg | 2×16 kg | 2×24 kg |
| **Sandbag Lunges** | 20 kg | 10 kg | 20 kg |
| **Wall Balls** | 6 kg (3.0 m) | 4 kg (2.75 m) | 6 kg (3.0 m masc.) / (2.75 m fem.) |

### **HALF:**
- **Sled Push** y **Sled Pull** con la mitad de la carga
- Todas las demás estaciones mantienen los mismos valores

### **TEAMS:**
- Utilizan las cargas del HALF

---

## 💰 Inscripciones, Precios y Beneficios

### **HYRUN FULL:**
- Individual: **50€**
- Duplas: **45€** por atleta (90€ en total)
- Teams: **40€** por atleta (160€ en total)

### **HYRUN HALF:**
- Individual: **30€**
- Duplas: **30€** por atleta (60€ en total)
- Teams: **30€** por atleta (120€ en total)

💡 Los atletas **CrossBoxAçor** reciben un descuento de **10€** en el valor individual, en cualquier categoría.

### **Incluye:**
✅ Participación en la prueba
✅ Acceso a fotos y vídeos oficiales
✅ Recuerdo de participación
✅ Acceso a todas las zonas: prueba, warm up, merchandising, recuperación, zona kids y vestuarios

**Inscripción confirmada tras el pago. Plazas limitadas.**

---

🔥 **HYRUN - ¡Resistencia funcional en su máximo nivel!** 🏋️`,
      city: "Arganil",
      metaTitle:
        "HYRUN II Edición 2026 | Arganil | 14-15 Marzo | Resistencia Funcional",
      metaDescription:
        "HYRUN II Edición el 14-15 de marzo de 2026 en Arganil. Evento de resistencia funcional con carrera y 8 estaciones. Versiones Full y Half. Individual, Duplas y Teams.",
    },
    fr: {
      title: "HYRUN - IIe Édition | Arganil 2026",
      description: `**🏋️ HYRUN - IIe Édition | Arganil 2026**

Après le succès de la 1ère édition en 2025, le **HYRUN** revient à **Arganil** les **14 et 15 mars 2026** avec encore plus de force ! 🔥

Le HYRUN est un **événement d'endurance fonctionnelle** où la course est combinée avec des **stations fonctionnelles**. L'objectif est de proposer un parcours continu, réalisé contre la montre, qui défie et développe l'endurance, la force, la gestion de l'effort et le travail en équipe.

---

## 🏃 Versions de l'Épreuve

### **HYRUN FULL**
Le format complet, avec distances et charges intégrales.

### **HYRUN HALF**
Le même concept et structure, mais avec des segments de course de 400 mètres entre les stations et réduction des charges sur les SLEDs.

---

## 📋 Catégories

Les deux versions peuvent être réalisées dans les formats de participation suivants :

- **Individuel Masculin**
- **Individuel Féminin**
- **Paires Masculines**
- **Paires Féminines**
- **Paires Mixtes**
- **Teams** (équipes de 4 athlètes)

---

## 🔧 Structure de l'Épreuve

L'épreuve est composée de **blocs de course** alternés avec des **stations fonctionnelles**, réalisées dans un ordre fixe. **Le chronomètre ne s'arrête jamais** et les athlètes ne peuvent avancer que lorsque chaque station est entièrement terminée.

Dans le **HYRUN HALF** la structure reste la même, seules les distances de course et la charge des SLEDs sont ajustées.

---

## 👥 Format Teams

Équipes de **4 athlètes**, avec l'obligation d'avoir au moins **un élément féminin**.
Toujours **2 athlètes** en compétition à la fois en format relais.

**Fonctionnement :**
- Deux athlètes entrent
- Ils courent ensemble
- Ils exécutent la station fonctionnelle ensemble
- Ils ne peuvent changer que lorsque la station est terminée à 100%
- Les deux sortent et les deux autres entrent

---

## ⏱️ Horaires & Heats

L'événement se déroule de **09h00 à 18h00**.
Chaque heat comprendra entre **6 à 8 athlètes/paires**. Les départs se font toutes les **15 minutes**.

Les athlètes n'ont pas besoin d'être sur le site à 09h00 ; ils doivent se présenter **90 minutes** avant leur heat pour le **check-in**, **30 minutes** avant pour l'accès à la **Warm Up Zone** et **15 minutes** avant la **Call Room** (récupération des puces).

---

## 🏅 Séquence Officielle

**8 km de course** alternés avec **8 stations**, dans l'ordre :

1. SkiErg
2. Sled Push
3. Sled Pull
4. Burpee Broad Jumps
5. Rowing
6. Farmers Carry
7. Sandbag Walking Lunges
8. Wall Balls
→ Arrivée

---

## 💪 Équipement et Charges Officiels

### **FULL – Individuels et Paires :**

| Exercice | Masculin | Féminin | Mixtes |
|---|---|---|---|
| **Sled Push** | 152 kg | 102 kg | 152 kg |
| **Sled Pull** | 103 kg | 78 kg | 103 kg |
| **Farmer's Carry** | 2×24 kg | 2×16 kg | 2×24 kg |
| **Sandbag Lunges** | 20 kg | 10 kg | 20 kg |
| **Wall Balls** | 6 kg (3.0 m) | 4 kg (2.75 m) | 6 kg (3.0 m masc.) / (2.75 m fém.) |

### **HALF :**
- **Sled Push** et **Sled Pull** avec la moitié de la charge
- Toutes les autres stations gardent les mêmes valeurs

### **TEAMS :**
- Utilisent les charges du HALF

---

## 💰 Inscriptions, Prix et Avantages

### **HYRUN FULL :**
- Individuel : **50€**
- Paires : **45€** par athlète (90€ au total)
- Teams : **40€** par athlète (160€ au total)

### **HYRUN HALF :**
- Individuel : **30€**
- Paires : **30€** par athlète (60€ au total)
- Teams : **30€** par athlète (120€ au total)

💡 Les athlètes **CrossBoxAçor** bénéficient d'une réduction de **10€** sur le prix individuel, dans n'importe quelle catégorie.

### **Comprend :**
✅ Participation à l'épreuve
✅ Accès aux photos et vidéos officielles
✅ Souvenir de participation
✅ Accès à toutes les zones : épreuve, échauffement, merchandising, récupération, zone enfants et vestiaires

**Inscription confirmée après paiement. Places limitées.**

---

🔥 **HYRUN - L'endurance fonctionnelle à son meilleur !** 🏋️`,
      city: "Arganil",
      metaTitle:
        "HYRUN IIe Édition 2026 | Arganil | 14-15 Mars | Endurance Fonctionnelle",
      metaDescription:
        "HYRUN IIe Édition les 14-15 mars 2026 à Arganil. Événement d'endurance fonctionnelle avec course et 8 stations. Versions Full et Half. Individuel, Paires et Teams.",
    },
    de: {
      title: "HYRUN - II. Ausgabe | Arganil 2026",
      description: `**🏋️ HYRUN - II. Ausgabe | Arganil 2026**

Nach dem Erfolg der 1. Ausgabe in 2025 kehrt **HYRUN** am **14. und 15. März 2026** nach **Arganil** zurück – mit noch mehr Power! 🔥

HYRUN ist ein **funktionelles Ausdauer-Event**, bei dem Laufen mit **funktionellen Stationen** kombiniert wird. Ziel ist ein durchgängiger Parcours gegen die Uhr, der Ausdauer, Kraft, Belastungsmanagement und Teamarbeit herausfordert und entwickelt.

---

## 🏃 Rennversionen

### **HYRUN FULL**
Das komplette Format mit vollen Distanzen und Gewichten.

### **HYRUN HALF**
Gleiches Konzept und Struktur, aber mit 400-Meter-Laufstrecken zwischen den Stationen und reduzierten SLED-Gewichten.

---

## 📋 Kategorien

Beide Versionen können in folgenden Teilnahmeformaten absolviert werden:

- **Einzel Männlich**
- **Einzel Weiblich**
- **Männer-Paare**
- **Frauen-Paare**
- **Gemischte Paare**
- **Teams** (4-Personen-Teams)

---

## 🔧 Rennstruktur

Der Wettkampf besteht aus **Laufblöcken** im Wechsel mit **funktionellen Stationen**, die in fester Reihenfolge absolviert werden. **Die Uhr läuft immer** und Athleten können erst weitergehen, wenn jede Station vollständig abgeschlossen ist.

Beim **HYRUN HALF** bleibt die Struktur gleich, nur die Laufdistanzen und SLED-Gewichte werden angepasst.

---

## 👥 Teams-Format

Teams aus **4 Athleten**, mit mindestens **einem weiblichen Mitglied**.
Immer **2 Athleten** gleichzeitig im Staffelformat.

**Ablauf:**
- Zwei Athleten starten
- Sie laufen zusammen
- Sie absolvieren die funktionelle Station gemeinsam
- Wechsel nur möglich, wenn die Station zu 100% abgeschlossen ist
- Beide gehen raus, die anderen beiden kommen rein

---

## ⏱️ Zeitplan & Heats

Das Event läuft von **09:00 bis 18:00**.
Jeder Heat hat **6 bis 8 Athleten/Paare**. Starts erfolgen alle **15 Minuten**.

Athleten müssen nicht um 09:00 vor Ort sein; sie sollten **90 Minuten** vor ihrem Heat zum **Check-in** erscheinen, **30 Minuten** vorher für die **Warm Up Zone** und **15 Minuten** vorher zur **Call Room** (Chip-Abholung).

---

## 🏅 Offizielle Reihenfolge

**8 km Laufen** im Wechsel mit **8 Stationen**, in der Reihenfolge:

1. SkiErg
2. Sled Push
3. Sled Pull
4. Burpee Broad Jumps
5. Rowing
6. Farmers Carry
7. Sandbag Walking Lunges
8. Wall Balls
→ Ziel

---

## 💪 Offizielle Ausrüstung und Gewichte

### **FULL – Einzel und Paare:**

| Übung | Männlich | Weiblich | Gemischt |
|---|---|---|---|
| **Sled Push** | 152 kg | 102 kg | 152 kg |
| **Sled Pull** | 103 kg | 78 kg | 103 kg |
| **Farmer's Carry** | 2×24 kg | 2×16 kg | 2×24 kg |
| **Sandbag Lunges** | 20 kg | 10 kg | 20 kg |
| **Wall Balls** | 6 kg (3.0 m) | 4 kg (2.75 m) | 6 kg (3.0 m männl.) / (2.75 m weibl.) |

### **HALF:**
- **Sled Push** und **Sled Pull** mit der Hälfte des Gewichts
- Alle anderen Stationen behalten die gleichen Werte

### **TEAMS:**
- Verwenden die HALF-Gewichte

---

## 💰 Anmeldung, Preise und Vorteile

### **HYRUN FULL:**
- Einzel: **50€**
- Paare: **45€** pro Athlet (90€ gesamt)
- Teams: **40€** pro Athlet (160€ gesamt)

### **HYRUN HALF:**
- Einzel: **30€**
- Paare: **30€** pro Athlet (60€ gesamt)
- Teams: **30€** pro Athlet (120€ gesamt)

💡 **CrossBoxAçor**-Athleten erhalten einen **10€ Rabatt** auf den Einzelpreis, in jeder Kategorie.

### **Inklusive:**
✅ Wettkampfteilnahme
✅ Zugang zu offiziellen Fotos und Videos
✅ Teilnahmeandenken
✅ Zugang zu allen Bereichen: Wettkampf, Aufwärmen, Merchandising, Erholung, Kinderbereich und Umkleiden

**Anmeldung bestätigt nach Zahlung. Begrenzte Plätze.**

---

🔥 **HYRUN - Funktionelle Ausdauer auf höchstem Niveau!** 🏋️`,
      city: "Arganil",
      metaTitle:
        "HYRUN II. Ausgabe 2026 | Arganil | 14.-15. März | Funktionelle Ausdauer",
      metaDescription:
        "HYRUN II. Ausgabe am 14.-15. März 2026 in Arganil. Funktionelles Ausdauer-Event mit Laufen und 8 Stationen. Full und Half Versionen. Einzel, Paare und Teams.",
    },
    it: {
      title: "HYRUN - II Edizione | Arganil 2026",
      description: `**🏋️ HYRUN - II Edizione | Arganil 2026**

Dopo il successo della 1ª edizione nel 2025, **HYRUN** torna ad **Arganil** il **14 e 15 marzo 2026** con ancora più energia! 🔥

HYRUN è un **evento di resistenza funzionale** dove la corsa è combinata con **stazioni funzionali**. L'obiettivo è offrire un percorso continuo, realizzato contro il tempo, che sfidi e sviluppi la resistenza, la forza, la gestione dello sforzo e il lavoro di squadra.

---

## 🏃 Versioni della Gara

### **HYRUN FULL**
Il formato completo, con distanze e carichi integrali.

### **HYRUN HALF**
Stesso concetto e struttura, ma con tratti di corsa di 400 metri tra le stazioni e riduzione dei carichi sugli SLED.

---

## 📋 Categorie

Entrambe le versioni possono essere realizzate nei seguenti formati di partecipazione:

- **Individuale Maschile**
- **Individuale Femminile**
- **Coppie Maschili**
- **Coppie Femminili**
- **Coppie Miste**
- **Teams** (squadre di 4 atleti)

---

## 🔧 Struttura della Gara

La gara è composta da **blocchi di corsa** alternati con **stazioni funzionali**, realizzate in un ordine fisso. **Il cronometro non si ferma mai** e gli atleti possono avanzare solo quando ogni stazione è completamente conclusa.

Nel **HYRUN HALF** la struttura rimane invariata, vengono solo adeguate le distanze di corsa e il carico degli SLED.

---

## 👥 Formato Teams

Squadre di **4 atleti**, con obbligo di almeno **un elemento femminile**.
Competono sempre **2 atleti** alla volta in formato staffetta.

**Funzionamento:**
- Entrano due atleti
- Corrono insieme
- Eseguono la stazione funzionale insieme
- Possono cambiare solo quando la stazione è completata al 100%
- Escono entrambi e entrano gli altri due

---

## ⏱️ Orario & Heats

L'evento si svolge dalle **09:00 alle 18:00**.
Ogni heat avrà tra **6 e 8 atleti/coppie**. Le partenze avvengono ogni **15 minuti**.

Gli atleti non devono essere presenti nel recinto alle 09:00; devono presentarsi **90 minuti** prima del loro heat per il **check-in**, **30 minuti** prima per accedere alla **Warm Up Zone** e **15 minuti** prima alla **Call Room** (ritiro chip).

---

## 🏅 Sequenza Ufficiale

**8 km di corsa** alternati con **8 stazioni**, nell'ordine:

1. SkiErg
2. Sled Push
3. Sled Pull
4. Burpee Broad Jumps
5. Rowing
6. Farmers Carry
7. Sandbag Walking Lunges
8. Wall Balls
→ Traguardo

---

## 💪 Attrezzatura e Carichi Ufficiali

### **FULL – Individuali e Coppie:**

| Esercizio | Maschile | Femminile | Miste |
|---|---|---|---|
| **Sled Push** | 152 kg | 102 kg | 152 kg |
| **Sled Pull** | 103 kg | 78 kg | 103 kg |
| **Farmer's Carry** | 2×24 kg | 2×16 kg | 2×24 kg |
| **Sandbag Lunges** | 20 kg | 10 kg | 20 kg |
| **Wall Balls** | 6 kg (3.0 m) | 4 kg (2.75 m) | 6 kg (3.0 m masc.) / (2.75 m femm.) |

### **HALF:**
- **Sled Push** e **Sled Pull** con la metà del carico
- Tutte le altre stazioni mantengono gli stessi valori

### **TEAMS:**
- Utilizzano i carichi del HALF

---

## 💰 Iscrizioni, Prezzi e Benefici

### **HYRUN FULL:**
- Individuale: **50€**
- Coppie: **45€** per atleta (90€ totale)
- Teams: **40€** per atleta (160€ totale)

### **HYRUN HALF:**
- Individuale: **30€**
- Coppie: **30€** per atleta (60€ totale)
- Teams: **30€** per atleta (120€ totale)

💡 Gli atleti **CrossBoxAçor** ricevono uno sconto di **10€** sul prezzo individuale, in qualsiasi categoria.

### **Include:**
✅ Partecipazione alla gara
✅ Accesso a foto e video ufficiali
✅ Ricordo di partecipazione
✅ Accesso a tutte le zone: gara, riscaldamento, merchandising, recupero, zona bambini e spogliatoi

**Iscrizione confermata dopo il pagamento. Posti limitati.**

---

🔥 **HYRUN - Resistenza funzionale al massimo livello!** 🏋️`,
      city: "Arganil",
      metaTitle:
        "HYRUN II Edizione 2026 | Arganil | 14-15 Marzo | Resistenza Funzionale",
      metaDescription:
        "HYRUN II Edizione il 14-15 marzo 2026 ad Arganil. Evento di resistenza funzionale con corsa e 8 stazioni. Versioni Full e Half. Individuale, Coppie e Teams.",
    },
  };

  // Create event
  const event = await prisma.event.create({
    data: {
      title: "HYRUN - II Edição | Arganil 2026",
      slug: eventSlug,
      description:
        "HYRUN II Edição - Evento de resistência funcional com corrida e estações funcionais. 14-15 Março 2026, Arganil.",
      startDate: eventStartDate,
      endDate: eventEndDate,
      city: "Arganil",
      country: "Portugal",
      sportTypes: [SportType.HYROX, SportType.CROSSFIT, SportType.RUNNING],
      imageUrl: "",
      externalUrl: "https://www.portimer.pt/hyrun_ii_edicao",
      registrationDeadline: new Date("2026-03-12T23:59:59Z"),
      latitude: 40.2186,
      longitude: -8.0534,
      googleMapsUrl: "https://maps.app.goo.gl/ArganilPortugal",
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
  // HYRUN FULL variants
  const variants = [
    // === HYRUN FULL ===
    {
      name: "Individual Masculino - HYRUN Full",
      distanceKm: 8.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 50,
      price: 50.0,
      currency: Currency.EUR,
    },
    {
      name: "Individual Feminino - HYRUN Full",
      distanceKm: 8.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 50,
      price: 50.0,
      currency: Currency.EUR,
    },
    {
      name: "Duplas Masculinas - HYRUN Full",
      distanceKm: 8.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 30,
      price: 45.0,
      currency: Currency.EUR,
    },
    {
      name: "Duplas Femininas - HYRUN Full",
      distanceKm: 8.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 30,
      price: 45.0,
      currency: Currency.EUR,
    },
    {
      name: "Duplas Mistas - HYRUN Full",
      distanceKm: 8.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 30,
      price: 45.0,
      currency: Currency.EUR,
    },
    {
      name: "Teams - HYRUN Full",
      distanceKm: 8.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 20,
      price: 40.0,
      currency: Currency.EUR,
    },
    // === HYRUN HALF ===
    {
      name: "Individual Masculino - HYRUN Half",
      distanceKm: 4.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 50,
      price: 30.0,
      currency: Currency.EUR,
    },
    {
      name: "Individual Feminino - HYRUN Half",
      distanceKm: 4.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 50,
      price: 30.0,
      currency: Currency.EUR,
    },
    {
      name: "Duplas Masculinas - HYRUN Half",
      distanceKm: 4.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 30,
      price: 30.0,
      currency: Currency.EUR,
    },
    {
      name: "Duplas Femininas - HYRUN Half",
      distanceKm: 4.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 30,
      price: 30.0,
      currency: Currency.EUR,
    },
    {
      name: "Duplas Mistas - HYRUN Half",
      distanceKm: 4.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 30,
      price: 30.0,
      currency: Currency.EUR,
    },
    {
      name: "Teams - HYRUN Half",
      distanceKm: 4.0,
      elevationGainM: 0,
      elevationLossM: 0,
      startTime: "09:00",
      maxParticipants: 20,
      price: 30.0,
      currency: Currency.EUR,
    },
  ];

  // Delete existing pricing phases for this event to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating variants and pricing phases...");

  for (const variantData of variants) {
    const variant = await prisma.eventVariant.create({
      data: {
        eventId: event.id,
        name: variantData.name,
        distanceKm: variantData.distanceKm,
        elevationGainM: variantData.elevationGainM,
        elevationLossM: variantData.elevationLossM,
        startTime: variantData.startTime,
        maxParticipants: variantData.maxParticipants,
        price: variantData.price,
        currency: variantData.currency,
      },
    });

    console.log(`✅ Created variant: ${variant.name}`);

    // Create single pricing phase per variant (single price, no phases)
    await prisma.pricingPhase.create({
      data: {
        eventId: event.id, // ✅ linked to eventId (event-level display)
        variantId: variant.id, // ✅ linked to variantId (variant-level pricing)
        name: variantData.name,
        startDate: new Date("2025-12-01T00:00:00Z"),
        endDate: new Date("2026-03-12T23:59:59Z"),
        price: variantData.price,
        currency: variantData.currency,
        note: null,
      },
    });

    console.log(`   - Created pricing phase for ${variant.name}`);
  }

  // Create FAQs with translations for ALL 6 languages
  console.log("❓ Creating FAQs with translations for all 6 languages...");

  const faqs = {
    pt: [
      {
        question: "Qual a diferença entre HYRUN Full e HYRUN Half?",
        answer:
          "O HYRUN Full é o formato completo com distâncias e cargas integrais (8 km de corrida). O HYRUN Half mantém o mesmo conceito mas com percursos de corrida de 400 metros entre estações e redução das cargas nos SLEDs.",
      },
      {
        question: "Como funciona o formato Teams?",
        answer:
          "Equipas de 4 atletas (mínimo 1 elemento feminino) competem em formato de estafeta. Entram 2 atletas de cada vez, correm e executam a estação funcional juntos. Só podem trocar quando a estação estiver 100% concluída.",
      },
      {
        question: "Que estações funcionais vou encontrar?",
        answer:
          "São 8 estações pela ordem: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Walking Lunges e Wall Balls.",
      },
      {
        question: "A que horas devo chegar ao evento?",
        answer:
          "Deves apresentar-te 90 minutos antes do teu heat para check-in, 30 minutos antes para a Warm Up Zone e 15 minutos antes para a Call Room (levantamento de chips).",
      },
      {
        question: "O que está incluído na inscrição?",
        answer:
          "Participação na prova, acesso a fotos e vídeos oficiais, lembrança de participação e acesso a todas as zonas: prova, warm up, merchandising, recuperação, zona kids e balneários.",
      },
      {
        question: "Existe desconto para atletas CrossBoxAçor?",
        answer:
          "Sim, os atletas CrossBoxAçor recebem um desconto de 10€ no valor individual, em qualquer categoria.",
      },
    ],
    en: [
      {
        question: "What is the difference between HYRUN Full and HYRUN Half?",
        answer:
          "HYRUN Full is the complete format with full distances and loads (8 km running). HYRUN Half keeps the same concept but with 400-meter running segments between stations and reduced sled loads.",
      },
      {
        question: "How does the Teams format work?",
        answer:
          "Teams of 4 athletes (minimum 1 female) compete in a relay format. 2 athletes enter at a time, run and perform the functional station together. They can only swap when the station is 100% completed.",
      },
      {
        question: "What functional stations will I encounter?",
        answer:
          "There are 8 stations in order: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Walking Lunges, and Wall Balls.",
      },
      {
        question: "What time should I arrive at the event?",
        answer:
          "You should arrive 90 minutes before your heat for check-in, 30 minutes before for the Warm Up Zone, and 15 minutes before for the Call Room (chip collection).",
      },
      {
        question: "What is included in the registration?",
        answer:
          "Event participation, access to official photos and videos, participation keepsake, and access to all zones: race, warm up, merchandising, recovery, kids zone, and changing rooms.",
      },
      {
        question: "Is there a discount for CrossBoxAçor athletes?",
        answer:
          "Yes, CrossBoxAçor athletes receive a €10 discount on the individual price, in any category.",
      },
    ],
    es: [
      {
        question: "¿Cuál es la diferencia entre HYRUN Full y HYRUN Half?",
        answer:
          "HYRUN Full es el formato completo con distancias y cargas integrales (8 km de carrera). HYRUN Half mantiene el mismo concepto pero con tramos de carrera de 400 metros entre estaciones y reducción de cargas en los SLEDs.",
      },
      {
        question: "¿Cómo funciona el formato Teams?",
        answer:
          "Equipos de 4 atletas (mínimo 1 elemento femenino) compiten en formato de relevo. Entran 2 atletas a la vez, corren y ejecutan la estación funcional juntos. Solo pueden cambiar cuando la estación esté 100% completada.",
      },
      {
        question: "¿Qué estaciones funcionales encontraré?",
        answer:
          "Son 8 estaciones en orden: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Walking Lunges y Wall Balls.",
      },
      {
        question: "¿A qué hora debo llegar al evento?",
        answer:
          "Debes presentarte 90 minutos antes de tu heat para check-in, 30 minutos antes para la Warm Up Zone y 15 minutos antes para la Call Room (recogida de chips).",
      },
      {
        question: "¿Qué incluye la inscripción?",
        answer:
          "Participación en la prueba, acceso a fotos y vídeos oficiales, recuerdo de participación y acceso a todas las zonas: prueba, warm up, merchandising, recuperación, zona kids y vestuarios.",
      },
      {
        question: "¿Existe descuento para atletas CrossBoxAçor?",
        answer:
          "Sí, los atletas CrossBoxAçor reciben un descuento de 10€ en el valor individual, en cualquier categoría.",
      },
    ],
    fr: [
      {
        question: "Quelle est la différence entre HYRUN Full et HYRUN Half ?",
        answer:
          "HYRUN Full est le format complet avec distances et charges intégrales (8 km de course). HYRUN Half garde le même concept mais avec des segments de course de 400 mètres entre les stations et réduction des charges sur les SLEDs.",
      },
      {
        question: "Comment fonctionne le format Teams ?",
        answer:
          "Équipes de 4 athlètes (minimum 1 élément féminin) en format relais. 2 athlètes entrent à la fois, courent et exécutent la station fonctionnelle ensemble. Ils ne peuvent changer que lorsque la station est terminée à 100%.",
      },
      {
        question: "Quelles stations fonctionnelles vais-je rencontrer ?",
        answer:
          "Il y a 8 stations dans l'ordre : SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Walking Lunges et Wall Balls.",
      },
      {
        question: "À quelle heure dois-je arriver à l'événement ?",
        answer:
          "Tu dois te présenter 90 minutes avant ton heat pour le check-in, 30 minutes avant pour la Warm Up Zone et 15 minutes avant pour la Call Room (récupération des puces).",
      },
      {
        question: "Qu'est-ce qui est inclus dans l'inscription ?",
        answer:
          "Participation à l'épreuve, accès aux photos et vidéos officielles, souvenir de participation et accès à toutes les zones : épreuve, échauffement, merchandising, récupération, zone enfants et vestiaires.",
      },
      {
        question: "Y a-t-il une réduction pour les athlètes CrossBoxAçor ?",
        answer:
          "Oui, les athlètes CrossBoxAçor bénéficient d'une réduction de 10€ sur le prix individuel, dans n'importe quelle catégorie.",
      },
    ],
    de: [
      {
        question: "Was ist der Unterschied zwischen HYRUN Full und HYRUN Half?",
        answer:
          "HYRUN Full ist das komplette Format mit vollen Distanzen und Gewichten (8 km Laufen). HYRUN Half behält das gleiche Konzept bei, aber mit 400-Meter-Laufstrecken zwischen den Stationen und reduzierten SLED-Gewichten.",
      },
      {
        question: "Wie funktioniert das Teams-Format?",
        answer:
          "Teams aus 4 Athleten (mindestens 1 weibliches Mitglied) im Staffelformat. 2 Athleten starten gleichzeitig, laufen und absolvieren die funktionelle Station gemeinsam. Wechsel nur möglich, wenn die Station zu 100% abgeschlossen ist.",
      },
      {
        question: "Welche funktionellen Stationen werde ich vorfinden?",
        answer:
          "Es gibt 8 Stationen in der Reihenfolge: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Walking Lunges und Wall Balls.",
      },
      {
        question: "Wann sollte ich beim Event ankommen?",
        answer:
          "Du solltest 90 Minuten vor deinem Heat zum Check-in erscheinen, 30 Minuten vorher für die Warm Up Zone und 15 Minuten vorher zur Call Room (Chip-Abholung).",
      },
      {
        question: "Was ist in der Anmeldung enthalten?",
        answer:
          "Wettkampfteilnahme, Zugang zu offiziellen Fotos und Videos, Teilnahmeandenken und Zugang zu allen Bereichen: Wettkampf, Aufwärmen, Merchandising, Erholung, Kinderbereich und Umkleiden.",
      },
      {
        question: "Gibt es einen Rabatt für CrossBoxAçor-Athleten?",
        answer:
          "Ja, CrossBoxAçor-Athleten erhalten einen 10€ Rabatt auf den Einzelpreis, in jeder Kategorie.",
      },
    ],
    it: [
      {
        question: "Qual è la differenza tra HYRUN Full e HYRUN Half?",
        answer:
          "HYRUN Full è il formato completo con distanze e carichi integrali (8 km di corsa). HYRUN Half mantiene lo stesso concetto ma con tratti di corsa di 400 metri tra le stazioni e riduzione dei carichi sugli SLED.",
      },
      {
        question: "Come funziona il formato Teams?",
        answer:
          "Squadre di 4 atleti (minimo 1 elemento femminile) in formato staffetta. Entrano 2 atleti alla volta, corrono ed eseguono la stazione funzionale insieme. Possono cambiare solo quando la stazione è completata al 100%.",
      },
      {
        question: "Quali stazioni funzionali troverò?",
        answer:
          "Ci sono 8 stazioni nell'ordine: SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Walking Lunges e Wall Balls.",
      },
      {
        question: "A che ora devo arrivare all'evento?",
        answer:
          "Devi presentarti 90 minuti prima del tuo heat per il check-in, 30 minuti prima per la Warm Up Zone e 15 minuti prima per la Call Room (ritiro chip).",
      },
      {
        question: "Cosa è incluso nell'iscrizione?",
        answer:
          "Partecipazione alla gara, accesso a foto e video ufficiali, ricordo di partecipazione e accesso a tutte le zone: gara, riscaldamento, merchandising, recupero, zona bambini e spogliatoi.",
      },
      {
        question: "C'è uno sconto per gli atleti CrossBoxAçor?",
        answer:
          "Sì, gli atleti CrossBoxAçor ricevono uno sconto di 10€ sul prezzo individuale, in qualsiasi categoria.",
      },
    ],
  };

  // Create FAQs with Portuguese (base) content
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

  console.log("✅ HYRUN II Edição - Arganil 2026 seed completed successfully!");
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedHyrunArganil2026()
    .catch((e) => {
      console.error("❌ Error seeding HYRUN II Edição - Arganil 2026:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
