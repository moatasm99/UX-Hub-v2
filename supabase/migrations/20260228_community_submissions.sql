-- Migration: Create community_submissions table
-- For the community feedback & resource moderation system

CREATE TABLE IF NOT EXISTS community_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('feedback', 'suggestion', 'resource')),
    title TEXT NOT NULL,
    message TEXT,
    url TEXT,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE community_submissions ENABLE ROW LEVEL SECURITY;

-- Public can INSERT (anonymous submissions)
CREATE POLICY "Anyone can submit"
    ON community_submissions
    FOR INSERT
    WITH CHECK (true);

-- Only authenticated (admin) can SELECT
CREATE POLICY "Admins can view submissions"
    ON community_submissions
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Only authenticated (admin) can UPDATE
CREATE POLICY "Admins can update submissions"
    ON community_submissions
    FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
