-- Add avatar_url column to business_profiles table
ALTER TABLE business_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Add comment to document the column
COMMENT ON COLUMN business_profiles.avatar_url IS 'URL to the business logo/avatar image stored in Vercel Blob';
