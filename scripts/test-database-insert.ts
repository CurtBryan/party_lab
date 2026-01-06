/**
 * Test script to verify database connection and insert capability
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

async function testDatabaseInsert() {
  console.log('\n🧪 Testing database connection and insert capability...\n');

  // Test 1: Check connection
  console.log('1. Testing connection...');
  const { data: testData, error: testError } = await supabase
    .from('bookings')
    .select('id')
    .limit(1);

  if (testError) {
    console.error('❌ Connection failed:', testError.message);
    return;
  }
  console.log('✅ Connection successful!\n');

  // Test 2: Try to insert a test booking
  console.log('2. Testing insert capability...');
  const testBooking = {
    product: 'Dance Dome',
    package: 'Party Starter',
    event_date: '2026-12-31',
    event_time_start: '17:00',
    event_time_end: '20:00',
    customer_name: 'TEST - DELETE ME',
    customer_email: 'test@test.com',
    customer_phone: '555-555-5555',
    event_address: '123 Test St',
    event_type: 'Test',
    addon_playlist_projector: false,
    addon_red_ropes_carpet: false,
    addon_extra_hour: false,
    addon_glow_bags: false,
    subtotal: 250,
    booking_fee: 100,
    total: 250,
    stripe_payment_intent_id: 'pi_test_' + Date.now(),
    payment_status: 'test',
    booking_status: 'test',
    special_requests: 'TEST BOOKING - DELETE ME',
    space_type: 'Test',
    power_source: 'Yes',
    wifi_music_access: 'Yes',
    surface_type: 'Test',
    access_path: 'Yes',
  };

  const { data: insertData, error: insertError } = await supabase
    .from('bookings')
    .insert(testBooking)
    .select()
    .single();

  if (insertError) {
    console.error('❌ Insert failed:', insertError);
    console.error('\nError details:');
    console.error('  Code:', insertError.code);
    console.error('  Message:', insertError.message);
    console.error('  Details:', insertError.details);
    console.error('  Hint:', insertError.hint);
    return;
  }

  console.log('✅ Insert successful!');
  console.log('   Booking ID:', insertData.id);

  // Clean up - delete the test booking
  console.log('\n3. Cleaning up test booking...');
  const { error: deleteError } = await supabase
    .from('bookings')
    .delete()
    .eq('id', insertData.id);

  if (deleteError) {
    console.error('❌ Delete failed (manual cleanup needed):', deleteError.message);
    console.log('   Please delete booking ID:', insertData.id);
  } else {
    console.log('✅ Test booking deleted\n');
  }

  console.log('✅ DATABASE IS WORKING CORRECTLY!\n');
}

testDatabaseInsert();
