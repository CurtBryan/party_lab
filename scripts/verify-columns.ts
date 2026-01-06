/**
 * Verify columns exist by trying to select them
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

async function verifyColumns() {
  console.log('\n🔍 Verifying problematic columns exist...\n');

  const columnsToCheck = [
    'space_type',
    'power_source',
    'wifi_music_access',
    'surface_type',
    'access_path',
    'addon_red_ropes_carpet',
    'addon_glow_bags',
  ];

  for (const col of columnsToCheck) {
    const { data, error } = await supabase
      .from('bookings')
      .select(col)
      .limit(1);

    if (error) {
      console.log(`❌ ${col}: NOT FOUND or ERROR`);
      console.log(`   Error: ${error.message}`);
    } else {
      console.log(`✅ ${col}: EXISTS`);
    }
  }
}

verifyColumns();
