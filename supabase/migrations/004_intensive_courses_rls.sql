-- =============================================
-- UX Design Hub 2.0 — Row Level Security
-- Migration 004: RLS Policies for Intensive Courses
-- =============================================

-- =============================================
-- Enable RLS on all intensive course tables
-- =============================================
ALTER TABLE course_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_tasks ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PUBLIC READ POLICIES (anon role)
-- =============================================

-- Course Categories: public can read published
CREATE POLICY "Public can view published course_categories"
    ON course_categories FOR SELECT
    TO anon
    USING (is_published = TRUE);

-- Course Days: public can read days of published courses
CREATE POLICY "Public can view course_days of published courses"
    ON course_days FOR SELECT
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = course_days.course_id
            AND courses.is_published = TRUE
        )
    );

-- Course Lessons: public can read lessons of published courses
CREATE POLICY "Public can view course_lessons of published courses"
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

-- Course Tasks: public can read tasks of published courses
CREATE POLICY "Public can view course_tasks of published courses"
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
-- ADMIN POLICIES (authenticated role)
-- Full CRUD for authenticated/admin users
-- =============================================

CREATE POLICY "Admin full access to course_categories"
    ON course_categories FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Admin full access to course_days"
    ON course_days FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Admin full access to course_lessons"
    ON course_lessons FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

CREATE POLICY "Admin full access to course_tasks"
    ON course_tasks FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);
