-- =============================================
-- UX Design Hub 2.0 — Database Schema
-- Migration: Create Roadmap Tables
-- User Request: 2026-02-19T10:58:40+00:00 UTC
-- =============================================

-- 1. Create roadmap_tracks table
CREATE TABLE roadmap_tracks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    color TEXT, -- Tailwind classes e.g. "from-amber-500 to-yellow-600"
    icon TEXT, -- Emoji or icon name
    position INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE roadmap_tracks IS 'Tracks for the Product Roadmap (e.g. Strategy, Launch)';

-- 2. Create roadmap_topics table
CREATE TABLE roadmap_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES roadmap_tracks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_roadmap_topics_category_id ON roadmap_topics(category_id);
COMMENT ON TABLE roadmap_topics IS 'Specific topics within a roadmap track (e.g. Product Vision)';

-- 3. Create roadmap_resources table
CREATE TABLE roadmap_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES roadmap_topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('Video', 'Article', 'Book', 'Podcast', 'Course', 'Tool')),
    label TEXT, -- e.g. "SVPG", "Medium"
    position INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_roadmap_resources_topic_id ON roadmap_resources(topic_id);
COMMENT ON TABLE roadmap_resources IS 'Resources linked to specific roadmap topics';

-- =============================================
-- 4. Enable Row Level Security (RLS)
-- =============================================

ALTER TABLE roadmap_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_resources ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 5. Create RLS Policies
-- =============================================

-- ROADMAP TRACKS
-- Anon: Read published
CREATE POLICY "Anon can view published roadmap tracks" 
ON roadmap_tracks FOR SELECT 
TO anon 
USING (is_published = true);

-- Auth: Full CRUD
CREATE POLICY "Authenticated users can manage roadmap tracks" 
ON roadmap_tracks FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- ROADMAP TOPICS
-- Anon: Read published
CREATE POLICY "Anon can view published roadmap topics" 
ON roadmap_topics FOR SELECT 
TO anon 
USING (is_published = true);

-- Auth: Full CRUD
CREATE POLICY "Authenticated users can manage roadmap topics" 
ON roadmap_topics FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);


-- ROADMAP RESOURCES
-- Anon: Read published
CREATE POLICY "Anon can view published roadmap resources" 
ON roadmap_resources FOR SELECT 
TO anon 
USING (is_published = true);

-- Auth: Full CRUD
CREATE POLICY "Authenticated users can manage roadmap resources" 
ON roadmap_resources FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- =============================================
-- 6. Grant Permissions (Optional but recommended)
-- =============================================
GRANT SELECT ON roadmap_tracks TO anon;
GRANT SELECT ON roadmap_topics TO anon;
GRANT SELECT ON roadmap_resources TO anon;

-- =============================================
-- 7. Automatic Updated_At Triggers
-- =============================================

-- 7.1 Create reusable function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7.2 Create Triggers

-- roadmap_tracks
DROP TRIGGER IF EXISTS update_roadmap_tracks_updated_at ON roadmap_tracks;
CREATE TRIGGER update_roadmap_tracks_updated_at
    BEFORE UPDATE ON roadmap_tracks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- roadmap_topics
DROP TRIGGER IF EXISTS update_roadmap_topics_updated_at ON roadmap_topics;
CREATE TRIGGER update_roadmap_topics_updated_at
    BEFORE UPDATE ON roadmap_topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- roadmap_resources
DROP TRIGGER IF EXISTS update_roadmap_resources_updated_at ON roadmap_resources;
CREATE TRIGGER update_roadmap_resources_updated_at
    BEFORE UPDATE ON roadmap_resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
