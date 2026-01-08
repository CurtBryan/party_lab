/**
 * Resend confirmation email for a specific booking
 */

import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { format } from 'date-fns';
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

const resend = new Resend(process.env.RESEND_API_KEY);

async function resendConfirmationEmail(bookingId: string) {
  console.log(`\n📧 Fetching booking ${bookingId}...\n`);

  // Fetch the booking from database
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', bookingId)
    .single();

  if (error || !booking) {
    console.log('❌ Booking not found:', error?.message);
    return;
  }

  console.log('✅ Booking found:');
  console.log(`   Customer: ${booking.customer_name}`);
  console.log(`   Email: ${booking.customer_email}`);
  console.log(`   Date: ${booking.event_date}`);
  console.log(`   Product: ${booking.product}`);

  // Format the data
  const formattedDate = format(new Date(booking.event_date), "MMMM d, yyyy");
  const [startHour, startMin] = booking.event_time_start.split(':');
  const [endHour, endMin] = booking.event_time_end.split(':');
  const startTime = `${startHour}:${startMin}`;
  const endTime = `${endHour}:${endMin}`;

  // Build add-ons list
  const addOnsList = [];
  if (booking.addon_playlist_projector) addOnsList.push("Playlist + Projector (+$100)");
  if (booking.addon_red_ropes_carpet) addOnsList.push("Red Ropes & Carpet (+$40)");
  if (booking.addon_extra_hour) addOnsList.push("Extra Hour (+$75)");
  if (booking.addon_glow_bags) addOnsList.push("Glow-Up Party Bags (+$50)");

  // Build checklist info
  const checklistInfo = [
    `Space Type: ${booking.space_type || 'N/A'}`,
    `Power Source: ${booking.power_source || 'N/A'}`,
    `Wi-Fi/Music: ${booking.wifi_music_access || 'N/A'}`,
    `Surface: ${booking.surface_type || 'N/A'}`,
    `Access Path: ${booking.access_path || 'N/A'}`,
  ];

  const emailBody = `
Hi ${booking.customer_name},

Your booking is confirmed! 🎉

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking ID: ${bookingId}
Product: ${booking.product}
Package: ${booking.package}
Date: ${formattedDate}
Time: ${startTime} - ${endTime}
Location: ${booking.event_address}

${addOnsList.length > 0 ? `ADD-ONS:\n${addOnsList.map(addon => `• ${addon}`).join('\n')}\n\n` : ''}PRE-EVENT READINESS INFO:
${checklistInfo.map(info => `• ${info}`).join('\n')}

PAYMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Deposit Paid: $${booking.booking_fee}
Remaining Balance: $${booking.total - booking.booking_fee}
  (Due on event date)

NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. We'll arrive 30 minutes before your event for setup
2. All equipment will be ready for your start time
3. We'll handle teardown after your event ends

Questions? Call us at (602) 799-5856 or reply to this email.

Thanks for choosing The Partylab!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The Partylab
Arizona's Premier Inflatable Nightclub for Kids
(602) 799-5856
partylabaz@gmail.com
Instagram: @partylabaz
  `.trim();

  console.log('\n📤 Sending confirmation email to customer...');

  // Send to customer
  const { error: customerError } = await resend.emails.send({
    from: "The Partylab <onboarding@resend.dev>",
    to: [booking.customer_email],
    subject: `Booking Confirmed - ${bookingId}`,
    text: emailBody,
  });

  if (customerError) {
    console.log('❌ Failed to send to customer:', customerError);
  } else {
    console.log(`✅ Confirmation sent to ${booking.customer_email}`);
  }

  // Business notification
  const businessEmailBody = `
NEW BOOKING RECEIVED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BOOKING DETAILS:
Booking ID: ${bookingId}
Product: ${booking.product}
Package: ${booking.package}
Date: ${formattedDate}
Time: ${startTime} - ${endTime}

CUSTOMER INFO:
Name: ${booking.customer_name}
Email: ${booking.customer_email}
Phone: ${booking.customer_phone}
Location: ${booking.event_address}
Event Type: ${booking.event_type}
${booking.special_requests ? `Special Requests: ${booking.special_requests}\n` : ''}
${addOnsList.length > 0 ? `\nADD-ONS:\n${addOnsList.map(addon => `• ${addon}`).join('\n')}\n` : ''}
PRE-EVENT READINESS INFO:
${checklistInfo.map(info => `• ${info}`).join('\n')}

PAYMENT:
Deposit Paid: $${booking.booking_fee}
Remaining Balance: $${booking.total - booking.booking_fee} (Due on event date)
Total: $${booking.total}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Customer has been sent a confirmation email.
  `.trim();

  console.log('📤 Sending notification to partylabaz@gmail.com...');

  const { error: businessError } = await resend.emails.send({
    from: "Partylab Booking System <onboarding@resend.dev>",
    to: ["partylabaz@gmail.com"],
    subject: `🎉 Booking Confirmation Resent: ${booking.customer_name} - ${formattedDate}`,
    text: businessEmailBody,
  });

  if (businessError) {
    console.log('❌ Failed to send to business:', businessError);
  } else {
    console.log('✅ Notification sent to partylabaz@gmail.com');
  }

  console.log('\n✅ Done!\n');
}

// Get booking ID from command line
const bookingId = process.argv[2];

if (!bookingId) {
  console.log('\n❌ Please provide a booking ID:');
  console.log('   npx tsx scripts/resend-confirmation-email.ts <booking-id>\n');
  process.exit(1);
}

resendConfirmationEmail(bookingId);
