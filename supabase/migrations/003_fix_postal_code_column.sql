-- Fix missing postal_code column
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Update existing listings to have US as default country if not already set
UPDATE listings SET location_country = 'US' WHERE location_country IS NULL;

-- Create index for location_country if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_listings_location_country ON listings(location_country);

-- Update the existing location index to include country if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_listings_location') THEN
        CREATE INDEX idx_listings_location ON listings(location_city, location_state, location_country);
    END IF;
END $$;
