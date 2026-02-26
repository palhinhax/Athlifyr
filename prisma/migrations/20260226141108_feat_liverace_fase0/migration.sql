-- Fase 0: LiveRace - Event Organizers, Staff, Invites, Stripe Connect, Feature Flags
-- Migration: feat_liverace_fase0_organizers_staff_stripe

-- CreateEnum (only if not exists - safe for drift scenario)
DO $$ BEGIN
  CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "EventStripeOnboardingStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'COMPLETE', 'RESTRICTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "EventLiveStatus" AS ENUM ('SCHEDULED', 'LIVE', 'PAUSED', 'FINISHED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "EventOrganizerRole" AS ENUM ('OWNER', 'ADMIN', 'FINANCE');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "EventStaffRole" AS ENUM ('STAFF', 'CHECKIN_ONLY', 'STREAM_ONLY');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "EventInviteType" AS ENUM ('ORGANIZER', 'STAFF');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "EventInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- AlterTable Event: add feature flags + Stripe Connect + LiveRace fields
ALTER TABLE "Event"
  ADD COLUMN IF NOT EXISTS "hasRegistrations"      BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "hasLiveRace"            BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "stripeAccountId"        TEXT,
  ADD COLUMN IF NOT EXISTS "stripeChargesEnabled"   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "stripeDetailsSubmitted" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "stripePayoutsEnabled"   BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "stripeLastWebhookAt"    TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "stripeOnboardingStatus" "EventStripeOnboardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
  ADD COLUMN IF NOT EXISTS "commissionPercent"      DOUBLE PRECISION NOT NULL DEFAULT 5.0,
  ADD COLUMN IF NOT EXISTS "commissionFixed"        INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "refundDeadline"         TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "checkInOpensAt"         TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "checkInClosesAt"        TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "liveStatus"             "EventLiveStatus" NOT NULL DEFAULT 'SCHEDULED';

-- CreateIndex on Event new fields
CREATE INDEX IF NOT EXISTS "Event_hasRegistrations_idx" ON "Event"("hasRegistrations");
CREATE INDEX IF NOT EXISTS "Event_hasLiveRace_idx" ON "Event"("hasLiveRace");

