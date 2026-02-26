-- ═══════════════════════════════════════════════════
-- Hero Images Storage Bucket + Policies
-- ═══════════════════════════════════════════════════
-- Run this in Supabase SQL Editor

-- 1. Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'hero-images',
    'hero-images',
    true,
    5242880,  -- 5MB
    ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Public read access
CREATE POLICY "Public read hero-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'hero-images');

-- 3. Authenticated upload
CREATE POLICY "Authenticated upload hero-images"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'hero-images'
    AND auth.role() = 'authenticated'
);

-- 4. Authenticated update (upsert)
CREATE POLICY "Authenticated update hero-images"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'hero-images'
    AND auth.role() = 'authenticated'
);

-- 5. Authenticated delete (cleanup old images)
CREATE POLICY "Authenticated delete hero-images"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'hero-images'
    AND auth.role() = 'authenticated'
);
