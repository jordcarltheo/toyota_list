-- Fix listings RLS policies to allow anonymous listing creation
-- This migration handles the case where users are created during listing submission

-- First, ensure RLS is enabled on listings table
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can create their own listings" ON listings;
DROP POLICY IF EXISTS "Allow insert listings" ON listings;
DROP POLICY IF EXISTS "Allow anonymous listing creation" ON listings;
DROP POLICY IF EXISTS "Anyone can view active listings" ON listings;
DROP POLICY IF EXISTS "Users can view their own listings" ON listings;
DROP POLICY IF EXISTS "Admins can view all listings" ON listings;
DROP POLICY IF EXISTS "Users can update their own listings" ON listings;
DROP POLICY IF EXISTS "Users can delete their own listings" ON listings;
DROP POLICY IF EXISTS "Admins can manage all listings" ON listings;
DROP POLICY IF EXISTS "Allow read listings" ON listings;
DROP POLICY IF EXISTS "Allow update own listings" ON listings;
DROP POLICY IF EXISTS "Allow delete own listings" ON listings;

-- Create clean, comprehensive policies
CREATE POLICY "Allow anonymous listing creation" ON listings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can view active listings" ON listings
  FOR SELECT USING (status = 'active');

CREATE POLICY "Users can view their own listings" ON listings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own listings" ON listings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listings" ON listings
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all listings" ON listings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );
