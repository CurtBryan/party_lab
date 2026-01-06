"use server";

import { supabaseServer } from "@/lib/supabase-server";
import { TIME_BLOCKS } from "@/lib/constants";

export async function checkAvailability(date: string, product: string) {
  try {
    // Query 1: Get all bookings for this date and product
    const { data: bookings, error: bookingsError } = await supabaseServer
      .from("bookings")
      .select("event_time_start, event_time_end")
      .eq("event_date", date)
      .eq("product", product)
      .in("booking_status", ["confirmed", "pending"]); // Only active bookings

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      return { success: false, availableBlocks: [] };
    }

    // Query 2: Get all active overrides for this date
    const { data: overrides, error: overridesError } = await supabaseServer
      .from("availability_overrides")
      .select("time_block, product")
      .eq("override_date", date)
      .eq("is_active", true);

    if (overridesError) {
      console.error("Error fetching overrides:", overridesError);
      return { success: false, availableBlocks: [] };
    }

    // Determine which time blocks are available
    const availableBlocks = TIME_BLOCKS.filter((block) => {
      const blockStart = block.value.split("-")[0]; // e.g., "10" from "10-1"
      const blockEnd = block.value.split("-")[1]; // e.g., "1" from "10-1"

      // Check if this block is manually overridden
      const isOverridden = overrides?.some((override) => {
        // Override applies to all products or this specific product
        const productMatches = !override.product || override.product === product;
        // Override applies to all time blocks (null) or this specific block
        const blockMatches = !override.time_block || override.time_block === block.value;
        return productMatches && blockMatches;
      });

      if (isOverridden) {
        return false; // Block is manually disabled
      }

      // Check if this block conflicts with any existing bookings
      // Add 30-minute buffer for setup/teardown
      const hasConflict = bookings?.some((booking) => {
        const bookingStart = booking.event_time_start;
        const bookingEnd = booking.event_time_end;

        // Simple time overlap check
        // This is a basic implementation - you may want to enhance this
        // to properly handle the 30-minute buffer and time parsing
        return (
          (blockStart >= bookingStart && blockStart < bookingEnd) ||
          (blockEnd > bookingStart && blockEnd <= bookingEnd) ||
          (blockStart <= bookingStart && blockEnd >= bookingEnd)
        );
      });

      return !hasConflict; // Available if no conflict
    });

    return {
      success: true,
      availableBlocks: availableBlocks.map((block) => block.value),
    };
  } catch (error) {
    console.error("Error checking availability:", error);
    return { success: false, availableBlocks: [] };
  }
}
