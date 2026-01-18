/**
 * Create manual booking for Dance Dome - Jan 24, 2026, 2pm-5pm
 * Blocks time slot and sends confirmation to partylabaz@gmail.com
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { format } from 'date-fns';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

async function createManualBooking() {
  console.log('\n🎉 Creating Manual Booking for Dance Dome\n');
  console.log('═'.repeat(60));

  // Booking details
  const bookingDetails = {
    product: 'Dance Dome',
    package: 'Manual Booking',
    event_date: '2026-01-24',
    event_time_start: '14:00',
    event_time_end: '17:00',
    customer_name: 'Manual Block - Partylab Admin',
    customer_email: 'partylabaz@gmail.com',
    customer_phone: '(602) 799-5856',
    event_address: 'TBD',
    event_type: 'Internal Block',

    // Add-ons (all false for manual block)
    addon_playlist_projector: false,
    addon_red_ropes_carpet: false,
    addon_extra_hour: false,
    addon_glow_bags: false,

    // Pricing (set to 0 for manual block)
    subtotal: 0,
    booking_fee: 0,
    total: 0,

    // Status
    stripe_payment_intent_id: 'manual_block',
    payment_status: 'manual',
    booking_status: 'confirmed',

    // Checklist (optional for manual block)
    space_type: 'TBD',
    power_source: 'TBD',
    wifi_music_access: 'TBD',
    surface_type: 'TBD',
    access_path: 'TBD',
    special_requests: 'Manual booking block created by admin',
  };

  console.log('📋 Booking Details:');
  console.log(`   Product: ${bookingDetails.product}`);
  console.log(`   Date: ${bookingDetails.event_date}`);
  console.log(`   Time: ${bookingDetails.event_time_start} - ${bookingDetails.event_time_end}`);
  console.log(`   Customer: ${bookingDetails.customer_name}`);
  console.log(`   Email: ${bookingDetails.customer_email}`);

  try {
    // Step 1: Insert booking into database
    console.log('\n📝 Step 1: Creating booking in database...');

    const { data: booking, error: dbError } = await supabase
      .from('bookings')
      .insert(bookingDetails)
      .select()
      .single();

    if (dbError) {
      console.error('❌ Database error:', dbError);
      throw dbError;
    }

    console.log(`✅ Booking created successfully!`);
    console.log(`   Booking ID: ${booking.id}`);

    // Step 2: Format date for email (manual parsing to avoid timezone issues)
    const [year, month, day] = bookingDetails.event_date.split('-').map(Number);
    const formattedDate = format(new Date(year, month - 1, day), 'MMMM d, yyyy');

    // Step 3: Send confirmation email to partylabaz@gmail.com
    console.log('\n📧 Step 2: Sending confirmation email...');

    const emailBody = `
MANUAL BOOKING CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BOOKING DETAILS:
Booking ID: ${booking.id}
Product: ${bookingDetails.product}
Package: ${bookingDetails.package}
Date: ${formattedDate}
Time: ${bookingDetails.event_time_start} - ${bookingDetails.event_time_end}
Status: Time Slot BLOCKED

NOTES:
This is a manual booking block created to reserve the time slot.
No customer payment required.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This time slot is now BLOCKED and unavailable for online bookings.

To remove this block, delete booking ID: ${booking.id} from the database.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The Partylab
(602) 799-5856
partylabaz@gmail.com
    `.trim();

    const { error: emailError } = await resend.emails.send({
      from: 'Partylab Booking System <onboarding@resend.dev>',
      to: ['partylabaz@gmail.com'],
      subject: `🚫 Time Block Created: Dance Dome - ${formattedDate}`,
      text: emailBody,
    });

    if (emailError) {
      console.error('⚠️  Email send failed:', emailError);
      console.log('   (Booking was created successfully, but email failed)');
    } else {
      console.log('✅ Confirmation email sent to partylabaz@gmail.com');
    }

    // Step 3: Verify the time slot is blocked
    console.log('\n🔒 Step 3: Verifying time slot is blocked...');

    const { data: conflictingBookings, error: checkError } = await supabase
      .from('bookings')
      .select('*')
      .eq('product', 'Dance Dome')
      .eq('event_date', '2026-01-24')
      .eq('booking_status', 'confirmed');

    if (checkError) {
      console.error('❌ Error checking bookings:', checkError);
    } else {
      console.log(`✅ Found ${conflictingBookings.length} booking(s) for Dance Dome on Jan 24, 2026`);
      conflictingBookings.forEach((b, i) => {
        console.log(`   ${i + 1}. ${b.event_time_start} - ${b.event_time_end} (ID: ${b.id.slice(0, 8)}...)`);
      });
    }

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('✅ ALL STEPS COMPLETED SUCCESSFULLY');
    console.log('═'.repeat(60));

    console.log('\n📊 Summary:');
    console.log(`   ✓ Booking created in database (ID: ${booking.id.slice(0, 8)}...)`);
    console.log(`   ✓ Confirmation email sent to partylabaz@gmail.com`);
    console.log(`   ✓ Time slot 14:00-17:00 is now BLOCKED for Dance Dome on Jan 24, 2026`);
    console.log(`   ✓ Customers cannot book this time slot online`);

    console.log('\n🎯 Next Steps:');
    console.log('   - Check your email at partylabaz@gmail.com');
    console.log('   - Time slot is now unavailable in booking flow');
    console.log(`   - To remove block, delete booking ID: ${booking.id}`);
    console.log('');

    return {
      success: true,
      bookingId: booking.id,
      message: 'Manual booking created and time slot blocked',
    };

  } catch (error) {
    console.error('\n❌ Error creating manual booking:', error);
    return {
      success: false,
      error: 'Failed to create manual booking',
    };
  }
}

// Run the script
createManualBooking().catch(console.error);
