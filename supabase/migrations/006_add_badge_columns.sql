-- =============================================
-- Migration 006: Add badge + icon columns to courses
-- badge_label/badge_color: Custom badge styling
-- icon_key: References SVG file in /assets/course-icons/
-- icon_bg_color: Background color for icon container
-- =============================================

ALTER TABLE courses ADD COLUMN IF NOT EXISTS badge_label TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS badge_color TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS icon_key TEXT;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS icon_bg_color TEXT DEFAULT '#F5F5F5';

COMMENT ON COLUMN courses.badge_label IS 'Custom badge text shown on course cards (e.g. "Foundation", "Expert")';
COMMENT ON COLUMN courses.badge_color IS 'Tailwind gradient classes for badge (e.g. "from-emerald-500 to-teal-600")';
COMMENT ON COLUMN courses.icon_key IS 'References SVG icon file at /assets/course-icons/{icon_key}.svg';
COMMENT ON COLUMN courses.icon_bg_color IS 'Background color for the icon container (hex value, e.g. "#E8F5E9")';
