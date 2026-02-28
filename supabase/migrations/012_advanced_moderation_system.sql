-- =============================================
-- Migration: Advanced Moderation System (Final Consolidated)
-- Goal: Scalability, Performance, and Enhanced Moderation Features
-- =============================================

-- 1. Schema Upgrades: Adding ALL missing columns
ALTER TABLE community_submissions 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS resource_url_hash TEXT,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS target_type TEXT CHECK (target_type IN ('course', 'roadmap')),
ADD COLUMN IF NOT EXISTS target_day_id UUID REFERENCES course_days(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS target_topic_id UUID REFERENCES roadmap_topics(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS resource_type TEXT;

-- 2. Status Constraint Update
DO $$ 
BEGIN
    ALTER TABLE community_submissions DROP CONSTRAINT IF EXISTS community_submissions_status_check;
    ALTER TABLE community_submissions ADD CONSTRAINT community_submissions_status_check 
        CHECK (status IN ('pending', 'approved', 'rejected', 'added', 'spam'));
END $$;

-- 3. Optimized Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_submissions_moderation_v2 ON community_submissions (status, deleted_at, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_soft_delete ON community_submissions (deleted_at, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_url_hash ON community_submissions (resource_url_hash);
CREATE INDEX IF NOT EXISTS idx_submissions_contributor ON community_submissions (email);
CREATE INDEX IF NOT EXISTS idx_submissions_type_status ON community_submissions (type, status);

-- 4. Audit Log Table
CREATE TABLE IF NOT EXISTS community_submission_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES community_submissions(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_submission_actions_sid ON community_submission_actions(submission_id);

-- 5. RLS Policies
ALTER TABLE community_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can submit" ON community_submissions;
CREATE POLICY "Public can submit" ON community_submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin full access" ON community_submissions;
CREATE POLICY "Admin full access" ON community_submissions FOR ALL TO authenticated USING (true);

-- 6. RPC: get_submission_stats
CREATE OR REPLACE FUNCTION get_submission_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'pending',  COUNT(*) FILTER (WHERE status = 'pending' AND deleted_at IS NULL),
        'approved', COUNT(*) FILTER (WHERE status = 'approved' AND deleted_at IS NULL),
        'rejected', COUNT(*) FILTER (WHERE status = 'rejected' AND deleted_at IS NULL),
        'added',    COUNT(*) FILTER (WHERE status = 'added' AND deleted_at IS NULL),
        'spam',     COUNT(*) FILTER (WHERE status = 'spam' AND deleted_at IS NULL),
        'trash',    COUNT(*) FILTER (WHERE deleted_at IS NOT NULL)
    ) INTO result
    FROM community_submissions;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. RPC: add_submission_to_target
CREATE OR REPLACE FUNCTION add_submission_to_target(p_submission_id UUID)
RETURNS VOID AS $$
BEGIN
    -- Update submission status to 'added'
    UPDATE community_submissions 
    SET status = 'added',
        deleted_at = NULL -- Ensure it's not in trash
    WHERE id = p_submission_id;

    -- Log the action
    INSERT INTO community_submission_actions (submission_id, action, admin_id)
    VALUES (p_submission_id, 'converted_to_resource', auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
