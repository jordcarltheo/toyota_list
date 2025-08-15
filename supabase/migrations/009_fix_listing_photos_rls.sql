-- Drop existing restrictive policies on listing_photos
DROP POLICY IF EXISTS "Anyone can view photos of active listings" ON listing_photos;
DROP POLICY IF EXISTS "Listing owners can manage photos" ON listing_photos;
DROP POLICY IF EXISTS "Admins can manage all photos" ON listing_photos;

-- Create new policies that allow anonymous operations
CREATE POLICY "Anyone can view photos of active listings" ON listing_photos
  FOR SELECT USING (
    listing_id IN (
      SELECT id FROM listings WHERE status = 'active'
    )
  );

CREATE POLICY "Anyone can insert photos" ON listing_photos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Listing owners can update photos" ON listing_photos
  FOR UPDATE USING (
    listing_id IN (
      SELECT id FROM listings WHERE user_id = auth.uid() OR auth.uid() IS NULL
    )
  );

CREATE POLICY "Listing owners can delete photos" ON listing_photos
  FOR DELETE USING (
    listing_id IN (
      SELECT id FROM listings WHERE user_id = auth.uid() OR auth.uid() IS NULL
    )
  );
