/**
 * Test Web3Forms API key
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function testWeb3Forms() {
  console.log('\n🧪 Testing Web3Forms API key...\n');

  const apiKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!apiKey) {
    console.log('❌ WEB3FORMS_ACCESS_KEY not found in .env.local');
    return;
  }

  console.log(`✅ API Key found: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);

  console.log('\n📧 Sending test email...');

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      access_key: apiKey,
      subject: "Test Email from Partylab",
      from_name: "The Partylab",
      name: "Test User",
      email: "partylabaz@gmail.com",
      message: "This is a test email to verify Web3Forms is working correctly.",
    }),
  });

  const result = await response.json();

  console.log('\n📊 Response from Web3Forms:');
  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    console.log('\n✅ Email sent successfully!');
    console.log('   Check partylabaz@gmail.com for the test email.');
  } else {
    console.log('\n❌ Email failed to send!');
    console.log('   Error:', result.message || 'Unknown error');
  }
}

testWeb3Forms();
