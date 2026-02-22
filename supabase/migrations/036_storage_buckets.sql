-- ============================================================================
-- STORAGE BUCKETS AND POLICIES
-- ============================================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('course-thumbnails', 'course-thumbnails', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Avatar storage policies
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Anyone can upload an avatar" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Anyone can update their avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars');

-- Course thumbnail storage policies
CREATE POLICY "Course thumbnails are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'course-thumbnails');
CREATE POLICY "Authenticated users can upload course thumbnails" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'course-thumbnails' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update course thumbnails" ON storage.objects FOR UPDATE USING (bucket_id = 'course-thumbnails' AND auth.role() = 'authenticated');
