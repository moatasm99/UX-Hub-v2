-- Migration: Add context fields to community_submissions
-- To track which page the submission originated from

ALTER TABLE community_submissions 
ADD COLUMN IF NOT EXISTS context_url TEXT,
ADD COLUMN IF NOT EXISTS context_title TEXT;

-- Update RLS policies (optional, but good to be explicit)
-- The existing policies cover all columns, so no changes needed for "Anyone can submit" 
-- or "Admins can view/update".
