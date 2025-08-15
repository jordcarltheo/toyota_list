-- Comprehensive schema fix for Toyota marketplace
-- This migration handles all potential missing columns and tables

-- 1. Fix listings table - add missing columns if they don't exist
DO $$
BEGIN
    -- Add location_country column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'location_country') THEN
        ALTER TABLE listings ADD COLUMN location_country TEXT DEFAULT 'US' CHECK (location_country IN ('US', 'CA', 'MX'));
    END IF;
    
    -- Add postal_code column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'listings' AND column_name = 'postal_code') THEN
        ALTER TABLE listings ADD COLUMN postal_code TEXT;
    END IF;
    
    -- Update existing listings to have US as default country if not already set
    UPDATE listings SET location_country = 'US' WHERE location_country IS NULL;
END $$;

-- 2. Create listing_contacts table if it doesn't exist
CREATE TABLE IF NOT EXISTS listing_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_location_country ON listings(location_country);
CREATE INDEX IF NOT EXISTS idx_listings_location ON listings(location_city, location_state, location_country);
CREATE INDEX IF NOT EXISTS idx_listing_contacts_listing_id ON listing_contacts(listing_id);

-- 4. Ensure RLS is properly configured on all tables
-- Profiles table RLS policies
DROP POLICY IF EXISTS "Allow insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow delete own profile" ON profiles;

CREATE POLICY "Allow insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow update own profile" ON profiles FOR UPDATE USING (id = auth.uid() OR auth.uid() IS NULL);
CREATE POLICY "Allow delete own profile" ON profiles FOR DELETE USING (id = auth.uid() OR auth.uid() IS NULL);

-- Listings table RLS policies
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert listings" ON listings;
DROP POLICY IF EXISTS "Allow read listings" ON listings;
DROP POLICY IF EXISTS "Allow update own listings" ON listings;
DROP POLICY IF EXISTS "Allow delete own listings" ON listings;

CREATE POLICY "Allow insert listings" ON listings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read listings" ON listings FOR SELECT USING (status = 'active');
CREATE POLICY "Allow update own listings" ON listings FOR UPDATE USING (user_id = auth.uid() OR auth.uid() IS NULL);
CREATE POLICY "Allow delete own listings" ON listings FOR DELETE USING (user_id = auth.uid() OR auth.uid() IS NULL);

-- Listing contacts table RLS policies
ALTER TABLE listing_contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow insert listing contacts" ON listing_contacts;
DROP POLICY IF EXISTS "Allow view paid contacts" ON listing_contacts;
DROP POLICY IF EXISTS "Allow update own contacts" ON listing_contacts;
DROP POLICY IF EXISTS "Allow delete own contacts" ON listing_contacts;

CREATE POLICY "Allow insert listing contacts" ON listing_contacts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow view paid contacts" ON listing_contacts FOR SELECT USING (false); -- Will be updated when payment system is implemented
CREATE POLICY "Allow update own contacts" ON listing_contacts FOR UPDATE USING (
  listing_id IN (SELECT id FROM listings WHERE user_id = auth.uid() OR auth.uid() IS NULL)
);
CREATE POLICY "Allow delete own contacts" ON listing_contacts FOR DELETE USING (
  listing_id IN (SELECT id FROM listings WHERE user_id = auth.uid() OR auth.uid() IS NULL)
);
