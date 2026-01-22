import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding I Trail/BTT Serras do Minho...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "trail-btt-serras-do-minho-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing Trail/BTT Serras do Minho event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  // Create the event
  const event = await prisma.event.create({
    data: {
      title: "I Trail/BTT Serras do Minho",
      slug: "trail-btt-serras-do-minho-2026",
      sportTypes: [SportType.TRAIL, SportType.BTT],
      startDate: new Date("2026-01-18T09:00:00.000Z"),
      registrationDeadline: new Date("2026-01-11T23:59:00.000Z"),
      city: "Caminha",
      country: "Portugal",
      description: `# I Trail/BTT Serras do Minho 2026

**"Vence onde poucos se atrevem a treinar"**

## 🏔️ Um Evento Solidário

Um evento solidário que une **aventura, superação e natureza**. Caminhada, Mini Trail e BTT — para todas as idades e níveis.

📍 **Local:** Dem, Serra d'Arga (Caminha)  
🗓️ **Data:** 18 de Janeiro de 2026  
🚴 **Modalidades:** Caminhada | Mini Trail | BTT

## 🌱 Sobre a Trilhos & Pedais

A **Trilhos & Pedais** nasceu a 23 de abril de 2025, da paixão de **Verónica Araújo** e **Micael Pereira** pelo desporto e pela natureza. 

Organizamos eventos de **Trail** e **BTT** no **Alto Minho**, promovendo o contacto com a natureza, o bem-estar e a superação pessoal.

## 🏃 Modalidades Disponíveis

### BTT 30km
- **Distância:** 30 km
- **Tempo Limite:** 5 horas
- **Idade Mínima:** 18 anos
- **Partida:** 09h00
- **Chegada Prevista:** 11h30 (1º atleta) - 14h00 (último atleta)

**Abastecimentos:**
- Km 15
- Meta

### Mini Trail 17km
- **Distância:** 17 km
- **Tempo Limite:** 5 horas
- **Idade Mínima:** 18 anos
- **Partida:** 09h00
- **Chegada Prevista:** 11h00 (1º atleta) - 13h00 (último atleta)

**Abastecimentos:**
- Km 8
- Meta

### Caminhada 10km
- **Distância:** 10 km
- **Tempo Limite:** 5 horas
- **Idade:** Aberta a todos (menores acompanhados por adulto responsável)
- **Partida:** 09h15
- **Chegada Prevista:** 12h00 (1º atleta) - 13h30 (último atleta)

**Abastecimentos:**
- Km 6
- Meta

## 🎯 Material Obrigatório

### BTT 30km

✅ **Obrigatório:**
- Recipiente para líquidos
- Apito
- Telemóvel operacional
- Manta de sobrevivência
- Dorsal visível

📦 **Recomendado:**
- Corta-vento/Impermeável

### Mini Trail 17km

✅ **Obrigatório:**
- Recipiente para líquidos
- Apito
- Telemóvel operacional
- Manta de sobrevivência
- Dorsal visível

📦 **Recomendado:**
- Corta-vento/Impermeável

### Caminhada 10km

📦 **Recomendado:**
- Recipiente para líquidos
- Corta-vento/Impermeável
- Telemóvel operacional

⚠️ **Importante:** 
- **Não será fornecido material de hidratação!** Os abastecimentos líquidos **não serão fornecidos através de garrafas nem de copos plásticos**
- Cada atleta é responsável por levar consigo o(s) recipiente(s) que julgue mais adequado(s) para a sua hidratação
- Preferência para recipientes que sirvam também para bebidas quentes
- Cada atleta deve trazer **4 alfinetes** para fixar o dorsal

## 🌍 Responsabilidade Ambiental

A **freguesia de Dem é um património a preservar!** Queremos que as crianças de hoje usufruam, tal como vocês, do mesmo território amanhã!

**Princípios Ecológicos:**
✅ Prova realiza-se em ambiente de natureza/montanha
✅ Preservar o património natural de enorme riqueza
✅ Respeitar e proteger a natureza
✅ **Zero plástico:** Sem garrafas ou copos plásticos nos abastecimentos
✅ Atleta responsável pelo transporte de todos os invólucros e resíduos
✅ Depositar resíduos no abastecimento mais próximo ou transportar até à meta

**Penalização:** Desclassificação para quem não respeitar as normas ambientais!

## 🏆 Prémios

### Classificação Geral (BTT 30km e Mini Trail 17km)

**Troféus para:**
- 🥇 1º Lugar Geral (M/F)
- 🥈 2º Lugar Geral (M/F)
- 🥉 3º Lugar Geral (M/F)

**Nota:** Não há distinção de sexo ou idade na classificação geral. Contam os tempos dos 3 melhores atletas.

## 📋 Programa

### Domingo, 18 de Janeiro de 2026

**Secretariado - Centro Cultural de Dem, Caminha**

- **07h00** - Abertura do Secretariado (todas as provas)
- **07h00 - 08h30** - Funcionamento Secretariado BTT
- **07h00 - 09h30** - Funcionamento Secretariado Caminhada e Mini Trail

**Partidas:**

- **09h00** - 🚴 **1ª Partida: BTT 30km**
- **09h00** - 🏃 **2ª Partida: Mini Trail 17km**
- **09h15** - 🚶 **3ª Partida: Caminhada 10km**

**Chegadas Previstas:**

- **11h00** - Primeiro atleta Mini Trail
- **11h30** - Primeiro atleta BTT
- **12h00** - Primeiro atleta Caminhada
- **13h00** - Último atleta Mini Trail
- **13h30** - Último atleta Caminhada / **Cerimónia Entrega Prémios**
- **14h00** - Último atleta BTT

## 📦 Material e Serviços Incluídos

Todos os participantes recebem:

✅ **Dorsal** (trazer 4 alfinetes)
✅ **Seguro de acidentes pessoais**
✅ **Abastecimentos** assinalados (líquidos e sólidos)
✅ **Banhos** no final da prova (Balneários Centro Cultural de Dem)
✅ **Transporte para a meta** em caso de desistência
✅ **Serviço de segurança e socorro**
✅ **Reforço alimentar na meta**
✅ Outras ofertas que a organização venha a conseguir

⚠️ **Nota:** A organização **não fornece** sacos, garrafas ou copos plásticos.

## ⏱️ Tempo Limite e Barreiras Horárias

**Tempo limite:** 5 horas para todas as modalidades

Os **"Corredores Vassoura"** ou responsável de cada controle terão poder para retirar da prova qualquer participante se:
- O seu tempo na corrida assim o indicar
- O seu estado de saúde assim o aconselhar

**Em caso de desistência:** Dirigir-se ao posto de abastecimento mais próximo e solicitar apoio, ou comunicar no secretariado o nº de dorsal.

## 🚗 Como Chegar

### De Viana do Castelo (aprox. 28 min, 30 km)

1. Siga pela **Avenida dos Bombeiros Voluntários** (N101/N13-9) em direção sudoeste (300m)
2. Na rotunda, siga em frente
3. Use a faixa da esquerda para entrar na **A3/IP1** (destino Porto ou Viana do Castelo)
4. Siga pela **A3** durante 4,5 km
5. Saia na **saída 14**, para apanhar a **N13** (direção Viana do Castelo ou Vila Nova de Cerveira)
6. Continue pela **N13** durante 10 km
7. Entre na **A28** e percorra 10 km
8. Saia da **A28** em direção à **EM526**
9. Destino: **Centro Cultural de Dem, Caminha**

### Do Porto (aprox. 51 min, 86 km)

1. Siga pela **Avenida da França** em direção à Avenida da Associação Empresarial de Portugal (1,7 km)
2. Entre na **A28** (direção Viana do Castelo)
3. Continue na **A28** por 67 km (autoestrada com portagem)
4. Na **saída 0**, continue em direção a Caminha, N13 e Valença
5. Após 18 km, saia da **A28** em direção à **Rua de São Gonçalo (EM526)**
6. Na rotunda, siga pela segunda saída para continuar pela **EM526**
7. Destino: **Centro Cultural de Dem, Caminha**

## 📜 Condições de Participação

### Idade

- **BTT 30km:** Mínimo 18 anos
- **Mini Trail 17km:** Mínimo 18 anos
- **Caminhada 10km:** Aberta a todos (menores acompanhados por adulto responsável com termo de responsabilidade assinado)

### Condições Físicas

É imprescindível ter a **condição física adequada** às características desta prova, tendo **exames médicos atualizados**.

O terreno onde se desenrola a prova está sujeito a **alterações climatéricas repentinas**. Os atletas poderão estar expostos a situações meteorológicas diferentes como:
- Calor ou frio
- Vento forte
- Nevoeiro denso
- Precipitação intensa

É fundamental que o atleta tenha noção de **autogestão do esforço**, quer físico, quer mental, perante situações adversas.

### Dorsal

O dorsal é **pessoal e intransmissível**. Deve estar em local **facilmente visível** aos elementos da organização.

**Em caso de desistência:** Informar à organização no secretariado ou através do número de emergência que está no dorsal.

### Conduta Desportiva

O comportamento inadequado, o recurso de linguagem ofensiva, a agressão verbal ou de qualquer outra espécie, será comunicado à organização sempre que o ato seja merecedor de tal.

## ❌ Desqualificações

Ficará desqualificado todo aquele que:

- ❌ Não cumpra o presente regulamento
- ❌ Não complete a totalidade do percurso
- ❌ Deteriore ou suje o meio por onde passe (lançando invólucros de barras e géis no chão)
- ❌ Não leve o seu número de dorsal bem visível
- ❌ Ignore as indicações da organização
- ❌ Tenha alguma conduta anti-desportiva

⚠️ A organização impedirá, em **futuras edições**, as inscrições de participantes desqualificados por conduta anti-desportiva.

## 🚦 Passagem em Locais com Tráfego Rodoviário

A organização terá um **sistema de segurança** ao longo de todo o percurso. Contudo, dado que poderá ser impossível realizar corte de tráfego rodoviário na sua totalidade, os participantes devem **cumprir as regras de trânsito** nas estradas conforme o Código da Estrada.

Durante a prova os atletas poderão efetuar **ultrapassagens** desde que as mesmas não coloquem em risco a sua integridade e a dos seus concorrentes. Os atletas ultrapassados devem **facilitar a manobra** de ultrapassagem, encostando-se ao máximo ou parando se necessário.

## 🛡️ Seguro e Responsabilidades

A organização contratualiza os **seguros obrigatórios por lei** para a realização deste tipo de provas. O prémio do seguro está **incluído no valor da inscrição**.

### Responsabilidades

A inscrição na prova implica **total aceitação do presente regulamento**. Os participantes serão responsáveis por todas as ações suscetíveis de produzir danos materiais, morais, ou de qualquer outra natureza, a si mesmos e/ou a terceiros.

A organização **declina toda a responsabilidade** em caso de acidente, de negligência, ou de roubo de objetos e/ou valores de cada participante.

## 🔄 Alterações e Cancelamento

### No Mês Anterior ao Evento

**Não é permitida** a alteração de dados na inscrição nem a organização se vê no dever de devolver qualquer valor da inscrição.

### Cancelamento do Evento

Em caso de um participante não poder participar e/ou as condições climatéricas/motivos de força maior não permitirem a realização do evento ou seu cancelamento, a organização **não se vê no dever de devolver o valor das inscrições**.

A organização reserva-se ao **direito de realizar modificações** que considere necessárias, dependendo das diferentes condições, assim como à **suspensão da prova** se as condições meteorológicas assim o obrigarem, ou por motivos de força maior.

## 🗺️ Marcações e Controles

O percurso estará marcado com **fitas de cor visível**.

## 🚑 Apoio e Emergência

Haverá **equipas de apoio, socorro e emergência** para prestar os cuidados aos participantes que deles necessitem.

Os participantes ficam **obrigados a auxiliar** os acidentados e a respeitar as regras de viação nos cruzamentos da estrada.

## 📸 Direitos de Imagem

A aceitação do presente regulamento implica, obrigatoriamente, que o participante autoriza aos organizadores da prova a gravação total ou parcial da sua participação na mesma, pressupõe também a sua concordância para que a organização possa utilizar a imagem do atleta para a promoção e difusão da prova em todas as suas formas (rádio, imprensa escrita, vídeo, fotografia, internet, cartazes, meios de comunicação social, etc.).

## 📞 Contactos

**Email:**
- trilhoepedaiscom@gmail.com

**Telemóvel:**
- Verónica Araújo: 927 271 339
- Micael Pereira: 966 201 091
- *(Chamada para rede móvel nacional)*

**Website e Inscrições:**
- [Trilhos & Pedais](https://trilhosepedais.com)

**Local do Evento:**
- Centro Cultural de Dem
- Dem, Caminha
- Serra d'Arga

## 👥 Organização

**Organizadores:**
- Verónica Araújo
- Micael Pereira
- Trilhos & Pedais

**Apoio:**
- Junta de Freguesia de Dem - Caminha

---

**Regulamento completo disponível no website oficial**

⚠️ **A inscrição implica total aceitação do regulamento da prova.**

🌱 **A freguesia de Dem é um património a preservar! Respeite e proteja a natureza!**`,
      externalUrl: "https://trilhosepedais.com",
      variants: {
        create: [
          // BTT 30km
          {
            name: "BTT 30km",
            distanceKm: 30,
            elevationGainM: null,
            cutoffTimeHours: 5.0,
            atrpGrade: null,
            startTime: "2026-01-18T09:00:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-11T23:59:00.000Z"),
                  price: 20.0,
                  discountPercent: null,
                  note: "01/12/2025 a 11/01/2026",
                },
              ],
            },
          },
          // Mini Trail 17km
          {
            name: "Mini Trail 17km",
            distanceKm: 17,
            elevationGainM: null,
            cutoffTimeHours: 5.0,
            atrpGrade: null,
            startTime: "2026-01-18T09:00:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-11T23:59:00.000Z"),
                  price: 15.0,
                  discountPercent: null,
                  note: "01/12/2025 a 11/01/2026",
                },
              ],
            },
          },
          // Caminhada 10km
          {
            name: "Caminhada 10km",
            distanceKm: 10,
            elevationGainM: null,
            cutoffTimeHours: 5.0,
            atrpGrade: null,
            startTime: "2026-01-18T09:15:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "Inscrição",
                  startDate: new Date("2025-12-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-11T23:59:00.000Z"),
                  price: 8.0,
                  discountPercent: null,
                  note: "01/12/2025 a 11/01/2026",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Created event: I Trail/BTT Serras do Minho");
  console.log(`   - ID: ${event.id}`);
  console.log(`   - Slug: ${event.slug}`);
  console.log(`   - Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   - City: ${event.city}`);
  console.log(`   - Variants: 3 (BTT 30km, Mini Trail 17km, Caminhada 10km)`);
  console.log("");
  console.log("🏃 I Trail/BTT Serras do Minho seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
