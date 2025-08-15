-- Clean setup for storage and photos - handles existing policies gracefully

-- 1. Create storage bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'listing-photos',
  'listing-photos',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- 2. Drop ALL existing storage policies for listing-photos bucket
DROP POLICY IF EXISTS "Public read access to listing photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow uploads to listing photos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow listing owners to manage photos" ON storage.objects;
DROP POLICY IF EXISTS "Allow listing owners to delete photos" ON storage.objects;

-- 3. Create clean storage policies
CREATE POLICY "listing_photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'listing-photos');

CREATE POLICY "listing_photos_public_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'listing-photos');

CREATE POLICY "listing_photos_public_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'listing-photos');

CREATE POLICY "listing_photos_public_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'listing-photos');

-- 4. Drop ALL existing listing_photos table policies
DROP POLICY IF EXISTS "Anyone can view photos of active listings" ON listing_photos;
DROP POLICY IF EXISTS "Anyone can insert photos" ON listing_photos;
DROP POLICY IF EXISTS "Listing owners can update photos" ON listing_photos;
DROP POLICY IF EXISTS "Listing owners can delete photos" ON listing_photos;
DROP POLICY IF EXISTS "Users can view their own listing photos" ON listing_photos;
DROP POLICY IF EXISTS "Users can create their own listing photos" ON listing_photos;
DROP POLICY IF EXISTS "Users can update their own listing photos" ON listing_photos;
DROP POLICY IF EXISTS "Users can delete their own listing photos" ON listing_photos;
DROP POLICY IF EXISTS "Admins can manage all listing photos" ON listing_photos;

-- 5. Create clean listing_photos table policies
CREATE POLICY "listing_photos_select" ON listing_photos
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings WHERE status = 'active'
    )
  );

CREATE POLICY "listing_photos_insert" ON listing_photos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "listing_photos_update" ON listing_photos
  FOR UPDATE USING (true);

CREATE POLICY "listing_photos_delete" ON listing_photos
  FOR DELETE USING (true);
