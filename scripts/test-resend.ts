/**
 * Test Resend email delivery
 */

import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testResend() {
  console.log('\n🧪 Testing Resend email delivery...\n');

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log('❌ RESEND_API_KEY not found in .env.local');
    return;
  }

  console.log(`✅ API Key found: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);

  console.log('\n📧 Sending test email...');

  try {
    const { data, error } = await resend.emails.send({
      from: 'The Partylab <onboarding@resend.dev>',
      to: ['partylabaz@gmail.com'],
      subject: 'Test Email from Partylab Booking System',
      text: 'This is a test email to verify Resend is working correctly!\n\nIf you receive this, emails are working! 🎉',
    });

    if (error) {
      console.log('\n❌ Email failed to send!');
      console.log('   Error:', error);
      return;
    }

    console.log('\n✅ Email sent successfully!');
    console.log('   Email ID:', data?.id);
    console.log('\n📬 Check partylabaz@gmail.com for the test email.');
    console.log('   (It may take a few seconds to arrive)');
  } catch (error) {
    console.log('\n❌ Error:', error);
  }
}

testResend();
