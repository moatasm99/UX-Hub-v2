-- =============================================
-- UX Design Hub 2.0 — Database Schema
-- Verification: Test Roadmap Tables & Relationships
-- User Request: 2026-02-19T10:14:46+00:00 UTC
-- =============================================

BEGIN; -- Start transaction to allow rollback if needed, or commit to save test data

-- 1. Check Table Existence
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('roadmap_tracks', 'roadmap_topics', 'roadmap_resources');

-- 2. Insert Test Data (Track -> Topic -> Resource)
WITH new_track AS (
    INSERT INTO roadmap_tracks (title, slug, color, icon, position, is_published)
    VALUES ('TEST_TRACK_001', 'test-integrity-check', 'bg-test-500', '🔒', 999, false)
    RETURNING id, title
),
new_topic AS (
    INSERT INTO roadmap_topics (category_id, title, description, position, is_published)
    SELECT id, 'TEST_TOPIC_001', 'Verifying Foreign Key Relationship', 1, false
    FROM new_track
    RETURNING id, title, category_id
),
new_resource AS (
    INSERT INTO roadmap_resources (topic_id, title, url, type, position, is_published)
    SELECT id, 'TEST_RESOURCE_001', 'https://test.example.com', 'Tool', 1, false
    FROM new_topic
    RETURNING id, title, topic_id
)
-- 3. Verify Foreign Key Relationships (Select Join)
SELECT 
    t.title as track,
    tp.title as topic,
    r.title as resource,
    r.url
FROM roadmap_tracks t
JOIN roadmap_topics tp ON tp.category_id = t.id
JOIN roadmap_resources r ON r.topic_id = tp.id
WHERE t.slug = 'test-integrity-check';

-- 4. Verify ON DELETE CASCADE
-- This step deletes the track and checks if dependent resources are removed.
-- Uncomment the following block to test CASCADE deletion:

/*
DELETE FROM roadmap_tracks WHERE slug = 'test-integrity-check';

SELECT 
    (SELECT COUNT(*) FROM roadmap_topics WHERE title = 'TEST_TOPIC_001') as topics_remaining,
    (SELECT COUNT(*) FROM roadmap_resources WHERE title = 'TEST_RESOURCE_001') as resources_remaining;
*/

ROLLBACK; -- Remove test data immediately. Change to COMMIT to keep it.
