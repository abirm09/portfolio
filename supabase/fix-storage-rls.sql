-- Run this once in the Supabase SQL Editor for an existing portfolio project.
-- Match the bucket to NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET in the app.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  10485760,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760;

-- Remove the old anonymous write policies, if the initial schema created them.
DROP POLICY IF EXISTS "Allow uploads to project bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow updates to project bucket files" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete from project bucket" ON storage.objects;

DROP POLICY IF EXISTS "Public can read project images" ON storage.objects;
CREATE POLICY "Public can read project images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Authenticated users can upload project images" ON storage.objects;
CREATE POLICY "Authenticated users can upload project images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images');

DROP POLICY IF EXISTS "Authenticated users can delete project images" ON storage.objects;
CREATE POLICY "Authenticated users can delete project images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images');
