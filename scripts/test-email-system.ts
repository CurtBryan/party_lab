/**
 * Test email system to verify Resend is working
 */

import { Resend } from 'resend';
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmailSystem() {
  console.log('\n🔍 TESTING EMAIL SYSTEM\n');
  console.log('═'.repeat(60));

  // Check if API key exists
  console.log('\n1️⃣ Checking Resend API Key...');
  const hasApiKey = !!process.env.RESEND_API_KEY;
  console.log(`   ${hasApiKey ? '✅' : '❌'} API Key ${hasApiKey ? 'found' : 'missing'}`);

  if (!hasApiKey) {
    console.log('\n❌ RESEND_API_KEY not found in .env.local');
    console.log('   Cannot send emails without API key.');
    return;
  }

  console.log(`   Key starts with: ${process.env.RESEND_API_KEY?.substring(0, 10)}...`);

  // Test 1: Send simple test email
  console.log('\n2️⃣ Sending test email to partylabaz@gmail.com...');

  try {
    const { data, error } = await resend.emails.send({
      from: 'Partylab Test <onboarding@resend.dev>',
      to: ['partylabaz@gmail.com'],
      subject: 'TEST: Email System Check',
      text: `
This is a test email to verify the Resend email system is working.

If you're seeing this, emails are being sent successfully! ✅

Test sent at: ${new Date().toLocaleString('en-US', { timeZone: 'America/Phoenix' })}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The Partylab Email System Test
      `.trim(),
    });

    if (error) {
      console.log('   ❌ Email send FAILED');
      console.log('\n   Error details:');
      console.log('   ', JSON.stringify(error, null, 2));

      // Check for common errors
      if (error.message?.includes('API key')) {
        console.log('\n   💡 Tip: Check that your RESEND_API_KEY is correct');
      }
      if (error.message?.includes('domain')) {
        console.log('\n   💡 Tip: Domain not verified. You can only send to verified emails.');
        console.log('      With unverified domain, Resend may block sends.');
      }
      if (error.message?.includes('rate limit')) {
        console.log('\n   💡 Tip: You\'ve hit the rate limit. Wait a few minutes.');
      }

      return { success: false, error };
    }

    console.log('   ✅ Email sent successfully!');
    console.log(`   Email ID: ${data?.id}`);

    // Test 2: Verify the booking email format
    console.log('\n3️⃣ Testing booking confirmation email format...');

    const bookingEmailBody = `
MANUAL BOOKING CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BOOKING DETAILS:
Booking ID: TEST-123
Product: Dance Dome
Date: January 24, 2026
Time: 14:00 - 17:00
Status: Time Slot BLOCKED

This is a TEST of the booking confirmation email format.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The Partylab
(602) 799-5856
partylabaz@gmail.com
    `.trim();

    const { data: data2, error: error2 } = await resend.emails.send({
      from: 'Partylab Booking System <onboarding@resend.dev>',
      to: ['partylabaz@gmail.com'],
      subject: '🧪 TEST: Booking Confirmation Format',
      text: bookingEmailBody,
    });

    if (error2) {
      console.log('   ❌ Booking format email FAILED');
      console.log('   Error:', error2);
      return { success: false, error: error2 };
    }

    console.log('   ✅ Booking format email sent!');
    console.log(`   Email ID: ${data2?.id}`);

    // Summary
    console.log('\n' + '═'.repeat(60));
    console.log('✅ EMAIL SYSTEM TEST COMPLETE');
    console.log('═'.repeat(60));

    console.log('\n📊 Results:');
    console.log('   ✓ Resend API key is valid');
    console.log('   ✓ Test email sent successfully');
    console.log('   ✓ Booking format email sent successfully');

    console.log('\n📧 Check Your Email:');
    console.log('   You should receive 2 test emails at partylabaz@gmail.com:');
    console.log('   1. "TEST: Email System Check"');
    console.log('   2. "🧪 TEST: Booking Confirmation Format"');

    console.log('\n⏱️  Delivery Time:');
    console.log('   - Usually arrives in 10-30 seconds');
    console.log('   - Check spam/junk folder if not in inbox');
    console.log('   - Emails from "onboarding@resend.dev" may get filtered');

    console.log('\n💡 Note:');
    console.log('   If you see these test emails, then the booking email from earlier');
    console.log('   should also have been sent. Check spam folder thoroughly.');

    console.log('\n');

    return { success: true };

  } catch (error) {
    console.log('   ❌ Unexpected error:', error);
    return { success: false, error };
  }
}

testEmailSystem().catch(console.error);
