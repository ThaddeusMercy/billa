-- Storage policies for avatars bucket

-- Allow authenticated users to upload avatars
CREATE POLICY "Anyone can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow authenticated users to update avatars  
CREATE POLICY "Anyone can update avatars" ON storage.objects  
FOR UPDATE WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete avatars
CREATE POLICY "Anyone can delete avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow public read access to avatars
CREATE POLICY "Avatars are publicly accessible" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars'); 