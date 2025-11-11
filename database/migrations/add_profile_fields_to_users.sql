-- Add profile fields to users table
-- Run this migration to add the new profile fields

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address VARCHAR(255),
ADD COLUMN IF NOT EXISTS firm VARCHAR(100),
ADD COLUMN IF NOT EXISTS position VARCHAR(100),
ADD COLUMN IF NOT EXISTS specialty VARCHAR(100),
ADD COLUMN IF NOT EXISTS bar_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS years_experience INT,
ADD COLUMN IF NOT EXISTS education VARCHAR(255),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Update existing records to have default values if needed
UPDATE users SET updated_at = created_at WHERE updated_at IS NULL;
