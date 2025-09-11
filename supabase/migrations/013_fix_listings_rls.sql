-- Fix listings RLS policies to allow anonymous listing creation
-- This migration handles the case where users are created during listing submission

-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can create their own listings" ON listings;
DROP POLICY IF EXISTS "Allow insert listings" ON listings;

-- Create new policy that allows anonymous users to create listings
-- This is needed because we create the user account during listing submission
CREATE POLICY "Allow anonymous listing creation" ON listings
  FOR INSERT WITH CHECK (true);

-- Keep existing policies for other operations
-- (The other policies should already exist from previous migrations)
