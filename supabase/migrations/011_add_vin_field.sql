-- Add VIN field to listings table
-- This allows for VIN lookup to auto-populate vehicle information

ALTER TABLE listings ADD COLUMN IF NOT EXISTS vin TEXT;

-- Add index for VIN lookups
CREATE INDEX IF NOT EXISTS idx_listings_vin ON listings(vin);

-- Add constraint to ensure VIN is unique (optional, but recommended)
-- ALTER TABLE listings ADD CONSTRAINT unique_vin UNIQUE (vin);

-- Update existing listings to have NULL VIN
UPDATE listings SET vin = NULL WHERE vin IS NULL;
