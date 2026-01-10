import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function addReminderField() {
  console.log('Adding reminder_sent_at field to bookings table...\n');

  try {
    // First, let's check if we can access the table
    const { data: testData, error: testError } = await supabase
      .from('bookings')
      .select('id')
      .limit(1);

    if (testError) {
      console.error('Error accessing bookings table:', testError);
      return;
    }

    console.log('✅ Successfully connected to bookings table');
    console.log('');
    console.log('⚠️  I need to use the Supabase SQL Editor for this.');
    console.log('');
    console.log('Please follow these steps:');
    console.log('');
    console.log('1. Open: https://supabase.com/dashboard/project');
    console.log('2. Select your project');
    console.log('3. Click "SQL Editor" in the left sidebar');
    console.log('4. Click "New query"');
    console.log('5. Paste this SQL command:');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('6. Click "Run" or press Cmd+Enter');
    console.log('7. You should see "Success. No rows returned"');
    console.log('');
    console.log('✅ Then the database will be ready for reminders!');

  } catch (error) {
    console.error('Error:', error);
  }
}

addReminderField();
