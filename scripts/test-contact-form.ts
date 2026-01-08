/**
 * Test the contact form submission
 */

import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

import { submitContactForm } from '../app/actions/submit-form';

async function testContactForm() {
  console.log('\n📧 Testing contact form submission...\n');

  const testData = {
    name: "Test Contact",
    email: "test@example.com",
    phone: "602-555-1234",
    eventType: "Birthday Party",
    message: "This is a test message from the contact form to verify emails are working.",
  };

  console.log('Submitting test contact form...');

  const result = await submitContactForm(testData);

  if (result.success) {
    console.log('\n✅ Contact form submitted successfully!');
    console.log('📬 Check partylabaz@gmail.com for the contact form email.');
  } else {
    console.log('\n❌ Contact form failed!');
    console.log('Error:', result.error);
  }
}

testContactForm();
