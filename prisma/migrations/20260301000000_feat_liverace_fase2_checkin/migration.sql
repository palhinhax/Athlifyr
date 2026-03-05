-- Fase 2: LiveRace - Check-in Window Gating
-- Adds CHECK_IN_OPEN status to EventLiveStatus enum

-- Add CHECK_IN_OPEN value to the EventLiveStatus enum (safe: no-op if already exists)
DO $$ BEGIN
  ALTER TYPE "EventLiveStatus" ADD VALUE IF NOT EXISTS 'CHECK_IN_OPEN';
EXCEPTION WHEN others THEN null; END $$;
