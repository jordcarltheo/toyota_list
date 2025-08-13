-- Add location_country and postal_code columns to listings table
ALTER TABLE listings 
ADD COLUMN location_country TEXT DEFAULT 'US' CHECK (location_country IN ('US', 'CA', 'MX')),
ADD COLUMN postal_code TEXT;

-- Update existing listings to have US as default country
UPDATE listings SET location_country = 'US' WHERE location_country IS NULL;

-- Create index for location_country for better query performance
CREATE INDEX idx_listings_location_country ON listings(location_country);

-- Update the existing location index to include country
DROP INDEX IF EXISTS idx_listings_location;
CREATE INDEX idx_listings_location ON listings(location_city, location_state, location_country);
