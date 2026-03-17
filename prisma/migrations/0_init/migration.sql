-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- CreateEnum
CREATE TYPE "CheckpointType" AS ENUM ('START', 'FINISH', 'INTERMEDIATE', 'TRANSITION');

-- CreateEnum
CREATE TYPE "CustomFieldType" AS ENUM ('SELECT', 'BOOLEAN');

-- CreateEnum
CREATE TYPE "AdminNoteType" AS ENUM ('EVENT', 'VENUE', 'OTHER');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('FRIEND_REQUEST', 'FRIEND_ACCEPTED', 'TRIAL_REQUEST', 'TRIAL_ACCEPTED', 'TRIAL_REJECTED', 'EVENT_DATE_CHANGE', 'EVENT_CANCELLED', 'EVENT_NEW_POST', 'EVENT_POST_COMMENT', 'VENUE_INVITE', 'VENUE_INVITE_ACCEPTED', 'CHAT_MESSAGE', 'ADMIN_ANNOUNCEMENT', 'GIVEAWAY_WON');

-- CreateEnum
CREATE TYPE "SportType" AS ENUM ('RUNNING', 'TRAIL', 'HYROX', 'CROSSFIT', 'OCR', 'BTT', 'CYCLING', 'SURF', 'TRIATHLON', 'SWIMMING', 'OTHER', 'WALKING');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('pt', 'en', 'es', 'fr', 'de', 'it');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'GBP', 'USD', 'CHF');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('LEADER', 'MEMBER');

-- CreateEnum
CREATE TYPE "EventStripeOnboardingStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'COMPLETE', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "EventLiveStatus" AS ENUM ('SCHEDULED', 'CHECK_IN_OPEN', 'WARMUP', 'LIVE', 'PAUSED', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "EventOrganizerRole" AS ENUM ('OWNER', 'ADMIN', 'FINANCE');

-- CreateEnum
CREATE TYPE "EventStaffRole" AS ENUM ('STAFF', 'CHECKIN_ONLY', 'STREAM_ONLY');

-- CreateEnum
CREATE TYPE "EventInviteType" AS ENUM ('ORGANIZER', 'STAFF');

-- CreateEnum
CREATE TYPE "EventInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TriathlonSegmentType" AS ENUM ('SWIM', 'BIKE', 'RUN');

-- CreateEnum
CREATE TYPE "TriathlonTerrainType" AS ENUM ('POOL', 'OPEN_WATER', 'ROAD', 'TRAIL', 'MIXED');

-- CreateEnum
CREATE TYPE "VenueType" AS ENUM ('CROSSFIT_BOX', 'CROSSTRAINING_BOX', 'GYM', 'PT_STUDIO', 'MASSAGE', 'PHYSIO', 'NUTRITION', 'OTHER');

-- CreateEnum
CREATE TYPE "VenueService" AS ENUM ('CROSSFIT', 'HYROX', 'WEIGHTLIFTING', 'POWERLIFTING', 'OLYMPIC_LIFTING', 'FUNCTIONAL_FITNESS', 'PERSONAL_TRAINING', 'GROUP_CLASSES', 'OPEN_GYM', 'MASSAGE', 'PHYSIOTHERAPY', 'NUTRITION', 'YOGA', 'PILATES', 'BOXING', 'KICKBOXING', 'MMA', 'BJJ', 'RECOVERY', 'SAUNA', 'COLD_PLUNGE', 'OTHER');

-- CreateEnum
CREATE TYPE "VenueRole" AS ENUM ('OWNER', 'ADMIN', 'COACH', 'CLIENT');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'LEFT');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "VenueOwnershipClaimStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('CLASS', 'APPOINTMENT');

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('NORMAL', 'TRIAL');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'BOOKED', 'CANCELLED', 'NO_SHOW', 'ATTENDED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentMode" AS ENUM ('IN_APP', 'EXTERNAL', 'MIXED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'NOT_REQUIRED');

