-- Create storage bucket for listing photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-photos',
  'listing-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policy to allow public read access to listing photos
CREATE POLICY "Public read access to listing photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-photos');

-- Create storage policy to allow authenticated users to upload photos
CREATE POLICY "Allow uploads to listing photos bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'listing-photos');

-- Create storage policy to allow listing owners to update/delete their photos
CREATE POLICY "Allow listing owners to manage photos" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'listing-photos' AND 
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM listings WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Allow listing owners to delete photos" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'listing-photos' AND 
    (storage.foldername(name))[1] IN (
      SELECT id::text FROM listings WHERE user_id = auth.uid()
    )
  );
