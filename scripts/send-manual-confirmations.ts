import { Resend } from 'resend';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { format } from 'date-fns';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const resend = new Resend(process.env.RESEND_API_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function sendManualConfirmations() {
  console.log('Fetching recent customer bookings...\n');

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .neq('booking_status', 'blocked')
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false })
    .limit(2);

  if (error) {
    console.error('Error fetching bookings:', error);
    return;
  }

  if (!bookings || bookings.length === 0) {
    console.log('No bookings found.');
    return;
  }

  console.log(`Found ${bookings.length} booking(s) to process:\n`);

  for (const booking of bookings) {
    console.log(`Processing booking for ${booking.customer_name}...`);

    // Parse date correctly
    const [year, month, day] = booking.event_date.split('-').map(Number);
    const formattedDate = format(new Date(year, month - 1, day), 'MMMM d, yyyy');

    // Format times
    const formatTime = (time: string) => {
      const [hours, minutes, seconds] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      return `${displayHour}:${minutes} ${ampm}`;
    };

    const startTime = formatTime(booking.event_time_start);
    const endTime = formatTime(booking.event_time_end);

    // Build add-ons list
    const addOnsList = [];
    if (booking.addon_playlist_projector) addOnsList.push('Playlist + Projector (+$100)');
    if (booking.addon_red_ropes_carpet) addOnsList.push('Red Ropes & Carpet (+$40)');
    if (booking.addon_extra_hour) addOnsList.push('Extra Hour (+$75)');
    if (booking.addon_glow_bags) addOnsList.push('Glow-Up Party Bags (+$50)');

    // Build checklist info
    const checklistInfo = [
      `Space Type: ${booking.space_type || 'Not provided'}`,
      `Power Source: ${booking.power_source || 'Not provided'}`,
      `Wi-Fi/Music: ${booking.wifi_music_access || 'Not provided'}`,
      `Surface: ${booking.surface_type || 'Not provided'}`,
      `Access Path: ${booking.access_path || 'Not provided'}`,
    ];

    const emailBody = `
Hi ${booking.customer_name},

Your booking is confirmed! 🎉

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking ID: ${booking.id}
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

    // Send to customer
    try {
      console.log(`  Sending email to customer: ${booking.customer_email}`);
      const { error: customerError } = await resend.emails.send({
        from: 'The Partylab <onboarding@resend.dev>',
        to: [booking.customer_email],
        subject: `Booking Confirmed - ${booking.id}`,
        text: emailBody,
      });

      if (customerError) {
        console.error(`  ❌ Failed to send customer email:`, customerError);
      } else {
        console.log(`  ✅ Customer email sent successfully`);
      }
    } catch (error) {
      console.error(`  ❌ Error sending customer email:`, error);
    }

    // Send to business
    const businessEmailBody = `
NEW BOOKING RECEIVED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BOOKING DETAILS:
Booking ID: ${booking.id}
Product: ${booking.product}
Package: ${booking.package}
Date: ${formattedDate}
Time: ${startTime} - ${endTime}

CUSTOMER INFO:
Name: ${booking.customer_name}
Email: ${booking.customer_email}
Phone: ${booking.customer_phone}
Location: ${booking.event_address}
Event Type: ${booking.event_type || 'Not specified'}
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

    try {
      console.log(`  Sending email to business: partylabaz@gmail.com`);
      const { error: businessError } = await resend.emails.send({
        from: 'Partylab Booking System <onboarding@resend.dev>',
        to: ['partylabaz@gmail.com'],
        subject: `🎉 New Booking: ${booking.customer_name} - ${formattedDate}`,
        text: businessEmailBody,
      });

      if (businessError) {
        console.error(`  ❌ Failed to send business email:`, businessError);
      } else {
        console.log(`  ✅ Business email sent successfully`);
      }
    } catch (error) {
      console.error(`  ❌ Error sending business email:`, error);
    }

    console.log('');
  }

  console.log('Done!');
}

sendManualConfirmations();
