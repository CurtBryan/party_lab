"use server";

import { Resend } from "resend";
import type { BookingData } from "@/types/booking";
import { format } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(bookingData: BookingData, bookingId: string) {
  try {
    if (!bookingData.customer || !bookingData.date || !bookingData.timeBlock) {
      return { success: false, error: "Missing customer information" };
    }

    const [startTime, endTime] = bookingData.timeBlock.split("-");
    // Parse date as local timezone to avoid off-by-one errors
    const [year, month, day] = bookingData.date.split('-').map(Number);
    const formattedDate = format(new Date(year, month - 1, day), "MMMM d, yyyy");

    // Build add-ons list
    const addOnsList = [];
    if (bookingData.addOns.playlistProjector) addOnsList.push("Playlist + Projector (+$100)");
    if (bookingData.addOns.redRopesCarpet) addOnsList.push("Red Ropes & Carpet (+$40)");
    if (bookingData.addOns.extraHour) addOnsList.push("Extra Hour (+$75)");
    if (bookingData.addOns.glowBags) addOnsList.push("Glow-Up Party Bags (+$50)");

    // Build checklist info (all required fields)
    const checklistInfo = [
      `Space Type: ${bookingData.customer.spaceType}`,
      `Power Source: ${bookingData.customer.powerSource}`,
      `Wi-Fi/Music: ${bookingData.customer.wifiMusicAccess}`,
      `Surface: ${bookingData.customer.surfaceType}`,
      `Access Path: ${bookingData.customer.accessPath}`,
    ];

    const emailBody = `
Hi ${bookingData.customer.name},

Your booking is confirmed! 🎉

BOOKING DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking ID: ${bookingId}
Product: ${bookingData.product}
Package: ${bookingData.package}
Date: ${formattedDate}
Time: ${startTime} - ${endTime}
Location: ${bookingData.customer.address}

${addOnsList.length > 0 ? `ADD-ONS:\n${addOnsList.map(addon => `• ${addon}`).join('\n')}\n\n` : ''}PRE-EVENT READINESS INFO:
${checklistInfo.map(info => `• ${info}`).join('\n')}

PAYMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Deposit Paid: $${bookingData.pricing.bookingFee}
Remaining Balance: $${bookingData.pricing.total - bookingData.pricing.bookingFee}
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

    // Send confirmation email to customer
    const { error: customerError } = await resend.emails.send({
      from: "The Partylab <onboarding@resend.dev>",
      to: [bookingData.customer.email],
      subject: `Booking Confirmed - ${bookingId}`,
      text: emailBody,
    });

    if (customerError) {
      console.error("Failed to send customer email:", customerError);
      // Don't return - continue to send business notification
    }

    // Send notification email to business
    const businessEmailBody = `
NEW BOOKING RECEIVED!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BOOKING DETAILS:
Booking ID: ${bookingId}
Product: ${bookingData.product}
Package: ${bookingData.package}
Date: ${formattedDate}
Time: ${startTime} - ${endTime}

CUSTOMER INFO:
Name: ${bookingData.customer.name}
Email: ${bookingData.customer.email}
Phone: ${bookingData.customer.phone}
Location: ${bookingData.customer.address}
Event Type: ${bookingData.customer.eventType}
${bookingData.customer.specialRequests ? `Special Requests: ${bookingData.customer.specialRequests}\n` : ''}
${addOnsList.length > 0 ? `\nADD-ONS:\n${addOnsList.map(addon => `• ${addon}`).join('\n')}\n` : ''}
PRE-EVENT READINESS INFO:
${checklistInfo.map(info => `• ${info}`).join('\n')}

PAYMENT:
Deposit Paid: $${bookingData.pricing.bookingFee}
Remaining Balance: $${bookingData.pricing.total - bookingData.pricing.bookingFee} (Due on event date)
Total: $${bookingData.pricing.total}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Customer has been sent a confirmation email.
    `.trim();

    const { error: businessError } = await resend.emails.send({
      from: "Partylab Booking System <onboarding@resend.dev>",
      to: ["partylabaz@gmail.com"],
      subject: `🎉 New Booking: ${bookingData.customer.name} - ${formattedDate}`,
      text: businessEmailBody,
    });

    // We don't fail the booking if business notification fails, just log it
    if (businessError) {
      console.error("Failed to send business notification email:", businessError);
    }

    return { success: true };
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    return {
      success: false,
      error: "Failed to send email",
    };
  }
}
