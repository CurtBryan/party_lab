"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  message?: string;
}) {
  try {
    const emailBody = `
NEW CONTACT FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Contact Information:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Event Type: ${formData.eventType}

${formData.message ? `Message:\n${formData.message}` : 'No additional message provided.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This inquiry was submitted via the contact form on partylabaz.com
    `.trim();

    const { error } = await resend.emails.send({
      from: "Partylab Contact Form <onboarding@resend.dev>",
      to: ["partylabaz@gmail.com"],
      replyTo: formData.email,
      subject: `New Contact: ${formData.name} - ${formData.eventType}`,
      text: emailBody,
    });

    if (error) {
      console.error("Error sending contact form:", error);
      return {
        success: false,
        error: "Failed to send message. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error submitting form:", error);
    return {
      success: false,
      error: "An error occurred. Please try again.",
    };
  }
}
