-- Create secure listing contacts table for storing seller contact information
CREATE TABLE IF NOT EXISTS listing_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add index for performance
CREATE INDEX IF NOT EXISTS idx_listing_contacts_listing_id ON listing_contacts(listing_id);

-- Add RLS policies for security
ALTER TABLE listing_contacts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact info (when creating listings)
CREATE POLICY "Allow insert listing contacts" ON listing_contacts
FOR INSERT WITH CHECK (true);

-- Only allow viewing contact info for paid transactions (future implementation)
CREATE POLICY "Allow view paid contacts" ON listing_contacts
FOR SELECT USING (false); -- This will be updated when payment system is implemented

-- Allow sellers to update their own contact info
CREATE POLICY "Allow update own contacts" ON listing_contacts
FOR UPDATE USING (listing_id IN (
  SELECT id FROM listings WHERE user_id = auth.uid()
));

-- Allow sellers to delete their own contact info
CREATE POLICY "Allow delete own contacts" ON listing_contacts
FOR DELETE USING (listing_id IN (
  SELECT id FROM listings WHERE user_id = auth.uid()
));
