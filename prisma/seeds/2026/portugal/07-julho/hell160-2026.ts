import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding HELL160 – Shadows and Dust 2026...");

  const slug = "hell160-shadows-and-dust-2026";

  // Upsert Event
  const event = await prisma.event.upsert({
    where: { slug },
    update: {
      title: "HELL160 – Shadows and Dust",
      description:
        "Ultra trail organizado pela Associação Desportiva e Cultural HELL160, em pleno Alentejo. Uma prova exigente com condições de calor intenso, isolamento e resistência física e mental. Homenagem ao ultrarunning e aos valores de superação.",
      startDate: new Date("2026-07-03T21:00:00Z"),
      endDate: new Date("2026-07-05T20:00:00Z"),
      registrationDeadline: new Date("2026-06-15T23:59:59Z"),
      city: "Serpa",
      country: "Portugal",
      latitude: 37.91704802020885,
      longitude: -7.477666058780105,
      sportTypes: [SportType.TRAIL, SportType.BTT],
      externalUrl: "https://maps.app.goo.gl/Vz2Ammbao5VSy1ii7",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop",
    },
    create: {
      slug,
      title: "HELL160 – Shadows and Dust",
      description:
        "Ultra trail organizado pela Associação Desportiva e Cultural HELL160, em pleno Alentejo. Uma prova exigente com condições de calor intenso, isolamento e resistência física e mental. Homenagem ao ultrarunning e aos valores de superação.",
      startDate: new Date("2026-07-03T21:00:00Z"),
      endDate: new Date("2026-07-05T20:00:00Z"),
      registrationDeadline: new Date("2026-06-15T23:59:59Z"),
      city: "Serpa",
      country: "Portugal",
      latitude: 37.91704802020885,
      longitude: -7.477666058780105,
      sportTypes: [SportType.TRAIL, SportType.BTT],
      externalUrl: "https://maps.app.goo.gl/Vz2Ammbao5VSy1ii7",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop",
    },
  });

  console.log(`✅ Event upserted with ID: ${event.id}`);

  // Upsert Translations for all 6 languages
  const translations = {
    pt: {
      title: "HELL160 – Shadows and Dust",
      description: `O **HELL160 – Shadows and Dust** é um ultra trail organizado pela **Associação Desportiva e Cultural HELL160**, nos dias **3, 4 e 5 de julho de 2026**, em pleno Alentejo, com partida e chegada em **A-do-Pinto, Serpa**.

Uma prova de homenagem ao ultrarunning e aos valores de superação, com condições exigentes de **calor intenso, isolamento e resistência física e mental**.

## 🏔️ Sobre a Prova

O HELL160 percorre trilhos circulares marcados com sinalética **GR15 / GR15.2**, em percursos de elevada dificuldade técnica e mental. Os atletas encontrarão:

- **Calor extremo alentejano** em pleno verão
- **Terreno isolado** com longos troços sem apoio
- **Paisagens únicas** do interior alentejano
- **Desafio mental** de resistência e superação

Os finishers do HELL160 recebem o seu nome gravado no **Muro dos Legendários**, um tributo permanente aos que completam o desafio.

## 🏃 Provas Disponíveis

### HELL160 – Solo (100 vagas)
- **Distância:** ~164,6 km
- **Desnível Positivo:** +2.648 m
- **Tempo Limite:** 36 horas
- **Partida:** Sexta-feira, 3/07, às 22h00
- **Idade Mínima:** 18 anos
- **Prémio Especial:** Troféu, pulseira artesanal e nome no Muro dos Legendários

### HELL100 – Solo (100 vagas)
- **Distância:** ~134 km
- **Desnível Positivo:** +1.340 m
- **Tempo Limite:** 24 horas
- **Partida:** Sábado, 4/07
- **Idade Mínima:** 18 anos

### HELL100 – Duplas (25 vagas)
- **Distância:** ~134 km (corrida em dupla)
- **Desnível Positivo:** +1.340 m
- **Tempo Limite:** 24 horas
- **Partida:** Sábado, 4/07
- **Idade Mínima:** 18 anos

### HELL100 – Equipas (10 vagas)
- **Distância:** ~134 km
- **Desnível Positivo:** +1.340 m
- **Tempo Limite:** 24 horas
- **Formato:** 5 elementos, mínimo 3 a terminar juntos
- **Partida:** Sábado, 4/07
- **Idade Mínima:** 18 anos

### HELL100 – Estafetas 2 Elementos (10 vagas)
- **Distância:** ~134 km (dividido entre 2 atletas)
- **Desnível Positivo:** +1.340 m
- **Tempo Limite:** 24 horas
- **Partida:** Sábado, 4/07
- **Idade Mínima:** 18 anos

### HELL100 – Estafetas 4 Elementos (20 vagas)
- **Distância:** ~134 km (dividido entre 4 atletas)
- **Desnível Positivo:** +1.340 m
- **Tempo Limite:** 24 horas
- **Partida:** Sábado, 4/07
- **Idade Mínima:** 18 anos

### HELL100 – Bike (100 vagas)
- **Distância:** ~134 km
- **Desnível Positivo:** +1.340 m
- **Tempo Limite:** 12 horas
- **Partida:** Sábado, 4/07
- **Idade Mínima:** 18 anos
- **Nota:** Bicicletas elétricas **não permitidas**

## 🎒 Incluído na Inscrição

- Dorsal e chip de cronometragem
- **Tracker GPS** para seguimento em tempo real
- 13 pontos de abastecimento
- 3 Bases de Vida (com apoio externo autorizado)
- Seguro desportivo
- Medalha de finisher
- Massagem pós-prova
- Banhos
- Refeições finais
- Nome no **Muro dos Legendários** (finishers HELL160)

## 🎒 Material Obrigatório

- Mochila ou cinto de hidratação (mínimo 1,5L)
- Copo reutilizável
- Frontal com bateria extra
- Manta térmica
- Telemóvel carregado
- GPS ou relógio com GPS
- Dorsal sempre visível

⚠️ **Falta de material obrigatório = Desclassificação**

## 🚰 Abastecimentos

- **13 pontos de abastecimento** ao longo do percurso
- **3 Bases de Vida** com apoio completo
- Apoio externo **apenas autorizado nas Bases de Vida**
- Bastões só permitidos com autorização da organização

## 🏆 Prémios

- **Troféus** para vencedores absolutos
- **Finishers HELL160** recebem:
  - Troféu especial
  - Pulseira artesanal
  - Nome gravado no **Muro dos Legendários**
- Sem prémios por escalões

## 📋 Programa

### Sexta-feira, 3 de Julho de 2026
- Secretariado e entrega de dorsais
- Briefing técnico
- Pasta party
- Cerimónia de abertura
- **22h00** - Partida HELL160 Solo

### Sábado, 4 de Julho de 2026
- Partidas HELL100 (todas as categorias: Solo, Duplas, Equipas, Estafetas, Bike)

### Domingo, 5 de Julho de 2026
- Chegadas finais
- Almoço de convívio
- Entrega de prémios

## 📝 Inscrições

- **Plataforma:** Online (site oficial da prova)
- **Encerram:** 15 de junho de 2026
- **Não transmissíveis**
- **Idade Mínima:** 18 anos
- **Obrigatório:** Termo de responsabilidade + certificado médico

### 📄 Documentação Obrigatória

O **Termo de Responsabilidade** e **Certificado Médico** deverão ser:
- Devidamente preenchidos
- Entregues até ao levantamento do dorsal
- Ou enviados via email para: **hell160.organizacao@gmail.com**

⚠️ **Caso algum documento não seja entregue ou não esteja corretamente preenchido, o atleta não ficará apto para participar na prova.**

## ❌ Política de Reembolsos

- **Não há devoluções**, exceto cancelamento da prova pela organização
- Pagamento não regularizado até ao prazo → Inscrição cancelada

## 🚨 Segurança

- Equipas médicas e bombeiros ao longo do percurso
- Comunicação por tracker GPS
- Abandono só em zonas autorizadas
- GPS obrigatório para seguimento

---

**Uma prova extrema para atletas que procuram superar os seus limites no coração do Alentejo! 🔥🏃**`,
      city: "Serpa",
      metaTitle: "HELL160 – Shadows and Dust 2026 | Serpa, Beja | 3-5 Julho",
      metaDescription:
        "HELL160 – Shadows and Dust 2026 a 3-5 de julho em A-do-Pinto, Serpa, Beja. Ultra trail de 164km e 134km. HELL160 Solo, HELL100 Solo/Duplas/Equipas/Estafetas/Bike. Inscrições até 15 junho.",
    },
    en: {
      title: "HELL160 – Shadows and Dust",
      description: `**HELL160 – Shadows and Dust** is an ultra trail organized by **Associação Desportiva e Cultural HELL160**, taking place on **July 3, 4, and 5, 2026**, in the heart of Alentejo, with start and finish in **A-do-Pinto, Serpa**.

A tribute race to ultrarunning and overcoming values, with demanding conditions of **intense heat, isolation, and physical and mental endurance**.

## 🏔️ About the Race

HELL160 runs through circular trails marked with **GR15 / GR15.2** signage, in routes of high technical and mental difficulty. Athletes will face:

- **Extreme Alentejo heat** in the middle of summer
- **Isolated terrain** with long sections without support
- **Unique landscapes** of inland Alentejo
- **Mental challenge** of endurance and overcoming

HELL160 finishers receive their name engraved on the **Wall of Legends**, a permanent tribute to those who complete the challenge.

## 🏃 Available Races

### HELL160 – Solo (100 spots)
- **Distance:** ~164.6 km
- **Elevation Gain:** +2,648 m
- **Time Limit:** 36 hours
- **Start:** Friday, July 3, at 10:00 PM
- **Minimum Age:** 18 years
- **Special Prize:** Trophy, handmade bracelet, and name on Wall of Legends

### HELL100 – Solo (100 spots)
- **Distance:** ~134 km
- **Elevation Gain:** +1,340 m
- **Time Limit:** 24 hours
- **Start:** Saturday, July 4
- **Minimum Age:** 18 years

### HELL100 – Pairs (25 spots)
- **Distance:** ~134 km (run in pairs)
- **Elevation Gain:** +1,340 m
- **Time Limit:** 24 hours
- **Start:** Saturday, July 4
- **Minimum Age:** 18 years

### HELL100 – Teams (10 spots)
- **Distance:** ~134 km
- **Elevation Gain:** +1,340 m
- **Time Limit:** 24 hours
- **Format:** 5 members, minimum 3 to finish together
- **Start:** Saturday, July 4
- **Minimum Age:** 18 years

### HELL100 – Relay 2 Members (10 spots)
- **Distance:** ~134 km (divided between 2 athletes)
- **Elevation Gain:** +1,340 m
- **Time Limit:** 24 hours
- **Start:** Saturday, July 4
- **Minimum Age:** 18 years

### HELL100 – Relay 4 Members (20 spots)
- **Distance:** ~134 km (divided between 4 athletes)
- **Elevation Gain:** +1,340 m
- **Time Limit:** 24 hours
- **Start:** Saturday, July 4
- **Minimum Age:** 18 years

### HELL100 – Bike (100 spots)
- **Distance:** ~134 km
- **Elevation Gain:** +1,340 m
- **Time Limit:** 12 hours
- **Start:** Saturday, July 4
- **Minimum Age:** 18 years
- **Note:** Electric bicycles **not allowed**

## 🎒 Included in Registration

- Race number and timing chip
- **GPS tracker** for real-time tracking
- 13 aid stations
- 3 Life Bases (with authorized external support)
- Sports insurance
- Finisher medal
- Post-race massage
- Showers
- Final meals
- Name on **Wall of Legends** (HELL160 finishers)

## 🎒 Mandatory Equipment

- Hydration backpack or belt (minimum 1.5L)
- Reusable cup
- Headlamp with extra battery
- Thermal blanket
- Charged mobile phone
- GPS or GPS watch
- Race number always visible

⚠️ **Missing mandatory equipment = Disqualification**

## 🚰 Aid Stations

- **13 aid stations** along the route
- **3 Life Bases** with full support
- External support **only authorized at Life Bases**
- Poles only allowed with organization authorization

## 🏆 Prizes

- **Trophies** for absolute winners
- **HELL160 Finishers** receive:
  - Special trophy
  - Handmade bracelet
  - Name engraved on **Wall of Legends**
- No age group prizes

## 📋 Schedule

### Friday, July 3, 2026
- Registration and race number pickup
- Technical briefing
- Pasta party
- Opening ceremony
- **10:00 PM** - HELL160 Solo Start

### Saturday, July 4, 2026
- HELL100 Starts (all categories: Solo, Pairs, Teams, Relays, Bike)

### Sunday, July 5, 2026
- Final arrivals
- Community lunch
- Prize ceremony

## 📝 Registration

- **Platform:** Online (official race website)
- **Closes:** June 15, 2026
- **Non-transferable**
- **Minimum Age:** 18 years
- **Mandatory:** Liability waiver + medical certificate

### 📄 Mandatory Documentation

The **Liability Waiver** and **Medical Certificate** must be:
- Properly filled out
- Delivered by race number pickup
- Or sent via email to: **hell160.organizacao@gmail.com**

⚠️ **If any document is not delivered or not properly filled out, the athlete will not be eligible to participate.**

## ❌ Refund Policy

- **No refunds**, except race cancellation by organization
- Payment not completed by deadline → Registration canceled

## 🚨 Safety

- Medical teams and firefighters along the route
- Communication via GPS tracker
- Withdrawal only in authorized zones
- Mandatory GPS for tracking

---

**An extreme race for athletes seeking to push their limits in the heart of Alentejo! 🔥🏃**`,
      city: "Serpa",
      metaTitle: "HELL160 – Shadows and Dust 2026 | Serpa, Beja | July 3-5",
      metaDescription:
        "HELL160 – Shadows and Dust 2026 on July 3-5 in A-do-Pinto, Serpa, Beja. Ultra trail 164km and 134km. HELL160 Solo, HELL100 Solo/Pairs/Teams/Relays/Bike. Registration until June 15.",
    },
    es: {
      title: "HELL160 – Shadows and Dust",
      description: `**HELL160 – Shadows and Dust** es un ultra trail organizado por la **Associação Desportiva e Cultural HELL160**, que se celebra los días **3, 4 y 5 de julio de 2026**, en pleno Alentejo, con salida y llegada en **A-do-Pinto, Serpa**.

Una carrera de homenaje al ultrarunning y a los valores de superación, con condiciones exigentes de **calor intenso, aislamiento y resistencia física y mental**.

## 🏔️ Sobre la Carrera

HELL160 recorre senderos circulares marcados con señalización **GR15 / GR15.2**, en recorridos de alta dificultad técnica y mental. Los atletas se encontrarán con:

- **Calor extremo alentejano** en pleno verano
- **Terreno aislado** con largos tramos sin apoyo
- **Paisajes únicos** del interior alentejano
- **Desafío mental** de resistencia y superación

Los finishers de HELL160 reciben su nombre grabado en el **Muro de los Legendarios**, un tributo permanente a quienes completan el desafío.

## 🏃 Carreras Disponibles

### HELL160 – Individual (100 plazas)
- **Distancia:** ~164,6 km
- **Desnivel Positivo:** +2.648 m
- **Tiempo Límite:** 36 horas
- **Salida:** Viernes 3/07 a las 22:00
- **Edad Mínima:** 18 años
- **Premio Especial:** Trofeo, pulsera artesanal y nombre en el Muro de los Legendarios

### HELL100 – Individual (100 plazas)
- **Distancia:** ~134 km
- **Desnivel Positivo:** +1.340 m
- **Tiempo Límite:** 24 horas
- **Salida:** Sábado 4/07
- **Edad Mínima:** 18 años

### HELL100 – Parejas (25 plazas)
- **Distancia:** ~134 km (carrera en pareja)
- **Desnivel Positivo:** +1.340 m
- **Tiempo Límite:** 24 horas
- **Salida:** Sábado 4/07
- **Edad Mínima:** 18 años

### HELL100 – Equipos (10 plazas)
- **Distancia:** ~134 km
- **Desnivel Positivo:** +1.340 m
- **Tiempo Límite:** 24 horas
- **Formato:** 5 miembros, mínimo 3 para terminar juntos
- **Salida:** Sábado 4/07
- **Edad Mínima:** 18 años

### HELL100 – Relevos 2 Miembros (10 plazas)
- **Distancia:** ~134 km (dividido entre 2 atletas)
- **Desnivel Positivo:** +1.340 m
- **Tiempo Límite:** 24 horas
- **Salida:** Sábado 4/07
- **Edad Mínima:** 18 años

### HELL100 – Relevos 4 Miembros (20 plazas)
- **Distancia:** ~134 km (dividido entre 4 atletas)
- **Desnivel Positivo:** +1.340 m
- **Tiempo Límite:** 24 horas
- **Salida:** Sábado 4/07
- **Edad Mínima:** 18 años

### HELL100 – Bici (100 plazas)
- **Distancia:** ~134 km
- **Desnivel Positivo:** +1.340 m
- **Tiempo Límite:** 12 horas
- **Salida:** Sábado 4/07
- **Edad Mínima:** 18 años
- **Nota:** Bicicletas eléctricas **no permitidas**

## 🎒 Incluido en la Inscripción

- Dorsal y chip de cronometraje
- **Rastreador GPS** para seguimiento en tiempo real
- 13 puntos de avituallamiento
- 3 Bases de Vida (con apoyo externo autorizado)
- Seguro deportivo
- Medalla de finisher
- Masaje post-carrera
- Duchas
- Comidas finales
- Nombre en el **Muro de los Legendarios** (finishers HELL160)

## 🎒 Material Obligatorio

- Mochila o cinturón de hidratación (mínimo 1,5L)
- Vaso reutilizable
- Frontal con batería extra
- Manta térmica
- Teléfono móvil cargado
- GPS o reloj con GPS
- Dorsal siempre visible

⚠️ **Falta de material obligatorio = Descalificación**

## 🚰 Avituallamientos

- **13 puntos de avituallamiento** a lo largo del recorrido
- **3 Bases de Vida** con apoyo completo
- Apoyo externo **solo autorizado en las Bases de Vida**
- Bastones solo permitidos con autorización de la organización

## 🏆 Premios

- **Trofeos** para ganadores absolutos
- **Finishers HELL160** reciben:
  - Trofeo especial
  - Pulsera artesanal
  - Nombre grabado en el **Muro de los Legendarios**
- Sin premios por categorías de edad

## 📋 Programa

### Viernes 3 de Julio de 2026
- Secretaría y recogida de dorsales
- Briefing técnico
- Pasta party
- Ceremonia de apertura
- **22:00** - Salida HELL160 Individual

### Sábado 4 de Julio de 2026
- Salidas HELL100 (todas las categorías: Individual, Parejas, Equipos, Relevos, Bici)

### Domingo 5 de Julio de 2026
- Llegadas finales
- Comida de convivencia
- Entrega de premios

## 📝 Inscripción

- **Plataforma:** Online (sitio web oficial de la carrera)
- **Cierra:** 15 de junio de 2026
- **No transferible**
- **Edad Mínima:** 18 años
- **Obligatorio:** Formulario de responsabilidad + certificado médico

### 📄 Documentación Obligatoria

El **Formulario de Responsabilidad** y el **Certificado Médico** deben ser:
- Debidamente cumplimentados
- Entregados hasta la recogida del dorsal
- O enviados por correo electrónico a: **hell160.organizacao@gmail.com**

⚠️ **Si algún documento no se entrega o no está correctamente cumplimentado, el atleta no podrá participar.**

## ❌ Política de Reembolso

- **Sin devoluciones**, excepto cancelación de la carrera por la organización
- Pago no completado antes del plazo → Inscripción cancelada

## 🚨 Seguridad

- Equipos médicos y bomberos a lo largo del recorrido
- Comunicación por rastreador GPS
- Abandono solo en zonas autorizadas
- GPS obligatorio para seguimiento

---

**¡Una carrera extrema para atletas que buscan superar sus límites en el corazón del Alentejo! 🔥🏃**`,
      city: "Serpa",
      metaTitle: "HELL160 – Shadows and Dust 2026 | Serpa, Beja | 3-5 Julio",
      metaDescription:
        "HELL160 – Shadows and Dust 2026 del 3 al 5 de julio en A-do-Pinto, Serpa, Beja. Ultra trail 164km y 134km. HELL160 Individual, HELL100 Individual/Parejas/Equipos/Relevos/Bici. Inscripción hasta 15 junio.",
    },
    fr: {
      title: "HELL160 – Shadows and Dust",
      description: `**HELL160 – Shadows and Dust** est un ultra trail organisé par l'**Associação Desportiva e Cultural HELL160**, qui se déroule les **3, 4 et 5 juillet 2026**, en plein Alentejo, avec départ et arrivée à **A-do-Pinto, Serpa**.

Une course en hommage à l'ultrarunning et aux valeurs de dépassement, avec des conditions exigeantes de **chaleur intense, isolement et résistance physique et mentale**.

## 🏔️ À Propos de la Course

HELL160 parcourt des sentiers circulaires balisés avec la signalisation **GR15 / GR15.2**, sur des parcours de haute difficulté technique et mentale. Les athlètes rencontreront :

- **Chaleur extrême de l'Alentejo** en plein été
- **Terrain isolé** avec de longues sections sans assistance
- **Paysages uniques** de l'intérieur de l'Alentejo
- **Défi mental** de résistance et de dépassement

Les finishers du HELL160 reçoivent leur nom gravé sur le **Mur des Légendes**, un hommage permanent à ceux qui relèvent le défi.

## 🏃 Courses Disponibles

### HELL160 – Solo (100 places)
- **Distance :** ~164,6 km
- **Dénivelé Positif :** +2 648 m
- **Temps Limite :** 36 heures
- **Départ :** Vendredi 3/07 à 22h00
- **Âge Minimum :** 18 ans
- **Prix Spécial :** Trophée, bracelet artisanal et nom sur le Mur des Légendes

### HELL100 – Solo (100 places)
- **Distance :** ~134 km
- **Dénivelé Positif :** +1 340 m
- **Temps Limite :** 24 heures
- **Départ :** Samedi 4/07
- **Âge Minimum :** 18 ans

### HELL100 – Duo (25 places)
- **Distance :** ~134 km (course en duo)
- **Dénivelé Positif :** +1 340 m
- **Temps Limite :** 24 heures
- **Départ :** Samedi 4/07
- **Âge Minimum :** 18 ans

### HELL100 – Équipes (10 places)
- **Distance :** ~134 km
- **Dénivelé Positif :** +1 340 m
- **Temps Limite :** 24 heures
- **Format :** 5 membres, minimum 3 pour finir ensemble
- **Départ :** Samedi 4/07
- **Âge Minimum :** 18 ans

### HELL100 – Relais 2 Membres (10 places)
- **Distance :** ~134 km (divisée entre 2 athlètes)
- **Dénivelé Positif :** +1 340 m
- **Temps Limite :** 24 heures
- **Départ :** Samedi 4/07
- **Âge Minimum :** 18 ans

### HELL100 – Relais 4 Membres (20 places)
- **Distance :** ~134 km (divisée entre 4 athlètes)
- **Dénivelé Positif :** +1 340 m
- **Temps Limite :** 24 heures
- **Départ :** Samedi 4/07
- **Âge Minimum :** 18 ans

### HELL100 – Vélo (100 places)
- **Distance :** ~134 km
- **Dénivelé Positif :** +1 340 m
- **Temps Limite :** 12 heures
- **Départ :** Samedi 4/07
- **Âge Minimum :** 18 ans
- **Note :** Vélos électriques **non autorisés**

## 🎒 Inclus dans l'Inscription

- Dossard et puce de chronométrage
- **Tracker GPS** pour suivi en temps réel
- 13 points de ravitaillement
- 3 Bases de Vie (avec assistance externe autorisée)
- Assurance sportive
- Médaille de finisher
- Massage post-course
- Douches
- Repas finaux
- Nom sur le **Mur des Légendes** (finishers HELL160)

## 🎒 Matériel Obligatoire

- Sac à dos ou ceinture d'hydratation (minimum 1,5L)
- Gobelet réutilisable
- Lampe frontale avec batterie supplémentaire
- Couverture de survie
- Téléphone portable chargé
- GPS ou montre GPS
- Dossard toujours visible

⚠️ **Manque de matériel obligatoire = Disqualification**

## 🚰 Ravitaillements

- **13 points de ravitaillement** le long du parcours
- **3 Bases de Vie** avec assistance complète
- Assistance externe **uniquement autorisée aux Bases de Vie**
- Bâtons uniquement autorisés avec l'autorisation de l'organisation

## 🏆 Prix

- **Trophées** pour les vainqueurs absolus
- **Finishers HELL160** reçoivent :
  - Trophée spécial
  - Bracelet artisanal
  - Nom gravé sur le **Mur des Légendes**
- Pas de prix par catégories d'âge

## 📋 Programme

### Vendredi 3 Juillet 2026
- Secrétariat et retrait des dossards
- Briefing technique
- Pasta party
- Cérémonie d'ouverture
- **22h00** - Départ HELL160 Solo

### Samedi 4 Juillet 2026
- Départs HELL100 (toutes catégories : Solo, Duo, Équipes, Relais, Vélo)

### Dimanche 5 Juillet 2026
- Arrivées finales
- Déjeuner convivial
- Remise des prix

## 📝 Inscription

- **Plateforme :** En ligne (site officiel de la course)
- **Fermeture :** 15 juin 2026
- **Non transférable**
- **Âge Minimum :** 18 ans
- **Obligatoire :** Décharge de responsabilité + certificat médical

### 📄 Documentation Obligatoire

La **Décharge de Responsabilité** et le **Certificat Médical** doivent être :
- Dûment remplis
- Remis lors du retrait du dossard
- Ou envoyés par email à : **hell160.organizacao@gmail.com**

⚠️ **Si un document n'est pas remis ou n'est pas correctement rempli, l'athlète ne pourra pas participer.**

## ❌ Politique de Remboursement

- **Pas de remboursement**, sauf annulation de la course par l'organisation
- Paiement non effectué avant la date limite → Inscription annulée

## 🚨 Sécurité

- Équipes médicales et pompiers le long du parcours
- Communication par tracker GPS
- Abandon uniquement dans les zones autorisées
- GPS obligatoire pour le suivi

---

**Une course extrême pour les athlètes cherchant à repousser leurs limites au cœur de l'Alentejo ! 🔥🏃**`,
      city: "Serpa",
      metaTitle: "HELL160 – Shadows and Dust 2026 | Serpa, Beja | 3-5 Juillet",
      metaDescription:
        "HELL160 – Shadows and Dust 2026 du 3 au 5 juillet à A-do-Pinto, Serpa, Beja. Ultra trail 164km et 134km. HELL160 Solo, HELL100 Solo/Duo/Équipes/Relais/Vélo. Inscription jusqu'au 15 juin.",
    },
    de: {
      title: "HELL160 – Shadows and Dust",
      description: `**HELL160 – Shadows and Dust** ist ein Ultratrail, organisiert vom **Associação Desportiva e Cultural HELL160**, der am **3., 4. und 5. Juli 2026** im Herzen des Alentejo stattfindet, mit Start und Ziel in **A-do-Pinto, Serpa**.

Ein Rennen als Hommage an das Ultrarunning und die Werte der Überwindung, mit anspruchsvollen Bedingungen von **intensiver Hitze, Isolation und körperlicher und mentaler Ausdauer**.

## 🏔️ Über das Rennen

HELL160 führt durch kreisförmige Pfade, die mit **GR15 / GR15.2**-Beschilderung gekennzeichnet sind, auf Strecken mit hoher technischer und mentaler Schwierigkeit. Die Athleten werden konfrontiert mit:

- **Extreme Hitze des Alentejo** mitten im Sommer
- **Isoliertes Gelände** mit langen Abschnitten ohne Unterstützung
- **Einzigartige Landschaften** des inneren Alentejo
- **Mentale Herausforderung** von Ausdauer und Überwindung

HELL160-Finisher erhalten ihren Namen auf der **Mauer der Legenden** eingraviert, eine dauerhafte Hommage an diejenigen, die die Herausforderung meistern.

## 🏃 Verfügbare Rennen

### HELL160 – Solo (100 Plätze)
- **Distanz:** ~164,6 km
- **Höhenmeter:** +2.648 m
- **Zeitlimit:** 36 Stunden
- **Start:** Freitag, 3.7. um 22:00 Uhr
- **Mindestalter:** 18 Jahre
- **Sonderpreis:** Trophäe, handgefertigtes Armband und Name auf der Mauer der Legenden

### HELL100 – Solo (100 Plätze)
- **Distanz:** ~134 km
- **Höhenmeter:** +1.340 m
- **Zeitlimit:** 24 Stunden
- **Start:** Samstag, 4.7.
- **Mindestalter:** 18 Jahre

### HELL100 – Paare (25 Plätze)
- **Distanz:** ~134 km (Lauf zu zweit)
- **Höhenmeter:** +1.340 m
- **Zeitlimit:** 24 Stunden
- **Start:** Samstag, 4.7.
- **Mindestalter:** 18 Jahre

### HELL100 – Teams (10 Plätze)
- **Distanz:** ~134 km
- **Höhenmeter:** +1.340 m
- **Zeitlimit:** 24 Stunden
- **Format:** 5 Mitglieder, mindestens 3 gemeinsam im Ziel
- **Start:** Samstag, 4.7.
- **Mindestalter:** 18 Jahre

### HELL100 – Staffel 2 Mitglieder (10 Plätze)
- **Distanz:** ~134 km (aufgeteilt auf 2 Athleten)
- **Höhenmeter:** +1.340 m
- **Zeitlimit:** 24 Stunden
- **Start:** Samstag, 4.7.
- **Mindestalter:** 18 Jahre

### HELL100 – Staffel 4 Mitglieder (20 Plätze)
- **Distanz:** ~134 km (aufgeteilt auf 4 Athleten)
- **Höhenmeter:** +1.340 m
- **Zeitlimit:** 24 Stunden
- **Start:** Samstag, 4.7.
- **Mindestalter:** 18 Jahre

### HELL100 – Rad (100 Plätze)
- **Distanz:** ~134 km
- **Höhenmeter:** +1.340 m
- **Zeitlimit:** 12 Stunden
- **Start:** Samstag, 4.7.
- **Mindestalter:** 18 Jahre
- **Hinweis:** Elektrofahrräder **nicht erlaubt**

## 🎒 In der Anmeldung Enthalten

- Startnummer und Timing-Chip
- **GPS-Tracker** für Echtzeit-Tracking
- 13 Verpflegungsstationen
- 3 Lebensbasen (mit autorisierter externer Unterstützung)
- Sportversicherung
- Finisher-Medaille
- Massage nach dem Rennen
- Duschen
- Abschließende Mahlzeiten
- Name auf der **Mauer der Legenden** (HELL160-Finisher)

## 🎒 Pflichtausrüstung

- Hydratationsrucksack oder -gürtel (mindestens 1,5L)
- Wiederverwendbarer Becher
- Stirnlampe mit Ersatzbatterie
- Rettungsdecke
- Geladenes Mobiltelefon
- GPS oder GPS-Uhr
- Startnummer immer sichtbar

⚠️ **Fehlende Pflichtausrüstung = Disqualifikation**

## 🚰 Verpflegung

- **13 Verpflegungsstationen** entlang der Strecke
- **3 Lebensbasen** mit vollständiger Unterstützung
- Externe Unterstützung **nur an Lebensbasen autorisiert**
- Stöcke nur mit Genehmigung der Organisation erlaubt

## 🏆 Preise

- **Trophäen** für absolute Gewinner
- **HELL160-Finisher** erhalten:
  - Spezielle Trophäe
  - Handgefertigtes Armband
  - Name auf der **Mauer der Legenden** eingraviert
- Keine Altersklassenpreise

## 📋 Programm

### Freitag, 3. Juli 2026
- Anmeldung und Startnummernausgabe
- Technisches Briefing
- Pasta-Party
- Eröffnungszeremonie
- **22:00 Uhr** - Start HELL160 Solo

### Samstag, 4. Juli 2026
- Starts HELL100 (alle Kategorien: Solo, Paare, Teams, Staffel, Rad)

### Sonntag, 5. Juli 2026
- Finale Ankünfte
- Gemeinschaftsessen
- Preisverleihung

## 📝 Anmeldung

- **Plattform:** Online (offizielle Rennwebsite)
- **Schließt:** 15. Juni 2026
- **Nicht übertragbar**
- **Mindestalter:** 18 Jahre
- **Pflicht:** Haftungsausschluss + ärztliches Attest

### 📄 Pflichtdokumentation

Der **Haftungsausschluss** und das **Ärztliche Attest** müssen:
- Ordnungsgemäß ausgefüllt sein
- Bis zur Startnummernausgabe abgegeben werden
- Oder per E-Mail gesendet werden an: **hell160.organizacao@gmail.com**

⚠️ **Wenn ein Dokument nicht abgegeben oder nicht ordnungsgemäß ausgefüllt ist, kann der Athlet nicht teilnehmen.**

## ❌ Rückerstattungsrichtlinie

- **Keine Rückerstattung**, außer bei Absage durch die Organisation
- Zahlung nicht bis zur Frist abgeschlossen → Anmeldung storniert

## 🚨 Sicherheit

- Medizinische Teams und Feuerwehr entlang der Strecke
- Kommunikation über GPS-Tracker
- Aufgabe nur in autorisierten Zonen
- GPS obligatorisch für Tracking

---

**Ein extremes Rennen für Athleten, die ihre Grenzen im Herzen des Alentejo überschreiten möchten! 🔥🏃**`,
      city: "Serpa",
      metaTitle: "HELL160 – Shadows and Dust 2026 | Serpa, Beja | 3.-5. Juli",
      metaDescription:
        "HELL160 – Shadows and Dust 2026 vom 3. bis 5. Juli in A-do-Pinto, Serpa, Beja. Ultratrail 164km und 134km. HELL160 Solo, HELL100 Solo/Paare/Teams/Staffel/Rad. Anmeldung bis 15. Juni.",
    },
    it: {
      title: "HELL160 – Shadows and Dust",
      description: `**HELL160 – Shadows and Dust** è un ultra trail organizzato dall'**Associação Desportiva e Cultural HELL160**, che si svolge il **3, 4 e 5 luglio 2026**, nel cuore dell'Alentejo, con partenza e arrivo a **A-do-Pinto, Serpa**.

Una gara in omaggio all'ultrarunning e ai valori del superamento, con condizioni impegnative di **calore intenso, isolamento e resistenza fisica e mentale**.

## 🏔️ Sulla Gara

HELL160 percorre sentieri circolari segnalati con **GR15 / GR15.2**, su percorsi di alta difficoltà tecnica e mentale. Gli atleti affronteranno:

- **Calore estremo dell'Alentejo** in piena estate
- **Terreno isolato** con lunghi tratti senza supporto
- **Paesaggi unici** dell'interno dell'Alentejo
- **Sfida mentale** di resistenza e superamento

I finisher di HELL160 ricevono il loro nome inciso sul **Muro delle Leggende**, un tributo permanente a coloro che completano la sfida.

## 🏃 Gare Disponibili

### HELL160 – Solo (100 posti)
- **Distanza:** ~164,6 km
- **Dislivello Positivo:** +2.648 m
- **Tempo Limite:** 36 ore
- **Partenza:** Venerdì 3/07 alle 22:00
- **Età Minima:** 18 anni
- **Premio Speciale:** Trofeo, braccialetto artigianale e nome sul Muro delle Leggende

### HELL100 – Solo (100 posti)
- **Distanza:** ~134 km
- **Dislivello Positivo:** +1.340 m
- **Tempo Limite:** 24 ore
- **Partenza:** Sabato 4/07
- **Età Minima:** 18 anni

### HELL100 – Coppie (25 posti)
- **Distanza:** ~134 km (corsa in coppia)
- **Dislivello Positivo:** +1.340 m
- **Tempo Limite:** 24 ore
- **Partenza:** Sabato 4/07
- **Età Minima:** 18 anni

### HELL100 – Squadre (10 posti)
- **Distanza:** ~134 km
- **Dislivello Positivo:** +1.340 m
- **Tempo Limite:** 24 ore
- **Formato:** 5 membri, minimo 3 per finire insieme
- **Partenza:** Sabato 4/07
- **Età Minima:** 18 anni

### HELL100 – Staffetta 2 Membri (10 posti)
- **Distanza:** ~134 km (divisa tra 2 atleti)
- **Dislivello Positivo:** +1.340 m
- **Tempo Limite:** 24 ore
- **Partenza:** Sabato 4/07
- **Età Minima:** 18 anni

### HELL100 – Staffetta 4 Membri (20 posti)
- **Distanza:** ~134 km (divisa tra 4 atleti)
- **Dislivello Positivo:** +1.340 m
- **Tempo Limite:** 24 ore
- **Partenza:** Sabato 4/07
- **Età Minima:** 18 anni

### HELL100 – Bici (100 posti)
- **Distanza:** ~134 km
- **Dislivello Positivo:** +1.340 m
- **Tempo Limite:** 12 ore
- **Partenza:** Sabato 4/07
- **Età Minima:** 18 anni
- **Nota:** Biciclette elettriche **non ammesse**

## 🎒 Incluso nell'Iscrizione

- Pettorale e chip di cronometraggio
- **Tracker GPS** per tracciamento in tempo reale
- 13 punti di ristoro
- 3 Basi Vita (con supporto esterno autorizzato)
- Assicurazione sportiva
- Medaglia di finisher
- Massaggio post-gara
- Docce
- Pasti finali
- Nome sul **Muro delle Leggende** (finisher HELL160)

## 🎒 Attrezzatura Obbligatoria

- Zaino o cintura di idratazione (minimo 1,5L)
- Bicchiere riutilizzabile
- Lampada frontale con batteria di riserva
- Coperta termica
- Telefono cellulare carico
- GPS o orologio GPS
- Pettorale sempre visibile

⚠️ **Mancanza di attrezzatura obbligatoria = Squalifica**

## 🚰 Ristori

- **13 punti di ristoro** lungo il percorso
- **3 Basi Vita** con supporto completo
- Supporto esterno **solo autorizzato alle Basi Vita**
- Bastoncini solo consentiti con autorizzazione dell'organizzazione

## 🏆 Premi

- **Trofei** per i vincitori assoluti
- **Finisher HELL160** ricevono:
  - Trofeo speciale
  - Braccialetto artigianale
  - Nome inciso sul **Muro delle Leggende**
- Nessun premio per categorie di età

## 📋 Programma

### Venerdì 3 Luglio 2026
- Segreteria e ritiro pettorali
- Briefing tecnico
- Pasta party
- Cerimonia di apertura
- **22:00** - Partenza HELL160 Solo

### Sabato 4 Luglio 2026
- Partenze HELL100 (tutte le categorie: Solo, Coppie, Squadre, Staffetta, Bici)

### Domenica 5 Luglio 2026
- Arrivi finali
- Pranzo conviviale
- Premiazione

## 📝 Iscrizione

- **Piattaforma:** Online (sito ufficiale della gara)
- **Chiude:** 15 giugno 2026
- **Non trasferibile**
- **Età Minima:** 18 anni
- **Obbligatorio:** Scarico di responsabilità + certificato medico

### 📄 Documentazione Obbligatoria

Lo **Scarico di Responsabilità** e il **Certificato Medico** devono essere:
- Correttamente compilati
- Consegnati al ritiro del pettorale
- Oppure inviati via email a: **hell160.organizacao@gmail.com**

⚠️ **Se un documento non viene consegnato o non è correttamente compilato, l'atleta non potrà partecipare.**

## ❌ Politica di Rimborso

- **Nessun rimborso**, tranne annullamento della gara da parte dell'organizzazione
- Pagamento non completato entro la scadenza → Iscrizione annullata

## 🚨 Sicurezza

- Squadre mediche e vigili del fuoco lungo il percorso
- Comunicazione tramite tracker GPS
- Ritiro solo in zone autorizzate
- GPS obbligatorio per il tracciamento

---

**Una gara estrema per atleti che cercano di superare i propri limiti nel cuore dell'Alentejo! 🔥🏃**`,
      city: "Serpa",
      metaTitle: "HELL160 – Shadows and Dust 2026 | Serpa, Beja | 3-5 Luglio",
      metaDescription:
        "HELL160 – Shadows and Dust 2026 dal 3 al 5 luglio a A-do-Pinto, Serpa, Beja. Ultra trail 164km e 134km. HELL160 Solo, HELL100 Solo/Coppie/Squadre/Staffetta/Bici. Iscrizione fino al 15 giugno.",
    },
  };

  console.log("🌍 Creating translations for all 6 languages...");

  for (const lang of Object.keys(translations) as Language[]) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
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
        language: lang,
        title: translations[lang].title,
        description: translations[lang].description,
        city: translations[lang].city,
        metaTitle: translations[lang].metaTitle,
        metaDescription: translations[lang].metaDescription,
      },
    });
    console.log(`   ✅ ${lang.toUpperCase()} translation created`);
  }

  // Delete existing pricing phases to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("💰 Creating event variants and pricing phases...");

  // Define variants with their pricing phases
  const variants = [
    {
      name: "HELL160 – Solo",
      distanceKm: 164.6,
      elevationGainM: 2648,
      maxParticipants: 100,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-01-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 110.0,
          currency: Currency.EUR,
          note: "Até 31/12/2025",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-05-31T23:59:59Z"),
          price: 130.0,
          currency: Currency.EUR,
          note: "01/01 a 31/05/2026",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-06-01T00:00:00Z"),
          endDate: new Date("2026-06-15T23:59:59Z"),
          price: 150.0,
          currency: Currency.EUR,
          note: "01/06 a 15/06/2026",
        },
      ],
    },
    {
      name: "HELL100 – Solo",
      distanceKm: 134.0,
      elevationGainM: 1340,
      maxParticipants: 100,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-01-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 75.0,
          currency: Currency.EUR,
          note: "Até 31/12/2025",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-05-31T23:59:59Z"),
          price: 85.0,
          currency: Currency.EUR,
          note: "01/01 a 31/05/2026",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-06-01T00:00:00Z"),
          endDate: new Date("2026-06-15T23:59:59Z"),
          price: 105.0,
          currency: Currency.EUR,
          note: "01/06 a 15/06/2026",
        },
      ],
    },
    {
      name: "HELL100 – Duplas",
      distanceKm: 134.0,
      elevationGainM: 1340,
      maxParticipants: 50,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-01-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 150.0,
          currency: Currency.EUR,
          note: "Até 31/12/2025 (valor por equipa)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-05-31T23:59:59Z"),
          price: 170.0,
          currency: Currency.EUR,
          note: "01/01 a 31/05/2026 (valor por equipa)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-06-01T00:00:00Z"),
          endDate: new Date("2026-06-15T23:59:59Z"),
          price: 210.0,
          currency: Currency.EUR,
          note: "01/06 a 15/06/2026 (valor por equipa)",
        },
      ],
    },
    {
      name: "HELL100 – Equipas (5 elementos)",
      distanceKm: 134.0,
      elevationGainM: 1340,
      maxParticipants: 50,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-01-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 350.0,
          currency: Currency.EUR,
          note: "Até 31/12/2025 (valor por equipa)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-05-31T23:59:59Z"),
          price: 400.0,
          currency: Currency.EUR,
          note: "01/01 a 31/05/2026 (valor por equipa)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-06-01T00:00:00Z"),
          endDate: new Date("2026-06-15T23:59:59Z"),
          price: 450.0,
          currency: Currency.EUR,
          note: "01/06 a 15/06/2026 (valor por equipa)",
        },
      ],
    },
    {
      name: "HELL100 – Estafetas (2 elementos)",
      distanceKm: 134.0,
      elevationGainM: 1340,
      maxParticipants: 20,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-01-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 100.0,
          currency: Currency.EUR,
          note: "Até 31/12/2025 (valor por equipa)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-05-31T23:59:59Z"),
          price: 120.0,
          currency: Currency.EUR,
          note: "01/01 a 31/05/2026 (valor por equipa)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-06-01T00:00:00Z"),
          endDate: new Date("2026-06-15T23:59:59Z"),
          price: 140.0,
          currency: Currency.EUR,
          note: "01/06 a 15/06/2026 (valor por equipa)",
        },
      ],
    },
    {
      name: "HELL100 – Estafetas (4 elementos)",
      distanceKm: 134.0,
      elevationGainM: 1340,
      maxParticipants: 80,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-01-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 160.0,
          currency: Currency.EUR,
          note: "Até 31/12/2025 (valor por equipa)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-05-31T23:59:59Z"),
          price: 200.0,
          currency: Currency.EUR,
          note: "01/01 a 31/05/2026 (valor por equipa)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-06-01T00:00:00Z"),
          endDate: new Date("2026-06-15T23:59:59Z"),
          price: 240.0,
          currency: Currency.EUR,
          note: "01/06 a 15/06/2026 (valor por equipa)",
        },
      ],
    },
    {
      name: "HELL100 – Bike",
      distanceKm: 134.0,
      elevationGainM: 1340,
      maxParticipants: 100,
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-01-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 65.0,
          currency: Currency.EUR,
          note: "Até 31/12/2025",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-05-31T23:59:59Z"),
          price: 75.0,
          currency: Currency.EUR,
          note: "01/01 a 31/05/2026",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-06-01T00:00:00Z"),
          endDate: new Date("2026-06-15T23:59:59Z"),
          price: 90.0,
          currency: Currency.EUR,
          note: "01/06 a 15/06/2026",
        },
      ],
    },
  ];

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
          eventId: event.id,
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

  console.log("✅ HELL160 – Shadows and Dust 2026 seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding HELL160:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
