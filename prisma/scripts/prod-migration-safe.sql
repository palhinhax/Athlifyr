-- =============================================================================
-- SAFE PRODUCTION MIGRATION SCRIPT
-- Applies all 10 pending local migrations safely (IF NOT EXISTS / IF EXISTS)
-- Does NOT drop any data. Safe to run against a production DB.
-- =============================================================================

-- ─── Migration 1: 20260226150841_add_has_registrations_has_live_race_to_event ─

DO $$ BEGIN
  CREATE TYPE "AdminNoteType" AS ENUM ('EVENT', 'VENUE', 'OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "AthliMessageRole" AS ENUM ('user', 'assistant', 'system');
EXCEPTION WHEN duplicate_object THEN null; END $$;

ALTER TABLE "EventInvite"      ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "EventOrganizer"   ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "EventStaffMember" ALTER COLUMN "updatedAt" DROP DEFAULT;
ALTER TABLE "Registration"     ALTER COLUMN "updatedAt" DROP DEFAULT;

CREATE TABLE IF NOT EXISTS "AdminNote" (
    "id"         TEXT NOT NULL,
    "userId"     TEXT NOT NULL,
    "type"       "AdminNoteType" NOT NULL,
    "title"      TEXT NOT NULL,
    "message"    TEXT NOT NULL,
    "location"   TEXT,
    "date"       TEXT,
    "sportType"  TEXT,
    "url"        TEXT,
    "status"     TEXT NOT NULL DEFAULT 'pending',
    "adminNotes" TEXT,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AdminNote_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AthliConversation" (
    "id"        TEXT NOT NULL,
    "userId"    TEXT NOT NULL,
    "title"     TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AthliConversation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "AthliMessage" (
    "id"             TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role"           "AthliMessageRole" NOT NULL,
    "content"        TEXT NOT NULL,
    "metadata"       JSONB,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AthliMessage_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "PlatformKnowledge" (
    "id"        TEXT NOT NULL,
    "category"  TEXT NOT NULL,
    "slug"      TEXT NOT NULL,
    "title"     TEXT NOT NULL,
    "content"   TEXT NOT NULL,
    "language"  "Language" NOT NULL DEFAULT 'pt',
    "priority"  INTEGER NOT NULL DEFAULT 0,
    "isActive"  BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PlatformKnowledge_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "AdminNote_userId_idx"    ON "AdminNote"("userId");
CREATE INDEX IF NOT EXISTS "AdminNote_status_idx"    ON "AdminNote"("status");
CREATE INDEX IF NOT EXISTS "AdminNote_type_idx"      ON "AdminNote"("type");
CREATE INDEX IF NOT EXISTS "AdminNote_createdAt_idx" ON "AdminNote"("createdAt");

CREATE INDEX IF NOT EXISTS "AthliConversation_userId_idx"    ON "AthliConversation"("userId");
CREATE INDEX IF NOT EXISTS "AthliConversation_createdAt_idx" ON "AthliConversation"("createdAt");

CREATE INDEX IF NOT EXISTS "AthliMessage_conversationId_idx" ON "AthliMessage"("conversationId");
CREATE INDEX IF NOT EXISTS "AthliMessage_createdAt_idx"      ON "AthliMessage"("createdAt");

CREATE UNIQUE INDEX IF NOT EXISTS "PlatformKnowledge_slug_key"      ON "PlatformKnowledge"("slug");
CREATE INDEX IF NOT EXISTS        "PlatformKnowledge_category_idx"  ON "PlatformKnowledge"("category");
CREATE INDEX IF NOT EXISTS        "PlatformKnowledge_language_idx"  ON "PlatformKnowledge"("language");
CREATE INDEX IF NOT EXISTS        "PlatformKnowledge_isActive_idx"  ON "PlatformKnowledge"("isActive");

ALTER TABLE "AdminNote" DROP CONSTRAINT IF EXISTS "AdminNote_userId_fkey";
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AthliConversation" DROP CONSTRAINT IF EXISTS "AthliConversation_userId_fkey";
ALTER TABLE "AthliConversation" ADD CONSTRAINT "AthliConversation_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "AthliMessage" DROP CONSTRAINT IF EXISTS "AthliMessage_conversationId_fkey";
ALTER TABLE "AthliMessage" ADD CONSTRAINT "AthliMessage_conversationId_fkey"
  FOREIGN KEY ("conversationId") REFERENCES "AthliConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Migration 2: 20260226233042_add_registration_required_fields ─────────────

ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "requiredRegistrationFields" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "User"  ADD COLUMN IF NOT EXISTS "citizenId"    TEXT;
ALTER TABLE "User"  ADD COLUMN IF NOT EXISTS "dateOfBirth"  TIMESTAMP(3);
ALTER TABLE "User"  ADD COLUMN IF NOT EXISTS "nationality"  TEXT;

-- ─── Migration 3: 20260226234535_add_emergency_contact_fields ────────────────

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emergencyContactName"  TEXT;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "emergencyContactPhone" TEXT;

-- ─── Migration 4: 20260227000317_replace_required_fields_with_registration_field_settings ──

-- Drop old column if it exists, add new one
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'Event' AND column_name = 'requiredRegistrationFields'
  ) THEN
    ALTER TABLE "Event" DROP COLUMN "requiredRegistrationFields";
  END IF;
END $$;

ALTER TABLE "Event" ADD COLUMN IF NOT EXISTS "registrationFieldSettings" JSONB NOT NULL DEFAULT '{}';

-- ─── Migration 5: 20260227004846_add_custom_fields ───────────────────────────

DO $$ BEGIN
  CREATE TYPE "CustomFieldType" AS ENUM ('SELECT', 'BOOLEAN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

CREATE TABLE IF NOT EXISTS "EventCustomField" (
    "id"         TEXT NOT NULL,
    "eventId"    TEXT NOT NULL,
    "label"      TEXT NOT NULL,
    "type"       "CustomFieldType" NOT NULL DEFAULT 'SELECT',
    "options"    TEXT[],
    "required"   BOOLEAN NOT NULL DEFAULT false,
    "priceCents" INTEGER NOT NULL DEFAULT 0,
    "currency"   "Currency" NOT NULL DEFAULT 'EUR',
    "order"      INTEGER NOT NULL DEFAULT 0,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"  TIMESTAMP(3) NOT NULL,
    CONSTRAINT "EventCustomField_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "CustomFieldResponse" (
    "id"              TEXT NOT NULL,
    "customFieldId"   TEXT NOT NULL,
    "registrationId"  TEXT,
    "participationId" TEXT,
    "userId"          TEXT NOT NULL,
    "value"           TEXT NOT NULL,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CustomFieldResponse_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EventCustomField_eventId_idx" ON "EventCustomField"("eventId");
CREATE INDEX IF NOT EXISTS "EventCustomField_order_idx"   ON "EventCustomField"("order");

CREATE INDEX IF NOT EXISTS "CustomFieldResponse_customFieldId_idx"    ON "CustomFieldResponse"("customFieldId");
CREATE INDEX IF NOT EXISTS "CustomFieldResponse_registrationId_idx"   ON "CustomFieldResponse"("registrationId");
CREATE INDEX IF NOT EXISTS "CustomFieldResponse_participationId_idx"  ON "CustomFieldResponse"("participationId");
CREATE INDEX IF NOT EXISTS "CustomFieldResponse_userId_idx"           ON "CustomFieldResponse"("userId");

-- These unique indexes will be replaced in migration 7, but create them safely here
-- (they'll be dropped and recreated in migration 7)
CREATE UNIQUE INDEX IF NOT EXISTS "CustomFieldResponse_customFieldId_registrationId_key"
  ON "CustomFieldResponse"("customFieldId", "registrationId");
CREATE UNIQUE INDEX IF NOT EXISTS "CustomFieldResponse_customFieldId_participationId_key"
  ON "CustomFieldResponse"("customFieldId", "participationId");

ALTER TABLE "EventCustomField" DROP CONSTRAINT IF EXISTS "EventCustomField_eventId_fkey";
ALTER TABLE "EventCustomField" ADD CONSTRAINT "EventCustomField_eventId_fkey"
  FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CustomFieldResponse" DROP CONSTRAINT IF EXISTS "CustomFieldResponse_customFieldId_fkey";
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_customFieldId_fkey"
  FOREIGN KEY ("customFieldId") REFERENCES "EventCustomField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CustomFieldResponse" DROP CONSTRAINT IF EXISTS "CustomFieldResponse_registrationId_fkey";
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_registrationId_fkey"
  FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CustomFieldResponse" DROP CONSTRAINT IF EXISTS "CustomFieldResponse_participationId_fkey";
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_participationId_fkey"
  FOREIGN KEY ("participationId") REFERENCES "Participation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "CustomFieldResponse" DROP CONSTRAINT IF EXISTS "CustomFieldResponse_userId_fkey";
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Migration 6: 20260227120000_add_team_size_and_registration_team_members ──

ALTER TABLE "EventVariant" ADD COLUMN IF NOT EXISTS "teamSize" INTEGER NOT NULL DEFAULT 1;

CREATE TABLE IF NOT EXISTS "RegistrationTeamMember" (
    "id"             TEXT NOT NULL,
    "registrationId" TEXT NOT NULL,
    "name"           TEXT NOT NULL,
    "email"          TEXT,
    "dateOfBirth"    TIMESTAMP(3),
    "citizenId"      TEXT,
    "phone"          TEXT,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,
    CONSTRAINT "RegistrationTeamMember_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "RegistrationTeamMember_registrationId_idx"
  ON "RegistrationTeamMember"("registrationId");

ALTER TABLE "RegistrationTeamMember" DROP CONSTRAINT IF EXISTS "RegistrationTeamMember_registrationId_fkey";
ALTER TABLE "RegistrationTeamMember" ADD CONSTRAINT "RegistrationTeamMember_registrationId_fkey"
  FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ─── Migration 7: 20260228002559_add_participant_index_custom_field_responses ─

-- Drop old unique indexes (safe: IF EXISTS)
DROP INDEX IF EXISTS "CustomFieldResponse_customFieldId_participationId_key";
DROP INDEX IF EXISTS "CustomFieldResponse_customFieldId_registrationId_key";

ALTER TABLE "CustomFieldResponse" ADD COLUMN IF NOT EXISTS "participantIndex" INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX IF NOT EXISTS "CustomFieldResponse_customFieldId_registrationId_participan_key"
  ON "CustomFieldResponse"("customFieldId", "registrationId", "participantIndex");
CREATE UNIQUE INDEX IF NOT EXISTS "CustomFieldResponse_customFieldId_participationId_participa_key"
  ON "CustomFieldResponse"("customFieldId", "participationId", "participantIndex");

-- ─── Migration 8: 20260228004719_refactor_team_registration_model ────────────

DO $$ BEGIN
  CREATE TYPE "TeamRole" AS ENUM ('LEADER', 'MEMBER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Drop RegistrationTeamMember FK and table (created in migration 6)
ALTER TABLE "RegistrationTeamMember" DROP CONSTRAINT IF EXISTS "RegistrationTeamMember_registrationId_fkey";
DROP TABLE IF EXISTS "RegistrationTeamMember";

-- Drop old unique index on Registration
DROP INDEX IF EXISTS "Registration_userId_eventId_variantId_key";

-- Add new columns to Registration
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "guestCitizenId"            TEXT;
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "guestDateOfBirth"          TIMESTAMP(3);
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "guestEmail"                TEXT;
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "guestEmergencyContactName" TEXT;
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "guestEmergencyContactPhone" TEXT;
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "guestName"                 TEXT;
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "guestPhone"                TEXT;
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "teamGroupId"               TEXT;
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "teamMemberIndex"           INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "teamRole"                  "TeamRole";

CREATE INDEX IF NOT EXISTS "Registration_teamGroupId_idx"
  ON "Registration"("teamGroupId");

CREATE UNIQUE INDEX IF NOT EXISTS "Registration_userId_eventId_variantId_teamMemberIndex_key"
  ON "Registration"("userId", "eventId", "variantId", "teamMemberIndex");

-- ─── Migration 9: 20260228204208_add_winning_ticket_attempts_to_giveaway ─────

ALTER TABLE "Event"    ALTER COLUMN "commissionPercent" SET DEFAULT 0.0;
ALTER TABLE "Giveaway" ADD COLUMN IF NOT EXISTS "winningTicketAttempts" INTEGER[];
ALTER TABLE "Venue"    ALTER COLUMN "commissionValue" SET DEFAULT 0;

-- ─── Migration 10: 20260228223316_add_ticket_nonce_to_registration ────────────

ALTER TABLE "Registration" ADD COLUMN IF NOT EXISTS "ticketNonce" TEXT;
UPDATE "Registration" SET "ticketNonce" = gen_random_uuid()::text WHERE "ticketNonce" IS NULL;
ALTER TABLE "Registration" ALTER COLUMN "ticketNonce" SET NOT NULL;

-- =============================================================================
-- Register all 10 migrations in _prisma_migrations so Prisma thinks they ran
-- Uses DO $$ BEGIN...EXCEPTION to be safe if already inserted
-- =============================================================================

DO $$
DECLARE
  migration_names TEXT[] := ARRAY[
    '20260226150841_add_has_registrations_has_live_race_to_event',
    '20260226233042_add_registration_required_fields',
    '20260226234535_add_emergency_contact_fields',
    '20260227000317_replace_required_fields_with_registration_field_settings',
    '20260227004846_add_custom_fields',
    '20260227120000_add_team_size_and_registration_team_members',
    '20260228002559_add_participant_index_custom_field_responses',
    '20260228004719_refactor_team_registration_model',
    '20260228204208_add_winning_ticket_attempts_to_giveaway',
    '20260228223316_add_ticket_nonce_to_registration'
  ];
  mname TEXT;
BEGIN
  FOREACH mname IN ARRAY migration_names LOOP
    IF NOT EXISTS (
      SELECT 1 FROM "_prisma_migrations" WHERE "migration_name" = mname
    ) THEN
      INSERT INTO "_prisma_migrations" (
        "id",
        "checksum",
        "finished_at",
        "migration_name",
        "logs",
        "rolled_back_at",
        "started_at",
        "applied_steps_count"
      ) VALUES (
        gen_random_uuid()::text,
        'safe-consolidated-script',
        NOW(),
        mname,
        NULL,
        NULL,
        NOW(),
        1
      );
    END IF;
  END LOOP;
END $$;
