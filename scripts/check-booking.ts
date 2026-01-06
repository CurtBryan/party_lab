/**
 * Script to check if a booking exists in Supabase for a payment intent
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

async function checkBooking(paymentIntentId: string) {
  console.log(`\n🔍 Checking for booking with payment intent: ${paymentIntentId}\n`);

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('stripe_payment_intent_id', paymentIntentId);

  if (error) {
    console.error("❌ Error querying Supabase:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("❌ NO BOOKING FOUND in Supabase");
    console.log("─".repeat(50));
    console.log("\n⚠️  Payment succeeded but no booking was created.\n");
  } else {
    console.log("✅ BOOKING FOUND:");
    console.log("─".repeat(50));
    console.log(JSON.stringify(data[0], null, 2));
    console.log("\n");
  }
}

const paymentIntentId = process.argv[2] || 'pi_3SliV42ObuqP5NCC1iluAXrH';
checkBooking(paymentIntentId);
