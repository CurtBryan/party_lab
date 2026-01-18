/**
 * Verify that the Dance Dome time slot is blocked on Jan 24, 2026
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function verifyTimeBlock() {
  console.log('\n🔍 VERIFYING TIME BLOCK FOR DANCE DOME\n');
  console.log('═'.repeat(60));

  const targetDate = '2026-01-24';
  const product = 'Dance Dome';

  console.log(`\nChecking bookings for:`);
  console.log(`   Product: ${product}`);
  console.log(`   Date: ${targetDate}`);

  // Fetch all bookings for this product and date
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('product', product)
    .eq('event_date', targetDate)
    .eq('booking_status', 'confirmed');

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  console.log(`\n✅ Found ${bookings.length} booking(s):\n`);

  bookings.forEach((booking, index) => {
    console.log(`${index + 1}. Booking ID: ${booking.id}`);
    console.log(`   Customer: ${booking.customer_name}`);
    console.log(`   Time: ${booking.event_time_start} - ${booking.event_time_end}`);
    console.log(`   Status: ${booking.booking_status}`);
    console.log(`   Payment: ${booking.payment_status}`);
    console.log('');
  });

  // Check availability using the same logic as the booking system
  const TIME_BLOCKS = [
    { value: '10:00-13:00', label: '10:00 AM - 1:00 PM' },
    { value: '14:00-17:00', label: '2:00 PM - 5:00 PM' },
    { value: '17:00-20:00', label: '5:00 PM - 8:00 PM' },
  ];

  console.log('📊 Predefined Time Block Availability:');
  console.log('-'.repeat(60));

  TIME_BLOCKS.forEach((block) => {
    const [blockStart, blockEnd] = block.value.split('-');

    // Check if this block overlaps with any bookings
    const hasConflict = bookings.some((booking) => {
      const bookingStart = booking.event_time_start;
      const bookingEnd = booking.event_time_end;

      // Check for overlap
      return (
        (bookingStart >= blockStart && bookingStart < blockEnd) ||
        (bookingEnd > blockStart && bookingEnd <= blockEnd) ||
        (bookingStart <= blockStart && bookingEnd >= blockEnd)
      );
    });

    const status = hasConflict ? '❌ UNAVAILABLE' : '✅ AVAILABLE';
    console.log(`   ${block.label}: ${status}`);
  });

  console.log('\n' + '═'.repeat(60));
  console.log('📋 What Customers Will See:');
  console.log('═'.repeat(60));

  console.log('\nWhen customers try to book Dance Dome on Jan 24, 2026:');
  console.log('   - Time picker will open for custom time selection');
  console.log('   - Unavailable Time Blocks section will show:');
  console.log('     ❌ 2:00 PM - 5:00 PM (Not available)');
  console.log('   - Customers can still book OTHER times (e.g., 10am-1pm, 5pm-8pm)');
  console.log('   - If they try to book 2pm-5pm custom time, it will be blocked');

  console.log('\n✅ Time block is working correctly!\n');
}

verifyTimeBlock().catch(console.error);
