-- Fix foreign key constraint issue between profiles and users tables
-- This allows anonymous users to create profiles without needing entries in users table

-- Drop the foreign key constraint if it exists (simpler approach)
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Ensure profiles table has proper structure for anonymous users
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Update RLS policies to ensure they work with anonymous users
DROP POLICY IF EXISTS "Allow insert profiles" ON profiles;
DROP POLICY IF EXISTS "Allow read profiles" ON profiles;
DROP POLICY IF EXISTS "Allow update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow delete own profile" ON profiles;

CREATE POLICY "Allow insert profiles" ON profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow update own profile" ON profiles FOR UPDATE USING (id = auth.uid() OR auth.uid() IS NULL);
CREATE POLICY "Allow delete own profile" ON profiles FOR DELETE USING (id = auth.uid() OR auth.uid() IS NULL);
