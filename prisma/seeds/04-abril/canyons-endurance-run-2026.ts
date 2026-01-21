/**
 * Seed The Canyons Endurance Run by UTMB 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏔️ Seeding The Canyons Endurance Run by UTMB 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "canyons-endurance-run-2026" },
    update: {
      title: "The Canyons Endurance Run by UTMB",
      description: `# 🏔️ The Canyons Endurance Run by UTMB 2026

**The Canyons Endurance Run by UTMB** é uma das provas de trail running mais icónicas dos Estados Unidos, parte da prestigiada série **UTMB World Series**. O evento decorre nas históricas trilhas da região de **Auburn, Califórnia**, incluindo o lendário **Western States Trail**.

![Canyons Endurance Run - Auburn Trail](https://utmbworld.com/sites/default/files/styles/event_image/public/2024-03/canyons-hero.jpg)

## 📍 Localização e Percurso

**Local:** Auburn, Califórnia (Estados Unidos)
**Trilho Principal:** Western States Trail & North Fork American River

A região de Auburn é conhecida como a **"Capital Mundial da Resistência"** e oferece alguns dos percursos de trail running mais desafiantes e célebres do mundo. Os participantes correm por:

- 🌲 **Western States Trail** - O trilho histórico usado pela lendária Western States 100
- 🏞️ **North Fork American River** - Vistas espetaculares dos canyons
- 🌉 **No Hands Bridge** - Ponte histórica icónica
- ⛰️ **China Wall Trail** - Início das provas de 100M e 100K
- 🏛️ **Auburn Historic Downtown** - Meta de todas as provas

### 🎯 4 Provas Disponíveis

O evento oferece distâncias para todos os níveis de corredores de trail:

#### 🥇 100 Miles (161 km)
- **Distância:** 100 milhas (~161 km)
- **Desnível Positivo:** 18.208 ft (~5.550m)
- **Partida:** Sexta, 24 de Abril às 12:00 (China Wall Trailhead)
- **Meta:** Auburn Downtown
- **Limite de Tempo:** 35 horas
- **Running Stones UTMB:** 4 pedras
- **Qualificação:** Western States 100 + UTMB World Series

#### 🥈 100 Kilometers (100K)
- **Distância:** 62.1 milhas (~100 km)
- **Desnível Positivo:** 12.303 ft (~3.750m)
- **Partida:** Sábado, 25 de Abril às 05:00 (China Wall Trailhead)
- **Meta:** Auburn Downtown
- **Limite de Tempo:** 20h (WS100 qualifier), 21h (UTMB stones)
- **Running Stones UTMB:** 3 pedras
- **Qualificação:** Western States 100 + UTMB World Series

#### 🥉 50 Kilometers (50K)
- **Distância:** 31 milhas (~50 km)
- **Desnível Positivo:** 5.577 ft (~1.700m)
- **Partida:** Sábado, 25 de Abril às 07:00 (Auburn Downtown)
- **Meta:** Auburn Downtown
- **Limite de Tempo:** 10 horas
- **Running Stones UTMB:** 2 pedras

#### 🏅 25 Kilometers (25K)
- **Distância:** 15.5 milhas (~25 km)
- **Desnível Positivo:** 2.788 ft (~850m)
- **Partida:** Sexta, 24 de Abril às 16:00 (Auburn Downtown)
- **Meta:** Auburn Downtown
- **Limite de Tempo:** 5 horas
- **Running Stones UTMB:** 1 pedra

## 🎽 Equipamento Obrigatório

### 100 Miles
- 2x Lanternas frontais (200+ lumens recomendado) com baterias extra
- Mochila de trail running
- Telemóvel com roaming nos EUA
- Copo dobrável (150ml mínimo)
- Reserva de água (1 litro mínimo)
- Reserva de comida (800 kcal)
- Casaco impermeável com capuz
- Gorro/chapéu

### 100K
- 1x Lanterna frontal (200+ lumens) com baterias extra
- Mochila de trail running
- Telemóvel com roaming nos EUA
- Copo dobrável (150ml mínimo)
- Reserva de água (1 litro mínimo)
- Reserva de comida (800 kcal)
- Casaco impermeável com capuz
- Gorro/chapéu

### 50K e 25K
- Telemóvel com roaming nos EUA
- Copo dobrável (150ml mínimo)
- Reserva de água (1 litro mínimo para 50K, 0.5L para 25K)
- Reserva de comida (recomendado)

**Nota:** Kits de tempo quente/frio podem ser exigidos pela organização dependendo das condições meteorológicas.

## 🎫 Pacers e Assistência

### 100 Miles
- ✅ **Pacers permitidos** a partir de Cool - 1 (Milha 62.9) ou Cool - 2 (Milha 75.1)
- 1 pacer de cada vez até à meta
- Pacer deve ter +18 anos e assinar termo de responsabilidade
- Pacer deve levar equipamento obrigatório

### 100K, 50K, 25K
- ❌ **Pacers NÃO permitidos**

### Pontos de Assistência (Crewing)

**100 Miles:**
- Michigan Bluff (Milha 24.0)
- Foresthill (Milha 30.0)
- Drivers Flat (Milha 47.5)
- Cool 1 & 2 (Milha 62.9 & 75.1)

**100K:**
- Michigan Bluff (Milha 24.0)
- Foresthill (Milha 30.0)
- Drivers Flat (Milha 47.5)

**50K e 25K:**
- Sem assistência permitida em qualquer ponto

## 🏁 Postos de Abastecimento

### 100 Miles - 20 Postos
Postos completos com água, bebidas eletrolíticas, géis, comida (postos noturnos com comida quente).

**Principais Checkpoints:**
- Deadwood 1 & 2 (Milha 10.1 & 18.3)
- Devils Thumb 1 & 2 (Milha 12.0 & 15.1)
- Swinging Bridge Turnaround (Milha 13.5)
- Michigan Bluff (Milha 24.0) - Cut-off: 19:45
- Foresthill (Milha 30.0) - Cut-off: 21:30
- Cal 2 (Milha 38.2)
- Drivers Flat (Milha 47.5) - Cut-off: 03:00
- Mammoth Bar (Milha 55.5) - Cut-off: 05:30
- No Hands 1 & 2 (Milha 59.9 & 98.3)
- Cool 1 (Milha 62.9) - Cut-off: 08:00
- Coffer Dam 1 & 2 (Milha 64.6 & 69.1)
- Cool 2 (Milha 75.1) - Cut-off: 12:00
- Browns Bar 1 & 2 (Milha 79.2 & 92.3)
- ALT (Milha 84.7) - Cut-off: 15:30

### 100K - 12 Postos
Postos completos com hidratação, alimentação e assistência médica.

**Principais Checkpoints:**
- Deadwood 1 & 2 (Milha 10.7 & 15.2)
- Devils Thumb 1 & 2 (Milha 11.5 & 14.8)
- Michigan Bluff (Milha 23.8) - Cut-off: 12:45
- Foresthill (Milha 29.8) - Cut-off: 14:30
- Cal 2 (Milha 38.0)
- Drivers Flat (Milha 47.3) - Cut-off: 19:45
- Mammoth Bar (Milha 55.4) - Cut-off: 22:15

### 50K - 5 Postos
- Confluence 1 & 2 (Milha 4.0 & 27.2)
- Clementine (Milha 7.2)
- Drivers Flat (Milha 15.6)
- Mammoth Bar (Milha 23.5)

### 25K - 2 Postos
- No Hands 1 & 2 (Milha 3.5 & 12.0)
- Cool 1 & 2 (Milha 6.5 & 8.6)

## 🎽 O Que Está Incluído

### Todas as Provas
✅ Dorsal com chip de cronometragem
✅ Rastreamento GPS ao vivo (LiveTrail)
✅ Postos de abastecimento completos
✅ Assistência médica em todos os postos
✅ Transporte para partida (100M/100K)
✅ Hidratação e alimentação na meta

### Prémios de Finisher

**100 Miles:**
- 🏆 Fivela de cinto personalizada (finishers)
- 🥇 Troféu personalizado (Top 3 M/F)

**100K:**
- 🏆 Cinto personalizado (finishers)
- 🥇 Troféu personalizado (Top 3 M/F)
- 🎟️ **Golden Ticket para Western States 100** (Top 2 M/F)

**50K:**
- 🏅 Medalha de finisher
- 🥇 Troféu personalizado (Top 3 M/F)

**25K:**
- 🏅 Medalha de finisher
- 🥇 Troféu personalizado (Top 3 M/F)

## 📋 Regras Importantes

### Semi-Autonomia
- Cada corredor deve ser auto-suficiente entre postos
- Proibido ser acompanhado fora das zonas designadas
- Não é permitido "muling" (pacer carregar equipamento do corredor)
- Animais não são permitidos (incluindo cães de serviço)

### Cortes de Tempo
- Cortes intermédios serão rigorosamente aplicados
- Corredores devem **sair** dos postos antes do cut-off
- Impossível sair de um posto atrás dos sweepers
- Consultar tabela completa de cut-offs no site oficial

### Segurança
- Permanecer sempre no percurso marcado
- Se perdido, não sair do trilho - aguardar ajuda
- Avisar próximo posto em caso de ver corredor ferido
- Tratamento por soro intravenoso = desqualificação automática
- Hospital disponível em Auburn para emergências

### Drop Bags
**100M:** Foresthill (Milha 30.0), Cool 1 & 2 (Milha 62.9 & 75.1)
**100K:** Foresthill (Milha 30.0)
**50K/25K:** Não permitido

- Dimensões máximas: 8"x10"x16"
- Identificar com nome completo, dorsal e posto de destino

## 🏆 Destaques do Evento

- 🌍 **UTMB World Series** - Prova oficial da série mundial
- 🏔️ **Western States Trail** - Trilho histórico lendário
- 🎫 **Golden Tickets** - Top 2 do 100K ganham vaga na Western States 100
- 🥇 **Qualificação UTMB** - Running Stones para UTMB Mont-Blanc
- 🏛️ **Auburn** - "Capital Mundial da Resistência"
- 👥 Evento com 4 distâncias para todos os níveis
- 📱 **LiveTrail** - Tracking GPS ao vivo de todos os corredores
- 🎪 **Expo** em Auburn com levantamento de dorsais e briefings

## 📅 Programa

**23-25 de Abril:**
- Expo em Auburn (ExCeL Center)
- Levantamento de dorsais e kits
- Briefings pré-prova
- Drop Bag drop-off

**24 de Abril (Sexta):**
- 12:00 - Partida 100 Miles (China Wall)
- 16:00 - Partida 25K (Auburn Downtown)

**25 de Abril (Sábado):**
- 05:00 - Partida 100K (China Wall)
- 07:00 - Partida 50K (Auburn Downtown)

## 🌐 Informações Oficiais

- **Website:** [canyons.utmb.world](https://canyons.utmb.world)
- **Regulamento Completo:** Disponível no site oficial
- **GPX Files:** Download disponível para todas as distâncias
- **Aid Station Chart:** Tabela completa de postos e cut-offs

## 🎯 Perfil do Corredor

### 100 Miles
Para corredores experientes em ultras longas, confortáveis com corridas noturnas (24h+), auto-suficientes e com experiência em terreno técnico de montanha.

### 100K
Para corredores com experiência em ultras, capazes de gerir esforço prolongado e corrida noturna. Ideal como preparação para 100 milhas.

### 50K
Para corredores de trail com experiência em longas distâncias. Percurso técnico mas acessível, ideal para primeira ultra ou qualificação UTMB.

### 25K
Para corredores a iniciar-se em trail running ou a procurar uma prova rápida e técnica. Percurso cénico e desafiante.

---

**Boa sorte e boas corridas! 🏔️🏃‍♂️**`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-04-24T20:00:00Z"), // 12:00 PT = 20:00 UTC (100M start)
      endDate: new Date("2026-04-25T15:00:00Z"), // Last start (50K at 07:00 PT = 15:00 UTC)
      city: "Auburn",
      country: "Estados Unidos",
      latitude: 38.8969,
      longitude: -121.0766,
      googleMapsUrl: "https://www.google.com/maps?q=Auburn,CA,USA",
      externalUrl: "https://canyons.utmb.world",
      imageUrl:
        "https://utmbworld.com/sites/default/files/styles/event_image/public/2024-03/canyons-hero.jpg",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-18T07:59:59Z"),
    },
    create: {
      title: "The Canyons Endurance Run by UTMB",
      slug: "canyons-endurance-run-2026",
      description: `# 🏔️ The Canyons Endurance Run by UTMB 2026

**The Canyons Endurance Run by UTMB** é uma das provas de trail running mais icónicas dos Estados Unidos, parte da prestigiada série **UTMB World Series**. O evento decorre nas históricas trilhas da região de **Auburn, Califórnia**, incluindo o lendário **Western States Trail**.

![Canyons Endurance Run - Auburn Trail](https://utmbworld.com/sites/default/files/styles/event_image/public/2024-03/canyons-hero.jpg)

## 📍 Localização e Percurso

**Local:** Auburn, Califórnia (Estados Unidos)
**Trilho Principal:** Western States Trail & North Fork American River

A região de Auburn é conhecida como a **"Capital Mundial da Resistência"** e oferece alguns dos percursos de trail running mais desafiantes e célebres do mundo. Os participantes correm por:

- 🌲 **Western States Trail** - O trilho histórico usado pela lendária Western States 100
- 🏞️ **North Fork American River** - Vistas espetaculares dos canyons
- 🌉 **No Hands Bridge** - Ponte histórica icónica
- ⛰️ **China Wall Trail** - Início das provas de 100M e 100K
- 🏛️ **Auburn Historic Downtown** - Meta de todas as provas

### 🎯 4 Provas Disponíveis

O evento oferece distâncias para todos os níveis de corredores de trail:

#### 🥇 100 Miles (161 km)
- **Distância:** 100 milhas (~161 km)
- **Desnível Positivo:** 18.208 ft (~5.550m)
- **Partida:** Sexta, 24 de Abril às 12:00 (China Wall Trailhead)
- **Meta:** Auburn Downtown
- **Limite de Tempo:** 35 horas
- **Running Stones UTMB:** 4 pedras
- **Qualificação:** Western States 100 + UTMB World Series

#### 🥈 100 Kilometers (100K)
- **Distância:** 62.1 milhas (~100 km)
- **Desnível Positivo:** 12.303 ft (~3.750m)
- **Partida:** Sábado, 25 de Abril às 05:00 (China Wall Trailhead)
- **Meta:** Auburn Downtown
- **Limite de Tempo:** 20h (WS100 qualifier), 21h (UTMB stones)
- **Running Stones UTMB:** 3 pedras
- **Qualificação:** Western States 100 + UTMB World Series

#### 🥉 50 Kilometers (50K)
- **Distância:** 31 milhas (~50 km)
- **Desnível Positivo:** 5.577 ft (~1.700m)
- **Partida:** Sábado, 25 de Abril às 07:00 (Auburn Downtown)
- **Meta:** Auburn Downtown
- **Limite de Tempo:** 10 horas
- **Running Stones UTMB:** 2 pedras

#### 🏅 25 Kilometers (25K)
- **Distância:** 15.5 milhas (~25 km)
- **Desnível Positivo:** 2.788 ft (~850m)
- **Partida:** Sexta, 24 de Abril às 16:00 (Auburn Downtown)
- **Meta:** Auburn Downtown
- **Limite de Tempo:** 5 horas
- **Running Stones UTMB:** 1 pedra

## 🎽 Equipamento Obrigatório

### 100 Miles
- 2x Lanternas frontais (200+ lumens recomendado) com baterias extra
- Mochila de trail running
- Telemóvel com roaming nos EUA
- Copo dobrável (150ml mínimo)
- Reserva de água (1 litro mínimo)
- Reserva de comida (800 kcal)
- Casaco impermeável com capuz
- Gorro/chapéu

### 100K
- 1x Lanterna frontal (200+ lumens) com baterias extra
- Mochila de trail running
- Telemóvel com roaming nos EUA
- Copo dobrável (150ml mínimo)
- Reserva de água (1 litro mínimo)
- Reserva de comida (800 kcal)
- Casaco impermeável com capuz
- Gorro/chapéu

### 50K e 25K
- Telemóvel com roaming nos EUA
- Copo dobrável (150ml mínimo)
- Reserva de água (1 litro mínimo para 50K, 0.5L para 25K)
- Reserva de comida (recomendado)

**Nota:** Kits de tempo quente/frio podem ser exigidos pela organização dependendo das condições meteorológicas.

## 🎫 Pacers e Assistência

### 100 Miles
- ✅ **Pacers permitidos** a partir de Cool - 1 (Milha 62.9) ou Cool - 2 (Milha 75.1)
- 1 pacer de cada vez até à meta
- Pacer deve ter +18 anos e assinar termo de responsabilidade
- Pacer deve levar equipamento obrigatório

### 100K, 50K, 25K
- ❌ **Pacers NÃO permitidos**

### Pontos de Assistência (Crewing)

**100 Miles:**
- Michigan Bluff (Milha 24.0)
- Foresthill (Milha 30.0)
- Drivers Flat (Milha 47.5)
- Cool 1 & 2 (Milha 62.9 & 75.1)

**100K:**
- Michigan Bluff (Milha 24.0)
- Foresthill (Milha 30.0)
- Drivers Flat (Milha 47.5)

**50K e 25K:**
- Sem assistência permitida em qualquer ponto

## 🏁 Postos de Abastecimento

### 100 Miles - 20 Postos
Postos completos com água, bebidas eletrolíticas, géis, comida (postos noturnos com comida quente).

**Principais Checkpoints:**
- Deadwood 1 & 2 (Milha 10.1 & 18.3)
- Devils Thumb 1 & 2 (Milha 12.0 & 15.1)
- Swinging Bridge Turnaround (Milha 13.5)
- Michigan Bluff (Milha 24.0) - Cut-off: 19:45
- Foresthill (Milha 30.0) - Cut-off: 21:30
- Cal 2 (Milha 38.2)
- Drivers Flat (Milha 47.5) - Cut-off: 03:00
- Mammoth Bar (Milha 55.5) - Cut-off: 05:30
- No Hands 1 & 2 (Milha 59.9 & 98.3)
- Cool 1 (Milha 62.9) - Cut-off: 08:00
- Coffer Dam 1 & 2 (Milha 64.6 & 69.1)
- Cool 2 (Milha 75.1) - Cut-off: 12:00
- Browns Bar 1 & 2 (Milha 79.2 & 92.3)
- ALT (Milha 84.7) - Cut-off: 15:30

### 100K - 12 Postos
Postos completos com hidratação, alimentação e assistência médica.

**Principais Checkpoints:**
- Deadwood 1 & 2 (Milha 10.7 & 15.2)
- Devils Thumb 1 & 2 (Milha 11.5 & 14.8)
- Michigan Bluff (Milha 23.8) - Cut-off: 12:45
- Foresthill (Milha 29.8) - Cut-off: 14:30
- Cal 2 (Milha 38.0)
- Drivers Flat (Milha 47.3) - Cut-off: 19:45
- Mammoth Bar (Milha 55.4) - Cut-off: 22:15

### 50K - 5 Postos
- Confluence 1 & 2 (Milha 4.0 & 27.2)
- Clementine (Milha 7.2)
- Drivers Flat (Milha 15.6)
- Mammoth Bar (Milha 23.5)

### 25K - 2 Postos
- No Hands 1 & 2 (Milha 3.5 & 12.0)
- Cool 1 & 2 (Milha 6.5 & 8.6)

## 🎽 O Que Está Incluído

### Todas as Provas
✅ Dorsal com chip de cronometragem
✅ Rastreamento GPS ao vivo (LiveTrail)
✅ Postos de abastecimento completos
✅ Assistência médica em todos os postos
✅ Transporte para partida (100M/100K)
✅ Hidratação e alimentação na meta

### Prémios de Finisher

**100 Miles:**
- 🏆 Fivela de cinto personalizada (finishers)
- 🥇 Troféu personalizado (Top 3 M/F)

**100K:**
- 🏆 Cinto personalizado (finishers)
- 🥇 Troféu personalizado (Top 3 M/F)
- 🎟️ **Golden Ticket para Western States 100** (Top 2 M/F)

**50K:**
- 🏅 Medalha de finisher
- 🥇 Troféu personalizado (Top 3 M/F)

**25K:**
- 🏅 Medalha de finisher
- 🥇 Troféu personalizado (Top 3 M/F)

## 📋 Regras Importantes

### Semi-Autonomia
- Cada corredor deve ser auto-suficiente entre postos
- Proibido ser acompanhado fora das zonas designadas
- Não é permitido "muling" (pacer carregar equipamento do corredor)
- Animais não são permitidos (incluindo cães de serviço)

### Cortes de Tempo
- Cortes intermédios serão rigorosamente aplicados
- Corredores devem **sair** dos postos antes do cut-off
- Impossível sair de um posto atrás dos sweepers
- Consultar tabela completa de cut-offs no site oficial

### Segurança
- Permanecer sempre no percurso marcado
- Se perdido, não sair do trilho - aguardar ajuda
- Avisar próximo posto em caso de ver corredor ferido
- Tratamento por soro intravenoso = desqualificação automática
- Hospital disponível em Auburn para emergências

### Drop Bags
**100M:** Foresthill (Milha 30.0), Cool 1 & 2 (Milha 62.9 & 75.1)
**100K:** Foresthill (Milha 30.0)
**50K/25K:** Não permitido

- Dimensões máximas: 8"x10"x16"
- Identificar com nome completo, dorsal e posto de destino

## 🏆 Destaques do Evento

- 🌍 **UTMB World Series** - Prova oficial da série mundial
- 🏔️ **Western States Trail** - Trilho histórico lendário
- 🎫 **Golden Tickets** - Top 2 do 100K ganham vaga na Western States 100
- 🥇 **Qualificação UTMB** - Running Stones para UTMB Mont-Blanc
- 🏛️ **Auburn** - "Capital Mundial da Resistência"
- 👥 Evento com 4 distâncias para todos os níveis
- 📱 **LiveTrail** - Tracking GPS ao vivo de todos os corredores
- 🎪 **Expo** em Auburn com levantamento de dorsais e briefings

## 📅 Programa

**23-25 de Abril:**
- Expo em Auburn (ExCeL Center)
- Levantamento de dorsais e kits
- Briefings pré-prova
- Drop Bag drop-off

**24 de Abril (Sexta):**
- 12:00 - Partida 100 Miles (China Wall)
- 16:00 - Partida 25K (Auburn Downtown)

**25 de Abril (Sábado):**
- 05:00 - Partida 100K (China Wall)
- 07:00 - Partida 50K (Auburn Downtown)

## 🌐 Informações Oficiais

- **Website:** [canyons.utmb.world](https://canyons.utmb.world)
- **Regulamento Completo:** Disponível no site oficial
- **GPX Files:** Download disponível para todas as distâncias
- **Aid Station Chart:** Tabela completa de postos e cut-offs

## 🎯 Perfil do Corredor

### 100 Miles
Para corredores experientes em ultras longas, confortáveis com corridas noturnas (24h+), auto-suficientes e com experiência em terreno técnico de montanha.

### 100K
Para corredores com experiência em ultras, capazes de gerir esforço prolongado e corrida noturna. Ideal como preparação para 100 milhas.

### 50K
Para corredores de trail com experiência em longas distâncias. Percurso técnico mas acessível, ideal para primeira ultra ou qualificação UTMB.

### 25K
Para corredores a iniciar-se em trail running ou a procurar uma prova rápida e técnica. Percurso cénico e desafiante.

---

**Boa sorte e boas corridas! 🏔️🏃‍♂️**`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-04-24T20:00:00Z"),
      endDate: new Date("2026-04-25T15:00:00Z"),
      city: "Auburn",
      country: "Estados Unidos",
      latitude: 38.8969,
      longitude: -121.0766,
      googleMapsUrl: "https://www.google.com/maps?q=Auburn,CA,USA",
      externalUrl: "https://canyons.utmb.world",
      imageUrl:
        "https://utmbworld.com/sites/default/files/styles/event_image/public/2024-03/canyons-hero.jpg",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-18T07:59:59Z"),
    },
  });

  console.log("✅ Event upserted with ID:", event.id);

  // Step 2: Upsert translations separately (ALL 6 LANGUAGES with SEO metadata)
  const languages: Language[] = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  const translations = {
    pt: {
      title: "The Canyons Endurance Run by UTMB",
      description: `Ultra trail running em Auburn, Califórnia com 4 distâncias: 100M, 100K, 50K e 25K. Western States Trail, UTMB World Series, Golden Tickets para WS100.`,
      city: "Auburn",
      metaTitle:
        "The Canyons Endurance Run by UTMB 2026 | Auburn, CA | 23-25 Abril",
      metaDescription:
        "The Canyons by UTMB 2026 - 4 provas de trail em Auburn, CA: 100M (18.208ft D+), 100K (12.303ft D+), 50K, 25K. Western States Trail. Golden Tickets WS100. UTMB World Series.",
    },
    en: {
      title: "The Canyons Endurance Run by UTMB",
      description: `Ultra trail running in Auburn, California with 4 distances: 100M, 100K, 50K and 25K. Western States Trail, UTMB World Series, Golden Tickets for WS100.`,
      city: "Auburn",
      metaTitle:
        "The Canyons Endurance Run by UTMB 2026 | Auburn, CA | Apr 23-25",
      metaDescription:
        "The Canyons by UTMB 2026 - 4 trail races in Auburn, CA: 100M (18,208ft D+), 100K (12,303ft D+), 50K, 25K. Western States Trail. WS100 Golden Tickets. UTMB World Series.",
    },
    es: {
      title: "The Canyons Endurance Run by UTMB",
      description: `Ultra trail running en Auburn, California con 4 distancias: 100M, 100K, 50K y 25K. Western States Trail, UTMB World Series, Golden Tickets para WS100.`,
      city: "Auburn",
      metaTitle:
        "The Canyons Endurance Run by UTMB 2026 | Auburn, CA | 23-25 Abril",
      metaDescription:
        "The Canyons by UTMB 2026 - 4 carreras trail en Auburn, CA: 100M (18.208ft D+), 100K (12.303ft D+), 50K, 25K. Western States Trail. Golden Tickets WS100. UTMB World Series.",
    },
    fr: {
      title: "The Canyons Endurance Run by UTMB",
      description: `Ultra trail running à Auburn, Californie avec 4 distances: 100M, 100K, 50K et 25K. Western States Trail, UTMB World Series, Golden Tickets pour WS100.`,
      city: "Auburn",
      metaTitle:
        "The Canyons Endurance Run by UTMB 2026 | Auburn, CA | 23-25 Avril",
      metaDescription:
        "The Canyons by UTMB 2026 - 4 courses trail à Auburn, CA: 100M (18.208ft D+), 100K (12.303ft D+), 50K, 25K. Western States Trail. Golden Tickets WS100. UTMB World Series.",
    },
    de: {
      title: "The Canyons Endurance Run by UTMB",
      description: `Ultra-Trail-Running in Auburn, Kalifornien mit 4 Distanzen: 100M, 100K, 50K und 25K. Western States Trail, UTMB World Series, Golden Tickets für WS100.`,
      city: "Auburn",
      metaTitle:
        "The Canyons Endurance Run by UTMB 2026 | Auburn, CA | 23-25 April",
      metaDescription:
        "The Canyons by UTMB 2026 - 4 Trail-Läufe in Auburn, CA: 100M (18.208ft D+), 100K (12.303ft D+), 50K, 25K. Western States Trail. WS100 Golden Tickets. UTMB World Series.",
    },
    it: {
      title: "The Canyons Endurance Run by UTMB",
      description: `Ultra trail running ad Auburn, California con 4 distanze: 100M, 100K, 50K e 25K. Western States Trail, UTMB World Series, Golden Tickets per WS100.`,
      city: "Auburn",
      metaTitle:
        "The Canyons Endurance Run by UTMB 2026 | Auburn, CA | 23-25 Aprile",
      metaDescription:
        "The Canyons by UTMB 2026 - 4 gare trail ad Auburn, CA: 100M (18.208ft D+), 100K (12.303ft D+), 50K, 25K. Western States Trail. Golden Tickets WS100. UTMB World Series.",
    },
  };

  for (const lang of languages) {
    await prisma.eventTranslation.upsert({
      where: { eventId_language: { eventId: event.id, language: lang } },
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
    "📝 Event translations upserted for 6 languages with SEO metadata"
  );

  // Step 3: Upsert variants
  // Helper function to find or create variant
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findOrCreateVariant = async (name: string, data: any) => {
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

  console.log("💪 Creating/updating event variants...");

  // Variant 1: 100 Miles
  const variant100M = await findOrCreateVariant("100 Miles", {
    description:
      "100 milhas (~161 km) pelo Western States Trail. Partida em China Wall, chegada em Auburn. Limite: 35 horas. 18.208 ft de desnível positivo.",
    distanceKm: 161,
    elevationGainM: 5550,
    elevationLossM: 5550,
    startDate: new Date("2026-04-24T20:00:00Z"), // 12:00 PT
    startTime: "12:00",
    maxParticipants: null,
    cutoffTimeHours: 35.0,
    currency: Currency.USD,
    itraPoints: 4,
    atrpGrade: null,
    mountainLevel: null,
  });

  // Variant 2: 100 Kilometers
  const variant100K = await findOrCreateVariant("100 Kilometers", {
    description:
      "100 km pelo Western States Trail. Partida em China Wall, chegada em Auburn. Limite: 21 horas. 12.303 ft de desnível positivo. Golden Ticket WS100 (Top 2).",
    distanceKm: 100,
    elevationGainM: 3750,
    elevationLossM: 3750,
    startDate: new Date("2026-04-25T13:00:00Z"), // 05:00 PT = 13:00 UTC
    startTime: "05:00",
    maxParticipants: null,
    cutoffTimeHours: 21.0,
    currency: Currency.USD,
    itraPoints: 3,
    atrpGrade: null,
    mountainLevel: null,
  });

  // Variant 3: 50 Kilometers
  const variant50K = await findOrCreateVariant("50 Kilometers", {
    description:
      "50 km em loop. Partida e chegada em Auburn Downtown. Limite: 10 horas. 5.577 ft de desnível positivo. Foresthill Divide Loop.",
    distanceKm: 50,
    elevationGainM: 1700,
    elevationLossM: 1700,
    startDate: new Date("2026-04-25T15:00:00Z"), // 07:00 PT = 15:00 UTC
    startTime: "07:00",
    maxParticipants: null,
    cutoffTimeHours: 10.0,
    currency: Currency.USD,
    itraPoints: 2,
    atrpGrade: null,
    mountainLevel: null,
  });

  // Variant 4: 25 Kilometers
  const variant25K = await findOrCreateVariant("25 Kilometers", {
    description:
      "25 km em loop. Partida e chegada em Auburn Downtown. Limite: 5 horas. 2.788 ft de desnível positivo. Western States Trail via Cool.",
    distanceKm: 25,
    elevationGainM: 850,
    elevationLossM: 850,
    startDate: new Date("2026-04-25T00:00:00Z"), // 16:00 PT (Apr 24) = 00:00 UTC (Apr 25)
    startTime: "16:00",
    maxParticipants: null,
    cutoffTimeHours: 5.0,
    currency: Currency.USD,
    itraPoints: 1,
    atrpGrade: null,
    mountainLevel: null,
  });

  console.log("✅ All 4 variants upserted");

  // Step 4: Upsert variant translations (ALL 6 LANGUAGES)
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string }>
  > = {
    "100 Miles": {
      pt: {
        name: "100 Milhas",
        description:
          "100 milhas (~161 km) pelo Western States Trail. Partida em China Wall, chegada em Auburn. Limite: 35 horas. 18.208 ft de desnível positivo. 4 Running Stones UTMB.",
      },
      en: {
        name: "100 Miles",
        description:
          "100 miles (~161 km) on Western States Trail. Start at China Wall, finish in Auburn. Cutoff: 35 hours. 18,208 ft elevation gain. 4 UTMB Running Stones.",
      },
      es: {
        name: "100 Millas",
        description:
          "100 millas (~161 km) por Western States Trail. Salida en China Wall, meta en Auburn. Límite: 35 horas. 18.208 ft de desnivel positivo. 4 Running Stones UTMB.",
      },
      fr: {
        name: "100 Miles",
        description:
          "100 miles (~161 km) sur Western States Trail. Départ à China Wall, arrivée à Auburn. Limite: 35 heures. 18.208 ft de dénivelé positif. 4 Running Stones UTMB.",
      },
      de: {
        name: "100 Meilen",
        description:
          "100 Meilen (~161 km) auf Western States Trail. Start in China Wall, Ziel in Auburn. Zeitlimit: 35 Stunden. 18.208 ft Höhengewinn. 4 UTMB Running Stones.",
      },
      it: {
        name: "100 Miglia",
        description:
          "100 miglia (~161 km) sul Western States Trail. Partenza a China Wall, arrivo ad Auburn. Limite: 35 ore. 18.208 ft di dislivello positivo. 4 Running Stones UTMB.",
      },
    },
    "100 Kilometers": {
      pt: {
        name: "100 Quilómetros",
        description:
          "100 km pelo Western States Trail. Partida em China Wall, chegada em Auburn. Limite: 21 horas. 12.303 ft de desnível positivo. Golden Ticket WS100 (Top 2). 3 Running Stones UTMB.",
      },
      en: {
        name: "100 Kilometers",
        description:
          "100 km on Western States Trail. Start at China Wall, finish in Auburn. Cutoff: 21 hours. 12,303 ft elevation gain. WS100 Golden Ticket (Top 2). 3 UTMB Running Stones.",
      },
      es: {
        name: "100 Kilómetros",
        description:
          "100 km por Western States Trail. Salida en China Wall, meta en Auburn. Límite: 21 horas. 12.303 ft de desnivel positivo. Golden Ticket WS100 (Top 2). 3 Running Stones UTMB.",
      },
      fr: {
        name: "100 Kilomètres",
        description:
          "100 km sur Western States Trail. Départ à China Wall, arrivée à Auburn. Limite: 21 heures. 12.303 ft de dénivelé positif. Golden Ticket WS100 (Top 2). 3 Running Stones UTMB.",
      },
      de: {
        name: "100 Kilometer",
        description:
          "100 km auf Western States Trail. Start in China Wall, Ziel in Auburn. Zeitlimit: 21 Stunden. 12.303 ft Höhengewinn. WS100 Golden Ticket (Top 2). 3 UTMB Running Stones.",
      },
      it: {
        name: "100 Chilometri",
        description:
          "100 km sul Western States Trail. Partenza a China Wall, arrivo ad Auburn. Limite: 21 ore. 12.303 ft di dislivello positivo. Golden Ticket WS100 (Top 2). 3 Running Stones UTMB.",
      },
    },
    "50 Kilometers": {
      pt: {
        name: "50 Quilómetros",
        description:
          "50 km em loop. Partida e chegada em Auburn Downtown. Limite: 10 horas. 5.577 ft de desnível positivo. Foresthill Divide Loop. 2 Running Stones UTMB.",
      },
      en: {
        name: "50 Kilometers",
        description:
          "50 km loop course. Start and finish in Auburn Downtown. Cutoff: 10 hours. 5,577 ft elevation gain. Foresthill Divide Loop. 2 UTMB Running Stones.",
      },
      es: {
        name: "50 Kilómetros",
        description:
          "50 km en circuito. Salida y meta en Auburn Downtown. Límite: 10 horas. 5.577 ft de desnivel positivo. Foresthill Divide Loop. 2 Running Stones UTMB.",
      },
      fr: {
        name: "50 Kilomètres",
        description:
          "50 km en boucle. Départ et arrivée à Auburn Downtown. Limite: 10 heures. 5.577 ft de dénivelé positif. Foresthill Divide Loop. 2 Running Stones UTMB.",
      },
      de: {
        name: "50 Kilometer",
        description:
          "50 km Rundstrecke. Start und Ziel in Auburn Downtown. Zeitlimit: 10 Stunden. 5.577 ft Höhengewinn. Foresthill Divide Loop. 2 UTMB Running Stones.",
      },
      it: {
        name: "50 Chilometri",
        description:
          "50 km in circuito. Partenza e arrivo ad Auburn Downtown. Limite: 10 ore. 5.577 ft di dislivello positivo. Foresthill Divide Loop. 2 Running Stones UTMB.",
      },
    },
    "25 Kilometers": {
      pt: {
        name: "25 Quilómetros",
        description:
          "25 km em loop. Partida e chegada em Auburn Downtown. Limite: 5 horas. 2.788 ft de desnível positivo. Western States Trail via Cool. 1 Running Stone UTMB.",
      },
      en: {
        name: "25 Kilometers",
        description:
          "25 km loop course. Start and finish in Auburn Downtown. Cutoff: 5 hours. 2,788 ft elevation gain. Western States Trail via Cool. 1 UTMB Running Stone.",
      },
      es: {
        name: "25 Kilómetros",
        description:
          "25 km en circuito. Salida y meta en Auburn Downtown. Límite: 5 horas. 2.788 ft de desnivel positivo. Western States Trail vía Cool. 1 Running Stone UTMB.",
      },
      fr: {
        name: "25 Kilomètres",
        description:
          "25 km en boucle. Départ et arrivée à Auburn Downtown. Limite: 5 heures. 2.788 ft de dénivelé positif. Western States Trail via Cool. 1 Running Stone UTMB.",
      },
      de: {
        name: "25 Kilometer",
        description:
          "25 km Rundstrecke. Start und Ziel in Auburn Downtown. Zeitlimit: 5 Stunden. 2.788 ft Höhengewinn. Western States Trail über Cool. 1 UTMB Running Stone.",
      },
      it: {
        name: "25 Chilometri",
        description:
          "25 km in circuito. Partenza e arrivo ad Auburn Downtown. Limite: 5 ore. 2.788 ft di dislivello positivo. Western States Trail via Cool. 1 Running Stone UTMB.",
      },
    },
  };

  const variants = [
    { name: "100 Miles", id: variant100M.id },
    { name: "100 Kilometers", id: variant100K.id },
    { name: "50 Kilometers", id: variant50K.id },
    { name: "25 Kilometers", id: variant25K.id },
  ];

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

  console.log(
    "📝 Variant translations upserted for all 4 variants (6 languages each)"
  );

  // Step 5: Delete existing pricing phases to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("🗑️ Deleted existing pricing phases for idempotency");

  // Step 6: Create pricing phases (LINKED TO eventId, NOT variantId)
  console.log("💰 Creating pricing phases...");

  // 100 Miles pricing
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "100 Miles - Standard Entry",
      startDate: new Date("2025-06-01T00:00:00Z"),
      endDate: new Date("2026-04-18T07:59:59Z"),
      price: 515.0,
      currency: Currency.USD,
      discountPercent: null,
      note: "Entry for 100 Mile race. Includes timing chip, aid stations, medical support, finisher buckle.",
    },
  });

  // 100K pricing
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "100K - Standard Entry",
      startDate: new Date("2025-06-01T00:00:00Z"),
      endDate: new Date("2026-04-18T07:59:59Z"),
      price: 389.0,
      currency: Currency.USD,
      discountPercent: null,
      note: "Entry for 100K race. Top 2 M/F receive Western States 100 Golden Ticket. Includes finisher belt.",
    },
  });

  // 50K pricing
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "50K - Standard Entry",
      startDate: new Date("2025-06-01T00:00:00Z"),
      endDate: new Date("2026-04-18T07:59:59Z"),
      price: 279.0,
      currency: Currency.USD,
      discountPercent: null,
      note: "Entry for 50K race. Includes timing chip, aid stations, medical support, finisher medal.",
    },
  });

  // 25K pricing
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "25K - Standard Entry",
      startDate: new Date("2025-06-01T00:00:00Z"),
      endDate: new Date("2026-04-18T07:59:59Z"),
      price: 169.0,
      currency: Currency.USD,
      discountPercent: null,
      note: "Entry for 25K race. Friday evening start. Includes timing chip, aid stations, finisher medal.",
    },
  });

  console.log("💰 Pricing phases created (linked to eventId)");
  console.log(
    "✅ The Canyons Endurance Run by UTMB 2026 seed completed successfully!"
  );
  console.log("");
  console.log("📋 Summary:");
  console.log("   🏔️ Event: The Canyons Endurance Run by UTMB 2026");
  console.log("   📅 Dates: April 24-25, 2026");
  console.log("   📍 Location: Auburn, California, USA");
  console.log("   🏃 Variants: 4 (100M, 100K, 50K, 25K)");
  console.log("   🌍 Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("   💰 Pricing: 4 phases (one per variant)");
  console.log("   🔗 Website: https://canyons.utmb.world");
  console.log(
    "   🏆 Features: UTMB World Series, Western States Qualifiers, Golden Tickets"
  );
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
