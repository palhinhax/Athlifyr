import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🦓 Seeding ZUT - Zebra Ultra Trail...");

  // Create the event
  const event = await prisma.event.upsert({
    where: { slug: "zut-zebra-ultra-trail-2026" },
    update: {},
    create: {
      title: "ZUT - Zebra Ultra Trail",
      slug: "zut-zebra-ultra-trail-2026",
      description: `ZUT – Zebra Ultra Trail - 15 de fevereiro de 2026

Evento organizado pela Secção de Atletismo do C. F. "Os Marialvas" em Cordinhã, Cantanhede.

🏃 PROVAS DISPONÍVEIS:
• Ultra Trail ZUT (45 km) - Dificuldade Alta - Competitiva
• Trail Longo ZUT (25 km) - Dificuldade Média - Competitiva  
• Mini Trail ZUT (15 km) - Dificuldade Baixa/Média - Competitiva (pontuável CDTRC)
• Caminhada ZUT (10 km) - Lúdica - Não competitiva

📋 IDADE MÍNIMA DE PARTICIPAÇÃO:
• Mini Trail: ≥ 16 anos
• Trail Longo e Ultra Trail: ≥ 18 anos
• Caminhada: aberta a todas as idades (menores de 16 anos acompanhados por adulto)

📅 PROGRAMA:

Sábado, 14/02/2026:
• 14:00 – Abertura do Secretariado (campo do Botafogo em Cordinhã)
• 21:00 – Encerramento

Domingo, 15/02/2026:
• 07:00 – Reabertura do Secretariado
• 08:00 – Briefing e partida Ultra Trail (45 km)
• 08:30 – Controlo Zero Trail Longo (25 km)
• 09:00 – Partida Trail Longo
• 09:15 – Controlo Zero Mini Trail (15 km)
• 09:30 – Partida Mini Trail
• 09:45 – Partida Caminhada (10 km)
• 13:00 – Entrega de prémios
• 17:00 – Encerramento do Secretariado

🏆 PRÉMIOS:
• Ultra Trail 45k: troféus aos 5 primeiros (Geral M/F)
• Trail Longo 25k: troféus aos 5 primeiros (Geral M/F)
• Mini Trail 15k: troféus aos 3 primeiros (Geral M/F), 3 primeiros de cada escalão e 3 primeiras equipas

⏱️ CRONOMETRAGEM:
Chip eletrónico nas provas competitivas.

📞 CONTACTOS:
Organização: Secção de Atletismo do C. F. "Os Marialvas"
Tel.: 916 518 956 (Bruno Pereira)
E-mail: clubeatletismomarialvas@gmail.com

Direção de Prova:
• Bruno Pereira – 916 518 956
• Daniela Guerra – 910 871 196
• Helena Sarges – 916 828 012`,
      startDate: new Date("2026-02-15"),
      city: "Cordinhã, Cantanhede",
      country: "Portugal",
      sportTypes: ["TRAIL"],
      externalUrl: "https://bttmanager.com/evento/zut-zebra-ultra-trail",
      imageUrl: null,
      variants: {
        create: [
          {
            name: "Ultra Trail ZUT",
            distanceKm: 45,
            startDate: new Date("2026-02-15"),
            startTime: "08:00",
            price: 25.0,
            description: `Ultra Trail ZUT - 45 km

⏱️ Tempo limite: 8 horas
📈 Dificuldade: Alta
🏁 Natureza: Competitiva
📍 Cronometragem: Chip eletrónico

💰 PREÇOS:
• Até 31/12/2025: €25,00
• De 1 a 12/02/2026: €28,00

👥 Idade mínima: 18 anos

🏆 Prémios: Troféus aos 5 primeiros classificados (Geral Masculino e Feminino)`,
          },
          {
            name: "Trail Longo ZUT",
            distanceKm: 25,
            startDate: new Date("2026-02-15"),
            startTime: "09:00",
            price: 16.5,
            description: `Trail Longo ZUT - 25 km

⏱️ Tempo limite: 6 horas
📈 Dificuldade: Média
🏁 Natureza: Competitiva
📍 Cronometragem: Chip eletrónico

💰 PREÇOS:
• Até 31/12/2025: €16,50
• De 1 a 12/02/2026: €18,50

👥 Idade mínima: 18 anos

🏆 Prémios: Troféus aos 5 primeiros classificados (Geral Masculino e Feminino)

📋 Controlo Zero: 08:30`,
          },
          {
            name: "Mini Trail ZUT",
            distanceKm: 15,
            startDate: new Date("2026-02-15"),
            startTime: "09:30",
            price: 15.0,
            description: `Mini Trail ZUT - 15 km (pontuável CDTRC)

⏱️ Tempo limite: 3 horas
📈 Dificuldade: Baixa/Média
🏁 Natureza: Competitiva
📍 Cronometragem: Chip eletrónico

💰 PREÇOS:
• Até 31/12/2025: €15,00
• De 1 a 12/02/2026: €17,00

💡 Atletas inscritos na ADAC têm desconto de €1,50 (CDTRC)

👥 Idade mínima: 16 anos

🏆 Prémios: 
• Troféus aos 3 primeiros classificados (Geral Masculino e Feminino)
• 3 primeiros de cada escalão
• 3 primeiras equipas

📋 Controlo Zero: 09:15`,
          },
          {
            name: "Caminhada ZUT",
            distanceKm: 10,
            startDate: new Date("2026-02-15"),
            startTime: "09:45",
            price: 10.0,
            description: `Caminhada ZUT - 10 km

⏱️ Tempo limite: 4 horas
📈 Dificuldade: Lúdica
🏁 Natureza: Não competitiva
📍 Cronometragem: Sem chip

💰 PREÇOS:
• Até 31/12/2025: €10,00
• De 1 a 12/02/2026: €12,00

👥 Idade: Aberta a todas as idades
⚠️ Menores de 16 anos devem ser acompanhados por adulto`,
          },
        ],
      },
    },
  });

  console.log(`✅ Created event: ${event.title}`);
  console.log(`   Slug: ${event.slug}`);
  console.log(`   Date: ${event.startDate?.toLocaleDateString("pt-PT")}`);
  console.log(`   City: ${event.city}`);

  // Fetch variants to display
  const variants = await prisma.eventVariant.findMany({
    where: { eventId: event.id },
    orderBy: { distanceKm: "desc" },
  });

  console.log(`   Variants: ${variants.length}`);
  variants.forEach((v) => {
    console.log(`     - ${v.name}: ${v.distanceKm}km @ ${v.startTime}`);
  });

  console.log("\n🦓 ZUT - Zebra Ultra Trail seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
