-- =============================================
-- UX Design Hub 2.0 — Row Level Security
-- Migration 002: RLS Policies
-- =============================================

-- =============================================
-- Enable RLS on ALL tables
-- =============================================
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- =============================================
-- PUBLIC READ POLICIES (anon role)
-- Users can only read published courses and their relations
-- =============================================

-- Courses: public can read only published
CREATE POLICY "Public can view published courses"
    ON courses FOR SELECT
    TO anon
    USING (is_published = TRUE);

-- Modules: public can read modules of published courses
CREATE POLICY "Public can view modules of published courses"
    ON modules FOR SELECT
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM courses
            WHERE courses.id = modules.course_id
            AND courses.is_published = TRUE
        )
    );

-- Resources: public can read active resources
CREATE POLICY "Public can view active resources"
    ON resources FOR SELECT
    TO anon
    USING (is_active = TRUE);

-- Module Resources: public can read links for published course modules
CREATE POLICY "Public can view module resources of published courses"
    ON module_resources FOR SELECT
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM modules
            JOIN courses ON courses.id = modules.course_id
            WHERE modules.id = module_resources.module_id
            AND courses.is_published = TRUE
        )
    );

-- Tasks: public can read tasks for published course modules
CREATE POLICY "Public can view tasks of published courses"
    ON tasks FOR SELECT
    TO anon
    USING (
        EXISTS (
            SELECT 1 FROM modules
            JOIN courses ON courses.id = modules.course_id
            WHERE modules.id = tasks.module_id
            AND courses.is_published = TRUE
        )
    );

-- Site Config: public can read all config
CREATE POLICY "Public can view site config"
    ON site_config FOR SELECT
    TO anon
    USING (TRUE);

-- =============================================
-- ADMIN POLICIES (authenticated role)
-- Full CRUD for authenticated/admin users
-- =============================================

-- Courses: admin full access
CREATE POLICY "Admin full access to courses"
    ON courses FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Modules: admin full access
CREATE POLICY "Admin full access to modules"
    ON modules FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Resources: admin full access
CREATE POLICY "Admin full access to resources"
    ON resources FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Module Resources: admin full access
CREATE POLICY "Admin full access to module_resources"
    ON module_resources FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Tasks: admin full access
CREATE POLICY "Admin full access to tasks"
    ON tasks FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);

-- Site Config: admin full access
CREATE POLICY "Admin full access to site_config"
    ON site_config FOR ALL
    TO authenticated
    USING (TRUE)
    WITH CHECK (TRUE);
