-- ============================================================================
-- Partylab Database Setup - Availability Overrides
-- ============================================================================
-- This file contains SQL to create the availability_overrides table
-- Run this in your Supabase SQL Editor: https://fsguskmmyjxcecibebbs.supabase.co

-- ============================================================================
-- 1. CREATE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS availability_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  override_date DATE NOT NULL,
  time_block TEXT,
  product TEXT,
  reason TEXT,
  is_active BOOLEAN DEFAULT TRUE
);

-- Add indexes for query performance
CREATE INDEX IF NOT EXISTS idx_overrides_date ON availability_overrides(override_date);
CREATE INDEX IF NOT EXISTS idx_overrides_active ON availability_overrides(is_active);

-- Add comment for documentation
COMMENT ON TABLE availability_overrides IS 'Manual overrides to block specific dates/times from booking';

-- ============================================================================
-- 2. USAGE EXAMPLES
-- ============================================================================
-- Use these INSERT statements as templates to block dates/times

-- Example 1: Block entire day for all products (e.g., Christmas)
INSERT INTO availability_overrides (override_date, time_block, product, reason)
VALUES ('2025-12-25', NULL, NULL, 'Christmas Day - Closed');

-- Example 2: Block specific time block for all products (e.g., morning maintenance)
INSERT INTO availability_overrides (override_date, time_block, product, reason)
VALUES ('2025-12-15', '10-1', NULL, 'Equipment maintenance');

-- Example 3: Block specific product for entire day (e.g., Dance Dome broken)
INSERT INTO availability_overrides (override_date, time_block, product, reason)
VALUES ('2025-12-20', NULL, 'Dance Dome', 'Repairs needed');

-- Example 4: Block specific product + specific time block
INSERT INTO availability_overrides (override_date, time_block, product, reason)
VALUES ('2025-12-18', '5-8', 'Light Haus', 'Private event');

-- Example 5: Block multiple dates (e.g., vacation week)
INSERT INTO availability_overrides (override_date, time_block, product, reason)
VALUES
  ('2025-12-28', NULL, NULL, 'Holiday break'),
  ('2025-12-29', NULL, NULL, 'Holiday break'),
  ('2025-12-30', NULL, NULL, 'Holiday break'),
  ('2025-12-31', NULL, NULL, 'Holiday break');

-- ============================================================================
-- 3. MANAGING OVERRIDES
-- ============================================================================

-- View all active overrides
SELECT
  override_date,
  time_block,
  product,
  reason,
  created_at
FROM availability_overrides
WHERE is_active = true
ORDER BY override_date ASC;

-- Deactivate an override (instead of deleting)
UPDATE availability_overrides
SET is_active = false
WHERE override_date = '2025-12-25';

-- Reactivate an override
UPDATE availability_overrides
SET is_active = true
WHERE override_date = '2025-12-25';

-- Delete old overrides (cleanup past dates)
DELETE FROM availability_overrides
WHERE override_date < CURRENT_DATE - INTERVAL '30 days';

-- ============================================================================
-- 4. QUICK REFERENCE
-- ============================================================================

-- TIME BLOCKS:
-- '10-1'      = 10:00 AM - 1:00 PM
-- '1:30-4:30' = 1:30 PM - 4:30 PM
-- '5-8'       = 5:00 PM - 8:00 PM

-- PRODUCTS:
-- 'Dance Dome'
-- 'Light Haus'
-- 'Club Noir'

-- OVERRIDE LOGIC:
-- time_block = NULL  → blocks entire day
-- product = NULL     → blocks all products
-- NULL + NULL        → blocks everything for that date
