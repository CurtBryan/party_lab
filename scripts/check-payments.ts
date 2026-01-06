/**
 * Script to check multiple payments
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

async function checkPayments() {
  const paymentIds = [
    'pi_3SmTIO2ObuqP5NCC0a835U0Z',
    'pi_3SmTNb2ObuqP5NCC0Nv16j48'
  ];

  console.log('\n🔍 Checking for bookings with payment IDs...\n');

  for (const paymentId of paymentIds) {
    console.log(`Payment: ${paymentId}`);

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('stripe_payment_intent_id', paymentId);

    if (error) {
      console.error(`  ❌ Error: ${error.message}`);
    } else if (!data || data.length === 0) {
      console.log(`  ❌ NO BOOKING FOUND`);
    } else {
      console.log(`  ✅ BOOKING FOUND:`);
      console.log(`     ID: ${data[0].id}`);
      console.log(`     Customer: ${data[0].customer_name} (${data[0].customer_email})`);
      console.log(`     Date: ${data[0].event_date}`);
      console.log(`     Time: ${data[0].event_time_start} - ${data[0].event_time_end}`);
    }
    console.log('');
  }
}

checkPayments();
