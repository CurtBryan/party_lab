"use server";

import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function createPaymentIntent(amount: number) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: "usd",
      payment_method_types: [
        "card",           // Credit/debit cards
        "link",           // Stripe Link (one-click checkout)
        "us_bank_account", // ACH Direct Debit (bank account payments)
        "cashapp",        // Cash App Pay
      ],
      // Apple Pay and Google Pay are automatically included with "card"
      statement_descriptor_suffix: "DEPOSIT", // Shows on customer's bank statement
      description: "PartyLab Event Deposit",
    });

    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return {
      success: false,
      error: "Failed to create payment intent",
    };
  }
}
