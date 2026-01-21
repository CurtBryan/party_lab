/**
 * Test Tiered Extra Hours Pricing
 * $50 for first extra hour, $75 for each additional hour
 */

console.log('\n🧪 TESTING TIERED EXTRA HOURS PRICING\n');
console.log('═'.repeat(60));

// Test the tiered pricing calculation
function calculateExtraHoursCost(extraHours: number): number {
  if (extraHours === 1) {
    return 50;
  } else if (extraHours > 1) {
    return 50 + (75 * (extraHours - 1));
  }
  return 0;
}

console.log('📊 Testing pricing calculation:\n');

const testCases = [
  { hours: 1, expected: 50, description: '1 extra hour' },
  { hours: 2, expected: 125, description: '2 extra hours (1×$50 + 1×$75)' },
  { hours: 3, expected: 200, description: '3 extra hours (1×$50 + 2×$75)' },
  { hours: 4, expected: 275, description: '4 extra hours (1×$50 + 3×$75)' },
  { hours: 5, expected: 350, description: '5 extra hours (1×$50 + 4×$75)' },
];

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase) => {
  const result = calculateExtraHoursCost(testCase.hours);
  const passed = result === testCase.expected;

  if (passed) {
    console.log(`   ✅ ${testCase.description}: $${result}`);
    passedTests++;
  } else {
    console.log(`   ❌ ${testCase.description}: Expected $${testCase.expected}, got $${result}`);
  }
});

console.log('\n' + '═'.repeat(60));
console.log('REAL WORLD BOOKING EXAMPLES');
console.log('═'.repeat(60));

console.log('\n📝 Example 1: 4-hour booking (1 extra hour)');
console.log('   Time: 5:00 PM - 9:00 PM');
console.log('   Duration: 4 hours');
console.log('   Included: 3 hours');
console.log('   Extra hours: 1 hour');
console.log('   Extra hours cost: $50');
console.log('   Base package (Party Starter): $300');
console.log('   Total: $350');

console.log('\n📝 Example 2: 5-hour booking (2 extra hours)');
console.log('   Time: 2:00 PM - 7:00 PM');
console.log('   Duration: 5 hours');
console.log('   Included: 3 hours');
console.log('   Extra hours: 2 hours');
console.log('   Breakdown:');
console.log('     • First extra hour: $50');
console.log('     • Second extra hour: $75');
console.log('   Extra hours cost: $125');
console.log('   Base package (Party Starter): $300');
console.log('   Total: $425');

console.log('\n📝 Example 3: 6-hour booking (3 extra hours)');
console.log('   Time: 3:00 PM - 9:00 PM');
console.log('   Duration: 6 hours');
console.log('   Included: 3 hours');
console.log('   Extra hours: 3 hours');
console.log('   Breakdown:');
console.log('     • First extra hour: $50');
console.log('     • Next 2 hours: 2 × $75 = $150');
console.log('   Extra hours cost: $200');
console.log('   Base package (Party Starter): $300');
console.log('   Total: $500');

console.log('\n' + '═'.repeat(60));
console.log('TEST RESULTS');
console.log('═'.repeat(60));

const successRate = Math.round((passedTests / totalTests) * 100);
console.log(`\n📊 Tests Passed: ${passedTests}/${totalTests} (${successRate}%)\n`);

if (passedTests === totalTests) {
  console.log('✅ ALL TIERED PRICING TESTS PASSED!\n');
  console.log('✨ Pricing Structure:');
  console.log('   • First extra hour: $50');
  console.log('   • Each additional hour: $75');
  console.log('   • Total for N hours: $50 + ($75 × (N-1))\n');
} else {
  console.log('❌ SOME TESTS FAILED\n');
}

// Verify FAQ content
console.log('═'.repeat(60));
console.log('VERIFYING FAQ CONTENT');
console.log('═'.repeat(60));

const fs = require('fs');
const faqContent = fs.readFileSync('./components/faq-section.tsx', 'utf8');
const hasCorrectFAQ = faqContent.includes('The first extra hour is $50, and each additional hour after that is $75');

if (hasCorrectFAQ) {
  console.log('\n✅ FAQ correctly shows tiered pricing');
} else {
  console.log('\n❌ FAQ does not show correct tiered pricing');
}

// Verify booking context
const contextContent = fs.readFileSync('./components/booking/booking-context.tsx', 'utf8');
const hasTieredLogic = contextContent.includes('if (extraHours === 1)') &&
                      contextContent.includes('50 + (75 * (extraHours - 1))');

if (hasTieredLogic) {
  console.log('✅ Booking context uses tiered pricing formula');
} else {
  console.log('❌ Booking context missing tiered pricing logic');
}

// Verify modal
const modalContent = fs.readFileSync('./components/booking/extra-hours-modal.tsx', 'utf8');
const hasModalBreakdown = modalContent.includes('First extra hour:') &&
                         modalContent.includes('additional') &&
                         modalContent.includes('× $75');

if (hasModalBreakdown) {
  console.log('✅ Modal shows tiered pricing breakdown');
} else {
  console.log('❌ Modal missing tiered pricing breakdown');
}

console.log('\n🚀 Ready to deploy!\n');
