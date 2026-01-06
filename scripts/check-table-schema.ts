/**
 * Check the actual schema of the bookings table
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

async function checkSchema() {
  console.log('\n🔍 Checking bookings table schema...\n');

  // Query the information schema to get column details
  const { data, error } = await supabase
    .rpc('get_table_columns', { table_name: 'bookings' })
    .single();

  if (error) {
    console.log('Using alternative method...');

    // Alternative: Try to select with a non-existent WHERE to see schema
    const { error: schemaError } = await supabase
      .from('bookings')
      .select('*')
      .limit(0);

    if (schemaError) {
      console.error('Error:', schemaError);
    }
  }

  // Try to get first row to see structure
  const { data: sample, error: sampleError } = await supabase
    .from('bookings')
    .select('*')
    .limit(1);

  if (sampleError) {
    console.error('❌ Error fetching sample:', sampleError.message);
  } else if (sample && sample.length > 0) {
    console.log('✅ Table columns (from sample row):');
    console.log(Object.keys(sample[0]).sort().join(', '));
  } else {
    console.log('⚠️  Table exists but is empty. Columns unknown.');
    console.log('Please check Supabase dashboard → Table Editor → bookings table');
  }
}

checkSchema();
