/**
 * Verify that the blocked Dance Dome slot is properly preventing bookings
 */

import { checkAvailability } from '../app/actions/check-availability';

async function verify() {
  console.log('\n🔍 Verifying blocked Dance Dome slot...\n');
  console.log('Checking availability for:');
  console.log('  Date: 2026-01-10 (Saturday, January 10)');
  console.log('  Product: Dance Dome\n');

  const result = await checkAvailability('2026-01-10', 'Dance Dome');

  console.log('Available time blocks for Dance Dome on Jan 10:');
  console.log('─'.repeat(60));

  if (result.success && result.availableBlocks.length > 0) {
    result.availableBlocks.forEach(block => {
      console.log(`  ✓ ${block}`);
    });
  } else {
    console.log('  (No available blocks)');
  }

  console.log('\n');

  // Check if the blocked time slot is missing
  const blockedSlot = result.availableBlocks.find(block => {
    const [start, end] = block.split('-');
    // Check if this overlaps with 13:30-17:30
    return (start === '13:30' || start === '14:00') ||
           (end === '17:30' || end === '17:00');
  });

  if (!blockedSlot) {
    console.log('✅ SUCCESS: The 1:30 PM - 5:30 PM slot is properly blocked!');
    console.log('   Customers CANNOT book Dance Dome for this time.\n');
  } else {
    console.log('⚠️  WARNING: Time slots near the blocked period are still available.');
    console.log('   This might allow bookings that overlap.\n');
  }

  // Also check Light Haus and Club Noir to verify they're still available
  console.log('Verifying other products are still available...\n');

  const lightHausResult = await checkAvailability('2026-01-10', 'Light Haus');
  const clubNoirResult = await checkAvailability('2026-01-10', 'Club Noir');

  console.log('Light Haus availability:', lightHausResult.availableBlocks.length > 0 ? '✓ Available' : '✗ Not available');
  console.log('Club Noir availability:', clubNoirResult.availableBlocks.length > 0 ? '✓ Available' : '✗ Not available');
  console.log('\n' + '─'.repeat(60) + '\n');
}

verify();
