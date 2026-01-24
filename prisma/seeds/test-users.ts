import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding test users...");

  // Password hash para Test123!
  const passwordHash = await bcrypt.hash("Test123!", 10);

  // 1. Admin da Aplicação
  console.log("Creating app admin...");
  const appAdmin = await prisma.user.upsert({
    where: { email: "admin@athlifyr.com" },
    update: {},
    create: {
      email: "admin@athlifyr.com",
      name: "App Admin",
      password: passwordHash,
      role: "ADMIN",
      locale: "pt",
      image: null,
    },
  });
  console.log("✅ App Admin created:", appAdmin.email);

  // Criar venue de teste
  console.log("\n🏢 Creating test venue...");
  const venue = await prisma.venue.upsert({
    where: { slug: "test-gym-crossfit" },
    update: {},
    create: {
      slug: "test-gym-crossfit",
      name: "Test Gym CrossFit",
      type: "CROSSFIT_BOX",
      description:
        "Venue de teste para validação de funcionalidades. Este é um gym de teste com todas as features habilitadas.",
      city: "Lisboa",
      country: "PT",
      address: "Rua de Teste, 123",
      phone: "+351 912 345 678",
      email: "contact@testgym.com",
      website: "https://testgym.com",
      latitude: 38.7223,
      longitude: -9.1393,
      sportTypes: ["CROSSFIT", "HYROX"],
      defaultSessionCapacity: 12,
      defaultBookingAdvanceDays: 7,
      defaultCancellationDeadlineMinutes: 60,
      createdByUserId: appAdmin.id, // Required field
      logo: null,
      coverImage: null,
    },
  });
  console.log("✅ Test venue created:", venue.slug);

  // 2. Gym Owner
  console.log("\nCreating gym owner...");
  const gymOwner = await prisma.user.upsert({
    where: { email: "owner@testgym.com" },
    update: {},
    create: {
      email: "owner@testgym.com",
      name: "Gym Owner",
      password: passwordHash,
      role: "USER",
      locale: "pt",
      image: null,
    },
  });
  console.log("✅ Gym Owner created:", gymOwner.email);

  // Adicionar owner como membro
  await prisma.venueMember.upsert({
    where: {
      venueId_userId: {
        venueId: venue.id,
        userId: gymOwner.id,
      },
    },
    update: {},
    create: {
      venueId: venue.id,
      userId: gymOwner.id,
      role: "OWNER",
      status: "ACTIVE",
    },
  });
  console.log("   - Added as OWNER");

  // 3. Gym Admin
  console.log("\nCreating gym admin...");
  const gymAdmin = await prisma.user.upsert({
    where: { email: "admin@testgym.com" },
    update: {},
    create: {
      email: "admin@testgym.com",
      name: "Gym Admin",
      password: passwordHash,
      role: "USER",
      locale: "pt",
      image: null,
    },
  });
  console.log("✅ Gym Admin created:", gymAdmin.email);

  await prisma.venueMember.upsert({
    where: {
      venueId_userId: {
        venueId: venue.id,
        userId: gymAdmin.id,
      },
    },
    update: {},
    create: {
      venueId: venue.id,
      userId: gymAdmin.id,
      role: "ADMIN",
      status: "ACTIVE",
    },
  });
  console.log("   - Added as ADMIN");

  // 4. Gym Coach
  console.log("\nCreating gym coach...");
  const gymCoach = await prisma.user.upsert({
    where: { email: "coach@testgym.com" },
    update: {},
    create: {
      email: "coach@testgym.com",
      name: "Gym Coach",
      password: passwordHash,
      role: "USER",
      locale: "pt",
      image: null,
    },
  });
  console.log("✅ Gym Coach created:", gymCoach.email);

  await prisma.venueMember.upsert({
    where: {
      venueId_userId: {
        venueId: venue.id,
        userId: gymCoach.id,
      },
    },
    update: {},
    create: {
      venueId: venue.id,
      userId: gymCoach.id,
      role: "COACH",
      status: "ACTIVE",
    },
  });
  console.log("   - Added as COACH");

  // 5. User sem subscrição
  console.log("\nCreating free user...");
  const freeUser = await prisma.user.upsert({
    where: { email: "user.free@test.com" },
    update: {},
    create: {
      email: "user.free@test.com",
      name: "Free User",
      password: passwordHash,
      role: "USER",
      locale: "pt",
      image: null,
    },
  });
  console.log("✅ Free User created:", freeUser.email);

  await prisma.venueMember.upsert({
    where: {
      venueId_userId: {
        venueId: venue.id,
        userId: freeUser.id,
      },
    },
    update: {},
    create: {
      venueId: venue.id,
      userId: freeUser.id,
      role: "CLIENT",
      status: "ACTIVE",
    },
  });
  console.log("   - Added as CLIENT (no subscription)");

  // 6. User com subscrição
  console.log("\nCreating premium user...");
  const premiumUser = await prisma.user.upsert({
    where: { email: "user.premium@test.com" },
    update: {},
    create: {
      email: "user.premium@test.com",
      name: "Premium User",
      password: passwordHash,
      role: "USER",
      locale: "pt",
      image: null,
    },
  });
  console.log("✅ Premium User created:", premiumUser.email);

  await prisma.venueMember.upsert({
    where: {
      venueId_userId: {
        venueId: venue.id,
        userId: premiumUser.id,
      },
    },
    update: {},
    create: {
      venueId: venue.id,
      userId: premiumUser.id,
      role: "CLIENT",
      status: "ACTIVE",
    },
  });
  console.log("   - Added as CLIENT");

  // Criar plano de teste
  console.log("\n💳 Creating test plan...");

  // Check if plan already exists
  let plan = await prisma.venuePlan.findFirst({
    where: {
      venueId: venue.id,
      name: "Monthly Plan",
    },
  });

  if (!plan) {
    plan = await prisma.venuePlan.create({
      data: {
        venueId: venue.id,
        name: "Monthly Plan",
        description: "Unlimited classes per month",
        price: 50.0,
        currency: "EUR",
        // paymentProvider removed - now managed at venue level
        isActive: true,
      },
    });
  }
  console.log("✅ Test plan created:", plan.name);

  // Criar subscrição para premium user
  console.log("\n🎫 Creating active subscription...");

  // Check if subscription already exists
  let subscription = await prisma.venueSubscription.findFirst({
    where: {
      venueId: venue.id,
      userId: premiumUser.id,
      planId: plan.id,
    },
  });

  if (!subscription) {
    subscription = await prisma.venueSubscription.create({
      data: {
        venueId: venue.id,
        userId: premiumUser.id,
        planId: plan.id,
        status: "ACTIVE",
        paymentStatus: "PAID",
        startsAt: new Date(),
        endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 dias
      },
    });
  }
  console.log("✅ Active subscription created for:", premiumUser.email);

  // Criar algumas sessões de teste
  console.log("\n📅 Creating test sessions...");
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  for (let i = 0; i < 3; i++) {
    const sessionStart = new Date(tomorrow);
    sessionStart.setDate(sessionStart.getDate() + i);

    const sessionEnd = new Date(sessionStart);
    sessionEnd.setHours(sessionStart.getHours() + 1); // 1 hour duration

    await prisma.venueSession.create({
      data: {
        venueId: venue.id,
        type: "CLASS",
        title: `WOD ${i + 1}`,
        description: "Workout of the day - Test session",
        startsAt: sessionStart,
        endsAt: sessionEnd,
        capacity: 12,
        tags: ["CrossFit", "WOD"],
      },
    });
  }
  console.log("✅ 3 test sessions created");

  console.log("\n✅ Test users seeding completed!");
  console.log("\n📋 Summary:");
  console.log("─────────────────────────────────────────────");
  console.log("Admin:         admin@athlifyr.com");
  console.log("Gym Owner:     owner@testgym.com");
  console.log("Gym Admin:     admin@testgym.com");
  console.log("Gym Coach:     coach@testgym.com");
  console.log("Free User:     user.free@test.com");
  console.log("Premium User:  user.premium@test.com");
  console.log("─────────────────────────────────────────────");
  console.log("Password (all): Test123!");
  console.log("Venue:          /venues/test-gym-crossfit");
  console.log("\n📖 See docs/TEST_USERS.md for full documentation");
}

main()
  .catch((e) => {
    console.error("Error seeding test users:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
