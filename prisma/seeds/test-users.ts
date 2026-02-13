/**
 * Seed de Utilizadores de Teste - Athlifyr
 *
 * Este script cria os utilizadores de teste documentados em docs/test-users.md
 *
 * Password padrão: Test123!
 *
 * Execução:
 *   pnpm db:seed:test-users
 */

import {
  PrismaClient,
  UserRole,
  SportType,
  VenueType,
  VenueRole,
  MemberStatus,
} from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const DEFAULT_PASSWORD = "Test123!";

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log("🌱 Iniciando seed de utilizadores de teste...\n");

  const hashedPassword = await hashPassword(DEFAULT_PASSWORD);

  // ============================================================================
  // 1. ADMIN MASTER
  // ============================================================================
  console.log("👤 Criando Admin Master...");
  const adminMaster = await prisma.user.upsert({
    where: { email: "admin@athlifyr.com" },
    update: {
      name: "Admin Master",
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      emailNotifications: true,
      password: hashedPassword,
    },
    create: {
      email: "admin@athlifyr.com",
      name: "Admin Master",
      role: UserRole.ADMIN,
      emailVerified: new Date(),
      emailNotifications: true,
      password: hashedPassword,
    },
  });
  console.log(`   ✅ Admin Master criado: ${adminMaster.email}`);

  // ============================================================================
  // 2. JOÃO OWNER (Dono de Box)
  // ============================================================================
  console.log("👤 Criando João Owner...");
  const joaoOwner = await prisma.user.upsert({
    where: { email: "joao.owner@test.com" },
    update: {
      name: "João Silva",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
    },
    create: {
      email: "joao.owner@test.com",
      name: "João Silva",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
    },
  });
  console.log(`   ✅ João Owner criado: ${joaoOwner.email}`);

  // ============================================================================
  // 3. MARIA COACH (Treinadora)
  // ============================================================================
  console.log("👤 Criando Maria Coach...");
  const mariaCoach = await prisma.user.upsert({
    where: { email: "maria.coach@test.com" },
    update: {
      name: "Maria Santos",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT],
      password: hashedPassword,
    },
    create: {
      email: "maria.coach@test.com",
      name: "Maria Santos",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT],
      password: hashedPassword,
    },
  });
  console.log(`   ✅ Maria Coach criada: ${mariaCoach.email}`);

  // ============================================================================
  // 4. PEDRO ATLETA (Membro de Box)
  // ============================================================================
  console.log("👤 Criando Pedro Atleta...");
  const pedroAtleta = await prisma.user.upsert({
    where: { email: "pedro.atleta@test.com" },
    update: {
      name: "Pedro Costa",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT],
      password: hashedPassword,
    },
    create: {
      email: "pedro.atleta@test.com",
      name: "Pedro Costa",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT],
      password: hashedPassword,
    },
  });
  console.log(`   ✅ Pedro Atleta criado: ${pedroAtleta.email}`);

  // ============================================================================
  // 5. ANA FREE (Atleta Independente)
  // ============================================================================
  console.log("👤 Criando Ana Free...");
  const anaFree = await prisma.user.upsert({
    where: { email: "ana.free@test.com" },
    update: {
      name: "Ana Ferreira",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: false,
      favoriteSports: [SportType.TRAIL, SportType.TRIATHLON],
      password: hashedPassword,
    },
    create: {
      email: "ana.free@test.com",
      name: "Ana Ferreira",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: false,
      favoriteSports: [SportType.TRAIL, SportType.TRIATHLON],
      password: hashedPassword,
    },
  });
  console.log(`   ✅ Ana Free criada: ${anaFree.email}`);

  // ============================================================================
  // 6. CARLOS MULTI (Multi-Box + Owner)
  // ============================================================================
  console.log("👤 Criando Carlos Multi...");
  const carlosMulti = await prisma.user.upsert({
    where: { email: "carlos.multi@test.com" },
    update: {
      name: "Carlos Rodrigues",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
    },
    create: {
      email: "carlos.multi@test.com",
      name: "Carlos Rodrigues",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT, SportType.HYROX],
      password: hashedPassword,
    },
  });
  console.log(`   ✅ Carlos Multi criado: ${carlosMulti.email}`);

  // ============================================================================
  // 7. SOFIA NOVA (Utilizador Novo - Email Não Verificado)
  // ============================================================================
  console.log("👤 Criando Sofia Nova...");
  const sofiaNova = await prisma.user.upsert({
    where: { email: "sofia.nova@test.com" },
    update: {
      name: "Sofia Mendes",
      role: UserRole.USER,
      emailVerified: null, // Email NÃO verificado
      emailNotifications: false,
      favoriteSports: [],
      password: hashedPassword,
    },
    create: {
      email: "sofia.nova@test.com",
      name: "Sofia Mendes",
      role: UserRole.USER,
      emailVerified: null, // Email NÃO verificado
      emailNotifications: false,
      favoriteSports: [],
      password: hashedPassword,
    },
  });
  console.log(`   ✅ Sofia Nova criada: ${sofiaNova.email}`);

  // ============================================================================
  // 8. BANNED USER (Utilizador Banido)
  // ============================================================================
  console.log("👤 Criando Banned User...");
  const bannedUser = await prisma.user.upsert({
    where: { email: "banned@test.com" },
    update: {
      name: "Banned Test",
      role: UserRole.USER,
      emailVerified: new Date(),
      isBanned: true,
      password: hashedPassword,
    },
    create: {
      email: "banned@test.com",
      name: "Banned Test",
      role: UserRole.USER,
      emailVerified: new Date(),
      isBanned: true,
      password: hashedPassword,
    },
  });
  console.log(`   ✅ Banned User criado: ${bannedUser.email}`);

  // ============================================================================
  // VENUES DE TESTE
  // ============================================================================
  console.log("\n🏢 Criando Venues de teste...\n");

  // CrossFit Cascais
  console.log("🏋️ Criando CrossFit Cascais...");
  const crossfitCascais = await prisma.venue.upsert({
    where: { slug: "crossfit-cascais" },
    update: {
      name: "CrossFit Cascais",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      description:
        "Box de CrossFit em Cascais com instalações modernas e equipa de coaches certificados.",
      city: "Cascais",
      country: "Portugal",
      latitude: 38.6979,
      longitude: -9.4215,
      isVerified: true,
      isActive: true,
    },
    create: {
      slug: "crossfit-cascais",
      name: "CrossFit Cascais",
      type: VenueType.CROSSFIT_BOX,
      sportTypes: [SportType.CROSSFIT],
      description:
        "Box de CrossFit em Cascais com instalações modernas e equipa de coaches certificados.",
      city: "Cascais",
      country: "Portugal",
      latitude: 38.6979,
      longitude: -9.4215,
      isVerified: true,
      isActive: true,
      createdByUserId: joaoOwner.id,
    },
  });
  console.log(`   ✅ CrossFit Cascais criado: ${crossfitCascais.slug}`);

  // HYROX Lisboa
  console.log("🏋️ Criando HYROX Lisboa...");
  const hyroxLisboa = await prisma.venue.upsert({
    where: { slug: "hyrox-training-lisboa" },
    update: {
      name: "HYROX Training Lisboa",
      type: VenueType.GYM,
      sportTypes: [SportType.HYROX, SportType.CROSSFIT],
      description: "Centro de treino especializado em HYROX em Lisboa.",
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7223,
      longitude: -9.1393,
      isVerified: true,
      isActive: true,
    },
    create: {
      slug: "hyrox-training-lisboa",
      name: "HYROX Training Lisboa",
      type: VenueType.GYM,
      sportTypes: [SportType.HYROX, SportType.CROSSFIT],
      description: "Centro de treino especializado em HYROX em Lisboa.",
      city: "Lisboa",
      country: "Portugal",
      latitude: 38.7223,
      longitude: -9.1393,
      isVerified: true,
      isActive: true,
      createdByUserId: carlosMulti.id,
    },
  });
  console.log(`   ✅ HYROX Lisboa criado: ${hyroxLisboa.slug}`);

  // Box Funcional Porto
  console.log("🏋️ Criando Box Funcional Porto...");
  const boxFuncionalPorto = await prisma.venue.upsert({
    where: { slug: "box-funcional-porto" },
    update: {
      name: "Box Funcional Porto",
      type: VenueType.CROSSTRAINING_BOX,
      sportTypes: [SportType.CROSSFIT],
      description:
        "Box de treino funcional no Porto com foco em CrossTraining.",
      city: "Porto",
      country: "Portugal",
      latitude: 41.1579,
      longitude: -8.6291,
      isVerified: true,
      isActive: true,
    },
    create: {
      slug: "box-funcional-porto",
      name: "Box Funcional Porto",
      type: VenueType.CROSSTRAINING_BOX,
      sportTypes: [SportType.CROSSFIT],
      description:
        "Box de treino funcional no Porto com foco em CrossTraining.",
      city: "Porto",
      country: "Portugal",
      latitude: 41.1579,
      longitude: -8.6291,
      isVerified: true,
      isActive: true,
      createdByUserId: adminMaster.id,
    },
  });
  console.log(`   ✅ Box Funcional Porto criado: ${boxFuncionalPorto.slug}`);

  // ============================================================================
  // VENUE MEMBERS (Relações entre utilizadores e venues)
  // ============================================================================
  console.log("\n👥 Criando relações Venue Members...\n");

  // João Owner - OWNER do CrossFit Cascais
  await prisma.venueMember.upsert({
    where: {
      venueId_userId: { venueId: crossfitCascais.id, userId: joaoOwner.id },
    },
    update: {
      role: VenueRole.OWNER,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
    create: {
      venueId: crossfitCascais.id,
      userId: joaoOwner.id,
      role: VenueRole.OWNER,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
  });
  console.log("   ✅ João Silva -> CrossFit Cascais (OWNER)");

  // Maria Coach - COACH no CrossFit Cascais
  await prisma.venueMember.upsert({
    where: {
      venueId_userId: { venueId: crossfitCascais.id, userId: mariaCoach.id },
    },
    update: {
      role: VenueRole.COACH,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
    create: {
      venueId: crossfitCascais.id,
      userId: mariaCoach.id,
      role: VenueRole.COACH,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
  });
  console.log("   ✅ Maria Santos -> CrossFit Cascais (COACH)");

  // Pedro Atleta - CLIENT no CrossFit Cascais
  await prisma.venueMember.upsert({
    where: {
      venueId_userId: { venueId: crossfitCascais.id, userId: pedroAtleta.id },
    },
    update: {
      role: VenueRole.CLIENT,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
    create: {
      venueId: crossfitCascais.id,
      userId: pedroAtleta.id,
      role: VenueRole.CLIENT,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
  });
  console.log("   ✅ Pedro Costa -> CrossFit Cascais (CLIENT)");

  // Ana Free - CLIENT no CrossFit Cascais (com plano limitado)
  await prisma.venueMember.upsert({
    where: {
      venueId_userId: { venueId: crossfitCascais.id, userId: anaFree.id },
    },
    update: {
      role: VenueRole.CLIENT,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
    create: {
      venueId: crossfitCascais.id,
      userId: anaFree.id,
      role: VenueRole.CLIENT,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
  });
  console.log(
    "   ✅ Ana Ferreira -> CrossFit Cascais (CLIENT - Plano Limitado)"
  );

  // Carlos Multi - OWNER do HYROX Lisboa
  await prisma.venueMember.upsert({
    where: {
      venueId_userId: { venueId: hyroxLisboa.id, userId: carlosMulti.id },
    },
    update: {
      role: VenueRole.OWNER,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
    create: {
      venueId: hyroxLisboa.id,
      userId: carlosMulti.id,
      role: VenueRole.OWNER,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
  });
  console.log("   ✅ Carlos Rodrigues -> HYROX Lisboa (OWNER)");

  // Carlos Multi - CLIENT no CrossFit Cascais
  await prisma.venueMember.upsert({
    where: {
      venueId_userId: { venueId: crossfitCascais.id, userId: carlosMulti.id },
    },
    update: {
      role: VenueRole.CLIENT,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
    create: {
      venueId: crossfitCascais.id,
      userId: carlosMulti.id,
      role: VenueRole.CLIENT,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
  });
  console.log("   ✅ Carlos Rodrigues -> CrossFit Cascais (CLIENT)");

  // Carlos Multi - COACH no Box Funcional Porto
  await prisma.venueMember.upsert({
    where: {
      venueId_userId: { venueId: boxFuncionalPorto.id, userId: carlosMulti.id },
    },
    update: {
      role: VenueRole.COACH,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
    create: {
      venueId: boxFuncionalPorto.id,
      userId: carlosMulti.id,
      role: VenueRole.COACH,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
  });
  console.log("   ✅ Carlos Rodrigues -> Box Funcional Porto (COACH)");

  // ============================================================================
  // VENUE SESSIONS (Sessões de treino para testar marcações)
  // ============================================================================
  console.log("\n📅 Criando Sessões de Treino...\n");

  // Helper para criar datas das sessões (próximos dias)
  const createSessionDate = (
    daysFromNow: number,
    hour: number,
    minute: number = 0
  ) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  // Sessões para CrossFit Cascais (amanhã e próximos dias)
  const session1 = await prisma.venueSession.upsert({
    where: { id: "session-cf-cascais-wod-1" },
    update: {
      title: "WOD - CrossFit",
      description:
        "Workout of the Day - Sessão de CrossFit aberta a todos os níveis",
      startsAt: createSessionDate(1, 7, 0), // Amanhã às 7h
      endsAt: createSessionDate(1, 8, 0),
      capacity: 12,
      coachId: mariaCoach.id,
    },
    create: {
      id: "session-cf-cascais-wod-1",
      venueId: crossfitCascais.id,
      type: "CLASS",
      title: "WOD - CrossFit",
      description:
        "Workout of the Day - Sessão de CrossFit aberta a todos os níveis",
      startsAt: createSessionDate(1, 7, 0),
      endsAt: createSessionDate(1, 8, 0),
      capacity: 12,
      coachId: mariaCoach.id,
      bookingAdvanceDays: 7,
      cancellationDeadlineMinutes: 60,
    },
  });
  console.log(`   ✅ Sessão WOD 7h criada: ${session1.id}`);

  const session2 = await prisma.venueSession.upsert({
    where: { id: "session-cf-cascais-wod-2" },
    update: {
      title: "WOD - CrossFit",
      description:
        "Workout of the Day - Sessão de CrossFit aberta a todos os níveis",
      startsAt: createSessionDate(1, 9, 0), // Amanhã às 9h
      endsAt: createSessionDate(1, 10, 0),
      capacity: 12,
      coachId: mariaCoach.id,
    },
    create: {
      id: "session-cf-cascais-wod-2",
      venueId: crossfitCascais.id,
      type: "CLASS",
      title: "WOD - CrossFit",
      description:
        "Workout of the Day - Sessão de CrossFit aberta a todos os níveis",
      startsAt: createSessionDate(1, 9, 0),
      endsAt: createSessionDate(1, 10, 0),
      capacity: 12,
      coachId: mariaCoach.id,
      bookingAdvanceDays: 7,
      cancellationDeadlineMinutes: 60,
    },
  });
  console.log(`   ✅ Sessão WOD 9h criada: ${session2.id}`);

  const session3 = await prisma.venueSession.upsert({
    where: { id: "session-cf-cascais-wod-3" },
    update: {
      title: "WOD - CrossFit",
      description:
        "Workout of the Day - Sessão de CrossFit aberta a todos os níveis",
      startsAt: createSessionDate(1, 18, 30), // Amanhã às 18:30
      endsAt: createSessionDate(1, 19, 30),
      capacity: 15,
      coachId: mariaCoach.id,
    },
    create: {
      id: "session-cf-cascais-wod-3",
      venueId: crossfitCascais.id,
      type: "CLASS",
      title: "WOD - CrossFit",
      description:
        "Workout of the Day - Sessão de CrossFit aberta a todos os níveis",
      startsAt: createSessionDate(1, 18, 30),
      endsAt: createSessionDate(1, 19, 30),
      capacity: 15,
      coachId: mariaCoach.id,
      bookingAdvanceDays: 7,
      cancellationDeadlineMinutes: 60,
    },
  });
  console.log(`   ✅ Sessão WOD 18:30 criada: ${session3.id}`);

  // Sessão de Open Gym (sem limite de capacidade)
  await prisma.venueSession.upsert({
    where: { id: "session-cf-cascais-opengym" },
    update: {
      title: "Open Gym",
      description:
        "Treino livre - Utiliza o espaço e equipamento à tua vontade",
      startsAt: createSessionDate(1, 12, 0),
      endsAt: createSessionDate(1, 14, 0),
      capacity: null, // Sem limite
    },
    create: {
      id: "session-cf-cascais-opengym",
      venueId: crossfitCascais.id,
      type: "CLASS",
      title: "Open Gym",
      description:
        "Treino livre - Utiliza o espaço e equipamento à tua vontade",
      startsAt: createSessionDate(1, 12, 0),
      endsAt: createSessionDate(1, 14, 0),
      capacity: null,
      bookingAdvanceDays: 7,
      cancellationDeadlineMinutes: 30,
    },
  });
  console.log("   ✅ Sessão Open Gym criada");

  // Sessão Yoga às 18h (mesmo dia que Open Gym - para testar limite diário)
  await prisma.venueSession.upsert({
    where: { id: "session-cf-cascais-yoga" },
    update: {
      title: "Yoga & Mobilidade",
      description: "Sessão de yoga e mobilidade para recuperação",
      startsAt: createSessionDate(1, 18, 0),
      endsAt: createSessionDate(1, 19, 0),
      capacity: 15,
      coachId: mariaCoach.id,
    },
    create: {
      id: "session-cf-cascais-yoga",
      venueId: crossfitCascais.id,
      type: "CLASS",
      title: "Yoga & Mobilidade",
      description: "Sessão de yoga e mobilidade para recuperação",
      startsAt: createSessionDate(1, 18, 0),
      endsAt: createSessionDate(1, 19, 0),
      capacity: 15,
      coachId: mariaCoach.id,
      bookingAdvanceDays: 7,
      cancellationDeadlineMinutes: 60,
    },
  });
  console.log(
    "   ✅ Sessão Yoga & Mobilidade criada (para teste de limite diário)"
  );

  // Sessões para daqui a 2 dias
  await prisma.venueSession.upsert({
    where: { id: "session-cf-cascais-wod-4" },
    update: {
      title: "WOD - CrossFit",
      startsAt: createSessionDate(2, 7, 0),
      endsAt: createSessionDate(2, 8, 0),
      capacity: 12,
      coachId: mariaCoach.id,
    },
    create: {
      id: "session-cf-cascais-wod-4",
      venueId: crossfitCascais.id,
      type: "CLASS",
      title: "WOD - CrossFit",
      startsAt: createSessionDate(2, 7, 0),
      endsAt: createSessionDate(2, 8, 0),
      capacity: 12,
      coachId: mariaCoach.id,
      bookingAdvanceDays: 7,
      cancellationDeadlineMinutes: 60,
    },
  });
  console.log("   ✅ Sessão WOD (dia +2) criada");

  // Sessão HYROX Lisboa
  await prisma.venueSession.upsert({
    where: { id: "session-hyrox-lisboa-1" },
    update: {
      title: "HYROX Simulation",
      description: "Treino de simulação HYROX completo",
      startsAt: createSessionDate(1, 10, 0),
      endsAt: createSessionDate(1, 11, 30),
      capacity: 8,
    },
    create: {
      id: "session-hyrox-lisboa-1",
      venueId: hyroxLisboa.id,
      type: "CLASS",
      title: "HYROX Simulation",
      description: "Treino de simulação HYROX completo",
      startsAt: createSessionDate(1, 10, 0),
      endsAt: createSessionDate(1, 11, 30),
      capacity: 8,
      bookingAdvanceDays: 5,
      cancellationDeadlineMinutes: 120,
    },
  });
  console.log("   ✅ Sessão HYROX Simulation criada");

  // Sessão Box Funcional Porto
  await prisma.venueSession.upsert({
    where: { id: "session-box-porto-1" },
    update: {
      title: "Treino Funcional",
      description: "Aula de treino funcional para todos os níveis",
      startsAt: createSessionDate(1, 19, 0),
      endsAt: createSessionDate(1, 20, 0),
      capacity: 10,
      coachId: carlosMulti.id,
    },
    create: {
      id: "session-box-porto-1",
      venueId: boxFuncionalPorto.id,
      type: "CLASS",
      title: "Treino Funcional",
      description: "Aula de treino funcional para todos os níveis",
      startsAt: createSessionDate(1, 19, 0),
      endsAt: createSessionDate(1, 20, 0),
      capacity: 10,
      coachId: carlosMulti.id,
      bookingAdvanceDays: 7,
      cancellationDeadlineMinutes: 60,
    },
  });
  console.log("   ✅ Sessão Treino Funcional Porto criada");

  // ============================================================================
  // VENUE PLANS
  // ============================================================================
  console.log("\n💰 Criando Planos de Subscrição...\n");

  // Plano Mensal CrossFit Cascais
  const planMensal = await prisma.venuePlan.upsert({
    where: { id: "plan-crossfit-cascais-mensal" },
    update: {
      name: "Plano Mensal",
      description: "Acesso ilimitado a todas as aulas durante 1 mês",
      price: 80.0,
      currency: "EUR",
      isActive: true,
    },
    create: {
      id: "plan-crossfit-cascais-mensal",
      venueId: crossfitCascais.id,
      name: "Plano Mensal",
      description: "Acesso ilimitado a todas as aulas durante 1 mês",
      price: 80.0,
      currency: "EUR",
      isActive: true,
    },
  });
  console.log("   ✅ Plano Mensal CrossFit Cascais criado");

  // Plano Trimestral CrossFit Cascais
  await prisma.venuePlan.upsert({
    where: { id: "plan-crossfit-cascais-trimestral" },
    update: {
      name: "Plano Trimestral",
      description: "Acesso ilimitado durante 3 meses com desconto",
      price: 210.0,
      currency: "EUR",
      isActive: true,
    },
    create: {
      id: "plan-crossfit-cascais-trimestral",
      venueId: crossfitCascais.id,
      name: "Plano Trimestral",
      description: "Acesso ilimitado durante 3 meses com desconto",
      price: 210.0,
      currency: "EUR",
      isActive: true,
    },
  });
  console.log("   ✅ Plano Trimestral CrossFit Cascais criado");

  // Plano Anual CrossFit Cascais
  await prisma.venuePlan.upsert({
    where: { id: "plan-crossfit-cascais-anual" },
    update: {
      name: "Plano Anual",
      description: "Acesso ilimitado durante 12 meses - melhor preço!",
      price: 750.0,
      currency: "EUR",
      isActive: true,
    },
    create: {
      id: "plan-crossfit-cascais-anual",
      venueId: crossfitCascais.id,
      name: "Plano Anual",
      description: "Acesso ilimitado durante 12 meses - melhor preço!",
      price: 750.0,
      currency: "EUR",
      isActive: true,
    },
  });
  console.log("   ✅ Plano Anual CrossFit Cascais criado");

  // Drop-in HYROX Lisboa
  await prisma.venuePlan.upsert({
    where: { id: "plan-hyrox-lisboa-dropin" },
    update: {
      name: "Drop-in",
      description: "Sessão única de treino",
      price: 15.0,
      currency: "EUR",
      isActive: true,
    },
    create: {
      id: "plan-hyrox-lisboa-dropin",
      venueId: hyroxLisboa.id,
      name: "Drop-in",
      description: "Sessão única de treino",
      price: 15.0,
      currency: "EUR",
      isActive: true,
    },
  });
  console.log("   ✅ Drop-in HYROX Lisboa criado");

  // Plano Mensal HYROX Lisboa
  await prisma.venuePlan.upsert({
    where: { id: "plan-hyrox-lisboa-mensal" },
    update: {
      name: "Plano Mensal",
      description: "Acesso ilimitado a todas as sessões HYROX",
      price: 90.0,
      currency: "EUR",
      isActive: true,
    },
    create: {
      id: "plan-hyrox-lisboa-mensal",
      venueId: hyroxLisboa.id,
      name: "Plano Mensal",
      description: "Acesso ilimitado a todas as sessões HYROX",
      price: 90.0,
      currency: "EUR",
      isActive: true,
    },
  });
  console.log("   ✅ Plano Mensal HYROX Lisboa criado");

  // Plano Limitado CrossFit Cascais - 1 aula por dia máximo (para testes)
  const planLimitado = await prisma.venuePlan.upsert({
    where: { id: "plan-crossfit-cascais-limitado" },
    update: {
      name: "Plano Limitado",
      description: "Máximo 1 aula por dia - plano de teste",
      price: 40.0,
      currency: "EUR",
      isActive: true,
      policy: {
        maxBookingsPerDay: 1,
      },
    },
    create: {
      id: "plan-crossfit-cascais-limitado",
      venueId: crossfitCascais.id,
      name: "Plano Limitado",
      description: "Máximo 1 aula por dia - plano de teste",
      price: 40.0,
      currency: "EUR",
      isActive: true,
      policy: {
        maxBookingsPerDay: 1,
      },
    },
  });
  console.log("   ✅ Plano Limitado CrossFit Cascais criado (max 1 aula/dia)");

  // ============================================================================
  // SUBSCRIÇÃO ATIVA PARA PEDRO ATLETA
  // ============================================================================
  console.log("\n📋 Criando Subscrição ativa para Pedro Atleta...");

  const startsAt = new Date();
  const endsAt = new Date();
  endsAt.setMonth(endsAt.getMonth() + 1);

  await prisma.venueSubscription.upsert({
    where: { id: "sub-pedro-crossfit-cascais" },
    update: {
      status: "ACTIVE",
      paymentStatus: "PAID",
      startsAt: startsAt,
      endsAt: endsAt,
    },
    create: {
      id: "sub-pedro-crossfit-cascais",
      venueId: crossfitCascais.id,
      userId: pedroAtleta.id,
      planId: planMensal.id,
      status: "ACTIVE",
      paymentStatus: "PAID",
      startsAt: startsAt,
      endsAt: endsAt,
    },
  });
  console.log("   ✅ Subscrição Plano Mensal para Pedro Costa criada");

  // Subscrição Plano Limitado para Ana Free (max 1 aula/dia)
  await prisma.venueSubscription.upsert({
    where: { id: "sub-ana-crossfit-cascais-limitado" },
    update: {
      status: "ACTIVE",
      paymentStatus: "PAID",
      startsAt: startsAt,
      endsAt: endsAt,
    },
    create: {
      id: "sub-ana-crossfit-cascais-limitado",
      venueId: crossfitCascais.id,
      userId: anaFree.id,
      planId: planLimitado.id,
      status: "ACTIVE",
      paymentStatus: "PAID",
      startsAt: startsAt,
      endsAt: endsAt,
    },
  });
  console.log(
    "   ✅ Subscrição Plano Limitado para Ana Silva criada (max 1 aula/dia)"
  );

  // ============================================================================
  // 9. RUI DROPIN (Utilizador Drop-in - 1 sessão)
  // ============================================================================
  console.log("\n👤 Criando Rui Drop-in...");
  const ruiDropin = await prisma.user.upsert({
    where: { email: "rui.dropin@test.com" },
    update: {
      name: "Rui Oliveira",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT],
      password: hashedPassword,
    },
    create: {
      email: "rui.dropin@test.com",
      name: "Rui Oliveira",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT],
      password: hashedPassword,
    },
  });
  console.log(`   ✅ Rui Drop-in criado: ${ruiDropin.email}`);

  // ============================================================================
  // 10. INÊS PACK (Utilizadora Pack 5 Aulas)
  // ============================================================================
  console.log("👤 Criando Inês Pack...");
  const inesPack = await prisma.user.upsert({
    where: { email: "ines.pack@test.com" },
    update: {
      name: "Inês Martins",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT],
      password: hashedPassword,
    },
    create: {
      email: "ines.pack@test.com",
      name: "Inês Martins",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.CROSSFIT],
      password: hashedPassword,
    },
  });
  console.log(`   ✅ Inês Pack criada: ${inesPack.email}`);

  // ============================================================================
  // 11. TEST REVIEW (Utilizador de Teste para Reviews)
  // ============================================================================
  console.log("👤 Criando Test Review...");
  const testReview = await prisma.user.upsert({
    where: { email: "testreview@athlifyr.com" },
    update: {
      name: "Test Review",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.TRAIL, SportType.CROSSFIT],
      password: hashedPassword,
    },
    create: {
      email: "testreview@athlifyr.com",
      name: "Test Review",
      role: UserRole.USER,
      emailVerified: new Date(),
      emailNotifications: true,
      favoriteSports: [SportType.TRAIL, SportType.CROSSFIT],
      password: hashedPassword,
    },
  });
  console.log(`   ✅ Test Review criado: ${testReview.email}`);

  // Rui Drop-in - CLIENT no CrossFit Cascais
  await prisma.venueMember.upsert({
    where: {
      venueId_userId: { venueId: crossfitCascais.id, userId: ruiDropin.id },
    },
    update: {
      role: VenueRole.CLIENT,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
    create: {
      venueId: crossfitCascais.id,
      userId: ruiDropin.id,
      role: VenueRole.CLIENT,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
  });
  console.log("   ✅ Rui Oliveira -> CrossFit Cascais (CLIENT - Drop-in)");

  // Inês Pack - CLIENT no CrossFit Cascais
  await prisma.venueMember.upsert({
    where: {
      venueId_userId: { venueId: crossfitCascais.id, userId: inesPack.id },
    },
    update: {
      role: VenueRole.CLIENT,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
    create: {
      venueId: crossfitCascais.id,
      userId: inesPack.id,
      role: VenueRole.CLIENT,
      status: MemberStatus.ACTIVE,
      joinedAt: new Date(),
    },
  });
  console.log("   ✅ Inês Martins -> CrossFit Cascais (CLIENT - Pack 5)");

  // ============================================================================
  // PLANOS DROP-IN E PACK 5 AULAS (CrossFit Cascais)
  // ============================================================================
  console.log("\n🎟️ Criando Planos Drop-in e Pack 5 Aulas...\n");

  // Drop-in CrossFit Cascais (1 sessão total)
  const planDropin = await prisma.venuePlan.upsert({
    where: { id: "plan-crossfit-cascais-dropin" },
    update: {
      name: "Drop-in",
      description: "Aula avulsa - experimenta uma sessão sem compromisso",
      price: 12.0,
      currency: "EUR",
      isActive: true,
      policy: {
        duration: "ONE_TIME",
        maxTotalBookings: 1,
      },
    },
    create: {
      id: "plan-crossfit-cascais-dropin",
      venueId: crossfitCascais.id,
      name: "Drop-in",
      description: "Aula avulsa - experimenta uma sessão sem compromisso",
      price: 12.0,
      currency: "EUR",
      isActive: true,
      policy: {
        duration: "ONE_TIME",
        maxTotalBookings: 1,
      },
    },
  });
  console.log("   ✅ Plano Drop-in CrossFit Cascais criado (1 sessão, 12€)");

  // Pack 5 Aulas CrossFit Cascais (5 sessões totais)
  const planPack5 = await prisma.venuePlan.upsert({
    where: { id: "plan-crossfit-cascais-pack5" },
    update: {
      name: "Pack 5 Aulas",
      description: "Pack de 5 aulas - usa quando quiseres, sem limite de tempo",
      price: 50.0,
      currency: "EUR",
      isActive: true,
      policy: {
        duration: "ONE_TIME",
        maxTotalBookings: 5,
      },
    },
    create: {
      id: "plan-crossfit-cascais-pack5",
      venueId: crossfitCascais.id,
      name: "Pack 5 Aulas",
      description: "Pack de 5 aulas - usa quando quiseres, sem limite de tempo",
      price: 50.0,
      currency: "EUR",
      isActive: true,
      policy: {
        duration: "ONE_TIME",
        maxTotalBookings: 5,
      },
    },
  });
  console.log(
    "   ✅ Plano Pack 5 Aulas CrossFit Cascais criado (5 sessões, 50€)"
  );

  // ============================================================================
  // SUBSCRIÇÕES DROP-IN E PACK 5 AULAS
  // ============================================================================
  console.log("\n📋 Criando Subscrições Drop-in e Pack 5...\n");

  // Subscrição Drop-in para Rui
  await prisma.venueSubscription.upsert({
    where: { id: "sub-rui-crossfit-cascais-dropin" },
    update: {
      status: "ACTIVE",
      paymentStatus: "PAID",
      startsAt: startsAt,
      endsAt: null, // ONE_TIME - sem expiração
    },
    create: {
      id: "sub-rui-crossfit-cascais-dropin",
      venueId: crossfitCascais.id,
      userId: ruiDropin.id,
      planId: planDropin.id,
      status: "ACTIVE",
      paymentStatus: "PAID",
      startsAt: startsAt,
      endsAt: null, // ONE_TIME - sem expiração
    },
  });
  console.log(
    "   ✅ Subscrição Drop-in para Rui Oliveira criada (1 sessão disponível)"
  );

  // Subscrição Pack 5 para Inês
  await prisma.venueSubscription.upsert({
    where: { id: "sub-ines-crossfit-cascais-pack5" },
    update: {
      status: "ACTIVE",
      paymentStatus: "PAID",
      startsAt: startsAt,
      endsAt: null, // ONE_TIME - sem expiração
    },
    create: {
      id: "sub-ines-crossfit-cascais-pack5",
      venueId: crossfitCascais.id,
      userId: inesPack.id,
      planId: planPack5.id,
      status: "ACTIVE",
      paymentStatus: "PAID",
      startsAt: startsAt,
      endsAt: null, // ONE_TIME - sem expiração
    },
  });
  console.log(
    "   ✅ Subscrição Pack 5 Aulas para Inês Martins criada (5 sessões disponíveis)"
  );

  // ============================================================================
  // RESUMO FINAL
  // ============================================================================
  console.log("\n" + "=".repeat(60));
  console.log("✅ SEED COMPLETO!\n");
  console.log("📊 UTILIZADORES CRIADOS:");
  console.log("   1. admin@athlifyr.com (ADMIN)");
  console.log("   2. joao.owner@test.com (Box Owner)");
  console.log("   3. maria.coach@test.com (Coach)");
  console.log("   4. pedro.atleta@test.com (Membro com Plano Mensal)");
  console.log(
    "   5. ana.free@test.com (Membro com Plano Limitado - 1 aula/dia)"
  );
  console.log("   6. carlos.multi@test.com (Multi-Box + Owner)");
  console.log("   7. sofia.nova@test.com (Novo - Email não verificado)");
  console.log("   8. banned@test.com (Banido)");
  console.log("   9. rui.dropin@test.com (Drop-in - 1 sessão)");
  console.log("   10. ines.pack@test.com (Pack 5 Aulas - 5 sessões)");
  console.log("   11. testreview@athlifyr.com (Test Review)");
  console.log("\n🏢 VENUES CRIADOS:");
  console.log("   - CrossFit Cascais (crossfit-cascais)");
  console.log("   - HYROX Training Lisboa (hyrox-training-lisboa)");
  console.log("   - Box Funcional Porto (box-funcional-porto)");
  console.log("\n💰 PLANOS:");
  console.log("   - Plano Mensal CrossFit (ilimitado)");
  console.log("   - Plano Limitado CrossFit (max 1 aula/dia)");
  console.log("   - Drop-in CrossFit (1 sessão total - 12€)");
  console.log("   - Pack 5 Aulas CrossFit (5 sessões totais - 50€)");
  console.log("\n🔑 PASSWORD PADRÃO: Test123!");
  console.log("=".repeat(60) + "\n");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
