-- ============================================================================
-- Database Migration: Add reminder_sent_at column to bookings table
-- ============================================================================
-- Date: January 22, 2026
-- Purpose: Enable 48-hour reminder email system to track which bookings
--          have already received reminder emails
--
-- This column is required by /api/cron/send-reminders endpoint
-- ============================================================================

-- Add reminder_sent_at column to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ DEFAULT NULL;

-- Add index for query performance (cron queries by NULL values)
CREATE INDEX IF NOT EXISTS idx_bookings_reminder_sent
ON bookings(reminder_sent_at)
WHERE reminder_sent_at IS NULL;

-- Add comment for documentation
COMMENT ON COLUMN bookings.reminder_sent_at IS
'Timestamp when 48-hour reminder email was sent to customer and business. NULL means reminder not yet sent.';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that column was added successfully
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'bookings'
AND column_name = 'reminder_sent_at';

-- Expected result:
-- column_name       | data_type                   | is_nullable
-- ----------------- | --------------------------- | -----------
-- reminder_sent_at  | timestamp with time zone    | YES

-- ============================================================================
-- HOW THE REMINDER SYSTEM WORKS
-- ============================================================================

-- 1. Cron job runs daily at 10:00 AM (via /api/cron/send-reminders)
-- 2. Finds bookings for 2 days from now (48 hours)
-- 3. Filters to only bookings where reminder_sent_at IS NULL
-- 4. Sends 2 emails to partylabaz@gmail.com:
--    a) Customer reminder text (to forward)
--    b) Business notification with event details
-- 5. Updates reminder_sent_at to current timestamp
-- 6. Won't send duplicate reminders for same booking

-- ============================================================================
-- TROUBLESHOOTING
-- ============================================================================

-- If you need to resend reminders (e.g., test), reset the timestamp:
-- UPDATE bookings
-- SET reminder_sent_at = NULL
-- WHERE id = 'booking-id-here';

-- Check which bookings have received reminders:
-- SELECT
--   id,
--   customer_name,
--   event_date,
--   reminder_sent_at,
--   CASE
--     WHEN reminder_sent_at IS NULL THEN 'Not sent'
--     ELSE 'Sent on ' || TO_CHAR(reminder_sent_at, 'Mon DD, YYYY at HH:MI AM')
--   END as reminder_status
-- FROM bookings
-- WHERE event_date >= CURRENT_DATE
-- ORDER BY event_date ASC;

-- ============================================================================
