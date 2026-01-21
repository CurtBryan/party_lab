-- ============================================================================
-- Database Migration - January 21, 2026
-- Purpose: Add extra hours and trip charge columns to bookings table
-- ============================================================================
-- Run this in your Supabase SQL Editor BEFORE deploying to production
-- Supabase Dashboard: https://fsguskmmyjxcecibebbs.supabase.co
-- ============================================================================

-- Add extra_hours column (stores number of hours beyond the included 3 hours)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS extra_hours INTEGER DEFAULT 0;

-- Add extra_hours_cost column (stores the tiered pricing cost: $50 first, $75 additional)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS extra_hours_cost DECIMAL(10,2) DEFAULT 0;

-- Add trip_charge column (stores $50 trip charge for locations 25-50 miles away)
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS trip_charge DECIMAL(10,2) DEFAULT 0;

-- Add comments for documentation
COMMENT ON COLUMN bookings.extra_hours IS 'Number of hours beyond the included 3 hours';
COMMENT ON COLUMN bookings.extra_hours_cost IS 'Cost for extra hours: $50 for first hour, $75 for each additional hour';
COMMENT ON COLUMN bookings.trip_charge IS 'Trip charge: $50 for events 25-50 miles from base location';

-- ============================================================================
-- Verification Query
-- ============================================================================
-- Run this to verify the columns were added successfully:

SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'bookings'
  AND column_name IN ('extra_hours', 'extra_hours_cost', 'trip_charge')
ORDER BY column_name;

-- Expected output:
-- extra_hours       | integer         | 0
-- extra_hours_cost  | numeric         | 0
-- trip_charge       | numeric         | 0

-- ============================================================================
-- Test Query (Optional)
-- ============================================================================
-- After deploying and a few bookings come in, verify the data:

SELECT
  id,
  product,
  event_date,
  extra_hours,
  extra_hours_cost,
  trip_charge,
  subtotal,
  total
FROM bookings
WHERE extra_hours > 0 OR trip_charge > 0
ORDER BY created_at DESC
LIMIT 10;

-- ============================================================================
-- Migration Complete!
-- ============================================================================
