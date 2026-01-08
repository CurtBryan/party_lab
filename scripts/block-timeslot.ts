/**
 * Block a time slot in the database
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

async function blockTimeSlot() {
  console.log('\n🚫 Blocking time slot...\n');

  // Create a blocked booking for January 10th, 2026, 1:30 PM - 5:30 PM
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      product: 'BLOCKED',
      package: 'TIME SLOT BLOCKED',
      event_date: '2026-01-10',
      event_time_start: '13:30:00',
      event_time_end: '17:30:00',
      customer_name: 'Admin Block',
      customer_email: 'partylabaz@gmail.com',
      customer_phone: '6027995856',
      event_address: 'N/A - Time Slot Blocked',
      event_type: 'Admin Block',
      addon_playlist_projector: false,
      addon_red_ropes_carpet: false,
      addon_extra_hour: false,
      addon_glow_bags: false,
      subtotal: 0,
      booking_fee: 0,
      total: 0,
      stripe_payment_intent_id: 'admin_block_' + Date.now(),
      payment_status: 'blocked',
      booking_status: 'blocked',
      special_requests: 'Time slot blocked by admin',
      space_type: 'N/A',
      power_source: 'N/A',
      wifi_music_access: 'N/A',
      surface_type: 'N/A',
      access_path: 'N/A',
    })
    .select()
    .single();

  if (error) {
    console.error('❌ Error blocking time slot:', error);
    return;
  }

  console.log('✅ Time slot blocked successfully!');
  console.log('─'.repeat(60));
  console.log('Date: Saturday, January 10, 2026');
  console.log('Time: 1:30 PM - 5:30 PM (13:30 - 17:30)');
  console.log('Booking ID:', data.id);
  console.log('Status:', data.booking_status);
  console.log('\nThis time slot is now unavailable for customer bookings.');
  console.log('─'.repeat(60));
}

blockTimeSlot();
