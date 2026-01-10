import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecentBookings() {
  console.log('Fetching recent bookings...\n');

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching bookings:', error);
    return;
  }

  if (!bookings || bookings.length === 0) {
    console.log('No bookings found.');
    return;
  }

  console.log(`Found ${bookings.length} recent booking(s):\n`);

  bookings.forEach((booking, index) => {
    console.log(`--- Booking ${index + 1} ---`);
    console.log(`ID: ${booking.id}`);
    console.log(`Created: ${booking.created_at}`);
    console.log(`Customer: ${booking.customer_name}`);
    console.log(`Email: ${booking.customer_email}`);
    console.log(`Phone: ${booking.customer_phone}`);
    console.log(`Product: ${booking.product}`);
    console.log(`Package: ${booking.package}`);
    console.log(`Event Date: ${booking.event_date}`);
    console.log(`Event Time: ${booking.event_time_start} - ${booking.event_time_end}`);
    console.log(`Address: ${booking.event_address}`);
    console.log(`Event Type: ${booking.event_type}`);
    console.log(`Subtotal: $${booking.subtotal}`);
    console.log(`Booking Fee: $${booking.booking_fee}`);
    console.log(`Total: $${booking.total}`);
    console.log(`Payment Status: ${booking.payment_status}`);
    console.log(`Booking Status: ${booking.booking_status}`);
    console.log(`Stripe Payment Intent: ${booking.stripe_payment_intent_id}`);
    console.log('');
  });
}

checkRecentBookings();
