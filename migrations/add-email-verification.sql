-- Migration: Add Email Verification and Password Reset Fields
-- Date: October 20, 2025
-- Description: Adds fields for email verification and password reset functionality

-- Add email verification fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token TEXT,
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;

-- Add password reset fields
ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_reset_token TEXT,
ADD COLUMN IF NOT EXISTS password_reset_expires TIMESTAMP;

-- Create indexes for better performance on token lookups
CREATE INDEX IF NOT EXISTS idx_verification_token ON users(verification_token);
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON users(password_reset_token);

-- Mark existing users as verified (optional - remove if you want them to verify)
-- UPDATE users SET email_verified = TRUE WHERE password IS NOT NULL;

COMMENT ON COLUMN users.email_verified IS 'Whether the user has verified their email address';
COMMENT ON COLUMN users.verification_token IS 'Token sent via email for email verification';
COMMENT ON COLUMN users.verification_token_expires IS 'Expiry time for the verification token (24 hours)';
COMMENT ON COLUMN users.password_reset_token IS 'Token sent via email for password reset';
COMMENT ON COLUMN users.password_reset_expires IS 'Expiry time for the password reset token (1 hour)';
