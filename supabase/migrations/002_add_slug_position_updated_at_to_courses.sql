-- =============================================
-- Migration 002: Add slug, position, updated_at to courses
-- Date: 2026-02-19
-- =============================================

-- 1) Add slug column (TEXT, UNIQUE, NOT NULL)
--    Backfill existing rows with a generated slug from title before adding NOT NULL
ALTER TABLE courses ADD COLUMN IF NOT EXISTS slug TEXT;

-- Backfill: generate slug from title for any existing rows
UPDATE courses
SET slug = LOWER(REGEXP_REPLACE(REPLACE(title, ' ', '-'), '[^a-z0-9\-]', '', 'g'))
WHERE slug IS NULL;

-- Ensure no duplicate slugs after backfill (append ID suffix if needed)
UPDATE courses c1
SET slug = c1.slug || '-' || LEFT(c1.id::text, 8)
WHERE EXISTS (
    SELECT 1 FROM courses c2
    WHERE c2.slug = c1.slug AND c2.id != c1.id
);

-- Now enforce NOT NULL and UNIQUE
ALTER TABLE courses ALTER COLUMN slug SET NOT NULL;
ALTER TABLE courses ADD CONSTRAINT courses_slug_unique UNIQUE (slug);

-- 2) Create index on slug
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);

-- 3) Add position column
ALTER TABLE courses ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- 4) Add updated_at column
ALTER TABLE courses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 5) Create or replace the trigger function (reusable across tables)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6) Drop trigger if exists, then create
DROP TRIGGER IF EXISTS set_courses_updated_at ON courses;

CREATE TRIGGER set_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
