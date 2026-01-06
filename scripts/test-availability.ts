/**
 * Script to test availability logic
 */

import { createClient } from '@supabase/supabase-js';
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

const TIME_BLOCKS = [
  { label: "10:00 AM - 1:00 PM", value: "10:00-13:00" },
  { label: "2:00 PM - 5:00 PM", value: "14:00-17:00" },
  { label: "5:00 PM - 8:00 PM", value: "17:00-20:00" },
];

async function testAvailability() {
  const date = "2026-01-10"; // Future date
  const product = "Dance Dome";

  console.log(`\n🧪 Testing availability for ${date}, ${product}\n`);

  // Get bookings
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("event_time_start, event_time_end")
    .eq("event_date", date)
    .eq("product", product)
    .in("booking_status", ["confirmed", "pending"]);

  console.log(`Bookings found: ${bookings?.length || 0}`);
  if (bookings && bookings.length > 0) {
    console.log(bookings);
  }

  // Check each time block
  const availableBlocks = TIME_BLOCKS.filter((block) => {
    const [blockStart, blockEnd] = block.value.split("-");

    console.log(`\nChecking ${block.label} (${blockStart} - ${blockEnd})`);

    const hasConflict = bookings?.some((booking) => {
      const bookingStart = booking.event_time_start;
      const bookingEnd = booking.event_time_end;

      const conflict = (
        (blockStart >= bookingStart && blockStart < bookingEnd) ||
        (blockEnd > bookingStart && blockEnd <= bookingEnd) ||
        (blockStart <= bookingStart && blockEnd >= bookingEnd)
      );

      if (conflict) {
        console.log(`  ❌ Conflict with booking ${bookingStart}-${bookingEnd}`);
      }

      return conflict;
    });

    if (!hasConflict) {
      console.log(`  ✅ Available!`);
    }

    return !hasConflict;
  });

  console.log(`\n📊 Result: ${availableBlocks.length}/${TIME_BLOCKS.length} blocks available`);
  console.log(`Available blocks:`, availableBlocks.map(b => b.label));
}

testAvailability();
