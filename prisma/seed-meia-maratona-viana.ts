import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding 27ª Meia Maratona Manuela Machado...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "meia-maratona-manuela-machado-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "27ª Meia Maratona Manuela Machado",
      slug: "meia-maratona-manuela-machado-2026",
      sportTypes: [SportType.RUNNING],
      startDate: new Date("2026-01-25T10:30:00.000Z"),
      registrationDeadline: new Date("2026-01-21T20:00:00.000Z"),
      city: "Viana do Castelo",
      country: "Portugal",
      latitude: 41.69051799453272,
      longitude: -8.829092265309814,
      googleMapsUrl: "https://maps.app.goo.gl/HjQ2GpEMgZxZvjdq9",
      externalUrl:
        "https://www.cyclonessports.com/index.php/348-jsc-27-meia-maratona-manuela-machado",
      isFeatured: true,
      description: `# 27ª Meia Maratona Manuela Machado

**"Viana Fica no Coração"**

A **Meia Maratona Manuela Machado** é um dos eventos mais emblemáticos do atletismo português, realizada anualmente em **Viana do Castelo** desde 1998. Com 27 edições de história, esta prova homenageia a atleta Manuela Machado e atrai milhares de corredores de todo o país.

## 🏃 Sobre a Prova

**Data:** 25 de janeiro de 2026
**Hora de Partida:** 10h30
**Distância Oficial:** 21.095 metros (homologada pela FPA)
**Limite de Participantes:** 4000 atletas
**Tempo Limite:** 3 horas

## 📍 Percurso

**Partida e Chegada:** Centro Cultural de Viana do Castelo, Praça Marquês Júnior

O percurso percorre as zonas mais emblemáticas de Viana do Castelo:
- Marginal do Rio Lima
- Estrada Nacional 202
- IP9
- Ponte do Portuzelo
- Cardielos (retorno)
- Ponte Eiffel
- Alameda Alves Cerqueira
- Avenida Campo Castelo

**Características:**
- Percurso rápido e plano
- Ideal para records pessoais
- Paisagens deslumbrantes do Rio Lima
- Apoio do público em todo o trajeto

## 💰 Prémios Monetários Generosos

### Classificação Geral (Masculino e Feminino)

| Posição | Prémio | Posição | Prémio |
|---------|--------|---------|--------|
| 1º | 800€ | 11º | 45€ |
| 2º | 700€ | 12º | 40€ |
| 3º | 500€ | 13º | 35€ |
| 4º | 400€ | 14º | 30€ |
| 5º | 300€ | 15º-19º | 25€ |
| 6º | 250€ | 20º-25º | 20€ |
| 7º | 200€ | | |
| 8º | 100€ | | |
| 9º | 80€ | | |
| 10º | 50€ | | |

**Total de prémios gerais:** Mais de 9000€

### Prémios por Escalão de Veteranos

Para todos os escalões (M35, M40, M45, M50, M55 / F35, F40, F45, F50, F55):

| Posição | Prémio |
|---------|--------|
| 1º | 100€ |
| 2º | 75€ |
| 3º | 50€ |
| 4º | 25€ |
| 5º | 20€ |

⚠️ **Nota:** Os prémios não são acumuláveis. Cada atleta recebe apenas o prémio de maior valor.

## 🎽 Kit de Participação

✅ Dorsal oficial com chip de cronometragem
✅ Medalha de finisher
✅ Brindes de presença
✅ Seguro desportivo (até 75 anos, não federados)
✅ Acesso a duches no Centro Cultural

## 💧 Abastecimentos

Pontos de abastecimento nos:
- **5 km** - Água
- **10 km** - Água e isotónicos
- **15 km** - Água e isotónicos
- **Meta** - Água, isotónicos e frutas

## 📋 Levantamento de Dorsais

**Local:** Centro Cultural de Viana do Castelo (piso inferior)

**Horários:**
- **Sexta, 23 janeiro:** 16h00 - 20h00
- **Sábado, 24 janeiro:** 15h00 - 21h00
- **Domingo, 25 janeiro:** 08h00 - 09h30

**Documentação:**
- Confirmação de inscrição (digital ou impressa)
- Não é necessário imprimir - apresente no telemóvel ♻️

## 🏥 Apoio Médico

- Assistência médica no percurso
- Ambulâncias na partida e chegada
- Controlo antidoping (atletas selecionados)

## ⚖️ Escalões

**Escalão Sénior:** Até 34 anos

**Escalões de Veteranos:**
- **M35/F35:** 35-39 anos
- **M40/F40:** 40-44 anos
- **M45/F45:** 45-49 anos
- **M50/F50:** 50-54 anos
- **M55/F55:** 55+ anos

## 📞 Contactos

**Organização:** Cyclones Atlético Clube
**Apoio:** Câmara Municipal de Viana do Castelo

**Email:** diogo.machado@mmviana.com
**Telefone:** (+351) 968 670 187
**Morada:** Rua Nossa Senhora de Fátima nº176, 4925-344 Cardielos, Viana do Castelo

**Websites:**
- www.mmviana.com
- www.cyclonessports.com

## 🌟 Destaque

Esta é uma das meias maratonas mais rápidas de Portugal, com um percurso maioritariamente plano e condições ideais para alcançar records pessoais. A atmosfera única de Viana do Castelo e o apoio caloroso do público tornam esta prova numa experiência inesquecível!`,
      variants: {
        create: [
          {
            name: "Meia Maratona 21km",
            distanceKm: 21,
            cutoffTimeHours: 3,
            maxParticipants: 4000,
            startDate: new Date("2026-01-25T10:30:00.000Z"),
            startTime: "10:30",
            description:
              "Distância oficial de 21.095 metros homologada pela Federação Portuguesa de Atletismo. Percurso rápido e plano pela cidade de Viana do Castelo, passando pela Marginal do Rio Lima, Ponte do Portuzelo e zonas emblemáticas da cidade. Ideal para records pessoais. Prémios monetários até ao 25º lugar masculino e feminino, além de prémios por escalão de veteranos.",
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase (Early Bird)",
                  price: 12.5,
                  startDate: new Date("2025-10-01T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:59.000Z"),
                  note: "Até 31 de dezembro de 2025 - Melhor preço!",
                },
                {
                  name: "2ª Fase",
                  price: 15.0,
                  startDate: new Date("2026-01-01T00:00:00.000Z"),
                  endDate: new Date("2026-01-21T20:00:00.000Z"),
                  note: "De 1 a 21 de janeiro de 2026",
                },
                {
                  name: "Secretariado (Limitada)",
                  price: 25.0,
                  startDate: new Date("2026-01-23T00:00:00.000Z"),
                  endDate: new Date("2026-01-24T21:00:00.000Z"),
                  note: "Inscrições presenciais no secretariado (dias 23 e 24 jan) - Vagas limitadas",
                },
              ],
            },
          },
          {
            name: "Caminhada",
            distanceKm: 21,
            cutoffTimeHours: 4,
            startDate: new Date("2026-01-25T10:30:00.000Z"),
            startTime: "10:30",
            description:
              "Caminhada de 21km pelo mesmo percurso da meia maratona, ideal para quem quer desfrutar da paisagem de Viana do Castelo num ambiente mais descontraído. Inscrições realizadas no secretariado nos dias 23 e 24 de janeiro. Todos os participantes recebem medalha de finisher.",
            pricingPhases: {
              create: [
                {
                  name: "Inscrição no Secretariado",
                  price: 15.0,
                  startDate: new Date("2026-01-23T00:00:00.000Z"),
                  endDate: new Date("2026-01-24T21:00:00.000Z"),
                  note: "Inscrições apenas no secretariado (dias 23 e 24 janeiro)",
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
    `   Location: ${event.city} at ${event.latitude}, ${event.longitude}`
  );
  console.log(`   Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   External URL: ${event.externalUrl}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
