"use server";

import { supabase } from "@/lib/supabase";
import type { BookingData } from "@/types/booking";

export async function createBooking(bookingData: BookingData, paymentIntentId: string) {
  try {
    if (!bookingData.product || !bookingData.package || !bookingData.customer || !bookingData.date || !bookingData.timeBlock) {
      return {
        success: false,
        error: "Missing required booking information",
      };
    }

    // Parse time block
    const [startTime, endTime] = bookingData.timeBlock.split("-");

    // Insert booking into Supabase (RLS temporarily disabled)
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        product: bookingData.product,
        package: bookingData.package,
        event_date: bookingData.date,
        event_time_start: startTime,
        event_time_end: endTime,
        customer_name: bookingData.customer.name,
        customer_email: bookingData.customer.email,
        customer_phone: bookingData.customer.phone,
        event_address: bookingData.customer.address,
        event_type: bookingData.customer.eventType,
        addon_playlist_projector: bookingData.addOns.playlistProjector,
        addon_red_ropes_carpet: bookingData.addOns.redRopesCarpet,
        addon_extra_hour: bookingData.addOns.extraHour,
        addon_glow_bags: bookingData.addOns.glowBags,
        subtotal: bookingData.pricing.subtotal,
        booking_fee: bookingData.pricing.bookingFee,
        total: bookingData.pricing.total,
        stripe_payment_intent_id: paymentIntentId,
        payment_status: "paid",
        booking_status: "confirmed",
        special_requests: bookingData.customer.specialRequests || null,
        space_type: bookingData.customer.spaceType,
        power_source: bookingData.customer.powerSource,
        wifi_music_access: bookingData.customer.wifiMusicAccess,
        surface_type: bookingData.customer.surfaceType,
        access_path: bookingData.customer.accessPath,
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return {
        success: false,
        error: "Failed to create booking in database",
      };
    }

    return {
      success: true,
      bookingId: data.id,
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}
