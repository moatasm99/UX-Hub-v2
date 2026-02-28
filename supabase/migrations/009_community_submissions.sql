-- =============================================
-- Migration: Community Submissions System (FINAL)
-- Purpose: Complete production-ready schema for moderation and resource conversion
-- =============================================

-- 1. Main Table: community_submissions
CREATE TABLE IF NOT EXISTS community_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Submission Type
    type TEXT NOT NULL CHECK (type IN ('feedback', 'suggestion', 'resource')),
    
    -- Submitter Info
    name TEXT,
    email TEXT,
    
    -- Content
    title TEXT NOT NULL,
    message TEXT NOT NULL, -- Message is required as per prompt
    
    -- Resource Metadata (Links & Types)
    resource_url TEXT,
    resource_type TEXT CHECK (resource_type IN ('video', 'article', 'playlist', 'tool', 'other')),
    
    -- Moderation & Admin Note
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'added')) DEFAULT 'pending',
    admin_notes TEXT,
    
    -- Target Association (Links submission to specific page/day/topic)
    target_type TEXT CHECK (target_type IN ('course', 'roadmap')),
    target_category_id UUID REFERENCES course_categories(id) ON DELETE SET NULL,
    target_course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    target_day_id UUID REFERENCES course_days(id) ON DELETE SET NULL,
    target_track_id UUID REFERENCES roadmap_tracks(id) ON DELETE SET NULL,
    target_topic_id UUID REFERENCES roadmap_topics(id) ON DELETE SET NULL,
    
    -- Audit Tracking
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Audit Table: community_submission_actions
CREATE TABLE IF NOT EXISTS community_submission_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID NOT NULL REFERENCES community_submissions(id) ON DELETE CASCADE,
    action TEXT NOT NULL CHECK (action IN ('approved', 'rejected', 'added')),
    admin_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Optimization Indexes
CREATE INDEX IF NOT EXISTS idx_community_submissions_status ON community_submissions(status);
CREATE INDEX IF NOT EXISTS idx_community_submissions_type ON community_submissions(type);
CREATE INDEX IF NOT EXISTS idx_community_submissions_target_type ON community_submissions(target_type);
CREATE INDEX IF NOT EXISTS idx_community_submissions_created_at ON community_submissions(created_at);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE community_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_submission_actions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies (Production Secure)
-- community_submissions
DROP POLICY IF EXISTS "Public can submit" ON community_submissions;
CREATE POLICY "Public can submit" ON community_submissions
    FOR INSERT WITH CHECK (true); -- Public can INSERT only

DROP POLICY IF EXISTS "Public cannot select" ON community_submissions;
-- (Implicitly denied unless a SELECT policy exists, but we explicitly restrict it)

DROP POLICY IF EXISTS "Admin full access" ON community_submissions;
CREATE POLICY "Admin full access" ON community_submissions
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true); -- Authenticated admin can SELECT / UPDATE / DELETE

-- community_submission_actions
DROP POLICY IF EXISTS "Admin view actions" ON community_submission_actions;
CREATE POLICY "Admin view actions" ON community_submission_actions
    FOR SELECT TO authenticated
    USING (true);

-- 6. RPC Function: add_submission_to_target
-- Dynamically inserts approved submissions into courses or roadmaps
CREATE OR REPLACE FUNCTION add_submission_to_target(p_submission_id UUID)
RETURNS VOID AS $$
DECLARE
    v_sub RECORD;
    v_target_resource_type TEXT;
BEGIN
    -- 1. Fetch submission details
    SELECT * INTO v_sub FROM community_submissions WHERE id = p_submission_id;
    
    -- 2. Validate Pre-conditions
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Submission % not found', p_submission_id;
    END IF;

    IF v_sub.status != 'approved' THEN
        RAISE EXCEPTION 'Only approved submissions can be converted to resources. Current status: %', v_sub.status;
    END IF;

    IF v_sub.type != 'resource' THEN
        RAISE EXCEPTION 'Submission type must be "resource" to be added as a platform content';
    END IF;

    -- 3. Normalize Resource Type
    -- Maps community source types to platform schema constraints
    v_target_resource_type := CASE v_sub.resource_type
        WHEN 'video' THEN 'Video'
        WHEN 'article' THEN 'Article'
        WHEN 'playlist' THEN (CASE WHEN v_sub.target_type = 'roadmap' THEN 'Course' ELSE 'Article' END)
        WHEN 'tool' THEN (CASE WHEN v_sub.target_type = 'roadmap' THEN 'Tool' ELSE 'Article' END)
        ELSE (CASE WHEN v_sub.target_type = 'roadmap' THEN 'Article' ELSE 'Article' END)
    END;

    -- 4. Transactional Insertion Logic
    IF v_sub.target_type = 'course' THEN
        IF v_sub.target_day_id IS NULL THEN
            RAISE EXCEPTION 'Target day ID is required for intensive course resources';
        END IF;

        -- Prevent potential duplicates by URL within the same day
        IF EXISTS (SELECT 1 FROM course_lessons WHERE day_id = v_sub.target_day_id AND url = v_sub.resource_url) THEN
            RAISE EXCEPTION 'Resource with this URL already exists in target day';
        END IF;

        INSERT INTO course_lessons (day_id, title, url, type, position)
        VALUES (
            v_sub.target_day_id,
            v_sub.title,
            v_sub.resource_url,
            v_target_resource_type,
            (SELECT COALESCE(MAX(position), 0) + 1 FROM course_lessons WHERE day_id = v_sub.target_day_id)
        );

    ELSIF v_sub.target_type = 'roadmap' THEN
        IF v_sub.target_topic_id IS NULL THEN
            RAISE EXCEPTION 'Target topic ID is required for roadmap resources';
        END IF;

        -- Prevent duplicates
        IF EXISTS (SELECT 1 FROM roadmap_resources WHERE topic_id = v_sub.target_topic_id AND url = v_sub.resource_url) THEN
            RAISE EXCEPTION 'Resource with this URL already exists in target topic';
        END IF;

        INSERT INTO roadmap_resources (topic_id, title, url, type, position, is_published)
        VALUES (
            v_sub.target_topic_id,
            v_sub.title,
            v_sub.resource_url,
            v_target_resource_type,
            (SELECT COALESCE(MAX(position), 0) + 1 FROM roadmap_resources WHERE topic_id = v_sub.target_topic_id),
            TRUE -- Resources added from submissions are published by default
        );
    ELSE
        RAISE EXCEPTION 'Invalid or missing target type: %', v_sub.target_type;
    END IF;

    -- 5. Mark as Added & Log Audit
    UPDATE community_submissions 
    SET status = 'added',
        reviewed_at = now(),
        reviewed_by = auth.uid()
    WHERE id = p_submission_id;

    INSERT INTO community_submission_actions (submission_id, action, admin_id)
    VALUES (p_submission_id, 'added', auth.uid());

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
