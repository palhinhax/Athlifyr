import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Trail Serra D'Aire...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "trail-serra-daire-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing Trail Serra D'Aire event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  // Create the event
  const event = await prisma.event.create({
    data: {
      title: "Trail Serra D'Aire",
      slug: "trail-serra-daire-2026",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-01-17T08:00:00.000Z"),
      registrationDeadline: new Date("2026-01-10T00:00:00.000Z"),
      city: "Ourém",
      country: "Portugal",
      description: `# Trail Serra D'Aire 2026 - 10ª Edição

A **10ª edição do Trail Serra D'Aire** vai ocorrer no dia **17 de Janeiro de 2026**, na localidade **Bairro, Ourém**.

## 🏔️ Sobre a Prova

O **Trail Serra D'Aire (TSA)** é uma prova de **corrida de montanha** que percorre os bonitos trilhos e caminhos da orla e coração da **Serra de Aire**.

Esta prova é organizada pela equipa **Serra D'Aire Trail Team**, secção Trail Run do **Grupo Cultural Desportivo Recreativo Bairrense** e a **ACROM – Associação Cultural Recreativa do Outeiro das Matas**.

✅ **Prova certificada pela ATRP** – Associação de Trail Running de Portugal
✅ **Integra os Circuitos Nacionais** de Trail, Sprint e Jovem
✅ **Trail Longo 38km**: Campeonato Nacional (CN)

## 🏃 Provas Disponíveis

### Trail Longo 38km - Campeonato Nacional
- **Distância:** 38km
- **Desnível Positivo:** 2000m
- **Tempo Limite:** 7h00
- **Idade Mínima:** 18 anos
- **Partida:** 08h00

**Campeonato Nacional (CN):**
Serão elegíveis para participar no CN todos os atletas que cumpram os requisitos do Regulamento Geral de Competições da **Federação Portuguesa de Atletismo (FPA)**. É da responsabilidade do atleta o conhecimento do mesmo. Os atletas que se inscrevam e não cumpram os requisitos serão incluídos na prova aberta.

### Trail Curto 18km
- **Distância:** 18km
- **Desnível Positivo:** 650m
- **Tempo Limite:** 7h00
- **Idade Mínima:** 16 anos (menores de 18 necessitam autorização parental)
- **Partida:** 09h00

### Mini-Trail 12km
- **Distância:** 12km
- **Desnível Positivo:** 450m
- **Tempo Limite:** 7h00
- **Idade Mínima:** 16 anos (menores de 18 necessitam autorização parental)
- **Partida:** 09h30

### Caminhada 12km
- **Distância:** 12km
- **Desnível Positivo:** 450m
- **Tempo Limite:** 7h00
- **Idade:** Aberta a todos (menores sob responsabilidade de adultos)
- **Partida:** 08h30
- **Nota:** Sem cronometragem

## 🎯 Material Obrigatório

### Trail Longo 38km

✅ **Obrigatório:**
- Telemóvel operacional
- Dorsal fornecido pela organização
- Alfinetes para fixação ou porta-dorsal
- Recipiente de líquidos nos locais de abastecimento
- Manta de sobrevivência
- Reservatório de água com capacidade mínima de 0,5L
- Apito

📦 **Recomendado:**
- Reserva de alimentos

### Trail Curto 18km e Mini-Trail 12km

✅ **Obrigatório:**
- Telemóvel operacional
- Dorsal fornecido pela organização
- Alfinetes para fixação ou porta-dorsal
- Recipiente de líquidos nos locais de abastecimento
- Manta de sobrevivência
- Reservatório de água com capacidade mínima de 0,5L

📦 **Recomendado:**
- Reserva de alimentos
- Apito

### Caminhada 12km

✅ **Obrigatório:**
- Telemóvel operacional
- Dorsal fornecido pela organização
- Alfinetes para fixação ou porta-dorsal
- Recipiente de líquidos nos locais de abastecimento
- Reservatório de água com capacidade mínima de 0,5L

📦 **Recomendado:**
- Manta de sobrevivência
- Reserva de alimentos
- Apito

⚠️ **Importante:** 
- Haverá **Controlo Zero** antes da partida para verificação do material obrigatório
- A organização **não disponibilizará alfinetes** - o atleta deve trazer alfinetes ou porta-dorsal
- Os atletas deverão transportar consigo um **copo ou recipiente** para abastecer nos locais proporcionados

## 🥤 Postos de Abastecimento

A Organização disponibiliza vários **PA (Pontos de Abastecimento)** de líquidos e sólidos durante o percurso e após o corte da meta.

⚠️ **Nota:** A organização **não fornece recipientes** para ingestão. Os atletas devem trazer copo ou recipiente similar.

## 🏆 Prémios e Escalões

### Prémios

**Pódios para:**
- 3 primeiros classificados gerais (Masculino e Feminino)
- 3 primeiros classificados por escalão (Trail Longo e Trail Curto)
- 3 primeiros gerais e Sub-23 no Mini-Trail
- 3 Melhores Equipas (somatório dos 3 melhores atletas, independentemente do género)

### Escalões

**Trail Longo 38km e Trail Curto 18km:**
- Sub-23 (M/F): 18-22 anos
- Seniores (M/F): 23-39 anos
- M40/F40: 40-49 anos
- M50/F50: 50-59 anos
- M60/F60: 60+ anos

**Mini-Trail 12km:**
- Sub-23 (M/F): 18-22 anos
- Geral (M/F)

**Campeonato Nacional:**
Na prova do CN haverá classificação por categorias determinadas pela **ATRP/FPA**. As classificações ATRP/FPA não significam entrega ou cerimónia de prémios adicionais.

## 📋 Programa

### Sexta-Feira, 16 de Janeiro
**Secretariado - Sede GCDR Bairrense**
- 18h00 - 21h00: Secretariado

### Sábado, 17 de Janeiro
**Secretariado - Sede GCDR Bairrense**
- 07h00 - 09h00: Secretariado

**Provas - Bairro, Ourém**
- 07h45 - Controlo Atletas Trail Longo 38km
- 08h00 - **Partida Trail Longo 38km**
- 08h30 - **Partida Caminhada 12km**
- 08h45 - Controlo Atletas Trail Curto 18km
- 09h00 - **Partida Trail Curto 18km**
- 09h15 - Controlo Atletas Mini-Trail 12km
- 09h30 - **Partida Mini-Trail 12km**
- 14h00 - 15h00: **Entrega de Prémios**
- 16h00: Encerramento

⚠️ *Horários sujeitos a alterações*

## 📦 Material e Serviços Incluídos

Todos os participantes recebem:

✅ Participação na prova escolhida
✅ Seguro de acidentes pessoais
✅ Dorsal com chip cronometragem (exceto caminhada)
✅ T-Shirt técnica promocional*
✅ Prémio Finisher
✅ Abastecimentos líquidos e sólidos
✅ Reforço de meta: bifana e caldo verde
✅ Assistência médica durante o evento

**Serviços disponibilizados:**
- Estacionamento
- Serviço de Bar (GCDR Bairrense)
- Banhos (Sede GCDR Bairrense, Pavilhão Municipal do Caneiro)
- Transfer de 20 em 20 minutos
- Solo Duro: Para pernoitar na véspera, enviar pedido para serradairetrailteam@gmail.com

*Por questões de logística, não haverá t-shirts nas inscrições após 31 de dezembro de 2025.

## ⚖️ Seguro Desportivo

A organização contratualiza seguros obrigatórios por lei. O prémio do seguro está incluído no valor da inscrição.

**Coberturas:**
- **Morte:** 33.100€
- **Invalidez Permanente:** 33.100€ (franquia 10%)
- **Despesas de Tratamento:** 5.500€ (franquia 60€)
- **Despesas de Funeral:** 2.700€

⚠️ **Importante:** Na eventual necessidade de resgate por meios externos (equipa de resgate ou helicóptero), o atleta deverá assumir os custos financeiros deste serviço.

## 🌍 Responsabilidade Ambiental

Estamos num **Parque Natural protegido**, com regulamento próprio. É um privilégio podermos usufruir do mesmo.

**Princípios:**
✅ Respeito pelo próximo e proteção do meio ambiente
✅ Deixar o ambiente tal como o encontrou
✅ Não abandonar embalagens vazias ao longo do percurso
✅ Colocar resíduos nos locais apropriados
✅ Não danificar o meio ambiente
✅ Não provocar danos em áreas privadas ou cultivadas

**A única marca que deve deixar é a da sua sapatilha!**

## 📜 Regras de Conduta

### Deveres dos Participantes:

✅ Auxiliar qualquer praticante em caso de acidente
✅ Respeitar as áreas marcadas do percurso
✅ Seguir as instruções da Organização
✅ Cumprir regras de trânsito na via pública
✅ Respeitar áreas agrícolas e propriedades privadas

### Motivos de Desqualificação:

❌ Partilhar o dorsal com outra pessoa
❌ Falhar o Controlo Horário de Partida ou qualquer Posto de Controlo
❌ Atalhar o percurso
❌ Não cumprir o regulamento
❌ Perda propositada do dorsal
❌ Alteração ou troca de dorsal
❌ Comportamento inadequado, agressivo ou linguagem ofensiva

## ⏱️ Tempo Limite e Barreiras Horárias

**Tempo limite geral:** 7 horas para todas as provas

Existirão membros da organização a fechar o circuito e serão indicados horários de passagem em cada posto de abastecimento.

**Importante:**
- Atletas que excedam o tempo limite serão encaminhados para a zona de chegada por transporte da organização
- Caso o atleta opte por não seguir as indicações, o dorsal poderá ser retirado, ficando à sua inteira responsabilidade
- A organização reserva-se ao direito de afastar um atleta devido ao seu estado de saúde

## 🚗 Como Chegar

**Sede do GCDR Bairrense - Bairro, Ourém**
📍 [Ver no Google Maps](https://goo.gl/maps/oYAzKuFmU3ZW4D557)

## 📞 Contactos

**Email Organização:**
- serradairetrailteam@gmail.com

**Website e Redes Sociais:**
- Facebook: [Trail Serra D'Aire](https://www.facebook.com/trailserradaire)
- Instagram: [@trailserradaire](https://www.instagram.com/trailserradaire)

**Plataforma de Inscrições:**
- [StopAndGo](https://www.stopandgo.pt)

**Cronometragem:**
- StopAndGo

## 👥 Organização

**Organizadores:**
- Serra D'Aire Trail Team
- Grupo Cultural Desportivo Recreativo Bairrense
- ACROM – Associação Cultural Recreativa do Outeiro das Matas

**Certificação:**
- ATRP – Associação de Trail Running de Portugal
- Integra Circuitos Nacionais de Trail, Sprint e Jovem

---

**Regulamento completo disponível em:** [Facebook Trail Serra D'Aire](https://www.facebook.com/trailserradaire)

⚠️ **A inscrição implica total aceitação do regulamento da prova.**`,
      externalUrl: "https://www.stopandgo.pt",
      variants: {
        create: [
          // Trail Longo 38km
          {
            name: "Trail Longo 38km",
            distanceKm: 38,
            elevationGainM: 2000,
            cutoffTimeHours: 7.0,
            atrpGrade: null,
            startTime: "2026-01-17T08:00:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição",
                  startDate: new Date("2025-11-24T00:00:00.000Z"),
                  endDate: new Date("2026-01-10T00:00:00.000Z"),
                  price: 27.0,
                  discountPercent: null,
                  note: "Até 10/01/2026",
                },
              ],
            },
          },
          // Trail Curto 18km
          {
            name: "Trail Curto 18km",
            distanceKm: 18,
            elevationGainM: 650,
            cutoffTimeHours: 7.0,
            atrpGrade: null,
            startTime: "2026-01-17T09:00:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição",
                  startDate: new Date("2025-11-24T00:00:00.000Z"),
                  endDate: new Date("2026-01-10T00:00:00.000Z"),
                  price: 23.0,
                  discountPercent: null,
                  note: "Até 10/01/2026",
                },
              ],
            },
          },
          // Mini-Trail 12km
          {
            name: "Mini-Trail 12km",
            distanceKm: 12,
            elevationGainM: 450,
            cutoffTimeHours: 7.0,
            atrpGrade: null,
            startTime: "2026-01-17T09:30:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição",
                  startDate: new Date("2025-11-24T00:00:00.000Z"),
                  endDate: new Date("2026-01-10T00:00:00.000Z"),
                  price: 17.0,
                  discountPercent: null,
                  note: "Até 10/01/2026",
                },
              ],
            },
          },
          // Caminhada 12km
          {
            name: "Caminhada 12km",
            distanceKm: 12,
            elevationGainM: 450,
            cutoffTimeHours: 7.0,
            atrpGrade: null,
            startTime: "2026-01-17T08:30:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição",
                  startDate: new Date("2025-11-24T00:00:00.000Z"),
                  endDate: new Date("2026-01-10T00:00:00.000Z"),
                  price: 17.0,
                  discountPercent: null,
                  note: "Até 10/01/2026 - Sem cronometragem",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Created event: Trail Serra D'Aire");
  console.log(`   - ID: ${event.id}`);
  console.log(`   - Slug: ${event.slug}`);
  console.log(`   - Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   - City: ${event.city}`);
  console.log(
    `   - Variants: 4 (Trail Longo 38km, Trail Curto 18km, Mini-Trail 12km, Caminhada 12km)`
  );
  console.log("");
  console.log("🏃 Trail Serra D'Aire seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
