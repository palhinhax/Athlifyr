/**
 * Seed: 9º Terrugem Trail 2026
 *
 * Event: Trail running races in Terrugem, Sintra
 * Location: Terrugem, Sintra
 * Date: March 1, 2026
 * Organizer: ABIT - Associação Recreativa de Bicicletas de Terrugem
 * Platform: Recorde Pessoal
 */

import { PrismaClient, SportType, Currency, Language } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding 9º Terrugem Trail 2026...");

  // Delete existing event if it exists (idempotency)
  await prisma.event.deleteMany({
    where: {
      OR: [
        { slug: "terrugem-trail-2026" },
        { slug: "9-terrugem-trail-2026" },
        { slug: "terrugem-trail-sintra-2026" },
      ],
    },
  });

  // Create the main event
  const event = await prisma.event.create({
    data: {
      title: "9º Terrugem Trail 2026",
      slug: "terrugem-trail-2026",
      description: "9ª edição do Terrugem Trail em Sintra",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-01T09:00:00Z"),
      endDate: new Date("2026-03-01T15:00:00Z"),
      registrationDeadline: new Date("2026-02-22T23:59:59Z"),
      imageUrl: "", // To be uploaded via admin
      city: "Terrugem, Sintra",
      country: "Portugal",
      latitude: 38.8091,
      longitude: -9.3544,
      isFeatured: true,
      cancelled: false,
    },
  });

  console.log(`✅ Created event: ${event.slug}`);

  // Translations for all 6 languages
  const translations = {
    pt: {
      title: "9º Terrugem Trail 2026",
      description: `# 🏃 9º Terrugem Trail 2026

**Viva novas experiências em trilhos distintos de Sintra!**

---

## 📅 Data e Localização

- **Data**: 1 de Março de 2026 (Domingo)
- **Local**: Terrugem, Sintra
- **Região**: Concelho de Sintra, Grande Lisboa
- **Organização**: ABIT - Associação Recreativa de Bicicletas de Terrugem

## 🏃 Provas Disponíveis

### Trail Longo - 25 km
- **Distância**: 25 km (aproximada)
- **Hora de Partida**: 09h00
- **Idade Mínima**: 18 anos (Juniores)
- **Desnível**: Trilhos técnicos e exigentes
- **Carácter**: Competitivo
- **Circuitos**: Circuito Longo do CTF (Circuito de Trail das Freguesias)
- **Recomendação**: Atletas experientes

### Trail Curto - 17 km
- **Distância**: 17 km (aproximada)
- **Hora de Partida**: 09h10
- **Idade Mínima**: 18 anos (Juniores)
- **Desnível**: Exigente a vários níveis
- **Carácter**: Competitivo
- **Circuitos**: 
  - Circuito Curto do CTF (Circuito de Trail das Freguesias)
  - Circuito Curto da AAL (Circuito de Trail de Lisboa)
- **Recomendação**: Avaliação cuidada da condição física

### Mini Trail - 12 km
- **Distância**: 12 km (aproximada)
- **Hora de Partida**: 09h20
- **Idade Mínima**: 14 anos (Iniciados)
- **Desnível**: Desafiante mas acessível
- **Carácter**: Competitivo
- **Circuitos**: Circuito Curto da AAL (Circuito de Trail de Lisboa)
- **Recomendação**: Ideal para iniciantes ou velocistas

### Caminhada - 12 km
- **Distância**: 12 km (aproximada)
- **Hora de Partida**: 09h20
- **Idade**: Todas as idades
- **Carácter**: Não competitivo
- **Objetivo**: Promoção de hábitos de vida saudáveis

## 🎯 Destaques

✅ **9ª Edição** do Terrugem Trail em Sintra! 🏔️  
✅ **4 provas** para todos os níveis (25K, 17K, 12K, Caminhada 12K)  
✅ **Integração em circuitos**: CTF e AAL (Lisboa)  
✅ **Trilhos únicos** de Terrugem e Sintra  
✅ **T-shirt técnica** opcional  
✅ **Lembrança finisher** para todos os participantes  
✅ **Banhos** incluídos no preço  
✅ **Chip de cronometragem** integrado (provas competitivas)  
✅ **Prémios** para classificação geral e escalões  
✅ **Prémio equipa** mais numerosa  

## 📖 Sobre o Evento

O **9º Terrugem Trail** tem como objetivo proporcionar aos atletas **novas experiências e sensações em trilhos distintos**, valorização e divulgação do território e promoção da nossa região.

Este evento é organizado pela **ABIT - Associação Recreativa de Bicicletas de Terrugem** e integra importantes circuitos regionais:

- **Circuito de Trail das Freguesias (CTF)**: Trail Longo e Trail Curto
- **Circuito de Trail de Lisboa (AAL)**: Trail Curto e Mini Trail

### Características dos Percursos:

**Trail Longo 25 km**:
- Corrida pedestre em natureza
- Percorre trilhos, caminhos agrícolas e florestais
- Linhas de água da freguesia
- Carácter competitivo com classificações e prémios
- Adequada a atletas experientes
- Condicionantes técnicas, altimétricas e de quilometragem

**Trail Curto 17 km**:
- Corrida pedestre em natureza
- Trilhos, caminhos agrícolas e florestais
- Linhas de água da freguesia
- Elevado grau de exigência a vários níveis
- Necessária avaliação cuidada da condição física e mental

**Mini Trail 12 km**:
- Corrida pedestre em natureza
- Trilhos e caminhos rurais
- Zonas de grande beleza natural da freguesia
- Excelente oportunidade para iniciantes
- Experimentar Trail Running em segurança
- Percurso desafiante mas acessível
- Indicada para atletas menos experientes ou velocistas

**Caminhada 12 km**:
- Promoção de hábitos de vida saudáveis
- Percurso acessível e não competitivo
- Para todas as idades

## 💰 Preçário e Fases de Inscrição

### Trail Longo 25 km
- **1ª Fase** (até 08 Fevereiro): 17€
- **2ª Fase** (09-22 Fevereiro): 19€

### Trail Curto 17 km
- **1ª Fase** (até 08 Fevereiro): 15€
- **2ª Fase** (09-22 Fevereiro): 17€

### Mini Trail 12 km
- **1ª Fase** (até 08 Fevereiro): 12€
- **2ª Fase** (09-22 Fevereiro): 14€

### Caminhada 12 km
- **1ª Fase** (até 08 Fevereiro): 10€
- **2ª Fase** (09-22 Fevereiro): 11€

### Notas Importantes:
- Período de inscrições: Até **22 de Fevereiro de 2026**
- 1ª Fase: Até 08 de Fevereiro de 2026
- 2ª Fase: 09 a 22 de Fevereiro de 2026
- Alteração de distância superior para inferior: **sem devolução do diferencial**
- Após fecho das inscrições: **não são permitidas alterações**

## 📋 Material Incluído na Inscrição

✅ **Seguro** de Acidentes Pessoais e Responsabilidade Civil  
✅ **Banhos** no final da prova  
✅ **Dorsal personalizado**  
✅ **Chip integrado** ou similar (Trail Longo, Curto e Mini Trail)  
✅ **Avitalhamentos** líquidos e sólidos no percurso  
✅ **Reforço alimentar** na chegada  
✅ **Lembrança finisher** oficial do evento  
✅ **T-shirt técnica** alusiva ao evento (opcional)  

## 🎽 Material Obrigatório

O material obrigatório pode ser solicitado e verificado a **qualquer momento do percurso** por um elemento da organização. O não cumprimento pode resultar em **desclassificação**.

### Trail Longo 25 km:
- **Telemóvel** com bateria carregada
- **Água/Reservatório** mínimo de 0,5L
- **Apito** de emergência
- **Manta térmica**
- **Copo reutilizável** (obrigatório em todos os postos)

### Trail Curto 17 km:
- **Telemóvel** com bateria carregada
- **Água/Reservatório** mínimo de 0,5L
- **Copo reutilizável** (obrigatório em todos os postos)

### Mini Trail 12 km:
- **Copo reutilizável** (obrigatório em todos os postos)

### Material Recomendado:
- Vestuário adequado à prática da modalidade
- Cópia do documento de identificação
- Verificação do material antes da prova
- Equipamento em perfeitas condições

## 🎫 Inscrições

**Estatísticas Atuais**:
- **Limite de Inscrições**: 520 atletas
- **Total de Inscrições**: 532
- **Inscrições Confirmadas**: 495
- **Vagas Restantes**: 25

### Distribuição por Prova:
- Trail Longo 25K: 75 atletas
- Trail Curto 17K: 159 atletas
- Mini Trail 12K: 160 atletas
- Caminhada 12K: 101 participantes

## 👥 Escalões Etários

Os escalões são definidos por faixa etária:

### Masculinos:
- **M Iniciado**: 14-15 anos (até 12 km - apenas Mini Trail)
- **M Juvenil**: 16-17 anos (até 12 km - apenas Mini Trail)
- **M Júnior**: 18-19 anos (até 25 km)
- **M Sub-23**: 20-22 anos
- **M Seniores**: 23-34 anos
- **M35**: 35-39 anos
- **M40**: 40-44 anos
- **M45**: 45-49 anos
- **M50**: 50-54 anos
- **M55**: 55-59 anos
- **M60**: 60-64 anos
- **M65**: 65-69 anos
- **M70**: mais de 70 anos

### Femininos:
- **F Iniciada**: 14-15 anos (até 12 km - apenas Mini Trail)
- **F Juvenil**: 16-17 anos (até 12 km - apenas Mini Trail)
- **F Júnior**: 18-19 anos (até 25 km)
- **F Sub-23**: 20-22 anos
- **F Seniores**: 23-34 anos
- **F35**: 35-39 anos
- **F40**: 40-44 anos
- **F45**: 45-49 anos
- **F50**: 50-54 anos
- **F55**: 55-59 anos
- **F60**: 60-64 anos
- **F65**: 65-69 anos
- **F70**: mais de 70 anos

## 🏆 Prémios

### Prémios Individuais

**Classificação Geral**:
- Prémios para os primeiros classificados (Masculino e Feminino)
- Trail Longo, Trail Curto e Mini Trail

**Escalões Etários**:
- Prémios para os primeiros classificados de cada escalão (M/F)

### Prémios Coletivos:
- **Equipa Mais Numerosa**: Prémio especial

### Condições de Premiação:
- Obrigatória a **passagem em todos os postos de controlo**
- Cortar a **linha de meta dentro do tempo estipulado**
- **Presença obrigatória** na cerimónia de entrega de prémios
- A Organização **não envia prémios** por correio

## ⏰ Programa do Evento

### Sábado, 28 de Fevereiro de 2026
- **16h30** - Abertura do Secretariado na sede da ABIT
- **18h30** - Encerramento do Secretariado

### Domingo, 1 de Março de 2026
- **07h00** - Abertura do Secretariado
- **08h30** - Abertura do Controlo 0
- **08h45** - Briefing Geral
- **09h00** - **Partida Trail Longo 25 km**
- **09h10** - **Partida Trail Curto 17 km**
- **09h20** - **Partida Mini Trail 12 km e Caminhada 12 km**
- **13h00*** - Início da Cerimónia de Entrega de Prémios

*Horário aproximado

## 🏞️ Sobre Terrugem e Sintra

**Terrugem** é uma localidade pertencente ao concelho de **Sintra**, conhecido por:

- Paisagens naturais de grande beleza
- Trilhos e caminhos rurais preservados
- Proximidade à Serra de Sintra
- Património natural e cultural único
- Comunidade ativa e desportiva

O evento valoriza e divulga o território, promovendo a região através do desporto e contacto com a natureza.

## 📞 Contactos da Organização

**ABIT - Associação Recreativa de Bicicletas de Terrugem**  
**Plataforma**: Recorde Pessoal  
**Email**: geral@recordepessoal.pt  
**Telemóvel**: +351 914 335 363  
**Morada**: Rua do Sítio, lote 39, 2445-332 Pataias

**Website**: https://recordepessoal.pt

---

*Viva novas experiências em trilhos distintos de Terrugem e Sintra!* 🏃🏔️`,
      city: "Terrugem, Sintra",
      metaTitle: "9º Terrugem Trail 2026 | Terrugem, Sintra | 1 Março",
      metaDescription:
        "9º Terrugem Trail 2026 no dia 1 de março em Terrugem, Sintra. Provas: Trail Longo 25K, Trail Curto 17K, Mini Trail 12K e Caminhada 12K. Circuitos CTF e AAL. T-shirt e lembrança finisher incluídas.",
    },
    en: {
      title: "9th Terrugem Trail 2026",
      description: `# 🏃 9th Terrugem Trail 2026

**Experience new sensations on distinct trails of Sintra!**

---

## 📅 Date and Location

- **Date**: March 1, 2026 (Sunday)
- **Location**: Terrugem, Sintra
- **Region**: Sintra Municipality, Greater Lisbon
- **Organization**: ABIT - Terrugem Bicycle Recreation Association

## 🏃 Available Races

### Long Trail - 25 km
- **Distance**: 25 km (approximate)
- **Start Time**: 09:00
- **Minimum Age**: 18 years (Juniors)
- **Elevation**: Technical and demanding trails
- **Character**: Competitive
- **Circuits**: CTF Long Circuit (Parish Trail Circuit)
- **Recommendation**: Experienced athletes

### Short Trail - 17 km
- **Distance**: 17 km (approximate)
- **Start Time**: 09:10
- **Minimum Age**: 18 years (Juniors)
- **Elevation**: Demanding at various levels
- **Character**: Competitive
- **Circuits**: 
  - CTF Short Circuit (Parish Trail Circuit)
  - AAL Short Circuit (Lisbon Trail Circuit)
- **Recommendation**: Careful physical condition assessment

### Mini Trail - 12 km
- **Distance**: 12 km (approximate)
- **Start Time**: 09:20
- **Minimum Age**: 14 years (Beginners)
- **Elevation**: Challenging but accessible
- **Character**: Competitive
- **Circuits**: AAL Short Circuit (Lisbon Trail Circuit)
- **Recommendation**: Ideal for beginners or sprinters

### Walk - 12 km
- **Distance**: 12 km (approximate)
- **Start Time**: 09:20
- **Age**: All ages
- **Character**: Non-competitive
- **Objective**: Promotion of healthy lifestyles

## 🎯 Highlights

✅ **9th Edition** of Terrugem Trail in Sintra! 🏔️  
✅ **4 races** for all levels (25K, 17K, 12K, Walk 12K)  
✅ **Circuit integration**: CTF and AAL (Lisbon)  
✅ **Unique trails** of Terrugem and Sintra  
✅ **Technical t-shirt** (optional)  
✅ **Finisher souvenir** for all participants  
✅ **Showers** included in price  
✅ **Integrated timing chip** (competitive races)  
✅ **Awards** for overall and age categories  
✅ **Team award** for largest team  

## 💰 Pricing and Registration Phases

### Long Trail 25 km
- **1st Phase** (until Feb 08): €17
- **2nd Phase** (Feb 09-22): €19

### Short Trail 17 km
- **1st Phase** (until Feb 08): €15
- **2nd Phase** (Feb 09-22): €17

### Mini Trail 12 km
- **1st Phase** (until Feb 08): €12
- **2nd Phase** (Feb 09-22): €14

### Walk 12 km
- **1st Phase** (until Feb 08): €10
- **2nd Phase** (Feb 09-22): €11

## 🎫 Registration

**Current Statistics**:
- **Registration Limit**: 520 athletes
- **Total Registrations**: 532
- **Confirmed Registrations**: 495
- **Remaining Spots**: 25

## 📞 Organization Contact

**ABIT - Terrugem Bicycle Recreation Association**  
**Platform**: Recorde Pessoal  
**Email**: geral@recordepessoal.pt  
**Mobile**: +351 914 335 363  

---

*Experience new sensations on distinct trails of Terrugem and Sintra!* 🏃🏔️`,
      city: "Terrugem, Sintra",
      metaTitle: "9th Terrugem Trail 2026 | Terrugem, Sintra | March 1",
      metaDescription:
        "9th Terrugem Trail 2026 on March 1 in Terrugem, Sintra. Races: Long Trail 25K, Short Trail 17K, Mini Trail 12K and Walk 12K. CTF and AAL circuits. T-shirt and finisher souvenir included.",
    },
    es: {
      title: "9º Terrugem Trail 2026",
      description: `# 🏃 9º Terrugem Trail 2026

**¡Vive nuevas experiencias en senderos distintos de Sintra!**

---

## 📅 Fecha y Ubicación

- **Fecha**: 1 de Marzo de 2026 (Domingo)
- **Ubicación**: Terrugem, Sintra
- **Región**: Municipio de Sintra, Gran Lisboa
- **Organización**: ABIT - Asociación Recreativa de Bicicletas de Terrugem

## 🏃 Carreras Disponibles

### Trail Largo - 25 km
- **Distancia**: 25 km (aproximada)
- **Hora de Salida**: 09:00
- **Edad Mínima**: 18 años (Juniors)

### Trail Corto - 17 km
- **Distancia**: 17 km (aproximada)
- **Hora de Salida**: 09:10
- **Edad Mínima**: 18 años (Juniors)

### Mini Trail - 12 km
- **Distancia**: 12 km (aproximada)
- **Hora de Salida**: 09:20
- **Edad Mínima**: 14 años (Iniciados)

### Caminata - 12 km
- **Distancia**: 12 km (aproximada)
- **Hora de Salida**: 09:20
- **Edad**: Todas las edades

## 📞 Contacto de la Organización

**Email**: geral@recordepessoal.pt  
**Móvil**: +351 914 335 363

---

*¡Vive nuevas experiencias en senderos distintos de Terrugem y Sintra!* 🏃🏔️`,
      city: "Terrugem, Sintra",
      metaTitle: "9º Terrugem Trail 2026 | Terrugem, Sintra | 1 Marzo",
      metaDescription:
        "9º Terrugem Trail 2026 el 1 de marzo en Terrugem, Sintra. Carreras: Trail Largo 25K, Trail Corto 17K, Mini Trail 12K y Caminata 12K. Circuitos CTF y AAL. Camiseta y recuerdo finisher incluidos.",
    },
    fr: {
      title: "9e Terrugem Trail 2026",
      description: `# 🏃 9e Terrugem Trail 2026

**Vivez de nouvelles expériences sur les sentiers distincts de Sintra !**

---

## 📅 Date et Lieu

- **Date** : 1er Mars 2026 (Dimanche)
- **Lieu** : Terrugem, Sintra
- **Région** : Municipalité de Sintra, Grand Lisbonne
- **Organisation** : ABIT - Association Récréative de Vélos de Terrugem

## 🏃 Courses Disponibles

### Trail Long - 25 km
- **Distance** : 25 km (approximative)
- **Heure de Départ** : 09h00
- **Âge Minimum** : 18 ans (Juniors)

### Trail Court - 17 km
- **Distance** : 17 km (approximative)
- **Heure de Départ** : 09h10
- **Âge Minimum** : 18 ans (Juniors)

### Mini Trail - 12 km
- **Distance** : 12 km (approximative)
- **Heure de Départ** : 09h20
- **Âge Minimum** : 14 ans (Débutants)

### Marche - 12 km
- **Distance** : 12 km (approximative)
- **Heure de Départ** : 09h20
- **Âge** : Tous âges

## 📞 Contact de l'Organisation

**Email** : geral@recordepessoal.pt  
**Mobile** : +351 914 335 363

---

*Vivez de nouvelles expériences sur les sentiers distincts de Terrugem et Sintra !* 🏃🏔️`,
      city: "Terrugem, Sintra",
      metaTitle: "9e Terrugem Trail 2026 | Terrugem, Sintra | 1er Mars",
      metaDescription:
        "9e Terrugem Trail 2026 le 1er mars à Terrugem, Sintra. Courses : Trail Long 25K, Trail Court 17K, Mini Trail 12K et Marche 12K. Circuits CTF et AAL. T-shirt et souvenir finisher inclus.",
    },
    de: {
      title: "9. Terrugem Trail 2026",
      description: `# 🏃 9. Terrugem Trail 2026

**Erleben Sie neue Erfahrungen auf den unterschiedlichen Wegen von Sintra!**

---

## 📅 Datum und Ort

- **Datum**: 1. März 2026 (Sonntag)
- **Ort**: Terrugem, Sintra
- **Region**: Gemeinde Sintra, Großraum Lissabon
- **Organisation**: ABIT - Fahrrad-Freizeitverein Terrugem

## 🏃 Verfügbare Läufe

### Langer Trail - 25 km
- **Distanz**: 25 km (ungefähr)
- **Startzeit**: 09:00
- **Mindestalter**: 18 Jahre (Junioren)

### Kurzer Trail - 17 km
- **Distanz**: 17 km (ungefähr)
- **Startzeit**: 09:10
- **Mindestalter**: 18 Jahre (Junioren)

### Mini Trail - 12 km
- **Distanz**: 12 km (ungefähr)
- **Startzeit**: 09:20
- **Mindestalter**: 14 Jahre (Anfänger)

### Wanderung - 12 km
- **Distanz**: 12 km (ungefähr)
- **Startzeit**: 09:20
- **Alter**: Alle Altersgruppen

## 📞 Kontakt der Organisation

**E-Mail**: geral@recordepessoal.pt  
**Mobil**: +351 914 335 363

---

*Erleben Sie neue Erfahrungen auf den unterschiedlichen Wegen von Terrugem und Sintra!* 🏃🏔️`,
      city: "Terrugem, Sintra",
      metaTitle: "9. Terrugem Trail 2026 | Terrugem, Sintra | 1. März",
      metaDescription:
        "9. Terrugem Trail 2026 am 1. März in Terrugem, Sintra. Läufe: Langer Trail 25K, Kurzer Trail 17K, Mini Trail 12K und Wanderung 12K. CTF- und AAL-Circuits. T-Shirt und Finisher-Andenken inklusive.",
    },
    it: {
      title: "9º Terrugem Trail 2026",
      description: `# 🏃 9º Terrugem Trail 2026

**Vivi nuove esperienze sui sentieri distinti di Sintra!**

---

## 📅 Data e Luogo

- **Data**: 1 Marzo 2026 (Domenica)
- **Luogo**: Terrugem, Sintra
- **Regione**: Comune di Sintra, Grande Lisbona
- **Organizzazione**: ABIT - Associazione Ricreativa Biciclette di Terrugem

## 🏃 Gare Disponibili

### Trail Lungo - 25 km
- **Distanza**: 25 km (approssimativa)
- **Ora di Partenza**: 09:00
- **Età Minima**: 18 anni (Junior)

### Trail Corto - 17 km
- **Distanza**: 17 km (approssimativa)
- **Ora di Partenza**: 09:10
- **Età Minima**: 18 anni (Junior)

### Mini Trail - 12 km
- **Distanza**: 12 km (approssimativa)
- **Ora di Partenza**: 09:20
- **Età Minima**: 14 anni (Principianti)

### Camminata - 12 km
- **Distanza**: 12 km (approssimativa)
- **Ora di Partenza**: 09:20
- **Età**: Tutte le età

## 📞 Contatto dell'Organizzazione

**Email**: geral@recordepessoal.pt  
**Mobile**: +351 914 335 363

---

*Vivi nuove esperienze sui sentieri distinti di Terrugem e Sintra!* 🏃🏔️`,
      city: "Terrugem, Sintra",
      metaTitle: "9º Terrugem Trail 2026 | Terrugem, Sintra | 1 Marzo",
      metaDescription:
        "9º Terrugem Trail 2026 il 1 marzo a Terrugem, Sintra. Gare: Trail Lungo 25K, Trail Corto 17K, Mini Trail 12K e Camminata 12K. Circuiti CTF e AAL. Maglietta e ricordo finisher inclusi.",
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
      name: "Trail Longo 25 km",
      distanceKm: 25,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-03-01T09:00:00Z"),
      startTime: "09:00",
      cutoffTimeHours: null,
      price: 19,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Trilhos, caminhos agrícolas e florestais, linhas de água · Dificuldade: Alta - Atletas experientes · Idade mínima: 18 anos (Juniores M/F) · Circuito Longo do CTF · Equipamento obrigatório: Telemóvel carregado, Água mín. 0,5L, Apito, Manta térmica, Copo reutilizável · Inclui: Seguro, Banhos, Dorsal, Chip, Avitalhamentos, Lembrança finisher",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 17,
          currency: Currency.EUR,
          note: "1ª Fase (até 08 Fevereiro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-02-09T00:00:00Z"),
          endDate: new Date("2026-02-22T23:59:59Z"),
          price: 19,
          currency: Currency.EUR,
          note: "2ª Fase Final (09-22 Fevereiro)",
        },
      ],
    },
    {
      name: "Trail Curto 17 km",
      distanceKm: 17,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-03-01T09:10:00Z"),
      startTime: "09:10",
      cutoffTimeHours: null,
      price: 17,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Trilhos, caminhos agrícolas e florestais, linhas de água · Dificuldade: Média/Alta · Idade mínima: 18 anos (Juniores M/F) · Circuito Curto do CTF · Circuito Curto da AAL · Equipamento obrigatório: Telemóvel carregado, Água mín. 0,5L, Copo reutilizável · Inclui: Seguro, Banhos, Dorsal, Chip, Avitalhamentos, Lembrança finisher",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 15,
          currency: Currency.EUR,
          note: "1ª Fase (até 08 Fevereiro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-02-09T00:00:00Z"),
          endDate: new Date("2026-02-22T23:59:59Z"),
          price: 17,
          currency: Currency.EUR,
          note: "2ª Fase Final (09-22 Fevereiro)",
        },
      ],
    },
    {
      name: "Mini Trail 12 km",
      distanceKm: 12,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-03-01T09:20:00Z"),
      startTime: "09:20",
      cutoffTimeHours: null,
      price: 14,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Trilhos, caminhos rurais, zonas de grande beleza natural · Dificuldade: Média - Desafiante mas acessível · Idade mínima: 14 anos · Circuito Curto da AAL · Ideal para iniciantes no Trail Running · Equipamento obrigatório: Copo reutilizável · Inclui: Seguro, Banhos, Dorsal, Chip, Avitalhamentos, Lembrança finisher",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 12,
          currency: Currency.EUR,
          note: "1ª Fase (até 08 Fevereiro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-02-09T00:00:00Z"),
          endDate: new Date("2026-02-22T23:59:59Z"),
          price: 14,
          currency: Currency.EUR,
          note: "2ª Fase Final (09-22 Fevereiro)",
        },
      ],
    },
    {
      name: "Caminhada 12 km",
      distanceKm: 12,
      elevationGainM: null,
      elevationLossM: null,
      startDate: new Date("2026-03-01T09:20:00Z"),
      startTime: "09:20",
      cutoffTimeHours: null,
      price: 11,
      currency: Currency.EUR,
      maxParticipants: null,
      atrpGrade: null,
      itraPoints: null,
      description:
        "Superfície: Caminhos acessíveis · Não competitivo · Sem cronometragem · Todas as idades · Promoção de hábitos de vida saudáveis · Inclui: Seguro, Banhos, Dorsal, Avitalhamentos, Lembrança finisher",
      pricingPhases: [
        {
          name: "1ª Fase",
          startDate: new Date("2026-01-01T00:00:00Z"),
          endDate: new Date("2026-02-08T23:59:59Z"),
          price: 10,
          currency: Currency.EUR,
          note: "1ª Fase (até 08 Fevereiro)",
        },
        {
          name: "2ª Fase",
          startDate: new Date("2026-02-09T00:00:00Z"),
          endDate: new Date("2026-02-22T23:59:59Z"),
          price: 11,
          currency: Currency.EUR,
          note: "2ª Fase Final (09-22 Fevereiro)",
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

    console.log(`   - Created ${pricingPhases.length} pricing phase(s)`);
  }

  console.log("✅ Seed completed successfully!");
  console.log(`
📊 Summary:
- Event: 9º Terrugem Trail 2026
- Variants: 4 (Trail Longo 25K, Trail Curto 17K, Mini Trail 12K, Caminhada 12K)
- Languages: 6 (pt, en, es, fr, de, it)
- Pricing Phases: 8 total (2 phases per variant)
- Date: March 1, 2026
- Location: Terrugem, Sintra
- Circuits: CTF (Trail das Freguesias) + AAL (Trail de Lisboa)
- Registration Limit: 520 athletes (532 registered, 495 confirmed!)
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
