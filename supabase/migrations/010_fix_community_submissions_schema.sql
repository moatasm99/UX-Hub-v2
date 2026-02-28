-- =============================================
-- Migration: Fix Community Submissions Schema Mismatch
-- Purpose: Add missing context columns and align URL naming with frontend service
-- =============================================

-- 1. Add missing context columns
ALTER TABLE community_submissions 
ADD COLUMN IF NOT EXISTS context_url TEXT,
ADD COLUMN IF NOT EXISTS context_title TEXT;

-- 2. Rename resource_url to url to match frontend service naming
-- Using a safe rename block
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'community_submissions' 
        AND column_name = 'resource_url'
    ) THEN
        ALTER TABLE community_submissions RENAME COLUMN resource_url TO url;
    END IF;
END $$;

-- 3. Update the RPC function to handle the renamed column
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
        IF EXISTS (SELECT 1 FROM course_lessons WHERE day_id = v_sub.target_day_id AND url = v_sub.url) THEN
            RAISE EXCEPTION 'Resource with this URL already exists in target day';
        END IF;

        INSERT INTO course_lessons (day_id, title, url, type, position)
        VALUES (
            v_sub.target_day_id,
            v_sub.title,
            v_sub.url,
            v_target_resource_type,
            (SELECT COALESCE(MAX(position), 0) + 1 FROM course_lessons WHERE day_id = v_sub.target_day_id)
        );

    ELSIF v_sub.target_type = 'roadmap' THEN
        IF v_sub.target_topic_id IS NULL THEN
            RAISE EXCEPTION 'Target topic ID is required for roadmap resources';
        END IF;

        -- Prevent duplicates
        IF EXISTS (SELECT 1 FROM roadmap_resources WHERE topic_id = v_sub.target_topic_id AND url = v_sub.url) THEN
            RAISE EXCEPTION 'Resource with this URL already exists in target topic';
        END IF;

        INSERT INTO roadmap_resources (topic_id, title, url, type, position, is_published)
        VALUES (
            v_sub.target_topic_id,
            v_sub.title,
            v_sub.url,
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
