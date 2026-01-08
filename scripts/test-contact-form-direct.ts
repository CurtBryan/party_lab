/**
 * Test the contact form email delivery directly
 */

import * as dotenv from 'dotenv';
import * as path from 'path';
import { Resend } from 'resend';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const resend = new Resend(process.env.RESEND_API_KEY);

async function testContactForm() {
  console.log('\n📧 Testing contact form email delivery...\n');

  const testData = {
    name: "Test Contact",
    email: "test@example.com",
    phone: "602-555-1234",
    eventType: "Birthday Party",
    message: "This is a test message from the contact form to verify emails are working.",
  };

  const emailBody = `
NEW CONTACT FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contact Information:
Name: ${testData.name}
Email: ${testData.email}
Phone: ${testData.phone}
Event Type: ${testData.eventType}

${testData.message ? `Message:\n${testData.message}` : 'No additional message provided.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This inquiry was submitted via the contact form on partylabaz.com
  `.trim();

  console.log('Sending contact form email to partylabaz@gmail.com...');

  try {
    const { data, error } = await resend.emails.send({
      from: "Partylab Contact Form <onboarding@resend.dev>",
      to: ["partylabaz@gmail.com"],
      replyTo: testData.email,
      subject: `New Contact: ${testData.name} - ${testData.eventType}`,
      text: emailBody,
    });

    if (error) {
      console.log('\n❌ Contact form email failed!');
      console.log('Error:', error);
      return;
    }

    console.log('\n✅ Contact form email sent successfully!');
    console.log('   Email ID:', data?.id);
    console.log('\n📬 Check partylabaz@gmail.com for the contact form email.');
  } catch (error) {
    console.log('\n❌ Error:', error);
  }
}

testContactForm();
