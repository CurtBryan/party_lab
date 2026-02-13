-- ============================================================================
-- Database Migration - January 30, 2026
-- Purpose: Add playlist_request column to bookings table
-- ============================================================================
-- Run this in your Supabase SQL Editor BEFORE deploying to production
-- Supabase Dashboard: https://fsguskmmyjxcecibebbs.supabase.co
-- ============================================================================

-- Add playlist_request column (free-text playlist preference for Glow Getter / All-Star VIP packages)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS playlist_request TEXT DEFAULT null;

-- Add comment for documentation
COMMENT ON COLUMN bookings.playlist_request IS 'Customer playlist preference (optional, for Glow Getter and All-Star VIP packages)';

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Run this to verify the column was added successfully:

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
  AND column_name = 'playlist_request';

-- Expected output:
-- playlist_request  | text  | NULL

-- ============================================================================
-- Migration Complete!
-- ============================================================================
