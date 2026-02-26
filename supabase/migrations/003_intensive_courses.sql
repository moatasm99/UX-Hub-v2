-- =============================================
-- UX Design Hub 2.0
-- Intensive Courses Clean Architecture
-- =============================================

-- Enable extension for UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 1️⃣ Course Categories
-- =============================================

CREATE TABLE course_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    position INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- 2️⃣ Courses
-- =============================================

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES course_categories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_description TEXT,
    level TEXT CHECK (level IN ('Beginner','Intermediate','Advanced')),
    position INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_courses_category_id ON courses(category_id);

-- =============================================
-- 3️⃣ Course Days
-- =============================================

CREATE TABLE course_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_course_days_course_id ON course_days(course_id);

-- =============================================
-- 4️⃣ Course Lessons
-- =============================================

CREATE TABLE course_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID NOT NULL REFERENCES course_days(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    type TEXT CHECK (type IN ('Video','Article')) NOT NULL,
    duration TEXT,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_course_lessons_day_id ON course_lessons(day_id);

-- =============================================
-- 5️⃣ Course Tasks
-- =============================================

CREATE TABLE course_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES course_lessons(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_course_tasks_lesson_id ON course_tasks(lesson_id);

-- =============================================
-- 6️⃣ Updated_at Trigger (Reusable)
-- =============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_categories_updated_at
BEFORE UPDATE ON course_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_days_updated_at
BEFORE UPDATE ON course_days
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_lessons_updated_at
BEFORE UPDATE ON course_lessons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_tasks_updated_at
BEFORE UPDATE ON course_tasks
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
