-- =============================================
-- Migration: Community Submissions System
-- Includes: Main Table, Audit Table, RLS, Indexes, and RPC Function
-- Target Tables: course_lessons, roadmap_resources
-- =============================================

-- 1. Main Table: community_submissions
CREATE TABLE IF NOT EXISTS community_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    type TEXT NOT NULL CHECK (type IN ('feedback', 'suggestion', 'resource')),
    name TEXT,
    email TEXT,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    
    -- Resource Metadata (Optional for feedback/suggestion)
    resource_url TEXT,
    resource_type TEXT CHECK (resource_type IN ('video', 'article', 'playlist', 'tool', 'other')),
    
    -- Moderation Status
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'added')) DEFAULT 'pending',
    admin_notes TEXT,
    
    -- Target Association (For resources)
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

-- 3. Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_community_submissions_status ON community_submissions(status);
CREATE INDEX IF NOT EXISTS idx_community_submissions_type ON community_submissions(type);
CREATE INDEX IF NOT EXISTS idx_community_submissions_target_type ON community_submissions(target_type);
CREATE INDEX IF NOT EXISTS idx_community_submissions_created_at ON community_submissions(created_at);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE community_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_submission_actions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- community_submissions
DROP POLICY IF EXISTS "Public can submit" ON community_submissions;
CREATE POLICY "Public can submit" ON community_submissions
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can manage submissions" ON community_submissions;
CREATE POLICY "Admins can manage submissions" ON community_submissions
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- community_submission_actions
DROP POLICY IF EXISTS "Admins can manage actions" ON community_submission_actions;
CREATE POLICY "Admins can manage actions" ON community_submission_actions
    FOR ALL TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. RPC Function: add_submission_to_target
CREATE OR REPLACE FUNCTION add_submission_to_target(p_submission_id UUID)
RETURNS VOID AS $$
DECLARE
    v_sub RECORD;
    v_new_id UUID;
    v_target_resource_type TEXT;
BEGIN
    -- 1. Fetch submission details
    SELECT * INTO v_sub FROM community_submissions WHERE id = p_submission_id;
    
    -- 2. Validate
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Submission % not found', p_submission_id;
    END IF;

    IF v_sub.status != 'approved' THEN
        RAISE EXCEPTION 'Only approved submissions can be converted to resources';
    END IF;

    IF v_sub.type != 'resource' THEN
        RAISE EXCEPTION 'Submission type must be "resource"';
    END IF;

    -- 3. Map Resource Type
    -- Mapping from community_submissions to target table constraints
    v_target_resource_type := CASE v_sub.resource_type
        WHEN 'video' THEN 'Video'
        WHEN 'article' THEN 'Article'
        WHEN 'playlist' THEN (CASE WHEN v_sub.target_type = 'roadmap' THEN 'Course' ELSE 'Article' END)
        WHEN 'tool' THEN (CASE WHEN v_sub.target_type = 'roadmap' THEN 'Tool' ELSE 'Article' END)
        ELSE (CASE WHEN v_sub.target_type = 'roadmap' THEN 'Article' ELSE 'Article' END)
    END;

    -- 4. Insert into Target Table
    IF v_sub.target_type = 'course' THEN
        IF v_sub.target_day_id IS NULL THEN
            RAISE EXCEPTION 'Target day ID is required for course resources';
        END IF;

        -- Prevent duplicates
        IF EXISTS (SELECT 1 FROM course_lessons WHERE day_id = v_sub.target_day_id AND url = v_sub.resource_url) THEN
            RAISE EXCEPTION 'Resource already exists in target day';
        END IF;

        INSERT INTO course_lessons (day_id, title, url, type, position)
        VALUES (
            v_sub.target_day_id,
            v_sub.title,
            v_sub.resource_url,
            v_target_resource_type,
            (SELECT COALESCE(MAX(position), 0) + 1 FROM course_lessons WHERE day_id = v_sub.target_day_id)
        ) RETURNING id INTO v_new_id;

    ELSIF v_sub.target_type = 'roadmap' THEN
        IF v_sub.target_topic_id IS NULL THEN
            RAISE EXCEPTION 'Target topic ID is required for roadmap resources';
        END IF;

        -- Prevent duplicates
        IF EXISTS (SELECT 1 FROM roadmap_resources WHERE topic_id = v_sub.target_topic_id AND url = v_sub.resource_url) THEN
            RAISE EXCEPTION 'Resource already exists in target topic';
        END IF;

        INSERT INTO roadmap_resources (topic_id, title, url, type, position, is_published)
        VALUES (
            v_sub.target_topic_id,
            v_sub.title,
            v_sub.resource_url,
            v_target_resource_type,
            (SELECT COALESCE(MAX(position), 0) + 1 FROM roadmap_resources WHERE topic_id = v_sub.target_topic_id),
            TRUE -- Default to published
        ) RETURNING id INTO v_new_id;
    ELSE
        RAISE EXCEPTION 'Invalid target type: %', v_sub.target_type;
    END IF;

    -- 5. Update Submission Status
    UPDATE community_submissions 
    SET status = 'added',
        reviewed_at = now(),
        reviewed_by = auth.uid()
    WHERE id = p_submission_id;

    -- 6. Insert Audit Log
    INSERT INTO community_submission_actions (submission_id, action, admin_id)
    VALUES (p_submission_id, 'added', auth.uid());

END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
