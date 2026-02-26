/**
 * Seed: Trail de Conímbriga Terras de Sicó 2026 - XVII Edição
 *
 * Event: Trail running event with 7 race variants
 * Location: Condeixa-a-Nova, Penela, Ansião, Alvaiázere, Soure, Pombal
 * Date: June 19-21, 2026
 * Organizer: Associação Desportiva O Mundo da Corrida
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Trail de Conímbriga Terras de Sicó 2026...");

  // Delete existing event if it exists (idempotency)
  await prisma.event.deleteMany({
    where: {
      OR: [
        { slug: "trail-conimbriga-sico-2026" },
        { slug: "trail-conimbriga-terras-sico-2026" },
      ],
    },
  });

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "Trail de Conímbriga Terras de Sicó 2026",
      slug: "trail-conimbriga-sico-2026",
      description: "XVII Edição do Trail de Conímbriga Terras de Sicó",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-06-19T08:00:00Z"),
      endDate: new Date("2026-06-22T15:00:00Z"),
      registrationDeadline: new Date("2026-06-14T23:59:59Z"),
      imageUrl: "", // To be uploaded via admin
      city: "Condeixa-a-Nova",
      country: "Portugal",
      latitude: 40.1155,
      longitude: -8.4992,
      externalUrl: "https://www.ultrasico.com",
      isFeatured: true,
      cancelled: false,
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // Translations for all 6 languages
  const translations = {
    pt: {
      title: "Trail de Conímbriga Terras de Sicó 2026 - XVII Edição",
      description: `# 🏔️ Trail de Conímbriga Terras de Sicó 2026 - XVII Edição

**17 Anos a desenvolver as Terras de Sicó, não há amor como o primeiro...**

---

## 📅 Datas do Evento

- **19 de Junho**: 111 Milhas (08h00) e 111 km (22h00)
- **20 de Junho**: 60 km (08h30) e 42 km (09h00)
- **21 de Junho**: 25 km (09h00), 13 km (09h30) e 13 km caminhada (09h40)

## 🏃 Provas Disponíveis

### Trail Ultra Endurance XL - 111 Milhas
- **Distância**: 178 km
- **Desnível Positivo**: 6.208m
- **Tempo Limite**: 40h30
- **Partida**: 19 Junho, 08h00
- **Idade Mínima**: 20 anos

### Trail Ultra Endurance - 111 km
- **Distância**: 111 km
- **Desnível Positivo**: 4.290m
- **Tempo Limite**: 26 horas
- **Partida**: 19 Junho, 22h00
- **Idade Mínima**: 20 anos
- **Qualificação**: Western States 2027 (se completada em 24h)

### Trail Ultra Médio - 60 km
- **Distância**: 60 km
- **Desnível Positivo**: 2.443m
- **Tempo Limite**: 13 horas
- **Partida**: 20 Junho, 08h30 (Santiago da Guarda)
- **Idade Mínima**: 20 anos

### Trail Longo - 42 km
- **Distância**: 42 km
- **Desnível Positivo**: 1.843m
- **Tempo Limite**: 8h30
- **Partida**: 20 Junho, 09h00
- **Idade Mínima**: 20 anos

### Trail Sprint - 25 km
- **Distância**: 25 km
- **Desnível Positivo**: 1.131m
- **Tempo Limite**: 5 horas
- **Partida**: 21 Junho, 09h00
- **Idade Mínima**: 18 anos (Juniores)

### Trail Jovem - 13 km
- **Distância**: 13 km
- **Desnível Positivo**: 423m
- **Tempo Limite**: 3 horas
- **Partida**: 21 Junho, 09h30
- **Idade Mínima**: 16 anos (Juvenis)

### Caminhada - 13 km
- **Distância**: 13 km
- **Desnível Positivo**: 365m
- **Tempo Limite**: 4 horas
- **Partida**: 21 Junho, 09h40
- **Não Competitivo**

## 🎯 Destaques

✅ Evento qualificativo para **Western States 2027**  
✅ Pontuação **ITRA** (Mont Blanc, Lavaredo, X-Alpine)  
✅ Provas certificadas com **Grau 2 de dificuldade**  
✅ 7 provas de trail running para todos os níveis  
✅ Percursos pelos concelhos de Condeixa-a-Nova, Penela, Ansião, Alvaiázere, Soure e Pombal  
✅ Abastecimentos completos e bases de vida  
✅ Massagens na chegada  
✅ Seguro desportivo incluído  

## 📋 Material Obrigatório

**111 Milhas e 111 km:**
- Manta térmica
- Telemóvel carregado
- Copo reutilizável
- Geo localizador (fornecido pela organização)
- Apito

**60 km, 42 km, 25 km e 13 km:**
- Manta térmica
- Telemóvel carregado
- Copo reutilizável
- Apito

## 🏆 Prémios

Troféus para os 3 primeiros classificados (masculinos e femininos) em:
- Classificação geral
- Escalões etários
- Equipas (3 melhores classificações)

## 🎫 Inscrições

**Período**: 15 Junho 2025 a 14 Junho 2026

### Preços (consoante fase de inscrição)

| Prova | Jul-Set | Out-Dez | Jan-Jun |
|-------|---------|---------|---------|
| 111 Milhas | 95€ | 105€ | 115€ |
| 111 km | 70€ | 75€ | 80€ |
| 60 km | 50€ | 55€ | 60€ |
| 42 km | 38€ | 40€ | 45€ |
| 25 km | 24€ | 26€ | 30€ |
| 13 km | 14€ | 16€ | 18€ |
| Caminhada | 12€ | 12€ | 13€ |

## 📞 Contactos

**Email**: omdceventos@gmail.com  
**Website**: [www.ultrasico.com](https://www.ultrasico.com)

---

*Organizado pela Associação Desportiva O Mundo da Corrida*`,
      city: "Condeixa-a-Nova",
      region: "Coimbra",
      country: "Portugal",
      metaTitle:
        "Trail Conímbriga Terras de Sicó 2026 - XVII Ed. | Condeixa-a-Nova | 19-21 Junho",
      metaDescription:
        "Trail de Conímbriga Terras de Sicó 2026 - XVII Edição de 19 a 21 de junho em Condeixa-a-Nova. 7 provas: 111 Milhas, 111km, 60km, 42km, 25km e 13km. Qualificação Western States. Pontuação ITRA.",
    },
    en: {
      title: "Trail de Conímbriga Terras de Sicó 2026 - 17th Edition",
      description: `# 🏔️ Trail de Conímbriga Terras de Sicó 2026 - 17th Edition

**17 Years developing Terras de Sicó, there's no love like the first...**

---

## 📅 Event Dates

- **June 19**: 111 Miles (08:00) and 111 km (22:00)
- **June 20**: 60 km (08:30) and 42 km (09:00)
- **June 21**: 25 km (09:00), 13 km (09:30) and 13 km walk (09:40)

## 🏃 Available Races

### Trail Ultra Endurance XL - 111 Miles
- **Distance**: 178 km
- **Elevation Gain**: 6,208m
- **Time Limit**: 40h30
- **Start**: June 19, 08:00
- **Minimum Age**: 20 years

### Trail Ultra Endurance - 111 km
- **Distance**: 111 km
- **Elevation Gain**: 4,290m
- **Time Limit**: 26 hours
- **Start**: June 19, 22:00
- **Minimum Age**: 20 years
- **Qualification**: Western States 2027 (if completed in 24h)

### Trail Ultra Medium - 60 km
- **Distance**: 60 km
- **Elevation Gain**: 2,443m
- **Time Limit**: 13 hours
- **Start**: June 20, 08:30 (Santiago da Guarda)
- **Minimum Age**: 20 years

### Trail Long - 42 km
- **Distance**: 42 km
- **Elevation Gain**: 1,843m
- **Time Limit**: 8h30
- **Start**: June 20, 09:00
- **Minimum Age**: 20 years

### Trail Sprint - 25 km
- **Distance**: 25 km
- **Elevation Gain**: 1,131m
- **Time Limit**: 5 hours
- **Start**: June 21, 09:00
- **Minimum Age**: 18 years (Juniors)

### Trail Youth - 13 km
- **Distance**: 13 km
- **Elevation Gain**: 423m
- **Time Limit**: 3 hours
- **Start**: June 21, 09:30
- **Minimum Age**: 16 years (Juveniles)

### Walk - 13 km
- **Distance**: 13 km
- **Elevation Gain**: 365m
- **Time Limit**: 4 hours
- **Start**: June 21, 09:40
- **Non-competitive**

## 🎯 Highlights

✅ **Western States 2027** qualifying event  
✅ **ITRA** points (Mont Blanc, Lavaredo, X-Alpine)  
✅ Certified races with **Grade 2 difficulty**  
✅ 7 trail running races for all levels  
✅ Routes through Condeixa-a-Nova, Penela, Ansião, Alvaiázere, Soure and Pombal  
✅ Complete aid stations and life bases  
✅ Finish line massages  
✅ Sports insurance included  

## 📋 Mandatory Equipment

**111 Miles and 111 km:**
- Thermal blanket
- Charged mobile phone
- Reusable cup
- Geo locator (provided by organization)
- Whistle

**60 km, 42 km, 25 km and 13 km:**
- Thermal blanket
- Charged mobile phone
- Reusable cup
- Whistle

## 🏆 Awards

Trophies for the top 3 finishers (male and female) in:
- Overall classification
- Age categories
- Teams (3 best classifications)

## 🎫 Registration

**Period**: June 15, 2025 to June 14, 2026

### Prices (by registration phase)

| Race | Jul-Sep | Oct-Dec | Jan-Jun |
|------|---------|---------|---------|
| 111 Miles | €95 | €105 | €115 |
| 111 km | €70 | €75 | €80 |
| 60 km | €50 | €55 | €60 |
| 42 km | €38 | €40 | €45 |
| 25 km | €24 | €26 | €30 |
| 13 km | €14 | €16 | €18 |
| Walk | €12 | €12 | €13 |

## 📞 Contact

**Email**: omdceventos@gmail.com  
**Website**: [www.ultrasico.com](https://www.ultrasico.com)

---

*Organized by Associação Desportiva O Mundo da Corrida*`,
      city: "Condeixa-a-Nova",
      region: "Coimbra",
      country: "Portugal",
      metaTitle:
        "Trail Conímbriga Terras de Sicó 2026 - 17th Ed. | Condeixa-a-Nova | June 19-21",
      metaDescription:
        "Trail de Conímbriga Terras de Sicó 2026 - 17th Edition from June 19-21 in Condeixa-a-Nova. 7 races: 111 Miles, 111km, 60km, 42km, 25km and 13km. Western States qualifier. ITRA points.",
    },
    es: {
      title: "Trail de Conímbriga Terras de Sicó 2026 - XVII Edición",
      description: `# 🏔️ Trail de Conímbriga Terras de Sicó 2026 - XVII Edición

**17 Años desarrollando las Terras de Sicó, no hay amor como el primero...**

---

## 📅 Fechas del Evento

- **19 de Junio**: 111 Millas (08:00) y 111 km (22:00)
- **20 de Junio**: 60 km (08:30) y 42 km (09:00)
- **21 de Junio**: 25 km (09:00), 13 km (09:30) y 13 km caminata (09:40)

## 🏃 Carreras Disponibles

### Trail Ultra Endurance XL - 111 Millas
- **Distancia**: 178 km
- **Desnivel Positivo**: 6.208m
- **Tiempo Límite**: 40h30
- **Salida**: 19 Junio, 08:00
- **Edad Mínima**: 20 años

### Trail Ultra Endurance - 111 km
- **Distancia**: 111 km
- **Desnivel Positivo**: 4.290m
- **Tiempo Límite**: 26 horas
- **Salida**: 19 Junio, 22:00
- **Edad Mínima**: 20 años
- **Calificación**: Western States 2027 (si se completa en 24h)

### Trail Ultra Medio - 60 km
- **Distancia**: 60 km
- **Desnivel Positivo**: 2.443m
- **Tiempo Límite**: 13 horas
- **Salida**: 20 Junio, 08:30 (Santiago da Guarda)
- **Edad Mínima**: 20 años

### Trail Largo - 42 km
- **Distancia**: 42 km
- **Desnivel Positivo**: 1.843m
- **Tiempo Límite**: 8h30
- **Salida**: 20 Junio, 09:00
- **Edad Mínima**: 20 años

### Trail Sprint - 25 km
- **Distancia**: 25 km
- **Desnivel Positivo**: 1.131m
- **Tiempo Límite**: 5 horas
- **Salida**: 21 Junio, 09:00
- **Edad Mínima**: 18 años (Juniors)

### Trail Joven - 13 km
- **Distancia**: 13 km
- **Desnivel Positivo**: 423m
- **Tiempo Límite**: 3 horas
- **Salida**: 21 Junio, 09:30
- **Edad Mínima**: 16 años (Juveniles)

### Caminata - 13 km
- **Distancia**: 13 km
- **Desnivel Positivo**: 365m
- **Tiempo Límite**: 4 horas
- **Salida**: 21 Junio, 09:40
- **No Competitivo**

## 🎯 Destacados

✅ Evento clasificatorio para **Western States 2027**  
✅ Puntos **ITRA** (Mont Blanc, Lavaredo, X-Alpine)  
✅ Carreras certificadas con **Grado 2 de dificultad**  
✅ 7 carreras de trail running para todos los niveles  
✅ Recorridos por Condeixa-a-Nova, Penela, Ansião, Alvaiázere, Soure y Pombal  
✅ Avituallamientos completos y bases de vida  
✅ Masajes en la llegada  
✅ Seguro deportivo incluido  

## 📋 Equipo Obligatorio

**111 Millas y 111 km:**
- Manta térmica
- Teléfono móvil cargado
- Vaso reutilizable
- Geo localizador (proporcionado por la organización)
- Silbato

**60 km, 42 km, 25 km y 13 km:**
- Manta térmica
- Teléfono móvil cargado
- Vaso reutilizable
- Silbato

## 🏆 Premios

Trofeos para los 3 primeros clasificados (masculinos y femeninos) en:
- Clasificación general
- Categorías de edad
- Equipos (3 mejores clasificaciones)

## 🎫 Inscripciones

**Período**: 15 Junio 2025 a 14 Junio 2026

### Precios (según fase de inscripción)

| Carrera | Jul-Sep | Oct-Dic | Ene-Jun |
|---------|---------|---------|---------|
| 111 Millas | 95€ | 105€ | 115€ |
| 111 km | 70€ | 75€ | 80€ |
| 60 km | 50€ | 55€ | 60€ |
| 42 km | 38€ | 40€ | 45€ |
| 25 km | 24€ | 26€ | 30€ |
| 13 km | 14€ | 16€ | 18€ |
| Caminata | 12€ | 12€ | 13€ |

## 📞 Contacto

**Email**: omdceventos@gmail.com  
**Website**: [www.ultrasico.com](https://www.ultrasico.com)

---

*Organizado por Associação Desportiva O Mundo da Corrida*`,
      city: "Condeixa-a-Nova",
      region: "Coimbra",
      country: "Portugal",
      metaTitle:
        "Trail Conímbriga Terras de Sicó 2026 - XVII Ed. | Condeixa-a-Nova | 19-21 Junio",
      metaDescription:
        "Trail de Conímbriga Terras de Sicó 2026 - XVII Edición del 19 al 21 de junio en Condeixa-a-Nova. 7 carreras: 111 Millas, 111km, 60km, 42km, 25km y 13km. Clasificatorio Western States. Puntos ITRA.",
    },
    fr: {
      title: "Trail de Conímbriga Terras de Sicó 2026 - XVIIe Édition",
      description: `# 🏔️ Trail de Conímbriga Terras de Sicó 2026 - XVIIe Édition

**17 Ans à développer les Terras de Sicó, il n'y a pas d'amour comme le premier...**

---

## 📅 Dates de l'Événement

- **19 Juin**: 111 Miles (08h00) et 111 km (22h00)
- **20 Juin**: 60 km (08h30) et 42 km (09h00)
- **21 Juin**: 25 km (09h00), 13 km (09h30) et 13 km marche (09h40)

## 🏃 Courses Disponibles

### Trail Ultra Endurance XL - 111 Miles
- **Distance**: 178 km
- **Dénivelé Positif**: 6 208m
- **Temps Limite**: 40h30
- **Départ**: 19 Juin, 08h00
- **Âge Minimum**: 20 ans

### Trail Ultra Endurance - 111 km
- **Distance**: 111 km
- **Dénivelé Positif**: 4 290m
- **Temps Limite**: 26 heures
- **Départ**: 19 Juin, 22h00
- **Âge Minimum**: 20 ans
- **Qualification**: Western States 2027 (si complété en 24h)

### Trail Ultra Moyen - 60 km
- **Distance**: 60 km
- **Dénivelé Positif**: 2 443m
- **Temps Limite**: 13 heures
- **Départ**: 20 Juin, 08h30 (Santiago da Guarda)
- **Âge Minimum**: 20 ans

### Trail Long - 42 km
- **Distance**: 42 km
- **Dénivelé Positif**: 1 843m
- **Temps Limite**: 8h30
- **Départ**: 20 Juin, 09h00
- **Âge Minimum**: 20 ans

### Trail Sprint - 25 km
- **Distance**: 25 km
- **Dénivelé Positif**: 1 131m
- **Temps Limite**: 5 heures
- **Départ**: 21 Juin, 09h00
- **Âge Minimum**: 18 ans (Juniors)

### Trail Jeune - 13 km
- **Distance**: 13 km
- **Dénivelé Positif**: 423m
- **Temps Limite**: 3 heures
- **Départ**: 21 Juin, 09h30
- **Âge Minimum**: 16 ans (Juvéniles)

### Marche - 13 km
- **Distance**: 13 km
- **Dénivelé Positif**: 365m
- **Temps Limite**: 4 heures
- **Départ**: 21 Juin, 09h40
- **Non Compétitif**

## 🎯 Points Forts

✅ Événement qualificatif pour **Western States 2027**  
✅ Points **ITRA** (Mont Blanc, Lavaredo, X-Alpine)  
✅ Courses certifiées avec **Grade 2 de difficulté**  
✅ 7 courses de trail running pour tous les niveaux  
✅ Parcours à travers Condeixa-a-Nova, Penela, Ansião, Alvaiázere, Soure et Pombal  
✅ Ravitaillements complets et bases de vie  
✅ Massages à l'arrivée  
✅ Assurance sportive incluse  

## 📋 Équipement Obligatoire

**111 Miles et 111 km:**
- Couverture thermique
- Téléphone portable chargé
- Gobelet réutilisable
- Géo localisateur (fourni par l'organisation)
- Sifflet

**60 km, 42 km, 25 km et 13 km:**
- Couverture thermique
- Téléphone portable chargé
- Gobelet réutilisable
- Sifflet

## 🏆 Récompenses

Trophées pour les 3 premiers classés (hommes et femmes) en:
- Classement général
- Catégories d'âge
- Équipes (3 meilleurs classements)

## 🎫 Inscriptions

**Période**: 15 Juin 2025 au 14 Juin 2026

### Prix (selon phase d'inscription)

| Course | Jui-Sep | Oct-Déc | Jan-Jui |
|--------|---------|---------|---------|
| 111 Miles | 95€ | 105€ | 115€ |
| 111 km | 70€ | 75€ | 80€ |
| 60 km | 50€ | 55€ | 60€ |
| 42 km | 38€ | 40€ | 45€ |
| 25 km | 24€ | 26€ | 30€ |
| 13 km | 14€ | 16€ | 18€ |
| Marche | 12€ | 12€ | 13€ |

## 📞 Contact

**Email**: omdceventos@gmail.com  
**Website**: [www.ultrasico.com](https://www.ultrasico.com)

---

*Organisé par Associação Desportiva O Mundo da Corrida*`,
      city: "Condeixa-a-Nova",
      region: "Coimbra",
      country: "Portugal",
      metaTitle:
        "Trail Conímbriga Terras de Sicó 2026 - XVIIe Éd. | Condeixa-a-Nova | 19-21 Juin",
      metaDescription:
        "Trail de Conímbriga Terras de Sicó 2026 - XVIIe Édition du 19 au 21 juin à Condeixa-a-Nova. 7 courses: 111 Miles, 111km, 60km, 42km, 25km et 13km. Qualificatif Western States. Points ITRA.",
    },
    de: {
      title: "Trail de Conímbriga Terras de Sicó 2026 - XVII. Ausgabe",
      description: `# 🏔️ Trail de Conímbriga Terras de Sicó 2026 - XVII. Ausgabe

**17 Jahre Entwicklung der Terras de Sicó, es gibt keine Liebe wie die erste...**

---

## 📅 Veranstaltungstermine

- **19. Juni**: 111 Meilen (08:00) und 111 km (22:00)
- **20. Juni**: 60 km (08:30) und 42 km (09:00)
- **21. Juni**: 25 km (09:00), 13 km (09:30) und 13 km Wanderung (09:40)

## 🏃 Verfügbare Rennen

### Trail Ultra Endurance XL - 111 Meilen
- **Distanz**: 178 km
- **Höhenmeter**: 6.208m
- **Zeitlimit**: 40h30
- **Start**: 19. Juni, 08:00
- **Mindestalter**: 20 Jahre

### Trail Ultra Endurance - 111 km
- **Distanz**: 111 km
- **Höhenmeter**: 4.290m
- **Zeitlimit**: 26 Stunden
- **Start**: 19. Juni, 22:00
- **Mindestalter**: 20 Jahre
- **Qualifikation**: Western States 2027 (wenn in 24h beendet)

### Trail Ultra Mittel - 60 km
- **Distanz**: 60 km
- **Höhenmeter**: 2.443m
- **Zeitlimit**: 13 Stunden
- **Start**: 20. Juni, 08:30 (Santiago da Guarda)
- **Mindestalter**: 20 Jahre

### Trail Lang - 42 km
- **Distanz**: 42 km
- **Höhenmeter**: 1.843m
- **Zeitlimit**: 8h30
- **Start**: 20. Juni, 09:00
- **Mindestalter**: 20 Jahre

### Trail Sprint - 25 km
- **Distanz**: 25 km
- **Höhenmeter**: 1.131m
- **Zeitlimit**: 5 Stunden
- **Start**: 21. Juni, 09:00
- **Mindestalter**: 18 Jahre (Junioren)

### Trail Jugend - 13 km
- **Distanz**: 13 km
- **Höhenmeter**: 423m
- **Zeitlimit**: 3 Stunden
- **Start**: 21. Juni, 09:30
- **Mindestalter**: 16 Jahre (Jugendliche)

### Wanderung - 13 km
- **Distanz**: 13 km
- **Höhenmeter**: 365m
- **Zeitlimit**: 4 Stunden
- **Start**: 21. Juni, 09:40
- **Nicht Wettbewerbsfähig**

## 🎯 Höhepunkte

✅ Qualifikationsveranstaltung für **Western States 2027**  
✅ **ITRA**-Punkte (Mont Blanc, Lavaredo, X-Alpine)  
✅ Zertifizierte Rennen mit **Schwierigkeitsgrad 2**  
✅ 7 Trail-Running-Rennen für alle Niveaus  
✅ Strecken durch Condeixa-a-Nova, Penela, Ansião, Alvaiázere, Soure und Pombal  
✅ Vollständige Verpflegungsstationen und Lebensstützpunkte  
✅ Massagen im Ziel  
✅ Sportversicherung inklusive  

## 📋 Pflichtausrüstung

**111 Meilen und 111 km:**
- Thermodecke
- Aufgeladenes Mobiltelefon
- Wiederverwendbare Tasse
- Geo-Lokalisator (von der Organisation bereitgestellt)
- Pfeife

**60 km, 42 km, 25 km und 13 km:**
- Thermodecke
- Aufgeladenes Mobiltelefon
- Wiederverwendbare Tasse
- Pfeife

## 🏆 Preise

Trophäen für die Top 3 Finisher (männlich und weiblich) in:
- Gesamtwertung
- Alterskategorien
- Teams (3 beste Klassifizierungen)

## 🎫 Anmeldung

**Zeitraum**: 15. Juni 2025 bis 14. Juni 2026

### Preise (nach Anmeldephase)

| Rennen | Jul-Sep | Okt-Dez | Jan-Jun |
|--------|---------|---------|---------|
| 111 Meilen | 95€ | 105€ | 115€ |
| 111 km | 70€ | 75€ | 80€ |
| 60 km | 50€ | 55€ | 60€ |
| 42 km | 38€ | 40€ | 45€ |
| 25 km | 24€ | 26€ | 30€ |
| 13 km | 14€ | 16€ | 18€ |
| Wanderung | 12€ | 12€ | 13€ |

## 📞 Kontakt

**Email**: omdceventos@gmail.com  
**Website**: [www.ultrasico.com](https://www.ultrasico.com)

---

*Organisiert von Associação Desportiva O Mundo da Corrida*`,
      city: "Condeixa-a-Nova",
      region: "Coimbra",
      country: "Portugal",
      metaTitle:
        "Trail Conímbriga Terras de Sicó 2026 - XVII. Ausg. | Condeixa-a-Nova | 19.-21. Juni",
      metaDescription:
        "Trail de Conímbriga Terras de Sicó 2026 - XVII. Ausgabe vom 19. bis 21. Juni in Condeixa-a-Nova. 7 Rennen: 111 Meilen, 111km, 60km, 42km, 25km und 13km. Western States Qualifikation. ITRA-Punkte.",
    },
    it: {
      title: "Trail de Conímbriga Terras de Sicó 2026 - XVII Edizione",
      description: `# 🏔️ Trail de Conímbriga Terras de Sicó 2026 - XVII Edizione

**17 Anni a sviluppare le Terras de Sicó, non c'è amore come il primo...**

---

## 📅 Date dell'Evento

- **19 Giugno**: 111 Miglia (08:00) e 111 km (22:00)
- **20 Giugno**: 60 km (08:30) e 42 km (09:00)
- **21 Giugno**: 25 km (09:00), 13 km (09:30) e 13 km camminata (09:40)

## 🏃 Gare Disponibili

### Trail Ultra Endurance XL - 111 Miglia
- **Distanza**: 178 km
- **Dislivello Positivo**: 6.208m
- **Tempo Limite**: 40h30
- **Partenza**: 19 Giugno, 08:00
- **Età Minima**: 20 anni

### Trail Ultra Endurance - 111 km
- **Distanza**: 111 km
- **Dislivello Positivo**: 4.290m
- **Tempo Limite**: 26 ore
- **Partenza**: 19 Giugno, 22:00
- **Età Minima**: 20 anni
- **Qualificazione**: Western States 2027 (se completato in 24h)

### Trail Ultra Medio - 60 km
- **Distanza**: 60 km
- **Dislivello Positivo**: 2.443m
- **Tempo Limite**: 13 ore
- **Partenza**: 20 Giugno, 08:30 (Santiago da Guarda)
- **Età Minima**: 20 anni

### Trail Lungo - 42 km
- **Distanza**: 42 km
- **Dislivello Positivo**: 1.843m
- **Tempo Limite**: 8h30
- **Partenza**: 20 Giugno, 09:00
- **Età Minima**: 20 anni

### Trail Sprint - 25 km
- **Distanza**: 25 km
- **Dislivello Positivo**: 1.131m
- **Tempo Limite**: 5 ore
- **Partenza**: 21 Giugno, 09:00
- **Età Minima**: 18 anni (Junior)

### Trail Giovani - 13 km
- **Distanza**: 13 km
- **Dislivello Positivo**: 423m
- **Tempo Limite**: 3 ore
- **Partenza**: 21 Giugno, 09:30
- **Età Minima**: 16 anni (Giovanissimi)

### Camminata - 13 km
- **Distanza**: 13 km
- **Dislivello Positivo**: 365m
- **Tempo Limite**: 4 ore
- **Partenza**: 21 Giugno, 09:40
- **Non Competitivo**

## 🎯 Punti Salienti

✅ Evento qualificante per **Western States 2027**  
✅ Punti **ITRA** (Mont Blanc, Lavaredo, X-Alpine)  
✅ Gare certificate con **Grado 2 di difficoltà**  
✅ 7 gare di trail running per tutti i livelli  
✅ Percorsi attraverso Condeixa-a-Nova, Penela, Ansião, Alvaiázere, Soure e Pombal  
✅ Punti di ristoro completi e basi vita  
✅ Massaggi all'arrivo  
✅ Assicurazione sportiva inclusa  

## 📋 Attrezzatura Obbligatoria

**111 Miglia e 111 km:**
- Coperta termica
- Telefono cellulare carico
- Bicchiere riutilizzabile
- Geo localizzatore (fornito dall'organizzazione)
- Fischietto

**60 km, 42 km, 25 km e 13 km:**
- Coperta termica
- Telefono cellulare carico
- Bicchiere riutilizzabile
- Fischietto

## 🏆 Premi

Trofei per i primi 3 classificati (maschili e femminili) in:
- Classifica generale
- Categorie di età
- Squadre (3 migliori classificazioni)

## 🎫 Iscrizioni

**Periodo**: 15 Giugno 2025 al 14 Giugno 2026

### Prezzi (per fase di iscrizione)

| Gara | Lug-Set | Ott-Dic | Gen-Giu |
|------|---------|---------|---------|
| 111 Miglia | 95€ | 105€ | 115€ |
| 111 km | 70€ | 75€ | 80€ |
| 60 km | 50€ | 55€ | 60€ |
| 42 km | 38€ | 40€ | 45€ |
| 25 km | 24€ | 26€ | 30€ |
| 13 km | 14€ | 16€ | 18€ |
| Camminata | 12€ | 12€ | 13€ |

## 📞 Contatti

**Email**: omdceventos@gmail.com  
**Website**: [www.ultrasico.com](https://www.ultrasico.com)

---

*Organizzato da Associação Desportiva O Mundo da Corrida*`,
      city: "Condeixa-a-Nova",
      region: "Coimbra",
      country: "Portugal",
      metaTitle:
        "Trail Conímbriga Terras de Sicó 2026 - XVII Ed. | Condeixa-a-Nova | 19-21 Giugno",
      metaDescription:
        "Trail de Conímbriga Terras de Sicó 2026 - XVII Edizione dal 19 al 21 giugno a Condeixa-a-Nova. 7 gare: 111 Miglia, 111km, 60km, 42km, 25km e 13km. Qualificazione Western States. Punti ITRA.",
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
      name: "111 Milhas Terras de Sicó",
      distanceKm: 178,
      elevationGainM: 6208,
      elevationLossM: 6193,
      startDate: new Date("2026-06-19T08:00:00Z"),
      startTime: "08:00",
      cutoffTimeHours: 40.5, // 40h30
      price: 115,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: 2,
      itraPoints: 6,
      description:
        "Superfície: Trail (80%), Estrada (20%) · Dificuldade: Grau 2 - Ultra Endurance XL · Equipamento obrigatório: Manta térmica, Telemóvel carregado, Copo reutilizável, Geo localizador, Apito · Qualificação Western States 2027",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-07-01T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 95,
          currency: Currency.EUR,
          note: "Fase Inicial (Julho a Setembro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 105,
          currency: Currency.EUR,
          note: "Fase Intermédia (Outubro a Dezembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-14T23:59:59Z"),
          price: 115,
          currency: Currency.EUR,
          note: "Fase Final (Janeiro a Junho)",
        },
      ],
    },
    {
      name: "111 km Terras de Sicó",
      distanceKm: 111,
      elevationGainM: 4290,
      elevationLossM: 4290,
      startDate: new Date("2026-06-19T22:00:00Z"),
      startTime: "22:00",
      cutoffTimeHours: 26, // 26h
      price: 80,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: 2,
      itraPoints: 5,
      description:
        "Superfície: Trail (75%), Estrada (25%) · Dificuldade: Grau 2 - Ultra Endurance · Equipamento obrigatório: Manta térmica, Telemóvel carregado, Copo reutilizável, Geo localizador, Apito · Qualificação Western States 2027 (se concluído em 24h)",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-07-01T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 70,
          currency: Currency.EUR,
          note: "Fase Inicial (Julho a Setembro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 75,
          currency: Currency.EUR,
          note: "Fase Intermédia (Outubro a Dezembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-14T23:59:59Z"),
          price: 80,
          currency: Currency.EUR,
          note: "Fase Final (Janeiro a Junho)",
        },
      ],
    },
    {
      name: "60 km",
      distanceKm: 60,
      elevationGainM: 2443,
      elevationLossM: 2604,
      startDate: new Date("2026-06-20T08:30:00Z"),
      startTime: "08:30",
      cutoffTimeHours: 13, // 13h
      price: 60,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: 2,
      itraPoints: 3,
      description:
        "Superfície: Trail (70%), Estrada (30%) · Dificuldade: Grau 2 - Ultra Médio · Equipamento obrigatório: Manta térmica, Telemóvel carregado, Copo reutilizável, Apito · Campeonato Distrital de Coimbra · ADAC",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-07-01T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 50,
          currency: Currency.EUR,
          note: "Fase Inicial (Julho a Setembro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 55,
          currency: Currency.EUR,
          note: "Fase Intermédia (Outubro a Dezembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-14T23:59:59Z"),
          price: 60,
          currency: Currency.EUR,
          note: "Fase Final (Janeiro a Junho)",
        },
      ],
    },
    {
      name: "42 km",
      distanceKm: 42,
      elevationGainM: 1843,
      elevationLossM: 1843,
      startDate: new Date("2026-06-20T09:00:00Z"),
      startTime: "09:00",
      cutoffTimeHours: 8.5, // 8h30
      price: 45,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: 2,
      itraPoints: 2,
      description:
        "Superfície: Trail (65%), Estrada (35%) · Dificuldade: Grau 2 - Trail Longo · Equipamento obrigatório: Manta térmica, Telemóvel carregado, Copo reutilizável, Apito",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-07-01T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 38,
          currency: Currency.EUR,
          note: "Fase Inicial (Julho a Setembro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 40,
          currency: Currency.EUR,
          note: "Fase Intermédia (Outubro a Dezembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-14T23:59:59Z"),
          price: 45,
          currency: Currency.EUR,
          note: "Fase Final (Janeiro a Junho)",
        },
      ],
    },
    {
      name: "25 km",
      distanceKm: 25,
      elevationGainM: 1131,
      elevationLossM: 1131,
      startDate: new Date("2026-06-21T09:00:00Z"),
      startTime: "09:00",
      cutoffTimeHours: 5, // 5h
      price: 30,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: 2,
      itraPoints: 1,
      description:
        "Superfície: Trail (60%), Estrada (40%) · Dificuldade: Grau 2 - Trail Sprint · Equipamento obrigatório: Manta térmica, Telemóvel carregado, Copo reutilizável, Apito",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-07-01T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 24,
          currency: Currency.EUR,
          note: "Fase Inicial (Julho a Setembro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 26,
          currency: Currency.EUR,
          note: "Fase Intermédia (Outubro a Dezembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-14T23:59:59Z"),
          price: 30,
          currency: Currency.EUR,
          note: "Fase Final (Janeiro a Junho)",
        },
      ],
    },
    {
      name: "13 km",
      distanceKm: 13,
      elevationGainM: 423,
      elevationLossM: 423,
      startDate: new Date("2026-06-21T09:30:00Z"),
      startTime: "09:30",
      cutoffTimeHours: 3, // 3h
      price: 18,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: 2,
      itraPoints: 0,
      description:
        "Superfície: Trail (55%), Estrada (45%) · Dificuldade: Grau 2 - Trail Jovem · Equipamento obrigatório: Manta térmica, Telemóvel carregado, Copo reutilizável, Apito",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2025-07-01T00:00:00Z"),
          endDate: new Date("2025-09-30T23:59:59Z"),
          price: 14,
          currency: Currency.EUR,
          note: "Fase Inicial (Julho a Setembro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-10-01T00:00:00Z"),
          endDate: new Date("2025-12-31T23:59:59Z"),
          price: 16,
          currency: Currency.EUR,
          note: "Fase Intermédia (Outubro a Dezembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-06-14T23:59:59Z"),
          price: 18,
          currency: Currency.EUR,
          note: "Fase Final (Janeiro a Junho)",
        },
      ],
    },
    {
      name: "13 km (Caminhada)",
      distanceKm: 13,
      elevationGainM: 365,
      elevationLossM: 365,
      startDate: new Date("2026-06-21T09:40:00Z"),
      startTime: "09:40",
      cutoffTimeHours: 4, // 4h
      price: 13,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: 2,
      itraPoints: 0,
      description:
        "Superfície: Trail (50%), Estrada (50%) · Dificuldade: Grau 2 - Não Competitivo · Equipamento obrigatório: Copo reutilizável",
      pricingPhases: [
        {
          name: "Preço Único",
          startDate: new Date("2025-07-01T00:00:00Z"),
          endDate: new Date("2026-06-14T23:59:59Z"),
          price: 13,
          currency: Currency.EUR,
          note: "Preço fixo durante todo o período de inscrições",
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
          eventId: event.id, // ✅ linked to eventId (event-level display)
          variantId: variant.id, // ✅ linked to variantId (variant-level pricing)
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
- Event: Trail de Conímbriga Terras de Sicó 2026
- Variants: 7 race distances
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 20 total
- Date: June 19-21, 2026
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
