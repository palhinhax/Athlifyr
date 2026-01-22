import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * 🏃 BANK OF AMERICA CHICAGO MARATHON 2026 SEED
 *
 * 📅 Event Date: October 11, 2026
 * 📍 Location: Chicago, Illinois, USA
 * 🏆 Category: Abbott World Marathon Majors
 * 🌍 One of the six World Marathon Majors - fastest marathon course
 *
 * 🎯 Key Features:
 * - 48th Edition
 * - Flat and fast course through 29 Chicago neighborhoods
 * - Start and finish at Grant Park
 * - World record potential - fastest major marathon course
 * - Lottery entry system + guaranteed entry options
 * - World Athletics certified course
 *
 * 🌐 Official: https://www.chicagomarathon.com
 */

async function seedChicagoMarathon() {
  console.log("🏃 Seeding Bank of America Chicago Marathon 2026...");

  // ============================================================================
  // 🌍 TRANSLATIONS (ALL 6 LANGUAGES - MANDATORY)
  // ============================================================================

  const translations = {
    pt: {
      title: "Bank of America Chicago Marathon",
      description: `# 🏃 Bank of America Chicago Marathon 2026 – 48ª Edição

A **Bank of America Chicago Marathon** é uma das **seis maratonas Abbott World Marathon Majors** e é amplamente reconhecida como o **percurso de maratona mais rápido do mundo**. A edição de 2026 marca a **48ª edição** deste evento icónico.

## 🏃 O Percurso Mais Rápido do Mundo

O percurso atravessa **29 bairros de Chicago** através de um traçado urbano **plano e extremamente rápido**:

- 🚀 **Largada**: Grant Park – Chicago Loop
- 🏘️ **Bairros**: Lincoln Park, Old Town, Pilsen, Chinatown, Bronzeville
- 🏁 **Meta**: Grant Park (mesmo local da partida)
- 📏 **Altimetria**: Mínima (≈ 140m D+)
- 🏆 **Recordes**: Vários recordes mundiais e nacionais estabelecidos neste percurso

## 📋 Como Entrar

### 🎲 Lottery (Sorteio)
- **Período de candidatura**: 21 outubro – 18 novembro 2025
- **Resultados**: 11 dezembro 2025
- **Taxas**:
  - Residentes USA: $250 USD
  - Internacionais: $260 USD
- **Idades**: Mínimo 16 anos (necessária autorização parental para 16-17 anos)

### ✅ Entrada Garantida

#### 🏃 Tempo Qualificativo
- Tempos oficiais em provas certificadas
- Standards por idade e género
- Verificação obrigatória

#### 🏅 Legacy Finisher
- Para corredores que completaram múltiplas edições anteriores
- Sistema de pontos baseado em histórico

#### 🎽 Bank of America Chicago Distance Series
- Completar provas da série oficial durante o ano

#### 🎗️ Charity Entry (Entrada Caridade)
- Entrada garantida com angariação de fundos
- Valor típico: **$1,750 – $2,000 USD**

#### 🌍 Tour Operators
- Pacotes internacionais com entrada garantida
- Inclui hotel + serviços (~$1,000–3,000 USD)

## 🏆 Estatísticas

- **45.000 – 50.000 finishers** anuais
- **+120 países** representados
- **Elite mundial** + corredores de todos os níveis
- **Tempo limite**: 6 horas 30 minutos
- **Clima típico**: 10–15°C (condições ideais para performance)

## 🎯 Detalhes Técnicos

- **Distância**: 42,195 km (26.2 mi)
- **Desnível acumulado**: ~140m (extremamente plano)
- **Superfície**: Asfalto urbano
- **Abastecimentos**: Frequentes (água + isotónico)
- **Cronometragem**: Oficial com chip timing
- **Pacers oficiais**: Disponíveis para vários tempos-alvo

## 🌟 Porque é Especial

- **Abbott World Marathon Majors** – uma das seis maratonas mais prestigiadas do mundo
- **Percurso mais rápido** – ideal para recordes pessoais (PB) e qualificação Boston (BQ)
- **Apoio do público espetacular** – milhões de espetadores ao longo do percurso
- **Expo gigante** – Abbott Health & Fitness Expo de grandes dimensões
- **Organização de excelência** – padrão mundial de qualidade

## 📅 Datas Importantes

- **21 out – 18 nov 2025**: Período de candidatura lottery
- **11 dezembro 2025**: Resultados do sorteio
- **8–10 outubro 2026**: Abbott Health & Fitness Expo + recolha de dorsais
- **10 outubro 2026**: Abbott Chicago 5K
- **11 outubro 2026**: Dia da prova

## 🎪 Eventos do Fim de Semana

### Abbott Health & Fitness Expo
- **Local**: McCormick Place
- **Datas**: 8–10 outubro 2026
- Recolha obrigatória de dorsais
- Identificação com foto obrigatória

### Abbott Chicago 5K
- **Data**: 10 outubro 2026 (sábado)
- **Horário**: 7:30 AM
- Percurso pelo centro de Chicago

### 27th Mile Post-Race Party
- **Local**: Butler Field, Grant Park
- **Horário**: 9:30 AM – 4:00 PM
- Música ao vivo, comida, bebidas
- Cerveja gratuita para +21 anos (com ID)

## 🏃 Serviços na Prova

- ✅ Abastecimentos frequentes (água + isotónico)
- ✅ Pacers oficiais para vários tempos
- ✅ Cronometragem oficial (chip timing)
- ✅ Guarda-volumes (gear check)
- ✅ Transporte público reforçado
- ✅ Cobertura TV ao vivo (NBC 5 Chicago, Telemundo)
- ✅ Cobertura rádio (670 The Score)
- ✅ Espaços de lactação no dia da prova
- ✅ Lost & Found
- ✅ Runner Reunite (torres alfabéticas para encontro)

## 📺 Transmissão

- **TV**: NBC 5 Chicago, Telemundo Chicago, TeleXitos (7 AM – 11 AM CT)
- **Streaming**: nbcchicago.com / telemundochicago.com (7 AM – 3 PM CT)
- **Rádio**: 670 The Score Sports Radio (7 AM – 11 AM CT)

## 🔗 Informação Oficial

Visita [www.chicagomarathon.com](https://www.chicagomarathon.com) para informações completas sobre inscrições, treino e dia da prova.`,
      city: "Chicago, IL",
      metaTitle:
        "Bank of America Chicago Marathon 2026 - 48ª Edição | Chicago | 11 Outubro",
      metaDescription:
        "Bank of America Chicago Marathon 2026 - 48ª edição a 11 de outubro em Chicago. World Marathon Majors. Percurso mais rápido do mundo. 42,195km. Lottery: 21 out-18 nov. 45.000+ corredores.",
    },
    en: {
      title: "Bank of America Chicago Marathon",
      description: `# 🏃 Bank of America Chicago Marathon 2026 – 48th Edition

The **Bank of America Chicago Marathon** is one of the **six Abbott World Marathon Majors** and is widely recognized as the **world's fastest marathon course**. The 2026 edition marks the **48th running** of this iconic event.

## 🏃 The World's Fastest Course

The course winds through **29 Chicago neighborhoods** on an **extremely flat and fast** urban route:

- 🚀 **Start**: Grant Park – Chicago Loop
- 🏘️ **Neighborhoods**: Lincoln Park, Old Town, Pilsen, Chinatown, Bronzeville
- 🏁 **Finish**: Grant Park (same location as start)
- 📏 **Elevation**: Minimal (≈ 140m gain)
- 🏆 **Records**: Multiple world and national records set on this course

## 📋 How to Enter

### 🎲 Lottery (Non-Guaranteed Entry Drawing)
- **Application period**: October 21 – November 18, 2025
- **Results**: December 11, 2025
- **Fees**:
  - U.S. residents: $250 USD
  - International: $260 USD
- **Ages**: Minimum 16 years (parental permission required for 16-17)

### ✅ Guaranteed Entry

#### 🏃 Time Qualifier
- Official times in certified races
- Standards by age and gender
- Verification required

#### 🏅 Legacy Finisher
- For runners who completed multiple previous editions
- Points system based on history

#### 🎽 Bank of America Chicago Distance Series
- Complete races in the official series during the year

#### 🎗️ Charity Entry
- Guaranteed entry with fundraising
- Typical amount: **$1,750 – $2,000 USD**

#### 🌍 Tour Operators
- International packages with guaranteed entry
- Includes hotel + services (~$1,000–3,000 USD)

## 🏆 Statistics

- **45,000 – 50,000 finishers** annually
- **120+ countries** represented
- **World-class elite** + runners of all levels
- **Time limit**: 6 hours 30 minutes
- **Typical weather**: 10–15°C (ideal conditions for performance)

## 🎯 Technical Details

- **Distance**: 42.195 km (26.2 mi)
- **Elevation gain**: ~140m (extremely flat)
- **Surface**: Urban asphalt
- **Aid stations**: Frequent (water + sports drink)
- **Timing**: Official chip timing
- **Official pacers**: Available for various time goals

## 🌟 Why It's Special

- **Abbott World Marathon Majors** – one of the six most prestigious marathons worldwide
- **Fastest course** – ideal for personal records (PR) and Boston qualification (BQ)
- **Spectacular crowd support** – millions of spectators along the course
- **Massive expo** – Abbott Health & Fitness Expo of grand scale
- **World-class organization** – gold standard quality

## 📅 Important Dates

- **Oct 21 – Nov 18, 2025**: Lottery application period
- **December 11, 2025**: Lottery results
- **October 8–10, 2026**: Abbott Health & Fitness Expo + packet pick-up
- **October 10, 2026**: Abbott Chicago 5K
- **October 11, 2026**: Race day

## 🎪 Race Weekend Events

### Abbott Health & Fitness Expo
- **Location**: McCormick Place
- **Dates**: October 8–10, 2026
- Mandatory packet pick-up
- Photo ID required

### Abbott Chicago 5K
- **Date**: October 10, 2026 (Saturday)
- **Time**: 7:30 AM
- Downtown Chicago course

### 27th Mile Post-Race Party
- **Location**: Butler Field, Grant Park
- **Hours**: 9:30 AM – 4:00 PM
- Live music, food, beverages
- Free beer for 21+ (ID required)

## 🏃 Race Day Services

- ✅ Frequent aid stations (water + sports drink)
- ✅ Official pacers for various times
- ✅ Official timing (chip timing)
- ✅ Gear check
- ✅ Enhanced public transportation
- ✅ Live TV coverage (NBC 5 Chicago, Telemundo)
- ✅ Radio coverage (670 The Score)
- ✅ Race day lactation spaces
- ✅ Lost & Found
- ✅ Runner Reunite (alphabetical towers)

## 📺 Broadcast

- **TV**: NBC 5 Chicago, Telemundo Chicago, TeleXitos (7 AM – 11 AM CT)
- **Streaming**: nbcchicago.com / telemundochicago.com (7 AM – 3 PM CT)
- **Radio**: 670 The Score Sports Radio (7 AM – 11 AM CT)

## 🔗 Official Information

Visit [www.chicagomarathon.com](https://www.chicagomarathon.com) for complete information on registration, training, and race day.`,
      city: "Chicago, IL",
      metaTitle:
        "Bank of America Chicago Marathon 2026 - 48th Edition | Chicago | October 11",
      metaDescription:
        "Bank of America Chicago Marathon 2026 - 48th edition on October 11 in Chicago. World Marathon Majors. World's fastest course. 42.195km. Lottery: Oct 21-Nov 18. 45,000+ runners.",
    },
    es: {
      title: "Bank of America Chicago Marathon",
      description: `# 🏃 Bank of America Chicago Marathon 2026 – 48ª Edición

La **Bank of America Chicago Marathon** es una de las **seis Abbott World Marathon Majors** y está ampliamente reconocida como el **recorrido de maratón más rápido del mundo**. La edición 2026 marca la **48ª edición** de este evento icónico.

## 🏃 El Recorrido Más Rápido del Mundo

El recorrido serpentea por **29 barrios de Chicago** a través de una ruta urbana **extremadamente plana y rápida**:

- 🚀 **Salida**: Grant Park – Chicago Loop
- 🏘️ **Barrios**: Lincoln Park, Old Town, Pilsen, Chinatown, Bronzeville
- 🏁 **Meta**: Grant Park (mismo lugar de salida)
- 📏 **Altimetría**: Mínima (≈ 140m D+)
- 🏆 **Récords**: Múltiples récords mundiales y nacionales establecidos en este recorrido

## 📋 Cómo Inscribirse

### 🎲 Sorteo (Lottery)
- **Periodo de solicitud**: 21 octubre – 18 noviembre 2025
- **Resultados**: 11 diciembre 2025
- **Tarifas**:
  - Residentes USA: $250 USD
  - Internacionales: $260 USD
- **Edades**: Mínimo 16 años (autorización parental necesaria para 16-17 años)

### ✅ Entrada Garantizada

#### 🏃 Tiempo Clasificatorio
- Tiempos oficiales en carreras certificadas
- Estándares por edad y género
- Verificación obligatoria

#### 🏅 Legacy Finisher
- Para corredores que completaron múltiples ediciones anteriores
- Sistema de puntos basado en historial

#### 🎽 Bank of America Chicago Distance Series
- Completar carreras de la serie oficial durante el año

#### 🎗️ Entrada Benéfica (Charity)
- Entrada garantizada con recaudación de fondos
- Cantidad típica: **$1,750 – $2,000 USD**

#### 🌍 Tour Operators
- Paquetes internacionales con entrada garantizada
- Incluye hotel + servicios (~$1,000–3,000 USD)

## 🏆 Estadísticas

- **45.000 – 50.000 finishers** anuales
- **+120 países** representados
- **Élite mundial** + corredores de todos los niveles
- **Límite de tiempo**: 6 horas 30 minutos
- **Clima típico**: 10–15°C (condiciones ideales para rendimiento)

## 🎯 Detalles Técnicos

- **Distancia**: 42,195 km (26.2 mi)
- **Desnivel acumulado**: ~140m (extremadamente plano)
- **Superficie**: Asfalto urbano
- **Avituallamientos**: Frecuentes (agua + bebida isotónica)
- **Cronometraje**: Oficial con chip timing
- **Liebres oficiales**: Disponibles para varios tiempos objetivo

## 🌟 Por Qué es Especial

- **Abbott World Marathon Majors** – uno de los seis maratones más prestigiosos del mundo
- **Recorrido más rápido** – ideal para récords personales (PB) y clasificación Boston (BQ)
- **Apoyo del público espectacular** – millones de espectadores a lo largo del recorrido
- **Expo gigante** – Abbott Health & Fitness Expo de gran escala
- **Organización de excelencia** – estándar mundial de calidad

## 📅 Fechas Importantes

- **21 oct – 18 nov 2025**: Periodo de solicitud sorteo
- **11 diciembre 2025**: Resultados del sorteo
- **8–10 octubre 2026**: Abbott Health & Fitness Expo + recogida de dorsales
- **10 octubre 2026**: Abbott Chicago 5K
- **11 octubre 2026**: Día de la carrera

## 🎪 Eventos del Fin de Semana

### Abbott Health & Fitness Expo
- **Ubicación**: McCormick Place
- **Fechas**: 8–10 octubre 2026
- Recogida obligatoria de dorsales
- Identificación con foto obligatoria

### Abbott Chicago 5K
- **Fecha**: 10 octubre 2026 (sábado)
- **Hora**: 7:30 AM
- Recorrido por el centro de Chicago

### 27th Mile Post-Race Party
- **Ubicación**: Butler Field, Grant Park
- **Horario**: 9:30 AM – 4:00 PM
- Música en vivo, comida, bebidas
- Cerveza gratis para +21 años (con ID)

## 🏃 Servicios el Día de la Carrera

- ✅ Avituallamientos frecuentes (agua + bebida isotónica)
- ✅ Liebres oficiales para varios tiempos
- ✅ Cronometraje oficial (chip timing)
- ✅ Guardabultos (gear check)
- ✅ Transporte público reforzado
- ✅ Cobertura TV en vivo (NBC 5 Chicago, Telemundo)
- ✅ Cobertura radio (670 The Score)
- ✅ Espacios de lactancia el día de la carrera
- ✅ Objetos perdidos
- ✅ Runner Reunite (torres alfabéticas para encuentro)

## 📺 Transmisión

- **TV**: NBC 5 Chicago, Telemundo Chicago, TeleXitos (7 AM – 11 AM CT)
- **Streaming**: nbcchicago.com / telemundochicago.com (7 AM – 3 PM CT)
- **Radio**: 670 The Score Sports Radio (7 AM – 11 AM CT)

## 🔗 Información Oficial

Visita [www.chicagomarathon.com](https://www.chicagomarathon.com) para información completa sobre inscripciones, entrenamiento y día de carrera.`,
      city: "Chicago, IL",
      metaTitle:
        "Bank of America Chicago Marathon 2026 - 48ª Edición | Chicago | 11 Octubre",
      metaDescription:
        "Bank of America Chicago Marathon 2026 - 48ª edición el 11 de octubre en Chicago. World Marathon Majors. Recorrido más rápido del mundo. 42,195km. Sorteo: 21 oct-18 nov. 45.000+ corredores.",
    },
    fr: {
      title: "Bank of America Chicago Marathon",
      description: `# 🏃 Bank of America Chicago Marathon 2026 – 48e Édition

Le **Bank of America Chicago Marathon** est l'un des **six Abbott World Marathon Majors** et est largement reconnu comme le **parcours de marathon le plus rapide au monde**. L'édition 2026 marque la **48e édition** de cet événement emblématique.

## 🏃 Le Parcours le Plus Rapide au Monde

Le parcours serpente à travers **29 quartiers de Chicago** sur un tracé urbain **extrêmement plat et rapide** :

- 🚀 **Départ** : Grant Park – Chicago Loop
- 🏘️ **Quartiers** : Lincoln Park, Old Town, Pilsen, Chinatown, Bronzeville
- 🏁 **Arrivée** : Grant Park (même endroit que le départ)
- 📏 **Altimétrie** : Minimale (≈ 140m D+)
- 🏆 **Records** : Plusieurs records mondiaux et nationaux établis sur ce parcours

## 📋 Comment S'inscrire

### 🎲 Tirage au Sort (Lottery)
- **Période de candidature** : 21 octobre – 18 novembre 2025
- **Résultats** : 11 décembre 2025
- **Tarifs** :
  - Résidents USA : 250 $ USD
  - Internationaux : 260 $ USD
- **Âges** : Minimum 16 ans (autorisation parentale nécessaire pour 16-17 ans)

### ✅ Entrée Garantie

#### 🏃 Temps Qualificatif
- Temps officiels dans des courses certifiées
- Standards par âge et genre
- Vérification obligatoire

#### 🏅 Legacy Finisher
- Pour les coureurs ayant terminé plusieurs éditions précédentes
- Système de points basé sur l'historique

#### 🎽 Bank of America Chicago Distance Series
- Compléter les courses de la série officielle durant l'année

#### 🎗️ Entrée Caritative (Charity)
- Entrée garantie avec collecte de fonds
- Montant typique : **1 750 – 2 000 $ USD**

#### 🌍 Tour Operators
- Forfaits internationaux avec entrée garantie
- Inclut hôtel + services (~1 000–3 000 $ USD)

## 🏆 Statistiques

- **45 000 – 50 000 finishers** annuels
- **+120 pays** représentés
- **Élite mondiale** + coureurs de tous niveaux
- **Limite de temps** : 6 heures 30 minutes
- **Climat typique** : 10–15°C (conditions idéales pour la performance)

## 🎯 Détails Techniques

- **Distance** : 42,195 km (26,2 mi)
- **Dénivelé positif** : ~140m (extrêmement plat)
- **Surface** : Asphalte urbain
- **Ravitaillements** : Fréquents (eau + boisson isotonique)
- **Chronométrage** : Officiel avec puce électronique
- **Lièvres officiels** : Disponibles pour différents temps objectifs

## 🌟 Pourquoi C'est Spécial

- **Abbott World Marathon Majors** – l'un des six marathons les plus prestigieux au monde
- **Parcours le plus rapide** – idéal pour les records personnels (RP) et la qualification Boston (BQ)
- **Soutien du public spectaculaire** – des millions de spectateurs le long du parcours
- **Expo géante** – Abbott Health & Fitness Expo de grande envergure
- **Organisation d'excellence** – standard mondial de qualité

## 📅 Dates Importantes

- **21 oct – 18 nov 2025** : Période de candidature tirage au sort
- **11 décembre 2025** : Résultats du tirage au sort
- **8–10 octobre 2026** : Abbott Health & Fitness Expo + retrait des dossards
- **10 octobre 2026** : Abbott Chicago 5K
- **11 octobre 2026** : Jour de course

## 🎪 Événements du Week-end

### Abbott Health & Fitness Expo
- **Lieu** : McCormick Place
- **Dates** : 8–10 octobre 2026
- Retrait obligatoire des dossards
- Pièce d'identité avec photo obligatoire

### Abbott Chicago 5K
- **Date** : 10 octobre 2026 (samedi)
- **Heure** : 7h30
- Parcours dans le centre de Chicago

### 27th Mile Post-Race Party
- **Lieu** : Butler Field, Grant Park
- **Horaires** : 9h30 – 16h00
- Musique live, nourriture, boissons
- Bière gratuite pour +21 ans (avec pièce d'identité)

## 🏃 Services le Jour de Course

- ✅ Ravitaillements fréquents (eau + boisson isotonique)
- ✅ Lièvres officiels pour différents temps
- ✅ Chronométrage officiel (puce électronique)
- ✅ Consigne à bagages (gear check)
- ✅ Transports publics renforcés
- ✅ Couverture TV en direct (NBC 5 Chicago, Telemundo)
- ✅ Couverture radio (670 The Score)
- ✅ Espaces d'allaitement le jour de course
- ✅ Objets trouvés
- ✅ Runner Reunite (tours alphabétiques pour se retrouver)

## 📺 Diffusion

- **TV** : NBC 5 Chicago, Telemundo Chicago, TeleXitos (7h – 11h CT)
- **Streaming** : nbcchicago.com / telemundochicago.com (7h – 15h CT)
- **Radio** : 670 The Score Sports Radio (7h – 11h CT)

## 🔗 Informations Officielles

Visitez [www.chicagomarathon.com](https://www.chicagomarathon.com) pour des informations complètes sur l'inscription, l'entraînement et le jour de course.`,
      city: "Chicago, IL",
      metaTitle:
        "Bank of America Chicago Marathon 2026 - 48e Édition | Chicago | 11 Octobre",
      metaDescription:
        "Bank of America Chicago Marathon 2026 - 48e édition le 11 octobre à Chicago. World Marathon Majors. Parcours le plus rapide au monde. 42,195km. Tirage : 21 oct-18 nov. 45 000+ coureurs.",
    },
    de: {
      title: "Bank of America Chicago Marathon",
      description: `# 🏃 Bank of America Chicago Marathon 2026 – 48. Ausgabe

Der **Bank of America Chicago Marathon** ist einer der **sechs Abbott World Marathon Majors** und gilt weithin als die **schnellste Marathonstrecke der Welt**. Die Ausgabe 2026 markiert die **48. Auflage** dieses ikonischen Events.

## 🏃 Die Schnellste Strecke der Welt

Die Strecke schlängelt sich durch **29 Stadtteile von Chicago** auf einer **extrem flachen und schnellen** urbanen Route:

- 🚀 **Start**: Grant Park – Chicago Loop
- 🏘️ **Stadtteile**: Lincoln Park, Old Town, Pilsen, Chinatown, Bronzeville
- 🏁 **Ziel**: Grant Park (gleicher Ort wie Start)
- 📏 **Höhenprofil**: Minimal (≈ 140m Anstieg)
- 🏆 **Rekorde**: Mehrere Welt- und Nationalrekorde auf dieser Strecke aufgestellt

## 📋 Wie man sich anmeldet

### 🎲 Verlosung (Lottery)
- **Bewerbungszeitraum**: 21. Oktober – 18. November 2025
- **Ergebnisse**: 11. Dezember 2025
- **Gebühren**:
  - US-Einwohner: 250 $ USD
  - International: 260 $ USD
- **Alter**: Mindestens 16 Jahre (elterliche Genehmigung für 16-17 Jahre erforderlich)

### ✅ Garantierter Startplatz

#### 🏃 Qualifikationszeit
- Offizielle Zeiten in zertifizierten Rennen
- Standards nach Alter und Geschlecht
- Überprüfung erforderlich

#### 🏅 Legacy Finisher
- Für Läufer, die mehrere frühere Ausgaben absolviert haben
- Punktesystem basierend auf Historie

#### 🎽 Bank of America Chicago Distance Series
- Rennen der offiziellen Serie während des Jahres absolvieren

#### 🎗️ Charity-Eintritt (Wohltätigkeit)
- Garantierter Eintritt mit Spendenziel
- Typischer Betrag: **1.750 – 2.000 $ USD**

#### 🌍 Tour Operators
- Internationale Pakete mit garantiertem Startplatz
- Inkl. Hotel + Services (~1.000–3.000 $ USD)

## 🏆 Statistiken

- **45.000 – 50.000 Finisher** jährlich
- **+120 Länder** vertreten
- **Weltklasse-Elite** + Läufer aller Leistungsstufen
- **Zeitlimit**: 6 Stunden 30 Minuten
- **Typisches Wetter**: 10–15°C (ideale Bedingungen für Leistung)

## 🎯 Technische Details

- **Distanz**: 42,195 km (26,2 mi)
- **Höhenunterschied**: ~140m (extrem flach)
- **Untergrund**: Städtischer Asphalt
- **Verpflegungsstationen**: Häufig (Wasser + Sportgetränk)
- **Zeitnahme**: Offiziell mit Chip-Timing
- **Offizielle Schrittmacher**: Verfügbar für verschiedene Zeitvorgaben

## 🌟 Warum es Besonders ist

- **Abbott World Marathon Majors** – einer der sechs prestigeträchtigsten Marathons weltweit
- **Schnellste Strecke** – ideal für persönliche Bestzeiten (PB) und Boston-Qualifikation (BQ)
- **Spektakuläre Zuschauerunterstützung** – Millionen von Zuschauern entlang der Strecke
- **Riesige Expo** – Abbott Health & Fitness Expo im großen Maßstab
- **Exzellente Organisation** – weltweiter Qualitätsstandard

## 📅 Wichtige Termine

- **21. Okt – 18. Nov 2025**: Verlosungsbewerbungszeitraum
- **11. Dezember 2025**: Verlosungsergebnisse
- **8.–10. Oktober 2026**: Abbott Health & Fitness Expo + Startnummernausgabe
- **10. Oktober 2026**: Abbott Chicago 5K
- **11. Oktober 2026**: Renntag

## 🎪 Wochenend-Events

### Abbott Health & Fitness Expo
- **Ort**: McCormick Place
- **Termine**: 8.–10. Oktober 2026
- Pflichtabholung der Startnummern
- Lichtbildausweis erforderlich

### Abbott Chicago 5K
- **Datum**: 10. Oktober 2026 (Samstag)
- **Zeit**: 7:30 Uhr
- Strecke durch die Innenstadt von Chicago

### 27th Mile Post-Race Party
- **Ort**: Butler Field, Grant Park
- **Zeiten**: 9:30 – 16:00 Uhr
- Live-Musik, Essen, Getränke
- Kostenloses Bier für 21+ (Ausweis erforderlich)

## 🏃 Services am Renntag

- ✅ Häufige Verpflegungsstationen (Wasser + Sportgetränk)
- ✅ Offizielle Schrittmacher für verschiedene Zeiten
- ✅ Offizielle Zeitnahme (Chip-Timing)
- ✅ Gepäckaufbewahrung (gear check)
- ✅ Verstärkter öffentlicher Nahverkehr
- ✅ Live-TV-Übertragung (NBC 5 Chicago, Telemundo)
- ✅ Radio-Übertragung (670 The Score)
- ✅ Stillräume am Renntag
- ✅ Fundbüro
- ✅ Runner Reunite (alphabetische Türme zum Treffen)

## 📺 Übertragung

- **TV**: NBC 5 Chicago, Telemundo Chicago, TeleXitos (7–11 Uhr CT)
- **Streaming**: nbcchicago.com / telemundochicago.com (7–15 Uhr CT)
- **Radio**: 670 The Score Sports Radio (7–11 Uhr CT)

## 🔗 Offizielle Informationen

Besuchen Sie [www.chicagomarathon.com](https://www.chicagomarathon.com) für vollständige Informationen zu Anmeldung, Training und Renntag.`,
      city: "Chicago, IL",
      metaTitle:
        "Bank of America Chicago Marathon 2026 - 48. Ausgabe | Chicago | 11. Oktober",
      metaDescription:
        "Bank of America Chicago Marathon 2026 - 48. Ausgabe am 11. Oktober in Chicago. World Marathon Majors. Schnellste Strecke der Welt. 42,195km. Verlosung: 21. Okt-18. Nov. 45.000+ Läufer.",
    },
    it: {
      title: "Bank of America Chicago Marathon",
      description: `# 🏃 Bank of America Chicago Marathon 2026 – 48ª Edizione

La **Bank of America Chicago Marathon** è una delle **sei Abbott World Marathon Majors** ed è ampiamente riconosciuta come il **percorso di maratona più veloce al mondo**. L'edizione 2026 segna la **48ª edizione** di questo evento iconico.

## 🏃 Il Percorso Più Veloce al Mondo

Il percorso si snoda attraverso **29 quartieri di Chicago** su un tracciato urbano **estremamente piatto e veloce**:

- 🚀 **Partenza**: Grant Park – Chicago Loop
- 🏘️ **Quartieri**: Lincoln Park, Old Town, Pilsen, Chinatown, Bronzeville
- 🏁 **Arrivo**: Grant Park (stesso luogo della partenza)
- 📏 **Altimetria**: Minima (≈ 140m D+)
- 🏆 **Record**: Numerosi record mondiali e nazionali stabiliti su questo percorso

## 📋 Come Iscriversi

### 🎲 Sorteggio (Lottery)
- **Periodo di candidatura**: 21 ottobre – 18 novembre 2025
- **Risultati**: 11 dicembre 2025
- **Tariffe**:
  - Residenti USA: $250 USD
  - Internazionali: $260 USD
- **Età**: Minimo 16 anni (autorizzazione parentale necessaria per 16-17 anni)

### ✅ Iscrizione Garantita

#### 🏃 Tempo Qualificante
- Tempi ufficiali in gare certificate
- Standard per età e genere
- Verifica obbligatoria

#### 🏅 Legacy Finisher
- Per corridori che hanno completato multiple edizioni precedenti
- Sistema a punti basato sulla storia

#### 🎽 Bank of America Chicago Distance Series
- Completare gare della serie ufficiale durante l'anno

#### 🎗️ Iscrizione Benefica (Charity)
- Iscrizione garantita con raccolta fondi
- Importo tipico: **$1.750 – $2.000 USD**

#### 🌍 Tour Operators
- Pacchetti internazionali con iscrizione garantita
- Include hotel + servizi (~$1.000–3.000 USD)

## 🏆 Statistiche

- **45.000 – 50.000 finisher** annuali
- **+120 paesi** rappresentati
- **Elite mondiale** + corridori di tutti i livelli
- **Limite di tempo**: 6 ore 30 minuti
- **Clima tipico**: 10–15°C (condizioni ideali per la performance)

## 🎯 Dettagli Tecnici

- **Distanza**: 42,195 km (26,2 mi)
- **Dislivello positivo**: ~140m (estremamente piatto)
- **Superficie**: Asfalto urbano
- **Ristori**: Frequenti (acqua + bevanda isotonica)
- **Cronometraggio**: Ufficiale con chip timing
- **Pacemaker ufficiali**: Disponibili per vari tempi obiettivo

## 🌟 Perché è Speciale

- **Abbott World Marathon Majors** – una delle sei maratone più prestigiose al mondo
- **Percorso più veloce** – ideale per record personali (PB) e qualificazione Boston (BQ)
- **Supporto del pubblico spettacolare** – milioni di spettatori lungo il percorso
- **Expo gigante** – Abbott Health & Fitness Expo di grande scala
- **Organizzazione eccellente** – standard mondiale di qualità

## 📅 Date Importanti

- **21 ott – 18 nov 2025**: Periodo di candidatura sorteggio
- **11 dicembre 2025**: Risultati del sorteggio
- **8–10 ottobre 2026**: Abbott Health & Fitness Expo + ritiro pettorali
- **10 ottobre 2026**: Abbott Chicago 5K
- **11 ottobre 2026**: Giorno della gara

## 🎪 Eventi del Fine Settimana

### Abbott Health & Fitness Expo
- **Luogo**: McCormick Place
- **Date**: 8–10 ottobre 2026
- Ritiro obbligatorio dei pettorali
- Documento d'identità con foto obbligatorio

### Abbott Chicago 5K
- **Data**: 10 ottobre 2026 (sabato)
- **Orario**: 7:30
- Percorso nel centro di Chicago

### 27th Mile Post-Race Party
- **Luogo**: Butler Field, Grant Park
- **Orari**: 9:30 – 16:00
- Musica dal vivo, cibo, bevande
- Birra gratis per +21 anni (con documento)

## 🏃 Servizi il Giorno della Gara

- ✅ Ristori frequenti (acqua + bevanda isotonica)
- ✅ Pacemaker ufficiali per vari tempi
- ✅ Cronometraggio ufficiale (chip timing)
- ✅ Deposito bagagli (gear check)
- ✅ Trasporto pubblico potenziato
- ✅ Copertura TV in diretta (NBC 5 Chicago, Telemundo)
- ✅ Copertura radio (670 The Score)
- ✅ Spazi per allattamento il giorno della gara
- ✅ Oggetti smarriti
- ✅ Runner Reunite (torri alfabetiche per incontrarsi)

## 📺 Trasmissione

- **TV**: NBC 5 Chicago, Telemundo Chicago, TeleXitos (7:00 – 11:00 CT)
- **Streaming**: nbcchicago.com / telemundochicago.com (7:00 – 15:00 CT)
- **Radio**: 670 The Score Sports Radio (7:00 – 11:00 CT)

## 🔗 Informazioni Ufficiali

Visita [www.chicagomarathon.com](https://www.chicagomarathon.com) per informazioni complete su iscrizione, allenamento e giorno della gara.`,
      city: "Chicago, IL",
      metaTitle:
        "Bank of America Chicago Marathon 2026 - 48ª Edizione | Chicago | 11 Ottobre",
      metaDescription:
        "Bank of America Chicago Marathon 2026 - 48ª edizione l'11 ottobre a Chicago. World Marathon Majors. Percorso più veloce al mondo. 42,195km. Sorteggio: 21 ott-18 nov. 45.000+ corridori.",
    },
  };

  const languages: Array<"pt" | "en" | "es" | "fr" | "de" | "it"> = [
    "pt",
    "en",
    "es",
    "fr",
    "de",
    "it",
  ];

  // ============================================================================
  // 🎯 CREATE EVENT
  // ============================================================================

  const event = await prisma.event.upsert({
    where: { slug: "chicago-marathon-2026" },
    update: {
      title: "Bank of America Chicago Marathon",
      description:
        "One of the six Abbott World Marathon Majors and the world's fastest marathon course.",
      startDate: new Date("2026-10-11T12:30:00Z"), // 7:30 AM CT start
      endDate: new Date("2026-10-11T19:00:00Z"), // 6.5 hour cutoff
      sportTypes: ["RUNNING"],
      city: "Chicago",
      country: "United States",
      latitude: 41.8722,
      longitude: -87.6189,
      googleMapsUrl:
        "https://www.google.com/maps/place/Grant+Park,+Chicago,+IL",
      imageUrl:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2074",
      externalUrl: "https://www.chicagomarathon.com",
      isFeatured: true,
      registrationDeadline: new Date("2025-11-18T23:59:59Z"),
    },
    create: {
      slug: "chicago-marathon-2026",
      title: "Bank of America Chicago Marathon",
      description:
        "One of the six Abbott World Marathon Majors and the world's fastest marathon course.",
      startDate: new Date("2026-10-11T12:30:00Z"), // 7:30 AM CT start
      endDate: new Date("2026-10-11T19:00:00Z"), // 6.5 hour cutoff
      sportTypes: ["RUNNING"],
      city: "Chicago",
      country: "United States",
      latitude: 41.8722,
      longitude: -87.6189,
      googleMapsUrl:
        "https://www.google.com/maps/place/Grant+Park,+Chicago,+IL",
      imageUrl:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?q=80&w=2074",
      externalUrl: "https://www.chicagomarathon.com",
      isFeatured: true,
      registrationDeadline: new Date("2025-11-18T23:59:59Z"),
    },
  });

  console.log(`✅ Event created/updated: ${event.slug}`);

  // ============================================================================
  // 🌍 CREATE EVENT TRANSLATIONS (ALL 6 LANGUAGES)
  // ============================================================================

  console.log("🌍 Creating event translations...");

  for (const lang of languages) {
    const trans = translations[lang];

    await prisma.eventTranslation.upsert({
      where: {
        eventId_language: {
          eventId: event.id,
          language: lang,
        },
      },
      update: {
        title: trans.title,
        description: trans.description,
        city: trans.city,
        metaTitle: trans.metaTitle, // ✅ REQUIRED FOR SEO
        metaDescription: trans.metaDescription, // ✅ REQUIRED FOR SEO
      },
      create: {
        eventId: event.id,
        language: lang,
        title: trans.title,
        description: trans.description,
        city: trans.city,
        metaTitle: trans.metaTitle, // ✅ REQUIRED FOR SEO
        metaDescription: trans.metaDescription, // ✅ REQUIRED FOR SEO
      },
    });

    console.log(`   ✅ Created ${lang.toUpperCase()} translation`);
  }

  // ============================================================================
  // 🏃 CREATE EVENT VARIANT (Full Marathon)
  // ============================================================================

  console.log("🏃 Creating event variant...");

  const marathonVariant = await prisma.eventVariant.create({
    data: {
      eventId: event.id,
      name: "Full Marathon",
      distanceKm: 42,
      elevationGainM: 140,
      elevationLossM: 140,
      cutoffTimeHours: 6.5,
      startTime: "07:30 AM",
      price: 250.0, // Base U.S. resident price
      currency: "USD",
      maxParticipants: 50000,
    },
  });

  console.log(`✅ Created variant: ${marathonVariant.name}`);

  // Create variant translations for all 6 languages
  console.log("🌍 Creating variant translations...");

  const variantTranslations = {
    pt: {
      name: "Maratona Completa (42,195 km)",
      description:
        "Maratona completa de 42,195km pelo percurso mais rápido do mundo através de 29 bairros de Chicago. Entrada via sorteio, entrada garantida ou caridade. Idade mínima: 16 anos. Tempo limite: 6,5 horas.",
    },
    en: {
      name: "Full Marathon (42.195 km)",
      description:
        "Full 42.195km marathon on the world's fastest course through 29 Chicago neighborhoods. Entry via lottery, guaranteed entry, or charity. Minimum age: 16 years. Time limit: 6.5 hours.",
    },
    es: {
      name: "Maratón Completo (42,195 km)",
      description:
        "Maratón completo de 42,195km por el recorrido más rápido del mundo a través de 29 barrios de Chicago. Entrada vía sorteo, entrada garantizada o benéfica. Edad mínima: 16 años. Tiempo límite: 6,5 horas.",
    },
    fr: {
      name: "Marathon Complet (42,195 km)",
      description:
        "Marathon complet de 42,195km sur le parcours le plus rapide au monde à travers 29 quartiers de Chicago. Entrée par tirage au sort, entrée garantie ou caritative. Âge minimum : 16 ans. Limite de temps : 6,5 heures.",
    },
    de: {
      name: "Vollständiger Marathon (42,195 km)",
      description:
        "Vollständiger Marathon von 42,195km auf der schnellsten Strecke der Welt durch 29 Stadtteile von Chicago. Eintritt per Verlosung, garantierter Eintritt oder Wohltätigkeit. Mindestalter: 16 Jahre. Zeitlimit: 6,5 Stunden.",
    },
    it: {
      name: "Maratona Completa (42,195 km)",
      description:
        "Maratona completa di 42,195km sul percorso più veloce al mondo attraverso 29 quartieri di Chicago. Iscrizione tramite sorteggio, iscrizione garantita o beneficenza. Età minima: 16 anni. Tempo limite: 6,5 ore.",
    },
  };

  for (const lang of languages) {
    const trans = variantTranslations[lang];
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: marathonVariant.id,
          language: lang,
        },
      },
      update: {
        name: trans.name,
        description: trans.description,
      },
      create: {
        variantId: marathonVariant.id,
        language: lang,
        name: trans.name,
        description: trans.description,
      },
    });

    console.log(`   ✅ Created ${lang.toUpperCase()} variant translation`);
  }

  // ============================================================================
  // 💰 CREATE PRICING PHASES
  // ============================================================================

  console.log("💰 Creating pricing phases...");

  // Delete existing pricing phases to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  const pricingPhases = [
    {
      name: "U.S. Residents - Lottery Entry",
      startDate: new Date("2025-10-21T00:00:00Z"),
      endDate: new Date("2025-11-18T23:59:59Z"),
      price: 250.0,
      currency: "USD" as const,
      note: "U.S. residents only. Lottery application period. Entry fee charged only if selected.",
    },
    {
      name: "International - Lottery Entry",
      startDate: new Date("2025-10-21T00:00:00Z"),
      endDate: new Date("2025-11-18T23:59:59Z"),
      price: 260.0,
      currency: "USD" as const,
      note: "Non-U.S. residents. Lottery application period. Entry fee charged only if selected.",
    },
    {
      name: "Guaranteed Entry - Time Qualifier",
      startDate: new Date("2025-10-21T00:00:00Z"),
      endDate: new Date("2025-11-18T23:59:59Z"),
      price: 250.0,
      currency: "USD" as const,
      note: "Guaranteed entry for runners with qualifying times. Verification required.",
    },
    {
      name: "Charity Entry",
      startDate: new Date("2025-10-21T00:00:00Z"),
      endDate: new Date("2026-09-30T23:59:59Z"),
      price: 1750.0,
      currency: "USD" as const,
      note: "Fundraising minimum for charity partners. Guaranteed entry with fundraising commitment.",
    },
    {
      name: "Tour Operator Package",
      startDate: new Date("2025-10-21T00:00:00Z"),
      endDate: new Date("2026-09-30T23:59:59Z"),
      price: 1000.0,
      currency: "USD" as const,
      note: "Guaranteed entry through official tour operators. Includes race entry + package services.",
    },
  ];

  for (const phase of pricingPhases) {
    await prisma.pricingPhase.create({
      data: {
        eventId: event.id, // ✅ CORRECT: linked to eventId
        name: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        price: phase.price,
        currency: phase.currency,
        note: phase.note,
      },
    });

    console.log(`   💵 Created pricing phase: ${phase.name}`);
  }

  // ============================================================================
  // ✅ SUMMARY
  // ============================================================================

  console.log(
    "\n🎉 Bank of America Chicago Marathon 2026 seed completed successfully!"
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📅 Event Date: October 11, 2026`);
  console.log(`📍 Location: Chicago, Illinois, USA`);
  console.log(`🏆 Category: Abbott World Marathon Majors`);
  console.log(
    `🌍 Translations: ${languages.length} languages (pt, en, es, fr, de, it)`
  );
  console.log(`🏃 Variants: 1 (Full Marathon)`);
  console.log(
    `💰 Pricing Phases: 5 (U.S. Lottery, International Lottery, Time Qualifier, Charity, Tour Operator)`
  );
  console.log(`🔗 URL: https://athlifyr.com/events/${event.slug}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

// ============================================================================
// 🚀 EXECUTE SEED
// ============================================================================

seedChicagoMarathon()
  .catch((error) => {
    console.error("❌ Error seeding Chicago Marathon 2026:", error);
    throw error;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
