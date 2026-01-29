/**
 * Seed Leadville Trail 100 Run 2026 - "Race Across the Sky"
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log(
    "🏔️ Seeding Leadville Trail 100 Run 2026 - Race Across the Sky..."
  );

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "leadville-trail-100-2026" },
    update: {
      title: "Leadville Trail 100 Run - Race Across the Sky",
      description: `# 🏔️ Leadville Trail 100 Run 2026 - Race Across the Sky

O **Leadville Trail 100 Run** é uma das ultramaratonas mais icónicas e desafiadoras do mundo. Conhecida como **"Race Across the Sky"** (Corrida Através do Céu), esta prova lendária decorre nas montanhas rochosas do Colorado a altitudes extremas, testando os limites da resistência humana.

![Leadville Trail 100 Run - Hope Pass](https://www.leadvilleraceseries.com/wp-content/uploads/2023/08/LT100-Run-Hero.jpg)

## 📍 Localização e Percurso

**Local:** Leadville, Colorado (Estados Unidos)
**Altitude Inicial:** 10.200 pés (~3.094m)
**Altitude Máxima:** 12.600 pés (~3.840m) no Hope Pass
**Tipo:** Out-and-back (ida e volta)

Leadville é conhecida como **"Cloud City"** (Cidade das Nuvens) e está situada a mais de 3.000 metros de altitude nas Montanhas Rochosas. O percurso é brutal e técnico:

- 🏔️ **Hope Pass** - O ponto mais alto (12.600 pés) que os corredores atravessam DUAS VEZES
- ⛰️ **Powerline** - Subidas íngremes e exigentes
- 🌲 **Colorado Trail** - Terreno técnico e rochoso
- 🏞️ **Sugarloaf Pass** - Passagem de alta altitude
- 💨 **Twin Lakes** - Ponto crucial de apoio e viragem

### 🎯 Características do Percurso

- **Distância:** 100 milhas (160,9 km)
- **Desnível Positivo:** +15.000 pés (~4.800m)
- **Desnível Negativo:** -15.000 pés (~4.800m)
- **Altitude:** 10.200 - 12.600 pés (3.094 - 3.840m)
- **Tipo de Terreno:** Trilhas, caminhos de montanha, Colorado Trail
- **Dificuldade:** Extrema (altitude + desnível + distância)

## 🎯 A Prova

### 💪 O Desafio

O Leadville Trail 100 não é apenas uma corrida - é um teste supremo de:

- ✅ **Resistência física** a altitudes extremas
- ✅ **Força mental** para superar 30 horas de esforço
- ✅ **Adaptação à altitude** (ar rarefeito)
- ✅ **Gestão de esforço** em terreno técnico
- ✅ **Resiliência** face a condições meteorológicas imprevisíveis

### 🏆 Belt Buckles Legendárias

**Sub-25 horas:** Fivela de cinto DOURADA 🥇
- Apenas para os atletas de elite
- Símbolo máximo de excelência em ultra trail

**Sub-30 horas:** Fivela de cinto PRATEADA 🥈
- Para todos os finishers dentro do limite
- Reconhecimento de uma conquista extraordinária

## 📅 História da Prova

Criada em **1983** por **Ken Chlouber**, um mineiro local que queria trazer atenção para Leadville após o encerramento da Mina Climax. A primeira edição teve apenas **45 corredores**.

### 🌟 Marcos Históricos

- **1983:** Primeira edição com 45 participantes
- **1994:** Ann Trason estabelece recorde feminino lendário
- **2006:** Matt Carpenter bate recorde masculino
- **2023:** 40ª edição da prova
- **2026:** 43ª edição - A lenda continua

Ao longo dos anos, a prova atraiu atletas de elite de todo o mundo e tornou-se num dos quatro "Grand Slam" de 100 milhas dos Estados Unidos.

## 🎫 Inscrição e Qualificação

### 🎲 Sistema de Inscrição

O acesso ao Leadville Trail 100 funciona através de vários sistemas:

#### 1️⃣ **Lotaria (Lottery)**
- Sistema de sorteio para lugares disponíveis
- Aberto a todos os corredores
- Anúncio de resultados geralmente em dezembro/janeiro

#### 2️⃣ **Qualifying Races**
- Performances qualificadoras em outras provas
- Silver Rush 50 Mile (prova qualificadora oficial)
- Outras ultras com tempos qualificadores

#### 3️⃣ **Training Camp + Entry**
- Pacotes com camp de treino + vaga garantida
- Investimento: ~$2.000+
- Treino com coaches experientes

#### 4️⃣ **Charity Slots**
- Vagas através de angariação para instituições
- Garantia de participação
- Contributo para causas sociais

### 💰 Preços

- **Entry Fee (Lotaria):** $195 - $225
- **Training Camp + Entry:** ~$2.000+
- **Camp Only:** ~$1.000

## 🏁 Logística da Prova

### ⏰ Horários

**Partida:** 22 de Agosto de 2026 - 04:00 AM (MT)
**Chegada (limite):** 23 de Agosto de 2026 - 10:00 AM (MT)
**Limite de Tempo:** 30 horas

### 📍 Postos de Abastecimento

A prova tem **13 postos de abastecimento principais**:

1. **May Queen** (Mile 13 / 87) - 10.600 ft
2. **Outward Bound** (Mile 23.5 / 76.5) - 10.000 ft
3. **Halfmoon** (Mile 30 / 70) - 10.000 ft
4. **Twin Lakes** (Mile 40 / 60) - 9.200 ft ⭐ Ponto crucial
5. **Hope Pass Summit** (Mile 43) - 12.600 ft 🏔️ Ponto mais alto
6. **Winfield** (Mile 50) - 10.200 ft 🔄 Viragem (halfway)
7. **Hope Pass Summit Return** (Mile 57) - 12.600 ft 🏔️ Segunda vez!

Cada posto tem:
- 💧 Água e bebidas eletrolíticas
- 🍲 Comida quente e fria
- 🏥 Assistência médica
- ⏱️ Controlo de cut-offs
- 👥 Crew access (zonas designadas)

### 👟 Pacers

- ✅ **Permitidos após Mile 61.5** (~99 km / Twin Lakes outbound)
- 1 pacer de cada vez até à meta
- Pacer deve ter +18 anos
- Deve estar preparado para altitude e terreno
- Não pode carregar equipamento do corredor

### 🚗 Crew Support

- ✅ Permitido em **zonas designadas** (May Queen, Twin Lakes, Halfmoon, Winfield)
- ❌ Proibido em outros pontos do percurso
- Crew pode fornecer comida, bebida, roupa, assistência
- Respeitar sempre as regras de acesso

## 🎽 Equipamento Obrigatório

### Equipamento de Segurança

- 🔦 **2x Lanternas frontais** com baterias extra
- 🎒 **Mochila/colete** de trail running
- 📱 **Telemóvel** (emergências)
- 🧥 **Casaco impermeável** com capuz
- 🧤 **Luvas** (temperaturas noturnas < 0°C)
- 🧢 **Gorro/chapéu**
- 🥤 **Copo dobrável** (150ml mínimo)
- 💧 **Reserva de água** (mínimo 1L)
- 🍫 **Reserva de comida** (mínimo 800 kcal)

### 🌡️ Condições Meteorológicas

**Temperaturas em Agosto:**
- ☀️ Dia: até 25°C (77°F)
- 🌙 Noite: até -4°C (25°F)
- ⛈️ Trovoadas frequentes à tarde
- ❄️ Possibilidade de neve/granizo em altitude
- ⚡ Perigo de relâmpagos acima da tree line

**⚠️ AVISO:** Hipotermia é um risco real. Leva SEMPRE equipamento adequado para Hope Pass.

## 🏆 Destaques do Evento

- 🌍 **Uma das 4 Grand Slam 100 Miles** dos EUA
- 🥇 **Desde 1983** - 43 anos de história
- 🏔️ **Altitude Extrema** - 3.094m a 3.840m
- 👥 **Prova Lendária** - referência mundial em ultra trail
- 🎖️ **Belt Buckles** - Ouro (sub-25h) e Prata (sub-30h)
- 📚 **Livro "Born to Run"** popularizou a prova
- 🎬 **Documentários** celebram a lenda de Leadville
- ⛰️ **Hope Pass** - O ponto mais icónico e difícil

## 🎪 Race Across the Sky Expo

**Datas:** 20-21 de Agosto de 2026
**Local:** Downtown Leadville (Main Street)

O Expo é gratuito e aberto ao público:
- 🎽 Check-in e levantamento de dorsais
- 🏪 Exposição de marcas e produtos
- 🎤 Palestras e podcasts ao vivo
- 🍺 Tendas de cerveja e food trucks
- 🚴 Demos de equipamento
- 📸 Meet & greet com atletas

## 📋 Regras Importantes

### Autonomia e Segurança

- ✅ Cada corredor deve ser auto-suficiente entre postos
- ✅ Obrigatório passar por TODOS os checkpoints
- ✅ Cortes de tempo rigorosamente aplicados
- ❌ Proibido sair do percurso marcado
- ❌ Proibido receber ajuda fora das zonas crew
- ❌ Animais não são permitidos

### Altitude e Saúde

- ⚠️ **Aclimatação** recomendada (chegar 3-7 dias antes)
- ⚠️ **Mal de altitude** é comum acima de 3.000m
- ⚠️ **Hidratação** crítica em altitude
- ⚠️ **Sinais de alerta:** dores de cabeça, náuseas, tonturas
- 🏥 Assistência médica disponível em todos os postos

## 🎯 Perfil do Corredor

### Quem deve participar?

**Experiência Mínima Recomendada:**
- ✅ Pelo menos 1-2 ultras de 100km completadas
- ✅ Experiência em trail técnico de montanha
- ✅ Treino específico de altitude (se possível)
- ✅ Capacidade mental para 30 horas de esforço
- ✅ Experiência em corrida noturna
- ✅ Gestão de nutrição/hidratação em ultra distância

**Esta prova NÃO é recomendada para:**
- ❌ Corredores sem experiência em ultras
- ❌ Primeira experiência em alta altitude
- ❌ Sem preparação física/mental adequada
- ❌ Sem sistema de suporte (crew/pacers)

## 🌐 Informações Oficiais

- **Website:** [leadvilleraceseries.com](https://www.leadvilleraceseries.com/run/leadvilletrail100run/)
- **Regulamento:** Disponível no site oficial
- **GPX File:** Download disponível após inscrição
- **Course Profile:** Perfil de altitude completo disponível
- **Aid Station Chart:** Tabela detalhada de postos e cut-offs

## 🚗 Como Chegar

**Aeroporto:** Denver International Airport (DEN)
- 🚗 ~2.5 horas de carro até Leadville
- 🚙 Recomenda-se carro alugado
- 🏨 Alojamento em Leadville ou arredores

**Altitude de Leadville:** 10.152 pés (3.094m)
- Mais alta cidade incorporada dos EUA
- Aclimatação recomendada

---

**"Better to be at the starting line, than on the couch thinking about it."**
*— Ken Chlouber, Fundador do Leadville Trail 100*

**Boa sorte e boas corridas! 🏔️🏃‍♂️**`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-08-22T10:00:00Z"), // 4:00 AM MT = 10:00 UTC
      endDate: null,
      city: "Leadville",
      country: "Estados Unidos",
      latitude: 39.25,
      longitude: -106.29,
      googleMapsUrl: "https://www.google.com/maps?q=39.2500,-106.2900",
      externalUrl:
        "https://www.leadvilleraceseries.com/run/leadvilletrail100run/",
      imageUrl:
        "https://www.leadvilleraceseries.com/wp-content/uploads/2023/08/LT100-Run-Hero.jpg",
      isFeatured: true,
      registrationDeadline: new Date("2026-01-15T07:59:59Z"), // Lottery closes typically in January
    },
    create: {
      title: "Leadville Trail 100 Run - Race Across the Sky",
      slug: "leadville-trail-100-2026",
      description: `# 🏔️ Leadville Trail 100 Run 2026 - Race Across the Sky

O **Leadville Trail 100 Run** é uma das ultramaratonas mais icónicas e desafiadoras do mundo. Conhecida como **"Race Across the Sky"** (Corrida Através do Céu), esta prova lendária decorre nas montanhas rochosas do Colorado a altitudes extremas, testando os limites da resistência humana.

![Leadville Trail 100 Run - Hope Pass](https://www.leadvilleraceseries.com/wp-content/uploads/2023/08/LT100-Run-Hero.jpg)

## 📍 Localização e Percurso

**Local:** Leadville, Colorado (Estados Unidos)
**Altitude Inicial:** 10.200 pés (~3.094m)
**Altitude Máxima:** 12.600 pés (~3.840m) no Hope Pass
**Tipo:** Out-and-back (ida e volta)

Leadville é conhecida como **"Cloud City"** (Cidade das Nuvens) e está situada a mais de 3.000 metros de altitude nas Montanhas Rochosas. O percurso é brutal e técnico:

- 🏔️ **Hope Pass** - O ponto mais alto (12.600 pés) que os corredores atravessam DUAS VEZES
- ⛰️ **Powerline** - Subidas íngremes e exigentes
- 🌲 **Colorado Trail** - Terreno técnico e rochoso
- 🏞️ **Sugarloaf Pass** - Passagem de alta altitude
- 💨 **Twin Lakes** - Ponto crucial de apoio e viragem

### 🎯 Características do Percurso

- **Distância:** 100 milhas (160,9 km)
- **Desnível Positivo:** +15.000 pés (~4.800m)
- **Desnível Negativo:** -15.000 pés (~4.800m)
- **Altitude:** 10.200 - 12.600 pés (3.094 - 3.840m)
- **Tipo de Terreno:** Trilhas, caminhos de montanha, Colorado Trail
- **Dificuldade:** Extrema (altitude + desnível + distância)

## 🎯 A Prova

### 💪 O Desafio

O Leadville Trail 100 não é apenas uma corrida - é um teste supremo de:

- ✅ **Resistência física** a altitudes extremas
- ✅ **Força mental** para superar 30 horas de esforço
- ✅ **Adaptação à altitude** (ar rarefeito)
- ✅ **Gestão de esforço** em terreno técnico
- ✅ **Resiliência** face a condições meteorológicas imprevisíveis

### 🏆 Belt Buckles Legendárias

**Sub-25 horas:** Fivela de cinto DOURADA 🥇
- Apenas para os atletas de elite
- Símbolo máximo de excelência em ultra trail

**Sub-30 horas:** Fivela de cinto PRATEADA 🥈
- Para todos os finishers dentro do limite
- Reconhecimento de uma conquista extraordinária

## 📅 História da Prova

Criada em **1983** por **Ken Chlouber**, um mineiro local que queria trazer atenção para Leadville após o encerramento da Mina Climax. A primeira edição teve apenas **45 corredores**.

### 🌟 Marcos Históricos

- **1983:** Primeira edição com 45 participantes
- **1994:** Ann Trason estabelece recorde feminino lendário
- **2006:** Matt Carpenter bate recorde masculino
- **2023:** 40ª edição da prova
- **2026:** 43ª edição - A lenda continua

Ao longo dos anos, a prova atraiu atletas de elite de todo o mundo e tornou-se num dos quatro "Grand Slam" de 100 milhas dos Estados Unidos.

## 🎫 Inscrição e Qualificação

### 🎲 Sistema de Inscrição

O acesso ao Leadville Trail 100 funciona através de vários sistemas:

#### 1️⃣ **Lotaria (Lottery)**
- Sistema de sorteio para lugares disponíveis
- Aberto a todos os corredores
- Anúncio de resultados geralmente em dezembro/janeiro

#### 2️⃣ **Qualifying Races**
- Performances qualificadoras em outras provas
- Silver Rush 50 Mile (prova qualificadora oficial)
- Outras ultras com tempos qualificadores

#### 3️⃣ **Training Camp + Entry**
- Pacotes com camp de treino + vaga garantida
- Investimento: ~$2.000+
- Treino com coaches experientes

#### 4️⃣ **Charity Slots**
- Vagas através de angariação para instituições
- Garantia de participação
- Contributo para causas sociais

### 💰 Preços

- **Entry Fee (Lotaria):** $195 - $225
- **Training Camp + Entry:** ~$2.000+
- **Camp Only:** ~$1.000

## 🏁 Logística da Prova

### ⏰ Horários

**Partida:** 22 de Agosto de 2026 - 04:00 AM (MT)
**Chegada (limite):** 23 de Agosto de 2026 - 10:00 AM (MT)
**Limite de Tempo:** 30 horas

### 📍 Postos de Abastecimento

A prova tem **13 postos de abastecimento principais**:

1. **May Queen** (Mile 13 / 87) - 10.600 ft
2. **Outward Bound** (Mile 23.5 / 76.5) - 10.000 ft
3. **Halfmoon** (Mile 30 / 70) - 10.000 ft
4. **Twin Lakes** (Mile 40 / 60) - 9.200 ft ⭐ Ponto crucial
5. **Hope Pass Summit** (Mile 43) - 12.600 ft 🏔️ Ponto mais alto
6. **Winfield** (Mile 50) - 10.200 ft 🔄 Viragem (halfway)
7. **Hope Pass Summit Return** (Mile 57) - 12.600 ft 🏔️ Segunda vez!

Cada posto tem:
- 💧 Água e bebidas eletrolíticas
- 🍲 Comida quente e fria
- 🏥 Assistência médica
- ⏱️ Controlo de cut-offs
- 👥 Crew access (zonas designadas)

### 👟 Pacers

- ✅ **Permitidos após Mile 61.5** (~99 km / Twin Lakes outbound)
- 1 pacer de cada vez até à meta
- Pacer deve ter +18 anos
- Deve estar preparado para altitude e terreno
- Não pode carregar equipamento do corredor

### 🚗 Crew Support

- ✅ Permitido em **zonas designadas** (May Queen, Twin Lakes, Halfmoon, Winfield)
- ❌ Proibido em outros pontos do percurso
- Crew pode fornecer comida, bebida, roupa, assistência
- Respeitar sempre as regras de acesso

## 🎽 Equipamento Obrigatório

### Equipamento de Segurança

- 🔦 **2x Lanternas frontais** com baterias extra
- 🎒 **Mochila/colete** de trail running
- 📱 **Telemóvel** (emergências)
- 🧥 **Casaco impermeável** com capuz
- 🧤 **Luvas** (temperaturas noturnas < 0°C)
- 🧢 **Gorro/chapéu**
- 🥤 **Copo dobrável** (150ml mínimo)
- 💧 **Reserva de água** (mínimo 1L)
- 🍫 **Reserva de comida** (mínimo 800 kcal)

### 🌡️ Condições Meteorológicas

**Temperaturas em Agosto:**
- ☀️ Dia: até 25°C (77°F)
- 🌙 Noite: até -4°C (25°F)
- ⛈️ Trovoadas frequentes à tarde
- ❄️ Possibilidade de neve/granizo em altitude
- ⚡ Perigo de relâmpagos acima da tree line

**⚠️ AVISO:** Hipotermia é um risco real. Leva SEMPRE equipamento adequado para Hope Pass.

## 🏆 Destaques do Evento

- 🌍 **Uma das 4 Grand Slam 100 Miles** dos EUA
- 🥇 **Desde 1983** - 43 anos de história
- 🏔️ **Altitude Extrema** - 3.094m a 3.840m
- 👥 **Prova Lendária** - referência mundial em ultra trail
- 🎖️ **Belt Buckles** - Ouro (sub-25h) e Prata (sub-30h)
- 📚 **Livro "Born to Run"** popularizou a prova
- 🎬 **Documentários** celebram a lenda de Leadville
- ⛰️ **Hope Pass** - O ponto mais icónico e difícil

## 🎪 Race Across the Sky Expo

**Datas:** 20-21 de Agosto de 2026
**Local:** Downtown Leadville (Main Street)

O Expo é gratuito e aberto ao público:
- 🎽 Check-in e levantamento de dorsais
- 🏪 Exposição de marcas e produtos
- 🎤 Palestras e podcasts ao vivo
- 🍺 Tendas de cerveja e food trucks
- 🚴 Demos de equipamento
- 📸 Meet & greet com atletas

## 📋 Regras Importantes

### Autonomia e Segurança

- ✅ Cada corredor deve ser auto-suficiente entre postos
- ✅ Obrigatório passar por TODOS os checkpoints
- ✅ Cortes de tempo rigorosamente aplicados
- ❌ Proibido sair do percurso marcado
- ❌ Proibido receber ajuda fora das zonas crew
- ❌ Animais não são permitidos

### Altitude e Saúde

- ⚠️ **Aclimatação** recomendada (chegar 3-7 dias antes)
- ⚠️ **Mal de altitude** é comum acima de 3.000m
- ⚠️ **Hidratação** crítica em altitude
- ⚠️ **Sinais de alerta:** dores de cabeça, náuseas, tonturas
- 🏥 Assistência médica disponível em todos os postos

## 🎯 Perfil do Corredor

### Quem deve participar?

**Experiência Mínima Recomendada:**
- ✅ Pelo menos 1-2 ultras de 100km completadas
- ✅ Experiência em trail técnico de montanha
- ✅ Treino específico de altitude (se possível)
- ✅ Capacidade mental para 30 horas de esforço
- ✅ Experiência em corrida noturna
- ✅ Gestão de nutrição/hidratação em ultra distância

**Esta prova NÃO é recomendada para:**
- ❌ Corredores sem experiência em ultras
- ❌ Primeira experiência em alta altitude
- ❌ Sem preparação física/mental adequada
- ❌ Sem sistema de suporte (crew/pacers)

## 🌐 Informações Oficiais

- **Website:** [leadvilleraceseries.com](https://www.leadvilleraceseries.com/run/leadvilletrail100run/)
- **Regulamento:** Disponível no site oficial
- **GPX File:** Download disponível após inscrição
- **Course Profile:** Perfil de altitude completo disponível
- **Aid Station Chart:** Tabela detalhada de postos e cut-offs

## 🚗 Como Chegar

**Aeroporto:** Denver International Airport (DEN)
- 🚗 ~2.5 horas de carro até Leadville
- 🚙 Recomenda-se carro alugado
- 🏨 Alojamento em Leadville ou arredores

**Altitude de Leadville:** 10.152 pés (3.094m)
- Mais alta cidade incorporada dos EUA
- Aclimatação recomendada

---

**"Better to be at the starting line, than on the couch thinking about it."**
*— Ken Chlouber, Fundador do Leadville Trail 100*

**Boa sorte e boas corridas! 🏔️🏃‍♂️**`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-08-22T10:00:00Z"),
      endDate: null,
      city: "Leadville",
      country: "Estados Unidos",
      latitude: 39.25,
      longitude: -106.29,
      googleMapsUrl: "https://www.google.com/maps?q=39.2500,-106.2900",
      externalUrl:
        "https://www.leadvilleraceseries.com/run/leadvilletrail100run/",
      imageUrl:
        "https://www.leadvilleraceseries.com/wp-content/uploads/2023/08/LT100-Run-Hero.jpg",
      isFeatured: true,
      registrationDeadline: new Date("2026-01-15T07:59:59Z"),
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
      title: "Leadville Trail 100 Run - Race Across the Sky",
      description: `Ultra trail 100 milhas em Leadville, Colorado a altitudes extremas (10.200-12.600 pés). Hope Pass, 15.000 ft D+. Belt buckle ouro (sub-25h) e prata (sub-30h). Desde 1983.`,
      city: "Leadville",
      metaTitle:
        "Leadville Trail 100 Run 2026 - Race Across the Sky | 22 Agosto",
      metaDescription:
        "Leadville Trail 100 Run 2026 - 100 milhas (161 km) a 3.094-3.840m altitude. Hope Pass 2x. 15.000 ft D+. Belt buckles ouro/prata. Grand Slam USA. Lotaria até janeiro.",
    },
    en: {
      title: "Leadville Trail 100 Run - Race Across the Sky",
      description: `100-mile ultra trail in Leadville, Colorado at extreme altitude (10,200-12,600 ft). Hope Pass, 15,000 ft D+. Gold (sub-25h) and silver (sub-30h) belt buckles. Since 1983.`,
      city: "Leadville",
      metaTitle: "Leadville Trail 100 Run 2026 - Race Across the Sky | Aug 22",
      metaDescription:
        "Leadville Trail 100 Run 2026 - 100 miles (161 km) at 10,200-12,600 ft altitude. Hope Pass 2x. 15,000 ft D+. Gold/silver belt buckles. USA Grand Slam. Lottery until January.",
    },
    es: {
      title: "Leadville Trail 100 Run - Race Across the Sky",
      description: `Ultra trail 100 millas en Leadville, Colorado a altitud extrema (10.200-12.600 pies). Hope Pass, 15.000 ft D+. Hebillas oro (sub-25h) y plata (sub-30h). Desde 1983.`,
      city: "Leadville",
      metaTitle:
        "Leadville Trail 100 Run 2026 - Race Across the Sky | 22 Agosto",
      metaDescription:
        "Leadville Trail 100 Run 2026 - 100 millas (161 km) a 3.094-3.840m altitud. Hope Pass 2x. 15.000 ft D+. Hebillas oro/plata. Grand Slam USA. Lotería hasta enero.",
    },
    fr: {
      title: "Leadville Trail 100 Run - Race Across the Sky",
      description: `Ultra trail 100 miles à Leadville, Colorado en altitude extrême (10.200-12.600 pieds). Hope Pass, 15.000 ft D+. Boucles or (sub-25h) et argent (sub-30h). Depuis 1983.`,
      city: "Leadville",
      metaTitle: "Leadville Trail 100 Run 2026 - Race Across the Sky | 22 Août",
      metaDescription:
        "Leadville Trail 100 Run 2026 - 100 miles (161 km) à 3.094-3.840m altitude. Hope Pass 2x. 15.000 ft D+. Boucles or/argent. Grand Slam USA. Loterie jusqu'en janvier.",
    },
    de: {
      title: "Leadville Trail 100 Run - Race Across the Sky",
      description: `100-Meilen-Ultra-Trail in Leadville, Colorado in extremer Höhe (10.200-12.600 Fuß). Hope Pass, 15.000 ft D+. Gold- (sub-25h) und Silberschnallen (sub-30h). Seit 1983.`,
      city: "Leadville",
      metaTitle:
        "Leadville Trail 100 Run 2026 - Race Across the Sky | 22. August",
      metaDescription:
        "Leadville Trail 100 Run 2026 - 100 Meilen (161 km) auf 3.094-3.840m Höhe. Hope Pass 2x. 15.000 ft D+. Gold-/Silberschnallen. USA Grand Slam. Lotterie bis Januar.",
    },
    it: {
      title: "Leadville Trail 100 Run - Race Across the Sky",
      description: `Ultra trail 100 miglia a Leadville, Colorado ad altitudine estrema (10.200-12.600 piedi). Hope Pass, 15.000 ft D+. Fibbie oro (sub-25h) e argento (sub-30h). Dal 1983.`,
      city: "Leadville",
      metaTitle:
        "Leadville Trail 100 Run 2026 - Race Across the Sky | 22 Agosto",
      metaDescription:
        "Leadville Trail 100 Run 2026 - 100 miglia (161 km) a 3.094-3.840m altitudine. Hope Pass 2x. 15.000 ft D+. Fibbie oro/argento. Grand Slam USA. Lotteria fino a gennaio.",
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

  // Step 3: Upsert variant
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

  console.log("💪 Creating/updating event variant...");

  // Single Variant: 100 Miles
  const variant100M = await findOrCreateVariant("100 Miles", {
    description:
      "100 milhas (~161 km) pelas Montanhas Rochosas. Altitude extrema: 10.200-12.600 pés. Hope Pass 2x. Limite: 30 horas. Belt buckle ouro (sub-25h) ou prata (sub-30h).",
    distanceKm: 161,
    elevationGainM: 4800,
    elevationLossM: 4800,
    startDate: new Date("2026-08-22T10:00:00Z"), // 4:00 AM MT
    startTime: "04:00",
    maxParticipants: null,
    cutoffTimeHours: 30.0,
    currency: Currency.USD,
    itraPoints: null,
    atrpGrade: null,
    mountainLevel: null,
  });

  console.log("✅ Variant upserted with ID:", variant100M.id);

  // Step 4: Upsert variant translations (ALL 6 LANGUAGES)
  const variantTranslations = {
    pt: {
      name: "100 Milhas",
      description:
        "100 milhas (~161 km) pelas Montanhas Rochosas. Altitude extrema: 10.200-12.600 pés (3.094-3.840m). Hope Pass atravessado 2 vezes. Limite: 30 horas. Belt buckle dourada (sub-25h) ou prateada (sub-30h).",
    },
    en: {
      name: "100 Miles",
      description:
        "100 miles (~161 km) through the Rocky Mountains. Extreme altitude: 10,200-12,600 ft (3,094-3,840m). Hope Pass crossed 2 times. Cutoff: 30 hours. Gold belt buckle (sub-25h) or silver (sub-30h).",
    },
    es: {
      name: "100 Millas",
      description:
        "100 millas (~161 km) por las Montañas Rocosas. Altitud extrema: 10.200-12.600 pies (3.094-3.840m). Hope Pass cruzado 2 veces. Límite: 30 horas. Hebilla dorada (sub-25h) o plata (sub-30h).",
    },
    fr: {
      name: "100 Miles",
      description:
        "100 miles (~161 km) à travers les Montagnes Rocheuses. Altitude extrême: 10.200-12.600 pieds (3.094-3.840m). Hope Pass traversé 2 fois. Limite: 30 heures. Boucle d'or (sub-25h) ou d'argent (sub-30h).",
    },
    de: {
      name: "100 Meilen",
      description:
        "100 Meilen (~161 km) durch die Rocky Mountains. Extreme Höhe: 10.200-12.600 Fuß (3.094-3.840m). Hope Pass 2x überquert. Zeitlimit: 30 Stunden. Goldschnalle (sub-25h) oder Silber (sub-30h).",
    },
    it: {
      name: "100 Miglia",
      description:
        "100 miglia (~161 km) attraverso le Montagne Rocciose. Altitudine estrema: 10.200-12.600 piedi (3.094-3.840m). Hope Pass attraversato 2 volte. Limite: 30 ore. Fibbia d'oro (sub-25h) o d'argento (sub-30h).",
    },
  };

  for (const lang of languages) {
    await prisma.eventVariantTranslation.upsert({
      where: {
        variantId_language: {
          variantId: variant100M.id,
          language: lang,
        },
      },
      update: {
        name: variantTranslations[lang].name,
        description: variantTranslations[lang].description,
      },
      create: {
        variantId: variant100M.id,
        language: lang,
        name: variantTranslations[lang].name,
        description: variantTranslations[lang].description,
      },
    });
  }

  console.log("📝 Variant translations upserted for 6 languages");

  // Step 5: Delete existing pricing phases to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("🗑️ Deleted existing pricing phases for idempotency");

  // Step 6: Create pricing phases (LINKED TO eventId, NOT variantId)
  console.log("💰 Creating pricing phases...");

  // Lottery Entry
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "100 Miles - Lottery Entry",
      startDate: new Date("2025-10-01T00:00:00Z"),
      endDate: new Date("2026-01-15T07:59:59Z"),
      price: 210.0,
      currency: Currency.USD,
      discountPercent: null,
      note: "Lottery entry fee. Results announced in January. Includes bib, timing, aid stations, medical support, and belt buckle (finishers).",
    },
  });

  // Training Camp + Entry Package
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "100 Miles - Training Camp + Entry",
      startDate: new Date("2025-10-01T00:00:00Z"),
      endDate: new Date("2026-08-20T07:59:59Z"),
      price: 2000.0,
      currency: Currency.USD,
      discountPercent: null,
      note: "Guaranteed entry with training camp. Includes expert coaching, altitude training preparation, and race entry.",
    },
  });

  console.log("💰 Pricing phases created (linked to eventId)");
  console.log("✅ Leadville Trail 100 Run 2026 seed completed successfully!");
  console.log("");
  console.log("📋 Summary:");
  console.log("   🏔️ Event: Leadville Trail 100 Run - Race Across the Sky");
  console.log("   📅 Date: August 22, 2026");
  console.log("   📍 Location: Leadville, Colorado, USA");
  console.log("   🏃 Distance: 100 miles (161 km)");
  console.log("   ⛰️ Altitude: 10,200 - 12,600 ft (3,094 - 3,840m)");
  console.log("   📈 Elevation Gain: 15,000 ft (~4,800m)");
  console.log("   ⏱️ Cutoff: 30 hours");
  console.log("   🌍 Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("   💰 Pricing: 2 phases (Lottery + Training Camp)");
  console.log(
    "   🔗 Website: https://www.leadvilleraceseries.com/run/leadvilletrail100run/"
  );
  console.log(
    "   🏆 Features: Grand Slam USA, Gold/Silver Belt Buckles, Hope Pass"
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
