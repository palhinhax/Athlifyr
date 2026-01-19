-- CreateEnum
CREATE TYPE "VenueType" AS ENUM ('CROSSFIT_BOX', 'GYM', 'PT_STUDIO', 'MASSAGE', 'PHYSIO', 'NUTRITION', 'OTHER');

-- CreateEnum
CREATE TYPE "VenueRole" AS ENUM ('OWNER', 'ADMIN', 'COACH', 'CLIENT');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'LEFT');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('CLASS', 'APPOINTMENT');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('BOOKED', 'CANCELLED', 'NO_SHOW', 'ATTENDED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('IN_APP', 'EXTERNAL', 'MIXED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('IN_APP', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'NOT_REQUIRED');

-- CreateEnum
CREATE TYPE "PaymentIntentStatus" AS ENUM ('CREATED', 'CONFIRMED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "VenueType" NOT NULL,
    "sportTypes" "SportType"[],
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Portugal',
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "paymentMode" "PaymentMode" NOT NULL DEFAULT 'MIXED',
    "externalPaymentInstructions" TEXT,
    "createdByUserId" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueMember" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "VenueRole" NOT NULL,
    "status" "MemberStatus" NOT NULL DEFAULT 'PENDING',
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueInvite" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "invitedUserId" TEXT,
    "invitedEmail" TEXT,
    "invitedByUserId" TEXT NOT NULL,
    "role" "VenueRole" NOT NULL,
    "token" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenuePlan" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "paymentProvider" "PaymentProvider" NOT NULL DEFAULT 'IN_APP',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "policy" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenuePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueSubscription" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
    "activatedByUserId" TEXT,
    "activatedAt" TIMESTAMP(3),
    "paymentMethod" TEXT,
    "paymentAmount" DOUBLE PRECISION,
    "paymentNote" TEXT,
    "paymentConfirmedAt" TIMESTAMP(3),
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueSession" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "type" "SessionType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "capacity" INTEGER,
    "coachId" TEXT,
    "serviceId" TEXT,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueBooking" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'BOOKED',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentIntent" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "status" "PaymentIntentStatus" NOT NULL DEFAULT 'CREATED',
    "provider" TEXT NOT NULL DEFAULT 'INTERNAL_MVP',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentIntent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Venue_slug_key" ON "Venue"("slug");

-- CreateIndex
CREATE INDEX "Venue_slug_idx" ON "Venue"("slug");

-- CreateIndex
CREATE INDEX "Venue_type_idx" ON "Venue"("type");

-- CreateIndex
CREATE INDEX "Venue_city_idx" ON "Venue"("city");

-- CreateIndex
CREATE INDEX "Venue_isActive_idx" ON "Venue"("isActive");

-- CreateIndex
CREATE INDEX "Venue_createdByUserId_idx" ON "Venue"("createdByUserId");

-- CreateIndex
CREATE INDEX "Venue_sportTypes_idx" ON "Venue"("sportTypes");

-- CreateIndex
CREATE INDEX "VenueMember_venueId_idx" ON "VenueMember"("venueId");

-- CreateIndex
CREATE INDEX "VenueMember_userId_idx" ON "VenueMember"("userId");

-- CreateIndex
CREATE INDEX "VenueMember_status_idx" ON "VenueMember"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VenueMember_venueId_userId_key" ON "VenueMember"("venueId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueInvite_token_key" ON "VenueInvite"("token");

-- CreateIndex
CREATE INDEX "VenueInvite_venueId_idx" ON "VenueInvite"("venueId");

-- CreateIndex
CREATE INDEX "VenueInvite_invitedUserId_idx" ON "VenueInvite"("invitedUserId");

-- CreateIndex
CREATE INDEX "VenueInvite_invitedEmail_idx" ON "VenueInvite"("invitedEmail");

-- CreateIndex
CREATE INDEX "VenueInvite_token_idx" ON "VenueInvite"("token");

-- CreateIndex
CREATE INDEX "VenueInvite_status_idx" ON "VenueInvite"("status");

-- CreateIndex
CREATE INDEX "VenuePlan_venueId_idx" ON "VenuePlan"("venueId");

-- CreateIndex
CREATE INDEX "VenuePlan_isActive_idx" ON "VenuePlan"("isActive");

-- CreateIndex
CREATE INDEX "VenueSubscription_venueId_idx" ON "VenueSubscription"("venueId");

-- CreateIndex
CREATE INDEX "VenueSubscription_userId_idx" ON "VenueSubscription"("userId");

-- CreateIndex
CREATE INDEX "VenueSubscription_planId_idx" ON "VenueSubscription"("planId");

-- CreateIndex
CREATE INDEX "VenueSubscription_status_idx" ON "VenueSubscription"("status");

-- CreateIndex
CREATE INDEX "VenueSubscription_paymentStatus_idx" ON "VenueSubscription"("paymentStatus");

-- CreateIndex
CREATE INDEX "VenueSession_venueId_idx" ON "VenueSession"("venueId");

-- CreateIndex
CREATE INDEX "VenueSession_type_idx" ON "VenueSession"("type");

-- CreateIndex
CREATE INDEX "VenueSession_startsAt_idx" ON "VenueSession"("startsAt");

-- CreateIndex
CREATE INDEX "VenueSession_coachId_idx" ON "VenueSession"("coachId");

-- CreateIndex
CREATE INDEX "VenueBooking_venueId_idx" ON "VenueBooking"("venueId");

-- CreateIndex
CREATE INDEX "VenueBooking_sessionId_idx" ON "VenueBooking"("sessionId");

-- CreateIndex
CREATE INDEX "VenueBooking_userId_idx" ON "VenueBooking"("userId");

-- CreateIndex
CREATE INDEX "VenueBooking_status_idx" ON "VenueBooking"("status");

-- CreateIndex
CREATE INDEX "VenueBooking_createdAt_idx" ON "VenueBooking"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VenueBooking_sessionId_userId_key" ON "VenueBooking"("sessionId", "userId");

-- CreateIndex
CREATE INDEX "PaymentIntent_venueId_idx" ON "PaymentIntent"("venueId");

-- CreateIndex
CREATE INDEX "PaymentIntent_userId_idx" ON "PaymentIntent"("userId");

-- CreateIndex
CREATE INDEX "PaymentIntent_planId_idx" ON "PaymentIntent"("planId");

-- CreateIndex
CREATE INDEX "PaymentIntent_status_idx" ON "PaymentIntent"("status");

-- CreateIndex
CREATE INDEX "PaymentIntent_createdAt_idx" ON "PaymentIntent"("createdAt");

-- AddForeignKey
ALTER TABLE "VenueMember" ADD CONSTRAINT "VenueMember_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueMember" ADD CONSTRAINT "VenueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueInvite" ADD CONSTRAINT "VenueInvite_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenuePlan" ADD CONSTRAINT "VenuePlan_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSubscription" ADD CONSTRAINT "VenueSubscription_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSubscription" ADD CONSTRAINT "VenueSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSubscription" ADD CONSTRAINT "VenueSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "VenuePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSession" ADD CONSTRAINT "VenueSession_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBooking" ADD CONSTRAINT "VenueBooking_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBooking" ADD CONSTRAINT "VenueBooking_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VenueSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBooking" ADD CONSTRAINT "VenueBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
