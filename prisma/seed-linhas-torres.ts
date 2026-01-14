import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Linhas de Torres 100...");

  // Apagar evento existente se houver
  const existingEvent = await prisma.event.findUnique({
    where: { slug: "linhas-de-torres-100-2026" },
  });

  if (existingEvent) {
    await prisma.event.delete({
      where: { id: existingEvent.id },
    });
    console.log("🗑️  Evento anterior apagado");
  }

  // Criar o evento
  const event = await prisma.event.create({
    data: {
      title: "Linhas de Torres 100",
      slug: "linhas-de-torres-100-2026",
      description: `A Linhas de Torres 100 (LT100) é uma prova de trail running organizada pela Associação Desportiva Trilhos do Costume, que percorre as históricas Linhas de Torres Vedras.

O evento oferece várias distâncias para todos os níveis de atletas:
• K100 - Ultra trail de 100km (solo, dupla ou estafeta de 4)
• K50 - Trail de 50km
• K30 - Trail de 30km
• K20 - Trail de 20km
• K10 - Trail de 10km
• C20 e C10 - Caminhadas
• Trail Kids - Provas para crianças e jovens

As provas decorrem maioritariamente num percurso único que atravessa paisagens deslumbrantes e pontos históricos das Linhas de Torres, um sistema de fortificações construído durante as Invasões Francesas.

📍 Partida: Vila Franca de Xira (K100) / Sobral de Monte Agraço (K50, K30) / Torres Vedras (K20, K10)
🏁 Chegada: Expo Torres, Torres Vedras

📧 Contactos:
• trilhosdocostume@gmail.com (organização)
• infotrilhoperdido@gmail.com (inscrições)
• 934 568 787

⏰ Limite de tempo K100: 24 horas`,
      sportTypes: [SportType.TRAIL],
      startDate: new Date("2026-01-30T22:00:00"),
      endDate: new Date("2026-01-31T23:59:00"),
      city: "Torres Vedras",
      country: "Portugal",
      imageUrl:
        "https://f003.backblazeb2.com/file/athlifyr/events/linha_de_torres_100_2026_1_2500_2500.jpg",
      externalUrl: "https://trilhoperdido.com/evento/linhas-de-torres-100",
      isFeatured: true,
      variants: {
        create: [
          // K100 - Solo (dia 30, 22:00)
          {
            name: "K100 - Solo",
            distanceKm: 100,
            description:
              "Ultra trail de 100km realizado a solo. Partida em Vila Franca de Xira.",
            startDate: new Date("2026-01-30T22:00:00"),
            startTime: "22:00",
          },
          // K100 - Dupla (dia 30, 22:00)
          {
            name: "K100 - Dupla",
            distanceKm: 100,
            description:
              "Ultra trail de 100km em estafeta de 2 elementos. Partida em Vila Franca de Xira.",
            startDate: new Date("2026-01-30T22:00:00"),
            startTime: "22:00",
          },
          // K100 - Estafeta 4 (dia 30, 22:00)
          {
            name: "K100 - Estafeta (4 atletas)",
            distanceKm: 100,
            description:
              "Ultra trail de 100km em estafeta de até 4 elementos. Partida em Vila Franca de Xira.",
            startDate: new Date("2026-01-30T22:00:00"),
            startTime: "22:00",
          },
          // K50 (dia 31, 08:15)
          {
            name: "K50",
            distanceKm: 50,
            description:
              "Trail de 50km a solo. Partida em Sobral de Monte Agraço - Núcleo de Apoio ao Forte do Alqueidão.",
            startDate: new Date("2026-01-31T08:15:00"),
            startTime: "08:15",
          },
          // K30 (dia 31, 09:30)
          {
            name: "K30",
            distanceKm: 30,
            description:
              "Trail de 30km a solo. Partida em Sobral de Monte Agraço - Clube Desportivo e Recreativo de Pêro Negro.",
            startDate: new Date("2026-01-31T09:30:00"),
            startTime: "09:30",
          },
          // K20 (dia 31, 10:30)
          {
            name: "K20",
            distanceKm: 20,
            description:
              "Trail de 20km a solo. Partida em Torres Vedras - Serra do Socorro.",
            startDate: new Date("2026-01-31T10:30:00"),
            startTime: "10:30",
          },
          // C20 - Caminhada (dia 31, 10:30)
          {
            name: "C20 - Caminhada",
            distanceKm: 20,
            description:
              "Caminhada de 20km no percurso do K20. Partida em Torres Vedras - Serra do Socorro.",
            startDate: new Date("2026-01-31T10:30:00"),
            startTime: "10:30",
          },
          // K10 (dia 31, 10:30)
          {
            name: "K10",
            distanceKm: 10,
            description:
              "Trail de 10km a solo. Partida em Torres Vedras - Expo Torres.",
            startDate: new Date("2026-01-31T10:30:00"),
            startTime: "10:30",
          },
          // C10 - Passeio Pedestre (dia 31, 11:10)
          {
            name: "C10 - Passeio Pedestre",
            distanceKm: 10,
            description:
              "Passeio pedestre / caminhada ecológica de 10km. Partida em Torres Vedras - Expo Torres.",
            startDate: new Date("2026-01-31T11:10:00"),
            startTime: "11:10",
          },
          // Trail Kids (dia 31)
          {
            name: "Trail Kids",
            distanceKm: null,
            description:
              "Conjunto de 4 provas gratuitas para crianças e jovens: Benjamins A (7-9 anos), Benjamins B (10-11 anos), Infantis (12-13 anos) e Iniciados (14-15 anos).",
            startDate: new Date("2026-01-31T10:00:00"),
            startTime: "10:00",
          },
        ],
      },
    },
    include: {
      variants: true,
    },
  });

  console.log(`✅ Evento criado: ${event.title}`);
  console.log(`   📍 ${event.city}, ${event.country}`);
  console.log(`   📅 ${event.startDate.toLocaleDateString("pt-PT")}`);
  console.log(`   🏃 ${event.variants.length} variantes criadas:`);

  event.variants.forEach((v) => {
    console.log(
      `      - ${v.name}${v.distanceKm ? ` (${v.distanceKm}km)` : ""} - ${v.startTime || "N/A"}`
    );
  });

  console.log(`\n🔗 URL: /events/${event.slug}`);
}

main()
  .catch((e) => {
    console.error("❌ Erro ao fazer seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
