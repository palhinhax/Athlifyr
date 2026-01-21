/**
 * Seed Ragnar Trail Atlanta 2026
 * Complete with translations in all 6 languages
 * Idempotent pattern - safe to run multiple times
 */

import { PrismaClient, SportType, Language, Currency } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏕️ Seeding Ragnar Trail Atlanta 2026...");

  // Step 1: Upsert the event ONLY (no nested creates)
  const event = await prisma.event.upsert({
    where: { slug: "ragnar-trail-atlanta-2026" },
    update: {
      title: "Ragnar Trail Atlanta",
      description: `# 🏞️ Ragnar Trail Atlanta 2026

**Ragnar Trail Atlanta** é uma experiência única de trail relay que combina corrida em trilhos florestais, camping sob estrelas e espírito de equipa. O evento decorre no histórico **Georgia International Horse Park**, em Conyers, Georgia, local que recebeu os **Jogos Olímpicos de 1996**.

## 📍 Localização e História

**Local:** Georgia International Horse Park, Conyers, Georgia
**Coordenadas:** 33.622560, -83.987940
**Endereço:** 1996 Centennial Olympic Pkwy NE, Conyers, GA 30013

Este venue icónico foi palco das provas de equestre, ciclismo de montanha e pentatlo moderno dos Jogos Olímpicos de Atlanta 1996. Hoje, é um dos segredos mais bem guardados da Geórgia, oferecendo trilhos suaves e técnicos através de florestas de pinheiros e ao longo do Yellow River.

### 🌲 Características dos Trilhos

- ✨ **Singletrack suave** através de florestas de pinheiros da Geórgia
- 🌊 **Vistas do Yellow River** e pontes cobertas
- 🚵 **Flow trails de MTB** com curvas técnicas e divertidas
- 🌳 **Terreno variado:** singletrack, clay, hardpack
- 🏞️ **Elevação baixa:** apenas 110m de D+ total (um dos Ragnar mais acessíveis!)

## 🏃 Formato de Corrida

**Duração:** 2 dias / 1 noite (10-11 Abril 2026)
**Distância Total por Equipa:** 126.4 milhas (~203.3 km)
**Sistema de Loops:** 3 trilhos diferentes

### 🔁 Os Loops

Cada corredor completa os 3 loops em sequência:

| Loop | Distância Estimada | Dificuldade | Características |
|------|-------------------|-------------|-----------------|
| 🟢 Green Loop | 3-4 milhas | Fácil | Singletrack suave |
| 🟡 Yellow Loop | 5-6 milhas | Moderado | MTB trail técnico |
| 🔴 Red Loop | 7-8 milhas | Técnico | Floresta, roots e pontes |

**Total por corredor (Standard 8):** ~15.8 milhas (~25.4 km)

## 👥 Tipos de Equipa

### 🥇 Standard Team (8 corredores)
- **Formato:** 8 atletas
- **Duração:** 2 dias, 1 noite
- **Distância por corredor:** ~15.8 milhas (~25.4 km)
- **Preço:** $1,645 ($205 por corredor)
- **Ideal para:** Equipas que procuram a experiência completa Ragnar com revezamento 24h

### 🥈 Ultra Team (4 corredores)
- **Formato:** 4 atletas
- **Duração:** 2 dias, 1 noite
- **Distância por corredor:** ~31.6 milhas (~50.8 km)
- **Preço:** $925 ($231 por corredor)
- **Ideal para:** Ultra runners que querem um desafio maior com equipa reduzida

### 🥉 Sprint Team (3 corredores)
- **Formato:** 3 atletas
- **Duração:** 1 dia
- **Distância por corredor:** Percurso simplificado
- **Preço:** $400 ($133 por corredor)
- **Ideal para:** Iniciantes ou equipas que preferem experiência mais curta

## 🎪 Ragnar Village

Quando não estás a correr, aproveita o **Ragnar Village** - o teu lar durante o fim de semana!

### ✨ Experiências Incluídas

- 🔥 **Bonfires** - S'mores e convívio à volta da fogueira
- 🎵 **Música ao vivo** - Ambiente festivo durante todo o evento
- 🧘 **Yoga sessions** - Recuperação e relaxamento entre corridas
- 🏆 **Prémios e sorteios** - Oportunidades de ganhar brindes
- ⭐ **Camping sob estrelas** - Experiência autêntica de acampamento
- 🍔 **Food trucks** - Variedade de opções de comida
- 🥤 **Beverage vendors** - Bebidas e snacks disponíveis

### 🎁 Bonus Night (Quinta-feira opcional)

Chega cedo e aproveita a **Bonus Night** - uma noite extra de camping, convívio e diversão com os amigos antes da corrida começar!

## 🏕️ Opções de Alojamento

### ⛺ Camping Standard (Incluído)
- Espaço para tenda incluído no registo
- Acesso a todas as amenidades do Ragnar Village
- Sanitários e duches disponíveis

### ✨ Glamping (Upgrade Opcional)
- **"Why camp when you can Glamp?"**
- Tendas pré-montadas com camas confortáveis
- Setup premium sem o trabalho de montar tenda
- Disponível mediante reserva adicional (~$300-$700)

### 🏠 Rent-A-Tent
- Opção económica para quem não tem equipamento
- Tendas fornecidas e montadas (~$100-$200)
- Ideal para quem voa para o evento

## 🎽 O Que Está Incluído

Cada equipa recebe:

- ✅ **Amostras de parceiros** - Produtos e samples de marcas patrocinadoras
- ✅ **Presente do capitão** - Kit especial para o líder da equipa
- ✅ **Medalhas de equipa** - Medalha finisher para cada membro
- ✅ **T-shirts finisher** - Camisola oficial de finisher para todos
- ✅ **Acesso ao Ragnar Village** - Todas as atividades e amenidades
- ✅ **Chip de cronometragem** - Sistema de tracking para todas as voltas
- ✅ **Parqueamento** - Estacionamento para veículos da equipa

## 🌤️ Clima e Condições

**Temperatura esperada em Abril:**
- ☀️ **Dia:** 22-26°C (mid-70s Fahrenheit)
- 🌙 **Noite:** 10-14°C (50s Fahrenheit)
- 💧 **Humidade:** Média
- 🌧️ **Chuva:** Possível chuva primaveril ocasional
- 🌫️ **Manhãs:** Nevoeiro leve possível

**Recomendações:**
- Roupa leve e respirável para o dia
- Camadas para as noites mais frescas
- Headlamp obrigatório para voltas noturnas
- Protetor solar e chapéu
- Casaco impermeável (precaução)

## 📋 Equipamento Obrigatório

### Para Corrida
- 💡 **Headlamp** - Obrigatório para voltas noturnas (200+ lumens recomendado)
- 📱 **Telemóvel** - Para segurança e comunicação com equipa
- 💧 **Garrafa de água** - Hidratação nos loops
- 👟 **Sapatilhas trail** - Apropriadas para singletrack e terreno técnico

### Para Camping
- ⛺ **Tenda** - Se não usar glamping ou rent-a-tent
- 🛏️ **Saco-cama** - Temperaturas 10-14°C à noite
- 🔦 **Lanterna** - Iluminação no acampamento
- 🧴 **Higiene pessoal** - Sanitários e duches disponíveis

## 🏆 Espírito Ragnar

**"Making life more awesome one adventure at a time"**

Ragnar não é sobre tempos de corrida ou pódios - é sobre:

- 🤝 **Trabalho de equipa** - Apoiar os teus companheiros durante 24h
- 🎉 **Aventura** - Sair da zona de conforto e criar memórias
- 💪 **Resiliência** - Ultrapassar desafios pessoais e em equipa
- 😄 **Diversão** - Rir, celebrar e aproveitar cada momento
- 🌟 **Comunidade** - Fazer parte da comunidade de corrida mais amigável do país

## ✈️ Como Chegar

**Aeroporto mais próximo:**
**ATL - Hartsfield-Jackson Atlanta International Airport**
- Distância: ~45 minutos de carro do venue
- Um dos maiores hubs mundiais com voos diretos de todo o mundo
- Rent-a-car disponível no aeroporto

**Estacionamento:**
- Parqueamento disponível no venue
- Taxa: ~$10-$20 por veículo
- Acesso fácil - não necessita 4x4

## 🎯 Para Quem é Este Evento?

### ✅ Perfeito para:
- Corredores urbanos que querem experimentar trail
- Triatletas em base training de primavera
- Equipas corporativas e grupos de amigos
- Atletas que transitam de estrada para trail
- Qualquer pessoa que procura aventura e diversão

### 🌟 Destaque Especial:
Um dos eventos Ragnar Trail mais acessíveis tecnicamente, com apenas 110m de elevação total. Ideal para iniciantes em trail running que querem experimentar o formato relay overnight num ambiente seguro e festivo!

## 🎒 Dicas e Preparação

### 📝 Recursos Oficiais (Disponíveis no site)
- **2026 Runner Packet** - Informação completa do corredor
- **Packing List** - Lista de equipamento recomendado
- **Captain's Checklist** - Guia para organizadores de equipa
- **Captain's Spreadsheet** - Ferramenta de gestão de equipa
- **2025 Trail Guide** - Mapas e informação dos loops

### 🎯 Estratégias de Equipa
1. **Comunicação** - Manter todos informados sobre timing
2. **Descanso** - Planear sono entre corridas
3. **Nutrição** - Levar comida suficiente (food trucks disponíveis)
4. **Pacing** - Gerir energia para múltiplas voltas
5. **Espírito de equipa** - Apoio mútuo é essencial!

## 💼 Parcerias e Descontos

**Alojamento fora do venue:**
- Hotéis em Conyers, Lithonia e East Atlanta
- Descontos exclusivos Ragnar através da **Hotel Engine** (até 60% off)

**Transporte:**
- Descontos em rent-a-car via **Avis e Budget**
- Vans disponíveis para equipas maiores

## 🌍 Turismo na Região

Aproveita para explorar a região:

- 🏙️ **Atlanta City** - Museus, música, história (30 min)
- 🏔️ **Stone Mountain Park** - Parque natural icónico
- 🌊 **Yellow River** - Kayaking e natureza
- 🌲 **Arabia Mountain** - Trilhos adicionais
- 🍗 **BBQ & Southern Food** - Gastronomia sulista autêntica
- 🏛️ **Martin Luther King Jr. Historic District** - História e cultura
- 🎥 **Georgia Film Tours** - Locais de filmagem de filmes Marvel

## 📞 Informações Oficiais

- **Website:** [runragnar.com](https://runragnar.com/pages/race-trail-atlanta)
- **Redes Sociais:** @RunRagnar
- **Check-in de Capitães:** No venue antes da corrida
- **Expo:** Levantamento de dorsais e briefings

---

**🏞️ Vemo-nos nos trilhos da Geórgia! 🏃‍♂️⛺**`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-04-10T13:00:00Z"), // April 10, 2026 - approximate start time
      endDate: new Date("2026-04-11T23:00:00Z"), // April 11, 2026 - approximate end
      city: "Conyers",
      country: "Estados Unidos",
      latitude: 33.62256,
      longitude: -83.98794,
      googleMapsUrl: "https://maps.google.com/?q=33.622560,-83.987940",
      externalUrl: "https://runragnar.com/pages/race-trail-atlanta",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-08T07:59:59Z"),
    },
    create: {
      title: "Ragnar Trail Atlanta",
      slug: "ragnar-trail-atlanta-2026",
      description: `# 🏞️ Ragnar Trail Atlanta 2026

**Ragnar Trail Atlanta** é uma experiência única de trail relay que combina corrida em trilhos florestais, camping sob estrelas e espírito de equipa. O evento decorre no histórico **Georgia International Horse Park**, em Conyers, Georgia, local que recebeu os **Jogos Olímpicos de 1996**.

## 📍 Localização e História

**Local:** Georgia International Horse Park, Conyers, Georgia
**Coordenadas:** 33.622560, -83.987940
**Endereço:** 1996 Centennial Olympic Pkwy NE, Conyers, GA 30013

Este venue icónico foi palco das provas de equestre, ciclismo de montanha e pentatlo moderno dos Jogos Olímpicos de Atlanta 1996. Hoje, é um dos segredos mais bem guardados da Geórgia, oferecendo trilhos suaves e técnicos através de florestas de pinheiros e ao longo do Yellow River.

### 🌲 Características dos Trilhos

- ✨ **Singletrack suave** através de florestas de pinheiros da Geórgia
- 🌊 **Vistas do Yellow River** e pontes cobertas
- 🚵 **Flow trails de MTB** com curvas técnicas e divertidas
- 🌳 **Terreno variado:** singletrack, clay, hardpack
- 🏞️ **Elevação baixa:** apenas 110m de D+ total (um dos Ragnar mais acessíveis!)

## 🏃 Formato de Corrida

**Duração:** 2 dias / 1 noite (10-11 Abril 2026)
**Distância Total por Equipa:** 126.4 milhas (~203.3 km)
**Sistema de Loops:** 3 trilhos diferentes

### 🔁 Os Loops

Cada corredor completa os 3 loops em sequência:

| Loop | Distância Estimada | Dificuldade | Características |
|------|-------------------|-------------|-----------------|
| 🟢 Green Loop | 3-4 milhas | Fácil | Singletrack suave |
| 🟡 Yellow Loop | 5-6 milhas | Moderado | MTB trail técnico |
| 🔴 Red Loop | 7-8 milhas | Técnico | Floresta, roots e pontes |

**Total por corredor (Standard 8):** ~15.8 milhas (~25.4 km)

## 👥 Tipos de Equipa

### 🥇 Standard Team (8 corredores)
- **Formato:** 8 atletas
- **Duração:** 2 dias, 1 noite
- **Distância por corredor:** ~15.8 milhas (~25.4 km)
- **Preço:** $1,645 ($205 por corredor)
- **Ideal para:** Equipas que procuram a experiência completa Ragnar com revezamento 24h

### 🥈 Ultra Team (4 corredores)
- **Formato:** 4 atletas
- **Duração:** 2 dias, 1 noite
- **Distância por corredor:** ~31.6 milhas (~50.8 km)
- **Preço:** $925 ($231 por corredor)
- **Ideal para:** Ultra runners que querem um desafio maior com equipa reduzida

### 🥉 Sprint Team (3 corredores)
- **Formato:** 3 atletas
- **Duração:** 1 dia
- **Distância por corredor:** Percurso simplificado
- **Preço:** $400 ($133 por corredor)
- **Ideal para:** Iniciantes ou equipas que preferem experiência mais curta

## 🎪 Ragnar Village

Quando não estás a correr, aproveita o **Ragnar Village** - o teu lar durante o fim de semana!

### ✨ Experiências Incluídas

- 🔥 **Bonfires** - S'mores e convívio à volta da fogueira
- 🎵 **Música ao vivo** - Ambiente festivo durante todo o evento
- 🧘 **Yoga sessions** - Recuperação e relaxamento entre corridas
- 🏆 **Prémios e sorteios** - Oportunidades de ganhar brindes
- ⭐ **Camping sob estrelas** - Experiência autêntica de acampamento
- 🍔 **Food trucks** - Variedade de opções de comida
- 🥤 **Beverage vendors** - Bebidas e snacks disponíveis

### 🎁 Bonus Night (Quinta-feira opcional)

Chega cedo e aproveita a **Bonus Night** - uma noite extra de camping, convívio e diversão com os amigos antes da corrida começar!

## 🏕️ Opções de Alojamento

### ⛺ Camping Standard (Incluído)
- Espaço para tenda incluído no registo
- Acesso a todas as amenidades do Ragnar Village
- Sanitários e duches disponíveis

### ✨ Glamping (Upgrade Opcional)
- **"Why camp when you can Glamp?"**
- Tendas pré-montadas com camas confortáveis
- Setup premium sem o trabalho de montar tenda
- Disponível mediante reserva adicional (~$300-$700)

### 🏠 Rent-A-Tent
- Opção económica para quem não tem equipamento
- Tendas fornecidas e montadas (~$100-$200)
- Ideal para quem voa para o evento

## 🎽 O Que Está Incluído

Cada equipa recebe:

- ✅ **Amostras de parceiros** - Produtos e samples de marcas patrocinadoras
- ✅ **Presente do capitão** - Kit especial para o líder da equipa
- ✅ **Medalhas de equipa** - Medalha finisher para cada membro
- ✅ **T-shirts finisher** - Camisola oficial de finisher para todos
- ✅ **Acesso ao Ragnar Village** - Todas as atividades e amenidades
- ✅ **Chip de cronometragem** - Sistema de tracking para todas as voltas
- ✅ **Parqueamento** - Estacionamento para veículos da equipa

## 🌤️ Clima e Condições

**Temperatura esperada em Abril:**
- ☀️ **Dia:** 22-26°C (mid-70s Fahrenheit)
- 🌙 **Noite:** 10-14°C (50s Fahrenheit)
- 💧 **Humidade:** Média
- 🌧️ **Chuva:** Possível chuva primaveril ocasional
- 🌫️ **Manhãs:** Nevoeiro leve possível

**Recomendações:**
- Roupa leve e respirável para o dia
- Camadas para as noites mais frescas
- Headlamp obrigatório para voltas noturnas
- Protetor solar e chapéu
- Casaco impermeável (precaução)

## 📋 Equipamento Obrigatório

### Para Corrida
- 💡 **Headlamp** - Obrigatório para voltas noturnas (200+ lumens recomendado)
- 📱 **Telemóvel** - Para segurança e comunicação com equipa
- 💧 **Garrafa de água** - Hidratação nos loops
- 👟 **Sapatilhas trail** - Apropriadas para singletrack e terreno técnico

### Para Camping
- ⛺ **Tenda** - Se não usar glamping ou rent-a-tent
- 🛏️ **Saco-cama** - Temperaturas 10-14°C à noite
- 🔦 **Lanterna** - Iluminação no acampamento
- 🧴 **Higiene pessoal** - Sanitários e duches disponíveis

## 🏆 Espírito Ragnar

**"Making life more awesome one adventure at a time"**

Ragnar não é sobre tempos de corrida ou pódios - é sobre:

- 🤝 **Trabalho de equipa** - Apoiar os teus companheiros durante 24h
- 🎉 **Aventura** - Sair da zona de conforto e criar memórias
- 💪 **Resiliência** - Ultrapassar desafios pessoais e em equipa
- 😄 **Diversão** - Rir, celebrar e aproveitar cada momento
- 🌟 **Comunidade** - Fazer parte da comunidade de corrida mais amigável do país

## ✈️ Como Chegar

**Aeroporto mais próximo:**
**ATL - Hartsfield-Jackson Atlanta International Airport**
- Distância: ~45 minutos de carro do venue
- Um dos maiores hubs mundiais com voos diretos de todo o mundo
- Rent-a-car disponível no aeroporto

**Estacionamento:**
- Parqueamento disponível no venue
- Taxa: ~$10-$20 por veículo
- Acesso fácil - não necessita 4x4

## 🎯 Para Quem é Este Evento?

### ✅ Perfeito para:
- Corredores urbanos que querem experimentar trail
- Triatletas em base training de primavera
- Equipas corporativas e grupos de amigos
- Atletas que transitam de estrada para trail
- Qualquer pessoa que procura aventura e diversão

### 🌟 Destaque Especial:
Um dos eventos Ragnar Trail mais acessíveis tecnicamente, com apenas 110m de elevação total. Ideal para iniciantes em trail running que querem experimentar o formato relay overnight num ambiente seguro e festivo!

## 🎒 Dicas e Preparação

### 📝 Recursos Oficiais (Disponíveis no site)
- **2026 Runner Packet** - Informação completa do corredor
- **Packing List** - Lista de equipamento recomendado
- **Captain's Checklist** - Guia para organizadores de equipa
- **Captain's Spreadsheet** - Ferramenta de gestão de equipa
- **2025 Trail Guide** - Mapas e informação dos loops

### 🎯 Estratégias de Equipa
1. **Comunicação** - Manter todos informados sobre timing
2. **Descanso** - Planear sono entre corridas
3. **Nutrição** - Levar comida suficiente (food trucks disponíveis)
4. **Pacing** - Gerir energia para múltiplas voltas
5. **Espírito de equipa** - Apoio mútuo é essencial!

## 💼 Parcerias e Descontos

**Alojamento fora do venue:**
- Hotéis em Conyers, Lithonia e East Atlanta
- Descontos exclusivos Ragnar através da **Hotel Engine** (até 60% off)

**Transporte:**
- Descontos em rent-a-car via **Avis e Budget**
- Vans disponíveis para equipas maiores

## 🌍 Turismo na Região

Aproveita para explorar a região:

- 🏙️ **Atlanta City** - Museus, música, história (30 min)
- 🏔️ **Stone Mountain Park** - Parque natural icónico
- 🌊 **Yellow River** - Kayaking e natureza
- 🌲 **Arabia Mountain** - Trilhos adicionais
- 🍗 **BBQ & Southern Food** - Gastronomia sulista autêntica
- 🏛️ **Martin Luther King Jr. Historic District** - História e cultura
- 🎥 **Georgia Film Tours** - Locais de filmagem de filmes Marvel

## 📞 Informações Oficiais

- **Website:** [runragnar.com](https://runragnar.com/pages/race-trail-atlanta)
- **Redes Sociais:** @RunRagnar
- **Check-in de Capitães:** No venue antes da corrida
- **Expo:** Levantamento de dorsais e briefings

---

**🏞️ Vemo-nos nos trilhos da Geórgia! 🏃‍♂️⛺**`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-04-10T13:00:00Z"),
      endDate: new Date("2026-04-11T23:00:00Z"),
      city: "Conyers",
      country: "Estados Unidos",
      latitude: 33.62256,
      longitude: -83.98794,
      googleMapsUrl: "https://maps.google.com/?q=33.622560,-83.987940",
      externalUrl: "https://runragnar.com/pages/race-trail-atlanta",
      imageUrl: "",
      isFeatured: true,
      registrationDeadline: new Date("2026-04-08T07:59:59Z"),
    },
  });

  console.log("✅ Event upserted:", event.slug);

  // Step 2: Upsert translations (ALL 6 LANGUAGES with SEO metadata)
  const languages = [
    Language.pt,
    Language.en,
    Language.es,
    Language.fr,
    Language.de,
    Language.it,
  ];

  const translations: Record<
    Language,
    {
      title: string;
      description: string;
      city: string;
      metaTitle: string;
      metaDescription: string;
    }
  > = {
    pt: {
      title: "Ragnar Trail Atlanta",
      description: `Trail relay de 203km em Conyers, Georgia, com loops florestais suaves, camping sob estrelas e espírito de equipa. No Georgia International Horse Park, local dos Jogos Olímpicos de 1996.`,
      city: "Conyers",
      metaTitle: "Ragnar Trail Atlanta 2026 | Conyers, GA | 10-11 Abril",
      metaDescription:
        "Ragnar Trail Atlanta 2026 - Trail relay de 2 dias em Conyers, GA. 3 tipos de equipa: Standard (8), Ultra (4), Sprint (3). 203km total. Georgia International Horse Park. Camping e Ragnar Village incluídos.",
    },
    en: {
      title: "Ragnar Trail Atlanta",
      description: `Trail relay of 203km in Conyers, Georgia, featuring smooth forest loops, camping under stars, and team spirit. At Georgia International Horse Park, home of the 1996 Olympics.`,
      city: "Conyers",
      metaTitle: "Ragnar Trail Atlanta 2026 | Conyers, GA | April 10-11",
      metaDescription:
        "Ragnar Trail Atlanta 2026 - 2-day trail relay in Conyers, GA. 3 team types: Standard (8), Ultra (4), Sprint (3). 203km total. Georgia International Horse Park. Camping and Ragnar Village included.",
    },
    es: {
      title: "Ragnar Trail Atlanta",
      description: `Trail relay de 203km en Conyers, Georgia, con loops forestales suaves, camping bajo las estrellas y espíritu de equipo. En Georgia International Horse Park, sede de los Juegos Olímpicos de 1996.`,
      city: "Conyers",
      metaTitle: "Ragnar Trail Atlanta 2026 | Conyers, GA | 10-11 Abril",
      metaDescription:
        "Ragnar Trail Atlanta 2026 - Trail relay de 2 días en Conyers, GA. 3 tipos de equipo: Standard (8), Ultra (4), Sprint (3). 203km total. Georgia International Horse Park. Camping y Ragnar Village incluidos.",
    },
    fr: {
      title: "Ragnar Trail Atlanta",
      description: `Trail relay de 203km à Conyers, Géorgie, avec des boucles forestières douces, camping sous les étoiles et esprit d'équipe. Au Georgia International Horse Park, site des Jeux Olympiques de 1996.`,
      city: "Conyers",
      metaTitle: "Ragnar Trail Atlanta 2026 | Conyers, GA | 10-11 Avril",
      metaDescription:
        "Ragnar Trail Atlanta 2026 - Trail relay de 2 jours à Conyers, GA. 3 types d'équipe: Standard (8), Ultra (4), Sprint (3). 203km total. Georgia International Horse Park. Camping et Ragnar Village inclus.",
    },
    de: {
      title: "Ragnar Trail Atlanta",
      description: `Trail-Relay von 203km in Conyers, Georgia, mit sanften Waldschleifen, Camping unter Sternen und Teamgeist. Im Georgia International Horse Park, Austragungsort der Olympischen Spiele 1996.`,
      city: "Conyers",
      metaTitle: "Ragnar Trail Atlanta 2026 | Conyers, GA | 10-11 April",
      metaDescription:
        "Ragnar Trail Atlanta 2026 - 2-tägiges Trail-Relay in Conyers, GA. 3 Teamarten: Standard (8), Ultra (4), Sprint (3). 203km gesamt. Georgia International Horse Park. Camping und Ragnar Village inklusive.",
    },
    it: {
      title: "Ragnar Trail Atlanta",
      description: `Trail relay di 203km a Conyers, Georgia, con percorsi forestali dolci, campeggio sotto le stelle e spirito di squadra. Al Georgia International Horse Park, sede delle Olimpiadi del 1996.`,
      city: "Conyers",
      metaTitle: "Ragnar Trail Atlanta 2026 | Conyers, GA | 10-11 Aprile",
      metaDescription:
        "Ragnar Trail Atlanta 2026 - Trail relay di 2 giorni a Conyers, GA. 3 tipi di squadra: Standard (8), Ultra (4), Sprint (3). 203km totali. Georgia International Horse Park. Camping e Ragnar Village inclusi.",
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

  // Variant 1: Standard Team (8 runners)
  const variantStandard = await findOrCreateVariant("Standard Team", {
    description:
      "Equipa de 8 corredores. 2 dias, 1 noite. ~15.8 milhas por corredor (~25.4 km). Experiência completa Ragnar com revezamento 24h.",
    distanceKm: 25, // Distance per runner
    elevationGainM: 14, // Elevation gain per runner
    elevationLossM: 14,
    startDate: new Date("2026-04-10T13:00:00Z"),
    startTime: "09:00",
    maxParticipants: null,
    cutoffTimeHours: null,
    currency: Currency.USD,
    itraPoints: null,
    atrpGrade: null,
    mountainLevel: null,
  });

  // Variant 2: Ultra Team (4 runners)
  const variantUltra = await findOrCreateVariant("Ultra Team", {
    description:
      "Equipa de 4 corredores. 2 dias, 1 noite. ~31.6 milhas por corredor (~50.8 km). Desafio maior com equipa reduzida.",
    distanceKm: 51, // Distance per runner
    elevationGainM: 28, // Elevation gain per runner
    elevationLossM: 28,
    startDate: new Date("2026-04-10T13:00:00Z"),
    startTime: "09:00",
    maxParticipants: null,
    cutoffTimeHours: null,
    currency: Currency.USD,
    itraPoints: null,
    atrpGrade: null,
    mountainLevel: null,
  });

  // Variant 3: Sprint Team (3 runners)
  const variantSprint = await findOrCreateVariant("Sprint Team", {
    description:
      "Equipa de 3 corredores. 1 dia. Percurso simplificado. Ideal para iniciantes ou experiência mais curta.",
    distanceKm: null, // Simplified course, distance varies
    elevationGainM: null,
    elevationLossM: null,
    startDate: new Date("2026-04-10T13:00:00Z"),
    startTime: "09:00",
    maxParticipants: null,
    cutoffTimeHours: null,
    currency: Currency.USD,
    itraPoints: null,
    atrpGrade: null,
    mountainLevel: null,
  });

  console.log("✅ All 3 variants upserted");

  // Step 4: Upsert variant translations (ALL 6 LANGUAGES)
  const variantTranslations: Record<
    string,
    Record<string, { name: string; description: string }>
  > = {
    "Standard Team": {
      pt: {
        name: "Equipa Standard",
        description:
          "Equipa de 8 corredores. 2 dias, 1 noite. ~15.8 milhas por corredor (~25.4 km). Preço: $1,645 ($205 por corredor). Experiência completa Ragnar com revezamento 24h.",
      },
      en: {
        name: "Standard Team",
        description:
          "Team of 8 runners. 2 days, 1 night. ~15.8 miles per runner (~25.4 km). Price: $1,645 ($205 per runner). Full Ragnar experience with 24h relay.",
      },
      es: {
        name: "Equipo Standard",
        description:
          "Equipo de 8 corredores. 2 días, 1 noche. ~15.8 millas por corredor (~25.4 km). Precio: $1,645 ($205 por corredor). Experiencia Ragnar completa con relevo de 24h.",
      },
      fr: {
        name: "Équipe Standard",
        description:
          "Équipe de 8 coureurs. 2 jours, 1 nuit. ~15.8 miles par coureur (~25.4 km). Prix: $1,645 ($205 par coureur). Expérience Ragnar complète avec relais 24h.",
      },
      de: {
        name: "Standard Team",
        description:
          "Team von 8 Läufern. 2 Tage, 1 Nacht. ~15.8 Meilen pro Läufer (~25.4 km). Preis: $1,645 ($205 pro Läufer). Vollständiges Ragnar-Erlebnis mit 24h-Staffel.",
      },
      it: {
        name: "Squadra Standard",
        description:
          "Squadra di 8 corridori. 2 giorni, 1 notte. ~15.8 miglia per corridore (~25.4 km). Prezzo: $1,645 ($205 per corridore). Esperienza Ragnar completa con staffetta 24h.",
      },
    },
    "Ultra Team": {
      pt: {
        name: "Equipa Ultra",
        description:
          "Equipa de 4 corredores. 2 dias, 1 noite. ~31.6 milhas por corredor (~50.8 km). Preço: $925 ($231 por corredor). Desafio maior com equipa reduzida.",
      },
      en: {
        name: "Ultra Team",
        description:
          "Team of 4 runners. 2 days, 1 night. ~31.6 miles per runner (~50.8 km). Price: $925 ($231 per runner). Greater challenge with reduced team size.",
      },
      es: {
        name: "Equipo Ultra",
        description:
          "Equipo de 4 corredores. 2 días, 1 noche. ~31.6 millas por corredor (~50.8 km). Precio: $925 ($231 por corredor). Mayor desafío con equipo reducido.",
      },
      fr: {
        name: "Équipe Ultra",
        description:
          "Équipe de 4 coureurs. 2 jours, 1 nuit. ~31.6 miles par coureur (~50.8 km). Prix: $925 ($231 par coureur). Plus grand défi avec équipe réduite.",
      },
      de: {
        name: "Ultra Team",
        description:
          "Team von 4 Läufern. 2 Tage, 1 Nacht. ~31.6 Meilen pro Läufer (~50.8 km). Preis: $925 ($231 pro Läufer). Größere Herausforderung mit reduzierter Teamgröße.",
      },
      it: {
        name: "Squadra Ultra",
        description:
          "Squadra di 4 corridori. 2 giorni, 1 notte. ~31.6 miglia per corridore (~50.8 km). Prezzo: $925 ($231 per corridore). Sfida maggiore con squadra ridotta.",
      },
    },
    "Sprint Team": {
      pt: {
        name: "Equipa Sprint",
        description:
          "Equipa de 3 corredores. 1 dia. Percurso simplificado. Preço: $400 ($133 por corredor). Ideal para iniciantes ou experiência mais curta.",
      },
      en: {
        name: "Sprint Team",
        description:
          "Team of 3 runners. 1 day. Simplified course. Price: $400 ($133 per runner). Ideal for beginners or shorter experience.",
      },
      es: {
        name: "Equipo Sprint",
        description:
          "Equipo de 3 corredores. 1 día. Recorrido simplificado. Precio: $400 ($133 por corredor). Ideal para principiantes o experiencia más corta.",
      },
      fr: {
        name: "Équipe Sprint",
        description:
          "Équipe de 3 coureurs. 1 jour. Parcours simplifié. Prix: $400 ($133 par coureur). Idéal pour débutants ou expérience plus courte.",
      },
      de: {
        name: "Sprint Team",
        description:
          "Team von 3 Läufern. 1 Tag. Vereinfachter Kurs. Preis: $400 ($133 pro Läufer). Ideal für Anfänger oder kürzere Erfahrung.",
      },
      it: {
        name: "Squadra Sprint",
        description:
          "Squadra di 3 corridori. 1 giorno. Percorso semplificato. Prezzo: $400 ($133 per corridore). Ideale per principianti o esperienza più breve.",
      },
    },
  };

  const variants = [
    { name: "Standard Team", id: variantStandard.id },
    { name: "Ultra Team", id: variantUltra.id },
    { name: "Sprint Team", id: variantSprint.id },
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
    "📝 Variant translations upserted for all 3 variants (6 languages each)"
  );

  // Step 5: Delete existing pricing phases to avoid duplicates
  await prisma.pricingPhase.deleteMany({
    where: { eventId: event.id },
  });

  console.log("🗑️ Deleted existing pricing phases for idempotency");

  // Step 6: Create pricing phases (LINKED TO eventId, NOT variantId)
  console.log("💰 Creating pricing phases...");

  // Standard Team pricing
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Standard Team (8 runners)",
      startDate: new Date("2025-06-01T00:00:00Z"),
      endDate: new Date("2026-04-08T07:59:59Z"),
      price: 1645.0,
      currency: Currency.USD,
      discountPercent: null,
      note: "Full team registration for 8 runners ($205 per runner). Includes camping, timing chip, finisher medals and shirts, access to Ragnar Village.",
    },
  });

  // Ultra Team pricing
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Ultra Team (4 runners)",
      startDate: new Date("2025-06-01T00:00:00Z"),
      endDate: new Date("2026-04-08T07:59:59Z"),
      price: 925.0,
      currency: Currency.USD,
      discountPercent: null,
      note: "Ultra team registration for 4 runners ($231 per runner). Includes camping, timing chip, finisher medals and shirts, access to Ragnar Village.",
    },
  });

  // Sprint Team pricing
  await prisma.pricingPhase.create({
    data: {
      eventId: event.id,
      name: "Sprint Team (3 runners)",
      startDate: new Date("2025-06-01T00:00:00Z"),
      endDate: new Date("2026-04-08T07:59:59Z"),
      price: 400.0,
      currency: Currency.USD,
      discountPercent: null,
      note: "Sprint team registration for 3 runners ($133 per runner). 1-day event. Includes camping, timing chip, finisher medals and shirts.",
    },
  });

  console.log("💰 Pricing phases created (linked to eventId)");
  console.log("✅ Ragnar Trail Atlanta 2026 seed completed successfully!");
  console.log("");
  console.log("📋 Summary:");
  console.log("   🏕️ Event: Ragnar Trail Atlanta 2026");
  console.log("   📅 Dates: April 10-11, 2026");
  console.log("   📍 Location: Conyers, Georgia, USA");
  console.log("   🏃 Variants: 3 (Standard, Ultra, Sprint)");
  console.log("   🌍 Translations: 6 languages (pt, en, es, fr, de, it)");
  console.log("   💰 Pricing: 3 phases (one per team type)");
  console.log("   🔗 Website: https://runragnar.com/pages/race-trail-atlanta");
  console.log(
    "   🏆 Features: Trail relay, camping, Ragnar Village, Olympic venue"
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
