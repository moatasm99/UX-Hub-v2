-- =============================================
-- Migration: Make Community Submission Message Optional
-- Purpose: Resolve NOT NULL constraint violation for submissions with empty messages
-- =============================================

-- Allow NULL values in the message column to align with the "Optional" UI label
ALTER TABLE community_submissions ALTER COLUMN message DROP NOT NULL;
