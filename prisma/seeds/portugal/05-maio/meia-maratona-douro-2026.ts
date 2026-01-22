import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Meia Maratona do Douro Vinhateiro 2026...");

  const slug = "meia-maratona-douro-vinhateiro-2026";

  // Upsert Event
  const event = await prisma.event.upsert({
    where: { slug },
    update: {
      title: "Meia Maratona do Douro Vinhateiro",
      description:
        "A Mais Bela Corrida do Mundo. 19ª edição da Meia Maratona do Douro Vinhateiro, percorrendo o Vale do Douro Património Mundial UNESCO. Evento organizado pela GlobalSport com percurso certificado pela Federação Portuguesa de Atletismo.",
      startDate: new Date("2026-05-24T08:00:00Z"),
      endDate: new Date("2026-05-24T13:00:00Z"),
      registrationDeadline: new Date("2026-05-23T23:59:59Z"),
      city: "Peso da Régua",
      country: "Portugal",
      latitude: 41.1649,
      longitude: -7.787,
      sportTypes: [SportType.RUNNING],
      externalUrl: "https://www.douro-half-marathon.com/",
      imageUrl:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&h=630&fit=crop",
    },
    create: {
      slug,
      title: "Meia Maratona do Douro Vinhateiro",
      description:
        "A Mais Bela Corrida do Mundo. 19ª edição da Meia Maratona do Douro Vinhateiro, percorrendo o Vale do Douro Património Mundial UNESCO. Evento organizado pela GlobalSport com percurso certificado pela Federação Portuguesa de Atletismo.",
      startDate: new Date("2026-05-24T08:00:00Z"),
      endDate: new Date("2026-05-24T13:00:00Z"),
      registrationDeadline: new Date("2026-05-23T23:59:59Z"),
      city: "Peso da Régua",
      country: "Portugal",
      latitude: 41.1649,
      longitude: -7.787,
      sportTypes: [SportType.RUNNING],
      externalUrl: "https://www.douro-half-marathon.com/",
      imageUrl:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=1200&h=630&fit=crop",
    },
  });

  console.log(`✅ Event upserted with ID: ${event.id}`);

  // Upsert Translations for all 6 languages
  const translations = {
    pt: {
      title: "Meia Maratona do Douro Vinhateiro",
      description: `A **Meia Maratona do Douro Vinhateiro** regressa a **24 de maio de 2026** para a sua **19ª edição**, conhecida como **"A Mais Bela Corrida do Mundo"** 🌍🍇

Organizada pela **GlobalSport – GSX Portugal Lda.**, esta prova icónica percorre o **Vale do Douro**, região classificada como **Património Mundial pela UNESCO**, oferecendo vistas únicas sobre as vinhas em socalcos, o Rio Douro e as aldeias vinhateiras.

## 🏃 Sobre a Prova

A Meia Maratona do Douro Vinhateiro é uma corrida de estrada **certificada pela Federação Portuguesa de Atletismo**, com **cronometragem oficial por chip RFID**, que atrai corredores de todo o mundo pela beleza única do percurso.

## 🏔️ Percurso

O percurso de **21,097 km** atravessa:
- **Peso da Régua** (partida e meta)
- **Lamego**
- **Armamar**

Desenhado ao longo do **Vale do Douro**, Património Mundial UNESCO, com vistas espetaculares sobre as vinhas em socalcos e o rio.

## 🏃 Modalidades Disponíveis

### Meia Maratona (21,097 km)
- **Caráter:** Competitivo
- **Distância:** 21,097 km (percurso certificado FPA)
- **Idade Mínima:** 18 anos (nascidos em 2008 ou antes)
- **Partida:** 09:00
- **Tempo Limite:** 3 horas (encerramento às 12:00)
- **Cronometragem:** Oficial com chip RFID
- **Inclui:** Dorsal com chip, t-shirt técnica oficial, medalha finisher, material promocional

### Caminhada (5 km)
- **Caráter:** Não competitivo / recreativo
- **Distância:** 5 km
- **Idade:** Todas as idades
- **Partida:** 09:20
- **Tempo Limite:** 3 horas
- **Obrigatório:** T-shirt oficial do evento
- **Inclui:** Dorsal, t-shirt oficial

**Crianças até 9 anos:** Caminhada com preço especial de €5,00

## 📋 Escalões Etários (Meia Maratona)

- **Seniores:** 18–39 anos
- **Veteranos I:** 40–44 anos
- **Veteranos II:** 45–49 anos
- **Veteranos III:** 50–54 anos
- **Veteranos IV:** 55–59 anos
- **Veteranos V:** 60+ anos

⚠️ **Nota:** Prémios por escalão atribuídos com mínimo de 3 atletas por escalão/género

## 🎒 Kit do Atleta

### Meia Maratona
- Dorsal com chip RFID
- T-shirt técnica oficial
- Medalha de finisher
- Material promocional
- Informações do evento

### Caminhada
- Dorsal
- T-shirt oficial do evento

## 🚰 Abastecimentos

### Meia Maratona (21,097 km)
- **5 km** – Água
- **10 km** – Água + isotónica
- **15 km** – Água + isotónica
- **Meta** – Água, isotónica e fruta

### Caminhada (5 km)
- **Ponto intermédio** – Água
- **Meta** – Água e fruta

## 🏆 Prémios

### Meia Maratona
- **Medalha** para todos os finishers
- **Prémios monetários:**
  - Top 10 classificação geral (Masculino e Feminino)
  - Vencedores de cada escalão etário (mínimo 10 atletas por escalão)
- **Troféus:** Top 3 classificação geral (Masculino e Feminino)

### Caminhada
- Não competitiva (sem prémios)

## 🚨 Segurança e Serviços

- Assistência médica ao longo de todo o percurso
- Ambulâncias dedicadas
- Seguro desportivo obrigatório incluído
- Guarda-roupa na zona partida/meta
- Chuveiros (local a anunciar)
- Cronometragem oficial com chip RFID

## 📝 Regras Importantes

- Dorsais **intransmissíveis**
- **Proibido:**
  - Bicicletas, patins, skates
  - Animais de estimação
  - Veículos não autorizados
- Pode haver **controlo antidoping** (ADoP / World Athletics)

## ❌ Política de Cancelamento

Em caso de força maior (condições climatéricas adversas, restrições governamentais, segurança), a organização poderá:
- Reagendar o evento
- Efetuar reembolso parcial ou total
- Transferir inscrição para edição seguinte

## 📞 Contactos

- **Email:** info@globalsport.pt
- **Website Oficial:** [www.douro-half-marathon.com](https://www.douro-half-marathon.com/)
- **Inscrições:** [StopAndGo](https://stopandgo.net/events/meia-maratona-do-douro-2026)

---

**Vem correr "A Mais Bela Corrida do Mundo" no coração do Douro Vinhateiro! 🍇🏃**`,
      city: "Peso da Régua",
      metaTitle:
        "Meia Maratona do Douro Vinhateiro 2026 - 19ª Edição | Peso da Régua | 24 Maio",
      metaDescription:
        "Meia Maratona do Douro Vinhateiro 2026 - 19ª edição a 24 de maio em Peso da Régua. A Mais Bela Corrida do Mundo no Vale do Douro UNESCO. 21km + Caminhada 5km. Inscrições abertas.",
    },
    en: {
      title: "Douro Wine Region Half Marathon",
      description: `The **Douro Wine Region Half Marathon** returns on **May 24, 2026** for its **19th edition**, known as **"The World's Most Beautiful Race"** 🌍🍇

Organized by **GlobalSport – GSX Portugal Ltd.**, this iconic race runs through the **Douro Valley**, a region classified as a **UNESCO World Heritage Site**, offering unique views of terraced vineyards, the Douro River, and wine villages.

## 🏃 About the Race

The Douro Wine Region Half Marathon is a road race **certified by the Portuguese Athletics Federation**, with **official RFID chip timing**, attracting runners from around the world for the unique beauty of the course.

## 🏔️ Course

The **21.097 km** course crosses:
- **Peso da Régua** (start and finish)
- **Lamego**
- **Armamar**

Designed along the **Douro Valley**, a UNESCO World Heritage Site, with spectacular views of terraced vineyards and the river.

## 🏃 Available Events

### Half Marathon (21.097 km)
- **Type:** Competitive
- **Distance:** 21.097 km (FPA certified course)
- **Minimum Age:** 18 years (born in 2008 or before)
- **Start:** 09:00 AM
- **Time Limit:** 3 hours (closes at 12:00 PM)
- **Timing:** Official with RFID chip
- **Includes:** Race number with chip, official technical t-shirt, finisher medal, promotional materials

### Walk (5 km)
- **Type:** Non-competitive / recreational
- **Distance:** 5 km
- **Age:** All ages
- **Start:** 09:20 AM
- **Time Limit:** 3 hours
- **Required:** Official event t-shirt
- **Includes:** Race number, official t-shirt

**Children up to 9 years:** Walk with special price of €5.00

## 📋 Age Categories (Half Marathon)

- **Seniors:** 18–39 years
- **Veterans I:** 40–44 years
- **Veterans II:** 45–49 years
- **Veterans III:** 50–54 years
- **Veterans IV:** 55–59 years
- **Veterans V:** 60+ years

⚠️ **Note:** Age category prizes awarded with minimum 3 athletes per category/gender

## 🎒 Athlete Kit

### Half Marathon
- Race number with RFID chip
- Official technical t-shirt
- Finisher medal
- Promotional materials
- Event information

### Walk
- Race number
- Official event t-shirt

## 🚰 Aid Stations

### Half Marathon (21.097 km)
- **5 km** – Water
- **10 km** – Water + isotonic
- **15 km** – Water + isotonic
- **Finish** – Water, isotonic and fruit

### Walk (5 km)
- **Midpoint** – Water
- **Finish** – Water and fruit

## 🏆 Prizes

### Half Marathon
- **Medal** for all finishers
- **Cash prizes:**
  - Top 10 overall (Male and Female)
  - Winners of each age category (minimum 10 athletes per category)
- **Trophies:** Top 3 overall (Male and Female)

### Walk
- Non-competitive (no prizes)

## 🚨 Safety and Services

- Medical assistance throughout the course
- Dedicated ambulances
- Mandatory sports insurance included
- Bag check at start/finish area
- Showers (location to be announced)
- Official RFID chip timing

## 📝 Important Rules

- Race numbers **non-transferable**
- **Prohibited:**
  - Bicycles, rollerblades, skateboards
  - Pets
  - Unauthorized vehicles
- **Anti-doping control** may be conducted (ADoP / World Athletics)

## ❌ Cancellation Policy

In case of force majeure (adverse weather, government restrictions, safety), the organization may:
- Reschedule the event
- Issue partial or full refund
- Transfer registration to next edition

## 📞 Contacts

- **Email:** info@globalsport.pt
- **Official Website:** [www.douro-half-marathon.com](https://www.douro-half-marathon.com/)
- **Registration:** [StopAndGo](https://stopandgo.net/events/meia-maratona-do-douro-2026)

---

**Come run "The World's Most Beautiful Race" in the heart of the Douro Wine Region! 🍇🏃**`,
      city: "Peso da Régua",
      metaTitle:
        "Douro Wine Region Half Marathon 2026 - 19th Edition | Peso da Régua | May 24",
      metaDescription:
        "Douro Wine Region Half Marathon 2026 - 19th edition on May 24 in Peso da Régua. The World's Most Beautiful Race in UNESCO Douro Valley. 21km + 5km Walk. Registration open.",
    },
    es: {
      title: "Media Maratón del Douro Vinhateiro",
      description: `La **Media Maratón del Douro Vinhateiro** regresa el **24 de mayo de 2026** para su **19ª edición**, conocida como **"La Carrera Más Bella del Mundo"** 🌍🍇

Organizada por **GlobalSport – GSX Portugal Lda.**, esta icónica carrera recorre el **Valle del Duero**, región clasificada como **Patrimonio Mundial por la UNESCO**, ofreciendo vistas únicas de viñedos en terrazas, el Río Duero y pueblos vinícolas.

## 🏃 Sobre la Carrera

La Media Maratón del Douro Vinhateiro es una carrera de ruta **certificada por la Federación Portuguesa de Atletismo**, con **cronometraje oficial por chip RFID**, que atrae corredores de todo el mundo por la belleza única del recorrido.

## 🏔️ Recorrido

El recorrido de **21,097 km** atraviesa:
- **Peso da Régua** (salida y meta)
- **Lamego**
- **Armamar**

Diseñado a lo largo del **Valle del Duero**, Patrimonio Mundial UNESCO, con vistas espectaculares de viñedos en terrazas y el río.

## 🏃 Eventos Disponibles

### Media Maratón (21,097 km)
- **Tipo:** Competitivo
- **Distancia:** 21,097 km (recorrido certificado FPA)
- **Edad Mínima:** 18 años (nacidos en 2008 o antes)
- **Salida:** 09:00
- **Tiempo Límite:** 3 horas (cierre a las 12:00)
- **Cronometraje:** Oficial con chip RFID
- **Incluye:** Dorsal con chip, camiseta técnica oficial, medalla finisher, material promocional

### Caminata (5 km)
- **Tipo:** No competitivo / recreativo
- **Distancia:** 5 km
- **Edad:** Todas las edades
- **Salida:** 09:20
- **Tiempo Límite:** 3 horas
- **Obligatorio:** Camiseta oficial del evento
- **Incluye:** Dorsal, camiseta oficial

**Niños hasta 9 años:** Caminata con precio especial de €5,00

## 📋 Categorías de Edad (Media Maratón)

- **Seniors:** 18–39 años
- **Veteranos I:** 40–44 años
- **Veteranos II:** 45–49 años
- **Veteranos III:** 50–54 años
- **Veteranos IV:** 55–59 años
- **Veteranos V:** 60+ años

⚠️ **Nota:** Premios por categoría otorgados con mínimo 3 atletas por categoría/género

## 🎒 Kit del Atleta

### Media Maratón
- Dorsal con chip RFID
- Camiseta técnica oficial
- Medalla de finisher
- Material promocional
- Información del evento

### Caminata
- Dorsal
- Camiseta oficial del evento

## 🚰 Avituallamientos

### Media Maratón (21,097 km)
- **5 km** – Agua
- **10 km** – Agua + isotónica
- **15 km** – Agua + isotónica
- **Meta** – Agua, isotónica y fruta

### Caminata (5 km)
- **Punto intermedio** – Agua
- **Meta** – Agua y fruta

## 🏆 Premios

### Media Maratón
- **Medalla** para todos los finishers
- **Premios monetarios:**
  - Top 10 clasificación general (Masculino y Femenino)
  - Ganadores de cada categoría de edad (mínimo 10 atletas por categoría)
- **Trofeos:** Top 3 clasificación general (Masculino y Femenino)

### Caminata
- No competitiva (sin premios)

## 🚨 Seguridad y Servicios

- Asistencia médica en todo el recorrido
- Ambulancias dedicadas
- Seguro deportivo obligatorio incluido
- Consigna en zona salida/meta
- Duchas (ubicación a anunciar)
- Cronometraje oficial con chip RFID

## 📝 Reglas Importantes

- Dorsales **intransferibles**
- **Prohibido:**
  - Bicicletas, patines, monopatines
  - Mascotas
  - Vehículos no autorizados
- Puede haber **control antidopaje** (ADoP / World Athletics)

## ❌ Política de Cancelación

En caso de fuerza mayor (condiciones climáticas adversas, restricciones gubernamentales, seguridad), la organización podrá:
- Reprogramar el evento
- Efectuar reembolso parcial o total
- Transferir inscripción a siguiente edición

## 📞 Contactos

- **Email:** info@globalsport.pt
- **Sitio Web Oficial:** [www.douro-half-marathon.com](https://www.douro-half-marathon.com/)
- **Inscripciones:** [StopAndGo](https://stopandgo.net/events/meia-maratona-do-douro-2026)

---

**¡Ven a correr "La Carrera Más Bella del Mundo" en el corazón del Douro Vinhateiro! 🍇🏃**`,
      city: "Peso da Régua",
      metaTitle:
        "Media Maratón del Douro Vinhateiro 2026 - 19ª Edición | Peso da Régua | 24 Mayo",
      metaDescription:
        "Media Maratón del Douro Vinhateiro 2026 - 19ª edición el 24 de mayo en Peso da Régua. La Carrera Más Bella del Mundo en el Valle del Duero UNESCO. 21km + Caminata 5km. Inscripciones abiertas.",
    },
    fr: {
      title: "Semi-Marathon du Douro Vinhateiro",
      description: `Le **Semi-Marathon du Douro Vinhateiro** revient le **24 mai 2026** pour sa **19e édition**, connue comme **"La Plus Belle Course du Monde"** 🌍🍇

Organisée par **GlobalSport – GSX Portugal Lda.**, cette course emblématique parcourt la **Vallée du Douro**, région classée au **Patrimoine Mondial de l'UNESCO**, offrant des vues uniques sur les vignobles en terrasses, le fleuve Douro et les villages viticoles.

## 🏃 À Propos de la Course

Le Semi-Marathon du Douro Vinhateiro est une course sur route **certifiée par la Fédération Portugaise d'Athlétisme**, avec **chronométrage officiel par puce RFID**, attirant des coureurs du monde entier pour la beauté unique du parcours.

## 🏔️ Parcours

Le parcours de **21,097 km** traverse :
- **Peso da Régua** (départ et arrivée)
- **Lamego**
- **Armamar**

Conçu le long de la **Vallée du Douro**, site du Patrimoine Mondial UNESCO, avec des vues spectaculaires sur les vignobles en terrasses et le fleuve.

## 🏃 Événements Disponibles

### Semi-Marathon (21,097 km)
- **Type :** Compétitif
- **Distance :** 21,097 km (parcours certifié FPA)
- **Âge Minimum :** 18 ans (nés en 2008 ou avant)
- **Départ :** 09h00
- **Temps Limite :** 3 heures (fermeture à 12h00)
- **Chronométrage :** Officiel avec puce RFID
- **Inclus :** Dossard avec puce, t-shirt technique officiel, médaille finisher, matériel promotionnel

### Marche (5 km)
- **Type :** Non compétitif / récréatif
- **Distance :** 5 km
- **Âge :** Tous âges
- **Départ :** 09h20
- **Temps Limite :** 3 heures
- **Obligatoire :** T-shirt officiel de l'événement
- **Inclus :** Dossard, t-shirt officiel

**Enfants jusqu'à 9 ans :** Marche avec prix spécial de 5,00 €

## 📋 Catégories d'Âge (Semi-Marathon)

- **Seniors :** 18–39 ans
- **Vétérans I :** 40–44 ans
- **Vétérans II :** 45–49 ans
- **Vétérans III :** 50–54 ans
- **Vétérans IV :** 55–59 ans
- **Vétérans V :** 60+ ans

⚠️ **Note :** Prix par catégorie attribués avec minimum 3 athlètes par catégorie/genre

## 🎒 Kit de l'Athlète

### Semi-Marathon
- Dossard avec puce RFID
- T-shirt technique officiel
- Médaille de finisher
- Matériel promotionnel
- Informations de l'événement

### Marche
- Dossard
- T-shirt officiel de l'événement

## 🚰 Ravitaillements

### Semi-Marathon (21,097 km)
- **5 km** – Eau
- **10 km** – Eau + isotonique
- **15 km** – Eau + isotonique
- **Arrivée** – Eau, isotonique et fruits

### Marche (5 km)
- **Point intermédiaire** – Eau
- **Arrivée** – Eau et fruits

## 🏆 Prix

### Semi-Marathon
- **Médaille** pour tous les finishers
- **Prix en espèces :**
  - Top 10 classement général (Masculin et Féminin)
  - Vainqueurs de chaque catégorie d'âge (minimum 10 athlètes par catégorie)
- **Trophées :** Top 3 classement général (Masculin et Féminin)

### Marche
- Non compétitive (sans prix)

## 🚨 Sécurité et Services

- Assistance médicale tout au long du parcours
- Ambulances dédiées
- Assurance sportive obligatoire incluse
- Vestiaire à la zone départ/arrivée
- Douches (lieu à annoncer)
- Chronométrage officiel avec puce RFID

## 📝 Règles Importantes

- Dossards **non transférables**
- **Interdit :**
  - Vélos, rollers, skateboards
  - Animaux de compagnie
  - Véhicules non autorisés
- **Contrôle antidopage** possible (ADoP / World Athletics)

## ❌ Politique d'Annulation

En cas de force majeure (conditions météorologiques défavorables, restrictions gouvernementales, sécurité), l'organisation pourra :
- Reprogrammer l'événement
- Effectuer un remboursement partiel ou total
- Transférer l'inscription à l'édition suivante

## 📞 Contacts

- **Email :** info@globalsport.pt
- **Site Web Officiel :** [www.douro-half-marathon.com](https://www.douro-half-marathon.com/)
- **Inscriptions :** [StopAndGo](https://stopandgo.net/events/meia-maratona-do-douro-2026)

---

**Venez courir "La Plus Belle Course du Monde" au cœur du Douro Vinhateiro ! 🍇🏃**`,
      city: "Peso da Régua",
      metaTitle:
        "Semi-Marathon du Douro Vinhateiro 2026 - 19e Édition | Peso da Régua | 24 Mai",
      metaDescription:
        "Semi-Marathon du Douro Vinhateiro 2026 - 19e édition le 24 mai à Peso da Régua. La Plus Belle Course du Monde dans la Vallée du Douro UNESCO. 21km + Marche 5km. Inscriptions ouvertes.",
    },
    de: {
      title: "Douro Weinregion Halbmarathon",
      description: `Der **Douro Weinregion Halbmarathon** kehrt am **24. Mai 2026** zu seiner **19. Ausgabe** zurück, bekannt als **"Das Schönste Rennen der Welt"** 🌍🍇

Organisiert von **GlobalSport – GSX Portugal Lda.**, führt dieses ikonische Rennen durch das **Douro-Tal**, eine Region, die als **UNESCO-Weltkulturerbe** klassifiziert ist und einzigartige Ausblicke auf terrassierte Weinberge, den Douro-Fluss und Weindörfer bietet.

## 🏃 Über das Rennen

Der Douro Weinregion Halbmarathon ist ein Straßenrennen, das **vom Portugiesischen Leichtathletikverband zertifiziert** ist, mit **offizieller RFID-Chip-Zeitmessung**, das Läufer aus der ganzen Welt wegen der einzigartigen Schönheit der Strecke anzieht.

## 🏔️ Strecke

Die **21,097 km** lange Strecke durchquert:
- **Peso da Régua** (Start und Ziel)
- **Lamego**
- **Armamar**

Entworfen entlang des **Douro-Tals**, einem UNESCO-Weltkulturerbe, mit spektakulären Ausblicken auf terrassierte Weinberge und den Fluss.

## 🏃 Verfügbare Veranstaltungen

### Halbmarathon (21,097 km)
- **Typ:** Wettkampf
- **Distanz:** 21,097 km (FPA-zertifizierte Strecke)
- **Mindestalter:** 18 Jahre (geboren 2008 oder früher)
- **Start:** 09:00 Uhr
- **Zeitlimit:** 3 Stunden (Schließung um 12:00 Uhr)
- **Zeitmessung:** Offiziell mit RFID-Chip
- **Inklusive:** Startnummer mit Chip, offizielles technisches T-Shirt, Finisher-Medaille, Werbematerial

### Wanderung (5 km)
- **Typ:** Nicht-wettkampfmäßig / Freizeit
- **Distanz:** 5 km
- **Alter:** Alle Altersgruppen
- **Start:** 09:20 Uhr
- **Zeitlimit:** 3 Stunden
- **Erforderlich:** Offizielles Event-T-Shirt
- **Inklusive:** Startnummer, offizielles T-Shirt

**Kinder bis 9 Jahre:** Wanderung mit Sonderpreis von 5,00 €

## 📋 Alterskategorien (Halbmarathon)

- **Senioren:** 18–39 Jahre
- **Veteranen I:** 40–44 Jahre
- **Veteranen II:** 45–49 Jahre
- **Veteranen III:** 50–54 Jahre
- **Veteranen IV:** 55–59 Jahre
- **Veteranen V:** 60+ Jahre

⚠️ **Hinweis:** Alterskategoriepreise werden mit mindestens 3 Athleten pro Kategorie/Geschlecht vergeben

## 🎒 Athleten-Kit

### Halbmarathon
- Startnummer mit RFID-Chip
- Offizielles technisches T-Shirt
- Finisher-Medaille
- Werbematerial
- Event-Informationen

### Wanderung
- Startnummer
- Offizielles Event-T-Shirt

## 🚰 Verpflegungsstationen

### Halbmarathon (21,097 km)
- **5 km** – Wasser
- **10 km** – Wasser + Isotonisch
- **15 km** – Wasser + Isotonisch
- **Ziel** – Wasser, Isotonisch und Obst

### Wanderung (5 km)
- **Mittelpunkt** – Wasser
- **Ziel** – Wasser und Obst

## 🏆 Preise

### Halbmarathon
- **Medaille** für alle Finisher
- **Geldpreise:**
  - Top 10 Gesamtwertung (Männer und Frauen)
  - Gewinner jeder Alterskategorie (mindestens 10 Athleten pro Kategorie)
- **Trophäen:** Top 3 Gesamtwertung (Männer und Frauen)

### Wanderung
- Nicht-wettkampfmäßig (keine Preise)

## 🚨 Sicherheit und Dienstleistungen

- Medizinische Versorgung entlang der gesamten Strecke
- Dedizierte Krankenwagen
- Obligatorische Sportversicherung inklusive
- Gepäckaufbewahrung im Start-/Zielbereich
- Duschen (Ort wird bekannt gegeben)
- Offizielle RFID-Chip-Zeitmessung

## 📝 Wichtige Regeln

- Startnummern **nicht übertragbar**
- **Verboten:**
  - Fahrräder, Rollschuhe, Skateboards
  - Haustiere
  - Nicht autorisierte Fahrzeuge
- **Dopingkontrolle** möglich (ADoP / World Athletics)

## ❌ Stornierungsrichtlinie

Im Falle höherer Gewalt (ungünstige Wetterbedingungen, Regierungsbeschränkungen, Sicherheit) kann die Organisation:
- Die Veranstaltung verschieben
- Teilweise oder vollständige Rückerstattung vornehmen
- Anmeldung auf nächste Ausgabe übertragen

## 📞 Kontakte

- **E-Mail:** info@globalsport.pt
- **Offizielle Website:** [www.douro-half-marathon.com](https://www.douro-half-marathon.com/)
- **Anmeldung:** [StopAndGo](https://stopandgo.net/events/meia-maratona-do-douro-2026)

---

**Kommen Sie und laufen Sie "Das Schönste Rennen der Welt" im Herzen der Douro Weinregion! 🍇🏃**`,
      city: "Peso da Régua",
      metaTitle:
        "Douro Weinregion Halbmarathon 2026 - 19. Ausgabe | Peso da Régua | 24. Mai",
      metaDescription:
        "Douro Weinregion Halbmarathon 2026 - 19. Ausgabe am 24. Mai in Peso da Régua. Das Schönste Rennen der Welt im UNESCO Douro-Tal. 21km + 5km Wanderung. Anmeldung offen.",
    },
    it: {
      title: "Mezza Maratona del Douro Vinhateiro",
      description: `La **Mezza Maratona del Douro Vinhateiro** torna il **24 maggio 2026** per la sua **19ª edizione**, conosciuta come **"La Corsa Più Bella del Mondo"** 🌍🍇

Organizzata da **GlobalSport – GSX Portugal Lda.**, questa iconica gara percorre la **Valle del Douro**, regione classificata come **Patrimonio Mondiale dell'UNESCO**, offrendo viste uniche su vigneti terrazzati, il fiume Douro e villaggi vinicoli.

## 🏃 Sulla Gara

La Mezza Maratona del Douro Vinhateiro è una gara su strada **certificata dalla Federazione Portoghese di Atletica**, con **cronometraggio ufficiale tramite chip RFID**, che attira corridori da tutto il mondo per la bellezza unica del percorso.

## 🏔️ Percorso

Il percorso di **21,097 km** attraversa:
- **Peso da Régua** (partenza e arrivo)
- **Lamego**
- **Armamar**

Disegnato lungo la **Valle del Douro**, sito Patrimonio Mondiale UNESCO, con viste spettacolari su vigneti terrazzati e il fiume.

## 🏃 Eventi Disponibili

### Mezza Maratona (21,097 km)
- **Tipo:** Competitivo
- **Distanza:** 21,097 km (percorso certificato FPA)
- **Età Minima:** 18 anni (nati nel 2008 o prima)
- **Partenza:** 09:00
- **Tempo Limite:** 3 ore (chiusura alle 12:00)
- **Cronometraggio:** Ufficiale con chip RFID
- **Include:** Pettorale con chip, t-shirt tecnica ufficiale, medaglia finisher, materiale promozionale

### Camminata (5 km)
- **Tipo:** Non competitivo / ricreativo
- **Distanza:** 5 km
- **Età:** Tutte le età
- **Partenza:** 09:20
- **Tempo Limite:** 3 ore
- **Obbligatorio:** T-shirt ufficiale dell'evento
- **Include:** Pettorale, t-shirt ufficiale

**Bambini fino a 9 anni:** Camminata con prezzo speciale di €5,00

## 📋 Categorie di Età (Mezza Maratona)

- **Senior:** 18–39 anni
- **Veterani I:** 40–44 anni
- **Veterani II:** 45–49 anni
- **Veterani III:** 50–54 anni
- **Veterani IV:** 55–59 anni
- **Veterani V:** 60+ anni

⚠️ **Nota:** Premi per categoria assegnati con minimo 3 atleti per categoria/genere

## 🎒 Kit dell'Atleta

### Mezza Maratona
- Pettorale con chip RFID
- T-shirt tecnica ufficiale
- Medaglia di finisher
- Materiale promozionale
- Informazioni sull'evento

### Camminata
- Pettorale
- T-shirt ufficiale dell'evento

## 🚰 Ristori

### Mezza Maratona (21,097 km)
- **5 km** – Acqua
- **10 km** – Acqua + isotonica
- **15 km** – Acqua + isotonica
- **Arrivo** – Acqua, isotonica e frutta

### Camminata (5 km)
- **Punto intermedio** – Acqua
- **Arrivo** – Acqua e frutta

## 🏆 Premi

### Mezza Maratona
- **Medaglia** per tutti i finisher
- **Premi in denaro:**
  - Top 10 classifica generale (Maschile e Femminile)
  - Vincitori di ogni categoria di età (minimo 10 atleti per categoria)
- **Trofei:** Top 3 classifica generale (Maschile e Femminile)

### Camminata
- Non competitiva (senza premi)

## 🚨 Sicurezza e Servizi

- Assistenza medica lungo tutto il percorso
- Ambulanze dedicate
- Assicurazione sportiva obbligatoria inclusa
- Deposito bagagli nella zona partenza/arrivo
- Docce (luogo da annunciare)
- Cronometraggio ufficiale con chip RFID

## 📝 Regole Importanti

- Pettorali **non trasferibili**
- **Vietato:**
  - Biciclette, pattini, skateboard
  - Animali domestici
  - Veicoli non autorizzati
- **Controllo antidoping** possibile (ADoP / World Athletics)

## ❌ Politica di Cancellazione

In caso di forza maggiore (condizioni meteorologiche avverse, restrizioni governative, sicurezza), l'organizzazione potrà:
- Riprogrammare l'evento
- Effettuare rimborso parziale o totale
- Trasferire iscrizione all'edizione successiva

## 📞 Contatti

- **Email:** info@globalsport.pt
- **Sito Web Ufficiale:** [www.douro-half-marathon.com](https://www.douro-half-marathon.com/)
- **Iscrizioni:** [StopAndGo](https://stopandgo.net/events/meia-maratona-do-douro-2026)

---

**Vieni a correre "La Corsa Più Bella del Mondo" nel cuore del Douro Vinhateiro! 🍇🏃**`,
      city: "Peso da Régua",
      metaTitle:
        "Mezza Maratona del Douro Vinhateiro 2026 - 19ª Edizione | Peso da Régua | 24 Maggio",
      metaDescription:
        "Mezza Maratona del Douro Vinhateiro 2026 - 19ª edizione il 24 maggio a Peso da Régua. La Corsa Più Bella del Mondo nella Valle del Douro UNESCO. 21km + Camminata 5km. Iscrizioni aperte.",
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

  // Variant 1: Meia Maratona (21,097 km)
  const variantHalfMarathon = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Meia Maratona",
      distanceKm: 21.097,
      cutoffTimeHours: 3.0,
      startTime: "09:00",
    },
  });

  console.log(`✅ Created variant: ${variantHalfMarathon.name}`);

  // Pricing phases for Meia Maratona
  const halfMarathonPricingPhases = [
    {
      name: "Early Bird (500 primeiros)",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-12-31T23:59:59Z"),
      price: 24.9,
      currency: Currency.EUR,
      note: "Limitado aos primeiros 500 inscritos",
    },
    {
      name: "1ª Fase",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2025-12-31T23:59:59Z"),
      price: 30.0,
      currency: Currency.EUR,
      note: "Até 31/12/2025",
    },
    {
      name: "2ª Fase",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-05-17T23:59:59Z"),
      price: 35.0,
      currency: Currency.EUR,
      note: "Até 17/05/2026",
    },
    {
      name: "Última Fase",
      startDate: new Date("2026-05-18T00:00:00Z"),
      endDate: new Date("2026-05-21T23:59:59Z"),
      price: 70.0,
      currency: Currency.EUR,
      note: "18 a 21/05/2026",
    },
    {
      name: "Secretariado",
      startDate: new Date("2026-05-22T00:00:00Z"),
      endDate: new Date("2026-05-23T23:59:59Z"),
      price: 75.0,
      currency: Currency.EUR,
      note: "22 e 23/05/2026",
    },
  ];

  for (const phase of halfMarathonPricingPhases) {
    await prisma.pricingPhase.create({
      data: {
        eventId: event.id,
        name: `Meia Maratona - ${phase.name}`,
        startDate: phase.startDate,
        endDate: phase.endDate,
        price: phase.price,
        currency: phase.currency,
        note: phase.note,
      },
    });
  }

  console.log(
    `   - Created ${halfMarathonPricingPhases.length} pricing phases`
  );

  // Variant 2: Caminhada (5 km)
  const variantWalk = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Caminhada",
      distanceKm: 5.0,
      cutoffTimeHours: 3.0,
      startTime: "09:20",
    },
  });

  console.log(`✅ Created variant: ${variantWalk.name}`);

  // Pricing phases for Caminhada
  const walkPricingPhases = [
    {
      name: "Early Bird",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2025-12-31T23:59:59Z"),
      price: 10.0,
      currency: Currency.EUR,
      note: "Early Bird",
    },
    {
      name: "Até 31/12/2025",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2025-12-31T23:59:59Z"),
      price: 12.0,
      currency: Currency.EUR,
      note: "Até 31/12/2025",
    },
    {
      name: "Até 17/05/2026",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-05-17T23:59:59Z"),
      price: 15.0,
      currency: Currency.EUR,
      note: "Até 17/05/2026",
    },
    {
      name: "18-21/05/2026",
      startDate: new Date("2026-05-18T00:00:00Z"),
      endDate: new Date("2026-05-21T23:59:59Z"),
      price: 17.0,
      currency: Currency.EUR,
      note: "18 a 21/05/2026",
    },
    {
      name: "Secretariado",
      startDate: new Date("2026-05-22T00:00:00Z"),
      endDate: new Date("2026-05-23T23:59:59Z"),
      price: 20.0,
      currency: Currency.EUR,
      note: "22 e 23/05/2026",
    },
  ];

  for (const phase of walkPricingPhases) {
    await prisma.pricingPhase.create({
      data: {
        eventId: event.id,
        name: `Caminhada - ${phase.name}`,
        startDate: phase.startDate,
        endDate: phase.endDate,
        price: phase.price,
        currency: phase.currency,
        note: phase.note,
      },
    });
  }

  console.log(`   - Created ${walkPricingPhases.length} pricing phases`);

  // Variant 3: Caminhada Crianças (até 9 anos)
  const variantKidsWalk = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Caminhada Crianças (até 9 anos)",
      distanceKm: 5.0,
      cutoffTimeHours: 3.0,
      startTime: "09:20",
      price: 5.0,
      currency: Currency.EUR,
    },
  });

  console.log(`✅ Created variant: ${variantKidsWalk.name}`);

  // Single pricing phase for kids (fixed €5)
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Caminhada Crianças - Preço Fixo",
      startDate: new Date("2026-01-01T00:00:00Z"),
      endDate: new Date("2026-05-23T23:59:59Z"),
      price: 5.0,
      currency: Currency.EUR,
      note: "Crianças até 9 anos - preço fixo",
    },
  });

  console.log(`   - Created 1 pricing phase`);

  console.log("✅ Meia Maratona do Douro Vinhateiro 2026 seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding Meia Maratona do Douro:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
