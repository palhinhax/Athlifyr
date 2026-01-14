import { PrismaClient, SportType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding HYROX events database...");

  // Clear existing HYROX events
  const existingHyroxEvents = await prisma.event.findMany({
    where: { sportTypes: { has: SportType.HYROX } },
  });

  for (const event of existingHyroxEvents) {
    await prisma.eventVariant.deleteMany({ where: { eventId: event.id } });
  }

  await prisma.event.deleteMany({
    where: { sportTypes: { has: SportType.HYROX } },
  });

  const hyroxEvents = [
    // Janeiro 2026
    {
      event: {
        title: "well come FIT HYROX ST. GALLEN",
        slug: "hyrox-st-gallen-2026",
        description:
          "HYROX competition in St. Gallen, Switzerland. An intense fitness race combining running and functional workout stations.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-01-16"),
        endDate: new Date("2026-01-18"),
        city: "St. Gallen",
        country: "Switzerland",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "Myprotein HYROX Manchester",
        slug: "hyrox-manchester-2026",
        description:
          "HYROX Manchester sponsored by Myprotein. Premier fitness racing event in the UK.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-01-21"),
        endDate: new Date("2026-01-25"),
        city: "Manchester",
        country: "United Kingdom",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
        { name: "Relay", description: "Team of 4" },
      ],
    },
    {
      event: {
        title: "HYROX Amsterdam",
        slug: "hyrox-amsterdam-2026",
        description:
          "HYROX Amsterdam - one of the most popular fitness racing events in Europe.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-01-21"),
        endDate: new Date("2026-01-25"),
        city: "Amsterdam",
        country: "Netherlands",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "bunq HYROX Youngstars Amsterdam",
        slug: "hyrox-youngstars-amsterdam-2026",
        description:
          "HYROX Youngstars Amsterdam - youth competition for aspiring athletes.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-01-24"),
        endDate: new Date("2026-01-25"),
        city: "Amsterdam",
        country: "Netherlands",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Youth Individual", description: "Solo youth category" },
        { name: "Youth Doubles", description: "Youth team of 2" },
      ],
    },
    {
      event: {
        title: "BYD HYROX Auckland",
        slug: "hyrox-auckland-2026",
        description:
          "BYD HYROX Auckland - bringing premier fitness racing to New Zealand.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-01-29"),
        endDate: new Date("2026-02-01"),
        city: "Auckland",
        country: "New Zealand",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "CENTR HYROX Phoenix",
        slug: "hyrox-phoenix-2026",
        description:
          "CENTR HYROX Phoenix - premiere fitness racing event in Arizona.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-01-29"),
        endDate: new Date("2026-02-01"),
        city: "Phoenix",
        country: "United States",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "AirAsia HYROX Osaka",
        slug: "hyrox-osaka-2026",
        description:
          "AirAsia HYROX Osaka - bringing the fitness racing phenomenon to Japan.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-01-30"),
        endDate: new Date("2026-02-01"),
        city: "Osaka",
        country: "Japan",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Turin",
        slug: "hyrox-turin-2026",
        description: "HYROX Turin - elite fitness racing in Northern Italy.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-01-30"),
        endDate: new Date("2026-02-01"),
        city: "Turin",
        country: "Italy",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },

    // Fevereiro 2026
    {
      event: {
        title: "Creapure® HYROX Vienna",
        slug: "hyrox-vienna-2026",
        description:
          "Creapure® HYROX Vienna - premier fitness racing in the heart of Austria.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-02-06"),
        endDate: new Date("2026-02-08"),
        city: "Vienna",
        country: "Austria",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "Smart Fit HYROX Guadalajara",
        slug: "hyrox-guadalajara-2026",
        description:
          "Smart Fit HYROX Guadalajara - bringing fitness racing to Mexico.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-02-07"),
        endDate: new Date("2026-02-08"),
        city: "Guadalajara",
        country: "Mexico",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Bilbao",
        slug: "hyrox-bilbao-2026",
        description:
          "HYROX Bilbao - elite fitness racing in the Basque Country.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-02-07"),
        endDate: new Date("2026-02-08"),
        city: "Bilbao",
        country: "Spain",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX NICE",
        slug: "hyrox-nice-2026",
        description:
          "HYROX Nice - fitness racing on the French Riviera with stunning Mediterranean views.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-02-12"),
        endDate: new Date("2026-02-15"),
        city: "Nice",
        country: "France",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Istanbul",
        slug: "hyrox-istanbul-2026",
        description:
          "HYROX Istanbul - where East meets West in elite fitness racing.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-02-13"),
        endDate: new Date("2026-02-14"),
        city: "Istanbul",
        country: "Turkey",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "The Feed HYROX Las Vegas",
        slug: "hyrox-las-vegas-2026",
        description:
          "The Feed HYROX Las Vegas - experience fitness racing in the Entertainment Capital of the World.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-02-20"),
        endDate: new Date("2026-02-22"),
        city: "Las Vegas",
        country: "United States",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
        { name: "Relay", description: "Team of 4" },
      ],
    },
    {
      event: {
        title: "MARTES SPORT HYROX KATOWICE",
        slug: "hyrox-katowice-2026",
        description:
          "MARTES SPORT HYROX Katowice - premier fitness racing in Poland.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-02-21"),
        endDate: new Date("2026-02-22"),
        city: "Katowice",
        country: "Poland",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Taipei",
        slug: "hyrox-taipei-2026",
        description: "HYROX Taipei - bringing elite fitness racing to Taiwan.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-02-28"),
        endDate: new Date("2026-03-01"),
        city: "Taipei",
        country: "Taiwan",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Fortaleza",
        slug: "hyrox-fortaleza-2026",
        description: "HYROX Fortaleza - fitness racing on the Brazilian coast.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-02-28"),
        endDate: new Date("2026-02-28"),
        city: "Fortaleza",
        country: "Brazil",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },

    // Março 2026
    {
      event: {
        title: "HYROX Americas Championships – Washington D.C.",
        slug: "hyrox-americas-championships-washington-2026",
        description:
          "HYROX Americas Championships in Washington D.C. - the ultimate test for the best athletes in the Americas.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-07"),
        endDate: new Date("2026-03-08"),
        city: "Washington D.C.",
        country: "United States",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Championship Individual", description: "Elite solo category" },
        { name: "Championship Doubles", description: "Elite doubles category" },
      ],
    },
    {
      event: {
        title: "HYROX Glasgow",
        slug: "hyrox-glasgow-2026",
        description: "HYROX Glasgow - premier fitness racing in Scotland.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-11"),
        endDate: new Date("2026-03-15"),
        city: "Glasgow",
        country: "United Kingdom",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Copenhagen",
        slug: "hyrox-copenhagen-2026",
        description:
          "HYROX Copenhagen - Scandinavian fitness racing at its finest.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-13"),
        endDate: new Date("2026-03-15"),
        city: "Copenhagen",
        country: "Denmark",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "Smart Fit HYROX Cancun",
        slug: "hyrox-cancun-2026",
        description:
          "Smart Fit HYROX Cancun - fitness racing in paradise on Mexico's Caribbean coast.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-14"),
        endDate: new Date("2026-03-15"),
        city: "Cancun",
        country: "Mexico",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX TOULOUSE",
        slug: "hyrox-toulouse-2026",
        description:
          "HYROX Toulouse - elite fitness racing in the heart of Southern France.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-19"),
        endDate: new Date("2026-03-22"),
        city: "Toulouse",
        country: "France",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Bangkok",
        slug: "hyrox-bangkok-2026",
        description:
          "HYROX Bangkok - bringing elite fitness racing to Southeast Asia.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-20"),
        endDate: new Date("2026-03-22"),
        city: "Bangkok",
        country: "Thailand",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Beijing",
        slug: "hyrox-beijing-2026",
        description:
          "HYROX Beijing - premier fitness racing in China's capital.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-21"),
        endDate: new Date("2026-03-22"),
        city: "Beijing",
        country: "China",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX EMEA Regional Championships – London",
        slug: "hyrox-emea-championships-london-2026",
        description:
          "HYROX EMEA Regional Championships in London - the ultimate test for Europe, Middle East, and Africa's best athletes.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-21"),
        endDate: new Date("2026-03-22"),
        city: "London",
        country: "United Kingdom",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Championship Individual", description: "Elite solo category" },
        { name: "Championship Doubles", description: "Elite doubles category" },
      ],
    },
    {
      event: {
        title: "HYROX London",
        slug: "hyrox-london-2026",
        description:
          "HYROX London - one of the biggest fitness racing events in the world at the iconic venue.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-24"),
        endDate: new Date("2026-03-29"),
        city: "London",
        country: "United Kingdom",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
        { name: "Relay", description: "Team of 4" },
      ],
    },
    {
      event: {
        title: "HYROX Mechelen",
        slug: "hyrox-mechelen-2026",
        description: "HYROX Mechelen - elite fitness racing in Belgium.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-26"),
        endDate: new Date("2026-03-29"),
        city: "Mechelen",
        country: "Belgium",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "Creapure® HYROX Houston",
        slug: "hyrox-houston-2026",
        description: "Creapure® HYROX Houston - Texas-sized fitness racing.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-27"),
        endDate: new Date("2026-03-29"),
        city: "Houston",
        country: "United States",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX YOUNGSTARS London",
        slug: "hyrox-youngstars-london-2026",
        description:
          "HYROX Youngstars London - youth fitness racing championship.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-03-28"),
        endDate: new Date("2026-03-29"),
        city: "London",
        country: "United Kingdom",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Youth Individual", description: "Solo youth category" },
        { name: "Youth Doubles", description: "Youth team of 2" },
      ],
    },

    // Abril 2026
    {
      event: {
        title: "AIA HYROX Singapore",
        slug: "hyrox-singapore-2026",
        description:
          "AIA HYROX Singapore - premier fitness racing in Southeast Asia's hub.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-03"),
        endDate: new Date("2026-04-05"),
        city: "Singapore",
        country: "Singapore",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "Legendz HYROX Miami Beach",
        slug: "hyrox-miami-beach-2026",
        description:
          "Legendz HYROX Miami Beach - fitness racing with sun, sand, and elite competition.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-03"),
        endDate: new Date("2026-04-05"),
        city: "Miami Beach",
        country: "United States",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Bologna",
        slug: "hyrox-bologna-2026",
        description:
          "HYROX Bologna - elite fitness racing in one of Italy's most historic cities.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-04"),
        endDate: new Date("2026-04-06"),
        city: "Bologna",
        country: "Italy",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "BYD HYROX Brisbane",
        slug: "hyrox-brisbane-2026",
        description:
          "BYD HYROX Brisbane - premier fitness racing in Queensland, Australia.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-09"),
        endDate: new Date("2026-04-12"),
        city: "Brisbane",
        country: "Australia",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Bengaluru",
        slug: "hyrox-bengaluru-2026",
        description:
          "HYROX Bengaluru - bringing elite fitness racing to India's tech capital.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-11"),
        endDate: new Date("2026-04-12"),
        city: "Bengaluru",
        country: "India",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "BYD HYROX APAC Championships – Brisbane",
        slug: "hyrox-apac-championships-brisbane-2026",
        description:
          "BYD HYROX APAC Championships in Brisbane - the ultimate test for Asia-Pacific's best athletes.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-11"),
        endDate: new Date("2026-04-12"),
        city: "Brisbane",
        country: "Australia",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Championship Individual", description: "Elite solo category" },
        { name: "Championship Doubles", description: "Elite doubles category" },
      ],
    },
    {
      event: {
        title: "HYROX Rotterdam",
        slug: "hyrox-rotterdam-2026",
        description:
          "HYROX Rotterdam - elite fitness racing in the Netherlands' second-largest city.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-15"),
        endDate: new Date("2026-04-19"),
        city: "Rotterdam",
        country: "Netherlands",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX WARSAW",
        slug: "hyrox-warsaw-2026",
        description:
          "HYROX Warsaw at PGE Narodowy - Poland's largest fitness racing event.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-16"),
        endDate: new Date("2026-04-19"),
        city: "Warsaw",
        country: "Poland",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
        { name: "Relay", description: "Team of 4" },
      ],
    },
    {
      event: {
        title: "All Inclusive Fitness HYROX Cologne",
        slug: "hyrox-cologne-2026",
        description:
          "All Inclusive Fitness HYROX Cologne - elite fitness racing in Germany's cultural hub.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-16"),
        endDate: new Date("2026-04-19"),
        city: "Cologne",
        country: "Germany",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Málaga",
        slug: "hyrox-malaga-2026",
        description:
          "HYROX Málaga - fitness racing on Spain's beautiful Costa del Sol.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-16"),
        endDate: new Date("2026-04-19"),
        city: "Málaga",
        country: "Spain",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "Smart Fit HYROX Monterrey",
        slug: "hyrox-monterrey-2026",
        description:
          "Smart Fit HYROX Monterrey - elite fitness racing in Northern Mexico.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-18"),
        endDate: new Date("2026-04-19"),
        city: "Monterrey",
        country: "Mexico",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "MAYBELLINE HYROX PARIS GRAND PALAIS 25/26",
        slug: "hyrox-paris-2026",
        description:
          "MAYBELLINE HYROX Paris at the Grand Palais - iconic fitness racing in the heart of Paris.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-23"),
        endDate: new Date("2026-04-26"),
        city: "Paris",
        country: "France",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
        { name: "Relay", description: "Team of 4" },
      ],
    },
    {
      event: {
        title: "HYROX São Paulo",
        slug: "hyrox-sao-paulo-2026",
        description:
          "HYROX São Paulo - bringing elite fitness racing to Brazil's largest city.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-25"),
        endDate: new Date("2026-04-25"),
        city: "São Paulo",
        country: "Brazil",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Cardiff",
        slug: "hyrox-cardiff-2026",
        description: "HYROX Cardiff - elite fitness racing in Wales.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-04-29"),
        endDate: new Date("2026-05-04"),
        city: "Cardiff",
        country: "United Kingdom",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },

    // Maio 2026
    {
      event: {
        title: "HYROX Lisboa",
        slug: "hyrox-lisboa-2026",
        description:
          "HYROX Lisboa - premier fitness racing in Portugal's beautiful capital city.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-05-01"),
        endDate: new Date("2026-05-03"),
        city: "Lisboa",
        country: "Portugal",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "Cigna Healthcare HYROX Hong Kong",
        slug: "hyrox-hong-kong-2026",
        description:
          "Cigna Healthcare HYROX Hong Kong - elite fitness racing in Asia's world city.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-05-08"),
        endDate: new Date("2026-05-10"),
        city: "Hong Kong",
        country: "Hong Kong",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX HELSINKI",
        slug: "hyrox-helsinki-2026",
        description:
          "HYROX Helsinki - bringing elite fitness racing to Finland's capital.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-05-09"),
        endDate: new Date("2026-05-10"),
        city: "Helsinki",
        country: "Finland",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Barcelona",
        slug: "hyrox-barcelona-2026",
        description:
          "HYROX Barcelona - one of Europe's most popular fitness racing events in Catalonia.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-05-14"),
        endDate: new Date("2026-05-17"),
        city: "Barcelona",
        country: "Spain",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
        { name: "Relay", description: "Team of 4" },
      ],
    },
    {
      event: {
        title: "HYROX Heerenveen",
        slug: "hyrox-heerenveen-2026",
        description:
          "HYROX Heerenveen at Thialf - elite fitness racing in the Netherlands.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-05-14"),
        endDate: new Date("2026-05-17"),
        city: "Heerenveen",
        country: "Netherlands",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "AirAsia HYROX Incheon",
        slug: "hyrox-incheon-2026",
        description:
          "AirAsia HYROX Incheon - premier fitness racing in South Korea.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-05-15"),
        endDate: new Date("2026-05-17"),
        city: "Incheon",
        country: "South Korea",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "GoodLife HYROX Ottawa",
        slug: "hyrox-ottawa-2026",
        description:
          "GoodLife HYROX Ottawa - premier fitness racing in Canada's capital.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-05-16"),
        endDate: new Date("2026-05-17"),
        city: "Ottawa",
        country: "Canada",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "Creapure® HYROX Lyon",
        slug: "hyrox-lyon-2026",
        description:
          "Creapure® HYROX Lyon - elite fitness racing in France's gastronomic capital.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-05-20"),
        endDate: new Date("2026-05-24"),
        city: "Lyon",
        country: "France",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Rimini",
        slug: "hyrox-rimini-2026",
        description: "HYROX Rimini - fitness racing on Italy's Adriatic coast.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-05-29"),
        endDate: new Date("2026-05-31"),
        city: "Rimini",
        country: "Italy",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX RIGA",
        slug: "hyrox-riga-2026",
        description: "HYROX Riga - bringing elite fitness racing to Latvia.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-05-30"),
        endDate: new Date("2026-05-31"),
        city: "Riga",
        country: "Latvia",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },

    // Junho 2026
    {
      event: {
        title: "PUMA HYROX World Championships Stockholm",
        slug: "hyrox-world-championships-stockholm-2026",
        description:
          "PUMA HYROX World Championships Stockholm - the ultimate global showdown for the world's best fitness racers.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-06-18"),
        endDate: new Date("2026-06-21"),
        city: "Stockholm",
        country: "Sweden",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        {
          name: "World Championship Individual",
          description: "Elite world championship category",
        },
        {
          name: "World Championship Doubles",
          description: "Elite doubles world championship",
        },
      ],
    },

    // Eventos sem data definida
    {
      event: {
        title: "HYROX New York",
        slug: "hyrox-new-york-2026",
        description:
          "HYROX New York - elite fitness racing in the city that never sleeps.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-09-01"),
        city: "New York",
        country: "United States",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "Smart Fit HYROX Puebla",
        slug: "hyrox-puebla-2026",
        description: "Smart Fit HYROX Puebla - fitness racing in Mexico.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-10-01"),
        city: "Puebla",
        country: "Mexico",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: false,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
      ],
    },
    {
      event: {
        title: "HYROX Berlin",
        slug: "hyrox-berlin-2026",
        description:
          "HYROX Berlin - one of the largest fitness racing events in Germany.",
        sportTypes: [SportType.HYROX],
        startDate: new Date("2026-11-01"),
        city: "Berlin",
        country: "Germany",
        imageUrl:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800",

        isFeatured: true,
      },
      variants: [
        { name: "Individual", description: "Solo HYROX race" },
        { name: "Doubles", description: "Team of 2" },
        { name: "Relay", description: "Team of 4" },
      ],
    },
  ];

  console.log(`Creating ${hyroxEvents.length} HYROX events...`);

  for (const { event, variants } of hyroxEvents) {
    const createdEvent = await prisma.event.create({
      data: event,
    });

    console.log(`✅ Created: ${event.title}`);

    if (variants && variants.length > 0) {
      for (const variant of variants) {
        await prisma.eventVariant.create({
          data: {
            ...variant,
            eventId: createdEvent.id,
          },
        });
      }
      console.log(`   📋 Added ${variants.length} variant(s)`);
    }
  }

  console.log("\n🎉 HYROX seed completed successfully!");
  console.log(`📊 Total events created: ${hyroxEvents.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
