import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Maratona do Funchal...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "maratona-do-funchal-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing Maratona do Funchal event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  // Create the event
  const event = await prisma.event.create({
    data: {
      title: "Maratona do Funchal",
      slug: "maratona-do-funchal-2026",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-01-17T15:00:00.000Z"),
      registrationDeadline: new Date("2025-12-31T23:59:00.000Z"),
      city: "Funchal",
      country: "Portugal",
      description: `# Maratona do Funchal 2026

**Marathon • Half-Marathon • Mini Marathon**

## ⚠️ ATENÇÃO - Alteração de Data

As **Eleições Presidenciais Portuguesas** serão realizadas no dia 18 de Janeiro de 2026, por esta razão fomos forçados a alterar a data para o dia anterior, **17 de Janeiro de 2026, Sábado**.

## 🏃 Sobre o Evento

A **Maratona do Funchal** é organizada pela **Associação de Atletismo da Região Autónoma da Madeira (AARAM)** com o apoio de instituições privadas e públicas.

Neste evento, a organização oferece **três distâncias** aos participantes:
- 🏃 **Maratona do Funchal** - 42,195 km
- 🏃 **Meia Maratona do Funchal** - 21,0975 km  
- 🏃 **Mini Maratona do Funchal** - aprox. 8,3 km

## 🏃 Provas Disponíveis

### Marathon 42km
- **Distância:** 42,195 km (Maratona completa)
- **Tempo Limite:** 6 horas
- **Idade Mínima:** Sub-23, Senior e Master
- **Partida:** 15h00
- **Prémios Monetários:** 1º lugar 500€, 2º lugar 300€, 3º lugar 200€

**Material Premium:**
- T-Shirt Premium do evento
- Voucher para "Pasta Party" gratuita
- Pace Guides para tempos de 3:00, 3:30, 4:00 e 4:30

### Half-Marathon 21km
- **Distância:** 21,0975 km (Meia Maratona)
- **Tempo Limite:** 3 horas
- **Idade Mínima:** Sub-23, Senior e Master
- **Partida:** 17h00

### Mini Marathon 8km
- **Distância:** aprox. 8,3 km
- **Tempo Limite:** 1 hora e 30 minutos
- **Idade Mínima:** Sub-20, Sub-23, Senior e Master
- **Partida:** 16h30

## 👥 Categorias Etárias

### Idade / Grupo Etário

**Sub-20** – 2007/2008 (apenas para Mini Marathon)
**Sub-23** – 2004/2005/2006
**Senior** – 2003 e anteriores

**Masters:**
- **M35/W35** - 35 a 39 anos
- **M40/W40** - 40 a 44 anos
- **M45/W45** - 45 a 49 anos
- **M50/W50** - 50 a 54 anos
- **M55/W55** - 55 a 59 anos
- **M60/W60** - 60 a 64 anos
- **M65/W65** - 65 a 69 anos
- **M70/W70** - 70 a 74 anos
- **M75/W75** - 75 anos ou mais

## 📋 Programa

### Sábado, 17 de Janeiro de 2026

**Provas:**
- **15h00** - Partida da **Marathon** (42km)
- **16h30** - Partida da **Mini Marathon** (8km)
- **17h00** - Partida da **Half-Marathon** (21km)

**Pasta Party** (apenas atletas Marathon):
- Sábado, dia 17, horário e local a determinar
- Necessário informar até 11 de Janeiro se deseja menu vegetariano

## 📦 Material e Serviços Incluídos

Todos os participantes recebem:

✅ **Seguro desportivo do evento**
✅ **Dorsal personalizado** com chip de cronometragem MyLaps BibTag incluído
✅ **T-Shirt do evento** (Premium para atletas da Marathon)
✅ **Voucher "Pasta Party"** gratuita (apenas Marathon)
✅ **Transporte gratuito** para os pontos de partida nos autocarros públicos "Horários do Funchal"
✅ **Serviço Bag Drop** dos pontos de partida para a zona de chegada
✅ **Pace Guides na Marathon** para tempos de 3:00, 3:30, 4:00 e 4:30
✅ **Entretenimento** ao longo do percurso
✅ **Postos de abastecimento** durante a prova e na zona de chegada
✅ **Postos de Primeiros Socorros** no Casino da Madeira e zona de chegada
✅ **Medalha de Finisher** para TODOS os participantes

⚠️ **Nota:** A organização não fornece sacos no check-in.

## 🥤 Postos de Abastecimento

Os postos estarão **no máximo a 5 quilómetros** de distância. Dependendo das condições meteorológicas, podem estar disponíveis a cada 2,5 quilómetros.

**Fornecimento:**
- **Líquidos:** Água e bebida isotónica em copo
- **Sólidos:** Bananas, frutos secos e barras energéticas

## 🏆 Prémios

### Marathon 42km

**Prémios Monetários (Geral Masculino e Feminino):**
- 🥇 **1º Lugar:** 500€
- 🥈 **2º Lugar:** 300€
- 🥉 **3º Lugar:** 200€

**Troféus:**
- 3 primeiros classificados gerais de cada género
- 3 primeiros de cada escalão etário/género (Sub-23, Seniores e Masters 35 a 75+)

**Medalha Finisher:** Para todos os atletas que completem o percurso

### Half-Marathon 21km

**Troféus:**
- 3 primeiros classificados gerais de cada género
- 3 primeiros de cada escalão etário/género (Sub-23, Seniores e Masters 35 a 75+)

**Medalha Finisher:** Para todos os atletas que completem o percurso

### Mini Marathon 8km

**Troféus:**
- 3 primeiros classificados gerais de cada género
- 1º de cada escalão etário/género (Sub-20, Sub-23, Seniores e Masters 35 a 75+)

**Medalha Finisher:** Para todos os atletas que completem o percurso

## ⏱️ Tempos Limite

- **Marathon:** 6 horas
- **Half-Marathon:** 3 horas
- **Mini Marathon:** 1 hora e 30 minutos

## 📜 Regulamento

### 5.4. Classificação

Haverá classificações gerais por género e por escalão para ambas as distâncias. A classificação por escalão etário não implica a atribuição de prémio desse escalão - Ver ponto "Prémios" do regulamento.

As classificações serão por **"tempo oficial"**, de acordo com o tempo entre o tiro de partida e a linha de chegada.

O chip **MyLaps BibTag** fornecido pela organização é **obrigatório**. O mesmo está localizado no verso do dorsal e não pode ser dobrado, laminado ou danificado de forma alguma. Apenas os atletas que tenham o chip MyLaps BibTag em funcionamento terão o seu tempo registado.

### 5.5. Desqualificações

Serão desqualificados todos os atletas que:
- ❌ Não efetuem o controlo de partida
- ❌ Não completem o percurso integralmente
- ❌ Não tragam o seu dorsal no peito e claramente visível durante a prova
- ❌ Falsifiquem qualquer elemento relativo à sua inscrição
- ❌ Corram com o número de dorsal incorreto
- ❌ Não respeitem as instruções da organização

### 5.6. Reclamações

Qualquer reclamação ou protesto deve ser apresentado **por escrito ao júri** no prazo de **30 minutos** após a publicação dos resultados provisórios, juntamente com o valor de **100,00€**, que será devolvido se o protesto for deferido (de acordo com WA - World Athletics - e FPA - Federação Portuguesa de Atletismo).

### 5.7. Júri

O Júri da prova é da responsabilidade do **Conselho Regional de Arbitragem da Associação de Atletismo da Região Autónoma da Madeira**.

## 📝 Secretariado

A localização e os horários de abertura do secretariado serão divulgados no início de Janeiro de 2026.

**Documentação necessária para levantamento do kit:**
- Documento de identificação: BI, Cartão de Cidadão ou Carta de Condução

**Kit de Participação:**
- Dorsal com chip de cronometragem MyLaps BibTag
- T-shirt do evento (Premium para Marathon)
- Voucher "Pasta Party" (apenas para Marathon)

⚠️ **Nota:** A organização não fornece sacos no check-in.

## 🔄 Alterações, Cedências e Cancelamentos

### Alteração de Prova
Pedidos de alteração de prova serão aceites até **31 de Dezembro**. Não há lugar a reembolso pela organização se a inscrição a alterar for mais cara do que a inscrição na prova pretendida. Se a prova pretendida tiver um valor de inscrição superior ao da inscrição efetuada anteriormente, será solicitado ao participante o pagamento da diferença entre a inscrição à data deste pedido e o valor pago.

### Cedência a Terceiros
Um pedido de cedência de inscrição a terceiro participante deve ser feito por email para **geral@atletismomadeira.pt**, utilizando o mesmo endereço de email da inscrição. Os pedidos de cedência de inscrições serão aceites até **31 de Dezembro** e estão sujeitos ao pagamento de uma taxa administrativa de **10€**. A cedência de inscrição não dá direito a qualquer reembolso à pessoa que desiste da inscrição.

### Cancelamento
Em caso de **lesão ou doença**, a organização reembolsará **50% do valor da inscrição**. O pedido de cancelamento deve ser enviado para **geral@atletismomadeira.pt** com a apresentação de um **certificado médico válido**. Estes pedidos excecionais serão aceites até **6 de Janeiro** para todas as inscrições efetuadas dentro dos prazos regulares.

## 🛡️ Seguro

A organização da prova fornecerá um **seguro desportivo nominal** a todos os participantes de acordo com o **regime legal do seguro desportivo obrigatório - Lei Nº. 10/2009**.

Em caso de acidente, o atleta deve contactar a organização do evento para o encaminhamento à seguradora. Para iniciar um processo, é necessário que o atleta seja atendido pela equipa que faz o acompanhamento médico durante o evento, sem prejuízo de o atleta ser posteriormente encaminhado para outra unidade médica de emergência.

## 🔒 Proteção de Dados

Todos os dados recolhidos no processo de inscrição são mantidos e tratados de forma segura e destinam-se ao desenvolvimento natural do evento, nomeadamente: validação do seguro nominal para todos os participantes do evento, lista de inscritos e elaboração de tabelas de resultados/classificações.

Todos os participantes podem exercer o seu direito de acesso, retificação ou cancelamento dos seus dados pessoais enviando email para **geral@atletismomadeira.pt**.

## 📸 Direitos de Imagem

O participante, ao efetuar a inscrição, autoriza a cedência, a título gratuito e sem condições, dos direitos de utilização da sua imagem em fotos e filmagens que decorrerão durante a maratona, autorizando a sua reprodução em peças de comunicação de apoio.

## 🚗 Como Chegar

**Funchal, Madeira - Portugal**
🏝️ Ilha da Madeira, Região Autónoma

**Transporte:**
- ✈️ Aeroporto da Madeira - Cristiano Ronaldo
- 🚌 Transporte gratuito nos autocarros "Horários do Funchal" para os pontos de partida

## 📞 Contactos

**Email:**
- geral@atletismomadeira.pt

**Website Oficial:**
- [www.madeiramarathon.com](https://www.madeiramarathon.com)

**Inscrições Online:**
- [www.madeiramarathon.com](https://www.madeiramarathon.com)

**Inscrições Presenciais:**
- Sede da AARAM (Estádio de Câmara de Lobos)

## 👥 Organização

**Organizador Principal:**
- **AARAM** - Associação de Atletismo da Região Autónoma da Madeira

**Parceiros:**
- Abbott World Marathon Majors
- World's Marathons
- Travel Marathon
- Diversos patrocinadores Gold e parceiros institucionais

## ⚠️ Cancelamento do Evento

O cancelamento do evento pode ocorrer devido a fatores externos à organização: catástrofes naturais, manifestações, impossibilidade de utilização de faixas de rodagem, impossibilidade de utilização de telecomunicações, restrições governamentais, nova legislação.

Nestes casos, a organização reserva-se o direito, no prazo de 30 dias após a data prevista, de emitir parecer sobre as ações a tomar em consequência da gravidade do cancelamento.

## 📋 Casos Omissos

Este regulamento pode estar sujeito a alterações tardias. Quaisquer omissões neste regulamento serão resolvidas de acordo com as **Regras de Competição da Federação Portuguesa de Atletismo**.

---

**Regulamento completo disponível em:** [www.madeiramarathon.com](https://www.madeiramarathon.com)

⚠️ **A inscrição implica total aceitação do regulamento da prova.**`,
      externalUrl: "https://www.madeiramarathon.com",
      variants: {
        create: [
          // Marathon 42km
          {
            name: "Marathon 42km",
            distanceKm: 42.195,
            elevationGainM: null,
            cutoffTimeHours: 6.0,
            atrpGrade: null,
            startTime: "2026-01-17T15:00:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-06-01T00:00:00.000Z"),
                  endDate: new Date("2025-10-31T23:59:00.000Z"),
                  price: 65.0,
                  discountPercent: null,
                  note: "Até 31 Outubro 2025",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2025-11-30T23:59:00.000Z"),
                  price: 70.0,
                  discountPercent: 8,
                  note: "Novembro 2025",
                },
                {
                  name: "3ª Fase",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:00.000Z"),
                  price: 85.0,
                  discountPercent: 31,
                  note: "Dezembro 2025",
                },
              ],
            },
          },
          // Half-Marathon 21km
          {
            name: "Half-Marathon 21km",
            distanceKm: 21.0975,
            elevationGainM: null,
            cutoffTimeHours: 3.0,
            atrpGrade: null,
            startTime: "2026-01-17T17:00:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-06-01T00:00:00.000Z"),
                  endDate: new Date("2025-10-31T23:59:00.000Z"),
                  price: 30.0,
                  discountPercent: null,
                  note: "Até 31 Outubro 2025",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2025-11-01T00:00:00.000Z"),
                  endDate: new Date("2025-11-30T23:59:00.000Z"),
                  price: 35.0,
                  discountPercent: 17,
                  note: "Novembro 2025",
                },
                {
                  name: "3ª Fase",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:00.000Z"),
                  price: 40.0,
                  discountPercent: 33,
                  note: "Dezembro 2025",
                },
              ],
            },
          },
          // Mini Marathon 8km
          {
            name: "Mini Marathon 8km",
            distanceKm: 8.3,
            elevationGainM: null,
            cutoffTimeHours: 1.5,
            atrpGrade: null,
            startTime: "2026-01-17T16:30:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-06-01T00:00:00.000Z"),
                  endDate: new Date("2025-11-30T23:59:00.000Z"),
                  price: 15.0,
                  discountPercent: null,
                  note: "Até 30 Novembro 2025",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:00.000Z"),
                  price: 17.5,
                  discountPercent: 17,
                  note: "Dezembro 2025",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Created event: Maratona do Funchal");
  console.log(`   - ID: ${event.id}`);
  console.log(`   - Slug: ${event.slug}`);
  console.log(`   - Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   - City: ${event.city}`);
  console.log(
    `   - Variants: 3 (Marathon 42km, Half-Marathon 21km, Mini Marathon 8km)`
  );
  console.log("");
  console.log("🏃 Maratona do Funchal seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
