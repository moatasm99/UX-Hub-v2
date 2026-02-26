-- =============================================
-- UX Design Hub 2.0 — Database Schema
-- Migration 001: Core Tables & Relations
-- =============================================

-- 1) Custom ENUM types
CREATE TYPE course_type AS ENUM ('intensive', 'roadmap');
CREATE TYPE resource_type AS ENUM ('video', 'article', 'playlist');

-- =============================================
-- 2) COURSES
-- =============================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    type course_type NOT NULL,
    icon TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE courses IS 'Intensive courses and roadmap tracks';

-- =============================================
-- 3) MODULES
-- =============================================
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    day_number INTEGER,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    is_required BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_modules_course_id ON modules(course_id);

COMMENT ON TABLE modules IS 'Learning modules/days within a course';

-- =============================================
-- 4) RESOURCES (Unified Resource Library)
-- =============================================
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type resource_type NOT NULL,
    provider TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE resources IS 'Reusable resource library (videos, articles, playlists)';

-- =============================================
-- 5) MODULE_RESOURCES (Many-to-Many Junction)
-- =============================================
CREATE TABLE module_resources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    is_core BOOLEAN NOT NULL DEFAULT TRUE,
    order_index INTEGER NOT NULL DEFAULT 0,
    UNIQUE(module_id, resource_id)
);

CREATE INDEX idx_module_resources_module_id ON module_resources(module_id);
CREATE INDEX idx_module_resources_resource_id ON module_resources(resource_id);

COMMENT ON TABLE module_resources IS 'Links resources to modules (many-to-many)';

-- =============================================
-- 6) TASKS
-- =============================================
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    deliverable_hint TEXT
);

CREATE INDEX idx_tasks_module_id ON tasks(module_id);

COMMENT ON TABLE tasks IS 'Deliverable tasks assigned to each module';

-- =============================================
-- 7) SITE_CONFIG (Global Content Control)
-- =============================================
CREATE TABLE site_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}'::jsonb
);

COMMENT ON TABLE site_config IS 'Key-value store for global site configuration';