-- CreateTable Registration (may already exist in DB due to drift)
CREATE TABLE IF NOT EXISTS "Registration" (
    "id"                      TEXT NOT NULL,
    "userId"                  TEXT NOT NULL,
    "eventId"                 TEXT NOT NULL,
    "variantId"               TEXT NOT NULL,
    "status"                  "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "bibNumber"               TEXT,
    "checkedInAt"             TIMESTAMP(3),
    "paymentProvider"         TEXT NOT NULL DEFAULT 'STRIPE',
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId"   TEXT,
    "amountCents"             INTEGER NOT NULL,
    "feeCents"                INTEGER,
    "netCents"                INTEGER,
    "currency"                "Currency" NOT NULL DEFAULT 'EUR',
    "createdAt"               TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"               TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable EventOrganizer
CREATE TABLE IF NOT EXISTS "EventOrganizer" (
    "id"        TEXT NOT NULL,
    "eventId"   TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "role"      "EventOrganizerRole" NOT NULL DEFAULT 'ADMIN',
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventOrganizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable EventStaffMember
CREATE TABLE IF NOT EXISTS "EventStaffMember" (
    "id"        TEXT NOT NULL,
    "eventId"   TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "role"      "EventStaffRole" NOT NULL DEFAULT 'STAFF',
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventStaffMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable EventInvite
CREATE TABLE IF NOT EXISTS "EventInvite" (
    "id"          TEXT NOT NULL,
    "eventId"     TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "email"       TEXT NOT NULL,
    "role"        TEXT NOT NULL,
    "type"        "EventInviteType" NOT NULL,
    "status"      "EventInviteStatus" NOT NULL DEFAULT 'PENDING',
    "token"       TEXT NOT NULL,
    "expiresAt"   TIMESTAMP(3) NOT NULL,
    "acceptedAt"  TIMESTAMP(3),
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex Registration
CREATE INDEX IF NOT EXISTS "Registration_userId_idx"                    ON "Registration"("userId");
CREATE INDEX IF NOT EXISTS "Registration_eventId_idx"                   ON "Registration"("eventId");
CREATE INDEX IF NOT EXISTS "Registration_variantId_idx"                 ON "Registration"("variantId");
CREATE INDEX IF NOT EXISTS "Registration_status_idx"                    ON "Registration"("status");
CREATE INDEX IF NOT EXISTS "Registration_stripeCheckoutSessionId_idx"   ON "Registration"("stripeCheckoutSessionId");
CREATE UNIQUE INDEX IF NOT EXISTS "Registration_userId_eventId_variantId_key" ON "Registration"("userId", "eventId", "variantId");

-- CreateIndex EventOrganizer
CREATE INDEX IF NOT EXISTS "EventOrganizer_eventId_idx"           ON "EventOrganizer"("eventId");
CREATE INDEX IF NOT EXISTS "EventOrganizer_userId_idx"            ON "EventOrganizer"("userId");
CREATE INDEX IF NOT EXISTS "EventOrganizer_role_idx"              ON "EventOrganizer"("role");
CREATE UNIQUE INDEX IF NOT EXISTS "EventOrganizer_eventId_userId_key" ON "EventOrganizer"("eventId", "userId");

-- CreateIndex EventStaffMember
CREATE INDEX IF NOT EXISTS "EventStaffMember_eventId_idx"             ON "EventStaffMember"("eventId");
CREATE INDEX IF NOT EXISTS "EventStaffMember_userId_idx"              ON "EventStaffMember"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "EventStaffMember_eventId_userId_key" ON "EventStaffMember"("eventId", "userId");

-- CreateIndex EventInvite
CREATE UNIQUE INDEX IF NOT EXISTS "EventInvite_token_key"      ON "EventInvite"("token");
CREATE INDEX IF NOT EXISTS "EventInvite_eventId_idx"           ON "EventInvite"("eventId");
CREATE INDEX IF NOT EXISTS "EventInvite_email_idx"             ON "EventInvite"("email");
CREATE INDEX IF NOT EXISTS "EventInvite_token_idx"             ON "EventInvite"("token");
CREATE INDEX IF NOT EXISTS "EventInvite_status_idx"            ON "EventInvite"("status");
CREATE INDEX IF NOT EXISTS "EventInvite_expiresAt_idx"         ON "EventInvite"("expiresAt");

-- AddForeignKey Registration
ALTER TABLE "Registration" DROP CONSTRAINT IF EXISTS "Registration_userId_fkey";
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Registration" DROP CONSTRAINT IF EXISTS "Registration_eventId_fkey";
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey"
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Registration" DROP CONSTRAINT IF EXISTS "Registration_variantId_fkey";
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_variantId_fkey"
  FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey EventOrganizer
ALTER TABLE "EventOrganizer" DROP CONSTRAINT IF EXISTS "EventOrganizer_eventId_fkey";
ALTER TABLE "EventOrganizer" ADD CONSTRAINT "EventOrganizer_eventId_fkey"
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EventOrganizer" DROP CONSTRAINT IF EXISTS "EventOrganizer_userId_fkey";
ALTER TABLE "EventOrganizer" ADD CONSTRAINT "EventOrganizer_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EventOrganizer" DROP CONSTRAINT IF EXISTS "EventOrganizer_addedById_fkey";
ALTER TABLE "EventOrganizer" ADD CONSTRAINT "EventOrganizer_addedById_fkey"
  FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey EventStaffMember
ALTER TABLE "EventStaffMember" DROP CONSTRAINT IF EXISTS "EventStaffMember_eventId_fkey";
ALTER TABLE "EventStaffMember" ADD CONSTRAINT "EventStaffMember_eventId_fkey"
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EventStaffMember" DROP CONSTRAINT IF EXISTS "EventStaffMember_userId_fkey";
ALTER TABLE "EventStaffMember" ADD CONSTRAINT "EventStaffMember_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EventStaffMember" DROP CONSTRAINT IF EXISTS "EventStaffMember_addedById_fkey";
ALTER TABLE "EventStaffMember" ADD CONSTRAINT "EventStaffMember_addedById_fkey"
  FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey EventInvite
ALTER TABLE "EventInvite" DROP CONSTRAINT IF EXISTS "EventInvite_eventId_fkey";
ALTER TABLE "EventInvite" ADD CONSTRAINT "EventInvite_eventId_fkey"
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "EventInvite" DROP CONSTRAINT IF EXISTS "EventInvite_invitedById_fkey";
ALTER TABLE "EventInvite" ADD CONSTRAINT "EventInvite_invitedById_fkey"
  FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
