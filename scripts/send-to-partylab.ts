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

async function sendToPartylab() {
  console.log('Fetching customer bookings...\n');

  // Get the 3 specific bookings (Donna x2 and Grandview x1)
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*')
    .in('id', [
      '38ccc261-970a-4847-999b-61d610cf791b', // Donna - Light Haus
      '6ef300ea-2b03-4637-8646-604884e3a5c4', // Donna - Club Noir
      '8ac689dc-7ee5-4e37-b1cb-ef47d7fad4e5', // Grandview
    ])
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching bookings:', error);
    return;
  }

  if (!bookings || bookings.length === 0) {
    console.log('No bookings found.');
    return;
  }

  console.log(`Found ${bookings.length} booking(s) to send:\n`);

  for (const booking of bookings) {
    console.log(`Processing booking for ${booking.customer_name}...`);

    // Parse date correctly
    const [year, month, day] = booking.event_date.split('-').map(Number);
    const formattedDate = format(new Date(year, month - 1, day), 'MMMM d, yyyy');

    // Format times
    const formatTime = (time: string) => {
      const [hours, minutes] = time.split(':');
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

Stripe Payment Intent: ${booking.stripe_payment_intent_id}
Payment Status: ${booking.payment_status}
Booking Status: ${booking.booking_status}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT: Customer confirmation email NOT sent automatically.
Please send manual confirmation to ${booking.customer_email} until domain is verified.
    `.trim();

    try {
      console.log(`  Sending to partylabaz@gmail.com`);
      const { data, error: businessError } = await resend.emails.send({
        from: 'Partylab Booking System <onboarding@resend.dev>',
        to: ['partylabaz@gmail.com'],
        subject: `🎉 BOOKING INFO: ${booking.customer_name} - ${formattedDate} - ${booking.product}`,
        text: businessEmailBody,
      });

      if (businessError) {
        console.error(`  ❌ Failed:`, businessError);
      } else {
        console.log(`  ✅ Sent successfully (Email ID: ${data?.id})`);
      }

      // Wait 1 second between emails to avoid rate limit
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`  ❌ Error:`, error);
    }

    console.log('');
  }

  console.log('Done!');
}

sendToPartylab();
