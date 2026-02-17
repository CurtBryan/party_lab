-- Migration: Add hear_about_us column to bookings table
-- Date: 2026-02-16
-- Description: Track how customers found Partylab (Facebook, Instagram, Google, Referral, Other)

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS hear_about_us TEXT;

-- Add comment for documentation
COMMENT ON COLUMN bookings.hear_about_us IS 'How the customer heard about Partylab (Facebook, Instagram, Google, Referral, Other)';
