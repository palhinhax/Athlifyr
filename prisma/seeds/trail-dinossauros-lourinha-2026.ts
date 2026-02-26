/**
 * Seed: Trail Running Trilho dos Dinossauros 2026 - 8ª Edição
 *
 * Event: Trail running races in Lourinhã (Dinosaur Trail)
 * Location: Praia da Areia Branca, Lourinhã
 * Date: April 11, 2026 (postponed from original date)
 * Organizer: Trilho Perdido
 */

import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🦖 Seeding Trail Running Trilho dos Dinossauros 2026...");

  // Delete existing event if it exists (idempotency)
  await prisma.event.deleteMany({
    where: {
      OR: [
        { slug: "trail-dinossauros-lourinha-2026" },
        { slug: "trilho-dinossauros-2026" },
        { slug: "trail-running-dinossauros-2026" },
      ],
    },
  });

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "Trail Running Trilho dos Dinossauros 2026 - 8ª Edição",
      slug: "trail-dinossauros-lourinha-2026",
      description:
        "8ª Edição do Trail Running Trilho dos Dinossauros na Lourinhã",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-04-11T09:10:00Z"),
      endDate: new Date("2026-04-11T18:00:00Z"),
      registrationDeadline: new Date("2026-02-06T23:59:59Z"),
      imageUrl: "", // To be uploaded via admin
      city: "Lourinhã",
      country: "Portugal",
      latitude: 39.2367,
      longitude: -9.3139,
      isFeatured: true,
      cancelled: false,
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // Translations for all 6 languages
  const translations = {
    pt: {
      title: "Trail Running Trilho dos Dinossauros 2026 - 8ª Edição",
      description: `# 🦖 Trail Running Trilho dos Dinossauros 2026 - 8ª Edição

**Corra entre Dinossauros na bela Praia da Areia Branca!**

---

## 📅 Data e Localização

- **Data**: 11 de Abril de 2026 (Sexta-feira) - ⚠️ **Evento adiado da data original**
- **Local**: Praia da Areia Branca, Lourinhã
- **Partida/Chegada**: Praia da Areia Branca

## 🏃 Provas Disponíveis

### Trail Longo - 31 km
- **Distância**: 31 km
- **Hora de Partida**: 09h10
- **Idade Mínima**: 20 anos (Sub-23)
- **Limite de Participantes**: Incluído nos 1.000 atletas total

### Trail Sprint (Curto) - 20 km
- **Distância**: 20 km
- **Hora de Partida**: 09h20
- **Idade Mínima**: 18 anos (Juniores)
- **Limite de Participantes**: Incluído nos 1.000 atletas total

### Trail Jovem (Mini Trail) - 11 km
- **Distância**: 11 km
- **Hora de Partida**: 09h30
- **Idade Mínima**: 16 anos (Juvenis)
- **Limite de Participantes**: Incluído nos 1.000 atletas total

### Caminhada - 10 km
- **Distância**: 10 km
- **Hora de Partida**: 09h35
- **Idade Mínima**: Livre
- **Limite de Participantes**: 75 atletas

### Trail Kids - Gratuito 🎉
- **Hora de Partida**: 08h45
- **Idade**: Crianças
- **Inscrição**: **Gratuita**

## 🎯 Destaques

✅ **8ª Edição** do evento mais dinossáurico de Portugal! 🦖  
✅ **5 provas** para todos os níveis (31K, 20K, 11K, 10K, Kids)  
✅ **Inscrições ESGOTADAS** - 1.614 inscritos!  
✅ **Camisola técnica** by Compressport incluída  
✅ **Meias técnicas** Socksby incluídas  
✅ **Gola** incluída para todas as provas trail  
✅ **Medalha finisher** para todos os participantes  
✅ **Troféus** para classificação geral e escalões  
✅ **Almoço convívio** entre atletas (opcional - 6€)  
✅ **Percurso único** entre dinossauros e praias  

## 📋 Secretariado - Levantamento do Kit

**Sábado, 10 de Abril de 2026**:
- 15h00 às 19h30 (Local a designar)

**Domingo, 11 de Abril de 2026**:
- 07h15 - Abertura do Secretariado
- 08h30 - Fecho do Secretariado

## 🏆 Prémios

### Trail 31K, Trail Sprint 20K e Mini Trail 11K

**Classificação Geral**:
- Prémios para os 3 primeiros classificados (Masculino e Feminino)

**Escalões Etários**:
- Troféus para os 3 primeiros classificados de cada escalão (M/F)

**Equipas**:
- Prémio para as 3 melhores equipas

**Todos os Participantes**:
- Medalha finisher
- Camisola técnica by Compressport
- Meias técnicas Socksby
- Gola

### Caminhada 10K

**Todos os Participantes**:
- Medalha finisher
- Camisola técnica
- Meias técnicas Socksby
- Gola

### Trail Kids

**Todos os Participantes**:
- Medalha finisher
- **Inscrição Gratuita** 🎉

## 👥 Escalões Etários

Os escalões são definidos pela idade que o atleta terá a **30 de Setembro de 2026**:

- **Juvenis M/F**: 16-17 anos (até 15 km)
- **Juniores M/F**: 18-19 anos (até 25 km)
- **Sub-23 M/F**: 20-22 anos
- **Seniores M/F**: 23-34 anos
- **M35/F35**: 35-39 anos
- **M40/F40**: 40-44 anos
- **M45/F45**: 45-49 anos
- **M50/F50**: 50-54 anos
- **M55/F55**: 55-59 anos
- **M60/F60**: 60-64 anos
- **M65/F65**: 65-69 anos
- **M70/F70**: 70 anos ou mais

## 🎫 Inscrições

**⚠️ INSCRIÇÕES ESGOTADAS**

**Estatísticas Finais**:
- Total de Inscritos: **1.614 atletas**
- Trail Longo 31K: 237 atletas
- Trail Sprint 20K: 627 atletas
- Mini Trail 11K: 530 atletas
- Caminhada 10K: 151 atletas
- Trail Kids: 69 crianças

### Preços (para referência)

**1ª Fase - Promocional (05-07 Dezembro 2025)**:
- Trail Longo 31K: 24€
- Trail Sprint 20K: 20€
- Mini Trail 11K: 16€
- Caminhada 10K: 16€
- Trail Kids: **Gratuito**

**2ª Fase (08-12 Dezembro 2025)**:
- Trail Longo 31K: 26€
- Trail Sprint 20K: 22€
- Mini Trail 11K: 17€
- Caminhada 10K: 17€

**3ª Fase (13 Dezembro 2025 - 06 Fevereiro 2026)**:
- Trail Longo 31K: 27€
- Trail Sprint 20K: 23€
- Mini Trail 11K: 18€
- Caminhada 10K: 18€

**Extras**:
- Almoço de Atleta: 6€
- Almoço de Acompanhante: 8€

### Notas Importantes

❗ **Após 22 de Janeiro 2026 não são aceites**:
- Alteração de titular de dorsal
- Transferências de pagamento entre atletas
- Devolução de valores de inscrições
- Trocas de distâncias

## ⏰ Programa do Evento

### Sábado, 10 de Abril de 2026
- 15h00 às 19h30 - Abertura do Secretariado

### Domingo, 11 de Abril de 2026
- 07h15 - Abertura do Secretariado
- 08h30 - Fecho do Secretariado
- 08h45 - **Trail Kids**
- 09h00 - Aquecimento Geral (dinamização Ginásio Ativo)
- 09h10 - **Partida Trail 31K**
- 09h20 - **Partida Trail Sprint 20K**
- 09h30 - **Partida Trail Jovem 11K**
- 09h35 - **Partida Caminhada 10K**
- 12h30 - Cerimónia de entrega de prémios - Trail Jovem 11K
- 13h00 - Almoço Convívio entre Atletas
- 14h00 - Cerimónia de entrega de prémios - Trail Sprint 20K
- 14h30 - Cerimónia de entrega de prémios - Trail 31K
- 15h15 - Atuações Várias
- 16h15 - Atuações Várias
- 18h00 - Encerramento

## 🎽 Material Incluído

- Camisola técnica by Compressport
- Meias técnicas Socksby
- Gola (para provas de trail)
- Medalha finisher
- Chip de cronometragem
- Seguro desportivo

## 📞 Contactos

**Organização**: Trilho Perdido  
**Email Geral**: geral@trilhoperdido.com  
**Email Inscrições**: infotrilhoperdido@gmail.com  
**Email Recibos**: trofeudosdinossauros@gmail.com  
**Telefone**: 934 568 787  
**Horário**: Segunda a Sexta-Feira, 10h00-13h00 / 14h00-17h30

---

*Corra entre Dinossauros na 8ª Edição deste evento único!* 🦖`,
      city: "Lourinhã",
      metaTitle:
        "Trail Dinossauros 2026 - 8ª Ed. | Praia Areia Branca, Lourinhã | 11 Abril",
      metaDescription:
        "Trail Running Trilho dos Dinossauros 2026 - 8ª Edição no dia 11 de abril na Lourinhã. Provas: Trail 31K, Sprint 20K, Jovem 11K, Caminhada 10K e Kids. Camisola Compressport e medalha incluídas. Inscrições esgotadas!",
    },
    en: {
      title: "Dinosaur Trail Running 2026 - 8th Edition",
      description: `# 🦖 Dinosaur Trail Running 2026 - 8th Edition

**Run among Dinosaurs at beautiful Praia da Areia Branca!**

---

## 📅 Date and Location

- **Date**: April 11, 2026 (Friday) - ⚠️ **Event postponed from original date**
- **Location**: Praia da Areia Branca, Lourinhã
- **Start/Finish**: Praia da Areia Branca

## 🏃 Available Races

### Long Trail - 31 km
- **Distance**: 31 km
- **Start Time**: 09:10
- **Minimum Age**: 20 years (Sub-23)
- **Participant Limit**: Included in 1,000 total athletes

### Sprint Trail (Short) - 20 km
- **Distance**: 20 km
- **Start Time**: 09:20
- **Minimum Age**: 18 years (Juniors)
- **Participant Limit**: Included in 1,000 total athletes

### Youth Trail (Mini Trail) - 11 km
- **Distance**: 11 km
- **Start Time**: 09:30
- **Minimum Age**: 16 years (Juveniles)
- **Participant Limit**: Included in 1,000 total athletes

### Walk - 10 km
- **Distance**: 10 km
- **Start Time**: 09:35
- **Minimum Age**: Free
- **Participant Limit**: 75 athletes

### Trail Kids - Free 🎉
- **Start Time**: 08:45
- **Age**: Children
- **Registration**: **Free**

## 🎯 Highlights

✅ **8th Edition** of Portugal's most dinosauric event! 🦖  
✅ **5 races** for all levels (31K, 20K, 11K, 10K, Kids)  
✅ **SOLD OUT** - 1,614 registered!  
✅ **Technical shirt** by Compressport included  
✅ **Technical socks** Socksby included  
✅ **Neck warmer** included for all trail races  
✅ **Finisher medal** for all participants  
✅ **Trophies** for overall and age categories  
✅ **Athletes lunch** available (optional - 6€)  
✅ **Unique course** among dinosaurs and beaches  

## 📋 Race Office - Kit Collection

**Saturday, April 10, 2026**:
- 15:00 to 19:30 (Location to be announced)

**Sunday, April 11, 2026**:
- 07:15 - Race Office Opens
- 08:30 - Race Office Closes

## 🏆 Awards

### Trail 31K, Trail Sprint 20K and Mini Trail 11K

**Overall Classification**:
- Awards for top 3 finishers (Male and Female)

**Age Categories**:
- Trophies for top 3 in each age category (M/F)

**Teams**:
- Award for top 3 teams

**All Participants**:
- Finisher medal
- Technical shirt by Compressport
- Technical socks Socksby
- Neck warmer

### Walk 10K

**All Participants**:
- Finisher medal
- Technical shirt
- Technical socks Socksby
- Neck warmer

### Trail Kids

**All Participants**:
- Finisher medal
- **Free Registration** 🎉

## 👥 Age Categories

Categories are defined by the athlete's age on **September 30, 2026**:

- **Juveniles M/F**: 16-17 years (up to 15 km)
- **Juniors M/F**: 18-19 years (up to 25 km)
- **Sub-23 M/F**: 20-22 years
- **Seniors M/F**: 23-34 years
- **M35/F35**: 35-39 years
- **M40/F40**: 40-44 years
- **M45/F45**: 45-49 years
- **M50/F50**: 50-54 years
- **M55/F55**: 55-59 years
- **M60/F60**: 60-64 years
- **M65/F65**: 65-69 years
- **M70/F70**: 70 years or more

## 🎫 Registration

**⚠️ SOLD OUT**

**Final Statistics**:
- Total Registered: **1,614 athletes**
- Long Trail 31K: 237 athletes
- Sprint Trail 20K: 627 athletes
- Mini Trail 11K: 530 athletes
- Walk 10K: 151 athletes
- Trail Kids: 69 children

### Prices (for reference)

**1st Phase - Promotional (Dec 05-07, 2025)**:
- Long Trail 31K: €24
- Sprint Trail 20K: €20
- Mini Trail 11K: €16
- Walk 10K: €16
- Trail Kids: **Free**

**2nd Phase (Dec 08-12, 2025)**:
- Long Trail 31K: €26
- Sprint Trail 20K: €22
- Mini Trail 11K: €17
- Walk 10K: €17

**3rd Phase (Dec 13, 2025 - Feb 06, 2026)**:
- Long Trail 31K: €27
- Sprint Trail 20K: €23
- Mini Trail 11K: €18
- Walk 10K: €18

**Extras**:
- Athlete Lunch: €6
- Companion Lunch: €8

### Important Notes

❗ **After January 22, 2026 NOT accepted**:
- Bib number holder changes
- Payment transfers between athletes
- Registration fee refunds
- Distance changes

## ⏰ Event Schedule

### Saturday, April 10, 2026
- 15:00 to 19:30 - Race Office Opens

### Sunday, April 11, 2026
- 07:15 - Race Office Opens
- 08:30 - Race Office Closes
- 08:45 - **Trail Kids**
- 09:00 - General Warm-up (Ginásio Ativo)
- 09:10 - **Start Trail 31K**
- 09:20 - **Start Trail Sprint 20K**
- 09:30 - **Start Trail Youth 11K**
- 09:35 - **Start Walk 10K**
- 12:30 - Awards Ceremony - Trail Youth 11K
- 13:00 - Athletes Lunch
- 14:00 - Awards Ceremony - Trail Sprint 20K
- 14:30 - Awards Ceremony - Trail 31K
- 15:15 - Various Performances
- 16:15 - Various Performances
- 18:00 - Closing

## 🎽 Included Items

- Technical shirt by Compressport
- Technical socks Socksby
- Neck warmer (for trail races)
- Finisher medal
- Timing chip
- Sports insurance

## 📞 Contact

**Organization**: Trilho Perdido  
**General Email**: geral@trilhoperdido.com  
**Registration Email**: infotrilhoperdido@gmail.com  
**Receipts Email**: trofeudosdinossauros@gmail.com  
**Phone**: +351 934 568 787  
**Hours**: Monday to Friday, 10:00-13:00 / 14:00-17:30

---

*Run among Dinosaurs at the 8th Edition of this unique event!* 🦖`,
      city: "Lourinhã",
      metaTitle:
        "Dinosaur Trail 2026 - 8th Ed. | Praia Areia Branca, Lourinhã | April 11",
      metaDescription:
        "Dinosaur Trail Running 2026 - 8th Edition on April 11 in Lourinhã. Races: Trail 31K, Sprint 20K, Youth 11K, Walk 10K and Kids. Compressport shirt and medal included. Sold out!",
    },
    es: {
      title: "Trail de los Dinosaurios 2026 - 8ª Edición",
      description: `# 🦖 Trail de los Dinosaurios 2026 - 8ª Edición

**¡Corre entre Dinosaurios en la hermosa Praia da Areia Branca!**

---

## 📅 Fecha y Ubicación

- **Fecha**: 11 de Abril de 2026 (Viernes) - ⚠️ **Evento pospuesto de la fecha original**
- **Ubicación**: Praia da Areia Branca, Lourinhã
- **Salida/Llegada**: Praia da Areia Branca

## 🏃 Carreras Disponibles

### Trail Largo - 31 km
- **Distancia**: 31 km
- **Hora de Salida**: 09:10
- **Edad Mínima**: 20 años (Sub-23)
- **Límite de Participantes**: Incluido en 1.000 atletas total

### Trail Sprint (Corto) - 20 km
- **Distancia**: 20 km
- **Hora de Salida**: 09:20
- **Edad Mínima**: 18 años (Juniors)
- **Límite de Participantes**: Incluido en 1.000 atletas total

### Trail Joven (Mini Trail) - 11 km
- **Distancia**: 11 km
- **Hora de Salida**: 09:30
- **Edad Mínima**: 16 años (Juveniles)
- **Límite de Participantes**: Incluido en 1.000 atletas total

### Caminata - 10 km
- **Distancia**: 10 km
- **Hora de Salida**: 09:35
- **Edad Mínima**: Libre
- **Límite de Participantes**: 75 atletas

### Trail Kids - Gratis 🎉
- **Hora de Salida**: 08:45
- **Edad**: Niños
- **Inscripción**: **Gratuita**

## 🎯 Destacados

✅ **8ª Edición** del evento más dinosaurico de Portugal! 🦖  
✅ **5 carreras** para todos los niveles (31K, 20K, 11K, 10K, Kids)  
✅ **INSCRIPCIONES AGOTADAS** - ¡1.614 inscritos!  
✅ **Camiseta técnica** by Compressport incluida  
✅ **Calcetines técnicos** Socksby incluidos  
✅ **Cuello** incluido para todas las carreras trail  
✅ **Medalla finisher** para todos los participantes  
✅ **Trofeos** para clasificación general y categorías  
✅ **Almuerzo de atletas** disponible (opcional - 6€)  
✅ **Recorrido único** entre dinosaurios y playas  

## 🏆 Premios

### Trail 31K, Trail Sprint 20K y Mini Trail 11K

**Clasificación General**:
- Premios para los 3 primeros clasificados (Masculino y Femenino)

**Categorías de Edad**:
- Trofeos para los 3 primeros de cada categoría (M/F)

**Equipos**:
- Premio para los 3 mejores equipos

**Todos los Participantes**:
- Medalla finisher
- Camiseta técnica by Compressport
- Calcetines técnicos Socksby
- Cuello

## 🎫 Inscripciones

**⚠️ INSCRIPCIONES AGOTADAS**

**Estadísticas Finales**:
- Total de Inscritos: **1.614 atletas**
- Trail Largo 31K: 237 atletas
- Trail Sprint 20K: 627 atletas
- Mini Trail 11K: 530 atletas
- Caminata 10K: 151 atletas
- Trail Kids: 69 niños

## 📞 Contacto

**Organización**: Trilho Perdido  
**Email General**: geral@trilhoperdido.com  
**Email Inscripciones**: infotrilhoperdido@gmail.com  
**Teléfono**: +351 934 568 787

---

*¡Corre entre Dinosaurios en la 8ª Edición de este evento único!* 🦖`,
      city: "Lourinhã",
      metaTitle:
        "Trail Dinosaurios 2026 - 8ª Ed. | Praia Areia Branca, Lourinhã | 11 Abril",
      metaDescription:
        "Trail de los Dinosaurios 2026 - 8ª Edición el 11 de abril en Lourinhã. Carreras: Trail 31K, Sprint 20K, Joven 11K, Caminata 10K y Kids. Camiseta Compressport y medalla incluidas. ¡Inscripciones agotadas!",
    },
    fr: {
      title: "Trail des Dinosaures 2026 - 8e Édition",
      description: `# 🦖 Trail des Dinosaures 2026 - 8e Édition

**Courez parmi les Dinosaures à la belle Praia da Areia Branca !**

---

## 📅 Date et Lieu

- **Date** : 11 Avril 2026 (Vendredi) - ⚠️ **Événement reporté de la date originale**
- **Lieu** : Praia da Areia Branca, Lourinhã
- **Départ/Arrivée** : Praia da Areia Branca

## 🏃 Courses Disponibles

### Trail Long - 31 km
- **Distance** : 31 km
- **Heure de Départ** : 09h10
- **Âge Minimum** : 20 ans (Sub-23)

### Trail Sprint (Court) - 20 km
- **Distance** : 20 km
- **Heure de Départ** : 09h20
- **Âge Minimum** : 18 ans (Juniors)

### Trail Jeune (Mini Trail) - 11 km
- **Distance** : 11 km
- **Heure de Départ** : 09h30
- **Âge Minimum** : 16 ans (Juvéniles)

### Marche - 10 km
- **Distance** : 10 km
- **Heure de Départ** : 09h35
- **Âge Minimum** : Libre

### Trail Kids - Gratuit 🎉
- **Heure de Départ** : 08h45
- **Âge** : Enfants
- **Inscription** : **Gratuite**

## 🎯 Points Forts

✅ **8e Édition** de l'événement le plus dinosaurique du Portugal ! 🦖  
✅ **5 courses** pour tous les niveaux (31K, 20K, 11K, 10K, Kids)  
✅ **INSCRIPTIONS COMPLÈTES** - 1 614 inscrits !  
✅ **T-shirt technique** by Compressport inclus  
✅ **Chaussettes techniques** Socksby incluses  
✅ **Tour de cou** inclus pour toutes les courses trail  
✅ **Médaille finisher** pour tous les participants  
✅ **Trophées** pour classement général et catégories  
✅ **Déjeuner des athlètes** disponible (optionnel - 6€)  
✅ **Parcours unique** parmi les dinosaures et les plages  

## 🏆 Récompenses

### Trail 31K, Trail Sprint 20K et Mini Trail 11K

**Classement Général** :
- Récompenses pour les 3 premiers classés (Hommes et Femmes)

**Catégories d'Âge** :
- Trophées pour les 3 premiers de chaque catégorie (H/F)

**Équipes** :
- Récompense pour les 3 meilleures équipes

**Tous les Participants** :
- Médaille finisher
- T-shirt technique by Compressport
- Chaussettes techniques Socksby
- Tour de cou

## 🎫 Inscriptions

**⚠️ INSCRIPTIONS COMPLÈTES**

**Statistiques Finales** :
- Total Inscrits : **1 614 athlètes**
- Trail Long 31K : 237 athlètes
- Trail Sprint 20K : 627 athlètes
- Mini Trail 11K : 530 athlètes
- Marche 10K : 151 athlètes
- Trail Kids : 69 enfants

## 📞 Contact

**Organisation** : Trilho Perdido  
**Email Général** : geral@trilhoperdido.com  
**Email Inscriptions** : infotrilhoperdido@gmail.com  
**Téléphone** : +351 934 568 787

---

*Courez parmi les Dinosaures à la 8e Édition de cet événement unique !* 🦖`,
      city: "Lourinhã",
      metaTitle:
        "Trail Dinosaures 2026 - 8e Éd. | Praia Areia Branca, Lourinhã | 11 Avril",
      metaDescription:
        "Trail des Dinosaures 2026 - 8e Édition le 11 avril à Lourinhã. Courses : Trail 31K, Sprint 20K, Jeune 11K, Marche 10K et Kids. T-shirt Compressport et médaille inclus. Inscriptions complètes !",
    },
    de: {
      title: "Dinosaurier Trail 2026 - 8. Ausgabe",
      description: `# 🦖 Dinosaurier Trail 2026 - 8. Ausgabe

**Laufen Sie zwischen Dinosauriern am schönen Praia da Areia Branca!**

---

## 📅 Datum und Ort

- **Datum**: 11. April 2026 (Freitag) - ⚠️ **Veranstaltung vom ursprünglichen Datum verschoben**
- **Ort**: Praia da Areia Branca, Lourinhã
- **Start/Ziel**: Praia da Areia Branca

## 🏃 Verfügbare Läufe

### Langer Trail - 31 km
- **Distanz**: 31 km
- **Startzeit**: 09:10
- **Mindestalter**: 20 Jahre (Sub-23)

### Sprint Trail (Kurz) - 20 km
- **Distanz**: 20 km
- **Startzeit**: 09:20
- **Mindestalter**: 18 Jahre (Junioren)

### Jugend Trail (Mini Trail) - 11 km
- **Distanz**: 11 km
- **Startzeit**: 09:30
- **Mindestalter**: 16 Jahre (Jugendliche)

### Wanderung - 10 km
- **Distanz**: 10 km
- **Startzeit**: 09:35
- **Mindestalter**: Frei

### Trail Kids - Kostenlos 🎉
- **Startzeit**: 08:45
- **Alter**: Kinder
- **Anmeldung**: **Kostenlos**

## 🎯 Höhepunkte

✅ **8. Ausgabe** der dinosaurischsten Veranstaltung Portugals! 🦖  
✅ **5 Läufe** für alle Niveaus (31K, 20K, 11K, 10K, Kids)  
✅ **AUSGEBUCHT** - 1.614 Anmeldungen!  
✅ **Technisches Shirt** by Compressport inklusive  
✅ **Technische Socken** Socksby inklusive  
✅ **Halswärmer** inklusive für alle Trail-Läufe  
✅ **Finisher-Medaille** für alle Teilnehmer  
✅ **Trophäen** für Gesamtwertung und Kategorien  
✅ **Athleten-Mittagessen** verfügbar (optional - 6€)  
✅ **Einzigartige Strecke** zwischen Dinosauriern und Stränden  

## 🏆 Preise

### Trail 31K, Trail Sprint 20K und Mini Trail 11K

**Gesamtwertung**:
- Preise für die Top 3 Finisher (Männer und Frauen)

**Alterskategorien**:
- Trophäen für die Top 3 jeder Kategorie (M/F)

**Teams**:
- Preis für die Top 3 Teams

**Alle Teilnehmer**:
- Finisher-Medaille
- Technisches Shirt by Compressport
- Technische Socken Socksby
- Halswärmer

## 🎫 Anmeldung

**⚠️ AUSGEBUCHT**

**Endstatistik**:
- Gesamt Angemeldet: **1.614 Athleten**
- Langer Trail 31K: 237 Athleten
- Sprint Trail 20K: 627 Athleten
- Mini Trail 11K: 530 Athleten
- Wanderung 10K: 151 Athleten
- Trail Kids: 69 Kinder

## 📞 Kontakt

**Organisation**: Trilho Perdido  
**Allgemeine E-Mail**: geral@trilhoperdido.com  
**Anmeldungs-E-Mail**: infotrilhoperdido@gmail.com  
**Telefon**: +351 934 568 787

---

*Laufen Sie zwischen Dinosauriern bei der 8. Ausgabe dieser einzigartigen Veranstaltung!* 🦖`,
      city: "Lourinhã",
      metaTitle:
        "Dinosaurier Trail 2026 - 8. Ausg. | Praia Areia Branca, Lourinhã | 11. April",
      metaDescription:
        "Dinosaurier Trail 2026 - 8. Ausgabe am 11. April in Lourinhã. Läufe: Trail 31K, Sprint 20K, Jugend 11K, Wanderung 10K und Kids. Compressport-Shirt und Medaille inklusive. Ausgebucht!",
    },
    it: {
      title: "Trail dei Dinosauri 2026 - 8ª Edizione",
      description: `# 🦖 Trail dei Dinosauri 2026 - 8ª Edizione

**Corri tra i Dinosauri nella splendida Praia da Areia Branca!**

---

## 📅 Data e Luogo

- **Data**: 11 Aprile 2026 (Venerdì) - ⚠️ **Evento posticipato dalla data originale**
- **Luogo**: Praia da Areia Branca, Lourinhã
- **Partenza/Arrivo**: Praia da Areia Branca

## 🏃 Gare Disponibili

### Trail Lungo - 31 km
- **Distanza**: 31 km
- **Ora di Partenza**: 09:10
- **Età Minima**: 20 anni (Sub-23)

### Trail Sprint (Corto) - 20 km
- **Distanza**: 20 km
- **Ora di Partenza**: 09:20
- **Età Minima**: 18 anni (Junior)

### Trail Giovani (Mini Trail) - 11 km
- **Distanza**: 11 km
- **Ora di Partenza**: 09:30
- **Età Minima**: 16 anni (Giovanissimi)

### Camminata - 10 km
- **Distanza**: 10 km
- **Ora di Partenza**: 09:35
- **Età Minima**: Libera

### Trail Kids - Gratis 🎉
- **Ora di Partenza**: 08:45
- **Età**: Bambini
- **Iscrizione**: **Gratuita**

## 🎯 Punti Salienti

✅ **8ª Edizione** dell'evento più dinosaurico del Portogallo! 🦖  
✅ **5 gare** per tutti i livelli (31K, 20K, 11K, 10K, Kids)  
✅ **ISCRIZIONI ESAURITE** - 1.614 iscritti!  
✅ **Maglietta tecnica** by Compressport inclusa  
✅ **Calze tecniche** Socksby incluse  
✅ **Scaldacollo** incluso per tutte le gare trail  
✅ **Medaglia finisher** per tutti i partecipanti  
✅ **Trofei** per classificazione generale e categorie  
✅ **Pranzo degli atleti** disponibile (opzionale - 6€)  
✅ **Percorso unico** tra dinosauri e spiagge  

## 🏆 Premi

### Trail 31K, Trail Sprint 20K e Mini Trail 11K

**Classifica Generale**:
- Premi per i primi 3 classificati (Maschile e Femminile)

**Categorie di Età**:
- Trofei per i primi 3 di ogni categoria (M/F)

**Squadre**:
- Premio per le 3 migliori squadre

**Tutti i Partecipanti**:
- Medaglia finisher
- Maglietta tecnica by Compressport
- Calze tecniche Socksby
- Scaldacollo

## 🎫 Iscrizioni

**⚠️ ISCRIZIONI ESAURITE**

**Statistiche Finali**:
- Totale Iscritti: **1.614 atleti**
- Trail Lungo 31K: 237 atleti
- Trail Sprint 20K: 627 atleti
- Mini Trail 11K: 530 atleti
- Camminata 10K: 151 atleti
- Trail Kids: 69 bambini

## 📞 Contatti

**Organizzazione**: Trilho Perdido  
**Email Generale**: geral@trilhoperdido.com  
**Email Iscrizioni**: infotrilhoperdido@gmail.com  
**Telefono**: +351 934 568 787

---

*Corri tra i Dinosauri all'8ª Edizione di questo evento unico!* 🦖`,
      city: "Lourinhã",
      metaTitle:
        "Trail Dinosauri 2026 - 8ª Ed. | Praia Areia Branca, Lourinhã | 11 Aprile",
      metaDescription:
        "Trail dei Dinosauri 2026 - 8ª Edizione l'11 aprile a Lourinhã. Gare: Trail 31K, Sprint 20K, Giovani 11K, Camminata 10K e Kids. Maglietta Compressport e medaglia incluse. Iscrizioni esaurite!",
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
      name: "Trail Longo 31K",
      distanceKm: 31,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-04-11T09:10:00Z"),
      startTime: "09:10",
      cutoffTimeHours: null,
      price: 27,
      currency: Currency.EUR,
      maxParticipants: 1000, // Part of the 1000 total limit
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Trail entre dinossauros e praias · Idade mínima: 20 anos (Sub-23 M/F) · Inclui: Camisola técnica Compressport, Meias Socksby, Gola, Medalha finisher, Chip, Seguro",
      pricingPhases: [
        {
          name: "Fase Promocional",
          startDate: new Date("2025-12-05T00:00:00Z"),
          endDate: new Date("2025-12-07T23:59:59Z"),
          price: 24,
          currency: Currency.EUR,
          note: "Fase Promocional (05-07 Dezembro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-12-08T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 26,
          currency: Currency.EUR,
          note: "2ª Fase (08-12 Dezembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2026-02-06T23:59:59Z"),
          price: 27,
          currency: Currency.EUR,
          note: "Fase Final (13 Dezembro - 06 Fevereiro)",
        },
      ],
    },
    {
      name: "Trail Sprint (Curto) 20K",
      distanceKm: 20,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-04-11T09:20:00Z"),
      startTime: "09:20",
      cutoffTimeHours: null,
      price: 23,
      currency: Currency.EUR,
      maxParticipants: 1000, // Part of the 1000 total limit
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Trail acessível · Idade mínima: 18 anos (Juniores M/F, até 25km) · Inclui: Camisola técnica Compressport, Meias Socksby, Gola, Medalha finisher, Chip, Seguro",
      pricingPhases: [
        {
          name: "Fase Promocional",
          startDate: new Date("2025-12-05T00:00:00Z"),
          endDate: new Date("2025-12-07T23:59:59Z"),
          price: 20,
          currency: Currency.EUR,
          note: "Fase Promocional (05-07 Dezembro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-12-08T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 22,
          currency: Currency.EUR,
          note: "2ª Fase (08-12 Dezembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2026-02-06T23:59:59Z"),
          price: 23,
          currency: Currency.EUR,
          note: "Fase Final (13 Dezembro - 06 Fevereiro)",
        },
      ],
    },
    {
      name: "Trail Jovem (Mini Trail) 11K",
      distanceKm: 11,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-04-11T09:30:00Z"),
      startTime: "09:30",
      cutoffTimeHours: null,
      price: 18,
      currency: Currency.EUR,
      maxParticipants: 1000, // Part of the 1000 total limit
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Trail para jovens · Idade mínima: 16 anos (Juvenis M/F, até 15km) · Inclui: Camisola técnica Compressport, Meias Socksby, Gola, Medalha finisher, Chip, Seguro",
      pricingPhases: [
        {
          name: "Fase Promocional",
          startDate: new Date("2025-12-05T00:00:00Z"),
          endDate: new Date("2025-12-07T23:59:59Z"),
          price: 16,
          currency: Currency.EUR,
          note: "Fase Promocional (05-07 Dezembro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-12-08T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 17,
          currency: Currency.EUR,
          note: "2ª Fase (08-12 Dezembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2026-02-06T23:59:59Z"),
          price: 18,
          currency: Currency.EUR,
          note: "Fase Final (13 Dezembro - 06 Fevereiro)",
        },
      ],
    },
    {
      name: "Caminhada 10K",
      distanceKm: 10,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-04-11T09:35:00Z"),
      startTime: "09:35",
      cutoffTimeHours: null,
      price: 18,
      currency: Currency.EUR,
      maxParticipants: 75,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Caminhada entre dinossauros · Não competitivo, sem classificação · Todas as idades · Inclui: Camisola técnica, Meias Socksby, Gola, Medalha finisher, Seguro",
      pricingPhases: [
        {
          name: "Fase Promocional",
          startDate: new Date("2025-12-05T00:00:00Z"),
          endDate: new Date("2025-12-07T23:59:59Z"),
          price: 16,
          currency: Currency.EUR,
          note: "Fase Promocional (05-07 Dezembro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2025-12-08T00:00:00Z"),
          endDate: new Date("2025-12-12T23:59:59Z"),
          price: 17,
          currency: Currency.EUR,
          note: "2ª Fase (08-12 Dezembro)",
        },
        {
          name: "3ª Fase",
          startDate: new Date("2025-12-13T00:00:00Z"),
          endDate: new Date("2026-02-06T23:59:59Z"),
          price: 18,
          currency: Currency.EUR,
          note: "Fase Final (13 Dezembro - 06 Fevereiro)",
        },
      ],
    },
    {
      name: "Trail Kids",
      distanceKm: null,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-04-11T08:45:00Z"),
      startTime: "08:45",
      cutoffTimeHours: null,
      price: 0,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Trail para crianças · Inscrição GRATUITA 🎉 · Inclui: Medalha finisher, Seguro",
      pricingPhases: [
        {
          name: "Inscrição Gratuita",
          startDate: new Date("2025-12-05T00:00:00Z"),
          endDate: new Date("2026-02-06T23:59:59Z"),
          price: 0,
          currency: Currency.EUR,
          note: "Inscrição GRATUITA durante todo o período",
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
- Event: Trail Running Trilho dos Dinossauros 2026 - 8ª Edição
- Variants: 5 race distances (31K, 20K, 11K, 10K, Kids)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 13 total
- Date: April 11, 2026
- Location: Praia da Areia Branca, Lourinhã
- Status: SOLD OUT - 1,614 participants registered! 🦖
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
