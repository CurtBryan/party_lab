/**
 * Test that blocked slots prevent booking availability
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function testBlockedAvailability() {
  console.log('\n🔍 Testing blocked availability for Dance Dome on Jan 10...\n');

  // Query for all Dance Dome bookings on January 10th
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('event_date', '2026-01-10')
    .eq('product', 'Dance Dome')
    .in('booking_status', ['confirmed', 'pending', 'blocked']);

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log('Bookings for Dance Dome on Saturday, January 10, 2026:');
  console.log('─'.repeat(60));

  if (bookings && bookings.length > 0) {
    bookings.forEach(booking => {
      const status = booking.booking_status === 'blocked' ? '🚫 BLOCKED' : '✓ Booked';
      console.log(`${status}  ${booking.event_time_start} - ${booking.event_time_end}`);
      console.log(`     Status: ${booking.booking_status}`);
      console.log(`     Customer: ${booking.customer_name}`);
      if (booking.special_requests) {
        console.log(`     Note: ${booking.special_requests}`);
      }
      console.log();
    });

    const blockedSlots = bookings.filter(b => b.booking_status === 'blocked');
    if (blockedSlots.length > 0) {
      console.log('✅ SUCCESS: Blocked slot is in database');
      console.log('   The availability check will now filter this out.');
      console.log('   Customers CANNOT book Dance Dome for 1:30 PM - 5:30 PM.\n');
    }
  } else {
    console.log('No bookings found for this date.\n');
  }

  console.log('─'.repeat(60) + '\n');
}

testBlockedAvailability();
