import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏋️ Seeding Matosinhos Throwdown...");

  // Delete existing event if it exists
  const existingEvent = await prisma.event.findFirst({
    where: { slug: "matosinhos-throwdown-2026" },
  });

  if (existingEvent) {
    console.log("   Deleting existing event...");
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
  }

  const event = await prisma.event.create({
    data: {
      title: "Matosinhos Throwdown",
      slug: "matosinhos-throwdown-2026",
      sportTypes: [SportType.CROSSFIT],
      startDate: new Date("2026-03-28T08:00:00.000Z"),
      registrationDeadline: new Date("2026-02-06T23:59:59.000Z"),
      city: "Matosinhos",
      country: "Portugal",
      latitude: 41.18433,
      longitude: -8.68649,
      googleMapsUrl: "https://maps.google.com/?q=41.18433,-8.68649",
      externalUrl: "https://www.instagram.com/matosinhos_throwdown_/",
      isFeatured: true,
      description: `# Matosinhos Throwdown

**Competição de Cross Training by Valverde Crossfit**

O **Matosinhos Throwdown** é uma competição emocionante de cross training que reúne atletas de toda a região do Porto. Realizado no Pavilhão Desportivo da Escola Garcia de Orta, este evento é perfeito para equipas de trios mistos que procuram desafios intensos e uma experiência épica!

## 🏋️ Sobre a Competição

**Data:** 28 de março de 2026
**Horário:** 08:00 - 12:00
**Formato:** Trios HHM (Homem-Homem-Mulher)
**Local:** Pavilhão Desportivo Escola Garcia de Orta, Matosinhos

## 🎯 Categorias

A competição oferece três níveis de dificuldade para equipas de trios:

### 💪 RX (Avançado)
Para atletas experientes com domínio completo dos movimentos e capacidade para cargas elevadas.

### 🔥 Intermédio
Para atletas com boa base técnica e condição física, mas que ainda não dominam todos os movimentos avançados.

### 🌟 Scaled (Iniciados)
Para equipas iniciantes ou que preferem movimentos adaptados e cargas mais acessíveis.

## 📋 Informações Importantes

### Inscrições

**Fase 2:** Até 06 de fevereiro de 2026

⚠️ **Importante:** 
- Validem as vossas inscrições para garantir o preço e não ficar de fora!
- Existem atletas em lista de espera
- O valor aumenta após o fim da Fase 2

### Formato da Competição

**Trios HHM (Homem-Homem-Mulher)**
- Equipas compostas por 2 homens e 1 mulher
- Trabalho em equipa sincronizado
- Provas variadas testando força, resistência e técnica

## 🏢 Organização

**By:** Valverde Crossfit

**Patrocínios:**
- Rocha Automóveis (@rochaautomoveis.pt)
- Patinter Group (@patinter_group)
- B.Lluz Studio (@b.lluzstudio)

**Parceiros:**
- Use Amrap (@use.amrap)
- Mad Wod Sports (@madwodsports)

**Equipamento:**
- IronAge Equipment (@ironage_equipment)

## 📍 Local

**Pavilhão Desportivo Escola Garcia de Orta**
Matosinhos

Instalações modernas e espaçosas, ideais para competições de cross training, com excelente apoio logístico e fácil acesso.

## 👥 Público-Alvo

Esta competição é perfeita para:
- Equipas de trios que treinam juntos
- Atletas que procuram experiência competitiva
- Boxes de cross training que querem representar o seu ginásio
- Quem quer viver uma experiência épica e competitiva

## 💪 O Que Esperar

- **Ambiente competitivo mas amigável**
- **Provas desafiantes** adaptadas a cada categoria
- **Organização profissional** pela equipa do Valverde Crossfit
- **Equipamento de qualidade** fornecido pela IronAge
- **Networking** com outros atletas e boxes da região
- **Espetáculo garantido** com atletas de alto nível

## 📱 Redes Sociais

**Instagram:** @matosinhos_throwdown_

Siga para:
- Atualizações sobre WODs e regulamento
- Informações sobre inscrições
- Perfil dos atletas participantes
- Cobertura do evento em tempo real

## 🎉 Experiência Épica

A organização está a trabalhar arduamente para garantir que o **Matosinhos Throwdown** seja um evento memorável:

✅ Ambiente profissional e energético
✅ Juízes experientes
✅ Cronometragem precisa
✅ Equipamento de qualidade
✅ Apoio logístico completo
✅ Ambiente de fair play e camaradagem

## 📞 Contactos

Para mais informações, acompanhe o Instagram oficial:
**@matosinhos_throwdown_**

**Organização:** Valverde Crossfit

---

Venham preparados para dar o vosso melhor! 💪
Nos vemos no Pavilhão! 👋

#competicaocrossfit #matosinhoseporto #crossfitportugal #triosmistos`,
      variants: {
        create: [
          {
            name: "RX (Avançado)",
            distanceKm: 0,
            startDate: new Date("2026-03-28T08:00:00.000Z"),
            startTime: "08:00",
            description:
              "Categoria RX para atletas avançados com domínio completo dos movimentos de cross training. Equipas de trios HHM (Homem-Homem-Mulher) enfrentam WODs desafiantes com movimentos complexos e cargas elevadas. Requer excelente condição física, técnica apurada e trabalho de equipa sincronizado.",
            pricingPhases: {
              create: [
                {
                  name: "Fase 2 (até 06/02)",
                  price: 0, // Preço não divulgado
                  startDate: new Date("2026-01-15T00:00:00.000Z"),
                  endDate: new Date("2026-02-06T23:59:59.000Z"),
                  note: "Validar inscrição até 06/02 para garantir o preço. Valor aumenta após esta fase.",
                },
              ],
            },
          },
          {
            name: "Intermédio",
            distanceKm: 0,
            startDate: new Date("2026-03-28T08:00:00.000Z"),
            startTime: "08:00",
            description:
              "Categoria Intermédio para atletas com boa base técnica e condição física. Equipas de trios HHM enfrentam WODs desafiantes mas com movimentos e cargas acessíveis. Ideal para quem tem experiência em cross training mas ainda não domina todos os movimentos avançados.",
            pricingPhases: {
              create: [
                {
                  name: "Fase 2 (até 06/02)",
                  price: 0, // Preço não divulgado
                  startDate: new Date("2026-01-15T00:00:00.000Z"),
                  endDate: new Date("2026-02-06T23:59:59.000Z"),
                  note: "Validar inscrição até 06/02 para garantir o preço. Valor aumenta após esta fase.",
                },
              ],
            },
          },
          {
            name: "Scaled (Iniciados)",
            distanceKm: 0,
            startDate: new Date("2026-03-28T08:00:00.000Z"),
            startTime: "08:00",
            description:
              "Categoria Scaled para equipas iniciantes ou que preferem movimentos adaptados. Equipas de trios HHM com WODs desenhados para atletas que estão a começar no cross training ou preferem cargas e movimentos mais acessíveis. Foco na técnica, diversão e experiência competitiva.",
            pricingPhases: {
              create: [
                {
                  name: "Fase 2 (até 06/02)",
                  price: 0, // Preço não divulgado
                  startDate: new Date("2026-01-15T00:00:00.000Z"),
                  endDate: new Date("2026-02-06T23:59:59.000Z"),
                  note: "Validar inscrição até 06/02 para garantir o preço. Valor aumenta após esta fase.",
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
  console.log(`   Sport: Cross Training (CROSSFIT)`);
  console.log(`   Instagram: ${event.externalUrl}`);
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
