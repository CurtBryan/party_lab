/**
 * Script to retrieve customer details from a Stripe payment intent
 * and check if a booking exists in Supabase
 *
 * Usage: npx tsx scripts/retrieve-customer-booking.ts <payment_intent_id>
 */

import Stripe from "stripe";
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

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

async function retrieveCustomerBooking(paymentIntentId: string) {
  try {
    console.log(`\n🔍 Retrieving payment intent: ${paymentIntentId}\n`);

    // 1. Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ['payment_method', 'latest_charge']
    });

    console.log("✅ Payment Intent Details:");
    console.log("─".repeat(50));
    console.log(`ID: ${paymentIntent.id}`);
    console.log(`Amount: $${(paymentIntent.amount / 100).toFixed(2)}`);
    console.log(`Status: ${paymentIntent.status}`);
    console.log(`Created: ${new Date(paymentIntent.created * 1000).toLocaleString()}`);
    console.log(`Description: ${paymentIntent.description}`);

    // Get customer email from payment method or charge
    let customerEmail = paymentIntent.receipt_email;
    if (!customerEmail && paymentIntent.latest_charge) {
      const charge = paymentIntent.latest_charge as Stripe.Charge;
      customerEmail = charge.billing_details?.email || null;
    }

    console.log(`Customer Email: ${customerEmail || 'Not available'}`);
    console.log(`Metadata:`, paymentIntent.metadata);
    console.log("\n");

    // 2. Check if booking exists in Supabase
    console.log("🔍 Checking Supabase for existing booking...\n");

    const { data: existingBooking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('stripe_payment_intent_id', paymentIntentId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error("❌ Error querying Supabase:", error);
    } else if (existingBooking) {
      console.log("✅ Booking FOUND in Supabase:");
      console.log("─".repeat(50));
      console.log(`Booking ID: ${existingBooking.id}`);
      console.log(`Customer Name: ${existingBooking.customer_name}`);
      console.log(`Customer Email: ${existingBooking.customer_email}`);
      console.log(`Event Date: ${existingBooking.event_date}`);
      console.log(`Status: ${existingBooking.booking_status}`);
      console.log("\n✅ No action needed - booking already exists!\n");
    } else {
      console.log("❌ NO BOOKING FOUND in Supabase");
      console.log("─".repeat(50));
      console.log("\n⚠️  ISSUE: Payment succeeded but no booking was created.");
      console.log("\n📋 Next Steps:");
      console.log("1. Contact the customer at:", customerEmail || "unknown email");
      console.log("2. Gather booking details (date, time, package, etc.)");
      console.log("3. Either:");
      console.log("   a) Manually create booking in Supabase");
      console.log("   b) Issue refund and have customer rebook (recommended)\n");

      if (paymentIntent.status === 'succeeded') {
        console.log("💡 Recommended Action: Issue refund and have customer rebook");
        console.log("   - This ensures all booking details are captured correctly");
        console.log("   - The fix is now deployed so rebooking will work properly\n");
      }
    }

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

// Get payment intent ID from command line
const paymentIntentId = process.argv[2];

if (!paymentIntentId) {
  console.error("❌ Error: Please provide a payment intent ID");
  console.error("Usage: npx tsx scripts/retrieve-customer-booking.ts <payment_intent_id>");
  process.exit(1);
}

retrieveCustomerBooking(paymentIntentId);
