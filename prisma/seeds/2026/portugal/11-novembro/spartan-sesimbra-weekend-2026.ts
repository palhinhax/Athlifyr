/**
 * Seed Sesimbra Spartan Weekend 2026
 * Complete with translations in all 6 languages
 * Trifecta Weekend - Sprint, Super & Beast races
 * Location: Praia da Califórnia, Sesimbra, Portugal
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⚔️ Seeding Sesimbra Spartan Weekend 2026...");

  // Step 1: Upsert the event
  const event = await prisma.event.upsert({
    where: { slug: "spartan-sesimbra-weekend-2026" },
    update: {
      title: "Sesimbra Spartan Weekend 2026",
      description: `## ⚔️ Sesimbra Spartan Weekend 2026

**O Spartan está de volta a Portugal! Prepara-te para o Trifecta Weekend!**

Após uma estreia incrível, o Spartan regressa a Sesimbra, um percurso que conquistou todos aqueles que o experimentaram. Desde praias de areia fina a montanhas escarpadas, passando por um antigo castelo, este percurso oferece vistas de tirar o fôlego a cada passo.

### 🏆 Fim de Semana Trifecta

Completa uma Sprint, Super e Beast num só fim de semana para conquistar o desafio máximo da Spartan! Este é um dos últimos eventos da **Wolf Season** - não percas esta oportunidade!

### 🏃 As Provas

**Sprint 5K** - O início perfeito
- Distância: 5 km
- Obstáculos: 20
- Duração média: 1h 32m 12s
- Data: 7-8 Novembro 2026

**Super 10K** - O próximo nível
- Distância: 10 km
- Obstáculos: 25
- Duração média: 2h 25m 31s
- Data: 8 Novembro 2026

**Beast 21K** - O desafio supremo
- Distância: 21 km
- Obstáculos: 30
- Duração média: 4h 45m 26s
- Data: 7 Novembro 2026

**Kids Race 1-3K** - Para os mais jovens
- Distância: 1-3 km
- Obstáculos: 10-20
- Duração média: 32m 16s
- Data: 7 Novembro 2026

### 🌊 Vistas Deslumbrantes

Desfruta de vistas deslumbrantes do **Oceano Atlântico**, numa corrida por esta pitoresca vila de pescadores. O percurso passa por:
- 🏖️ Praias de areia fina
- ⛰️ Montanhas escarpadas
- 🏰 Antigo castelo medieval
- 🌅 Vistas panorâmicas do oceano

### 📍 Localização

A apenas **uma hora de viagem a sul de Lisboa**, Sesimbra é o destino perfeito para um fim de semana Spartan épico!

**Local:** Praia da Califórnia, Sesimbra

### 🎁 O Que Está Incluído

- 🏅 Medalha Finisher
- 👕 T-Shirt oficial Spartan
- 🔺 Trifecta Wedge
- 📸 Acesso a fotos oficiais
- 🏥 Seguro de acidentes Spartan
- 💧 Abastecimentos ao longo do percurso

### ⚠️ Regras Importantes

- Todos os obstáculos devem ser tentados
- Falhar um obstáculo = 30 Burpees de penalização
- É proibido ajuda externa fora das zonas designadas
- Respeitar os voluntários e outros atletas

### 📅 Programa

**Sábado, 7 Novembro 2026:**
- Sprint 5K (múltiplas vagas)
- Beast 21K
- Kids Race

**Domingo, 8 Novembro 2026:**
- Sprint 5K (múltiplas vagas)
- Super 10K

### ℹ️ Informações Importantes

- 🌐 Evento internacional com Spartans de todo o mundo
- 🐺 Parte da Wolf Season 2026
- 📍 Coordenadas: 38.4441, -9.1048
- 🔗 [spartan.com](https://www.spartan.com)

**AROO! 🔥**`,
      startDate: new Date("2026-11-07T08:00:00Z"),
      endDate: new Date("2026-11-08T18:00:00Z"),
      registrationDeadline: new Date("2026-11-06T23:59:59Z"),
      sportTypes: [SportType.OCR, SportType.RUNNING],
      city: "Sesimbra",
      country: "Portugal",
      latitude: 38.4441,
      longitude: -9.1048,
      googleMapsUrl: "https://maps.app.goo.gl/sesimbra",
      externalUrl: "https://www.spartan.com",
      imageUrl: "",
      isFeatured: true,
    },
    create: {
      title: "Sesimbra Spartan Weekend 2026",
      slug: "spartan-sesimbra-weekend-2026",
      description: `## ⚔️ Sesimbra Spartan Weekend 2026

**O Spartan está de volta a Portugal! Prepara-te para o Trifecta Weekend!**

Após uma estreia incrível, o Spartan regressa a Sesimbra, um percurso que conquistou todos aqueles que o experimentaram. Desde praias de areia fina a montanhas escarpadas, passando por um antigo castelo, este percurso oferece vistas de tirar o fôlego a cada passo.

### 🏆 Fim de Semana Trifecta

Completa uma Sprint, Super e Beast num só fim de semana para conquistar o desafio máximo da Spartan! Este é um dos últimos eventos da **Wolf Season** - não percas esta oportunidade!

### 🏃 As Provas

**Sprint 5K** - O início perfeito
- Distância: 5 km
- Obstáculos: 20
- Duração média: 1h 32m 12s
- Data: 7-8 Novembro 2026

**Super 10K** - O próximo nível
- Distância: 10 km
- Obstáculos: 25
- Duração média: 2h 25m 31s
- Data: 8 Novembro 2026

**Beast 21K** - O desafio supremo
- Distância: 21 km
- Obstáculos: 30
- Duração média: 4h 45m 26s
- Data: 7 Novembro 2026

**Kids Race 1-3K** - Para os mais jovens
- Distância: 1-3 km
- Obstáculos: 10-20
- Duração média: 32m 16s
- Data: 7 Novembro 2026

### 🌊 Vistas Deslumbrantes

Desfruta de vistas deslumbrantes do **Oceano Atlântico**, numa corrida por esta pitoresca vila de pescadores. O percurso passa por:
- 🏖️ Praias de areia fina
- ⛰️ Montanhas escarpadas
- 🏰 Antigo castelo medieval
- 🌅 Vistas panorâmicas do oceano

### 📍 Localização

A apenas **uma hora de viagem a sul de Lisboa**, Sesimbra é o destino perfeito para um fim de semana Spartan épico!

**Local:** Praia da Califórnia, Sesimbra

### 🎁 O Que Está Incluído

- 🏅 Medalha Finisher
- 👕 T-Shirt oficial Spartan
- 🔺 Trifecta Wedge
- 📸 Acesso a fotos oficiais
- 🏥 Seguro de acidentes Spartan
- 💧 Abastecimentos ao longo do percurso

### ⚠️ Regras Importantes

- Todos os obstáculos devem ser tentados
- Falhar um obstáculo = 30 Burpees de penalização
- É proibido ajuda externa fora das zonas designadas
- Respeitar os voluntários e outros atletas

### 📅 Programa

**Sábado, 7 Novembro 2026:**
- Sprint 5K (múltiplas vagas)
- Beast 21K
- Kids Race

**Domingo, 8 Novembro 2026:**
- Sprint 5K (múltiplas vagas)
- Super 10K

### ℹ️ Informações Importantes

- 🌐 Evento internacional com Spartans de todo o mundo
- 🐺 Parte da Wolf Season 2026
- 📍 Coordenadas: 38.4441, -9.1048
- 🔗 [spartan.com](https://www.spartan.com)

**AROO! 🔥**`,
      startDate: new Date("2026-11-07T08:00:00Z"),
      endDate: new Date("2026-11-08T18:00:00Z"),
      registrationDeadline: new Date("2026-11-06T23:59:59Z"),
      sportTypes: [SportType.OCR, SportType.RUNNING],
      city: "Sesimbra",
      country: "Portugal",
      latitude: 38.4441,
      longitude: -9.1048,
      googleMapsUrl: "https://maps.app.goo.gl/sesimbra",
      externalUrl: "https://www.spartan.com",
      imageUrl: "",
      isFeatured: true,
    },
  });

  console.log(`✅ Event upserted with ID: ${event.id}`);

  // Step 2: Upsert translations for all 6 languages
  const languages = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  const translations = {
    pt: {
      title: "Sesimbra Spartan Weekend 2026",
      description: `## ⚔️ Sesimbra Spartan Weekend 2026

**O Spartan está de volta a Portugal! Prepara-te para o Trifecta Weekend!**

Após uma estreia incrível, o Spartan regressa a Sesimbra, um percurso que conquistou todos aqueles que o experimentaram. Desde praias de areia fina a montanhas escarpadas, passando por um antigo castelo, este percurso oferece vistas de tirar o fôlego a cada passo.

### 🏆 Fim de Semana Trifecta

Completa uma Sprint, Super e Beast num só fim de semana para conquistar o desafio máximo da Spartan! Este é um dos últimos eventos da **Wolf Season** - não percas esta oportunidade!

### 🏃 As Provas

**Sprint 5K** - O início perfeito
- Distância: 5 km
- Obstáculos: 20
- Duração média: 1h 32m 12s

**Super 10K** - O próximo nível
- Distância: 10 km
- Obstáculos: 25
- Duração média: 2h 25m 31s

**Beast 21K** - O desafio supremo
- Distância: 21 km
- Obstáculos: 30
- Duração média: 4h 45m 26s

**Kids Race 1-3K** - Para os mais jovens
- Distância: 1-3 km
- Obstáculos: 10-20
- Duração média: 32m 16s

### 🌊 Vistas Deslumbrantes

Desfruta de vistas deslumbrantes do **Oceano Atlântico**, numa corrida por esta pitoresca vila de pescadores. O percurso passa por:
- 🏖️ Praias de areia fina
- ⛰️ Montanhas escarpadas
- 🏰 Antigo castelo medieval
- 🌅 Vistas panorâmicas do oceano

### 📍 Localização

A apenas **uma hora de viagem a sul de Lisboa**, Sesimbra é o destino perfeito para um fim de semana Spartan épico!

### 🎁 O Que Está Incluído

- 🏅 Medalha Finisher
- 👕 T-Shirt oficial Spartan
- 🔺 Trifecta Wedge
- 📸 Acesso a fotos oficiais
- 🏥 Seguro de acidentes Spartan

### ⚠️ Regras Importantes

- Todos os obstáculos devem ser tentados
- Falhar um obstáculo = 30 Burpees de penalização
- É proibido ajuda externa fora das zonas designadas

### 📅 Programa

**Sábado, 7 Novembro 2026:**
- Sprint 5K, Beast 21K, Kids Race

**Domingo, 8 Novembro 2026:**
- Sprint 5K, Super 10K

**AROO! 🔥**`,
      city: "Sesimbra",
      metaTitle: "Spartan Sesimbra Weekend 2026 | Trifecta | 7-8 Novembro",
      metaDescription:
        "Spartan Sesimbra Weekend 2026 - 7-8 novembro. Trifecta Weekend: Sprint 5K, Super 10K e Beast 21K. Vistas deslumbrantes do Atlântico. A 1h de Lisboa. Wolf Season.",
    },
    en: {
      title: "Sesimbra Spartan Weekend 2026",
      description: `## ⚔️ Sesimbra Spartan Weekend 2026

**Spartan is back in Portugal! Get ready for Trifecta Weekend!**

After an incredible debut, Spartan returns to Sesimbra, a course that conquered everyone who experienced it. From fine sandy beaches to rugged mountains, passing by an ancient castle, this course offers breathtaking views at every step.

### 🏆 Trifecta Weekend

Complete a Sprint, Super and Beast in one weekend to conquer Spartan's ultimate challenge! This is one of the last events of the **Wolf Season** - don't miss this opportunity!

### 🏃 The Races

**Sprint 5K** - The perfect start
- Distance: 5 km
- Obstacles: 20
- Average time: 1h 32m 12s

**Super 10K** - The next level
- Distance: 10 km
- Obstacles: 25
- Average time: 2h 25m 31s

**Beast 21K** - The ultimate challenge
- Distance: 21 km
- Obstacles: 30
- Average time: 4h 45m 26s

**Kids Race 1-3K** - For the youngest
- Distance: 1-3 km
- Obstacles: 10-20
- Average time: 32m 16s

### 🌊 Stunning Views

Enjoy stunning views of the **Atlantic Ocean**, racing through this picturesque fishing village. The course passes through:
- 🏖️ Fine sandy beaches
- ⛰️ Rugged mountains
- 🏰 Ancient medieval castle
- 🌅 Panoramic ocean views

### 📍 Location

Just **one hour drive south of Lisbon**, Sesimbra is the perfect destination for an epic Spartan weekend!

### 🎁 What's Included

- 🏅 Finisher Medal
- 👕 Official Spartan T-Shirt
- 🔺 Trifecta Wedge
- 📸 Access to official photos
- 🏥 Spartan accident insurance

### ⚠️ Important Rules

- All obstacles must be attempted
- Failing an obstacle = 30 Burpees penalty
- External assistance outside designated zones is prohibited

### 📅 Schedule

**Saturday, November 7, 2026:**
- Sprint 5K, Beast 21K, Kids Race

**Sunday, November 8, 2026:**
- Sprint 5K, Super 10K

**AROO! 🔥**`,
      city: "Sesimbra",
      metaTitle: "Spartan Sesimbra Weekend 2026 | Trifecta | November 7-8",
      metaDescription:
        "Spartan Sesimbra Weekend 2026 - November 7-8. Trifecta Weekend: Sprint 5K, Super 10K and Beast 21K. Stunning Atlantic views. 1h from Lisbon. Wolf Season.",
    },
    es: {
      title: "Sesimbra Spartan Weekend 2026",
      description: `## ⚔️ Sesimbra Spartan Weekend 2026

**¡Spartan vuelve a Portugal! ¡Prepárate para el Trifecta Weekend!**

Después de un debut increíble, Spartan regresa a Sesimbra, un recorrido que conquistó a todos los que lo experimentaron. Desde playas de arena fina hasta montañas escarpadas, pasando por un antiguo castillo, este recorrido ofrece vistas impresionantes a cada paso.

### 🏆 Fin de Semana Trifecta

¡Completa una Sprint, Super y Beast en un solo fin de semana para conquistar el desafío máximo de Spartan! ¡Este es uno de los últimos eventos de la **Wolf Season** - no pierdas esta oportunidad!

### 🏃 Las Carreras

**Sprint 5K** - El comienzo perfecto
- Distancia: 5 km
- Obstáculos: 20
- Duración media: 1h 32m 12s

**Super 10K** - El siguiente nivel
- Distancia: 10 km
- Obstáculos: 25
- Duración media: 2h 25m 31s

**Beast 21K** - El desafío supremo
- Distancia: 21 km
- Obstáculos: 30
- Duración media: 4h 45m 26s

**Kids Race 1-3K** - Para los más jóvenes
- Distancia: 1-3 km
- Obstáculos: 10-20
- Duración media: 32m 16s

### 🌊 Vistas Impresionantes

Disfruta de vistas impresionantes del **Océano Atlántico**, corriendo por este pintoresco pueblo pesquero. El recorrido pasa por:
- 🏖️ Playas de arena fina
- ⛰️ Montañas escarpadas
- 🏰 Antiguo castillo medieval
- 🌅 Vistas panorámicas del océano

### 📍 Ubicación

A solo **una hora en coche al sur de Lisboa**, ¡Sesimbra es el destino perfecto para un épico fin de semana Spartan!

### 🎁 Qué Está Incluido

- 🏅 Medalla Finisher
- 👕 Camiseta oficial Spartan
- 🔺 Trifecta Wedge
- 📸 Acceso a fotos oficiales
- 🏥 Seguro de accidentes Spartan

### ⚠️ Reglas Importantes

- Todos los obstáculos deben intentarse
- Fallar un obstáculo = 30 Burpees de penalización
- Está prohibida la ayuda externa fuera de las zonas designadas

### 📅 Programa

**Sábado, 7 Noviembre 2026:**
- Sprint 5K, Beast 21K, Kids Race

**Domingo, 8 Noviembre 2026:**
- Sprint 5K, Super 10K

**¡AROO! 🔥**`,
      city: "Sesimbra",
      metaTitle: "Spartan Sesimbra Weekend 2026 | Trifecta | 7-8 Noviembre",
      metaDescription:
        "Spartan Sesimbra Weekend 2026 - 7-8 noviembre. Trifecta Weekend: Sprint 5K, Super 10K y Beast 21K. Vistas impresionantes del Atlántico. A 1h de Lisboa. Wolf Season.",
    },
    fr: {
      title: "Sesimbra Spartan Weekend 2026",
      description: `## ⚔️ Sesimbra Spartan Weekend 2026

**Spartan est de retour au Portugal ! Préparez-vous pour le Trifecta Weekend !**

Après un début incroyable, Spartan revient à Sesimbra, un parcours qui a conquis tous ceux qui l'ont expérimenté. Des plages de sable fin aux montagnes escarpées, en passant par un ancien château, ce parcours offre des vues à couper le souffle à chaque pas.

### 🏆 Week-end Trifecta

Complétez une Sprint, Super et Beast en un seul week-end pour conquérir le défi ultime de Spartan ! C'est l'un des derniers événements de la **Wolf Season** - ne manquez pas cette opportunité !

### 🏃 Les Courses

**Sprint 5K** - Le début parfait
- Distance : 5 km
- Obstacles : 20
- Durée moyenne : 1h 32m 12s

**Super 10K** - Le niveau suivant
- Distance : 10 km
- Obstacles : 25
- Durée moyenne : 2h 25m 31s

**Beast 21K** - Le défi suprême
- Distance : 21 km
- Obstacles : 30
- Durée moyenne : 4h 45m 26s

**Kids Race 1-3K** - Pour les plus jeunes
- Distance : 1-3 km
- Obstacles : 10-20
- Durée moyenne : 32m 16s

### 🌊 Vues Époustouflantes

Profitez de vues époustouflantes sur l'**Océan Atlantique**, en courant à travers ce pittoresque village de pêcheurs. Le parcours passe par :
- 🏖️ Plages de sable fin
- ⛰️ Montagnes escarpées
- 🏰 Ancien château médiéval
- 🌅 Vues panoramiques sur l'océan

### 📍 Localisation

À seulement **une heure de route au sud de Lisbonne**, Sesimbra est la destination parfaite pour un week-end Spartan épique !

### 🎁 Ce Qui Est Inclus

- 🏅 Médaille Finisher
- 👕 T-Shirt officiel Spartan
- 🔺 Trifecta Wedge
- 📸 Accès aux photos officielles
- 🏥 Assurance accidents Spartan

### ⚠️ Règles Importantes

- Tous les obstacles doivent être tentés
- Échouer un obstacle = 30 Burpees de pénalité
- L'assistance externe en dehors des zones désignées est interdite

### 📅 Programme

**Samedi 7 Novembre 2026 :**
- Sprint 5K, Beast 21K, Kids Race

**Dimanche 8 Novembre 2026 :**
- Sprint 5K, Super 10K

**AROO ! 🔥**`,
      city: "Sesimbra",
      metaTitle: "Spartan Sesimbra Weekend 2026 | Trifecta | 7-8 Novembre",
      metaDescription:
        "Spartan Sesimbra Weekend 2026 - 7-8 novembre. Trifecta Weekend : Sprint 5K, Super 10K et Beast 21K. Vues époustouflantes de l'Atlantique. À 1h de Lisbonne. Wolf Season.",
    },
    de: {
      title: "Sesimbra Spartan Weekend 2026",
      description: `## ⚔️ Sesimbra Spartan Weekend 2026

**Spartan ist zurück in Portugal! Mach dich bereit für das Trifecta Weekend!**

Nach einem unglaublichen Debüt kehrt Spartan nach Sesimbra zurück, eine Strecke, die alle erobert hat, die sie erlebt haben. Von feinen Sandstränden bis zu schroffen Bergen, vorbei an einer alten Burg, bietet diese Strecke bei jedem Schritt atemberaubende Ausblicke.

### 🏆 Trifecta-Wochenende

Absolviere eine Sprint, Super und Beast an einem Wochenende, um die ultimative Spartan-Herausforderung zu meistern! Dies ist eines der letzten Events der **Wolf Season** - verpasse diese Gelegenheit nicht!

### 🏃 Die Rennen

**Sprint 5K** - Der perfekte Start
- Distanz: 5 km
- Hindernisse: 20
- Durchschnittszeit: 1h 32m 12s

**Super 10K** - Das nächste Level
- Distanz: 10 km
- Hindernisse: 25
- Durchschnittszeit: 2h 25m 31s

**Beast 21K** - Die ultimative Herausforderung
- Distanz: 21 km
- Hindernisse: 30
- Durchschnittszeit: 4h 45m 26s

**Kids Race 1-3K** - Für die Jüngsten
- Distanz: 1-3 km
- Hindernisse: 10-20
- Durchschnittszeit: 32m 16s

### 🌊 Atemberaubende Ausblicke

Genieße atemberaubende Ausblicke auf den **Atlantischen Ozean**, während du durch dieses malerische Fischerdorf läufst. Die Strecke führt durch:
- 🏖️ Feine Sandstrände
- ⛰️ Schroffe Berge
- 🏰 Alte mittelalterliche Burg
- 🌅 Panoramablick auf den Ozean

### 📍 Standort

Nur **eine Stunde Fahrt südlich von Lissabon** ist Sesimbra das perfekte Ziel für ein episches Spartan-Wochenende!

### 🎁 Was Enthalten Ist

- 🏅 Finisher-Medaille
- 👕 Offizielles Spartan T-Shirt
- 🔺 Trifecta Wedge
- 📸 Zugang zu offiziellen Fotos
- 🏥 Spartan Unfallversicherung

### ⚠️ Wichtige Regeln

- Alle Hindernisse müssen versucht werden
- Ein Hindernis nicht schaffen = 30 Burpees Strafe
- Externe Hilfe außerhalb der ausgewiesenen Zonen ist verboten

### 📅 Programm

**Samstag, 7. November 2026:**
- Sprint 5K, Beast 21K, Kids Race

**Sonntag, 8. November 2026:**
- Sprint 5K, Super 10K

**AROO! 🔥**`,
      city: "Sesimbra",
      metaTitle: "Spartan Sesimbra Weekend 2026 | Trifecta | 7.-8. November",
      metaDescription:
        "Spartan Sesimbra Weekend 2026 - 7.-8. November. Trifecta Weekend: Sprint 5K, Super 10K und Beast 21K. Atemberaubende Atlantikblicke. 1h von Lissabon. Wolf Season.",
    },
    it: {
      title: "Sesimbra Spartan Weekend 2026",
      description: `## ⚔️ Sesimbra Spartan Weekend 2026

**Spartan è tornato in Portogallo! Preparati per il Trifecta Weekend!**

Dopo un debutto incredibile, Spartan ritorna a Sesimbra, un percorso che ha conquistato tutti coloro che l'hanno sperimentato. Dalle spiagge di sabbia fine alle montagne scoscese, passando per un antico castello, questo percorso offre viste mozzafiato ad ogni passo.

### 🏆 Weekend Trifecta

Completa una Sprint, Super e Beast in un solo weekend per conquistare la sfida definitiva di Spartan! Questo è uno degli ultimi eventi della **Wolf Season** - non perdere questa opportunità!

### 🏃 Le Gare

**Sprint 5K** - L'inizio perfetto
- Distanza: 5 km
- Ostacoli: 20
- Durata media: 1h 32m 12s

**Super 10K** - Il livello successivo
- Distanza: 10 km
- Ostacoli: 25
- Durata media: 2h 25m 31s

**Beast 21K** - La sfida suprema
- Distanza: 21 km
- Ostacoli: 30
- Durata media: 4h 45m 26s

**Kids Race 1-3K** - Per i più giovani
- Distanza: 1-3 km
- Ostacoli: 10-20
- Durata media: 32m 16s

### 🌊 Viste Mozzafiato

Goditi viste mozzafiato sull'**Oceano Atlantico**, correndo attraverso questo pittoresco villaggio di pescatori. Il percorso passa per:
- 🏖️ Spiagge di sabbia fine
- ⛰️ Montagne scoscese
- 🏰 Antico castello medievale
- 🌅 Viste panoramiche sull'oceano

### 📍 Posizione

A solo **un'ora di viaggio a sud di Lisbona**, Sesimbra è la destinazione perfetta per un epico weekend Spartan!

### 🎁 Cosa È Incluso

- 🏅 Medaglia Finisher
- 👕 T-Shirt ufficiale Spartan
- 🔺 Trifecta Wedge
- 📸 Accesso alle foto ufficiali
- 🏥 Assicurazione infortuni Spartan

### ⚠️ Regole Importanti

- Tutti gli ostacoli devono essere tentati
- Fallire un ostacolo = 30 Burpees di penalità
- L'assistenza esterna al di fuori delle zone designate è vietata

### 📅 Programma

**Sabato 7 Novembre 2026:**
- Sprint 5K, Beast 21K, Kids Race

**Domenica 8 Novembre 2026:**
- Sprint 5K, Super 10K

**AROO! 🔥**`,
      city: "Sesimbra",
      metaTitle: "Spartan Sesimbra Weekend 2026 | Trifecta | 7-8 Novembre",
      metaDescription:
        "Spartan Sesimbra Weekend 2026 - 7-8 novembre. Trifecta Weekend: Sprint 5K, Super 10K e Beast 21K. Viste mozzafiato dell'Atlantico. A 1h da Lisbona. Wolf Season.",
    },
  };

  for (const lang of languages) {
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
  }

  console.log(
    "📝 Translations upserted for 6 languages (pt, en, es, fr, de, it)"
  );

  // Step 3: Delete existing variants and create new ones
  await prisma.eventVariant.deleteMany({
    where: { eventId: event.id },
  });

  // Create variants
  const sprint5k = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Sprint 5K",
      distanceKm: 5,
      elevationGainM: null,
      startTime: "08:00",
      cutoffTimeHours: 3.0,
    },
  });

  const super10k = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Super 10K",
      distanceKm: 10,
      elevationGainM: null,
      startTime: "08:00",
      cutoffTimeHours: 5.0,
      startDate: new Date("2026-11-08T08:00:00Z"),
    },
  });

  const beast21k = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Beast 21K",
      distanceKm: 21,
      elevationGainM: null,
      startTime: "07:00",
      cutoffTimeHours: 8.0,
      startDate: new Date("2026-11-07T07:00:00Z"),
    },
  });

  const kidsRace = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Kids Race",
      distanceKm: 2,
      elevationGainM: null,
      startTime: "14:00",
      cutoffTimeHours: 1.5,
      startDate: new Date("2026-11-07T14:00:00Z"),
    },
  });

  const variants = [sprint5k, super10k, beast21k, kidsRace];

  console.log("🏃 Variants created (4 variants)");

  // Step 4: Upsert variant translations
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string }>
  > = {
    "Sprint 5K": {
      pt: {
        name: "Sprint 5K",
        description:
          "Corrida de obstáculos de 5km com 20 obstáculos. Duração média: 1h 32m. O início perfeito para o Trifecta.",
      },
      en: {
        name: "Sprint 5K",
        description:
          "5km obstacle course race with 20 obstacles. Average time: 1h 32m. The perfect start for the Trifecta.",
      },
      es: {
        name: "Sprint 5K",
        description:
          "Carrera de obstáculos de 5km con 20 obstáculos. Duración media: 1h 32m. El comienzo perfecto para el Trifecta.",
      },
      fr: {
        name: "Sprint 5K",
        description:
          "Course d'obstacles de 5km avec 20 obstacles. Durée moyenne: 1h 32m. Le début parfait pour le Trifecta.",
      },
      de: {
        name: "Sprint 5K",
        description:
          "5km Hindernislauf mit 20 Hindernissen. Durchschnittszeit: 1h 32m. Der perfekte Start für das Trifecta.",
      },
      it: {
        name: "Sprint 5K",
        description:
          "Corsa ad ostacoli di 5km con 20 ostacoli. Durata media: 1h 32m. L'inizio perfetto per il Trifecta.",
      },
    },
    "Super 10K": {
      pt: {
        name: "Super 10K",
        description:
          "Corrida de obstáculos de 10km com 25 obstáculos. Duração média: 2h 25m. O próximo nível do desafio Spartan.",
      },
      en: {
        name: "Super 10K",
        description:
          "10km obstacle course race with 25 obstacles. Average time: 2h 25m. The next level of the Spartan challenge.",
      },
      es: {
        name: "Super 10K",
        description:
          "Carrera de obstáculos de 10km con 25 obstáculos. Duración media: 2h 25m. El siguiente nivel del desafío Spartan.",
      },
      fr: {
        name: "Super 10K",
        description:
          "Course d'obstacles de 10km avec 25 obstacles. Durée moyenne: 2h 25m. Le niveau suivant du défi Spartan.",
      },
      de: {
        name: "Super 10K",
        description:
          "10km Hindernislauf mit 25 Hindernissen. Durchschnittszeit: 2h 25m. Das nächste Level der Spartan-Herausforderung.",
      },
      it: {
        name: "Super 10K",
        description:
          "Corsa ad ostacoli di 10km con 25 ostacoli. Durata media: 2h 25m. Il livello successivo della sfida Spartan.",
      },
    },
    "Beast 21K": {
      pt: {
        name: "Beast 21K",
        description:
          "Corrida de obstáculos de 21km com 30 obstáculos. Duração média: 4h 45m. O desafio supremo do Spartan.",
      },
      en: {
        name: "Beast 21K",
        description:
          "21km obstacle course race with 30 obstacles. Average time: 4h 45m. The ultimate Spartan challenge.",
      },
      es: {
        name: "Beast 21K",
        description:
          "Carrera de obstáculos de 21km con 30 obstáculos. Duración media: 4h 45m. El desafío supremo de Spartan.",
      },
      fr: {
        name: "Beast 21K",
        description:
          "Course d'obstacles de 21km avec 30 obstacles. Durée moyenne: 4h 45m. Le défi ultime de Spartan.",
      },
      de: {
        name: "Beast 21K",
        description:
          "21km Hindernislauf mit 30 Hindernissen. Durchschnittszeit: 4h 45m. Die ultimative Spartan-Herausforderung.",
      },
      it: {
        name: "Beast 21K",
        description:
          "Corsa ad ostacoli di 21km con 30 ostacoli. Durata media: 4h 45m. La sfida suprema di Spartan.",
      },
    },
    "Kids Race": {
      pt: {
        name: "Kids Race",
        description:
          "Corrida de obstáculos de 1-3km com 10-20 obstáculos. Duração média: 32m. Para os futuros Spartans!",
      },
      en: {
        name: "Kids Race",
        description:
          "1-3km obstacle course race with 10-20 obstacles. Average time: 32m. For the future Spartans!",
      },
      es: {
        name: "Kids Race",
        description:
          "Carrera de obstáculos de 1-3km con 10-20 obstáculos. Duración media: 32m. ¡Para los futuros Spartans!",
      },
      fr: {
        name: "Kids Race",
        description:
          "Course d'obstacles de 1-3km avec 10-20 obstacles. Durée moyenne: 32m. Pour les futurs Spartans !",
      },
      de: {
        name: "Kids Race",
        description:
          "1-3km Hindernislauf mit 10-20 Hindernissen. Durchschnittszeit: 32m. Für die zukünftigen Spartaner!",
      },
      it: {
        name: "Kids Race",
        description:
          "Corsa ad ostacoli di 1-3km con 10-20 ostacoli. Durata media: 32m. Per i futuri Spartans!",
      },
    },
  };

  for (const variant of variants) {
    for (const lang of languages) {
      await prisma.eventVariantTranslation.upsert({
        where: {
          variantId_language: {
            variantId: variant.id,
            language: lang,
          },
        },
        update: {
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
        create: {
          variantId: variant.id,
          language: lang,
          name: variantTranslations[variant.name][lang].name,
          description: variantTranslations[variant.name][lang].description,
        },
      });
    }
  }

  console.log("📝 Variant translations upserted for all 4 variants");

  // Step 5: Create pricing phases (using eventId pattern)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findOrCreatePricingPhase = async (name: string, data: any) => {
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
        data: {
          eventId: event.id,
          name,
          ...data,
        },
      });
    }
  };

  // Sprint 5K - Preço inicial
  await findOrCreatePricingPhase("Sprint 5K - Preço Inicial", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-06-30T23:59:59Z"),
    price: 69.99,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço inicial para Sprint 5K. Inclui medalha, t-shirt, trifecta wedge e seguro.",
  });

  // Sprint 5K - Preço normal
  await findOrCreatePricingPhase("Sprint 5K - Preço Normal", {
    startDate: new Date("2026-07-01T00:00:00Z"),
    endDate: new Date("2026-10-31T23:59:59Z"),
    price: 89.99,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço normal para Sprint 5K. Inclui medalha, t-shirt, trifecta wedge e seguro.",
  });

  // Sprint 5K - Preço final
  await findOrCreatePricingPhase("Sprint 5K - Preço Final", {
    startDate: new Date("2026-11-01T00:00:00Z"),
    endDate: new Date("2026-11-06T23:59:59Z"),
    price: 109.99,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço final para Sprint 5K. Últimas inscrições disponíveis.",
  });

  // Super 10K - Preço inicial
  await findOrCreatePricingPhase("Super 10K - Preço Inicial", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-06-30T23:59:59Z"),
    price: 89.99,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço inicial para Super 10K. Inclui medalha, t-shirt, trifecta wedge e seguro.",
  });

  // Super 10K - Preço normal
  await findOrCreatePricingPhase("Super 10K - Preço Normal", {
    startDate: new Date("2026-07-01T00:00:00Z"),
    endDate: new Date("2026-10-31T23:59:59Z"),
    price: 109.99,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço normal para Super 10K. Inclui medalha, t-shirt, trifecta wedge e seguro.",
  });

  // Super 10K - Preço final
  await findOrCreatePricingPhase("Super 10K - Preço Final", {
    startDate: new Date("2026-11-01T00:00:00Z"),
    endDate: new Date("2026-11-06T23:59:59Z"),
    price: 129.99,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço final para Super 10K. Últimas inscrições disponíveis.",
  });

  // Beast 21K - Preço inicial
  await findOrCreatePricingPhase("Beast 21K - Preço Inicial", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-06-30T23:59:59Z"),
    price: 119.99,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço inicial para Beast 21K. Inclui medalha, t-shirt, trifecta wedge e seguro.",
  });

  // Beast 21K - Preço normal
  await findOrCreatePricingPhase("Beast 21K - Preço Normal", {
    startDate: new Date("2026-07-01T00:00:00Z"),
    endDate: new Date("2026-10-31T23:59:59Z"),
    price: 149.99,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço normal para Beast 21K. Inclui medalha, t-shirt, trifecta wedge e seguro.",
  });

  // Beast 21K - Preço final
  await findOrCreatePricingPhase("Beast 21K - Preço Final", {
    startDate: new Date("2026-11-01T00:00:00Z"),
    endDate: new Date("2026-11-06T23:59:59Z"),
    price: 179.99,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço final para Beast 21K. Últimas inscrições disponíveis.",
  });

  // Kids Race - Preço único
  await findOrCreatePricingPhase("Kids Race - Preço Único", {
    startDate: new Date("2026-01-01T00:00:00Z"),
    endDate: new Date("2026-11-06T23:59:59Z"),
    price: 30.0,
    currency: Currency.EUR,
    discountPercent: null,
    note: "Preço único para Kids Race. Inclui medalha e t-shirt.",
  });

  console.log("💰 Pricing phases created (10 phases for 4 variants)");

  // Step 6: Create FAQs
  const findOrCreateFAQ = async (
    eventId: string,
    order: number,
    question: string,
    answer: string
  ) => {
    const existing = await prisma.eventFAQ.findFirst({
      where: { eventId, order },
    });
    if (existing) {
      return await prisma.eventFAQ.update({
        where: { id: existing.id },
        data: { question, answer },
      });
    }
    return await prisma.eventFAQ.create({
      data: { eventId, order, question, answer },
    });
  };

  // FAQ 1: O que é o Trifecta Weekend?
  const faq1 = await findOrCreateFAQ(
    event.id,
    0,
    "O que é o Trifecta Weekend?",
    "O Trifecta Weekend é o desafio máximo da Spartan: completar uma Sprint (5K), Super (10K) e Beast (21K) num só fim de semana. Ao completar as três provas, recebes a cobiçada medalha Trifecta."
  );

  const faq1Translations = {
    pt: {
      question: "O que é o Trifecta Weekend?",
      answer:
        "O Trifecta Weekend é o desafio máximo da Spartan: completar uma Sprint (5K), Super (10K) e Beast (21K) num só fim de semana. Ao completar as três provas, recebes a cobiçada medalha Trifecta.",
    },
    en: {
      question: "What is Trifecta Weekend?",
      answer:
        "Trifecta Weekend is Spartan's ultimate challenge: completing a Sprint (5K), Super (10K) and Beast (21K) in one weekend. By completing all three races, you earn the coveted Trifecta medal.",
    },
    es: {
      question: "¿Qué es el Trifecta Weekend?",
      answer:
        "El Trifecta Weekend es el desafío máximo de Spartan: completar una Sprint (5K), Super (10K) y Beast (21K) en un solo fin de semana. Al completar las tres carreras, recibes la codiciada medalla Trifecta.",
    },
    fr: {
      question: "Qu'est-ce que le Trifecta Weekend ?",
      answer:
        "Le Trifecta Weekend est le défi ultime de Spartan : compléter une Sprint (5K), Super (10K) et Beast (21K) en un seul week-end. En terminant les trois courses, vous obtenez la convoitée médaille Trifecta.",
    },
    de: {
      question: "Was ist das Trifecta Weekend?",
      answer:
        "Das Trifecta Weekend ist die ultimative Spartan-Herausforderung: eine Sprint (5K), Super (10K) und Beast (21K) an einem Wochenende absolvieren. Nach Abschluss aller drei Rennen erhältst du die begehrte Trifecta-Medaille.",
    },
    it: {
      question: "Cos'è il Trifecta Weekend?",
      answer:
        "Il Trifecta Weekend è la sfida definitiva di Spartan: completare una Sprint (5K), Super (10K) e Beast (21K) in un solo weekend. Completando tutte e tre le gare, ottieni l'ambita medaglia Trifecta.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq1.id, language: lang } },
      update: faq1Translations[lang],
      create: { faqId: faq1.id, language: lang, ...faq1Translations[lang] },
    });
  }

  // FAQ 2: O que acontece se falhar um obstáculo?
  const faq2 = await findOrCreateFAQ(
    event.id,
    1,
    "O que acontece se falhar um obstáculo?",
    "Se falhares um obstáculo, tens de completar 30 burpees como penalização antes de continuar. Isto aplica-se a todos os obstáculos obrigatórios no percurso."
  );

  const faq2Translations = {
    pt: {
      question: "O que acontece se falhar um obstáculo?",
      answer:
        "Se falhares um obstáculo, tens de completar 30 burpees como penalização antes de continuar. Isto aplica-se a todos os obstáculos obrigatórios no percurso.",
    },
    en: {
      question: "What happens if I fail an obstacle?",
      answer:
        "If you fail an obstacle, you must complete 30 burpees as a penalty before continuing. This applies to all mandatory obstacles on the course.",
    },
    es: {
      question: "¿Qué pasa si fallo un obstáculo?",
      answer:
        "Si fallas un obstáculo, debes completar 30 burpees como penalización antes de continuar. Esto se aplica a todos los obstáculos obligatorios del recorrido.",
    },
    fr: {
      question: "Que se passe-t-il si j'échoue un obstacle ?",
      answer:
        "Si vous échouez un obstacle, vous devez effectuer 30 burpees comme pénalité avant de continuer. Cela s'applique à tous les obstacles obligatoires du parcours.",
    },
    de: {
      question: "Was passiert, wenn ich ein Hindernis nicht schaffe?",
      answer:
        "Wenn du ein Hindernis nicht schaffst, musst du 30 Burpees als Strafe absolvieren, bevor du weitermachst. Dies gilt für alle Pflichthhindernisse auf der Strecke.",
    },
    it: {
      question: "Cosa succede se fallisco un ostacolo?",
      answer:
        "Se fallisci un ostacolo, devi completare 30 burpees come penalità prima di continuare. Questo si applica a tutti gli ostacoli obbligatori del percorso.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq2.id, language: lang } },
      update: faq2Translations[lang],
      create: { faqId: faq2.id, language: lang, ...faq2Translations[lang] },
    });
  }

  // FAQ 3: O que está incluído na inscrição?
  const faq3 = await findOrCreateFAQ(
    event.id,
    2,
    "O que está incluído na inscrição?",
    "A tua inscrição inclui: medalha finisher, t-shirt oficial Spartan, trifecta wedge, acesso a fotos oficiais, seguro de acidentes Spartan e abastecimentos ao longo do percurso."
  );

  const faq3Translations = {
    pt: {
      question: "O que está incluído na inscrição?",
      answer:
        "A tua inscrição inclui: medalha finisher, t-shirt oficial Spartan, trifecta wedge, acesso a fotos oficiais, seguro de acidentes Spartan e abastecimentos ao longo do percurso.",
    },
    en: {
      question: "What's included in the registration?",
      answer:
        "Your registration includes: finisher medal, official Spartan t-shirt, trifecta wedge, access to official photos, Spartan accident insurance, and aid stations along the course.",
    },
    es: {
      question: "¿Qué está incluido en la inscripción?",
      answer:
        "Tu inscripción incluye: medalla finisher, camiseta oficial Spartan, trifecta wedge, acceso a fotos oficiales, seguro de accidentes Spartan y avituallamientos a lo largo del recorrido.",
    },
    fr: {
      question: "Qu'est-ce qui est inclus dans l'inscription ?",
      answer:
        "Votre inscription comprend : médaille finisher, t-shirt officiel Spartan, trifecta wedge, accès aux photos officielles, assurance accidents Spartan et ravitaillements le long du parcours.",
    },
    de: {
      question: "Was ist in der Anmeldung enthalten?",
      answer:
        "Deine Anmeldung beinhaltet: Finisher-Medaille, offizielles Spartan T-Shirt, Trifecta Wedge, Zugang zu offiziellen Fotos, Spartan Unfallversicherung und Verpflegungsstationen entlang der Strecke.",
    },
    it: {
      question: "Cosa è incluso nell'iscrizione?",
      answer:
        "La tua iscrizione include: medaglia finisher, t-shirt ufficiale Spartan, trifecta wedge, accesso alle foto ufficiali, assicurazione infortuni Spartan e punti di ristoro lungo il percorso.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq3.id, language: lang } },
      update: faq3Translations[lang],
      create: { faqId: faq3.id, language: lang, ...faq3Translations[lang] },
    });
  }

  // FAQ 4: Posso participar na Kids Race?
  const faq4 = await findOrCreateFAQ(
    event.id,
    3,
    "Quem pode participar na Kids Race?",
    "A Kids Race é destinada a crianças dos 4 aos 14 anos. A distância varia entre 1-3km com 10-20 obstáculos adaptados à idade. É necessário que um adulto responsável esteja presente durante toda a prova."
  );

  const faq4Translations = {
    pt: {
      question: "Quem pode participar na Kids Race?",
      answer:
        "A Kids Race é destinada a crianças dos 4 aos 14 anos. A distância varia entre 1-3km com 10-20 obstáculos adaptados à idade. É necessário que um adulto responsável esteja presente durante toda a prova.",
    },
    en: {
      question: "Who can participate in the Kids Race?",
      answer:
        "The Kids Race is for children aged 4-14. The distance varies from 1-3km with 10-20 age-appropriate obstacles. A responsible adult must be present throughout the race.",
    },
    es: {
      question: "¿Quién puede participar en la Kids Race?",
      answer:
        "La Kids Race es para niños de 4 a 14 años. La distancia varía de 1-3km con 10-20 obstáculos adaptados a la edad. Un adulto responsable debe estar presente durante toda la carrera.",
    },
    fr: {
      question: "Qui peut participer à la Kids Race ?",
      answer:
        "La Kids Race est destinée aux enfants de 4 à 14 ans. La distance varie de 1-3km avec 10-20 obstacles adaptés à l'âge. Un adulte responsable doit être présent pendant toute la course.",
    },
    de: {
      question: "Wer kann am Kids Race teilnehmen?",
      answer:
        "Das Kids Race ist für Kinder von 4-14 Jahren. Die Distanz variiert von 1-3km mit 10-20 altersgerechten Hindernissen. Ein verantwortlicher Erwachsener muss während des gesamten Rennens anwesend sein.",
    },
    it: {
      question: "Chi può partecipare alla Kids Race?",
      answer:
        "La Kids Race è per bambini dai 4 ai 14 anni. La distanza varia da 1-3km con 10-20 ostacoli adatti all'età. Un adulto responsabile deve essere presente durante tutta la gara.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq4.id, language: lang } },
      update: faq4Translations[lang],
      create: { faqId: faq4.id, language: lang, ...faq4Translations[lang] },
    });
  }

  // FAQ 5: Como chegar a Sesimbra?
  const faq5 = await findOrCreateFAQ(
    event.id,
    4,
    "Como chegar a Sesimbra?",
    "Sesimbra fica a aproximadamente 1 hora de carro a sul de Lisboa. Podes chegar de carro pela A2 e depois seguir indicações para Sesimbra, ou utilizar transportes públicos até Sesimbra. O local do evento é na Praia da Califórnia."
  );

  const faq5Translations = {
    pt: {
      question: "Como chegar a Sesimbra?",
      answer:
        "Sesimbra fica a aproximadamente 1 hora de carro a sul de Lisboa. Podes chegar de carro pela A2 e depois seguir indicações para Sesimbra, ou utilizar transportes públicos até Sesimbra. O local do evento é na Praia da Califórnia.",
    },
    en: {
      question: "How to get to Sesimbra?",
      answer:
        "Sesimbra is approximately 1 hour drive south of Lisbon. You can drive via A2 and then follow signs to Sesimbra, or use public transport to Sesimbra. The event location is at Praia da Califórnia.",
    },
    es: {
      question: "¿Cómo llegar a Sesimbra?",
      answer:
        "Sesimbra está a aproximadamente 1 hora en coche al sur de Lisboa. Puedes llegar en coche por la A2 y luego seguir las indicaciones hacia Sesimbra, o usar transporte público hasta Sesimbra. El evento es en Praia da Califórnia.",
    },
    fr: {
      question: "Comment se rendre à Sesimbra ?",
      answer:
        "Sesimbra est à environ 1 heure de route au sud de Lisbonne. Vous pouvez y aller en voiture via l'A2 puis suivre les indications vers Sesimbra, ou utiliser les transports en commun. L'événement se déroule à Praia da Califórnia.",
    },
    de: {
      question: "Wie komme ich nach Sesimbra?",
      answer:
        "Sesimbra liegt etwa 1 Stunde Fahrt südlich von Lissabon. Du kannst mit dem Auto über die A2 fahren und dann den Schildern nach Sesimbra folgen, oder öffentliche Verkehrsmittel nutzen. Der Veranstaltungsort ist am Praia da Califórnia.",
    },
    it: {
      question: "Come arrivare a Sesimbra?",
      answer:
        "Sesimbra si trova a circa 1 ora di macchina a sud di Lisbona. Puoi raggiungerla in auto tramite la A2 e poi seguire le indicazioni per Sesimbra, o usare i mezzi pubblici. L'evento si svolge a Praia da Califórnia.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq5.id, language: lang } },
      update: faq5Translations[lang],
      create: { faqId: faq5.id, language: lang, ...faq5Translations[lang] },
    });
  }

  // FAQ 6: O que devo levar no dia da prova?
  const faq6 = await findOrCreateFAQ(
    event.id,
    5,
    "O que devo levar no dia da prova?",
    "Deves levar: documento de identificação, confirmação de inscrição, roupa e calçado adequados para corrida de obstáculos (que possa ficar suja/molhada), toalha e roupa de mudança, e hidratação. Não são permitidos auriculares durante a prova."
  );

  const faq6Translations = {
    pt: {
      question: "O que devo levar no dia da prova?",
      answer:
        "Deves levar: documento de identificação, confirmação de inscrição, roupa e calçado adequados para corrida de obstáculos (que possa ficar suja/molhada), toalha e roupa de mudança, e hidratação. Não são permitidos auriculares durante a prova.",
    },
    en: {
      question: "What should I bring on race day?",
      answer:
        "You should bring: ID document, registration confirmation, appropriate clothing and footwear for obstacle racing (that can get dirty/wet), towel and change of clothes, and hydration. Headphones are not allowed during the race.",
    },
    es: {
      question: "¿Qué debo llevar el día de la carrera?",
      answer:
        "Debes llevar: documento de identificación, confirmación de inscripción, ropa y calzado adecuados para carreras de obstáculos (que puedan ensuciarse/mojarse), toalla y ropa de cambio, e hidratación. No se permiten auriculares durante la carrera.",
    },
    fr: {
      question: "Que dois-je apporter le jour de la course ?",
      answer:
        "Vous devez apporter : pièce d'identité, confirmation d'inscription, vêtements et chaussures adaptés à la course d'obstacles (qui peuvent se salir/mouiller), serviette et vêtements de rechange, et hydratation. Les écouteurs ne sont pas autorisés pendant la course.",
    },
    de: {
      question: "Was sollte ich am Renntag mitbringen?",
      answer:
        "Du solltest mitbringen: Ausweis, Anmeldebestätigung, geeignete Kleidung und Schuhe für Hindernisläufe (die schmutzig/nass werden können), Handtuch und Wechselkleidung, und Getränke. Kopfhörer sind während des Rennens nicht erlaubt.",
    },
    it: {
      question: "Cosa devo portare il giorno della gara?",
      answer:
        "Devi portare: documento d'identità, conferma di iscrizione, abbigliamento e calzature adatte alla corsa ad ostacoli (che possono sporcarsi/bagnarsi), asciugamano e vestiti di ricambio, e idratazione. Le cuffie non sono consentite durante la gara.",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"] as const) {
    await prisma.eventFAQTranslation.upsert({
      where: { faqId_language: { faqId: faq6.id, language: lang } },
      update: faq6Translations[lang],
      create: { faqId: faq6.id, language: lang, ...faq6Translations[lang] },
    });
  }

  console.log("❓ FAQs created (6 FAQs with translations in all 6 languages)");

  console.log(
    "\n🎉 Sesimbra Spartan Weekend 2026 seed completed successfully!"
  );
  console.log("📍 Location: Praia da Califórnia, Sesimbra, Portugal");
  console.log("📅 Dates: November 7-8, 2026");
  console.log("🏃 4 variants: Sprint 5K, Super 10K, Beast 21K, Kids Race");
  console.log("🏆 Trifecta Weekend - Wolf Season 2026");
  console.log("🔗 External URL: https://www.spartan.com");
  console.log("\n⚔️ AROO! 🔥");
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
