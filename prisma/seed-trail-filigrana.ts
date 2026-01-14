import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏃 Seeding Trail da Filigrana...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "trail-da-filigrana-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing Trail da Filigrana event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  // Create the event
  const event = await prisma.event.create({
    data: {
      title: "Trail da Filigrana",
      slug: "trail-da-filigrana-2026",
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-01-17T14:00:00.000Z"),
      registrationDeadline: new Date("2026-01-11T23:59:00.000Z"),
      city: "Gondomar",
      country: "Portugal",
      description: `# Trail da Filigrana 2026

O regresso do **Trail da Filigrana** é uma excelente oportunidade para voltar aos trilhos de uma prova que deixou grandes memórias a quem participou nas primeiras quatro edições.

## 📍 Localização e Percurso

O Trail da Filigrana é uma prova que percorre **trilhos, caminhos rurais e florestais no concelho de Gondomar**, com partida e chegada no **Parque Urbano de Gondomar**.

A prova oferece vistas deslumbrantes sobre as zonas florestais do concelho, numa experiência única de corrida e caminhada na natureza.

## 🏃 Provas Disponíveis

### Trail Sprint 22km
- **Distância:** 22km
- **Desnível Positivo:** ~700m
- **Tempo Limite:** 4h00
- **Classificação:** ATRP Grau 2
- **Idade Mínima:** 18 anos
- **Partida:** 14h00

**Barreiras Horárias:**
- PA1 (+/- 6,3km): 1h15m
- PA2 (+/- 12,6km): 2h15m  
- PA3 (+/- 19km): 3h15m
- Meta: 4h00

### Trail Mini 12km
- **Distância:** 12km
- **Desnível Positivo:** ~400m
- **Tempo Limite:** 3h00
- **Classificação:** ATRP Grau 2
- **Idade Mínima:** 16 anos
- **Partida:** 14h30

**Barreiras Horárias:**
- PA1 (+/- 6,3km): 1h15m
- PA2 (+/- 9,3km): 2h00m
- Meta: 3h00

### Caminhada 10km
- **Distância:** 10km
- **Tempo Limite:** 3h00
- **Idade:** Aberta a maiores de idade e menores acompanhados
- **Partida:** 14h45
- **Nota:** Sem classificação competitiva

**Barreiras Horárias:**
- PA1 (+/- 5,5km): 1h30m
- Meta: 3h00

## 🎯 Material Obrigatório

Todos os atletas devem estar equipados com:

✅ **Obrigatório:**
- Dorsal visível durante todo o percurso
- Telemóvel operacional com bateria suficiente
- Manta Térmica de Sobrevivência
- Apito

📦 **Recomendado:**
- Depósito de água (para quem esteja em prova mais de 1h30)
- Corta-vento ou Impermeável (conforme condições climatéricas)
- Frontal com autonomia suficiente (para quem chegar depois das 17h)

⚠️ **Importante:** Haverá **controlo zero** antes da partida. Atletas sem material obrigatório serão impedidos de participar.

## 🥤 Postos de Abastecimento

**Trail Sprint 22km:**
- PA1: Sólidos + Líquidos (+/- 6,3km)
- PA2: Sólidos + Líquidos (+/- 12,6km)
- PA3: Sólidos + Líquidos (+/- 19km)

**Trail Mini 12km:**
- PA1: Sólidos + Líquidos (+/- 6,3km)
- PA2: Sólidos + Líquidos (+/- 9,3km)

**Caminhada 10km:**
- PA1: Sólidos + Líquidos (+/- 5,5km)

⚠️ **Nota:** A organização **não disponibilizará copos** nos abastecimentos.

## 🏆 Prémios

### Classificação Geral Individual (Masculino e Feminino)

**1º Lugar:**
- Troféu
- 75,00€
- 1 Inscrição Prova Getrun (Pessoal e Intransmissível)

**2º Lugar:**
- Troféu
- 50,00€
- 1 Inscrição Prova Getrun (Pessoal e Intransmissível)

**3º Lugar:**
- Troféu
- 25,00€
- 1 Inscrição Prova Getrun (Pessoal e Intransmissível)

### Escalões Etários (Masculino e Feminino)

**1º, 2º e 3º de cada escalão:**
- Troféu
- 1 Inscrição Prova Getrun (Pessoal e Intransmissível)

**Escalões disponíveis:**
- Juvenil: 16-17 anos (apenas Trail Mini 12km)
- Júnior: 18-19 anos
- Sub23: 20-22 anos
- Seniores: 23-34 anos
- M35/F35: 35-39 anos
- M40/F40: 40-44 anos
- M45/F45: 45-49 anos
- M50/F50: 50-54 anos
- M55/F55: 55-59 anos
- M60/F60: 60-64 anos
- M65/F65: 65-69 anos
- M70/F70: +70 anos

### Classificação por Equipas

**1ª, 2ª e 3ª Equipa:**
- Troféu
- 3 Inscrições Prova Getrun (uso exclusivo atletas da equipa)

**Equipa Mais Numerosa:**
- Troféu
- Prémio
- 3 Inscrições Prova Getrun

💰 **Total Prémios Monetários:**
- Trail Sprint 22km: 300,00€
- Trail Mini 12km: 300,00€
- **Total: 600,00€**

## 📋 Programa

### Sexta-Feira, 16 de Janeiro
**Secretariado - Biblioteca Municipal de Gondomar**
- 09h00 - Abertura do Secretariado
- 18h00 - Encerramento

### Sábado, 17 de Janeiro
**Secretariado - Biblioteca Municipal de Gondomar**
- 09h30 - Abertura do Secretariado
- 13h00 - Encerramento

**Provas - Parque Urbano de Gondomar**
- 13h45 - Controlo zero Trail Sprint 22km
- 14h00 - **Partida Trail Sprint 22km**
- 14h15 - Controlo zero Trail Mini 12km
- 14h30 - **Partida Trail Mini 12km**
- 14h45 - **Partida Caminhada 10km**

**Chegadas Previstas**
- 15h30 - Primeiros atletas Trail Mini 12km
- 15h45 - Primeiros atletas Trail Sprint 22km
- 16h45 - Primeiros caminhantes
- 17h00 - **Cerimónia de Entrega de Prémios**
- 17h30 - Encerramento meta Trail Mini 12km
- 17h45 - Encerramento meta Caminhada 10km
- 18h00 - Encerramento meta Trail Sprint 22km

## 📦 Material e Serviços Incluídos

Todos os participantes recebem:

✅ Dorsal e Cronometragem eletrónica
✅ Seguro de acidentes pessoais
✅ T-shirt oficial do evento
✅ Abastecimentos sólidos e líquidos durante a prova
✅ Medalha de participação
✅ Prémio finisher
✅ Alimentação e hidratação no final da prova
✅ Troféus para vencedores
✅ Segurança e meios de socorro
✅ Transporte para a chegada (em caso de desistência ou barramento)
✅ Acesso a banhos (Pavilhão EB 2/3 Júlio Dinis de Gondomar)

## 🚗 Como Chegar

### Localizações

**Secretariado:**
📍 Biblioteca Municipal de Gondomar

**Partida e Chegada:**
📍 Parque Urbano de Gondomar

**Estacionamento:**
🅿️ Pavilhão da Ala Nun'Álvares de Gondomar
🅿️ Pavilhão Multiusos de Gondomar

**Banhos:**
🚿 Pavilhão da Escola EB 2/3 Júlio Dinis de Gondomar

Gondomar fica situada a apenas **5km da cidade do Porto**, com excelentes acessos rodoviários de todos os pontos do país.

## 🏛️ Locais a Visitar

- **Museu Municipal da Filigrana de Gondomar**
- **Rota da Filigrana**
- **Parque Urbano de Gondomar**
- **Monte Crasto**
- **Igreja Matriz de Gondomar**

## 🌍 Responsabilidade Ambiental

Os atletas são responsáveis pelo transporte de todos os resíduos (invólucros de géis, barras, etc.), devendo depositá-los nos abastecimentos ou transportá-los até à meta.

Respeite o meio ambiente e as propriedades privadas atravessadas pelo percurso.

## 📞 Contactos

**Informação:**
- Facebook: [fb.com/traildafiligrana](https://www.facebook.com/traildafiligrana)

**Email Organização:**
- geral@getrun.pt

**Cronometragem e Inscrições:**
- Website: [www.lap2go.com](https://www.lap2go.com)
- Email: suporte@lap2go.com
- Telefone: +351 308 801 674
- Horário: Segunda a Sexta, 10h-13h e 14h30-17h30

## 👥 Organização

**Organizadores:**
- Getrun – Organização de Eventos Desportivos, Lda.
- Câmara Municipal de Gondomar
- Centro Ciclista de Gondomar
- Gondomar Futsal Clube

**Apoio Institucional:**
- União de Freguesias de Gondomar (S. Cosme), Valbom e Jovim
- União de Freguesias de Foz do Sousa e Covelo
- União de Freguesias de Fânzeres e São Pedro da Cova

---

**Regulamento completo disponível em:** [www.lap2go.com](https://www.lap2go.com)

⚠️ **A inscrição implica total aceitação do regulamento da prova.**`,
      variants: {
        create: [
          // Trail Sprint 22km
          {
            name: "Trail Sprint 22km",
            distanceKm: 22,
            elevationGainM: 700,
            cutoffTimeHours: 4.0,
            atrpGrade: 2,
            startTime: "2026-01-17T14:00:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-11-03T00:00:00.000Z"),
                  endDate: new Date("2025-12-14T23:59:00.000Z"),
                  price: 17.5,
                  discountPercent: null,
                  note: "6 semanas - Early Bird",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2025-12-15T00:00:00.000Z"),
                  endDate: new Date("2026-01-04T23:59:00.000Z"),
                  price: 20.0,
                  discountPercent: 14,
                  note: "3 semanas",
                },
                {
                  name: "Última Hora",
                  startDate: new Date("2026-01-05T00:00:00.000Z"),
                  endDate: new Date("2026-01-11T23:59:00.000Z"),
                  price: 22.5,
                  discountPercent: 29,
                  note: "1 semana - Last Minute",
                },
              ],
            },
          },
          // Trail Mini 12km
          {
            name: "Trail Mini 12km",
            distanceKm: 12,
            elevationGainM: 400,
            cutoffTimeHours: 3.0,
            atrpGrade: 2,
            startTime: "2026-01-17T14:30:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-11-03T00:00:00.000Z"),
                  endDate: new Date("2025-12-14T23:59:00.000Z"),
                  price: 15.0,
                  discountPercent: null,
                  note: "6 semanas - Early Bird",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2025-12-15T00:00:00.000Z"),
                  endDate: new Date("2026-01-04T23:59:00.000Z"),
                  price: 17.5,
                  discountPercent: 17,
                  note: "3 semanas",
                },
                {
                  name: "Última Hora",
                  startDate: new Date("2026-01-05T00:00:00.000Z"),
                  endDate: new Date("2026-01-11T23:59:00.000Z"),
                  price: 20.0,
                  discountPercent: 33,
                  note: "1 semana - Last Minute",
                },
              ],
            },
          },
          // Caminhada 10km
          {
            name: "Caminhada 10km",
            distanceKm: 10,
            elevationGainM: null,
            cutoffTimeHours: 3.0,
            atrpGrade: null,
            startTime: "2026-01-17T14:45:00.000Z",
            maxParticipants: null,
            pricingPhases: {
              create: [
                {
                  name: "1ª Fase",
                  startDate: new Date("2025-11-03T00:00:00.000Z"),
                  endDate: new Date("2025-12-14T23:59:00.000Z"),
                  price: 12.5,
                  discountPercent: null,
                  note: "6 semanas - Early Bird",
                },
                {
                  name: "2ª Fase",
                  startDate: new Date("2025-12-15T00:00:00.000Z"),
                  endDate: new Date("2026-01-04T23:59:00.000Z"),
                  price: 15.0,
                  discountPercent: 20,
                  note: "3 semanas",
                },
                {
                  name: "Última Hora",
                  startDate: new Date("2026-01-05T00:00:00.000Z"),
                  endDate: new Date("2026-01-11T23:59:00.000Z"),
                  price: 17.5,
                  discountPercent: 40,
                  note: "1 semana - Last Minute",
                },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Created event: Trail da Filigrana");
  console.log(`   - ID: ${event.id}`);
  console.log(`   - Slug: ${event.slug}`);
  console.log(`   - Date: ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   - City: ${event.city}`);
  console.log(
    `   - Variants: 3 (Trail Sprint 22km, Trail Mini 12km, Caminhada 10km)`
  );
  console.log("");
  console.log("🏃 Trail da Filigrana seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
