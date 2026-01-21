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
      .in("booking_status", ["confirmed", "pending", "blocked"]); // Active bookings and blocked slots

    if (bookingsError) {
      console.error("Error fetching bookings:", bookingsError);
      return { success: false, availableBlocks: [], isBlocked: false };
    }

    // IMPORTANT: If there's ANY booking for this product on this date, block the entire day
    // This prevents double bookings completely
    if (bookings && bookings.length > 0) {
      console.log(`[Availability] ${product} is already booked on ${date}. Blocking entire day.`);
      return {
        success: true,
        availableBlocks: [], // No time blocks available - entire day blocked
        isBlocked: true,
        reason: `${product} is already booked for this date`
      };
    }

    // Query 2: Get all active overrides for this date
    const { data: overrides, error: overridesError } = await supabaseServer
      .from("availability_overrides")
      .select("time_block, product")
      .eq("override_date", date)
      .eq("is_active", true);

    if (overridesError) {
      console.error("Error fetching overrides:", overridesError);
      return { success: false, availableBlocks: [], isBlocked: false };
    }

    // Check if this specific product is overridden for the entire day
    const isProductBlocked = overrides?.some((override) => {
      const productMatches = !override.product || override.product === product;
      const blocksAllTimes = !override.time_block; // NULL time_block = entire day
      return productMatches && blocksAllTimes;
    });

    if (isProductBlocked) {
      console.log(`[Availability] ${product} is manually blocked on ${date}`);
      return {
        success: true,
        availableBlocks: [],
        isBlocked: true,
        reason: "This product is unavailable on this date"
      };
    }

    // If no bookings and no blocks, all time blocks are available
    return {
      success: true,
      availableBlocks: TIME_BLOCKS.map((block) => block.value),
      isBlocked: false
    };
  } catch (error) {
    console.error("Error checking availability:", error);
    return { success: false, availableBlocks: [], isBlocked: false };
  }
}
