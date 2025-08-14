-- Fix RLS policies on profiles table to allow anonymous users
-- First, drop existing restrictive policies
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON profiles;

-- Create new policies that allow anonymous operations
-- Allow anyone to insert profiles (for anonymous users)
CREATE POLICY "Allow insert profiles" ON profiles
FOR INSERT WITH CHECK (true);

-- Allow anyone to read profiles
CREATE POLICY "Allow read profiles" ON profiles
FOR SELECT USING (true);

-- Allow users to update their own profile
CREATE POLICY "Allow update own profile" ON profiles
FOR UPDATE USING (id = auth.uid() OR auth.uid() IS NULL);

-- Allow users to delete their own profile
CREATE POLICY "Allow delete own profile" ON profiles
FOR DELETE USING (id = auth.uid() OR auth.uid() IS NULL);
