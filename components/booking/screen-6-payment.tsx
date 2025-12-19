"use client";

import { useState, useEffect } from "react";
import { useBooking } from "./booking-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Elements, PaymentElement, useStripe, useElements, PaymentRequestButtonElement } from "@stripe/react-stripe-js";
import { getStripe } from "@/lib/stripe";
import { createPaymentIntent } from "@/app/actions/create-payment-intent";
import { createBooking } from "@/app/actions/create-booking";
import { sendConfirmationEmail } from "@/app/actions/send-confirmation-email";
import { Loader2, CreditCard } from "lucide-react";
import { format } from "date-fns";
import type { PaymentRequest } from "@stripe/stripe-js";

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { bookingData, updateBookingId, nextStep } = useBooking();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(null);

  useEffect(() => {
    if (stripe && bookingData.pricing.bookingFee) {
      const pr = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
          label: "Booking Fee",
          amount: Math.round(bookingData.pricing.bookingFee * 100),
        },
        requestPayerName: true,
        requestPayerEmail: true,
      });

      // Check if Payment Request is available (Apple Pay, Google Pay, etc.)
      pr.canMakePayment().then((result) => {
        if (result) {
          setPaymentRequest(pr);
        }
      });

      pr.on("paymentmethod", async (ev) => {
        if (!bookingData.paymentIntentId) {
          ev.complete("fail");
          return;
        }

        // Confirm the payment with the payment method from the wallet
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          bookingData.paymentIntentId,
          { payment_method: ev.paymentMethod.id },
          { handleActions: false }
        );

        if (confirmError) {
          ev.complete("fail");
          setErrorMessage(confirmError.message || "Payment failed");
          return;
        }

        ev.complete("success");

        if (paymentIntent && paymentIntent.status === "succeeded") {
          // Create booking in database
          const bookingResult = await createBooking(bookingData, paymentIntent.id);

          if (!bookingResult.success) {
            setErrorMessage(bookingResult.error || "Failed to create booking");
            return;
          }

          // Send confirmation email
          await sendConfirmationEmail(bookingData, bookingResult.bookingId!);

          // Update booking ID and go to confirmation screen
          updateBookingId(bookingResult.bookingId!, paymentIntent.id);
          nextStep();
        }
      });
    }
  }, [stripe, bookingData.pricing.bookingFee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !bookingData.paymentIntentId) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm payment
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin,
        },
        redirect: "if_required",
      });

      if (stripeError) {
        setErrorMessage(stripeError.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Create booking in database
        const bookingResult = await createBooking(bookingData, paymentIntent.id);

        if (!bookingResult.success) {
          setErrorMessage(bookingResult.error || "Failed to create booking");
          setIsProcessing(false);
          return;
        }

        // Send confirmation email
        await sendConfirmationEmail(bookingData, bookingResult.bookingId!);

        // Update booking ID and go to confirmation screen
        updateBookingId(bookingResult.bookingId!, paymentIntent.id);
        nextStep();
      }
    } catch (error) {
      console.error("Payment error:", error);
      setErrorMessage("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="w-5 h-5 text-primary" />
          <h3 className="text-xl font-bold">Payment Details</h3>
        </div>

        {/* Apple Pay / Google Pay Button */}
        {paymentRequest && (
          <div className="mb-6">
            <PaymentRequestButtonElement options={{ paymentRequest }} />
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or pay with card</span>
              </div>
            </div>
          </div>
        )}

        <PaymentElement
          options={{
            layout: {
              type: "accordion",
              defaultCollapsed: false,
              radios: false,
              spacedAccordionItems: true,
            },
          }}
        />
      </Card>

      {errorMessage && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
          {errorMessage}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        size="lg"
        className="w-full gradient-purple-pink glow-purple text-white font-semibold text-lg py-6"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay $${bookingData.pricing.bookingFee} Booking Fee`
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Your payment is secure and encrypted. The remaining balance of $
        {bookingData.pricing.total - bookingData.pricing.bookingFee} is due on the event date.
      </p>
    </form>
  );
}

export function Screen6Payment() {
  const { bookingData, updateBookingId } = useBooking();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Create payment intent when component mounts
    const initializePayment = async () => {
      const result = await createPaymentIntent(bookingData.pricing.bookingFee);

      if (result.success && result.clientSecret && result.paymentIntentId) {
        setClientSecret(result.clientSecret);
        updateBookingId("", result.paymentIntentId);
      }

      setIsLoading(false);
    };

    initializePayment();
  }, []);

  if (!bookingData.customer || !bookingData.date || !bookingData.timeBlock) {
    return <div>Error: Missing booking information</div>;
  }

  const formattedDate = format(new Date(bookingData.date), "MMMM d, yyyy");
  const [startTime, endTime] = bookingData.timeBlock.split("-");

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4 text-glow-purple">
          Secure Payment
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Complete your booking with a secure $100 deposit
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Secure payment powered by Stripe. Digital wallets available when supported by your device.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Booking Summary */}
        <Card className="p-6 h-fit">
          <h3 className="text-xl font-bold mb-6">Booking Summary</h3>
          <div className="space-y-4 text-sm">
            <div>
              <div className="text-muted-foreground mb-1">Product</div>
              <div className="font-semibold">{bookingData.product}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Package</div>
              <div className="font-semibold">{bookingData.package}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Date & Time</div>
              <div className="font-semibold">{formattedDate}</div>
              <div className="text-muted-foreground text-xs">{startTime} - {endTime}</div>
            </div>
            <div>
              <div className="text-muted-foreground mb-1">Location</div>
              <div className="font-semibold">{bookingData.customer.address}</div>
            </div>
            {(bookingData.addOns.playlistProjector || bookingData.addOns.extraHour || bookingData.addOns.glowBags) && (
              <div>
                <div className="text-muted-foreground mb-1">Add-Ons</div>
                <ul className="space-y-1">
                  {bookingData.addOns.playlistProjector && (
                    <li className="text-xs">• Playlist + Projector (+$100)</li>
                  )}
                  {bookingData.addOns.extraHour && (
                    <li className="text-xs">• Extra Hour (+$75)</li>
                  )}
                  {bookingData.addOns.glowBags && (
                    <li className="text-xs">• Glow-Up Party Bags (+$50)</li>
                  )}
                </ul>
              </div>
            )}
            <div className="border-t border-border pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span className="font-semibold">${bookingData.pricing.subtotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Booking Fee (Due Now)</span>
                <span className="font-semibold text-primary">${bookingData.pricing.bookingFee}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border pt-2 mt-2">
                <span>Total</span>
                <span className="text-primary">${bookingData.pricing.total}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Remaining balance of ${bookingData.pricing.total - bookingData.pricing.bookingFee} due on event date
              </p>
            </div>
          </div>
        </Card>

        {/* Payment Form */}
        <div>
          {isLoading ? (
            <Card className="p-8 flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </Card>
          ) : clientSecret ? (
            <Elements
              stripe={getStripe()}
              options={{
                clientSecret,
                appearance: {
                  theme: "night",
                  variables: {
                    colorPrimary: "#8B5CF6",
                    colorBackground: "#0a0a0a",
                    colorText: "#ffffff",
                    colorDanger: "#ef4444",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <PaymentForm />
            </Elements>
          ) : (
            <Card className="p-8 text-center text-destructive">
              Failed to initialize payment. Please try again.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
