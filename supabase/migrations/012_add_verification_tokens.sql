-- Add verification tokens table for listing verification
CREATE TABLE listing_verification_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX idx_listing_verification_tokens_listing_id ON listing_verification_tokens(listing_id);
CREATE INDEX idx_listing_verification_tokens_token ON listing_verification_tokens(token);
CREATE INDEX idx_listing_verification_tokens_expires_at ON listing_verification_tokens(expires_at);

-- Enable RLS
ALTER TABLE listing_verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Anyone can view verification tokens" ON listing_verification_tokens
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert verification tokens" ON listing_verification_tokens
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update verification tokens" ON listing_verification_tokens
  FOR UPDATE USING (true);
