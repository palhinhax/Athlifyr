/**
 * Seed: Trail Atlânticas - Asaltamontes Madeira Female 2026
 * Complete with translations in all 6 languages
 * Women-only trail running event in Madeira, Portugal
 */

import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🏃‍♀️ Seeding Trail Atlânticas - Asaltamontes Madeira Female 2026..."
  );

  const eventSlug = "trail-atlanticas-2026";

  // Step 1: Delete existing data to ensure clean state
  const existingEvent = await prisma.event.findUnique({
    where: { slug: eventSlug },
  });

  if (existingEvent) {
    console.log("   Cleaning existing event data...");
    await prisma.pricingPhase.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventFAQ.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventVariant.deleteMany({
      where: { eventId: existingEvent.id },
    });
    await prisma.eventTranslation.deleteMany({
      where: { eventId: existingEvent.id },
    });
  }

  // Step 2: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: eventSlug },
    update: {
      title: "Trail Atlânticas - Asaltamontes Madeira Female",
      description: `Evento de trail running exclusivamente feminino na Ilha da Madeira. Prova de 15km com 630m D+ entre Porto da Cruz e Machico.`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-14T09:00:00.000Z"),
      endDate: null,
      city: "Porto da Cruz",
      country: "Portugal",
      latitude: 32.7653,
      longitude: -16.8314,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Porto+da+Cruz+Madeira+Portugal",
      externalUrl:
        "https://stopandgo.net/events/atlanticas-asaltamontes-madeira-female-2026",
      imageUrl: null,
      isFeatured: true,
      registrationDeadline: new Date("2026-03-10T23:59:59.000Z"),
    },
    create: {
      slug: eventSlug,
      title: "Trail Atlânticas - Asaltamontes Madeira Female",
      description: `Evento de trail running exclusivamente feminino na Ilha da Madeira. Prova de 15km com 630m D+ entre Porto da Cruz e Machico.`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-14T09:00:00.000Z"),
      endDate: null,
      city: "Porto da Cruz",
      country: "Portugal",
      latitude: 32.7653,
      longitude: -16.8314,
      googleMapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Porto+da+Cruz+Madeira+Portugal",
      externalUrl:
        "https://stopandgo.net/events/atlanticas-asaltamontes-madeira-female-2026",
      imageUrl: null,
      isFeatured: true,
      registrationDeadline: new Date("2026-03-10T23:59:59.000Z"),
    },
  });

  console.log(`✅ Event upserted: ${event.slug} (ID: ${event.id})`);

  // Step 3: Create translations for ALL 6 LANGUAGES
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
      title: "Trail Atlânticas - Asaltamontes Madeira Female",
      city: "Porto da Cruz",
      metaTitle:
        "Trail Atlânticas 2026 | Asaltamontes Madeira Female | 14 Março",
      metaDescription:
        "Trail Atlânticas 2026 - Prova exclusivamente feminina na Madeira. Trail 15km com 630m D+ de Porto da Cruz a Machico. Organização Asaltamontes Female.",
      description: `# 🏃‍♀️ Trail Atlânticas - Asaltamontes Madeira Female 2026

O **Trail Atlânticas** é um evento desportivo **exclusivamente feminino**, de carácter individual, organizado pela **Asaltamontes Female**, que se realizará na Ilha da Madeira (Portugal) no dia **14 de Março de 2026**.

## 🗺️ O Percurso

A prova tem um percurso **linear de 15 quilómetros** com **630 metros de desnível positivo**, podendo ser realizada em **corrida ou marcha/caminhada**, sempre com absoluto respeito pelo meio ambiente.

### Trajeto
A partida da prova é no **Porto da Cruz**, na Rua da Praia em direção à Praia da Maiata, seguindo depois por caminhos e veredas em direção ao sítio do **Larano**. Continuação pela **Vereda do Larano**, até à passagem pela **Boca do Risco**, onde as atletas descem até à **Levada do Caniçal**, percorrendo-a até a descida para a Santa Casa da Misericórdia de **Machico**, percorrendo os últimos metros em estrada na Rua do Desembarcadouro, até à meta na **Baía de Machico**.

## 📊 Dados Técnicos

| Prova | Distância | D+ | D- | Tempo Mais Rápido | Tempo Máximo |
|-------|-----------|-----|-----|-------------------|--------------|
| Trail | 15 km | 630 m | 640 m | 1h15 | 4h30 |

## 🎯 Objetivo

A realização deste evento tem como objetivo promover o **desporto feminino** na prática de corrida ou caminhada no concelho de Machico, com sítios privilegiados para a prática de corrida em trilhos na deslumbrante costa norte da Madeira.

## 📋 Informações Gerais

- **Data:** 14 de Março de 2026
- **Hora de Partida:** 09:00
- **Tempo Máximo:** 4 horas e 30 minutos
- **Partida:** Porto da Cruz (Rua da Praia)
- **Chegada:** Baía de Machico
- **Entrega de Prémios:** 14h30 junto à meta

## 👩 Participação

Podem participar **mulheres a partir dos 16 anos** de idade, desde que completem corretamente a inscrição e aceitem integralmente o regulamento.

## 🏆 Categorias

- **Baby:** 16 a 23 anos
- **Júnior:** 24 a 29 anos
- **Sénior:** 30 a 39 anos
- **Veteranas A:** 40 a 49 anos
- **Veteranas B:** 50 a 59 anos
- **Veteranas C:** 60 a 69 anos
- **Premium:** 70 anos ou mais

## 🏅 Prémios Especiais

### Classificação Geral
- Pódio para as 3 primeiras classificadas

### Classificação Residentes Madeira
- As **3 primeiras mulheres residentes na Madeira**, maiores de idade, serão convidadas a participar no **Festival Asaltamontes Female** (Setembro 2026) em Espanha!

**O prémio inclui:**
- ✈️ Inscrição no Festival Asaltamontes Female
- ✈️ Voo: Funchal – Porto – Funchal
- 🚌 Autocarro: Porto – Vigo – Porto
- 🏨 Alojamento durante o fim de semana de 26/27 de Setembro de 2026

## 🎒 Material Obrigatório

Todas as participantes deverão obrigatoriamente transportar:

- ✅ Dorsal oficial visível
- ✅ Recipiente próprio para líquidos (500ml)
- ✅ Alimentação de reserva
- ✅ Apito
- ✅ Telemóvel operacional com bateria suficiente

**Material Recomendado:**
- 🧥 Casaco corta-vento

⚠️ A organização poderá recomendar ou exigir material adicional em função das condições meteorológicas ou de segurança.

## 💧 Abastecimentos

O percurso terá **abastecimento líquido e sólido** num ponto intermédio e na meta.

⚠️ **Importante:** Não serão disponibilizados copos para reduzir resíduos. Cada participante deverá transportar o seu próprio recipiente.

## 🎁 A Inscrição Inclui

- ✅ Participação na prova
- ✅ Seguro de responsabilidade civil e assistência médica na zona da Meta
- ✅ Peitoral personalizado com chip de registo eletrónico
- ✅ Abastecimentos no percurso e na meta
- ✅ Transporte para a zona de partida da prova
- ✅ Transporte para a chegada em caso de abandono
- ✅ Bolsa da participante e brindes
- ✅ Acesso livre aos balneários e duches junto à meta
- ✅ Refeição final

## 📦 Check-In / Secretariado

- **Sexta-feira, 13 de Março de 2026** - Horário a confirmar

## ⚠️ Motivos de Desclassificação

- ❌ Deitar resíduos fora das zonas autorizadas
- ❌ Não ter o dorsal de forma visível
- ❌ Condutas antidesportivas ou incívicas
- ❌ Não prestar auxílio a outra participante em caso de necessidade
- ❌ Incumprimento de qualquer ponto do regulamento

## 🌍 Segurança e Meio Ambiente

As participantes deverão respeitar o meio natural e seguir as indicações da organização. Com o objetivo de preservar o ambiente, todas as corredoras deverão **marcar de forma visível com o número do dorsal** qualquer resíduo que possam usar durante a prova.

## 📞 Contacto de Emergência

**+351 916 274 540** (guardar previamente no telemóvel)

---

**🌊 Vem descobrir os trilhos deslumbrantes da costa norte da Madeira!**

*Organização: Asaltamontes Female*`,
    },
    {
      language: "en",
      title: "Trail Atlânticas - Asaltamontes Madeira Female",
      city: "Porto da Cruz",
      metaTitle:
        "Trail Atlânticas 2026 | Asaltamontes Madeira Female | March 14",
      metaDescription:
        "Trail Atlânticas 2026 - Women-only trail running event in Madeira. 15km trail with 630m D+ from Porto da Cruz to Machico. Organized by Asaltamontes Female.",
      description: `# 🏃‍♀️ Trail Atlânticas - Asaltamontes Madeira Female 2026

**Trail Atlânticas** is an **exclusively female** sporting event, individual in nature, organized by **Asaltamontes Female**, to be held on the island of Madeira (Portugal) on **March 14, 2026**.

## 🗺️ The Course

The event features a **linear 15-kilometre course** with **630 metres of positive elevation gain**, which can be completed by **running or walking/hiking**, with full respect for the environment.

### Route
The start is in **Porto da Cruz**, on Rua da Praia, heading towards Praia da Maiata, continuing along paths and trails towards the area of **Larano**. The route follows the **Vereda do Larano** up to **Boca do Risco**, where athletes descend to **Levada do Caniçal**, following it until the descent to Santa Casa da Misericórdia in **Machico**. The final metres are on the road along Rua do Desembarcadouro, finishing at the finish line in **Machico Bay**.

## 📊 Technical Data

| Race | Distance | D+ | D- | Fastest Time | Max. Time |
|------|----------|-----|-----|--------------|-----------|
| Trail | 15 km | 630 m | 640 m | 1h15 | 4h30 |

## 🎯 Objective

This event aims to promote **women's sports** through running or walking in the municipality of Machico, taking advantage of privileged locations for trail running on Madeira's stunning north coast.

## 📋 General Information

- **Date:** March 14, 2026
- **Start Time:** 09:00
- **Maximum Time:** 4 hours and 30 minutes
- **Start:** Porto da Cruz (Rua da Praia)
- **Finish:** Machico Bay
- **Awards Ceremony:** 14:30 near the finish line

## 👩 Participation

**Women aged 16 and over** may participate, provided they correctly complete the registration process and fully accept the regulations.

## 🏆 Categories

- **Baby:** 16 to 23 years
- **Junior:** 24 to 29 years
- **Senior:** 30 to 39 years
- **Veterans A:** 40 to 49 years
- **Veterans B:** 50 to 59 years
- **Veterans C:** 60 to 69 years
- **Premium:** 70 years or older

## 🏅 Special Prizes

### Overall Classification
- Podium for the top 3 finishers

### Madeira Residents Classification
- The **first 3 adult women residing in Madeira** will be invited to participate in the **Asaltamontes Female Festival** (September 2026) in Spain!

**The prize includes:**
- ✈️ Registration for the Asaltamontes Female Festival
- ✈️ Flight: Funchal – Porto – Funchal
- 🚌 Bus: Porto – Vigo – Porto
- 🏨 Accommodation for the weekend of September 26-27, 2026

## 🎒 Mandatory Equipment

All participants must carry:

- ✅ Official bib clearly visible
- ✅ Personal liquid container (500ml)
- ✅ Reserve food
- ✅ Whistle
- ✅ Operational mobile phone with sufficient battery

**Recommended Equipment:**
- 🧥 Windbreaker jacket

⚠️ The organization may recommend or require additional equipment depending on weather or safety conditions.

## 💧 Aid Stations

The course will have **liquid and solid aid stations** at an intermediate point and at the finish.

⚠️ **Important:** No cups will be provided to reduce waste. Each participant must carry their own container.

## 🎁 Registration Includes

- ✅ Participation in the race
- ✅ Civil liability insurance and medical assistance at the finish area
- ✅ Personalized bib with electronic timing chip
- ✅ Aid stations along the course and at the finish
- ✅ Transport to the race start area
- ✅ Transport from the course in case of withdrawal
- ✅ Participant bag and gifts
- ✅ Free access to changing rooms and showers at the finish
- ✅ Post-race meal

## 📦 Check-In / Race Office

- **Friday, March 13, 2026** - Schedule to be confirmed

## ⚠️ Grounds for Disqualification

- ❌ Littering outside authorized areas
- ❌ Bib not clearly visible
- ❌ Unsportsmanlike or uncivil behaviour
- ❌ Failure to assist another participant in need
- ❌ Non-compliance with any part of the regulations

## 🌍 Safety and Environment

Participants must respect the natural environment and follow all organizational instructions. To preserve nature, all runners must **clearly mark any waste** they use during the race **with their bib number**.

## 📞 Emergency Contact

**+351 916 274 540** (save in advance on your phone)

---

**🌊 Come discover the stunning trails of Madeira's north coast!**

*Organized by: Asaltamontes Female*`,
    },
    {
      language: "es",
      title: "Trail Atlánticas - Asaltamontes Madeira Female",
      city: "Porto da Cruz",
      metaTitle:
        "Trail Atlánticas 2026 | Asaltamontes Madeira Female | 14 Marzo",
      metaDescription:
        "Trail Atlánticas 2026 - Prueba exclusivamente femenina en Madeira. Trail 15km con 630m D+ de Porto da Cruz a Machico. Organización Asaltamontes Female.",
      description: `# 🏃‍♀️ Trail Atlánticas - Asaltamontes Madeira Female 2026

El **Trail Atlánticas** es un evento deportivo **exclusivamente femenino**, de carácter individual, organizado por **Asaltamontes Female**, que se celebrará en la isla de Madeira (Portugal) el día **14 de marzo de 2026**.

## 🗺️ El Recorrido

La prueba cuenta con un recorrido **lineal de 15 kilómetros** con **630 metros de desnivel positivo**, pudiendo realizarse **corriendo o en marcha/caminata**, siempre con absoluto respeto por el medio ambiente.

### Trayecto
La salida tiene lugar en **Porto da Cruz**, en la Rua da Praia, en dirección a Praia da Maiata, continuando posteriormente por caminos y senderos hacia la zona de **Larano**. El recorrido prosigue por la **Vereda do Larano** hasta el paso por **Boca do Risco**, donde las participantes descienden hasta la **Levada do Caniçal**, recorriéndola hasta la bajada hacia la Santa Casa da Misericórdia de **Machico**. Los últimos metros se realizan por carretera, en la Rua do Desembarcadouro, hasta la meta situada en la **Bahía de Machico**.

## 📊 Datos Técnicos

| Prueba | Distancia | D+ | D- | Tiempo Más Rápido | Tiempo Máximo |
|--------|-----------|-----|-----|-------------------|---------------|
| Trail | 15 km | 630 m | 640 m | 1h15 | 4h30 |

## 🎯 Objetivo

Este evento tiene como objetivo promover el **deporte femenino** a través de la práctica de la carrera o caminata en el municipio de Machico, en entornos privilegiados para el trail running en la impresionante costa norte de Madeira.

## 📋 Información General

- **Fecha:** 14 de marzo de 2026
- **Hora de Salida:** 09:00
- **Tiempo Máximo:** 4 horas y 30 minutos
- **Salida:** Porto da Cruz (Rua da Praia)
- **Llegada:** Bahía de Machico
- **Entrega de Premios:** 14:30 junto a la meta

## 👩 Participación

Pueden participar **mujeres a partir de los 16 años** de edad, siempre que completen correctamente la inscripción y acepten íntegramente el reglamento.

## 🏆 Categorías

- **Baby:** 16 a 23 años
- **Junior:** 24 a 29 años
- **Senior:** 30 a 39 años
- **Veteranas A:** 40 a 49 años
- **Veteranas B:** 50 a 59 años
- **Veteranas C:** 60 a 69 años
- **Premium:** 70 años o más

## 🏅 Premios Especiales

### Clasificación General
- Podio para las 3 primeras clasificadas

### Clasificación Residentes en Madeira
- Las **3 primeras mujeres residentes en Madeira**, mayores de edad, ¡serán invitadas a participar en el **Festival Asaltamontes Female** (septiembre 2026) en España!

**El premio incluye:**
- ✈️ Inscripción en el Festival Asaltamontes Female
- ✈️ Vuelo: Funchal – Oporto – Funchal
- 🚌 Autobús: Oporto – Vigo – Oporto
- 🏨 Alojamiento durante el fin de semana del 26/27 de septiembre de 2026

## 🎒 Material Obligatorio

Todas las participantes deberán llevar obligatoriamente:

- ✅ Dorsal oficial visible
- ✅ Recipiente propio para líquidos (500ml)
- ✅ Alimentación de reserva
- ✅ Silbato
- ✅ Teléfono móvil operativo con batería suficiente

**Material Recomendado:**
- 🧥 Chaqueta cortavientos

⚠️ La organización podrá recomendar o exigir material adicional en función de las condiciones meteorológicas o de seguridad.

## 💧 Avituallamientos

El recorrido tendrá **avituallamiento líquido y sólido** en un punto intermedio y en la meta.

⚠️ **Importante:** No se facilitarán vasos para reducir residuos. Cada participante deberá llevar su propio recipiente.

## 🎁 La Inscripción Incluye

- ✅ Participación en la prueba
- ✅ Seguro de responsabilidad civil y asistencia médica en la zona de meta
- ✅ Dorsal personalizado con chip electrónico de cronometraje
- ✅ Avituallamientos en el recorrido y en la meta
- ✅ Transporte a la zona de salida
- ✅ Transporte desde el recorrido en caso de abandono
- ✅ Bolsa de la participante y obsequios
- ✅ Acceso libre a vestuarios y duchas en la meta
- ✅ Comida final

## 📦 Check-In / Secretaría

- **Viernes, 13 de marzo de 2026** - Horario a confirmar

## ⚠️ Motivos de Descalificación

- ❌ Arrojar residuos fuera de las zonas autorizadas
- ❌ Dorsal no visible
- ❌ Conductas antideportivas o incívicas
- ❌ No prestar ayuda a otra participante en caso de necesidad
- ❌ Incumplimiento de cualquier punto del reglamento

## 🌍 Seguridad y Medio Ambiente

Las participantes deberán respetar el entorno natural y seguir las indicaciones de la organización. Para preservar el medio ambiente, todas las corredoras deberán **marcar de forma visible con el número de dorsal** cualquier residuo utilizado durante la prueba.

## 📞 Contacto de Emergencia

**+351 916 274 540** (guardar previamente en el móvil)

---

**🌊 ¡Ven a descubrir los impresionantes senderos de la costa norte de Madeira!**

*Organizado por: Asaltamontes Female*`,
    },
    {
      language: "fr",
      title: "Trail Atlânticas - Asaltamontes Madeira Female",
      city: "Porto da Cruz",
      metaTitle:
        "Trail Atlânticas 2026 | Asaltamontes Madeira Female | 14 Mars",
      metaDescription:
        "Trail Atlânticas 2026 - Épreuve exclusivement féminine à Madère. Trail 15km avec 630m D+ de Porto da Cruz à Machico. Organisation Asaltamontes Female.",
      description: `# 🏃‍♀️ Trail Atlânticas - Asaltamontes Madeira Female 2026

Le **Trail Atlânticas** est un événement sportif **exclusivement féminin**, de caractère individuel, organisé par **Asaltamontes Female**, qui se déroulera sur l'île de Madère (Portugal) le **14 mars 2026**.

## 🗺️ Le Parcours

L'épreuve propose un parcours **linéaire de 15 kilomètres** avec **630 mètres de dénivelé positif**, pouvant être réalisée en **course ou en marche/randonnée**, dans le respect absolu de l'environnement.

### Itinéraire
Le départ se fait à **Porto da Cruz**, sur la Rua da Praia en direction de Praia da Maiata, puis continue par des chemins et sentiers vers la zone de **Larano**. Le parcours suit la **Vereda do Larano** jusqu'au passage par **Boca do Risco**, où les athlètes descendent vers la **Levada do Caniçal**, la parcourant jusqu'à la descente vers la Santa Casa da Misericórdia de **Machico**. Les derniers mètres se font sur la route, Rua do Desembarcadouro, jusqu'à l'arrivée dans la **Baie de Machico**.

## 📊 Données Techniques

| Épreuve | Distance | D+ | D- | Temps le Plus Rapide | Temps Maximum |
|---------|----------|-----|-----|----------------------|---------------|
| Trail | 15 km | 630 m | 640 m | 1h15 | 4h30 |

## 🎯 Objectif

Cet événement vise à promouvoir le **sport féminin** à travers la pratique de la course ou de la marche dans la municipalité de Machico, dans des sites privilégiés pour le trail running sur la magnifique côte nord de Madère.

## 📋 Informations Générales

- **Date :** 14 mars 2026
- **Heure de Départ :** 09h00
- **Temps Maximum :** 4 heures et 30 minutes
- **Départ :** Porto da Cruz (Rua da Praia)
- **Arrivée :** Baie de Machico
- **Remise des Prix :** 14h30 près de l'arrivée

## 👩 Participation

Les **femmes à partir de 16 ans** peuvent participer, à condition de compléter correctement l'inscription et d'accepter intégralement le règlement.

## 🏆 Catégories

- **Baby :** 16 à 23 ans
- **Junior :** 24 à 29 ans
- **Senior :** 30 à 39 ans
- **Vétéranes A :** 40 à 49 ans
- **Vétéranes B :** 50 à 59 ans
- **Vétéranes C :** 60 à 69 ans
- **Premium :** 70 ans ou plus

## 🏅 Prix Spéciaux

### Classement Général
- Podium pour les 3 premières classées

### Classement Résidentes de Madère
- Les **3 premières femmes résidentes à Madère**, majeures, seront invitées à participer au **Festival Asaltamontes Female** (septembre 2026) en Espagne !

**Le prix comprend :**
- ✈️ Inscription au Festival Asaltamontes Female
- ✈️ Vol : Funchal – Porto – Funchal
- 🚌 Bus : Porto – Vigo – Porto
- 🏨 Hébergement le week-end des 26/27 septembre 2026

## 🎒 Matériel Obligatoire

Toutes les participantes doivent obligatoirement transporter :

- ✅ Dossard officiel visible
- ✅ Récipient personnel pour liquides (500ml)
- ✅ Alimentation de réserve
- ✅ Sifflet
- ✅ Téléphone portable opérationnel avec batterie suffisante

**Matériel Recommandé :**
- 🧥 Veste coupe-vent

⚠️ L'organisation pourra recommander ou exiger du matériel supplémentaire en fonction des conditions météorologiques ou de sécurité.

## 💧 Ravitaillements

Le parcours disposera de **ravitaillements liquides et solides** à un point intermédiaire et à l'arrivée.

⚠️ **Important :** Aucun gobelet ne sera fourni pour réduire les déchets. Chaque participante devra transporter son propre récipient.

## 🎁 L'Inscription Comprend

- ✅ Participation à l'épreuve
- ✅ Assurance responsabilité civile et assistance médicale à l'arrivée
- ✅ Dossard personnalisé avec puce de chronométrage électronique
- ✅ Ravitaillements sur le parcours et à l'arrivée
- ✅ Transport vers la zone de départ
- ✅ Transport depuis le parcours en cas d'abandon
- ✅ Sac de la participante et cadeaux
- ✅ Accès libre aux vestiaires et douches à l'arrivée
- ✅ Repas final

## 📦 Check-In / Secrétariat

- **Vendredi 13 mars 2026** - Horaire à confirmer

## ⚠️ Motifs de Disqualification

- ❌ Jeter des déchets hors des zones autorisées
- ❌ Dossard non visible
- ❌ Comportements antisportifs ou inciviques
- ❌ Ne pas porter assistance à une autre participante en cas de besoin
- ❌ Non-respect de tout point du règlement

## 🌍 Sécurité et Environnement

Les participantes doivent respecter l'environnement naturel et suivre les instructions de l'organisation. Pour préserver la nature, toutes les coureuses doivent **marquer visiblement avec leur numéro de dossard** tout déchet utilisé pendant l'épreuve.

## 📞 Contact d'Urgence

**+351 916 274 540** (à enregistrer à l'avance sur votre téléphone)

---

**🌊 Venez découvrir les magnifiques sentiers de la côte nord de Madère !**

*Organisé par : Asaltamontes Female*`,
    },
    {
      language: "de",
      title: "Trail Atlânticas - Asaltamontes Madeira Female",
      city: "Porto da Cruz",
      metaTitle:
        "Trail Atlânticas 2026 | Asaltamontes Madeira Female | 14. März",
      metaDescription:
        "Trail Atlânticas 2026 - Reines Frauen-Trailrunning-Event auf Madeira. 15km Trail mit 630m D+ von Porto da Cruz nach Machico. Organisation Asaltamontes Female.",
      description: `# 🏃‍♀️ Trail Atlânticas - Asaltamontes Madeira Female 2026

Der **Trail Atlânticas** ist ein **ausschließlich weibliches** Sportereignis, individueller Natur, organisiert von **Asaltamontes Female**, das am **14. März 2026** auf der Insel Madeira (Portugal) stattfinden wird.

## 🗺️ Die Strecke

Die Veranstaltung bietet eine **lineare 15-Kilometer-Strecke** mit **630 Metern positiver Höhendifferenz**, die durch **Laufen oder Wandern/Gehen** absolviert werden kann, stets mit vollem Respekt für die Umwelt.

### Route
Der Start erfolgt in **Porto da Cruz**, auf der Rua da Praia in Richtung Praia da Maiata, dann weiter auf Wegen und Pfaden zur Zone von **Larano**. Die Strecke folgt der **Vereda do Larano** bis zur Passage durch **Boca do Risco**, wo die Athletinnen zur **Levada do Caniçal** absteigen und ihr bis zum Abstieg zur Santa Casa da Misericórdia in **Machico** folgen. Die letzten Meter führen über die Straße, Rua do Desembarcadouro, bis zum Ziel in der **Bucht von Machico**.

## 📊 Technische Daten

| Rennen | Distanz | D+ | D- | Schnellste Zeit | Max. Zeit |
|--------|---------|-----|-----|-----------------|-----------|
| Trail | 15 km | 630 m | 640 m | 1h15 | 4h30 |

## 🎯 Ziel

Diese Veranstaltung zielt darauf ab, den **Frauensport** durch Laufen oder Wandern in der Gemeinde Machico zu fördern, an privilegierten Orten für Trailrunning an der atemberaubenden Nordküste Madeiras.

## 📋 Allgemeine Informationen

- **Datum:** 14. März 2026
- **Startzeit:** 09:00
- **Maximale Zeit:** 4 Stunden und 30 Minuten
- **Start:** Porto da Cruz (Rua da Praia)
- **Ziel:** Bucht von Machico
- **Siegerehrung:** 14:30 Uhr am Ziel

## 👩 Teilnahme

**Frauen ab 16 Jahren** können teilnehmen, sofern sie die Anmeldung korrekt ausfüllen und das Reglement vollständig akzeptieren.

## 🏆 Kategorien

- **Baby:** 16 bis 23 Jahre
- **Junior:** 24 bis 29 Jahre
- **Senior:** 30 bis 39 Jahre
- **Veteraninnen A:** 40 bis 49 Jahre
- **Veteraninnen B:** 50 bis 59 Jahre
- **Veteraninnen C:** 60 bis 69 Jahre
- **Premium:** 70 Jahre oder älter

## 🏅 Sonderpreise

### Gesamtwertung
- Podium für die ersten 3 Platzierten

### Wertung Einwohnerinnen Madeiras
- Die **ersten 3 volljährigen Frauen mit Wohnsitz auf Madeira** werden eingeladen, am **Festival Asaltamontes Female** (September 2026) in Spanien teilzunehmen!

**Der Preis beinhaltet:**
- ✈️ Anmeldung zum Festival Asaltamontes Female
- ✈️ Flug: Funchal – Porto – Funchal
- 🚌 Bus: Porto – Vigo – Porto
- 🏨 Unterkunft am Wochenende des 26./27. September 2026

## 🎒 Pflichtausrüstung

Alle Teilnehmerinnen müssen folgendes mitführen:

- ✅ Offizielles Startnummer sichtbar
- ✅ Eigener Behälter für Flüssigkeiten (500ml)
- ✅ Reserveverpflegung
- ✅ Pfeife
- ✅ Funktionsfähiges Mobiltelefon mit ausreichend Akku

**Empfohlene Ausrüstung:**
- 🧥 Windjacke

⚠️ Die Organisation kann je nach Wetter- oder Sicherheitsbedingungen zusätzliche Ausrüstung empfehlen oder verlangen.

## 💧 Verpflegungsstationen

Die Strecke verfügt über **Flüssigkeits- und Festverpflegung** an einem Zwischenpunkt und im Ziel.

⚠️ **Wichtig:** Es werden keine Becher bereitgestellt, um Abfall zu reduzieren. Jede Teilnehmerin muss ihren eigenen Behälter mitbringen.

## 🎁 Die Anmeldung Beinhaltet

- ✅ Teilnahme am Rennen
- ✅ Haftpflichtversicherung und medizinische Betreuung im Zielbereich
- ✅ Personalisierte Startnummer mit elektronischem Timing-Chip
- ✅ Verpflegungsstationen auf der Strecke und im Ziel
- ✅ Transport zum Startbereich
- ✅ Transport von der Strecke bei Aufgabe
- ✅ Teilnehmerinnen-Tasche und Geschenke
- ✅ Freier Zugang zu Umkleiden und Duschen im Ziel
- ✅ Abschlussmahlzeit

## 📦 Check-In / Wettkampfbüro

- **Freitag, 13. März 2026** - Zeitplan wird noch bestätigt

## ⚠️ Gründe für Disqualifikation

- ❌ Müll außerhalb autorisierter Bereiche entsorgen
- ❌ Startnummer nicht sichtbar
- ❌ Unsportliches oder ungebührliches Verhalten
- ❌ Keine Hilfe für andere Teilnehmerinnen in Not leisten
- ❌ Nichteinhalten von Reglementsbestimmungen

## 🌍 Sicherheit und Umwelt

Teilnehmerinnen müssen die natürliche Umgebung respektieren und allen Anweisungen der Organisation folgen. Um die Natur zu schützen, müssen alle Läuferinnen jeglichen während des Rennens verwendeten Abfall **sichtbar mit ihrer Startnummer markieren**.

## 📞 Notfallkontakt

**+351 916 274 540** (vorher im Telefon speichern)

---

**🌊 Entdecken Sie die atemberaubenden Trails der Nordküste Madeiras!**

*Organisiert von: Asaltamontes Female*`,
    },
    {
      language: "it",
      title: "Trail Atlânticas - Asaltamontes Madeira Female",
      city: "Porto da Cruz",
      metaTitle:
        "Trail Atlânticas 2026 | Asaltamontes Madeira Female | 14 Marzo",
      metaDescription:
        "Trail Atlânticas 2026 - Gara esclusivamente femminile a Madeira. Trail 15km con 630m D+ da Porto da Cruz a Machico. Organizzazione Asaltamontes Female.",
      description: `# 🏃‍♀️ Trail Atlânticas - Asaltamontes Madeira Female 2026

Il **Trail Atlânticas** è un evento sportivo **esclusivamente femminile**, di carattere individuale, organizzato da **Asaltamontes Female**, che si terrà sull'isola di Madeira (Portogallo) il **14 marzo 2026**.

## 🗺️ Il Percorso

La gara presenta un percorso **lineare di 15 chilometri** con **630 metri di dislivello positivo**, che può essere completato **correndo o camminando/in escursione**, nel pieno rispetto dell'ambiente.

### Itinerario
La partenza avviene a **Porto da Cruz**, su Rua da Praia in direzione di Praia da Maiata, proseguendo poi per sentieri e mulattiere verso la zona di **Larano**. Il percorso segue la **Vereda do Larano** fino al passaggio per **Boca do Risco**, dove le atlete scendono verso la **Levada do Caniçal**, percorrendola fino alla discesa verso la Santa Casa da Misericórdia di **Machico**. Gli ultimi metri si svolgono su strada, in Rua do Desembarcadouro, fino al traguardo nella **Baia di Machico**.

## 📊 Dati Tecnici

| Gara | Distanza | D+ | D- | Tempo Più Veloce | Tempo Massimo |
|------|----------|-----|-----|------------------|---------------|
| Trail | 15 km | 630 m | 640 m | 1h15 | 4h30 |

## 🎯 Obiettivo

Questo evento mira a promuovere lo **sport femminile** attraverso la pratica della corsa o camminata nel comune di Machico, in luoghi privilegiati per il trail running sulla splendida costa nord di Madeira.

## 📋 Informazioni Generali

- **Data:** 14 marzo 2026
- **Ora di Partenza:** 09:00
- **Tempo Massimo:** 4 ore e 30 minuti
- **Partenza:** Porto da Cruz (Rua da Praia)
- **Arrivo:** Baia di Machico
- **Premiazione:** 14:30 vicino al traguardo

## 👩 Partecipazione

Possono partecipare **donne a partire dai 16 anni**, a condizione che completino correttamente l'iscrizione e accettino integralmente il regolamento.

## 🏆 Categorie

- **Baby:** 16 a 23 anni
- **Junior:** 24 a 29 anni
- **Senior:** 30 a 39 anni
- **Veterane A:** 40 a 49 anni
- **Veterane B:** 50 a 59 anni
- **Veterane C:** 60 a 69 anni
- **Premium:** 70 anni o più

## 🏅 Premi Speciali

### Classifica Generale
- Podio per le prime 3 classificate

### Classifica Residenti di Madeira
- Le **prime 3 donne maggiorenni residenti a Madeira** saranno invitate a partecipare al **Festival Asaltamontes Female** (settembre 2026) in Spagna!

**Il premio include:**
- ✈️ Iscrizione al Festival Asaltamontes Female
- ✈️ Volo: Funchal – Porto – Funchal
- 🚌 Autobus: Porto – Vigo – Porto
- 🏨 Alloggio nel weekend del 26/27 settembre 2026

## 🎒 Materiale Obbligatorio

Tutte le partecipanti devono obbligatoriamente portare:

- ✅ Pettorale ufficiale visibile
- ✅ Contenitore personale per liquidi (500ml)
- ✅ Alimentazione di riserva
- ✅ Fischietto
- ✅ Telefono cellulare funzionante con batteria sufficiente

**Materiale Consigliato:**
- 🧥 Giacca antivento

⚠️ L'organizzazione potrà raccomandare o richiedere materiale aggiuntivo in base alle condizioni meteorologiche o di sicurezza.

## 💧 Ristori

Il percorso avrà **ristori con liquidi e solidi** in un punto intermedio e all'arrivo.

⚠️ **Importante:** Non saranno forniti bicchieri per ridurre i rifiuti. Ogni partecipante dovrà portare il proprio contenitore.

## 🎁 L'Iscrizione Include

- ✅ Partecipazione alla gara
- ✅ Assicurazione responsabilità civile e assistenza medica all'arrivo
- ✅ Pettorale personalizzato con chip di cronometraggio elettronico
- ✅ Ristori lungo il percorso e all'arrivo
- ✅ Trasporto alla zona di partenza
- ✅ Trasporto dal percorso in caso di ritiro
- ✅ Sacca della partecipante e omaggi
- ✅ Accesso libero a spogliatoi e docce all'arrivo
- ✅ Pasto finale

## 📦 Check-In / Segreteria

- **Venerdì 13 marzo 2026** - Orario da confermare

## ⚠️ Motivi di Squalifica

- ❌ Gettare rifiuti fuori dalle zone autorizzate
- ❌ Pettorale non visibile
- ❌ Comportamenti antisportivi o incivili
- ❌ Non prestare aiuto a un'altra partecipante in caso di necessità
- ❌ Mancato rispetto di qualsiasi punto del regolamento

## 🌍 Sicurezza e Ambiente

Le partecipanti devono rispettare l'ambiente naturale e seguire le istruzioni dell'organizzazione. Per preservare la natura, tutte le corridrici devono **contrassegnare visibilmente con il numero di pettorale** qualsiasi rifiuto utilizzato durante la gara.

## 📞 Contatto di Emergenza

**+351 916 274 540** (salvare in anticipo sul telefono)

---

**🌊 Vieni a scoprire gli splendidi sentieri della costa nord di Madeira!**

*Organizzato da: Asaltamontes Female*`,
    },
  ];

  console.log("📝 Creating translations for all 6 languages...");

  for (const t of translations) {
    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId: event.id, language: t.language } },
      update: {
        title: t.title,
        description: t.description,
        city: t.city,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      },
      create: {
        eventId: event.id,
        language: t.language,
        title: t.title,
        description: t.description,
        city: t.city,
        metaTitle: t.metaTitle,
        metaDescription: t.metaDescription,
      },
    });
    console.log(`   ✅ Translation ${t.language.toUpperCase()} created`);
  }

  // Step 4: Create event variants
  console.log("🏃‍♀️ Creating event variants...");

  const variants = [
    {
      name: "Trail 15km (Corrida)",
      distanceKm: 15,
      elevationGainM: 630,
      elevationLossM: 640,
      startTime: "09:00",
      cutoffTimeHours: 4.5,
      description:
        "Prova de trail running de 15km entre Porto da Cruz e Machico",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-12-26T00:00:00.000Z"),
          endDate: new Date("2026-02-15T23:59:59.000Z"),
          price: 35.0,
          currency: "EUR" as const,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-02-16T00:00:00.000Z"),
          endDate: new Date("2026-03-07T23:59:59.000Z"),
          price: 40.0,
          currency: "EUR" as const,
        },
      ],
      translations: {
        pt: {
          name: "Trail 15km (Corrida)",
          description:
            "Prova de trail running de 15km entre Porto da Cruz e Machico",
        },
        en: {
          name: "Trail 15km (Running)",
          description: "15km trail running race from Porto da Cruz to Machico",
        },
        es: {
          name: "Trail 15km (Carrera)",
          description: "Carrera de trail de 15km entre Porto da Cruz y Machico",
        },
        fr: {
          name: "Trail 15km (Course)",
          description: "Course de trail de 15km entre Porto da Cruz et Machico",
        },
        de: {
          name: "Trail 15km (Lauf)",
          description:
            "15km Trailrunning-Rennen von Porto da Cruz nach Machico",
        },
        it: {
          name: "Trail 15km (Corsa)",
          description:
            "Gara di trail running di 15km da Porto da Cruz a Machico",
        },
      },
    },
    {
      name: "Trail 15km (Marcha / Caminhada)",
      distanceKm: 15,
      elevationGainM: 630,
      elevationLossM: 640,
      startTime: "09:00",
      cutoffTimeHours: 4.5,
      description: "Marcha/Caminhada de 15km entre Porto da Cruz e Machico",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-12-26T00:00:00.000Z"),
          endDate: new Date("2026-02-15T23:59:59.000Z"),
          price: 35.0,
          currency: "EUR" as const,
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-02-16T00:00:00.000Z"),
          endDate: new Date("2026-03-07T23:59:59.000Z"),
          price: 40.0,
          currency: "EUR" as const,
        },
      ],
      translations: {
        pt: {
          name: "Trail 15km (Marcha / Caminhada)",
          description: "Marcha/Caminhada de 15km entre Porto da Cruz e Machico",
        },
        en: {
          name: "Trail 15km (Walking / Hiking)",
          description:
            "15km walking/hiking event from Porto da Cruz to Machico",
        },
        es: {
          name: "Trail 15km (Marcha / Caminata)",
          description: "Marcha/Caminata de 15km entre Porto da Cruz y Machico",
        },
        fr: {
          name: "Trail 15km (Marche / Randonnée)",
          description:
            "Marche/Randonnée de 15km entre Porto da Cruz et Machico",
        },
        de: {
          name: "Trail 15km (Wandern / Gehen)",
          description: "15km Wanderung von Porto da Cruz nach Machico",
        },
        it: {
          name: "Trail 15km (Marcia / Camminata)",
          description: "Marcia/Camminata di 15km da Porto da Cruz a Machico",
        },
      },
    },
  ];

  for (const variantData of variants) {
    const {
      pricingPhases,
      translations: variantTranslations,
      ...variantInfo
    } = variantData;

    const variant = await prisma.eventVariant.create({
      data: {
        ...variantInfo,
        eventId: event.id,
      },
    });

    console.log(`   ✅ Created variant: ${variant.name}`);

    // Create variant translations
    for (const [lang, trans] of Object.entries(variantTranslations)) {
      await prisma.eventVariantTranslation.create({
        data: {
          variantId: variant.id,
          language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
          name: trans.name,
          description: trans.description,
        },
      });
    }

    // Create pricing phases linked to eventId (NOT variantId)
    for (const phase of pricingPhases) {
      await prisma.pricingPhase.create({
        data: {
          eventId: event.id,
          name: `${variant.name} - ${phase.name}`,
          startDate: phase.startDate,
          endDate: phase.endDate,
          price: phase.price,
          currency: phase.currency,
        },
      });
    }
    console.log(`   - Created ${pricingPhases.length} pricing phases`);
  }

  // Step 5: Create FAQs
  console.log("❓ Creating FAQs...");

  const faqs = [
    {
      order: 1,
      question: "Quem pode participar?",
      answer:
        "Podem participar mulheres a partir dos 16 anos de idade, desde que completem corretamente a inscrição e aceitem integralmente o regulamento.",
      translations: {
        pt: {
          question: "Quem pode participar?",
          answer:
            "Podem participar mulheres a partir dos 16 anos de idade, desde que completem corretamente a inscrição e aceitem integralmente o regulamento.",
        },
        en: {
          question: "Who can participate?",
          answer:
            "Women aged 16 and over may participate, provided they correctly complete the registration process and fully accept the regulations.",
        },
        es: {
          question: "¿Quién puede participar?",
          answer:
            "Pueden participar mujeres a partir de los 16 años de edad, siempre que completen correctamente la inscripción y acepten íntegramente el reglamento.",
        },
        fr: {
          question: "Qui peut participer ?",
          answer:
            "Les femmes à partir de 16 ans peuvent participer, à condition de compléter correctement l'inscription et d'accepter intégralement le règlement.",
        },
        de: {
          question: "Wer kann teilnehmen?",
          answer:
            "Frauen ab 16 Jahren können teilnehmen, sofern sie die Anmeldung korrekt ausfüllen und das Reglement vollständig akzeptieren.",
        },
        it: {
          question: "Chi può partecipare?",
          answer:
            "Possono partecipare donne a partire dai 16 anni, a condizione che completino correttamente l'iscrizione e accettino integralmente il regolamento.",
        },
      },
    },
    {
      order: 2,
      question: "Qual o material obrigatório?",
      answer:
        "Dorsal oficial visível, recipiente próprio para líquidos (500ml), alimentação de reserva, apito e telemóvel operacional com bateria suficiente.",
      translations: {
        pt: {
          question: "Qual o material obrigatório?",
          answer:
            "Dorsal oficial visível, recipiente próprio para líquidos (500ml), alimentação de reserva, apito e telemóvel operacional com bateria suficiente.",
        },
        en: {
          question: "What is the mandatory equipment?",
          answer:
            "Official bib clearly visible, personal liquid container (500ml), reserve food, whistle, and operational mobile phone with sufficient battery.",
        },
        es: {
          question: "¿Cuál es el material obligatorio?",
          answer:
            "Dorsal oficial visible, recipiente propio para líquidos (500ml), alimentación de reserva, silbato y teléfono móvil operativo con batería suficiente.",
        },
        fr: {
          question: "Quel est le matériel obligatoire ?",
          answer:
            "Dossard officiel visible, récipient personnel pour liquides (500ml), alimentation de réserve, sifflet et téléphone portable opérationnel avec batterie suffisante.",
        },
        de: {
          question: "Welche Ausrüstung ist Pflicht?",
          answer:
            "Sichtbare offizielle Startnummer, eigener Behälter für Flüssigkeiten (500ml), Reserveverpflegung, Pfeife und funktionsfähiges Mobiltelefon mit ausreichend Akku.",
        },
        it: {
          question: "Qual è il materiale obbligatorio?",
          answer:
            "Pettorale ufficiale visibile, contenitore personale per liquidi (500ml), alimentazione di riserva, fischietto e telefono cellulare funzionante con batteria sufficiente.",
        },
      },
    },
    {
      order: 3,
      question: "Há reembolso da inscrição?",
      answer:
        "Não serão aceites devoluções de dorsais em nenhuma circunstância. Qualquer alteração de nome no dorsal terá um custo adicional de 3€, mediante pagamento prévio.",
      translations: {
        pt: {
          question: "Há reembolso da inscrição?",
          answer:
            "Não serão aceites devoluções de dorsais em nenhuma circunstância. Qualquer alteração de nome no dorsal terá um custo adicional de 3€, mediante pagamento prévio.",
        },
        en: {
          question: "Is registration refundable?",
          answer:
            "Bib refunds will not be accepted under any circumstances. Any change of name on the bib will incur an additional cost of €3, subject to prior payment.",
        },
        es: {
          question: "¿Hay reembolso de la inscripción?",
          answer:
            "No se aceptarán devoluciones de dorsales en ninguna circunstancia. Cualquier cambio de nombre en el dorsal tendrá un coste adicional de 3€, previo pago.",
        },
        fr: {
          question: "L'inscription est-elle remboursable ?",
          answer:
            "Aucun remboursement de dossard ne sera accepté. Tout changement de nom sur le dossard entraînera un coût supplémentaire de 3€, sous réserve de paiement préalable.",
        },
        de: {
          question: "Ist die Anmeldung erstattungsfähig?",
          answer:
            "Rückerstattungen von Startnummern werden unter keinen Umständen akzeptiert. Jede Namensänderung auf der Startnummer kostet zusätzlich 3€, vorbehaltlich vorheriger Zahlung.",
        },
        it: {
          question: "L'iscrizione è rimborsabile?",
          answer:
            "Non saranno accettati rimborsi dei pettorali in nessuna circostanza. Qualsiasi cambio di nome sul pettorale comporterà un costo aggiuntivo di 3€, previo pagamento.",
        },
      },
    },
    {
      order: 4,
      question: "O que está incluído na inscrição?",
      answer:
        "Participação na prova, seguro de responsabilidade civil, peitoral personalizado com chip, abastecimentos, transporte para a partida, bolsa da participante, acesso a balneários e refeição final.",
      translations: {
        pt: {
          question: "O que está incluído na inscrição?",
          answer:
            "Participação na prova, seguro de responsabilidade civil, peitoral personalizado com chip, abastecimentos, transporte para a partida, bolsa da participante, acesso a balneários e refeição final.",
        },
        en: {
          question: "What is included in the registration?",
          answer:
            "Race participation, civil liability insurance, personalized bib with chip, aid stations, transport to start, participant bag, access to changing rooms, and post-race meal.",
        },
        es: {
          question: "¿Qué incluye la inscripción?",
          answer:
            "Participación en la prueba, seguro de responsabilidad civil, dorsal personalizado con chip, avituallamientos, transporte a la salida, bolsa de participante, acceso a vestuarios y comida final.",
        },
        fr: {
          question: "Qu'est-ce qui est inclus dans l'inscription ?",
          answer:
            "Participation à l'épreuve, assurance responsabilité civile, dossard personnalisé avec puce, ravitaillements, transport vers le départ, sac de la participante, accès aux vestiaires et repas final.",
        },
        de: {
          question: "Was ist in der Anmeldung enthalten?",
          answer:
            "Rennteilnahme, Haftpflichtversicherung, personalisierte Startnummer mit Chip, Verpflegungsstationen, Transport zum Start, Teilnehmertasche, Zugang zu Umkleiden und Abschlussmahlzeit.",
        },
        it: {
          question: "Cosa è incluso nell'iscrizione?",
          answer:
            "Partecipazione alla gara, assicurazione responsabilità civile, pettorale personalizzato con chip, ristori, trasporto alla partenza, sacca partecipante, accesso agli spogliatoi e pasto finale.",
        },
      },
    },
    {
      order: 5,
      question: "Qual o prémio especial para residentes na Madeira?",
      answer:
        "As 3 primeiras mulheres residentes na Madeira, maiores de idade, serão convidadas a participar no Festival Asaltamontes Female em Espanha, com voo, autocarro e alojamento incluídos.",
      translations: {
        pt: {
          question: "Qual o prémio especial para residentes na Madeira?",
          answer:
            "As 3 primeiras mulheres residentes na Madeira, maiores de idade, serão convidadas a participar no Festival Asaltamontes Female em Espanha, com voo, autocarro e alojamento incluídos.",
        },
        en: {
          question: "What is the special prize for Madeira residents?",
          answer:
            "The first 3 adult women residing in Madeira will be invited to participate in the Asaltamontes Female Festival in Spain, with flight, bus, and accommodation included.",
        },
        es: {
          question: "¿Cuál es el premio especial para residentes en Madeira?",
          answer:
            "Las 3 primeras mujeres residentes en Madeira, mayores de edad, serán invitadas a participar en el Festival Asaltamontes Female en España, con vuelo, autobús y alojamiento incluidos.",
        },
        fr: {
          question: "Quel est le prix spécial pour les résidentes de Madère ?",
          answer:
            "Les 3 premières femmes majeures résidentes à Madère seront invitées à participer au Festival Asaltamontes Female en Espagne, avec vol, bus et hébergement inclus.",
        },
        de: {
          question: "Was ist der Sonderpreis für Einwohnerinnen von Madeira?",
          answer:
            "Die ersten 3 volljährigen Frauen mit Wohnsitz auf Madeira werden zum Asaltamontes Female Festival in Spanien eingeladen, mit Flug, Bus und Unterkunft inklusive.",
        },
        it: {
          question: "Qual è il premio speciale per le residenti di Madeira?",
          answer:
            "Le prime 3 donne maggiorenni residenti a Madeira saranno invitate a partecipare al Festival Asaltamontes Female in Spagna, con volo, autobus e alloggio inclusi.",
        },
      },
    },
    {
      order: 6,
      question: "Haverá abastecimentos na prova?",
      answer:
        "Sim, haverá abastecimento líquido e sólido num ponto intermédio e na meta. Não serão disponibilizados copos - cada participante deve trazer o seu próprio recipiente.",
      translations: {
        pt: {
          question: "Haverá abastecimentos na prova?",
          answer:
            "Sim, haverá abastecimento líquido e sólido num ponto intermédio e na meta. Não serão disponibilizados copos - cada participante deve trazer o seu próprio recipiente.",
        },
        en: {
          question: "Will there be aid stations during the race?",
          answer:
            "Yes, there will be liquid and solid aid stations at an intermediate point and at the finish. No cups will be provided - each participant must bring their own container.",
        },
        es: {
          question: "¿Habrá avituallamientos en la prueba?",
          answer:
            "Sí, habrá avituallamiento líquido y sólido en un punto intermedio y en la meta. No se facilitarán vasos - cada participante debe traer su propio recipiente.",
        },
        fr: {
          question: "Y aura-t-il des ravitaillements pendant l'épreuve ?",
          answer:
            "Oui, il y aura des ravitaillements liquides et solides à un point intermédiaire et à l'arrivée. Aucun gobelet ne sera fourni - chaque participante doit apporter son propre récipient.",
        },
        de: {
          question: "Wird es Verpflegungsstationen während des Rennens geben?",
          answer:
            "Ja, es wird Flüssigkeits- und Festverpflegung an einem Zwischenpunkt und im Ziel geben. Es werden keine Becher bereitgestellt - jede Teilnehmerin muss ihren eigenen Behälter mitbringen.",
        },
        it: {
          question: "Ci saranno ristori durante la gara?",
          answer:
            "Sì, ci saranno ristori con liquidi e solidi in un punto intermedio e all'arrivo. Non saranno forniti bicchieri - ogni partecipante deve portare il proprio contenitore.",
        },
      },
    },
  ];

  for (const faqData of faqs) {
    const { translations: faqTranslations, ...faqInfo } = faqData;

    const faq = await prisma.eventFAQ.create({
      data: {
        ...faqInfo,
        eventId: event.id,
      },
    });

    // Create FAQ translations
    for (const [lang, trans] of Object.entries(faqTranslations)) {
      await prisma.eventFAQTranslation.create({
        data: {
          faqId: faq.id,
          language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
          question: trans.question,
          answer: trans.answer,
        },
      });
    }
  }

  console.log(`   ✅ Created ${faqs.length} FAQs with translations`);

  console.log("\n🎉 Trail Atlânticas 2026 seeded successfully!");
  console.log(`   📍 Event: ${event.title}`);
  console.log(`   🔗 Slug: ${event.slug}`);
  console.log(`   📅 Date: ${event.startDate.toISOString().split("T")[0]}`);
  console.log(`   📍 Location: ${event.city}, ${event.country}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Trail Atlânticas:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
