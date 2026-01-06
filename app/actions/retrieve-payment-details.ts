"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function retrievePaymentDetails(paymentIntentId: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      success: true,
      data: {
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        created: new Date(paymentIntent.created * 1000).toISOString(),
        customerEmail: paymentIntent.receipt_email,
        metadata: paymentIntent.metadata,
      },
    };
  } catch (error) {
    console.error("Error retrieving payment intent:", error);
    return {
      success: false,
      error: "Failed to retrieve payment details",
    };
  }
}
