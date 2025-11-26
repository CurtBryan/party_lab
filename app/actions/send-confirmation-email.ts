"use server";

import type { BookingData } from "@/types/booking";
import { format } from "date-fns";

export async function sendConfirmationEmail(bookingData: BookingData, bookingId: string) {
  try {
    if (!bookingData.customer || !bookingData.date || !bookingData.timeBlock) {
      return { success: false, error: "Missing customer information" };
    }

    const [startTime, endTime] = bookingData.timeBlock.split("-");
    const formattedDate = format(new Date(bookingData.date), "MMMM d, yyyy");

    // Build add-ons list
    const addOnsList = [];
    if (bookingData.addOns.playlistProjector) addOnsList.push("Playlist + Projector (+$100)");
    if (bookingData.addOns.extraHour) addOnsList.push("Extra Hour (+$75)");
    if (bookingData.addOns.glowBags) addOnsList.push("Glow-Up Party Bags (+$50)");

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

${addOnsList.length > 0 ? `ADD-ONS:\n${addOnsList.map(addon => `• ${addon}`).join('\n')}\n\n` : ''}PAYMENT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking Fee Paid: $${bookingData.pricing.bookingFee}
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

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        subject: `Booking Confirmed - ${bookingId}`,
        from_name: "The Partylab",
        name: bookingData.customer.name,
        email: bookingData.customer.email,
        message: emailBody,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return {
        success: false,
        error: "Failed to send confirmation email",
      };
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
