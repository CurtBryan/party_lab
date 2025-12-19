"use server";

export async function submitContactForm(formData: {
  name: string;
  email: string;
  phone: string;
  eventType: string;
  message?: string;
}) {
  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_ACCESS_KEY,
        ...formData,
      }),
    });

    const result = await response.json();

    if (!result.success) {
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
