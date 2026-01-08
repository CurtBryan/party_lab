/**
 * Update the blocked time slot to specifically block Dance Dome
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

async function updateBlock() {
  console.log('\n🔄 Updating block to Dance Dome...\n');

  // Update the blocked booking to specifically block Dance Dome
  const { data, error } = await supabase
    .from('bookings')
    .update({
      product: 'Dance Dome',
      package: 'BLOCKED',
      special_requests: 'Dance Dome blocked by admin for this time slot',
    })
    .eq('event_date', '2026-01-10')
    .eq('event_time_start', '13:30:00')
    .eq('booking_status', 'blocked')
    .select()
    .single();

  if (error) {
    console.error('❌ Error updating block:', error);
    return;
  }

  console.log('✅ Block updated successfully!');
  console.log('─'.repeat(60));
  console.log('Product: Dance Dome');
  console.log('Date: Saturday, January 10, 2026');
  console.log('Time: 1:30 PM - 5:30 PM (13:30 - 17:30)');
  console.log('Booking ID:', data.id);
  console.log('Status:', data.booking_status);
  console.log('\nDance Dome is now unavailable for this time slot.');
  console.log('Light Haus and Club Noir are still available.');
  console.log('─'.repeat(60));
}

updateBlock();
