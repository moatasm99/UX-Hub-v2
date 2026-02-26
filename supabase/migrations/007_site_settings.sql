-- ═══════════════════════════════════════════════════
-- Site Settings (Single-Row CMS Table)
-- ═══════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hero_badge_text TEXT NOT NULL DEFAULT '✨ Curated by Moatasm',
    hero_title_line_1 TEXT NOT NULL DEFAULT 'يا مرحب بمرعبين الـ ITI 👋',
    hero_title_line_2 TEXT NOT NULL DEFAULT 'أنا معتصم شعبان',
    hero_role_label TEXT NOT NULL DEFAULT 'Product Designer',
    hero_description TEXT DEFAULT 'عملت المنصة دي لسبب بسيط: أنا كنت مكانكم في يوم من الأيام. كنت بسأل ''أبدأ منين؟'' و ''إيه المصادر اللي أثق فيها؟''.
الرحلة كانت مليانة تشتت، وعشان كدة قررت أرسم ليكم الخريطة اللي كنت أتمنى ألاقيها وقتها.

الهدف إني أوفر عليكم التوهة اللي ناس كتير عاشتها، وأقدم لكم خلاصة المصادر العالمية في مكان واحد. سواء كنت ابن الـ ITI أو لسه بتبدأ طريقك.. المنصة دي صُنعت بكل حب، لتكون دليلك للاحتراف. ❤️',
    hero_button_text TEXT NOT NULL DEFAULT 'Let''s Connect',
    hero_button_url TEXT NOT NULL DEFAULT 'https://www.linkedin.com/in/moatasm-shaban-7994711a2/',
    hero_image_url TEXT DEFAULT '/images/creator.jpg',
    hero_experience_label TEXT NOT NULL DEFAULT 'Experience',
    hero_experience_value TEXT NOT NULL DEFAULT 'Product Design',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ─── Insert default singleton row (fixed UUID) ───
INSERT INTO site_settings (id)
VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- ─── Prevent additional rows ───
CREATE OR REPLACE FUNCTION enforce_single_row_site_settings()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM site_settings) >= 1 THEN
        RAISE EXCEPTION 'site_settings allows only one row';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_single_row_site_settings
    BEFORE INSERT ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION enforce_single_row_site_settings();

-- ─── Auto-update updated_at ───
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_site_settings_updated_at
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_site_settings_updated_at();

-- ─── RLS Policies ───
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read site_settings"
    ON site_settings FOR SELECT
    USING (true);

CREATE POLICY "Authenticated update site_settings"
    ON site_settings FOR UPDATE
    USING (auth.role() = 'authenticated');

-- ─── Enable Realtime ───
ALTER PUBLICATION supabase_realtime ADD TABLE site_settings;
