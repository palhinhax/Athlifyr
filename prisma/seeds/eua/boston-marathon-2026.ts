import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedBostonMarathon2026() {
  console.log("🏃 Seeding Boston Marathon 2026...");

  // Delete existing event if it exists
  await prisma.event.deleteMany({
    where: { slug: "boston-marathon-2026" },
  });

  console.log("✅ Cleaned up existing Boston Marathon 2026 data");

  // Translations for all 6 supported languages
  const translations = {
    pt: {
      title: "Maratona de Boston 2026 - 130ª Edição",
      description: `# 🏃 Maratona de Boston 2026 - 130ª Edição

A **Maratona de Boston** é a maratona anual mais antiga do mundo, realizada desde 1897. Apresentada pelo Bank of America, a 130ª edição realiza-se a 20 de abril de 2026 (segunda-feira), coincidindo com o Dia dos Patriotas em Massachusetts.

## 📍 Percurso

- **Partida**: Hopkinton, Massachusetts
- **Chegada**: Boylston Street, Boston
- **Distância**: 42,195 km (26,2 milhas)
- **Perfil**: Percurso ponto a ponto com descidas nas primeiras milhas e a icónica subida Heartbreak Hill nas milhas 20-21

## 🎯 Membro dos World Marathon Majors

A Maratona de Boston é um dos seis **Abbott World Marathon Majors**, juntamente com Tóquio, Londres, Berlim, Chicago e Nova Iorque. É a única Major que exige tempos de qualificação rigorosos para a entrada.

## 🏅 Participar

### Normas de Qualificação
Para participar na Maratona de Boston 2026, os atletas devem ter alcançado um tempo de qualificação específico para a sua faixa etária e género numa maratona certificada durante o período de qualificação (1 de setembro de 2024 - 12 de setembro de 2025).

**Importante**: Alcançar o tempo de qualificação não garante a entrada devido a limitações de campo. As inscrições são classificadas pelo tempo abaixo da norma de qualificação.

### Inscrição
- **Datas**: 8-12 de setembro de 2025
- **Plataforma**: Athletes' Village (plataforma online B.A.A.)
- **Não é por ordem de chegada**: As candidaturas são classificadas por mérito de tempo

### Outras Formas de Participar
- **Programa de Caridade**: Arrecadar fundos para organizações de caridade aprovadas pela B.A.A.
- **Climate Crew**: Compromisso mínimo de angariação de fundos de $1.500 para iniciativas de sustentabilidade

## 📅 Horário de Partida - 20 de abril de 2026

- **09:06** - Cadeira de Rodas Masculina
- **09:09** - Cadeira de Rodas Feminina
- **09:30** - Handbike & Duo
- **09:37** - Elite Masculina
- **09:47** - Elite Feminina
- **09:50** - Divisões Para-Atléticas
- **10:00** - Onda 1
- **10:25** - Onda 2
- **10:50** - Onda 3
- **11:15** - Onda 4

**Fecho da linha de chegada**: 17:30

## 🎽 Expo da Maratona

**Bank of America Boston Marathon Expo**
- **Local**: Hynes Convention Center (900 Boylston Street, Boston)
- **Datas**: 17-19 de abril de 2026
- **Horário**: 
  - Sexta, 17 abr: 10:00-19:00
  - Sábado, 18 abr: 09:00-19:00
  - Domingo, 19 abr: 09:00-18:00

Recolha obrigatória do dorsal com identificação oficial com fotografia.

## 🚌 Transporte

Autocarros oficiais da B.A.A. desde Boston Common até Hopkinton. Horários de carregamento escalonados por onda (06:45 - 09:30). **Último autocarro sai às 09:30.**

Estacionamento limitado disponível em Hopkinton (primeiro a chegar, primeiro a ser servido).

## 🏃 Em Percurso

- **Hidratação**: Poland Spring Water e Gatorade em cada milha a partir da milha 2
- **Nutrição**: Maurten Gel nas milhas 11,8, 17 e 21,5
- **Médico**: 26 estações médicas ao longo do percurso
- **Casas de banho**: Disponíveis em cada estação de abastecimento

## 🏅 Linha de Chegada

Todos os participantes que completarem antes das 17:30 receberão:
- Medalha de finisher oficial da Maratona de Boston
- Cobertor térmico Heatsheet
- Saco de alimentos e hidratação
- Classificação oficial nos resultados

**Nota**: Participantes que terminem após as 17:30 receberão medalha mas serão marcados como "Post-Race Participant" nos resultados.

## 🏆 História

Desde 1897, a Maratona de Boston tem sido uma prova de resistência, velocidade e espírito humano. É corrida na terceira segunda-feira de abril, coincidindo com o Dia dos Patriotas em Massachusetts.

Atletas lendários como Clarence DeMar, Johnny Kelley, Bill Rodgers, Joan Benoit Samuelson e muitos outros entraram para a história neste percurso icónico.

---

**Organização**: Boston Athletic Association (B.A.A.)  
**Apresentada por**: Bank of America  
**Website oficial**: [baa.org](https://www.baa.org)`,
      city: "Boston, Massachusetts",
      metaTitle:
        "Maratona de Boston 2026 - 130ª Edição | 20 Abril | World Marathon Major",
      metaDescription:
        "Maratona de Boston 2026 - 130ª edição a 20 de abril. A maratona anual mais antiga do mundo, membro dos Abbott World Marathon Majors. Hopkinton → Boston, 42,195km. Requer tempos de qualificação.",
    },
    en: {
      title: "Boston Marathon 2026 - 130th Edition",
      description: `# 🏃 Boston Marathon 2026 - 130th Edition

The **Boston Marathon** is the world's oldest annual marathon, held since 1897. Presented by Bank of America, the 130th edition takes place on April 20, 2026 (Monday), coinciding with Patriots' Day in Massachusetts.

## 📍 Course

- **Start**: Hopkinton, Massachusetts
- **Finish**: Boylston Street, Boston
- **Distance**: 42.195 km (26.2 miles)
- **Profile**: Point-to-point course with downhills in early miles and the iconic Heartbreak Hill at miles 20-21

## 🎯 World Marathon Majors Member

The Boston Marathon is one of six **Abbott World Marathon Majors**, alongside Tokyo, London, Berlin, Chicago, and New York City. It's the only Major that requires rigorous qualifying times for entry.

## 🏅 How to Participate

### Qualifying Standards
To participate in the 2026 Boston Marathon, athletes must have achieved a specific qualifying time for their age group and gender in a certified marathon during the qualifying window (September 1, 2024 - September 12, 2025).

**Important**: Achieving the qualifying time does not guarantee entry due to field size limitations. Applications are ranked by time under qualifying standard.

### Registration
- **Dates**: September 8-12, 2025
- **Platform**: Athletes' Village (B.A.A. online platform)
- **Not first-come, first-served**: Applications ranked by time merit

### Other Ways to Participate
- **Charity Program**: Fundraise for B.A.A.-approved charity organizations
- **Climate Crew**: Minimum fundraising commitment of $1,500 for sustainability initiatives

## 📅 Start Schedule - April 20, 2026

- **09:06 AM** - Men's Wheelchair
- **09:09 AM** - Women's Wheelchair
- **09:30 AM** - Handcycle & Duo
- **09:37 AM** - Professional Men
- **09:47 AM** - Professional Women
- **09:50 AM** - Para Athletics Divisions
- **10:00 AM** - Wave 1
- **10:25 AM** - Wave 2
- **10:50 AM** - Wave 3
- **11:15 AM** - Wave 4

**Finish line closure**: 5:30 PM

## 🎽 Marathon Expo

**Bank of America Boston Marathon Expo**
- **Location**: Hynes Convention Center (900 Boylston Street, Boston)
- **Dates**: April 17-19, 2026
- **Hours**: 
  - Friday, Apr 17: 10:00 AM - 7:00 PM
  - Saturday, Apr 18: 9:00 AM - 7:00 PM
  - Sunday, Apr 19: 9:00 AM - 6:00 PM

Mandatory bib pick-up with government-issued photo ID.

## 🚌 Transportation

Official B.A.A. buses from Boston Common to Hopkinton. Staggered loading times by wave (6:45 AM - 9:30 AM). **Last bus departs at 9:30 AM.**

Limited parking available in Hopkinton (first-come, first-served).

## 🏃 On Course

- **Hydration**: Poland Spring Water and Gatorade at every mile starting at mile 2
- **Nutrition**: Maurten Gel at miles 11.8, 17, and 21.5
- **Medical**: 26 medical stations along the course
- **Restrooms**: Available at every aid station

## 🏅 Finish Line

All participants who complete before 5:30 PM will receive:
- Official Boston Marathon finisher medal
- Heatsheet thermal blanket
- Food bag and hydration
- Official results ranking

**Note**: Participants finishing after 5:30 PM will receive a medal but be marked as "Post-Race Participant" in results.

## 🏆 History

Since 1897, the Boston Marathon has been a test of endurance, speed, and human spirit. It's run on the third Monday in April, coinciding with Patriots' Day in Massachusetts.

Legendary athletes like Clarence DeMar, Johnny Kelley, Bill Rodgers, Joan Benoit Samuelson, and many others have etched their names into history on this iconic course.

---

**Organizer**: Boston Athletic Association (B.A.A.)  
**Presented by**: Bank of America  
**Official website**: [baa.org](https://www.baa.org)`,
      city: "Boston, Massachusetts",
      metaTitle:
        "Boston Marathon 2026 - 130th Edition | April 20 | World Marathon Major",
      metaDescription:
        "Boston Marathon 2026 - 130th edition on April 20. World's oldest annual marathon, Abbott World Marathon Major. Hopkinton → Boston, 42.195km. Qualifying times required.",
    },
    es: {
      title: "Maratón de Boston 2026 - 130ª Edición",
      description: `# 🏃 Maratón de Boston 2026 - 130ª Edición

El **Maratón de Boston** es el maratón anual más antiguo del mundo, celebrado desde 1897. Presentado por Bank of America, la 130ª edición se celebra el 20 de abril de 2026 (lunes), coincidiendo con el Día de los Patriotas en Massachusetts.

## 📍 Recorrido

- **Salida**: Hopkinton, Massachusetts
- **Meta**: Boylston Street, Boston
- **Distancia**: 42,195 km (26,2 millas)
- **Perfil**: Recorrido punto a punto con bajadas en las primeras millas y la icónica subida Heartbreak Hill en las millas 20-21

## 🎯 Miembro de World Marathon Majors

El Maratón de Boston es uno de los seis **Abbott World Marathon Majors**, junto con Tokio, Londres, Berlín, Chicago y Nueva York. Es el único Major que requiere marcas de clasificación rigurosas para la inscripción.

## 🏅 Cómo Participar

### Marcas de Clasificación
Para participar en el Maratón de Boston 2026, los atletas deben haber logrado una marca de clasificación específica para su grupo de edad y género en un maratón certificado durante el período de clasificación (1 de septiembre de 2024 - 12 de septiembre de 2025).

**Importante**: Lograr la marca de clasificación no garantiza la entrada debido a limitaciones de cupo. Las solicitudes se clasifican por tiempo bajo la marca de clasificación.

### Inscripción
- **Fechas**: 8-12 de septiembre de 2025
- **Plataforma**: Athletes' Village (plataforma online B.A.A.)
- **No es por orden de llegada**: Solicitudes clasificadas por mérito de tiempo

### Otras Formas de Participar
- **Programa Benéfico**: Recaudar fondos para organizaciones benéficas aprobadas por B.A.A.
- **Climate Crew**: Compromiso mínimo de recaudación de $1.500 para iniciativas de sostenibilidad

## 📅 Horario de Salida - 20 de abril de 2026

- **09:06** - Silla de Ruedas Masculina
- **09:09** - Silla de Ruedas Femenina
- **09:30** - Handbike & Dúo
- **09:37** - Élite Masculina
- **09:47** - Élite Femenina
- **09:50** - Divisiones Para-Atléticas
- **10:00** - Ola 1
- **10:25** - Ola 2
- **10:50** - Ola 3
- **11:15** - Ola 4

**Cierre de línea de meta**: 17:30

## 🎽 Expo del Maratón

**Bank of America Boston Marathon Expo**
- **Lugar**: Hynes Convention Center (900 Boylston Street, Boston)
- **Fechas**: 17-19 de abril de 2026
- **Horario**: 
  - Viernes, 17 abr: 10:00-19:00
  - Sábado, 18 abr: 09:00-19:00
  - Domingo, 19 abr: 09:00-18:00

Recogida obligatoria de dorsal con identificación oficial con foto.

## 🚌 Transporte

Autobuses oficiales de B.A.A. desde Boston Common hasta Hopkinton. Horarios de carga escalonados por ola (06:45 - 09:30). **Último autobús sale a las 09:30.**

Estacionamiento limitado disponible en Hopkinton (por orden de llegada).

## 🏃 En Recorrido

- **Hidratación**: Poland Spring Water y Gatorade en cada milla desde la milla 2
- **Nutrición**: Maurten Gel en millas 11,8, 17 y 21,5
- **Médico**: 26 estaciones médicas a lo largo del recorrido
- **Baños**: Disponibles en cada estación de avituallamiento

## 🏅 Línea de Meta

Todos los participantes que completen antes de las 17:30 recibirán:
- Medalla oficial de finisher del Maratón de Boston
- Manta térmica Heatsheet
- Bolsa de alimentos e hidratación
- Clasificación oficial en resultados

**Nota**: Participantes que terminen después de las 17:30 recibirán medalla pero serán marcados como "Post-Race Participant" en resultados.

## 🏆 Historia

Desde 1897, el Maratón de Boston ha sido una prueba de resistencia, velocidad y espíritu humano. Se celebra el tercer lunes de abril, coincidiendo con el Día de los Patriotas en Massachusetts.

Atletas legendarios como Clarence DeMar, Johnny Kelley, Bill Rodgers, Joan Benoit Samuelson y muchos otros han dejado su nombre en la historia en este recorrido icónico.

---

**Organizador**: Boston Athletic Association (B.A.A.)  
**Presentado por**: Bank of America  
**Sitio web oficial**: [baa.org](https://www.baa.org)`,
      city: "Boston, Massachusetts",
      metaTitle:
        "Maratón de Boston 2026 - 130ª Edición | 20 Abril | World Marathon Major",
      metaDescription:
        "Maratón de Boston 2026 - 130ª edición el 20 de abril. El maratón anual más antiguo del mundo, Abbott World Marathon Major. Hopkinton → Boston, 42,195km. Requiere marcas de clasificación.",
    },
    fr: {
      title: "Marathon de Boston 2026 - 130e Édition",
      description: `# 🏃 Marathon de Boston 2026 - 130e Édition

Le **Marathon de Boston** est le plus ancien marathon annuel du monde, organisé depuis 1897. Présenté par Bank of America, la 130e édition a lieu le 20 avril 2026 (lundi), coïncidant avec le Jour des Patriotes dans le Massachusetts.

## 📍 Parcours

- **Départ**: Hopkinton, Massachusetts
- **Arrivée**: Boylston Street, Boston
- **Distance**: 42,195 km (26,2 miles)
- **Profil**: Parcours point à point avec descentes dans les premiers miles et l'emblématique montée Heartbreak Hill aux miles 20-21

## 🎯 Membre des World Marathon Majors

Le Marathon de Boston est l'un des six **Abbott World Marathon Majors**, aux côtés de Tokyo, Londres, Berlin, Chicago et New York. C'est le seul Major qui exige des temps de qualification rigoureux pour l'inscription.

## 🏅 Comment Participer

### Normes de Qualification
Pour participer au Marathon de Boston 2026, les athlètes doivent avoir réalisé un temps de qualification spécifique pour leur groupe d'âge et genre dans un marathon certifié pendant la période de qualification (1er septembre 2024 - 12 septembre 2025).

**Important**: Atteindre le temps de qualification ne garantit pas l'entrée en raison des limitations de places. Les candidatures sont classées par temps sous la norme de qualification.

### Inscription
- **Dates**: 8-12 septembre 2025
- **Plateforme**: Athletes' Village (plateforme en ligne B.A.A.)
- **Pas premier arrivé, premier servi**: Candidatures classées par mérite de temps

### Autres Moyens de Participer
- **Programme Caritatif**: Collecter des fonds pour les organisations caritatives approuvées par B.A.A.
- **Climate Crew**: Engagement minimum de collecte de fonds de 1.500$ pour les initiatives de durabilité

## 📅 Horaire de Départ - 20 avril 2026

- **09:06** - Fauteuil Roulant Hommes
- **09:09** - Fauteuil Roulant Femmes
- **09:30** - Handbike & Duo
- **09:37** - Élite Hommes
- **09:47** - Élite Femmes
- **09:50** - Divisions Para-Athlétiques
- **10:00** - Vague 1
- **10:25** - Vague 2
- **10:50** - Vague 3
- **11:15** - Vague 4

**Fermeture de la ligne d'arrivée**: 17h30

## 🎽 Expo du Marathon

**Bank of America Boston Marathon Expo**
- **Lieu**: Hynes Convention Center (900 Boylston Street, Boston)
- **Dates**: 17-19 avril 2026
- **Horaires**: 
  - Vendredi 17 avr: 10h00-19h00
  - Samedi 18 avr: 09h00-19h00
  - Dimanche 19 avr: 09h00-18h00

Retrait obligatoire du dossard avec pièce d'identité officielle avec photo.

## 🚌 Transport

Bus officiels B.A.A. depuis Boston Common jusqu'à Hopkinton. Horaires de chargement échelonnés par vague (06h45 - 09h30). **Dernier bus part à 09h30.**

Stationnement limité disponible à Hopkinton (premier arrivé, premier servi).

## 🏃 Sur le Parcours

- **Hydratation**: Poland Spring Water et Gatorade à chaque mile à partir du mile 2
- **Nutrition**: Maurten Gel aux miles 11,8, 17 et 21,5
- **Médical**: 26 postes médicaux le long du parcours
- **Toilettes**: Disponibles à chaque poste de ravitaillement

## 🏅 Ligne d'Arrivée

Tous les participants qui terminent avant 17h30 recevront:
- Médaille officielle de finisher du Marathon de Boston
- Couverture thermique Heatsheet
- Sac de nourriture et hydratation
- Classement officiel dans les résultats

**Note**: Les participants terminant après 17h30 recevront une médaille mais seront marqués comme "Post-Race Participant" dans les résultats.

## 🏆 Histoire

Depuis 1897, le Marathon de Boston est une épreuve d'endurance, de vitesse et d'esprit humain. Il se déroule le troisième lundi d'avril, coïncidant avec le Jour des Patriotes dans le Massachusetts.

Des athlètes légendaires comme Clarence DeMar, Johnny Kelley, Bill Rodgers, Joan Benoit Samuelson et bien d'autres ont gravé leurs noms dans l'histoire sur ce parcours emblématique.

---

**Organisateur**: Boston Athletic Association (B.A.A.)  
**Présenté par**: Bank of America  
**Site officiel**: [baa.org](https://www.baa.org)`,
      city: "Boston, Massachusetts",
      metaTitle:
        "Marathon de Boston 2026 - 130e Édition | 20 Avril | World Marathon Major",
      metaDescription:
        "Marathon de Boston 2026 - 130e édition le 20 avril. Le plus ancien marathon annuel du monde, Abbott World Marathon Major. Hopkinton → Boston, 42,195km. Temps de qualification requis.",
    },
    de: {
      title: "Boston-Marathon 2026 - 130. Ausgabe",
      description: `# 🏃 Boston-Marathon 2026 - 130. Ausgabe

Der **Boston-Marathon** ist der älteste jährliche Marathon der Welt, der seit 1897 stattfindet. Präsentiert von der Bank of America findet die 130. Ausgabe am 20. April 2026 (Montag) statt, zeitgleich mit dem Patriots' Day in Massachusetts.

## 📍 Strecke

- **Start**: Hopkinton, Massachusetts
- **Ziel**: Boylston Street, Boston
- **Distanz**: 42,195 km (26,2 Meilen)
- **Profil**: Point-to-Point-Strecke mit Abfahrten in den frühen Meilen und dem legendären Heartbreak Hill bei Meile 20-21

## 🎯 World Marathon Majors Mitglied

Der Boston-Marathon ist einer der sechs **Abbott World Marathon Majors**, neben Tokio, London, Berlin, Chicago und New York City. Er ist der einzige Major, der strenge Qualifikationszeiten für die Teilnahme erfordert.

## 🏅 Wie Teilnehmen

### Qualifikationsstandards
Um am Boston-Marathon 2026 teilzunehmen, müssen Athleten eine spezifische Qualifikationszeit für ihre Altersgruppe und ihr Geschlecht in einem zertifizierten Marathon während des Qualifikationszeitraums (1. September 2024 - 12. September 2025) erreicht haben.

**Wichtig**: Das Erreichen der Qualifikationszeit garantiert aufgrund der Feldgrößenbeschränkungen keine Teilnahme. Bewerbungen werden nach der Zeit unter dem Qualifikationsstandard eingestuft.

### Anmeldung
- **Termine**: 8.-12. September 2025
- **Plattform**: Athletes' Village (B.A.A. Online-Plattform)
- **Nicht nach dem Windhundprinzip**: Bewerbungen nach Zeitverdienst eingestuft

### Weitere Teilnahmemöglichkeiten
- **Wohltätigkeitsprogramm**: Spenden sammeln für von B.A.A. genehmigte Wohltätigkeitsorganisationen
- **Climate Crew**: Mindestspendenverpflichtung von 1.500$ für Nachhaltigkeitsinitiativen

## 📅 Startplan - 20. April 2026

- **09:06 Uhr** - Männer Rollstuhl
- **09:09 Uhr** - Frauen Rollstuhl
- **09:30 Uhr** - Handbike & Duo
- **09:37 Uhr** - Elite Männer
- **09:47 Uhr** - Elite Frauen
- **09:50 Uhr** - Para-Leichtathletik-Divisionen
- **10:00 Uhr** - Welle 1
- **10:25 Uhr** - Welle 2
- **10:50 Uhr** - Welle 3
- **11:15 Uhr** - Welle 4

**Schließung der Ziellinie**: 17:30 Uhr

## 🎽 Marathon-Expo

**Bank of America Boston Marathon Expo**
- **Ort**: Hynes Convention Center (900 Boylston Street, Boston)
- **Termine**: 17.-19. April 2026
- **Öffnungszeiten**: 
  - Freitag, 17. Apr: 10:00-19:00 Uhr
  - Samstag, 18. Apr: 09:00-19:00 Uhr
  - Sonntag, 19. Apr: 09:00-18:00 Uhr

Pflichtabholung der Startnummer mit amtlichem Lichtbildausweis.

## 🚌 Transport

Offizielle B.A.A.-Busse von Boston Common nach Hopkinton. Gestaffelte Ladezeiten nach Welle (06:45 - 09:30 Uhr). **Letzter Bus fährt um 09:30 Uhr ab.**

Begrenzte Parkplätze in Hopkinton verfügbar (wer zuerst kommt, mahlt zuerst).

## 🏃 Auf der Strecke

- **Hydratation**: Poland Spring Wasser und Gatorade bei jeder Meile ab Meile 2
- **Ernährung**: Maurten Gel bei Meile 11,8, 17 und 21,5
- **Medizinisch**: 26 medizinische Stationen entlang der Strecke
- **Toiletten**: Verfügbar an jeder Verpflegungsstation

## 🏅 Ziellinie

Alle Teilnehmer, die vor 17:30 Uhr fertig werden, erhalten:
- Offizielle Boston-Marathon-Finisher-Medaille
- Heatsheet-Thermodecke
- Essensbeutel und Hydratation
- Offizielle Ergebnisplatzierung

**Hinweis**: Teilnehmer, die nach 17:30 Uhr fertig werden, erhalten eine Medaille, werden aber in den Ergebnissen als "Post-Race Participant" markiert.

## 🏆 Geschichte

Seit 1897 ist der Boston-Marathon ein Test für Ausdauer, Geschwindigkeit und menschlichen Geist. Er findet am dritten Montag im April statt, zeitgleich mit dem Patriots' Day in Massachusetts.

Legendäre Athleten wie Clarence DeMar, Johnny Kelley, Bill Rodgers, Joan Benoit Samuelson und viele andere haben sich auf dieser legendären Strecke in die Geschichte eingeschrieben.

---

**Veranstalter**: Boston Athletic Association (B.A.A.)  
**Präsentiert von**: Bank of America  
**Offizielle Website**: [baa.org](https://www.baa.org)`,
      city: "Boston, Massachusetts",
      metaTitle:
        "Boston-Marathon 2026 - 130. Ausgabe | 20. April | World Marathon Major",
      metaDescription:
        "Boston-Marathon 2026 - 130. Ausgabe am 20. April. Ältester jährlicher Marathon der Welt, Abbott World Marathon Major. Hopkinton → Boston, 42,195km. Qualifikationszeiten erforderlich.",
    },
    it: {
      title: "Maratona di Boston 2026 - 130ª Edizione",
      description: `# 🏃 Maratona di Boston 2026 - 130ª Edizione

La **Maratona di Boston** è la maratona annuale più antica del mondo, organizzata dal 1897. Presentata da Bank of America, la 130ª edizione si svolge il 20 aprile 2026 (lunedì), in coincidenza con il Patriots' Day nel Massachusetts.

## 📍 Percorso

- **Partenza**: Hopkinton, Massachusetts
- **Arrivo**: Boylston Street, Boston
- **Distanza**: 42,195 km (26,2 miglia)
- **Profilo**: Percorso point-to-point con discese nelle prime miglia e l'iconica salita Heartbreak Hill alle miglia 20-21

## 🎯 Membro dei World Marathon Majors

La Maratona di Boston è una delle sei **Abbott World Marathon Majors**, insieme a Tokyo, Londra, Berlino, Chicago e New York City. È l'unica Major che richiede tempi di qualificazione rigorosi per l'iscrizione.

## 🏅 Come Partecipare

### Standard di Qualificazione
Per partecipare alla Maratona di Boston 2026, gli atleti devono aver ottenuto un tempo di qualificazione specifico per la loro fascia d'età e genere in una maratona certificata durante il periodo di qualificazione (1° settembre 2024 - 12 settembre 2025).

**Importante**: Raggiungere il tempo di qualificazione non garantisce l'iscrizione a causa delle limitazioni di posti. Le candidature sono classificate per tempo sotto lo standard di qualificazione.

### Iscrizione
- **Date**: 8-12 settembre 2025
- **Piattaforma**: Athletes' Village (piattaforma online B.A.A.)
- **Non in ordine di arrivo**: Candidature classificate per merito di tempo

### Altri Modi per Partecipare
- **Programma Benefico**: Raccogliere fondi per organizzazioni benefiche approvate da B.A.A.
- **Climate Crew**: Impegno minimo di raccolta fondi di $1.500 per iniziative di sostenibilità

## 📅 Orario di Partenza - 20 aprile 2026

- **09:06** - Sedia a Rotelle Uomini
- **09:09** - Sedia a Rotelle Donne
- **09:30** - Handbike & Duo
- **09:37** - Elite Uomini
- **09:47** - Elite Donne
- **09:50** - Divisioni Para-Atletiche
- **10:00** - Onda 1
- **10:25** - Onda 2
- **10:50** - Onda 3
- **11:15** - Onda 4

**Chiusura linea d'arrivo**: 17:30

## 🎽 Expo della Maratona

**Bank of America Boston Marathon Expo**
- **Luogo**: Hynes Convention Center (900 Boylston Street, Boston)
- **Date**: 17-19 aprile 2026
- **Orari**: 
  - Venerdì 17 apr: 10:00-19:00
  - Sabato 18 apr: 09:00-19:00
  - Domenica 19 apr: 09:00-18:00

Ritiro obbligatorio del pettorale con documento d'identità ufficiale con foto.

## 🚌 Trasporto

Bus ufficiali B.A.A. da Boston Common a Hopkinton. Orari di carico scaglionati per onda (06:45 - 09:30). **Ultimo bus parte alle 09:30.**

Parcheggio limitato disponibile a Hopkinton (chi prima arriva, meglio alloggia).

## 🏃 Sul Percorso

- **Idratazione**: Poland Spring Water e Gatorade ad ogni miglio dal miglio 2
- **Nutrizione**: Maurten Gel ai migli 11,8, 17 e 21,5
- **Medico**: 26 stazioni mediche lungo il percorso
- **Bagni**: Disponibili ad ogni stazione di rifornimento

## 🏅 Linea d'Arrivo

Tutti i partecipanti che completano prima delle 17:30 riceveranno:
- Medaglia ufficiale di finisher della Maratona di Boston
- Coperta termica Heatsheet
- Sacchetto di cibo e idratazione
- Classificazione ufficiale nei risultati

**Nota**: I partecipanti che terminano dopo le 17:30 riceveranno una medaglia ma saranno segnati come "Post-Race Participant" nei risultati.

## 🏆 Storia

Dal 1897, la Maratona di Boston è stata una prova di resistenza, velocità e spirito umano. Si corre il terzo lunedì di aprile, in coincidenza con il Patriots' Day nel Massachusetts.

Atleti leggendari come Clarence DeMar, Johnny Kelley, Bill Rodgers, Joan Benoit Samuelson e molti altri hanno inciso i loro nomi nella storia su questo percorso iconico.

---

**Organizzatore**: Boston Athletic Association (B.A.A.)  
**Presentata da**: Bank of America  
**Sito ufficiale**: [baa.org](https://www.baa.org)`,
      city: "Boston, Massachusetts",
      metaTitle:
        "Maratona di Boston 2026 - 130ª Edizione | 20 Aprile | World Marathon Major",
      metaDescription:
        "Maratona di Boston 2026 - 130ª edizione il 20 aprile. La maratona annuale più antica del mondo, Abbott World Marathon Major. Hopkinton → Boston, 42,195km. Tempi di qualificazione richiesti.",
    },
  };

  // Create the event
  const event = await prisma.event.upsert({
    where: { slug: "boston-marathon-2026" },
    update: {
      title: "Boston Marathon 2026 - 130th Edition",
      description: translations.en.description,
      sportTypes: ["RUNNING"],
      startDate: new Date("2026-04-20T10:00:00.000Z"), // 10:00 AM Wave 1 start
      endDate: new Date("2026-04-20T21:30:00.000Z"), // 5:30 PM finish closure
      registrationDeadline: new Date("2025-09-12T21:00:00.000Z"), // 5:00 PM ET Sept 12
      city: "Boston, Massachusetts",
      country: "United States",
      latitude: 42.3601,
      longitude: -71.0589,
      googleMapsUrl: "https://maps.google.com/?q=42.3601,-71.0589",
      externalUrl: "https://www.baa.org/races/boston-marathon",
      imageUrl:
        "https://www.baa.org/sites/default/files/styles/wysiwyg_full/public/2024-06/BAA_BM_2024_04-15-24_HERO_0268_V2.jpg",
      isFeatured: true,
    },
    create: {
      slug: "boston-marathon-2026",
      title: "Boston Marathon 2026 - 130th Edition",
      description: translations.en.description,
      sportTypes: ["RUNNING"],
      startDate: new Date("2026-04-20T10:00:00.000Z"), // 10:00 AM Wave 1 start
      endDate: new Date("2026-04-20T21:30:00.000Z"), // 5:30 PM finish closure
      registrationDeadline: new Date("2025-09-12T21:00:00.000Z"), // 5:00 PM ET Sept 12
      city: "Boston, Massachusetts",
      country: "United States",
      latitude: 42.3601,
      longitude: -71.0589,
      googleMapsUrl: "https://maps.google.com/?q=42.3601,-71.0589",
      externalUrl: "https://www.baa.org/races/boston-marathon",
      imageUrl:
        "https://www.baa.org/sites/default/files/styles/wysiwyg_full/public/2024-06/BAA_BM_2024_04-15-24_HERO_0268_V2.jpg",
      isFeatured: true,
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // Create translations for all 6 languages
  console.log("🌍 Creating translations for all 6 languages...");

  for (const [lang, translation] of Object.entries(translations)) {
    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
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
        language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
        title: translation.title,
        description: translation.description,
        city: translation.city,
        metaTitle: translation.metaTitle,
        metaDescription: translation.metaDescription,
      },
    });

    console.log(`   ✅ Created ${lang.toUpperCase()} translation`);
  }

  // Create event variant
  console.log("🏃 Creating event variant...");

  const findOrCreateVariant = async (
    name: string,
    data: {
      description: string | null;
      distanceKm: number | null;
      elevationGainM: number | null;
      startDate: Date;
      startTime: string | null;
      cutoffTimeHours: number | null;
      price: number | null;
      currency: "USD";
      maxParticipants: number | null;
    }
  ) => {
    const existing = await prisma.eventVariant.findFirst({
      where: { eventId: event.id, name },
    });

    if (existing) {
      return await prisma.eventVariant.update({
        where: { id: existing.id },
        data,
      });
    } else {
      return await prisma.eventVariant.create({
        data: {
          eventId: event.id,
          name,
          ...data,
        },
      });
    }
  };

  const marathonVariant = await findOrCreateVariant("Full Marathon", {
    description:
      "Full 42.195km marathon from Hopkinton to Boston. Qualifying times required. Minimum age: 18 years. Time limit: 7.5 hours (5:30 PM finish closure).",
    distanceKm: 42,
    elevationGainM: 239,
    startDate: new Date("2026-04-20T10:00:00.000Z"), // Wave 1 start
    startTime: "10:00 AM",
    cutoffTimeHours: 7.5,
    price: 240.0,
    currency: "USD",
    maxParticipants: 30000,
  });

  console.log(`✅ Created variant: ${marathonVariant.name}`);

  // Create variant translations for all 6 languages
  console.log("🌍 Creating variant translations...");

  const variantTranslations = {
    pt: {
      name: "Maratona Completa",
      description:
        "Maratona completa de 42,195km de Hopkinton a Boston. Requer tempos de qualificação. Idade mínima: 18 anos. Tempo limite: 7,5 horas (fecho às 17:30).",
    },
    en: {
      name: "Full Marathon",
      description:
        "Full 42.195km marathon from Hopkinton to Boston. Qualifying times required. Minimum age: 18 years. Time limit: 7.5 hours (5:30 PM finish closure).",
    },
    es: {
      name: "Maratón Completo",
      description:
        "Maratón completo de 42,195km de Hopkinton a Boston. Requiere marcas de cualificación. Edad mínima: 18 años. Tiempo límite: 7,5 horas (cierre a las 17:30).",
    },
    fr: {
      name: "Marathon Complet",
      description:
        "Marathon complet de 42,195km de Hopkinton à Boston. Temps de qualification requis. Âge minimum: 18 ans. Limite de temps: 7,5 heures (fermeture à 17h30).",
    },
    de: {
      name: "Vollständiger Marathon",
      description:
        "Vollständiger Marathon von 42,195km von Hopkinton nach Boston. Qualifikationszeiten erforderlich. Mindestalter: 18 Jahre. Zeitlimit: 7,5 Stunden (Schließung um 17:30 Uhr).",
    },
    it: {
      name: "Maratona Completa",
      description:
        "Maratona completa di 42,195km da Hopkinton a Boston. Tempi di qualificazione richiesti. Età minima: 18 anni. Tempo limite: 7,5 ore (chiusura alle 17:30).",
    },
  };

  for (const lang of ["pt", "en", "es", "fr", "de", "it"]) {
    const trans = variantTranslations[lang as keyof typeof variantTranslations];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: marathonVariant.id,
          language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
        },
      },
      update: {
        name: trans.name,
        description: trans.description,
      },
      create: {
        variantId: marathonVariant.id,
        language: lang as "pt" | "en" | "es" | "fr" | "de" | "it",
        name: trans.name,
        description: trans.description,
      },
    });
    console.log(`   ✅ ${lang.toUpperCase()}`);
  }

  // Create pricing phases (linked to eventId)
  console.log("💰 Creating pricing phases...");

  // Delete existing pricing phases to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  const pricingPhases = [
    {
      name: "Full Marathon - Qualifier Registration",
      startDate: new Date("2025-09-08T00:00:00.000Z"),
      endDate: new Date("2025-09-12T21:00:00.000Z"),
      price: 240.0,
      currency: "USD" as const,
      note: "Entry fee for qualified runners. Registration not first-come, first-served.",
    },
    {
      name: "Full Marathon - Charity Program Entry",
      startDate: new Date("2025-07-01T00:00:00.000Z"),
      endDate: new Date("2026-03-15T23:59:59.000Z"),
      price: 0.0,
      currency: "USD" as const,
      note: "Entry via B.A.A. Official Charity Program. Fundraising commitment required.",
    },
  ];

  for (const phase of pricingPhases) {
    await prisma.pricingPhase.create({
      data: {
        eventId: event.id, // ✅ Linked to eventId
        name: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        price: phase.price,
        currency: phase.currency,
        note: phase.note,
      },
    });
    console.log(`   - Created: ${phase.name}`);
  }

  console.log(
    "✅ Boston Marathon 2026 seed completed successfully with all 6 language translations and SEO metadata!"
  );
}

seedBostonMarathon2026()
  .catch((e) => {
    console.error("❌ Error seeding Boston Marathon 2026:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
