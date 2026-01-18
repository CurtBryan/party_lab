/**
 * Resend booking confirmation email for the manual booking
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { format } from 'date-fns';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

async function resendBookingConfirmation() {
  console.log('\n📧 RESENDING BOOKING CONFIRMATION EMAIL\n');
  console.log('═'.repeat(60));

  const bookingId = '19079440-24c4-4185-8be9-ad94e592e27a';

  // Step 1: Fetch booking from database
  console.log(`\n1️⃣ Fetching booking from database...`);
  console.log(`   Booking ID: ${bookingId}`);

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (fetchError || !booking) {
    console.error('❌ Failed to fetch booking:', fetchError);
    return;
  }

  console.log('   ✅ Booking found!');
  console.log(`   Product: ${booking.product}`);
  console.log(`   Date: ${booking.event_date}`);
  console.log(`   Time: ${booking.event_time_start} - ${booking.event_time_end}`);

  // Step 2: Format date (manual parsing to avoid timezone issues)
  const [year, month, day] = booking.event_date.split('-').map(Number);
  const formattedDate = format(new Date(year, month - 1, day), 'MMMM d, yyyy');

  // Step 3: Build email body
  console.log('\n2️⃣ Building email...');

  const emailBody = `
MANUAL BOOKING CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BOOKING DETAILS:
Booking ID: ${booking.id}
Product: ${booking.product}
Package: ${booking.package}
Date: ${formattedDate}
Time: ${booking.event_time_start} - ${booking.event_time_end}
Status: Time Slot BLOCKED

CUSTOMER INFO:
Name: ${booking.customer_name}
Email: ${booking.customer_email}
Phone: ${booking.customer_phone}
Location: ${booking.event_address}
Event Type: ${booking.event_type}

${booking.special_requests ? `Special Requests: ${booking.special_requests}\n` : ''}
PAYMENT:
Subtotal: $${booking.subtotal}
Deposit: $${booking.booking_fee}
Total: $${booking.total}
Payment Status: ${booking.payment_status}
Booking Status: ${booking.booking_status}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This time slot is now BLOCKED and unavailable for online bookings.

To remove this block, delete booking ID: ${booking.id} from the database.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The Partylab
(602) 799-5856
partylabaz@gmail.com
Instagram: @partylabaz
  `.trim();

  // Step 4: Send email
  console.log('   ✅ Email body ready');
  console.log('\n3️⃣ Sending email to partylabaz@gmail.com...');

  try {
    const { data, error: emailError } = await resend.emails.send({
      from: 'Partylab Booking System <onboarding@resend.dev>',
      to: ['partylabaz@gmail.com'],
      subject: `🚫 Time Block Created: ${booking.product} - ${formattedDate}`,
      text: emailBody,
    });

    if (emailError) {
      console.error('   ❌ Email send FAILED');
      console.error('   Error:', emailError);
      return { success: false, error: emailError };
    }

    console.log('   ✅ Email sent successfully!');
    console.log(`   Email ID: ${data?.id}`);

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('✅ BOOKING CONFIRMATION EMAIL SENT');
    console.log('═'.repeat(60));

    console.log('\n📊 Summary:');
    console.log(`   ✓ Booking: ${booking.product} on ${formattedDate}`);
    console.log(`   ✓ Time: ${booking.event_time_start} - ${booking.event_time_end}`);
    console.log(`   ✓ Email sent to: partylabaz@gmail.com`);
    console.log(`   ✓ Email ID: ${data?.id}`);

    console.log('\n📧 Check Your Email:');
    console.log('   Subject: 🚫 Time Block Created: Dance Dome - January 24, 2026');
    console.log('   Should arrive in 10-30 seconds');
    console.log('   Check spam folder if not in inbox');

    console.log('\n');

    return { success: true, emailId: data?.id };

  } catch (error) {
    console.error('   ❌ Unexpected error:', error);
    return { success: false, error };
  }
}

resendBookingConfirmation().catch(console.error);
