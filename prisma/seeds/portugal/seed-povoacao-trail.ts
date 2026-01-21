import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("⛰️ Seeding Povoação Trail...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "povoacao-trail-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "Povoação Trail",
      slug: "povoacao-trail-2026",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-03-15T08:00:00.000Z"),
      registrationDeadline: new Date("2026-02-23T23:59:59.000Z"),
      city: "Povoação",
      country: "Portugal",
      latitude: 37.74806,
      longitude: -25.32389,
      googleMapsUrl: "https://maps.google.com/?q=37.74806,-25.32389",
      externalUrl: "https://www.povoacaotrail.pt",
      isFeatured: true,
      description: `# Povoação Trail

**5ª Edição - Trail nos Açores**

O **Povoação Trail** é um evento de Trail Running que percorre trilhos e caminhos no concelho da Povoação, Ilha de São Miguel, Açores. Com percursos desafiantes e paisagens deslumbrantes, oferece experiências únicas aos atletas em diferentes formatos: Trail Ultra, Trail, Trail Sprint e Caminhada.

**Data:** 15 de março de 2026
**Local:** Vila da Povoação, Ilha de São Miguel, Açores
**Organização:** HL Runners Club em parceria com Município da Povoação

## 🏃 As Provas

### ⛰️ Trail Ultra - 50 km

**Distância:** ~50 km
**Desnível Positivo:** D+3500m
**Tempo Limite:** 11 horas
**Partida:** 08:00
**Categorização:** GRAU 4 ATRP | Série 150 ATRP

Prova de corrida pedestre em natureza que percorre trilhos, caminhos agrícolas e florestais e linhas de água. Partida e chegada no Jardim Municipal da Vila da Povoação. Prova de carácter competitivo adequada a atletas experientes devido às exigências técnicas, altimétricas e de quilometragem.

**Posto de Controlo Intermédio (PCI):**
- Tempo limite: 6h de prova (14:00 horas)
- Localização: PA3

**🏆 Recorde de Prova:** 05:27:05
- **Prémio especial:** 500€ para quem bater o recorde!

**Abastecimentos:**
- 5 postos com sólidos e líquidos
- Vários pontos de água potável ao longo do percurso
- Refeição no final

### 🏔️ Trail - 30 km

**Distância:** ~30 km
**Desnível Positivo:** D+2000m
**Tempo Limite:** 7h30
**Partida:** 08:30
**Categorização:** GRAU 3 ATRP | Série 150 ATRP

Percorre trilhos, caminhos agrícolas e florestais e ribeiras no Concelho de Povoação. Partida e chegada no Jardim Municipal da Vila da Povoação. Prova competitiva com grau de dificuldade menor que o Ultra, adequando-se a atletas menos experientes.

**Abastecimentos:**
- 3 postos com sólidos e líquidos
- Refeição no final

### 🏃‍♂️ Trail Sprint - 15 km

**Distância:** ~15 km
**Desnível Positivo:** D+750m
**Tempo Limite:** 4 horas
**Partida:** 10:15
**Categorização:** GRAU 3 ATRP | Série 150 ATRP

Partida na freguesia de Nossa Senhora dos Remédios e chegada no Jardim Municipal da Vila da Povoação. Prova competitiva com menor grau de dificuldade, adequando-se a atletas menos experientes. Transfer incluído da Vila da Povoação para o local de partida.

**Abastecimentos:**
- 1 posto com sólidos e líquidos
- Refeição no final

### 🚶 Caminhada - 9 km

**Distância:** ~9 km
**Desnível Positivo:** D+350m
**Partida:** 10:15

Caminhada não competitiva para promoção de hábitos de vida saudáveis. Partida na freguesia de Nossa Senhora dos Remédios e chegada no Jardim Municipal da Vila da Povoação. Transfer incluído. Aberta a todas as idades (menores de 14 anos devem ser acompanhados por adulto responsável).

## 🏆 Prémios

### Prize Money (Classificação Geral)

**Trail Ultra 50km:**
- 1º lugar: Prémio monetário
- 2º lugar: Prémio monetário
- 3º lugar: Prémio monetário
- **Bónus Recorde:** +500€ se bater 05:27:05

**Trail 30km:**
- 1º lugar: Prémio monetário
- 2º lugar: Prémio monetário
- 3º lugar: Prémio monetário

**Trail Sprint 15km:**
- 1º lugar: Prémio monetário (apenas geral M/F)

### Classificações e Prémios

**Trail Ultra e Trail:**
- Classificação geral individual (M/F)
- Classificação por escalão etário
- Classificação coletiva (equipas - soma dos 3 primeiros)
- Prémios para top 3 geral, escalões e equipas

**Trail Sprint:**
- Classificação geral (M/F)
- Classificação por escalão etário
- Prémios apenas para top 3 geral M/F

**Caminhada:**
- Sem classificação ou prémios

## 👥 Escalões Etários

- **Sub23:** 18-22 anos
- **Sénior:** 23-39 anos
- **M/F-40:** 40-44 anos
- **M/F-45:** 45-49 anos
- **M/F-50:** 50-54 anos
- **M/F-55:** 55-59 anos
- **M/F-60:** >60 anos
- **M/F-65:** >65 anos

## 🎒 Material Obrigatório

### Trail Ultra (50km) e Trail (30km):
✅ Dorsal visível
✅ Depósito de água 1L (sem copos disponibilizados)
✅ Mochila ou cinto
✅ Telemóvel operacional
✅ Manta térmica
✅ Apito
✅ Impermeável/Corta-vento
✅ Frontal de luz (apenas Ultra)

### Trail Sprint (15km) e Caminhada (9km):
✅ Dorsal visível
✅ Depósito de água 250ml
✅ Mochila ou cinto
✅ Telemóvel operacional
✅ Manta térmica
✅ Apito
✅ Impermeável/Corta-vento

**Material Aconselhável:**
- Banda elástica ou ligadura
- Bastões
- Roupa e calçado adequados

**⚠️ Penalização:** 20 minutos por cada item em falta!

## 📅 Programa

**Quinta-feira, 5 de março 2026**
- 13:00-19:00: Secretariado HL Health Club, Ponta Delgada

**Sábado, 7 de março 2026**
- 14:00-19:00: Secretariado Pavilhão Municipal da Povoação

**Domingo, 8 de março 2026**
- 07:00: Abertura do Secretariado
- 07:55: Encerramento do Secretariado
- 08:00: Partida Trail Ultra
- 08:30: Partida Trail
- 08:35: Transfer para Trail Sprint e Caminhada (Povoação → N.Sra. Remédios)
- 10:15: Partida Trail Sprint e Caminhada
- 15:00: Cerimónia de Entrega de Prémios

## 📋 Condições de Participação

**Idade Mínima:**
- Trail Ultra, Trail, Trail Sprint: 18 anos
- Caminhada: Todas as idades (menores 14 anos com adulto responsável)

**Limite de Participantes:** 750 atletas no total

## 🎁 O Que Está Incluído

✅ Seguro de Acidentes Pessoais e Responsabilidade Civil
✅ Dorsal e chip de cronometragem (provas competitivas)
✅ Abastecimentos líquidos e sólidos
✅ Transfer (Trail Sprint e Caminhada)
✅ Duches
✅ Lembrança finisher oficial
✅ Refeição no final
✅ T-shirt técnica e Buff
✅ Saco de atleta com brindes
✅ Ficheiro GPX dos percursos

## 🔒 Segurança

- Seguro de Responsabilidade Civil e Acidentes Pessoais
- Primeiros socorros estrategicamente posicionados
- Postos de controlo obrigatórios
- Controlos surpresa para verificar cumprimento do percurso
- Número de emergência no dorsal

**⚠️ Caução Seguro:** 75€ (em caso de acionamento)

## ⚠️ Regras Importantes

### Desclassificação Imediata:
❌ Não prestar assistência a participante em perigo
❌ Abandonar sem avisar a Organização
❌ Partilhar dorsal
❌ Dorsal não visível
❌ Atalhar percurso intencionalmente
❌ Boleia/transporte não autorizado
❌ Desrespeito à Organização ou participantes
❌ Remover sinalização
❌ Exceder tempo limite
❌ Falhar posto de controlo
❌ Perder chip
❌ Poluir/danificar meio ambiente
❌ Receber ajuda externa fora das áreas definidas

## 🌿 Respeito pela Natureza

O respeito pela Natureza é obrigatório. Não é admissível poluir trilhos ou destruir/alterar elementos naturais. Desclassificação imediata para infratores.

## 📍 Localização

**Povoação, Ilha de São Miguel, Açores**

Um dos concelhos mais bonitos dos Açores, com:
- Paisagens naturais deslumbrantes
- Trilhos desafiantes e variados
- Natureza virgem e preservada
- Linhas de água e florestas exuberantes
- Vistas panorâmicas sobre o oceano Atlântico

## 🔄 Política de Reembolso

❌ Não há devolução do valor da inscrição
✅ Em caso de doença/lesão (comprovada até 1 março): valor transita para próxima edição
❌ Cancelamento por força maior: sem reembolso

## 📱 Contactos

**Email:** povoacaotrail@gmail.com
**Website:** www.povoacaotrail.pt
**Facebook:** facebook.com/povoacaotrail

**Organização:** HL Runners Club
**Parceria:** Município da Povoação

---

💪 Uma experiência única nos Açores! Trail de excelência com paisagens de cortar a respiração! ⛰️`,
      variants: {
        create: [
          {
            name: "Trail Ultra - 50 km",
            distanceKm: 50,
            elevationGainM: 3500,
            cutoffTimeHours: 11,
            atrpGrade: 4,
            startDate: new Date("2026-03-15T08:00:00.000Z"),
            startTime: "08:00",
            description:
              "Prova Ultra de ~50km com D+3500m. GRAU 4 ATRP, Série 150. Percorre trilhos, caminhos agrícolas e florestais no Concelho da Povoação. Partida e chegada no Jardim Municipal. Posto de controlo intermédio aos 6h de prova. Adequada a atletas experientes. 5 postos de abastecimento. Classificação geral, escalões e equipas. Prize money geral M/F. BÓNUS: 500€ para quem bater o recorde de 05:27:05!",
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  price: 35.0,
                  startDate: new Date("2025-07-01T00:00:00.000Z"),
                  endDate: new Date("2025-07-31T23:59:59.000Z"),
                  note: "Early bird - melhor preço!",
                },
                {
                  name: "2ª Fase",
                  price: 40.0,
                  startDate: new Date("2025-08-01T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:59.000Z"),
                  note: "Preço intermédio",
                },
                {
                  name: "3ª Fase",
                  price: 45.0,
                  startDate: new Date("2026-01-01T00:00:00.000Z"),
                  endDate: new Date("2026-02-23T23:59:59.000Z"),
                  note: "Fase final - últimas vagas",
                },
              ],
            },
          },
          {
            name: "Trail - 30 km",
            distanceKm: 30,
            elevationGainM: 2000,
            cutoffTimeHours: 7.5,
            atrpGrade: 3,
            startDate: new Date("2026-03-15T08:30:00.000Z"),
            startTime: "08:30",
            description:
              "Trail de ~30km com D+2000m. GRAU 3 ATRP, Série 150. Percorre trilhos, caminhos agrícolas e ribeiras na Povoação. Partida e chegada no Jardim Municipal. Grau de dificuldade menor que o Ultra. 3 postos de abastecimento. Classificação geral, escalões e equipas. Prize money geral M/F. Adequada a atletas menos experientes que o Ultra.",
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  price: 25.0,
                  startDate: new Date("2025-07-01T00:00:00.000Z"),
                  endDate: new Date("2025-07-31T23:59:59.000Z"),
                  note: "Early bird - melhor preço!",
                },
                {
                  name: "2ª Fase",
                  price: 30.0,
                  startDate: new Date("2025-08-01T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:59.000Z"),
                  note: "Preço intermédio",
                },
                {
                  name: "3ª Fase",
                  price: 35.0,
                  startDate: new Date("2026-01-01T00:00:00.000Z"),
                  endDate: new Date("2026-02-23T23:59:59.000Z"),
                  note: "Fase final - últimas vagas",
                },
              ],
            },
          },
          {
            name: "Trail Sprint - 15 km",
            distanceKm: 15,
            elevationGainM: 750,
            cutoffTimeHours: 4,
            atrpGrade: 3,
            startDate: new Date("2026-03-15T10:15:00.000Z"),
            startTime: "10:15",
            description:
              "Trail Sprint de ~15km com D+750m. GRAU 3 ATRP, Série 150. Partida em N.Sra. dos Remédios, chegada no Jardim Municipal da Povoação. Transfer incluído. Menor grau de dificuldade, adequado a atletas menos experientes. 1 posto de abastecimento. Classificação geral e escalões. Prize money apenas geral M/F.",
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  price: 20.0,
                  startDate: new Date("2025-07-01T00:00:00.000Z"),
                  endDate: new Date("2025-07-31T23:59:59.000Z"),
                  note: "Early bird - melhor preço!",
                },
                {
                  name: "2ª Fase",
                  price: 25.0,
                  startDate: new Date("2025-08-01T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:59.000Z"),
                  note: "Preço intermédio",
                },
                {
                  name: "3ª Fase",
                  price: 30.0,
                  startDate: new Date("2026-01-01T00:00:00.000Z"),
                  endDate: new Date("2026-02-23T23:59:59.000Z"),
                  note: "Fase final - últimas vagas",
                },
              ],
            },
          },
          {
            name: "Caminhada - 9 km",
            distanceKm: 9,
            elevationGainM: 350,
            cutoffTimeHours: 3,
            startDate: new Date("2026-03-15T10:15:00.000Z"),
            startTime: "10:15",
            description:
              "Caminhada não competitiva de ~9km com D+350m. Partida em N.Sra. dos Remédios, chegada no Jardim Municipal da Povoação. Transfer incluído. Aberta a todas as idades (menores 14 anos com adulto responsável). Sem classificação ou prémios. Promoção de hábitos saudáveis. 1 posto de abastecimento. Refeição no final.",
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  price: 15.0,
                  startDate: new Date("2025-07-01T00:00:00.000Z"),
                  endDate: new Date("2025-07-31T23:59:59.000Z"),
                  note: "Early bird - melhor preço!",
                },
                {
                  name: "2ª Fase",
                  price: 18.0,
                  startDate: new Date("2025-08-01T00:00:00.000Z"),
                  endDate: new Date("2025-12-31T23:59:59.000Z"),
                  note: "Preço intermédio",
                },
                {
                  name: "3ª Fase",
                  price: 25.0,
                  startDate: new Date("2026-01-01T00:00:00.000Z"),
                  endDate: new Date("2026-02-23T23:59:59.000Z"),
                  note: "Fase final - últimas vagas",
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
    `   Location: ${event.city}, Ilha de São Miguel at ${event.latitude}, ${event.longitude}`
  );
  console.log(`   Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   Sport: TRAIL`);
  console.log(
    `   Variants: 4 (Ultra 50km, Trail 30km, Sprint 15km, Caminhada 9km)`
  );
  console.log(`   ATRP Grades: Ultra GRAU 4, Trail/Sprint GRAU 3`);
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
