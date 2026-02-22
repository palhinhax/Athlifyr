/**
 * Seed: Meia Maratona de Óbidos 2026
 *
 * Event: Half marathon and running races in historic Óbidos
 * Location: Óbidos, Leiria
 * Date: April 19, 2026
 * Organizer: Ganhardestak, Lda.
 */

import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Meia Maratona de Óbidos 2026...");

  // Delete existing event if it exists (idempotency)
  await prisma.event.deleteMany({
    where: {
      OR: [
        { slug: "meia-maratona-obidos-2026" },
        { slug: "renascenca-meia-maratona-obidos-2026" },
      ],
    },
  });

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "Meia Maratona de Óbidos 2026",
      slug: "meia-maratona-obidos-2026",
      description: "Meia Maratona de Óbidos 2026 - Desporto, Saúde e Superação",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-04-19T09:15:00Z"),
      endDate: new Date("2026-04-19T12:15:00Z"),
      registrationDeadline: new Date("2026-04-14T23:59:59Z"),
      imageUrl: "", // To be uploaded via admin
      city: "Óbidos",
      country: "Portugal",
      latitude: 39.3606,
      longitude: -9.1579,
      googleMapsUrl: "https://maps.app.goo.gl/example", // Replace with actual URL
      isFeatured: true,
      cancelled: false,
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // Translations for all 6 languages
  const translations = {
    pt: {
      title: "Meia Maratona de Óbidos 2026",
      description: `# 🏃 Meia Maratona de Óbidos 2026

**Um dia inesquecível de desporto, convívio e descoberta na histórica vila de Óbidos!**

---

## 📅 Data e Horário

- **Data**: 19 de Abril de 2026 (Domingo)
- **Hora de Início**: 09h15
- **Local**: Estádio Municipal de Óbidos
- **Morada**: Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

## 🏃 Provas Disponíveis

### Meia Maratona - 21,097 km
- **Distância**: 21,097 km (Meia Maratona oficial)
- **Idade Mínima**: 18 anos
- **Tempo Limite**: 180 minutos (3 horas)
- **Perfil**: Percurso urbano e paisagístico

### Corrida - 10 km
- **Distância**: 10 km
- **Idade Mínima**: 16 anos (Juvenis)
- **Tempo Limite**: 90 minutos
- **Perfil**: Percurso acessível para diferentes níveis

### Caminhada - 8 km
- **Distância**: 8 km
- **Idade Mínima**: Livre (não competitivo)
- **Tempo Limite**: 120 minutos
- **Perfil**: Percurso familiar e descontraído

## 🎯 Destaques

✅ **Percurso histórico** pela encantadora vila de Óbidos  
✅ **3 distâncias** para todos os níveis (21K, 10K, 8K)  
✅ **T-shirt técnica** para todos os participantes  
✅ **Medalha finisher** para todos os participantes  
✅ **Troféus** para classificação geral, escalões e equipas  
✅ **Secretariado** sábado e domingo para levantamento do kit  
✅ **Bengaleiro** disponível (serviço opcional de 2€)  

## 📋 Secretariado - Levantamento do Kit

**Local**: Estádio Municipal de Óbidos

**Horários**:
- **Sábado, 18 de Abril**: 14h00 às 19h00
- **Domingo, 19 de Abril**: 07h30 às 09h00

**Documentos necessários**:
- Bilhete BOL (físico ou digital)
- O levantamento é individual

## 🏆 Prémios

### Meia Maratona e Corrida 10K

**Classificação Geral**:
- Troféus para os 3 primeiros classificados (Masculino e Feminino)

**Escalões Etários**:
- Troféus para os 3 primeiros classificados por escalão (M/F)

**Equipas**:
- Troféu para as 3 primeiras equipas (3 atletas, independentemente do género)
- Troféu para a equipa mais numerosa inscrita

**Todos os Participantes**:
- T-shirt técnica (tamanhos S, M, L, XL - homem e mulher)
- Medalha finisher

### Caminhada 8K

**Todos os Participantes**:
- T-shirt técnica unissexo
- Medalha finisher
- Não há classificação competitiva

## 👥 Escalões Etários

Os escalões são definidos pela idade que o atleta terá no dia da corrida:

- **Juvenis**: 16-17 anos (apenas Corrida 10K)
- **Juniores**: 18-19 anos
- **Seniores**: 20-34 anos
- **V35**: 35-39 anos
- **V40**: 40-44 anos
- **V45**: 45-49 anos
- **V50**: 50-54 anos
- **V55**: 55-59 anos
- **V60**: 60-64 anos
- **V65**: 65-69 anos
- **V70**: 70-74 anos
- **V75**: 75 ou mais anos

## 🎫 Inscrições

**Período**: Até 14 de Abril de 2026  
**Limite de Inscritos**: 1.500 atletas

### Preços (por fase de inscrição)

| Prova | Out | Nov | Dez-Jan | Fev-Abr |
|-------|-----|-----|---------|---------|
| Meia Maratona 21K | 14€ | 15€ | 16€ | 18,5€ |
| Corrida 10K | 10,5€ | 11,5€ | 12,5€ | 14€ |
| Caminhada 8K | 9€ | 10€ | 11€ | 12,5€ |

**Serviço de Bengaleiro**: 2€ (opcional, apenas Meia Maratona)

### Notas Importantes

❗ **Não há devolução de taxas de inscrição**, exceto por cancelamento da prova  
❗ Inscrições limitadas a **1.500 atletas**  
❗ Verificar dados pessoais nas listas de inscritos publicadas  
❗ Clubes devem usar o **nome oficial** para classificação de equipas  

## 🎽 Material Incluído

- T-shirt técnica (tamanhos S, M, L, XL)
- Medalha finisher
- Chip de cronometragem
- Seguro desportivo
- Abastecimento durante a prova
- Apoio médico

## 📞 Contactos

**Promotor**: Ganhardestak, Lda.  
**Local**: Estádio Municipal de Óbidos  
**Morada**: Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

---

*Aceite o desafio — inscreva-se já!*`,
      city: "Óbidos",
      metaTitle: "Meia Maratona de Óbidos 2026 | Óbidos, Leiria | 19 Abril",
      metaDescription:
        "Meia Maratona de Óbidos 2026 no dia 19 de abril. Provas: Meia Maratona 21K, Corrida 10K e Caminhada 8K. Percurso histórico pela encantadora vila de Óbidos. T-shirt e medalha incluídas.",
    },
    en: {
      title: "Óbidos Half Marathon 2026",
      description: `# 🏃 Óbidos Half Marathon 2026

**An unforgettable day of sport, camaraderie and discovery in the historic town of Óbidos!**

---

## 📅 Date and Time

- **Date**: April 19, 2026 (Sunday)
- **Start Time**: 09:15
- **Location**: Óbidos Municipal Stadium
- **Address**: Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

## 🏃 Available Races

### Half Marathon - 21.097 km
- **Distance**: 21.097 km (Official Half Marathon)
- **Minimum Age**: 18 years
- **Time Limit**: 180 minutes (3 hours)
- **Profile**: Urban and scenic route

### Run - 10 km
- **Distance**: 10 km
- **Minimum Age**: 16 years (Juveniles)
- **Time Limit**: 90 minutes
- **Profile**: Accessible route for different levels

### Walk - 8 km
- **Distance**: 8 km
- **Minimum Age**: Free (non-competitive)
- **Time Limit**: 120 minutes
- **Profile**: Family-friendly and relaxed route

## 🎯 Highlights

✅ **Historic route** through the charming town of Óbidos  
✅ **3 distances** for all levels (21K, 10K, 8K)  
✅ **Technical t-shirt** for all participants  
✅ **Finisher medal** for all participants  
✅ **Trophies** for overall, age groups and teams  
✅ **Race office** Saturday and Sunday for kit collection  
✅ **Bag check** available (optional 2€ service)  

## 📋 Race Office - Kit Collection

**Location**: Óbidos Municipal Stadium

**Schedule**:
- **Saturday, April 18**: 14:00 to 19:00
- **Sunday, April 19**: 07:30 to 09:00

**Required documents**:
- BOL ticket (physical or digital)
- Individual collection only

## 🏆 Awards

### Half Marathon and 10K Run

**Overall Classification**:
- Trophies for top 3 finishers (Male and Female)

**Age Categories**:
- Trophies for top 3 in each age category (M/F)

**Teams**:
- Trophy for top 3 teams (3 athletes, regardless of gender)
- Trophy for largest registered team

**All Participants**:
- Technical t-shirt (sizes S, M, L, XL - men's and women's)
- Finisher medal

### 8K Walk

**All Participants**:
- Technical unisex t-shirt
- Finisher medal
- No competitive classification

## 👥 Age Categories

Categories are defined by the athlete's age on race day:

- **Juveniles**: 16-17 years (10K Run only)
- **Juniors**: 18-19 years
- **Seniors**: 20-34 years
- **V35**: 35-39 years
- **V40**: 40-44 years
- **V45**: 45-49 years
- **V50**: 50-54 years
- **V55**: 55-59 years
- **V60**: 60-64 years
- **V65**: 65-69 years
- **V70**: 70-74 years
- **V75**: 75 or more years

## 🎫 Registration

**Period**: Until April 14, 2026  
**Participant Limit**: 1,500 athletes

### Prices (by registration phase)

| Race | Oct | Nov | Dec-Jan | Feb-Apr |
|------|-----|-----|---------|---------|
| Half Marathon 21K | €14 | €15 | €16 | €18.5 |
| Run 10K | €10.5 | €11.5 | €12.5 | €14 |
| Walk 8K | €9 | €10 | €11 | €12.5 |

**Bag Check Service**: €2 (optional, Half Marathon only)

### Important Notes

❗ **No refunds** except for race cancellation  
❗ Registration limited to **1,500 athletes**  
❗ Verify personal data in published participant lists  
❗ Clubs must use **official name** for team classification  

## 🎽 Included Items

- Technical t-shirt (sizes S, M, L, XL)
- Finisher medal
- Timing chip
- Sports insurance
- Aid stations during race
- Medical support

## 📞 Contact

**Organizer**: Ganhardestak, Lda.  
**Location**: Óbidos Municipal Stadium  
**Address**: Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

---

*Accept the challenge — register now!*`,
      city: "Óbidos",
      metaTitle: "Óbidos Half Marathon 2026 | Óbidos, Leiria | April 19",
      metaDescription:
        "Óbidos Half Marathon 2026 on April 19. Races: Half Marathon 21K, Run 10K and Walk 8K. Historic route through the charming town of Óbidos. T-shirt and medal included.",
    },
    es: {
      title: "Media Maratón de Óbidos 2026",
      description: `# 🏃 Media Maratón de Óbidos 2026

**¡Un día inolvidable de deporte, camaradería y descubrimiento en la histórica villa de Óbidos!**

---

## 📅 Fecha y Hora

- **Fecha**: 19 de Abril de 2026 (Domingo)
- **Hora de Inicio**: 09:15
- **Lugar**: Estadio Municipal de Óbidos
- **Dirección**: Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

## 🏃 Carreras Disponibles

### Media Maratón - 21,097 km
- **Distancia**: 21,097 km (Media Maratón oficial)
- **Edad Mínima**: 18 años
- **Tiempo Límite**: 180 minutos (3 horas)
- **Perfil**: Recorrido urbano y paisajístico

### Carrera - 10 km
- **Distancia**: 10 km
- **Edad Mínima**: 16 años (Juveniles)
- **Tiempo Límite**: 90 minutos
- **Perfil**: Recorrido accesible para diferentes niveles

### Caminata - 8 km
- **Distancia**: 8 km
- **Edad Mínima**: Libre (no competitivo)
- **Tiempo Límite**: 120 minutos
- **Perfil**: Recorrido familiar y relajado

## 🎯 Destacados

✅ **Recorrido histórico** por la encantadora villa de Óbidos  
✅ **3 distancias** para todos los niveles (21K, 10K, 8K)  
✅ **Camiseta técnica** para todos los participantes  
✅ **Medalla finisher** para todos los participantes  
✅ **Trofeos** para clasificación general, categorías y equipos  
✅ **Secretaría** sábado y domingo para recogida del kit  
✅ **Guardarropa** disponible (servicio opcional de 2€)  

## 📋 Secretaría - Recogida del Kit

**Lugar**: Estadio Municipal de Óbidos

**Horarios**:
- **Sábado, 18 de Abril**: 14:00 a 19:00
- **Domingo, 19 de Abril**: 07:30 a 09:00

**Documentos necesarios**:
- Billete BOL (físico o digital)
- Recogida individual

## 🏆 Premios

### Media Maratón y Carrera 10K

**Clasificación General**:
- Trofeos para los 3 primeros clasificados (Masculino y Femenino)

**Categorías de Edad**:
- Trofeos para los 3 primeros por categoría (M/F)

**Equipos**:
- Trofeo para los 3 primeros equipos (3 atletas, independientemente del género)
- Trofeo para el equipo más numeroso inscrito

**Todos los Participantes**:
- Camiseta técnica (tallas S, M, L, XL - hombre y mujer)
- Medalla finisher

### Caminata 8K

**Todos los Participantes**:
- Camiseta técnica unisex
- Medalla finisher
- Sin clasificación competitiva

## 👥 Categorías de Edad

Las categorías se definen por la edad del atleta el día de la carrera:

- **Juveniles**: 16-17 años (solo Carrera 10K)
- **Junior**: 18-19 años
- **Senior**: 20-34 años
- **V35**: 35-39 años
- **V40**: 40-44 años
- **V45**: 45-49 años
- **V50**: 50-54 años
- **V55**: 55-59 años
- **V60**: 60-64 años
- **V65**: 65-69 años
- **V70**: 70-74 años
- **V75**: 75 o más años

## 🎫 Inscripciones

**Período**: Hasta el 14 de Abril de 2026  
**Límite de Inscritos**: 1.500 atletas

### Precios (por fase de inscripción)

| Carrera | Oct | Nov | Dic-Ene | Feb-Abr |
|---------|-----|-----|---------|---------|
| Media Maratón 21K | 14€ | 15€ | 16€ | 18,5€ |
| Carrera 10K | 10,5€ | 11,5€ | 12,5€ | 14€ |
| Caminata 8K | 9€ | 10€ | 11€ | 12,5€ |

**Servicio de Guardarropa**: 2€ (opcional, solo Media Maratón)

### Notas Importantes

❗ **No hay devolución de tasas de inscripción** excepto por cancelación de la carrera  
❗ Inscripciones limitadas a **1.500 atletas**  
❗ Verificar datos personales en las listas de inscritos publicadas  
❗ Los clubes deben usar el **nombre oficial** para clasificación de equipos  

## 🎽 Material Incluido

- Camiseta técnica (tallas S, M, L, XL)
- Medalla finisher
- Chip de cronometraje
- Seguro deportivo
- Avituallamiento durante la carrera
- Apoyo médico

## 📞 Contacto

**Promotor**: Ganhardestak, Lda.  
**Lugar**: Estadio Municipal de Óbidos  
**Dirección**: Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

---

*¡Acepta el desafío — inscríbete ya!*`,
      city: "Óbidos",
      metaTitle: "Media Maratón de Óbidos 2026 | Óbidos, Leiria | 19 Abril",
      metaDescription:
        "Media Maratón de Óbidos 2026 el 19 de abril. Carreras: Media Maratón 21K, Carrera 10K y Caminata 8K. Recorrido histórico por la encantadora villa de Óbidos. Camiseta y medalla incluidas.",
    },
    fr: {
      title: "Semi-Marathon d'Óbidos 2026",
      description: `# 🏃 Semi-Marathon d'Óbidos 2026

**Une journée inoubliable de sport, convivialité et découverte dans la ville historique d'Óbidos !**

---

## 📅 Date et Heure

- **Date** : 19 Avril 2026 (Dimanche)
- **Heure de Départ** : 09h15
- **Lieu** : Stade Municipal d'Óbidos
- **Adresse** : Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

## 🏃 Courses Disponibles

### Semi-Marathon - 21,097 km
- **Distance** : 21,097 km (Semi-Marathon officiel)
- **Âge Minimum** : 18 ans
- **Temps Limite** : 180 minutes (3 heures)
- **Profil** : Parcours urbain et paysager

### Course - 10 km
- **Distance** : 10 km
- **Âge Minimum** : 16 ans (Juvéniles)
- **Temps Limite** : 90 minutes
- **Profil** : Parcours accessible pour différents niveaux

### Marche - 8 km
- **Distance** : 8 km
- **Âge Minimum** : Libre (non compétitif)
- **Temps Limite** : 120 minutes
- **Profil** : Parcours familial et détendu

## 🎯 Points Forts

✅ **Parcours historique** à travers la charmante ville d'Óbidos  
✅ **3 distances** pour tous les niveaux (21K, 10K, 8K)  
✅ **T-shirt technique** pour tous les participants  
✅ **Médaille finisher** pour tous les participants  
✅ **Trophées** pour classement général, catégories et équipes  
✅ **Secrétariat** samedi et dimanche pour retrait du kit  
✅ **Vestiaire** disponible (service optionnel de 2€)  

## 📋 Secrétariat - Retrait du Kit

**Lieu** : Stade Municipal d'Óbidos

**Horaires** :
- **Samedi 18 Avril** : 14h00 à 19h00
- **Dimanche 19 Avril** : 07h30 à 09h00

**Documents nécessaires** :
- Billet BOL (physique ou numérique)
- Retrait individuel uniquement

## 🏆 Récompenses

### Semi-Marathon et Course 10K

**Classement Général** :
- Trophées pour les 3 premiers classés (Hommes et Femmes)

**Catégories d'Âge** :
- Trophées pour les 3 premiers par catégorie (H/F)

**Équipes** :
- Trophée pour les 3 premières équipes (3 athlètes, quel que soit le genre)
- Trophée pour l'équipe la plus nombreuse inscrite

**Tous les Participants** :
- T-shirt technique (tailles S, M, L, XL - homme et femme)
- Médaille finisher

### Marche 8K

**Tous les Participants** :
- T-shirt technique unisexe
- Médaille finisher
- Pas de classement compétitif

## 👥 Catégories d'Âge

Les catégories sont définies par l'âge de l'athlète le jour de la course :

- **Juvéniles** : 16-17 ans (Course 10K uniquement)
- **Juniors** : 18-19 ans
- **Seniors** : 20-34 ans
- **V35** : 35-39 ans
- **V40** : 40-44 ans
- **V45** : 45-49 ans
- **V50** : 50-54 ans
- **V55** : 55-59 ans
- **V60** : 60-64 ans
- **V65** : 65-69 ans
- **V70** : 70-74 ans
- **V75** : 75 ans ou plus

## 🎫 Inscriptions

**Période** : Jusqu'au 14 Avril 2026  
**Limite de Participants** : 1 500 athlètes

### Prix (par phase d'inscription)

| Course | Oct | Nov | Déc-Jan | Fév-Avr |
|--------|-----|-----|---------|---------|
| Semi-Marathon 21K | 14€ | 15€ | 16€ | 18,5€ |
| Course 10K | 10,5€ | 11,5€ | 12,5€ | 14€ |
| Marche 8K | 9€ | 10€ | 11€ | 12,5€ |

**Service Vestiaire** : 2€ (optionnel, Semi-Marathon uniquement)

### Notes Importantes

❗ **Pas de remboursement** sauf annulation de la course  
❗ Inscriptions limitées à **1 500 athlètes**  
❗ Vérifier les données personnelles dans les listes de participants publiées  
❗ Les clubs doivent utiliser le **nom officiel** pour le classement par équipes  

## 🎽 Matériel Inclus

- T-shirt technique (tailles S, M, L, XL)
- Médaille finisher
- Puce de chronométrage
- Assurance sportive
- Ravitaillements pendant la course
- Soutien médical

## 📞 Contact

**Organisateur** : Ganhardestak, Lda.  
**Lieu** : Stade Municipal d'Óbidos  
**Adresse** : Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

---

*Relevez le défi — inscrivez-vous maintenant !*`,
      city: "Óbidos",
      metaTitle: "Semi-Marathon d'Óbidos 2026 | Óbidos, Leiria | 19 Avril",
      metaDescription:
        "Semi-Marathon d'Óbidos 2026 le 19 avril. Courses : Semi-Marathon 21K, Course 10K et Marche 8K. Parcours historique à travers la charmante ville d'Óbidos. T-shirt et médaille inclus.",
    },
    de: {
      title: "Halbmarathon Óbidos 2026",
      description: `# 🏃 Halbmarathon Óbidos 2026

**Ein unvergesslicher Tag voller Sport, Kameradschaft und Entdeckungen in der historischen Stadt Óbidos!**

---

## 📅 Datum und Uhrzeit

- **Datum**: 19. April 2026 (Sonntag)
- **Startzeit**: 09:15
- **Ort**: Städtisches Stadion Óbidos
- **Adresse**: Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

## 🏃 Verfügbare Läufe

### Halbmarathon - 21,097 km
- **Distanz**: 21,097 km (Offizieller Halbmarathon)
- **Mindestalter**: 18 Jahre
- **Zeitlimit**: 180 Minuten (3 Stunden)
- **Profil**: Städtische und landschaftliche Strecke

### Lauf - 10 km
- **Distanz**: 10 km
- **Mindestalter**: 16 Jahre (Jugendliche)
- **Zeitlimit**: 90 Minuten
- **Profil**: Zugängliche Strecke für verschiedene Niveaus

### Wanderung - 8 km
- **Distanz**: 8 km
- **Mindestalter**: Frei (nicht wettbewerbsfähig)
- **Zeitlimit**: 120 Minuten
- **Profil**: Familien- und entspannte Strecke

## 🎯 Höhepunkte

✅ **Historische Strecke** durch die charmante Stadt Óbidos  
✅ **3 Distanzen** für alle Niveaus (21K, 10K, 8K)  
✅ **Technisches T-Shirt** für alle Teilnehmer  
✅ **Finisher-Medaille** für alle Teilnehmer  
✅ **Trophäen** für Gesamtwertung, Alterskategorien und Teams  
✅ **Rennsekretariat** Samstag und Sonntag zur Kit-Abholung  
✅ **Gepäckaufbewahrung** verfügbar (optionaler Service für 2€)  

## 📋 Rennsekretariat - Kit-Abholung

**Ort**: Städtisches Stadion Óbidos

**Öffnungszeiten**:
- **Samstag, 18. April**: 14:00 bis 19:00
- **Sonntag, 19. April**: 07:30 bis 09:00

**Erforderliche Dokumente**:
- BOL-Ticket (physisch oder digital)
- Nur individuelle Abholung

## 🏆 Preise

### Halbmarathon und 10K-Lauf

**Gesamtwertung**:
- Trophäen für die Top 3 Finisher (Männer und Frauen)

**Alterskategorien**:
- Trophäen für die Top 3 in jeder Alterskategorie (M/F)

**Teams**:
- Trophäe für die Top 3 Teams (3 Athleten, unabhängig vom Geschlecht)
- Trophäe für das größte registrierte Team

**Alle Teilnehmer**:
- Technisches T-Shirt (Größen S, M, L, XL - Herren und Damen)
- Finisher-Medaille

### 8K-Wanderung

**Alle Teilnehmer**:
- Technisches Unisex-T-Shirt
- Finisher-Medaille
- Keine Wettbewerbswertung

## 👥 Alterskategorien

Kategorien werden durch das Alter des Athleten am Renntag definiert:

- **Jugendliche**: 16-17 Jahre (nur 10K-Lauf)
- **Junioren**: 18-19 Jahre
- **Senioren**: 20-34 Jahre
- **V35**: 35-39 Jahre
- **V40**: 40-44 Jahre
- **V45**: 45-49 Jahre
- **V50**: 50-54 Jahre
- **V55**: 55-59 Jahre
- **V60**: 60-64 Jahre
- **V65**: 65-69 Jahre
- **V70**: 70-74 Jahre
- **V75**: 75 Jahre oder mehr

## 🎫 Anmeldung

**Zeitraum**: Bis 14. April 2026  
**Teilnehmerlimit**: 1.500 Athleten

### Preise (nach Anmeldephase)

| Lauf | Okt | Nov | Dez-Jan | Feb-Apr |
|------|-----|-----|---------|---------|
| Halbmarathon 21K | 14€ | 15€ | 16€ | 18,5€ |
| Lauf 10K | 10,5€ | 11,5€ | 12,5€ | 14€ |
| Wanderung 8K | 9€ | 10€ | 11€ | 12,5€ |

**Gepäckaufbewahrung**: 2€ (optional, nur Halbmarathon)

### Wichtige Hinweise

❗ **Keine Rückerstattung** außer bei Rennabsage  
❗ Anmeldung begrenzt auf **1.500 Athleten**  
❗ Persönliche Daten in veröffentlichten Teilnehmerlisten überprüfen  
❗ Clubs müssen **offiziellen Namen** für Teamwertung verwenden  

## 🎽 Enthaltene Artikel

- Technisches T-Shirt (Größen S, M, L, XL)
- Finisher-Medaille
- Timing-Chip
- Sportversicherung
- Verpflegungsstationen während des Rennens
- Medizinische Unterstützung

## 📞 Kontakt

**Veranstalter**: Ganhardestak, Lda.  
**Ort**: Städtisches Stadion Óbidos  
**Adresse**: Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

---

*Nehmen Sie die Herausforderung an — jetzt anmelden!*`,
      city: "Óbidos",
      metaTitle: "Halbmarathon Óbidos 2026 | Óbidos, Leiria | 19. April",
      metaDescription:
        "Halbmarathon Óbidos 2026 am 19. April. Läufe: Halbmarathon 21K, Lauf 10K und Wanderung 8K. Historische Strecke durch die charmante Stadt Óbidos. T-Shirt und Medaille inklusive.",
    },
    it: {
      title: "Mezza Maratona di Óbidos 2026",
      description: `# 🏃 Mezza Maratona di Óbidos 2026

**Una giornata indimenticabile di sport, convivialità e scoperta nella storica città di Óbidos!**

---

## 📅 Data e Orario

- **Data**: 19 Aprile 2026 (Domenica)
- **Ora di Partenza**: 09:15
- **Luogo**: Stadio Municipale di Óbidos
- **Indirizzo**: Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

## 🏃 Gare Disponibili

### Mezza Maratona - 21,097 km
- **Distanza**: 21,097 km (Mezza Maratona ufficiale)
- **Età Minima**: 18 anni
- **Tempo Limite**: 180 minuti (3 ore)
- **Profilo**: Percorso urbano e paesaggistico

### Corsa - 10 km
- **Distanza**: 10 km
- **Età Minima**: 16 anni (Giovanissimi)
- **Tempo Limite**: 90 minuti
- **Profilo**: Percorso accessibile per diversi livelli

### Camminata - 8 km
- **Distanza**: 8 km
- **Età Minima**: Libera (non competitivo)
- **Tempo Limite**: 120 minuti
- **Profilo**: Percorso familiare e rilassato

## 🎯 Punti Salienti

✅ **Percorso storico** attraverso l'incantevole città di Óbidos  
✅ **3 distanze** per tutti i livelli (21K, 10K, 8K)  
✅ **Maglietta tecnica** per tutti i partecipanti  
✅ **Medaglia finisher** per tutti i partecipanti  
✅ **Trofei** per classificazione generale, categorie e squadre  
✅ **Segreteria** sabato e domenica per ritiro del kit  
✅ **Deposito bagagli** disponibile (servizio opzionale da 2€)  

## 📋 Segreteria - Ritiro del Kit

**Luogo**: Stadio Municipale di Óbidos

**Orari**:
- **Sabato 18 Aprile**: 14:00 alle 19:00
- **Domenica 19 Aprile**: 07:30 alle 09:00

**Documenti necessari**:
- Biglietto BOL (fisico o digitale)
- Ritiro individuale

## 🏆 Premi

### Mezza Maratona e Corsa 10K

**Classifica Generale**:
- Trofei per i primi 3 classificati (Maschile e Femminile)

**Categorie di Età**:
- Trofei per i primi 3 per categoria (M/F)

**Squadre**:
- Trofeo per le prime 3 squadre (3 atleti, indipendentemente dal genere)
- Trofeo per la squadra più numerosa iscritta

**Tutti i Partecipanti**:
- Maglietta tecnica (taglie S, M, L, XL - uomo e donna)
- Medaglia finisher

### Camminata 8K

**Tutti i Partecipanti**:
- Maglietta tecnica unisex
- Medaglia finisher
- Nessuna classificazione competitiva

## 👥 Categorie di Età

Le categorie sono definite dall'età dell'atleta il giorno della gara:

- **Giovanissimi**: 16-17 anni (solo Corsa 10K)
- **Junior**: 18-19 anni
- **Senior**: 20-34 anni
- **V35**: 35-39 anni
- **V40**: 40-44 anni
- **V45**: 45-49 anni
- **V50**: 50-54 anni
- **V55**: 55-59 anni
- **V60**: 60-64 anni
- **V65**: 65-69 anni
- **V70**: 70-74 anni
- **V75**: 75 anni o più

## 🎫 Iscrizioni

**Periodo**: Fino al 14 Aprile 2026  
**Limite Partecipanti**: 1.500 atleti

### Prezzi (per fase di iscrizione)

| Gara | Ott | Nov | Dic-Gen | Feb-Apr |
|------|-----|-----|---------|---------|
| Mezza Maratona 21K | 14€ | 15€ | 16€ | 18,5€ |
| Corsa 10K | 10,5€ | 11,5€ | 12,5€ | 14€ |
| Camminata 8K | 9€ | 10€ | 11€ | 12,5€ |

**Servizio Deposito Bagagli**: 2€ (opzionale, solo Mezza Maratona)

### Note Importanti

❗ **Nessun rimborso** tranne in caso di annullamento della gara  
❗ Iscrizioni limitate a **1.500 atleti**  
❗ Verificare i dati personali nelle liste dei partecipanti pubblicate  
❗ I club devono usare il **nome ufficiale** per la classificazione a squadre  

## 🎽 Materiale Incluso

- Maglietta tecnica (taglie S, M, L, XL)
- Medaglia finisher
- Chip di cronometraggio
- Assicurazione sportiva
- Ristori durante la gara
- Supporto medico

## 📞 Contatti

**Organizzatore**: Ganhardestak, Lda.  
**Luogo**: Stadio Municipale di Óbidos  
**Indirizzo**: Bairro dos Arcos, R. do Ginásio, 2510-081 Óbidos

---

*Accetta la sfida — iscriviti subito!*`,
      city: "Óbidos",
      metaTitle: "Mezza Maratona di Óbidos 2026 | Óbidos, Leiria | 19 Aprile",
      metaDescription:
        "Mezza Maratona di Óbidos 2026 il 19 aprile. Gare: Mezza Maratona 21K, Corsa 10K e Camminata 8K. Percorso storico attraverso l'incantevole città di Óbidos. Maglietta e medaglia incluse.",
    },
  };

  // Create translations for all languages
  const languages: Language[] = ["pt", "en", "es", "fr", "de", "it"];

  for (const lang of languages) {
    const translation = translations[lang];
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
  }

  console.log("✅ Created translations for all languages");

  // Define race variants with pricing phases
  const variants = [
    {
      name: "Meia Maratona 21K",
      distanceKm: 21.097,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-04-19T09:15:00Z"),
      startTime: "09:15",
      cutoffTimeHours: 3, // 180 minutes
      price: 18.5,
      currency: Currency.EUR,
      maxParticipants: 1500,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Urbano e paisagístico · Meia Maratona oficial · Idade mínima: 18 anos · Categorias: Juniores, Seniores, V35 a V75+ · Inclui: T-shirt técnica, Medalha finisher, Chip, Seguro, Abastecimento",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-10-30T23:59:59Z"),
          price: 14,
          currency: Currency.EUR,
          note: "Fase Inicial (Outubro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-11-01T00:00:00Z"),
          endDate: new Date("2025-11-27T23:59:59Z"),
          price: 15,
          currency: Currency.EUR,
          note: "Fase Intermédia (Novembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-11-28T00:00:00Z"),
          endDate: new Date("2026-01-30T23:59:59Z"),
          price: 16,
          currency: Currency.EUR,
          note: "Fase Tardia (Novembro-Janeiro)",
        },
        {
          name: "4ª Fase",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-04-14T23:59:59Z"),
          price: 18.5,
          currency: Currency.EUR,
          note: "Fase Final (Fevereiro-Abril)",
        },
      ],
    },
    {
      name: "Corrida 10K",
      distanceKm: 10,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-04-19T09:15:00Z"),
      startTime: "09:15",
      cutoffTimeHours: 1.5, // 90 minutes
      price: 14,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Urbano e acessível · Corrida para todos os níveis · Idade mínima: 16 anos · Categorias: Juvenis, Juniores, Seniores, Veteranos · Inclui: T-shirt técnica, Medalha finisher, Chip, Seguro, Abastecimento",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-10-30T23:59:59Z"),
          price: 10.5,
          currency: Currency.EUR,
          note: "Fase Inicial (Outubro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-11-01T00:00:00Z"),
          endDate: new Date("2025-11-27T23:59:59Z"),
          price: 11.5,
          currency: Currency.EUR,
          note: "Fase Intermédia (Novembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-11-28T00:00:00Z"),
          endDate: new Date("2026-01-30T23:59:59Z"),
          price: 12.5,
          currency: Currency.EUR,
          note: "Fase Tardia (Novembro-Janeiro)",
        },
        {
          name: "4ª Fase",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-04-14T23:59:59Z"),
          price: 14,
          currency: Currency.EUR,
          note: "Fase Final (Fevereiro-Abril)",
        },
      ],
    },
    {
      name: "Caminhada 8K",
      distanceKm: 8,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-04-19T09:15:00Z"),
      startTime: "09:15",
      cutoffTimeHours: 2, // 120 minutes
      price: 12.5,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Urbano e familiar · Não competitivo, sem classificação · Todas as idades · Inclui: T-shirt técnica unissexo, Medalha finisher, Seguro",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-10-30T23:59:59Z"),
          price: 9,
          currency: Currency.EUR,
          note: "Fase Inicial (Outubro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-11-01T00:00:00Z"),
          endDate: new Date("2025-11-27T23:59:59Z"),
          price: 10,
          currency: Currency.EUR,
          note: "Fase Intermédia (Novembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-11-28T00:00:00Z"),
          endDate: new Date("2026-01-30T23:59:59Z"),
          price: 11,
          currency: Currency.EUR,
          note: "Fase Tardia (Novembro-Janeiro)",
        },
        {
          name: "4ª Fase",
          startDate: new Date("2026-02-01T00:00:00Z"),
          endDate: new Date("2026-04-14T23:59:59Z"),
          price: 12.5,
          currency: Currency.EUR,
          note: "Fase Final (Fevereiro-Abril)",
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
          eventId: event.id, // ✅ CORRECT: linked to eventId
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

  console.log("✅ Seed completed successfully!");
  console.log(`
📊 Summary:
- Event: Meia Maratona de Óbidos 2026
- Variants: 3 race distances
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 12 total
- Date: April 19, 2026
- Location: Óbidos, Leiria
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
