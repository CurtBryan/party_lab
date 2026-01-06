/**
 * Script to check all bookings in the database
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

async function checkAllBookings() {
  console.log('\n🔍 Checking all bookings in database...\n');

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error querying bookings:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('✅ No bookings found in database');
  } else {
    console.log(`📊 Found ${data.length} total bookings:\n`);
    data.forEach((booking, index) => {
      console.log(`${index + 1}. Booking ID: ${booking.id}`);
      console.log(`   Product: ${booking.product}`);
      console.log(`   Date: ${booking.event_date}`);
      console.log(`   Time: ${booking.event_time_start} - ${booking.event_time_end}`);
      console.log(`   Status: ${booking.booking_status}`);
      console.log(`   Customer: ${booking.customer_name}`);
      console.log(`   Created: ${new Date(booking.created_at).toLocaleString()}`);
      console.log('');
    });
  }
}

checkAllBookings();
