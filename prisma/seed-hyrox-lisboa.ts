import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("💪 Seeding HYROX Lisboa...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "hyrox-lisboa-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "HYROX Lisboa",
      slug: "hyrox-lisboa-2026",
      sportTypes: [SportType.HYROX],
      startDate: new Date("2026-05-01T08:00:00.000Z"),
      endDate: new Date("2026-05-03T20:00:00.000Z"),
      registrationDeadline: new Date("2026-04-28T23:59:59.000Z"),
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.76984874057307,
      longitude: -9.093438256156496,
      googleMapsUrl: "https://maps.app.goo.gl/ts7GusR19goAE2d96",
      externalUrl: "https://hyrox.com/",
      isFeatured: true,
      description: `# HYROX Lisboa 2026

**The Fitness Race Chega a Portugal!**

🔥 **HYROX finalmente chega a Lisboa!** Um dos eventos mais aguardados do ano, com **três dias de competição** na icónica FIL - Feira Internacional de Lisboa. A cidade das sete colinas, considerada uma das mais bonitas do mundo, espera-te na **Roxzone** para definires um novo objetivo em 2026!

**Datas:** 1-3 de maio de 2026
**Local:** FIL - Feira Internacional de Lisboa, Parque das Nações

## 💪 O Que É HYROX?

**HYROX** é a competição mundial de fitness para todos. Cada prova segue o mesmo formato em qualquer parte do mundo: **8 estações de treino funcional** intercaladas com **corrida de 1 km**.

### Formato da Prova

**Distância Total de Corrida:** 8 km (8 x 1 km)

**8 Estações de Treino Funcional:**
1. 🏃 **SkiErg** - 1000m
2. 🛷 **Sled Push** - 50m
3. 🛷 **Sled Pull** - 50m
4. 💪 **Burpee Broad Jumps** - 80m
5. 🚣 **Rowing** - 1000m
6. 💪 **Farmers Carry** - 200m
7. 🏋️ **Sandbag Lunges** - 100m
8. 🎯 **Wall Balls** - 100 reps (75 reps para Women)

## 🏆 Divisões e Categorias

### 🔥 HYROX Individual

**Open (Homens e Mulheres)**
- Categoria aberta para todos os níveis
- Pesos standard HYROX
- Cronometragem chip timing
- Classificação por escalões etários

**PRO (Homens e Mulheres)**
- Para atletas de elite
- Pesos aumentados
- Qualificação para HYROX World Championship
- Slots para Worlds em jogo!

**Adaptive (Homens e Mulheres)**
- Categoria inclusiva para atletas com necessidades especiais
- Adaptações específicas
- Celebração da superação

### 👥 HYROX Doubles

**Doubles Mixed / Men / Women**
- Equipas de 2 atletas
- Dividem o trabalho nas estações
- Correm juntos os 8km
- Estratégia e trabalho de equipa essenciais

**PRO Doubles (Men / Women)**
- Para equipas de elite
- Pesos aumentados
- Qualificação para Worlds

### 🔄 HYROX Relay

**Relay (Mixed / Men / Women)**
- Equipas de 4 atletas
- Cada atleta completa 2 estações + 2km corrida
- Formato rápido e dinâmico
- Perfeito para boxes e equipas

## 📅 Horário Provisório

### Sexta-feira, 1 de maio
- HYROX MEN + ADAPTIVE MEN
- HYROX PRO MEN
- HYROX PRO WOMEN
- HYROX DOUBLES MEN
- HYROX DOUBLES WOMEN
- HYROX WOMEN + ADAPTIVE WOMEN
- HYROX DOUBLES MIXED

### Sábado, 2 de maio
- HYROX MEN + ADAPTIVE MEN
- HYROX DOUBLES MIXED
- HYROX PRO DOUBLES WOMEN
- HYROX PRO DOUBLES MEN

### Domingo, 3 de maio
- HYROX DOUBLES WOMEN
- HYROX WOMEN + ADAPTIVE WOMEN
- HYROX DOUBLES MEN
- HYROX MENS RELAY
- HYROX MIXED RELAY
- HYROX WOMENS RELAY

**⚠️ Nota:** Horários provisórios, sujeitos a alterações. Os horários individuais de partida serão atribuídos ~3 dias antes do evento.

## 🎯 Para Quem É HYROX?

✅ **Para TODOS!** - Do iniciante ao atleta de elite
✅ **Formato universal** - Mesmas estações em todo o mundo
✅ **Comparável** - Compara o teu tempo com atletas globais
✅ **Escalável** - Escolhe Open ou PRO conforme o teu nível
✅ **Social** - Doubles e Relay para competir com amigos
✅ **Motivador** - Objetivos claros de tempo e performance

## 🏅 Resultados e Rankings

- **Chip timing** profissional
- **Rankings em tempo real** durante o evento
- **Classificações globais** - compara-te com atletas de todo o mundo
- **Age group rankings** - classificação por escalões etários
- **World Championship qualification** - slots para PRO athletes

## 📸 Fotografia Oficial

**Sportograf** será o fotógrafo oficial do evento. Pacotes de fotos disponíveis para compra após o evento.

## 🎽 Race Package Inclui

✅ Acesso à FIL e Roxzone
✅ Chip timing profissional
✅ Classificação oficial e certificado digital
✅ Foto de finisher incluída
✅ Acesso a vestiários e duches
✅ Zona de aquecimento
✅ Água durante a prova
✅ Medalha de finisher (sujeito a confirmação)
✅ Ambiente energético único HYROX!

## 🏋️ Preparação

### Como Treinar para HYROX?

**HYROX Training Clubs** - Ginásios certificados com programas específicos
**Online Programs** - Treinos guiados para preparação
**Best HYROX Preparation** - Recursos no site oficial

### Equipamento Necessário

- Ténis adequados para corrida e treino funcional
- Roupa desportiva confortável
- Toalha pequena (opcional)
- Bebida isotónica (opcional)

**⚠️ Todo o equipamento de treino é fornecido no local** (SkiErg, Sleds, Rowing, etc.)

## 📍 Local - FIL (Feira Internacional de Lisboa)

**Pavilhão FIL, Parque das Nações, Lisboa**

- 🚇 **Metro:** Estação Oriente (Linha Vermelha)
- 🚆 **Comboio:** Gare do Oriente
- 🚌 **Autocarros:** Várias linhas
- 🚗 **Estacionamento:** Parques disponíveis no Parque das Nações
- ✈️ **Aeroporto:** 10 minutos de táxi/Uber

### Zona Envolvente

- 🏨 Hotéis nas proximidades (Oriente, Parque das Nações)
- 🍽️ Restaurantes no Parque das Nações e Centro Vasco da Gama
- 🌊 Vista para o Rio Tejo
- 🎡 Teleférico e Oceanário nas redondezas

## 💶 Informações de Inscrição

**Inscrições:** Disponíveis no site oficial HYROX
**Early Bird:** Preços promocionais para inscrições antecipadas
**Grupos:** Descontos para equipas de 5+ atletas

**⚠️ Alterações de horário não são permitidas** - planeia com antecedência!

## ℹ️ Informações Importantes

### Athlete Check-In
Detalhes a anunciar ~1 semana antes do evento

### Technical Briefing
Disponível online ~3 dias antes do evento

### World Championship Slots
Atletas PRO podem qualificar-se para o HYROX World Championship

### Adaptive Athletes
HYROX celebra a inclusão. Categoria Adaptive com adaptações específicas.

### Charity
Informações sobre iniciativas de caridade a anunciar

## 🌍 HYROX Global

**The World Series of Fitness Racing**

- 🌎 Eventos em 15+ países
- 🏆 Mais de 100,000 atletas por ano
- 📊 Rankings globais unificados
- 🎯 Formato universal - mesmas estações em todo o mundo

## 📱 Segue HYROX

**Website:** hyrox.com
**Instagram:** @hyrox
**Facebook:** HYROX
**YouTube:** HYROX

## 🇵🇹 Lisboa Te Espera!

A cidade das sete colinas, Património Mundial da UNESCO, com:
- 🌞 Clima mediterrânico
- 🏛️ História e cultura ricas
- 🎭 Vida noturna vibrante
- 🍽️ Gastronomia de classe mundial
- 🌊 Praias próximas

**Combina a tua competição HYROX com uma visita turística a uma das cidades mais bonitas da Europa!**

## 📧 Contactos

**Questões?** Usa o formulário de contacto no site oficial HYROX

**Email Geral:** info@hyrox.com

---

💪 **HYROX - The Fitness Race for Every Body**

🔥 Vemo-nos na Roxzone em Lisboa! Define o teu novo objetivo para 2026!`,
      variants: {
        create: [
          {
            name: "HYROX Open - Individual",
            distanceKm: 8,
            startDate: new Date("2026-05-01T08:00:00.000Z"),
            startTime: "08:00",
            description:
              "Categoria Open para todos os níveis. 8km de corrida (8x1km) intercalados com 8 estações de treino funcional (SkiErg, Sled Push, Sled Pull, Burpee Broad Jumps, Rowing, Farmers Carry, Sandbag Lunges, Wall Balls). Pesos standard. Classificação por escalões etários. Chip timing profissional. Disponível sexta, sábado e domingo.",
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Standard",
                  price: 130.0,
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2026-04-28T23:59:59.000Z"),
                  note: "€130 incluindo IVA. Inscrições em hyrox.com",
                },
                {
                  name: "Charity Ticket",
                  price: 90.0,
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2026-04-28T23:59:59.000Z"),
                  note: "€90 incluindo IVA. Requer objetivo mínimo de fundraising. Para atletas que querem apoiar causas sociais.",
                },
              ],
            },
          },
          {
            name: "HYROX PRO - Individual",
            distanceKm: 8,
            startDate: new Date("2026-05-01T09:00:00.000Z"),
            startTime: "09:00",
            description:
              "Categoria PRO para atletas de elite. 8km corrida + 8 estações com PESOS AUMENTADOS. Qualificação para HYROX World Championship. Slots para Worlds em jogo! Formato competitivo de alto nível. Apenas sexta-feira. Requer nível avançado de fitness.",
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Standard",
                  price: 130.0,
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2026-04-28T23:59:59.000Z"),
                  note: "€130 incluindo IVA. Categoria PRO. Qualificação para Worlds (exceto 60+).",
                },
                {
                  name: "Charity Ticket",
                  price: 90.0,
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2026-04-28T23:59:59.000Z"),
                  note: "€90 incluindo IVA. Requer objetivo mínimo de fundraising.",
                },
              ],
            },
          },
          {
            name: "HYROX Doubles",
            distanceKm: 8,
            startDate: new Date("2026-05-01T10:00:00.000Z"),
            startTime: "10:00",
            description:
              "Equipas de 2 atletas (Mixed, Men, Women). Dividem o trabalho nas 8 estações de treino funcional mas correm JUNTOS os 8km. Estratégia e trabalho de equipa essenciais. Pesos standard. Disponível nos 3 dias em diferentes divisões (Mixed/Men/Women). Perfeito para duplas de treino!",
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Standard",
                  price: 125.0,
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2026-04-28T23:59:59.000Z"),
                  note: "€125 por pessoa (incluindo IVA). 2 tickets automaticamente adicionados ao carrinho.",
                },
                {
                  name: "Charity Ticket",
                  price: 85.0,
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2026-04-28T23:59:59.000Z"),
                  note: "€85 por pessoa (incluindo IVA). Requer objetivo mínimo de fundraising.",
                },
              ],
            },
          },
          {
            name: "HYROX PRO Doubles",
            distanceKm: 8,
            startDate: new Date("2026-05-02T10:00:00.000Z"),
            startTime: "10:00",
            description:
              "Equipas PRO de 2 atletas (Men/Women). PESOS AUMENTADOS. Qualificação para World Championship. Apenas sábado. Formato elite que exige coordenação perfeita entre parceiros e nível avançado de fitness. Slots para Worlds em jogo para as melhores duplas!",
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Standard",
                  price: 125.0,
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2026-04-28T23:59:59.000Z"),
                  note: "€125 por pessoa (incluindo IVA). Categoria PRO. 2 tickets por equipa.",
                },
                {
                  name: "Charity Ticket",
                  price: 85.0,
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2026-04-28T23:59:59.000Z"),
                  note: "€85 por pessoa (incluindo IVA). Requer objetivo mínimo de fundraising.",
                },
              ],
            },
          },
          {
            name: "HYROX Relay",
            distanceKm: 8,
            startDate: new Date("2026-05-03T10:00:00.000Z"),
            startTime: "10:00",
            description:
              "Equipas de 4 atletas (Mixed/Men/Women). Cada atleta completa 2 estações + 2km de corrida. Formato rápido, dinâmico e estratégico. Apenas domingo. Perfeito para boxes, ginásios e grupos de amigos. Intensidade menor por pessoa mas trabalho de equipa crucial. Ambiente energético garantido!",
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Standard",
                  price: 80.0,
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2026-04-28T23:59:59.000Z"),
                  note: "€80 por pessoa (incluindo IVA). 4 tickets automaticamente adicionados ao carrinho.",
                },
                {
                  name: "Charity Ticket",
                  price: 55.0,
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2026-04-28T23:59:59.000Z"),
                  note: "€55 por pessoa (incluindo IVA). Requer objetivo mínimo de fundraising.",
                },
              ],
            },
          },
          {
            name: "HYROX Adaptive",
            distanceKm: 8,
            startDate: new Date("2026-05-01T08:00:00.000Z"),
            startTime: "08:00",
            description:
              "Categoria inclusiva para atletas com necessidades especiais (Men/Women). Mesmo formato: 8km corrida + 8 estações, com adaptações específicas conforme necessário. HYROX celebra a superação e inclusão. Disponível sexta-feira e domingo. Todos os atletas são bem-vindos!",
            pricingPhases: {
              create: [
                {
                  name: "Inscrição Standard",
                  price: 130.0,
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2026-04-28T23:59:59.000Z"),
                  note: "€130 incluindo IVA. Categoria Adaptive. Definida pelo Adaptive Rulebook HYROX.",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Event created successfully!");
  console.log(`   Event ID: ${event.id}`);
  console.log(`   Event slug: ${event.slug}`);
  console.log(
    `   Location: ${event.city} (FIL) at ${event.latitude}, ${event.longitude}`
  );
  console.log(
    `   Dates: ${event.startDate.toLocaleDateString("pt-PT")} - ${event.endDate?.toLocaleDateString("pt-PT")}`
  );
  console.log(`   Sport: HYROX`);
  console.log(
    `   Variants: 6 (Open, PRO, Doubles, PRO Doubles, Relay, Adaptive)`
  );
  console.log(`   Website: ${event.externalUrl}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