-- CreateEnum
CREATE TYPE "PaymentIntentStatus" AS ENUM ('CREATED', 'CONFIRMED', 'FAILED', 'CANCELLED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentsProvider" AS ENUM ('NONE', 'STRIPE');

-- CreateEnum
CREATE TYPE "StripeOnboardingStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'COMPLETE', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "CommissionType" AS ENUM ('PERCENT', 'FIXED');

-- CreateEnum
CREATE TYPE "FriendshipStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LiveRaceVisibility" AS ENUM ('PUBLIC', 'FRIENDS', 'ORGANIZER_ONLY');

-- CreateEnum
CREATE TYPE "InstagramFormat" AS ENUM ('SQUARE', 'PORTRAIT', 'STORY');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('SUGGESTION', 'BUG', 'QUESTION', 'FEEDBACK', 'OTHER');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('SPAM', 'HARASSMENT', 'INAPPROPRIATE_CONTENT', 'FAKE_ACCOUNT', 'SCAM', 'OTHER');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "PerformanceEntryType" AS ENUM ('RUN', 'TRAIL', 'STRENGTH', 'HYROX');

-- CreateEnum
CREATE TYPE "HyroxCategory" AS ENUM ('OPEN_MEN', 'OPEN_WOMEN', 'PRO_MEN', 'PRO_WOMEN', 'ELITE_15_MEN', 'ELITE_15_WOMEN', 'DOUBLES_MEN', 'DOUBLES_WOMEN', 'DOUBLES_MIXED', 'RELAY_MEN', 'RELAY_WOMEN', 'RELAY_MIXED', 'AGE_GROUP_16_29_MEN', 'AGE_GROUP_16_29_WOMEN', 'AGE_GROUP_30_34_MEN', 'AGE_GROUP_30_34_WOMEN', 'AGE_GROUP_35_39_MEN', 'AGE_GROUP_35_39_WOMEN', 'AGE_GROUP_40_44_MEN', 'AGE_GROUP_40_44_WOMEN', 'AGE_GROUP_45_49_MEN', 'AGE_GROUP_45_49_WOMEN', 'AGE_GROUP_50_54_MEN', 'AGE_GROUP_50_54_WOMEN', 'AGE_GROUP_55_59_MEN', 'AGE_GROUP_55_59_WOMEN', 'AGE_GROUP_60_64_MEN', 'AGE_GROUP_60_64_WOMEN', 'AGE_GROUP_65_69_MEN', 'AGE_GROUP_65_69_WOMEN', 'AGE_GROUP_70_PLUS_MEN', 'AGE_GROUP_70_PLUS_WOMEN', 'ADAPTIVE');

-- CreateEnum
CREATE TYPE "ExerciseCategory" AS ENUM ('CROSSFIT', 'GYM', 'WEIGHTLIFTING', 'BODYWEIGHT', 'CARDIO', 'OTHER');

-- CreateEnum
CREATE TYPE "WorkoutBlockType" AS ENUM ('WARMUP', 'STRENGTH', 'AMRAP', 'EMOM', 'FOR_TIME', 'TABATA', 'CHIPPER', 'REST', 'COOLDOWN', 'SKILL');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('STANDARD', 'WOD', 'EVENT', 'ACHIEVEMENT');

-- CreateEnum
CREATE TYPE "TrainingPlanStatus" AS ENUM ('ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "WeightUnit" AS ENUM ('KG', 'LB');

-- CreateEnum
CREATE TYPE "DistanceUnit" AS ENUM ('M', 'KM', 'MI', 'FT');

-- CreateEnum
CREATE TYPE "GiveawayStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'DRAWING', 'DRAWN', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GiveawayPlatform" AS ENUM ('ALL', 'MOBILE', 'ANDROID', 'IOS');

-- CreateEnum
CREATE TYPE "AthliMessageRole" AS ENUM ('user', 'assistant', 'system');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "favoriteSports" "SportType"[],
    "locale" TEXT NOT NULL DEFAULT 'pt',
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
    "pushNotificationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isProAccount" BOOLEAN NOT NULL DEFAULT false,
    "liveRaceVisibility" "LiveRaceVisibility" NOT NULL DEFAULT 'PUBLIC',
    "dateOfBirth" TIMESTAMP(3),
    "citizenId" TEXT,
    "nationality" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "stripeCustomerId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'Portugal',
    "imageUrl" TEXT,
    "externalUrl" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "cancelled" BOOLEAN NOT NULL DEFAULT false,
    "cancelledAt" TIMESTAMP(3),
    "cancellationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sportTypes" "SportType"[],
    "registrationDeadline" TIMESTAMP(3),
    "googleMapsUrl" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "stravaRouteEmbed" TEXT,
    "featuredVenueId" TEXT,
    "hasRegistrations" BOOLEAN NOT NULL DEFAULT false,
    "hasLiveRace" BOOLEAN NOT NULL DEFAULT false,
    "stripeAccountId" TEXT,
    "stripeChargesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "stripeDetailsSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "stripePayoutsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "stripeLastWebhookAt" TIMESTAMP(3),
    "stripeOnboardingStatus" "EventStripeOnboardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "commissionPercent" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "commissionFixed" INTEGER NOT NULL DEFAULT 0,
    "refundDeadline" TIMESTAMP(3),
    "checkInOpensAt" TIMESTAMP(3),
    "checkInClosesAt" TIMESTAMP(3),
    "registrationFieldSettings" JSONB NOT NULL DEFAULT '{}',
    "liveStatus" "EventLiveStatus" NOT NULL DEFAULT 'SCHEDULED',

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTranslation" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "city" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFAQ" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventFAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventFAQTranslation" (
    "id" TEXT NOT NULL,
    "faqId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventFAQTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventVariant" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "maxParticipants" INTEGER,
    "description" TEXT,
    "teamSize" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "distanceKm" DOUBLE PRECISION,
    "startDate" TIMESTAMP(3),
    "startTime" TEXT,
    "atrpGrade" INTEGER,
    "cutoffTimeHours" DOUBLE PRECISION,
    "elevationGainM" INTEGER,
    "elevationLossM" INTEGER,
    "itraPoints" INTEGER,
    "mountainLevel" INTEGER,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',

    CONSTRAINT "EventVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRoute" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "gpxData" TEXT,
    "routePoints" JSONB NOT NULL DEFAULT '[]',
    "distanceKm" DOUBLE PRECISION,
    "elevationGainM" INTEGER,
    "elevationLossM" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRoute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RouteCheckpoint" (
    "id" TEXT NOT NULL,
    "routeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CheckpointType" NOT NULL DEFAULT 'INTERMEDIATE',
    "order" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "radiusM" INTEGER NOT NULL DEFAULT 50,
    "cutoffMin" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RouteCheckpoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventVariantTranslation" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventVariantTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TriathlonSegment" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "segmentType" "TriathlonSegmentType" NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "terrainType" "TriathlonTerrainType" NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TriathlonSegment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingPhase" (
    "id" TEXT NOT NULL,
    "eventId" TEXT,
    "variantId" TEXT,
    "name" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discountPercent" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',

    CONSTRAINT "PricingPhase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Participation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "variantId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'going',
    "completionTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Participation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Registration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "bibNumber" TEXT,
    "checkedInAt" TIMESTAMP(3),
    "ticketNonce" TEXT NOT NULL,
    "paymentProvider" TEXT NOT NULL DEFAULT 'STRIPE',
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "amountCents" INTEGER NOT NULL,
    "feeCents" INTEGER,
    "netCents" INTEGER,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "teamGroupId" TEXT,
    "teamRole" "TeamRole",
    "teamMemberIndex" INTEGER NOT NULL DEFAULT 0,
    "guestName" TEXT,
    "guestEmail" TEXT,
    "guestPhone" TEXT,
    "guestDateOfBirth" TIMESTAMP(3),
    "guestCitizenId" TEXT,
    "guestEmergencyContactName" TEXT,
    "guestEmergencyContactPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Registration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventCustomField" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "CustomFieldType" NOT NULL DEFAULT 'SELECT',
    "options" TEXT[],
    "required" BOOLEAN NOT NULL DEFAULT false,
    "priceCents" INTEGER NOT NULL DEFAULT 0,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventCustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFieldResponse" (
    "id" TEXT NOT NULL,
    "customFieldId" TEXT NOT NULL,
    "registrationId" TEXT,
    "participationId" TEXT,
    "userId" TEXT NOT NULL,
    "participantIndex" INTEGER NOT NULL DEFAULT 0,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomFieldResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventOrganizer" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "EventOrganizerRole" NOT NULL DEFAULT 'ADMIN',
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventOrganizer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventStaffMember" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "EventStaffRole" NOT NULL DEFAULT 'STAFF',
    "addedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventStaffMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventInvite" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "type" "EventInviteType" NOT NULL,
    "status" "EventInviteStatus" NOT NULL DEFAULT 'PENDING',
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventInvite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "variantId" TEXT,
    "time" TEXT NOT NULL,
    "timeSeconds" INTEGER,
    "position" INTEGER,
    "categoryPosition" INTEGER,
    "notes" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "mediaType" TEXT DEFAULT 'image',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isAutoPost" BOOLEAN NOT NULL DEFAULT false,
    "venueId" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "workoutId" TEXT,
    "sessionId" TEXT,
    "postType" "PostType" NOT NULL DEFAULT 'STANDARD',

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostComment" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostLike" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfilePhoto" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProfilePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friendship" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "status" "FriendshipStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friendship_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InstagramPostDraft" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "templateKey" TEXT NOT NULL,
    "format" "InstagramFormat" NOT NULL DEFAULT 'SQUARE',
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstagramPostDraft_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'other',
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AdminNoteType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "location" TEXT,
    "date" TEXT,
    "sportType" TEXT,
    "url" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "adminNotes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MapPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sports" "SportType"[],
    "distanceRadius" INTEGER,
    "dateRange" TEXT,
    "centerLat" DOUBLE PRECISION,
    "centerLng" DOUBLE PRECISION,
    "zoom" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MapPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnonymousMapPreferences" (
    "id" TEXT NOT NULL,
    "anonymousId" TEXT NOT NULL,
    "sports" "SportType"[],
    "distanceRadius" INTEGER,
    "dateRange" TEXT,
    "centerLat" DOUBLE PRECISION,
    "centerLng" DOUBLE PRECISION,
    "zoom" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnonymousMapPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventsPreferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sports" "SportType"[],
    "distanceRadius" INTEGER,
    "dateRange" TEXT,
    "searchQuery" TEXT,
    "userLat" DOUBLE PRECISION,
    "userLng" DOUBLE PRECISION,
    "locationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventsPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnonymousEventsPreferences" (
    "id" TEXT NOT NULL,
    "anonymousId" TEXT NOT NULL,
    "sports" "SportType"[],
    "distanceRadius" INTEGER,
    "dateRange" TEXT,
    "searchQuery" TEXT,
    "userLat" DOUBLE PRECISION,
    "userLng" DOUBLE PRECISION,
    "locationEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastAccessedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnonymousEventsPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Venue" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "VenueType" NOT NULL,
    "sportTypes" "SportType"[],
    "services" "VenueService"[] DEFAULT ARRAY[]::"VenueService"[],
    "description" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "instagram" TEXT,
    "whatsapp" TEXT,
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
    "coverImage" TEXT,
    "logo" TEXT,
    "defaultBookingAdvanceDays" INTEGER NOT NULL DEFAULT 4,
    "defaultBookingDeadlineMinutes" INTEGER NOT NULL DEFAULT 0,
    "defaultCancellationDeadlineMinutes" INTEGER NOT NULL DEFAULT 30,
    "defaultSessionCapacity" INTEGER,
    "commissionType" "CommissionType" NOT NULL DEFAULT 'PERCENT',
    "commissionValue" INTEGER NOT NULL DEFAULT 0,
    "paymentsProvider" "PaymentsProvider" NOT NULL DEFAULT 'NONE',
    "stripeAccountId" TEXT,
    "stripeChargesEnabled" BOOLEAN NOT NULL DEFAULT false,
    "stripeDetailsSubmitted" BOOLEAN NOT NULL DEFAULT false,
    "stripeLastWebhookAt" TIMESTAMP(3),
    "stripeOnboardingStatus" "StripeOnboardingStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "stripePayoutsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "requiresPlanToBook" BOOLEAN NOT NULL DEFAULT true,
    "enableTrialBooking" BOOLEAN NOT NULL DEFAULT false,
    "visibleTabs" TEXT[] DEFAULT ARRAY['feed', 'about', 'plans', 'sessions', 'team', 'clients', 'subscriptions']::TEXT[],

    CONSTRAINT "Venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueImage" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueTranslation" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueTranslation_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "VenueOwnershipClaim" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "VenueOwnershipClaimStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "adminNotes" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueOwnershipClaim_pkey" PRIMARY KEY ("id")
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
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "policy" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenuePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenuePlanVenue" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VenuePlanVenue_pkey" PRIMARY KEY ("id")
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
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeCurrentPeriodEnd" TIMESTAMP(3),

    CONSTRAINT "VenueSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueRecurringSession" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "type" "SessionType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "capacity" INTEGER,
    "coachId" TEXT,
    "serviceId" TEXT,
    "tags" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "generatedUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "bookingAdvanceDays" INTEGER NOT NULL DEFAULT 4,
    "bookingDeadlineMinutes" INTEGER NOT NULL DEFAULT 0,
    "cancellationDeadlineMinutes" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "VenueRecurringSession_pkey" PRIMARY KEY ("id")
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
    "recurringSessionId" TEXT,
    "bookingAdvanceDays" INTEGER NOT NULL DEFAULT 4,
    "bookingDeadlineMinutes" INTEGER NOT NULL DEFAULT 0,
    "cancellationDeadlineMinutes" INTEGER NOT NULL DEFAULT 30,

    CONSTRAINT "VenueSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueBooking" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT,
    "subscriptionId" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'BOOKED',
    "bookingType" "BookingType" NOT NULL DEFAULT 'NORMAL',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "guestEmail" TEXT,
    "guestName" TEXT,
    "guestPhone" TEXT,
    "isEasyBooking" BOOLEAN NOT NULL DEFAULT false,
    "addedByStaff" BOOLEAN NOT NULL DEFAULT false,
    "addedByUserId" TEXT,

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
    "confirmedAt" TIMESTAMP(3),
    "stripePaymentIntentId" TEXT,

    CONSTRAINT "PaymentIntent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueProduct" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "stock" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueProductPurchase" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "currency" "Currency" NOT NULL DEFAULT 'EUR',
    "status" "PaymentIntentStatus" NOT NULL DEFAULT 'CREATED',
    "stripePaymentIntentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "confirmedAt" TIMESTAMP(3),

    CONSTRAINT "VenueProductPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventWeather" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "condition" TEXT NOT NULL,
    "humidity" INTEGER,
    "windSpeed" DOUBLE PRECISION,
    "icon" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventWeather_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueRecommendation" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VenueRecommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueReview" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueReviewReply" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VenueReviewReply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "stripeEventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "accountId" TEXT,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationParticipant" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "deviceId" TEXT,
    "deviceName" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "data" JSONB,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserReport" (
    "id" TEXT NOT NULL,
    "reporterId" TEXT NOT NULL,
    "reportedId" TEXT NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "details" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserBlock" (
    "id" TEXT NOT NULL,
    "blockerId" TEXT NOT NULL,
    "blockedId" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPerformanceEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "PerformanceEntryType" NOT NULL,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "distanceKm" DOUBLE PRECISION,
    "timeSeconds" INTEGER,
    "elevationGainM" INTEGER,
    "exerciseId" TEXT,
    "weightKg" DOUBLE PRECISION,
    "reps" INTEGER,
    "hyroxCategory" "HyroxCategory",
    "eventName" TEXT,
    "location" TEXT,
    "resultId" TEXT,
    "workoutExerciseResultId" TEXT,
    "workoutExerciseSetId" TEXT,
    "qualityScore" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "predictionWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "runActivityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPerformanceEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" "ExerciseCategory" NOT NULL DEFAULT 'OTHER',
    "effortScore" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "createdById" TEXT,
    "isGlobal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hasReps" BOOLEAN NOT NULL DEFAULT true,
    "hasWeight" BOOLEAN NOT NULL DEFAULT false,
    "hasDistance" BOOLEAN NOT NULL DEFAULT false,
    "hasTime" BOOLEAN NOT NULL DEFAULT false,
    "hasCalories" BOOLEAN NOT NULL DEFAULT false,
    "hasHeight" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseTranslation" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExerciseTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Workout" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdById" TEXT NOT NULL,
    "venueId" TEXT,
    "estimatedTime" INTEGER,
    "difficulty" INTEGER,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Workout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutBlock" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "type" "WorkoutBlockType" NOT NULL,
    "name" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "timeCap" INTEGER,
    "workTime" INTEGER,
    "rounds" INTEGER,
    "notes" TEXT,

    CONSTRAINT "WorkoutBlock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseGroup" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "name" TEXT,
    "orderIndex" INTEGER NOT NULL,
    "rounds" INTEGER NOT NULL DEFAULT 1,
    "restBetweenRounds" INTEGER,
    "notes" TEXT,

    CONSTRAINT "ExerciseGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutBlockExercise" (
    "id" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "groupId" TEXT,
    "exerciseId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "prescribedReps" INTEGER,
    "prescribedWeight" DOUBLE PRECISION,
    "prescribedWeightUnit" "WeightUnit",
    "prescribedWeightPercent" DOUBLE PRECISION,
    "prescribedDistance" DOUBLE PRECISION,
    "prescribedDistanceUnit" "DistanceUnit",
    "prescribedTime" INTEGER,
    "prescribedCalories" INTEGER,
    "prescribedSets" INTEGER,
    "prescribedRepsFemale" INTEGER,
    "prescribedWeightFemale" DOUBLE PRECISION,
    "prescribedWeightUnitFemale" "WeightUnit",
    "prescribedWeightPercentFemale" DOUBLE PRECISION,
    "prescribedDistanceFemale" DOUBLE PRECISION,
    "prescribedDistanceUnitFemale" "DistanceUnit",
    "prescribedTimeFemale" INTEGER,
    "prescribedCaloriesFemale" INTEGER,
    "prescribedSetsFemale" INTEGER,
    "notes" TEXT,

    CONSTRAINT "WorkoutBlockExercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSetPrescription" (
    "id" TEXT NOT NULL,
    "blockExerciseId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "reps" INTEGER,
    "weight" DOUBLE PRECISION,
    "weightUnit" "WeightUnit",
    "weightPercent" DOUBLE PRECISION,
    "time" INTEGER,
    "distance" DOUBLE PRECISION,
    "distanceUnit" "DistanceUnit",
    "calories" INTEGER,
    "repsFemale" INTEGER,
    "weightFemale" DOUBLE PRECISION,
    "weightUnitFemale" "WeightUnit",
    "weightPercentFemale" DOUBLE PRECISION,
    "timeFemale" INTEGER,
    "distanceFemale" DOUBLE PRECISION,
    "distanceUnitFemale" "DistanceUnit",
    "caloriesFemale" INTEGER,
    "notes" TEXT,

    CONSTRAINT "WorkoutSetPrescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueSessionWorkout" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,

    CONSTRAINT "VenueSessionWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserWorkout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "assignedById" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "sessionId" TEXT,
    "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "feeling" INTEGER,
    "perceivedEffort" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutBlockResult" (
    "id" TEXT NOT NULL,
    "logId" TEXT NOT NULL,
    "blockId" TEXT NOT NULL,
    "completedRounds" INTEGER,
    "extraReps" INTEGER,
    "completedTime" INTEGER,
    "completedInTime" BOOLEAN,
    "notes" TEXT,

    CONSTRAINT "WorkoutBlockResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutExerciseResult" (
    "id" TEXT NOT NULL,
    "blockResultId" TEXT NOT NULL,
    "blockExerciseId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "actualReps" INTEGER,
    "actualWeight" DOUBLE PRECISION,
    "actualWeightUnit" "WeightUnit",
    "actualDistance" DOUBLE PRECISION,
    "actualDistanceUnit" "DistanceUnit",
    "actualTime" INTEGER,
    "actualCalories" INTEGER,
    "isPR" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "WorkoutExerciseResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutExerciseSet" (
    "id" TEXT NOT NULL,
    "exerciseResultId" TEXT NOT NULL,
    "setNumber" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "weightUnit" "WeightUnit" NOT NULL,
    "isPR" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,

    CONSTRAINT "WorkoutExerciseSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "createdById" TEXT NOT NULL,
    "venueId" TEXT,
    "duration" INTEGER,
    "difficulty" INTEGER,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isTemplate" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT,
    "targetAudience" TEXT,
    "goals" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPlanTranslation" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,

    CONSTRAINT "TrainingPlanTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPlanWeek" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "orderIndex" INTEGER NOT NULL,

    CONSTRAINT "TrainingPlanWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrainingPlanWorkout" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "TrainingPlanWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserTrainingPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "assignedById" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "currentWeek" INTEGER NOT NULL DEFAULT 1,
    "status" "TrainingPlanStatus" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedWorkout" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedWorkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedTrainingPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedTrainingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueSessionPlan" (
    "id" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "currentWeek" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,

    CONSTRAINT "VenueSessionPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MotionAnalysisRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "localId" TEXT NOT NULL,
    "label" TEXT,
    "videoUrl" TEXT NOT NULL,
    "videoB2Key" TEXT NOT NULL,
    "analysisJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MotionAnalysisRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiftAnalysisRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "localId" TEXT NOT NULL,
    "label" TEXT,
    "videoUrl" TEXT NOT NULL,
    "videoB2Key" TEXT NOT NULL,
    "analysisJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LiftAnalysisRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiAnalysisUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiAnalysisUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Giveaway" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "status" "GiveawayStatus" NOT NULL DEFAULT 'DRAFT',
    "platform" "GiveawayPlatform" NOT NULL DEFAULT 'ALL',
    "drawAt" TIMESTAMP(3),
    "drawnAt" TIMESTAMP(3),
    "prizeCount" INTEGER NOT NULL DEFAULT 1,
    "maxWinnersPerUser" INTEGER NOT NULL DEFAULT 1,
    "secret" TEXT,
    "secretHash" TEXT,
    "secretRevealed" TEXT,
    "finalParticipantsCount" INTEGER,
    "winningTicketNumbers" INTEGER[],
    "winningTicketAttempts" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Giveaway_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiveawayTranslation" (
    "id" TEXT NOT NULL,
    "giveawayId" TEXT NOT NULL,
    "lang" "Language" NOT NULL,
    "title" TEXT NOT NULL,
    "details" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GiveawayTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiveawayParticipation" (
    "id" TEXT NOT NULL,
    "giveawayId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ticketNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiveawayParticipation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GiveawayWinner" (
    "id" TEXT NOT NULL,
    "giveawayId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiveawayWinner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AthliConversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AthliConversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AthliMessage" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "AthliMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AthliMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RunActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3) NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "distanceM" INTEGER NOT NULL,
    "avgPaceMinKm" DOUBLE PRECISION,
    "maxSpeedKmh" DOUBLE PRECISION,
    "elevationGainM" INTEGER NOT NULL DEFAULT 0,
    "elevationLossM" INTEGER NOT NULL DEFAULT 0,
    "track" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RunActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlatformKnowledge" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "language" "Language" NOT NULL DEFAULT 'pt',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformKnowledge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_stripeCustomerId_key" ON "User"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_token_key" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE INDEX "PasswordResetToken_email_idx" ON "PasswordResetToken"("email");

-- CreateIndex
CREATE INDEX "PasswordResetToken_token_idx" ON "PasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_sportTypes_idx" ON "Event"("sportTypes");

-- CreateIndex
CREATE INDEX "Event_startDate_idx" ON "Event"("startDate");

-- CreateIndex
CREATE INDEX "Event_city_idx" ON "Event"("city");

-- CreateIndex
CREATE INDEX "Event_isFeatured_idx" ON "Event"("isFeatured");

-- CreateIndex
CREATE INDEX "Event_slug_idx" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_featuredVenueId_idx" ON "Event"("featuredVenueId");

-- CreateIndex
CREATE INDEX "Event_hasRegistrations_idx" ON "Event"("hasRegistrations");

-- CreateIndex
CREATE INDEX "Event_hasLiveRace_idx" ON "Event"("hasLiveRace");

-- CreateIndex
CREATE INDEX "EventTranslation_eventId_idx" ON "EventTranslation"("eventId");

-- CreateIndex
CREATE INDEX "EventTranslation_language_idx" ON "EventTranslation"("language");

-- CreateIndex
CREATE INDEX "EventTranslation_title_idx" ON "EventTranslation"("title");

-- CreateIndex
CREATE UNIQUE INDEX "EventTranslation_eventId_language_key" ON "EventTranslation"("eventId", "language");

-- CreateIndex
CREATE INDEX "EventFAQ_eventId_idx" ON "EventFAQ"("eventId");

-- CreateIndex
CREATE INDEX "EventFAQ_order_idx" ON "EventFAQ"("order");

-- CreateIndex
CREATE INDEX "EventFAQTranslation_faqId_idx" ON "EventFAQTranslation"("faqId");

-- CreateIndex
CREATE INDEX "EventFAQTranslation_language_idx" ON "EventFAQTranslation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "EventFAQTranslation_faqId_language_key" ON "EventFAQTranslation"("faqId", "language");

-- CreateIndex
CREATE INDEX "EventVariant_eventId_idx" ON "EventVariant"("eventId");

-- CreateIndex
CREATE INDEX "EventVariant_startDate_idx" ON "EventVariant"("startDate");

-- CreateIndex
CREATE UNIQUE INDEX "EventRoute_variantId_key" ON "EventRoute"("variantId");

-- CreateIndex
CREATE INDEX "EventRoute_variantId_idx" ON "EventRoute"("variantId");

-- CreateIndex
CREATE INDEX "RouteCheckpoint_routeId_idx" ON "RouteCheckpoint"("routeId");

-- CreateIndex
CREATE INDEX "RouteCheckpoint_routeId_order_idx" ON "RouteCheckpoint"("routeId", "order");

-- CreateIndex
CREATE INDEX "EventVariantTranslation_variantId_idx" ON "EventVariantTranslation"("variantId");

-- CreateIndex
CREATE INDEX "EventVariantTranslation_language_idx" ON "EventVariantTranslation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "EventVariantTranslation_variantId_language_key" ON "EventVariantTranslation"("variantId", "language");

-- CreateIndex
CREATE INDEX "TriathlonSegment_variantId_idx" ON "TriathlonSegment"("variantId");

-- CreateIndex
CREATE INDEX "TriathlonSegment_order_idx" ON "TriathlonSegment"("order");

-- CreateIndex
CREATE INDEX "PricingPhase_eventId_idx" ON "PricingPhase"("eventId");

-- CreateIndex
CREATE INDEX "PricingPhase_variantId_idx" ON "PricingPhase"("variantId");

-- CreateIndex
CREATE INDEX "PricingPhase_startDate_idx" ON "PricingPhase"("startDate");

-- CreateIndex
CREATE INDEX "Participation_userId_idx" ON "Participation"("userId");

-- CreateIndex
CREATE INDEX "Participation_eventId_idx" ON "Participation"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Participation_userId_eventId_key" ON "Participation"("userId", "eventId");

-- CreateIndex
CREATE INDEX "Registration_userId_idx" ON "Registration"("userId");

-- CreateIndex
CREATE INDEX "Registration_eventId_idx" ON "Registration"("eventId");

-- CreateIndex
CREATE INDEX "Registration_variantId_idx" ON "Registration"("variantId");

-- CreateIndex
CREATE INDEX "Registration_status_idx" ON "Registration"("status");

-- CreateIndex
CREATE INDEX "Registration_stripeCheckoutSessionId_idx" ON "Registration"("stripeCheckoutSessionId");

-- CreateIndex
CREATE INDEX "Registration_teamGroupId_idx" ON "Registration"("teamGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "Registration_userId_eventId_variantId_teamMemberIndex_key" ON "Registration"("userId", "eventId", "variantId", "teamMemberIndex");

-- CreateIndex
CREATE INDEX "EventCustomField_eventId_idx" ON "EventCustomField"("eventId");

-- CreateIndex
CREATE INDEX "EventCustomField_order_idx" ON "EventCustomField"("order");

-- CreateIndex
CREATE INDEX "CustomFieldResponse_customFieldId_idx" ON "CustomFieldResponse"("customFieldId");

-- CreateIndex
CREATE INDEX "CustomFieldResponse_registrationId_idx" ON "CustomFieldResponse"("registrationId");

-- CreateIndex
CREATE INDEX "CustomFieldResponse_participationId_idx" ON "CustomFieldResponse"("participationId");

-- CreateIndex
CREATE INDEX "CustomFieldResponse_userId_idx" ON "CustomFieldResponse"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldResponse_customFieldId_registrationId_participan_key" ON "CustomFieldResponse"("customFieldId", "registrationId", "participantIndex");

-- CreateIndex
CREATE UNIQUE INDEX "CustomFieldResponse_customFieldId_participationId_participa_key" ON "CustomFieldResponse"("customFieldId", "participationId", "participantIndex");

-- CreateIndex
CREATE INDEX "EventOrganizer_eventId_idx" ON "EventOrganizer"("eventId");

-- CreateIndex
CREATE INDEX "EventOrganizer_userId_idx" ON "EventOrganizer"("userId");

-- CreateIndex
CREATE INDEX "EventOrganizer_role_idx" ON "EventOrganizer"("role");

-- CreateIndex
CREATE UNIQUE INDEX "EventOrganizer_eventId_userId_key" ON "EventOrganizer"("eventId", "userId");

-- CreateIndex
CREATE INDEX "EventStaffMember_eventId_idx" ON "EventStaffMember"("eventId");

-- CreateIndex
CREATE INDEX "EventStaffMember_userId_idx" ON "EventStaffMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EventStaffMember_eventId_userId_key" ON "EventStaffMember"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "EventInvite_token_key" ON "EventInvite"("token");

-- CreateIndex
CREATE INDEX "EventInvite_eventId_idx" ON "EventInvite"("eventId");

-- CreateIndex
CREATE INDEX "EventInvite_email_idx" ON "EventInvite"("email");

-- CreateIndex
CREATE INDEX "EventInvite_token_idx" ON "EventInvite"("token");

-- CreateIndex
CREATE INDEX "EventInvite_status_idx" ON "EventInvite"("status");

-- CreateIndex
CREATE INDEX "EventInvite_expiresAt_idx" ON "EventInvite"("expiresAt");

-- CreateIndex
CREATE INDEX "Result_userId_idx" ON "Result"("userId");

-- CreateIndex
CREATE INDEX "Result_eventId_idx" ON "Result"("eventId");

-- CreateIndex
CREATE INDEX "Result_userId_createdAt_idx" ON "Result"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Result_userId_eventId_variantId_key" ON "Result"("userId", "eventId", "variantId");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_eventId_idx" ON "Comment"("eventId");

-- CreateIndex
CREATE INDEX "Comment_parentId_idx" ON "Comment"("parentId");

-- CreateIndex
CREATE INDEX "Post_userId_idx" ON "Post"("userId");

-- CreateIndex
CREATE INDEX "Post_eventId_idx" ON "Post"("eventId");

-- CreateIndex
CREATE INDEX "Post_venueId_idx" ON "Post"("venueId");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "Post_isPublic_idx" ON "Post"("isPublic");

-- CreateIndex
CREATE INDEX "Post_workoutId_idx" ON "Post"("workoutId");

-- CreateIndex
CREATE INDEX "Post_postType_idx" ON "Post"("postType");

-- CreateIndex
CREATE INDEX "PostComment_postId_idx" ON "PostComment"("postId");

-- CreateIndex
CREATE INDEX "PostComment_userId_idx" ON "PostComment"("userId");

-- CreateIndex
CREATE INDEX "PostComment_createdAt_idx" ON "PostComment"("createdAt");

-- CreateIndex
CREATE INDEX "PostLike_postId_idx" ON "PostLike"("postId");

-- CreateIndex
CREATE INDEX "PostLike_userId_idx" ON "PostLike"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostLike_postId_userId_key" ON "PostLike"("postId", "userId");

-- CreateIndex
CREATE INDEX "ProfilePhoto_userId_idx" ON "ProfilePhoto"("userId");

-- CreateIndex
CREATE INDEX "ProfilePhoto_createdAt_idx" ON "ProfilePhoto"("createdAt");

-- CreateIndex
CREATE INDEX "Friendship_senderId_idx" ON "Friendship"("senderId");

-- CreateIndex
CREATE INDEX "Friendship_receiverId_idx" ON "Friendship"("receiverId");

-- CreateIndex
CREATE INDEX "Friendship_status_idx" ON "Friendship"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Friendship_senderId_receiverId_key" ON "Friendship"("senderId", "receiverId");

-- CreateIndex
CREATE INDEX "InstagramPostDraft_userId_idx" ON "InstagramPostDraft"("userId");

-- CreateIndex
CREATE INDEX "InstagramPostDraft_createdAt_idx" ON "InstagramPostDraft"("createdAt");

-- CreateIndex
CREATE INDEX "Contact_status_idx" ON "Contact"("status");

-- CreateIndex
CREATE INDEX "Contact_createdAt_idx" ON "Contact"("createdAt");

-- CreateIndex
CREATE INDEX "Contact_email_idx" ON "Contact"("email");

-- CreateIndex
CREATE INDEX "AdminNote_userId_idx" ON "AdminNote"("userId");

-- CreateIndex
CREATE INDEX "AdminNote_status_idx" ON "AdminNote"("status");

-- CreateIndex
CREATE INDEX "AdminNote_type_idx" ON "AdminNote"("type");

-- CreateIndex
CREATE INDEX "AdminNote_createdAt_idx" ON "AdminNote"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MapPreferences_userId_key" ON "MapPreferences"("userId");

-- CreateIndex
CREATE INDEX "MapPreferences_userId_idx" ON "MapPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AnonymousMapPreferences_anonymousId_key" ON "AnonymousMapPreferences"("anonymousId");

-- CreateIndex
CREATE INDEX "AnonymousMapPreferences_anonymousId_idx" ON "AnonymousMapPreferences"("anonymousId");

-- CreateIndex
CREATE INDEX "AnonymousMapPreferences_lastAccessedAt_idx" ON "AnonymousMapPreferences"("lastAccessedAt");

-- CreateIndex
CREATE UNIQUE INDEX "EventsPreferences_userId_key" ON "EventsPreferences"("userId");

-- CreateIndex
CREATE INDEX "EventsPreferences_userId_idx" ON "EventsPreferences"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AnonymousEventsPreferences_anonymousId_key" ON "AnonymousEventsPreferences"("anonymousId");

-- CreateIndex
CREATE INDEX "AnonymousEventsPreferences_anonymousId_idx" ON "AnonymousEventsPreferences"("anonymousId");

-- CreateIndex
CREATE INDEX "AnonymousEventsPreferences_lastAccessedAt_idx" ON "AnonymousEventsPreferences"("lastAccessedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_slug_key" ON "Venue"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Venue_stripeAccountId_key" ON "Venue"("stripeAccountId");

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
CREATE INDEX "VenueImage_venueId_idx" ON "VenueImage"("venueId");

-- CreateIndex
CREATE INDEX "VenueImage_order_idx" ON "VenueImage"("order");

-- CreateIndex
CREATE INDEX "VenueImage_createdAt_idx" ON "VenueImage"("createdAt");

-- CreateIndex
CREATE INDEX "VenueTranslation_venueId_idx" ON "VenueTranslation"("venueId");

-- CreateIndex
CREATE INDEX "VenueTranslation_language_idx" ON "VenueTranslation"("language");

-- CreateIndex
CREATE UNIQUE INDEX "VenueTranslation_venueId_language_key" ON "VenueTranslation"("venueId", "language");

-- CreateIndex
CREATE INDEX "VenueMember_venueId_idx" ON "VenueMember"("venueId");

-- CreateIndex
CREATE INDEX "VenueMember_userId_idx" ON "VenueMember"("userId");

-- CreateIndex
CREATE INDEX "VenueMember_status_idx" ON "VenueMember"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VenueMember_venueId_userId_key" ON "VenueMember"("venueId", "userId");

-- CreateIndex
CREATE INDEX "VenueOwnershipClaim_venueId_idx" ON "VenueOwnershipClaim"("venueId");

-- CreateIndex
CREATE INDEX "VenueOwnershipClaim_userId_idx" ON "VenueOwnershipClaim"("userId");

-- CreateIndex
CREATE INDEX "VenueOwnershipClaim_status_idx" ON "VenueOwnershipClaim"("status");

-- CreateIndex
CREATE UNIQUE INDEX "VenueOwnershipClaim_venueId_userId_key" ON "VenueOwnershipClaim"("venueId", "userId");

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
CREATE INDEX "VenuePlanVenue_planId_idx" ON "VenuePlanVenue"("planId");

-- CreateIndex
CREATE INDEX "VenuePlanVenue_venueId_idx" ON "VenuePlanVenue"("venueId");

-- CreateIndex
CREATE UNIQUE INDEX "VenuePlanVenue_planId_venueId_key" ON "VenuePlanVenue"("planId", "venueId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueSubscription_stripeSubscriptionId_key" ON "VenueSubscription"("stripeSubscriptionId");

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
CREATE INDEX "VenueSubscription_stripeSubscriptionId_idx" ON "VenueSubscription"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "VenueRecurringSession_venueId_idx" ON "VenueRecurringSession"("venueId");

-- CreateIndex
CREATE INDEX "VenueRecurringSession_dayOfWeek_idx" ON "VenueRecurringSession"("dayOfWeek");

-- CreateIndex
CREATE INDEX "VenueRecurringSession_isActive_idx" ON "VenueRecurringSession"("isActive");

-- CreateIndex
CREATE INDEX "VenueSession_venueId_idx" ON "VenueSession"("venueId");

-- CreateIndex
CREATE INDEX "VenueSession_type_idx" ON "VenueSession"("type");

-- CreateIndex
CREATE INDEX "VenueSession_startsAt_idx" ON "VenueSession"("startsAt");

-- CreateIndex
CREATE INDEX "VenueSession_coachId_idx" ON "VenueSession"("coachId");

-- CreateIndex
CREATE INDEX "VenueSession_recurringSessionId_idx" ON "VenueSession"("recurringSessionId");

-- CreateIndex
CREATE INDEX "VenueBooking_venueId_idx" ON "VenueBooking"("venueId");

-- CreateIndex
CREATE INDEX "VenueBooking_sessionId_idx" ON "VenueBooking"("sessionId");

-- CreateIndex
CREATE INDEX "VenueBooking_userId_idx" ON "VenueBooking"("userId");

-- CreateIndex
CREATE INDEX "VenueBooking_subscriptionId_idx" ON "VenueBooking"("subscriptionId");

-- CreateIndex
CREATE INDEX "VenueBooking_status_idx" ON "VenueBooking"("status");

-- CreateIndex
CREATE INDEX "VenueBooking_createdAt_idx" ON "VenueBooking"("createdAt");

-- CreateIndex
CREATE INDEX "VenueBooking_bookingType_idx" ON "VenueBooking"("bookingType");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentIntent_stripePaymentIntentId_key" ON "PaymentIntent"("stripePaymentIntentId");

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

-- CreateIndex
CREATE INDEX "PaymentIntent_stripePaymentIntentId_idx" ON "PaymentIntent"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "VenueProduct_venueId_idx" ON "VenueProduct"("venueId");

-- CreateIndex
CREATE INDEX "VenueProduct_isActive_idx" ON "VenueProduct"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "VenueProductPurchase_stripePaymentIntentId_key" ON "VenueProductPurchase"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "VenueProductPurchase_venueId_idx" ON "VenueProductPurchase"("venueId");

-- CreateIndex
CREATE INDEX "VenueProductPurchase_productId_idx" ON "VenueProductPurchase"("productId");

-- CreateIndex
CREATE INDEX "VenueProductPurchase_userId_idx" ON "VenueProductPurchase"("userId");

-- CreateIndex
CREATE INDEX "VenueProductPurchase_status_idx" ON "VenueProductPurchase"("status");

-- CreateIndex
CREATE INDEX "VenueProductPurchase_stripePaymentIntentId_idx" ON "VenueProductPurchase"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "EventWeather_eventId_idx" ON "EventWeather"("eventId");

-- CreateIndex
CREATE INDEX "EventWeather_date_idx" ON "EventWeather"("date");

-- CreateIndex
CREATE UNIQUE INDEX "EventWeather_eventId_date_key" ON "EventWeather"("eventId", "date");

-- CreateIndex
CREATE INDEX "VenueRecommendation_venueId_idx" ON "VenueRecommendation"("venueId");

-- CreateIndex
CREATE INDEX "VenueRecommendation_userId_idx" ON "VenueRecommendation"("userId");

-- CreateIndex
CREATE INDEX "VenueRecommendation_createdAt_idx" ON "VenueRecommendation"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VenueRecommendation_venueId_userId_key" ON "VenueRecommendation"("venueId", "userId");

-- CreateIndex
CREATE INDEX "VenueReview_venueId_idx" ON "VenueReview"("venueId");

-- CreateIndex
CREATE INDEX "VenueReview_userId_idx" ON "VenueReview"("userId");

-- CreateIndex
CREATE INDEX "VenueReview_createdAt_idx" ON "VenueReview"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "VenueReview_venueId_userId_key" ON "VenueReview"("venueId", "userId");

-- CreateIndex
CREATE INDEX "VenueReviewReply_reviewId_idx" ON "VenueReviewReply"("reviewId");

-- CreateIndex
CREATE INDEX "VenueReviewReply_userId_idx" ON "VenueReviewReply"("userId");

-- CreateIndex
CREATE INDEX "VenueReviewReply_createdAt_idx" ON "VenueReviewReply"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StripeWebhookEvent_stripeEventId_key" ON "StripeWebhookEvent"("stripeEventId");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_stripeEventId_idx" ON "StripeWebhookEvent"("stripeEventId");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_accountId_idx" ON "StripeWebhookEvent"("accountId");

-- CreateIndex
CREATE INDEX "StripeWebhookEvent_type_idx" ON "StripeWebhookEvent"("type");

-- CreateIndex
CREATE INDEX "Conversation_createdAt_idx" ON "Conversation"("createdAt");

-- CreateIndex
CREATE INDEX "ConversationParticipant_conversationId_idx" ON "ConversationParticipant"("conversationId");

-- CreateIndex
CREATE INDEX "ConversationParticipant_userId_idx" ON "ConversationParticipant"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationParticipant_conversationId_userId_key" ON "ConversationParticipant"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_idx" ON "Message"("conversationId");

-- CreateIndex
CREATE INDEX "Message_senderId_idx" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "Message_createdAt_idx" ON "Message"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PushToken_token_key" ON "PushToken"("token");

-- CreateIndex
CREATE INDEX "PushToken_userId_idx" ON "PushToken"("userId");

-- CreateIndex
CREATE INDEX "PushToken_token_idx" ON "PushToken"("token");

-- CreateIndex
CREATE INDEX "PushToken_isActive_idx" ON "PushToken"("isActive");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_type_idx" ON "Notification"("type");

-- CreateIndex
CREATE INDEX "Notification_read_idx" ON "Notification"("read");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "UserReport_reporterId_idx" ON "UserReport"("reporterId");

-- CreateIndex
CREATE INDEX "UserReport_reportedId_idx" ON "UserReport"("reportedId");

-- CreateIndex
CREATE INDEX "UserReport_status_idx" ON "UserReport"("status");

-- CreateIndex
CREATE INDEX "UserReport_createdAt_idx" ON "UserReport"("createdAt");

-- CreateIndex
CREATE INDEX "UserBlock_blockerId_idx" ON "UserBlock"("blockerId");

-- CreateIndex
CREATE INDEX "UserBlock_blockedId_idx" ON "UserBlock"("blockedId");

-- CreateIndex
CREATE UNIQUE INDEX "UserBlock_blockerId_blockedId_key" ON "UserBlock"("blockerId", "blockedId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPerformanceEntry_resultId_key" ON "UserPerformanceEntry"("resultId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPerformanceEntry_workoutExerciseSetId_key" ON "UserPerformanceEntry"("workoutExerciseSetId");

-- CreateIndex
CREATE UNIQUE INDEX "UserPerformanceEntry_runActivityId_key" ON "UserPerformanceEntry"("runActivityId");

-- CreateIndex
CREATE INDEX "UserPerformanceEntry_userId_type_performedAt_idx" ON "UserPerformanceEntry"("userId", "type", "performedAt");

-- CreateIndex
CREATE INDEX "UserPerformanceEntry_userId_exerciseId_idx" ON "UserPerformanceEntry"("userId", "exerciseId");

-- CreateIndex
CREATE INDEX "UserPerformanceEntry_userId_hyroxCategory_idx" ON "UserPerformanceEntry"("userId", "hyroxCategory");

-- CreateIndex
CREATE INDEX "UserPerformanceEntry_resultId_idx" ON "UserPerformanceEntry"("resultId");

-- CreateIndex
CREATE INDEX "UserPerformanceEntry_workoutExerciseResultId_idx" ON "UserPerformanceEntry"("workoutExerciseResultId");

-- CreateIndex
CREATE INDEX "Exercise_name_idx" ON "Exercise"("name");

-- CreateIndex
CREATE INDEX "Exercise_createdById_idx" ON "Exercise"("createdById");

-- CreateIndex
CREATE INDEX "Exercise_isGlobal_idx" ON "Exercise"("isGlobal");

-- CreateIndex
CREATE INDEX "Exercise_effortScore_idx" ON "Exercise"("effortScore");

-- CreateIndex
CREATE INDEX "ExerciseTranslation_exerciseId_idx" ON "ExerciseTranslation"("exerciseId");

-- CreateIndex
CREATE INDEX "ExerciseTranslation_language_idx" ON "ExerciseTranslation"("language");

-- CreateIndex
CREATE INDEX "ExerciseTranslation_name_idx" ON "ExerciseTranslation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseTranslation_exerciseId_language_key" ON "ExerciseTranslation"("exerciseId", "language");

-- CreateIndex
CREATE INDEX "Workout_createdById_idx" ON "Workout"("createdById");

-- CreateIndex
CREATE INDEX "Workout_venueId_idx" ON "Workout"("venueId");

-- CreateIndex
CREATE INDEX "Workout_isPublic_idx" ON "Workout"("isPublic");

-- CreateIndex
CREATE INDEX "WorkoutBlock_workoutId_idx" ON "WorkoutBlock"("workoutId");

-- CreateIndex
CREATE INDEX "ExerciseGroup_blockId_idx" ON "ExerciseGroup"("blockId");

-- CreateIndex
CREATE INDEX "WorkoutBlockExercise_blockId_idx" ON "WorkoutBlockExercise"("blockId");

-- CreateIndex
CREATE INDEX "WorkoutBlockExercise_groupId_idx" ON "WorkoutBlockExercise"("groupId");

-- CreateIndex
CREATE INDEX "WorkoutBlockExercise_exerciseId_idx" ON "WorkoutBlockExercise"("exerciseId");

-- CreateIndex
CREATE INDEX "WorkoutSetPrescription_blockExerciseId_idx" ON "WorkoutSetPrescription"("blockExerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSetPrescription_blockExerciseId_setNumber_key" ON "WorkoutSetPrescription"("blockExerciseId", "setNumber");

-- CreateIndex
CREATE INDEX "VenueSessionWorkout_sessionId_idx" ON "VenueSessionWorkout"("sessionId");

-- CreateIndex
CREATE INDEX "VenueSessionWorkout_workoutId_idx" ON "VenueSessionWorkout"("workoutId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueSessionWorkout_sessionId_workoutId_key" ON "VenueSessionWorkout"("sessionId", "workoutId");

-- CreateIndex
CREATE INDEX "UserWorkout_userId_scheduledFor_idx" ON "UserWorkout"("userId", "scheduledFor");

-- CreateIndex
CREATE INDEX "UserWorkout_workoutId_idx" ON "UserWorkout"("workoutId");

-- CreateIndex
CREATE INDEX "WorkoutLog_userId_performedAt_idx" ON "WorkoutLog"("userId", "performedAt");

-- CreateIndex
CREATE INDEX "WorkoutLog_workoutId_idx" ON "WorkoutLog"("workoutId");

-- CreateIndex
CREATE INDEX "WorkoutLog_sessionId_idx" ON "WorkoutLog"("sessionId");

-- CreateIndex
CREATE INDEX "WorkoutBlockResult_logId_idx" ON "WorkoutBlockResult"("logId");

-- CreateIndex
CREATE INDEX "WorkoutBlockResult_blockId_idx" ON "WorkoutBlockResult"("blockId");

-- CreateIndex
CREATE INDEX "WorkoutExerciseResult_blockResultId_idx" ON "WorkoutExerciseResult"("blockResultId");

-- CreateIndex
CREATE INDEX "WorkoutExerciseResult_blockExerciseId_idx" ON "WorkoutExerciseResult"("blockExerciseId");

-- CreateIndex
CREATE INDEX "WorkoutExerciseResult_exerciseId_idx" ON "WorkoutExerciseResult"("exerciseId");

-- CreateIndex
CREATE INDEX "WorkoutExerciseSet_exerciseResultId_idx" ON "WorkoutExerciseSet"("exerciseResultId");

-- CreateIndex
CREATE INDEX "TrainingPlan_createdById_idx" ON "TrainingPlan"("createdById");

-- CreateIndex
CREATE INDEX "TrainingPlan_venueId_idx" ON "TrainingPlan"("venueId");

-- CreateIndex
CREATE INDEX "TrainingPlan_isPublic_idx" ON "TrainingPlan"("isPublic");

-- CreateIndex
CREATE INDEX "TrainingPlan_category_idx" ON "TrainingPlan"("category");

-- CreateIndex
CREATE INDEX "TrainingPlanTranslation_planId_idx" ON "TrainingPlanTranslation"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPlanTranslation_planId_language_key" ON "TrainingPlanTranslation"("planId", "language");

-- CreateIndex
CREATE INDEX "TrainingPlanWeek_planId_idx" ON "TrainingPlanWeek"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "TrainingPlanWeek_planId_weekNumber_key" ON "TrainingPlanWeek"("planId", "weekNumber");

-- CreateIndex
CREATE INDEX "TrainingPlanWorkout_weekId_idx" ON "TrainingPlanWorkout"("weekId");

-- CreateIndex
CREATE INDEX "TrainingPlanWorkout_workoutId_idx" ON "TrainingPlanWorkout"("workoutId");

-- CreateIndex
CREATE INDEX "UserTrainingPlan_userId_idx" ON "UserTrainingPlan"("userId");

-- CreateIndex
CREATE INDEX "UserTrainingPlan_planId_idx" ON "UserTrainingPlan"("planId");

-- CreateIndex
CREATE INDEX "UserTrainingPlan_status_idx" ON "UserTrainingPlan"("status");

-- CreateIndex
CREATE INDEX "SavedWorkout_userId_idx" ON "SavedWorkout"("userId");

-- CreateIndex
CREATE INDEX "SavedWorkout_workoutId_idx" ON "SavedWorkout"("workoutId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedWorkout_userId_workoutId_key" ON "SavedWorkout"("userId", "workoutId");

-- CreateIndex
CREATE INDEX "SavedTrainingPlan_userId_idx" ON "SavedTrainingPlan"("userId");

-- CreateIndex
CREATE INDEX "SavedTrainingPlan_planId_idx" ON "SavedTrainingPlan"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedTrainingPlan_userId_planId_key" ON "SavedTrainingPlan"("userId", "planId");

-- CreateIndex
CREATE INDEX "VenueSessionPlan_venueId_idx" ON "VenueSessionPlan"("venueId");

-- CreateIndex
CREATE INDEX "VenueSessionPlan_sessionId_idx" ON "VenueSessionPlan"("sessionId");

-- CreateIndex
CREATE INDEX "VenueSessionPlan_planId_idx" ON "VenueSessionPlan"("planId");

-- CreateIndex
CREATE UNIQUE INDEX "VenueSessionPlan_sessionId_planId_key" ON "VenueSessionPlan"("sessionId", "planId");

-- CreateIndex
CREATE UNIQUE INDEX "MotionAnalysisRecord_localId_key" ON "MotionAnalysisRecord"("localId");

-- CreateIndex
CREATE INDEX "MotionAnalysisRecord_userId_idx" ON "MotionAnalysisRecord"("userId");

-- CreateIndex
CREATE INDEX "MotionAnalysisRecord_localId_idx" ON "MotionAnalysisRecord"("localId");

-- CreateIndex
CREATE UNIQUE INDEX "LiftAnalysisRecord_localId_key" ON "LiftAnalysisRecord"("localId");

-- CreateIndex
CREATE INDEX "LiftAnalysisRecord_userId_idx" ON "LiftAnalysisRecord"("userId");

-- CreateIndex
CREATE INDEX "LiftAnalysisRecord_localId_idx" ON "LiftAnalysisRecord"("localId");

-- CreateIndex
CREATE INDEX "AiAnalysisUsage_userId_createdAt_idx" ON "AiAnalysisUsage"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Giveaway_eventId_idx" ON "Giveaway"("eventId");

-- CreateIndex
CREATE INDEX "Giveaway_status_idx" ON "Giveaway"("status");

-- CreateIndex
CREATE INDEX "Giveaway_drawAt_idx" ON "Giveaway"("drawAt");

-- CreateIndex
CREATE INDEX "GiveawayTranslation_giveawayId_idx" ON "GiveawayTranslation"("giveawayId");

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayTranslation_giveawayId_lang_key" ON "GiveawayTranslation"("giveawayId", "lang");

-- CreateIndex
CREATE INDEX "GiveawayParticipation_giveawayId_idx" ON "GiveawayParticipation"("giveawayId");

-- CreateIndex
CREATE INDEX "GiveawayParticipation_giveawayId_ticketNumber_idx" ON "GiveawayParticipation"("giveawayId", "ticketNumber");

-- CreateIndex
CREATE INDEX "GiveawayParticipation_userId_idx" ON "GiveawayParticipation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayParticipation_giveawayId_userId_key" ON "GiveawayParticipation"("giveawayId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayParticipation_giveawayId_ticketNumber_key" ON "GiveawayParticipation"("giveawayId", "ticketNumber");

-- CreateIndex
CREATE INDEX "GiveawayWinner_giveawayId_idx" ON "GiveawayWinner"("giveawayId");

-- CreateIndex
CREATE INDEX "GiveawayWinner_userId_idx" ON "GiveawayWinner"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GiveawayWinner_giveawayId_userId_key" ON "GiveawayWinner"("giveawayId", "userId");

-- CreateIndex
CREATE INDEX "AthliConversation_userId_idx" ON "AthliConversation"("userId");

-- CreateIndex
CREATE INDEX "AthliConversation_createdAt_idx" ON "AthliConversation"("createdAt");

-- CreateIndex
CREATE INDEX "AthliMessage_conversationId_idx" ON "AthliMessage"("conversationId");

-- CreateIndex
CREATE INDEX "AthliMessage_createdAt_idx" ON "AthliMessage"("createdAt");

-- CreateIndex
CREATE INDEX "RunActivity_userId_startedAt_idx" ON "RunActivity"("userId", "startedAt");

-- CreateIndex
CREATE UNIQUE INDEX "PlatformKnowledge_slug_key" ON "PlatformKnowledge"("slug");

-- CreateIndex
CREATE INDEX "PlatformKnowledge_category_idx" ON "PlatformKnowledge"("category");

-- CreateIndex
CREATE INDEX "PlatformKnowledge_language_idx" ON "PlatformKnowledge"("language");

-- CreateIndex
CREATE INDEX "PlatformKnowledge_isActive_idx" ON "PlatformKnowledge"("isActive");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_featuredVenueId_fkey" FOREIGN KEY ("featuredVenueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventTranslation" ADD CONSTRAINT "EventTranslation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFAQ" ADD CONSTRAINT "EventFAQ_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventFAQTranslation" ADD CONSTRAINT "EventFAQTranslation_faqId_fkey" FOREIGN KEY ("faqId") REFERENCES "EventFAQ"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVariant" ADD CONSTRAINT "EventVariant_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRoute" ADD CONSTRAINT "EventRoute_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RouteCheckpoint" ADD CONSTRAINT "RouteCheckpoint_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "EventRoute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventVariantTranslation" ADD CONSTRAINT "EventVariantTranslation_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TriathlonSegment" ADD CONSTRAINT "TriathlonSegment_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingPhase" ADD CONSTRAINT "PricingPhase_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PricingPhase" ADD CONSTRAINT "PricingPhase_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participation" ADD CONSTRAINT "Participation_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Registration" ADD CONSTRAINT "Registration_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventCustomField" ADD CONSTRAINT "EventCustomField_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_customFieldId_fkey" FOREIGN KEY ("customFieldId") REFERENCES "EventCustomField"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_registrationId_fkey" FOREIGN KEY ("registrationId") REFERENCES "Registration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_participationId_fkey" FOREIGN KEY ("participationId") REFERENCES "Participation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldResponse" ADD CONSTRAINT "CustomFieldResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOrganizer" ADD CONSTRAINT "EventOrganizer_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOrganizer" ADD CONSTRAINT "EventOrganizer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventOrganizer" ADD CONSTRAINT "EventOrganizer_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventStaffMember" ADD CONSTRAINT "EventStaffMember_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventStaffMember" ADD CONSTRAINT "EventStaffMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventStaffMember" ADD CONSTRAINT "EventStaffMember_addedById_fkey" FOREIGN KEY ("addedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvite" ADD CONSTRAINT "EventInvite_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventInvite" ADD CONSTRAINT "EventInvite_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "EventVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostLike" ADD CONSTRAINT "PostLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfilePhoto" ADD CONSTRAINT "ProfilePhoto_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friendship" ADD CONSTRAINT "Friendship_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InstagramPostDraft" ADD CONSTRAINT "InstagramPostDraft_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminNote" ADD CONSTRAINT "AdminNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MapPreferences" ADD CONSTRAINT "MapPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventsPreferences" ADD CONSTRAINT "EventsPreferences_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueImage" ADD CONSTRAINT "VenueImage_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueTranslation" ADD CONSTRAINT "VenueTranslation_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueMember" ADD CONSTRAINT "VenueMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueMember" ADD CONSTRAINT "VenueMember_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueOwnershipClaim" ADD CONSTRAINT "VenueOwnershipClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueOwnershipClaim" ADD CONSTRAINT "VenueOwnershipClaim_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueInvite" ADD CONSTRAINT "VenueInvite_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenuePlan" ADD CONSTRAINT "VenuePlan_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenuePlanVenue" ADD CONSTRAINT "VenuePlanVenue_planId_fkey" FOREIGN KEY ("planId") REFERENCES "VenuePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenuePlanVenue" ADD CONSTRAINT "VenuePlanVenue_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSubscription" ADD CONSTRAINT "VenueSubscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "VenuePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSubscription" ADD CONSTRAINT "VenueSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSubscription" ADD CONSTRAINT "VenueSubscription_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueRecurringSession" ADD CONSTRAINT "VenueRecurringSession_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSession" ADD CONSTRAINT "VenueSession_recurringSessionId_fkey" FOREIGN KEY ("recurringSessionId") REFERENCES "VenueRecurringSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSession" ADD CONSTRAINT "VenueSession_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBooking" ADD CONSTRAINT "VenueBooking_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VenueSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBooking" ADD CONSTRAINT "VenueBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBooking" ADD CONSTRAINT "VenueBooking_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBooking" ADD CONSTRAINT "VenueBooking_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "VenueSubscription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueBooking" ADD CONSTRAINT "VenueBooking_addedByUserId_fkey" FOREIGN KEY ("addedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_planId_fkey" FOREIGN KEY ("planId") REFERENCES "VenuePlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentIntent" ADD CONSTRAINT "PaymentIntent_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueProduct" ADD CONSTRAINT "VenueProduct_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueProductPurchase" ADD CONSTRAINT "VenueProductPurchase_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueProductPurchase" ADD CONSTRAINT "VenueProductPurchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "VenueProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueProductPurchase" ADD CONSTRAINT "VenueProductPurchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventWeather" ADD CONSTRAINT "EventWeather_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueRecommendation" ADD CONSTRAINT "VenueRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueRecommendation" ADD CONSTRAINT "VenueRecommendation_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueReview" ADD CONSTRAINT "VenueReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueReview" ADD CONSTRAINT "VenueReview_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueReviewReply" ADD CONSTRAINT "VenueReviewReply_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "VenueReview"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueReviewReply" ADD CONSTRAINT "VenueReviewReply_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationParticipant" ADD CONSTRAINT "ConversationParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushToken" ADD CONSTRAINT "PushToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserReport" ADD CONSTRAINT "UserReport_reportedId_fkey" FOREIGN KEY ("reportedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_blockerId_fkey" FOREIGN KEY ("blockerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserBlock" ADD CONSTRAINT "UserBlock_blockedId_fkey" FOREIGN KEY ("blockedId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerformanceEntry" ADD CONSTRAINT "UserPerformanceEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerformanceEntry" ADD CONSTRAINT "UserPerformanceEntry_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerformanceEntry" ADD CONSTRAINT "UserPerformanceEntry_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerformanceEntry" ADD CONSTRAINT "UserPerformanceEntry_workoutExerciseResultId_fkey" FOREIGN KEY ("workoutExerciseResultId") REFERENCES "WorkoutExerciseResult"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerformanceEntry" ADD CONSTRAINT "UserPerformanceEntry_workoutExerciseSetId_fkey" FOREIGN KEY ("workoutExerciseSetId") REFERENCES "WorkoutExerciseSet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPerformanceEntry" ADD CONSTRAINT "UserPerformanceEntry_runActivityId_fkey" FOREIGN KEY ("runActivityId") REFERENCES "RunActivity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseTranslation" ADD CONSTRAINT "ExerciseTranslation_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Workout" ADD CONSTRAINT "Workout_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutBlock" ADD CONSTRAINT "WorkoutBlock_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseGroup" ADD CONSTRAINT "ExerciseGroup_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "WorkoutBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutBlockExercise" ADD CONSTRAINT "WorkoutBlockExercise_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "WorkoutBlock"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutBlockExercise" ADD CONSTRAINT "WorkoutBlockExercise_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "ExerciseGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutBlockExercise" ADD CONSTRAINT "WorkoutBlockExercise_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSetPrescription" ADD CONSTRAINT "WorkoutSetPrescription_blockExerciseId_fkey" FOREIGN KEY ("blockExerciseId") REFERENCES "WorkoutBlockExercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSessionWorkout" ADD CONSTRAINT "VenueSessionWorkout_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VenueSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSessionWorkout" ADD CONSTRAINT "VenueSessionWorkout_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkout" ADD CONSTRAINT "UserWorkout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkout" ADD CONSTRAINT "UserWorkout_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserWorkout" ADD CONSTRAINT "UserWorkout_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutLog" ADD CONSTRAINT "WorkoutLog_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VenueSession"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutBlockResult" ADD CONSTRAINT "WorkoutBlockResult_logId_fkey" FOREIGN KEY ("logId") REFERENCES "WorkoutLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutBlockResult" ADD CONSTRAINT "WorkoutBlockResult_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "WorkoutBlock"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseResult" ADD CONSTRAINT "WorkoutExerciseResult_blockResultId_fkey" FOREIGN KEY ("blockResultId") REFERENCES "WorkoutBlockResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseResult" ADD CONSTRAINT "WorkoutExerciseResult_blockExerciseId_fkey" FOREIGN KEY ("blockExerciseId") REFERENCES "WorkoutBlockExercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseResult" ADD CONSTRAINT "WorkoutExerciseResult_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutExerciseSet" ADD CONSTRAINT "WorkoutExerciseSet_exerciseResultId_fkey" FOREIGN KEY ("exerciseResultId") REFERENCES "WorkoutExerciseResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlan" ADD CONSTRAINT "TrainingPlan_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlanTranslation" ADD CONSTRAINT "TrainingPlanTranslation_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TrainingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlanWeek" ADD CONSTRAINT "TrainingPlanWeek_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TrainingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlanWorkout" ADD CONSTRAINT "TrainingPlanWorkout_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "TrainingPlanWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingPlanWorkout" ADD CONSTRAINT "TrainingPlanWorkout_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrainingPlan" ADD CONSTRAINT "UserTrainingPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrainingPlan" ADD CONSTRAINT "UserTrainingPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TrainingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTrainingPlan" ADD CONSTRAINT "UserTrainingPlan_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedWorkout" ADD CONSTRAINT "SavedWorkout_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedWorkout" ADD CONSTRAINT "SavedWorkout_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedTrainingPlan" ADD CONSTRAINT "SavedTrainingPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedTrainingPlan" ADD CONSTRAINT "SavedTrainingPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TrainingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSessionPlan" ADD CONSTRAINT "VenueSessionPlan_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "Venue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSessionPlan" ADD CONSTRAINT "VenueSessionPlan_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "VenueSession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueSessionPlan" ADD CONSTRAINT "VenueSessionPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "TrainingPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MotionAnalysisRecord" ADD CONSTRAINT "MotionAnalysisRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LiftAnalysisRecord" ADD CONSTRAINT "LiftAnalysisRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiAnalysisUsage" ADD CONSTRAINT "AiAnalysisUsage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Giveaway" ADD CONSTRAINT "Giveaway_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayTranslation" ADD CONSTRAINT "GiveawayTranslation_giveawayId_fkey" FOREIGN KEY ("giveawayId") REFERENCES "Giveaway"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayParticipation" ADD CONSTRAINT "GiveawayParticipation_giveawayId_fkey" FOREIGN KEY ("giveawayId") REFERENCES "Giveaway"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayParticipation" ADD CONSTRAINT "GiveawayParticipation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayWinner" ADD CONSTRAINT "GiveawayWinner_giveawayId_fkey" FOREIGN KEY ("giveawayId") REFERENCES "Giveaway"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiveawayWinner" ADD CONSTRAINT "GiveawayWinner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AthliConversation" ADD CONSTRAINT "AthliConversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AthliMessage" ADD CONSTRAINT "AthliMessage_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "AthliConversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RunActivity" ADD CONSTRAINT "RunActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

