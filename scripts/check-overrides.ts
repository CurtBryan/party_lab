/**
 * Script to check availability overrides
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

async function checkOverrides() {
  console.log('\n🔍 Checking availability overrides...\n');

  const { data, error } = await supabase
    .from('availability_overrides')
    .select('*')
    .eq('is_active', true);

  if (error) {
    console.error('❌ Error querying overrides:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('✅ No active availability overrides');
  } else {
    console.log(`📊 Found ${data.length} active overrides:\n`);
    data.forEach((override, index) => {
      console.log(`${index + 1}. Override ID: ${override.id}`);
      console.log(`   Date: ${override.override_date}`);
      console.log(`   Product: ${override.product || 'ALL'}`);
      console.log(`   Time Block: ${override.time_block || 'ALL'}`);
      console.log(`   Created: ${new Date(override.created_at).toLocaleString()}`);
      console.log('');
    });
  }
}

checkOverrides();
