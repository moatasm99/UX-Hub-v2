-- =============================================
-- UX Design Hub 2.0 — Complete RLS Policies
-- Migration 005: Corrected & Complete RLS Setup
--
-- SECURITY MODEL:
--   anon         → SELECT only (published content)
--   authenticated → full CRUD (admin operations)
--
-- This migration is IDEMPOTENT — safe to re-run.
-- It drops any incorrect policies and re-creates
-- the correct ones for ALL intensive course tables.
-- =============================================

-- =============================================
-- 1. Enable RLS on ALL tables (idempotent)
-- =============================================
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_days       ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons    ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tasks      ENABLE ROW LEVEL SECURITY;

-- =============================================
-- 2. Drop ALL existing policies (clean slate)
-- =============================================

-- course_categories
DROP POLICY IF EXISTS "Public can view published course_categories"  ON course_categories;
DROP POLICY IF EXISTS "Admin full access to course_categories"       ON course_categories;
DROP POLICY IF EXISTS "Anon full access to course_categories"        ON course_categories;
DROP POLICY IF EXISTS "Anon full write access to course_categories"  ON course_categories;

-- courses
DROP POLICY IF EXISTS "Anon full access to courses"                  ON courses;
DROP POLICY IF EXISTS "Anon full write access to courses"            ON courses;
DROP POLICY IF EXISTS "Admin full access to courses"                 ON courses;

-- course_days
DROP POLICY IF EXISTS "Public can view course_days of published courses" ON course_days;
DROP POLICY IF EXISTS "Admin full access to course_days"                 ON course_days;
DROP POLICY IF EXISTS "Anon full access to course_days"                  ON course_days;
DROP POLICY IF EXISTS "Anon full write access to course_days"            ON course_days;

-- course_lessons
DROP POLICY IF EXISTS "Public can view course_lessons of published courses" ON course_lessons;
DROP POLICY IF EXISTS "Admin full access to course_lessons"                 ON course_lessons;
DROP POLICY IF EXISTS "Anon full access to course_lessons"                  ON course_lessons;
DROP POLICY IF EXISTS "Anon full write access to course_lessons"            ON course_lessons;

-- course_tasks
DROP POLICY IF EXISTS "Public can view course_tasks of published courses" ON course_tasks;
DROP POLICY IF EXISTS "Admin full access to course_tasks"                 ON course_tasks;
DROP POLICY IF EXISTS "Anon full access to course_tasks"                  ON course_tasks;
DROP POLICY IF EXISTS "Anon full write access to course_tasks"            ON course_tasks;

-- =============================================
-- 3. PUBLIC READ POLICIES (anon → SELECT only)
-- =============================================

CREATE POLICY "anon_select_published_categories"
    ON course_categories FOR SELECT
    TO anon
    USING (is_published = TRUE);

CREATE POLICY "anon_select_published_courses"
    ON courses FOR SELECT
    TO anon
    USING (is_published = TRUE);

CREATE POLICY "anon_select_course_days"
    ON course_days FOR SELECT
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = course_days.course_id
            AND courses.is_published = TRUE
        )
    );

CREATE POLICY "anon_select_course_lessons"
    ON course_lessons FOR SELECT
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM course_days
            JOIN courses ON courses.id = course_days.course_id
            WHERE course_days.id = course_lessons.day_id
            AND courses.is_published = TRUE
        )
    );

CREATE POLICY "anon_select_course_tasks"
    ON course_tasks FOR SELECT
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM course_lessons
            JOIN course_days ON course_days.id = course_lessons.day_id
            JOIN courses ON courses.id = course_days.course_id
            WHERE course_lessons.id = course_tasks.lesson_id
            AND courses.is_published = TRUE
        )
    );

-- =============================================
-- 4. ADMIN POLICIES (authenticated → full CRUD)
-- =============================================

CREATE POLICY "authenticated_all_course_categories"
    ON course_categories FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "authenticated_all_courses"
    ON courses FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "authenticated_all_course_days"
    ON course_days FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "authenticated_all_course_lessons"
    ON course_lessons FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "authenticated_all_course_tasks"
    ON course_tasks FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);
