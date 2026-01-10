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

  // Add the reminder_sent_at column
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      ALTER TABLE bookings
      ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;
    `
  });

  if (error) {
    // Try alternative method using raw SQL
    console.log('Trying alternative method...');

    // Since we can't execute raw SQL directly, let's just log instructions
    console.log('⚠️  Please run this SQL in your Supabase dashboard:\n');
    console.log('ALTER TABLE bookings ADD COLUMN IF NOT EXISTS reminder_sent_at TIMESTAMPTZ;');
    console.log('\nSteps:');
    console.log('1. Go to https://supabase.com');
    console.log('2. Select your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Run the SQL command above');
    console.log('5. Click "Run"');
  } else {
    console.log('✅ Successfully added reminder_sent_at field!');
  }
}

addReminderField();
