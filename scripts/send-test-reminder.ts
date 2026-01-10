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

async function sendTestReminder() {
  console.log('📧 Sending TEST reminder email to partylabaz@gmail.com...\n');

  // Get Donna's Light Haus booking as an example
  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', '38ccc261-970a-4847-999b-61d610cf791b')
    .single();

  if (error || !booking) {
    console.error('Could not fetch booking');
    return;
  }

  // Parse date correctly
  const [year, month, day] = booking.event_date.split('-').map(Number);
  const formattedDate = format(new Date(year, month - 1, day), 'EEEE, MMMM d, yyyy');

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

  // Calculate arrival time
  const startHour = parseInt(booking.event_time_start.split(':')[0]);
  const startMinute = parseInt(booking.event_time_start.split(':')[1]);
  let arrivalHour = startHour;
  let arrivalMinute = startMinute - 45;

  if (arrivalMinute < 0) {
    arrivalHour -= 1;
    arrivalMinute += 60;
  }

  const arrivalAmpm = arrivalHour >= 12 ? 'PM' : 'AM';
  const arrivalDisplayHour = arrivalHour === 0 ? 12 : arrivalHour > 12 ? arrivalHour - 12 : arrivalHour;
  const estimatedArrival = `${arrivalDisplayHour}:${arrivalMinute.toString().padStart(2, '0')} ${arrivalAmpm}`;

  const addOnsList = [];
  if (booking.addon_playlist_projector) addOnsList.push('Playlist + Projector');
  if (booking.addon_red_ropes_carpet) addOnsList.push('Red Ropes & Carpet');
  if (booking.addon_extra_hour) addOnsList.push('Extra Hour');
  if (booking.addon_glow_bags) addOnsList.push('Glow-Up Party Bags');

  const checklistItems = [
    `Space Type: ${booking.space_type || 'Not provided'}`,
    `Power Source: ${booking.power_source || 'Not provided'}`,
    `Wi-Fi/Music Access: ${booking.wifi_music_access || 'Not provided'}`,
    `Surface: ${booking.surface_type || 'Not provided'}`,
    `Access Path: ${booking.access_path || 'Not provided'}`,
  ];

  const remainingBalance = booking.total - booking.booking_fee;

  // Customer version email (sent to partylab for review)
  const customerEmailBody = `
[TEST EMAIL - Customer Version]

Hi ${booking.customer_name},

We're getting ready for your party! 🎉

Your event is coming up in just 48 hours, and we wanted to send you a quick reminder with all the important details.

EVENT DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${formattedDate}
Time: ${startTime} - ${endTime}
Location: ${booking.event_address}

Product: ${booking.product}
Package: ${booking.package}
${addOnsList.length > 0 ? `Add-Ons: ${addOnsList.join(', ')}\n` : ''}
WHAT TO EXPECT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Our team will arrive between ${estimatedArrival} - ${startTime}
✅ We'll handle all setup so everything is ready for your start time
✅ Your ${booking.product} will be fully inflated and tested
✅ All lighting, sound, and entertainment will be ready to go

PRE-EVENT READINESS REMINDER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please confirm the following are ready:
${checklistItems.map(item => `• ${item}`).join('\n')}

💡 Make sure the setup area is clear of any debris, furniture, or obstacles.
💡 Have an outdoor electrical outlet accessible for our team.

PAYMENT REMINDER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Deposit Paid: $${booking.booking_fee}
Remaining Balance: $${remainingBalance}

We'll collect the remaining balance of $${remainingBalance} in person when we arrive. We accept cash, card, or digital payment.

QUESTIONS OR CHANGES?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
If you need to make any changes or have questions, please call or text us ASAP:
📞 (602) 799-5856

We're so excited to bring the nightclub experience to your celebration!

See you soon,
The Partylab Team

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The Partylab
Arizona's Premier Inflatable Nightclub for Kids
(602) 799-5856
partylabaz@gmail.com
Instagram: @partylabaz
  `.trim();

  console.log('Sending CUSTOMER VERSION to partylabaz@gmail.com...');
  const { error: customerError, data: customerData } = await resend.emails.send({
    from: 'The Partylab <onboarding@resend.dev>',
    to: ['partylabaz@gmail.com'],
    subject: `[TEST] Reminder: Your Party is in 48 Hours! 🎉`,
    text: customerEmailBody,
  });

  if (customerError) {
    console.error('❌ Failed:', customerError);
  } else {
    console.log('✅ Sent! Email ID:', customerData?.id);
  }

  // Wait 1 second
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Business version email
  const businessEmailBody = `
[TEST EMAIL - Business Version]

EVENT REMINDER - 48 HOURS OUT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 Event Date: ${formattedDate}
⏰ Event Time: ${startTime} - ${endTime}
📍 Location: ${booking.event_address}

CUSTOMER INFO:
Name: ${booking.customer_name}
Email: ${booking.customer_email}
Phone: ${booking.customer_phone}

BOOKING DETAILS:
Product: ${booking.product}
Package: ${booking.package}
${addOnsList.length > 0 ? `Add-Ons: ${addOnsList.join(', ')}\n` : ''}
ARRIVAL TIME:
Arrive between ${estimatedArrival} - ${startTime} for setup

PRE-EVENT CHECKLIST:
${checklistItems.map(item => `• ${item}`).join('\n')}

PAYMENT TO COLLECT:
Remaining Balance: $${remainingBalance} (cash/card on arrival)
Total Event Value: $${booking.total}

REMINDER SENT TO CUSTOMER: ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking ID: ${booking.id}
  `.trim();

  console.log('\nSending BUSINESS VERSION to partylabaz@gmail.com...');
  const { error: businessError, data: businessData } = await resend.emails.send({
    from: 'Partylab Reminder System <onboarding@resend.dev>',
    to: ['partylabaz@gmail.com'],
    subject: `[TEST] ⏰ EVENT IN 48 HRS: ${booking.customer_name} - ${formattedDate}`,
    text: businessEmailBody,
  });

  if (businessError) {
    console.error('❌ Failed:', businessError);
  } else {
    console.log('✅ Sent! Email ID:', businessData?.id);
  }

  console.log('\n✅ TEST COMPLETE!');
  console.log('\nCheck partylabaz@gmail.com inbox for 2 test emails:');
  console.log('1. Customer reminder (what customers will receive)');
  console.log('2. Business notification (what you will receive for each event)');
  console.log('\nIf you like the format, I can push to production!');
}

sendTestReminder();
